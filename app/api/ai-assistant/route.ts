import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DIRECT_DISCOUNT_PERCENT = 10;
const DEFAULT_BOOKING_WEBAPP_URL =
  "https://script.google.com/macros/s/AKfycbwZ8qG1eE1YXr-Ag2LXNHrgFIkf7kCvDiTMF38NfPNC9ZGAquGMIXvn3QWPfpiKpTaa/exec";

const ROOM_FEATURES: Record<string, string[]> = {
  "267788:1": ["First floor", "Wi-Fi", "coffee and tea kettle", "private balcony", "upper-floor view", "stairs", "1 double bed", "2 single beds", "two spaces without connecting door"],
  "268803:1": ["First floor", "Wi-Fi", "coffee and tea kettle", "stairs", "1 double bed", "open-plan space"],
  "267788:2": ["First floor", "Wi-Fi", "coffee and tea kettle", "private balcony", "upper-floor view", "kitchenette", "stairs", "1 double bed", "1 single bed", "two spaces without connecting door"],
  "267788:3": ["First floor", "Wi-Fi", "coffee and tea kettle", "private balcony", "upper-floor view", "kitchenette", "stairs", "1 double bed", "1 sofa bed", "open-plan space"],
  "626129:1": ["Ground floor", "Wi-Fi", "coffee and tea kettle", "garden view", "no stairs", "1 double bed", "1 single bed", "open-plan space"],
  "268803:2": ["Ground floor", "Wi-Fi", "coffee and tea kettle", "garden view", "no stairs", "1 double bed", "open-plan space"],
  "626129:2": ["Ground floor", "Wi-Fi", "coffee and tea kettle", "garden view", "no stairs", "1 double bed", "1 single bed"],
  "265595:1": ["Independent apartment", "kitchen", "garden view", "up to 4 guests"],
  "265595:2": ["Independent apartment", "kitchen", "garden view", "up to 4 guests"],
  "265595:3": ["Independent apartment", "kitchen", "garden view", "up to 4 guests"],
};

const SYSTEM_PROMPT = `You are the digital guest assistant for Voulamandis House, rooms and apartments in Kampos, Chios, Greece.

Conversation rules:
1. Reply in the same language as the guest. Use natural, polite and simple language.
2. Answer the exact question first. Keep ordinary replies to 2-5 short sentences.
3. Do not repeat the full availability list, prices or room cards in follow-up replies unless the guest asks to compare all available rooms again.
4. When the guest mentions a specific room, discuss only that room unless another option is clearly better for the stated need.
5. Ask at most one useful follow-up question at the end. Do not offer long menus of possible next steps.
6. Do not repeatedly mention disclaimers. Mention that availability is live and not a confirmed booking only when relevant.
7. Never call Voulamandis House a hotel. Use rooms and apartments, accommodation or property.
8. Never invent availability, prices, policies, distances, amenities or booking confirmation.
9. You cannot complete or confirm a booking. Direct the guest to the booking page or reception only after they show booking intent.
10. When live availability is supplied, use only those results and do not claim that another date was checked.
11. Direct bookings receive 10% off the original price. Show original total, direct-booking total and saving when presenting an offer.
12. The 10% direct-booking discount is applied once and never combined with another offer. Do not repeat this rule in every follow-up.
13. If no priced result is returned, say that the live search did not return a complete priced option. Do not state with certainty that the property is sold out.
14. Known information: breakfast is available for €12 per person. When information is unavailable, say so briefly and suggest reception.
15. Avoid phrases such as “Here are some next steps”, “I can also”, or repeated sales language. Be helpful rather than verbose.`;

type ChatMessage = { role: "user" | "assistant"; content: string };
type SearchRequest = { checkin?: string; checkout?: string; guests?: number };
type Offer = {
  roomId: string;
  unitId: string;
  name: string;
  category: string;
  floor: string;
  maxGuests: number;
  features: string[];
  nights: number;
  originalTotal: number;
  directTotal: number;
  saving: number;
};

function extractText(payload: any): string {
  if (typeof payload?.output_text === "string" && payload.output_text.trim()) return payload.output_text.trim();
  const texts: string[] = [];
  if (Array.isArray(payload?.output)) {
    for (const item of payload.output) {
      if (!Array.isArray(item?.content)) continue;
      for (const part of item.content) {
        if (typeof part?.text === "string" && part.text.trim()) texts.push(part.text.trim());
      }
    }
  }
  return texts.join("\n").trim();
}

function validDate(value?: string) {
  return Boolean(value && /^\d{4}-\d{2}-\d{2}$/.test(value));
}

function nightsBetween(checkin: string, checkout: string) {
  const start = new Date(`${checkin}T12:00:00Z`).getTime();
  const end = new Date(`${checkout}T12:00:00Z`).getTime();
  return Math.round((end - start) / 86400000);
}

function bookingWebAppUrl() {
  return process.env.GOOGLE_BOOKING_SEARCH_WEBAPP_URL || DEFAULT_BOOKING_WEBAPP_URL;
}

async function getOffers(search: SearchRequest): Promise<Offer[]> {
  if (!validDate(search.checkin) || !validDate(search.checkout)) return [];
  const guests = Math.max(1, Math.min(Number(search.guests || 2), 10));
  const nights = nightsBetween(search.checkin!, search.checkout!);
  if (nights < 1 || nights > 30) return [];

  const url = new URL(bookingWebAppUrl());
  url.searchParams.set("action", "search_range");
  url.searchParams.set("checkin", search.checkin!);
  url.searchParams.set("checkout", search.checkout!);
  url.searchParams.set("guests", String(guests));

  const response = await fetch(url.toString(), {
    headers: { Accept: "application/json", "User-Agent": "VoulamandisHouseAI/1.0" },
    cache: "no-store",
  });
  const data = await response.json().catch(() => null);
  if (!response.ok || !data?.success || !Array.isArray(data?.rooms?.available)) return [];

  return data.rooms.available
    .filter((item: any) => Number(item?.maxGuests || 0) >= guests)
    .map((item: any) => {
      const originalTotal = Number(item?.totalPrice || 0);
      const directTotal = Math.round(originalTotal * 0.9 * 100) / 100;
      const key = `${item.roomId}:${item.unitId}`;
      return {
        roomId: String(item.roomId),
        unitId: String(item.unitId),
        name: String(item.displayName || item.name || `Room ${item.unitId}`),
        category: String(item.category || item.roomName || "Room"),
        floor: String(item.location || ""),
        maxGuests: Number(item.maxGuests || 0),
        features: ROOM_FEATURES[key] || [],
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

export async function POST(request: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "The AI assistant is not configured yet." }, { status: 503 });

  try {
    const body = await request.json();
    const messages: ChatMessage[] = Array.isArray(body?.messages)
      ? body.messages
          .filter((message: any) => (message?.role === "user" || message?.role === "assistant") && typeof message?.content === "string")
          .slice(-10)
          .map((message: ChatMessage) => ({ role: message.role, content: message.content.trim().slice(0, 1400) }))
          .filter((message: ChatMessage) => message.content.length > 0)
      : [];

    if (!messages.length || messages[messages.length - 1].role !== "user") {
      return NextResponse.json({ error: "Please enter a question." }, { status: 400 });
    }

    const search: SearchRequest = body?.search || {};
    const includeOffers = body?.includeOffers === true;
    const offers = includeOffers ? await getOffers(search) : [];

    const availabilityContext = includeOffers && validDate(search.checkin) && validDate(search.checkout)
      ? `\n\nLIVE SEARCH USED FOR THIS TURN ONLY:\nCheck-in: ${search.checkin}\nCheck-out: ${search.checkout}\nGuests: ${search.guests || 2}\nResults: ${JSON.stringify(offers)}\nSummarize the best options briefly. The UI will display detailed room cards, so do not duplicate every amenity and every price in the text. If results are empty, say the live service did not return a complete priced option.`
      : `\n\nFOLLOW-UP TURN: Do not repeat the previous room list or prices unless the user explicitly asks for them. Use the conversation history to answer the specific follow-up question.`;

    const openAIResponse = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-5-mini",
        instructions: SYSTEM_PROMPT + availabilityContext,
        input: messages,
        reasoning: { effort: "minimal" },
        max_output_tokens: 700,
      }),
      cache: "no-store",
    });

    const payload = await openAIResponse.json();
    if (!openAIResponse.ok) {
      console.error("OpenAI API error", openAIResponse.status, payload?.error?.message);
      return NextResponse.json({ error: "The assistant is temporarily unavailable. Please try again shortly." }, { status: 502 });
    }

    const answer = extractText(payload);
    if (!answer) return NextResponse.json({ error: "The assistant could not compose the answer. Please try again." }, { status: 502 });

    return NextResponse.json({ answer, offers: includeOffers ? offers : [], discountPercent: DIRECT_DISCOUNT_PERCENT });
  } catch (error) {
    console.error("AI assistant route error", error);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
