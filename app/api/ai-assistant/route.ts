import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DIRECT_DISCOUNT_PERCENT = 10;
const DEFAULT_BOOKING_WEBAPP_URL =
  "https://script.google.com/macros/s/AKfycbwZ8qG1eE1YXr-Ag2LXNHrgFIkf7kCvDiTMF38NfPNC9ZGAquGMIXvn3QWPfpiKpTaa/exec";

const ROOM_META: Record<
  string,
  {
    name: string;
    category: string;
    floor: string;
    maxGuests: number;
    features: string[];
  }
> = {
  "267788:1": {
    name: "Room 1",
    category: "First-floor double / triple room",
    floor: "First floor",
    maxGuests: 4,
    features: ["Wi-Fi", "coffee and tea kettle", "private balcony", "upper-floor view", "stairs", "1 double bed", "2 single beds", "two spaces without connecting door"],
  },
  "268803:1": {
    name: "Room 2",
    category: "Economy double room",
    floor: "First floor",
    maxGuests: 2,
    features: ["Wi-Fi", "coffee and tea kettle", "stairs", "1 double bed", "open-plan space"],
  },
  "267788:2": {
    name: "Room 3",
    category: "First-floor double / triple room",
    floor: "First floor",
    maxGuests: 3,
    features: ["Wi-Fi", "coffee and tea kettle", "private balcony", "upper-floor view", "kitchenette", "stairs", "1 double bed", "1 single bed", "two spaces without connecting door"],
  },
  "267788:3": {
    name: "Room 4",
    category: "First-floor double / triple room",
    floor: "First floor",
    maxGuests: 3,
    features: ["Wi-Fi", "coffee and tea kettle", "private balcony", "upper-floor view", "kitchenette", "stairs", "1 double bed", "1 sofa bed", "open-plan space"],
  },
  "626129:1": {
    name: "Room 5",
    category: "Ground-floor double / triple room",
    floor: "Ground floor",
    maxGuests: 3,
    features: ["Wi-Fi", "coffee and tea kettle", "garden view", "no stairs", "1 double bed", "1 single bed", "open-plan space"],
  },
  "268803:2": {
    name: "Room 6",
    category: "Economy double room",
    floor: "Ground floor",
    maxGuests: 2,
    features: ["Wi-Fi", "coffee and tea kettle", "garden view", "no stairs", "1 double bed", "open-plan space"],
  },
  "626129:2": {
    name: "Room 7",
    category: "Ground-floor double / triple room",
    floor: "Ground floor",
    maxGuests: 3,
    features: ["Wi-Fi", "coffee and tea kettle", "garden view", "no stairs", "1 double bed", "1 single bed"],
  },
  "265595:1": {
    name: "Apartment 8",
    category: "Family apartment",
    floor: "Independent",
    maxGuests: 4,
    features: ["Wi-Fi", "private kitchen", "garden view", "up to 4 guests"],
  },
  "265595:2": {
    name: "Apartment 9",
    category: "Family apartment",
    floor: "Independent",
    maxGuests: 4,
    features: ["Wi-Fi", "private kitchen", "garden view", "up to 4 guests"],
  },
  "265595:3": {
    name: "Apartment 10",
    category: "Family apartment",
    floor: "Independent",
    maxGuests: 4,
    features: ["Wi-Fi", "private kitchen", "garden view", "up to 4 guests"],
  },
};

const SYSTEM_PROMPT = `You are the digital guest assistant for Voulamandis House, rooms and apartments in Kampos, Chios, Greece.

Rules:
- Reply in the same language as the guest.
- Be concise, warm and practical.
- Never call Voulamandis House a hotel. Use "rooms and apartments", "property" or "accommodation".
- Never invent availability, prices, policies, distances or facilities.
- You cannot confirm or complete a booking.
- When live availability data is supplied, use only that data.
- Direct bookings receive 10% off the original price.
- Show both the original total and the direct-booking total, plus the saving.
- Never combine the 10% direct-booking discount with any other offer, deal or discount.
- The live availability source is the same Google Apps Script / Excel web app used by the Find Your Room tool.
- Known information: the property is in Kampos, Chios; accommodation includes double rooms and family apartments; some options are ground floor and some first floor; some include a kitchenette; breakfast is available for €12 per person.
- When information is not available, say so clearly and suggest contacting reception.`;

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type SearchRequest = {
  checkin?: string;
  checkout?: string;
  guests?: number;
};

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
  currency: string;
};

function extractText(payload: any): string {
  if (typeof payload?.output_text === "string" && payload.output_text.trim()) {
    return payload.output_text.trim();
  }

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

function getBookingWebAppUrl() {
  return process.env.GOOGLE_BOOKING_SEARCH_WEBAPP_URL || DEFAULT_BOOKING_WEBAPP_URL;
}

async function getOffers(search: SearchRequest): Promise<Offer[]> {
  if (!validDate(search.checkin) || !validDate(search.checkout)) return [];

  const guests = Math.max(1, Math.min(Number(search.guests || 2), 10));
  const nights = nightsBetween(search.checkin!, search.checkout!);
  if (nights < 1 || nights > 30) return [];

  const url = new URL(getBookingWebAppUrl());
  url.searchParams.set("action", "search_range");
  url.searchParams.set("checkin", search.checkin!);
  url.searchParams.set("checkout", search.checkout!);
  url.searchParams.set("guests", String(guests));

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      Accept: "application/json",
      "User-Agent": "VoulamandisHouseAI/1.0",
    },
    cache: "no-store",
  });

  const text = await response.text();
  let data: any = null;
  try {
    data = JSON.parse(text);
  } catch {
    console.error("AI availability web app returned non-JSON", {
      status: response.status,
      preview: text.slice(0, 300),
    });
    return [];
  }

  if (!response.ok || !data?.success || !Array.isArray(data?.rooms?.available)) {
    console.error("AI availability web app search failed", {
      status: response.status,
      success: data?.success,
      message: data?.message,
    });
    return [];
  }

  return data.rooms.available
    .map((item: any) => {
      const roomId = String(item?.roomId ?? item?.room_id ?? "");
      const unitId = String(item?.unitId ?? item?.unit_id ?? "");
      const key = `${roomId}:${unitId}`;
      const meta = ROOM_META[key];
      const maxGuests = Number(item?.maxGuests ?? item?.max_guests ?? meta?.maxGuests ?? 0);
      const originalTotal = Number(item?.totalPrice ?? item?.total_price ?? 0);

      if (!roomId || !unitId || !meta || maxGuests < guests || originalTotal <= 0) return null;

      const directTotal = Math.round(originalTotal * 0.9 * 100) / 100;
      return {
        roomId,
        unitId,
        name: meta.name,
        category: meta.category,
        floor: meta.floor,
        maxGuests,
        features: meta.features,
        nights,
        originalTotal: Math.round(originalTotal * 100) / 100,
        directTotal,
        saving: Math.round((originalTotal - directTotal) * 100) / 100,
        currency: String(item?.currency || "EUR"),
      } satisfies Offer;
    })
    .filter(Boolean)
    .sort((a: Offer, b: Offer) => a.directTotal - b.directTotal)
    .slice(0, 5) as Offer[];
}

export async function POST(request: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "The AI assistant is not configured yet." }, { status: 503 });
  }

  try {
    const body = await request.json();
    const messages: ChatMessage[] = Array.isArray(body?.messages)
      ? body.messages
          .filter(
            (message: any) =>
              (message?.role === "user" || message?.role === "assistant") &&
              typeof message?.content === "string",
          )
          .slice(-8)
          .map((message: ChatMessage) => ({
            role: message.role,
            content: message.content.trim().slice(0, 1200),
          }))
          .filter((message: ChatMessage) => message.content.length > 0)
      : [];

    if (!messages.length || messages[messages.length - 1].role !== "user") {
      return NextResponse.json({ error: "Please enter a question." }, { status: 400 });
    }

    const search: SearchRequest = body?.search || {};
    const offers = await getOffers(search);
    const availabilityContext = validDate(search.checkin) && validDate(search.checkout)
      ? `\n\nLIVE AVAILABILITY SEARCH FROM FIND YOUR ROOM WEB APP:\nCheck-in: ${search.checkin}\nCheck-out: ${search.checkout}\nGuests: ${search.guests || 2}\nAvailable offers: ${JSON.stringify(offers)}\nIf offers is empty, say that the live booking search did not return a complete priced option. Do not claim definitively that the property is sold out; suggest retrying or contacting reception. Clearly state that the 10% direct-booking discount is applied once and is not combined with another discount.`
      : "\n\nNo live date search was supplied. Ask the guest to choose check-in, check-out and guests to see live availability and prices.";

    const openAIResponse = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-5-mini",
        instructions: SYSTEM_PROMPT + availabilityContext,
        input: messages,
        reasoning: { effort: "minimal" },
        max_output_tokens: 1200,
      }),
      cache: "no-store",
    });

    const payload = await openAIResponse.json();
    if (!openAIResponse.ok) {
      console.error("OpenAI API error", openAIResponse.status, payload?.error?.message);
      return NextResponse.json(
        { error: "The assistant is temporarily unavailable. Please try again shortly." },
        { status: 502 },
      );
    }

    const answer = extractText(payload);
    if (!answer) {
      console.error("OpenAI returned no visible text", {
        status: payload?.status,
        incompleteDetails: payload?.incomplete_details,
      });
      return NextResponse.json(
        { error: "The assistant could not compose the answer. Please try again." },
        { status: 502 },
      );
    }

    return NextResponse.json({
      answer,
      offers,
      discountPercent: DIRECT_DISCOUNT_PERCENT,
      availabilitySource: "find-your-room-web-app",
    });
  } catch (error) {
    console.error("AI assistant route error", error);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
