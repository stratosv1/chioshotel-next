import { neon } from "@neondatabase/serverless";

export type StoredGa4OrganicRow = {
  propertyId: string;
  date: string;
  landingPage: string;
  sessions: number;
  activeUsers: number;
  newUsers: number;
  engagedSessions: number;
  engagementRate: number;
  keyEvents: number;
  sessionKeyEventRate: number;
};

function getSql() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error("DATABASE_URL is not configured.");
  return neon(databaseUrl);
}

export async function ensureGa4Tables() {
  const sql = getSql();
  await sql`
    create table if not exists ga4_organic_landing_pages (
      property_id text not null,
      date date not null,
      landing_page text not null,
      sessions double precision not null default 0,
      active_users double precision not null default 0,
      new_users double precision not null default 0,
      engaged_sessions double precision not null default 0,
      engagement_rate double precision not null default 0,
      key_events double precision not null default 0,
      session_key_event_rate double precision not null default 0,
      updated_at timestamptz not null default now(),
      primary key (property_id, date, landing_page)
    )
  `;
  await sql`
    create index if not exists ga4_organic_landing_pages_date_idx
    on ga4_organic_landing_pages (property_id, date desc)
  `;
  await sql`
    create table if not exists ga4_sync_runs (
      id bigserial primary key,
      property_id text not null,
      start_date date not null,
      end_date date not null,
      started_at timestamptz not null default now(),
      completed_at timestamptz,
      status text not null default 'running',
      rows_written integer not null default 0,
      error_message text
    )
  `;
  await sql`
    create index if not exists ga4_sync_runs_latest_idx
    on ga4_sync_runs (property_id, started_at desc)
  `;
}

export async function startGa4SyncRun(propertyId: string, startDate: string, endDate: string) {
  const sql = getSql();
  const rows = await sql`
    insert into ga4_sync_runs (property_id, start_date, end_date)
    values (${propertyId}, ${startDate}::date, ${endDate}::date)
    returning id::text
  `;
  const id = String((rows as Array<{ id?: string }>)[0]?.id || "");
  if (!id) throw new Error("Failed to create GA4 sync run.");
  return id;
}

export async function finishGa4SyncRun(
  runId: string,
  status: "success" | "failed",
  rowsWritten: number,
  errorMessage = "",
) {
  const sql = getSql();
  await sql`
    update ga4_sync_runs
    set completed_at = now(), status = ${status}, rows_written = ${rowsWritten},
        error_message = ${errorMessage || null}
    where id = ${runId}::bigint
  `;
}

export async function replaceGa4OrganicRows(
  propertyId: string,
  startDate: string,
  endDate: string,
  rows: StoredGa4OrganicRow[],
) {
  const sql = getSql();
  await sql`
    delete from ga4_organic_landing_pages
    where property_id = ${propertyId}
      and date between ${startDate}::date and ${endDate}::date
  `;

  const chunkSize = 500;
  for (let index = 0; index < rows.length; index += chunkSize) {
    const chunk = rows.slice(index, index + chunkSize);
    await sql`
      insert into ga4_organic_landing_pages (
        property_id, date, landing_page, sessions, active_users, new_users,
        engaged_sessions, engagement_rate, key_events, session_key_event_rate
      )
      select
        "propertyId", "date"::date, "landingPage", sessions, "activeUsers", "newUsers",
        "engagedSessions", "engagementRate", "keyEvents", "sessionKeyEventRate"
      from jsonb_to_recordset(${JSON.stringify(chunk)}::jsonb) as x(
        "propertyId" text,
        "date" text,
        "landingPage" text,
        sessions double precision,
        "activeUsers" double precision,
        "newUsers" double precision,
        "engagedSessions" double precision,
        "engagementRate" double precision,
        "keyEvents" double precision,
        "sessionKeyEventRate" double precision
      )
      on conflict (property_id, date, landing_page) do update set
        sessions = excluded.sessions,
        active_users = excluded.active_users,
        new_users = excluded.new_users,
        engaged_sessions = excluded.engaged_sessions,
        engagement_rate = excluded.engagement_rate,
        key_events = excluded.key_events,
        session_key_event_rate = excluded.session_key_event_rate,
        updated_at = now()
    `;
  }
}

export async function getLatestGa4SyncState(propertyId: string) {
  await ensureGa4Tables();
  const sql = getSql();
  const rows = await sql`
    select started_at, completed_at, status, rows_written, error_message,
           start_date::text as start_date, end_date::text as end_date
    from ga4_sync_runs
    where property_id = ${propertyId}
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
    errorMessage: row.error_message ? String(row.error_message) : null,
    startDate: row.start_date ? String(row.start_date) : null,
    endDate: row.end_date ? String(row.end_date) : null,
  };
}
