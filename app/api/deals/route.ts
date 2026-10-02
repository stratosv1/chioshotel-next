import { after, NextRequest, NextResponse } from "next/server";
import { unstable_cache } from "next/cache";
import { neon } from "@neondatabase/serverless";
import { BOOKING_CORE_DEALS_CACHE_TAG } from "@/lib/booking-core/cache-tags";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const DEALS_CACHE_REVALIDATE_SECONDS = 15 * 60;
// Keep the on-demand refresh inside maxDuration (60s), leaving time to read
// inventory and build the payload afterwards.
const ON_DEMAND_SYNC_TIMEOUT_MS = 40_000;
// Fresh deals are shared by everyone, so let Vercel's CDN answer most homepage
// visits without reaching this function or Neon. Stale deals are cached only
// briefly, so visitors pick up the background refresh within seconds.
const FRESH_CACHE_CONTROL = "public, max-age=0, s-maxage=60, stale-while-revalidate=300";
const STALE_CACHE_CONTROL = "public, max-age=0, s-maxage=10, stale-while-revalidate=30";

type RefreshOutcome = "refreshed" | "busy" | "failed";

function athensToday() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Athens",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}

function addDays(iso: string, days: number) {
  const date = new Date(`${iso}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

function money(value: unknown) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.round(parsed * 100) / 100 : 0;
}

function weekRange(today: string) {
  const firstDate = addDays(today, 1);
  const lastDate = addDays(today, 7);
  return {
    firstDate,
    lastDate,
    checkoutBoundary: addDays(lastDate, 1),
  };
}

async function refreshBookingCoreOnDemand(origin: string): Promise<RefreshOutcome> {
  const secret = String(process.env.CRON_SECRET || "").trim();
  if (!secret) {
    console.error("Live Deals cannot refresh stale booking inventory because CRON_SECRET is missing");
    return "failed";
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), ON_DEMAND_SYNC_TIMEOUT_MS);

  try {
    const syncUrl = new URL("/api/booking-core/sync/", origin);
    const response = await fetch(syncUrl, {
      method: "GET",
      cache: "no-store",
      redirect: "follow",
      signal: controller.signal,
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${secret}`,
      },
    });

    const raw = await response.text();
    if (!response.ok) {
      // Another refresh is already running (or the source is still preparing
      // its first snapshot); it will update the inventory, so wait for it.
      if (raw.includes("SOURCE_BUSY") || raw.includes("SOURCE_NOT_READY")) {
        console.warn("Live Deals on-demand Booking Core sync skipped: source refresh already running");
        return "busy";
      }
      console.error("Live Deals on-demand Booking Core sync failed", response.status, raw.slice(0, 500));
      return "failed";
    }

    try {
      const payload = JSON.parse(raw) as { ok?: boolean };
      return payload.ok === true ? "refreshed" : "failed";
    } catch {
      console.error("Live Deals on-demand Booking Core sync returned invalid JSON");
      return "failed";
    }
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      console.warn("Live Deals on-demand Booking Core sync still running after timeout; waiting for inventory");
      return "busy";
    }
    console.error("Live Deals on-demand Booking Core sync failed", error);
    return "failed";
  } finally {
    clearTimeout(timeout);
  }
}

async function readInventoryStatus(today: string) {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error("DATABASE_URL is missing");

  const sql = neon(databaseUrl);
  const { firstDate, checkoutBoundary } = weekRange(today);
  const rows = await sql`
    select *
    from booking_core.inventory_status(${firstDate}::date, ${checkoutBoundary}::date)
  `;
  return String((rows as any[])?.[0]?.status || "DATA_UNAVAILABLE");
}

async function loadDealsFromNeon(today: string) {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error("DATABASE_URL is missing");
  const sql = neon(databaseUrl);
  const { firstDate, lastDate, checkoutBoundary } = weekRange(today);

  const [inventoryRows, roomRows, quoteRows] = await Promise.all([
    sql`
      select * from booking_core.inventory_status(${firstDate}::date, ${checkoutBoundary}::date)
    `,
    sql`
      select room_number, room_id::text as room_id, unit_id::text as unit_id,
             display_name, room_type, floor, max_guests
      from booking_core.rooms
      where is_active = true
      order by room_number
    `,
    sql`
      with dates as (
        select gs::date as stay_date
        from generate_series(${firstDate}::date, ${lastDate}::date, interval '1 day') gs
      ), guest_counts as (
        select generate_series(1, 5)::integer as guests
      )
      select d.stay_date::text as checkin, g.guests, q.*
      from dates d
      cross join guest_counts g
      cross join lateral booking_core.search_availability(d.stay_date, d.stay_date + 1, g.guests) q
      order by d.stay_date, g.guests, q.room_number
    `,
  ]);

  const inventory = (inventoryRows as any[])?.[0];
  const inventoryStatus = String(inventory?.status || "DATA_UNAVAILABLE");

  const rooms = (roomRows as any[]).map((row) => ({
    id: Number(row.room_number),
    roomId: Number(row.room_id),
    unitId: Number(row.unit_id),
    displayName: String(row.display_name),
    type: String(row.room_type),
    location: String(row.floor),
    maxGuests: Number(row.max_guests),
  }));

  const quoteMap = new Map<string, any>();
  for (const row of quoteRows as any[]) {
    quoteMap.set(`${String(row.checkin).slice(0, 10)}:${row.room_id}:${row.unit_id}:${row.guests}`, row);
  }

  const days = Array.from({ length: 7 }, (_, index) => {
    const checkin = addDays(today, index + 1);
    const results: Record<string, unknown> = {};
    for (const room of rooms) {
      const byGuests: Record<string, unknown> = {};
      for (let guests = 1; guests <= 5; guests += 1) {
        const row = quoteMap.get(`${checkin}:${room.roomId}:${room.unitId}:${guests}`);
        byGuests[String(guests)] = row ? {
          available: true,
          originalTotal: money(row.original_total),
          directTotal: money(row.direct_total),
          directDiscountPercent: money(row.direct_discount_percent),
          saving: money(row.savings),
          baseTotal: money(row.base_total),
          guestSupplementTotal: money(row.guest_supplement_total),
          kitchenAdjustmentTotal: money(row.kitchen_adjustment_total),
          guestNote: row.guest_note ? String(row.guest_note) : null,
          sourceGeneratedAt: row.source_generated_at,
          syncedAt: row.synced_at,
        } : { available: false };
      }
      results[`${room.roomId}_${room.unitId}`] = { byGuests };
    }
    return { checkin, results };
  });

  const freshness = (quoteRows as any[])
    .map((row) => row.source_generated_at)
    .filter(Boolean)
    .sort()
    .at(-1) || null;

  return {
    ok: true,
    source: "neon_booking_core",
    inventoryStatus,
    rooms,
    days,
    updatedAt: freshness,
    computedAt: new Date().toISOString(),
  };
}

const getCachedDeals = unstable_cache(
  loadDealsFromNeon,
  ["booking-core-deals-v2"],
  {
    tags: [BOOKING_CORE_DEALS_CACHE_TAG],
    revalidate: DEALS_CACHE_REVALIDATE_SECONDS,
  },
);

export async function GET(request: NextRequest) {
  try {
    const today = athensToday();
    const status = await readInventoryStatus(today);
    const stale = status === "STALE_DATA";

    // Never make the visitor wait for Beds24. Stale inventory is still the last
    // complete snapshot: show it immediately and refresh Booking Core after the
    // response. The sync route invalidates the deals cache tag when inventory
    // changes, and the widget re-checks the exact dates live before a request.
    if (status !== "READY" && !stale) {
      return NextResponse.json({
        ok: false,
        code: status,
        error: "Booking inventory is temporarily unavailable.",
        source: "neon_booking_core",
      }, {
        status: 503,
        headers: { "Cache-Control": "no-store" },
      });
    }

    if (stale) {
      const origin = request.nextUrl.origin;
      after(async () => {
        const outcome = await refreshBookingCoreOnDemand(origin);
        if (outcome === "failed") console.error("Live Deals background Booking Core refresh failed");
      });
    }

    const payload = await getCachedDeals(today);

    return NextResponse.json({
      ...payload,
      fresh: !stale,
      refreshing: stale,
      servedAt: new Date().toISOString(),
    }, { headers: { "Cache-Control": stale ? STALE_CACHE_CONTROL : FRESH_CACHE_CONTROL } });
  } catch (error) {
    console.error("booking_core deals failed", error);
    return NextResponse.json({ ok: false, error: "Live availability is temporarily unavailable.", source: "neon_booking_core_error" }, {
      status: 503,
      headers: { "Cache-Control": "no-store" },
    });
  }
}
