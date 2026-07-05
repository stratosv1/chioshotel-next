const fs = require("fs");

const file = "components/pre-arrival/PreArrivalPage.tsx";
const backup = `${file}.backup-ui-fix-${new Date().toISOString().replace(/[-:T.Z]/g, "").slice(0, 14)}`;

let s = fs.readFileSync(file, "utf8");
fs.writeFileSync(backup, s, "utf8");

const replacements = [
  [
    'className="mt-6 max-w-[11ch] text-[44px] font-black leading-[0.94] tracking-[-0.065em] text-slate-950 md:text-[clamp(58px,7vw,92px)]"',
    'className="mt-6 max-w-[12ch] text-[38px] font-black leading-[0.96] tracking-[-0.055em] text-slate-950 md:text-[clamp(44px,5vw,68px)]"'
  ],
  [
    'className="relative overflow-hidden px-4 pb-16 pt-12 md:px-6 md:pb-24 md:pt-20"',
    'className="relative overflow-hidden px-4 pb-12 pt-10 md:px-6 md:pb-18 md:pt-14"'
  ],
  [
    'className="inline-flex min-h-[54px] items-center justify-center rounded-full bg-slate-950 px-7 text-sm font-black uppercase tracking-[0.08em] text-white shadow-xl transition hover:-translate-y-0.5 hover:bg-teal-900"',
    'className="inline-flex min-h-[54px] items-center justify-center rounded-full bg-teal-800 px-7 text-sm font-black uppercase tracking-[0.08em] text-white shadow-xl transition hover:-translate-y-0.5 hover:bg-teal-900"'
  ],
  [
    'className="inline-flex min-h-[54px] items-center justify-center rounded-full bg-slate-950 px-6 text-center text-sm font-black uppercase tracking-[0.08em] text-white transition hover:bg-teal-900"',
    'className="inline-flex min-h-[54px] items-center justify-center rounded-full bg-teal-800 px-6 text-center text-sm font-black uppercase tracking-[0.08em] text-white transition hover:bg-teal-900"'
  ],
  [
    '? "bg-slate-950 text-white"',
    '? "bg-teal-800 text-white"'
  ],
  [
    '{preArrivalContact.phoneDisplay}',
    '{`${copy.help.phone}: ${preArrivalContact.phoneDisplay}`}'
  ],
  [
    'className="rounded-[34px] bg-slate-950 p-7 text-white shadow-xl md:p-9"',
    'className="rounded-[34px] bg-slate-950 p-7 text-white shadow-xl md:p-9"'
  ]
];

for (const [from, to] of replacements) {
  if (!s.includes(from)) {
    console.warn(`Missing pattern: ${from.slice(0, 80)}...`);
  }
  s = s.replaceAll(from, to);
}

fs.writeFileSync(file, s, "utf8");
console.log(`Patched ${file}`);
console.log(`Backup: ${backup}`);
