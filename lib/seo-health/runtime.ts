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

// Kept as a no-op so proxy behavior stays unchanged while avoiding a Neon write
// for every Google crawler request. Runtime redirects/410 rules are still served
// from seo_runtime_rules exactly as before.
export async function observeGooglebotSeoUrl(_urlValue: string) {
  return;
}
