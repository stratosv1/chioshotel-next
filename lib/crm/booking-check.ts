import "server-only";
import { neon } from "@neondatabase/serverless";
import { ingestGmailMessage } from "@/lib/crm/gmail-intake";
import { processBeds24Messages } from "@/lib/crm/ota-outreach";
import { isVirtualEmail } from "@/lib/crm/store";

const OWN_ADDRESS = "vhouse.reservations@gmail.com";
const REPLY_SUBJECT = /^\s*(re|fw|fwd|απ|aw|sv|ynt)\s*:/i;
const MAX_NEW_EMAILS = 10;

function getSql() {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) throw new Error("DATABASE_URL is not configured.");
  return neon(url);
}

async function checkBeds24(bookingIds: string[]) {
  const token = process.env.BEDS24_API_TOKEN?.trim();
  if (!token) return 0;
  const url = new URL("https://api.beds24.com/v2/bookings/messages");
  url.searchParams.set("source", "guest");
  for (const id of bookingIds) url.searchParams.append("bookingId", id);
  const response = await fetch(url, { headers: { accept: "application/json", token }, cache: "no-store", signal: AbortSignal.timeout(12_000) });
  if (!response.ok) throw new Error(`Beds24 HTTP ${response.status}`);
  const payload = (await response.json()) as any;
  const messages = (Array.isArray(payload?.data) ? payload.data : []).filter((item: any) =>
    String(item?.source ?? "") === "guest" && bookingIds.includes(String(item?.bookingId)) && String(item?.message ?? "").trim());
  return messages.length ? (await processBeds24Messages(messages)).stored : 0;
}

async function checkGmail(bookingIds: string[], email: string | null, webAppUrl: string) {
  const secret = process.env.ARRIVAL_NOTES_SECRET?.trim();
  if (!secret) throw new Error("Λείπει το ARRIVAL_NOTES_SECRET.");
  const response = await fetch(webAppUrl, {
    method: "POST",
    headers: { "Content-Type": "text/plain" },
    body: JSON.stringify({ secret, bookingIds, email: email && !isVirtualEmail(email) ? email : "" }),
    cache: "no-store",
    signal: AbortSignal.timeout(25_000),
  });
  const payload = (await response.json().catch(() => null)) as any;
  if (!response.ok || !payload?.ok) throw new Error("Το Gmail script δεν απάντησε.");

  const sql = getSql();
  const candidates = (Array.isArray(payload.messages) ? payload.messages : []).filter((item: any) => {
    const ours = String(item.from ?? "").toLowerCase().includes(OWN_ADDRESS);
    return !ours || REPLY_SUBJECT.test(String(item.subject ?? ""));
  });
  const ids = candidates.map((item: any) => String(item.id));
  const known = new Set(((await sql`select message_id from public.crm_guest_messages where message_id = any(${ids}::text[])`) as any[]).map((row) => row.message_id));
  let stored = 0;
  for (const item of candidates.filter((row: any) => !known.has(String(row.id))).slice(0, MAX_NEW_EMAILS)) {
    const result = await ingestGmailMessage({
      messageId: String(item.id),
      bookingIds,
      from: String(item.from ?? ""),
      date: String(item.date ?? ""),
      subject: String(item.subject ?? ""),
      body: String(item.body ?? ""),
      direction: String(item.from ?? "").toLowerCase().includes(OWN_ADDRESS) ? "staff" : "guest",
    });
    if (result.stored) stored += 1;
  }
  return stored;
}

/** On demand, one booking: Booking/Expedia messages, then the Gmail inbox. */
export async function checkBookingCommunication(bookingIds: string[], email: string | null) {
  const sql = getSql();
  const [settings] = (await sql`select gmail_webapp_url from public.crm_email_settings where id`) as any[];
  const beds24 = await checkBeds24(bookingIds);
  const gmailReady = Boolean(settings?.gmail_webapp_url);
  const gmail = gmailReady ? await checkGmail(bookingIds, email, settings.gmail_webapp_url) : 0;
  return { beds24, gmail, gmailReady };
}
