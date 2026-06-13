import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

type Beds24TokenResponse = {
  token?: string;
  expiresIn?: number;
  refreshToken?: string;
  [key: string]: unknown;
};

type Beds24BookingResponse = unknown;

type RoomMapping = {
  roomId: number;
  unitId: number;
  label: string;
  categoryLabel: string;
};

const beds24BaseUrl = "https://beds24.com/api/v2";

const roomMappings: RoomMapping[] = [
  { roomId: 267788, unitId: 1, label: "Room 1", categoryLabel: "First Floor" },
  { roomId: 268803, unitId: 1, label: "Room 2", categoryLabel: "Economy" },
  { roomId: 267788, unitId: 2, label: "Room 3", categoryLabel: "First Floor" },
  { roomId: 267788, unitId: 3, label: "Room 4", categoryLabel: "First Floor" },
  { roomId: 626129, unitId: 1, label: "Room 5", categoryLabel: "Ground Floor" },
  { roomId: 268803, unitId: 2, label: "Room 6", categoryLabel: "Economy" },
  { roomId: 626129, unitId: 2, label: "Room 7", categoryLabel: "Ground Floor" },
  { roomId: 265595, unitId: 1, label: "Apartment 8", categoryLabel: "Family Apartment" },
  { roomId: 265595, unitId: 2, label: "Apartment 9", categoryLabel: "Family Apartment" },
  { roomId: 265595, unitId: 3, label: "Apartment 10", categoryLabel: "Family Apartment" },
];

function noStoreHeaders() {
  return {
    "Cache-Control": "no-store, no-cache, must-revalidate",
    "X-Robots-Tag": "noindex, nofollow",
  };
}

function unauthorized() {
  return new NextResponse(JSON.stringify({ message: "Unauthorized" }), {
    status: 401,
    headers: {
      ...noStoreHeaders(),
      "Content-Type": "application/json",
      "WWW-Authenticate": 'Basic realm="Voulamandis Staff"',
    },
  });
}

function isAuthorized(request: NextRequest) {
  const username = process.env.STAFF_USERNAME;
  const password = process.env.STAFF_PASSWORD;

  if (!username || !password) {
    return false;
  }

  const header = request.headers.get("authorization");

  if (!header?.startsWith("Basic ")) {
    return false;
  }

  try {
    const decoded = Buffer.from(header.slice(6), "base64").toString("utf8");
    const separatorIndex = decoded.indexOf(":");

    if (separatorIndex === -1) {
      return false;
    }

    const providedUsername = decoded.slice(0, separatorIndex);
    const providedPassword = decoded.slice(separatorIndex + 1);

    return providedUsername === username && providedPassword === password;
  } catch {
    return false;
  }
}

function jsonResponse(data: unknown, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: noStoreHeaders(),
  });
}

function cleanString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function cleanNumber(value: unknown, fallback: number) {
  const numberValue = Number(value);

  if (!Number.isFinite(numberValue)) {
    return fallback;
  }

  return numberValue;
}

function isValidDate(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function nightsBetween(arrival: string, departure: string) {
  const start = new Date(`${arrival}T00:00:00Z`).getTime();
  const end = new Date(`${departure}T00:00:00Z`).getTime();

  if (!Number.isFinite(start) || !Number.isFinite(end)) {
    return 0;
  }

  return Math.round((end - start) / 86400000);
}

function findRoom(roomId: number, unitId: number) {
  return roomMappings.find((room) => room.roomId === roomId && room.unitId === unitId);
}

async function exchangeInviteCode() {
  const inviteCode = process.env.BEDS24_INVITE_CODE;

  if (!inviteCode) {
    throw new Error("Missing BEDS24_REFRESH_TOKEN or BEDS24_INVITE_CODE.");
  }

  const response = await fetch(`${beds24BaseUrl}/authentication/setup`, {
    method: "GET",
    headers: {
      accept: "application/json",
      code: inviteCode,
    },
    cache: "no-store",
  });

  const data = (await response.json().catch(() => null)) as Beds24TokenResponse | null;

  if (!response.ok || !data?.refreshToken) {
    throw new Error(`Beds24 invite code exchange failed: ${response.status}`);
  }

  return data.refreshToken;
}

async function getAccessToken() {
  let refreshToken = process.env.BEDS24_REFRESH_TOKEN;

  if (!refreshToken) {
    refreshToken = await exchangeInviteCode();
  }

  const response = await fetch(`${beds24BaseUrl}/authentication/token`, {
    method: "GET",
    headers: {
      accept: "application/json",
      refreshToken,
    },
    cache: "no-store",
  });

  const data = (await response.json().catch(() => null)) as Beds24TokenResponse | null;

  if (!response.ok || !data?.token) {
    throw new Error(`Beds24 token request failed: ${response.status}`);
  }

  return data.token;
}

function extractBookingId(result: Beds24BookingResponse): string | number | null {
  const paths: Array<Array<string | number>> = [
    ["id"],
    ["bookId"],
    [0, "id"],
    [0, "bookId"],
    ["new", "id"],
    ["new", 0, "id"],
    ["result", 0, "new", "id"],
    ["result", 0, "info", 0, "id"],
    [0, "new", "id"],
    [0, "info", 0, "id"],
    ["data", 0, "id"],
    ["bookings", 0, "id"],
  ];

  for (const path of paths) {
    let value: unknown = result;
    let found = true;

    for (const segment of path) {
      if (
        value !== null &&
        typeof value === "object" &&
        segment in value
      ) {
        value = (value as Record<string | number, unknown>)[segment];
      } else {
        found = false;
        break;
      }
    }

    if (found && value !== null && value !== "") {
      return value as string | number;
    }
  }

  return null;
}

function extractReference(result: Beds24BookingResponse): string | null {
  if (!result || typeof result !== "object") {
    return null;
  }

  const record = result as Record<string, unknown>;

  if (typeof record.reference === "string") {
    return record.reference;
  }

  if (typeof record.bookingReference === "string") {
    return record.bookingReference;
  }

  if (Array.isArray(result) && result[0] && typeof result[0] === "object") {
    const first = result[0] as Record<string, unknown>;

    if (typeof first.reference === "string") {
      return first.reference;
    }
  }

  return null;
}

function makeGuestMessage(params: {
  room: RoomMapping;
  arrival: string;
  departure: string;
  nights: number;
  adults: number;
  children: number;
  price: number | null;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}) {
  const ratePerDay = params.price !== null && params.nights > 0
    ? (params.price / params.nights).toFixed(2)
    : null;

  const lines = [
    "Thank you for your booking at Voulamandis House.",
    "Your trip to Chios has just begun!",
    "",
    `Room type: ${params.room.categoryLabel || params.room.label}`,
    `Check-in: ${params.arrival}`,
    `Check-out: ${params.departure}`,
    `Number of nights: ${params.nights}`,
    `Number of adults: ${params.adults}`,
    `Number of children: ${params.children}`,
  ];

  if (ratePerDay) {
    lines.push(`Rate per day: ${ratePerDay} EUR`);
  }

  lines.push(`Name: ${params.firstName}`);
  lines.push(`Surname: ${params.lastName}`);

  if (params.email) {
    lines.push(`Email: ${params.email}`);
  }

  if (params.phone) {
    lines.push(`Telephone: ${params.phone}`);
  }

  lines.push("");
  lines.push("Please confirm that everything from the above is right.");

  return lines.join("\n");
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return unauthorized();
  }

  return jsonResponse({
    rooms: roomMappings,
    hasPropertyId: Boolean(process.env.BEDS24_PROPERTY_ID),
    hasRefreshToken: Boolean(process.env.BEDS24_REFRESH_TOKEN),
    hasInviteCode: Boolean(process.env.BEDS24_INVITE_CODE),
    viberLink: process.env.BEDS24_VIBER_LINK || "",
  });
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return unauthorized();
  }

  try {
    const body = await request.json();

    const propertyId = Number(process.env.BEDS24_PROPERTY_ID || 0);
    const roomId = cleanNumber(body.roomId, 0);
    const unitId = cleanNumber(body.unitId, 0);
    const room = findRoom(roomId, unitId);

    const arrival = cleanString(body.arrival);
    const departure = cleanString(body.departure);
    const title = cleanString(body.title) || "Mr";
    const firstName = cleanString(body.firstName);
    const lastName = cleanString(body.lastName);
    const email = cleanString(body.email);
    const mobile = cleanString(body.mobile);
    const phone = cleanString(body.phone);
    const language = cleanString(body.language) || "en";
    const adults = Math.max(1, cleanNumber(body.adults, 1));
    const children = Math.max(0, cleanNumber(body.children, 0));
    const priceRaw = body.price === "" || body.price === null || typeof body.price === "undefined"
      ? null
      : cleanNumber(body.price, NaN);
    const price = priceRaw === null || !Number.isFinite(priceRaw) ? null : priceRaw;
    const comments = cleanString(body.comments);
    const notes = cleanString(body.notes);
    const referrer = cleanString(body.referrer) || "Staff Direct";

    if (!propertyId) {
      return jsonResponse({ message: "Missing BEDS24_PROPERTY_ID." }, 500);
    }

    if (!room) {
      return jsonResponse({ message: "Invalid room or unit." }, 400);
    }

    if (!isValidDate(arrival) || !isValidDate(departure)) {
      return jsonResponse({ message: "Dates must be YYYY-MM-DD." }, 400);
    }

    const nights = nightsBetween(arrival, departure);

    if (nights <= 0) {
      return jsonResponse({ message: "Departure must be after arrival." }, 400);
    }

    if (!firstName || !lastName) {
      return jsonResponse({ message: "First name and last name are required." }, 400);
    }

    const payload = {
      propertyId,
      status: "confirmed",
      roomId,
      unitId,
      title,
      firstName,
      lastName,
      email,
      mobile,
      phone,
      language,
      arrival,
      departure,
      numAdult: adults,
      numChild: children,
      message: comments,
      notes,
      price,
      nights,
      apiMessage: "Voulamandis Staff Vercel Booker",
      refererEditable: referrer,
    };

    const cleanedPayload = Object.fromEntries(
      Object.entries(payload).filter(([, value]) => value !== null && value !== "")
    );

    const token = await getAccessToken();

    const response = await fetch(`${beds24BaseUrl}/bookings`, {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        token,
      },
      body: JSON.stringify([cleanedPayload]),
      cache: "no-store",
    });

    const result = (await response.json().catch(() => null)) as Beds24BookingResponse;

    if (!response.ok) {
      return jsonResponse(
        {
          message: `Beds24 returned error ${response.status}.`,
          details: result,
        },
        400
      );
    }

    const bookingId = extractBookingId(result);
    const reference = extractReference(result);

    if (!bookingId) {
      return jsonResponse(
        {
          message: "Beds24 did not return a booking id.",
          raw: result,
        },
        502
      );
    }

    const customerPhone = mobile || phone;
    const customerPhoneDigits = customerPhone.replace(/\D+/g, "");
    const guestMessage = makeGuestMessage({
      room,
      arrival,
      departure,
      nights,
      adults,
      children,
      price,
      firstName,
      lastName,
      email,
      phone: customerPhone,
    });

    const whatsappUrl = customerPhoneDigits
      ? `https://wa.me/${customerPhoneDigits}?text=${encodeURIComponent(guestMessage)}`
      : "";

    return jsonResponse({
      message: "Booking created successfully.",
      bookingId,
      reference,
      roomLabel: room.label,
      categoryLabel: room.categoryLabel,
      raw: result,
      whatsappUrl,
      viberMessage: guestMessage,
      viberLink: process.env.BEDS24_VIBER_LINK || "",
      customerPhone: customerPhoneDigits,
    });
  } catch (error) {
    return jsonResponse(
      {
        message: error instanceof Error ? error.message : "Unknown booking error.",
      },
      500
    );
  }
}
