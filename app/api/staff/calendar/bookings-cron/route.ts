import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const MIN_INTERVAL_MS = 25 * 60 * 1000;

function text(value: unknown) {
  return value === null || value === undefined ? "" : String(value).trim();
}

export async function GET(request: NextRequest) {
  const databaseUrl = text(process.env.DATABASE_URL);
  const cronSecret = text(process.env.CRON_SECRET);

  if (!databaseUrl) {
    return NextResponse.json({ ok: false, error: "DATABASE_URL is missing." }, { status: 500 });
  }

  if (!cronSecret) {
    return NextResponse.json({ ok: false, error: "CRON_SECRET is missing." }, { status: 500 });
  }

  const sql = neon(databaseUrl);
  const latestRows = await sql`
    select finished_at
    from staff_refresh_runs
    where run_type = 'beds24_bookings_sync'
      and status = 'success'
      and finished_at is not null
    order by finished_at desc
    limit 1
  `;

  const latestFinishedAt = latestRows[0]?.finished_at
    ? new Date(String(latestRows[0].finished_at)).getTime()
    : 0;

  if (latestFinishedAt && Date.now() - latestFinishedAt < MIN_INTERVAL_MS) {
    return NextResponse.json({
      ok: true,
      skipped: true,
      reason: "Bookings sync ran recently.",
      lastFinishedAt: new Date(latestFinishedAt).toISOString(),
    });
  }

  const syncUrl = new URL("/api/staff/calendar/sync", request.nextUrl.origin);
  const response = await fetch(syncUrl.toString(), {
    method: "GET",
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${cronSecret}`,
      Accept: "application/json",
    },
  });

  const body = await response.text();
  let payload: unknown;

  try {
    payload = JSON.parse(body);
  } catch {
    payload = { raw: body.slice(0, 1000) };
  }

  return NextResponse.json(
    {
      ok: response.ok,
      triggered: true,
      sync: payload,
    },
    {
      status: response.ok ? 200 : response.status,
      headers: {
        "Cache-Control": "no-store",
        "X-Robots-Tag": "noindex, nofollow",
      },
    },
  );
}
