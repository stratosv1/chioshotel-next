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
  const bookingId = "92232472";

  const rows = await sql`
    select
      booking_id,
      status,
      checkin,
      checkout,
      property,
      room,
      guest_language,
      price,
      updated_at,
      raw_json - 'firstname' - 'lastname' - 'email' as received_payload_without_pii
    from public.beds24_bookings
    where booking_id = ${bookingId}::text
    limit 1
  `;

  const inventoryRows = await sql`
    select stay_date, room_number, available, reason, booking_id
    from booking_core.inventory
    where booking_id = ${bookingId}::text
    order by stay_date, room_number
  `;

  return NextResponse.json(
    {
      ok: true,
      note: "Exact stored Beds24 webhook data for this booking, with firstname/lastname/email removed.",
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
