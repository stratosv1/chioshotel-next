const fs = require("node:fs");

const file = "components/ai/AiRoomChatPreview.tsx";
let source = fs.readFileSync(file, "utf8");

if (source.includes('data-ai-room-carousel="true"')) {
  console.log("AI room carousel is already applied.");
  process.exit(0);
}

function replaceOnce(search, replacement, label) {
  const next = source.replace(search, replacement);
  if (next === source) throw new Error(`Could not apply replacement: ${label}`);
  source = next;
}

replaceOnce(
  '    searching: "Ελέγχω τη live διαθεσιμότητα και τις καλύτερες direct τιμές…",',
  '    searching: "Ελέγχω τη διαθεσιμότητα και τις καλύτερες απευθείας τιμές…",',
  "Greek searching copy",
);
replaceOnce(
  '    availabilityError: "Δεν μπόρεσα να ελέγξω τώρα τη live διαθεσιμότητα. Δοκιμάστε ξανά ή επικοινωνήστε μαζί μας μέσω WhatsApp.",',
  '    availabilityError: "Δεν μπόρεσα να ελέγξω τώρα τη διαθεσιμότητα. Δοκιμάστε ξανά ή επικοινωνήστε μαζί μας μέσω WhatsApp.",',
  "Greek availability error",
);
replaceOnce(
  '    online: "Online τώρα",\n    live: "Live διαθεσιμότητα",',
  '    online: "Διαθέσιμοι τώρα",\n    live: "Άμεση διαθεσιμότητα",',
  "Greek header status",
);
replaceOnce(
  '    chooseAbove: "Επιλέξτε μία από τις παραπάνω επιλογές",',
  '    chooseAbove: "Επιλέξτε μία επιλογή",',
  "Greek compact placeholder",
);
replaceOnce(
  '  const feedRef = useRef<HTMLDivElement>(null);\n  const initialized = useRef(false);',
  '  const feedRef = useRef<HTMLDivElement>(null);\n  const carouselRef = useRef<HTMLDivElement>(null);\n  const initialized = useRef(false);',
  "carousel ref",
);
replaceOnce('  const currentOffer = visibleOffers[cardIndex] || visibleOffers[0];\n', '', "remove single current offer");
replaceOnce(
  '  }, [messages, step, typing, activeGroup, cardIndex, sendStatus]);',
  '  }, [messages, step, typing, activeGroup, sendStatus]);',
  "avoid vertical jump while swiping",
);
replaceOnce(
  '  const inputEnabled = ["checkin", "checkout", "rooms", "guests"].includes(step) && !typing;\n  const homeHref = language === "en" ? "/" : `/${language}/`;',
  [
    '  function scrollToCard(index: number) {',
    '    const normalized = Math.max(0, Math.min(index, visibleOffers.length - 1));',
    '    setCardIndex(normalized);',
    '    const card = carouselRef.current?.children.item(normalized) as HTMLElement | null;',
    '    if (card && carouselRef.current) carouselRef.current.scrollTo({ left: card.offsetLeft, behavior: "smooth" });',
    '  }',
    '',
    '  const inputEnabled = ["checkin", "checkout", "rooms", "guests"].includes(step) && !typing;',
    '  const disabledPlaceholder = step === "selecting" ? copy.select : copy.chooseAbove;',
    '  const homeHref = language === "en" ? "/" : "/" + language + "/";',
  ].join("\n"),
  "carousel scroll helper",
);
replaceOnce(
  '    <main className="flex h-[var(--ai-chat-height,100dvh)] flex-col overflow-hidden bg-[#f6f2eb] text-[#29251f]">',
  '    <main data-ai-room-chat="true" className="flex h-[var(--ai-chat-height,100dvh)] flex-col overflow-hidden bg-[#f6f2eb] text-[#29251f]">',
  "chat page marker",
);
replaceOnce(
  '        .ai-scroll { scrollbar-width: thin; scrollbar-color: #d4c9ba transparent; }',
  [
    '        .ai-scroll { scrollbar-width: thin; scrollbar-color: #d4c9ba transparent; }',
    '        .ai-hide-scrollbar { scrollbar-width: none; -ms-overflow-style: none; }',
    '        .ai-hide-scrollbar::-webkit-scrollbar { display: none; }',
    '        #INDmenu-btn { top: auto !important; right: 8px !important; bottom: 88px !important; transform: scale(.82) !important; transform-origin: bottom right !important; }',
  ].join("\n"),
  "scrollbar and accessibility widget polish",
);
replaceOnce(
  '          .ai-chat-status { display: block !important; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }',
  '          .ai-chat-status { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }\n          .ai-status-live { display: none; }',
  "mobile status polish",
);
replaceOnce(
  '<div className="ai-chat-status mt-0.5 flex items-center gap-1.5 text-xs text-[#746b60]"><span className="inline-block h-2 w-2 rounded-full bg-[#718b52]" />{copy.online} · {copy.live}</div>',
  '<div className="ai-chat-status mt-0.5 flex items-center gap-1.5 text-xs text-[#746b60]"><span className="inline-block h-2 w-2 shrink-0 rounded-full bg-[#718b52]" /><span>{copy.online}</span><span className="ai-status-live"> · {copy.live}</span></div>',
  "status markup",
);
replaceOnce(
  '<div className="mx-auto flex max-w-3xl gap-2 overflow-x-auto text-xs font-semibold text-[#625b52]">',
  '<div className="ai-hide-scrollbar mx-auto flex max-w-3xl gap-2 overflow-x-auto text-xs font-semibold text-[#625b52]">',
  "hide trip chip scrollbar",
);

const selectingPattern = /            \{step === "selecting" && currentOffer && \([\s\S]*?\n            \)\}\n\n            \{step === "breakfast"/;
const selectingReplacement = [
  '            {step === "selecting" && visibleOffers.length > 0 && (',
  '              <section className="ai-message-in -mx-3 sm:mx-0 sm:ml-10">',
  '                <div className="mb-2 flex items-center justify-between px-4 text-xs font-bold text-[#6f665b] sm:px-1"><span>{copy.choose(activeGroup + 1, groups[activeGroup])}</span><span>{cardIndex + 1}/{visibleOffers.length}</span></div>',
  '                <div',
  '                  ref={carouselRef}',
  '                  data-ai-room-carousel="true"',
  '                  onScroll={event => {',
  '                    const container = event.currentTarget;',
  '                    const cards = Array.from(container.children) as HTMLElement[];',
  '                    let nearest = 0;',
  '                    let distance = Number.POSITIVE_INFINITY;',
  '                    cards.forEach((card, index) => {',
  '                      const nextDistance = Math.abs(card.offsetLeft - container.scrollLeft);',
  '                      if (nextDistance < distance) { distance = nextDistance; nearest = index; }',
  '                    });',
  '                    if (nearest !== cardIndex) setCardIndex(nearest);',
  '                  }}',
  '                  className="ai-hide-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain scroll-smooth px-3 pb-2 sm:px-0"',
  '                >',
  '                  {visibleOffers.map((offer, index) => (',
  '                    <article key={offer.roomId + ":" + offer.unitId} className="min-w-[88%] snap-center overflow-hidden rounded-[24px] border border-[#dcd2c5] bg-white shadow-[0_14px_38px_rgba(70,55,35,.10)] sm:min-w-[68%]">',
  '                      <div className="relative h-44 sm:h-56">',
  '                        <Image src={offer.image} alt={offer.name} fill sizes="(max-width:640px) 88vw, 520px" className="object-cover" />',
  '                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />',
  '                        <span className="absolute right-3 top-3 rounded-full bg-white/92 px-2.5 py-1 text-xs font-bold shadow-sm backdrop-blur">{index + 1}/{visibleOffers.length}</span>',
  '                      </div>',
  '                      <div className="p-3.5 sm:p-5">',
  '                        <div className="flex items-start justify-between gap-3">',
  '                          <div className="min-w-0"><h2 className="truncate text-[1.35rem] font-bold">{offer.name}</h2><p className="mt-0.5 text-sm text-[#746b60]">{offer.category}</p></div>',
  '                          <div className="shrink-0 text-right"><p className="text-xs text-[#b05252] line-through">{money(offer.originalTotal, language)}</p><p className="text-xl font-black text-[#5f7448]">{money(offer.directTotal, language)}</p></div>',
  '                        </div>',
  '                        {offer.recommendationReason && <p className="mt-2 rounded-xl bg-[#f2f4ea] px-3 py-2 text-sm font-semibold leading-5 text-[#56643f]">✨ {offer.recommendationReason}</p>}',
  '                        <div className="mt-2 flex flex-wrap gap-1.5">{[offer.floor, ...(offer.features || []).slice(0, 3)].filter(Boolean).map(item => <span key={item} className="rounded-full bg-[#f1ede7] px-2.5 py-1 text-[11px] font-semibold text-[#665e55]">{item}</span>)}</div>',
  '                        {offer.saving > 0 && <p className="mt-2 text-sm font-bold text-[#5f7448]">{copy.saving}: {money(offer.saving, language)}</p>}',
  '                        <div className="mt-3 grid grid-cols-2 gap-2">',
  '                          <button type="button" onClick={() => { setDetail(offer); setPhoto(0); }} className="min-h-11 rounded-2xl border border-[#d8cec1] bg-white px-3 text-sm font-bold transition active:scale-[.98]">{copy.details}</button>',
  '                          <button type="button" onClick={() => selectOffer(offer)} className="min-h-11 rounded-2xl bg-[#66714f] px-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#596244] active:scale-[.98]">{copy.select}</button>',
  '                        </div>',
  '                      </div>',
  '                    </article>',
  '                  ))}',
  '                </div>',
  '                {visibleOffers.length > 1 && <div className="mt-1 flex justify-center gap-1.5">{visibleOffers.map((_, index) => <button type="button" aria-label={copy.roomAria(index + 1)} key={index} onClick={() => scrollToCard(index)} className={"h-1.5 rounded-full transition-all " + (index === cardIndex ? "w-6 bg-[#66714f]" : "w-1.5 bg-[#cfc5b8]")} />)}</div>}',
  '              </section>',
  '            )}',
  '',
  '            {step === "breakfast"',
].join("\n");
replaceOnce(selectingPattern, selectingReplacement, "real swipe room carousel");
replaceOnce(
  'placeholder={inputEnabled ? copy.placeholder : copy.chooseAbove} aria-label={inputEnabled ? copy.placeholder : copy.chooseAbove}',
  'placeholder={inputEnabled ? copy.placeholder : disabledPlaceholder} aria-label={inputEnabled ? copy.placeholder : disabledPlaceholder}',
  "contextual composer placeholder",
);

fs.writeFileSync(file, source);
console.log("Applied AI room carousel and mobile polish.");
