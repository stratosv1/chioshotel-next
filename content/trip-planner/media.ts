import type { BeachMaster } from "./beaches";
import type { VillageMaster } from "./villages";

/**
 * Curated Trip Planner media overrides.
 *
 * Prefer existing site assets when they are already suitable. Place-specific
 * Trip Planner assets are kept under /images/trip-planner/ only when a better
 * existing site image is not available. Verified full-resolution Chios.gr
 * originals are used directly when the imported local copy is only a tiny
 * thumbnail and looks visibly soft inside the planner cards.
 */
export const tripPlannerBeachImages: Readonly<Record<string, string>> = {
  "agia-dynami": "/images/beaches/agia-dynami-beach-chios.webp",
  "agia-fotia": "/images/beaches/agia-fotia-beach-chios.webp",
  apothika: "https://www.chios.gr/images/beaches-pages/apothika/apothika-1.jpg",
  avlonia: "/images/beaches/avlonia-1024x768.webp",
  vroulidia: "/images/beaches/vroulidia-2-1.jpg",
  "kato-fana": "/images/beaches/kato-fana-beach-chios.webp",
  komi: "/images/beaches/komi-sandy-beach-chios.webp",
  lilikas: "/images/trip-planner/beaches/lilikas.webp",
  "mavra-volia": "/images/beaches/mavra-volia-beach-chios.webp",
  salagona: "/images/beaches/salagona-beach-chios.webp",
  karfas: "/images/beaches/karfas-beach-chios.jpg",
  "megas-limnionas": "https://www.chios.gr/images/beaches-pages/megas-limnionas/megas-limnionas-1.jpg",
  daskalopetra: "/images/beaches/daskalopetra-beach-chios.webp",
  glaroi: "/images/beaches/paralia-glaron-beach-chios.webp",
  "ormos-lo": "https://www.chios.gr/images/beaches-pages/ormos-lo/ormos-lo.jpg",
  mersinidi: "https://www.chios.gr/images/beaches-pages/mersinidi/mersinidi-1.jpg",
  "agia-markella": "/images/beaches/agia-markella-beach-chios.jpg",
  managros: "/images/beaches/managros-beach-chios.jpg",
  "limnos-volissos": "/images/beaches/limnos-volissos-beach-chios.jpg",
  lefkathia: "/images/beaches/lefkathia-2.jpg",
  giosonas: "https://www.chios.gr/images/beaches-pages/giosonas/giosonas-1.jpg",
  nagos: "/images/beaches/nagos-beach-chios.webp",
  lithi: "/images/beaches/lithi-beach-chios.webp",
  elinta: "/images/beaches/elinta-beach-chios.jpg",
  "trachili-west": "/images/beaches/trachili-west-beach-chios.jpg",
  tigani: "/images/beaches/tigani-beach-chios.jpg",
};

export const tripPlannerVillageImages: Readonly<Record<string, string>> = {
  vessa: "/images/trip-planner/villages/vessa.webp",
  anavatos: "/images/trip-planner/villages/anavatos.webp",
  avgonyma: "/images/trip-planner/villages/avgonyma.webp",
  kalamoti: "/images/trip-planner/villages/kalamoti.webp",
  "agios-georgios-sykousis": "/images/trip-planner/villages/agios-georgios-sykousis.webp",
};

export function applyTripPlannerMedia(
  beachItems: BeachMaster[],
  villageItems: VillageMaster[],
): { beaches: BeachMaster[]; villages: VillageMaster[] } {
  return {
    beaches: beachItems.map((beach) => ({
      ...beach,
      image: tripPlannerBeachImages[beach.id] ?? beach.image ?? null,
    })),
    villages: villageItems.map((village) => ({
      ...village,
      image: tripPlannerVillageImages[village.id] ?? village.image ?? null,
    })),
  };
}
