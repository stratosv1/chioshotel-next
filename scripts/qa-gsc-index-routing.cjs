const fs = require("node:fs");
const path = require("node:path");

const root = process.cwd();
const failures = [];

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function assert(condition, message) {
  if (!condition) failures.push(message);
}

const vercelConfig = JSON.parse(read("vercel.json"));
const vercelRedirects = Array.isArray(vercelConfig.redirects)
  ? vercelConfig.redirects
  : [];

assert(
  vercelRedirects.length === 0,
  "vercel.json must not contain a second legacy redirect layer. Keep redirects in next.config.ts/proxy.ts so 404/410 responses are not overridden.",
);

const sitemapSource = read("app/sitemap.ts");
assert(
  !/const\s+now\s*=\s*new\s+Date\s*\(/.test(sitemapSource),
  "sitemap.ts must not mark every URL as modified at build time.",
);
assert(
  !/lastModified\s*:\s*now/.test(sitemapSource),
  "sitemap.ts contains an inaccurate shared lastModified value.",
);
assert(
  sitemapSource.includes("deduplicateByCanonicalUrl"),
  "sitemap.ts must deduplicate canonical URLs before returning entries.",
);

const proxySource = read("proxy.ts");
assert(
  proxySource.includes("status: 410"),
  "proxy.ts must retain the 410 response for retired WordPress and spam routes.",
);
assert(
  proxySource.includes("legacyRedirectTarget"),
  "proxy.ts must check relevant one-to-one legacy redirects before returning 410.",
);

const requiredGoneRoutes = [
  "app/elementor-landing-page-4251/[[...slug]]/route.ts",
  "app/language/[[...slug]]/route.ts",
  "app/topics/[[...slug]]/route.ts",
  "app/tag/[[...slug]]/route.ts",
  "app/wp-json/[[...slug]]/route.ts",
  "app/wp-includes/[[...slug]]/route.ts",
];

for (const relativePath of requiredGoneRoutes) {
  assert(
    fs.existsSync(path.join(root, relativePath)),
    `Missing retired-route handler: ${relativePath}`,
  );
}

if (process.argv[2]) {
  auditSearchConsoleExport(process.argv[2]);
}

if (failures.length > 0) {
  console.error("GSC routing audit failed:\n");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("GSC routing audit passed.");

function auditSearchConsoleExport(inputPath) {
  const absolutePath = path.resolve(inputPath);
  const lines = fs
    .readFileSync(absolutePath, "utf8")
    .replace(/^\uFEFF/, "")
    .split(/\r?\n/)
    .filter(Boolean);

  if (lines.length < 2 || !lines[0].startsWith("URL,")) {
    failures.push("The supplied GSC file must be the Table.csv export.");
    return;
  }

  const counts = new Map();
  const currentCandidates = [];

  for (const line of lines.slice(1)) {
    const comma = line.lastIndexOf(",");
    const rawUrl = comma === -1 ? line : line.slice(0, comma);
    const value = rawUrl.replace(/^"|"$/g, "").replace(/""/g, '"');

    let url;
    try {
      url = new URL(value);
    } catch {
      increment("invalid_url");
      continue;
    }

    const category = classify(url);
    increment(category);
    if (category === "current_candidate") currentCandidates.push(url.href);
  }

  console.log("\nGSC export classification:");
  for (const [name, count] of [...counts.entries()].sort((a, b) => b[1] - a[1])) {
    console.log(`${String(count).padStart(4)}  ${name}`);
  }

  if (currentCandidates.length > 0) {
    console.log("\nCurrent URLs requiring page-level review:");
    for (const url of currentCandidates) console.log(`- ${url}`);
  }

  function increment(name) {
    counts.set(name, (counts.get(name) || 0) + 1);
  }
}

function classify(url) {
  const pathname = decodeURIComponentSafe(url.pathname).toLowerCase();

  if (url.protocol !== "https:") return "non_https_variant";
  if (url.hostname !== "chioshotel.gr") return "old_subdomain";
  if (/^\/(elementor-landing-page-4251|wp-admin|wp-json|wp-includes|wp-content|wp-sitemap\.xml)/.test(pathname)) {
    return "wordpress_or_spam";
  }
  if (pathname.endsWith("/feed/") || pathname === "/feed/") return "wordpress_feed";
  if (/^\/(language|topics|tag|comments)(\/|$)/.test(pathname)) return "legacy_archive";
  if (/^\/(el|fr|de|it|es|tr)\/(topics|tag|comments)(\/|$)/.test(pathname)) {
    return "legacy_archive";
  }
  if (/\.(ico|webmanifest|xml|txt|js|css)$/i.test(pathname)) return "technical_asset";
  if (/\/(uncategorized-[a-z]{2}|chios-el|chios-it)(\/|$)/.test(pathname)) {
    return "legacy_content";
  }
  return "current_candidate";
}

function decodeURIComponentSafe(value) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}
