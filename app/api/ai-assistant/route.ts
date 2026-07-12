import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DIRECT_DISCOUNT_PERCENT = 10;
const BOOKING_WEBAPP_URL =
  process.env.GOOGLE_BOOKING_SEARCH_WEBAPP_URL ||
  "https://script.google.com/macros/s/AKfycbwZ8qG1eE1YXr-Ag2LXNHrgFIkf7kCvDiTMF38NfPNC9ZGAquGMIXvn3QWPfpiKpTaa/exec";

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

const ROOM_META: Record<string, { features: string[]; image: string; type: RoomType }> = {
  "267788:1": { features: ["First floor", "Wi-Fi", "Coffee & tea kettle", "Private balcony", "Upper-floor view", "Stairs", "1 double bed", "2 single beds", "Two spaces"], image: "/images/rooms/DSC07776-2-e1675109942622.webp", type: "standard" },
  "268803:1": { features: ["First floor", "Wi-Fi", "Coffee & tea kettle", "Stairs", "1 double bed", "Open-plan space"], image: "/images/rooms/DSC07803-1.webp", type: "economy" },
  "267788:2": { features: ["First floor", "Wi-Fi", "Coffee & tea kettle", "Private balcony", "Upper-floor view", "Kitchenette", "Stairs", "1 double bed", "1 single bed", "Two spaces"], image: "/images/rooms/DSC07867-1.webp", type: "standard" },
  "267788:3": { features: ["First floor", "Wi-Fi", "Coffee & tea kettle", "Private balcony", "Upper-floor view", "Kitchenette", "Stairs", "1 double bed", "1 sofa bed", "Open-plan space"], image: "/images/rooms/received_1748354861920234.webp", type: "standard" },
  "626129:1": { features: ["Ground floor", "Wi-Fi", "Coffee & tea kettle", "Garden view", "No stairs", "1 double bed", "1 single bed", "Open-plan space"], image: "/images/rooms/voulamandis-house-rooms.webp", type: "standard" },
  "268803:2": { features: ["Ground floor", "Wi-Fi", "Coffee & tea kettle", "Garden view", "No stairs", "1 double bed", "Open-plan space"], image: "/images/rooms/received_1753964631359257.webp", type: "economy" },
  "626129:2": { features: ["Ground floor", "Wi-Fi", "Coffee & tea kettle", "Garden view", "No stairs", "1 double bed", "1 single bed"], image: "/images/rooms/double-triple-room.jpg", type: "standard" },
  "265595:1": { features: ["Independent apartment", "Kitchen", "Garden view", "Up to 4 guests"], image: "/images/rooms/chios-apartments-voulamandis.webp", type: "family" },
  "265595:2": { features: ["Independent apartment", "Kitchen", "Garden view", "Up to 4 guests"], image: "/images/rooms/chios-apartments-voulamandis.webp", type: "family" },
  "265595:3": { features: ["Independent apartment", "Kitchen", "Garden view", "Up to 4 guests"], image: "/images/rooms/DSC07899.webp", type: "family" },
};

function detectLanguage(messages: ChatMessage[], supplied?: string): Language {
  if (["en", "el", "fr", "de", "it", "es", "tr"].includes(supplied || "")) return supplied as Language;
  const text = messages.filter((m) => m.role === "user").map((m) => m.content).join(" ");
  if (/[Α-Ωα-ωΆ-ώ]/.test(text)) return "el";
  if (/[ğüşöçıİĞÜŞÖÇ]/i.test(text)) return "tr";
  if (/[äöüß]/i.test(text) || /\b(ich|zimmer|preis|möchte)\b/i.test(text)) return "de";
  if (/[éèêëàâçîïôùûüÿœ]/i.test(text) || /\b(je|chambre|prix|voudrais)\b/i.test(text)) return "fr";
  if (/\b(quiero|habitación|huéspedes)\b/i.test(text)) return "es";
  if (/\b(vorrei|camera|ospiti)\b/i.test(text)) return "it";
  return "en";
}

const isDate = (value?: string) => Boolean(value && /^\d{4}-\d{2}-\d{2}$/.test(value));

function addDays(date: string, days: number) {
  const value = new Date(`${date}T12:00:00Z`);
  value.setUTCDate(value.getUTCDate() + days);
  return value.toISOString().slice(0, 10);
}

function resolveDate(day: number, month: number, year?: number) {
  const now = new Date();
  let resolvedYear = year || now.getUTCFullYear();
  let value = new Date(Date.UTC(resolvedYear, month - 1, day, 12));
  const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  if (!year && value < today) value = new Date(Date.UTC(++resolvedYear, month - 1, day, 12));
  if (value.getUTCDate() !== day || value.getUTCMonth() !== month - 1) return undefined;
  return value.toISOString().slice(0, 10);
}

function parseState(messages: ChatMessage[], current: SearchState): SearchState {
  const latest = [...messages].reverse().find((m) => m.role === "user")?.content.trim() || "";
  const next = { ...current };
  const dates = [...latest.matchAll(/\b(\d{1,2})[\/-](\d{1,2})(?:[\/-](\d{2,4}))?\b/g)]
    .map((m) => resolveDate(Number(m[1]), Number(m[2]), m[3] ? (Number(m[3]) < 100 ? 2000 + Number(m[3]) : Number(m[3])) : undefined))
    .filter((v): v is string => Boolean(v));

  if (dates.length >= 2) {
    next.checkin = dates[0];
    next.checkout = dates[1];
  } else if (dates.length === 1) {
    if (!next.checkin) next.checkin = dates[0];
    else next.checkout = dates[0];
  }

  const guestMatch = latest.match(/\b(\d{1,2})\s*(?:άτομα|ατομα|επισκέπτες|επισκεπτες|guests?|people|personen|ospiti|personas|kişi)\b/i);
  if (guestMatch) next.guests = Math.min(10, Math.max(1, Number(guestMatch[1])));

  const nightMatch = latest.match(/\b(\d{1,2})\s*(?:νύχτες|νυχτες|βράδια|βραδια|nights?|nächte|nuits|notti|noches|gece)\b/i);
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
    if (!isDate(state.checkin)) return "Πότε θέλετε να έρθετε; Γράψτε π.χ. «19/08».";
    if (!isDate(state.checkout)) return "Για πόσες νύχτες θέλετε να μείνετε;";
    if (!state.guests) return "Για πόσα άτομα είναι η διαμονή;";
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

async function searchOffers(search: SearchState, language: Language): Promise<Offer[]> {
  const nights = Math.round((new Date(`${search.checkout}T12:00:00Z`).getTime() - new Date(`${search.checkin}T12:00:00Z`).getTime()) / 86400000);
  const url = new URL(BOOKING_WEBAPP_URL);
  url.searchParams.set("action", "search_range");
  url.searchParams.set("checkin", search.checkin!);
  url.searchParams.set("checkout", search.checkout!);
  url.searchParams.set("guests", String(search.guests));

  const response = await fetch(url.toString(), {
    headers: { Accept: "application/json", "User-Agent": "VoulamandisHouseAI/3.0" },
    cache: "no-store",
  });
  const text = await response.text();
  let data: any;
  try { data = JSON.parse(text); } catch { throw new Error("Invalid availability response"); }

  // The Apps Script response does not always include success:true.
  // rooms.available is the authoritative result, matching Find Your Room.
  if (!response.ok || !Array.isArray(data?.rooms?.available)) {
    console.error("Availability service error", response.status, text.slice(0, 300));
    throw new Error("Availability service unavailable");
  }

  return data.rooms.available
    .filter((room: any) => Number(room?.maxGuests || 0) >= Number(search.guests))
    .map((room: any) => {
      const originalTotal = Number(room?.totalPrice || 0);
      const directTotal = Math.round(originalTotal * 0.9 * 100) / 100;
      const meta = ROOM_META[`${room.roomId}:${room.unitId}`] || { features: [], image: "/images/rooms/voulamandis-house-rooms.webp", type: "standard" as RoomType };
      return {
        roomId: String(room.roomId), unitId: String(room.unitId),
        name: String(room.displayName || room.name || `Room ${room.unitId}`),
        category: String(room.category || room.roomName || "Room"), floor: String(room.location || ""),
        maxGuests: Number(room.maxGuests || 0), features: meta.features, image: meta.image,
        detailsUrl: ROOM_URLS[meta.type][language] || ROOM_URLS[meta.type].en,
        bookingUrl: "/book-now", nights,
        originalTotal: Math.round(originalTotal * 100) / 100, directTotal,
        saving: Math.round((originalTotal - directTotal) * 100) / 100,
      } satisfies Offer;
    })
    .filter((offer: Offer) => offer.originalTotal > 0)
    .sort((a: Offer, b: Offer) => a.directTotal - b.directTotal)
    .slice(0, 10);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const messages: ChatMessage[] = Array.isArray(body?.messages)
      ? body.messages.filter((m: any) => (m?.role === "user" || m?.role === "assistant") && typeof m?.content === "string").slice(-12)
      : [];
    if (!messages.length) return NextResponse.json({ error: "Please enter a message." }, { status: 400 });

    const language = detectLanguage(messages, body?.language);
    const search = parseState(messages, body?.search || {});
    const question = missingQuestion(search, language);
    if (question) return NextResponse.json({ answer: question, search, offers: [], language });

    const offers = await searchOffers(search, language);
    const checkin = formatDate(search.checkin!, language);
    const checkout = formatDate(search.checkout!, language);
    const answer = language === "el"
      ? offers.length
        ? `Βρήκα ${offers.length} διαθέσιμες ${offers.length === 1 ? "επιλογή" : "επιλογές"} για ${search.guests} άτομα, ${checkin}–${checkout}. Πατήστε σε ένα δωμάτιο για λεπτομέρειες.`
        : `Δεν βρέθηκε διαθέσιμο δωμάτιο για ${search.guests} άτομα, ${checkin}–${checkout}.`
      : offers.length
        ? `I found ${offers.length} available options for ${search.guests} guests, ${checkin}–${checkout}. Tap a room for details.`
        : `No available room was found for ${search.guests} guests, ${checkin}–${checkout}.`;

    return NextResponse.json({ answer, search, offers, language, discountPercent: DIRECT_DISCOUNT_PERCENT });
  } catch (error) {
    console.error("AI assistant route error", error);
    return NextResponse.json({ error: "Δεν ήταν δυνατός ο ζωντανός έλεγχος διαθεσιμότητας. Δοκιμάστε ξανά." }, { status: 502 });
  }
}
