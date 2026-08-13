const { spawnSync } = require("node:child_process");
const { performance } = require("node:perf_hooks");

const PATCHES = [
  "disable-last-minute-room-extras.cjs",
  "patch-long-seo-titles.cjs",
  "patch-ai-gmail-email.cjs",
  "enable-smart-ai-concierge.cjs",
  "fix-ai-availability-flow.cjs",
  "patch-ai-live-offer-presentation.cjs",
  "patch-ai-find-your-room-galleries.cjs",
  "patch-ai-room-ui.cjs",
  "patch-ai-request-live-verification.cjs",
  "patch-ai-gmail-fallback.cjs",
  "patch-ai-safe-fallback-backend.cjs",
  "patch-ai-safe-fallback-frontend.cjs",
  "patch-ai-date-order-validation.cjs",
  "patch-ai-language-and-desktop-carousel.cjs",
  "patch-ai-fast-availability-response.cjs",
  "patch-ai-human-conversation.cjs",
  "patch-ai-personalized-recommendations.cjs",
  "patch-ai-url-language-and-recommendation-labels.cjs",
  "patch-active-ai-assistant-logic.cjs",
  "patch-ai-natural-sales-tone.cjs",
  "patch-ai-room-detail-thumbnail-row.cjs",
  "fix-ai-localized-apartment-detail-parser.cjs",
  "patch-ai-mobile-composer-focus.cjs",
];

function runPatch(filename) {
  const startedAt = performance.now();
  const result = spawnSync(process.execPath, [require.resolve(`./${filename}`)], { cwd: process.cwd(), env: process.env, stdio: "inherit" });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`${filename} failed with exit code ${result.status ?? "unknown"}`);
  return { filename, duration: Math.round(performance.now() - startedAt) };
}

console.log(`Preparing production build with ${PATCHES.length} legacy non-Room-Finder patches…`);
try {
  const startedAt = performance.now();
  const timings = PATCHES.map(runPatch);
  const totalDuration = Math.round(performance.now() - startedAt);
  console.log("Patch timing summary:");
  for (const item of [...timings].sort((a,b)=>b.duration-a.duration).slice(0,5)) console.log(`  ${String(item.duration).padStart(5," ")}ms  ${item.filename}`);
  console.log(`Build preparation completed in ${totalDuration}ms.`);
} catch (error) {
  console.error("Build preparation failed:", error instanceof Error ? error.message : error);
  process.exit(1);
}
