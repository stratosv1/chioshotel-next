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
  return {
    id: String(row.id || ""),
    siteUrl: String(row.siteUrl || row.site_url || ""),
    status: String(row.status || "running") as FullAuditSession["status"],
    startedAt: String(row.startedAt || row.started_at || ""),
    completedAt: row.completedAt || row.completed_at ? String(row.completedAt || row.completed_at) : null,
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

export async function getOrCreateFullAuditSession(siteUrl: string, requestedId?: string) {
  await ensureFullAuditTable();
  await markStaleSeoHealthRunsFailed();

  const sql = getSql();

  if (requestedId) {
    const requested = await selectSession(requestedId);
    if (requested && requested.status === "running") return requested;
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
    const active = await selectSession(String((activeRows[0] as any).id || ""));
    if (active) return active;
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
    set batches_completed = batches_completed + 1,
        inspected_count = inspected_count + ${result.inspected},
        healthy_count = healthy_count + ${result.healthy},
        auto_fixed_count = auto_fixed_count + ${result.autoFixed},
        review_count = review_count + ${result.review},
        critical_count = critical_count + ${result.critical},
        run_ids = run_ids || jsonb_build_array(${result.runId})
    where id = ${sessionId}::uuid
      and status = 'running'
  `;
  const session = await selectSession(sessionId);
  if (!session) throw new Error("Full SEO Audit session disappeared after batch update.");
  return session;
}

export async function finalizeFullAuditSession(sessionId: string) {
  const sql = getSql();
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

  const aggregateRows = await sql`
    insert into seo_health_runs (
      site_url, started_at, completed_at, status,
      inspected_count, healthy_count, auto_fixed_count, review_count, critical_count
    ) values (
      ${String(row.site_url)}, ${String(row.started_at)}::timestamptz, now(), 'success',
      ${Number(row.inspected_count || 0)}, ${Number(row.healthy_count || 0)},
      ${Number(row.auto_fixed_count || 0)}, ${Number(row.review_count || 0)},
      ${Number(row.critical_count || 0)}
    )
    returning id::text
  `;
  const aggregateRunId = String((aggregateRows[0] as any)?.id || "");
  if (!aggregateRunId) throw new Error("Failed to create aggregate Full SEO Audit run.");

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
        ${aggregateRunId}::bigint, url, inspected_at, source, expected_kind, live_status, final_url,
        redirect_hops, live_canonical, live_noindex, x_robots_tag, gsc_verdict,
        coverage_state, page_fetch_state, indexing_state, robots_state,
        google_canonical, user_canonical, last_crawl_time, category, severity,
        decision, action, auto_executed, detail
      from seo_url_inspections
      where run_id in (
        select value::bigint
        from jsonb_array_elements_text(${runIdsJson}::jsonb)
      )
    `;

    await sql`
      delete from seo_health_runs
      where id in (
        select value::bigint
        from jsonb_array_elements_text(${runIdsJson}::jsonb)
      )
    `;
  }

  await sql`
    update seo_full_audit_sessions
    set status = 'success',
        completed_at = now(),
        aggregate_run_id = ${aggregateRunId}::bigint
    where id = ${sessionId}::uuid
  `;

  return selectSession(sessionId);
}
