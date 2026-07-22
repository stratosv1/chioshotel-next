const fs = require("node:fs");
const path = require("node:path");

const salesFile = path.join(process.cwd(), "components/ai/ConversationalRoomSalesEnhanced.tsx");
const polishFile = path.join(process.cwd(), "components/ai/AiRoomModalPolish.tsx");
const pageFile = path.join(process.cwd(), "app/ai-assistant/page.tsx");

let sales = fs.readFileSync(salesFile, "utf8");
let polish = fs.readFileSync(polishFile, "utf8");
let page = fs.readFileSync(pageFile, "utf8");

sales = sales.replace('total:"Total final"', 'total:"Importe total"');
sales = sales.replace(
  'alt={detail.name} fill sizes="(max-width:640px) 100vw, 720px" className="object-cover"',
  'alt={detail.name} fill sizes="(max-width:640px) 100vw, 720px" className="object-contain bg-stone-200"',
);

polish = polish.replace('heroImage.classList.add("object-cover");', 'heroImage.classList.add("object-contain");');
polish = polish.replace('heroImage.style.objectFit = "cover";', 'heroImage.style.objectFit = "contain";');

page = page.replace('import { AiFlowSafetyNet } from "@/components/ai/AiFlowSafetyNet";\n', "");
page = page.replace(/\s*<AiFlowSafetyNet\s*\/>\s*/g, "\n      ");

if (!sales.includes('total:"Importe total"')) {
  throw new Error("Spanish final-total label was not localized");
}
if (!sales.includes('alt={detail.name} fill sizes="(max-width:640px) 100vw, 720px" className="object-contain bg-stone-200"')) {
  throw new Error("Base room detail image was not changed to object-contain");
}
if (!polish.includes('heroImage.classList.add("object-contain");')) {
  throw new Error("Enhanced room detail image was not changed to object-contain");
}

const hasDirectContain = polish.includes('heroImage.style.objectFit = "contain";');
const hasImportantContain = polish.includes('heroImage.style.setProperty("object-fit", "contain", "important");');
if (!hasDirectContain && !hasImportantContain) {
  throw new Error("Enhanced room detail inline object-fit is not contain");
}
if (page.includes("AiFlowSafetyNet")) {
  throw new Error("18-second AI safety popup is still mounted");
}

fs.writeFileSync(salesFile, sales);
fs.writeFileSync(polishFile, polish);
fs.writeFileSync(pageFile, page);
console.log("AI Room Finder presentation fixed: no timeout popup, full photos, localized totals");
