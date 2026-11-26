import "server-only";
import { getBeds24WriteToken } from "@/lib/crm/booking-notes";
import { CLIMATE_FEE_LABEL, CLIMATE_FEE_PER_NIGHT, roomByNumber } from "./rooms";

// Writes bookings to Beds24 for the control tower: create, modify (dates, room, guest,
// price) and cancel. Availability is never touched (owner rule: it feeds the channels).

const API = "https://api.beds24.com/v2";
const PROPERTY_ID = Number(process.env.BEDS24_PROPERTY_ID || "117813");
const KNOWN_ROOM_IDS = new Set([267788, 268803, 626129, 265595]);
const text = (value: unknown) => String(value ?? "").trim();

/** Beds24 wants an ISO 3166 alpha-2 code; Greek letters (e.g. «ΕΛ») are refused, so map or drop. */
export function countryCode(value: string) {
  const v = value.trim().toUpperCase();
  if (["ΕΛ", "ΕΛΛ", "ΕΛΛΑΔΑ", "GREECE", "GRC"].includes(v)) return "GR";
  if (["ΚΥ", "ΚΥΠΡΟΣ", "CYPRUS", "CYP"].includes(v)) return "CY";
  return /^[A-Z]{2}$/.test(v) ? v : "";
}

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
  const createdId = first?.new?.id ?? first?.info?.[0]?.id;
  if (response.ok && createdId) {
    // Beds24 can create the booking and still report a refused field (e.g. country2): keep the booking.
    if (first?.success === false || first?.errors) console.warn("[pyrgos] Beds24 created with warnings", JSON.stringify(first?.errors ?? first?.warnings ?? "").slice(0, 300));
    return first;
  }
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

export async function createBeds24Booking(
  input: GuestFields & { room: number; arrival: string; departure: string; total: number | null; notes: string; masterId?: string },
) {
  const { roomId, unitId } = await unitFor(input.room);
  const body: Record<string, unknown> = {
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
    ...(countryCode(input.country) ? { country2: countryCode(input.country) } : {}),
    numAdult: input.adults,
    numChild: input.children,
    ...(input.total !== null ? { price: input.total } : {}),
    ...(input.notes ? { notes: input.notes } : {}),
    refererEditable: "Πύργος ελέγχου",
  };
  let linked = false;
  let result: any;
  if (input.masterId) {
    // Link to the group (master booking); if Beds24 refuses the link, create it unlinked with a note.
    try {
      result = await post({ ...body, masterId: Number(input.masterId) });
      linked = true;
    } catch (error) {
      console.error("[pyrgos] group link refused, creating unlinked", error);
      body.notes = [body.notes, `Μαζί με την κράτηση #${input.masterId}`].filter(Boolean).join("\n");
    }
  }
  if (!result) result = await post(body);
  const id = text(result?.new?.id ?? result?.id ?? result?.info?.[0]?.id);
  if (!id) throw new Error("Το Beds24 δεν έδωσε αριθμό κράτησης.");
  return { id, linked };
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

const BREAKFAST = /breakfast|πρωιν|frühst|colazione|petit[- ]d[ée]j|desayuno|kahvalt/i;

type UpsellLine = { name: string; vat: number | null };
let breakfastUpsell: { value: UpsellLine | null; at: number } | null = null;

/**
 * The breakfast upsell item of the property (owner, 2026-11-26: breakfast is an upsell in Beds24).
 * API V2 cannot attach an upsell item to a booking (an invoice line's subType is read-only), so
 * breakfast lines are written with the upsell's exact name and VAT instead. Cached for an hour.
 */
async function getBreakfastUpsell(): Promise<UpsellLine | null> {
  if (breakfastUpsell && Date.now() - breakfastUpsell.at < 3_600_000) return breakfastUpsell.value;
  let value: UpsellLine | null = null;
  try {
    const token = process.env.BEDS24_API_TOKEN?.trim() || (await getBeds24WriteToken());
    const url = new URL(`${API}/properties`);
    url.searchParams.set("id", String(PROPERTY_ID));
    url.searchParams.set("includeUpsellItems", "true");
    url.searchParams.set("includeTexts", "property");
    url.searchParams.append("includeLanguages", "all");
    const response = await fetch(url, { headers: { accept: "application/json", token }, cache: "no-store", signal: AbortSignal.timeout(12_000) });
    const property = ((await response.json().catch(() => null)) as any)?.data?.[0];
    const items: any[] = Array.isArray(property?.upsellItems) ? property.upsellItems : [];
    const texts: any[] = Array.isArray(property?.texts) ? property.texts : [];
    // English name first (the language the invoice lines are kept in), then any language.
    texts.sort((a, b) => (text(a?.language) === "en" ? -1 : 0) - (text(b?.language) === "en" ? -1 : 0));
    for (const item of items) {
      const index = Number(item?.index);
      if (!index || item?.enable === false || text(item?.type) === "notUsed") continue;
      const names = texts.map((t) => text(t?.[`upsellItemName${index}`])).filter(Boolean);
      // The name that actually says breakfast, never a template like "EXTRA : [CURRENTDATE]".
      const name = names.find((n) => BREAKFAST.test(n) && !/\[[A-Z]+\]/.test(n));
      if (!name) continue;
      const vat = Number(item?.vat);
      value = { name, vat: Number.isFinite(vat) && vat > 0 ? vat : null };
      break;
    }
  } catch (error) {
    console.error("[pyrgos] breakfast upsell lookup failed", error);
  }
  breakfastUpsell = { value, at: Date.now() };
  return value;
}

/** Adds a charge line to the Beds24 booking invoice (a negative amount reverses an earlier line). */
export async function addBeds24Charge(id: string, description: string, qty: number, unitPrice: number) {
  const line: Record<string, unknown> = { type: "charge", description, qty, amount: unitPrice };
  // Breakfast goes in with the name and VAT of the breakfast upsell item.
  const upsell = BREAKFAST.test(description) ? await getBreakfastUpsell() : null;
  if (upsell) {
    line.description = /^Ακύρωση:/.test(description) ? `Ακύρωση: ${upsell.name}` : upsell.name;
    if (upsell.vat !== null) line.vatRate = upsell.vat;
  }
  await post({ id: Number(id), invoiceItems: [line] });
}

const FEE_LINE = /κλιματ|climate|resilience|ΤΑΚΚ|τακκ|iklim/i;
const STAY_LINE = /^Διαμονή\b/;

const dmy = (iso: string, withYear: boolean) => {
  const [y, m, d] = iso.split("-");
  return withYear ? `${d}/${m}/${y}` : `${d}/${m}`;
};

/**
 * Beds24 totals only the invoice lines, not the booking's "price" field, and bookings created
 * through the API get no room line (owner, 2026-11-26: the stay was missing from the charges).
 * Keeps exactly one "Διαμονή" line equal to the booking price: adds it, or corrects its amount.
 * Never touches other lines. Direct bookings only (OTA invoices come from the channel).
 */
export async function ensureStayCharge(id: string) {
  const token = process.env.BEDS24_API_TOKEN?.trim() || (await getBeds24WriteToken());
  const url = new URL(`${API}/bookings`);
  url.searchParams.set("id", id);
  url.searchParams.set("includeInvoiceItems", "true");
  const response = await fetch(url, { headers: { accept: "application/json", token }, cache: "no-store", signal: AbortSignal.timeout(12_000) });
  if (!response.ok) throw new Error(`Beds24 HTTP ${response.status}`);
  const payload = (await response.json().catch(() => null)) as any;
  const booking = (Array.isArray(payload?.data) ? payload.data : []).find((b: any) => text(b?.id) === id);
  if (!booking) throw new Error("Η κράτηση δεν βρέθηκε στο Beds24.");
  const price = Math.round((Number(booking.price) || 0) * 100) / 100;
  if (price <= 0) return "no_price";
  const charges = (Array.isArray(booking.invoiceItems) ? booking.invoiceItems : []).filter((item: any) => !/payment/i.test(text(item.type)));
  const stay = charges.filter((item: any) => Number(item.subType) === 1 || STAY_LINE.test(text(item.description)));
  const current = stay.reduce((sum: number, item: any) => sum + (Number(item.qty) || 1) * (Number(item.amount) || 0), 0);
  if (Math.abs(current - price) < 0.01) return "exists";
  const arrival = text(booking.arrival).slice(0, 10);
  const departure = text(booking.departure).slice(0, 10);
  const description = arrival && departure ? `Διαμονή ${dmy(arrival, false)}–${dmy(departure, true)}` : "Διαμονή";
  if (stay.length === 1 && stay[0]?.id) {
    await post({ id: Number(id), invoiceItems: [{ id: Number(stay[0].id), qty: 1, amount: price, description }] });
    return "adjusted";
  }
  const diff = Math.round((price - current) * 100) / 100;
  await post({ id: Number(id), invoiceItems: [{ type: "charge", description, qty: 1, amount: current ? diff : price }] });
  return current ? "adjusted" : "added";
}

/**
 * Makes the Beds24 invoice carry exactly nights × €2 of climate fee (ΤΑΚΚ): adds a line when
 * none exists, or a correcting line when the nights changed. Never touches other lines.
 */
export async function ensureClimateFee(id: string, nights: number) {
  const token = process.env.BEDS24_API_TOKEN?.trim() || (await getBeds24WriteToken());
  const url = new URL(`${API}/bookings`);
  url.searchParams.set("id", id);
  url.searchParams.set("includeInvoiceItems", "true");
  const response = await fetch(url, { headers: { accept: "application/json", token }, cache: "no-store", signal: AbortSignal.timeout(12_000) });
  if (!response.ok) throw new Error(`Beds24 HTTP ${response.status}`);
  const payload = (await response.json().catch(() => null)) as any;
  const booking = (Array.isArray(payload?.data) ? payload.data : []).find((b: any) => text(b?.id) === id);
  if (!booking) throw new Error("Η κράτηση δεν βρέθηκε στο Beds24.");
  const current = (Array.isArray(booking.invoiceItems) ? booking.invoiceItems : [])
    .filter((item: any) => !/payment/i.test(text(item.type)) && FEE_LINE.test(text(item.description)))
    .reduce((sum: number, item: any) => sum + (Number(item.qty) || 1) * (Number(item.amount) || 0), 0);
  const wanted = Math.max(nights, 0) * CLIMATE_FEE_PER_NIGHT;
  const diff = Math.round((wanted - current) * 100) / 100;
  if (Math.abs(diff) < 0.01) return "exists";
  const qty = Math.round(diff / CLIMATE_FEE_PER_NIGHT);
  if (qty !== 0 && Math.abs(qty * CLIMATE_FEE_PER_NIGHT - diff) < 0.01) {
    await addBeds24Charge(id, CLIMATE_FEE_LABEL, Math.abs(qty), qty > 0 ? CLIMATE_FEE_PER_NIGHT : -CLIMATE_FEE_PER_NIGHT);
  } else {
    await addBeds24Charge(id, CLIMATE_FEE_LABEL, 1, diff);
  }
  return current ? "adjusted" : "added";
}
