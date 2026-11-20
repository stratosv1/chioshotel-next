import "server-only";
import { ALEXANDRIA_ROOMS } from "./config";

// Mirrors Andreas's calendar into Beds24 (owner, 2026-11-18): no price, the
// rooms are already closed for the group in Beds24, so we only create / modify
// / cancel the booking itself. Same Beds24 API v2 pattern as /staff/booker.

const beds24BaseUrl = "https://beds24.com/api/v2";
const beds24PropertyId = Number(process.env.BEDS24_PROPERTY_ID || "117813");

// Same room → Beds24 room/unit mapping as app/api/staff/booker/create.
const UNIT_MAP: Record<string, { roomId: number; unitId: number }> = {
  "1": { roomId: 267788, unitId: 1 },
  "2": { roomId: 268803, unitId: 1 },
  "3": { roomId: 267788, unitId: 2 },
  "4": { roomId: 267788, unitId: 3 },
  "5": { roomId: 626129, unitId: 1 },
  "6": { roomId: 268803, unitId: 2 },
  "7": { roomId: 626129, unitId: 2 },
  "8": { roomId: 265595, unitId: 1 },
  "9": { roomId: 265595, unitId: 2 },
  "10": { roomId: 265595, unitId: 3 },
};

export type Beds24SyncResult = { ok: true; bookingId: string } | { ok: false; error: string };

type StayFields = {
  room: string;
  checkin: string;
  checkout: string;
  firstName: string;
  lastName: string;
  country: string;
  phone: string;
  email?: string;
  notes: string;
};

async function getToken() {
  const refreshToken = process.env.BEDS24_REFRESH_TOKEN?.trim();
  if (refreshToken) {
    const response = await fetch(`${beds24BaseUrl}/authentication/token`, {
      headers: { accept: "application/json", refreshToken },
      cache: "no-store",
      signal: AbortSignal.timeout(12_000),
    });
    const data = await response.json().catch(() => null);
    if (!response.ok || !data?.token) throw new Error(`token refresh failed (HTTP ${response.status})`);
    return data.token as string;
  }
  const direct = process.env.BEDS24_WRITE_API_TOKEN?.trim();
  if (direct) return direct;
  throw new Error("no Beds24 write credential configured");
}

function extractBookingId(result: any): string | null {
  const candidates = [
    result?.[0]?.new?.id,
    result?.[0]?.id,
    result?.[0]?.info?.[0]?.id,
    result?.new?.id,
    result?.id,
    result?.result?.[0]?.new?.id,
    result?.data?.[0]?.id,
  ];
  const found = candidates.find((value) => value !== null && value !== undefined && value !== "");
  return found !== undefined ? String(found) : null;
}

async function postBookings(body: Record<string, unknown>) {
  const token = await getToken();
  const response = await fetch(`${beds24BaseUrl}/bookings`, {
    method: "POST",
    headers: { accept: "application/json", "content-type": "application/json", token },
    body: JSON.stringify([body]),
    cache: "no-store",
    signal: AbortSignal.timeout(15_000),
  });
  const result = await response.json().catch(() => null);
  const success = Array.isArray(result) ? result[0]?.success !== false : response.ok;
  if (!response.ok || !success) {
    const detail = Array.isArray(result) ? JSON.stringify(result[0]?.errors ?? result[0]?.warnings ?? "").slice(0, 200) : "";
    throw new Error(`Beds24 HTTP ${response.status}${detail ? ` ${detail}` : ""}`);
  }
  return result;
}

function bookingBody(stay: StayFields) {
  const unit = UNIT_MAP[stay.room];
  if (!unit) throw new Error(`unknown room ${stay.room}`);
  const roomLabel = ALEXANDRIA_ROOMS.find((room) => room.id === stay.room)?.label ?? stay.room;
  const notes = [
    "Alexandria Institute — κράτηση από Ανδρέα (chioshotel.gr/andreas)",
    stay.country ? `Χώρα: ${stay.country}` : "",
    stay.notes ? `Σημειώσεις: ${stay.notes}` : "",
  ]
    .filter(Boolean)
    .join("\n");
  return {
    propertyId: beds24PropertyId,
    roomId: unit.roomId,
    unitId: unit.unitId,
    status: "confirmed",
    arrival: stay.checkin,
    departure: stay.checkout,
    firstName: stay.firstName,
    lastName: stay.lastName,
    ...(stay.phone ? { mobile: stay.phone, phone: stay.phone } : {}),
    ...(stay.country ? { country: stay.country } : {}),
    ...(stay.email ? { email: stay.email } : {}),
    numAdult: 1,
    numChild: 0,
    notes,
    refererEditable: "Alexandria Institute",
    apiMessage: `Alexandria Institute · ${roomLabel}`,
  };
}

function failure(error: unknown): Beds24SyncResult {
  const message = error instanceof Error ? error.message : String(error);
  console.error("[alexandria] Beds24 sync failed", message);
  return { ok: false, error: message };
}

export async function createInBeds24(stay: StayFields): Promise<Beds24SyncResult> {
  try {
    const result = await postBookings(bookingBody(stay));
    const bookingId = extractBookingId(result);
    if (!bookingId) return { ok: false, error: "Beds24 did not return a booking id" };
    return { ok: true, bookingId };
  } catch (error) {
    return failure(error);
  }
}

export async function updateInBeds24(beds24Id: string, stay: StayFields): Promise<Beds24SyncResult> {
  try {
    const { propertyId: _propertyId, ...fields } = bookingBody(stay);
    await postBookings({ id: Number(beds24Id), ...fields });
    return { ok: true, bookingId: beds24Id };
  } catch (error) {
    return failure(error);
  }
}

export async function cancelInBeds24(beds24Id: string): Promise<Beds24SyncResult> {
  try {
    await postBookings({ id: Number(beds24Id), status: "cancelled" });
    return { ok: true, bookingId: beds24Id };
  } catch (error) {
    return failure(error);
  }
}
