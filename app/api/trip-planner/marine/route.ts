import { NextResponse } from "next/server";
import { fetchAndRankBeachMarineComfort } from "@/content/trip-planner/marine-forecast";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TIMEZONE = "Europe/Athens";
const MAX_WINDOW_HOURS = 8;

function athensNowParts() {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    hourCycle: "h23",
  });
  const parts = Object.fromEntries(
    formatter
      .formatToParts(new Date())
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value]),
  );

  return {
    date: `${parts.year}-${parts.month}-${parts.day}`,
    hour: Number(parts.hour),
  };
}

function parseHour(value: string | null, fallback: number) {
  if (value === null || value === "") return fallback;
  const parsed = Number(value);
  return Number.isInteger(parsed) ? parsed : Number.NaN;
}

function validDate(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function hourStamp(date: string, hour: number) {
  return `${date}T${String(hour).padStart(2, "0")}:00`;
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const now = athensNowParts();
    const date = url.searchParams.get("date") || now.date;
    const defaultStart = Math.min(now.hour, 20);
    const start = parseHour(url.searchParams.get("start"), defaultStart);
    const end = parseHour(
      url.searchParams.get("end"),
      Math.min(defaultStart + 3, 23),
    );

    if (!validDate(date)) {
      return NextResponse.json(
        { ok: false, error: "date must use YYYY-MM-DD." },
        { status: 400 },
      );
    }

    if (
      !Number.isInteger(start) ||
      !Number.isInteger(end) ||
      start < 0 ||
      start > 23 ||
      end < 0 ||
      end > 23 ||
      end < start
    ) {
      return NextResponse.json(
        { ok: false, error: "start/end must be whole hours from 0 to 23, with end >= start." },
        { status: 400 },
      );
    }

    if (end - start + 1 > MAX_WINDOW_HOURS) {
      return NextResponse.json(
        { ok: false, error: `Diagnostic window is limited to ${MAX_WINDOW_HOURS} hours.` },
        { status: 400 },
      );
    }

    const beachIds = (url.searchParams.get("beaches") || "")
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean);

    const result = await fetchAndRankBeachMarineComfort({
      startHourLocal: hourStamp(date, start),
      endHourLocal: hourStamp(date, end),
      beachIds: beachIds.length ? beachIds : undefined,
    });

    return NextResponse.json(
      {
        ok: true,
        purpose: "Trip Planner marine ranking diagnostic",
        disclaimer:
          "Recommendation estimate from forecast plus mapped coastal exposure; not a live shoreline measurement or bathing-safety guarantee.",
        ...result,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "s-maxage=900, stale-while-revalidate=1800",
        },
      },
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown marine forecast error";

    return NextResponse.json(
      {
        ok: false,
        error: message,
        source: "TRIP_PLANNER_MARINE_DIAGNOSTIC",
      },
      { status: 502 },
    );
  }
}
