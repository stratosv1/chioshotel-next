import "server-only";
import { neon } from "@neondatabase/serverless";
import { fetchBeds24BookingById } from "@/lib/beds24/api-v2-booking";
import { buildGuestSms } from "@/lib/crm/ota-message-text";
import { isVirtualEmail } from "@/lib/crm/store";

function getSql() {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) throw new Error("DATABASE_URL is not configured.");
  return neon(url);
}

export type BoardEvent = {
  time: string;
  channel: "guest" | "staff" | "email" | "sms" | "whatsapp" | "ota";
  title: string;
  body: string | null;
  summary: string | null;
  status: string | null;
};

export type BoardBooking = {
  bookingIds: string[];
  name: string;
  firstName: string;
  rooms: string[];
  checkin: string;
  checkout: string;
  status: string;
  channel: "Booking" | "Expedia" | "Απευθείας";
  email: string | null;
  emailState: "real" | "virtual" | "none";
  phone: string | null;
  arrivalTime: string | null;
  smsTemplate: string;
  deliveryProblem: string | null;
  emailSyncError: string | null;
  events: BoardEvent[];
};

const TIME_IN_TEXT = /\b([01]?\d|2[0-3])[:.][0-5]\d\b/;

/** Older messages have no stored arrival time: a time in a non-departure summary is used. */
function arrivalFromSummary(summary: string | null) {
  if (!summary || /αναχώρηση/i.test(summary)) return null;
  return summary.match(TIME_IN_TEXT)?.[0]?.replace(".", ":") ?? null;
}

const EMAIL_TITLES: Record<string, string> = {
  confirmation: "Επιβεβαίωση κράτησης", arrival: "Pre-arrival", chios_info: "Πληροφορίες για το νησί", welcome: "Καλωσόρισμα",
  daily: "Πρόταση ημέρας", breakfast: "Υπενθύμιση πρωινού", checkout: "Υπενθύμιση αναχώρησης", thank_you: "Ευχαριστούμε",
};

// Asking for an arrival time months ahead is pointless, so it only counts when close.
const ARRIVAL_ATTENTION_DAYS = 14;
const FAILED_SMS = ["UNDELIVERED", "FAILED", "EXPIRED", "REJECTED"];

function boardLanguage(language: string | null, country: string | null) {
  const code = (language ?? "").slice(0, 2).toLowerCase();
  if (code === "el" || code === "en" || code === "tr") return code;
  if (country === "GR" || country === "CY") return "el";
  return country === "TR" ? "tr" : "en";
}

/** Upcoming bookings still missing the email or the arrival time, soonest first. */
export async function listAttentionBookings() {
  const bookings = await listBookings(null);
  const arrivalLimit = new Date(Date.now() + ARRIVAL_ATTENTION_DAYS * 86_400_000).toISOString().slice(0, 10);
  return bookings.filter((booking) => booking.emailState !== "real" || booking.emailSyncError || (!booking.arrivalTime && booking.checkin <= arrivalLimit));
}

export const listMonthBookings = (month: string) => listBookings(month);

async function listBookings(month: string | null): Promise<BoardBooking[]> {
  const sql = getSql();
  const rows = (await sql`
    select b.booking_id, b.status, b.firstname, b.lastname, b.email, b.phone, b.room, b.guest_language, b.country,
      to_char(b.checkin, 'YYYY-MM-DD') as checkin, to_char(b.checkout, 'YYYY-MM-DD') as checkout,
      nullif(c.real_email, '') as real_email, c.beds24_email_error
    from public.beds24_bookings b
    left join public.crm_booking_contacts c using (booking_id)
    where lower(b.status) in ('confirmed', 'new', 'request')
      and (${month}::text is null or to_char(b.checkin, 'YYYY-MM') = ${month})
      and (${month}::text is not null or b.checkin >= current_date)
    order by b.checkin, b.booking_id
  `) as any[];
  if (!rows.length) return [];
  const ids = rows.map((row) => row.booking_id);

  const [messages, emails, comms, outreach] = await Promise.all([
    sql`select booking_ids, direction, subject, body, summary, arrival_time,
        to_char(sent_at at time zone 'Europe/Athens', 'YYYY-MM-DD HH24:MI') as time
      from public.crm_guest_messages where booking_ids && ${ids}::text[] order by sent_at`,
    sql`select booking_id, email_type, recipient, mode, status, error,
        to_char(created_at at time zone 'Europe/Athens', 'YYYY-MM-DD HH24:MI') as time
      from public.crm_email_log where booking_id = any(${ids}::text[]) order by created_at`,
    sql`select booking_id, channel, message, status, recipient_phone,
        to_char(created_at at time zone 'Europe/Athens', 'YYYY-MM-DD HH24:MI') as time
      from public.staff_guest_communications where booking_id = any(${ids}::text[]) order by created_at`,
    sql`select booking_id, status, error, to_char(created_at at time zone 'Europe/Athens', 'YYYY-MM-DD HH24:MI') as time,
        to_char(reminder_at at time zone 'Europe/Athens', 'YYYY-MM-DD HH24:MI') as reminder,
        to_char(reminder2_at at time zone 'Europe/Athens', 'YYYY-MM-DD HH24:MI') as reminder2, reminder_status
      from public.crm_ota_outreach where booking_id = any(${ids}::text[])`,
  ]) as any[][];

  // Rooms booked together on one address are one guest with one conversation.
  const groups = new Map<string, any[]>();
  for (const row of rows) {
    const address = (row.real_email ?? row.email ?? "").trim().toLowerCase();
    const key = address && !isVirtualEmail(address) ? `${address}:${row.checkin}` : `${row.booking_id}`;
    groups.set(key, [...(groups.get(key) ?? []), row]);
  }

  return [...groups.values()].map((group) => {
    const first = group[0];
    const bookingIds = group.map((row) => row.booking_id);
    const has = (id: string) => bookingIds.includes(id);
    const address = (first.real_email ?? first.email ?? "").trim().toLowerCase();
    const virtual = address ? isVirtualEmail(address) : false;
    const own = messages.filter((row) => row.booking_ids.some(has));

    const events: BoardEvent[] = ([
      ...own.map((row) => ({ time: row.time, channel: row.direction === "staff" ? "staff" as const : "guest" as const, title: row.direction === "staff" ? "Δική μας απάντηση" : "Μήνυμα πελάτη", body: row.body, summary: row.summary, status: null })),
      ...emails.filter((row) => has(row.booking_id)).map((row) => ({ time: row.time, channel: "email" as const, title: `Email: ${EMAIL_TITLES[row.email_type] ?? row.email_type}${row.mode === "test" ? " (δοκιμή)" : ""}`, body: row.recipient, summary: null, status: row.status === "failed" ? `Απέτυχε: ${row.error ?? ""}` : "Στάλθηκε" })),
      ...comms.filter((row) => has(row.booking_id)).map((row) => ({ time: row.time, channel: (row.channel === "sms" ? "sms" : "whatsapp") as BoardEvent["channel"], title: row.channel === "sms" ? `SMS προς ${row.recipient_phone ?? ""}` : "WhatsApp", body: row.message, summary: null, status: row.status })),
      ...outreach.filter((row) => has(row.booking_id)).flatMap((row) => [
        { time: row.time, channel: "ota" as const, title: "Μήνυμα Booking/Expedia για email", body: null, summary: null, status: row.status === "sent" ? "Το δέχτηκε το Beds24" : `Απέτυχε: ${row.error ?? ""}` },
        ...[row.reminder, row.reminder2].filter(Boolean).map((time: string) => ({ time, channel: "ota" as const, title: "Υπενθύμιση Booking/Expedia", body: null, summary: null, status: "Το δέχτηκε το Beds24" })),
      ]),
    ] as BoardEvent[]).sort((a, b) => a.time.localeCompare(b.time));

    const lastSms = [...events].reverse().find((event) => event.channel === "sms");
    const failedSms = FAILED_SMS.includes(lastSms?.status ?? "");
    const failedChannel = outreach.some((row) => has(row.booking_id) && (row.status === "failed" || row.reminder_status === "failed"));
    const arrival = [...own].reverse().find((row) => row.arrival_time || arrivalFromSummary(row.summary));
    return {
      bookingIds,
      name: `${first.firstname ?? ""} ${first.lastname ?? ""}`.trim(),
      firstName: first.firstname ?? "",
      rooms: group.map((row) => row.room).filter(Boolean),
      checkin: first.checkin,
      checkout: first.checkout,
      status: first.status,
      // The original address shows the channel, even after a real email is added.
      channel: /expedia/i.test(first.email ?? "") ? "Expedia" : /booking\.com/i.test(first.email ?? "") ? "Booking" : "Απευθείας",
      email: address || null,
      emailState: !address ? "none" : virtual ? "virtual" : "real",
      phone: first.phone,
      arrivalTime: arrival ? arrival.arrival_time || arrivalFromSummary(arrival.summary) : null,
      smsTemplate: buildGuestSms(boardLanguage(first.guest_language, first.country), first.firstname ?? ""),
      deliveryProblem: failedSms ? "Το SMS δεν παραδόθηκε" : failedChannel ? "Το μήνυμα Booking/Expedia απέτυχε" : null,
      emailSyncError: group.find((row) => row.beds24_email_error)?.beds24_email_error ?? null,
      events,
    };
  });
}

export async function getBookingNotes(bookingId: string) {
  const lookup = await fetchBeds24BookingById(bookingId);
  return lookup.ok ? String(lookup.booking?.notes ?? "") : null;
}
