import { neon } from "@neondatabase/serverless";

export type CachedBookingSearch = {
  checkin: string;
  checkout: string;
  guests: number;
  payload: Record<string, unknown>;
  updatedAt: string;
  ageSeconds: number;
};

const FRESH_SECONDS = 600;
const RETAIN_DAYS = 14;

function getSql() {
  const databaseUrl = process.env.DATABASE_URL;
  return databaseUrl ? neon(databaseUrl) : null;
}

export async function ensureBookingCacheTables() {
  const sql = getSql();
  if (!sql) return false;

  await sql`
    create table if not exists booking_search_cache (
      checkin date not null,
      checkout date not null,
      guests integer not null,
      payload jsonb not null,
      updated_at timestamptz not null default now(),
      last_accessed_at timestamptz not null default now(),
      refresh_count integer not null default 1,
      primary key (checkin, checkout, guests)
    )
  `;

  await sql`
    create table if not exists booking_cache_sync (
      id bigserial primary key,
      started_at timestamptz not null default now(),
      completed_at timestamptz,
      status text not null default 'running',
      records_updated integer not null default 0,
      error_message text
    )
  `;

  await sql`create index if not exists booking_search_cache_accessed_idx on booking_search_cache (last_accessed_at desc)`;
  return true;
}

export async function readBookingSearchCache(checkin: string, checkout: string, guests: number) {
  const sql = getSql();
  if (!sql) return null;
  await ensureBookingCacheTables();

  const rows = await sql`
    update booking_search_cache
    set last_accessed_at = now()
    where checkin = ${checkin}::date
      and checkout = ${checkout}::date
      and guests = ${guests}
    returning payload, updated_at,
      greatest(0, extract(epoch from (now() - updated_at)))::integer as age_seconds
  `;

  const row = (rows as any[])?.[0];
  if (!row?.payload) return null;

  return {
    checkin,
    checkout,
    guests,
    payload: row.payload as Record<string, unknown>,
    updatedAt: new Date(row.updated_at).toISOString(),
    ageSeconds: Number(row.age_seconds || 0),
    fresh: Number(row.age_seconds || 0) <= FRESH_SECONDS,
  };
}

export async function writeBookingSearchCache(
  checkin: string,
  checkout: string,
  guests: number,
  payload: Record<string, unknown>,
) {
  const sql = getSql();
  if (!sql) return false;
  await ensureBookingCacheTables();

  await sql`
    insert into booking_search_cache (checkin, checkout, guests, payload, updated_at, last_accessed_at)
    values (${checkin}::date, ${checkout}::date, ${guests}, ${JSON.stringify(payload)}::jsonb, now(), now())
    on conflict (checkin, checkout, guests)
    do update set
      payload = excluded.payload,
      updated_at = now(),
      last_accessed_at = now(),
      refresh_count = booking_search_cache.refresh_count + 1
  `;
  return true;
}

export async function listRecentlyUsedBookingSearches(limit = 80) {
  const sql = getSql();
  if (!sql) return [] as Array<{ checkin: string; checkout: string; guests: number }>;
  await ensureBookingCacheTables();

  const rows = await sql`
    select checkin::text, checkout::text, guests
    from booking_search_cache
    where checkout >= current_date
      and last_accessed_at >= now() - interval '7 days'
    order by last_accessed_at desc
    limit ${limit}
  `;

  return (rows as any[]).map((row) => ({
    checkin: String(row.checkin),
    checkout: String(row.checkout),
    guests: Number(row.guests),
  }));
}

export async function startBookingCacheSync() {
  const sql = getSql();
  if (!sql) return null;
  await ensureBookingCacheTables();
  const rows = await sql`insert into booking_cache_sync default values returning id::text`;
  return String((rows as any[])?.[0]?.id || "");
}

export async function finishBookingCacheSync(id: string, status: "success" | "failed", recordsUpdated: number, errorMessage = "") {
  const sql = getSql();
  if (!sql || !id) return;
  await sql`
    update booking_cache_sync
    set completed_at = now(), status = ${status}, records_updated = ${recordsUpdated}, error_message = ${errorMessage || null}
    where id = ${id}::bigint
  `;
  await sql`delete from booking_search_cache where last_accessed_at < now() - (${RETAIN_DAYS} || ' days')::interval`;
}
