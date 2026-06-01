import { type LanguageCode, normalizePath } from "@/lib/languages";

export type TasteLoverImage = {
  src: string;
  alt: string;
};

export type TasteLoverCard = {
  title: string;
  text: string;
  image: TasteLoverImage;
  href?: string;
};

export type TasteLoverDayStep = {
  time: string;
  title: string;
  text: string;
};

export type TasteLoverPageContent = {
  locale: LanguageCode;
  path: string;
  seo: {
    title: string;
    description: string;
    image: string;
  };
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    image: TasteLoverImage;
    primaryCta: string;
    secondaryCta: string;
  };
  links: {
    booking: string;
    rooms: string;
    chiosGuide: string;
  };
  intro: {
    title: string;
    text: string;
  };
  highlights: {
    title: string;
    subtitle: string;
    cards: TasteLoverCard[];
  };
  experiences: {
    title: string;
    subtitle: string;
    cards: TasteLoverCard[];
  };
  day: {
    title: string;
    subtitle: string;
    steps: TasteLoverDayStep[];
  };
  stay: {
    title: string;
    text: string;
  };
  finalCta: {
    title: string;
    text: string;
    primaryCta: string;
    secondaryCta: string;
  };
};

export const tasteLoverPaths: Record<LanguageCode, string> = {
  en: "/taste-lover-chios/",
  el: "/el/geuseis-tis-xiou/",
  fr: "/fr/saveurs-de-chios/",
  de: "/de/chios-fuer-geniesser/",
  it: "/it/sapori-di-chios/",
  es: "/es/sabores-de-quios/",
  tr: "/tr/sakiz-adasi-lezzetleri/",
};

const bookingLinks: Record<LanguageCode, string> = {
  en: "/chios-hotels-rates/",
  el: "/el/amesi-kratisi-voulamandis-house/",
  fr: "/fr/tarifs-des-hotels-a-chios/",
  de: "/de/hotelpreise-auf-der-insel-chios/",
  it: "/it/prezzi-hotel-chios/",
  es: "/es/los-mejores-precios-de-hotel-en-la-isla-chios/",
  tr: "/tr/sakiz-adasi-rezervasyon/",
};

const roomsLinks: Record<LanguageCode, string> = {
  en: "/chios-rooms/",
  el: "/el/domatia-xios/",
  fr: "/fr/chambres-a-chios/",
  de: "/de/chios-zimmer/",
  it: "/it/camere-a-chios/",
  es: "/es/habitaciones-en-chios/",
  tr: "/tr/sakiz-adasi-odalari/",
};

const chiosGuideLinks: Record<LanguageCode, string> = {
  en: "/chios-island/",
  el: "/el/ti-na-do-sti-xio/",
  fr: "/fr/chios-en-grece/",
  de: "/de/chios-insel/",
  it: "/it/chios-lisola-in-grecia/",
  es: "/es/chios-en-grecia/",
  tr: "/tr/sakiz-adasi/",
};

const images = {
  hero: {
    src: "https://chioshotel.gr/wp-content/uploads/2026/02/d8765ffe-dbf2-496c-9190-f1fb82e6318a.webp",
    alt: "Taste Lover Chios experience with local food and island atmosphere",
  },
  masourakia: {
    src: "https://chioshotel.gr/wp-content/uploads/2026/02/masourakia.jpg",
    alt: "Masourakia, traditional Chios sweets with mastiha",
  },
  passas: {
    src: "https://chioshotel.gr/wp-content/uploads/2026/02/passas.chios_.jpg",
    alt: "Traditional dishes at Passas Tavern in Chios",
  },
  makelos: {
    src: "https://chioshotel.gr/wp-content/uploads/2026/02/handmade.spaghetti.jpg",
    alt: "Handmade spaghetti and traditional food at Makelos tavern in Chios",
  },
  kechrimpari: {
    src: "https://chioshotel.gr/wp-content/uploads/2026/02/kechrimpari.jpg",
    alt: "Traditional food and local flavors at Kechrimpari in Chios",
  },
  kafenes: {
    src: "https://chioshotel.gr/wp-content/uploads/2026/02/kafenes.jpg",
    alt: "Traditional kafenes in Chios with tables outside",
  },
  asteri: {
    src: "https://chioshotel.gr/wp-content/uploads/2026/02/asteri.jpg",
    alt: "Sunset dining table at Asteri in Chios",
  },
};

export const tasteLoverPages: Record<LanguageCode, TasteLoverPageContent> = {
  en: {
    locale: "en",
    path: tasteLoverPaths.en,
    seo: {
      title: "Taste Lover Chios | Food Experiences from Voulamandis House",
      description:
        "Discover Chios through mastiha, traditional sweets, village tavernas, seaside meals, local producers, and authentic food experiences from Voulamandis House.",
      image: images.hero.src,
    },
    hero: {
      eyebrow: "Taste Lover Chios",
      title: "Your Perfect Taste Lover Day with Voulamandis House",
      subtitle:
        "Explore Chios through mastiha, homemade flavors, village tavernas, seaside meals, and the people behind every authentic local taste.",
      image: images.hero,
      primaryCta: "Book your stay",
      secondaryCta: "Explore rooms",
    },
    links: {
      booking: bookingLinks.en,
      rooms: roomsLinks.en,
      chiosGuide: chiosGuideLinks.en,
    },
    intro: {
      title: "A food journey shaped around Chios",
      text:
        "Chios is an island of aromas, family recipes, mastiha sweets, fresh seafood, olive oil, village bakeries, and relaxed meals by the sea. From Voulamandis House, every day can become a tasteful route through local tradition.",
    },
    highlights: {
      title: "Why taste lovers choose Chios",
      subtitle:
        "Start with the island’s most characteristic flavors and discover how food connects everyday life, culture, and hospitality.",
      cards: [
        {
          title: "Mastiha sweets and masourakia",
          text:
            "Taste traditional sweets with the delicate aroma of Chios mastiha, one of the island’s most iconic local products.",
          image: images.masourakia,
        },
        {
          title: "Village bakeries and family shops",
          text:
            "Find handmade sweets, pies, cheeses, spoon sweets, and small local products in villages where food still feels personal.",
          image: images.kafenes,
        },
        {
          title: "Sunset meals by the sea",
          text:
            "End the day with local wine or ouzo, seafood, meze, and views that make every dinner part of the Chios experience.",
          image: images.asteri,
        },
      ],
    },
    experiences: {
      title: "Authentic food experiences in Chios",
      subtitle:
        "Choose simple, memorable places where local ingredients and warm hospitality tell the story of the island.",
      cards: [
        {
          title: "Passas Tavern",
          text:
            "A relaxed stop for traditional dishes, local recipes, and the generous feeling of a Greek taverna meal.",
          image: images.passas,
        },
        {
          title: "Pitios Makelos Tavern",
          text:
            "A village-style food experience with handmade flavors, regional dishes, and a strong connection to local tradition.",
          image: images.makelos,
        },
        {
          title: "Kechrimpari Chios",
          text:
            "A warm place to enjoy Chios tastes, meze, and local dishes in a setting full of island character.",
          image: images.kechrimpari,
        },
      ],
    },
    day: {
      title: "Your perfect Taste Lover day",
      subtitle:
        "Begin at Voulamandis House and follow a relaxed route through the flavors, villages, and stories of Chios.",
      steps: [
        {
          time: "Morning",
          title: "Breakfast at Voulamandis House",
          text:
            "Begin your day with a relaxed breakfast featuring local products and homemade flavors that introduce you to the culinary identity of the island.",
        },
        {
          time: "Late morning",
          title: "Discover mastiha culture",
          text:
            "Visit the famous mastiha culture of Chios and discover how this unique resin is harvested and used in sweets, drinks, and traditional recipes.",
        },
        {
          time: "Midday",
          title: "Walk through traditional villages",
          text:
            "Explore picturesque streets, meet local producers, and find bakeries and family-run shops with handmade sweets, cheeses, and regional specialties.",
        },
        {
          time: "Lunch",
          title: "Eat by the sea or in a village",
          text:
            "Choose a seaside taverna or village restaurant for fresh seafood, grilled fish, seasonal vegetables, olive oil, and traditional meze.",
        },
        {
          time: "Afternoon",
          title: "Find hidden food spots",
          text:
            "Continue with small cafés, homemade pies, spoon sweets, pastries, and simple tastes that reveal the culinary soul of Chios.",
        },
        {
          time: "Sunset",
          title: "Dinner with local wine or ouzo",
          text:
            "Enjoy a scenic dinner by the sea or in a village and let the flavors of Chios complete your journey.",
        },
      ],
    },
    stay: {
      title: "Stay close to the authentic side of Chios",
      text:
        "Back at Voulamandis House, relax in a peaceful atmosphere knowing that your stay can be shaped around your personal taste preferences and the local experiences you want to discover.",
    },
    finalCta: {
      title: "Plan your Taste Lover Chios escape",
      text:
        "Stay at Voulamandis House and discover the island through mastiha, tavernas, village flavors, seaside meals, and authentic local stories.",
      primaryCta: "Book your stay",
      secondaryCta: "See our rooms",
    },
  },

  el: {
    locale: "el",
    path: tasteLoverPaths.el,
    seo: {
      title: "Γεύσεις της Χίου | Γαστρονομική εμπειρία από το Voulamandis House",
      description:
        "Ανακαλύψτε τη Χίο μέσα από μαστίχα, παραδοσιακά γλυκά, χωριά, ταβέρνες, θαλασσινούς μεζέδες και αυθεντικές τοπικές γεύσεις.",
      image: images.hero.src,
    },
    hero: {
      eyebrow: "Γεύσεις της Χίου",
      title: "Η ιδανική ημέρα για λάτρεις της γεύσης με το Voulamandis House",
      subtitle:
        "Ζήστε τη Χίο μέσα από μαστίχα, σπιτικές γεύσεις, χωριά, ταβέρνες, θαλασσινά και ανθρώπους που κρατούν ζωντανή την τοπική παράδοση.",
      image: images.hero,
      primaryCta: "Κάντε κράτηση",
      secondaryCta: "Δείτε τα δωμάτια",
    },
    links: {
      booking: bookingLinks.el,
      rooms: roomsLinks.el,
      chiosGuide: chiosGuideLinks.el,
    },
    intro: {
      title: "Ένα γευστικό ταξίδι στη Χίο",
      text:
        "Η Χίος είναι γεμάτη αρώματα, οικογενειακές συνταγές, γλυκά μαστίχας, φρέσκα θαλασσινά, ελαιόλαδο, φούρνους χωριών και χαλαρά γεύματα δίπλα στη θάλασσα.",
    },
    highlights: {
      title: "Γιατί οι λάτρεις της γεύσης αγαπούν τη Χίο",
      subtitle:
        "Ξεκινήστε από τις πιο χαρακτηριστικές γεύσεις του νησιού και δείτε πώς η κουζίνα συνδέεται με την καθημερινή ζωή και τη φιλοξενία.",
      cards: [
        {
          title: "Μαστίχα και μασουράκια",
          text:
            "Δοκιμάστε παραδοσιακά γλυκά με το διακριτικό άρωμα της χιώτικης μαστίχας, ένα από τα πιο ξεχωριστά προϊόντα του νησιού.",
          image: images.masourakia,
        },
        {
          title: "Φούρνοι χωριών και μικρά μαγαζιά",
          text:
            "Ανακαλύψτε χειροποίητα γλυκά, πίτες, τυριά, γλυκά του κουταλιού και τοπικά προϊόντα σε μέρη που κρατούν προσωπικό χαρακτήρα.",
          image: images.kafenes,
        },
        {
          title: "Δείπνο στο ηλιοβασίλεμα",
          text:
            "Κλείστε την ημέρα με τοπικό κρασί ή ούζο, θαλασσινά, μεζέδες και θέα που κάνει κάθε γεύμα εμπειρία Χίου.",
          image: images.asteri,
        },
      ],
    },
    experiences: {
      title: "Αυθεντικές γαστρονομικές εμπειρίες στη Χίο",
      subtitle:
        "Διαλέξτε απλά και αξέχαστα μέρη όπου τα τοπικά υλικά και η φιλοξενία λένε την ιστορία του νησιού.",
      cards: [
        {
          title: "Ταβέρνα Πασσάς",
          text:
            "Μια χαλαρή στάση για παραδοσιακά πιάτα, τοπικές συνταγές και τη γενναιόδωρη αίσθηση μιας ελληνικής ταβέρνας.",
          image: images.passas,
        },
        {
          title: "Ταβέρνα Μάκελος στα Πιτυός",
          text:
            "Γεύσεις χωριού, χειροποίητα πιάτα και έντονη σύνδεση με την τοπική παράδοση.",
          image: images.makelos,
        },
        {
          title: "Κεχριμπάρι Χίος",
          text:
            "Ένα ζεστό σημείο για χιώτικες γεύσεις, μεζέδες και πιάτα γεμάτα χαρακτήρα νησιού.",
          image: images.kechrimpari,
        },
      ],
    },
    day: {
      title: "Η ιδανική Taste Lover ημέρα σας",
      subtitle:
        "Ξεκινήστε από το Voulamandis House και ακολουθήστε μια χαλαρή διαδρομή στις γεύσεις, τα χωριά και τις ιστορίες της Χίου.",
      steps: [
        {
          time: "Πρωί",
          title: "Πρωινό στο Voulamandis House",
          text:
            "Ξεκινήστε με ένα χαλαρό πρωινό με τοπικά προϊόντα και σπιτικές γεύσεις που σας βάζουν στην κουλτούρα του νησιού.",
        },
        {
          time: "Αργότερα το πρωί",
          title: "Ανακαλύψτε τη μαστίχα",
          text:
            "Γνωρίστε τη φημισμένη μαστίχα Χίου και τον τρόπο που χρησιμοποιείται σε γλυκά, ποτά και παραδοσιακές συνταγές.",
        },
        {
          time: "Μεσημέρι",
          title: "Περπατήστε σε παραδοσιακά χωριά",
          text:
            "Βρείτε φούρνους, μικρά οικογενειακά μαγαζιά, χειροποίητα γλυκά, τυριά και τοπικές σπεσιαλιτέ.",
        },
        {
          time: "Γεύμα",
          title: "Φαγητό δίπλα στη θάλασσα ή σε χωριό",
          text:
            "Επιλέξτε παραθαλάσσια ταβέρνα ή εστιατόριο σε χωριό για φρέσκα θαλασσινά, ψάρι, λαχανικά, ελαιόλαδο και μεζέδες.",
        },
        {
          time: "Απόγευμα",
          title: "Κρυμμένα γευστικά σημεία",
          text:
            "Συνεχίστε με μικρά καφέ, σπιτικές πίτες, γλυκά του κουταλιού και απλές γεύσεις που δείχνουν την ψυχή της Χίου.",
        },
        {
          time: "Ηλιοβασίλεμα",
          title: "Δείπνο με κρασί ή ούζο",
          text:
            "Απολαύστε δείπνο σε χωριό ή δίπλα στη θάλασσα και αφήστε τις γεύσεις της Χίου να ολοκληρώσουν την ημέρα.",
        },
      ],
    },
    stay: {
      title: "Μείνετε κοντά στην αυθεντική Χίο",
      text:
        "Επιστρέφοντας στο Voulamandis House, χαλαρώστε σε ήρεμη ατμόσφαιρα γνωρίζοντας ότι η διαμονή σας μπορεί να ταιριάξει στις δικές σας γευστικές προτιμήσεις.",
    },
    finalCta: {
      title: "Οργανώστε τη γευστική σας απόδραση στη Χίο",
      text:
        "Μείνετε στο Voulamandis House και ανακαλύψτε το νησί μέσα από μαστίχα, ταβέρνες, χωριά, θαλασσινά και αυθεντικές τοπικές ιστορίες.",
      primaryCta: "Κάντε κράτηση",
      secondaryCta: "Δείτε τα δωμάτια",
    },
  },

  fr: {
    locale: "fr",
    path: tasteLoverPaths.fr,
    seo: {
      title: "Saveurs de Chios | Expériences gourmandes depuis Voulamandis House",
      description:
        "Découvrez Chios à travers la mastiha, les douceurs locales, les tavernes de village, les repas au bord de la mer et les saveurs authentiques.",
      image: images.hero.src,
    },
    hero: {
      eyebrow: "Saveurs de Chios",
      title: "Votre journée idéale de gastronomie avec Voulamandis House",
      subtitle:
        "Explorez Chios à travers la mastiha, les saveurs maison, les villages, les tavernes, les repas au bord de la mer et les traditions locales.",
      image: images.hero,
      primaryCta: "Réserver votre séjour",
      secondaryCta: "Voir les chambres",
    },
    links: {
      booking: bookingLinks.fr,
      rooms: roomsLinks.fr,
      chiosGuide: chiosGuideLinks.fr,
    },
    intro: {
      title: "Un voyage gourmand à Chios",
      text:
        "Chios est une île d’arômes, de recettes familiales, de douceurs à la mastiha, de fruits de mer frais, d’huile d’olive, de boulangeries de village et de repas détendus face à la mer.",
    },
    highlights: {
      title: "Pourquoi les amateurs de saveurs choisissent Chios",
      subtitle:
        "Commencez par les goûts les plus typiques de l’île et découvrez le lien entre cuisine, culture et hospitalité.",
      cards: [
        {
          title: "Mastiha et douceurs traditionnelles",
          text:
            "Goûtez des desserts parfumés à la mastiha de Chios, l’un des produits les plus emblématiques de l’île.",
          image: images.masourakia,
        },
        {
          title: "Boulangeries et petites boutiques",
          text:
            "Trouvez des douceurs faites main, des tartes, des fromages, des fruits confits au sirop et des produits locaux.",
          image: images.kafenes,
        },
        {
          title: "Dîners au coucher du soleil",
          text:
            "Terminez la journée avec du vin local ou de l’ouzo, des fruits de mer, des mezzés et une vue pleine de charme.",
          image: images.asteri,
        },
      ],
    },
    experiences: {
      title: "Expériences culinaires authentiques à Chios",
      subtitle:
        "Choisissez des lieux simples et mémorables où les produits locaux racontent l’histoire de l’île.",
      cards: [
        {
          title: "Taverne Passas",
          text:
            "Une adresse détendue pour des plats traditionnels, des recettes locales et l’atmosphère généreuse d’une taverne grecque.",
          image: images.passas,
        },
        {
          title: "Taverne Pitios Makelos",
          text:
            "Une expérience de village avec des saveurs faites main, des plats régionaux et une vraie tradition locale.",
          image: images.makelos,
        },
        {
          title: "Kechrimpari Chios",
          text:
            "Un lieu chaleureux pour déguster des mezzés, des plats locaux et des saveurs pleines de caractère.",
          image: images.kechrimpari,
        },
      ],
    },
    day: {
      title: "Votre journée parfaite autour des saveurs",
      subtitle:
        "Partez de Voulamandis House et suivez un itinéraire tranquille entre goûts, villages et histoires de Chios.",
      steps: [
        {
          time: "Matin",
          title: "Petit-déjeuner à Voulamandis House",
          text:
            "Commencez avec des produits locaux et des saveurs maison qui présentent l’identité culinaire de l’île.",
        },
        {
          time: "Fin de matinée",
          title: "Découvrir la culture de la mastiha",
          text:
            "Découvrez comment cette résine unique est récoltée et utilisée dans les douceurs, les boissons et les recettes traditionnelles.",
        },
        {
          time: "Midi",
          title: "Villages traditionnels",
          text:
            "Promenez-vous dans les ruelles, rencontrez des producteurs et trouvez des boulangeries et boutiques familiales.",
        },
        {
          time: "Déjeuner",
          title: "Manger au bord de la mer ou au village",
          text:
            "Choisissez une taverne ou un restaurant de village pour du poisson, des légumes de saison, de l’huile d’olive et des mezzés.",
        },
        {
          time: "Après-midi",
          title: "Petites adresses gourmandes",
          text:
            "Continuez avec des cafés, des tartes maison, des pâtisseries et des goûts simples mais inoubliables.",
        },
        {
          time: "Coucher du soleil",
          title: "Dîner avec vin local ou ouzo",
          text:
            "Profitez d’un dîner dans un village ou au bord de la mer pour terminer votre journée avec les saveurs de Chios.",
        },
      ],
    },
    stay: {
      title: "Séjourner près du vrai Chios",
      text:
        "De retour à Voulamandis House, détendez-vous dans une atmosphère paisible après une journée adaptée à vos envies gourmandes.",
    },
    finalCta: {
      title: "Planifiez votre escapade gourmande à Chios",
      text:
        "Séjournez à Voulamandis House et découvrez l’île à travers la mastiha, les tavernes, les villages et les saveurs locales.",
      primaryCta: "Réserver",
      secondaryCta: "Voir les chambres",
    },
  },

  de: {
    locale: "de",
    path: tasteLoverPaths.de,
    seo: {
      title: "Chios für Genießer | Kulinarische Erlebnisse ab Voulamandis House",
      description:
        "Entdecken Sie Chios durch Mastix, traditionelle Süßigkeiten, Dorftavernen, Mahlzeiten am Meer und authentische lokale Aromen.",
      image: images.hero.src,
    },
    hero: {
      eyebrow: "Chios für Genießer",
      title: "Ihr perfekter Genießer-Tag mit Voulamandis House",
      subtitle:
        "Erleben Sie Chios durch Mastix, hausgemachte Aromen, Dörfer, Tavernen, Meeresküche und lokale Traditionen.",
      image: images.hero,
      primaryCta: "Aufenthalt buchen",
      secondaryCta: "Zimmer ansehen",
    },
    links: {
      booking: bookingLinks.de,
      rooms: roomsLinks.de,
      chiosGuide: chiosGuideLinks.de,
    },
    intro: {
      title: "Eine kulinarische Reise auf Chios",
      text:
        "Chios ist eine Insel voller Aromen, Familienrezepte, Mastix-Süßigkeiten, frischer Meeresküche, Olivenöl, Dorfbäckereien und entspannter Mahlzeiten am Meer.",
    },
    highlights: {
      title: "Warum Genießer Chios lieben",
      subtitle:
        "Beginnen Sie mit den typischen Geschmäckern der Insel und entdecken Sie die Verbindung von Küche, Kultur und Gastfreundschaft.",
      cards: [
        {
          title: "Mastix und traditionelle Süßigkeiten",
          text:
            "Probieren Sie Süßigkeiten mit dem feinen Aroma des Chios-Mastix, einem der bekanntesten Produkte der Insel.",
          image: images.masourakia,
        },
        {
          title: "Dorfbäckereien und kleine Läden",
          text:
            "Entdecken Sie handgemachte Süßigkeiten, Pasteten, Käse, Löffelsüßigkeiten und lokale Spezialitäten.",
          image: images.kafenes,
        },
        {
          title: "Abendessen bei Sonnenuntergang",
          text:
            "Beenden Sie den Tag mit lokalem Wein oder Ouzo, Meeresfrüchten, Meze und einer besonderen Aussicht.",
          image: images.asteri,
        },
      ],
    },
    experiences: {
      title: "Authentische kulinarische Erlebnisse auf Chios",
      subtitle:
        "Wählen Sie einfache, unvergessliche Orte, an denen lokale Zutaten und Gastfreundschaft die Geschichte der Insel erzählen.",
      cards: [
        {
          title: "Taverne Passas",
          text:
            "Ein entspannter Ort für traditionelle Gerichte, lokale Rezepte und das Gefühl einer griechischen Taverne.",
          image: images.passas,
        },
        {
          title: "Taverne Pitios Makelos",
          text:
            "Ein Dorferlebnis mit handgemachten Aromen, regionalen Gerichten und echter lokaler Tradition.",
          image: images.makelos,
        },
        {
          title: "Kechrimpari Chios",
          text:
            "Ein warmer Ort für Chios-Aromen, Meze und lokale Gerichte voller Inselcharakter.",
          image: images.kechrimpari,
        },
      ],
    },
    day: {
      title: "Ihr perfekter Taste-Lover-Tag",
      subtitle:
        "Starten Sie im Voulamandis House und folgen Sie einer entspannten Route durch Geschmäcker, Dörfer und Geschichten von Chios.",
      steps: [
        {
          time: "Morgen",
          title: "Frühstück im Voulamandis House",
          text:
            "Beginnen Sie mit lokalen Produkten und hausgemachten Aromen, die die kulinarische Identität der Insel vorstellen.",
        },
        {
          time: "Vormittag",
          title: "Mastix-Kultur entdecken",
          text:
            "Erfahren Sie, wie dieses einzigartige Harz geerntet und in Süßigkeiten, Getränken und Rezepten verwendet wird.",
        },
        {
          time: "Mittag",
          title: "Traditionelle Dörfer",
          text:
            "Spazieren Sie durch Gassen, treffen Sie Produzenten und entdecken Sie Bäckereien und Familienläden.",
        },
        {
          time: "Mittagessen",
          title: "Essen am Meer oder im Dorf",
          text:
            "Genießen Sie Fisch, saisonales Gemüse, Olivenöl und Meze in einer Taverne am Meer oder im Dorf.",
        },
        {
          time: "Nachmittag",
          title: "Versteckte Genussorte",
          text:
            "Besuchen Sie kleine Cafés, probieren Sie hausgemachte Pasteten, Süßigkeiten und einfache, unvergessliche Aromen.",
        },
        {
          time: "Sonnenuntergang",
          title: "Abendessen mit Wein oder Ouzo",
          text:
            "Genießen Sie ein Abendessen im Dorf oder am Meer und lassen Sie die Aromen von Chios den Tag abrunden.",
        },
      ],
    },
    stay: {
      title: "Nah am authentischen Chios wohnen",
      text:
        "Zurück im Voulamandis House entspannen Sie in ruhiger Atmosphäre nach einem Tag, der zu Ihren persönlichen Geschmacksvorlieben passt.",
    },
    finalCta: {
      title: "Planen Sie Ihre Genießerreise nach Chios",
      text:
        "Übernachten Sie im Voulamandis House und entdecken Sie die Insel durch Mastix, Tavernen, Dörfer und lokale Geschichten.",
      primaryCta: "Jetzt buchen",
      secondaryCta: "Zimmer ansehen",
    },
  },

  it: {
    locale: "it",
    path: tasteLoverPaths.it,
    seo: {
      title: "Sapori di Chios | Esperienze gastronomiche da Voulamandis House",
      description:
        "Scopri Chios attraverso mastica, dolci tradizionali, taverne di villaggio, pasti sul mare e sapori locali autentici.",
      image: images.hero.src,
    },
    hero: {
      eyebrow: "Sapori di Chios",
      title: "La tua giornata perfetta da amante del gusto con Voulamandis House",
      subtitle:
        "Esplora Chios attraverso mastica, sapori fatti in casa, villaggi, taverne, cucina di mare e tradizioni locali.",
      image: images.hero,
      primaryCta: "Prenota il soggiorno",
      secondaryCta: "Vedi le camere",
    },
    links: {
      booking: bookingLinks.it,
      rooms: roomsLinks.it,
      chiosGuide: chiosGuideLinks.it,
    },
    intro: {
      title: "Un viaggio gastronomico a Chios",
      text:
        "Chios è un’isola di profumi, ricette di famiglia, dolci alla mastica, pesce fresco, olio d’oliva, forni di villaggio e pasti rilassati sul mare.",
    },
    highlights: {
      title: "Perché gli amanti del gusto scelgono Chios",
      subtitle:
        "Inizia dai sapori più caratteristici dell’isola e scopri il legame tra cucina, cultura e ospitalità.",
      cards: [
        {
          title: "Mastica e dolci tradizionali",
          text:
            "Assaggia dolci profumati alla mastica di Chios, uno dei prodotti più iconici dell’isola.",
          image: images.masourakia,
        },
        {
          title: "Forni di villaggio e botteghe",
          text:
            "Trova dolci fatti a mano, torte salate, formaggi, conserve dolci e specialità locali.",
          image: images.kafenes,
        },
        {
          title: "Cene al tramonto",
          text:
            "Concludi la giornata con vino locale o ouzo, frutti di mare, meze e una vista indimenticabile.",
          image: images.asteri,
        },
      ],
    },
    experiences: {
      title: "Esperienze gastronomiche autentiche a Chios",
      subtitle:
        "Scegli luoghi semplici e memorabili dove ingredienti locali e ospitalità raccontano l’isola.",
      cards: [
        {
          title: "Taverna Passas",
          text:
            "Una sosta rilassata per piatti tradizionali, ricette locali e l’atmosfera generosa di una taverna greca.",
          image: images.passas,
        },
        {
          title: "Taverna Pitios Makelos",
          text:
            "Un’esperienza di villaggio con sapori fatti a mano, piatti regionali e tradizione locale.",
          image: images.makelos,
        },
        {
          title: "Kechrimpari Chios",
          text:
            "Un luogo accogliente per gustare meze, piatti locali e sapori pieni di carattere.",
          image: images.kechrimpari,
        },
      ],
    },
    day: {
      title: "La tua giornata perfetta di gusto",
      subtitle:
        "Parti da Voulamandis House e segui un percorso rilassato tra sapori, villaggi e storie di Chios.",
      steps: [
        {
          time: "Mattina",
          title: "Colazione a Voulamandis House",
          text:
            "Inizia con prodotti locali e sapori fatti in casa che presentano l’identità culinaria dell’isola.",
        },
        {
          time: "Tarda mattina",
          title: "Scoprire la cultura della mastica",
          text:
            "Scopri come questa resina unica viene raccolta e usata in dolci, bevande e ricette tradizionali.",
        },
        {
          time: "Mezzogiorno",
          title: "Villaggi tradizionali",
          text:
            "Passeggia tra stradine, incontra produttori locali e scopri forni e botteghe familiari.",
        },
        {
          time: "Pranzo",
          title: "Mangiare sul mare o in un villaggio",
          text:
            "Scegli una taverna sul mare o un ristorante di villaggio per pesce, verdure, olio d’oliva e meze.",
        },
        {
          time: "Pomeriggio",
          title: "Piccoli luoghi del gusto",
          text:
            "Continua con caffè, torte fatte in casa, dolci tradizionali e sapori semplici ma indimenticabili.",
        },
        {
          time: "Tramonto",
          title: "Cena con vino locale o ouzo",
          text:
            "Goditi una cena in un villaggio o sul mare e lascia che i sapori di Chios completino il viaggio.",
        },
      ],
    },
    stay: {
      title: "Soggiorna vicino alla Chios autentica",
      text:
        "Di ritorno a Voulamandis House, rilassati in un’atmosfera tranquilla dopo una giornata pensata intorno ai tuoi gusti.",
    },
    finalCta: {
      title: "Organizza la tua fuga gastronomica a Chios",
      text:
        "Soggiorna a Voulamandis House e scopri l’isola attraverso mastica, taverne, villaggi e sapori autentici.",
      primaryCta: "Prenota",
      secondaryCta: "Vedi le camere",
    },
  },

  es: {
    locale: "es",
    path: tasteLoverPaths.es,
    seo: {
      title: "Sabores de Quíos | Experiencias gastronómicas desde Voulamandis House",
      description:
        "Descubre Quíos a través de la mastiha, dulces tradicionales, tabernas de pueblo, comidas junto al mar y sabores locales auténticos.",
      image: images.hero.src,
    },
    hero: {
      eyebrow: "Sabores de Quíos",
      title: "Tu día perfecto para amantes del sabor con Voulamandis House",
      subtitle:
        "Explora Quíos a través de la mastiha, sabores caseros, pueblos, tabernas, comidas junto al mar y tradiciones locales.",
      image: images.hero,
      primaryCta: "Reserva tu estancia",
      secondaryCta: "Ver habitaciones",
    },
    links: {
      booking: bookingLinks.es,
      rooms: roomsLinks.es,
      chiosGuide: chiosGuideLinks.es,
    },
    intro: {
      title: "Un viaje gastronómico por Quíos",
      text:
        "Quíos es una isla de aromas, recetas familiares, dulces de mastiha, marisco fresco, aceite de oliva, panaderías de pueblo y comidas tranquilas junto al mar.",
    },
    highlights: {
      title: "Por qué los amantes del sabor eligen Quíos",
      subtitle:
        "Empieza por los sabores más característicos de la isla y descubre cómo la comida conecta cultura y hospitalidad.",
      cards: [
        {
          title: "Mastiha y dulces tradicionales",
          text:
            "Prueba dulces con el delicado aroma de la mastiha de Quíos, uno de los productos más emblemáticos de la isla.",
          image: images.masourakia,
        },
        {
          title: "Panaderías de pueblo y tiendas familiares",
          text:
            "Encuentra dulces hechos a mano, empanadas, quesos, frutas en almíbar y especialidades locales.",
          image: images.kafenes,
        },
        {
          title: "Cenas al atardecer",
          text:
            "Termina el día con vino local u ouzo, marisco, meze y vistas que forman parte de la experiencia.",
          image: images.asteri,
        },
      ],
    },
    experiences: {
      title: "Experiencias gastronómicas auténticas en Quíos",
      subtitle:
        "Elige lugares sencillos y memorables donde los ingredientes locales cuentan la historia de la isla.",
      cards: [
        {
          title: "Taberna Passas",
          text:
            "Una parada relajada para platos tradicionales, recetas locales y el ambiente generoso de una taberna griega.",
          image: images.passas,
        },
        {
          title: "Taberna Pitios Makelos",
          text:
            "Una experiencia de pueblo con sabores hechos a mano, platos regionales y tradición local.",
          image: images.makelos,
        },
        {
          title: "Kechrimpari Chios",
          text:
            "Un lugar cálido para disfrutar meze, platos locales y sabores con carácter isleño.",
          image: images.kechrimpari,
        },
      ],
    },
    day: {
      title: "Tu día perfecto de sabores",
      subtitle:
        "Empieza en Voulamandis House y sigue una ruta tranquila por los sabores, pueblos e historias de Quíos.",
      steps: [
        {
          time: "Mañana",
          title: "Desayuno en Voulamandis House",
          text:
            "Comienza con productos locales y sabores caseros que presentan la identidad culinaria de la isla.",
        },
        {
          time: "Media mañana",
          title: "Descubrir la cultura de la mastiha",
          text:
            "Descubre cómo se cosecha esta resina única y cómo se usa en dulces, bebidas y recetas tradicionales.",
        },
        {
          time: "Mediodía",
          title: "Pueblos tradicionales",
          text:
            "Pasea por calles pintorescas, conoce productores y encuentra panaderías y tiendas familiares.",
        },
        {
          time: "Almuerzo",
          title: "Comer junto al mar o en un pueblo",
          text:
            "Elige una taberna junto al mar o un restaurante de pueblo para pescado, verduras, aceite de oliva y meze.",
        },
        {
          time: "Tarde",
          title: "Pequeños lugares gastronómicos",
          text:
            "Continúa con cafés, tartas caseras, dulces tradicionales y sabores simples pero inolvidables.",
        },
        {
          time: "Atardecer",
          title: "Cena con vino local u ouzo",
          text:
            "Disfruta una cena en un pueblo o junto al mar y deja que los sabores de Quíos completen el día.",
        },
      ],
    },
    stay: {
      title: "Alójate cerca del Quíos auténtico",
      text:
        "De vuelta en Voulamandis House, relájate en un ambiente tranquilo después de un día adaptado a tus gustos.",
    },
    finalCta: {
      title: "Planifica tu escapada gastronómica a Quíos",
      text:
        "Alójate en Voulamandis House y descubre la isla a través de mastiha, tabernas, pueblos y sabores auténticos.",
      primaryCta: "Reservar",
      secondaryCta: "Ver habitaciones",
    },
  },

  tr: {
    locale: "tr",
    path: tasteLoverPaths.tr,
    seo: {
      title: "Sakız Adası Lezzetleri | Voulamandis House ile yemek deneyimleri",
      description:
        "Sakız Adası’nı damla sakızı, geleneksel tatlılar, köy tavernaları, deniz kenarı yemekleri ve yerel lezzetlerle keşfedin.",
      image: images.hero.src,
    },
    hero: {
      eyebrow: "Sakız Adası Lezzetleri",
      title: "Voulamandis House ile lezzet severler için mükemmel bir gün",
      subtitle:
        "Sakız Adası’nı damla sakızı, ev yapımı tatlar, köyler, tavernalar, deniz ürünleri ve yerel geleneklerle keşfedin.",
      image: images.hero,
      primaryCta: "Konaklamanızı ayırtın",
      secondaryCta: "Odaları görün",
    },
    links: {
      booking: bookingLinks.tr,
      rooms: roomsLinks.tr,
      chiosGuide: chiosGuideLinks.tr,
    },
    intro: {
      title: "Sakız Adası’nda lezzet yolculuğu",
      text:
        "Sakız Adası aromalar, aile tarifleri, damla sakızlı tatlılar, taze deniz ürünleri, zeytinyağı, köy fırınları ve deniz kenarında keyifli yemeklerle doludur.",
    },
    highlights: {
      title: "Lezzet severler neden Sakız Adası’nı seçiyor",
      subtitle:
        "Adanın en karakteristik tatlarıyla başlayın ve yemek, kültür ve misafirperverlik arasındaki bağı keşfedin.",
      cards: [
        {
          title: "Damla sakızı ve geleneksel tatlılar",
          text:
            "Sakız Adası’nın en özel ürünlerinden biri olan damla sakızının narin aromasıyla yapılan tatlıları deneyin.",
          image: images.masourakia,
        },
        {
          title: "Köy fırınları ve aile işletmeleri",
          text:
            "El yapımı tatlılar, börekler, peynirler, kaşık tatlıları ve yerel ürünler bulun.",
          image: images.kafenes,
        },
        {
          title: "Gün batımında akşam yemeği",
          text:
            "Günü yerel şarap veya uzo, deniz ürünleri, mezeler ve etkileyici manzaralarla tamamlayın.",
          image: images.asteri,
        },
      ],
    },
    experiences: {
      title: "Sakız Adası’nda otantik yemek deneyimleri",
      subtitle:
        "Yerel malzemelerin ve sıcak misafirperverliğin adanın hikayesini anlattığı sade ve unutulmaz yerler seçin.",
      cards: [
        {
          title: "Passas Tavernası",
          text:
            "Geleneksel yemekler, yerel tarifler ve bir Yunan tavernasının samimi atmosferi için rahat bir durak.",
          image: images.passas,
        },
        {
          title: "Pitios Makelos Tavernası",
          text:
            "El yapımı lezzetler, bölgesel yemekler ve güçlü bir yerel gelenek hissi sunan köy tarzı bir deneyim.",
          image: images.makelos,
        },
        {
          title: "Kechrimpari Chios",
          text:
            "Mezeler, yerel yemekler ve ada karakteri taşıyan tatlar için sıcak bir mekan.",
          image: images.kechrimpari,
        },
      ],
    },
    day: {
      title: "Mükemmel lezzet gününüz",
      subtitle:
        "Voulamandis House’tan başlayın ve Sakız Adası’nın tatları, köyleri ve hikayeleri boyunca rahat bir rota izleyin.",
      steps: [
        {
          time: "Sabah",
          title: "Voulamandis House’ta kahvaltı",
          text:
            "Güne adanın mutfak kimliğini tanıtan yerel ürünler ve ev yapımı lezzetlerle başlayın.",
        },
        {
          time: "Öğleden önce",
          title: "Damla sakızı kültürünü keşfedin",
          text:
            "Bu eşsiz reçinenin nasıl toplandığını ve tatlılarda, içeceklerde ve geleneksel tariflerde nasıl kullanıldığını öğrenin.",
        },
        {
          time: "Öğle",
          title: "Geleneksel köyler",
          text:
            "Dar sokaklarda yürüyün, yerel üreticilerle tanışın, köy fırınları ve aile işletmelerini keşfedin.",
        },
        {
          time: "Öğle yemeği",
          title: "Deniz kenarında veya köyde yemek",
          text:
            "Balık, mevsim sebzeleri, zeytinyağı ve mezeler için deniz kenarında bir taverna veya köy restoranı seçin.",
        },
        {
          time: "Öğleden sonra",
          title: "Gizli lezzet durakları",
          text:
            "Küçük kafeler, ev yapımı börekler, geleneksel tatlılar ve unutulmaz sade tatlarla devam edin.",
        },
        {
          time: "Gün batımı",
          title: "Yerel şarap veya uzo ile akşam yemeği",
          text:
            "Köyde veya deniz kenarında akşam yemeğinin tadını çıkarın ve Sakız Adası lezzetleriyle günü tamamlayın.",
        },
      ],
    },
    stay: {
      title: "Sakız Adası’nın otantik tarafına yakın konaklayın",
      text:
        "Voulamandis House’a döndüğünüzde, kişisel lezzet tercihlerinize göre şekillenmiş bir günün ardından huzurlu atmosferde dinlenin.",
    },
    finalCta: {
      title: "Sakız Adası lezzet kaçamağınızı planlayın",
      text:
        "Voulamandis House’ta konaklayın ve adayı damla sakızı, tavernalar, köyler ve yerel hikayelerle keşfedin.",
      primaryCta: "Rezervasyon yap",
      secondaryCta: "Odaları görün",
    },
  },
};

export function getTasteLoverPageByLocale(
  locale: LanguageCode,
): TasteLoverPageContent {
  return tasteLoverPages[locale] || tasteLoverPages.en;
}

export function getTasteLoverPageByPath(
  path: string,
): TasteLoverPageContent | undefined {
  const normalizedPath = normalizePath(path);

  return Object.values(tasteLoverPages).find(
    (page) => normalizePath(page.path) === normalizedPath,
  );
}