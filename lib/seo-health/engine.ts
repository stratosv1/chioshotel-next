import { getRouteByPath, routeMap } from "@/lib/url-map";
import { inspectGoogleIndexUrl, type GscIndexStatus } from "@/lib/seo-health/gsc-inspection";
import { inspectLiveSeoUrl, type LiveSeoCheck } from "@/lib/seo-health/live";
import {
  bulkUpsertSeoUrls,
  ensureSeoHealthTables,
  finishSeoHealthRun,
  getSeoInspectionCandidates,
  normalizeSeoPath,
  saveSeoInspection,
  seedSeoUrlsFromStoredGsc,
  startSeoHealthRun,
  upsertSeoRuntimeRule,
  type SeoUrlCandidate,
} from "@/lib/seo-health/store";

const SITE_ORIGIN = "https://chioshotel.gr";
const PRIMARY_SITE = "sc-domain:chioshotel.gr";
const INSPECTION_BATCH_SIZE = 8;
const BATCH_PAUSE_MS = 1100;
const NON_INDEXABLE_REDIRECT_ITEM_IDS = new Set(["find-your-room"]);

const GONE_PREFIXES = [
  "/wp-admin",
  "/wp-login.php",
  "/wp-comments-post.php",
  "/xmlrpc.php",
  "/wp-json",
  "/wp-content",
  "/wp-includes",
  "/wp-sitemap.xml",
  "/elementor-landing-page-4251",
  "/web-stories",
  "/cdn-cgi",
  "/.cloud/rum",
  "/tag",
  "/topics",
  "/comments",
  "/el/tag",
  "/el/topics",
  "/fr/tag",
  "/fr/topics",
  "/de/tag",
  "/de/topics",
  "/it/tag",
  "/it/topics",
  "/es/tag",
  "/es/topics",
  "/tr/tag",
  "/tr/topics",
];

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function normalizedUrlKey(value: string) {
  if (!value) return "";
  try {
    const url = new URL(value);
    const host = url.hostname.toLowerCase().replace(/^www\./, "");
    const path = normalizeSeoPath(url.pathname);
    return `${host}${path}`;
  } catch {
    return value.replace(/\/+$/, "");
  }
}

function sameUrl(a: string, b: string) {
  return Boolean(a && b && normalizedUrlKey(a) === normalizedUrlKey(b));
}

function sameSite(value: string) {
  try {
    return new URL(value).hostname.toLowerCase().replace(/^www\./, "") === "chioshotel.gr";
  } catch {
    return false;
  }
}

function routeForUrl(value: string) {
  try {
    const url = new URL(value);
    if (!sameSite(value)) return undefined;
    return getRouteByPath(normalizeSeoPath(url.pathname));
  } catch {
    return undefined;
  }
}

function isIntentionalNonIndexableRedirect(value: string) {
  const route = routeForUrl(value);
  return Boolean(route && NON_INDEXABLE_REDIRECT_ITEM_IDS.has(route.itemId));
}

function isCurrentCanonicalUrl(value: string) {
  const route = routeForUrl(value);
  return Boolean(
    route?.action === "KEEP" &&
      !NON_INDEXABLE_REDIRECT_ITEM_IDS.has(route.itemId),
  );
}

function isTechnicalGonePath(pathname: string) {
  const path = normalizeSeoPath(pathname);
  if (path === "/feed" || path.endsWith("/feed")) return true;
  return GONE_PREFIXES.some((prefix) => path === prefix || path.startsWith(`${prefix}/`));
}

function coverageIncludes(index: GscIndexStatus, needle: string) {
  return String(index.coverageState || "").toLowerCase().includes(needle.toLowerCase());
}

function isGscQuotaError(message: string) {
  return /\b429\b|quota exceeded|RESOURCE_EXHAUSTED/i.test(message);
}

type Decision = {
  category: string;
  severity: "healthy" | "info" | "warning" | "critical";
  decision: string;
  action: string;
  autoExecuted: boolean;
  autoRule?: {
    ruleType: "redirect" | "gone";
    destination?: string;
    statusCode: number;
    reason: string;
  };
};

type InspectionContext = {
  gscQuotaExhausted: boolean;
};

async function safeRedirectDecision(
  candidate: SeoUrlCandidate,
  target: string,
  reason: string,
): Promise<Decision | null> {
  if (!target || !sameSite(target) || !isCurrentCanonicalUrl(target)) return null;
  if (normalizeSeoPath(new URL(target).pathname) === candidate.path) return null;

  const targetLive = await inspectLiveSeoUrl(target);
  if (targetLive.status !== 200 || targetLive.noindex) return null;
  if (targetLive.canonical && !sameUrl(targetLive.canonical, target)) return null;

  return {
    category: "legacy_redirect_autofix",
    severity: "info",
    decision: "High-confidence legacy URL replacement confirmed.",
    action: `301 redirect to ${target}`,
    autoExecuted: true,
    autoRule: {
      ruleType: "redirect",
      destination: target,
      statusCode: 301,
      reason,
    },
  };
}

async function decide(
  candidate: SeoUrlCandidate,
  live: LiveSeoCheck,
  index: GscIndexStatus,
): Promise<Decision> {
  const intentionalRedirect = isIntentionalNonIndexableRedirect(candidate.url);
  const expectedCanonical =
    !intentionalRedirect &&
    (candidate.expectedKind === "canonical" || isCurrentCanonicalUrl(candidate.url));
  const fetchState = String(index.pageFetchState || "");
  const robotsState = String(index.robotsTxtState || "");
  const indexingState = String(index.indexingState || "");
  const canonicalHint = index.googleCanonical || index.userCanonical || live.canonical || "";

  if (live.status == null) {
    return {
      category: "live_fetch_error",
      severity: "critical",
      decision: "The weekly auditor could not obtain a deterministic HTTP response.",
      action: "Investigate origin/Vercel/network failure before making an SEO change.",
      autoExecuted: false,
    };
  }

  if (live.status >= 500 || fetchState === "SERVER_ERROR") {
    return {
      category: "server_error",
      severity: "critical",
      decision: "Google or the live auditor encountered a server-side failure.",
      action: "Investigate the failing route/runtime and restore a stable 200/3xx/4xx response. Never mask a 5xx with an SEO redirect.",
      autoExecuted: false,
    };
  }

  if (fetchState === "REDIRECT_ERROR" || /redirect loop|more than .* redirects/i.test(live.error)) {
    return {
      category: "redirect_error",
      severity: "critical",
      decision: "Redirect loop or invalid/overlong redirect chain detected.",
      action: "Flatten the route to one direct hop to its final canonical URL after confirming the intended destination.",
      autoExecuted: false,
    };
  }

  if (expectedCanonical) {
    if (live.status === 404 || live.status === 410) {
      return {
        category: "canonical_not_found",
        severity: "critical",
        decision: "A URL declared as a current canonical route is unavailable.",
        action: "Restore the canonical route or intentionally retire it with a verified replacement. Do not auto-redirect without an exact equivalent.",
        autoExecuted: false,
      };
    }

    if (live.redirectChain.length > 1) {
      return {
        category: "redirect_chain",
        severity: "warning",
        decision: "A current route passes through multiple redirects.",
        action: `Flatten to one hop ending at ${live.finalUrl}.`,
        autoExecuted: false,
      };
    }

    if (live.redirectChain.length === 1 || (live.status >= 300 && live.status < 400)) {
      return {
        category: "unexpected_redirect",
        severity: "warning",
        decision: "A route marked KEEP is redirecting instead of serving its canonical page.",
        action: "Verify url-map and routing ownership; either serve 200 here or change the canonical route definition.",
        autoExecuted: false,
      };
    }

    if (live.noindex || indexingState === "BLOCKED_BY_META_TAG" || indexingState === "BLOCKED_BY_HTTP_HEADER") {
      return {
        category: "unexpected_noindex",
        severity: "warning",
        decision: "A canonical SEO page is blocked from indexing.",
        action: "Remove the accidental noindex only after verifying that this page is intended for Google Search.",
        autoExecuted: false,
      };
    }

    if (robotsState === "DISALLOWED") {
      return {
        category: "robots_blocked",
        severity: "warning",
        decision: "Google reports that crawling is blocked by robots.txt.",
        action: "Correct robots.txt if the route is intended to be indexed; otherwise reconcile routeMap/sitemap expectations.",
        autoExecuted: false,
      };
    }

    if (index.googleCanonical && !sameUrl(index.googleCanonical, candidate.url)) {
      return {
        category: "google_canonical_mismatch",
        severity: "warning",
        decision: "Google selected a different canonical URL than the current route.",
        action: `Audit duplicate content, internal links, hreflang and canonical signals against ${index.googleCanonical}.`,
        autoExecuted: false,
      };
    }

    if (live.canonical && !sameUrl(live.canonical, candidate.url)) {
      return {
        category: "declared_canonical_mismatch",
        severity: "warning",
        decision: "The live page declares another URL as canonical.",
        action: `Correct the page canonical or route ownership after verifying ${live.canonical}.`,
        autoExecuted: false,
      };
    }

    if (coverageIncludes(index, "crawled") && coverageIncludes(index, "not indexed")) {
      return {
        category: "crawled_not_indexed",
        severity: "warning",
        decision: "Google crawled the page but currently excludes it from the index.",
        action: "Review content uniqueness, intent overlap, internal-link strength and canonical/hreflang consistency. Do not auto-edit content.",
        autoExecuted: false,
      };
    }

    if (coverageIncludes(index, "discovered") && coverageIncludes(index, "not indexed")) {
      return {
        category: "discovered_not_indexed",
        severity: "warning",
        decision: "Google knows the URL but has not crawled/indexed it yet.",
        action: "Verify sitemap inclusion and strong crawlable internal links; then monitor the next inspection.",
        autoExecuted: false,
      };
    }

    if (fetchState === "NOT_FOUND" && live.status === 200) {
      return {
        category: "google_stale_404",
        severity: "info",
        decision: "Google's last indexed crawl saw 404, but the page is live now.",
        action: "No routing change. Keep the stable 200 response and wait for Google to recrawl.",
        autoExecuted: false,
      };
    }

    return {
      category: "healthy",
      severity: "healthy",
      decision: "Canonical route is technically consistent.",
      action: "No change.",
      autoExecuted: false,
    };
  }

  if (live.redirectChain.length > 1) {
    return {
      category: "redirect_chain",
      severity: "warning",
      decision: "Legacy URL redirects through more than one hop.",
      action: `Flatten the source directly to ${live.finalUrl}.`,
      autoExecuted: false,
    };
  }

  if (live.redirectChain.length === 1 || (live.status >= 300 && live.status < 400)) {
    return {
      category: "page_with_redirect",
      severity: "healthy",
      decision: intentionalRedirect
        ? "Intentional Room Finder alias redirects directly to the noindex AI application."
        : "Legacy/unknown URL already redirects in one hop.",
      action: "No change unless the final destination is later found invalid.",
      autoExecuted: false,
    };
  }

  if (live.status === 410) {
    return {
      category: "gone",
      severity: "healthy",
      decision: "The obsolete URL is intentionally retired.",
      action: "No change.",
      autoExecuted: false,
    };
  }

  if (live.status === 404) {
    if (isTechnicalGonePath(candidate.path)) {
      return {
        category: "obsolete_technical_url",
        severity: "info",
        decision: "The URL belongs to obsolete WordPress/archive/utility infrastructure and has no content replacement.",
        action: "Serve 410 Gone consistently.",
        autoExecuted: true,
        autoRule: {
          ruleType: "gone",
          statusCode: 410,
          reason: "Deterministic obsolete WordPress/archive/utility path",
        },
      };
    }

    const redirectDecision = await safeRedirectDecision(
      candidate,
      canonicalHint,
      "Google/live canonical signals identify an exact current canonical replacement",
    );
    if (redirectDecision) return redirectDecision;

    return {
      category: "not_found",
      severity: "info",
      decision: "The URL is genuinely missing and no exact replacement is proven.",
      action: "Keep 404. Create a redirect only if later evidence identifies a genuinely equivalent canonical destination.",
      autoExecuted: false,
    };
  }

  if (live.status === 200 && canonicalHint && !sameUrl(canonicalHint, candidate.url)) {
    const redirectDecision = await safeRedirectDecision(
      candidate,
      canonicalHint,
      "Unmanaged duplicate URL declares/has a Google-selected current canonical replacement",
    );
    if (redirectDecision) return redirectDecision;
  }

  if (fetchState === "SOFT_404") {
    return {
      category: "soft_404",
      severity: "warning",
      decision: "Google treats the page as a soft 404.",
      action: "Either provide substantial matching content or return a truthful 404/410/redirect based on the URL's real purpose.",
      autoExecuted: false,
    };
  }

  return {
    category: "unmanaged_live_url",
    severity: "info",
    decision: "The URL is live but is not registered as a current canonical route.",
    action: "Review whether it should be added to the canonical route inventory, redirected, noindexed, or retired.",
    autoExecuted: false,
  };
}

async function inspectCandidate(
  request: Request,
  runId: string,
  siteUrl: string,
  candidate: SeoUrlCandidate,
  context: InspectionContext,
) {
  const live = await inspectLiveSeoUrl(candidate.url);
  let index: GscIndexStatus = {};
  let gscError = "";

  if (context.gscQuotaExhausted) {
    gscError = "URL Inspection skipped because Search Console quota was already exhausted earlier in this run.";
  } else {
    try {
      const result = await inspectGoogleIndexUrl(request, {
        siteUrl,
        inspectionUrl: candidate.url,
        languageCode: "en-US",
      });
      index = result.inspectionResult?.indexStatusResult || {};
    } catch (error) {
      gscError = error instanceof Error ? error.message : String(error);
      if (isGscQuotaError(gscError)) context.gscQuotaExhausted = true;
    }
  }

  const decision = await decide(candidate, live, index);

  if (decision.autoRule) {
    await upsertSeoRuntimeRule({
      path: candidate.path,
      ruleType: decision.autoRule.ruleType,
      destination: decision.autoRule.destination || null,
      statusCode: decision.autoRule.statusCode,
      confidence: "high",
      reason: decision.autoRule.reason,
      sourceUrl: candidate.url,
    });
  }

  await saveSeoInspection({
    runId,
    url: candidate.url,
    source: candidate.source,
    expectedKind: candidate.expectedKind,
    liveStatus: live.status,
    finalUrl: live.finalUrl,
    redirectHops: live.redirectChain.length,
    liveCanonical: live.canonical,
    liveNoindex: live.noindex,
    xRobotsTag: live.xRobotsTag,
    gscVerdict: String(index.verdict || ""),
    coverageState: String(index.coverageState || ""),
    pageFetchState: String(index.pageFetchState || ""),
    indexingState: String(index.indexingState || ""),
    robotsState: String(index.robotsTxtState || ""),
    googleCanonical: String(index.googleCanonical || ""),
    userCanonical: String(index.userCanonical || ""),
    lastCrawlTime: String(index.lastCrawlTime || ""),
    category: decision.category,
    severity: decision.severity,
    decision: decision.decision,
    action: decision.action,
    autoExecuted: decision.autoExecuted,
    detail: {
      liveError: live.error,
      redirectChain: live.redirectChain,
      gscError,
      gscQuotaExhausted: context.gscQuotaExhausted,
      crawledAs: index.crawledAs || "",
      sitemaps: index.sitemap || [],
      referringUrls: index.referringUrls || [],
    },
  });

  return decision;
}

export async function runWeeklySeoHealth(
  request: Request,
  options: { siteUrl?: string; limit?: number } = {},
) {
  const siteUrl = options.siteUrl || PRIMARY_SITE;
  const limit = Math.max(1, Math.min(1800, Math.trunc(options.limit || Number(process.env.SEO_HEALTH_WEEKLY_LIMIT || 1200))));

  await ensureSeoHealthTables();

  const canonicalRows = routeMap
    .filter(
      (route) =>
        route.action === "KEEP" &&
        !NON_INDEXABLE_REDIRECT_ITEM_IDS.has(route.itemId),
    )
    .map((route) => ({
      url: new URL(route.path, SITE_ORIGIN).toString(),
      source: "canonical" as const,
      expectedKind: "canonical" as const,
      priority: route.priority === "Critical" ? 100 : route.priority === "High" ? 95 : route.priority === "Medium" ? 90 : 85,
    }));

  await bulkUpsertSeoUrls(canonicalRows);
  const gscSeeded = await seedSeoUrlsFromStoredGsc(siteUrl);
  const candidates = await getSeoInspectionCandidates(limit);
  const runId = await startSeoHealthRun(siteUrl);
  const inspectionContext: InspectionContext = { gscQuotaExhausted: false };

  const summary = {
    inspected: 0,
    healthy: 0,
    autoFixed: 0,
    review: 0,
    critical: 0,
  };

  try {
    for (let index = 0; index < candidates.length; index += INSPECTION_BATCH_SIZE) {
      const batch = candidates.slice(index, index + INSPECTION_BATCH_SIZE);
      const results = await Promise.all(
        batch.map(async (candidate) => {
          try {
            return await inspectCandidate(
              request,
              runId,
              siteUrl,
              candidate,
              inspectionContext,
            );
          } catch (error) {
            console.error(`[seo-health] candidate failed ${candidate.url}`, error);
            return null;
          }
        }),
      );

      for (const decision of results) {
        if (!decision) continue;
        summary.inspected += 1;
        if (decision.severity === "healthy") summary.healthy += 1;
        if (decision.autoExecuted) summary.autoFixed += 1;
        if (decision.severity === "critical") summary.critical += 1;
        if (decision.severity !== "healthy" && !decision.autoExecuted) summary.review += 1;
      }

      if (index + INSPECTION_BATCH_SIZE < candidates.length) {
        await sleep(BATCH_PAUSE_MS);
      }
    }

    await finishSeoHealthRun(runId, { status: "success", ...summary });
    return {
      ok: true,
      runId,
      siteUrl,
      canonicalSeeded: canonicalRows.length,
      gscSeeded,
      candidateCount: candidates.length,
      gscQuotaExhausted: inspectionContext.gscQuotaExhausted,
      ...summary,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    await finishSeoHealthRun(runId, { status: "failed", ...summary, errorMessage: message });
    throw error;
  }
}
