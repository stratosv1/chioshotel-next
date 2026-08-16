const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(`[qa-ai-discovery] ${message}`);
  }
}

function checkStaticDelivery() {
  const routePaths = ["app/llms.txt/route.ts", "app/llms-full.txt/route.ts"];

  for (const routePath of routePaths) {
    assert(fs.existsSync(path.join(root, routePath)), `Missing ${routePath}`);
    const source = read(routePath);
    assert(!source.includes('"use client"'), `${routePath} must stay server-only`);
    assert(
      source.includes('dynamic = "force-static"'),
      `${routePath} must remain force-static`,
    );
    assert(
      source.includes('text/plain; charset=utf-8'),
      `${routePath} must serve UTF-8 plain text`,
    );
  }

  assert(
    !fs.existsSync(path.join(root, "public/llms.txt")),
    "public/llms.txt must not coexist with the generated route",
  );
  assert(
    !fs.existsSync(path.join(root, "public/llms-full.txt")),
    "public/llms-full.txt must not coexist with the generated route",
  );
}

function checkCanonicalSourceOfTruth() {
  const source = read("lib/ai-discovery.ts");

  for (const requiredToken of [
    'import sitemap from "@/app/sitemap"',
    "sitemap()",
    "validateCuratedLinks",
    "ACCOMMODATION_LANDING_PATHS",
    "CHIOS_HOTELS_GUIDE_PATHS",
    "propertyFaqPaths",
    "routeMap",
  ]) {
    assert(
      source.includes(requiredToken),
      `lib/ai-discovery.ts is missing canonical source token: ${requiredToken}`,
    );
  }

  assert(
    !source.includes("/find-your-room/"),
    "Noindex AI Room Finder must not be manually promoted as a canonical llms source",
  );
}

function checkCrawlerAndAgentDiscovery() {
  const robots = read("app/robots.ts");
  const expectedAgents = [
    "OAI-SearchBot",
    "ChatGPT-User",
    "Claude-SearchBot",
    "Claude-User",
    "PerplexityBot",
    "Perplexity-User",
  ];

  for (const agent of expectedAgents) {
    assert(robots.includes(`"${agent}"`), `robots.ts must explicitly include ${agent}`);
  }

  assert(
    robots.includes('userAgent: "*"'),
    "robots.ts must preserve the general crawler policy",
  );
  assert(
    robots.includes('allow: "/"'),
    "robots.ts must keep public crawling allowed",
  );

  const vercelConfig = JSON.parse(read("vercel.json"));
  const hasLlmsDescribedBy = (vercelConfig.headers ?? []).some((rule) =>
    (rule.headers ?? []).some(
      (header) =>
        String(header.key).toLowerCase() === "link" &&
        String(header.value).includes("</llms.txt>") &&
        String(header.value).includes('rel="describedby"'),
    ),
  );

  assert(
    hasLlmsDescribedBy,
    "vercel.json must advertise /llms.txt with a Link rel=describedby response header",
  );
}

checkStaticDelivery();
checkCanonicalSourceOfTruth();
checkCrawlerAndAgentDiscovery();

console.log(
  "AI discovery QA passed (3/3): static delivery, canonical source of truth, crawler + agent discovery.",
);
