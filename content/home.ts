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