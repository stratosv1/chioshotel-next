const fs = require("node:fs");
const path = require("node:path");

const target = path.join(process.cwd(), "components/ai/ConversationalRoomSalesEnhanced.tsx");
let source = fs.readFileSync(target, "utf8");

const marker = 'const BREAKFAST_IMAGE = "/images/welcome/voulamandis-breakfast.jpg";';
const labels = `const BACK_LABELS: Record<Language, string> = {
 el: "Επιστροφή στο site", en: "Back to site", de: "Zurück zur Website", fr: "Retour au site", it: "Torna al sito", es: "Volver al sitio", tr: "Siteye dön",
};
function homeHref(language: Language) { return language === "en" ? "/" : \`/${language}/\`; }
`;

if (!source.includes("const BACK_LABELS:")) {
  if (!source.includes(marker)) throw new Error("Breakfast marker not found");
  source = source.replace(marker, `${labels}\n${marker}`);
}

const oldHeader = `    <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3.5">
     <div className="relative h-11 w-11 overflow-hidden rounded-full ring-1 ring-stone-200"><Image src="/images/welcome/voulamandis-welcome-hero.webp" alt="Voulamandis House" fill sizes="44px" className="object-cover"/></div>
     <div className="min-w-0 flex-1"><h1 className="truncate text-[17px] font-semibold">Voulamandis House</h1><div className="mt-0.5 flex items-center gap-1.5 text-xs text-stone-500"><span className="h-2 w-2 rounded-full bg-emerald-500"/>AI Room Finder · Live availability</div></div>
     {step!=="language"?<button onClick={reset} className="rounded-full border border-stone-300 bg-white px-3 py-2 text-xs font-semibold shadow-sm">↻</button>:null}
    </div>`;

const newHeader = `    <div className="mx-auto flex max-w-3xl items-center gap-2 px-3 py-3 sm:gap-3 sm:px-4 sm:py-3.5">
     <a href={homeHref(language)} aria-label={BACK_LABELS[language]} title={BACK_LABELS[language]} className="inline-flex h-10 shrink-0 items-center gap-2 rounded-full border border-stone-300 bg-white px-3 text-sm font-semibold text-stone-700 shadow-sm transition hover:bg-stone-50 active:scale-[.98] sm:h-11 sm:px-4"><span aria-hidden="true" className="text-lg leading-none">←</span><span className="hidden sm:inline">{BACK_LABELS[language]}</span></a>
     <a href={homeHref(language)} aria-label="Voulamandis House" className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full ring-1 ring-stone-200 sm:h-11 sm:w-11"><Image src="/images/welcome/voulamandis-welcome-hero.webp" alt="Voulamandis House" fill sizes="44px" className="object-cover"/></a>
     <div className="min-w-0 flex-1"><h1 className="truncate text-[15px] font-semibold sm:text-[17px]">Voulamandis House</h1><div className="mt-0.5 flex items-center gap-1.5 truncate text-[11px] text-stone-500 sm:text-xs"><span className="h-2 w-2 shrink-0 rounded-full bg-emerald-500"/>AI Room Finder · Live availability</div></div>
     {step!=="language"?<button onClick={reset} aria-label="Restart" className="rounded-full border border-stone-300 bg-white px-3 py-2 text-xs font-semibold shadow-sm">↻</button>:null}
    </div>`;

if (!source.includes(newHeader)) {
  if (!source.includes(oldHeader)) throw new Error("AI assistant header pattern not found");
  source = source.replace(oldHeader, newHeader);
}

fs.writeFileSync(target, source, "utf8");
console.log("Patched AI assistant back-to-site navigation");
