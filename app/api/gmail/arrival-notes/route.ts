import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { appendBookingNote, getBeds24WriteToken, noteDate, summarizeGuestMessage, type GuestSummary } from "@/lib/crm/booking-notes";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Receives emails linked to a booking from the Gmail Apps Script in
 * docs/gmail-arrival-notes.gs. Every email is kept for the staff CRM, and what
 * the guest asked or told us is appended to the Beds24 booking notes
 * (internal, never shown to the guest).
 */

const MAX_BODY_CHARS = 4000;

function json(data: unknown, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}

function clean(value: unknown) {
  return String(value ?? "").trim();
}

// Keep only the guest's own text: drop the quoted original email and signatures.
function stripQuotedReply(body: string) {
  const markers = [
    /^On .+wrote:\s*$/im,
    /^Am .+schrieb.*:\s*$/im,
    /^Le .+a écrit\s*:\s*$/im,
    /^Il .+ha scritto\s*:\s*$/im,
    /^Στις .+έγραψε:\s*$/im,
    /^(From|Από|Von|De|Da):\s.*$/im,
    /^-{2,}\s*Original Message\s*-{2,}/im,
    /^>/m,
    /Your Arrival is Approaching!/i,
    /Η Άφιξή Σας Πλησιάζει!/i,
    /^VOULAMANDIS HOUSE$/m,
  ];

  let end = body.length;
  for (const marker of markers) {
    const match = marker.exec(body);
    if (match && match.index < end) end = match.index;
  }
  return body.slice(0, end).trim().slice(0, MAX_BODY_CHARS);
}

async function storeMessage(params: { messageId: string; bookingIds: string[]; guestEmail: string; direction: "guest" | "staff"; subject: string; body: string; summary: string | null; sentAt: string }) {
  const url = process.env.DATABASE_URL?.trim();
  if (!url || !params.messageId) return;
  const sql = neon(url);
  const sentAt = Number.isNaN(Date.parse(params.sentAt)) ? new Date().toISOString() : params.sentAt;
  await sql`insert into public.crm_guest_messages (message_id, booking_ids, guest_email, direction, subject, body, summary, sent_at)
    values (${params.messageId}, ${params.bookingIds}::text[], ${params.guestEmail}, ${params.direction}, ${params.subject}, ${params.body}, ${params.summary}, ${sentAt}::timestamptz)
    on conflict (message_id) do update set summary = coalesce(excluded.summary, public.crm_guest_messages.summary)`;
}

const emailAddress = (from: string) => (from.match(/<([^>]+)>/)?.[1] ?? from).trim().toLowerCase();

export async function POST(request: NextRequest) {
  const secret = process.env.ARRIVAL_NOTES_SECRET?.trim();
  if (!secret) return json({ ok: false, error: "ARRIVAL_NOTES_SECRET is not configured." }, 503);
  if (request.headers.get("authorization") !== `Bearer ${secret}`) {
    return json({ ok: false, error: "Unauthorized." }, 401);
  }

  const body = await request.json().catch(() => null);
  const bookingIds: string[] = Array.isArray(body?.bookingIds)
    ? [...new Set<string>(body.bookingIds.map(clean).filter((id: string) => /^\d{6,10}$/.test(id)))]
    : [];
  const reply = stripQuotedReply(clean(body?.body));
  const receivedAt = clean(body?.date);
  const guest = clean(body?.from);

  if (!bookingIds.length) return json({ ok: false, error: "No booking id." }, 400);
  if (!reply) return json({ ok: true, written: [], skipped: "empty_reply" });

  const message = {
    messageId: clean(body?.messageId),
    bookingIds,
    guestEmail: emailAddress(guest),
    subject: clean(body?.subject).slice(0, 300),
    body: reply,
    sentAt: receivedAt,
  };

  // Our own replies appear in the CRM conversation but never in the Notes.
  if (body?.direction === "staff") {
    try {
      await storeMessage({ ...message, direction: "staff", summary: null });
    } catch (error) {
      console.error("[arrival-notes] message store failed", error);
      return json({ ok: false, error: "Message store failed." }, 502);
    }
    return json({ ok: true, written: [], skipped: "staff_message" });
  }

  let extraction: GuestSummary;
  try {
    extraction = await summarizeGuestMessage({ reply, date: receivedAt, guest });
  } catch (error) {
    console.error("[arrival-notes] extraction failed", error);
    return json({ ok: false, error: "Extraction failed." }, 502);
  }

  try {
    await storeMessage({ ...message, direction: "guest", summary: extraction.note || null });
  } catch (error) {
    console.error("[arrival-notes] message store failed", error);
    return json({ ok: false, error: "Message store failed." }, 502);
  }

  if (!extraction.hasInfo || !extraction.note) {
    return json({ ok: true, written: [], skipped: "no_useful_info" });
  }

  const received = noteDate(receivedAt);
  const line = `Email πελάτη${received ? ` ${received}` : ""}: ${extraction.note}`;

  let token: string;
  try {
    token = await getBeds24WriteToken();
  } catch (error) {
    console.error("[arrival-notes] Beds24 auth failed", error);
    return json({ ok: false, error: "Beds24 authentication failed." }, 502);
  }

  const written: string[] = [];
  const skipped: Record<string, string> = {};
  const failed: Record<string, string> = {};

  for (const bookingId of bookingIds) {
    const outcome = await appendBookingNote(bookingId, line, extraction.note, token);
    if (outcome === "written") written.push(bookingId);
    else if (outcome === "already_noted" || outcome === "other_property") skipped[bookingId] = outcome;
    else failed[bookingId] = outcome;
  }

  const ok = Object.keys(failed).length === 0;
  return json({ ok, note: line, written, skipped, failed }, ok ? 200 : 502);
}
