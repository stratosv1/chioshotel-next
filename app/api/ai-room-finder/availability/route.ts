import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { localizeRoomOffer } from "@/lib/ai-assistant/room-card-catalog";
import { isStrictIsoDate } from "@/lib/ai-assistant/room-finder-date";
import type { AssistantLanguage } from "@/lib/ai-assistant/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const supported = new Set<AssistantLanguage>(["el", "en", "de", "fr", "it", "es", "tr"]);
const ON_DEMAND_SYNC_TIMEOUT_MS = 55_000;

const SPLIT_COPY: Record<AssistantLanguage, { category: string; change: string; discount: string }> = {
  el: { category: "Λύση split stay επειδή δεν υπάρχει ένα δωμάτιο για όλες τις νύχτες", change: "1 αλλαγή δωματίου", discount: "Περιλαμβάνεται επιπλέον έκπτωση split stay" },
  en: { category: "Split-stay solution because one room is not available for every night", change: "1 room change", discount: "Extra split-stay discount included" },
  de: { category: "Split-Stay-Lösung, da kein Zimmer für alle Nächte verfügbar ist", change: "1 Zimmerwechsel", discount: "Zusätzlicher Split-Stay-Rabatt enthalten" },
  fr: { category: "Solution split stay car une seule chambre n’est pas disponible pour toutes les nuits", change: "1 changement de chambre", discount: "Remise split stay supplémentaire incluse" },
  it: { category: "Soluzione split stay perché non c’è una sola camera disponibile per tutte le notti", change: "1 cambio camera", discount: "Sconto split stay aggiuntivo incluso" },
  es: { category: "Solución split stay porque no hay una sola habitación disponible para todas las noches", change: "1 cambio de habitación", discount: "Descuento split stay adicional incluido" },
  tr: { category: "Tüm geceler için tek oda bulunmadığından split stay çözümü", change: "1 oda değişikliği", discount: "Ek split stay indirimi dahildir" },
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

async function refreshBookingCoreOnDemand(request: NextRequest) {
  const secret = String(process.env.CRON_SECRET || "").trim();
  if (!secret) {
    console.error("AI Room Finder cannot refresh stale booking inventory because CRON_SECRET is missing");
    return false;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), ON_DEMAND_SYNC_TIMEOUT_MS);

  try {
    const syncUrl = new URL("/api/booking-core/sync/", request.nextUrl.origin);
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
      console.error("AI Room Finder on-demand Booking Core sync failed", response.status, raw.slice(0, 500));
      return false;
    }

    try {
      const payload = JSON.parse(raw) as { ok?: boolean };
      return payload.ok === true;
    } catch {
      console.error("AI Room Finder on-demand Booking Core sync returned invalid JSON");
      return false;
    }
  } catch (error) {
    console.error("AI Room Finder on-demand Booking Core sync failed", error);
    return false;
  } finally {
    clearTimeout(timeout);
  }
}

export async function GET(request: NextRequest) {
  try {
    const checkin = request.nextUrl.searchParams.get("checkin") || "";
    const checkout = request.nextUrl.searchParams.get("checkout") || "";
    const guests = Number.parseInt(request.nextUrl.searchParams.get("guests") || "0", 10);
    const allowSplit = request.nextUrl.searchParams.get("allowSplit") === "1";
    const requestedLanguage = request.nextUrl.searchParams.get("lang") as AssistantLanguage | null;
    const language: AssistantLanguage = requestedLanguage && supported.has(requestedLanguage) ? requestedLanguage : "en";

    if (!isStrictIsoDate(checkin) || !isStrictIsoDate(checkout) || checkout <= checkin || !Number.isInteger(guests) || guests < 1 || guests > 5) {
      return NextResponse.json({ success: false, message: "Invalid availability request." }, { status: 400 });
    }

    if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is missing");
    const sql = neon(process.env.DATABASE_URL);
    let statusRows = await sql`select * from booking_core.inventory_status(${checkin}::date, ${checkout}::date)`;
    let status = String((statusRows[0] as any)?.status || "DATA_UNAVAILABLE");

    // Idle-cost optimization: there is no scheduled Neon heartbeat anymore.
    // When inventory freshness has naturally expired, refresh it only because a
    // real guest is asking for availability, then re-check the database status.
    if (status === "STALE_DATA") {
      const refreshed = await refreshBookingCoreOnDemand(request);
      if (refreshed) {
        statusRows = await sql`select * from booking_core.inventory_status(${checkin}::date, ${checkout}::date)`;
        status = String((statusRows[0] as any)?.status || "DATA_UNAVAILABLE");
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
        const splitOffer = {
          roomId: `split:${first.roomId}:${second.roomId}`,
          unitId: `${first.unitId}:${second.unitId}:${changeDate}`,
          roomNumber: 0,
          name: `${first.name} → ${second.name}`,
          category: split.category,
          floor: split.change,
          maxGuests: guests,
          features: [
            `${first.name}: ${shortDate(checkin, language)}–${shortDate(changeDate, language)}`,
            `${second.name}: ${shortDate(changeDate, language)}–${shortDate(checkout, language)}`,
            split.discount,
          ],
          image: first.image,
          gallery: [first.image, second.image].filter(Boolean),
          detailsUrl: first.detailsUrl,
          nights: Number(row.first_nights) + Number(row.second_nights),
          originalTotal: rounded(row.original_total),
          directTotal: rounded(row.split_total),
          saving: rounded(row.savings),
          breakfastTotalIfAdded: rounded(row.breakfast_total_if_added),
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
