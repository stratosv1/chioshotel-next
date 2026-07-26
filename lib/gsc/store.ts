import { neon } from "@neondatabase/serverless";

export type StoredGscRow = {
  siteUrl: string;
  searchType: string;
  grain: string;
  date: string;
  query: string;
  page: string;
  country: string;
  device: string;
  searchAppearance: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
  dataState: string;
  isIncomplete: boolean;
};

function getSql() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error("DATABASE_URL is not configured.");
  return neon(databaseUrl);
}

export async function ensureGscTables() {
  const sql = getSql();

  await sql`
    create table if not exists gsc_search_analytics (
      site_url text not null,
      search_type text not null,
      grain text not null,
      date date not null,
      query text not null default '',
      page text not null default '',
      country text not null default '',
      device text not null default '',
      search_appearance text not null default '',
      clicks double precision not null default 0,
      impressions double precision not null default 0,
      ctr double precision not null default 0,
      position double precision not null default 0,
      data_state text not null default 'all',
      is_incomplete boolean not null default false,
      updated_at timestamptz not null default now(),
      primary key (site_url, search_type, grain, date, query, page, country, device, search_appearance)
    )
  `;

  await sql`
    create table if not exists gsc_sync_runs (
      id bigserial primary key,
      site_url text not null,
      start_date date not null,
      end_date date not null,
      started_at timestamptz not null default now(),
      completed_at timestamptz,
      status text not null default 'running',
      rows_written integer not null default 0,
      datasets integer not null default 0,
      error_message text
    )
  `;

  await sql`
    create table if not exists gsc_properties_snapshot (
      site_url text primary key,
      permission_level text,
      payload jsonb not null,
      updated_at timestamptz not null default now()
    )
  `;

  await sql`
    create table if not exists gsc_sitemaps_snapshot (
      site_url text not null,
      sitemap_path text not null,
      payload jsonb not null,
      updated_at timestamptz not null default now(),
      primary key (site_url, sitemap_path)
    )
  `;

  await sql`create index if not exists gsc_analytics_date_idx on gsc_search_analytics (date desc)`;
  await sql`create index if not exists gsc_analytics_query_idx on gsc_search_analytics (grain, query, date desc) where query <> ''`;
  await sql`create index if not exists gsc_analytics_page_idx on gsc_search_analytics (grain, page, date desc) where page <> ''`;
  await sql`create index if not exists gsc_sync_runs_started_idx on gsc_sync_runs (started_at desc)`;
}

export async function startGscSyncRun(siteUrl: string, startDate: string, endDate: string) {
  const sql = getSql();
  await ensureGscTables();
  const rows = await sql`
    insert into gsc_sync_runs (site_url, start_date, end_date)
    values (${siteUrl}, ${startDate}::date, ${endDate}::date)
    returning id::text
  `;
  return String((rows as any[])?.[0]?.id || "");
}

export async function finishGscSyncRun(
  id: string,
  status: "success" | "failed",
  rowsWritten: number,
  datasets: number,
  errorMessage = "",
) {
  if (!id) return;
  const sql = getSql();
  await sql`
    update gsc_sync_runs
    set completed_at = now(), status = ${status}, rows_written = ${rowsWritten}, datasets = ${datasets}, error_message = ${errorMessage || null}
    where id = ${id}::bigint
  `;
}

export async function replaceGscDataset(
  siteUrl: string,
  searchType: string,
  grain: string,
  startDate: string,
  endDate: string,
  rows: StoredGscRow[],
) {
  const sql = getSql();
  const payload = JSON.stringify(rows);

  await sql`
    with removed as (
      delete from gsc_search_analytics
      where site_url = ${siteUrl}
        and search_type = ${searchType}
        and grain = ${grain}
        and date between ${startDate}::date and ${endDate}::date
    ), incoming as (
      select *
      from jsonb_to_recordset(${payload}::jsonb) as x(
        "siteUrl" text,
        "searchType" text,
        grain text,
        date text,
        query text,
        page text,
        country text,
        device text,
        "searchAppearance" text,
        clicks double precision,
        impressions double precision,
        ctr double precision,
        position double precision,
        "dataState" text,
        "isIncomplete" boolean
      )
    )
    insert into gsc_search_analytics (
      site_url, search_type, grain, date, query, page, country, device, search_appearance,
      clicks, impressions, ctr, position, data_state, is_incomplete, updated_at
    )
    select
      "siteUrl", "searchType", grain, date::date, query, page, country, device, "searchAppearance",
      clicks, impressions, ctr, position, "dataState", "isIncomplete", now()
    from incoming
    on conflict (site_url, search_type, grain, date, query, page, country, device, search_appearance)
    do update set
      clicks = excluded.clicks,
      impressions = excluded.impressions,
      ctr = excluded.ctr,
      position = excluded.position,
      data_state = excluded.data_state,
      is_incomplete = excluded.is_incomplete,
      updated_at = now()
  `;
}

export async function savePropertiesSnapshot(entries: Array<{ siteUrl: string; permissionLevel: string }>) {
  if (!entries.length) return;
  const sql = getSql();
  await ensureGscTables();
  const payload = JSON.stringify(entries);
  await sql`
    insert into gsc_properties_snapshot (site_url, permission_level, payload, updated_at)
    select "siteUrl", "permissionLevel", to_jsonb(x), now()
    from jsonb_to_recordset(${payload}::jsonb) as x("siteUrl" text, "permissionLevel" text)
    on conflict (site_url) do update set
      permission_level = excluded.permission_level,
      payload = excluded.payload,
      updated_at = now()
  `;
}

export async function saveSitemapsSnapshot(siteUrl: string, sitemaps: Array<Record<string, unknown>>) {
  const sql = getSql();
  await ensureGscTables();
  await sql`delete from gsc_sitemaps_snapshot where site_url = ${siteUrl}`;
  if (!sitemaps.length) return;

  const normalized = sitemaps.map((item) => ({
    siteUrl,
    path: String(item.path || ""),
    payload: item,
  })).filter((item) => item.path);
  if (!normalized.length) return;

  await sql`
    insert into gsc_sitemaps_snapshot (site_url, sitemap_path, payload, updated_at)
    select "siteUrl", path, payload, now()
    from jsonb_to_recordset(${JSON.stringify(normalized)}::jsonb) as x("siteUrl" text, path text, payload jsonb)
    on conflict (site_url, sitemap_path) do update set payload = excluded.payload, updated_at = now()
  `;
}

export async function getGscCoverageState(siteUrl: string) {
  const sql = getSql();
  await ensureGscTables();
  const rows = await sql`
    select
      min(date)::text as earliest_date,
      max(date)::text as latest_date,
      count(*)::bigint::text as row_count,
      count(distinct search_type)::integer as search_types,
      count(distinct grain)::integer as grains
    from gsc_search_analytics
    where site_url = ${siteUrl}
  `;
  const lastRuns = await sql`
    select id::text, start_date::text, end_date::text, started_at, completed_at, status, rows_written, datasets, error_message
    from gsc_sync_runs
    where site_url = ${siteUrl}
    order by started_at desc
    limit 10
  `;
  return { coverage: (rows as any[])?.[0] || null, recentRuns: lastRuns };
}

export async function getGscEvaluationReport(siteUrl: string, days = 28, searchType = "web") {
  const sql = getSql();
  await ensureGscTables();
  const safeDays = Math.max(1, Math.min(180, Math.trunc(days)));

  const totals = await sql`
    select
      coalesce(sum(clicks), 0)::double precision as clicks,
      coalesce(sum(impressions), 0)::double precision as impressions,
      case when sum(impressions) > 0 then sum(clicks) / sum(impressions) else 0 end::double precision as ctr,
      case when sum(impressions) > 0 then sum(position * impressions) / sum(impressions) else 0 end::double precision as position
    from gsc_search_analytics
    where site_url = ${siteUrl}
      and search_type = ${searchType}
      and grain = 'daily'
      and date >= current_date - (${safeDays} - 1)
  `;

  const topQueries = await sql`
    select query,
      sum(clicks)::double precision as clicks,
      sum(impressions)::double precision as impressions,
      (sum(clicks) / nullif(sum(impressions), 0))::double precision as ctr,
      (sum(position * impressions) / nullif(sum(impressions), 0))::double precision as position
    from gsc_search_analytics
    where site_url = ${siteUrl} and search_type = ${searchType} and grain = 'query'
      and date >= current_date - (${safeDays} - 1)
    group by query
    order by impressions desc
    limit 100
  `;

  const topPages = await sql`
    select page,
      sum(clicks)::double precision as clicks,
      sum(impressions)::double precision as impressions,
      (sum(clicks) / nullif(sum(impressions), 0))::double precision as ctr,
      (sum(position * impressions) / nullif(sum(impressions), 0))::double precision as position
    from gsc_search_analytics
    where site_url = ${siteUrl} and search_type = ${searchType} and grain = 'page'
      and date >= current_date - (${safeDays} - 1)
    group by page
    order by impressions desc
    limit 100
  `;

  const opportunities = await sql`
    select query, page,
      sum(clicks)::double precision as clicks,
      sum(impressions)::double precision as impressions,
      (sum(clicks) / nullif(sum(impressions), 0))::double precision as ctr,
      (sum(position * impressions) / nullif(sum(impressions), 0))::double precision as position
    from gsc_search_analytics
    where site_url = ${siteUrl} and search_type = ${searchType} and grain = 'query_page'
      and date >= current_date - (${safeDays} - 1)
    group by query, page
    having sum(impressions) >= 20
      and (sum(position * impressions) / nullif(sum(impressions), 0)) between 4 and 20
    order by impressions desc
    limit 100
  `;

  return {
    generatedAt: new Date().toISOString(),
    siteUrl,
    searchType,
    days: safeDays,
    totals: (totals as any[])?.[0] || null,
    topQueries,
    topPages,
    opportunities,
  };
}
