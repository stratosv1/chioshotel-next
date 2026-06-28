const fs = require("fs");

const p = "app/chios/chios-villages/[slug]/page.tsx";
let s = fs.readFileSync(p, "utf8");

const oldImport = 'import { VillageDetailPage } from "@/components/chios/VillageDetailPage";';
const newImport = 'import { VillageDetailPageTailwind } from "@/components/chios/VillageDetailPageTailwind";';

const oldUse = "<VillageDetailPage village={village} />";
const newUse = "<VillageDetailPageTailwind village={village} />";

if (!s.includes(oldImport)) {
  console.error("Old import not found. Maybe it was already changed?");
  process.exit(1);
}

if (!s.includes(oldUse)) {
  console.error("Old component usage not found. Maybe it was already changed?");
  process.exit(1);
}

s = s.replace(oldImport, newImport);
s = s.replace(oldUse, newUse);

fs.writeFileSync(p, s, "utf8");

console.log("OK: village detail route now uses VillageDetailPageTailwind");
