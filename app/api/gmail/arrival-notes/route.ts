import { NextRequest, NextResponse } from "next/server";
import { fetchBeds24BookingById } from "@/lib/beds24/api-v2-booking";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Receives guest replies to the pre-arrival emails ("Few days left..." /
 * "Λίγες μέρες έμειναν πια...") from the Gmail Apps Script in
 * docs/gmail-arrival-notes.gs, extracts the arrival information and appends
 * it to the Beds24 booking notes (internal, never shown to the guest).
 */

const beds24BaseUrl = "https://beds24.com/api/v2";
const beds24PropertyId = String(process.env.BEDS24_PROPERTY_ID || "117813");
const MAX_BODY_CHARS = 4000;

type ArrivalExtraction = {
  hasArrivalInfo: boolean;
  note: string;
};

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
  ];

  let end = body.length;
  for (const marker of markers) {
    const match = marker.exec(body);
    if (match && match.index < end) end = match.index;
  }
  return body.slice(0, end).trim().slice(0, MAX_BODY_CHARS);
}

async function extractArrival(params: { reply: string; date: string; guest: string }): Promise<ArrivalExtraction> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY is not configured");

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    signal: AbortSignal.timeout(20_000),
    body: JSON.stringify({
      model: process.env.OPENAI_ASSISTANT_MODEL || "gpt-4.1-mini",
      temperature: 0,
      input: [
        {
          role: "system",
          content: [{
            type: "input_text",
            text: [
              "You read a guest's email reply to a Greek rooms-rental property that asked for their arrival time and how they arrive.",
              "Extract only arrival information the guest actually wrote: arrival day/date, time, means of transport (plane, ferry, car, taxi, rental car), flight or ship name, where they come from, and short practical arrival requests (e.g. early check-in, parking).",
              "Never invent or infer facts that are not written.",
              "If the reply contains no arrival information at all, set hasArrivalInfo to false and note to an empty string.",
              "Otherwise write note as ONE short line in Greek, staff-style, e.g. \"2/10 17:20 αεροπλάνο από Αθήνα, ταξί\". Use dd/mm dates without year and 24h times.",
            ].join("\n"),
          }],
        },
        {
          role: "user",
          content: [{
            type: "input_text",
            text: JSON.stringify({ receivedAt: params.date, guest: params.guest, reply: params.reply }),
          }],
        },
      ],
      text: {
        format: {
          type: "json_schema",
          name: "arrival_extraction",
          strict: true,
          schema: {
            type: "object",
            additionalProperties: false,
            properties: {
              hasArrivalInfo: { type: "boolean" },
              note: { type: "string" },
            },
            required: ["hasArrivalInfo", "note"],
          },
        },
      },
    }),
  });

  if (!response.ok) throw new Error(`OpenAI returned ${response.status}`);
  const data = await response.json();
  const text = clean(
    data?.output_text ??
      data?.output?.flatMap((item: any) => item?.content ?? []).find((part: any) => part?.type === "output_text")?.text,
  );
  const parsed = JSON.parse(text) as ArrivalExtraction;
  return { hasArrivalInfo: Boolean(parsed.hasArrivalInfo), note: clean(parsed.note).replace(/\s+/g, " ").slice(0, 300) };
}

async function getBeds24WriteToken() {
  const refreshToken = process.env.BEDS24_REFRESH_TOKEN?.trim();

  if (refreshToken) {
    const tokenResponse = await fetch(`${beds24BaseUrl}/authentication/token`, {
      headers: { accept: "application/json", refreshToken },
      cache: "no-store",
    });
    const tokenData = await tokenResponse.json().catch(() => null);
    if (!tokenResponse.ok || !tokenData?.token) {
      throw new Error(`Beds24 write-token refresh failed (${tokenResponse.status}).`);
    }
    return tokenData.token as string;
  }

  const directWriteToken = process.env.BEDS24_WRITE_API_TOKEN?.trim();
  if (directWriteToken) return directWriteToken;

  throw new Error("No Beds24 write credential is configured.");
}

function shortDate(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("el-GR", { day: "2-digit", month: "2-digit", timeZone: "Europe/Athens" });
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
  const reply = stripQuotedReply(clean(body?.body));
  const receivedAt = clean(body?.date);
  const guest = clean(body?.from);

  if (!bookingIds.length) return json({ ok: false, error: "No booking id." }, 400);
  if (!reply) return json({ ok: true, written: [], skipped: "empty_reply" });

  let extraction: ArrivalExtraction;
  try {
    extraction = await extractArrival({ reply, date: receivedAt, guest });
  } catch (error) {
    console.error("[arrival-notes] extraction failed", error);
    return json({ ok: false, error: "Extraction failed." }, 502);
  }

  if (!extraction.hasArrivalInfo || !extraction.note) {
    return json({ ok: true, written: [], skipped: "no_arrival_info" });
  }

  const received = shortDate(receivedAt);
  const line = `Άφιξη (email πελάτη${received ? ` ${received}` : ""}): ${extraction.note}`;

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
    const lookup = await fetchBeds24BookingById(bookingId);
    if (!lookup.ok || !lookup.booking) {
      failed[bookingId] = lookup.reason || "lookup_failed";
      continue;
    }
    if (clean(lookup.booking.propertyId) && clean(lookup.booking.propertyId) !== beds24PropertyId) {
      skipped[bookingId] = "other_property";
      continue;
    }

    const existingNotes = clean(lookup.booking.notes);
    if (existingNotes.includes(extraction.note)) {
      skipped[bookingId] = "already_noted";
      continue;
    }

    const notes = existingNotes ? `${existingNotes}\n${line}` : line;
    const response = await fetch(`${beds24BaseUrl}/bookings`, {
      method: "POST",
      headers: { accept: "application/json", "Content-Type": "application/json", token },
      body: JSON.stringify([{ id: Number(bookingId), notes }]),
      cache: "no-store",
    });
    const result = await response.json().catch(() => null);
    const success = Array.isArray(result) ? result[0]?.success !== false : response.ok;

    if (!response.ok || !success) {
      console.error("[arrival-notes] Beds24 update failed", { bookingId, status: response.status });
      failed[bookingId] = `beds24_http_${response.status}`;
      continue;
    }
    written.push(bookingId);
  }

  const ok = Object.keys(failed).length === 0;
  return json({ ok, note: line, written, skipped, failed }, ok ? 200 : 502);
}
