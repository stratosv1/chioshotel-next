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

const heroImage = "/images/kampos/kambos-chios-v2.webp";
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
    imageAlt: "Demeures historiques et jardins d’agrumes à Kampos Chios",
    primaryCta: { label: "Voir les chambres", href: "/fr/chambres-a-chios/" },
    secondaryCta: { label: "Voir les tarifs", href: "/fr/tarifs-des-hotels-a-chios/" },
  },
  intro: {
    title: "Un quartier idéal pour un séjour authentique à Chios",
    paragraphs: [
      "Kampos de Chios est l’un des quartiers les plus distinctifs et historiques de l’île, connu pour ses demeures, ses portails en pierre, ses vergers d’agrumes et son atmosphère paisible.",
      "Proche de la ville de Chios et de l’aéroport, Kampos convient aux voyageurs qui recherchent du caractère, de la tranquillité et un accès facile au reste de l’île.",
      "Voulamandis House se trouve au cœur de Kampos, pour que le quartier fasse partie de l’expérience du séjour, et pas seulement d’une visite.",
    ],
  },
  sections: [
    {
      title: "Demeures, jardins d’agrumes et hauts murs de pierre",
      text:
        "Les domaines historiques de Kampos associent architecture locale et nature. Derrière les hauts murs en pierre se cachent jardins d’agrumes, cours, puits et demeures élégantes qui composent l’un des paysages les plus uniques de Chios.",
      image: mansionGardenImage,
      imageAlt: "Demeure traditionnelle de Kampos Chios entourée de jardins d’agrumes",
    },
    {
      title: "Un morceau vivant de l’histoire de Chios",
      text:
        "Depuis la période génoise et les anciennes familles de Chios, Kampos s’est développé comme un quartier de maisons raffinées, portes arquées, plafonds peints, cours en marbre et entrées de jardins impressionnantes.",
      image: antouanikoImage,
      imageAlt: "Demeure Antouaniko à Kampos Chios avec architecture historique",
    },
    {
      title: "Parfait pour les promenades lentes et la découverte",
      text:
        "Kampos n’est pas une plage. C’est un quartier résidentiel historique, idéal pour marcher lentement, sentir les agrumes, découvrir des cours cachées et ressentir l’identité de Chios avant de partir vers les plages, villages et musées.",
      image: citrusPathImage,
      imageAlt: "Chemin dans un jardin d’agrumes du quartier historique de Kampos à Chios",
    },
  ],
  highlights: [
    { label: "Connu pour", value: "Demeures & agrumes" },
    { label: "Idéal pour", value: "Séjours authentiques" },
    { label: "Situation", value: "Près de Chios ville" },
    { label: "Séjour", value: "Voulamandis House" },
  ],
  stay: {
    kicker: "Séjourner à Kampos",
    title: "Voulamandis House au cœur de Kampos",
    text:
      "Choisissez Voulamandis House pour un séjour paisible entre jardins d’agrumes, architecture historique et accès facile à la ville de Chios, à l’aéroport, aux plages et aux villages.",
    primaryCta: {
      label: "Réserver votre séjour",
      href: "/fr/tarifs-des-hotels-a-chios/",
    },
    secondaryCta: {
      label: "Voir les chambres",
      href: "/fr/chambres-a-chios/",
    },
  },
  gallery: [
    { image: heroImage, imageAlt: "Demeures historiques et jardins d’agrumes à Kampos Chios" },
    { image: citrusEstateImage, imageAlt: "Domaine d’agrumes et murs en pierre traditionnels à Kampos Chios" },
    { image: stoneMansionImage, imageAlt: "Demeure en pierre et architecture traditionnelle à Kampos Chios" },
    { image: historicEstateImage, imageAlt: "Domaine historique à Kampos Chios avec architecture traditionnelle" },
  ],
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
    imageAlt: "Historische Herrenhäuser und Zitrusgärten in Kampos auf Chios",
    primaryCta: { label: "Zimmer ansehen", href: "/de/chios-zimmer/" },
    secondaryCta: { label: "Preise ansehen", href: "/de/hotelpreise-auf-der-insel-chios/" },
  },
  intro: {
    title: "Ein besonderer Ort für einen authentischen Aufenthalt auf Chios",
    paragraphs: [
      "Kampos auf Chios gehört zu den charakteristischsten und historischsten Gegenden der Insel, bekannt für Herrenhäuser, steinerne Tore, Zitrusgärten und eine ruhige Atmosphäre.",
      "Dank der Nähe zur Stadt Chios und zum Flughafen ist Kampos ideal für Reisende, die Authentizität, Ruhe und einfache Wege über die Insel suchen.",
      "Voulamandis House liegt im Herzen von Kampos, sodass die Umgebung selbst Teil des Aufenthalts wird.",
    ],
  },
  sections: [
    {
      title: "Herrenhäuser, Zitrusgärten und hohe Steinmauern",
      text:
        "Die historischen Anwesen von Kampos verbinden lokale Architektur mit Natur. Hinter hohen Steinmauern liegen Zitrusgärten, Innenhöfe, Brunnen und elegante Häuser, die eine der einzigartigsten Landschaften von Chios bilden.",
      image: mansionGardenImage,
      imageAlt: "Traditionelles Herrenhaus in Kampos auf Chios, umgeben von Zitrusgärten",
    },
    {
      title: "Ein lebendiges Stück Geschichte von Chios",
      text:
        "Seit der genuesischen Zeit und den alten Familien von Chios entwickelte sich Kampos zu einer Gegend mit eleganten Häusern, Bogentüren, bemalten Decken, Marmorböden und eindrucksvollen Garteneingängen.",
      image: antouanikoImage,
      imageAlt: "Antouaniko-Herrenhaus in Kampos auf Chios mit historischer Architektur",
    },
    {
      title: "Perfekt für ruhige Spaziergänge und Entdeckungen",
      text:
        "Kampos ist kein Strand. Es ist ein historisches Wohnviertel für langsame Spaziergänge, Zitrusdüfte, versteckte Höfe und ein tieferes Gefühl für Chios, bevor Sie Strände, Dörfer und Museen erkunden.",
      image: citrusPathImage,
      imageAlt: "Weg durch einen Zitrusgarten im historischen Kampos auf Chios",
    },
  ],
  highlights: [
    { label: "Bekannt für", value: "Herrenhäuser & Zitrusgärten" },
    { label: "Ideal für", value: "Authentische Aufenthalte" },
    { label: "Lage", value: "Nahe Chios-Stadt" },
    { label: "Aufenthalt", value: "Voulamandis House" },
  ],
  stay: {
    kicker: "Aufenthalt in Kampos",
    title: "Voulamandis House im Herzen von Kampos",
    text:
      "Wählen Sie Voulamandis House für einen ruhigen Aufenthalt zwischen Zitrusgärten, historischer Architektur und einfachen Wegen zur Stadt Chios, zum Flughafen, zu Stränden und Dörfern.",
    primaryCta: {
      label: "Aufenthalt buchen",
      href: "/de/hotelpreise-auf-der-insel-chios/",
    },
    secondaryCta: {
      label: "Zimmer ansehen",
      href: "/de/chios-zimmer/",
    },
  },
  gallery: [
    { image: heroImage, imageAlt: "Historische Herrenhäuser und Zitrusgärten in Kampos auf Chios" },
    { image: citrusEstateImage, imageAlt: "Zitrusanwesen und traditionelle Steinmauern in Kampos auf Chios" },
    { image: stoneMansionImage, imageAlt: "Steinhaus und traditionelle Architektur in Kampos auf Chios" },
    { image: historicEstateImage, imageAlt: "Historisches Anwesen in Kampos auf Chios mit traditioneller Architektur" },
  ],
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
    imageAlt: "Dimore storiche e giardini di agrumi a Kampos Chios",
    primaryCta: { label: "Vedi camere", href: "/it/camere-a-chios/" },
    secondaryCta: { label: "Vedi tariffe", href: "/it/prezzi-hotel-chios/" },
  },
  intro: {
    title: "Una zona speciale per un soggiorno autentico a Chios",
    paragraphs: [
      "Kampos di Chios è una delle aree più caratteristiche e storiche dell’isola, conosciuta per le sue dimore, i portali in pietra, gli agrumeti e l’atmosfera tranquilla.",
      "Vicino alla città di Chios e all’aeroporto, Kampos è ideale per chi cerca autenticità, quiete e facile accesso al resto dell’isola.",
      "Voulamandis House si trova nel cuore di Kampos, così la zona diventa parte dell’esperienza del soggiorno.",
    ],
  },
  sections: [
    {
      title: "Dimore, agrumeti e alti muri in pietra",
      text:
        "Le tenute storiche di Kampos uniscono architettura locale e natura. Dietro gli alti muri in pietra si trovano agrumeti, cortili, pozzi e dimore eleganti che creano uno dei paesaggi più particolari di Chios.",
      image: mansionGardenImage,
      imageAlt: "Dimora tradizionale di Kampos Chios circondata da agrumeti",
    },
    {
      title: "Un pezzo vivo della storia di Chios",
      text:
        "Dal periodo genovese e dalle antiche famiglie di Chios, Kampos si è sviluppato come area di case raffinate, porte ad arco, soffitti dipinti, cortili in marmo e ingressi monumentali ai giardini.",
      image: antouanikoImage,
      imageAlt: "Dimora Antouaniko a Kampos Chios con architettura storica",
    },
    {
      title: "Perfetto per passeggiate lente e scoperte tranquille",
      text:
        "Kampos non è una spiaggia. È un quartiere residenziale storico, ideale per camminare lentamente, sentire il profumo degli agrumi, scoprire cortili nascosti e percepire l’identità di Chios prima di visitare spiagge, villaggi e musei.",
      image: citrusPathImage,
      imageAlt: "Sentiero in un giardino di agrumi nello storico Kampos di Chios",
    },
  ],
  highlights: [
    { label: "Famoso per", value: "Dimore e agrumeti" },
    { label: "Ideale per", value: "Soggiorni autentici" },
    { label: "Posizione", value: "Vicino a Chios città" },
    { label: "Soggiorno", value: "Voulamandis House" },
  ],
  stay: {
    kicker: "Soggiornare a Kampos",
    title: "Voulamandis House nel cuore di Kampos",
    text:
      "Scegli Voulamandis House per un soggiorno tranquillo tra agrumeti, architettura storica e collegamenti facili verso la città di Chios, l’aeroporto, le spiagge e i villaggi.",
    primaryCta: {
      label: "Prenota il soggiorno",
      href: "/it/prezzi-hotel-chios/",
    },
    secondaryCta: {
      label: "Vedi camere",
      href: "/it/camere-a-chios/",
    },
  },
  gallery: [
    { image: heroImage, imageAlt: "Dimore storiche e giardini di agrumi a Kampos Chios" },
    { image: citrusEstateImage, imageAlt: "Tenuta di agrumi e muri tradizionali in pietra a Kampos Chios" },
    { image: stoneMansionImage, imageAlt: "Dimora in pietra e architettura tradizionale a Kampos Chios" },
    { image: historicEstateImage, imageAlt: "Tenuta storica a Kampos Chios con architettura tradizionale" },
  ],
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
    imageAlt: "Mansiones históricas y jardines cítricos en Kampos de Chios",
    primaryCta: { label: "Ver habitaciones", href: "/es/habitaciones-en-chios/" },
    secondaryCta: { label: "Ver tarifas", href: "/es/los-mejores-precios-de-hotel-en-la-isla-chios/" },
  },
  intro: {
    title: "Una zona especial para una estancia auténtica en Chios",
    paragraphs: [
      "Kampos de Chios es una de las zonas más características e históricas de la isla, conocida por sus mansiones, portales de piedra, huertos cítricos y ambiente tranquilo.",
      "Cerca de la ciudad de Chios y del aeropuerto, Kampos es ideal para viajeros que buscan autenticidad, calma y fácil acceso al resto de la isla.",
      "Voulamandis House se encuentra en el corazón de Kampos, por lo que la zona forma parte de la experiencia de la estancia.",
    ],
  },
  sections: [
    {
      title: "Mansiones, jardines cítricos y altos muros de piedra",
      text:
        "Las fincas históricas de Kampos combinan arquitectura local y naturaleza. Detrás de los altos muros de piedra aparecen jardines cítricos, patios, pozos y mansiones elegantes que crean uno de los paisajes más singulares de Chios.",
      image: mansionGardenImage,
      imageAlt: "Mansión tradicional de Kampos de Chios rodeada de jardines cítricos",
    },
    {
      title: "Una parte viva de la historia de Chios",
      text:
        "Desde la época genovesa y las antiguas familias de Chios, Kampos se desarrolló como una zona de casas refinadas, puertas arqueadas, techos pintados, patios de mármol y entradas monumentales a jardines.",
      image: antouanikoImage,
      imageAlt: "Mansión Antouaniko en Kampos de Chios con arquitectura histórica",
    },
    {
      title: "Perfecto para paseos lentos y descubrimientos tranquilos",
      text:
        "Kampos no es una playa. Es una zona residencial histórica para caminar despacio, sentir el aroma de los cítricos, descubrir patios ocultos y conectar con la identidad de Chios antes de explorar playas, pueblos y museos.",
      image: citrusPathImage,
      imageAlt: "Camino en un jardín cítrico del histórico Kampos de Chios",
    },
  ],
  highlights: [
    { label: "Conocido por", value: "Mansiones y cítricos" },
    { label: "Ideal para", value: "Estancias auténticas" },
    { label: "Ubicación", value: "Cerca de Chios ciudad" },
    { label: "Estancia", value: "Voulamandis House" },
  ],
  stay: {
    kicker: "Alojamiento en Kampos",
    title: "Voulamandis House en el corazón de Kampos",
    text:
      "Elige Voulamandis House para una estancia tranquila entre jardines cítricos, arquitectura histórica y rutas fáciles hacia la ciudad de Chios, el aeropuerto, las playas y los pueblos.",
    primaryCta: {
      label: "Reserva tu estancia",
      href: "/es/los-mejores-precios-de-hotel-en-la-isla-chios/",
    },
    secondaryCta: {
      label: "Ver habitaciones",
      href: "/es/habitaciones-en-chios/",
    },
  },
  gallery: [
    { image: heroImage, imageAlt: "Mansiones históricas y jardines cítricos en Kampos de Chios" },
    { image: citrusEstateImage, imageAlt: "Finca cítrica y muros tradicionales de piedra en Kampos de Chios" },
    { image: stoneMansionImage, imageAlt: "Mansión de piedra y arquitectura tradicional en Kampos de Chios" },
    { image: historicEstateImage, imageAlt: "Finca histórica en Kampos de Chios con arquitectura tradicional" },
  ],
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
    imageAlt: "Sakız Adası Kampos bölgesinde tarihi konaklar ve narenciye bahçeleri",
    primaryCta: { label: "Odaları gör", href: "/tr/sakiz-adasi-odalari/" },
    secondaryCta: { label: "Fiyatları gör", href: "/tr/sakiz-adasi-rezervasyon/" },
  },
  intro: {
    title: "Sakız Adası’nda otantik bir konaklama için özel bir bölge",
    paragraphs: [
      "Kampos, Sakız Adası’nın en karakteristik ve tarihi bölgelerinden biridir; taş konakları, kemerli kapıları, narenciye bahçeleri ve sakin atmosferiyle bilinir.",
      "Sakız şehir merkezine ve havalimanına yakın konumu sayesinde Kampos, otantik bir ortam, huzur ve adayı keşfetmek için kolay ulaşım isteyen gezginler için idealdir.",
      "Voulamandis House, Kampos’un kalbinde yer alır; böylece bölge sadece haritada bir nokta değil, konaklama deneyiminin bir parçası olur.",
    ],
  },
  sections: [
    {
      title: "Konaklar, narenciye bahçeleri ve yüksek taş duvarlar",
      text:
        "Kampos’un tarihi mülkleri yerel mimariyi doğayla birleştirir. Yüksek taş duvarların arkasında narenciye bahçeleri, avlular, kuyular ve zarif konaklar Sakız Adası’nın en özgün manzaralarından birini oluşturur.",
      image: mansionGardenImage,
      imageAlt: "Sakız Adası Kampos bölgesinde narenciye bahçeleriyle çevrili geleneksel konak",
    },
    {
      title: "Sakız Adası tarihinin yaşayan bir parçası",
      text:
        "Ceneviz döneminden ve Sakız Adası’nın eski ailelerinden itibaren Kampos; zarif evleri, kemerli kapıları, boyalı tavanları, mermer avluları ve etkileyici bahçe girişleriyle özel bir yerleşim alanı olarak gelişmiştir.",
      image: antouanikoImage,
      imageAlt: "Sakız Adası Kampos bölgesinde tarihi mimariye sahip Antouaniko konağı",
    },
    {
      title: "Yavaş yürüyüşler ve sakin keşifler için ideal",
      text:
        "Kampos bir plaj değildir. Narenciye kokuları, gizli avlular, sessiz yollar ve Sakız Adası’nın kimliğini hissettiren tarihi bir yerleşim alanıdır; plajlara, köylere ve müzelere gitmeden önce keşfetmek için idealdir.",
      image: citrusPathImage,
      imageAlt: "Sakız Adası Kampos bölgesindeki tarihi narenciye bahçesinde yürüyüş yolu",
    },
  ],
  highlights: [
    { label: "Bilinen özelliği", value: "Konaklar ve narenciye" },
    { label: "En uygun", value: "Otantik konaklamalar" },
    { label: "Konum", value: "Sakız merkeze yakın" },
    { label: "Konaklama", value: "Voulamandis House" },
  ],
  stay: {
    kicker: "Kampos’ta konaklama",
    title: "Kampos’un kalbinde Voulamandis House",
    text:
      "Voulamandis House’u narenciye bahçeleri, tarihi mimari ve Sakız şehir merkezi, havalimanı, plajlar ve köylere kolay ulaşım için huzurlu bir konaklama noktası olarak seçin.",
    primaryCta: {
      label: "Konaklamanızı ayırtın",
      href: "/tr/sakiz-adasi-rezervasyon/",
    },
    secondaryCta: {
      label: "Odaları gör",
      href: "/tr/sakiz-adasi-odalari/",
    },
  },
  gallery: [
    { image: heroImage, imageAlt: "Sakız Adası Kampos bölgesinde tarihi konaklar ve narenciye bahçeleri" },
    { image: citrusEstateImage, imageAlt: "Sakız Adası Kampos bölgesinde narenciye arazisi ve geleneksel taş duvarlar" },
    { image: stoneMansionImage, imageAlt: "Sakız Adası Kampos bölgesinde taş konak ve geleneksel mimari" },
    { image: historicEstateImage, imageAlt: "Sakız Adası Kampos bölgesinde geleneksel mimariye sahip tarihi mülk" },
  ],
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
