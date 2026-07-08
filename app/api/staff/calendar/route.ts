import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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

function bookingCoversDate(booking: any, date: string) {
  const status = String(booking.status || "").toLowerCase();
  if (status.includes("cancel") || status.includes("deleted")) return false;
  return booking.arrival <= date && booking.departure > date;
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

    const bookings = await sql`
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
        and departure >= ${start}::date
      order by arrival asc, room_id::int, unit_id::int
    `;

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
          const booked = (bookings as any[]).some(
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

    const occupancySheetBookings = (bookings as any[]).filter((booking) => booking.source === "occupancy-sheet").length;
    const beds24Bookings = (bookings as any[]).filter((booking) => booking.source === "beds24").length;

    return NextResponse.json(
      {
        ok: true,
        range: { start, end },
        units,
        availability,
        bookings,
        sources: {
          neon: {
            bookings: (bookings as any[]).length,
            occupancySheetBookings,
            beds24Bookings,
          },
          occupancySheet: {
            enabled: Boolean(process.env.OCCUPANCY_SCRIPT_URL),
            bookings: occupancySheetBookings,
            error: null,
          },
          snapshot: {
            bookings: (bookings as any[]).length,
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
