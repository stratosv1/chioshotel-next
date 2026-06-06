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
    title: "Chios Hotels & Rooms | Voulamandis House",
    description:
      "Peaceful rooms and apartments in Kampos, Chios. Stay at Voulamandis House near Chios airport, town and beaches, with authentic hospitality and direct booking benefits.",
    canonicalPath: "/",
    ogImage:
      "/images/activities/chios.hotels.voulamandis.house_.hero_.image_.webp",
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
      "/images/activities/chios.hotels.voulamandis.house_.hero_.image_.webp",
    imageAlt: "Chios Hotels and Apartments in Kampos - Voulamandis House",
    primaryCta: {
      label: "Find your room",
      href: "/find-your-room/",
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
        "/images/site/voulamandis.house_.google.maps_.webp",
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
      href: "/chios-rooms/",
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
        href: "/chios-beach-lovers/",
        className: "vh-traveler-card--sea",
        cta: "🏖️ Explore",
      },
      {
        id: "exploration",
        title: "Exploration",
        text: "Villages, nature and culture in every corner of Chios.",
        href: "/chios-explorer/",
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
        href: "/chios-island/",
        imageClass: "vh-link-image--kampos",
        ctaIcon: "🍊",
        ctaLabel: "See more",
      },
      {
        id: "museums",
        title: "Museums of Chios",
        text: "Cultural stops for travelers who love history and local identity.",
        href: "/chios/chios-museums/",
        imageClass: "vh-link-image--museums",
        ctaIcon: "🏺",
        ctaLabel: "See more",
      },
      {
        id: "orchids",
        title: "Orchids of Chios",
        text: "A special activity for nature lovers who want to see a different side of the island.",
        href: "/chios-orchids/",
        imageClass: "vh-link-image--orchids",
        ctaIcon: "🌸",
        ctaLabel: "See more",
      },
      {
        id: "thermal-springs",
        title: "Thermal Springs",
        text: "Relaxation and wellness experiences that complement your holiday perfectly.",
        href: "/chios-thermal-baths/",
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
    title: "Ξενοδοχείο στη Χίο | Voulamandis House",
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
      label: "Βρες το δωμάτιό σου",
      href: "/el/vres-to-domatio-sou/",
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
      href: "/el/domatia-xios/",
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
        href: "/el/paralies-xios/",
        cta: "🏖️ Εξερεύνησε",
      },
      {
        ...homePageEn.traveler.cards[1],
        title: "Εξερεύνηση",
        text: "Χωριά, φύση και πολιτισμός σε κάθε γωνιά της Χίου.",
        href: "/el/xoria-xios/",
        cta: "🧭 Εξερεύνησε",
      },
      {
        ...homePageEn.traveler.cards[2],
        title: "Οικογένεια",
        text: "Ιδέες και δραστηριότητες για αξέχαστες οικογενειακές διακοπές.",
        href: "/el/domatia-xios/oikogeneiako-diamerisma/",
        cta: "👨‍👩‍👧‍👦 Εξερεύνησε",
      },
      {
        ...homePageEn.traveler.cards[3],
        title: "Γαστρονομία",
        text: "Αυθεντικές γεύσεις, μαστίχα και τοπικές εμπειρίες.",
        href: "/el/ti-na-do-sti-xio/",
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
        href: "/el/paralies-xios/",
        ctaLabel: "Δες περισσότερα",
      },
      {
        ...homePageEn.chiosGuide.cards[1],
        title: "Χωριά της Χίου",
        text: "Ανακαλύψτε παραδοσιακούς οικισμούς και σημεία που αξίζει να επισκεφθείτε.",
        href: "/el/xoria-xios/",
        ctaLabel: "Δες περισσότερα",
      },
      {
        ...homePageEn.chiosGuide.cards[2],
        title: "Κάμπος της Χίου",
        text: "Μάθετε περισσότερα για την περιοχή που κάνει τη διαμονή στον Κάμπο ξεχωριστή.",
        href: "/el/ti-na-do-sti-xio/",
        ctaLabel: "Δες περισσότερα",
      },
      {
        ...homePageEn.chiosGuide.cards[3],
        title: "Μουσεία της Χίου",
        text: "Πολιτιστικές στάσεις για όσους αγαπούν την ιστορία και την τοπική ταυτότητα.",
        href: "/el/mouseia-xios/",
        ctaLabel: "Δες περισσότερα",
      },
      {
        ...homePageEn.chiosGuide.cards[4],
        title: "Ορχιδέες της Χίου",
        text: "Μια ιδιαίτερη δραστηριότητα για φυσιολάτρες που θέλουν να δουν μια διαφορετική πλευρά του νησιού.",
        href: "/el/orchidees-xiou/",
        ctaLabel: "Δες περισσότερα",
      },
      {
        ...homePageEn.chiosGuide.cards[5],
        title: "Ιαματικές Πηγές",
        text: "Επιλογές για χαλάρωση και wellness εμπειρίες που συμπληρώνουν ιδανικά τις διακοπές σας.",
        href: "/el/iamatika-loutra-xiou/",
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
export const homePageFr: HomePageData = {
  ...homePageEn,

  seo: {
    title: "Hôtel à Chios | Voulamandis House",
    description:
      "Chambres et appartements paisibles à Kampos, Chios. Séjournez à Voulamandis House, près de l’aéroport, de la ville, des plages et des villages de l’île.",
    canonicalPath: "/fr/",
    ogImage: homePageEn.seo.ogImage,
    ogImageAlt:
      "Voulamandis House à Kampos, Chios - hébergement authentique dans un domaine d’agrumes",
  },

  hero: {
    ...homePageEn.hero,
    reviews: "143 avis",
    kicker: "KAMPOS CHIOS • VOULAMANDIS HOUSE",
    title: "Hôtel et appartements à Chios, au cœur de Kampos",
    descriptionHtml:
      'Vous cherchez un <strong>hôtel à Chios</strong> ou des <strong>chambres à Chios</strong> ? <strong>Voulamandis House</strong> vous accueille à Kampos avec des chambres confortables, une atmosphère paisible et une hospitalité authentique.',
    imageAlt: "Hôtel et appartements à Chios - Voulamandis House à Kampos",
    primaryCta: {
      label: "Trouvez votre chambre",
      href: "/fr/trouvez-votre-chambre/",
      icon: "✨",
    },
    secondaryCta: {
      label: "Réserver",
      href: "/fr/tarifs-des-hotels-a-chios/",
      icon: "🔥",
    },
    quizCard: {
      href: "/fr/quiz-vacances-a-chios/",
      icon: "🧭",
      liveLabel: "Code réduction live",
      title: "Découvrez Chios",
      text: "Explorez les secrets de l’île et recevez un code pour votre séjour.",
      cta: "Commencer →",
    },
  },

  announceBar: {
    href: "#vh-lastminute-title",
    icon: "🔥",
    text: "Vous voyagez à Chios cette semaine ?",
    strongText: "Découvrez les offres d’hébergement disponibles.",
  },

  intro: {
    left: {
      kicker: "Hospitalité authentique à Kampos, Chios",
      icon: "🏡",
      title: "Séjourner à Chios au Voulamandis House",
      bodyHtml:
        'Vous recherchez des <strong>chambres à Chios</strong> ou un <strong>hébergement à Chios</strong> pour un séjour calme et soigné ? Voulamandis House vous accueille dans le quartier historique de Kampos, dans un cadre verdoyant et authentique. Si vous cherchez un <strong>hôtel à Chios</strong> mais préférez une expérience plus personnelle, notre maison est une alternative chaleureuse.',
      pills: [
        "🌴 Vacances à Chios",
        "🍊 Kampos Chios",
        "🛏️ Chambres confortables",
        "💎 Excellent rapport qualité-prix",
      ],
    },
    right: {
      kicker: "Ce qui rend Voulamandis House spécial",
      title:
        "Six raisons qui rendent votre séjour plus confortable, personnel et authentique",
      cards: [
        {
          title: "🥐 Petit-déjeuner maison",
          text: "Petit-déjeuner dans le jardin avec des produits de notre ferme, disponible sur demande.",
        },
        {
          title: "🌿 Cour & tranquillité",
          text: "Une atmosphère calme, un jardin et l’esprit authentique de Kampos pour se détendre.",
        },
        {
          title: "🧭 Room Wizard",
          text: "Un assistant pratique pour trouver la chambre la plus adaptée à votre voyage.",
        },
        {
          title: "📍 Emplacement pratique",
          text: "Proche de la ville, de l’aéroport, du port et des plages, sans longs trajets.",
        },
        {
          title: "🛎️ -10% en direct",
          text: "Contact direct avec l’établissement et accès clair aux disponibilités.",
        },
        {
          title: "🍊 Secrets de Chios",
          text: "Suggestions de plages, villages, expériences et itinéraires authentiques.",
        },
      ],
    },
  },

  location: {
    ...homePageEn.location,
    kicker: "Emplacement & réservation directe",
    title: "Tout ce qu’il faut pour organiser votre séjour",
    subtitle:
      "Carte, distances, coordonnées et avantages de la réservation directe.",
    map: {
      ...homePageEn.location.map,
      buttonLabel: "Afficher la carte",
    },
    distances: [
      { label: "✈️ Aéroport", value: "3 km" },
      { label: "⛴️ Port", value: "6 km" },
      { label: "🏖️ Plage", value: "1.5 km" },
    ],
    infoCard: {
      ...homePageEn.location.infoCard,
      kicker: "Informations locales",
      title: "Voulamandis House",
      addressLines: ["Mayor Kalvokoresi 117", "Kampos, Chios 82100"],
      phoneLabel: "Tél :",
      emailLabel: "Email :",
      text: "L’établissement se trouve dans un endroit qui combine calme, accès facile et courtes distances vers les principaux points de Chios.",
      cta: {
        label: "Disponibilités",
        href: "/fr/tarifs-des-hotels-a-chios/",
        icon: "📅",
      },
    },
    discount: {
      badge: "Offre live • Recevez votre code",
      title: "Réservez directement avec nous",
      text: "Recevez un code de réduction et réservez en direct, sans commissions.",
      benefits: [
        "✔️ Meilleur tarif disponible",
        "✔️ Communication directe avec l’établissement",
        "✔️ Accès aux chambres disponibles",
      ],
      formIntro: "🎁 Recevez 10% de réduction pour votre réservation directe :",
      emailPlaceholder: "Votre email",
      submitLabel: "OBTENIR LE CODE",
      consent: "J’accepte de recevoir des offres de Voulamandis House.",
      successText: "Votre code de réduction est :",
      defaultCode: "WELCOME10",
    },
    copy: {
      kicker: "Emplacement – Kampos Chios",
      title: "Un quartier unique pour un séjour authentique à Chios",
      paragraphsHtml: [
        "<strong>Kampos de Chios</strong> est l’un des quartiers les plus caractéristiques et historiques de l’île, connu pour ses demeures, ses portails en pierre, ses vergers et ses parfums d’agrumes.",
        "Son emplacement est idéal pour combiner détente, accès facile à la ville de Chios, à l’aéroport et aux plages populaires.",
      ],
    },
  },

  roomsPreview: {
    ...homePageEn.roomsPreview,
    kicker: "Chambres & hébergement à Chios",
    title: "Chambres à Chios pour couples et familles",
    text: "Nos chambres sont nettoyées chaque jour et pensées pour un séjour confortable, calme et de qualité à Kampos, Chios.",
    primaryCta: {
      label: "Room Wizard",
      href: "/fr/chambres-a-chios/",
      icon: "✨",
    },
    secondaryCta: {
      label: "Toutes les chambres",
      href: "/fr/chambres-a-chios/",
      icon: "🗂️",
    },
    sideCard: {
      kicker: "Chambres à Chios",
      title: "Du séjour économique aux solutions familiales",
      text: "Si vous cherchez un hôtel à Chios mais préférez une hospitalité plus personnelle, Voulamandis House offre une alternative authentique à Kampos.",
    },
    rooms: [
      {
        ...homePageEn.roomsPreview.rooms[0],
        title: "Chambre double économique",
        href: "/fr/chambres-a-chios/chambres-doubles-economiques/",
        directBadge: "🎁 -10% Réduction",
        bedBadge: "🛏️ 1 lit double ou 2 lits simples",
        description:
          "Idéale pour deux personnes qui souhaitent un séjour soigné à Kampos, Chios.",
        meta: ["👥 2 personnes", "Économique", "🍊 Kampos"],
        amenities: ["❄️ A/C", "📶 Wi-Fi", "☕ Café", "🧊 Réfrigérateur"],
        cta: "Voir la chambre",
      },
      {
        ...homePageEn.roomsPreview.rooms[1],
        title: "Chambres rez-de-chaussée",
        href: "/fr/chambres-a-chios/chambres-doubles-standard/",
        directBadge: "🎁 -10% Réduction",
        bedBadge: "🛏️ Double + lit supplémentaire",
        description:
          "Un choix confortable pour couples ou petites familles, avec accès facile.",
        meta: ["👤 ×2-3", "🌿 Rez-de-chaussée", "Facile"],
        amenities: ["❄️ A/C", "📶 Wi-Fi", "☕ Café", "🧊 Réfrigérateur"],
        cta: "Voir la chambre",
      },
      {
        ...homePageEn.roomsPreview.rooms[2],
        title: "Chambres à l’étage",
        href: "/fr/chambres-a-chios/chambres-doubles-standard/",
        directBadge: "🎁 -10% Réduction",
        bedBadge: "🛏️ Double + lit supplémentaire",
        description:
          "Pour les voyageurs qui recherchent une atmosphère plus calme et classique.",
        meta: ["👤 ×2-3", "🏛️ Étage", "Calme"],
        amenities: ["❄️ A/C", "📶 Wi-Fi", "☕ Café", "🧊 Réfrigérateur"],
        cta: "Voir la chambre",
      },
      {
        ...homePageEn.roomsPreview.rooms[3],
        title: "Appartement familial",
        href: "/fr/chambres-a-chios/appartements-familiaux-de-chios/",
        directBadge: "🎁 -10% Réduction",
        bedBadge: "🛏️ Lits famille",
        description:
          "Idéal pour les familles ou petits groupes qui souhaitent plus d’espace.",
        meta: ["👤 ×4", "Espace", "🏡 Apt"],
        amenities: ["❄️ A/C", "📶 Wi-Fi", "☕ Café", "🧊 Réfrigérateur"],
        cta: "Voir l’appartement",
      },
    ],
  },

  lastMinute: {
    kicker: "Offres de dernière minute",
    icon: "⚡",
    title: "Vous voyagez à Chios cette semaine ?",
    subtitle:
      "Choisissez le nombre de voyageurs et consultez les offres disponibles pour les 7 prochains jours, avec coût final et contact direct.",
    widget: {
      title: "Offres d’hébergement à Chios pour les 7 prochains jours",
      subtitle:
        "Trouvez des chambres ou appartements disponibles en réservation directe, sans commissions. Choisissez le nombre de voyageurs et envoyez votre demande par WhatsApp ou Viber.",
      trustLine:
        "🎁 Réservation directe sans commissions – meilleur tarif disponible",
      timerLabel: "Les prix last minute se renouvellent dans :",
      guestTitle: "1. Choisissez le nombre de voyageurs",
      guestText:
        "Une fois le nombre de personnes sélectionné, les offres disponibles apparaîtront.",
      guestButtons: homePageEn.lastMinute.widget.guestButtons,
      helper:
        "Choisissez d’abord le nombre de voyageurs pour voir les chambres disponibles à Chios.",
      loadingText: "🔥 Recherche des meilleures offres disponibles…",
      resultsTitle: "2. Offres disponibles",
      resultsText: "Utilisez les filtres pour affiner rapidement vos options.",
      emptyText:
        "Choisissez d’abord 2, 3 ou 4 voyageurs pour charger les offres disponibles.",
    },
  },

  reviews: {
    ...homePageEn.reviews,
    kicker: "Avis clients",
    title: "Ce que disent nos voyageurs",
  },

  amenities: {
    kicker: "Équipements",
    icon: "🛋️",
    title: "Tout ce qu’il faut pour un séjour confortable",
    items: [
      { icon: "📶", label: "Wi-Fi / Internet" },
      { icon: "❄️", label: "Climatisation" },
      { icon: "🔥", label: "Chauffage" },
      { icon: "📺", label: "TV" },
      { icon: "🧊", label: "Réfrigérateur" },
      { icon: "☕", label: "Café / Thé" },
      { icon: "🧼", label: "Ménage quotidien" },
      { icon: "🌿", label: "Jardin & coin détente" },
      { icon: "🍖", label: "Espace BBQ" },
      { icon: "🚗", label: "Parking" },
      { icon: "🚕", label: "Transfert possible" },
      { icon: "🏡", label: "Hospitalité authentique" },
    ],
  },

  traveler: {
    ...homePageEn.traveler,
    kicker: "Découvrir Chios",
    title: "Quel type de voyageur êtes-vous ?",
    subtitle:
      "Choisissez l’expérience qui vous correspond et découvrez Chios selon votre style de voyage.",
    cards: [
      {
        ...homePageEn.traveler.cards[0],
        title: "Mer",
        text: "Eaux cristallines, plages uniques et moments de détente sur l’île.",
        href: "/fr/chios-pour-amoureux-de-plage/",
        cta: "🏖️ Explorer",
      },
      {
        ...homePageEn.traveler.cards[1],
        title: "Exploration",
        text: "Villages, nature et culture dans chaque coin de Chios.",
        href: "/fr/explorer-chios/",
        cta: "🧭 Explorer",
      },
      {
        ...homePageEn.traveler.cards[2],
        title: "Famille",
        text: "Idées et activités pour des vacances familiales inoubliables.",
        href: "/fr/vacances-en-famille-a-chios/",
        cta: "👨‍👩‍👧‍👦 Explorer",
      },
      {
        ...homePageEn.traveler.cards[3],
        title: "Gastronomie",
        text: "Saveurs authentiques, mastiha et expériences locales.",
        href: "/fr/saveurs-de-chios/",
        cta: "🍽️ Explorer",
      },
    ],
  },

  chiosGuide: {
    ...homePageEn.chiosGuide,
    kicker: "En savoir plus sur Chios",
    title: "Que voir à Chios ?",
    subtitle:
      "Nous avons rassemblé des informations utiles pour organiser plus facilement votre séjour et vos excursions.",
    cards: [
      {
        ...homePageEn.chiosGuide.cards[0],
        title: "Plages de Chios",
        text: "Découvrez nos suggestions et organisez plus facilement vos escapades en bord de mer.",
        href: "/fr/plages-de-chios/",
        ctaLabel: "Voir plus",
      },
      {
        ...homePageEn.chiosGuide.cards[1],
        title: "Villages de Chios",
        text: "Explorez des villages traditionnels et des lieux qui méritent vraiment une visite.",
        href: "/fr/villages-de-chios/",
        ctaLabel: "Voir plus",
      },
      {
        ...homePageEn.chiosGuide.cards[2],
        title: "Kampos de Chios",
        text: "Découvrez le quartier historique qui rend un séjour à Kampos si particulier.",
        href: "/fr/chios-en-grece/",
        ctaLabel: "Voir plus",
      },
      {
        ...homePageEn.chiosGuide.cards[3],
        title: "Musées de Chios",
        text: "Des étapes culturelles pour les voyageurs qui aiment l’histoire et l’identité locale.",
        href: "/fr/musees-de-chios/",
        ctaLabel: "Voir plus",
      },
      {
        ...homePageEn.chiosGuide.cards[4],
        title: "Orchidées de Chios",
        text: "Une activité spéciale pour les amoureux de la nature qui veulent découvrir une autre facette de l’île.",
        href: "/fr/orchidees-de-chios/",
        ctaLabel: "Voir plus",
      },
      {
        ...homePageEn.chiosGuide.cards[5],
        title: "Sources thermales",
        text: "Des expériences de détente et de bien-être qui complètent parfaitement vos vacances.",
        href: "/fr/sources-thermales-de-chios/",
        ctaLabel: "Voir plus",
      },
    ],
  },

  quizBar: {
    label: "DÉCOUVRIR CHIOS",
    text: "Prenez 5 minutes pour faire ce quiz, découvrir Chios et recevoir un code de réduction.",
    href: "/fr/quiz-vacances-a-chios/",
    cta: "🧭 COMMENCER L’EXPÉRIENCE →",
  },

  faq: {
    kicker: "Questions fréquentes",
    icon: "❓",
    title: "Ce qu’il faut savoir avant de réserver",
    items: [
      {
        question: "Voulamandis House est-il un hôtel ?",
        answerHtml:
          "Voulamandis House est un hébergement avec chambres et appartements à Kampos, Chios. Si vous cherchez un hôtel à Chios mais préférez une hospitalité plus calme et personnelle, c’est une alternative authentique.",
      },
      {
        question: "Où se trouve exactement Voulamandis House ?",
        answerHtml:
          "L’établissement se trouve dans le quartier historique de <strong>Kampos, Chios</strong>, à environ 7 minutes en voiture de l’aéroport et 14 minutes du port et du centre-ville.",
      },
      {
        question: "Le petit-déjeuner est-il disponible ?",
        answerHtml:
          "Oui, un petit-déjeuner maison est proposé dans le jardin, avec des produits de notre ferme. Il est optionnel et disponible sur demande.",
      },
      {
        question: "Quelles chambres conviennent aux familles ?",
        answerHtml:
          "Pour les familles jusqu’à 4 personnes, nous recommandons les <strong>appartements familiaux</strong>. Selon disponibilité, deux chambres peuvent aussi convenir aux groupes plus grands.",
      },
      {
        question: "Y a-t-il un parking ?",
        answerHtml:
          "Oui, un parking est disponible dans l’établissement, et il est également facile de se garer dans la rue calme juste à côté.",
      },
      {
        question: "Comment réserver directement ?",
        answerHtml:
          "Vous pouvez réserver directement sur notre site ou nous contacter afin de choisir la chambre la plus adaptée à votre séjour.",
      },
    ],
  },

  finalCta: {
    kicker: "Réservez votre séjour",
    icon: "✈️",
    title: "Votre voyage à Chios commence ici",
    text: "Hospitalité chaleureuse, atmosphère authentique et emplacement idéal à Kampos.",
    primaryCta: {
      label: "Réserver en direct",
      href: "/fr/tarifs-des-hotels-a-chios/",
      icon: "🛎️",
    },
    secondaryCta: {
      label: "Contact",
      href: "/fr/contactez-nous/",
      icon: "✉️",
    },
  },

  mobileSticky: {
    call: {
      label: "📞 APPELER",
      href: "tel:+306944764654",
    },
    viber: {
      label: "💬 VIBER",
      href: "viber://chat?number=%2B306944474226",
    },
  },
};

export const homePageDe: HomePageData = {
  ...homePageEn,

  seo: {
    title: "Hotel auf Chios | Voulamandis House",
    description:
      "Ruhige Zimmer und Apartments in Kampos, Chios. Übernachten Sie im Voulamandis House nahe Flughafen, Stadt, Stränden und Dörfern.",
    canonicalPath: "/de/",
    ogImage: homePageEn.seo.ogImage,
    ogImageAlt:
      "Voulamandis House in Kampos, Chios - authentische Unterkunft in einem Zitrusgarten",
  },

  hero: {
    ...homePageEn.hero,
    reviews: "143 Bewertungen",
    kicker: "KAMPOS CHIOS • VOULAMANDIS HOUSE",
    title: "Hotel und Apartments auf Chios in Kampos",
    descriptionHtml:
      'Suchen Sie ein <strong>Hotel auf Chios</strong> oder <strong>Zimmer auf Chios</strong>? <strong>Voulamandis House</strong> ist eine authentische Unterkunft in Kampos mit komfortablen Zimmern, ruhiger Umgebung und herzlicher Gastfreundschaft.',
    imageAlt: "Hotel und Apartments auf Chios in Kampos - Voulamandis House",
    primaryCta: {
      label: "Finde dein Zimmer",
      href: "/de/finde-dein-zimmer/",
      icon: "✨",
    },
    secondaryCta: {
      label: "Jetzt buchen",
      href: "/de/hotelpreise-auf-der-insel-chios/",
      icon: "🔥",
    },
    quizCard: {
      href: "/de/chios-urlaubsquiz/",
      icon: "🧭",
      liveLabel: "Live-Rabattcode",
      title: "Chios entdecken",
      text: "Lernen Sie die Geheimnisse der Insel kennen und erhalten Sie einen Code für Ihren Aufenthalt.",
      cta: "Starten →",
    },
  },

  announceBar: {
    href: "#vh-lastminute-title",
    icon: "🔥",
    text: "Reisen Sie diese Woche nach Chios?",
    strongText: "Sehen Sie verfügbare Unterkunftsangebote.",
  },

  intro: {
    left: {
      kicker: "Authentische Gastfreundschaft in Kampos, Chios",
      icon: "🏡",
      title: "Übernachten auf Chios im Voulamandis House",
      bodyHtml:
        'Suchen Sie <strong>Zimmer auf Chios</strong> oder eine ruhige, gepflegte <strong>Unterkunft auf Chios</strong>? Voulamandis House begrüßt Sie im historischen Kampos, in einer Umgebung voller natürlicher Schönheit. Wenn Sie ein <strong>Hotel auf Chios</strong> suchen, aber eine persönlichere Atmosphäre bevorzugen, ist unser Haus eine warme Alternative.',
      pills: [
        "🌴 Urlaub auf Chios",
        "🍊 Kampos Chios",
        "🛏️ Komfortable Zimmer",
        "💎 Gutes Preis-Leistungs-Verhältnis",
      ],
    },
    right: {
      kicker: "Was Voulamandis House besonders macht",
      title:
        "Sechs Gründe, die Ihren Aufenthalt komfortabler, persönlicher und authentischer machen",
      cards: [
        {
          title: "🥐 Hausgemachtes Frühstück",
          text: "Frühstück im Garten mit Produkten vom Hof, auf Anfrage verfügbar.",
        },
        {
          title: "🌿 Innenhof & Ruhe",
          text: "Ruhige Atmosphäre, Garten und echtes Kampos-Gefühl zum Entspannen.",
        },
        {
          title: "🧭 Room Wizard",
          text: "Hilfe, um das Zimmer zu finden, das am besten zu Ihrer Reise passt.",
        },
        {
          title: "📍 Praktische Lage",
          text: "Nahe Stadt, Flughafen, Hafen und Stränden – ohne unnötige Wege.",
        },
        {
          title: "🛎️ -10% Direktbuchung",
          text: "Direkter Kontakt zur Unterkunft und klarer Überblick über Verfügbarkeit.",
        },
        {
          title: "🍊 Chios-Geheimtipps",
          text: "Empfehlungen für Strände, Dörfer, Erlebnisse und echte Inselrouten.",
        },
      ],
    },
  },

  location: {
    ...homePageEn.location,
    kicker: "Lage & Direktbuchung",
    title: "Alles, was Sie vor Ihrer Reiseplanung brauchen",
    subtitle:
      "Karte, Entfernungen, Kontaktdaten und Vorteile der Direktbuchung.",
    map: {
      ...homePageEn.location.map,
      buttonLabel: "Karte anzeigen",
    },
    distances: [
      { label: "✈️ Flughafen", value: "3 km" },
      { label: "⛴️ Hafen", value: "6 km" },
      { label: "🏖️ Strand", value: "1.5 km" },
    ],
    infoCard: {
      ...homePageEn.location.infoCard,
      kicker: "Lokale Informationen",
      title: "Voulamandis House",
      addressLines: ["Mayor Kalvokoresi 117", "Kampos, Chios 82100"],
      phoneLabel: "Tel:",
      emailLabel: "Email:",
      text: "Die Unterkunft liegt an einem Ort, der Ruhe, einfache Erreichbarkeit und kurze Wege zu den wichtigsten Punkten von Chios verbindet.",
      cta: {
        label: "Verfügbarkeit",
        href: "/de/hotelpreise-auf-der-insel-chios/",
        icon: "📅",
      },
    },
    discount: {
      badge: "Live-Angebot • Code erhalten",
      title: "Direkt bei uns buchen",
      text: "Erhalten Sie einen Rabattcode und buchen Sie direkt ohne Provisionen.",
      benefits: [
        "✔️ Bester verfügbarer Preis",
        "✔️ Direkte Kommunikation mit der Unterkunft",
        "✔️ Zugang zu verfügbaren Zimmern",
      ],
      formIntro: "🎁 Erhalten Sie 10% Rabatt für Ihre Direktbuchung:",
      emailPlaceholder: "Ihre E-Mail",
      submitLabel: "CODE ERHALTEN",
      consent: "Ich möchte Angebote von Voulamandis House erhalten.",
      successText: "Ihr Rabattcode lautet:",
      defaultCode: "WELCOME10",
    },
    copy: {
      kicker: "Lage – Kampos Chios",
      title: "Eine besondere Gegend für einen authentischen Aufenthalt auf Chios",
      paragraphsHtml: [
        "<strong>Kampos auf Chios</strong> ist eine der charakteristischsten historischen Gegenden der Insel, bekannt für Herrenhäuser, Steintore, Gärten und den Duft von Zitrusfrüchten.",
        "Die Lage ist ideal für Reisende, die Entspannung mit einfachem Zugang zur Stadt Chios, zum Flughafen und zu beliebten Stränden verbinden möchten.",
      ],
    },
  },

  roomsPreview: {
    ...homePageEn.roomsPreview,
    kicker: "Zimmer & Unterkunft auf Chios",
    title: "Zimmer auf Chios für Paare und Familien",
    text: "Unsere Zimmer werden täglich gereinigt und sind für einen komfortablen, ruhigen und hochwertigen Aufenthalt in Kampos gestaltet.",
    primaryCta: {
      label: "Room Wizard",
      href: "/de/chios-zimmer/",
      icon: "✨",
    },
    secondaryCta: {
      label: "Alle Zimmer",
      href: "/de/chios-zimmer/",
      icon: "🗂️",
    },
    sideCard: {
      kicker: "Zimmer auf Chios",
      title: "Von günstigen Aufenthalten bis zu Familienlösungen",
      text: "Wenn Sie ein Hotel auf Chios suchen, aber eine persönlichere Gastfreundschaft bevorzugen, bietet Voulamandis House eine authentische Alternative in Kampos.",
    },
    rooms: [
      {
        ...homePageEn.roomsPreview.rooms[0],
        title: "Economy Doppelzimmer",
        href: "/de/zimmer-chios/economy-zimmer-auf-chios/",
        directBadge: "🎁 -10% Rabatt",
        bedBadge: "🛏️ 1 Doppelbett oder 2 Einzelbetten",
        description:
          "Ideal für zwei Gäste, die einen gepflegten Aufenthalt in Kampos suchen.",
        meta: ["👥 2 Gäste", "Economy", "🍊 Kampos"],
        amenities: ["❄️ A/C", "📶 Wi-Fi", "☕ Kaffee", "🧊 Kühlschrank"],
        cta: "Zimmer ansehen",
      },
      {
        ...homePageEn.roomsPreview.rooms[1],
        title: "Zimmer im Erdgeschoss",
        href: "/de/zimmer-chios/standard-doppelzimmer-auf-chios/",
        directBadge: "🎁 -10% Rabatt",
        bedBadge: "🛏️ Doppelbett + Zusatzbett",
        description:
          "Eine komfortable Wahl für Paare oder kleine Familien mit einfachem Zugang.",
        meta: ["👤 ×2-3", "🌿 Erdgeschoss", "Einfach"],
        amenities: ["❄️ A/C", "📶 Wi-Fi", "☕ Kaffee", "🧊 Kühlschrank"],
        cta: "Zimmer ansehen",
      },
      {
        ...homePageEn.roomsPreview.rooms[2],
        title: "Zimmer im Obergeschoss",
        href: "/de/zimmer-chios/standard-doppelzimmer-auf-chios/",
        directBadge: "🎁 -10% Rabatt",
        bedBadge: "🛏️ Doppelbett + Zusatzbett",
        description:
          "Für Gäste, die eine ruhigere Atmosphäre und klassische Gastfreundschaft suchen.",
        meta: ["👤 ×2-3", "🏛️ Obergeschoss", "Ruhig"],
        amenities: ["❄️ A/C", "📶 Wi-Fi", "☕ Kaffee", "🧊 Kühlschrank"],
        cta: "Zimmer ansehen",
      },
      {
        ...homePageEn.roomsPreview.rooms[3],
        title: "Familienapartment",
        href: "/de/zimmer-chios/familienapartments-in-chios/",
        directBadge: "🎁 -10% Rabatt",
        bedBadge: "🛏️ Familienbetten",
        description:
          "Ideal für Familien oder kleine Gruppen, die mehr Platz wünschen.",
        meta: ["👤 ×4", "Platz", "🏡 Apt"],
        amenities: ["❄️ A/C", "📶 Wi-Fi", "☕ Kaffee", "🧊 Kühlschrank"],
        cta: "Apartment ansehen",
      },
    ],
  },

  lastMinute: {
    kicker: "Last-Minute-Angebote",
    icon: "⚡",
    title: "Reisen Sie diese Woche nach Chios?",
    subtitle:
      "Wählen Sie die Anzahl der Gäste und sehen Sie verfügbare Angebote für die nächsten 7 Tage, mit Endpreis und direktem Kontakt.",
    widget: {
      title: "Unterkunftsangebote auf Chios für die nächsten 7 Tage",
      subtitle:
        "Finden Sie verfügbare Zimmer oder Apartments zur Direktbuchung ohne Provisionen. Wählen Sie die Gästezahl und senden Sie Ihre Anfrage direkt per WhatsApp oder Viber.",
      trustLine:
        "🎁 Direktbuchung ohne Provisionen – bester verfügbarer Preis",
      timerLabel: "Last-Minute-Preise aktualisieren sich in:",
      guestTitle: "1. Anzahl der Gäste wählen",
      guestText:
        "Sobald Sie die Gästezahl gewählt haben, erscheinen die verfügbaren Angebote.",
      guestButtons: homePageEn.lastMinute.widget.guestButtons,
      helper:
        "Wählen Sie zuerst die Gästezahl, um verfügbare Zimmer auf Chios zu sehen.",
      loadingText: "🔥 Suche nach den besten verfügbaren Angeboten…",
      resultsTitle: "2. Verfügbare Angebote",
      resultsText: "Nutzen Sie die Filter, um Ihre Optionen schnell einzugrenzen.",
      emptyText:
        "Wählen Sie zuerst 2, 3 oder 4 Gäste, um die verfügbaren Angebote zu laden.",
    },
  },

  reviews: {
    ...homePageEn.reviews,
    kicker: "Gästebewertungen",
    title: "Was unsere Gäste sagen",
  },

  amenities: {
    kicker: "Ausstattung",
    icon: "🛋️",
    title: "Alles, was Sie für einen komfortablen Aufenthalt brauchen",
    items: [
      { icon: "📶", label: "Wi-Fi / Internet" },
      { icon: "❄️", label: "Klimaanlage" },
      { icon: "🔥", label: "Heizung" },
      { icon: "📺", label: "TV" },
      { icon: "🧊", label: "Kühlschrank" },
      { icon: "☕", label: "Kaffee / Tee" },
      { icon: "🧼", label: "Tägliche Reinigung" },
      { icon: "🌿", label: "Garten & Sitzbereich" },
      { icon: "🍖", label: "BBQ-Bereich" },
      { icon: "🚗", label: "Parkplatz" },
      { icon: "🚕", label: "Transfer möglich" },
      { icon: "🏡", label: "Authentische Gastfreundschaft" },
    ],
  },

  traveler: {
    ...homePageEn.traveler,
    kicker: "Chios entdecken",
    title: "Welcher Reisetyp sind Sie?",
    subtitle:
      "Wählen Sie das Erlebnis, das zu Ihnen passt, und entdecken Sie Chios nach Ihrem Reisestil.",
    cards: [
      {
        ...homePageEn.traveler.cards[0],
        title: "Meer",
        text: "Kristallklares Wasser, besondere Strände und Entspannung auf der Insel.",
        href: "/de/chios-fuer-strandliebhaber/",
        cta: "🏖️ Entdecken",
      },
      {
        ...homePageEn.traveler.cards[1],
        title: "Erkundung",
        text: "Dörfer, Natur und Kultur in jeder Ecke von Chios.",
        href: "/de/chios-entdecken/",
        cta: "🧭 Entdecken",
      },
      {
        ...homePageEn.traveler.cards[2],
        title: "Familie",
        text: "Ideen und Aktivitäten für unvergessliche Familienferien.",
        href: "/de/familienurlaub-auf-chios/",
        cta: "👨‍👩‍👧‍👦 Entdecken",
      },
      {
        ...homePageEn.traveler.cards[3],
        title: "Kulinarik",
        text: "Authentische Aromen, Mastix und lokale Erlebnisse.",
        href: "/de/chios-fuer-geniesser/",
        cta: "🍽️ Entdecken",
      },
    ],
  },

  chiosGuide: {
    ...homePageEn.chiosGuide,
    kicker: "Mehr über Chios",
    title: "Was kann man auf Chios sehen?",
    subtitle:
      "Wir haben nützliche Informationen gesammelt, damit Sie Ihren Aufenthalt und Tagesausflüge leichter planen können.",
    cards: [
      {
        ...homePageEn.chiosGuide.cards[0],
        title: "Strände von Chios",
        text: "Entdecken Sie Empfehlungen und planen Sie Ihre Ausflüge ans Meer leichter.",
        href: "/de/straende-chios/",
        ctaLabel: "Mehr ansehen",
      },
      {
        ...homePageEn.chiosGuide.cards[1],
        title: "Dörfer von Chios",
        text: "Entdecken Sie traditionelle Orte und sehenswerte Stationen auf der Insel.",
        href: "/de/doerfer-chios/",
        ctaLabel: "Mehr ansehen",
      },
      {
        ...homePageEn.chiosGuide.cards[2],
        title: "Kampos auf Chios",
        text: "Erfahren Sie mehr über die historische Gegend, die einen Aufenthalt in Kampos besonders macht.",
        href: "/de/chios-insel/",
        ctaLabel: "Mehr ansehen",
      },
      {
        ...homePageEn.chiosGuide.cards[3],
        title: "Museen von Chios",
        text: "Kulturelle Stationen für Reisende, die Geschichte und lokale Identität lieben.",
        href: "/de/museen-chios/",
        ctaLabel: "Mehr ansehen",
      },
      {
        ...homePageEn.chiosGuide.cards[4],
        title: "Orchideen von Chios",
        text: "Ein besonderes Naturerlebnis für Reisende, die eine andere Seite der Insel entdecken möchten.",
        href: "/de/orchideen-auf-chios/",
        ctaLabel: "Mehr ansehen",
      },
      {
        ...homePageEn.chiosGuide.cards[5],
        title: "Thermalquellen",
        text: "Entspannung und Wellness-Erlebnisse, die Ihren Urlaub ideal ergänzen.",
        href: "/de/thermalquellen-auf-chios/",
        ctaLabel: "Mehr ansehen",
      },
    ],
  },

  quizBar: {
    label: "CHIOS ENTDECKEN",
    text: "Nehmen Sie sich 5 Minuten Zeit, machen Sie dieses Quiz und entdecken Sie die Geheimnisse von Chios.",
    href: "/de/chios-urlaubsquiz/",
    cta: "🧭 ERLEBNIS STARTEN →",
  },

  faq: {
    kicker: "Häufige Fragen",
    icon: "❓",
    title: "Was Sie vor der Buchung wissen sollten",
    items: [
      {
        question: "Ist Voulamandis House ein Hotel?",
        answerHtml:
          "Voulamandis House ist eine Unterkunft mit Zimmern und Apartments in Kampos, Chios. Wenn Sie ein Hotel auf Chios suchen, aber eine ruhigere und persönlichere Gastfreundschaft bevorzugen, ist es eine authentische Alternative.",
      },
      {
        question: "Wo genau liegt Voulamandis House?",
        answerHtml:
          "Die Unterkunft liegt im historischen <strong>Kampos, Chios</strong>, etwa 7 Autominuten vom Flughafen und etwa 14 Minuten vom Hafen und Stadtzentrum entfernt.",
      },
      {
        question: "Gibt es Frühstück?",
        answerHtml:
          "Ja, hausgemachtes Frühstück wird im Garten angeboten, mit Produkten von unserem Hof. Es ist optional und auf Anfrage verfügbar.",
      },
      {
        question: "Welche Zimmer eignen sich für Familien?",
        answerHtml:
          "Für Familien bis zu 4 Personen empfehlen wir die <strong>Familienapartments</strong>. Je nach Verfügbarkeit kann auch eine Kombination aus zwei Zimmern passen.",
      },
      {
        question: "Gibt es Parkplätze?",
        answerHtml:
          "Ja, Parkplätze stehen innerhalb der Unterkunft zur Verfügung. Außerdem gibt es einfache Parkmöglichkeiten an der ruhigen Straße direkt davor.",
      },
      {
        question: "Wie kann ich direkt buchen?",
        answerHtml:
          "Sie können direkt über unsere Website buchen oder uns kontaktieren, damit wir gemeinsam das passende Zimmer für Ihren Aufenthalt finden.",
      },
    ],
  },

  finalCta: {
    kicker: "Aufenthalt buchen",
    icon: "✈️",
    title: "Ihre Reise nach Chios beginnt hier",
    text: "Herzliche Gastfreundschaft, authentische Atmosphäre und eine ideale Lage in Kampos.",
    primaryCta: {
      label: "Direkt buchen",
      href: "/de/hotelpreise-auf-der-insel-chios/",
      icon: "🛎️",
    },
    secondaryCta: {
      label: "Kontakt",
      href: "/de/kontaktieren-voulamandis-house/",
      icon: "✉️",
    },
  },

  mobileSticky: {
    call: {
      label: "📞 ANRUFEN",
      href: "tel:+306944764654",
    },
    viber: {
      label: "💬 VIBER",
      href: "viber://chat?number=%2B306944474226",
    },
  },
};
export const homePageIt: HomePageData = {
  ...homePageEn,

  seo: {
    title: "Hotel a Chios | Voulamandis House",
    description:
      "Camere e appartamenti tranquilli a Kampos, Chios. Soggiorna al Voulamandis House, vicino all’aeroporto, alla città, alle spiagge e ai villaggi dell’isola.",
    canonicalPath: "/it/",
    ogImage: homePageEn.seo.ogImage,
    ogImageAlt:
      "Voulamandis House a Kampos, Chios - soggiorno autentico in un agrumeto",
  },

  hero: {
    ...homePageEn.hero,
    reviews: "143 recensioni",
    kicker: "KAMPOS CHIOS • VOULAMANDIS HOUSE",
    title: "Hotel e appartamenti a Chios, nel cuore di Kampos",
    descriptionHtml:
      'Cerchi un <strong>hotel a Chios</strong> o <strong>camere a Chios</strong>? <strong>Voulamandis House</strong> ti accoglie a Kampos con camere confortevoli, atmosfera tranquilla e ospitalità autentica.',
    imageAlt: "Hotel e appartamenti a Chios - Voulamandis House a Kampos",
    primaryCta: {
      label: "Trova la tua camera",
      href: "/it/trova-la-tua-camera/",
      icon: "✨",
    },
    secondaryCta: {
      label: "Prenota ora",
      href: "/it/prezzi-hotel-chios/",
      icon: "🔥",
    },
    quizCard: {
      href: "/it/quiz-vacanze-a-chios/",
      icon: "🧭",
      liveLabel: "Codice sconto live",
      title: "Scopri Chios",
      text: "Esplora i segreti dell’isola e ricevi un codice per il tuo soggiorno.",
      cta: "Inizia →",
    },
  },

  announceBar: {
    href: "#vh-lastminute-title",
    icon: "🔥",
    text: "Viaggi a Chios questa settimana?",
    strongText: "Scopri le offerte disponibili per il tuo soggiorno.",
  },

  intro: {
    left: {
      kicker: "Ospitalità autentica a Kampos, Chios",
      icon: "🏡",
      title: "Soggiornare a Chios al Voulamandis House",
      bodyHtml:
        'Se cerchi <strong>camere a Chios</strong> o un <strong>alloggio a Chios</strong> tranquillo e curato, Voulamandis House ti accoglie nello storico Kampos, in un ambiente verde e autentico. Se desideri un <strong>hotel a Chios</strong> ma preferisci un’esperienza più personale, la nostra struttura è un’alternativa calorosa e genuina.',
      pills: [
        "🌴 Vacanze a Chios",
        "🍊 Kampos Chios",
        "🛏️ Camere confortevoli",
        "💎 Ottimo rapporto qualità-prezzo",
      ],
    },
    right: {
      kicker: "Cosa rende speciale Voulamandis House",
      title:
        "Sei motivi che rendono il tuo soggiorno più comodo, personale e autentico",
      cards: [
        {
          title: "🥐 Colazione fatta in casa",
          text: "Colazione in giardino con prodotti della nostra fattoria, disponibile su richiesta.",
        },
        {
          title: "🌿 Cortile e tranquillità",
          text: "Atmosfera rilassante, giardino e il carattere autentico di Kampos.",
        },
        {
          title: "🧭 Room Wizard",
          text: "Un assistente pratico per trovare la camera più adatta al tuo viaggio.",
        },
        {
          title: "📍 Posizione comoda",
          text: "Vicino a città, aeroporto, porto e spiagge, senza lunghi spostamenti.",
        },
        {
          title: "🛎️ -10% diretto",
          text: "Contatto diretto con la struttura e disponibilità chiare.",
        },
        {
          title: "🍊 Segreti di Chios",
          text: "Consigli su spiagge, villaggi, esperienze e itinerari autentici.",
        },
      ],
    },
  },

  location: {
    ...homePageEn.location,
    kicker: "Posizione e prenotazione diretta",
    title: "Tutto ciò che serve per organizzare il soggiorno",
    subtitle:
      "Mappa, distanze, contatti e vantaggi della prenotazione diretta.",
    map: {
      ...homePageEn.location.map,
      buttonLabel: "Mostra la mappa",
    },
    distances: [
      { label: "✈️ Aeroporto", value: "3 km" },
      { label: "⛴️ Porto", value: "6 km" },
      { label: "🏖️ Spiaggia", value: "1.5 km" },
    ],
    infoCard: {
      ...homePageEn.location.infoCard,
      kicker: "Informazioni locali",
      title: "Voulamandis House",
      addressLines: ["Mayor Kalvokoresi 117", "Kampos, Chios 82100"],
      phoneLabel: "Tel:",
      emailLabel: "Email:",
      text: "La struttura si trova in una zona che unisce tranquillità, accesso facile e brevi distanze dai punti principali di Chios.",
      cta: {
        label: "Disponibilità",
        href: "/it/prezzi-hotel-chios/",
        icon: "📅",
      },
    },
    discount: {
      badge: "Offerta live • Ricevi il codice",
      title: "Prenota direttamente con noi",
      text: "Ricevi un codice sconto e prenota direttamente, senza commissioni.",
      benefits: [
        "✔️ Miglior tariffa disponibile",
        "✔️ Comunicazione diretta con la struttura",
        "✔️ Accesso alle camere disponibili",
      ],
      formIntro: "🎁 Ricevi il 10% di sconto per la prenotazione diretta:",
      emailPlaceholder: "La tua email",
      submitLabel: "OTTIENI IL CODICE",
      consent: "Accetto di ricevere offerte da Voulamandis House.",
      successText: "Il tuo codice sconto è:",
      defaultCode: "WELCOME10",
    },
    copy: {
      kicker: "Posizione – Kampos Chios",
      title: "Un quartiere speciale per un soggiorno autentico a Chios",
      paragraphsHtml: [
        "<strong>Kampos di Chios</strong> è una delle zone storiche più caratteristiche dell’isola, conosciuta per le dimore signorili, i portali in pietra, i giardini e il profumo degli agrumi.",
        "La posizione è ideale per chi desidera combinare relax, accesso facile alla città di Chios, all’aeroporto e alle spiagge più amate.",
      ],
    },
  },

  roomsPreview: {
    ...homePageEn.roomsPreview,
    kicker: "Camere e alloggi a Chios",
    title: "Camere a Chios per coppie e famiglie",
    text: "Le nostre camere vengono pulite ogni giorno e sono pensate per un soggiorno comodo, tranquillo e curato a Kampos, Chios.",
    primaryCta: {
      label: "Room Wizard",
      href: "/it/camere-a-chios/",
      icon: "✨",
    },
    secondaryCta: {
      label: "Tutte le camere",
      href: "/it/camere-a-chios/",
      icon: "🗂️",
    },
    sideCard: {
      kicker: "Camere a Chios",
      title: "Dal soggiorno economico alle soluzioni per famiglie",
      text: "Se cerchi un hotel a Chios ma preferisci un’accoglienza più personale, Voulamandis House offre un’alternativa autentica a Kampos.",
    },
    rooms: [
      {
        ...homePageEn.roomsPreview.rooms[0],
        title: "Camera doppia economy",
        href: "/it/stanze-a-chios/camera-doppia-economica-chios/",
        directBadge: "🎁 -10% Sconto",
        bedBadge: "🛏️ 1 letto matrimoniale o 2 letti singoli",
        description:
          "Ideale per due persone che desiderano un soggiorno curato a Kampos.",
        meta: ["👥 2 ospiti", "Economy", "🍊 Kampos"],
        amenities: ["❄️ A/C", "📶 Wi-Fi", "☕ Caffè", "🧊 Frigo"],
        cta: "Vedi camera",
      },
      {
        ...homePageEn.roomsPreview.rooms[1],
        title: "Camere al piano terra",
        href: "/it/stanze-a-chios/camere-doppie-standard-chios/",
        directBadge: "🎁 -10% Sconto",
        bedBadge: "🛏️ Matrimoniale + letto extra",
        description:
          "Una scelta comoda per coppie o piccole famiglie, con accesso facile.",
        meta: ["👤 ×2-3", "🌿 Piano terra", "Facile"],
        amenities: ["❄️ A/C", "📶 Wi-Fi", "☕ Caffè", "🧊 Frigo"],
        cta: "Vedi camera",
      },
      {
        ...homePageEn.roomsPreview.rooms[2],
        title: "Camere al piano superiore",
        href: "/it/stanze-a-chios/camere-doppie-standard-chios/",
        directBadge: "🎁 -10% Sconto",
        bedBadge: "🛏️ Matrimoniale + letto extra",
        description:
          "Per chi cerca un’atmosfera più tranquilla e classica.",
        meta: ["👤 ×2-3", "🏛️ Piano superiore", "Tranquillo"],
        amenities: ["❄️ A/C", "📶 Wi-Fi", "☕ Caffè", "🧊 Frigo"],
        cta: "Vedi camera",
      },
      {
        ...homePageEn.roomsPreview.rooms[3],
        title: "Appartamento familiare",
        href: "/it/stanze-a-chios/appartamenti-familiari-a-chios/",
        directBadge: "🎁 -10% Sconto",
        bedBadge: "🛏️ Letti famiglia",
        description:
          "Ideale per famiglie o piccoli gruppi che desiderano più spazio.",
        meta: ["👤 ×4", "Spazio", "🏡 Apt"],
        amenities: ["❄️ A/C", "📶 Wi-Fi", "☕ Caffè", "🧊 Frigo"],
        cta: "Vedi appartamento",
      },
    ],
  },

  lastMinute: {
    kicker: "Offerte last minute",
    icon: "⚡",
    title: "Viaggi a Chios questa settimana?",
    subtitle:
      "Scegli il numero di ospiti e guarda le offerte disponibili per i prossimi 7 giorni, con prezzo finale e contatto diretto.",
    widget: {
      title: "Offerte di alloggio a Chios per i prossimi 7 giorni",
      subtitle:
        "Trova camere o appartamenti disponibili con prenotazione diretta, senza commissioni. Scegli il numero di ospiti e invia la richiesta su WhatsApp o Viber.",
      trustLine:
        "🎁 Prenotazione diretta senza commissioni – miglior tariffa disponibile",
      timerLabel: "I prezzi last minute si aggiornano tra:",
      guestTitle: "1. Scegli il numero di ospiti",
      guestText:
        "Dopo aver selezionato il numero di persone, vedrai le offerte disponibili.",
      guestButtons: homePageEn.lastMinute.widget.guestButtons,
      helper:
        "Scegli prima il numero di ospiti per vedere le camere disponibili a Chios.",
      loadingText: "🔥 Ricerca delle migliori offerte disponibili…",
      resultsTitle: "2. Offerte disponibili",
      resultsText: "Usa i filtri per restringere rapidamente le opzioni.",
      emptyText:
        "Scegli prima 2, 3 o 4 ospiti per caricare le offerte disponibili.",
    },
  },

  reviews: {
    ...homePageEn.reviews,
    kicker: "Recensioni ospiti",
    title: "Cosa dicono i nostri ospiti",
  },

  amenities: {
    kicker: "Servizi",
    icon: "🛋️",
    title: "Tutto ciò che serve per un soggiorno confortevole",
    items: [
      { icon: "📶", label: "Wi-Fi / Internet" },
      { icon: "❄️", label: "Aria condizionata" },
      { icon: "🔥", label: "Riscaldamento" },
      { icon: "📺", label: "TV" },
      { icon: "🧊", label: "Frigorifero" },
      { icon: "☕", label: "Caffè / Tè" },
      { icon: "🧼", label: "Pulizia giornaliera" },
      { icon: "🌿", label: "Giardino e relax" },
      { icon: "🍖", label: "Area BBQ" },
      { icon: "🚗", label: "Parcheggio" },
      { icon: "🚕", label: "Transfer possibile" },
      { icon: "🏡", label: "Ospitalità autentica" },
    ],
  },

  traveler: {
    ...homePageEn.traveler,
    kicker: "Scoprire Chios",
    title: "Che tipo di viaggiatore sei?",
    subtitle:
      "Scegli l’esperienza più adatta a te e scopri Chios secondo il tuo stile di viaggio.",
    cards: [
      {
        ...homePageEn.traveler.cards[0],
        title: "Mare",
        text: "Acque cristalline, spiagge uniche e momenti di relax sull’isola.",
        href: "/it/chios-per-amanti-del-mare/",
        cta: "🏖️ Esplora",
      },
      {
        ...homePageEn.traveler.cards[1],
        title: "Esplorazione",
        text: "Villaggi, natura e cultura in ogni angolo di Chios.",
        href: "/it/esplora-chios/",
        cta: "🧭 Esplora",
      },
      {
        ...homePageEn.traveler.cards[2],
        title: "Famiglia",
        text: "Idee e attività per vacanze in famiglia indimenticabili.",
        href: "/it/vacanze-in-famiglia-a-chios/",
        cta: "👨‍👩‍👧‍👦 Esplora",
      },
      {
        ...homePageEn.traveler.cards[3],
        title: "Gastronomia",
        text: "Sapori autentici, mastice e vere esperienze locali.",
        href: "/it/sapori-di-chios/",
        cta: "🍽️ Esplora",
      },
    ],
  },

  chiosGuide: {
    ...homePageEn.chiosGuide,
    kicker: "Scopri di più su Chios",
    title: "Cosa vedere a Chios?",
    subtitle:
      "Abbiamo raccolto informazioni utili per organizzare più facilmente il tuo soggiorno e le tue escursioni.",
    cards: [
      {
        ...homePageEn.chiosGuide.cards[0],
        title: "Spiagge di Chios",
        text: "Scopri suggerimenti utili e organizza più facilmente le tue giornate al mare.",
        href: "/it/spiagge-chios/",
        ctaLabel: "Vedi di più",
      },
      {
        ...homePageEn.chiosGuide.cards[1],
        title: "Villaggi di Chios",
        text: "Esplora borghi tradizionali e luoghi che vale davvero la pena visitare.",
        href: "/it/villaggi-chios/",
        ctaLabel: "Vedi di più",
      },
      {
        ...homePageEn.chiosGuide.cards[2],
        title: "Kampos di Chios",
        text: "Scopri la zona storica che rende speciale il soggiorno a Kampos.",
        href: "/it/chios-lisola-in-grecia/",
        ctaLabel: "Vedi di più",
      },
      {
        ...homePageEn.chiosGuide.cards[3],
        title: "Musei di Chios",
        text: "Tappe culturali per chi ama la storia e l’identità locale.",
        href: "/it/musei-chios/",
        ctaLabel: "Vedi di più",
      },
      {
        ...homePageEn.chiosGuide.cards[4],
        title: "Orchidee di Chios",
        text: "Un’attività speciale per gli amanti della natura che vogliono scoprire un lato diverso dell’isola.",
        href: "/it/orchidee-di-chios/",
        ctaLabel: "Vedi di più",
      },
      {
        ...homePageEn.chiosGuide.cards[5],
        title: "Terme di Chios",
        text: "Esperienze di relax e benessere che completano perfettamente la vacanza.",
        href: "/it/terme-di-chios/",
        ctaLabel: "Vedi di più",
      },
    ],
  },

  quizBar: {
    label: "SCOPRI CHIOS",
    text: "Dedica 5 minuti a questo quiz, scopri Chios e ricevi un codice sconto.",
    href: "/it/quiz-vacanze-a-chios/",
    cta: "🧭 INIZIA L’ESPERIENZA →",
  },

  faq: {
    kicker: "Domande frequenti",
    icon: "❓",
    title: "Cosa sapere prima di prenotare",
    items: [
      {
        question: "Voulamandis House è un hotel?",
        answerHtml:
          "Voulamandis House è una struttura con camere e appartamenti a Kampos, Chios. Se cerchi un hotel a Chios ma preferisci un’ospitalità più tranquilla e personale, è un’alternativa autentica.",
      },
      {
        question: "Dove si trova esattamente Voulamandis House?",
        answerHtml:
          "La struttura si trova nello storico <strong>Kampos, Chios</strong>, a circa 7 minuti in auto dall’aeroporto e 14 minuti dal porto e dal centro città.",
      },
      {
        question: "La colazione è disponibile?",
        answerHtml:
          "Sì, la colazione fatta in casa viene servita in giardino con prodotti della nostra fattoria. È opzionale e disponibile su richiesta.",
      },
      {
        question: "Quali camere sono adatte alle famiglie?",
        answerHtml:
          "Per famiglie fino a 4 persone consigliamo gli <strong>appartamenti familiari</strong>. In base alla disponibilità, anche due camere possono essere adatte a gruppi più grandi.",
      },
      {
        question: "C’è parcheggio?",
        answerHtml:
          "Sì, è disponibile un parcheggio nella struttura ed è facile parcheggiare anche nella strada tranquilla accanto.",
      },
      {
        question: "Come posso prenotare direttamente?",
        answerHtml:
          "Puoi prenotare direttamente dal sito o contattarci per scegliere insieme la camera più adatta al tuo soggiorno.",
      },
    ],
  },

  finalCta: {
    kicker: "Prenota il tuo soggiorno",
    icon: "✈️",
    title: "Il tuo viaggio a Chios inizia qui",
    text: "Ospitalità calorosa, atmosfera autentica e posizione ideale a Kampos.",
    primaryCta: {
      label: "Prenota diretto",
      href: "/it/prezzi-hotel-chios/",
      icon: "🛎️",
    },
    secondaryCta: {
      label: "Contatto",
      href: "/it/contattaci-voulamandis-house/",
      icon: "✉️",
    },
  },

  mobileSticky: {
    call: {
      label: "📞 CHIAMA",
      href: "tel:+306944764654",
    },
    viber: {
      label: "💬 VIBER",
      href: "viber://chat?number=%2B306944474226",
    },
  },
};

export const homePageEs: HomePageData = {
  ...homePageEn,

  seo: {
    title: "Hotel en Chios | Voulamandis House",
    description:
      "Habitaciones y apartamentos tranquilos en Kampos, Chios. Alójate en Voulamandis House, cerca del aeropuerto, la ciudad, las playas y los pueblos de la isla.",
    canonicalPath: "/es/",
    ogImage: homePageEn.seo.ogImage,
    ogImageAlt:
      "Voulamandis House en Kampos, Chios - alojamiento auténtico entre cítricos",
  },

  hero: {
    ...homePageEn.hero,
    reviews: "143 reseñas",
    kicker: "KAMPOS CHIOS • VOULAMANDIS HOUSE",
    title: "Hotel y apartamentos en Chios, en Kampos",
    descriptionHtml:
      '¿Buscas un <strong>hotel en Chios</strong> o <strong>habitaciones en Chios</strong>? <strong>Voulamandis House</strong> te recibe en Kampos con habitaciones cómodas, ambiente tranquilo y hospitalidad auténtica.',
    imageAlt: "Hotel y apartamentos en Chios - Voulamandis House en Kampos",
    primaryCta: {
      label: "Encuentra tu habitación",
      href: "/es/encuentra-tu-habitacion/",
      icon: "✨",
    },
    secondaryCta: {
      label: "Reservar",
      href: "/es/los-mejores-precios-de-hotel-en-la-isla-chios/",
      icon: "🔥",
    },
    quizCard: {
      href: "/es/quiz-vacaciones-en-quios/",
      icon: "🧭",
      liveLabel: "Código descuento live",
      title: "Descubre Chios",
      text: "Explora los secretos de la isla y recibe un código para tu estancia.",
      cta: "Empezar →",
    },
  },

  announceBar: {
    href: "#vh-lastminute-title",
    icon: "🔥",
    text: "¿Viajas a Chios esta semana?",
    strongText: "Mira las ofertas de alojamiento disponibles.",
  },

  intro: {
    left: {
      kicker: "Hospitalidad auténtica en Kampos, Chios",
      icon: "🏡",
      title: "Alojarse en Chios en Voulamandis House",
      bodyHtml:
        'Si buscas <strong>habitaciones en Chios</strong> o un <strong>alojamiento en Chios</strong> tranquilo y cuidado, Voulamandis House te espera en el histórico Kampos, en un entorno verde y auténtico. Si buscas un <strong>hotel en Chios</strong> pero prefieres una experiencia más personal, nuestra casa es una alternativa cálida y genuina.',
      pills: [
        "🌴 Vacaciones en Chios",
        "🍊 Kampos Chios",
        "🛏️ Habitaciones cómodas",
        "💎 Buena relación calidad-precio",
      ],
    },
    right: {
      kicker: "Qué hace especial a Voulamandis House",
      title:
        "Seis razones que hacen tu estancia más cómoda, personal y auténtica",
      cards: [
        {
          title: "🥐 Desayuno casero",
          text: "Desayuno en el jardín con productos de nuestra finca, disponible bajo petición.",
        },
        {
          title: "🌿 Patio y tranquilidad",
          text: "Ambiente tranquilo, jardín y el carácter auténtico de Kampos.",
        },
        {
          title: "🧭 Room Wizard",
          text: "Un asistente práctico para encontrar la habitación ideal para tu viaje.",
        },
        {
          title: "📍 Ubicación práctica",
          text: "Cerca de la ciudad, aeropuerto, puerto y playas, sin largos desplazamientos.",
        },
        {
          title: "🛎️ -10% directo",
          text: "Contacto directo con el alojamiento y disponibilidad clara.",
        },
        {
          title: "🍊 Secretos de Chios",
          text: "Consejos sobre playas, pueblos, experiencias e itinerarios auténticos.",
        },
      ],
    },
  },

  location: {
    ...homePageEn.location,
    kicker: "Ubicación y reserva directa",
    title: "Todo lo necesario para organizar tu estancia",
    subtitle:
      "Mapa, distancias, datos de contacto y ventajas de reservar directamente.",
    map: {
      ...homePageEn.location.map,
      buttonLabel: "Mostrar mapa",
    },
    distances: [
      { label: "✈️ Aeropuerto", value: "3 km" },
      { label: "⛴️ Puerto", value: "6 km" },
      { label: "🏖️ Playa", value: "1.5 km" },
    ],
    infoCard: {
      ...homePageEn.location.infoCard,
      kicker: "Información local",
      title: "Voulamandis House",
      addressLines: ["Mayor Kalvokoresi 117", "Kampos, Chios 82100"],
      phoneLabel: "Tel:",
      emailLabel: "Email:",
      text: "El alojamiento se encuentra en una zona que combina tranquilidad, acceso fácil y distancias cortas a los puntos principales de Chios.",
      cta: {
        label: "Disponibilidad",
        href: "/es/los-mejores-precios-de-hotel-en-la-isla-chios/",
        icon: "📅",
      },
    },
    discount: {
      badge: "Oferta live • Recibe tu código",
      title: "Reserva directamente con nosotros",
      text: "Recibe un código de descuento y reserva directamente, sin comisiones.",
      benefits: [
        "✔️ Mejor tarifa disponible",
        "✔️ Comunicación directa con el alojamiento",
        "✔️ Acceso a habitaciones disponibles",
      ],
      formIntro: "🎁 Recibe un 10% de descuento para tu reserva directa:",
      emailPlaceholder: "Tu email",
      submitLabel: "OBTENER CÓDIGO",
      consent: "Acepto recibir ofertas de Voulamandis House.",
      successText: "Tu código de descuento es:",
      defaultCode: "WELCOME10",
    },
    copy: {
      kicker: "Ubicación – Kampos Chios",
      title: "Una zona especial para una estancia auténtica en Chios",
      paragraphsHtml: [
        "<strong>Kampos de Chios</strong> es una de las zonas históricas más características de la isla, conocida por sus mansiones, portales de piedra, jardines y aromas cítricos.",
        "Su ubicación es ideal para combinar descanso, acceso fácil a la ciudad de Chios, al aeropuerto y a playas populares.",
      ],
    },
  },

  roomsPreview: {
    ...homePageEn.roomsPreview,
    kicker: "Habitaciones y alojamiento en Chios",
    title: "Habitaciones en Chios para parejas y familias",
    text: "Nuestras habitaciones se limpian cada día y están pensadas para una estancia cómoda, tranquila y cuidada en Kampos, Chios.",
    primaryCta: {
      label: "Room Wizard",
      href: "/es/habitaciones-en-chios/",
      icon: "✨",
    },
    secondaryCta: {
      label: "Todas las habitaciones",
      href: "/es/habitaciones-en-chios/",
      icon: "🗂️",
    },
    sideCard: {
      kicker: "Habitaciones en Chios",
      title: "Desde opciones económicas hasta soluciones familiares",
      text: "Si buscas un hotel en Chios pero prefieres una hospitalidad más personal, Voulamandis House ofrece una alternativa auténtica en Kampos.",
    },
    rooms: [
      {
        ...homePageEn.roomsPreview.rooms[0],
        title: "Habitación doble económica",
        href: "/es/habitaciones-en-chios/economicas-habitaciones-en-chios/",
        directBadge: "🎁 -10% Descuento",
        bedBadge: "🛏️ 1 cama doble o 2 camas individuales",
        description:
          "Ideal para dos personas que desean una estancia cuidada en Kampos.",
        meta: ["👥 2 huéspedes", "Económica", "🍊 Kampos"],
        amenities: ["❄️ A/C", "📶 Wi-Fi", "☕ Café", "🧊 Nevera"],
        cta: "Ver habitación",
      },
      {
        ...homePageEn.roomsPreview.rooms[1],
        title: "Habitaciones en planta baja",
        href: "/es/habitaciones-en-chios/habitaciones-dobles-estandar/",
        directBadge: "🎁 -10% Descuento",
        bedBadge: "🛏️ Doble + cama extra",
        description:
          "Una opción cómoda para parejas o familias pequeñas, con acceso fácil.",
        meta: ["👤 ×2-3", "🌿 Planta baja", "Fácil"],
        amenities: ["❄️ A/C", "📶 Wi-Fi", "☕ Café", "🧊 Nevera"],
        cta: "Ver habitación",
      },
      {
        ...homePageEn.roomsPreview.rooms[2],
        title: "Habitaciones en planta superior",
        href: "/es/habitaciones-en-chios/habitaciones-dobles-estandar/",
        directBadge: "🎁 -10% Descuento",
        bedBadge: "🛏️ Doble + cama extra",
        description:
          "Para viajeros que buscan un ambiente más tranquilo y clásico.",
        meta: ["👤 ×2-3", "🏛️ Planta superior", "Tranquilo"],
        amenities: ["❄️ A/C", "📶 Wi-Fi", "☕ Café", "🧊 Nevera"],
        cta: "Ver habitación",
      },
      {
        ...homePageEn.roomsPreview.rooms[3],
        title: "Apartamento familiar",
        href: "/es/habitaciones-en-chios/apartamentos-familiares-en-chios/",
        directBadge: "🎁 -10% Descuento",
        bedBadge: "🛏️ Camas familiares",
        description:
          "Ideal para familias o grupos pequeños que desean más espacio.",
        meta: ["👤 ×4", "Espacio", "🏡 Apt"],
        amenities: ["❄️ A/C", "📶 Wi-Fi", "☕ Café", "🧊 Nevera"],
        cta: "Ver apartamento",
      },
    ],
  },

  lastMinute: {
    kicker: "Ofertas de última hora",
    icon: "⚡",
    title: "¿Viajas a Chios esta semana?",
    subtitle:
      "Elige el número de huéspedes y consulta las ofertas disponibles para los próximos 7 días, con precio final y contacto directo.",
    widget: {
      title: "Ofertas de alojamiento en Chios para los próximos 7 días",
      subtitle:
        "Encuentra habitaciones o apartamentos disponibles con reserva directa, sin comisiones. Elige el número de huéspedes y envía tu solicitud por WhatsApp o Viber.",
      trustLine:
        "🎁 Reserva directa sin comisiones – mejor tarifa disponible",
      timerLabel: "Los precios last minute se actualizan en:",
      guestTitle: "1. Elige el número de huéspedes",
      guestText:
        "Cuando selecciones el número de personas, aparecerán las ofertas disponibles.",
      guestButtons: homePageEn.lastMinute.widget.guestButtons,
      helper:
        "Elige primero el número de huéspedes para ver habitaciones disponibles en Chios.",
      loadingText: "🔥 Buscando las mejores ofertas disponibles…",
      resultsTitle: "2. Ofertas disponibles",
      resultsText: "Usa los filtros para encontrar rápidamente tu mejor opción.",
      emptyText:
        "Elige primero 2, 3 o 4 huéspedes para cargar las ofertas disponibles.",
    },
  },

  reviews: {
    ...homePageEn.reviews,
    kicker: "Opiniones de huéspedes",
    title: "Qué dicen nuestros huéspedes",
  },

  amenities: {
    kicker: "Servicios",
    icon: "🛋️",
    title: "Todo lo necesario para una estancia cómoda",
    items: [
      { icon: "📶", label: "Wi-Fi / Internet" },
      { icon: "❄️", label: "Aire acondicionado" },
      { icon: "🔥", label: "Calefacción" },
      { icon: "📺", label: "TV" },
      { icon: "🧊", label: "Nevera" },
      { icon: "☕", label: "Café / Té" },
      { icon: "🧼", label: "Limpieza diaria" },
      { icon: "🌿", label: "Jardín y zona relax" },
      { icon: "🍖", label: "Zona BBQ" },
      { icon: "🚗", label: "Parking" },
      { icon: "🚕", label: "Transfer posible" },
      { icon: "🏡", label: "Hospitalidad auténtica" },
    ],
  },

  traveler: {
    ...homePageEn.traveler,
    kicker: "Descubrir Chios",
    title: "¿Qué tipo de viajero eres?",
    subtitle:
      "Elige la experiencia que encaja contigo y descubre Chios según tu estilo de viaje.",
    cards: [
      {
        ...homePageEn.traveler.cards[0],
        title: "Mar",
        text: "Aguas cristalinas, playas únicas y momentos de relax en la isla.",
        href: "/es/quios-para-amantes-de-la-playa/",
        cta: "🏖️ Explorar",
      },
      {
        ...homePageEn.traveler.cards[1],
        title: "Exploración",
        text: "Pueblos, naturaleza y cultura en cada rincón de Chios.",
        href: "/es/explorar-quios/",
        cta: "🧭 Explorar",
      },
      {
        ...homePageEn.traveler.cards[2],
        title: "Familia",
        text: "Ideas y actividades para unas vacaciones familiares inolvidables.",
        href: "/es/vacaciones-en-familia-en-quios/",
        cta: "👨‍👩‍👧‍👦 Explorar",
      },
      {
        ...homePageEn.traveler.cards[3],
        title: "Gastronomía",
        text: "Sabores auténticos, masticha y experiencias locales.",
        href: "/es/sabores-de-quios/",
        cta: "🍽️ Explorar",
      },
    ],
  },

  chiosGuide: {
    ...homePageEn.chiosGuide,
    kicker: "Más sobre Chios",
    title: "¿Qué ver en Chios?",
    subtitle:
      "Hemos reunido información útil para organizar mejor tu estancia y tus excursiones.",
    cards: [
      {
        ...homePageEn.chiosGuide.cards[0],
        title: "Playas de Chios",
        text: "Consulta sugerencias y organiza más fácilmente tus escapadas junto al mar.",
        href: "/es/playas-chios/",
        ctaLabel: "Ver más",
      },
      {
        ...homePageEn.chiosGuide.cards[1],
        title: "Pueblos de Chios",
        text: "Descubre pueblos tradicionales y lugares que merece la pena visitar.",
        href: "/es/pueblos-chios/",
        ctaLabel: "Ver más",
      },
      {
        ...homePageEn.chiosGuide.cards[2],
        title: "Kampos de Chios",
        text: "Conoce la zona histórica que hace especial alojarse en Kampos.",
        href: "/es/chios-en-grecia/",
        ctaLabel: "Ver más",
      },
      {
        ...homePageEn.chiosGuide.cards[3],
        title: "Museos de Chios",
        text: "Paradas culturales para viajeros que aman la historia y la identidad local.",
        href: "/es/museos-chios/",
        ctaLabel: "Ver más",
      },
      {
        ...homePageEn.chiosGuide.cards[4],
        title: "Orquídeas de Chios",
        text: "Una actividad especial para amantes de la naturaleza que quieren descubrir otra cara de la isla.",
        href: "/es/orquideas-de-quios/",
        ctaLabel: "Ver más",
      },
      {
        ...homePageEn.chiosGuide.cards[5],
        title: "Baños termales",
        text: "Experiencias de relax y bienestar que completan perfectamente tus vacaciones.",
        href: "/es/banos-termales-de-quios/",
        ctaLabel: "Ver más",
      },
    ],
  },

  quizBar: {
    label: "DESCUBRIR CHIOS",
    text: "Dedica 5 minutos a este quiz, descubre Chios y recibe un código de descuento.",
    href: "/es/quiz-vacaciones-en-quios/",
    cta: "🧭 EMPEZAR LA EXPERIENCIA →",
  },

  faq: {
    kicker: "Preguntas frecuentes",
    icon: "❓",
    title: "Lo que conviene saber antes de reservar",
    items: [
      {
        question: "¿Voulamandis House es un hotel?",
        answerHtml:
          "Voulamandis House es un alojamiento con habitaciones y apartamentos en Kampos, Chios. Si buscas un hotel en Chios pero prefieres una hospitalidad más tranquila y personal, es una alternativa auténtica.",
      },
      {
        question: "¿Dónde está exactamente Voulamandis House?",
        answerHtml:
          "La propiedad está en el histórico <strong>Kampos, Chios</strong>, a unos 7 minutos en coche del aeropuerto y unos 14 minutos del puerto y del centro.",
      },
      {
        question: "¿Hay desayuno?",
        answerHtml:
          "Sí, ofrecemos desayuno casero en el jardín con productos de nuestra finca. Es opcional y está disponible bajo petición.",
      },
      {
        question: "¿Qué habitaciones son adecuadas para familias?",
        answerHtml:
          "Para familias de hasta 4 personas recomendamos los <strong>apartamentos familiares</strong>. Según disponibilidad, también puede funcionar una combinación de dos habitaciones.",
      },
      {
        question: "¿Hay parking?",
        answerHtml:
          "Sí, hay parking dentro de la propiedad y también es fácil aparcar en la calle tranquila junto al alojamiento.",
      },
      {
        question: "¿Cómo puedo reservar directamente?",
        answerHtml:
          "Puedes reservar directamente desde nuestra web o contactarnos para elegir juntos la habitación más adecuada para tu estancia.",
      },
    ],
  },

  finalCta: {
    kicker: "Reserva tu estancia",
    icon: "✈️",
    title: "Tu viaje a Chios empieza aquí",
    text: "Hospitalidad cálida, ambiente auténtico y ubicación ideal en Kampos.",
    primaryCta: {
      label: "Reservar directo",
      href: "/es/los-mejores-precios-de-hotel-en-la-isla-chios/",
      icon: "🛎️",
    },
    secondaryCta: {
      label: "Contacto",
      href: "/es/contacta-con-voulamandis-house/",
      icon: "✉️",
    },
  },

  mobileSticky: {
    call: {
      label: "📞 LLAMAR",
      href: "tel:+306944764654",
    },
    viber: {
      label: "💬 VIBER",
      href: "viber://chat?number=%2B306944474226",
    },
  },
};

export const homePageTr: HomePageData = {
  ...homePageEn,

  seo: {
    title: "Sakız Adası Oteli | Voulamandis House",
    description:
      "Kampos, Sakız Adası’nda sakin odalar ve daireler. Havaalanına, merkeze, plajlara ve köylere yakın Voulamandis House’ta konaklayın.",
    canonicalPath: "/tr/",
    ogImage: homePageEn.seo.ogImage,
    ogImageAlt:
      "Kampos, Sakız Adası’nda Voulamandis House - narenciye bahçesi içinde otantik konaklama",
  },

  hero: {
    ...homePageEn.hero,
    reviews: "143 yorum",
    kicker: "KAMPOS SAKIZ • VOULAMANDIS HOUSE",
    title: "Sakız Adası’nda Kampos’ta otel ve daireler",
    descriptionHtml:
      '<strong>Sakız Adası’nda otel</strong> ya da <strong>Sakız Adası odaları</strong> mı arıyorsunuz? <strong>Voulamandis House</strong>, Kampos’ta rahat odalar, sakin bir atmosfer ve samimi misafirperverlik sunar.',
    imageAlt: "Sakız Adası’nda otel ve daireler - Kampos Voulamandis House",
    primaryCta: {
      label: "Odanı bul",
      href: "/tr/odani-bul/",
      icon: "✨",
    },
    secondaryCta: {
      label: "Rezervasyon",
      href: "/tr/sakiz-adasi-rezervasyon/",
      icon: "🔥",
    },
    quizCard: {
      href: "/tr/sakiz-adasi-tatil-testi/",
      icon: "🧭",
      liveLabel: "Canlı indirim kodu",
      title: "Sakız’ı keşfedin",
      text: "Adanın sırlarını keşfedin ve konaklamanız için indirim kodu alın.",
      cta: "Başla →",
    },
  },

  announceBar: {
    href: "#vh-lastminute-title",
    icon: "🔥",
    text: "Bu hafta Sakız Adası’na mı geliyorsunuz?",
    strongText: "Mevcut konaklama fırsatlarını görün.",
  },

  intro: {
    left: {
      kicker: "Kampos, Sakız Adası’nda otantik misafirperverlik",
      icon: "🏡",
      title: "Sakız Adası’nda Voulamandis House’ta konaklama",
      bodyHtml:
        '<strong>Sakız Adası odaları</strong> veya sakin ve özenli bir <strong>Sakız Adası konaklama</strong> seçeneği arıyorsanız, Voulamandis House sizi tarihi Kampos bölgesinde karşılar. Bir <strong>Sakız Adası oteli</strong> arıyor ama daha kişisel bir deneyim istiyorsanız, burası sıcak ve otantik bir alternatiftir.',
      pills: [
        "🌴 Sakız Adası tatili",
        "🍊 Kampos Sakız",
        "🛏️ Rahat odalar",
        "💎 İyi fiyat-performans",
      ],
    },
    right: {
      kicker: "Voulamandis House’u özel yapan şeyler",
      title:
        "Konaklamanızı daha rahat, kişisel ve otantik yapan altı neden",
      cards: [
        {
          title: "🥐 Ev yapımı kahvaltı",
          text: "Bahçede, çiftliğimizden ürünlerle hazırlanan kahvaltı; talep üzerine sunulur.",
        },
        {
          title: "🌿 Avlu ve huzur",
          text: "Sakin atmosfer, bahçe ve Kampos’un gerçek ruhu ile dinlenme imkânı.",
        },
        {
          title: "🧭 Room Wizard",
          text: "Seyahatinize en uygun odayı bulmanıza yardımcı olan pratik asistan.",
        },
        {
          title: "📍 Kullanışlı konum",
          text: "Şehre, havaalanına, limana ve plajlara yakın; uzun yol yapmadan.",
        },
        {
          title: "🛎️ Direkt rezervasyonda -10%",
          text: "Tesisle doğrudan iletişim ve müsait odalara net erişim.",
        },
        {
          title: "🍊 Sakız ipuçları",
          text: "Plajlar, köyler, deneyimler ve gerçek ada rotaları için öneriler.",
        },
      ],
    },
  },

  location: {
    ...homePageEn.location,
    kicker: "Konum ve direkt rezervasyon",
    title: "Konaklamanızı planlamak için ihtiyacınız olan her şey",
    subtitle:
      "Harita, mesafeler, iletişim bilgileri ve direkt rezervasyon avantajları.",
    map: {
      ...homePageEn.location.map,
      buttonLabel: "Haritayı göster",
    },
    distances: [
      { label: "✈️ Havaalanı", value: "3 km" },
      { label: "⛴️ Liman", value: "6 km" },
      { label: "🏖️ Plaj", value: "1.5 km" },
    ],
    infoCard: {
      ...homePageEn.location.infoCard,
      kicker: "Yerel bilgiler",
      title: "Voulamandis House",
      addressLines: ["Mayor Kalvokoresi 117", "Kampos, Chios 82100"],
      phoneLabel: "Tel:",
      emailLabel: "Email:",
      text: "Tesis, Sakız Adası’nın önemli noktalarına kısa mesafede; sakinlik ve kolay ulaşımı bir arada sunan bir konumdadır.",
      cta: {
        label: "Müsaitlik",
        href: "/tr/sakiz-adasi-rezervasyon/",
        icon: "📅",
      },
    },
    discount: {
      badge: "Canlı teklif • Kod alın",
      title: "Doğrudan bizden rezervasyon yapın",
      text: "İndirim kodu alın ve komisyonsuz şekilde direkt rezervasyon yapın.",
      benefits: [
        "✔️ En iyi mevcut fiyat",
        "✔️ Tesisle doğrudan iletişim",
        "✔️ Müsait odalara erişim",
      ],
      formIntro: "🎁 Direkt rezervasyon için %10 indirim alın:",
      emailPlaceholder: "E-posta adresiniz",
      submitLabel: "KODU AL",
      consent: "Voulamandis House tekliflerini almayı kabul ediyorum.",
      successText: "İndirim kodunuz:",
      defaultCode: "WELCOME10",
    },
    copy: {
      kicker: "Konum – Kampos Sakız",
      title: "Sakız Adası’nda otantik bir konaklama için özel bir bölge",
      paragraphsHtml: [
        "<strong>Sakız Adası Kampos</strong>, tarihi konakları, taş kapıları, bahçeleri ve narenciye kokusuyla adanın en karakteristik bölgelerinden biridir.",
        "Konumu; dinlenmeyi, Sakız şehir merkezine, havaalanına ve popüler plajlara kolay erişimle birleştirmek isteyenler için idealdir.",
      ],
    },
  },

  roomsPreview: {
    ...homePageEn.roomsPreview,
    kicker: "Sakız Adası odaları ve konaklama",
    title: "Çiftler ve aileler için Sakız Adası odaları",
    text: "Odalarımız her gün temizlenir ve Kampos’ta rahat, sakin ve kaliteli bir konaklama için hazırlanmıştır.",
    primaryCta: {
      label: "Room Wizard",
      href: "/tr/sakiz-adasi-odalari/",
      icon: "✨",
    },
    secondaryCta: {
      label: "Tüm odalar",
      href: "/tr/sakiz-adasi-odalari/",
      icon: "🗂️",
    },
    sideCard: {
      kicker: "Sakız Adası odaları",
      title: "Ekonomik konaklamadan aile çözümlerine",
      text: "Sakız Adası’nda otel arıyor ama daha kişisel bir misafirperverlik istiyorsanız, Voulamandis House Kampos’ta otantik bir alternatiftir.",
    },
    rooms: [
      {
        ...homePageEn.roomsPreview.rooms[0],
        title: "Ekonomik çift kişilik oda",
        href: "/tr/chios-odalari/sakiz-adasindaki-ekonomi-cift-kisilik-oda/",
        directBadge: "🎁 -10% İndirim",
        bedBadge: "🛏️ 1 çift kişilik veya 2 tek kişilik yatak",
        description:
          "Kampos’ta özenli bir konaklama isteyen iki kişi için idealdir.",
        meta: ["👥 2 misafir", "Ekonomik", "🍊 Kampos"],
        amenities: ["❄️ Klima", "📶 Wi-Fi", "☕ Kahve", "🧊 Buzdolabı"],
        cta: "Odayı gör",
      },
      {
        ...homePageEn.roomsPreview.rooms[1],
        title: "Zemin kat odaları",
        href: "/tr/chios-odalari/standart-cift-kisilik-odalar/",
        directBadge: "🎁 -10% İndirim",
        bedBadge: "🛏️ Çift kişilik + ek yatak",
        description:
          "Kolay erişim isteyen çiftler veya küçük aileler için rahat bir seçenek.",
        meta: ["👤 ×2-3", "🌿 Zemin kat", "Kolay"],
        amenities: ["❄️ Klima", "📶 Wi-Fi", "☕ Kahve", "🧊 Buzdolabı"],
        cta: "Odayı gör",
      },
      {
        ...homePageEn.roomsPreview.rooms[2],
        title: "Üst kat odaları",
        href: "/tr/chios-odalari/standart-cift-kisilik-odalar/",
        directBadge: "🎁 -10% İndirim",
        bedBadge: "🛏️ Çift kişilik + ek yatak",
        description:
          "Daha sakin ve klasik bir atmosfer arayan gezginler için.",
        meta: ["👤 ×2-3", "🏛️ Üst kat", "Sakin"],
        amenities: ["❄️ Klima", "📶 Wi-Fi", "☕ Kahve", "🧊 Buzdolabı"],
        cta: "Odayı gör",
      },
      {
        ...homePageEn.roomsPreview.rooms[3],
        title: "Aile dairesi",
        href: "/tr/chios-odalari/sakiz-adasinda-buyuk-aile-daireleri/",
        directBadge: "🎁 -10% İndirim",
        bedBadge: "🛏️ Aile yatakları",
        description:
          "Daha fazla alan isteyen aileler veya küçük gruplar için idealdir.",
        meta: ["👤 ×4", "Alan", "🏡 Daire"],
        amenities: ["❄️ Klima", "📶 Wi-Fi", "☕ Kahve", "🧊 Buzdolabı"],
        cta: "Daireyi gör",
      },
    ],
  },

  lastMinute: {
    kicker: "Son dakika fırsatları",
    icon: "⚡",
    title: "Bu hafta Sakız Adası’na mı geliyorsunuz?",
    subtitle:
      "Misafir sayısını seçin ve önümüzdeki 7 gün için mevcut fırsatları, toplam fiyat ve direkt iletişimle görün.",
    widget: {
      title: "Önümüzdeki 7 gün için Sakız Adası konaklama fırsatları",
      subtitle:
        "Komisyonsuz direkt rezervasyonla müsait odaları veya daireleri bulun. Misafir sayısını seçin ve talebinizi WhatsApp veya Viber üzerinden gönderin.",
      trustLine:
        "🎁 Komisyonsuz direkt rezervasyon – en iyi mevcut fiyat",
      timerLabel: "Son dakika fiyatları yenileniyor:",
      guestTitle: "1. Misafir sayısını seçin",
      guestText:
        "Kişi sayısını seçtiğinizde mevcut fırsatlar görünecektir.",
      guestButtons: homePageEn.lastMinute.widget.guestButtons,
      helper:
        "Sakız Adası’ndaki müsait odaları görmek için önce misafir sayısını seçin.",
      loadingText: "🔥 En iyi mevcut fırsatlar aranıyor…",
      resultsTitle: "2. Mevcut fırsatlar",
      resultsText: "Seçenekleri hızlıca daraltmak için filtreleri kullanın.",
      emptyText:
        "Mevcut fırsatları yüklemek için önce 2, 3 veya 4 misafir seçin.",
    },
  },

  reviews: {
    ...homePageEn.reviews,
    kicker: "Misafir yorumları",
    title: "Misafirlerimiz ne söylüyor?",
  },

  amenities: {
    kicker: "Olanaklar",
    icon: "🛋️",
    title: "Rahat bir konaklama için ihtiyacınız olan her şey",
    items: [
      { icon: "📶", label: "Wi-Fi / İnternet" },
      { icon: "❄️", label: "Klima" },
      { icon: "🔥", label: "Isıtma" },
      { icon: "📺", label: "TV" },
      { icon: "🧊", label: "Buzdolabı" },
      { icon: "☕", label: "Kahve / Çay" },
      { icon: "🧼", label: "Günlük temizlik" },
      { icon: "🌿", label: "Bahçe ve dinlenme alanı" },
      { icon: "🍖", label: "Barbekü alanı" },
      { icon: "🚗", label: "Otopark" },
      { icon: "🚕", label: "Transfer mümkün" },
      { icon: "🏡", label: "Otantik misafirperverlik" },
    ],
  },

  traveler: {
    ...homePageEn.traveler,
    kicker: "Sakız’ı keşfedin",
    title: "Nasıl bir gezginsiniz?",
    subtitle:
      "Size uygun deneyimi seçin ve Sakız Adası’nı seyahat tarzınıza göre keşfedin.",
    cards: [
      {
        ...homePageEn.traveler.cards[0],
        title: "Deniz",
        text: "Kristal sular, özel plajlar ve adada huzurlu anlar.",
        href: "/tr/plaj-severler-icin-sakiz-adasi/",
        cta: "🏖️ Keşfet",
      },
      {
        ...homePageEn.traveler.cards[1],
        title: "Keşif",
        text: "Sakız’ın her köşesinde köyler, doğa ve kültür.",
        href: "/tr/sakiz-adasi-kesif/",
        cta: "🧭 Keşfet",
      },
      {
        ...homePageEn.traveler.cards[2],
        title: "Aile",
        text: "Unutulmaz aile tatilleri için fikirler ve aktiviteler.",
        href: "/tr/sakiz-adasi-aile-tatili/",
        cta: "👨‍👩‍👧‍👦 Keşfet",
      },
      {
        ...homePageEn.traveler.cards[3],
        title: "Lezzet",
        text: "Otantik tatlar, damla sakızı ve yerel deneyimler.",
        href: "/tr/sakiz-adasi-lezzetleri/",
        cta: "🍽️ Keşfet",
      },
    ],
  },

  chiosGuide: {
    ...homePageEn.chiosGuide,
    kicker: "Sakız hakkında daha fazla",
    title: "Sakız Adası’nda ne görülür?",
    subtitle:
      "Konaklamanızı ve gezilerinizi daha kolay planlamanız için faydalı bilgileri bir araya getirdik.",
    cards: [
      {
        ...homePageEn.chiosGuide.cards[0],
        title: "Sakız Adası plajları",
        text: "Deniz kaçamaklarınızı daha kolay planlamak için önerilerimize göz atın.",
        href: "/tr/sakiz-adasi-plajlari/",
        ctaLabel: "Daha fazla gör",
      },
      {
        ...homePageEn.chiosGuide.cards[1],
        title: "Sakız Adası köyleri",
        text: "Geleneksel köyleri ve görülmeye değer yerleri keşfedin.",
        href: "/tr/sakiz-adasi-koyleri/",
        ctaLabel: "Daha fazla gör",
      },
      {
        ...homePageEn.chiosGuide.cards[2],
        title: "Sakız Adası Kampos",
        text: "Kampos’ta konaklamayı özel kılan tarihi bölge hakkında daha fazla bilgi alın.",
        href: "/tr/sakiz-adasi/",
        ctaLabel: "Daha fazla gör",
      },
      {
        ...homePageEn.chiosGuide.cards[3],
        title: "Sakız Adası müzeleri",
        text: "Tarih ve yerel kimliği seven gezginler için kültürel duraklar.",
        href: "/tr/sakiz-adasi-muzeleri/",
        ctaLabel: "Daha fazla gör",
      },
      {
        ...homePageEn.chiosGuide.cards[4],
        title: "Sakız Adası orkideleri",
        text: "Adanın farklı bir yönünü görmek isteyen doğa severler için özel bir deneyim.",
        href: "/tr/sakiz-adasi-orkideleri/",
        ctaLabel: "Daha fazla gör",
      },
      {
        ...homePageEn.chiosGuide.cards[5],
        title: "Termal kaynaklar",
        text: "Tatilinizi tamamlayan rahatlama ve wellness deneyimleri.",
        href: "/tr/sakiz-adasi-termal-kaplicalari/",
        ctaLabel: "Daha fazla gör",
      },
    ],
  },

  quizBar: {
    label: "SAKIZ’I KEŞFET",
    text: "Bu testi 5 dakikada tamamlayın, Sakız’ı keşfedin ve indirim kodu alın.",
    href: "/tr/sakiz-adasi-tatil-testi/",
    cta: "🧭 DENEYİME BAŞLA →",
  },

  faq: {
    kicker: "Sık sorulan sorular",
    icon: "❓",
    title: "Rezervasyon öncesi bilmeniz gerekenler",
    items: [
      {
        question: "Voulamandis House bir otel mi?",
        answerHtml:
          "Voulamandis House, Kampos, Sakız Adası’nda odalar ve daireler sunan bir konaklama tesisidir. Sakız Adası’nda otel arıyor ama daha sakin ve kişisel bir misafirperverlik istiyorsanız, otantik bir alternatiftir.",
      },
      {
        question: "Voulamandis House tam olarak nerede?",
        answerHtml:
          "Tesis, tarihi <strong>Kampos, Sakız</strong> bölgesinde yer alır. Havaalanına yaklaşık 7 dakika, limana ve şehir merkezine yaklaşık 14 dakika sürüş mesafesindedir.",
      },
      {
        question: "Kahvaltı var mı?",
        answerHtml:
          "Evet, bahçede ev yapımı kahvaltı sunulur ve çiftliğimizden ürünler kullanılır. Kahvaltı isteğe bağlıdır ve talep üzerine hazırlanır.",
      },
      {
        question: "Aileler için hangi odalar uygundur?",
        answerHtml:
          "4 kişiye kadar aileler için <strong>aile dairelerini</strong> öneriyoruz. Müsaitliğe bağlı olarak iki oda kombinasyonu da daha büyük gruplar için uygun olabilir.",
      },
      {
        question: "Otopark var mı?",
        answerHtml:
          "Evet, tesis içinde otopark vardır. Ayrıca tesisin yanındaki sakin sokakta da park etmek kolaydır.",
      },
      {
        question: "Nasıl direkt rezervasyon yapabilirim?",
        answerHtml:
          "Web sitemiz üzerinden direkt rezervasyon yapabilir veya konaklamanız için en uygun odayı birlikte seçmek üzere bizimle iletişime geçebilirsiniz.",
      },
    ],
  },

  finalCta: {
    kicker: "Konaklamanızı ayırtın",
    icon: "✈️",
    title: "Sakız Adası yolculuğunuz burada başlar",
    text: "Samimi misafirperverlik, otantik atmosfer ve Kampos’ta ideal konum.",
    primaryCta: {
      label: "Direkt rezervasyon",
      href: "/tr/sakiz-adasi-rezervasyon/",
      icon: "🛎️",
    },
    secondaryCta: {
      label: "İletişim",
      href: "/tr/sakiz-adasi-otelleri-ile-iletisim/",
      icon: "✉️",
    },
  },

  mobileSticky: {
    call: {
      label: "📞 ARA",
      href: "tel:+306944764654",
    },
    viber: {
      label: "💬 VIBER",
      href: "viber://chat?number=%2B306944474226",
    },
  },
};

