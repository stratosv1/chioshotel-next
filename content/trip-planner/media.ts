import type { BeachMaster } from "./beaches";
import type { VillageMaster } from "./villages";

/**
 * Trip Planner media. Existing site assets stay in their original folders;
 * user-approved missing place photos live under /images/trip-planner/.
 * Only exact, verified place-to-image matches belong here.
 */
export const tripPlannerBeachImages: Readonly<Record<string, string>> = {
  "agia-dynami": "/images/beaches/agia-dynami-beach-chios.webp",
  "agia-fotia": "/images/beaches/agia-fotia-beach-chios.webp",
  apothika: "/images/trip-planner/beaches/apothika.webp",
  avlonia: "/images/beaches/avlonia-1024x768.webp",
  vroulidia: "/images/beaches/vroulidia-2-1.jpg",
  "kato-fana": "/images/beaches/kato-fana-beach-chios.webp",
  komi: "/images/beaches/komi-sandy-beach-chios.webp",
  lilikas: "/images/trip-planner/beaches/lilikas.webp",
  "mavra-volia": "/images/beaches/mavra-volia-beach-chios.webp",
  salagona: "/images/beaches/salagona-beach-chios.webp",
  "trachilia-south": "/images/trip-planner/beaches/trachilia-south.webp",
  karfas: "/images/beaches/karfas-beach-chios.jpg",
  "megas-limnionas": "/images/trip-planner/beaches/megas-limnionas.webp",
  daskalopetra: "/images/beaches/daskalopetra-beach-chios.webp",
  "afanis-naftis": "/images/trip-planner/beaches/afanis-naftis.webp",
  glaroi: "/images/beaches/paralia-glaron-beach-chios.webp",
  "ormos-lo": "/images/trip-planner/beaches/ormos-lo.webp",
  mersinidi: "/images/trip-planner/beaches/mersinidi.webp",
  "agia-markella": "/images/trip-planner/beaches/agia-markella.webp",
  agiasmata: "/images/trip-planner/beaches/agiasmata.webp",
  managros: "/images/trip-planner/beaches/managros.webp",
  "limnos-volissos": "/images/trip-planner/beaches/limnos-volissos.webp",
  lefkathia: "/images/beaches/lefkathia-2.jpg",
  giosonas: "/images/trip-planner/beaches/giosonas.webp",
  nagos: "/images/beaches/nagos-beach-chios.webp",
  lithi: "/images/beaches/lithi-beach-chios.webp",
  elinta: "/images/trip-planner/beaches/elinta.webp",
  "trachili-west": "/images/trip-planner/beaches/trachili-west.webp",
  tigani: "/images/trip-planner/beaches/tigani.webp",
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
      image: beach.image ?? tripPlannerBeachImages[beach.id] ?? null,
    })),
    villages: villageItems.map((village) => ({
      ...village,
      image: village.image ?? tripPlannerVillageImages[village.id] ?? null,
    })),
  };
}
