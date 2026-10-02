import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { todayInAthensIso } from "@/lib/ai-assistant/room-finder-date";

export const runtime = "nodejs";

const beds24BaseUrl = "https://beds24.com/api/v2";
const beds24PropertyId = Number(process.env.BEDS24_PROPERTY_ID || "117813");

const roomMappings = [
  { roomId: 267788, unitId: 1, label: "Room 1", categoryLabel: "First Floor" },
  { roomId: 268803, unitId: 1, label: "Room 2", categoryLabel: "Economy" },
  { roomId: 267788, unitId: 2, label: "Room 3", categoryLabel: "First Floor" },
  { roomId: 267788, unitId: 3, label: "Room 4", categoryLabel: "First Floor" },
  { roomId: 626129, unitId: 1, label: "Room 5", categoryLabel: "Ground Floor" },
  { roomId: 268803, unitId: 2, label: "Room 6", categoryLabel: "Economy" },
  { roomId: 626129, unitId: 2, label: "Room 7", categoryLabel: "Ground Floor" },
  { roomId: 265595, unitId: 1, label: "Apartment 8", categoryLabel: "Family Apartment" },
  { roomId: 265595, unitId: 2, label: "Apartment 9", categoryLabel: "Family Apartment" },
  { roomId: 265595, unitId: 3, label: "Apartment 10", categoryLabel: "Family Apartment" },
] as const;

function noStoreHeaders() {
  return {
    "Cache-Control": "no-store, no-cache, must-revalidate",
    "X-Robots-Tag": "noindex, nofollow",
  };
}

function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status, headers: noStoreHeaders() });
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

function cleanString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function cleanNumber(value: unknown, fallback: number) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function nightsBetween(arrival: string, departure: string) {
  const start = new Date(`${arrival}T00:00:00Z`).getTime();
  const end = new Date(`${departure}T00:00:00Z`).getTime();
  if (!Number.isFinite(start) || !Number.isFinite(end)) return 0;
  return Math.round((end - start) / 86400000);
}

function extractBookingId(result: any): string | number | null {
  const candidates = [
    result?.id,
    result?.bookId,
    result?.[0]?.id,
    result?.[0]?.bookId,
    result?.new?.id,
    result?.new?.[0]?.id,
    result?.result?.[0]?.new?.id,
    result?.result?.[0]?.info?.[0]?.id,
    result?.[0]?.new?.id,
    result?.[0]?.info?.[0]?.id,
    result?.data?.[0]?.id,
    result?.bookings?.[0]?.id,
  ];
  return candidates.find((value) => value !== null && typeof value !== "undefined" && value !== "") ?? null;
}

/**
 * wa.me needs the full international number without "+" or "00".
 * Greek numbers are often written without the country code (69xxxxxxxx /
 * 2xxxxxxxxx), which would open the wrong chat, so "30" is added for those.
 */
function whatsappNumber(raw: string) {
  const trimmed = raw.trim();
  let digits = trimmed.replace(/\D+/g, "");
  if (!digits) return "";
  if (trimmed.startsWith("00")) digits = digits.slice(2);
  else if (!trimmed.startsWith("+") && /^(69|2)\d{8,9}$/.test(digits) && digits.length === 10) digits = `30${digits}`;
  return digits.length >= 8 ? digits : "";
}

function hasRefreshWriteCredential() {
  return Boolean(process.env.BEDS24_REFRESH_TOKEN?.trim());
}

function hasDirectWriteCredential() {
  return Boolean(process.env.BEDS24_WRITE_API_TOKEN?.trim());
}

async function getBeds24Token() {
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

  throw new Error("No valid Beds24 write credential is configured. Add BEDS24_REFRESH_TOKEN or BEDS24_WRITE_API_TOKEN with booking-write permission.");
}

function addDaysIso(date: string, days: number) {
  const [year, month, day] = date.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day + days)).toISOString().slice(0, 10);
}

function bookingsFromPayload(payload: any): any[] {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.bookings)) return payload.bookings;
  return [];
}

/**
 * Live duplicate/overlap guard against Beds24 itself. Booking Core is a synced
 * snapshot, so a booking created seconds ago (e.g. a retry after a dropped
 * connection) is not in it yet. Beds24 is the source of truth: any
 * non-cancelled booking on the same room unit that overlaps the stay blocks
 * creation. If Beds24 cannot be read, creation is blocked too (fail closed).
 */
async function findLiveOverlap(params: { arrival: string; departure: string; roomId: number; unitId: number; writeToken: string }) {
  const token = process.env.BEDS24_API_TOKEN?.trim() || params.writeToken;
  const url = new URL(`${beds24BaseUrl}/bookings`);
  url.searchParams.set("propertyId", String(beds24PropertyId));
  url.searchParams.set("roomId", String(params.roomId));
  // Overlap: existing.arrival < new.departure AND existing.departure > new.arrival
  url.searchParams.set("arrivalTo", addDaysIso(params.departure, -1));
  url.searchParams.set("departureFrom", addDaysIso(params.arrival, 1));

  let response: Response;
  try {
    response = await fetch(url, {
      headers: { accept: "application/json", token },
      cache: "no-store",
      signal: AbortSignal.timeout(12_000),
    });
  } catch {
    return { checked: false as const, status: 0 };
  }
  if (!response.ok) {
    return { checked: false as const, status: response.status };
  }

  const payload = await response.json().catch(() => null);
  const conflict = bookingsFromPayload(payload).find((booking) => {
    const status = String(booking?.status || "").toLowerCase();
    if (status === "cancelled" || status === "canceled" || status === "inquiry") return false;
    if (Number(booking?.roomId) !== params.roomId) return false;
    if (Number(booking?.unitId) !== params.unitId) return false;
    const arrival = String(booking?.arrival || "").slice(0, 10);
    const departure = String(booking?.departure || "").slice(0, 10);
    return arrival < params.departure && departure > params.arrival;
  });

  return { checked: true as const, conflict: conflict || null };
}

async function verifyAvailability(params: { arrival: string; departure: string; guests: number; roomId: number; unitId: number }) {
  const databaseUrl = process.env.DATABASE_URL?.trim();
  if (!databaseUrl) return { ok: false, status: 503, message: "Booking Core database is not configured." };

  const sql = neon(databaseUrl);
  const statusRows = await sql`
    select * from booking_core.inventory_status(${params.arrival}::date, ${params.departure}::date)
  `;
  if (String((statusRows as any[])[0]?.status || "DATA_UNAVAILABLE") !== "READY") {
    return { ok: false, status: 409, message: "Η διαθεσιμότητα δεν είναι αρκετά φρέσκια. Κάνε νέο έλεγχο πριν την καταχώρηση." };
  }

  const rows = await sql`
    select room_id::text as room_id, unit_id::text as unit_id
    from booking_core.search_availability(${params.arrival}::date, ${params.departure}::date, ${params.guests})
    where room_id::text = ${String(params.roomId)}::text
      and unit_id::text = ${String(params.unitId)}::text
    limit 1
  `;
  if ((rows as any[]).length === 0) {
    return { ok: false, status: 409, message: "Το δωμάτιο δεν είναι πλέον διαθέσιμο. Κάνε νέο έλεγχο διαθεσιμότητας." };
  }
  return { ok: true, status: 200, message: "OK" };
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) return unauthorized();
  const refreshReady = hasRefreshWriteCredential();
  const directWriteReady = hasDirectWriteCredential();
  return json({
    apiReady: refreshReady || directWriteReady,
    propertyReady: Boolean(beds24PropertyId),
    writeCredentialMode: refreshReady ? "refresh" : directWriteReady ? "direct-write" : "missing",
    legacyInviteCodeIgnored: Boolean(process.env.BEDS24_INVITE_CODE?.trim()),
    readTokenPresent: Boolean(process.env.BEDS24_API_TOKEN?.trim()),
  });
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) return unauthorized();

  try {
    const body = await request.json();
    const propertyId = beds24PropertyId;
    const roomId = cleanNumber(body.roomId, 0);
    const unitId = cleanNumber(body.unitId, 0);
    const room = roomMappings.find((item) => item.roomId === roomId && item.unitId === unitId);
    const arrival = cleanString(body.arrival);
    const departure = cleanString(body.departure);
    const firstName = cleanString(body.firstName);
    const lastName = cleanString(body.lastName);
    const email = cleanString(body.email);
    const phone = cleanString(body.phone || body.mobile);
    const language = cleanString(body.language) || "en";
    const adults = Math.max(1, cleanNumber(body.adults, 1));
    const children = Math.max(0, cleanNumber(body.children, 0));
    const price = body.price === null || body.price === "" || typeof body.price === "undefined"
      ? null
      : cleanNumber(body.price, NaN);
    const comments = cleanString(body.comments);
    const notes = cleanString(body.notes);

    if (!propertyId) return json({ message: "Missing Beds24 property id." }, 503);
    if (!hasRefreshWriteCredential() && !hasDirectWriteCredential()) {
      return json({ message: "Η σύνδεση write με Beds24 δεν είναι ρυθμισμένη ακόμη. Χρειάζεται ξεχωριστό write credential για δημιουργία κράτησης." }, 503);
    }
    if (!room) return json({ message: "Invalid room/unit mapping." }, 400);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(arrival) || !/^\d{4}-\d{2}-\d{2}$/.test(departure)) return json({ message: "Invalid dates." }, 400);
    if (!firstName || !lastName) return json({ message: "First name and last name are required." }, 400);
    const nights = nightsBetween(arrival, departure);
    if (nights <= 0) return json({ message: "Departure must be after arrival." }, 400);
    if (arrival < todayInAthensIso()) {
      return json({ message: `Το check-in (${arrival}) είναι στο παρελθόν. Έλεγξε τις ημερομηνίες — ίσως λάθος έτος.` }, 400);
    }
    const guests = adults + children;
    if (guests < 1 || guests > 5) return json({ message: "This booking must contain between 1 and 5 guests." }, 400);
    if (price !== null && (!Number.isFinite(price) || price < 0)) return json({ message: "Invalid total price." }, 400);

    const availability = await verifyAvailability({ arrival, departure, guests, roomId, unitId });
    if (!availability.ok) return json({ message: availability.message }, availability.status);

    const token = await getBeds24Token();

    const overlap = await findLiveOverlap({ arrival, departure, roomId, unitId, writeToken: token });
    if (!overlap.checked) {
      return json({ message: `Δεν μπόρεσα να ελέγξω ζωντανά το Beds24 για διπλή κράτηση (HTTP ${overlap.status}). Η κράτηση δεν καταχωρήθηκε — δοκίμασε ξανά σε λίγο.` }, 503);
    }
    if (overlap.conflict) {
      const existingName = `${String(overlap.conflict.firstName || "").trim()} ${String(overlap.conflict.lastName || "").trim()}`.trim();
      const existingRef = [existingName, overlap.conflict.id ? `#${overlap.conflict.id}` : ""].filter(Boolean).join(", ");
      return json({
        message: `Υπάρχει ήδη κράτηση στο ${room.label} που πέφτει σε αυτές τις ημερομηνίες${existingRef ? ` (${existingRef})` : ""}. Δεν δημιουργήθηκε νέα κράτηση — έλεγξε στο Beds24 μήπως έχει ήδη περαστεί.`,
        existingBookingId: overlap.conflict.id ?? null,
      }, 409);
    }

    const payload = {
      propertyId,
      status: "confirmed",
      roomId,
      unitId,
      firstName,
      lastName,
      email,
      mobile: phone,
      phone,
      language,
      arrival,
      departure,
      numAdult: adults,
      numChild: children,
      price,
      message: comments,
      notes,
      nights,
      apiMessage: "Voulamandis Staff AI Booking Assistant",
      refererEditable: "Staff Direct",
    };

    const cleaned = Object.fromEntries(Object.entries(payload).filter(([, value]) => value !== null && value !== ""));
    const response = await fetch(`${beds24BaseUrl}/bookings`, {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        token,
      },
      body: JSON.stringify([cleaned]),
      cache: "no-store",
    });
    const result = await response.json().catch(() => null);

    if (!response.ok) {
      return json({ message: `Beds24 returned error ${response.status}.`, details: result }, 400);
    }

    const bookingId = extractBookingId(result);
    if (!bookingId) return json({ message: "Beds24 did not return a booking id.", details: result }, 502);

    const digits = whatsappNumber(phone);
    const whatsappText = encodeURIComponent(
      `Voulamandis House\nBooking ${bookingId}\n${arrival} → ${departure}\n${room.label}\n${adults} adults${children ? ` + ${children} children` : ""}${price !== null ? `\nTotal: €${price}` : ""}`,
    );

    return json({
      bookingId,
      roomLabel: room.label,
      categoryLabel: room.categoryLabel,
      whatsappUrl: digits ? `https://wa.me/${digits}?text=${whatsappText}` : "",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Booking creation failed.";
    return json({ message }, 500);
  }
}
