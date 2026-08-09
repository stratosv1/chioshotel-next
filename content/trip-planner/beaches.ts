import {
  beaches as sourceBeaches,
  excludedTripPlannerBeaches as sourceExcludedTripPlannerBeaches,
  type BeachMaster,
  type BeachRegion,
} from "./beaches-source";

export type { BeachRegion, FamilyFit, BeachMaster } from "./beaches-source";

/**
 * Places intentionally not treated as active beaches by the Trip Planner.
 * Raw/source records are preserved so historical/editorial data is not lost.
 */
export const excludedTripPlannerBeaches = [
  ...sourceExcludedTripPlannerBeaches,
  "Afanis Naftis",
  "Agiasmata",
  "Trachilia (alias of Avlonia)",
] as const;

/**
 * Known duplicate naming in the source data.
 * Trachilia South refers to the same beach/location as Avlonia for planner purposes.
 */
export const tripPlannerBeachAliases = {
  "trachilia-south": "avlonia",
} as const;

const inactiveBeachIds = new Set([
  "afanis-naftis",
  "agiasmata",
  "trachilia-south",
]);

export const beaches: BeachMaster[] = sourceBeaches.filter(
  (beach) => !inactiveBeachIds.has(beach.id),
);

export const beachesById = Object.fromEntries(
  beaches.map((beach) => [beach.id, beach]),
) as Record<string, BeachMaster>;

export const beachesByRegion = beaches.reduce<Record<BeachRegion, BeachMaster[]>>(
  (acc, beach) => {
    acc[beach.region].push(beach);
    return acc;
  },
  { "near-city": [], northwest: [], northeast: [], west: [], south: [] },
);
