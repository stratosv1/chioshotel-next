const { spawn } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const LOCAL = "http://127.0.0.1:3000";
const PROD = "https://chioshotel.gr";
const OUT_DIR = path.join(process.cwd(), "artifacts");
const ENGLISH_LEAKS = [
  "Room Wizard",
  "Family beds",
  "Scratch to reveal your discount",
  "Direct booking code",
  "Show my discount code",
  "All rooms",
  "Book now",
  "Contact us",
];

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const clean = (value = "") => value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
const normalize = (value, base = PROD) => {
  const url = new URL(value, base);
  url.hash = "";
  return url.toString();
};

function attr(tag, name) {
  return tag.match(new RegExp(`\\s${name}=["']([^"']*)["']`, "i"))?.[1] || "";
}

function meta(html, selector) {
  for (const tag of html.match(/<meta\b[^>]*>/gi) || []) {
    if (attr(tag, "name") === selector || attr(tag, "property") === selector) return attr(tag, "content");
  }
  return "";
}

function link(html, rel, hreflang = "") {
  for (const tag of html.match(/<link\b[^>]*>/gi) || []) {
    if (!attr(tag, "rel").toLowerCase().split(/\s+/).includes(rel.toLowerCase())) continue;
    if (hreflang && attr(tag, "hreflang").toLowerCase() !== hreflang.toLowerCase()) continue;
    return attr(tag, "href");
  }
  return "";
}

async function fetchRetry(url, { redirect = "follow", attempts = 30 } = {}) {
  let lastError;
  for (let i = 0; i < attempts; i += 1) {
    try {
      return await fetch(url, { redirect, signal: AbortSignal.timeout(10000) });
    } catch (error) {
      lastError = error;
      await delay(500);
    }
  }
  throw lastError;
}

function routeRecords() {
  const source = fs.readFileSync(path.join(process.cwd(), "lib/url-map.ts"), "utf8");
  return [...source.matchAll(/\{([\s\S]*?)\n\s*\},/g)].flatMap((match) => {
    const block = match[1];
    const pagePath = block.match(/path:\s*["']([^"']+)["']/)?.[1];
    const language = block.match(/language:\s*["']([^"']+)["']/)?.[1];
    const action = block.match(/action:\s*["']([^"']+)["']/)?.[1];
    const canonicalPath = block.match(/canonicalPath:\s*["']([^"']+)["']/)?.[1] || "";
    return pagePath && language && action ? [{ path: pagePath, language, action, canonicalPath }] : [];
  });
}

async function sitemapUrls() {
  const response = await fetchRetry(`${LOCAL}/sitemap.xml`);
  if (!response.ok) throw new Error(`sitemap.xml returned ${response.status}`);
  const xml = await response.text();
  return [...new Set([...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map((match) => match[1].trim())
    .filter((url) => new URL(url).pathname.startsWith("/el/")))].sort();
}

function jsonLd(html) {
  const documents = [];
  const errors = [];
  for (const match of html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    try { documents.push(JSON.parse(match[1])); }
    catch (error) { errors.push(error.message); }
  }
  return { documents, errors };
}

function nodes(documents) {
  return documents.flatMap((document) => Array.isArray(document?.["@graph"]) ? document["@graph"] : [document]);
}

async function auditPage(publicUrl) {
  const pathname = new URL(publicUrl).pathname;
  const localUrl = `${LOCAL}${pathname}`;
  const expected = normalize(publicUrl);
  const response = await fetchRetry(localUrl);
  const html = await response.text();
  const result = {
    url: publicUrl, status: response.status, title: "", description: "", canonical: "",
    h1: [], errors: [], warnings: [],
  };

  if (!response.ok) result.errors.push(`HTTP ${response.status}`);
  const htmlTag = html.match(/<html\b[^>]*>/i)?.[0] || "";
  if (attr(htmlTag, "lang").toLowerCase() !== "el") result.errors.push(`html lang is ${attr(htmlTag, "lang") || "missing"}`);

  result.title = clean(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || "");
  result.description = meta(html, "description").trim();
  result.canonical = link(html, "canonical").trim();
  const robots = `${meta(html, "robots")} ${meta(html, "googlebot")}`.toLowerCase();
  const ogUrl = meta(html, "og:url").trim();
  const ogLocale = meta(html, "og:locale").trim();

  if (!result.title) result.errors.push("Missing title");
  else if (result.title.length > 65) result.warnings.push(`Title length ${result.title.length}`);
  if (!result.description) result.errors.push("Missing meta description");
  else if (result.description.length < 90 || result.description.length > 170) result.warnings.push(`Description length ${result.description.length}`);
  if (!result.canonical) result.errors.push("Missing canonical");
  else if (normalize(result.canonical) !== expected) result.errors.push(`Canonical mismatch: ${result.canonical}`);
  if (robots.includes("noindex")) result.errors.push("Sitemap page contains noindex");
  if (!ogUrl) result.warnings.push("Missing og:url");
  else if (normalize(ogUrl) !== expected) result.errors.push(`og:url mismatch: ${ogUrl}`);
  if (ogLocale && ogLocale !== "el_GR") result.errors.push(`og:locale is ${ogLocale}`);

  const selfAlternate = link(html, "alternate", "el");
  const defaultAlternate = link(html, "alternate", "x-default");
  if (!selfAlternate) result.errors.push("Missing self hreflang el");
  else if (normalize(selfAlternate) !== expected) result.errors.push(`Self hreflang mismatch: ${selfAlternate}`);
  if (!defaultAlternate) result.errors.push("Missing x-default hreflang");

  result.h1 = [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)].map((match) => clean(match[1]));
  if (result.h1.length !== 1) result.errors.push(`H1 count ${result.h1.length}`);

  const visible = clean(html.replace(/<script\b[\s\S]*?<\/script>/gi, " ").replace(/<style\b[\s\S]*?<\/style>/gi, " "));
  for (const phrase of ENGLISH_LEAKS) if (visible.includes(phrase)) result.errors.push(`English UI leakage: ${phrase}`);

  const structured = jsonLd(html);
  if (structured.errors.length) result.errors.push(`Invalid JSON-LD: ${structured.errors.join(" | ")}`);
  if (!structured.documents.length) result.warnings.push("No JSON-LD");
  for (const node of nodes(structured.documents)) {
    if (node && typeof node === "object" && node.inLanguage && !["el", "el-GR"].includes(node.inLanguage)) {
      result.errors.push(`JSON-LD inLanguage is ${node.inLanguage}`);
      break;
    }
  }

  const images = html.match(/<img\b[^>]*>/gi) || [];
  const noAlt = images.filter((tag) => !/\salt=["'][^"']*["']/i.test(tag)).length;
  const emptyAlt = images.filter((tag) => /\salt=["']\s*["']/i.test(tag)).length;
  if (noAlt) result.errors.push(`${noAlt} images missing alt attribute`);
  if (emptyAlt) result.warnings.push(`${emptyAlt} images with empty alt`);

  for (const tag of html.match(/<a\b[^>]*>/gi) || []) {
    const href = attr(tag, "href");
    if (!href) continue;
    const linked = new URL(href, publicUrl);
    if (linked.pathname.startsWith("/el/chios-el/")) result.errors.push(`Legacy internal link: ${linked.pathname}`);
  }
  result.errors = [...new Set(result.errors)];
  result.warnings = [...new Set(result.warnings)];
  return result;
}

async function auditLegacy(records) {
  const output = [];
  for (const record of records.filter((item) => item.language === "el" && ["REDIRECT", "MERGE", "REMOVE"].includes(item.action))) {
    const response = await fetchRetry(`${LOCAL}${record.path}`, { redirect: "manual", attempts: 3 });
    const location = response.headers.get("location") || "";
    const errors = [];
    if (![301, 302, 307, 308, 404, 410].includes(response.status)) errors.push(`Unexpected HTTP ${response.status}`);
    if ([301, 302, 307, 308].includes(response.status) && !location) errors.push("Missing Location header");
    if (record.canonicalPath && location && normalize(location, PROD) !== normalize(record.canonicalPath, PROD)) {
      errors.push(`Redirect target mismatch: ${location}`);
    }
    output.push({ ...record, status: response.status, location, errors });
  }
  return output;
}

function duplicates(pages, field) {
  const map = new Map();
  for (const page of pages) {
    const value = page[field]?.trim();
    if (!value) continue;
    map.set(value, [...(map.get(value) || []), page.url]);
  }
  return [...map.entries()].filter(([, urls]) => urls.length > 1).map(([value, urls]) => ({ value, urls }));
}

function markdown(report) {
  const lines = [
    "# Greek pages SEO audit", "",
    `Generated: ${report.generatedAt}`,
    `Greek sitemap pages: ${report.summary.pages}`,
    `Pages with errors: ${report.summary.pagesWithErrors}`,
    `Pages with warnings: ${report.summary.pagesWithWarnings}`,
    `Errors: ${report.summary.errors}`,
    `Warnings: ${report.summary.warnings}`, "",
  ];
  if (report.keepMissingFromSitemap.length) {
    lines.push("## KEEP routes missing from sitemap", "", ...report.keepMissingFromSitemap.map((url) => `- ${url}`), "");
  }
  lines.push("## Pages requiring attention", "");
  for (const page of report.pages.filter((item) => item.errors.length || item.warnings.length)) {
    lines.push(`### ${page.url}`);
    for (const error of page.errors) lines.push(`- ERROR: ${error}`);
    for (const warning of page.warnings) lines.push(`- WARNING: ${warning}`);
    lines.push("");
  }
  if (report.duplicateTitles.length) lines.push("## Duplicate titles", "", ...report.duplicateTitles.map((item) => `- ${item.value}: ${item.urls.join(", ")}`), "");
  if (report.duplicateDescriptions.length) lines.push("## Duplicate descriptions", "", ...report.duplicateDescriptions.map((item) => `- ${item.value}: ${item.urls.join(", ")}`), "");
  if (report.legacyRoutes.some((item) => item.errors.length)) lines.push("## Legacy route errors", "", ...report.legacyRoutes.filter((item) => item.errors.length).map((item) => `- ${item.path}: ${item.errors.join(" | ")}`));
  return `${lines.join("\n")}\n`;
}

function stop(server, signal) {
  try { process.kill(-server.pid, signal); } catch {}
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const records = routeRecords();
  const nextBin = require.resolve("next/dist/bin/next");
  const server = spawn(process.execPath, [nextBin, "start", "-H", "127.0.0.1", "-p", "3000"], {
    detached: true,
    env: { ...process.env, NODE_ENV: "production", NEXT_TELEMETRY_DISABLED: "1" },
    stdio: ["ignore", "pipe", "pipe"],
  });
  let serverOutput = "";
  server.stdout.on("data", (chunk) => { serverOutput += chunk; });
  server.stderr.on("data", (chunk) => { serverOutput += chunk; });
  try {
    await fetchRetry(`${LOCAL}/el/`);
    const urls = await sitemapUrls();
    const pages = [];
    for (const url of urls) {
      console.log(`Auditing ${url}`);
      pages.push(await auditPage(url));
    }
    const sitemapSet = new Set(urls.map((url) => normalize(url)));
    const keepMissingFromSitemap = records
      .filter((item) => item.language === "el" && item.action === "KEEP")
      .map((item) => normalize(item.path, PROD))
      .filter((url) => !sitemapSet.has(url));
    const legacyRoutes = await auditLegacy(records);
    const duplicateTitles = duplicates(pages, "title");
    const duplicateDescriptions = duplicates(pages, "description");
    for (const duplicate of duplicateTitles) for (const url of duplicate.urls) pages.find((page) => page.url === url)?.errors.push("Duplicate title");
    for (const duplicate of duplicateDescriptions) for (const url of duplicate.urls) pages.find((page) => page.url === url)?.warnings.push("Duplicate description");
    const report = {
      generatedAt: new Date().toISOString(), pages, legacyRoutes, keepMissingFromSitemap,
      duplicateTitles, duplicateDescriptions,
      summary: {
        pages: pages.length,
        pagesWithErrors: pages.filter((page) => page.errors.length).length,
        pagesWithWarnings: pages.filter((page) => page.warnings.length).length,
        errors: pages.reduce((sum, page) => sum + page.errors.length, 0) + legacyRoutes.reduce((sum, item) => sum + item.errors.length, 0) + keepMissingFromSitemap.length,
        warnings: pages.reduce((sum, page) => sum + page.warnings.length, 0),
      },
    };
    fs.writeFileSync(path.join(OUT_DIR, "greek-pages-audit.json"), `${JSON.stringify(report, null, 2)}\n`);
    fs.writeFileSync(path.join(OUT_DIR, "greek-pages-audit.md"), markdown(report));
    console.log(markdown(report));
    if (report.summary.errors) process.exitCode = 1;
  } catch (error) {
    console.error(serverOutput);
    throw error;
  } finally {
    stop(server, "SIGTERM");
    await delay(750);
    stop(server, "SIGKILL");
  }
}

main().catch((error) => { console.error(error); process.exit(1); });
