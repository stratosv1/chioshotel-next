const fs = require("node:fs");
const path = require("node:path");

const file = path.join(process.cwd(), "components/ai/AIRoomFinder.tsx");
let source = fs.readFileSync(file, "utf8");

if (!source.includes("recommendationRole?:")) {
  source = source.replace(
    "  saving: number;\n};",
    "  saving: number;\n  recommendationRole?: \"recommended\" | \"budget\" | \"comfort\" | \"alternative\";\n  recommendationTitle?: string;\n  recommendationReason?: string;\n};",
  );
}

source = source.replace(
  "${offerIndex === 0 ? t.best : t.live}",
  "${offer.recommendationTitle || (offerIndex === 0 ? t.best : t.live)}",
);

const marker = '<div className="mt-3 flex flex-wrap gap-1.5"><span className="rounded-md border border-[#ead6b5] bg-[#fff5df] px-2 py-1 text-[10px] font-bold text-[#8a5a19]">{t.live}</span>';
if (source.includes(marker) && !source.includes("offer.recommendationReason ?")) {
  source = source.replace(
    marker,
    '{offer.recommendationReason ? <p className="mt-3 line-clamp-3 text-[12px] font-medium leading-5 text-stone-700">{offer.recommendationReason}</p> : null}<div className="mt-3 flex flex-wrap gap-1.5"><span className="rounded-md border border-[#ead6b5] bg-[#fff5df] px-2 py-1 text-[10px] font-bold text-[#8a5a19]">{t.live}</span>',
  );
}

fs.writeFileSync(file, source);
console.log("AI sales recommendation labels and reasons are visible in room cards");
