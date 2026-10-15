import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { localizeRoomOffer } from "@/lib/ai-assistant/room-card-catalog";
import { daysBetweenIsoDates, isStrictIsoDate, todayInAthensIso } from "@/lib/ai-assistant/room-finder-date";
import { checkPublicRateLimit } from "@/lib/ai-assistant/public-rate-limit";
import { bookingCoreSyncUrl } from "@/lib/booking-core/sync-url";
import type { AssistantLanguage } from "@/lib/ai-assistant/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const supported = new Set<AssistantLanguage>(["el", "en", "de", "fr", "it", "es", "tr"]);
// Keep the on-demand refresh well inside maxDuration (60s) so there is time
// left to re-check inventory and run the search afterwards.
const ON_DEMAND_SYNC_TIMEOUT_MS = 40_000;
// When another refresh is already running (SOURCE_BUSY) or the refresh call
// timed out, wait for it to finish instead of failing the guest's search.
const REFRESH_WAIT_DEADLINE_MS = 50_000;
const REFRESH_POLL_INTERVAL_MS = 3_000;
// SOURCE_NOT_READY means the Google Apps Script source is still building its
// snapshot (or is recovering from a stuck refresh). Nothing else will pull the
// snapshot into Neon, so ask the source again a few times instead of failing
// the guest's search on the first attempt. Kept shorter than the busy wait so
// a source that is genuinely down still answers the guest in reasonable time.
const NOT_READY_RETRY_INTERVAL_MS = 5_000;
const NOT_READY_DEADLINE_MS = 30_000;
// Same stay-length rule as /api/ai-room-finder/alternatives and the chat flow.
const MAX_STAY_NIGHTS = 60;
const RATE_LIMITS = { perMinute: 60, perHour: 300 };

type RefreshOutcome = "refreshed" | "busy" | "not_ready" | "failed";

const wait = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms));

const SPLIT_COPY: Record<AssistantLanguage, { category: string; change: string; discount: string; guests: (count: number) => string }> = {
  el: { category: "Λύση split stay επειδή δεν υπάρχει ένα δωμάτιο για όλες τις νύχτες", change: "1 αλλαγή δωματίου", discount: "Περιλαμβάνεται επιπλέον έκπτωση split stay", guests: count => `${count} ${count === 1 ? "άτομο" : "άτομα"}` },
  en: { category: "Split-stay solution because one room is not available for every night", change: "1 room change", discount: "Extra split-stay discount included", guests: count => `${count} ${count === 1 ? "guest" : "guests"}` },
  de: { category: "Split-Stay-Lösung, da kein Zimmer für alle Nächte verfügbar ist", change: "1 Zimmerwechsel", discount: "Zusätzlicher Split-Stay-Rabatt enthalten", guests: count => `${count} ${count === 1 ? "Gast" : "Gäste"}` },
  fr: { category: "Solution split stay car une seule chambre n’est pas disponible pour toutes les nuits", change: "1 changement de chambre", discount: "Remise split stay supplémentaire incluse", guests: count => `${count} ${count === 1 ? "personne" : "personnes"}` },
  it: { category: "Soluzione split stay perché non c’è una sola camera disponibile per tutte le notti", change: "1 cambio camera", discount: "Sconto split stay aggiuntivo incluso", guests: count => `${count} ${count === 1 ? "ospite" : "ospiti"}` },
  es: { category: "Solución split stay porque no hay una sola habitación disponible para todas las noches", change: "1 cambio de habitación", discount: "Descuento split stay adicional incluido", guests: count => `${count} ${count === 1 ? "huésped" : "huéspedes"}` },
  tr: { category: "Tüm geceler için tek oda bulunmadığından split stay çözümü", change: "1 oda değişikliği", discount: "Ek split stay indirimi dahildir", guests: count => `${count} kişi` },
};

function rounded(value: unknown) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.round(parsed * 100) / 100 : 0;
}

function isoDate(value: unknown) {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  const raw = String(value ?? "").trim();
  const prefix = raw.match(/^\d{4}-\d{2}-\d{2}/)?.[0];
  if (prefix) return prefix;
  const parsed = new Date(raw);
  return Number.isNaN(parsed.getTime()) ? "" : parsed.toISOString().slice(0, 10);
}

function shortDate(value: string, language: AssistantLanguage) {
  const [year, month, day] = value.split("-").map(Number);
  const locale = {
    el: "el-GR",
    en: "en-GB",
    de: "de-DE",
    fr: "fr-FR",
    it: "it-IT",
    es: "es-ES",
    tr: "tr-TR",
  }[language];
  return new Intl.DateTimeFormat(locale, { day: "2-digit", month: "2-digit", timeZone: "UTC" })
    .format(new Date(Date.UTC(year, month - 1, day)));
}

async function refreshBookingCoreOnDemand(request: NextRequest, timeoutMs = ON_DEMAND_SYNC_TIMEOUT_MS): Promise<RefreshOutcome> {
  const secret = String(process.env.CRON_SECRET || "").trim();
  if (!secret) {
    console.error("AI Room Finder cannot refresh stale booking inventory because CRON_SECRET is missing");
    return "failed";
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const syncUrl = bookingCoreSyncUrl(request.nextUrl.origin);
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
      // Another refresh is already running; it will update the inventory.
      if (raw.includes("SOURCE_BUSY")) {
        console.warn("AI Room Finder on-demand Booking Core sync skipped: source refresh already running");
        return "busy";
      }
      // The source has no completed snapshot yet; retried by the caller.
      if (raw.includes("SOURCE_NOT_READY")) {
        console.warn("AI Room Finder on-demand Booking Core sync: source not ready yet, will retry");
        return "not_ready";
      }
      console.error("AI Room Finder on-demand Booking Core sync failed", response.status, raw.slice(0, 500));
      return "failed";
    }

    try {
      const payload = JSON.parse(raw) as { ok?: boolean };
      return payload.ok === true ? "refreshed" : "failed";
    } catch {
      console.error("AI Room Finder on-demand Booking Core sync returned invalid JSON");
      return "failed";
    }
  } catch (error) {
    // A timed-out call may still finish in the sync function itself.
    if (error instanceof Error && error.name === "AbortError") {
      console.warn("AI Room Finder on-demand Booking Core sync is still running after timeout; waiting for inventory");
      return "busy";
    }
    console.error("AI Room Finder on-demand Booking Core sync failed", error);
    return "failed";
  } finally {
    clearTimeout(timeout);
  }
}

export async function GET(request: NextRequest) {
  const startedAt = Date.now();
  try {
    const rateLimit = await checkPublicRateLimit(request, "room-finder:availability", RATE_LIMITS);
    if (rateLimit.limited) {
      return NextResponse.json(
        { success: false, code: "RATE_LIMITED", message: "Too many availability requests. Please try again shortly." },
        { status: 429, headers: { "Retry-After": String(rateLimit.retryAfterSeconds), "Cache-Control": "no-store" } },
      );
    }

    const checkin = request.nextUrl.searchParams.get("checkin") || "";
    const checkout = request.nextUrl.searchParams.get("checkout") || "";
    const guests = Number.parseInt(request.nextUrl.searchParams.get("guests") || "0", 10);
    const allowSplit = request.nextUrl.searchParams.get("allowSplit") === "1";
    const requestedLanguage = request.nextUrl.searchParams.get("lang") as AssistantLanguage | null;
    const language: AssistantLanguage = requestedLanguage && supported.has(requestedLanguage) ? requestedLanguage : "en";

    if (!isStrictIsoDate(checkin) || !isStrictIsoDate(checkout) || checkout <= checkin || !Number.isInteger(guests) || guests < 1 || guests > 5) {
      return NextResponse.json({ success: false, message: "Invalid availability request." }, { status: 400 });
    }

    const nights = daysBetweenIsoDates(checkin, checkout);
    if (checkin < todayInAthensIso() || !Number.isInteger(nights) || nights > MAX_STAY_NIGHTS) {
      return NextResponse.json(
        { success: false, code: "INVALID_STAY", message: "Unsupported stay dates." },
        { status: 400, headers: { "Cache-Control": "no-store" } },
      );
    }

    if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is missing");
    const sql = neon(process.env.DATABASE_URL);
    let statusRows = await sql`select * from booking_core.inventory_status(${checkin}::date, ${checkout}::date)`;
    let status = String((statusRows[0] as any)?.status || "DATA_UNAVAILABLE");

    // Idle-cost optimization: there is no scheduled Neon heartbeat anymore.
    // When inventory freshness has naturally expired, refresh it only because a
    // real guest is asking for availability, then re-check the database status.
    if (status === "STALE_DATA") {
      const readStatus = async () => {
        statusRows = await sql`select * from booking_core.inventory_status(${checkin}::date, ${checkout}::date)`;
        status = String((statusRows[0] as any)?.status || "DATA_UNAVAILABLE");
      };
      const elapsed = () => Date.now() - startedAt;

      let outcome = await refreshBookingCoreOnDemand(request);
      if (outcome !== "failed") await readStatus();

      // Wait for fresh inventory rather than telling the guest that it is
      // unavailable:
      // - "busy": a refresh started elsewhere (or our timed-out call) is still
      //   running and will write the inventory; poll the database.
      // - "refreshed": our refresh succeeded but the status has not caught up.
      // - "not_ready": the source is still preparing its snapshot; ask it again.
      // Only a hard failure stops immediately.
      while (outcome !== "failed" && status === "STALE_DATA") {
        if (outcome === "not_ready") {
          if (elapsed() + NOT_READY_RETRY_INTERVAL_MS >= NOT_READY_DEADLINE_MS) break;
          await wait(NOT_READY_RETRY_INTERVAL_MS);
          const remaining = REFRESH_WAIT_DEADLINE_MS - elapsed();
          outcome = await refreshBookingCoreOnDemand(request, Math.max(1_000, Math.min(ON_DEMAND_SYNC_TIMEOUT_MS, remaining)));
          if (outcome !== "failed") await readStatus();
          continue;
        }
        if (elapsed() + REFRESH_POLL_INTERVAL_MS >= REFRESH_WAIT_DEADLINE_MS) break;
        await wait(REFRESH_POLL_INTERVAL_MS);
        await readStatus();
      }

      if (status === "STALE_DATA") {
        console.error(JSON.stringify({
          level: "error",
          msg: "ai_room_finder_inventory_still_stale",
          route: "/api/ai-room-finder/availability",
          lastRefreshOutcome: outcome,
          ms: elapsed(),
        }));
      }
    }

    if (status !== "READY") {
      return NextResponse.json({ success: false, code: status, message: "Booking inventory is temporarily unavailable." }, { status: 503, headers: { "Cache-Control": "no-store" } });
    }

    const rows = await sql`select * from booking_core.search_availability(${checkin}::date, ${checkout}::date, ${guests})`;
    const offers = (rows as any[]).map((row) => localizeRoomOffer({
      roomId: String(row.room_id),
      unitId: String(row.unit_id),
      roomNumber: Number(row.room_number),
      name: String(row.display_name),
      category: String(row.room_type),
      floor: String(row.floor),
      maxGuests: Number(row.max_guests),
      nights: Number(row.nights),
      originalTotal: rounded(row.original_total),
      directTotal: rounded(row.direct_total),
      saving: rounded(row.savings),
      breakfastTotalIfAdded: rounded(row.breakfast_total_if_added),
      guestNote: row.guest_note ? String(row.guest_note) : null,
      sourceGeneratedAt: row.source_generated_at,
      syncedAt: row.synced_at,
    }, language));

    if (offers.length === 0 && allowSplit) {
      const splitRows = await sql`
        select
          s.*,
          r1.room_id::text as first_room_id,
          r1.unit_id::text as first_unit_id,
          r1.display_name as first_name,
          r1.room_type as first_category,
          r1.floor as first_floor,
          r1.max_guests as first_max_guests,
          r2.room_id::text as second_room_id,
          r2.unit_id::text as second_unit_id,
          r2.display_name as second_name,
          r2.room_type as second_category,
          r2.floor as second_floor,
          r2.max_guests as second_max_guests
        from booking_core.search_split_stay(${checkin}::date, ${checkout}::date, ${guests}) s
        join booking_core.rooms r1 on r1.room_number = s.first_room_number
        join booking_core.rooms r2 on r2.room_number = s.second_room_number
        order by s.split_total, s.first_room_number, s.second_room_number, s.change_date
        limit 1
      `;

      const row = (splitRows as any[])[0];
      if (row) {
        const changeDate = isoDate(row.change_date);
        const first = localizeRoomOffer({
          roomId: String(row.first_room_id),
          unitId: String(row.first_unit_id),
          roomNumber: Number(row.first_room_number),
          name: String(row.first_name),
          category: String(row.first_category),
          floor: String(row.first_floor),
          maxGuests: Number(row.first_max_guests),
          nights: Number(row.first_nights),
          originalTotal: rounded(row.first_total),
          directTotal: rounded(row.first_total),
          saving: 0,
          guestNote: row.first_guest_note ? String(row.first_guest_note) : null,
        }, language) as any;
        const second = localizeRoomOffer({
          roomId: String(row.second_room_id),
          unitId: String(row.second_unit_id),
          roomNumber: Number(row.second_room_number),
          name: String(row.second_name),
          category: String(row.second_category),
          floor: String(row.second_floor),
          maxGuests: Number(row.second_max_guests),
          nights: Number(row.second_nights),
          originalTotal: rounded(row.second_total),
          directTotal: rounded(row.second_total),
          saving: 0,
          guestNote: row.second_guest_note ? String(row.second_guest_note) : null,
        }, language) as any;
        const split = SPLIT_COPY[language];
        // Same segment format as the multi-room split offers from
        // /api/ai-room-finder/sales-recovery ("start–end: Room (N guests)"),
        // so the chat renders it as a split solution (both rooms, a narrative
        // of the room change) and the change date reaches staff and email.
        const firstSegment = `${shortDate(checkin, language)}–${shortDate(changeDate, language)}: ${first.name} (${split.guests(guests)})`;
        const secondSegment = `${shortDate(changeDate, language)}–${shortDate(checkout, language)}: ${second.name} (${split.guests(guests)})`;
        const splitOffer = {
          roomId: `split:${first.roomId}:${second.roomId}`,
          unitId: `${first.unitId}:${second.unitId}:${changeDate}`,
          roomNumber: 0,
          name: `${first.name} → ${second.name}`,
          category: split.category,
          floor: split.change,
          maxGuests: guests,
          features: [firstSegment, secondSegment, split.discount],
          image: first.image,
          gallery: [first.image, second.image].filter(Boolean),
          detailsUrl: first.detailsUrl,
          nights: Number(row.first_nights) + Number(row.second_nights),
          originalTotal: rounded(row.original_total),
          directTotal: rounded(row.split_total),
          saving: rounded(row.savings),
          breakfastTotalIfAdded: rounded(row.breakfast_total_if_added),
          recoveryType: "split",
          recoveryRoomCount: 1,
          recoverySummary: `${firstSegment}; ${secondSegment}`,
        };

        return NextResponse.json({ success: true, checkin, checkout, guests, language, offers: [splitOffer], splitStay: true }, { headers: { "Cache-Control": "no-store" } });
      }
    }

    return NextResponse.json({ success: true, checkin, checkout, guests, language, offers, splitStay: false }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("AI Room Finder availability failed", error);
    return NextResponse.json({ success: false, message: "Availability search failed." }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}
