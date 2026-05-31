export type VillageDetailData = {
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

export const villageDetails: VillageDetailData[] = [
  {
    slug: "chios-pyrgi",
    seo: {
      canonicalPath: "/chios/chios-villages/chios-pyrgi/",
      title: "Pyrgi Chios | The Painted Medieval Village of Chios",
      description:
        "Discover Pyrgi in Chios, the famous painted medieval village known for its black-and-white xysta patterns, narrow streets and mastic village identity.",
      ogImage:
        "https://chioshotel.gr/wp-content/uploads/2021/12/29651245457_aa8f702ef7_b-768x432.webp",
    },
    hero: {
      kicker: "South Chios • Mastic village",
      title: "Pyrgi: The Painted Village of Chios",
      description:
        "One of the most distinctive villages in Chios, famous for its black-and-white geometric xysta patterns and its strong medieval mastic-village character.",
      image:
        "https://chioshotel.gr/wp-content/uploads/2021/12/29651245457_aa8f702ef7_b-768x432.webp",
      tags: ["#pyrgi", "#mastic_village", "#xysta", "#medieval_chios"],
    },
    details: [
      {
        icon: "📍",
        title: "Location & Access",
        text:
          "Pyrgi is located in southern Chios, about 25 km from Chios Town. It is one of the best stops on a south Chios route through the Mastichochoria.",
      },
      {
        icon: "🏘️",
        title: "Village Character",
        text:
          "The village is known as the painted village because of the xysta: black-and-white decorative geometric patterns that cover many house facades.",
      },
      {
        icon: "💡",
        title: "Local Tip",
        text:
          "Walk slowly through the narrow streets and look up at the facades. Pyrgi is one of the most photogenic places in Chios, especially in soft afternoon light.",
      },
    ],
    highlights: {
      title: "What to see in Pyrgi",
      items: [
        "The famous xysta patterns on the house facades",
        "The medieval fortified village layout",
        "The Church of Agioi Apostoloi",
        "Traditional alleys with authentic mastic-village atmosphere",
      ],
    },
    experience: {
      title: "Why visit Pyrgi",
      paragraphs: [
        "Pyrgi is the largest medieval village in Chios and one of the island’s most memorable cultural stops. Its fortified layout, narrow lanes and decorated facades create a village scene that feels unique even among the famous mastic villages.",
        "The xysta patterns are the main reason many visitors come here, but the real charm is in walking without rushing, discovering corners, arches, small squares and the everyday rhythm of the village.",
      ],
    },
    routeIdeas: {
      title: "How to combine Pyrgi",
      items: [
        {
          icon: "🌿",
          title: "Mastic village route",
          text:
            "Combine Pyrgi with Mesta, Olympoi and the Chios Mastic Museum for a complete southern Chios culture day.",
        },
        {
          icon: "🏖️",
          title: "Beach pairing",
          text:
            "Pyrgi works well before or after Komi, Mavra Volia or Agia Dynami, depending on the mood and the wind.",
        },
        {
          icon: "📸",
          title: "Best for photos",
          text:
            "Visit with enough time to explore the decorated streets and details, not just the central square.",
        },
      ],
    },
    baseTip: {
      icon: "🗺️",
      title: "Your Strategic Base",
      text:
        "Starting from Voulamandis House in Kampos, Pyrgi is an easy and rewarding stop on a southern Chios day that can include villages, beaches and mastic culture.",
      linkLabel: "Stay with those who know best.",
      href: "/chios-rooms/",
    },
    relatedTitle: "Explore More Chios Villages",
    relatedText:
      "Use Voulamandis House as your calm base and discover the villages, beaches and local routes of Chios.",
  },
  {
    slug: "mesta-chios",
    seo: {
      canonicalPath: "/chios/chios-villages/mesta-chios/",
      title: "Mesta Chios | Medieval Fortress Village in the Mastichochoria",
      description:
        "Explore Mesta in Chios, one of the best-preserved medieval mastic villages, with stone houses, arches, narrow alleys and authentic atmosphere.",
      ogImage:
        "https://chioshotel.gr/wp-content/uploads/2021/12/9ac4cf44d16c4af6d873c5bba4a6696b_L-768x480.webp",
    },
    hero: {
      kicker: "Southwest Chios • Fortress village",
      title: "Mesta: A Medieval Fortress Village",
      description:
        "One of the most beautiful and well-preserved medieval villages in Chios, built like a castle with stone houses, arches and narrow atmospheric alleys.",
      image:
        "https://chioshotel.gr/wp-content/uploads/2021/12/9ac4cf44d16c4af6d873c5bba4a6696b_L-768x480.webp",
      tags: ["#mesta", "#mastic_village", "#medieval_village", "#stone_alleys"],
    },
    details: [
      {
        icon: "📍",
        title: "Location & Access",
        text:
          "Mesta is located in southwestern Chios, about 35 km from Chios Town. It is one of the strongest highlights of the Mastichochoria.",
      },
      {
        icon: "🏰",
        title: "Village Character",
        text:
          "The village is built with a defensive logic: the houses are joined together, forming a protective outer wall, while the streets feel like a maze of stone passages.",
      },
      {
        icon: "💡",
        title: "Local Tip",
        text:
          "Do not just stop at the square. The best part of Mesta is wandering under arches and through the narrow lanes until the village slowly reveals itself.",
      },
    ],
    highlights: {
      title: "What to see in Mesta",
      items: [
        "The medieval fortress-like settlement",
        "Stone houses, arches and narrow alleys",
        "The village churches and historic religious details",
        "Local products such as souma and traditional wine",
        "The atmosphere of one of the best-preserved mastic villages",
      ],
    },
    experience: {
      title: "Why visit Mesta",
      paragraphs: [
        "Mesta offers one of the most authentic village experiences in Chios. Its defensive architecture and stone-built layout make it feel like a living medieval settlement rather than a simple sightseeing stop.",
        "It is ideal for travelers who enjoy history, architecture and slow exploration. The village is also a natural partner to nearby Olympoi and Pyrgi, making it a key stop in a south Chios itinerary.",
      ],
    },
    routeIdeas: {
      title: "How to combine Mesta",
      items: [
        {
          icon: "🥾",
          title: "Olympoi–Mesta trail",
          text:
            "The Olympoi–Mesta walking route links two medieval mastic villages through a landscape of mastic trees, olive trees and old rural terraces.",
        },
        {
          icon: "🌿",
          title: "Mastichochoria day",
          text:
            "Combine Mesta with Pyrgi, Olympoi and the Mastic Museum for a full cultural route in southern Chios.",
        },
        {
          icon: "🏖️",
          title: "Beach route",
          text:
            "Pair Mesta with Lithi, Salagona, Avlonia or Mavra Volia depending on how much driving you want to do.",
        },
      ],
    },
    baseTip: {
      icon: "🗺️",
      title: "Your Strategic Base",
      text:
        "From Voulamandis House, Mesta can be part of a full south Chios day with medieval villages, beaches and local food stops.",
      linkLabel: "Stay with those who know best.",
      href: "/chios-rooms/",
    },
    relatedTitle: "Explore More Chios Villages",
    relatedText:
      "Discover more villages of Chios, from painted facades and pottery traditions to castles, harbors and mastic culture.",
  },
  {
    slug: "vessa-chios",
    seo: {
      canonicalPath: "/chios/chios-villages/vessa-chios/",
      title: "Vessa Chios | Quiet Medieval Mastic Village",
      description:
        "Discover Vessa in Chios, a quiet traditional mastic village with medieval character, authentic atmosphere and easy access toward Lithi Beach.",
      ogImage:
        "https://chioshotel.gr/wp-content/uploads/2021/12/29651245457_aa8f702ef7_b-768x432.webp",
    },
    hero: {
      kicker: "South Chios • Quiet mastic village",
      title: "Vessa: Quiet Medieval Beauty",
      description:
        "A peaceful mastic village in southern Chios, known for its traditional character, medieval roots and slower local atmosphere.",
      image:
        "https://chioshotel.gr/wp-content/uploads/2021/12/29651245457_aa8f702ef7_b-768x432.webp",
      tags: ["#vessa", "#mastic_village", "#quiet_chios", "#medieval_village"],
    },
    details: [
      {
        icon: "📍",
        title: "Location & Access",
        text:
          "Vessa is located in southern Chios and works well as a calm stop between the mastic villages and the western coast.",
      },
      {
        icon: "🏘️",
        title: "Village Character",
        text:
          "It is an old mastic village with medieval settlement logic, linked to the defensive history of the Mastichochoria.",
      },
      {
        icon: "💡",
        title: "Local Tip",
        text:
          "Choose Vessa when you want a quieter, less crowded village stop. It pairs especially well with Lithi Beach and a slow lunch by the sea.",
      },
    ],
    highlights: {
      title: "What to see in Vessa",
      items: [
        "Traditional mastic-village atmosphere",
        "Medieval settlement character",
        "Quiet streets and local rhythm",
        "A good route connection toward Lithi Beach",
      ],
    },
    experience: {
      title: "Why visit Vessa",
      paragraphs: [
        "Vessa is not as famous as Pyrgi or Mesta, and that is part of its appeal. It offers a quieter, more understated look at the villages of southern Chios.",
        "The village is a good stop for travelers who want to understand the broader network of mastic villages without following only the most photographed route.",
      ],
    },
    routeIdeas: {
      title: "How to combine Vessa",
      items: [
        {
          icon: "🏖️",
          title: "Vessa and Lithi",
          text:
            "Combine Vessa with Lithi Beach for a simple route that mixes village culture, shallow water and seafood taverns.",
        },
        {
          icon: "🏰",
          title: "Medieval village loop",
          text:
            "Use Vessa as part of a wider southern route with Mesta, Olympoi and Pyrgi.",
        },
        {
          icon: "🍽️",
          title: "Slow local day",
          text:
            "Plan time for food stops and quieter village wandering instead of trying to rush every village in one day.",
        },
      ],
    },
    baseTip: {
      icon: "🗺️",
      title: "Your Strategic Base",
      text:
        "Voulamandis House in Kampos gives you an easy starting point for exploring the quieter villages and western beach routes of Chios.",
      linkLabel: "Stay with those who know best.",
      href: "/chios-rooms/",
    },
    relatedTitle: "Explore More Chios Villages",
    relatedText:
      "Continue through southern Chios with medieval villages, mastic culture and nearby beaches.",
  },
  {
    slug: "olympoi-chios",
    seo: {
      canonicalPath: "/chios/chios-villages/olympoi-chios/",
      title: "Olympoi Chios | Medieval Mastic Village & Walking Route to Mesta",
      description:
        "Visit Olympoi in southern Chios, a medieval mastic village with fortified character, historic buildings and a walking route toward Mesta.",
      ogImage:
        "https://chioshotel.gr/wp-content/uploads/2021/12/olympoi-1-768x432.webp",
    },
    hero: {
      kicker: "South Chios • Medieval mastic village",
      title: "Olympoi: A Fortified Mastic Village",
      description:
        "A characteristic medieval mastic village in southern Chios, with defensive architecture, historic points of interest and a walking route toward Mesta.",
      image:
        "https://chioshotel.gr/wp-content/uploads/2021/12/olympoi-1-768x432.webp",
      tags: ["#olympoi", "#mastic_village", "#medieval_chios", "#walking_route"],
    },
    details: [
      {
        icon: "📍",
        title: "Location & Access",
        text:
          "Olympoi is located in southern Chios, about 31 km from Chios Town, and is an ideal stop on a Mastichochoria route.",
      },
      {
        icon: "🏰",
        title: "Village Character",
        text:
          "The outer walls of the edge houses once worked like defensive walls, giving the village its fortified medieval character.",
      },
      {
        icon: "💡",
        title: "Local Tip",
        text:
          "If you enjoy walking, consider the Olympoi–Mesta route. It is an easy trail through a rural landscape of mastic trees, olive trees and old terraces.",
      },
    ],
    highlights: {
      title: "What to see in Olympoi",
      items: [
        "The fortified structure of the medieval settlement",
        "The Church of Agia Paraskevi and its historic details",
        "The Trapeza of Olympoi, connected with the medieval period",
        "Nearby Fana and Kato Fana",
        "The Olympoi–Mesta walking route",
      ],
    },
    experience: {
      title: "Why visit Olympoi",
      paragraphs: [
        "Olympoi is a strong example of the defensive architecture of the mastic villages. It offers a quieter but historically rich village experience in the south of Chios.",
        "The village also works well for travelers who want to combine cultural sightseeing with nature, especially through the easy walking route that connects Olympoi with Mesta.",
      ],
    },
    routeIdeas: {
      title: "How to combine Olympoi",
      items: [
        {
          icon: "🥾",
          title: "Walk to Mesta",
          text:
            "The Olympoi–Mesta trail is about 2.6 km and takes around one hour, crossing a typical southern Chios rural landscape.",
        },
        {
          icon: "🌿",
          title: "Mastic villages route",
          text:
            "Combine Olympoi with Pyrgi, Mesta and the Mastic Museum to understand the culture of the Mastichochoria.",
        },
        {
          icon: "🏖️",
          title: "Beach pairing",
          text:
            "Olympoi can be combined with Agia Dynami, Mavra Volia or Salagona depending on your route.",
        },
      ],
    },
    baseTip: {
      icon: "🗺️",
      title: "Your Strategic Base",
      text:
        "From Voulamandis House, Olympoi fits naturally into a southern Chios day with villages, mastic culture, trails and beaches.",
      linkLabel: "Stay with those who know best.",
      href: "/chios-rooms/",
    },
    relatedTitle: "Explore More Chios Villages",
    relatedText:
      "Discover the villages of southern Chios and connect them with beaches, trails and local food stops.",
  },
  {
    slug: "volissos-chios",
    seo: {
      canonicalPath: "/chios/chios-villages/volissos-chios/",
      title: "Volissos Chios | Castle Village, Amani & Northwest Beaches",
      description:
        "Explore Volissos in northwest Chios, the main village of Amani with castle views, old streets, nearby beaches and access to Agia Markella.",
      ogImage:
        "https://chioshotel.gr/wp-content/uploads/2021/12/Volissos-Chios.webp",
    },
    hero: {
      kicker: "Northwest Chios • Amani",
      title: "Volissos: Castle Views in Northwest Chios",
      description:
        "The main village of Amani, known for its castle, hillside views, old streets, nearby beaches and strong northwest Chios character.",
      image:
        "https://chioshotel.gr/wp-content/uploads/2021/12/Volissos-Chios.webp",
      tags: ["#volissos", "#amani", "#castle_views", "#northwest_chios"],
    },
    details: [
      {
        icon: "📍",
        title: "Location & Access",
        text:
          "Volissos is located in northwestern Chios and is the main village of the Amani area. It is best visited as part of a full northern route.",
      },
      {
        icon: "🏰",
        title: "Village Character",
        text:
          "The village has a strong historic identity, with uphill streets, old neighborhoods and the castle standing above the settlement.",
      },
      {
        icon: "💡",
        title: "Local Tip",
        text:
          "Plan Volissos as a day trip rather than a quick stop. Combine the castle, food, Agia Markella and beaches such as Lefkathia.",
      },
    ],
    highlights: {
      title: "What to see in Volissos",
      items: [
        "The Castle of Volissos",
        "Views toward the countryside and the sea",
        "The Malagiotis valley",
        "Old watermills",
        "Nearby beaches such as Lefkathia",
        "The Monastery of Agia Markella nearby",
      ],
    },
    experience: {
      title: "Why visit Volissos",
      paragraphs: [
        "Volissos gives you a different side of Chios: more open, more northern, with a sense of distance from the busy south and east coast.",
        "It is a strong choice for travelers who want to combine village atmosphere, views, beaches, religious heritage and a slower full-day route through the Amani region.",
      ],
    },
    routeIdeas: {
      title: "How to combine Volissos",
      items: [
        {
          icon: "🏖️",
          title: "Lefkathia beach route",
          text:
            "Combine Volissos with Lefkathia Beach, especially if you want to stay for sunset on the northwest coast.",
        },
        {
          icon: "⛪",
          title: "Agia Markella",
          text:
            "Add the Monastery of Agia Markella to your route for one of the most meaningful religious stops in northern Chios.",
        },
        {
          icon: "🍽️",
          title: "Slow northern day",
          text:
            "Leave time for local food and scenic driving. The north of Chios rewards slower travel.",
        },
      ],
    },
    baseTip: {
      icon: "🗺️",
      title: "Your Strategic Base",
      text:
        "Voulamandis House is a calm base for exploring the whole island, including longer northern routes toward Volissos, Amani and the beaches of northwest Chios.",
      linkLabel: "Stay with those who know best.",
      href: "/chios-rooms/",
    },
    relatedTitle: "Explore More Chios Villages",
    relatedText:
      "From medieval mastic villages to seaside villages and northern castle views, Chios rewards curious travelers.",
  },
  {
    slug: "armolia-chios",
    seo: {
      canonicalPath: "/chios/chios-villages/armolia-chios/",
      title: "Armolia Chios | Pottery Village & Local Craft Tradition",
      description:
        "Discover Armolia in Chios, a traditional village known for pottery, ceramics, stone houses and its position on southern Chios routes.",
      ogImage:
        "https://chioshotel.gr/wp-content/uploads/2021/12/unnamed-e1702830815478.webp",
    },
    hero: {
      kicker: "South Chios • Pottery tradition",
      title: "Armolia: The Pottery Village of Chios",
      description:
        "A traditional village in southern Chios known for pottery, ceramics and local craftsmanship, making it a meaningful stop on the way to the mastic villages.",
      image:
        "https://chioshotel.gr/wp-content/uploads/2021/12/unnamed-e1702830815478.webp",
      tags: ["#armolia", "#pottery", "#ceramics", "#south_chios"],
    },
    details: [
      {
        icon: "📍",
        title: "Location & Access",
        text:
          "Armolia is located in southern Chios and is easy to include on routes toward Pyrgi, Mesta, Olympoi and the southern beaches.",
      },
      {
        icon: "🏺",
        title: "Village Character",
        text:
          "The village is associated with pottery and ceramic craftsmanship, offering a different cultural angle from the fortified mastic villages.",
      },
      {
        icon: "💡",
        title: "Local Tip",
        text:
          "Stop here if you want to see or buy local ceramic pieces before continuing toward the Mastichochoria or Mavra Volia.",
      },
    ],
    highlights: {
      title: "What to see in Armolia",
      items: [
        "Pottery and ceramic workshops",
        "Local craft tradition",
        "Traditional stone village character",
        "A practical stop on southern Chios routes",
      ],
    },
    experience: {
      title: "Why visit Armolia",
      paragraphs: [
        "Armolia adds a craft-focused stop to a southern Chios itinerary. While many visitors focus only on the famous medieval villages, Armolia offers a more hands-on connection to local tradition.",
        "It is a useful and pleasant stop if you are exploring the south by car and want to bring home something more authentic than a standard souvenir.",
      ],
    },
    routeIdeas: {
      title: "How to combine Armolia",
      items: [
        {
          icon: "🏺",
          title: "Craft stop",
          text:
            "Use Armolia as a short pottery stop before continuing to Pyrgi, Mesta or the Mastic Museum.",
        },
        {
          icon: "🌿",
          title: "South Chios loop",
          text:
            "Combine Armolia with Pyrgi, Olympoi and Mesta for a varied village route.",
        },
        {
          icon: "🏖️",
          title: "Beach pairing",
          text:
            "After Armolia, continue toward Komi, Mavra Volia or Agia Dynami for a beach stop.",
        },
      ],
    },
    baseTip: {
      icon: "🗺️",
      title: "Your Strategic Base",
      text:
        "From Voulamandis House, Armolia is an easy addition to a southern Chios itinerary focused on villages, crafts and beaches.",
      linkLabel: "Stay with those who know best.",
      href: "/chios-rooms/",
    },
    relatedTitle: "Explore More Chios Villages",
    relatedText:
      "Continue your Chios village route with mastic villages, medieval architecture and seaside stops.",
  },
  {
    slug: "lagada-chios",
    seo: {
      canonicalPath: "/chios/chios-villages/lagada-chios/",
      title: "Lagada Chios | Seaside Village, Harbor & Fish Taverns",
      description:
        "Discover Lagada in northeast Chios, a picturesque seaside village with a small harbor, fish taverns, views toward Oinousses and relaxed local atmosphere.",
      ogImage:
        "https://chioshotel.gr/wp-content/uploads/2021/12/lagada_3.webp",
    },
    hero: {
      kicker: "Northeast Chios • Seaside village",
      title: "Lagada: Harbor Views and Fish Taverns",
      description:
        "A picturesque seaside village in northeast Chios, known for its small harbor, taverns by the water and views toward Oinousses.",
      image:
        "https://chioshotel.gr/wp-content/uploads/2021/12/lagada_3.webp",
      tags: ["#lagada", "#seaside_village", "#fish_taverns", "#oinousses_view"],
    },
    details: [
      {
        icon: "📍",
        title: "Location & Access",
        text:
          "Lagada is located in northeast Chios, about 16 km from Chios Town. It is a good choice for a relaxed food-focused route by the sea.",
      },
      {
        icon: "⚓",
        title: "Village Character",
        text:
          "Built amphitheatrically in a small valley, Lagada combines narrow streets, low houses, courtyards and a charming harbor.",
      },
      {
        icon: "💡",
        title: "Local Tip",
        text:
          "Come for lunch or early dinner by the harbor. Lagada is one of the best village stops when you want seafood, ouzo or tsipouro by the water.",
      },
    ],
    highlights: {
      title: "What to see in Lagada",
      items: [
        "The picturesque small harbor",
        "Views toward Oinousses",
        "Taverns for seafood, ouzo and tsipouro",
        "Narrow streets, low houses and village courtyards",
        "Nearby beach-route options such as Giosonas and Nagos",
      ],
    },
    experience: {
      title: "Why visit Lagada",
      paragraphs: [
        "Lagada is one of the most enjoyable seaside villages in Chios for a relaxed meal and harbor walk. It offers a different rhythm from the medieval villages of the south.",
        "The village is ideal for travelers who want to mix scenery, food and a simple local atmosphere without making the day feel too structured.",
      ],
    },
    routeIdeas: {
      title: "How to combine Lagada",
      items: [
        {
          icon: "🍽️",
          title: "Seafood stop",
          text:
            "Plan Lagada around lunch or dinner and leave time for the harbor atmosphere.",
        },
        {
          icon: "🏖️",
          title: "Northern beaches",
          text:
            "Combine Lagada with Nagos, Giosonas or a wider northeast Chios coastal drive.",
        },
        {
          icon: "⛴️",
          title: "Oinousses views",
          text:
            "Enjoy views toward Oinousses and check seasonal boat possibilities if you want to extend the route.",
        },
      ],
    },
    baseTip: {
      icon: "🗺️",
      title: "Your Strategic Base",
      text:
        "Voulamandis House gives you a calm base for exploring both village food routes and coastal routes around northern and eastern Chios.",
      linkLabel: "Stay with those who know best.",
      href: "/chios-rooms/",
    },
    relatedTitle: "Explore More Chios Villages",
    relatedText:
      "Discover more sides of Chios, from seaside taverns and northern views to medieval villages and mastic culture.",
  },
];

export const relatedVillageCards = [
  {
    slug: "chios-pyrgi",
    title: "Pyrgi",
    description: "The painted village of Chios, famous for its black-and-white xysta facades.",
    href: "/chios/chios-villages/chios-pyrgi/",
    image:
      "https://chioshotel.gr/wp-content/uploads/2021/12/29651245457_aa8f702ef7_b-768x432.webp",
    imageAlt: "Pyrgi village in Chios with black and white xysta patterns",
    badge: "Painted",
    size: "large",
  },
  {
    slug: "mesta-chios",
    title: "Mesta",
    description: "A beautifully preserved medieval fortress village with stone alleys.",
    href: "/chios/chios-villages/mesta-chios/",
    image:
      "https://chioshotel.gr/wp-content/uploads/2021/12/9ac4cf44d16c4af6d873c5bba4a6696b_L-768x480.webp",
    imageAlt: "Mesta village in Chios with medieval stone alleys",
    badge: "Medieval",
    size: "wide",
  },
  {
    slug: "vessa-chios",
    title: "Vessa",
    description: "A quieter mastic village with medieval roots and authentic local atmosphere.",
    href: "/chios/chios-villages/vessa-chios/",
    image:
      "https://chioshotel.gr/wp-content/uploads/2021/12/29651245457_aa8f702ef7_b-768x432.webp",
    imageAlt: "Vessa village in Chios with traditional mastic village character",
    badge: "Quiet",
    size: "normal",
  },
  {
    slug: "olympoi-chios",
    title: "Olympoi",
    description: "A fortified mastic village with historic sights and a walking route to Mesta.",
    href: "/chios/chios-villages/olympoi-chios/",
    image:
      "https://chioshotel.gr/wp-content/uploads/2021/12/olympoi-1-768x432.webp",
    imageAlt: "Olympoi village in Chios with traditional architecture",
    badge: "Fortified",
    size: "normal",
  },
  {
    slug: "volissos-chios",
    title: "Volissos",
    description: "Castle views, northern landscapes and access to beaches around Amani.",
    href: "/chios/chios-villages/volissos-chios/",
    image:
      "https://chioshotel.gr/wp-content/uploads/2021/12/Volissos-Chios.webp",
    imageAlt: "Volissos village in Chios with castle views",
    badge: "Castle",
    size: "normal",
  },
  {
    slug: "armolia-chios",
    title: "Armolia",
    description: "A traditional pottery village and useful stop on southern Chios routes.",
    href: "/chios/chios-villages/armolia-chios/",
    image:
      "https://chioshotel.gr/wp-content/uploads/2021/12/unnamed-e1702830815478.webp",
    imageAlt: "Armolia village in Chios known for pottery tradition",
    badge: "Pottery",
    size: "normal",
  },
  {
    slug: "lagada-chios",
    title: "Lagada",
    description: "A seaside village with harbor views, fish taverns and relaxed local food.",
    href: "/chios/chios-villages/lagada-chios/",
    image:
      "https://chioshotel.gr/wp-content/uploads/2021/12/lagada_3.webp",
    imageAlt: "Lagada seaside village in Chios with harbor and taverns",
    badge: "Seaside",
    size: "wide",
  },
] as const;

export function getVillageDetailBySlug(slug: string) {
  return villageDetails.find((village) => village.slug === slug);
}

export function getRelatedVillageCards(currentSlug: string) {
  return relatedVillageCards.filter((village) => village.slug !== currentSlug);
}

export function getVillageSlugs() {
  return villageDetails.map((village) => village.slug);
}