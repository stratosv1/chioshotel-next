import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type AnyRow = Record<string, any>;

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
    return decoded.slice(0, separatorIndex) === expectedUser && decoded.slice(separatorIndex + 1) === expectedPass;
  } catch {
    return false;
  }
}

function isoDateOnly(value: Date) {
  return value.toISOString().slice(0, 10);
}

function safeDateParam(value: string | null, fallback: string) {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return fallback;
  return value;
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

function isCancelledStatus(status: unknown) {
  const value = String(status || "").toLowerCase();
  return value.includes("cancel") || value.includes("deleted");
}

function bookingCoversDate(booking: AnyRow, date: string) {
  if (isCancelledStatus(booking.status)) return false;
  return String(booking.arrival) <= date && String(booking.departure) > date;
}

function isBookedAvailability(row: AnyRow) {
  const reason = String(row.reason || "").toUpperCase();
  return row.available === false && (reason.includes("BOOKED") || reason.includes("OCCUPIED") || reason.includes("RESERVED"));
}

function normalizeBookingUnits(bookings: AnyRow[], units: AnyRow[]) {
  const exactKeys = new Set(units.map((unit) => `${unit.room_id}:${unit.unit_id}`));
  const unitsByRoom = new Map<string, AnyRow[]>();

  for (const unit of units) {
    const roomId = String(unit.room_id);
    const list = unitsByRoom.get(roomId) || [];
    list.push(unit);
    unitsByRoom.set(roomId, list);
  }

  return bookings.map((booking) => {
    const roomId = String(booking.room_id || "");
    const unitId = String(booking.unit_id || "");
    if (exactKeys.has(`${roomId}:${unitId}`)) return booking;

    const roomUnits = unitsByRoom.get(roomId) || [];
    if (roomUnits.length === 1) {
      return { ...booking, unit_id: String(roomUnits[0].unit_id) };
    }

    return booking;
  });
}

function buildAvailabilityFallbackBookings(availability: AnyRow[], bookings: AnyRow[], units: AnyRow[]) {
  const knownKeys = new Set(units.map((unit) => `${unit.room_id}:${unit.unit_id}`));
  const uncovered = availability
    .filter(isBookedAvailability)
    .map((row) => ({ ...row, room_id: String(row.room_id), unit_id: String(row.unit_id), date: String(row.date) }))
    .filter((row) => knownKeys.has(`${row.room_id}:${row.unit_id}`))
    .filter(
      (row) =>
        !bookings.some(
          (booking) =>
            String(booking.room_id) === row.room_id &&
            String(booking.unit_id) === row.unit_id &&
            bookingCoversDate(booking, row.date),
        ),
    )
    .sort((a, b) => `${a.room_id}:${a.unit_id}:${a.date}`.localeCompare(`${b.room_id}:${b.unit_id}:${b.date}`));

  const groups = new Map<string, string[]>();
  for (const row of uncovered) {
    const key = `${row.room_id}:${row.unit_id}`;
    const dates = groups.get(key) || [];
    dates.push(row.date);
    groups.set(key, dates);
  }

  const fallback: AnyRow[] = [];
  for (const [key, rawDates] of groups) {
    const [roomId, unitId] = key.split(":");
    const dates = Array.from(new Set(rawDates)).sort();
    if (!dates.length) continue;

    let segmentStart = dates[0];
    let previous = dates[0];

    const pushSegment = (startDate: string, lastNight: string) => {
      fallback.push({
        booking_id: `availability-${roomId}-${unitId}-${startDate}`,
        book_id: null,
        room_id: roomId,
        unit_id: unitId,
        guest_name: "Κατειλημμένο — Beds24",
        first_name: null,
        last_name: null,
        email: null,
        phone: null,
        mobile: null,
        num_adult: null,
        num_child: null,
        arrival: startDate,
        departure: addDays(lastNight, 1),
        status: "confirmed",
        referrer: "Beds24",
        channel: "Beds24",
        source: "availability-calendar",
        referrer_label: "Beds24",
        raw_booking: { fallback: true, reason: "BOOKED availability without matching snapshot row" },
        price: null,
        tax_total: null,
        room_charge_total: null,
        rate_description: null,
        charge_lines: [],
      });
    };

    for (let index = 1; index < dates.length; index += 1) {
      if (dates[index] !== addDays(previous, 1)) {
        pushSegment(segmentStart, previous);
        segmentStart = dates[index];
      }
      previous = dates[index];
    }

    pushSegment(segmentStart, previous);
  }

  return fallback;
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

    const bookingRows = await sql`
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
        case
          when source = 'occupancy-sheet' and coalesce(raw_booking->>'bookingTotal', '') ~ '^-?[0-9]+(\.[0-9]+)?$' then (raw_booking->>'bookingTotal')::numeric
          when source = 'beds24' and coalesce(raw_booking->>'price', '') ~ '^-?[0-9]+(\.[0-9]+)?$' then (raw_booking->>'price')::numeric
          else null::numeric
        end as price,
        case
          when source = 'occupancy-sheet' and coalesce(raw_booking->>'taxTotal', '') ~ '^-?[0-9]+(\.[0-9]+)?$' then (raw_booking->>'taxTotal')::numeric
          when source = 'beds24' and coalesce(raw_booking->>'tax', '') ~ '^-?[0-9]+(\.[0-9]+)?$' then (raw_booking->>'tax')::numeric
          else null::numeric
        end as tax_total,
        case
          when source = 'occupancy-sheet' and coalesce(raw_booking->>'roomChargeTotal', '') ~ '^-?[0-9]+(\.[0-9]+)?$' then (raw_booking->>'roomChargeTotal')::numeric
          when source = 'beds24' and coalesce(raw_booking->>'price', '') ~ '^-?[0-9]+(\.[0-9]+)?$' and coalesce(raw_booking->>'tax', '') ~ '^-?[0-9]+(\.[0-9]+)?$' then (raw_booking->>'price')::numeric - (raw_booking->>'tax')::numeric
          else null::numeric
        end as room_charge_total,
        coalesce(raw_booking->>'rateDescription', raw_booking->>'rate_description') as rate_description,
        coalesce(raw_booking->>'bookingChargeLines', raw_booking->>'charges', '[]')::jsonb as charge_lines
      from staff_bookings_snapshot
      where arrival <= ${end}::date
        and departure > ${start}::date
      order by arrival asc, room_id::int, unit_id::int
    `;

    let bookings = normalizeBookingUnits(bookingRows as AnyRow[], units as AnyRow[]);
    const fallbackBookings = buildAvailabilityFallbackBookings(availability as AnyRow[], bookings, units as AnyRow[]);
    bookings = [...bookings, ...fallbackBookings].sort((a, b) =>
      `${a.arrival}:${a.room_id}:${a.unit_id}`.localeCompare(`${b.arrival}:${b.room_id}:${b.unit_id}`),
    );

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
      for (const rate of rates as AnyRow[]) {
        rateMap.set(`${rate.room_id}:${rate.date}`, Number(rate.price || 0));
      }

      const days = makeDays(start, end);
      const generatedAvailability: AnyRow[] = [];

      for (const unit of units as AnyRow[]) {
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

    const occupancySheetBookings = bookings.filter((booking) => booking.source === "occupancy-sheet").length;
    const beds24Bookings = bookings.filter((booking) => booking.source === "beds24").length;

    return NextResponse.json(
      {
        ok: true,
        range: { start, end },
        units,
        availability,
        bookings,
        sources: {
          neon: {
            bookings: bookings.length,
            occupancySheetBookings,
            beds24Bookings,
            availabilityFallbackBookings: fallbackBookings.length,
          },
          occupancySheet: {
            enabled: Boolean(process.env.OCCUPANCY_SCRIPT_URL),
            bookings: occupancySheetBookings,
            error: null,
          },
          snapshot: {
            bookings: bookingRows.length,
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
      { ok: false, error: message, range: { start, end } },
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
