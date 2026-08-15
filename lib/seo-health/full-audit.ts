import { randomUUID } from "node:crypto";
import { neon } from "@neondatabase/serverless";
import { bulkUpsertSeoUrls, seedSeoUrlsFromStoredGsc } from "@/lib/seo-health/store";

const SITE_ORIGIN = "https://chioshotel.gr";
export const FULL_AUDIT_BATCH_SIZE = 120;

export type FullAuditSession = {
  id: string;
  siteUrl: string;
  status: "running" | "success" | "failed";
  startedAt: string;
  completedAt: string | null;
  totalUrls: number;
  batchSize: number;
  batchesTarget: number;
  batchesCompleted: number;
  inspected: number;
  healthy: number;
  autoFixed: number;
  review: number;
  critical: number;
  aggregateRunId: string | null;
  errorMessage: string | null;
};

function getSql() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error("DATABASE_URL is not configured.");
  return neon(databaseUrl);
}

function toIsoTimestamp(value: unknown) {
  if (value instanceof Date) return value.toISOString();
  const raw = String(value || "").trim();
  if (!raw) throw new Error("Full SEO Audit timestamp is empty.");
  const parsed = new Date(raw);
  if (Number.isNaN(parsed.getTime())) {
    throw new Error(`Invalid Full SEO Audit timestamp: ${raw}`);
  }
  return parsed.toISOString();
}

function decodeXml(value: string) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

export async function seedSeoUrlsFromLiveSitemap() {
  try {
    const response = await fetch(`${SITE_ORIGIN}/sitemap.xml`, {
      cache: "no-store",
      redirect: "follow",
      headers: { "user-agent": "Voulamandis-Technical-SEO-Autopilot/1.0" },
    });
    if (!response.ok) {
      console.warn(`[seo-health] sitemap seed failed with HTTP ${response.status}`);
      return 0;
    }

    const xml = await response.text();
    const urls = Array.from(xml.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/gi))
      .map((match) => decodeXml(String(match[1] || "").trim()))
      .filter(Boolean)
      .filter((value, index, all) => all.indexOf(value) === index)
      .filter((value) => {
        try {
          return new URL(value).hostname.replace(/^www\./i, "") === "chioshotel.gr";
        } catch {
          return false;
        }
      });

    await bulkUpsertSeoUrls(
      urls.map((url) => ({
        url,
        source: "canonical" as const,
        expectedKind: "canonical" as const,
        priority: 95,
      })),
    );

    return urls.length;
  } catch (error) {
    console.warn(
      `[seo-health] sitemap seed error: ${error instanceof Error ? error.message : String(error)}`,
    );
    return 0;
  }
}

export async function markStaleSeoHealthRunsFailed() {
  const sql = getSql();
  await sql`
    update seo_health_runs
    set status = 'failed',
        completed_at = coalesce(completed_at, now()),
        error_message = coalesce(error_message, 'Interrupted or timed out before completion')
    where status = 'running'
      and started_at < now() - interval '8 minutes'
  `;
}

async function ensureFullAuditTable() {
  const sql = getSql();
  await sql`
    create table if not exists seo_full_audit_sessions (
      id uuid primary key,
      site_url text not null,
      started_at timestamptz not null default now(),
      completed_at timestamptz,
      status text not null default 'running',
      total_urls integer not null default 0,
      batch_size integer not null default 120,
      batches_target integer not null default 0,
      batches_completed integer not null default 0,
      inspected_count integer not null default 0,
      healthy_count integer not null default 0,
      auto_fixed_count integer not null default 0,
      review_count integer not null default 0,
      critical_count integer not null default 0,
      run_ids jsonb not null default '[]'::jsonb,
      aggregate_run_id bigint,
      error_message text
    )
  `;
  await sql`
    create index if not exists seo_full_audit_sessions_status_idx
    on seo_full_audit_sessions (status, started_at desc)
  `;
}

function mapSession(row: any): FullAuditSession {
  const startedAtValue = row.startedAt || row.started_at;
  const completedAtValue = row.completedAt || row.completed_at;
  return {
    id: String(row.id || ""),
    siteUrl: String(row.siteUrl || row.site_url || ""),
    status: String(row.status || "running") as FullAuditSession["status"],
    startedAt: startedAtValue ? toIsoTimestamp(startedAtValue) : "",
    completedAt: completedAtValue ? toIsoTimestamp(completedAtValue) : null,
    totalUrls: Number(row.totalUrls ?? row.total_urls ?? 0),
    batchSize: Number(row.batchSize ?? row.batch_size ?? FULL_AUDIT_BATCH_SIZE),
    batchesTarget: Number(row.batchesTarget ?? row.batches_target ?? 0),
    batchesCompleted: Number(row.batchesCompleted ?? row.batches_completed ?? 0),
    inspected: Number(row.inspected ?? row.inspected_count ?? 0),
    healthy: Number(row.healthy ?? row.healthy_count ?? 0),
    autoFixed: Number(row.autoFixed ?? row.auto_fixed_count ?? 0),
    review: Number(row.review ?? row.review_count ?? 0),
    critical: Number(row.critical ?? row.critical_count ?? 0),
    aggregateRunId: row.aggregateRunId || row.aggregate_run_id ? String(row.aggregateRunId || row.aggregate_run_id) : null,
    errorMessage: row.errorMessage || row.error_message ? String(row.errorMessage || row.error_message) : null,
  };
}

async function selectSession(id: string) {
  const sql = getSql();
  const rows = await sql`
    select
      id::text,
      site_url as "siteUrl",
      started_at::text as "startedAt",
      completed_at::text as "completedAt",
      status,
      total_urls as "totalUrls",
      batch_size as "batchSize",
      batches_target as "batchesTarget",
      batches_completed as "batchesCompleted",
      inspected_count as inspected,
      healthy_count as healthy,
      auto_fixed_count as "autoFixed",
      review_count as review,
      critical_count as critical,
      aggregate_run_id::text as "aggregateRunId",
      error_message as "errorMessage"
    from seo_full_audit_sessions
    where id = ${id}::uuid
    limit 1
  `;
  return rows.length ? mapSession(rows[0]) : null;
}

export async function refreshFullAuditSessionStats(sessionId: string) {
  const sql = getSql();
  const session = await selectSession(sessionId);
  if (!session) throw new Error("Full SEO Audit session not found while refreshing progress.");

  const rows = await sql`
    with session_data as (
      select run_ids
      from seo_full_audit_sessions
      where id = ${sessionId}::uuid
    ),
    run_ids as (
      select value::bigint as run_id
      from session_data, jsonb_array_elements_text(run_ids)
    ),
    latest as (
      select distinct on (inspection.url)
        inspection.url,
        inspection.severity,
        inspection.auto_executed
      from seo_url_inspections inspection
      join run_ids on run_ids.run_id = inspection.run_id
      order by inspection.url, inspection.inspected_at desc, inspection.id desc
    )
    select
      count(*)::integer as inspected,
      count(*) filter (where severity = 'healthy')::integer as healthy,
      count(*) filter (where auto_executed = true)::integer as "autoFixed",
      count(*) filter (where severity <> 'healthy' and auto_executed = false)::integer as review,
      count(*) filter (where severity = 'critical')::integer as critical
    from latest
  `;

  const stats: any = rows[0] || {};
  const inspected = Number(stats.inspected || 0);
  const logicalBatchesCompleted = session.batchSize > 0
    ? Math.min(session.batchesTarget, Math.ceil(inspected / session.batchSize))
    : 0;

  await sql`
    update seo_full_audit_sessions
    set inspected_count = ${inspected},
        healthy_count = ${Number(stats.healthy || 0)},
        auto_fixed_count = ${Number(stats.autoFixed || 0)},
        review_count = ${Number(stats.review || 0)},
        critical_count = ${Number(stats.critical || 0)},
        batches_completed = ${logicalBatchesCompleted}
    where id = ${sessionId}::uuid
  `;

  const refreshed = await selectSession(sessionId);
  if (!refreshed) throw new Error("Full SEO Audit session disappeared while refreshing progress.");
  return refreshed;
}

export async function prioritizeUnprocessedFullAuditUrls(sessionId: string) {
  const sql = getSql();
  await sql`
    with session_data as (
      select started_at, run_ids
      from seo_full_audit_sessions
      where id = ${sessionId}::uuid
    ),
    run_ids as (
      select value::bigint as run_id
      from session_data, jsonb_array_elements_text(run_ids)
    ),
    processed as (
      select distinct inspection.url
      from seo_url_inspections inspection
      join run_ids on run_ids.run_id = inspection.run_id
    )
    update seo_url_inventory inventory
    set last_inspected_at = null
    from session_data
    where inventory.active = true
      and inventory.first_seen_at <= session_data.started_at
      and not exists (
        select 1 from processed where processed.url = inventory.url
      )
  `;
}

export async function getOrCreateFullAuditSession(siteUrl: string, requestedId?: string) {
  await ensureFullAuditTable();
  await markStaleSeoHealthRunsFailed();

  const sql = getSql();

  if (requestedId) {
    const requested = await selectSession(requestedId);
    if (requested && requested.status === "running") return refreshFullAuditSessionStats(requested.id);
    if (requested && requested.status === "success") return requested;
  }

  const activeRows = await sql`
    select id::text
    from seo_full_audit_sessions
    where site_url = ${siteUrl}
      and status = 'running'
      and started_at > now() - interval '12 hours'
    order by started_at desc
    limit 1
  `;
  if (activeRows.length) {
    const activeId = String((activeRows[0] as any).id || "");
    if (activeId) return refreshFullAuditSessionStats(activeId);
  }

  await sql`
    update seo_full_audit_sessions
    set status = 'failed',
        completed_at = coalesce(completed_at, now()),
        error_message = coalesce(error_message, 'Full audit session expired before completion')
    where status = 'running'
      and started_at <= now() - interval '12 hours'
  `;

  await seedSeoUrlsFromLiveSitemap();
  await seedSeoUrlsFromStoredGsc(siteUrl);

  const countRows = await sql`
    select count(*)::integer as count
    from seo_url_inventory
    where active = true
  `;
  const totalUrls = Number((countRows[0] as any)?.count || 0);
  const batchesTarget = totalUrls > 0 ? Math.ceil(totalUrls / FULL_AUDIT_BATCH_SIZE) : 0;
  const id = randomUUID();

  await sql`
    insert into seo_full_audit_sessions (
      id, site_url, total_urls, batch_size, batches_target
    ) values (
      ${id}::uuid, ${siteUrl}, ${totalUrls}, ${FULL_AUDIT_BATCH_SIZE}, ${batchesTarget}
    )
  `;

  const created = await selectSession(id);
  if (!created) throw new Error("Failed to create Full SEO Audit session.");
  return created;
}

export async function recordFullAuditBatch(
  sessionId: string,
  result: {
    runId: string;
    inspected: number;
    healthy: number;
    autoFixed: number;
    review: number;
    critical: number;
  },
) {
  const sql = getSql();
  await sql`
    update seo_full_audit_sessions
    set run_ids = run_ids || jsonb_build_array(${result.runId}::text)
    where id = ${sessionId}::uuid
      and status = 'running'
  `;
  return refreshFullAuditSessionStats(sessionId);
}

export async function finalizeFullAuditSession(sessionId: string) {
  const sql = getSql();
  await refreshFullAuditSessionStats(sessionId);

  const rows = await sql`
    select *, run_ids as "runIds"
    from seo_full_audit_sessions
    where id = ${sessionId}::uuid
    limit 1
  `;
  const row: any = rows[0];
  if (!row) throw new Error("Full SEO Audit session not found.");
  if (row.status === "success") return selectSession(sessionId);

  const runIds = Array.isArray(row.runIds) ? row.runIds.map(String).filter(Boolean) : [];
  const startedAt = toIsoTimestamp(row.started_at);
  let aggregateRunId = row.aggregate_run_id ? String(row.aggregate_run_id) : "";

  if (!aggregateRunId) {
    const aggregateRows = await sql`
      insert into seo_health_runs (
        site_url, started_at, completed_at, status,
        inspected_count, healthy_count, auto_fixed_count, review_count, critical_count
      ) values (
        ${String(row.site_url)}, ${startedAt}::timestamptz, now(), 'success',
        0, 0, 0, 0, 0
      )
      returning id::text
    `;
    aggregateRunId = String((aggregateRows[0] as any)?.id || "");
    if (!aggregateRunId) throw new Error("Failed to create aggregate Full SEO Audit run.");

    await sql`
      update seo_full_audit_sessions
      set aggregate_run_id = ${aggregateRunId}::bigint
      where id = ${sessionId}::uuid
    `;
  }

  await sql`
    delete from seo_url_inspections
    where run_id = ${aggregateRunId}::bigint
  `;

  if (runIds.length) {
    const runIdsJson = JSON.stringify(runIds);
    await sql`
      insert into seo_url_inspections (
        run_id, url, inspected_at, source, expected_kind, live_status, final_url,
        redirect_hops, live_canonical, live_noindex, x_robots_tag, gsc_verdict,
        coverage_state, page_fetch_state, indexing_state, robots_state,
        google_canonical, user_canonical, last_crawl_time, category, severity,
        decision, action, auto_executed, detail
      )
      select
        ${aggregateRunId}::bigint, latest.url, latest.inspected_at, latest.source, latest.expected_kind,
        latest.live_status, latest.final_url, latest.redirect_hops, latest.live_canonical,
        latest.live_noindex, latest.x_robots_tag, latest.gsc_verdict, latest.coverage_state,
        latest.page_fetch_state, latest.indexing_state, latest.robots_state,
        latest.google_canonical, latest.user_canonical, latest.last_crawl_time, latest.category,
        latest.severity, latest.decision, latest.action, latest.auto_executed, latest.detail
      from (
        select distinct on (inspection.url) inspection.*
        from seo_url_inspections inspection
        where inspection.run_id in (
          select value::bigint
          from jsonb_array_elements_text(${runIdsJson}::jsonb)
        )
        order by inspection.url, inspection.inspected_at desc, inspection.id desc
      ) latest
    `;
  }

  const aggregateStatsRows = await sql`
    select
      count(*)::integer as inspected,
      count(*) filter (where severity = 'healthy')::integer as healthy,
      count(*) filter (where auto_executed = true)::integer as "autoFixed",
      count(*) filter (where severity <> 'healthy' and auto_executed = false)::integer as review,
      count(*) filter (where severity = 'critical')::integer as critical
    from seo_url_inspections
    where run_id = ${aggregateRunId}::bigint
  `;
  const aggregateStats: any = aggregateStatsRows[0] || {};

  await sql`
    update seo_health_runs
    set completed_at = now(),
        status = 'success',
        inspected_count = ${Number(aggregateStats.inspected || 0)},
        healthy_count = ${Number(aggregateStats.healthy || 0)},
        auto_fixed_count = ${Number(aggregateStats.autoFixed || 0)},
        review_count = ${Number(aggregateStats.review || 0)},
        critical_count = ${Number(aggregateStats.critical || 0)},
        error_message = null
    where id = ${aggregateRunId}::bigint
  `;

  const logicalBatchesCompleted = Number(row.batch_size || 0) > 0
    ? Math.min(Number(row.batches_target || 0), Math.ceil(Number(aggregateStats.inspected || 0) / Number(row.batch_size)))
    : 0;

  await sql`
    update seo_full_audit_sessions
    set status = 'success',
        completed_at = now(),
        aggregate_run_id = ${aggregateRunId}::bigint,
        inspected_count = ${Number(aggregateStats.inspected || 0)},
        healthy_count = ${Number(aggregateStats.healthy || 0)},
        auto_fixed_count = ${Number(aggregateStats.autoFixed || 0)},
        review_count = ${Number(aggregateStats.review || 0)},
        critical_count = ${Number(aggregateStats.critical || 0)},
        batches_completed = ${logicalBatchesCompleted},
        error_message = null
    where id = ${sessionId}::uuid
  `;

  if (runIds.length) {
    const runIdsJson = JSON.stringify(runIds);
    await sql`
      delete from seo_health_runs
      where id in (
        select value::bigint
        from jsonb_array_elements_text(${runIdsJson}::jsonb)
      )
    `;
  }

  return selectSession(sessionId);
}
