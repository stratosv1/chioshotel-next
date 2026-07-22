const fs = require("node:fs");
const path = require("node:path");

const salesFile = path.join(process.cwd(), "components/ai/ConversationalRoomSalesEnhanced.tsx");
const polishFile = path.join(process.cwd(), "components/ai/AiRoomModalPolish.tsx");
const pageFile = path.join(process.cwd(), "app/ai-assistant/page.tsx");

let sales = fs.readFileSync(salesFile, "utf8");
const polish = fs.readFileSync(polishFile, "utf8");
let page = fs.readFileSync(pageFile, "utf8");

sales = sales.replace('total:"Total final"', 'total:"Importe total"');
sales = sales.replace(
  'alt={detail.name} fill sizes="(max-width:640px) 100vw, 720px" className="object-contain bg-stone-200"',
  'alt={detail.name} fill sizes="(max-width:640px) 100vw, 720px" className="object-cover"',
);

page = page.replace('import { AiFlowSafetyNet } from "@/components/ai/AiFlowSafetyNet";\n', "");
page = page.replace(/\s*<AiFlowSafetyNet\s*\/>\s*/g, "\n      ");

if (!sales.includes('total:"Importe total"')) {
  throw new Error("Spanish final-total label was not localized");
}
if (!sales.includes('alt={detail.name} fill sizes="(max-width:640px) 100vw, 720px" className="object-cover"')) {
  throw new Error("Base room detail image is not object-cover");
}

const hasCoverClass = polish.includes('heroImage.classList.add("object-cover"');
const hasImportantCover = polish.includes('heroImage.style.setProperty("object-fit", "cover", "important");');
if (!hasCoverClass || !hasImportantCover) {
  throw new Error("Enhanced room detail image is not configured to cover its frame");
}
if (!polish.includes('panel.style.setProperty("max-height", "720px", "important");')) {
  throw new Error("Desktop room detail modal is not height-limited");
}
if (!polish.includes('panel.style.setProperty("max-width", "36rem", "important");')) {
  throw new Error("Desktop room detail modal is not width-limited");
}
if (page.includes("AiFlowSafetyNet")) {
  throw new Error("18-second AI safety popup is still mounted");
}

fs.writeFileSync(salesFile, sales);
fs.writeFileSync(pageFile, page);
console.log("AI Room Finder presentation fixed: compact desktop modal, covered photos, localized totals");
