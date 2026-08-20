import { neon } from "@neondatabase/serverless";
import { NextRequest, NextResponse } from "next/server";
import { localizeRoomOffer } from "@/lib/ai-assistant/room-card-catalog";
import {
  addDaysToIsoDate,
  daysBetweenIsoDates,
  isStrictIsoDate,
} from "@/lib/ai-assistant/room-finder-date";
import type { AssistantLanguage } from "@/lib/ai-assistant/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SUPPORTED = new Set<AssistantLanguage>(["el", "en", "de", "fr", "it", "es", "tr"]);
const MAX_RECOVERY_OFFERS = 3;
const ROOM_ORDER = [2, 6, 5, 7, 1, 3, 4, 8, 9, 10];

const COPY: Record<AssistantLanguage, {
  sameDates: string;
  noChange: string;
  oneChange: string;
  flexible: string;
  together: (guests: number) => string;
  guestLabel: (guests: number) => string;
}> = {
  el: {
    sameDates: "Ίδιες ημερομηνίες · εναλλακτική κατανομή",
    noChange: "Χωρίς αλλαγή δωματίου",
    oneChange: "1 αλλαγή μέσα στη διαμονή",
    flexible: "Ευέλικτη λύση διαμονής",
    together: guests => `Όλοι μαζί · ${guests} άτομα`,
    guestLabel: guests => `${guests} ${guests === 1 ? "άτομο" : "άτομα"}`,
  },
  en: {
    sameDates: "Same dates · alternative room allocation",
    noChange: "No room change",
    oneChange: "1 change during the stay",
    flexible: "Flexible stay solution",
    together: guests => `All together · ${guests} guests`,
    guestLabel: guests => `${guests} ${guests === 1 ? "guest" : "guests"}`,
  },
  de: {
    sameDates: "Gleiche Daten · alternative Zimmeraufteilung",
    noChange: "Kein Zimmerwechsel",
    oneChange: "1 Wechsel während des Aufenthalts",
    flexible: "Flexible Aufenthaltslösung",
    together: guests => `Alle zusammen · ${guests} Gäste`,
    guestLabel: guests => `${guests} ${guests === 1 ? "Gast" : "Gäste"}`,
  },
  fr: {
    sameDates: "Mêmes dates · autre répartition des chambres",
    noChange: "Aucun changement de chambre",
    oneChange: "1 changement pendant le séjour",
    flexible: "Solution de séjour flexible",
    together: guests => `Tous ensemble · ${guests} personnes`,
    guestLabel: guests => `${guests} ${guests === 1 ? "personne" : "personnes"}`,
  },
  it: {
    sameDates: "Stesse date · diversa distribuzione delle camere",
    noChange: "Nessun cambio camera",
    oneChange: "1 cambio durante il soggiorno",
    flexible: "Soluzione di soggiorno flessibile",
    together: guests => `Tutti insieme · ${guests} ospiti`,
    guestLabel: guests => `${guests} ${guests === 1 ? "ospite" : "ospiti"}`,
  },
  es: {
    sameDates: "Mismas fechas · distribución alternativa",
    noChange: "Sin cambio de habitación",
    oneChange: "1 cambio durante la estancia",
    flexible: "Solución de estancia flexible",
    together: guests => `Todos juntos · ${guests} huéspedes`,
    guestLabel: guests => `${guests} ${guests === 1 ? "huésped" : "huéspedes"}`,
  },
  tr: {
    sameDates: "Aynı tarihler · alternatif oda dağılımı",
    noChange: "Oda değişikliği yok",
    oneChange: "Konaklama sırasında 1 değişiklik",
    flexible: "Esnek konaklama çözümü",
    together: guests => `Hep birlikte · ${guests} kişi`,
    guestLabel: guests => `${guests} kişi`,
  },
};

type AvailabilityRow = {
  room_number: number;
  room_id: string;
  unit_id: string;
  display_name: string;
  room_type: string;
  floor: string;
  max_guests: number;
  nights: number;
  original_total: unknown;
  direct_total: unknown;
  savings: unknown;
  breakfast_total_if_added: unknown;
  guest_note?: string | null;
  source_generated_at?: unknown;
  synced_at?: unknown;
};

type QuoteRow = {
  requested_guests: number;
  stay_date: Date | string;
  room_number: number;
  room_id: string;
  unit_id: string;
  display_name: string;
  room_type: string;
  floor: string;
  max_guests: number;
  available: boolean;
  effective_price: unknown;
  guest_note?: string | null;
};

type SegmentChoice = {
  guests: number;
  room: QuoteRow;
  total: number;
};

type SegmentPlan = {
  assignments: SegmentChoice[];
  allocationPenalty: number;
  total: number;
};

function rounded(value: unknown) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.round(parsed * 100) / 100 : 0;
}

function isoDate(value: Date | string) {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return String(value).slice(0, 10);
}

function roomRank(roomNumber: number) {
  const index = ROOM_ORDER.indexOf(roomNumber);
  return index < 0 ? 99 : index;
}

function parseGroups(raw: string) {
  const groups = raw
    .split(",")
    .map(value => Number.parseInt(value.trim(), 10))
    .filter(value => Number.isInteger(value));
  if (groups.length < 2 || groups.length > 3 || groups.some(value => value < 1 || value > 5)) return null;
  return groups;
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
  return new Intl.DateTimeFormat(locale, { day: "2-digit", month: "short", timeZone: "UTC" })
    .format(new Date(Date.UTC(year, month - 1, day)));
}

function sameAllocation(left: number[], right: number[]) {
  const a = [...left].sort((x, y) => y - x);
  const b = [...right].sort((x, y) => y - x);
  return a.length === b.length && a.every((value, index) => value === b[index]);
}

function allocationPenalty(allocation: number[], original: number[]) {
  if (sameAllocation(allocation, original)) return 0;
  const a = [...allocation].sort((x, y) => y - x);
  const b = [...original].sort((x, y) => y - x);
  const length = Math.max(a.length, b.length);
  let difference = Math.abs(a.length - b.length) * 20;
  for (let index = 0; index < length; index += 1) {
    difference += Math.abs((a[index] || 0) - (b[index] || 0));
  }
  return difference;
}

function generateAllocations(totalGuests: number, maxRooms: number, original: number[]) {
  const seen = new Set<string>();
  const allocations: number[][] = [];

  const add = (values: number[]) => {
    const sorted = [...values].sort((a, b) => b - a);
    const key = sorted.join(",");
    if (!seen.has(key)) {
      seen.add(key);
      allocations.push(sorted);
    }
  };

  add(original);

  const build = (slots: number, remaining: number, maxValue: number, current: number[]) => {
    if (slots === 0) {
      if (remaining === 0) add(current);
      return;
    }
    const minRemaining = slots - 1;
    for (let value = Math.min(5, maxValue, remaining - minRemaining); value >= 1; value -= 1) {
      build(slots - 1, remaining - value, value, [...current, value]);
    }
  };

  for (let rooms = 1; rooms <= maxRooms; rooms += 1) {
    if (totalGuests < rooms || totalGuests > rooms * 5) continue;
    build(rooms, totalGuests, 5, []);
  }

  return allocations.sort((left, right) =>
    allocationPenalty(left, original) - allocationPenalty(right, original)
    || left.length - right.length
  );
}

function assignmentSignature(plan: SegmentPlan) {
  return plan.assignments
    .map(item => `${item.room.room_number}:${item.guests}`)
    .sort()
    .join("|");
}

function uniqueRoomNames(assignments: SegmentChoice[], language: AssistantLanguage) {
  return assignments.map(item => {
    const localized = localizeRoomOffer({
      roomId: String(item.room.room_id),
      unitId: String(item.room.unit_id),
      roomNumber: Number(item.room.room_number),
      name: String(item.room.display_name),
      category: String(item.room.room_type),
      floor: String(item.room.floor),
      maxGuests: Number(item.room.max_guests),
      nights: 1,
      originalTotal: item.total,
      directTotal: item.total,
      saving: 0,
      guestNote: item.room.guest_note ? String(item.room.guest_note) : null,
    }, language) as any;
    return { assignment: item, localized };
  });
}

export async function GET(request: NextRequest) {
  try {
    const checkin = request.nextUrl.searchParams.get("checkin") || "";
    const checkout = request.nextUrl.searchParams.get("checkout") || "";
    const groups = parseGroups(request.nextUrl.searchParams.get("groups") || "");
    const requestedLanguage = request.nextUrl.searchParams.get("lang") as AssistantLanguage | null;
    const language: AssistantLanguage = requestedLanguage && SUPPORTED.has(requestedLanguage) ? requestedLanguage : "en";

    if (!isStrictIsoDate(checkin) || !isStrictIsoDate(checkout) || checkout <= checkin || !groups) {
      return NextResponse.json(
        { success: false, code: "INVALID_REQUEST", message: "Invalid sales recovery request." },
        { status: 400, headers: { "Cache-Control": "no-store" } },
      );
    }

    const nights = daysBetweenIsoDates(checkin, checkout);
    const totalGuests = groups.reduce((sum, value) => sum + value, 0);
    if (!Number.isInteger(nights) || nights < 1 || nights > 30 || totalGuests < 2 || totalGuests > 15) {
      return NextResponse.json(
        { success: false, code: "INVALID_STAY", message: "Unsupported sales recovery stay." },
        { status: 400, headers: { "Cache-Control": "no-store" } },
      );
    }

    if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is missing");
    const sql = neon(process.env.DATABASE_URL);

    const statusRows = await sql`select * from booking_core.inventory_status(${checkin}::date, ${checkout}::date)`;
    const status = String((statusRows[0] as any)?.status || "DATA_UNAVAILABLE");
    if (status !== "READY") {
      return NextResponse.json(
        { success: false, code: status, message: "Booking inventory is temporarily unavailable." },
        { status: 503, headers: { "Cache-Control": "no-store" } },
      );
    }

    const copy = COPY[language];
    const consolidatedOffers: any[] = [];

    if (totalGuests <= 5) {
      const rows = await sql`select * from booking_core.search_availability(${checkin}::date, ${checkout}::date, ${totalGuests})` as AvailabilityRow[];
      for (const row of rows) {
        const localized = localizeRoomOffer({
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
        }, language) as any;

        consolidatedOffers.push({
          ...localized,
          roomId: `recovery:consolidated:${row.room_number}`,
          unitId: `recovery:${row.room_id}:${row.unit_id}`,
          roomNumber: 0,
          name: `${localized.name} · ${copy.together(totalGuests)}`,
          category: copy.sameDates,
          floor: copy.noChange,
          maxGuests: totalGuests,
          features: [copy.together(totalGuests), ...(localized.features || [])].slice(0, 4),
          recoveryType: "consolidated",
          recoveryRoomCount: 1,
          recoverySummary: `${shortDate(checkin, language)}–${shortDate(checkout, language)} · ${localized.name} · ${copy.guestLabel(totalGuests)}`,
        });
      }

      consolidatedOffers.sort((left, right) =>
        Number(left.directTotal) - Number(right.directTotal)
        || roomRank(Number(String(left.unitId).split(":").at(-2) || 0)) - roomRank(Number(String(right.unitId).split(":").at(-2) || 0))
      );
    }

    const splitOffers: any[] = [];

    if (nights >= 2) {
      const [quoteRows, settingRows] = await Promise.all([
        sql`
          select g.requested_guests, q.*
          from generate_series(1, 5) as g(requested_guests)
          cross join lateral booking_core.nightly_quotes(${checkin}::date, ${checkout}::date, g.requested_guests) q
        ` as Promise<QuoteRow[]>,
        sql`
          select setting_key, numeric_value
          from booking_core.settings
          where setting_key in (
            'direct_discount_percent',
            'split_stay_extra_discount_percent',
            'breakfast_per_person_per_night'
          )
        ` as Promise<Array<{ setting_key: string; numeric_value: unknown }>>,
      ]);

      const settings = new Map(settingRows.map(row => [row.setting_key, Number(row.numeric_value)]));
      const directDiscount = Number.isFinite(settings.get("direct_discount_percent"))
        ? Number(settings.get("direct_discount_percent"))
        : 10;
      const splitDiscount = Number.isFinite(settings.get("split_stay_extra_discount_percent"))
        ? Number(settings.get("split_stay_extra_discount_percent"))
        : 10;
      const breakfastPrice = Number.isFinite(settings.get("breakfast_per_person_per_night"))
        ? Number(settings.get("breakfast_per_person_per_night"))
        : 12;

      const rowsByGuestRoom = new Map<string, QuoteRow[]>();
      for (const row of quoteRows) {
        const key = `${Number(row.requested_guests)}:${Number(row.room_number)}`;
        const list = rowsByGuestRoom.get(key) || [];
        list.push(row);
        rowsByGuestRoom.set(key, list);
      }

      const allocations = generateAllocations(totalGuests, groups.length, groups);

      const roomChoicesForSegment = (guests: number, start: string, end: string) => {
        const expectedNights = daysBetweenIsoDates(start, end);
        const choices: SegmentChoice[] = [];
        for (let roomNumber = 1; roomNumber <= 10; roomNumber += 1) {
          const rows = (rowsByGuestRoom.get(`${guests}:${roomNumber}`) || [])
            .filter(row => {
              const date = isoDate(row.stay_date);
              return date >= start && date < end;
            })
            .sort((left, right) => isoDate(left.stay_date).localeCompare(isoDate(right.stay_date)));
          if (rows.length !== expectedNights) continue;
          if (!rows.every(row => Boolean(row.available) && rounded(row.effective_price) > 0)) continue;
          choices.push({
            guests,
            room: rows[0],
            total: rounded(rows.reduce((sum, row) => sum + rounded(row.effective_price), 0)),
          });
        }
        return choices.sort((left, right) => left.total - right.total || roomRank(left.room.room_number) - roomRank(right.room.room_number));
      };

      const buildSegmentPlans = (start: string, end: string) => {
        const plans: SegmentPlan[] = [];
        const planSignatures = new Set<string>();

        for (const allocation of allocations) {
          const optionSets = allocation.map(guests => roomChoicesForSegment(guests, start, end));
          if (optionSets.some(options => options.length === 0)) continue;

          const walk = (index: number, usedRooms: Set<number>, assignments: SegmentChoice[]) => {
            if (plans.length >= 30) return;
            if (index === optionSets.length) {
              const plan: SegmentPlan = {
                assignments: [...assignments],
                allocationPenalty: allocationPenalty(allocation, groups),
                total: rounded(assignments.reduce((sum, item) => sum + item.total, 0)),
              };
              const signature = assignmentSignature(plan);
              if (!planSignatures.has(signature)) {
                planSignatures.add(signature);
                plans.push(plan);
              }
              return;
            }

            for (const choice of optionSets[index].slice(0, 8)) {
              if (usedRooms.has(choice.room.room_number)) continue;
              usedRooms.add(choice.room.room_number);
              assignments.push(choice);
              walk(index + 1, usedRooms, assignments);
              assignments.pop();
              usedRooms.delete(choice.room.room_number);
            }
          };

          walk(0, new Set<number>(), []);
        }

        return plans
          .sort((left, right) => left.allocationPenalty - right.allocationPenalty || left.total - right.total)
          .slice(0, 10);
      };

      const candidates: Array<{
        changeDate: string;
        first: SegmentPlan;
        second: SegmentPlan;
        score: number;
      }> = [];
      const seenCandidates = new Set<string>();

      for (let offset = 1; offset < nights; offset += 1) {
        const changeDate = addDaysToIsoDate(checkin, offset);
        const firstPlans = buildSegmentPlans(checkin, changeDate);
        const secondPlans = buildSegmentPlans(changeDate, checkout);

        for (const first of firstPlans) {
          for (const second of secondPlans) {
            if (assignmentSignature(first) === assignmentSignature(second)) continue;

            const firstRooms = new Set(first.assignments.map(item => item.room.room_number));
            const secondRooms = new Set(second.assignments.map(item => item.room.room_number));
            const overlap = [...firstRooms].filter(room => secondRooms.has(room)).length;
            const continuityPenalty = firstRooms.size + secondRooms.size - (2 * overlap);
            const originalTotal = rounded(first.total + second.total);
            const score = (first.allocationPenalty + second.allocationPenalty) * 100000
              + continuityPenalty * 10000
              + originalTotal;
            const signature = `${changeDate}:${assignmentSignature(first)}>${assignmentSignature(second)}`;
            if (seenCandidates.has(signature)) continue;
            seenCandidates.add(signature);
            candidates.push({ changeDate, first, second, score });
          }
        }
      }

      candidates.sort((left, right) => left.score - right.score);

      for (const candidate of candidates.slice(0, 8)) {
        const firstLocalized = uniqueRoomNames(candidate.first.assignments, language);
        const secondLocalized = uniqueRoomNames(candidate.second.assignments, language);
        const firstName = firstLocalized.map(item => item.localized.name).join(" + ");
        const secondName = secondLocalized.map(item => item.localized.name).join(" + ");
        const firstDetail = `${shortDate(checkin, language)}–${shortDate(candidate.changeDate, language)}: ${firstLocalized.map(item => `${item.localized.name} (${copy.guestLabel(item.assignment.guests)})`).join(" + ")}`;
        const secondDetail = `${shortDate(candidate.changeDate, language)}–${shortDate(checkout, language)}: ${secondLocalized.map(item => `${item.localized.name} (${copy.guestLabel(item.assignment.guests)})`).join(" + ")}`;
        const originalTotal = rounded(candidate.first.total + candidate.second.total);
        const directTotal = rounded(originalTotal * (1 - directDiscount / 100) * (1 - splitDiscount / 100));
        const saving = rounded(originalTotal - directTotal);
        const images = [...firstLocalized, ...secondLocalized]
          .map(item => item.localized.image)
          .filter(Boolean);
        const gallery = [...new Set(images)];
        const firstRoom = firstLocalized[0]?.localized;
        if (!firstRoom) continue;

        splitOffers.push({
          roomId: `recovery:split:${candidate.changeDate}:${candidate.first.assignments.map(item => item.room.room_number).join("-")}:${candidate.second.assignments.map(item => item.room.room_number).join("-")}`,
          unitId: `recovery:split:${candidate.changeDate}`,
          roomNumber: 0,
          name: `${firstName} → ${secondName}`,
          category: copy.flexible,
          floor: copy.oneChange,
          maxGuests: totalGuests,
          features: [firstDetail, secondDetail, copy.sameDates],
          image: firstRoom.image,
          gallery: gallery.length ? gallery : [firstRoom.image],
          detailsUrl: firstRoom.detailsUrl,
          nights,
          originalTotal,
          directTotal,
          saving,
          breakfastTotalIfAdded: rounded(breakfastPrice * totalGuests * nights),
          recoveryType: "split",
          recoveryRoomCount: Math.max(candidate.first.assignments.length, candidate.second.assignments.length),
          recoverySummary: `${firstDetail}; ${secondDetail}`,
        });
      }
    }

    const selected: any[] = [];
    if (consolidatedOffers.length > 0) {
      selected.push(...consolidatedOffers.slice(0, 2));
      if (splitOffers.length > 0 && selected.length < MAX_RECOVERY_OFFERS) selected.push(splitOffers[0]);
      if (selected.length < MAX_RECOVERY_OFFERS) {
        selected.push(...consolidatedOffers.slice(2, MAX_RECOVERY_OFFERS - selected.length + 2));
      }
    } else {
      selected.push(...splitOffers.slice(0, MAX_RECOVERY_OFFERS));
    }

    return NextResponse.json(
      {
        success: true,
        requested: { checkin, checkout, groups, totalGuests },
        language,
        offers: selected.slice(0, MAX_RECOVERY_OFFERS),
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("AI Room Finder sales recovery search failed", error);
    return NextResponse.json(
      { success: false, code: "RECOVERY_UNAVAILABLE", message: "Sales recovery search failed." },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
