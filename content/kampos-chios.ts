export type KamposChiosPageData = {
  language: "en" | "el" | "fr" | "de" | "it" | "es" | "tr";
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
    imageAlt: string;
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
    title: string;
    paragraphs: string[];
  };
  sections: {
    title: string;
    text: string;
    image: string;
    imageAlt: string;
  }[];
  highlights: {
    label: string;
    value: string;
  }[];
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
  gallery: {
    image: string;
    imageAlt: string;
  }[];
};

const heroImage = "/images/kampos/kambos-chios.jpg";
const mansionGardenImage = "/images/kampos/kampos-chios-mansion-garden.webp";
const antouanikoImage = "/images/kampos/antouaniko-kampos-chios.webp";
const citrusEstateImage = "/images/kampos/kampos-chios-citrus-estate.webp";
const stoneMansionImage = "/images/kampos/kampos-chios-stone-mansion.webp";
const citrusPathImage = "/images/kampos/kampos-chios-citrus-garden-path.webp";
const historicEstateImage = "/images/kampos/kampos-chios-historic-estate.webp";

export const kamposChiosPaths = {
  en: "/chios/kampos-chios/",
  el: "/el/chios/kampos-chios/",
  fr: "/fr/chios/kampos-chios/",
  de: "/de/chios/kampos-chios/",
  it: "/it/chios/kampos-chios/",
  es: "/es/chios/kampos-chios/",
  tr: "/tr/chios/kampos-chios/",
} as const;

export const kamposChiosPageEn: KamposChiosPageData = {
  language: "en",
  seo: {
    canonicalPath: kamposChiosPaths.en,
    title: "Discover Kampos Chios 2026 | Citrus Mansions Guide",
    description:
      "Explore Kampos Chios, the historic citrus estate area where Voulamandis House offers an authentic stay near Chios Town, airport and beaches.",
    ogImage: heroImage,
  },
  hero: {
    kicker: "Historic Kampos Chios",
    title: "Kampos Chios: the citrus heart of the island",
    description:
      "Walk through one of Chios Island’s most atmospheric areas, where stone mansions, citrus gardens, high walls and quiet lanes tell the story of local aristocratic life.",
    image: heroImage,
    imageAlt: "Historic mansions and citrus gardens in Kampos Chios",
    primaryCta: {
      label: "View rooms",
      href: "/chios-rooms/",
    },
    secondaryCta: {
      label: "Check rates",
      href: "/chios-hotels-rates/",
    },
  },
  intro: {
    title: "A special area for an authentic stay in Chios",
    paragraphs: [
      "Kampos of Chios is one of the island’s most distinctive and historic areas, known for its mansions, stone gateways, citrus orchards and peaceful atmosphere.",
      "Located close to Chios Town and the airport, Kampos is ideal for travelers who want authentic character, easy access and a quieter base for exploring the island.",
      "Voulamandis House is located in the heart of Kampos, making the area part of the stay itself, not just a place on the map.",
    ],
  },
  sections: [
    {
      title: "Mansions, citrus gardens and high stone walls",
      text:
        "The historic estates of Kampos combine local architecture with nature. Behind tall stone walls, citrus gardens, courtyards, wells and elegant mansions create one of the most unique landscapes in Chios.",
      image: mansionGardenImage,
      imageAlt: "Traditional Kampos Chios mansion surrounded by citrus gardens",
    },
    {
      title: "A living piece of Chios history",
      text:
        "From the Genoese period and the old aristocratic families of Chios, Kampos developed into an area of refined houses, arched doors, painted ceilings, marble yards and impressive garden entrances.",
      image: antouanikoImage,
      imageAlt: "Antouaniko mansion in Kampos Chios with historic architecture",
    },
    {
      title: "Perfect for slow walks and quiet discovery",
      text:
        "Kampos is not a beach. It is a historic residential area made for slow walks, citrus aromas, hidden courtyards and a deeper sense of place before heading out to the beaches, villages and museums of Chios.",
      image: citrusPathImage,
      imageAlt: "Citrus garden path in the historic Kampos area of Chios",
    },
  ],
  highlights: [
    { label: "Known for", value: "Citrus mansions" },
    { label: "Best for", value: "Authentic stays" },
    { label: "Distance", value: "Near Chios Town" },
    { label: "Stay", value: "Voulamandis House" },
  ],
  stay: {
    kicker: "Stay in Kampos",
    title: "Voulamandis House in the heart of Kampos",
    text:
      "Choose Voulamandis House for a peaceful stay among citrus gardens, historic architecture and easy routes to Chios Town, the airport, beaches and villages.",
    primaryCta: {
      label: "Book your stay",
      href: "/chios-hotels-rates/",
    },
    secondaryCta: {
      label: "See rooms",
      href: "/chios-rooms/",
    },
  },
  gallery: [
    { image: heroImage, imageAlt: "Historic mansions and citrus gardens in Kampos Chios" },
    { image: citrusEstateImage, imageAlt: "Citrus estate and traditional stone walls in Kampos Chios" },
    { image: stoneMansionImage, imageAlt: "Stone mansion and traditional architecture in Kampos Chios" },
    { image: historicEstateImage, imageAlt: "Historic estate in Kampos Chios with traditional architecture" },
  ],
};

export const kamposChiosPageEl: KamposChiosPageData = {
  language: "el",
  seo: {
    canonicalPath: kamposChiosPaths.el,
    title: "Ανακαλύψτε τον Κάμπο Χίου 2026 | Αρχοντικά",
    description:
      "Γνωρίστε τον Κάμπο της Χίου, την ιστορική περιοχή με αρχοντικά και περιβόλια όπου το Voulamandis House προσφέρει αυθεντική διαμονή.",
    ogImage: heroImage,
  },
  hero: {
    kicker: "Ιστορικός Κάμπος Χίου",
    title: "Κάμπος Χίου: η αρχοντική καρδιά του νησιού",
    description:
      "Περπατήστε σε μία από τις πιο ιδιαίτερες περιοχές της Χίου, με πέτρινα αρχοντικά, περιβόλια εσπεριδοειδών, ψηλούς τοίχους και ατμόσφαιρα παλιάς αρχοντιάς.",
    image: heroImage,
    imageAlt: "Αρχοντικά και περιβόλια εσπεριδοειδών στον Κάμπο της Χίου",
    primaryCta: {
      label: "Δείτε δωμάτια",
      href: "/el/domatia-xios/",
    },
    secondaryCta: {
      label: "Δείτε τιμές",
      href: "/el/amesi-kratisi-voulamandis-house/",
    },
  },
  intro: {
    title: "Μια ξεχωριστή περιοχή για αυθεντική διαμονή στη Χίο",
    paragraphs: [
      "Ο Κάμπος της Χίου είναι μία από τις πιο χαρακτηριστικές και ιστορικές περιοχές του νησιού, γνωστή για τα αρχοντικά, τις πέτρινες αυλόπορτες, τα περιβόλια και τα αρώματα των εσπεριδοειδών.",
      "Η θέση του, κοντά στην πόλη της Χίου και το αεροδρόμιο, είναι ιδανική για ταξιδιώτες που θέλουν αυθεντική ατμόσφαιρα, ηρεμία και εύκολη πρόσβαση στο νησί.",
      "Το Voulamandis House βρίσκεται στην καρδιά του Κάμπου, ώστε η ίδια η περιοχή να γίνεται μέρος της εμπειρίας διαμονής.",
    ],
  },
  sections: [
    {
      title: "Αρχοντικά, περιβόλια και ψηλοί πέτρινοι τοίχοι",
      text:
        "Τα ιστορικά κτήματα του Κάμπου συνδυάζουν την τοπική αρχιτεκτονική με τη φύση. Πίσω από τους ψηλούς τοίχους κρύβονται περιβόλια, αυλές, πηγάδια και αρχοντικά που δημιουργούν ένα μοναδικό τοπίο στη Χίο.",
      image: mansionGardenImage,
      imageAlt: "Παραδοσιακό αρχοντικό στον Κάμπο της Χίου μέσα σε περιβόλια",
    },
    {
      title: "Ένα ζωντανό κομμάτι της ιστορίας της Χίου",
      text:
        "Από την εποχή των Γενουατών και των παλιών αρχοντικών οικογενειών, ο Κάμπος εξελίχθηκε σε περιοχή με κομψές κατοικίες, καμάρες, ζωγραφιστά ταβάνια, μαρμάρινες αυλές και επιβλητικές αυλόπορτες.",
      image: antouanikoImage,
      imageAlt: "Αντουάνικο αρχοντικό στον Κάμπο της Χίου με ιστορική αρχιτεκτονική",
    },
    {
      title: "Ιδανικός για περίπατο και ήρεμη ανακάλυψη",
      text:
        "Ο Κάμπος δεν είναι παραλία. Είναι μια ιστορική κατοικημένη περιοχή για αργούς περιπάτους, αρώματα εσπεριδοειδών, κρυμμένες αυλές και αυθεντική αίσθηση τόπου πριν εξερευνήσετε παραλίες, χωριά και μουσεία της Χίου.",
      image: citrusPathImage,
      imageAlt: "Μονοπάτι μέσα σε περιβόλι εσπεριδοειδών στον ιστορικό Κάμπο της Χίου",
    },
  ],
  highlights: [
    { label: "Γνωστός για", value: "Αρχοντικά & περιβόλια" },
    { label: "Ιδανικός για", value: "Αυθεντική διαμονή" },
    { label: "Τοποθεσία", value: "Κοντά στην πόλη" },
    { label: "Διαμονή", value: "Voulamandis House" },
  ],
  stay: {
    kicker: "Διαμονή στον Κάμπο",
    title: "Το Voulamandis House στην καρδιά του Κάμπου",
    text:
      "Επιλέξτε το Voulamandis House για ήρεμη διαμονή ανάμεσα σε περιβόλια, ιστορική αρχιτεκτονική και εύκολες διαδρομές προς πόλη, αεροδρόμιο, παραλίες και χωριά.",
    primaryCta: {
      label: "Κάντε κράτηση",
      href: "/el/amesi-kratisi-voulamandis-house/",
    },
    secondaryCta: {
      label: "Δείτε δωμάτια",
      href: "/el/domatia-xios/",
    },
  },
  gallery: [
    { image: heroImage, imageAlt: "Αρχοντικά και περιβόλια εσπεριδοειδών στον Κάμπο της Χίου" },
    { image: citrusEstateImage, imageAlt: "Περιβόλι εσπεριδοειδών και παραδοσιακοί πέτρινοι τοίχοι στον Κάμπο της Χίου" },
    { image: stoneMansionImage, imageAlt: "Πέτρινο αρχοντικό και παραδοσιακή αρχιτεκτονική στον Κάμπο της Χίου" },
    { image: historicEstateImage, imageAlt: "Ιστορικό κτήμα στον Κάμπο της Χίου με παραδοσιακή αρχιτεκτονική" },
  ],
};

export const kamposChiosPageFr: KamposChiosPageData = {
  ...kamposChiosPageEn,
  language: "fr",
  seo: {
    canonicalPath: kamposChiosPaths.fr,
    title: "Découvrez Kampos Chios 2026 | Demeures & agrumes",
    description:
      "Explorez Kampos à Chios, quartier historique d’agrumes et de demeures où Voulamandis House offre un séjour authentique.",
    ogImage: heroImage,
  },
  hero: {
    ...kamposChiosPageEn.hero,
    kicker: "Kampos historique",
    title: "Kampos de Chios : demeures, agrumes et histoire",
    description:
      "Découvrez l’un des quartiers les plus atmosphériques de Chios, avec demeures en pierre, jardins d’agrumes, hauts murs et ruelles paisibles.",
    primaryCta: { label: "Voir les chambres", href: "/fr/chambres-a-chios/" },
    secondaryCta: { label: "Voir les tarifs", href: "/fr/tarifs-hotels-chios/" },
  },
};

export const kamposChiosPageDe: KamposChiosPageData = {
  ...kamposChiosPageEn,
  language: "de",
  seo: {
    canonicalPath: kamposChiosPaths.de,
    title: "Kampos auf Chios 2026 | Herrenhäuser & Zitrusgärten",
    description:
      "Entdecken Sie Kampos auf Chios, das historische Viertel der Zitrusgärten, in dem Voulamandis House authentische Ruhe bietet.",
    ogImage: heroImage,
  },
  hero: {
    ...kamposChiosPageEn.hero,
    kicker: "Historisches Kampos",
    title: "Kampos auf Chios: Herrenhäuser und Zitrusgärten",
    description:
      "Erleben Sie eines der stimmungsvollsten Gebiete von Chios mit Steinhäusern, Zitrusgärten, hohen Mauern und ruhigen Wegen.",
    primaryCta: { label: "Zimmer ansehen", href: "/de/chios-zimmer/" },
    secondaryCta: { label: "Preise ansehen", href: "/de/chios-hotelpreise/" },
  },
};

export const kamposChiosPageIt: KamposChiosPageData = {
  ...kamposChiosPageEn,
  language: "it",
  seo: {
    canonicalPath: kamposChiosPaths.it,
    title: "Scopri Kampos Chios 2026 | Dimore e agrumeti",
    description:
      "Visita Kampos a Chios, area storica con dimore e agrumeti dove Voulamandis House offre un soggiorno autentico.",
    ogImage: heroImage,
  },
  hero: {
    ...kamposChiosPageEn.hero,
    kicker: "Kampos storico",
    title: "Kampos di Chios: dimore, agrumi e storia",
    description:
      "Scopri una delle zone più suggestive di Chios, con dimore in pietra, agrumeti, alti muri e strade tranquille.",
    primaryCta: { label: "Vedi camere", href: "/it/camere-a-chios/" },
    secondaryCta: { label: "Vedi tariffe", href: "/it/prezzi-hotel-chios/" },
  },
};

export const kamposChiosPageEs: KamposChiosPageData = {
  ...kamposChiosPageEn,
  language: "es",
  seo: {
    canonicalPath: kamposChiosPaths.es,
    title: "Descubre Kampos de Chios 2026 | Mansiones y cítricos",
    description:
      "Explora Kampos de Chios, zona histórica de cítricos y mansiones donde Voulamandis House ofrece una estancia auténtica.",
    ogImage: heroImage,
  },
  hero: {
    ...kamposChiosPageEn.hero,
    kicker: "Kampos histórico",
    title: "Kampos de Chios: mansiones, cítricos e historia",
    description:
      "Descubre una de las zonas más especiales de Chios, con mansiones de piedra, jardines cítricos, altos muros y caminos tranquilos.",
    primaryCta: { label: "Ver habitaciones", href: "/es/habitaciones-en-chios/" },
    secondaryCta: { label: "Ver tarifas", href: "/es/tarifas-hoteles-chios/" },
  },
};

export const kamposChiosPageTr: KamposChiosPageData = {
  ...kamposChiosPageEn,
  language: "tr",
  seo: {
    canonicalPath: kamposChiosPaths.tr,
    title: "Sakız Adası Kampos 2026 | Tarihi Konaklar",
    description:
      "Sakız Adası Kampos bölgesini keşfedin; tarihi konaklar, narenciye bahçeleri ve Voulamandis House ile otantik konaklama.",
    ogImage: heroImage,
  },
  hero: {
    ...kamposChiosPageEn.hero,
    kicker: "Tarihi Kampos",
    title: "Sakız Adası Kampos: tarihi konaklar ve narenciye bahçeleri",
    description:
      "Taş konakları, narenciye bahçeleri, yüksek duvarları ve sakin yollarıyla Sakız Adası’nın en özel bölgelerinden birini keşfedin.",
    primaryCta: { label: "Odaları gör", href: "/tr/sakiz-adasi-odalari/" },
    secondaryCta: { label: "Fiyatları gör", href: "/tr/sakiz-adasi-otel-fiyatlari/" },
  },
};

export const kamposChiosPages = {
  en: kamposChiosPageEn,
  el: kamposChiosPageEl,
  fr: kamposChiosPageFr,
  de: kamposChiosPageDe,
  it: kamposChiosPageIt,
  es: kamposChiosPageEs,
  tr: kamposChiosPageTr,
} as const;
