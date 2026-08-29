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
  const bookingId = "92230456";

  const bookingRows = await sql`
    select
      booking_id,
      status,
      checkin,
      checkout,
      room,
      updated_at,
      raw_json ->> 'room_id' as room_id,
      raw_json ->> 'unit_id' as unit_id
    from public.beds24_bookings
    where booking_id = ${bookingId}::text
    limit 1
  `;

  const inventoryRows = await sql`
    select
      stay_date,
      room_number,
      available,
      reason,
      booking_id,
      base_price,
      synced_at,
      raw_source ->> 'eventReconciledAt' as event_reconciled_at
    from booking_core.inventory
    where booking_id = ${bookingId}::text
    order by stay_date, room_number
  `;

  const recentEventRows = await sql`
    select
      count(*)::int as row_count,
      count(distinct booking_id)::int as booking_count,
      array_agg(distinct booking_id) filter (where booking_id is not null) as booking_ids
    from booking_core.inventory
    where raw_source ? 'eventReconciledAt'
      and nullif(raw_source ->> 'eventReconciledAt', '')::timestamptz >= now() - interval '15 minutes'
  `;

  return NextResponse.json(
    {
      ok: true,
      booking: (bookingRows as any[])[0] ?? null,
      inventory: inventoryRows,
      recentEventWrites: (recentEventRows as any[])[0] ?? null,
    },
    {
      headers: {
        "Cache-Control": "no-store",
        "X-Robots-Tag": "noindex, nofollow",
      },
    },
  );
}
