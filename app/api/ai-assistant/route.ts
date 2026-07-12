import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DIRECT_DISCOUNT_PERCENT = 10;

type Language = "en" | "el" | "fr" | "de" | "it" | "es" | "tr";
type RoomType = "standard" | "economy" | "family";
type ChatMessage = { role: "user" | "assistant"; content: string };
type SearchState = { checkin?: string; checkout?: string; guests?: number };
type Offer = {
  roomId: string;
  unitId: string;
  name: string;
  category: string;
  floor: string;
  maxGuests: number;
  features: string[];
  image: string;
  detailsUrl: string;
  bookingUrl: string;
  nights: number;
  originalTotal: number;
  directTotal: number;
  saving: number;
  preview?: boolean;
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
    en: "/chios-rooms/standard-double-room/",
    el: "/el/domatia-xios/diklina-triklina-domatia/",
    fr: "/fr/chambres-a-chios/chambres-doubles-standard/",
    de: "/de/zimmer-chios/standard-doppelzimmer-auf-chios/",
    it: "/it/stanze-a-chios/camere-doppie-standard-chios/",
    es: "/es/habitaciones-en-chios/habitaciones-dobles-estandar/",
    tr: "/tr/chios-odalari/standart-cift-kisilik-odalar/",
  },
  economy: {
    en: "/chios-rooms/economy-double-rooms/",
    el: "/el/domatia-xios/oikonomiko-diklino-domatio/",
    fr: "/fr/chambres-a-chios/chambres-doubles-economiques/",
    de: "/de/zimmer-chios/economy-zimmer-auf-chios/",
    it: "/it/stanze-a-chios/camera-doppia-economica-chios/",
    es: "/es/habitaciones-en-chios/economicas-habitaciones-en-chios/",
    tr: "/tr/chios-odalari/sakiz-adasindaki-ekonomi-cift-kisilik-oda/",
  },
  family: {
    en: "/chios-rooms/family-chios-apartments/",
    el: "/el/domatia-xios/oikogeneiako-diamerisma/",
    fr: "/fr/chambres-a-chios/appartements-familiaux-de-chios/",
    de: "/de/zimmer-chios/familienapartments-in-chios/",
    it: "/it/stanze-a-chios/appartamenti-familiari-a-chios/",
    es: "/es/habitaciones-en-chios/apartamentos-familiares-en-chios/",
    tr: "/tr/chios-odalari/sakiz-adasinda-buyuk-aile-daireleri/",
  },
};

const COMMON_FEATURES = [
  "Κλιματισμός",
  "Δωρεάν Wi‑Fi",
  "Ψυγείο",
  "Ιδιωτικό μπάνιο",
  "Επίπεδη τηλεόραση",
  "Βραστήρας καφέ / τσαγιού",
  "Δωμάτιο μη καπνιστών",
];

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
  if (/[äöüß]/i.test(text)) return "de";
  if (/[éèêëàâçîïôùûüÿœ]/i.test(text)) return "fr";
  if (/\b(quiero|habitación|huéspedes)\b/i.test(text)) return "es";
  if (/\b(vorrei|camera|ospiti)\b/i.test(text)) return "it";
  return "el";
}

const isDate = (value?: string) => Boolean(value && /^\d{4}-\d{2}-\d{2}$/.test(value));
function addDays(date: string, days: number) { const d = new Date(`${date}T12:00:00Z`); d.setUTCDate(d.getUTCDate() + days); return d.toISOString().slice(0, 10); }
function stayNights(s: SearchState) { return Math.round((new Date(`${s.checkout}T12:00:00Z`).getTime() - new Date(`${s.checkin}T12:00:00Z`).getTime()) / 86400000); }
function resolveDate(day: number, month: number, year?: number) { const now = new Date(); let y = year || now.getUTCFullYear(); let value = new Date(Date.UTC(y, month - 1, day, 12)); const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())); if (!year && value < today) value = new Date(Date.UTC(++y, month - 1, day, 12)); if (value.getUTCDate() !== day || value.getUTCMonth() !== month - 1) return undefined; return value.toISOString().slice(0, 10); }

function parseState(messages: ChatMessage[], current: SearchState): SearchState {
  const latest = [...messages].reverse().find((m) => m.role === "user")?.content.trim() || "";
  const wantsReset = /νέες?\s+ημερομην|αλλαγή\s+ημερομην|άλλες?\s+ημερομην|new\s+dates?|different\s+dates?/i.test(latest);
  const next: SearchState = wantsReset ? { guests: current.guests } : { ...current };
  const dates = [...latest.matchAll(/\b(\d{1,2})[\/-](\d{1,2})(?:[\/-](\d{2,4}))?\b/g)].map((m) => resolveDate(Number(m[1]), Number(m[2]), m[3] ? (Number(m[3]) < 100 ? 2000 + Number(m[3]) : Number(m[3])) : undefined)).filter((v): v is string => Boolean(v));
  const nightMatch = latest.match(/\b(\d{1,2})\s*(?:νύχτες|νυχτες|βράδια|βραδια|βραδιά|nights?|nächte|nuits|notti|noches|gece)\b/i);
  if (dates.length >= 2) { next.checkin = dates[0]; next.checkout = dates[1]; }
  else if (dates.length === 1) { if (!next.checkin || nightMatch || wantsReset) { next.checkin = dates[0]; next.checkout = undefined; } else next.checkout = dates[0]; }
  const guestMatch = latest.match(/\b(\d{1,2})\s*(?:άτομα|ατομα|επισκέπτες|επισκεπτες|guests?|people|personen|ospiti|personas|kişi)\b/i);
  if (guestMatch) next.guests = Math.min(10, Math.max(1, Number(guestMatch[1])));
  if (nightMatch && next.checkin) next.checkout = addDays(next.checkin, Number(nightMatch[1]));
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

function findReferencedRoom(messages: ChatMessage[]) {
  const userTexts = messages.filter((m) => m.role === "user").map((m) => m.content).reverse();
  for (const text of userTexts) {
    const normalized = text.toLowerCase();
    const match = normalized.match(/(?:δωμάτιο|room|διαμέρισμα|apartment)?\s*(10|[1-9])\b/);
    if (match && /(δωμάτι|room|διαμέρισ|apartment|δείξε|δειξε|φωτογραφ|photo|θέλω\s+να\s+δω|θελω\s+να\s+δω)/i.test(normalized)) {
      return ROOMS.find((room) => room.number === Number(match[1]));
    }
  }
  return undefined;
}

function previewOffer(room: RoomKnowledge, language: Language): Offer {
  return {
    roomId: room.roomId,
    unitId: room.unitId,
    name: `Room ${room.number}`,
    category: `${room.categoryEl} · ${room.floorEl}`,
    floor: room.floorEl,
    maxGuests: room.maxGuests,
    features: [room.bedsEl, ...room.featuresEl, ...(room.fiveGuestNote ? [room.fiveGuestNote] : [])],
    image: room.image,
    detailsUrl: ROOM_URLS[room.type][language] || ROOM_URLS[room.type].en,
    bookingUrl: "/book-now",
    nights: 0,
    originalTotal: 0,
    directTotal: 0,
    saving: 0,
    preview: true,
  };
}

function roomKnowledge(messages: ChatMessage[], language: Language) {
  if (language !== "el") return null;
  const latest = [...messages].reverse().find((m) => m.role === "user")?.content.toLowerCase() || "";
  const room = findReferencedRoom(messages);
  const wantsPhotos = /φωτογραφ|photo|δείξε|δειξε|θέλω\s+να\s+δω|θελω\s+να\s+δω/.test(latest);
  if (room && (wantsPhotos || /δωμάτι|διαμέρισ|room|apartment/.test(latest))) {
    const note = room.fiveGuestNote ? ` ${room.fiveGuestNote}` : "";
    return {
      answer: `Αυτό είναι το δωμάτιο ${room.number}. Είναι ${room.categoryEl.toLowerCase()} και βρίσκεται: ${room.floorEl}. Φιλοξενεί έως ${room.maxGuests} άτομα και διαθέτει ${room.bedsEl}. Πατήστε την κάρτα για να δείτε όλες τις σωστές φωτογραφίες και τις παροχές.${note}`,
      offers: [previewOffer(room, language)],
    };
  }
  if (/δεν\s+ξέρω\s+ακόμα|δεν\s+ξερω\s+ακομα|δεν\s+έχω\s+ημερομην|δεν\s+εχω\s+ημερομην/.test(latest)) {
    return { answer: "Κανένα πρόβλημα. Μπορείτε πρώτα να δείτε τα δωμάτια και τις φωτογραφίες τους. Γράψτε, για παράδειγμα, «δείξε μου το δωμάτιο 2».", offers: [] as Offer[] };
  }
  if (/ψυγ/.test(latest)) return { answer: "Ναι. Όλα τα δωμάτια και τα διαμερίσματα 1–10 διαθέτουν ψυγείο.", offers: [] as Offer[] };
  if (/χωρίς\s+σκάλα|δεν\s+έχει\s+σκάλα|ισόγει/.test(latest)) return { answer: "Χωρίς σκάλες είναι τα δωμάτια 5, 6 και 7, καθώς και τα ισόγεια ανεξάρτητα διαμερίσματα 8, 9 και 10.", offers: [] as Offer[] };
  if (/κουζ/.test(latest)) return { answer: "Kitchenette διαθέτουν τα δωμάτια 3 και 4. Πλήρη κουζίνα διαθέτουν τα ανεξάρτητα διαμερίσματα 8, 9 και 10.", offers: [] as Offer[] };
  if (/οικονομ/.test(latest)) return { answer: "Τα οικονομικά δίκλινα είναι τα δωμάτια 2 και 6. Και τα δύο έχουν μόνο 1 διπλό κρεβάτι και φιλοξενούν έως 2 άτομα.", offers: [] as Offer[] };
  return null;
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
    return {
      roomId: meta.roomId,
      unitId: meta.unitId,
      name: `Room ${meta.number}`,
      category: `${meta.categoryEl} · ${meta.floorEl}`,
      floor: meta.floorEl,
      maxGuests: meta.maxGuests,
      features: [meta.bedsEl, ...meta.featuresEl],
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
  if (language === "el") return "Οι επιλογές εμφανίζονται από την οικονομικότερη κατηγορία προς την ακριβότερη. Σε κάθε επιλογή αναγράφεται αν είναι ισόγειο ή όροφος.";
  return "Options are shown from the least expensive category to the most expensive, with the floor stated on every option.";
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const messages: ChatMessage[] = Array.isArray(body?.messages) ? body.messages.filter((m: any) => (m?.role === "user" || m?.role === "assistant") && typeof m?.content === "string").slice(-12) : [];
    if (!messages.length) return NextResponse.json({ error: "Please enter a message." }, { status: 400 });

    const language = detectLanguage(messages, body?.language);
    const knowledge = roomKnowledge(messages, language);
    if (knowledge) return NextResponse.json({ answer: knowledge.answer, search: body?.search || {}, offers: knowledge.offers, language });

    const search = parseState(messages, body?.search || {});
    const question = missingQuestion(search, language);
    if (question) return NextResponse.json({ answer: question, search, offers: [], language });

    const offers = await searchOffers(search, language, request.nextUrl.origin);
    const checkin = formatDate(search.checkin!, language);
    const checkout = formatDate(search.checkout!, language);
    if (offers.length) {
      const answer = language === "el"
        ? `Βρήκα ${offers.length} ${offers.length === 1 ? "διαθέσιμη επιλογή" : "διαθέσιμες επιλογές"} για ${search.guests} άτομα, ${checkin}–${checkout}. ${offerIntro(language)}`
        : `I found ${offers.length} available options for ${search.guests} guests, ${checkin}–${checkout}. ${offerIntro(language)}`;
      return NextResponse.json({ answer, search, offers, language, discountPercent: DIRECT_DISCOUNT_PERCENT });
    }

    return NextResponse.json({
      answer: language === "el" ? `Δεν βρήκα διαθεσιμότητα για ${checkin}–${checkout}. Δοκιμάστε κοντινές ημερομηνίες.` : `I couldn't find availability for ${checkin}–${checkout}. Please try nearby dates.`,
      search,
      offers: [],
      language,
      discountPercent: DIRECT_DISCOUNT_PERCENT,
    });
  } catch (error) {
    console.error("AI assistant route error", error);
    return NextResponse.json({ error: "Δεν μπόρεσα να ολοκληρώσω τον έλεγχο αυτή τη στιγμή. Παρακαλώ δοκιμάστε ξανά σε λίγο." }, { status: 502 });
  }
}
