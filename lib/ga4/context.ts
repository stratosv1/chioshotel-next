import { neon } from "@neondatabase/serverless";
import { DEFAULT_GA4_PROPERTY_ID } from "@/lib/ga4/client";
import { ensureGa4Tables } from "@/lib/ga4/store";

export type Ga4SeoMetricSet = {
  sessions: number;
  engagedSessions: number;
  engagementRate: number;
  keyEvents: number;
  sessionKeyEventRate: number;
};

export type Ga4SeoTrend = {
  page: string;
  current: Ga4SeoMetricSet;
  previous: Ga4SeoMetricSet;
  changes: {
    sessions: number;
    engagedSessions: number;
    engagementRate: number;
    keyEvents: number;
    sessionKeyEventRate: number;
  };
};

export type Ga4SeoContext = {
  source: "GA4";
  channel: "Organic Search";
  propertyId: string;
  latestDate: string | null;
  windows: { current: string; previous: string } | null;
  site: {
    current: Ga4SeoMetricSet;
    previous: Ga4SeoMetricSet;
    changes: Ga4SeoTrend["changes"];
  } | null;
  landingPages: Ga4SeoTrend[];
  sessionDeclines: Ga4SeoTrend[];
  lowEngagementPages: Ga4SeoTrend[];
  coverage: { landingPageRows: number };
  note: string;
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

function dateWindow(latestDate: string, startOffset: number, endOffset: number) {
  const latest = new Date(`${latestDate}T00:00:00Z`);
  const start = new Date(latest);
  const end = new Date(latest);
  start.setUTCDate(start.getUTCDate() + startOffset);
  end.setUTCDate(end.getUTCDate() + endOffset);
  return `${start.toISOString().slice(0, 10)} → ${end.toISOString().slice(0, 10)}`;
}

function metricSet(row: any, prefix: "current" | "previous"): Ga4SeoMetricSet {
  return {
    sessions: num(row?.[`${prefix}_sessions`]),
    engagedSessions: num(row?.[`${prefix}_engaged_sessions`]),
    engagementRate: num(row?.[`${prefix}_engagement_rate`]),
    keyEvents: num(row?.[`${prefix}_key_events`]),
    sessionKeyEventRate: num(row?.[`${prefix}_session_key_event_rate`]),
  };
}

function trend(row: any): Ga4SeoTrend {
  const current = metricSet(row, "current");
  const previous = metricSet(row, "previous");
  return {
    page: String(row?.landing_page || ""),
    current,
    previous,
    changes: {
      sessions: pctChange(current.sessions, previous.sessions),
      engagedSessions: pctChange(current.engagedSessions, previous.engagedSessions),
      engagementRate: pctChange(current.engagementRate, previous.engagementRate),
      keyEvents: pctChange(current.keyEvents, previous.keyEvents),
      sessionKeyEventRate: pctChange(current.sessionKeyEventRate, previous.sessionKeyEventRate),
    },
  };
}

function emptyContext(propertyId: string): Ga4SeoContext {
  return {
    source: "GA4",
    channel: "Organic Search",
    propertyId,
    latestDate: null,
    windows: null,
    site: null,
    landingPages: [],
    sessionDeclines: [],
    lowEngagementPages: [],
    coverage: { landingPageRows: 0 },
    note: "GA4 Organic Search data are not available yet.",
  };
}

export async function getGa4SeoContext(): Promise<Ga4SeoContext> {
  await ensureGa4Tables();
  const sql = getSql();
  const propertyId = process.env.GA4_PROPERTY_ID?.trim() || DEFAULT_GA4_PROPERTY_ID;

  const latestRows = await sql`
    select max(date)::text as latest_date
    from ga4_organic_landing_pages
    where property_id = ${propertyId}
  `;
  const latestDate = String((latestRows as any[])?.[0]?.latest_date || "");
  if (!latestDate) return emptyContext(propertyId);

  const [siteRows, pageRows] = await Promise.all([
    sql`
      with bounds as (select ${latestDate}::date as latest), period as (
        select
          sum(sessions) filter (where date between latest - 27 and latest)::double precision current_sessions,
          sum(engaged_sessions) filter (where date between latest - 27 and latest)::double precision current_engaged_sessions,
          sum(key_events) filter (where date between latest - 27 and latest)::double precision current_key_events,
          sum(session_key_event_rate * sessions) filter (where date between latest - 27 and latest)::double precision current_key_session_weight,
          sum(sessions) filter (where date between latest - 55 and latest - 28)::double precision previous_sessions,
          sum(engaged_sessions) filter (where date between latest - 55 and latest - 28)::double precision previous_engaged_sessions,
          sum(key_events) filter (where date between latest - 55 and latest - 28)::double precision previous_key_events,
          sum(session_key_event_rate * sessions) filter (where date between latest - 55 and latest - 28)::double precision previous_key_session_weight
        from ga4_organic_landing_pages, bounds
        where property_id = ${propertyId}
      )
      select
        coalesce(current_sessions, 0)::double precision current_sessions,
        coalesce(current_engaged_sessions, 0)::double precision current_engaged_sessions,
        case when current_sessions > 0 then current_engaged_sessions/current_sessions else 0 end::double precision current_engagement_rate,
        coalesce(current_key_events, 0)::double precision current_key_events,
        case when current_sessions > 0 then current_key_session_weight/current_sessions else 0 end::double precision current_session_key_event_rate,
        coalesce(previous_sessions, 0)::double precision previous_sessions,
        coalesce(previous_engaged_sessions, 0)::double precision previous_engaged_sessions,
        case when previous_sessions > 0 then previous_engaged_sessions/previous_sessions else 0 end::double precision previous_engagement_rate,
        coalesce(previous_key_events, 0)::double precision previous_key_events,
        case when previous_sessions > 0 then previous_key_session_weight/previous_sessions else 0 end::double precision previous_session_key_event_rate
      from period
    `,
    sql`
      with bounds as (select ${latestDate}::date as latest), c as (
        select landing_page,
          sum(sessions)::double precision sessions,
          sum(engaged_sessions)::double precision engaged_sessions,
          (sum(engaged_sessions)/nullif(sum(sessions),0))::double precision engagement_rate,
          sum(key_events)::double precision key_events,
          (sum(session_key_event_rate*sessions)/nullif(sum(sessions),0))::double precision session_key_event_rate
        from ga4_organic_landing_pages, bounds
        where property_id=${propertyId} and date between latest-27 and latest
          and landing_page<>'' and landing_page<>'(not set)'
        group by landing_page
      ), p as (
        select landing_page,
          sum(sessions)::double precision sessions,
          sum(engaged_sessions)::double precision engaged_sessions,
          (sum(engaged_sessions)/nullif(sum(sessions),0))::double precision engagement_rate,
          sum(key_events)::double precision key_events,
          (sum(session_key_event_rate*sessions)/nullif(sum(sessions),0))::double precision session_key_event_rate
        from ga4_organic_landing_pages, bounds
        where property_id=${propertyId} and date between latest-55 and latest-28
          and landing_page<>'' and landing_page<>'(not set)'
        group by landing_page
      )
      select coalesce(c.landing_page,p.landing_page) landing_page,
        coalesce(c.sessions,0)::double precision current_sessions,
        coalesce(c.engaged_sessions,0)::double precision current_engaged_sessions,
        coalesce(c.engagement_rate,0)::double precision current_engagement_rate,
        coalesce(c.key_events,0)::double precision current_key_events,
        coalesce(c.session_key_event_rate,0)::double precision current_session_key_event_rate,
        coalesce(p.sessions,0)::double precision previous_sessions,
        coalesce(p.engaged_sessions,0)::double precision previous_engaged_sessions,
        coalesce(p.engagement_rate,0)::double precision previous_engagement_rate,
        coalesce(p.key_events,0)::double precision previous_key_events,
        coalesce(p.session_key_event_rate,0)::double precision previous_session_key_event_rate
      from c full outer join p using(landing_page)
      where coalesce(c.sessions,0)+coalesce(p.sessions,0)>0
      order by greatest(coalesce(c.sessions,0),coalesce(p.sessions,0)) desc
      limit 80
    `,
  ]);

  const siteTrend = trend({ ...(siteRows as any[])?.[0], landing_page: "Site" });
  const pages = (pageRows as any[]).map(trend);
  const sessionDeclines = pages
    .filter((row) => row.previous.sessions >= 5 && row.changes.sessions <= -25)
    .sort((a, b) => (b.previous.sessions - b.current.sessions) - (a.previous.sessions - a.current.sessions))
    .slice(0, 12);
  const lowEngagementPages = pages
    .filter((row) => row.current.sessions >= 10 && row.current.engagementRate < 0.5)
    .sort((a, b) => b.current.sessions - a.current.sessions)
    .slice(0, 12);

  return {
    source: "GA4",
    channel: "Organic Search",
    propertyId,
    latestDate,
    windows: {
      current: dateWindow(latestDate, -27, 0),
      previous: dateWindow(latestDate, -55, -28),
    },
    site: { current: siteTrend.current, previous: siteTrend.previous, changes: siteTrend.changes },
    landingPages: pages.slice(0, 40),
    sessionDeclines,
    lowEngagementPages,
    coverage: { landingPageRows: pages.length },
    note: "GA4 is used as a post-click quality signal. GSC clicks and GA4 sessions must not be treated as one-to-one counts because consent, tagging and measurement rules differ.",
  };
}
