const fs = require("fs");
const path = require("path");

const root = process.cwd();
const files = [
  "content/schema.ts",
  "content/rooms-schema.ts",
  "content/room-detail-schema.ts",
  "content/deals-schema.ts",
  "content/find-your-room-schema.ts",
  "lib/structured-data.ts"
];

let changed = 0;

for (const rel of files) {
  const file = path.join(root, rel);

  if (!fs.existsSync(file)) {
    console.log("SKIP missing", rel);
    continue;
  }

  let text = fs.readFileSync(file, "utf8");
  const original = text;

  text = text.replaceAll('"@type": ["Accommodation", "HotelRoom"]', '"@type": "HotelRoom"');
  text = text.replaceAll("'@type': ['Accommodation', 'HotelRoom']", "'@type': 'HotelRoom'");

  if (text !== original) {
    fs.writeFileSync(file, text, "utf8");
    changed++;
    console.log("UPDATED", rel);
  }
}

console.log("");
console.log("Changed files:", changed);
