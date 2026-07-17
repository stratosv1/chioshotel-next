import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EXCLUDED_ROOM_IDS = new Set(["345347"]);

type SnapshotRow = {
  date: string;
  roomId: string;
  unitId: string;
  roomName?: string;
  unitName?: string;
  label?: string;
  price: number | null;
  available: boolean;
  reason: string;
};

function text(value: unknown) {
  return value === null || value === undefined ? "" : String(value).trim();
}

function isAuthorized(request: NextRequest) {
  const cronSecret = text(process.env.CRON_SECRET);
  const authorization = request.headers.get("authorization");
  return Boolean(cronSecret && authorization === `Bearer ${cronSecret}`);
}

function normalizeDate(value: unknown) {
  const raw = text(value);
  return /^\d{4}-\d{2}-\d{2}$/.test(raw) ? raw : "";
}

function normalizePrice(value: unknown) {
  const parsed = Number(String(value ?? "").replace(",", "."));
  return Number.isFinite(parsed) && parsed > 0 ? Math.round(parsed * 100) / 100 : null;
}

function normalizeRows(payload: unknown): SnapshotRow[] {
  if (!payload || typeof payload !== "object") return [];
  const objectPayload = payload as Record<string, unknown>;
  const rawRows = Array.isArray(objectPayload.rows)
    ? objectPayload.rows
    : Array.isArray(objectPayload.data)
      ? objectPayload.data
      : [];

  const rows: SnapshotRow[] = [];

  for (const item of rawRows) {
    if (!item || typeof item !== "object") continue;
    const row = item as Record<string, unknown>;
    const date = normalizeDate(row.date);
    const roomId = text(row.roomId ?? row.room_id);
    const unitId = text(row.unitId ?? row.unit_id);
    if (!date || !roomId || !unitId || EXCLUDED_ROOM_IDS.has(roomId)) continue;

    const rawStatus = text(row.status ?? row.value).toUpperCase();
    const explicitAvailable = row.available;
    const price = normalizePrice(row.price ?? row.value);

    let available = false;
    let reason = "CLOSED";

    if (typeof explicitAvailable === "boolean") {
      available = explicitAvailable;
      reason = text(row.reason) || (available ? "PRICE_OK" : "UNAVAILABLE");
    } else if (rawStatus === "BOOKED") {
      available = false;
      reason = "BOOKED";
    } else if (rawStatus === "CLOSED" || rawStatus === "") {
      available = false;
      reason = "CLOSED";
    } else if (price !== null) {
      available = true;
      reason = "PRICE_OK";
    }

    rows.push({
      date,
      roomId,
      unitId,
      roomName: text(row.roomName ?? row.room_name),
      unitName: text(row.unitName ?? row.unit_name),
      label: text(row.label),
      price: available ? price : null,
      available,
      reason,
    });
  }

  return rows;
}

async function syncOccupancy(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const databaseUrl = process.env.DATABASE_URL;
  const scriptUrl = text(process.env.OCCUPANCY_SCRIPT_URL);
  if (!databaseUrl) return NextResponse.json({ ok: false, error: "DATABASE_URL is missing" }, { status: 500 });
  if (!scriptUrl) return NextResponse.json({ ok: false, error: "OCCUPANCY_SCRIPT_URL is missing" }, { status: 500 });

  const startedAt = Date.now();
  const url = new URL(scriptUrl);
  url.searchParams.set("action", "occupancy_snapshot");

  const response = await fetch(url.toString(), { cache: "no-store" });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    return NextResponse.json({ ok: false, error: `Google Script returned ${response.status}`, payload }, { status: 502 });
  }

  const rows = normalizeRows(payload);
  if (!rows.length) {
    return NextResponse.json({ ok: false, error: "No valid occupancy rows received", payloadSample: payload }, { status: 422 });
  }

  const start = rows.reduce((min, row) => (row.date < min ? row.date : min), rows[0].date);
  const end = rows.reduce((max, row) => (row.date > max ? row.date : max), rows[0].date);
  const sql = neon(databaseUrl);

  await sql`delete from staff_availability_calendar where stay_date >= ${start}::date and stay_date <= ${end}::date`;
  await sql`delete from staff_rate_cache where stay_date >= ${start}::date and stay_date <= ${end}::date`;

  let availabilitySaved = 0;
  let ratesSaved = 0;
  const rateKeys = new Set<string>();

  for (const row of rows) {
    await sql`
      insert into staff_availability_calendar
        (stay_date, room_id, unit_id, price, available, reason, updated_at)
      values
        (${row.date}::date, ${row.roomId}, ${row.unitId}, ${row.price}, ${row.available}, ${row.reason}, now())
      on conflict (stay_date, room_id, unit_id)
      do update set
        price = excluded.price,
        available = excluded.available,
        reason = excluded.reason,
        updated_at = now()
    `;
    availabilitySaved += 1;

    if (row.price !== null) {
      const rateKey = `${row.roomId}:${row.date}`;
      if (!rateKeys.has(rateKey)) {
        rateKeys.add(rateKey);
        await sql`
          insert into staff_rate_cache (stay_date, room_id, price, updated_at)
          values (${row.date}::date, ${row.roomId}, ${row.price}, now())
          on conflict (stay_date, room_id)
          do update set price = excluded.price, updated_at = now()
        `;
        ratesSaved += 1;
      }
    }
  }

  await sql`
    insert into staff_refresh_runs (run_type, status, started_at, finished_at, message, details)
    values (
      'occupancy_calendar_sync',
      'success',
      now(),
      now(),
      'Google occupancy calendar synced to Neon',
      ${JSON.stringify({ start, end, received: rows.length, availabilitySaved, ratesSaved })}::jsonb
    )
  `;

  return NextResponse.json({
    ok: true,
    source: "google_sheet_occupancy_calendar",
    range: { start, end },
    received: rows.length,
    availabilitySaved,
    ratesSaved,
    durationMs: Date.now() - startedAt,
    generatedAt: new Date().toISOString(),
  });
}

export async function GET(request: NextRequest) {
  return syncOccupancy(request);
}

export async function POST(request: NextRequest) {
  return syncOccupancy(request);
}
