import { NextRequest, NextResponse } from "next/server";
import { clean, ingestGmailMessage } from "@/lib/crm/gmail-intake";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Receives emails linked to a booking from the Gmail Apps Script in
 * docs/gmail-arrival-notes.gs. Every email is kept for the staff CRM, and what
 * the guest asked or told us is appended to the Beds24 booking notes
 * (internal, never shown to the guest).
 */

function json(data: unknown, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}

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
  if (!bookingIds.length) return json({ ok: false, error: "No booking id." }, 400);

  try {
    const result = await ingestGmailMessage({
      messageId: clean(body?.messageId),
      bookingIds,
      from: clean(body?.from),
      date: clean(body?.date),
      subject: clean(body?.subject),
      body: clean(body?.body),
      direction: body?.direction === "staff" ? "staff" : "guest",
    });
    const ok = Object.keys(result.failed).length === 0;
    return json({ ok, ...result }, ok ? 200 : 502);
  } catch (error) {
    console.error("[arrival-notes] failed", error);
    return json({ ok: false, error: "Processing failed." }, 502);
  }
}
