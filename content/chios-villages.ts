export type ChiosVillagesPageData = {
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
  villages: {
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

export const chiosVillagesPageEn: ChiosVillagesPageData = {
  seo: {
    canonicalPath: "/chios/chios-villages/",
    title: "Chios Villages Guide | Medieval Villages, Mastic Villages & Local Life",
    description:
      "Explore the most beautiful villages in Chios, from Pyrgi and Mesta to Vessa, Olympoi, Volissos, Armolia and Lagada.",
    ogImage:
      "https://chioshotel.gr/wp-content/uploads/2021/12/lagada_3.webp",
  },
  hero: {
    kicker: "Chios villages guide",
    title: "Explore the villages of Chios",
    description:
      "Discover medieval fortress villages, mastic culture, pottery traditions, seaside taverns and the authentic local character of Chios Island.",
    image:
      "https://chioshotel.gr/wp-content/uploads/2021/12/lagada_3.webp",
    primaryCta: {
      label: "Explore villages",
      href: "#villages",
    },
    secondaryCta: {
      label: "Stay in Kampos",
      href: "/chios-rooms/",
    },
  },
  intro: {
    kicker: "Village planning",
    title: "A different side of Chios beyond the beaches",
    description:
      "The villages of Chios reveal the island’s history, architecture and everyday culture. In the south, the mastic villages preserve fortified medieval layouts and unique decorative traditions. In the north and by the sea, villages offer castle views, olive landscapes, fishing harbors and relaxed local food experiences.",
    tip: {
      icon: "🏡",
      title: "Your local base for village routes",
      text:
        "Voulamandis House in Kampos is a practical starting point for exploring the villages of Chios. You can combine southern mastic villages, beaches and Chios Town routes while staying in a calm historic area.",
      linkLabel: "View rooms at Voulamandis House",
      href: "/chios-rooms/",
    },
  },
  villages: [
    {
      id: "pyrgi",
      name: "Pyrgi",
      title: "Pyrgi: the painted village",
      description:
        "Pyrgi is one of the most distinctive villages in Chios, famous for its black and white geometric house decorations and narrow traditional streets.",
      image:
        "https://chioshotel.gr/wp-content/uploads/2021/12/29651245457_aa8f702ef7_b-768x432.webp",
      imageAlt:
        "Pyrgi village in Chios with black and white geometric house decorations",
      href: "/chios/chios-villages/chios-pyrgi/",
      region: "South Chios",
      mood: "Geometric tradition",
      badges: ["Mastic village", "Painted houses", "South"],
      size: "large",
    },
    {
      id: "mesta",
      name: "Mesta",
      title: "Mesta: medieval fortress village",
      description:
        "Mesta is a beautifully preserved medieval village with stone houses, narrow alleys, defensive architecture and a strong sense of history.",
      image:
        "https://chioshotel.gr/wp-content/uploads/2021/12/9ac4cf44d16c4af6d873c5bba4a6696b_L-768x480.webp",
      imageAlt:
        "Mesta medieval village in Chios with stone alleys and fortress architecture",
      href: "/chios/chios-villages/mesta-chios/",
      region: "South Chios",
      mood: "Medieval charm",
      badges: ["Fortress village", "Stone alleys", "Mastic"],
      size: "tall",
    },
    {
      id: "vessa",
      name: "Vessa",
      title: "Vessa: quiet medieval beauty",
      description:
        "Vessa keeps a quieter medieval atmosphere, with well-preserved streets, tower-like buildings and a more peaceful village rhythm.",
      image:
        "https://chioshotel.gr/wp-content/uploads/2021/12/29651245457_aa8f702ef7_b-768x432.webp",
      imageAlt:
        "Vessa medieval village in Chios with traditional stone architecture",
      href: "/chios/chios-villages/vessa-chios/",
      region: "Central Chios",
      mood: "Quiet history",
      badges: ["Medieval", "Traditional", "Peaceful"],
      size: "normal",
    },
    {
      id: "olympoi",
      name: "Olympoi",
      title: "Olympoi",
      description:
        "Olympoi is a traditional village with historic architecture, Byzantine churches and countryside character close to the mastic village area.",
      image:
        "https://chioshotel.gr/wp-content/uploads/2021/12/olympoi-1-768x432.webp",
      imageAlt: "Olympoi village in Chios with traditional architecture",
      href: "/chios/chios-villages/olympoi-chios/",
      region: "South Chios",
      mood: "Countryside heritage",
      badges: ["History", "Byzantine churches", "Countryside"],
      size: "normal",
    },
    {
      id: "volissos",
      name: "Volissos",
      title: "Volissos: castle views in northwest Chios",
      description:
        "Volissos is the largest village of northwest Chios, known for its medieval castle, narrow streets, olive landscapes and coastal views.",
      image:
        "https://chioshotel.gr/wp-content/uploads/2021/12/Volissos-Chios.webp",
      imageAlt:
        "Volissos village in northwest Chios with castle and coastal views",
      href: "/chios/chios-villages/volissos-chios/",
      region: "Northwest Chios",
      mood: "Castle & views",
      badges: ["Castle", "Northwest", "Olive landscape"],
      size: "wide",
    },
    {
      id: "armolia",
      name: "Armolia",
      title: "Armolia: pottery craftsmanship",
      description:
        "Armolia is known for its pottery tradition, stone houses and local craftsmanship, making it a meaningful stop on a southern Chios route.",
      image:
        "https://chioshotel.gr/wp-content/uploads/2021/12/unnamed-e1702830815478.webp",
      imageAlt: "Armolia village in Chios known for pottery craftsmanship",
      href: "/chios/chios-villages/armolia-chios/",
      region: "Central Chios",
      mood: "Pottery craft",
      badges: ["Pottery", "Craft", "Stone houses"],
      size: "normal",
    },
    {
      id: "lagada",
      name: "Lagada",
      title: "Lagada: seaside village and fish taverns",
      description:
        "Lagada is a picturesque seaside village northeast of Chios Town, known for harbor views, fish taverns and relaxed local food.",
      image:
        "https://chioshotel.gr/wp-content/uploads/2021/12/lagada_3.webp",
      imageAlt: "Lagada seaside village in Chios with harbor and fish taverns",
      href: "/chios/chios-villages/lagada-chios/",
      region: "Northeast Chios",
      mood: "Seaside food",
      badges: ["Harbor", "Fish taverns", "Seaside"],
      size: "wide",
    },
  ],
  planning: {
    kicker: "Local planning tips",
    title: "How to plan your Chios village days",
    description:
      "The villages are spread across different parts of the island, so it is better to organize them by route rather than trying to see everything in one day.",
    items: [
      {
        icon: "🧭",
        title: "Group villages by area",
        text:
          "Combine Pyrgi, Mesta, Olympoi and Vessa in one southern mastic village route.",
      },
      {
        icon: "🚗",
        title: "Use a car",
        text:
          "A car gives you flexibility to combine villages, beaches and food stops without rushing.",
      },
      {
        icon: "🍽️",
        title: "Leave time for food",
        text:
          "Lagada, Volissos and the village squares are ideal for slowing down and enjoying local taverns.",
      },
    ],
  },
  stay: {
    kicker: "Stay with local advice",
    title: "Explore Chios villages from Kampos",
    text:
      "Voulamandis House gives you a calm base near Chios Town and the airport, while keeping you connected to routes toward southern mastic villages, seaside villages and northern Chios.",
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