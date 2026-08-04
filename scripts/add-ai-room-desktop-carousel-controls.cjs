const fs = require('node:fs');

const file = 'components/ai/AiRoomChatPreview.tsx';
let source = fs.readFileSync(file, 'utf8');

function replaceRequired(before, after, label) {
  if (!source.includes(before)) throw new Error(`Missing target: ${label}`);
  source = source.replace(before, after);
}

const shortSelect = 'const SHORT_SELECT: Record<Language, string> = { el: "Επιλογή", en: "Select", de: "Wählen", fr: "Choisir", it: "Scegli", es: "Elegir", tr: "Seç" };';
replaceRequired(
  shortSelect,
  `${shortSelect}\nconst CAROUSEL_PREVIOUS: Record<Language, string> = { el: "Προηγούμενο δωμάτιο", en: "Previous room", de: "Vorheriges Zimmer", fr: "Chambre précédente", it: "Camera precedente", es: "Habitación anterior", tr: "Önceki oda" };\nconst CAROUSEL_NEXT: Record<Language, string> = { el: "Επόμενο δωμάτιο", en: "Next room", de: "Nächstes Zimmer", fr: "Chambre suivante", it: "Camera successiva", es: "Habitación siguiente", tr: "Sonraki oda" };`,
  'localized desktop carousel labels',
);

replaceRequired(
  '              <section className="ai-message-in -mx-3 sm:mx-0 sm:ml-10">',
  '              <section className="ai-message-in relative -mx-3 sm:mx-0 sm:ml-10">',
  'carousel section positioning',
);

replaceRequired(
  `                <div\n                  ref={carouselRef}\n                  data-ai-room-carousel="true"\n                  onScroll={event => {`,
  `                <div className="relative">\n                  <div\n                    ref={carouselRef}\n                    id="ai-room-carousel-track"\n                    data-ai-room-carousel="true"\n                    tabIndex={0}\n                    aria-label={copy.choose(activeGroup + 1, groups[activeGroup])}\n                    onKeyDown={event => {\n                      if (event.key === "ArrowLeft") {\n                        event.preventDefault();\n                        scrollToCard(cardIndex - 1);\n                      } else if (event.key === "ArrowRight") {\n                        event.preventDefault();\n                        scrollToCard(cardIndex + 1);\n                      }\n                    }}\n                    onScroll={event => {`,
  'carousel keyboard and wrapper',
);

replaceRequired(
  '                  className="ai-hide-scrollbar flex items-start snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain scroll-smooth px-3 pb-2 sm:px-0"',
  '                    className="ai-hide-scrollbar flex items-start snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain scroll-smooth px-3 pb-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#78845f]/60 sm:px-10 lg:px-12"',
  'desktop carousel gutters and focus state',
);

replaceRequired(
  `                </div>\n                {visibleOffers.length > 1 && <div className="mt-1 flex justify-center gap-1.5">{visibleOffers.map((_, index) => <button type="button" aria-label={copy.roomAria(index + 1)} key={index} onClick={() => scrollToCard(index)} className={"h-1.5 rounded-full transition-all " + (index === cardIndex ? "w-6 bg-[#66714f]" : "w-1.5 bg-[#cfc5b8]")} />)}</div>}`,
  `                  </div>\n                  {visibleOffers.length > 1 && (\n                    <>\n                      <button\n                        type="button"\n                        aria-label={CAROUSEL_PREVIOUS[language]}\n                        title={CAROUSEL_PREVIOUS[language]}\n                        aria-controls="ai-room-carousel-track"\n                        disabled={cardIndex <= 0}\n                        onClick={() => scrollToCard(cardIndex - 1)}\n                        className="absolute left-1 top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-[#ddd3c6] bg-white/95 text-3xl font-light text-[#4f493f] shadow-[0_8px_24px_rgba(55,45,30,.18)] backdrop-blur transition hover:scale-105 hover:bg-white active:scale-95 disabled:pointer-events-none disabled:opacity-0 sm:flex"\n                      >\n                        ‹\n                      </button>\n                      <button\n                        type="button"\n                        aria-label={CAROUSEL_NEXT[language]}\n                        title={CAROUSEL_NEXT[language]}\n                        aria-controls="ai-room-carousel-track"\n                        disabled={cardIndex >= visibleOffers.length - 1}\n                        onClick={() => scrollToCard(cardIndex + 1)}\n                        className="absolute right-1 top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-[#ddd3c6] bg-white/95 text-3xl font-light text-[#4f493f] shadow-[0_8px_24px_rgba(55,45,30,.18)] backdrop-blur transition hover:scale-105 hover:bg-white active:scale-95 disabled:pointer-events-none disabled:opacity-0 sm:flex"\n                      >\n                        ›\n                      </button>\n                    </>\n                  )}\n                </div>\n                {visibleOffers.length > 1 && <div className="mt-1 flex justify-center gap-1.5">{visibleOffers.map((_, index) => <button type="button" aria-label={copy.roomAria(index + 1)} key={index} onClick={() => scrollToCard(index)} className={"h-1.5 rounded-full transition-all " + (index === cardIndex ? "w-6 bg-[#66714f]" : "w-1.5 bg-[#cfc5b8]")} />)}</div>}`,
  'desktop arrow controls',
);

fs.writeFileSync(file, source);
console.log('Added desktop AI Room Finder carousel controls.');
