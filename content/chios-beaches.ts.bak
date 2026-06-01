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

const beachImages = {
  mavraVolia:
    "https://chioshotel.gr/wp-content/uploads/2021/12/emporios3-e1702727598897.webp",
  agiaFotia: "https://chioshotel.gr/wp-content/uploads/2026/02/agia-fotia.jpg",
  komi:
    "https://chioshotel.gr/wp-content/uploads/2021/12/42ba5ae2ff96d99dfb12b1e06fa90b45-e1703437426681.webp",
  salagona:
    "https://chioshotel.gr/wp-content/uploads/2021/12/salagona-e1645969502155.webp",
  lithi:
    "https://chioshotel.gr/wp-content/uploads/2021/12/2017-06-28-1024x768.webp",
  agiaDynami:
    "https://chioshotel.gr/wp-content/uploads/2021/12/691-e1645969589226.webp",
  avlonia:
    "https://chioshotel.gr/wp-content/uploads/2021/12/avlonia-1024x768.webp",
  lefkathia: "https://chioshotel.gr/wp-content/uploads/2026/03/lefkathia-2.jpg",
  nagos:
    "https://chioshotel.gr/wp-content/uploads/2021/12/nagos-e1645969566121.webp",
};

export const chiosBeachesPageEn: ChiosBeachesPageData = {
  seo: {
    canonicalPath: "/chios/chios-beaches/",
    title: "Top Chios Beaches | Best Beaches in Chios Island Guide",
    description:
      "Discover the best beaches in Chios, from Mavra Volia and Agia Fotia to Komi, Lithi, Agia Dynami, Lefkathia and hidden turquoise coves.",
    ogImage: beachImages.mavraVolia,
  },
  hero: {
    kicker: "Chios beach guide",
    title: "Top beaches of Chios",
    description:
      "An insider coastal guide to volcanic shores, emerald coves, family-friendly sandy beaches and the best swimming spots around Chios Island.",
    image: beachImages.mavraVolia,
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
      image: beachImages.mavraVolia,
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
      image: beachImages.agiaFotia,
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
      image: beachImages.komi,
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
      image: beachImages.salagona,
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
      image: beachImages.lithi,
      imageAlt:
        "Lithi Beach in western Chios with shallow sandy waters, ideal for families",
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
      image: beachImages.agiaDynami,
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
      image: beachImages.avlonia,
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
      image: beachImages.lefkathia,
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
      image: beachImages.nagos,
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

export const chiosBeachesPageEl: ChiosBeachesPageData = {
  seo: {
    canonicalPath: "/el/paralies-xios/",
    title: "Παραλίες Χίου | Οδηγός για τις καλύτερες παραλίες της Χίου",
    description:
      "Ανακαλύψτε τις καλύτερες παραλίες της Χίου, από τα Μαύρα Βόλια και την Αγία Φωτιά μέχρι την Κώμη, το Λιθί, την Αγία Δύναμη και τους κρυφούς τιρκουάζ κόλπους.",
    ogImage: beachImages.mavraVolia,
  },
  hero: {
    kicker: "Οδηγός παραλιών Χίου",
    title: "Οι καλύτερες παραλίες της Χίου",
    description:
      "Ένας τοπικός οδηγός για ηφαιστειακές ακτές, σμαραγδένιους όρμους, οικογενειακές αμμώδεις παραλίες και τα καλύτερα σημεία για μπάνιο στη Χίο.",
    image: beachImages.mavraVolia,
    primaryCta: {
      label: "Δείτε τις παραλίες",
      href: "#beaches",
    },
    secondaryCta: {
      label: "Μείνετε στον Κάμπο",
      href: "/el/domatia-xios/",
    },
  },
  intro: {
    kicker: "Οργάνωση παραλιών",
    title: "Διαλέξτε την κατάλληλη παραλία για κάθε μέρα",
    description:
      "Η Χίος έχει μια ακτογραμμή γεμάτη αντιθέσεις: μαύρα ηφαιστειακά βότσαλα στο νότο, αμμώδεις οικογενειακές παραλίες στα δυτικά, ζωντανά beach bars, ήσυχους όρμους και βαθιά γαλάζια νερά στο βορρά. Η καλύτερη επιλογή εξαρτάται από τη διάθεση, τη διαδρομή και τον άνεμο της ημέρας.",
    tip: {
      icon: "🗺️",
      title: "Η στρατηγική σας βάση στο νησί",
      text:
        "Για να οργανώσετε σωστά τις παραλίες της Χίου, κάντε το Voulamandis House στον Κάμπο τη βάση σας. Η τοπική μας ομάδα μπορεί να σας βοηθήσει να επιλέξετε παραλίες ανάλογα με τον καιρό, τη διαδρομή και τη μέρα που θέλετε.",
      linkLabel: "Δείτε τα δωμάτια στο Voulamandis House",
      href: "/el/domatia-xios/",
    },
  },
  beaches: [
    {
      id: "mavra-volia",
      name: "Μαύρα Βόλια",
      title: "Μαύρα Βόλια: τα εμβληματικά μαύρα βότσαλα",
      description:
        "Η πιο επιβλητική παραλία της Χίου. Τα βαθιά, καθαρά νερά συναντούν τα μαύρα ηφαιστειακά βότσαλα, δημιουργώντας ένα από τα πιο αξέχαστα τοπία του νησιού.",
      image: beachImages.mavraVolia,
      imageAlt: "Παραλία Μαύρα Βόλια στη Χίο με μαύρα ηφαιστειακά βότσαλα",
      href: "/el/paralies-xios/paralia-mavra-volia/",
      region: "Νότια Χίος",
      mood: "Ηφαιστειακό τοπίο",
      badges: ["Κορυφαία επιλογή", "Νότια", "Ηφαιστειακή"],
      size: "large",
    },
    {
      id: "agia-fotia",
      name: "Αγία Φωτιά",
      title: "Αγία Φωτιά",
      description:
        "Δημοφιλής παραλία με βαθιά κρυστάλλινα νερά, κοντά στον ιστορικό Κάμπο και ιδανική για εύκολη ημερήσια βουτιά από το Voulamandis House.",
      image: beachImages.agiaFotia,
      imageAlt: "Παραλία Αγία Φωτιά στη Χίο με καθαρά βαθιά νερά",
      href: "/el/paralies-xios/paralia-agia-fotia/",
      region: "Ανατολική Χίος",
      mood: "Δημοφιλές μπάνιο",
      badges: ["Δημοφιλής", "Ανατολικά", "Βαθιά νερά"],
      size: "tall",
    },
    {
      id: "komi",
      name: "Κώμη",
      title: "Παραλία Κώμη",
      description:
        "Η καρδιά της καλοκαιρινής ζωής της Χίου, με χρυσή άμμο, beach bars και χαλαρή κοσμοπολίτικη ατμόσφαιρα.",
      image: beachImages.komi,
      imageAlt: "Παραλία Κώμη στη Χίο με χρυσή άμμο και beach bars",
      href: "/el/paralies-xios/paralia-komi/",
      region: "Νότια Χίος",
      mood: "Κοσμοπολίτικη",
      badges: ["Αμμώδης", "Beach bars", "Καλοκαιρινή ζωή"],
      size: "normal",
    },
    {
      id: "salagona",
      name: "Σαλάγωνα",
      title: "Σαλάγωνα",
      description:
        "Ένας απομονωμένος τιρκουάζ κόλπος, ιδανικός για snorkeling και ήσυχες μέρες μακριά από τα πιο πολυσύχναστα σημεία του νησιού.",
      image: beachImages.salagona,
      imageAlt: "Παραλία Σαλάγωνα στη Χίο, απομονωμένος τιρκουάζ κόλπος",
      href: "/el/paralies-xios/paralia-salagona/",
      region: "Νότια Χίος",
      mood: "Κρυμμένος θησαυρός",
      badges: ["Κρυφή", "Snorkeling", "Τιρκουάζ"],
      size: "normal",
    },
    {
      id: "lithi",
      name: "Λιθί",
      title: "Παραλία Λιθί: ιδανική για οικογένειες",
      description:
        "Ρηχά αμμώδη νερά και ψαροταβέρνες πάνω στη θάλασσα κάνουν το Λιθί μία από τις καλύτερες οικογενειακές επιλογές για μπάνιο στη Χίο.",
      image: beachImages.lithi,
      imageAlt: "Παραλία Λιθί στη δυτική Χίο με ρηχά αμμώδη νερά",
      href: "/el/paralies-xios/paralia-lithi/",
      region: "Δυτική Χίος",
      mood: "Οικογενειακή",
      badges: ["Δυτικά", "Ρηχά", "Ψαροταβέρνες"],
      size: "wide",
    },
    {
      id: "agia-dynami",
      name: "Αγία Δύναμη",
      title: "Αγία Δύναμη",
      description:
        "Ένας από τους πιο εξωτικούς και φωτογενείς όρμους της Χίου, με σμαραγδένια νερά και ήσυχη, απομακρυσμένη ατμόσφαιρα.",
      image: beachImages.agiaDynami,
      imageAlt: "Παραλία Αγία Δύναμη στη Χίο με σμαραγδένια νερά",
      href: "/el/paralies-xios/paralia-agia-dynami/",
      region: "Νότια Χίος",
      mood: "Εξωτικός όρμος",
      badges: ["Εξωτική", "Νότια", "Σμαραγδένια νερά"],
      size: "wide",
    },
    {
      id: "avlonia",
      name: "Αυλωνιά",
      title: "Αυλωνιά",
      description:
        "Προστατευμένος κόλπος με ήρεμα νερά, ιδανικός για μια πιο αργή, χαλαρή μέρα στην παραλία.",
      image: beachImages.avlonia,
      imageAlt: "Παραλία Αυλωνιά στη Χίο με ήρεμα νερά",
      href: "/el/paralies-xios/paralia-avlonia/",
      region: "Νότια Χίος",
      mood: "Ηρεμία",
      badges: ["Ήρεμα νερά", "Προστατευμένη", "Χαλαρή"],
      size: "normal",
    },
    {
      id: "lefkathia",
      name: "Λευκάθια",
      title: "Λευκάθια",
      description:
        "Βόρεια παραλία με βαθιά γαλάζια νερά και νεανική καλοκαιρινή ατμόσφαιρα, κοντά στη Βολισσό.",
      image: beachImages.lefkathia,
      imageAlt: "Παραλία Λευκάθια στη Χίο με βαθιά γαλάζια νερά",
      href: "/el/paralies-xios/paralia-lefkathia/",
      region: "Βόρεια Χίος",
      mood: "Νεανική ατμόσφαιρα",
      badges: ["Βόρεια", "Βαθύ μπλε", "Καλοκαιρινή ατμόσφαιρα"],
      size: "normal",
    },
    {
      id: "nagos",
      name: "Ναγός",
      title: "Ναγός: καταπράσινο τοπίο",
      description:
        "Μια μοναδική βόρεια παραλία όπου τρεχούμενα νερά, παλιά δέντρα και πολύχρωμα βότσαλα συναντούν το Αιγαίο.",
      image: beachImages.nagos,
      imageAlt: "Παραλία Ναγός στη βόρεια Χίο με πηγές και βότσαλα",
      href: "/el/paralies-xios/paralia-nagos/",
      region: "Βόρεια Χίος",
      mood: "Φύση",
      badges: ["Βόρεια", "Πηγές", "Πράσινο τοπίο"],
      size: "wide",
    },
  ],
  planning: {
    kicker: "Τοπικές συμβουλές",
    title: "Πώς να οργανώσετε τις μέρες σας στις παραλίες της Χίου",
    description:
      "Η ακτογραμμή είναι διαφορετική από περιοχή σε περιοχή, οπότε η καλύτερη παραλία εξαρτάται από τη διαδρομή, τον άνεμο και το αν θέλετε φαγητό, ρηχά νερά, ήσυχους όρμους ή εντυπωσιακό τοπίο.",
    items: [
      {
        icon: "🌬️",
        title: "Ελέγξτε τον άνεμο",
        text:
          "Κάποιες παραλίες είναι καλύτερες από άλλες όταν φυσάει. Ρωτήστε τοπικά πριν οδηγήσετε μακριά.",
      },
      {
        icon: "🚗",
        title: "Νοικιάστε αυτοκίνητο",
        text:
          "Οι καλύτερες παραλίες της Χίου είναι απλωμένες σε όλο το νησί, οπότε το αυτοκίνητο κάνει το beach hopping πολύ πιο εύκολο.",
      },
      {
        icon: "👨‍👩‍👧",
        title: "Ταιριάξτε την παραλία με τη μέρα σας",
        text:
          "Διαλέξτε Λιθί για οικογένειες, Κώμη για ζωή στην παραλία, Μαύρα Βόλια για τοπίο και Αγία Δύναμη για εξωτικά νερά.",
      },
    ],
  },
  stay: {
    kicker: "Μείνετε με τοπική καθοδήγηση",
    title: "Ξεκινήστε τις μέρες στην παραλία από τον Κάμπο",
    text:
      "Το Voulamandis House είναι πρακτική βάση για να εξερευνήσετε τις παραλίες της Χίου, με εύκολη πρόσβαση στην πόλη, το αεροδρόμιο, τις διαδρομές προς τη νότια Χίο και την ανατολική ακτή.",
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

export const chiosBeachesPageFr: ChiosBeachesPageData = {
  seo: {
    canonicalPath: "/fr/plages-de-chios/",
    title: "Plages de Chios | Guide des plus belles plages de Chios",
    description:
      "Découvrez les plus belles plages de Chios, de Mavra Volia et Agia Fotia à Komi, Lithi, Agia Dynami, Lefkathia et aux criques turquoise cachées.",
    ogImage: beachImages.mavraVolia,
  },
  hero: {
    kicker: "Guide des plages de Chios",
    title: "Les plus belles plages de Chios",
    description:
      "Un guide local du littoral de Chios : rivages volcaniques, criques émeraude, plages de sable pour les familles et les meilleurs endroits pour se baigner.",
    image: beachImages.mavraVolia,
    primaryCta: {
      label: "Explorer les plages",
      href: "#beaches",
    },
    secondaryCta: {
      label: "Séjourner à Kampos",
      href: "/fr/chambres-a-chios/",
    },
  },
  intro: {
    kicker: "Préparer vos journées plage",
    title: "Choisissez la bonne plage pour chaque journée",
    description:
      "Le littoral de Chios est plein de contrastes : galets volcaniques noirs au sud, plages de sable familiales à l’ouest, beach bars animés, criques tranquilles et eaux bleu profond au nord. La meilleure plage dépend souvent de votre humeur, de votre itinéraire et du vent du jour.",
    tip: {
      icon: "🗺️",
      title: "Votre base stratégique sur l’île",
      text:
        "Pour bien organiser vos plages à Chios, faites de Voulamandis House à Kampos votre base. Notre équipe locale peut vous aider à choisir les plages selon la météo, votre route et le type de journée que vous souhaitez.",
      linkLabel: "Voir les chambres de Voulamandis House",
      href: "/fr/chambres-a-chios/",
    },
  },
  beaches: [
    {
      id: "mavra-volia",
      name: "Mavra Volia",
      title: "Mavra Volia : les célèbres galets noirs",
      description:
        "La plage la plus impressionnante de Chios. Ses eaux profondes et limpides contrastent avec les galets volcaniques noirs, créant l’un des paysages les plus mémorables de l’île.",
      image: beachImages.mavraVolia,
      imageAlt: "Plage de Mavra Volia à Chios avec galets volcaniques noirs",
      href: "/fr/plages-de-chios/plage-mavra-volia/",
      region: "Sud de Chios",
      mood: "Paysage volcanique",
      badges: ["Incontournable", "Sud", "Volcanique"],
      size: "large",
    },
    {
      id: "agia-fotia",
      name: "Agia Fotia",
      title: "Agia Fotia",
      description:
        "Une plage populaire aux eaux profondes et cristallines, proche de Kampos et idéale pour une baignade facile depuis Voulamandis House.",
      image: beachImages.agiaFotia,
      imageAlt: "Plage d’Agia Fotia à Chios avec eaux cristallines",
      href: "/fr/plages-de-chios/plage-agia-fotia/",
      region: "Est de Chios",
      mood: "Baignade populaire",
      badges: ["Populaire", "Est", "Eaux profondes"],
      size: "tall",
    },
    {
      id: "komi",
      name: "Komi",
      title: "Plage de Komi",
      description:
        "Le cœur de la vie estivale de Chios, avec du sable doré, des beach bars et une atmosphère cosmopolite détendue.",
      image: beachImages.komi,
      imageAlt: "Plage de Komi à Chios avec sable doré et beach bars",
      href: "/fr/plages-de-chios/plage-komi/",
      region: "Sud de Chios",
      mood: "Cosmopolite",
      badges: ["Sable", "Beach bars", "Vie d’été"],
      size: "normal",
    },
    {
      id: "salagona",
      name: "Salagona",
      title: "Salagona",
      description:
        "Une baie turquoise isolée, parfaite pour le snorkeling et les journées plage plus calmes, loin des zones les plus fréquentées.",
      image: beachImages.salagona,
      imageAlt: "Plage de Salagona à Chios, baie turquoise isolée",
      href: "/fr/plages-de-chios/plage-salagona/",
      region: "Sud de Chios",
      mood: "Trésor caché",
      badges: ["Cachée", "Snorkeling", "Turquoise"],
      size: "normal",
    },
    {
      id: "lithi",
      name: "Lithi",
      title: "Plage de Lithi : idéale pour les familles",
      description:
        "Des eaux peu profondes, du sable et des tavernes de fruits de mer au bord de l’eau font de Lithi l’un des meilleurs choix pour les familles.",
      image: beachImages.lithi,
      imageAlt: "Plage de Lithi à Chios avec eaux peu profondes",
      href: "/fr/plages-de-chios/plage-lithi/",
      region: "Ouest de Chios",
      mood: "Familiale",
      badges: ["Ouest", "Peu profonde", "Tavernes de poisson"],
      size: "wide",
    },
    {
      id: "agia-dynami",
      name: "Agia Dynami",
      title: "Agia Dynami",
      description:
        "L’une des criques les plus exotiques et photogéniques de Chios, avec des eaux émeraude et une atmosphère calme et isolée.",
      image: beachImages.agiaDynami,
      imageAlt: "Plage Agia Dynami à Chios avec eaux émeraude",
      href: "/fr/plages-de-chios/plage-agia-dynami/",
      region: "Sud de Chios",
      mood: "Crique exotique",
      badges: ["Exotique", "Sud", "Eaux émeraude"],
      size: "wide",
    },
    {
      id: "avlonia",
      name: "Avlonia",
      title: "Avlonia",
      description:
        "Une baie abritée aux eaux calmes, idéale pour une journée plus lente et une baignade détendue.",
      image: beachImages.avlonia,
      imageAlt: "Plage d’Avlonia à Chios avec eaux calmes",
      href: "/fr/plages-de-chios/plage-avlonia/",
      region: "Sud de Chios",
      mood: "Sérénité",
      badges: ["Eaux calmes", "Abritée", "Détente"],
      size: "normal",
    },
    {
      id: "lefkathia",
      name: "Lefkathia",
      title: "Lefkathia",
      description:
        "Une plage du nord aux eaux bleu profond et à l’ambiance estivale jeune, proche de Volissos.",
      image: beachImages.lefkathia,
      imageAlt: "Plage de Lefkathia à Chios avec eaux bleu profond",
      href: "/fr/plages-de-chios/plage-lefkathia/",
      region: "Nord de Chios",
      mood: "Ambiance jeune",
      badges: ["Nord", "Bleu profond", "Ambiance d’été"],
      size: "normal",
    },
    {
      id: "nagos",
      name: "Nagos",
      title: "Nagos : paysage verdoyant",
      description:
        "Une plage unique du nord où les eaux des sources, les arbres anciens et les galets colorés rencontrent la mer Égée.",
      image: beachImages.nagos,
      imageAlt: "Plage de Nagos au nord de Chios avec sources et galets",
      href: "/fr/plages-de-chios/plage-nagos/",
      region: "Nord de Chios",
      mood: "Nature",
      badges: ["Nord", "Sources", "Paysage vert"],
      size: "wide",
    },
  ],
  planning: {
    kicker: "Conseils locaux",
    title: "Comment organiser vos journées plage à Chios",
    description:
      "Le littoral varie beaucoup, donc le meilleur choix dépend de votre route, du vent et de vos envies : restaurants, eaux peu profondes, criques tranquilles ou paysages spectaculaires.",
    items: [
      {
        icon: "🌬️",
        title: "Vérifiez le vent",
        text:
          "Certaines plages sont meilleures que d’autres les jours de vent. Demandez conseil localement avant de conduire loin.",
      },
      {
        icon: "🚗",
        title: "Louez une voiture",
        text:
          "Les plus belles plages de Chios sont réparties sur toute l’île, donc une voiture facilite beaucoup les déplacements.",
      },
      {
        icon: "👨‍👩‍👧",
        title: "Adaptez la plage à votre journée",
        text:
          "Choisissez Lithi pour les familles, Komi pour l’ambiance plage, Mavra Volia pour le paysage et Agia Dynami pour les eaux exotiques.",
      },
    ],
  },
  stay: {
    kicker: "Séjour avec conseils locaux",
    title: "Commencez vos journées plage depuis Kampos",
    text:
      "Voulamandis House est une base pratique pour explorer les plages de Chios, avec un accès facile à la ville, à l’aéroport, aux routes du sud et à la côte est.",
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

export const chiosBeachesPageDe: ChiosBeachesPageData = {
  seo: {
    canonicalPath: "/de/straende-chios/",
    title: "Strände auf Chios | Reiseführer zu den schönsten Stränden",
    description:
      "Entdecken Sie die schönsten Strände auf Chios, von Mavra Volia und Agia Fotia bis Komi, Lithi, Agia Dynami, Lefkathia und versteckten türkisfarbenen Buchten.",
    ogImage: beachImages.mavraVolia,
  },
  hero: {
    kicker: "Strandführer für Chios",
    title: "Die schönsten Strände auf Chios",
    description:
      "Ein lokaler Küstenführer zu vulkanischen Stränden, smaragdgrünen Buchten, familienfreundlichen Sandstränden und den besten Badeplätzen auf Chios.",
    image: beachImages.mavraVolia,
    primaryCta: {
      label: "Strände entdecken",
      href: "#beaches",
    },
    secondaryCta: {
      label: "In Kampos übernachten",
      href: "/de/chios-zimmer/",
    },
  },
  intro: {
    kicker: "Strandplanung",
    title: "Wählen Sie für jeden Tag den passenden Strand",
    description:
      "Die Küste von Chios ist voller Kontraste: schwarze vulkanische Kiesel im Süden, familienfreundliche Sandstrände im Westen, lebhafte Beach Bars, ruhige Buchten und tiefblaues Wasser im Norden. Der beste Strand hängt oft von Stimmung, Route und Windrichtung ab.",
    tip: {
      icon: "🗺️",
      title: "Ihre strategische Inselbasis",
      text:
        "Um Ihre Strandtage auf Chios gut zu planen, machen Sie Voulamandis House in Kampos zu Ihrer Basis. Unser lokales Team hilft Ihnen gern, Strände nach Wetter, Route und gewünschter Tagesstimmung auszuwählen.",
      linkLabel: "Zimmer im Voulamandis House ansehen",
      href: "/de/chios-zimmer/",
    },
  },
  beaches: [
    {
      id: "mavra-volia",
      name: "Mavra Volia",
      title: "Mavra Volia: die berühmten schwarzen Kiesel",
      description:
        "Der eindrucksvollste Strand von Chios. Tiefes, klares Wasser trifft auf dramatische schwarze vulkanische Kiesel und schafft eine der unvergesslichsten Landschaften der Insel.",
      image: beachImages.mavraVolia,
      imageAlt: "Mavra Volia Strand auf Chios mit schwarzen vulkanischen Kieseln",
      href: "/de/straende-chios/mavra-volia-strand/",
      region: "Süd-Chios",
      mood: "Vulkanische Landschaft",
      badges: ["Top-Empfehlung", "Süden", "Vulkanisch"],
      size: "large",
    },
    {
      id: "agia-fotia",
      name: "Agia Fotia",
      title: "Agia Fotia",
      description:
        "Ein beliebter Strand mit tiefem, kristallklarem Wasser, nahe dem historischen Kampos und ideal für einen unkomplizierten Badetag ab Voulamandis House.",
      image: beachImages.agiaFotia,
      imageAlt: "Agia Fotia Strand auf Chios mit kristallklarem Wasser",
      href: "/de/straende-chios/agia-fotia-strand/",
      region: "Ost-Chios",
      mood: "Beliebtes Baden",
      badges: ["Beliebt", "Osten", "Tiefes Wasser"],
      size: "tall",
    },
    {
      id: "komi",
      name: "Komi",
      title: "Komi Strand",
      description:
        "Das Herz des Sommerlebens auf Chios, mit goldenem Sand, Beach Bars und entspannter kosmopolitischer Atmosphäre.",
      image: beachImages.komi,
      imageAlt: "Komi Strand auf Chios mit goldenem Sand und Beach Bars",
      href: "/de/straende-chios/komi-strand/",
      region: "Süd-Chios",
      mood: "Kosmopolitisch",
      badges: ["Sand", "Beach Bars", "Sommerleben"],
      size: "normal",
    },
    {
      id: "salagona",
      name: "Salagona",
      title: "Salagona",
      description:
        "Eine abgelegene türkisfarbene Bucht, perfekt zum Schnorcheln und für ruhigere Strandtage fernab der belebtesten Orte.",
      image: beachImages.salagona,
      imageAlt: "Salagona Strand auf Chios, abgelegene türkisfarbene Bucht",
      href: "/de/straende-chios/salagona-strand/",
      region: "Süd-Chios",
      mood: "Verstecktes Juwel",
      badges: ["Versteckt", "Schnorcheln", "Türkis"],
      size: "normal",
    },
    {
      id: "lithi",
      name: "Lithi",
      title: "Lithi Strand: ideal für Familien",
      description:
        "Flaches Sandwasser und Fischtavernen direkt am Ufer machen Lithi zu einer der besten familienfreundlichen Strandoptionen auf Chios.",
      image: beachImages.lithi,
      imageAlt: "Lithi Strand im Westen von Chios mit flachem Sandwasser",
      href: "/de/straende-chios/lithi-strand/",
      region: "West-Chios",
      mood: "Familienfreundlich",
      badges: ["Westen", "Flach", "Fischtavernen"],
      size: "wide",
    },
    {
      id: "agia-dynami",
      name: "Agia Dynami",
      title: "Agia Dynami",
      description:
        "Eine der exotischsten und fotogensten Buchten von Chios, mit smaragdgrünem Wasser und ruhiger, abgelegener Atmosphäre.",
      image: beachImages.agiaDynami,
      imageAlt: "Agia Dynami Strand auf Chios mit smaragdgrünem Wasser",
      href: "/de/straende-chios/agia-dynami-strand/",
      region: "Süd-Chios",
      mood: "Exotische Bucht",
      badges: ["Exotisch", "Süden", "Smaragdgrün"],
      size: "wide",
    },
    {
      id: "avlonia",
      name: "Avlonia",
      title: "Avlonia",
      description:
        "Eine geschützte Bucht mit ruhigem Wasser, ideal für einen langsameren Strandtag und entspanntes Schwimmen.",
      image: beachImages.avlonia,
      imageAlt: "Avlonia Strand auf Chios mit ruhigem Wasser",
      href: "/de/straende-chios/avlonia-strand/",
      region: "Süd-Chios",
      mood: "Ruhe",
      badges: ["Ruhiges Wasser", "Geschützt", "Entspannt"],
      size: "normal",
    },
    {
      id: "lefkathia",
      name: "Lefkathia",
      title: "Lefkathia",
      description:
        "Ein Strand im Norden mit tiefblauem Wasser und junger Sommerstimmung, nahe Volissos.",
      image: beachImages.lefkathia,
      imageAlt: "Lefkathia Strand auf Chios mit tiefblauem Wasser",
      href: "/de/straende-chios/lefkathia-strand/",
      region: "Nord-Chios",
      mood: "Junge Atmosphäre",
      badges: ["Norden", "Tiefblau", "Sommerstimmung"],
      size: "normal",
    },
    {
      id: "nagos",
      name: "Nagos",
      title: "Nagos: grüne Landschaft",
      description:
        "Ein einzigartiger Strand im Norden, wo Quellwasser, alte Bäume und farbige Kiesel auf die Ägäis treffen.",
      image: beachImages.nagos,
      imageAlt: "Nagos Strand im Norden von Chios mit Quellen und Kieseln",
      href: "/de/straende-chios/nagos-strand/",
      region: "Nord-Chios",
      mood: "Natur",
      badges: ["Norden", "Quellen", "Grüne Landschaft"],
      size: "wide",
    },
  ],
  planning: {
    kicker: "Lokale Planungstipps",
    title: "So planen Sie Ihre Strandtage auf Chios",
    description:
      "Die Küste ist sehr abwechslungsreich. Die beste Wahl hängt von Route, Wind und Ihren Wünschen ab: Restaurants, flaches Wasser, ruhige Buchten oder dramatische Landschaft.",
    items: [
      {
        icon: "🌬️",
        title: "Wind prüfen",
        text:
          "Manche Strände sind an windigen Tagen besser als andere. Fragen Sie vor längeren Fahrten vor Ort nach.",
      },
      {
        icon: "🚗",
        title: "Auto mieten",
        text:
          "Die besten Strände von Chios liegen über die Insel verteilt, daher macht ein Auto Strand-Hopping deutlich einfacher.",
      },
      {
        icon: "👨‍👩‍👧",
        title: "Strand passend zum Tag wählen",
        text:
          "Wählen Sie Lithi für Familien, Komi für Strandleben, Mavra Volia für Landschaft und Agia Dynami für exotisches Wasser.",
      },
    ],
  },
  stay: {
    kicker: "Übernachten mit lokalen Tipps",
    title: "Starten Sie Ihre Strandtage von Kampos",
    text:
      "Voulamandis House ist eine praktische Basis, um die Strände von Chios zu erkunden, mit einfachem Zugang zur Stadt, zum Flughafen, zu den Südrouten und zur Ostküste.",
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

export const chiosBeachesPageIt: ChiosBeachesPageData = {
  seo: {
    canonicalPath: "/it/spiagge-chios/",
    title: "Spiagge di Chios | Guida alle migliori spiagge dell’isola",
    description:
      "Scopri le migliori spiagge di Chios, da Mavra Volia e Agia Fotia a Komi, Lithi, Agia Dynami, Lefkathia e le baie turchesi nascoste.",
    ogImage: beachImages.mavraVolia,
  },
  hero: {
    kicker: "Guida alle spiagge di Chios",
    title: "Le migliori spiagge di Chios",
    description:
      "Una guida locale alla costa di Chios: spiagge vulcaniche, baie smeraldo, spiagge sabbiose per famiglie e i migliori luoghi per nuotare sull’isola.",
    image: beachImages.mavraVolia,
    primaryCta: {
      label: "Esplora le spiagge",
      href: "#beaches",
    },
    secondaryCta: {
      label: "Soggiorna a Kampos",
      href: "/it/camere-a-chios/",
    },
  },
  intro: {
    kicker: "Organizzare le giornate al mare",
    title: "Scegli la spiaggia giusta per ogni giornata",
    description:
      "La costa di Chios è ricca di contrasti: ciottoli vulcanici neri a sud, spiagge sabbiose per famiglie a ovest, beach bar vivaci, baie tranquille e acque blu profonde a nord. La spiaggia migliore dipende spesso dall’umore, dall’itinerario e dal vento del giorno.",
    tip: {
      icon: "🗺️",
      title: "La tua base strategica sull’isola",
      text:
        "Per organizzare al meglio le spiagge di Chios, fai di Voulamandis House a Kampos la tua base. Il nostro team locale può aiutarti a scegliere le spiagge in base al meteo, al percorso e al tipo di giornata che desideri.",
      linkLabel: "Vedi le camere di Voulamandis House",
      href: "/it/camere-a-chios/",
    },
  },
  beaches: [
    {
      id: "mavra-volia",
      name: "Mavra Volia",
      title: "Mavra Volia: gli iconici ciottoli neri",
      description:
        "La spiaggia più imponente di Chios. Acque profonde e cristalline contrastano con i drammatici ciottoli vulcanici neri, creando uno dei paesaggi più memorabili dell’isola.",
      image: beachImages.mavraVolia,
      imageAlt: "Spiaggia di Mavra Volia a Chios con ciottoli vulcanici neri",
      href: "/it/spiagge-chios/spiaggia-mavra-volia/",
      region: "Chios meridionale",
      mood: "Paesaggio vulcanico",
      badges: ["Scelta top", "Sud", "Vulcanica"],
      size: "large",
    },
    {
      id: "agia-fotia",
      name: "Agia Fotia",
      title: "Agia Fotia",
      description:
        "Una spiaggia popolare con acque profonde e cristalline, vicina alla storica zona di Kampos e ideale per una giornata di mare facile da Voulamandis House.",
      image: beachImages.agiaFotia,
      imageAlt: "Spiaggia di Agia Fotia a Chios con acque cristalline",
      href: "/it/spiagge-chios/spiaggia-agia-fotia/",
      region: "Chios orientale",
      mood: "Bagno popolare",
      badges: ["Popolare", "Est", "Acque profonde"],
      size: "tall",
    },
    {
      id: "komi",
      name: "Komi",
      title: "Spiaggia di Komi",
      description:
        "Il cuore della vita estiva di Chios, con sabbia dorata, beach bar e un’atmosfera cosmopolita rilassata.",
      image: beachImages.komi,
      imageAlt: "Spiaggia di Komi a Chios con sabbia dorata e beach bar",
      href: "/it/spiagge-chios/spiaggia-komi/",
      region: "Chios meridionale",
      mood: "Cosmopolita",
      badges: ["Sabbia", "Beach bar", "Vita estiva"],
      size: "normal",
    },
    {
      id: "salagona",
      name: "Salagona",
      title: "Salagona",
      description:
        "Una baia turchese isolata, perfetta per lo snorkeling e per giornate al mare più tranquille, lontano dalle zone più affollate.",
      image: beachImages.salagona,
      imageAlt: "Spiaggia di Salagona a Chios, baia turchese isolata",
      href: "/it/spiagge-chios/spiaggia-salagona/",
      region: "Chios meridionale",
      mood: "Gemma nascosta",
      badges: ["Nascosta", "Snorkeling", "Turchese"],
      size: "normal",
    },
    {
      id: "lithi",
      name: "Lithi",
      title: "Spiaggia di Lithi: ideale per famiglie",
      description:
        "Acque basse e sabbiose e taverne di pesce sulla riva rendono Lithi una delle migliori scelte per famiglie a Chios.",
      image: beachImages.lithi,
      imageAlt: "Spiaggia di Lithi a Chios occidentale con acque basse",
      href: "/it/spiagge-chios/spiaggia-lithi/",
      region: "Chios occidentale",
      mood: "Per famiglie",
      badges: ["Ovest", "Acque basse", "Taverne di pesce"],
      size: "wide",
    },
    {
      id: "agia-dynami",
      name: "Agia Dynami",
      title: "Agia Dynami",
      description:
        "Una delle baie più esotiche e fotogeniche di Chios, con acque color smeraldo e un’atmosfera tranquilla e appartata.",
      image: beachImages.agiaDynami,
      imageAlt: "Spiaggia di Agia Dynami a Chios con acque smeraldo",
      href: "/it/spiagge-chios/spiaggia-agia-dynami/",
      region: "Chios meridionale",
      mood: "Baia esotica",
      badges: ["Esotica", "Sud", "Acque smeraldo"],
      size: "wide",
    },
    {
      id: "avlonia",
      name: "Avlonia",
      title: "Avlonia",
      description:
        "Una baia riparata con acque calme, ideale per una giornata al mare più lenta e per nuotare in relax.",
      image: beachImages.avlonia,
      imageAlt: "Spiaggia di Avlonia a Chios con acque calme",
      href: "/it/spiagge-chios/spiaggia-avlonia/",
      region: "Chios meridionale",
      mood: "Serenità",
      badges: ["Acque calme", "Riparata", "Relax"],
      size: "normal",
    },
    {
      id: "lefkathia",
      name: "Lefkathia",
      title: "Lefkathia",
      description:
        "Una spiaggia del nord con acque blu profonde e un’atmosfera estiva giovane, vicino a Volissos.",
      image: beachImages.lefkathia,
      imageAlt: "Spiaggia di Lefkathia a Chios con acque blu profonde",
      href: "/it/spiagge-chios/spiaggia-lefkathia/",
      region: "Chios settentrionale",
      mood: "Atmosfera giovane",
      badges: ["Nord", "Blu profondo", "Atmosfera estiva"],
      size: "normal",
    },
    {
      id: "nagos",
      name: "Nagos",
      title: "Nagos: paesaggio verde",
      description:
        "Una spiaggia unica del nord dove acque sorgive, alberi antichi e ciottoli colorati incontrano il Mar Egeo.",
      image: beachImages.nagos,
      imageAlt: "Spiaggia di Nagos nel nord di Chios con sorgenti e ciottoli",
      href: "/it/spiagge-chios/spiaggia-nagos/",
      region: "Chios settentrionale",
      mood: "Natura",
      badges: ["Nord", "Sorgenti", "Paesaggio verde"],
      size: "wide",
    },
  ],
  planning: {
    kicker: "Consigli locali",
    title: "Come organizzare le tue giornate in spiaggia a Chios",
    description:
      "La costa è molto varia, quindi la scelta migliore dipende dal percorso, dal vento e da ciò che desideri: ristoranti, acque basse, baie tranquille o paesaggi spettacolari.",
    items: [
      {
        icon: "🌬️",
        title: "Controlla il vento",
        text:
          "Alcune spiagge sono migliori di altre nelle giornate ventose. Chiedi consigli locali prima di guidare lontano.",
      },
      {
        icon: "🚗",
        title: "Noleggia un’auto",
        text:
          "Le migliori spiagge di Chios sono distribuite su tutta l’isola, quindi un’auto rende molto più facile esplorarle.",
      },
      {
        icon: "👨‍👩‍👧",
        title: "Abbina la spiaggia alla tua giornata",
        text:
          "Scegli Lithi per le famiglie, Komi per la vita da spiaggia, Mavra Volia per il paesaggio e Agia Dynami per le acque esotiche.",
      },
    ],
  },
  stay: {
    kicker: "Soggiorna con consigli locali",
    title: "Inizia le tue giornate al mare da Kampos",
    text:
      "Voulamandis House è una base pratica per esplorare le spiagge di Chios, con facile accesso alla città, all’aeroporto, alle rotte verso sud e alla costa orientale.",
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

export const chiosBeachesPageEs: ChiosBeachesPageData = {
  seo: {
    canonicalPath: "/es/playas-chios/",
    title: "Playas de Chios | Guía de las mejores playas de Chios",
    description:
      "Descubre las mejores playas de Chios, desde Mavra Volia y Agia Fotia hasta Komi, Lithi, Agia Dynami, Lefkathia y calas turquesas escondidas.",
    ogImage: beachImages.mavraVolia,
  },
  hero: {
    kicker: "Guía de playas de Chios",
    title: "Las mejores playas de Chios",
    description:
      "Una guía local de la costa de Chios: playas volcánicas, calas esmeralda, playas de arena para familias y los mejores lugares para bañarse en la isla.",
    image: beachImages.mavraVolia,
    primaryCta: {
      label: "Explorar playas",
      href: "#beaches",
    },
    secondaryCta: {
      label: "Alojarse en Kampos",
      href: "/es/habitaciones-en-chios/",
    },
  },
  intro: {
    kicker: "Planificación de playas",
    title: "Elige la playa adecuada para cada día",
    description:
      "La costa de Chios está llena de contrastes: guijarros volcánicos negros en el sur, playas de arena familiares en el oeste, beach bars animados, calas tranquilas y aguas azul profundo en el norte. La mejor playa suele depender de tu plan, tu ruta y el viento del día.",
    tip: {
      icon: "🗺️",
      title: "Tu base estratégica en la isla",
      text:
        "Para organizar bien tus días de playa en Chios, haz de Voulamandis House en Kampos tu base. Nuestro equipo local puede ayudarte a elegir playas según el tiempo, la ruta y el tipo de día que buscas.",
      linkLabel: "Ver habitaciones en Voulamandis House",
      href: "/es/habitaciones-en-chios/",
    },
  },
  beaches: [
    {
      id: "mavra-volia",
      name: "Mavra Volia",
      title: "Mavra Volia: los icónicos guijarros negros",
      description:
        "La playa más imponente de Chios. Sus aguas profundas y cristalinas contrastan con los dramáticos guijarros volcánicos negros, creando uno de los paisajes más memorables de la isla.",
      image: beachImages.mavraVolia,
      imageAlt: "Playa Mavra Volia en Chios con guijarros volcánicos negros",
      href: "/es/playas-chios/playa-mavra-volia/",
      region: "Sur de Chios",
      mood: "Paisaje volcánico",
      badges: ["Imprescindible", "Sur", "Volcánica"],
      size: "large",
    },
    {
      id: "agia-fotia",
      name: "Agia Fotia",
      title: "Agia Fotia",
      description:
        "Una playa popular con aguas profundas y cristalinas, cerca de la zona histórica de Kampos e ideal para un día de baño fácil desde Voulamandis House.",
      image: beachImages.agiaFotia,
      imageAlt: "Playa Agia Fotia en Chios con aguas cristalinas",
      href: "/es/playas-chios/playa-agia-fotia/",
      region: "Este de Chios",
      mood: "Baño popular",
      badges: ["Popular", "Este", "Aguas profundas"],
      size: "tall",
    },
    {
      id: "komi",
      name: "Komi",
      title: "Playa de Komi",
      description:
        "El corazón de la vida veraniega de Chios, con arena dorada, beach bars y un ambiente cosmopolita relajado.",
      image: beachImages.komi,
      imageAlt: "Playa de Komi en Chios con arena dorada y beach bars",
      href: "/es/playas-chios/playa-komi/",
      region: "Sur de Chios",
      mood: "Cosmopolita",
      badges: ["Arena", "Beach bars", "Vida de verano"],
      size: "normal",
    },
    {
      id: "salagona",
      name: "Salagona",
      title: "Salagona",
      description:
        "Una bahía turquesa aislada, perfecta para hacer snorkel y para días de playa más tranquilos lejos de las zonas más concurridas.",
      image: beachImages.salagona,
      imageAlt: "Playa Salagona en Chios, bahía turquesa aislada",
      href: "/es/playas-chios/playa-salagona/",
      region: "Sur de Chios",
      mood: "Tesoro escondido",
      badges: ["Escondida", "Snorkel", "Turquesa"],
      size: "normal",
    },
    {
      id: "lithi",
      name: "Lithi",
      title: "Playa de Lithi: ideal para familias",
      description:
        "Aguas poco profundas, arena y tabernas de pescado en la orilla hacen de Lithi una de las mejores opciones familiares en Chios.",
      image: beachImages.lithi,
      imageAlt: "Playa de Lithi en el oeste de Chios con aguas poco profundas",
      href: "/es/playas-chios/playa-lithi/",
      region: "Oeste de Chios",
      mood: "Familiar",
      badges: ["Oeste", "Poco profunda", "Tabernas de pescado"],
      size: "wide",
    },
    {
      id: "agia-dynami",
      name: "Agia Dynami",
      title: "Agia Dynami",
      description:
        "Una de las calas más exóticas y fotogénicas de Chios, con aguas esmeralda y una atmósfera tranquila y apartada.",
      image: beachImages.agiaDynami,
      imageAlt: "Playa Agia Dynami en Chios con aguas esmeralda",
      href: "/es/playas-chios/playa-agia-dynami/",
      region: "Sur de Chios",
      mood: "Cala exótica",
      badges: ["Exótica", "Sur", "Aguas esmeralda"],
      size: "wide",
    },
    {
      id: "avlonia",
      name: "Avlonia",
      title: "Avlonia",
      description:
        "Una bahía protegida con aguas tranquilas, ideal para un día de playa más lento y un baño relajado.",
      image: beachImages.avlonia,
      imageAlt: "Playa Avlonia en Chios con aguas tranquilas",
      href: "/es/playas-chios/playa-avlonia/",
      region: "Sur de Chios",
      mood: "Serenidad",
      badges: ["Aguas tranquilas", "Protegida", "Relax"],
      size: "normal",
    },
    {
      id: "lefkathia",
      name: "Lefkathia",
      title: "Lefkathia",
      description:
        "Una playa del norte con aguas azul profundo y ambiente veraniego joven, cerca de Volissos.",
      image: beachImages.lefkathia,
      imageAlt: "Playa Lefkathia en Chios con aguas azul profundo",
      href: "/es/playas-chios/playa-lefkathia/",
      region: "Norte de Chios",
      mood: "Ambiente joven",
      badges: ["Norte", "Azul profundo", "Ambiente de verano"],
      size: "normal",
    },
    {
      id: "nagos",
      name: "Nagos",
      title: "Nagos: paisaje verde",
      description:
        "Una playa única del norte donde aguas de manantial, árboles antiguos y guijarros de colores se encuentran con el mar Egeo.",
      image: beachImages.nagos,
      imageAlt: "Playa Nagos en el norte de Chios con manantiales y guijarros",
      href: "/es/playas-chios/playa-nagos/",
      region: "Norte de Chios",
      mood: "Naturaleza",
      badges: ["Norte", "Manantiales", "Paisaje verde"],
      size: "wide",
    },
  ],
  planning: {
    kicker: "Consejos locales",
    title: "Cómo planificar tus días de playa en Chios",
    description:
      "La costa es muy variada, así que la mejor elección depende de la ruta, el viento y lo que busques: restaurantes, aguas poco profundas, calas tranquilas o paisajes espectaculares.",
    items: [
      {
        icon: "🌬️",
        title: "Comprueba el viento",
        text:
          "Algunas playas son mejores que otras en días de viento. Pregunta localmente antes de conducir lejos.",
      },
      {
        icon: "🚗",
        title: "Alquila un coche",
        text:
          "Las mejores playas de Chios están repartidas por la isla, así que un coche facilita mucho explorarlas.",
      },
      {
        icon: "👨‍👩‍👧",
        title: "Adapta la playa a tu día",
        text:
          "Elige Lithi para familias, Komi para ambiente de playa, Mavra Volia para paisaje y Agia Dynami para aguas exóticas.",
      },
    ],
  },
  stay: {
    kicker: "Alojamiento con consejos locales",
    title: "Empieza tus días de playa desde Kampos",
    text:
      "Voulamandis House es una base práctica para explorar las playas de Chios, con fácil acceso a la ciudad, el aeropuerto, las rutas del sur y la costa este.",
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

export const chiosBeachesPageTr: ChiosBeachesPageData = {
  seo: {
    canonicalPath: "/tr/sakiz-adasi-plajlari/",
    title: "Sakız Adası Plajları | En güzel Chios plajları rehberi",
    description:
      "Sakız Adası’nın en güzel plajlarını keşfedin: Mavra Volia, Agia Fotia, Komi, Lithi, Agia Dynami, Lefkathia ve gizli turkuaz koylar.",
    ogImage: beachImages.mavraVolia,
  },
  hero: {
    kicker: "Sakız Adası plaj rehberi",
    title: "Sakız Adası’nın en güzel plajları",
    description:
      "Volkanik kıyılar, zümrüt koylar, aile dostu kum plajları ve Sakız Adası çevresindeki en iyi yüzme noktaları için yerel bir sahil rehberi.",
    image: beachImages.mavraVolia,
    primaryCta: {
      label: "Plajları keşfet",
      href: "#beaches",
    },
    secondaryCta: {
      label: "Kampos’ta konakla",
      href: "/tr/sakiz-adasi-odalari/",
    },
  },
  intro: {
    kicker: "Plaj planlama",
    title: "Her gün için doğru plajı seçin",
    description:
      "Sakız Adası’nın kıyıları güçlü kontrastlarla doludur: güneyde siyah volkanik çakıllar, batıda aile dostu kum plajları, hareketli beach barlar, sakin koylar ve kuzeyde derin mavi sular. En iyi plaj genellikle ruh halinize, rotanıza ve günün rüzgarına bağlıdır.",
    tip: {
      icon: "🗺️",
      title: "Adadaki stratejik üssünüz",
      text:
        "Sakız Adası plajlarını doğru planlamak için Kampos’taki Voulamandis House’u üssünüz yapın. Yerel ekibimiz hava durumuna, rotanıza ve istediğiniz güne göre plaj seçmenize yardımcı olabilir.",
      linkLabel: "Voulamandis House odalarını görüntüleyin",
      href: "/tr/sakiz-adasi-odalari/",
    },
  },
  beaches: [
    {
      id: "mavra-volia",
      name: "Mavra Volia",
      title: "Mavra Volia: ikonik siyah çakıllar",
      description:
        "Sakız Adası’nın en etkileyici plajı. Derin ve berrak sular, dramatik siyah volkanik çakıllarla birleşerek adanın en unutulmaz manzaralarından birini oluşturur.",
      image: beachImages.mavraVolia,
      imageAlt: "Sakız Adası Mavra Volia Plajı siyah volkanik çakıllar",
      href: "/tr/sakiz-adasi-plajlari/mavra-volia-plaji/",
      region: "Güney Sakız",
      mood: "Volkanik manzara",
      badges: ["En iyi seçim", "Güney", "Volkanik"],
      size: "large",
    },
    {
      id: "agia-fotia",
      name: "Agia Fotia",
      title: "Agia Fotia",
      description:
        "Derin kristal sulara sahip popüler bir plaj; tarihi Kampos bölgesine yakın ve Voulamandis House’tan kolay bir yüzme günü için ideal.",
      image: beachImages.agiaFotia,
      imageAlt: "Sakız Adası Agia Fotia Plajı kristal sular",
      href: "/tr/sakiz-adasi-plajlari/agia-fotia-plaji/",
      region: "Doğu Sakız",
      mood: "Popüler yüzme",
      badges: ["Popüler", "Doğu", "Derin sular"],
      size: "tall",
    },
    {
      id: "komi",
      name: "Komi",
      title: "Komi Plajı",
      description:
        "Altın rengi kumu, beach barları ve rahat kozmopolit atmosferiyle Sakız Adası yaz hayatının kalbi.",
      image: beachImages.komi,
      imageAlt: "Sakız Adası Komi Plajı altın kum ve beach barlar",
      href: "/tr/sakiz-adasi-plajlari/komi-plaji/",
      region: "Güney Sakız",
      mood: "Kozmopolit",
      badges: ["Kum", "Beach barlar", "Yaz hayatı"],
      size: "normal",
    },
    {
      id: "salagona",
      name: "Salagona",
      title: "Salagona",
      description:
        "Şnorkel ve adanın kalabalık bölgelerinden uzak, daha sakin plaj günleri için mükemmel, izole turkuaz bir koy.",
      image: beachImages.salagona,
      imageAlt: "Sakız Adası Salagona Plajı izole turkuaz koy",
      href: "/tr/sakiz-adasi-plajlari/salagona-plaji/",
      region: "Güney Sakız",
      mood: "Gizli hazine",
      badges: ["Gizli", "Şnorkel", "Turkuaz"],
      size: "normal",
    },
    {
      id: "lithi",
      name: "Lithi",
      title: "Lithi Plajı: aileler için ideal",
      description:
        "Sığ kumlu sular ve kıyıdaki balık tavernaları Lithi’yi Sakız Adası’ndaki en iyi aile dostu plaj seçeneklerinden biri yapar.",
      image: beachImages.lithi,
      imageAlt: "Batı Sakız Lithi Plajı sığ kumlu sular",
      href: "/tr/sakiz-adasi-plajlari/lithi-plaji/",
      region: "Batı Sakız",
      mood: "Aile dostu",
      badges: ["Batı", "Sığ", "Balık tavernaları"],
      size: "wide",
    },
    {
      id: "agia-dynami",
      name: "Agia Dynami",
      title: "Agia Dynami",
      description:
        "Zümrüt suları ve sakin, uzak atmosferiyle Sakız Adası’nın en egzotik ve fotojenik koylarından biri.",
      image: beachImages.agiaDynami,
      imageAlt: "Sakız Adası Agia Dynami Plajı zümrüt sular",
      href: "/tr/sakiz-adasi-plajlari/agia-dynami-plaji/",
      region: "Güney Sakız",
      mood: "Egzotik koy",
      badges: ["Egzotik", "Güney", "Zümrüt sular"],
      size: "wide",
    },
    {
      id: "avlonia",
      name: "Avlonia",
      title: "Avlonia",
      description:
        "Sakin sulara sahip korunaklı bir koy; daha yavaş bir plaj günü ve rahat yüzme için idealdir.",
      image: beachImages.avlonia,
      imageAlt: "Sakız Adası Avlonia Plajı sakin sular",
      href: "/tr/sakiz-adasi-plajlari/avlonia-plaji/",
      region: "Güney Sakız",
      mood: "Huzur",
      badges: ["Sakin sular", "Korunaklı", "Rahat"],
      size: "normal",
    },
    {
      id: "lefkathia",
      name: "Lefkathia",
      title: "Lefkathia",
      description:
        "Volissos yakınında, derin mavi suları ve genç yaz atmosferiyle kuzeyde bir plaj.",
      image: beachImages.lefkathia,
      imageAlt: "Sakız Adası Lefkathia Plajı derin mavi sular",
      href: "/tr/sakiz-adasi-plajlari/lefkathia-plaji/",
      region: "Kuzey Sakız",
      mood: "Genç atmosfer",
      badges: ["Kuzey", "Derin mavi", "Yaz atmosferi"],
      size: "normal",
    },
    {
      id: "nagos",
      name: "Nagos",
      title: "Nagos: yeşil manzara",
      description:
        "Kaynak sularının, eski ağaçların ve renkli çakılların Ege Denizi ile buluştuğu kuzeyde benzersiz bir plaj.",
      image: beachImages.nagos,
      imageAlt: "Kuzey Sakız Nagos Plajı kaynaklar ve çakıllar",
      href: "/tr/sakiz-adasi-plajlari/nagos-plaji/",
      region: "Kuzey Sakız",
      mood: "Doğa",
      badges: ["Kuzey", "Kaynaklar", "Yeşil manzara"],
      size: "wide",
    },
  ],
  planning: {
    kicker: "Yerel planlama önerileri",
    title: "Sakız Adası plaj günlerinizi nasıl planlarsınız",
    description:
      "Kıyı çok çeşitlidir; bu yüzden en iyi plaj seçimi rotanıza, rüzgara ve restoran, sığ su, sakin koy ya da etkileyici manzara isteğinize bağlıdır.",
    items: [
      {
        icon: "🌬️",
        title: "Rüzgarı kontrol edin",
        text:
          "Bazı plajlar rüzgarlı günlerde diğerlerinden daha iyidir. Uzağa gitmeden önce yerel olarak sorun.",
      },
      {
        icon: "🚗",
        title: "Araba kiralayın",
        text:
          "Sakız Adası’nın en iyi plajları adanın farklı noktalarına yayılmıştır; araba plaj keşfini çok kolaylaştırır.",
      },
      {
        icon: "👨‍👩‍👧",
        title: "Plajı gününüze göre seçin",
        text:
          "Aileler için Lithi’yi, plaj hayatı için Komi’yi, manzara için Mavra Volia’yı ve egzotik sular için Agia Dynami’yi seçin.",
      },
    ],
  },
  stay: {
    kicker: "Yerel tavsiyelerle konaklayın",
    title: "Plaj günlerinize Kampos’tan başlayın",
    text:
      "Voulamandis House, Sakız Adası plajlarını keşfetmek için pratik bir üstür; şehir merkezine, havaalanına, güney rotalarına ve doğu kıyısına kolay erişim sunar.",
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

export function getLocalizedChiosBeachesPageByPath(
  path: string,
): ChiosBeachesPageData | undefined {
  switch (path) {
    case chiosBeachesPageEl.seo.canonicalPath:
      return chiosBeachesPageEl;
    case chiosBeachesPageFr.seo.canonicalPath:
      return chiosBeachesPageFr;
    case chiosBeachesPageDe.seo.canonicalPath:
      return chiosBeachesPageDe;
    case chiosBeachesPageIt.seo.canonicalPath:
      return chiosBeachesPageIt;
    case chiosBeachesPageEs.seo.canonicalPath:
      return chiosBeachesPageEs;
    case chiosBeachesPageTr.seo.canonicalPath:
      return chiosBeachesPageTr;
    default:
      return undefined;
  }
}
