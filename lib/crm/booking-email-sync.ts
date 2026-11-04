import "server-only";
import { neon } from "@neondatabase/serverless";
import { getBeds24WriteToken, updateBookingEmail } from "@/lib/crm/booking-notes";

const MAX_GROUP_ROOMS = 12;
const MAX_RETRIES_PER_RUN = 10;

function getSql() {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) throw new Error("DATABASE_URL is not configured.");
  return neon(url);
}

/** Every room booked together with this one, itself included. */
async function groupBookingIds(bookingId: string) {
  const token = process.env.BEDS24_API_TOKEN?.trim();
  if (!token) throw new Error("BEDS24_API_TOKEN is not configured.");
  const url = new URL("https://api.beds24.com/v2/bookings");
  url.searchParams.set("id", bookingId);
  url.searchParams.set("includeBookingGroup", "true");
  const response = await fetch(url, { headers: { accept: "application/json", token }, cache: "no-store", signal: AbortSignal.timeout(10_000) });
  if (!response.ok) throw new Error(`Beds24 HTTP ${response.status}`);
  const payload = (await response.json()) as any;
  const booking = Array.isArray(payload?.data) ? payload.data[0] : null;
  const master = String(booking?.masterId ?? "");
  const group: unknown[] = Array.isArray(booking?.bookingGroup?.ids) ? booking.bookingGroup.ids : [];
  return [...new Set([bookingId, ...(master && master !== "0" ? [master] : []), ...group.map(String)])].slice(0, MAX_GROUP_ROOMS);
}

/** Writes the real email to all rooms in Beds24. Never throws: a failure is kept for staff to see. */
export async function syncBookingEmail(bookingId: string, email: string) {
  const sql = getSql();
  let error: string | null = null;
  let ids = [bookingId];
  try {
    ids = await groupBookingIds(bookingId);
    const token = await getBeds24WriteToken();
    const failed: string[] = [];
    for (const id of ids) {
      if (!(await updateBookingEmail(id, email, token))) failed.push(id);
    }
    if (failed.length) error = `Δεν γράφτηκε στις κρατήσεις ${failed.join(", ")}`;
  } catch (reason) {
    console.error("[booking-email-sync] failed", { bookingId, reason });
    error = "Το Beds24 δεν απάντησε";
  }

  // The other rooms carry the same guest, so the CRM treats them as answered too.
  await sql`insert into public.crm_booking_contacts (booking_id, real_email, source)
    select booking_id, ${email}::text, 'ota_message' from public.beds24_bookings where booking_id = any(${ids}::text[]) and booking_id <> ${bookingId}
    on conflict (booking_id) do update set real_email = coalesce(nullif(public.crm_booking_contacts.real_email, ''), excluded.real_email), updated_at = now()`;
  await sql`update public.crm_booking_contacts set beds24_email_error = ${error}::text, updated_at = now()
    where booking_id = any(${ids}::text[]) and beds24_email_error is distinct from ${error}::text`;
  return { ok: !error, error };
}

/** Daily second attempt, so a short Beds24 outage clears itself. */
export async function retryFailedEmailSyncs() {
  const sql = getSql();
  const rows = (await sql`select c.booking_id, c.real_email from public.crm_booking_contacts c
    join public.beds24_bookings b using (booking_id)
    where c.beds24_email_error is not null and nullif(c.real_email, '') is not null and b.checkout >= current_date
    order by b.checkin limit ${MAX_RETRIES_PER_RUN}`) as any[];
  let fixed = 0;
  for (const row of rows) {
    if ((await syncBookingEmail(row.booking_id, row.real_email)).ok) fixed += 1;
  }
  return { retried: rows.length, fixed };
}
