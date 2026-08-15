import { neon } from "@neondatabase/serverless";

export type RuntimeSeoRule = {
  path: string;
  ruleType: "redirect" | "gone";
  destination: string | null;
  statusCode: number;
  reason: string;
};

function getSql() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) return null;
  return neon(databaseUrl);
}

export function normalizeRuntimeSeoPath(pathname: string) {
  const collapsed = pathname.replace(/\/{2,}/g, "/");
  let decoded = collapsed;
  try {
    decoded = decodeURIComponent(collapsed);
  } catch {
    // Malformed legacy URLs remain matchable in their raw form.
  }
  const normalized = decoded.replace(/\/+$/, "") || "/";
  return normalized.startsWith("/") ? normalized : `/${normalized}`;
}

export async function getRuntimeSeoRule(pathname: string): Promise<RuntimeSeoRule | null> {
  const sql = getSql();
  if (!sql) return null;
  const path = normalizeRuntimeSeoPath(pathname);

  try {
    const rows = await sql`
      select
        path,
        rule_type as "ruleType",
        destination,
        status_code as "statusCode",
        reason
      from seo_runtime_rules
      where path = ${path} and enabled = true
      limit 1
    `;
    return (rows as RuntimeSeoRule[])[0] || null;
  } catch {
    return null;
  }
}

export async function observeGooglebotSeoUrl(urlValue: string) {
  const sql = getSql();
  if (!sql) return;

  try {
    const url = new URL(urlValue);
    if (url.hostname.toLowerCase().replace(/^www\./, "") !== "chioshotel.gr") return;
    const path = normalizeRuntimeSeoPath(url.pathname);
    const canonicalUrl = `https://chioshotel.gr${path === "/" ? "/" : `${path}/`}`;

    await sql`
      insert into seo_url_inventory (
        url, path, source, expected_kind, priority, first_seen_at, last_seen_at, last_googlebot_seen_at, active
      ) values (
        ${canonicalUrl}, ${path}, 'googlebot', 'unknown', 85, now(), now(), now(), true
      )
      on conflict (url) do update set
        last_seen_at = now(),
        last_googlebot_seen_at = now(),
        priority = greatest(seo_url_inventory.priority, 85),
        active = true
    `;
  } catch {
    // Observability must never affect the public request path.
  }
}
