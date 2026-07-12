import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DIRECT_DISCOUNT_PERCENT = 10;

const ROOM_FEATURES: Record<string, string[]> = {
  "267788:1": ["upper floor", "stairs", "up to 4 guests"],
  "268803:1": ["economy double", "upper floor", "stairs", "up to 2 guests"],
  "267788:2": ["upper floor", "stairs", "kitchenette", "up to 3 guests"],
  "267788:3": ["upper floor", "stairs", "kitchenette", "up to 3 guests"],
  "626129:1": ["ground floor", "no stairs", "garden view", "up to 3 guests"],
  "268803:2": ["economy double", "ground floor", "no stairs", "garden view", "up to 2 guests"],
  "626129:2": ["ground floor", "no stairs", "garden view", "up to 3 guests"],
  "265595:1": ["independent apartment", "kitchen", "garden view", "up to 4 guests"],
  "265595:2": ["independent apartment", "kitchen", "garden view", "up to 4 guests"],
  "265595:3": ["independent apartment", "kitchen", "garden view", "up to 4 guests"],
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
- If a special deal exists, explain that only one discount applies and show the better applicable price only when explicitly supplied.
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
        if (typeof part?.text === "string" && part.text.trim()) {
          texts.push(part.text.trim());
        }
      }
    }
  }

  return texts.join("\n").trim();
}

function validDate(value?: string) {
  return Boolean(value && /^\d{4}-\d{2}-\d{2}$/.test(value));
}

function nightsBetween(checkin: string, checkout: string) {
  const start = new Date(`${checkin}T00:00:00Z`).getTime();
  const end = new Date(`${checkout}T00:00:00Z`).getTime();
  return Math.round((end - start) / 86400000);
}

async function getOffers(search: SearchRequest): Promise<Offer[]> {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) return [];
  if (!validDate(search.checkin) || !validDate(search.checkout)) return [];

  const guests = Math.max(1, Math.min(Number(search.guests || 2), 10));
  const nights = nightsBetween(search.checkin!, search.checkout!);
  if (nights < 1 || nights > 30) return [];

  const sql = neon(databaseUrl);
  const rows = await sql`
    select
      u.room_id::text as room_id,
      u.unit_id::text as unit_id,
      u.label as display_name,
      u.room_name as category,
      u.location as floor,
      u.max_guests,
      a.stay_date::text as stay_date,
      a.price,
      a.available
    from staff_units u
    join staff_availability_calendar a
      on a.room_id = u.room_id and a.unit_id = u.unit_id
    where u.is_active = true
      and u.max_guests >= ${guests}
      and a.stay_date >= ${search.checkin}::date
      and a.stay_date < ${search.checkout}::date
    order by u.id asc, a.stay_date asc
  `;

  const grouped = new Map<string, any[]>();
  for (const row of rows as any[]) {
    const key = `${row.room_id}:${row.unit_id}`;
    const list = grouped.get(key) || [];
    list.push(row);
    grouped.set(key, list);
  }

  const offers: Offer[] = [];
  for (const [key, roomRows] of grouped.entries()) {
    if (roomRows.length !== nights) continue;
    if (!roomRows.every((row) => row.available === true && Number(row.price || 0) > 0)) continue;

    const originalTotal = roomRows.reduce((sum, row) => sum + Number(row.price || 0), 0);
    const directTotal = Math.round(originalTotal * (1 - DIRECT_DISCOUNT_PERCENT / 100) * 100) / 100;
    const first = roomRows[0];

    offers.push({
      roomId: String(first.room_id),
      unitId: String(first.unit_id),
      name: first.display_name || `Room ${first.unit_id}`,
      category: first.category || "Room",
      floor: first.floor || "",
      maxGuests: Number(first.max_guests || 0),
      features: ROOM_FEATURES[key] || [],
      nights,
      originalTotal: Math.round(originalTotal * 100) / 100,
      directTotal,
      saving: Math.round((originalTotal - directTotal) * 100) / 100,
    });
  }

  return offers.sort((a, b) => a.directTotal - b.directTotal).slice(0, 5);
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
      ? `\n\nLIVE AVAILABILITY SEARCH:\nCheck-in: ${search.checkin}\nCheck-out: ${search.checkout}\nGuests: ${search.guests || 2}\nAvailable offers: ${JSON.stringify(offers)}\nIf offers is empty, say that no room with a complete priced stay was found for those dates. Do not guess. Clearly state that the 10% direct-booking discount is already applied once and is not combined with another discount.`
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
        outputTypes: Array.isArray(payload?.output)
          ? payload.output.map((item: any) => ({
              type: item?.type,
              contentTypes: Array.isArray(item?.content)
                ? item.content.map((part: any) => part?.type)
                : [],
            }))
          : [],
      });

      return NextResponse.json(
        { error: "The assistant could not compose the answer. Please try again." },
        { status: 502 },
      );
    }

    return NextResponse.json({ answer, offers, discountPercent: DIRECT_DISCOUNT_PERCENT });
  } catch (error) {
    console.error("AI assistant route error", error);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
