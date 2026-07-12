import type { AssistantAction, AssistantLanguage, AssistantPreferences } from "./types";

export type AssistantRoom = {
  number: number;
  roomId: string;
  unitId: string;
  type: "standard" | "economy" | "family";
  category: string;
  floor: string;
  maxGuests: number;
  beds: string;
  features: string[];
  image: string;
  priceRank: number;
  detailsUrls: Partial<Record<AssistantLanguage, string>>;
  attributes: {
    groundFloor?: boolean;
    firstFloor?: boolean;
    noStairs?: boolean;
    kitchenette?: boolean;
    fullKitchen?: boolean;
    familyFriendly?: boolean;
  };
  note?: string;
};

export type PersonalizedRoomMeta = {
  matchScore: number;
  bestMatch: boolean;
  recommendationReason: string;
  recommendationReasons: string[];
};

const COMMON = ["Κλιματισμός", "Δωρεάν Wi‑Fi", "Ψυγείο", "Ιδιωτικό μπάνιο", "Επίπεδη τηλεόραση", "Βραστήρας καφέ / τσαγιού", "Δωμάτιο μη καπνιστών"];

const standardUrls = {
  en: "/chios-rooms/standard-double-room/", el: "/el/domatia-xios/diklina-triklina-domatia/",
  fr: "/fr/chambres-a-chios/chambres-doubles-standard/", de: "/de/zimmer-chios/standard-doppelzimmer-auf-chios/",
  it: "/it/stanze-a-chios/camere-doppie-standard-chios/", es: "/es/habitaciones-en-chios/habitaciones-dobles-estandar/",
  tr: "/tr/chios-odalari/standart-cift-kisilik-odalar/",
} as const;
const economyUrls = {
  en: "/chios-rooms/economy-double-rooms/", el: "/el/domatia-xios/oikonomiko-diklino-domatio/",
  fr: "/fr/chambres-a-chios/chambres-doubles-economiques/", de: "/de/zimmer-chios/economy-zimmer-auf-chios/",
  it: "/it/stanze-a-chios/camera-doppia-economica-chios/", es: "/es/habitaciones-en-chios/economicas-habitaciones-en-chios/",
  tr: "/tr/chios-odalari/sakiz-adasindaki-ekonomi-cift-kisilik-oda/",
} as const;
const familyUrls = {
  en: "/chios-rooms/family-chios-apartments/", el: "/el/domatia-xios/oikogeneiako-diamerisma/",
  fr: "/fr/chambres-a-chios/appartements-familiaux-de-chios/", de: "/de/zimmer-chios/familienapartments-in-chios/",
  it: "/it/stanze-a-chios/appartamenti-familiari-a-chios/", es: "/es/habitaciones-en-chios/apartamentos-familiares-en-chios/",
  tr: "/tr/chios-odalari/sakiz-adasinda-buyuk-aile-daireleri/",
} as const;

export const ASSISTANT_ROOMS: AssistantRoom[] = [
  { number: 1, roomId: "267788", unitId: "1", type: "standard", category: "Δωμάτιο ορόφου", floor: "Πρώτος όροφος · πρόσβαση με σκάλες", maxGuests: 4, beds: "1 διπλό κρεβάτι και 2 μονά κρεβάτια", features: ["Ιδιωτικό μπαλκόνι", "Δύο χώροι χωρίς ενδιάμεση πόρτα", ...COMMON], image: "/images/rooms/DSC07776-2-e1675109942622.webp", priceRank: 5, detailsUrls: standardUrls, attributes: { firstFloor: true, familyFriendly: true } },
  { number: 2, roomId: "268803", unitId: "1", type: "economy", category: "Οικονομικό δίκλινο", floor: "Πρώτος όροφος · πρόσβαση με σκάλες", maxGuests: 2, beds: "1 διπλό κρεβάτι", features: ["Ενιαίος χώρος", ...COMMON], image: "/images/rooms/DSC07803-1.webp", priceRank: 1, detailsUrls: economyUrls, attributes: { firstFloor: true } },
  { number: 3, roomId: "267788", unitId: "2", type: "standard", category: "Δωμάτιο ορόφου", floor: "Πρώτος όροφος · πρόσβαση με σκάλες", maxGuests: 3, beds: "1 διπλό κρεβάτι και 1 μονό κρεβάτι", features: ["Kitchenette", "Δύο χώροι χωρίς ενδιάμεση πόρτα", ...COMMON], image: "/images/rooms/DSC07867-1.webp", priceRank: 6, detailsUrls: standardUrls, attributes: { firstFloor: true, kitchenette: true, familyFriendly: true } },
  { number: 4, roomId: "267788", unitId: "3", type: "standard", category: "Δωμάτιο ορόφου", floor: "Πρώτος όροφος · πρόσβαση με σκάλες", maxGuests: 3, beds: "1 διπλό κρεβάτι και 1 καναπές-κρεβάτι", features: ["Kitchenette", "Ιδιωτικό μπαλκόνι", ...COMMON], image: "/images/rooms/received_1748354861920234.webp", priceRank: 7, detailsUrls: standardUrls, attributes: { firstFloor: true, kitchenette: true, familyFriendly: true } },
  { number: 5, roomId: "626129", unitId: "1", type: "standard", category: "Δωμάτιο ισογείου", floor: "Ισόγειο · χωρίς σκάλες", maxGuests: 3, beds: "1 διπλό κρεβάτι και 1 μονό κρεβάτι", features: ["Άμεση πρόσβαση στην αυλή και στον κήπο", ...COMMON], image: "/images/rooms/voulamandis-house-rooms.webp", priceRank: 3, detailsUrls: standardUrls, attributes: { groundFloor: true, noStairs: true, familyFriendly: true } },
  { number: 6, roomId: "268803", unitId: "2", type: "economy", category: "Οικονομικό δίκλινο", floor: "Ισόγειο · χωρίς σκάλες", maxGuests: 2, beds: "1 διπλό κρεβάτι", features: ["Θέα / πρόσβαση κήπου", ...COMMON], image: "/images/rooms/received_1753964631359257.webp", priceRank: 2, detailsUrls: economyUrls, attributes: { groundFloor: true, noStairs: true } },
  { number: 7, roomId: "626129", unitId: "2", type: "standard", category: "Δωμάτιο ισογείου", floor: "Ισόγειο · χωρίς σκάλες", maxGuests: 3, beds: "1 διπλό κρεβάτι και 1 καναπές-κρεβάτι", features: ["Άμεση πρόσβαση στον κήπο", ...COMMON], image: "/images/rooms/double-triple-room.jpg", priceRank: 4, detailsUrls: standardUrls, attributes: { groundFloor: true, noStairs: true, familyFriendly: true } },
  { number: 8, roomId: "265595", unitId: "1", type: "family", category: "Ανεξάρτητο διαμέρισμα", floor: "Ισόγειο · ανεξάρτητη είσοδος", maxGuests: 4, beds: "1 διπλό κρεβάτι και 2 μονά κρεβάτια", features: ["Πλήρης κουζίνα", "Δύο χώροι", "Πρόσβαση κήπου", ...COMMON], image: "/images/rooms/chios-apartments-voulamandis.webp", priceRank: 8, detailsUrls: familyUrls, attributes: { groundFloor: true, noStairs: true, fullKitchen: true, familyFriendly: true } },
  { number: 9, roomId: "265595", unitId: "2", type: "family", category: "Ανεξάρτητο διαμέρισμα", floor: "Ισόγειο · ανεξάρτητη είσοδος", maxGuests: 4, beds: "1 διπλό κρεβάτι και 2 μονά κρεβάτια", features: ["Πλήρης κουζίνα", "Δύο χώροι", "Πρόσβαση κήπου", ...COMMON], image: "/images/rooms/chios-apartments-voulamandis.webp", priceRank: 9, detailsUrls: familyUrls, attributes: { groundFloor: true, noStairs: true, fullKitchen: true, familyFriendly: true } },
  { number: 10, roomId: "265595", unitId: "3", type: "family", category: "Ανεξάρτητο διαμέρισμα", floor: "Ισόγειο · ανεξάρτητη είσοδος", maxGuests: 5, beds: "1 διπλό κρεβάτι, 2 καναπέδες-κρεβάτια και πρόσθετο κρεβάτι για 5ο άτομο", features: ["Πλήρης κουζίνα", "Δύο χώροι", "Πρόσβαση κήπου", ...COMMON], image: "/images/rooms/DSC07899.webp", priceRank: 10, detailsUrls: familyUrls, attributes: { groundFloor: true, noStairs: true, fullKitchen: true, familyFriendly: true }, note: "Για 5 άτομα διατίθεται υπό προϋποθέσεις: ο χώρος είναι πιο περιορισμένος και προστίθεται επιπλέον κρεβάτι, συνήθως στο δωμάτιο των γονιών." },
];

const reasonText: Record<AssistantLanguage, Record<string, string>> = {
  el: { capacity: "καλύπτει άνετα τον αριθμό των επισκεπτών", exactCapacity: "έχει χωρητικότητα ακριβώς για την παρέα σας", ground: "είναι ισόγειο", noStairs: "δεν απαιτεί σκάλες", kitchenette: "διαθέτει kitchenette", fullKitchen: "διαθέτει πλήρη κουζίνα", family: "ταιριάζει σε οικογένεια", budget: "είναι από τις πιο οικονομικές επιλογές", first: "βρίσκεται στον πρώτο όροφο", flexible: "προσφέρει καλή ισορροπία χώρου και τιμής", best: "Καλύτερη επιλογή για όσα ζητήσατε" },
  en: { capacity: "comfortably supports your guest count", exactCapacity: "fits your group size exactly", ground: "is on the ground floor", noStairs: "requires no stairs", kitchenette: "includes a kitchenette", fullKitchen: "includes a full kitchen", family: "is well suited to families", budget: "is among the most economical options", first: "is on the first floor", flexible: "offers a good balance of space and value", best: "Best match for your request" },
  fr: { capacity: "convient au nombre de personnes", exactCapacity: "correspond exactement à la taille de votre groupe", ground: "se trouve au rez-de-chaussée", noStairs: "ne nécessite pas d'escaliers", kitchenette: "dispose d'une kitchenette", fullKitchen: "dispose d'une cuisine complète", family: "convient bien aux familles", budget: "fait partie des options les plus économiques", first: "se trouve au premier étage", flexible: "offre un bon équilibre entre espace et prix", best: "Meilleur choix pour votre demande" },
  de: { capacity: "passt gut zu Ihrer Gästezahl", exactCapacity: "passt genau zu Ihrer Gruppengröße", ground: "liegt im Erdgeschoss", noStairs: "erfordert keine Treppen", kitchenette: "hat eine Küchenzeile", fullKitchen: "hat eine vollständige Küche", family: "ist gut für Familien geeignet", budget: "gehört zu den günstigsten Optionen", first: "liegt im ersten Stock", flexible: "bietet ein gutes Verhältnis von Platz und Preis", best: "Beste Wahl für Ihre Wünsche" },
  it: { capacity: "è adatta al numero di ospiti", exactCapacity: "corrisponde esattamente al vostro gruppo", ground: "si trova al piano terra", noStairs: "non richiede scale", kitchenette: "dispone di angolo cottura", fullKitchen: "dispone di cucina completa", family: "è adatta alle famiglie", budget: "è tra le opzioni più economiche", first: "si trova al primo piano", flexible: "offre un buon equilibrio tra spazio e prezzo", best: "Scelta migliore per la richiesta" },
  es: { capacity: "admite cómodamente a su grupo", exactCapacity: "se ajusta exactamente al tamaño del grupo", ground: "está en la planta baja", noStairs: "no requiere escaleras", kitchenette: "incluye cocina pequeña", fullKitchen: "incluye cocina completa", family: "es adecuada para familias", budget: "está entre las opciones más económicas", first: "está en la primera planta", flexible: "ofrece un buen equilibrio entre espacio y precio", best: "Mejor opción para su solicitud" },
  tr: { capacity: "misafir sayınıza uygundur", exactCapacity: "grupunuzun büyüklüğüne tam uyar", ground: "zemin kattadır", noStairs: "merdiven gerektirmez", kitchenette: "mini mutfağı vardır", fullKitchen: "tam mutfağı vardır", family: "aileler için uygundur", budget: "en ekonomik seçenekler arasındadır", first: "birinci kattadır", flexible: "alan ve fiyat arasında iyi denge sunar", best: "Talebiniz için en uygun seçenek" },
};

function matchesPreferences(room: AssistantRoom, preferences?: AssistantPreferences) {
  if (!preferences) return true;
  if (preferences.floor === "ground" && !room.attributes.groundFloor) return false;
  if (preferences.floor === "first" && !room.attributes.firstFloor) return false;
  if (preferences.noStairs && !room.attributes.noStairs) return false;
  if (preferences.kitchenette && !room.attributes.kitchenette) return false;
  if (preferences.fullKitchen && !room.attributes.fullKitchen) return false;
  if (preferences.familyFriendly && !room.attributes.familyFriendly) return false;
  if (preferences.budget === "lowest" && room.type !== "economy") return false;
  if (preferences.budget === "family" && room.type !== "family") return false;
  return true;
}

function personalize(room: AssistantRoom, action: AssistantAction, language: AssistantLanguage) {
  const t = reasonText[language] || reasonText.en;
  const guests = action.guests;
  const preferences = action.preferences || {};
  let score = 20 - room.priceRank;
  const reasons: string[] = [];

  if (guests) {
    if (room.maxGuests === guests) { score += 20; reasons.push(t.exactCapacity); }
    else if (room.maxGuests > guests) { score += 12; reasons.push(t.capacity); }
  }
  if (preferences.noStairs && room.attributes.noStairs) { score += 30; reasons.push(t.noStairs); }
  else if (preferences.floor === "ground" && room.attributes.groundFloor) { score += 24; reasons.push(t.ground); }
  if (preferences.floor === "first" && room.attributes.firstFloor) { score += 20; reasons.push(t.first); }
  if (preferences.kitchenette && room.attributes.kitchenette) { score += 24; reasons.push(t.kitchenette); }
  if (preferences.fullKitchen && room.attributes.fullKitchen) { score += 30; reasons.push(t.fullKitchen); }
  if ((preferences.familyFriendly || (guests && guests >= 3)) && room.attributes.familyFriendly) { score += 16; reasons.push(t.family); }
  if (preferences.budget === "lowest" && room.type === "economy") { score += 30; reasons.push(t.budget); }
  if (!reasons.length) reasons.push(t.flexible);

  return { room, score, reasons: Array.from(new Set(reasons)).slice(0, 3) };
}

export function getPersonalizedRoomMeta(roomId: string, unitId: string, action: AssistantAction, language: AssistantLanguage): PersonalizedRoomMeta | null {
  const room = ASSISTANT_ROOMS.find((item) => item.roomId === String(roomId) && item.unitId === String(unitId));
  if (!room) return null;
  const result = personalize(room, action, language);
  return {
    matchScore: result.score,
    bestMatch: false,
    recommendationReason: result.reasons.join(" · "),
    recommendationReasons: result.reasons,
  };
}

export function recommendRooms(action: AssistantAction, language: AssistantLanguage) {
  const explicit = action.roomNumber ? [action.roomNumber] : action.roomNumbers || [];
  const guests = action.guests;
  const ranked = ASSISTANT_ROOMS
    .filter((room) => !explicit.length || explicit.includes(room.number))
    .filter((room) => !guests || room.maxGuests >= guests)
    .filter((room) => matchesPreferences(room, action.preferences))
    .map((room) => personalize(room, action, language))
    .sort((a, b) => b.score - a.score || a.room.priceRank - b.room.priceRank)
    .slice(0, explicit.length ? explicit.length : 4);

  return ranked.map(({ room, score, reasons }, index) => ({
    roomId: room.roomId,
    unitId: room.unitId,
    name: `Room ${room.number}`,
    category: `${room.category} · ${room.floor}`,
    floor: room.floor,
    maxGuests: room.maxGuests,
    features: [room.beds, ...room.features, ...(room.note ? [room.note] : [])],
    image: room.image,
    detailsUrl: room.detailsUrls[language] || room.detailsUrls.en || "/chios-rooms/",
    bookingUrl: "/book-now",
    nights: 0,
    originalTotal: 0,
    directTotal: 0,
    saving: 0,
    preview: true,
    matchScore: score,
    bestMatch: index === 0 && ranked.length > 1,
    bestMatchLabel: reasonText[language]?.best || reasonText.en.best,
    recommendationReason: reasons.join(" · "),
    recommendationReasons: reasons,
  }));
}
