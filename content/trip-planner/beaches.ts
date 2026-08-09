import {
  beaches as sourceBeaches,
  excludedTripPlannerBeaches as sourceExcludedTripPlannerBeaches,
  type BeachMaster,
  type BeachRegion,
} from "./beaches-source";

export type { BeachRegion, FamilyFit, BeachMaster } from "./beaches-source";

/**
 * Places intentionally not treated as beaches by the Trip Planner.
 * Afanis Naftis is kept only as a historical/raw source record, not as an active beach.
 */
export const excludedTripPlannerBeaches = [
  ...sourceExcludedTripPlannerBeaches,
  "Afanis Naftis",
] as const;

export const beaches: BeachMaster[] = sourceBeaches.filter(
  (beach) => beach.id !== "afanis-naftis",
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
