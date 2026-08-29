import { NextRequest, NextResponse } from "next/server";
import { todayInAthensIso } from "@/lib/ai-assistant/room-finder-date";

export const runtime = "nodejs";
export const maxDuration = 60;

const LANGUAGES = ["el", "en", "de", "fr", "it", "es", "tr"] as const;
const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const STAFF_ROOM_COOKIE = "staff_requested_room";
const BEDS24_PROPERTY_ID = "117813";

const ROOM_BY_SOURCE = new Map([
  ["267788:1", 1],
  ["268803:1", 2],
  ["267788:2", 3],
  ["267788:3", 4],
  ["626129:1", 5],
  ["268803:2", 6],
  ["626129:2", 7],
  ["265595:1", 8],
  ["265595:2", 9],
  ["265595:3", 10],
]);

const API_SOURCE_LABELS: Record<number, string> = {
  0: "Direct",
  1: "Booking Page",
  10: "Airbnb iCal",
  14: "Expedia",
  17: "Agoda",
  19: "Booking.com",
  20: "Tripadvisor",
  30: "Vrbo",
  40: "HomeAway iCal",
  42: "OTA",
  46: "Airbnb",
  51: "Ostrovok",
  53: "Trip.com",
  55: "Tripadvisor Rentals",
  56: "Traveloka",
  58: "Google",
  78: "HomeToGo",
  999: "Agent",
};

const BOOKING_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["intent", "arrivalQueryDate", "fields", "clearFields", "sourceSummary", "clarification"],
  properties: {
    intent: { type: "string", enum: ["booking_intake", "arrivals_query"] },
    arrivalQueryDate: { type: ["string", "null"] },
    fields: {
      type: "object",
      additionalProperties: false,
      required: [
        "checkin",
        "checkout",
        "nights",
        "totalGuests",
        "adults",
        "children",
        "requestedRoomNumber",
        "firstName",
        "lastName",
        "email",
        "phone",
        "language",
        "totalPrice",
        "comments",
        "notes",
      ],
      properties: {
        checkin: { type: ["string", "null"] },
        checkout: { type: ["string", "null"] },
        nights: { type: ["integer", "null"], minimum: 1, maximum: 90 },
        totalGuests: { type: ["integer", "null"], minimum: 1, maximum: 10 },
        adults: { type: ["integer", "null"], minimum: 1, maximum: 10 },
        children: { type: ["integer", "null"], minimum: 0, maximum: 9 },
        requestedRoomNumber: { type: ["integer", "null"], minimum: 1, maximum: 10 },
        firstName: { type: ["string", "null"] },
        lastName: { type: ["string", "null"] },
        email: { type: ["string", "null"] },
        phone: { type: ["string", "null"] },
        language: { type: ["string", "null"], enum: [null, ...LANGUAGES] },
        totalPrice: { type: ["number", "null"], minimum: 0 },
        comments: { type: ["string", "null"] },
        notes: { type: ["string", "null"] },
      },
    },
    clearFields: {
      type: "array",
      maxItems: 8,
      items: {
        type: "string",
        enum: ["email", "phone", "comments", "notes"],
      },
    },
    sourceSummary: { type: "string" },
    clarification: { type: ["string", "null"] },
  },
} as const;

const SYSTEM_PROMPT = `You are the semantic interpreter for the private Voulamandis House Staff Booking Assistant.

You have two intents:
1. booking_intake: the staff member is creating or correcting a booking.
2. arrivals_query: the staff member asks which guests/check-ins/arrivals exist on a specific date.

INTENT RULES
- Use arrivals_query for requests such as "ποιες αφίξεις έχω 31/8", "ποιοι έρχονται αύριο", "arrivals on 10 September", "check-ins σήμερα".
- For arrivals_query, normalize the requested date to YYYY-MM-DD in arrivalQueryDate. Resolve today/tomorrow using the supplied Europe/Athens date. If no date is supplied or the date is genuinely ambiguous, set arrivalQueryDate=null and put one concise Greek question in clarification.
- For arrivals_query, do not invent arrival data. The application will fetch the actual bookings after your intent/date extraction.
- For booking_intake set arrivalQueryDate=null.

For booking_intake your job is ONLY to extract booking facts from the staff member's latest text or uploaded screenshot and return them in the strict JSON schema. You never search availability, never calculate a price, and never create a booking.

IMPORTANT BEHAVIOR
- Read the latest input together with the current draft supplied by the application.
- The latest clear correction overrides the current draft.
- Extract every booking fact present in one pass. A pasted email may contain almost the entire booking.
- A screenshot can contain an email, message, booking request or handwritten/typed information. Read the visible booking facts carefully.
- Never invent missing facts. Return null for facts not supported by the latest input.
- If a booking fact in the latest input is genuinely ambiguous, set clarification to one concise Greek question naming exactly what is ambiguous. Missing information alone is not ambiguity.
- sourceSummary is a concise Greek summary of what you successfully extracted from THIS latest input. Do not include facts that only came from currentDraft.

DATES
- Normalize exact dates to YYYY-MM-DD.
- European date order applies: 10/10 means 10 October.
- Today in Europe/Athens is supplied by the application.
- If a year is omitted, resolve to the nearest occurrence that is today or in the future unless the source explicitly indicates a different year.
- If check-in plus nights are explicit, return checkin + nights. If checkout can be read explicitly, return it too.
- Do not silently repair contradictory dates; use clarification when the intended date is genuinely unclear.

GUESTS
- totalGuests is everyone in the booking.
- adults and children are separate counts when explicitly stated or directly derivable from an explicit total and one explicit component.
- Operational staff convention: a generic count such as "3 people", "3 guests", "3 persons" or "3 άτομα" with no mention or indication of children means totalGuests=3, adults=3 and children=0. Do not ask a follow-up question for adults/children in this case.
- If the source mentions a child/children/kid/baby/family composition but does not provide enough numbers to determine adults and children, do not guess; keep the unknown component null so the application can ask for clarification.
- "2 adults" means adults=2 and children=0 only when the wording clearly indicates there are no children or the source presents the guest composition as complete. Otherwise children remains null.

ROOM REQUEST
- If the staff explicitly requests a physical room number from 1 to 10, extract it as requestedRoomNumber.
- Examples: "δωμάτιο 5", "στο 5", "room 5", "Room No 5" when the context clearly means a room assignment.
- requestedRoomNumber is a staff selection request, NOT a guest comment and NOT a staff note.
- Do not put the requested room into comments or notes.
- The application will still perform live availability before honoring this request. You do not decide whether the room is available.

CONTACT / NAME
- Split first and last name only when reasonably clear. Preserve accents and original spelling.
- Email and phone should be copied exactly enough to use operationally; remove surrounding labels/punctuation.
- A Booking.com relay email is still a valid email and must be extracted.

LANGUAGE
- Infer guest language only when the guest communication/source language is clear. Use el/en/de/fr/it/es/tr.
- Do not infer guest language merely because the staff member writes Greek around pasted foreign content; prefer the guest-facing source language.

PRICE
- totalPrice is the TOTAL booking amount in EUR, not the nightly rate.
- If only a nightly rate is shown and total cannot be established without calculation, return totalPrice=null. The application handles pricing separately.
- If an explicit total is shown, extract its numeric EUR value.

COMMENTS / NOTES
- comments are guest-facing requests or information that belongs with the reservation: arrival time, breakfast request, cot, accessibility request, transport, special request, etc.
- notes are only internal staff notes explicitly identified as internal/staff notes. Do not turn ordinary prose into staff notes.
- A requested physical room number is never a comment or note; use requestedRoomNumber only.

CLEARING OPTIONAL FIELDS
- If the staff explicitly says there is no email / no phone / no guest comment / no staff note, include that field name in clearFields.
- Otherwise do not clear existing data.

Return JSON only.`;

type DraftContext = Record<string, unknown>;

function noStoreHeaders() {
  return {
    "Cache-Control": "no-store, no-cache, must-revalidate",
    "X-Robots-Tag": "noindex, nofollow",
  };
}

function isAuthorized(request: NextRequest) {
  const username = process.env.STAFF_USERNAME;
  const password = process.env.STAFF_PASSWORD;
  if (!username || !password) return false;
  const header = request.headers.get("authorization");
  if (!header?.startsWith("Basic ")) return false;
  try {
    const decoded = Buffer.from(header.slice(6), "base64").toString("utf8");
    const separator = decoded.indexOf(":");
    if (separator < 0) return false;
    return decoded.slice(0, separator) === username && decoded.slice(separator + 1) === password;
  } catch {
    return false;
  }
}

function unauthorized() {
  return new NextResponse(JSON.stringify({ message: "Unauthorized" }), {
    status: 401,
    headers: {
      ...noStoreHeaders(),
      "Content-Type": "application/json",
      "WWW-Authenticate": 'Basic realm="Voulamandis Staff"',
    },
  });
}

function getOutputText(payload: any): string {
  if (typeof payload?.output_text === "string") return payload.output_text;
  for (const item of Array.isArray(payload?.output) ? payload.output : []) {
    for (const content of Array.isArray(item?.content) ? item.content : []) {
      if (typeof content?.text === "string") return content.text;
    }
  }
  return "";
}

function safeContext(value: FormDataEntryValue | null): DraftContext {
  if (typeof value !== "string" || !value.trim()) return {};
  try {
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
}

function finiteInteger(value: unknown): number | null {
  const number = Number(value);
  if (!Number.isFinite(number) || !Number.isInteger(number)) return null;
  return number;
}

function normalizeGuestComposition(parsed: any, latestText: string) {
  if (!parsed || typeof parsed !== "object" || !parsed.fields || typeof parsed.fields !== "object") return parsed;
  if (parsed.intent === "arrivals_query") return parsed;

  const fields = parsed.fields as Record<string, unknown>;
  let totalGuests = finiteInteger(fields.totalGuests);
  let adults = finiteInteger(fields.adults);
  let children = finiteInteger(fields.children);
  const guestEvidence = `${latestText} ${typeof parsed.sourceSummary === "string" ? parsed.sourceSummary : ""} ${typeof parsed.clarification === "string" ? parsed.clarification : ""}`;
  const mentionsChildren = /(παιδ|μωρ|child|kid|baby|infant|çocuk|bebek|enfant|bébé|kind|bambin|niñ)/i.test(guestEvidence);

  if (totalGuests !== null && adults === null && children === null && !mentionsChildren) {
    adults = totalGuests;
    children = 0;
  } else if (adults !== null && children === null && totalGuests === null && !mentionsChildren) {
    children = 0;
    totalGuests = adults;
  }
  if (totalGuests !== null && adults !== null && children === null) {
    const derivedChildren = totalGuests - adults;
    if (derivedChildren >= 0) children = derivedChildren;
  }
  if (totalGuests !== null && children !== null && adults === null) {
    const derivedAdults = totalGuests - children;
    if (derivedAdults >= 1) adults = derivedAdults;
  }
  if (adults !== null && children !== null) totalGuests = adults + children;

  fields.totalGuests = totalGuests;
  fields.adults = adults;
  fields.children = children;

  if (
    adults !== null
    && children !== null
    && typeof parsed.clarification === "string"
    && /(ενήλικ|παιδ|adult|child|guest|άτομ|person)/i.test(parsed.clarification)
  ) parsed.clarification = null;

  return parsed;
}

function roomFromText(value: string) {
  const match = value.match(/(?:δωμάτι(?:ο|ου)|room|zimmer|chambre|camera|habitación|oda)\s*(?:no\.?\s*)?(10|[1-9])\b/i);
  if (!match) return null;
  const room = Number(match[1]);
  return room >= 1 && room <= 10 ? room : null;
}

function stripRoomAssignmentComment(value: unknown, room: number | null) {
  if (typeof value !== "string" || !value.trim() || room === null) return value;
  const stripped = value
    .replace(new RegExp(`(?:αίτημα[:：]?\\s*)?(?:για\\s+)?(?:το\\s+)?(?:δωμάτι(?:ο|ου)|room)\\s*(?:no\\.?\\s*)?${room}\\b`, "ig"), "")
    .replace(/^[\s,.;:–—-]+|[\s,.;:–—-]+$/g, "")
    .trim();
  return stripped || null;
}

function normalizeRoomRequest(parsed: any, latestText: string) {
  if (!parsed || typeof parsed !== "object" || !parsed.fields || typeof parsed.fields !== "object") return parsed;
  if (parsed.intent === "arrivals_query") return parsed;
  const fields = parsed.fields as Record<string, unknown>;
  let requestedRoomNumber = finiteInteger(fields.requestedRoomNumber);
  if (requestedRoomNumber === null) requestedRoomNumber = roomFromText(latestText);
  if (requestedRoomNumber !== null && (requestedRoomNumber < 1 || requestedRoomNumber > 10)) requestedRoomNumber = null;
  fields.requestedRoomNumber = requestedRoomNumber;
  fields.comments = stripRoomAssignmentComment(fields.comments, requestedRoomNumber);
  fields.notes = stripRoomAssignmentComment(fields.notes, requestedRoomNumber);
  return parsed;
}

function dateOnly(value: unknown) {
  return String(value ?? "").match(/^\d{4}-\d{2}-\d{2}/)?.[0] || "";
}

function nightsBetween(arrival: string, departure: string) {
  const start = new Date(`${arrival}T00:00:00Z`).getTime();
  const end = new Date(`${departure}T00:00:00Z`).getTime();
  if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) return 0;
  return Math.round((end - start) / 86400000);
}

function prettyDate(date: string) {
  const [year, month, day] = date.split("-").map(Number);
  if (!year || !month || !day) return date;
  return new Intl.DateTimeFormat("el-GR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, day)));
}

function getBookingArray(payload: unknown): any[] {
  if (Array.isArray(payload)) return payload;
  if (!payload || typeof payload !== "object") return [];
  const record = payload as Record<string, unknown>;
  if (Array.isArray(record.data)) return record.data as any[];
  if (Array.isArray(record.bookings)) return record.bookings as any[];
  return [];
}

function sourceLabel(booking: any) {
  const sourceId = Number(booking?.apiSourceId);
  if (Number.isInteger(sourceId) && API_SOURCE_LABELS[sourceId]) return API_SOURCE_LABELS[sourceId];
  const source = String(booking?.apiSource || booking?.referer || "").trim();
  return source || (Number.isInteger(sourceId) ? `Source ${sourceId}` : "Άγνωστη πηγή");
}

function guestCount(value: unknown) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? Math.trunc(parsed) : 0;
}

async function buildArrivalsAnswer(date: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return "Για ποια ημερομηνία θέλεις να δω τις αφίξεις;";
  const token = process.env.BEDS24_API_TOKEN?.trim();
  if (!token) return "Δεν μπορώ να διαβάσω αυτή τη στιγμή τις αφίξεις από το Beds24, γιατί λείπει το read token.";

  const url = new URL("https://api.beds24.com/v2/bookings");
  url.searchParams.set("propertyId", BEDS24_PROPERTY_ID);
  url.searchParams.set("arrivalFrom", date);
  url.searchParams.set("arrivalTo", date);

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: { accept: "application/json", token },
      cache: "no-store",
      signal: AbortSignal.timeout(12_000),
    });
    if (!response.ok) return `Δεν μπόρεσα να διαβάσω τις αφίξεις από το Beds24 (HTTP ${response.status}).`;

    const payload = await response.json().catch(() => null);
    const bookings = getBookingArray(payload)
      .filter((booking) => dateOnly(booking?.arrival || booking?.checkIn) === date)
      .filter((booking) => !/(cancel|canceled|cancelled)/i.test(String(booking?.status || "")))
      .map((booking) => {
        const roomId = String(booking?.roomId ?? "").trim();
        const unitId = String(booking?.unitId ?? "").trim();
        const roomNumber = ROOM_BY_SOURCE.get(`${roomId}:${unitId}`) ?? null;
        const arrival = dateOnly(booking?.arrival || booking?.checkIn);
        const departure = dateOnly(booking?.departure || booking?.checkOut);
        const nights = nightsBetween(arrival, departure);
        const adults = guestCount(booking?.numAdult);
        const children = guestCount(booking?.numChild);
        const firstName = String(booking?.firstName || "").trim();
        const lastName = String(booking?.lastName || "").trim();
        const name = `${firstName} ${lastName}`.trim() || "Χωρίς όνομα";
        return {
          source: sourceLabel(booking),
          roomNumber,
          roomName: String(booking?.roomName || "").trim(),
          name,
          nights,
          adults,
          children,
        };
      })
      .sort((a, b) => (a.roomNumber ?? 99) - (b.roomNumber ?? 99) || a.name.localeCompare(b.name, "el"));

    if (!bookings.length) return `Δεν υπάρχουν αφίξεις στις ${prettyDate(date)}.`;

    const lines = bookings.map((booking, index) => {
      const room = booking.roomNumber ? `Δωμάτιο ${booking.roomNumber}` : (booking.roomName || "Δωμάτιο -");
      const nightsText = booking.nights === 1 ? "1 νύχτα" : `${booking.nights} νύχτες`;
      const adultsText = booking.adults === 1 ? "1 ενήλικας" : `${booking.adults} ενήλικες`;
      const childrenText = booking.children === 1 ? "1 παιδί" : `${booking.children} παιδιά`;
      return `${index + 1}. ${booking.source} · ${room}\n${booking.name} · ${nightsText}\n${adultsText} · ${childrenText}`;
    });

    return `Αφίξεις ${prettyDate(date)} · ${bookings.length}\n\n${lines.join("\n\n")}`;
  } catch (error) {
    console.error("Staff arrivals lookup failed", error);
    return "Δεν μπόρεσα να διαβάσω αυτή τη στιγμή τις αφίξεις από το Beds24. Δοκίμασε ξανά.";
  }
}

function emptyBookingFields() {
  return {
    checkin: null,
    checkout: null,
    nights: null,
    totalGuests: null,
    adults: null,
    children: null,
    requestedRoomNumber: null,
    firstName: null,
    lastName: null,
    email: null,
    phone: null,
    language: null,
    totalPrice: null,
    comments: null,
    notes: null,
  };
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) return unauthorized();

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ message: "OPENAI_API_KEY is not configured." }, { status: 503, headers: noStoreHeaders() });
  }

  try {
    const form = await request.formData();
    const messageValue = form.get("message");
    const message = typeof messageValue === "string" ? messageValue.trim() : "";
    const currentDraft = safeContext(form.get("context"));
    const imageValue = form.get("image");
    const image = imageValue instanceof File && imageValue.size > 0 ? imageValue : null;

    if (!message && !image) {
      return NextResponse.json({ message: "Text or screenshot is required." }, { status: 400, headers: noStoreHeaders() });
    }

    if (image) {
      if (!ALLOWED_IMAGE_TYPES.has(image.type)) {
        return NextResponse.json({ message: "Screenshot must be JPG, PNG or WebP." }, { status: 415, headers: noStoreHeaders() });
      }
      if (image.size > MAX_IMAGE_BYTES) {
        return NextResponse.json({ message: "Screenshot is too large. Maximum size is 8 MB." }, { status: 413, headers: noStoreHeaders() });
      }
    }

    const content: Array<Record<string, unknown>> = [
      {
        type: "input_text",
        text: JSON.stringify({
          latestText: message || "[No accompanying text; extract booking facts from the screenshot.]",
          currentDraft,
        }),
      },
    ];

    if (image) {
      const buffer = Buffer.from(await image.arrayBuffer());
      content.push({
        type: "input_image",
        image_url: `data:${image.type};base64,${buffer.toString("base64")}`,
        detail: "high",
      });
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 45_000);

    try {
      const response = await fetch("https://api.openai.com/v1/responses", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        signal: controller.signal,
        body: JSON.stringify({
          model: process.env.OPENAI_STAFF_BOOKING_MODEL || process.env.OPENAI_CONCIERGE_MODEL || process.env.OPENAI_ASSISTANT_MODEL || "gpt-5-mini",
          store: false,
          instructions: `${SYSTEM_PROMPT}\nToday in Europe/Athens is ${todayInAthensIso()}.`,
          input: [{ role: "user", content }],
          text: {
            format: {
              type: "json_schema",
              name: "staff_booking_intake",
              strict: true,
              schema: BOOKING_SCHEMA,
            },
          },
        }),
      });

      const payload = await response.json().catch(() => null);
      if (!response.ok) {
        return NextResponse.json(
          { message: payload?.error?.message || `OpenAI intake failed with HTTP ${response.status}.` },
          { status: 502, headers: noStoreHeaders() },
        );
      }

      const output = getOutputText(payload);
      if (!output) {
        return NextResponse.json({ message: "OpenAI returned no structured intake." }, { status: 502, headers: noStoreHeaders() });
      }

      const parsed = normalizeRoomRequest(normalizeGuestComposition(JSON.parse(output), message), message);

      if (parsed?.intent === "arrivals_query") {
        const queryDate = dateOnly(parsed?.arrivalQueryDate);
        const answer = queryDate
          ? await buildArrivalsAnswer(queryDate)
          : (typeof parsed?.clarification === "string" && parsed.clarification.trim()
            ? parsed.clarification.trim()
            : "Για ποια ημερομηνία θέλεις να δω τις αφίξεις;");

        return NextResponse.json({
          ...parsed,
          arrivalQueryDate: queryDate || null,
          fields: emptyBookingFields(),
          clearFields: [],
          sourceSummary: "",
          clarification: answer,
        }, { headers: noStoreHeaders() });
      }

      const result = NextResponse.json(parsed, { headers: noStoreHeaders() });
      const requestedRoomNumber = finiteInteger(parsed?.fields?.requestedRoomNumber);
      if (requestedRoomNumber !== null && requestedRoomNumber >= 1 && requestedRoomNumber <= 10) {
        result.cookies.set(STAFF_ROOM_COOKIE, String(requestedRoomNumber), {
          path: "/staff",
          maxAge: 300,
          sameSite: "strict",
          secure: process.env.NODE_ENV === "production",
          httpOnly: false,
        });
      }
      return result;
    } finally {
      clearTimeout(timeout);
    }
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      return NextResponse.json(
        { message: "Η ανάλυση από OpenAI άργησε περισσότερο από το επιτρεπόμενο. Δοκίμασε ξανά την ίδια εισαγωγή." },
        { status: 504, headers: noStoreHeaders() },
      );
    }
    const message = error instanceof Error ? error.message : "Staff booking intake failed.";
    return NextResponse.json({ message }, { status: 500, headers: noStoreHeaders() });
  }
}
