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

  const columns = await sql`
    select column_name, data_type, is_nullable, column_default
    from information_schema.columns
    where table_schema = 'booking_core' and table_name = 'inventory'
    order by ordinal_position
  `;

  const roomsColumns = await sql`
    select column_name, data_type
    from information_schema.columns
    where table_schema = 'booking_core' and table_name = 'rooms'
    order by ordinal_position
  `;

  const rooms = await sql`select to_jsonb(r) as row from booking_core.rooms r`;
  const sampleInventory = await sql`
    select to_jsonb(i) - 'booking_id' as row
    from booking_core.inventory i
    order by stay_date, room_number
    limit 5
  `;
  const inventoryStats = await sql`
    select
      count(*)::int as total_rows,
      count(*) filter (where booking_id is not null)::int as rows_with_booking_id,
      count(distinct booking_id) filter (where booking_id is not null)::int as distinct_booking_ids
    from booking_core.inventory
  `;
  const functions = await sql`
    select p.proname, pg_get_functiondef(p.oid) as definition
    from pg_proc p
    join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'booking_core'
      and p.proname in ('replace_inventory_snapshot', 'search_availability', 'nightly_quotes')
    order by p.proname
  `;

  return NextResponse.json(
    { ok: true, columns, roomsColumns, rooms, sampleInventory, inventoryStats, functions },
    { headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" } },
  );
}
