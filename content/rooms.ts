export type RoomCategoryCard = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  href: string;
  image: string;
  imageAlt: string;
  badge: string;
  ctaLabel: string;
  meta: string[];
};

export type RoomWizardRoom = {
  id: number;
  name: string;
  type: string;
  priceLevel: number;
  location: "First Floor" | "Ground Floor" | "Stand Alone";
  maxGuests: number;
  budget: boolean;
  stairs: boolean;
  upperView: boolean;
  gardenView: boolean;
  kitchenette: boolean;
  fullKitchen: boolean;
  images: string[];
  beds: {
    double: number;
    single: number;
    sofa: number;
  };
};

export type RoomsCategoryPageData = {
  seo: {
    canonicalPath: string;
    title: string;
    description: string;
    ogImage: string;
  };
  hero: {
    kicker: string;
    title: string;
    highlightedTitle: string;
    description: string;
    primaryCta: {
      label: string;
      href: string;
    };
    secondaryCta: {
      label: string;
      href: string;
    };
  };
  intro: {
    title: string;
    description: string;
  };
  cards: RoomCategoryCard[];
  tip: {
    icon: string;
    title: string;
    textHtml: string;
  };
  wizardIntro: {
    title: string;
    description: string;
  };
  wizard: {
    rooms: RoomWizardRoom[];
    whatsappPhone: string;
  };
};

export const roomsCategoryEn: RoomsCategoryPageData = {
  seo: {
    canonicalPath: "/chios-rooms/",
    title: "Rooms in Chios & Apartments in Chios | Voulamandis House",
    description:
      "Explore rooms and apartments in Chios at Voulamandis House in Kambos. Choose economy double rooms, ground floor rooms, first floor rooms or family apartments.",
    ogImage:
      "/images/rooms/chios-hotels-family-apartments.webp",
  },

  hero: {
    kicker: "Voulamandis House Rooms",
    title: "Where to stay",
    highlightedTitle: "in Chios?",
    description:
      "Choose the room category that fits your trip: affordable double rooms, comfortable double and triple rooms, or family apartments with kitchen and extra space.",
    primaryCta: {
      label: "Find my room",
      href: "#room-wizard-app",
    },
    secondaryCta: {
      label: "See all rooms",
      href: "#rooms-list",
    },
  },

  intro: {
    title: "Accommodation options in Chios",
    description:
      "Explore our 4 accommodation categories below and choose the best option for your trip. Voulamandis House in Kambos combines traditional character, citrus-garden atmosphere and practical comfort for couples, friends and families.",
  },

  cards: [
    {
      id: "economy-double",
      title: "Economy Double Room",
      subtitle: "Best value for 2 guests",
      description:
        "The best value option for 2 guests. Renovated 16m² rooms with essentials and a peaceful Kambos atmosphere.",
      href: "/chios-rooms/economy-double-rooms/",
      image:
        "/images/rooms/received_1753964631359257.webp",
      imageAlt: "Economy double room in Chios at Voulamandis House",
      badge: "Best value",
      ctaLabel: "Explore Room",
      meta: ["2 guests", "16m²", "Economy"],
    },
    {
      id: "ground-floor",
      title: "Ground Floor Rooms",
      subtitle: "Double & triple rooms",
      description:
        "Double and triple rooms with direct access to the courtyard and garden. Ideal if you prefer easy access and a calm outdoor vibe.",
      href: "/chios-rooms/standard-double-room/",
      image:
        "/images/rooms/double-triple-room.jpg",
      imageAlt: "Ground floor double and triple rooms in Chios with garden access",
      badge: "Garden access",
      ctaLabel: "View Rooms",
      meta: ["2–3 guests", "No stairs", "Garden"],
    },
    {
      id: "first-floor",
      title: "First Floor Rooms",
      subtitle: "Double & triple rooms",
      description:
        "Bright double and triple rooms with access to a shared terrace and views over the citrus estate. A more premium feel.",
      href: "/chios-rooms/standard-double-room/",
      image:
        "/images/rooms/DSC07776-2-e1675109942622.webp",
      imageAlt: "First floor double and triple rooms in Chios with view in Kambos",
      badge: "Terrace view",
      ctaLabel: "View Rooms",
      meta: ["2–4 guests", "First floor", "View"],
    },
    {
      id: "family-apartments",
      title: "Family Apartments",
      subtitle: "Kitchen & living area",
      description:
        "Spacious 40–45m² apartments with a full kitchen and living area, perfect for families who want home-like comfort.",
      href: "/chios-rooms/family-chios-apartments/",
      image:
        "/images/rooms/chios-apartments-voulamandis.webp",
      imageAlt: "Family apartments in Chios with kitchen at Voulamandis House",
      badge: "Family choice",
      ctaLabel: "View Apartments",
      meta: ["Up to 4 guests", "40–45m²", "Kitchen"],
    },
  ],

  tip: {
    icon: "💡",
    title: "Smart Booking Tip",
    textHtml:
      "Remember: use your <strong>discount code</strong> for direct bookings and secure the <strong>best online price</strong>.",
  },

  wizardIntro: {
    title: "Not sure what to choose? 🤔",
    description:
      "Use our smart Room Wizard to find the best option for your stay in about 30 seconds.",
  },

  wizard: {
    whatsappPhone: "306944474226",
    rooms: [
      {
        id: 1,
        name: "Room 1",
        type: "First Floor Double/Triple room",
        priceLevel: 3,
        location: "First Floor",
        maxGuests: 4,
        budget: false,
        stairs: true,
        upperView: true,
        gardenView: false,
        kitchenette: false,
        fullKitchen: false,
        images: [
          "/images/rooms/DSC07776-2-e1675109942622.webp",
          "/images/rooms/DSC07769-1.webp",
          "/images/rooms/----1-1.webp",
          "/images/rooms/voulamandis-house-bathrooms-1.webp",
        ],
        beds: { double: 2, single: 2, sofa: 0 },
      },
      {
        id: 2,
        name: "Room 2",
        type: "Economy double",
        priceLevel: 1,
        location: "First Floor",
        maxGuests: 2,
        budget: true,
        stairs: true,
        upperView: false,
        gardenView: false,
        kitchenette: false,
        fullKitchen: false,
        images: [
          "/images/rooms/DSC07803-1.webp",
          "/images/rooms/DSC07839.webp",
          "/images/rooms/DSC07832.webp",
          "/images/rooms/received_1385287484893642_1500478431120_1200x800_3240x2160-1.webp",
        ],
        beds: { double: 2, single: 0, sofa: 0 },
      },
      {
        id: 3,
        name: "Room 3",
        type: "First Floor Double/Triple room",
        priceLevel: 3,
        location: "First Floor",
        maxGuests: 3,
        budget: false,
        stairs: true,
        upperView: true,
        gardenView: false,
        kitchenette: true,
        fullKitchen: false,
        images: [
          "/images/rooms/DSC07867-1.webp",
          "/images/rooms/DSC07860-1.webp",
          "/images/rooms/DSC07849-1.webp",
          "/images/rooms/DSC07891-1.webp",
        ],
        beds: { double: 1, single: 1, sofa: 0 },
      },
      {
        id: 4,
        name: "Room 4",
        type: "First Floor Double/Triple room",
        priceLevel: 3,
        location: "First Floor",
        maxGuests: 3,
        budget: false,
        stairs: true,
        upperView: true,
        gardenView: false,
        kitchenette: true,
        fullKitchen: false,
        images: [
          "/images/rooms/received_1748354861920234.webp",
          "/images/rooms/received_1748358935253160.webp",
          "/images/rooms/received_1748356725253381.webp",
        ],
        beds: { double: 1, single: 0, sofa: 1 },
      },
      {
        id: 5,
        name: "Room 5",
        type: "Ground Floor Double/Triple room",
        priceLevel: 2,
        location: "Ground Floor",
        maxGuests: 3,
        budget: false,
        stairs: false,
        upperView: false,
        gardenView: true,
        kitchenette: false,
        fullKitchen: false,
        images: [
          "/images/rooms/voulamandis-house-rooms.webp",
          "/images/rooms/chios-hotels-triple-rooms_1646x1080.webp",
          "/images/rooms/voulamandis-house-double-room-bathroom_1620x1080.webp",
          "/images/rooms/hotels-chios-voulamandis_1620x1080.webp",
        ],
        beds: { double: 1, single: 1, sofa: 0 },
      },
      {
        id: 6,
        name: "Room 6",
        type: "Economy double",
        priceLevel: 1,
        location: "Ground Floor",
        maxGuests: 2,
        budget: true,
        stairs: false,
        upperView: false,
        gardenView: true,
        kitchenette: false,
        fullKitchen: false,
        images: [
          "/images/rooms/received_1753964631359257.webp",
          "/images/rooms/received_1753964581359262.webp",
          "/images/rooms/received_1753968691358851.webp",
          "/images/rooms/received_1753969201358800.webp",
        ],
        beds: { double: 1, single: 0, sofa: 0 },
      },
      {
        id: 7,
        name: "Room 7",
        type: "Ground Floor Double/Triple room",
        priceLevel: 2,
        location: "Ground Floor",
        maxGuests: 3,
        budget: false,
        stairs: false,
        upperView: false,
        gardenView: true,
        kitchenette: false,
        fullKitchen: false,
        images: [
          "/images/rooms/double-triple-room.jpg",
          "/images/rooms/view-double-room-chios-hotels.webp",
          "/images/rooms/double-room-bathroom.webp",
          "/images/rooms/voulamandis-stone-bathroom.webp",
        ],
        beds: { double: 1, single: 0, sofa: 1 },
      },
      {
        id: 8,
        name: "Room 8",
        type: "Apartment",
        priceLevel: 4,
        location: "Stand Alone",
        maxGuests: 4,
        budget: false,
        stairs: false,
        upperView: false,
        gardenView: true,
        kitchenette: false,
        fullKitchen: true,
        images: [
          "/images/rooms/chios-apartments-voulamandis.webp",
          "/images/rooms/chios-hotels-family-apartments.webp",
          "/images/rooms/family-room.webp",
          "/images/rooms/voulamandis-apartment-bathroom..webp",
        ],
        beds: { double: 1, single: 2, sofa: 0 },
      },
      {
        id: 9,
        name: "Room 9",
        type: "Apartment",
        priceLevel: 4,
        location: "Stand Alone",
        maxGuests: 4,
        budget: false,
        stairs: false,
        upperView: false,
        gardenView: true,
        kitchenette: false,
        fullKitchen: true,
        images: [
          "/images/rooms/chios-apartments-voulamandis.webp",
          "/images/rooms/chios-hotels-family-apartments.webp",
          "/images/rooms/family-room.webp",
          "/images/rooms/voulamandis-apartment-bathroom..webp",
        ],
        beds: { double: 1, single: 2, sofa: 0 },
      },
      {
        id: 10,
        name: "Room 10",
        type: "Apartment",
        priceLevel: 4,
        location: "Stand Alone",
        maxGuests: 4,
        budget: false,
        stairs: false,
        upperView: false,
        gardenView: true,
        kitchenette: false,
        fullKitchen: true,
        images: [
          "/images/rooms/DSC07899.webp",
          "/images/rooms/DSC07909.webp",
          "/images/rooms/DSC07940.webp",
          "/images/rooms/DSC07943.webp",
        ],
        beds: { double: 1, single: 0, sofa: 2 },
      },
    ],
  },
};

export const roomsCategoryEl: RoomsCategoryPageData = {
  ...roomsCategoryEn,

  seo: {
    canonicalPath: "/el/domatia-xios/",
    title: "Δωμάτια στη Χίο & Διαμερίσματα | Voulamandis House",
    description:
      "Δείτε δωμάτια και διαμερίσματα στο Voulamandis House στον Κάμπο Χίου: οικονομικά δίκλινα, ισόγεια δωμάτια και οικογενειακά διαμερίσματα.",
    ogImage:
      "/images/rooms/chios-hotels-family-apartments.webp",
  },

  hero: {
    kicker: "Δωμάτια Voulamandis House",
    title: "Πού να μείνω",
    highlightedTitle: "στη Χίο;",
    description:
      "Επιλέξτε την κατηγορία δωματίου που ταιριάζει στο ταξίδι σας: οικονομικά δίκλινα, άνετα δίκλινα και τρίκλινα δωμάτια ή οικογενειακά διαμερίσματα με κουζίνα και περισσότερο χώρο.",
    primaryCta: {
      label: "Βρες δωμάτιο",
      href: "#room-wizard-app",
    },
    secondaryCta: {
      label: "Δες όλα τα δωμάτια",
      href: "#rooms-list",
    },
  },

  intro: {
    title: "Επιλογές διαμονής στη Χίο",
    description:
      "Εξερευνήστε τις 4 κατηγορίες δωματίων μας παρακάτω. Κάθε δωμάτιο είναι σχεδιασμένο για να προσφέρει την αυθεντική φιλοξενία του Κάμπου της Χίου, με άνεση για ζευγάρια, φίλους και οικογένειες.",
  },

  cards: [
    {
      ...roomsCategoryEn.cards[0],
      title: "Οικονομικό Δίκλινο",
      subtitle: "Value επιλογή για 2 άτομα",
      description:
        "Η πιο value επιλογή για 2 άτομα. Ανακαινισμένα δωμάτια 16m² με σύγχρονες παροχές και αυθεντική αίσθηση Κάμπου.",
      href: "/el/domatia-xios/oikonomiko-diklino-domatio/",
      image:
        "/images/rooms/received_1753964631359257.webp",
      imageAlt: "Οικονομικό δίκλινο δωμάτιο στη Χίο στο Voulamandis House",
      badge: "Value επιλογή",
      ctaLabel: "Εξερεύνηση Δωματίου",
      meta: ["2 άτομα", "16m²", "Economy"],
    },
    {
      ...roomsCategoryEn.cards[1],
      title: "Ισόγεια Δωμάτια",
      subtitle: "Δίκλινα & τρίκλινα δωμάτια",
      description:
        "Δίκλινα και τρίκλινα δωμάτια με άμεση πρόσβαση στον κήπο. Ιδανικά για όσους αναζητούν δροσιά και την ηρεμία της φύσης.",
      href: "/el/domatia-xios/diklina-triklina-domatia/",
      image:
        "/images/rooms/double-triple-room.jpg",
      imageAlt: "Ισόγεια δίκλινα και τρίκλινα δωμάτια στη Χίο",
      badge: "Πρόσβαση στον κήπο",
      ctaLabel: "Δείτε τα Δωμάτια",
      meta: ["2–3 άτομα", "Ισόγειο", "Κήπος"],
    },
    {
      ...roomsCategoryEn.cards[2],
      title: "Δωμάτια Ορόφου",
      subtitle: "Δίκλινα & τρίκλινα δωμάτια",
      description:
        "Απολαύστε την πανοραμική θέα στο κτήμα και τα εσπεριδοειδή από τη βεράντα σας. Φωτεινά δωμάτια με premium αίσθηση.",
      href: "/el/domatia-xios/diklina-triklina-domatia/",
      image:
        "/images/rooms/DSC07776-2-e1675109942622.webp",
      imageAlt: "Δωμάτια ορόφου στη Χίο με θέα στον Κάμπο",
      badge: "Θέα από όροφο",
      ctaLabel: "Δείτε τα Δωμάτια",
      meta: ["2–3 άτομα", "Όροφος", "Θέα"],
    },
    {
      ...roomsCategoryEn.cards[3],
      title: "Οικογενειακά Διαμερίσματα",
      subtitle: "Κουζίνα & καθιστικό",
      description:
        "Ευρύχωρα διαμερίσματα 40–45m² με πλήρη κουζίνα και καθιστικό. Η απόλυτη επιλογή για οικογένειες που αναζητούν την άνεση του σπιτιού τους.",
      href: "/el/domatia-xios/oikogeneiako-diamerisma/",
      image:
        "/images/rooms/chios-apartments-voulamandis.webp",
      imageAlt: "Οικογενειακά διαμερίσματα στη Χίο στο Voulamandis House",
      badge: "Για οικογένειες",
      ctaLabel: "Δείτε τα Διαμερίσματα",
      meta: ["Έως 4 άτομα", "40–45m²", "Κουζίνα"],
    },
  ],

  tip: {
    icon: "💡",
    title: "Smart Booking Tip",
    textHtml:
      "Θυμηθείτε! Μπορείτε να χρησιμοποιήσετε τον <strong>κωδικό έκπτωσης</strong> για την απευθείας κράτησή σας και να εξασφαλίσετε την <strong>καλύτερη τιμή</strong> online.",
  },

  wizardIntro: {
    title: "Δεν είστε σίγουροι ποιο να επιλέξετε; 🤔",
    description:
      "Αφήστε τον έξυπνο βοηθό μας να βρει το ιδανικό δωμάτιο για εσάς σε περίπου 30 δευτερόλεπτα.",
  },

  wizard: {
    ...roomsCategoryEn.wizard,
    whatsappPhone: "306944474226",
  },
};
export const roomsCategoryFr: RoomsCategoryPageData = {
  ...roomsCategoryEn,

  seo: {
    canonicalPath: "/fr/chambres-a-chios/",
    title: "Chambres et appartements à Chios | Voulamandis House",
    description:
      "Découvrez les chambres et appartements du Voulamandis House à Kambos, Chios : doubles économiques, chambres avec jardin et appartements familiaux.",
    ogImage:
      "/images/rooms/chios-hotels-family-apartments.webp",
  },

  hero: {
    kicker: "Chambres Voulamandis House",
    title: "Où loger",
    highlightedTitle: "à Chios ?",
    description:
      "Choisissez l’hébergement qui correspond à votre séjour : chambres doubles économiques, chambres doubles ou triples confortables, ou appartements familiaux avec cuisine et plus d’espace.",
    primaryCta: {
      label: "Trouver ma chambre",
      href: "#room-wizard-app",
    },
    secondaryCta: {
      label: "Voir toutes les chambres",
      href: "#rooms-list",
    },
  },

  intro: {
    title: "Options d’hébergement à Chios",
    description:
      "Découvrez nos 4 catégories d’hébergement et choisissez l’option la plus adaptée à votre voyage. Voulamandis House, à Kambos, combine caractère traditionnel, atmosphère de jardin d’agrumes et confort pratique pour couples, amis et familles.",
  },

  cards: [
    {
      ...roomsCategoryEn.cards[0],
      title: "Chambre double économique",
      subtitle: "Meilleur rapport qualité-prix pour 2 personnes",
      description:
        "Le meilleur choix value pour 2 personnes. Chambres rénovées de 16m² avec les essentiels et une atmosphère paisible à Kambos.",
      href: "/fr/chambres-a-chios/chambres-doubles-economiques/",
      image:
        "/images/rooms/received_1753964631359257.webp",
      imageAlt:
        "Chambre double économique à Chios au Voulamandis House",
      badge: "Meilleur prix",
      ctaLabel: "Découvrir la chambre",
      meta: ["2 personnes", "16m²", "Économique"],
    },
    {
      ...roomsCategoryEn.cards[1],
      title: "Chambres au rez-de-chaussée",
      subtitle: "Chambres doubles et triples",
      description:
        "Chambres doubles et triples avec accès direct à la cour et au jardin. Idéal pour un accès facile et une ambiance calme en plein air.",
      href: "/fr/chambres-a-chios/chambres-doubles-standard/",
      image:
        "/images/rooms/double-triple-room.jpg",
      imageAlt:
        "Chambres doubles et triples au rez-de-chaussée à Chios avec accès au jardin",
      badge: "Accès jardin",
      ctaLabel: "Voir les chambres",
      meta: ["2–3 personnes", "Rez-de-chaussée", "Jardin"],
    },
    {
      ...roomsCategoryEn.cards[2],
      title: "Chambres à l’étage",
      subtitle: "Chambres doubles et triples",
      description:
        "Chambres lumineuses avec accès à une terrasse commune et vue sur le domaine d’agrumes. Une option plus premium et plus ouverte.",
      href: "/fr/chambres-a-chios/chambres-doubles-standard/",
      image:
        "/images/rooms/DSC07776-2-e1675109942622.webp",
      imageAlt:
        "Chambres à l’étage à Chios avec vue sur Kambos",
      badge: "Vue terrasse",
      ctaLabel: "Voir les chambres",
      meta: ["2–3 personnes", "Étage", "Vue"],
    },
    {
      ...roomsCategoryEn.cards[3],
      title: "Appartements familiaux",
      subtitle: "Cuisine et espace salon",
      description:
        "Appartements spacieux de 40–45m² avec cuisine complète et coin salon. Parfaits pour les familles qui souhaitent plus d’espace et le confort d’un chez-soi.",
      href: "/fr/chambres-a-chios/appartements-familiaux-de-chios/",
      image:
        "/images/rooms/chios-apartments-voulamandis.webp",
      imageAlt:
        "Appartements familiaux à Chios avec cuisine au Voulamandis House",
      badge: "Choix famille",
      ctaLabel: "Voir les appartements",
      meta: ["Jusqu’à 4 personnes", "40–45m²", "Cuisine"],
    },
  ],

  tip: {
    icon: "💡",
    title: "Conseil pour votre réservation",
    textHtml:
      "Utilisez votre <strong>code de réduction</strong> lors de votre réservation directe pour bénéficier du <strong>meilleur prix en ligne</strong>.",
  },

  wizardIntro: {
    title: "Un doute sur votre choix ? 🤔",
    description:
      "Utilisez notre assistant intelligent pour trouver l’hébergement idéal pour votre séjour en environ 30 secondes.",
  },

  wizard: {
    ...roomsCategoryEn.wizard,
    whatsappPhone: "306944474226",
    rooms: roomsCategoryEn.wizard.rooms.map((room) => ({
      ...room,
      type:
        room.type === "Economy double"
          ? "Chambre double économique"
          : room.type === "Apartment"
            ? "Appartement familial"
            : room.location === "Ground Floor"
              ? "Chambre double/triple au rez-de-chaussée"
              : "Chambre double/triple à l’étage",
    })),
  },
};

export const roomsCategoryDe: RoomsCategoryPageData = {
  ...roomsCategoryEn,

  seo: {
    canonicalPath: "/de/chios-zimmer/",
    title: "Zimmer und Apartments auf Chios | Voulamandis House",
    description:
      "Entdecken Sie Zimmer und Apartments im Voulamandis House in Kambos, Chios. Economy Zimmer, Doppel- und Dreibettzimmer sowie Familienapartments mit Küche.",
    ogImage:
      "/images/rooms/chios-hotels-family-apartments.webp",
  },

  hero: {
    kicker: "Voulamandis House Zimmer",
    title: "Wo übernachten",
    highlightedTitle: "auf Chios?",
    description:
      "Wählen Sie die Unterkunft, die zu Ihrer Reise passt: günstige Doppelzimmer, komfortable Doppel- und Dreibettzimmer oder Familienapartments mit Küche und mehr Platz.",
    primaryCta: {
      label: "Zimmer finden",
      href: "#room-wizard-app",
    },
    secondaryCta: {
      label: "Alle Zimmer ansehen",
      href: "#rooms-list",
    },
  },

  intro: {
    title: "Unterkunftsmöglichkeiten auf Chios",
    description:
      "Entdecken Sie unsere 4 Unterkunftskategorien im historischen Kambos von Chios. Vom preiswerten Economy Zimmer über komfortable Doppel- und Dreibettzimmer bis zu großzügigen Familienapartments mit Küche.",
  },

  cards: [
    {
      ...roomsCategoryEn.cards[0],
      title: "Economy Zimmer",
      subtitle: "Preiswerte Option für 2 Gäste",
      description:
        "Unsere preiswerteste Unterkunft für 2 Gäste. Renovierte Zimmer mit ca. 16m² und allen wichtigen Annehmlichkeiten für einen angenehmen Aufenthalt im ruhigen Kambos von Chios.",
      href: "/de/zimmer-chios/economy-zimmer-auf-chios/",
      image:
        "/images/rooms/received_1753964631359257.webp",
      imageAlt:
        "Economy Zimmer auf Chios im Voulamandis House",
      badge: "Preiswert",
      ctaLabel: "Zimmer ansehen",
      meta: ["2 Gäste", "16m²", "Economy"],
    },
    {
      ...roomsCategoryEn.cards[1],
      title: "Zimmer im Erdgeschoss",
      subtitle: "Doppel- und Dreibettzimmer",
      description:
        "Zimmer mit direktem Zugang zum Innenhof und zum Garten. Ideal für Gäste, die eine ruhige Atmosphäre und einfachen Zugang ohne Treppen bevorzugen.",
      href: "/de/zimmer-chios/standard-doppelzimmer-auf-chios/",
      image:
        "/images/rooms/double-triple-room.jpg",
      imageAlt:
        "Doppel- und Dreibettzimmer im Erdgeschoss auf Chios mit Gartenzugang",
      badge: "Gartenzugang",
      ctaLabel: "Zimmer entdecken",
      meta: ["2–3 Gäste", "Erdgeschoss", "Garten"],
    },
    {
      ...roomsCategoryEn.cards[2],
      title: "Zimmer im Obergeschoss",
      subtitle: "Doppel- und Dreibettzimmer",
      description:
        "Helle Zimmer mit Zugang zu einer gemeinsamen Terrasse und Blick auf die historischen Zitrusgärten von Kambos. Eine etwas hochwertigere Unterkunft mit mehr Aussicht.",
      href: "/de/zimmer-chios/standard-doppelzimmer-auf-chios/",
      image:
        "/images/rooms/DSC07776-2-e1675109942622.webp",
      imageAlt:
        "Doppel- und Dreibettzimmer im Obergeschoss mit Blick auf Kambos",
      badge: "Terrassenblick",
      ctaLabel: "Zimmer entdecken",
      meta: ["2–3 Gäste", "Obergeschoss", "Blick"],
    },
    {
      ...roomsCategoryEn.cards[3],
      title: "Familienapartments",
      subtitle: "Küche und Wohnbereich",
      description:
        "Geräumige Apartments mit 40–45m², voll ausgestatteter Küche und separatem Wohnbereich. Perfekt für Familien oder Gäste, die mehr Platz und Unabhängigkeit wünschen.",
      href: "/de/zimmer-chios/familienapartments-in-chios/",
      image:
        "/images/rooms/chios-apartments-voulamandis.webp",
      imageAlt:
        "Familienapartments auf Chios mit Küche im Voulamandis House",
      badge: "Für Familien",
      ctaLabel: "Apartments ansehen",
      meta: ["Bis 4 Gäste", "40–45m²", "Küche"],
    },
  ],

  tip: {
    icon: "💡",
    title: "Buchungstipp",
    textHtml:
      "Buchen Sie direkt über unsere Website und verwenden Sie Ihren <strong>Rabattcode</strong>, um den <strong>besten Onlinepreis</strong> zu sichern.",
  },

  wizardIntro: {
    title: "Unsicher, welches Zimmer am besten passt? 🤔",
    description:
      "Nutzen Sie unseren smarten Zimmer-Finder und finden Sie in weniger als 30 Sekunden die ideale Unterkunft für Ihren Aufenthalt auf Chios.",
  },

  wizard: {
    ...roomsCategoryEn.wizard,
    whatsappPhone: "306944474226",
    rooms: roomsCategoryEn.wizard.rooms.map((room) => ({
      ...room,
      type:
        room.type === "Economy double"
          ? "Economy Doppelzimmer"
          : room.type === "Apartment"
            ? "Familienapartment"
            : room.location === "Ground Floor"
              ? "Doppel-/Dreibettzimmer im Erdgeschoss"
              : "Doppel-/Dreibettzimmer im Obergeschoss",
    })),
  },
};

export const roomsCategoryIt: RoomsCategoryPageData = {
  ...roomsCategoryEn,

  seo: {
    canonicalPath: "/it/camere-a-chios/",
    title: "Camere e appartamenti a Chios | Voulamandis House",
    description:
      "Scopri camere e appartamenti a Chios presso Voulamandis House a Kambos: doppie economy, camere al piano terra e appartamenti familiari.",
    ogImage:
      "/images/rooms/chios-hotels-family-apartments.webp",
  },

  hero: {
    kicker: "Camere Voulamandis House",
    title: "Dove soggiornare",
    highlightedTitle: "a Chios?",
    description:
      "Scegli la categoria più adatta al tuo viaggio: camere doppie economy, camere doppie e triple confortevoli, oppure appartamenti familiari con cucina e più spazio.",
    primaryCta: {
      label: "Trova la camera",
      href: "#room-wizard-app",
    },
    secondaryCta: {
      label: "Vedi tutte le camere",
      href: "#rooms-list",
    },
  },

  intro: {
    title: "Soluzioni di alloggio a Chios",
    description:
      "Scopri le nostre 4 categorie di alloggio a Chios e scegli l’opzione perfetta per la tua vacanza. Voulamandis House a Kambos unisce fascino tradizionale, atmosfera rilassante e comfort moderno.",
  },

  cards: [
    {
      ...roomsCategoryEn.cards[0],
      title: "Camera doppia economy",
      subtitle: "Miglior rapporto qualità-prezzo per 2 ospiti",
      description:
        "La scelta con il miglior rapporto qualità-prezzo per 2 ospiti. Camere rinnovate di 16m² con servizi essenziali e la tranquilla atmosfera di Kambos.",
      href: "/it/stanze-a-chios/camera-doppia-economica-chios/",
      image:
        "/images/rooms/received_1753964631359257.webp",
      imageAlt:
        "Camera doppia economy a Chios al Voulamandis House",
      badge: "Miglior valore",
      ctaLabel: "Scopri la camera",
      meta: ["2 ospiti", "16m²", "Economy"],
    },
    {
      ...roomsCategoryEn.cards[1],
      title: "Camere al piano terra",
      subtitle: "Camere doppie e triple",
      description:
        "Camere doppie e triple con accesso diretto al cortile e al giardino. Ideali se desideri comodità, accesso facile e un’atmosfera esterna rilassante.",
      href: "/it/stanze-a-chios/camere-doppie-standard-chios/",
      image:
        "/images/rooms/double-triple-room.jpg",
      imageAlt:
        "Camere doppie e triple al piano terra a Chios con accesso al giardino",
      badge: "Accesso giardino",
      ctaLabel: "Vedi le camere",
      meta: ["2–3 ospiti", "Piano terra", "Giardino"],
    },
    {
      ...roomsCategoryEn.cards[2],
      title: "Camere al primo piano",
      subtitle: "Camere doppie e triple",
      description:
        "Luminose camere doppie e triple con accesso a una terrazza condivisa e vista sulla tenuta agrumicola. Una soluzione più raffinata e suggestiva.",
      href: "/it/stanze-a-chios/camere-doppie-standard-chios/",
      image:
        "/images/rooms/DSC07776-2-e1675109942622.webp",
      imageAlt:
        "Camere doppie e triple al primo piano a Chios con vista su Kambos",
      badge: "Vista terrazza",
      ctaLabel: "Vedi le camere",
      meta: ["2–3 ospiti", "Primo piano", "Vista"],
    },
    {
      ...roomsCategoryEn.cards[3],
      title: "Appartamenti familiari",
      subtitle: "Cucina e zona giorno",
      description:
        "Ampi appartamenti di 40–45m² con cucina completa e zona giorno, perfetti per famiglie e ospiti che desiderano il comfort di casa durante il soggiorno a Chios.",
      href: "/it/stanze-a-chios/appartamenti-familiari-a-chios/",
      image:
        "/images/rooms/chios-apartments-voulamandis.webp",
      imageAlt:
        "Appartamenti familiari a Chios con cucina al Voulamandis House",
      badge: "Per famiglie",
      ctaLabel: "Vedi gli appartamenti",
      meta: ["Fino a 4 ospiti", "40–45m²", "Cucina"],
    },
  ],

  tip: {
    icon: "💡",
    title: "Consiglio per la prenotazione",
    textHtml:
      "Ricorda di usare il tuo <strong>codice sconto</strong> per le prenotazioni dirette e ottenere il <strong>miglior prezzo online</strong>.",
  },

  wizardIntro: {
    title: "Non sai quale scegliere? 🤔",
    description:
      "Usa il nostro Room Wizard intelligente e trova la soluzione migliore per il tuo soggiorno in circa 30 secondi.",
  },

  wizard: {
    ...roomsCategoryEn.wizard,
    whatsappPhone: "306944474226",
    rooms: roomsCategoryEn.wizard.rooms.map((room) => ({
      ...room,
      type:
        room.type === "Economy double"
          ? "Camera doppia economy"
          : room.type === "Apartment"
            ? "Appartamento familiare"
            : room.location === "Ground Floor"
              ? "Camera doppia/tripla al piano terra"
              : "Camera doppia/tripla al primo piano",
    })),
  },
};
export const roomsCategoryEs: RoomsCategoryPageData = {
  ...roomsCategoryEn,

  seo: {
    canonicalPath: "/es/habitaciones-en-chios/",
    title: "Habitaciones y apartamentos en Chios | Voulamandis House",
    description:
      "Explora habitaciones y apartamentos de Voulamandis House en Kambos, Chios: dobles económicas, planta baja y apartamentos familiares.",
    ogImage:
      "/images/rooms/chios-hotels-family-apartments.webp",
  },

  hero: {
    kicker: "Habitaciones Voulamandis House",
    title: "Dónde alojarse",
    highlightedTitle: "en Chios?",
    description:
      "Elige la categoría que mejor encaja con tu viaje: habitaciones dobles económicas, habitaciones dobles y triples cómodas, o apartamentos familiares con cocina y más espacio.",
    primaryCta: {
      label: "Encontrar habitación",
      href: "#room-wizard-app",
    },
    secondaryCta: {
      label: "Ver todas las habitaciones",
      href: "#rooms-list",
    },
  },

  intro: {
    title: "Opciones de alojamiento en Chios",
    description:
      "Explora nuestras 4 categorías de alojamiento y elige la mejor opción para tu viaje. Voulamandis House en Kambos combina encanto tradicional, ambiente tranquilo y confort moderno para parejas, amigos y familias.",
  },

  cards: [
    {
      ...roomsCategoryEn.cards[0],
      title: "Habitación doble económica",
      subtitle: "Mejor relación calidad-precio para 2 huéspedes",
      description:
        "La mejor opción calidad-precio para 2 huéspedes. Habitaciones renovadas de 16m² con lo esencial y un ambiente tranquilo en Kambos.",
      href: "/es/habitaciones-en-chios/economicas-habitaciones-en-chios/",
      image:
        "/images/rooms/received_1753964631359257.webp",
      imageAlt:
        "Habitación doble económica en Chios en Voulamandis House",
      badge: "Mejor valor",
      ctaLabel: "Ver habitación",
      meta: ["2 huéspedes", "16m²", "Económica"],
    },
    {
      ...roomsCategoryEn.cards[1],
      title: "Habitaciones en planta baja",
      subtitle: "Habitaciones dobles y triples",
      description:
        "Habitaciones dobles y triples con acceso directo al patio y al jardín. Ideales si prefieres un acceso fácil y un ambiente exterior tranquilo.",
      href: "/es/habitaciones-en-chios/habitaciones-dobles-estandar/",
      image:
        "/images/rooms/double-triple-room.jpg",
      imageAlt:
        "Habitaciones dobles y triples en planta baja en Chios con acceso al jardín",
      badge: "Acceso al jardín",
      ctaLabel: "Ver habitaciones",
      meta: ["2–3 huéspedes", "Planta baja", "Jardín"],
    },
    {
      ...roomsCategoryEn.cards[2],
      title: "Habitaciones en primera planta",
      subtitle: "Habitaciones dobles y triples",
      description:
        "Habitaciones dobles y triples luminosas con acceso a una terraza compartida y vistas sobre la finca de cítricos. Una opción con un toque más premium.",
      href: "/es/habitaciones-en-chios/habitaciones-dobles-estandar/",
      image:
        "/images/rooms/DSC07776-2-e1675109942622.webp",
      imageAlt:
        "Habitaciones dobles y triples en primera planta en Chios con vistas en Kambos",
      badge: "Vista terraza",
      ctaLabel: "Ver habitaciones",
      meta: ["2–3 huéspedes", "Primera planta", "Vista"],
    },
    {
      ...roomsCategoryEn.cards[3],
      title: "Apartamentos familiares",
      subtitle: "Cocina y sala de estar",
      description:
        "Amplios apartamentos de 40–45m² con cocina completa y sala de estar, perfectos para familias que buscan la comodidad de sentirse como en casa.",
      href: "/es/habitaciones-en-chios/apartamentos-familiares-en-chios/",
      image:
        "/images/rooms/chios-apartments-voulamandis.webp",
      imageAlt:
        "Apartamentos familiares en Chios con cocina en Voulamandis House",
      badge: "Para familias",
      ctaLabel: "Ver apartamentos",
      meta: ["Hasta 4 huéspedes", "40–45m²", "Cocina"],
    },
  ],

  tip: {
    icon: "💡",
    title: "Consejo inteligente para reservar",
    textHtml:
      "Recuerda: utiliza tu <strong>código de descuento</strong> en las reservas directas y consigue el <strong>mejor precio online</strong>.",
  },

  wizardIntro: {
    title: "¿No sabes qué elegir? 🤔",
    description:
      "Usa nuestro asistente inteligente de habitaciones y encuentra la mejor opción para tu estancia en unos 30 segundos.",
  },

  wizard: {
    ...roomsCategoryEn.wizard,
    whatsappPhone: "306944474226",
    rooms: roomsCategoryEn.wizard.rooms.map((room) => ({
      ...room,
      type:
        room.type === "Economy double"
          ? "Habitación doble económica"
          : room.type === "Apartment"
            ? "Apartamento familiar"
            : room.location === "Ground Floor"
              ? "Habitación doble/triple en planta baja"
              : "Habitación doble/triple en primera planta",
    })),
  },
};
export const roomsCategoryTr: RoomsCategoryPageData = {
  ...roomsCategoryEn,

  seo: {
    canonicalPath: "/tr/sakiz-adasi-odalari/",
    title: "Sakız Adası odaları ve daireleri | Voulamandis House",
    description:
      "Kambos, Sakız Adası’ndaki Voulamandis House oda ve dairelerini keşfedin: ekonomik çift kişilik odalar, zemin kat odaları ve aile daireleri.",
    ogImage:
      "/images/rooms/chios-hotels-family-apartments.webp",
  },

  hero: {
    kicker: "Voulamandis House Odaları",
    title: "Sakız Adası’nda",
    highlightedTitle: "nerede kalınır?",
    description:
      "Seyahatinize en uygun konaklama kategorisini seçin: ekonomik çift kişilik odalar, konforlu çift ve üç kişilik odalar veya mutfaklı ve daha geniş aile daireleri.",
    primaryCta: {
      label: "Odamı bul",
      href: "#room-wizard-app",
    },
    secondaryCta: {
      label: "Tüm odaları gör",
      href: "#rooms-list",
    },
  },

  intro: {
    title: "Sakız Adası konaklama seçenekleri",
    description:
      "Aşağıdaki 4 konaklama kategorimizi keşfedin ve seyahatiniz için en uygun seçeneği belirleyin. Kambos’taki Voulamandis House, geleneksel karakteri, narenciye bahçesi atmosferini ve modern konforu bir araya getirir.",
  },

  cards: [
    {
      ...roomsCategoryEn.cards[0],
      title: "Ekonomik çift kişilik oda",
      subtitle: "2 misafir için en avantajlı seçenek",
      description:
        "2 misafir için en iyi fiyat-performans seçeneği. Temel ihtiyaçlara sahip, yenilenmiş 16m² odalar ve huzurlu bir Kambos atmosferi.",
      href: "/tr/chios-odalari/sakiz-adasindaki-ekonomi-cift-kisilik-oda/",
      image:
        "/images/rooms/received_1753964631359257.webp",
      imageAlt:
        "Sakız Adası’nda Voulamandis House ekonomik çift kişilik oda",
      badge: "En avantajlı",
      ctaLabel: "Odayı keşfet",
      meta: ["2 misafir", "16m²", "Ekonomik"],
    },
    {
      ...roomsCategoryEn.cards[1],
      title: "Zemin kat odaları",
      subtitle: "Çift ve üç kişilik odalar",
      description:
        "Avluya ve bahçeye doğrudan erişimi olan çift ve üç kişilik odalar. Kolay erişim ve sakin bir açık hava atmosferi tercih edenler için ideal.",
      href: "/tr/chios-odalari/standart-cift-kisilik-odalar/",
      image:
        "/images/rooms/double-triple-room.jpg",
      imageAlt:
        "Sakız Adası’nda bahçeye erişimli zemin kat çift ve üç kişilik odalar",
      badge: "Bahçe erişimi",
      ctaLabel: "Odaları gör",
      meta: ["2–3 misafir", "Zemin kat", "Bahçe"],
    },
    {
      ...roomsCategoryEn.cards[2],
      title: "Üst kat odaları",
      subtitle: "Çift ve üç kişilik odalar",
      description:
        "Ortak terasa erişimi olan ve narenciye bahçesine bakan aydınlık çift ve üç kişilik odalar. Daha ayrıcalıklı bir konaklama hissi sunar.",
      href: "/tr/chios-odalari/standart-cift-kisilik-odalar/",
      image:
        "/images/rooms/DSC07776-2-e1675109942622.webp",
      imageAlt:
        "Sakız Adası’nda Kambos manzaralı üst kat çift ve üç kişilik odalar",
      badge: "Teras manzarası",
      ctaLabel: "Odaları gör",
      meta: ["2–3 misafir", "Üst kat", "Manzara"],
    },
    {
      ...roomsCategoryEn.cards[3],
      title: "Aile daireleri",
      subtitle: "Mutfak ve oturma alanı",
      description:
        "Tam donanımlı mutfak ve oturma alanına sahip geniş 40–45m² daireler. Ev rahatlığı isteyen aileler ve küçük gruplar için mükemmel.",
      href: "/tr/chios-odalari/sakiz-adasinda-buyuk-aile-daireleri/",
      image:
        "/images/rooms/chios-apartments-voulamandis.webp",
      imageAlt:
        "Sakız Adası’nda mutfaklı aile daireleri Voulamandis House",
      badge: "Aileler için",
      ctaLabel: "Daireleri gör",
      meta: ["4 misafire kadar", "40–45m²", "Mutfak"],
    },
  ],

  tip: {
    icon: "💡",
    title: "Akıllı rezervasyon ipucu",
    textHtml:
      "Unutmayın: doğrudan rezervasyonlarda <strong>indirim kodunuzu</strong> kullanın ve <strong>en iyi online fiyatı</strong> güvenceye alın.",
  },

  wizardIntro: {
    title: "Hangi odayı seçeceğinizden emin değil misiniz? 🤔",
    description:
      "Yaklaşık 30 saniyede konaklamanız için en uygun seçeneği bulmak için akıllı Oda Sihirbazımızı kullanın.",
  },

  wizard: {
    ...roomsCategoryEn.wizard,
  },
};

