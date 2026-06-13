import { neon } from "@neondatabase/serverless";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

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

function getSql() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is missing.");
  }

  return neon(databaseUrl);
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return unauthorized();
  }

  try {
    const sql = getSql();

    const counts = await sql`
      SELECT
        (SELECT COUNT(*)::int FROM staff_units) AS staff_units,
        (SELECT COUNT(*)::int FROM staff_rate_cache) AS staff_rate_cache,
        (SELECT COUNT(*)::int FROM staff_availability_calendar) AS staff_availability_calendar,
        (SELECT COUNT(*)::int FROM staff_bookings_snapshot) AS staff_bookings_snapshot,
        (SELECT COUNT(*)::int FROM staff_price_imports) AS staff_price_imports,
        (SELECT COUNT(*)::int FROM staff_refresh_runs) AS staff_refresh_runs,
        (SELECT COUNT(*)::int FROM staff_deals_cache) AS staff_deals_cache,
        (SELECT COUNT(*)::int FROM staff_housekeeping_stays) AS staff_housekeeping_stays,
        (SELECT COUNT(*)::int FROM staff_housekeeping_tasks) AS staff_housekeeping_tasks
    `;

    const dateRanges = await sql`
      SELECT
        (SELECT MIN(stay_date)::text FROM staff_rate_cache) AS rate_min_date,
        (SELECT MAX(stay_date)::text FROM staff_rate_cache) AS rate_max_date,
        (SELECT MIN(stay_date)::text FROM staff_availability_calendar) AS availability_min_date,
        (SELECT MAX(stay_date)::text FROM staff_availability_calendar) AS availability_max_date,
        (SELECT MIN(arrival)::text FROM staff_bookings_snapshot) AS bookings_min_arrival,
        (SELECT MAX(arrival)::text FROM staff_bookings_snapshot) AS bookings_max_arrival
    `;

    const recentRefreshRuns = await sql`
      SELECT
        id,
        run_type,
        status,
        started_at,
        finished_at,
        duration_ms,
        message
      FROM staff_refresh_runs
      ORDER BY started_at DESC
      LIMIT 10
    `;

    const units = await sql`
      SELECT
        room_id,
        room_name,
        unit_id,
        unit_name,
        label,
        location,
        max_guests,
        is_active
      FROM staff_units
      ORDER BY room_id::int, unit_id::int
    `;

    return NextResponse.json(
      {
        success: true,
        generatedAt: new Date().toISOString(),
        counts: counts[0],
        dateRanges: dateRanges[0],
        recentRefreshRuns,
        units,
      },
      {
        headers: noStoreHeaders(),
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Unknown operations summary error.",
      },
      {
        status: 500,
        headers: noStoreHeaders(),
      }
    );
  }
}
