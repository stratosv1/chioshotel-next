import type { Metadata } from "next";
import { DayPlanner } from "@/components/trip-planner/DayPlanner";
import { getBeachSeaOutlook } from "@/lib/beach-conditions/outlook";
import type { SeaDay } from "@/lib/trip-planner/day-plan";

export const metadata: Metadata = {
  title: "Chios Day Planner | Voulamandis House",
  description: "Η εκδρομή της ημέρας στη Χίο, με βάση τη θάλασσα της ημέρας.",
  robots: { index: false, follow: false },
};

function athensNow() {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-CA", {
      timeZone: "Europe/Athens",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    })
      .formatToParts(new Date())
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value]),
  );
  return { date: `${parts.year}-${parts.month}-${parts.day}`, minutes: Number(parts.hour) * 60 + Number(parts.minute) };
}

function addDays(isoDate: string, days: number) {
  const [y, m, d] = isoDate.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d + days)).toISOString().slice(0, 10);
}

type PageProps = { searchParams: Promise<{ src?: string }> };

// Internal tool for guests (breakfast QR); intentionally noindex and not linked from public pages.
export default async function TripPlannerPage({ searchParams }: PageProps) {
  const { src } = await searchParams;
  const now = athensNow();
  const outlook = await getBeachSeaOutlook();

  const seaDays: SeaDay[] = outlook
    ? outlook.days.map((day) => ({
        date: day.date,
        offsetFromToday: day.offsetFromToday,
        islandWind: { directionDeg: day.islandWind.directionDeg, beaufort: day.islandWind.beaufort },
        beaches: Object.fromEntries(
          day.ranked.map((row) => [
            row.beachId,
            { score: row.score, state: row.state, waveHeightM: row.waveHeightM, beaufort: row.beaufort, windDirectionDeg: row.windDirectionDeg },
          ]),
        ),
      }))
    : [0, 1, 2].map((offset) => ({
        date: addDays(now.date, offset),
        offsetFromToday: offset,
        islandWind: { directionDeg: null, beaufort: null },
        beaches: {},
      }));

  const source = typeof src === "string" && /^[a-z0-9-]{1,30}$/i.test(src) ? src : null;

  return <DayPlanner seaDays={seaDays} nowMinutes={now.minutes} source={source} />;
}
