import { type LanguageCode, normalizePath } from "@/lib/languages";

export type ExplorerLinkSet = Record<LanguageCode, string>;

export type ChiosExplorerImage = {
  src: string;
  alt: string;
};

export type ChiosExplorerHighlight = {
  title: string;
  text: string;
  image: ChiosExplorerImage;
  href: string;
};

export type ChiosExplorerStoryStep = {
  label: string;
  title: string;
  text: string;
};

export type ChiosExplorerPageContent = {
  locale: LanguageCode;
  path: string;
  seo: {
    title: string;
    description: string;
  };
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    image: ChiosExplorerImage;
    primaryCta: string;
    secondaryCta: string;
  };
  intro: {
    eyebrow: string;
    title: string;
    text: string;
  };
  highlights: {
    eyebrow: string;
    title: string;
    text: string;
    items: ChiosExplorerHighlight[];
  };
  story: {
    eyebrow: string;
    title: string;
    text: string;
    steps: ChiosExplorerStoryStep[];
  };
  stay: {
    eyebrow: string;
    title: string;
    text: string;
  };
  finalCta: {
    title: string;
    text: string;
    primaryCta: string;
    secondaryCta: string;
  };
  links: {
    booking: string;
    rooms: string;
    chiosGuide: string;
  };
};

export const chiosExplorerPaths: ExplorerLinkSet = {
  en: "/chios-explorer/",
  el: "/el/exerevnisi-xiou/",
  fr: "/fr/explorer-chios/",
  de: "/de/chios-entdecken/",
  it: "/it/esplora-chios/",
  es: "/es/explorar-quios/",
  tr: "/tr/sakiz-adasi-kesif/",
};

const bookingLinks: ExplorerLinkSet = {
  en: "/chios-hotels-rates/",
  el: "/el/amesi-kratisi-voulamandis-house/",
  fr: "/fr/tarifs-des-hotels-a-chios/",
  de: "/de/hotelpreise-auf-der-insel-chios/",
  it: "/it/prezzi-hotel-chios/",
  es: "/es/los-mejores-precios-de-hotel-en-la-isla-chios/",
  tr: "/tr/sakiz-adasi-rezervasyon/",
};

const roomsLinks: ExplorerLinkSet = {
  en: "/chios-rooms/",
  el: "/el/domatia-xios/",
  fr: "/fr/chambres-a-chios/",
  de: "/de/chios-zimmer/",
  it: "/it/camere-a-chios/",
  es: "/es/habitaciones-en-chios/",
  tr: "/tr/sakiz-adasi-odalari/",
};

const chiosGuideLinks: ExplorerLinkSet = {
  en: "/chios-island/",
  el: "/el/ti-na-do-sti-xio/",
  fr: "/fr/chios-en-grece/",
  de: "/de/chios-insel/",
  it: "/it/chios-lisola-in-grecia/",
  es: "/es/chios-en-grecia/",
  tr: "/tr/sakiz-adasi/",
};

const villagesLinks: ExplorerLinkSet = {
  en: "/chios/chios-villages/",
  el: "/el/xoria-xios/",
  fr: "/fr/villages-de-chios/",
  de: "/de/doerfer-chios/",
  it: "/it/villaggi-chios/",
  es: "/es/pueblos-chios/",
  tr: "/tr/sakiz-adasi-koyleri/",
};

const koraisLibraryLinks: ExplorerLinkSet = {
  en: "/chios/chios-museums/koraes-library-chios/",
  el: "/el/mouseia-xios/vivliothiki-korai-xios/",
  fr: "/fr/musees-de-chios/bibliotheque-korais-chios/",
  de: "/de/museen-chios/korais-bibliothek-chios/",
  it: "/it/musei-chios/biblioteca-korais-chios/",
  es: "/es/museos-chios/biblioteca-korais-chios/",
  tr: "/tr/sakiz-adasi-muzeleri/korais-kutuphanesi-sakiz/",
};

const masticMuseumLinks: ExplorerLinkSet = {
  en: "/chios/chios-museums/the-mastic-museum-chios/",
  el: "/el/mouseia-xios/mouseio-mastichas-xios/",
  fr: "/fr/musees-de-chios/musee-du-mastic-chios/",
  de: "/de/museen-chios/mastix-museum-chios/",
  it: "/it/musei-chios/museo-del-mastice-chios/",
  es: "/es/museos-chios/museo-mastiha-chios/",
  tr: "/tr/sakiz-adasi-muzeleri/sakiz-mastik-muzesi/",
};

const mestaLinks: ExplorerLinkSet = {
  en: "/chios/chios-villages/mesta-chios/",
  el: "/el/xoria-xios/mesta-xios/",
  fr: "/fr/villages-de-chios/village-mesta/",
  de: "/de/doerfer-chios/mesta-dorf/",
  it: "/it/villaggi-chios/villaggio-mesta/",
  es: "/es/pueblos-chios/pueblo-mesta/",
  tr: "/tr/sakiz-adasi-koyleri/mesta-koyu/",
};

const images = {
  koraisLibrary: {
    src: "https://chioshotel.gr/wp-content/uploads/2021/12/vivlitothiki-korai-1.webp",
    alt: "Korais Library in Chios with historic manuscripts and cultural treasures",
  },
  masticMuseum: {
    src: "https://chioshotel.gr/wp-content/uploads/2022/12/mousio.mastic.webp",
    alt: "Chios Mastic Museum and mastic tradition in southern Chios",
  },
  mesta: {
    src: "https://chioshotel.gr/wp-content/uploads/2021/12/9ac4cf44d16c4af6d873c5bba4a6696b_L.webp",
    alt: "Mesta medieval village stone alley in Chios",
  },
  anavatos: {
    src: "https://chioshotel.gr/wp-content/uploads/2026/02/anavatos-1.jpg",
    alt: "Anavatos medieval abandoned village in Chios with dramatic stone landscape",
  },
  hiking: {
    src: "https://chioshotel.gr/wp-content/uploads/2021/12/Hiking-Amani_1_Antonia-1.webp",
    alt: "Hiking trail in Amani, Chios with mountain landscape",
  },
  agiaMarkella: {
    src: "https://chioshotel.gr/wp-content/uploads/2026/02/ag-markella.jpg",
    alt: "Agia Markella Monastery by the sea in Chios",
  },
};

const content: Record<LanguageCode, ChiosExplorerPageContent> = {
  en: {
    locale: "en",
    path: chiosExplorerPaths.en,
    seo: {
      title: "Chios Explorer | Cultural Day Trips from Voulamandis House",
      description:
        "Explore the real Chios from Voulamandis House with museums, medieval villages, hiking routes, monasteries and authentic island experiences.",
    },
    hero: {
      eyebrow: "Chios Explorer",
      title: "Your Perfect Explorer Day with Voulamandis House",
      subtitle:
        "Discover the cultural heart of Chios through historic libraries, mastic traditions, medieval villages, mountain trails and peaceful sunset moments by the sea.",
      image: images.anavatos,
      primaryCta: "Plan your explorer stay",
      secondaryCta: "See rooms",
    },
    intro: {
      eyebrow: "Discover the real Chios",
      title: "One stay, a whole island of stories",
      text:
        "Voulamandis House is set in Kampos, one of the most atmospheric areas of Chios. From here, you can begin a day full of culture, nature, history and local character, returning in the evening to the calm of our garden.",
    },
    highlights: {
      eyebrow: "Explorer stops",
      title: "Places to discover during your Chios adventure",
      text:
        "Follow a route that connects the island’s intellectual heritage, mastic culture, medieval architecture, wild landscapes and spiritual coastline.",
      items: [
        {
          title: "Korais Library",
          text:
            "Visit one of Greece’s most important historic libraries, home to rare manuscripts and cultural treasures that reveal the intellectual heart of Chios.",
          image: images.koraisLibrary,
          href: koraisLibraryLinks.en,
        },
        {
          title: "Mastic Museum",
          text:
            "Discover the story of Chios’ world-famous mastic and the traditions that shaped the identity of the island through the centuries.",
          image: images.masticMuseum,
          href: masticMuseumLinks.en,
        },
        {
          title: "Mesta Village",
          text:
            "Walk through a beautifully preserved medieval settlement with stone alleys, archways and hidden squares where time seems to slow down.",
          image: images.mesta,
          href: mestaLinks.en,
        },
        {
          title: "Anavatos Village",
          text:
            "Explore the dramatic abandoned medieval village perched high above the landscape, with ruins, views and a powerful sense of history.",
          image: images.anavatos,
          href: villagesLinks.en,
        },
        {
          title: "Hiking in Chios",
          text:
            "Choose a scenic mountain or coastal trail and experience the island through panoramic views, wild nature and quiet paths.",
          image: images.hiking,
          href: chiosGuideLinks.en,
        },
        {
          title: "Agia Markella Monastery",
          text:
            "End the day at one of Chios’ most important pilgrimage sites, a peaceful place by the sea for reflection and sunset moments.",
          image: images.agiaMarkella,
          href: chiosGuideLinks.en,
        },
      ],
    },
    story: {
      eyebrow: "A perfect explorer day",
      title: "From Kampos mornings to sunset by the sea",
      text:
        "Begin with a peaceful walk through Kampos, enjoy a handmade breakfast at Voulamandis House and let the island open up through culture, villages, nature and quiet moments.",
      steps: [
        {
          label: "Morning",
          title: "Walk through Kampos",
          text:
            "Start among citrus orchards and historic mansions, feeling the timeless character of Chios come to life before breakfast.",
        },
        {
          label: "Culture",
          title: "Korais Library and Mastic Museum",
          text:
            "Explore rare manuscripts, local history and the story of mastic, one of the island’s most distinctive treasures.",
        },
        {
          label: "South Chios",
          title: "Mesta and Anavatos",
          text:
            "Continue to stone-built villages, medieval alleys and dramatic landscapes that reveal the deeper history of Chios.",
        },
        {
          label: "Nature",
          title: "Hiking routes and panoramic views",
          text:
            "Follow mountain or coastal trails and experience the island’s quieter, wilder side.",
        },
        {
          label: "Sunset",
          title: "Agia Markella and return to Voulamandis House",
          text:
            "Close the day by the sea, then return to the garden under the vine for wine, soft music and the satisfaction of a day full of discovery.",
        },
      ],
    },
    stay: {
      eyebrow: "Stay in Kampos",
      title: "A calm base for curious travellers",
      text:
        "Voulamandis House gives you the feeling of staying close to the real island. Wake up in Kampos, explore Chios during the day and return to a peaceful garden atmosphere in the evening.",
    },
    finalCta: {
      title: "Ready to design your stay?",
      text:
        "Tell us a few details about your trip and we will help you shape your personal Chios exploration experience.",
      primaryCta: "Check availability",
      secondaryCta: "Explore Chios guide",
    },
    links: {
      booking: bookingLinks.en,
      rooms: roomsLinks.en,
      chiosGuide: chiosGuideLinks.en,
    },
  },

  el: {
    locale: "el",
    path: chiosExplorerPaths.el,
    seo: {
      title: "Εξερεύνηση Χίου | Πολιτιστικές διαδρομές από το Voulamandis House",
      description:
        "Γνωρίστε την αυθεντική Χίο από το Voulamandis House με μουσεία, μεσαιωνικά χωριά, πεζοπορίες, μοναστήρια και εμπειρίες γεμάτες τοπικό χαρακτήρα.",
    },
    hero: {
      eyebrow: "Chios Explorer",
      title: "Η ιδανική ημέρα εξερεύνησης με βάση το Voulamandis House",
      subtitle:
        "Ανακαλύψτε την πολιτιστική καρδιά της Χίου μέσα από ιστορικές βιβλιοθήκες, τη μαστίχα, μεσαιωνικά χωριά, μονοπάτια και ήρεμες στιγμές δίπλα στη θάλασσα.",
      image: images.anavatos,
      primaryCta: "Οργάνωσε τη διαμονή σου",
      secondaryCta: "Δες δωμάτια",
    },
    intro: {
      eyebrow: "Ανακάλυψε την αυθεντική Χίο",
      title: "Μία διαμονή, πολλές ιστορίες του νησιού",
      text:
        "Το Voulamandis House βρίσκεται στον Κάμπο, μία από τις πιο ατμοσφαιρικές περιοχές της Χίου. Από εδώ μπορείς να ξεκινήσεις μια ημέρα γεμάτη πολιτισμό, φύση, ιστορία και τοπικό χαρακτήρα, επιστρέφοντας το βράδυ στην ηρεμία του κήπου μας.",
    },
    highlights: {
      eyebrow: "Στάσεις εξερεύνησης",
      title: "Μέρη που αξίζει να ανακαλύψεις στη Χίο",
      text:
        "Ακολούθησε μια διαδρομή που ενώνει την πνευματική κληρονομιά, τη μαστίχα, τη μεσαιωνική αρχιτεκτονική, τη φύση και την ήρεμη ακτογραμμή του νησιού.",
      items: [
        {
          title: "Βιβλιοθήκη Κοραή",
          text:
            "Επισκέψου μία από τις σημαντικότερες ιστορικές βιβλιοθήκες της Ελλάδας, με σπάνια χειρόγραφα και πολιτιστικούς θησαυρούς.",
          image: images.koraisLibrary,
          href: koraisLibraryLinks.el,
        },
        {
          title: "Μουσείο Μαστίχας",
          text:
            "Γνώρισε την ιστορία της παγκοσμίως γνωστής χιώτικης μαστίχας και τις παραδόσεις που διαμόρφωσαν την ταυτότητα του νησιού.",
          image: images.masticMuseum,
          href: masticMuseumLinks.el,
        },
        {
          title: "Μεστά",
          text:
            "Περπάτησε σε έναν καλοδιατηρημένο μεσαιωνικό οικισμό με πέτρινα σοκάκια, καμάρες και κρυφές πλατείες.",
          image: images.mesta,
          href: mestaLinks.el,
        },
        {
          title: "Ανάβατος",
          text:
            "Ανακάλυψε το εντυπωσιακό εγκαταλελειμμένο μεσαιωνικό χωριό, χτισμένο ψηλά στο τοπίο, με μοναδική ιστορική ατμόσφαιρα.",
          image: images.anavatos,
          href: villagesLinks.el,
        },
        {
          title: "Πεζοπορία στη Χίο",
          text:
            "Διάλεξε μια ορεινή ή παραθαλάσσια διαδρομή και γνώρισε τη φυσική πλευρά του νησιού μέσα από πανοραμικές εικόνες.",
          image: images.hiking,
          href: chiosGuideLinks.el,
        },
        {
          title: "Αγία Μαρκέλλα",
          text:
            "Κλείσε την ημέρα σε έναν από τους σημαντικότερους προσκυνηματικούς τόπους της Χίου, δίπλα στη θάλασσα.",
          image: images.agiaMarkella,
          href: chiosGuideLinks.el,
        },
      ],
    },
    story: {
      eyebrow: "Μια ιδανική ημέρα εξερεύνησης",
      title: "Από τα πρωινά του Κάμπου μέχρι το ηλιοβασίλεμα στη θάλασσα",
      text:
        "Ξεκίνα με έναν ήρεμο περίπατο στον Κάμπο, απόλαυσε χειροποίητο πρωινό στο Voulamandis House και άφησε τη Χίο να σου αποκαλυφθεί μέσα από πολιτισμό, χωριά, φύση και ήσυχες στιγμές.",
      steps: [
        {
          label: "Πρωί",
          title: "Περίπατος στον Κάμπο",
          text:
            "Ξεκίνα ανάμεσα σε περιβόλια εσπεριδοειδών και ιστορικά αρχοντικά, νιώθοντας τον διαχρονικό χαρακτήρα της Χίου.",
        },
        {
          label: "Πολιτισμός",
          title: "Βιβλιοθήκη Κοραή και Μουσείο Μαστίχας",
          text:
            "Γνώρισε σπάνια χειρόγραφα, τοπική ιστορία και την ιστορία της μαστίχας.",
        },
        {
          label: "Νότια Χίος",
          title: "Μεστά και Ανάβατος",
          text:
            "Συνέχισε σε πέτρινα χωριά, μεσαιωνικά σοκάκια και τοπία γεμάτα ιστορία.",
        },
        {
          label: "Φύση",
          title: "Μονοπάτια και πανοραμική θέα",
          text:
            "Ακολούθησε ορεινές ή παραθαλάσσιες διαδρομές και γνώρισε την πιο ήσυχη πλευρά του νησιού.",
        },
        {
          label: "Ηλιοβασίλεμα",
          title: "Αγία Μαρκέλλα και επιστροφή στο Voulamandis House",
          text:
            "Κλείσε την ημέρα δίπλα στη θάλασσα και γύρισε στον κήπο για κρασί, χαλάρωση και την αίσθηση μιας γεμάτης ημέρας.",
        },
      ],
    },
    stay: {
      eyebrow: "Διαμονή στον Κάμπο",
      title: "Μια ήρεμη βάση για ταξιδιώτες που θέλουν να ανακαλύψουν",
      text:
        "Το Voulamandis House σου δίνει την αίσθηση ότι μένεις κοντά στην αυθεντική Χίο. Ξύπνα στον Κάμπο, εξερεύνησε το νησί και γύρισε το βράδυ σε μια ήρεμη ατμόσφαιρα κήπου.",
    },
    finalCta: {
      title: "Έτοιμος να σχεδιάσεις τη διαμονή σου;",
      text:
        "Πες μας λίγα πράγματα για το ταξίδι σου και θα σε βοηθήσουμε να διαμορφώσεις τη δική σου εμπειρία εξερεύνησης στη Χίο.",
      primaryCta: "Δες διαθεσιμότητα",
      secondaryCta: "Δες τον οδηγό Χίου",
    },
    links: {
      booking: bookingLinks.el,
      rooms: roomsLinks.el,
      chiosGuide: chiosGuideLinks.el,
    },
  },

  fr: {
    locale: "fr",
    path: chiosExplorerPaths.fr,
    seo: {
      title: "Explorer Chios | Excursions culturelles depuis Voulamandis House",
      description:
        "Explorez le vrai Chios depuis Voulamandis House avec musées, villages médiévaux, randonnées, monastères et expériences authentiques.",
    },
    hero: {
      eyebrow: "Chios Explorer",
      title: "Votre journée parfaite d’exploration avec Voulamandis House",
      subtitle:
        "Découvrez le cœur culturel de Chios à travers bibliothèques historiques, traditions du mastic, villages médiévaux, sentiers et moments paisibles au bord de la mer.",
      image: images.anavatos,
      primaryCta: "Planifier mon séjour",
      secondaryCta: "Voir les chambres",
    },
    intro: {
      eyebrow: "Découvrez le vrai Chios",
      title: "Un séjour, toute une île d’histoires",
      text:
        "Voulamandis House se trouve à Kampos, l’un des lieux les plus atmosphériques de Chios. De là, commencez une journée pleine de culture, de nature, d’histoire et de caractère local.",
    },
    highlights: {
      eyebrow: "Étapes d’exploration",
      title: "Lieux à découvrir pendant votre aventure à Chios",
      text:
        "Suivez un itinéraire qui relie patrimoine intellectuel, culture du mastic, architecture médiévale, paysages sauvages et côte spirituelle.",
      items: [
        {
          title: "Bibliothèque Korais",
          text:
            "Visitez l’une des bibliothèques historiques les plus importantes de Grèce, avec manuscrits rares et trésors culturels.",
          image: images.koraisLibrary,
          href: koraisLibraryLinks.fr,
        },
        {
          title: "Musée du Mastic",
          text:
            "Découvrez l’histoire du mastic de Chios et les traditions qui ont façonné l’identité de l’île.",
          image: images.masticMuseum,
          href: masticMuseumLinks.fr,
        },
        {
          title: "Village de Mesta",
          text:
            "Promenez-vous dans un village médiéval préservé, avec ruelles de pierre, arches et petites places cachées.",
          image: images.mesta,
          href: mestaLinks.fr,
        },
        {
          title: "Village d’Anavatos",
          text:
            "Explorez ce village médiéval abandonné, spectaculaire et chargé d’histoire, perché au-dessus du paysage.",
          image: images.anavatos,
          href: villagesLinks.fr,
        },
        {
          title: "Randonnée à Chios",
          text:
            "Choisissez un sentier de montagne ou de côte et découvrez l’île par ses vues panoramiques et sa nature calme.",
          image: images.hiking,
          href: chiosGuideLinks.fr,
        },
        {
          title: "Monastère d’Agia Markella",
          text:
            "Terminez la journée dans l’un des lieux de pèlerinage les plus importants de Chios, paisible et proche de la mer.",
          image: images.agiaMarkella,
          href: chiosGuideLinks.fr,
        },
      ],
    },
    story: {
      eyebrow: "Une journée parfaite d’exploration",
      title: "Des matins de Kampos au coucher du soleil sur la mer",
      text:
        "Commencez par une promenade paisible à Kampos, savourez un petit-déjeuner fait maison à Voulamandis House et laissez Chios se révéler.",
      steps: [
        {
          label: "Matin",
          title: "Promenade à Kampos",
          text:
            "Commencez parmi les vergers d’agrumes et les demeures historiques avant le petit-déjeuner.",
        },
        {
          label: "Culture",
          title: "Bibliothèque Korais et Musée du Mastic",
          text:
            "Explorez manuscrits rares, histoire locale et le récit du mastic de Chios.",
        },
        {
          label: "Sud de Chios",
          title: "Mesta et Anavatos",
          text:
            "Continuez vers villages de pierre, ruelles médiévales et paysages puissants.",
        },
        {
          label: "Nature",
          title: "Sentiers et vues panoramiques",
          text:
            "Suivez des itinéraires de montagne ou de côte pour découvrir le côté sauvage de l’île.",
        },
        {
          label: "Coucher du soleil",
          title: "Agia Markella et retour à Voulamandis House",
          text:
            "Terminez au bord de la mer, puis revenez au jardin pour un verre de vin et une soirée paisible.",
        },
      ],
    },
    stay: {
      eyebrow: "Séjourner à Kampos",
      title: "Une base calme pour voyageurs curieux",
      text:
        "Voulamandis House vous permet de rester proche du vrai Chios: réveil à Kampos, exploration pendant la journée et retour au calme le soir.",
    },
    finalCta: {
      title: "Prêt à créer votre séjour ?",
      text:
        "Dites-nous quelques détails sur votre voyage et nous vous aiderons à façonner votre expérience d’exploration à Chios.",
      primaryCta: "Voir les disponibilités",
      secondaryCta: "Explorer le guide de Chios",
    },
    links: {
      booking: bookingLinks.fr,
      rooms: roomsLinks.fr,
      chiosGuide: chiosGuideLinks.fr,
    },
  },

  de: {
    locale: "de",
    path: chiosExplorerPaths.de,
    seo: {
      title: "Chios entdecken | Kulturelle Ausflüge ab Voulamandis House",
      description:
        "Entdecken Sie das echte Chios ab Voulamandis House mit Museen, mittelalterlichen Dörfern, Wanderwegen, Klöstern und authentischen Erlebnissen.",
    },
    hero: {
      eyebrow: "Chios Explorer",
      title: "Ihr perfekter Entdeckertag mit Voulamandis House",
      subtitle:
        "Entdecken Sie das kulturelle Herz von Chios mit historischen Bibliotheken, Mastix-Traditionen, mittelalterlichen Dörfern, Wanderwegen und ruhigen Momenten am Meer.",
      image: images.anavatos,
      primaryCta: "Aufenthalt planen",
      secondaryCta: "Zimmer ansehen",
    },
    intro: {
      eyebrow: "Das echte Chios entdecken",
      title: "Ein Aufenthalt, viele Geschichten der Insel",
      text:
        "Voulamandis House liegt in Kampos, einer der stimmungsvollsten Gegenden von Chios. Von hier aus beginnt ein Tag voller Kultur, Natur, Geschichte und lokalem Charakter.",
    },
    highlights: {
      eyebrow: "Entdeckerstationen",
      title: "Orte für Ihr Chios-Abenteuer",
      text:
        "Folgen Sie einer Route, die geistiges Erbe, Mastix-Kultur, mittelalterliche Architektur, wilde Landschaften und spirituelle Küsten verbindet.",
      items: [
        {
          title: "Korais-Bibliothek",
          text:
            "Besuchen Sie eine der wichtigsten historischen Bibliotheken Griechenlands mit seltenen Manuskripten und Kulturschätzen.",
          image: images.koraisLibrary,
          href: koraisLibraryLinks.de,
        },
        {
          title: "Mastix-Museum",
          text:
            "Entdecken Sie die Geschichte des weltberühmten Chios-Mastix und die Traditionen, die die Insel geprägt haben.",
          image: images.masticMuseum,
          href: masticMuseumLinks.de,
        },
        {
          title: "Dorf Mesta",
          text:
            "Spazieren Sie durch ein erhaltenes mittelalterliches Dorf mit Steingassen, Bögen und versteckten Plätzen.",
          image: images.mesta,
          href: mestaLinks.de,
        },
        {
          title: "Dorf Anavatos",
          text:
            "Erkunden Sie das dramatische verlassene mittelalterliche Dorf hoch über der Landschaft.",
          image: images.anavatos,
          href: villagesLinks.de,
        },
        {
          title: "Wandern auf Chios",
          text:
            "Wählen Sie einen Berg- oder Küstenweg und erleben Sie Panoramablicke und die ruhige Natur der Insel.",
          image: images.hiking,
          href: chiosGuideLinks.de,
        },
        {
          title: "Kloster Agia Markella",
          text:
            "Beenden Sie den Tag an einem der wichtigsten Wallfahrtsorte von Chios, friedlich am Meer gelegen.",
          image: images.agiaMarkella,
          href: chiosGuideLinks.de,
        },
      ],
    },
    story: {
      eyebrow: "Ein perfekter Entdeckertag",
      title: "Von Kampos am Morgen bis zum Sonnenuntergang am Meer",
      text:
        "Beginnen Sie mit einem ruhigen Spaziergang durch Kampos, genießen Sie ein hausgemachtes Frühstück und entdecken Sie die Insel Schritt für Schritt.",
      steps: [
        {
          label: "Morgen",
          title: "Spaziergang durch Kampos",
          text:
            "Starten Sie zwischen Zitrusgärten und historischen Herrenhäusern.",
        },
        {
          label: "Kultur",
          title: "Korais-Bibliothek und Mastix-Museum",
          text:
            "Entdecken Sie seltene Manuskripte, lokale Geschichte und die Geschichte des Mastix.",
        },
        {
          label: "Süd-Chios",
          title: "Mesta und Anavatos",
          text:
            "Weiter geht es zu Steindörfern, mittelalterlichen Gassen und eindrucksvollen Landschaften.",
        },
        {
          label: "Natur",
          title: "Wanderwege und Panoramablicke",
          text:
            "Folgen Sie Berg- oder Küstenwegen und erleben Sie die ruhigere Seite der Insel.",
        },
        {
          label: "Sonnenuntergang",
          title: "Agia Markella und Rückkehr zum Voulamandis House",
          text:
            "Schließen Sie den Tag am Meer ab und kehren Sie für Wein und Entspannung in den Garten zurück.",
        },
      ],
    },
    stay: {
      eyebrow: "Aufenthalt in Kampos",
      title: "Eine ruhige Basis für neugierige Reisende",
      text:
        "Voulamandis House bringt Sie nah an das echte Chios: morgens Kampos, tagsüber Entdeckungen und abends die Ruhe des Gartens.",
    },
    finalCta: {
      title: "Bereit, Ihren Aufenthalt zu planen?",
      text:
        "Senden Sie uns einige Details zu Ihrer Reise und wir helfen Ihnen, Ihre persönliche Chios-Erfahrung zu gestalten.",
      primaryCta: "Verfügbarkeit prüfen",
      secondaryCta: "Chios-Reiseführer ansehen",
    },
    links: {
      booking: bookingLinks.de,
      rooms: roomsLinks.de,
      chiosGuide: chiosGuideLinks.de,
    },
  },

  it: {
    locale: "it",
    path: chiosExplorerPaths.it,
    seo: {
      title: "Esplora Chios | Itinerari culturali da Voulamandis House",
      description:
        "Scopri la vera Chios da Voulamandis House con musei, villaggi medievali, sentieri, monasteri ed esperienze autentiche.",
    },
    hero: {
      eyebrow: "Chios Explorer",
      title: "La tua giornata perfetta di esplorazione con Voulamandis House",
      subtitle:
        "Scopri il cuore culturale di Chios tra biblioteche storiche, tradizioni del mastice, villaggi medievali, sentieri e momenti tranquilli sul mare.",
      image: images.anavatos,
      primaryCta: "Organizza il soggiorno",
      secondaryCta: "Vedi camere",
    },
    intro: {
      eyebrow: "Scopri la vera Chios",
      title: "Un soggiorno, tante storie dell’isola",
      text:
        "Voulamandis House si trova a Kampos, una delle zone più suggestive di Chios. Da qui puoi iniziare una giornata ricca di cultura, natura, storia e autenticità locale.",
    },
    highlights: {
      eyebrow: "Tappe da esplorare",
      title: "Luoghi da scoprire durante la tua avventura a Chios",
      text:
        "Segui un itinerario che unisce patrimonio culturale, mastice, architettura medievale, paesaggi selvaggi e costa spirituale.",
      items: [
        {
          title: "Biblioteca Korais",
          text:
            "Visita una delle biblioteche storiche più importanti della Grecia, con manoscritti rari e tesori culturali.",
          image: images.koraisLibrary,
          href: koraisLibraryLinks.it,
        },
        {
          title: "Museo del Mastice",
          text:
            "Scopri la storia del famoso mastice di Chios e le tradizioni che hanno modellato l’identità dell’isola.",
          image: images.masticMuseum,
          href: masticMuseumLinks.it,
        },
        {
          title: "Villaggio di Mesta",
          text:
            "Passeggia in un borgo medievale ben conservato, tra vicoli di pietra, archi e piccole piazze nascoste.",
          image: images.mesta,
          href: mestaLinks.it,
        },
        {
          title: "Villaggio di Anavatos",
          text:
            "Esplora il drammatico villaggio medievale abbandonato, sospeso sopra il paesaggio e pieno di storia.",
          image: images.anavatos,
          href: villagesLinks.it,
        },
        {
          title: "Trekking a Chios",
          text:
            "Scegli un sentiero di montagna o costiero e vivi l’isola attraverso panorami e natura silenziosa.",
          image: images.hiking,
          href: chiosGuideLinks.it,
        },
        {
          title: "Monastero di Agia Markella",
          text:
            "Concludi la giornata in uno dei luoghi di pellegrinaggio più importanti di Chios, tranquillo e vicino al mare.",
          image: images.agiaMarkella,
          href: chiosGuideLinks.it,
        },
      ],
    },
    story: {
      eyebrow: "Una giornata perfetta da esploratore",
      title: "Dalle mattine di Kampos al tramonto sul mare",
      text:
        "Inizia con una passeggiata tranquilla a Kampos, gusta una colazione fatta in casa e lascia che Chios si racconti attraverso cultura, villaggi e natura.",
      steps: [
        {
          label: "Mattina",
          title: "Passeggiata a Kampos",
          text:
            "Comincia tra agrumeti e dimore storiche, respirando il carattere senza tempo di Chios.",
        },
        {
          label: "Cultura",
          title: "Biblioteca Korais e Museo del Mastice",
          text:
            "Scopri manoscritti rari, storia locale e la tradizione del mastice.",
        },
        {
          label: "Sud di Chios",
          title: "Mesta e Anavatos",
          text:
            "Prosegui verso villaggi di pietra, vicoli medievali e paesaggi pieni di storia.",
        },
        {
          label: "Natura",
          title: "Sentieri e panorami",
          text:
            "Segui percorsi di montagna o costa e scopri il lato più quieto dell’isola.",
        },
        {
          label: "Tramonto",
          title: "Agia Markella e ritorno a Voulamandis House",
          text:
            "Chiudi la giornata sul mare e torna in giardino per vino, musica soft e relax.",
        },
      ],
    },
    stay: {
      eyebrow: "Soggiornare a Kampos",
      title: "Una base tranquilla per viaggiatori curiosi",
      text:
        "Voulamandis House ti avvicina alla vera Chios: mattine a Kampos, esplorazioni durante il giorno e quiete in giardino la sera.",
    },
    finalCta: {
      title: "Pronto a creare il tuo soggiorno?",
      text:
        "Raccontaci qualche dettaglio del tuo viaggio e ti aiuteremo a dare forma alla tua esperienza personale a Chios.",
      primaryCta: "Controlla disponibilità",
      secondaryCta: "Esplora la guida di Chios",
    },
    links: {
      booking: bookingLinks.it,
      rooms: roomsLinks.it,
      chiosGuide: chiosGuideLinks.it,
    },
  },

  es: {
    locale: "es",
    path: chiosExplorerPaths.es,
    seo: {
      title: "Explorar Quíos | Rutas culturales desde Voulamandis House",
      description:
        "Descubre la auténtica Quíos desde Voulamandis House con museos, pueblos medievales, senderismo, monasterios y experiencias locales.",
    },
    hero: {
      eyebrow: "Chios Explorer",
      title: "Tu día perfecto de exploración con Voulamandis House",
      subtitle:
        "Descubre el corazón cultural de Quíos entre bibliotecas históricas, tradiciones de la mastiha, pueblos medievales, senderos y momentos tranquilos junto al mar.",
      image: images.anavatos,
      primaryCta: "Planear mi estancia",
      secondaryCta: "Ver habitaciones",
    },
    intro: {
      eyebrow: "Descubre la auténtica Quíos",
      title: "Una estancia, muchas historias de la isla",
      text:
        "Voulamandis House está en Kampos, una de las zonas con más encanto de Quíos. Desde aquí puedes empezar un día lleno de cultura, naturaleza, historia y carácter local.",
    },
    highlights: {
      eyebrow: "Paradas de exploración",
      title: "Lugares para descubrir durante tu aventura en Quíos",
      text:
        "Sigue una ruta que conecta patrimonio intelectual, cultura de la mastiha, arquitectura medieval, paisajes naturales y costa espiritual.",
      items: [
        {
          title: "Biblioteca Korais",
          text:
            "Visita una de las bibliotecas históricas más importantes de Grecia, con manuscritos raros y tesoros culturales.",
          image: images.koraisLibrary,
          href: koraisLibraryLinks.es,
        },
        {
          title: "Museo de la Mastiha",
          text:
            "Descubre la historia de la famosa mastiha de Quíos y las tradiciones que dieron forma a la identidad de la isla.",
          image: images.masticMuseum,
          href: masticMuseumLinks.es,
        },
        {
          title: "Pueblo de Mesta",
          text:
            "Pasea por un pueblo medieval bien conservado, con callejones de piedra, arcos y plazas escondidas.",
          image: images.mesta,
          href: mestaLinks.es,
        },
        {
          title: "Pueblo de Anavatos",
          text:
            "Explora el dramático pueblo medieval abandonado, situado sobre el paisaje y lleno de historia.",
          image: images.anavatos,
          href: villagesLinks.es,
        },
        {
          title: "Senderismo en Quíos",
          text:
            "Elige una ruta de montaña o costa y vive la isla a través de vistas panorámicas y naturaleza tranquila.",
          image: images.hiking,
          href: chiosGuideLinks.es,
        },
        {
          title: "Monasterio de Agia Markella",
          text:
            "Termina el día en uno de los lugares de peregrinación más importantes de Quíos, junto al mar.",
          image: images.agiaMarkella,
          href: chiosGuideLinks.es,
        },
      ],
    },
    story: {
      eyebrow: "Un día perfecto de exploración",
      title: "De las mañanas de Kampos al atardecer junto al mar",
      text:
        "Empieza con un paseo tranquilo por Kampos, disfruta de un desayuno casero y deja que Quíos se revele a través de cultura, pueblos y naturaleza.",
      steps: [
        {
          label: "Mañana",
          title: "Paseo por Kampos",
          text:
            "Comienza entre huertos de cítricos y mansiones históricas, sintiendo el carácter de Quíos.",
        },
        {
          label: "Cultura",
          title: "Biblioteca Korais y Museo de la Mastiha",
          text:
            "Explora manuscritos raros, historia local y la tradición de la mastiha.",
        },
        {
          label: "Sur de Quíos",
          title: "Mesta y Anavatos",
          text:
            "Continúa hacia pueblos de piedra, callejones medievales y paisajes llenos de historia.",
        },
        {
          label: "Naturaleza",
          title: "Senderos y vistas panorámicas",
          text:
            "Sigue rutas de montaña o costa y descubre el lado más tranquilo de la isla.",
        },
        {
          label: "Atardecer",
          title: "Agia Markella y regreso a Voulamandis House",
          text:
            "Cierra el día junto al mar y vuelve al jardín para vino, música suave y descanso.",
        },
      ],
    },
    stay: {
      eyebrow: "Alojarse en Kampos",
      title: "Una base tranquila para viajeros curiosos",
      text:
        "Voulamandis House te acerca a la verdadera Quíos: mañanas en Kampos, exploración durante el día y calma en el jardín por la noche.",
    },
    finalCta: {
      title: "¿Listo para diseñar tu estancia?",
      text:
        "Cuéntanos algunos detalles de tu viaje y te ayudaremos a crear tu experiencia personal de exploración en Quíos.",
      primaryCta: "Comprobar disponibilidad",
      secondaryCta: "Explorar la guía de Quíos",
    },
    links: {
      booking: bookingLinks.es,
      rooms: roomsLinks.es,
      chiosGuide: chiosGuideLinks.es,
    },
  },

  tr: {
    locale: "tr",
    path: chiosExplorerPaths.tr,
    seo: {
      title: "Sakız Adası Keşif | Voulamandis House’tan Kültür Rotaları",
      description:
        "Voulamandis House’tan Sakız Adası’nı müzeler, Orta Çağ köyleri, yürüyüş rotaları, manastırlar ve otantik deneyimlerle keşfedin.",
    },
    hero: {
      eyebrow: "Chios Explorer",
      title: "Voulamandis House ile mükemmel keşif günü",
      subtitle:
        "Tarihi kütüphaneler, sakız mastik geleneği, Orta Çağ köyleri, yürüyüş yolları ve deniz kenarında sakin anlarla Sakız’ın kültürel kalbini keşfedin.",
      image: images.anavatos,
      primaryCta: "Konaklamanı planla",
      secondaryCta: "Odaları gör",
    },
    intro: {
      eyebrow: "Gerçek Sakız’ı keşfedin",
      title: "Tek konaklama, adanın birçok hikayesi",
      text:
        "Voulamandis House, Sakız’ın en atmosferik bölgelerinden Kampos’ta yer alır. Buradan kültür, doğa, tarih ve yerel karakter dolu bir güne başlayabilirsiniz.",
    },
    highlights: {
      eyebrow: "Keşif durakları",
      title: "Sakız maceranızda keşfedilecek yerler",
      text:
        "Adanın entelektüel mirasını, mastik kültürünü, Orta Çağ mimarisini, doğal manzaralarını ve huzurlu kıyılarını birleştiren bir rota izleyin.",
      items: [
        {
          title: "Korais Kütüphanesi",
          text:
            "Nadir el yazmaları ve kültürel hazinelerle Yunanistan’ın en önemli tarihi kütüphanelerinden birini ziyaret edin.",
          image: images.koraisLibrary,
          href: koraisLibraryLinks.tr,
        },
        {
          title: "Sakız Mastik Müzesi",
          text:
            "Dünyaca ünlü Sakız mastiğinin hikayesini ve adanın kimliğini şekillendiren gelenekleri keşfedin.",
          image: images.masticMuseum,
          href: masticMuseumLinks.tr,
        },
        {
          title: "Mesta Köyü",
          text:
            "Taş sokakları, kemerleri ve gizli meydanlarıyla iyi korunmuş bir Orta Çağ köyünde yürüyün.",
          image: images.mesta,
          href: mestaLinks.tr,
        },
        {
          title: "Anavatos Köyü",
          text:
            "Manzaranın üzerinde yükselen, dramatik ve tarihi atmosferi güçlü terk edilmiş Orta Çağ köyünü keşfedin.",
          image: images.anavatos,
          href: villagesLinks.tr,
        },
        {
          title: "Sakız’da yürüyüş",
          text:
            "Dağ veya kıyı rotalarından birini seçin ve adayı panoramik manzaralar ve sakin doğa içinde yaşayın.",
          image: images.hiking,
          href: chiosGuideLinks.tr,
        },
        {
          title: "Agia Markella Manastırı",
          text:
            "Günü Sakız’ın en önemli hac yerlerinden birinde, deniz kenarında huzurlu bir atmosferde tamamlayın.",
          image: images.agiaMarkella,
          href: chiosGuideLinks.tr,
        },
      ],
    },
    story: {
      eyebrow: "Mükemmel bir keşif günü",
      title: "Kampos sabahlarından deniz kenarında gün batımına",
      text:
        "Kampos’ta sakin bir yürüyüşle başlayın, Voulamandis House’ta ev yapımı kahvaltının tadını çıkarın ve adayı kültür, köyler ve doğa ile keşfedin.",
      steps: [
        {
          label: "Sabah",
          title: "Kampos’ta yürüyüş",
          text:
            "Narenciye bahçeleri ve tarihi konaklar arasında güne başlayın.",
        },
        {
          label: "Kültür",
          title: "Korais Kütüphanesi ve Mastik Müzesi",
          text:
            "Nadir el yazmaları, yerel tarih ve Sakız mastiğinin hikayesini keşfedin.",
        },
        {
          label: "Güney Sakız",
          title: "Mesta ve Anavatos",
          text:
            "Taş köylere, Orta Çağ sokaklarına ve etkileyici tarihi manzaralara devam edin.",
        },
        {
          label: "Doğa",
          title: "Yürüyüş rotaları ve panoramik manzaralar",
          text:
            "Dağ veya kıyı yollarını takip ederek adanın daha sakin yüzünü görün.",
        },
        {
          label: "Gün batımı",
          title: "Agia Markella ve Voulamandis House’a dönüş",
          text:
            "Günü deniz kenarında kapatın, ardından şarap, yumuşak müzik ve dinlenme için bahçeye dönün.",
        },
      ],
    },
    stay: {
      eyebrow: "Kampos’ta konaklama",
      title: "Meraklı gezginler için sakin bir üs",
      text:
        "Voulamandis House sizi gerçek Sakız’a yaklaştırır: Kampos’ta sabahlar, gün boyu keşif ve akşam bahçede huzur.",
    },
    finalCta: {
      title: "Konaklamanı tasarlamaya hazır mısın?",
      text:
        "Seyahatinizle ilgili birkaç detay paylaşın; kişisel Sakız keşif deneyiminizi şekillendirmenize yardımcı olalım.",
      primaryCta: "Müsaitliği kontrol et",
      secondaryCta: "Sakız rehberini keşfet",
    },
    links: {
      booking: bookingLinks.tr,
      rooms: roomsLinks.tr,
      chiosGuide: chiosGuideLinks.tr,
    },
  },
};

export const chiosExplorerPages = content;

export function getChiosExplorerPageByLocale(
  locale: LanguageCode,
): ChiosExplorerPageContent {
  return content[locale] || content.en;
}

export function getChiosExplorerPageByPath(
  path: string,
): ChiosExplorerPageContent | undefined {
  const normalizedPath = normalizePath(path);

  return Object.values(content).find((page) => page.path === normalizedPath);
}