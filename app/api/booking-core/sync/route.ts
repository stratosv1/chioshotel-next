import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const EXCLUDED_ROOM_IDS = new Set(["345347"]);

type CanonicalRow = {
  date: string;
  roomId: string;
  unitId: string;
  roomName: string;
  unitName: string;
  label: string;
  price: number | null;
  available: boolean;
  status: string;
  reason: string;
};

function text(value: unknown) {
  return value === null || value === undefined ? "" : String(value).trim();
}

function normalizeDate(value: unknown) {
  const raw = text(value);
  const match = raw.match(/^(\d{4})-(\d{2})-(\d{2})/);
  return match ? `${match[1]}-${match[2]}-${match[3]}` : "";
}

function normalizePrice(value: unknown) {
  const parsed = Number(String(value ?? "").replace(",", "."));
  return Number.isFinite(parsed) && parsed > 0 ? Math.round(parsed * 100) / 100 : null;
}

function extractRows(payload: unknown): unknown[] {
  if (Array.isArray(payload)) return payload;
  if (!payload || typeof payload !== "object") return [];
  const source = payload as Record<string, unknown>;
  for (const key of ["rows", "data", "items", "values", "snapshot", "availability"]) {
    if (Array.isArray(source[key])) return source[key] as unknown[];
  }
  return [];
}

function normalizeSnapshot(payload: unknown): CanonicalRow[] {
  const rows: CanonicalRow[] = [];
  for (const item of extractRows(payload)) {
    if (!item || typeof item !== "object") continue;
    const row = item as Record<string, unknown>;
    const date = normalizeDate(row.date ?? row.stay_date ?? row.stayDate);
    const roomId = text(row.roomId ?? row.room_id);
    const unitId = text(row.unitId ?? row.unit_id);
    if (!date || !roomId || !unitId || EXCLUDED_ROOM_IDS.has(roomId)) continue;

    const status = text(row.status ?? row.value).toUpperCase();
    const reason = text(row.reason).toUpperCase() || (status === "BOOKED" ? "BOOKED" : status === "CLOSED" ? "CLOSED" : "PRICE_OK");
    const availableValue = row.available ?? row.isAvailable;
    const availableText = text(availableValue).toUpperCase();
    const available = typeof availableValue === "boolean"
      ? availableValue
      : ["YES", "TRUE", "1", "AVAILABLE", "OPEN"].includes(availableText);

    rows.push({
      date,
      roomId,
      unitId,
      roomName: text(row.roomName ?? row.room_name),
      unitName: text(row.unitName ?? row.unit_name),
      label: text(row.label),
      price: normalizePrice(row.price),
      available,
      status: status || (available ? "PRICE_OK" : reason),
      reason,
    });
  }
  return rows;
}

function bookedPriceMap(payload: unknown) {
  const prices = new Map<string, number>();
  for (const item of extractRows(payload)) {
    if (!item || typeof item !== "object") continue;
    const row = item as Record<string, unknown>;
    const date = normalizeDate(row.date ?? row.stay_date ?? row.stayDate);
    const roomId = text(row.roomId ?? row.room_id);
    const unitId = text(row.unitId ?? row.unit_id);
    const reason = text(row.reason).toUpperCase();
    const price = normalizePrice(row.price);
    if (!date || !roomId || !unitId || EXCLUDED_ROOM_IDS.has(roomId) || reason !== "BOOKED" || price === null) continue;
    prices.set(`${date}:${roomId}:${unitId}`, price);
  }
  return prices;
}

async function fetchScriptAction(baseUrl: string, action: string, secret: string) {
  const url = new URL(baseUrl);
  url.searchParams.set("action", action);
  url.searchParams.set("_ts", String(Date.now()));
  if (secret) url.searchParams.set("secret", secret);

  const response = await fetch(url.toString(), {
    cache: "no-store",
    redirect: "follow",
    headers: { Accept: "application/json" },
  });
  const raw = await response.text();
  let payload: unknown;
  try {
    payload = JSON.parse(raw);
  } catch {
    throw new Error(`Google Script ${action} did not return JSON. HTTP ${response.status}. Body: ${raw.slice(0, 250)}`);
  }
  if (!response.ok) throw new Error(`Google Script ${action} returned HTTP ${response.status}`);
  if (payload && typeof payload === "object" && (payload as Record<string, unknown>).success === false) {
    throw new Error(`Google Script ${action} reported failure`);
  }
  return payload;
}

function requestSecret(request: NextRequest) {
  const authorization = request.headers.get("authorization");
  if (authorization?.startsWith("Bearer ")) return authorization.slice(7).trim();
  return text(request.nextUrl.searchParams.get("secret"));
}

function isAuthorized(request: NextRequest) {
  const supplied = requestSecret(request);
  const allowed = [process.env.CRON_SECRET, process.env.OCCUPANCY_SCRIPT_SECRET].map(text).filter(Boolean);
  return Boolean(supplied && allowed.includes(supplied));
}

async function syncBookingCore(request: NextRequest, requireAuthorization: boolean) {
  if (requireAuthorization && !isAuthorized(request)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const databaseUrl = text(process.env.DATABASE_URL);
  const scriptUrl = text(process.env.OCCUPANCY_SCRIPT_URL);
  const scriptSecret = text(process.env.OCCUPANCY_SCRIPT_SECRET);
  if (!databaseUrl) return NextResponse.json({ ok: false, error: "DATABASE_URL is missing" }, { status: 500 });
  if (!scriptUrl) return NextResponse.json({ ok: false, error: "OCCUPANCY_SCRIPT_URL is missing" }, { status: 500 });

  const startedAt = Date.now();
  try {
    const [snapshotPayload, bookingsPayload] = await Promise.all([
      fetchScriptAction(scriptUrl, "occupancy_snapshot", scriptSecret),
      fetchScriptAction(scriptUrl, "bookings", scriptSecret),
    ]);

    const snapshotObject = snapshotPayload && typeof snapshotPayload === "object" ? snapshotPayload as Record<string, unknown> : {};
    const generatedAt = text(snapshotObject.generatedAt);
    if (!generatedAt || Number.isNaN(new Date(generatedAt).getTime())) {
      throw new Error("occupancy_snapshot did not include a valid generatedAt timestamp");
    }

    const rows = normalizeSnapshot(snapshotPayload);
    if (!rows.length) throw new Error("occupancy_snapshot returned no canonical rows");

    const bookedPrices = bookedPriceMap(bookingsPayload);
    const merged = rows.map((row) => {
      if (row.reason !== "BOOKED") return row;
      const price = row.price ?? bookedPrices.get(`${row.date}:${row.roomId}:${row.unitId}`) ?? null;
      return { ...row, price };
    });

    const bookedWithoutPrice = merged.filter((row) => row.reason === "BOOKED" && row.price === null);
    if (bookedWithoutPrice.length) {
      throw new Error(`Source snapshot has ${bookedWithoutPrice.length} BOOKED rows without a reference price`);
    }

    const sql = neon(databaseUrl);
    const result = await sql`
      select *
      from booking_core.replace_inventory_snapshot(
        ${generatedAt}::timestamptz,
        ${JSON.stringify(merged)}::jsonb,
        ${"script_url"}
      )
    `;

    const saved = (result as any[])?.[0] || {};
    return NextResponse.json({
      ok: true,
      source: "script_url",
      rowsReceived: Number(saved.rows_received || merged.length),
      rowsWritten: Number(saved.rows_written || 0),
      range: { min: saved.min_date || null, max: saved.max_date || null },
      sourceGeneratedAt: generatedAt,
      durationMs: Date.now() - startedAt,
    }, { headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" } });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("booking_core sync failed", error);
    return NextResponse.json({ ok: false, error: message, durationMs: Date.now() - startedAt }, {
      status: 500,
      headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" },
    });
  }
}

export async function GET(request: NextRequest) {
  return syncBookingCore(request, false);
}

export async function POST(request: NextRequest) {
  return syncBookingCore(request, true);
}
