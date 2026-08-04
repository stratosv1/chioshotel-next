const fs = require('node:fs');

const file = 'components/ai/AiRoomChatPreview.tsx';
let source = fs.readFileSync(file, 'utf8');

function replaceOnce(search, replacement, label) {
  if (!source.includes(search)) throw new Error(`Missing target: ${label}`);
  source = source.replace(search, replacement);
}

replaceOnce(
  '  roomId: string;\n  unitId: string;\n  name: string;',
  '  roomId: string;\n  unitId: string;\n  roomNumber?: number;\n  name: string;',
  'offer room number',
);

replaceOnce(
  'const RANK: Record<NonNullable<Offer["recommendationRole"]>, number> = { recommended: 0, budget: 1, comfort: 2, alternative: 3 };',
  [
    'type BadgeKey = "bestForTwo" | "lowestPrice" | "directDiscount" | "noStairs" | "fullKitchen" | "moreSpace" | "family" | "balcony" | "matchesPreferences";',
    '',
    'const SHORT_SELECT: Record<Language, string> = { el: "Επιλογή", en: "Select", de: "Wählen", fr: "Choisir", it: "Scegli", es: "Elegir", tr: "Seç" };',
    'const BADGE_COPY: Record<Language, Record<BadgeKey, string>> = {',
    '  el: { bestForTwo: "Καλύτερη επιλογή για 2 άτομα", lowestPrice: "Χαμηλότερη τιμή", directDiscount: "10% έκπτωση απευθείας", noStairs: "Χωρίς σκάλες", fullKitchen: "Πλήρης κουζίνα", moreSpace: "Περισσότερος χώρος", family: "Ιδανικό για οικογένειες", balcony: "Ιδιωτικό μπαλκόνι", matchesPreferences: "Ταιριάζει στις προτιμήσεις σας" },',
    '  en: { bestForTwo: "Best choice for 2 guests", lowestPrice: "Lowest price", directDiscount: "10% direct discount", noStairs: "No stairs", fullKitchen: "Full kitchen", moreSpace: "More space", family: "Ideal for families", balcony: "Private balcony", matchesPreferences: "Matches your preferences" },',
    '  de: { bestForTwo: "Beste Wahl für 2 Gäste", lowestPrice: "Niedrigster Preis", directDiscount: "10 % Direktrabatt", noStairs: "Keine Treppen", fullKitchen: "Voll ausgestattete Küche", moreSpace: "Mehr Platz", family: "Ideal für Familien", balcony: "Privater Balkon", matchesPreferences: "Passt zu Ihren Wünschen" },',
    '  fr: { bestForTwo: "Meilleur choix pour 2 personnes", lowestPrice: "Prix le plus bas", directDiscount: "10 % de remise directe", noStairs: "Sans escaliers", fullKitchen: "Cuisine complète", moreSpace: "Plus d’espace", family: "Idéal pour les familles", balcony: "Balcon privé", matchesPreferences: "Correspond à vos préférences" },',
    '  it: { bestForTwo: "Scelta migliore per 2 ospiti", lowestPrice: "Prezzo più basso", directDiscount: "10% di sconto diretto", noStairs: "Senza scale", fullKitchen: "Cucina completa", moreSpace: "Più spazio", family: "Ideale per famiglie", balcony: "Balcone privato", matchesPreferences: "Corrisponde alle preferenze" },',
    '  es: { bestForTwo: "Mejor opción para 2 personas", lowestPrice: "Precio más bajo", directDiscount: "10% de descuento directo", noStairs: "Sin escaleras", fullKitchen: "Cocina completa", moreSpace: "Más espacio", family: "Ideal para familias", balcony: "Balcón privado", matchesPreferences: "Coincide con tus preferencias" },',
    '  tr: { bestForTwo: "2 kişi için en iyi seçenek", lowestPrice: "En düşük fiyat", directDiscount: "%10 doğrudan indirim", noStairs: "Merdivensiz", fullKitchen: "Tam donanımlı mutfak", moreSpace: "Daha geniş alan", family: "Aileler için ideal", balcony: "Özel balkon", matchesPreferences: "Tercihlerinize uygun" },',
    '};',
  ].join('\n'),
  'selling copy constants',
);

const preferenceFunction = `function preferenceScore(offer: Offer, filters: Filter[]) {
  const text = \`${offer.name} ${offer.category} ${offer.floor} ${(offer.features || []).join(" ")}\`.toLowerCase();
  const tests: Record<Filter, RegExp> = {
    economy: /econom|οικονομ|économ|preisgünst|ekonom/,
    noStairs: /χωρίς σκάλ|no stairs|keine treppen|sans escaliers|senza scale|sin escaleras|merdivensiz/,
    ground: /ισόγει|ground floor|erdgeschoss|rez-de-chaussée|piano terra|planta baja|zemin kat/,
    first: /πρώτ|first floor|erster stock|premier étage|primo piano|primera planta|birinci kat/,
    kitchen: /kitchen|κουζ|küche|cuisine|cucina|mutfak/,
    garden: /garden|κήπ|αυλ|garten|jardin|giardino|patio|bahçe|avlu/,
    balcony: /balcon|μπαλκόν|balkon/,
    family: /family|οικογεν|familien|familial|familiare|familiar|aile/,
  };
  return filters.reduce((total, filter) => total + (tests[filter].test(text) ? 10 : 0), 0);
}`;

const preferenceReplacement = `${preferenceFunction}

function offerRoomNumber(offer: Offer) {
  const direct = Number(offer.roomNumber);
  if (Number.isInteger(direct) && direct > 0) return direct;
  const match = offer.name.match(/(\\d{1,2})/);
  return match ? Number(match[1]) : 99;
}

function roomTier(offer: Offer) {
  const room = offerRoomNumber(offer);
  if (room === 2 || room === 6) return 0;
  if (room === 5 || room === 7) return 1;
  if (room === 1 || room === 3 || room === 4) return 2;
  if (room >= 8 && room <= 10) return 3;
  return 4;
}

function roomSequence(offer: Offer) {
  const order = [2, 6, 5, 7, 1, 3, 4, 8, 9, 10];
  const index = order.indexOf(offerRoomNumber(offer));
  return index >= 0 ? index : 99;
}

function businessPreferenceScore(offer: Offer, filters: Filter[]) {
  const room = offerRoomNumber(offer);
  let score = preferenceScore(offer, filters);
  for (const filter of filters) {
    if (filter === "economy" && (room === 2 || room === 6)) score += 40;
    if ((filter === "noStairs" || filter === "ground") && [5, 6, 7].includes(room)) score += 40;
    if (filter === "first" && [1, 2, 3, 4].includes(room)) score += 40;
    if (filter === "kitchen" && room >= 8 && room <= 10) score += 45;
    if (filter === "kitchen" && (room === 3 || room === 4)) score += 18;
    if (filter === "family" && room >= 8 && room <= 10) score += 45;
    if (filter === "balcony" && (room === 1 || room === 4)) score += 40;
    if (filter === "garden" && (room === 5 || room === 7)) score += 40;
  }
  return score;
}

function categoryWithFloor(offer: Offer) {
  const room = offerRoomNumber(offer);
  if (room >= 8 && room <= 10) return offer.category;
  const floor = offer.floor.split(" · ")[0]?.trim();
  if (!floor || offer.category.toLocaleLowerCase().includes(floor.toLocaleLowerCase())) return offer.category;
  return `${offer.category} · ${floor}`;
}

function accessLabel(offer: Offer) {
  const parts = offer.floor.split(" · ").map(part => part.trim()).filter(Boolean);
  return parts.length > 1 ? parts.slice(1).join(" · ") : offer.floor;
}

function sellingBadges(offer: Offer, allOffers: Offer[], filters: Filter[], guests: number, language: Language) {
  const copy = BADGE_COPY[language];
  const room = offerRoomNumber(offer);
  const eligible = allOffers.filter(item => !item.maxGuests || item.maxGuests >= guests);
  const lowestPrice = eligible.length ? Math.min(...eligible.map(item => item.directTotal)) : offer.directTotal;
  const economyForTwo = eligible
    .filter(item => [2, 6].includes(offerRoomNumber(item)))
    .sort((a, b) => a.directTotal - b.directTotal || roomSequence(a) - roomSequence(b));
  const badges: string[] = [];

  if (guests === 2 && economyForTwo[0] && offerRoomNumber(economyForTwo[0]) === room) badges.push(copy.bestForTwo);
  if (Math.abs(offer.directTotal - lowestPrice) < 0.01) badges.push(copy.lowestPrice);
  if (filters.length > 0 && businessPreferenceScore(offer, filters) > 0) badges.push(copy.matchesPreferences);
  if ([5, 6, 7].includes(room)) badges.push(copy.noStairs);
  if (room >= 8 && room <= 10) badges.push(copy.fullKitchen, guests >= 3 ? copy.family : copy.moreSpace);
  if (room === 1 || room === 4) badges.push(copy.balcony);
  badges.push(copy.directDiscount);

  return [...new Set(badges)].slice(0, 2);
}`;

replaceOnce(preferenceFunction, preferenceReplacement, 'business ordering helpers');

replaceOnce(
  `  const visibleOffers = useMemo(() => [...(offers[activeGroup] || [])]
    .filter(offer => !chosenKeys.has(`${offer.roomId}:${offer.unitId}`))
    .sort((a, b) => (RANK[a.recommendationRole || "alternative"] - RANK[b.recommendationRole || "alternative"])
      || preferenceScore(b, filters) - preferenceScore(a, filters)
      || a.directTotal - b.directTotal),
  [offers, activeGroup, chosenKeys, filters]);`,
  `  const activeGuests = groups[activeGroup] || 0;
  const visibleOffers = useMemo(() => [...(offers[activeGroup] || [])]
    .filter(offer => !chosenKeys.has(`${offer.roomId}:${offer.unitId}`))
    .filter(offer => !offer.maxGuests || offer.maxGuests >= activeGuests)
    .sort((a, b) => {
      const preferenceDifference = businessPreferenceScore(b, filters) - businessPreferenceScore(a, filters);
      if (preferenceDifference) return preferenceDifference;
      const tierDifference = roomTier(a) - roomTier(b);
      if (tierDifference) return tierDifference;
      const priceDifference = a.directTotal - b.directTotal;
      if (priceDifference) return priceDifference;
      return roomSequence(a) - roomSequence(b);
    }),
  [offers, activeGroup, activeGuests, chosenKeys, filters]);`,
  'business visible offer ordering',
);

replaceOnce(
  `  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);`,
  `  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    document.body.dataset.aiRoomStep = step;
    return () => { delete document.body.dataset.aiRoomStep; };
  }, [step]);

  useEffect(() => {
    setCardIndex(0);
    carouselRef.current?.scrollTo({ left: 0, behavior: "auto" });
  }, [activeGroup, filters, offers]);`,
  'step data and carousel reset effects',
);

replaceOnce(
  '<main data-ai-room-chat="true" className="flex h-[var(--ai-chat-height,100dvh)] flex-col overflow-hidden bg-[#f6f2eb] text-[#29251f]">',
  '<main data-ai-room-chat="true" data-ai-step={step} className="flex h-[var(--ai-chat-height,100dvh)] flex-col overflow-hidden bg-[#f6f2eb] text-[#29251f]">',
  'main step data attribute',
);

replaceOnce(
  '        #INDmenu-btn { top: auto !important; right: 8px !important; bottom: 88px !important; transform: scale(.82) !important; transform-origin: bottom right !important; }',
  '        #INDmenu-btn { top: auto !important; right: 8px !important; bottom: 88px !important; transform: scale(.82) !important; transform-origin: bottom right !important; }\n        body[data-ai-room-step="selecting"] #INDmenu-btn { display: none !important; }',
  'accessibility overlap rule',
);

replaceOnce(
  '<div className="mb-2 flex items-center justify-between px-4 text-xs font-bold text-[#6f665b] sm:px-1"><span>{copy.choose(activeGroup + 1, groups[activeGroup])}</span><span>{cardIndex + 1}/{visibleOffers.length}</span></div>',
  '<div className="mb-2 px-4 text-xs font-bold text-[#6f665b] sm:px-1">{copy.choose(activeGroup + 1, groups[activeGroup])}</div>',
  'remove duplicate carousel counter',
);

replaceOnce(
  'className="ai-hide-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain scroll-smooth px-3 pb-2 sm:px-0"',
  'className="ai-hide-scrollbar flex items-start snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain scroll-smooth px-3 pb-2 sm:px-0"',
  'natural carousel card height',
);

replaceOnce(
  'className="min-w-[88%] snap-center overflow-hidden rounded-[24px] border border-[#dcd2c5] bg-white shadow-[0_14px_38px_rgba(70,55,35,.10)] sm:min-w-[68%]"',
  'className="min-w-[88%] self-start snap-center overflow-hidden rounded-[24px] border border-[#dcd2c5] bg-white shadow-[0_14px_38px_rgba(70,55,35,.10)] sm:min-w-[68%]"',
  'self-start cards',
);

replaceOnce(
  '<div className="min-w-0"><h2 className="truncate text-[1.35rem] font-bold">{offer.name}</h2><p className="mt-0.5 text-sm text-[#746b60]">{offer.category}</p></div>',
  '<div className="min-w-0"><h2 className="truncate text-[1.35rem] font-bold">{offer.name}</h2><p className="mt-0.5 text-sm text-[#746b60]">{categoryWithFloor(offer)}</p></div>',
  'category with floor',
);

replaceOnce(
  '{offer.recommendationReason && <p className="mt-2 rounded-xl bg-[#f2f4ea] px-3 py-2 text-sm font-semibold leading-5 text-[#56643f]">✨ {offer.recommendationReason}</p>}',
  '{sellingBadges(offer, visibleOffers, filters, activeGuests, language).length > 0 && <div className="mt-2 flex flex-wrap gap-1.5">{sellingBadges(offer, visibleOffers, filters, activeGuests, language).map((badge, badgeIndex) => <span key={badge} className={badgeIndex === 0 ? "rounded-md bg-[#53643f] px-2.5 py-1 text-[11px] font-bold text-white" : "rounded-md bg-[#edf2e6] px-2.5 py-1 text-[11px] font-bold text-[#53643f]"}>{badgeIndex === 0 ? "✓ " : ""}{badge}</span>)}</div>}',
  'selling badges',
);

replaceOnce(
  '{[offer.floor, ...(offer.features || []).slice(0, 3)].filter(Boolean).map(item => <span key={item} className="rounded-full bg-[#f1ede7] px-2.5 py-1 text-[11px] font-semibold text-[#665e55]">{item}</span>)}',
  '{[accessLabel(offer), ...(offer.features || []).slice(0, 3)].filter(Boolean).map(item => <span key={item} className="rounded-full bg-[#f1ede7] px-2.5 py-1 text-[11px] font-semibold text-[#665e55]">{item}</span>)}',
  'access-only floor chip',
);

replaceOnce(
  '<button type="button" onClick={() => selectOffer(offer)} className="min-h-11 rounded-2xl bg-[#66714f] px-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#596244] active:scale-[.98]">{copy.select}</button>',
  '<button type="button" onClick={() => selectOffer(offer)} className="min-h-11 rounded-2xl bg-[#66714f] px-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#596244] active:scale-[.98]"><span className="sm:hidden">{SHORT_SELECT[language]}</span><span className="hidden sm:inline">{copy.select}</span></button>',
  'compact mobile select CTA',
);

fs.writeFileSync(file, source);
console.log('Applied AI room sales ordering and badge polish.');
