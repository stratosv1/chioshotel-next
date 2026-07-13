import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_NIGHTS = 30;
const MAX_GUESTS = 10;

const ROOM_NUMBER_BY_KEY: Record<string, number> = {
  "267788:1": 1,
  "268803:1": 2,
  "267788:2": 3,
  "267788:3": 4,
  "626129:1": 5,
  "268803:2": 6,
  "626129:2": 7,
  "265595:1": 8,
  "265595:2": 9,
  "265595:3": 10,
};

function normalizeGuests(value: string | null) {
  const parsed = Number.parseInt(value || "2", 10);
  if (!Number.isFinite(parsed)) return 2;
  return Math.min(MAX_GUESTS, Math.max(1, parsed));
}

function isDate(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function stayNights(checkin: string, checkout: string) {
  return Math.round((new Date(`${checkout}T12:00:00Z`).getTime() - new Date(`${checkin}T12:00:00Z`).getTime()) / 86400000);
}

function validateSearchParams(checkin: string, checkout: string, guests: number) {
  if (!isDate(checkin) || !isDate(checkout)) return "Invalid dates";
  const nights = stayNights(checkin, checkout);
  if (!Number.isFinite(nights) || nights < 1) return "Checkout must be after checkin";
  if (nights > MAX_NIGHTS) return "Stay too long";
  if (guests < 1 || guests > MAX_GUESTS) return "Invalid guests";
  return "";
}

type RoomRecord = {
  roomId?: number | string;
  unitId?: number | string;
  maxGuests?: number | string;
  [key: string]: unknown;
};

function roomNumber(room: RoomRecord) {
  return ROOM_NUMBER_BY_KEY[`${String(room.roomId || "")}:${String(room.unitId || "")}`];
}

function roomAllowedForGuests(room: RoomRecord, guests: number) {
  const number = roomNumber(room);
  if (!number) return false;
  if (guests <= 2) return number >= 1 && number <= 10;
  if (guests === 3) return [1, 3, 4, 5, 7, 8, 9, 10].includes(number);
  if (guests === 4) return [1, 8, 9, 10].includes(number);
  if (guests === 5) return number === 10;
  return false;
}

function asMoney(value: unknown) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.round(parsed * 100) / 100 : null;
}

function makeDays(checkin: string, checkout: string) {
  const days: string[] = [];
  const cursor = new Date(`${checkin}T12:00:00Z`);
  const end = new Date(`${checkout}T12:00:00Z`);
  while (cursor < end) {
    days.push(cursor.toISOString().slice(0, 10));
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }
  return days;
}

async function searchNeon(checkin: string, checkout: string, guests: number) {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error("DATABASE_URL is missing");

  const sql = neon(databaseUrl);
  const queryStarted = performance.now();

  const [units, availability, rates, bookings] = await Promise.all([
    sql`
      select room_id::text as room_id, unit_id::text as unit_id, label as display_name,
             room_name as category, location as floor, max_guests
      from staff_units
      where is_active = true
      order by id asc
    `,
    sql`
      select stay_date::text as date, room_id::text as room_id, unit_id::text as unit_id,
             price, available, reason
      from staff_availability_calendar
      where stay_date >= ${checkin}::date and stay_date < ${checkout}::date
      order by stay_date asc
    `,
    sql`
      select stay_date::text as date, room_id::text as room_id, price
      from staff_rate_cache
      where stay_date >= ${checkin}::date and stay_date < ${checkout}::date
      order by stay_date asc
    `,
    sql`
      select room_id::text as room_id, unit_id::text as unit_id, status
      from staff_bookings_snapshot
      where arrival < ${checkout}::date and departure > ${checkin}::date
    `,
  ]);

  const queryMs = Math.round(performance.now() - queryStarted);
  if (!units.length) throw new Error("Neon room inventory is empty");
  if (!availability.length && !rates.length) throw new Error("Neon availability copy is incomplete for this date range");

  const availabilityMap = new Map<string, any>();
  for (const row of availability as any[]) {
    availabilityMap.set(`${row.room_id}:${row.unit_id}:${row.date}`, row);
  }

  const rateMap = new Map<string, number>();
  for (const row of rates as any[]) {
    const price = asMoney(row.price);
    if (price !== null) rateMap.set(`${row.room_id}:${row.date}`, price);
  }

  const bookedUnits = new Set<string>();
  for (const booking of bookings as any[]) {
    const status = String(booking.status || "").toLowerCase();
    if (status.includes("cancel") || status.includes("deleted")) continue;
    bookedUnits.add(`${booking.room_id}:${booking.unit_id}`);
  }

  const days = makeDays(checkin, checkout);
  const nights = days.length;
  const availableRooms: RoomRecord[] = [];
  const unavailableRooms: RoomRecord[] = [];

  for (const unit of units as any[]) {
    const roomId = String(unit.room_id);
    const unitId = String(unit.unit_id);
    const unitKey = `${roomId}:${unitId}`;
    const base: RoomRecord = {
      roomId,
      unitId,
      roomNumber: ROOM_NUMBER_BY_KEY[unitKey],
      name: unit.display_name,
      category: unit.category,
      floor: unit.floor,
      maxGuests: Number(unit.max_guests || 0),
      nights,
    };

    if (!roomAllowedForGuests(base, guests)) continue;

    if (bookedUnits.has(unitKey)) {
      unavailableRooms.push({ ...base, available: false, reason: "BOOKED" });
      continue;
    }

    let totalPrice = 0;
    let reason = "";
    const nightlyPrices: Array<{ date: string; price: number }> = [];

    for (const day of days) {
      const row = availabilityMap.get(`${unitKey}:${day}`);
      const price = asMoney(row?.price) ?? rateMap.get(`${roomId}:${day}`) ?? null;

      if (row?.available === false) {
        reason = String(row.reason || "UNAVAILABLE");
        break;
      }
      if (price === null || price <= 0) {
        reason = "NO_PRICE";
        break;
      }

      totalPrice += price;
      nightlyPrices.push({ date: day, price });
    }

    if (!reason && nightlyPrices.length === nights) {
      const roundedTotal = Math.round(totalPrice * 100) / 100;
      availableRooms.push({
        ...base,
        price: roundedTotal,
        totalPrice: roundedTotal,
        roomTotal: roundedTotal,
        nightlyPrices,
        available: true,
      });
    } else {
      unavailableRooms.push({ ...base, available: false, reason: reason || "UNAVAILABLE" });
    }
  }

  return {
    payload: {
      success: true,
      checkin,
      checkout,
      guests,
      nights,
      rooms: { available: availableRooms, unavailable: unavailableRooms },
      summary: {
        availableRooms: availableRooms.length,
        unavailableRooms: unavailableRooms.length,
      },
      _booking_engine: {
        source: "neon_staff_calendar",
        generatedAt: new Date().toISOString(),
        queryMs,
      },
    },
    queryMs,
  };
}

export async function GET(request: NextRequest) {
  const started = performance.now();
  try {
    const checkin = request.nextUrl.searchParams.get("checkin") || "";
    const checkout = request.nextUrl.searchParams.get("checkout") || "";
    const guests = normalizeGuests(request.nextUrl.searchParams.get("guests"));
    const validationError = validateSearchParams(checkin, checkout, guests);

    if (validationError) {
      return NextResponse.json({ success: false, message: validationError }, { status: 400 });
    }

    const result = await searchNeon(checkin, checkout, guests);
    const totalMs = Math.round(performance.now() - started);

    return NextResponse.json(
      {
        ...result.payload,
        _booking_engine: {
          ...result.payload._booking_engine,
          totalMs,
        },
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store",
          "Server-Timing": `neon;dur=${result.queryMs}, total;dur=${totalMs}`,
        },
      },
    );
  } catch (error) {
    const totalMs = Math.round(performance.now() - started);
    const message = error instanceof Error ? error.message : "Unknown booking search error";
    return NextResponse.json(
      {
        success: false,
        message,
        _booking_engine: { source: "neon_staff_calendar_error", totalMs },
      },
      {
        status: 503,
        headers: {
          "Cache-Control": "no-store",
          "Server-Timing": `total;dur=${totalMs}`,
        },
      },
    );
  }
}
