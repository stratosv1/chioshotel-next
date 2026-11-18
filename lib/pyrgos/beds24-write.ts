import "server-only";
import { getBeds24WriteToken } from "@/lib/crm/booking-notes";
import { roomByNumber } from "./rooms";

// Writes bookings to Beds24 for the control tower: create, modify (dates, room, guest,
// price) and cancel. Availability is never touched (owner rule: it feeds the channels).

const API = "https://api.beds24.com/v2";
const PROPERTY_ID = Number(process.env.BEDS24_PROPERTY_ID || "117813");
const KNOWN_ROOM_IDS = new Set([267788, 268803, 626129, 265595]);
const text = (value: unknown) => String(value ?? "").trim();

let apt11RoomId: number | null = Number(process.env.BEDS24_APT11_ROOM_ID || "") || null;

/** Apt 11 is a room of the property outside the four known room types; found once and cached. */
async function resolveApt11RoomId() {
  if (apt11RoomId) return apt11RoomId;
  const token = process.env.BEDS24_API_TOKEN?.trim();
  if (!token) throw new Error("Λείπει το BEDS24_API_TOKEN για να βρεθεί το Apt 11.");
  const url = new URL(`${API}/properties`);
  url.searchParams.set("id", String(PROPERTY_ID));
  url.searchParams.set("includeAllRooms", "true");
  const response = await fetch(url, { headers: { accept: "application/json", token }, cache: "no-store", signal: AbortSignal.timeout(15_000) });
  const payload = (await response.json().catch(() => null)) as any;
  const rooms: any[] = payload?.data?.[0]?.roomTypes ?? payload?.data?.[0]?.rooms ?? [];
  const other = rooms.map((room) => Number(room?.id)).filter((id) => id && !KNOWN_ROOM_IDS.has(id));
  if (other.length !== 1) throw new Error("Δεν βρέθηκε με σιγουριά το Apt 11 στο Beds24.");
  apt11RoomId = other[0];
  return apt11RoomId;
}

export async function unitFor(roomNumber: number) {
  const room = roomByNumber(roomNumber);
  if (!room) throw new Error("Άγνωστο δωμάτιο.");
  return { roomId: room.roomId ?? (await resolveApt11RoomId()), unitId: room.unitId };
}

const addDays = (iso: string, days: number) => {
  const d = new Date(`${iso}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
};

/** Any live (non-cancelled) Beds24 booking on that room unit overlapping the stay, except `ignore`. */
export async function liveOverlap(roomNumber: number, arrival: string, departure: string, ignore: string[] = []) {
  const { roomId, unitId } = await unitFor(roomNumber);
  const token = process.env.BEDS24_API_TOKEN?.trim() || (await getBeds24WriteToken());
  const url = new URL(`${API}/bookings`);
  url.searchParams.set("propertyId", String(PROPERTY_ID));
  url.searchParams.set("roomId", String(roomId));
  url.searchParams.set("arrivalTo", addDays(departure, -1));
  url.searchParams.set("departureFrom", addDays(arrival, 1));
  const response = await fetch(url, { headers: { accept: "application/json", token }, cache: "no-store", signal: AbortSignal.timeout(12_000) });
  if (!response.ok) throw new Error(`Δεν μπόρεσα να ελέγξω το Beds24 για διπλή κράτηση (HTTP ${response.status}).`);
  const payload = (await response.json().catch(() => null)) as any;
  const list: any[] = Array.isArray(payload?.data) ? payload.data : [];
  return (
    list.find((b) => {
      const status = text(b.status).toLowerCase();
      if (["cancelled", "canceled", "inquiry"].includes(status)) return false;
      if (ignore.includes(text(b.id))) return false;
      if (Number(b.roomId) !== roomId || Number(b.unitId) !== unitId) return false;
      return text(b.arrival).slice(0, 10) < departure && text(b.departure).slice(0, 10) > arrival;
    }) ?? null
  );
}

async function post(body: Record<string, unknown>) {
  const token = await getBeds24WriteToken();
  const response = await fetch(`${API}/bookings`, {
    method: "POST",
    headers: { accept: "application/json", "content-type": "application/json", token },
    body: JSON.stringify([body]),
    cache: "no-store",
    signal: AbortSignal.timeout(20_000),
  });
  const result = (await response.json().catch(() => null)) as any;
  const first = Array.isArray(result) ? result[0] : result;
  if (!response.ok || first?.success === false) {
    const detail = JSON.stringify(first?.errors ?? first?.warnings ?? "").slice(0, 200);
    throw new Error(`Το Beds24 δεν δέχτηκε την αλλαγή (HTTP ${response.status}) ${detail}`.trim());
  }
  return first;
}

export type GuestFields = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  adults: number;
  children: number;
};

export async function createBeds24Booking(input: GuestFields & { room: number; arrival: string; departure: string; total: number | null; notes: string }) {
  const { roomId, unitId } = await unitFor(input.room);
  const result = await post({
    propertyId: PROPERTY_ID,
    roomId,
    unitId,
    status: "confirmed",
    arrival: input.arrival,
    departure: input.departure,
    firstName: input.firstName,
    lastName: input.lastName,
    ...(input.email ? { email: input.email } : {}),
    ...(input.phone ? { mobile: input.phone, phone: input.phone } : {}),
    ...(input.country ? { country2: input.country.slice(0, 2).toUpperCase() } : {}),
    numAdult: input.adults,
    numChild: input.children,
    ...(input.total !== null ? { price: input.total } : {}),
    ...(input.notes ? { notes: input.notes } : {}),
    refererEditable: "Πύργος ελέγχου",
  });
  const id = text(result?.new?.id ?? result?.id ?? result?.info?.[0]?.id);
  if (!id) throw new Error("Το Beds24 δεν έδωσε αριθμό κράτησης.");
  return id;
}

export async function modifyBeds24Booking(
  id: string,
  changes: Partial<GuestFields & { room: number; arrival: string; departure: string; total: number | null }>,
) {
  const body: Record<string, unknown> = { id: Number(id) };
  if (changes.room !== undefined) Object.assign(body, await unitFor(changes.room));
  if (changes.arrival) body.arrival = changes.arrival;
  if (changes.departure) body.departure = changes.departure;
  if (changes.firstName !== undefined) body.firstName = changes.firstName;
  if (changes.lastName !== undefined) body.lastName = changes.lastName;
  if (changes.email !== undefined) body.email = changes.email;
  if (changes.phone !== undefined) Object.assign(body, { mobile: changes.phone, phone: changes.phone });
  if (changes.adults !== undefined) body.numAdult = changes.adults;
  if (changes.children !== undefined) body.numChild = changes.children;
  if (changes.total !== undefined && changes.total !== null) body.price = changes.total;
  await post(body);
}

export async function cancelBeds24Booking(id: string) {
  await post({ id: Number(id), status: "cancelled" });
}
