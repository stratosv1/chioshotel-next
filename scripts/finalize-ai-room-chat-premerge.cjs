const fs = require('node:fs');

const file = 'components/ai/AiRoomChatPreview.tsx';
let source = fs.readFileSync(file, 'utf8');

function replaceRequired(before, after, label) {
  if (!source.includes(before)) throw new Error(`Missing target: ${label}`);
  source = source.replace(before, after);
}

replaceRequired(
  '  saving: number;\n  recommendationRole?:',
  '  saving: number;\n  splitStay?: boolean;\n  recommendationRole?:',
  'split stay offer type',
);

const chooseReplacements = [
  [
    '    choose: (group, guests) => `I found these options for group ${group} · ${guests} guests.`,',
    '    choose: (group, guests) => `I found these options for group ${group} · ${guests} ${guests === 1 ? "guest" : "guests"}.`,',
  ],
  [
    '    choose: (group, guests) => `Βρήκα αυτές τις επιλογές για την ομάδα ${group} · ${guests} άτομα.`,',
    '    choose: (group, guests) => `Βρήκα αυτές τις επιλογές για την ομάδα ${group} · ${guests} ${guests === 1 ? "άτομο" : "άτομα"}.`,',
  ],
  [
    '    choose: (group, guests) => `Diese Optionen passen zu Gruppe ${group} · ${guests} Gäste.`,',
    '    choose: (group, guests) => `Diese Optionen passen zu Gruppe ${group} · ${guests} ${guests === 1 ? "Gast" : "Gäste"}.`,',
  ],
  [
    '    choose: (group, guests) => `Voici les options pour le groupe ${group} · ${guests} personnes.`,',
    '    choose: (group, guests) => `Voici les options pour le groupe ${group} · ${guests} ${guests === 1 ? "personne" : "personnes"}.`,',
  ],
  [
    '    choose: (group, guests) => `Ecco le opzioni per il gruppo ${group} · ${guests} persone.`,',
    '    choose: (group, guests) => `Ecco le opzioni per il gruppo ${group} · ${guests} ${guests === 1 ? "persona" : "persone"}.`,',
  ],
  [
    '    choose: (group, guests) => `Estas son las opciones para el grupo ${group} · ${guests} personas.`,',
    '    choose: (group, guests) => `Estas son las opciones para el grupo ${group} · ${guests} ${guests === 1 ? "persona" : "personas"}.`,',
  ],
];
for (const [before, after] of chooseReplacements) replaceRequired(before, after, `localized guest plural: ${before.slice(0, 30)}`);

const shortSelectLine = 'const SHORT_SELECT: Record<Language, string> = { el: "Επιλογή", en: "Select", de: "Wählen", fr: "Choisir", it: "Scegli", es: "Elegir", tr: "Seç" };';
replaceRequired(
  shortSelectLine,
  `${shortSelectLine}\nconst SPLIT_STAY_TITLE: Record<Language, string> = { el: "Συνδυαστική διαμονή", en: "Split stay", de: "Geteilter Aufenthalt", fr: "Séjour partagé", it: "Soggiorno diviso", es: "Estancia dividida", tr: "Bölünmüş konaklama" };\nconst SPLIT_STAY_BADGE: Record<Language, string> = { el: "1 αλλαγή δωματίου", en: "1 room change", de: "1 Zimmerwechsel", fr: "1 changement de chambre", it: "1 cambio camera", es: "1 cambio de habitación", tr: "1 oda değişikliği" };`,
  'split stay localized labels',
);

replaceRequired(
  'function roomTier(offer: Offer) {\n  const room = offerRoomNumber(offer);',
  'function roomTier(offer: Offer) {\n  if (offer.splitStay) return 4;\n  const room = offerRoomNumber(offer);',
  'split stay room tier',
);

replaceRequired(
  'function categoryWithFloor(offer: Offer) {\n  const room = offerRoomNumber(offer);',
  'function categoryWithFloor(offer: Offer) {\n  if (offer.splitStay) return offer.category;\n  const room = offerRoomNumber(offer);',
  'split stay category',
);

replaceRequired(
  'function accessLabel(offer: Offer) {\n  const parts = offer.floor.split(" · ").map(part => part.trim()).filter(Boolean);',
  'function accessLabel(offer: Offer) {\n  if (offer.splitStay) return offer.floor;\n  const parts = offer.floor.split(" · ").map(part => part.trim()).filter(Boolean);',
  'split stay access label',
);

replaceRequired(
  'function sellingBadges(offer: Offer, allOffers: Offer[], filters: Filter[], guests: number, language: Language) {\n  const copy = BADGE_COPY[language];',
  'function sellingBadges(offer: Offer, allOffers: Offer[], filters: Filter[], guests: number, language: Language) {\n  if (offer.splitStay) return [SPLIT_STAY_BADGE[language]];\n  const copy = BADGE_COPY[language];',
  'split stay selling badge',
);

replaceRequired(
  'function sellingBadges(offer: Offer, allOffers: Offer[], filters: Filter[], guests: number, language: Language) {',
  'function offerDisplayName(offer: Offer, language: Language) {\n  if (!offer.splitStay) return offer.name;\n  return offer.name.replace(/^Split Stay/i, SPLIT_STAY_TITLE[language]);\n}\n\nfunction sellingBadges(offer: Offer, allOffers: Offer[], filters: Filter[], guests: number, language: Language) {',
  'localized split stay display name',
);

const displayReplacements = [
  ['addMessage("user", `${copy.selected}: ${offer.name}`);', 'addMessage("user", `${copy.selected}: ${offerDisplayName(offer, language)}`);'],
  ['...choices.map(choice => `${choice.offer.name}: ${money(choice.offer.directTotal, language)}`),', '...choices.map(choice => `${offerDisplayName(choice.offer, language)}: ${money(choice.offer.directTotal, language)}`),'],
  ['<Image src={offer.image} alt={offer.name}', '<Image src={offer.image} alt={offerDisplayName(offer, language)}'],
  ['<h2 className="truncate text-[1.35rem] font-bold">{offer.name}</h2>', '<h2 className="truncate text-[1.35rem] font-bold">{offerDisplayName(offer, language)}</h2>'],
  ['<Image src={choice.offer.image} alt={choice.offer.name}', '<Image src={choice.offer.image} alt={offerDisplayName(choice.offer, language)}'],
  ['<p className="truncate font-bold">{choice.offer.name}</p>', '<p className="truncate font-bold">{offerDisplayName(choice.offer, language)}</p>'],
  ['alt={detail.name} fill', 'alt={offerDisplayName(detail, language)} fill'],
  ['<h2 className="text-2xl font-black">{detail.name}</h2>', '<h2 className="text-2xl font-black">{offerDisplayName(detail, language)}</h2>'],
];
for (const [before, after] of displayReplacements) replaceRequired(before, after, `localized offer display: ${before.slice(0, 35)}`);

fs.writeFileSync(file, source);
console.log('Applied final AI Room Finder premerge fixes.');
