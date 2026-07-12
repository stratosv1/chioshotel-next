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

const ROOM_META: Record<string, { features: string[]; image: string; type: RoomType; maxGuests: number }> = {
  "267788:1": { features: ["First floor", "Wi-Fi", "Coffee & tea kettle", "Private balcony", "Upper-floor view", "Stairs", "1 double bed", "2 single beds", "Two spaces"], image: "/images/rooms/DSC07776-2-e1675109942622.webp", type: "standard", maxGuests: 4 },
  "268803:1": { features: ["First floor", "Wi-Fi", "Coffee & tea kettle", "Stairs", "1 double bed", "Open-plan space"], image: "/images/rooms/DSC07803-1.webp", type: "economy", maxGuests: 2 },
  "267788:2": { features: ["First floor", "Wi-Fi", "Coffee & tea kettle", "Private balcony", "Upper-floor view", "Kitchenette", "Stairs", "1 double bed", "1 single bed", "Two spaces"], image: "/images/rooms/DSC07867-1.webp", type: "standard", maxGuests: 3 },
  "267788:3": { features: ["First floor", "Wi-Fi", "Coffee & tea kettle", "Private balcony", "Upper-floor view", "Kitchenette", "Stairs", "1 double bed", "1 sofa bed", "Open-plan space"], image: "/images/rooms/received_1748354861920234.webp", type: "standard", maxGuests: 3 },
  "626129:1": { features: ["Ground floor", "Wi-Fi", "Coffee & tea kettle", "Garden view", "No stairs", "1 double bed", "1 single bed", "Open-plan space"], image: "/images/rooms/voulamandis-house-rooms.webp", type: "standard", maxGuests: 3 },
  "268803:2": { features: ["Ground floor", "Wi-Fi", "Coffee & tea kettle", "Garden view", "No stairs", "1 double bed", "Open-plan space"], image: "/images/rooms/received_1753964631359257.webp", type: "economy", maxGuests: 2 },
  "626129:2": { features: ["Ground floor", "Wi-Fi", "Coffee & tea kettle", "Garden view", "No stairs", "1 double bed", "1 single bed"], image: "/images/rooms/double-triple-room.jpg", type: "standard", maxGuests: 3 },
  "265595:1": { features: ["Independent apartment", "Kitchen", "Garden view", "Up to 4 guests"], image: "/images/rooms/chios-apartments-voulamandis.webp", type: "family", maxGuests: 4 },
  "265595:2": { features: ["Independent apartment", "Kitchen", "Garden view", "Up to 4 guests"], image: "/images/rooms/chios-apartments-voulamandis.webp", type: "family", maxGuests: 4 },
  "265595:3": { features: ["Independent apartment", "Kitchen", "Garden view", "Up to 4 guests"], image: "/images/rooms/DSC07899.webp", type: "family", maxGuests: 4 },
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
  const nightMatch = latest.match(/\b(\d{1,2})\s*(?:νύχτες|νυχτες|βράδια|βραδια|βραδιά|βραδια|nights?|nächte|nuits|notti|noches|gece)\b/i);

  if (dates.length >= 2) { next.checkin = dates[0]; next.checkout = dates[1]; }
  else if (dates.length === 1) {
    const clearlyNewStay = Boolean(nightMatch) || /\b(θέλω|θελω|από|απο|άφιξη|αφιξη|έρχομαι|ερχομαι|new|from|arrive)\b/i.test(latest);
    if (!next.checkin || clearlyNewStay || wantsReset) {
      next.checkin = dates[0]; next.checkout = undefined;
    } else next.checkout = dates[0];
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

async function searchOffers(search: SearchState, language: Language, origin: string): Promise<Offer[]> {
  const nights = stayNights(search);
  const url = new URL("/api/booking/search-range", origin);
  url.searchParams.set("checkin", search.checkin!); url.searchParams.set("checkout", search.checkout!); url.searchParams.set("guests", String(search.guests));
  const response = await fetch(url.toString(), { method: "GET", cache: "no-store" });
  const data = await response.json().catch(() => null);
  if (!response.ok || !data || !Array.isArray(data?.rooms?.available)) throw new Error("Availability service unavailable");
  return data.rooms.available.map((room: any) => {
    const meta = ROOM_META[`${room.roomId}:${room.unitId}`];
    if (!meta || meta.maxGuests < Number(search.guests)) return null;
    const originalTotal = Number(room?.totalPrice || 0); if (!(originalTotal > 0)) return null;
    const directTotal = Math.round(originalTotal * 0.9 * 100) / 100;
    return { roomId: String(room.roomId), unitId: String(room.unitId), name: String(room.displayName || room.name || `Room ${room.unitId}`), category: String(room.category || room.roomName || "Room"), floor: String(room.location || meta.features[0] || ""), maxGuests: meta.maxGuests, features: meta.features, image: meta.image, detailsUrl: ROOM_URLS[meta.type][language] || ROOM_URLS[meta.type].en, bookingUrl: "/book-now", nights, originalTotal: Math.round(originalTotal * 100) / 100, directTotal, saving: Math.round((originalTotal - directTotal) * 100) / 100 } satisfies Offer;
  }).filter((o: Offer | null): o is Offer => Boolean(o)).sort((a, b) => a.directTotal - b.directTotal).slice(0, 10);
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
    const search = parseState(messages, body?.search || {});
    const question = missingQuestion(search, language);
    if (question) return NextResponse.json({ answer: question, search, offers: [], language });

    const offers = await searchOffers(search, language, request.nextUrl.origin);
    const checkin = formatDate(search.checkin!, language); const checkout = formatDate(search.checkout!, language);
    if (offers.length) {
      const answer = language === "el" ? `Βρήκα ${offers.length} ${offers.length === 1 ? "διαθέσιμη επιλογή" : "διαθέσιμες επιλογές"} για ${search.guests} άτομα, ${checkin}–${checkout}. Δείτε τες με την ησυχία σας και πατήστε σε όποιο δωμάτιο σας αρέσει.` : `I found ${offers.length} available options for ${search.guests} guests, ${checkin}–${checkout}. Tap any room to see the details.`;
      return NextResponse.json({ answer, search, offers, language, discountPercent: DIRECT_DISCOUNT_PERCENT });
    }

    const [nearby, split] = await Promise.all([findNearby(search, language, request.nextUrl.origin), findSplitStay(search, language, request.nextUrl.origin)]);
    if (language === "el") {
      if (nearby) {
        const nIn = formatDate(nearby.search.checkin!, language); const nOut = formatDate(nearby.search.checkout!, language);
        const splitText = split ? ` Υπάρχει επίσης δυνατότητα split stay στις αρχικές ημερομηνίες, με μία αλλαγή δωματίου στις ${formatDate(split.changeDate!, language)} (${split.first.name} και μετά ${split.second.name}).` : "";
        return NextResponse.json({ answer: `Δεν βρήκα ένα δωμάτιο για όλες τις αρχικές ημερομηνίες, αλλά βρήκα μια κοντινή λύση: ${nIn}–${nOut}.${splitText} Σας δείχνω πρώτα τις διαθέσιμες επιλογές για τις κοντινές ημερομηνίες.`, search: nearby.search, offers: nearby.offers, language, discountPercent: DIRECT_DISCOUNT_PERCENT });
      }
      if (split) {
        return NextResponse.json({ answer: `Δεν υπάρχει ένα δωμάτιο για ολόκληρη τη διαμονή, αλλά μπορούμε να σας φιλοξενήσουμε με μία μόνο αλλαγή δωματίου: ${split.first.name} και από ${formatDate(split.changeDate!, language)} ${split.second.name}. Η reception μπορεί να οργανώσει την αλλαγή όσο πιο άνετα γίνεται. Θέλετε να προχωρήσουμε με αυτή τη λύση ή να ψάξω κοντινές ημερομηνίες;`, search, offers: [], language, discountPercent: DIRECT_DISCOUNT_PERCENT });
      }
      return NextResponse.json({ answer: `Δεν βρήκα διαθεσιμότητα για ${checkin}–${checkout}, αλλά ας μην το αφήσουμε εδώ. Αν οι ημερομηνίες σας είναι λίγο ευέλικτες, γράψτε μου μία κοντινή ημερομηνία ή απλώς «νέες ημερομηνίες» και θα ψάξω ξανά.`, search, offers: [], language, discountPercent: DIRECT_DISCOUNT_PERCENT });
    }

    return NextResponse.json({ answer: `I couldn't find one room for the full stay, but I can check nearby dates or a split stay with only one room change. Are your dates flexible?`, search, offers: nearby?.offers || [], language, discountPercent: DIRECT_DISCOUNT_PERCENT });
  } catch (error) {
    console.error("AI assistant route error", error);
    return NextResponse.json({ error: "Δεν μπόρεσα να ολοκληρώσω τον ζωντανό έλεγχο αυτή τη στιγμή. Παρακαλώ δοκιμάστε ξανά σε λίγο." }, { status: 502 });
  }
}
