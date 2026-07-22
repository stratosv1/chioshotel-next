import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { saveSnapshot, type MonthlyMetric } from "@/lib/staff-statistics";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MONTHS = [4, 5, 6, 7, 8, 9, 10];
const DAYS: Record<number, number> = { 4: 30, 5: 31, 6: 30, 7: 31, 8: 31, 9: 30, 10: 31 };
const ROOM_COUNT = 10;

function isAuthorized(request: NextRequest) {
  const expectedUser = process.env.STAFF_USERNAME;
  const expectedPass = process.env.STAFF_PASSWORD;
  if (!expectedUser || !expectedPass) return false;
  const auth = request.headers.get("authorization");
  if (!auth?.startsWith("Basic ")) return false;
  try {
    const decoded = Buffer.from(auth.slice(6), "base64").toString("utf8");
    const separator = decoded.indexOf(":");
    return separator > -1 && decoded.slice(0, separator) === expectedUser && decoded.slice(separator + 1) === expectedPass;
  } catch {
    return false;
  }
}

function unauthorized() {
  return new NextResponse("Unauthorized", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Staff Statistics"', "X-Robots-Tag": "noindex, nofollow" },
  });
}

function normalizeKey(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function pick(row: Record<string, unknown>, aliases: string[]) {
  const keys = new Set(aliases.map(normalizeKey));
  for (const [key, value] of Object.entries(row)) {
    if (keys.has(normalizeKey(key)) && value !== null && value !== undefined && String(value).trim() !== "") return value;
  }
  return null;
}

function parseDate(value: unknown): Date | null {
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value;
  if (typeof value === "number") {
    const parsed = XLSX.SSF.parse_date_code(value);
    if (parsed) return new Date(parsed.y, parsed.m - 1, parsed.d);
  }
  const raw = String(value ?? "").trim();
  if (!raw) return null;
  const parsed = new Date(raw);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function numberValue(value: unknown) {
  const parsed = Number(String(value ?? "0").replace(/,/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) return unauthorized();

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const year = Number(formData.get("year"));
    if (!(file instanceof File)) throw new Error("Δεν επιλέχθηκε αρχείο.");
    if (!Number.isInteger(year) || year < 2025 || year > 2100) throw new Error("Μη έγκυρο έτος report.");

    const workbook = XLSX.read(Buffer.from(await file.arrayBuffer()), { type: "buffer", cellDates: true });
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(firstSheet, { defval: null, raw: true });
    if (!rows.length) throw new Error("Το αρχείο δεν περιέχει γραμμές.");

    const bookings = new Map<string, { unit: number; checkIn: Date; checkOut: Date; charges: number }>();
    for (const row of rows) {
      const bookingId = String(pick(row, ["Booking number", "Booking id", "Booking ID", "bookingNumber", "bookId"]) ?? "").trim();
      const checkIn = parseDate(pick(row, ["Check in Date", "Check-in", "Arrival", "checkIn"]));
      const checkOut = parseDate(pick(row, ["Check out Date", "Check-out", "Departure", "checkOut"]));
      const unitRaw = String(pick(row, ["Unit", "Room", "Room number", "unitId"]) ?? "");
      const unit = Number(unitRaw.match(/\d+/)?.[0]);
      const amount = numberValue(pick(row, ["Amount EUR", "Amount", "Charge", "Price", "Total"]));
      if (!bookingId || !checkIn || !checkOut || !Number.isInteger(unit) || unit < 1 || unit > ROOM_COUNT) continue;

      const existing = bookings.get(bookingId);
      if (existing) existing.charges += amount;
      else bookings.set(bookingId, { unit, checkIn, checkOut, charges: amount });
    }
    if (!bookings.size) throw new Error("Δεν βρέθηκαν έγκυρες κρατήσεις στο report.");

    const occupied = new Map<number, Set<string>>();
    const charges = new Map<number, number>();
    const bookingCounts = new Map<number, number>();
    MONTHS.forEach((month) => occupied.set(month, new Set()));

    for (const [bookingId, booking] of bookings) {
      const checkInMonth = booking.checkIn.getFullYear() === year ? booking.checkIn.getMonth() + 1 : 0;
      if (MONTHS.includes(checkInMonth)) {
        charges.set(checkInMonth, (charges.get(checkInMonth) ?? 0) + booking.charges);
        bookingCounts.set(checkInMonth, (bookingCounts.get(checkInMonth) ?? 0) + 1);
      }

      const cursor = new Date(Math.max(booking.checkIn.getTime(), new Date(year, 3, 1).getTime()));
      const end = new Date(Math.min(booking.checkOut.getTime(), new Date(year, 10, 1).getTime()));
      while (cursor < end) {
        const month = cursor.getMonth() + 1;
        if (MONTHS.includes(month)) {
          const key = `${booking.unit}:${cursor.toISOString().slice(0, 10)}`;
          occupied.get(month)?.add(key);
        }
        cursor.setDate(cursor.getDate() + 1);
      }
      void bookingId;
    }

    const monthly: MonthlyMetric[] = MONTHS.map((month) => ({
      month,
      occupiedNights: occupied.get(month)?.size ?? 0,
      capacityNights: DAYS[month] * ROOM_COUNT,
      bookings: bookingCounts.get(month) ?? 0,
      charges: Number((charges.get(month) ?? 0).toFixed(2)),
    }));

    await saveSnapshot({ year, filename: file.name, monthly, rawPayload: { rows: rows.length, bookings: bookings.size } });

    return NextResponse.json({ ok: true, year, filename: file.name, monthly, bookings: bookings.size });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Αποτυχία εισαγωγής report.";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
