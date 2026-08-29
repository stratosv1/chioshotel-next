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

  const rooms = await sql`select * from booking_core.rooms order by room_number`;

  const inventoryStats = await sql`
    select
      count(*)::int as total_rows,
      count(*) filter (where available)::int as available_rows,
      count(*) filter (where not available)::int as unavailable_rows,
      count(*) filter (where booking_id is not null)::int as booked_with_id,
      count(*) filter (where available and reference_price is null)::int as available_without_price,
      count(*) filter (where booking_id is not null and reference_price is null)::int as booked_without_price,
      count(*) filter (where booking_id is not null and reference_price is not null)::int as booked_with_price
    from booking_core.inventory
  `;

  const mappings = await sql`
    select room_number, source_room_id::text as source_room_id, source_unit_id::text as source_unit_id,
           min(room_name) as room_name, min(unit_name) as unit_name,
           count(*)::int as rows
    from booking_core.inventory
    group by room_number, source_room_id, source_unit_id
    order by room_number, source_room_id, source_unit_id
  `;

  const reasonStats = await sql`
    select reason, available, count(*)::int as rows,
           count(*) filter (where reference_price is null)::int as null_price_rows
    from booking_core.inventory
    group by reason, available
    order by reason, available
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
    { ok: true, columns, roomsColumns, rooms, inventoryStats, mappings, reasonStats, functions },
    { headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" } },
  );
}
