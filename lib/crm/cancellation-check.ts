import "server-only";
import { neon } from "@neondatabase/serverless";
import { fetchBeds24BookingById } from "@/lib/beds24/api-v2-booking";

// Kept apart from lib/beds24/api-v2-booking.ts, which must stay a per-booking lookup.

const MAX_PAGES = 10;
const MAX_LOOKUPS = 15;
const LOOK_AHEAD_MS = 500 * 86_400_000;
const CANCELLED = ["cancelled", "black"];

async function fetchStatuses(from: string, to: string, token: string) {
  const first = new URL("https://api.beds24.com/v2/bookings");
  first.searchParams.set("arrivalFrom", from);
  first.searchParams.set("arrivalTo", to);
  const statuses = new Map<string, string>();
  let url: string | null = first.toString();
  for (let page = 0; url && page < MAX_PAGES; page += 1) {
    const response: Response = await fetch(url, { headers: { accept: "application/json", token }, cache: "no-store", signal: AbortSignal.timeout(20_000) });
    if (!response.ok) throw new Error(`Beds24 HTTP ${response.status}`);
    const payload = (await response.json()) as any;
    for (const booking of Array.isArray(payload?.data) ? payload.data : []) statuses.set(String(booking.id), String(booking.status ?? ""));
    const next = String(payload?.pages?.nextPageLink ?? "");
    url = payload?.pages?.nextPageExists && next.startsWith("https://api.beds24.com/") ? next : null;
  }
  return statuses;
}

/** Catches cancellations the webhook missed. Active bookings are only ever closed, never reopened. */
export async function reconcileCancellations() {
  const url = process.env.DATABASE_URL?.trim();
  const token = process.env.BEDS24_API_TOKEN?.trim();
  if (!url || !token) throw new Error("Beds24 or database is not configured.");
  const sql = neon(url);

  const rows = (await sql`select booking_id, to_char(checkin, 'YYYY-MM-DD') as checkin from public.beds24_bookings
    where lower(status) in ('confirmed', 'new', 'request') and checkout >= current_date order by checkin`) as any[];
  if (!rows.length) return { checked: 0, closed: [] as string[] };

  const statuses = await fetchStatuses(rows[0].checkin, new Date(Date.now() + LOOK_AHEAD_MS).toISOString().slice(0, 10), token);

  // Missing from the list: moved outside the range or deleted, so ask for each one.
  const missing = rows.filter((row) => !statuses.has(row.booking_id)).slice(0, MAX_LOOKUPS);
  const lookups = await Promise.all(missing.map(async (row) => ({ id: row.booking_id as string, lookup: await fetchBeds24BookingById(row.booking_id) })));
  for (const { id, lookup } of lookups) {
    if (lookup.ok) statuses.set(id, String(lookup.booking?.status ?? ""));
    else if (lookup.reason === "booking_not_found") statuses.set(id, "Deleted");
  }

  const closed: string[] = [];
  for (const row of rows) {
    const status = statuses.get(row.booking_id) ?? "";
    if (!CANCELLED.includes(status.toLowerCase()) && status !== "Deleted") continue;
    await sql`update public.beds24_bookings set status = ${status}, updated_at = now() where booking_id = ${row.booking_id}`;
    closed.push(row.booking_id);
  }
  if (closed.length) console.info("[cancellation-check] closed missed cancellations", closed);
  return { checked: rows.length, closed };
}
