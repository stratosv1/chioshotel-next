const fs = require("node:fs");
const path = require("node:path");
const { spawn } = require("node:child_process");

const root = path.resolve(__dirname, "..");
const host = process.env.GCU_AUDIT_HOST || "127.0.0.1";
const port = Number(process.env.GCU_AUDIT_PORT || 3101);
const localOrigin = `http://${host}:${port}`;
const canonicalOrigin = "https://chioshotel.gr";
const activeLanguages = ["en", "el", "fr", "de", "it", "es", "tr"];
const requiredHreflangs = ["en", "el", "fr", "de", "it", "es", "tr", "x-default"];

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function routeRecords() {
  const source = read("lib/url-map.ts");

  return [...source.matchAll(/\n  \{\n    path: "([^"]+)",[\s\S]*?\n  \},/g)]
    .map((match) => {
      const block = match[0];
      return {
        path: block.match(/path: "([^"]+)"/)?.[1],
        language: block.match(/language: "([^"]+)"/)?.[1],
        action: block.match(/action: "([^"]+)"/)?.[1],
        canonicalPath: block.match(/canonicalPath: "([^"]+)"/)?.[1],
      };
    })
    .filter((route) => route.path && route.action === "KEEP");
}

async function waitForServer(logs) {
  for (let attempt = 0; attempt < 50; attempt += 1) {
    try {
      const response = await fetch(`${localOrigin}/`, { redirect: "manual" });
      if (response.status > 0) return;
    } catch {
      // The server normally needs a few hundred milliseconds to become ready.
    }

    await new Promise((resolve) => setTimeout(resolve, 200));
  }

  throw new Error(`Next.js server did not become ready.\n${logs.join("").slice(-8000)}`);
}

function readAttribute(tag, attribute) {
  return tag.match(new RegExp(`${attribute}="([^"]+)"`, "i"))?.[1] || "";
}

function internalLinkPath(href) {
  if (!href || href.startsWith("#") || /^(mailto:|tel:|sms:|javascript:|data:)/i.test(href)) {
    return "";
  }

  try {
    const url = new URL(href, canonicalOrigin);
    if (url.origin !== canonicalOrigin) return "";
    return `${url.pathname}${url.search}`;
  } catch {
    return "";
  }
}

function pathLanguage(pathname) {
  const segment = pathname.split("/").filter(Boolean)[0];
  return activeLanguages.includes(segment) && segment !== "en" ? segment : "en";
}

function isLanguageNeutralPath(pathname) {
  return (
    pathname === "/trip-planner/" ||
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/api/") ||
    pathname.startsWith("/staff/") ||
    pathname.startsWith("/mixalis/") ||
    /\.[a-z0-9]{2,8}$/i.test(pathname)
  );
}

function auditInternalAnchors(route, html) {
  const failures = [];
  const destinations = [];
  const anchorTags = [...html.matchAll(/<a\b[^>]*>/gi)].map((match) => match[0]);

  for (const tag of anchorTags) {
    const href = readAttribute(tag, "href");
    const destination = internalLinkPath(href);
    if (!destination) continue;

    const pathname = destination.split("?")[0];
    destinations.push(destination);

    // Language selectors intentionally cross locale boundaries and identify
    // themselves with hreflang. All other content links should stay localized.
    if (readAttribute(tag, "hreflang") || isLanguageNeutralPath(pathname)) continue;

    const destinationLanguage = pathLanguage(pathname);
    if (destinationLanguage !== route.language) {
      failures.push({
        path: route.path,
        type: "localized-link",
        expectedLanguage: route.language,
        href,
      });
    }
  }

  return { failures, destinations };
}

async function auditRoute(route) {
  const response = await fetch(`${localOrigin}${route.path}`, { redirect: "manual" });
  const html = await response.text();

  if (response.status !== 200) {
    return {
      failures: [{ path: route.path, type: "status", value: response.status }],
      destinations: [],
    };
  }

  const failures = [];
  const canonicalTag = html.match(/<link[^>]+rel="canonical"[^>]*>/i)?.[0] || "";
  const canonical = readAttribute(canonicalTag, "href");
  const expectedCanonical = `${canonicalOrigin}${route.canonicalPath || route.path}`;

  if (canonical !== expectedCanonical) {
    failures.push({
      path: route.path,
      type: "canonical",
      expected: expectedCanonical,
      value: canonical,
    });
  }

  const alternateTags = [...html.matchAll(/<link[^>]+rel="alternate"[^>]*>/gi)]
    .map((match) => match[0]);
  const hreflangs = new Set(
    alternateTags.map((tag) => readAttribute(tag, "hreflang")).filter(Boolean),
  );
  const missingHreflangs = requiredHreflangs.filter((code) => !hreflangs.has(code));

  if (missingHreflangs.length) {
    failures.push({
      path: route.path,
      type: "hreflang",
      missing: missingHreflangs,
      found: [...hreflangs],
    });
  }

  const anchorAudit = auditInternalAnchors(route, html);
  failures.push(...anchorAudit.failures);

  return { failures, destinations: anchorAudit.destinations };
}

async function auditAllRoutes(routes) {
  const failures = [];
  const destinations = new Set();
  let cursor = 0;

  async function worker() {
    while (cursor < routes.length) {
      const route = routes[cursor];
      cursor += 1;

      try {
        const result = await auditRoute(route);
        failures.push(...result.failures);
        result.destinations.forEach((destination) => destinations.add(destination));
      } catch (error) {
        failures.push({
          path: route.path,
          type: "fetch",
          value: error instanceof Error ? error.message : String(error),
        });
      }
    }
  }

  await Promise.all(Array.from({ length: 12 }, () => worker()));
  return { failures, destinations };
}

async function auditInternalDestinations(destinations) {
  const failures = [];
  const paths = [...destinations];
  let cursor = 0;

  async function worker() {
    while (cursor < paths.length) {
      const destination = paths[cursor];
      cursor += 1;

      try {
        const response = await fetch(`${localOrigin}${destination}`, { redirect: "manual" });
        if (response.status >= 300 && response.status < 400) {
          failures.push({
            path: destination,
            type: "internal-link-redirect",
            value: response.headers.get("location") || response.status,
          });
        } else if (response.status >= 400) {
          failures.push({ path: destination, type: "broken-internal-link", value: response.status });
        }
      } catch (error) {
        failures.push({
          path: destination,
          type: "internal-link-fetch",
          value: error instanceof Error ? error.message : String(error),
        });
      }
    }
  }

  await Promise.all(Array.from({ length: 12 }, () => worker()));
  return failures;
}

async function main() {
  const routes = routeRecords();
  const logs = [];
  const nextBin = require.resolve("next/dist/bin/next");
  const server = spawn(
    process.execPath,
    [nextBin, "start", "--hostname", host, "--port", String(port)],
    { cwd: root, env: process.env, stdio: ["ignore", "pipe", "pipe"] },
  );

  server.stdout.on("data", (chunk) => logs.push(chunk.toString()));
  server.stderr.on("data", (chunk) => logs.push(chunk.toString()));

  try {
    await waitForServer(logs);
    const routeAudit = await auditAllRoutes(routes);
    const destinationFailures = await auditInternalDestinations(routeAudit.destinations);
    const failures = [...routeAudit.failures, ...destinationFailures];

    console.log("\nRENDERED ROUTE METADATA AUDIT");
    console.log("=============================");
    console.log(`  Routes checked: ${routes.length}`);
    console.log(`  Unique internal destinations checked: ${routeAudit.destinations.size}`);
    console.log(`  Failures: ${failures.length}`);

    if (failures.length) {
      failures.forEach((failure) => console.error(`  ❌ ${JSON.stringify(failure)}`));
      process.exitCode = 1;
      return;
    }

    console.log("  ✅ Every indexable route returns 200 with its expected canonical and all seven hreflangs plus x-default.");
    console.log("  ✅ Rendered content links stay in-language and point directly to healthy destinations.\n");
  } finally {
    server.kill("SIGTERM");
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.stack || error.message : error);
  process.exitCode = 1;
});
