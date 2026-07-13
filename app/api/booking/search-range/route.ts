import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { readBookingSearchCache, writeBookingSearchCache } from "@/lib/booking-search-cache";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DEFAULT_BOOKING_WEBAPP_URL =
  "https://script.google.com/macros/s/AKfycbwZ8qG1eE1YXr-Ag2LXNHrgFIkf7kCvDiTMF38NfPNC9ZGAquGMIXvn3QWPfpiKpTaa/exec";

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

function getBookingWebAppUrl() {
  return process.env.GOOGLE_BOOKING_SEARCH_WEBAPP_URL || DEFAULT_BOOKING_WEBAPP_URL;
}

function normalizeGuests(value: string | null) {
  const parsed = Number.parseInt(value || "2", 10);
  if (!Number.isFinite(parsed)) return 2;
  if (parsed < 1) return 1;
  if (parsed > MAX_GUESTS) return MAX_GUESTS;
  return parsed;
}

function isDate(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function stayNights(checkin: string, checkout: string) {
  return Math.round((new Date(`${checkout}T12:00:00Z`).getTime() - new Date(`${checkin}T12:00:00Z`).getTime()) / 86400000);
}

function validateSearchParams(checkin: string, checkout: string, guests: number) {
  if (!isDate(checkin) || !isDate(checkout)) return "Invalid dates";
  const checkinDate = new Date(`${checkin}T12:00:00Z`);
  const checkoutDate = new Date(`${checkout}T12:00:00Z`);
  if (Number.isNaN(checkinDate.getTime()) || Number.isNaN(checkoutDate.getTime()) || checkoutDate <= checkinDate) return "Checkout must be after checkin";
  const nights = stayNights(checkin, checkout);
  if (nights < 1) return "Invalid stay length";
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

type BookingSearchPayload = {
  success?: boolean;
  checkin?: string;
  checkout?: string;
  guests?: number;
  nights?: number;
  rooms?: {
    available?: RoomRecord[];
    unavailable?: RoomRecord[];
    [key: string]: unknown;
  };
  summary?: {
    availableRooms?: number;
    unavailableRooms?: number;
    [key: string]: unknown;
  };
  [key: string]: unknown;
};

function roomNumber(room: RoomRecord) {
  return ROOM_NUMBER_BY_KEY[`${String(room.roomId || "")}:${String(room.unitId || "")}`];
}

function roomAllowedForGuests(room: RoomRecord, guests: number) {
  const number = roomNumber(room);
  if (!number || number === 11) return false;
  if (guests <= 2) return number >= 1 && number <= 10;
  if (guests === 3) return [1, 3, 4, 5, 7, 8, 9, 10].includes(number);
  if (guests === 4) return [1, 8, 9, 10].includes(number);
  if (guests === 5) return number === 10;
  return false;
}

function applyRoomRules(input: BookingSearchPayload, guests: number) {
  const data = structuredClone(input);
  if (Array.isArray(data.rooms?.available)) {
    data.rooms.available = data.rooms.available.filter((room) => roomAllowedForGuests(room, guests));
  }
  if (Array.isArray(data.rooms?.unavailable)) {
    data.rooms.unavailable = data.rooms.unavailable.filter((room) => roomAllowedForGuests(room, guests));
  }
  if (data.summary && typeof data.summary === "object") {
    data.summary.availableRooms = Array.isArray(data.rooms?.available) ? data.rooms.available.length : 0;
    data.summary.unavailableRooms = Array.isArray(data.rooms?.unavailable) ? data.rooms.unavailable.length : 0;
  }
  return data;
}

async function readJsonResponse(response: Response) {
  const text = await response.text();
  try {
    return { text, json: JSON.parse(text) as BookingSearchPayload };
  } catch {
    return { text, json: null };
  }
}

async function fetchLiveSearch(checkin: string, checkout: string, guests: number) {
  const url = new URL(getBookingWebAppUrl());
  url.searchParams.set("action", "search_range");
  url.searchParams.set("checkin", checkin);
  url.searchParams.set("checkout", checkout);
  url.searchParams.set("guests", String(guests));

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: { Accept: "application/json", "User-Agent": "VoulamandisHouseNext/1.0" },
    cache: "no-store",
  });

  const parsed = await readJsonResponse(response);
  if (!response.ok || !parsed.json || typeof parsed.json !== "object") {
    throw new Error(`Invalid response from availability service (${response.status}): ${parsed.text.slice(0, 180)}`);
  }
  return applyRoomRules(parsed.json, guests);
}

function asMoney(value: unknown) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.round(parsed * 100) / 100 : null;
}

async function fetchNeonSearch(checkin: string, checkout: string, guests: number): Promise<BookingSearchPayload | null> {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) return null;

  const nights = stayNights(checkin, checkout);
  const sql = neon(databaseUrl);

  const units = await sql`
    select
      room_id::text as room_id,
      unit_id::text as unit_id,
      label as display_name,
      room_name as category,
      location as floor,
      max_guests
    from staff_units
    where is_active = true
    order by id asc
  `;

  if (!units.length) return null;

  const availability = await sql`
    select
      stay_date::text as date,
      room_id::text as room_id,
      unit_id::text as unit_id,
      price,
      available,
      reason
    from staff_availability_calendar
    where stay_date >= ${checkin}::date
      and stay_date < ${checkout}::date
    order by stay_date asc
  `;

  const rates = await sql`
    select
      stay_date::text as date,
      room_id::text as room_id,
      price
    from staff_rate_cache
    where stay_date >= ${checkin}::date
      and stay_date < ${checkout}::date
    order by stay_date asc
  `;

  const bookings = await sql`
    select
      room_id::text as room_id,
      unit_id::text as unit_id,
      arrival::text as arrival,
      departure::text as departure,
      status
    from staff_bookings_snapshot
    where arrival < ${checkout}::date
      and departure > ${checkin}::date
  `;

  if (!availability.length && !rates.length) return null;

  const availabilityMap = new Map<string, any>();
  for (const row of availability as any[]) {
    availabilityMap.set(`${row.room_id}:${row.unit_id}:${row.date}`, row);
  }

  const rateMap = new Map<string, number>();
  for (const row of rates as any[]) {
    const price = asMoney(row.price);
    if (price !== null) rateMap.set(`${row.room_id}:${row.date}`, price);
  }

  const days: string[] = [];
  const cursor = new Date(`${checkin}T12:00:00Z`);
  const end = new Date(`${checkout}T12:00:00Z`);
  while (cursor < end) {
    days.push(cursor.toISOString().slice(0, 10));
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }

  const availableRooms: RoomRecord[] = [];
  const unavailableRooms: RoomRecord[] = [];

  for (const unit of units as any[]) {
    const roomId = String(unit.room_id);
    const unitId = String(unit.unit_id);
    const base: RoomRecord = {
      roomId,
      unitId,
      roomNumber: ROOM_NUMBER_BY_KEY[`${roomId}:${unitId}`],
      name: unit.display_name,
      category: unit.category,
      floor: unit.floor,
      maxGuests: Number(unit.max_guests || 0),
      nights,
    };

    if (!roomAllowedForGuests(base, guests)) continue;

    const overlappingBooking = (bookings as any[]).some((booking) => {
      const status = String(booking.status || "").toLowerCase();
      if (status.includes("cancel") || status.includes("deleted")) return false;
      return String(booking.room_id) === roomId && String(booking.unit_id) === unitId;
    });

    let totalPrice = 0;
    let complete = true;
    let blockedReason = overlappingBooking ? "BOOKED" : "";
    const nightlyPrices: Array<{ date: string; price: number }> = [];

    for (const day of days) {
      const row = availabilityMap.get(`${roomId}:${unitId}:${day}`);
      const fallbackPrice = rateMap.get(`${roomId}:${day}`);
      const price = asMoney(row?.price) ?? fallbackPrice ?? null;

      if (row && row.available === false) {
        complete = false;
        blockedReason = String(row.reason || "UNAVAILABLE");
        break;
      }
      if (price === null || price <= 0) {
        complete = false;
        blockedReason = "NO_PRICE";
        break;
      }

      totalPrice += price;
      nightlyPrices.push({ date: day, price });
    }

    if (overlappingBooking) complete = false;

    if (complete && nightlyPrices.length === nights) {
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
      unavailableRooms.push({
        ...base,
        available: false,
        reason: blockedReason || "UNAVAILABLE",
      });
    }
  }

  return {
    success: true,
    checkin,
    checkout,
    guests,
    nights,
    rooms: {
      available: availableRooms,
      unavailable: unavailableRooms,
    },
    summary: {
      availableRooms: availableRooms.length,
      unavailableRooms: unavailableRooms.length,
    },
  };
}

function isAuthorizedRefresh(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  return request.headers.get("authorization") === `Bearer ${secret}`;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const checkin = searchParams.get("checkin") || "";
    const checkout = searchParams.get("checkout") || "";
    const guests = normalizeGuests(searchParams.get("guests"));
    const validationError = validateSearchParams(checkin, checkout, guests);

    if (validationError) {
      return NextResponse.json({ success: false, message: validationError }, { status: 400 });
    }

    const forceRefresh = searchParams.get("refresh") === "1" && isAuthorizedRefresh(request);
    const cached = forceRefresh ? null : await readBookingSearchCache(checkin, checkout, guests).catch(() => null);

    try {
      const neonData = await fetchNeonSearch(checkin, checkout, guests);
      if (neonData) {
        await writeBookingSearchCache(checkin, checkout, guests, neonData).catch(() => false);
        return NextResponse.json({
          ...neonData,
          _booking_engine: {
            cached: false,
            stale: false,
            generatedAt: new Date().toISOString(),
            source: "neon_staff_calendar",
          },
        }, { status: 200, headers: { "Cache-Control": "no-store" } });
      }
    } catch (neonError) {
      console.error("Neon booking search failed", neonError);
    }

    if (cached?.fresh) {
      return NextResponse.json({
        ...cached.payload,
        _booking_engine: {
          cached: true,
          stale: false,
          ageSeconds: cached.ageSeconds,
          updatedAt: cached.updatedAt,
          source: "neon_search_cache",
        },
      }, { status: 200, headers: { "Cache-Control": "no-store" } });
    }

    try {
      const data = await fetchLiveSearch(checkin, checkout, guests);
      await writeBookingSearchCache(checkin, checkout, guests, data).catch(() => false);

      return NextResponse.json({
        ...data,
        _booking_engine: {
          cached: false,
          stale: false,
          generatedAt: new Date().toISOString(),
          source: forceRefresh ? "cron_live_refresh" : "apps_script_fallback",
        },
      }, { status: 200, headers: { "Cache-Control": "no-store" } });
    } catch (liveError) {
      if (cached?.payload) {
        return NextResponse.json({
          ...cached.payload,
          _booking_engine: {
            cached: true,
            stale: true,
            ageSeconds: cached.ageSeconds,
            updatedAt: cached.updatedAt,
            source: "neon_stale_fallback",
            warning: liveError instanceof Error ? liveError.message : "Live refresh failed",
          },
        }, { status: 200, headers: { "Cache-Control": "no-store" } });
      }
      throw liveError;
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown booking search error";
    return NextResponse.json({
      success: false,
      message,
      _booking_engine: { cached: false, source: "booking_search_exception" },
    }, { status: 502 });
  }
}
