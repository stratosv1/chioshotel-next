import "server-only";
import { cache } from "react";
import {
  fetchAndRankBeachMarineComfort,
  type RankedBeachMarineDiagnostic,
} from "@/content/trip-planner/marine-forecast";

/**
 * Public, server-rendered sea-condition outlook for the beach guide pages.
 *
 * It reuses the marine forecast adapter and directional-exposure scoring, but it is
 * exposed only as server-rendered content on the public beach pages. Values are
 * forecast-based estimates, never shoreline measurements or safety guarantees.
 */

export const BEACH_DAY_START_HOUR = 10;
export const BEACH_DAY_END_HOUR = 18;
const TIMEZONE = "Europe/Athens";
const SWITCH_TO_TOMORROW_HOUR = 17;
const OUTLOOK_DAYS = 3;
const FETCH_TIMEOUT_MS = 7000;

export type SeaState = "calm" | "some-waves" | "wavy";

export type BeachDayCondition = {
  beachId: string;
  score: number;
  state: SeaState;
  waveHeightM: number | null;
  waveHeightMaxM: number | null;
  windSpeedKmh: number | null;
  windGustsKmh: number | null;
  windDirectionDeg: number | null;
  beaufort: number | null;
};

export type BeachOutlookDay = {
  /** YYYY-MM-DD in Europe/Athens. */
  date: string;
  /** 0 = today, 1 = tomorrow, ... relative to the Athens calendar date. */
  offsetFromToday: number;
  /** Ranked calmest first. */
  ranked: BeachDayCondition[];
  byId: Record<string, BeachDayCondition>;
  islandWind: {
    directionDeg: number | null;
    beaufort: number | null;
    gustsKmh: number | null;
  };
};

export type BeachSeaOutlook = {
  generatedAt: string;
  days: BeachOutlookDay[];
};

export function seaStateForScore(score: number): SeaState {
  if (score >= 70) return "calm";
  if (score >= 50) return "some-waves";
  return "wavy";
}

export function beaufortFromKmh(kmh: number | null): number | null {
  if (kmh === null || !Number.isFinite(kmh)) return null;
  const limits = [1, 6, 12, 20, 29, 39, 50, 62, 75, 89, 103, 118];
  const index = limits.findIndex((limit) => kmh < limit);
  return index === -1 ? 12 : index;
}

function athensDateParts(date: Date) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-CA", {
      timeZone: TIMEZONE,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      hourCycle: "h23",
    })
      .formatToParts(date)
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value]),
  );
  return { date: `${parts.year}-${parts.month}-${parts.day}`, hour: Number(parts.hour) };
}

function addDays(isoDate: string, days: number) {
  const [year, month, day] = isoDate.split("-").map(Number);
  const value = new Date(Date.UTC(year, month - 1, day + days));
  return value.toISOString().slice(0, 10);
}

function hourStamp(date: string, hour: number) {
  return `${date}T${String(hour).padStart(2, "0")}:00`;
}

function circularMean(values: number[]) {
  if (!values.length) return null;
  const radians = values.map((value) => (value * Math.PI) / 180);
  const x = radians.reduce((sum, value) => sum + Math.cos(value), 0) / radians.length;
  const y = radians.reduce((sum, value) => sum + Math.sin(value), 0) / radians.length;
  if (Math.abs(x) < 1e-6 && Math.abs(y) < 1e-6) return null;
  return Math.round(((Math.atan2(y, x) * 180) / Math.PI + 360) % 360);
}

function median(values: number[]) {
  if (!values.length) return null;
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)];
}

function toCondition(row: RankedBeachMarineDiagnostic): BeachDayCondition {
  const summary = row.forecastSummary;
  return {
    beachId: row.beachId,
    score: row.score,
    state: seaStateForScore(row.score),
    waveHeightM: summary.waveHeightMAvg,
    waveHeightMaxM: summary.waveHeightMMax,
    windSpeedKmh: summary.windSpeedKmhAvg,
    windGustsKmh: summary.windGustsKmhMax,
    windDirectionDeg: summary.windDirectionDeg,
    beaufort: beaufortFromKmh(summary.windSpeedKmhAvg),
  };
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`Timed out after ${ms}ms`)), ms);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error) => {
        clearTimeout(timer);
        reject(error);
      },
    );
  });
}

async function loadDay(date: string, offsetFromToday: number): Promise<BeachOutlookDay> {
  const result = await fetchAndRankBeachMarineComfort({
    startHourLocal: hourStamp(date, BEACH_DAY_START_HOUR),
    endHourLocal: hourStamp(date, BEACH_DAY_END_HOUR),
  });
  const ranked = result.ranked.map(toCondition);
  const windDirections = ranked
    .map((row) => row.windDirectionDeg)
    .filter((value): value is number => typeof value === "number");
  const windSpeeds = ranked
    .map((row) => row.windSpeedKmh)
    .filter((value): value is number => typeof value === "number");
  const gusts = ranked
    .map((row) => row.windGustsKmh)
    .filter((value): value is number => typeof value === "number");

  return {
    date,
    offsetFromToday,
    ranked,
    byId: Object.fromEntries(ranked.map((row) => [row.beachId, row])),
    islandWind: {
      directionDeg: circularMean(windDirections),
      beaufort: beaufortFromKmh(median(windSpeeds)),
      gustsKmh: median(gusts),
    },
  };
}

/**
 * Returns a 3-day beach-hours (10:00–18:00) outlook for all active beaches, or null
 * when the forecast provider is unavailable. Late in the day the outlook starts
 * from tomorrow, because today's beach window is nearly over.
 */
export const getBeachSeaOutlook = cache(async (): Promise<BeachSeaOutlook | null> => {
  const now = athensDateParts(new Date());
  const firstOffset = now.hour >= SWITCH_TO_TOMORROW_HOUR ? 1 : 0;
  const dates = Array.from({ length: OUTLOOK_DAYS }, (_, index) => ({
    date: addDays(now.date, firstOffset + index),
    offset: firstOffset + index,
  }));

  try {
    const days = await withTimeout(
      Promise.all(dates.map((item) => loadDay(item.date, item.offset))),
      FETCH_TIMEOUT_MS,
    );
    if (!days.length || days.some((day) => day.ranked.length === 0)) return null;
    return { generatedAt: new Date().toISOString(), days };
  } catch (error) {
    console.warn("beach sea outlook unavailable", error instanceof Error ? error.message : error);
    return null;
  }
});
