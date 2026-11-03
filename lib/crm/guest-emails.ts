import "server-only";
import { neon } from "@neondatabase/serverless";
import nodemailer from "nodemailer";
import { buildDailySuggestion, loadTodaySeaDay } from "@/lib/crm/daily-suggestion";
import {
  buildGuestEmail,
  EMAIL_TYPES,
  type EmailContext,
  type EmailLanguage,
  type EmailRoom,
  type EmailType,
} from "@/lib/crm/guest-email-templates";

const REPLY_TO = "vhouse.reservations@gmail.com";
const VIRTUAL_EMAIL = "@([a-z0-9-]+[.])*(booking[.]com|expedia[.]com|expediapartnercentral[.]com)$";
const MAX_SENDS_PER_RUN = 40;

function getSql() {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) throw new Error("DATABASE_URL is not configured.");
  return neon(url);
}

export type EmailSettings = { testMode: boolean; testEmail: string; enabledTypes: EmailType[] };

export async function getEmailSettings(): Promise<EmailSettings> {
  const sql = getSql();
  const [row] = (await sql`select test_mode, test_email, enabled_types from public.crm_email_settings where id`) as any[];
  return {
    testMode: row?.test_mode ?? true,
    testEmail: row?.test_email ?? "",
    enabledTypes: (row?.enabled_types ?? []).filter((type: EmailType) => EMAIL_TYPES.includes(type)),
  };
}

export async function saveEmailSettings(next: EmailSettings) {
  const sql = getSql();
  await sql`update public.crm_email_settings set test_mode = ${next.testMode}, test_email = ${next.testEmail},
    enabled_types = ${next.enabledTypes}::text[], updated_at = now() where id`;
}

export async function listEmailLog() {
  const sql = getSql();
  const rows = (await sql`select email_type, language, recipient, guest_email, mode, status, error,
      to_char(created_at at time zone 'Europe/Athens', 'YYYY-MM-DD HH24:MI') as sent_at
    from public.crm_email_log order by created_at desc limit 100`) as any[];
  return rows.map((row) => ({
    type: row.email_type, language: row.language, recipient: row.recipient, guestEmail: row.guest_email,
    mode: row.mode, status: row.status, error: row.error, sentAt: row.sent_at,
  }));
}

function athensToday() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Athens", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
}

const dayNumber = (iso: string) => Date.UTC(Number(iso.slice(0, 4)), Number(iso.slice(5, 7)) - 1, Number(iso.slice(8, 10))) / 86_400_000;

function chooseLanguage(language: string | null, country: string | null): EmailLanguage {
  if (language === "el" || language === "en" || language === "tr") return language;
  if (country === "GR" || country === "CY") return "el";
  if (country === "TR") return "tr";
  return "en";
}

function displayName(name: string | null) {
  const value = (name ?? "").trim().split(/\s+/)[0] ?? "";
  return value === value.toUpperCase() ? value.charAt(0) + value.slice(1).toLowerCase() : value;
}

export type EmailRun = "morning" | "evening" | "all";

const EVENING_TYPES: EmailType[] = ["breakfast"];

// Each type has a short window, so a missed cron run catches up the next day
// but switching a type on never reaches old bookings.
function dueTypes(today: number, checkin: number, checkout: number): EmailType[] {
  const toArrival = checkin - today;
  const toDeparture = checkout - today;
  const due: EmailType[] = [];
  if (toArrival >= 4 && toArrival <= 7) due.push("arrival");
  if (toArrival >= 1 && toArrival <= 3) due.push("chios_info");
  if (toArrival === 0) due.push("welcome");
  if (toArrival < 0 && toDeparture > 0) due.push("daily");
  if (toArrival <= 0 && toDeparture > 0) due.push("breakfast");
  if (toDeparture === 1) due.push("checkout");
  if (toDeparture >= -3 && toDeparture <= -1) due.push("thank_you");
  return due;
}

export type DueEmail = {
  key: string;
  bookingId: string;
  bookingIds: string[];
  type: EmailType;
  language: EmailLanguage;
  guestEmail: string;
  name: string;
  lastName: string;
  rooms: EmailRoom[];
  checkin: string;
  stayDay: number;
};

export async function listDueEmails(today = athensToday()): Promise<DueEmail[]> {
  const sql = getSql();
  const rows = (await sql`
    select s.booking_id, s.firstname, s.lastname, s.room, s.country, s.guest_language,
      lower(trim(coalesce(nullif(c.real_email, ''), s.email))) as email,
      o.language as override_language, o.country as override_country,
      to_char(s.checkin, 'YYYY-MM-DD') as checkin, to_char(s.checkout, 'YYYY-MM-DD') as checkout
    from public.beds24_bookings s
    left join public.crm_booking_contacts c using (booking_id)
    left join public.crm_guest_overrides o on o.email = lower(trim(coalesce(nullif(c.real_email, ''), s.email)))
    where lower(s.status) in ('confirmed', 'new')
      and coalesce(c.ignored, false) = false
      and s.checkin <= ${today}::date + 7
      and s.checkout >= ${today}::date - 3
    order by s.checkin, s.booking_id
  `) as any[];
  const excluded = new Set(((await sql`select email from public.crm_excluded_emails`) as any[]).map((row) => row.email));
  const virtual = new RegExp(VIRTUAL_EMAIL);
  const now = dayNumber(today);
  const due = new Map<string, DueEmail>();
  for (const row of rows) {
    if (!row.email || virtual.test(row.email) || excluded.has(row.email)) continue;
    for (const type of dueTypes(now, dayNumber(row.checkin), dayNumber(row.checkout))) {
      // Several rooms on one email are one guest: one email per stay, one daily per day.
      const key = `${type}:${row.email}:${row.checkin}${type === "daily" || type === "breakfast" ? `:${today}` : ""}`;
      const room = { room: row.room ?? "", checkin: row.checkin, checkout: row.checkout };
      const existing = due.get(key);
      if (existing) {
        existing.bookingIds.push(row.booking_id);
        existing.rooms.push(room);
        continue;
      }
      due.set(key, {
        key,
        bookingId: row.booking_id,
        bookingIds: [row.booking_id],
        type,
        language: chooseLanguage(row.override_language ?? row.guest_language?.slice(0, 2).toLowerCase() ?? null, row.override_country ?? row.country),
        guestEmail: row.email,
        name: displayName(row.firstname),
        lastName: (row.lastname ?? "").trim(),
        rooms: [room],
        checkin: row.checkin,
        stayDay: now - dayNumber(row.checkin),
      });
    }
  }
  return [...due.values()];
}

export async function deliverEmail(to: string, subject: string, html: string, text: string) {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!user || !pass) throw new Error("SMTP is not configured.");
  const port = Number(process.env.SMTP_PORT || "465");
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port,
    secure: port === 465,
    auth: { user, pass },
  });
  await transporter.sendMail({
    from: `"Voulamandis House" <${process.env.SMTP_FROM || user}>`,
    to,
    replyTo: REPLY_TO,
    subject,
    html,
    text,
  });
}

async function contextFor(item: Pick<DueEmail, "type" | "name" | "lastName" | "bookingIds" | "rooms" | "stayDay" | "language">, date: string, preview = false): Promise<EmailContext | null> {
  const ctx: EmailContext = { firstName: item.name, lastName: item.lastName, bookingIds: item.bookingIds, rooms: item.rooms };
  if (item.type !== "daily") return ctx;
  const seaDay = await loadTodaySeaDay(date, preview);
  const suggestion = seaDay ? buildDailySuggestion(seaDay, date, item.stayDay, item.language) : null;
  return suggestion ? { ...ctx, suggestion } : null;
}

export async function runDueEmails(run: EmailRun = "all") {
  const today = athensToday();
  const settings = await getEmailSettings();
  const summary = { due: 0, sent: 0, failed: 0, skipped: 0, testMode: settings.testMode };
  if (!settings.enabledTypes.length) return summary;
  if (settings.testMode && !settings.testEmail) throw new Error("Λείπει το δοκιμαστικό email.");

  const sql = getSql();
  const due = (await listDueEmails(today)).filter((item) => {
    if (!settings.enabledTypes.includes(item.type)) return false;
    if (run === "all") return true;
    return EVENING_TYPES.includes(item.type) === (run === "evening");
  });
  summary.due = due.length;

  for (const item of due.slice(0, MAX_SENDS_PER_RUN)) {
    const mode = settings.testMode ? "test" : "live";
    const key = settings.testMode ? `test:${today}:${item.key}` : item.key;
    const recipient = settings.testMode ? settings.testEmail : item.guestEmail;
    const ctx = await contextFor(item, today);
    if (!ctx) {
      // No forecast today: send nothing rather than a suggestion without weather.
      summary.skipped += 1;
      continue;
    }
    const claimed = (await sql`
      insert into public.crm_email_log (dedupe_key, booking_id, email_type, language, recipient, guest_email, mode, status)
      values (${key}, ${item.bookingId}, ${item.type}, ${item.language}, ${recipient}, ${item.guestEmail}, ${mode}, 'sending')
      on conflict (dedupe_key) do update set status = 'sending', error = null
        where public.crm_email_log.status = 'failed'
      returning dedupe_key
    `) as any[];
    if (!claimed.length) continue;

    const email = buildGuestEmail(item.type, item.language, ctx);
    const subject = settings.testMode ? `[ΔΟΚΙΜΗ → ${item.guestEmail}] ${email.subject}` : email.subject;
    try {
      await deliverEmail(recipient, subject, email.html, email.text);
      await sql`update public.crm_email_log set status = 'sent' where dedupe_key = ${key}`;
      summary.sent += 1;
    } catch (error) {
      const message = error instanceof Error ? error.message.slice(0, 300) : "send failed";
      await sql`update public.crm_email_log set status = 'failed', error = ${message} where dedupe_key = ${key}`;
      summary.failed += 1;
    }
  }
  return summary;
}

export async function renderPreview(type: EmailType, language: EmailLanguage) {
  const today = athensToday();
  const shift = (days: number) => new Date((dayNumber(today) + days) * 86_400_000).toISOString().slice(0, 10);
  const ctx = await contextFor({
    type,
    language,
    name: "Maria",
    lastName: "Papadopoulou",
    bookingIds: ["92640049"],
    rooms: [{ room: "Family Apartment", checkin: shift(-2), checkout: shift(3) }],
    stayDay: 2,
  }, today, true);
  return ctx ? buildGuestEmail(type, language, ctx) : null;
}

export async function sendTestEmail(type: EmailType, language: EmailLanguage, to: string) {
  const email = await renderPreview(type, language);
  if (!email) throw new Error("Δεν υπάρχει πρόγνωση καιρού αυτή τη στιγμή.");
  await deliverEmail(to, `[ΔΟΚΙΜΗ] ${email.subject}`, email.html, email.text);
}
