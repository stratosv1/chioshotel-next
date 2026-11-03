import "server-only";
import { neon } from "@neondatabase/serverless";
import { appendBookingNote, getBeds24WriteToken, noteDate, summarizeGuestMessage } from "@/lib/crm/booking-notes";
import type { EmailLanguage } from "@/lib/crm/email-design";
import { buildOtaMessage } from "@/lib/crm/ota-message-text";
import { isVirtualEmail } from "@/lib/crm/store";

const MESSAGES_URL = "https://api.beds24.com/v2/bookings/messages";
const WRITE_MESSAGES_URL = "https://beds24.com/api/v2/bookings/messages";
const DEFAULT_LOOKBACK_MS = 30 * 60 * 1000;
const MAX_LOOKBACK_MS = 24 * 60 * 60 * 1000;
const MAX_MESSAGES_PER_RUN = 15;
const EMAIL_IN_TEXT = /[a-z0-9._%+-]+@[a-z0-9-]+(?:\.[a-z0-9-]+)*\.[a-z]{2,}/i;

function getSql() {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) throw new Error("DATABASE_URL is not configured.");
  return neon(url);
}

function pickLanguage(language: string, country: string): EmailLanguage {
  const code = language.slice(0, 2).toLowerCase();
  if (code === "el" || code === "en" || code === "tr") return code;
  if (country === "GR" || country === "CY") return "el";
  if (country === "TR") return "tr";
  return "en";
}

export async function getOutreachStatus() {
  const sql = getSql();
  const [row] = (await sql`select ota_outreach_enabled_at from public.crm_email_settings where id`) as any[];
  const log = (await sql`select booking_id, language, status, error,
      to_char(created_at at time zone 'Europe/Athens', 'YYYY-MM-DD HH24:MI') as sent_at
    from public.crm_ota_outreach order by created_at desc limit 30`) as any[];
  return {
    enabled: Boolean(row?.ota_outreach_enabled_at),
    log: log.map((item) => ({ bookingId: item.booking_id, language: item.language, status: item.status, error: item.error, sentAt: item.sent_at })),
  };
}

/** Turning this on stamps the time: bookings received earlier never get the message. */
export async function setOutreachEnabled(enabled: boolean) {
  const sql = getSql();
  await sql`update public.crm_email_settings set ota_outreach_enabled_at = case when ${enabled}::boolean then now() else null end, updated_at = now() where id`;
}

async function sendMessage(bookingId: string, language: EmailLanguage, firstName: string) {
  const sql = getSql();
  const claimed = (await sql`insert into public.crm_ota_outreach (booking_id, language, status) values (${bookingId}, ${language}, 'sending')
    on conflict (booking_id) do update set status = 'sending', error = null where public.crm_ota_outreach.status = 'failed'
    returning booking_id`) as any[];
  if (!claimed.length) return "already_sent";
  try {
    const token = await getBeds24WriteToken();
    const response = await fetch(WRITE_MESSAGES_URL, {
      method: "POST",
      headers: { accept: "application/json", "Content-Type": "application/json", token },
      body: JSON.stringify([{ bookingId: Number(bookingId), message: buildOtaMessage(language, firstName) }]),
      cache: "no-store",
      signal: AbortSignal.timeout(12_000),
    });
    const result = await response.json().catch(() => null);
    const success = Array.isArray(result) ? result[0]?.success !== false : response.ok;
    if (!response.ok || !success) throw new Error(`Beds24 HTTP ${response.status}`);
    await sql`update public.crm_ota_outreach set status = 'sent' where booking_id = ${bookingId}`;
    return "sent";
  } catch (error) {
    const message = error instanceof Error ? error.message.slice(0, 300) : "send failed";
    await sql`update public.crm_ota_outreach set status = 'failed', error = ${message} where booking_id = ${bookingId}`;
    return "failed";
  }
}

/** Called by the Beds24 webhook. Must never break booking handling. */
export async function maybeSendOtaOutreach(params: { bookingId: string; status: string; email: string; firstName: string; language: string; country: string; masterId: string }) {
  try {
    if (!isVirtualEmail(params.email.trim().toLowerCase())) return;
    if (!["confirmed", "new"].includes(params.status.toLowerCase())) return;
    // Rooms of one group booking get a single message, on the master booking.
    if (params.masterId && params.masterId !== "0" && params.masterId !== params.bookingId) return;
    const sql = getSql();
    const [row] = (await sql`select (b.received_at >= s.ota_outreach_enabled_at and b.checkout >= current_date) as eligible
      from public.crm_email_settings s
      join public.beds24_bookings b on b.booking_id = ${params.bookingId}
      where s.id and s.ota_outreach_enabled_at is not null`) as any[];
    if (!row?.eligible) return;
    await sendMessage(params.bookingId, pickLanguage(params.language, params.country), params.firstName);
  } catch (error) {
    console.error("[ota-outreach] failed", error);
  }
}

/** One real booking, on request from staff, while the switch is still off. */
export async function sendOutreachToBooking(bookingId: string) {
  const sql = getSql();
  const [row] = (await sql`select firstname, guest_language, country from public.beds24_bookings where booking_id = ${bookingId}`) as any[];
  if (!row) throw new Error("Δεν βρέθηκε η κράτηση.");
  return sendMessage(bookingId, pickLanguage(row.guest_language ?? "", row.country ?? ""), row.firstname ?? "");
}

/** Called every 10 minutes with the last good run. Nothing new means no database access. */
export async function syncGuestMessages(sinceMs?: number) {
  const now = Date.now();
  const oldest = Math.max(sinceMs && Number.isFinite(sinceMs) ? sinceMs : now - DEFAULT_LOOKBACK_MS, now - MAX_LOOKBACK_MS);
  const token = process.env.BEDS24_API_TOKEN?.trim();
  if (!token) throw new Error("BEDS24_API_TOKEN is not configured.");
  const url = new URL(MESSAGES_URL);
  url.searchParams.set("maxAge", String(Math.ceil((now - oldest) / 1000)));
  url.searchParams.set("source", "guest");
  const response = await fetch(url, { headers: { accept: "application/json", token }, cache: "no-store", signal: AbortSignal.timeout(12_000) });
  if (!response.ok) throw new Error(`Beds24 HTTP ${response.status}`);
  const payload = (await response.json()) as any;
  // Beds24 can return older messages despite maxAge, so age is checked here too.
  // A missing or unreadable time counts as old: old messages must never reach the notes.
  const messages = (Array.isArray(payload?.data) ? payload.data : []).filter((item: any) =>
    String(item?.source ?? "") === "guest" && String(item?.message ?? "").trim() && Date.parse(String(item?.time ?? "")) >= oldest);
  return { found: messages.length, ...(await processBeds24Messages(messages)) };
}

/** Stores the messages not seen before. Known messages never reach the notes twice. */
export async function processBeds24Messages(messages: any[]) {
  const summary = { stored: 0, emails: 0, notes: 0 };
  if (!messages.length) return summary;

  const sql = getSql();
  const ids = messages.map((item: any) => `beds24:${item.id}`);
  const known = new Set(((await sql`select message_id from public.crm_guest_messages where message_id = any(${ids}::text[])`) as any[]).map((row) => row.message_id));
  const fresh = messages.filter((item: any) => !known.has(`beds24:${item.id}`)).slice(0, MAX_MESSAGES_PER_RUN);
  if (!fresh.length) return summary;

  const writeToken = await getBeds24WriteToken();
  for (const item of fresh) {
    const bookingId = String(item.bookingId);
    const body = String(item.message).trim().slice(0, 4000);
    const sentAt = String(item.time ?? "");
    const [booking] = (await sql`select lower(trim(email)) as email, firstname, lastname from public.beds24_bookings where booking_id = ${bookingId}`) as any[];
    if (!booking) continue;

    const found = body.match(EMAIL_IN_TEXT)?.[0]?.toLowerCase() ?? "";
    const realEmail = found && !isVirtualEmail(found) ? found : "";
    const note = await summarizeGuestMessage({ reply: body, date: sentAt, guest: `${booking.firstname ?? ""} ${booking.lastname ?? ""}`.trim() });

    await sql`insert into public.crm_guest_messages (message_id, booking_ids, guest_email, direction, subject, body, summary, arrival_time, sent_at)
      values (${`beds24:${item.id}`}, ${[bookingId]}::text[], ${realEmail || booking.email}, 'guest', 'Booking / Expedia', ${body}, ${note.note || null}, ${note.arrivalTime || null}, ${Number.isNaN(Date.parse(sentAt)) ? new Date().toISOString() : sentAt}::timestamptz)
      on conflict (message_id) do nothing`;
    summary.stored += 1;

    const received = noteDate(sentAt);
    if (realEmail) {
      await sql`insert into public.crm_booking_contacts (booking_id, real_email, source) values (${bookingId}, ${realEmail}, 'ota_message')
        on conflict (booking_id) do update set real_email = coalesce(nullif(public.crm_booking_contacts.real_email, ''), excluded.real_email),
          source = coalesce(public.crm_booking_contacts.source, excluded.source), updated_at = now()`;
      summary.emails += 1;
      if (await appendBookingNote(bookingId, `Email πελάτη (μήνυμα ${received}): ${realEmail}`, realEmail, writeToken) === "written") summary.notes += 1;
    }
    if (note.hasInfo && note.note) {
      if (await appendBookingNote(bookingId, `Μήνυμα πελάτη${received ? ` ${received}` : ""}: ${note.note}`, note.note, writeToken) === "written") summary.notes += 1;
    }
  }
  return summary;
}
