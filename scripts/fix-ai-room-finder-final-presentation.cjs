const fs = require("node:fs");
const path = require("node:path");

const salesFile = path.join(process.cwd(), "components/ai/ConversationalRoomSalesEnhanced.tsx");
const enhancerFile = path.join(process.cwd(), "components/ai/AiRoomDetailsEnhancer.tsx");
const polishFile = path.join(process.cwd(), "components/ai/AiRoomModalPolish.tsx");
const pageFile = path.join(process.cwd(), "app/ai-assistant/page.tsx");

let sales = fs.readFileSync(salesFile, "utf8");
let enhancer = fs.readFileSync(enhancerFile, "utf8");
const polish = fs.readFileSync(polishFile, "utf8");
let page = fs.readFileSync(pageFile, "utf8");

sales = sales.replace('total:"Total final"', 'total:"Importe total"');
sales = sales.replace(
  'alt={detail.name} fill sizes="(max-width:640px) 100vw, 720px" className="object-contain bg-stone-200"',
  'alt={detail.name} fill sizes="(max-width:640px) 100vw, 720px" className="object-cover"',
);

enhancer = enhancer.replace(
  'className="flex h-[94dvh] max-h-[820px] w-full max-w-2xl flex-col overflow-hidden rounded-t-[28px] bg-white shadow-2xl sm:rounded-[28px]"',
  'className="flex h-[94dvh] w-full max-w-2xl flex-col overflow-hidden rounded-t-[28px] bg-white shadow-2xl sm:h-auto sm:max-h-[720px] sm:max-w-xl sm:rounded-[28px]"',
);
enhancer = enhancer.replace(
  '<div className="relative flex w-full items-center justify-center overflow-hidden bg-stone-950" style={{height:"clamp(210px,34dvh,300px)"}}><img src={image} alt={`${room.name} ${t.photo.toLowerCase()} ${photo+1}`} className="block max-h-full max-w-full object-contain" style={{width:"auto",height:"auto",objectFit:"contain",objectPosition:"center center"}} draggable={false}/></div>',
  '<div className="relative h-[38dvh] w-full overflow-hidden bg-stone-950 sm:h-[300px]"><img src={image} alt={`${room.name} ${t.photo.toLowerCase()} ${photo+1}`} className="absolute inset-0 h-full w-full object-cover" style={{objectPosition:"center center"}} draggable={false}/></div>',
);
enhancer = enhancer.replaceAll(
  'top-[30%] flex h-10 w-10 items-center',
  'top-1/2 flex h-10 w-10 -translate-y-1/2 items-center',
);

page = page.replace('import { AiFlowSafetyNet } from "@/components/ai/AiFlowSafetyNet";\n', "");
page = page.replace(/\s*<AiFlowSafetyNet\s*\/>\s*/g, "\n      ");

if (!sales.includes('total:"Importe total"')) {
  throw new Error("Spanish final-total label was not localized");
}
if (!sales.includes('alt={detail.name} fill sizes="(max-width:640px) 100vw, 720px" className="object-cover"')) {
  throw new Error("Base room detail image is not object-cover");
}
if (!enhancer.includes('sm:h-auto sm:max-h-[720px] sm:max-w-xl')) {
  throw new Error("Actual room detail component is still using the oversized desktop height");
}
if (!enhancer.includes('className="absolute inset-0 h-full w-full object-cover"')) {
  throw new Error("Actual room detail component image is not covering its frame");
}
if (enhancer.includes('className="block max-h-full max-w-full object-contain"')) {
  throw new Error("Actual room detail component still contains the old contained image");
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
fs.writeFileSync(enhancerFile, enhancer);
fs.writeFileSync(pageFile, page);
console.log("AI Room Finder presentation fixed in the actual detail component: compact desktop modal and covered photos");
