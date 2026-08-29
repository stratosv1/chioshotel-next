import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { reconcileBookingCoreBookingEvent } from "@/lib/booking-core/reconcile-booking-event";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const databaseUrl = process.env.DATABASE_URL?.trim();
  if (!databaseUrl) {
    return NextResponse.json({ ok: false, error: "DATABASE_URL is missing" }, { status: 500 });
  }

  const sql = neon(databaseUrl);
  const columns = await sql`
    select column_name, data_type, is_nullable, column_default
    from information_schema.columns
    where table_schema = 'booking_core' and table_name = 'inventory'
    order by ordinal_position
  `;
  const rooms = await sql`select to_jsonb(r) as row from booking_core.rooms r order by room_number`;
  const inventoryStats = await sql`
    select
      count(*)::int as total_rows,
      count(*) filter (where booking_id is not null)::int as rows_with_booking_id,
      count(distinct booking_id) filter (where booking_id is not null)::int as distinct_booking_ids,
      count(*) filter (where booking_id is not null and base_price is null)::int as booked_without_base_price
    from booking_core.inventory
  `;
  const candidateRows = await sql`
    select
      booking_id,
      source_room_id,
      source_unit_id,
      min(stay_date)::text as checkin,
      (max(stay_date) + 1)::text as checkout
    from booking_core.inventory
    where booking_id is not null
      and stay_date >= current_date
    group by booking_id, source_room_id, source_unit_id
    order by min(stay_date), min(room_number)
    limit 1
  `;

  const candidate = (candidateRows as any[])[0] || null;
  let activeDryRun = null;
  let cancellationDryRun = null;
  let candidateSummary = null;

  if (candidate?.booking_id) {
    activeDryRun = await reconcileBookingCoreBookingEvent({
      bookingId: String(candidate.booking_id),
      status: "Confirmed",
      checkin: String(candidate.checkin),
      checkout: String(candidate.checkout),
      roomId: String(candidate.source_room_id),
      unitId: String(candidate.source_unit_id),
    }, { dryRun: true });

    cancellationDryRun = await reconcileBookingCoreBookingEvent({
      bookingId: String(candidate.booking_id),
      status: "Cancelled",
      checkin: String(candidate.checkin),
      checkout: String(candidate.checkout),
      roomId: String(candidate.source_room_id),
      unitId: String(candidate.source_unit_id),
    }, { dryRun: true });

    const rawId = String(candidate.booking_id);
    candidateSummary = {
      bookingIdMasked: rawId.length <= 4 ? "****" : `***${rawId.slice(-4)}`,
      roomId: String(candidate.source_room_id),
      unitId: String(candidate.source_unit_id),
      checkin: String(candidate.checkin),
      checkout: String(candidate.checkout),
    };
  }

  return NextResponse.json(
    { ok: true, columns, rooms, inventoryStats, candidateSummary, activeDryRun, cancellationDryRun },
    { headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" } },
  );
}
