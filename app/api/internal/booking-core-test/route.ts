import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { getBookedStayDetails } from "@/lib/booking-core/booking-details";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const databaseUrl = process.env.DATABASE_URL?.trim();
  if (!databaseUrl) {
    return NextResponse.json({ ok: false, error: "DATABASE_URL is missing" }, { status: 500 });
  }

  const sql = neon(databaseUrl);
  const candidates = await sql`
    select stay_date::text as stay_date, room_number
    from booking_core.booked_stay_details
    where stay_date >= current_date
    order by stay_date, room_number
    limit 1
  `;

  const candidate = (candidates as any[])[0];
  if (!candidate) {
    return NextResponse.json({ ok: true, found: false });
  }

  const details = await getBookedStayDetails(
    Number(candidate.room_number),
    String(candidate.stay_date),
  );

  return NextResponse.json(
    { ok: true, found: Boolean(details), details },
    { headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" } },
  );
}
