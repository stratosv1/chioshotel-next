import type { BeachRegion } from "@/content/trip-planner/beaches";
import { beaches as tripBeaches } from "@/content/trip-planner/beaches";
import {
  beachMarineExposureById,
  type BeachMarineExposureMeta,
  type MarineDirection,
} from "@/content/trip-planner/marine-exposure";
import { getAllBeachDetails } from "@/content/beach-details";
import { elintaBeachPaths, karfasBeachPaths } from "@/content/karfas-elinta-paths";

export type SeaLanguage = "en" | "el" | "fr" | "de" | "it" | "es" | "tr";

export const SEA_LANGUAGES: SeaLanguage[] = ["en", "el", "fr", "de", "it", "es", "tr"];

export const DIRECTIONS: MarineDirection[] = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];

/** Latin and Greek display names for all active forecast beaches. */
const beachNames: Record<string, { el: string; latin: string }> = {
  "agia-dynami": { el: "Αγία Δύναμη", latin: "Agia Dynami" },
  "agia-fotia": { el: "Αγία Φωτιά", latin: "Agia Fotia" },
  apothika: { el: "Απόθικα", latin: "Apothika" },
  avlonia: { el: "Αυλωνιά", latin: "Avlonia" },
  vroulidia: { el: "Βρουλίδια", latin: "Vroulidia" },
  "kato-fana": { el: "Κάτω Φανά", latin: "Kato Fana" },
  komi: { el: "Κώμη", latin: "Komi" },
  lilikas: { el: "Λιλικάς", latin: "Lilikas" },
  "mavra-volia": { el: "Μαύρα Βόλια", latin: "Mavra Volia" },
  salagona: { el: "Σαλάγωνα", latin: "Salagona" },
  lithi: { el: "Λιθί", latin: "Lithi" },
  elinta: { el: "Ελίντα", latin: "Elinta" },
  "trachili-west": { el: "Τραχήλι", latin: "Trachili" },
  tigani: { el: "Τηγάνι", latin: "Tigani" },
  "agia-markella": { el: "Αγία Μαρκέλλα", latin: "Agia Markella" },
  managros: { el: "Μάναγρος", latin: "Managros" },
  "limnos-volissos": { el: "Λήμνος Βολισσού", latin: "Limnos (Volissos)" },
  lefkathia: { el: "Λευκάθια", latin: "Lefkathia" },
  giosonas: { el: "Γιόσωνας", latin: "Giosonas" },
  nagos: { el: "Ναγός", latin: "Nagos" },
  karfas: { el: "Καρφάς", latin: "Karfas" },
  "megas-limnionas": { el: "Μέγας Λιμνιώνας", latin: "Megas Limnionas" },
  daskalopetra: { el: "Δασκαλόπετρα", latin: "Daskalopetra" },
  glaroi: { el: "Γλάροι", latin: "Glaroi" },
  "ormos-lo": { el: "Όρμος Λω", latin: "Ormos Lo" },
  mersinidi: { el: "Μερσινίδι", latin: "Mersinidi" },
};

/** Greek prepositional phrase ("στην Κώμη") for beaches that have their own page. */
const greekInPhrase: Record<string, string> = {
  "agia-dynami": "στην Αγία Δύναμη",
  lithi: "στο Λιθί",
  lefkathia: "στη Λευκάθια",
  nagos: "στον Ναγό",
  avlonia: "στην Αυλωνιά",
  salagona: "στα Σαλάγωνα",
  "agia-fotia": "στην Αγία Φωτιά",
  komi: "στην Κώμη",
  "mavra-volia": "στα Μαύρα Βόλια",
  vroulidia: "στα Βρουλίδια",
  "kato-fana": "στα Κάτω Φανά",
  karfas: "στον Καρφά",
  elinta: "στην Ελίντα",
};

export function beachName(id: string, language: SeaLanguage) {
  const names = beachNames[id];
  if (!names) return id;
  return language === "el" ? names.el : names.latin;
}

export function greekInBeachPhrase(id: string) {
  return greekInPhrase[id] ?? `στην παραλία ${beachNames[id]?.el ?? id}`;
}

export const forecastBeachIds = tripBeaches.map((beach) => beach.id);

export const beachRegionById: Record<string, BeachRegion> = Object.fromEntries(
  tripBeaches.map((beach) => [beach.id, beach.region]),
);

export function exposureFor(id: string): BeachMarineExposureMeta | null {
  return beachMarineExposureById[id] ?? null;
}

const englishSlugAliases: Record<string, string> = {
  "agia-dynami-beach-chios": "agia-dynami",
  "emporios-beach": "mavra-volia",
  "avlonia-beach2": "avlonia",
};

const idsByLength = [...forecastBeachIds].sort((a, b) => b.length - a.length);

/** Maps a beach page path (any language) to its forecast beach id. */
export function beachIdFromPath(path: string): string | null {
  const segment = path.split("/").filter(Boolean).pop() ?? "";
  if (englishSlugAliases[segment]) return englishSlugAliases[segment];
  return idsByLength.find((id) => segment.includes(id)) ?? null;
}

export function languageFromPath(path: string): SeaLanguage {
  const prefix = path.split("/").filter(Boolean)[0];
  return (SEA_LANGUAGES as string[]).includes(prefix) && prefix !== "en"
    ? (prefix as SeaLanguage)
    : "en";
}

function buildBeachPageIndex() {
  const index: Record<SeaLanguage, Record<string, string>> = {
    en: {}, el: {}, fr: {}, de: {}, it: {}, es: {}, tr: {},
  };
  const paths = [
    ...getAllBeachDetails().map((beach) => beach.seo.canonicalPath),
    ...Object.values(karfasBeachPaths),
    ...Object.values(elintaBeachPaths),
  ];
  for (const path of paths) {
    const id = beachIdFromPath(path);
    if (!id) continue;
    const language = languageFromPath(path);
    if (!index[language][id]) index[language][id] = path;
  }
  return index;
}

let beachPageIndex: Record<SeaLanguage, Record<string, string>> | null = null;

/** Public beach page for a forecast beach in the given language, if one exists. */
export function beachPagePath(id: string, language: SeaLanguage): string | null {
  beachPageIndex ??= buildBeachPageIndex();
  return beachPageIndex[language][id] ?? null;
}

export function directionFromDegrees(degrees: number | null): MarineDirection | null {
  if (degrees === null || !Number.isFinite(degrees)) return null;
  return DIRECTIONS[Math.round((((degrees % 360) + 360) % 360) / 45) % 8];
}

export function shelteredDirections(meta: BeachMarineExposureMeta) {
  return DIRECTIONS.filter((direction) => meta.exposure[direction] <= 0.15);
}

export function exposedDirections(meta: BeachMarineExposureMeta) {
  return DIRECTIONS.filter((direction) => meta.exposure[direction] >= 0.75);
}

export type MeltemiFit = "sheltered" | "partly" | "exposed";

/** How a beach usually behaves with the summer north/north-east wind (meltemi). */
export function meltemiFit(meta: BeachMarineExposureMeta): MeltemiFit {
  const value = Math.max(meta.exposure.N, meta.exposure.NE);
  if (value <= 0.2) return "sheltered";
  if (value < 0.6) return "partly";
  return "exposed";
}

function shelteredFrom(directions: MarineDirection[], threshold: number) {
  return forecastBeachIds.filter((id) => {
    const meta = exposureFor(id);
    return meta ? Math.max(...directions.map((direction) => meta.exposure[direction])) <= threshold : false;
  });
}

/** Evergreen lists: which beaches are usually sheltered from each main wind. */
export const shelteredBeachesByWind = {
  north: shelteredFrom(["N", "NE"], 0.2),
  south: shelteredFrom(["S", "SE"], 0.2),
  west: shelteredFrom(["W", "SW"], 0.2),
};
