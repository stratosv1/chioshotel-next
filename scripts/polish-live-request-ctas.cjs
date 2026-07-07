const fs = require("fs");

const file = "components/home/LiveDirectRequest.tsx";
let s = fs.readFileSync(file, "utf8");

s = s.replace(
  'className="px-4 py-8 md:px-8 md:py-16"',
  'className="px-4 py-8 md:px-8 md:pt-16 md:pb-8"'
);

s = s.replace(
  `<div className="mt-4 grid gap-3 pb-28 md:grid-cols-3 md:pb-0">
            <a href={smsHref} className="flex min-h-14 items-center justify-center rounded-2xl bg-[#17351f] px-5 text-center text-sm font-black uppercase tracking-[0.08em] text-white shadow-lg shadow-emerald-950/20 transition hover:-translate-y-0.5 hover:bg-[#224d2d]">Send SMS</a>
            <a href={requestHref} target="_blank" rel="noopener noreferrer" className="flex min-h-14 items-center justify-center rounded-2xl border border-emerald-700/30 bg-white px-5 text-center text-sm font-black uppercase tracking-[0.08em] text-emerald-800 transition hover:bg-emerald-50">WhatsApp</a>
            <a href={CONTACT.phoneHref} className="flex min-h-14 items-center justify-center rounded-2xl border border-stone-300 bg-white px-5 text-center text-sm font-black uppercase tracking-[0.08em] text-stone-800 transition hover:border-amber-700 hover:bg-amber-50">Call +30 22710 31733</a>
          </div>`,
  `<div className="mt-4 grid gap-3 pb-10 md:grid-cols-3 md:pb-0">
            <a href={requestHref} target="_blank" rel="noopener noreferrer" className="flex min-h-14 items-center justify-center rounded-2xl bg-[#17351f] px-5 text-center text-sm font-black uppercase tracking-[0.08em] !text-white shadow-lg shadow-emerald-950/20 transition hover:-translate-y-0.5 hover:bg-[#224d2d]">WhatsApp</a>
            <a href={smsHref} className="flex min-h-14 items-center justify-center rounded-2xl border border-emerald-700/30 bg-white px-5 text-center text-sm font-black uppercase tracking-[0.08em] !text-emerald-800 transition hover:bg-emerald-50">Send SMS</a>
            <a href={CONTACT.phoneHref} className="flex min-h-14 items-center justify-center rounded-2xl border border-stone-300 bg-white px-5 text-center text-sm font-black uppercase tracking-[0.08em] !text-stone-800 transition hover:border-amber-700 hover:bg-amber-50">Call +30 22710 31733</a>
          </div>`
);

fs.writeFileSync(file, s);
console.log("Updated CTA priority and reduced Live Request bottom spacing.");
