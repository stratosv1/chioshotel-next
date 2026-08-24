import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { scryptSync, timingSafeEqual } from "node:crypto";
import { neon } from "@neondatabase/serverless";
import { BOOKING_CORE_DEALS_CACHE_TAG } from "@/lib/booking-core/cache-tags";
import {
  detectPriceChanges,
  retryPendingPricingAlert,
  runPricingAuditAfterPriceChange,
} from "./pricing-audit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const SOURCE_ACTION = "booking_core_snapshot";
const SOURCE_SCHEMA_VERSION = 1;
const SOURCE_TIMEOUT_MS = 45_000;
const VALID_REASONS = new Set(["PRICE_OK", "BOOKED", "CLOSED"]);
const PULL_SOURCE = "script_url_booking_core_snapshot_v1";
const PUSH_SOURCE = "script_push_booking_core_snapshot_v1";
const DATA_UPDATED_AT_SETTING = "booking_core_last_source_data_updated_at";

// Fallback verifier for the Apps Script push token. The raw token is never
// stored in the repository; only a memory-hard scrypt verifier is kept here.
// Environment-variable secrets remain the preferred authorization path.
const PUSH_FALLBACK_SALT = Buffer.from("9f2fb5c0804e2f893d409f13eb97fc7a", "hex");
const PUSH_FALLBACK_HASH = Buffer.from("1e6de08c6d0a798f04bbd17fc011d53914d49e32f5bef9c2da5c792124d70b77", "hex");

function matchesFallbackPushSecret(supplied: string) {
  if (!supplied) return false;
  try {
    const derived = scryptSync(supplied, PUSH_FALLBACK_SALT, PUSH_FALLBACK_HASH.length, {
      N: 16_384,
      r: 8,
      p: 1,
      maxmem: 64 * 1024 * 1024,
    });
    return derived.length === PUSH_FALLBACK_HASH.length && timingSafeEqual(derived, PUSH_FALLBACK_HASH);
  } catch {
    return false;
  }
}

type CanonicalRow = {
  date: string;
  roomId: string;
  roomName: string;
  unitId: string;
  unitName: string;
  label: string;
  price: number | null;
  available: boolean;
  status: string;
  reason: "PRICE_OK" | "BOOKED" | "CLOSED";
};

type CanonicalSnapshot = {
  generatedAt: string;
  dataUpdatedAt: string;
  sourceRefreshedAt: string;
  rows: CanonicalRow[];
};

function text(value: unknown) {
  return value === null || value === undefined ? "" : String(value).trim();
}

function validIsoTimestamp(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0 && !Number.isNaN(new Date(value).getTime());
}

function validIsoDate(value: unknown): value is string {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T12:00:00Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}

function snapshotDateRange(rows: CanonicalRow[]) {
  let minDate = rows[0]?.date || "";
  let maxDate = minDate;
  for (const row of rows) {
    if (!minDate || row.date < minDate) minDate = row.date;
    if (!maxDate || row.date > maxDate) maxDate = row.date;
  }
  return { minDate, maxDate };
}

function parseCanonicalRow(value: unknown, index: number): CanonicalRow {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`Source row ${index} is not an object`);
  }

  const row = value as Record<string, unknown>;
  const date = text(row.date);
  const roomId = text(row.roomId);
  const roomName = text(row.roomName);
  const unitId = text(row.unitId);
  const unitName = text(row.unitName);
  const label = text(row.label);
  const status = text(row.status);
  const reason = text(row.reason).toUpperCase();
  const available = row.available;

  if (!validIsoDate(date)) throw new Error(`Source row ${index} has an invalid date`);
  if (!roomId || !unitId) throw new Error(`Source row ${index} is missing roomId/unitId`);
  if (typeof available !== "boolean") throw new Error(`Source row ${index} has a non-boolean available value`);
  if (!VALID_REASONS.has(reason)) throw new Error(`Source row ${index} has unsupported reason ${reason || "EMPTY"}`);

  let price: number | null = null;
  if (row.price !== null && row.price !== undefined && row.price !== "") {
    const parsed = Number(row.price);
    if (!Number.isFinite(parsed) || parsed <= 0) throw new Error(`Source row ${index} has an invalid price`);
    price = Math.round(parsed * 100) / 100;
  }

  if (available && reason !== "PRICE_OK") throw new Error(`Source row ${index} is available but reason is ${reason}`);
  if (!available && reason === "PRICE_OK") throw new Error(`Source row ${index} is unavailable but reason is PRICE_OK`);
  if (available && price === null) throw new Error(`Source row ${index} is sellable but missing the required reference price`);

  return {
    date,
    roomId,
    roomName,
    unitId,
    unitName,
    label,
    price,
    available,
    status: status || (available ? String(price) : reason),
    reason: reason as CanonicalRow["reason"],
  };
}

function parseCanonicalSnapshot(payload: unknown): CanonicalSnapshot {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    throw new Error("Google Script returned an invalid booking_core_snapshot payload");
  }

  const source = payload as Record<string, unknown>;
  if (source.success !== true || source.ok !== true) {
    const code = text(source.code) || "SOURCE_ERROR";
    const message = text(source.error) || "Google Script source reported failure";
    throw new Error(`${code}: ${message}`);
  }
  if (text(source.type) !== SOURCE_ACTION) throw new Error(`Unexpected source type: ${text(source.type) || "EMPTY"}`);
  if (Number(source.schemaVersion) !== SOURCE_SCHEMA_VERSION) {
    throw new Error(`Unsupported source schemaVersion: ${text(source.schemaVersion) || "EMPTY"}`);
  }
  if (text(source.source) !== "google_sheet_availability") {
    throw new Error(`Unexpected source: ${text(source.source) || "EMPTY"}`);
  }
  if (text(source.refreshState).toUpperCase() !== "READY") {
    throw new Error(`Source refreshState is not READY: ${text(source.refreshState) || "EMPTY"}`);
  }
  if (!validIsoTimestamp(source.generatedAt)) throw new Error("Source generatedAt is invalid");
  if (!validIsoTimestamp(source.dataUpdatedAt)) throw new Error("Source dataUpdatedAt is invalid");
  if (!validIsoTimestamp(source.sourceRefreshedAt)) throw new Error("Source sourceRefreshedAt is invalid");
  if (!Array.isArray(source.rows) || source.rows.length === 0) throw new Error("Source returned no booking rows");
  if (Number(source.count) !== source.rows.length) throw new Error("Source count does not match rows length");

  const rows = source.rows.map((row, index) => parseCanonicalRow(row, index));
  return {
    generatedAt: source.generatedAt,
    dataUpdatedAt: source.dataUpdatedAt,
    sourceRefreshedAt: source.sourceRefreshedAt,
    rows,
  };
}

async function fetchCanonicalSnapshot(baseUrl: string, secret: string) {
  const url = new URL(baseUrl);
  url.searchParams.set("action", SOURCE_ACTION);
  url.searchParams.set("_ts", String(Date.now()));
  if (secret) url.searchParams.set("secret", secret);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), SOURCE_TIMEOUT_MS);
  try {
    const response = await fetch(url.toString(), {
      cache: "no-store",
      redirect: "follow",
      signal: controller.signal,
      headers: { Accept: "application/json" },
    });
    const raw = await response.text();
    if (!response.ok) throw new Error(`Google Script returned HTTP ${response.status}`);

    let payload: unknown;
    try {
      payload = JSON.parse(raw);
    } catch {
      throw new Error(`Google Script did not return JSON. Body: ${raw.slice(0, 250)}`);
    }
    return parseCanonicalSnapshot(payload);
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error(`Google Script source exceeded ${SOURCE_TIMEOUT_MS / 1000}s timeout`);
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

async function readPushedSnapshot(request: NextRequest) {
  if (request.method !== "POST") return null;
  const raw = await request.text();
  if (!raw.trim()) return null;

  let payload: unknown;
  try {
    payload = JSON.parse(raw);
  } catch {
    throw new Error("Push body is not valid JSON");
  }
  return parseCanonicalSnapshot(payload);
}

function requestSecret(request: NextRequest) {
  const authorization = request.headers.get("authorization");
  if (authorization?.startsWith("Bearer ")) return authorization.slice(7).trim();
  return text(request.nextUrl.searchParams.get("secret"));
}

function isAuthorized(request: NextRequest) {
  const supplied = requestSecret(request);
  const allowed = [
    process.env.CRON_SECRET,
    process.env.OCCUPANCY_SCRIPT_SECRET,
    process.env.BOOKING_CORE_PUSH_SECRET,
  ].map(text).filter(Boolean);
  return Boolean(supplied && (allowed.includes(supplied) || matchesFallbackPushSecret(supplied)));
}

async function recordFailure(databaseUrl: string, startedAt: number, message: string, source: string) {
  if (!databaseUrl) return;
  try {
    const sql = neon(databaseUrl);
    await sql`
      insert into booking_core.sync_runs (
        started_at,
        completed_at,
        status,
        source,
        error_message
      ) values (
        ${new Date(startedAt).toISOString()}::timestamptz,
        now(),
        ${"error"},
        ${source},
        ${message.slice(0, 4000)}
      )
    `;
  } catch (loggingError) {
    console.error("booking_core could not record failed sync run", loggingError);
  }
}

async function syncBookingCore(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const databaseUrl = text(process.env.DATABASE_URL);
  const scriptUrl = text(process.env.OCCUPANCY_SCRIPT_URL);
  const scriptSecret = text(process.env.OCCUPANCY_SCRIPT_SECRET);
  if (!databaseUrl) return NextResponse.json({ ok: false, error: "DATABASE_URL is missing" }, { status: 500 });

  const startedAt = Date.now();
  let source = request.method === "POST" ? PUSH_SOURCE : PULL_SOURCE;
  try {
    let snapshot = await readPushedSnapshot(request);
    if (!snapshot) {
      source = PULL_SOURCE;
      if (!scriptUrl) return NextResponse.json({ ok: false, error: "OCCUPANCY_SCRIPT_URL is missing" }, { status: 500 });
      snapshot = await fetchCanonicalSnapshot(scriptUrl, scriptSecret);
    }

    await retryPendingPricingAlert(databaseUrl);

    const sql = neon(databaseUrl);
    const markerRows = await sql`
      select text_value
      from booking_core.settings
      where setting_key = ${DATA_UPDATED_AT_SETTING}
      limit 1
    `;
    const alreadyApplied = text((markerRows as any[])[0]?.text_value) === snapshot.dataUpdatedAt;

    if (alreadyApplied) {
      const { minDate, maxDate } = snapshotDateRange(snapshot.rows);
      await sql`
        insert into booking_core.sync_runs (
          started_at,
          completed_at,
          status,
          source,
          rows_received,
          rows_written,
          source_generated_at,
          min_date,
          max_date
        ) values (
          ${new Date(startedAt).toISOString()}::timestamptz,
          now(),
          ${"ok"},
          ${source},
          ${snapshot.rows.length},
          0,
          ${snapshot.sourceRefreshedAt}::timestamptz,
          ${minDate}::date,
          ${maxDate}::date
        )
      `;

      return NextResponse.json({
        ok: true,
        alreadyApplied: true,
        source,
        schemaVersion: SOURCE_SCHEMA_VERSION,
        rowsReceived: snapshot.rows.length,
        rowsWritten: 0,
        range: { min: minDate, max: maxDate },
        sourceDataUpdatedAt: snapshot.dataUpdatedAt,
        sourceRefreshedAt: snapshot.sourceRefreshedAt,
        sourceResponseGeneratedAt: snapshot.generatedAt,
        durationMs: Date.now() - startedAt,
      }, { headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" } });
    }

    const priceChanges = await detectPriceChanges(databaseUrl, snapshot.rows);
    const result = await sql`
      select *
      from booking_core.replace_inventory_snapshot(
        ${snapshot.sourceRefreshedAt}::timestamptz,
        ${JSON.stringify(snapshot.rows)}::jsonb,
        ${source}
      )
    `;

    const saved = (result as any[])?.[0] || {};
    const rowsWritten = Number(saved.rows_written || 0);
    const pricingAudit = await runPricingAuditAfterPriceChange(
      databaseUrl,
      snapshot.dataUpdatedAt,
      priceChanges,
    );

    await sql`
      insert into booking_core.settings (
        setting_key,
        numeric_value,
        text_value,
        description
      ) values (
        ${DATA_UPDATED_AT_SETTING},
        null,
        ${snapshot.dataUpdatedAt},
        ${"Last source dataUpdatedAt successfully applied to Booking Core"}
      )
      on conflict (setting_key) do update
      set text_value = excluded.text_value,
          description = excluded.description
    `;

    if (rowsWritten > 0) {
      try {
        revalidateTag(BOOKING_CORE_DEALS_CACHE_TAG, { expire: 0 });
      } catch (cacheError) {
        console.error("booking_core could not invalidate deals cache", cacheError);
      }
    }

    return NextResponse.json({
      ok: true,
      source,
      schemaVersion: SOURCE_SCHEMA_VERSION,
      rowsReceived: Number(saved.rows_received || snapshot.rows.length),
      rowsWritten,
      range: { min: saved.min_date || null, max: saved.max_date || null },
      sourceDataUpdatedAt: snapshot.dataUpdatedAt,
      sourceRefreshedAt: snapshot.sourceRefreshedAt,
      sourceResponseGeneratedAt: snapshot.generatedAt,
      pricingAudit,
      durationMs: Date.now() - startedAt,
    }, { headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" } });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("booking_core sync failed", error);
    await recordFailure(databaseUrl, startedAt, message, source);
    return NextResponse.json({ ok: false, error: message, durationMs: Date.now() - startedAt }, {
      status: 503,
      headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" },
    });
  }
}

export async function GET(request: NextRequest) {
  return syncBookingCore(request);
}

export async function POST(request: NextRequest) {
  return syncBookingCore(request);
}
