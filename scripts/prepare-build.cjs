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
];

const SLOW_PATCH_MS = 500;

function runPatch(filename) {
  const startedAt = performance.now();
  const modulePath = require.resolve(`./${filename}`);

  delete require.cache[modulePath];
  require(modulePath);

  const duration = Math.round(performance.now() - startedAt);
  console.log(`✓ ${filename} (${duration}ms)`);
  return { filename, duration };
}

console.log(`Preparing production build with ${PATCHES.length} legacy patches…`);
const startedAt = performance.now();

try {
  const timings = PATCHES.map(runPatch);
  const totalDuration = Math.round(performance.now() - startedAt);
  const slowest = [...timings].sort((a, b) => b.duration - a.duration).slice(0, 5);
  const slowPatches = timings.filter((item) => item.duration >= SLOW_PATCH_MS);

  console.log("\nPatch timing summary:");
  for (const item of slowest) {
    console.log(`  ${String(item.duration).padStart(5, " ")}ms  ${item.filename}`);
  }

  if (slowPatches.length) {
    console.warn(`\n${slowPatches.length} patch(es) exceeded ${SLOW_PATCH_MS}ms and should be migrated first.`);
  }

  console.log(`\nBuild preparation completed in ${totalDuration}ms.`);
} catch (error) {
  console.error("Build preparation failed:", error instanceof Error ? error.message : error);
  process.exit(1);
}
