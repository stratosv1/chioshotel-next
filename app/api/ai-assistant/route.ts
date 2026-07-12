import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DIRECT_DISCOUNT_PERCENT = 10;
const DEFAULT_BOOKING_WEBAPP_URL =
  "https://script.google.com/macros/s/AKfycbwZ8qG1eE1YXr-Ag2LXNHrgFIkf7kCvDiTMF38NfPNC9ZGAquGMIXvn3QWPfpiKpTaa/exec";

const ROOM_META: Record<string, { features: string[]; image: string; detailsUrl: string }> = {
  "267788:1": { features: ["First floor", "Wi-Fi", "Coffee & tea kettle", "Private balcony", "Upper-floor view", "Stairs", "1 double bed", "2 single beds", "Two spaces"], image: "/images/rooms/DSC07776-2-e1675109942622.webp", detailsUrl: "/rooms/standard-double" },
  "268803:1": { features: ["First floor", "Wi-Fi", "Coffee & tea kettle", "Stairs", "1 double bed", "Open-plan space"], image: "/images/rooms/DSC07803-1.webp", detailsUrl: "/rooms/economy-double" },
  "267788:2": { features: ["First floor", "Wi-Fi", "Coffee & tea kettle", "Private balcony", "Upper-floor view", "Kitchenette", "Stairs", "1 double bed", "1 single bed", "Two spaces"], image: "/images/rooms/DSC07867-1.webp", detailsUrl: "/rooms/standard-double" },
  "267788:3": { features: ["First floor", "Wi-Fi", "Coffee & tea kettle", "Private balcony", "Upper-floor view", "Kitchenette", "Stairs", "1 double bed", "1 sofa bed", "Open-plan space"], image: "/images/rooms/received_1748354861920234.webp", detailsUrl: "/rooms/standard-double" },
  "626129:1": { features: ["Ground floor", "Wi-Fi", "Coffee & tea kettle", "Garden view", "No stairs", "1 double bed", "1 single bed", "Open-plan space"], image: "/images/rooms/voulamandis-house-rooms.webp", detailsUrl: "/rooms/standard-double" },
  "268803:2": { features: ["Ground floor", "Wi-Fi", "Coffee & tea kettle", "Garden view", "No stairs", "1 double bed", "Open-plan space"], image: "/images/rooms/received_1753964631359257.webp", detailsUrl: "/rooms/economy-double" },
  "626129:2": { features: ["Ground floor", "Wi-Fi", "Coffee & tea kettle", "Garden view", "No stairs", "1 double bed", "1 single bed"], image: "/images/rooms/double-triple-room.jpg", detailsUrl: "/rooms/standard-double" },
  "265595:1": { features: ["Independent apartment", "Kitchen", "Garden view", "Up to 4 guests"], image: "/images/rooms/chios-apartments-voulamandis.webp", detailsUrl: "/rooms/family-apartments" },
  "265595:2": { features: ["Independent apartment", "Kitchen", "Garden view", "Up to 4 guests"], image: "/images/rooms/chios-apartments-voulamandis.webp", detailsUrl: "/rooms/family-apartments" },
  "265595:3": { features: ["Independent apartment", "Kitchen", "Garden view", "Up to 4 guests"], image: "/images/rooms/DSC07899.webp", detailsUrl: "/rooms/family-apartments" },
};

const SYSTEM_PROMPT = `You are the digital guest assistant for Voulamandis House, rooms and apartments in Kampos, Chios, Greece.

Conversation rules:
1. Reply in the same language as the guest, naturally and clearly.
2. Answer the exact question first in 1-3 short sentences.
3. Never pretend you performed an availability check, booking request, reservation or contact action unless the application actually did it.
4. Never tell the guest to use a booking-request button when CURRENT ROOM CONTEXT is empty.
5. When there are no current live room results, politely ask the guest to select arrival, departure and guests in the search panel and press “View availability”. Do not discuss a specific available room before that check.
6. Never ask the guest to repeat dates, guests or room when those are already present in CURRENT ROOM CONTEXT.
7. If the guest asks for photos or more room details, use the supplied features and direct them to the visible “Photos & details” action.
8. If the guest asks to book, reserve, send a request, or contact reception and a current room exists, direct them to the visible “Booking request” action. The form already carries room, dates, guests and price.
9. If the guest asks for one room only and multiple current offers exist, recommend the lowest-priced suitable current offer and explain the choice briefly.
10. Do not repeat the complete availability list in follow-ups.
11. When the guest mentions a specific room, answer only about that room.
12. Never call Voulamandis House a hotel. Use rooms and apartments, accommodation or property.
13. Never invent availability, prices, amenities, policies or booking confirmation.
14. A direct booking receives 10% off once and never combines with another offer.
15. A booking request is not a confirmed booking. Reception confirms it.
16. Ask at most one useful follow-up question and avoid long menus, apologies or generic statements.
17. Breakfast is available for €12 per person.`;

type ChatMessage = { role: "user" | "assistant"; content: string };
type SearchRequest = { checkin?: string; checkout?: string; guests?: number };
type Action = { label: string; href?: string; action?: "open_request"; roomId?: string; unitId?: string };
type Offer = {
  roomId: string; unitId: string; name: string; category: string; floor: string;
  maxGuests: number; features: string[]; image: string; detailsUrl: string;
  bookingUrl: string; nights: number; originalTotal: number; directTotal: number; saving: number;
};

function extractText(payload: any): string {
  if (typeof payload?.output_text === "string" && payload.output_text.trim()) return payload.output_text.trim();
  const texts: string[] = [];
  if (Array.isArray(payload?.output)) {
    for (const item of payload.output) {
      if (!Array.isArray(item?.content)) continue;
      for (const part of item.content) if (typeof part?.text === "string" && part.text.trim()) texts.push(part.text.trim());
    }
  }
  return texts.join("\n").trim();
}

function validDate(value?: string) { return Boolean(value && /^\d{4}-\d{2}-\d{2}$/.test(value)); }
function nightsBetween(checkin: string, checkout: string) { return Math.round((new Date(`${checkout}T12:00:00Z`).getTime() - new Date(`${checkin}T12:00:00Z`).getTime()) / 86400000); }
function bookingWebAppUrl() { return process.env.GOOGLE_BOOKING_SEARCH_WEBAPP_URL || DEFAULT_BOOKING_WEBAPP_URL; }
function cleanOffers(value: unknown): Offer[] { return Array.isArray(value) ? value.slice(0, 10).filter((item: any) => item && typeof item.name === "string" && typeof item.roomId === "string") as Offer[] : []; }

function findMentionedOffer(text: string, offers: Offer[]) {
  const normalized = text.toLocaleLowerCase("el-GR");
  return offers.find((offer) => {
    const roomNumber = offer.name.match(/\d+/)?.[0];
    return normalized.includes(offer.name.toLocaleLowerCase("el-GR")) || Boolean(roomNumber && new RegExp(`(?:room|δωμάτιο|δωματιο)\\s*${roomNumber}(?:\\D|$)`, "i").test(text));
  }) || (offers.length === 1 ? offers[0] : undefined);
}

function featureText(offer: Offer) {
  return offer.features.slice(0, 7).join(", ");
}

function detectNoOfferResponse(text: string, offers: Offer[]): { answer: string; actions: Action[] } | null {
  if (offers.length) return null;
  const asksAvailabilityOrBooking = /(διαθέσιμ|διαθεσιμ|δωμάτι|δωματι|οικογενειακ|κράτη|κρατη|reserve|book|room|apartment)/i.test(text);
  if (!asksAvailabilityOrBooking) return null;
  return {
    answer: "Για να προτείνω πραγματικά διαθέσιμο δωμάτιο, επίλεξε άφιξη, αναχώρηση και επισκέπτες στο πλαίσιο «Η διαμονή σας» και πάτησε «Δείτε διαθεσιμότητα». Μετά θα σου δείξω μόνο τις διαθέσιμες επιλογές με φωτογραφίες και τιμές.",
    actions: [],
  };
}

function detectQuickResponse(text: string, offers: Offer[]): { answer: string; actions: Action[] } | null {
  const noOffer = detectNoOfferResponse(text, offers);
  if (noOffer) return noOffer;

  const lower = text.toLocaleLowerCase("el-GR");
  const asksOneRoom = /(ένα μόνο|ενα μονο|μόνο ένα|μονο ενα|one room|single option|συγκεκριμένο διαθέσιμο|συγκεκριμενο διαθεσιμο)/i.test(lower);
  if (asksOneRoom && offers.length) {
    const offer = offers[0];
    return {
      answer: `Η καλύτερη διαθέσιμη επιλογή αυτή τη στιγμή είναι το ${offer.name}, με τιμή απευθείας κράτησης ${offer.directTotal.toFixed(2)} € για ${offer.nights} ${offer.nights === 1 ? "νύχτα" : "νύχτες"}. Το προτείνω επειδή είναι η οικονομικότερη διαθέσιμη επιλογή που καλύπτει τον αριθμό επισκεπτών.`,
      actions: [
        { label: "Αίτημα κράτησης", action: "open_request", roomId: offer.roomId, unitId: offer.unitId },
        { label: "Φωτογραφίες & λεπτομέρειες", href: offer.detailsUrl },
      ],
    };
  }

  const offer = findMentionedOffer(text, offers);
  if (!offer) return null;

  const asksPhotos = /(φωτο|εικόν|εικον|photo|picture)/i.test(lower);
  const asksDetails = /(περισσότερ.*πληροφορ|πληροφορί|πληροφορι|details|λεπτομέρ|λεπτομερ|χαρακτηριστ|παροχ)/i.test(lower);
  const asksLink = /(link|σύνδεσ|συνδεσ|url)/i.test(lower);
  const asksBooking = /(κράτη|κρατη|reserve|book|reception|ρεσεψ|αίτημα|αιτημα|ενδιαφέρομαι|ενδιαφερομαι)/i.test(lower);

  if (asksDetails || asksPhotos || (asksLink && !asksBooking)) {
    return {
      answer: `Το ${offer.name} είναι ${offer.category.toLowerCase()} για έως ${offer.maxGuests} άτομα. Βασικά χαρακτηριστικά: ${featureText(offer)}. Για όλες τις φωτογραφίες και την πλήρη περιγραφή, πάτησε «Φωτογραφίες & λεπτομέρειες».`,
      actions: [
        { label: "Φωτογραφίες & λεπτομέρειες", href: offer.detailsUrl },
        { label: "Αίτημα κράτησης", action: "open_request", roomId: offer.roomId, unitId: offer.unitId },
      ],
    };
  }

  if (asksBooking || asksLink) {
    return {
      answer: `Για το ${offer.name}, πάτησε «Αίτημα κράτησης». Το δωμάτιο, οι ημερομηνίες, οι επισκέπτες και η τιμή έχουν ήδη συμπληρωθεί· χρειάζονται μόνο το όνομα και ένα στοιχείο επικοινωνίας.`,
      actions: [
        { label: "Αίτημα κράτησης", action: "open_request", roomId: offer.roomId, unitId: offer.unitId },
        { label: "Φωτογραφίες & λεπτομέρειες", href: offer.detailsUrl },
      ],
    };
  }
  return null;
}

async function getOffers(search: SearchRequest): Promise<Offer[]> {
  if (!validDate(search.checkin) || !validDate(search.checkout)) return [];
  const guests = Math.max(1, Math.min(Number(search.guests || 2), 10));
  const nights = nightsBetween(search.checkin!, search.checkout!);
  if (nights < 1 || nights > 30) return [];
  const url = new URL(bookingWebAppUrl());
  url.searchParams.set("action", "search_range"); url.searchParams.set("checkin", search.checkin!); url.searchParams.set("checkout", search.checkout!); url.searchParams.set("guests", String(guests));
  const response = await fetch(url.toString(), { headers: { Accept: "application/json", "User-Agent": "VoulamandisHouseAI/1.0" }, cache: "no-store" });
  const data = await response.json().catch(() => null);
  if (!response.ok || !data?.success || !Array.isArray(data?.rooms?.available)) return [];
  return data.rooms.available.filter((item: any) => Number(item?.maxGuests || 0) >= guests).map((item: any) => {
    const originalTotal = Number(item?.totalPrice || 0); const directTotal = Math.round(originalTotal * 0.9 * 100) / 100; const key = `${item.roomId}:${item.unitId}`;
    const roomMeta = ROOM_META[key] || { features: [], image: "/images/rooms/voulamandis-house-rooms.webp", detailsUrl: "/rooms" };
    return { roomId: String(item.roomId), unitId: String(item.unitId), name: String(item.displayName || item.name || `Room ${item.unitId}`), category: String(item.category || item.roomName || "Room"), floor: String(item.location || ""), maxGuests: Number(item.maxGuests || 0), features: roomMeta.features, image: roomMeta.image, detailsUrl: roomMeta.detailsUrl, bookingUrl: "/book-now", nights, originalTotal: Math.round(originalTotal * 100) / 100, directTotal, saving: Math.round((originalTotal - directTotal) * 100) / 100 } satisfies Offer;
  }).filter((offer: Offer) => offer.originalTotal > 0).sort((a: Offer, b: Offer) => a.directTotal - b.directTotal).slice(0, 10);
}

export async function POST(request: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "The AI assistant is not configured yet." }, { status: 503 });
  try {
    const body = await request.json();
    const messages: ChatMessage[] = Array.isArray(body?.messages) ? body.messages.filter((message: any) => (message?.role === "user" || message?.role === "assistant") && typeof message?.content === "string").slice(-10).map((message: ChatMessage) => ({ role: message.role, content: message.content.trim().slice(0, 1400) })).filter((message: ChatMessage) => message.content.length > 0) : [];
    if (!messages.length || messages[messages.length - 1].role !== "user") return NextResponse.json({ error: "Please enter a question." }, { status: 400 });

    const search: SearchRequest = body?.search || {};
    const includeOffers = body?.includeOffers === true;
    const previousOffers = cleanOffers(body?.activeOffers);
    const offers = includeOffers ? await getOffers(search) : previousOffers;
    const latestText = messages[messages.length - 1].content;
    const quick = !includeOffers ? detectQuickResponse(latestText, offers) : null;
    if (quick) return NextResponse.json({ answer: quick.answer, actions: quick.actions, offers: [], discountPercent: DIRECT_DISCOUNT_PERCENT });

    const roomContext = offers.length ? `\n\nCURRENT ROOM CONTEXT:\n${JSON.stringify(offers.map(({ image, ...offer }) => offer))}` : "\n\nCURRENT ROOM CONTEXT is empty. No live room has been selected.";
    const turnContext = includeOffers && validDate(search.checkin) && validDate(search.checkout)
      ? `\n\nLIVE SEARCH FOR THIS TURN: Check-in ${search.checkin}, check-out ${search.checkout}, guests ${search.guests || 2}. Summarize the best options in no more than 3 short sentences. Detailed cards are shown by the UI.`
      : `\n\nFOLLOW-UP TURN: Use CURRENT ROOM CONTEXT. If it is empty, instruct the guest to use the search panel. Never suggest a booking request without a current offer.`;
    const openAIResponse = await fetch("https://api.openai.com/v1/responses", { method: "POST", headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" }, body: JSON.stringify({ model: process.env.OPENAI_MODEL || "gpt-5-mini", instructions: SYSTEM_PROMPT + roomContext + turnContext, input: messages, reasoning: { effort: "minimal" }, max_output_tokens: 450 }), cache: "no-store" });
    const payload = await openAIResponse.json();
    if (!openAIResponse.ok) return NextResponse.json({ error: "The assistant is temporarily unavailable. Please try again shortly." }, { status: 502 });
    const answer = extractText(payload);
    if (!answer) return NextResponse.json({ error: "The assistant could not compose the answer. Please try again." }, { status: 502 });
    return NextResponse.json({ answer, actions: [], offers: includeOffers ? offers : [], discountPercent: DIRECT_DISCOUNT_PERCENT });
  } catch (error) {
    console.error("AI assistant route error", error);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
