import { NextRequest, NextResponse } from "next/server";
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

function validateSearchParams(checkin: string, checkout: string, guests: number) {
  if (!isDate(checkin) || !isDate(checkout)) return "Invalid dates";
  const checkinDate = new Date(`${checkin}T12:00:00Z`);
  const checkoutDate = new Date(`${checkout}T12:00:00Z`);
  if (Number.isNaN(checkinDate.getTime()) || Number.isNaN(checkoutDate.getTime()) || checkoutDate <= checkinDate) return "Checkout must be after checkin";
  const nights = Math.round((checkoutDate.getTime() - checkinDate.getTime()) / 86400000);
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
          source: forceRefresh ? "cron_live_refresh" : "apps_script_live",
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
