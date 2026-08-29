const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function must(condition, message) {
  if (!condition) {
    console.error(`Performance observability QA failed: ${message}`);
    process.exit(1);
  }
}

const layout = read("app/layout.tsx");
const profiler = read("components/performance/JsSelfProfilingMarkers.tsx");
const route = read("app/api/performance/js-profile/route.ts");
const analytics = read("components/analytics/ConsentAnalytics.tsx");
const nextConfig = read("next.config.ts");
const vercelConfig = JSON.parse(read("vercel.json"));
const packageJson = JSON.parse(read("package.json"));

must(
  layout.includes("JS_SELF_PROFILING_CHIOS_ORIGIN_TRIAL_TOKEN") &&
    layout.includes("JsSelfProfilingMarkers"),
  "root layout must expose the JS Self-Profiling marker trial on public pages",
);

const documentPolicyHeader = (vercelConfig.headers || [])
  .flatMap((entry) => entry.headers || [])
  .find((header) => header.key === "Document-Policy");

must(
  documentPolicyHeader?.value === "js-profiling-mode=lazy",
  "Document-Policy must authorize lazy JS self-profiling without eager page-load warmup",
);

must(
  !JSON.stringify(vercelConfig).includes("Cross-Origin-Opener-Policy") &&
    !JSON.stringify(vercelConfig).includes("Cross-Origin-Embedder-Policy") &&
    !nextConfig.includes("Cross-Origin-Opener-Policy") &&
    !nextConfig.includes("Cross-Origin-Embedder-Policy"),
  "profiling rollout must not introduce COOP/COEP and risk third-party integrations",
);

must(
  profiler.includes("const PROFILE_SAMPLE_RATE = 0.1") &&
    profiler.includes("const PROFILE_DURATION_MS = 4_000") &&
    profiler.includes("const PROFILE_SAMPLE_INTERVAL_MS = 10") &&
    profiler.includes("const PROFILE_MAX_SAMPLES = 500"),
  "client profiling must remain low-rate, short-lived and bounded",
);

must(
  profiler.includes('const ANALYTICS_CONSENT_KEY = "vh_cookie_consent_v1"') &&
    analytics.includes('const LEGACY_CONSENT_KEY = "vh_cookie_consent_v1"') &&
    profiler.includes('window.localStorage.getItem(ANALYTICS_CONSENT_KEY) === "accepted"') &&
    profiler.includes("if (cancelled || !hasAnalyticsConsent()) return;") &&
    profiler.includes("if (!hasAnalyticsConsent() || profileAlreadyDecided()) return;"),
  "profiling must fail closed unless the existing analytics consent state is accepted",
);

must(
  profiler.includes("PROFILE_SESSION_DECIDED_VALUE") &&
    profiler.includes("if (!markProfileDecided()) return;") &&
    profiler.includes("if (Math.random() >= PROFILE_SAMPLE_RATE) return;"),
  "profiling must make at most one bounded sampling decision per browser session",
);

must(
  profiler.includes("/api/performance/js-profile") &&
    profiler.includes("countMarkers(samples)") &&
    !profiler.includes("trace.frames") &&
    !profiler.includes("trace.resources") &&
    !profiler.includes("trace.stacks"),
  "client must send aggregated marker counts only, never raw profile stacks",
);

must(
  route.includes("[JS_SELF_PROFILE_MARKERS]") &&
    route.includes("sameOriginRequest") &&
    route.includes("MAX_BODY_BYTES = 4_096"),
  "telemetry endpoint must validate same-origin compact payloads and emit structured logs",
);

must(
  packageJson.scripts.build.includes("qa-js-self-profiling.cjs") &&
    packageJson.scripts["qa:performance"] === "node scripts/qa-js-self-profiling.cjs",
  "performance observability QA must run in production builds and be directly invokable",
);

console.log("Performance observability QA passed: consent-gated lazy sampled JS Self-Profiling markers are wired without cross-origin isolation.");
