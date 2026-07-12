const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const scanRoots = ["content", "app"];

const preferredTitles = new Map([
  ["Chios for Beach Lovers", "Chios Beaches for Sea Lovers | Best Coastal Spots"],
  ["Economy Double Rooms in Chios", "Economy Double Rooms in Chios | Comfortable Stay"],
  ["Top Chios Beaches", "Best Beaches in Chios | Complete Island Guide"],
  ["Mesta Chios", "Mesta Village in Chios | Medieval Mastic Village"],
  ["Chios Holiday Quiz", "Chios Holiday Quiz | Find Your Ideal Island Experience"],
  ["Chios Museums Guide", "Museums in Chios | History, Culture & Mastic"],
  ["Family Apartments in Chios", "Family Apartments in Chios | Spacious Island Stay"],
  ["Chios Villages Guide", "Villages of Chios | Complete Island Guide"],
  ["Book Direct in Chios", "Rooms & Apartments in Chios | Book Direct"],
  ["Mastic Villages of Chios", "Mastic Villages of Chios | Culture & Scenic Routes"],
  ["Seaside Villages of Chios", "Seaside Villages of Chios | Coastal Guide & Routes"],
  ["Medieval Villages of Chios", "Medieval Villages of Chios | History & Castles"],
  ["Komi Beach Chios", "Komi Beach in Chios | Access, Facilities & Tips"],
  ["Koraes Library Chios", "Koraes Library in Chios | History & Visitor Guide"],
  ["Rocket War of Chios", "Chios Rocket War | Easter Tradition in Vrontados"],
  ["Chios Hiking Trails", "Hiking in Chios | Trails, Routes & Nature"],
  ["Sandy Beaches in Chios", "Sandy Beaches in Chios | Complete Beach Guide"],
  ["Sheltered Beaches in Chios", "Sheltered Beaches in Chios | Calm Water Guide"],
  ["Organized Beaches in Chios", "Organized Beaches in Chios | Facilities & Access"],
  ["Olympoi Chios", "Olympoi Village in Chios | Medieval Mastic Village"],
  ["Chios Maritime Museum", "Chios Maritime Museum | History & Visitor Guide"],
  ["Chios Byzantine Museum", "Chios Byzantine Museum | Art, History & Visitor Guide"],
]);

function listFiles(directory) {
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) return listFiles(fullPath);
    return entry.isFile() && /\.(?:ts|tsx)$/.test(fullPath) ? [fullPath] : [];
  });
}

let changedFiles = 0;
let changedTitles = 0;

for (const scanRoot of scanRoots) {
  for (const filePath of listFiles(path.join(root, scanRoot))) {
    const original = fs.readFileSync(filePath, "utf8");
    const next = original.replace(/seo\s*:\s*\{([\s\S]*?)\n\s*\}/g, (seoBlock) =>
      seoBlock.replace(/title\s*:\s*(["'`])([^"'`\r\n]+)\1/g, (match, quote, title) => {
        const preferred = preferredTitles.get(title.trim());
        if (!preferred || preferred === title) return match;
        changedTitles += 1;
        return `title: ${quote}${preferred}${quote}`;
      })
    );

    if (next !== original) {
      fs.writeFileSync(filePath, next, "utf8");
      changedFiles += 1;
      console.log(`[english-title] updated ${path.relative(root, filePath).replace(/\\/g, "/")}`);
    }
  }
}

console.log(`[english-title] ${changedTitles} English SEO titles improved in ${changedFiles} files`);
