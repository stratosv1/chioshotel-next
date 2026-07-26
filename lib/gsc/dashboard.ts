import { neon } from "@neondatabase/serverless";
import { ensureGscTables, getGscEvaluationReport } from "@/lib/gsc/store";

const DEFAULT_SITE = "sc-domain:chioshotel.gr";

function getSql() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error("DATABASE_URL is not configured.");
  return neon(databaseUrl);
}

export async function getGscDashboardData(siteUrl = DEFAULT_SITE) {
  await ensureGscTables();
  const sql = getSql();

  const [coverageRows, latestRunRows, typeRows, datasetRows, countryRows, deviceRows, appearanceRows, propertyRows, sitemapRows, report] = await Promise.all([
    sql`
      select
        min(date)::text as earliest_date,
        max(date)::text as latest_date,
        count(*)::bigint::text as row_count,
        count(distinct search_type)::integer as search_types,
        count(distinct grain)::integer as grains,
        count(*) filter (where is_incomplete)::bigint::text as incomplete_rows
      from gsc_search_analytics
      where site_url = ${siteUrl}
    `,
    sql`
      select id::text, start_date::text, end_date::text, started_at, completed_at,
        status, rows_written, datasets, error_message
      from gsc_sync_runs
      where site_url = ${siteUrl}
      order by started_at desc
      limit 1
    `,
    sql`
      select search_type,
        count(*)::integer as days,
        min(date)::text as earliest_date,
        max(date)::text as latest_date,
        coalesce(sum(clicks), 0)::double precision as clicks,
        coalesce(sum(impressions), 0)::double precision as impressions,
        case when sum(impressions) > 0 then sum(clicks) / sum(impressions) else 0 end::double precision as ctr,
        case when sum(impressions) > 0 then sum(position * impressions) / sum(impressions) else 0 end::double precision as position
      from gsc_search_analytics
      where site_url = ${siteUrl} and grain = 'daily'
      group by search_type
      order by impressions desc, search_type
    `,
    sql`
      select search_type, grain,
        count(*)::bigint::text as row_count,
        min(date)::text as earliest_date,
        max(date)::text as latest_date
      from gsc_search_analytics
      where site_url = ${siteUrl}
      group by search_type, grain
      order by search_type, grain
    `,
    sql`
      select country,
        sum(clicks)::double precision as clicks,
        sum(impressions)::double precision as impressions,
        (sum(clicks) / nullif(sum(impressions), 0))::double precision as ctr,
        (sum(position * impressions) / nullif(sum(impressions), 0))::double precision as position
      from gsc_search_analytics
      where site_url = ${siteUrl} and search_type = 'web' and grain = 'country'
        and date >= current_date - 27
      group by country
      order by impressions desc
      limit 20
    `,
    sql`
      select device,
        sum(clicks)::double precision as clicks,
        sum(impressions)::double precision as impressions,
        (sum(clicks) / nullif(sum(impressions), 0))::double precision as ctr,
        (sum(position * impressions) / nullif(sum(impressions), 0))::double precision as position
      from gsc_search_analytics
      where site_url = ${siteUrl} and search_type = 'web' and grain = 'device'
        and date >= current_date - 27
      group by device
      order by impressions desc
    `,
    sql`
      select search_appearance,
        sum(clicks)::double precision as clicks,
        sum(impressions)::double precision as impressions,
        (sum(clicks) / nullif(sum(impressions), 0))::double precision as ctr
      from gsc_search_analytics
      where site_url = ${siteUrl} and search_type = 'web' and grain = 'search_appearance'
        and date >= current_date - 27 and search_appearance <> ''
      group by search_appearance
      order by impressions desc
      limit 20
    `,
    sql`
      select site_url, permission_level, updated_at
      from gsc_properties_snapshot
      order by site_url
    `,
    sql`
      select sitemap_path, updated_at, payload
      from gsc_sitemaps_snapshot
      where site_url = ${siteUrl}
      order by sitemap_path
    `,
    getGscEvaluationReport(siteUrl, 28, "web"),
  ]);

  return {
    generatedAt: new Date().toISOString(),
    siteUrl,
    coverage: (coverageRows as any[])?.[0] || null,
    latestRun: (latestRunRows as any[])?.[0] || null,
    searchTypes: typeRows as any[],
    datasets: datasetRows as any[],
    countries: countryRows as any[],
    devices: deviceRows as any[],
    appearances: appearanceRows as any[],
    properties: propertyRows as any[],
    sitemaps: sitemapRows as any[],
    report,
  };
}
