import { NextRequest, NextResponse } from "next/server";
import { saveSnapshot, type ChannelMetric, type MonthlyMetric, type RoomMetric } from "@/lib/staff-statistics";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MONTHS = [4, 5, 6, 7, 8, 9, 10];
const DAYS: Record<number, number> = { 4: 30, 5: 31, 6: 30, 7: 31, 8: 31, 9: 30, 10: 31 };
const ROOM_COUNT = 10;
const SEASON_NIGHTS = 214;

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
  return new NextResponse("Unauthorized", { status: 401, headers: { "WWW-Authenticate": 'Basic realm="Staff Statistics"', "X-Robots-Tag": "noindex, nofollow" } });
}

function decodeHtml(value: string) {
  return value.replace(/<br\s*\/?\s*>/gi, " ").replace(/<[^>]+>/g, " ").replace(/&nbsp;/gi, " ").replace(/&amp;/gi, "&").replace(/&quot;/gi, '"').replace(/&#39;/gi, "'").replace(/\s+/g, " ").trim();
}

function parseHtmlTable(html: string) {
  const tableRows = [...html.matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi)].map((match) =>
    [...match[1].matchAll(/<t[dh]\b[^>]*>([\s\S]*?)<\/t[dh]>/gi)].map((cell) => decodeHtml(cell[1])),
  );
  if (tableRows.length < 2) return [] as Record<string, string>[];
  const headers = tableRows[0];
  return tableRows.slice(1).filter((row) => row.length === headers.length).map((row) => Object.fromEntries(headers.map((header, index) => [header, row[index] ?? ""])));
}

function normalizeKey(value: string) { return value.toLowerCase().replace(/[^a-z0-9]/g, ""); }
function pick(row: Record<string, string>, aliases: string[]) {
  for (const alias of aliases) {
    const wanted = normalizeKey(alias);
    for (const [key, value] of Object.entries(row)) {
      if (normalizeKey(key) === wanted && String(value).trim() !== "") return value;
    }
  }
  return "";
}
function parseDate(value: string): Date | null {
  const parsed = new Date(value.trim());
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}
function isoDate(value: Date) { return value.toISOString().slice(0, 10); }
function numberValue(value: string) {
  const parsed = Number(String(value || "0").replace(/,/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
}
function channelLabel(value: string) {
  const raw = value.trim().toLowerCase();
  if (raw.includes("booking.com")) return "Booking.com";
  if (raw.includes("expedia") || raw.includes("hotels.com")) return "Expedia / Hotels.com";
  if (raw.includes("airbnb")) return "Airbnb";
  const directTerms = ["voulamandis", "direct", "stratos", "andreas", "wordpress", "iframe", "bookinglink", "booker secure", "mike"];
  if (directTerms.some((term) => raw.includes(term))) return "Απευθείας";
  return "Άλλο";
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) return unauthorized();
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const year = Number(formData.get("year"));
    if (!(file instanceof File)) throw new Error("Δεν επιλέχθηκε αρχείο.");
    if (!Number.isInteger(year) || year < 2025 || year > 2100) throw new Error("Μη έγκυρο έτος report.");

    const html = Buffer.from(await file.arrayBuffer()).toString("utf8");
    const rows = parseHtmlTable(html);
    if (!rows.length) throw new Error("Το report δεν αναγνωρίστηκε. Χρησιμοποίησε το Beds24 payments .xls export.");

    const bookings = new Map<string, { bookingId: string; unit: number; checkIn: Date; checkOut: Date; charges: number; channel: string }>();
    for (const row of rows) {
      const bookingId = pick(row, ["Booking number", "Booking id", "Booking ID", "bookingNumber", "bookId"]).trim();
      const checkIn = parseDate(pick(row, ["Check in Date", "Check-in", "Arrival", "checkIn"]));
      const checkOut = parseDate(pick(row, ["Check out Date", "Check-out", "Departure", "checkOut"]));
      const unit = Number(pick(row, ["Unit", "Room number", "unitId", "Room"]).match(/\d+/)?.[0]);
      const amount = numberValue(pick(row, ["Amount EUR", "Amount", "Charge", "Price", "Total"]));
      const channel = channelLabel(pick(row, ["Referrer", "Original Referrer", "Channel", "Source"]));
      if (!bookingId || !checkIn || !checkOut || !Number.isInteger(unit) || unit < 1 || unit > ROOM_COUNT) continue;
      const existing = bookings.get(bookingId);
      if (existing) existing.charges += amount;
      else bookings.set(bookingId, { bookingId, unit, checkIn, checkOut, charges: amount, channel });
    }
    if (!bookings.size) throw new Error("Δεν βρέθηκαν έγκυρες κρατήσεις στο report.");

    const occupiedByMonth = new Map<number, Set<string>>();
    const monthCharges = new Map<number, number>();
    const monthBookings = new Map<number, number>();
    const occupiedByRoom = new Map<number, Set<string>>();
    const roomCharges = new Map<number, number>();
    const roomBookings = new Map<number, number>();
    const channelMap = new Map<string, ChannelMetric>();
    MONTHS.forEach((month) => occupiedByMonth.set(month, new Set()));
    for (let room = 1; room <= ROOM_COUNT; room += 1) occupiedByRoom.set(room, new Set());

    for (const booking of bookings.values()) {
      const checkInMonth = booking.checkIn.getFullYear() === year ? booking.checkIn.getMonth() + 1 : 0;
      if (MONTHS.includes(checkInMonth)) {
        monthCharges.set(checkInMonth, (monthCharges.get(checkInMonth) ?? 0) + booking.charges);
        monthBookings.set(checkInMonth, (monthBookings.get(checkInMonth) ?? 0) + 1);
        roomCharges.set(booking.unit, (roomCharges.get(booking.unit) ?? 0) + booking.charges);
        roomBookings.set(booking.unit, (roomBookings.get(booking.unit) ?? 0) + 1);
      }

      const start = new Date(Math.max(booking.checkIn.getTime(), new Date(year, 3, 1).getTime()));
      const end = new Date(Math.min(booking.checkOut.getTime(), new Date(year, 10, 1).getTime()));
      let stayNights = 0;
      const cursor = new Date(start);
      while (cursor < end) {
        const iso = cursor.toISOString().slice(0, 10);
        const month = cursor.getMonth() + 1;
        if (MONTHS.includes(month)) {
          occupiedByMonth.get(month)?.add(`${booking.unit}:${iso}`);
          occupiedByRoom.get(booking.unit)?.add(iso);
          stayNights += 1;
        }
        cursor.setDate(cursor.getDate() + 1);
      }

      if (checkInMonth) {
        const metric = channelMap.get(booking.channel) ?? { channel: booking.channel, occupiedNights: 0, bookings: 0, charges: 0 };
        metric.bookings += 1;
        metric.occupiedNights += stayNights;
        metric.charges += booking.charges;
        channelMap.set(booking.channel, metric);
      }
    }

    const monthly: MonthlyMetric[] = MONTHS.map((month) => ({ month, occupiedNights: occupiedByMonth.get(month)?.size ?? 0, capacityNights: DAYS[month] * ROOM_COUNT, bookings: monthBookings.get(month) ?? 0, charges: Number((monthCharges.get(month) ?? 0).toFixed(2)) }));
    const rooms: RoomMetric[] = Array.from({ length: ROOM_COUNT }, (_, index) => ({ room: index + 1, occupiedNights: occupiedByRoom.get(index + 1)?.size ?? 0, capacityNights: SEASON_NIGHTS, bookings: roomBookings.get(index + 1) ?? 0, charges: Number((roomCharges.get(index + 1) ?? 0).toFixed(2)) }));
    const channels = [...channelMap.values()].map((item) => ({ ...item, charges: Number(item.charges.toFixed(2)) })).sort((a, b) => b.charges - a.charges);
    const normalizedBookings = [...bookings.values()].map((booking) => ({
      bookingId: booking.bookingId,
      unit: booking.unit,
      checkIn: isoDate(booking.checkIn),
      checkOut: isoDate(booking.checkOut),
      charges: Number(booking.charges.toFixed(2)),
      channel: booking.channel,
    }));

    await saveSnapshot({ year, filename: file.name, monthly, rooms, channels, rawPayload: { rows: rows.length, bookings: bookings.size, normalizedBookings } });
    return NextResponse.json({ ok: true, year, filename: file.name, monthly, rooms, channels, bookings: bookings.size });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Αποτυχία εισαγωγής report.";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
