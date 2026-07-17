const fs = require("node:fs");
const path = require("node:path");

const componentPath = path.join(process.cwd(), "components/ai/AIRoomFinder.tsx");
const carouselPath = path.join(process.cwd(), "components/ui/RoomCarousel.tsx");

let source = fs.readFileSync(componentPath, "utf8");

source = source.replace('visitors: "επισκέπτες"', 'visitors: "άτομα"');
source = source.replace('{ month: "long" }', '{ month: "short" }');

source = source.replace(
  'function CutleryIcon({ className = "h-6 w-6" }: IconProps) {\n  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true"><path d="M6 3v8M3.5 3v5a2.5 2.5 0 0 0 5 0V3M6 11v10M16 3v18M16 3c3 2 4 5 4 8h-4"/></svg>;\n}',
  'function BedIcon({ className = "h-6 w-6" }: IconProps) {\n  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true"><path d="M3 19v-8M21 19v-6a3 3 0 0 0-3-3H9a3 3 0 0 0-3 3v6M3 16h18M6 10V7h5a3 3 0 0 1 3 3"/><path d="M5 19v2M19 19v2"/></svg>;\n}'
);

if (!source.includes("function localizeOfferText")) {
  source = source.replace(
    "export function AIRoomFinder() {",
    `function localizeOfferText(value: string | undefined, language: Language) {
  if (!value || language !== "el") return value || "";

  const exact: Record<string, string> = {
    "Ground Floor Room": "Δωμάτιο ισογείου",
    "First Floor Room": "Δωμάτιο ορόφου",
    "Economy Double Room": "Οικονομικό δίκλινο",
    "Family Apartment": "Οικογενειακό διαμέρισμα",
    "Ground floor": "Ισόγειο",
    "First floor": "Πρώτος όροφος",
    "Upper floor": "Όροφος",
    "1 double bed + 1 single bed": "1 διπλό + 1 μονό",
    "1 double bed": "1 διπλό κρεβάτι",
    "2 single beds": "2 μονά κρεβάτια",
    "Double bed": "Διπλό κρεβάτι",
    "Single bed": "Μονό κρεβάτι",
    "Full kitchen": "Πλήρης κουζίνα",
    "Kitchenette": "Μικρή κουζίνα",
    "Independent": "Ανεξάρτητο",
    "No stairs": "Χωρίς σκάλες",
  };

  const trimmed = value.trim();
  if (exact[trimmed]) return exact[trimmed];
  if (/^Room\\s+(10|[1-9])$/i.test(trimmed)) return trimmed.replace(/^Room/i, "Δωμάτιο");
  if (/^Apartment\\s+(10|[1-9])$/i.test(trimmed)) return trimmed.replace(/^Apartment/i, "Διαμέρισμα");
  return trimmed;
}

export function AIRoomFinder() {`
  );
}

const modalStart = source.indexOf("      {activeOffer ? (");
const requestStart = source.indexOf("      {requestOffer ?", modalStart);
if (modalStart === -1 || requestStart === -1) {
  throw new Error("Active room modal boundaries not found");
}

const oneScreenModal = `      {activeOffer ? (
        <div className="fixed inset-0 z-[100] flex items-stretch justify-center overflow-hidden bg-stone-950/60 sm:items-center sm:p-4" role="dialog" aria-modal="true" aria-label={localizeOfferText(activeOffer.name, language)}>
          <div data-ai-one-screen-modal className="relative flex h-[100dvh] w-full max-w-3xl flex-col overflow-hidden bg-[#fffdf9] shadow-2xl sm:h-auto sm:max-h-[94dvh] sm:rounded-[2rem]">
            <div className="flex h-full min-h-0 flex-col overflow-hidden px-3 pb-[calc(env(safe-area-inset-bottom)+0.4rem)] pt-[calc(env(safe-area-inset-top)+0.35rem)] sm:px-5 sm:py-5">
              <div className="mx-auto mb-1.5 h-1 w-20 shrink-0 rounded-full bg-stone-300 sm:hidden" aria-hidden="true" />

              <div className="relative shrink-0 overflow-hidden rounded-[1.35rem] bg-stone-100 ring-1 ring-stone-200/70">
                <RoomCarousel images={gallery} roomName={activeOffer.name} compact showThumbnails={false} />
                <button onClick={() => setActiveOffer(null)} className="absolute right-2.5 top-2.5 z-20 grid h-10 w-10 place-items-center rounded-full bg-white/95 text-xl shadow-md ring-1 ring-stone-200" aria-label={t.close}>✕</button>
              </div>

              <div className="flex min-h-0 flex-1 flex-col px-1 pt-2.5 sm:px-4">
                <div className="shrink-0">
                  <h2 className="truncate text-[clamp(1.65rem,7vw,2.15rem)] font-black leading-none tracking-[-0.025em] text-[#43551b]">{localizeOfferText(activeOffer.name, language)}</h2>
                  <p className="mt-1 truncate text-[13px] font-semibold text-[#9a5b22] sm:text-sm">{localizeOfferText(activeOffer.category, language)} · {t.upTo} {activeOffer.maxGuests} {t.guests}</p>
                </div>

                <div className="mt-2 grid h-[68px] shrink-0 grid-cols-3 gap-2">
                  <div className="flex min-w-0 items-center justify-center gap-1.5 rounded-[1rem] border border-[#ded7c9] bg-white px-1.5 py-2 text-center text-[11px] leading-4 text-stone-600">
                    <HomeIcon className="h-5 w-5 shrink-0 text-[#61752b]" />
                    <span className="line-clamp-3">{localizeOfferText(activeAmenities[0] || activeOffer.floor, language)}</span>
                  </div>
                  <div className="flex min-w-0 items-center justify-center gap-1.5 rounded-[1rem] border border-[#ded7c9] bg-white px-1.5 py-2 text-center text-[11px] leading-4 text-stone-600">
                    <BedIcon className="h-5 w-5 shrink-0 text-[#61752b]" />
                    <span className="line-clamp-3">{localizeOfferText(activeAmenities[1] || activeOffer.features[0] || activeOffer.category, language)}</span>
                  </div>
                  <div className="flex min-w-0 items-center justify-center gap-1.5 rounded-[1rem] border border-[#ded7c9] bg-white px-1.5 py-2 text-center text-[11px] leading-4 text-stone-600">
                    <GuestsIcon className="h-5 w-5 shrink-0 text-[#61752b]" />
                    <span>{t.upTo} {activeOffer.maxGuests}<br />{t.guests}</span>
                  </div>
                </div>

                {search.checkin && search.checkout ? (
                  <div className="mt-2 flex h-11 shrink-0 items-center gap-2 rounded-[1rem] border border-[#ded7c9] bg-white px-3 text-[12px] text-stone-600">
                    <CalendarIcon className="h-5 w-5 shrink-0" />
                    <span className="min-w-0 truncate">{dateRange(search.checkin, search.checkout, language)} · {activeNights} {t.nights[activeNights === 1 ? 0 : 1]} · {search.guests} {t.visitors}</span>
                  </div>
                ) : null}

                <div className="mt-2 shrink-0">
                  <div className="flex items-end justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[12px] leading-none text-stone-400 line-through">{money(activeOriginalPerNight)} {t.perNight}</p>
                      <div className="mt-1 flex items-baseline gap-2 whitespace-nowrap">
                        <p className="text-[clamp(2rem,9vw,2.45rem)] font-black leading-none tracking-[-0.035em] text-[#43551b]">{money(activeDirectPerNight)}</p>
                        <span className="text-[13px] text-stone-600">{t.perNight}</span>
                      </div>
                    </div>
                    <p className="shrink-0 pb-0.5 text-right text-[11px] leading-4 text-stone-600"><strong className="text-[13px] text-stone-800">{money(activeOffer.directTotal)}</strong><br />{t.totalFor} {activeNights} {t.nights[activeNights === 1 ? 0 : 1]}</p>
                  </div>
                  {activeSaving > 0 ? <p className="mt-1.5 flex items-center gap-2 text-[12px] font-semibold leading-4 text-[#61752b]"><TagIcon className="h-5 w-5 shrink-0" /><span className="truncate">{t.save} {money(activeSaving)} {t.directBooking}</span></p> : null}
                </div>

                <div className="mt-auto shrink-0 pt-2">
                  <button onClick={() => openRequest(activeOffer)} className="w-full rounded-[1.15rem] bg-[#435f12] px-4 py-3 text-center text-[15px] font-medium text-white shadow-[0_10px_22px_rgba(67,95,18,0.18)]">{t.interestedRoom}</button>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="flex h-11 items-center justify-center gap-2 rounded-[1rem] border border-[#d8d1c3] bg-white px-3 text-sm font-semibold text-stone-900"><WhatsappIcon className="h-5 w-5 text-[#17944b]" />{t.whatsapp}</a>
                    <button type="button" onClick={() => openRequest(activeOffer)} className="flex h-11 items-center justify-center gap-2 rounded-[1rem] border border-[#d8d1c3] bg-white px-3 text-sm font-medium text-[#43551b]"><MailIcon className="h-5 w-5" />{t.email}</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

`;

source = source.slice(0, modalStart) + oneScreenModal + source.slice(requestStart);
fs.writeFileSync(componentPath, source);

let carousel = fs.readFileSync(carouselPath, "utf8");
carousel = carousel.replace(
  '? "relative h-[clamp(260px,38dvh,430px)] overflow-hidden bg-stone-100 sm:h-[400px]"',
  '? "relative h-[clamp(155px,26dvh,225px)] overflow-hidden bg-stone-100 sm:h-[340px]"'
);
carousel = carousel.replace(
  'className="object-cover object-center"',
  'className={compact ? "object-contain object-center" : "object-cover object-center"}'
);
fs.writeFileSync(carouselPath, carousel);

console.log("AI one-screen room modal applied");
