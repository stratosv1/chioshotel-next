import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { neon } from "@neondatabase/serverless";
import { chooseLanguage, deliverEmail } from "@/lib/crm/guest-emails";
import { buildGreetingEmail, type GreetingType } from "@/lib/crm/greeting-templates";
import { SITE_URL, type EmailLanguage } from "@/lib/crm/email-design";
import { isValidEmail, listGuests, normalizeEmail } from "@/lib/crm/store";

// Each request sends a few emails, so it stays well inside the 60s limit;
// the staff page keeps calling until everyone has it.
const BATCH_SIZE = 8;
// Gmail allows about 500 recipients a day, and the booking emails need room too.
export const GREETING_DAILY_LIMIT = 300;

function getSql() {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) throw new Error("DATABASE_URL is not configured.");
  return neon(url);
}

function athensDate() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Athens", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
}

/** A January send still belongs to the Christmas just gone. */
export function greetingYear(type: GreetingType) {
  const [year, month] = athensDate().split("-").map(Number);
  return type === "christmas" && month === 1 ? year - 1 : year;
}

const keyPrefix = (type: GreetingType, year: number) => `greeting:${type}:${year}:`;

function niceCase(value: string) {
  return value === value.toUpperCase() ? value.toLowerCase().replace(/(^|[\s-])(\p{L})/gu, (_, sep, letter) => sep + letter.toUpperCase()) : value;
}

function splitName(name: string) {
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

/** Unsubscribed guests are skipped by every greeting and campaign. */
export async function unsubscribeGuest(email: string, language: EmailLanguage) {
  const sql = getSql();
  await sql`insert into newsletter_subscribers (email, language, source, unsubscribed_at)
    values (${email}, ${language}, 'crm-unsubscribe', now())
    on conflict (email) do update set unsubscribed_at = coalesce(newsletter_subscribers.unsubscribed_at, now()), updated_at = now()`;
}

// ---- Audience and sending ---------------------------------------------------

type Recipient = { email: string; firstName: string; lastName: string; language: EmailLanguage };

async function listAudience(languages: EmailLanguage[]): Promise<Recipient[]> {
  const guests = await listGuests();
  return guests
    .filter((guest) => !guest.unsubscribed && isValidEmail(guest.email))
    .map((guest) => ({ email: guest.email, ...splitName(guest.name), language: chooseLanguage(guest.language, guest.country) }))
    .filter((guest) => languages.includes(guest.language));
}

async function loadLog(type: GreetingType, year: number) {
  const sql = getSql();
  const prefix = keyPrefix(type, year);
  const rows = (await sql`select dedupe_key, status from public.crm_email_log where dedupe_key like ${`${prefix}%`}`) as any[];
  return new Map<string, string>(rows.map((row) => [String(row.dedupe_key).slice(prefix.length), row.status]));
}

async function sentToday() {
  const sql = getSql();
  const [row] = (await sql`select count(*)::int as count from public.crm_email_log
    where email_type like 'greeting_%' and status = 'sent'
      and (created_at at time zone 'Europe/Athens')::date = ${athensDate()}::date`) as any[];
  return Number(row?.count ?? 0);
}

export type GreetingStatus = {
  type: GreetingType;
  year: number;
  byLanguage: Record<EmailLanguage, { total: number; sent: number; failed: number; waiting: number }>;
  sentToday: number;
  dailyLimit: number;
};

export async function getGreetingStatus(type: GreetingType): Promise<GreetingStatus> {
  const year = greetingYear(type);
  const [audience, log, today] = await Promise.all([listAudience(["el", "en", "tr"]), loadLog(type, year), sentToday()]);
  const empty = () => ({ total: 0, sent: 0, failed: 0, waiting: 0 });
  const byLanguage: GreetingStatus["byLanguage"] = { el: empty(), en: empty(), tr: empty() };
  for (const guest of audience) {
    const bucket = byLanguage[guest.language];
    const status = log.get(guest.email);
    bucket.total += 1;
    if (status === "sent") bucket.sent += 1;
    else if (status === "failed") bucket.failed += 1;
    else if (!status) bucket.waiting += 1;
  }
  return { type, year, byLanguage, sentToday: today, dailyLimit: GREETING_DAILY_LIMIT };
}

export async function sendGreetingBatch(type: GreetingType, languages: EmailLanguage[], retryFailed: boolean) {
  const year = greetingYear(type);
  const [audience, log, today] = await Promise.all([listAudience(languages), loadLog(type, year), sentToday()]);
  const candidates = audience.filter((guest) => {
    const status = log.get(guest.email);
    return retryFailed ? status === "failed" : !status;
  });
  const room = Math.max(0, GREETING_DAILY_LIMIT - today);
  const result = { sent: 0, failed: 0, remaining: candidates.length, limitReached: room === 0 };
  if (!room) return result;

  const sql = getSql();
  for (const guest of candidates.slice(0, Math.min(BATCH_SIZE, room))) {
    const key = `${keyPrefix(type, year)}${guest.email}`;
    const claimed = (await sql`
      insert into public.crm_email_log (dedupe_key, booking_id, email_type, language, recipient, guest_email, mode, status)
      values (${key}, null, ${`greeting_${type}`}, ${guest.language}, ${guest.email}, ${guest.email}, 'live', 'sending')
      on conflict (dedupe_key) do update set status = 'sending', error = null
        where public.crm_email_log.status = 'failed'
      returning dedupe_key
    `) as any[];
    result.remaining -= 1;
    if (!claimed.length) continue;

    const link = unsubscribeUrl(guest.email, guest.language);
    const email = buildGreetingEmail(type, guest.language, { ...guest, year, unsubscribeUrl: link });
    try {
      await deliverEmail(guest.email, email.subject, email.html, email.text, {
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
  result.limitReached = today + result.sent >= GREETING_DAILY_LIMIT && result.remaining > 0;
  return result;
}

const SAMPLE = { firstName: "Maria", lastName: "Papadopoulou" };

export function renderGreetingPreview(type: GreetingType, language: EmailLanguage) {
  return buildGreetingEmail(type, language, { ...SAMPLE, year: greetingYear(type), unsubscribeUrl: `${SITE_URL}/` });
}

export async function sendGreetingTest(type: GreetingType, language: EmailLanguage, to: string) {
  const email = buildGreetingEmail(type, language, { ...SAMPLE, year: greetingYear(type), unsubscribeUrl: unsubscribeUrl(normalizeEmail(to), language) });
  await deliverEmail(to, `[ΔΟΚΙΜΗ] ${email.subject}`, email.html, email.text);
}
