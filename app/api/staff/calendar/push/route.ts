import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_ROWS = 10000;

type IncomingRow = {
  date?: unknown;
  roomId?: unknown;
  unitId?: unknown;
  price?: unknown;
  available?: unknown;
  reason?: unknown;
};

type NormalizedRow = {
  date: string;
  room_id: string;
  unit_id: string;
  price: number | null;
  available: boolean;
  reason: string;
};

function text(value: unknown) {
  if (value === null || value === undefined) return "";
  return String(value).trim();
}

function isIsoDate(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function numberOrNull(value: unknown) {
  if (value === "" || value === null || value === undefined) return null;
  const parsed = Number(String(value).replace(",", "."));
  return Number.isFinite(parsed) ? Math.round(parsed * 100) / 100 : null;
}

function booleanValue(value: unknown) {
  if (typeof value === "boolean") return value;
  const normalized = text(value).toUpperCase();
  return normalized === "YES" || normalized === "TRUE" || normalized === "1";
}

function isAuthorized(request: NextRequest) {
  const expected = text(process.env.SHEET_PUSH_SECRET || process.env.CRON_SECRET);
  if (!expected) return false;

  const bearer = request.headers.get("authorization");
  if (bearer === `Bearer ${expected}`) return true;

  return request.headers.get("x-sync-secret") === expected;
}

function normalizeRows(input: unknown): NormalizedRow[] {
  if (!Array.isArray(input)) throw new Error("rows must be an array");
  if (!input.length) throw new Error("rows is empty");
  if (input.length > MAX_ROWS) throw new Error(`rows exceeds ${MAX_ROWS}`);

  const rows: NormalizedRow[] = [];

  for (const raw of input as IncomingRow[]) {
    const date = text(raw?.date);
    const roomId = text(raw?.roomId);
    const unitId = text(raw?.unitId);

    if (!isIsoDate(date) || !roomId || !unitId) continue;

    const available = booleanValue(raw.available);
    const reason = text(raw.reason) || (available ? "PRICE_OK" : "UNAVAILABLE");
    const price = numberOrNull(raw.price);

    rows.push({
      date,
      room_id: roomId,
      unit_id: unitId,
      price,
      available,
      reason,
    });
  }

  if (!rows.length) throw new Error("No valid availability rows found");
  return rows;
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    return NextResponse.json({ ok: false, error: "DATABASE_URL is missing" }, { status: 500 });
  }

  const startedAt = Date.now();

  try {
    const body = await request.json();
    const rows = normalizeRows(body?.rows);
    const start = rows.reduce((min, row) => (row.date < min ? row.date : min), rows[0].date);
    const end = rows.reduce((max, row) => (row.date > max ? row.date : max), rows[0].date);

    const rateMap = new Map<string, { date: string; room_id: string; price: number }>();
    for (const row of rows) {
      if (row.price !== null && row.price > 0) {
        rateMap.set(`${row.room_id}:${row.date}`, {
          date: row.date,
          room_id: row.room_id,
          price: row.price,
        });
      }
    }
    const rates = Array.from(rateMap.values());

    const sql = neon(databaseUrl);

    await sql`
      delete from staff_availability_calendar
      where stay_date >= ${start}::date and stay_date <= ${end}::date
    `;

    await sql`
      insert into staff_availability_calendar (
        stay_date, room_id, unit_id, price, available, reason, updated_at
      )
      select
        item.date::date,
        item.room_id,
        item.unit_id,
        item.price,
        item.available,
        item.reason,
        now()
      from jsonb_to_recordset(${JSON.stringify(rows)}::jsonb) as item(
        date text,
        room_id text,
        unit_id text,
        price numeric,
        available boolean,
        reason text
      )
    `;

    await sql`
      delete from staff_rate_cache
      where stay_date >= ${start}::date and stay_date <= ${end}::date
    `;

    if (rates.length) {
      await sql`
        insert into staff_rate_cache (stay_date, room_id, price, updated_at)
        select
          item.date::date,
          item.room_id,
          item.price,
          now()
        from jsonb_to_recordset(${JSON.stringify(rates)}::jsonb) as item(
          date text,
          room_id text,
          price numeric
        )
      `;
    }

    return NextResponse.json(
      {
        ok: true,
        range: { start, end },
        availabilityRows: rows.length,
        rateRows: rates.length,
        generatedAt: new Date().toISOString(),
        durationMs: Date.now() - startedAt,
      },
      {
        headers: {
          "Cache-Control": "no-store",
          "X-Robots-Tag": "noindex, nofollow",
        },
      },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown push sync error";
    return NextResponse.json(
      { ok: false, error: message, durationMs: Date.now() - startedAt },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    );
  }
}
