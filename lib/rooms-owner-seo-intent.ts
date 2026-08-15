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
      label: "Find your room with AI",
      href: "/ai-assistant/?lang=en",
    },
    wizardIntro: {
      title: "Not sure which room fits you?",
      description:
        "Tell us your dates and number of guests. The AI Room Finder checks specific rooms and lets you send an availability enquiry. It does not complete an online booking.",
    },
  },
  "/el/domatia-xios/": {
    title: "Δωμάτια & διαμερίσματα",
    highlightedTitle: "στη Χίο",
    primaryCta: {
      label: "Βρείτε το δωμάτιό σας με AI",
      href: "/ai-assistant/?lang=el",
    },
    wizardIntro: {
      title: "Δεν είστε σίγουροι ποιο δωμάτιο σας ταιριάζει;",
      description:
        "Πείτε μας ημερομηνίες και αριθμό επισκεπτών. Το AI Room Finder ελέγχει συγκεκριμένα δωμάτια και σας επιτρέπει να στείλετε αίτημα διαθεσιμότητας. Δεν ολοκληρώνει online κράτηση.",
    },
  },
  "/fr/chambres-a-chios/": {
    title: "Chambres et appartements",
    highlightedTitle: "à Chios",
    primaryCta: {
      label: "Trouver votre chambre avec l’IA",
      href: "/ai-assistant/?lang=fr",
    },
    wizardIntro: {
      title: "Vous ne savez pas quelle chambre vous convient ?",
      description:
        "Indiquez vos dates et le nombre de personnes. L’AI Room Finder vérifie des chambres précises et vous permet d’envoyer une demande de disponibilité. Il ne finalise pas de réservation en ligne.",
    },
  },
  "/de/chios-zimmer/": {
    title: "Zimmer & Apartments",
    highlightedTitle: "auf Chios",
    primaryCta: {
      label: "Zimmer mit AI finden",
      href: "/ai-assistant/?lang=de",
    },
    wizardIntro: {
      title: "Nicht sicher, welches Zimmer zu Ihnen passt?",
      description:
        "Geben Sie Ihre Reisedaten und die Gästezahl an. Der AI Room Finder prüft konkrete Zimmer und ermöglicht eine Verfügbarkeitsanfrage. Eine Online-Buchung wird hier nicht abgeschlossen.",
    },
  },
  "/it/camere-a-chios/": {
    title: "Camere e appartamenti",
    highlightedTitle: "a Chios",
    primaryCta: {
      label: "Trova la tua camera con l’AI",
      href: "/ai-assistant/?lang=it",
    },
    wizardIntro: {
      title: "Non sai quale camera fa per te?",
      description:
        "Indica le date e il numero di ospiti. L’AI Room Finder verifica camere specifiche e ti permette di inviare una richiesta di disponibilità. Qui non viene completata una prenotazione online.",
    },
  },
  "/es/habitaciones-en-chios/": {
    title: "Habitaciones y apartamentos",
    highlightedTitle: "en Chios",
    primaryCta: {
      label: "Encuentra tu habitación con IA",
      href: "/ai-assistant/?lang=es",
    },
    wizardIntro: {
      title: "¿No sabes qué habitación es la adecuada para ti?",
      description:
        "Indica las fechas y el número de huéspedes. AI Room Finder comprueba habitaciones concretas y te permite enviar una consulta de disponibilidad. Aquí no se completa una reserva online.",
    },
  },
  "/tr/sakiz-adasi-odalari/": {
    title: "Sakız Adası odaları",
    highlightedTitle: "ve daireleri",
    primaryCta: {
      label: "AI ile odanızı bulun",
      href: "/ai-assistant/?lang=tr",
    },
    wizardIntro: {
      title: "Hangi odanın size uygun olduğundan emin değil misiniz?",
      description:
        "Tarihlerinizi ve misafir sayısını belirtin. AI Room Finder belirli odaları kontrol eder ve müsaitlik talebi göndermenizi sağlar. Burada online rezervasyon tamamlanmaz.",
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
