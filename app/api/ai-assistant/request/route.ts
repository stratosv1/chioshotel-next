import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const RECEPTION_EMAIL = "chioshotel@gmail.com";
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

type VerifiedOffer = {
  roomId?: string | number;
  unitId?: string | number;
  name?: string;
  originalTotal?: number;
  directTotal?: number;
  nights?: number;
  maxGuests?: number;
  preview?: boolean;
};

function clean(value: unknown, max = 500) {
  return String(value || "").trim().slice(0, max);
}

function isDate(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function stayNights(checkin: string, checkout: string) {
  const start = new Date(`${checkin}T12:00:00Z`).getTime();
  const end = new Date(`${checkout}T12:00:00Z`).getTime();
  if (!Number.isFinite(start) || !Number.isFinite(end)) return 0;
  return Math.round((end - start) / 86400000);
}

function isCurrentOrFutureDate(value: string) {
  const today = new Date();
  const todayUtc = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());
  const candidate = new Date(`${value}T00:00:00Z`).getTime();
  return Number.isFinite(candidate) && candidate >= todayUtc;
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
    .join("\n");
}

async function verifyLiveOffer(request: NextRequest, input: {
  checkin: string;
  checkout: string;
  guests: number;
  roomId: string;
  unitId: string;
  originalTotal: number;
  directTotal: number;
}) {
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
  if (!response.ok || !payload || !Array.isArray(payload.offers)) {
    return { ok: false as const, reason: "Live availability could not be verified. Please search again." };
  }

  const offer = payload.offers.find((item: VerifiedOffer) =>
    String(item?.roomId || "") === input.roomId &&
    String(item?.unitId || "") === input.unitId &&
    item?.preview !== true,
  ) as VerifiedOffer | undefined;

  if (!offer) {
    return { ok: false as const, reason: "This room is no longer available for the selected stay. Please search again." };
  }

  const verifiedOriginal = Number(offer.originalTotal || 0);
  const verifiedDirect = Number(offer.directTotal || 0);
  if (!validMoney(verifiedOriginal) || !validMoney(verifiedDirect)) {
    return { ok: false as const, reason: "The live price could not be verified. Please search again." };
  }

  if (Math.abs(verifiedOriginal - input.originalTotal) > PRICE_TOLERANCE || Math.abs(verifiedDirect - input.directTotal) > PRICE_TOLERANCE) {
    return { ok: false as const, reason: "The live price has changed. Please search again to see the current offer." };
  }

  if (Number(offer.maxGuests || input.guests) < input.guests) {
    return { ok: false as const, reason: "The selected room does not support this guest count." };
  }

  const expectedNights = stayNights(input.checkin, input.checkout);
  if (offer.nights && Number(offer.nights) !== expectedNights) {
    return { ok: false as const, reason: "The stay details changed. Please search again." };
  }

  return { ok: true as const, offer };
}

async function createReceptionSummary({
  conversation,
  roomName,
  checkin,
  checkout,
  guests,
  directTotal,
  guestMessage,
}: {
  conversation: ReturnType<typeof cleanConversation>;
  roomName: string;
  checkin: string;
  checkout: string;
  guests: number;
  directTotal: number;
  guestMessage: string;
}) {
  const fallback = [
    `Ενδιαφέρεται για: ${roomName}`,
    `Διαμονή: ${checkin} έως ${checkout}, ${guests} επισκέπτες`,
    `Τιμή απευθείας κράτησης: €${directTotal.toFixed(2)}`,
    guestMessage ? `Πρόσθετο μήνυμα: ${guestMessage}` : "",
    conversation.length ? `Συζήτηση: ${conversation.filter((item) => item.role === "guest").map((item) => item.content).join(" | ").slice(0, 1200)}` : "",
  ].filter(Boolean).join("\n");

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || !conversation.length) return fallback;

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-5-mini",
        instructions: "Create a concise Greek reception briefing from a guest conversation. Use 4 short sections: Intent, Stay details, Preferences/questions, Reception action. Do not invent anything. Mention the selected room and price. Maximum 140 words.",
        input: `Selected room: ${roomName}\nStay: ${checkin} to ${checkout}\nGuests: ${guests}\nDirect total: €${directTotal.toFixed(2)}\nGuest note: ${guestMessage || "none"}\n\nConversation:\n${transcriptText(conversation)}`,
        reasoning: { effort: "minimal" },
        max_output_tokens: 350,
      }),
      cache: "no-store",
    });
    const payload = await response.json();
    if (!response.ok) return fallback;
    if (typeof payload?.output_text === "string" && payload.output_text.trim()) return payload.output_text.trim();
    const text = Array.isArray(payload?.output)
      ? payload.output.flatMap((item: any) => Array.isArray(item?.content) ? item.content : []).map((part: any) => part?.text).filter(Boolean).join("\n").trim()
      : "";
    return text || fallback;
  } catch {
    return fallback;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as RequestBody;
    const name = clean(body.name, 120);
    const contact = clean(body.contact, 160);
    const message = clean(body.message, 1000);
    const checkin = clean(body.checkin, 10);
    const checkout = clean(body.checkout, 10);
    const roomId = clean(body.roomId, 40);
    const unitId = clean(body.unitId, 40);
    const roomName = clean(body.roomName, 160);
    const guests = Number(body.guests);
    const originalTotal = Number(body.originalTotal);
    const directTotal = Number(body.directTotal);
    const conversation = cleanConversation(body.conversation);
    const nights = stayNights(checkin, checkout);

    if (!name || !contact || !roomId || !unitId || !roomName) {
      return NextResponse.json({ ok: false, error: "Missing guest or room details." }, { status: 400 });
    }
    if (!isDate(checkin) || !isDate(checkout) || !isCurrentOrFutureDate(checkin) || nights < 1 || nights > MAX_STAY_NIGHTS) {
      return NextResponse.json({ ok: false, error: "Missing or invalid stay dates." }, { status: 400 });
    }
    if (!Number.isInteger(guests) || guests < 1 || guests > MAX_GUESTS) {
      return NextResponse.json({ ok: false, error: "Missing or invalid guest count." }, { status: 400 });
    }
    if (!validMoney(originalTotal) || !validMoney(directTotal) || directTotal > originalTotal) {
      return NextResponse.json({ ok: false, error: "A valid live offer is required before sending a request." }, { status: 400 });
    }

    const liveVerification = await verifyLiveOffer(request, { checkin, checkout, guests, roomId, unitId, originalTotal, directTotal });
    if (!liveVerification.ok) {
      return NextResponse.json({ ok: false, error: liveVerification.reason, refreshRequired: true }, { status: 409 });
    }

    const verifiedRoomName = clean(liveVerification.offer.name || roomName, 160) || roomName;
    const conversationSummary = await createReceptionSummary({
      conversation,
      roomName: verifiedRoomName,
      checkin,
      checkout,
      guests,
      directTotal,
      guestMessage: message,
    });
    const conversationTranscript = transcriptText(conversation).slice(0, 12000);

    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      return NextResponse.json({ ok: false, error: "Booking request storage is not configured." }, { status: 503 });
    }

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
        conversation_summary, conversation_transcript, live_verified_at
      ) values (
        ${name}, ${contact}, ${message || null}, ${checkin}::date, ${checkout}::date, ${guests},
        ${roomId}, ${unitId}, ${verifiedRoomName}, ${originalTotal}, ${directTotal},
        ${conversationSummary}, ${conversationTranscript || null}, now()
      )
      returning id::text
    `;

    const requestId = String((inserted as any[])?.[0]?.id || "");
    let emailSent = false;
    const resendKey = process.env.RESEND_API_KEY;
    const receptionEmail = process.env.RECEPTION_EMAIL || RECEPTION_EMAIL;

    if (resendKey) {
      const emailResponse = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: process.env.RECEPTION_FROM_EMAIL || "Voulamandis House <bookings@chioshotel.gr>",
          to: [receptionEmail],
          subject: `Νέο επιβεβαιωμένο live αίτημα #${requestId} — ${verifiedRoomName}`,
          text: [
            "ΝΕΟ ΑΙΤΗΜΑ ΑΠΟ ΤΟ GUEST ASSISTANT",
            "LIVE ΔΙΑΘΕΣΙΜΟΤΗΤΑ ΚΑΙ ΤΙΜΗ ΕΠΑΝΕΛΕΓΧΘΗΚΑΝ ΠΡΙΝ ΤΗΝ ΚΑΤΑΧΩΡΗΣΗ",
            "",
            `Αριθμός αιτήματος: #${requestId}`,
            "",
            "ΣΤΟΙΧΕΙΑ ΠΕΛΑΤΗ",
            `Όνομα: ${name}`,
            `Τηλέφωνο ή email: ${contact}`,
            message ? `Μήνυμα πελάτη: ${message}` : "Μήνυμα πελάτη: —",
            "",
            "ΣΤΟΙΧΕΙΑ ΔΙΑΜΟΝΗΣ",
            `Δωμάτιο: ${verifiedRoomName}`,
            `Room ID / Unit ID: ${roomId} / ${unitId}`,
            `Άφιξη: ${checkin}`,
            `Αναχώρηση: ${checkout}`,
            `Νύχτες: ${nights}`,
            `Επισκέπτες: ${guests}`,
            `Αρχική τιμή: €${originalTotal.toFixed(2)}`,
            `Τιμή απευθείας κράτησης: €${directTotal.toFixed(2)}`,
            "Δεν περιλαμβάνονται: φόρος ανθεκτικότητας 2 € ανά διανυκτέρευση και προαιρετικό πρωινό 12 € ανά άτομο ανά ημέρα.",
            "",
            "ΣΥΝΟΨΗ ΣΥΖΗΤΗΣΗΣ",
            conversationSummary,
            conversationTranscript ? "\nΠΛΗΡΗΣ ΣΥΖΗΤΗΣΗ\n" + conversationTranscript : "",
            "",
            "ΕΝΕΡΓΕΙΑ RECEPTION",
            `Επικοινωνήστε με τον πελάτη στο: ${contact}`,
          ].filter(Boolean).join("\n"),
        }),
        cache: "no-store",
      });
      emailSent = emailResponse.ok;
      if (!emailResponse.ok) {
        const errorText = await emailResponse.text().catch(() => "");
        console.error("Reception email failed", emailResponse.status, errorText.slice(0, 500));
      }
    } else {
      console.error("Reception email not sent: RESEND_API_KEY is missing");
    }

    return NextResponse.json(
      { ok: true, requestId, emailSent, summarySaved: true, liveVerified: true, receptionEmail },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("AI booking request error", error);
    return NextResponse.json({ ok: false, error: "The request could not be sent." }, { status: 500 });
  }
}
