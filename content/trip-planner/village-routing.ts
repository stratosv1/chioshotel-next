export type VillageRouteCluster =
  | "south-mastic"
  | "west-central-medieval"
  | "central-crossroads"
  | "northwest-volissos"
  | "northeast-lagada";

export type VillageRoutingMeta = {
  coordinates: { lat: number; lng: number };
  distanceFromVoulamandisKm: number;
  driveTimeFromVoulamandisMin: number;
  routeCluster: VillageRouteCluster;
};

/**
 * Static planning metadata for the Trip Planner.
 * Coordinates are geographic reference points for each village.
 * Distance and drive time are rounded planning estimates from Voulamandis House,
 * not live traffic or authoritative turn-by-turn routing values.
 */
export const villageRoutingById: Record<string, VillageRoutingMeta> = {
  pyrgi: {
    coordinates: { lat: 38.22713, lng: 25.99891 },
    distanceFromVoulamandisKm: 23,
    driveTimeFromVoulamandisMin: 30,
    routeCluster: "south-mastic",
  },
  mesta: {
    coordinates: { lat: 38.26036, lng: 25.92244 },
    distanceFromVoulamandisKm: 33,
    driveTimeFromVoulamandisMin: 45,
    routeCluster: "south-mastic",
  },
  vessa: {
    coordinates: { lat: 38.29697, lng: 26.00957 },
    distanceFromVoulamandisKm: 17,
    driveTimeFromVoulamandisMin: 25,
    routeCluster: "central-crossroads",
  },
  olympoi: {
    coordinates: { lat: 38.24697, lng: 25.94209 },
    distanceFromVoulamandisKm: 30,
    driveTimeFromVoulamandisMin: 40,
    routeCluster: "south-mastic",
  },
  volissos: {
    coordinates: { lat: 38.48342, lng: 25.92668 },
    distanceFromVoulamandisKm: 43,
    driveTimeFromVoulamandisMin: 60,
    routeCluster: "northwest-volissos",
  },
  armolia: {
    coordinates: { lat: 38.25207, lng: 26.03199 },
    distanceFromVoulamandisKm: 17,
    driveTimeFromVoulamandisMin: 25,
    routeCluster: "south-mastic",
  },
  lagada: {
    coordinates: { lat: 38.47704, lng: 26.12301 },
    distanceFromVoulamandisKm: 22,
    driveTimeFromVoulamandisMin: 30,
    routeCluster: "northeast-lagada",
  },
  anavatos: {
    coordinates: { lat: 38.40266, lng: 26.02003 },
    distanceFromVoulamandisKm: 20,
    driveTimeFromVoulamandisMin: 30,
    routeCluster: "west-central-medieval",
  },
  avgonyma: {
    coordinates: { lat: 38.37639, lng: 26.02167 },
    distanceFromVoulamandisKm: 18,
    driveTimeFromVoulamandisMin: 30,
    routeCluster: "west-central-medieval",
  },
  kalamoti: {
    coordinates: { lat: 38.23482, lng: 26.04551 },
    distanceFromVoulamandisKm: 18,
    driveTimeFromVoulamandisMin: 25,
    routeCluster: "south-mastic",
  },
  "agios-georgios-sykousis": {
    coordinates: { lat: 38.31911, lng: 26.05666 },
    distanceFromVoulamandisKm: 12,
    driveTimeFromVoulamandisMin: 20,
    routeCluster: "central-crossroads",
  },
};

export const villageRouteClusterLabels: Record<VillageRouteCluster, string> = {
  "south-mastic": "Νότια Χίος / Μαστιχοχώρια",
  "west-central-medieval": "Ανάβατος / Αυγώνυμα / κεντροδυτική Χίος",
  "central-crossroads": "Κεντρική Χίος / ενδιάμεσες στάσεις",
  "northwest-volissos": "Βολισσός / βορειοδυτική Χίος",
  "northeast-lagada": "Λαγκάδα / βορειοανατολική Χίος",
};
