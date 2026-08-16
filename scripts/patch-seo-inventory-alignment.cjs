const fs = require("node:fs");
const path = require("node:path");

const root = process.cwd();
const enginePath = path.join(root, "lib", "seo-health", "engine.ts");
const sitemapPath = path.join(root, "app", "sitemap.ts");

function replaceRequired(source, before, after, label) {
  if (source.includes(after)) return { source, changed: false };
  if (!source.includes(before)) {
    throw new Error(`SEO inventory patch anchor not found: ${label}`);
  }
  return { source: source.replace(before, after), changed: true };
}

function patchEngine() {
  let source = fs.readFileSync(enginePath, "utf8");
  let changed = false;
  let result;

  result = replaceRequired(
    source,
    `import { getRouteByPath, routeMap } from "@/lib/url-map";\n`,
    `import { getRouteByPath, routeMap } from "@/lib/url-map";\nimport { kamposChiosPaths } from "@/content/kampos-chios";\n`,
    "engine Kambos import",
  );
  source = result.source;
  changed ||= result.changed;

  result = replaceRequired(
    source,
    `const NON_INDEXABLE_REDIRECT_ITEM_IDS = new Set(["find-your-room"]);\n`,
    `const NON_INDEXABLE_REDIRECT_ITEM_IDS = new Set(["find-your-room"]);\nconst EXTRA_CANONICAL_PATHS = new Set(\n  Object.values(kamposChiosPaths).map((pathname) => normalizeSeoPath(pathname)),\n);\n`,
    "extra canonical path registry",
  );
  source = result.source;
  changed ||= result.changed;

  const currentCanonicalBefore = `function isCurrentCanonicalUrl(value: string) {\n  const route = routeForUrl(value);\n  return Boolean(\n    route?.action === "KEEP" &&\n      !NON_INDEXABLE_REDIRECT_ITEM_IDS.has(route.itemId),\n  );\n}\n`;
  const currentCanonicalAfter = `function isCurrentCanonicalUrl(value: string) {\n  try {\n    const url = new URL(value);\n    if (sameSite(value) && EXTRA_CANONICAL_PATHS.has(normalizeSeoPath(url.pathname))) {\n      return true;\n    }\n  } catch {\n    return false;\n  }\n\n  const route = routeForUrl(value);\n  return Boolean(\n    route?.action === "KEEP" &&\n      !NON_INDEXABLE_REDIRECT_ITEM_IDS.has(route.itemId),\n  );\n}\n`;
  result = replaceRequired(source, currentCanonicalBefore, currentCanonicalAfter, "current canonical registry");
  source = result.source;
  changed ||= result.changed;

  const helperBefore = `function isTechnicalGonePath(pathname: string) {\n  const path = normalizeSeoPath(pathname);\n  if (path === "/feed" || path.endsWith("/feed")) return true;\n  return GONE_PREFIXES.some((prefix) => path === prefix || path.startsWith(\`${'${prefix}'}/\`));\n}\n`;
  const helperAfter = `function isTechnicalGonePath(pathname: string) {\n  const path = normalizeSeoPath(pathname);\n  if (path === "/feed" || path.endsWith("/feed")) return true;\n  return GONE_PREFIXES.some((prefix) => path === prefix || path.startsWith(\`${'${prefix}'}/\`));\n}\n\nfunction isTechnicalResourceUrl(value: string) {\n  try {\n    const pathname = new URL(value).pathname.toLowerCase();\n    return (\n      pathname.startsWith("/_next/") ||\n      pathname.startsWith("/favicon/") ||\n      pathname === "/robots.txt" ||\n      pathname === "/sitemap.xml" ||\n      /\\.(?:avif|css|gif|ico|jpe?g|js|json|map|png|svg|webmanifest|webp|woff2?|ttf|xml)$/.test(pathname)\n    );\n  } catch {\n    return false;\n  }\n}\n\nfunction isIntentionalLegalNoindexPath(pathname: string) {\n  const path = normalizeSeoPath(pathname);\n  return /^(?:\\/(?:el|fr|de|it|es|tr|pl))?\\/(?:privacy-policy|cookie-policy)$/.test(path);\n}\n`;
  result = replaceRequired(source, helperBefore, helperAfter, "technical/legal resource helpers");
  source = result.source;
  changed ||= result.changed;

  const decisionAnchor = `  if (expectedCanonical) {\n`;
  const decisionInsert = `  if (isTechnicalResourceUrl(candidate.url) && live.status >= 200 && live.status < 300) {\n    return {\n      category: "technical_resource",\n      severity: "healthy",\n      decision: "Static/infrastructure resource is live and is not an HTML SEO page.",\n      action: "No canonical-page remediation. Keep it out of the page inventory and URL Inspection budget.",\n      autoExecuted: false,\n    };\n  }\n\n  if (isIntentionalLegalNoindexPath(candidate.path)) {\n    if (live.noindex || indexingState === "BLOCKED_BY_META_TAG" || indexingState === "BLOCKED_BY_HTTP_HEADER") {\n      return {\n        category: "intentional_noindex",\n        severity: "healthy",\n        decision: "Legal policy page is intentionally excluded from search indexing.",\n        action: "No change. Keep follow enabled while preserving noindex.",\n        autoExecuted: false,\n      };\n    }\n\n    return {\n      category: "legal_page_indexable",\n      severity: "warning",\n      decision: "A legal policy page is indexable even though this policy family is intentionally noindex.",\n      action: "Add robots noindex,follow metadata consistently.",\n      autoExecuted: false,\n    };\n  }\n\n  if (expectedCanonical) {\n`;
  result = replaceRequired(source, decisionAnchor, decisionInsert, "technical/legal decision classification");
  source = result.source;
  changed ||= result.changed;

  const inspectBefore = `  if (context.gscQuotaExhausted) {\n    gscError = "URL Inspection skipped because Search Console quota was already exhausted earlier in this run.";\n  } else {\n`;
  const inspectAfter = `  if (isTechnicalResourceUrl(candidate.url)) {\n    gscError = "URL Inspection skipped for a non-HTML technical resource.";\n  } else if (context.gscQuotaExhausted) {\n    gscError = "URL Inspection skipped because Search Console quota was already exhausted earlier in this run.";\n  } else {\n`;
  result = replaceRequired(source, inspectBefore, inspectAfter, "technical resource inspection skip");
  source = result.source;
  changed ||= result.changed;

  const seedBefore = `\n  await bulkUpsertSeoUrls(canonicalRows);\n`;
  const seedAfter = `\n  canonicalRows.push(\n    ...Object.values(kamposChiosPaths).map((pathname) => ({\n      url: new URL(pathname, SITE_ORIGIN).toString(),\n      source: "canonical" as const,\n      expectedKind: "canonical" as const,\n      priority: 95,\n    })),\n  );\n\n  await bulkUpsertSeoUrls(canonicalRows);\n`;
  result = replaceRequired(source, seedBefore, seedAfter, "Kambos canonical seed");
  source = result.source;
  changed ||= result.changed;

  if (changed) fs.writeFileSync(enginePath, source, "utf8");
  return changed;
}

function patchSitemap() {
  let source = fs.readFileSync(sitemapPath, "utf8");
  let changed = false;
  let result;

  result = replaceRequired(
    source,
    `import { romanticStayPaths } from "@/content/romantic-stay";\n`,
    `import { romanticStayPaths } from "@/content/romantic-stay";\nimport { kamposChiosPaths } from "@/content/kampos-chios";\n`,
    "sitemap Kambos import",
  );
  source = result.source;
  changed ||= result.changed;

  const routesBefore = `  const polishRoutes: SitemapEntry[] = [\n`;
  const routesAfter = `  const kamposRoutes: SitemapEntry[] = Object.values(kamposChiosPaths).map(\n    (pathname) => ({\n      url: absoluteUrl(pathname),\n      changeFrequency: "monthly",\n      priority: 0.8,\n    }),\n  );\n\n  const polishRoutes: SitemapEntry[] = [\n`;
  result = replaceRequired(source, routesBefore, routesAfter, "Kambos sitemap entries");
  source = result.source;
  changed ||= result.changed;

  result = replaceRequired(
    source,
    `    ...romanticStayRoutes,\n    ...polishRoutes,\n`,
    `    ...romanticStayRoutes,\n    ...kamposRoutes,\n    ...polishRoutes,\n`,
    "Kambos sitemap output",
  );
  source = result.source;
  changed ||= result.changed;

  if (changed) fs.writeFileSync(sitemapPath, source, "utf8");
  return changed;
}

const engineChanged = patchEngine();
const sitemapChanged = patchSitemap();
console.log(\n  `SEO inventory alignment: engine=${engineChanged ? "patched" : "already"}, sitemap=${sitemapChanged ? "patched" : "already"}`,\n);