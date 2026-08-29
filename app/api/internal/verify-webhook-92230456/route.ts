import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const databaseUrl = process.env.DATABASE_URL?.trim();
  if (!databaseUrl) return NextResponse.json({ ok: false, error: "DATABASE_URL missing" }, { status: 500 });

  const sql = neon(databaseUrl);
  const bookingId = "92232472";

  const bookingRows = await sql`
    select booking_id, status, checkin, checkout, room, updated_at,
      raw_json ->> 'room_id' as room_id,
      raw_json ->> 'unit_id' as unit_id
    from public.beds24_bookings
    where booking_id = ${bookingId}::text
    limit 1
  `;

  const inventoryRows = await sql`
    select stay_date, room_number, available, reason, source_status, booking_id, base_price, synced_at,
      source_room_id, source_unit_id,
      raw_source ->> 'eventReconciledAt' as event_reconciled_at
    from booking_core.inventory
    where booking_id = ${bookingId}::text
    order by stay_date, room_number
  `;

  return NextResponse.json({
    ok: true,
    booking: (bookingRows as any[])[0] ?? null,
    inventory: inventoryRows,
  }, {
    headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" },
  });
}
