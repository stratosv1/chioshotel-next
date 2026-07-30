import { neon } from "@neondatabase/serverless";
import { ensureGscTables } from "@/lib/gsc/store";

const DEFAULT_SITE = "sc-domain:chioshotel.gr";

export type SeoMetricSet = {
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
};

export type SeoTrendRow = {
  key: string;
  label: string;
  page?: string;
  query?: string;
  country?: string;
  device?: string;
  searchAppearance?: string;
  searchType?: string;
  current: SeoMetricSet;
  previous: SeoMetricSet;
  yearAgo: SeoMetricSet | null;
  changes: {
    clicks: number;
    impressions: number;
    ctr: number;
    position: number;
  };
  yoy: {
    clicks: number;
    impressions: number;
    ctr: number;
    position: number;
  } | null;
};

export type SeoCannibalizationSignal = {
  query: string;
  totalClicks: number;
  totalImpressions: number;
  pageCount: number;
  pages: Array<{
    page: string;
    clicks: number;
    impressions: number;
    ctr: number;
    position: number;
  }>;
};

export type SeoDecisionMemory = {
  analysisDate: string;
  headline: string;
  verdict: string;
  primaryAction: string;
  findings: Array<{
    title: string;
    action: string;
    classification?: string;
    impact?: string;
  }>;
};

export type SeoDecisionContext = {
  generatedAt: string;
  siteUrl: string;
  latestCompleteDate: string | null;
  windows: {
    current: string;
    previous: string;
    yearAgo: string;
  } | null;
  site: {
    current: SeoMetricSet;
    previous: SeoMetricSet;
    yearAgo: SeoMetricSet | null;
    changes: SeoTrendRow["changes"];
    yoy: SeoTrendRow["yoy"];
  } | null;
  pageTrends: SeoTrendRow[];
  pageDeclines: SeoTrendRow[];
  lowCtrPages: SeoTrendRow[];
  queryTrends: SeoTrendRow[];
  queryLosses: SeoTrendRow[];
  queryGains: SeoTrendRow[];
  opportunities: SeoTrendRow[];
  countries: SeoTrendRow[];
  devices: SeoTrendRow[];
  searchAppearances: SeoTrendRow[];
  searchTypes: SeoTrendRow[];
  cannibalization: SeoCannibalizationSignal[];
  decisionMemory: SeoDecisionMemory[];
  coverage: {
    pageRows: number;
    queryRows: number;
    countryRows: number;
    deviceRows: number;
    appearanceRows: number;
    searchTypeRows: number;
    cannibalizationSignals: number;
  };
};

function getSql() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error("DATABASE_URL is not configured.");
  return neon(databaseUrl);
}

function num(value: unknown) {
  const parsed = Number(value || 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

function pctChange(current: number, previous: number) {
  if (previous <= 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}

function metrics(row: any, prefix: "current" | "previous" | "year") : SeoMetricSet {
  return {
    clicks: num(row?.[`${prefix}_clicks`]),
    impressions: num(row?.[`${prefix}_impressions`]),
    ctr: num(row?.[`${prefix}_ctr`]),
    position: num(row?.[`${prefix}_position`]),
  };
}

function toTrend(row: any, keyField: string, labelField = keyField): SeoTrendRow {
  const current = metrics(row, "current");
  const previous = metrics(row, "previous");
  const yearCandidate = metrics(row, "year");
  const yearAgo = yearCandidate.impressions > 0 ? yearCandidate : null;
  const key = String(row?.[keyField] || "");
  const label = String(row?.[labelField] || key);

  return {
    key,
    label,
    page: row?.page ? String(row.page) : undefined,
    query: row?.query ? String(row.query) : undefined,
    country: row?.country ? String(row.country) : undefined,
    device: row?.device ? String(row.device) : undefined,
    searchAppearance: row?.search_appearance ? String(row.search_appearance) : undefined,
    searchType: row?.search_type ? String(row.search_type) : undefined,
    current,
    previous,
    yearAgo,
    changes: {
      clicks: pctChange(current.clicks, previous.clicks),
      impressions: pctChange(current.impressions, previous.impressions),
      ctr: pctChange(current.ctr, previous.ctr),
      position:
        current.position > 0 && previous.position > 0
          ? current.position - previous.position
          : 0,
    },
    yoy: yearAgo
      ? {
          clicks: pctChange(current.clicks, yearAgo.clicks),
          impressions: pctChange(current.impressions, yearAgo.impressions),
          ctr: pctChange(current.ctr, yearAgo.ctr),
          position:
            current.position > 0 && yearAgo.position > 0
              ? current.position - yearAgo.position
              : 0,
        }
      : null,
  };
}

function impactScore(row: SeoTrendRow) {
  const volume = Math.log10(Math.max(1, row.current.impressions + row.previous.impressions)) * 10;
  const clickMove = Math.min(80, Math.abs(row.changes.clicks));
  const impressionMove = Math.min(50, Math.abs(row.changes.impressions)) * 0.5;
  const positionMove = Math.min(10, Math.abs(row.changes.position)) * 6;
  return volume + clickMove + impressionMove + positionMove;
}

function windowLabel(latestDate: string, startOffset: number, endOffset: number) {
  const latest = new Date(`${latestDate}T00:00:00Z`);
  const start = new Date(latest);
  const end = new Date(latest);
  start.setUTCDate(start.getUTCDate() + startOffset);
  end.setUTCDate(end.getUTCDate() + endOffset);
  return `${start.toISOString().slice(0, 10)} → ${end.toISOString().slice(0, 10)}`;
}

function safeMemory(row: any): SeoDecisionMemory | null {
  const interpretation = row?.payload?.aiInterpretation;
  if (!interpretation?.headline) return null;
  return {
    analysisDate: String(row.analysis_date || ""),
    headline: String(interpretation.headline || ""),
    verdict: String(interpretation.verdict || ""),
    primaryAction: String(interpretation.primaryAction || ""),
    findings: Array.isArray(interpretation.findings)
      ? interpretation.findings.slice(0, 5).map((item: any) => ({
          title: String(item?.title || ""),
          action: String(item?.action || ""),
          classification: item?.classification ? String(item.classification) : undefined,
          impact: item?.impact ? String(item.impact) : undefined,
        }))
      : [],
  };
}

export async function buildSeoDecisionContext(
  siteUrl = DEFAULT_SITE,
): Promise<SeoDecisionContext> {
  await ensureGscTables();
  const sql = getSql();

  const latestRows = await sql`
    select max(date)::text as latest_date
    from gsc_search_analytics
    where site_url = ${siteUrl}
      and search_type = 'web'
      and grain = 'daily'
      and is_incomplete = false
  `;
  const latestCompleteDate = String((latestRows as any[])?.[0]?.latest_date || "");

  const empty: SeoDecisionContext = {
    generatedAt: new Date().toISOString(),
    siteUrl,
    latestCompleteDate: latestCompleteDate || null,
    windows: null,
    site: null,
    pageTrends: [],
    pageDeclines: [],
    lowCtrPages: [],
    queryTrends: [],
    queryLosses: [],
    queryGains: [],
    opportunities: [],
    countries: [],
    devices: [],
    searchAppearances: [],
    searchTypes: [],
    cannibalization: [],
    decisionMemory: [],
    coverage: {
      pageRows: 0,
      queryRows: 0,
      countryRows: 0,
      deviceRows: 0,
      appearanceRows: 0,
      searchTypeRows: 0,
      cannibalizationSignals: 0,
    },
  };

  if (!latestCompleteDate) return empty;

  const trendSql = (grain: string, dimension: string, limit: number) => sql`
    with bounds as (select ${latestCompleteDate}::date as latest),
    current_period as (
      select ${sql.unsafe(dimension)} as dimension_value,
        sum(clicks)::double precision as clicks,
        sum(impressions)::double precision as impressions,
        (sum(clicks) / nullif(sum(impressions), 0))::double precision as ctr,
        (sum(position * impressions) / nullif(sum(impressions), 0))::double precision as position
      from gsc_search_analytics, bounds
      where site_url = ${siteUrl}
        and search_type = 'web'
        and grain = ${grain}
        and is_incomplete = false
        and date between latest - 27 and latest
        and ${sql.unsafe(dimension)} <> ''
      group by ${sql.unsafe(dimension)}
    ), previous_period as (
      select ${sql.unsafe(dimension)} as dimension_value,
        sum(clicks)::double precision as clicks,
        sum(impressions)::double precision as impressions,
        (sum(clicks) / nullif(sum(impressions), 0))::double precision as ctr,
        (sum(position * impressions) / nullif(sum(impressions), 0))::double precision as position
      from gsc_search_analytics, bounds
      where site_url = ${siteUrl}
        and search_type = 'web'
        and grain = ${grain}
        and is_incomplete = false
        and date between latest - 55 and latest - 28
        and ${sql.unsafe(dimension)} <> ''
      group by ${sql.unsafe(dimension)}
    ), year_period as (
      select ${sql.unsafe(dimension)} as dimension_value,
        sum(clicks)::double precision as clicks,
        sum(impressions)::double precision as impressions,
        (sum(clicks) / nullif(sum(impressions), 0))::double precision as ctr,
        (sum(position * impressions) / nullif(sum(impressions), 0))::double precision as position
      from gsc_search_analytics, bounds
      where site_url = ${siteUrl}
        and search_type = 'web'
        and grain = ${grain}
        and is_incomplete = false
        and date between (latest - interval '1 year' - interval '27 days')::date
                     and (latest - interval '1 year')::date
        and ${sql.unsafe(dimension)} <> ''
      group by ${sql.unsafe(dimension)}
    )
    select coalesce(c.dimension_value, p.dimension_value, y.dimension_value) as dimension_value,
      coalesce(c.clicks, 0)::double precision as current_clicks,
      coalesce(c.impressions, 0)::double precision as current_impressions,
      coalesce(c.ctr, 0)::double precision as current_ctr,
      coalesce(c.position, 0)::double precision as current_position,
      coalesce(p.clicks, 0)::double precision as previous_clicks,
      coalesce(p.impressions, 0)::double precision as previous_impressions,
      coalesce(p.ctr, 0)::double precision as previous_ctr,
      coalesce(p.position, 0)::double precision as previous_position,
      coalesce(y.clicks, 0)::double precision as year_clicks,
      coalesce(y.impressions, 0)::double precision as year_impressions,
      coalesce(y.ctr, 0)::double precision as year_ctr,
      coalesce(y.position, 0)::double precision as year_position
    from current_period c
    full outer join previous_period p using (dimension_value)
    full outer join year_period y using (dimension_value)
    where coalesce(c.impressions, 0) + coalesce(p.impressions, 0) + coalesce(y.impressions, 0) > 0
    order by greatest(coalesce(c.impressions, 0), coalesce(p.impressions, 0)) desc
    limit ${limit}
  `;

  const [siteRows, pageRows, queryRows, countryRows, deviceRows, appearanceRows, searchTypeRows, opportunityRows, cannibalRows, memoryRows] = await Promise.all([
    sql`
      with bounds as (select ${latestCompleteDate}::date as latest), periods as (
        select
          sum(clicks) filter (where date between latest - 27 and latest)::double precision as current_clicks,
          sum(impressions) filter (where date between latest - 27 and latest)::double precision as current_impressions,
          sum(position * impressions) filter (where date between latest - 27 and latest)::double precision as current_position_weight,
          sum(clicks) filter (where date between latest - 55 and latest - 28)::double precision as previous_clicks,
          sum(impressions) filter (where date between latest - 55 and latest - 28)::double precision as previous_impressions,
          sum(position * impressions) filter (where date between latest - 55 and latest - 28)::double precision as previous_position_weight,
          sum(clicks) filter (where date between (latest - interval '1 year' - interval '27 days')::date and (latest - interval '1 year')::date)::double precision as year_clicks,
          sum(impressions) filter (where date between (latest - interval '1 year' - interval '27 days')::date and (latest - interval '1 year')::date)::double precision as year_impressions,
          sum(position * impressions) filter (where date between (latest - interval '1 year' - interval '27 days')::date and (latest - interval '1 year')::date)::double precision as year_position_weight
        from gsc_search_analytics, bounds
        where site_url = ${siteUrl}
          and search_type = 'web'
          and grain = 'daily'
          and is_incomplete = false
      )
      select
        coalesce(current_clicks, 0)::double precision as current_clicks,
        coalesce(current_impressions, 0)::double precision as current_impressions,
        case when current_impressions > 0 then current_clicks / current_impressions else 0 end::double precision as current_ctr,
        case when current_impressions > 0 then current_position_weight / current_impressions else 0 end::double precision as current_position,
        coalesce(previous_clicks, 0)::double precision as previous_clicks,
        coalesce(previous_impressions, 0)::double precision as previous_impressions,
        case when previous_impressions > 0 then previous_clicks / previous_impressions else 0 end::double precision as previous_ctr,
        case when previous_impressions > 0 then previous_position_weight / previous_impressions else 0 end::double precision as previous_position,
        coalesce(year_clicks, 0)::double precision as year_clicks,
        coalesce(year_impressions, 0)::double precision as year_impressions,
        case when year_impressions > 0 then year_clicks / year_impressions else 0 end::double precision as year_ctr,
        case when year_impressions > 0 then year_position_weight / year_impressions else 0 end::double precision as year_position
      from periods
    `,
    trendSql("page", "page", 80),
    trendSql("query", "query", 140),
    trendSql("country", "country", 30),
    trendSql("device", "device", 10),
    trendSql("search_appearance", "search_appearance", 30),
    sql`
      with bounds as (select ${latestCompleteDate}::date as latest),
      c as (
        select search_type,
          sum(clicks)::double precision clicks,
          sum(impressions)::double precision impressions,
          (sum(clicks) / nullif(sum(impressions), 0))::double precision ctr,
          (sum(position * impressions) / nullif(sum(impressions), 0))::double precision position
        from gsc_search_analytics, bounds
        where site_url = ${siteUrl} and grain = 'daily' and is_incomplete = false
          and date between latest - 27 and latest
        group by search_type
      ), p as (
        select search_type,
          sum(clicks)::double precision clicks,
          sum(impressions)::double precision impressions,
          (sum(clicks) / nullif(sum(impressions), 0))::double precision ctr,
          (sum(position * impressions) / nullif(sum(impressions), 0))::double precision position
        from gsc_search_analytics, bounds
        where site_url = ${siteUrl} and grain = 'daily' and is_incomplete = false
          and date between latest - 55 and latest - 28
        group by search_type
      ), y as (
        select search_type,
          sum(clicks)::double precision clicks,
          sum(impressions)::double precision impressions,
          (sum(clicks) / nullif(sum(impressions), 0))::double precision ctr,
          (sum(position * impressions) / nullif(sum(impressions), 0))::double precision position
        from gsc_search_analytics, bounds
        where site_url = ${siteUrl} and grain = 'daily' and is_incomplete = false
          and date between (latest - interval '1 year' - interval '27 days')::date and (latest - interval '1 year')::date
        group by search_type
      )
      select coalesce(c.search_type, p.search_type, y.search_type) search_type,
        coalesce(c.clicks,0)::double precision current_clicks,
        coalesce(c.impressions,0)::double precision current_impressions,
        coalesce(c.ctr,0)::double precision current_ctr,
        coalesce(c.position,0)::double precision current_position,
        coalesce(p.clicks,0)::double precision previous_clicks,
        coalesce(p.impressions,0)::double precision previous_impressions,
        coalesce(p.ctr,0)::double precision previous_ctr,
        coalesce(p.position,0)::double precision previous_position,
        coalesce(y.clicks,0)::double precision year_clicks,
        coalesce(y.impressions,0)::double precision year_impressions,
        coalesce(y.ctr,0)::double precision year_ctr,
        coalesce(y.position,0)::double precision year_position
      from c full outer join p using(search_type) full outer join y using(search_type)
      order by current_impressions desc
    `,
    sql`
      with bounds as (select ${latestCompleteDate}::date as latest)
      select query, page,
        sum(clicks)::double precision as current_clicks,
        sum(impressions)::double precision as current_impressions,
        (sum(clicks) / nullif(sum(impressions), 0))::double precision as current_ctr,
        (sum(position * impressions) / nullif(sum(impressions), 0))::double precision as current_position,
        0::double precision as previous_clicks,
        0::double precision as previous_impressions,
        0::double precision as previous_ctr,
        0::double precision as previous_position,
        0::double precision as year_clicks,
        0::double precision as year_impressions,
        0::double precision as year_ctr,
        0::double precision as year_position
      from gsc_search_analytics, bounds
      where site_url = ${siteUrl}
        and search_type = 'web'
        and grain = 'query_page'
        and is_incomplete = false
        and date between latest - 27 and latest
        and query <> '' and page <> ''
      group by query, page
      having sum(impressions) >= 20
        and (sum(position * impressions) / nullif(sum(impressions), 0)) between 4 and 15
      order by impressions desc
      limit 40
    `,
    sql`
      with bounds as (select ${latestCompleteDate}::date as latest), qp as (
        select query, page,
          sum(clicks)::double precision as clicks,
          sum(impressions)::double precision as impressions,
          (sum(clicks) / nullif(sum(impressions), 0))::double precision as ctr,
          (sum(position * impressions) / nullif(sum(impressions), 0))::double precision as position
        from gsc_search_analytics, bounds
        where site_url = ${siteUrl}
          and search_type = 'web'
          and grain = 'query_page'
          and is_incomplete = false
          and date between latest - 27 and latest
          and query <> '' and page <> ''
        group by query, page
        having sum(impressions) >= 10
      )
      select query,
        sum(clicks)::double precision as total_clicks,
        sum(impressions)::double precision as total_impressions,
        count(*)::int as page_count,
        jsonb_agg(
          jsonb_build_object(
            'page', page,
            'clicks', clicks,
            'impressions', impressions,
            'ctr', ctr,
            'position', position
          ) order by impressions desc
        ) as pages
      from qp
      group by query
      having count(*) >= 2 and sum(impressions) >= 40
      order by total_impressions desc
      limit 25
    `,
    sql`
      select analysis_date::text as analysis_date, payload
      from gsc_advisor_analysis_runs
      where site_url = ${siteUrl}
      order by analysis_date desc
      limit 4
    `,
  ]);

  const siteTrend = toTrend((siteRows as any[])?.[0] || {}, "site", "site");
  const pages = (pageRows as any[]).map((row) => toTrend({ ...row, page: row.dimension_value }, "page"));
  const queries = (queryRows as any[]).map((row) => toTrend({ ...row, query: row.dimension_value }, "query"));
  const countries = (countryRows as any[]).map((row) => toTrend({ ...row, country: row.dimension_value }, "country"));
  const devices = (deviceRows as any[]).map((row) => toTrend({ ...row, device: row.dimension_value }, "device"));
  const appearances = (appearanceRows as any[]).map((row) => toTrend({ ...row, search_appearance: row.dimension_value }, "search_appearance"));
  const searchTypes = (searchTypeRows as any[]).map((row) => toTrend(row, "search_type"));
  const opportunities = (opportunityRows as any[]).map((row) =>
    toTrend(row, "query"),
  );

  const pageDeclines = pages
    .filter((row) =>
      row.previous.clicks >= 5 &&
      row.current.impressions >= 40 &&
      (row.changes.clicks <= -20 || row.changes.position >= 1.5 || row.changes.impressions <= -25),
    )
    .sort((a, b) => impactScore(b) - impactScore(a))
    .slice(0, 12);

  const lowCtrPages = pages
    .filter((row) => row.current.impressions >= 100 && row.current.position > 0 && row.current.position <= 10 && row.current.ctr < 0.02)
    .sort((a, b) => b.current.impressions - a.current.impressions)
    .slice(0, 12);

  const queryLosses = queries
    .filter((row) => row.previous.impressions + row.current.impressions >= 30 && (row.changes.clicks <= -20 || row.changes.position >= 1.5))
    .sort((a, b) => impactScore(b) - impactScore(a))
    .slice(0, 18);

  const queryGains = queries
    .filter((row) => row.current.impressions >= 20 && (row.changes.clicks >= 20 || row.changes.position <= -1.5))
    .sort((a, b) => impactScore(b) - impactScore(a))
    .slice(0, 18);

  const cannibalization: SeoCannibalizationSignal[] = (cannibalRows as any[]).map((row) => ({
    query: String(row.query || ""),
    totalClicks: num(row.total_clicks),
    totalImpressions: num(row.total_impressions),
    pageCount: num(row.page_count),
    pages: Array.isArray(row.pages)
      ? row.pages.slice(0, 5).map((page: any) => ({
          page: String(page?.page || ""),
          clicks: num(page?.clicks),
          impressions: num(page?.impressions),
          ctr: num(page?.ctr),
          position: num(page?.position),
        }))
      : [],
  }));

  const decisionMemory = (memoryRows as any[])
    .map(safeMemory)
    .filter((row): row is SeoDecisionMemory => Boolean(row));

  return {
    generatedAt: new Date().toISOString(),
    siteUrl,
    latestCompleteDate,
    windows: {
      current: windowLabel(latestCompleteDate, -27, 0),
      previous: windowLabel(latestCompleteDate, -55, -28),
      yearAgo: `${windowLabel(latestCompleteDate, -27 - 365, -365)} (approx.)`,
    },
    site: {
      current: siteTrend.current,
      previous: siteTrend.previous,
      yearAgo: siteTrend.yearAgo,
      changes: siteTrend.changes,
      yoy: siteTrend.yoy,
    },
    pageTrends: pages.slice(0, 40),
    pageDeclines,
    lowCtrPages,
    queryTrends: queries.slice(0, 70),
    queryLosses,
    queryGains,
    opportunities: opportunities.slice(0, 30),
    countries: countries.slice(0, 20),
    devices: devices.slice(0, 8),
    searchAppearances: appearances.slice(0, 20),
    searchTypes: searchTypes.slice(0, 10),
    cannibalization,
    decisionMemory,
    coverage: {
      pageRows: pages.length,
      queryRows: queries.length,
      countryRows: countries.length,
      deviceRows: devices.length,
      appearanceRows: appearances.length,
      searchTypeRows: searchTypes.length,
      cannibalizationSignals: cannibalization.length,
    },
  };
}
