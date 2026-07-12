import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DIRECT_DISCOUNT_PERCENT = 10;

type Language = "en" | "el" | "fr" | "de" | "it" | "es" | "tr";
type RoomType = "standard" | "economy" | "family";
type ChatMessage = { role: "user" | "assistant"; content: string };
type SearchState = { checkin?: string; checkout?: string; guests?: number };
type Offer = {
  roomId: string; unitId: string; name: string; category: string; floor: string;
  maxGuests: number; features: string[]; image: string; detailsUrl: string;
  bookingUrl: string; nights: number; originalTotal: number; directTotal: number; saving: number;
};

type RoomKnowledge = {
  number: number;
  roomId: string;
  unitId: string;
  type: RoomType;
  categoryEl: string;
  floorEl: string;
  maxGuests: number;
  bedsEl: string;
  featuresEl: string[];
  image: string;
  priceRank: number;
  fiveGuestNote?: string;
};

const ROOM_URLS: Record<RoomType, Record<Language, string>> = {
  standard: {
    en: "/chios-rooms/standard-double-room/", el: "/el/domatia-xios/diklina-triklina-domatia/",
    fr: "/fr/chambres-a-chios/chambres-doubles-standard/", de: "/de/zimmer-chios/standard-doppelzimmer-auf-chios/",
    it: "/it/stanze-a-chios/camere-doppie-standard-chios/", es: "/es/habitaciones-en-chios/habitaciones-dobles-estandar/",
    tr: "/tr/chios-odalari/standart-cift-kisilik-odalar/",
  },
  economy: {
    en: "/chios-rooms/economy-double-rooms/", el: "/el/domatia-xios/oikonomiko-diklino-domatio/",
    fr: "/fr/chambres-a-chios/chambres-doubles-economiques/", de: "/de/zimmer-chios/economy-zimmer-auf-chios/",
    it: "/it/stanze-a-chios/camera-doppia-economica-chios/", es: "/es/habitaciones-en-chios/economicas-habitaciones-en-chios/",
    tr: "/tr/chios-odalari/sakiz-adasindaki-ekonomi-cift-kisilik-oda/",
  },
  family: {
    en: "/chios-rooms/family-chios-apartments/", el: "/el/domatia-xios/oikogeneiako-diamerisma/",
    fr: "/fr/chambres-a-chios/appartements-familiaux-de-chios/", de: "/de/zimmer-chios/familienapartments-in-chios/",
    it: "/it/stanze-a-chios/appartamenti-familiari-a-chios/", es: "/es/habitaciones-en-chios/apartamentos-familiares-en-chios/",
    tr: "/tr/chios-odalari/sakiz-adasinda-buyuk-aile-daireleri/",
  },
};

const COMMON_FEATURES = ["Κλιματισμός", "Δωρεάν Wi‑Fi", "Ψυγείο", "Ιδιωτικό μπάνιο", "Επίπεδη τηλεόραση", "Βραστήρας καφέ / τσαγιού", "Δωμάτιο μη καπνιστών"];

const ROOMS: RoomKnowledge[] = [
  { number: 1, roomId: "267788", unitId: "1", type: "standard", categoryEl: "Δωμάτιο ορόφου", floorEl: "Πρώτος όροφος · πρόσβαση με σκάλες", maxGuests: 4, bedsEl: "1 διπλό κρεβάτι και 2 μονά κρεβάτια", featuresEl: ["Ιδιωτικό μπαλκόνι", "Δύο χώροι χωρίς ενδιάμεση πόρτα", "Θέα ορόφου", ...COMMON_FEATURES], image: "/images/rooms/DSC07776-2-e1675109942622.webp", priceRank: 5 },
  { number: 2, roomId: "268803", unitId: "1", type: "economy", categoryEl: "Οικονομικό δίκλινο", floorEl: "Πρώτος όροφος · πρόσβαση με σκάλες", maxGuests: 2, bedsEl: "1 διπλό κρεβάτι", featuresEl: ["Ενιαίος χώρος", ...COMMON_FEATURES], image: "/images/rooms/DSC07803-1.webp", priceRank: 1 },
  { number: 3, roomId: "267788", unitId: "2", type: "standard", categoryEl: "Δωμάτιο ορόφου", floorEl: "Πρώτος όροφος · πρόσβαση με σκάλες", maxGuests: 3, bedsEl: "1 διπλό κρεβάτι και 1 μονό κρεβάτι", featuresEl: ["Kitchenette", "Δύο χώροι χωρίς ενδιάμεση πόρτα", "Θέα ορόφου", ...COMMON_FEATURES], image: "/images/rooms/DSC07867-1.webp", priceRank: 6 },
  { number: 4, roomId: "267788", unitId: "3", type: "standard", categoryEl: "Δωμάτιο ορόφου", floorEl: "Πρώτος όροφος · πρόσβαση με σκάλες", maxGuests: 3, bedsEl: "1 διπλό κρεβάτι και 1 καναπές-κρεβάτι", featuresEl: ["Kitchenette", "Ενιαίος χώρος", "Ιδιωτικό μπαλκόνι", "Θέα ορόφου", ...COMMON_FEATURES], image: "/images/rooms/received_1748354861920234.webp", priceRank: 7 },
  { number: 5, roomId: "626129", unitId: "1", type: "standard", categoryEl: "Δωμάτιο ισογείου", floorEl: "Ισόγειο · χωρίς σκάλες", maxGuests: 3, bedsEl: "1 διπλό κρεβάτι και 1 μονό κρεβάτι", featuresEl: ["Άμεση πρόσβαση στην αυλή και στον κήπο", "Ενιαίος χώρος", ...COMMON_FEATURES], image: "/images/rooms/voulamandis-house-rooms.webp", priceRank: 3 },
  { number: 6, roomId: "268803", unitId: "2", type: "economy", categoryEl: "Οικονομικό δίκλινο", floorEl: "Ισόγειο · χωρίς σκάλες", maxGuests: 2, bedsEl: "1 διπλό κρεβάτι", featuresEl: ["Θέα / πρόσβαση κήπου", "Ενιαίος χώρος", ...COMMON_FEATURES], image: "/images/rooms/received_1753964631359257.webp", priceRank: 2 },
  { number: 7, roomId: "626129", unitId: "2", type: "standard", categoryEl: "Δωμάτιο ισογείου", floorEl: "Ισόγειο · χωρίς σκάλες", maxGuests: 3, bedsEl: "1 διπλό κρεβάτι και 1 καναπές-κρεβάτι", featuresEl: ["Άμεση πρόσβαση στον κήπο", "Ενιαίος χώρος", ...COMMON_FEATURES], image: "/images/rooms/double-triple-room.jpg", priceRank: 4 },
  { number: 8, roomId: "265595", unitId: "1", type: "family", categoryEl: "Ανεξάρτητο διαμέρισμα", floorEl: "Ισόγειο · ανεξάρτητη είσοδος", maxGuests: 4, bedsEl: "1 διπλό κρεβάτι και 2 μονά κρεβάτια", featuresEl: ["Πλήρης κουζίνα", "Δύο χώροι", "Θέα / πρόσβαση κήπου", ...COMMON_FEATURES], image: "/images/rooms/chios-apartments-voulamandis.webp", priceRank: 8 },
  { number: 9, roomId: "265595", unitId: "2", type: "family", categoryEl: "Ανεξάρτητο διαμέρισμα", floorEl: "Ισόγειο · ανεξάρτητη είσοδος", maxGuests: 4, bedsEl: "1 διπλό κρεβάτι και 2 μονά κρεβάτια", featuresEl: ["Πλήρης κουζίνα", "Δύο χώροι", "Θέα / πρόσβαση κήπου", ...COMMON_FEATURES], image: "/images/rooms/chios-apartments-voulamandis.webp", priceRank: 9 },
  { number: 10, roomId: "265595", unitId: "3", type: "family", categoryEl: "Ανεξάρτητο διαμέρισμα", floorEl: "Ισόγειο · ανεξάρτητη είσοδος", maxGuests: 5, bedsEl: "1 διπλό κρεβάτι, 2 καναπέδες-κρεβάτια και, για 5ο άτομο, πρόσθετο κρεβάτι", featuresEl: ["Πλήρης κουζίνα", "Δύο χώροι", "Θέα / πρόσβαση κήπου", ...COMMON_FEATURES], image: "/images/rooms/DSC07899.webp", priceRank: 10, fiveGuestNote: "Για 5 άτομα διατίθεται υπό προϋποθέσεις: ο χώρος θα είναι πιο περιορισμένος και προστίθεται επιπλέον κρεβάτι, συνήθως στο δωμάτιο των γονιών. Συνιστάται κυρίως για οικογένεια και όχι για 5 ενήλικες που θέλουν περισσότερη άνεση." },
];

const ROOM_BY_KEY = new Map(ROOMS.map((room) => [`${room.roomId}:${room.unitId}`, room]));

function detectLanguage(messages: ChatMessage[], supplied?: string): Language {
  if (["en", "el", "fr", "de", "it", "es", "tr"].includes(supplied || "")) return supplied as Language;
  const text = messages.filter((m) => m.role === "user").map((m) => m.content).join(" ");
  if (/[Α-Ωα-ωΆ-ώ]/.test(text)) return "el";
  if (/[ğüşöçıİĞÜŞÖÇ]/i.test(text)) return "tr";
  if (/[äöüß]/i.test(text) || /\b(ich|zimmer|preis|möchte)\b/i.test(text)) return "de";
  if (/[éèêëàâçîïôùûüÿœ]/i.test(text) || /\b(je|chambre|prix|voudrais)\b/i.test(text)) return "fr";
  if (/\b(quiero|habitación|huéspedes)\b/i.test(text)) return "es";
  if (/\b(vorrei|camera|ospiti)\b/i.test(text)) return "it";
  return "el";
}

const isDate = (value?: string) => Boolean(value && /^\d{4}-\d{2}-\d{2}$/.test(value));
function addDays(date: string, days: number) { const d = new Date(`${date}T12:00:00Z`); d.setUTCDate(d.getUTCDate() + days); return d.toISOString().slice(0, 10); }
function stayNights(s: SearchState) { return Math.round((new Date(`${s.checkout}T12:00:00Z`).getTime() - new Date(`${s.checkin}T12:00:00Z`).getTime()) / 86400000); }

function resolveDate(day: number, month: number, year?: number) {
  const now = new Date(); let y = year || now.getUTCFullYear();
  let value = new Date(Date.UTC(y, month - 1, day, 12));
  const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  if (!year && value < today) value = new Date(Date.UTC(++y, month - 1, day, 12));
  if (value.getUTCDate() !== day || value.getUTCMonth() !== month - 1) return undefined;
  return value.toISOString().slice(0, 10);
}

function parseState(messages: ChatMessage[], current: SearchState): SearchState {
  const latest = [...messages].reverse().find((m) => m.role === "user")?.content.trim() || "";
  const wantsReset = /νέες?\s+ημερομην|αλλαγή\s+ημερομην|άλλες?\s+ημερομην|new\s+dates?|different\s+dates?/i.test(latest);
  const next: SearchState = wantsReset ? { guests: current.guests } : { ...current };
  const dates = [...latest.matchAll(/\b(\d{1,2})[\/-](\d{1,2})(?:[\/-](\d{2,4}))?\b/g)]
    .map((m) => resolveDate(Number(m[1]), Number(m[2]), m[3] ? (Number(m[3]) < 100 ? 2000 + Number(m[3]) : Number(m[3])) : undefined))
    .filter((v): v is string => Boolean(v));
  const nightMatch = latest.match(/\b(\d{1,2})\s*(?:νύχτες|νυχτες|βράδια|βραδια|βραδιά|nights?|nächte|nuits|notti|noches|gece)\b/i);
  if (dates.length >= 2) { next.checkin = dates[0]; next.checkout = dates[1]; }
  else if (dates.length === 1) {
    const clearlyNewStay = Boolean(nightMatch) || /\b(θέλω|θελω|από|απο|άφιξη|αφιξη|έρχομαι|ερχομαι|new|from|arrive)\b/i.test(latest);
    if (!next.checkin || clearlyNewStay || wantsReset) { next.checkin = dates[0]; next.checkout = undefined; }
    else next.checkout = dates[0];
  }
  const guestMatch = latest.match(/\b(\d{1,2})\s*(?:άτομα|ατομα|επισκέπτες|επισκεπτες|guests?|people|personen|ospiti|personas|kişi)\b/i);
  if (guestMatch) next.guests = Math.min(10, Math.max(1, Number(guestMatch[1])));
  if (nightMatch && next.checkin) next.checkout = addDays(next.checkin, Number(nightMatch[1]));
  const bareNumber = latest.match(/^\s*(\d{1,2})\s*$/);
  if (bareNumber) {
    const number = Number(bareNumber[1]);
    if (next.checkin && !next.checkout) next.checkout = addDays(next.checkin, number);
    else if (next.checkin && next.checkout && !next.guests) next.guests = Math.min(10, Math.max(1, number));
  }
  return next;
}

function missingQuestion(state: SearchState, language: Language) {
  if (language === "el") {
    if (!isDate(state.checkin)) return "Βεβαίως. Ποια ημερομηνία σκέφτεστε για άφιξη;";
    if (!isDate(state.checkout)) return "Ωραία. Για πόσες νύχτες θα θέλατε να μείνετε;";
    if (!state.guests) return "Και για πόσα άτομα είναι η διαμονή;";
  }
  if (!isDate(state.checkin)) return "When would you like to arrive?";
  if (!isDate(state.checkout)) return "How many nights would you like to stay?";
  if (!state.guests) return "How many guests will be staying?";
  return "";
}

function formatDate(value: string, language: Language) {
  const locale = language === "el" ? "el-GR" : language === "de" ? "de-DE" : language === "fr" ? "fr-FR" : language === "it" ? "it-IT" : language === "es" ? "es-ES" : language === "tr" ? "tr-TR" : "en-GB";
  return new Intl.DateTimeFormat(locale, { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(`${value}T12:00:00Z`));
}

function roomAllowedForGuests(room: RoomKnowledge, guests: number) {
  if (guests <= 2) return true;
  if (guests === 3) return [1, 3, 4, 5, 7, 8, 9, 10].includes(room.number);
  if (guests === 4) return [1, 8, 9, 10].includes(room.number);
  if (guests === 5) return room.number === 10;
  return false;
}

function answerRoomQuestion(text: string, language: Language) {
  if (language !== "el") return "";
  const normalized = text.toLowerCase();
  const isRoomQuestion = /δωμάτι|διαμέρισ|κρεβ|κρεβά|ψυγ|κουζ|σκάλα|ισόγει|όροφο|μπαλκόν|wifi|wi-fi|κλιματισ|μπάνιο|τηλεόρα|βραστήρ|5\s*άτομα|πέντε\s*άτομα/.test(normalized);
  if (!isRoomQuestion) return "";

  const roomNumberMatch = normalized.match(/(?:δωμάτιο|room|διαμέρισμα)\s*(10|[1-9])\b/);
  if (roomNumberMatch) {
    const room = ROOMS.find((item) => item.number === Number(roomNumberMatch[1]));
    if (!room) return "";
    const note = room.fiveGuestNote ? ` ${room.fiveGuestNote}` : "";
    return `Το δωμάτιο ${room.number} είναι ${room.categoryEl.toLowerCase()} και βρίσκεται: ${room.floorEl}. Φιλοξενεί έως ${room.maxGuests} άτομα. Διαθέτει ${room.bedsEl}. Βασικά χαρακτηριστικά: ${room.featuresEl.join(", ")}.${note}`;
  }

  if (/ψυγ/.test(normalized)) return "Ναι. Όλα τα δωμάτια και τα διαμερίσματα 1–10 διαθέτουν ψυγείο.";
  if (/χωρίς\s+σκάλα|δεν\s+έχει\s+σκάλα|ισόγει/.test(normalized)) return "Χωρίς σκάλες είναι τα δωμάτια 5, 6 και 7, καθώς και τα ισόγεια ανεξάρτητα διαμερίσματα 8, 9 και 10.";
  if (/κουζ/.test(normalized)) return "Kitchenette διαθέτουν τα δωμάτια 3 και 4. Πλήρη κουζίνα διαθέτουν τα ανεξάρτητα διαμερίσματα 8, 9 και 10.";
  if (/μπαλκόν/.test(normalized)) return "Ιδιωτικό μπαλκόνι διαθέτουν τα δωμάτια 1 και 4.";
  if (/5\s*άτομα|πέντε\s*άτομα/.test(normalized)) return `Για 5 άτομα μπορεί να προταθεί μόνο το διαμέρισμα 10, υπό προϋποθέσεις. ${ROOMS.find((room) => room.number === 10)?.fiveGuestNote}`;
  if (/οικονομ/.test(normalized)) return "Τα οικονομικά δίκλινα είναι τα δωμάτια 2 και 6. Και τα δύο έχουν μόνο 1 διπλό κρεβάτι και φιλοξενούν έως 2 άτομα.";
  if (/σειρά|φθην|οικονομικότερο|τιμή/.test(normalized)) return "Η σειρά των κατηγοριών από οικονομικότερη προς ακριβότερη είναι: οικονομικά δίκλινα 2 και 6, δωμάτια ισογείου 5 και 7, δωμάτια ορόφου 1, 3 και 4, και τέλος διαμερίσματα 8, 9 και 10.";
  return "Μπορώ να σας εξηγήσω αναλυτικά τη θέση, τα κρεβάτια και τις παροχές κάθε δωματίου. Γράψτε μου τον αριθμό του δωματίου ή το χαρακτηριστικό που σας ενδιαφέρει.";
}

async function searchOffers(search: SearchState, language: Language, origin: string): Promise<Offer[]> {
  const nights = stayNights(search);
  const url = new URL("/api/booking/search-range", origin);
  url.searchParams.set("checkin", search.checkin!);
  url.searchParams.set("checkout", search.checkout!);
  url.searchParams.set("guests", String(search.guests));
  const response = await fetch(url.toString(), { method: "GET", cache: "no-store" });
  const data = await response.json().catch(() => null);
  if (!response.ok || !data || !Array.isArray(data?.rooms?.available)) throw new Error("Availability service unavailable");

  return data.rooms.available.map((room: any) => {
    const meta = ROOM_BY_KEY.get(`${room.roomId}:${room.unitId}`);
    if (!meta || !roomAllowedForGuests(meta, Number(search.guests))) return null;
    const rawTotal = Number(room?.totalPrice ?? room?.price ?? room?.total ?? room?.roomTotal ?? 0);
    if (!(rawTotal > 0)) return null;
    const originalTotal = Math.round(rawTotal * 100) / 100;
    const directTotal = Math.round(originalTotal * 0.9 * 100) / 100;
    const fiveGuestFeature = Number(search.guests) === 5 && meta.fiveGuestNote ? [meta.fiveGuestNote] : [];
    return {
      roomId: meta.roomId,
      unitId: meta.unitId,
      name: `Room ${meta.number}`,
      category: `${meta.categoryEl} · ${meta.floorEl}`,
      floor: meta.floorEl,
      maxGuests: meta.maxGuests,
      features: [meta.bedsEl, ...meta.featuresEl, ...fiveGuestFeature],
      image: meta.image,
      detailsUrl: ROOM_URLS[meta.type][language] || ROOM_URLS[meta.type].en,
      bookingUrl: "/book-now",
      nights,
      originalTotal,
      directTotal,
      saving: Math.round((originalTotal - directTotal) * 100) / 100,
      priceRank: meta.priceRank,
    };
  }).filter(Boolean).sort((a: any, b: any) => a.priceRank - b.priceRank || a.directTotal - b.directTotal).map(({ priceRank, ...offer }: any) => offer as Offer);
}

function offerIntro(language: Language) {
  if (language === "el") return "Οι επιλογές εμφανίζονται από την οικονομικότερη κατηγορία προς την ακριβότερη: οικονομικά δίκλινα, δωμάτια ισογείου, δωμάτια ορόφου και διαμερίσματα. Σε κάθε επιλογή αναγράφεται αν είναι ισόγειο ή όροφος.";
  if (language === "de") return "Die Optionen werden von der günstigsten bis zur teuersten Kategorie angezeigt: Economy-Doppelzimmer, Erdgeschosszimmer, Zimmer im Obergeschoss und Apartments. Bei jeder Option ist die Etage angegeben.";
  if (language === "fr") return "Les options sont classées de la catégorie la moins chère à la plus chère : doubles économiques, chambres au rez-de-chaussée, chambres à l’étage et appartements. L’étage est indiqué pour chaque option.";
  if (language === "it") return "Le opzioni sono mostrate dalla categoria più economica alla più costosa: doppie economy, camere al piano terra, camere al primo piano e appartamenti. Per ogni opzione è indicato il piano.";
  if (language === "es") return "Las opciones se muestran de la categoría más económica a la más cara: dobles económicas, habitaciones en planta baja, habitaciones en planta superior y apartamentos. En cada opción se indica la planta.";
  if (language === "tr") return "Seçenekler en ekonomik kategoriden en pahalıya doğru gösterilir: ekonomik çift kişilik odalar, zemin kat odaları, üst kat odaları ve daireler. Her seçenekte kat bilgisi belirtilir.";
  return "Options are shown from the least expensive category to the most expensive: economy doubles, ground-floor rooms, first-floor rooms and apartments. The floor is stated on every option.";
}

async function findNearby(search: SearchState, language: Language, origin: string) {
  const nights = stayNights(search);
  for (const offset of [-1, 1, -2, 2, -3, 3]) {
    const candidate = { checkin: addDays(search.checkin!, offset), checkout: addDays(search.checkin!, offset + nights), guests: search.guests };
    const offers = await searchOffers(candidate, language, origin).catch(() => []);
    if (offers.length) return { search: candidate, offers };
  }
  return null;
}

async function findSplitStay(search: SearchState, language: Language, origin: string) {
  const nights = stayNights(search);
  if (nights < 2 || nights > 7) return null;
  for (let split = 1; split < nights; split++) {
    const first = { checkin: search.checkin, checkout: addDays(search.checkin!, split), guests: search.guests };
    const second = { checkin: first.checkout, checkout: search.checkout, guests: search.guests };
    const [a, b] = await Promise.all([searchOffers(first, language, origin).catch(() => []), searchOffers(second, language, origin).catch(() => [])]);
    if (a.length && b.length) return { first: a[0], second: b[0], changeDate: first.checkout };
  }
  return null;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const messages: ChatMessage[] = Array.isArray(body?.messages) ? body.messages.filter((m: any) => (m?.role === "user" || m?.role === "assistant") && typeof m?.content === "string").slice(-12) : [];
    if (!messages.length) return NextResponse.json({ error: "Please enter a message." }, { status: 400 });
    const language = detectLanguage(messages, body?.language);
    const latest = [...messages].reverse().find((m) => m.role === "user")?.content || "";
    const knowledgeAnswer = answerRoomQuestion(latest, language);
    if (knowledgeAnswer) return NextResponse.json({ answer: knowledgeAnswer, search: body?.search || {}, offers: [], language });

    const search = parseState(messages, body?.search || {});
    const question = missingQuestion(search, language);
    if (question) return NextResponse.json({ answer: question, search, offers: [], language });

    const offers = await searchOffers(search, language, request.nextUrl.origin);
    const checkin = formatDate(search.checkin!, language);
    const checkout = formatDate(search.checkout!, language);
    if (offers.length) {
      const fiveGuestWarning = Number(search.guests) === 5 && language === "el" ? ` ${ROOMS.find((room) => room.number === 10)?.fiveGuestNote}` : "";
      const answer = language === "el"
        ? `Βρήκα ${offers.length} ${offers.length === 1 ? "διαθέσιμη επιλογή" : "διαθέσιμες επιλογές"} για ${search.guests} άτομα, ${checkin}–${checkout}. ${offerIntro(language)}${fiveGuestWarning}`
        : `I found ${offers.length} available options for ${search.guests} guests, ${checkin}–${checkout}. ${offerIntro(language)}`;
      return NextResponse.json({ answer, search, offers, language, discountPercent: DIRECT_DISCOUNT_PERCENT });
    }

    const [nearby, split] = await Promise.all([findNearby(search, language, request.nextUrl.origin), findSplitStay(search, language, request.nextUrl.origin)]);
    if (language === "el") {
      if (nearby) {
        const nIn = formatDate(nearby.search.checkin!, language); const nOut = formatDate(nearby.search.checkout!, language);
        const splitText = split ? ` Υπάρχει επίσης δυνατότητα split stay στις αρχικές ημερομηνίες, με μία αλλαγή δωματίου στις ${formatDate(split.changeDate!, language)} (${split.first.name} και μετά ${split.second.name}).` : "";
        return NextResponse.json({ answer: `Δεν βρήκα ένα δωμάτιο για όλες τις αρχικές ημερομηνίες, αλλά βρήκα μια κοντινή λύση: ${nIn}–${nOut}.${splitText} ${offerIntro(language)}`, search: nearby.search, offers: nearby.offers, language, discountPercent: DIRECT_DISCOUNT_PERCENT });
      }
      if (split) return NextResponse.json({ answer: `Δεν υπάρχει ένα δωμάτιο για ολόκληρη τη διαμονή, αλλά μπορούμε να σας φιλοξενήσουμε με μία μόνο αλλαγή δωματίου: ${split.first.name} και από ${formatDate(split.changeDate!, language)} ${split.second.name}. Η reception μπορεί να οργανώσει την αλλαγή όσο πιο άνετα γίνεται.`, search, offers: [], language, discountPercent: DIRECT_DISCOUNT_PERCENT });
      return NextResponse.json({ answer: `Δεν βρήκα διαθεσιμότητα για ${checkin}–${checkout}. Αν οι ημερομηνίες σας είναι λίγο ευέλικτες, γράψτε μου μία κοντινή ημερομηνία ή «νέες ημερομηνίες» και θα ψάξω ξανά.`, search, offers: [], language, discountPercent: DIRECT_DISCOUNT_PERCENT });
    }
    return NextResponse.json({ answer: "I couldn't find one room for the full stay, but I can check nearby dates or a split stay with only one room change. Are your dates flexible?", search, offers: nearby?.offers || [], language, discountPercent: DIRECT_DISCOUNT_PERCENT });
  } catch (error) {
    console.error("AI assistant route error", error);
    return NextResponse.json({ error: "Δεν μπόρεσα να ολοκληρώσω τον ζωντανό έλεγχο αυτή τη στιγμή. Παρακαλώ δοκιμάστε ξανά σε λίγο." }, { status: 502 });
  }
}
