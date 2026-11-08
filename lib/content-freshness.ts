// Day each public page's visible text last changed, recorded by
// scripts/content-freshness.mjs (run by .github/workflows/content-freshness.yml
// after every production deploy). Used for sitemap <lastmod>, JSON-LD
// dateModified and IndexNow, so all three only move on real edits — never
// because live data (sea conditions, prices) changed.

import manifest from "@/data/content-freshness.json";

type FreshnessEntry = { hash: string; modified: string };

const pages = (manifest as { pages?: Record<string, FreshnessEntry> }).pages ?? {};

function toPath(pathOrUrl: string): string | null {
  try {
    const url = new URL(pathOrUrl, "https://chioshotel.gr");
    if (url.hostname.replace(/^www\./, "") !== "chioshotel.gr") return null;
    return url.pathname.endsWith("/") ? url.pathname : `${url.pathname}/`;
  } catch {
    return null;
  }
}

/** ISO date (YYYY-MM-DD) the page's content last changed, if recorded. */
export function getContentLastModified(pathOrUrl: string): string | undefined {
  const path = toPath(pathOrUrl);
  return path ? pages[path]?.modified : undefined;
}

// Schema types that describe the page itself and accept dateModified.
const PAGE_TYPES = new Set([
  "WebPage",
  "CollectionPage",
  "AboutPage",
  "ContactPage",
  "FAQPage",
  "ItemPage",
  "QAPage",
  "Article",
  "BlogPosting",
  "TravelGuide",
]);

function isPageNode(node: Record<string, unknown>) {
  const type = node["@type"];
  const types = Array.isArray(type) ? type : [type];
  return types.some((value) => typeof value === "string" && PAGE_TYPES.has(value));
}

function withDate(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(withDate);
  if (!value || typeof value !== "object") return value;

  const node = value as Record<string, unknown>;
  const copy: Record<string, unknown> = {};
  for (const [key, child] of Object.entries(node)) {
    copy[key] = key === "@graph" || Array.isArray(child) ? withDate(child) : child;
  }

  if (isPageNode(node) && !node.dateModified) {
    const ref =
      (typeof node.url === "string" && node.url) ||
      (typeof node["@id"] === "string" && (node["@id"] as string).split("#")[0]) ||
      "";
    const modified = ref ? getContentLastModified(ref) : undefined;
    if (modified) copy.dateModified = modified;
  }

  return copy;
}

/** Adds dateModified to the page node(s) of a JSON-LD payload. */
export function addContentDates(data: unknown): unknown {
  return withDate(data);
}
