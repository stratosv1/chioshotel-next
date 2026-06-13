import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Beds24Booking = Record<string, unknown>;

function unauthorized() {
  return new NextResponse("Unauthorized", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Staff Calendar Sync"',
      "X-Robots-Tag": "noindex, nofollow",
      "Cache-Control": "no-store",
    },
  });
}

function isAuthorized(request: NextRequest) {
  const expectedUser = process.env.STAFF_USERNAME;
  const expectedPass = process.env.STAFF_PASSWORD;

  if (!expectedUser || !expectedPass) return false;

  const auth = request.headers.get("authorization");
  if (!auth?.startsWith("Basic ")) return false;

  try {
    const decoded = Buffer.from(auth.slice(6), "base64").toString("utf8");
    const separatorIndex = decoded.indexOf(":");
    if (separatorIndex === -1) return false;

    return (
      decoded.slice(0, separatorIndex) === expectedUser &&
      decoded.slice(separatorIndex + 1) === expectedPass
    );
  } catch {
    return false;
  }
}

function text(value: unknown) {
  if (value === null || value === undefined) return "";
  return String(value).trim();
}

function pick(booking: Beds24Booking, keys: string[]) {
  for (const key of keys) {
    const value = booking[key];
    if (value !== undefined && value !== null && text(value) !== "") return value;
  }
  return "";
}

function numberOrNull(value: unknown) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function isoDateOnly(value: Date) {
  return value.toISOString().slice(0, 10);
}

function safeDateParam(value: string | null, fallback: string) {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return fallback;
  return value;
}

function bookingIdOf(booking: Beds24Booking) {
  return text(pick(booking, ["id", "bookingId", "bookId", "bookingID"]));
}

function firstNameOf(booking: Beds24Booking) {
  return text(pick(booking, ["firstName", "firstname", "guestFirstName"]));
}

function lastNameOf(booking: Beds24Booking) {
  return text(pick(booking, ["lastName", "lastname", "guestLastName"]));
}

function guestNameOf(booking: Beds24Booking) {
  const explicit = text(pick(booking, ["guestName", "guest", "name"]));
  if (explicit) return explicit;

  return [firstNameOf(booking), lastNameOf(booking)].filter(Boolean).join(" ").trim();
}

function arrivalOf(booking: Beds24Booking) {
  return text(pick(booking, ["arrival", "checkIn", "checkin", "startDate"]));
}

function departureOf(booking: Beds24Booking) {
  return text(pick(booking, ["departure", "checkOut", "checkout", "endDate"]));
}

function roomIdOf(booking: Beds24Booking) {
  return text(pick(booking, ["roomId", "roomid", "roomID"]));
}

function unitIdOf(booking: Beds24Booking) {
  return text(pick(booking, ["unitId", "unitid", "unitID"]));
}

function referrerOf(booking: Beds24Booking) {
  return text(
    pick(booking, [
      "refererEditable",
      "referrer",
      "referer",
      "originalReferrer",
      "channel",
      "apiSource",
      "source",
    ]),
  );
}

function statusOf(booking: Beds24Booking) {
  return text(pick(booking, ["status", "bookingStatus"]));
}

function emailOf(booking: Beds24Booking) {
  return text(pick(booking, ["email", "guestEmail"]));
}

function phoneOf(booking: Beds24Booking) {
  return text(pick(booking, ["phone", "guestPhone"]));
}

function mobileOf(booking: Beds24Booking) {
  return text(pick(booking, ["mobile", "guestMobile"]));
}

function adultsOf(booking: Beds24Booking) {
  return numberOrNull(pick(booking, ["numAdult", "adults", "adult"]));
}

function childrenOf(booking: Beds24Booking) {
  return numberOrNull(pick(booking, ["numChild", "children", "child"]));
}

async function getRefreshTokenFromInviteCode() {
  const inviteCode = text(process.env.BEDS24_INVITE_CODE);
  if (!inviteCode) return "";

  const response = await fetch("https://beds24.com/api/v2/authentication/setup", {
    method: "GET",
    headers: { code: inviteCode },
    cache: "no-store",
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      `Beds24 setup error ${response.status}: ${JSON.stringify(payload).slice(0, 500)}`,
    );
  }

  const refreshToken = text(
    (payload as { refreshToken?: unknown; refresh_token?: unknown }).refreshToken ||
      (payload as { refreshToken?: unknown; refresh_token?: unknown }).refresh_token,
  );

  if (!refreshToken) {
    throw new Error(
      `Beds24 setup response did not include refresh token: ${JSON.stringify(payload).slice(
        0,
        500,
      )}`,
    );
  }

  return refreshToken;
}

async function getBeds24RefreshToken() {
  const existingRefreshToken = text(process.env.BEDS24_REFRESH_TOKEN);
  if (existingRefreshToken) return existingRefreshToken;

  const refreshTokenFromInviteCode = await getRefreshTokenFromInviteCode();
  if (refreshTokenFromInviteCode) return refreshTokenFromInviteCode;

  throw new Error("Missing BEDS24_REFRESH_TOKEN or BEDS24_INVITE_CODE.");
}

async function getBeds24Token() {
  const refreshToken = await getBeds24RefreshToken();

  const response = await fetch("https://beds24.com/api/v2/authentication/token", {
    method: "GET",
    headers: { refreshToken },
    cache: "no-store",
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      `Beds24 token error ${response.status}: ${JSON.stringify(payload).slice(0, 500)}`,
    );
  }

  const token = text((payload as { token?: unknown }).token);
  if (!token) throw new Error("Beds24 token response did not include token.");

  return token;
}

function extractBookings(payload: unknown) {
  if (Array.isArray(payload)) return payload as Beds24Booking[];

  if (payload && typeof payload === "object") {
    const objectPayload = payload as Record<string, unknown>;

    if (Array.isArray(objectPayload.bookings)) return objectPayload.bookings as Beds24Booking[];
    if (Array.isArray(objectPayload.data)) return objectPayload.data as Beds24Booking[];
    if (Array.isArray(objectPayload.items)) return objectPayload.items as Beds24Booking[];
  }

  return [];
}

async function fetchBeds24Bookings(token: string, start: string, end: string) {
  const propertyId = text(process.env.BEDS24_PROPERTY_ID);
  if (!propertyId) throw new Error("BEDS24_PROPERTY_ID is missing.");

  const url = new URL("https://beds24.com/api/v2/bookings");
  url.searchParams.set("propertyId", propertyId);
  url.searchParams.set("arrivalFrom", start);
  url.searchParams.set("arrivalTo", end);
  url.searchParams.set("includeInvoice", "false");
  url.searchParams.set("includeInfoItems", "true");

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: { token },
    cache: "no-store",
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      `Beds24 bookings error ${response.status}: ${JSON.stringify(payload).slice(0, 500)}`,
    );
  }

  return extractBookings(payload);
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) return unauthorized();

  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    return NextResponse.json(
      { ok: false, error: "DATABASE_URL is missing." },
      {
        status: 500,
        headers: {
          "X-Robots-Tag": "noindex, nofollow",
          "Cache-Control": "no-store",
        },
      },
    );
  }

  const startedAt = Date.now();
  const today = new Date();
  const defaultStart = isoDateOnly(new Date(today.getFullYear(), today.getMonth() - 1, 1));
  const defaultEnd = isoDateOnly(new Date(today.getFullYear(), today.getMonth() + 12, 0));

  const { searchParams } = new URL(request.url);
  const start = safeDateParam(searchParams.get("start"), defaultStart);
  const end = safeDateParam(searchParams.get("end"), defaultEnd);

  const sql = neon(databaseUrl);

  const refreshRunRows = await sql`
    insert into staff_refresh_runs (run_type, status, started_at, message, details)
    values (
      'beds24_bookings_sync',
      'running',
      now(),
      'Beds24 bookings sync started',
      ${JSON.stringify({ start, end })}::jsonb
    )
    returning id
  `;

  const refreshRunId = refreshRunRows[0]?.id;

  try {
    const token = await getBeds24Token();
    const bookings = await fetchBeds24Bookings(token, start, end);

    let saved = 0;
    let skipped = 0;

    for (const booking of bookings) {
      const beds24BookingId = bookingIdOf(booking);
      const arrival = arrivalOf(booking);
      const departure = departureOf(booking);

      if (!beds24BookingId || !arrival || !departure) {
        skipped += 1;
        continue;
      }

      const referrer = referrerOf(booking);

      await sql`
        insert into staff_bookings_snapshot (
          beds24_booking_id,
          book_id,
          room_id,
          unit_id,
          arrival,
          departure,
          status,
          first_name,
          last_name,
          guest_name,
          email,
          phone,
          mobile,
          num_adult,
          num_child,
          referrer,
          channel,
          source,
          raw_booking,
          fetched_at,
          updated_at
        )
        values (
          ${beds24BookingId},
          ${text(pick(booking, ["bookId", "bookid"])) || null},
          ${roomIdOf(booking) || null},
          ${unitIdOf(booking) || null},
          ${arrival}::date,
          ${departure}::date,
          ${statusOf(booking) || null},
          ${firstNameOf(booking) || null},
          ${lastNameOf(booking) || null},
          ${guestNameOf(booking) || null},
          ${emailOf(booking) || null},
          ${phoneOf(booking) || null},
          ${mobileOf(booking) || null},
          ${adultsOf(booking)},
          ${childrenOf(booking)},
          ${referrer || null},
          ${referrer || null},
          'beds24',
          ${JSON.stringify(booking)}::jsonb,
          now(),
          now()
        )
        on conflict (beds24_booking_id)
        do update set
          book_id = excluded.book_id,
          room_id = excluded.room_id,
          unit_id = excluded.unit_id,
          arrival = excluded.arrival,
          departure = excluded.departure,
          status = excluded.status,
          first_name = excluded.first_name,
          last_name = excluded.last_name,
          guest_name = excluded.guest_name,
          email = excluded.email,
          phone = excluded.phone,
          mobile = excluded.mobile,
          num_adult = excluded.num_adult,
          num_child = excluded.num_child,
          referrer = excluded.referrer,
          channel = excluded.channel,
          source = excluded.source,
          raw_booking = excluded.raw_booking,
          fetched_at = now(),
          updated_at = now()
      `;

      saved += 1;
    }

    const durationMs = Date.now() - startedAt;

    await sql`
      update staff_refresh_runs
      set
        status = 'success',
        finished_at = now(),
        duration_ms = ${durationMs},
        message = ${`Beds24 bookings sync completed. Saved ${saved}, skipped ${skipped}.`},
        details = ${JSON.stringify({ start, end, fetched: bookings.length, saved, skipped })}::jsonb
      where id = ${refreshRunId}
    `;

    return NextResponse.json(
      {
        ok: true,
        range: { start, end },
        fetched: bookings.length,
        saved,
        skipped,
        durationMs,
      },
      {
        headers: {
          "X-Robots-Tag": "noindex, nofollow",
          "Cache-Control": "no-store",
        },
      },
    );
  } catch (error) {
    const durationMs = Date.now() - startedAt;
    const message = error instanceof Error ? error.message : "Unknown sync error.";

    await sql`
      update staff_refresh_runs
      set
        status = 'error',
        finished_at = now(),
        duration_ms = ${durationMs},
        message = ${message},
        details = ${JSON.stringify({ start, end, error: message })}::jsonb
      where id = ${refreshRunId}
    `;

    return NextResponse.json(
      {
        ok: false,
        error: message,
        range: { start, end },
        durationMs,
      },
      {
        status: 500,
        headers: {
          "X-Robots-Tag": "noindex, nofollow",
          "Cache-Control": "no-store",
        },
      },
    );
  }
}

export async function GET(request: NextRequest) {
  return POST(request);
}
