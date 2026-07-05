const fs = require("fs");
const path = require("path");

const filePath = path.join(process.cwd(), "components", "home", "LastMinuteDeals.tsx");
const source = fs.readFileSync(filePath, "utf8");

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

if (!source.includes(currentBlock) && !source.includes(zeroRoomExtrasBlock)) {
  throw new Error("Could not verify LastMinuteDeals ROOM_EXTRA_PER_NIGHT block.");
}

if (source.includes(currentBlock)) {
  fs.writeFileSync(filePath, source.replace(currentBlock, zeroRoomExtrasBlock), "utf8");
}
