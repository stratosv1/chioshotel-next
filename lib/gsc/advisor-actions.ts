import { createHash } from "crypto";
import { neon } from "@neondatabase/serverless";

const DEFAULT_SITE = "sc-domain:chioshotel.gr";

export type SeoTrackedAction = {
  actionKey: string;
  analysisDate: string;
  title: string;
  scopeLabel: string;
  actionText: string;
  trackingMetric: string;
  reviewInDays: number;
  status: "recommended" | "implemented" | "dismissed";
  implementedAt: string | null;
  createdAt: string;
  updatedAt: string;
  lastSeenAt: string;
};

function getSql() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error("DATABASE_URL is not configured.");
  return neon(databaseUrl);
}

async function ensureTable() {
  const sql = getSql();
  await sql`
    create table if not exists gsc_advisor_actions (
      site_url text not null,
      action_key text not null,
      analysis_date date not null,
      title text not null,
      scope_label text not null default '',
      action_text text not null,
      tracking_metric text not null default '',
      review_in_days integer not null default 14,
      status text not null default 'recommended',
      implemented_at timestamptz,
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now(),
      last_seen_at timestamptz not null default now(),
      primary key (site_url, action_key)
    )
  `;
  await sql`create index if not exists gsc_advisor_actions_status_idx on gsc_advisor_actions (site_url, status, updated_at desc)`;
}

export function seoActionKey(finding: any) {
  const source = [
    String(finding?.classification || ""),
    String(finding?.scopeLabel || finding?.title || ""),
    String(finding?.trackingMetric || ""),
  ].join("|");
  return createHash("sha1").update(source).digest("hex").slice(0, 20);
}

export async function syncSeoAdvisorActions(
  analysisDate: string,
  findings: any[],
  siteUrl = DEFAULT_SITE,
) {
  await ensureTable();
  const sql = getSql();
  for (const finding of (findings || []).slice(0, 5)) {
    const actionKey = seoActionKey(finding);
    await sql`
      insert into gsc_advisor_actions (
        site_url, action_key, analysis_date, title, scope_label, action_text,
        tracking_metric, review_in_days, status, last_seen_at, updated_at
      ) values (
        ${siteUrl}, ${actionKey}, ${analysisDate}::date,
        ${String(finding?.title || "SEO action")},
        ${String(finding?.scopeLabel || "")},
        ${String(finding?.action || "")},
        ${String(finding?.trackingMetric || "")},
        ${Math.max(3, Math.min(30, Number(finding?.reviewInDays || 14)))},
        'recommended', now(), now()
      )
      on conflict (site_url, action_key) do update set
        analysis_date = excluded.analysis_date,
        title = excluded.title,
        scope_label = excluded.scope_label,
        action_text = excluded.action_text,
        tracking_metric = excluded.tracking_metric,
        review_in_days = excluded.review_in_days,
        last_seen_at = now(),
        updated_at = now()
    `;
  }
}

export async function getSeoAdvisorActions(
  siteUrl = DEFAULT_SITE,
  limit = 20,
): Promise<SeoTrackedAction[]> {
  await ensureTable();
  const sql = getSql();
  const safeLimit = Math.max(1, Math.min(50, Math.floor(limit)));
  const rows = await sql`
    select action_key, analysis_date::text analysis_date, title, scope_label,
      action_text, tracking_metric, review_in_days, status, implemented_at,
      created_at, updated_at, last_seen_at
    from gsc_advisor_actions
    where site_url = ${siteUrl}
    order by
      case status when 'implemented' then 0 when 'recommended' then 1 else 2 end,
      updated_at desc
    limit ${safeLimit}
  `;
  return (rows as any[]).map((row) => ({
    actionKey: String(row.action_key),
    analysisDate: String(row.analysis_date),
    title: String(row.title || ""),
    scopeLabel: String(row.scope_label || ""),
    actionText: String(row.action_text || ""),
    trackingMetric: String(row.tracking_metric || ""),
    reviewInDays: Number(row.review_in_days || 14),
    status: row.status === "implemented" || row.status === "dismissed" ? row.status : "recommended",
    implementedAt: row.implemented_at ? new Date(row.implemented_at).toISOString() : null,
    createdAt: new Date(row.created_at).toISOString(),
    updatedAt: new Date(row.updated_at).toISOString(),
    lastSeenAt: new Date(row.last_seen_at).toISOString(),
  }));
}

export async function updateSeoAdvisorActionStatus(
  actionKey: string,
  status: "recommended" | "implemented" | "dismissed",
  siteUrl = DEFAULT_SITE,
) {
  await ensureTable();
  const sql = getSql();
  const rows = await sql`
    update gsc_advisor_actions
    set status = ${status},
      implemented_at = case when ${status} = 'implemented' then coalesce(implemented_at, now()) else null end,
      updated_at = now()
    where site_url = ${siteUrl} and action_key = ${actionKey}
    returning action_key
  `;
  return Boolean((rows as any[])?.[0]?.action_key);
}
