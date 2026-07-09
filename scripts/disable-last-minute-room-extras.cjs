const fs = require("fs");
const path = require("path");

const zeroRoomExtrasBlock = `const ROOM_EXTRA_PER_NIGHT: Record<number, number> = {
  1: 0,
  2: 0,
  3: 0,
  4: 0,
  5: 0,
  6: 0,
  7: 0,
  8: 0,
  9: 0,
  10: 0,
};`;

const targets = [
  {
    label: "LastMinuteDeals",
    filePath: path.join(process.cwd(), "components", "home", "LastMinuteDeals.tsx"),
  },
  {
    label: "FindYourRoomEngine",
    filePath: path.join(process.cwd(), "components", "booking", "FindYourRoomEngine.tsx"),
  },
];

const roomExtrasRegex =
  /const ROOM_EXTRA_PER_NIGHT:\s*Record<number,\s*number>\s*=\s*\{[\s\S]*?\};/m;

for (const target of targets) {
  if (!fs.existsSync(target.filePath)) {
    console.warn(`Skipping ${target.label}: file not found.`);
    continue;
  }

  const source = fs.readFileSync(target.filePath, "utf8");

  if (!source.includes("ROOM_EXTRA_PER_NIGHT")) {
    console.warn(`Skipping ${target.label}: ROOM_EXTRA_PER_NIGHT not found.`);
    continue;
  }

  if (!roomExtrasRegex.test(source)) {
    console.warn(`Skipping ${target.label}: ROOM_EXTRA_PER_NIGHT block format not matched.`);
    continue;
  }

  const nextSource = source.replace(roomExtrasRegex, zeroRoomExtrasBlock);

  if (nextSource !== source) {
    fs.writeFileSync(target.filePath, nextSource, "utf8");
    console.log(`Updated ${target.label}: room extras set to zero.`);
  } else {
    console.log(`No change needed for ${target.label}.`);
  }
}

const consentPath = path.join(process.cwd(), "components", "analytics", "ConsentAnalytics.tsx");

if (fs.existsSync(consentPath)) {
  let source = fs.readFileSync(consentPath, "utf8");
  const wrongImport = 'import { Analytics, track } from "@vercel/analytics/react";';
  const correctImport =
    'import { track } from "@vercel/analytics";\nimport { Analytics } from "@vercel/analytics/react";';

  if (source.includes(wrongImport)) {
    source = source.replace(wrongImport, correctImport);
    fs.writeFileSync(consentPath, source, "utf8");
    console.log("Fixed ConsentAnalytics import.");
  }
}

const villageCategoriesPath = path.join(process.cwd(), "content", "village-categories.ts");

if (fs.existsSync(villageCategoriesPath)) {
  let source = fs.readFileSync(villageCategoriesPath, "utf8");
  const looseVillageSize =
    '      size: index === 0 ? "large" : index === 1 ? "tall" : index === 2 ? "wide" : "normal",';
  const typedVillageSize =
    '      size: (index === 0 ? "large" : index === 1 ? "tall" : index === 2 ? "wide" : "normal") as ChiosVillagesPageData["villages"][number]["size"],';

  if (source.includes(looseVillageSize)) {
    source = source.replace(looseVillageSize, typedVillageSize);
    fs.writeFileSync(villageCategoriesPath, source, "utf8");
    console.log("Fixed village category card size type.");
  }
}
