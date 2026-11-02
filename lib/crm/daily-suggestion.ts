import "server-only";
import { beachesById } from "@/content/trip-planner/beaches";
import { dayTripAreas } from "@/content/trip-planner/day-trips";
import { getBeachSeaOutlook } from "@/lib/beach-conditions/outlook";
import { buildDayPlan, defaultPicks, rankAreas, rankBeachOptions, type SeaDay } from "@/lib/trip-planner/day-plan";
import type { DailySuggestion, EmailLanguage } from "@/lib/crm/guest-email-templates";

// Planner content is Greek-only, so English and Turkish emails use these titles.
const AREA_TITLES: Record<string, Record<"en" | "tr", string>> = {
  south: { en: "Mastic villages & Mavra Volia", tr: "Sakız köyleri ve Mavra Volia" },
  southwest: { en: "Mesta, Olympi & Salagona", tr: "Mesta, Olimpi ve Salagona" },
  west: { en: "Nea Moni, Anavatos & Lithi", tr: "Nea Moni, Anavatos ve Lithi" },
  northwest: { en: "Volissos & the northern beaches", tr: "Volissos ve kuzey plajları" },
  northeast: { en: "Daskalopetra, Nagos & Lagada", tr: "Daskalopetra, Nagos ve Lagada" },
  near: { en: "A relaxed day near Kambos", tr: "Kambos yakınında sakin bir gün" },
};

const TOP_AREAS = 3;

// Late in the day the outlook starts from tomorrow; previews may use that day.
export async function loadTodaySeaDay(date: string, allowNextDay = false): Promise<SeaDay | null> {
  const outlook = await getBeachSeaOutlook();
  const day = outlook?.days.find((item) => item.date === date) ?? (allowNextDay ? outlook?.days[0] : undefined);
  if (!day) return null;
  return {
    date: day.date,
    offsetFromToday: day.offsetFromToday,
    islandWind: { directionDeg: day.islandWind.directionDeg, beaufort: day.islandWind.beaufort },
    beaches: Object.fromEntries(day.ranked.map((row) => [row.beachId, {
      score: row.score,
      state: row.state,
      waveHeightM: row.waveHeightM,
      beaufort: row.beaufort,
      windDirectionDeg: row.windDirectionDeg,
    }])),
  };
}

// The same ranking as the trip planner. stayDay rotates through the best areas
// so a guest does not get the same trip every morning of a long stay.
export function buildDailySuggestion(seaDay: SeaDay, date: string, stayDay: number, language: EmailLanguage): DailySuggestion | null {
  const ranked = rankAreas(dayTripAreas, seaDay).slice(0, TOP_AREAS);
  if (!ranked.length) return null;
  const { area } = ranked[Math.max(0, stayDay - 1) % ranked.length];
  const plan = buildDayPlan(area.id, defaultPicks(area, seaDay, date), "10:00");
  if (!plan) return null;

  const beachSlot = area.slots.find((slot) => slot.kind === "beach");
  const beachId = beachSlot ? rankBeachOptions(beachSlot.options, seaDay)[0] : null;
  const beach = beachId ? beachesById[beachId] : null;
  const beachName = !beach ? null : language === "el" ? beach.name : beach.mapQuery.replace(/ Beach.*$/, "");
  const month = Number(date.slice(5, 7));

  return {
    areaTitle: language === "el" ? area.title : AREA_TITLES[area.id]?.[language] ?? area.title,
    beachName,
    seaState: beachId ? seaDay.beaches[beachId]?.state ?? null : null,
    beaufort: seaDay.islandWind.beaufort,
    swimSeason: month >= 5 && month <= 10,
    routeUrl: plan.routeUrl,
    stops: language === "el" ? plan.stops.map((stop) => `${stop.arrive} · ${stop.place.name}`) : [],
  };
}
