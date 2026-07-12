import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const RECEPTION_EMAIL = "chioshotel@gmail.com";

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

function clean(value: unknown, max = 500) {
  return String(value || "").trim().slice(0, max);
}

function isDate(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
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
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-5-mini",
        instructions: `Create a concise Greek reception briefing from a guest conversation. Use 4 short sections: Intent, Stay details, Preferences/questions, Reception action. Do not invent anything. Mention the selected room and price. Maximum 140 words.`,
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
    const guests = Math.max(1, Math.min(Number(body.guests || 1), 10));
    const originalTotal = Number(body.originalTotal || 0);
    const directTotal = Number(body.directTotal || 0);
    const conversation = cleanConversation(body.conversation);

    if (!name || !contact || !roomName || !isDate(checkin) || !isDate(checkout) || checkout <= checkin) {
      return NextResponse.json({ ok: false, error: "Missing or invalid request details." }, { status: 400 });
    }

    const conversationSummary = await createReceptionSummary({
      conversation,
      roomName,
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

    const inserted = await sql`
      insert into ai_booking_requests (
        guest_name, contact, guest_message, checkin, checkout, guests,
        room_id, unit_id, room_name, original_total, direct_total,
        conversation_summary, conversation_transcript
      ) values (
        ${name}, ${contact}, ${message || null}, ${checkin}::date, ${checkout}::date, ${guests},
        ${roomId || null}, ${unitId || null}, ${roomName}, ${originalTotal || null}, ${directTotal || null},
        ${conversationSummary}, ${conversationTranscript || null}
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
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: process.env.RECEPTION_FROM_EMAIL || "Voulamandis House <bookings@chioshotel.gr>",
          to: [receptionEmail],
          subject: `Νέο αίτημα από Guest Assistant #${requestId} — ${roomName}`,
          text: [
            "ΝΕΟ ΑΙΤΗΜΑ ΑΠΟ ΤΟ GUEST ASSISTANT",
            "",
            `Αριθμός αιτήματος: #${requestId}`,
            "",
            "ΣΤΟΙΧΕΙΑ ΠΕΛΑΤΗ",
            `Όνομα: ${name}`,
            `Τηλέφωνο ή email: ${contact}`,
            message ? `Μήνυμα πελάτη: ${message}` : "Μήνυμα πελάτη: —",
            "",
            "ΣΤΟΙΧΕΙΑ ΔΙΑΜΟΝΗΣ",
            `Δωμάτιο: ${roomName}`,
            `Room ID / Unit ID: ${roomId || "—"} / ${unitId || "—"}`,
            `Άφιξη: ${checkin}`,
            `Αναχώρηση: ${checkout}`,
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
      { ok: true, requestId, emailSent, summarySaved: true, receptionEmail },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("AI booking request error", error);
    return NextResponse.json({ ok: false, error: "The request could not be sent." }, { status: 500 });
  }
}
