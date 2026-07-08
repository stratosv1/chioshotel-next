import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RawRecord = Record<string, unknown>;

type NormalizedBooking = {
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
  source: string | null;
  referrer_label: string | null;
  raw_booking: unknown;
  price: number | null;
};

function unauthorized() {
  return new NextResponse("Unauthorized", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Staff Calendar"',
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

    const username = decoded.slice(0, separatorIndex);
    const password = decoded.slice(separatorIndex + 1);

    return username === expectedUser && password === expectedPass;
  } catch {
    return false;
  }
}

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

function makeDays(start: string, end: string) {
  const days: string[] = [];
  const current = parseDate(start);
  const last = parseDate(end);

  while (current <= last) {
    days.push(isoDateOnly(current));
    current.setDate(current.getDate() + 1);
  }

  return days;
}

function safeDateParam(value: string | null, fallback: string) {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return fallback;
  return value;
}

function isCanceledStatus(status: unknown) {
  const value = String(status || "").toLowerCase();
  return value.includes("cancel") || value.includes("deleted");
}

function bookingCoversDate(booking: any, date: string) {
  if (isCanceledStatus(booking.status)) return false;
  return booking.arrival <= date && booking.departure > date;
}

function extractBookingArray(payload: unknown) {
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

function buildStableBookingId(row: RawRecord, roomId: string, unitId: string, arrival: string, departure: string) {
  const explicitId = text(
    getValue(row, [
      "booking_id",
      "booking id",
      "beds24_booking_id",
      "beds24 booking id",
      "id",
      "bookId",
      "book id",
      "reservation_id",
      "reservation id",
    ]),
  );

  if (explicitId) return explicitId;

  const guest = text(getValue(row, ["guest_name", "guest name", "guest", "name", "customer", "client"]));
  return `sheet-${roomId}-${unitId}-${arrival}-${departure}-${guest}`
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function normalizeSheetBooking(row: RawRecord): NormalizedBooking | null {
  const arrival = normalizeDate(
    getValue(row, ["arrival", "checkin", "check in", "check_in", "start", "start date", "from", "date from"]),
  );
  const departure = normalizeDate(
    getValue(row, ["departure", "checkout", "check out", "check_out", "end", "end date", "to", "date to"]),
  );

  if (!arrival || !departure) return null;

  const rawRoom = text(getValue(row, ["room_id", "room id", "roomid", "room", "unit", "unit name", "room name"]));
  const rawUnit = text(getValue(row, ["unit_id", "unit id", "unitid", "unit", "room", "room id"]));
  const roomId = text(rawRoom.match(/\d+/)?.[0] || rawRoom);
  const unitId = text(rawUnit.match(/\d+/)?.[0] || roomId);

  if (!roomId || !unitId) return null;

  const firstName = text(getValue(row, ["first_name", "first name", "firstname", "guest first name"]));
  const lastName = text(getValue(row, ["last_name", "last name", "lastname", "guest last name"]));
  const guestName =
    text(getValue(row, ["guest_name", "guest name", "guest", "name", "customer", "client"])) ||
    [firstName, lastName].filter(Boolean).join(" ").trim() ||
    null;
  const referrer = text(getValue(row, ["referrer", "referer", "channel", "source", "platform", "ota"])) || "occupancy-sheet";

  return {
    booking_id: buildStableBookingId(row, roomId, unitId, arrival, departure),
    book_id: text(getValue(row, ["book_id", "book id", "bookId"])) || null,
    room_id: roomId,
    unit_id: unitId,
    guest_name: guestName,
    first_name: firstName || null,
    last_name: lastName || null,
    email: text(getValue(row, ["email", "guest email"])) || null,
    phone: text(getValue(row, ["phone", "telephone", "guest phone"])) || null,
    mobile: text(getValue(row, ["mobile", "cell", "guest mobile"])) || null,
    num_adult: numberOrNull(getValue(row, ["num_adult", "adults", "adult", "persons", "pax"])),
    num_child: numberOrNull(getValue(row, ["num_child", "children", "child", "kids"])),
    arrival,
    departure,
    status: text(getValue(row, ["status", "booking status"])) || "confirmed",
    referrer,
    channel: referrer,
    source: "occupancy-sheet",
    referrer_label: referrer,
    raw_booking: row,
    price: numberOrNull(getValue(row, ["price", "total", "amount", "value"])),
  };
}

async function fetchOccupancySheetBookings(start: string, end: string) {
  const scriptUrl = text(process.env.OCCUPANCY_SCRIPT_URL);
  if (!scriptUrl) return { bookings: [] as NormalizedBooking[], error: "" };

  try {
    const url = new URL(scriptUrl);
    url.searchParams.set("start", start);
    url.searchParams.set("end", end);

    const secret = text(process.env.OCCUPANCY_SCRIPT_SECRET);
    if (secret) url.searchParams.set("secret", secret);

    const response = await fetch(url.toString(), { cache: "no-store" });
    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      return {
        bookings: [] as NormalizedBooking[],
        error: `Occupancy sheet error ${response.status}: ${JSON.stringify(payload).slice(0, 300)}`,
      };
    }

    const rows = extractBookingArray(payload);
    const bookings = rows
      .map((row) => normalizeSheetBooking(row))
      .filter((booking): booking is NormalizedBooking => Boolean(booking))
      .filter((booking) => booking.arrival <= end && booking.departure >= start);

    return { bookings, error: "" };
  } catch (error) {
    return {
      bookings: [] as NormalizedBooking[],
      error: error instanceof Error ? error.message : "Unknown occupancy sheet error.",
    };
  }
}

function mergeBookings(primary: NormalizedBooking[], fallback: any[]) {
  const map = new Map<string, NormalizedBooking>();

  for (const booking of primary) {
    map.set(String(booking.booking_id), booking);
  }

  for (const row of fallback) {
    const booking: NormalizedBooking = {
      booking_id: String(row.booking_id),
      book_id: row.book_id ? String(row.book_id) : null,
      room_id: String(row.room_id),
      unit_id: String(row.unit_id),
      guest_name: row.guest_name ?? null,
      first_name: row.first_name ?? null,
      last_name: row.last_name ?? null,
      email: row.email ?? null,
      phone: row.phone ?? null,
      mobile: row.mobile ?? null,
      num_adult: row.num_adult ?? null,
      num_child: row.num_child ?? null,
      arrival: String(row.arrival),
      departure: String(row.departure),
      status: row.status ?? null,
      referrer: row.referrer ?? null,
      channel: row.channel ?? null,
      source: row.source ?? null,
      referrer_label: row.referrer_label ?? row.referrer ?? row.channel ?? row.source ?? null,
      raw_booking: row.raw_booking,
      price: row.price ?? null,
    };

    const key = String(booking.booking_id);
    if (!map.has(key)) map.set(key, booking);
  }

  return Array.from(map.values()).sort((a, b) =>
    `${a.arrival}-${a.room_id}-${a.unit_id}`.localeCompare(`${b.arrival}-${b.room_id}-${b.unit_id}`),
  );
}

export async function GET(request: NextRequest) {
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

  const today = new Date();
  const defaultStart = isoDateOnly(new Date(today.getFullYear(), today.getMonth(), 1));
  const defaultEnd = isoDateOnly(new Date(today.getFullYear(), today.getMonth() + 1, 0));

  const { searchParams } = new URL(request.url);
  const start = safeDateParam(searchParams.get("start"), defaultStart);
  const end = safeDateParam(searchParams.get("end"), defaultEnd);

  const sql = neon(databaseUrl);

  try {
    const units = await sql`
      select
        room_id::text as room_id,
        unit_id::text as unit_id,
        label as display_name,
        room_name as category,
        location as floor,
        max_guests,
        id::int as sort_order
      from staff_units
      where is_active = true
      order by id asc
    `;

    let availability = await sql`
      select
        stay_date::text as date,
        room_id::text as room_id,
        unit_id::text as unit_id,
        price,
        available,
        reason
      from staff_availability_calendar
      where stay_date >= ${start}::date
        and stay_date <= ${end}::date
      order by stay_date asc, room_id::int, unit_id::int
    `;

    const snapshotBookings = await sql`
      select
        beds24_booking_id::text as booking_id,
        book_id::text as book_id,
        room_id::text as room_id,
        unit_id::text as unit_id,
        guest_name,
        first_name,
        last_name,
        email,
        phone,
        mobile,
        num_adult,
        num_child,
        arrival::text as arrival,
        departure::text as departure,
        status,
        referrer,
        channel,
        source,
        coalesce(referrer, channel, source) as referrer_label,
        raw_booking,
        null::numeric as price
      from staff_bookings_snapshot
      where arrival <= ${end}::date
        and departure >= ${start}::date
      order by arrival asc, room_id::int, unit_id::int
    `;

    const occupancyResult = await fetchOccupancySheetBookings(start, end);
    const bookings = mergeBookings(occupancyResult.bookings, snapshotBookings as any[]);

    if (availability.length === 0) {
      const rates = await sql`
        select
          room_id::text as room_id,
          stay_date::text as date,
          price
        from staff_rate_cache
        where stay_date >= ${start}::date
          and stay_date <= ${end}::date
        order by stay_date asc, room_id::text asc
      `;

      const rateMap = new Map<string, number>();

      for (const rate of rates as any[]) {
        rateMap.set(`${rate.room_id}:${rate.date}`, Number(rate.price || 0));
      }

      const days = makeDays(start, end);
      const generatedAvailability: any[] = [];

      for (const unit of units as any[]) {
        for (const day of days) {
          const price = rateMap.get(`${unit.room_id}:${day}`) ?? null;
          const booked = bookings.some(
            (booking) =>
              String(booking.room_id) === String(unit.room_id) &&
              String(booking.unit_id) === String(unit.unit_id) &&
              bookingCoversDate(booking, day),
          );

          generatedAvailability.push({
            date: day,
            room_id: String(unit.room_id),
            unit_id: String(unit.unit_id),
            price,
            available: !booked && Number(price || 0) > 0,
            reason: booked ? "BOOKED" : Number(price || 0) > 0 ? null : "NO_PRICE",
          });
        }
      }

      availability = generatedAvailability as any;
    }

    return NextResponse.json(
      {
        ok: true,
        range: { start, end },
        units,
        availability,
        bookings,
        sources: {
          occupancySheet: {
            enabled: Boolean(text(process.env.OCCUPANCY_SCRIPT_URL)),
            bookings: occupancyResult.bookings.length,
            error: occupancyResult.error || null,
          },
          snapshot: {
            bookings: (snapshotBookings as any[]).length,
          },
        },
        generatedAt: new Date().toISOString(),
      },
      {
        headers: {
          "X-Robots-Tag": "noindex, nofollow",
          "Cache-Control": "no-store",
        },
      },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown calendar API error.";

    return NextResponse.json(
      {
        ok: false,
        error: message,
        range: { start, end },
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
