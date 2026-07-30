import type { RoomsCategoryPageData } from "@/content/rooms";

type RoomsOwnerHeroIntent = Pick<
  RoomsCategoryPageData["hero"],
  "title" | "highlightedTitle"
>;

const roomsOwnerHeroIntentByPath: Readonly<Record<string, RoomsOwnerHeroIntent>> = {
  "/chios-rooms/": {
    title: "Rooms & Apartments",
    highlightedTitle: "in Chios",
  },
  "/el/domatia-xios/": {
    title: "Δωμάτια & διαμερίσματα",
    highlightedTitle: "στη Χίο",
  },
  "/fr/chambres-a-chios/": {
    title: "Chambres et appartements",
    highlightedTitle: "à Chios",
  },
  "/de/chios-zimmer/": {
    title: "Zimmer & Apartments",
    highlightedTitle: "auf Chios",
  },
  "/it/camere-a-chios/": {
    title: "Camere e appartamenti",
    highlightedTitle: "a Chios",
  },
  "/es/habitaciones-en-chios/": {
    title: "Habitaciones y apartamentos",
    highlightedTitle: "en Chios",
  },
  "/tr/sakiz-adasi-odalari/": {
    title: "Sakız Adası odaları",
    highlightedTitle: "ve daireleri",
  },
  "/pl/pokoje-na-chios/": {
    title: "Pokoje i apartamenty",
    highlightedTitle: "na Chios",
  },
};

export function withRoomsOwnerHeroIntent(
  data: RoomsCategoryPageData,
): RoomsCategoryPageData {
  const heroIntent = roomsOwnerHeroIntentByPath[data.seo.canonicalPath];

  if (!heroIntent) return data;

  return {
    ...data,
    hero: {
      ...data.hero,
      ...heroIntent,
    },
  };
}
