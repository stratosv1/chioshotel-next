const fs = require("node:fs");
const path = require("node:path");

const file = path.join(process.cwd(), "components/ai/AIRoomFinder.tsx");
let source = fs.readFileSync(file, "utf8");

const anchor = '<section className="mx-auto flex min-h-[calc(100dvh-82px)] max-w-5xl flex-col px-4 sm:px-8">';
const replacement = `${anchor}<div className="mt-4 rounded-2xl border border-emerald-300 bg-emerald-50 px-4 py-3 text-center text-sm font-bold text-emerald-900 shadow-sm">ΝΕΟ PREVIEW — Προσωποποιημένες προτάσεις ενεργές</div>`;

if (!source.includes("ΝΕΟ PREVIEW — Προσωποποιημένες προτάσεις ενεργές")) {
  if (!source.includes(anchor)) throw new Error("AI assistant section anchor not found");
  source = source.replace(anchor, replacement);
}

fs.writeFileSync(file, source);
console.log("Added visible AI preview proof banner");
