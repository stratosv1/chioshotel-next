import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EXCLUDED_ROOM_IDS = new Set(["345347"]);
const RUN_TYPE = "occupancy_calendar_sync";

type SnapshotRow = {
  date: string;
  roomId: string;
  unitId: string;
  roomName: string;
  unitName: string;
  label: string;
  price: number | null;
  available: boolean;
  reason: string;
};

function text(value: unknown) {
  return value === null || value === undefined ? "" : String(value).trim();
}

function requestSecret(request: NextRequest) {
  const authorization = request.headers.get("authorization");
  if (authorization?.startsWith("Bearer ")) return authorization.slice(7).trim();
  return text(new URL(request.url).searchParams.get("secret"));
}

function isAuthorized(request: NextRequest) {
  const supplied = requestSecret(request);
  const allowed = [process.env.CRON_SECRET, process.env.OCCUPANCY_SCRIPT_SECRET]
    .map(text)
    .filter(Boolean);
  return Boolean(supplied && allowed.includes(supplied));
}

function normalizeDate(value: unknown) {
  const raw = text(value);
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw;
  const dmy = raw.match(/^(\d{1,2})[\/-](\d{1,2})[\/-](\d{4})$/);
  if (!dmy) return "";
  return `${dmy[3]}-${dmy[2].padStart(2, "0")}-${dmy[1].padStart(2, "0")}`;
}

function normalizePrice(value: unknown) {
  const parsed = Number(String(value ?? "").replace(",", "."));
  return Number.isFinite(parsed) && parsed > 0 ? Math.round(parsed * 100) / 100 : null;
}

function normalizeRows(payload: unknown): SnapshotRow[] {
  if (!payload || typeof payload !== "object") return [];
  const objectPayload = payload as Record<string, unknown>;
  const rawRows = Array.isArray(payload)
    ? payload
    : Array.isArray(objectPayload.rows)
      ? objectPayload.rows
      : Array.isArray(objectPayload.data)
        ? objectPayload.data
        : Array.isArray(objectPayload.occupancy)
          ? objectPayload.occupancy
          : [];

  const rows: SnapshotRow[] = [];
  for (const item of rawRows) {
    if (!item || typeof item !== "object") continue;
    const row = item as Record<string, unknown>;
    const date = normalizeDate(row.date ?? row.stay_date ?? row.day);
    const roomId = text(row.roomId ?? row.room_id);
    const unitId = text(row.unitId ?? row.unit_id);
    if (!date || !roomId || !unitId || EXCLUDED_ROOM_IDS.has(roomId)) continue;

    const rawStatus = text(row.status ?? row.value).toUpperCase();
    const explicitAvailable = row.available;
    const price = normalizePrice(row.price ?? row.rate ?? row.value);
    let available = false;
    let reason = "CLOSED";

    if (typeof explicitAvailable === "boolean") {
      available = explicitAvailable;
      reason = text(row.reason) || (available ? "PRICE_OK" : "UNAVAILABLE");
    } else if (["YES", "TRUE", "1", "AVAILABLE", "OPEN"].includes(text(explicitAvailable).toUpperCase())) {
      available = true;
      reason = text(row.reason) || "PRICE_OK";
    } else if (rawStatus === "BOOKED") {
      reason = "BOOKED";
    } else if (rawStatus === "CLOSED" || rawStatus === "") {
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

async function recordRun(
  databaseUrl: string,
  status: "success" | "error",
  startedAt: number,
  message: string,
  details: Record<string, unknown>,
) {
  try {
    const sql = neon(databaseUrl);
    await sql`
      insert into staff_refresh_runs
        (run_type, status, started_at, finished_at, duration_ms, message, details)
      values
        (${RUN_TYPE}, ${status}, to_timestamp(${startedAt / 1000}), now(), ${Date.now() - startedAt}, ${message}, ${JSON.stringify(details)}::jsonb)
    `;
  } catch (error) {
    console.error("Unable to record occupancy sync run", error);
  }
}

async function syncOccupancy(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const databaseUrl = text(process.env.DATABASE_URL);
  const scriptUrl = text(process.env.OCCUPANCY_SCRIPT_URL);
  if (!databaseUrl) return NextResponse.json({ ok: false, error: "DATABASE_URL is missing" }, { status: 500 });
  if (!scriptUrl) return NextResponse.json({ ok: false, error: "OCCUPANCY_SCRIPT_URL is missing" }, { status: 500 });

  const startedAt = Date.now();
  try {
    const url = new URL(scriptUrl);
    url.searchParams.set("action", "occupancy_snapshot");
    const scriptSecret = text(process.env.OCCUPANCY_SCRIPT_SECRET);
    if (scriptSecret) url.searchParams.set("secret", scriptSecret);

    const response = await fetch(url.toString(), { cache: "no-store" });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(`Google Script returned ${response.status}: ${JSON.stringify(payload).slice(0, 500)}`);

    const rows = normalizeRows(payload);
    if (!rows.length) throw new Error(`No valid occupancy rows received. Payload keys: ${Object.keys(payload as object).join(", ")}`);

    const start = rows.reduce((min, row) => (row.date < min ? row.date : min), rows[0].date);
    const end = rows.reduce((max, row) => (row.date > max ? row.date : max), rows[0].date);
    const sql = neon(databaseUrl);

    // Delete only after a valid, non-empty snapshot has been received.
    await sql`delete from staff_availability_calendar where stay_date >= ${start}::date and stay_date <= ${end}::date`;
    await sql`delete from staff_rate_cache where stay_date >= ${start}::date and stay_date <= ${end}::date`;

    let availabilitySaved = 0;
    let ratesSaved = 0;
    const rateKeys = new Set<string>();

    for (const row of rows) {
      await sql`
        insert into staff_availability_calendar
          (stay_date, room_id, room_name, unit_id, unit_name, label, price, available, reason, updated_at)
        values
          (${row.date}::date, ${row.roomId}, ${row.roomName || null}, ${row.unitId}, ${row.unitName || null}, ${row.label || null}, ${row.price}, ${row.available}, ${row.reason}, now())
        on conflict (stay_date, room_id, unit_id)
        do update set
          room_name = excluded.room_name,
          unit_name = excluded.unit_name,
          label = excluded.label,
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

    const details = { start, end, received: rows.length, availabilitySaved, ratesSaved };
    await recordRun(databaseUrl, "success", startedAt, "Google occupancy calendar synced to Neon", details);

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
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Occupancy calendar sync failed", error);
    await recordRun(databaseUrl, "error", startedAt, message, { endpoint: request.nextUrl.pathname });
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  return syncOccupancy(request);
}

export async function POST(request: NextRequest) {
  return syncOccupancy(request);
}
