const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const activeLanguages = ["en", "el", "fr", "de", "it", "es", "tr"];
const bookingPaths = {
  en: "/chios-hotels-rates/",
  el: "/el/amesi-kratisi-voulamandis-house/",
  fr: "/fr/tarifs-des-hotels-a-chios/",
  de: "/de/hotelpreise-auf-der-insel-chios/",
  it: "/it/prezzi-hotel-chios/",
  es: "/es/los-mejores-precios-de-hotel-en-la-isla-chios/",
  tr: "/tr/sakiz-adasi-rezervasyon/",
};

const failures = [];
const passes = [];

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function check(condition, passMessage, failMessage = passMessage) {
  if (condition) {
    passes.push(passMessage);
    return;
  }

  failures.push(failMessage);
}

function walk(relativeDirectory) {
  const absoluteDirectory = path.join(root, relativeDirectory);
  const files = [];

  for (const entry of fs.readdirSync(absoluteDirectory, { withFileTypes: true })) {
    const relativePath = path.join(relativeDirectory, entry.name);

    if (entry.isDirectory()) {
      files.push(...walk(relativePath));
    } else if (/\.(?:ts|tsx|js|jsx|mjs|cjs)$/.test(entry.name)) {
      files.push(relativePath);
    }
  }

  return files;
}

function isPublicSource(relativePath) {
  const normalized = relativePath.split(path.sep).join("/");

  return !(
    normalized.startsWith("app/api/") ||
    normalized.startsWith("app/staff/") ||
    normalized.startsWith("app/mixalis/") ||
    normalized.startsWith("components/staff/") ||
    normalized.startsWith("lib/staff/")
  );
}

function findMatches(files, pattern) {
  const matches = [];

  for (const relativePath of files) {
    const source = read(relativePath);
    const lines = source.split(/\r?\n/);

    lines.forEach((line, index) => {
      pattern.lastIndex = 0;
      if (pattern.test(line)) {
        matches.push(`${relativePath.split(path.sep).join("/")}:${index + 1}`);
      }
    });
  }

  return matches;
}

const languageSource = read("lib/languages.ts");
const languageType = languageSource.match(/export type LanguageCode\s*=\s*([^;]+);/)?.[1] || "";
const configuredLanguages = [...languageType.matchAll(/"([a-z]{2})"/g)].map((match) => match[1]);

check(
  JSON.stringify(configuredLanguages) === JSON.stringify(activeLanguages),
  "Active language contract is exactly en, el, fr, de, it, es and tr.",
  `Active language contract changed: ${configuredLanguages.join(", ") || "none found"}.`,
);

const ratesSource = read("content/rates.ts");
const beachDetailSource = read("components/chios/BeachDetailPageTailwind.tsx");
const bookingHydratorSource = read("components/booking/BookNowCtaHydrator.tsx");

for (const [language, bookingPath] of Object.entries(bookingPaths)) {
  check(
    ratesSource.includes(`canonicalPath: "${bookingPath}"`),
    `${language.toUpperCase()} booking owner route exists in rates content.`,
    `${language.toUpperCase()} booking owner route is missing from rates content: ${bookingPath}`,
  );
  check(
    beachDetailSource.includes(`${language}: "${bookingPath}"`),
    `${language.toUpperCase()} beach booking CTA is localized.`,
    `${language.toUpperCase()} beach booking CTA is not mapped to ${bookingPath}`,
  );
  check(
    bookingHydratorSource.includes(`${language}: "${bookingPath}"`),
    `${language.toUpperCase()} browser-side booking CTA is localized.`,
    `${language.toUpperCase()} browser-side booking CTA is not mapped to ${bookingPath}`,
  );
}

const seoSource = read("lib/seo.ts");
const proxySource = read("proxy.ts");
const robotsSource = read("app/robots.ts");
const routeMapSource = read("lib/url-map.ts");
const nextConfigSource = read("next.config.ts");
const agentRoomGuideDataSource = read("lib/agent-room-guide-data.ts");
const answerFirstSeoSource = read("components/seo/AnswerFirstSeoBlock.tsx");
const villageDetailSource = read("components/chios/VillageDetailPageTailwind.tsx");
const museumDetailSource = read("components/chios/MuseumDetailPage.tsx");
const globalCssSource = read("app/globals.css");
const headerSource = read("components/VoulamandisHeaderTailwind.tsx");
const footerSource = read("components/VoulamandisFooterTailwind.tsx");
const roomsCategorySource = read("components/rooms/RoomsCategoryPage.tsx");
const roomDetailSource = read("components/rooms/RoomDetailPage.tsx");
const chiosIslandSource = read("components/chios/ChiosIslandPage.tsx");
const polishHomeSource = read("components/home/PolishHomePageTailwind.tsx");
const packageJson = JSON.parse(read("package.json"));

check(
  !packageJson.scripts?.build?.includes("prepare-build-clean.cjs"),
  "Production build is read-only and does not run source patchers.",
  "Production build must not mutate tracked source through prepare-build-clean.cjs.",
);
check(
  !routeMapSource.includes('action: "CHECK"'),
  "Central route map contains no unresolved CHECK records.",
  "Central route map still contains unresolved CHECK records.",
);

const routeRecords = [...routeMapSource.matchAll(
  /\n  \{\n    path: "([^"]+)",[\s\S]*?\n  \},/g,
)].map((match) => {
  const block = match[0];
  return {
    path: block.match(/path: "([^"]+)"/)?.[1],
    language: block.match(/language: "([^"]+)"/)?.[1],
    itemId: block.match(/itemId: "([^"]+)"/)?.[1],
    action: block.match(/action: "([^"]+)"/)?.[1],
  };
});
const indexableRouteFamilies = new Map();

for (const route of routeRecords.filter((route) => route.action === "KEEP")) {
  const familyLanguages = indexableRouteFamilies.get(route.itemId) || new Set();
  familyLanguages.add(route.language);
  indexableRouteFamilies.set(route.itemId, familyLanguages);
}

const incompleteRouteFamilies = [...indexableRouteFamilies.entries()]
  .map(([itemId, familyLanguages]) => ({
    itemId,
    missing: activeLanguages.filter((language) => !familyLanguages.has(language)),
  }))
  .filter((family) => family.missing.length > 0);

check(
  routeRecords.length > 0 && incompleteRouteFamilies.length === 0,
  `All ${indexableRouteFamilies.size} indexable route families cover the seven active languages.`,
  `Incomplete route families: ${incompleteRouteFamilies
    .map((family) => `${family.itemId} (${family.missing.join(", ")})`)
    .join("; ") || "route map could not be parsed"}.`,
);

const directRoomFinderRedirects = [
  ["/el/vre-to-domatio-pou-sou-tairiazei", "/el/ai-assistant/"],
  ["/el/voulamandis-room-finder-gr", "/el/ai-assistant/"],
  ["/it/trova-la-stanza-che-fa-per-te", "/it/ai-assistant/"],
  ["/de/zimmer-suchassistent", "/de/ai-assistant/"],
  ["/tr/en-uygun-oda", "/tr/ai-assistant/"],
  ["/mike-2", "/ai-assistant/"],
  ["/es/mike", "/es/ai-assistant/"],
];

for (const [source, destination] of directRoomFinderRedirects) {
  const sourceIndex = nextConfigSource.indexOf(`"source":  "${source}"`);
  const redirectBlock = sourceIndex >= 0
    ? nextConfigSource.slice(sourceIndex, sourceIndex + 220)
    : "";

  check(
    redirectBlock.includes(`"destination":  "${destination}"`),
    `${source} redirects directly to ${destination}.`,
    `${source} does not redirect directly to ${destination}.`,
  );
}

check(
  seoSource.includes('export const siteUrl = "https://chioshotel.gr"'),
  "Canonical site origin is https://chioshotel.gr.",
  "Canonical site origin is not the expected non-www HTTPS URL.",
);
check(
  proxySource.includes('host === "www.chioshotel.gr"') &&
    proxySource.includes('url.hostname = "chioshotel.gr"') &&
    proxySource.includes("NextResponse.redirect(url, 308)"),
  "www host has a permanent redirect to the canonical host.",
  "Permanent www to non-www redirect guard is missing.",
);
check(
  robotsSource.includes('host: "https://chioshotel.gr"') &&
    robotsSource.includes('"https://chioshotel.gr/sitemap.xml"'),
  "Robots metadata uses the canonical host and sitemap.",
  "Robots metadata does not consistently use the canonical host.",
);
check(
  !robotsSource.includes('"/_next/image"'),
  "Next.js optimized images remain crawlable.",
  "robots.ts must not block /_next/image.",
);
check(
  answerFirstSeoSource.includes('href="/trip-planner/"') &&
    !answerFirstSeoSource.includes('href="/el/trip-planner/"'),
  "Greek Trip Planner CTA links directly to its canonical route.",
  "Greek Trip Planner CTA still points through a localized redirect.",
);
check(
  agentRoomGuideDataSource.includes("return fallbackGuideData();") &&
    agentRoomGuideDataSource.includes("if (!process.env.DATABASE_URL)"),
  "Public travel-agent room pages remain available without a database connection.",
  "Travel-agent room pages have no database-independent fallback.",
);
check(
  agentRoomGuideDataSource.includes("isStepFreeApartment || Boolean(row.no_stairs)") &&
    agentRoomGuideDataSource.includes("isStepFreeApartment ? 0 : Number(row.entrance_steps)"),
  "Travel-agent room data enforces step-free Apartments 8–10.",
  "Travel-agent room data can regress Apartments 8–10 to stair access.",
);
check(
  !/<img(?:\s|>)/.test(villageDetailSource) && !/<img(?:\s|>)/.test(museumDetailSource),
  "Shared village and museum detail templates use Next/Image.",
  "Shared village or museum detail templates still contain raw img elements.",
);
check(
  nextConfigSource.includes('hostname: "upload.wikimedia.org"'),
  "Next/Image allows the approved Wikimedia image host used by Chios guides.",
  "Next/Image is missing the Wikimedia remote image allowlist used by Chios guides.",
);
check(
  globalCssSource.includes(".vh-public-site .text-xs") &&
    globalCssSource.includes("font-size: 0.875rem !important") &&
    globalCssSource.includes(":focus-visible"),
  "Public mobile typography and visible keyboard focus have shared accessibility floors.",
  "Public mobile typography or visible keyboard focus guardrails are missing.",
);
check(
  headerSource.includes("h-11 min-w-11") &&
    headerSource.includes("max-h-[calc(100dvh-72px)]") &&
    headerSource.includes('document.body.style.overflow = "hidden"') &&
    headerSource.includes('event.key === "Escape"'),
  "Mobile navigation has 44px language targets, viewport scrolling, scroll lock and Escape support.",
  "Mobile navigation accessibility safeguards are incomplete.",
);
check(
  footerSource.includes("grid-cols-1 divide-y") &&
    footerSource.includes("min-h-11 min-w-0") &&
    footerSource.includes("env(safe-area-inset-bottom)"),
  "Mobile footer uses a readable single-column layout, 44px links and safe-area spacing.",
  "Mobile footer layout, touch targets or safe-area spacing regressed.",
);

for (const [label, source] of [
  ["rooms category", roomsCategorySource],
  ["room detail", roomDetailSource],
  ["Chios island", chiosIslandSource],
  ["Polish home", polishHomeSource],
]) {
  check(
    source.includes("env(safe-area-inset-bottom)"),
    `${label} mobile fixed actions respect device safe areas.`,
    `${label} mobile fixed actions do not respect device safe areas.`,
  );
}

const publicFiles = ["app", "components", "content", "lib"]
  .flatMap(walk)
  .filter(isPublicSource);
const wwwLinks = findMatches(publicFiles, /https?:\/\/www\.chioshotel\.gr/i);
const misplacedMuseumLinks = findMatches(
  publicFiles,
  /(?:href\s*[:=]\s*["'`])\/tr\/chios-odalari\/heyecan-verici-sakiz-adasi-muzeleri\/?["'`]/,
);

check(
  wwwLinks.length === 0,
  "Public source contains no links to the www hostname.",
  `Public source still links to the www hostname: ${wwwLinks.join(", ")}`,
);
check(
  misplacedMuseumLinks.length === 0,
  "Public source contains no direct links to the misplaced Turkish museum URL.",
  `Public source links to the misplaced Turkish museum URL: ${misplacedMuseumLinks.join(", ")}`,
);

const publicPages = publicFiles.filter((relativePath) =>
  relativePath.split(path.sep).join("/").startsWith("app/") &&
  /\/page\.(?:ts|tsx|js|jsx)$/.test(relativePath.split(path.sep).join("/")),
);
const rawImageMatches = findMatches(publicFiles, /<img(?:\s|>)/);
const todoMatches = findMatches(publicFiles, /\b(?:TODO|FIXME)\b/);
const consoleMatches = findMatches(publicFiles, /\bconsole\.(?:log|warn|error)\s*\(/);

console.log("\nGENERAL CLEAN UP BASELINE");
console.log("=========================");
passes.forEach((message) => console.log(`  ✅ ${message}`));

console.log("\nNON-BLOCKING INVENTORY");
console.log("======================");
console.log(`  Public page files: ${publicPages.length}`);
console.log(`  Raw <img> references: ${rawImageMatches.length}`);
console.log(`  TODO/FIXME references: ${todoMatches.length}`);
console.log(`  Public console references: ${consoleMatches.length}`);

if (failures.length) {
  console.error("\nBLOCKING FINDINGS");
  console.error("=================");
  failures.forEach((message) => console.error(`  ❌ ${message}`));
  process.exit(1);
}

console.log("\n✅ General Clean Up baseline passed.\n");
