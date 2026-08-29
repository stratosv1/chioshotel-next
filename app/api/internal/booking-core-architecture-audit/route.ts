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
    select distinct on (inventory.booking_id)
      inventory.booking_id,
      inventory.source_room_id,
      inventory.source_unit_id,
      bookings.checkin::text as checkin,
      bookings.checkout::text as checkout
    from booking_core.inventory as inventory
    join public.beds24_bookings as bookings
      on bookings.booking_id = inventory.booking_id
    where inventory.booking_id is not null
      and inventory.stay_date >= current_date
      and bookings.checkin is not null
      and bookings.checkout is not null
      and bookings.checkout > bookings.checkin
    order by inventory.booking_id, inventory.stay_date
    limit 1
  `;

  const candidate = (candidateRows as any[])[0] || null;
  let activeDryRun = null;
  let cancellationDryRun = null;
  let conflictDryRun = null;
  let missingIdsDryRun = null;
  let candidateSummary = null;

  if (candidate?.booking_id) {
    const event = {
      bookingId: String(candidate.booking_id),
      status: "Confirmed",
      checkin: String(candidate.checkin),
      checkout: String(candidate.checkout),
      roomId: String(candidate.source_room_id),
      unitId: String(candidate.source_unit_id),
    };

    activeDryRun = await reconcileBookingCoreBookingEvent(event, { dryRun: true });
    cancellationDryRun = await reconcileBookingCoreBookingEvent(
      { ...event, status: "Cancelled" },
      { dryRun: true },
    );
    conflictDryRun = await reconcileBookingCoreBookingEvent(
      { ...event, bookingId: "__booking_core_dry_run_conflict__" },
      { dryRun: true },
    );
    missingIdsDryRun = await reconcileBookingCoreBookingEvent(
      { ...event, roomId: "", unitId: "" },
      { dryRun: true },
    );

    const rawId = String(candidate.booking_id);
    candidateSummary = {
      bookingIdMasked: rawId.length <= 4 ? "****" : `***${rawId.slice(-4)}`,
      roomId: String(candidate.source_room_id),
      unitId: String(candidate.source_unit_id),
      checkin: String(candidate.checkin),
      checkout: String(candidate.checkout),
    };
  }

  const qa = {
    activeExistingBookingSafe:
      activeDryRun?.applied === true &&
      activeDryRun.conflictRows === 0 &&
      activeDryRun.rowsReleased === 0 &&
      activeDryRun.rowsBooked === 0,
    cancellationTargetsOnlyBooking:
      cancellationDryRun?.applied === true &&
      Number(cancellationDryRun.rowsReleased || 0) > 0,
    conflictingBookingBlocked:
      conflictDryRun?.applied === false &&
      conflictDryRun.reason === "target_inventory_conflict" &&
      Number(conflictDryRun.conflictRows || 0) > 0,
    missingExactIdsBlocked:
      missingIdsDryRun?.applied === false &&
      missingIdsDryRun.reason === "missing_exact_room_or_unit_id",
  };

  return NextResponse.json(
    {
      ok: Object.values(qa).every(Boolean),
      qa,
      columns,
      rooms,
      inventoryStats,
      candidateSummary,
      activeDryRun,
      cancellationDryRun,
      conflictDryRun,
      missingIdsDryRun,
    },
    { headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" } },
  );
}
