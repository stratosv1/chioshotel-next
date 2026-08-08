import type { BeachMaster } from "./beaches";
import type { VillageMaster } from "./villages";

/**
 * Trip Planner media that is already present elsewhere on chioshotel.gr.
 *
 * Only exact, verified place-to-image matches belong here. Do not add generic
 * destination photos or images reused as placeholders on another page.
 */
export const tripPlannerBeachImages: Readonly<Record<string, string>> = {
  "agia-dynami": "/images/beaches/agia-dynami-beach-chios.webp",
  "agia-fotia": "/images/beaches/agia-fotia-beach-chios.webp",
  avlonia: "/images/beaches/avlonia-1024x768.webp",
  vroulidia: "/images/beaches/vroulidia-2-1.jpg",
  "kato-fana": "/images/beaches/kato-fana-beach-chios.webp",
  komi: "/images/beaches/komi-sandy-beach-chios.webp",
  "mavra-volia": "/images/beaches/mavra-volia-beach-chios.webp",
  salagona: "/images/beaches/salagona-beach-chios.webp",
  daskalopetra: "/images/beaches/daskalopetra-beach-chios.webp",
  karfas: "/images/beaches/karfas-beach-chios.webp",
  glaroi: "/images/beaches/paralia-glaron-beach-chios.webp",
  lefkathia: "/images/beaches/lefkathia-2.jpg",
  nagos: "/images/beaches/nagos-beach-chios.webp",
  lithi: "/images/beaches/lithi-beach-chios.webp",
};

/**
 * Keep this separate from the canonical village dataset so new user-approved
 * photos can be added without changing facts/routing. The six existing village
 * images are already set directly on their canonical VillageMaster entries.
 */
export const tripPlannerVillageImages: Readonly<Record<string, string>> = {};

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
