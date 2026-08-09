import {
  beachMarineExposureById,
  type BeachMarineExposureMeta,
  type MarineDirection,
} from "./marine-exposure";

const DIRECTIONS: MarineDirection[] = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
const SECTOR_DEGREES = 45;

export type MarineComfortRating =
  | "excellent"
  | "good"
  | "fair"
  | "poor"
  | "not-recommended";

export type MarineDataQuality = "full" | "partial" | "limited";

export type MarineReasonCode =
  | "calm-marine-signal"
  | "directionally-sheltered"
  | "directionally-exposed"
  | "strong-wind"
  | "strong-gusts"
  | "large-offshore-waves"
  | "limited-forecast-data";

/**
 * One hourly forecast sample for a beach.
 *
 * Wave directions are expected in meteorological degrees (0=N, 90=E), matching
 * Open-Meteo's marine convention that wave direction is where waves come from.
 * Wind values are optional so the scorer can degrade gracefully if weather data
 * is temporarily unavailable.
 */
export type MarineForecastSample = {
  time?: string;
  waveHeightM: number | null;
  waveDirectionDeg: number | null;
  wavePeriodS: number | null;
  windWaveHeightM?: number | null;
  windWaveDirectionDeg?: number | null;
  windWavePeriodS?: number | null;
  windSpeedKmh?: number | null;
  windDirectionDeg?: number | null;
  windGustsKmh?: number | null;
};

export type MarineComfortBreakdown = {
  waveExposure: number | null;
  windWaveExposure: number | null;
  windExposure: number | null;
  waveImpact: number | null;
  windWaveImpact: number | null;
  marineRisk: number | null;
  windRisk: number | null;
  gustRisk: number | null;
};

export type MarineComfortScore = {
  beachId: string;
  time?: string;
  score: number;
  rating: MarineComfortRating;
  dataQuality: MarineDataQuality;
  reasonCodes: MarineReasonCode[];
  breakdown: MarineComfortBreakdown;
};

export type MarineWindowScore = {
  beachId: string;
  score: number;
  rating: MarineComfortRating;
  dataQuality: MarineDataQuality;
  averageHourlyScore: number;
  worstHourlyScore: number;
  reasonCodes: MarineReasonCode[];
  hourly: MarineComfortScore[];
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const isFiniteNumber = (value: number | null | undefined): value is number =>
  typeof value === "number" && Number.isFinite(value);

const normalizeDegrees = (degrees: number) => ((degrees % 360) + 360) % 360;

/**
 * Circular linear interpolation between the 8 manually estimated exposure sectors.
 * Example: 22.5° is halfway between N and NE instead of snapping to one bucket.
 */
export function interpolateMarineExposure(
  meta: BeachMarineExposureMeta,
  directionDeg: number,
): number {
  const normalized = normalizeDegrees(directionDeg);
  const scaled = normalized / SECTOR_DEGREES;
  const lowerIndex = Math.floor(scaled) % DIRECTIONS.length;
  const upperIndex = (lowerIndex + 1) % DIRECTIONS.length;
  const fraction = scaled - Math.floor(scaled);
  const lower = meta.exposure[DIRECTIONS[lowerIndex]];
  const upper = meta.exposure[DIRECTIONS[upperIndex]];

  return clamp(lower + (upper - lower) * fraction, 0, 1);
}

const maxExposure = (meta: BeachMarineExposureMeta) =>
  Math.max(...DIRECTIONS.map((direction) => meta.exposure[direction]));

const exposureFor = (
  meta: BeachMarineExposureMeta,
  directionDeg: number | null | undefined,
) =>
  isFiniteNumber(directionDeg)
    ? interpolateMarineExposure(meta, directionDeg)
    : maxExposure(meta);

/**
 * Longer-period waves carry more energy. This is deliberately a mild multiplier:
 * it improves ranking, but it must never be interpreted as a shoreline wave-height model.
 */
const periodFactor = (periodS: number | null | undefined) => {
  if (!isFiniteNumber(periodS) || periodS <= 0) return 1;
  return clamp(0.8 + (periodS - 3) * 0.08, 0.8, 1.35);
};

type RiskKnot = readonly [value: number, risk: number];

const interpolateRisk = (value: number, knots: readonly RiskKnot[]) => {
  const safeValue = Math.max(0, value);
  if (safeValue <= knots[0][0]) return knots[0][1];

  for (let index = 1; index < knots.length; index += 1) {
    const [rightValue, rightRisk] = knots[index];
    const [leftValue, leftRisk] = knots[index - 1];

    if (safeValue <= rightValue) {
      const fraction = (safeValue - leftValue) / (rightValue - leftValue);
      return clamp(leftRisk + (rightRisk - leftRisk) * fraction, 0, 1);
    }
  }

  return knots[knots.length - 1][1];
};

// Heuristic impact curves. They are ranking inputs, not bathing-safety thresholds.
const waveImpactRisk = (impact: number) =>
  interpolateRisk(impact, [
    [0, 0],
    [0.15, 0.05],
    [0.3, 0.18],
    [0.5, 0.4],
    [0.8, 0.72],
    [1.1, 1],
  ]);

const windImpactRisk = (impactKmh: number) =>
  interpolateRisk(impactKmh, [
    [0, 0],
    [10, 0.05],
    [18, 0.22],
    [26, 0.48],
    [34, 0.78],
    [42, 1],
  ]);

const gustImpactRisk = (impactKmh: number) =>
  interpolateRisk(impactKmh, [
    [0, 0],
    [20, 0.05],
    [30, 0.2],
    [40, 0.45],
    [50, 0.75],
    [60, 1],
  ]);

const ratingForScore = (score: number): MarineComfortRating => {
  if (score >= 85) return "excellent";
  if (score >= 70) return "good";
  if (score >= 50) return "fair";
  if (score >= 35) return "poor";
  return "not-recommended";
};

const qualityRank: Record<MarineDataQuality, number> = {
  limited: 0,
  partial: 1,
  full: 2,
};

const worstQuality = (qualities: MarineDataQuality[]) =>
  qualities.reduce<MarineDataQuality>(
    (worst, current) =>
      qualityRank[current] < qualityRank[worst] ? current : worst,
    "full",
  );

const weightedRisk = (
  components: Array<{ risk: number | null; weight: number }>,
): number => {
  const available = components.filter(
    (component): component is { risk: number; weight: number } =>
      component.risk !== null,
  );

  if (available.length === 0) return 0.5;

  const weightSum = available.reduce((sum, component) => sum + component.weight, 0);
  return clamp(
    available.reduce((sum, component) => sum + component.risk * component.weight, 0) /
      weightSum,
    0,
    1,
  );
};

/**
 * Scores one beach for one forecast hour.
 *
 * 100 = comparatively calm/comfortable signal for this beach.
 * 0   = strongly unfavorable signal.
 *
 * This is a recommendation heuristic only. It intentionally does not estimate
 * measured shoreline wave height and must not be used for navigation or safety claims.
 */
export function scoreBeachMarineComfort(
  beachId: string,
  forecast: MarineForecastSample,
): MarineComfortScore | null {
  const meta = beachMarineExposureById[beachId];
  if (!meta) return null;

  const hasWaveHeight = isFiniteNumber(forecast.waveHeightM);
  const hasWaveDirection = isFiniteNumber(forecast.waveDirectionDeg);
  const hasWind = isFiniteNumber(forecast.windSpeedKmh);
  const hasWindDirection = isFiniteNumber(forecast.windDirectionDeg);
  const hasGusts = isFiniteNumber(forecast.windGustsKmh);

  const waveExposure = hasWaveHeight
    ? exposureFor(meta, forecast.waveDirectionDeg)
    : null;
  const waveImpact = hasWaveHeight && waveExposure !== null
    ? forecast.waveHeightM * waveExposure * periodFactor(forecast.wavePeriodS)
    : null;
  const primaryWaveRisk = waveImpact === null ? null : waveImpactRisk(waveImpact);

  const hasWindWaveHeight = isFiniteNumber(forecast.windWaveHeightM);
  const windWaveExposure = hasWindWaveHeight
    ? exposureFor(meta, forecast.windWaveDirectionDeg)
    : null;
  const windWaveImpact = hasWindWaveHeight && windWaveExposure !== null
    ? forecast.windWaveHeightM *
      windWaveExposure *
      periodFactor(forecast.windWavePeriodS)
    : null;
  const secondaryWindWaveRisk =
    windWaveImpact === null ? null : waveImpactRisk(windWaveImpact);

  let marineRisk: number | null = primaryWaveRisk;
  if (marineRisk === null && secondaryWindWaveRisk !== null) {
    marineRisk = secondaryWindWaveRisk;
  } else if (marineRisk !== null && secondaryWindWaveRisk !== null) {
    // Wind-wave data can only nudge the primary total-wave risk upward; it cannot
    // make a rough total-wave signal look safer and it is not added as full height.
    marineRisk = clamp(
      marineRisk + 0.15 * secondaryWindWaveRisk * (1 - marineRisk),
      0,
      1,
    );
  }

  const windExposure = hasWind
    ? exposureFor(meta, forecast.windDirectionDeg)
    : null;
  const windImpact = hasWind && windExposure !== null
    ? forecast.windSpeedKmh * (0.35 + 0.65 * windExposure)
    : null;
  const windRisk = windImpact === null ? null : windImpactRisk(windImpact);

  const gustExposureFactor = windExposure === null ? 1 : 0.35 + 0.65 * windExposure;
  const gustImpact = hasGusts ? forecast.windGustsKmh * gustExposureFactor : null;
  const gustRisk = gustImpact === null ? null : gustImpactRisk(gustImpact);

  const risk = weightedRisk([
    { risk: marineRisk, weight: 0.72 },
    { risk: windRisk, weight: 0.2 },
    { risk: gustRisk, weight: 0.08 },
  ]);

  let score = Math.round((1 - risk) * 100);

  // Conservative caps for conditions where near-shore model uncertainty matters most.
  if (waveImpact !== null && waveImpact >= 1) score = Math.min(score, 35);
  if (hasWaveHeight && forecast.waveHeightM >= 2) score = Math.min(score, 65);
  if (
    (hasWind && forecast.windSpeedKmh >= 45) ||
    (hasGusts && forecast.windGustsKmh >= 60)
  ) {
    score = Math.min(score, 50);
  }
  if (!hasWaveHeight) score = Math.min(score, 70);

  const coreMarineComplete = hasWaveHeight && hasWaveDirection;
  const coreWindComplete = !hasWind || hasWindDirection;
  const dataQuality: MarineDataQuality = !hasWaveHeight
    ? "limited"
    : coreMarineComplete && coreWindComplete && hasWind
      ? "full"
      : "partial";

  const reasonCodes = new Set<MarineReasonCode>();

  if (
    marineRisk !== null &&
    marineRisk <= 0.18 &&
    (windRisk === null || windRisk <= 0.22)
  ) {
    reasonCodes.add("calm-marine-signal");
  }
  if (hasWaveHeight && forecast.waveHeightM >= 0.4 && waveExposure !== null) {
    if (waveExposure <= 0.25) reasonCodes.add("directionally-sheltered");
    if (waveExposure >= 0.7) reasonCodes.add("directionally-exposed");
  }
  if (hasWind && forecast.windSpeedKmh >= 30) reasonCodes.add("strong-wind");
  if (hasGusts && forecast.windGustsKmh >= 45) reasonCodes.add("strong-gusts");
  if (hasWaveHeight && forecast.waveHeightM >= 1.5) {
    reasonCodes.add("large-offshore-waves");
  }
  if (dataQuality !== "full") reasonCodes.add("limited-forecast-data");

  return {
    beachId,
    time: forecast.time,
    score,
    rating: ratingForScore(score),
    dataQuality,
    reasonCodes: [...reasonCodes],
    breakdown: {
      waveExposure,
      windWaveExposure,
      windExposure,
      waveImpact,
      windWaveImpact,
      marineRisk,
      windRisk,
      gustRisk,
    },
  };
}

/**
 * Scores a visit window (for example 10:00-13:00) rather than trusting one hour.
 * The worst hour contributes 35%, so a short rough interval is not hidden by a calm average.
 */
export function scoreBeachMarineWindow(
  beachId: string,
  forecasts: MarineForecastSample[],
): MarineWindowScore | null {
  const hourly = forecasts
    .map((forecast) => scoreBeachMarineComfort(beachId, forecast))
    .filter((score): score is MarineComfortScore => score !== null);

  if (hourly.length === 0) return null;

  const averageHourlyScore =
    hourly.reduce((sum, item) => sum + item.score, 0) / hourly.length;
  const worstHourlyScore = Math.min(...hourly.map((item) => item.score));
  const score = Math.round(averageHourlyScore * 0.65 + worstHourlyScore * 0.35);

  return {
    beachId,
    score,
    rating: ratingForScore(score),
    dataQuality: worstQuality(hourly.map((item) => item.dataQuality)),
    averageHourlyScore: Math.round(averageHourlyScore),
    worstHourlyScore,
    reasonCodes: [...new Set(hourly.flatMap((item) => item.reasonCodes))],
    hourly,
  };
}

export function rankBeachMarineWindows(
  windows: Array<{ beachId: string; forecasts: MarineForecastSample[] }>,
): MarineWindowScore[] {
  return windows
    .map(({ beachId, forecasts }) => scoreBeachMarineWindow(beachId, forecasts))
    .filter((score): score is MarineWindowScore => score !== null)
    .sort((left, right) => right.score - left.score);
}
