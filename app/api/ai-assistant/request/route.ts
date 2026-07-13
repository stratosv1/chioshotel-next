import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_STAY_NIGHTS = 30;
const MAX_GUESTS = 5;
const PRICE_TOLERANCE = 0.02;

type ConversationMessage = { role?: string; content?: string };
type RequestBody = {
  name?: string;
  contact?: string;
  message?: string;
  checkin?: string;
  checkout?: string;
  guests?: number;
  roomId?: string;
  unitId?: string;
  roomName?: string;
  originalTotal?: number;
  directTotal?: number;
  conversation?: ConversationMessage[];
};

type Verified = { ok: true; roomName: string } | { ok: false; reason: string };

function clean(value: unknown, max = 1000) {
  return String(value ?? "").trim().slice(0, max);
}

function isDate(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function nightsBetween(checkin: string, checkout: string) {
  return Math.round((new Date(`${checkout}T12:00:00Z`).getTime() - new Date(`${checkin}T12:00:00Z`).getTime()) / 86_400_000);
}

function validMoney(value: number) {
  return Number.isFinite(value) && value > 0 && value < 100000;
}

function cleanConversation(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value
    .slice(-16)
    .map((item: ConversationMessage) => ({
      role: item?.role === "assistant" ? "assistant" : "guest",
      content: clean(item?.content, 900),
    }))
    .filter((item) => item.content);
}

function transcriptText(conversation: ReturnType<typeof cleanConversation>) {
  return conversation
    .map((item) => `${item.role === "guest" ? "Πελάτης" : "Βοηθός"}: ${item.content}`)
    .join("\n")
    .slice(0, 12000);
}

async function verifyStandardOffer(request: NextRequest, input: {
  checkin: string;
  checkout: string;
  guests: number;
  roomId: string;
  unitId: string;
  originalTotal: number;
  directTotal: number;
}): Promise<Verified> {
  const response = await fetch(new URL("/api/ai-assistant", request.nextUrl.origin), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      messages: [{ role: "user", content: `Check live availability from ${input.checkin} to ${input.checkout} for ${input.guests} guests.` }],
      search: { checkin: input.checkin, checkout: input.checkout, guests: input.guests },
      language: "en",
    }),
    cache: "no-store",
  });

  const payload = await response.json().catch(() => null);
  const offer = Array.isArray(payload?.offers)
    ? payload.offers.find((item: any) => String(item?.roomId || "") === input.roomId && String(item?.unitId || "") === input.unitId)
    : null;

  if (!response.ok || !offer) return { ok: false, reason: "This room is no longer available. Please search again." };
  if (Math.abs(Number(offer.originalTotal || 0) - input.originalTotal) > PRICE_TOLERANCE || Math.abs(Number(offer.directTotal || 0) - input.directTotal) > PRICE_TOLERANCE) {
    return { ok: false, reason: "The live price changed. Please search again." };
  }
  return { ok: true, roomName: clean(offer.name, 240) };
}

async function verifySplitOffer(request: NextRequest, input: {
  checkin: string;
  checkout: string;
  guests: number;
  roomId: string;
  originalTotal: number;
  directTotal: number;
  roomName: string;
}): Promise<Verified> {
  const parts = input.roomId.split(":");
  if (parts.length !== 5 || parts[0] !== "split") return { ok: false, reason: "Invalid split-stay plan." };
  const [, firstRoomId, firstUnitId, secondRoomId, secondUnitId] = parts;

  const url = new URL("/api/booking/split-stay", request.nextUrl.origin);
  url.searchParams.set("checkin", input.checkin);
  url.searchParams.set("checkout", input.checkout);
  url.searchParams.set("guests", String(input.guests));
  const response = await fetch(url, { cache: "no-store" });
  const payload = await response.json().catch(() => null);
  const option = Array.isArray(payload?.splitStays)
    ? payload.splitStays.find((item: any) =>
        String(item?.first?.roomId) === firstRoomId &&
        String(item?.first?.unitId) === firstUnitId &&
        String(item?.second?.roomId) === secondRoomId &&
        String(item?.second?.unitId) === secondUnitId,
      )
    : null;

  if (!response.ok || !option) return { ok: false, reason: "This split-stay option is no longer available. Please search again." };
  if (Math.abs(Number(option.originalTotal || 0) - input.originalTotal) > PRICE_TOLERANCE || Math.abs(Number(option.splitTotal || 0) - input.directTotal) > PRICE_TOLERANCE) {
    return { ok: false, reason: "The split-stay price changed. Please search again." };
  }

  const verifiedName = `Split Stay: Room ${option.first.roomNumber} (${option.first.checkin}–${option.first.checkout}) → Room ${option.second.roomNumber} (${option.second.checkin}–${option.second.checkout})`;
  return { ok: true, roomName: verifiedName || input.roomName };
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as RequestBody;
    const name = clean(body.name, 120);
    const contact = clean(body.contact, 160);
    const message = clean(body.message, 1000);
    const checkin = clean(body.checkin, 10);
    const checkout = clean(body.checkout, 10);
    const roomId = clean(body.roomId, 120);
    const unitId = clean(body.unitId, 80);
    const roomName = clean(body.roomName, 300);
    const guests = Number(body.guests);
    const originalTotal = Number(body.originalTotal);
    const directTotal = Number(body.directTotal);
    const conversation = cleanConversation(body.conversation);
    const nights = nightsBetween(checkin, checkout);

    if (!name || !contact || !roomId || !unitId || !roomName) {
      return NextResponse.json({ ok: false, error: "Missing guest or room details." }, { status: 400 });
    }
    if (!isDate(checkin) || !isDate(checkout) || nights < 1 || nights > MAX_STAY_NIGHTS) {
      return NextResponse.json({ ok: false, error: "Missing or invalid stay dates." }, { status: 400 });
    }
    if (!Number.isInteger(guests) || guests < 1 || guests > MAX_GUESTS) {
      return NextResponse.json({ ok: false, error: "Missing or invalid guest count." }, { status: 400 });
    }
    if (!validMoney(originalTotal) || !validMoney(directTotal) || directTotal > originalTotal) {
      return NextResponse.json({ ok: false, error: "A valid live offer is required." }, { status: 400 });
    }

    const verification = roomId.startsWith("split:")
      ? await verifySplitOffer(request, { checkin, checkout, guests, roomId, originalTotal, directTotal, roomName })
      : await verifyStandardOffer(request, { checkin, checkout, guests, roomId, unitId, originalTotal, directTotal });

    if (!verification.ok) {
      return NextResponse.json({ ok: false, error: verification.reason, refreshRequired: true }, { status: 409 });
    }

    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) return NextResponse.json({ ok: false, error: "Request storage is not configured." }, { status: 503 });

    const verifiedRoomName = verification.roomName;
    const transcript = transcriptText(conversation);
    const summary = [
      `Ενδιαφέρον για: ${verifiedRoomName}`,
      `Διαμονή: ${checkin} έως ${checkout}`,
      `Επισκέπτες: ${guests}`,
      `Τελική τιμή: €${directTotal.toFixed(2)}`,
      message ? `Μήνυμα: ${message}` : "",
    ].filter(Boolean).join("\n");

    const sql = neon(databaseUrl);
    await sql`
      create table if not exists ai_booking_requests (
        id bigserial primary key,
        created_at timestamptz not null default now(),
        status text not null default 'new',
        guest_name text not null,
        contact text not null,
        guest_message text,
        checkin date not null,
        checkout date not null,
        guests integer not null,
        room_id text,
        unit_id text,
        room_name text not null,
        original_total numeric(10,2),
        direct_total numeric(10,2),
        source text not null default 'ai-assistant'
      )
    `;
    await sql`alter table ai_booking_requests add column if not exists conversation_summary text`;
    await sql`alter table ai_booking_requests add column if not exists conversation_transcript text`;
    await sql`alter table ai_booking_requests add column if not exists live_verified_at timestamptz`;

    const inserted = await sql`
      insert into ai_booking_requests (
        guest_name, contact, guest_message, checkin, checkout, guests,
        room_id, unit_id, room_name, original_total, direct_total,
        conversation_summary, conversation_transcript, live_verified_at, source
      ) values (
        ${name}, ${contact}, ${message || null}, ${checkin}::date, ${checkout}::date, ${guests},
        ${roomId}, ${unitId}, ${verifiedRoomName}, ${originalTotal}, ${directTotal},
        ${summary}, ${transcript || null}, now(), ${roomId.startsWith("split:") ? "ai-split-stay" : "ai-assistant"}
      )
      returning id::text
    `;

    const requestId = String((inserted as any[])?.[0]?.id || "");
    return NextResponse.json({
      ok: true,
      requestId,
      liveVerified: true,
      splitStay: roomId.startsWith("split:"),
      verifiedRoomName,
    }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("AI room request error", error);
    return NextResponse.json({ ok: false, error: "The request could not be sent." }, { status: 500 });
  }
}
