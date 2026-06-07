import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const revalidate = 840;

const DEFAULT_BOOKING_WEBAPP_URL =
  "https://script.google.com/macros/s/AKfycbwZ8qG1eE1YXr-Ag2LXNHrgFIkf7kCvDiTMF38NfPNC9ZGAquGMIXvn3QWPfpiKpTaa/exec";

const MAX_NIGHTS = 30;
const MAX_GUESTS = 10;

function getBookingWebAppUrl() {
  return process.env.GOOGLE_BOOKING_SEARCH_WEBAPP_URL || DEFAULT_BOOKING_WEBAPP_URL;
}

function normalizeGuests(value: string | null) {
  const parsed = Number.parseInt(value || "2", 10);

  if (!Number.isFinite(parsed)) {
    return 2;
  }

  if (parsed < 1) {
    return 1;
  }

  if (parsed > MAX_GUESTS) {
    return MAX_GUESTS;
  }

  return parsed;
}

function isDate(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function validateSearchParams(checkin: string, checkout: string, guests: number) {
  if (!isDate(checkin) || !isDate(checkout)) {
    return "Invalid dates";
  }

  const checkinDate = new Date(`${checkin}T12:00:00Z`);
  const checkoutDate = new Date(`${checkout}T12:00:00Z`);

  if (
    Number.isNaN(checkinDate.getTime()) ||
    Number.isNaN(checkoutDate.getTime()) ||
    checkoutDate <= checkinDate
  ) {
    return "Checkout must be after checkin";
  }

  const nights = Math.round(
    (checkoutDate.getTime() - checkinDate.getTime()) / (24 * 60 * 60 * 1000)
  );

  if (nights < 1) {
    return "Invalid stay length";
  }

  if (nights > MAX_NIGHTS) {
    return "Stay too long";
  }

  if (guests < 1 || guests > MAX_GUESTS) {
    return "Invalid guests";
  }

  return "";
}

type RoomWithGuests = {
  maxGuests?: number | string;
  [key: string]: unknown;
};

type BookingSearchPayload = {
  rooms?: {
    available?: RoomWithGuests[];
    unavailable?: RoomWithGuests[];
    [key: string]: unknown;
  };
  summary?: {
    availableRooms?: number;
    unavailableRooms?: number;
    [key: string]: unknown;
  };
  [key: string]: unknown;
};

function applyCapacitySafetyFilter(data: BookingSearchPayload, guests: number) {
  if (data.rooms?.available && Array.isArray(data.rooms.available)) {
    data.rooms.available = data.rooms.available.filter((room) => {
      const maxGuests = Number(room.maxGuests || 0);
      return maxGuests >= guests;
    });
  }

  if (data.rooms?.unavailable && Array.isArray(data.rooms.unavailable)) {
    data.rooms.unavailable = data.rooms.unavailable.filter((room) => {
      const maxGuests = Number(room.maxGuests || 0);
      return maxGuests >= guests;
    });
  }

  if (data.summary && typeof data.summary === "object") {
    data.summary.availableRooms = Array.isArray(data.rooms?.available)
      ? data.rooms.available.length
      : 0;
    data.summary.unavailableRooms = Array.isArray(data.rooms?.unavailable)
      ? data.rooms.unavailable.length
      : 0;
  }

  return data;
}

async function readJsonResponse(response: Response) {
  const text = await response.text();

  try {
    return {
      text,
      json: JSON.parse(text) as BookingSearchPayload,
    };
  } catch {
    return {
      text,
      json: null,
    };
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const checkin = searchParams.get("checkin") || "";
    const checkout = searchParams.get("checkout") || "";
    const guests = normalizeGuests(searchParams.get("guests"));

    const validationError = validateSearchParams(checkin, checkout, guests);

    if (validationError) {
      return NextResponse.json(
        {
          success: false,
          message: validationError,
        },
        { status: 400 }
      );
    }

    const url = new URL(getBookingWebAppUrl());
    url.searchParams.set("action", "search_range");
    url.searchParams.set("checkin", checkin);
    url.searchParams.set("checkout", checkout);
    url.searchParams.set("guests", String(guests));

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        Accept: "application/json",
        "User-Agent": "VoulamandisHouseNext/1.0",
      },
      next: {
        revalidate: 840,
      },
    });

    const parsed = await readJsonResponse(response);

    if (!response.ok || !parsed.json || typeof parsed.json !== "object") {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid response from availability service",
          statusCode: response.status,
          debug: {
            bodyPreview: parsed.text.slice(0, 500),
          },
          _booking_engine: {
            cached: false,
            source: "next_proxy",
          },
        },
        { status: 502 }
      );
    }

    const data = applyCapacitySafetyFilter(parsed.json, guests);

    return NextResponse.json(
      {
        ...data,
        _booking_engine: {
          cached: false,
          ttlMinutes: 14,
          generatedAt: new Date().toISOString(),
          source: "next_proxy_apps_script",
        },
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "s-maxage=840, stale-while-revalidate=3600",
        },
      }
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown booking search error";

    return NextResponse.json(
      {
        success: false,
        message,
        _booking_engine: {
          cached: false,
          source: "next_proxy_exception",
        },
      },
      { status: 500 }
    );
  }
}
