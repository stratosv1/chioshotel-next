export type RouteCluster =
  | "near-city-south"
  | "vrontados-coast"
  | "south-pyrgi-emporios"
  | "south-mesta-olympoi"
  | "west-lithi-anavatos"
  | "northwest-volissos"
  | "north-amani"
  | "northeast-kardamyla";

export type CoordinateAccuracy = "verified" | "approximate";

export type BeachRoutingMeta = {
  coordinates: { lat: number; lng: number };
  coordinateAccuracy: CoordinateAccuracy;
  distanceFromVoulamandisKm: number;
  driveTimeFromVoulamandisMin: number;
  routeCluster: RouteCluster;
};

/**
 * Static routing metadata for Trip Planner.
 *
 * Coordinates are fixed geographic reference points for each beach.
 * Distance/drive-time values are planning estimates from Voulamandis House,
 * intentionally rounded so they are not presented as live-traffic navigation data.
 * Google Maps (or another routing provider) should calculate the final route at runtime.
 */
export const beachRoutingById: Record<string, BeachRoutingMeta> = {
  "agia-dynami": {
    coordinates: { lat: 38.21471, lng: 25.91358 },
    coordinateAccuracy: "verified",
    distanceFromVoulamandisKm: 32,
    driveTimeFromVoulamandisMin: 45,
    routeCluster: "south-mesta-olympoi",
  },
  "agia-fotia": {
    coordinates: { lat: 38.28535, lng: 26.12094 },
    coordinateAccuracy: "verified",
    distanceFromVoulamandisKm: 6,
    driveTimeFromVoulamandisMin: 10,
    routeCluster: "near-city-south",
  },
  apothika: {
    coordinates: { lat: 38.24114, lng: 25.88864 },
    coordinateAccuracy: "verified",
    distanceFromVoulamandisKm: 33,
    driveTimeFromVoulamandisMin: 50,
    routeCluster: "south-mesta-olympoi",
  },
  avlonia: {
    coordinates: { lat: 38.22386, lng: 25.89452 },
    coordinateAccuracy: "verified",
    distanceFromVoulamandisKm: 34,
    driveTimeFromVoulamandisMin: 45,
    routeCluster: "south-mesta-olympoi",
  },
  vroulidia: {
    coordinates: { lat: 38.15706, lng: 26.00835 },
    coordinateAccuracy: "verified",
    distanceFromVoulamandisKm: 30,
    driveTimeFromVoulamandisMin: 40,
    routeCluster: "south-pyrgi-emporios",
  },
  "kato-fana": {
    coordinates: { lat: 38.20665, lng: 25.92732 },
    coordinateAccuracy: "verified",
    distanceFromVoulamandisKm: 32,
    driveTimeFromVoulamandisMin: 40,
    routeCluster: "south-mesta-olympoi",
  },
  komi: {
    coordinates: { lat: 38.20103, lng: 26.04257 },
    coordinateAccuracy: "verified",
    distanceFromVoulamandisKm: 22,
    driveTimeFromVoulamandisMin: 30,
    routeCluster: "south-pyrgi-emporios",
  },
  lilikas: {
    coordinates: { lat: 38.2061, lng: 26.06082 },
    coordinateAccuracy: "verified",
    distanceFromVoulamandisKm: 20,
    driveTimeFromVoulamandisMin: 30,
    routeCluster: "south-pyrgi-emporios",
  },
  "mavra-volia": {
    coordinates: { lat: 38.18496, lng: 26.02907 },
    coordinateAccuracy: "verified",
    distanceFromVoulamandisKm: 25,
    driveTimeFromVoulamandisMin: 35,
    routeCluster: "south-pyrgi-emporios",
  },
  salagona: {
    coordinates: { lat: 38.22166, lng: 25.9147 },
    coordinateAccuracy: "verified",
    distanceFromVoulamandisKm: 32,
    driveTimeFromVoulamandisMin: 50,
    routeCluster: "south-mesta-olympoi",
  },
  "trachilia-south": {
    coordinates: { lat: 38.22149, lng: 25.90331 },
    coordinateAccuracy: "verified",
    distanceFromVoulamandisKm: 33,
    driveTimeFromVoulamandisMin: 50,
    routeCluster: "south-mesta-olympoi",
  },
  lithi: {
    coordinates: { lat: 38.34069, lng: 25.99144 },
    coordinateAccuracy: "verified",
    distanceFromVoulamandisKm: 20,
    driveTimeFromVoulamandisMin: 30,
    routeCluster: "west-lithi-anavatos",
  },
  elinta: {
    coordinates: { lat: 38.39133, lng: 25.99034 },
    coordinateAccuracy: "verified",
    distanceFromVoulamandisKm: 23,
    driveTimeFromVoulamandisMin: 35,
    routeCluster: "west-lithi-anavatos",
  },
  "trachili-west": {
    coordinates: { lat: 38.36357, lng: 25.99178 },
    coordinateAccuracy: "verified",
    distanceFromVoulamandisKm: 21,
    driveTimeFromVoulamandisMin: 35,
    routeCluster: "west-lithi-anavatos",
  },
  tigani: {
    coordinates: { lat: 38.40397, lng: 25.96609 },
    coordinateAccuracy: "verified",
    distanceFromVoulamandisKm: 27,
    driveTimeFromVoulamandisMin: 45,
    routeCluster: "west-lithi-anavatos",
  },
  "agia-markella": {
    coordinates: { lat: 38.48006, lng: 25.88607 },
    coordinateAccuracy: "verified",
    distanceFromVoulamandisKm: 45,
    driveTimeFromVoulamandisMin: 65,
    routeCluster: "northwest-volissos",
  },
  agiasmata: {
    coordinates: { lat: 38.58754, lng: 25.93729 },
    coordinateAccuracy: "verified",
    distanceFromVoulamandisKm: 55,
    driveTimeFromVoulamandisMin: 80,
    routeCluster: "north-amani",
  },
  managros: {
    coordinates: { lat: 38.46158, lng: 25.94016 },
    coordinateAccuracy: "verified",
    distanceFromVoulamandisKm: 37,
    driveTimeFromVoulamandisMin: 55,
    routeCluster: "northwest-volissos",
  },
  "limnos-volissos": {
    coordinates: { lat: 38.47271, lng: 25.91086 },
    coordinateAccuracy: "verified",
    distanceFromVoulamandisKm: 41,
    driveTimeFromVoulamandisMin: 60,
    routeCluster: "northwest-volissos",
  },
  lefkathia: {
    coordinates: { lat: 38.47147, lng: 25.91465 },
    coordinateAccuracy: "verified",
    distanceFromVoulamandisKm: 41,
    driveTimeFromVoulamandisMin: 60,
    routeCluster: "northwest-volissos",
  },
  giosonas: {
    coordinates: { lat: 38.56373, lng: 26.07998 },
    coordinateAccuracy: "verified",
    distanceFromVoulamandisKm: 41,
    driveTimeFromVoulamandisMin: 55,
    routeCluster: "northeast-kardamyla",
  },
  nagos: {
    coordinates: { lat: 38.55906, lng: 26.08315 },
    coordinateAccuracy: "verified",
    distanceFromVoulamandisKm: 40,
    driveTimeFromVoulamandisMin: 55,
    routeCluster: "northeast-kardamyla",
  },
  karfas: {
    coordinates: { lat: 38.31941, lng: 26.15379 },
    coordinateAccuracy: "verified",
    distanceFromVoulamandisKm: 2,
    driveTimeFromVoulamandisMin: 5,
    routeCluster: "near-city-south",
  },
  "megas-limnionas": {
    coordinates: { lat: 38.30027, lng: 26.14167 },
    coordinateAccuracy: "verified",
    distanceFromVoulamandisKm: 3,
    driveTimeFromVoulamandisMin: 5,
    routeCluster: "near-city-south",
  },
  daskalopetra: {
    coordinates: { lat: 38.42107, lng: 26.13439 },
    coordinateAccuracy: "verified",
    distanceFromVoulamandisKm: 13,
    driveTimeFromVoulamandisMin: 20,
    routeCluster: "vrontados-coast",
  },
  "afanis-naftis": {
    coordinates: { lat: 38.4083, lng: 26.13167 },
    coordinateAccuracy: "approximate",
    distanceFromVoulamandisKm: 12,
    driveTimeFromVoulamandisMin: 20,
    routeCluster: "vrontados-coast",
  },
  glaroi: {
    coordinates: { lat: 38.44411, lng: 26.14343 },
    coordinateAccuracy: "verified",
    distanceFromVoulamandisKm: 17,
    driveTimeFromVoulamandisMin: 25,
    routeCluster: "vrontados-coast",
  },
  "ormos-lo": {
    coordinates: { lat: 38.41642, lng: 26.13385 },
    coordinateAccuracy: "verified",
    distanceFromVoulamandisKm: 13,
    driveTimeFromVoulamandisMin: 20,
    routeCluster: "vrontados-coast",
  },
  mersinidi: {
    coordinates: { lat: 38.43385, lng: 26.14242 },
    coordinateAccuracy: "verified",
    distanceFromVoulamandisKm: 15,
    driveTimeFromVoulamandisMin: 25,
    routeCluster: "vrontados-coast",
  },
};

export const routeClusterLabels: Record<RouteCluster, string> = {
  "near-city-south": "Κάμπος / Καρφάς / νότια κοντά",
  "vrontados-coast": "Βροντάδος / βόρεια κοντά στην πόλη",
  "south-pyrgi-emporios": "Πυργί / Εμπορειός / Κώμη",
  "south-mesta-olympoi": "Μεστά / Ολύμποι / νοτιοδυτική Χίος",
  "west-lithi-anavatos": "Λιθί / Ανάβατος / δυτική Χίος",
  "northwest-volissos": "Βολισσός / βορειοδυτική Χίος",
  "north-amani": "Αμανή / βόρεια Χίος",
  "northeast-kardamyla": "Καρδάμυλα / βορειοανατολική Χίος",
};
