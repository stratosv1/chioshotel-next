import type { RoomFinderPreference } from "@/lib/ai-assistant/room-finder-types";
import type { RoomFinderLanguage } from "./room-finder-copy";

export type SalesAwareOffer = {
  roomNumber: number;
  name: string;
};

const ROOM_TRAITS: Record<number, readonly RoomFinderPreference[]> = {
  1: ["balcony", "family"],
  2: ["budget"],
  3: ["kitchen"],
  4: ["kitchen", "balcony"],
  5: ["ground_floor", "no_stairs", "garden"],
  6: ["ground_floor", "no_stairs", "budget"],
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

export function answerRoomQuestion(
  message: string,
  language: RoomFinderLanguage,
  offers: readonly SalesAwareOffer[],
) {
  if (!offers.length || !QUESTION_WORDS.test(message)) return null;
  const trait = TRAIT_PATTERNS.find(([, pattern]) => pattern.test(message))?.[0];
  if (!trait) return null;

  const label = TRAIT_LABELS[language][trait];
  const copy = ANSWER_COPY[language];
  const roomMatch = message.match(ROOM_NUMBER);

  if (roomMatch) {
    const roomNumber = Number(roomMatch[1]);
    const offer = offers.find(item => Number(item.roomNumber) === roomNumber);
    if (!offer) return null;
    return roomTraits(roomNumber).includes(trait)
      ? copy.yes(offer.name, label)
      : copy.no(offer.name, label);
  }

  const matching = offers.filter(offer => roomTraits(Number(offer.roomNumber)).includes(trait));
  return matching.length
    ? copy.list(label, matching.map(offer => offer.name).join(", "))
    : copy.none(label);
}
