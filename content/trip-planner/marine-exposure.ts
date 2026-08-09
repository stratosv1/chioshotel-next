export type MarineDirection = "N" | "NE" | "E" | "SE" | "S" | "SW" | "W" | "NW";

export type MarineExposureConfidence = "medium" | "medium-high";

export type BeachMarineExposureMeta = {
  /** Approximate direction the beach/its bay opens toward, in degrees (0=N, 90=E). */
  facingDeg: number;
  /**
   * Heuristic directional coastal-exposure coefficients.
   * 0 = strongly sheltered, 1 = strongly exposed.
   * These are recommendation-engine inputs, not measured wave observations.
   */
  exposure: Record<MarineDirection, number>;
  confidence: MarineExposureConfidence;
  source: "manual-map-estimate";
};

/**
 * Static marine-exposure metadata for Trip Planner beaches.
 *
 * Values were estimated manually from north-up coastline/map screenshots supplied
 * during Trip Planner design. They are intended to be combined with marine forecast
 * wave height/direction and must not be presented as measured coastal conditions.
 * Coordinates remain canonical in beach-routing.ts and are intentionally not duplicated here.
 */
export const beachMarineExposureById: Record<string, BeachMarineExposureMeta> = {
  "mavra-volia": {
    facingDeg: 135,
    exposure: { N: 0.05, NE: 0.2, E: 0.75, SE: 1, S: 0.65, SW: 0.15, W: 0.05, NW: 0.05 },
    confidence: "medium-high",
    source: "manual-map-estimate",
  },
  lilikas: {
    facingDeg: 155,
    exposure: { N: 0.05, NE: 0.1, E: 0.45, SE: 0.9, S: 1, SW: 0.65, W: 0.15, NW: 0.05 },
    confidence: "medium-high",
    source: "manual-map-estimate",
  },
  komi: {
    facingDeg: 140,
    exposure: { N: 0.05, NE: 0.3, E: 0.8, SE: 1, S: 0.65, SW: 0.2, W: 0.05, NW: 0.05 },
    confidence: "medium-high",
    source: "manual-map-estimate",
  },
  "agia-fotia": {
    facingDeg: 135,
    exposure: { N: 0.05, NE: 0.25, E: 0.75, SE: 1, S: 0.7, SW: 0.25, W: 0.05, NW: 0.05 },
    confidence: "medium-high",
    source: "manual-map-estimate",
  },
  "megas-limnionas": {
    facingDeg: 128,
    exposure: { N: 0.1, NE: 0.45, E: 0.9, SE: 1, S: 0.55, SW: 0.15, W: 0.05, NW: 0.05 },
    confidence: "medium-high",
    source: "manual-map-estimate",
  },
  karfas: {
    facingDeg: 100,
    exposure: { N: 0.2, NE: 0.65, E: 1, SE: 0.8, S: 0.35, SW: 0.1, W: 0.05, NW: 0.1 },
    confidence: "medium-high",
    source: "manual-map-estimate",
  },
  "ormos-lo": {
    facingDeg: 80,
    exposure: { N: 0.15, NE: 0.55, E: 0.75, SE: 0.35, S: 0.1, SW: 0.05, W: 0.05, NW: 0.1 },
    confidence: "medium-high",
    source: "manual-map-estimate",
  },
  mersinidi: {
    facingDeg: 105,
    exposure: { N: 0.15, NE: 0.55, E: 1, SE: 0.75, S: 0.3, SW: 0.1, W: 0.05, NW: 0.1 },
    confidence: "medium",
    source: "manual-map-estimate",
  },
  giosonas: {
    facingDeg: 45,
    exposure: { N: 0.65, NE: 1, E: 0.8, SE: 0.3, S: 0.05, SW: 0.05, W: 0.1, NW: 0.35 },
    confidence: "medium-high",
    source: "manual-map-estimate",
  },
  nagos: {
    facingDeg: 65,
    exposure: { N: 0.4, NE: 0.9, E: 0.8, SE: 0.35, S: 0.05, SW: 0.05, W: 0.05, NW: 0.15 },
    confidence: "medium-high",
    source: "manual-map-estimate",
  },
  elinta: {
    facingDeg: 195,
    exposure: { N: 0.05, NE: 0.05, E: 0.1, SE: 0.35, S: 0.85, SW: 1, W: 0.4, NW: 0.1 },
    confidence: "medium-high",
    source: "manual-map-estimate",
  },
  tigani: {
    facingDeg: 235,
    exposure: { N: 0.1, NE: 0.05, E: 0.05, SE: 0.1, S: 0.35, SW: 1, W: 0.85, NW: 0.3 },
    confidence: "medium-high",
    source: "manual-map-estimate",
  },
  apothika: {
    facingDeg: 245,
    exposure: { N: 0.15, NE: 0.05, E: 0.05, SE: 0.1, S: 0.4, SW: 1, W: 0.9, NW: 0.45 },
    confidence: "medium-high",
    source: "manual-map-estimate",
  },
  "trachili-west": {
    facingDeg: 340,
    exposure: { N: 0.9, NE: 0.5, E: 0.1, SE: 0.05, S: 0.05, SW: 0.1, W: 0.35, NW: 1 },
    confidence: "medium-high",
    source: "manual-map-estimate",
  },
  managros: {
    facingDeg: 230,
    exposure: { N: 0.1, NE: 0.05, E: 0.05, SE: 0.2, S: 0.6, SW: 1, W: 0.85, NW: 0.4 },
    confidence: "medium-high",
    source: "manual-map-estimate",
  },
  "limnos-volissos": {
    facingDeg: 228,
    exposure: { N: 0.15, NE: 0.05, E: 0.05, SE: 0.15, S: 0.55, SW: 1, W: 0.9, NW: 0.45 },
    confidence: "medium-high",
    source: "manual-map-estimate",
  },
  "agia-markella": {
    facingDeg: 233,
    exposure: { N: 0.3, NE: 0.05, E: 0.05, SE: 0.1, S: 0.45, SW: 1, W: 0.9, NW: 0.55 },
    confidence: "medium-high",
    source: "manual-map-estimate",
  },
};
