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
        "/images/villages/29651245457_aa8f702ef7_b-768x432.webp",
    },
    hero: {
      kicker: "South Chios • Mastic village",
      title: "Pyrgi: The Painted Village of Chios",
      description:
        "One of the most distinctive villages in Chios, famous for its black-and-white geometric xysta patterns and its strong medieval mastic-village character.",
      image:
        "/images/villages/29651245457_aa8f702ef7_b-768x432.webp",
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
        "/images/villages/9ac4cf44d16c4af6d873c5bba4a6696b_L-768x480.webp",
    },
    hero: {
      kicker: "Southwest Chios • Fortress village",
      title: "Mesta: A Medieval Fortress Village",
      description:
        "One of the most beautiful and well-preserved medieval villages in Chios, built like a castle with stone houses, arches and narrow atmospheric alleys.",
      image:
        "/images/villages/9ac4cf44d16c4af6d873c5bba4a6696b_L-768x480.webp",
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
        "/images/villages/29651245457_aa8f702ef7_b-768x432.webp",
    },
    hero: {
      kicker: "South Chios • Quiet mastic village",
      title: "Vessa: Quiet Medieval Beauty",
      description:
        "A peaceful mastic village in southern Chios, known for its traditional character, medieval roots and slower local atmosphere.",
      image:
        "/images/villages/29651245457_aa8f702ef7_b-768x432.webp",
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
        "/images/villages/olympoi-1-768x432.webp",
    },
    hero: {
      kicker: "South Chios • Medieval mastic village",
      title: "Olympoi: A Fortified Mastic Village",
      description:
        "A characteristic medieval mastic village in southern Chios, with defensive architecture, historic points of interest and a walking route toward Mesta.",
      image:
        "/images/villages/olympoi-1-768x432.webp",
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
        "/images/villages/Volissos-Chios.webp",
    },
    hero: {
      kicker: "Northwest Chios • Amani",
      title: "Volissos: Castle Views in Northwest Chios",
      description:
        "The main village of Amani, known for its castle, hillside views, old streets, nearby beaches and strong northwest Chios character.",
      image:
        "/images/villages/Volissos-Chios.webp",
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
        "/images/villages/unnamed-e1702830815478.webp",
    },
    hero: {
      kicker: "South Chios • Pottery tradition",
      title: "Armolia: The Pottery Village of Chios",
      description:
        "A traditional village in southern Chios known for pottery, ceramics and local craftsmanship, making it a meaningful stop on the way to the mastic villages.",
      image:
        "/images/villages/unnamed-e1702830815478.webp",
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
        "/images/villages/lagada_3.webp",
    },
    hero: {
      kicker: "Northeast Chios • Seaside village",
      title: "Lagada: Harbor Views and Fish Taverns",
      description:
        "A picturesque seaside village in northeast Chios, known for its small harbor, taverns by the water and views toward Oinousses.",
      image:
        "/images/villages/lagada_3.webp",
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

export const localizedVillageDetails: VillageDetailData[] = [
  // EL localized villages,
  {
    slug: "pyrgi-xios",
    seo: {
      canonicalPath: "/el/xoria-xios/pyrgi-xios/",
      title: "Πυργί Χίος | Το ζωγραφιστό μεσαιωνικό χωριό",
      description: "Ανακαλύψτε το Πυργί στη Χίο, το διάσημο ζωγραφιστό μεσαιωνικό χωριό με τα ασπρόμαυρα ξυστά, τα στενά σοκάκια και την αυθεντική ταυτότητα των Μαστιχοχωρίων.",
      ogImage: "/images/villages/29651245457_aa8f702ef7_b-768x432.webp",
    },
    hero: {
      kicker: "Νότια Χίος • Μαστιχοχώρι",
      title: "Πυργί: το ζωγραφιστό χωριό της Χίου",
      description: "Ανακαλύψτε το Πυργί στη Χίο, το διάσημο ζωγραφιστό μεσαιωνικό χωριό με τα ασπρόμαυρα ξυστά, τα στενά σοκάκια και την αυθεντική ταυτότητα των Μαστιχοχωρίων.",
      image: "/images/villages/29651245457_aa8f702ef7_b-768x432.webp",
      tags: ["#pyrgi", "#mastic_village", "#xysta", "#medieval_chios"],
    },
    details: [
      {
        icon: "📍",
        title: "Τοποθεσία & πρόσβαση",
        text: "Το Πυργί βρίσκεται στη νότια Χίο, περίπου 25 χλμ. από την πόλη, και είναι βασική στάση σε κάθε διαδρομή στα Μαστιχοχώρια.",
      },
      {
        icon: "🏘️",
        title: "Χαρακτήρας χωριού",
        text: "Οι προσόψεις με τα ξυστά, τα γεωμετρικά μοτίβα και η μεσαιωνική διάταξη κάνουν το χωριό μοναδικό στην Ελλάδα.",
      },
      {
        icon: "💡",
        title: "Τοπική συμβουλή",
        text: "Πηγαίνετε νωρίς ή αργά το απόγευμα για καλύτερο φως στις φωτογραφίες και πιο ήρεμη βόλτα στα σοκάκια.",
      },
    ],
    highlights: {
      title: "Τι να προσέξετε",
      items: [
        "Τα ασπρόμαυρα ξυστά στις προσόψεις",
        "Η κεντρική πλατεία με καφέ και τοπική ζωή",
        "Η ατμόσφαιρα των Μαστιχοχωρίων"
      ],
    },
    experience: {
      title: "Η εμπειρία",
      paragraphs: [
        "Στο χωριό Πυργί αξίζει να κινηθείτε αργά, να παρατηρήσετε την αρχιτεκτονική και να αφήσετε τη διαδρομή να σας οδηγήσει μέσα στα στενά.",
        "Η επίσκεψη γίνεται ακόμη καλύτερη όταν τη συνδυάσετε με ένα κοντινό χωριό, μια παραλία ή μια στάση για φαγητό.",
      ],
    },
    routeIdeas: {
      title: "Ιδέες διαδρομής",
      items: [
        {
          icon: "🚗",
          title: "Οργανώστε τη διαδρομή",
          text: "Συνδυάστε το χωριό με κοντινά αξιοθέατα, παραλίες ή άλλα χωριά της περιοχής.",
        },
        {
          icon: "🍽️",
          title: "Κρατήστε χρόνο για φαγητό",
          text: "Οι ταβέρνες και τα καφενεία είναι συχνά το καλύτερο μέρος για να νιώσετε την τοπική ζωή.",
        },
        {
          icon: "📷",
          title: "Περπατήστε χωρίς βιασύνη",
          text: "Τα πιο όμορφα σημεία εμφανίζονται όταν αφήσετε το αυτοκίνητο και χαθείτε στα στενά.",
        },
      ],
    },
    baseTip: {
      icon: "🗺️",
      title: "Η στρατηγική σας βάση",
      text: "Με βάση το Voulamandis House στον Κάμπο, μπορείτε να οργανώσετε εύκολα διαδρομές στα χωριά της Χίου, συνδυάζοντας πολιτισμό, παραλίες και τοπικό φαγητό.",
      linkLabel: "Μείνετε με ανθρώπους που γνωρίζουν το νησί.",
      href: "/el/domatia-xios/",
    },
    relatedTitle: "Ανακαλύψτε περισσότερα χωριά της Χίου",
    relatedText: "Γνωρίστε τα Μαστιχοχώρια, τα μεσαιωνικά σοκάκια, τα βόρεια τοπία και τα παραθαλάσσια χωριά της Χίου.",
  },
  {
    slug: "mesta-xios",
    seo: {
      canonicalPath: "/el/xoria-xios/mesta-xios/",
      title: "Μεστά Χίος | Μεσαιωνικό καστροχώρι στα Μαστιχοχώρια",
      description: "Ανακαλύψτε τα Μεστά στη Χίο, ένα από τα καλύτερα διατηρημένα μεσαιωνικά καστροχώρια με πέτρινα σοκάκια, καμάρες και αυθεντική ατμόσφαιρα.",
      ogImage: "/images/villages/9ac4cf44d16c4af6d873c5bba4a6696b_L-768x480.webp",
    },
    hero: {
      kicker: "Νότια Χίος • Μαστιχοχώρι",
      title: "Μεστά: το αυθεντικό μεσαιωνικό καστροχώρι",
      description: "Ανακαλύψτε τα Μεστά στη Χίο, ένα από τα καλύτερα διατηρημένα μεσαιωνικά καστροχώρια με πέτρινα σοκάκια, καμάρες και αυθεντική ατμόσφαιρα.",
      image: "/images/villages/9ac4cf44d16c4af6d873c5bba4a6696b_L-768x480.webp",
      tags: ["#mesta", "#medieval_village", "#mastichochoria", "#stone_alleys"],
    },
    details: [
      {
        icon: "📍",
        title: "Τοποθεσία & πρόσβαση",
        text: "Τα Μεστά βρίσκονται στη νότια Χίο, στην καρδιά των Μαστιχοχωρίων, και συνδυάζονται εύκολα με Πυργί, Ολύμπους και Μαύρα Βόλια.",
      },
      {
        icon: "🏘️",
        title: "Χαρακτήρας χωριού",
        text: "Η κλειστή οχυρωμένη δομή, τα πέτρινα στενά και οι καμάρες δημιουργούν μια αίσθηση ταξιδιού στον Μεσαίωνα.",
      },
      {
        icon: "💡",
        title: "Τοπική συμβουλή",
        text: "Μπείτε χωρίς αυστηρό πρόγραμμα στα στενά. Η γοητεία των Μεστών είναι να χαθείτε μέσα στο καστροχώρι.",
      },
    ],
    highlights: {
      title: "Τι να προσέξετε",
      items: [
        "Τα πέτρινα σοκάκια και οι καμάρες",
        "Η πλατεία του χωριού για καφέ ή φαγητό",
        "Η αυθεντική μεσαιωνική δομή"
      ],
    },
    experience: {
      title: "Η εμπειρία",
      paragraphs: [
        "Στο χωριό Μεστά αξίζει να κινηθείτε αργά, να παρατηρήσετε την αρχιτεκτονική και να αφήσετε τη διαδρομή να σας οδηγήσει μέσα στα στενά.",
        "Η επίσκεψη γίνεται ακόμη καλύτερη όταν τη συνδυάσετε με ένα κοντινό χωριό, μια παραλία ή μια στάση για φαγητό.",
      ],
    },
    routeIdeas: {
      title: "Ιδέες διαδρομής",
      items: [
        {
          icon: "🚗",
          title: "Οργανώστε τη διαδρομή",
          text: "Συνδυάστε το χωριό με κοντινά αξιοθέατα, παραλίες ή άλλα χωριά της περιοχής.",
        },
        {
          icon: "🍽️",
          title: "Κρατήστε χρόνο για φαγητό",
          text: "Οι ταβέρνες και τα καφενεία είναι συχνά το καλύτερο μέρος για να νιώσετε την τοπική ζωή.",
        },
        {
          icon: "📷",
          title: "Περπατήστε χωρίς βιασύνη",
          text: "Τα πιο όμορφα σημεία εμφανίζονται όταν αφήσετε το αυτοκίνητο και χαθείτε στα στενά.",
        },
      ],
    },
    baseTip: {
      icon: "🗺️",
      title: "Η στρατηγική σας βάση",
      text: "Με βάση το Voulamandis House στον Κάμπο, μπορείτε να οργανώσετε εύκολα διαδρομές στα χωριά της Χίου, συνδυάζοντας πολιτισμό, παραλίες και τοπικό φαγητό.",
      linkLabel: "Μείνετε με ανθρώπους που γνωρίζουν το νησί.",
      href: "/el/domatia-xios/",
    },
    relatedTitle: "Ανακαλύψτε περισσότερα χωριά της Χίου",
    relatedText: "Γνωρίστε τα Μαστιχοχώρια, τα μεσαιωνικά σοκάκια, τα βόρεια τοπία και τα παραθαλάσσια χωριά της Χίου.",
  },
  {
    slug: "vessa-xios",
    seo: {
      canonicalPath: "/el/xoria-xios/vessa-xios/",
      title: "Βέσσα Χίος | Ήσυχο μεσαιωνικό Μαστιχοχώρι",
      description: "Ανακαλύψτε τη Βέσσα στη Χίο, ένα ήσυχο μεσαιωνικό Μαστιχοχώρι με αυθεντική ατμόσφαιρα, πέτρινα στενά και χαμηλούς ρυθμούς.",
      ogImage: "/images/villages/29651245457_aa8f702ef7_b-768x432.webp",
    },
    hero: {
      kicker: "Νότια Χίος • Ήσυχο Μαστιχοχώρι",
      title: "Βέσσα: ήσυχο μεσαιωνικό Μαστιχοχώρι",
      description: "Ανακαλύψτε τη Βέσσα στη Χίο, ένα ήσυχο μεσαιωνικό Μαστιχοχώρι με αυθεντική ατμόσφαιρα, πέτρινα στενά και χαμηλούς ρυθμούς.",
      image: "/images/villages/29651245457_aa8f702ef7_b-768x432.webp",
      tags: ["#vessa", "#quiet_village", "#mastichochoria", "#authentic_chios"],
    },
    details: [
      {
        icon: "📍",
        title: "Τοποθεσία & πρόσβαση",
        text: "Η Βέσσα βρίσκεται στη νότια Χίο και συνδυάζεται εύκολα με Μεστά, Ολύμπους και τις δυτικές ή νότιες παραλίες.",
      },
      {
        icon: "🏘️",
        title: "Χαρακτήρας χωριού",
        text: "Πιο ήσυχη και λιγότερο τουριστική, η Βέσσα κρατά την αυθεντικότητα των Μαστιχοχωρίων.",
      },
      {
        icon: "💡",
        title: "Τοπική συμβουλή",
        text: "Είναι ιδανική στάση αν θέλετε να δείτε ένα Μαστιχοχώρι πιο ήσυχα, χωρίς την πολυκοσμία των πιο γνωστών χωριών.",
      },
    ],
    highlights: {
      title: "Τι να προσέξετε",
      items: [
        "Ήρεμα πέτρινα σοκάκια",
        "Αυθεντική ατμόσφαιρα Μαστιχοχωρίου",
        "Καλή στάση σε νότια διαδρομή"
      ],
    },
    experience: {
      title: "Η εμπειρία",
      paragraphs: [
        "Στο χωριό Βέσσα αξίζει να κινηθείτε αργά, να παρατηρήσετε την αρχιτεκτονική και να αφήσετε τη διαδρομή να σας οδηγήσει μέσα στα στενά.",
        "Η επίσκεψη γίνεται ακόμη καλύτερη όταν τη συνδυάσετε με ένα κοντινό χωριό, μια παραλία ή μια στάση για φαγητό.",
      ],
    },
    routeIdeas: {
      title: "Ιδέες διαδρομής",
      items: [
        {
          icon: "🚗",
          title: "Οργανώστε τη διαδρομή",
          text: "Συνδυάστε το χωριό με κοντινά αξιοθέατα, παραλίες ή άλλα χωριά της περιοχής.",
        },
        {
          icon: "🍽️",
          title: "Κρατήστε χρόνο για φαγητό",
          text: "Οι ταβέρνες και τα καφενεία είναι συχνά το καλύτερο μέρος για να νιώσετε την τοπική ζωή.",
        },
        {
          icon: "📷",
          title: "Περπατήστε χωρίς βιασύνη",
          text: "Τα πιο όμορφα σημεία εμφανίζονται όταν αφήσετε το αυτοκίνητο και χαθείτε στα στενά.",
        },
      ],
    },
    baseTip: {
      icon: "🗺️",
      title: "Η στρατηγική σας βάση",
      text: "Με βάση το Voulamandis House στον Κάμπο, μπορείτε να οργανώσετε εύκολα διαδρομές στα χωριά της Χίου, συνδυάζοντας πολιτισμό, παραλίες και τοπικό φαγητό.",
      linkLabel: "Μείνετε με ανθρώπους που γνωρίζουν το νησί.",
      href: "/el/domatia-xios/",
    },
    relatedTitle: "Ανακαλύψτε περισσότερα χωριά της Χίου",
    relatedText: "Γνωρίστε τα Μαστιχοχώρια, τα μεσαιωνικά σοκάκια, τα βόρεια τοπία και τα παραθαλάσσια χωριά της Χίου.",
  },
  {
    slug: "olympoi-xios",
    seo: {
      canonicalPath: "/el/xoria-xios/olympoi-xios/",
      title: "Ολύμποι Χίος | Μεσαιωνικό Μαστιχοχώρι & διαδρομή προς Μεστά",
      description: "Ανακαλύψτε τους Ολύμπους στη Χίο, ένα μεσαιωνικό Μαστιχοχώρι με οχυρωμένη δομή, αυθεντικά σοκάκια και ωραία σύνδεση με τα Μεστά.",
      ogImage: "/images/villages/olympoi-1-768x432.webp",
    },
    hero: {
      kicker: "Νότια Χίος • Οχυρωμένο χωριό",
      title: "Ολύμποι: μεσαιωνικό Μαστιχοχώρι με χαρακτήρα",
      description: "Ανακαλύψτε τους Ολύμπους στη Χίο, ένα μεσαιωνικό Μαστιχοχώρι με οχυρωμένη δομή, αυθεντικά σοκάκια και ωραία σύνδεση με τα Μεστά.",
      image: "/images/villages/olympoi-1-768x432.webp",
      tags: ["#olympoi", "#mastic_village", "#medieval_chios", "#south_chios"],
    },
    details: [
      {
        icon: "📍",
        title: "Τοποθεσία & πρόσβαση",
        text: "Οι Ολύμποι βρίσκονται στη νότια Χίο, κοντά στα Μεστά, τη Βέσσα και το Σπήλαιο Ολύμπων.",
      },
      {
        icon: "🏘️",
        title: "Χαρακτήρας χωριού",
        text: "Η μεσαιωνική διάταξη, τα στενά περάσματα και η ήρεμη ατμόσφαιρα το κάνουν ιδανικό για περιήγηση.",
      },
      {
        icon: "💡",
        title: "Τοπική συμβουλή",
        text: "Συνδυάστε τους Ολύμπους με το Σπήλαιο Ολύμπων ή με πεζή/οδική συνέχεια προς τα Μεστά.",
      },
    ],
    highlights: {
      title: "Τι να προσέξετε",
      items: [
        "Η οχυρωμένη μεσαιωνική δομή",
        "Η κοντινή διαδρομή προς Μεστά",
        "Το Σπήλαιο Ολύμπων στην περιοχή"
      ],
    },
    experience: {
      title: "Η εμπειρία",
      paragraphs: [
        "Στο χωριό Ολύμποι αξίζει να κινηθείτε αργά, να παρατηρήσετε την αρχιτεκτονική και να αφήσετε τη διαδρομή να σας οδηγήσει μέσα στα στενά.",
        "Η επίσκεψη γίνεται ακόμη καλύτερη όταν τη συνδυάσετε με ένα κοντινό χωριό, μια παραλία ή μια στάση για φαγητό.",
      ],
    },
    routeIdeas: {
      title: "Ιδέες διαδρομής",
      items: [
        {
          icon: "🚗",
          title: "Οργανώστε τη διαδρομή",
          text: "Συνδυάστε το χωριό με κοντινά αξιοθέατα, παραλίες ή άλλα χωριά της περιοχής.",
        },
        {
          icon: "🍽️",
          title: "Κρατήστε χρόνο για φαγητό",
          text: "Οι ταβέρνες και τα καφενεία είναι συχνά το καλύτερο μέρος για να νιώσετε την τοπική ζωή.",
        },
        {
          icon: "📷",
          title: "Περπατήστε χωρίς βιασύνη",
          text: "Τα πιο όμορφα σημεία εμφανίζονται όταν αφήσετε το αυτοκίνητο και χαθείτε στα στενά.",
        },
      ],
    },
    baseTip: {
      icon: "🗺️",
      title: "Η στρατηγική σας βάση",
      text: "Με βάση το Voulamandis House στον Κάμπο, μπορείτε να οργανώσετε εύκολα διαδρομές στα χωριά της Χίου, συνδυάζοντας πολιτισμό, παραλίες και τοπικό φαγητό.",
      linkLabel: "Μείνετε με ανθρώπους που γνωρίζουν το νησί.",
      href: "/el/domatia-xios/",
    },
    relatedTitle: "Ανακαλύψτε περισσότερα χωριά της Χίου",
    relatedText: "Γνωρίστε τα Μαστιχοχώρια, τα μεσαιωνικά σοκάκια, τα βόρεια τοπία και τα παραθαλάσσια χωριά της Χίου.",
  },
  {
    slug: "volissos-xios",
    seo: {
      canonicalPath: "/el/xoria-xios/volissos-xios/",
      title: "Βολισσός Χίος | Κάστρο, Αμανή και βορειοδυτικές παραλίες",
      description: "Ανακαλύψτε τη Βολισσό στη βορειοδυτική Χίο, ένα ιστορικό χωριό με κάστρο, θέα στην Αμανή και πρόσβαση σε υπέροχες βόρειες παραλίες.",
      ogImage: "/images/villages/Volissos-Chios.webp",
    },
    hero: {
      kicker: "Βορειοδυτική Χίος • Κάστρο",
      title: "Βολισσός: κάστρο και βόρεια Χίος",
      description: "Ανακαλύψτε τη Βολισσό στη βορειοδυτική Χίο, ένα ιστορικό χωριό με κάστρο, θέα στην Αμανή και πρόσβαση σε υπέροχες βόρειες παραλίες.",
      image: "/images/villages/Volissos-Chios.webp",
      tags: ["#volissos", "#north_chios", "#castle", "#amani"],
    },
    details: [
      {
        icon: "📍",
        title: "Τοποθεσία & πρόσβαση",
        text: "Η Βολισσός βρίσκεται στη βορειοδυτική Χίο και αποτελεί βασική βάση για διαδρομές προς Αμανή, Αγία Μαρκέλλα και Λευκάθια.",
      },
      {
        icon: "🏘️",
        title: "Χαρακτήρας χωριού",
        text: "Το κάστρο, τα πέτρινα σπίτια και η ανοιχτή θέα δίνουν στη Βολισσό ξεχωριστό βόρειο χαρακτήρα.",
      },
      {
        icon: "💡",
        title: "Τοπική συμβουλή",
        text: "Μείνετε μέχρι το απόγευμα για όμορφο φως στο κάστρο και συνδυάστε το με μπάνιο στα Λευκάθια.",
      },
    ],
    highlights: {
      title: "Τι να προσέξετε",
      items: [
        "Το κάστρο της Βολισσού",
        "Η θέα προς την Αμανή",
        "Οι κοντινές βορειοδυτικές παραλίες"
      ],
    },
    experience: {
      title: "Η εμπειρία",
      paragraphs: [
        "Στο χωριό Βολισσός αξίζει να κινηθείτε αργά, να παρατηρήσετε την αρχιτεκτονική και να αφήσετε τη διαδρομή να σας οδηγήσει μέσα στα στενά.",
        "Η επίσκεψη γίνεται ακόμη καλύτερη όταν τη συνδυάσετε με ένα κοντινό χωριό, μια παραλία ή μια στάση για φαγητό.",
      ],
    },
    routeIdeas: {
      title: "Ιδέες διαδρομής",
      items: [
        {
          icon: "🚗",
          title: "Οργανώστε τη διαδρομή",
          text: "Συνδυάστε το χωριό με κοντινά αξιοθέατα, παραλίες ή άλλα χωριά της περιοχής.",
        },
        {
          icon: "🍽️",
          title: "Κρατήστε χρόνο για φαγητό",
          text: "Οι ταβέρνες και τα καφενεία είναι συχνά το καλύτερο μέρος για να νιώσετε την τοπική ζωή.",
        },
        {
          icon: "📷",
          title: "Περπατήστε χωρίς βιασύνη",
          text: "Τα πιο όμορφα σημεία εμφανίζονται όταν αφήσετε το αυτοκίνητο και χαθείτε στα στενά.",
        },
      ],
    },
    baseTip: {
      icon: "🗺️",
      title: "Η στρατηγική σας βάση",
      text: "Με βάση το Voulamandis House στον Κάμπο, μπορείτε να οργανώσετε εύκολα διαδρομές στα χωριά της Χίου, συνδυάζοντας πολιτισμό, παραλίες και τοπικό φαγητό.",
      linkLabel: "Μείνετε με ανθρώπους που γνωρίζουν το νησί.",
      href: "/el/domatia-xios/",
    },
    relatedTitle: "Ανακαλύψτε περισσότερα χωριά της Χίου",
    relatedText: "Γνωρίστε τα Μαστιχοχώρια, τα μεσαιωνικά σοκάκια, τα βόρεια τοπία και τα παραθαλάσσια χωριά της Χίου.",
  },
  {
    slug: "armolia-xios",
    seo: {
      canonicalPath: "/el/xoria-xios/armolia-xios/",
      title: "Αρμόλια Χίος | Χωριό κεραμικής και τοπικής τέχνης",
      description: "Ανακαλύψτε τα Αρμόλια στη Χίο, το χωριό της κεραμικής με εργαστήρια, τοπική τέχνη και εύκολη στάση σε διαδρομές προς τα Μαστιχοχώρια.",
      ogImage: "/images/villages/unnamed-e1702830815478.webp",
    },
    hero: {
      kicker: "Νότια Χίος • Κεραμική παράδοση",
      title: "Αρμόλια: το χωριό της κεραμικής",
      description: "Ανακαλύψτε τα Αρμόλια στη Χίο, το χωριό της κεραμικής με εργαστήρια, τοπική τέχνη και εύκολη στάση σε διαδρομές προς τα Μαστιχοχώρια.",
      image: "/images/villages/unnamed-e1702830815478.webp",
      tags: ["#armolia", "#pottery", "#local_crafts", "#south_chios"],
    },
    details: [
      {
        icon: "📍",
        title: "Τοποθεσία & πρόσβαση",
        text: "Τα Αρμόλια βρίσκονται στη νότια Χίο, σε πρακτικό σημείο για διαδρομές προς Πυργί, Μεστά και νότιες παραλίες.",
      },
      {
        icon: "🏘️",
        title: "Χαρακτήρας χωριού",
        text: "Το χωριό είναι γνωστό για την κεραμική του παράδοση και τα μικρά εργαστήρια που κρατούν ζωντανή την τοπική τέχνη.",
      },
      {
        icon: "💡",
        title: "Τοπική συμβουλή",
        text: "Κάντε στάση για να δείτε κεραμικά και να πάρετε ένα μικρό χειροποίητο αναμνηστικό από τη Χίο.",
      },
    ],
    highlights: {
      title: "Τι να προσέξετε",
      items: [
        "Τα κεραμικά εργαστήρια",
        "Η τοπική χειροτεχνία",
        "Η εύκολη στάση προς τα Μαστιχοχώρια"
      ],
    },
    experience: {
      title: "Η εμπειρία",
      paragraphs: [
        "Στο χωριό Αρμόλια αξίζει να κινηθείτε αργά, να παρατηρήσετε την αρχιτεκτονική και να αφήσετε τη διαδρομή να σας οδηγήσει μέσα στα στενά.",
        "Η επίσκεψη γίνεται ακόμη καλύτερη όταν τη συνδυάσετε με ένα κοντινό χωριό, μια παραλία ή μια στάση για φαγητό.",
      ],
    },
    routeIdeas: {
      title: "Ιδέες διαδρομής",
      items: [
        {
          icon: "🚗",
          title: "Οργανώστε τη διαδρομή",
          text: "Συνδυάστε το χωριό με κοντινά αξιοθέατα, παραλίες ή άλλα χωριά της περιοχής.",
        },
        {
          icon: "🍽️",
          title: "Κρατήστε χρόνο για φαγητό",
          text: "Οι ταβέρνες και τα καφενεία είναι συχνά το καλύτερο μέρος για να νιώσετε την τοπική ζωή.",
        },
        {
          icon: "📷",
          title: "Περπατήστε χωρίς βιασύνη",
          text: "Τα πιο όμορφα σημεία εμφανίζονται όταν αφήσετε το αυτοκίνητο και χαθείτε στα στενά.",
        },
      ],
    },
    baseTip: {
      icon: "🗺️",
      title: "Η στρατηγική σας βάση",
      text: "Με βάση το Voulamandis House στον Κάμπο, μπορείτε να οργανώσετε εύκολα διαδρομές στα χωριά της Χίου, συνδυάζοντας πολιτισμό, παραλίες και τοπικό φαγητό.",
      linkLabel: "Μείνετε με ανθρώπους που γνωρίζουν το νησί.",
      href: "/el/domatia-xios/",
    },
    relatedTitle: "Ανακαλύψτε περισσότερα χωριά της Χίου",
    relatedText: "Γνωρίστε τα Μαστιχοχώρια, τα μεσαιωνικά σοκάκια, τα βόρεια τοπία και τα παραθαλάσσια χωριά της Χίου.",
  },
  {
    slug: "lagada-xios",
    seo: {
      canonicalPath: "/el/xoria-xios/lagada-xios/",
      title: "Λαγκάδα Χίος | Παραθαλάσσιο χωριό, λιμάνι και ψαροταβέρνες",
      description: "Ανακαλύψτε τη Λαγκάδα στη Χίο, ένα παραθαλάσσιο χωριό με λιμάνι, θέα στις Οινούσσες, ψαροταβέρνες και χαλαρή τοπική ατμόσφαιρα.",
      ogImage: "/images/villages/lagada_3.webp",
    },
    hero: {
      kicker: "Ανατολική Χίος • Παραθαλάσσιο χωριό",
      title: "Λαγκάδα: λιμάνι, θάλασσα και ψαροταβέρνες",
      description: "Ανακαλύψτε τη Λαγκάδα στη Χίο, ένα παραθαλάσσιο χωριό με λιμάνι, θέα στις Οινούσσες, ψαροταβέρνες και χαλαρή τοπική ατμόσφαιρα.",
      image: "/images/villages/lagada_3.webp",
      tags: ["#lagada", "#seaside_village", "#fish_taverns", "#oinousses_views"],
    },
    details: [
      {
        icon: "📍",
        title: "Τοποθεσία & πρόσβαση",
        text: "Η Λαγκάδα βρίσκεται στην ανατολική πλευρά της Χίου και είναι καλή επιλογή για χαλαρή βόλτα και φαγητό δίπλα στη θάλασσα.",
      },
      {
        icon: "🏘️",
        title: "Χαρακτήρας χωριού",
        text: "Το μικρό λιμάνι, οι ψαρόβαρκες και οι ταβέρνες δίνουν στη Λαγκάδα αυθεντικό παραθαλάσσιο χαρακτήρα.",
      },
      {
        icon: "💡",
        title: "Τοπική συμβουλή",
        text: "Ελάτε για μεσημεριανό ή βραδινό δίπλα στο λιμάνι και απολαύστε θέα προς τις Οινούσσες.",
      },
    ],
    highlights: {
      title: "Τι να προσέξετε",
      items: [
        "Το μικρό λιμάνι",
        "Οι ψαροταβέρνες",
        "Η θέα προς τις Οινούσσες"
      ],
    },
    experience: {
      title: "Η εμπειρία",
      paragraphs: [
        "Στο χωριό Λαγκάδα αξίζει να κινηθείτε αργά, να παρατηρήσετε την αρχιτεκτονική και να αφήσετε τη διαδρομή να σας οδηγήσει μέσα στα στενά.",
        "Η επίσκεψη γίνεται ακόμη καλύτερη όταν τη συνδυάσετε με ένα κοντινό χωριό, μια παραλία ή μια στάση για φαγητό.",
      ],
    },
    routeIdeas: {
      title: "Ιδέες διαδρομής",
      items: [
        {
          icon: "🚗",
          title: "Οργανώστε τη διαδρομή",
          text: "Συνδυάστε το χωριό με κοντινά αξιοθέατα, παραλίες ή άλλα χωριά της περιοχής.",
        },
        {
          icon: "🍽️",
          title: "Κρατήστε χρόνο για φαγητό",
          text: "Οι ταβέρνες και τα καφενεία είναι συχνά το καλύτερο μέρος για να νιώσετε την τοπική ζωή.",
        },
        {
          icon: "📷",
          title: "Περπατήστε χωρίς βιασύνη",
          text: "Τα πιο όμορφα σημεία εμφανίζονται όταν αφήσετε το αυτοκίνητο και χαθείτε στα στενά.",
        },
      ],
    },
    baseTip: {
      icon: "🗺️",
      title: "Η στρατηγική σας βάση",
      text: "Με βάση το Voulamandis House στον Κάμπο, μπορείτε να οργανώσετε εύκολα διαδρομές στα χωριά της Χίου, συνδυάζοντας πολιτισμό, παραλίες και τοπικό φαγητό.",
      linkLabel: "Μείνετε με ανθρώπους που γνωρίζουν το νησί.",
      href: "/el/domatia-xios/",
    },
    relatedTitle: "Ανακαλύψτε περισσότερα χωριά της Χίου",
    relatedText: "Γνωρίστε τα Μαστιχοχώρια, τα μεσαιωνικά σοκάκια, τα βόρεια τοπία και τα παραθαλάσσια χωριά της Χίου.",
  },
  // FR localized villages,
  {
    slug: "village-pyrgi",
    seo: {
      canonicalPath: "/fr/villages-de-chios/village-pyrgi/",
      title: "Pyrgi Chios | Le village médiéval peint",
      description: "Découvrez Pyrgi à Chios, le célèbre village médiéval peint, connu pour ses motifs noirs et blancs, ses ruelles étroites et son identité de village du mastic.",
      ogImage: "/images/villages/29651245457_aa8f702ef7_b-768x432.webp",
    },
    hero: {
      kicker: "Sud de Chios • Village du mastic",
      title: "Pyrgi : le village peint de Chios",
      description: "Découvrez Pyrgi à Chios, le célèbre village médiéval peint, connu pour ses motifs noirs et blancs, ses ruelles étroites et son identité de village du mastic.",
      image: "/images/villages/29651245457_aa8f702ef7_b-768x432.webp",
      tags: ["#pyrgi", "#mastic_village", "#xysta", "#medieval_chios"],
    },
    details: [
      {
        icon: "📍",
        title: "Emplacement & accès",
        text: "Pyrgi se trouve au sud de Chios, à environ 25 km de la ville, et constitue une étape essentielle dans les villages du mastic.",
      },
      {
        icon: "🏘️",
        title: "Caractère du village",
        text: "Les façades décorées de xysta, les motifs géométriques et le plan médiéval rendent le village unique en Grèce.",
      },
      {
        icon: "💡",
        title: "Conseil local",
        text: "Allez-y tôt ou en fin d’après-midi pour une meilleure lumière et une promenade plus calme dans les ruelles.",
      },
    ],
    highlights: {
      title: "À ne pas manquer",
      items: [
        "Les façades noires et blanches décorées",
        "La place centrale avec cafés et vie locale",
        "L’atmosphère des villages du mastic"
      ],
    },
    experience: {
      title: "L’expérience",
      paragraphs: [
        "À Pyrgi, prenez le temps de marcher lentement, d’observer l’architecture et de laisser les ruelles guider votre visite.",
        "La visite devient encore plus agréable si vous la combinez avec un autre village, une plage proche ou un arrêt gourmand.",
      ],
    },
    routeIdeas: {
      title: "Idées d’itinéraire",
      items: [
        {
          icon: "🚗",
          title: "Organisez votre route",
          text: "Combinez le village avec des sites, plages ou autres villages proches.",
        },
        {
          icon: "🍽️",
          title: "Gardez du temps pour manger",
          text: "Les tavernes et cafés sont souvent les meilleurs endroits pour sentir la vie locale.",
        },
        {
          icon: "📷",
          title: "Marchez sans vous presser",
          text: "Les plus beaux détails apparaissent quand vous laissez la voiture et vous perdez dans les ruelles.",
        },
      ],
    },
    baseTip: {
      icon: "🗺️",
      title: "Votre base stratégique",
      text: "Depuis Voulamandis House à Kampos, vous pouvez organiser facilement vos itinéraires dans les villages de Chios, entre culture, plages et cuisine locale.",
      linkLabel: "Séjournez avec ceux qui connaissent le mieux l’île.",
      href: "/fr/chambres-a-chios/",
    },
    relatedTitle: "Découvrez plus de villages de Chios",
    relatedText: "Explorez les villages du mastic, les ruelles médiévales, les paysages du nord et les villages de bord de mer.",
  },
  {
    slug: "village-mesta",
    seo: {
      canonicalPath: "/fr/villages-de-chios/village-mesta/",
      title: "Mesta Chios | Village fortifié médiéval du mastic",
      description: "Découvrez Mesta à Chios, l’un des villages fortifiés médiévaux les mieux préservés, avec ruelles en pierre, passages voûtés et atmosphère authentique.",
      ogImage: "/images/villages/9ac4cf44d16c4af6d873c5bba4a6696b_L-768x480.webp",
    },
    hero: {
      kicker: "Sud de Chios • Village fortifié",
      title: "Mesta : le village-forteresse médiéval",
      description: "Découvrez Mesta à Chios, l’un des villages fortifiés médiévaux les mieux préservés, avec ruelles en pierre, passages voûtés et atmosphère authentique.",
      image: "/images/villages/9ac4cf44d16c4af6d873c5bba4a6696b_L-768x480.webp",
      tags: ["#mesta", "#medieval_village", "#mastichochoria", "#stone_alleys"],
    },
    details: [
      {
        icon: "📍",
        title: "Emplacement & accès",
        text: "Mesta se trouve au sud de Chios, au cœur des villages du mastic, et se combine facilement avec Pyrgi, Olympoi et Mavra Volia.",
      },
      {
        icon: "🏘️",
        title: "Caractère du village",
        text: "La structure fortifiée, les ruelles en pierre et les arches donnent l’impression de voyager au Moyen Âge.",
      },
      {
        icon: "💡",
        title: "Conseil local",
        text: "Entrez dans les ruelles sans programme strict. Le charme de Mesta est de se perdre dans le village-forteresse.",
      },
    ],
    highlights: {
      title: "À ne pas manquer",
      items: [
        "Les ruelles en pierre et les arches",
        "La place du village pour un café ou un repas",
        "La structure médiévale authentique"
      ],
    },
    experience: {
      title: "L’expérience",
      paragraphs: [
        "À Mesta, prenez le temps de marcher lentement, d’observer l’architecture et de laisser les ruelles guider votre visite.",
        "La visite devient encore plus agréable si vous la combinez avec un autre village, une plage proche ou un arrêt gourmand.",
      ],
    },
    routeIdeas: {
      title: "Idées d’itinéraire",
      items: [
        {
          icon: "🚗",
          title: "Organisez votre route",
          text: "Combinez le village avec des sites, plages ou autres villages proches.",
        },
        {
          icon: "🍽️",
          title: "Gardez du temps pour manger",
          text: "Les tavernes et cafés sont souvent les meilleurs endroits pour sentir la vie locale.",
        },
        {
          icon: "📷",
          title: "Marchez sans vous presser",
          text: "Les plus beaux détails apparaissent quand vous laissez la voiture et vous perdez dans les ruelles.",
        },
      ],
    },
    baseTip: {
      icon: "🗺️",
      title: "Votre base stratégique",
      text: "Depuis Voulamandis House à Kampos, vous pouvez organiser facilement vos itinéraires dans les villages de Chios, entre culture, plages et cuisine locale.",
      linkLabel: "Séjournez avec ceux qui connaissent le mieux l’île.",
      href: "/fr/chambres-a-chios/",
    },
    relatedTitle: "Découvrez plus de villages de Chios",
    relatedText: "Explorez les villages du mastic, les ruelles médiévales, les paysages du nord et les villages de bord de mer.",
  },
  {
    slug: "village-vessa",
    seo: {
      canonicalPath: "/fr/villages-de-chios/village-vessa/",
      title: "Vessa Chios | Village médiéval tranquille du mastic",
      description: "Découvrez Vessa à Chios, un village médiéval du mastic paisible, avec atmosphère authentique, ruelles en pierre et rythme lent.",
      ogImage: "/images/villages/29651245457_aa8f702ef7_b-768x432.webp",
    },
    hero: {
      kicker: "Sud de Chios • Village calme",
      title: "Vessa : village médiéval paisible",
      description: "Découvrez Vessa à Chios, un village médiéval du mastic paisible, avec atmosphère authentique, ruelles en pierre et rythme lent.",
      image: "/images/villages/29651245457_aa8f702ef7_b-768x432.webp",
      tags: ["#vessa", "#quiet_village", "#mastichochoria", "#authentic_chios"],
    },
    details: [
      {
        icon: "📍",
        title: "Emplacement & accès",
        text: "Vessa se trouve au sud de Chios et se combine facilement avec Mesta, Olympoi et les plages de l’ouest ou du sud.",
      },
      {
        icon: "🏘️",
        title: "Caractère du village",
        text: "Plus calme et moins touristique, Vessa conserve l’authenticité des villages du mastic.",
      },
      {
        icon: "💡",
        title: "Conseil local",
        text: "C’est une halte idéale pour voir un village du mastic plus tranquillement, sans la foule des villages les plus connus.",
      },
    ],
    highlights: {
      title: "À ne pas manquer",
      items: [
        "Ruelles en pierre paisibles",
        "Atmosphère authentique de village du mastic",
        "Bonne étape sur une route du sud"
      ],
    },
    experience: {
      title: "L’expérience",
      paragraphs: [
        "À Vessa, prenez le temps de marcher lentement, d’observer l’architecture et de laisser les ruelles guider votre visite.",
        "La visite devient encore plus agréable si vous la combinez avec un autre village, une plage proche ou un arrêt gourmand.",
      ],
    },
    routeIdeas: {
      title: "Idées d’itinéraire",
      items: [
        {
          icon: "🚗",
          title: "Organisez votre route",
          text: "Combinez le village avec des sites, plages ou autres villages proches.",
        },
        {
          icon: "🍽️",
          title: "Gardez du temps pour manger",
          text: "Les tavernes et cafés sont souvent les meilleurs endroits pour sentir la vie locale.",
        },
        {
          icon: "📷",
          title: "Marchez sans vous presser",
          text: "Les plus beaux détails apparaissent quand vous laissez la voiture et vous perdez dans les ruelles.",
        },
      ],
    },
    baseTip: {
      icon: "🗺️",
      title: "Votre base stratégique",
      text: "Depuis Voulamandis House à Kampos, vous pouvez organiser facilement vos itinéraires dans les villages de Chios, entre culture, plages et cuisine locale.",
      linkLabel: "Séjournez avec ceux qui connaissent le mieux l’île.",
      href: "/fr/chambres-a-chios/",
    },
    relatedTitle: "Découvrez plus de villages de Chios",
    relatedText: "Explorez les villages du mastic, les ruelles médiévales, les paysages du nord et les villages de bord de mer.",
  },
  {
    slug: "village-olympoi",
    seo: {
      canonicalPath: "/fr/villages-de-chios/village-olympoi/",
      title: "Olympoi Chios | Village médiéval du mastic et route vers Mesta",
      description: "Découvrez Olympoi à Chios, un village médiéval du mastic avec structure fortifiée, ruelles authentiques et belle connexion avec Mesta.",
      ogImage: "/images/villages/olympoi-1-768x432.webp",
    },
    hero: {
      kicker: "Sud de Chios • Village fortifié",
      title: "Olympoi : village médiéval du mastic",
      description: "Découvrez Olympoi à Chios, un village médiéval du mastic avec structure fortifiée, ruelles authentiques et belle connexion avec Mesta.",
      image: "/images/villages/olympoi-1-768x432.webp",
      tags: ["#olympoi", "#mastic_village", "#medieval_chios", "#south_chios"],
    },
    details: [
      {
        icon: "📍",
        title: "Emplacement & accès",
        text: "Olympoi se trouve au sud de Chios, près de Mesta, Vessa et de la grotte d’Olympoi.",
      },
      {
        icon: "🏘️",
        title: "Caractère du village",
        text: "Son plan médiéval, ses passages étroits et son atmosphère calme en font un village idéal à explorer.",
      },
      {
        icon: "💡",
        title: "Conseil local",
        text: "Combinez Olympoi avec la grotte d’Olympoi ou continuez vers Mesta à pied ou en voiture.",
      },
    ],
    highlights: {
      title: "À ne pas manquer",
      items: [
        "La structure médiévale fortifiée",
        "La route proche vers Mesta",
        "La grotte d’Olympoi dans la région"
      ],
    },
    experience: {
      title: "L’expérience",
      paragraphs: [
        "À Olympoi, prenez le temps de marcher lentement, d’observer l’architecture et de laisser les ruelles guider votre visite.",
        "La visite devient encore plus agréable si vous la combinez avec un autre village, une plage proche ou un arrêt gourmand.",
      ],
    },
    routeIdeas: {
      title: "Idées d’itinéraire",
      items: [
        {
          icon: "🚗",
          title: "Organisez votre route",
          text: "Combinez le village avec des sites, plages ou autres villages proches.",
        },
        {
          icon: "🍽️",
          title: "Gardez du temps pour manger",
          text: "Les tavernes et cafés sont souvent les meilleurs endroits pour sentir la vie locale.",
        },
        {
          icon: "📷",
          title: "Marchez sans vous presser",
          text: "Les plus beaux détails apparaissent quand vous laissez la voiture et vous perdez dans les ruelles.",
        },
      ],
    },
    baseTip: {
      icon: "🗺️",
      title: "Votre base stratégique",
      text: "Depuis Voulamandis House à Kampos, vous pouvez organiser facilement vos itinéraires dans les villages de Chios, entre culture, plages et cuisine locale.",
      linkLabel: "Séjournez avec ceux qui connaissent le mieux l’île.",
      href: "/fr/chambres-a-chios/",
    },
    relatedTitle: "Découvrez plus de villages de Chios",
    relatedText: "Explorez les villages du mastic, les ruelles médiévales, les paysages du nord et les villages de bord de mer.",
  },
  {
    slug: "village-volissos",
    seo: {
      canonicalPath: "/fr/villages-de-chios/village-volissos/",
      title: "Volissos Chios | Château, Amani et plages du nord-ouest",
      description: "Découvrez Volissos au nord-ouest de Chios, un village historique avec château, vues sur Amani et accès à de belles plages du nord.",
      ogImage: "/images/villages/Volissos-Chios.webp",
    },
    hero: {
      kicker: "Nord-ouest de Chios • Château",
      title: "Volissos : château et nord de Chios",
      description: "Découvrez Volissos au nord-ouest de Chios, un village historique avec château, vues sur Amani et accès à de belles plages du nord.",
      image: "/images/villages/Volissos-Chios.webp",
      tags: ["#volissos", "#north_chios", "#castle", "#amani"],
    },
    details: [
      {
        icon: "📍",
        title: "Emplacement & accès",
        text: "Volissos se situe au nord-ouest de Chios et sert de base pour Amani, Agia Markella et Lefkathia.",
      },
      {
        icon: "🏘️",
        title: "Caractère du village",
        text: "Le château, les maisons en pierre et les vues ouvertes donnent à Volissos un caractère nordique distinct.",
      },
      {
        icon: "💡",
        title: "Conseil local",
        text: "Restez jusqu’à l’après-midi pour une belle lumière sur le château et combinez la visite avec Lefkathia.",
      },
    ],
    highlights: {
      title: "À ne pas manquer",
      items: [
        "Le château de Volissos",
        "Les vues vers Amani",
        "Les plages proches du nord-ouest"
      ],
    },
    experience: {
      title: "L’expérience",
      paragraphs: [
        "À Volissos, prenez le temps de marcher lentement, d’observer l’architecture et de laisser les ruelles guider votre visite.",
        "La visite devient encore plus agréable si vous la combinez avec un autre village, une plage proche ou un arrêt gourmand.",
      ],
    },
    routeIdeas: {
      title: "Idées d’itinéraire",
      items: [
        {
          icon: "🚗",
          title: "Organisez votre route",
          text: "Combinez le village avec des sites, plages ou autres villages proches.",
        },
        {
          icon: "🍽️",
          title: "Gardez du temps pour manger",
          text: "Les tavernes et cafés sont souvent les meilleurs endroits pour sentir la vie locale.",
        },
        {
          icon: "📷",
          title: "Marchez sans vous presser",
          text: "Les plus beaux détails apparaissent quand vous laissez la voiture et vous perdez dans les ruelles.",
        },
      ],
    },
    baseTip: {
      icon: "🗺️",
      title: "Votre base stratégique",
      text: "Depuis Voulamandis House à Kampos, vous pouvez organiser facilement vos itinéraires dans les villages de Chios, entre culture, plages et cuisine locale.",
      linkLabel: "Séjournez avec ceux qui connaissent le mieux l’île.",
      href: "/fr/chambres-a-chios/",
    },
    relatedTitle: "Découvrez plus de villages de Chios",
    relatedText: "Explorez les villages du mastic, les ruelles médiévales, les paysages du nord et les villages de bord de mer.",
  },
  {
    slug: "village-armolia",
    seo: {
      canonicalPath: "/fr/villages-de-chios/village-armolia/",
      title: "Armolia Chios | Village de poterie et artisanat local",
      description: "Découvrez Armolia à Chios, le village de la poterie avec ateliers, artisanat local et halte facile vers les villages du mastic.",
      ogImage: "/images/villages/unnamed-e1702830815478.webp",
    },
    hero: {
      kicker: "Sud de Chios • Tradition de poterie",
      title: "Armolia : le village de la poterie",
      description: "Découvrez Armolia à Chios, le village de la poterie avec ateliers, artisanat local et halte facile vers les villages du mastic.",
      image: "/images/villages/unnamed-e1702830815478.webp",
      tags: ["#armolia", "#pottery", "#local_crafts", "#south_chios"],
    },
    details: [
      {
        icon: "📍",
        title: "Emplacement & accès",
        text: "Armolia se trouve au sud de Chios, à un point pratique pour Pyrgi, Mesta et les plages du sud.",
      },
      {
        icon: "🏘️",
        title: "Caractère du village",
        text: "Le village est connu pour sa tradition de poterie et ses petits ateliers qui gardent l’artisanat local vivant.",
      },
      {
        icon: "💡",
        title: "Conseil local",
        text: "Faites une pause pour voir les céramiques et rapporter un petit souvenir artisanal de Chios.",
      },
    ],
    highlights: {
      title: "À ne pas manquer",
      items: [
        "Les ateliers de poterie",
        "L’artisanat local",
        "Une halte facile vers les villages du mastic"
      ],
    },
    experience: {
      title: "L’expérience",
      paragraphs: [
        "À Armolia, prenez le temps de marcher lentement, d’observer l’architecture et de laisser les ruelles guider votre visite.",
        "La visite devient encore plus agréable si vous la combinez avec un autre village, une plage proche ou un arrêt gourmand.",
      ],
    },
    routeIdeas: {
      title: "Idées d’itinéraire",
      items: [
        {
          icon: "🚗",
          title: "Organisez votre route",
          text: "Combinez le village avec des sites, plages ou autres villages proches.",
        },
        {
          icon: "🍽️",
          title: "Gardez du temps pour manger",
          text: "Les tavernes et cafés sont souvent les meilleurs endroits pour sentir la vie locale.",
        },
        {
          icon: "📷",
          title: "Marchez sans vous presser",
          text: "Les plus beaux détails apparaissent quand vous laissez la voiture et vous perdez dans les ruelles.",
        },
      ],
    },
    baseTip: {
      icon: "🗺️",
      title: "Votre base stratégique",
      text: "Depuis Voulamandis House à Kampos, vous pouvez organiser facilement vos itinéraires dans les villages de Chios, entre culture, plages et cuisine locale.",
      linkLabel: "Séjournez avec ceux qui connaissent le mieux l’île.",
      href: "/fr/chambres-a-chios/",
    },
    relatedTitle: "Découvrez plus de villages de Chios",
    relatedText: "Explorez les villages du mastic, les ruelles médiévales, les paysages du nord et les villages de bord de mer.",
  },
  {
    slug: "village-lagada",
    seo: {
      canonicalPath: "/fr/villages-de-chios/village-lagada/",
      title: "Lagada Chios | Village de bord de mer, port et tavernes de poisson",
      description: "Découvrez Lagada à Chios, un village de bord de mer avec port, vues vers Oinousses, tavernes de poisson et atmosphère locale détendue.",
      ogImage: "/images/villages/lagada_3.webp",
    },
    hero: {
      kicker: "Est de Chios • Village de bord de mer",
      title: "Lagada : port, mer et tavernes de poisson",
      description: "Découvrez Lagada à Chios, un village de bord de mer avec port, vues vers Oinousses, tavernes de poisson et atmosphère locale détendue.",
      image: "/images/villages/lagada_3.webp",
      tags: ["#lagada", "#seaside_village", "#fish_taverns", "#oinousses_views"],
    },
    details: [
      {
        icon: "📍",
        title: "Emplacement & accès",
        text: "Lagada se trouve sur la côte est de Chios et convient bien à une promenade détendue et un repas au bord de la mer.",
      },
      {
        icon: "🏘️",
        title: "Caractère du village",
        text: "Le petit port, les bateaux de pêche et les tavernes donnent à Lagada un caractère maritime authentique.",
      },
      {
        icon: "💡",
        title: "Conseil local",
        text: "Venez pour déjeuner ou dîner près du port et profitez de la vue vers Oinousses.",
      },
    ],
    highlights: {
      title: "À ne pas manquer",
      items: [
        "Le petit port",
        "Les tavernes de poisson",
        "La vue vers Oinousses"
      ],
    },
    experience: {
      title: "L’expérience",
      paragraphs: [
        "À Lagada, prenez le temps de marcher lentement, d’observer l’architecture et de laisser les ruelles guider votre visite.",
        "La visite devient encore plus agréable si vous la combinez avec un autre village, une plage proche ou un arrêt gourmand.",
      ],
    },
    routeIdeas: {
      title: "Idées d’itinéraire",
      items: [
        {
          icon: "🚗",
          title: "Organisez votre route",
          text: "Combinez le village avec des sites, plages ou autres villages proches.",
        },
        {
          icon: "🍽️",
          title: "Gardez du temps pour manger",
          text: "Les tavernes et cafés sont souvent les meilleurs endroits pour sentir la vie locale.",
        },
        {
          icon: "📷",
          title: "Marchez sans vous presser",
          text: "Les plus beaux détails apparaissent quand vous laissez la voiture et vous perdez dans les ruelles.",
        },
      ],
    },
    baseTip: {
      icon: "🗺️",
      title: "Votre base stratégique",
      text: "Depuis Voulamandis House à Kampos, vous pouvez organiser facilement vos itinéraires dans les villages de Chios, entre culture, plages et cuisine locale.",
      linkLabel: "Séjournez avec ceux qui connaissent le mieux l’île.",
      href: "/fr/chambres-a-chios/",
    },
    relatedTitle: "Découvrez plus de villages de Chios",
    relatedText: "Explorez les villages du mastic, les ruelles médiévales, les paysages du nord et les villages de bord de mer.",
  },
  // DE localized villages,
  {
    slug: "pyrgi-dorf",
    seo: {
      canonicalPath: "/de/doerfer-chios/pyrgi-dorf/",
      title: "Pyrgi Chios | Das bemalte mittelalterliche Dorf",
      description: "Entdecken Sie Pyrgi auf Chios, das berühmte bemalte mittelalterliche Dorf mit schwarz-weißen Xysta-Mustern, engen Gassen und Mastixdorf-Charakter.",
      ogImage: "/images/villages/29651245457_aa8f702ef7_b-768x432.webp",
    },
    hero: {
      kicker: "Süd-Chios • Mastixdorf",
      title: "Pyrgi: das bemalte Dorf von Chios",
      description: "Entdecken Sie Pyrgi auf Chios, das berühmte bemalte mittelalterliche Dorf mit schwarz-weißen Xysta-Mustern, engen Gassen und Mastixdorf-Charakter.",
      image: "/images/villages/29651245457_aa8f702ef7_b-768x432.webp",
      tags: ["#pyrgi", "#mastic_village", "#xysta", "#medieval_chios"],
    },
    details: [
      {
        icon: "📍",
        title: "Lage & Zugang",
        text: "Pyrgi liegt im Süden von Chios, etwa 25 km von Chios-Stadt entfernt, und ist ein wichtiger Halt auf jeder Route durch die Mastixdörfer.",
      },
      {
        icon: "🏘️",
        title: "Dorfcharakter",
        text: "Die Xysta-Fassaden, geometrischen Muster und mittelalterliche Struktur machen das Dorf in Griechenland einzigartig.",
      },
      {
        icon: "💡",
        title: "Lokaler Tipp",
        text: "Besuchen Sie Pyrgi früh oder am späten Nachmittag für besseres Licht und ruhigere Spaziergänge durch die Gassen.",
      },
    ],
    highlights: {
      title: "Besonders sehenswert",
      items: [
        "Die schwarz-weißen Xysta-Fassaden",
        "Der zentrale Platz mit Cafés und lokalem Leben",
        "Die Atmosphäre der Mastixdörfer"
      ],
    },
    experience: {
      title: "Das Erlebnis",
      paragraphs: [
        "In Pyrgi lohnt es sich, langsam zu gehen, die Architektur zu beobachten und sich von den Gassen führen zu lassen.",
        "Der Besuch wird noch schöner, wenn Sie ihn mit einem weiteren Dorf, einem Strand oder einer Essenspause verbinden.",
      ],
    },
    routeIdeas: {
      title: "Routenideen",
      items: [
        {
          icon: "🚗",
          title: "Route planen",
          text: "Verbinden Sie das Dorf mit nahe gelegenen Sehenswürdigkeiten, Stränden oder weiteren Dörfern.",
        },
        {
          icon: "🍽️",
          title: "Zeit zum Essen einplanen",
          text: "Tavernen und Cafés sind oft die besten Orte, um das lokale Leben zu spüren.",
        },
        {
          icon: "📷",
          title: "Langsam spazieren",
          text: "Die schönsten Details entdeckt man, wenn man das Auto stehen lässt und durch die Gassen geht.",
        },
      ],
    },
    baseTip: {
      icon: "🗺️",
      title: "Ihre strategische Basis",
      text: "Von Voulamandis House in Kampos aus können Sie Ihre Routen durch die Dörfer von Chios gut planen und Kultur, Strände und lokales Essen verbinden.",
      linkLabel: "Übernachten Sie bei Menschen, die die Insel kennen.",
      href: "/de/chios-zimmer/",
    },
    relatedTitle: "Weitere Dörfer auf Chios entdecken",
    relatedText: "Entdecken Sie Mastixdörfer, mittelalterliche Gassen, nördliche Landschaften und Dörfer am Meer.",
  },
  {
    slug: "mesta-dorf",
    seo: {
      canonicalPath: "/de/doerfer-chios/mesta-dorf/",
      title: "Mesta Chios | Mittelalterliches Festungsdorf",
      description: "Entdecken Sie Mesta auf Chios, eines der am besten erhaltenen mittelalterlichen Festungsdörfer mit Steingassen, Bögen und authentischer Atmosphäre.",
      ogImage: "/images/villages/9ac4cf44d16c4af6d873c5bba4a6696b_L-768x480.webp",
    },
    hero: {
      kicker: "Süd-Chios • Festungsdorf",
      title: "Mesta: das mittelalterliche Festungsdorf",
      description: "Entdecken Sie Mesta auf Chios, eines der am besten erhaltenen mittelalterlichen Festungsdörfer mit Steingassen, Bögen und authentischer Atmosphäre.",
      image: "/images/villages/9ac4cf44d16c4af6d873c5bba4a6696b_L-768x480.webp",
      tags: ["#mesta", "#medieval_village", "#mastichochoria", "#stone_alleys"],
    },
    details: [
      {
        icon: "📍",
        title: "Lage & Zugang",
        text: "Mesta liegt im Süden von Chios, im Herzen der Mastixdörfer, und lässt sich gut mit Pyrgi, Olympoi und Mavra Volia verbinden.",
      },
      {
        icon: "🏘️",
        title: "Dorfcharakter",
        text: "Die geschlossene Festungsstruktur, Steingassen und Bögen vermitteln das Gefühl einer Reise ins Mittelalter.",
      },
      {
        icon: "💡",
        title: "Lokaler Tipp",
        text: "Gehen Sie ohne festen Plan durch die Gassen. Der Reiz von Mesta liegt darin, sich im Festungsdorf zu verlieren.",
      },
    ],
    highlights: {
      title: "Besonders sehenswert",
      items: [
        "Steingassen und Bögen",
        "Der Dorfplatz für Kaffee oder Essen",
        "Die authentische mittelalterliche Struktur"
      ],
    },
    experience: {
      title: "Das Erlebnis",
      paragraphs: [
        "In Mesta lohnt es sich, langsam zu gehen, die Architektur zu beobachten und sich von den Gassen führen zu lassen.",
        "Der Besuch wird noch schöner, wenn Sie ihn mit einem weiteren Dorf, einem Strand oder einer Essenspause verbinden.",
      ],
    },
    routeIdeas: {
      title: "Routenideen",
      items: [
        {
          icon: "🚗",
          title: "Route planen",
          text: "Verbinden Sie das Dorf mit nahe gelegenen Sehenswürdigkeiten, Stränden oder weiteren Dörfern.",
        },
        {
          icon: "🍽️",
          title: "Zeit zum Essen einplanen",
          text: "Tavernen und Cafés sind oft die besten Orte, um das lokale Leben zu spüren.",
        },
        {
          icon: "📷",
          title: "Langsam spazieren",
          text: "Die schönsten Details entdeckt man, wenn man das Auto stehen lässt und durch die Gassen geht.",
        },
      ],
    },
    baseTip: {
      icon: "🗺️",
      title: "Ihre strategische Basis",
      text: "Von Voulamandis House in Kampos aus können Sie Ihre Routen durch die Dörfer von Chios gut planen und Kultur, Strände und lokales Essen verbinden.",
      linkLabel: "Übernachten Sie bei Menschen, die die Insel kennen.",
      href: "/de/chios-zimmer/",
    },
    relatedTitle: "Weitere Dörfer auf Chios entdecken",
    relatedText: "Entdecken Sie Mastixdörfer, mittelalterliche Gassen, nördliche Landschaften und Dörfer am Meer.",
  },
  {
    slug: "vessa-dorf",
    seo: {
      canonicalPath: "/de/doerfer-chios/vessa-dorf/",
      title: "Vessa Chios | Ruhiges mittelalterliches Mastixdorf",
      description: "Entdecken Sie Vessa auf Chios, ein ruhiges mittelalterliches Mastixdorf mit authentischer Atmosphäre, Steingassen und langsamem Rhythmus.",
      ogImage: "/images/villages/29651245457_aa8f702ef7_b-768x432.webp",
    },
    hero: {
      kicker: "Süd-Chios • Ruhiges Mastixdorf",
      title: "Vessa: ruhiges mittelalterliches Mastixdorf",
      description: "Entdecken Sie Vessa auf Chios, ein ruhiges mittelalterliches Mastixdorf mit authentischer Atmosphäre, Steingassen und langsamem Rhythmus.",
      image: "/images/villages/29651245457_aa8f702ef7_b-768x432.webp",
      tags: ["#vessa", "#quiet_village", "#mastichochoria", "#authentic_chios"],
    },
    details: [
      {
        icon: "📍",
        title: "Lage & Zugang",
        text: "Vessa liegt im Süden von Chios und lässt sich gut mit Mesta, Olympoi sowie westlichen oder südlichen Stränden verbinden.",
      },
      {
        icon: "🏘️",
        title: "Dorfcharakter",
        text: "Ruhiger und weniger touristisch bewahrt Vessa die Authentizität der Mastixdörfer.",
      },
      {
        icon: "💡",
        title: "Lokaler Tipp",
        text: "Ideal, wenn Sie ein Mastixdorf ruhiger erleben möchten, ohne die Besucher der bekannteren Dörfer.",
      },
    ],
    highlights: {
      title: "Besonders sehenswert",
      items: [
        "Ruhige Steingassen",
        "Authentische Mastixdorf-Atmosphäre",
        "Guter Halt auf einer Südroute"
      ],
    },
    experience: {
      title: "Das Erlebnis",
      paragraphs: [
        "In Vessa lohnt es sich, langsam zu gehen, die Architektur zu beobachten und sich von den Gassen führen zu lassen.",
        "Der Besuch wird noch schöner, wenn Sie ihn mit einem weiteren Dorf, einem Strand oder einer Essenspause verbinden.",
      ],
    },
    routeIdeas: {
      title: "Routenideen",
      items: [
        {
          icon: "🚗",
          title: "Route planen",
          text: "Verbinden Sie das Dorf mit nahe gelegenen Sehenswürdigkeiten, Stränden oder weiteren Dörfern.",
        },
        {
          icon: "🍽️",
          title: "Zeit zum Essen einplanen",
          text: "Tavernen und Cafés sind oft die besten Orte, um das lokale Leben zu spüren.",
        },
        {
          icon: "📷",
          title: "Langsam spazieren",
          text: "Die schönsten Details entdeckt man, wenn man das Auto stehen lässt und durch die Gassen geht.",
        },
      ],
    },
    baseTip: {
      icon: "🗺️",
      title: "Ihre strategische Basis",
      text: "Von Voulamandis House in Kampos aus können Sie Ihre Routen durch die Dörfer von Chios gut planen und Kultur, Strände und lokales Essen verbinden.",
      linkLabel: "Übernachten Sie bei Menschen, die die Insel kennen.",
      href: "/de/chios-zimmer/",
    },
    relatedTitle: "Weitere Dörfer auf Chios entdecken",
    relatedText: "Entdecken Sie Mastixdörfer, mittelalterliche Gassen, nördliche Landschaften und Dörfer am Meer.",
  },
  {
    slug: "olympoi-dorf",
    seo: {
      canonicalPath: "/de/doerfer-chios/olympoi-dorf/",
      title: "Olympoi Chios | Mittelalterliches Mastixdorf und Route nach Mesta",
      description: "Entdecken Sie Olympoi auf Chios, ein mittelalterliches Mastixdorf mit befestigter Struktur, authentischen Gassen und schöner Verbindung nach Mesta.",
      ogImage: "/images/villages/olympoi-1-768x432.webp",
    },
    hero: {
      kicker: "Süd-Chios • Befestigtes Dorf",
      title: "Olympoi: mittelalterliches Mastixdorf",
      description: "Entdecken Sie Olympoi auf Chios, ein mittelalterliches Mastixdorf mit befestigter Struktur, authentischen Gassen und schöner Verbindung nach Mesta.",
      image: "/images/villages/olympoi-1-768x432.webp",
      tags: ["#olympoi", "#mastic_village", "#medieval_chios", "#south_chios"],
    },
    details: [
      {
        icon: "📍",
        title: "Lage & Zugang",
        text: "Olympoi liegt im Süden von Chios, nahe Mesta, Vessa und der Höhle von Olympoi.",
      },
      {
        icon: "🏘️",
        title: "Dorfcharakter",
        text: "Mittelalterliche Struktur, enge Durchgänge und ruhige Atmosphäre machen es ideal zum Erkunden.",
      },
      {
        icon: "💡",
        title: "Lokaler Tipp",
        text: "Verbinden Sie Olympoi mit der Höhle von Olympoi oder fahren/wandern Sie weiter nach Mesta.",
      },
    ],
    highlights: {
      title: "Besonders sehenswert",
      items: [
        "Die befestigte mittelalterliche Struktur",
        "Die nahe Route nach Mesta",
        "Die Höhle von Olympoi in der Umgebung"
      ],
    },
    experience: {
      title: "Das Erlebnis",
      paragraphs: [
        "In Olympoi lohnt es sich, langsam zu gehen, die Architektur zu beobachten und sich von den Gassen führen zu lassen.",
        "Der Besuch wird noch schöner, wenn Sie ihn mit einem weiteren Dorf, einem Strand oder einer Essenspause verbinden.",
      ],
    },
    routeIdeas: {
      title: "Routenideen",
      items: [
        {
          icon: "🚗",
          title: "Route planen",
          text: "Verbinden Sie das Dorf mit nahe gelegenen Sehenswürdigkeiten, Stränden oder weiteren Dörfern.",
        },
        {
          icon: "🍽️",
          title: "Zeit zum Essen einplanen",
          text: "Tavernen und Cafés sind oft die besten Orte, um das lokale Leben zu spüren.",
        },
        {
          icon: "📷",
          title: "Langsam spazieren",
          text: "Die schönsten Details entdeckt man, wenn man das Auto stehen lässt und durch die Gassen geht.",
        },
      ],
    },
    baseTip: {
      icon: "🗺️",
      title: "Ihre strategische Basis",
      text: "Von Voulamandis House in Kampos aus können Sie Ihre Routen durch die Dörfer von Chios gut planen und Kultur, Strände und lokales Essen verbinden.",
      linkLabel: "Übernachten Sie bei Menschen, die die Insel kennen.",
      href: "/de/chios-zimmer/",
    },
    relatedTitle: "Weitere Dörfer auf Chios entdecken",
    relatedText: "Entdecken Sie Mastixdörfer, mittelalterliche Gassen, nördliche Landschaften und Dörfer am Meer.",
  },
  {
    slug: "volissos-dorf",
    seo: {
      canonicalPath: "/de/doerfer-chios/volissos-dorf/",
      title: "Volissos Chios | Burg, Amani und Strände im Nordwesten",
      description: "Entdecken Sie Volissos im Nordwesten von Chios, ein historisches Dorf mit Burg, Blick auf Amani und Zugang zu schönen nördlichen Stränden.",
      ogImage: "/images/villages/Volissos-Chios.webp",
    },
    hero: {
      kicker: "Nordwest-Chios • Burg",
      title: "Volissos: Burg und Nord-Chios",
      description: "Entdecken Sie Volissos im Nordwesten von Chios, ein historisches Dorf mit Burg, Blick auf Amani und Zugang zu schönen nördlichen Stränden.",
      image: "/images/villages/Volissos-Chios.webp",
      tags: ["#volissos", "#north_chios", "#castle", "#amani"],
    },
    details: [
      {
        icon: "📍",
        title: "Lage & Zugang",
        text: "Volissos liegt im Nordwesten von Chios und ist ein guter Ausgangspunkt für Amani, Agia Markella und Lefkathia.",
      },
      {
        icon: "🏘️",
        title: "Dorfcharakter",
        text: "Burg, Steinhäuser und weite Ausblicke geben Volissos einen besonderen nördlichen Charakter.",
      },
      {
        icon: "💡",
        title: "Lokaler Tipp",
        text: "Bleiben Sie bis zum Nachmittag für schönes Licht an der Burg und kombinieren Sie den Besuch mit Lefkathia.",
      },
    ],
    highlights: {
      title: "Besonders sehenswert",
      items: [
        "Die Burg von Volissos",
        "Der Blick nach Amani",
        "Nahe Strände im Nordwesten"
      ],
    },
    experience: {
      title: "Das Erlebnis",
      paragraphs: [
        "In Volissos lohnt es sich, langsam zu gehen, die Architektur zu beobachten und sich von den Gassen führen zu lassen.",
        "Der Besuch wird noch schöner, wenn Sie ihn mit einem weiteren Dorf, einem Strand oder einer Essenspause verbinden.",
      ],
    },
    routeIdeas: {
      title: "Routenideen",
      items: [
        {
          icon: "🚗",
          title: "Route planen",
          text: "Verbinden Sie das Dorf mit nahe gelegenen Sehenswürdigkeiten, Stränden oder weiteren Dörfern.",
        },
        {
          icon: "🍽️",
          title: "Zeit zum Essen einplanen",
          text: "Tavernen und Cafés sind oft die besten Orte, um das lokale Leben zu spüren.",
        },
        {
          icon: "📷",
          title: "Langsam spazieren",
          text: "Die schönsten Details entdeckt man, wenn man das Auto stehen lässt und durch die Gassen geht.",
        },
      ],
    },
    baseTip: {
      icon: "🗺️",
      title: "Ihre strategische Basis",
      text: "Von Voulamandis House in Kampos aus können Sie Ihre Routen durch die Dörfer von Chios gut planen und Kultur, Strände und lokales Essen verbinden.",
      linkLabel: "Übernachten Sie bei Menschen, die die Insel kennen.",
      href: "/de/chios-zimmer/",
    },
    relatedTitle: "Weitere Dörfer auf Chios entdecken",
    relatedText: "Entdecken Sie Mastixdörfer, mittelalterliche Gassen, nördliche Landschaften und Dörfer am Meer.",
  },
  {
    slug: "armolia-dorf",
    seo: {
      canonicalPath: "/de/doerfer-chios/armolia-dorf/",
      title: "Armolia Chios | Töpferdorf und lokales Handwerk",
      description: "Entdecken Sie Armolia auf Chios, das Töpferdorf mit Werkstätten, lokalem Handwerk und gutem Halt auf Routen zu den Mastixdörfern.",
      ogImage: "/images/villages/unnamed-e1702830815478.webp",
    },
    hero: {
      kicker: "Süd-Chios • Töpfertradition",
      title: "Armolia: das Töpferdorf",
      description: "Entdecken Sie Armolia auf Chios, das Töpferdorf mit Werkstätten, lokalem Handwerk und gutem Halt auf Routen zu den Mastixdörfern.",
      image: "/images/villages/unnamed-e1702830815478.webp",
      tags: ["#armolia", "#pottery", "#local_crafts", "#south_chios"],
    },
    details: [
      {
        icon: "📍",
        title: "Lage & Zugang",
        text: "Armolia liegt im Süden von Chios, praktisch für Routen nach Pyrgi, Mesta und zu südlichen Stränden.",
      },
      {
        icon: "🏘️",
        title: "Dorfcharakter",
        text: "Das Dorf ist für seine Töpfertradition und kleinen Werkstätten bekannt, die lokales Handwerk lebendig halten.",
      },
      {
        icon: "💡",
        title: "Lokaler Tipp",
        text: "Machen Sie Halt, um Keramik zu sehen und ein kleines handgemachtes Souvenir aus Chios mitzunehmen.",
      },
    ],
    highlights: {
      title: "Besonders sehenswert",
      items: [
        "Die Töpferwerkstätten",
        "Lokales Handwerk",
        "Ein einfacher Halt auf dem Weg zu den Mastixdörfern"
      ],
    },
    experience: {
      title: "Das Erlebnis",
      paragraphs: [
        "In Armolia lohnt es sich, langsam zu gehen, die Architektur zu beobachten und sich von den Gassen führen zu lassen.",
        "Der Besuch wird noch schöner, wenn Sie ihn mit einem weiteren Dorf, einem Strand oder einer Essenspause verbinden.",
      ],
    },
    routeIdeas: {
      title: "Routenideen",
      items: [
        {
          icon: "🚗",
          title: "Route planen",
          text: "Verbinden Sie das Dorf mit nahe gelegenen Sehenswürdigkeiten, Stränden oder weiteren Dörfern.",
        },
        {
          icon: "🍽️",
          title: "Zeit zum Essen einplanen",
          text: "Tavernen und Cafés sind oft die besten Orte, um das lokale Leben zu spüren.",
        },
        {
          icon: "📷",
          title: "Langsam spazieren",
          text: "Die schönsten Details entdeckt man, wenn man das Auto stehen lässt und durch die Gassen geht.",
        },
      ],
    },
    baseTip: {
      icon: "🗺️",
      title: "Ihre strategische Basis",
      text: "Von Voulamandis House in Kampos aus können Sie Ihre Routen durch die Dörfer von Chios gut planen und Kultur, Strände und lokales Essen verbinden.",
      linkLabel: "Übernachten Sie bei Menschen, die die Insel kennen.",
      href: "/de/chios-zimmer/",
    },
    relatedTitle: "Weitere Dörfer auf Chios entdecken",
    relatedText: "Entdecken Sie Mastixdörfer, mittelalterliche Gassen, nördliche Landschaften und Dörfer am Meer.",
  },
  {
    slug: "lagada-dorf",
    seo: {
      canonicalPath: "/de/doerfer-chios/lagada-dorf/",
      title: "Lagada Chios | Dorf am Meer, Hafen und Fischtavernen",
      description: "Entdecken Sie Lagada auf Chios, ein Dorf am Meer mit Hafen, Blick nach Oinousses, Fischtavernen und entspannter lokaler Atmosphäre.",
      ogImage: "/images/villages/lagada_3.webp",
    },
    hero: {
      kicker: "Ost-Chios • Dorf am Meer",
      title: "Lagada: Hafen, Meer und Fischtavernen",
      description: "Entdecken Sie Lagada auf Chios, ein Dorf am Meer mit Hafen, Blick nach Oinousses, Fischtavernen und entspannter lokaler Atmosphäre.",
      image: "/images/villages/lagada_3.webp",
      tags: ["#lagada", "#seaside_village", "#fish_taverns", "#oinousses_views"],
    },
    details: [
      {
        icon: "📍",
        title: "Lage & Zugang",
        text: "Lagada liegt an der Ostseite von Chios und eignet sich gut für einen entspannten Spaziergang und Essen am Meer.",
      },
      {
        icon: "🏘️",
        title: "Dorfcharakter",
        text: "Der kleine Hafen, Fischerboote und Tavernen geben Lagada einen authentischen maritimen Charakter.",
      },
      {
        icon: "💡",
        title: "Lokaler Tipp",
        text: "Kommen Sie zum Mittag- oder Abendessen am Hafen und genießen Sie den Blick nach Oinousses.",
      },
    ],
    highlights: {
      title: "Besonders sehenswert",
      items: [
        "Der kleine Hafen",
        "Die Fischtavernen",
        "Der Blick nach Oinousses"
      ],
    },
    experience: {
      title: "Das Erlebnis",
      paragraphs: [
        "In Lagada lohnt es sich, langsam zu gehen, die Architektur zu beobachten und sich von den Gassen führen zu lassen.",
        "Der Besuch wird noch schöner, wenn Sie ihn mit einem weiteren Dorf, einem Strand oder einer Essenspause verbinden.",
      ],
    },
    routeIdeas: {
      title: "Routenideen",
      items: [
        {
          icon: "🚗",
          title: "Route planen",
          text: "Verbinden Sie das Dorf mit nahe gelegenen Sehenswürdigkeiten, Stränden oder weiteren Dörfern.",
        },
        {
          icon: "🍽️",
          title: "Zeit zum Essen einplanen",
          text: "Tavernen und Cafés sind oft die besten Orte, um das lokale Leben zu spüren.",
        },
        {
          icon: "📷",
          title: "Langsam spazieren",
          text: "Die schönsten Details entdeckt man, wenn man das Auto stehen lässt und durch die Gassen geht.",
        },
      ],
    },
    baseTip: {
      icon: "🗺️",
      title: "Ihre strategische Basis",
      text: "Von Voulamandis House in Kampos aus können Sie Ihre Routen durch die Dörfer von Chios gut planen und Kultur, Strände und lokales Essen verbinden.",
      linkLabel: "Übernachten Sie bei Menschen, die die Insel kennen.",
      href: "/de/chios-zimmer/",
    },
    relatedTitle: "Weitere Dörfer auf Chios entdecken",
    relatedText: "Entdecken Sie Mastixdörfer, mittelalterliche Gassen, nördliche Landschaften und Dörfer am Meer.",
  },
  // IT localized villages,
  {
    slug: "villaggio-pyrgi",
    seo: {
      canonicalPath: "/it/villaggi-chios/villaggio-pyrgi/",
      title: "Pyrgi Chios | Il villaggio medievale dipinto",
      description: "Scopri Pyrgi a Chios, il famoso villaggio medievale dipinto, noto per i motivi bianchi e neri, i vicoli stretti e l’identità dei villaggi del mastice.",
      ogImage: "/images/villages/29651245457_aa8f702ef7_b-768x432.webp",
    },
    hero: {
      kicker: "Chios meridionale • Villaggio del mastice",
      title: "Pyrgi: il villaggio dipinto di Chios",
      description: "Scopri Pyrgi a Chios, il famoso villaggio medievale dipinto, noto per i motivi bianchi e neri, i vicoli stretti e l’identità dei villaggi del mastice.",
      image: "/images/villages/29651245457_aa8f702ef7_b-768x432.webp",
      tags: ["#pyrgi", "#mastic_village", "#xysta", "#medieval_chios"],
    },
    details: [
      {
        icon: "📍",
        title: "Posizione & accesso",
        text: "Pyrgi si trova nel sud di Chios, a circa 25 km dalla città, ed è una tappa essenziale nei villaggi del mastice.",
      },
      {
        icon: "🏘️",
        title: "Carattere del villaggio",
        text: "Le facciate decorate con xysta, i motivi geometrici e la struttura medievale rendono il villaggio unico in Grecia.",
      },
      {
        icon: "💡",
        title: "Consiglio locale",
        text: "Visitalo presto o nel tardo pomeriggio per una luce migliore e una passeggiata più tranquilla nei vicoli.",
      },
    ],
    highlights: {
      title: "Da non perdere",
      items: [
        "Le facciate bianche e nere decorate",
        "La piazza centrale con caffè e vita locale",
        "L’atmosfera dei villaggi del mastice"
      ],
    },
    experience: {
      title: "L’esperienza",
      paragraphs: [
        "A Pyrgi vale la pena camminare con calma, osservare l’architettura e lasciare che i vicoli guidino la visita.",
        "La visita diventa ancora più bella se la abbini a un altro villaggio, una spiaggia vicina o una pausa per mangiare.",
      ],
    },
    routeIdeas: {
      title: "Idee di itinerario",
      items: [
        {
          icon: "🚗",
          title: "Organizza il percorso",
          text: "Abbina il villaggio a luoghi vicini, spiagge o altri villaggi della zona.",
        },
        {
          icon: "🍽️",
          title: "Lascia tempo per mangiare",
          text: "Taverne e caffè sono spesso il modo migliore per sentire la vita locale.",
        },
        {
          icon: "📷",
          title: "Passeggia senza fretta",
          text: "I dettagli più belli appaiono quando lasci l’auto e ti perdi nei vicoli.",
        },
      ],
    },
    baseTip: {
      icon: "🗺️",
      title: "La tua base strategica",
      text: "Da Voulamandis House a Kampos puoi organizzare facilmente itinerari nei villaggi di Chios, combinando cultura, spiagge e cucina locale.",
      linkLabel: "Soggiorna con chi conosce meglio l’isola.",
      href: "/it/camere-a-chios/",
    },
    relatedTitle: "Scopri altri villaggi di Chios",
    relatedText: "Esplora i villaggi del mastice, i vicoli medievali, i paesaggi del nord e i villaggi sul mare.",
  },
  {
    slug: "villaggio-mesta",
    seo: {
      canonicalPath: "/it/villaggi-chios/villaggio-mesta/",
      title: "Mesta Chios | Villaggio medievale fortificato",
      description: "Scopri Mesta a Chios, uno dei villaggi fortificati medievali meglio conservati, con vicoli in pietra, archi e atmosfera autentica.",
      ogImage: "/images/villages/9ac4cf44d16c4af6d873c5bba4a6696b_L-768x480.webp",
    },
    hero: {
      kicker: "Chios meridionale • Villaggio fortificato",
      title: "Mesta: il villaggio-fortezza medievale",
      description: "Scopri Mesta a Chios, uno dei villaggi fortificati medievali meglio conservati, con vicoli in pietra, archi e atmosfera autentica.",
      image: "/images/villages/9ac4cf44d16c4af6d873c5bba4a6696b_L-768x480.webp",
      tags: ["#mesta", "#medieval_village", "#mastichochoria", "#stone_alleys"],
    },
    details: [
      {
        icon: "📍",
        title: "Posizione & accesso",
        text: "Mesta si trova nel sud di Chios, nel cuore dei villaggi del mastice, ed è facile da abbinare a Pyrgi, Olympoi e Mavra Volia.",
      },
      {
        icon: "🏘️",
        title: "Carattere del villaggio",
        text: "La struttura fortificata, i vicoli in pietra e gli archi danno la sensazione di entrare nel Medioevo.",
      },
      {
        icon: "💡",
        title: "Consiglio locale",
        text: "Entra nei vicoli senza un programma rigido. Il fascino di Mesta è perdersi nel villaggio-fortezza.",
      },
    ],
    highlights: {
      title: "Da non perdere",
      items: [
        "I vicoli in pietra e gli archi",
        "La piazza per un caffè o un pasto",
        "La struttura medievale autentica"
      ],
    },
    experience: {
      title: "L’esperienza",
      paragraphs: [
        "A Mesta vale la pena camminare con calma, osservare l’architettura e lasciare che i vicoli guidino la visita.",
        "La visita diventa ancora più bella se la abbini a un altro villaggio, una spiaggia vicina o una pausa per mangiare.",
      ],
    },
    routeIdeas: {
      title: "Idee di itinerario",
      items: [
        {
          icon: "🚗",
          title: "Organizza il percorso",
          text: "Abbina il villaggio a luoghi vicini, spiagge o altri villaggi della zona.",
        },
        {
          icon: "🍽️",
          title: "Lascia tempo per mangiare",
          text: "Taverne e caffè sono spesso il modo migliore per sentire la vita locale.",
        },
        {
          icon: "📷",
          title: "Passeggia senza fretta",
          text: "I dettagli più belli appaiono quando lasci l’auto e ti perdi nei vicoli.",
        },
      ],
    },
    baseTip: {
      icon: "🗺️",
      title: "La tua base strategica",
      text: "Da Voulamandis House a Kampos puoi organizzare facilmente itinerari nei villaggi di Chios, combinando cultura, spiagge e cucina locale.",
      linkLabel: "Soggiorna con chi conosce meglio l’isola.",
      href: "/it/camere-a-chios/",
    },
    relatedTitle: "Scopri altri villaggi di Chios",
    relatedText: "Esplora i villaggi del mastice, i vicoli medievali, i paesaggi del nord e i villaggi sul mare.",
  },
  {
    slug: "villaggio-vessa",
    seo: {
      canonicalPath: "/it/villaggi-chios/villaggio-vessa/",
      title: "Vessa Chios | Tranquillo villaggio medievale del mastice",
      description: "Scopri Vessa a Chios, un tranquillo villaggio medievale del mastice con atmosfera autentica, vicoli in pietra e ritmi lenti.",
      ogImage: "/images/villages/29651245457_aa8f702ef7_b-768x432.webp",
    },
    hero: {
      kicker: "Chios meridionale • Villaggio tranquillo",
      title: "Vessa: tranquillo villaggio medievale",
      description: "Scopri Vessa a Chios, un tranquillo villaggio medievale del mastice con atmosfera autentica, vicoli in pietra e ritmi lenti.",
      image: "/images/villages/29651245457_aa8f702ef7_b-768x432.webp",
      tags: ["#vessa", "#quiet_village", "#mastichochoria", "#authentic_chios"],
    },
    details: [
      {
        icon: "📍",
        title: "Posizione & accesso",
        text: "Vessa si trova nel sud di Chios e si abbina facilmente a Mesta, Olympoi e alle spiagge occidentali o meridionali.",
      },
      {
        icon: "🏘️",
        title: "Carattere del villaggio",
        text: "Più tranquilla e meno turistica, Vessa conserva l’autenticità dei villaggi del mastice.",
      },
      {
        icon: "💡",
        title: "Consiglio locale",
        text: "È una sosta ideale per vedere un villaggio del mastice con più calma, senza la folla dei villaggi più famosi.",
      },
    ],
    highlights: {
      title: "Da non perdere",
      items: [
        "Vicoli in pietra tranquilli",
        "Atmosfera autentica del mastice",
        "Buona tappa su una rotta del sud"
      ],
    },
    experience: {
      title: "L’esperienza",
      paragraphs: [
        "A Vessa vale la pena camminare con calma, osservare l’architettura e lasciare che i vicoli guidino la visita.",
        "La visita diventa ancora più bella se la abbini a un altro villaggio, una spiaggia vicina o una pausa per mangiare.",
      ],
    },
    routeIdeas: {
      title: "Idee di itinerario",
      items: [
        {
          icon: "🚗",
          title: "Organizza il percorso",
          text: "Abbina il villaggio a luoghi vicini, spiagge o altri villaggi della zona.",
        },
        {
          icon: "🍽️",
          title: "Lascia tempo per mangiare",
          text: "Taverne e caffè sono spesso il modo migliore per sentire la vita locale.",
        },
        {
          icon: "📷",
          title: "Passeggia senza fretta",
          text: "I dettagli più belli appaiono quando lasci l’auto e ti perdi nei vicoli.",
        },
      ],
    },
    baseTip: {
      icon: "🗺️",
      title: "La tua base strategica",
      text: "Da Voulamandis House a Kampos puoi organizzare facilmente itinerari nei villaggi di Chios, combinando cultura, spiagge e cucina locale.",
      linkLabel: "Soggiorna con chi conosce meglio l’isola.",
      href: "/it/camere-a-chios/",
    },
    relatedTitle: "Scopri altri villaggi di Chios",
    relatedText: "Esplora i villaggi del mastice, i vicoli medievali, i paesaggi del nord e i villaggi sul mare.",
  },
  {
    slug: "villaggio-olympoi",
    seo: {
      canonicalPath: "/it/villaggi-chios/villaggio-olympoi/",
      title: "Olympoi Chios | Villaggio medievale del mastice e percorso verso Mesta",
      description: "Scopri Olympoi a Chios, un villaggio medievale del mastice con struttura fortificata, vicoli autentici e bel collegamento con Mesta.",
      ogImage: "/images/villages/olympoi-1-768x432.webp",
    },
    hero: {
      kicker: "Chios meridionale • Villaggio fortificato",
      title: "Olympoi: villaggio medievale del mastice",
      description: "Scopri Olympoi a Chios, un villaggio medievale del mastice con struttura fortificata, vicoli autentici e bel collegamento con Mesta.",
      image: "/images/villages/olympoi-1-768x432.webp",
      tags: ["#olympoi", "#mastic_village", "#medieval_chios", "#south_chios"],
    },
    details: [
      {
        icon: "📍",
        title: "Posizione & accesso",
        text: "Olympoi si trova nel sud di Chios, vicino a Mesta, Vessa e alla Grotta di Olympoi.",
      },
      {
        icon: "🏘️",
        title: "Carattere del villaggio",
        text: "La struttura medievale, i passaggi stretti e l’atmosfera calma lo rendono ideale da esplorare.",
      },
      {
        icon: "💡",
        title: "Consiglio locale",
        text: "Abbina Olympoi alla Grotta di Olympoi oppure prosegui verso Mesta a piedi o in auto.",
      },
    ],
    highlights: {
      title: "Da non perdere",
      items: [
        "La struttura medievale fortificata",
        "Il percorso vicino verso Mesta",
        "La Grotta di Olympoi nella zona"
      ],
    },
    experience: {
      title: "L’esperienza",
      paragraphs: [
        "A Olympoi vale la pena camminare con calma, osservare l’architettura e lasciare che i vicoli guidino la visita.",
        "La visita diventa ancora più bella se la abbini a un altro villaggio, una spiaggia vicina o una pausa per mangiare.",
      ],
    },
    routeIdeas: {
      title: "Idee di itinerario",
      items: [
        {
          icon: "🚗",
          title: "Organizza il percorso",
          text: "Abbina il villaggio a luoghi vicini, spiagge o altri villaggi della zona.",
        },
        {
          icon: "🍽️",
          title: "Lascia tempo per mangiare",
          text: "Taverne e caffè sono spesso il modo migliore per sentire la vita locale.",
        },
        {
          icon: "📷",
          title: "Passeggia senza fretta",
          text: "I dettagli più belli appaiono quando lasci l’auto e ti perdi nei vicoli.",
        },
      ],
    },
    baseTip: {
      icon: "🗺️",
      title: "La tua base strategica",
      text: "Da Voulamandis House a Kampos puoi organizzare facilmente itinerari nei villaggi di Chios, combinando cultura, spiagge e cucina locale.",
      linkLabel: "Soggiorna con chi conosce meglio l’isola.",
      href: "/it/camere-a-chios/",
    },
    relatedTitle: "Scopri altri villaggi di Chios",
    relatedText: "Esplora i villaggi del mastice, i vicoli medievali, i paesaggi del nord e i villaggi sul mare.",
  },
  {
    slug: "villaggio-volissos",
    seo: {
      canonicalPath: "/it/villaggi-chios/villaggio-volissos/",
      title: "Volissos Chios | Castello, Amani e spiagge del nord-ovest",
      description: "Scopri Volissos nel nord-ovest di Chios, un villaggio storico con castello, vista su Amani e accesso a splendide spiagge del nord.",
      ogImage: "/images/villages/Volissos-Chios.webp",
    },
    hero: {
      kicker: "Nord-ovest di Chios • Castello",
      title: "Volissos: castello e nord di Chios",
      description: "Scopri Volissos nel nord-ovest di Chios, un villaggio storico con castello, vista su Amani e accesso a splendide spiagge del nord.",
      image: "/images/villages/Volissos-Chios.webp",
      tags: ["#volissos", "#north_chios", "#castle", "#amani"],
    },
    details: [
      {
        icon: "📍",
        title: "Posizione & accesso",
        text: "Volissos si trova nel nord-ovest di Chios ed è una base per Amani, Agia Markella e Lefkathia.",
      },
      {
        icon: "🏘️",
        title: "Carattere del villaggio",
        text: "Il castello, le case in pietra e le viste aperte danno a Volissos un carattere nordico speciale.",
      },
      {
        icon: "💡",
        title: "Consiglio locale",
        text: "Resta fino al pomeriggio per una bella luce sul castello e abbina la visita a Lefkathia.",
      },
    ],
    highlights: {
      title: "Da non perdere",
      items: [
        "Il castello di Volissos",
        "La vista verso Amani",
        "Le spiagge vicine del nord-ovest"
      ],
    },
    experience: {
      title: "L’esperienza",
      paragraphs: [
        "A Volissos vale la pena camminare con calma, osservare l’architettura e lasciare che i vicoli guidino la visita.",
        "La visita diventa ancora più bella se la abbini a un altro villaggio, una spiaggia vicina o una pausa per mangiare.",
      ],
    },
    routeIdeas: {
      title: "Idee di itinerario",
      items: [
        {
          icon: "🚗",
          title: "Organizza il percorso",
          text: "Abbina il villaggio a luoghi vicini, spiagge o altri villaggi della zona.",
        },
        {
          icon: "🍽️",
          title: "Lascia tempo per mangiare",
          text: "Taverne e caffè sono spesso il modo migliore per sentire la vita locale.",
        },
        {
          icon: "📷",
          title: "Passeggia senza fretta",
          text: "I dettagli più belli appaiono quando lasci l’auto e ti perdi nei vicoli.",
        },
      ],
    },
    baseTip: {
      icon: "🗺️",
      title: "La tua base strategica",
      text: "Da Voulamandis House a Kampos puoi organizzare facilmente itinerari nei villaggi di Chios, combinando cultura, spiagge e cucina locale.",
      linkLabel: "Soggiorna con chi conosce meglio l’isola.",
      href: "/it/camere-a-chios/",
    },
    relatedTitle: "Scopri altri villaggi di Chios",
    relatedText: "Esplora i villaggi del mastice, i vicoli medievali, i paesaggi del nord e i villaggi sul mare.",
  },
  {
    slug: "villaggio-armolia",
    seo: {
      canonicalPath: "/it/villaggi-chios/villaggio-armolia/",
      title: "Armolia Chios | Villaggio della ceramica e artigianato",
      description: "Scopri Armolia a Chios, il villaggio della ceramica con laboratori, artigianato locale e comoda tappa verso i villaggi del mastice.",
      ogImage: "/images/villages/unnamed-e1702830815478.webp",
    },
    hero: {
      kicker: "Chios meridionale • Tradizione ceramica",
      title: "Armolia: il villaggio della ceramica",
      description: "Scopri Armolia a Chios, il villaggio della ceramica con laboratori, artigianato locale e comoda tappa verso i villaggi del mastice.",
      image: "/images/villages/unnamed-e1702830815478.webp",
      tags: ["#armolia", "#pottery", "#local_crafts", "#south_chios"],
    },
    details: [
      {
        icon: "📍",
        title: "Posizione & accesso",
        text: "Armolia si trova nel sud di Chios, in posizione pratica per Pyrgi, Mesta e le spiagge del sud.",
      },
      {
        icon: "🏘️",
        title: "Carattere del villaggio",
        text: "Il villaggio è noto per la tradizione ceramica e i piccoli laboratori che mantengono viva l’arte locale.",
      },
      {
        icon: "💡",
        title: "Consiglio locale",
        text: "Fai una sosta per vedere le ceramiche e portare con te un piccolo souvenir artigianale di Chios.",
      },
    ],
    highlights: {
      title: "Da non perdere",
      items: [
        "I laboratori di ceramica",
        "L’artigianato locale",
        "Una facile tappa verso i villaggi del mastice"
      ],
    },
    experience: {
      title: "L’esperienza",
      paragraphs: [
        "A Armolia vale la pena camminare con calma, osservare l’architettura e lasciare che i vicoli guidino la visita.",
        "La visita diventa ancora più bella se la abbini a un altro villaggio, una spiaggia vicina o una pausa per mangiare.",
      ],
    },
    routeIdeas: {
      title: "Idee di itinerario",
      items: [
        {
          icon: "🚗",
          title: "Organizza il percorso",
          text: "Abbina il villaggio a luoghi vicini, spiagge o altri villaggi della zona.",
        },
        {
          icon: "🍽️",
          title: "Lascia tempo per mangiare",
          text: "Taverne e caffè sono spesso il modo migliore per sentire la vita locale.",
        },
        {
          icon: "📷",
          title: "Passeggia senza fretta",
          text: "I dettagli più belli appaiono quando lasci l’auto e ti perdi nei vicoli.",
        },
      ],
    },
    baseTip: {
      icon: "🗺️",
      title: "La tua base strategica",
      text: "Da Voulamandis House a Kampos puoi organizzare facilmente itinerari nei villaggi di Chios, combinando cultura, spiagge e cucina locale.",
      linkLabel: "Soggiorna con chi conosce meglio l’isola.",
      href: "/it/camere-a-chios/",
    },
    relatedTitle: "Scopri altri villaggi di Chios",
    relatedText: "Esplora i villaggi del mastice, i vicoli medievali, i paesaggi del nord e i villaggi sul mare.",
  },
  {
    slug: "villaggio-lagada",
    seo: {
      canonicalPath: "/it/villaggi-chios/villaggio-lagada/",
      title: "Lagada Chios | Villaggio sul mare, porto e taverne di pesce",
      description: "Scopri Lagada a Chios, un villaggio sul mare con porto, vista su Oinousses, taverne di pesce e atmosfera locale rilassata.",
      ogImage: "/images/villages/lagada_3.webp",
    },
    hero: {
      kicker: "Chios orientale • Villaggio sul mare",
      title: "Lagada: porto, mare e taverne di pesce",
      description: "Scopri Lagada a Chios, un villaggio sul mare con porto, vista su Oinousses, taverne di pesce e atmosfera locale rilassata.",
      image: "/images/villages/lagada_3.webp",
      tags: ["#lagada", "#seaside_village", "#fish_taverns", "#oinousses_views"],
    },
    details: [
      {
        icon: "📍",
        title: "Posizione & accesso",
        text: "Lagada si trova sulla costa orientale di Chios ed è ideale per una passeggiata rilassata e un pranzo sul mare.",
      },
      {
        icon: "🏘️",
        title: "Carattere del villaggio",
        text: "Il piccolo porto, le barche da pesca e le taverne danno a Lagada un carattere marittimo autentico.",
      },
      {
        icon: "💡",
        title: "Consiglio locale",
        text: "Vieni per pranzo o cena vicino al porto e goditi la vista verso Oinousses.",
      },
    ],
    highlights: {
      title: "Da non perdere",
      items: [
        "Il piccolo porto",
        "Le taverne di pesce",
        "La vista su Oinousses"
      ],
    },
    experience: {
      title: "L’esperienza",
      paragraphs: [
        "A Lagada vale la pena camminare con calma, osservare l’architettura e lasciare che i vicoli guidino la visita.",
        "La visita diventa ancora più bella se la abbini a un altro villaggio, una spiaggia vicina o una pausa per mangiare.",
      ],
    },
    routeIdeas: {
      title: "Idee di itinerario",
      items: [
        {
          icon: "🚗",
          title: "Organizza il percorso",
          text: "Abbina il villaggio a luoghi vicini, spiagge o altri villaggi della zona.",
        },
        {
          icon: "🍽️",
          title: "Lascia tempo per mangiare",
          text: "Taverne e caffè sono spesso il modo migliore per sentire la vita locale.",
        },
        {
          icon: "📷",
          title: "Passeggia senza fretta",
          text: "I dettagli più belli appaiono quando lasci l’auto e ti perdi nei vicoli.",
        },
      ],
    },
    baseTip: {
      icon: "🗺️",
      title: "La tua base strategica",
      text: "Da Voulamandis House a Kampos puoi organizzare facilmente itinerari nei villaggi di Chios, combinando cultura, spiagge e cucina locale.",
      linkLabel: "Soggiorna con chi conosce meglio l’isola.",
      href: "/it/camere-a-chios/",
    },
    relatedTitle: "Scopri altri villaggi di Chios",
    relatedText: "Esplora i villaggi del mastice, i vicoli medievali, i paesaggi del nord e i villaggi sul mare.",
  },
  // ES localized villages,
  {
    slug: "pueblo-pyrgi",
    seo: {
      canonicalPath: "/es/pueblos-chios/pueblo-pyrgi/",
      title: "Pyrgi Chios | El pueblo medieval pintado",
      description: "Descubre Pyrgi en Chios, un pueblo medieval pintado con motivos blancos y negros, callejones estrechos y carácter de mastiha.",
      ogImage: "/images/villages/29651245457_aa8f702ef7_b-768x432.webp",
    },
    hero: {
      kicker: "Sur de Chios • Pueblo del mastiha",
      title: "Pyrgi: el pueblo pintado de Chios",
      description: "Descubre Pyrgi en Chios, un pueblo medieval pintado con motivos blancos y negros, callejones estrechos y carácter de mastiha.",
      image: "/images/villages/29651245457_aa8f702ef7_b-768x432.webp",
      tags: ["#pyrgi", "#mastic_village", "#xysta", "#medieval_chios"],
    },
    details: [
      {
        icon: "📍",
        title: "Ubicación y acceso",
        text: "Pyrgi está en el sur de Chios, a unos 25 km de la ciudad, y es una parada esencial en cualquier ruta por los pueblos del mastiha.",
      },
      {
        icon: "🏘️",
        title: "Carácter del pueblo",
        text: "Las fachadas con xysta, los motivos geométricos y la estructura medieval hacen que el pueblo sea único en Grecia.",
      },
      {
        icon: "💡",
        title: "Consejo local",
        text: "Ve temprano o al final de la tarde para tener mejor luz y pasear con más calma por las calles.",
      },
    ],
    highlights: {
      title: "Qué ver",
      items: [
        "Las fachadas blancas y negras decoradas",
        "La plaza central con cafés y vida local",
        "El ambiente de los pueblos del mastiha"
      ],
    },
    experience: {
      title: "La experiencia",
      paragraphs: [
        "En Pyrgi merece la pena caminar despacio, observar la arquitectura y dejar que las calles guíen la visita.",
        "La visita es aún mejor si la combinas con otro pueblo, una playa cercana o una parada para comer.",
      ],
    },
    routeIdeas: {
      title: "Ideas de ruta",
      items: [
        {
          icon: "🚗",
          title: "Organiza la ruta",
          text: "Combina el pueblo con lugares cercanos, playas u otros pueblos de la zona.",
        },
        {
          icon: "🍽️",
          title: "Deja tiempo para comer",
          text: "Las tabernas y cafés suelen ser el mejor lugar para sentir la vida local.",
        },
        {
          icon: "📷",
          title: "Camina sin prisa",
          text: "Los detalles más bonitos aparecen cuando dejas el coche y te pierdes por las calles.",
        },
      ],
    },
    baseTip: {
      icon: "🗺️",
      title: "Tu base estratégica",
      text: "Desde Voulamandis House en Kampos puedes organizar fácilmente rutas por los pueblos de Chios, combinando cultura, playas y comida local.",
      linkLabel: "Alójate con quienes mejor conocen la isla.",
      href: "/es/habitaciones-en-chios/",
    },
    relatedTitle: "Descubre más pueblos de Chios",
    relatedText: "Explora pueblos del mastiha, callejones medievales, paisajes del norte y pueblos junto al mar.",
  },
  {
    slug: "pueblo-mesta",
    seo: {
      canonicalPath: "/es/pueblos-chios/pueblo-mesta/",
      title: "Mesta Chios | Pueblo medieval fortificado",
      description: "Descubre Mesta en Chios, uno de los pueblos fortificados medievales mejor conservados, con calles de piedra, arcos y atmósfera auténtica.",
      ogImage: "/images/villages/9ac4cf44d16c4af6d873c5bba4a6696b_L-768x480.webp",
    },
    hero: {
      kicker: "Sur de Chios • Pueblo fortificado",
      title: "Mesta: el pueblo fortaleza medieval",
      description: "Descubre Mesta en Chios, uno de los pueblos fortificados medievales mejor conservados, con calles de piedra, arcos y atmósfera auténtica.",
      image: "/images/villages/9ac4cf44d16c4af6d873c5bba4a6696b_L-768x480.webp",
      tags: ["#mesta", "#medieval_village", "#mastichochoria", "#stone_alleys"],
    },
    details: [
      {
        icon: "📍",
        title: "Ubicación y acceso",
        text: "Mesta está en el sur de Chios, en el corazón de los pueblos del mastiha, y combina fácilmente con Pyrgi, Olympoi y Mavra Volia.",
      },
      {
        icon: "🏘️",
        title: "Carácter del pueblo",
        text: "La estructura fortificada, las calles de piedra y los arcos transmiten la sensación de viajar a la Edad Media.",
      },
      {
        icon: "💡",
        title: "Consejo local",
        text: "Entra en sus calles sin un plan rígido. El encanto de Mesta está en perderse dentro del pueblo fortaleza.",
      },
    ],
    highlights: {
      title: "Qué ver",
      items: [
        "Las calles de piedra y los arcos",
        "La plaza para tomar café o comer",
        "La estructura medieval auténtica"
      ],
    },
    experience: {
      title: "La experiencia",
      paragraphs: [
        "En Mesta merece la pena caminar despacio, observar la arquitectura y dejar que las calles guíen la visita.",
        "La visita es aún mejor si la combinas con otro pueblo, una playa cercana o una parada para comer.",
      ],
    },
    routeIdeas: {
      title: "Ideas de ruta",
      items: [
        {
          icon: "🚗",
          title: "Organiza la ruta",
          text: "Combina el pueblo con lugares cercanos, playas u otros pueblos de la zona.",
        },
        {
          icon: "🍽️",
          title: "Deja tiempo para comer",
          text: "Las tabernas y cafés suelen ser el mejor lugar para sentir la vida local.",
        },
        {
          icon: "📷",
          title: "Camina sin prisa",
          text: "Los detalles más bonitos aparecen cuando dejas el coche y te pierdes por las calles.",
        },
      ],
    },
    baseTip: {
      icon: "🗺️",
      title: "Tu base estratégica",
      text: "Desde Voulamandis House en Kampos puedes organizar fácilmente rutas por los pueblos de Chios, combinando cultura, playas y comida local.",
      linkLabel: "Alójate con quienes mejor conocen la isla.",
      href: "/es/habitaciones-en-chios/",
    },
    relatedTitle: "Descubre más pueblos de Chios",
    relatedText: "Explora pueblos del mastiha, callejones medievales, paisajes del norte y pueblos junto al mar.",
  },
  {
    slug: "pueblo-vessa",
    seo: {
      canonicalPath: "/es/pueblos-chios/pueblo-vessa/",
      title: "Vessa Chios | Tranquilo pueblo medieval del mastiha",
      description: "Descubre Vessa en Chios, un tranquilo pueblo medieval del mastiha con atmósfera auténtica, calles de piedra y ritmo pausado.",
      ogImage: "/images/villages/29651245457_aa8f702ef7_b-768x432.webp",
    },
    hero: {
      kicker: "Sur de Chios • Pueblo tranquilo",
      title: "Vessa: pueblo medieval tranquilo",
      description: "Descubre Vessa en Chios, un tranquilo pueblo medieval del mastiha con atmósfera auténtica, calles de piedra y ritmo pausado.",
      image: "/images/villages/29651245457_aa8f702ef7_b-768x432.webp",
      tags: ["#vessa", "#quiet_village", "#mastichochoria", "#authentic_chios"],
    },
    details: [
      {
        icon: "📍",
        title: "Ubicación y acceso",
        text: "Vessa está en el sur de Chios y combina fácilmente con Mesta, Olympoi y las playas del oeste o del sur.",
      },
      {
        icon: "🏘️",
        title: "Carácter del pueblo",
        text: "Más tranquila y menos turística, Vessa conserva la autenticidad de los pueblos del mastiha.",
      },
      {
        icon: "💡",
        title: "Consejo local",
        text: "Es una parada ideal si quieres ver un pueblo del mastiha con más calma, sin la multitud de los pueblos más conocidos.",
      },
    ],
    highlights: {
      title: "Qué ver",
      items: [
        "Calles de piedra tranquilas",
        "Atmósfera auténtica del mastiha",
        "Buena parada en una ruta del sur"
      ],
    },
    experience: {
      title: "La experiencia",
      paragraphs: [
        "En Vessa merece la pena caminar despacio, observar la arquitectura y dejar que las calles guíen la visita.",
        "La visita es aún mejor si la combinas con otro pueblo, una playa cercana o una parada para comer.",
      ],
    },
    routeIdeas: {
      title: "Ideas de ruta",
      items: [
        {
          icon: "🚗",
          title: "Organiza la ruta",
          text: "Combina el pueblo con lugares cercanos, playas u otros pueblos de la zona.",
        },
        {
          icon: "🍽️",
          title: "Deja tiempo para comer",
          text: "Las tabernas y cafés suelen ser el mejor lugar para sentir la vida local.",
        },
        {
          icon: "📷",
          title: "Camina sin prisa",
          text: "Los detalles más bonitos aparecen cuando dejas el coche y te pierdes por las calles.",
        },
      ],
    },
    baseTip: {
      icon: "🗺️",
      title: "Tu base estratégica",
      text: "Desde Voulamandis House en Kampos puedes organizar fácilmente rutas por los pueblos de Chios, combinando cultura, playas y comida local.",
      linkLabel: "Alójate con quienes mejor conocen la isla.",
      href: "/es/habitaciones-en-chios/",
    },
    relatedTitle: "Descubre más pueblos de Chios",
    relatedText: "Explora pueblos del mastiha, callejones medievales, paisajes del norte y pueblos junto al mar.",
  },
  {
    slug: "pueblo-olympoi",
    seo: {
      canonicalPath: "/es/pueblos-chios/pueblo-olympoi/",
      title: "Olympoi Chios | Pueblo medieval del mastiha y ruta a Mesta",
      description: "Descubre Olympoi en Chios, un pueblo medieval del mastiha con estructura fortificada, calles auténticas y bonita conexión con Mesta.",
      ogImage: "/images/villages/olympoi-1-768x432.webp",
    },
    hero: {
      kicker: "Sur de Chios • Pueblo fortificado",
      title: "Olympoi: pueblo medieval del mastiha",
      description: "Descubre Olympoi en Chios, un pueblo medieval del mastiha con estructura fortificada, calles auténticas y bonita conexión con Mesta.",
      image: "/images/villages/olympoi-1-768x432.webp",
      tags: ["#olympoi", "#mastic_village", "#medieval_chios", "#south_chios"],
    },
    details: [
      {
        icon: "📍",
        title: "Ubicación y acceso",
        text: "Olympoi está en el sur de Chios, cerca de Mesta, Vessa y la cueva de Olympoi.",
      },
      {
        icon: "🏘️",
        title: "Carácter del pueblo",
        text: "Su estructura medieval, sus pasajes estrechos y su atmósfera tranquila lo hacen ideal para recorrer.",
      },
      {
        icon: "💡",
        title: "Consejo local",
        text: "Combina Olympoi con la cueva de Olympoi o continúa hacia Mesta a pie o en coche.",
      },
    ],
    highlights: {
      title: "Qué ver",
      items: [
        "La estructura medieval fortificada",
        "La ruta cercana hacia Mesta",
        "La cueva de Olympoi en la zona"
      ],
    },
    experience: {
      title: "La experiencia",
      paragraphs: [
        "En Olympoi merece la pena caminar despacio, observar la arquitectura y dejar que las calles guíen la visita.",
        "La visita es aún mejor si la combinas con otro pueblo, una playa cercana o una parada para comer.",
      ],
    },
    routeIdeas: {
      title: "Ideas de ruta",
      items: [
        {
          icon: "🚗",
          title: "Organiza la ruta",
          text: "Combina el pueblo con lugares cercanos, playas u otros pueblos de la zona.",
        },
        {
          icon: "🍽️",
          title: "Deja tiempo para comer",
          text: "Las tabernas y cafés suelen ser el mejor lugar para sentir la vida local.",
        },
        {
          icon: "📷",
          title: "Camina sin prisa",
          text: "Los detalles más bonitos aparecen cuando dejas el coche y te pierdes por las calles.",
        },
      ],
    },
    baseTip: {
      icon: "🗺️",
      title: "Tu base estratégica",
      text: "Desde Voulamandis House en Kampos puedes organizar fácilmente rutas por los pueblos de Chios, combinando cultura, playas y comida local.",
      linkLabel: "Alójate con quienes mejor conocen la isla.",
      href: "/es/habitaciones-en-chios/",
    },
    relatedTitle: "Descubre más pueblos de Chios",
    relatedText: "Explora pueblos del mastiha, callejones medievales, paisajes del norte y pueblos junto al mar.",
  },
  {
    slug: "pueblo-volissos",
    seo: {
      canonicalPath: "/es/pueblos-chios/pueblo-volissos/",
      title: "Volissos Chios | Castillo, Amani y playas del noroeste",
      description: "Descubre Volissos en el noroeste de Chios, un pueblo histórico con castillo, vistas a Amani y acceso a bonitas playas del norte.",
      ogImage: "/images/villages/Volissos-Chios.webp",
    },
    hero: {
      kicker: "Noroeste de Chios • Castillo",
      title: "Volissos: castillo y norte de Chios",
      description: "Descubre Volissos en el noroeste de Chios, un pueblo histórico con castillo, vistas a Amani y acceso a bonitas playas del norte.",
      image: "/images/villages/Volissos-Chios.webp",
      tags: ["#volissos", "#north_chios", "#castle", "#amani"],
    },
    details: [
      {
        icon: "📍",
        title: "Ubicación y acceso",
        text: "Volissos está en el noroeste de Chios y es una buena base para Amani, Agia Markella y Lefkathia.",
      },
      {
        icon: "🏘️",
        title: "Carácter del pueblo",
        text: "El castillo, las casas de piedra y las vistas abiertas dan a Volissos un carácter norteño especial.",
      },
      {
        icon: "💡",
        title: "Consejo local",
        text: "Quédate hasta la tarde para ver buena luz sobre el castillo y combina la visita con Lefkathia.",
      },
    ],
    highlights: {
      title: "Qué ver",
      items: [
        "El castillo de Volissos",
        "Las vistas hacia Amani",
        "Las playas cercanas del noroeste"
      ],
    },
    experience: {
      title: "La experiencia",
      paragraphs: [
        "En Volissos merece la pena caminar despacio, observar la arquitectura y dejar que las calles guíen la visita.",
        "La visita es aún mejor si la combinas con otro pueblo, una playa cercana o una parada para comer.",
      ],
    },
    routeIdeas: {
      title: "Ideas de ruta",
      items: [
        {
          icon: "🚗",
          title: "Organiza la ruta",
          text: "Combina el pueblo con lugares cercanos, playas u otros pueblos de la zona.",
        },
        {
          icon: "🍽️",
          title: "Deja tiempo para comer",
          text: "Las tabernas y cafés suelen ser el mejor lugar para sentir la vida local.",
        },
        {
          icon: "📷",
          title: "Camina sin prisa",
          text: "Los detalles más bonitos aparecen cuando dejas el coche y te pierdes por las calles.",
        },
      ],
    },
    baseTip: {
      icon: "🗺️",
      title: "Tu base estratégica",
      text: "Desde Voulamandis House en Kampos puedes organizar fácilmente rutas por los pueblos de Chios, combinando cultura, playas y comida local.",
      linkLabel: "Alójate con quienes mejor conocen la isla.",
      href: "/es/habitaciones-en-chios/",
    },
    relatedTitle: "Descubre más pueblos de Chios",
    relatedText: "Explora pueblos del mastiha, callejones medievales, paisajes del norte y pueblos junto al mar.",
  },
  {
    slug: "pueblo-armolia",
    seo: {
      canonicalPath: "/es/pueblos-chios/pueblo-armolia/",
      title: "Armolia Chios | Pueblo de cerámica y artesanía local",
      description: "Descubre Armolia en Chios, el pueblo de la cerámica con talleres, artesanía local y parada fácil hacia los pueblos del mastiha.",
      ogImage: "/images/villages/unnamed-e1702830815478.webp",
    },
    hero: {
      kicker: "Sur de Chios • Tradición cerámica",
      title: "Armolia: el pueblo de la cerámica",
      description: "Descubre Armolia en Chios, el pueblo de la cerámica con talleres, artesanía local y parada fácil hacia los pueblos del mastiha.",
      image: "/images/villages/unnamed-e1702830815478.webp",
      tags: ["#armolia", "#pottery", "#local_crafts", "#south_chios"],
    },
    details: [
      {
        icon: "📍",
        title: "Ubicación y acceso",
        text: "Armolia está en el sur de Chios, en un punto práctico para Pyrgi, Mesta y las playas del sur.",
      },
      {
        icon: "🏘️",
        title: "Carácter del pueblo",
        text: "El pueblo es conocido por su tradición cerámica y pequeños talleres que mantienen viva la artesanía local.",
      },
      {
        icon: "💡",
        title: "Consejo local",
        text: "Haz una parada para ver cerámica y llevarte un pequeño recuerdo artesanal de Chios.",
      },
    ],
    highlights: {
      title: "Qué ver",
      items: [
        "Los talleres de cerámica",
        "La artesanía local",
        "Una parada fácil hacia los pueblos del mastiha"
      ],
    },
    experience: {
      title: "La experiencia",
      paragraphs: [
        "En Armolia merece la pena caminar despacio, observar la arquitectura y dejar que las calles guíen la visita.",
        "La visita es aún mejor si la combinas con otro pueblo, una playa cercana o una parada para comer.",
      ],
    },
    routeIdeas: {
      title: "Ideas de ruta",
      items: [
        {
          icon: "🚗",
          title: "Organiza la ruta",
          text: "Combina el pueblo con lugares cercanos, playas u otros pueblos de la zona.",
        },
        {
          icon: "🍽️",
          title: "Deja tiempo para comer",
          text: "Las tabernas y cafés suelen ser el mejor lugar para sentir la vida local.",
        },
        {
          icon: "📷",
          title: "Camina sin prisa",
          text: "Los detalles más bonitos aparecen cuando dejas el coche y te pierdes por las calles.",
        },
      ],
    },
    baseTip: {
      icon: "🗺️",
      title: "Tu base estratégica",
      text: "Desde Voulamandis House en Kampos puedes organizar fácilmente rutas por los pueblos de Chios, combinando cultura, playas y comida local.",
      linkLabel: "Alójate con quienes mejor conocen la isla.",
      href: "/es/habitaciones-en-chios/",
    },
    relatedTitle: "Descubre más pueblos de Chios",
    relatedText: "Explora pueblos del mastiha, callejones medievales, paisajes del norte y pueblos junto al mar.",
  },
  {
    slug: "pueblo-lagada",
    seo: {
      canonicalPath: "/es/pueblos-chios/pueblo-lagada/",
      title: "Lagada Chios | Pueblo junto al mar, puerto y tabernas de pescado",
      description: "Descubre Lagada en Chios, un pueblo junto al mar con puerto, vistas a Oinousses, tabernas de pescado y ambiente local relajado.",
      ogImage: "/images/villages/lagada_3.webp",
    },
    hero: {
      kicker: "Este de Chios • Pueblo costero",
      title: "Lagada: puerto, mar y tabernas de pescado",
      description: "Descubre Lagada en Chios, un pueblo junto al mar con puerto, vistas a Oinousses, tabernas de pescado y ambiente local relajado.",
      image: "/images/villages/lagada_3.webp",
      tags: ["#lagada", "#seaside_village", "#fish_taverns", "#oinousses_views"],
    },
    details: [
      {
        icon: "📍",
        title: "Ubicación y acceso",
        text: "Lagada está en la costa este de Chios y es ideal para un paseo tranquilo y comer junto al mar.",
      },
      {
        icon: "🏘️",
        title: "Carácter del pueblo",
        text: "El pequeño puerto, las barcas de pesca y las tabernas dan a Lagada un carácter marinero auténtico.",
      },
      {
        icon: "💡",
        title: "Consejo local",
        text: "Ven a comer o cenar junto al puerto y disfruta de la vista hacia Oinousses.",
      },
    ],
    highlights: {
      title: "Qué ver",
      items: [
        "El pequeño puerto",
        "Las tabernas de pescado",
        "La vista hacia Oinousses"
      ],
    },
    experience: {
      title: "La experiencia",
      paragraphs: [
        "En Lagada merece la pena caminar despacio, observar la arquitectura y dejar que las calles guíen la visita.",
        "La visita es aún mejor si la combinas con otro pueblo, una playa cercana o una parada para comer.",
      ],
    },
    routeIdeas: {
      title: "Ideas de ruta",
      items: [
        {
          icon: "🚗",
          title: "Organiza la ruta",
          text: "Combina el pueblo con lugares cercanos, playas u otros pueblos de la zona.",
        },
        {
          icon: "🍽️",
          title: "Deja tiempo para comer",
          text: "Las tabernas y cafés suelen ser el mejor lugar para sentir la vida local.",
        },
        {
          icon: "📷",
          title: "Camina sin prisa",
          text: "Los detalles más bonitos aparecen cuando dejas el coche y te pierdes por las calles.",
        },
      ],
    },
    baseTip: {
      icon: "🗺️",
      title: "Tu base estratégica",
      text: "Desde Voulamandis House en Kampos puedes organizar fácilmente rutas por los pueblos de Chios, combinando cultura, playas y comida local.",
      linkLabel: "Alójate con quienes mejor conocen la isla.",
      href: "/es/habitaciones-en-chios/",
    },
    relatedTitle: "Descubre más pueblos de Chios",
    relatedText: "Explora pueblos del mastiha, callejones medievales, paisajes del norte y pueblos junto al mar.",
  },
  // TR localized villages,
  {
    slug: "pyrgi-koyu",
    seo: {
      canonicalPath: "/tr/sakiz-adasi-koyleri/pyrgi-koyu/",
      title: "Pyrgi Sakız Adası | Boyalı Orta Çağ köyü",
      description: "Sakız Adası’ndaki Pyrgi’yi keşfedin: siyah beyaz desenleri, dar sokakları ve mastik köyü kimliğiyle ünlü boyalı Orta Çağ köyü.",
      ogImage: "/images/villages/29651245457_aa8f702ef7_b-768x432.webp",
    },
    hero: {
      kicker: "Güney Sakız • Mastik köyü",
      title: "Pyrgi: Sakız’ın boyalı köyü",
      description: "Sakız Adası’ndaki Pyrgi’yi keşfedin: siyah beyaz desenleri, dar sokakları ve mastik köyü kimliğiyle ünlü boyalı Orta Çağ köyü.",
      image: "/images/villages/29651245457_aa8f702ef7_b-768x432.webp",
      tags: ["#pyrgi", "#mastic_village", "#xysta", "#medieval_chios"],
    },
    details: [
      {
        icon: "📍",
        title: "Konum & ulaşım",
        text: "Pyrgi, Sakız Adası’nın güneyinde, şehir merkezine yaklaşık 25 km uzaklıktadır ve mastik köyleri rotasının en önemli duraklarından biridir.",
      },
      {
        icon: "🏘️",
        title: "Köyün karakteri",
        text: "Xysta cepheleri, geometrik desenleri ve Orta Çağ dokusu köyü Yunanistan’da benzersiz kılar.",
      },
      {
        icon: "💡",
        title: "Yerel tavsiye",
        text: "Daha iyi ışık ve daha sakin sokaklar için sabah erken ya da akşamüstü gidin.",
      },
    ],
    highlights: {
      title: "Öne çıkanlar",
      items: [
        "Siyah beyaz süslemeli cepheler",
        "Kafeleri ve yerel hayatıyla meydan",
        "Mastik köylerinin atmosferi"
      ],
    },
    experience: {
      title: "Deneyim",
      paragraphs: [
        "Pyrgi köyünde yavaş yürümek, mimariyi izlemek ve dar sokakların sizi yönlendirmesine izin vermek en iyisidir.",
        "Ziyaret, yakındaki başka bir köy, bir plaj veya yemek molasıyla birleştiğinde daha da keyifli olur.",
      ],
    },
    routeIdeas: {
      title: "Rota fikirleri",
      items: [
        {
          icon: "🚗",
          title: "Rotayı planlayın",
          text: "Köyü yakınlardaki görülecek yerler, plajlar veya diğer köylerle birleştirin.",
        },
        {
          icon: "🍽️",
          title: "Yemek için zaman ayırın",
          text: "Tavernalar ve kafeler yerel hayatı hissetmenin en iyi yollarındandır.",
        },
        {
          icon: "📷",
          title: "Acele etmeden yürüyün",
          text: "En güzel detaylar arabayı bırakıp dar sokaklarda dolaşınca ortaya çıkar.",
        },
      ],
    },
    baseTip: {
      icon: "🗺️",
      title: "Stratejik üssünüz",
      text: "Kampos’taki Voulamandis House’tan Sakız köyleri rotalarını kolayca planlayabilir, kültürü, plajları ve yerel yemekleri birleştirebilirsiniz.",
      linkLabel: "Adayı en iyi bilenlerle konaklayın.",
      href: "/tr/sakiz-adasi-odalari/",
    },
    relatedTitle: "Sakız Adası’nın diğer köylerini keşfedin",
    relatedText: "Mastik köylerini, Orta Çağ sokaklarını, kuzey manzaralarını ve deniz kenarı köylerini keşfedin.",
  },
  {
    slug: "mesta-koyu",
    seo: {
      canonicalPath: "/tr/sakiz-adasi-koyleri/mesta-koyu/",
      title: "Mesta Sakız Adası | Orta Çağ kale köyü",
      description: "Sakız Adası’ndaki Mesta’yı keşfedin: taş sokakları, kemerleri ve otantik atmosferiyle en iyi korunmuş Orta Çağ kale köylerinden biri.",
      ogImage: "/images/villages/9ac4cf44d16c4af6d873c5bba4a6696b_L-768x480.webp",
    },
    hero: {
      kicker: "Güney Sakız • Kale köyü",
      title: "Mesta: Orta Çağ kale köyü",
      description: "Sakız Adası’ndaki Mesta’yı keşfedin: taş sokakları, kemerleri ve otantik atmosferiyle en iyi korunmuş Orta Çağ kale köylerinden biri.",
      image: "/images/villages/9ac4cf44d16c4af6d873c5bba4a6696b_L-768x480.webp",
      tags: ["#mesta", "#medieval_village", "#mastichochoria", "#stone_alleys"],
    },
    details: [
      {
        icon: "📍",
        title: "Konum & ulaşım",
        text: "Mesta, Sakız Adası’nın güneyinde mastik köylerinin kalbinde yer alır; Pyrgi, Olympoi ve Mavra Volia ile kolayca birleştirilebilir.",
      },
      {
        icon: "🏘️",
        title: "Köyün karakteri",
        text: "Kapalı kale düzeni, taş sokaklar ve kemerler Orta Çağ’a yolculuk hissi verir.",
      },
      {
        icon: "💡",
        title: "Yerel tavsiye",
        text: "Dar sokaklara kesin bir plan olmadan girin. Mesta’nın güzelliği kale köyünün içinde kaybolmaktır.",
      },
    ],
    highlights: {
      title: "Öne çıkanlar",
      items: [
        "Taş sokaklar ve kemerler",
        "Kahve veya yemek için köy meydanı",
        "Otantik Orta Çağ dokusu"
      ],
    },
    experience: {
      title: "Deneyim",
      paragraphs: [
        "Mesta köyünde yavaş yürümek, mimariyi izlemek ve dar sokakların sizi yönlendirmesine izin vermek en iyisidir.",
        "Ziyaret, yakındaki başka bir köy, bir plaj veya yemek molasıyla birleştiğinde daha da keyifli olur.",
      ],
    },
    routeIdeas: {
      title: "Rota fikirleri",
      items: [
        {
          icon: "🚗",
          title: "Rotayı planlayın",
          text: "Köyü yakınlardaki görülecek yerler, plajlar veya diğer köylerle birleştirin.",
        },
        {
          icon: "🍽️",
          title: "Yemek için zaman ayırın",
          text: "Tavernalar ve kafeler yerel hayatı hissetmenin en iyi yollarındandır.",
        },
        {
          icon: "📷",
          title: "Acele etmeden yürüyün",
          text: "En güzel detaylar arabayı bırakıp dar sokaklarda dolaşınca ortaya çıkar.",
        },
      ],
    },
    baseTip: {
      icon: "🗺️",
      title: "Stratejik üssünüz",
      text: "Kampos’taki Voulamandis House’tan Sakız köyleri rotalarını kolayca planlayabilir, kültürü, plajları ve yerel yemekleri birleştirebilirsiniz.",
      linkLabel: "Adayı en iyi bilenlerle konaklayın.",
      href: "/tr/sakiz-adasi-odalari/",
    },
    relatedTitle: "Sakız Adası’nın diğer köylerini keşfedin",
    relatedText: "Mastik köylerini, Orta Çağ sokaklarını, kuzey manzaralarını ve deniz kenarı köylerini keşfedin.",
  },
  {
    slug: "vessa-koyu",
    seo: {
      canonicalPath: "/tr/sakiz-adasi-koyleri/vessa-koyu/",
      title: "Vessa Sakız Adası | Sakin Orta Çağ mastik köyü",
      description: "Sakız Adası’ndaki Vessa’yı keşfedin: otantik atmosferi, taş sokakları ve sakin temposuyla huzurlu bir Orta Çağ mastik köyü.",
      ogImage: "/images/villages/29651245457_aa8f702ef7_b-768x432.webp",
    },
    hero: {
      kicker: "Güney Sakız • Sakin mastik köyü",
      title: "Vessa: sakin Orta Çağ mastik köyü",
      description: "Sakız Adası’ndaki Vessa’yı keşfedin: otantik atmosferi, taş sokakları ve sakin temposuyla huzurlu bir Orta Çağ mastik köyü.",
      image: "/images/villages/29651245457_aa8f702ef7_b-768x432.webp",
      tags: ["#vessa", "#quiet_village", "#mastichochoria", "#authentic_chios"],
    },
    details: [
      {
        icon: "📍",
        title: "Konum & ulaşım",
        text: "Vessa, Sakız Adası’nın güneyindedir ve Mesta, Olympoi ile batı ya da güney plajlarıyla kolayca birleştirilebilir.",
      },
      {
        icon: "🏘️",
        title: "Köyün karakteri",
        text: "Daha sakin ve daha az turistik olan Vessa, mastik köylerinin özgünlüğünü korur.",
      },
      {
        icon: "💡",
        title: "Yerel tavsiye",
        text: "Daha bilinen köylerin kalabalığı olmadan bir mastik köyünü sakin şekilde görmek için ideal bir duraktır.",
      },
    ],
    highlights: {
      title: "Öne çıkanlar",
      items: [
        "Sakin taş sokaklar",
        "Otantik mastik köyü atmosferi",
        "Güney rotasında iyi bir durak"
      ],
    },
    experience: {
      title: "Deneyim",
      paragraphs: [
        "Vessa köyünde yavaş yürümek, mimariyi izlemek ve dar sokakların sizi yönlendirmesine izin vermek en iyisidir.",
        "Ziyaret, yakındaki başka bir köy, bir plaj veya yemek molasıyla birleştiğinde daha da keyifli olur.",
      ],
    },
    routeIdeas: {
      title: "Rota fikirleri",
      items: [
        {
          icon: "🚗",
          title: "Rotayı planlayın",
          text: "Köyü yakınlardaki görülecek yerler, plajlar veya diğer köylerle birleştirin.",
        },
        {
          icon: "🍽️",
          title: "Yemek için zaman ayırın",
          text: "Tavernalar ve kafeler yerel hayatı hissetmenin en iyi yollarındandır.",
        },
        {
          icon: "📷",
          title: "Acele etmeden yürüyün",
          text: "En güzel detaylar arabayı bırakıp dar sokaklarda dolaşınca ortaya çıkar.",
        },
      ],
    },
    baseTip: {
      icon: "🗺️",
      title: "Stratejik üssünüz",
      text: "Kampos’taki Voulamandis House’tan Sakız köyleri rotalarını kolayca planlayabilir, kültürü, plajları ve yerel yemekleri birleştirebilirsiniz.",
      linkLabel: "Adayı en iyi bilenlerle konaklayın.",
      href: "/tr/sakiz-adasi-odalari/",
    },
    relatedTitle: "Sakız Adası’nın diğer köylerini keşfedin",
    relatedText: "Mastik köylerini, Orta Çağ sokaklarını, kuzey manzaralarını ve deniz kenarı köylerini keşfedin.",
  },
  {
    slug: "olympoi-koyu",
    seo: {
      canonicalPath: "/tr/sakiz-adasi-koyleri/olympoi-koyu/",
      title: "Olympoi Sakız Adası | Orta Çağ mastik köyü ve Mesta rotası",
      description: "Sakız Adası’ndaki Olympoi’yi keşfedin: surlu dokusu, otantik sokakları ve Mesta ile güzel bağlantısıyla Orta Çağ mastik köyü.",
      ogImage: "/images/villages/olympoi-1-768x432.webp",
    },
    hero: {
      kicker: "Güney Sakız • Surlu köy",
      title: "Olympoi: Orta Çağ mastik köyü",
      description: "Sakız Adası’ndaki Olympoi’yi keşfedin: surlu dokusu, otantik sokakları ve Mesta ile güzel bağlantısıyla Orta Çağ mastik köyü.",
      image: "/images/villages/olympoi-1-768x432.webp",
      tags: ["#olympoi", "#mastic_village", "#medieval_chios", "#south_chios"],
    },
    details: [
      {
        icon: "📍",
        title: "Konum & ulaşım",
        text: "Olympoi, Sakız Adası’nın güneyinde Mesta, Vessa ve Olympoi Mağarası yakınındadır.",
      },
      {
        icon: "🏘️",
        title: "Köyün karakteri",
        text: "Orta Çağ düzeni, dar geçitleri ve sakin atmosferi köyü keşfetmek için ideal kılar.",
      },
      {
        icon: "💡",
        title: "Yerel tavsiye",
        text: "Olympoi’yi Olympoi Mağarası ile birleştirin veya Mesta’ya yürüyerek ya da arabayla devam edin.",
      },
    ],
    highlights: {
      title: "Öne çıkanlar",
      items: [
        "Surlu Orta Çağ dokusu",
        "Mesta’ya yakın rota",
        "Bölgedeki Olympoi Mağarası"
      ],
    },
    experience: {
      title: "Deneyim",
      paragraphs: [
        "Olympoi köyünde yavaş yürümek, mimariyi izlemek ve dar sokakların sizi yönlendirmesine izin vermek en iyisidir.",
        "Ziyaret, yakındaki başka bir köy, bir plaj veya yemek molasıyla birleştiğinde daha da keyifli olur.",
      ],
    },
    routeIdeas: {
      title: "Rota fikirleri",
      items: [
        {
          icon: "🚗",
          title: "Rotayı planlayın",
          text: "Köyü yakınlardaki görülecek yerler, plajlar veya diğer köylerle birleştirin.",
        },
        {
          icon: "🍽️",
          title: "Yemek için zaman ayırın",
          text: "Tavernalar ve kafeler yerel hayatı hissetmenin en iyi yollarındandır.",
        },
        {
          icon: "📷",
          title: "Acele etmeden yürüyün",
          text: "En güzel detaylar arabayı bırakıp dar sokaklarda dolaşınca ortaya çıkar.",
        },
      ],
    },
    baseTip: {
      icon: "🗺️",
      title: "Stratejik üssünüz",
      text: "Kampos’taki Voulamandis House’tan Sakız köyleri rotalarını kolayca planlayabilir, kültürü, plajları ve yerel yemekleri birleştirebilirsiniz.",
      linkLabel: "Adayı en iyi bilenlerle konaklayın.",
      href: "/tr/sakiz-adasi-odalari/",
    },
    relatedTitle: "Sakız Adası’nın diğer köylerini keşfedin",
    relatedText: "Mastik köylerini, Orta Çağ sokaklarını, kuzey manzaralarını ve deniz kenarı köylerini keşfedin.",
  },
  {
    slug: "volissos-koyu",
    seo: {
      canonicalPath: "/tr/sakiz-adasi-koyleri/volissos-koyu/",
      title: "Volissos Sakız Adası | Kale, Amani ve kuzeybatı plajları",
      description: "Sakız Adası’nın kuzeybatısındaki Volissos’u keşfedin: kalesi, Amani manzaraları ve güzel kuzey plajlarına erişimiyle tarihi bir köy.",
      ogImage: "/images/villages/Volissos-Chios.webp",
    },
    hero: {
      kicker: "Kuzeybatı Sakız • Kale",
      title: "Volissos: kale ve kuzey Sakız",
      description: "Sakız Adası’nın kuzeybatısındaki Volissos’u keşfedin: kalesi, Amani manzaraları ve güzel kuzey plajlarına erişimiyle tarihi bir köy.",
      image: "/images/villages/Volissos-Chios.webp",
      tags: ["#volissos", "#north_chios", "#castle", "#amani"],
    },
    details: [
      {
        icon: "📍",
        title: "Konum & ulaşım",
        text: "Volissos, Sakız Adası’nın kuzeybatısındadır ve Amani, Agia Markella ve Lefkathia rotaları için iyi bir başlangıçtır.",
      },
      {
        icon: "🏘️",
        title: "Köyün karakteri",
        text: "Kalesi, taş evleri ve geniş manzaraları Volissos’a özel bir kuzey karakteri verir.",
      },
      {
        icon: "💡",
        title: "Yerel tavsiye",
        text: "Kalede güzel ışık için öğleden sonraya kadar kalın ve ziyareti Lefkathia ile birleştirin.",
      },
    ],
    highlights: {
      title: "Öne çıkanlar",
      items: [
        "Volissos Kalesi",
        "Amani’ye doğru manzaralar",
        "Yakındaki kuzeybatı plajları"
      ],
    },
    experience: {
      title: "Deneyim",
      paragraphs: [
        "Volissos köyünde yavaş yürümek, mimariyi izlemek ve dar sokakların sizi yönlendirmesine izin vermek en iyisidir.",
        "Ziyaret, yakındaki başka bir köy, bir plaj veya yemek molasıyla birleştiğinde daha da keyifli olur.",
      ],
    },
    routeIdeas: {
      title: "Rota fikirleri",
      items: [
        {
          icon: "🚗",
          title: "Rotayı planlayın",
          text: "Köyü yakınlardaki görülecek yerler, plajlar veya diğer köylerle birleştirin.",
        },
        {
          icon: "🍽️",
          title: "Yemek için zaman ayırın",
          text: "Tavernalar ve kafeler yerel hayatı hissetmenin en iyi yollarındandır.",
        },
        {
          icon: "📷",
          title: "Acele etmeden yürüyün",
          text: "En güzel detaylar arabayı bırakıp dar sokaklarda dolaşınca ortaya çıkar.",
        },
      ],
    },
    baseTip: {
      icon: "🗺️",
      title: "Stratejik üssünüz",
      text: "Kampos’taki Voulamandis House’tan Sakız köyleri rotalarını kolayca planlayabilir, kültürü, plajları ve yerel yemekleri birleştirebilirsiniz.",
      linkLabel: "Adayı en iyi bilenlerle konaklayın.",
      href: "/tr/sakiz-adasi-odalari/",
    },
    relatedTitle: "Sakız Adası’nın diğer köylerini keşfedin",
    relatedText: "Mastik köylerini, Orta Çağ sokaklarını, kuzey manzaralarını ve deniz kenarı köylerini keşfedin.",
  },
  {
    slug: "armolia-koyu",
    seo: {
      canonicalPath: "/tr/sakiz-adasi-koyleri/armolia-koyu/",
      title: "Armolia Sakız Adası | Seramik ve yerel zanaat köyü",
      description: "Sakız Adası’ndaki Armolia’yı keşfedin: atölyeleri, yerel zanaatı ve mastik köyleri rotasındaki kolay konumuyla seramik köyü.",
      ogImage: "/images/villages/unnamed-e1702830815478.webp",
    },
    hero: {
      kicker: "Güney Sakız • Seramik geleneği",
      title: "Armolia: seramik köyü",
      description: "Sakız Adası’ndaki Armolia’yı keşfedin: atölyeleri, yerel zanaatı ve mastik köyleri rotasındaki kolay konumuyla seramik köyü.",
      image: "/images/villages/unnamed-e1702830815478.webp",
      tags: ["#armolia", "#pottery", "#local_crafts", "#south_chios"],
    },
    details: [
      {
        icon: "📍",
        title: "Konum & ulaşım",
        text: "Armolia, Sakız Adası’nın güneyinde, Pyrgi, Mesta ve güney plajlarına giden rotalar için pratik bir noktadadır.",
      },
      {
        icon: "🏘️",
        title: "Köyün karakteri",
        text: "Köy, seramik geleneği ve yerel zanaatı yaşatan küçük atölyeleriyle bilinir.",
      },
      {
        icon: "💡",
        title: "Yerel tavsiye",
        text: "Seramikleri görmek ve Sakız’dan küçük el yapımı bir hatıra almak için durun.",
      },
    ],
    highlights: {
      title: "Öne çıkanlar",
      items: [
        "Seramik atölyeleri",
        "Yerel el sanatları",
        "Mastik köylerine kolay bir durak"
      ],
    },
    experience: {
      title: "Deneyim",
      paragraphs: [
        "Armolia köyünde yavaş yürümek, mimariyi izlemek ve dar sokakların sizi yönlendirmesine izin vermek en iyisidir.",
        "Ziyaret, yakındaki başka bir köy, bir plaj veya yemek molasıyla birleştiğinde daha da keyifli olur.",
      ],
    },
    routeIdeas: {
      title: "Rota fikirleri",
      items: [
        {
          icon: "🚗",
          title: "Rotayı planlayın",
          text: "Köyü yakınlardaki görülecek yerler, plajlar veya diğer köylerle birleştirin.",
        },
        {
          icon: "🍽️",
          title: "Yemek için zaman ayırın",
          text: "Tavernalar ve kafeler yerel hayatı hissetmenin en iyi yollarındandır.",
        },
        {
          icon: "📷",
          title: "Acele etmeden yürüyün",
          text: "En güzel detaylar arabayı bırakıp dar sokaklarda dolaşınca ortaya çıkar.",
        },
      ],
    },
    baseTip: {
      icon: "🗺️",
      title: "Stratejik üssünüz",
      text: "Kampos’taki Voulamandis House’tan Sakız köyleri rotalarını kolayca planlayabilir, kültürü, plajları ve yerel yemekleri birleştirebilirsiniz.",
      linkLabel: "Adayı en iyi bilenlerle konaklayın.",
      href: "/tr/sakiz-adasi-odalari/",
    },
    relatedTitle: "Sakız Adası’nın diğer köylerini keşfedin",
    relatedText: "Mastik köylerini, Orta Çağ sokaklarını, kuzey manzaralarını ve deniz kenarı köylerini keşfedin.",
  },
  {
    slug: "lagada-koyu",
    seo: {
      canonicalPath: "/tr/sakiz-adasi-koyleri/lagada-koyu/",
      title: "Lagada Sakız Adası | Deniz köyü, liman ve balık tavernaları",
      description: "Sakız Adası’ndaki Lagada’yı keşfedin: limanı, Oinousses manzaraları, balık tavernaları ve rahat yerel atmosferiyle deniz kenarı köyü.",
      ogImage: "/images/villages/lagada_3.webp",
    },
    hero: {
      kicker: "Doğu Sakız • Deniz kenarı köyü",
      title: "Lagada: liman, deniz ve balık tavernaları",
      description: "Sakız Adası’ndaki Lagada’yı keşfedin: limanı, Oinousses manzaraları, balık tavernaları ve rahat yerel atmosferiyle deniz kenarı köyü.",
      image: "/images/villages/lagada_3.webp",
      tags: ["#lagada", "#seaside_village", "#fish_taverns", "#oinousses_views"],
    },
    details: [
      {
        icon: "📍",
        title: "Konum & ulaşım",
        text: "Lagada, Sakız Adası’nın doğu kıyısındadır; deniz kenarında rahat yürüyüş ve yemek için iyi bir seçimdir.",
      },
      {
        icon: "🏘️",
        title: "Köyün karakteri",
        text: "Küçük liman, balıkçı tekneleri ve tavernalar Lagada’ya otantik bir deniz köyü karakteri verir.",
      },
      {
        icon: "💡",
        title: "Yerel tavsiye",
        text: "Liman yanında öğle veya akşam yemeği için gelin ve Oinousses manzarasının tadını çıkarın.",
      },
    ],
    highlights: {
      title: "Öne çıkanlar",
      items: [
        "Küçük liman",
        "Balık tavernaları",
        "Oinousses manzarası"
      ],
    },
    experience: {
      title: "Deneyim",
      paragraphs: [
        "Lagada köyünde yavaş yürümek, mimariyi izlemek ve dar sokakların sizi yönlendirmesine izin vermek en iyisidir.",
        "Ziyaret, yakındaki başka bir köy, bir plaj veya yemek molasıyla birleştiğinde daha da keyifli olur.",
      ],
    },
    routeIdeas: {
      title: "Rota fikirleri",
      items: [
        {
          icon: "🚗",
          title: "Rotayı planlayın",
          text: "Köyü yakınlardaki görülecek yerler, plajlar veya diğer köylerle birleştirin.",
        },
        {
          icon: "🍽️",
          title: "Yemek için zaman ayırın",
          text: "Tavernalar ve kafeler yerel hayatı hissetmenin en iyi yollarındandır.",
        },
        {
          icon: "📷",
          title: "Acele etmeden yürüyün",
          text: "En güzel detaylar arabayı bırakıp dar sokaklarda dolaşınca ortaya çıkar.",
        },
      ],
    },
    baseTip: {
      icon: "🗺️",
      title: "Stratejik üssünüz",
      text: "Kampos’taki Voulamandis House’tan Sakız köyleri rotalarını kolayca planlayabilir, kültürü, plajları ve yerel yemekleri birleştirebilirsiniz.",
      linkLabel: "Adayı en iyi bilenlerle konaklayın.",
      href: "/tr/sakiz-adasi-odalari/",
    },
    relatedTitle: "Sakız Adası’nın diğer köylerini keşfedin",
    relatedText: "Mastik köylerini, Orta Çağ sokaklarını, kuzey manzaralarını ve deniz kenarı köylerini keşfedin.",
  }
];



export const relatedVillageCards = [
  {
    slug: "chios-pyrgi",
    title: "Pyrgi",
    description: "The painted village of Chios, famous for its black-and-white xysta facades.",
    href: "/chios/chios-villages/chios-pyrgi/",
    image:
      "/images/villages/29651245457_aa8f702ef7_b-768x432.webp",
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
      "/images/villages/9ac4cf44d16c4af6d873c5bba4a6696b_L-768x480.webp",
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
      "/images/villages/29651245457_aa8f702ef7_b-768x432.webp",
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
      "/images/villages/olympoi-1-768x432.webp",
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
      "/images/villages/Volissos-Chios.webp",
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
      "/images/villages/unnamed-e1702830815478.webp",
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
      "/images/villages/lagada_3.webp",
    imageAlt: "Lagada seaside village in Chios with harbor and taverns",
    badge: "Seaside",
    size: "wide",
  },
] as const;

export function getVillageDetailBySlug(slug: string) {
  return villageDetails.find((village) => village.slug === slug);
}

export function getLocalizedVillageDetailByPath(path: string) {
  return localizedVillageDetails.find(
    (village) => village.seo.canonicalPath === path,
  );
}

export function getAllVillageDetails() {
  return [...villageDetails, ...localizedVillageDetails];
}

export function getRelatedVillageCards(currentSlug: string) {
  return relatedVillageCards.filter((village) => village.slug !== currentSlug);
}

export function getVillageSlugs() {
  return villageDetails.map((village) => village.slug);
}
