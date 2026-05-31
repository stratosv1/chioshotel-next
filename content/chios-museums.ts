export type ChiosMuseumsPageData = {
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
  museums: {
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

export const chiosMuseumsPageEn: ChiosMuseumsPageData = {
  seo: {
    canonicalPath: "/chios/chios-museums/",
    title: "Chios Museums Guide | History, Mastic Culture & Maritime Heritage",
    description:
      "Explore the best museums in Chios, including the Archaeological Museum, Byzantine Museum, Koraes Library, Maritime Museum, Mastic Museum and Kallimasia Folklore Museum.",
    ogImage: "https://chioshotel.gr/wp-content/uploads/2022/12/mousio.mastic.webp",
  },
  hero: {
    kicker: "Chios museums guide",
    title: "Explore the museums of Chios",
    description:
      "Discover the island’s archaeology, Byzantine art, maritime history, literature, folklore and the unique culture of Chios mastic.",
    image: "https://chioshotel.gr/wp-content/uploads/2022/12/mousio.mastic.webp",
    primaryCta: {
      label: "Explore museums",
      href: "#museums",
    },
    secondaryCta: {
      label: "Stay in Kampos",
      href: "/chios-rooms/",
    },
  },
  intro: {
    kicker: "Culture planning",
    title: "A cultural route through the history of Chios",
    description:
      "Chios has a rich cultural and historical heritage, reflected in its museums, libraries and collections. From ancient artifacts and Byzantine icons to maritime stories, rare books, folklore and the mastic tradition, the island’s museums help visitors understand the deeper identity of Chios.",
    tip: {
      icon: "🏛️",
      title: "Plan culture with your island routes",
      text:
        "Many museums are in or near Chios Town, while the Mastic Museum is in southern Chios near the mastic villages. Voulamandis House in Kampos is a practical base for combining museum visits with villages, beaches and local food stops.",
      linkLabel: "View rooms at Voulamandis House",
      href: "/chios-rooms/",
    },
  },
  museums: [
    {
      id: "mastic-museum",
      name: "Chios Mastic Museum",
      title: "Chios Mastic Museum",
      description:
        "Dedicated to the history, cultivation and cultural value of Chios mastic, this museum explains one of the island’s most unique products and strongest identities.",
      image: "https://chioshotel.gr/wp-content/uploads/2022/12/mousio.mastic.webp",
      imageAlt: "Chios Mastic Museum dedicated to the history and culture of mastic",
      href: "/chios/chios-museums/the-mastic-museum-chios/",
      region: "South Chios",
      mood: "Mastic culture",
      badges: ["Mastic", "Culture", "South"],
      size: "large",
    },
    {
      id: "archaeological-museum",
      name: "Archaeological Museum of Chios",
      title: "Archaeological Museum of Chios",
      description:
        "A key museum in Chios Town with artifacts from the Neolithic period to the Roman era, including pottery, figurines, jewelry and sculptures.",
      image: "https://chioshotel.gr/wp-content/uploads/2021/12/archeological-museum-chios.webp",
      imageAlt: "Archaeological Museum of Chios with ancient artifacts and exhibits",
      href: "/chios/chios-museums/archaeological-museum-of-chios/",
      region: "Chios Town",
      mood: "Ancient history",
      badges: ["Archaeology", "Ancient Chios", "Town"],
      size: "tall",
    },
    {
      id: "byzantine-museum",
      name: "Chios Byzantine Museum",
      title: "Chios Byzantine Museum",
      description:
        "A museum dedicated to Byzantine and post-Byzantine art, with icons, frescoes, manuscripts and exhibits connected to the island’s religious history.",
      image: "https://chioshotel.gr/wp-content/uploads/2021/12/byzantine-museum-chios.webp",
      imageAlt: "Chios Byzantine Museum with Byzantine and post-Byzantine art",
      href: "/chios/chios-museums/chios-byzantine-museum/",
      region: "Chios Town",
      mood: "Byzantine art",
      badges: ["Icons", "Byzantine", "Culture"],
      size: "normal",
    },
    {
      id: "koraes-library",
      name: "Koraes Library",
      title: "Koraes Library",
      description:
        "One of the most important libraries in Greece, dedicated to Greek literature and culture, with rare books, manuscripts, archives and museum exhibits.",
      image: "https://chioshotel.gr/wp-content/uploads/2021/12/korais-library-chios.webp",
      imageAlt: "Koraes Library in Chios with rare books and manuscripts",
      href: "/chios/chios-museums/koraes-library-chios/",
      region: "Chios Town",
      mood: "Rare books",
      badges: ["Library", "Manuscripts", "Korais"],
      size: "normal",
    },
    {
      id: "maritime-museum",
      name: "Chios Maritime Museum",
      title: "Chios Maritime Museum",
      description:
        "A museum presenting the island’s maritime history, shipbuilding, navigation, trade and seafaring traditions through models, tools and exhibits.",
      image: "https://chioshotel.gr/wp-content/uploads/2021/12/chios-maritime-museum.webp",
      imageAlt: "Chios Maritime Museum with ship models and maritime history exhibits",
      href: "/chios/chios-museums/chios-maritime-museum/",
      region: "Chios Town",
      mood: "Maritime heritage",
      badges: ["Ships", "Navigation", "Trade"],
      size: "wide",
    },
    {
      id: "kallimasia-folklore",
      name: "Kallimasia Folklore Museum",
      title: "Kallimasia Folklore Museum",
      description:
        "A folklore museum that helps visitors understand everyday life, local traditions, tools, clothing and cultural memory from Chios villages.",
      image: "https://chioshotel.gr/wp-content/uploads/2021/12/kallimasia-folklore-museum.webp",
      imageAlt: "Kallimasia Folklore Museum in Chios with traditional objects and village culture",
      href: "/chios/chios-museums/kallimasia-folklore-museum/",
      region: "Kallimasia",
      mood: "Folklore",
      badges: ["Tradition", "Village life", "Folklore"],
      size: "wide",
    },
  ],
  planning: {
    kicker: "Local planning tips",
    title: "How to plan your Chios museum visits",
    description:
      "Several museums are close to Chios Town, while the Mastic Museum is best combined with a route through the southern mastic villages.",
    items: [
      {
        icon: "🏛️",
        title: "Start with Chios Town",
        text:
          "Combine the Archaeological Museum, Byzantine Museum, Koraes Library and Maritime Museum in one cultural day.",
      },
      {
        icon: "🌿",
        title: "Combine mastic culture with villages",
        text:
          "Visit the Mastic Museum together with Pyrgi, Mesta, Olympoi or other southern mastic villages.",
      },
      {
        icon: "🕰️",
        title: "Check opening hours",
        text:
          "Museum opening times can change by season, so confirm schedules before planning your day.",
      },
    ],
  },
  stay: {
    kicker: "Stay with local advice",
    title: "Explore Chios culture from Kampos",
    text:
      "Voulamandis House offers a calm base close to Chios Town and the airport, while keeping you connected to cultural routes, villages, beaches and the southern mastic area.",
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