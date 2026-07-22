const fs = require("node:fs");
const path = require("node:path");

const salesFile = path.join(process.cwd(), "components/ai/ConversationalRoomSalesEnhanced.tsx");
const enhancerFile = path.join(process.cwd(), "components/ai/AiRoomDetailsEnhancer.tsx");
const polishFile = path.join(process.cwd(), "components/ai/AiRoomModalPolish.tsx");
const pageFile = path.join(process.cwd(), "app/ai-assistant/page.tsx");

let sales = fs.readFileSync(salesFile, "utf8");
const enhancer = fs.readFileSync(enhancerFile, "utf8");
let polish = fs.readFileSync(polishFile, "utf8");
let page = fs.readFileSync(pageFile, "utf8");

sales = sales.replace('total:"Total final"', 'total:"Importe total"');
sales = sales.replace(
  'alt={detail.name} fill sizes="(max-width:640px) 100vw, 720px" className="object-contain bg-stone-200"',
  'alt={detail.name} fill sizes="(max-width:640px) 100vw, 720px" className="object-cover"',
);

polish = polish.replace("  forceCoveredHeroPhoto(modal);\n", "");

page = page.replace('import { AiFlowSafetyNet } from "@/components/ai/AiFlowSafetyNet";\n', "");
page = page.replace(/\s*<AiFlowSafetyNet\s*\/>\s*/g, "\n      ");

if (!sales.includes('total:"Importe total"')) {
  throw new Error("Spanish final-total label was not localized");
}
if (!sales.includes('alt={detail.name} fill sizes="(max-width:640px) 100vw, 720px" className="object-cover"')) {
  throw new Error("Base room detail image is not object-cover");
}

const enhancerRequirements = [
  "sm:h-auto sm:max-h-[90dvh] sm:max-w-xl",
  'data-ai-detail-hero="intrinsic"',
  'data-ai-detail-hero-image="true"',
  'className="block h-auto w-full"',
  'data-ai-detail-saving="prominent"',
  "✓ {t.saving}: {room.saving}",
  'data-ai-detail-thumbnails="spread"',
  'gridTemplateColumns:`repeat(${room.images.length}, minmax(0, 1fr))`',
];

for (const token of enhancerRequirements) {
  if (!enhancer.includes(token)) {
    throw new Error(`Actual room detail component requirement missing: ${token}`);
  }
}

if (enhancer.includes('data-ai-detail-hero="blurred-contain"')) {
  throw new Error("Actual room detail component still uses a fixed-height blurred hero");
}
if (enhancer.includes('data-ai-detail-hero-background="true"')) {
  throw new Error("Actual room detail component still renders a cropped background photo");
}
if (enhancer.includes('data-ai-detail-thumbnails="white"')) {
  throw new Error("Actual room detail component still uses the old thumbnail row");
}
if (enhancer.includes('className="block max-h-full max-w-full object-contain"')) {
  throw new Error("Actual room detail component still uses the old fixed-height hero image layout");
}

if (polish.includes("forceCoveredHeroPhoto(modal);")) {
  throw new Error("Room modal polish is still overriding the intrinsic hero photo");
}
if (!polish.includes('panel.style.setProperty("max-width", "36rem", "important");')) {
  throw new Error("Desktop room detail modal width is not limited");
}
if (page.includes("AiFlowSafetyNet")) {
  throw new Error("18-second AI safety popup is still mounted");
}

fs.writeFileSync(salesFile, sales);
fs.writeFileSync(polishFile, polish);
fs.writeFileSync(pageFile, page);
console.log("AI Room Finder presentation fixed: compact modal, intrinsic uncropped photo, prominent savings and full-width thumbnails");
