import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type CalendarUnit = {
  room_id: string;
  unit_id: string;
  display_name: string;
  category: string;
  floor: string | null;
  max_guests: number | null;
  sort_order: number | null;
};

type AvailabilityRow = {
  date: string;
  room_id: string;
  unit_id: string;
  price: number | null;
  available: boolean | null;
  reason: string | null;
};

type BookingRow = {
  booking_id: string;
  room_id: string;
  unit_id: string;
  guest_name: string | null;
  arrival: string;
  departure: string;
  status: string | null;
  referrer: string | null;
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

  if (!expectedUser || !expectedPass) {
    return false;
  }

  const auth = request.headers.get("authorization");
  if (!auth?.startsWith("Basic ")) {
    return false;
  }

  try {
    const decoded = Buffer.from(auth.slice(6), "base64").toString("utf8");
    const separatorIndex = decoded.indexOf(":");

    if (separatorIndex === -1) {
      return false;
    }

    const username = decoded.slice(0, separatorIndex);
    const password = decoded.slice(separatorIndex + 1);

    return username === expectedUser && password === expectedPass;
  } catch {
    return false;
  }
}

function isoDateOnly(value: Date) {
  return value.toISOString().slice(0, 10);
}

function safeDateParam(value: string | null, fallback: string) {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return fallback;
  }

  return value;
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return unauthorized();
  }

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
  const defaultEnd = isoDateOnly(new Date(today.getFullYear(), today.getMonth() + 2, 0));

  const { searchParams } = new URL(request.url);
  const start = safeDateParam(searchParams.get("start"), defaultStart);
  const end = safeDateParam(searchParams.get("end"), defaultEnd);

  const sql = neon(databaseUrl);

  const units = await sql`
    select
      room_id::text as room_id,
      unit_id::text as unit_id,
      display_name,
      category,
      floor,
      max_guests,
      sort_order
    from staff_units
    order by sort_order nulls last, room_id::int, unit_id::int
  ` as CalendarUnit[];

  const availability = await sql`
    select
      date::text as date,
      room_id::text as room_id,
      unit_id::text as unit_id,
      price,
      available,
      reason
    from staff_availability_calendar
    where date >= ${start}::date
      and date <= ${end}::date
    order by date asc, room_id::int, unit_id::int
  ` as AvailabilityRow[];

  const bookings = await sql`
    select
      booking_id::text as booking_id,
      room_id::text as room_id,
      unit_id::text as unit_id,
      guest_name,
      arrival::text as arrival,
      departure::text as departure,
      status,
      referrer,
      price
    from staff_bookings_snapshot
    where arrival <= ${end}::date
      and departure >= ${start}::date
    order by arrival asc, room_id::int, unit_id::int
  ` as BookingRow[];

  return NextResponse.json(
    {
      ok: true,
      range: { start, end },
      units,
      availability,
      bookings,
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
