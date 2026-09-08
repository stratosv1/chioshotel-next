import type { HomePageData } from "@/content/home";
import { HomePageTailwind } from "@/components/home/HomePageTailwind";

type HomePageTailwindV3Props = {
  data: HomePageData;
};

type AccommodationLinkCopy = {
  href: string;
  prefix: string;
  label: string;
  suffix: string;
};

const accommodationLinks: Record<string, AccommodationLinkCopy> = {
  "/": {
    href: "/chios-accommodation/",
    prefix: "For more options and practical information before booking, read our guide to ",
    label: "accommodation in Chios",
    suffix: ".",
  },
  "/el/": {
    href: "/el/diamoni-sti-xio/",
    prefix: "Για περισσότερες επιλογές και χρήσιμες πληροφορίες πριν την κράτηση, δείτε τον οδηγό μας για ",
    label: "Διαμονή στη Χίο",
    suffix: ".",
  },
  "/fr/": {
    href: "/fr/hebergement-chios/",
    prefix: "Pour comparer davantage d’options avant de réserver, consultez notre guide de l’",
    label: "hébergement à Chios",
    suffix: ".",
  },
  "/de/": {
    href: "/de/chios-unterkunft/",
    prefix: "Weitere Optionen und praktische Hinweise vor der Buchung finden Sie in unserem Guide zu ",
    label: "Unterkünften auf Chios",
    suffix: ".",
  },
  "/it/": {
    href: "/it/alloggio-chios/",
    prefix: "Per confrontare altre opzioni prima di prenotare, consulta la nostra guida all’",
    label: "alloggio a Chios",
    suffix: ".",
  },
  "/es/": {
    href: "/es/alojamiento-chios/",
    prefix: "Para comparar más opciones antes de reservar, consulta nuestra guía de ",
    label: "alojamiento en Quíos",
    suffix: ".",
  },
  "/tr/": {
    href: "/tr/sakiz-adasi-konaklama/",
    prefix: "Rezervasyon öncesinde daha fazla seçeneği karşılaştırmak için ",
    label: "Sakız Adası konaklama rehberimize",
    suffix: " göz atın.",
  },
};

function localizeInheritedCopy(data: HomePageData): HomePageData {
  if (data.seo.canonicalPath === "/el/") {
    return {
      ...data,
      intro: {
        ...data.intro,
        left: {
          ...data.intro.left,
          pills: data.intro.left.pills.map((pill) =>
            pill === "💎 Value for money" ? "💎 Καλή σχέση ποιότητας-τιμής" : pill,
          ),
        },
        right: {
          ...data.intro.right,
          cards: data.intro.right.cards.map((card) =>
            card.title.includes("Room Wizard")
              ? { ...card, title: "🧭 Βρες το δωμάτιό σου" }
              : card,
          ),
        },
      },
      location: {
        ...data.location,
        discount: {
          ...data.location.discount,
          badge: "Προσφορά τώρα • Πάρε κωδικό",
        },
      },
      roomsPreview: {
        ...data.roomsPreview,
        primaryCta: {
          ...data.roomsPreview.primaryCta,
          label: "Βρες το δωμάτιό σου",
        },
        rooms: data.roomsPreview.rooms.map((room) => ({
          ...room,
          liveBadge: "ΤΩΡΑ",
          bedBadge:
            room.bedBadge === "🛏️ Family beds"
              ? "🛏️ Οικογενειακά κρεβάτια"
              : room.bedBadge.replace(" + extra", " + επιπλέον κρεβάτι"),
          meta: room.meta.map((item) =>
            item === "🏡 Apt" ? "🏡 Διαμέρισμα" : item,
          ),
        })),
      },
      lastMinute: {
        ...data.lastMinute,
        kicker: "Προσφορές τελευταίας στιγμής",
        widget: {
          ...data.lastMinute.widget,
          timerLabel: "Οι τιμές τελευταίας στιγμής ανανεώνονται σε:",
        },
      },
      amenities: {
        ...data.amenities,
        items: data.amenities.items.map((item) =>
          item.label === "Parking" ? { ...item, label: "Στάθμευση" } : item,
        ),
      },
      traveler: {
        ...data.traveler,
        kicker: "Ανακάλυψε τη Χίο",
      },
    };
  }

  if (data.seo.canonicalPath === "/de/") {
    return {
      ...data,
      intro: {
        ...data.intro,
        right: {
          ...data.intro.right,
          cards: data.intro.right.cards.map((card) =>
            card.title.includes("Room Wizard")
              ? { ...card, title: "🧭 Zimmerfinder" }
              : card,
          ),
        },
      },
      location: {
        ...data.location,
        infoCard: {
          ...data.location.infoCard,
          emailLabel: "E-Mail:",
        },
      },
      roomsPreview: {
        ...data.roomsPreview,
        primaryCta: {
          ...data.roomsPreview.primaryCta,
          label: "Zimmerfinder",
        },
        rooms: data.roomsPreview.rooms.map((room) => ({
          ...room,
          title: room.title === "Economy Doppelzimmer" ? "Economy-Doppelzimmer" : room.title,
          liveBadge: "AKTUELL",
          meta: room.meta.map((item) => item === "🏡 Apt" ? "🏡 Apartment" : item),
        })),
      },
    };
  }

  if (data.seo.canonicalPath !== "/tr/") {
    return data;
  }

  return {
    ...data,
    intro: {
      ...data.intro,
      right: {
        ...data.intro.right,
        cards: data.intro.right.cards.map((card) =>
          card.title.includes("Room Wizard")
            ? { ...card, title: "🧭 Oda Asistanı" }
            : card,
        ),
      },
    },
    location: {
      ...data.location,
      infoCard: {
        ...data.location.infoCard,
        addressLines: ["Mayor Kalvokoresi 117", "Kambos, Sakız Adası 82100"],
        emailLabel: "E-posta:",
      },
    },
    roomsPreview: {
      ...data.roomsPreview,
      primaryCta: {
        ...data.roomsPreview.primaryCta,
        label: "Oda Asistanı",
      },
      rooms: data.roomsPreview.rooms.map((room) => ({
        ...room,
        liveBadge: "CANLI",
      })),
    },
  };
}

export function HomePageTailwindV3({ data }: HomePageTailwindV3Props) {
  const accommodationLink = accommodationLinks[data.seo.canonicalPath];
  const dataWithAccommodationLink: HomePageData = accommodationLink
    ? {
        ...data,
        intro: {
          ...data.intro,
          left: {
            ...data.intro.left,
            bodyHtml: `${data.intro.left.bodyHtml} ${accommodationLink.prefix}<a href="${accommodationLink.href}" class="font-semibold text-amber-800 underline decoration-amber-300 underline-offset-4 transition-colors hover:text-amber-900">${accommodationLink.label}</a>${accommodationLink.suffix}`,
          },
        },
      }
    : data;
  const renderedData = localizeInheritedCopy(dataWithAccommodationLink);

  return <HomePageTailwind data={renderedData} />;
}
