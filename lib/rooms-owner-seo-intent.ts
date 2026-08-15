import type { RoomsCategoryPageData } from "@/content/rooms";

type RoomsOwnerExperience = Pick<
  RoomsCategoryPageData["hero"],
  "title" | "highlightedTitle"
> & {
  primaryCta?: RoomsCategoryPageData["hero"]["primaryCta"];
  wizardIntro?: RoomsCategoryPageData["wizardIntro"];
};

const roomsOwnerExperienceByPath: Readonly<Record<string, RoomsOwnerExperience>> = {
  "/chios-rooms/": {
    title: "Rooms & Apartments",
    highlightedTitle: "in Chios",
    primaryCta: {
      label: "Check live availability",
      href: "/ai-assistant/?lang=en",
    },
    wizardIntro: {
      title: "Prefer a guided room match?",
      description:
        "The Room Wizard suggests a room type based on your preferences. It is a room-matching guide, not a live availability or live-pricing search.",
    },
  },
  "/el/domatia-xios/": {
    title: "Δωμάτια & διαμερίσματα",
    highlightedTitle: "στη Χίο",
    primaryCta: {
      label: "Live διαθεσιμότητα & τιμές",
      href: "/ai-assistant/?lang=el",
    },
    wizardIntro: {
      title: "Θέλετε βοήθεια να διαλέξετε τύπο δωματίου;",
      description:
        "Το Room Wizard προτείνει τύπο δωματίου με βάση τις προτιμήσεις σας. Είναι οδηγός επιλογής και δεν ελέγχει live διαθεσιμότητα ή live τιμές.",
    },
  },
  "/fr/chambres-a-chios/": {
    title: "Chambres et appartements",
    highlightedTitle: "à Chios",
    primaryCta: {
      label: "Disponibilités & tarifs en direct",
      href: "/ai-assistant/?lang=fr",
    },
    wizardIntro: {
      title: "Vous préférez être guidé dans votre choix ?",
      description:
        "Le Room Wizard suggère un type de chambre selon vos préférences. Il s’agit d’un guide de choix, pas d’une recherche de disponibilité ou de tarifs en direct.",
    },
  },
  "/de/chios-zimmer/": {
    title: "Zimmer & Apartments",
    highlightedTitle: "auf Chios",
    primaryCta: {
      label: "Live-Verfügbarkeit & Preise",
      href: "/ai-assistant/?lang=de",
    },
    wizardIntro: {
      title: "Möchten Sie Hilfe bei der Zimmerwahl?",
      description:
        "Der Room Wizard empfiehlt anhand Ihrer Wünsche einen Zimmertyp. Er ist eine Auswahlhilfe und prüft keine Live-Verfügbarkeit oder Live-Preise.",
    },
  },
  "/it/camere-a-chios/": {
    title: "Camere e appartamenti",
    highlightedTitle: "a Chios",
    primaryCta: {
      label: "Disponibilità e prezzi live",
      href: "/ai-assistant/?lang=it",
    },
    wizardIntro: {
      title: "Preferisci una guida nella scelta della camera?",
      description:
        "Il Room Wizard suggerisce un tipo di camera in base alle tue preferenze. È una guida alla scelta e non controlla disponibilità o prezzi in tempo reale.",
    },
  },
  "/es/habitaciones-en-chios/": {
    title: "Habitaciones y apartamentos",
    highlightedTitle: "en Chios",
    primaryCta: {
      label: "Disponibilidad y precios en vivo",
      href: "/ai-assistant/?lang=es",
    },
    wizardIntro: {
      title: "¿Prefieres una ayuda para elegir habitación?",
      description:
        "El Room Wizard recomienda un tipo de habitación según tus preferencias. Es una guía de elección y no consulta disponibilidad ni precios en tiempo real.",
    },
  },
  "/tr/sakiz-adasi-odalari/": {
    title: "Sakız Adası odaları",
    highlightedTitle: "ve daireleri",
    primaryCta: {
      label: "Canlı müsaitlik ve fiyatlar",
      href: "/ai-assistant/?lang=tr",
    },
    wizardIntro: {
      title: "Oda seçimi için rehber ister misiniz?",
      description:
        "Room Wizard tercihlerinize göre bir oda türü önerir. Bu bir seçim rehberidir; canlı müsaitlik veya canlı fiyat kontrolü yapmaz.",
    },
  },
  "/pl/pokoje-na-chios/": {
    title: "Pokoje i apartamenty",
    highlightedTitle: "na Chios",
  },
};

export function withRoomsOwnerHeroIntent(
  data: RoomsCategoryPageData,
): RoomsCategoryPageData {
  const experience = roomsOwnerExperienceByPath[data.seo.canonicalPath];

  if (!experience) return data;

  return {
    ...data,
    hero: {
      ...data.hero,
      title: experience.title,
      highlightedTitle: experience.highlightedTitle,
      ...(experience.primaryCta ? { primaryCta: experience.primaryCta } : {}),
    },
    ...(experience.wizardIntro ? { wizardIntro: experience.wizardIntro } : {}),
  };
}
