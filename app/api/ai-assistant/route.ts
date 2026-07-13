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
type AiAction = "ask_user" | "search_rooms" | "respond";

type AiDecision = {
  action: AiAction;
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

const ROOM_META: Record<string, RoomMeta> = {
  "267788:1": { number: 1, image: "/images/rooms/DSC07776-2-e1675109942622.webp", features: ["1 double bed + 2 single beds", "Private balcony", "First floor · stairs"], details: roomLinks("standard") },
  "268803:1": { number: 2, image: "/images/rooms/DSC07803-1.webp", features: ["1 double bed", "Economy double", "First floor · stairs"], details: roomLinks("economy") },
  "267788:2": { number: 3, image: "/images/rooms/DSC07867-1.webp", features: ["1 double bed + 1 single bed", "Kitchenette", "First floor · stairs"], details: roomLinks("standard") },
  "267788:3": { number: 4, image: "/images/rooms/received_1748354861920234.webp", features: ["1 double bed + sofa bed", "Kitchenette", "Private balcony"], details: roomLinks("standard") },
  "626129:1": { number: 5, image: "/images/rooms/voulamandis-house-rooms.webp", features: ["1 double bed + 1 single bed", "Ground floor", "No stairs"], details: roomLinks("standard") },
  "268803:2": { number: 6, image: "/images/rooms/received_1753964631359257.webp", features: ["1 double bed", "Economy double", "Ground floor · no stairs"], details: roomLinks("economy") },
  "626129:2": { number: 7, image: "/images/rooms/double-triple-room.jpg", features: ["1 double bed + sofa bed", "Ground floor", "Garden access"], details: roomLinks("standard") },
  "265595:1": { number: 8, image: "/images/rooms/chios-apartments-voulamandis.webp", features: ["1 double bed + 2 single beds", "Full kitchen", "Independent apartment"], details: roomLinks("family") },
  "265595:2": { number: 9, image: "/images/rooms/chios-apartments-voulamandis.webp", features: ["1 double bed + 2 single beds", "Full kitchen", "Independent apartment"], details: roomLinks("family") },
  "265595:3": { number: 10, image: "/images/rooms/DSC07899.webp", features: ["Family apartment", "Full kitchen", "Up to 5 guests under conditions"], details: roomLinks("family") },
};

function normalizeMessages(value: unknown): ChatMessage[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((message): message is ChatMessage => Boolean(message && (message.role === "user" || message.role === "assistant") && typeof message.content === "string" && message.content.trim()))
    .slice(-16);
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
  return Math.round((new Date(`${checkout}T12:00:00Z`).getTime() - new Date(`${checkin}T12:00:00Z`).getTime()) / 86_400_000);
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

async function askAiToDecide(messages: ChatMessage[], current: SearchState, suppliedLanguage?: string): Promise<AiDecision> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY is missing");

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), AI_TIMEOUT_MS);
  const today = new Date().toISOString().slice(0, 10);

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        model: process.env.OPENAI_ASSISTANT_MODEL || "gpt-4.1-mini",
        temperature: 0,
        input: [
          {
            role: "system",
            content: [{
              type: "input_text",
              text: [
                "You are the central multilingual AI orchestrator for the Voulamandis House room assistant.",
                `Today is ${today}.`,
                "Every user message reaches you first. You decide the next action and the exact short reply shown to the user.",
                "Available actions:",
                "- ask_user: ask exactly one necessary question to continue.",
                "- search_rooms: use only when checkin, checkout and guests are all known and valid.",
                "- respond: answer conversationally when no room search should run.",
                "Understand natural dates, relative dates, corrections, changed requirements and guest counts in Greek, English, French, German, Italian, Spanish and Turkish.",
                "Return dates as YYYY-MM-DD. Use empty strings and guests=0 only when genuinely unknown.",
                "When the user changes any previous search value, set resetSearch=true and return the complete corrected state when possible.",
                "Never invent dates or guest counts. Never produce SQL, code, URLs or database instructions.",
                "For ask_user, answer must contain the single next question in the user's language.",
                "For respond, answer must contain the short helpful response in the user's language.",
                "For search_rooms, answer must be a short transition such as 'Ελέγχω τώρα τη διαθεσιμότητα.' in the user's language.",
                `A stay must be between 1 and ${MAX_NIGHTS} nights and guests must be between 1 and 10.`,
              ].join("\n"),
            }],
          },
          {
            role: "user",
            content: [{
              type: "input_text",
              text: JSON.stringify({ suppliedLanguage: suppliedLanguage || "", currentSearch: current, conversation: messages }),
            }],
          },
        ],
        text: {
          format: {
            type: "json_schema",
            name: "assistant_decision",
            strict: true,
            schema: {
              type: "object",
              additionalProperties: false,
              properties: {
                action: { type: "string", enum: ["ask_user", "search_rooms", "respond"] },
                language: { type: "string", enum: ["en", "el", "fr", "de", "it", "es", "tr"] },
                checkin: { type: "string" },
                checkout: { type: "string" },
                guests: { type: "integer", minimum: 0, maximum: 10 },
                resetSearch: { type: "boolean" },
                answer: { type: "string" },
              },
              required: ["action", "language", "checkin", "checkout", "guests", "resetSearch", "answer"],
            },
          },
        },
      }),
    });

    const payload = await response.json().catch(() => null);
    if (!response.ok) throw new Error(payload?.error?.message || `OpenAI request failed (${response.status})`);
    const text = responseText(payload);
    if (!text) throw new Error("OpenAI returned no structured decision");
    return JSON.parse(text) as AiDecision;
  } finally {
    clearTimeout(timeout);
  }
}

function mergeSearch(current: SearchState, decision: AiDecision): SearchState {
  const next: SearchState = decision.resetSearch ? {} : { ...current };
  if (isIsoDate(decision.checkin)) next.checkin = decision.checkin;
  if (isIsoDate(decision.checkout)) next.checkout = decision.checkout;
  if (decision.guests >= 1 && decision.guests <= 10) next.guests = decision.guests;
  return next;
}

function validateSearch(search: SearchState): search is Required<SearchState> {
  if (!isIsoDate(search.checkin) || !isIsoDate(search.checkout) || !search.guests) return false;
  const nights = nightsBetween(search.checkin, search.checkout);
  return nights >= 1 && nights <= MAX_NIGHTS && search.guests >= 1 && search.guests <= 10;
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
    if (!response.ok || !Array.isArray(payload?.rooms?.available)) throw new Error(payload?.message || "Neon availability search failed");
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

function resultMessage(language: Language, count: number) {
  if (language === "el") return count ? `Βρήκα ${count} ${count === 1 ? "διαθέσιμη επιλογή" : "διαθέσιμες επιλογές"}.` : "Δεν βρήκα διαθέσιμο δωμάτιο για αυτά τα στοιχεία.";
  return count ? `I found ${count} available ${count === 1 ? "option" : "options"}.` : "I could not find an available room for these details.";
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const messages = normalizeMessages(body?.messages);
    if (!messages.length) return NextResponse.json({ error: "Please enter a message.", answer: "", search: {}, offers: [] }, { status: 400 });

    const current = normalizeSearch(body?.search);
    const decision = await askAiToDecide(messages, current, body?.language);
    const language = decision.language || "en";
    const search = mergeSearch(current, decision);

    if (decision.action !== "search_rooms") {
      return NextResponse.json({ answer: decision.answer, search, offers: [], language, action: decision.action });
    }

    if (!validateSearch(search)) {
      return NextResponse.json({
        error: "AI requested a search without a valid complete state.",
        answer: decision.answer || "Χρειάζομαι έγκυρα στοιχεία άφιξης, αναχώρησης και επισκεπτών.",
        search,
        offers: [],
        language,
        action: "ask_user",
      }, { status: 422 });
    }

    const availability = await searchNeon(search, request.nextUrl.origin);
    const offers = buildOffers(availability, language);

    return NextResponse.json({
      answer: offers.length ? resultMessage(language, offers.length) : resultMessage(language, 0),
      search,
      offers,
      language,
      action: "search_rooms",
      discountPercent: DIRECT_DISCOUNT_PERCENT,
      timing: availability?._booking_engine || undefined,
    });
  } catch (error) {
    console.error("AI assistant error", error);
    const message = error instanceof Error ? error.message : "Unknown AI assistant error";
    return NextResponse.json({
      error: message,
      answer: "Δεν μπόρεσα να ολοκληρώσω το αίτημα αυτή τη στιγμή. Δοκιμάστε ξανά.",
      search: {},
      offers: [],
      language: "el",
    }, { status: 500 });
  }
}
