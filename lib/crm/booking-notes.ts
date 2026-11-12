import "server-only";
import { fetchBeds24BookingById } from "@/lib/beds24/api-v2-booking";

const beds24BaseUrl = "https://beds24.com/api/v2";
const beds24PropertyId = String(process.env.BEDS24_PROPERTY_ID || "117813");
const clean = (value: unknown) => String(value ?? "").trim();

export async function getBeds24WriteToken() {
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

/** Replaces the channel's virtual address, as staff did by hand, so Beds24 flows reach the guest. */
export async function updateBookingEmail(bookingId: string, email: string, token: string) {
  const response = await fetch(`${beds24BaseUrl}/bookings`, {
    method: "POST",
    headers: { accept: "application/json", "Content-Type": "application/json", token },
    body: JSON.stringify([{ id: Number(bookingId), email }]),
    cache: "no-store",
  });
  const result = await response.json().catch(() => null);
  const success = Array.isArray(result) ? result[0]?.success !== false : response.ok;
  if (!response.ok || !success) {
    console.error("[booking-notes] Beds24 email update failed", { bookingId, status: response.status });
    return false;
  }
  return true;
}

export type GuestSummary = { hasInfo: boolean; note: string; arrivalTime: string };

/** One short staff line in Greek, or nothing when the email is only pleasantries. */
export async function summarizeGuestMessage(params: { reply: string; date: string; guest: string }): Promise<GuestSummary> {
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
              "You read a guest's message to a Greek rooms-rental property about their booking.",
              "Keep only what staff need to know: arrival day/date and time, means of transport, flight or ship name, breakfast, taxi or luggage requests, special requests, questions, changes to the stay.",
              "Never invent or infer facts that are not written.",
              "If the message has nothing useful (only thanks or pleasantries, or only an email address), set hasInfo to false and note to an empty string.",
              "Set arrivalTime to the time the guest will arrive at the property as 24h HH:MM, or an empty string if not stated. Never use a departure time.",
              "Otherwise write note as ONE short line in Greek, staff-style, e.g. \"17:20 αεροπλάνο από Αθήνα, ταξί, ζητά βρεφικό κρεβάτι\". Use dd/mm dates without year and 24h times.",
              "If the guest says how or from where they arrive, put that FIRST, before any comma, together with the time: e.g. \"21:25 αεροπλάνο\", \"18:00 πλοίο από Πειραιά\", \"14:00 από άλλο ξενοδοχείο στη Χίο\", \"με αυτοκίνητο από το λιμάνι\".",
              "Only write a date when the guest states the arrival day. Never use the date the message was received (receivedAt) as a date in the note.",
            ].join("\n"),
          }],
        },
        {
          role: "user",
          content: [{ type: "input_text", text: JSON.stringify({ receivedAt: params.date, guest: params.guest, reply: params.reply }) }],
        },
      ],
      text: {
        format: {
          type: "json_schema",
          name: "guest_message_summary",
          strict: true,
          schema: {
            type: "object",
            additionalProperties: false,
            properties: { hasInfo: { type: "boolean" }, note: { type: "string" }, arrivalTime: { type: "string" } },
            required: ["hasInfo", "note", "arrivalTime"],
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
  const parsed = JSON.parse(text) as GuestSummary;
  return { hasInfo: Boolean(parsed.hasInfo), note: clean(parsed.note).replace(/\s+/g, " ").slice(0, 300), arrivalTime: /^\d{2}:\d{2}$/.test(clean(parsed.arrivalTime)) ? clean(parsed.arrivalTime) : "" };
}

export const noteDate = (iso: string) => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("el-GR", { day: "2-digit", month: "2-digit", timeZone: "Europe/Athens" });
};

/** Appends a line to the internal Beds24 notes. Existing notes are always kept. */
export async function appendBookingNote(bookingId: string, line: string, dedupeText: string, token: string): Promise<"written" | "already_noted" | "other_property" | string> {
  const lookup = await fetchBeds24BookingById(bookingId);
  if (!lookup.ok || !lookup.booking) return lookup.reason || "lookup_failed";
  if (clean(lookup.booking.propertyId) && clean(lookup.booking.propertyId) !== beds24PropertyId) return "other_property";
  const existingNotes = clean(lookup.booking.notes);
  if (existingNotes.includes(dedupeText)) return "already_noted";

  const response = await fetch(`${beds24BaseUrl}/bookings`, {
    method: "POST",
    headers: { accept: "application/json", "Content-Type": "application/json", token },
    body: JSON.stringify([{ id: Number(bookingId), notes: existingNotes ? `${existingNotes}\n${line}` : line }]),
    cache: "no-store",
  });
  const result = await response.json().catch(() => null);
  const success = Array.isArray(result) ? result[0]?.success !== false : response.ok;
  if (!response.ok || !success) {
    console.error("[booking-notes] Beds24 update failed", { bookingId, status: response.status });
    return `beds24_http_${response.status}`;
  }
  return "written";
}
