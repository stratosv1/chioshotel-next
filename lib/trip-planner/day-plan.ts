import { beaches } from "@/content/trip-planner/beaches";
import { beachRoutingById } from "@/content/trip-planner/beach-routing";
import { villages } from "@/content/trip-planner/villages";
import { villageRoutingById } from "@/content/trip-planner/village-routing";
import { plannerExtraPlaces } from "@/content/trip-planner/extra-places";
import {
  dayTripAreaById,
  plannerAnchorById,
  plannerClosedWeekdays,
  plannerPhotoById,
  type DayTripArea,
  type StopKind,
} from "@/content/trip-planner/day-trips";

/**
 * Pure, client-safe planning logic for the Day Planner (no network access).
 * Drive times are rounded estimates: the first leg uses the reviewed time from
 * Voulamandis House, later legs a road-factor estimate between coordinates.
 */

export type LatLng = { lat: number; lng: number };

export type PlannerPlace = {
  id: string;
  kind: StopKind;
  name: string;
  photo: string | null;
  summary: string;
  detail: string | null;
  coordinates: LatLng | null;
  driveFromBaseMin: number | null;
  mapsQuery: string;
};

export type SeaDay = {
  date: string;
  offsetFromToday: number;
  islandWind: { directionDeg: number | null; beaufort: number | null };
  beaches: Record<string, { score: number; state: "calm" | "some-waves" | "wavy"; waveHeightM: number | null; beaufort: number | null; windDirectionDeg: number | null }>;
};

export type PlanStop = {
  slotIndex: number;
  place: PlannerPlace;
  arrive: string;
  leave: string;
  driveMin: number;
  minutes: number;
};

export type DayPlan = {
  area: DayTripArea;
  stops: PlanStop[];
  start: string;
  returnAt: string;
  returnDriveMin: number;
  totalDriveMin: number;
  routeUrl: string;
};

const capitalize = (text: string) => (text ? text.charAt(0).toLocaleUpperCase("el-GR") + text.slice(1) : text);

function anchorCoordinates(id: string): LatLng | null {
  const anchor = plannerAnchorById[id];
  if (!anchor) return null;
  if (anchor.coordinates) return anchor.coordinates;
  if (anchor.beach) return beachRoutingById[anchor.beach]?.coordinates ?? null;
  if (anchor.village) return villageRoutingById[anchor.village]?.coordinates ?? null;
  return null;
}

function anchorDrive(id: string): number | null {
  const anchor = plannerAnchorById[id];
  if (!anchor) return null;
  if (anchor.driveFromBaseMin) return anchor.driveFromBaseMin;
  if (anchor.beach) return beachRoutingById[anchor.beach]?.driveTimeFromVoulamandisMin ?? null;
  if (anchor.village) return villageRoutingById[anchor.village]?.driveTimeFromVoulamandisMin ?? null;
  return null;
}

function buildCatalog() {
  const catalog = new Map<string, PlannerPlace>();

  for (const beach of beaches) {
    const routing = beachRoutingById[beach.id];
    const facts = [beach.organization, beach.shade].filter(Boolean).join(" · ");
    catalog.set(beach.id, {
      id: beach.id,
      kind: "beach",
      name: beach.name,
      photo: plannerPhotoById[beach.id] ?? null,
      summary: capitalize((beach.character ?? []).join(", ")) || "Παραλία της Χίου",
      detail: beach.tip ?? (facts || null),
      coordinates: routing?.coordinates ?? null,
      driveFromBaseMin: routing?.driveTimeFromVoulamandisMin ?? null,
      mapsQuery: beach.mapQuery,
    });
  }

  for (const village of villages) {
    const routing = villageRoutingById[village.id];
    catalog.set(village.id, {
      id: village.id,
      kind: "village",
      name: village.name,
      photo: plannerPhotoById[village.id] ?? null,
      summary: capitalize(village.character.slice(0, 3).join(", ")),
      detail: village.highlights[0] ?? village.localTip ?? null,
      coordinates: routing?.coordinates ?? null,
      driveFromBaseMin: routing?.driveTimeFromVoulamandisMin ?? null,
      mapsQuery: `${village.name}, Χίος`,
    });
  }

  for (const place of plannerExtraPlaces) {
    if (catalog.has(place.id)) continue;
    const kind: StopKind = place.category === "sights" ? "sight" : place.category === "drink" ? "drink" : "food";
    const why = place.meta.split(" · ").pop() ?? place.meta;
    const summary = kind === "food"
      ? [place.location, place.cuisineType, place.priceRange].filter(Boolean).join(" · ")
      : place.meta.split(" · ")[0];
    catalog.set(place.id, {
      id: place.id,
      kind,
      name: place.name,
      photo: plannerPhotoById[place.id] ?? null,
      summary: summary || place.meta,
      detail: kind === "food" ? (place.whyWeRecommendIt ?? why) : place.meta,
      coordinates: anchorCoordinates(place.id),
      driveFromBaseMin: anchorDrive(place.id),
      mapsQuery: kind === "drink" ? `${place.name.split(" · ")[0]}, Χίος` : `${place.name}, ${place.location ?? ""} Χίος`.replace(" ,", ","),
    });
  }

  return catalog;
}

export const plannerCatalog = buildCatalog();

export function getPlace(id: string) {
  return plannerCatalog.get(id) ?? null;
}

const toRad = (deg: number) => (deg * Math.PI) / 180;

function haversineKm(a: LatLng, b: LatLng) {
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

const roundTo5 = (minutes: number) => Math.max(5, Math.round(minutes / 5) * 5);

/** Approximate position of Voulamandis House in Kambos (drive estimates only). */
const BASE_COORDINATES: LatLng = { lat: 38.3445, lng: 26.1215 };
const BASE_PLACE = { coordinates: BASE_COORDINATES } as PlannerPlace;

function driveFromBase(place: PlannerPlace) {
  return place.driveFromBaseMin ?? estimateDriveMin(BASE_PLACE, place);
}

export function estimateDriveMin(from: PlannerPlace, to: PlannerPlace) {
  if (!from.coordinates || !to.coordinates) return 15;
  const km = haversineKm(from.coordinates, to.coordinates);
  if (km < 0.6) return 5;
  // Mountain roads: ~1.45x the straight line at ~40 km/h average.
  return roundTo5(((km * 1.45) / 40) * 60);
}

export const parseTime = (value: string) => {
  const [h, m] = value.split(":").map(Number);
  return (h || 0) * 60 + (m || 0);
};

export const formatTime = (minutes: number) => {
  const wrapped = ((minutes % 1440) + 1440) % 1440;
  return `${String(Math.floor(wrapped / 60)).padStart(2, "0")}:${String(wrapped % 60).padStart(2, "0")}`;
};

/** Weekday (0 = Sunday) for an ISO date, independent of the device time zone. */
export function weekdayOf(isoDate: string) {
  const [y, m, d] = isoDate.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay();
}

export function isClosedOn(placeId: string, isoDate: string) {
  return (plannerClosedWeekdays[placeId] ?? []).includes(weekdayOf(isoDate));
}

/** Beach options of a slot, calmest first for the given day. */
export function rankBeachOptions(options: string[], seaDay: SeaDay | null) {
  if (!seaDay) return options;
  return [...options].sort((a, b) => (seaDay.beaches[b]?.score ?? -1) - (seaDay.beaches[a]?.score ?? -1));
}

/** Default picks for an area on a given day (calmest beach, closed stops skipped). */
export function defaultPicks(area: DayTripArea, seaDay: SeaDay | null, isoDate: string): (string | null)[] {
  return area.slots.map((slot) => {
    if (slot.kind === "beach") return rankBeachOptions(slot.options, seaDay)[0] ?? slot.default;
    if (slot.optional && isClosedOn(slot.default, isoDate)) return null;
    return slot.default;
  });
}

function mapsPoint(place: PlannerPlace) {
  if (place.kind === "beach" || place.kind === "village") {
    return place.coordinates ? `${place.coordinates.lat},${place.coordinates.lng}` : place.mapsQuery;
  }
  return place.mapsQuery;
}

export const BASE_MAPS_QUERY = "Voulamandis House, Kambos, Chios";

export function directionsUrl(place: PlannerPlace) {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(mapsPoint(place))}&travelmode=driving`;
}

export function buildDayPlan(areaId: string, picks: (string | null)[], start: string): DayPlan | null {
  const area = dayTripAreaById[areaId];
  if (!area) return null;

  const stops: PlanStop[] = [];
  let clock = parseTime(start);
  let totalDrive = 0;
  let previous: PlannerPlace | null = null;

  area.slots.forEach((slot, slotIndex) => {
    const id = picks[slotIndex];
    if (!id) return;
    const place = getPlace(id);
    if (!place) return;
    const driveMin = previous ? estimateDriveMin(previous, place) : driveFromBase(place);
    clock += driveMin;
    totalDrive += driveMin;
    if (slot.notBefore) clock = Math.max(clock, parseTime(slot.notBefore));
    const arrive = clock;
    clock += slot.minutes;
    stops.push({ slotIndex, place, arrive: formatTime(arrive), leave: formatTime(clock), driveMin, minutes: slot.minutes });
    previous = place;
  });

  const last = stops[stops.length - 1]?.place;
  const returnDriveMin = last ? driveFromBase(last) : 0;
  totalDrive += stops.length ? returnDriveMin : 0;

  const points = stops.map((stop) => mapsPoint(stop.place));
  const routeUrl = points.length
    ? `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(BASE_MAPS_QUERY)}&destination=${encodeURIComponent(points[points.length - 1])}${points.length > 1 ? `&waypoints=${encodeURIComponent(points.slice(0, -1).join("|"))}` : ""}&travelmode=driving`
    : "";

  return {
    area,
    stops,
    start,
    returnAt: formatTime(clock + returnDriveMin),
    returnDriveMin,
    totalDriveMin: totalDrive,
    routeUrl,
  };
}

/** Areas ranked for a day: calmest best beach first, shorter drive breaks ties. */
export function rankAreas(areas: DayTripArea[], seaDay: SeaDay | null) {
  const scored = areas.map((area) => {
    const beachSlot = area.slots.find((slot) => slot.kind === "beach");
    const bestBeach = beachSlot ? rankBeachOptions(beachSlot.options, seaDay)[0] : null;
    const score = bestBeach && seaDay ? seaDay.beaches[bestBeach]?.score ?? 0 : 0;
    const drive = bestBeach ? getPlace(bestBeach)?.driveFromBaseMin ?? 60 : 60;
    return { area, bestBeach, score, drive };
  });
  // Scores within the same 5-point band count as equal; then the shorter drive wins.
  return scored.sort((a, b) => Math.floor(b.score / 5) - Math.floor(a.score / 5) || a.drive - b.drive);
}
