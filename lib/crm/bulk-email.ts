import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { neon } from "@neondatabase/serverless";
import { chooseLanguage, deliverEmail } from "@/lib/crm/guest-emails";
import { SITE_URL, type EmailLanguage } from "@/lib/crm/email-design";
import { isValidEmail, isVirtualEmail, listGuests, normalizeEmail } from "@/lib/crm/store";

// One contact list for greetings and newsletter campaigns. Nothing is copied:
// Beds24 guests, website sign-ups and emails added by staff (all in
// newsletter_subscribers) are merged on read. Booking.com / Expedia relay
// addresses never enter it.

// Each request sends a few emails, so it stays well inside the 60s limit;
// the staff page keeps calling until everyone has it.
const BATCH_SIZE = 8;
// Gmail allows about 500 recipients a day, and the booking emails need room too.
export const BULK_DAILY_LIMIT = 300;

export const BULK_LANGUAGES: EmailLanguage[] = ["el", "en", "tr"];

function getSql() {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) throw new Error("DATABASE_URL is not configured.");
  return neon(url);
}

export function athensDate() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Athens", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
}

function niceCase(value: string) {
  return value === value.toUpperCase() ? value.toLowerCase().replace(/(^|[\s-])(\p{L})/gu, (_, sep, letter) => sep + letter.toUpperCase()) : value;
}

export function splitName(name: string) {
  const parts = niceCase(name.trim()).split(/\s+/).filter(Boolean);
  return { firstName: parts[0] ?? "", lastName: parts.slice(1).join(" ") };
}

// ---- Unsubscribe links ------------------------------------------------------

function unsubscribeSecret() {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret) throw new Error("CRON_SECRET is not configured.");
  return secret;
}

function unsubscribeToken(email: string) {
  return createHmac("sha256", unsubscribeSecret()).update(`unsubscribe:${email}`).digest("base64url").slice(0, 32);
}

export function unsubscribeUrl(email: string, language: EmailLanguage) {
  const params = new URLSearchParams({ e: email, t: unsubscribeToken(email), l: language });
  return `${SITE_URL}/api/newsletter/unsubscribe/?${params}`;
}

export function isValidUnsubscribe(email: string, token: string) {
  if (!email || !token) return false;
  const expected = Buffer.from(unsubscribeToken(email));
  const given = Buffer.from(token);
  return expected.length === given.length && timingSafeEqual(expected, given);
}

/** Unsubscribed contacts are skipped by every greeting and campaign. */
export async function unsubscribeGuest(email: string, language: EmailLanguage) {
  const sql = getSql();
  await sql`insert into newsletter_subscribers (email, language, source, unsubscribed_at)
    values (${email}, ${language}, 'crm-unsubscribe', now())
    on conflict (email) do update set unsubscribed_at = coalesce(newsletter_subscribers.unsubscribed_at, now()), updated_at = now()`;
}

export async function resubscribeContact(email: string) {
  const sql = getSql();
  await sql`update newsletter_subscribers set unsubscribed_at = null, updated_at = now() where email = ${email}`;
}

// ---- Contact list -----------------------------------------------------------

export type ContactSource = "guest" | "website" | "staff";

export type Contact = {
  email: string;
  name: string;
  language: EmailLanguage;
  country: string | null;
  sources: ContactSource[];
  stays: number;
  unsubscribed: boolean;
};

const STAFF_SOURCES = new Set(["crm-manual", "crm-import"]);

export async function listContacts(): Promise<Contact[]> {
  const sql = getSql();
  const [guests, subscribers, overrides, excludedRows] = await Promise.all([
    listGuests(),
    sql`select email, name, language, source, unsubscribed_at is not null as unsubscribed from newsletter_subscribers` as Promise<any[]>,
    sql`select email, language from public.crm_guest_overrides where nullif(language, '') is not null` as Promise<any[]>,
    sql`select email from public.crm_excluded_emails` as Promise<any[]>,
  ]);
  const excluded = new Set(excludedRows.map((row) => normalizeEmail(row.email)));
  const languageOverride = new Map(overrides.map((row) => [normalizeEmail(row.email), String(row.language)]));
  const contacts = new Map<string, Contact & { rawLanguage: string | null }>();

  for (const guest of guests) {
    contacts.set(guest.email, {
      email: guest.email, name: guest.name, language: "en", rawLanguage: guest.language, country: guest.country,
      sources: ["guest"], stays: guest.stays, unsubscribed: guest.unsubscribed,
    });
  }
  for (const row of subscribers) {
    const email = normalizeEmail(row.email);
    const source: ContactSource | null = row.source === "crm-unsubscribe" ? null : STAFF_SOURCES.has(row.source) ? "staff" : "website";
    const existing = contacts.get(email);
    if (existing) {
      existing.unsubscribed = existing.unsubscribed || Boolean(row.unsubscribed);
      if (source && !existing.sources.includes(source)) existing.sources.push(source);
      continue;
    }
    // An unsubscribe row alone is not a contact.
    if (!source) continue;
    contacts.set(email, {
      email, name: String(row.name ?? ""), language: "en", rawLanguage: row.language, country: null,
      sources: [source], stays: 0, unsubscribed: Boolean(row.unsubscribed),
    });
  }

  return [...contacts.values()]
    .filter((contact) => isValidEmail(contact.email) && !isVirtualEmail(contact.email) && !excluded.has(contact.email))
    .map(({ rawLanguage, ...contact }) => ({
      ...contact,
      language: chooseLanguage(languageOverride.get(contact.email) ?? rawLanguage?.slice(0, 2).toLowerCase() ?? null, contact.country),
    }));
}

export type AddContactsResult = { added: number; existing: number; rejectedOta: string[]; invalid: string[] };

/** Lines like "email" or "email, name" (comma, semicolon or tab). */
export function parseContactLines(text: string) {
  return text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean).map((line) => {
    const [email, ...rest] = line.split(/[,;\t]/);
    return { email: normalizeEmail(email), name: rest.join(" ").replace(/\s+/g, " ").trim() };
  });
}

export async function addContacts(entries: { email: string; name: string }[], language: EmailLanguage, source: "crm-manual" | "crm-import"): Promise<AddContactsResult> {
  const result: AddContactsResult = { added: 0, existing: 0, rejectedOta: [], invalid: [] };
  const valid = new Map<string, string>();
  for (const entry of entries) {
    if (!isValidEmail(entry.email)) result.invalid.push(entry.email);
    else if (isVirtualEmail(entry.email)) result.rejectedOta.push(entry.email);
    else valid.set(entry.email, entry.name.slice(0, 120));
  }
  if (!valid.size) return result;
  const known = new Set((await listContacts()).map((contact) => contact.email));
  const fresh = [...valid.entries()].filter(([email]) => !known.has(email));
  result.existing = valid.size - fresh.length;
  if (!fresh.length) return result;
  const sql = getSql();
  const rows = (await sql`
    insert into newsletter_subscribers (email, name, language, source, consent_text)
    select e, nullif(n, ''), ${language}, ${source}, 'Added by staff in /staff/crm'::text
    from unnest(${fresh.map(([email]) => email)}::text[], ${fresh.map(([, name]) => name)}::text[]) as v(e, n)
    on conflict (email) do nothing
    returning email
  `) as any[];
  result.added = rows.length;
  result.existing += fresh.length - rows.length;
  return result;
}

/** A language picked by hand wins over Beds24 and the website. */
export async function setContactLanguage(email: string, language: EmailLanguage) {
  const sql = getSql();
  await sql`insert into public.crm_guest_overrides (email, language) values (${email}, ${language})
    on conflict (email) do update set language = excluded.language, updated_at = now()`;
}

// ---- Batch sending ----------------------------------------------------------

export type BulkCounts = { total: number; sent: number; failed: number; waiting: number };
export type BulkStatus = { byLanguage: Record<EmailLanguage, BulkCounts>; sentToday: number; dailyLimit: number };
export type BulkBatchResult = { sent: number; failed: number; remaining: number; limitReached: boolean };

type Recipient = { email: string; firstName: string; lastName: string; language: EmailLanguage };
type BuiltEmail = { subject: string; html: string; text: string };

async function listRecipients(languages: EmailLanguage[]): Promise<Recipient[]> {
  return (await listContacts())
    .filter((contact) => !contact.unsubscribed && languages.includes(contact.language))
    .map((contact) => ({ email: contact.email, language: contact.language, ...splitName(contact.name) }));
}

async function loadLog(prefix: string) {
  const sql = getSql();
  const rows = (await sql`select dedupe_key, status from public.crm_email_log where dedupe_key like ${`${prefix}%`}`) as any[];
  return new Map<string, string>(rows.map((row) => [String(row.dedupe_key).slice(prefix.length), row.status]));
}

async function sentToday() {
  const sql = getSql();
  const [row] = (await sql`select count(*)::int as count from public.crm_email_log
    where (email_type like 'greeting_%' or email_type like 'campaign_%') and status = 'sent'
      and (created_at at time zone 'Europe/Athens')::date = ${athensDate()}::date`) as any[];
  return Number(row?.count ?? 0);
}

/** `prefix` identifies one send (e.g. "greeting:christmas:2026:"): each contact gets it once. */
export async function getBulkStatus(prefix: string, languages: EmailLanguage[] = BULK_LANGUAGES): Promise<BulkStatus> {
  const [recipients, log, today] = await Promise.all([listRecipients(languages), loadLog(prefix), sentToday()]);
  const empty = (): BulkCounts => ({ total: 0, sent: 0, failed: 0, waiting: 0 });
  const byLanguage: BulkStatus["byLanguage"] = { el: empty(), en: empty(), tr: empty() };
  for (const recipient of recipients) {
    const bucket = byLanguage[recipient.language];
    const status = log.get(recipient.email);
    bucket.total += 1;
    if (status === "sent") bucket.sent += 1;
    else if (status === "failed") bucket.failed += 1;
    else if (!status) bucket.waiting += 1;
  }
  return { byLanguage, sentToday: today, dailyLimit: BULK_DAILY_LIMIT };
}

export async function sendBulkBatch(params: {
  prefix: string;
  emailType: string;
  languages: EmailLanguage[];
  retryFailed: boolean;
  build: (recipient: Recipient, unsubscribeLink: string) => BuiltEmail;
}): Promise<BulkBatchResult> {
  const [recipients, log, today] = await Promise.all([listRecipients(params.languages), loadLog(params.prefix), sentToday()]);
  const candidates = recipients.filter((recipient) => {
    const status = log.get(recipient.email);
    return params.retryFailed ? status === "failed" : !status;
  });
  const room = Math.max(0, BULK_DAILY_LIMIT - today);
  const result: BulkBatchResult = { sent: 0, failed: 0, remaining: candidates.length, limitReached: room === 0 };
  if (!room) return result;

  const sql = getSql();
  for (const recipient of candidates.slice(0, Math.min(BATCH_SIZE, room))) {
    const key = `${params.prefix}${recipient.email}`;
    const claimed = (await sql`
      insert into public.crm_email_log (dedupe_key, booking_id, email_type, language, recipient, guest_email, mode, status)
      values (${key}, null, ${params.emailType}, ${recipient.language}, ${recipient.email}, ${recipient.email}, 'live', 'sending')
      on conflict (dedupe_key) do update set status = 'sending', error = null
        where public.crm_email_log.status = 'failed'
      returning dedupe_key
    `) as any[];
    result.remaining -= 1;
    if (!claimed.length) continue;

    const link = unsubscribeUrl(recipient.email, recipient.language);
    const email = params.build(recipient, link);
    try {
      await deliverEmail(recipient.email, email.subject, email.html, email.text, {
        "List-Unsubscribe": `<${link}>`,
        "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
      });
      await sql`update public.crm_email_log set status = 'sent' where dedupe_key = ${key}`;
      result.sent += 1;
    } catch (error) {
      const message = error instanceof Error ? error.message.slice(0, 300) : "send failed";
      await sql`update public.crm_email_log set status = 'failed', error = ${message} where dedupe_key = ${key}`;
      result.failed += 1;
    }
  }
  result.limitReached = today + result.sent >= BULK_DAILY_LIMIT && result.remaining > 0;
  return result;
}
