import { beaches, type BeachRegion } from "./beaches";
import { beachRoutingById } from "./beach-routing";
import {
  beachMarineExposureById,
  type MarineExposureConfidence,
} from "./marine-exposure";
import {
  rankBeachMarineWindows,
  type MarineForecastSample,
  type MarineWindowScore,
} from "./marine-comfort";

const ATHENS_TIMEZONE = "Europe/Athens";
const MARINE_ENDPOINT =
  process.env.OPEN_METEO_MARINE_ENDPOINT ||
  "https://marine-api.open-meteo.com/v1/marine";
const WEATHER_ENDPOINT =
  process.env.OPEN_METEO_WEATHER_ENDPOINT ||
  "https://api.open-meteo.com/v1/forecast";

const MARINE_VARIABLES = [
  "wave_height",
  "wave_direction",
  "wave_period",
  "wind_wave_height",
  "wind_wave_direction",
  "wind_wave_period",
] as const;

const WEATHER_VARIABLES = [
  "wind_speed_10m",
  "wind_direction_10m",
  "wind_gusts_10m",
] as const;

type OpenMeteoHourly = {
  time?: string[];
  [key: string]: string[] | Array<number | null> | undefined;
};

type OpenMeteoLocationResponse = {
  latitude?: number;
  longitude?: number;
  timezone?: string;
  hourly?: OpenMeteoHourly;
};

type Coordinates = { lat: number; lng: number };

type BeachForecastLocation = {
  beachId: string;
  name: string;
  region: BeachRegion;
  requestedCoordinates: Coordinates;
};

export type SpatialConfidence = "high" | "medium" | "low";

export type RankedBeachMarineDiagnostic = MarineWindowScore & {
  name: string;
  region: BeachRegion;
  requestedCoordinates: Coordinates;
  marineGridCoordinates: Coordinates | null;
  weatherGridCoordinates: Coordinates | null;
  marineGridDistanceKm: number | null;
  weatherGridDistanceKm: number | null;
  spatialConfidence: SpatialConfidence;
  exposureConfidence: MarineExposureConfidence | null;
};

export type MarineForecastRankingResult = {
  generatedAt: string;
  timezone: typeof ATHENS_TIMEZONE;
  source: "open-meteo";
  requestedWindow: {
    startHourLocal: string;
    endHourLocal: string;
  };
  endpoints: {
    marineHost: string;
    weatherHost: string;
    authenticated: boolean;
  };
  ranked: RankedBeachMarineDiagnostic[];
  missingRoutingBeachIds: string[];
  unscoredBeachIds: string[];
};

export type MarineForecastRankingOptions = {
  startHourLocal: string;
  endHourLocal: string;
  beachIds?: string[];
};

const toFiniteNumber = (value: unknown): number | null =>
  typeof value === "number" && Number.isFinite(value) ? value : null;

const normalizeApiPayload = (
  payload: unknown,
  expectedLocations: number,
): OpenMeteoLocationResponse[] => {
  const rows = Array.isArray(payload) ? payload : [payload];
  if (rows.length !== expectedLocations) {
    throw new Error(
      `Open-Meteo returned ${rows.length} locations for ${expectedLocations} requested coordinates.`,
    );
  }
  return rows as OpenMeteoLocationResponse[];
};

const valueAt = (
  hourly: OpenMeteoHourly | undefined,
  key: string,
  index: number,
): number | null => {
  const values = hourly?.[key];
  if (!Array.isArray(values)) return null;
  return toFiniteNumber(values[index]);
};

const coordinatesFromResponse = (
  response: OpenMeteoLocationResponse | undefined,
): Coordinates | null => {
  const lat = toFiniteNumber(response?.latitude);
  const lng = toFiniteNumber(response?.longitude);
  return lat === null || lng === null ? null : { lat, lng };
};

const haversineKm = (from: Coordinates, to: Coordinates): number => {
  const earthRadiusKm = 6371;
  const toRadians = (degrees: number) => (degrees * Math.PI) / 180;
  const dLat = toRadians(to.lat - from.lat);
  const dLng = toRadians(to.lng - from.lng);
  const lat1 = toRadians(from.lat);
  const lat2 = toRadians(to.lat);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const roundedDistance = (
  requested: Coordinates,
  grid: Coordinates | null,
): number | null =>
  grid === null ? null : Math.round(haversineKm(requested, grid) * 10) / 10;

/**
 * Spatial confidence describes how representative the forecast grid points are for
 * the requested beach coordinates. It is diagnostic metadata only and deliberately
 * does not alter the comfort score yet.
 */
const spatialConfidenceFor = (
  marineGridDistanceKm: number | null,
  weatherGridDistanceKm: number | null,
): SpatialConfidence => {
  if (marineGridDistanceKm === null) return "low";
  if (
    marineGridDistanceKm <= 4 &&
    weatherGridDistanceKm !== null &&
    weatherGridDistanceKm <= 4
  ) {
    return "high";
  }
  if (
    marineGridDistanceKm <= 10 &&
    (weatherGridDistanceKm === null || weatherGridDistanceKm <= 6)
  ) {
    return "medium";
  }
  return "low";
};

const addCommonParameters = (
  url: URL,
  locations: BeachForecastLocation[],
  startHourLocal: string,
  endHourLocal: string,
) => {
  url.searchParams.set(
    "latitude",
    locations.map((location) => location.requestedCoordinates.lat).join(","),
  );
  url.searchParams.set(
    "longitude",
    locations.map((location) => location.requestedCoordinates.lng).join(","),
  );
  url.searchParams.set("timezone", ATHENS_TIMEZONE);
  url.searchParams.set("start_hour", startHourLocal);
  url.searchParams.set("end_hour", endHourLocal);

  const apiKey = process.env.OPEN_METEO_API_KEY?.trim();
  if (apiKey) url.searchParams.set("apikey", apiKey);
};

const buildMarineUrl = (
  locations: BeachForecastLocation[],
  startHourLocal: string,
  endHourLocal: string,
) => {
  const url = new URL(MARINE_ENDPOINT);
  addCommonParameters(url, locations, startHourLocal, endHourLocal);
  url.searchParams.set("hourly", MARINE_VARIABLES.join(","));
  url.searchParams.set("cell_selection", "sea");
  return url;
};

const buildWeatherUrl = (
  locations: BeachForecastLocation[],
  startHourLocal: string,
  endHourLocal: string,
) => {
  const url = new URL(WEATHER_ENDPOINT);
  addCommonParameters(url, locations, startHourLocal, endHourLocal);
  url.searchParams.set("hourly", WEATHER_VARIABLES.join(","));
  url.searchParams.set("wind_speed_unit", "kmh");
  url.searchParams.set("cell_selection", "nearest");
  return url;
};

const fetchJson = async (url: URL, source: "marine" | "weather") => {
  const response = await fetch(url.toString(), {
    headers: { Accept: "application/json" },
    next: { revalidate: 900 },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(
      `Open-Meteo ${source} request failed (${response.status}): ${body.slice(0, 300)}`,
    );
  }

  return response.json() as Promise<unknown>;
};

const buildSamples = (
  marine: OpenMeteoLocationResponse,
  weather: OpenMeteoLocationResponse,
): MarineForecastSample[] => {
  const marineTimes = Array.isArray(marine.hourly?.time)
    ? marine.hourly?.time ?? []
    : [];
  const weatherTimes = Array.isArray(weather.hourly?.time)
    ? weather.hourly?.time ?? []
    : [];
  const weatherIndexByTime = new Map(
    weatherTimes.map((time, index) => [time, index]),
  );

  return marineTimes.map((time, marineIndex) => {
    const weatherIndex = weatherIndexByTime.get(time);
    return {
      time,
      waveHeightM: valueAt(marine.hourly, "wave_height", marineIndex),
      waveDirectionDeg: valueAt(marine.hourly, "wave_direction", marineIndex),
      wavePeriodS: valueAt(marine.hourly, "wave_period", marineIndex),
      windWaveHeightM: valueAt(marine.hourly, "wind_wave_height", marineIndex),
      windWaveDirectionDeg: valueAt(
        marine.hourly,
        "wind_wave_direction",
        marineIndex,
      ),
      windWavePeriodS: valueAt(marine.hourly, "wind_wave_period", marineIndex),
      windSpeedKmh:
        weatherIndex === undefined
          ? null
          : valueAt(weather.hourly, "wind_speed_10m", weatherIndex),
      windDirectionDeg:
        weatherIndex === undefined
          ? null
          : valueAt(weather.hourly, "wind_direction_10m", weatherIndex),
      windGustsKmh:
        weatherIndex === undefined
          ? null
          : valueAt(weather.hourly, "wind_gusts_10m", weatherIndex),
    };
  });
};

export async function fetchAndRankBeachMarineComfort(
  options: MarineForecastRankingOptions,
): Promise<MarineForecastRankingResult> {
  const selectedIds = options.beachIds ? new Set(options.beachIds) : null;
  const missingRoutingBeachIds: string[] = [];
  const locations: BeachForecastLocation[] = [];

  for (const beach of beaches) {
    if (selectedIds && !selectedIds.has(beach.id)) continue;
    const routing = beachRoutingById[beach.id];
    if (!routing) {
      missingRoutingBeachIds.push(beach.id);
      continue;
    }
    locations.push({
      beachId: beach.id,
      name: beach.name,
      region: beach.region,
      requestedCoordinates: routing.coordinates,
    });
  }

  if (locations.length === 0) {
    throw new Error("No active Trip Planner beaches have routing coordinates.");
  }

  const marineUrl = buildMarineUrl(
    locations,
    options.startHourLocal,
    options.endHourLocal,
  );
  const weatherUrl = buildWeatherUrl(
    locations,
    options.startHourLocal,
    options.endHourLocal,
  );

  const [marinePayload, weatherPayload] = await Promise.all([
    fetchJson(marineUrl, "marine"),
    fetchJson(weatherUrl, "weather"),
  ]);

  const marineRows = normalizeApiPayload(marinePayload, locations.length);
  const weatherRows = normalizeApiPayload(weatherPayload, locations.length);

  const forecastsByBeach = new Map<string, MarineForecastSample[]>();
  const diagnosticsByBeach = new Map<
    string,
    Omit<RankedBeachMarineDiagnostic, keyof MarineWindowScore>
  >();

  locations.forEach((location, index) => {
    const marineRow = marineRows[index] ?? {};
    const weatherRow = weatherRows[index] ?? {};
    const marineGridCoordinates = coordinatesFromResponse(marineRow);
    const weatherGridCoordinates = coordinatesFromResponse(weatherRow);
    const marineGridDistanceKm = roundedDistance(
      location.requestedCoordinates,
      marineGridCoordinates,
    );
    const weatherGridDistanceKm = roundedDistance(
      location.requestedCoordinates,
      weatherGridCoordinates,
    );

    forecastsByBeach.set(location.beachId, buildSamples(marineRow, weatherRow));
    diagnosticsByBeach.set(location.beachId, {
      name: location.name,
      region: location.region,
      requestedCoordinates: location.requestedCoordinates,
      marineGridCoordinates,
      weatherGridCoordinates,
      marineGridDistanceKm,
      weatherGridDistanceKm,
      spatialConfidence: spatialConfidenceFor(
        marineGridDistanceKm,
        weatherGridDistanceKm,
      ),
      exposureConfidence:
        beachMarineExposureById[location.beachId]?.confidence ?? null,
    });
  });

  const rankedScores = rankBeachMarineWindows(
    locations.map((location) => ({
      beachId: location.beachId,
      forecasts: forecastsByBeach.get(location.beachId) ?? [],
    })),
  );

  const scoredIds = new Set(rankedScores.map((score) => score.beachId));
  const unscoredBeachIds = locations
    .map((location) => location.beachId)
    .filter((beachId) => !scoredIds.has(beachId));

  const ranked = rankedScores.map((score) => ({
    ...score,
    ...(diagnosticsByBeach.get(score.beachId) as Omit<
      RankedBeachMarineDiagnostic,
      keyof MarineWindowScore
    >),
  }));

  return {
    generatedAt: new Date().toISOString(),
    timezone: ATHENS_TIMEZONE,
    source: "open-meteo",
    requestedWindow: {
      startHourLocal: options.startHourLocal,
      endHourLocal: options.endHourLocal,
    },
    endpoints: {
      marineHost: marineUrl.host,
      weatherHost: weatherUrl.host,
      authenticated: Boolean(process.env.OPEN_METEO_API_KEY?.trim()),
    },
    ranked,
    missingRoutingBeachIds,
    unscoredBeachIds,
  };
}
