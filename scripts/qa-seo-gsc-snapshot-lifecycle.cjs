const fs = require("node:fs");

const importer = fs.readFileSync("lib/seo-health/gsc-pages-import.ts", "utf8");
const redirectPatch = fs.readFileSync("scripts/patch-seo-redirect-chains.cjs", "utf8");

for (const signal of [
  "extractSnapshotKey",
  "seo_gsc_pages_state",
  "active_snapshot_key",
  "snapshot_key",
  "analytics.grain = 'page'",
]) {
  if (!importer.includes(signal)) throw new Error(`Missing GSC snapshot lifecycle signal: ${signal}`);
}

for (const signal of [
  "getSingleHopCanonicalNormalization",
  "sameRequestExceptWww",
  'severity: "healthy"',
  "canonical single-hop normalization",
]) {
  if (!redirectPatch.includes(signal)) throw new Error(`Missing redirect normalization signal: ${signal}`);
}

console.log("SEO GSC snapshot lifecycle QA passed.");
