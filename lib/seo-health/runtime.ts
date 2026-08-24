import { neon } from "@neondatabase/serverless";
import { getCache } from "@vercel/functions";

export type RuntimeSeoRule = {
  path: string;
  ruleType: "redirect" | "gone";
  destination: string | null;
  statusCode: number;
  reason: string;
};

type RuntimeSeoRuleMap = Record<string, RuntimeSeoRule>;

const RUNTIME_SEO_CACHE_KEY = "enabled-rules-v1";
const RUNTIME_SEO_CACHE_TAG = "seo-runtime-rules";
const RUNTIME_SEO_CACHE_TTL_SECONDS = 6 * 60 * 60;

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

async function readRuntimeSeoRulesFromNeon(): Promise<RuntimeSeoRuleMap> {
  const sql = getSql();
  if (!sql) return {};

  const rows = await sql`
    select
      path,
      rule_type as "ruleType",
      destination,
      status_code as "statusCode",
      reason
    from seo_runtime_rules
    where enabled = true
    order by path
  `;

  const rules: RuntimeSeoRuleMap = {};
  for (const row of rows as RuntimeSeoRule[]) {
    const path = normalizeRuntimeSeoPath(String(row.path));
    rules[path] = {
      path,
      ruleType: row.ruleType,
      destination: row.destination ? String(row.destination) : null,
      statusCode: Number(row.statusCode),
      reason: String(row.reason || "runtime SEO rule"),
    };
  }
  return rules;
}

async function getRuntimeSeoRules(): Promise<RuntimeSeoRuleMap> {
  const cache = getCache({ namespace: "seo-runtime" });

  try {
    const cached = await cache.get(RUNTIME_SEO_CACHE_KEY) as RuntimeSeoRuleMap | undefined;
    if (cached) return cached;
  } catch (cacheError) {
    console.error("seo runtime cache read failed", cacheError);
  }

  const rules = await readRuntimeSeoRulesFromNeon();

  try {
    await cache.set(RUNTIME_SEO_CACHE_KEY, rules, {
      ttl: RUNTIME_SEO_CACHE_TTL_SECONDS,
      tags: [RUNTIME_SEO_CACHE_TAG],
      name: "seo-runtime-rules",
    });
  } catch (cacheError) {
    console.error("seo runtime cache write failed", cacheError);
  }

  return rules;
}

export async function getRuntimeSeoRule(pathname: string): Promise<RuntimeSeoRule | null> {
  const path = normalizeRuntimeSeoPath(pathname);

  try {
    const rules = await getRuntimeSeoRules();
    return rules[path] || null;
  } catch {
    return null;
  }
}

// Kept as a no-op so proxy behavior stays unchanged while avoiding a Neon write
// for every Google crawler request. Runtime redirects/410 rules are served from
// the cached seo_runtime_rules snapshot instead of querying Neon per request.
export async function observeGooglebotSeoUrl(_urlValue: string) {
  return;
}
