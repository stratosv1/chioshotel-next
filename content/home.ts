export type HomePageData = {
  seo: {
    title: string;
    description: string;
    canonicalPath: string;
    ogImage: string;
    ogImageAlt: string;
  };
  hero: {
    rating: string;
    reviews: string;
    kicker: string;
    title: string;
    descriptionHtml: string;
    image: string;
    imageAlt: string;
    primaryCta: {
      label: string;
      href: string;
      icon: string;
    };
    secondaryCta: {
      label: string;
      href: string;
      icon: string;
    };
    quizCard: {
      href: string;
      icon: string;
      liveLabel: string;
      title: string;
      text: string;
      cta: string;
    };
  };
  announceBar: {
    href: string;
    icon: string;
    text: string;
    strongText: string;
  };
  intro: {
    left: {
      kicker: string;
      title: string;
      icon: string;
      bodyHtml: string;
      pills: string[];
    };
    right: {
      kicker: string;
      title: string;
      cards: {
        title: string;
        text: string;
      }[];
    };
  };
  location: {
    kicker: string;
    title: string;
    icon: string;
    subtitle: string;
    map: {
      previewImage: string;
      iframeSrc: string;
      buttonLabel: string;
    };
    distances: {
      label: string;
      value: string;
    }[];
    infoCard: {
      kicker: string;
      title: string;
      addressLines: string[];
      phoneLabel: string;
      phone: string;
      phoneHref: string;
      emailLabel: string;
      email: string;
      emailHref: string;
      text: string;
      cta: {
        label: string;
        href: string;
        icon: string;
      };
    };
    discount: {
      badge: string;
      title: string;
      text: string;
      benefits: string[];
      formIntro: string;
      emailPlaceholder: string;
      submitLabel: string;
      consent: string;
      successText: string;
      defaultCode: string;
    };
    copy: {
      kicker: string;
      title: string;
      paragraphsHtml: string[];
    };
  };
  roomsPreview: {
    kicker: string;
    title: string;
    icon: string;
    text: string;
    primaryCta: {
      label: string;
      href: string;
      icon: string;
    };
    secondaryCta: {
      label: string;
      href: string;
      icon: string;
    };
    sideCard: {
      kicker: string;
      title: string;
      text: string;
    };
    rooms: {
      id: string;
      title: string;
      href: string;
      imageClass: string;
      liveBadge: string;
      directBadge: string;
      bedBadge: string;
      description: string;
      meta: string[];
      amenities: string[];
      cta: string;
    }[];
  };
  lastMinute: {
    kicker: string;
    title: string;
    icon: string;
    subtitle: string;
    widget: {
      title: string;
      subtitle: string;
      trustLine: string;
      timerLabel: string;
      guestTitle: string;
      guestText: string;
      guestButtons: {
        label: string;
        value: number;
      }[];
      helper: string;
      loadingText: string;
      resultsTitle: string;
      resultsText: string;
      emptyText: string;
    };
  };
  reviews: {
    kicker: string;
    title: string;
    icon: string;
    trustindexLoaderUrl: string;
  };
  amenities: {
    kicker: string;
    title: string;
    icon: string;
    items: {
      icon: string;
      label: string;
    }[];
  };
  traveler: {
    kicker: string;
    title: string;
    icon: string;
    subtitle: string;
    cards: {
      id: string;
      title: string;
      text: string;
      href: string;
      className: string;
      cta: string;
    }[];
  };
  chiosGuide: {
    kicker: string;
    title: string;
    icon: string;
    subtitle: string;
    cards: {
      id: string;
      title: string;
      text: string;
      href: string;
      imageClass: string;
      ctaIcon: string;
      ctaLabel: string;
    }[];
  };
  quizBar: {
    label: string;
    text: string;
    href: string;
    cta: string;
  };
  faq: {
    kicker: string;
    title: string;
    icon: string;
    items: {
      question: string;
      answerHtml: string;
    }[];
  };
  finalCta: {
    kicker: string;
    title: string;
    icon: string;
    text: string;
    primaryCta: {
      label: string;
      href: string;
      icon: string;
    };
    secondaryCta: {
      label: string;
      href: string;
      icon: string;
    };
  };
  mobileSticky: {
    call: {
      label: string;
      href: string;
    };
    viber: {
      label: string;
      href: string;
    };
  };
};

export const homePageEn: HomePageData = {
  seo: {
    title:
      "Chios Hotels in Kampos – Rooms & Apartments in Chios | Voulamandis House",
    description:
      "Peaceful rooms and apartments in Kampos, Chios. Stay at Voulamandis House near Chios airport, town and beaches, with authentic hospitality and direct booking benefits.",
    canonicalPath: "/",
    ogImage:
      "https://chioshotel.gr/wp-content/uploads/2026/03/chios.hotels.voulamandis.house_.hero_.image_.webp",
    ogImageAlt:
      "Voulamandis House in Kampos, Chios - authentic accommodation in a citrus estate",
  },

  hero: {
    rating: "4.8 / 5",
    reviews: "143 reviews",
    kicker: "KAMPOS CHIOS • VOULAMANDIS HOUSE",
    title: "Chios Hotels and Apartments in Kambos",
    descriptionHtml:
      'Looking for <strong>hotels in Chios</strong> or <strong>rooms in Chios</strong>? <strong>Voulamandis House</strong> is an authentic accommodation choice in Kampos, with comfortable rooms, peaceful surroundings and excellent guest reviews.',
    image:
      "https://chioshotel.gr/wp-content/uploads/2026/03/chios.hotels.voulamandis.house_.hero_.image_.webp",
    imageAlt: "Chios Hotels and Apartments in Kampos - Voulamandis House",
    primaryCta: {
      label: "Find Room",
      href: "/room-finder/",
      icon: "✨",
    },
    secondaryCta: {
      label: "Book now",
      href: "/chios-hotels-rates/",
      icon: "🔥",
    },
    quizCard: {
      href: "/chios-holidays-quiz/",
      icon: "🧭",
      liveLabel: "LIVE discount code",
      title: "Discover Chios",
      text: "Learn the island’s secrets and get a code for your stay.",
      cta: "Start →",
    },
  },

  announceBar: {
    href: "#vh-lastminute-title",
    icon: "🔥",
    text: "Traveling to Chios this week?",
    strongText: "See available accommodation deals.",
  },

  intro: {
    left: {
      kicker: "Authentic hospitality in Kampos, Chios",
      icon: "🏡",
      title: "Stay in Chios at Voulamandis House",
      bodyHtml:
        'Looking for <strong>rooms in Chios</strong> or <strong>Chios accommodation</strong> for a peaceful and well-kept stay? Voulamandis House welcomes you to the historic Kampos area of Chios, offering an authentic hospitality experience in a setting of natural beauty. If you are searching for <strong>hotels in Chios</strong> but prefer something more personal, our property is a warm alternative.',
      pills: [
        "🌴 Holidays in Chios",
        "🍊 Kampos Chios",
        "🛏️ Comfortable rooms",
        "💎 Value for money",
      ],
    },
    right: {
      kicker: "What makes Voulamandis House special",
      title:
        "Six reasons that make your stay more comfortable, personal and authentic",
      cards: [
        {
          title: "🥐 Homemade breakfast",
          text: "Breakfast in the garden with products from the farm, available on request.",
        },
        {
          title: "🌿 Courtyard & calm",
          text: "Quiet atmosphere, garden and authentic Kampos feeling for relaxation.",
        },
        {
          title: "🧭 Room Wizard",
          text: "Help to find the room that best suits your trip and travel style.",
        },
        {
          title: "📍 Practical location",
          text: "Close to town, airport, port and beaches, without unnecessary commuting.",
        },
        {
          title: "🛎️ -10% Direct booking",
          text: "Direct contact with the property and a clear view of availability.",
        },
        {
          title: "🍊 Chios secrets",
          text: "Suggestions for beaches, villages, experiences and authentic island routes.",
        },
      ],
    },
  },

  location: {
    kicker: "Location & direct booking",
    icon: "🗺️",
    title: "Everything you need before organizing your stay",
    subtitle: "Map, distances, contact details and direct booking advantages.",
    map: {
      previewImage:
        "https://chioshotel.gr/wp-content/uploads/2026/03/voulamandis.house_.google.maps_.webp",
      iframeSrc:
        "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d12648.784411135249!2d26.1360051!3d38.3370954!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14bac5b2f6b8b9f1%3A0x6b8b9f1b2f6b8b9f!2sVoulamandis%20House!5e0!3m2!1sel!2sgr!4v1614241234567!5m2!1sel!2sgr",
      buttonLabel: "Show Map",
    },
    distances: [
      {
        label: "✈️ Airport",
        value: "3 km",
      },
      {
        label: "⛴️ Port",
        value: "6 km",
      },
      {
        label: "🏖️ Beach",
        value: "1.5 km",
      },
    ],
    infoCard: {
      kicker: "Local information",
      title: "Voulamandis House",
      addressLines: ["Mayor Kalvokoresi 117", "Kampos, Chios 82100"],
      phoneLabel: "Tel:",
      phone: "+30 22710 31733",
      phoneHref: "tel:+302271031733",
      emailLabel: "Email:",
      email: "info@chioshotel.gr",
      emailHref: "mailto:info@chioshotel.gr",
      text: "The property is located in a spot that combines peace, easy access and short distances to the main points of Chios.",
      cta: {
        label: "Availability",
        href: "/chios-hotels-rates/",
        icon: "📅",
      },
    },
    discount: {
      badge: "LIVE Deal • Get your code",
      title: "Book direct with us",
      text: "Get a discount code and proceed with direct booking without commissions.",
      benefits: [
        "✔️ Best available rate",
        "✔️ Direct communication with the property",
        "✔️ Access to available rooms",
      ],
      formIntro: "🎁 Receive 10% discount for your direct booking:",
      emailPlaceholder: "Your email",
      submitLabel: "GET CODE",
      consent: "I agree to receive offers from Voulamandis House.",
      successText: "Your discount code is:",
      defaultCode: "WELCOME10",
    },
    copy: {
      kicker: "Location – Kampos Chios",
      title: "A special area for an authentic stay in Chios",
      paragraphsHtml: [
        "<strong>Kampos of Chios</strong> is one of the island’s most distinctive and historic areas, known for its mansions, stone gateways, orchards and citrus aromas.",
        "Its location is ideal for travelers who want to combine relaxation with easy access to Chios town, the airport and popular beaches.",
      ],
    },
  },

  roomsPreview: {
    kicker: "Rooms & accommodation in Chios",
    icon: "🛏️",
    title: "Rooms in Chios for couples and families",
    text: "Our rooms are cleaned daily and designed for a comfortable, peaceful and quality stay in Kampos, Chios.",
    primaryCta: {
      label: "Room Wizard",
      href: "/room-finder/",
      icon: "✨",
    },
    secondaryCta: {
      label: "All rooms",
      href: "/chios-rooms/",
      icon: "🗂️",
    },
    sideCard: {
      kicker: "Rooms in Chios",
      title: "From budget stays to family solutions",
      text: "If you are looking for hotels in Chios but prefer more personal hospitality, Voulamandis House offers an authentic alternative in Kampos.",
    },
    rooms: [
      {
        id: "economy-double",
        title: "Economy Double",
        href: "/chios-rooms/economy-double-rooms/",
        imageClass: "vh-room-image--economy",
        liveBadge: "LIVE",
        directBadge: "🎁 -10% Discount",
        bedBadge: "🛏️ 1 double or 2 singles",
        description:
          "Ideal for two guests who want a well-kept stay in Kampos, Chios.",
        meta: ["👥 2 guests", "Economy", "🍊 Kampos"],
        amenities: ["❄️ A/C", "📶 Wi-Fi", "☕ Coffee", "🧊 Fridge"],
        cta: "View room",
      },
      {
        id: "ground-floor-double-triple",
        title: "Ground Floor Double & Triple",
        href: "/chios-rooms/standard-double-room/",
        imageClass: "vh-room-image--ground",
        liveBadge: "LIVE",
        directBadge: "🎁 -10% Discount",
        bedBadge: "🛏️ Double + extra",
        description:
          "A comfortable choice for couples or small families with easy access.",
        meta: ["👤 ×2-3", "🌿 Ground", "Easy"],
        amenities: ["❄️ A/C", "📶 Wi-Fi", "☕ Coffee", "🧊 Fridge"],
        cta: "View room",
      },
      {
        id: "upper-floor-double-triple",
        title: "Upper Floor Double & Triple",
        href: "/chios-rooms/standard-double-room/",
        imageClass: "vh-room-image--upper",
        liveBadge: "LIVE",
        directBadge: "🎁 -10% Discount",
        bedBadge: "🛏️ Double + extra",
        description:
          "A choice for guests looking for a quieter atmosphere and classic hospitality.",
        meta: ["👤 ×2-3", "🏛️ Upper", "Quiet"],
        amenities: ["❄️ A/C", "📶 Wi-Fi", "☕ Coffee", "🧊 Fridge"],
        cta: "View room",
      },
      {
        id: "family-apartment",
        title: "Family Apartment",
        href: "/chios-rooms/family-chios-apartments/",
        imageClass: "vh-room-image--family",
        liveBadge: "LIVE",
        directBadge: "🎁 -10% Discount",
        bedBadge: "🛏️ Family beds",
        description: "Ideal for families or small groups who need more space.",
        meta: ["👤 ×4", "Space", "🏡 Apt"],
        amenities: ["❄️ A/C", "📶 Wi-Fi", "☕ Coffee", "🧊 Fridge"],
        cta: "View apartment",
      },
    ],
  },

  lastMinute: {
    kicker: "Last Minute Deals",
    icon: "⚡",
    title: "Traveling to Chios this week?",
    subtitle:
      "Select the number of guests and see available deals for the next 7 days, with final cost and direct communication.",
    widget: {
      title: "Accommodation deals in Chios for the next 7 days",
      subtitle:
        "Find available rooms or apartments for direct booking, with no commissions. Select the number of guests and send your request directly through WhatsApp or Viber.",
      trustLine: "🎁 Direct booking without commissions – best available rate",
      timerLabel: "Last minute prices refresh in:",
      guestTitle: "1. Select number of guests",
      guestText:
        "Once you select how many people will stay, the available deals will appear.",
      guestButtons: [
        {
          label: "👤 ×2",
          value: 2,
        },
        {
          label: "👤 ×3",
          value: 3,
        },
        {
          label: "👤 ×4",
          value: 4,
        },
      ],
      helper: "First select guests to see available rooms in Chios.",
      loadingText: "🔥 Searching for the best available deals…",
      resultsTitle: "2. Available deals",
      resultsText: "Use the filters to quickly narrow down your options.",
      emptyText: "First select 2, 3 or 4 guests to load the available deals.",
    },
  },

  reviews: {
    kicker: "Guest Reviews",
    icon: "💬",
    title: "What our guests say",
    trustindexLoaderUrl: "https://cdn.trustindex.io/loader.js?eee5e55655b69937bc662de8425",
  },

  amenities: {
    kicker: "Accommodation amenities",
    icon: "🛋️",
    title: "Everything you need for a comfortable stay",
    items: [
      {
        icon: "📶",
        label: "Wi-Fi / Internet",
      },
      {
        icon: "❄️",
        label: "Air Conditioning",
      },
      {
        icon: "🔥",
        label: "Heating",
      },
      {
        icon: "📺",
        label: "TV",
      },
      {
        icon: "🧊",
        label: "Fridge",
      },
      {
        icon: "☕",
        label: "Coffee / Tea",
      },
      {
        icon: "🧼",
        label: "Daily housekeeping",
      },
      {
        icon: "🌿",
        label: "Garden & seating",
      },
      {
        icon: "🍖",
        label: "BBQ area",
      },
      {
        icon: "🚗",
        label: "Parking",
      },
      {
        icon: "🚕",
        label: "Transfer options",
      },
      {
        icon: "🏡",
        label: "Authentic hospitality",
      },
    ],
  },

  traveler: {
    kicker: "Discover Chios",
    icon: "🧳",
    title: "What type of traveler are you?",
    subtitle:
      "Choose the experience that suits you and discover Chios based on your travel style.",
    cards: [
      {
        id: "sea",
        title: "Sea",
        text: "Crystal-clear waters, unique beaches and relaxation on the island.",
        href: "/best-beaches-in-chios/",
        className: "vh-traveler-card--sea",
        cta: "🏖️ Explore",
      },
      {
        id: "exploration",
        title: "Exploration",
        text: "Villages, nature and culture in every corner of Chios.",
        href: "/10-best-tips-to-explore-chiosvoulamandis-house/",
        className: "vh-traveler-card--explorer",
        cta: "🧭 Explore",
      },
      {
        id: "family",
        title: "Family",
        text: "Ideas and activities for unforgettable family holidays.",
        href: "/family-travel-in-chios/",
        className: "vh-traveler-card--family",
        cta: "👨‍👩‍👧‍👦 Explore",
      },
      {
        id: "food",
        title: "Gastronomy",
        text: "Authentic flavors, mastic and local experiences.",
        href: "/taste-lover-chios/",
        className: "vh-traveler-card--food",
        cta: "🍽️ Explore",
      },
    ],
  },

  chiosGuide: {
    kicker: "More about Chios",
    icon: "🧭",
    title: "What to see in Chios?",
    subtitle:
      "We gathered useful information about Chios to help you plan your stay and day trips more easily.",
    cards: [
      {
        id: "beaches",
        title: "Beaches of Chios",
        text: "See suggestions and organize your summer escapes more easily.",
        href: "/chios/chios-beaches/",
        imageClass: "vh-link-image--beaches",
        ctaIcon: "🏖️",
        ctaLabel: "See more",
      },
      {
        id: "villages",
        title: "Villages of Chios",
        text: "Discover traditional settlements and places worth visiting.",
        href: "/chios/chios-villages/",
        imageClass: "vh-link-image--villages",
        ctaIcon: "🏘️",
        ctaLabel: "See more",
      },
      {
        id: "kampos",
        title: "Kampos of Chios",
        text: "Learn more about the area that makes staying in Kampos special.",
        href: "/chios/chios-kambos/",
        imageClass: "vh-link-image--kampos",
        ctaIcon: "🍊",
        ctaLabel: "See more",
      },
      {
        id: "museums",
        title: "Museums of Chios",
        text: "Cultural stops for travelers who love history and local identity.",
        href: "/chios/chios-museums/the-mastic-museum-chios/",
        imageClass: "vh-link-image--museums",
        ctaIcon: "🏺",
        ctaLabel: "See more",
      },
      {
        id: "orchids",
        title: "Orchids of Chios",
        text: "A special activity for nature lovers who want to see a different side of the island.",
        href: "/chios/chios-orchids/",
        imageClass: "vh-link-image--orchids",
        ctaIcon: "🌸",
        ctaLabel: "See more",
      },
      {
        id: "thermal-springs",
        title: "Thermal Springs",
        text: "Relaxation and wellness experiences that complement your holiday perfectly.",
        href: "/chios/chios-activities/the-chios-thermal-baths/chios/",
        imageClass: "vh-link-image--springs",
        ctaIcon: "♨️",
        ctaLabel: "See more",
      },
    ],
  },

  quizBar: {
    label: "DISCOVER CHIOS",
    text: "Spend 5 minutes and play this quiz to discover Chios and learn its hidden secrets.",
    href: "/chios-holidays-quiz/",
    cta: "🧭 START THE EXPERIENCE →",
  },

  faq: {
    kicker: "Frequently Asked Questions",
    icon: "❓",
    title: "What you should know before booking your stay",
    items: [
      {
        question: "Is Voulamandis House a hotel?",
        answerHtml:
          "Voulamandis House is a property with rooms and apartments in Kampos, Chios. If you are searching for a hotel in Chios but prefer quieter and more personal hospitality, it is an authentic alternative.",
      },
      {
        question: "Where exactly is Voulamandis House located?",
        answerHtml:
          "The property is located in historic <strong>Kampos, Chios</strong>. It is about 7 minutes by car from the airport and about 14 minutes from the port and town center.",
      },
      {
        question: "Is breakfast available during the stay?",
        answerHtml:
          "Yes, homemade breakfast is offered under the garden pergola, with products from our farm. It is optional and available on request.",
      },
      {
        question: "Which rooms are suitable for families?",
        answerHtml:
          "For families of up to 4 guests, we recommend the <strong>Family Apartments</strong>. For larger groups, a combination of two rooms may also work, depending on availability.",
      },
      {
        question: "Is parking available?",
        answerHtml:
          "Yes, parking is available inside the property, and there is also easy parking on the quiet street just outside.",
      },
      {
        question: "How can I make a direct booking?",
        answerHtml:
          "You can book directly through our website or contact us directly, so you can choose the room that best suits your stay.",
      },
    ],
  },

  finalCta: {
    kicker: "Book your stay",
    icon: "✈️",
    title: "Your trip to Chios starts here",
    text: "Warm hospitality, authentic atmosphere and an ideal location in Kampos.",
    primaryCta: {
      label: "Book Direct",
      href: "/chios-hotels-rates/",
      icon: "🛎️",
    },
    secondaryCta: {
      label: "Contact",
      href: "/voulamandis-house-contact-us-form-fill-in-the-form/",
      icon: "✉️",
    },
  },
    mobileSticky: {
    call: {
      label: "📞 CALL",
      href: "tel:+306944764654",
    },
    viber: {
      label: "💬 VIBER",
      href: "viber://chat?number=%2B306944474226",
    },
  },
};
export const homePageEl: HomePageData = {
  ...homePageEn,

  seo: {
    title: "Ξενοδοχείο στη Χίο – Δωμάτια & Διαμερίσματα | Voulamandis House",
    description:
      "Ήσυχα δωμάτια και διαμερίσματα στον Κάμπο της Χίου. Διαμονή στο Voulamandis House κοντά σε αεροδρόμιο, πόλη και παραλίες.",
    canonicalPath: "/el/",
    ogImage: homePageEn.seo.ogImage,
    ogImageAlt:
      "Voulamandis House στον Κάμπο της Χίου - αυθεντική διαμονή σε ιστορική περιοχή",
  },

  hero: {
    ...homePageEn.hero,
    rating: "4.8 / 5",
    reviews: "143 κριτικές",
    kicker: "ΚΑΜΠΟΣ ΧΙΟΥ • VOULAMANDIS HOUSE",
    title: "Ενοικιαζόμενα Δωμάτια στη Χίο στον Κάμπο",
    descriptionHtml:
      'Ψάχνετε για <strong>ξενοδοχείο στη Χίο</strong> ή <strong>ενοικιαζόμενα δωμάτια Χίος</strong>; Το <strong>Voulamandis House</strong> είναι μια αυθεντική επιλογή διαμονής στον Κάμπο, με άνετα δωμάτια, ήρεμο περιβάλλον και εξαιρετικές κριτικές επισκεπτών.',
    imageAlt:
      "Ενοικιαζόμενα δωμάτια στη Χίο στον Κάμπο - Voulamandis House",
    primaryCta: {
      label: "Βρες Δωμάτιο",
      href: "/el/vre-to-domatio-pou-sou-tairiazei/",
      icon: "✨",
    },
    secondaryCta: {
      label: "Προσφορές",
      href: "#vh-lastminute-title",
      icon: "🔥",
    },
    quizCard: {
      href: "/el/diakopes-sti-chio-quiz/",
      icon: "🧭",
      liveLabel: "LIVE Κωδικός έκπτωσης",
      title: "Ανακάλυψε τη Χίο",
      text: "Μάθε τα μυστικά του νησιού και πάρε κωδικό για τη διαμονή σου.",
      cta: "Ξεκίνα →",
    },
  },

  announceBar: {
    href: "#vh-lastminute-title",
    icon: "🔥",
    text: "Ταξιδεύεις για Χίο αυτή την εβδομάδα;",
    strongText: "Δες διαθέσιμες προσφορές διαμονής.",
  },

  intro: {
    left: {
      kicker: "Αυθεντική φιλοξενία στον Κάμπο της Χίου",
      icon: "🏡",
      title: "Διαμονή στη Χίο στο Voulamandis House",
      bodyHtml:
        'Αναζητάτε <strong>δωμάτια στη Χίο</strong> ή <strong>ενοικιαζόμενα δωμάτια Χίος</strong> για ήρεμη και προσεγμένη διαμονή; Το Voulamandis House σας καλωσορίζει στον ιστορικό Κάμπο της Χίου, προσφέροντας μια αυθεντική εμπειρία φιλοξενίας σε περιβάλλον φυσικής ομορφιάς. Αν ψάχνετε για <strong>ξενοδοχεία στη Χίο</strong> αλλά προτιμάτε κάτι πιο προσωπικό, το κατάλυμά μας αποτελεί μια ζεστή εναλλακτική επιλογή.',
      pills: [
        "🌴 Διακοπές στη Χίο",
        "🍊 Κάμπος Χίου",
        "🛏️ Άνετα δωμάτια",
        "💎 Value for money",
      ],
    },
    right: {
      kicker: "Τι κάνει το Voulamandis House ξεχωριστό",
      title:
        "Έξι λόγοι που κάνουν τη διαμονή πιο άνετη, προσωπική και αυθεντική",
      cards: [
        {
          title: "🥐 Σπιτικό πρωινό",
          text: "Πρωινό στον κήπο με προϊόντα από το αγρόκτημα, διαθέσιμο κατόπιν ενημέρωσης.",
        },
        {
          title: "🌿 Αυλή & ηρεμία",
          text: "Ήσυχη ατμόσφαιρα, κήπος και αυθεντική αίσθηση Κάμπου για χαλάρωση.",
        },
        {
          title: "🧭 Room Wizard",
          text: "Βοήθεια για να βρείτε πιο εύκολα το δωμάτιο που ταιριάζει στο ταξίδι σας.",
        },
        {
          title: "📍 Σωστή τοποθεσία",
          text: "Κοντά σε πόλη, αεροδρόμιο, λιμάνι και παραλίες, χωρίς περιττές μετακινήσεις.",
        },
        {
          title: "🛎️ -10% Απευθείας κράτηση",
          text: "Άμεση επικοινωνία με το κατάλυμα και καθαρή εικόνα για διαθεσιμότητα.",
        },
        {
          title: "🍊 Μυστικά της Χίου",
          text: "Προτάσεις για παραλίες, χωριά, εμπειρίες και αυθεντικές διαδρομές στο νησί.",
        },
      ],
    },
  },

  location: {
    ...homePageEn.location,
    kicker: "Τοποθεσία & απευθείας κράτηση",
    icon: "🗺️",
    title: "Όλα όσα χρειάζεστε πριν οργανώσετε τη διαμονή σας",
    subtitle:
      "Χάρτης, αποστάσεις, στοιχεία επικοινωνίας και πλεονεκτήματα απευθείας κράτησης.",
    map: {
      ...homePageEn.location.map,
      buttonLabel: "Εμφάνιση Χάρτη",
    },
    distances: [
      {
        label: "✈️ Αεροδρόμιο",
        value: "3 χλμ",
      },
      {
        label: "⛴️ Λιμάνι",
        value: "6 χλμ",
      },
      {
        label: "🏖️ Παραλία",
        value: "1.5 χλμ",
      },
    ],
    infoCard: {
      kicker: "Τοπικές πληροφορίες",
      title: "Voulamandis House",
      addressLines: ["Δημάρχου Καλβοκορέση 117", "Κάμπος, Χίος 82100"],
      phoneLabel: "Τηλ:",
      phone: "+30 22710 31733",
      phoneHref: "tel:+302271031733",
      emailLabel: "Email:",
      email: "info@chioshotel.gr",
      emailHref: "mailto:info@chioshotel.gr",
      text: "Το κατάλυμα βρίσκεται σε σημείο που συνδυάζει ηρεμία, εύκολη πρόσβαση και κοντινές αποστάσεις προς τα βασικά σημεία της Χίου.",
      cta: {
        label: "Διαθεσιμότητα",
        href: "/el/amesi-kratisi-voulamandis-house/",
        icon: "📅",
      },
    },
    discount: {
      badge: "LIVE Ευκαιρία • Πάρε κωδικό",
      title: "Κλείστε απευθείας μαζί μας",
      text: "Πάρε κωδικό έκπτωσης και προχώρησε σε απευθείας κράτηση χωρίς προμήθειες.",
      benefits: [
        "✔️ Καλύτερη διαθέσιμη τιμή",
        "✔️ Άμεση επικοινωνία με το κατάλυμα",
        "✔️ Πρόσβαση σε διαθέσιμα δωμάτια",
      ],
      formIntro: "🎁 Λάβετε 10% έκπτωση για την απευθείας κράτησή σας:",
      emailPlaceholder: "Το email σας",
      submitLabel: "ΛΗΨΗ ΚΩΔΙΚΟΥ",
      consent: "Συμφωνώ να λαμβάνω προσφορές από το Voulamandis House.",
      successText: "Ο εκπτωτικός σας κωδικός είναι:",
      defaultCode: "WELCOME10",
    },
    copy: {
      kicker: "Τοποθεσία – Κάμπος Χίου",
      title: "Μια ξεχωριστή περιοχή για αυθεντική διαμονή στη Χίο",
      paragraphsHtml: [
        "Ο <strong>Κάμπος της Χίου</strong> είναι μία από τις πιο ιδιαίτερες και ιστορικές περιοχές του νησιού, γνωστή για τα αρχοντικά, τις πέτρινες αυλόπορτες, τα περιβόλια και τα αρώματα των εσπεριδοειδών.",
        "Η θέση του είναι ιδανική για όσους θέλουν να συνδυάσουν χαλάρωση και εύκολη πρόσβαση στην πόλη της Χίου, στο αεροδρόμιο και σε δημοφιλείς παραλίες.",
      ],
    },
  },

  roomsPreview: {
    ...homePageEn.roomsPreview,
    kicker: "Δωμάτια & διαμονή στη Χίο",
    icon: "🛏️",
    title: "Δωμάτια Χίος για ζευγάρια και οικογένειες",
    text: "Τα δωμάτιά μας καθαρίζονται καθημερινά και έχουν σχεδιαστεί για άνετη, ήρεμη και ποιοτική διαμονή στον Κάμπο της Χίου.",
    primaryCta: {
      label: "Room Wizard",
      href: "/el/vre-to-domatio-pou-sou-tairiazei/",
      icon: "✨",
    },
    secondaryCta: {
      label: "Όλα τα δωμάτια",
      href: "/el/domatia-xios/",
      icon: "🗂️",
    },
    sideCard: {
      kicker: "Ενοικιαζόμενα δωμάτια Χίος",
      title: "Από οικονομική διαμονή μέχρι οικογενειακές λύσεις",
      text: "Αν αναζητάτε ξενοδοχεία στη Χίο αλλά προτιμάτε πιο προσωπική φιλοξενία, το Voulamandis House προσφέρει μια αυθεντική εναλλακτική διαμονής στον Κάμπο.",
    },
    rooms: [
      {
        ...homePageEn.roomsPreview.rooms[0],
        title: "Οικονομικό Δίκλινο",
        href: "/el/domatia-xios/oikonomiko-diklino-domatio/",
        directBadge: "🎁 -10% Έκπτωση",
        bedBadge: "🛏️ 1 διπλό ή 2 μονά",
        description:
          "Ιδανική επιλογή για δύο άτομα που θέλουν προσεγμένη διαμονή στον Κάμπο της Χίου.",
        meta: ["👥 2 άτομα", "Economy", "🍊 Κάμπος"],
        amenities: ["❄️ A/C", "📶 Wi-Fi", "☕ Καφές", "🧊 Ψυγείο"],
        cta: "Δες το δωμάτιο",
      },
      {
        ...homePageEn.roomsPreview.rooms[1],
        title: "Δίκλινα & Τρίκλινα Ισογείου",
        href: "/el/domatia-xios/diklina-triklina-domatia/",
        directBadge: "🎁 -10% Έκπτωση",
        bedBadge: "🛏️ Διπλό + extra",
        description:
          "Άνετη λύση για ζευγάρια ή μικρές οικογένειες με εύκολη πρόσβαση.",
        meta: ["👤 ×2-3", "🌿 Ισόγειο", "Εύκολα"],
        amenities: ["❄️ A/C", "📶 Wi-Fi", "☕ Καφές", "🧊 Ψυγείο"],
        cta: "Δες το δωμάτιο",
      },
      {
        ...homePageEn.roomsPreview.rooms[2],
        title: "Δίκλινα & Τρίκλινα Ορόφου",
        href: "/el/domatia-xios/diklina-triklina-domatia/",
        directBadge: "🎁 -10% Έκπτωση",
        bedBadge: "🛏️ Διπλό + extra",
        description:
          "Επιλογή για επισκέπτες που αναζητούν πιο ήρεμη ατμόσφαιρα και κλασική φιλοξενία.",
        meta: ["👤 ×2-3", "🏛️ Όροφος", "Ήσυχα"],
        amenities: ["❄️ A/C", "📶 Wi-Fi", "☕ Καφές", "🧊 Ψυγείο"],
        cta: "Δες το δωμάτιο",
      },
      {
        ...homePageEn.roomsPreview.rooms[3],
        title: "Οικογενειακό Διαμέρισμα",
        href: "/el/domatia-xios/oikogeneiako-diamerisma/",
        directBadge: "🎁 -10% Έκπτωση",
        bedBadge: "🛏️ Family beds",
        description:
          "Ιδανικό για οικογένειες ή μικρές παρέες που χρειάζονται περισσότερο χώρο.",
        meta: ["👤 ×4", "Χώρος", "🏡 Apt"],
        amenities: ["❄️ A/C", "📶 Wi-Fi", "☕ Καφές", "🧊 Ψυγείο"],
        cta: "Δες το διαμέρισμα",
      },
    ],
  },

  lastMinute: {
    kicker: "Last Minute Προσφορές",
    icon: "⚡",
    title: "Ταξιδεύεις για Χίο αυτή την εβδομάδα;",
    subtitle:
      "Επίλεξε αριθμό επισκεπτών και δες διαθέσιμες προσφορές για τις επόμενες 7 ημέρες, με τελικό κόστος και απευθείας επικοινωνία.",
    widget: {
      title: "Προσφορές διαμονής στη Χίο για τις επόμενες 7 ημέρες",
      subtitle:
        "Βρες διαθέσιμα δωμάτια ή διαμερίσματα για άμεση κράτηση, χωρίς προμήθειες. Επίλεξε αριθμό επισκεπτών και στείλε απευθείας αίτημα μέσω WhatsApp ή Viber.",
      trustLine:
        "🎁 Απευθείας κράτηση χωρίς προμήθειες – καλύτερη διαθέσιμη τιμή",
      timerLabel: "Οι last minute τιμές ανανεώνονται σε:",
      guestTitle: "1. Επίλεξε αριθμό επισκεπτών",
      guestText:
        "Μόλις επιλέξεις πόσα άτομα θα μείνετε, θα εμφανιστούν οι διαθέσιμες προσφορές.",
      guestButtons: [
        {
          label: "👤 ×2",
          value: 2,
        },
        {
          label: "👤 ×3",
          value: 3,
        },
        {
          label: "👤 ×4",
          value: 4,
        },
      ],
      helper:
        "Επίλεξε πρώτα επισκέπτες για να δεις διαθέσιμα δωμάτια στη Χίο.",
      loadingText: "🔥 Αναζητούμε τις καλύτερες διαθέσιμες προσφορές…",
      resultsTitle: "2. Διαθέσιμες προσφορές",
      resultsText:
        "Χρησιμοποίησε τα φίλτρα για να περιορίσεις γρήγορα τις επιλογές.",
      emptyText:
        "Πρώτα επίλεξε 2, 3 ή 4 επισκέπτες για να εμφανιστούν οι διαθέσιμες προσφορές.",
    },
  },

  reviews: {
    ...homePageEn.reviews,
    kicker: "Κριτικές επισκεπτών",
    icon: "💬",
    title: "Τι λένε οι επισκέπτες μας",
  },

  amenities: {
    kicker: "Παροχές διαμονής",
    icon: "🛋️",
    title: "Ό,τι χρειάζεστε για άνετη διαμονή",
    items: [
      { icon: "📶", label: "Wi-Fi / Internet" },
      { icon: "❄️", label: "Κλιματισμός" },
      { icon: "🔥", label: "Θέρμανση" },
      { icon: "📺", label: "Τηλεόραση" },
      { icon: "🧊", label: "Ψυγείο" },
      { icon: "☕", label: "Καφές / Τσάι" },
      { icon: "🧼", label: "Καθημερινή καθαριότητα" },
      { icon: "🌿", label: "Κήπος & καθιστικό" },
      { icon: "🍖", label: "Χώρος BBQ" },
      { icon: "🚗", label: "Parking" },
      { icon: "🚕", label: "Μεταφορά" },
      { icon: "🏡", label: "Αυθεντική φιλοξενία" },
    ],
  },

  traveler: {
    kicker: "Discover Chios",
    icon: "🧳",
    title: "Ποιος τύπος ταξιδιώτη είσαι;",
    subtitle:
      "Επίλεξε την εμπειρία που σου ταιριάζει και ανακάλυψε τη Χίο με βάση το δικό σου ταξιδιωτικό στυλ.",
    cards: [
      {
        ...homePageEn.traveler.cards[0],
        title: "Θάλασσα",
        text: "Κρυστάλλινα νερά, μοναδικές παραλίες και χαλάρωση στο νησί.",
        href: "/el/kalyteres-paralies-xiou/",
        cta: "🏖️ Εξερεύνησε",
      },
      {
        ...homePageEn.traveler.cards[1],
        title: "Εξερεύνηση",
        text: "Χωριά, φύση και πολιτισμός σε κάθε γωνιά της Χίου.",
        href: "/el/exerevnisi-chiou/",
        cta: "🧭 Εξερεύνησε",
      },
      {
        ...homePageEn.traveler.cards[2],
        title: "Οικογένεια",
        text: "Ιδέες και δραστηριότητες για αξέχαστες οικογενειακές διακοπές.",
        href: "/el/oikogeneiakes-diakopes-sti-xio/",
        cta: "👨‍👩‍👧‍👦 Εξερεύνησε",
      },
      {
        ...homePageEn.traveler.cards[3],
        title: "Γαστρονομία",
        text: "Αυθεντικές γεύσεις, μαστίχα και τοπικές εμπειρίες.",
        href: "/el/taste-lover-el-gastronomiko-taxidi-xios/",
        cta: "🍽️ Εξερεύνησε",
      },
    ],
  },

  chiosGuide: {
    kicker: "Περισσότερα για τη Χίο",
    icon: "🧭",
    title: "Τι να δω στη Χίο;",
    subtitle:
      "Συγκεντρώσαμε χρήσιμες πληροφορίες για τη Χίο ώστε να οργανώσετε πιο εύκολα τη διαμονή και τις εξορμήσεις σας.",
    cards: [
      {
        ...homePageEn.chiosGuide.cards[0],
        title: "Παραλίες της Χίου",
        text: "Δείτε προτάσεις και οργανώστε πιο εύκολα τις καλοκαιρινές σας εξορμήσεις.",
        href: "/chios/chios-beaches/",
        ctaLabel: "Δες περισσότερα",
      },
      {
        ...homePageEn.chiosGuide.cards[1],
        title: "Χωριά της Χίου",
        text: "Ανακαλύψτε παραδοσιακούς οικισμούς και σημεία που αξίζει να επισκεφθείτε.",
        href: "/chios/chios-villages/",
        ctaLabel: "Δες περισσότερα",
      },
      {
        ...homePageEn.chiosGuide.cards[2],
        title: "Κάμπος της Χίου",
        text: "Μάθετε περισσότερα για την περιοχή που κάνει τη διαμονή στον Κάμπο ξεχωριστή.",
        href: "/chios-island/",
        ctaLabel: "Δες περισσότερα",
      },
      {
        ...homePageEn.chiosGuide.cards[3],
        title: "Μουσεία της Χίου",
        text: "Πολιτιστικές στάσεις για όσους αγαπούν την ιστορία και την τοπική ταυτότητα.",
        href: "/chios/chios-museums/",
        ctaLabel: "Δες περισσότερα",
      },
      {
        ...homePageEn.chiosGuide.cards[4],
        title: "Ορχιδέες της Χίου",
        text: "Μια ιδιαίτερη δραστηριότητα για φυσιολάτρες που θέλουν να δουν μια διαφορετική πλευρά του νησιού.",
        href: "/chios-island/",
        ctaLabel: "Δες περισσότερα",
      },
      {
        ...homePageEn.chiosGuide.cards[5],
        title: "Ιαματικές Πηγές",
        text: "Επιλογές για χαλάρωση και wellness εμπειρίες που συμπληρώνουν ιδανικά τις διακοπές σας.",
        href: "/chios-island/",
        ctaLabel: "Δες περισσότερα",
      },
    ],
  },

  quizBar: {
    label: "ΑΝΑΚΑΛΥΨΤΕ ΤΗ ΧΙΟ",
    text: "Αφιέρωσε 5 λεπτά και παίξε αυτό το quiz που θα σε βοηθήσει να γνωρίσεις τη Χίο, να μάθεις τα μυστικά της και να πάρεις κωδικό έκπτωσης στο τέλος.",
    href: "/el/diakopes-sti-chio-quiz/",
    cta: "🧭 ΞΕΚΙΝΑ ΤΗΝ ΕΜΠΕΙΡΙΑ →",
  },

  faq: {
    kicker: "Συχνές Ερωτήσεις",
    icon: "❓",
    title: "Όσα πρέπει να γνωρίζετε πριν κλείσετε τη διαμονή σας",
    items: [
      {
        question: "Το Voulamandis House είναι ξενοδοχείο;",
        answerHtml:
          "Όχι. Το Voulamandis House είναι κατάλυμα με ενοικιαζόμενα δωμάτια και διαμερίσματα στον Κάμπο της Χίου. Αν αναζητάτε ξενοδοχείο στη Χίο αλλά προτιμάτε πιο ήρεμη και προσωπική φιλοξενία, αποτελεί μια αυθεντική εναλλακτική επιλογή.",
      },
      {
        question: "Πού ακριβώς βρίσκεται το Voulamandis House;",
        answerHtml:
          "Το κατάλυμα βρίσκεται στον ιστορικό <strong>Κάμπο της Χίου</strong>. Απέχει περίπου 7 λεπτά με το αυτοκίνητο από το αεροδρόμιο και περίπου 14 λεπτά από το λιμάνι και το κέντρο της πόλης.",
      },
      {
        question: "Παρέχεται πρωινό κατά τη διαμονή;",
        answerHtml:
          "Ναι, προσφέρεται σπιτικό πρωινό στην πέργκολα του κήπου, με προϊόντα από το αγρόκτημά μας. Είναι προαιρετικό και διατίθεται κατόπιν ενημέρωσης.",
      },
      {
        question: "Ποια δωμάτια είναι κατάλληλα για οικογένειες;",
        answerHtml:
          "Για οικογένειες έως 4 ατόμων, προτείνουμε τα <strong>Οικογενειακά Διαμερίσματα</strong>. Για περισσότερα άτομα, μπορεί να εξυπηρετήσει και συνδυασμός δύο δωματίων, ανάλογα με τη διαθεσιμότητα.",
      },
      {
        question: "Υπάρχει χώρος στάθμευσης;",
        answerHtml:
          "Ναι, υπάρχει δυνατότητα στάθμευσης εντός του καταλύματος, καθώς και εύκολη στάθμευση στον ήσυχο δρόμο ακριβώς έξω.",
      },
      {
        question: "Πώς μπορώ να κάνω απευθείας κράτηση;",
        answerHtml:
          "Μπορείτε να κάνετε άμεση κράτηση μέσα από την ιστοσελίδα μας ή να επικοινωνήσετε απευθείας μαζί μας, ώστε να επιλέξετε το δωμάτιο που σας ταιριάζει καλύτερα.",
      },
    ],
  },

  finalCta: {
    kicker: "Κλείστε τη διαμονή σας",
    icon: "✈️",
    title: "Το ταξίδι σας στη Χίο ξεκινά εδώ",
    text: "Ζεστή φιλοξενία, αυθεντική ατμόσφαιρα και ιδανική τοποθεσία στον Κάμπο.",
    primaryCta: {
      label: "Άμεση Κράτηση",
      href: "/el/amesi-kratisi-voulamandis-house/",
      icon: "🛎️",
    },
    secondaryCta: {
      label: "Επικοινωνία",
      href: "/el/epikoinonia-voulamandis-house/",
      icon: "✉️",
    },
  },

  mobileSticky: {
    call: {
      label: "📞 ΚΛΗΣΗ",
      href: "tel:+306944764654",
    },
    viber: {
      label: "💬 VIBER",
      href: "viber://chat?number=%2B306944474226",
    },
  },
};