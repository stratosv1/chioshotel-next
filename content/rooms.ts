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
      "Explore rooms and apartments in Chios at Voulamandis House in Kampos. Choose economy double rooms, ground floor rooms, first floor rooms or family apartments.",
    ogImage:
      "https://chioshotel.gr/wp-content/uploads/2022/12/chios-hotels-family-apartments.webp",
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
      "Explore our 4 accommodation categories below and choose the best option for your trip. Voulamandis House in Kampos combines traditional character, citrus-garden atmosphere and practical comfort for couples, friends and families.",
  },

  cards: [
    {
      id: "economy-double",
      title: "Economy Double Room",
      subtitle: "Best value for 2 guests",
      description:
        "The best value option for 2 guests. Renovated 16m² rooms with essentials and a peaceful Kampos atmosphere.",
      href: "/chios-rooms/economy-double-rooms/",
      image:
        "https://chioshotel.gr/wp-content/uploads/2022/12/received_1753964631359257.webp",
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
        "https://chioshotel.gr/wp-content/uploads/2022/12/double-triple-room.jpg",
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
        "https://chioshotel.gr/wp-content/uploads/2022/12/DSC07776-2-e1675109942622.webp",
      imageAlt: "First floor double and triple rooms in Chios with view in Kampos",
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
        "https://chioshotel.gr/wp-content/uploads/2022/12/chios-apartments-voulamandis.webp",
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
          "https://chioshotel.gr/wp-content/uploads/2022/12/DSC07776-2-e1675109942622.webp",
          "https://chioshotel.gr/wp-content/uploads/2022/12/DSC07769-1.webp",
          "https://chioshotel.gr/wp-content/uploads/2022/12/%CF%87%CE%B9%CE%BF%CF%82-%CE%B4%CF%89%CE%BC%CE%B1%CF%84%CE%B9%CE%B1-1-1.webp",
          "https://chioshotel.gr/wp-content/uploads/2022/12/voulamandis-house-bathrooms-1.webp",
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
          "https://chioshotel.gr/wp-content/uploads/2022/12/DSC07803-1.webp",
          "https://chioshotel.gr/wp-content/uploads/2022/12/DSC07839.webp",
          "https://chioshotel.gr/wp-content/uploads/2022/12/DSC07832.webp",
          "https://chioshotel.gr/wp-content/uploads/2022/12/received_1385287484893642_1500478431120_1200x800_3240x2160-1.webp",
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
          "https://chioshotel.gr/wp-content/uploads/2022/12/DSC07867-1.webp",
          "https://chioshotel.gr/wp-content/uploads/2022/12/DSC07860-1.webp",
          "https://chioshotel.gr/wp-content/uploads/2022/12/DSC07849-1.webp",
          "https://chioshotel.gr/wp-content/uploads/2022/12/DSC07891-1.webp",
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
          "https://chioshotel.gr/wp-content/uploads/2022/12/received_1748354861920234.webp",
          "https://chioshotel.gr/wp-content/uploads/2022/12/received_1748358935253160.webp",
          "https://chioshotel.gr/wp-content/uploads/2022/12/received_1748356725253381.webp",
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
          "https://chioshotel.gr/wp-content/uploads/2022/12/voulamandis-house-rooms.webp",
          "https://chioshotel.gr/wp-content/uploads/2022/12/chios-hotels-triple-rooms_1646x1080.webp",
          "https://chioshotel.gr/wp-content/uploads/2022/12/voulamandis-house-double-room-bathroom_1620x1080.webp",
          "https://chioshotel.gr/wp-content/uploads/2022/12/hotels-chios-voulamandis_1620x1080.webp",
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
          "https://chioshotel.gr/wp-content/uploads/2022/12/received_1753964631359257.webp",
          "https://chioshotel.gr/wp-content/uploads/2022/12/received_1753964581359262.webp",
          "https://chioshotel.gr/wp-content/uploads/2022/12/received_1753968691358851.webp",
          "https://chioshotel.gr/wp-content/uploads/2022/12/received_1753969201358800.webp",
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
          "https://chioshotel.gr/wp-content/uploads/2022/12/double-triple-room.jpg",
          "https://chioshotel.gr/wp-content/uploads/2022/12/view-double-room-chios-hotels.webp",
          "https://chioshotel.gr/wp-content/uploads/2022/12/double-room-bathroom.webp",
          "https://chioshotel.gr/wp-content/uploads/2022/12/voulamandis-stone-bathroom.webp",
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
          "https://chioshotel.gr/wp-content/uploads/2022/12/chios-apartments-voulamandis.webp",
          "https://chioshotel.gr/wp-content/uploads/2022/12/chios-hotels-family-apartments.webp",
          "https://chioshotel.gr/wp-content/uploads/2022/12/family-room.webp",
          "https://chioshotel.gr/wp-content/uploads/2022/12/voulamandis-apartment-bathroom..webp",
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
          "https://chioshotel.gr/wp-content/uploads/2022/12/chios-apartments-voulamandis.webp",
          "https://chioshotel.gr/wp-content/uploads/2022/12/chios-hotels-family-apartments.webp",
          "https://chioshotel.gr/wp-content/uploads/2022/12/family-room.webp",
          "https://chioshotel.gr/wp-content/uploads/2022/12/voulamandis-apartment-bathroom..webp",
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
          "https://chioshotel.gr/wp-content/uploads/2022/12/DSC07899.webp",
          "https://chioshotel.gr/wp-content/uploads/2022/12/DSC07909.webp",
          "https://chioshotel.gr/wp-content/uploads/2022/12/DSC07940.webp",
          "https://chioshotel.gr/wp-content/uploads/2022/12/DSC07943.webp",
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
      "Εξερευνήστε τις κατηγορίες δωματίων και διαμερισμάτων του Voulamandis House στον Κάμπο της Χίου. Οικονομικά δίκλινα, ισόγεια δωμάτια, δωμάτια ορόφου και οικογενειακά διαμερίσματα.",
    ogImage:
      "https://chioshotel.gr/wp-content/uploads/2022/12/chios-hotels-family-apartments.webp",
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
        "https://chioshotel.gr/wp-content/uploads/2022/12/received_1753964631359257.webp",
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
        "https://chioshotel.gr/wp-content/uploads/2022/12/DSC07776-2-e1675109942622.webp",
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
        "https://chioshotel.gr/wp-content/uploads/2022/12/DSC07803-1.webp",
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
        "https://chioshotel.gr/wp-content/uploads/2022/12/chios-apartments-voulamandis.webp",
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