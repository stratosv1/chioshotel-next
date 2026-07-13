import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DIRECT_DISCOUNT_PERCENT = 10;
const MAX_NIGHTS = 30;
const AI_TIMEOUT_MS = 8_000;
const SEARCH_TIMEOUT_MS = 8_000;

type Language = "en" | "el" | "fr" | "de" | "it" | "es" | "tr";
type ChatMessage = { role: "user" | "assistant"; content: string };
type SearchState = { checkin?: string; checkout?: string; guests?: number };

type AiExtraction = {
  intent: "search_rooms" | "change_search" | "conversation";
  language: Language;
  checkin: string;
  checkout: string;
  guests: number;
  resetSearch: boolean;
  answer: string;
};

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

type RoomMeta = {
  number: number;
  image: string;
  features: string[];
  details: Record<Language, string>;
};

const ROOM_META: Record<string, RoomMeta> = {
  "267788:1": {
    number: 1,
    image: "/images/rooms/DSC07776-2-e1675109942622.webp",
    features: ["1 double bed + 2 single beds", "Private balcony", "First floor · stairs"],
    details: roomLinks("standard"),
  },
  "268803:1": {
    number: 2,
    image: "/images/rooms/DSC07803-1.webp",
    features: ["1 double bed", "Economy double", "First floor · stairs"],
    details: roomLinks("economy"),
  },
  "267788:2": {
    number: 3,
    image: "/images/rooms/DSC07867-1.webp",
    features: ["1 double bed + 1 single bed", "Kitchenette", "First floor · stairs"],
    details: roomLinks("standard"),
  },
  "267788:3": {
    number: 4,
    image: "/images/rooms/received_1748354861920234.webp",
    features: ["1 double bed + sofa bed", "Kitchenette", "Private balcony"],
    details: roomLinks("standard"),
  },
  "626129:1": {
    number: 5,
    image: "/images/rooms/voulamandis-house-rooms.webp",
    features: ["1 double bed + 1 single bed", "Ground floor", "No stairs"],
    details: roomLinks("standard"),
  },
  "268803:2": {
    number: 6,
    image: "/images/rooms/received_1753964631359257.webp",
    features: ["1 double bed", "Economy double", "Ground floor · no stairs"],
    details: roomLinks("economy"),
  },
  "626129:2": {
    number: 7,
    image: "/images/rooms/double-triple-room.jpg",
    features: ["1 double bed + sofa bed", "Ground floor", "Garden access"],
    details: roomLinks("standard"),
  },
  "265595:1": {
    number: 8,
    image: "/images/rooms/chios-apartments-voulamandis.webp",
    features: ["1 double bed + 2 single beds", "Full kitchen", "Independent apartment"],
    details: roomLinks("family"),
  },
  "265595:2": {
    number: 9,
    image: "/images/rooms/chios-apartments-voulamandis.webp",
    features: ["1 double bed + 2 single beds", "Full kitchen", "Independent apartment"],
    details: roomLinks("family"),
  },
  "265595:3": {
    number: 10,
    image: "/images/rooms/DSC07899.webp",
    features: ["Family apartment", "Full kitchen", "Up to 5 guests under conditions"],
    details: roomLinks("family"),
  },
};

function roomLinks(type: "standard" | "economy" | "family"): Record<Language, string> {
  const links = {
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
  } as const;
  return links[type];
}

const QUESTIONS: Record<Language, { checkin: string; checkout: string; guests: string; unavailable: string; error: string }> = {
  el: {
    checkin: "Ποια ημερομηνία θέλετε για check-in;",
    checkout: "Ποια ημερομηνία θέλετε για check-out;",
    guests: "Για πόσους επισκέπτες είναι η διαμονή;",
    unavailable: "Δεν βρήκα διαθέσιμο δωμάτιο για αυτές τις ημερομηνίες. Δοκιμάστε άλλες ημερομηνίες.",
    error: "Δεν μπόρεσα να ολοκληρώσω την αναζήτηση αυτή τη στιγμή. Δοκιμάστε ξανά.",
  },
  en: {
    checkin: "What date would you like to check in?",
    checkout: "What date would you like to check out?",
    guests: "How many guests will be staying?",
    unavailable: "I could not find an available room for those dates. Please try different dates.",
    error: "I could not complete the search right now. Please try again.",
  },
  fr: {
    checkin: "Quelle date souhaitez-vous pour l’arrivée ?",
    checkout: "Quelle date souhaitez-vous pour le départ ?",
    guests: "Pour combien de personnes ?",
    unavailable: "Aucune chambre disponible pour ces dates. Essayez d’autres dates.",
    error: "La recherche n’a pas pu être terminée. Réessayez.",
  },
  de: {
    checkin: "An welchem Datum möchten Sie anreisen?",
    checkout: "An welchem Datum möchten Sie abreisen?",
    guests: "Für wie viele Gäste?",
    unavailable: "Für diese Daten wurde kein verfügbares Zimmer gefunden. Bitte versuchen Sie andere Daten.",
    error: "Die Suche konnte gerade nicht abgeschlossen werden. Bitte versuchen Sie es erneut.",
  },
  it: {
    checkin: "Quale data desideri per il check-in?",
    checkout: "Quale data desideri per il check-out?",
    guests: "Per quanti ospiti?",
    unavailable: "Non ho trovato camere disponibili per queste date. Prova con altre date.",
    error: "Non è stato possibile completare la ricerca. Riprova.",
  },
  es: {
    checkin: "¿Qué fecha desea para el check-in?",
    checkout: "¿Qué fecha desea para el check-out?",
    guests: "¿Para cuántos huéspedes?",
    unavailable: "No encontré habitaciones disponibles para esas fechas. Pruebe otras fechas.",
    error: "No se pudo completar la búsqueda. Inténtelo de nuevo.",
  },
  tr: {
    checkin: "Giriş tarihiniz nedir?",
    checkout: "Çıkış tarihiniz nedir?",
    guests: "Kaç misafir konaklayacak?",
    unavailable: "Bu tarihler için uygun oda bulunamadı. Lütfen farklı tarihler deneyin.",
    error: "Arama şu anda tamamlanamadı. Lütfen tekrar deneyin.",
  },
};

function normalizeMessages(value: unknown): ChatMessage[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((message): message is ChatMessage =>
      Boolean(
        message &&
          (message.role === "user" || message.role === "assistant") &&
          typeof message.content === "string" &&
          message.content.trim(),
      ),
    )
    .slice(-12);
}

function normalizeSearch(value: unknown): SearchState {
  if (!value || typeof value !== "object") return {};
  const source = value as Record<string, unknown>;
  const search: SearchState = {};
  if (typeof source.checkin === "string") search.checkin = source.checkin;
  if (typeof source.checkout === "string") search.checkout = source.checkout;
  if (Number.isInteger(source.guests)) search.guests = Number(source.guests);
  return search;
}

function isIsoDate(value?: string): value is string {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T12:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

function nightsBetween(checkin: string, checkout: string) {
  return Math.round(
    (new Date(`${checkout}T12:00:00Z`).getTime() - new Date(`${checkin}T12:00:00Z`).getTime()) / 86_400_000,
  );
}

function responseText(payload: any): string {
  if (typeof payload?.output_text === "string") return payload.output_text;
  for (const item of payload?.output || []) {
    for (const content of item?.content || []) {
      if (typeof content?.text === "string") return content.text;
    }
  }
  return "";
}

async function understandRequest(
  messages: ChatMessage[],
  current: SearchState,
  suppliedLanguage?: string,
): Promise<AiExtraction> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY is missing");

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), AI_TIMEOUT_MS);
  const today = new Date().toISOString().slice(0, 10);

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: process.env.OPENAI_ASSISTANT_MODEL || "gpt-4.1-mini",
        temperature: 0,
        input: [
          {
            role: "system",
            content: [
              {
                type: "input_text",
                text: [
                  "You extract hotel room-search information from a multilingual conversation.",
                  `Today is ${today}.`,
                  "Understand natural dates, relative dates, corrections, and guest counts.",
                  "Return ISO dates YYYY-MM-DD. Use an empty string when a value is unknown.",
                  "Use guests=0 when unknown.",
                  "If the latest user message changes dates or guests, set resetSearch=true and return the corrected complete state when possible.",
                  "Never invent a date or guest count.",
                  "The answer field should be a very short reply in the user's language only when the request is not a room search; otherwise use an empty string.",
                ].join("\n"),
              },
            ],
          },
          {
            role: "user",
            content: [
              {
                type: "input_text",
                text: JSON.stringify({
                  suppliedLanguage: suppliedLanguage || "",
                  currentSearch: current,
                  conversation: messages,
                }),
              },
            ],
          },
        ],
        text: {
          format: {
            type: "json_schema",
            name: "room_search_extraction",
            strict: true,
            schema: {
              type: "object",
              additionalProperties: false,
              properties: {
                intent: { type: "string", enum: ["search_rooms", "change_search", "conversation"] },
                language: { type: "string", enum: ["en", "el", "fr", "de", "it", "es", "tr"] },
                checkin: { type: "string" },
                checkout: { type: "string" },
                guests: { type: "integer", minimum: 0, maximum: 10 },
                resetSearch: { type: "boolean" },
                answer: { type: "string" },
              },
              required: ["intent", "language", "checkin", "checkout", "guests", "resetSearch", "answer"],
            },
          },
        },
      }),
    });

    const payload = await response.json().catch(() => null);
    if (!response.ok) {
      throw new Error(payload?.error?.message || `OpenAI request failed (${response.status})`);
    }

    const text = responseText(payload);
    if (!text) throw new Error("OpenAI returned no structured output");
    return JSON.parse(text) as AiExtraction;
  } finally {
    clearTimeout(timeout);
  }
}

function mergeSearch(current: SearchState, extraction: AiExtraction): SearchState {
  const next: SearchState = extraction.resetSearch ? {} : { ...current };
  if (isIsoDate(extraction.checkin)) next.checkin = extraction.checkin;
  if (isIsoDate(extraction.checkout)) next.checkout = extraction.checkout;
  if (extraction.guests >= 1 && extraction.guests <= 10) next.guests = extraction.guests;
  return next;
}

function nextQuestion(search: SearchState, language: Language): string | null {
  const copy = QUESTIONS[language] || QUESTIONS.en;
  if (!isIsoDate(search.checkin)) return copy.checkin;
  if (!isIsoDate(search.checkout)) return copy.checkout;
  if (!search.guests) return copy.guests;

  const nights = nightsBetween(search.checkin, search.checkout);
  if (nights < 1) return copy.checkout;
  if (nights > MAX_NIGHTS) {
    return language === "el"
      ? `Η αναζήτηση μπορεί να γίνει για έως ${MAX_NIGHTS} νύχτες. Ποια ημερομηνία θέλετε για check-out;`
      : `The search supports up to ${MAX_NIGHTS} nights. What checkout date would you like?`;
  }
  return null;
}

async function searchNeon(search: Required<SearchState>, origin: string) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), SEARCH_TIMEOUT_MS);

  try {
    const url = new URL("/api/booking/search-range", origin);
    url.searchParams.set("checkin", search.checkin);
    url.searchParams.set("checkout", search.checkout);
    url.searchParams.set("guests", String(search.guests));

    const response = await fetch(url, { cache: "no-store", signal: controller.signal });
    const payload = await response.json().catch(() => null);
    if (!response.ok || !Array.isArray(payload?.rooms?.available)) {
      throw new Error(payload?.message || "Neon availability search failed");
    }
    return payload;
  } finally {
    clearTimeout(timeout);
  }
}

function buildOffers(payload: any, language: Language): Offer[] {
  return payload.rooms.available
    .map((room: any): Offer | null => {
      const roomId = String(room.roomId || "");
      const unitId = String(room.unitId || "");
      const meta = ROOM_META[`${roomId}:${unitId}`];
      const originalTotal = Number(room.totalPrice ?? room.price ?? room.roomTotal ?? 0);
      if (!meta || !Number.isFinite(originalTotal) || originalTotal <= 0) return null;

      const roundedOriginal = Math.round(originalTotal * 100) / 100;
      const directTotal = Math.round(roundedOriginal * (1 - DIRECT_DISCOUNT_PERCENT / 100) * 100) / 100;

      return {
        roomId,
        unitId,
        name: String(room.name || `Room ${meta.number}`),
        category: String(room.category || ""),
        floor: String(room.floor || ""),
        maxGuests: Number(room.maxGuests || 0),
        features: meta.features,
        image: meta.image,
        detailsUrl: meta.details[language] || meta.details.en,
        bookingUrl: "/book-now",
        nights: Number(payload.nights || 0),
        originalTotal: roundedOriginal,
        directTotal,
        saving: Math.round((roundedOriginal - directTotal) * 100) / 100,
      };
    })
    .filter((offer: Offer | null): offer is Offer => Boolean(offer))
    .sort((a: Offer, b: Offer) => a.directTotal - b.directTotal);
}

function resultsAnswer(language: Language, count: number, search: Required<SearchState>) {
  if (language === "el") {
    return `Βρήκα ${count} ${count === 1 ? "διαθέσιμη επιλογή" : "διαθέσιμες επιλογές"} για ${search.guests} ${search.guests === 1 ? "επισκέπτη" : "επισκέπτες"}.`;
  }
  return `I found ${count} available ${count === 1 ? "option" : "options"} for ${search.guests} ${search.guests === 1 ? "guest" : "guests"}.`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const messages = normalizeMessages(body?.messages);
    if (!messages.length) {
      return NextResponse.json({ error: "Please enter a message.", answer: "", search: {}, offers: [] }, { status: 400 });
    }

    const current = normalizeSearch(body?.search);
    const extraction = await understandRequest(messages, current, body?.language);
    const language = extraction.language || "en";
    const search = mergeSearch(current, extraction);

    if (extraction.intent === "conversation" && extraction.answer && !search.checkin && !search.checkout && !search.guests) {
      return NextResponse.json({ answer: extraction.answer, search, offers: [], language });
    }

    const question = nextQuestion(search, language);
    if (question) {
      return NextResponse.json({ answer: question, search, offers: [], language });
    }

    const completeSearch = search as Required<SearchState>;
    const availability = await searchNeon(completeSearch, request.nextUrl.origin);
    const offers = buildOffers(availability, language);

    return NextResponse.json({
      answer: offers.length ? resultsAnswer(language, offers.length, completeSearch) : QUESTIONS[language].unavailable,
      search: completeSearch,
      offers,
      language,
      discountPercent: DIRECT_DISCOUNT_PERCENT,
      timing: availability?._booking_engine || undefined,
    });
  } catch (error) {
    console.error("AI assistant error", error);
    const message = error instanceof Error ? error.message : "Unknown AI assistant error";
    return NextResponse.json(
      {
        error: message,
        answer: QUESTIONS.el.error,
        search: {},
        offers: [],
        language: "el",
      },
      { status: 500 },
    );
  }
}
