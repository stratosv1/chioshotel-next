const fs = require("fs");
const path = require("path");

const root = process.cwd();
const failures = [];

const exists = (file) => fs.existsSync(path.join(root, file));
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

function expect(file, needle, message) {
  if (!exists(file)) {
    failures.push(`${message}: missing ${file}`);
    return;
  }

  const text = read(file);
  if (!text.includes(needle)) failures.push(`${message} (${file})`);
}

function expectAll(file, needles, message) {
  if (!exists(file)) {
    failures.push(`${message}: missing ${file}`);
    return;
  }

  const text = read(file);
  for (const needle of needles) {
    if (!text.includes(needle)) {
      failures.push(`${message}: missing ${needle} (${file})`);
    }
  }
}

function expectNone(file, needles, message) {
  if (!exists(file)) return;

  const text = read(file);
  for (const needle of needles) {
    if (text.includes(needle)) {
      failures.push(`${message}: found ${needle} (${file})`);
    }
  }
}

if (exists("public/llms-full.txt")) {
  failures.push(
    "llms-full.txt must not be a hand-maintained public asset; use the sitemap-backed route instead",
  );
}

expectAll(
  "app/llms-full.txt/route.ts",
  [
    'import sitemap from "@/app/sitemap"',
    'buildLlmsFullGuide',
    'sitemap().map((entry) => entry.url)',
    'Content-Type": "text/plain; charset=utf-8"',
  ],
  "llms-full route must stay connected to canonical sitemap data",
);

expectAll(
  "lib/llms-full-guide.ts",
  [
    'import { routeMap } from "@/lib/url-map"',
    '["Homepage", "home"]',
    '["Rooms and apartments", "rooms-index"]',
    '["Economy double room", "economy-double"]',
    '["Standard double room", "standard-double"]',
    '["Family apartments", "family-apartment"]',
    '["Rates and direct booking", "booking"]',
    '["Live room finder", "find-your-room"]',
    '["Deals and offers", "deals"]',
    '["Contact", "contact"]',
    '["Chios island guide", "chios-index"]',
    'candidate.action === "KEEP"',
  ],
  "llms-full core routes must resolve through the route registry",
);

expectNone(
  "lib/llms-full-guide.ts",
  [
    "/chios-rooms/economy-room/",
    "/chios-hotel-rates/",
    "/chios-hotels-contact/",
    "/chios/chios-villages/mesta-village/",
    "/chios/chios-villages/pyrgi-village/",
    "/family-travel-chios/",
    "/chios/chios-activities/",
  ],
  "Legacy URLs must not be hard-coded into the generated AI guide",
);

expect(
  "app/sitemap.ts",
  "deduplicateByCanonicalUrl",
  "llms-full depends on sitemap canonical deduplication",
);

if (failures.length > 0) {
  console.error("llms-full QA failed:\n");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("llms-full QA passed");
