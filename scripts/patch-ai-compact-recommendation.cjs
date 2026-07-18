const fs = require("node:fs");
const path = require("node:path");

const file = path.join(process.cwd(), "components/ai/AIRoomFinder.tsx");
let source = fs.readFileSync(file, "utf8");

const marker = "{message.content}</div></div>{message.offers?.length ?";
const replacement = `{message.offers?.length ? (() => {\n  const recommended = message.offers.find((offer) => offer.recommendationRole === \"recommended\") || message.offers[0];\n  const comfort = message.offers.find((offer) => offer.recommendationRole === \"comfort\");\n  const comfortDifference = comfort ? Math.max(0, comfort.directTotal - recommended.directTotal) : 0;\n  return <div className=\"min-w-0\">\n    <div className=\"flex items-center gap-2\"><span className=\"text-base\">⭐</span><span className=\"text-[11px] font-extrabold uppercase tracking-[0.14em] text-emerald-700\">{language === \"el\" ? \"Η πρότασή μου\" : \"My recommendation\"}</span></div>\n    <div className=\"mt-2 flex flex-wrap items-end justify-between gap-3\"><div><h2 className=\"text-xl font-black leading-tight text-stone-950\">{recommended.name}</h2><p className=\"mt-1 max-w-xl text-sm leading-5 text-stone-600\">{recommended.recommendationReason || (language === \"el\" ? \"Η καλύτερη ισορροπία τιμής και άνεσης για τη διαμονή σας.\" : \"The best balance of price and comfort for your stay.\")}</p></div><div className=\"shrink-0 text-right\"><div className=\"text-2xl font-black text-stone-950\">{money(recommended.directTotal)}</div><div className=\"text-xs font-bold text-emerald-700\">{language === \"el\" ? \"συνολικά\" : \"total\"}</div></div></div>\n    <div className=\"mt-3 flex flex-wrap gap-2\">{cardPills(recommended).slice(0, 3).map((pill) => <span key={pill} className=\"rounded-full border border-stone-200 bg-stone-50 px-2.5 py-1 text-[11px] font-semibold text-stone-700\">{pill}</span>)}</div>\n    {recommended.saving > 0 ? <div className=\"mt-3 inline-flex rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-extrabold text-emerald-800\">💶 {language === \"el\" ? \"Εξοικονομείτε\" : \"You save\"} {money(recommended.saving)}</div> : null}\n    {comfort ? <button type=\"button\" onClick={() => setActiveOffer(comfort)} className=\"mt-4 flex w-full items-center justify-between gap-3 rounded-2xl border border-amber-200 bg-amber-50/70 px-3.5 py-3 text-left transition hover:bg-amber-50\"><div><div className=\"text-[11px] font-extrabold uppercase tracking-[0.12em] text-amber-800\">✨ {language === \"el\" ? \"Περισσότερη άνεση\" : \"More comfort\"}</div><div className=\"mt-0.5 text-sm font-bold text-stone-900\">{comfort.name}</div></div><div className=\"shrink-0 text-right text-sm font-black text-stone-950\">{comfortDifference > 0 ? \"+\" + money(comfortDifference) : money(comfort.directTotal)}<div className=\"text-[10px] font-semibold text-stone-500\">{language === \"el\" ? \"συνολικά\" : \"total\"}</div></div></button> : null}\n  </div>;\n})() : message.content}</div></div>{message.offers?.length ?`;

if (!source.includes("My recommendation") && source.includes(marker)) {
  source = source.replace(marker, replacement);
}

source = source.replace(
  'className={`max-w-[92%] rounded-2xl px-4 py-3 text-[15px] leading-6 sm:max-w-[75%] ${message.role === "user" ? "bg-stone-950 text-white" : "border bg-white shadow-sm"}`}',
  'className={`${message.offers?.length ? "w-full max-w-3xl" : "max-w-[92%] sm:max-w-[75%]"} rounded-2xl px-4 py-3 text-[15px] leading-6 ${message.role === "user" ? "bg-stone-950 text-white" : "border bg-white shadow-sm"}`}',
);

source = source.replace(/\s*<button type="button" onClick=\{\(\) => setActiveOffer\(recommended\)\}[\s\S]*?View recommendation\\"\}<\\\/button>/, "");

if (!source.includes("My recommendation")) throw new Error("Compact recommendation block was not applied");
if (!source.includes("comfortDifference")) throw new Error("Comfort comparison was not applied");
if (source.includes("View recommendation")) throw new Error("Recommendation CTA was not removed");

fs.writeFileSync(file, source);
console.log("Applied compact AI recommendation layout without redundant CTA");
