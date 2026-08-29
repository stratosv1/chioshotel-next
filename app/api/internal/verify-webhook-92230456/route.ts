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
  const bookingId = "92235579";

  const rows = await sql`
    select
      booking_id,
      status,
      checkin,
      checkout,
      firstname,
      lastname,
      email,
      property,
      room,
      guest_language,
      price,
      raw_json -> 'api_v2_lookup' as api_v2_lookup
    from public.beds24_bookings
    where booking_id = ${bookingId}::text
    limit 1
  `;

  return NextResponse.json(
    { ok: true, booking: (rows as any[])[0] ?? null },
    {
      headers: {
        "Cache-Control": "no-store",
        "X-Robots-Tag": "noindex, nofollow",
      },
    },
  );
}
