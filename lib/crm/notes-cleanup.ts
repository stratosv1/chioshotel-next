import "server-only";
import { neon } from "@neondatabase/serverless";
import { fetchBeds24BookingById } from "@/lib/beds24/api-v2-booking";
import { getBeds24WriteToken } from "@/lib/crm/booking-notes";

// One-off, removed once done: takes back the note lines written from old
// Booking.com / Expedia messages on 3/11. Lines by staff are never touched.
const IMPORT_CUTOFF = "2026-10-18";

export async function removeImportedNotes() {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) return;
  const sql = neon(url);
  const [state] = (await sql`select notes_cleanup_done_at from public.crm_email_settings where id`) as any[];
  if (state?.notes_cleanup_done_at) return;

  const summaries = (await sql`select booking_ids[1] as booking_id, summary from public.crm_guest_messages
    where message_id like 'beds24:%' and summary is not null and sent_at < ${IMPORT_CUTOFF}::date`) as any[];
  const emails = (await sql`select booking_id, real_email from public.crm_booking_contacts where source = 'ota_message'`) as any[];

  const byBooking = new Map<string, string[]>();
  const add = (id: string, text: string) => byBooking.set(id, [...(byBooking.get(id) ?? []), text]);
  for (const row of summaries) add(row.booking_id, row.summary);
  for (const row of emails) add(row.booking_id, row.real_email);
  if (!byBooking.size) return;

  const token = await getBeds24WriteToken();
  let allOk = true;
  for (const [bookingId, texts] of byBooking) {
    const lookup = await fetchBeds24BookingById(bookingId);
    if (!lookup.ok || !lookup.booking) {
      allOk = false;
      continue;
    }
    const notes = String(lookup.booking.notes ?? "");
    const kept = notes.split("\n").filter((line) => {
      const ours = line.startsWith("Μήνυμα πελάτη") || line.startsWith("Email πελάτη (μήνυμα");
      return !(ours && texts.some((text) => line.includes(text)));
    }).join("\n");
    if (kept === notes) continue;
    const response = await fetch("https://beds24.com/api/v2/bookings", {
      method: "POST",
      headers: { accept: "application/json", "Content-Type": "application/json", token },
      body: JSON.stringify([{ id: Number(bookingId), notes: kept }]),
      cache: "no-store",
    });
    if (!response.ok) {
      allOk = false;
      console.error("[notes-cleanup] update failed", { bookingId, status: response.status });
    }
  }
  console.info(JSON.stringify({ msg: "crm_notes_cleanup", bookings: byBooking.size, allOk }));
  if (allOk) await sql`update public.crm_email_settings set notes_cleanup_done_at = now() where id`;
}
