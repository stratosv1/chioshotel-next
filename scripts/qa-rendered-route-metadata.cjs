const fs = require("node:fs");
const path = require("node:path");
const { spawn } = require("node:child_process");

const root = path.resolve(__dirname, "..");
const host = process.env.GCU_AUDIT_HOST || "127.0.0.1";
const port = Number(process.env.GCU_AUDIT_PORT || 3101);
const localOrigin = `http://${host}:${port}`;
const canonicalOrigin = "https://chioshotel.gr";
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

async function auditRoute(route) {
  const response = await fetch(`${localOrigin}${route.path}`, { redirect: "manual" });
  const html = await response.text();

  if (response.status !== 200) {
    return [{ path: route.path, type: "status", value: response.status }];
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

  return failures;
}

async function auditAllRoutes(routes) {
  const failures = [];
  let cursor = 0;

  async function worker() {
    while (cursor < routes.length) {
      const route = routes[cursor];
      cursor += 1;

      try {
        failures.push(...await auditRoute(route));
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
    const failures = await auditAllRoutes(routes);

    console.log("\nRENDERED ROUTE METADATA AUDIT");
    console.log("=============================");
    console.log(`  Routes checked: ${routes.length}`);
    console.log(`  Failures: ${failures.length}`);

    if (failures.length) {
      failures.forEach((failure) => console.error(`  ❌ ${JSON.stringify(failure)}`));
      process.exitCode = 1;
      return;
    }

    console.log("  ✅ Every indexable route returns 200 with its expected canonical and all seven hreflangs plus x-default.\n");
  } finally {
    server.kill("SIGTERM");
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.stack || error.message : error);
  process.exitCode = 1;
});
