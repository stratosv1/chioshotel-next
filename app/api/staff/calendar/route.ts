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
      { ok: false, error: "DATABASE_URL is missing in Vercel Production env." },
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

    const availability = await sql`
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
        room_id::text as room_id,
        unit_id::text as unit_id,
        guest_name,
        arrival::text as arrival,
        departure::text as departure,
        status,
        coalesce(referrer, channel, source) as referrer,
        null::numeric as price
      from staff_bookings_snapshot
      where arrival <= ${end}::date
        and departure >= ${start}::date
      order by arrival asc, room_id::int, unit_id::int
    `;

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

