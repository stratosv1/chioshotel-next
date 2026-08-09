export type PlannerExtraCategory = "sights" | "food" | "drink";
export type PlannerExtraRegion = "NW" | "NE" | "SW" | "SE";

export type PlannerExtraPlace = {
  id: string;
  name: string;
  category: PlannerExtraCategory;
  region: PlannerExtraRegion;
  image: string | null;
  meta: string;
};

/**
 * Initial non-business-specific Trip Planner options.
 * Food/drink entries describe areas and experiences, not ranked businesses.
 * They can later be replaced by a separately curated restaurant/bar dataset.
 */
export const plannerExtraPlaces: PlannerExtraPlace[] = [
  {
    id: "mastic-museum",
    name: "Μουσείο Μαστίχας Χίου",
    category: "sights",
    region: "SE",
    image: null,
    meta: "Κοντά στο Πυργί · ιδανικό μαζί με Μαστιχοχώρια και νότιες παραλίες.",
  },
  {
    id: "olympoi-cave",
    name: "Σπήλαιο Ολύμπων",
    category: "sights",
    region: "SW",
    image: null,
    meta: "Σπήλαιο κοντά στους Ολύμπους · έλεγξε το εποχικό ωράριο πριν πας.",
  },
  {
    id: "nea-moni",
    name: "Νέα Μονή",
    category: "sights",
    region: "NW",
    image: null,
    meta: "Ιστορική μονή στην κεντροδυτική Χίο · συνδυάζεται με Ανάβατο και Αυγώνυμα.",
  },
  {
    id: "agia-markella-shrine",
    name: "Προσκύνημα Αγίας Μαρκέλλας",
    category: "sights",
    region: "NW",
    image: null,
    meta: "Βορειοδυτική Χίος · ταιριάζει με Βολισσό και παραλίες της περιοχής.",
  },
  {
    id: "daskalopetra-homer",
    name: "Πέτρα του Ομήρου · Δασκαλόπετρα",
    category: "sights",
    region: "NE",
    image: null,
    meta: "Σύντομη πολιτιστική στάση στον Βροντάδο, δίπλα στην παραλία Δασκαλόπετρα.",
  },
  {
    id: "chios-castle",
    name: "Κάστρο Χίου",
    category: "sights",
    region: "NE",
    image: null,
    meta: "Εύκολη στάση κοντά στη Χώρα για βόλτα και ιστορία.",
  },

  {
    id: "food-emporios",
    name: "Εμπορειός · ψάρι & θαλασσινά",
    category: "food",
    region: "SE",
    image: null,
    meta: "Καλή στάση μετά τα Μαύρα Βόλια και το Πυργί.",
  },
  {
    id: "food-komi",
    name: "Κώμη · παραθαλάσσιες ταβέρνες",
    category: "food",
    region: "SE",
    image: null,
    meta: "Χαλαρό φαγητό δίπλα στη θάλασσα, εύκολο μετά από νότια παραλία.",
  },
  {
    id: "food-mesta",
    name: "Μεστά · πλατεία & μεζέδες",
    category: "food",
    region: "SW",
    image: null,
    meta: "Ταιριάζει πολύ καλά μετά από Αυλωνιά, Απόθικα ή Κάτω Φανά.",
  },
  {
    id: "food-avgonyma",
    name: "Αυγώνυμα · φαγητό με θέα",
    category: "food",
    region: "NW",
    image: null,
    meta: "Ιδανικό κλείσιμο ημέρας μετά τον Ανάβατο, ειδικά προς sunset.",
  },
  {
    id: "food-lithi",
    name: "Λιθί · ψαροταβέρνες",
    category: "food",
    region: "NW",
    image: null,
    meta: "Φαγητό δίπλα στο λιμανάκι και εύκολος συνδυασμός με παραλία Λιθί.",
  },
  {
    id: "food-lagada",
    name: "Λαγκάδα · ψαροφαγία στο λιμανάκι",
    category: "food",
    region: "NE",
    image: null,
    meta: "Καλή επιλογή για βορειοανατολική διαδρομή με Καρδάμυλα, Ναγό ή Γιόσωνα.",
  },

  {
    id: "drink-mesta",
    name: "Μεστά · βραδινό ποτό",
    category: "drink",
    region: "SW",
    image: null,
    meta: "Χαλαρό ποτό στην πλατεία μετά τη νοτιοδυτική διαδρομή.",
  },
  {
    id: "drink-avgonyma",
    name: "Αυγώνυμα · sunset drink",
    category: "drink",
    region: "NW",
    image: null,
    meta: "Δυτική θέα και ηλιοβασίλεμα στο τέλος της ημέρας.",
  },
  {
    id: "drink-chios-town",
    name: "Χώρα Χίου · βραδινό ποτό",
    category: "drink",
    region: "NE",
    image: null,
    meta: "Εύκολο κλείσιμο ημέρας κοντά στην πόλη.",
  },
  {
    id: "drink-karfas",
    name: "Καρφάς · beach bar",
    category: "drink",
    region: "SE",
    image: null,
    meta: "Παραθαλάσσιο ποτό κοντά στον Κάμπο και τη νότια ακτή.",
  },
  {
    id: "drink-glaroi",
    name: "Γλάροι · beach bar",
    category: "drink",
    region: "NE",
    image: null,
    meta: "Πιο ζωντανή επιλογή για απογευματινό ή early-evening ποτό.",
  },
];

export const plannerExtraPlacesByCategory = {
  sights: plannerExtraPlaces.filter((item) => item.category === "sights"),
  food: plannerExtraPlaces.filter((item) => item.category === "food"),
  drink: plannerExtraPlaces.filter((item) => item.category === "drink"),
} as const;
