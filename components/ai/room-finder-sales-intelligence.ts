import type { RoomFinderPreference } from "@/lib/ai-assistant/room-finder-types";
import type { RoomFinderLanguage } from "./room-finder-copy";

export type SalesAwareOffer = {
  roomNumber: number;
  name: string;
  directTotal?: number;
  nights?: number;
};

const LOCALE: Record<RoomFinderLanguage, string> = {
  el: "el-GR",
  en: "en-GB",
  de: "de-DE",
  fr: "fr-FR",
  it: "it-IT",
  es: "es-ES",
  tr: "tr-TR",
};

const ROOM_PRICE_PATTERNS: Record<RoomFinderLanguage, RegExp> = {
  el: /(?:τιμ|κόστος|κοστίζ).*(?:δωμάτι|δωματι|διαμον)|(?:δωμάτι|δωματι|διαμον).*(?:τιμ|κόστος|κοστίζ)|ανά\s+διανυκτέρευση/iu,
  en: /(?:price|rate|cost).*(?:room|stay|accommodation)|(?:room|stay|accommodation).*(?:price|rate|cost)|per\s+night/iu,
  de: /(?:preis|kost).*(?:zimmer|aufenthalt|unterkunft)|(?:zimmer|aufenthalt|unterkunft).*(?:preis|kost)|pro\s+nacht/iu,
  fr: /(?:prix|tarif|coût|cout).*(?:chambre|séjour|sejour|hébergement|hebergement)|(?:chambre|séjour|sejour|hébergement|hebergement).*(?:prix|tarif|coût|cout)|par\s+nuit/iu,
  it: /(?:prezzo|tariff|cost).*(?:camera|soggiorno|alloggio)|(?:camera|soggiorno|alloggio).*(?:prezzo|tariff|cost)|a\s+notte/iu,
  es: /(?:precio|tarifa|cost).*(?:habitación|habitacion|estancia|alojamiento)|(?:habitación|habitacion|estancia|alojamiento).*(?:precio|tarifa|cost)|por\s+noche/iu,
  tr: /(?:fiyat|ücret|ucret|maliyet).*(?:oda|konaklama)|(?:oda|konaklama).*(?:fiyat|ücret|ucret|maliyet)|gecelik/iu,
};

const BREAKFAST_PATTERNS: Record<RoomFinderLanguage, RegExp> = {
  el: /πρωιν/iu,
  en: /breakfast/iu,
  de: /frühstück|fruhstuck/iu,
  fr: /petit[\s-]*déjeuner|petit[\s-]*dejeuner/iu,
  it: /colazione/iu,
  es: /desayuno/iu,
  tr: /kahvalt/iu,
};

const PRICE_COPY: Record<RoomFinderLanguage, {
  pending: string;
  exact: (name: string, total: string, nights: number, nightly: string) => string;
  selected: (total: string, details: string) => string;
  starting: (name: string, total: string, nights: number, nightly: string) => string;
  detail: (name: string, total: string, nightly: string) => string;
}> = {
  el: {
    pending: "Δεν υπάρχει μία σταθερή τιμή ανά διανυκτέρευση· εξαρτάται από τις ημερομηνίες, τα άτομα και το δωμάτιο. Μόλις ολοκληρώσετε τα στοιχεία της διαμονής, θα εμφανίσω τη live συνολική τιμή και την τιμή ανά βραδιά.",
    exact: (name, total, nights, nightly) => `Για τη διαμονή που αναφέρατε, το ${name} κοστίζει ${total} συνολικά για ${nights} ${nights === 1 ? "βραδιά" : "βραδιές"}, δηλαδή ${nightly} ανά βραδιά.`,
    selected: (total, details) => `Η συνολική direct τιμή των επιλεγμένων δωματίων είναι ${total}. Αναλυτικά: ${details}.`,
    starting: (name, total, nights, nightly) => `Για τη διαμονή που αναφέρατε, οι διαθέσιμες επιλογές ξεκινούν από ${total} συνολικά για ${nights} ${nights === 1 ? "βραδιά" : "βραδιές"} με το ${name}, δηλαδή ${nightly} ανά βραδιά. Η ακριβής συνολική τιμή φαίνεται σε κάθε κάρτα δωματίου.`,
    detail: (name, total, nightly) => `${name}: ${total} (${nightly}/βραδιά)`,
  },
  en: {
    pending: "There is no single fixed nightly rate; it depends on the dates, guest count and room. Once you complete the stay details, I will show the live total and price per night.",
    exact: (name, total, nights, nightly) => `For the stay you entered, ${name} costs ${total} in total for ${nights} ${nights === 1 ? "night" : "nights"}, or ${nightly} per night.`,
    selected: (total, details) => `The total direct price for the selected rooms is ${total}. Breakdown: ${details}.`,
    starting: (name, total, nights, nightly) => `For the stay you entered, available options start at ${total} in total for ${nights} ${nights === 1 ? "night" : "nights"} with ${name}, or ${nightly} per night. The exact total is shown on each room card.`,
    detail: (name, total, nightly) => `${name}: ${total} (${nightly}/night)`,
  },
  de: {
    pending: "Es gibt keinen festen Preis pro Nacht; er hängt von Reisedaten, Personenzahl und Zimmer ab. Sobald Ihre Aufenthaltsdaten vollständig sind, zeige ich den Live-Gesamtpreis und den Preis pro Nacht.",
    exact: (name, total, nights, nightly) => `Für den angegebenen Aufenthalt kostet ${name} insgesamt ${total} für ${nights} ${nights === 1 ? "Nacht" : "Nächte"}, also ${nightly} pro Nacht.`,
    selected: (total, details) => `Der direkte Gesamtpreis der ausgewählten Zimmer beträgt ${total}. Aufschlüsselung: ${details}.`,
    starting: (name, total, nights, nightly) => `Für den angegebenen Aufenthalt beginnen die verfügbaren Optionen bei insgesamt ${total} für ${nights} ${nights === 1 ? "Nacht" : "Nächte"} mit ${name}, also ${nightly} pro Nacht. Der genaue Gesamtpreis steht auf jeder Zimmerkarte.`,
    detail: (name, total, nightly) => `${name}: ${total} (${nightly}/Nacht)`,
  },
  fr: {
    pending: "Il n’existe pas de tarif fixe par nuit : il dépend des dates, du nombre de personnes et de la chambre. Une fois les informations du séjour complétées, j’afficherai le total en direct et le prix par nuit.",
    exact: (name, total, nights, nightly) => `Pour le séjour indiqué, ${name} coûte ${total} au total pour ${nights} ${nights === 1 ? "nuit" : "nuits"}, soit ${nightly} par nuit.`,
    selected: (total, details) => `Le prix direct total des chambres sélectionnées est de ${total}. Détail : ${details}.`,
    starting: (name, total, nights, nightly) => `Pour le séjour indiqué, les options disponibles commencent à ${total} au total pour ${nights} ${nights === 1 ? "nuit" : "nuits"} avec ${name}, soit ${nightly} par nuit. Le total exact figure sur chaque fiche de chambre.`,
    detail: (name, total, nightly) => `${name} : ${total} (${nightly}/nuit)`,
  },
  it: {
    pending: "Non esiste una tariffa fissa per notte: dipende dalle date, dal numero di ospiti e dalla camera. Una volta completati i dati del soggiorno, mostrerò il totale live e il prezzo per notte.",
    exact: (name, total, nights, nightly) => `Per il soggiorno indicato, ${name} costa ${total} in totale per ${nights} ${nights === 1 ? "notte" : "notti"}, cioè ${nightly} a notte.`,
    selected: (total, details) => `Il prezzo direct totale delle camere selezionate è ${total}. Dettaglio: ${details}.`,
    starting: (name, total, nights, nightly) => `Per il soggiorno indicato, le opzioni disponibili partono da ${total} in totale per ${nights} ${nights === 1 ? "notte" : "notti"} con ${name}, cioè ${nightly} a notte. Il totale esatto è indicato su ogni scheda camera.`,
    detail: (name, total, nightly) => `${name}: ${total} (${nightly}/notte)`,
  },
  es: {
    pending: "No hay una tarifa fija por noche; depende de las fechas, el número de huéspedes y la habitación. Cuando complete los datos de la estancia, mostraré el total en vivo y el precio por noche.",
    exact: (name, total, nights, nightly) => `Para la estancia indicada, ${name} cuesta ${total} en total por ${nights} ${nights === 1 ? "noche" : "noches"}, es decir, ${nightly} por noche.`,
    selected: (total, details) => `El precio directo total de las habitaciones seleccionadas es ${total}. Desglose: ${details}.`,
    starting: (name, total, nights, nightly) => `Para la estancia indicada, las opciones disponibles empiezan en ${total} en total por ${nights} ${nights === 1 ? "noche" : "noches"} con ${name}, es decir, ${nightly} por noche. El total exacto aparece en cada tarjeta de habitación.`,
    detail: (name, total, nightly) => `${name}: ${total} (${nightly}/noche)`,
  },
  tr: {
    pending: "Tek bir sabit gecelik fiyat yoktur; tarihlere, kişi sayısına ve odaya göre değişir. Konaklama bilgileri tamamlandığında canlı toplam fiyatı ve gecelik fiyatı göstereceğim.",
    exact: (name, total, nights, nightly) => `Belirttiğiniz konaklama için ${name}, ${nights} gece toplam ${total}, yani gecelik ${nightly} tutarındadır.`,
    selected: (total, details) => `Seçilen odaların toplam doğrudan fiyatı ${total}. Ayrıntı: ${details}.`,
    starting: (name, total, nights, nightly) => `Belirttiğiniz konaklama için müsait seçenekler ${name} ile ${nights} gece toplam ${total}, yani gecelik ${nightly} fiyatından başlar. Kesin toplam fiyat her oda kartında gösterilir.`,
    detail: (name, total, nightly) => `${name}: ${total} (${nightly}/gece)`,
  },
};

function price(value: number, language: RoomFinderLanguage) {
  return new Intl.NumberFormat(LOCALE[language], {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function isRoomPriceQuestion(message: string, language: RoomFinderLanguage) {
  return !BREAKFAST_PATTERNS[language].test(message) && ROOM_PRICE_PATTERNS[language].test(message);
}

export function answerRoomPriceQuestion(
  message: string,
  language: RoomFinderLanguage,
  offers: readonly SalesAwareOffer[],
  selected = false,
) {
  if (!isRoomPriceQuestion(message, language)) return null;

  const pricedOffers = Array.from(new Map(
    offers
      .filter(offer => Number(offer.directTotal) > 0 && Number(offer.nights) > 0)
      .map(offer => [
        `${offer.roomNumber}:${offer.name}:${offer.directTotal}:${offer.nights}`,
        offer,
      ] as const),
  ).values());
  const copy = PRICE_COPY[language];
  if (!pricedOffers.length) return copy.pending;

  if (selected && pricedOffers.length > 1) {
    const total = pricedOffers.reduce((sum, offer) => sum + Number(offer.directTotal), 0);
    const details = pricedOffers.map(offer => copy.detail(
      offer.name,
      price(Number(offer.directTotal), language),
      price(Number(offer.directTotal) / Number(offer.nights), language),
    )).join(" · ");
    return copy.selected(price(total, language), details);
  }

  const sorted = [...pricedOffers].sort((left, right) =>
    Number(left.directTotal) / Number(left.nights) - Number(right.directTotal) / Number(right.nights),
  );
  const offer = sorted[0];
  const nights = Number(offer.nights);
  const total = price(Number(offer.directTotal), language);
  const nightly = price(Number(offer.directTotal) / nights, language);
  return sorted.length === 1 || selected
    ? copy.exact(offer.name, total, nights, nightly)
    : copy.starting(offer.name, total, nights, nightly);
}

const ROOM_TRAITS: Record<number, readonly RoomFinderPreference[]> = {
  1: ["family"],
  2: ["budget"],
  3: ["kitchen"],
  4: ["kitchen", "balcony"],
  5: ["ground_floor", "no_stairs", "garden"],
  6: ["ground_floor", "no_stairs", "garden", "budget"],
  7: ["ground_floor", "no_stairs", "garden"],
  8: ["kitchen", "family"],
  9: ["kitchen", "family"],
  10: ["kitchen", "family"],
};

const TRAIT_PATTERNS: Array<[RoomFinderPreference, RegExp]> = [
  ["no_stairs", /(χωρίς σκάλ|χωρις σκαλ|no stairs|without stairs|keine treppen|sans escalier|senza scale|sin escaleras|merdivensiz)/iu],
  ["ground_floor", /(ισόγει|ισογει|ground floor|erdgeschoss|rez-de-chaussée|rez de chaussée|piano terra|planta baja|zemin kat)/iu],
  ["kitchen", /(κουζίν|κουζιν|kitchen|kitchenette|küche|küchenzeile|cuisine|cucina|angolo cottura|cocina|mutfak)/iu],
  ["balcony", /(μπαλκόν|μπαλκον|balcony|balkon|balcon|balcone|balcón)/iu],
  ["garden", /(κήπ|κηπ|αυλή|αυλη|garden|courtyard|garten|jardin|giardino|jardín|bahçe)/iu],
  ["budget", /(οικονομικ|φθην|budget|economy|cheap|preisgünst|économ|economica|económ|uygun fiyat|ekonomik)/iu],
  ["family", /(οικογέν|οικογεν|family|familie|famille|famiglia|familia|aile)/iu],
];

const QUESTION_WORDS = /(ποιο|ποια|έχει|εχει|είναι|ειναι|does|which|has|is|welches|hat|ist|quelle|a-t-il|est|quale|ha|è|cual|cuál|tiene|es|hangi|var mı|mı|mi)/iu;
const ROOM_NUMBER = /(?:δωμάτιο|δωματιο|room|zimmer|chambre|camera|habitación|habitacion|oda)\s*(\d{1,2})/iu;

const TRAIT_LABELS: Record<RoomFinderLanguage, Record<RoomFinderPreference, string>> = {
  el: { ground_floor: "ισόγειο", no_stairs: "χωρίς σκάλες", kitchen: "κουζίνα/κουζινάκι", balcony: "μπαλκόνι", garden: "πρόσβαση σε αυλή/κήπο", budget: "οικονομική επιλογή", family: "κατάλληλο για οικογένεια" },
  en: { ground_floor: "ground floor", no_stairs: "no stairs", kitchen: "kitchen/kitchenette", balcony: "balcony", garden: "garden/courtyard access", budget: "budget-friendly", family: "family-friendly" },
  de: { ground_floor: "Erdgeschoss", no_stairs: "keine Treppen", kitchen: "Küche/Küchenzeile", balcony: "Balkon", garden: "Garten-/Hofzugang", budget: "preisgünstig", family: "familiengeeignet" },
  fr: { ground_floor: "rez-de-chaussée", no_stairs: "sans escalier", kitchen: "cuisine/kitchenette", balcony: "balcon", garden: "accès jardin/cour", budget: "économique", family: "adapté aux familles" },
  it: { ground_floor: "piano terra", no_stairs: "senza scale", kitchen: "cucina/angolo cottura", balcony: "balcone", garden: "accesso giardino/cortile", budget: "economico", family: "adatto alle famiglie" },
  es: { ground_floor: "planta baja", no_stairs: "sin escaleras", kitchen: "cocina/cocina pequeña", balcony: "balcón", garden: "acceso al jardín/patio", budget: "económico", family: "apto para familias" },
  tr: { ground_floor: "zemin kat", no_stairs: "merdivensiz", kitchen: "mutfak/mini mutfak", balcony: "balkon", garden: "bahçe/avlu erişimi", budget: "ekonomik", family: "aileler için uygun" },
};

const ANSWER_COPY: Record<RoomFinderLanguage, {
  yes: (room: string, trait: string) => string;
  no: (room: string, trait: string) => string;
  list: (trait: string, rooms: string) => string;
  none: (trait: string) => string;
}> = {
  el: {
    yes: (room, trait) => `Ναι. Το ${room} είναι επιλογή με ${trait}.`,
    no: (room, trait) => `Όχι. Το ${room} δεν είναι καταχωρημένο ως επιλογή με ${trait}.`,
    list: (trait, rooms) => `Από τις διαθέσιμες επιλογές, ${trait} έχουν: ${rooms}.`,
    none: trait => `Από τις διαθέσιμες επιλογές δεν βλέπω αυτή τη στιγμή δωμάτιο με ${trait}.`,
  },
  en: {
    yes: (room, trait) => `Yes. ${room} is an option with ${trait}.`,
    no: (room, trait) => `No. ${room} is not listed as an option with ${trait}.`,
    list: (trait, rooms) => `Among the available options, these match ${trait}: ${rooms}.`,
    none: trait => `I do not currently see an available room matching ${trait}.`,
  },
  de: {
    yes: (room, trait) => `Ja. ${room} ist eine Option mit ${trait}.`,
    no: (room, trait) => `Nein. ${room} ist nicht als Option mit ${trait} hinterlegt.`,
    list: (trait, rooms) => `Unter den verfügbaren Optionen passen zu ${trait}: ${rooms}.`,
    none: trait => `Aktuell sehe ich keine verfügbare Option mit ${trait}.`,
  },
  fr: {
    yes: (room, trait) => `Oui. ${room} est une option avec ${trait}.`,
    no: (room, trait) => `Non. ${room} n’est pas répertoriée comme option avec ${trait}.`,
    list: (trait, rooms) => `Parmi les options disponibles, celles qui correspondent à ${trait} sont : ${rooms}.`,
    none: trait => `Je ne vois actuellement aucune chambre disponible correspondant à ${trait}.`,
  },
  it: {
    yes: (room, trait) => `Sì. ${room} è un’opzione con ${trait}.`,
    no: (room, trait) => `No. ${room} non risulta un’opzione con ${trait}.`,
    list: (trait, rooms) => `Tra le opzioni disponibili, corrispondono a ${trait}: ${rooms}.`,
    none: trait => `Al momento non vedo una camera disponibile con ${trait}.`,
  },
  es: {
    yes: (room, trait) => `Sí. ${room} es una opción con ${trait}.`,
    no: (room, trait) => `No. ${room} no figura como una opción con ${trait}.`,
    list: (trait, rooms) => `Entre las opciones disponibles, coinciden con ${trait}: ${rooms}.`,
    none: trait => `Ahora mismo no veo una habitación disponible que coincida con ${trait}.`,
  },
  tr: {
    yes: (room, trait) => `Evet. ${room}, ${trait} özelliğine sahip bir seçenektir.`,
    no: (room, trait) => `Hayır. ${room}, ${trait} özelliğine sahip olarak kayıtlı değil.`,
    list: (trait, rooms) => `Müsait seçenekler arasında ${trait} ile eşleşenler: ${rooms}.`,
    none: trait => `Şu anda ${trait} ile eşleşen müsait bir oda görünmüyor.`,
  },
};

export function roomTraits(roomNumber: number) {
  return ROOM_TRAITS[roomNumber] || [];
}

export function roomPreferenceScore(roomNumber: number, preferences: readonly RoomFinderPreference[]) {
  if (!preferences.length) return 0;
  const traits = new Set(roomTraits(roomNumber));
  return preferences.reduce((score, preference) => score + (traits.has(preference) ? 1 : 0), 0);
}

export function roomInterestPriority(roomNumber: number, preferredRoomNumber: number | null) {
  return preferredRoomNumber === roomNumber ? 1 : 0;
}

export function answerRoomQuestion(
  message: string,
  language: RoomFinderLanguage,
  offers: readonly SalesAwareOffer[],
) {
  if (!QUESTION_WORDS.test(message)) return null;

  const uniqueOffers = Array.from(new Map(
    offers
      .filter(offer => Number(offer.roomNumber) > 0)
      .map(offer => [Number(offer.roomNumber), offer] as const),
  ).values());
  if (!uniqueOffers.length) return null;

  const trait = TRAIT_PATTERNS.find(([, pattern]) => pattern.test(message))?.[0];
  if (!trait) return null;

  const label = TRAIT_LABELS[language][trait];
  const copy = ANSWER_COPY[language];
  const roomMatch = message.match(ROOM_NUMBER);

  if (roomMatch) {
    const roomNumber = Number(roomMatch[1]);
    const offer = uniqueOffers.find(item => Number(item.roomNumber) === roomNumber);
    if (!offer) return null;
    return roomTraits(roomNumber).includes(trait)
      ? copy.yes(offer.name, label)
      : copy.no(offer.name, label);
  }

  const matching = uniqueOffers.filter(offer => roomTraits(Number(offer.roomNumber)).includes(trait));
  return matching.length
    ? copy.list(label, matching.map(offer => offer.name).join(", "))
    : copy.none(label);
}
