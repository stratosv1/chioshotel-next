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

export const localizedMuseumDetails: MuseumDetailData[] = [
  {
    "slug": "mouseio-mastichas-xios",
    "seo": {
      "canonicalPath": "/el/mouseia-xios/mouseio-mastichas-xios/",
      "title": "Μουσείο Μαστίχας Χίου | Πολιτιστικός οδηγός Χίου",
      "description": "Επισκεφθείτε Μουσείο Μαστίχας Χίου και ανακαλύψτε την ιστορία, την καλλιέργεια και την πολιτιστική αξία της μαστίχας.",
      "ogImage": "https://chioshotel.gr/wp-content/uploads/2022/12/mousio.mastic.webp"
    },
    "hero": {
      "kicker": "Νότια Χίος • Πολιτισμός μαστίχας",
      "title": "Μουσείο Μαστίχας Χίου",
      "description": "Επισκεφθείτε Μουσείο Μαστίχας Χίου και ανακαλύψτε την ιστορία, την καλλιέργεια και την πολιτιστική αξία της μαστίχας.",
      "image": "https://chioshotel.gr/wp-content/uploads/2022/12/mousio.mastic.webp",
      "tags": [
        "#mastic_museum",
        "#south_chios",
        "#mastic_culture",
        "#mastichochoria"
      ]
    },
    "details": [
      {
        "icon": "📍",
        "title": "Τοποθεσία & πρόσβαση",
        "text": "Βρίσκεται σε εύκολα προσβάσιμο σημείο και συνδυάζεται όμορφα με μια πολιτιστική διαδρομή στη Χίο."
      },
      {
        "icon": "🏛️",
        "title": "Θεματική μουσείου",
        "text": "Το μουσείο παρουσιάζει την ιστορία, την καλλιέργεια και την πολιτιστική αξία της μαστίχας."
      },
      {
        "icon": "💡",
        "title": "Τοπική συμβουλή",
        "text": "Συνδυάστε την επίσκεψη με κοντινή βόλτα, καφέ ή φαγητό για μια πιο ολοκληρωμένη εμπειρία."
      }
    ],
    "highlights": {
      "title": "Τι θα δείτε",
      "items": [
        "Την ιστορία, την καλλιέργεια και την πολιτιστική αξία της μαστίχας",
        "Σύνδεση με την ιστορία και την ταυτότητα της Χίου",
        "Μια χρήσιμη πολιτιστική στάση για όλες τις εποχές"
      ]
    },
    "experience": {
      "title": "Γιατί αξίζει η επίσκεψη",
      "paragraphs": [
        "Επισκεφθείτε Μουσείο Μαστίχας Χίου και ανακαλύψτε την ιστορία, την καλλιέργεια και την πολιτιστική αξία της μαστίχας.",
        "Είναι μια καλή στάση για να καταλάβετε καλύτερα το νησί πέρα από τις παραλίες και τα χωριά."
      ]
    },
    "routeIdeas": {
      "title": "Πώς να το συνδυάσετε",
      "items": [
        {
          "icon": "🏛️",
          "title": "Πολιτιστική βόλτα",
          "text": "Συνδυάστε την επίσκεψη με κοντινή βόλτα, καφέ ή φαγητό για μια πιο ολοκληρωμένη εμπειρία."
        },
        {
          "icon": "🚗",
          "title": "Συνδυάστε κοντινά σημεία",
          "text": "Βρίσκεται σε εύκολα προσβάσιμο σημείο και συνδυάζεται όμορφα με μια πολιτιστική διαδρομή στη Χίο."
        },
        {
          "icon": "📷",
          "title": "Αφήστε χρόνο",
          "text": "Τα μουσεία αποκαλύπτουν περισσότερα όταν τα δείτε χωρίς βιασύνη."
        }
      ]
    },
    "baseTip": {
      "icon": "🗺️",
      "title": "Η στρατηγική σας βάση",
      "text": "Με βάση το Voulamandis House στον Κάμπο, μπορείτε να οργανώσετε εύκολα μουσεία, χωριά, παραλίες και γεύσεις της Χίου σε ισορροπημένες ημερήσιες διαδρομές.",
      "linkLabel": "Μείνετε με ανθρώπους που γνωρίζουν το νησί.",
      "href": "/el/domatia-xios/"
    },
    "relatedTitle": "Ανακαλύψτε περισσότερα μουσεία της Χίου",
    "relatedText": "Συνεχίστε την πολιτιστική διαδρομή σας στη Χίο με αρχαιολογία, βυζαντινή τέχνη, ναυτική ιστορία, βιβλία, μαστίχα και λαογραφία."
  },
  {
    "slug": "musee-du-mastic-chios",
    "seo": {
      "canonicalPath": "/fr/musees-de-chios/musee-du-mastic-chios/",
      "title": "Musée du Mastic de Chios | Guide culturel de Chios",
      "description": "Visitez Musée du Mastic de Chios et découvrez l’histoire, la culture et l’importance culturelle du mastic.",
      "ogImage": "https://chioshotel.gr/wp-content/uploads/2022/12/mousio.mastic.webp"
    },
    "hero": {
      "kicker": "Sud de Chios • Culture du mastic",
      "title": "Musée du Mastic de Chios",
      "description": "Visitez Musée du Mastic de Chios et découvrez l’histoire, la culture et l’importance culturelle du mastic.",
      "image": "https://chioshotel.gr/wp-content/uploads/2022/12/mousio.mastic.webp",
      "tags": [
        "#mastic_museum",
        "#south_chios",
        "#mastic_culture",
        "#mastichochoria"
      ]
    },
    "details": [
      {
        "icon": "📍",
        "title": "Emplacement & accès",
        "text": "Il se trouve dans un secteur facile à intégrer à un itinéraire culturel à Chios."
      },
      {
        "icon": "🏛️",
        "title": "Thème du musée",
        "text": "Le musée présente l’histoire, la culture et l’importance culturelle du mastic."
      },
      {
        "icon": "💡",
        "title": "Conseil local",
        "text": "Combinez la visite avec une promenade, un café ou un repas à proximité pour une expérience plus complète."
      }
    ],
    "highlights": {
      "title": "À voir",
      "items": [
        "L’histoire, la culture et l’importance culturelle du mastic",
        "Lien avec l’histoire et l’identité de Chios",
        "Une halte culturelle utile en toute saison"
      ]
    },
    "experience": {
      "title": "Pourquoi visiter",
      "paragraphs": [
        "Visitez Musée du Mastic de Chios et découvrez l’histoire, la culture et l’importance culturelle du mastic.",
        "C’est une bonne étape pour mieux comprendre l’île au-delà des plages et des villages."
      ]
    },
    "routeIdeas": {
      "title": "Comment l’intégrer à votre itinéraire",
      "items": [
        {
          "icon": "🏛️",
          "title": "Promenade culturelle",
          "text": "Combinez la visite avec une promenade, un café ou un repas à proximité pour une expérience plus complète."
        },
        {
          "icon": "🚗",
          "title": "Combinez les lieux proches",
          "text": "Il se trouve dans un secteur facile à intégrer à un itinéraire culturel à Chios."
        },
        {
          "icon": "📷",
          "title": "Prenez votre temps",
          "text": "Les musées se révèlent mieux quand on les visite sans hâte."
        }
      ]
    },
    "baseTip": {
      "icon": "🗺️",
      "title": "Votre base stratégique",
      "text": "Depuis Voulamandis House à Kampos, vous pouvez organiser facilement musées, villages, plages et gastronomie de Chios en belles journées équilibrées.",
      "linkLabel": "Séjournez avec ceux qui connaissent le mieux l’île.",
      "href": "/fr/chambres-a-chios/"
    },
    "relatedTitle": "Découvrez plus de musées de Chios",
    "relatedText": "Poursuivez votre itinéraire culturel à Chios avec archéologie, art byzantin, histoire maritime, livres, mastic et folklore."
  },
  {
    "slug": "mastix-museum-chios",
    "seo": {
      "canonicalPath": "/de/museen-chios/mastix-museum-chios/",
      "title": "Mastix-Museum Chios | Kulturführer für Chios",
      "description": "Besuchen Sie Mastix-Museum Chios und entdecken Sie Geschichte, Anbau und kulturelle Bedeutung des Mastix.",
      "ogImage": "https://chioshotel.gr/wp-content/uploads/2022/12/mousio.mastic.webp"
    },
    "hero": {
      "kicker": "Süd-Chios • Mastixkultur",
      "title": "Mastix-Museum Chios",
      "description": "Besuchen Sie Mastix-Museum Chios und entdecken Sie Geschichte, Anbau und kulturelle Bedeutung des Mastix.",
      "image": "https://chioshotel.gr/wp-content/uploads/2022/12/mousio.mastic.webp",
      "tags": [
        "#mastic_museum",
        "#south_chios",
        "#mastic_culture",
        "#mastichochoria"
      ]
    },
    "details": [
      {
        "icon": "📍",
        "title": "Lage & Zugang",
        "text": "Es liegt an einem gut erreichbaren Ort und lässt sich leicht in eine Kulturroute auf Chios einbauen."
      },
      {
        "icon": "🏛️",
        "title": "Museumsschwerpunkt",
        "text": "Das Museum zeigt Geschichte, Anbau und kulturelle Bedeutung des Mastix."
      },
      {
        "icon": "💡",
        "title": "Lokaler Tipp",
        "text": "Kombinieren Sie den Besuch mit einem Spaziergang, Kaffee oder Essen in der Nähe für ein runderes Erlebnis."
      }
    ],
    "highlights": {
      "title": "Was Sie sehen können",
      "items": [
        "Geschichte, Anbau und kulturelle Bedeutung des Mastix",
        "Verbindung zur Geschichte und Identität von Chios",
        "Ein sinnvoller Kulturstopp zu jeder Jahreszeit"
      ]
    },
    "experience": {
      "title": "Warum sich der Besuch lohnt",
      "paragraphs": [
        "Besuchen Sie Mastix-Museum Chios und entdecken Sie Geschichte, Anbau und kulturelle Bedeutung des Mastix.",
        "Es ist ein guter Stopp, um die Insel jenseits von Stränden und Dörfern besser zu verstehen."
      ]
    },
    "routeIdeas": {
      "title": "So kombinieren Sie den Besuch",
      "items": [
        {
          "icon": "🏛️",
          "title": "Kulturspaziergang",
          "text": "Kombinieren Sie den Besuch mit einem Spaziergang, Kaffee oder Essen in der Nähe für ein runderes Erlebnis."
        },
        {
          "icon": "🚗",
          "title": "Nahe Orte kombinieren",
          "text": "Es liegt an einem gut erreichbaren Ort und lässt sich leicht in eine Kulturroute auf Chios einbauen."
        },
        {
          "icon": "📷",
          "title": "Nehmen Sie sich Zeit",
          "text": "Museen zeigen mehr, wenn man sie ohne Eile besucht."
        }
      ]
    },
    "baseTip": {
      "icon": "🗺️",
      "title": "Ihre strategische Basis",
      "text": "Von Voulamandis House in Kampos aus können Sie Museen, Dörfer, Strände und kulinarische Stopps auf Chios entspannt in Tagesrouten verbinden.",
      "linkLabel": "Übernachten Sie bei Menschen, die die Insel kennen.",
      "href": "/de/chios-zimmer/"
    },
    "relatedTitle": "Weitere Museen auf Chios entdecken",
    "relatedText": "Setzen Sie Ihre Kulturroute auf Chios mit Archäologie, byzantinischer Kunst, Seefahrtsgeschichte, Büchern, Mastix und Volkskunde fort."
  },
  {
    "slug": "museo-del-mastice-chios",
    "seo": {
      "canonicalPath": "/it/musei-chios/museo-del-mastice-chios/",
      "title": "Museo del Mastice di Chios | Guida culturale di Chios",
      "description": "Visita Museo del Mastice di Chios e scopri la storia, la coltivazione e il valore culturale del mastice.",
      "ogImage": "https://chioshotel.gr/wp-content/uploads/2022/12/mousio.mastic.webp"
    },
    "hero": {
      "kicker": "Chios meridionale • Cultura del mastice",
      "title": "Museo del Mastice di Chios",
      "description": "Visita Museo del Mastice di Chios e scopri la storia, la coltivazione e il valore culturale del mastice.",
      "image": "https://chioshotel.gr/wp-content/uploads/2022/12/mousio.mastic.webp",
      "tags": [
        "#mastic_museum",
        "#south_chios",
        "#mastic_culture",
        "#mastichochoria"
      ]
    },
    "details": [
      {
        "icon": "📍",
        "title": "Posizione & accesso",
        "text": "Si trova in una zona facile da inserire in un itinerario culturale a Chios."
      },
      {
        "icon": "🏛️",
        "title": "Tema del museo",
        "text": "Il museo presenta la storia, la coltivazione e il valore culturale del mastice."
      },
      {
        "icon": "💡",
        "title": "Consiglio locale",
        "text": "Combina la visita con una passeggiata, un caffè o un pasto nelle vicinanze per un’esperienza più completa."
      }
    ],
    "highlights": {
      "title": "Cosa vedere",
      "items": [
        "La storia, la coltivazione e il valore culturale del mastice",
        "Collegamento con la storia e l’identità di Chios",
        "Una tappa culturale utile in ogni stagione"
      ]
    },
    "experience": {
      "title": "Perché visitarlo",
      "paragraphs": [
        "Visita Museo del Mastice di Chios e scopri la storia, la coltivazione e il valore culturale del mastice.",
        "È una tappa utile per capire meglio l’isola oltre alle spiagge e ai villaggi."
      ]
    },
    "routeIdeas": {
      "title": "Come combinarlo",
      "items": [
        {
          "icon": "🏛️",
          "title": "Passeggiata culturale",
          "text": "Combina la visita con una passeggiata, un caffè o un pasto nelle vicinanze per un’esperienza più completa."
        },
        {
          "icon": "🚗",
          "title": "Combina luoghi vicini",
          "text": "Si trova in una zona facile da inserire in un itinerario culturale a Chios."
        },
        {
          "icon": "📷",
          "title": "Prenditi tempo",
          "text": "I musei rivelano di più quando li visiti senza fretta."
        }
      ]
    },
    "baseTip": {
      "icon": "🗺️",
      "title": "La tua base strategica",
      "text": "Da Voulamandis House a Kampos puoi organizzare facilmente musei, villaggi, spiagge e sapori di Chios in itinerari giornalieri equilibrati.",
      "linkLabel": "Soggiorna con chi conosce meglio l’isola.",
      "href": "/it/camere-a-chios/"
    },
    "relatedTitle": "Scopri altri musei di Chios",
    "relatedText": "Continua il tuo itinerario culturale a Chios con archeologia, arte bizantina, storia marittima, libri, mastice e folklore."
  },
  {
    "slug": "museo-mastiha-chios",
    "seo": {
      "canonicalPath": "/es/museos-chios/museo-mastiha-chios/",
      "title": "Museo de la Mastiha de Chios | Guía cultural de Chios",
      "description": "Visita Museo de la Mastiha de Chios y descubre la historia, el cultivo y la importancia cultural de la mastiha.",
      "ogImage": "https://chioshotel.gr/wp-content/uploads/2022/12/mousio.mastic.webp"
    },
    "hero": {
      "kicker": "Sur de Chios • Cultura de la mastiha",
      "title": "Museo de la Mastiha de Chios",
      "description": "Visita Museo de la Mastiha de Chios y descubre la historia, el cultivo y la importancia cultural de la mastiha.",
      "image": "https://chioshotel.gr/wp-content/uploads/2022/12/mousio.mastic.webp",
      "tags": [
        "#mastic_museum",
        "#south_chios",
        "#mastic_culture",
        "#mastichochoria"
      ]
    },
    "details": [
      {
        "icon": "📍",
        "title": "Ubicación y acceso",
        "text": "Está en una zona fácil de incluir en una ruta cultural por Chios."
      },
      {
        "icon": "🏛️",
        "title": "Tema del museo",
        "text": "El museo presenta la historia, el cultivo y la importancia cultural de la mastiha."
      },
      {
        "icon": "💡",
        "title": "Consejo local",
        "text": "Combina la visita con un paseo, un café o una comida cercana para una experiencia más completa."
      }
    ],
    "highlights": {
      "title": "Qué ver",
      "items": [
        "La historia, el cultivo y la importancia cultural de la mastiha",
        "Conexión con la historia y la identidad de Chios",
        "Una parada cultural útil en cualquier época"
      ]
    },
    "experience": {
      "title": "Por qué visitarlo",
      "paragraphs": [
        "Visita Museo de la Mastiha de Chios y descubre la historia, el cultivo y la importancia cultural de la mastiha.",
        "Es una buena parada para comprender mejor la isla más allá de sus playas y pueblos."
      ]
    },
    "routeIdeas": {
      "title": "Cómo combinarlo",
      "items": [
        {
          "icon": "🏛️",
          "title": "Paseo cultural",
          "text": "Combina la visita con un paseo, un café o una comida cercana para una experiencia más completa."
        },
        {
          "icon": "🚗",
          "title": "Combina lugares cercanos",
          "text": "Está en una zona fácil de incluir en una ruta cultural por Chios."
        },
        {
          "icon": "📷",
          "title": "Tómate tu tiempo",
          "text": "Los museos se disfrutan más cuando se visitan sin prisa."
        }
      ]
    },
    "baseTip": {
      "icon": "🗺️",
      "title": "Tu base estratégica",
      "text": "Desde Voulamandis House en Kampos puedes organizar fácilmente museos, pueblos, playas y sabores de Chios en rutas diarias equilibradas.",
      "linkLabel": "Alójate con quienes mejor conocen la isla.",
      "href": "/es/habitaciones-en-chios/"
    },
    "relatedTitle": "Descubre más museos de Chios",
    "relatedText": "Continúa tu ruta cultural por Chios con arqueología, arte bizantino, historia marítima, libros, mastiha y folclore."
  },
  {
    "slug": "sakiz-mastik-muzesi",
    "seo": {
      "canonicalPath": "/tr/sakiz-adasi-muzeleri/sakiz-mastik-muzesi/",
      "title": "Sakız Mastik Müzesi | Sakız Adası kültür rehberi",
      "description": "Ziyaret edin Sakız Mastik Müzesi ve keşfedin mastiğin tarihini, üretimini ve kültürel önemini.",
      "ogImage": "https://chioshotel.gr/wp-content/uploads/2022/12/mousio.mastic.webp"
    },
    "hero": {
      "kicker": "Güney Sakız • Mastik kültürü",
      "title": "Sakız Mastik Müzesi",
      "description": "Ziyaret edin Sakız Mastik Müzesi ve keşfedin mastiğin tarihini, üretimini ve kültürel önemini.",
      "image": "https://chioshotel.gr/wp-content/uploads/2022/12/mousio.mastic.webp",
      "tags": [
        "#mastic_museum",
        "#south_chios",
        "#mastic_culture",
        "#mastichochoria"
      ]
    },
    "details": [
      {
        "icon": "📍",
        "title": "Konum & ulaşım",
        "text": "Sakız Adası’ndaki kültür rotalarına kolayca eklenebilecek bir konumdadır."
      },
      {
        "icon": "🏛️",
        "title": "Müze teması",
        "text": "Müze mastiğin tarihini, üretimini ve kültürel önemini."
      },
      {
        "icon": "💡",
        "title": "Yerel tavsiye",
        "text": "Ziyareti yakınlarda kısa bir yürüyüş, kahve veya yemek molasıyla birleştirerek daha tamamlayıcı bir deneyim yaşayabilirsiniz."
      }
    ],
    "highlights": {
      "title": "Neler görülebilir",
      "items": [
        "Mastiğin tarihini, üretimini ve kültürel önemini",
        "Sakız’ın tarihi ve kimliğiyle bağlantı",
        "Her mevsim için anlamlı bir kültür durağı"
      ]
    },
    "experience": {
      "title": "Neden ziyaret etmeli",
      "paragraphs": [
        "Ziyaret edin Sakız Mastik Müzesi ve keşfedin mastiğin tarihini, üretimini ve kültürel önemini.",
        "Plajların ve köylerin ötesinde adayı daha iyi anlamak için iyi bir duraktır."
      ]
    },
    "routeIdeas": {
      "title": "Nasıl birleştirilir",
      "items": [
        {
          "icon": "🏛️",
          "title": "Kültür yürüyüşü",
          "text": "Ziyareti yakınlarda kısa bir yürüyüş, kahve veya yemek molasıyla birleştirerek daha tamamlayıcı bir deneyim yaşayabilirsiniz."
        },
        {
          "icon": "🚗",
          "title": "Yakın noktaları birleştirin",
          "text": "Sakız Adası’ndaki kültür rotalarına kolayca eklenebilecek bir konumdadır."
        },
        {
          "icon": "📷",
          "title": "Zaman ayırın",
          "text": "Müzeler acele etmeden gezildiğinde daha çok şey anlatır."
        }
      ]
    },
    "baseTip": {
      "icon": "🗺️",
      "title": "Stratejik üssünüz",
      "text": "Kampos’taki Voulamandis House’tan müzeleri, köyleri, plajları ve Sakız lezzetlerini dengeli günlük rotalar halinde kolayca planlayabilirsiniz.",
      "linkLabel": "Adayı en iyi bilenlerle konaklayın.",
      "href": "/tr/sakiz-adasi-odalari/"
    },
    "relatedTitle": "Daha fazla Sakız müzesi keşfedin",
    "relatedText": "Sakız Adası’ndaki kültür rotanıza arkeoloji, Bizans sanatı, denizcilik tarihi, kitaplar, mastik ve folklorla devam edin."
  },
  {
    "slug": "arxaiologiko-mouseio-xios",
    "seo": {
      "canonicalPath": "/el/mouseia-xios/arxaiologiko-mouseio-xios/",
      "title": "Αρχαιολογικό Μουσείο Χίου | Πολιτιστικός οδηγός Χίου",
      "description": "Επισκεφθείτε Αρχαιολογικό Μουσείο Χίου και ανακαλύψτε την αρχαία ιστορία, τα ευρήματα, την κεραμική και την πολιτιστική κληρονομιά του νησιού.",
      "ogImage": "https://chioshotel.gr/wp-content/uploads/2021/12/caption.webp"
    },
    "hero": {
      "kicker": "Πόλη Χίου • Αρχαία ιστορία",
      "title": "Αρχαιολογικό Μουσείο Χίου",
      "description": "Επισκεφθείτε Αρχαιολογικό Μουσείο Χίου και ανακαλύψτε την αρχαία ιστορία, τα ευρήματα, την κεραμική και την πολιτιστική κληρονομιά του νησιού.",
      "image": "https://chioshotel.gr/wp-content/uploads/2021/12/caption.webp",
      "tags": [
        "#archaeology",
        "#chios_town",
        "#ancient_chios",
        "#museum_guide"
      ]
    },
    "details": [
      {
        "icon": "📍",
        "title": "Τοποθεσία & πρόσβαση",
        "text": "Βρίσκεται σε εύκολα προσβάσιμο σημείο και συνδυάζεται όμορφα με μια πολιτιστική διαδρομή στη Χίο."
      },
      {
        "icon": "🏛️",
        "title": "Θεματική μουσείου",
        "text": "Το μουσείο παρουσιάζει την αρχαία ιστορία, τα ευρήματα, την κεραμική και την πολιτιστική κληρονομιά του νησιού."
      },
      {
        "icon": "💡",
        "title": "Τοπική συμβουλή",
        "text": "Συνδυάστε την επίσκεψη με κοντινή βόλτα, καφέ ή φαγητό για μια πιο ολοκληρωμένη εμπειρία."
      }
    ],
    "highlights": {
      "title": "Τι θα δείτε",
      "items": [
        "Την αρχαία ιστορία, τα ευρήματα, την κεραμική και την πολιτιστική κληρονομιά του νησιού",
        "Σύνδεση με την ιστορία και την ταυτότητα της Χίου",
        "Μια χρήσιμη πολιτιστική στάση για όλες τις εποχές"
      ]
    },
    "experience": {
      "title": "Γιατί αξίζει η επίσκεψη",
      "paragraphs": [
        "Επισκεφθείτε Αρχαιολογικό Μουσείο Χίου και ανακαλύψτε την αρχαία ιστορία, τα ευρήματα, την κεραμική και την πολιτιστική κληρονομιά του νησιού.",
        "Είναι μια καλή στάση για να καταλάβετε καλύτερα το νησί πέρα από τις παραλίες και τα χωριά."
      ]
    },
    "routeIdeas": {
      "title": "Πώς να το συνδυάσετε",
      "items": [
        {
          "icon": "🏛️",
          "title": "Πολιτιστική βόλτα",
          "text": "Συνδυάστε την επίσκεψη με κοντινή βόλτα, καφέ ή φαγητό για μια πιο ολοκληρωμένη εμπειρία."
        },
        {
          "icon": "🚗",
          "title": "Συνδυάστε κοντινά σημεία",
          "text": "Βρίσκεται σε εύκολα προσβάσιμο σημείο και συνδυάζεται όμορφα με μια πολιτιστική διαδρομή στη Χίο."
        },
        {
          "icon": "📷",
          "title": "Αφήστε χρόνο",
          "text": "Τα μουσεία αποκαλύπτουν περισσότερα όταν τα δείτε χωρίς βιασύνη."
        }
      ]
    },
    "baseTip": {
      "icon": "🗺️",
      "title": "Η στρατηγική σας βάση",
      "text": "Με βάση το Voulamandis House στον Κάμπο, μπορείτε να οργανώσετε εύκολα μουσεία, χωριά, παραλίες και γεύσεις της Χίου σε ισορροπημένες ημερήσιες διαδρομές.",
      "linkLabel": "Μείνετε με ανθρώπους που γνωρίζουν το νησί.",
      "href": "/el/domatia-xios/"
    },
    "relatedTitle": "Ανακαλύψτε περισσότερα μουσεία της Χίου",
    "relatedText": "Συνεχίστε την πολιτιστική διαδρομή σας στη Χίο με αρχαιολογία, βυζαντινή τέχνη, ναυτική ιστορία, βιβλία, μαστίχα και λαογραφία."
  },
  {
    "slug": "musee-archeologique-chios",
    "seo": {
      "canonicalPath": "/fr/musees-de-chios/musee-archeologique-chios/",
      "title": "Musée archéologique de Chios | Guide culturel de Chios",
      "description": "Visitez Musée archéologique de Chios et découvrez l’histoire ancienne, les objets, la céramique et le patrimoine de l’île.",
      "ogImage": "https://chioshotel.gr/wp-content/uploads/2021/12/caption.webp"
    },
    "hero": {
      "kicker": "Ville de Chios • Histoire ancienne",
      "title": "Musée archéologique de Chios",
      "description": "Visitez Musée archéologique de Chios et découvrez l’histoire ancienne, les objets, la céramique et le patrimoine de l’île.",
      "image": "https://chioshotel.gr/wp-content/uploads/2021/12/caption.webp",
      "tags": [
        "#archaeology",
        "#chios_town",
        "#ancient_chios",
        "#museum_guide"
      ]
    },
    "details": [
      {
        "icon": "📍",
        "title": "Emplacement & accès",
        "text": "Il se trouve dans un secteur facile à intégrer à un itinéraire culturel à Chios."
      },
      {
        "icon": "🏛️",
        "title": "Thème du musée",
        "text": "Le musée présente l’histoire ancienne, les objets, la céramique et le patrimoine de l’île."
      },
      {
        "icon": "💡",
        "title": "Conseil local",
        "text": "Combinez la visite avec une promenade, un café ou un repas à proximité pour une expérience plus complète."
      }
    ],
    "highlights": {
      "title": "À voir",
      "items": [
        "L’histoire ancienne, les objets, la céramique et le patrimoine de l’île",
        "Lien avec l’histoire et l’identité de Chios",
        "Une halte culturelle utile en toute saison"
      ]
    },
    "experience": {
      "title": "Pourquoi visiter",
      "paragraphs": [
        "Visitez Musée archéologique de Chios et découvrez l’histoire ancienne, les objets, la céramique et le patrimoine de l’île.",
        "C’est une bonne étape pour mieux comprendre l’île au-delà des plages et des villages."
      ]
    },
    "routeIdeas": {
      "title": "Comment l’intégrer à votre itinéraire",
      "items": [
        {
          "icon": "🏛️",
          "title": "Promenade culturelle",
          "text": "Combinez la visite avec une promenade, un café ou un repas à proximité pour une expérience plus complète."
        },
        {
          "icon": "🚗",
          "title": "Combinez les lieux proches",
          "text": "Il se trouve dans un secteur facile à intégrer à un itinéraire culturel à Chios."
        },
        {
          "icon": "📷",
          "title": "Prenez votre temps",
          "text": "Les musées se révèlent mieux quand on les visite sans hâte."
        }
      ]
    },
    "baseTip": {
      "icon": "🗺️",
      "title": "Votre base stratégique",
      "text": "Depuis Voulamandis House à Kampos, vous pouvez organiser facilement musées, villages, plages et gastronomie de Chios en belles journées équilibrées.",
      "linkLabel": "Séjournez avec ceux qui connaissent le mieux l’île.",
      "href": "/fr/chambres-a-chios/"
    },
    "relatedTitle": "Découvrez plus de musées de Chios",
    "relatedText": "Poursuivez votre itinéraire culturel à Chios avec archéologie, art byzantin, histoire maritime, livres, mastic et folklore."
  },
  {
    "slug": "archaeologisches-museum-chios",
    "seo": {
      "canonicalPath": "/de/museen-chios/archaeologisches-museum-chios/",
      "title": "Archäologisches Museum Chios | Kulturführer für Chios",
      "description": "Besuchen Sie Archäologisches Museum Chios und entdecken Sie antike Geschichte, Fundstücke, Keramik und Kulturerbe der Insel.",
      "ogImage": "https://chioshotel.gr/wp-content/uploads/2021/12/caption.webp"
    },
    "hero": {
      "kicker": "Chios-Stadt • Antike Geschichte",
      "title": "Archäologisches Museum Chios",
      "description": "Besuchen Sie Archäologisches Museum Chios und entdecken Sie antike Geschichte, Fundstücke, Keramik und Kulturerbe der Insel.",
      "image": "https://chioshotel.gr/wp-content/uploads/2021/12/caption.webp",
      "tags": [
        "#archaeology",
        "#chios_town",
        "#ancient_chios",
        "#museum_guide"
      ]
    },
    "details": [
      {
        "icon": "📍",
        "title": "Lage & Zugang",
        "text": "Es liegt an einem gut erreichbaren Ort und lässt sich leicht in eine Kulturroute auf Chios einbauen."
      },
      {
        "icon": "🏛️",
        "title": "Museumsschwerpunkt",
        "text": "Das Museum zeigt antike Geschichte, Fundstücke, Keramik und Kulturerbe der Insel."
      },
      {
        "icon": "💡",
        "title": "Lokaler Tipp",
        "text": "Kombinieren Sie den Besuch mit einem Spaziergang, Kaffee oder Essen in der Nähe für ein runderes Erlebnis."
      }
    ],
    "highlights": {
      "title": "Was Sie sehen können",
      "items": [
        "Antike Geschichte, Fundstücke, Keramik und Kulturerbe der Insel",
        "Verbindung zur Geschichte und Identität von Chios",
        "Ein sinnvoller Kulturstopp zu jeder Jahreszeit"
      ]
    },
    "experience": {
      "title": "Warum sich der Besuch lohnt",
      "paragraphs": [
        "Besuchen Sie Archäologisches Museum Chios und entdecken Sie antike Geschichte, Fundstücke, Keramik und Kulturerbe der Insel.",
        "Es ist ein guter Stopp, um die Insel jenseits von Stränden und Dörfern besser zu verstehen."
      ]
    },
    "routeIdeas": {
      "title": "So kombinieren Sie den Besuch",
      "items": [
        {
          "icon": "🏛️",
          "title": "Kulturspaziergang",
          "text": "Kombinieren Sie den Besuch mit einem Spaziergang, Kaffee oder Essen in der Nähe für ein runderes Erlebnis."
        },
        {
          "icon": "🚗",
          "title": "Nahe Orte kombinieren",
          "text": "Es liegt an einem gut erreichbaren Ort und lässt sich leicht in eine Kulturroute auf Chios einbauen."
        },
        {
          "icon": "📷",
          "title": "Nehmen Sie sich Zeit",
          "text": "Museen zeigen mehr, wenn man sie ohne Eile besucht."
        }
      ]
    },
    "baseTip": {
      "icon": "🗺️",
      "title": "Ihre strategische Basis",
      "text": "Von Voulamandis House in Kampos aus können Sie Museen, Dörfer, Strände und kulinarische Stopps auf Chios entspannt in Tagesrouten verbinden.",
      "linkLabel": "Übernachten Sie bei Menschen, die die Insel kennen.",
      "href": "/de/chios-zimmer/"
    },
    "relatedTitle": "Weitere Museen auf Chios entdecken",
    "relatedText": "Setzen Sie Ihre Kulturroute auf Chios mit Archäologie, byzantinischer Kunst, Seefahrtsgeschichte, Büchern, Mastix und Volkskunde fort."
  },
  {
    "slug": "museo-archeologico-chios",
    "seo": {
      "canonicalPath": "/it/musei-chios/museo-archeologico-chios/",
      "title": "Museo Archeologico di Chios | Guida culturale di Chios",
      "description": "Visita Museo Archeologico di Chios e scopri la storia antica, i reperti, la ceramica e il patrimonio dell’isola.",
      "ogImage": "https://chioshotel.gr/wp-content/uploads/2021/12/caption.webp"
    },
    "hero": {
      "kicker": "Città di Chios • Storia antica",
      "title": "Museo Archeologico di Chios",
      "description": "Visita Museo Archeologico di Chios e scopri la storia antica, i reperti, la ceramica e il patrimonio dell’isola.",
      "image": "https://chioshotel.gr/wp-content/uploads/2021/12/caption.webp",
      "tags": [
        "#archaeology",
        "#chios_town",
        "#ancient_chios",
        "#museum_guide"
      ]
    },
    "details": [
      {
        "icon": "📍",
        "title": "Posizione & accesso",
        "text": "Si trova in una zona facile da inserire in un itinerario culturale a Chios."
      },
      {
        "icon": "🏛️",
        "title": "Tema del museo",
        "text": "Il museo presenta la storia antica, i reperti, la ceramica e il patrimonio dell’isola."
      },
      {
        "icon": "💡",
        "title": "Consiglio locale",
        "text": "Combina la visita con una passeggiata, un caffè o un pasto nelle vicinanze per un’esperienza più completa."
      }
    ],
    "highlights": {
      "title": "Cosa vedere",
      "items": [
        "La storia antica, i reperti, la ceramica e il patrimonio dell’isola",
        "Collegamento con la storia e l’identità di Chios",
        "Una tappa culturale utile in ogni stagione"
      ]
    },
    "experience": {
      "title": "Perché visitarlo",
      "paragraphs": [
        "Visita Museo Archeologico di Chios e scopri la storia antica, i reperti, la ceramica e il patrimonio dell’isola.",
        "È una tappa utile per capire meglio l’isola oltre alle spiagge e ai villaggi."
      ]
    },
    "routeIdeas": {
      "title": "Come combinarlo",
      "items": [
        {
          "icon": "🏛️",
          "title": "Passeggiata culturale",
          "text": "Combina la visita con una passeggiata, un caffè o un pasto nelle vicinanze per un’esperienza più completa."
        },
        {
          "icon": "🚗",
          "title": "Combina luoghi vicini",
          "text": "Si trova in una zona facile da inserire in un itinerario culturale a Chios."
        },
        {
          "icon": "📷",
          "title": "Prenditi tempo",
          "text": "I musei rivelano di più quando li visiti senza fretta."
        }
      ]
    },
    "baseTip": {
      "icon": "🗺️",
      "title": "La tua base strategica",
      "text": "Da Voulamandis House a Kampos puoi organizzare facilmente musei, villaggi, spiagge e sapori di Chios in itinerari giornalieri equilibrati.",
      "linkLabel": "Soggiorna con chi conosce meglio l’isola.",
      "href": "/it/camere-a-chios/"
    },
    "relatedTitle": "Scopri altri musei di Chios",
    "relatedText": "Continua il tuo itinerario culturale a Chios con archeologia, arte bizantina, storia marittima, libri, mastice e folklore."
  },
  {
    "slug": "museo-arqueologico-chios",
    "seo": {
      "canonicalPath": "/es/museos-chios/museo-arqueologico-chios/",
      "title": "Museo Arqueológico de Chios | Guía cultural de Chios",
      "description": "Visita Museo Arqueológico de Chios y descubre la historia antigua, los hallazgos, la cerámica y el patrimonio de la isla.",
      "ogImage": "https://chioshotel.gr/wp-content/uploads/2021/12/caption.webp"
    },
    "hero": {
      "kicker": "Ciudad de Chios • Historia antigua",
      "title": "Museo Arqueológico de Chios",
      "description": "Visita Museo Arqueológico de Chios y descubre la historia antigua, los hallazgos, la cerámica y el patrimonio de la isla.",
      "image": "https://chioshotel.gr/wp-content/uploads/2021/12/caption.webp",
      "tags": [
        "#archaeology",
        "#chios_town",
        "#ancient_chios",
        "#museum_guide"
      ]
    },
    "details": [
      {
        "icon": "📍",
        "title": "Ubicación y acceso",
        "text": "Está en una zona fácil de incluir en una ruta cultural por Chios."
      },
      {
        "icon": "🏛️",
        "title": "Tema del museo",
        "text": "El museo presenta la historia antigua, los hallazgos, la cerámica y el patrimonio de la isla."
      },
      {
        "icon": "💡",
        "title": "Consejo local",
        "text": "Combina la visita con un paseo, un café o una comida cercana para una experiencia más completa."
      }
    ],
    "highlights": {
      "title": "Qué ver",
      "items": [
        "La historia antigua, los hallazgos, la cerámica y el patrimonio de la isla",
        "Conexión con la historia y la identidad de Chios",
        "Una parada cultural útil en cualquier época"
      ]
    },
    "experience": {
      "title": "Por qué visitarlo",
      "paragraphs": [
        "Visita Museo Arqueológico de Chios y descubre la historia antigua, los hallazgos, la cerámica y el patrimonio de la isla.",
        "Es una buena parada para comprender mejor la isla más allá de sus playas y pueblos."
      ]
    },
    "routeIdeas": {
      "title": "Cómo combinarlo",
      "items": [
        {
          "icon": "🏛️",
          "title": "Paseo cultural",
          "text": "Combina la visita con un paseo, un café o una comida cercana para una experiencia más completa."
        },
        {
          "icon": "🚗",
          "title": "Combina lugares cercanos",
          "text": "Está en una zona fácil de incluir en una ruta cultural por Chios."
        },
        {
          "icon": "📷",
          "title": "Tómate tu tiempo",
          "text": "Los museos se disfrutan más cuando se visitan sin prisa."
        }
      ]
    },
    "baseTip": {
      "icon": "🗺️",
      "title": "Tu base estratégica",
      "text": "Desde Voulamandis House en Kampos puedes organizar fácilmente museos, pueblos, playas y sabores de Chios en rutas diarias equilibradas.",
      "linkLabel": "Alójate con quienes mejor conocen la isla.",
      "href": "/es/habitaciones-en-chios/"
    },
    "relatedTitle": "Descubre más museos de Chios",
    "relatedText": "Continúa tu ruta cultural por Chios con arqueología, arte bizantino, historia marítima, libros, mastiha y folclore."
  },
  {
    "slug": "arkeoloji-muzesi-sakiz",
    "seo": {
      "canonicalPath": "/tr/sakiz-adasi-muzeleri/arkeoloji-muzesi-sakiz/",
      "title": "Sakız Arkeoloji Müzesi | Sakız Adası kültür rehberi",
      "description": "Ziyaret edin Sakız Arkeoloji Müzesi ve keşfedin adanın antik tarihini, buluntularını, seramiklerini ve kültürel mirasını.",
      "ogImage": "https://chioshotel.gr/wp-content/uploads/2021/12/caption.webp"
    },
    "hero": {
      "kicker": "Sakız şehir merkezi • Antik tarih",
      "title": "Sakız Arkeoloji Müzesi",
      "description": "Ziyaret edin Sakız Arkeoloji Müzesi ve keşfedin adanın antik tarihini, buluntularını, seramiklerini ve kültürel mirasını.",
      "image": "https://chioshotel.gr/wp-content/uploads/2021/12/caption.webp",
      "tags": [
        "#archaeology",
        "#chios_town",
        "#ancient_chios",
        "#museum_guide"
      ]
    },
    "details": [
      {
        "icon": "📍",
        "title": "Konum & ulaşım",
        "text": "Sakız Adası’ndaki kültür rotalarına kolayca eklenebilecek bir konumdadır."
      },
      {
        "icon": "🏛️",
        "title": "Müze teması",
        "text": "Müze adanın antik tarihini, buluntularını, seramiklerini ve kültürel mirasını."
      },
      {
        "icon": "💡",
        "title": "Yerel tavsiye",
        "text": "Ziyareti yakınlarda kısa bir yürüyüş, kahve veya yemek molasıyla birleştirerek daha tamamlayıcı bir deneyim yaşayabilirsiniz."
      }
    ],
    "highlights": {
      "title": "Neler görülebilir",
      "items": [
        "Adanın antik tarihini, buluntularını, seramiklerini ve kültürel mirasını",
        "Sakız’ın tarihi ve kimliğiyle bağlantı",
        "Her mevsim için anlamlı bir kültür durağı"
      ]
    },
    "experience": {
      "title": "Neden ziyaret etmeli",
      "paragraphs": [
        "Ziyaret edin Sakız Arkeoloji Müzesi ve keşfedin adanın antik tarihini, buluntularını, seramiklerini ve kültürel mirasını.",
        "Plajların ve köylerin ötesinde adayı daha iyi anlamak için iyi bir duraktır."
      ]
    },
    "routeIdeas": {
      "title": "Nasıl birleştirilir",
      "items": [
        {
          "icon": "🏛️",
          "title": "Kültür yürüyüşü",
          "text": "Ziyareti yakınlarda kısa bir yürüyüş, kahve veya yemek molasıyla birleştirerek daha tamamlayıcı bir deneyim yaşayabilirsiniz."
        },
        {
          "icon": "🚗",
          "title": "Yakın noktaları birleştirin",
          "text": "Sakız Adası’ndaki kültür rotalarına kolayca eklenebilecek bir konumdadır."
        },
        {
          "icon": "📷",
          "title": "Zaman ayırın",
          "text": "Müzeler acele etmeden gezildiğinde daha çok şey anlatır."
        }
      ]
    },
    "baseTip": {
      "icon": "🗺️",
      "title": "Stratejik üssünüz",
      "text": "Kampos’taki Voulamandis House’tan müzeleri, köyleri, plajları ve Sakız lezzetlerini dengeli günlük rotalar halinde kolayca planlayabilirsiniz.",
      "linkLabel": "Adayı en iyi bilenlerle konaklayın.",
      "href": "/tr/sakiz-adasi-odalari/"
    },
    "relatedTitle": "Daha fazla Sakız müzesi keşfedin",
    "relatedText": "Sakız Adası’ndaki kültür rotanıza arkeoloji, Bizans sanatı, denizcilik tarihi, kitaplar, mastik ve folklorla devam edin."
  },
  {
    "slug": "vyzantino-mouseio-xios",
    "seo": {
      "canonicalPath": "/el/mouseia-xios/vyzantino-mouseio-xios/",
      "title": "Βυζαντινό Μουσείο Χίου | Πολιτιστικός οδηγός Χίου",
      "description": "Επισκεφθείτε Βυζαντινό Μουσείο Χίου και ανακαλύψτε τη βυζαντινή και μεταβυζαντινή τέχνη, τις εικόνες και τη θρησκευτική κληρονομιά.",
      "ogImage": "https://chioshotel.gr/wp-content/uploads/2021/12/375px-Chios_Byzantine_Museum_Mecidiye_Mosque_Chios_Greece.webp"
    },
    "hero": {
      "kicker": "Πόλη Χίου • Βυζαντινή κληρονομιά",
      "title": "Βυζαντινό Μουσείο Χίου",
      "description": "Επισκεφθείτε Βυζαντινό Μουσείο Χίου και ανακαλύψτε τη βυζαντινή και μεταβυζαντινή τέχνη, τις εικόνες και τη θρησκευτική κληρονομιά.",
      "image": "https://chioshotel.gr/wp-content/uploads/2021/12/375px-Chios_Byzantine_Museum_Mecidiye_Mosque_Chios_Greece.webp",
      "tags": [
        "#byzantine_museum",
        "#icons",
        "#chios_town",
        "#culture"
      ]
    },
    "details": [
      {
        "icon": "📍",
        "title": "Τοποθεσία & πρόσβαση",
        "text": "Βρίσκεται σε εύκολα προσβάσιμο σημείο και συνδυάζεται όμορφα με μια πολιτιστική διαδρομή στη Χίο."
      },
      {
        "icon": "🏛️",
        "title": "Θεματική μουσείου",
        "text": "Το μουσείο παρουσιάζει τη βυζαντινή και μεταβυζαντινή τέχνη, τις εικόνες και τη θρησκευτική κληρονομιά."
      },
      {
        "icon": "💡",
        "title": "Τοπική συμβουλή",
        "text": "Συνδυάστε την επίσκεψη με κοντινή βόλτα, καφέ ή φαγητό για μια πιο ολοκληρωμένη εμπειρία."
      }
    ],
    "highlights": {
      "title": "Τι θα δείτε",
      "items": [
        "Τη βυζαντινή και μεταβυζαντινή τέχνη, τις εικόνες και τη θρησκευτική κληρονομιά",
        "Σύνδεση με την ιστορία και την ταυτότητα της Χίου",
        "Μια χρήσιμη πολιτιστική στάση για όλες τις εποχές"
      ]
    },
    "experience": {
      "title": "Γιατί αξίζει η επίσκεψη",
      "paragraphs": [
        "Επισκεφθείτε Βυζαντινό Μουσείο Χίου και ανακαλύψτε τη βυζαντινή και μεταβυζαντινή τέχνη, τις εικόνες και τη θρησκευτική κληρονομιά.",
        "Είναι μια καλή στάση για να καταλάβετε καλύτερα το νησί πέρα από τις παραλίες και τα χωριά."
      ]
    },
    "routeIdeas": {
      "title": "Πώς να το συνδυάσετε",
      "items": [
        {
          "icon": "🏛️",
          "title": "Πολιτιστική βόλτα",
          "text": "Συνδυάστε την επίσκεψη με κοντινή βόλτα, καφέ ή φαγητό για μια πιο ολοκληρωμένη εμπειρία."
        },
        {
          "icon": "🚗",
          "title": "Συνδυάστε κοντινά σημεία",
          "text": "Βρίσκεται σε εύκολα προσβάσιμο σημείο και συνδυάζεται όμορφα με μια πολιτιστική διαδρομή στη Χίο."
        },
        {
          "icon": "📷",
          "title": "Αφήστε χρόνο",
          "text": "Τα μουσεία αποκαλύπτουν περισσότερα όταν τα δείτε χωρίς βιασύνη."
        }
      ]
    },
    "baseTip": {
      "icon": "🗺️",
      "title": "Η στρατηγική σας βάση",
      "text": "Με βάση το Voulamandis House στον Κάμπο, μπορείτε να οργανώσετε εύκολα μουσεία, χωριά, παραλίες και γεύσεις της Χίου σε ισορροπημένες ημερήσιες διαδρομές.",
      "linkLabel": "Μείνετε με ανθρώπους που γνωρίζουν το νησί.",
      "href": "/el/domatia-xios/"
    },
    "relatedTitle": "Ανακαλύψτε περισσότερα μουσεία της Χίου",
    "relatedText": "Συνεχίστε την πολιτιστική διαδρομή σας στη Χίο με αρχαιολογία, βυζαντινή τέχνη, ναυτική ιστορία, βιβλία, μαστίχα και λαογραφία."
  },
  {
    "slug": "musee-byzantin-chios",
    "seo": {
      "canonicalPath": "/fr/musees-de-chios/musee-byzantin-chios/",
      "title": "Musée byzantin de Chios | Guide culturel de Chios",
      "description": "Visitez Musée byzantin de Chios et découvrez l’art byzantin et post-byzantin, les icônes et le patrimoine religieux.",
      "ogImage": "https://chioshotel.gr/wp-content/uploads/2021/12/375px-Chios_Byzantine_Museum_Mecidiye_Mosque_Chios_Greece.webp"
    },
    "hero": {
      "kicker": "Ville de Chios • Patrimoine byzantin",
      "title": "Musée byzantin de Chios",
      "description": "Visitez Musée byzantin de Chios et découvrez l’art byzantin et post-byzantin, les icônes et le patrimoine religieux.",
      "image": "https://chioshotel.gr/wp-content/uploads/2021/12/375px-Chios_Byzantine_Museum_Mecidiye_Mosque_Chios_Greece.webp",
      "tags": [
        "#byzantine_museum",
        "#icons",
        "#chios_town",
        "#culture"
      ]
    },
    "details": [
      {
        "icon": "📍",
        "title": "Emplacement & accès",
        "text": "Il se trouve dans un secteur facile à intégrer à un itinéraire culturel à Chios."
      },
      {
        "icon": "🏛️",
        "title": "Thème du musée",
        "text": "Le musée présente l’art byzantin et post-byzantin, les icônes et le patrimoine religieux."
      },
      {
        "icon": "💡",
        "title": "Conseil local",
        "text": "Combinez la visite avec une promenade, un café ou un repas à proximité pour une expérience plus complète."
      }
    ],
    "highlights": {
      "title": "À voir",
      "items": [
        "L’art byzantin et post-byzantin, les icônes et le patrimoine religieux",
        "Lien avec l’histoire et l’identité de Chios",
        "Une halte culturelle utile en toute saison"
      ]
    },
    "experience": {
      "title": "Pourquoi visiter",
      "paragraphs": [
        "Visitez Musée byzantin de Chios et découvrez l’art byzantin et post-byzantin, les icônes et le patrimoine religieux.",
        "C’est une bonne étape pour mieux comprendre l’île au-delà des plages et des villages."
      ]
    },
    "routeIdeas": {
      "title": "Comment l’intégrer à votre itinéraire",
      "items": [
        {
          "icon": "🏛️",
          "title": "Promenade culturelle",
          "text": "Combinez la visite avec une promenade, un café ou un repas à proximité pour une expérience plus complète."
        },
        {
          "icon": "🚗",
          "title": "Combinez les lieux proches",
          "text": "Il se trouve dans un secteur facile à intégrer à un itinéraire culturel à Chios."
        },
        {
          "icon": "📷",
          "title": "Prenez votre temps",
          "text": "Les musées se révèlent mieux quand on les visite sans hâte."
        }
      ]
    },
    "baseTip": {
      "icon": "🗺️",
      "title": "Votre base stratégique",
      "text": "Depuis Voulamandis House à Kampos, vous pouvez organiser facilement musées, villages, plages et gastronomie de Chios en belles journées équilibrées.",
      "linkLabel": "Séjournez avec ceux qui connaissent le mieux l’île.",
      "href": "/fr/chambres-a-chios/"
    },
    "relatedTitle": "Découvrez plus de musées de Chios",
    "relatedText": "Poursuivez votre itinéraire culturel à Chios avec archéologie, art byzantin, histoire maritime, livres, mastic et folklore."
  },
  {
    "slug": "byzantinisches-museum-chios",
    "seo": {
      "canonicalPath": "/de/museen-chios/byzantinisches-museum-chios/",
      "title": "Byzantinisches Museum Chios | Kulturführer für Chios",
      "description": "Besuchen Sie Byzantinisches Museum Chios und entdecken Sie byzantinische und postbyzantinische Kunst, Ikonen und religiöses Erbe.",
      "ogImage": "https://chioshotel.gr/wp-content/uploads/2021/12/375px-Chios_Byzantine_Museum_Mecidiye_Mosque_Chios_Greece.webp"
    },
    "hero": {
      "kicker": "Chios-Stadt • Byzantinisches Erbe",
      "title": "Byzantinisches Museum Chios",
      "description": "Besuchen Sie Byzantinisches Museum Chios und entdecken Sie byzantinische und postbyzantinische Kunst, Ikonen und religiöses Erbe.",
      "image": "https://chioshotel.gr/wp-content/uploads/2021/12/375px-Chios_Byzantine_Museum_Mecidiye_Mosque_Chios_Greece.webp",
      "tags": [
        "#byzantine_museum",
        "#icons",
        "#chios_town",
        "#culture"
      ]
    },
    "details": [
      {
        "icon": "📍",
        "title": "Lage & Zugang",
        "text": "Es liegt an einem gut erreichbaren Ort und lässt sich leicht in eine Kulturroute auf Chios einbauen."
      },
      {
        "icon": "🏛️",
        "title": "Museumsschwerpunkt",
        "text": "Das Museum zeigt byzantinische und postbyzantinische Kunst, Ikonen und religiöses Erbe."
      },
      {
        "icon": "💡",
        "title": "Lokaler Tipp",
        "text": "Kombinieren Sie den Besuch mit einem Spaziergang, Kaffee oder Essen in der Nähe für ein runderes Erlebnis."
      }
    ],
    "highlights": {
      "title": "Was Sie sehen können",
      "items": [
        "Byzantinische und postbyzantinische Kunst, Ikonen und religiöses Erbe",
        "Verbindung zur Geschichte und Identität von Chios",
        "Ein sinnvoller Kulturstopp zu jeder Jahreszeit"
      ]
    },
    "experience": {
      "title": "Warum sich der Besuch lohnt",
      "paragraphs": [
        "Besuchen Sie Byzantinisches Museum Chios und entdecken Sie byzantinische und postbyzantinische Kunst, Ikonen und religiöses Erbe.",
        "Es ist ein guter Stopp, um die Insel jenseits von Stränden und Dörfern besser zu verstehen."
      ]
    },
    "routeIdeas": {
      "title": "So kombinieren Sie den Besuch",
      "items": [
        {
          "icon": "🏛️",
          "title": "Kulturspaziergang",
          "text": "Kombinieren Sie den Besuch mit einem Spaziergang, Kaffee oder Essen in der Nähe für ein runderes Erlebnis."
        },
        {
          "icon": "🚗",
          "title": "Nahe Orte kombinieren",
          "text": "Es liegt an einem gut erreichbaren Ort und lässt sich leicht in eine Kulturroute auf Chios einbauen."
        },
        {
          "icon": "📷",
          "title": "Nehmen Sie sich Zeit",
          "text": "Museen zeigen mehr, wenn man sie ohne Eile besucht."
        }
      ]
    },
    "baseTip": {
      "icon": "🗺️",
      "title": "Ihre strategische Basis",
      "text": "Von Voulamandis House in Kampos aus können Sie Museen, Dörfer, Strände und kulinarische Stopps auf Chios entspannt in Tagesrouten verbinden.",
      "linkLabel": "Übernachten Sie bei Menschen, die die Insel kennen.",
      "href": "/de/chios-zimmer/"
    },
    "relatedTitle": "Weitere Museen auf Chios entdecken",
    "relatedText": "Setzen Sie Ihre Kulturroute auf Chios mit Archäologie, byzantinischer Kunst, Seefahrtsgeschichte, Büchern, Mastix und Volkskunde fort."
  },
  {
    "slug": "museo-bizantino-chios",
    "seo": {
      "canonicalPath": "/it/musei-chios/museo-bizantino-chios/",
      "title": "Museo Bizantino di Chios | Guida culturale di Chios",
      "description": "Visita Museo Bizantino di Chios e scopri l’arte bizantina e post-bizantina, le icone e il patrimonio religioso.",
      "ogImage": "https://chioshotel.gr/wp-content/uploads/2021/12/375px-Chios_Byzantine_Museum_Mecidiye_Mosque_Chios_Greece.webp"
    },
    "hero": {
      "kicker": "Città di Chios • Patrimonio bizantino",
      "title": "Museo Bizantino di Chios",
      "description": "Visita Museo Bizantino di Chios e scopri l’arte bizantina e post-bizantina, le icone e il patrimonio religioso.",
      "image": "https://chioshotel.gr/wp-content/uploads/2021/12/375px-Chios_Byzantine_Museum_Mecidiye_Mosque_Chios_Greece.webp",
      "tags": [
        "#byzantine_museum",
        "#icons",
        "#chios_town",
        "#culture"
      ]
    },
    "details": [
      {
        "icon": "📍",
        "title": "Posizione & accesso",
        "text": "Si trova in una zona facile da inserire in un itinerario culturale a Chios."
      },
      {
        "icon": "🏛️",
        "title": "Tema del museo",
        "text": "Il museo presenta l’arte bizantina e post-bizantina, le icone e il patrimonio religioso."
      },
      {
        "icon": "💡",
        "title": "Consiglio locale",
        "text": "Combina la visita con una passeggiata, un caffè o un pasto nelle vicinanze per un’esperienza più completa."
      }
    ],
    "highlights": {
      "title": "Cosa vedere",
      "items": [
        "L’arte bizantina e post-bizantina, le icone e il patrimonio religioso",
        "Collegamento con la storia e l’identità di Chios",
        "Una tappa culturale utile in ogni stagione"
      ]
    },
    "experience": {
      "title": "Perché visitarlo",
      "paragraphs": [
        "Visita Museo Bizantino di Chios e scopri l’arte bizantina e post-bizantina, le icone e il patrimonio religioso.",
        "È una tappa utile per capire meglio l’isola oltre alle spiagge e ai villaggi."
      ]
    },
    "routeIdeas": {
      "title": "Come combinarlo",
      "items": [
        {
          "icon": "🏛️",
          "title": "Passeggiata culturale",
          "text": "Combina la visita con una passeggiata, un caffè o un pasto nelle vicinanze per un’esperienza più completa."
        },
        {
          "icon": "🚗",
          "title": "Combina luoghi vicini",
          "text": "Si trova in una zona facile da inserire in un itinerario culturale a Chios."
        },
        {
          "icon": "📷",
          "title": "Prenditi tempo",
          "text": "I musei rivelano di più quando li visiti senza fretta."
        }
      ]
    },
    "baseTip": {
      "icon": "🗺️",
      "title": "La tua base strategica",
      "text": "Da Voulamandis House a Kampos puoi organizzare facilmente musei, villaggi, spiagge e sapori di Chios in itinerari giornalieri equilibrati.",
      "linkLabel": "Soggiorna con chi conosce meglio l’isola.",
      "href": "/it/camere-a-chios/"
    },
    "relatedTitle": "Scopri altri musei di Chios",
    "relatedText": "Continua il tuo itinerario culturale a Chios con archeologia, arte bizantina, storia marittima, libri, mastice e folklore."
  },
  {
    "slug": "museo-bizantino-chios",
    "seo": {
      "canonicalPath": "/es/museos-chios/museo-bizantino-chios/",
      "title": "Museo Bizantino de Chios | Guía cultural de Chios",
      "description": "Visita Museo Bizantino de Chios y descubre el arte bizantino y posbizantino, los iconos y el patrimonio religioso.",
      "ogImage": "https://chioshotel.gr/wp-content/uploads/2021/12/375px-Chios_Byzantine_Museum_Mecidiye_Mosque_Chios_Greece.webp"
    },
    "hero": {
      "kicker": "Ciudad de Chios • Patrimonio bizantino",
      "title": "Museo Bizantino de Chios",
      "description": "Visita Museo Bizantino de Chios y descubre el arte bizantino y posbizantino, los iconos y el patrimonio religioso.",
      "image": "https://chioshotel.gr/wp-content/uploads/2021/12/375px-Chios_Byzantine_Museum_Mecidiye_Mosque_Chios_Greece.webp",
      "tags": [
        "#byzantine_museum",
        "#icons",
        "#chios_town",
        "#culture"
      ]
    },
    "details": [
      {
        "icon": "📍",
        "title": "Ubicación y acceso",
        "text": "Está en una zona fácil de incluir en una ruta cultural por Chios."
      },
      {
        "icon": "🏛️",
        "title": "Tema del museo",
        "text": "El museo presenta el arte bizantino y posbizantino, los iconos y el patrimonio religioso."
      },
      {
        "icon": "💡",
        "title": "Consejo local",
        "text": "Combina la visita con un paseo, un café o una comida cercana para una experiencia más completa."
      }
    ],
    "highlights": {
      "title": "Qué ver",
      "items": [
        "El arte bizantino y posbizantino, los iconos y el patrimonio religioso",
        "Conexión con la historia y la identidad de Chios",
        "Una parada cultural útil en cualquier época"
      ]
    },
    "experience": {
      "title": "Por qué visitarlo",
      "paragraphs": [
        "Visita Museo Bizantino de Chios y descubre el arte bizantino y posbizantino, los iconos y el patrimonio religioso.",
        "Es una buena parada para comprender mejor la isla más allá de sus playas y pueblos."
      ]
    },
    "routeIdeas": {
      "title": "Cómo combinarlo",
      "items": [
        {
          "icon": "🏛️",
          "title": "Paseo cultural",
          "text": "Combina la visita con un paseo, un café o una comida cercana para una experiencia más completa."
        },
        {
          "icon": "🚗",
          "title": "Combina lugares cercanos",
          "text": "Está en una zona fácil de incluir en una ruta cultural por Chios."
        },
        {
          "icon": "📷",
          "title": "Tómate tu tiempo",
          "text": "Los museos se disfrutan más cuando se visitan sin prisa."
        }
      ]
    },
    "baseTip": {
      "icon": "🗺️",
      "title": "Tu base estratégica",
      "text": "Desde Voulamandis House en Kampos puedes organizar fácilmente museos, pueblos, playas y sabores de Chios en rutas diarias equilibradas.",
      "linkLabel": "Alójate con quienes mejor conocen la isla.",
      "href": "/es/habitaciones-en-chios/"
    },
    "relatedTitle": "Descubre más museos de Chios",
    "relatedText": "Continúa tu ruta cultural por Chios con arqueología, arte bizantino, historia marítima, libros, mastiha y folclore."
  },
  {
    "slug": "bizans-muzesi-sakiz",
    "seo": {
      "canonicalPath": "/tr/sakiz-adasi-muzeleri/bizans-muzesi-sakiz/",
      "title": "Sakız Bizans Müzesi | Sakız Adası kültür rehberi",
      "description": "Ziyaret edin Sakız Bizans Müzesi ve keşfedin Bizans ve Bizans sonrası sanatı, ikonaları ve dini mirası.",
      "ogImage": "https://chioshotel.gr/wp-content/uploads/2021/12/375px-Chios_Byzantine_Museum_Mecidiye_Mosque_Chios_Greece.webp"
    },
    "hero": {
      "kicker": "Sakız şehir merkezi • Bizans mirası",
      "title": "Sakız Bizans Müzesi",
      "description": "Ziyaret edin Sakız Bizans Müzesi ve keşfedin Bizans ve Bizans sonrası sanatı, ikonaları ve dini mirası.",
      "image": "https://chioshotel.gr/wp-content/uploads/2021/12/375px-Chios_Byzantine_Museum_Mecidiye_Mosque_Chios_Greece.webp",
      "tags": [
        "#byzantine_museum",
        "#icons",
        "#chios_town",
        "#culture"
      ]
    },
    "details": [
      {
        "icon": "📍",
        "title": "Konum & ulaşım",
        "text": "Sakız Adası’ndaki kültür rotalarına kolayca eklenebilecek bir konumdadır."
      },
      {
        "icon": "🏛️",
        "title": "Müze teması",
        "text": "Müze Bizans ve Bizans sonrası sanatı, ikonaları ve dini mirası."
      },
      {
        "icon": "💡",
        "title": "Yerel tavsiye",
        "text": "Ziyareti yakınlarda kısa bir yürüyüş, kahve veya yemek molasıyla birleştirerek daha tamamlayıcı bir deneyim yaşayabilirsiniz."
      }
    ],
    "highlights": {
      "title": "Neler görülebilir",
      "items": [
        "Bizans ve Bizans sonrası sanatı, ikonaları ve dini mirası",
        "Sakız’ın tarihi ve kimliğiyle bağlantı",
        "Her mevsim için anlamlı bir kültür durağı"
      ]
    },
    "experience": {
      "title": "Neden ziyaret etmeli",
      "paragraphs": [
        "Ziyaret edin Sakız Bizans Müzesi ve keşfedin Bizans ve Bizans sonrası sanatı, ikonaları ve dini mirası.",
        "Plajların ve köylerin ötesinde adayı daha iyi anlamak için iyi bir duraktır."
      ]
    },
    "routeIdeas": {
      "title": "Nasıl birleştirilir",
      "items": [
        {
          "icon": "🏛️",
          "title": "Kültür yürüyüşü",
          "text": "Ziyareti yakınlarda kısa bir yürüyüş, kahve veya yemek molasıyla birleştirerek daha tamamlayıcı bir deneyim yaşayabilirsiniz."
        },
        {
          "icon": "🚗",
          "title": "Yakın noktaları birleştirin",
          "text": "Sakız Adası’ndaki kültür rotalarına kolayca eklenebilecek bir konumdadır."
        },
        {
          "icon": "📷",
          "title": "Zaman ayırın",
          "text": "Müzeler acele etmeden gezildiğinde daha çok şey anlatır."
        }
      ]
    },
    "baseTip": {
      "icon": "🗺️",
      "title": "Stratejik üssünüz",
      "text": "Kampos’taki Voulamandis House’tan müzeleri, köyleri, plajları ve Sakız lezzetlerini dengeli günlük rotalar halinde kolayca planlayabilirsiniz.",
      "linkLabel": "Adayı en iyi bilenlerle konaklayın.",
      "href": "/tr/sakiz-adasi-odalari/"
    },
    "relatedTitle": "Daha fazla Sakız müzesi keşfedin",
    "relatedText": "Sakız Adası’ndaki kültür rotanıza arkeoloji, Bizans sanatı, denizcilik tarihi, kitaplar, mastik ve folklorla devam edin."
  },
  {
    "slug": "vivliothiki-korai-xios",
    "seo": {
      "canonicalPath": "/el/mouseia-xios/vivliothiki-korai-xios/",
      "title": "Βιβλιοθήκη Κοραή | Πολιτιστικός οδηγός Χίου",
      "description": "Επισκεφθείτε Βιβλιοθήκη Κοραή και ανακαλύψτε σπάνια βιβλία, χειρόγραφα, αρχεία και την ελληνική πνευματική παράδοση.",
      "ogImage": "https://chioshotel.gr/wp-content/uploads/2021/12/vivlitothiki-korai-1.webp"
    },
    "hero": {
      "kicker": "Πόλη Χίου • Βιβλία & πολιτισμός",
      "title": "Βιβλιοθήκη Κοραή",
      "description": "Επισκεφθείτε Βιβλιοθήκη Κοραή και ανακαλύψτε σπάνια βιβλία, χειρόγραφα, αρχεία και την ελληνική πνευματική παράδοση.",
      "image": "https://chioshotel.gr/wp-content/uploads/2021/12/vivlitothiki-korai-1.webp",
      "tags": [
        "#koraes_library",
        "#rare_books",
        "#manuscripts",
        "#chios_town"
      ]
    },
    "details": [
      {
        "icon": "📍",
        "title": "Τοποθεσία & πρόσβαση",
        "text": "Βρίσκεται σε εύκολα προσβάσιμο σημείο και συνδυάζεται όμορφα με μια πολιτιστική διαδρομή στη Χίο."
      },
      {
        "icon": "🏛️",
        "title": "Θεματική μουσείου",
        "text": "Το μουσείο παρουσιάζει σπάνια βιβλία, χειρόγραφα, αρχεία και την ελληνική πνευματική παράδοση."
      },
      {
        "icon": "💡",
        "title": "Τοπική συμβουλή",
        "text": "Συνδυάστε την επίσκεψη με κοντινή βόλτα, καφέ ή φαγητό για μια πιο ολοκληρωμένη εμπειρία."
      }
    ],
    "highlights": {
      "title": "Τι θα δείτε",
      "items": [
        "Σπάνια βιβλία, χειρόγραφα, αρχεία και την ελληνική πνευματική παράδοση",
        "Σύνδεση με την ιστορία και την ταυτότητα της Χίου",
        "Μια χρήσιμη πολιτιστική στάση για όλες τις εποχές"
      ]
    },
    "experience": {
      "title": "Γιατί αξίζει η επίσκεψη",
      "paragraphs": [
        "Επισκεφθείτε Βιβλιοθήκη Κοραή και ανακαλύψτε σπάνια βιβλία, χειρόγραφα, αρχεία και την ελληνική πνευματική παράδοση.",
        "Είναι μια καλή στάση για να καταλάβετε καλύτερα το νησί πέρα από τις παραλίες και τα χωριά."
      ]
    },
    "routeIdeas": {
      "title": "Πώς να το συνδυάσετε",
      "items": [
        {
          "icon": "🏛️",
          "title": "Πολιτιστική βόλτα",
          "text": "Συνδυάστε την επίσκεψη με κοντινή βόλτα, καφέ ή φαγητό για μια πιο ολοκληρωμένη εμπειρία."
        },
        {
          "icon": "🚗",
          "title": "Συνδυάστε κοντινά σημεία",
          "text": "Βρίσκεται σε εύκολα προσβάσιμο σημείο και συνδυάζεται όμορφα με μια πολιτιστική διαδρομή στη Χίο."
        },
        {
          "icon": "📷",
          "title": "Αφήστε χρόνο",
          "text": "Τα μουσεία αποκαλύπτουν περισσότερα όταν τα δείτε χωρίς βιασύνη."
        }
      ]
    },
    "baseTip": {
      "icon": "🗺️",
      "title": "Η στρατηγική σας βάση",
      "text": "Με βάση το Voulamandis House στον Κάμπο, μπορείτε να οργανώσετε εύκολα μουσεία, χωριά, παραλίες και γεύσεις της Χίου σε ισορροπημένες ημερήσιες διαδρομές.",
      "linkLabel": "Μείνετε με ανθρώπους που γνωρίζουν το νησί.",
      "href": "/el/domatia-xios/"
    },
    "relatedTitle": "Ανακαλύψτε περισσότερα μουσεία της Χίου",
    "relatedText": "Συνεχίστε την πολιτιστική διαδρομή σας στη Χίο με αρχαιολογία, βυζαντινή τέχνη, ναυτική ιστορία, βιβλία, μαστίχα και λαογραφία."
  },
  {
    "slug": "bibliotheque-korais-chios",
    "seo": {
      "canonicalPath": "/fr/musees-de-chios/bibliotheque-korais-chios/",
      "title": "Bibliothèque Korais | Guide culturel de Chios",
      "description": "Visitez Bibliothèque Korais et découvrez les livres rares, manuscrits, archives et la tradition intellectuelle grecque.",
      "ogImage": "https://chioshotel.gr/wp-content/uploads/2021/12/vivlitothiki-korai-1.webp"
    },
    "hero": {
      "kicker": "Ville de Chios • Livres & culture",
      "title": "Bibliothèque Korais",
      "description": "Visitez Bibliothèque Korais et découvrez les livres rares, manuscrits, archives et la tradition intellectuelle grecque.",
      "image": "https://chioshotel.gr/wp-content/uploads/2021/12/vivlitothiki-korai-1.webp",
      "tags": [
        "#koraes_library",
        "#rare_books",
        "#manuscripts",
        "#chios_town"
      ]
    },
    "details": [
      {
        "icon": "📍",
        "title": "Emplacement & accès",
        "text": "Il se trouve dans un secteur facile à intégrer à un itinéraire culturel à Chios."
      },
      {
        "icon": "🏛️",
        "title": "Thème du musée",
        "text": "Le musée présente les livres rares, manuscrits, archives et la tradition intellectuelle grecque."
      },
      {
        "icon": "💡",
        "title": "Conseil local",
        "text": "Combinez la visite avec une promenade, un café ou un repas à proximité pour une expérience plus complète."
      }
    ],
    "highlights": {
      "title": "À voir",
      "items": [
        "Les livres rares, manuscrits, archives et la tradition intellectuelle grecque",
        "Lien avec l’histoire et l’identité de Chios",
        "Une halte culturelle utile en toute saison"
      ]
    },
    "experience": {
      "title": "Pourquoi visiter",
      "paragraphs": [
        "Visitez Bibliothèque Korais et découvrez les livres rares, manuscrits, archives et la tradition intellectuelle grecque.",
        "C’est une bonne étape pour mieux comprendre l’île au-delà des plages et des villages."
      ]
    },
    "routeIdeas": {
      "title": "Comment l’intégrer à votre itinéraire",
      "items": [
        {
          "icon": "🏛️",
          "title": "Promenade culturelle",
          "text": "Combinez la visite avec une promenade, un café ou un repas à proximité pour une expérience plus complète."
        },
        {
          "icon": "🚗",
          "title": "Combinez les lieux proches",
          "text": "Il se trouve dans un secteur facile à intégrer à un itinéraire culturel à Chios."
        },
        {
          "icon": "📷",
          "title": "Prenez votre temps",
          "text": "Les musées se révèlent mieux quand on les visite sans hâte."
        }
      ]
    },
    "baseTip": {
      "icon": "🗺️",
      "title": "Votre base stratégique",
      "text": "Depuis Voulamandis House à Kampos, vous pouvez organiser facilement musées, villages, plages et gastronomie de Chios en belles journées équilibrées.",
      "linkLabel": "Séjournez avec ceux qui connaissent le mieux l’île.",
      "href": "/fr/chambres-a-chios/"
    },
    "relatedTitle": "Découvrez plus de musées de Chios",
    "relatedText": "Poursuivez votre itinéraire culturel à Chios avec archéologie, art byzantin, histoire maritime, livres, mastic et folklore."
  },
  {
    "slug": "korais-bibliothek-chios",
    "seo": {
      "canonicalPath": "/de/museen-chios/korais-bibliothek-chios/",
      "title": "Korais-Bibliothek | Kulturführer für Chios",
      "description": "Besuchen Sie Korais-Bibliothek und entdecken Sie seltene Bücher, Handschriften, Archive und griechische Geistesgeschichte.",
      "ogImage": "https://chioshotel.gr/wp-content/uploads/2021/12/vivlitothiki-korai-1.webp"
    },
    "hero": {
      "kicker": "Chios-Stadt • Bücher & Kultur",
      "title": "Korais-Bibliothek",
      "description": "Besuchen Sie Korais-Bibliothek und entdecken Sie seltene Bücher, Handschriften, Archive und griechische Geistesgeschichte.",
      "image": "https://chioshotel.gr/wp-content/uploads/2021/12/vivlitothiki-korai-1.webp",
      "tags": [
        "#koraes_library",
        "#rare_books",
        "#manuscripts",
        "#chios_town"
      ]
    },
    "details": [
      {
        "icon": "📍",
        "title": "Lage & Zugang",
        "text": "Es liegt an einem gut erreichbaren Ort und lässt sich leicht in eine Kulturroute auf Chios einbauen."
      },
      {
        "icon": "🏛️",
        "title": "Museumsschwerpunkt",
        "text": "Das Museum zeigt seltene Bücher, Handschriften, Archive und griechische Geistesgeschichte."
      },
      {
        "icon": "💡",
        "title": "Lokaler Tipp",
        "text": "Kombinieren Sie den Besuch mit einem Spaziergang, Kaffee oder Essen in der Nähe für ein runderes Erlebnis."
      }
    ],
    "highlights": {
      "title": "Was Sie sehen können",
      "items": [
        "Seltene Bücher, Handschriften, Archive und griechische Geistesgeschichte",
        "Verbindung zur Geschichte und Identität von Chios",
        "Ein sinnvoller Kulturstopp zu jeder Jahreszeit"
      ]
    },
    "experience": {
      "title": "Warum sich der Besuch lohnt",
      "paragraphs": [
        "Besuchen Sie Korais-Bibliothek und entdecken Sie seltene Bücher, Handschriften, Archive und griechische Geistesgeschichte.",
        "Es ist ein guter Stopp, um die Insel jenseits von Stränden und Dörfern besser zu verstehen."
      ]
    },
    "routeIdeas": {
      "title": "So kombinieren Sie den Besuch",
      "items": [
        {
          "icon": "🏛️",
          "title": "Kulturspaziergang",
          "text": "Kombinieren Sie den Besuch mit einem Spaziergang, Kaffee oder Essen in der Nähe für ein runderes Erlebnis."
        },
        {
          "icon": "🚗",
          "title": "Nahe Orte kombinieren",
          "text": "Es liegt an einem gut erreichbaren Ort und lässt sich leicht in eine Kulturroute auf Chios einbauen."
        },
        {
          "icon": "📷",
          "title": "Nehmen Sie sich Zeit",
          "text": "Museen zeigen mehr, wenn man sie ohne Eile besucht."
        }
      ]
    },
    "baseTip": {
      "icon": "🗺️",
      "title": "Ihre strategische Basis",
      "text": "Von Voulamandis House in Kampos aus können Sie Museen, Dörfer, Strände und kulinarische Stopps auf Chios entspannt in Tagesrouten verbinden.",
      "linkLabel": "Übernachten Sie bei Menschen, die die Insel kennen.",
      "href": "/de/chios-zimmer/"
    },
    "relatedTitle": "Weitere Museen auf Chios entdecken",
    "relatedText": "Setzen Sie Ihre Kulturroute auf Chios mit Archäologie, byzantinischer Kunst, Seefahrtsgeschichte, Büchern, Mastix und Volkskunde fort."
  },
  {
    "slug": "biblioteca-korais-chios",
    "seo": {
      "canonicalPath": "/it/musei-chios/biblioteca-korais-chios/",
      "title": "Biblioteca Korais | Guida culturale di Chios",
      "description": "Visita Biblioteca Korais e scopri libri rari, manoscritti, archivi e cultura greca.",
      "ogImage": "https://chioshotel.gr/wp-content/uploads/2021/12/vivlitothiki-korai-1.webp"
    },
    "hero": {
      "kicker": "Città di Chios • Libri e cultura",
      "title": "Biblioteca Korais",
      "description": "Visita Biblioteca Korais e scopri libri rari, manoscritti, archivi e cultura greca.",
      "image": "https://chioshotel.gr/wp-content/uploads/2021/12/vivlitothiki-korai-1.webp",
      "tags": [
        "#koraes_library",
        "#rare_books",
        "#manuscripts",
        "#chios_town"
      ]
    },
    "details": [
      {
        "icon": "📍",
        "title": "Posizione & accesso",
        "text": "Si trova in una zona facile da inserire in un itinerario culturale a Chios."
      },
      {
        "icon": "🏛️",
        "title": "Tema del museo",
        "text": "Il museo presenta libri rari, manoscritti, archivi e cultura greca."
      },
      {
        "icon": "💡",
        "title": "Consiglio locale",
        "text": "Combina la visita con una passeggiata, un caffè o un pasto nelle vicinanze per un’esperienza più completa."
      }
    ],
    "highlights": {
      "title": "Cosa vedere",
      "items": [
        "Libri rari, manoscritti, archivi e cultura greca",
        "Collegamento con la storia e l’identità di Chios",
        "Una tappa culturale utile in ogni stagione"
      ]
    },
    "experience": {
      "title": "Perché visitarlo",
      "paragraphs": [
        "Visita Biblioteca Korais e scopri libri rari, manoscritti, archivi e cultura greca.",
        "È una tappa utile per capire meglio l’isola oltre alle spiagge e ai villaggi."
      ]
    },
    "routeIdeas": {
      "title": "Come combinarlo",
      "items": [
        {
          "icon": "🏛️",
          "title": "Passeggiata culturale",
          "text": "Combina la visita con una passeggiata, un caffè o un pasto nelle vicinanze per un’esperienza più completa."
        },
        {
          "icon": "🚗",
          "title": "Combina luoghi vicini",
          "text": "Si trova in una zona facile da inserire in un itinerario culturale a Chios."
        },
        {
          "icon": "📷",
          "title": "Prenditi tempo",
          "text": "I musei rivelano di più quando li visiti senza fretta."
        }
      ]
    },
    "baseTip": {
      "icon": "🗺️",
      "title": "La tua base strategica",
      "text": "Da Voulamandis House a Kampos puoi organizzare facilmente musei, villaggi, spiagge e sapori di Chios in itinerari giornalieri equilibrati.",
      "linkLabel": "Soggiorna con chi conosce meglio l’isola.",
      "href": "/it/camere-a-chios/"
    },
    "relatedTitle": "Scopri altri musei di Chios",
    "relatedText": "Continua il tuo itinerario culturale a Chios con archeologia, arte bizantina, storia marittima, libri, mastice e folklore."
  },
  {
    "slug": "biblioteca-korais-chios",
    "seo": {
      "canonicalPath": "/es/museos-chios/biblioteca-korais-chios/",
      "title": "Biblioteca Korais | Guía cultural de Chios",
      "description": "Visita Biblioteca Korais y descubre libros raros, manuscritos, archivos y cultura griega.",
      "ogImage": "https://chioshotel.gr/wp-content/uploads/2021/12/vivlitothiki-korai-1.webp"
    },
    "hero": {
      "kicker": "Ciudad de Chios • Libros y cultura",
      "title": "Biblioteca Korais",
      "description": "Visita Biblioteca Korais y descubre libros raros, manuscritos, archivos y cultura griega.",
      "image": "https://chioshotel.gr/wp-content/uploads/2021/12/vivlitothiki-korai-1.webp",
      "tags": [
        "#koraes_library",
        "#rare_books",
        "#manuscripts",
        "#chios_town"
      ]
    },
    "details": [
      {
        "icon": "📍",
        "title": "Ubicación y acceso",
        "text": "Está en una zona fácil de incluir en una ruta cultural por Chios."
      },
      {
        "icon": "🏛️",
        "title": "Tema del museo",
        "text": "El museo presenta libros raros, manuscritos, archivos y cultura griega."
      },
      {
        "icon": "💡",
        "title": "Consejo local",
        "text": "Combina la visita con un paseo, un café o una comida cercana para una experiencia más completa."
      }
    ],
    "highlights": {
      "title": "Qué ver",
      "items": [
        "Libros raros, manuscritos, archivos y cultura griega",
        "Conexión con la historia y la identidad de Chios",
        "Una parada cultural útil en cualquier época"
      ]
    },
    "experience": {
      "title": "Por qué visitarlo",
      "paragraphs": [
        "Visita Biblioteca Korais y descubre libros raros, manuscritos, archivos y cultura griega.",
        "Es una buena parada para comprender mejor la isla más allá de sus playas y pueblos."
      ]
    },
    "routeIdeas": {
      "title": "Cómo combinarlo",
      "items": [
        {
          "icon": "🏛️",
          "title": "Paseo cultural",
          "text": "Combina la visita con un paseo, un café o una comida cercana para una experiencia más completa."
        },
        {
          "icon": "🚗",
          "title": "Combina lugares cercanos",
          "text": "Está en una zona fácil de incluir en una ruta cultural por Chios."
        },
        {
          "icon": "📷",
          "title": "Tómate tu tiempo",
          "text": "Los museos se disfrutan más cuando se visitan sin prisa."
        }
      ]
    },
    "baseTip": {
      "icon": "🗺️",
      "title": "Tu base estratégica",
      "text": "Desde Voulamandis House en Kampos puedes organizar fácilmente museos, pueblos, playas y sabores de Chios en rutas diarias equilibradas.",
      "linkLabel": "Alójate con quienes mejor conocen la isla.",
      "href": "/es/habitaciones-en-chios/"
    },
    "relatedTitle": "Descubre más museos de Chios",
    "relatedText": "Continúa tu ruta cultural por Chios con arqueología, arte bizantino, historia marítima, libros, mastiha y folclore."
  },
  {
    "slug": "korais-kutuphanesi-sakiz",
    "seo": {
      "canonicalPath": "/tr/sakiz-adasi-muzeleri/korais-kutuphanesi-sakiz/",
      "title": "Korais Kütüphanesi | Sakız Adası kültür rehberi",
      "description": "Ziyaret edin Korais Kütüphanesi ve keşfedin nadir kitapları, el yazmalarını, arşivleri ve Yunan kültürünü.",
      "ogImage": "https://chioshotel.gr/wp-content/uploads/2021/12/vivlitothiki-korai-1.webp"
    },
    "hero": {
      "kicker": "Sakız şehir merkezi • Kitaplar ve kültür",
      "title": "Korais Kütüphanesi",
      "description": "Ziyaret edin Korais Kütüphanesi ve keşfedin nadir kitapları, el yazmalarını, arşivleri ve Yunan kültürünü.",
      "image": "https://chioshotel.gr/wp-content/uploads/2021/12/vivlitothiki-korai-1.webp",
      "tags": [
        "#koraes_library",
        "#rare_books",
        "#manuscripts",
        "#chios_town"
      ]
    },
    "details": [
      {
        "icon": "📍",
        "title": "Konum & ulaşım",
        "text": "Sakız Adası’ndaki kültür rotalarına kolayca eklenebilecek bir konumdadır."
      },
      {
        "icon": "🏛️",
        "title": "Müze teması",
        "text": "Müze nadir kitapları, el yazmalarını, arşivleri ve Yunan kültürünü."
      },
      {
        "icon": "💡",
        "title": "Yerel tavsiye",
        "text": "Ziyareti yakınlarda kısa bir yürüyüş, kahve veya yemek molasıyla birleştirerek daha tamamlayıcı bir deneyim yaşayabilirsiniz."
      }
    ],
    "highlights": {
      "title": "Neler görülebilir",
      "items": [
        "Nadir kitapları, el yazmalarını, arşivleri ve Yunan kültürünü",
        "Sakız’ın tarihi ve kimliğiyle bağlantı",
        "Her mevsim için anlamlı bir kültür durağı"
      ]
    },
    "experience": {
      "title": "Neden ziyaret etmeli",
      "paragraphs": [
        "Ziyaret edin Korais Kütüphanesi ve keşfedin nadir kitapları, el yazmalarını, arşivleri ve Yunan kültürünü.",
        "Plajların ve köylerin ötesinde adayı daha iyi anlamak için iyi bir duraktır."
      ]
    },
    "routeIdeas": {
      "title": "Nasıl birleştirilir",
      "items": [
        {
          "icon": "🏛️",
          "title": "Kültür yürüyüşü",
          "text": "Ziyareti yakınlarda kısa bir yürüyüş, kahve veya yemek molasıyla birleştirerek daha tamamlayıcı bir deneyim yaşayabilirsiniz."
        },
        {
          "icon": "🚗",
          "title": "Yakın noktaları birleştirin",
          "text": "Sakız Adası’ndaki kültür rotalarına kolayca eklenebilecek bir konumdadır."
        },
        {
          "icon": "📷",
          "title": "Zaman ayırın",
          "text": "Müzeler acele etmeden gezildiğinde daha çok şey anlatır."
        }
      ]
    },
    "baseTip": {
      "icon": "🗺️",
      "title": "Stratejik üssünüz",
      "text": "Kampos’taki Voulamandis House’tan müzeleri, köyleri, plajları ve Sakız lezzetlerini dengeli günlük rotalar halinde kolayca planlayabilirsiniz.",
      "linkLabel": "Adayı en iyi bilenlerle konaklayın.",
      "href": "/tr/sakiz-adasi-odalari/"
    },
    "relatedTitle": "Daha fazla Sakız müzesi keşfedin",
    "relatedText": "Sakız Adası’ndaki kültür rotanıza arkeoloji, Bizans sanatı, denizcilik tarihi, kitaplar, mastik ve folklorla devam edin."
  },
  {
    "slug": "naftiko-mouseio-xios",
    "seo": {
      "canonicalPath": "/el/mouseia-xios/naftiko-mouseio-xios/",
      "title": "Ναυτικό Μουσείο Χίου | Πολιτιστικός οδηγός Χίου",
      "description": "Επισκεφθείτε Ναυτικό Μουσείο Χίου και ανακαλύψτε τη ναυτική ταυτότητα της Χίου, τα πλοία, τη ναυσιπλοΐα και το εμπόριο.",
      "ogImage": "https://chioshotel.gr/wp-content/uploads/2021/12/IMG_1203-Medium-min-768x487.webp"
    },
    "hero": {
      "kicker": "Πόλη Χίου • Ναυτική κληρονομιά",
      "title": "Ναυτικό Μουσείο Χίου",
      "description": "Επισκεφθείτε Ναυτικό Μουσείο Χίου και ανακαλύψτε τη ναυτική ταυτότητα της Χίου, τα πλοία, τη ναυσιπλοΐα και το εμπόριο.",
      "image": "https://chioshotel.gr/wp-content/uploads/2021/12/IMG_1203-Medium-min-768x487.webp",
      "tags": [
        "#maritime_museum",
        "#seafaring",
        "#ship_models",
        "#chios_town"
      ]
    },
    "details": [
      {
        "icon": "📍",
        "title": "Τοποθεσία & πρόσβαση",
        "text": "Βρίσκεται σε εύκολα προσβάσιμο σημείο και συνδυάζεται όμορφα με μια πολιτιστική διαδρομή στη Χίο."
      },
      {
        "icon": "🏛️",
        "title": "Θεματική μουσείου",
        "text": "Το μουσείο παρουσιάζει τη ναυτική ταυτότητα της Χίου, τα πλοία, τη ναυσιπλοΐα και το εμπόριο."
      },
      {
        "icon": "💡",
        "title": "Τοπική συμβουλή",
        "text": "Συνδυάστε την επίσκεψη με κοντινή βόλτα, καφέ ή φαγητό για μια πιο ολοκληρωμένη εμπειρία."
      }
    ],
    "highlights": {
      "title": "Τι θα δείτε",
      "items": [
        "Τη ναυτική ταυτότητα της Χίου, τα πλοία, τη ναυσιπλοΐα και το εμπόριο",
        "Σύνδεση με την ιστορία και την ταυτότητα της Χίου",
        "Μια χρήσιμη πολιτιστική στάση για όλες τις εποχές"
      ]
    },
    "experience": {
      "title": "Γιατί αξίζει η επίσκεψη",
      "paragraphs": [
        "Επισκεφθείτε Ναυτικό Μουσείο Χίου και ανακαλύψτε τη ναυτική ταυτότητα της Χίου, τα πλοία, τη ναυσιπλοΐα και το εμπόριο.",
        "Είναι μια καλή στάση για να καταλάβετε καλύτερα το νησί πέρα από τις παραλίες και τα χωριά."
      ]
    },
    "routeIdeas": {
      "title": "Πώς να το συνδυάσετε",
      "items": [
        {
          "icon": "🏛️",
          "title": "Πολιτιστική βόλτα",
          "text": "Συνδυάστε την επίσκεψη με κοντινή βόλτα, καφέ ή φαγητό για μια πιο ολοκληρωμένη εμπειρία."
        },
        {
          "icon": "🚗",
          "title": "Συνδυάστε κοντινά σημεία",
          "text": "Βρίσκεται σε εύκολα προσβάσιμο σημείο και συνδυάζεται όμορφα με μια πολιτιστική διαδρομή στη Χίο."
        },
        {
          "icon": "📷",
          "title": "Αφήστε χρόνο",
          "text": "Τα μουσεία αποκαλύπτουν περισσότερα όταν τα δείτε χωρίς βιασύνη."
        }
      ]
    },
    "baseTip": {
      "icon": "🗺️",
      "title": "Η στρατηγική σας βάση",
      "text": "Με βάση το Voulamandis House στον Κάμπο, μπορείτε να οργανώσετε εύκολα μουσεία, χωριά, παραλίες και γεύσεις της Χίου σε ισορροπημένες ημερήσιες διαδρομές.",
      "linkLabel": "Μείνετε με ανθρώπους που γνωρίζουν το νησί.",
      "href": "/el/domatia-xios/"
    },
    "relatedTitle": "Ανακαλύψτε περισσότερα μουσεία της Χίου",
    "relatedText": "Συνεχίστε την πολιτιστική διαδρομή σας στη Χίο με αρχαιολογία, βυζαντινή τέχνη, ναυτική ιστορία, βιβλία, μαστίχα και λαογραφία."
  },
  {
    "slug": "musee-maritime-chios",
    "seo": {
      "canonicalPath": "/fr/musees-de-chios/musee-maritime-chios/",
      "title": "Musée maritime de Chios | Guide culturel de Chios",
      "description": "Visitez Musée maritime de Chios et découvrez l’identité maritime de Chios, les navires, la navigation et le commerce.",
      "ogImage": "https://chioshotel.gr/wp-content/uploads/2021/12/IMG_1203-Medium-min-768x487.webp"
    },
    "hero": {
      "kicker": "Ville de Chios • Patrimoine maritime",
      "title": "Musée maritime de Chios",
      "description": "Visitez Musée maritime de Chios et découvrez l’identité maritime de Chios, les navires, la navigation et le commerce.",
      "image": "https://chioshotel.gr/wp-content/uploads/2021/12/IMG_1203-Medium-min-768x487.webp",
      "tags": [
        "#maritime_museum",
        "#seafaring",
        "#ship_models",
        "#chios_town"
      ]
    },
    "details": [
      {
        "icon": "📍",
        "title": "Emplacement & accès",
        "text": "Il se trouve dans un secteur facile à intégrer à un itinéraire culturel à Chios."
      },
      {
        "icon": "🏛️",
        "title": "Thème du musée",
        "text": "Le musée présente l’identité maritime de Chios, les navires, la navigation et le commerce."
      },
      {
        "icon": "💡",
        "title": "Conseil local",
        "text": "Combinez la visite avec une promenade, un café ou un repas à proximité pour une expérience plus complète."
      }
    ],
    "highlights": {
      "title": "À voir",
      "items": [
        "L’identité maritime de Chios, les navires, la navigation et le commerce",
        "Lien avec l’histoire et l’identité de Chios",
        "Une halte culturelle utile en toute saison"
      ]
    },
    "experience": {
      "title": "Pourquoi visiter",
      "paragraphs": [
        "Visitez Musée maritime de Chios et découvrez l’identité maritime de Chios, les navires, la navigation et le commerce.",
        "C’est une bonne étape pour mieux comprendre l’île au-delà des plages et des villages."
      ]
    },
    "routeIdeas": {
      "title": "Comment l’intégrer à votre itinéraire",
      "items": [
        {
          "icon": "🏛️",
          "title": "Promenade culturelle",
          "text": "Combinez la visite avec une promenade, un café ou un repas à proximité pour une expérience plus complète."
        },
        {
          "icon": "🚗",
          "title": "Combinez les lieux proches",
          "text": "Il se trouve dans un secteur facile à intégrer à un itinéraire culturel à Chios."
        },
        {
          "icon": "📷",
          "title": "Prenez votre temps",
          "text": "Les musées se révèlent mieux quand on les visite sans hâte."
        }
      ]
    },
    "baseTip": {
      "icon": "🗺️",
      "title": "Votre base stratégique",
      "text": "Depuis Voulamandis House à Kampos, vous pouvez organiser facilement musées, villages, plages et gastronomie de Chios en belles journées équilibrées.",
      "linkLabel": "Séjournez avec ceux qui connaissent le mieux l’île.",
      "href": "/fr/chambres-a-chios/"
    },
    "relatedTitle": "Découvrez plus de musées de Chios",
    "relatedText": "Poursuivez votre itinéraire culturel à Chios avec archéologie, art byzantin, histoire maritime, livres, mastic et folklore."
  },
  {
    "slug": "schifffahrtsmuseum-chios",
    "seo": {
      "canonicalPath": "/de/museen-chios/schifffahrtsmuseum-chios/",
      "title": "Schifffahrtsmuseum Chios | Kulturführer für Chios",
      "description": "Besuchen Sie Schifffahrtsmuseum Chios und entdecken Sie die maritime Identität von Chios, Schiffe, Navigation und Handel.",
      "ogImage": "https://chioshotel.gr/wp-content/uploads/2021/12/IMG_1203-Medium-min-768x487.webp"
    },
    "hero": {
      "kicker": "Chios-Stadt • Maritimes Erbe",
      "title": "Schifffahrtsmuseum Chios",
      "description": "Besuchen Sie Schifffahrtsmuseum Chios und entdecken Sie die maritime Identität von Chios, Schiffe, Navigation und Handel.",
      "image": "https://chioshotel.gr/wp-content/uploads/2021/12/IMG_1203-Medium-min-768x487.webp",
      "tags": [
        "#maritime_museum",
        "#seafaring",
        "#ship_models",
        "#chios_town"
      ]
    },
    "details": [
      {
        "icon": "📍",
        "title": "Lage & Zugang",
        "text": "Es liegt an einem gut erreichbaren Ort und lässt sich leicht in eine Kulturroute auf Chios einbauen."
      },
      {
        "icon": "🏛️",
        "title": "Museumsschwerpunkt",
        "text": "Das Museum zeigt die maritime Identität von Chios, Schiffe, Navigation und Handel."
      },
      {
        "icon": "💡",
        "title": "Lokaler Tipp",
        "text": "Kombinieren Sie den Besuch mit einem Spaziergang, Kaffee oder Essen in der Nähe für ein runderes Erlebnis."
      }
    ],
    "highlights": {
      "title": "Was Sie sehen können",
      "items": [
        "Die maritime Identität von Chios, Schiffe, Navigation und Handel",
        "Verbindung zur Geschichte und Identität von Chios",
        "Ein sinnvoller Kulturstopp zu jeder Jahreszeit"
      ]
    },
    "experience": {
      "title": "Warum sich der Besuch lohnt",
      "paragraphs": [
        "Besuchen Sie Schifffahrtsmuseum Chios und entdecken Sie die maritime Identität von Chios, Schiffe, Navigation und Handel.",
        "Es ist ein guter Stopp, um die Insel jenseits von Stränden und Dörfern besser zu verstehen."
      ]
    },
    "routeIdeas": {
      "title": "So kombinieren Sie den Besuch",
      "items": [
        {
          "icon": "🏛️",
          "title": "Kulturspaziergang",
          "text": "Kombinieren Sie den Besuch mit einem Spaziergang, Kaffee oder Essen in der Nähe für ein runderes Erlebnis."
        },
        {
          "icon": "🚗",
          "title": "Nahe Orte kombinieren",
          "text": "Es liegt an einem gut erreichbaren Ort und lässt sich leicht in eine Kulturroute auf Chios einbauen."
        },
        {
          "icon": "📷",
          "title": "Nehmen Sie sich Zeit",
          "text": "Museen zeigen mehr, wenn man sie ohne Eile besucht."
        }
      ]
    },
    "baseTip": {
      "icon": "🗺️",
      "title": "Ihre strategische Basis",
      "text": "Von Voulamandis House in Kampos aus können Sie Museen, Dörfer, Strände und kulinarische Stopps auf Chios entspannt in Tagesrouten verbinden.",
      "linkLabel": "Übernachten Sie bei Menschen, die die Insel kennen.",
      "href": "/de/chios-zimmer/"
    },
    "relatedTitle": "Weitere Museen auf Chios entdecken",
    "relatedText": "Setzen Sie Ihre Kulturroute auf Chios mit Archäologie, byzantinischer Kunst, Seefahrtsgeschichte, Büchern, Mastix und Volkskunde fort."
  },
  {
    "slug": "museo-marittimo-chios",
    "seo": {
      "canonicalPath": "/it/musei-chios/museo-marittimo-chios/",
      "title": "Museo Marittimo di Chios | Guida culturale di Chios",
      "description": "Visita Museo Marittimo di Chios e scopri l’identità marinara di Chios, le navi, la navigazione e il commercio.",
      "ogImage": "https://chioshotel.gr/wp-content/uploads/2021/12/IMG_1203-Medium-min-768x487.webp"
    },
    "hero": {
      "kicker": "Città di Chios • Patrimonio marittimo",
      "title": "Museo Marittimo di Chios",
      "description": "Visita Museo Marittimo di Chios e scopri l’identità marinara di Chios, le navi, la navigazione e il commercio.",
      "image": "https://chioshotel.gr/wp-content/uploads/2021/12/IMG_1203-Medium-min-768x487.webp",
      "tags": [
        "#maritime_museum",
        "#seafaring",
        "#ship_models",
        "#chios_town"
      ]
    },
    "details": [
      {
        "icon": "📍",
        "title": "Posizione & accesso",
        "text": "Si trova in una zona facile da inserire in un itinerario culturale a Chios."
      },
      {
        "icon": "🏛️",
        "title": "Tema del museo",
        "text": "Il museo presenta l’identità marinara di Chios, le navi, la navigazione e il commercio."
      },
      {
        "icon": "💡",
        "title": "Consiglio locale",
        "text": "Combina la visita con una passeggiata, un caffè o un pasto nelle vicinanze per un’esperienza più completa."
      }
    ],
    "highlights": {
      "title": "Cosa vedere",
      "items": [
        "L’identità marinara di Chios, le navi, la navigazione e il commercio",
        "Collegamento con la storia e l’identità di Chios",
        "Una tappa culturale utile in ogni stagione"
      ]
    },
    "experience": {
      "title": "Perché visitarlo",
      "paragraphs": [
        "Visita Museo Marittimo di Chios e scopri l’identità marinara di Chios, le navi, la navigazione e il commercio.",
        "È una tappa utile per capire meglio l’isola oltre alle spiagge e ai villaggi."
      ]
    },
    "routeIdeas": {
      "title": "Come combinarlo",
      "items": [
        {
          "icon": "🏛️",
          "title": "Passeggiata culturale",
          "text": "Combina la visita con una passeggiata, un caffè o un pasto nelle vicinanze per un’esperienza più completa."
        },
        {
          "icon": "🚗",
          "title": "Combina luoghi vicini",
          "text": "Si trova in una zona facile da inserire in un itinerario culturale a Chios."
        },
        {
          "icon": "📷",
          "title": "Prenditi tempo",
          "text": "I musei rivelano di più quando li visiti senza fretta."
        }
      ]
    },
    "baseTip": {
      "icon": "🗺️",
      "title": "La tua base strategica",
      "text": "Da Voulamandis House a Kampos puoi organizzare facilmente musei, villaggi, spiagge e sapori di Chios in itinerari giornalieri equilibrati.",
      "linkLabel": "Soggiorna con chi conosce meglio l’isola.",
      "href": "/it/camere-a-chios/"
    },
    "relatedTitle": "Scopri altri musei di Chios",
    "relatedText": "Continua il tuo itinerario culturale a Chios con archeologia, arte bizantina, storia marittima, libri, mastice e folklore."
  },
  {
    "slug": "museo-maritimo-chios",
    "seo": {
      "canonicalPath": "/es/museos-chios/museo-maritimo-chios/",
      "title": "Museo Marítimo de Chios | Guía cultural de Chios",
      "description": "Visita Museo Marítimo de Chios y descubre la identidad marinera de Chios, los barcos, la navegación y el comercio.",
      "ogImage": "https://chioshotel.gr/wp-content/uploads/2021/12/IMG_1203-Medium-min-768x487.webp"
    },
    "hero": {
      "kicker": "Ciudad de Chios • Patrimonio marítimo",
      "title": "Museo Marítimo de Chios",
      "description": "Visita Museo Marítimo de Chios y descubre la identidad marinera de Chios, los barcos, la navegación y el comercio.",
      "image": "https://chioshotel.gr/wp-content/uploads/2021/12/IMG_1203-Medium-min-768x487.webp",
      "tags": [
        "#maritime_museum",
        "#seafaring",
        "#ship_models",
        "#chios_town"
      ]
    },
    "details": [
      {
        "icon": "📍",
        "title": "Ubicación y acceso",
        "text": "Está en una zona fácil de incluir en una ruta cultural por Chios."
      },
      {
        "icon": "🏛️",
        "title": "Tema del museo",
        "text": "El museo presenta la identidad marinera de Chios, los barcos, la navegación y el comercio."
      },
      {
        "icon": "💡",
        "title": "Consejo local",
        "text": "Combina la visita con un paseo, un café o una comida cercana para una experiencia más completa."
      }
    ],
    "highlights": {
      "title": "Qué ver",
      "items": [
        "La identidad marinera de Chios, los barcos, la navegación y el comercio",
        "Conexión con la historia y la identidad de Chios",
        "Una parada cultural útil en cualquier época"
      ]
    },
    "experience": {
      "title": "Por qué visitarlo",
      "paragraphs": [
        "Visita Museo Marítimo de Chios y descubre la identidad marinera de Chios, los barcos, la navegación y el comercio.",
        "Es una buena parada para comprender mejor la isla más allá de sus playas y pueblos."
      ]
    },
    "routeIdeas": {
      "title": "Cómo combinarlo",
      "items": [
        {
          "icon": "🏛️",
          "title": "Paseo cultural",
          "text": "Combina la visita con un paseo, un café o una comida cercana para una experiencia más completa."
        },
        {
          "icon": "🚗",
          "title": "Combina lugares cercanos",
          "text": "Está en una zona fácil de incluir en una ruta cultural por Chios."
        },
        {
          "icon": "📷",
          "title": "Tómate tu tiempo",
          "text": "Los museos se disfrutan más cuando se visitan sin prisa."
        }
      ]
    },
    "baseTip": {
      "icon": "🗺️",
      "title": "Tu base estratégica",
      "text": "Desde Voulamandis House en Kampos puedes organizar fácilmente museos, pueblos, playas y sabores de Chios en rutas diarias equilibradas.",
      "linkLabel": "Alójate con quienes mejor conocen la isla.",
      "href": "/es/habitaciones-en-chios/"
    },
    "relatedTitle": "Descubre más museos de Chios",
    "relatedText": "Continúa tu ruta cultural por Chios con arqueología, arte bizantino, historia marítima, libros, mastiha y folclore."
  },
  {
    "slug": "denizcilik-muzesi-sakiz",
    "seo": {
      "canonicalPath": "/tr/sakiz-adasi-muzeleri/denizcilik-muzesi-sakiz/",
      "title": "Sakız Denizcilik Müzesi | Sakız Adası kültür rehberi",
      "description": "Ziyaret edin Sakız Denizcilik Müzesi ve keşfedin Sakız’ın denizcilik kimliğini, gemileri, navigasyonu ve ticareti.",
      "ogImage": "https://chioshotel.gr/wp-content/uploads/2021/12/IMG_1203-Medium-min-768x487.webp"
    },
    "hero": {
      "kicker": "Sakız şehir merkezi • Denizcilik mirası",
      "title": "Sakız Denizcilik Müzesi",
      "description": "Ziyaret edin Sakız Denizcilik Müzesi ve keşfedin Sakız’ın denizcilik kimliğini, gemileri, navigasyonu ve ticareti.",
      "image": "https://chioshotel.gr/wp-content/uploads/2021/12/IMG_1203-Medium-min-768x487.webp",
      "tags": [
        "#maritime_museum",
        "#seafaring",
        "#ship_models",
        "#chios_town"
      ]
    },
    "details": [
      {
        "icon": "📍",
        "title": "Konum & ulaşım",
        "text": "Sakız Adası’ndaki kültür rotalarına kolayca eklenebilecek bir konumdadır."
      },
      {
        "icon": "🏛️",
        "title": "Müze teması",
        "text": "Müze Sakız’ın denizcilik kimliğini, gemileri, navigasyonu ve ticareti."
      },
      {
        "icon": "💡",
        "title": "Yerel tavsiye",
        "text": "Ziyareti yakınlarda kısa bir yürüyüş, kahve veya yemek molasıyla birleştirerek daha tamamlayıcı bir deneyim yaşayabilirsiniz."
      }
    ],
    "highlights": {
      "title": "Neler görülebilir",
      "items": [
        "Sakız’ın denizcilik kimliğini, gemileri, navigasyonu ve ticareti",
        "Sakız’ın tarihi ve kimliğiyle bağlantı",
        "Her mevsim için anlamlı bir kültür durağı"
      ]
    },
    "experience": {
      "title": "Neden ziyaret etmeli",
      "paragraphs": [
        "Ziyaret edin Sakız Denizcilik Müzesi ve keşfedin Sakız’ın denizcilik kimliğini, gemileri, navigasyonu ve ticareti.",
        "Plajların ve köylerin ötesinde adayı daha iyi anlamak için iyi bir duraktır."
      ]
    },
    "routeIdeas": {
      "title": "Nasıl birleştirilir",
      "items": [
        {
          "icon": "🏛️",
          "title": "Kültür yürüyüşü",
          "text": "Ziyareti yakınlarda kısa bir yürüyüş, kahve veya yemek molasıyla birleştirerek daha tamamlayıcı bir deneyim yaşayabilirsiniz."
        },
        {
          "icon": "🚗",
          "title": "Yakın noktaları birleştirin",
          "text": "Sakız Adası’ndaki kültür rotalarına kolayca eklenebilecek bir konumdadır."
        },
        {
          "icon": "📷",
          "title": "Zaman ayırın",
          "text": "Müzeler acele etmeden gezildiğinde daha çok şey anlatır."
        }
      ]
    },
    "baseTip": {
      "icon": "🗺️",
      "title": "Stratejik üssünüz",
      "text": "Kampos’taki Voulamandis House’tan müzeleri, köyleri, plajları ve Sakız lezzetlerini dengeli günlük rotalar halinde kolayca planlayabilirsiniz.",
      "linkLabel": "Adayı en iyi bilenlerle konaklayın.",
      "href": "/tr/sakiz-adasi-odalari/"
    },
    "relatedTitle": "Daha fazla Sakız müzesi keşfedin",
    "relatedText": "Sakız Adası’ndaki kültür rotanıza arkeoloji, Bizans sanatı, denizcilik tarihi, kitaplar, mastik ve folklorla devam edin."
  },
  {
    "slug": "laografiko-mouseio-kallimasias",
    "seo": {
      "canonicalPath": "/el/mouseia-xios/laografiko-mouseio-kallimasias/",
      "title": "Λαογραφικό Μουσείο Καλλιμασιάς | Πολιτιστικός οδηγός Χίου",
      "description": "Επισκεφθείτε Λαογραφικό Μουσείο Καλλιμασιάς και ανακαλύψτε την καθημερινή ζωή, τα εργαλεία, τα έθιμα και τη λαϊκή μνήμη της Χίου.",
      "ogImage": "https://chioshotel.gr/wp-content/uploads/2021/12/2-1-768x512.webp"
    },
    "hero": {
      "kicker": "Καλλιμασιά • Λαογραφία",
      "title": "Λαογραφικό Μουσείο Καλλιμασιάς",
      "description": "Επισκεφθείτε Λαογραφικό Μουσείο Καλλιμασιάς και ανακαλύψτε την καθημερινή ζωή, τα εργαλεία, τα έθιμα και τη λαϊκή μνήμη της Χίου.",
      "image": "https://chioshotel.gr/wp-content/uploads/2021/12/2-1-768x512.webp",
      "tags": [
        "#folklore_museum",
        "#kallimasia",
        "#village_life",
        "#tradition"
      ]
    },
    "details": [
      {
        "icon": "📍",
        "title": "Τοποθεσία & πρόσβαση",
        "text": "Βρίσκεται σε εύκολα προσβάσιμο σημείο και συνδυάζεται όμορφα με μια πολιτιστική διαδρομή στη Χίο."
      },
      {
        "icon": "🏛️",
        "title": "Θεματική μουσείου",
        "text": "Το μουσείο παρουσιάζει την καθημερινή ζωή, τα εργαλεία, τα έθιμα και τη λαϊκή μνήμη της Χίου."
      },
      {
        "icon": "💡",
        "title": "Τοπική συμβουλή",
        "text": "Συνδυάστε την επίσκεψη με κοντινή βόλτα, καφέ ή φαγητό για μια πιο ολοκληρωμένη εμπειρία."
      }
    ],
    "highlights": {
      "title": "Τι θα δείτε",
      "items": [
        "Την καθημερινή ζωή, τα εργαλεία, τα έθιμα και τη λαϊκή μνήμη της Χίου",
        "Σύνδεση με την ιστορία και την ταυτότητα της Χίου",
        "Μια χρήσιμη πολιτιστική στάση για όλες τις εποχές"
      ]
    },
    "experience": {
      "title": "Γιατί αξίζει η επίσκεψη",
      "paragraphs": [
        "Επισκεφθείτε Λαογραφικό Μουσείο Καλλιμασιάς και ανακαλύψτε την καθημερινή ζωή, τα εργαλεία, τα έθιμα και τη λαϊκή μνήμη της Χίου.",
        "Είναι μια καλή στάση για να καταλάβετε καλύτερα το νησί πέρα από τις παραλίες και τα χωριά."
      ]
    },
    "routeIdeas": {
      "title": "Πώς να το συνδυάσετε",
      "items": [
        {
          "icon": "🏛️",
          "title": "Πολιτιστική βόλτα",
          "text": "Συνδυάστε την επίσκεψη με κοντινή βόλτα, καφέ ή φαγητό για μια πιο ολοκληρωμένη εμπειρία."
        },
        {
          "icon": "🚗",
          "title": "Συνδυάστε κοντινά σημεία",
          "text": "Βρίσκεται σε εύκολα προσβάσιμο σημείο και συνδυάζεται όμορφα με μια πολιτιστική διαδρομή στη Χίο."
        },
        {
          "icon": "📷",
          "title": "Αφήστε χρόνο",
          "text": "Τα μουσεία αποκαλύπτουν περισσότερα όταν τα δείτε χωρίς βιασύνη."
        }
      ]
    },
    "baseTip": {
      "icon": "🗺️",
      "title": "Η στρατηγική σας βάση",
      "text": "Με βάση το Voulamandis House στον Κάμπο, μπορείτε να οργανώσετε εύκολα μουσεία, χωριά, παραλίες και γεύσεις της Χίου σε ισορροπημένες ημερήσιες διαδρομές.",
      "linkLabel": "Μείνετε με ανθρώπους που γνωρίζουν το νησί.",
      "href": "/el/domatia-xios/"
    },
    "relatedTitle": "Ανακαλύψτε περισσότερα μουσεία της Χίου",
    "relatedText": "Συνεχίστε την πολιτιστική διαδρομή σας στη Χίο με αρχαιολογία, βυζαντινή τέχνη, ναυτική ιστορία, βιβλία, μαστίχα και λαογραφία."
  },
  {
    "slug": "musee-folklorique-kallimasia",
    "seo": {
      "canonicalPath": "/fr/musees-de-chios/musee-folklorique-kallimasia/",
      "title": "Musée folklorique de Kallimasia | Guide culturel de Chios",
      "description": "Visitez Musée folklorique de Kallimasia et découvrez la vie quotidienne, les outils, les coutumes et la mémoire locale de Chios.",
      "ogImage": "https://chioshotel.gr/wp-content/uploads/2021/12/2-1-768x512.webp"
    },
    "hero": {
      "kicker": "Kallimasia • Folklore",
      "title": "Musée folklorique de Kallimasia",
      "description": "Visitez Musée folklorique de Kallimasia et découvrez la vie quotidienne, les outils, les coutumes et la mémoire locale de Chios.",
      "image": "https://chioshotel.gr/wp-content/uploads/2021/12/2-1-768x512.webp",
      "tags": [
        "#folklore_museum",
        "#kallimasia",
        "#village_life",
        "#tradition"
      ]
    },
    "details": [
      {
        "icon": "📍",
        "title": "Emplacement & accès",
        "text": "Il se trouve dans un secteur facile à intégrer à un itinéraire culturel à Chios."
      },
      {
        "icon": "🏛️",
        "title": "Thème du musée",
        "text": "Le musée présente la vie quotidienne, les outils, les coutumes et la mémoire locale de Chios."
      },
      {
        "icon": "💡",
        "title": "Conseil local",
        "text": "Combinez la visite avec une promenade, un café ou un repas à proximité pour une expérience plus complète."
      }
    ],
    "highlights": {
      "title": "À voir",
      "items": [
        "La vie quotidienne, les outils, les coutumes et la mémoire locale de Chios",
        "Lien avec l’histoire et l’identité de Chios",
        "Une halte culturelle utile en toute saison"
      ]
    },
    "experience": {
      "title": "Pourquoi visiter",
      "paragraphs": [
        "Visitez Musée folklorique de Kallimasia et découvrez la vie quotidienne, les outils, les coutumes et la mémoire locale de Chios.",
        "C’est une bonne étape pour mieux comprendre l’île au-delà des plages et des villages."
      ]
    },
    "routeIdeas": {
      "title": "Comment l’intégrer à votre itinéraire",
      "items": [
        {
          "icon": "🏛️",
          "title": "Promenade culturelle",
          "text": "Combinez la visite avec une promenade, un café ou un repas à proximité pour une expérience plus complète."
        },
        {
          "icon": "🚗",
          "title": "Combinez les lieux proches",
          "text": "Il se trouve dans un secteur facile à intégrer à un itinéraire culturel à Chios."
        },
        {
          "icon": "📷",
          "title": "Prenez votre temps",
          "text": "Les musées se révèlent mieux quand on les visite sans hâte."
        }
      ]
    },
    "baseTip": {
      "icon": "🗺️",
      "title": "Votre base stratégique",
      "text": "Depuis Voulamandis House à Kampos, vous pouvez organiser facilement musées, villages, plages et gastronomie de Chios en belles journées équilibrées.",
      "linkLabel": "Séjournez avec ceux qui connaissent le mieux l’île.",
      "href": "/fr/chambres-a-chios/"
    },
    "relatedTitle": "Découvrez plus de musées de Chios",
    "relatedText": "Poursuivez votre itinéraire culturel à Chios avec archéologie, art byzantin, histoire maritime, livres, mastic et folklore."
  },
  {
    "slug": "volkskundemuseum-kallimasia",
    "seo": {
      "canonicalPath": "/de/museen-chios/volkskundemuseum-kallimasia/",
      "title": "Volkskundemuseum Kallimasia | Kulturführer für Chios",
      "description": "Besuchen Sie Volkskundemuseum Kallimasia und entdecken Sie Alltagsleben, Werkzeuge, Bräuche und lokale Erinnerung auf Chios.",
      "ogImage": "https://chioshotel.gr/wp-content/uploads/2021/12/2-1-768x512.webp"
    },
    "hero": {
      "kicker": "Kallimasia • Volkskunde",
      "title": "Volkskundemuseum Kallimasia",
      "description": "Besuchen Sie Volkskundemuseum Kallimasia und entdecken Sie Alltagsleben, Werkzeuge, Bräuche und lokale Erinnerung auf Chios.",
      "image": "https://chioshotel.gr/wp-content/uploads/2021/12/2-1-768x512.webp",
      "tags": [
        "#folklore_museum",
        "#kallimasia",
        "#village_life",
        "#tradition"
      ]
    },
    "details": [
      {
        "icon": "📍",
        "title": "Lage & Zugang",
        "text": "Es liegt an einem gut erreichbaren Ort und lässt sich leicht in eine Kulturroute auf Chios einbauen."
      },
      {
        "icon": "🏛️",
        "title": "Museumsschwerpunkt",
        "text": "Das Museum zeigt Alltagsleben, Werkzeuge, Bräuche und lokale Erinnerung auf Chios."
      },
      {
        "icon": "💡",
        "title": "Lokaler Tipp",
        "text": "Kombinieren Sie den Besuch mit einem Spaziergang, Kaffee oder Essen in der Nähe für ein runderes Erlebnis."
      }
    ],
    "highlights": {
      "title": "Was Sie sehen können",
      "items": [
        "Alltagsleben, Werkzeuge, Bräuche und lokale Erinnerung auf Chios",
        "Verbindung zur Geschichte und Identität von Chios",
        "Ein sinnvoller Kulturstopp zu jeder Jahreszeit"
      ]
    },
    "experience": {
      "title": "Warum sich der Besuch lohnt",
      "paragraphs": [
        "Besuchen Sie Volkskundemuseum Kallimasia und entdecken Sie Alltagsleben, Werkzeuge, Bräuche und lokale Erinnerung auf Chios.",
        "Es ist ein guter Stopp, um die Insel jenseits von Stränden und Dörfern besser zu verstehen."
      ]
    },
    "routeIdeas": {
      "title": "So kombinieren Sie den Besuch",
      "items": [
        {
          "icon": "🏛️",
          "title": "Kulturspaziergang",
          "text": "Kombinieren Sie den Besuch mit einem Spaziergang, Kaffee oder Essen in der Nähe für ein runderes Erlebnis."
        },
        {
          "icon": "🚗",
          "title": "Nahe Orte kombinieren",
          "text": "Es liegt an einem gut erreichbaren Ort und lässt sich leicht in eine Kulturroute auf Chios einbauen."
        },
        {
          "icon": "📷",
          "title": "Nehmen Sie sich Zeit",
          "text": "Museen zeigen mehr, wenn man sie ohne Eile besucht."
        }
      ]
    },
    "baseTip": {
      "icon": "🗺️",
      "title": "Ihre strategische Basis",
      "text": "Von Voulamandis House in Kampos aus können Sie Museen, Dörfer, Strände und kulinarische Stopps auf Chios entspannt in Tagesrouten verbinden.",
      "linkLabel": "Übernachten Sie bei Menschen, die die Insel kennen.",
      "href": "/de/chios-zimmer/"
    },
    "relatedTitle": "Weitere Museen auf Chios entdecken",
    "relatedText": "Setzen Sie Ihre Kulturroute auf Chios mit Archäologie, byzantinischer Kunst, Seefahrtsgeschichte, Büchern, Mastix und Volkskunde fort."
  },
  {
    "slug": "museo-folkloristico-kallimasia",
    "seo": {
      "canonicalPath": "/it/musei-chios/museo-folkloristico-kallimasia/",
      "title": "Museo Folkloristico di Kallimasia | Guida culturale di Chios",
      "description": "Visita Museo Folkloristico di Kallimasia e scopri la vita quotidiana, gli strumenti, le usanze e la memoria locale di Chios.",
      "ogImage": "https://chioshotel.gr/wp-content/uploads/2021/12/2-1-768x512.webp"
    },
    "hero": {
      "kicker": "Kallimasia • Folklore",
      "title": "Museo Folkloristico di Kallimasia",
      "description": "Visita Museo Folkloristico di Kallimasia e scopri la vita quotidiana, gli strumenti, le usanze e la memoria locale di Chios.",
      "image": "https://chioshotel.gr/wp-content/uploads/2021/12/2-1-768x512.webp",
      "tags": [
        "#folklore_museum",
        "#kallimasia",
        "#village_life",
        "#tradition"
      ]
    },
    "details": [
      {
        "icon": "📍",
        "title": "Posizione & accesso",
        "text": "Si trova in una zona facile da inserire in un itinerario culturale a Chios."
      },
      {
        "icon": "🏛️",
        "title": "Tema del museo",
        "text": "Il museo presenta la vita quotidiana, gli strumenti, le usanze e la memoria locale di Chios."
      },
      {
        "icon": "💡",
        "title": "Consiglio locale",
        "text": "Combina la visita con una passeggiata, un caffè o un pasto nelle vicinanze per un’esperienza più completa."
      }
    ],
    "highlights": {
      "title": "Cosa vedere",
      "items": [
        "La vita quotidiana, gli strumenti, le usanze e la memoria locale di Chios",
        "Collegamento con la storia e l’identità di Chios",
        "Una tappa culturale utile in ogni stagione"
      ]
    },
    "experience": {
      "title": "Perché visitarlo",
      "paragraphs": [
        "Visita Museo Folkloristico di Kallimasia e scopri la vita quotidiana, gli strumenti, le usanze e la memoria locale di Chios.",
        "È una tappa utile per capire meglio l’isola oltre alle spiagge e ai villaggi."
      ]
    },
    "routeIdeas": {
      "title": "Come combinarlo",
      "items": [
        {
          "icon": "🏛️",
          "title": "Passeggiata culturale",
          "text": "Combina la visita con una passeggiata, un caffè o un pasto nelle vicinanze per un’esperienza più completa."
        },
        {
          "icon": "🚗",
          "title": "Combina luoghi vicini",
          "text": "Si trova in una zona facile da inserire in un itinerario culturale a Chios."
        },
        {
          "icon": "📷",
          "title": "Prenditi tempo",
          "text": "I musei rivelano di più quando li visiti senza fretta."
        }
      ]
    },
    "baseTip": {
      "icon": "🗺️",
      "title": "La tua base strategica",
      "text": "Da Voulamandis House a Kampos puoi organizzare facilmente musei, villaggi, spiagge e sapori di Chios in itinerari giornalieri equilibrati.",
      "linkLabel": "Soggiorna con chi conosce meglio l’isola.",
      "href": "/it/camere-a-chios/"
    },
    "relatedTitle": "Scopri altri musei di Chios",
    "relatedText": "Continua il tuo itinerario culturale a Chios con archeologia, arte bizantina, storia marittima, libri, mastice e folklore."
  },
  {
    "slug": "museo-folclorico-kallimasia",
    "seo": {
      "canonicalPath": "/es/museos-chios/museo-folclorico-kallimasia/",
      "title": "Museo Folclórico de Kallimasia | Guía cultural de Chios",
      "description": "Visita Museo Folclórico de Kallimasia y descubre la vida cotidiana, las herramientas, las costumbres y la memoria local de Chios.",
      "ogImage": "https://chioshotel.gr/wp-content/uploads/2021/12/2-1-768x512.webp"
    },
    "hero": {
      "kicker": "Kallimasia • Folclore",
      "title": "Museo Folclórico de Kallimasia",
      "description": "Visita Museo Folclórico de Kallimasia y descubre la vida cotidiana, las herramientas, las costumbres y la memoria local de Chios.",
      "image": "https://chioshotel.gr/wp-content/uploads/2021/12/2-1-768x512.webp",
      "tags": [
        "#folklore_museum",
        "#kallimasia",
        "#village_life",
        "#tradition"
      ]
    },
    "details": [
      {
        "icon": "📍",
        "title": "Ubicación y acceso",
        "text": "Está en una zona fácil de incluir en una ruta cultural por Chios."
      },
      {
        "icon": "🏛️",
        "title": "Tema del museo",
        "text": "El museo presenta la vida cotidiana, las herramientas, las costumbres y la memoria local de Chios."
      },
      {
        "icon": "💡",
        "title": "Consejo local",
        "text": "Combina la visita con un paseo, un café o una comida cercana para una experiencia más completa."
      }
    ],
    "highlights": {
      "title": "Qué ver",
      "items": [
        "La vida cotidiana, las herramientas, las costumbres y la memoria local de Chios",
        "Conexión con la historia y la identidad de Chios",
        "Una parada cultural útil en cualquier época"
      ]
    },
    "experience": {
      "title": "Por qué visitarlo",
      "paragraphs": [
        "Visita Museo Folclórico de Kallimasia y descubre la vida cotidiana, las herramientas, las costumbres y la memoria local de Chios.",
        "Es una buena parada para comprender mejor la isla más allá de sus playas y pueblos."
      ]
    },
    "routeIdeas": {
      "title": "Cómo combinarlo",
      "items": [
        {
          "icon": "🏛️",
          "title": "Paseo cultural",
          "text": "Combina la visita con un paseo, un café o una comida cercana para una experiencia más completa."
        },
        {
          "icon": "🚗",
          "title": "Combina lugares cercanos",
          "text": "Está en una zona fácil de incluir en una ruta cultural por Chios."
        },
        {
          "icon": "📷",
          "title": "Tómate tu tiempo",
          "text": "Los museos se disfrutan más cuando se visitan sin prisa."
        }
      ]
    },
    "baseTip": {
      "icon": "🗺️",
      "title": "Tu base estratégica",
      "text": "Desde Voulamandis House en Kampos puedes organizar fácilmente museos, pueblos, playas y sabores de Chios en rutas diarias equilibradas.",
      "linkLabel": "Alójate con quienes mejor conocen la isla.",
      "href": "/es/habitaciones-en-chios/"
    },
    "relatedTitle": "Descubre más museos de Chios",
    "relatedText": "Continúa tu ruta cultural por Chios con arqueología, arte bizantino, historia marítima, libros, mastiha y folclore."
  },
  {
    "slug": "kallimasia-folklor-muzesi",
    "seo": {
      "canonicalPath": "/tr/sakiz-adasi-muzeleri/kallimasia-folklor-muzesi/",
      "title": "Kallimasia Folklor Müzesi | Sakız Adası kültür rehberi",
      "description": "Ziyaret edin Kallimasia Folklor Müzesi ve keşfedin Sakız’ın günlük yaşamını, araçlarını, geleneklerini ve yerel hafızasını.",
      "ogImage": "https://chioshotel.gr/wp-content/uploads/2021/12/2-1-768x512.webp"
    },
    "hero": {
      "kicker": "Kallimasia • Folklor",
      "title": "Kallimasia Folklor Müzesi",
      "description": "Ziyaret edin Kallimasia Folklor Müzesi ve keşfedin Sakız’ın günlük yaşamını, araçlarını, geleneklerini ve yerel hafızasını.",
      "image": "https://chioshotel.gr/wp-content/uploads/2021/12/2-1-768x512.webp",
      "tags": [
        "#folklore_museum",
        "#kallimasia",
        "#village_life",
        "#tradition"
      ]
    },
    "details": [
      {
        "icon": "📍",
        "title": "Konum & ulaşım",
        "text": "Sakız Adası’ndaki kültür rotalarına kolayca eklenebilecek bir konumdadır."
      },
      {
        "icon": "🏛️",
        "title": "Müze teması",
        "text": "Müze Sakız’ın günlük yaşamını, araçlarını, geleneklerini ve yerel hafızasını."
      },
      {
        "icon": "💡",
        "title": "Yerel tavsiye",
        "text": "Ziyareti yakınlarda kısa bir yürüyüş, kahve veya yemek molasıyla birleştirerek daha tamamlayıcı bir deneyim yaşayabilirsiniz."
      }
    ],
    "highlights": {
      "title": "Neler görülebilir",
      "items": [
        "Sakız’ın günlük yaşamını, araçlarını, geleneklerini ve yerel hafızasını",
        "Sakız’ın tarihi ve kimliğiyle bağlantı",
        "Her mevsim için anlamlı bir kültür durağı"
      ]
    },
    "experience": {
      "title": "Neden ziyaret etmeli",
      "paragraphs": [
        "Ziyaret edin Kallimasia Folklor Müzesi ve keşfedin Sakız’ın günlük yaşamını, araçlarını, geleneklerini ve yerel hafızasını.",
        "Plajların ve köylerin ötesinde adayı daha iyi anlamak için iyi bir duraktır."
      ]
    },
    "routeIdeas": {
      "title": "Nasıl birleştirilir",
      "items": [
        {
          "icon": "🏛️",
          "title": "Kültür yürüyüşü",
          "text": "Ziyareti yakınlarda kısa bir yürüyüş, kahve veya yemek molasıyla birleştirerek daha tamamlayıcı bir deneyim yaşayabilirsiniz."
        },
        {
          "icon": "🚗",
          "title": "Yakın noktaları birleştirin",
          "text": "Sakız Adası’ndaki kültür rotalarına kolayca eklenebilecek bir konumdadır."
        },
        {
          "icon": "📷",
          "title": "Zaman ayırın",
          "text": "Müzeler acele etmeden gezildiğinde daha çok şey anlatır."
        }
      ]
    },
    "baseTip": {
      "icon": "🗺️",
      "title": "Stratejik üssünüz",
      "text": "Kampos’taki Voulamandis House’tan müzeleri, köyleri, plajları ve Sakız lezzetlerini dengeli günlük rotalar halinde kolayca planlayabilirsiniz.",
      "linkLabel": "Adayı en iyi bilenlerle konaklayın.",
      "href": "/tr/sakiz-adasi-odalari/"
    },
    "relatedTitle": "Daha fazla Sakız müzesi keşfedin",
    "relatedText": "Sakız Adası’ndaki kültür rotanıza arkeoloji, Bizans sanatı, denizcilik tarihi, kitaplar, mastik ve folklorla devam edin."
  }
];

export function getLocalizedMuseumDetailByPath(path: string) {
  return localizedMuseumDetails.find((museum) => museum.seo.canonicalPath === path);
}

export function getAllMuseumDetails() {
  return [...museumDetails, ...localizedMuseumDetails];
}

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