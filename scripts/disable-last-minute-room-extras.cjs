const fs = require("fs");
const path = require("path");

const currentBlock = `const ROOM_EXTRA_PER_NIGHT: Record<number, number> = {
  1: 10,
  2: 5,
  3: 7,
  4: 0,
  5: 0,
  6: 0,
  7: 10,
  8: 0,
  9: 0,
  10: 5,
};`;

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

for (const target of targets) {
  const source = fs.readFileSync(target.filePath, "utf8");

  if (!source.includes(currentBlock) && !source.includes(zeroRoomExtrasBlock)) {
    throw new Error(`Could not verify ${target.label} ROOM_EXTRA_PER_NIGHT block.`);
  }

  if (source.includes(currentBlock)) {
    fs.writeFileSync(target.filePath, source.replace(currentBlock, zeroRoomExtrasBlock), "utf8");
  }
}

const consentPath = path.join(process.cwd(), "components", "analytics", "ConsentAnalytics.tsx");
if (fs.existsSync(consentPath)) {
  let source = fs.readFileSync(consentPath, "utf8");
  const wrongImport = 'import { Analytics, track } from "@vercel/analytics/react";';
  const correctImport = 'import { track } from "@vercel/analytics";\nimport { Analytics } from "@vercel/analytics/react";';

  if (source.includes(wrongImport)) {
    source = source.replace(wrongImport, correctImport);
    fs.writeFileSync(consentPath, source, "utf8");
  }
}
