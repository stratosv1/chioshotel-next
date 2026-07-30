import { neon } from "@neondatabase/serverless";
import { ensureGscTables } from "@/lib/gsc/store";

const DEFAULT_SITE = "sc-domain:chioshotel.gr";

type Dimension = "page" | "query" | "country" | "device" | "search_appearance";

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
  findings: Array<{ title: string; action: string; classification?: string; impact?: string }>;
};

export type SeoDecisionContext = {
  generatedAt: string;
  siteUrl: string;
  latestCompleteDate: string | null;
  windows: { current: string; previous: string; yearAgo: string } | null;
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

function metricSet(row: any, prefix: "current" | "previous" | "year"): SeoMetricSet {
  return {
    clicks: num(row?.[`${prefix}_clicks`]),
    impressions: num(row?.[`${prefix}_impressions`]),
    ctr: num(row?.[`${prefix}_ctr`]),
    position: num(row?.[`${prefix}_position`]),
  };
}

function toTrend(row: any, identity: Partial<SeoTrendRow>): SeoTrendRow {
  const current = metricSet(row, "current");
  const previous = metricSet(row, "previous");
  const yearCandidate = metricSet(row, "year");
  const yearAgo = yearCandidate.impressions > 0 ? yearCandidate : null;
  const key = String(identity.key || identity.label || "");
  const label = String(identity.label || key);

  return {
    key,
    label,
    page: identity.page,
    query: identity.query,
    country: identity.country,
    device: identity.device,
    searchAppearance: identity.searchAppearance,
    searchType: identity.searchType,
    current,
    previous,
    yearAgo,
    changes: {
      clicks: pctChange(current.clicks, previous.clicks),
      impressions: pctChange(current.impressions, previous.impressions),
      ctr: pctChange(current.ctr, previous.ctr),
      position: current.position > 0 && previous.position > 0 ? current.position - previous.position : 0,
    },
    yoy: yearAgo
      ? {
          clicks: pctChange(current.clicks, yearAgo.clicks),
          impressions: pctChange(current.impressions, yearAgo.impressions),
          ctr: pctChange(current.ctr, yearAgo.ctr),
          position: current.position > 0 && yearAgo.position > 0 ? current.position - yearAgo.position : 0,
        }
      : null,
  };
}

function impactScore(row: SeoTrendRow) {
  const volume = Math.log10(Math.max(1, row.current.impressions + row.previous.impressions)) * 10;
  return (
    volume +
    Math.min(80, Math.abs(row.changes.clicks)) +
    Math.min(50, Math.abs(row.changes.impressions)) * 0.5 +
    Math.min(10, Math.abs(row.changes.position)) * 6
  );
}

function dateWindow(latestDate: string, startOffset: number, endOffset: number) {
  const latest = new Date(`${latestDate}T00:00:00Z`);
  const start = new Date(latest);
  const end = new Date(latest);
  start.setUTCDate(start.getUTCDate() + startOffset);
  end.setUTCDate(end.getUTCDate() + endOffset);
  return `${start.toISOString().slice(0, 10)} → ${end.toISOString().slice(0, 10)}`;
}

function previousYearWindow(latestDate: string) {
  const latest = new Date(`${latestDate}T00:00:00Z`);
  latest.setUTCFullYear(latest.getUTCFullYear() - 1);
  const start = new Date(latest);
  start.setUTCDate(start.getUTCDate() - 27);
  return `${start.toISOString().slice(0, 10)} → ${latest.toISOString().slice(0, 10)}`;
}

function dimensionIdentity(dimension: Dimension, value: string): Partial<SeoTrendRow> {
  if (dimension === "page") return { key: value, label: value, page: value };
  if (dimension === "query") return { key: value, label: value, query: value };
  if (dimension === "country") return { key: value, label: value.toUpperCase(), country: value };
  if (dimension === "device") return { key: value, label: value, device: value };
  return { key: value, label: value, searchAppearance: value };
}

function memoryFromRow(row: any): SeoDecisionMemory | null {
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

export async function buildSeoDecisionContext(siteUrl = DEFAULT_SITE): Promise<SeoDecisionContext> {
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
    generatedAt: new Date().toISOString(), siteUrl, latestCompleteDate: latestCompleteDate || null, windows: null, site: null,
    pageTrends: [], pageDeclines: [], lowCtrPages: [], queryTrends: [], queryLosses: [], queryGains: [], opportunities: [],
    countries: [], devices: [], searchAppearances: [], searchTypes: [], cannibalization: [], decisionMemory: [],
    coverage: { pageRows: 0, queryRows: 0, countryRows: 0, deviceRows: 0, appearanceRows: 0, searchTypeRows: 0, cannibalizationSignals: 0 },
  };
  if (!latestCompleteDate) return empty;

  async function trendByDimension(grain: string, dimension: Dimension, limit: number) {
    const rows = await sql`
      with bounds as (select ${latestCompleteDate}::date as latest), source as (
        select date, clicks, impressions, position,
          case
            when ${dimension} = 'page' then page
            when ${dimension} = 'query' then query
            when ${dimension} = 'country' then country
            when ${dimension} = 'device' then device
            when ${dimension} = 'search_appearance' then search_appearance
            else ''
          end as dimension_value
        from gsc_search_analytics, bounds
        where site_url = ${siteUrl}
          and search_type = 'web'
          and grain = ${grain}
          and is_incomplete = false
      ), c as (
        select dimension_value,
          sum(clicks)::double precision clicks,
          sum(impressions)::double precision impressions,
          (sum(clicks) / nullif(sum(impressions), 0))::double precision ctr,
          (sum(position * impressions) / nullif(sum(impressions), 0))::double precision position
        from source, bounds
        where date between latest - 27 and latest and dimension_value <> ''
        group by dimension_value
      ), p as (
        select dimension_value,
          sum(clicks)::double precision clicks,
          sum(impressions)::double precision impressions,
          (sum(clicks) / nullif(sum(impressions), 0))::double precision ctr,
          (sum(position * impressions) / nullif(sum(impressions), 0))::double precision position
        from source, bounds
        where date between latest - 55 and latest - 28 and dimension_value <> ''
        group by dimension_value
      ), y as (
        select dimension_value,
          sum(clicks)::double precision clicks,
          sum(impressions)::double precision impressions,
          (sum(clicks) / nullif(sum(impressions), 0))::double precision ctr,
          (sum(position * impressions) / nullif(sum(impressions), 0))::double precision position
        from source, bounds
        where date between (latest - interval '1 year' - interval '27 days')::date and (latest - interval '1 year')::date
          and dimension_value <> ''
        group by dimension_value
      )
      select coalesce(c.dimension_value, p.dimension_value, y.dimension_value) dimension_value,
        coalesce(c.clicks,0)::double precision current_clicks, coalesce(c.impressions,0)::double precision current_impressions,
        coalesce(c.ctr,0)::double precision current_ctr, coalesce(c.position,0)::double precision current_position,
        coalesce(p.clicks,0)::double precision previous_clicks, coalesce(p.impressions,0)::double precision previous_impressions,
        coalesce(p.ctr,0)::double precision previous_ctr, coalesce(p.position,0)::double precision previous_position,
        coalesce(y.clicks,0)::double precision year_clicks, coalesce(y.impressions,0)::double precision year_impressions,
        coalesce(y.ctr,0)::double precision year_ctr, coalesce(y.position,0)::double precision year_position
      from c full outer join p using(dimension_value) full outer join y using(dimension_value)
      where coalesce(c.impressions,0) + coalesce(p.impressions,0) + coalesce(y.impressions,0) > 0
      order by greatest(coalesce(c.impressions,0), coalesce(p.impressions,0)) desc
      limit ${limit}
    `;
    return (rows as any[]).map((row) => {
      const value = String(row.dimension_value || "");
      return toTrend(row, dimensionIdentity(dimension, value));
    });
  }

  const [siteRows, pages, queries, countries, devices, appearances, searchTypeRows, opportunityRows, cannibalRows] = await Promise.all([
    sql`
      with bounds as (select ${latestCompleteDate}::date as latest), periods as (
        select
          sum(clicks) filter (where date between latest - 27 and latest)::double precision current_clicks,
          sum(impressions) filter (where date between latest - 27 and latest)::double precision current_impressions,
          sum(position * impressions) filter (where date between latest - 27 and latest)::double precision current_position_weight,
          sum(clicks) filter (where date between latest - 55 and latest - 28)::double precision previous_clicks,
          sum(impressions) filter (where date between latest - 55 and latest - 28)::double precision previous_impressions,
          sum(position * impressions) filter (where date between latest - 55 and latest - 28)::double precision previous_position_weight,
          sum(clicks) filter (where date between (latest - interval '1 year' - interval '27 days')::date and (latest - interval '1 year')::date)::double precision year_clicks,
          sum(impressions) filter (where date between (latest - interval '1 year' - interval '27 days')::date and (latest - interval '1 year')::date)::double precision year_impressions,
          sum(position * impressions) filter (where date between (latest - interval '1 year' - interval '27 days')::date and (latest - interval '1 year')::date)::double precision year_position_weight
        from gsc_search_analytics, bounds
        where site_url = ${siteUrl} and search_type = 'web' and grain = 'daily' and is_incomplete = false
      ) select
        coalesce(current_clicks,0)::double precision current_clicks, coalesce(current_impressions,0)::double precision current_impressions,
        case when current_impressions > 0 then current_clicks/current_impressions else 0 end::double precision current_ctr,
        case when current_impressions > 0 then current_position_weight/current_impressions else 0 end::double precision current_position,
        coalesce(previous_clicks,0)::double precision previous_clicks, coalesce(previous_impressions,0)::double precision previous_impressions,
        case when previous_impressions > 0 then previous_clicks/previous_impressions else 0 end::double precision previous_ctr,
        case when previous_impressions > 0 then previous_position_weight/previous_impressions else 0 end::double precision previous_position,
        coalesce(year_clicks,0)::double precision year_clicks, coalesce(year_impressions,0)::double precision year_impressions,
        case when year_impressions > 0 then year_clicks/year_impressions else 0 end::double precision year_ctr,
        case when year_impressions > 0 then year_position_weight/year_impressions else 0 end::double precision year_position
      from periods
    `,
    trendByDimension("page", "page", 80),
    trendByDimension("query", "query", 140),
    trendByDimension("country", "country", 30),
    trendByDimension("device", "device", 10),
    trendByDimension("search_appearance", "search_appearance", 30),
    sql`
      with bounds as (select ${latestCompleteDate}::date as latest), c as (
        select search_type, sum(clicks)::double precision clicks, sum(impressions)::double precision impressions,
          (sum(clicks)/nullif(sum(impressions),0))::double precision ctr,
          (sum(position*impressions)/nullif(sum(impressions),0))::double precision position
        from gsc_search_analytics, bounds where site_url=${siteUrl} and grain='daily' and is_incomplete=false and date between latest-27 and latest group by search_type
      ), p as (
        select search_type, sum(clicks)::double precision clicks, sum(impressions)::double precision impressions,
          (sum(clicks)/nullif(sum(impressions),0))::double precision ctr,
          (sum(position*impressions)/nullif(sum(impressions),0))::double precision position
        from gsc_search_analytics, bounds where site_url=${siteUrl} and grain='daily' and is_incomplete=false and date between latest-55 and latest-28 group by search_type
      ), y as (
        select search_type, sum(clicks)::double precision clicks, sum(impressions)::double precision impressions,
          (sum(clicks)/nullif(sum(impressions),0))::double precision ctr,
          (sum(position*impressions)/nullif(sum(impressions),0))::double precision position
        from gsc_search_analytics, bounds where site_url=${siteUrl} and grain='daily' and is_incomplete=false
          and date between (latest-interval '1 year'-interval '27 days')::date and (latest-interval '1 year')::date group by search_type
      ) select coalesce(c.search_type,p.search_type,y.search_type) search_type,
        coalesce(c.clicks,0)::double precision current_clicks, coalesce(c.impressions,0)::double precision current_impressions, coalesce(c.ctr,0)::double precision current_ctr, coalesce(c.position,0)::double precision current_position,
        coalesce(p.clicks,0)::double precision previous_clicks, coalesce(p.impressions,0)::double precision previous_impressions, coalesce(p.ctr,0)::double precision previous_ctr, coalesce(p.position,0)::double precision previous_position,
        coalesce(y.clicks,0)::double precision year_clicks, coalesce(y.impressions,0)::double precision year_impressions, coalesce(y.ctr,0)::double precision year_ctr, coalesce(y.position,0)::double precision year_position
      from c full outer join p using(search_type) full outer join y using(search_type) order by current_impressions desc
    `,
    sql`
      with bounds as (select ${latestCompleteDate}::date as latest)
      select query,page,sum(clicks)::double precision current_clicks,sum(impressions)::double precision current_impressions,
        (sum(clicks)/nullif(sum(impressions),0))::double precision current_ctr,
        (sum(position*impressions)/nullif(sum(impressions),0))::double precision current_position,
        0::double precision previous_clicks,0::double precision previous_impressions,0::double precision previous_ctr,0::double precision previous_position,
        0::double precision year_clicks,0::double precision year_impressions,0::double precision year_ctr,0::double precision year_position
      from gsc_search_analytics,bounds
      where site_url=${siteUrl} and search_type='web' and grain='query_page' and is_incomplete=false and date between latest-27 and latest and query<>'' and page<>''
      group by query,page having sum(impressions)>=20 and (sum(position*impressions)/nullif(sum(impressions),0)) between 4 and 15
      order by current_impressions desc limit 40
    `,
    sql`
      with bounds as (select ${latestCompleteDate}::date as latest), qp as (
        select query,page,sum(clicks)::double precision clicks,sum(impressions)::double precision impressions,
          (sum(clicks)/nullif(sum(impressions),0))::double precision ctr,
          (sum(position*impressions)/nullif(sum(impressions),0))::double precision position
        from gsc_search_analytics,bounds
        where site_url=${siteUrl} and search_type='web' and grain='query_page' and is_incomplete=false and date between latest-27 and latest and query<>'' and page<>''
        group by query,page having sum(impressions)>=10
      ) select query,sum(clicks)::double precision total_clicks,sum(impressions)::double precision total_impressions,count(*)::int page_count,
        jsonb_agg(jsonb_build_object('page',page,'clicks',clicks,'impressions',impressions,'ctr',ctr,'position',position) order by impressions desc) pages
      from qp group by query having count(*)>=2 and sum(impressions)>=40 order by total_impressions desc limit 25
    `,
  ]);

  let memoryRows: any[] = [];
  try {
    memoryRows = (await sql`
      select analysis_date::text analysis_date,payload from gsc_advisor_analysis_runs
      where site_url=${siteUrl} order by analysis_date desc limit 4
    `) as any[];
  } catch (error) {
    console.warn("[gsc-analysis] decision memory unavailable", error);
  }

  const siteTrend = toTrend((siteRows as any[])?.[0] || {}, { key: "site", label: "Site" });
  const searchTypes = (searchTypeRows as any[]).map((row) => {
    const value = String(row.search_type || "");
    return toTrend(row, { key: value, label: value, searchType: value });
  });
  const opportunities = (opportunityRows as any[]).map((row) => {
    const query = String(row.query || "");
    return toTrend(row, { key: `${query}|${String(row.page || "")}`, label: query, query, page: String(row.page || "") });
  });

  const pageDeclines = pages.filter((row) => row.previous.clicks>=5 && row.current.impressions>=40 && (row.changes.clicks<=-20 || row.changes.position>=1.5 || row.changes.impressions<=-25)).sort((a,b)=>impactScore(b)-impactScore(a)).slice(0,12);
  const lowCtrPages = pages.filter((row) => row.current.impressions>=100 && row.current.position>0 && row.current.position<=10 && row.current.ctr<0.02).sort((a,b)=>b.current.impressions-a.current.impressions).slice(0,12);
  const queryLosses = queries.filter((row) => row.previous.impressions+row.current.impressions>=30 && (row.changes.clicks<=-20 || row.changes.position>=1.5)).sort((a,b)=>impactScore(b)-impactScore(a)).slice(0,18);
  const queryGains = queries.filter((row) => row.current.impressions>=20 && (row.changes.clicks>=20 || row.changes.position<=-1.5)).sort((a,b)=>impactScore(b)-impactScore(a)).slice(0,18);

  const cannibalization: SeoCannibalizationSignal[] = (cannibalRows as any[]).map((row) => ({
    query: String(row.query || ""), totalClicks: num(row.total_clicks), totalImpressions: num(row.total_impressions), pageCount: num(row.page_count),
    pages: Array.isArray(row.pages) ? row.pages.slice(0,5).map((page:any)=>({ page:String(page?.page||""), clicks:num(page?.clicks), impressions:num(page?.impressions), ctr:num(page?.ctr), position:num(page?.position) })) : [],
  }));
  const decisionMemory = memoryRows.map(memoryFromRow).filter((row): row is SeoDecisionMemory => Boolean(row));

  return {
    generatedAt:new Date().toISOString(), siteUrl, latestCompleteDate,
    windows:{ current:dateWindow(latestCompleteDate,-27,0), previous:dateWindow(latestCompleteDate,-55,-28), yearAgo:previousYearWindow(latestCompleteDate) },
    site:{ current:siteTrend.current, previous:siteTrend.previous, yearAgo:siteTrend.yearAgo, changes:siteTrend.changes, yoy:siteTrend.yoy },
    pageTrends:pages.slice(0,40), pageDeclines, lowCtrPages,
    queryTrends:queries.slice(0,70), queryLosses, queryGains, opportunities:opportunities.slice(0,30),
    countries:countries.slice(0,20), devices:devices.slice(0,8), searchAppearances:appearances.slice(0,20), searchTypes:searchTypes.slice(0,10),
    cannibalization, decisionMemory,
    coverage:{ pageRows:pages.length, queryRows:queries.length, countryRows:countries.length, deviceRows:devices.length, appearanceRows:appearances.length, searchTypeRows:searchTypes.length, cannibalizationSignals:cannibalization.length },
  };
}
