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

console.log("\nENGLISH ROOM DETAIL CSS AUDIT");
console.log("=============================");

const cssExpectations = [
  {
    file: "app/chios-rooms/standard-double-room/layout.tsx",
    needsFloorGroups: true,
  },
  {
    file: "app/chios-rooms/economy-double-rooms/layout.tsx",
    needsFloorGroups: true,
  },
  {
    file: "app/chios-rooms/family-chios-apartments/layout.tsx",
    needsFloorGroups: false,
  },
];

for (const item of cssExpectations) {
  const s = fs.existsSync(item.file) ? fs.readFileSync(item.file, "utf8") : "";
  const hasRoomDetail = s.includes("room-detail.css");
  const hasCards = s.includes("room-detail-cards.css");
  const hasFloorGroups = s.includes("room-detail-floor-groups.css");

  console.log(`\n${item.file}`);
  console.log(`  room-detail.css: ${hasRoomDetail ? "✅" : "❌"}`);
  console.log(`  room-detail-cards.css: ${hasCards ? "✅" : "❌"}`);
  console.log(`  room-detail-floor-groups.css: ${hasFloorGroups ? "✅" : item.needsFloorGroups ? "❌" : "➖ not needed"}`);

  if (!hasRoomDetail || !hasCards || (item.needsFloorGroups && !hasFloorGroups)) {
    hasError = true;
  }
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
