import { roomsCategoryEn, type RoomsCategoryPageData } from "@/content/rooms";

export const roomsCategoryPl: RoomsCategoryPageData = {
  ...roomsCategoryEn,
  seo: {
    canonicalPath: "/pl/pokoje-na-chios/",
    title: "Pokoje na Chios i apartamenty | Voulamandis House",
    description:
      "Zobacz pokoje i apartamenty Voulamandis House w Kambos na Chios: ekonomiczne pokoje dwuosobowe, pokoje na parterze i piętrze oraz apartamenty rodzinne.",
    ogImage: "/images/rooms/chios-hotels-family-apartments.webp",
  },
  hero: {
    kicker: "Pokoje Voulamandis House",
    title: "Gdzie nocować",
    highlightedTitle: "na Chios?",
    description:
      "Wybierz kategorię dopasowaną do podróży: ekonomiczne pokoje dwuosobowe, wygodne pokoje dwu- i trzyosobowe albo rodzinne apartamenty z kuchnią i większą przestrzenią.",
    primaryCta: {
      label: "Znajdź mój pokój",
      href: "#room-wizard-app",
    },
    secondaryCta: {
      label: "Zobacz wszystkie pokoje",
      href: "#rooms-list",
    },
  },
  intro: {
    title: "Pokoje i apartamenty na Chios",
    description:
      "Poznaj 4 kategorie zakwaterowania w Voulamandis House w Kambos. Wybierz spokojny pokój dla pary, wygodną opcję dla małej rodziny lub przestronny apartament rodzinny.",
  },
  cards: [
    {
      ...roomsCategoryEn.cards[0],
      id: "pl-economy-double",
      title: "Ekonomiczny pokój dwuosobowy",
      subtitle: "Korzystna opcja dla 2 osób",
      description:
        "Ekonomiczna opcja dla 2 osób. Odnowione pokoje o powierzchni około 16 m² z najważniejszym wyposażeniem i spokojną atmosferą Kambos.",
      href: "/pl/pokoje-na-chios/pokoj-dwuosobowy-economy/",
      imageAlt: "Ekonomiczny pokój dwuosobowy na Chios w Voulamandis House",
      badge: "Dobra cena",
      ctaLabel: "Zobacz pokój",
      meta: ["2 osoby", "16 m²", "Economy"],
    },
    {
      ...roomsCategoryEn.cards[1],
      id: "pl-ground-floor",
      title: "Pokoje na parterze",
      subtitle: "Pokoje dwu- i trzyosobowe",
      description:
        "Pokoje dwu- i trzyosobowe z bezpośrednim dostępem do dziedzińca i ogrodu. Dobry wybór, jeśli zależy Ci na łatwym dostępie bez schodów.",
      href: "/pl/pokoje-na-chios/pokoje-standardowe/",
      imageAlt: "Pokoje na parterze na Chios z dostępem do ogrodu",
      badge: "Dostęp do ogrodu",
      ctaLabel: "Zobacz pokoje",
      meta: ["2–3 osoby", "Bez schodów", "Ogród"],
    },
    {
      ...roomsCategoryEn.cards[2],
      id: "pl-first-floor",
      title: "Pokoje na piętrze",
      subtitle: "Pokoje dwu- i trzyosobowe",
      description:
        "Jasne pokoje z dostępem do wspólnego tarasu i widokiem na cytrusowy ogród. Dobry wybór dla osób, które lubią bardziej otwartą przestrzeń.",
      href: "/pl/pokoje-na-chios/pokoje-standardowe/",
      imageAlt: "Pokoje na piętrze na Chios z widokiem na Kambos",
      badge: "Widok z tarasu",
      ctaLabel: "Zobacz pokoje",
      meta: ["2–4 osoby", "Piętro", "Widok"],
    },
    {
      ...roomsCategoryEn.cards[3],
      id: "pl-family-apartments",
      title: "Apartamenty rodzinne",
      subtitle: "Kuchnia i część dzienna",
      description:
        "Przestronne apartamenty o powierzchni około 40–45 m² z kuchnią i częścią dzienną, stworzone dla rodzin, które potrzebują więcej miejsca podczas pobytu na Chios.",
      href: "/pl/apartamenty-na-chios/",
      imageAlt: "Apartamenty rodzinne na Chios z kuchnią w Voulamandis House",
      badge: "Dla rodzin",
      ctaLabel: "Zobacz apartamenty",
      meta: ["Do 4 osób", "40–45 m²", "Kuchnia"],
    },
  ],
  tip: {
    icon: "💡",
    title: "Wskazówka przy rezerwacji",
    textHtml:
      "Przy rezerwacji bezpośredniej możesz skorzystać z <strong>kodu rabatowego</strong> i sprawdzić <strong>najlepszą dostępną ofertę</strong> dla wybranego terminu.",
  },
  wizardIntro: {
    title: "Nie wiesz, który pokój wybrać? 🤔",
    description:
      "Odpowiedz na kilka krótkich pytań, a nasz Room Wizard pomoże dobrać pokój lub apartament do liczby gości i Twoich preferencji.",
  },
  wizard: {
    ...roomsCategoryEn.wizard,
    whatsappPhone: "306944474226",
    rooms: roomsCategoryEn.wizard.rooms.map((room) => ({
      ...room,
      name: `Pokój ${room.id}`,
      type:
        room.type === "Economy double"
          ? "Ekonomiczny pokój dwuosobowy"
          : room.type === "Apartment"
            ? "Apartament rodzinny"
            : room.location === "Ground Floor"
              ? "Pokój dwu-/trzyosobowy na parterze"
              : "Pokój dwu-/trzyosobowy na piętrze",
    })),
  },
};
