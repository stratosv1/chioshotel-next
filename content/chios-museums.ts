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

const museumImages = {
  mastic:
    "/images/museums/mousio.mastic.webp",
  archaeological:
    "/images/museums/caption.webp",
  byzantine:
    "/images/museums/375px-Chios_Byzantine_Museum_Mecidiye_Mosque_Chios_Greece.webp",
  koraes:
    "/images/museums/vivlitothiki-korai-1.webp",
  maritime:
    "/images/museums/IMG_1203-Medium-min-768x487.webp",
  folklore:
    "/images/museums/2-1-768x512.webp",
};

export const chiosMuseumsPageEn: ChiosMuseumsPageData = {
  seo: {
    canonicalPath: "/chios/chios-museums/",
    title: "Chios Museums Guide | Voulamandis House",
    description:
      "Explore Chios museums, from mastic culture and archaeology to Byzantine art, maritime history, rare books and folklore.",
    ogImage: museumImages.mastic,
  },
  hero: {
    kicker: "Chios museum guide",
    title: "Explore the museums of Chios",
    description:
      "Discover archaeology, Byzantine art, maritime history, literature, folklore and the unique mastic culture of Chios.",
    image: museumImages.mastic,
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
    kicker: "Cultural planning",
    title: "A cultural route through the history of Chios",
    description:
      "Chios has a rich cultural and historical identity, reflected in its museums, libraries and collections. From ancient finds and Byzantine icons to maritime stories, rare books, folklore and mastic traditions, the museums of Chios help visitors understand the deeper character of the island.",
    tip: {
      icon: "🏛️",
      title: "Combine culture with your island routes",
      text:
        "Many museums are in or near Chios Town, while the Mastic Museum is in south Chios near the mastic villages. Voulamandis House in Kampos is a practical base for combining museums, villages, beaches and local food.",
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
        "Dedicated to the history, cultivation and cultural value of Chios mastic, this museum explains one of the island’s most unique products and strongest symbols.",
      image: museumImages.mastic,
      imageAlt: "Chios Mastic Museum dedicated to the history of mastic",
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
        "An important museum in Chios Town with finds from the Neolithic period to Roman times, including pottery, figurines, jewelry and sculptures.",
      image: museumImages.archaeological,
      imageAlt: "Archaeological Museum of Chios with ancient finds",
      href: "/chios/chios-museums/archaeological-museum-chios/",
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
        "A museum focused on Byzantine and post-Byzantine art, with icons, frescoes, manuscripts and exhibits connected to the island’s religious history.",
      image: museumImages.byzantine,
      imageAlt: "Chios Byzantine Museum with Byzantine art",
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
        "One of the most important libraries in Greece, dedicated to Greek letters and culture, with rare books, manuscripts, archives and museum collections.",
      image: museumImages.koraes,
      imageAlt: "Koraes Library in Chios with rare books and manuscripts",
      href: "/chios/chios-museums/koraes-library-chios/",
      region: "Chios Town",
      mood: "Rare books",
      badges: ["Library", "Manuscripts", "Koraes"],
      size: "normal",
    },
    {
      id: "maritime-museum",
      name: "Chios Maritime Museum",
      title: "Chios Maritime Museum",
      description:
        "A museum presenting Chios maritime history, shipbuilding, navigation, trade and seafaring traditions through models, tools and exhibits.",
      image: museumImages.maritime,
      imageAlt: "Chios Maritime Museum with ship models and maritime history",
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
        "A folklore museum that helps visitors understand daily life, local traditions, tools, costumes and the cultural memory of Chios villages.",
      image: museumImages.folklore,
      imageAlt: "Kallimasia Folklore Museum with traditional objects",
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
      "The museums of Chios can be combined with town walks, village routes and food stops depending on the area you want to explore.",
    items: [
      {
        icon: "🏛️",
        title: "Plan a cultural day in Chios Town",
        text:
          "Combine the Archaeological Museum, Byzantine Museum, Koraes Library and Maritime Museum in one town-based day.",
      },
      {
        icon: "🌿",
        title: "Pair mastic culture with the mastic villages",
        text:
          "Visit the Mastic Museum together with Pyrgi, Mesta, Olympoi or other south Chios villages.",
      },
      {
        icon: "🕰️",
        title: "Check opening times",
        text:
          "Museum hours can change by season, so confirm opening times before planning your day.",
      },
    ],
  },
  stay: {
    kicker: "Stay with local advice",
    title: "Explore Chios culture from Kampos",
    text:
      "Voulamandis House is a quiet base close to Chios Town and the airport, while keeping you connected to cultural routes, villages, beaches and the southern mastic area.",
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

export const chiosMuseumsPageEl: ChiosMuseumsPageData = {
  seo: {
    canonicalPath: "/el/mouseia-xios/",
    title: "Μουσεία Χίου | Voulamandis House",
    description:
      "Ανακαλύψτε μουσεία της Χίου για μαστίχα, αρχαιολογία, βυζαντινή τέχνη, ναυτική ιστορία, βιβλία και λαογραφία.",
    ogImage: museumImages.mastic,
  },
  hero: {
    kicker: "Οδηγός μουσείων Χίου",
    title: "Ανακαλύψτε τα μουσεία της Χίου",
    description:
      "Γνωρίστε την αρχαιολογία, τη βυζαντινή τέχνη, τη ναυτική ιστορία, τη λογοτεχνία, τη λαογραφία και τη μοναδική κουλτούρα της μαστίχας στη Χίο.",
    image: museumImages.mastic,
    primaryCta: {
      label: "Δείτε τα μουσεία",
      href: "#museums",
    },
    secondaryCta: {
      label: "Μείνετε στον Κάμπο",
      href: "/el/domatia-xios/",
    },
  },
  intro: {
    kicker: "Πολιτιστική διαδρομή",
    title: "Μια διαδρομή στην ιστορία και την ταυτότητα της Χίου",
    description:
      "Η Χίος έχει πλούσια πολιτιστική και ιστορική κληρονομιά, που αποτυπώνεται στα μουσεία, τις βιβλιοθήκες και τις συλλογές της. Από αρχαία ευρήματα και βυζαντινές εικόνες μέχρι ναυτικές ιστορίες, σπάνια βιβλία, λαογραφία και τη μαστίχα, τα μουσεία βοηθούν τον επισκέπτη να καταλάβει τη βαθύτερη ταυτότητα του νησιού.",
    tip: {
      icon: "🏛️",
      title: "Συνδυάστε πολιτισμό με τις διαδρομές σας",
      text:
        "Πολλά μουσεία βρίσκονται μέσα ή κοντά στην πόλη της Χίου, ενώ το Μουσείο Μαστίχας βρίσκεται στη νότια Χίο κοντά στα Μαστιχοχώρια. Το Voulamandis House στον Κάμπο είναι πρακτική βάση για να συνδυάσετε μουσεία, χωριά, παραλίες και τοπικό φαγητό.",
      linkLabel: "Δείτε τα δωμάτια στο Voulamandis House",
      href: "/el/domatia-xios/",
    },
  },
  museums: [
    {
      id: "mastic-museum",
      name: "Μουσείο Μαστίχας Χίου",
      title: "Μουσείο Μαστίχας Χίου",
      description:
        "Αφιερωμένο στην ιστορία, την καλλιέργεια και την πολιτιστική αξία της χιώτικης μαστίχας, εξηγεί ένα από τα πιο μοναδικά προϊόντα και ισχυρά σύμβολα της Χίου.",
      image: museumImages.mastic,
      imageAlt: "Μουσείο Μαστίχας Χίου αφιερωμένο στην ιστορία της μαστίχας",
      href: "/el/mouseia-xios/mouseio-mastichas-xios/",
      region: "Νότια Χίος",
      mood: "Κουλτούρα μαστίχας",
      badges: ["Μαστίχα", "Πολιτισμός", "Νότια"],
      size: "large",
    },
    {
      id: "archaeological-museum",
      name: "Αρχαιολογικό Μουσείο Χίου",
      title: "Αρχαιολογικό Μουσείο Χίου",
      description:
        "Σημαντικό μουσείο στην πόλη της Χίου με ευρήματα από τη Νεολιθική περίοδο έως τα ρωμαϊκά χρόνια, όπως κεραμικά, ειδώλια, κοσμήματα και γλυπτά.",
      image: museumImages.archaeological,
      imageAlt: "Αρχαιολογικό Μουσείο Χίου με αρχαία ευρήματα",
      href: "/el/mouseia-xios/arxaiologiko-mouseio-xios/",
      region: "Πόλη Χίου",
      mood: "Αρχαία ιστορία",
      badges: ["Αρχαιολογία", "Αρχαία Χίος", "Πόλη"],
      size: "tall",
    },
    {
      id: "byzantine-museum",
      name: "Βυζαντινό Μουσείο Χίου",
      title: "Βυζαντινό Μουσείο Χίου",
      description:
        "Μουσείο αφιερωμένο στη βυζαντινή και μεταβυζαντινή τέχνη, με εικόνες, τοιχογραφίες, χειρόγραφα και εκθέματα που συνδέονται με τη θρησκευτική ιστορία του νησιού.",
      image: museumImages.byzantine,
      imageAlt: "Βυζαντινό Μουσείο Χίου με εικόνες και βυζαντινή τέχνη",
      href: "/el/mouseia-xios/vyzantino-mouseio-xios/",
      region: "Πόλη Χίου",
      mood: "Βυζαντινή τέχνη",
      badges: ["Εικόνες", "Βυζαντινό", "Πολιτισμός"],
      size: "normal",
    },
    {
      id: "koraes-library",
      name: "Βιβλιοθήκη Κοραή",
      title: "Βιβλιοθήκη Κοραή",
      description:
        "Μία από τις σημαντικότερες βιβλιοθήκες της Ελλάδας, αφιερωμένη στα ελληνικά γράμματα και τον πολιτισμό, με σπάνια βιβλία, χειρόγραφα, αρχεία και μουσειακές συλλογές.",
      image: museumImages.koraes,
      imageAlt: "Βιβλιοθήκη Κοραή στη Χίο με σπάνια βιβλία και χειρόγραφα",
      href: "/el/mouseia-xios/vivliothiki-korai-xios/",
      region: "Πόλη Χίου",
      mood: "Σπάνια βιβλία",
      badges: ["Βιβλιοθήκη", "Χειρόγραφα", "Κοραής"],
      size: "normal",
    },
    {
      id: "maritime-museum",
      name: "Ναυτικό Μουσείο Χίου",
      title: "Ναυτικό Μουσείο Χίου",
      description:
        "Μουσείο που παρουσιάζει τη ναυτική ιστορία της Χίου, τη ναυπηγική, τη ναυσιπλοΐα, το εμπόριο και τις θαλασσινές παραδόσεις μέσα από μοντέλα, εργαλεία και εκθέματα.",
      image: museumImages.maritime,
      imageAlt: "Ναυτικό Μουσείο Χίου με μοντέλα πλοίων και ναυτική ιστορία",
      href: "/el/mouseia-xios/naftiko-mouseio-xios/",
      region: "Πόλη Χίου",
      mood: "Ναυτική κληρονομιά",
      badges: ["Πλοία", "Ναυσιπλοΐα", "Εμπόριο"],
      size: "wide",
    },
    {
      id: "kallimasia-folklore",
      name: "Λαογραφικό Μουσείο Καλλιμασιάς",
      title: "Λαογραφικό Μουσείο Καλλιμασιάς",
      description:
        "Λαογραφικό μουσείο που βοηθά τον επισκέπτη να κατανοήσει την καθημερινή ζωή, τις τοπικές παραδόσεις, τα εργαλεία, τις φορεσιές και τη μνήμη των χωριών της Χίου.",
      image: museumImages.folklore,
      imageAlt: "Λαογραφικό Μουσείο Καλλιμασιάς με παραδοσιακά αντικείμενα",
      href: "/el/mouseia-xios/laografiko-mouseio-kallimasias/",
      region: "Καλλιμασιά",
      mood: "Λαογραφία",
      badges: ["Παράδοση", "Ζωή χωριού", "Λαογραφία"],
      size: "wide",
    },
  ],
  planning: {
    kicker: "Τοπικές συμβουλές",
    title: "Πώς να οργανώσετε τις επισκέψεις στα μουσεία της Χίου",
    description:
      "Τα μουσεία της Χίου μπορούν να συνδυαστούν εύκολα με βόλτες στην πόλη, διαδρομές στα χωριά και στάσεις για φαγητό, ανάλογα με την περιοχή που θέλετε να εξερευνήσετε.",
    items: [
      {
        icon: "🏛️",
        title: "Κάντε μια πολιτιστική μέρα στην πόλη",
        text:
          "Συνδυάστε το Αρχαιολογικό Μουσείο, το Βυζαντινό Μουσείο, τη Βιβλιοθήκη Κοραή και το Ναυτικό Μουσείο σε μία μέρα.",
      },
      {
        icon: "🌿",
        title: "Συνδυάστε μαστίχα και Μαστιχοχώρια",
        text:
          "Επισκεφθείτε το Μουσείο Μαστίχας μαζί με το Πυργί, τα Μεστά, τους Ολύμπους ή άλλα χωριά της νότιας Χίου.",
      },
      {
        icon: "🕰️",
        title: "Ελέγξτε ωράρια",
        text:
          "Τα ωράρια των μουσείων μπορεί να αλλάζουν ανά εποχή, οπότε επιβεβαιώστε πριν οργανώσετε τη μέρα σας.",
      },
    ],
  },
  stay: {
    kicker: "Μείνετε με τοπική καθοδήγηση",
    title: "Εξερευνήστε τον πολιτισμό της Χίου από τον Κάμπο",
    text:
      "Το Voulamandis House προσφέρει ήσυχη βάση κοντά στην πόλη και το αεροδρόμιο, ενώ σας κρατά συνδεδεμένους με πολιτιστικές διαδρομές, χωριά, παραλίες και τη νότια περιοχή της μαστίχας.",
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

export const chiosMuseumsPageFr: ChiosMuseumsPageData = {
  seo: {
    canonicalPath: "/fr/musees-de-chios/",
    title: "Musées de Chios | Voulamandis House",
    description:
      "Découvrez les musées de Chios : mastic, archéologie, art byzantin, histoire maritime, livres rares et folklore.",
    ogImage: museumImages.mastic,
  },
  hero: {
    kicker: "Guide des musées de Chios",
    title: "Explorez les musées de Chios",
    description:
      "Découvrez l’archéologie, l’art byzantin, l’histoire maritime, la littérature, le folklore et la culture unique du mastic de Chios.",
    image: museumImages.mastic,
    primaryCta: {
      label: "Explorer les musées",
      href: "#museums",
    },
    secondaryCta: {
      label: "Séjourner à Kampos",
      href: "/fr/chambres-a-chios/",
    },
  },
  intro: {
    kicker: "Itinéraire culturel",
    title: "Un parcours culturel dans l’histoire de Chios",
    description:
      "Chios possède une identité culturelle et historique riche, visible dans ses musées, bibliothèques et collections. Des découvertes antiques et icônes byzantines aux récits maritimes, livres rares, traditions folkloriques et culture du mastic, les musées aident à comprendre le caractère profond de l’île.",
    tip: {
      icon: "🏛️",
      title: "Associez culture et itinéraires sur l’île",
      text:
        "De nombreux musées se trouvent dans ou près de la ville de Chios, tandis que le Musée du Mastic est situé au sud, près des villages du mastic. Voulamandis House à Kampos est une base pratique pour combiner musées, villages, plages et cuisine locale.",
      linkLabel: "Voir les chambres de Voulamandis House",
      href: "/fr/chambres-a-chios/",
    },
  },
  museums: [
    {
      id: "mastic-museum",
      name: "Musée du Mastic de Chios",
      title: "Musée du Mastic de Chios",
      description:
        "Consacré à l’histoire, à la culture et à la valeur du mastic de Chios, ce musée explique l’un des produits les plus uniques et l’un des symboles les plus forts de l’île.",
      image: museumImages.mastic,
      imageAlt: "Musée du Mastic de Chios consacré à l’histoire du mastic",
      href: "/fr/musees-de-chios/musee-du-mastic-chios/",
      region: "Sud de Chios",
      mood: "Culture du mastic",
      badges: ["Mastic", "Culture", "Sud"],
      size: "large",
    },
    {
      id: "archaeological-museum",
      name: "Musée archéologique de Chios",
      title: "Musée archéologique de Chios",
      description:
        "Un musée important dans la ville de Chios, avec des découvertes allant du Néolithique à l’époque romaine, dont poteries, figurines, bijoux et sculptures.",
      image: museumImages.archaeological,
      imageAlt: "Musée archéologique de Chios avec objets antiques",
      href: "/fr/musees-de-chios/musee-archeologique-chios/",
      region: "Ville de Chios",
      mood: "Histoire antique",
      badges: ["Archéologie", "Chios antique", "Ville"],
      size: "tall",
    },
    {
      id: "byzantine-museum",
      name: "Musée byzantin de Chios",
      title: "Musée byzantin de Chios",
      description:
        "Un musée consacré à l’art byzantin et post-byzantin, avec icônes, fresques, manuscrits et objets liés à l’histoire religieuse de l’île.",
      image: museumImages.byzantine,
      imageAlt: "Musée byzantin de Chios avec art byzantin",
      href: "/fr/musees-de-chios/musee-byzantin-chios/",
      region: "Ville de Chios",
      mood: "Art byzantin",
      badges: ["Icônes", "Byzantin", "Culture"],
      size: "normal",
    },
    {
      id: "koraes-library",
      name: "Bibliothèque Korais",
      title: "Bibliothèque Korais",
      description:
        "L’une des bibliothèques les plus importantes de Grèce, dédiée aux lettres et à la culture grecques, avec livres rares, manuscrits, archives et collections muséales.",
      image: museumImages.koraes,
      imageAlt: "Bibliothèque Korais à Chios avec livres rares et manuscrits",
      href: "/fr/musees-de-chios/bibliotheque-korais-chios/",
      region: "Ville de Chios",
      mood: "Livres rares",
      badges: ["Bibliothèque", "Manuscrits", "Korais"],
      size: "normal",
    },
    {
      id: "maritime-museum",
      name: "Musée maritime de Chios",
      title: "Musée maritime de Chios",
      description:
        "Un musée qui présente l’histoire maritime de Chios, la construction navale, la navigation, le commerce et les traditions de la mer à travers modèles, outils et expositions.",
      image: museumImages.maritime,
      imageAlt: "Musée maritime de Chios avec maquettes de navires",
      href: "/fr/musees-de-chios/musee-maritime-chios/",
      region: "Ville de Chios",
      mood: "Patrimoine maritime",
      badges: ["Navires", "Navigation", "Commerce"],
      size: "wide",
    },
    {
      id: "kallimasia-folklore",
      name: "Musée folklorique de Kallimasia",
      title: "Musée folklorique de Kallimasia",
      description:
        "Un musée folklorique qui aide à comprendre la vie quotidienne, les traditions locales, les outils, les costumes et la mémoire culturelle des villages de Chios.",
      image: museumImages.folklore,
      imageAlt: "Musée folklorique de Kallimasia avec objets traditionnels",
      href: "/fr/musees-de-chios/musee-folklorique-kallimasia/",
      region: "Kallimasia",
      mood: "Folklore",
      badges: ["Tradition", "Vie villageoise", "Folklore"],
      size: "wide",
    },
  ],
  planning: {
    kicker: "Conseils locaux",
    title: "Comment organiser vos visites de musées à Chios",
    description:
      "Les musées de Chios se combinent facilement avec des promenades en ville, des itinéraires dans les villages et des pauses repas selon la zone que vous souhaitez explorer.",
    items: [
      {
        icon: "🏛️",
        title: "Préparez une journée culturelle en ville",
        text:
          "Combinez le Musée archéologique, le Musée byzantin, la Bibliothèque Korais et le Musée maritime en une même journée dans la ville de Chios.",
      },
      {
        icon: "🌿",
        title: "Associez mastic et villages du sud",
        text:
          "Visitez le Musée du Mastic avec Pyrgi, Mesta, Olympoi ou d’autres villages du sud de Chios.",
      },
      {
        icon: "🕰️",
        title: "Vérifiez les horaires",
        text:
          "Les horaires des musées peuvent changer selon la saison, il est donc préférable de les confirmer avant votre visite.",
      },
    ],
  },
  stay: {
    kicker: "Séjour avec conseils locaux",
    title: "Explorez la culture de Chios depuis Kampos",
    text:
      "Voulamandis House offre une base calme près de la ville et de l’aéroport, tout en restant bien reliée aux itinéraires culturels, aux villages, aux plages et à la région du mastic au sud.",
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

export const chiosMuseumsPageDe: ChiosMuseumsPageData = {
  seo: {
    canonicalPath: "/de/museen-chios/",
    title: "Museen auf Chios | Voulamandis House",
    description:
      "Entdecken Sie Museen auf Chios: Mastixkultur, Archäologie, byzantinische Kunst, Seefahrt, Bücher und Volkskunde.",
    ogImage: museumImages.mastic,
  },
  hero: {
    kicker: "Museumsführer für Chios",
    title: "Entdecken Sie die Museen von Chios",
    description:
      "Erleben Sie Archäologie, byzantinische Kunst, maritime Geschichte, Literatur, Volkskunde und die einzigartige Mastixkultur von Chios.",
    image: museumImages.mastic,
    primaryCta: {
      label: "Museen entdecken",
      href: "#museums",
    },
    secondaryCta: {
      label: "In Kampos übernachten",
      href: "/de/chios-zimmer/",
    },
  },
  intro: {
    kicker: "Kulturplanung",
    title: "Eine Kulturroute durch die Geschichte von Chios",
    description:
      "Chios hat eine reiche kulturelle und historische Identität, die sich in Museen, Bibliotheken und Sammlungen zeigt. Von antiken Funden und byzantinischen Ikonen bis zu Seefahrtsgeschichten, seltenen Büchern, Volkskunde und Mastixtraditionen helfen die Museen, den tieferen Charakter der Insel zu verstehen.",
    tip: {
      icon: "🏛️",
      title: "Kultur mit Ihren Inselrouten verbinden",
      text:
        "Viele Museen befinden sich in oder nahe Chios-Stadt, während das Mastix-Museum im Süden nahe der Mastixdörfer liegt. Voulamandis House in Kampos ist eine praktische Basis, um Museen, Dörfer, Strände und lokale Küche zu kombinieren.",
      linkLabel: "Zimmer im Voulamandis House ansehen",
      href: "/de/chios-zimmer/",
    },
  },
  museums: [
    {
      id: "mastic-museum",
      name: "Chios Mastix-Museum",
      title: "Chios Mastix-Museum",
      description:
        "Dieses Museum widmet sich der Geschichte, dem Anbau und dem kulturellen Wert des Chios-Mastix und erklärt eines der einzigartigsten Produkte und stärksten Symbole der Insel.",
      image: museumImages.mastic,
      imageAlt: "Chios Mastix-Museum zur Geschichte des Mastix",
      href: "/de/museen-chios/mastix-museum-chios/",
      region: "Süd-Chios",
      mood: "Mastixkultur",
      badges: ["Mastix", "Kultur", "Süden"],
      size: "large",
    },
    {
      id: "archaeological-museum",
      name: "Archäologisches Museum von Chios",
      title: "Archäologisches Museum von Chios",
      description:
        "Ein wichtiges Museum in Chios-Stadt mit Funden von der Jungsteinzeit bis zur Römerzeit, darunter Keramik, Figuren, Schmuck und Skulpturen.",
      image: museumImages.archaeological,
      imageAlt: "Archäologisches Museum von Chios mit antiken Funden",
      href: "/de/museen-chios/archaeologisches-museum-chios/",
      region: "Chios-Stadt",
      mood: "Antike Geschichte",
      badges: ["Archäologie", "Antikes Chios", "Stadt"],
      size: "tall",
    },
    {
      id: "byzantine-museum",
      name: "Byzantinisches Museum von Chios",
      title: "Byzantinisches Museum von Chios",
      description:
        "Ein Museum für byzantinische und nachbyzantinische Kunst mit Ikonen, Fresken, Handschriften und Ausstellungsstücken zur religiösen Geschichte der Insel.",
      image: museumImages.byzantine,
      imageAlt: "Byzantinisches Museum von Chios mit byzantinischer Kunst",
      href: "/de/museen-chios/byzantinisches-museum-chios/",
      region: "Chios-Stadt",
      mood: "Byzantinische Kunst",
      badges: ["Ikonen", "Byzantinisch", "Kultur"],
      size: "normal",
    },
    {
      id: "koraes-library",
      name: "Korais-Bibliothek",
      title: "Korais-Bibliothek",
      description:
        "Eine der wichtigsten Bibliotheken Griechenlands, gewidmet griechischer Literatur und Kultur, mit seltenen Büchern, Handschriften, Archiven und Museumssammlungen.",
      image: museumImages.koraes,
      imageAlt: "Korais-Bibliothek auf Chios mit seltenen Büchern",
      href: "/de/museen-chios/korais-bibliothek-chios/",
      region: "Chios-Stadt",
      mood: "Seltene Bücher",
      badges: ["Bibliothek", "Handschriften", "Korais"],
      size: "normal",
    },
    {
      id: "maritime-museum",
      name: "Schifffahrtsmuseum von Chios",
      title: "Schifffahrtsmuseum von Chios",
      description:
        "Ein Museum über die maritime Geschichte von Chios, Schiffbau, Navigation, Handel und Seefahrtstraditionen mit Modellen, Werkzeugen und Ausstellungen.",
      image: museumImages.maritime,
      imageAlt: "Schifffahrtsmuseum von Chios mit Schiffsmodellen",
      href: "/de/museen-chios/schifffahrtsmuseum-chios/",
      region: "Chios-Stadt",
      mood: "Maritimes Erbe",
      badges: ["Schiffe", "Navigation", "Handel"],
      size: "wide",
    },
    {
      id: "kallimasia-folklore",
      name: "Volkskundemuseum Kallimasia",
      title: "Volkskundemuseum Kallimasia",
      description:
        "Ein Volkskundemuseum, das Alltagsleben, lokale Traditionen, Werkzeuge, Trachten und das kulturelle Gedächtnis der Chios-Dörfer verständlich macht.",
      image: museumImages.folklore,
      imageAlt: "Volkskundemuseum Kallimasia mit traditionellen Objekten",
      href: "/de/museen-chios/volkskundemuseum-kallimasia/",
      region: "Kallimasia",
      mood: "Volkskunde",
      badges: ["Tradition", "Dorfleben", "Volkskunde"],
      size: "wide",
    },
  ],
  planning: {
    kicker: "Lokale Planungstipps",
    title: "So planen Sie Ihre Museumsbesuche auf Chios",
    description:
      "Die Museen von Chios lassen sich je nach Region gut mit Stadtspaziergängen, Dorfrouten und Essensstopps kombinieren.",
    items: [
      {
        icon: "🏛️",
        title: "Planen Sie einen Kulturtag in Chios-Stadt",
        text:
          "Kombinieren Sie das Archäologische Museum, das Byzantinische Museum, die Korais-Bibliothek und das Schifffahrtsmuseum an einem Tag in der Stadt.",
      },
      {
        icon: "🌿",
        title: "Mastixkultur mit Mastixdörfern verbinden",
        text:
          "Besuchen Sie das Mastix-Museum zusammen mit Pyrgi, Mesta, Olympoi oder anderen Dörfern im Süden von Chios.",
      },
      {
        icon: "🕰️",
        title: "Öffnungszeiten prüfen",
        text:
          "Museumsöffnungszeiten können je nach Saison variieren, daher sollten Sie diese vor dem Besuch bestätigen.",
      },
    ],
  },
  stay: {
    kicker: "Übernachten mit lokalen Tipps",
    title: "Entdecken Sie Chios-Kultur von Kampos aus",
    text:
      "Voulamandis House bietet eine ruhige Basis nahe Chios-Stadt und Flughafen und verbindet Sie mit Kulturrouten, Dörfern, Stränden und dem südlichen Mastixgebiet.",
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

export const chiosMuseumsPageIt: ChiosMuseumsPageData = {
  seo: {
    canonicalPath: "/it/musei-chios/",
    title: "Musei di Chios | Voulamandis House",
    description:
      "Scopri i musei di Chios: mastice, archeologia, arte bizantina, storia marittima, libri rari e folklore.",
    ogImage: museumImages.mastic,
  },
  hero: {
    kicker: "Guida ai musei di Chios",
    title: "Esplora i musei di Chios",
    description:
      "Scopri archeologia, arte bizantina, storia marittima, letteratura, folklore e la cultura unica del mastice di Chios.",
    image: museumImages.mastic,
    primaryCta: {
      label: "Esplora i musei",
      href: "#museums",
    },
    secondaryCta: {
      label: "Soggiorna a Kampos",
      href: "/it/camere-a-chios/",
    },
  },
  intro: {
    kicker: "Itinerario culturale",
    title: "Un percorso culturale nella storia di Chios",
    description:
      "Chios possiede una ricca identità culturale e storica, visibile nei suoi musei, biblioteche e collezioni. Dai reperti antichi e le icone bizantine alle storie marittime, ai libri rari, al folklore e alle tradizioni del mastice, i musei aiutano a comprendere il carattere più profondo dell’isola.",
    tip: {
      icon: "🏛️",
      title: "Abbina cultura e itinerari sull’isola",
      text:
        "Molti musei si trovano nella città di Chios o nelle vicinanze, mentre il Museo del Mastice si trova a sud, vicino ai villaggi del mastice. Voulamandis House a Kampos è una base pratica per combinare musei, villaggi, spiagge e cucina locale.",
      linkLabel: "Vedi le camere di Voulamandis House",
      href: "/it/camere-a-chios/",
    },
  },
  museums: [
    {
      id: "mastic-museum",
      name: "Museo del Mastice di Chios",
      title: "Museo del Mastice di Chios",
      description:
        "Dedicato alla storia, alla coltivazione e al valore culturale del mastice di Chios, questo museo spiega uno dei prodotti più unici e simbolici dell’isola.",
      image: museumImages.mastic,
      imageAlt: "Museo del Mastice di Chios dedicato alla storia del mastice",
      href: "/it/musei-chios/museo-del-mastice-chios/",
      region: "Chios meridionale",
      mood: "Cultura del mastice",
      badges: ["Mastice", "Cultura", "Sud"],
      size: "large",
    },
    {
      id: "archaeological-museum",
      name: "Museo Archeologico di Chios",
      title: "Museo Archeologico di Chios",
      description:
        "Un importante museo nella città di Chios con reperti dal Neolitico all’epoca romana, tra cui ceramiche, statuette, gioielli e sculture.",
      image: museumImages.archaeological,
      imageAlt: "Museo Archeologico di Chios con reperti antichi",
      href: "/it/musei-chios/museo-archeologico-chios/",
      region: "Città di Chios",
      mood: "Storia antica",
      badges: ["Archeologia", "Chios antica", "Città"],
      size: "tall",
    },
    {
      id: "byzantine-museum",
      name: "Museo Bizantino di Chios",
      title: "Museo Bizantino di Chios",
      description:
        "Un museo dedicato all’arte bizantina e post-bizantina, con icone, affreschi, manoscritti e reperti legati alla storia religiosa dell’isola.",
      image: museumImages.byzantine,
      imageAlt: "Museo Bizantino di Chios con arte bizantina",
      href: "/it/musei-chios/museo-bizantino-chios/",
      region: "Città di Chios",
      mood: "Arte bizantina",
      badges: ["Icone", "Bizantino", "Cultura"],
      size: "normal",
    },
    {
      id: "koraes-library",
      name: "Biblioteca Korais",
      title: "Biblioteca Korais",
      description:
        "Una delle biblioteche più importanti della Grecia, dedicata alla letteratura e cultura greca, con libri rari, manoscritti, archivi e collezioni museali.",
      image: museumImages.koraes,
      imageAlt: "Biblioteca Korais a Chios con libri rari e manoscritti",
      href: "/it/musei-chios/biblioteca-korais-chios/",
      region: "Città di Chios",
      mood: "Libri rari",
      badges: ["Biblioteca", "Manoscritti", "Korais"],
      size: "normal",
    },
    {
      id: "maritime-museum",
      name: "Museo Marittimo di Chios",
      title: "Museo Marittimo di Chios",
      description:
        "Un museo che presenta la storia marittima di Chios, la costruzione navale, la navigazione, il commercio e le tradizioni del mare attraverso modelli, strumenti ed esposizioni.",
      image: museumImages.maritime,
      imageAlt: "Museo Marittimo di Chios con modelli di navi",
      href: "/it/musei-chios/museo-marittimo-chios/",
      region: "Città di Chios",
      mood: "Patrimonio marittimo",
      badges: ["Navi", "Navigazione", "Commercio"],
      size: "wide",
    },
    {
      id: "kallimasia-folklore",
      name: "Museo Folkloristico di Kallimasia",
      title: "Museo Folkloristico di Kallimasia",
      description:
        "Un museo folkloristico che aiuta a comprendere la vita quotidiana, le tradizioni locali, gli strumenti, i costumi e la memoria culturale dei villaggi di Chios.",
      image: museumImages.folklore,
      imageAlt: "Museo Folkloristico di Kallimasia con oggetti tradizionali",
      href: "/it/musei-chios/museo-folkloristico-kallimasia/",
      region: "Kallimasia",
      mood: "Folklore",
      badges: ["Tradizione", "Vita di villaggio", "Folklore"],
      size: "wide",
    },
  ],
  planning: {
    kicker: "Consigli locali",
    title: "Come organizzare le visite ai musei di Chios",
    description:
      "I musei di Chios si combinano facilmente con passeggiate in città, itinerari nei villaggi e soste gastronomiche a seconda della zona che vuoi esplorare.",
    items: [
      {
        icon: "🏛️",
        title: "Organizza una giornata culturale in città",
        text:
          "Combina Museo Archeologico, Museo Bizantino, Biblioteca Korais e Museo Marittimo in una giornata nella città di Chios.",
      },
      {
        icon: "🌿",
        title: "Abbina mastice e villaggi del sud",
        text:
          "Visita il Museo del Mastice insieme a Pyrgi, Mesta, Olympoi o altri villaggi della Chios meridionale.",
      },
      {
        icon: "🕰️",
        title: "Controlla gli orari",
        text:
          "Gli orari dei musei possono cambiare in base alla stagione, quindi confermali prima della visita.",
      },
    ],
  },
  stay: {
    kicker: "Soggiorna con consigli locali",
    title: "Esplora la cultura di Chios da Kampos",
    text:
      "Voulamandis House offre una base tranquilla vicino alla città e all’aeroporto, mantenendoti collegato a itinerari culturali, villaggi, spiagge e alla zona del mastice a sud.",
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

export const chiosMuseumsPageEs: ChiosMuseumsPageData = {
  seo: {
    canonicalPath: "/es/museos-chios/",
    title: "Museos de Chios | Voulamandis House",
    description:
      "Descubre museos de Chios sobre mastiha, arqueología, arte bizantino, historia marítima, libros raros y folclore.",
    ogImage: museumImages.mastic,
  },
  hero: {
    kicker: "Guía de museos de Chios",
    title: "Explora los museos de Chios",
    description:
      "Descubre arqueología, arte bizantino, historia marítima, literatura, folclore y la cultura única de la mastiha de Chios.",
    image: museumImages.mastic,
    primaryCta: {
      label: "Explorar museos",
      href: "#museums",
    },
    secondaryCta: {
      label: "Alojarse en Kampos",
      href: "/es/habitaciones-en-chios/",
    },
  },
  intro: {
    kicker: "Ruta cultural",
    title: "Un recorrido cultural por la historia de Chios",
    description:
      "Chios tiene una rica identidad cultural e histórica, reflejada en sus museos, bibliotecas y colecciones. Desde hallazgos antiguos e iconos bizantinos hasta historias marítimas, libros raros, folclore y tradiciones de la mastiha, los museos ayudan a comprender el carácter más profundo de la isla.",
    tip: {
      icon: "🏛️",
      title: "Combina cultura con tus rutas por la isla",
      text:
        "Muchos museos están en la ciudad de Chios o cerca de ella, mientras que el Museo de la Mastiha se encuentra en el sur, cerca de los pueblos de la mastiha. Voulamandis House en Kampos es una base práctica para combinar museos, pueblos, playas y comida local.",
      linkLabel: "Ver habitaciones en Voulamandis House",
      href: "/es/habitaciones-en-chios/",
    },
  },
  museums: [
    {
      id: "mastic-museum",
      name: "Museo de la Mastiha de Chios",
      title: "Museo de la Mastiha de Chios",
      description:
        "Dedicado a la historia, el cultivo y el valor cultural de la mastiha de Chios, este museo explica uno de los productos más únicos y simbólicos de la isla.",
      image: museumImages.mastic,
      imageAlt: "Museo de la Mastiha de Chios dedicado a la historia de la mastiha",
      href: "/es/museos-chios/museo-mastiha-chios/",
      region: "Sur de Chios",
      mood: "Cultura de la mastiha",
      badges: ["Mastiha", "Cultura", "Sur"],
      size: "large",
    },
    {
      id: "archaeological-museum",
      name: "Museo Arqueológico de Chios",
      title: "Museo Arqueológico de Chios",
      description:
        "Un importante museo en la ciudad de Chios con hallazgos desde el Neolítico hasta la época romana, incluyendo cerámica, figurillas, joyas y esculturas.",
      image: museumImages.archaeological,
      imageAlt: "Museo Arqueológico de Chios con hallazgos antiguos",
      href: "/es/museos-chios/museo-arqueologico-chios/",
      region: "Ciudad de Chios",
      mood: "Historia antigua",
      badges: ["Arqueología", "Chios antigua", "Ciudad"],
      size: "tall",
    },
    {
      id: "byzantine-museum",
      name: "Museo Bizantino de Chios",
      title: "Museo Bizantino de Chios",
      description:
        "Un museo dedicado al arte bizantino y posbizantino, con iconos, frescos, manuscritos y exposiciones relacionadas con la historia religiosa de la isla.",
      image: museumImages.byzantine,
      imageAlt: "Museo Bizantino de Chios con arte bizantino",
      href: "/es/museos-chios/museo-bizantino-chios/",
      region: "Ciudad de Chios",
      mood: "Arte bizantino",
      badges: ["Iconos", "Bizantino", "Cultura"],
      size: "normal",
    },
    {
      id: "koraes-library",
      name: "Biblioteca Korais",
      title: "Biblioteca Korais",
      description:
        "Una de las bibliotecas más importantes de Grecia, dedicada a las letras y la cultura griegas, con libros raros, manuscritos, archivos y colecciones museísticas.",
      image: museumImages.koraes,
      imageAlt: "Biblioteca Korais en Chios con libros raros",
      href: "/es/museos-chios/biblioteca-korais-chios/",
      region: "Ciudad de Chios",
      mood: "Libros raros",
      badges: ["Biblioteca", "Manuscritos", "Korais"],
      size: "normal",
    },
    {
      id: "maritime-museum",
      name: "Museo Marítimo de Chios",
      title: "Museo Marítimo de Chios",
      description:
        "Un museo que presenta la historia marítima de Chios, la construcción naval, la navegación, el comercio y las tradiciones del mar mediante modelos, herramientas y exposiciones.",
      image: museumImages.maritime,
      imageAlt: "Museo Marítimo de Chios con modelos de barcos",
      href: "/es/museos-chios/museo-maritimo-chios/",
      region: "Ciudad de Chios",
      mood: "Patrimonio marítimo",
      badges: ["Barcos", "Navegación", "Comercio"],
      size: "wide",
    },
    {
      id: "kallimasia-folklore",
      name: "Museo Folclórico de Kallimasia",
      title: "Museo Folclórico de Kallimasia",
      description:
        "Un museo folclórico que ayuda a comprender la vida cotidiana, las tradiciones locales, las herramientas, los trajes y la memoria cultural de los pueblos de Chios.",
      image: museumImages.folklore,
      imageAlt: "Museo Folclórico de Kallimasia con objetos tradicionales",
      href: "/es/museos-chios/museo-folclorico-kallimasia/",
      region: "Kallimasia",
      mood: "Folclore",
      badges: ["Tradición", "Vida de pueblo", "Folclore"],
      size: "wide",
    },
  ],
  planning: {
    kicker: "Consejos locales",
    title: "Cómo planificar tus visitas a los museos de Chios",
    description:
      "Los museos de Chios se pueden combinar fácilmente con paseos por la ciudad, rutas por pueblos y paradas para comer según la zona que quieras explorar.",
    items: [
      {
        icon: "🏛️",
        title: "Organiza un día cultural en la ciudad",
        text:
          "Combina el Museo Arqueológico, el Museo Bizantino, la Biblioteca Korais y el Museo Marítimo en un día dentro de la ciudad de Chios.",
      },
      {
        icon: "🌿",
        title: "Combina mastiha y pueblos del sur",
        text:
          "Visita el Museo de la Mastiha junto con Pyrgi, Mesta, Olympoi u otros pueblos del sur de Chios.",
      },
      {
        icon: "🕰️",
        title: "Comprueba los horarios",
        text:
          "Los horarios de los museos pueden cambiar según la temporada, así que confírmalos antes de organizar tu visita.",
      },
    ],
  },
  stay: {
    kicker: "Alojamiento con consejos locales",
    title: "Explora la cultura de Chios desde Kampos",
    text:
      "Voulamandis House ofrece una base tranquila cerca de la ciudad y el aeropuerto, manteniéndote conectado con rutas culturales, pueblos, playas y la zona sur de la mastiha.",
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

export const chiosMuseumsPageTr: ChiosMuseumsPageData = {
  seo: {
    canonicalPath: "/tr/sakiz-adasi-muzeleri/",
    title: "Sakız Adası Müzeleri | Voulamandis House",
    description:
      "Sakız Adası müzelerini keşfedin: mastik kültürü, arkeoloji, Bizans sanatı, denizcilik, nadir kitaplar ve folklor.",
    ogImage: museumImages.mastic,
  },
  hero: {
    kicker: "Sakız Adası müze rehberi",
    title: "Sakız Adası müzelerini keşfedin",
    description:
      "Arkeoloji, Bizans sanatı, denizcilik tarihi, edebiyat, folklor ve Sakız Adası’nın benzersiz mastik kültürünü keşfedin.",
    image: museumImages.mastic,
    primaryCta: {
      label: "Müzeleri keşfet",
      href: "#museums",
    },
    secondaryCta: {
      label: "Kampos’ta konakla",
      href: "/tr/sakiz-adasi-odalari/",
    },
  },
  intro: {
    kicker: "Kültür rotası",
    title: "Sakız Adası’nın tarihine uzanan kültürel bir rota",
    description:
      "Sakız Adası, müzelerinde, kütüphanelerinde ve koleksiyonlarında görülen zengin bir kültürel ve tarihi kimliğe sahiptir. Antik buluntulardan Bizans ikonalarına, denizcilik hikayelerinden nadir kitaplara, folklora ve mastik geleneklerine kadar müzeler adanın daha derin karakterini anlamaya yardımcı olur.",
    tip: {
      icon: "🏛️",
      title: "Kültürü ada rotalarınızla birleştirin",
      text:
        "Birçok müze Sakız şehir merkezinde veya yakınındadır; Mastik Müzesi ise güneyde, mastik köylerine yakındır. Kampos’taki Voulamandis House, müzeleri, köyleri, plajları ve yerel yemek duraklarını birleştirmek için pratik bir üstür.",
      linkLabel: "Voulamandis House odalarını görüntüleyin",
      href: "/tr/sakiz-adasi-odalari/",
    },
  },
  museums: [
    {
      id: "mastic-museum",
      name: "Sakız Mastik Müzesi",
      title: "Sakız Mastik Müzesi",
      description:
        "Sakız mastiğinin tarihine, yetiştirilmesine ve kültürel değerine adanmış bu müze, adanın en benzersiz ürünlerinden ve en güçlü sembollerinden birini açıklar.",
      image: museumImages.mastic,
      imageAlt: "Sakız Mastik Müzesi mastik tarihine adanmış müze",
      href: "/tr/sakiz-adasi-muzeleri/sakiz-mastik-muzesi/",
      region: "Güney Sakız",
      mood: "Mastik kültürü",
      badges: ["Mastik", "Kültür", "Güney"],
      size: "large",
    },
    {
      id: "archaeological-museum",
      name: "Sakız Arkeoloji Müzesi",
      title: "Sakız Arkeoloji Müzesi",
      description:
        "Sakız şehir merkezinde yer alan bu önemli müzede Neolitik dönemden Roma dönemine kadar seramikler, figürinler, takılar ve heykeller gibi buluntular sergilenir.",
      image: museumImages.archaeological,
      imageAlt: "Sakız Arkeoloji Müzesi antik buluntular",
      href: "/tr/sakiz-adasi-muzeleri/arkeoloji-muzesi-sakiz/",
      region: "Sakız Şehri",
      mood: "Antik tarih",
      badges: ["Arkeoloji", "Antik Sakız", "Şehir"],
      size: "tall",
    },
    {
      id: "byzantine-museum",
      name: "Sakız Bizans Müzesi",
      title: "Sakız Bizans Müzesi",
      description:
        "Bizans ve Bizans sonrası sanata odaklanan bu müzede ikonalar, freskler, el yazmaları ve adanın dini tarihiyle bağlantılı eserler bulunur.",
      image: museumImages.byzantine,
      imageAlt: "Sakız Bizans Müzesi Bizans sanatı",
      href: "/tr/sakiz-adasi-muzeleri/bizans-muzesi-sakiz/",
      region: "Sakız Şehri",
      mood: "Bizans sanatı",
      badges: ["İkonalar", "Bizans", "Kültür"],
      size: "normal",
    },
    {
      id: "koraes-library",
      name: "Korais Kütüphanesi",
      title: "Korais Kütüphanesi",
      description:
        "Yunan edebiyatı ve kültürüne adanmış, nadir kitaplar, el yazmaları, arşivler ve müze koleksiyonları içeren Yunanistan’ın en önemli kütüphanelerinden biri.",
      image: museumImages.koraes,
      imageAlt: "Sakız Korais Kütüphanesi nadir kitaplar ve el yazmaları",
      href: "/tr/sakiz-adasi-muzeleri/korais-kutuphanesi-sakiz/",
      region: "Sakız Şehri",
      mood: "Nadir kitaplar",
      badges: ["Kütüphane", "El yazmaları", "Korais"],
      size: "normal",
    },
    {
      id: "maritime-museum",
      name: "Sakız Denizcilik Müzesi",
      title: "Sakız Denizcilik Müzesi",
      description:
        "Sakız’ın denizcilik tarihini, gemi yapımını, navigasyonu, ticareti ve deniz geleneklerini modeller, araçlar ve sergiler aracılığıyla anlatan bir müze.",
      image: museumImages.maritime,
      imageAlt: "Sakız Denizcilik Müzesi gemi modelleri",
      href: "/tr/sakiz-adasi-muzeleri/denizcilik-muzesi-sakiz/",
      region: "Sakız Şehri",
      mood: "Denizcilik mirası",
      badges: ["Gemiler", "Navigasyon", "Ticaret"],
      size: "wide",
    },
    {
      id: "kallimasia-folklore",
      name: "Kallimasia Folklor Müzesi",
      title: "Kallimasia Folklor Müzesi",
      description:
        "Sakız köylerinin günlük yaşamını, yerel geleneklerini, araçlarını, kıyafetlerini ve kültürel hafızasını anlamaya yardımcı olan bir folklor müzesi.",
      image: museumImages.folklore,
      imageAlt: "Kallimasia Folklor Müzesi geleneksel objeler",
      href: "/tr/sakiz-adasi-muzeleri/kallimasia-folklor-muzesi/",
      region: "Kallimasia",
      mood: "Folklor",
      badges: ["Gelenek", "Köy yaşamı", "Folklor"],
      size: "wide",
    },
  ],
  planning: {
    kicker: "Yerel planlama önerileri",
    title: "Sakız Adası müze ziyaretlerinizi nasıl planlarsınız",
    description:
      "Sakız müzeleri, keşfetmek istediğiniz bölgeye göre şehir yürüyüşleri, köy rotaları ve yemek duraklarıyla kolayca birleştirilebilir.",
    items: [
      {
        icon: "🏛️",
        title: "Şehirde kültür günü planlayın",
        text:
          "Arkeoloji Müzesi, Bizans Müzesi, Korais Kütüphanesi ve Denizcilik Müzesi’ni Sakız şehir merkezinde bir günde birleştirin.",
      },
      {
        icon: "🌿",
        title: "Mastik kültürünü güney köyleriyle birleştirin",
        text:
          "Mastik Müzesi’ni Pyrgi, Mesta, Olympoi veya güney Sakız’daki diğer köylerle birlikte ziyaret edin.",
      },
      {
        icon: "🕰️",
        title: "Açılış saatlerini kontrol edin",
        text:
          "Müze saatleri sezona göre değişebilir; ziyaretinizi planlamadan önce saatleri doğrulayın.",
      },
    ],
  },
  stay: {
    kicker: "Yerel tavsiyelerle konaklayın",
    title: "Sakız kültürünü Kampos’tan keşfedin",
    text:
      "Voulamandis House, şehir merkezine ve havaalanına yakın sakin bir üs sunarken kültür rotalarına, köylere, plajlara ve güney mastik bölgesine kolay bağlantı sağlar.",
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

export function getLocalizedChiosMuseumsPageByPath(
  path: string,
): ChiosMuseumsPageData | undefined {
  switch (path) {
    case chiosMuseumsPageEl.seo.canonicalPath:
      return chiosMuseumsPageEl;
    case chiosMuseumsPageFr.seo.canonicalPath:
      return chiosMuseumsPageFr;
    case chiosMuseumsPageDe.seo.canonicalPath:
      return chiosMuseumsPageDe;
    case chiosMuseumsPageIt.seo.canonicalPath:
      return chiosMuseumsPageIt;
    case chiosMuseumsPageEs.seo.canonicalPath:
      return chiosMuseumsPageEs;
    case chiosMuseumsPageTr.seo.canonicalPath:
      return chiosMuseumsPageTr;
    default:
      return undefined;
  }
}