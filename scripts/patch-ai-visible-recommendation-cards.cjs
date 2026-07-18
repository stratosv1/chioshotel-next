const fs = require("node:fs");
const path = require("node:path");

const file = path.join(process.cwd(), "components/ai/AIRoomFinder.tsx");
let source = fs.readFileSync(file, "utf8");

if (!source.includes("recommendationTitle?: string")) {
  source = source.replace(
    "  saving: number;\n};",
    "  saving: number;\n  recommendationRole?: \"recommended\" | \"budget\" | \"comfort\" | \"alternative\";\n  recommendationTitle?: string;\n  recommendationReason?: string;\n};",
  );
}

const categoryLine = '<p className="mt-0.5 truncate text-[12px] font-bold text-[#b45309]">{offer.category}</p>';
const visibleBlock = `${categoryLine}{offer.recommendationTitle ? <div className="mt-2 rounded-xl border border-[#d9dfbf] bg-[#f5f8e9] px-3 py-2"><p className="text-[11px] font-black uppercase tracking-[0.08em] text-[#43551b]">{offer.recommendationRole === "recommended" ? "⭐ " : offer.recommendationRole === "budget" ? "💶 " : offer.recommendationRole === "comfort" ? "✨ " : ""}{offer.recommendationTitle}</p>{offer.recommendationReason ? <p className="mt-1 line-clamp-2 text-[11px] leading-4 text-stone-600">{offer.recommendationReason}</p> : null}</div> : null}`;

if (!source.includes('offer.recommendationTitle ? <div className="mt-2 rounded-xl')) {
  if (!source.includes(categoryLine)) {
    throw new Error("AI room card category line not found");
  }
  source = source.replace(categoryLine, visibleBlock);
}

if (!source.includes("recommendationTitle?: string") || !source.includes("offer.recommendationReason")) {
  throw new Error("Visible recommendation card UI was not applied");
}

fs.writeFileSync(file, source);
console.log("Added visible personalized recommendation labels to AI room cards");
