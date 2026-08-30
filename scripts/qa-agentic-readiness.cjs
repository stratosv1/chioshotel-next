const fs = require("node:fs");
const path = require("node:path");

function read(relativePath) {
  return fs.readFileSync(path.join(process.cwd(), relativePath), "utf8");
}

function requireIncludes(source, needles, message) {
  for (const needle of needles) {
    if (!source.includes(needle)) {
      throw new Error(`${message}: missing ${needle}`);
    }
  }
}

const layout = read("app/layout.tsx");
const webmcp = read("components/ai/webmcp/RoomFinderWebMCP.tsx");
const header = read("components/VoulamandisHeaderTailwind.tsx");
const reviews = read("components/home/HomeReviews.tsx");
const carousel = read("components/ai/room-finder-carousel.tsx");

requireIncludes(
  layout,
  ["<RoomFinderWebMCP />", 'rel="describedby"', "href={aiGuideHref}"],
  "Agentic discovery must remain site-wide",
);

requireIncludes(
  webmcp,
  [
    "useLayoutEffect",
    "document as WebMcpDocument",
    "modelContext.registerTool",
    "check_voulamandis_room_availability",
    "get_voulamandis_rooms",
    "get_voulamandis_offers",
    "get_voulamandis_property_info",
    "search_chioshotel_information",
    "readOnlyHint: true",
  ],
  "WebMCP registration must stay early and read-only",
);

requireIncludes(
  header,
  [
    'aria-controls="vh-mobile-navigation"',
    'id="vh-mobile-navigation"',
    "aria-hidden={!isOpen}",
    "inert={!isOpen}",
    "width={128}",
    "height={128}",
  ],
  "Closed mobile navigation must not remain agent-interactive",
);

requireIncludes(
  reviews,
  [
    "min-h-[280px]",
    "md:min-h-[320px]",
    'role="region"',
    "aria-busy={!widgetReady}",
    "MutationObserver",
  ],
  "Lazy reviews must reserve space and expose load state",
);

requireIncludes(
  carousel,
  [
    'aria-roledescription="carousel"',
    'aria-roledescription="slide"',
    "ROOM_OPTIONS_LABEL",
    'type="button"',
  ],
  "Room Finder offers must preserve agent-readable carousel semantics",
);

console.log("Agentic readiness static QA passed.");
