/**
 * Curated day trips for the breakfast-QR Day Planner.
 *
 * Each area is a realistic one-day loop from Voulamandis House (Kambos).
 * Slots hold a default stop plus alternatives in the same area; the beach slot
 * is re-picked every day from the live sea outlook (calmest beach first).
 * Drive times are rounded planning estimates, not live navigation.
 */

export type StopKind = "beach" | "village" | "sight" | "food" | "drink";

export type DayTripSlot = {
  kind: StopKind;
  /** Default place id. For beach slots the calmest option of the day wins. */
  default: string;
  options: string[];
  /** Planned time at the stop, in minutes. */
  minutes: number;
  /** Optional stops can be removed and are skipped when closed that weekday. */
  optional?: boolean;
  /** Earliest sensible arrival ("HH:MM"), e.g. an evening drink. */
  notBefore?: string;
};

export type DayTripArea = {
  id: string;
  title: string;
  subtitle: string;
  slots: DayTripSlot[];
};

export const dayTripAreas: DayTripArea[] = [
  {
    id: "south",
    title: "Μαστιχοχώρια & Μαύρα Βόλια",
    subtitle: "Μουσείο Μαστίχας, Πυργί, ηφαιστειακή παραλία και ψάρι στον Εμπορειό",
    slots: [
      { kind: "sight", default: "mastic-museum", options: ["mastic-museum"], minutes: 60, optional: true },
      { kind: "village", default: "pyrgi", options: ["pyrgi", "armolia", "olympoi", "kalamoti"], minutes: 75 },
      { kind: "beach", default: "mavra-volia", options: ["mavra-volia", "vroulidia", "komi", "kato-fana", "lilikas"], minutes: 150 },
      {
        kind: "food",
        default: "karagiorgis-taverna-se",
        options: ["karagiorgis-taverna-se", "poseidonas-emporios-se", "porto-emporios-se", "volcano-emporios-se", "lava-stones-se", "katsika-armolia-se"],
        minutes: 90,
      },
    ],
  },
  {
    id: "southwest",
    title: "Μεστά, Ολύμποι & Σαλάγωνα",
    subtitle: "Το καστροχώρι των Μεστών, κρυστάλλινοι κόλποι και φαγητό στη θάλασσα",
    slots: [
      { kind: "village", default: "mesta", options: ["mesta", "olympoi"], minutes: 75 },
      { kind: "sight", default: "olympoi-cave", options: ["olympoi-cave"], minutes: 45, optional: true },
      { kind: "beach", default: "salagona", options: ["salagona", "agia-dynami", "avlonia", "apothika"], minutes: 150 },
      {
        kind: "food",
        default: "sergia-mesta-port-se",
        options: ["sergia-mesta-port-se", "kato-porta-se", "amethystos-se", "mestousiko-se", "tou-serga-se"],
        minutes: 90,
      },
    ],
  },
  {
    id: "west",
    title: "Νέα Μονή, Ανάβατος & Λιθί",
    subtitle: "Μνημείο UNESCO, το «Μυστράς του Αιγαίου» και ηλιοβασίλεμα στα Αυγώνυμα",
    slots: [
      { kind: "sight", default: "nea-moni", options: ["nea-moni"], minutes: 45, optional: true },
      { kind: "village", default: "anavatos", options: ["anavatos", "avgonyma"], minutes: 60 },
      { kind: "beach", default: "lithi", options: ["lithi", "elinta", "trachili-west", "tigani"], minutes: 150 },
      { kind: "food", default: "tria-aderfia-lithi-se", options: ["tria-aderfia-lithi-se", "to-kyma-lithi-se", "asteri-avgonyma-nw"], minutes: 90 },
      { kind: "drink", default: "drink-avgonyma", options: ["drink-avgonyma"], minutes: 60, optional: true, notBefore: "18:30" },
    ],
  },
  {
    id: "northwest",
    title: "Βολισσός & βόρειες παραλίες",
    subtitle: "Το κάστρο της Βολισσού, μεγάλες αμμουδιές και η Αγία Μαρκέλλα",
    slots: [
      { kind: "village", default: "volissos", options: ["volissos"], minutes: 60 },
      { kind: "beach", default: "lefkathia", options: ["lefkathia", "managros", "limnos-volissos", "agia-markella"], minutes: 150 },
      {
        kind: "food",
        default: "o-kavos-limnia-nw",
        options: ["o-kavos-limnia-nw", "makouti-limnos-nw", "agia-markella-taverna-nw", "fabrika-volissos-nw"],
        minutes: 90,
      },
      { kind: "sight", default: "agia-markella-shrine", options: ["agia-markella-shrine"], minutes: 40, optional: true },
    ],
  },
  {
    id: "northeast",
    title: "Δασκαλόπετρα, Ναγός & Λαγκάδα",
    subtitle: "Η πέτρα του Ομήρου, πηγές και πλατάνια στη θάλασσα, ψάρι στη Λαγκάδα",
    slots: [
      { kind: "sight", default: "daskalopetra-homer", options: ["daskalopetra-homer"], minutes: 30, optional: true },
      { kind: "beach", default: "nagos", options: ["nagos", "giosonas"], minutes: 150 },
      {
        kind: "food",
        default: "nostos-lagada-ne",
        options: ["nostos-lagada-ne", "passas-lagada-ne", "o-geros-lagada-ne", "tageri-lagada-ne", "vardas-lagada-ne", "pantoukios-taverna-ne"],
        minutes: 90,
      },
    ],
  },
  {
    id: "near",
    title: "Χαλαρή μέρα κοντά στον Κάμπο",
    subtitle: "Παραλία σε 10–15 λεπτά, φαγητό δίπλα στο κύμα και βόλτα στο Κάστρο",
    slots: [
      { kind: "beach", default: "agia-fotia", options: ["agia-fotia", "karfas", "megas-limnionas", "glaroi"], minutes: 150 },
      {
        kind: "food",
        default: "agyra-megas-limnionas-se",
        options: ["agyra-megas-limnionas-se", "karatzas-karfas-se", "bahari-agia-ermioni-se", "apomero-thymiana-se", "kapileio-thymiana-se"],
        minutes: 90,
      },
      { kind: "sight", default: "chios-castle", options: ["chios-castle"], minutes: 60, optional: true },
      { kind: "drink", default: "drink-chios-town", options: ["drink-chios-town", "drink-karfas"], minutes: 60, optional: true, notBefore: "19:00" },
    ],
  },
];

export const dayTripAreaById = Object.fromEntries(dayTripAreas.map((area) => [area.id, area])) as Record<string, DayTripArea>;

/**
 * Approved card photos (verified place match, at least ~450 px wide).
 * Places without an approved photo get a designed placeholder instead of an
 * upscaled thumbnail.
 */
export const plannerPhotoById: Record<string, string> = {
  "agia-dynami": "/images/beaches/agia-dynami-beach-chios.webp",
  "agia-fotia": "/images/beaches/agia-fotia-beach-chios.webp",
  avlonia: "/images/beaches/avlonia-1024x768.webp",
  vroulidia: "/images/beaches/vroulidia-2-1.jpg",
  "kato-fana": "/images/beaches/kato-fana-3.jpg",
  komi: "/images/beaches/sakiz-adasi-chios-greece-komi-be-2.jpg",
  "mavra-volia": "/images/beaches/mavra-volia-beach-chios.webp",
  salagona: "/images/beaches/salagona-e1645969502155.webp",
  lithi: "/images/beaches/lithi-beach-chios.webp",
  elinta: "/images/beaches/elinta-beach-chios.jpg",
  "trachili-west": "/images/beaches/trachili-west-beach-chios.jpg",
  tigani: "/images/beaches/tigani-beach-chios.jpg",
  "agia-markella": "/images/beaches/agia-markella-beach-chios.jpg",
  managros: "/images/beaches/managros-beach-chios.jpg",
  "limnos-volissos": "/images/beaches/limnos-volissos-beach-chios.jpg",
  lefkathia: "/images/beaches/lefkathia-2.jpg",
  nagos: "/images/beaches/nagos-beach-chios.webp",
  karfas: "/images/beaches/karfas-beach-chios.jpg",
  daskalopetra: "/images/beaches/daskalopetra-beach-chios.jpg",
  glaroi: "/images/beaches/paralia-ton-glaron-4.jpg",
  pyrgi: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Pyrgi_house1.JPG/1280px-Pyrgi_house1.JPG",
  mesta: "/images/chios-guide/9ac4cf44d16c4af6d873c5bba4a6696b_L.webp",
  olympoi: "/images/villages/olympoi-1-768x432.webp",
  lagada: "/images/villages/lagada_3.webp",
  anavatos: "/images/chios-guide/anavatos-1.jpg",
  "mastic-museum": "/images/museums/mousio.mastic.webp",
  "agia-markella-shrine": "/images/chios-guide/ag-markella.jpg",
  "daskalopetra-homer": "/images/beaches/daskalopetra-beach-chios.jpg",
};

/** Places whose only photo is too small to show well (kept for the photo to-do list). */
export const plannerLowResPhotos = [
  "apothika", "lilikas", "giosonas", "megas-limnionas", "ormos-lo", "mersinidi",
  "vessa", "avgonyma", "kalamoti", "agios-georgios-sykousis", "volissos", "armolia",
];

/**
 * Map anchor for places without their own routing coordinates: the nearest
 * beach or village with verified coordinates (used only for drive estimates).
 */
export const plannerAnchorById: Record<string, { beach?: string; village?: string; coordinates?: { lat: number; lng: number }; driveFromBaseMin?: number }> = {
  "mastic-museum": { village: "pyrgi" },
  "olympoi-cave": { village: "olympoi" },
  "nea-moni": { coordinates: { lat: 38.3739, lng: 26.0565 }, driveFromBaseMin: 25 },
  "agia-markella-shrine": { beach: "agia-markella" },
  "daskalopetra-homer": { beach: "daskalopetra" },
  "chios-castle": { coordinates: { lat: 38.3735, lng: 26.1385 }, driveFromBaseMin: 15 },
  "karagiorgis-taverna-se": { beach: "mavra-volia" },
  "poseidonas-emporios-se": { beach: "mavra-volia" },
  "porto-emporios-se": { beach: "mavra-volia" },
  "volcano-emporios-se": { beach: "mavra-volia" },
  "lava-stones-se": { beach: "mavra-volia" },
  "katsika-armolia-se": { village: "armolia" },
  "sergia-mesta-port-se": { village: "mesta" },
  "kato-porta-se": { village: "olympoi" },
  "amethystos-se": { village: "olympoi" },
  "mestousiko-se": { village: "mesta" },
  "tou-serga-se": { village: "mesta" },
  "tria-aderfia-lithi-se": { beach: "lithi" },
  "to-kyma-lithi-se": { beach: "lithi" },
  "asteri-avgonyma-nw": { village: "avgonyma" },
  "drink-avgonyma": { village: "avgonyma" },
  "o-kavos-limnia-nw": { beach: "lefkathia" },
  "makouti-limnos-nw": { beach: "limnos-volissos" },
  "agia-markella-taverna-nw": { beach: "agia-markella" },
  "fabrika-volissos-nw": { village: "volissos" },
  "nostos-lagada-ne": { village: "lagada" },
  "passas-lagada-ne": { village: "lagada" },
  "o-geros-lagada-ne": { village: "lagada" },
  "tageri-lagada-ne": { village: "lagada" },
  "vardas-lagada-ne": { village: "lagada" },
  "pantoukios-taverna-ne": { village: "lagada" },
  "agyra-megas-limnionas-se": { beach: "megas-limnionas" },
  "karatzas-karfas-se": { beach: "karfas" },
  "bahari-agia-ermioni-se": { beach: "megas-limnionas" },
  "apomero-thymiana-se": { beach: "karfas" },
  "kapileio-thymiana-se": { beach: "karfas" },
  "drink-chios-town": { coordinates: { lat: 38.3707, lng: 26.1365 }, driveFromBaseMin: 15 },
  "drink-karfas": { beach: "karfas" },
};

/** Weekdays (0 = Sunday) on which an optional stop is usually closed. */
export const plannerClosedWeekdays: Record<string, number[]> = {
  "mastic-museum": [2],
};
