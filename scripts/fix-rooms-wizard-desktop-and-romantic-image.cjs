const fs = require('node:fs');

function replaceRequired(source, before, after, label) {
  if (!source.includes(before)) throw new Error(`Missing target: ${label}`);
  return source.replace(before, after);
}

const wizardFile = 'components/rooms/GreekRoomWizardTailwind.tsx';
let wizard = fs.readFileSync(wizardFile, 'utf8');

wizard = replaceRequired(
  wizard,
  'import { useMemo, useState, type FormEvent } from "react";',
  'import { useMemo, useRef, useState, type FormEvent } from "react";',
  'React useRef import',
);

wizard = replaceRequired(
  wizard,
  '  const [step, setStep] = useState(0);\n\n  const currentQuestion = questions[step];',
  '  const [step, setStep] = useState(0);\n  const resultsCarouselRef = useRef<HTMLDivElement>(null);\n\n  const currentQuestion = questions[step];',
  'results carousel ref',
);

wizard = replaceRequired(
  wizard,
  '  function handleLeadSubmit(event: FormEvent<HTMLFormElement>) {',
  '  function scrollResults(direction: -1 | 1) {\n    const carousel = resultsCarouselRef.current;\n    if (!carousel) return;\n    const card = carousel.querySelector<HTMLElement>("[data-room-result-card]");\n    const distance = (card?.offsetWidth || carousel.clientWidth * 0.8) + 16;\n    carousel.scrollBy({ left: direction * distance, behavior: "smooth" });\n  }\n\n  function handleLeadSubmit(event: FormEvent<HTMLFormElement>) {',
  'scroll results helper',
);

wizard = replaceRequired(
  wizard,
  '<section className="mx-auto mb-12 w-[min(780px,100%)] scroll-mt-20" id="room-wizard-app" aria-labelledby="greek-room-wizard-title">',
  '<section className="mx-auto mb-12 w-[min(1180px,100%)] scroll-mt-20" id="room-wizard-app" aria-labelledby="greek-room-wizard-title">',
  'desktop wizard width',
);

wizard = replaceRequired(
  wizard,
  '<span className="rounded-full bg-[#eef3e5] px-4 py-2 text-[11px] font-black uppercase tracking-[0.12em] text-[#3f4f2f]">Σύρετε →</span>',
  '<span className="rounded-full bg-[#eef3e5] px-4 py-2 text-[11px] font-black uppercase tracking-[0.12em] text-[#3f4f2f]"><span className="md:hidden">Σύρετε →</span><span className="hidden md:inline">Χρησιμοποιήστε τα βέλη</span></span>',
  'desktop navigation hint',
);

wizard = replaceRequired(
  wizard,
  '            <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">',
  '            <div className="relative">\n              <div\n                ref={resultsCarouselRef}\n                tabIndex={0}\n                aria-label="Προτεινόμενα δωμάτια"\n                onKeyDown={(event) => {\n                  if (event.key === "ArrowLeft") { event.preventDefault(); scrollResults(-1); }\n                  if (event.key === "ArrowRight") { event.preventDefault(); scrollResults(1); }\n                }}\n                className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-1 pb-5 scroll-smooth focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6f7f3f]/50 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:px-14"\n              >',
  'desktop carousel wrapper',
);

wizard = replaceRequired(
  wizard,
  '<article className="w-[86vw] max-w-[430px] flex-none snap-start rounded-[2rem] border border-[#6f7f3f]/20 bg-white p-5 shadow-xl shadow-stone-900/5 md:w-[560px] md:max-w-[560px] md:p-7" key={room.id}>',
  '<article data-room-result-card="true" className="w-[86vw] max-w-[430px] flex-none snap-start rounded-[2rem] border border-[#6f7f3f]/20 bg-white p-5 shadow-xl shadow-stone-900/5 md:w-[68%] md:max-w-[640px] md:p-7 lg:w-[calc(50%-0.5rem)] lg:max-w-none" key={room.id}>',
  'responsive result card width',
);

wizard = replaceRequired(
  wizard,
  '              })}\n            </div>\n            <button type="button" className="mt-2 w-full rounded-full border border-[#6f7f3f]/20 bg-[#eef3e5] px-6 py-4 text-sm font-black uppercase tracking-[0.12em] text-[#3f4f2f]"',
  '              })}\n              </div>\n              <button type="button" aria-label="Προηγούμενη πρόταση" title="Προηγούμενη πρόταση" onClick={() => scrollResults(-1)} className="absolute left-0 top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-[#6f7f3f]/25 bg-white/95 text-3xl font-light text-[#3f4f2f] shadow-xl backdrop-blur transition hover:scale-105 hover:bg-white active:scale-95 md:flex">‹</button>\n              <button type="button" aria-label="Επόμενη πρόταση" title="Επόμενη πρόταση" onClick={() => scrollResults(1)} className="absolute right-0 top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-[#6f7f3f]/25 bg-white/95 text-3xl font-light text-[#3f4f2f] shadow-xl backdrop-blur transition hover:scale-105 hover:bg-white active:scale-95 md:flex">›</button>\n            </div>\n            <button type="button" className="mt-2 w-full rounded-full border border-[#6f7f3f]/20 bg-[#eef3e5] px-6 py-4 text-sm font-black uppercase tracking-[0.12em] text-[#3f4f2f]"',
  'desktop carousel buttons and wrapper close',
);

fs.writeFileSync(wizardFile, wizard);

const romanticFile = 'content/romantic-stay.ts';
let romantic = fs.readFileSync(romanticFile, 'utf8');
romantic = replaceRequired(
  romantic,
  '  kambos: "/images/activities/kampos-chios.webp",',
  '  kambos: "/images/kampos/kambos-chios.jpg",',
  'romantic Kambos image path',
);
fs.writeFileSync(romanticFile, romantic);

console.log('Applied desktop Room Wizard and romantic image fixes.');
