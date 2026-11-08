#!/usr/bin/env node
// Content freshness: records when each public page's *editorial* content
// last changed, so the sitemap <lastmod>, the JSON-LD dateModified and the
// IndexNow submissions only move when the text people read really changes.
//
// How it works
//  1. Reads every URL from the live sitemap.
//  2. Fetches each page and builds a fingerprint of the visible text inside
//     <main>, leaving out scripts, styles, SVG, anything marked
//     data-freshness="ignore" (live sea conditions) and all digits (prices,
//     temperatures, dates), so live data never counts as an edit.
//  3. Compares with data/content-freshness.json. A new or changed page gets
//     today's date; an unchanged page keeps its stored date.
//  4. Writes the manifest and, with --changed-out, the list of changed URLs.
//
// Usage
//   node scripts/content-freshness.mjs                  # update manifest
//   node scripts/content-freshness.mjs --dry            # report only
//   node scripts/content-freshness.mjs --changed-out=changed.txt
//   node scripts/content-freshness.mjs --fingerprint-file=page.html
//
// The manifest is updated by .github/workflows/content-freshness.yml after
// each production deployment. Nothing here runs during `next build`.

import { createHash } from "node:crypto";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const MANIFEST_PATH = join(ROOT, "data", "content-freshness.json");
const SITE = process.env.FRESHNESS_SITE || "https://chioshotel.gr";
const CONCURRENCY = 4;
const TIMEOUT_MS = 30_000;
const USER_AGENT = "chioshotel-content-freshness/1.0 (+https://chioshotel.gr)";

const args = Object.fromEntries(
  process.argv.slice(2).map((arg) => {
    const [key, ...rest] = arg.replace(/^--/, "").split("=");
    return [key, rest.length ? rest.join("=") : true];
  }),
);

// ---------------------------------------------------------------------------
// Fingerprinting

const DROP_BLOCKS = ["script", "style", "noscript", "svg", "template", "iframe"];

function removeBlocks(html, tag) {
  return html.replace(new RegExp(`<${tag}\\b[\\s\\S]*?</${tag}>`, "gi"), " ");
}

// Removes every element whose start tag carries data-freshness="ignore",
// including its children, by matching nested tags of the same name.
function removeIgnored(html) {
  const marker = /data-freshness=["']ignore["']/i;
  let out = html;
  for (let guard = 0; guard < 500; guard += 1) {
    const match = marker.exec(out);
    if (!match) break;
    const start = out.lastIndexOf("<", match.index);
    const nameMatch = /^<([a-zA-Z][a-zA-Z0-9-]*)/.exec(out.slice(start));
    if (start === -1 || !nameMatch) break;
    const name = nameMatch[1].toLowerCase();
    const startTagEnd = out.indexOf(">", match.index);
    if (out[startTagEnd - 1] === "/") {
      out = out.slice(0, start) + " " + out.slice(startTagEnd + 1);
      continue;
    }
    const tagRe = new RegExp(`<(/?)${name}\\b[^>]*?(/?)>`, "gi");
    tagRe.lastIndex = startTagEnd + 1;
    let depth = 1;
    let end = out.length;
    let tag;
    while ((tag = tagRe.exec(out))) {
      if (tag[1] === "/") depth -= 1;
      else if (tag[2] !== "/") depth += 1;
      if (depth === 0) {
        end = tagRe.lastIndex;
        break;
      }
    }
    out = out.slice(0, start) + " " + out.slice(end);
  }
  return out;
}

const ENTITIES = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", "#39": "'" };

export function fingerprintText(html) {
  const mainStart = html.search(/<main\b/i);
  const mainEnd = html.toLowerCase().lastIndexOf("</main>");
  let region = mainStart !== -1 && mainEnd > mainStart ? html.slice(mainStart, mainEnd) : html;
  for (const tag of DROP_BLOCKS) region = removeBlocks(region, tag);
  region = region.replace(/<!--[\s\S]*?-->/g, " ");
  region = removeIgnored(region);
  return region
    .replace(/<[^>]+>/g, " ")
    .replace(/&(#?\w+);/g, (all, name) => ENTITIES[name] ?? " ")
    .replace(/[0-9€$£%]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function fingerprint(html) {
  return createHash("sha256").update(fingerprintText(html)).digest("hex").slice(0, 20);
}

// ---------------------------------------------------------------------------
// Fetching

async function fetchText(url, redirect = "manual") {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const response = await fetch(url, {
      headers: { "User-Agent": USER_AGENT, Accept: "text/html,application/xml" },
      redirect,
      signal: controller.signal,
    });
    return { status: response.status, text: response.status === 200 ? await response.text() : "" };
  } finally {
    clearTimeout(timer);
  }
}

function pathOf(url) {
  const parsed = new URL(url);
  return parsed.pathname.endsWith("/") ? parsed.pathname : `${parsed.pathname}/`;
}

async function sitemapPaths() {
  const { status, text } = await fetchText(`${SITE}/sitemap.xml`, "follow");
  if (status !== 200) throw new Error(`sitemap.xml returned HTTP ${status}`);
  const urls = [...text.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((m) => m[1]);
  const paths = new Set();
  for (const url of urls) {
    try {
      const parsed = new URL(url);
      if (parsed.hostname.replace(/^www\./, "") !== new URL(SITE).hostname) continue;
      if (/\.(xml|jpg|jpeg|png|webp|pdf)$/i.test(parsed.pathname)) continue;
      paths.add(pathOf(url));
    } catch {
      // ignore malformed entries
    }
  }
  return [...paths].sort();
}

async function mapLimit(items, limit, worker) {
  const results = new Array(items.length);
  let next = 0;
  async function run() {
    while (next < items.length) {
      const index = next;
      next += 1;
      results[index] = await worker(items[index]);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, run));
  return results;
}

// ---------------------------------------------------------------------------

function readManifest() {
  if (!existsSync(MANIFEST_PATH)) return { pages: {} };
  return JSON.parse(readFileSync(MANIFEST_PATH, "utf8"));
}

function sortedPages(pages) {
  return Object.fromEntries(Object.keys(pages).sort().map((key) => [key, pages[key]]));
}

async function main() {
  if (args["fingerprint-file"]) {
    const html = readFileSync(String(args["fingerprint-file"]), "utf8");
    console.log(fingerprint(html));
    if (args.text) console.log(fingerprintText(html));
    return;
  }

  const today = new Date().toISOString().slice(0, 10);
  const manifest = readManifest();
  const previous = manifest.pages || {};
  const paths = await sitemapPaths();
  console.log(`Sitemap: ${paths.length} pages`);

  const results = await mapLimit(paths, CONCURRENCY, async (path) => {
    try {
      const { status, text } = await fetchText(`${SITE}${path}`);
      if (status !== 200) return { path, error: `HTTP ${status}` };
      return { path, hash: fingerprint(text) };
    } catch (error) {
      return { path, error: error.name === "AbortError" ? "timeout" : String(error.message || error) };
    }
  });

  const pages = {};
  const changed = [];
  const failed = [];
  for (const result of results) {
    const before = previous[result.path];
    if (result.error) {
      failed.push(`${result.path} (${result.error})`);
      if (before) pages[result.path] = before; // keep what we knew
      continue;
    }
    if (before && before.hash === result.hash) {
      pages[result.path] = before;
    } else {
      pages[result.path] = { hash: result.hash, modified: today };
      changed.push(result.path);
    }
  }

  // Pages that left the sitemap are dropped from the manifest.
  const removed = Object.keys(previous).filter((path) => !(path in pages));

  console.log(`Changed or new: ${changed.length}`);
  for (const path of changed.slice(0, 50)) console.log(`  ~ ${path}`);
  if (changed.length > 50) console.log(`  … ${changed.length - 50} more`);
  if (removed.length) console.log(`Removed: ${removed.length}`);
  if (failed.length) {
    console.log(`Not fetched (kept previous date): ${failed.length}`);
    for (const line of failed.slice(0, 20)) console.log(`  ! ${line}`);
  }

  // Refuse to rewrite the manifest from a mostly failed run.
  if (failed.length > paths.length * 0.2) {
    console.error("Too many pages could not be fetched; manifest left unchanged.");
    process.exitCode = 1;
    return;
  }

  if (args["changed-out"]) {
    // The very first run only records a baseline; nothing is announced.
    const baseline = Object.keys(previous).length === 0;
    if (baseline) console.log("Baseline run: no URLs will be announced.");
    const list = baseline ? [] : changed.map((path) => `${SITE}${path}`);
    writeFileSync(String(args["changed-out"]), list.join("\n"));
  }

  if (args.dry) return;
  if (!changed.length && !removed.length) {
    console.log("Manifest already up to date.");
    return;
  }

  const next = {
    _note:
      "Generated by scripts/content-freshness.mjs after each production deploy. 'modified' is the day the page's visible text last changed. Do not edit by hand.",
    site: SITE,
    pages: sortedPages(pages),
  };
  writeFileSync(MANIFEST_PATH, `${JSON.stringify(next, null, 2)}\n`);
  console.log(`Manifest written: ${Object.keys(pages).length} pages`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
