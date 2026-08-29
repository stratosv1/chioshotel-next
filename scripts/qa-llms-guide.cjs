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

if (exists("public/llms.txt")) {
  failures.push(
    "llms.txt must not be a hand-maintained public asset; use the generated route instead",
  );
}

expectAll(
  "app/llms-full.txt/route.ts",
  [
    'import sitemap from "@/app/sitemap"',
    "buildLlmsFullGuide",
    "sitemap().map((entry) => entry.url)",
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

expectAll(
  "app/llms.txt/route.ts",
  [
    "buildRootLlmsGuide",
    'Content-Type": "text/plain; charset=utf-8"',
    'export const dynamic = "force-static"',
  ],
  "root llms.txt must be generated as a static text route",
);

expectAll(
  "app/[locale]/llms.txt/route.ts",
  [
    "buildLocalizedLlmsGuide",
    "AI_DISCOVERY_LANGUAGES",
    "isLanguageCode",
    'locale === "en"',
    'Content-Type": "text/plain; charset=utf-8"',
  ],
  "localized llms.txt routes must validate supported non-English locales",
);

expectAll(
  "lib/ai-discovery/config.ts",
  [
    '"en"',
    '"el"',
    '"fr"',
    '"de"',
    '"it"',
    '"es"',
    '"tr"',
    '"rooms-index"',
    '"family-apartment"',
    '"find-your-room"',
    "Rooms & Apartments in Chios",
    "Δωμάτια και Διαμερίσματα στη Χίο",
    "Sakız Adası’nda Odalar ve Daireler",
  ],
  "AI discovery config must cover all supported locales and commercial accommodation entities",
);

expectAll(
  "lib/ai-discovery/route-resolver.ts",
  [
    'import { routeMap } from "@/lib/url-map"',
    'candidate.action === "KEEP"',
    "candidate.itemId === itemId",
    "candidate.language === language",
  ],
  "AI discovery URLs must resolve from KEEP routes in the canonical route map",
);

expectAll(
  "lib/ai-discovery/llms-builder.ts",
  [
    "AI_DISCOVERY_COPY",
    "resolveDiscoveryUrl",
    "localizedLlmsUrl",
    "buildRootLlmsGuide",
    "buildLocalizedLlmsGuide",
    "FULL_INDEX_HEADINGS",
  ],
  "AI discovery guides must be generated from shared multilingual config and canonical routes",
);

expectAll(
  "app/layout.tsx",
  [
    'import { RoomFinderWebMCP } from "@/components/ai/webmcp/RoomFinderWebMCP"',
    'rel="describedby"',
    'type="text/markdown"',
    '"/llms.txt"',
    '`/${sharedLanguage}/llms.txt`',
    "WEBMCP_ORIGIN_TRIAL_TOKEN",
    'httpEquiv="origin-trial"',
    "publicWebMcpPath",
    "!privatePhysicsPath && !staffPath && !isPolishPath",
    "isChiosHotelHost(requestHost)",
    "{publicWebMcpPath ? <RoomFinderWebMCP /> : null}",
  ],
  "supported public pages must advertise localized AI guides and register WebMCP while private/staff paths stay excluded",
);

expectAll(
  "components/ai/webmcp/RoomFinderWebMCP.tsx",
  [
    "check_voulamandis_room_availability",
    "get_voulamandis_rooms",
    "get_voulamandis_offers",
    "get_voulamandis_property_info",
    "search_chioshotel_information",
    "/api/ai-room-finder/availability",
    "/api/agentic/voulamandis",
    "readOnlyHint: true",
    "untrustedContentHint: false",
    "execute: async (input, client = {}) =>",
    "client.signal",
    'addEventListener("abort", handleClientAbort',
    'removeEventListener("abort", handleClientAbort)',
    "registrationController.signal",
    "requestController.signal",
    'code: "CANCELLED"',
    "bookingCreated: false",
    "for (const tool of tools)",
  ],
  "WebMCP commercial and site-information tools must stay read-only, cancellable and connected to approved public APIs",
);

expectNone(
  "components/ai/webmcp/RoomFinderWebMCP.tsx",
  ["execute: async (input) =>"],
  "WebMCP execute must accept the current cancellation client argument",
);

expectAll(
  "app/api/agentic/voulamandis/route.ts",
  [
    'import { getAgentRoomGuideData } from "@/lib/agent-room-guide-data"',
    "searchSalesKnowledge",
    'import { searchExtraKnowledge } from "@/lib/ai-assistant/knowledge-extra"',
    'import { AI_DISCOVERY_COPY } from "@/lib/ai-discovery/config"',
    "resolveDiscoveryUrl",
    'resource === "rooms"',
    'resource === "property"',
    'resource === "offers"',
    'resource === "knowledge"',
    'source: "booking_core.rooms + booking_core.room_features"',
    'source: "existing curated site knowledge"',
    '"X-Robots-Tag": "noindex"',
    "discountPercent: 10",
    "stackable: false",
    "room.isEconomy",
    "room.hasFullKitchen",
    'resolveDiscoveryUrl("economy-double", language)',
    'resolveDiscoveryUrl("family-apartment", language)',
    'detailsUrl: detailsUrlForRoom(room, language)',
  ],
  "Agentic public data API must reuse Booking Core, existing site knowledge and canonical room mappings",
);

expectNone(
  "app/api/agentic/voulamandis/route.ts",
  ["insert into", "update booking_core", "delete from", "bookingCreated: true"],
  "Agentic public data API must remain read-only",
);

expectNone(
  "app/ai-assistant/page.tsx",
  ["<RoomFinderWebMCP />", 'from "@/components/ai/webmcp/RoomFinderWebMCP"'],
  "AI room finder must not duplicate the WebMCP registration already provided by the public root layout",
);

expect(
  "app/find-your-room/page.tsx",
  'permanentRedirect("/ai-assistant/?lang=en")',
  "public English room-finder discovery URL must resolve to the WebMCP-enabled assistant",
);

expect(
  "app/sitemap.ts",
  "deduplicateByCanonicalUrl",
  "llms-full depends on sitemap canonical deduplication",
);

if (failures.length > 0) {
  console.error("AI discovery QA failed:\n");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("AI discovery QA passed");
