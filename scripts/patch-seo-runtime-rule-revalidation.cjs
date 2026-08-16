const fs = require("node:fs");
const path = require("node:path");

const root = process.cwd();
const storePath = path.join(root, "lib", "seo-health", "store.ts");
const enginePath = path.join(root, "lib", "seo-health", "engine.ts");

function replaceRequired(source, before, after, label) {
  if (source.includes(after)) return { source, changed: false };
  if (!source.includes(before)) {
    throw new Error(`SEO runtime-rule revalidation anchor not found: ${label}`);
  }
  return { source: source.replace(before, after), changed: true };
}

function patchStore() {
  let source = fs.readFileSync(storePath, "utf8");
  let changed = false;
  let result;

  const typeBefore = `export type SeoRuntimeRule = {\n  path: string;\n  ruleType: "redirect" | "gone";\n  destination: string | null;\n  statusCode: number;\n  confidence: string;\n  reason: string;\n};\n`;
  const typeAfter = `export type SeoRuntimeRule = {\n  path: string;\n  ruleType: "redirect" | "gone";\n  destination: string | null;\n  statusCode: number;\n  confidence: string;\n  reason: string;\n};\n\nexport type SeoRuntimeRuleVerification = SeoRuntimeRule & {\n  sourceUrl: string;\n  lastVerifiedAt: string | null;\n};\n`;
  result = replaceRequired(source, typeBefore, typeAfter, "runtime rule verification type");
  source = result.source;
  changed ||= result.changed;

  const upsertBefore = `    insert into seo_runtime_rules (\n      path, rule_type, destination, status_code, enabled, confidence, reason, source_url, created_at, updated_at\n    ) values (\n      \${normalizedPath}, \${input.ruleType}, \${input.destination || null}, \${input.statusCode}, true,\n      \${input.confidence}, \${input.reason}, \${input.sourceUrl}, now(), now()\n    )\n    on conflict (path) do update set\n      rule_type = excluded.rule_type,\n      destination = excluded.destination,\n      status_code = excluded.status_code,\n      enabled = true,\n      confidence = excluded.confidence,\n      reason = excluded.reason,\n      source_url = excluded.source_url,\n      updated_at = now()\n`;
  const upsertAfter = `    insert into seo_runtime_rules (\n      path, rule_type, destination, status_code, enabled, confidence, reason, source_url, created_at, updated_at, last_verified_at\n    ) values (\n      \${normalizedPath}, \${input.ruleType}, \${input.destination || null}, \${input.statusCode}, true,\n      \${input.confidence}, \${input.reason}, \${input.sourceUrl}, now(), now(), now()\n    )\n    on conflict (path) do update set\n      rule_type = excluded.rule_type,\n      destination = excluded.destination,\n      status_code = excluded.status_code,\n      enabled = true,\n      confidence = excluded.confidence,\n      reason = excluded.reason,\n      source_url = excluded.source_url,\n      updated_at = now(),\n      last_verified_at = now()\n`;
  result = replaceRequired(source, upsertBefore, upsertAfter, "creation-time rule verification timestamp");
  source = result.source;
  changed ||= result.changed;

  const verifiedBefore = `export async function markSeoRuntimeRuleVerified(pathname: string) {\n  const sql = getSql();\n  const path = normalizeSeoPath(pathname);\n  await sql\`\n    update seo_runtime_rules set last_verified_at = now() where path = \${path}\n  \`;\n}\n\nexport async function getSeoHealthDashboard() {\n`;
  const verifiedAfter = `export async function markSeoRuntimeRuleVerified(pathname: string) {\n  const sql = getSql();\n  const path = normalizeSeoPath(pathname);\n  await sql\`\n    update seo_runtime_rules set last_verified_at = now() where path = \${path}\n  \`;\n}\n\nexport async function getSeoRuntimeRulesForVerification(\n  limit = 40,\n): Promise<SeoRuntimeRuleVerification[]> {\n  const sql = getSql();\n  const safeLimit = Math.max(1, Math.min(200, Math.trunc(limit)));\n  const rows = await sql\`\n    select\n      path,\n      rule_type as "ruleType",\n      destination,\n      status_code as "statusCode",\n      confidence,\n      reason,\n      coalesce(source_url, '') as "sourceUrl",\n      last_verified_at::text as "lastVerifiedAt"\n    from seo_runtime_rules\n    where enabled = true and confidence = 'high'\n    order by last_verified_at asc nulls first, updated_at asc\n    limit \${safeLimit}\n  \`;\n  return rows as SeoRuntimeRuleVerification[];\n}\n\nexport async function disableSeoRuntimeRule(pathname: string) {\n  const sql = getSql();\n  const path = normalizeSeoPath(pathname);\n  await sql\`\n    update seo_runtime_rules\n    set enabled = false, updated_at = now(), last_verified_at = now()\n    where path = \${path}\n  \`;\n}\n\nexport async function getSeoHealthDashboard() {\n`;
  result = replaceRequired(source, verifiedBefore, verifiedAfter, "runtime rule verification store functions");
  source = result.source;
  changed ||= result.changed;

  if (changed) fs.writeFileSync(storePath, source, "utf8");
  return changed;
}

function patchEngine() {
  let source = fs.readFileSync(enginePath, "utf8");
  let changed = false;
  let result;

  const importsBefore = `  bulkUpsertSeoUrls,\n  ensureSeoHealthTables,\n  finishSeoHealthRun,\n  getSeoInspectionCandidates,\n  normalizeSeoPath,\n  saveSeoInspection,\n  seedSeoUrlsFromStoredGsc,\n  startSeoHealthRun,\n  upsertSeoRuntimeRule,\n  type SeoUrlCandidate,\n`;
  const importsAfter = `  bulkUpsertSeoUrls,\n  disableSeoRuntimeRule,\n  ensureSeoHealthTables,\n  finishSeoHealthRun,\n  getSeoInspectionCandidates,\n  getSeoRuntimeRulesForVerification,\n  markSeoRuntimeRuleVerified,\n  normalizeSeoPath,\n  saveSeoInspection,\n  seedSeoUrlsFromStoredGsc,\n  startSeoHealthRun,\n  upsertSeoRuntimeRule,\n  type SeoRuntimeRuleVerification,\n  type SeoUrlCandidate,\n`;
  result = replaceRequired(source, importsBefore, importsAfter, "engine store imports");
  source = result.source;
  changed ||= result.changed;

  const inspectAnchor = `async function inspectCandidate(\n`;
  const revalidationCode = `type RuntimeRuleVerificationState =\n  | "verified"\n  | "repaired"\n  | "disabled"\n  | "deferred";\n\ntype RuntimeRuleVerificationSummary = {\n  checked: number;\n  verified: number;\n  repaired: number;\n  disabled: number;\n  deferred: number;\n  error: string;\n};\n\nasync function verifyRuntimeRule(\n  rule: SeoRuntimeRuleVerification,\n  targetCache: Map<string, Promise<LiveSeoCheck>>,\n): Promise<RuntimeRuleVerificationState> {\n  if (rule.ruleType === "gone") {\n    if (isTechnicalGonePath(rule.path)) {\n      await markSeoRuntimeRuleVerified(rule.path);\n      return "verified";\n    }\n    await disableSeoRuntimeRule(rule.path);\n    return "disabled";\n  }\n\n  const destination = String(rule.destination || "");\n  if (!destination || !sameSite(destination)) {\n    await disableSeoRuntimeRule(rule.path);\n    return "disabled";\n  }\n\n  let targetPromise = targetCache.get(destination);\n  if (!targetPromise) {\n    targetPromise = inspectLiveSeoUrl(destination);\n    targetCache.set(destination, targetPromise);\n  }\n  const live = await targetPromise;\n\n  // Network failures, throttling and server errors can be transient. Preserve the\n  // current rule and retry it on a later run instead of turning a temporary\n  // origin problem into a permanent migration failure.\n  if (live.status == null || live.status >= 500 || (live.status >= 400 && live.status !== 404 && live.status !== 410)) {\n    return "deferred";\n  }\n\n  if (live.status === 404 || live.status === 410 || live.noindex) {\n    await disableSeoRuntimeRule(rule.path);\n    return "disabled";\n  }\n\n  if (live.status !== 200) {\n    return "deferred";\n  }\n\n  const effectiveTarget = live.finalUrl || destination;\n  if (!sameSite(effectiveTarget) || !isCurrentCanonicalUrl(effectiveTarget)) {\n    await disableSeoRuntimeRule(rule.path);\n    return "disabled";\n  }\n\n  if (live.canonical && !sameUrl(live.canonical, effectiveTarget)) {\n    await disableSeoRuntimeRule(rule.path);\n    return "disabled";\n  }\n\n  if (live.redirectChain.length > 0 && destination !== effectiveTarget) {\n    await upsertSeoRuntimeRule({\n      path: rule.path,\n      ruleType: "redirect",\n      destination: effectiveTarget,\n      statusCode: 301,\n      confidence: "high",\n      reason: rule.reason,\n      sourceUrl: rule.sourceUrl || new URL(rule.path, SITE_ORIGIN).toString(),\n    });\n    return "repaired";\n  }\n\n  await markSeoRuntimeRuleVerified(rule.path);\n  return "verified";\n}\n\nasync function revalidateRuntimeSeoRules(\n  limit: number,\n): Promise<RuntimeRuleVerificationSummary> {\n  const summary: RuntimeRuleVerificationSummary = {\n    checked: 0,\n    verified: 0,\n    repaired: 0,\n    disabled: 0,\n    deferred: 0,\n    error: "",\n  };\n\n  try {\n    const rules = await getSeoRuntimeRulesForVerification(limit);\n    summary.checked = rules.length;\n    const targetCache = new Map<string, Promise<LiveSeoCheck>>();\n    const batchSize = 8;\n\n    for (let index = 0; index < rules.length; index += batchSize) {\n      const batch = rules.slice(index, index + batchSize);\n      const states = await Promise.all(\n        batch.map(async (rule) => {\n          try {\n            return await verifyRuntimeRule(rule, targetCache);\n          } catch (error) {\n            console.error(\`[seo-health] runtime rule verification failed \${rule.path}\`, error);\n            return "deferred" as const;\n          }\n        }),\n      );\n\n      for (const state of states) summary[state] += 1;\n    }\n  } catch (error) {\n    summary.error = error instanceof Error ? error.message : String(error);\n  }\n\n  return summary;\n}\n\nasync function inspectCandidate(\n`;
  result = replaceRequired(source, inspectAnchor, revalidationCode, "runtime rule revalidation engine");
  source = result.source;
  changed ||= result.changed;

  const runBefore = `  await ensureSeoHealthTables();\n\n  const canonicalRows = routeMap\n`;
  const runAfter = `  await ensureSeoHealthTables();\n\n  const configuredRuleLimit = Number(process.env.SEO_RUNTIME_RULE_VERIFY_LIMIT || 40);\n  const runtimeRuleLimit = Number.isFinite(configuredRuleLimit)\n    ? Math.max(1, Math.min(200, Math.trunc(configuredRuleLimit)))\n    : 40;\n  const runtimeRuleVerification = await revalidateRuntimeSeoRules(runtimeRuleLimit);\n\n  const canonicalRows = routeMap\n`;
  result = replaceRequired(source, runBefore, runAfter, "weekly runtime rule verification call");
  source = result.source;
  changed ||= result.changed;

  const returnBefore = `      candidateCount: candidates.length,\n      gscQuotaExhausted: inspectionContext.gscQuotaExhausted,\n      ...summary,\n`;
  const returnAfter = `      candidateCount: candidates.length,\n      gscQuotaExhausted: inspectionContext.gscQuotaExhausted,\n      runtimeRuleVerification,\n      ...summary,\n`;
  result = replaceRequired(source, returnBefore, returnAfter, "weekly response verification summary");
  source = result.source;
  changed ||= result.changed;

  if (changed) fs.writeFileSync(enginePath, source, "utf8");
  return changed;
}

const storeChanged = patchStore();
const engineChanged = patchEngine();
console.log(
  `SEO runtime-rule lifecycle: store=${storeChanged ? "patched" : "already"}, engine=${engineChanged ? "patched" : "already"}`,
);
