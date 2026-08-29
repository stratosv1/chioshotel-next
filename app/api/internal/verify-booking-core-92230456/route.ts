import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const databaseUrl = process.env.DATABASE_URL?.trim();
  if (!databaseUrl) return NextResponse.json({ ok: false }, { status: 500 });
  const sql = neon(databaseUrl);
  const rows = await sql`
    select
      count(*)::int as linked_nights,
      min(stay_date) as first_stay_date,
      max(stay_date) as last_stay_date,
      coalesce(array_agg(distinct room_number order by room_number), '{}') as room_numbers
    from booking_core.inventory
    where booking_id = '92230456'
  `;
  return NextResponse.json(
    { ok: true, bookingId: "92230456", inventory: rows[0] ?? null },
    { headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" } },
  );
}
