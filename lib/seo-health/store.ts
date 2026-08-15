import { neon } from "@neondatabase/serverless";

export type SeoUrlSource = "canonical" | "gsc" | "googlebot" | "manual";
export type SeoExpectedKind = "canonical" | "legacy" | "unknown";

export type SeoUrlCandidate = {
  url: string;
  path: string;
  source: string;
  expectedKind: string;
  priority: number;
  lastInspectedAt: string | null;
};

export type SeoHealthInspectionRecord = {
  runId: string;
  url: string;
  source: string;
  expectedKind: string;
  liveStatus: number | null;
  finalUrl: string;
  redirectHops: number;
  liveCanonical: string;
  liveNoindex: boolean;
  xRobotsTag: string;
  gscVerdict: string;
  coverageState: string;
  pageFetchState: string;
  indexingState: string;
  robotsState: string;
  googleCanonical: string;
  userCanonical: string;
  lastCrawlTime: string;
  category: string;
  severity: "healthy" | "info" | "warning" | "critical";
  decision: string;
  action: string;
  autoExecuted: boolean;
  detail: Record<string, unknown>;
};

export type SeoRuntimeRule = {
  path: string;
  ruleType: "redirect" | "gone";
  destination: string | null;
  statusCode: number;
  confidence: string;
  reason: string;
};

function getSql() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error("DATABASE_URL is not configured.");
  return neon(databaseUrl);
}

export function normalizeSeoPath(pathname: string) {
  const collapsed = pathname.replace(/\/{2,}/g, "/");
  let decoded = collapsed;
  try {
    decoded = decodeURIComponent(collapsed);
  } catch {
    // Keep the original path if it contains malformed percent encoding.
  }
  const normalized = decoded.replace(/\/+$/, "") || "/";
  return normalized.startsWith("/") ? normalized : `/${normalized}`;
}

export async function ensureSeoHealthTables() {
  const sql = getSql();

  await sql`
    create table if not exists seo_health_runs (
      id bigserial primary key,
      site_url text not null,
      started_at timestamptz not null default now(),
      completed_at timestamptz,
      status text not null default 'running',
      inspected_count integer not null default 0,
      healthy_count integer not null default 0,
      auto_fixed_count integer not null default 0,
      review_count integer not null default 0,
      critical_count integer not null default 0,
      error_message text
    )
  `;

  await sql`
    create table if not exists seo_url_inventory (
      url text primary key,
      path text not null,
      source text not null,
      expected_kind text not null default 'unknown',
      priority integer not null default 50,
      first_seen_at timestamptz not null default now(),
      last_seen_at timestamptz not null default now(),
      last_googlebot_seen_at timestamptz,
      last_inspected_at timestamptz,
      active boolean not null default true
    )
  `;

  await sql`
    create index if not exists seo_url_inventory_priority_idx
    on seo_url_inventory (active, priority desc, last_inspected_at asc nulls first)
  `;

  await sql`
    create table if not exists seo_runtime_rules (
      path text primary key,
      rule_type text not null check (rule_type in ('redirect', 'gone')),
      destination text,
      status_code integer not null,
      enabled boolean not null default true,
      confidence text not null default 'high',
      reason text not null,
      source_url text,
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now(),
      last_verified_at timestamptz
    )
  `;

  await sql`
    create table if not exists seo_url_inspections (
      id bigserial primary key,
      run_id bigint references seo_health_runs(id) on delete cascade,
      url text not null,
      inspected_at timestamptz not null default now(),
      source text not null,
      expected_kind text not null,
      live_status integer,
      final_url text not null default '',
      redirect_hops integer not null default 0,
      live_canonical text not null default '',
      live_noindex boolean not null default false,
      x_robots_tag text not null default '',
      gsc_verdict text not null default '',
      coverage_state text not null default '',
      page_fetch_state text not null default '',
      indexing_state text not null default '',
      robots_state text not null default '',
      google_canonical text not null default '',
      user_canonical text not null default '',
      last_crawl_time timestamptz,
      category text not null,
      severity text not null,
      decision text not null,
      action text not null,
      auto_executed boolean not null default false,
      detail jsonb not null default '{}'::jsonb
    )
  `;

  await sql`
    create index if not exists seo_url_inspections_run_idx
    on seo_url_inspections (run_id, severity, category)
  `;

  await sql`
    create index if not exists seo_url_inspections_url_idx
    on seo_url_inspections (url, inspected_at desc)
  `;
}

export async function upsertSeoUrlInventory(input: {
  url: string;
  source: SeoUrlSource;
  expectedKind: SeoExpectedKind;
  priority: number;
  googlebotSeen?: boolean;
}) {
  const sql = getSql();
  const parsed = new URL(input.url);
  const path = normalizeSeoPath(parsed.pathname);

  await sql`
    insert into seo_url_inventory (
      url, path, source, expected_kind, priority, first_seen_at, last_seen_at, last_googlebot_seen_at, active
    ) values (
      ${input.url}, ${path}, ${input.source}, ${input.expectedKind}, ${input.priority}, now(), now(),
      ${input.googlebotSeen ? new Date().toISOString() : null}::timestamptz,
      true
    )
    on conflict (url) do update set
      path = excluded.path,
      source = case
        when seo_url_inventory.source = 'canonical' then seo_url_inventory.source
        when excluded.source = 'canonical' then excluded.source
        else seo_url_inventory.source
      end,
      expected_kind = case
        when seo_url_inventory.expected_kind = 'canonical' then seo_url_inventory.expected_kind
        when excluded.expected_kind = 'canonical' then excluded.expected_kind
        else seo_url_inventory.expected_kind
      end,
      priority = greatest(seo_url_inventory.priority, excluded.priority),
      last_seen_at = now(),
      last_googlebot_seen_at = case
        when excluded.last_googlebot_seen_at is not null then excluded.last_googlebot_seen_at
        else seo_url_inventory.last_googlebot_seen_at
      end,
      active = true
  `;
}

export async function bulkUpsertSeoUrls(rows: Array<{
  url: string;
  source: SeoUrlSource;
  expectedKind: SeoExpectedKind;
  priority: number;
}>) {
  for (const row of rows) {
    try {
      await upsertSeoUrlInventory(row);
    } catch (error) {
      console.warn(`[seo-health] inventory skip ${row.url}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}

export async function seedSeoUrlsFromStoredGsc(siteUrl: string) {
  const sql = getSql();
  const rows = await sql`
    select distinct page
    from gsc_search_analytics
    where site_url = ${siteUrl}
      and grain = 'page'
      and page <> ''
      and date >= current_date - 180
    limit 5000
  `;

  const urls = (rows as Array<{ page?: string }>).map((row) => String(row.page || "")).filter(Boolean);
  await bulkUpsertSeoUrls(
    urls.map((url) => ({ url, source: "gsc" as const, expectedKind: "unknown" as const, priority: 70 })),
  );
  return urls.length;
}

export async function startSeoHealthRun(siteUrl: string) {
  const sql = getSql();
  const rows = await sql`
    insert into seo_health_runs (site_url)
    values (${siteUrl})
    returning id::text
  `;
  return String((rows as Array<{ id?: string }>)[0]?.id || "");
}

export async function finishSeoHealthRun(
  runId: string,
  values: {
    status: "success" | "failed";
    inspected: number;
    healthy: number;
    autoFixed: number;
    review: number;
    critical: number;
    errorMessage?: string;
  },
) {
  const sql = getSql();
  await sql`
    update seo_health_runs
    set completed_at = now(),
        status = ${values.status},
        inspected_count = ${values.inspected},
        healthy_count = ${values.healthy},
        auto_fixed_count = ${values.autoFixed},
        review_count = ${values.review},
        critical_count = ${values.critical},
        error_message = ${values.errorMessage || null}
    where id = ${runId}::bigint
  `;
}

export async function getSeoInspectionCandidates(limit = 1200): Promise<SeoUrlCandidate[]> {
  const sql = getSql();
  const safeLimit = Math.max(1, Math.min(1800, Math.trunc(limit)));
  const rows = await sql`
    select
      url,
      path,
      source,
      expected_kind as "expectedKind",
      priority,
      last_inspected_at::text as "lastInspectedAt"
    from seo_url_inventory
    where active = true
    order by
      case when last_inspected_at is null then 0 else 1 end asc,
      priority desc,
      last_inspected_at asc nulls first,
      last_seen_at desc
    limit ${safeLimit}
  `;
  return rows as SeoUrlCandidate[];
}

export async function saveSeoInspection(record: SeoHealthInspectionRecord) {
  const sql = getSql();
  await sql`
    insert into seo_url_inspections (
      run_id, url, source, expected_kind, live_status, final_url, redirect_hops,
      live_canonical, live_noindex, x_robots_tag, gsc_verdict, coverage_state,
      page_fetch_state, indexing_state, robots_state, google_canonical, user_canonical,
      last_crawl_time, category, severity, decision, action, auto_executed, detail
    ) values (
      ${record.runId}::bigint, ${record.url}, ${record.source}, ${record.expectedKind},
      ${record.liveStatus}, ${record.finalUrl}, ${record.redirectHops}, ${record.liveCanonical},
      ${record.liveNoindex}, ${record.xRobotsTag}, ${record.gscVerdict}, ${record.coverageState},
      ${record.pageFetchState}, ${record.indexingState}, ${record.robotsState},
      ${record.googleCanonical}, ${record.userCanonical},
      ${record.lastCrawlTime || null}::timestamptz, ${record.category}, ${record.severity},
      ${record.decision}, ${record.action}, ${record.autoExecuted}, ${JSON.stringify(record.detail)}::jsonb
    )
  `;

  await sql`
    update seo_url_inventory
    set last_inspected_at = now(), last_seen_at = now()
    where url = ${record.url}
  `;
}

export async function upsertSeoRuntimeRule(input: {
  path: string;
  ruleType: "redirect" | "gone";
  destination?: string | null;
  statusCode: number;
  confidence: "high";
  reason: string;
  sourceUrl: string;
}) {
  const sql = getSql();
  const normalizedPath = normalizeSeoPath(input.path);
  await sql`
    insert into seo_runtime_rules (
      path, rule_type, destination, status_code, enabled, confidence, reason, source_url, created_at, updated_at
    ) values (
      ${normalizedPath}, ${input.ruleType}, ${input.destination || null}, ${input.statusCode}, true,
      ${input.confidence}, ${input.reason}, ${input.sourceUrl}, now(), now()
    )
    on conflict (path) do update set
      rule_type = excluded.rule_type,
      destination = excluded.destination,
      status_code = excluded.status_code,
      enabled = true,
      confidence = excluded.confidence,
      reason = excluded.reason,
      source_url = excluded.source_url,
      updated_at = now()
  `;
}

export async function getSeoRuntimeRule(pathname: string): Promise<SeoRuntimeRule | null> {
  const sql = getSql();
  const path = normalizeSeoPath(pathname);
  try {
    const rows = await sql`
      select
        path,
        rule_type as "ruleType",
        destination,
        status_code as "statusCode",
        confidence,
        reason
      from seo_runtime_rules
      where path = ${path} and enabled = true
      limit 1
    `;
    return (rows as SeoRuntimeRule[])[0] || null;
  } catch (error) {
    // Runtime routing must never fail a public request if the monitoring tables
    // have not been initialized yet or the database is temporarily unavailable.
    console.warn(`[seo-health] runtime rule lookup failed for ${path}: ${error instanceof Error ? error.message : String(error)}`);
    return null;
  }
}

export async function markSeoRuntimeRuleVerified(pathname: string) {
  const sql = getSql();
  const path = normalizeSeoPath(pathname);
  await sql`
    update seo_runtime_rules set last_verified_at = now() where path = ${path}
  `;
}

export async function getSeoHealthDashboard() {
  const sql = getSql();
  await ensureSeoHealthTables();

  const runRows = await sql`
    select
      id::text,
      site_url as "siteUrl",
      started_at as "startedAt",
      completed_at as "completedAt",
      status,
      inspected_count as "inspectedCount",
      healthy_count as "healthyCount",
      auto_fixed_count as "autoFixedCount",
      review_count as "reviewCount",
      critical_count as "criticalCount",
      error_message as "errorMessage"
    from seo_health_runs
    order by started_at desc
    limit 1
  `;
  const latestRun = (runRows as any[])[0] || null;

  if (!latestRun) {
    return { latestRun: null, categories: [], issues: [], runtimeRules: [] };
  }

  const categories = await sql`
    select category, severity, count(*)::integer as count
    from seo_url_inspections
    where run_id = ${latestRun.id}::bigint
    group by category, severity
    order by
      case severity when 'critical' then 0 when 'warning' then 1 when 'info' then 2 else 3 end,
      count(*) desc
  `;

  const issues = await sql`
    select
      url, live_status as "liveStatus", final_url as "finalUrl", redirect_hops as "redirectHops",
      coverage_state as "coverageState", page_fetch_state as "pageFetchState",
      google_canonical as "googleCanonical", user_canonical as "userCanonical",
      category, severity, decision, action, auto_executed as "autoExecuted", inspected_at as "inspectedAt"
    from seo_url_inspections
    where run_id = ${latestRun.id}::bigint and severity <> 'healthy'
    order by
      case severity when 'critical' then 0 when 'warning' then 1 else 2 end,
      inspected_at desc
    limit 100
  `;

  const runtimeRules = await sql`
    select path, rule_type as "ruleType", destination, status_code as "statusCode",
      confidence, reason, updated_at as "updatedAt", last_verified_at as "lastVerifiedAt"
    from seo_runtime_rules
    where enabled = true
    order by updated_at desc
    limit 50
  `;

  return { latestRun, categories, issues, runtimeRules };
}
