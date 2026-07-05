const fs = require("fs");

const file = "components/pre-arrival/PreArrivalPage.tsx";
const backup = `${file}.backup-polish-${new Date().toISOString().replace(/[-:T.Z]/g, "").slice(0, 14)}`;

let s = fs.readFileSync(file, "utf8");
fs.writeFileSync(backup, s, "utf8");

const replacements = [
  [
    'className="inline-flex min-h-[54px] items-center justify-center rounded-full bg-teal-800 px-7 text-sm font-black uppercase tracking-[0.08em] text-white shadow-xl transition hover:-translate-y-0.5 hover:bg-teal-900"',
    'className="inline-flex min-h-[54px] items-center justify-center rounded-full bg-teal-800 px-7 text-sm font-black uppercase tracking-[0.08em] !text-white shadow-xl transition hover:-translate-y-0.5 hover:bg-teal-900"'
  ],
  [
    'className="inline-flex min-h-[54px] items-center justify-center rounded-full border border-slate-200 bg-white px-7 text-sm font-black uppercase tracking-[0.08em] text-slate-950 shadow-sm transition hover:-translate-y-0.5"',
    'className="inline-flex min-h-[54px] items-center justify-center rounded-full border border-slate-200 bg-white px-7 text-sm font-black uppercase tracking-[0.08em] !text-slate-950 shadow-sm transition hover:-translate-y-0.5"'
  ],
  [
    'className="inline-flex min-h-[58px] items-center justify-center rounded-full bg-teal-800 px-7 text-center text-sm font-black uppercase tracking-[0.08em] text-white shadow-xl transition hover:bg-teal-900"',
    'className="inline-flex min-h-[58px] items-center justify-center rounded-full bg-teal-800 px-7 text-center text-sm font-black uppercase tracking-[0.08em] !text-white shadow-xl transition hover:bg-teal-900"'
  ],
  [
    'className="inline-flex min-h-[54px] items-center justify-center rounded-full bg-slate-950 px-6 text-center text-sm font-black uppercase tracking-[0.08em] text-white transition hover:bg-teal-900"',
    'className="inline-flex min-h-[54px] items-center justify-center rounded-full bg-teal-800 px-6 text-center text-sm font-black uppercase tracking-[0.08em] !text-white transition hover:bg-teal-900"'
  ],
  [
    'className="inline-flex min-h-[54px] items-center justify-center rounded-full border border-slate-200 bg-white px-6 text-center text-sm font-black uppercase tracking-[0.08em] text-slate-950 transition hover:bg-slate-50"',
    'className="inline-flex min-h-[54px] items-center justify-center rounded-full border border-slate-200 bg-white px-6 text-center text-sm font-black uppercase tracking-[0.08em] !text-slate-950 transition hover:bg-slate-50"'
  ],
  [
    'className="inline-flex min-h-[54px] items-center justify-center rounded-full bg-white px-6 text-sm font-black uppercase tracking-[0.08em] text-slate-950"',
    'className="inline-flex min-h-[54px] items-center justify-center rounded-full bg-white px-6 text-sm font-black uppercase tracking-[0.08em] !text-slate-950"'
  ],
  [
    'className="inline-flex min-h-[54px] items-center justify-center rounded-full border border-white/20 px-6 text-sm font-black uppercase tracking-[0.08em] text-white"',
    'className="inline-flex min-h-[54px] items-center justify-center rounded-full border border-white/20 px-6 text-sm font-black uppercase tracking-[0.08em] !text-white"'
  ],
  [
    '? "bg-teal-800 text-white"',
    '? "bg-teal-800 !text-white"'
  ],
  [
    ': "bg-slate-100 text-slate-950 hover:bg-slate-200"',
    ': "bg-slate-100 !text-slate-950 hover:bg-slate-200"'
  ],
  [
    'className="mt-6 max-w-[13ch] text-[38px] font-black leading-[0.96] tracking-[-0.055em] md:text-[clamp(44px,5vw,68px)]"',
    'className="mt-6 max-w-[14ch] text-[34px] font-black leading-[0.98] tracking-[-0.05em] md:text-[clamp(40px,4.4vw,58px)]"'
  ],
  [
    'className="mt-4 text-4xl font-black leading-none tracking-[-0.055em] md:text-6xl"',
    'className="mt-4 text-3xl font-black leading-[1.02] tracking-[-0.05em] md:text-5xl"'
  ],
  [
    'className="px-4 py-10 md:px-6 md:py-16"',
    'className="px-4 py-8 md:px-6 md:py-12"'
  ]
];

for (const [from, to] of replacements) {
  if (!s.includes(from)) {
    console.warn("Missing pattern:", from.slice(0, 100));
  }
  s = s.replaceAll(from, to);
}

fs.writeFileSync(file, s, "utf8");
console.log("Patched:", file);
console.log("Backup:", backup);
