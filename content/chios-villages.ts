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

const villageImages = {
  pyrgi:
    "https://chioshotel.gr/wp-content/uploads/2021/12/29651245457_aa8f702ef7_b-768x432.webp",
  mesta:
    "https://chioshotel.gr/wp-content/uploads/2021/12/9ac4cf44d16c4af6d873c5bba4a6696b_L-768x480.webp",
  vessa:
    "https://chioshotel.gr/wp-content/uploads/2021/12/29651245457_aa8f702ef7_b-768x432.webp",
  olympoi:
    "https://chioshotel.gr/wp-content/uploads/2021/12/olympoi-1-768x432.webp",
  volissos:
    "https://chioshotel.gr/wp-content/uploads/2021/12/Volissos-Chios.webp",
  armolia:
    "https://chioshotel.gr/wp-content/uploads/2021/12/unnamed-e1702830815478.webp",
  lagada:
    "https://chioshotel.gr/wp-content/uploads/2021/12/lagada_3.webp",
};

export const chiosVillagesPageEn: ChiosVillagesPageData = {
  seo: {
    canonicalPath: "/chios/chios-villages/",
    title: "Chios Villages Guide | Medieval Villages, Mastic Villages & Local Life",
    description:
      "Explore the most beautiful villages in Chios, from Pyrgi and Mesta to Vessa, Olympoi, Volissos, Armolia and Lagada.",
    ogImage: villageImages.lagada,
  },
  hero: {
    kicker: "Chios villages guide",
    title: "Explore the villages of Chios",
    description:
      "Discover medieval fortress villages, mastic culture, pottery traditions, seaside taverns and the authentic local character of Chios Island.",
    image: villageImages.lagada,
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
      image: villageImages.pyrgi,
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
      image: villageImages.mesta,
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
      image: villageImages.vessa,
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
      image: villageImages.olympoi,
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
      image: villageImages.volissos,
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
      image: villageImages.armolia,
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
      image: villageImages.lagada,
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

export const chiosVillagesPageEl: ChiosVillagesPageData = {
  seo: {
    canonicalPath: "/el/xoria-xios/",
    title: "Χωριά της Χίου | Μεσαιωνικά χωριά, Μαστιχοχώρια & τοπική ζωή",
    description:
      "Ανακαλύψτε τα πιο όμορφα χωριά της Χίου, από το Πυργί και τα Μεστά μέχρι τη Βέσσα, τους Ολύμπους, τη Βολισσό, τα Αρμόλια και τη Λαγκάδα.",
    ogImage: villageImages.lagada,
  },
  hero: {
    kicker: "Οδηγός χωριών Χίου",
    title: "Ανακαλύψτε τα χωριά της Χίου",
    description:
      "Γνωρίστε μεσαιωνικά καστροχώρια, την κουλτούρα της μαστίχας, την κεραμική παράδοση, παραθαλάσσιες ταβέρνες και τον αυθεντικό χαρακτήρα της Χίου.",
    image: villageImages.lagada,
    primaryCta: {
      label: "Δείτε τα χωριά",
      href: "#villages",
    },
    secondaryCta: {
      label: "Μείνετε στον Κάμπο",
      href: "/el/domatia-xios/",
    },
  },
  intro: {
    kicker: "Οργάνωση διαδρομών",
    title: "Μια διαφορετική πλευρά της Χίου πέρα από τις παραλίες",
    description:
      "Τα χωριά της Χίου αποκαλύπτουν την ιστορία, την αρχιτεκτονική και την καθημερινή κουλτούρα του νησιού. Στο νότο, τα Μαστιχοχώρια διατηρούν μεσαιωνική οχύρωση και μοναδικές διακοσμητικές παραδόσεις. Στο βορρά και δίπλα στη θάλασσα, τα χωριά προσφέρουν κάστρα, ελαιώνες, λιμανάκια και χαλαρές γαστρονομικές εμπειρίες.",
    tip: {
      icon: "🏡",
      title: "Η τοπική σας βάση για διαδρομές στα χωριά",
      text:
        "Το Voulamandis House στον Κάμπο είναι πρακτική αφετηρία για να εξερευνήσετε τα χωριά της Χίου. Μπορείτε να συνδυάσετε Μαστιχοχώρια, παραλίες και την πόλη της Χίου, μένοντας σε μια ήσυχη ιστορική περιοχή.",
      linkLabel: "Δείτε τα δωμάτια στο Voulamandis House",
      href: "/el/domatia-xios/",
    },
  },
  villages: [
    {
      id: "pyrgi",
      name: "Πυργί",
      title: "Πυργί: το ζωγραφιστό χωριό",
      description:
        "Το Πυργί είναι ένα από τα πιο ξεχωριστά χωριά της Χίου, γνωστό για τα ασπρόμαυρα γεωμετρικά σχέδια στα σπίτια και τα στενά παραδοσιακά σοκάκια.",
      image: villageImages.pyrgi,
      imageAlt:
        "Το Πυργί στη Χίο με ασπρόμαυρα γεωμετρικά σχέδια στα σπίτια",
      href: "/el/xoria-xios/pyrgi-xios/",
      region: "Νότια Χίος",
      mood: "Γεωμετρική παράδοση",
      badges: ["Μαστιχοχώρι", "Ξυστά", "Νότια"],
      size: "large",
    },
    {
      id: "mesta",
      name: "Μεστά",
      title: "Μεστά: μεσαιωνικό καστροχώρι",
      description:
        "Τα Μεστά είναι ένα εξαιρετικά καλοδιατηρημένο μεσαιωνικό χωριό με πέτρινα σπίτια, στενά σοκάκια, αμυντική αρχιτεκτονική και έντονη ιστορική ατμόσφαιρα.",
      image: villageImages.mesta,
      imageAlt:
        "Τα Μεστά στη Χίο με πέτρινα σοκάκια και καστροχωρίτικη αρχιτεκτονική",
      href: "/el/xoria-xios/mesta-xios/",
      region: "Νότια Χίος",
      mood: "Μεσαιωνική γοητεία",
      badges: ["Καστροχώρι", "Πέτρινα σοκάκια", "Μαστίχα"],
      size: "tall",
    },
    {
      id: "vessa",
      name: "Βέσσα",
      title: "Βέσσα: ήσυχη μεσαιωνική ομορφιά",
      description:
        "Η Βέσσα κρατά μια πιο ήρεμη μεσαιωνική ατμόσφαιρα, με καλοδιατηρημένα σοκάκια, πυργόσπιτα και ήσυχο ρυθμό χωριού.",
      image: villageImages.vessa,
      imageAlt:
        "Η Βέσσα στη Χίο με παραδοσιακή πέτρινη αρχιτεκτονική",
      href: "/el/xoria-xios/vessa-xios/",
      region: "Κεντρική Χίος",
      mood: "Ήσυχη ιστορία",
      badges: ["Μεσαιωνικό", "Παραδοσιακό", "Ήσυχο"],
      size: "normal",
    },
    {
      id: "olympoi",
      name: "Ολύμποι",
      title: "Ολύμποι",
      description:
        "Οι Ολύμποι είναι παραδοσιακό χωριό με ιστορική αρχιτεκτονική, βυζαντινές εκκλησίες και αγροτικό χαρακτήρα κοντά στην περιοχή των Μαστιχοχωρίων.",
      image: villageImages.olympoi,
      imageAlt: "Οι Ολύμποι στη Χίο με παραδοσιακή αρχιτεκτονική",
      href: "/el/xoria-xios/olympoi-xios/",
      region: "Νότια Χίος",
      mood: "Αγροτική κληρονομιά",
      badges: ["Ιστορία", "Βυζαντινές εκκλησίες", "Ύπαιθρος"],
      size: "normal",
    },
    {
      id: "volissos",
      name: "Βολισσός",
      title: "Βολισσός: κάστρο και θέα στη βορειοδυτική Χίο",
      description:
        "Η Βολισσός είναι το μεγαλύτερο χωριό της βορειοδυτικής Χίου, γνωστή για το μεσαιωνικό κάστρο, τα στενά σοκάκια, τους ελαιώνες και τη θέα προς τη θάλασσα.",
      image: villageImages.volissos,
      imageAlt:
        "Η Βολισσός στη βορειοδυτική Χίο με κάστρο και θέα στη θάλασσα",
      href: "/el/xoria-xios/volissos-xios/",
      region: "Βορειοδυτική Χίος",
      mood: "Κάστρο & θέα",
      badges: ["Κάστρο", "Βορειοδυτικά", "Ελαιώνες"],
      size: "wide",
    },
    {
      id: "armolia",
      name: "Αρμόλια",
      title: "Αρμόλια: κεραμική παράδοση",
      description:
        "Τα Αρμόλια είναι γνωστά για την κεραμική παράδοση, τα πέτρινα σπίτια και την τοπική χειροτεχνία, αποτελώντας ουσιαστική στάση σε μια νότια διαδρομή.",
      image: villageImages.armolia,
      imageAlt: "Τα Αρμόλια στη Χίο, χωριό γνωστό για την κεραμική",
      href: "/el/xoria-xios/armolia-xios/",
      region: "Κεντρική Χίος",
      mood: "Κεραμική τέχνη",
      badges: ["Κεραμική", "Χειροτεχνία", "Πέτρινα σπίτια"],
      size: "normal",
    },
    {
      id: "lagada",
      name: "Λαγκάδα",
      title: "Λαγκάδα: παραθαλάσσιο χωριό και ψαροταβέρνες",
      description:
        "Η Λαγκάδα είναι γραφικό παραθαλάσσιο χωριό βορειοανατολικά της πόλης της Χίου, γνωστό για το λιμανάκι, τις ψαροταβέρνες και το χαλαρό τοπικό φαγητό.",
      image: villageImages.lagada,
      imageAlt: "Η Λαγκάδα στη Χίο με λιμανάκι και ψαροταβέρνες",
      href: "/el/xoria-xios/lagada-xios/",
      region: "Βορειοανατολική Χίος",
      mood: "Παραθαλάσσιο φαγητό",
      badges: ["Λιμάνι", "Ψαροταβέρνες", "Θάλασσα"],
      size: "wide",
    },
  ],
  planning: {
    kicker: "Τοπικές συμβουλές",
    title: "Πώς να οργανώσετε τις διαδρομές στα χωριά της Χίου",
    description:
      "Τα χωριά βρίσκονται σε διαφορετικά σημεία του νησιού, οπότε είναι καλύτερο να τα οργανώσετε ανά διαδρομή αντί να προσπαθήσετε να τα δείτε όλα σε μία μέρα.",
    items: [
      {
        icon: "🧭",
        title: "Ομαδοποιήστε τα χωριά ανά περιοχή",
        text:
          "Συνδυάστε Πυργί, Μεστά, Ολύμπους και Βέσσα σε μία νότια διαδρομή στα Μαστιχοχώρια.",
      },
      {
        icon: "🚗",
        title: "Χρησιμοποιήστε αυτοκίνητο",
        text:
          "Το αυτοκίνητο σας δίνει ευελιξία να συνδυάσετε χωριά, παραλίες και στάσεις για φαγητό χωρίς βιασύνη.",
      },
      {
        icon: "🍽️",
        title: "Αφήστε χρόνο για φαγητό",
        text:
          "Η Λαγκάδα, η Βολισσός και οι πλατείες των χωριών είναι ιδανικές για να χαλαρώσετε και να απολαύσετε τοπικές ταβέρνες.",
      },
    ],
  },
  stay: {
    kicker: "Μείνετε με τοπική καθοδήγηση",
    title: "Εξερευνήστε τα χωριά της Χίου από τον Κάμπο",
    text:
      "Το Voulamandis House σας δίνει ήσυχη βάση κοντά στην πόλη και το αεροδρόμιο, ενώ σας κρατά συνδεδεμένους με τις διαδρομές προς τα νότια Μαστιχοχώρια, τα παραθαλάσσια χωριά και τη βόρεια Χίο.",
    primaryCta: {
      label: "Δείτε δωμάτια",
      href: "/el/domatia-xios/",
    },
    secondaryCta: {
      label: "Δείτε τιμές",
      href: "/el/amesi-kratisi-voulamandis-house/",
    },
  },
};

export const chiosVillagesPageFr: ChiosVillagesPageData = {
  seo: {
    canonicalPath: "/fr/villages-de-chios/",
    title: "Villages de Chios | Villages médiévaux, villages du mastic et vie locale",
    description:
      "Explorez les plus beaux villages de Chios, de Pyrgi et Mesta à Vessa, Olympoi, Volissos, Armolia et Lagada.",
    ogImage: villageImages.lagada,
  },
  hero: {
    kicker: "Guide des villages de Chios",
    title: "Explorez les villages de Chios",
    description:
      "Découvrez des villages fortifiés médiévaux, la culture du mastic, les traditions de poterie, les tavernes de bord de mer et le caractère local authentique de Chios.",
    image: villageImages.lagada,
    primaryCta: {
      label: "Explorer les villages",
      href: "#villages",
    },
    secondaryCta: {
      label: "Séjourner à Kampos",
      href: "/fr/chambres-a-chios/",
    },
  },
  intro: {
    kicker: "Préparer vos itinéraires",
    title: "Une autre facette de Chios au-delà des plages",
    description:
      "Les villages de Chios révèlent l’histoire, l’architecture et la culture quotidienne de l’île. Au sud, les villages du mastic conservent des plans médiévaux fortifiés et des traditions décoratives uniques. Au nord et au bord de la mer, les villages offrent châteaux, oliveraies, ports de pêche et expériences culinaires locales.",
    tip: {
      icon: "🏡",
      title: "Votre base locale pour explorer les villages",
      text:
        "Voulamandis House à Kampos est un point de départ pratique pour découvrir les villages de Chios. Vous pouvez combiner villages du mastic, plages et ville de Chios tout en séjournant dans un quartier historique calme.",
      linkLabel: "Voir les chambres de Voulamandis House",
      href: "/fr/chambres-a-chios/",
    },
  },
  villages: [
    {
      id: "pyrgi",
      name: "Pyrgi",
      title: "Pyrgi : le village peint",
      description:
        "Pyrgi est l’un des villages les plus distinctifs de Chios, célèbre pour ses décorations géométriques noires et blanches sur les maisons et ses ruelles traditionnelles.",
      image: villageImages.pyrgi,
      imageAlt:
        "Village de Pyrgi à Chios avec décorations géométriques noires et blanches",
      href: "/fr/villages-de-chios/village-pyrgi/",
      region: "Sud de Chios",
      mood: "Tradition géométrique",
      badges: ["Village du mastic", "Maisons peintes", "Sud"],
      size: "large",
    },
    {
      id: "mesta",
      name: "Mesta",
      title: "Mesta : village fortifié médiéval",
      description:
        "Mesta est un village médiéval magnifiquement préservé, avec maisons en pierre, ruelles étroites, architecture défensive et forte atmosphère historique.",
      image: villageImages.mesta,
      imageAlt:
        "Village médiéval de Mesta à Chios avec ruelles en pierre",
      href: "/fr/villages-de-chios/village-mesta/",
      region: "Sud de Chios",
      mood: "Charme médiéval",
      badges: ["Village fortifié", "Ruelles en pierre", "Mastic"],
      size: "tall",
    },
    {
      id: "vessa",
      name: "Vessa",
      title: "Vessa : beauté médiévale paisible",
      description:
        "Vessa conserve une atmosphère médiévale plus calme, avec des rues bien préservées, des bâtiments de type tour et un rythme de village paisible.",
      image: villageImages.vessa,
      imageAlt:
        "Village médiéval de Vessa à Chios avec architecture traditionnelle en pierre",
      href: "/fr/villages-de-chios/village-vessa/",
      region: "Chios centrale",
      mood: "Histoire paisible",
      badges: ["Médiéval", "Traditionnel", "Paisible"],
      size: "normal",
    },
    {
      id: "olympoi",
      name: "Olympoi",
      title: "Olympoi",
      description:
        "Olympoi est un village traditionnel avec architecture historique, églises byzantines et caractère rural, proche de la région des villages du mastic.",
      image: villageImages.olympoi,
      imageAlt: "Village d’Olympoi à Chios avec architecture traditionnelle",
      href: "/fr/villages-de-chios/village-olympoi/",
      region: "Sud de Chios",
      mood: "Patrimoine rural",
      badges: ["Histoire", "Églises byzantines", "Campagne"],
      size: "normal",
    },
    {
      id: "volissos",
      name: "Volissos",
      title: "Volissos : château et vues au nord-ouest de Chios",
      description:
        "Volissos est le plus grand village du nord-ouest de Chios, connu pour son château médiéval, ses ruelles, ses oliveraies et ses vues côtières.",
      image: villageImages.volissos,
      imageAlt:
        "Village de Volissos au nord-ouest de Chios avec château et vues côtières",
      href: "/fr/villages-de-chios/village-volissos/",
      region: "Nord-ouest de Chios",
      mood: "Château & vues",
      badges: ["Château", "Nord-ouest", "Oliveraies"],
      size: "wide",
    },
    {
      id: "armolia",
      name: "Armolia",
      title: "Armolia : artisanat de poterie",
      description:
        "Armolia est connue pour sa tradition de poterie, ses maisons en pierre et son artisanat local, ce qui en fait une étape intéressante dans le sud de Chios.",
      image: villageImages.armolia,
      imageAlt: "Village d’Armolia à Chios connu pour la poterie",
      href: "/fr/villages-de-chios/village-armolia/",
      region: "Chios centrale",
      mood: "Artisanat de poterie",
      badges: ["Poterie", "Artisanat", "Maisons en pierre"],
      size: "normal",
    },
    {
      id: "lagada",
      name: "Lagada",
      title: "Lagada : village de bord de mer et tavernes de poisson",
      description:
        "Lagada est un village maritime pittoresque au nord-est de la ville de Chios, connu pour son port, ses tavernes de poisson et sa cuisine locale détendue.",
      image: villageImages.lagada,
      imageAlt: "Village de Lagada à Chios avec port et tavernes de poisson",
      href: "/fr/villages-de-chios/village-lagada/",
      region: "Nord-est de Chios",
      mood: "Cuisine de bord de mer",
      badges: ["Port", "Tavernes de poisson", "Mer"],
      size: "wide",
    },
  ],
  planning: {
    kicker: "Conseils locaux",
    title: "Comment organiser vos journées dans les villages de Chios",
    description:
      "Les villages sont répartis dans différentes parties de l’île. Il est donc préférable de les organiser par itinéraire plutôt que d’essayer de tout voir en une seule journée.",
    items: [
      {
        icon: "🧭",
        title: "Regroupez les villages par zone",
        text:
          "Combinez Pyrgi, Mesta, Olympoi et Vessa dans un même itinéraire au sud, autour des villages du mastic.",
      },
      {
        icon: "🚗",
        title: "Utilisez une voiture",
        text:
          "Une voiture vous donne la liberté de combiner villages, plages et arrêts gourmands sans vous presser.",
      },
      {
        icon: "🍽️",
        title: "Gardez du temps pour manger",
        text:
          "Lagada, Volissos et les places des villages sont idéales pour ralentir et profiter des tavernes locales.",
      },
    ],
  },
  stay: {
    kicker: "Séjour avec conseils locaux",
    title: "Explorez les villages de Chios depuis Kampos",
    text:
      "Voulamandis House vous offre une base calme près de la ville et de l’aéroport, tout en vous reliant facilement aux villages du mastic, aux villages de bord de mer et au nord de Chios.",
    primaryCta: {
      label: "Voir les chambres",
      href: "/fr/chambres-a-chios/",
    },
    secondaryCta: {
      label: "Voir les tarifs",
      href: "/fr/tarifs-des-hotels-a-chios/",
    },
  },
};

export const chiosVillagesPageDe: ChiosVillagesPageData = {
  seo: {
    canonicalPath: "/de/doerfer-chios/",
    title: "Dörfer auf Chios | Mittelalterliche Dörfer, Mastixdörfer & lokales Leben",
    description:
      "Entdecken Sie die schönsten Dörfer auf Chios, von Pyrgi und Mesta bis Vessa, Olympoi, Volissos, Armolia und Lagada.",
    ogImage: villageImages.lagada,
  },
  hero: {
    kicker: "Dorfführer für Chios",
    title: "Entdecken Sie die Dörfer von Chios",
    description:
      "Erleben Sie mittelalterliche Wehrdörfer, Mastixkultur, Keramiktraditionen, Tavernen am Meer und den authentischen lokalen Charakter der Insel.",
    image: villageImages.lagada,
    primaryCta: {
      label: "Dörfer entdecken",
      href: "#villages",
    },
    secondaryCta: {
      label: "In Kampos übernachten",
      href: "/de/chios-zimmer/",
    },
  },
  intro: {
    kicker: "Dorfplanung",
    title: "Eine andere Seite von Chios jenseits der Strände",
    description:
      "Die Dörfer von Chios zeigen Geschichte, Architektur und Alltagskultur der Insel. Im Süden bewahren die Mastixdörfer mittelalterliche Grundrisse und einzigartige Dekorationstraditionen. Im Norden und am Meer bieten Dörfer Burgen, Olivenlandschaften, Fischerhäfen und entspannte lokale Küche.",
    tip: {
      icon: "🏡",
      title: "Ihre lokale Basis für Dorfrouten",
      text:
        "Voulamandis House in Kampos ist ein praktischer Ausgangspunkt, um die Dörfer von Chios zu erkunden. Sie können südliche Mastixdörfer, Strände und Chios-Stadt kombinieren und in einer ruhigen historischen Gegend wohnen.",
      linkLabel: "Zimmer im Voulamandis House ansehen",
      href: "/de/chios-zimmer/",
    },
  },
  villages: [
    {
      id: "pyrgi",
      name: "Pyrgi",
      title: "Pyrgi: das bemalte Dorf",
      description:
        "Pyrgi ist eines der markantesten Dörfer auf Chios, berühmt für seine schwarz-weißen geometrischen Hausverzierungen und engen traditionellen Gassen.",
      image: villageImages.pyrgi,
      imageAlt:
        "Pyrgi Dorf auf Chios mit schwarz-weißen geometrischen Hausverzierungen",
      href: "/de/doerfer-chios/pyrgi-dorf/",
      region: "Süd-Chios",
      mood: "Geometrische Tradition",
      badges: ["Mastixdorf", "Bemalte Häuser", "Süden"],
      size: "large",
    },
    {
      id: "mesta",
      name: "Mesta",
      title: "Mesta: mittelalterliches Wehrdorf",
      description:
        "Mesta ist ein wunderschön erhaltenes mittelalterliches Dorf mit Steinhäusern, engen Gassen, Verteidigungsarchitektur und starkem Geschichtsgefühl.",
      image: villageImages.mesta,
      imageAlt:
        "Mesta auf Chios mit Steingassen und mittelalterlicher Architektur",
      href: "/de/doerfer-chios/mesta-dorf/",
      region: "Süd-Chios",
      mood: "Mittelalterlicher Charme",
      badges: ["Wehrdorf", "Steingassen", "Mastix"],
      size: "tall",
    },
    {
      id: "vessa",
      name: "Vessa",
      title: "Vessa: stille mittelalterliche Schönheit",
      description:
        "Vessa bewahrt eine ruhigere mittelalterliche Atmosphäre, mit gut erhaltenen Straßen, turmartigen Gebäuden und einem friedlichen Dorfrhythmus.",
      image: villageImages.vessa,
      imageAlt:
        "Vessa Dorf auf Chios mit traditioneller Steinarchitektur",
      href: "/de/doerfer-chios/vessa-dorf/",
      region: "Zentral-Chios",
      mood: "Stille Geschichte",
      badges: ["Mittelalterlich", "Traditionell", "Ruhig"],
      size: "normal",
    },
    {
      id: "olympoi",
      name: "Olympoi",
      title: "Olympoi",
      description:
        "Olympoi ist ein traditionelles Dorf mit historischer Architektur, byzantinischen Kirchen und ländlichem Charakter nahe der Mastixdörfer.",
      image: villageImages.olympoi,
      imageAlt: "Olympoi Dorf auf Chios mit traditioneller Architektur",
      href: "/de/doerfer-chios/olympoi-dorf/",
      region: "Süd-Chios",
      mood: "Ländliches Erbe",
      badges: ["Geschichte", "Byzantinische Kirchen", "Landschaft"],
      size: "normal",
    },
    {
      id: "volissos",
      name: "Volissos",
      title: "Volissos: Burgblick im Nordwesten von Chios",
      description:
        "Volissos ist das größte Dorf im Nordwesten von Chios, bekannt für seine mittelalterliche Burg, engen Straßen, Olivenlandschaften und Küstenblicke.",
      image: villageImages.volissos,
      imageAlt:
        "Volissos Dorf im Nordwesten von Chios mit Burg und Küstenblick",
      href: "/de/doerfer-chios/volissos-dorf/",
      region: "Nordwest-Chios",
      mood: "Burg & Aussicht",
      badges: ["Burg", "Nordwesten", "Olivenlandschaft"],
      size: "wide",
    },
    {
      id: "armolia",
      name: "Armolia",
      title: "Armolia: Keramikhandwerk",
      description:
        "Armolia ist bekannt für seine Keramiktradition, Steinhäuser und lokales Handwerk und ist ein sinnvoller Stopp auf einer Südroute.",
      image: villageImages.armolia,
      imageAlt: "Armolia Dorf auf Chios, bekannt für Keramikhandwerk",
      href: "/de/doerfer-chios/armolia-dorf/",
      region: "Zentral-Chios",
      mood: "Keramikhandwerk",
      badges: ["Keramik", "Handwerk", "Steinhäuser"],
      size: "normal",
    },
    {
      id: "lagada",
      name: "Lagada",
      title: "Lagada: Dorf am Meer und Fischtavernen",
      description:
        "Lagada ist ein malerisches Küstendorf nordöstlich von Chios-Stadt, bekannt für Hafenblicke, Fischtavernen und entspannte lokale Küche.",
      image: villageImages.lagada,
      imageAlt: "Lagada Dorf auf Chios mit Hafen und Fischtavernen",
      href: "/de/doerfer-chios/lagada-dorf/",
      region: "Nordost-Chios",
      mood: "Essen am Meer",
      badges: ["Hafen", "Fischtavernen", "Küste"],
      size: "wide",
    },
  ],
  planning: {
    kicker: "Lokale Planungstipps",
    title: "So planen Sie Ihre Dorftage auf Chios",
    description:
      "Die Dörfer liegen in verschiedenen Teilen der Insel. Planen Sie sie besser nach Routen, statt alles an einem Tag sehen zu wollen.",
    items: [
      {
        icon: "🧭",
        title: "Dörfer nach Region gruppieren",
        text:
          "Kombinieren Sie Pyrgi, Mesta, Olympoi und Vessa in einer Südroute durch die Mastixdörfer.",
      },
      {
        icon: "🚗",
        title: "Auto nutzen",
        text:
          "Ein Auto gibt Ihnen Flexibilität, Dörfer, Strände und Essensstopps ohne Eile zu kombinieren.",
      },
      {
        icon: "🍽️",
        title: "Zeit fürs Essen lassen",
        text:
          "Lagada, Volissos und die Dorfplätze sind ideal, um langsamer zu werden und lokale Tavernen zu genießen.",
      },
    ],
  },
  stay: {
    kicker: "Übernachten mit lokalen Tipps",
    title: "Entdecken Sie Chios-Dörfer von Kampos aus",
    text:
      "Voulamandis House bietet Ihnen eine ruhige Basis nahe Chios-Stadt und Flughafen und verbindet Sie zugleich mit Routen zu südlichen Mastixdörfern, Küstendörfern und Nord-Chios.",
    primaryCta: {
      label: "Zimmer ansehen",
      href: "/de/chios-zimmer/",
    },
    secondaryCta: {
      label: "Preise ansehen",
      href: "/de/hotelpreise-auf-der-insel-chios/",
    },
  },
};

export const chiosVillagesPageIt: ChiosVillagesPageData = {
  seo: {
    canonicalPath: "/it/villaggi-chios/",
    title: "Villaggi di Chios | Villaggi medievali, mastice e vita locale",
    description:
      "Scopri i villaggi più belli di Chios, da Pyrgi e Mesta a Vessa, Olympoi, Volissos, Armolia e Lagada.",
    ogImage: villageImages.lagada,
  },
  hero: {
    kicker: "Guida ai villaggi di Chios",
    title: "Esplora i villaggi di Chios",
    description:
      "Scopri villaggi fortificati medievali, cultura del mastice, tradizioni ceramiche, taverne sul mare e l’autentico carattere locale di Chios.",
    image: villageImages.lagada,
    primaryCta: {
      label: "Esplora i villaggi",
      href: "#villages",
    },
    secondaryCta: {
      label: "Soggiorna a Kampos",
      href: "/it/camere-a-chios/",
    },
  },
  intro: {
    kicker: "Organizzare gli itinerari",
    title: "Un lato diverso di Chios oltre le spiagge",
    description:
      "I villaggi di Chios rivelano la storia, l’architettura e la cultura quotidiana dell’isola. A sud, i villaggi del mastice conservano impianti medievali fortificati e tradizioni decorative uniche. A nord e sul mare, i villaggi offrono castelli, uliveti, porti di pesca e cucina locale rilassata.",
    tip: {
      icon: "🏡",
      title: "La tua base locale per gli itinerari nei villaggi",
      text:
        "Voulamandis House a Kampos è un punto di partenza pratico per esplorare i villaggi di Chios. Puoi combinare villaggi del mastice, spiagge e città di Chios soggiornando in una zona storica tranquilla.",
      linkLabel: "Vedi le camere di Voulamandis House",
      href: "/it/camere-a-chios/",
    },
  },
  villages: [
    {
      id: "pyrgi",
      name: "Pyrgi",
      title: "Pyrgi: il villaggio dipinto",
      description:
        "Pyrgi è uno dei villaggi più caratteristici di Chios, famoso per le decorazioni geometriche bianche e nere sulle case e le strette vie tradizionali.",
      image: villageImages.pyrgi,
      imageAlt:
        "Villaggio di Pyrgi a Chios con decorazioni geometriche bianche e nere",
      href: "/it/villaggi-chios/villaggio-pyrgi/",
      region: "Chios meridionale",
      mood: "Tradizione geometrica",
      badges: ["Villaggio del mastice", "Case dipinte", "Sud"],
      size: "large",
    },
    {
      id: "mesta",
      name: "Mesta",
      title: "Mesta: villaggio fortificato medievale",
      description:
        "Mesta è un villaggio medievale splendidamente conservato con case in pietra, vicoli stretti, architettura difensiva e forte senso della storia.",
      image: villageImages.mesta,
      imageAlt:
        "Villaggio medievale di Mesta a Chios con vicoli in pietra",
      href: "/it/villaggi-chios/villaggio-mesta/",
      region: "Chios meridionale",
      mood: "Fascino medievale",
      badges: ["Villaggio fortificato", "Vicoli in pietra", "Mastice"],
      size: "tall",
    },
    {
      id: "vessa",
      name: "Vessa",
      title: "Vessa: tranquilla bellezza medievale",
      description:
        "Vessa conserva un’atmosfera medievale più tranquilla, con strade ben conservate, edifici simili a torri e un ritmo di villaggio pacifico.",
      image: villageImages.vessa,
      imageAlt:
        "Villaggio di Vessa a Chios con architettura tradizionale in pietra",
      href: "/it/villaggi-chios/villaggio-vessa/",
      region: "Chios centrale",
      mood: "Storia tranquilla",
      badges: ["Medievale", "Tradizionale", "Tranquillo"],
      size: "normal",
    },
    {
      id: "olympoi",
      name: "Olympoi",
      title: "Olympoi",
      description:
        "Olympoi è un villaggio tradizionale con architettura storica, chiese bizantine e carattere rurale vicino alla zona dei villaggi del mastice.",
      image: villageImages.olympoi,
      imageAlt: "Villaggio di Olympoi a Chios con architettura tradizionale",
      href: "/it/villaggi-chios/villaggio-olympoi/",
      region: "Chios meridionale",
      mood: "Patrimonio rurale",
      badges: ["Storia", "Chiese bizantine", "Campagna"],
      size: "normal",
    },
    {
      id: "volissos",
      name: "Volissos",
      title: "Volissos: castello e viste nel nord-ovest di Chios",
      description:
        "Volissos è il villaggio più grande del nord-ovest di Chios, noto per il castello medievale, le strade strette, gli uliveti e le viste sulla costa.",
      image: villageImages.volissos,
      imageAlt:
        "Villaggio di Volissos nel nord-ovest di Chios con castello e viste sul mare",
      href: "/it/villaggi-chios/villaggio-volissos/",
      region: "Nord-ovest di Chios",
      mood: "Castello e viste",
      badges: ["Castello", "Nord-ovest", "Uliveti"],
      size: "wide",
    },
    {
      id: "armolia",
      name: "Armolia",
      title: "Armolia: artigianato della ceramica",
      description:
        "Armolia è nota per la tradizione ceramica, le case in pietra e l’artigianato locale, rendendola una tappa significativa in un itinerario del sud.",
      image: villageImages.armolia,
      imageAlt: "Villaggio di Armolia a Chios noto per la ceramica",
      href: "/it/villaggi-chios/villaggio-armolia/",
      region: "Chios centrale",
      mood: "Artigianato ceramico",
      badges: ["Ceramica", "Artigianato", "Case in pietra"],
      size: "normal",
    },
    {
      id: "lagada",
      name: "Lagada",
      title: "Lagada: villaggio sul mare e taverne di pesce",
      description:
        "Lagada è un pittoresco villaggio sul mare a nord-est della città di Chios, noto per il porto, le taverne di pesce e la cucina locale rilassata.",
      image: villageImages.lagada,
      imageAlt: "Villaggio di Lagada a Chios con porto e taverne di pesce",
      href: "/it/villaggi-chios/villaggio-lagada/",
      region: "Nord-est di Chios",
      mood: "Cibo sul mare",
      badges: ["Porto", "Taverne di pesce", "Mare"],
      size: "wide",
    },
  ],
  planning: {
    kicker: "Consigli locali",
    title: "Come organizzare le giornate nei villaggi di Chios",
    description:
      "I villaggi sono distribuiti in diverse parti dell’isola, quindi è meglio organizzarli per itinerario invece di provare a vedere tutto in un solo giorno.",
    items: [
      {
        icon: "🧭",
        title: "Raggruppa i villaggi per zona",
        text:
          "Combina Pyrgi, Mesta, Olympoi e Vessa in un unico itinerario a sud tra i villaggi del mastice.",
      },
      {
        icon: "🚗",
        title: "Usa un’auto",
        text:
          "Un’auto ti offre flessibilità per combinare villaggi, spiagge e soste gastronomiche senza fretta.",
      },
      {
        icon: "🍽️",
        title: "Lascia tempo per mangiare",
        text:
          "Lagada, Volissos e le piazze dei villaggi sono ideali per rallentare e godersi le taverne locali.",
      },
    ],
  },
  stay: {
    kicker: "Soggiorna con consigli locali",
    title: "Esplora i villaggi di Chios da Kampos",
    text:
      "Voulamandis House ti offre una base tranquilla vicino alla città e all’aeroporto, restando ben collegata ai villaggi del mastice, ai villaggi sul mare e al nord di Chios.",
    primaryCta: {
      label: "Vedi le camere",
      href: "/it/camere-a-chios/",
    },
    secondaryCta: {
      label: "Vedi i prezzi",
      href: "/it/prezzi-hotel-chios/",
    },
  },
};

export const chiosVillagesPageEs: ChiosVillagesPageData = {
  seo: {
    canonicalPath: "/es/pueblos-chios/",
    title: "Pueblos de Chios | Pueblos medievales, mastiha y vida local",
    description:
      "Explora los pueblos más bonitos de Chios, desde Pyrgi y Mesta hasta Vessa, Olympoi, Volissos, Armolia y Lagada.",
    ogImage: villageImages.lagada,
  },
  hero: {
    kicker: "Guía de pueblos de Chios",
    title: "Explora los pueblos de Chios",
    description:
      "Descubre pueblos fortificados medievales, cultura del mastiha, tradiciones de cerámica, tabernas junto al mar y el carácter local auténtico de Chios.",
    image: villageImages.lagada,
    primaryCta: {
      label: "Explorar pueblos",
      href: "#villages",
    },
    secondaryCta: {
      label: "Alojarse en Kampos",
      href: "/es/habitaciones-en-chios/",
    },
  },
  intro: {
    kicker: "Planificación de pueblos",
    title: "Otro lado de Chios más allá de las playas",
    description:
      "Los pueblos de Chios revelan la historia, la arquitectura y la cultura cotidiana de la isla. En el sur, los pueblos del mastiha conservan trazados medievales fortificados y tradiciones decorativas únicas. En el norte y junto al mar, los pueblos ofrecen castillos, olivares, puertos pesqueros y gastronomía local tranquila.",
    tip: {
      icon: "🏡",
      title: "Tu base local para rutas por pueblos",
      text:
        "Voulamandis House en Kampos es un punto de partida práctico para explorar los pueblos de Chios. Puedes combinar pueblos del mastiha, playas y la ciudad de Chios mientras te alojas en una zona histórica tranquila.",
      linkLabel: "Ver habitaciones en Voulamandis House",
      href: "/es/habitaciones-en-chios/",
    },
  },
  villages: [
    {
      id: "pyrgi",
      name: "Pyrgi",
      title: "Pyrgi: el pueblo pintado",
      description:
        "Pyrgi es uno de los pueblos más distintivos de Chios, famoso por sus decoraciones geométricas negras y blancas en las casas y sus estrechas calles tradicionales.",
      image: villageImages.pyrgi,
      imageAlt:
        "Pueblo de Pyrgi en Chios con decoraciones geométricas negras y blancas",
      href: "/es/pueblos-chios/pueblo-pyrgi/",
      region: "Sur de Chios",
      mood: "Tradición geométrica",
      badges: ["Pueblo del mastiha", "Casas pintadas", "Sur"],
      size: "large",
    },
    {
      id: "mesta",
      name: "Mesta",
      title: "Mesta: pueblo fortaleza medieval",
      description:
        "Mesta es un pueblo medieval bellamente conservado con casas de piedra, callejones estrechos, arquitectura defensiva y una fuerte sensación de historia.",
      image: villageImages.mesta,
      imageAlt:
        "Pueblo medieval de Mesta en Chios con callejones de piedra",
      href: "/es/pueblos-chios/pueblo-mesta/",
      region: "Sur de Chios",
      mood: "Encanto medieval",
      badges: ["Pueblo fortaleza", "Callejones de piedra", "Mastiha"],
      size: "tall",
    },
    {
      id: "vessa",
      name: "Vessa",
      title: "Vessa: belleza medieval tranquila",
      description:
        "Vessa conserva una atmósfera medieval más tranquila, con calles bien conservadas, edificios tipo torre y un ritmo de pueblo apacible.",
      image: villageImages.vessa,
      imageAlt:
        "Pueblo medieval de Vessa en Chios con arquitectura tradicional de piedra",
      href: "/es/pueblos-chios/pueblo-vessa/",
      region: "Chios central",
      mood: "Historia tranquila",
      badges: ["Medieval", "Tradicional", "Tranquilo"],
      size: "normal",
    },
    {
      id: "olympoi",
      name: "Olympoi",
      title: "Olympoi",
      description:
        "Olympoi es un pueblo tradicional con arquitectura histórica, iglesias bizantinas y carácter rural cerca de la zona de los pueblos del mastiha.",
      image: villageImages.olympoi,
      imageAlt: "Pueblo de Olympoi en Chios con arquitectura tradicional",
      href: "/es/pueblos-chios/pueblo-olympoi/",
      region: "Sur de Chios",
      mood: "Patrimonio rural",
      badges: ["Historia", "Iglesias bizantinas", "Campo"],
      size: "normal",
    },
    {
      id: "volissos",
      name: "Volissos",
      title: "Volissos: castillo y vistas en el noroeste de Chios",
      description:
        "Volissos es el pueblo más grande del noroeste de Chios, conocido por su castillo medieval, calles estrechas, olivares y vistas a la costa.",
      image: villageImages.volissos,
      imageAlt:
        "Pueblo de Volissos en el noroeste de Chios con castillo y vistas al mar",
      href: "/es/pueblos-chios/pueblo-volissos/",
      region: "Noroeste de Chios",
      mood: "Castillo y vistas",
      badges: ["Castillo", "Noroeste", "Olivares"],
      size: "wide",
    },
    {
      id: "armolia",
      name: "Armolia",
      title: "Armolia: artesanía de cerámica",
      description:
        "Armolia es conocido por su tradición de cerámica, sus casas de piedra y la artesanía local, por lo que es una parada significativa en una ruta por el sur.",
      image: villageImages.armolia,
      imageAlt: "Pueblo de Armolia en Chios conocido por la cerámica",
      href: "/es/pueblos-chios/pueblo-armolia/",
      region: "Chios central",
      mood: "Artesanía de cerámica",
      badges: ["Cerámica", "Artesanía", "Casas de piedra"],
      size: "normal",
    },
    {
      id: "lagada",
      name: "Lagada",
      title: "Lagada: pueblo costero y tabernas de pescado",
      description:
        "Lagada es un pintoresco pueblo costero al noreste de la ciudad de Chios, conocido por su puerto, tabernas de pescado y comida local relajada.",
      image: villageImages.lagada,
      imageAlt: "Pueblo de Lagada en Chios con puerto y tabernas de pescado",
      href: "/es/pueblos-chios/pueblo-lagada/",
      region: "Noreste de Chios",
      mood: "Comida junto al mar",
      badges: ["Puerto", "Tabernas de pescado", "Mar"],
      size: "wide",
    },
  ],
  planning: {
    kicker: "Consejos locales",
    title: "Cómo planificar tus días por los pueblos de Chios",
    description:
      "Los pueblos están repartidos por distintas zonas de la isla, por lo que es mejor organizarlos por rutas en lugar de intentar verlo todo en un solo día.",
    items: [
      {
        icon: "🧭",
        title: "Agrupa los pueblos por zona",
        text:
          "Combina Pyrgi, Mesta, Olympoi y Vessa en una ruta por los pueblos del mastiha del sur.",
      },
      {
        icon: "🚗",
        title: "Usa coche",
        text:
          "Un coche te da flexibilidad para combinar pueblos, playas y paradas para comer sin prisas.",
      },
      {
        icon: "🍽️",
        title: "Deja tiempo para comer",
        text:
          "Lagada, Volissos y las plazas de los pueblos son ideales para bajar el ritmo y disfrutar de tabernas locales.",
      },
    ],
  },
  stay: {
    kicker: "Alojamiento con consejos locales",
    title: "Explora los pueblos de Chios desde Kampos",
    text:
      "Voulamandis House te ofrece una base tranquila cerca de la ciudad y el aeropuerto, manteniéndote conectado con las rutas hacia los pueblos del mastiha, los pueblos costeros y el norte de Chios.",
    primaryCta: {
      label: "Ver habitaciones",
      href: "/es/habitaciones-en-chios/",
    },
    secondaryCta: {
      label: "Ver precios",
      href: "/es/los-mejores-precios-de-hotel-en-la-isla-chios/",
    },
  },
};

export const chiosVillagesPageTr: ChiosVillagesPageData = {
  seo: {
    canonicalPath: "/tr/sakiz-adasi-koyleri/",
    title: "Sakız Adası Köyleri | Orta Çağ köyleri, mastik köyleri ve yerel yaşam",
    description:
      "Sakız Adası’nın en güzel köylerini keşfedin: Pyrgi, Mesta, Vessa, Olympoi, Volissos, Armolia ve Lagada.",
    ogImage: villageImages.lagada,
  },
  hero: {
    kicker: "Sakız Adası köy rehberi",
    title: "Sakız Adası’nın köylerini keşfedin",
    description:
      "Orta Çağ kale köylerini, mastik kültürünü, seramik geleneklerini, sahil tavernalarını ve Sakız Adası’nın otantik yerel karakterini keşfedin.",
    image: villageImages.lagada,
    primaryCta: {
      label: "Köyleri keşfet",
      href: "#villages",
    },
    secondaryCta: {
      label: "Kampos’ta konakla",
      href: "/tr/sakiz-adasi-odalari/",
    },
  },
  intro: {
    kicker: "Köy rotası planlama",
    title: "Plajların ötesinde Sakız Adası’nın farklı yüzü",
    description:
      "Sakız Adası köyleri adanın tarihini, mimarisini ve günlük kültürünü gösterir. Güneyde mastik köyleri Orta Çağ savunma planlarını ve benzersiz süsleme geleneklerini korur. Kuzeyde ve deniz kenarında köyler kale manzaraları, zeytinlikler, balıkçı limanları ve sakin yerel yemek deneyimleri sunar.",
    tip: {
      icon: "🏡",
      title: "Köy rotaları için yerel üssünüz",
      text:
        "Kampos’taki Voulamandis House, Sakız Adası köylerini keşfetmek için pratik bir başlangıç noktasıdır. Güney mastik köylerini, plajları ve Sakız şehir rotalarını sakin tarihi bir bölgede konaklayarak birleştirebilirsiniz.",
      linkLabel: "Voulamandis House odalarını görüntüleyin",
      href: "/tr/sakiz-adasi-odalari/",
    },
  },
  villages: [
    {
      id: "pyrgi",
      name: "Pyrgi",
      title: "Pyrgi: boyalı köy",
      description:
        "Pyrgi, Sakız Adası’nın en karakteristik köylerinden biridir; siyah-beyaz geometrik ev süslemeleri ve dar geleneksel sokaklarıyla ünlüdür.",
      image: villageImages.pyrgi,
      imageAlt:
        "Sakız Adası Pyrgi Köyü siyah beyaz geometrik ev süslemeleri",
      href: "/tr/sakiz-adasi-koyleri/pyrgi-koyu/",
      region: "Güney Sakız",
      mood: "Geometrik gelenek",
      badges: ["Mastik köyü", "Boyalı evler", "Güney"],
      size: "large",
    },
    {
      id: "mesta",
      name: "Mesta",
      title: "Mesta: Orta Çağ kale köyü",
      description:
        "Mesta, taş evleri, dar sokakları, savunma mimarisi ve güçlü tarih duygusuyla güzel korunmuş bir Orta Çağ köyüdür.",
      image: villageImages.mesta,
      imageAlt:
        "Sakız Adası Mesta Orta Çağ köyü taş sokaklar",
      href: "/tr/sakiz-adasi-koyleri/mesta-koyu/",
      region: "Güney Sakız",
      mood: "Orta Çağ atmosferi",
      badges: ["Kale köyü", "Taş sokaklar", "Mastik"],
      size: "tall",
    },
    {
      id: "vessa",
      name: "Vessa",
      title: "Vessa: sakin Orta Çağ güzelliği",
      description:
        "Vessa, iyi korunmuş sokakları, kule benzeri yapıları ve huzurlu köy ritmiyle daha sakin bir Orta Çağ atmosferi taşır.",
      image: villageImages.vessa,
      imageAlt:
        "Sakız Adası Vessa Köyü geleneksel taş mimari",
      href: "/tr/sakiz-adasi-koyleri/vessa-koyu/",
      region: "Orta Sakız",
      mood: "Sakin tarih",
      badges: ["Orta Çağ", "Geleneksel", "Huzurlu"],
      size: "normal",
    },
    {
      id: "olympoi",
      name: "Olympoi",
      title: "Olympoi",
      description:
        "Olympoi, tarihi mimarisi, Bizans kiliseleri ve mastik köyleri bölgesine yakın kırsal karakteriyle geleneksel bir köydür.",
      image: villageImages.olympoi,
      imageAlt: "Sakız Adası Olympoi Köyü geleneksel mimari",
      href: "/tr/sakiz-adasi-koyleri/olympoi-koyu/",
      region: "Güney Sakız",
      mood: "Kırsal miras",
      badges: ["Tarih", "Bizans kiliseleri", "Kırsal"],
      size: "normal",
    },
    {
      id: "volissos",
      name: "Volissos",
      title: "Volissos: kuzeybatı Sakız’da kale manzaraları",
      description:
        "Volissos, Orta Çağ kalesi, dar sokakları, zeytinlikleri ve kıyı manzaralarıyla bilinen kuzeybatı Sakız’ın en büyük köyüdür.",
      image: villageImages.volissos,
      imageAlt:
        "Kuzeybatı Sakız Volissos Köyü kale ve deniz manzarası",
      href: "/tr/sakiz-adasi-koyleri/volissos-koyu/",
      region: "Kuzeybatı Sakız",
      mood: "Kale ve manzara",
      badges: ["Kale", "Kuzeybatı", "Zeytinlikler"],
      size: "wide",
    },
    {
      id: "armolia",
      name: "Armolia",
      title: "Armolia: seramik zanaati",
      description:
        "Armolia, seramik geleneği, taş evleri ve yerel el sanatlarıyla bilinir; güney Sakız rotasında anlamlı bir duraktır.",
      image: villageImages.armolia,
      imageAlt: "Sakız Adası Armolia Köyü seramik zanaati",
      href: "/tr/sakiz-adasi-koyleri/armolia-koyu/",
      region: "Orta Sakız",
      mood: "Seramik zanaati",
      badges: ["Seramik", "El sanatı", "Taş evler"],
      size: "normal",
    },
    {
      id: "lagada",
      name: "Lagada",
      title: "Lagada: sahil köyü ve balık tavernaları",
      description:
        "Lagada, Sakız şehir merkezinin kuzeydoğusunda, liman manzaraları, balık tavernaları ve rahat yerel yemekleriyle bilinen pitoresk bir sahil köyüdür.",
      image: villageImages.lagada,
      imageAlt: "Sakız Adası Lagada Köyü liman ve balık tavernaları",
      href: "/tr/sakiz-adasi-koyleri/lagada-koyu/",
      region: "Kuzeydoğu Sakız",
      mood: "Deniz kenarı yemek",
      badges: ["Liman", "Balık tavernaları", "Sahil"],
      size: "wide",
    },
  ],
  planning: {
    kicker: "Yerel planlama önerileri",
    title: "Sakız Adası köy günlerinizi nasıl planlarsınız",
    description:
      "Köyler adanın farklı bölgelerine yayılmıştır; bu yüzden hepsini tek günde görmeye çalışmak yerine rotalara göre planlamak daha iyidir.",
    items: [
      {
        icon: "🧭",
        title: "Köyleri bölgeye göre gruplayın",
        text:
          "Pyrgi, Mesta, Olympoi ve Vessa’yı güney mastik köyleri rotasında birleştirin.",
      },
      {
        icon: "🚗",
        title: "Araba kullanın",
        text:
          "Araba, köyleri, plajları ve yemek duraklarını acele etmeden birleştirme özgürlüğü verir.",
      },
      {
        icon: "🍽️",
        title: "Yemek için zaman ayırın",
        text:
          "Lagada, Volissos ve köy meydanları yavaşlamak ve yerel tavernaların tadını çıkarmak için idealdir.",
      },
    ],
  },
  stay: {
    kicker: "Yerel tavsiyelerle konaklayın",
    title: "Sakız köylerini Kampos’tan keşfedin",
    text:
      "Voulamandis House, şehir ve havaalanına yakın sakin bir üs sunarken, güney mastik köyleri, sahil köyleri ve kuzey Sakız rotalarına kolay bağlantı sağlar.",
    primaryCta: {
      label: "Odaları görüntüle",
      href: "/tr/sakiz-adasi-odalari/",
    },
    secondaryCta: {
      label: "Fiyatları kontrol et",
      href: "/tr/sakiz-adasi-rezervasyon/",
    },
  },
};

export const localizedChiosVillagesPages: ChiosVillagesPageData[] = [
  chiosVillagesPageEl,
  chiosVillagesPageFr,
  chiosVillagesPageDe,
  chiosVillagesPageIt,
  chiosVillagesPageEs,
  chiosVillagesPageTr,
];

export const chiosVillagesPages: ChiosVillagesPageData[] = [
  chiosVillagesPageEn,
  ...localizedChiosVillagesPages,
];

export function getLocalizedChiosVillagesPageByPath(
  path: string,
): ChiosVillagesPageData | undefined {
  return chiosVillagesPages.find((page) => page.seo.canonicalPath === path);
}