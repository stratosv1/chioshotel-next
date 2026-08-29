import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const databaseUrl = process.env.DATABASE_URL?.trim();
  if (!databaseUrl) {
    return NextResponse.json({ ok: false, error: "DATABASE_URL is missing" }, { status: 500 });
  }

  const sql = neon(databaseUrl);
  const rows = await sql`
    select
      b.booking_id,
      b.status,
      b.checkin,
      b.checkout,
      b.room,
      b.updated_at,
      count(i.*)::int as linked_nights,
      min(i.stay_date) as first_stay_date,
      max(i.stay_date) as last_stay_date,
      coalesce(array_agg(distinct i.room_number order by i.room_number) filter (where i.room_number is not null), '{}') as room_numbers
    from public.beds24_bookings b
    left join booking_core.inventory i on i.booking_id = b.booking_id
    where b.booking_id = '92230456'
    group by b.booking_id, b.status, b.checkin, b.checkout, b.room, b.updated_at
  `;

  return NextResponse.json(
    { ok: true, found: rows.length > 0, booking: rows[0] ?? null },
    { headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" } },
  );
}
