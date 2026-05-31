export type MuseumDetailData = {
  slug: string;
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
    tags: string[];
  };
  details: {
    icon: string;
    title: string;
    text: string;
  }[];
  highlights: {
    title: string;
    items: string[];
  };
  experience: {
    title: string;
    paragraphs: string[];
  };
  routeIdeas: {
    title: string;
    items: {
      icon: string;
      title: string;
      text: string;
    }[];
  };
  baseTip: {
    icon: string;
    title: string;
    text: string;
    linkLabel: string;
    href: string;
  };
  relatedTitle: string;
  relatedText: string;
};

export const museumDetails: MuseumDetailData[] = [
  {
    slug: "the-mastic-museum-chios",
    seo: {
      canonicalPath: "/chios/chios-museums/the-mastic-museum-chios/",
      title: "Chios Mastic Museum | Mastic Culture & Southern Chios Guide",
      description:
        "Visit the Chios Mastic Museum and discover the history, cultivation and cultural importance of mastic, one of the island’s most unique traditions.",
      ogImage:
        "https://chioshotel.gr/wp-content/uploads/2022/12/mousio.mastic.webp",
    },
    hero: {
      kicker: "South Chios • Mastic culture",
      title: "Chios Mastic Museum",
      description:
        "A must-visit museum dedicated to the history, cultivation and cultural value of Chios mastic, the island’s most distinctive natural product.",
      image:
        "https://chioshotel.gr/wp-content/uploads/2022/12/mousio.mastic.webp",
      tags: ["#mastic_museum", "#south_chios", "#mastic_culture", "#mastichochoria"],
    },
    details: [
      {
        icon: "📍",
        title: "Location & Access",
        text:
          "The Chios Mastic Museum is located in southern Chios, close to the mastic villages, making it easy to combine with Pyrgi, Mesta or Olympoi.",
      },
      {
        icon: "🌿",
        title: "Museum Focus",
        text:
          "The museum presents the cultivation, harvesting, processing and cultural identity of mastic, connecting nature, history and local economy.",
      },
      {
        icon: "💡",
        title: "Local Tip",
        text:
          "Visit the museum before exploring the Mastichochoria. It gives helpful context for understanding why southern Chios is so special.",
      },
    ],
    highlights: {
      title: "What to see at the Chios Mastic Museum",
      items: [
        "Exhibits about mastic cultivation and harvesting",
        "The history and economy of mastic in Chios",
        "Traditional tools and production processes",
        "The connection between mastic and the southern villages",
        "A strong introduction to the Mastichochoria region",
      ],
    },
    experience: {
      title: "Why visit the Mastic Museum",
      paragraphs: [
        "The Chios Mastic Museum is one of the best cultural stops for understanding the identity of the island. Mastic is not just a product; it shaped villages, routes, work, trade and local traditions.",
        "The museum is especially useful if you plan to visit Pyrgi, Mesta or Olympoi, because it explains the landscape and the culture behind the mastic villages.",
      ],
    },
    routeIdeas: {
      title: "How to combine the Mastic Museum",
      items: [
        {
          icon: "🏘️",
          title: "Mastic villages route",
          text:
            "Combine the museum with Pyrgi, Mesta and Olympoi for one of the strongest cultural routes in Chios.",
        },
        {
          icon: "🏖️",
          title: "Beach pairing",
          text:
            "After the museum, continue toward Komi, Mavra Volia or Agia Dynami for a complete south Chios day.",
        },
        {
          icon: "🌿",
          title: "Start with context",
          text:
            "Visit the museum first if you want the villages and mastic landscape to make more sense as you explore.",
        },
      ],
    },
    baseTip: {
      icon: "🗺️",
      title: "Your Strategic Base",
      text:
        "From Voulamandis House in Kampos, the Mastic Museum fits naturally into a southern Chios day with villages, beaches and local food stops.",
      linkLabel: "Stay with those who know best.",
      href: "/chios-rooms/",
    },
    relatedTitle: "Explore More Chios Museums",
    relatedText:
      "Discover the museums of Chios and connect history, culture, mastic, literature and maritime heritage during your stay.",
  },
  {
    slug: "archaeological-museum-chios",
    seo: {
      canonicalPath: "/chios/chios-museums/archaeological-museum-chios/",
      title: "Archaeological Museum of Chios | Ancient History & Island Heritage",
      description:
        "Explore the Archaeological Museum of Chios, with exhibits connected to the island’s ancient history, artifacts, sculpture, pottery and cultural heritage.",
      ogImage:
        "https://chioshotel.gr/wp-content/uploads/2021/12/caption.webp",
    },
    hero: {
      kicker: "Chios Town • Ancient history",
      title: "Archaeological Museum of Chios",
      description:
        "A key museum for understanding ancient Chios, with exhibits that connect the island to the wider history of the Aegean and the eastern Mediterranean.",
      image:
        "https://chioshotel.gr/wp-content/uploads/2021/12/caption.webp",
      tags: ["#archaeology", "#chios_town", "#ancient_chios", "#museum_guide"],
    },
    details: [
      {
        icon: "📍",
        title: "Location & Access",
        text:
          "The Archaeological Museum is located in Chios Town, making it easy to visit together with other town museums, the port area and local food stops.",
      },
      {
        icon: "🏺",
        title: "Museum Focus",
        text:
          "The museum presents artifacts linked to the ancient history of Chios, including pottery, sculptures, figurines, jewelry and archaeological finds.",
      },
      {
        icon: "💡",
        title: "Local Tip",
        text:
          "Plan it as part of a Chios Town culture day. It pairs well with the Byzantine Museum, Koraes Library and the Maritime Museum.",
      },
    ],
    highlights: {
      title: "What to see at the Archaeological Museum",
      items: [
        "Ancient artifacts from Chios and the wider area",
        "Pottery, figurines, jewelry and sculpture",
        "Exhibits connected to the island’s historic relationships with other cultures",
        "A useful introduction to ancient Chios before exploring the island",
      ],
    },
    experience: {
      title: "Why visit the Archaeological Museum",
      paragraphs: [
        "The Archaeological Museum of Chios helps visitors understand the island beyond its beaches and villages. It connects Chios with ancient trade, art and the wider Aegean world.",
        "It is a good first cultural stop in Chios Town, especially for travelers who want context before visiting historic villages and archaeological areas around the island.",
      ],
    },
    routeIdeas: {
      title: "How to combine the Archaeological Museum",
      items: [
        {
          icon: "🏛️",
          title: "Chios Town museums",
          text:
            "Combine it with the Byzantine Museum, Koraes Library and the Maritime Museum for a compact cultural route.",
        },
        {
          icon: "☕",
          title: "Town walk",
          text:
            "Add a walk around Chios Town before or after the museum, with time for coffee or lunch near the center.",
        },
        {
          icon: "🚗",
          title: "Easy half-day",
          text:
            "This is a practical option for a half-day near town, especially before a later beach or village route.",
        },
      ],
    },
    baseTip: {
      icon: "🗺️",
      title: "Your Strategic Base",
      text:
        "Voulamandis House is close enough to Chios Town to make museum visits easy while keeping your stay calm and connected to island routes.",
      linkLabel: "Stay with those who know best.",
      href: "/chios-rooms/",
    },
    relatedTitle: "Explore More Chios Museums",
    relatedText:
      "Continue through Chios Town and discover Byzantine art, maritime heritage, rare books and local culture.",
  },
  {
    slug: "chios-byzantine-museum",
    seo: {
      canonicalPath: "/chios/chios-museums/chios-byzantine-museum/",
      title: "Chios Byzantine Museum | Byzantine Art, Icons & Island Culture",
      description:
        "Visit the Chios Byzantine Museum and explore Byzantine and post-Byzantine art, icons, manuscripts and religious heritage in Chios Town.",
      ogImage:
        "https://chioshotel.gr/wp-content/uploads/2021/12/375px-Chios_Byzantine_Museum_Mecidiye_Mosque_Chios_Greece.webp",
    },
    hero: {
      kicker: "Chios Town • Byzantine heritage",
      title: "Chios Byzantine Museum",
      description:
        "A cultural stop in Chios Town dedicated to Byzantine and post-Byzantine art, religious heritage and the historic layers of the island.",
      image:
        "https://chioshotel.gr/wp-content/uploads/2021/12/375px-Chios_Byzantine_Museum_Mecidiye_Mosque_Chios_Greece.webp",
      tags: ["#byzantine_museum", "#icons", "#chios_town", "#culture"],
    },
    details: [
      {
        icon: "📍",
        title: "Location & Access",
        text:
          "The Byzantine Museum is located in Chios Town and can be included easily in a town-focused cultural walk.",
      },
      {
        icon: "🖼️",
        title: "Museum Focus",
        text:
          "The museum focuses on Byzantine and post-Byzantine art, including icons, frescoes, manuscripts and religious-historical material.",
      },
      {
        icon: "💡",
        title: "Local Tip",
        text:
          "Combine it with the Archaeological Museum and Koraes Library to see different cultural periods of Chios in one day.",
      },
    ],
    highlights: {
      title: "What to see at the Byzantine Museum",
      items: [
        "Byzantine and post-Byzantine icons",
        "Religious art and cultural exhibits",
        "Historic material connected to Chios during the Byzantine era",
        "A different view of the island’s spiritual and artistic heritage",
      ],
    },
    experience: {
      title: "Why visit the Byzantine Museum",
      paragraphs: [
        "The Chios Byzantine Museum adds depth to a Chios Town visit by highlighting the island’s religious art and Byzantine cultural layers.",
        "It is especially useful for travelers who enjoy churches, icons, historic architecture and the way cultural identity changes across centuries.",
      ],
    },
    routeIdeas: {
      title: "How to combine the Byzantine Museum",
      items: [
        {
          icon: "🏛️",
          title: "Town culture route",
          text:
            "Combine it with the Archaeological Museum and Koraes Library for a balanced Chios Town museum day.",
        },
        {
          icon: "⛪",
          title: "Religious heritage",
          text:
            "Pair the museum with visits to historic churches or monastery routes around the island.",
        },
        {
          icon: "🚶",
          title: "Slow town walk",
          text:
            "Leave time to explore the surrounding streets and take a relaxed break in town.",
        },
      ],
    },
    baseTip: {
      icon: "🗺️",
      title: "Your Strategic Base",
      text:
        "From Voulamandis House, Chios Town museums are easy to reach while still giving you a quiet base outside the busy center.",
      linkLabel: "Stay with those who know best.",
      href: "/chios-rooms/",
    },
    relatedTitle: "Explore More Chios Museums",
    relatedText:
      "Discover more cultural stops in Chios, from archaeology and literature to maritime heritage and mastic culture.",
  },
  {
    slug: "koraes-library-chios",
    seo: {
      canonicalPath: "/chios/chios-museums/koraes-library-chios/",
      title: "Koraes Library Chios | Rare Books, Manuscripts & Greek Culture",
      description:
        "Discover Koraes Library in Chios, one of the island’s most important cultural institutions, with rare books, manuscripts, archives and museum exhibits.",
      ogImage:
        "https://chioshotel.gr/wp-content/uploads/2021/12/vivlitothiki-korai-1.webp",
    },
    hero: {
      kicker: "Chios Town • Books & culture",
      title: "Koraes Library",
      description:
        "A major cultural institution in Chios Town, dedicated to Greek literature, rare books, manuscripts, archives and the legacy of Adamantios Korais.",
      image:
        "https://chioshotel.gr/wp-content/uploads/2021/12/vivlitothiki-korai-1.webp",
      tags: ["#koraes_library", "#rare_books", "#manuscripts", "#chios_town"],
    },
    details: [
      {
        icon: "📍",
        title: "Location & Access",
        text:
          "Koraes Library is located in Chios Town and is a natural stop for visitors interested in books, archives and Greek cultural history.",
      },
      {
        icon: "📚",
        title: "Museum Focus",
        text:
          "The library is connected to the preservation and promotion of Greek literature and culture, with rare books, manuscripts and archive material.",
      },
      {
        icon: "💡",
        title: "Local Tip",
        text:
          "Visit it as part of a quieter cultural day in Chios Town, especially if you enjoy history beyond standard sightseeing.",
      },
    ],
    highlights: {
      title: "What to see at Koraes Library",
      items: [
        "Rare books and manuscripts",
        "Archive material connected to Greek culture",
        "Exhibits related to Adamantios Korais",
        "A quieter, more scholarly side of Chios Town",
      ],
    },
    experience: {
      title: "Why visit Koraes Library",
      paragraphs: [
        "Koraes Library is one of the most meaningful cultural stops in Chios for travelers interested in literature, education and the intellectual history of Greece.",
        "It offers a different kind of museum experience: less visual spectacle, more quiet depth, and a strong connection to the island’s contribution to Greek letters.",
      ],
    },
    routeIdeas: {
      title: "How to combine Koraes Library",
      items: [
        {
          icon: "🏛️",
          title: "Chios Town museums",
          text:
            "Pair it with the Archaeological Museum, Byzantine Museum and Maritime Museum in one town route.",
        },
        {
          icon: "📚",
          title: "Culture-focused day",
          text:
            "Make it part of a slower day for travelers who prefer history, archives and meaningful indoor stops.",
        },
        {
          icon: "☕",
          title: "Town break",
          text:
            "Combine your visit with coffee or lunch in Chios Town before heading back to Kampos.",
        },
      ],
    },
    baseTip: {
      icon: "🗺️",
      title: "Your Strategic Base",
      text:
        "Voulamandis House gives you easy access to Chios Town culture while keeping your accommodation quiet and relaxed in Kampos.",
      linkLabel: "Stay with those who know best.",
      href: "/chios-rooms/",
    },
    relatedTitle: "Explore More Chios Museums",
    relatedText:
      "Continue your cultural route with archaeology, Byzantine art, maritime history and mastic heritage.",
  },
  {
    slug: "chios-maritime-museum",
    seo: {
      canonicalPath: "/chios/chios-museums/chios-maritime-museum/",
      title: "Chios Maritime Museum | Seafaring, Shipbuilding & Island History",
      description:
        "Visit the Chios Maritime Museum and discover the island’s seafaring identity, ship models, navigation, trade and maritime traditions.",
      ogImage:
        "https://chioshotel.gr/wp-content/uploads/2021/12/IMG_1203-Medium-min-768x487.webp",
    },
    hero: {
      kicker: "Chios Town • Maritime heritage",
      title: "Chios Maritime Museum",
      description:
        "A museum dedicated to the island’s maritime history, seafaring traditions, shipbuilding, navigation and the long relationship between Chios and the sea.",
      image:
        "https://chioshotel.gr/wp-content/uploads/2021/12/IMG_1203-Medium-min-768x487.webp",
      tags: ["#maritime_museum", "#seafaring", "#ship_models", "#chios_town"],
    },
    details: [
      {
        icon: "📍",
        title: "Location & Access",
        text:
          "The Maritime Museum is located in Chios Town and is easy to combine with other town museums and a walk near the port.",
      },
      {
        icon: "⚓",
        title: "Museum Focus",
        text:
          "The museum presents Chios maritime history through ship models, tools, equipment and exhibits about trade, navigation and naval tradition.",
      },
      {
        icon: "💡",
        title: "Local Tip",
        text:
          "Choose this museum if you want to understand why the sea is central to Chios identity, economy and family history.",
      },
    ],
    highlights: {
      title: "What to see at the Maritime Museum",
      items: [
        "Ship models and maritime exhibits",
        "Stories of seafaring, navigation and trade",
        "Tools and equipment connected to maritime life",
        "A strong introduction to the island’s naval tradition",
      ],
    },
    experience: {
      title: "Why visit the Maritime Museum",
      paragraphs: [
        "The Maritime Museum is one of the best places to understand Chios as a seafaring island. The sea shaped local work, trade, migration, identity and family stories.",
        "It is a strong cultural stop for visitors who want more than a surface-level island experience and who are curious about the connection between Chios and the wider world.",
      ],
    },
    routeIdeas: {
      title: "How to combine the Maritime Museum",
      items: [
        {
          icon: "⚓",
          title: "Port and town walk",
          text:
            "Combine the museum with a walk around Chios Town and the port area for a maritime-themed visit.",
        },
        {
          icon: "🏛️",
          title: "Town museum route",
          text:
            "Pair it with the Archaeological Museum, Byzantine Museum or Koraes Library.",
        },
        {
          icon: "🍽️",
          title: "Food after culture",
          text:
            "Plan lunch or dinner in town after the museum before returning to Kampos.",
        },
      ],
    },
    baseTip: {
      icon: "🗺️",
      title: "Your Strategic Base",
      text:
        "Voulamandis House is close enough to Chios Town for easy museum visits and far enough to return to a calm Kampos setting.",
      linkLabel: "Stay with those who know best.",
      href: "/chios-rooms/",
    },
    relatedTitle: "Explore More Chios Museums",
    relatedText:
      "Discover more museums in Chios and connect maritime history with archaeology, literature and mastic culture.",
  },
  {
    slug: "kallimasia-folklore-museum",
    seo: {
      canonicalPath: "/chios/chios-museums/kallimasia-folklore-museum/",
      title: "Kallimasia Folklore Museum Chios | Village Life & Local Traditions",
      description:
        "Explore the Kallimasia Folklore Museum in Chios and discover everyday village life, local traditions, tools, clothing and cultural memory.",
      ogImage:
        "https://chioshotel.gr/wp-content/uploads/2021/12/2-1-768x512.webp",
    },
    hero: {
      kicker: "Kallimasia • Folklore",
      title: "Kallimasia Folklore Museum",
      description:
        "A museum that brings everyday Chios village life into focus through traditional objects, tools, clothing and local cultural memory.",
      image:
        "https://chioshotel.gr/wp-content/uploads/2021/12/2-1-768x512.webp",
      tags: ["#folklore_museum", "#kallimasia", "#village_life", "#tradition"],
    },
    details: [
      {
        icon: "📍",
        title: "Location & Access",
        text:
          "The Kallimasia Folklore Museum is located in Kallimasia and can be combined with eastern and southern Chios routes.",
      },
      {
        icon: "🧺",
        title: "Museum Focus",
        text:
          "The museum focuses on everyday life, local customs, tools, clothing and the practical culture of Chios villages.",
      },
      {
        icon: "💡",
        title: "Local Tip",
        text:
          "Visit if you want to understand the island through real daily life, not only monuments and famous landmarks.",
      },
    ],
    highlights: {
      title: "What to see at the Kallimasia Folklore Museum",
      items: [
        "Traditional tools and household objects",
        "Exhibits connected to village life",
        "Clothing, local customs and cultural memory",
        "A more everyday view of Chios history",
      ],
    },
    experience: {
      title: "Why visit the Kallimasia Folklore Museum",
      paragraphs: [
        "The Kallimasia Folklore Museum gives visitors a grounded view of Chios culture. It focuses on the everyday objects, habits and traditions that shaped local life.",
        "It is a meaningful stop for travelers who enjoy folklore, village culture and the human side of island history.",
      ],
    },
    routeIdeas: {
      title: "How to combine the Kallimasia Folklore Museum",
      items: [
        {
          icon: "🏘️",
          title: "Village culture route",
          text:
            "Combine it with villages and local food stops for a day focused on everyday Chios culture.",
        },
        {
          icon: "🏖️",
          title: "East coast pairing",
          text:
            "Add a beach stop such as Agia Fotia if you want to mix culture and swimming.",
        },
        {
          icon: "🚗",
          title: "Flexible half-day",
          text:
            "It works well as a shorter visit before continuing toward southern Chios.",
        },
      ],
    },
    baseTip: {
      icon: "🗺️",
      title: "Your Strategic Base",
      text:
        "From Voulamandis House, you can easily build routes that combine museums, villages, beaches and local food around Chios.",
      linkLabel: "Stay with those who know best.",
      href: "/chios-rooms/",
    },
    relatedTitle: "Explore More Chios Museums",
    relatedText:
      "Continue your cultural route through Chios with archaeology, Byzantine art, maritime history, literature and mastic heritage.",
  },
];

export const relatedMuseumCards = [
  {
    slug: "the-mastic-museum-chios",
    title: "Mastic Museum",
    description: "The story of Chios mastic, from cultivation to culture.",
    href: "/chios/chios-museums/the-mastic-museum-chios/",
    image:
      "https://chioshotel.gr/wp-content/uploads/2022/12/mousio.mastic.webp",
    imageAlt: "Chios Mastic Museum",
    badge: "Mastic",
    size: "large",
  },
  {
    slug: "archaeological-museum-chios",
    title: "Archaeological Museum",
    description: "Ancient artifacts and the island’s early history.",
    href: "/chios/chios-museums/archaeological-museum-chios/",
    image:
      "https://chioshotel.gr/wp-content/uploads/2021/12/caption.webp",
    imageAlt: "Archaeological Museum of Chios",
    badge: "Ancient",
    size: "wide",
  },
  {
    slug: "chios-byzantine-museum",
    title: "Byzantine Museum",
    description: "Icons, religious art and Byzantine heritage.",
    href: "/chios/chios-museums/chios-byzantine-museum/",
    image:
      "https://chioshotel.gr/wp-content/uploads/2021/12/375px-Chios_Byzantine_Museum_Mecidiye_Mosque_Chios_Greece.webp",
    imageAlt: "Chios Byzantine Museum",
    badge: "Byzantine",
    size: "normal",
  },
  {
    slug: "koraes-library-chios",
    title: "Koraes Library",
    description: "Rare books, manuscripts and Greek culture.",
    href: "/chios/chios-museums/koraes-library-chios/",
    image:
      "https://chioshotel.gr/wp-content/uploads/2021/12/vivlitothiki-korai-1.webp",
    imageAlt: "Koraes Library in Chios",
    badge: "Books",
    size: "normal",
  },
  {
    slug: "chios-maritime-museum",
    title: "Maritime Museum",
    description: "Seafaring, ship models and maritime heritage.",
    href: "/chios/chios-museums/chios-maritime-museum/",
    image:
      "https://chioshotel.gr/wp-content/uploads/2021/12/IMG_1203-Medium-min-768x487.webp",
    imageAlt: "Chios Maritime Museum",
    badge: "Sea",
    size: "normal",
  },
  {
    slug: "kallimasia-folklore-museum",
    title: "Kallimasia Folklore Museum",
    description: "Village life, tools, customs and local memory.",
    href: "/chios/chios-museums/kallimasia-folklore-museum/",
    image:
      "https://chioshotel.gr/wp-content/uploads/2021/12/2-1-768x512.webp",
    imageAlt: "Kallimasia Folklore Museum in Chios",
    badge: "Folklore",
    size: "wide",
  },
] as const;

export function getMuseumDetailBySlug(slug: string) {
  return museumDetails.find((museum) => museum.slug === slug);
}

export function getRelatedMuseumCards(currentSlug: string) {
  return relatedMuseumCards.filter((museum) => museum.slug !== currentSlug);
}

export function getMuseumSlugs() {
  return museumDetails.map((museum) => museum.slug);
}