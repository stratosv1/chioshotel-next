const fs = require("fs");

const languages = ["en", "el", "fr", "de", "it", "es", "tr"];
const expectedItems = ["rooms-index", "economy-double", "standard-double", "family-apartment"];

const routeMap = fs.readFileSync("lib/url-map.ts", "utf8");
const roomDetails = fs.readFileSync("content/room-details.ts", "utf8");

function extractRouteRecords() {
  const records = [];
  const blocks = routeMap.match(/\{[\s\S]*?\}/g) || [];

  for (const block of blocks) {
    const contentType = block.match(/contentType:\s*"([^"]+)"/)?.[1];
    const itemId = block.match(/itemId:\s*"([^"]+)"/)?.[1];
    const language = block.match(/language:\s*"([^"]+)"/)?.[1];
    const template = block.match(/template:\s*"([^"]+)"/)?.[1];
    const action = block.match(/action:\s*"([^"]+)"/)?.[1];
    const path = block.match(/path:\s*"([^"]+)"/)?.[1];

    if (contentType && itemId && language) {
      records.push({ contentType, itemId, language, template, action, path });
    }
  }

  return records;
}

function hasExport(name) {
  return roomDetails.includes(`export const ${name}`);
}

const records = extractRouteRecords();
let hasError = false;

console.log("\nROOM ROUTE PARITY AUDIT");
console.log("=======================");

for (const itemId of expectedItems) {
  const itemRecords = records.filter((r) => r.itemId === itemId);
  const langs = itemRecords.map((r) => r.language).sort();

  console.log(`\n${itemId}`);
  console.log(`Languages: ${langs.join(", ")}`);

  for (const lang of languages) {
    const rec = itemRecords.find((r) => r.language === lang);
    const expectedTemplate = itemId === "rooms-index" ? "RoomsCategoryPage" : "RoomDetailPage";

    if (!rec) {
      hasError = true;
      console.log(`  ❌ Missing ${lang}`);
    } else if (rec.template !== expectedTemplate || rec.action !== "KEEP") {
      hasError = true;
      console.log(`  ❌ ${lang}: ${rec.template}/${rec.action} -> ${rec.path}`);
    } else {
      console.log(`  ✅ ${lang}: ${rec.path}`);
    }
  }
}

console.log("\nROOM DETAIL RENDERING AND SEARCH AUDIT");
console.log("======================================");

const roomComponent = fs.readFileSync("components/rooms/RoomDetailPage.tsx", "utf8");
const roomSchema = fs.readFileSync("content/room-detail-schema.ts", "utf8");
const localizedRouter = fs.readFileSync("app/[locale]/[...slug]/page.tsx", "utf8");
const polishRoomDetails = fs.readFileSync("content/room-details-pl.ts", "utf8");
const polishAccommodation = fs.readFileSync("content/chios-accommodation-pl.ts", "utf8");
const propertyKnowledge = fs.readFileSync("db/seeds/property-knowledge.json", "utf8");
const stepFreeMigration = fs.readFileSync("db/migrations/20260913_step_free_family_apartments.sql", "utf8");
const seo = fs.readFileSync("lib/seo.ts", "utf8");
const seoPl = fs.readFileSync("lib/seo-pl.ts", "utf8");
const roomFactSources = [
  roomDetails,
  propertyKnowledge,
  fs.readFileSync("lib/ai-assistant/knowledge.ts", "utf8"),
  fs.readFileSync("lib/ai-assistant/room-catalog.ts", "utf8"),
  fs.readFileSync("lib/ai-assistant/room-card-catalog.ts", "utf8"),
  fs.readFileSync("components/booking/ChiosHotelsLiveSearch.tsx", "utf8"),
  fs.readFileSync("components/booking/LocalizedChiosHotelsLiveSearch.tsx", "utf8"),
].join("\n");

JSON.parse(propertyKnowledge);

const sourceChecks = [
  ["Room images use Next/Image", roomComponent.includes('from "next/image"')],
  ["Hero exposes its descriptive alt", roomComponent.includes("alt={data.hero.imageAlt}")],
  ["Legacy room CSS is absent", !roomComponent.includes("room-detail.css") && !roomComponent.includes("room-detail-cards.css") && !roomComponent.includes("room-detail-floor-groups.css")],
  ["Raw img elements are absent", !roomComponent.includes("<img")],
  ["Only the hero is marked priority", (roomComponent.match(/\bpriority\b/g) || []).length === 1],
  ["Room schema emits representative ImageObjects", roomSchema.includes("buildRoomImageObjectSchemas")],
  ["WebPage schema references representative images", roomSchema.includes("getRoomImageReferences(data)")],
  ["Accommodation schema contains the complete room image set", roomSchema.includes("const allImages = getRoomDetailImages(data)") && roomSchema.includes("image: allImages")],
  ["Family apartments use step-free access", roomDetails.includes('"Ground floor · step-free access"') && roomDetails.includes('"Step-free access"')],
  ["Removed 4–5-step claim is absent from every room fact source", !roomFactSources.includes("4–5")],
  ["Database correction marks Apartments 8–10 step-free", stepFreeMigration.includes("set no_stairs = true") && stepFreeMigration.includes("entrance_steps = 0") && stepFreeMigration.includes("room_number in (8, 9, 10)")],
  ["Standard rooms publish Polish alternates", seo.includes('pl: "/pl/pokoje-na-chios/pokoje-standardowe/"') && seo.includes('"/tr/chios-odalari/standart-cift-kisilik-odalar/"')],
  ["Localized metadata preserves extended alternates", localizedRouter.includes("{ ...getAlternates(path) }")],
  ["Polish room alternates include all seven primary languages", ["en", "el", "fr", "de", "it", "es", "tr", "pl"].every((lang) => new RegExp(`\\n\\s+${lang}:`).test(seoPl))],
  ["Polish family canonical matches its published route", polishRoomDetails.includes('canonicalPath: "/pl/apartamenty-na-chios/"')],
  ["Polish accommodation links to the published family route", !polishAccommodation.includes("/pl/pokoje-na-chios/apartamenty-rodzinne/") && polishAccommodation.includes("/pl/apartamenty-na-chios/")],
];

for (const [label, passed] of sourceChecks) {
  console.log(`  ${passed ? "✅" : "❌"} ${label}`);
  if (!passed) hasError = true;
}

console.log("\nROOM DETAIL EXPORT AUDIT");
console.log("========================");

const exportGroups = {
  standardDouble: [
    "standardDoubleRoomEn",
    "standardDoubleRoomEl",
    "standardDoubleRoomFr",
    "standardDoubleRoomDe",
    "standardDoubleRoomIt",
    "standardDoubleRoomEs",
    "standardDoubleRoomTr",
  ],
  economyDouble: [
    "economyDoubleRoomsEn",
    "economyDoubleRoomsEl",
    "economyDoubleRoomsFr",
    "economyDoubleRoomsDe",
    "economyDoubleRoomsIt",
    "economyDoubleRoomsEs",
    "economyDoubleRoomsTr",
  ],
  familyApartment: [
    "familyChiosApartments",
    "familyChiosApartmentsEl",
    "familyChiosApartmentsFr",
    "familyChiosApartmentsDe",
    "familyChiosApartmentsIt",
    "familyChiosApartmentsEs",
    "familyChiosApartmentsTr",
  ],
};

for (const [groupName, names] of Object.entries(exportGroups)) {
  console.log(`\n${groupName}`);
  for (const name of names) {
    if (hasExport(name)) {
      console.log(`  ✅ ${name}`);
    } else {
      hasError = true;
      console.log(`  ❌ Missing export: ${name}`);
    }
  }
}

console.log("\nRESULT");
console.log("======");
if (hasError) {
  console.log("❌ Audit found real mismatches.");
  process.exitCode = 1;
} else {
  console.log("✅ Central room pages and room detail pages are structurally aligned across all 7 languages.");
}
