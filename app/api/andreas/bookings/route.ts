import { NextRequest, NextResponse } from "next/server";
import { waitUntil } from "@vercel/functions";
import { isAlexandriaRoom, periodForStay } from "@/lib/alexandria/config";
import {
  createBooking,
  deleteBooking,
  findOverlap,
  getBooking,
  listBookings,
  notifyChange,
  updateBooking,
  type BookingInput,
} from "@/lib/alexandria/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const noStore = { "cache-control": "no-store", "x-robots-tag": "noindex, nofollow" };

function json(body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers: noStore });
}

function clean(value: unknown, max: number) {
  return String(value ?? "").replace(/\s+/g, " ").trim().slice(0, max);
}

function isoDate(value: unknown) {
  const raw = String(value ?? "");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(raw)) return "";
  const date = new Date(`${raw}T12:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === raw ? raw : "";
}

function parseInput(body: Record<string, unknown>): { input?: BookingInput; error?: string } {
  const input: BookingInput = {
    room: clean(body.room, 4),
    checkin: isoDate(body.checkin),
    checkout: isoDate(body.checkout),
    firstName: clean(body.firstName, 80),
    lastName: clean(body.lastName, 80),
    country: clean(body.country, 60),
    phone: clean(body.phone, 40),
    notes: String(body.notes ?? "").trim().slice(0, 500),
  };
  if (!isAlexandriaRoom(input.room)) return { error: "Διάλεξε δωμάτιο." };
  if (!input.checkin || !input.checkout) return { error: "Συμπλήρωσε check-in και check-out." };
  if (input.checkout <= input.checkin) return { error: "Το check-out πρέπει να είναι μετά το check-in." };
  if (!periodForStay(input.checkin, input.checkout))
    return { error: "Οι ημερομηνίες πρέπει να είναι μέσα στο διάστημα του Ιουνίου ή του Σεπτεμβρίου που φαίνεται στο ημερολόγιο." };
  if (!input.firstName || !input.lastName) return { error: "Συμπλήρωσε όνομα και επώνυμο." };
  return { input };
}

async function checkOverlap(input: BookingInput, ignoreId?: string) {
  const clash = await findOverlap(input.room, input.checkin, input.checkout, ignoreId);
  return clash
    ? `Το δωμάτιο είναι ήδη κρατημένο εκείνες τις μέρες (${clash.firstName} ${clash.lastName}).`
    : null;
}

export async function GET() {
  try {
    return json({ ok: true, bookings: await listBookings() });
  } catch (error) {
    console.error("[andreas] list failed", error);
    return json({ ok: false, error: "Δεν φόρτωσαν οι κρατήσεις." }, 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const { input, error } = parseInput(await request.json());
    if (!input) return json({ ok: false, error }, 400);
    const clash = await checkOverlap(input);
    if (clash) return json({ ok: false, error: clash }, 409);
    const booking = await createBooking(input);
    waitUntil(notifyChange("created", booking));
    return json({ ok: true, booking });
  } catch (error) {
    console.error("[andreas] create failed", error);
    return json({ ok: false, error: "Η αποθήκευση απέτυχε. Δοκίμασε ξανά." }, 500);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const id = clean(body.id, 12);
    const before = id ? await getBooking(id) : null;
    if (!before) return json({ ok: false, error: "Η κράτηση δεν βρέθηκε." }, 404);
    const { input, error } = parseInput(body);
    if (!input) return json({ ok: false, error }, 400);
    const clash = await checkOverlap(input, id);
    if (clash) return json({ ok: false, error: clash }, 409);
    const booking = await updateBooking(id, input);
    if (!booking) return json({ ok: false, error: "Η κράτηση δεν βρέθηκε." }, 404);
    waitUntil(notifyChange("updated", booking, before));
    return json({ ok: true, booking });
  } catch (error) {
    console.error("[andreas] update failed", error);
    return json({ ok: false, error: "Η αποθήκευση απέτυχε. Δοκίμασε ξανά." }, 500);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const id = clean(request.nextUrl.searchParams.get("id"), 12);
    const booking = id ? await deleteBooking(id) : null;
    if (!booking) return json({ ok: false, error: "Η κράτηση δεν βρέθηκε." }, 404);
    waitUntil(notifyChange("deleted", booking));
    return json({ ok: true });
  } catch (error) {
    console.error("[andreas] delete failed", error);
    return json({ ok: false, error: "Η διαγραφή απέτυχε. Δοκίμασε ξανά." }, 500);
  }
}
