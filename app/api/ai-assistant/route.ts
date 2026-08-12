import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_NIGHTS = 30;
const AI_TIMEOUT_MS = 8_000;
const SEARCH_TIMEOUT_MS = 8_000;

type Language = "en" | "el" | "fr" | "de" | "it" | "es" | "tr";
type ChatMessage = { role: "user" | "assistant"; content: string };
type SearchState = { checkin?: string | null; checkout?: string | null; guests?: number | null };
type CompleteSearchState = { checkin: string; checkout: string; guests: number };
type SearchField = "checkin" | "checkout" | "guests";
type AiIntent = "booking_input" | "edit_search" | "restart_search" | "room_question" | "other";
type AiAction = "ask_user" | "search_rooms" | "respond";

type AiDecision = {
  intent: AiIntent;
  language: Language;
  checkin: string;
  checkout: string;
  guests: number;
  clearFields: SearchField[];
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
  directDiscountPercent: number;
  guestNote: string | null;
};

type RoomMeta = {
  number: number;
  image: string;
  features: string[];
  details: Record<Language, string>;
};

type FlowCopy = {
  askCheckin: string;
  askCheckout: string;
  askGuests: string;
  invalidCheckin: string;
  invalidCheckout: string;
  stayTooLong: string;
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

const FLOW_COPY: Record<Language, FlowCopy> = {
  el: {
    askCheckin: "Βεβαίως. Ποια ημερομηνία θέλετε για check-in;",
    askCheckout: "Ποια ημερομηνία θέλετε για check-out;",
    askGuests: "Για πόσα άτομα θέλετε να ελέγξω διαθεσιμότητα;",
    invalidCheckin: "Η ημερομηνία check-in δεν είναι έγκυρη ή έχει ήδη περάσει. Ποια νέα ημερομηνία θέλετε;",
    invalidCheckout: "Το check-out πρέπει να είναι μετά το check-in. Ποια ημερομηνία θέλετε για check-out;",
    stayTooLong: `Η διαμονή μπορεί να είναι έως ${MAX_NIGHTS} νύχτες. Ποια ημερομηνία θέλετε για check-out;`,
  },
  en: {
    askCheckin: "Sure. What check-in date would you like?",
    askCheckout: "What check-out date would you like?",
    askGuests: "How many guests should I check availability for?",
    invalidCheckin: "That check-in date is invalid or has already passed. What new check-in date would you like?",
    invalidCheckout: "Check-out must be after check-in. What check-out date would you like?",
    stayTooLong: `A stay can be up to ${MAX_NIGHTS} nights. What check-out date would you like?`,
  },
  de: {
    askCheckin: "Gern. Welches Check-in-Datum möchten Sie?",
    askCheckout: "Welches Check-out-Datum möchten Sie?",
    askGuests: "Für wie viele Personen soll ich die Verfügbarkeit prüfen?",
    invalidCheckin: "Das Check-in-Datum ist ungültig oder bereits vergangen. Welches neue Check-in-Datum möchten Sie?",
    invalidCheckout: "Das Check-out-Datum muss nach dem Check-in liegen. Welches Check-out-Datum möchten Sie?",
    stayTooLong: `Ein Aufenthalt kann bis zu ${MAX_NIGHTS} Nächte dauern. Welches Check-out-Datum möchten Sie?`,
  },
  fr: {
    askCheckin: "Bien sûr. Quelle date de check-in souhaitez-vous ?",
    askCheckout: "Quelle date de check-out souhaitez-vous ?",
    askGuests: "Pour combien de personnes dois-je vérifier les disponibilités ?",
    invalidCheckin: "La date de check-in est invalide ou déjà passée. Quelle nouvelle date souhaitez-vous ?",
    invalidCheckout: "Le check-out doit être après le check-in. Quelle date de check-out souhaitez-vous ?",
    stayTooLong: `Le séjour peut durer jusqu’à ${MAX_NIGHTS} nuits. Quelle date de check-out souhaitez-vous ?`,
  },
  it: {
    askCheckin: "Certo. Quale data di check-in desidera?",
    askCheckout: "Quale data di check-out desidera?",
    askGuests: "Per quante persone devo verificare la disponibilità?",
    invalidCheckin: "La data di check-in non è valida o è già trascorsa. Quale nuova data desidera?",
    invalidCheckout: "Il check-out deve essere successivo al check-in. Quale data di check-out desidera?",
    stayTooLong: `Il soggiorno può durare fino a ${MAX_NIGHTS} notti. Quale data di check-out desidera?`,
  },
  es: {
    askCheckin: "Claro. ¿Qué fecha de check-in desea?",
    askCheckout: "¿Qué fecha de check-out desea?",
    askGuests: "¿Para cuántas personas debo comprobar la disponibilidad?",
    invalidCheckin: "La fecha de check-in no es válida o ya ha pasado. ¿Qué nueva fecha desea?",
    invalidCheckout: "El check-out debe ser posterior al check-in. ¿Qué fecha de check-out desea?",
    stayTooLong: `La estancia puede ser de hasta ${MAX_NIGHTS} noches. ¿Qué fecha de check-out desea?`,
  },
  tr: {
    askCheckin: "Elbette. Hangi check-in tarihini istersiniz?",
    askCheckout: "Hangi check-out tarihini istersiniz?",
    askGuests: "Kaç kişi için müsaitlik kontrolü yapmalıyım?",
    invalidCheckin: "Check-in tarihi geçersiz veya geçmiş bir tarih. Hangi yeni tarihi istersiniz?",
    invalidCheckout: "Check-out tarihi check-in tarihinden sonra olmalıdır. Hangi check-out tarihini istersiniz?",
    stayTooLong: `Konaklama en fazla ${MAX_NIGHTS} gece olabilir. Hangi check-out tarihini istersiniz?`,
  },
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
  if (typeof source.checkin === "string" && isIsoDate(source.checkin)) search.checkin = source.checkin;
  if (typeof source.checkout === "string" && isIsoDate(source.checkout)) search.checkout = source.checkout;
  if (Number.isInteger(source.guests) && Number(source.guests) >= 1 && Number(source.guests) <= 5) search.guests = Number(source.guests);
  return search;
}

function isIsoDate(value?: string | null): value is string {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T12:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

function todayIso() {
  return new Date().toISOString().slice(0, 10);
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
  const today = todayIso();

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
                "You are the natural-language interpreter for the Voulamandis House room finder.",
                `Today is ${today}.`,
                "Every free-text user message reaches you before the booking state machine.",
                "Your job is to understand what the user MEANS and extract only the search fields explicitly supplied or unambiguously implied by the LATEST user message.",
                "Do not decide availability, prices, discounts, room eligibility or database results. The server and Neon do that deterministically.",
                "The user's explicit semantic intent always overrides the question the assistant asked previously.",
                "Example: if the assistant asked for check-out but the user says 'I want to change the check-in', this is an edit_search for checkin, never an invalid check-out answer.",
                "If the user wants to change/re-enter a field but does not provide its new value, put that field in clearFields and leave its extracted value empty/zero.",
                "If the user gives a replacement value in the same message, return that value and do not add the same field to clearFields.",
                "For booking_input and edit_search, checkin/checkout/guests must contain ONLY values stated in the latest user message. Never copy old currentSearch values into those fields.",
                "Use the conversation only to resolve ambiguous short replies. Example: '10/10' is checkin if the assistant asked for check-in, and checkout if the assistant asked for check-out.",
                "If the latest message explicitly says check-in, arrival, άφιξη or an equivalent in another supported language, that explicit field wins even when the previous assistant question was about check-out.",
                "If the latest message explicitly says check-out, departure, αναχώρηση or equivalent, that explicit field wins.",
                "A date range supplies both checkin and checkout. Return dates as YYYY-MM-DD.",
                "Understand natural and relative dates and corrections in Greek, English, French, German, Italian, Spanish and Turkish.",
                "If the user explicitly asks to start over/reset the room search, use restart_search.",
                "Use room_question only for a question about Voulamandis House rooms/amenities that is not changing the booking search.",
                "Use other only for conversational room-scope input that is neither booking data nor a room question.",
                "For room_question or other, answer may contain a short helpful reply in the user's language. For booking_input, edit_search and restart_search, keep answer empty because the server controls the next booking question.",
                `Search limits are 1-${MAX_NIGHTS} nights and 1-5 guests, but do not silently rewrite user values.`,
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
            name: "room_finder_interpretation",
            strict: true,
            schema: {
              type: "object",
              additionalProperties: false,
              properties: {
                intent: { type: "string", enum: ["booking_input", "edit_search", "restart_search", "room_question", "other"] },
                language: { type: "string", enum: ["en", "el", "fr", "de", "it", "es", "tr"] },
                checkin: { type: "string" },
                checkout: { type: "string" },
                guests: { type: "integer", minimum: 0, maximum: 5 },
                clearFields: {
                  type: "array",
                  items: { type: "string", enum: ["checkin", "checkout", "guests"] },
                  maxItems: 3,
                },
                answer: { type: "string" },
              },
              required: ["intent", "language", "checkin", "checkout", "guests", "clearFields", "answer"],
            },
          },
        },
      }),
    });

    const payload = await response.json().catch(() => null);
    if (!response.ok) throw new Error(payload?.error?.message || `OpenAI request failed (${response.status})`);
    const text = responseText(payload);
    if (!text) throw new Error("OpenAI returned no structured interpretation");
    return JSON.parse(text) as AiDecision;
  } finally {
    clearTimeout(timeout);
  }
}

function applyDecision(current: SearchState, decision: AiDecision): SearchState {
  const next: SearchState = decision.intent === "restart_search"
    ? { checkin: null, checkout: null, guests: null }
    : { ...current };

  for (const field of decision.clearFields || []) {
    if (field === "checkin") next.checkin = null;
    if (field === "checkout") next.checkout = null;
    if (field === "guests") next.guests = null;
  }

  if (isIsoDate(decision.checkin)) next.checkin = decision.checkin;
  if (isIsoDate(decision.checkout)) next.checkout = decision.checkout;
  if (decision.guests >= 1 && decision.guests <= 5) next.guests = decision.guests;

  return next;
}

function isBookingIntent(intent: AiIntent) {
  return intent === "booking_input" || intent === "edit_search" || intent === "restart_search";
}

function bookingNextStep(search: SearchState, language: Language): { action: AiAction; answer: string; search: SearchState } {
  const copy = FLOW_COPY[language];
  const next = { ...search };

  if (!next.checkin) return { action: "ask_user", answer: copy.askCheckin, search: next };
  if (!isIsoDate(next.checkin) || next.checkin < todayIso()) {
    next.checkin = null;
    return { action: "ask_user", answer: copy.invalidCheckin, search: next };
  }

  if (!next.checkout) return { action: "ask_user", answer: copy.askCheckout, search: next };
  if (!isIsoDate(next.checkout) || next.checkout <= next.checkin) {
    next.checkout = null;
    return { action: "ask_user", answer: copy.invalidCheckout, search: next };
  }

  const nights = nightsBetween(next.checkin, next.checkout);
  if (nights > MAX_NIGHTS) {
    next.checkout = null;
    return { action: "ask_user", answer: copy.stayTooLong, search: next };
  }

  if (!next.guests) return { action: "ask_user", answer: copy.askGuests, search: next };
  if (next.guests < 1 || next.guests > 5) {
    next.guests = null;
    return { action: "ask_user", answer: copy.askGuests, search: next };
  }

  return { action: "search_rooms", answer: "", search: next };
}

function validateSearch(search: SearchState): search is CompleteSearchState {
  if (!isIsoDate(search.checkin) || !isIsoDate(search.checkout) || !search.guests) return false;
  if (search.checkin < todayIso()) return false;
  const nights = nightsBetween(search.checkin, search.checkout);
  return nights >= 1 && nights <= MAX_NIGHTS && search.guests >= 1 && search.guests <= 5;
}

async function searchNeon(search: CompleteSearchState, origin: string) {
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
      const originalTotal = Number(room.originalTotal);
      const directTotal = Number(room.directTotal);
      const saving = Number(room.saving);
      const directDiscountPercent = Number(room.directDiscountPercent);
      if (!meta || !Number.isFinite(originalTotal) || originalTotal <= 0 || !Number.isFinite(directTotal) || directTotal <= 0 || !Number.isFinite(saving) || saving < 0 || !Number.isFinite(directDiscountPercent) || directDiscountPercent < 0) return null;
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
        originalTotal: Math.round(originalTotal * 100) / 100,
        directTotal: Math.round(directTotal * 100) / 100,
        saving: Math.round(saving * 100) / 100,
        directDiscountPercent: Number.isFinite(directDiscountPercent) ? directDiscountPercent : 0,
        guestNote: room.guestNote ? String(room.guestNote) : null,
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
    const interpretedSearch = applyDecision(current, decision);

    if (!isBookingIntent(decision.intent)) {
      return NextResponse.json({
        answer: decision.answer,
        search: interpretedSearch,
        offers: [],
        language,
        action: "respond",
        intent: decision.intent,
      });
    }

    const next = bookingNextStep(interpretedSearch, language);
    if (next.action !== "search_rooms") {
      return NextResponse.json({
        answer: next.answer,
        search: next.search,
        offers: [],
        language,
        action: next.action,
        intent: decision.intent,
      });
    }

    if (!validateSearch(next.search)) {
      return NextResponse.json({
        error: "Booking state was incomplete after deterministic validation.",
        answer: FLOW_COPY[language].askCheckin,
        search: next.search,
        offers: [],
        language,
        action: "ask_user",
        intent: decision.intent,
      }, { status: 422 });
    }

    const availability = await searchNeon(next.search, request.nextUrl.origin);
    const offers = buildOffers(availability, language);

    return NextResponse.json({
      answer: offers.length ? resultMessage(language, offers.length) : resultMessage(language, 0),
      search: next.search,
      offers,
      language,
      action: "search_rooms",
      intent: decision.intent,
      discountPercent: offers[0]?.directDiscountPercent ?? null,
      pricingSource: "neon_booking_core",
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
