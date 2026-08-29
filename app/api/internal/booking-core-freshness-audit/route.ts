import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const databaseUrl = process.env.DATABASE_URL?.trim();
  if (!databaseUrl) return NextResponse.json({ ok: false }, { status: 500 });
  const sql = neon(databaseUrl);

  const functions = await sql`
    select p.proname, pg_get_functiondef(p.oid) as definition
    from pg_proc p
    join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'booking_core'
      and p.proname = 'inventory_status'
  `;
  const settings = await sql`
    select setting_key, numeric_value, text_value, description
    from booking_core.settings
    where lower(setting_key) like '%fresh%'
       or lower(setting_key) like '%stale%'
       or lower(setting_key) like '%age%'
       or lower(setting_key) like '%sync%'
    order by setting_key
  `;
  const latestSync = await sql`
    select completed_at, source_generated_at, source, rows_received, rows_written
    from booking_core.sync_runs
    where status = 'ok'
    order by completed_at desc
    limit 5
  `;

  return NextResponse.json(
    { ok: true, functions, settings, latestSync },
    { headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" } },
  );
}
