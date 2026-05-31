export type ChiosBeachesPageData = {
  seo: {
    canonicalPath: string;
    title: string;
    description: string;
    ogImage: string;
  };
  hero: {
    kicker: string;
    title: string;
    description: string;
    image: string;
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
    kicker: string;
    title: string;
    description: string;
    tip: {
      icon: string;
      title: string;
      text: string;
      linkLabel: string;
      href: string;
    };
  };
  beaches: {
    id: string;
    name: string;
    title: string;
    description: string;
    image: string;
    imageAlt: string;
    href: string;
    region: string;
    mood: string;
    badges: string[];
    size: "large" | "wide" | "tall" | "normal";
  }[];
  planning: {
    kicker: string;
    title: string;
    description: string;
    items: {
      icon: string;
      title: string;
      text: string;
    }[];
  };
  stay: {
    kicker: string;
    title: string;
    text: string;
    primaryCta: {
      label: string;
      href: string;
    };
    secondaryCta: {
      label: string;
      href: string;
    };
  };
};

export const chiosBeachesPageEn: ChiosBeachesPageData = {
  seo: {
    canonicalPath: "/chios/chios-beaches/",
    title: "Top Chios Beaches | Best Beaches in Chios Island Guide",
    description:
      "Discover the best beaches in Chios, from Mavra Volia and Agia Fotia to Komi, Lithi, Agia Dynami, Lefkathia and hidden turquoise coves.",
    ogImage:
      "https://chioshotel.gr/wp-content/uploads/2021/12/emporios3-e1702727598897.webp",
  },
  hero: {
    kicker: "Chios beach guide",
    title: "Top beaches of Chios",
    description:
      "An insider coastal guide to volcanic shores, emerald coves, family-friendly sandy beaches and the best swimming spots around Chios Island.",
    image:
      "https://chioshotel.gr/wp-content/uploads/2021/12/emporios3-e1702727598897.webp",
    primaryCta: {
      label: "Explore beaches",
      href: "#beaches",
    },
    secondaryCta: {
      label: "Stay in Kampos",
      href: "/chios-rooms/",
    },
  },
  intro: {
    kicker: "Beach planning",
    title: "Choose the right beach for each day",
    description:
      "Chios has a coastline full of contrasts: volcanic black pebbles in the south, sandy family beaches in the west, lively beach bars, quiet coves and deep blue waters in the north. The best beach often depends on your mood, route and the wind direction of the day.",
    tip: {
      icon: "🗺️",
      title: "Your strategic island outpost",
      text:
        "To truly master your itinerary of beaches in Chios, make Voulamandis House in Kampos your home base. Our local team can help you choose beaches based on the weather, your route and the kind of day you want.",
      linkLabel: "View rooms at Voulamandis House",
      href: "/chios-rooms/",
    },
  },
  beaches: [
    {
      id: "mavra-volia",
      name: "Mavra Volia",
      title: "Mavra Volia: iconic black pebbles",
      description:
        "The most imposing beach in Chios. Deep, crystal-clear waters contrast with dramatic black volcanic pebbles, creating one of the island’s most memorable landscapes.",
      image:
        "https://chioshotel.gr/wp-content/uploads/2021/12/emporios3-e1702727598897.webp",
      imageAlt: "Mavra Volia beach in Chios with iconic black volcanic pebbles",
      href: "/chios/chios-beaches/emporios-beach/",
      region: "South Chios",
      mood: "Volcanic landscape",
      badges: ["Top choice", "South", "Volcanic"],
      size: "large",
    },
    {
      id: "agia-fotia",
      name: "Agia Fotia",
      title: "Agia Fotia",
      description:
        "A popular beach with deep crystal waters, located close to the historic Kampos area and ideal for an easy swimming day from Voulamandis House.",
      image: "https://chioshotel.gr/wp-content/uploads/2026/02/agia-fotia.jpg",
      imageAlt: "Agia Fotia beach in Chios with deep crystal waters",
      href: "/chios/chios-beaches/agia-fotia-beach/",
      region: "East Chios",
      mood: "Popular swim",
      badges: ["Popular", "East", "Deep waters"],
      size: "tall",
    },
    {
      id: "komi",
      name: "Komi Beach",
      title: "Komi Beach",
      description:
        "The heart of Chios summer life, with golden sand, beach bars and an easygoing cosmopolitan atmosphere.",
      image:
        "https://chioshotel.gr/wp-content/uploads/2021/12/42ba5ae2ff96d99dfb12b1e06fa90b45-e1703437426681.webp",
      imageAlt: "Komi Beach in Chios with golden sand and beach bars",
      href: "/chios/chios-beaches/komi-beach/",
      region: "South Chios",
      mood: "Cosmopolitan",
      badges: ["Sandy", "Beach bars", "Summer life"],
      size: "normal",
    },
    {
      id: "salagona",
      name: "Salagona",
      title: "Salagona",
      description:
        "A secluded turquoise bay, perfect for snorkeling and quieter beach days away from the busiest parts of the island.",
      image:
        "https://chioshotel.gr/wp-content/uploads/2021/12/salagona-e1645969502155.webp",
      imageAlt: "Salagona beach in Chios, a secluded turquoise bay for snorkeling",
      href: "/chios/chios-beaches/salagona-beach/",
      region: "South Chios",
      mood: "Hidden gem",
      badges: ["Hidden gem", "Snorkeling", "Turquoise"],
      size: "normal",
    },
    {
      id: "lithi",
      name: "Lithi Beach",
      title: "Lithi Beach: ideal for families",
      description:
        "Shallow sandy waters and fresh seafood taverns on the shore make Lithi one of the best family-friendly beach choices in Chios.",
      image: "https://chioshotel.gr/wp-content/uploads/2021/12/2017-06-28-1024x768.webp",
      imageAlt: "Lithi Beach in western Chios with shallow sandy waters, ideal for families",
      href: "/chios/chios-beaches/lithi-beach/",
      region: "West Chios",
      mood: "Family friendly",
      badges: ["West", "Shallow", "Seafood taverns"],
      size: "wide",
    },
    {
      id: "agia-dynami",
      name: "Agia Dynami",
      title: "Agia Dynami",
      description:
        "One of the most exotic and photogenic coves of Chios, with emerald waters and a quiet, remote atmosphere.",
      image: "https://chioshotel.gr/wp-content/uploads/2021/12/691-e1645969589226.webp",
      imageAlt: "Agia Dynami beach in Chios with exotic emerald waters",
      href: "/chios/chios-beaches/agia-dynami-beach-chios/",
      region: "South Chios",
      mood: "Exotic cove",
      badges: ["Exotic", "South", "Emerald waters"],
      size: "wide",
    },
    {
      id: "avlonia",
      name: "Avlonia",
      title: "Avlonia",
      description:
        "A sheltered bay with calm waters, ideal for a slower beach day and relaxed swimming.",
      image: "https://chioshotel.gr/wp-content/uploads/2021/12/avlonia-1024x768.webp",
      imageAlt: "Avlonia beach in Chios, a sheltered bay with calm waters",
      href: "/chios/chios-beaches/avlonia-beach2/",
      region: "South Chios",
      mood: "Serenity",
      badges: ["Calm waters", "Sheltered", "Relaxed"],
      size: "normal",
    },
    {
      id: "lefkathia",
      name: "Lefkathia",
      title: "Lefkathia",
      description:
        "A northern beach with deep blue waters and a youthful summer vibe, close to the Kardamyla area.",
      image: "https://chioshotel.gr/wp-content/uploads/2021/12/avlonia-768x576.jpg",
      imageAlt: "Lefkathia beach in Chios with deep blue waters",
      href: "/chios/chios-beaches/lefkathia-beach/",
      region: "North Chios",
      mood: "Youth vibe",
      badges: ["North", "Deep blue", "Summer vibe"],
      size: "normal",
    },
    {
      id: "nagos",
      name: "Nagos",
      title: "Nagos: lush green landscape",
      description:
        "A unique northern beach where running spring waters, ancient trees and colorful pebbles meet the Aegean Sea.",
      image: "https://chioshotel.gr/wp-content/uploads/2021/12/nagos-e1645969566121.webp",
      imageAlt: "Nagos beach in northern Chios where springs meet the Aegean sea",
      href: "/chios/chios-beaches/nagos-beach/",
      region: "North Chios",
      mood: "Nature",
      badges: ["North", "Springs", "Green landscape"],
      size: "wide",
    },
  ],
  planning: {
    kicker: "Local planning tips",
    title: "How to plan your Chios beach days",
    description:
      "The coastline is varied, so the best beach choice depends on your route, the wind and whether you want restaurants, shallow water, quiet coves or dramatic scenery.",
    items: [
      {
        icon: "🌬️",
        title: "Check the wind",
        text:
          "Some beaches are better on windy days than others. Ask locally before driving far.",
      },
      {
        icon: "🚗",
        title: "Rent a car",
        text:
          "The best beaches in Chios are spread across the island, so a car makes beach-hopping much easier.",
      },
      {
        icon: "👨‍👩‍👧",
        title: "Match the beach to your day",
        text:
          "Choose Lithi for families, Komi for beach life, Mavra Volia for scenery and Agia Dynami for exotic waters.",
      },
    ],
  },
  stay: {
    kicker: "Stay with local advice",
    title: "Start your beach days from Kampos",
    text:
      "Voulamandis House is a practical base for exploring Chios beaches, with easy access to Chios Town, the airport, south Chios routes and the east coast.",
    primaryCta: {
      label: "View rooms",
      href: "/chios-rooms/",
    },
    secondaryCta: {
      label: "Check rates",
      href: "/chios-hotels-rates/",
    },
  },
};