import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { roomCategory, type RoomCategoryKey } from "@/components/ai/room-finder-card-badges";

export const runtime = "nodejs";
// Read once a day at most: the season report changes rarely and Neon reads stay minimal.
export const revalidate = 86400;

type RoomRow = { room?: unknown; bookings?: unknown };

/**
 * The room category with the most bookings in the latest imported season report
 * (staff statistics, built from the Beds24 reports). Read-only: never creates or seeds tables.
 */
export async function GET() {
  try {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) return NextResponse.json({ category: null });
    const sql = neon(databaseUrl);
    const rows = await sql`
      select raw_payload from staff_statistics_reports
      where is_current = true
      order by report_year desc, imported_at desc, id desc
      limit 1`;
    const payload = (rows[0] as { raw_payload?: { rooms?: RoomRow[] } } | undefined)?.raw_payload;
    const rooms = Array.isArray(payload?.rooms) ? payload!.rooms : [];
    const totals = new Map<RoomCategoryKey, number>();
    for (const row of rooms) {
      const category = roomCategory(Number(row.room));
      const bookings = Number(row.bookings);
      if (!category || !Number.isFinite(bookings)) continue;
      totals.set(category, (totals.get(category) || 0) + bookings);
    }
    const ranked = [...totals.entries()].sort((a, b) => b[1] - a[1]);
    // Only call a category popular when it clearly leads (no tie).
    const category = ranked.length && ranked[0][1] > 0 && (!ranked[1] || ranked[0][1] > ranked[1][1]) ? ranked[0][0] : null;
    return NextResponse.json({ category });
  } catch {
    return NextResponse.json({ category: null });
  }
}
