const { spawnSync } = require("node:child_process");
const { performance } = require("node:perf_hooks");

const PATCHES = [
  "disable-last-minute-room-extras.cjs",
  "patch-long-seo-titles.cjs",
  "optimize-frog-images.cjs",
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

function runPatch(filename) {
  const startedAt = performance.now();
  const result = spawnSync(process.execPath, [require.resolve(`./${filename}`)], {
    cwd: process.cwd(),
    env: process.env,
    stdio: "inherit",
  });

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    throw new Error(`${filename} failed with exit code ${result.status ?? "unknown"}`);
  }

  const duration = Math.round(performance.now() - startedAt);
  console.log(`✓ ${filename} (${duration}ms)`);
}

console.log(`Preparing production build with ${PATCHES.length} verified patches…`);
const startedAt = performance.now();

try {
  for (const patch of PATCHES) {
    runPatch(patch);
  }

  console.log(`Build preparation completed in ${Math.round(performance.now() - startedAt)}ms.`);
} catch (error) {
  console.error("Build preparation failed:", error instanceof Error ? error.message : error);
  process.exit(1);
}
