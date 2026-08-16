const { spawnSync } = require("node:child_process");
const { performance } = require("node:perf_hooks");

// The AI Room Finder is fully materialized in source code.
// Production builds must not mutate AI components or AI API routes.
const PATCHES = [
  "normalize-legacy-redirect-destinations.cjs",
  "patch-gsc-validation-routing.cjs",
  "patch-seo-redirect-chains.cjs",
  "patch-seo-review-signal.cjs",
  "patch-gsc-not-found-remediation.cjs",
  "patch-ga4-404-remediation.cjs",
  "patch-seo-inventory-alignment.cjs",
  "patch-seo-runtime-rule-revalidation.cjs",
  "disable-last-minute-room-extras.cjs",
  "patch-long-seo-titles.cjs",
];

function runPatch(filename) {
  const startedAt = performance.now();
  const result = spawnSync(process.execPath, [require.resolve(`./${filename}`)], { cwd: process.cwd(), env: process.env, stdio: "inherit" });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`${filename} failed with exit code ${result.status ?? "unknown"}`);
  return { filename, duration: Math.round(performance.now() - startedAt) };
}

console.log(`Preparing production build with ${PATCHES.length} non-AI maintenance scripts…`);
try {
  const startedAt = performance.now();
  const timings = PATCHES.map(runPatch);
  const totalDuration = Math.round(performance.now() - startedAt);
  console.log("Build preparation timing summary:");
  for (const item of [...timings].sort((a,b)=>b.duration-a.duration).slice(0,5)) console.log(`  ${String(item.duration).padStart(5," ")}ms  ${item.filename}`);
  console.log(`Build preparation completed in ${totalDuration}ms.`);
} catch (error) {
  console.error("Build preparation failed:", error instanceof Error ? error.message : error);
  process.exit(1);
}
