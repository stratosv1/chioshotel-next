import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const databaseUrl = process.env.DATABASE_URL?.trim();
  if (!databaseUrl) {
    return NextResponse.json({ ok: false, error: "DATABASE_URL missing" }, { status: 500 });
  }

  const sql = neon(databaseUrl);
  const bookingId = "92235175";

  const rows = await sql`
    select
      booking_id,
      status,
      checkin,
      checkout,
      room,
      updated_at,
      raw_json -> 'api_v2_lookup' as api_v2_lookup,
      raw_json ->> 'room_id' as resolved_room_id,
      raw_json ->> 'unit_id' as resolved_unit_id
    from public.beds24_bookings
    where booking_id = ${bookingId}::text
    limit 1
  `;

  const inventoryRows = await sql`
    select
      stay_date,
      room_number,
      source_room_id,
      source_unit_id,
      available,
      reason,
      booking_id,
      synced_at,
      raw_source ->> 'eventReconciledAt' as event_reconciled_at
    from booking_core.inventory
    where booking_id = ${bookingId}::text
       or raw_source ->> 'bookingId' = ${bookingId}::text
    order by stay_date, room_number
  `;

  return NextResponse.json(
    {
      ok: true,
      booking: (rows as any[])[0] ?? null,
      bookingCoreRows: inventoryRows,
    },
    {
      headers: {
        "Cache-Control": "no-store",
        "X-Robots-Tag": "noindex, nofollow",
      },
    },
  );
}
