import { neon } from "@neondatabase/serverless";

const DEFAULT_SITE = "sc-domain:chioshotel.gr";
const ANALYSIS_ANCHOR = "2026-07-30";
const ANALYSIS_INTERVAL_DAYS = 3;
const ANALYSIS_HOUR_ATHENS = 10;
const ATHENS_TZ = "Europe/Athens";

export type SeoAdvisorSnapshot = {
  analysisDate: string;
  analyzedAt: string;
  latestDataDate: string | null;
  priorityCount: number;
  newFindings: number;
  payload?: any;
};

export type LatestGscSyncState = {
  startedAt: string | null;
  completedAt: string | null;
  status: string | null;
  rowsWritten: number;
  datasets: number;
  errorMessage: string | null;
} | null;

function getSql() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error("DATABASE_URL is not configured.");
  return neon(databaseUrl);
}

function athensScheduleState(date: Date) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: ATHENS_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value || "";
  return {
    dateKey: `${get("year")}-${get("month")}-${get("day")}`,
    hour: Number(get("hour") || 0),
  };
}

function utcDayNumber(dateKey: string) {
  const [year, month, day] = dateKey.split("-").map(Number);
  return Math.floor(Date.UTC(year, month - 1, day) / 86_400_000);
}

function isScheduledAnalysisDate(dateKey: string) {
  const delta = utcDayNumber(dateKey) - utcDayNumber(ANALYSIS_ANCHOR);
  return delta >= 0 && delta % ANALYSIS_INTERVAL_DAYS === 0;
}

function hasInterpretation(payload: any) {
  return Boolean(
    payload?.aiInterpretation?.headline &&
    payload?.aiInterpretation?.executiveSummary &&
    Array.isArray(payload?.aiInterpretation?.findings),
  );
}

async function ensureSeoAdvisorSnapshotTable() {
  const sql = getSql();
  await sql`
    create table if not exists gsc_advisor_analysis_runs (
      id bigserial primary key,
      site_url text not null,
      analysis_date date not null,
      analyzed_at timestamptz not null default now(),
      latest_data_date date,
      priority_count integer not null default 0,
      new_findings integer not null default 0,
      payload jsonb not null,
      unique (site_url, analysis_date)
    )
  `;
  await sql`create index if not exists gsc_advisor_analysis_runs_latest_idx on gsc_advisor_analysis_runs (site_url, analysis_date desc)`;
}

function priorityKeys(payload: any) {
  const priorities = Array.isArray(payload?.priorities) ? payload.priorities : [];
  return new Set(
    priorities.map((item: any) =>
      [
        String(item?.severity || ""),
        String(item?.title || ""),
        String(item?.page || ""),
        String(item?.query || ""),
        String(item?.intent?.ownerPath || ""),
      ].join("|"),
    ),
  );
}

export async function saveSeoAdvisorSnapshot(
  analysisDate: string,
  payload: any,
  siteUrl = DEFAULT_SITE,
): Promise<SeoAdvisorSnapshot> {
  await ensureSeoAdvisorSnapshotTable();
  const sql = getSql();

  const previousRows = await sql`
    select payload
    from gsc_advisor_analysis_runs
    where site_url = ${siteUrl}
      and analysis_date < ${analysisDate}::date
    order by analysis_date desc
    limit 1
  `;

  const previousPayload = (previousRows as any[])?.[0]?.payload || null;
  const previousKeys = priorityKeys(previousPayload);
  const currentKeys = priorityKeys(payload);
  const newFindings = previousPayload
    ? [...currentKeys].filter((key) => !previousKeys.has(key)).length
    : currentKeys.size;
  const priorityCount = currentKeys.size;
  const latestDataDate = payload?.latestDate ? String(payload.latestDate) : null;

  const rows = await sql`
    insert into gsc_advisor_analysis_runs (
      site_url,
      analysis_date,
      analyzed_at,
      latest_data_date,
      priority_count,
      new_findings,
      payload
    ) values (
      ${siteUrl},
      ${analysisDate}::date,
      now(),
      ${latestDataDate}::date,
      ${priorityCount},
      ${newFindings},
      ${JSON.stringify(payload)}::jsonb
    )
    on conflict (site_url, analysis_date) do update set
      analyzed_at = now(),
      latest_data_date = excluded.latest_data_date,
      priority_count = excluded.priority_count,
      new_findings = excluded.new_findings,
      payload = excluded.payload
    returning
      analysis_date::text as analysis_date,
      analyzed_at,
      latest_data_date::text as latest_data_date,
      priority_count,
      new_findings
  `;

  const row = (rows as any[])?.[0] || {};
  return {
    analysisDate: String(row.analysis_date || analysisDate),
    analyzedAt: new Date(row.analyzed_at || Date.now()).toISOString(),
    latestDataDate: row.latest_data_date ? String(row.latest_data_date) : null,
    priorityCount: Number(row.priority_count || 0),
    newFindings: Number(row.new_findings || 0),
  };
}

export async function getLatestSeoAdvisorSnapshot(
  siteUrl = DEFAULT_SITE,
): Promise<SeoAdvisorSnapshot | null> {
  await ensureSeoAdvisorSnapshotTable();
  const sql = getSql();
  const rows = await sql`
    select
      analysis_date::text as analysis_date,
      analyzed_at,
      latest_data_date::text as latest_data_date,
      priority_count,
      new_findings,
      payload
    from gsc_advisor_analysis_runs
    where site_url = ${siteUrl}
    order by analysis_date desc
    limit 1
  `;
  const row = (rows as any[])?.[0];

  const schedule = athensScheduleState(new Date());
  const todayRow = Boolean(row && String(row.analysis_date) === schedule.dateKey);
  const incompleteTodayRow = todayRow && !hasInterpretation(row?.payload);
  const missedScheduledRun =
    schedule.hour >= ANALYSIS_HOUR_ATHENS &&
    isScheduledAnalysisDate(schedule.dateKey) &&
    (!todayRow || incompleteTodayRow);

  if (missedScheduledRun) {
    console.info("[gsc-analysis] advisor self-heal", {
      today: schedule.dateKey,
      previousAnalysisDate: row?.analysis_date ? String(row.analysis_date) : null,
      missingInterpretation: incompleteTodayRow,
    });
    const [{ getSeoAdvisorWithIntentData }, { interpretSeoAdvisorData }] = await Promise.all([
      import("./advisor-intents"),
      import("./advisor-interpretation"),
    ]);
    const basePayload = await getSeoAdvisorWithIntentData();
    const interpretation = await interpretSeoAdvisorData(basePayload);
    const payload = { ...basePayload, aiInterpretation: interpretation };
    const saved = await saveSeoAdvisorSnapshot(schedule.dateKey, payload, siteUrl);
    return { ...saved, payload };
  }

  if (!row) return null;

  return {
    analysisDate: String(row.analysis_date),
    analyzedAt: new Date(row.analyzed_at).toISOString(),
    latestDataDate: row.latest_data_date ? String(row.latest_data_date) : null,
    priorityCount: Number(row.priority_count || 0),
    newFindings: Number(row.new_findings || 0),
    payload: row.payload,
  };
}

export async function getLatestGscSyncState(
  siteUrl = DEFAULT_SITE,
): Promise<LatestGscSyncState> {
  const sql = getSql();
  const rows = await sql`
    select started_at, completed_at, status, rows_written, datasets, error_message
    from gsc_sync_runs
    where site_url = ${siteUrl}
    order by started_at desc
    limit 1
  `;
  const row = (rows as any[])?.[0];
  if (!row) return null;

  return {
    startedAt: row.started_at ? new Date(row.started_at).toISOString() : null,
    completedAt: row.completed_at ? new Date(row.completed_at).toISOString() : null,
    status: row.status ? String(row.status) : null,
    rowsWritten: Number(row.rows_written || 0),
    datasets: Number(row.datasets || 0),
    errorMessage: row.error_message ? String(row.error_message) : null,
  };
}
