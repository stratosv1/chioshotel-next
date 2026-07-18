const fs = require("node:fs");
const path = require("node:path");

const file = path.join(process.cwd(), "components/ai/AIRoomFinder.tsx");
let source = fs.readFileSync(file, "utf8");

source = source.replace(
  'className="relative flex h-[calc(100dvh-0.75rem)] w-full max-w-3xl flex-col overflow-hidden rounded-t-[2rem] bg-[#fffdf9] shadow-2xl sm:h-auto sm:max-h-[94dvh] sm:rounded-[2rem]"',
  'className="relative flex h-[100dvh] w-full max-w-3xl flex-col overflow-hidden rounded-none bg-[#fffdf9] shadow-2xl sm:h-auto sm:max-h-[94dvh] sm:rounded-[2rem]"',
);

source = source.replace(
  'className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-[calc(env(safe-area-inset-bottom)+1rem)] pt-2 touch-pan-y sm:px-5 sm:pt-5"',
  'className="min-h-0 flex-1 overflow-hidden px-3 pb-[calc(env(safe-area-inset-bottom)+0.5rem)] pt-1 sm:overflow-y-auto sm:px-5 sm:pt-5"',
);

source = source.replace(
  'className="relative overflow-hidden rounded-[1.75rem] bg-stone-100 ring-1 ring-stone-200/70"',
  'className="relative max-h-[29dvh] overflow-hidden rounded-[1.5rem] bg-stone-100 ring-1 ring-stone-200/70 sm:max-h-none sm:rounded-[1.75rem]"',
);

source = source.replace('className="px-3 pb-2 pt-5 sm:px-4"', 'className="px-2 pb-1 pt-3 sm:px-4 sm:pt-5"');
source = source.replace('className="text-[2rem] font-black leading-[1.05]', 'className="text-[1.75rem] font-black leading-[1.05] sm:text-[2rem]');
source = source.replace('className="mt-2 text-base font-semibold text-[#9a5b22]"', 'className="mt-1 text-sm font-semibold text-[#9a5b22] sm:mt-2 sm:text-base"');
source = source.replace('className="mt-5 grid grid-cols-3 gap-2.5"', 'className="mt-3 grid grid-cols-3 gap-2 sm:mt-5 sm:gap-2.5"');
source = source.replaceAll('className="flex min-h-20 items-center justify-center gap-2', 'className="flex min-h-16 items-center justify-center gap-1.5 sm:min-h-20 sm:gap-2');
source = source.replace('className="mt-4 flex items-center gap-3 rounded-2xl', 'className="mt-3 flex items-center gap-2 rounded-2xl sm:mt-4 sm:gap-3');
source = source.replace('className="mt-5"', 'className="mt-3 sm:mt-5"');
source = source.replace('className="text-[2.6rem] font-black', 'className="text-[2.15rem] font-black sm:text-[2.6rem]');
source = source.replace('className="mt-2 text-base text-stone-700"', 'className="mt-1 text-sm text-stone-700 sm:mt-2 sm:text-base"');
source = source.replace('className="mt-4 flex items-center gap-3 text-base', 'className="mt-2 flex items-center gap-2 text-sm sm:mt-4 sm:gap-3 sm:text-base');

source = source.replace(
  /<button onClick=\{\(\) => openRequest\(activeOffer\)\} className="mt-5 w-full rounded-\[1\.4rem\][\s\S]*?\{t\.interestedRoom\}<\/button>\s*<div className="mt-3"><a href=\{whatsappHref\}[\s\S]*?\{t\.whatsapp\}<\/a><\/div>/,
  '<div className="mt-3 grid grid-cols-2 gap-2 sm:mt-5 sm:gap-3"><button onClick={() => openRequest(activeOffer)} className="flex min-h-14 items-center justify-center rounded-[1.25rem] bg-[#435f12] px-3 py-3 text-center text-sm font-semibold leading-tight text-white shadow-[0_12px_26px_rgba(67,95,18,0.20)] sm:text-base">{t.interestedRoom}</button><a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="flex min-h-14 items-center justify-center gap-2 rounded-[1.25rem] border border-[#d8d1c3] bg-white px-3 py-3 text-sm font-semibold text-stone-900 sm:text-base"><WhatsappIcon className="h-6 w-6 text-[#17944b]" />{t.whatsapp}</a></div>',
);

if (!source.includes('grid grid-cols-2 gap-2 sm:mt-5')) {
  throw new Error("Compact side-by-side CTA layout was not applied");
}
if (!source.includes('overflow-hidden px-3')) {
  throw new Error("No-scroll mobile modal layout was not applied");
}

fs.writeFileSync(file, source);
console.log("Applied compact no-scroll mobile room modal with side-by-side CTAs");
