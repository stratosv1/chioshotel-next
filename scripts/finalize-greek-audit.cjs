const { spawn } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const LOCAL = "http://127.0.0.1:3000";
const PROD = "https://chioshotel.gr";
const reportPath = path.join(process.cwd(), "artifacts/greek-pages-audit.json");
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const FORBIDDEN_GREEK_COPY = [
  "Room Wizard",
  "Value for money",
  "Family beds",
  "🏡 Apt",
  "❄️ A/C",
  "Chios Insider",
  "beach day",
  "Beach Day",
  "beach lover",
  "beach service",
  "mini quest",
  "πολυσύχναστο resort",
  "το budget",
  "direct booking πλεονεκτήματα",
  "online κράτηση",
  "Economy Double",
];

function clean(value = "") {
  return value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function normalizePathname(value, base = PROD) {
  const pathname = new URL(value, base).pathname;
  if (pathname === "/") return pathname;
  return pathname.endsWith("/") ? pathname : `${pathname}/`;
}

async function fetchRetry(url, attempts = 25) {
  let lastError;
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      return await fetch(url, {
        redirect: "follow",
        signal: AbortSignal.timeout(10000),
      });
    } catch (error) {
      lastError = error;
      await delay(400);
    }
  }
  throw lastError;
}

function stop(server, signal) {
  try { process.kill(-server.pid, signal); } catch {}
}

async function main() {
  const report = JSON.parse(fs.readFileSync(reportPath, "utf8"));
  const nextBin = require.resolve("next/dist/bin/next");
  const server = spawn(process.execPath, [nextBin, "start", "-H", "127.0.0.1", "-p", "3000"], {
    detached: true,
    env: { ...process.env, NODE_ENV: "production", NEXT_TELEMETRY_DISABLED: "1" },
    stdio: ["ignore", "pipe", "pipe"],
  });
  let output = "";
  server.stdout.on("data", (chunk) => { output += chunk; });
  server.stderr.on("data", (chunk) => { output += chunk; });

  try {
    await fetchRetry(`${LOCAL}/el/`);

    for (const page of report.pages) {
      const pathname = new URL(page.url).pathname;
      const response = await fetchRetry(`${LOCAL}${pathname}`);
      const html = await response.text();
      const visible = clean(
        html
          .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
          .replace(/<style\b[\s\S]*?<\/style>/gi, " "),
      );
      for (const phrase of FORBIDDEN_GREEK_COPY) {
        if (visible.includes(phrase)) {
          page.errors.push(`Remaining mixed-language Greek copy: ${phrase}`);
        }
      }
      page.errors = [...new Set(page.errors)];
    }

    report.pages[0].errors = report.pages[0].errors.filter(
      (error) => !error.startsWith("Redirect /el/"),
    );

    for (const redirect of report.configRedirects || []) {
      const response = await fetchRetry(`${LOCAL}${redirect.source}`);
      const finalPath = normalizePathname(response.url, LOCAL);
      const expectedPath = normalizePathname(redirect.destination, LOCAL);
      redirect.finalUrl = response.url;
      redirect.errors = [];

      if (!response.ok) {
        redirect.errors.push(`Final response HTTP ${response.status}`);
      }
      if (finalPath !== expectedPath) {
        redirect.errors.push(`Final target mismatch: ${finalPath} expected ${expectedPath}`);
      }
      if (redirect.errors.length) {
        report.pages[0].errors.push(
          `Redirect ${redirect.source}: ${redirect.errors.join(" | ")}`,
        );
      }
    }

    fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);
  } catch (error) {
    console.error(output);
    throw error;
  } finally {
    stop(server, "SIGTERM");
    await delay(600);
    stop(server, "SIGKILL");
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
