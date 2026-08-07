const { spawn } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const LOCAL = "http://127.0.0.1:3000";
const PROD = "https://chioshotel.gr";
const reportPath = path.join(process.cwd(), "artifacts/greek-pages-audit.json");
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const COPY_ISSUES = [
  "Room Wizard",
  "Family beds",
  "Scratch to reveal your discount",
  "Direct booking code",
  "Show my discount code",
  "Chios Insider",
  "beach day",
  "Value επιλογή",
  "Economy",
  " A/C",
  " Apt",
];

function attr(tag, name) {
  return tag.match(new RegExp(`\\s${name}=["']([^"']*)["']`, "i"))?.[1] || "";
}

function clean(value = "") {
  return value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

async function fetchRetry(url, { redirect = "follow", attempts = 20 } = {}) {
  let lastError;
  for (let i = 0; i < attempts; i += 1) {
    try {
      return await fetch(url, { redirect, signal: AbortSignal.timeout(10000) });
    } catch (error) {
      lastError = error;
      await delay(400);
    }
  }
  throw lastError;
}

function normalizePathname(value, base = PROD) {
  const url = new URL(value, base);
  return `${url.pathname}${url.search}`;
}

function parseGreekRedirects() {
  const source = fs.readFileSync(path.join(process.cwd(), "next.config.ts"), "utf8");
  const redirects = [];
  const pattern = /\{[\s\S]*?(?:source|"source")\s*:\s*["']([^"']+)["'][\s\S]*?(?:destination|"destination")\s*:\s*["']([^"']+)["'][\s\S]*?(?:permanent|"permanent")\s*:\s*true[\s\S]*?\}/g;
  for (const match of source.matchAll(pattern)) {
    if (match[1].startsWith("/el/")) redirects.push({ source: match[1], destination: match[2] });
  }
  return redirects;
}

function sameSiteLinks(html, publicUrl) {
  const output = [];
  for (const tag of html.match(/<a\b[^>]*>/gi) || []) {
    const href = attr(tag, "href");
    if (!href || href.startsWith("#") || /^(mailto:|tel:|sms:|javascript:)/i.test(href)) continue;
    let url;
    try { url = new URL(href, publicUrl); } catch { continue; }
    if (url.hostname !== "chioshotel.gr" && url.hostname !== "www.chioshotel.gr") continue;
    if (url.pathname.startsWith("/_next/") || url.pathname.startsWith("/api/")) continue;
    url.hash = "";
    output.push(url.toString());
  }
  return [...new Set(output)];
}

async function main() {
  const report = JSON.parse(fs.readFileSync(reportPath, "utf8"));
  const nextBin = require.resolve("next/dist/bin/next");
  const server = spawn(process.execPath, [nextBin, "start", "-H", "127.0.0.1", "-p", "3000"], {
    detached: true,
    env: { ...process.env, NODE_ENV: "production", NEXT_TELEMETRY_DISABLED: "1" },
    stdio: ["ignore", "pipe", "pipe"],
  });
  let serverOutput = "";
  server.stdout.on("data", (chunk) => { serverOutput += chunk; });
  server.stderr.on("data", (chunk) => { serverOutput += chunk; });

  const cache = new Map();
  async function request(publicUrl, redirect = "manual") {
    const key = `${redirect}:${publicUrl}`;
    if (cache.has(key)) return cache.get(key);
    const localUrl = `${LOCAL}${normalizePathname(publicUrl)}`;
    const response = await fetchRetry(localUrl, { redirect });
    const result = { status: response.status, location: response.headers.get("location") || "", html: await response.text() };
    cache.set(key, result);
    return result;
  }

  try {
    await fetchRetry(`${LOCAL}/el/`);

    for (const page of report.pages) {
      const rendered = await request(page.url, "follow");
      const visible = clean(rendered.html.replace(/<script\b[\s\S]*?<\/script>/gi, " ").replace(/<style\b[\s\S]*?<\/style>/gi, " "));
      for (const phrase of COPY_ISSUES) {
        if (visible.includes(phrase)) page.errors.push(`Mixed-language Greek copy: ${phrase.trim()}`);
      }
      if (visible.includes("8 χλμ. από την πόλη")) page.errors.push("Incorrect distance copy: 8 χλμ. από την πόλη");

      for (const linkedUrl of sameSiteLinks(rendered.html, page.url)) {
        const linked = await request(linkedUrl, "manual");
        if (linked.status >= 400) page.errors.push(`Broken internal link ${normalizePathname(linkedUrl)} returned ${linked.status}`);
        if ([301, 302, 307, 308].includes(linked.status)) {
          page.warnings.push(`Internal link uses redirect: ${normalizePathname(linkedUrl)} → ${linked.location}`);
        }
      }
      page.errors = [...new Set(page.errors)];
      page.warnings = [...new Set(page.warnings)];
    }

    report.privateRoutes = [];
    for (const route of ["/el/welcome/", "/el/pre-arrival/"]) {
      const rendered = await request(`${PROD}${route}`, "follow");
      const robots = [...rendered.html.matchAll(/<meta\b[^>]*>/gi)]
        .filter((match) => ["robots", "googlebot"].includes(attr(match[0], "name").toLowerCase()))
        .map((match) => attr(match[0], "content").toLowerCase())
        .join(" ");
      const errors = [];
      if (rendered.status !== 200) errors.push(`HTTP ${rendered.status}`);
      if (!robots.includes("noindex")) errors.push("Private route is not noindex");
      report.privateRoutes.push({ route, status: rendered.status, errors });
    }

    report.configRedirects = [];
    for (const redirect of parseGreekRedirects()) {
      const result = await request(`${PROD}${redirect.source}`, "manual");
      const errors = [];
      if (![301, 302, 307, 308].includes(result.status)) errors.push(`Expected redirect, received ${result.status}`);
      if (result.location && normalizePathname(result.location, LOCAL) !== normalizePathname(redirect.destination, LOCAL)) {
        errors.push(`Target mismatch: ${result.location}`);
      }
      report.configRedirects.push({ ...redirect, status: result.status, location: result.location, errors });
    }

    for (const privateRoute of report.privateRoutes) {
      if (privateRoute.errors.length) report.pages[0].errors.push(`Private route ${privateRoute.route}: ${privateRoute.errors.join(" | ")}`);
    }
    for (const redirect of report.configRedirects) {
      if (redirect.errors.length) report.pages[0].errors.push(`Redirect ${redirect.source}: ${redirect.errors.join(" | ")}`);
    }

    fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);
  } catch (error) {
    console.error(serverOutput);
    throw error;
  } finally {
    try { process.kill(-server.pid, "SIGTERM"); } catch {}
    await delay(600);
    try { process.kill(-server.pid, "SIGKILL"); } catch {}
  }
}

main().catch((error) => { console.error(error); process.exit(1); });
