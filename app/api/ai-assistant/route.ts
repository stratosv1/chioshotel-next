import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DIRECT_DISCOUNT_PERCENT = 10;
const DEFAULT_BOOKING_WEBAPP_URL =
  "https://script.google.com/macros/s/AKfycbwZ8qG1eE1YXr-Ag2LXNHrgFIkf7kCvDiTMF38NfPNC9ZGAquGMIXvn3QWPfpiKpTaa/exec";

type SupportedLanguage = "en" | "el" | "fr" | "de" | "it" | "es" | "tr";
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

const ROOM_URLS: Record<RoomType, Record<SupportedLanguage, string>> = {
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

function detectLanguage(messages: ChatMessage[]): SupportedLanguage {
  const userTexts = messages
    .filter((message) => message.role === "user")
    .map((message) => message.content)
    .reverse();

  for (const text of userTexts) {
    if (!/[\p{L}]/u.test(text)) continue;
    if (/[Α-Ωα-ωΆ-ώ]/.test(text)) return "el";
    if (/[ğüşöçıİĞÜŞÖÇ]/i.test(text)) return "tr";
    if (/[äöüß]/i.test(text) || /\b(ich|zimmer|verfügbarkeit|preis|möchte)\b/i.test(text)) return "de";
    if (/[éèêëàâçîïôùûüÿœ]/i.test(text) || /\b(je|chambre|prix|disponible|voudrais)\b/i.test(text)) return "fr";
    if (/\b(quiero|habitación|precio|disponible|huéspedes)\b/i.test(text)) return "es";
    if (/\b(vorrei|camera|prezzo|disponibile|ospiti)\b/i.test(text)) return "it";
    if (/[A-Za-z]/.test(text)) return "en";
  }

  const hasGreekAssistant = messages.some((message) => message.role === "assistant" && /[Α-Ωα-ωΆ-ώ]/.test(message.content));
  return hasGreekAssistant ? "el" : "en";
}

function validDate(value?: string) {
  return Boolean(value && /^\d{4}-\d{2}-\d{2}$/.test(value));
}

function addDays(date: string, days: number) {
  const value = new Date(`${date}T12:00:00Z`);
  value.setUTCDate(value.getUTCDate() + days);
  return value.toISOString().slice(0, 10);
}

function nightsBetween(checkin: string, checkout: string) {
  return Math.round((new Date(`${checkout}T12:00:00Z`).getTime() - new Date(`${checkin}T12:00:00Z`).getTime()) / 86400000);
}

function bookingWebAppUrl() {
  return process.env.GOOGLE_BOOKING_SEARCH_WEBAPP_URL || DEFAULT_BOOKING_WEBAPP_URL;
}

function formatDate(value: string, language: SupportedLanguage) {
  const locale = language === "el" ? "el-GR" : language === "de" ? "de-DE" : language === "fr" ? "fr-FR" : language === "it" ? "it-IT" : language === "es" ? "es-ES" : language === "tr" ? "tr-TR" : "en-GB";
  return new Intl.DateTimeFormat(locale, { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(`${value}T12:00:00Z`));
}

function resolveFutureDate(day: number, month: number, year?: number) {
  const today = new Date();
  let resolvedYear = year || today.getUTCFullYear();
  let candidate = new Date(Date.UTC(resolvedYear, month - 1, day, 12));
  const todayStart = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate(), 0));

  if (!year && candidate < todayStart) {
    resolvedYear += 1;
    candidate = new Date(Date.UTC(resolvedYear, month - 1, day, 12));
  }

  if (candidate.getUTCDate() !== day || candidate.getUTCMonth() !== month - 1) return undefined;
  return candidate.toISOString().slice(0, 10);
}

function parseDeterministicState(messages: ChatMessage[], current: SearchState) {
  const latest = [...messages].reverse().find((message) => message.role === "user")?.content.trim() || "";
  const next: SearchState = { ...current };

  const dateMatches = [...latest.matchAll(/\b(\d{1,2})[\/-](\d{1,2})(?:[\/-](\d{2,4}))?\b/g)];
  const parsedDates = dateMatches
    .map((match) => {
      const yearRaw = match[3] ? Number(match[3]) : undefined;
      const year = yearRaw && yearRaw < 100 ? 2000 + yearRaw : yearRaw;
      return resolveFutureDate(Number(match[1]), Number(match[2]), year);
    })
    .filter((value): value is string => Boolean(value));

  if (parsedDates.length >= 2) {
    next.checkin = parsedDates[0];
    next.checkout = parsedDates[1];
  } else if (parsedDates.length === 1) {
    if (!next.checkin || /\b(άφιξη|αφιξη|έρθω|ερθω|come|arrive|anreise|arrivo|llegada|geliş)\b/i.test(latest)) {
      next.checkin = parsedDates[0];
      if (next.checkout && next.checkout <= next.checkin) next.checkout = undefined;
    } else if (/\b(αναχώρηση|αναχωρηση|checkout|departure|abreise|partenza|salida|çıkış)\b/i.test(latest)) {
      next.checkout = parsedDates[0];
    }
  }

  const guestsMatch = latest.match(/\b(\d{1,2})\s*(?:άτομα|ατομα|επισκέπτες|επισκεπτες|guests?|persons?|people|personen|ospiti|personas|kişi)\b/i);
  if (guestsMatch) next.guests = Math.max(1, Math.min(Number(guestsMatch[1]), 10));

  const nightsMatch = latest.match(/\b(\d{1,2})\s*(?:νύχτες|νυχτες|βράδια|βραδια|nights?|nächte|nuits|notti|noches|gece)\b/i);
  if (nightsMatch && next.checkin) {
    next.checkout = addDays(next.checkin, Number(nightsMatch[1]));
  }

  const bareNumberMatch = latest.match(/^\s*(\d{1,2})\s*$/);
  if (bareNumberMatch) {
    const value = Number(bareNumberMatch[1]);
    if (next.checkin && !next.checkout) {
      next.checkout = addDays(next.checkin, value);
    } else if (next.checkin && next.checkout && !next.guests) {
      next.guests = Math.max(1, Math.min(value, 10));
    }
  }

  return next;
}

function questionForMissing(state: SearchState, language: SupportedLanguage) {
  const copy = {
    el: {
      checkin: "Πότε θέλετε να έρθετε; Μπορείτε να γράψετε π.χ. «22 Αυγούστου» ή «22/08».",
      checkout: "Για πόσες νύχτες θέλετε να μείνετε ή ποια θα είναι η αναχώρηση;",
      guests: "Για πόσα άτομα είναι η διαμονή;",
    },
    en: { checkin: "When would you like to arrive?", checkout: "How many nights would you like to stay, or what is your departure date?", guests: "How many guests will be staying?" },
    de: { checkin: "Wann möchten Sie anreisen?", checkout: "Wie viele Nächte möchten Sie bleiben oder wann reisen Sie ab?", guests: "Für wie viele Gäste ist der Aufenthalt?" },
    fr: { checkin: "Quand souhaitez-vous arriver ?", checkout: "Combien de nuits souhaitez-vous rester ou quelle est votre date de départ ?", guests: "Pour combien de personnes ?" },
    it: { checkin: "Quando desidera arrivare?", checkout: "Quante notti desidera soggiornare o qual è la data di partenza?", guests: "Per quante persone?" },
    es: { checkin: "¿Cuándo desea llegar?", checkout: "¿Cuántas noches desea alojarse o cuál es la fecha de salida?", guests: "¿Para cuántas personas?" },
    tr: { checkin: "Ne zaman gelmek istersiniz?", checkout: "Kaç gece kalmak istersiniz veya çıkış tarihiniz nedir?", guests: "Kaç kişi konaklayacak?" },
  }[language];

  if (!validDate(state.checkin)) return copy.checkin;
  if (!validDate(state.checkout)) return copy.checkout;
  if (!state.guests || state.guests < 1) return copy.guests;
  return "";
}

async function extractSearchState(apiKey: string, messages: ChatMessage[], current: SearchState) {
  const deterministic = parseDeterministicState(messages, current);
  const today = new Date().toISOString().slice(0, 10);
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-5-mini",
      instructions: `Extract booking search details from the conversation. Today is ${today}. Preserve existing values unless the guest clearly changes them. Resolve dates to YYYY-MM-DD. If the guest gives nights and a check-in date, calculate checkout. Do not guess missing information.`,
      input: [
        { role: "user", content: `Existing state: ${JSON.stringify(deterministic)}\nConversation: ${JSON.stringify(messages.slice(-8))}` },
      ],
      reasoning: { effort: "minimal" },
      text: {
        format: {
          type: "json_schema",
          name: "booking_search",
          strict: true,
          schema: {
            type: "object",
            additionalProperties: false,
            properties: {
              checkin: { type: ["string", "null"] },
              checkout: { type: ["string", "null"] },
              nights: { type: ["integer", "null"] },
              guests: { type: ["integer", "null"] },
            },
            required: ["checkin", "checkout", "nights", "guests"],
          },
        },
      },
      max_output_tokens: 220,
    }),
    cache: "no-store",
  });

  if (!response.ok) return deterministic;
  const payload = await response.json();
  const raw = payload?.output_text || payload?.output?.[0]?.content?.[0]?.text;
  if (!raw) return deterministic;

  try {
    const parsed = JSON.parse(raw);
    const next: SearchState = {
      checkin: validDate(parsed.checkin) ? parsed.checkin : deterministic.checkin,
      checkout: validDate(parsed.checkout) ? parsed.checkout : deterministic.checkout,
      guests: Number.isInteger(parsed.guests) && parsed.guests > 0 ? Math.min(parsed.guests, 10) : deterministic.guests,
    };
    if (!next.checkout && next.checkin && Number.isInteger(parsed.nights) && parsed.nights > 0) {
      next.checkout = addDays(next.checkin, parsed.nights);
    }
    return next;
  } catch {
    return deterministic;
  }
}

async function getOffers(search: SearchState, language: SupportedLanguage): Promise<Offer[]> {
  if (!validDate(search.checkin) || !validDate(search.checkout) || !search.guests) return [];
  const nights = nightsBetween(search.checkin!, search.checkout!);
  if (nights < 1 || nights > 30) return [];

  const url = new URL(bookingWebAppUrl());
  url.searchParams.set("action", "search_range");
  url.searchParams.set("checkin", search.checkin!);
  url.searchParams.set("checkout", search.checkout!);
  url.searchParams.set("guests", String(search.guests));

  const response = await fetch(url.toString(), {
    headers: { Accept: "application/json", "User-Agent": "VoulamandisHouseAI/2.2" },
    cache: "no-store",
  });
  const data = await response.json().catch(() => null);
  if (!response.ok || !data?.success || !Array.isArray(data?.rooms?.available)) return [];

  return data.rooms.available
    .filter((item: any) => Number(item?.maxGuests || 0) >= Number(search.guests))
    .map((item: any) => {
      const originalTotal = Number(item?.totalPrice || 0);
      const directTotal = Math.round(originalTotal * 0.9 * 100) / 100;
      const key = `${item.roomId}:${item.unitId}`;
      const meta = ROOM_META[key] || { features: [], image: "/images/rooms/voulamandis-house-rooms.webp", type: "standard" as RoomType };
      return {
        roomId: String(item.roomId),
        unitId: String(item.unitId),
        name: String(item.displayName || item.name || `Room ${item.unitId}`),
        category: String(item.category || item.roomName || "Room"),
        floor: String(item.location || ""),
        maxGuests: Number(item.maxGuests || 0),
        features: meta.features,
        image: meta.image,
        detailsUrl: ROOM_URLS[meta.type][language] || ROOM_URLS[meta.type].en,
        bookingUrl: "/book-now",
        nights,
        originalTotal: Math.round(originalTotal * 100) / 100,
        directTotal,
        saving: Math.round((originalTotal - directTotal) * 100) / 100,
      } satisfies Offer;
    })
    .filter((offer: Offer) => offer.originalTotal > 0)
    .sort((a: Offer, b: Offer) => a.directTotal - b.directTotal)
    .slice(0, 10);
}

function resultsAnswer(language: SupportedLanguage, offers: Offer[], search: SearchState) {
  const count = offers.length;
  const checkin = formatDate(search.checkin!, language);
  const checkout = formatDate(search.checkout!, language);
  const guests = search.guests;
  if (language === "el") {
    return count
      ? `Βρήκα ${count} διαθέσιμες ${count === 1 ? "επιλογή" : "επιλογές"} για ${guests} ${guests === 1 ? "άτομο" : "άτομα"}, ${checkin}–${checkout}. Πατήστε σε ένα δωμάτιο για λεπτομέρειες.`
      : `Δεν βρέθηκε διαθέσιμο δωμάτιο για ${guests} ${guests === 1 ? "άτομο" : "άτομα"}, ${checkin}–${checkout}.`;
  }
  return count
    ? `I found ${count} available ${count === 1 ? "option" : "options"} for ${guests} guests, ${checkin}–${checkout}. Tap a room for details.`
    : `No available room was found for ${guests} guests, ${checkin}–${checkout}.`;
}

export async function POST(request: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "The AI assistant is not configured yet." }, { status: 503 });

  try {
    const body = await request.json();
    const messages: ChatMessage[] = Array.isArray(body?.messages)
      ? body.messages
          .filter((message: any) => (message?.role === "user" || message?.role === "assistant") && typeof message?.content === "string")
          .slice(-12)
          .map((message: ChatMessage) => ({ role: message.role, content: message.content.trim().slice(0, 1400) }))
      : [];

    if (!messages.length || messages[messages.length - 1].role !== "user") {
      return NextResponse.json({ error: "Please enter a message." }, { status: 400 });
    }

    const language = detectLanguage(messages);
    const current: SearchState = body?.search || {};
    const search = await extractSearchState(apiKey, messages, current);
    const missingQuestion = questionForMissing(search, language);

    if (missingQuestion) {
      return NextResponse.json({ answer: missingQuestion, search, offers: [], language });
    }

    const offers = await getOffers(search, language);
    return NextResponse.json({
      answer: resultsAnswer(language, offers, search),
      search,
      offers,
      language,
      discountPercent: DIRECT_DISCOUNT_PERCENT,
    });
  } catch (error) {
    console.error("AI assistant route error", error);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
