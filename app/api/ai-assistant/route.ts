import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DIRECT_DISCOUNT_PERCENT = 10;
const DEFAULT_BOOKING_WEBAPP_URL =
  "https://script.google.com/macros/s/AKfycbwZ8qG1eE1YXr-Ag2LXNHrgFIkf7kCvDiTMF38NfPNC9ZGAquGMIXvn3QWPfpiKpTaa/exec";

type SupportedLanguage = "en" | "el" | "fr" | "de" | "it" | "es" | "tr";
type RoomType = "standard" | "economy" | "family";

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

const SYSTEM_PROMPT = `You are the digital guest assistant for Voulamandis House, rooms and apartments in Kampos, Chios, Greece.
Reply in the same language as the guest. Be concise. Never invent availability, prices, amenities or booking confirmation. Never call Voulamandis House a hotel. Direct bookings receive 10% off once and never combine with another offer. A booking request is not a confirmed booking. Never ask again for information already present in SEARCH FORM CONTEXT.`;

type ChatMessage = { role: "user" | "assistant"; content: string };
type SearchRequest = { checkin?: string; checkout?: string; guests?: number };
type Action = { label: string; href?: string; action?: "open_request"; roomId?: string; unitId?: string };
type Offer = { roomId: string; unitId: string; name: string; category: string; floor: string; maxGuests: number; features: string[]; image: string; detailsUrl: string; bookingUrl: string; nights: number; originalTotal: number; directTotal: number; saving: number };

function detectLanguage(messages: ChatMessage[]): SupportedLanguage {
  const text = [...messages].reverse().find((message) => message.role === "user")?.content || "";
  if (/[Α-Ωα-ωΆ-ώ]/.test(text)) return "el";
  if (/[ğüşöçıİĞÜŞÖÇ]/i.test(text)) return "tr";
  if (/[äöüß]/i.test(text) || /\b(ich|zimmer|verfügbarkeit|preis|möchte|ist|sind)\b/i.test(text)) return "de";
  if (/[éèêëàâçîïôùûüÿœ]/i.test(text) || /\b(je|chambre|prix|disponible|voudrais|est|sont)\b/i.test(text)) return "fr";
  if (/\b(quiero|habitación|precio|disponible|para|es|son)\b/i.test(text)) return "es";
  if (/\b(vorrei|camera|prezzo|disponibile|per|è|sono)\b/i.test(text)) return "it";
  return "en";
}

function extractText(payload: any): string {
  if (typeof payload?.output_text === "string" && payload.output_text.trim()) return payload.output_text.trim();
  const texts: string[] = [];
  for (const item of Array.isArray(payload?.output) ? payload.output : []) {
    for (const part of Array.isArray(item?.content) ? item.content : []) {
      if (typeof part?.text === "string" && part.text.trim()) texts.push(part.text.trim());
    }
  }
  return texts.join("\n").trim();
}

function validDate(value?: string) { return Boolean(value && /^\d{4}-\d{2}-\d{2}$/.test(value)); }
function nightsBetween(checkin: string, checkout: string) { return Math.round((new Date(`${checkout}T12:00:00Z`).getTime() - new Date(`${checkin}T12:00:00Z`).getTime()) / 86400000); }
function bookingWebAppUrl() { return process.env.GOOGLE_BOOKING_SEARCH_WEBAPP_URL || DEFAULT_BOOKING_WEBAPP_URL; }
function cleanOffers(value: unknown): Offer[] { return Array.isArray(value) ? value.slice(0, 10).filter((item: any) => item && typeof item.name === "string" && typeof item.roomId === "string") as Offer[] : []; }

function formatIsoDate(value: string, language: SupportedLanguage) {
  const locale = language === "el" ? "el-GR" : language === "de" ? "de-DE" : language === "fr" ? "fr-FR" : language === "it" ? "it-IT" : language === "es" ? "es-ES" : language === "tr" ? "tr-TR" : "en-GB";
  return new Intl.DateTimeFormat(locale, { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(`${value}T12:00:00Z`));
}

function partialSearchResponse(search: SearchRequest, language: SupportedLanguage): string | null {
  if (!validDate(search.checkin)) return language === "el" ? "Συμπλήρωσε πρώτα την ημερομηνία άφιξης στο πλαίσιο «Η διαμονή σας»." : "Please select your arrival date in the stay form first.";
  if (!validDate(search.checkout)) {
    const arrival = formatIsoDate(search.checkin!, language);
    return language === "el" ? `Έχω ήδη άφιξη ${arrival} και ${search.guests || 2} επισκέπτες. Συμπλήρωσε μόνο την ημερομηνία αναχώρησης και πάτησε «Δείτε διαθεσιμότητα».` : `I already have arrival ${arrival} and ${search.guests || 2} guests. Please add only the departure date and press “View availability”.`;
  }
  return null;
}

function liveSearchAnswer(language: SupportedLanguage, offers: Offer[], search: SearchRequest) {
  const checkin = formatIsoDate(search.checkin!, language);
  const checkout = formatIsoDate(search.checkout!, language);
  const guests = Number(search.guests || 2);
  const count = offers.length;

  if (!count) {
    const answers: Record<SupportedLanguage, string> = {
      el: `Δεν βρέθηκε διαθέσιμο δωμάτιο για ${guests} επισκέπτες από ${checkin} έως ${checkout}.`,
      en: `No room was found for ${guests} guests from ${checkin} to ${checkout}.`,
      de: `Für ${guests} Gäste vom ${checkin} bis ${checkout} wurde kein verfügbares Zimmer gefunden.`,
      fr: `Aucune chambre disponible n’a été trouvée pour ${guests} personnes du ${checkin} au ${checkout}.`,
      it: `Non è stata trovata alcuna camera disponibile per ${guests} ospiti dal ${checkin} al ${checkout}.`,
      es: `No se encontró ninguna habitación disponible para ${guests} huéspedes del ${checkin} al ${checkout}.`,
      tr: `${checkin}–${checkout} tarihleri arasında ${guests} kişi için uygun oda bulunamadı.`,
    };
    return answers[language];
  }

  const answers: Record<SupportedLanguage, string> = {
    el: `Βρέθηκαν ${count} διαθέσιμες ${count === 1 ? "επιλογή" : "επιλογές"} για ${guests} επισκέπτες από ${checkin} έως ${checkout}. Πατήστε σε οποιοδήποτε δωμάτιο για να δείτε φωτογραφίες, χαρακτηριστικά, αρχική τιμή και τιμή απευθείας κράτησης.`,
    en: `${count} available ${count === 1 ? "option was" : "options were"} found for ${guests} guests from ${checkin} to ${checkout}. Tap any room to view photos, features, the original price and the direct-booking price.`,
    de: `${count} verfügbare ${count === 1 ? "Option wurde" : "Optionen wurden"} für ${guests} Gäste vom ${checkin} bis ${checkout} gefunden. Tippen Sie auf ein Zimmer, um Fotos, Ausstattung sowie Original- und Direktbuchungspreis zu sehen.`,
    fr: `${count} ${count === 1 ? "option disponible a été trouvée" : "options disponibles ont été trouvées"} pour ${guests} personnes du ${checkin} au ${checkout}. Touchez une chambre pour voir les photos, les équipements et les tarifs.`,
    it: `Sono state trovate ${count} ${count === 1 ? "opzione disponibile" : "opzioni disponibili"} per ${guests} ospiti dal ${checkin} al ${checkout}. Tocca una camera per vedere foto, caratteristiche e prezzi.`,
    es: `Se encontraron ${count} ${count === 1 ? "opción disponible" : "opciones disponibles"} para ${guests} huéspedes del ${checkin} al ${checkout}. Pulsa una habitación para ver fotos, características y precios.`,
    tr: `${checkin}–${checkout} tarihleri arasında ${guests} kişi için ${count} uygun seçenek bulundu. Fotoğrafları, özellikleri ve fiyatları görmek için bir odaya dokunun.`,
  };
  return answers[language];
}

function findMentionedOffer(text: string, offers: Offer[]) {
  const normalized = text.toLocaleLowerCase("el-GR");
  return offers.find((offer) => {
    const roomNumber = offer.name.match(/\d+/)?.[0];
    return normalized.includes(offer.name.toLocaleLowerCase("el-GR")) || Boolean(roomNumber && new RegExp(`(?:room|δωμάτιο|δωματιο)\\s*${roomNumber}(?:\\D|$)`, "i").test(text));
  }) || (offers.length === 1 ? offers[0] : undefined);
}

function detectQuickResponse(text: string, offers: Offer[]): { answer: string; actions: Action[] } | null {
  if (!offers.length) return null;
  const offer = findMentionedOffer(text, offers);
  if (!offer) return null;
  const asksDetails = /(φωτο|εικόν|εικον|photo|picture|πληροφορί|πληροφορι|details|λεπτομέρ|λεπτομερ|χαρακτηριστ|παροχ)/i.test(text);
  const asksBooking = /(κράτη|κρατη|reserve|book|reception|ρεσεψ|αίτημα|αιτημα|ενδιαφέρομαι|ενδιαφερομαι|link|σύνδεσ|συνδεσ|url)/i.test(text);
  if (asksDetails) return { answer: `Για το ${offer.name}, χρησιμοποίησε το κουμπί «Φωτογραφίες & λεπτομέρειες».`, actions: [{ label: "Φωτογραφίες & λεπτομέρειες", href: offer.detailsUrl }, { label: "Αίτημα κράτησης", action: "open_request", roomId: offer.roomId, unitId: offer.unitId }] };
  if (asksBooking) return { answer: `Για το ${offer.name}, πάτησε «Αίτημα κράτησης».`, actions: [{ label: "Αίτημα κράτησης", action: "open_request", roomId: offer.roomId, unitId: offer.unitId }, { label: "Φωτογραφίες & λεπτομέρειες", href: offer.detailsUrl }] };
  return null;
}

async function getOffers(search: SearchRequest, language: SupportedLanguage): Promise<Offer[]> {
  if (!validDate(search.checkin) || !validDate(search.checkout)) return [];
  const guests = Math.max(1, Math.min(Number(search.guests || 2), 10));
  const nights = nightsBetween(search.checkin!, search.checkout!);
  if (nights < 1 || nights > 30) return [];
  const url = new URL(bookingWebAppUrl());
  url.searchParams.set("action", "search_range");
  url.searchParams.set("checkin", search.checkin!);
  url.searchParams.set("checkout", search.checkout!);
  url.searchParams.set("guests", String(guests));
  const response = await fetch(url.toString(), { headers: { Accept: "application/json", "User-Agent": "VoulamandisHouseAI/1.0" }, cache: "no-store" });
  const data = await response.json().catch(() => null);
  if (!response.ok || !data?.success || !Array.isArray(data?.rooms?.available)) return [];
  return data.rooms.available.filter((item: any) => Number(item?.maxGuests || 0) >= guests).map((item: any) => {
    const originalTotal = Number(item?.totalPrice || 0);
    const directTotal = Math.round(originalTotal * 0.9 * 100) / 100;
    const key = `${item.roomId}:${item.unitId}`;
    const roomMeta = ROOM_META[key] || { features: [], image: "/images/rooms/voulamandis-house-rooms.webp", type: "standard" as RoomType };
    return { roomId: String(item.roomId), unitId: String(item.unitId), name: String(item.displayName || item.name || `Room ${item.unitId}`), category: String(item.category || item.roomName || "Room"), floor: String(item.location || ""), maxGuests: Number(item.maxGuests || 0), features: roomMeta.features, image: roomMeta.image, detailsUrl: ROOM_URLS[roomMeta.type][language] || ROOM_URLS[roomMeta.type].en, bookingUrl: "/book-now", nights, originalTotal: Math.round(originalTotal * 100) / 100, directTotal, saving: Math.round((originalTotal - directTotal) * 100) / 100 } satisfies Offer;
  }).filter((offer: Offer) => offer.originalTotal > 0).sort((a: Offer, b: Offer) => a.directTotal - b.directTotal).slice(0, 10);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const messages: ChatMessage[] = Array.isArray(body?.messages) ? body.messages.filter((message: any) => (message?.role === "user" || message?.role === "assistant") && typeof message?.content === "string").slice(-10).map((message: ChatMessage) => ({ role: message.role, content: message.content.trim().slice(0, 1400) })).filter((message: ChatMessage) => message.content.length > 0) : [];
    if (!messages.length || messages[messages.length - 1].role !== "user") return NextResponse.json({ error: "Please enter a question." }, { status: 400 });

    const language = detectLanguage(messages);
    const search: SearchRequest = body?.search || {};
    const includeOffers = body?.includeOffers === true;
    const previousOffers = cleanOffers(body?.activeOffers);
    const latestText = messages[messages.length - 1].content;

    if (!includeOffers && !previousOffers.length) {
      const partial = partialSearchResponse(search, language);
      if (partial) return NextResponse.json({ answer: partial, actions: [], offers: [], language, discountPercent: DIRECT_DISCOUNT_PERCENT });
    }

    const offers = includeOffers ? await getOffers(search, language) : previousOffers;

    if (includeOffers) {
      return NextResponse.json({
        answer: liveSearchAnswer(language, offers, search),
        actions: [],
        offers,
        language,
        discountPercent: DIRECT_DISCOUNT_PERCENT,
      });
    }

    const quick = detectQuickResponse(latestText, offers);
    if (quick) return NextResponse.json({ answer: quick.answer, actions: quick.actions, offers: [], language, discountPercent: DIRECT_DISCOUNT_PERCENT });

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) return NextResponse.json({ error: "The AI assistant is not configured yet." }, { status: 503 });

    const roomContext = offers.length ? `\n\nCURRENT ROOM CONTEXT:\n${JSON.stringify(offers.map(({ image, ...offer }) => offer))}` : "\n\nCURRENT ROOM CONTEXT is empty.";
    const searchContext = `\n\nSEARCH FORM CONTEXT: check-in=${search.checkin || "missing"}, check-out=${search.checkout || "missing"}, guests=${search.guests || 2}. Never ask again for fields already present.`;
    const openAIResponse = await fetch("https://api.openai.com/v1/responses", { method: "POST", headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" }, body: JSON.stringify({ model: process.env.OPENAI_MODEL || "gpt-5-mini", instructions: SYSTEM_PROMPT + roomContext + searchContext, input: messages, reasoning: { effort: "minimal" }, max_output_tokens: 350 }), cache: "no-store" });
    const payload = await openAIResponse.json();
    if (!openAIResponse.ok) return NextResponse.json({ error: "The assistant is temporarily unavailable. Please try again shortly." }, { status: 502 });
    const answer = extractText(payload);
    if (!answer) return NextResponse.json({ error: "The assistant could not compose the answer. Please try again." }, { status: 502 });
    return NextResponse.json({ answer, actions: [], offers: [], language, discountPercent: DIRECT_DISCOUNT_PERCENT });
  } catch (error) {
    console.error("AI assistant route error", error);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
