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
  "max-h-[calc(100dvh-0.5rem)]",
  "overflow-y-auto",
  "sm:max-h-[90dvh] sm:max-w-xl",
  'data-ai-detail-hero="intrinsic"',
  'data-ai-detail-hero-image="true"',
  'className="block h-auto w-full"',
  'data-ai-detail-saving="prominent"',
  "✓ {t.saving}: {room.saving}",
  'data-ai-detail-thumbnails="spread"',
  'gridTemplateColumns:`repeat(${room.images.length}, minmax(0, 1fr))`',
  'data-ai-detail-content="natural"',
  "pb-[calc(0.75rem+env(safe-area-inset-bottom))]",
  'data-ai-detail-action="inline"',
  'className="pt-3"',
];

for (const token of enhancerRequirements) {
  if (!enhancer.includes(token)) {
    throw new Error(`Actual room detail component requirement missing: ${token}`);
  }
}

const forbiddenEnhancerTokens = [
  'data-ai-detail-hero="blurred-contain"',
  'data-ai-detail-hero-background="true"',
  'data-ai-detail-thumbnails="white"',
  'className="block max-h-full max-w-full object-contain"',
  'h-[94dvh]',
  'flex min-h-0 flex-1 flex-col',
  'className="mt-auto pt-2"',
  'className="mt-2 w-full rounded-xl bg-[#ff385c]',
];
for (const token of forbiddenEnhancerTokens) {
  if (enhancer.includes(token)) {
    throw new Error(`Actual room detail component still uses legacy mobile spacing: ${token}`);
  }
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
console.log("AI Room Finder presentation fixed: natural mobile height, inline CTA, intrinsic uncropped photo, prominent savings and full-width thumbnails");
