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

  return (
    <>
      <style>{`
        main > section:first-child a[href*="chios-rooms"],
        main > section:first-child a[href*="domatia-xios"],
        main > section:first-child a[href*="chambres-a-chios"],
        main > section:first-child a[href*="chios-zimmer"],
        main > section:first-child a[href*="camere-a-chios"],
        main > section:first-child a[href*="habitaciones-en-chios"],
        main > section:first-child a[href*="sakiz-adasi-odalari"],
        main > section:first-child a[href*="chios-rooms"] *,
        main > section:first-child a[href*="domatia-xios"] *,
        main > section:first-child a[href*="chambres-a-chios"] *,
        main > section:first-child a[href*="chios-zimmer"] *,
        main > section:first-child a[href*="camere-a-chios"] *,
        main > section:first-child a[href*="habitaciones-en-chios"] *,
        main > section:first-child a[href*="sakiz-adasi-odalari"] * {
          color: #fff !important;
        }

        @media (max-width: 767px) {
          main > section:first-child > div:nth-of-type(3) > div {
            background-color: rgba(12, 10, 9, 0.76) !important;
            backdrop-filter: none !important;
            -webkit-backdrop-filter: none !important;
          }

          main > section:first-child a {
            backdrop-filter: none !important;
            -webkit-backdrop-filter: none !important;
          }
        }

        @media (min-width: 768px) {
          main > section:first-child > div:nth-of-type(1) {
            background: rgba(0,0,0,0.08) !important;
          }

          main > section:first-child > div:nth-of-type(2) {
            background-image: linear-gradient(to left, rgba(0,0,0,0.46), rgba(0,0,0,0.16), rgba(0,0,0,0.02)) !important;
          }

          main > section:first-child > div:nth-of-type(3) {
            justify-content: flex-end !important;
            padding-right: clamp(2rem, 7vw, 6rem) !important;
          }

          main > section:first-child > div:nth-of-type(3) > div {
            max-width: 46rem !important;
          }

          main > section:first-child > div:nth-of-type(3) > div > div:last-child {
            background: linear-gradient(135deg, rgba(18,13,10,0.54), rgba(67,43,26,0.34)) !important;
            border-color: rgba(255,255,255,0.20) !important;
            box-shadow: 0 26px 80px rgba(0,0,0,0.22) !important;
            backdrop-filter: blur(18px) !important;
            -webkit-backdrop-filter: blur(18px) !important;
          }
        }
      `}</style>
      <HomePageTailwind data={renderedData} />
    </>
  );
}
