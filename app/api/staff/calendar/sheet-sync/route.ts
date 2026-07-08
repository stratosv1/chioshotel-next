import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RawRecord = Record<string, unknown>;

type SheetBooking = {
  booking_id: string;
  book_id: string | null;
  room_id: string;
  unit_id: string;
  guest_name: string | null;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone: string | null;
  mobile: string | null;
  num_adult: number | null;
  num_child: number | null;
  arrival: string;
  departure: string;
  status: string | null;
  referrer: string | null;
  channel: string | null;
  source: string;
  raw_booking: RawRecord;
};

function text(value: unknown) {
  if (value === null || value === undefined) return "";
  return String(value).trim();
}

function normalizedKey(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function getValue(row: RawRecord, aliases: string[]) {
  const aliasSet = new Set(aliases.map(normalizedKey));

  for (const [key, value] of Object.entries(row)) {
    if (aliasSet.has(normalizedKey(key)) && text(value)) return value;
  }

  return "";
}

function numberOrNull(value: unknown) {
  const parsed = Number(String(value ?? "").replace(",", "."));
  return Number.isFinite(parsed) ? parsed : null;
}

function isoDateOnly(value: Date) {
  return value.toISOString().slice(0, 10);
}

function normalizeDate(value: unknown) {
  const raw = text(value);
  if (!raw) return "";

  const iso = raw.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (iso) return `${iso[1]}-${iso[2]}-${iso[3]}`;

  const dmy = raw.match(/^(\d{1,2})[\/-](\d{1,2})[\/-](\d{2,4})$/);
  if (dmy) {
    const day = dmy[1].padStart(2, "0");
    const month = dmy[2].padStart(2, "0");
    const year = dmy[3].length === 2 ? `20${dmy[3]}` : dmy[3];
    return `${year}-${month}-${day}`;
  }

  const parsed = new Date(raw);
  if (!Number.isNaN(parsed.getTime())) return isoDateOnly(parsed);
  return "";
}

function parseDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function addDays(value: string, amount: number) {
  const date = parseDate(value);
  date.setDate(date.getDate() + amount);
  return isoDateOnly(date);
}

function safeDateParam(value: string | null, fallback: string) {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return fallback;
  return value;
}

function isCanceledStatus(status: unknown) {
  const value = String(status || "").toLowerCase();
  return value.includes("cancel") || value.includes("deleted");
}

function stableId(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
}

function isAuthorized(request: NextRequest) {
  const cronSecret = text(process.env.CRON_SECRET);
  const auth = request.headers.get("authorization");

  if (cronSecret && auth === `Bearer ${cronSecret}`) return true;

  const expectedUser = process.env.STAFF_USERNAME;
  const expectedPass = process.env.STAFF_PASSWORD;
  if (!expectedUser || !expectedPass || !auth?.startsWith("Basic ")) return false;

  try {
    const decoded = Buffer.from(auth.slice(6), "base64").toString("utf8");
    const separatorIndex = decoded.indexOf(":");
    if (separatorIndex === -1) return false;
    return decoded.slice(0, separatorIndex) === expectedUser && decoded.slice(separatorIndex + 1) === expectedPass;
  } catch {
    return false;
  }
}

function unauthorized() {
  return new NextResponse("Unauthorized", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Staff Calendar Sheet Sync"',
      "X-Robots-Tag": "noindex, nofollow",
      "Cache-Control": "no-store",
    },
  });
}

function extractRows(payload: unknown) {
  if (Array.isArray(payload)) return payload as RawRecord[];

  if (payload && typeof payload === "object") {
    const objectPayload = payload as Record<string, unknown>;
    for (const key of ["bookings", "occupancy", "data", "items", "rows", "values"]) {
      const value = objectPayload[key];
      if (Array.isArray(value)) return value as RawRecord[];
    }
  }

  return [];
}

function rowIsBookedNight(row: RawRecord) {
  const available = text(getValue(row, ["available"])).toUpperCase();
  const reason = text(getValue(row, ["reason"])).toUpperCase();
  const bookingId = text(getValue(row, ["bookingId", "booking id", "booking_id", "bookId", "book id"]));
  return Boolean(bookingId) || available === "NO" || reason === "BOOKED";
}

function bookingFromGroup(row: RawRecord, roomId: string, unitId: string, bookingId: string, arrival: string, departure: string): SheetBooking {
  const firstName = text(getValue(row, ["first_name", "first name", "firstname", "guest first name"]));
  const lastName = text(getValue(row, ["last_name", "last name", "lastname", "guest last name"]));
  const guestName =
    text(getValue(row, ["guest", "guest_name", "guest name", "name", "customer", "client"])) ||
    [firstName, lastName].filter(Boolean).join(" ").trim() ||
    null;
  const referrer = text(getValue(row, ["referrer", "referer", "channel", "source", "platform", "ota"])) || "occupancy-sheet";

  return {
    booking_id: bookingId,
    book_id: bookingId,
    room_id: roomId,
    unit_id: unitId,
    guest_name: guestName,
    first_name: firstName || null,
    last_name: lastName || null,
    email: text(getValue(row, ["email", "guestEmail", "guest email"])) || null,
    phone: text(getValue(row, ["phone", "guestPhone", "guest phone", "telephone"])) || null,
    mobile: text(getValue(row, ["mobile", "guestMobile", "guest mobile", "phone"])) || null,
    num_adult: numberOrNull(getValue(row, ["numAdult", "num_adult", "adults", "adult"])),
    num_child: numberOrNull(getValue(row, ["numChild", "num_child", "children", "child"])),
    arrival,
    departure,
    status: text(getValue(row, ["status", "booking status"])) || "confirmed",
    referrer,
    channel: referrer,
    source: "occupancy-sheet",
    raw_booking: row,
  };
}

function normalizeAvailabilityRowsToBookings(rows: RawRecord[]) {
  const bookedRows = rows
    .map((row) => {
      const date = normalizeDate(getValue(row, ["date", "stay_date", "stay date", "day"]));
      const roomId = text(getValue(row, ["roomId", "room_id", "room id", "roomid"]));
      const unitId = text(getValue(row, ["unitId", "unit_id", "unit id", "unitid"]));
      const status = text(getValue(row, ["status"]));

      if (!date || !roomId || !unitId || isCanceledStatus(status) || !rowIsBookedNight(row)) return null;

      const bookingId = text(getValue(row, ["bookingId", "booking id", "booking_id", "bookId", "book id"])) ||
        stableId(`sheet-night-${roomId}-${unitId}-${date}-${text(getValue(row, ["guest", "guest_name", "guest name"]))}`);

      return { row, date, roomId, unitId, bookingId };
    })
    .filter((item): item is { row: RawRecord; date: string; roomId: string; unitId: string; bookingId: string } => Boolean(item))
    .sort((a, b) => `${a.bookingId}-${a.date}`.localeCompare(`${b.bookingId}-${b.date}`));

  const groups = new Map<string, { row: RawRecord; dates: string[]; roomId: string; unitId: string; bookingId: string }>();

  for (const item of bookedRows) {
    const key = `${item.bookingId}|${item.roomId}|${item.unitId}`;
    const group = groups.get(key) || { row: item.row, dates: [], roomId: item.roomId, unitId: item.unitId, bookingId: item.bookingId };
    group.dates.push(item.date);
    groups.set(key, group);
  }

  const bookings: SheetBooking[] = [];

  for (const group of groups.values()) {
    const uniqueDates = Array.from(new Set(group.dates)).sort();
    if (!uniqueDates.length) continue;

    let segmentStart = uniqueDates[0];
    let previous = uniqueDates[0];

    function pushSegment(start: string, lastNight: string) {
      bookings.push(bookingFromGroup(group.row, group.roomId, group.unitId, group.bookingId, start, addDays(lastNight, 1)));
    }

    for (let i = 1; i < uniqueDates.length; i += 1) {
      const expectedNext = addDays(previous, 1);
      if (uniqueDates[i] !== expectedNext) {
        pushSegment(segmentStart, previous);
        segmentStart = uniqueDates[i];
      }
      previous = uniqueDates[i];
    }

    pushSegment(segmentStart, previous);
  }

  return bookings;
}

async function fetchSheetRows(start: string, end: string) {
  const scriptUrl = text(process.env.OCCUPANCY_SCRIPT_URL);
  if (!scriptUrl) throw new Error("OCCUPANCY_SCRIPT_URL is missing.");

  const url = new URL(scriptUrl);
  url.searchParams.set("action", "bookings");
  url.searchParams.set("start", start);
  url.searchParams.set("end", end);

  const secret = text(process.env.OCCUPANCY_SCRIPT_SECRET);
  if (secret) url.searchParams.set("secret", secret);

  const response = await fetch(url.toString(), { cache: "no-store" });
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(`Occupancy sheet error ${response.status}: ${JSON.stringify(payload).slice(0, 500)}`);
  }

  return extractRows(payload);
}

async function syncSheetToNeon(request: NextRequest) {
  if (!isAuthorized(request)) return unauthorized();

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    return NextResponse.json({ ok: false, error: "DATABASE_URL is missing." }, { status: 500 });
  }

  const today = new Date();
  const defaultStart = isoDateOnly(new Date(today.getFullYear(), today.getMonth() - 2, 1));
  const defaultEnd = isoDateOnly(new Date(today.getFullYear(), today.getMonth() + 13, 0));
  const { searchParams } = new URL(request.url);
  const start = safeDateParam(searchParams.get("start"), defaultStart);
  const end = safeDateParam(searchParams.get("end"), defaultEnd);
  const startedAt = Date.now();

  const rows = await fetchSheetRows(start, end);
  const bookings = normalizeAvailabilityRowsToBookings(rows).filter((booking) => booking.arrival <= end && booking.departure >= start);
  const ids = bookings.map((booking) => booking.booking_id);
  const sql = neon(databaseUrl);

  await sql`delete from staff_bookings_snapshot where source = 'occupancy-sheet' and arrival <= ${end}::date and departure >= ${start}::date`;

  let saved = 0;
  for (const booking of bookings) {
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
        ${booking.booking_id},
        ${booking.book_id},
        ${booking.room_id},
        ${booking.unit_id},
        ${booking.arrival}::date,
        ${booking.departure}::date,
        ${booking.status},
        ${booking.first_name},
        ${booking.last_name},
        ${booking.guest_name},
        ${booking.email},
        ${booking.phone},
        ${booking.mobile},
        ${booking.num_adult},
        ${booking.num_child},
        ${booking.referrer},
        ${booking.channel},
        ${booking.source},
        ${JSON.stringify(booking.raw_booking)}::jsonb,
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

  return NextResponse.json(
    {
      ok: true,
      range: { start, end },
      rows: rows.length,
      fetched: bookings.length,
      saved,
      ids,
      durationMs: Date.now() - startedAt,
      generatedAt: new Date().toISOString(),
    },
    {
      headers: {
        "X-Robots-Tag": "noindex, nofollow",
        "Cache-Control": "no-store",
      },
    },
  );
}

export async function GET(request: NextRequest) {
  return syncSheetToNeon(request);
}

export async function POST(request: NextRequest) {
  return syncSheetToNeon(request);
}
