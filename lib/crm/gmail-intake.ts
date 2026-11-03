import "server-only";
import { neon } from "@neondatabase/serverless";
import { appendBookingNote, getBeds24WriteToken, noteDate, summarizeGuestMessage } from "@/lib/crm/booking-notes";

const MAX_BODY_CHARS = 4000;
export const clean = (value: unknown) => String(value ?? "").trim();
const emailAddress = (from: string) => (from.match(/<([^>]+)>/)?.[1] ?? from).trim().toLowerCase();

// Keep only the sender's own text: drop the quoted original email and signatures.
function stripQuotedReply(body: string) {
  const markers = [
    /^On .+wrote:\s*$/im,
    /^Am .+schrieb.*:\s*$/im,
    /^Le .+a écrit\s*:\s*$/im,
    /^Il .+ha scritto\s*:\s*$/im,
    /^Στις .+έγραψε:\s*$/im,
    /^(From|Από|Von|De|Da):\s.*$/im,
    /^-{2,}\s*Original Message\s*-{2,}/im,
    /^>/m,
    /Your Arrival is Approaching!/i,
    /Η Άφιξή Σας Πλησιάζει!/i,
    /^VOULAMANDIS HOUSE$/m,
    /^Voulamandis House\s*$/m,
    /^Rooms & Apartments\b/m,
  ];
  let end = body.length;
  for (const marker of markers) {
    const match = marker.exec(body);
    if (match && match.index < end) end = match.index;
  }
  return body.slice(0, end).trim().slice(0, MAX_BODY_CHARS);
}

export type GmailMessage = {
  messageId: string;
  bookingIds: string[];
  from: string;
  date: string;
  subject: string;
  body: string;
  direction: "guest" | "staff";
};

/** Stores one email for the CRM and, for guest emails, adds a line to the Beds24 notes. */
export async function ingestGmailMessage(message: GmailMessage) {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) throw new Error("DATABASE_URL is not configured.");
  const sql = neon(url);
  const body = stripQuotedReply(clean(message.body));
  if (!body) return { stored: false, written: [] as string[], skipped: { all: "empty_reply" } as Record<string, string>, failed: {} as Record<string, string>, note: null as string | null };

  const known = (await sql`select 1 from public.crm_guest_messages where message_id = ${message.messageId}`) as any[];
  const summary = message.direction === "guest"
    ? await summarizeGuestMessage({ reply: body, date: message.date, guest: message.from })
    : { hasInfo: false, note: "", arrivalTime: "" };
  const sentAt = Number.isNaN(Date.parse(message.date)) ? new Date().toISOString() : message.date;
  await sql`insert into public.crm_guest_messages (message_id, booking_ids, guest_email, direction, subject, body, summary, arrival_time, sent_at)
    values (${message.messageId}, ${message.bookingIds}::text[], ${emailAddress(message.from)}, ${message.direction}, ${clean(message.subject).slice(0, 300)}, ${body}, ${summary.note || null}, ${summary.arrivalTime || null}, ${sentAt}::timestamptz)
    on conflict (message_id) do update set summary = coalesce(excluded.summary, public.crm_guest_messages.summary)`;

  const written: string[] = [];
  const skipped: Record<string, string> = {};
  const failed: Record<string, string> = {};
  if (message.direction !== "guest" || !summary.hasInfo || !summary.note) {
    return { stored: !known.length, written, skipped: { all: "no_note" } as Record<string, string>, failed, note: null as string | null };
  }

  const received = noteDate(message.date);
  const line = `Email πελάτη${received ? ` ${received}` : ""}: ${summary.note}`;
  const token = await getBeds24WriteToken();
  for (const bookingId of message.bookingIds) {
    const outcome = await appendBookingNote(bookingId, line, summary.note, token);
    if (outcome === "written") written.push(bookingId);
    else if (outcome === "already_noted" || outcome === "other_property") skipped[bookingId] = outcome;
    else failed[bookingId] = outcome;
  }
  return { stored: !known.length, written, skipped, failed, note: line as string | null };
}
