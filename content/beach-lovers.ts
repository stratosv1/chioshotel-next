import type { LanguageCode } from "@/lib/languages";

export type BeachLoversBeachCard = {
  name: string;
  image: string;
  href: string;
  tag: string;
  description: string;
};

export type BeachLoversPageData = {
  locale: LanguageCode;
  seo: {
    title: string;
    description: string;
    canonicalPath: string;
    ogImage: string;
  };
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    primaryCta: string;
    secondaryCta: string;
    image: string;
  };
  intro: {
    title: string;
    paragraphs: string[];
  };
  beachesTitle: string;
  beachesIntro: string;
  beaches: BeachLoversBeachCard[];
  stay: {
    title: string;
    text: string;
    image: string;
    cta: string;
  };
  finalCta: {
    title: string;
    text: string;
    button: string;
  };
};

const images = {
  hero: "https://chioshotel.gr/wp-content/uploads/2026/02/agia-fotia.jpg",
  mavraVolia:
    "https://chioshotel.gr/wp-content/uploads/2021/12/emporios3-e1702727598897.webp",
  agiaFotia: "https://chioshotel.gr/wp-content/uploads/2026/02/agia-fotia.jpg",
  komi: "https://chioshotel.gr/wp-content/uploads/2026/03/sakiz-adasi-chios-greece-komi-be-2.jpg",
  salagona:
    "https://chioshotel.gr/wp-content/uploads/2026/03/sakiz-adasi-chios-greece-komi-be-2.jpg",
  vroulidia: "https://chioshotel.gr/wp-content/uploads/2026/02/vroulidia-2-1.jpg",
  katoFana: "https://chioshotel.gr/wp-content/uploads/2026/02/kato-fana-3.jpg",
  voulamandis:
    "https://chioshotel.gr/wp-content/uploads/2026/01/voulamandis-house-chios-courtyard-hero-desktop.webp",
};

export const beachLoversPages: Record<LanguageCode, BeachLoversPageData> = {
  en: {
    locale: "en",
    seo: {
      title: "Chios for Beach Lovers | Voulamandis House",
      description:
        "Plan your perfect beach holiday in Chios with Voulamandis House. Discover Mavra Volia, Vroulidia, Komi, Agia Fotia, Kato Fana and more.",
      canonicalPath: "/chios-beach-lovers/",
      ogImage: images.hero,
    },
    hero: {
      eyebrow: "For beach lovers",
      title: "Your perfect beach day in Chios starts at Voulamandis House",
      subtitle:
        "Stay in peaceful Kampos and explore the beaches of South Chios, from volcanic Mavra Volia to golden Komi and quiet Vroulidia.",
      primaryCta: "Check availability",
      secondaryCta: "Explore the beaches",
      image: images.hero,
    },
    intro: {
      title: "Your perfect beach day with Voulamandis House",
      paragraphs: [
        "You start your day with a peaceful walk through the magical Kampos area, where Voulamandis House is located. A quiet stroll among citrus orchards and historic mansions.",
        "Full of energy, you return to Voulamandis House and enjoy a handmade, healthy breakfast. Fragrant citrus marmalades, fresh flavours and homemade delicacies that captivate everyone who tastes them.",
        "Today has a title: South Chios – Beach Day.",
        "First stop: the Mastic Museum. A journey into the history and culture of the island.",
        "Next, you arrive at the unique Mavra Volia beach. Swim in volcanic waters, unlike anywhere else in Greece. A cold coffee from the small canteen keeps your energy high.",
        "You continue to Vroulidia, the southernmost beach of Chios. Turquoise waters, gentle waves and absolute calm. The sound of the sea becomes your personal soundtrack.",
        "Because you are a beach lover, the day continues at Komi’s golden sandy beach. Ouzo, fresh seafood and long, lazy moments by the sea.",
        "Back at Voulamandis House, after a refreshing shower, you relax under the large vine in the garden. A book, soft music, or simply silence.",
        "Sunset finds you in Karfas, enjoying a cool drink by the waves.",
      ],
    },
    beachesTitle: "Beaches to add to your Chios beach plan",
    beachesIntro:
      "Use Voulamandis House as your calm base and create a beach-hopping holiday around the most beautiful parts of Chios.",
    beaches: [
      {
        name: "Mavra Volia",
        image: images.mavraVolia,
        href: "/chios/chios-beaches/emporios-beach/",
        tag: "Volcanic beach",
        description:
          "Dark pebbles, deep waters and one of the most unforgettable landscapes in Chios.",
      },
      {
        name: "Agia Fotia",
        image: images.agiaFotia,
        href: "/chios/chios-beaches/agia-fotia-beach/",
        tag: "Clear waters",
        description:
          "A beautiful beach with bright blue water, ideal for relaxed swimming and a classic Chios beach day.",
      },
      {
        name: "Komi",
        image: images.komi,
        href: "/chios/chios-beaches/komi-beach/",
        tag: "Golden sand",
        description:
          "A lively sandy beach for swimming, seafood, ouzo and easy summer moments by the sea.",
      },
      {
        name: "Salagona",
        image: images.salagona,
        href: "/chios/chios-beaches/salagona-beach/",
        tag: "South Chios",
        description:
          "A quieter choice for travellers who want a more natural beach experience in South Chios.",
      },
      {
        name: "Vroulidia",
        image: images.vroulidia,
        href: "/chios/chios-beaches/",
        tag: "Turquoise waters",
        description:
          "A small southern beach with calm colours, sea views and a feeling of escape.",
      },
      {
        name: "Kato Fana",
        image: images.katoFana,
        href: "/chios/chios-beaches/",
        tag: "Hidden feeling",
        description:
          "A peaceful beach idea for travellers who like quiet corners and open sea horizons.",
      },
    ],
    stay: {
      title: "Why beach lovers stay at Voulamandis House",
      text: "Voulamandis House is in Kampos, close enough for easy beach trips and peaceful enough for slow mornings, garden evenings and real rest after a full day by the sea.",
      image: images.voulamandis,
      cta: "See rooms and rates",
    },
    finalCta: {
      title: "Ready for your Chios beach holiday?",
      text: "Choose Voulamandis House as your base and enjoy beaches, villages, mastic culture and quiet garden moments in one trip.",
      button: "Book direct",
    },
  },

  el: {
    locale: "el",
    seo: {
      title: "Η Χίος για λάτρεις της παραλίας | Voulamandis House",
      description:
        "Οργάνωσε τις διακοπές σου στη Χίο με βάση το Voulamandis House και ανακάλυψε Μαύρα Βόλια, Βρουλίδια, Κώμη, Αγία Φωτιά και άλλες παραλίες.",
      canonicalPath: "/el/xios-gia-latreis-paralias/",
      ogImage: images.hero,
    },
    hero: {
      eyebrow: "Για λάτρεις της παραλίας",
      title: "Η ιδανική beach day στη Χίο ξεκινά από το Voulamandis House",
      subtitle:
        "Μείνε στον ήσυχο Κάμπο και εξερεύνησε τις παραλίες της νότιας Χίου, από τα ηφαιστειακά Μαύρα Βόλια μέχρι την Κώμη και τα γαλήνια Βρουλίδια.",
      primaryCta: "Δες διαθεσιμότητα",
      secondaryCta: "Δες τις παραλίες",
      image: images.hero,
    },
    intro: {
      title: "Η τέλεια beach day με το Voulamandis House",
      paragraphs: [
        "Ξεκινάς τη μέρα σου με έναν ήρεμο περίπατο στον μαγικό Κάμπο, εκεί όπου βρίσκεται το Voulamandis House. Μια βόλτα ανάμεσα σε περιβόλια εσπεριδοειδών και ιστορικά αρχοντικά.",
        "Γεμάτος ενέργεια, επιστρέφεις στο Voulamandis House και απολαμβάνεις ένα χειροποίητο, υγιεινό πρωινό. Αρωματικές μαρμελάδες εσπεριδοειδών, φρέσκες γεύσεις και σπιτικές λιχουδιές.",
        "Η σημερινή μέρα έχει τίτλο: Νότια Χίος – Beach Day.",
        "Πρώτη στάση: το Μουσείο Μαστίχας. Ένα ταξίδι στην ιστορία και τον πολιτισμό του νησιού.",
        "Μετά φτάνεις στα μοναδικά Μαύρα Βόλια. Κολύμπι σε ηφαιστειακά νερά, σε ένα τοπίο που δεν μοιάζει με κανένα άλλο στην Ελλάδα.",
        "Συνεχίζεις στα Βρουλίδια, τη νοτιότερη παραλία της Χίου. Τιρκουάζ νερά, ήρεμα κύματα και απόλυτη γαλήνη.",
        "Επειδή είσαι beach lover, η μέρα συνεχίζεται στη χρυσαφένια αμμουδιά της Κώμης. Ούζο, φρέσκα θαλασσινά και χαλαρές στιγμές δίπλα στη θάλασσα.",
        "Πίσω στο Voulamandis House, μετά από ένα δροσερό ντους, χαλαρώνεις κάτω από τη μεγάλη κληματαριά στον κήπο.",
        "Το ηλιοβασίλεμα σε βρίσκει στον Καρφά, με ένα δροσερό ποτό δίπλα στο κύμα.",
      ],
    },
    beachesTitle: "Παραλίες που αξίζει να βάλεις στο πρόγραμμα",
    beachesIntro:
      "Χρησιμοποίησε το Voulamandis House σαν ήρεμη βάση και φτιάξε ένα πρόγραμμα γεμάτο παραλίες στη Χίο.",
    beaches: [
      {
        name: "Μαύρα Βόλια",
        image: images.mavraVolia,
        href: "/el/paralies-xios/paralia-mavra-volia/",
        tag: "Ηφαιστειακή παραλία",
        description:
          "Μαύρα βότσαλα, βαθιά νερά και ένα από τα πιο εντυπωσιακά τοπία της Χίου.",
      },
      {
        name: "Αγία Φωτιά",
        image: images.agiaFotia,
        href: "/el/paralies-xios/paralia-agia-fotia/",
        tag: "Καθαρά νερά",
        description:
          "Όμορφη παραλία με γαλάζια νερά, ιδανική για χαλαρό μπάνιο.",
      },
      {
        name: "Κώμη",
        image: images.komi,
        href: "/el/paralies-xios/paralia-komi/",
        tag: "Χρυσή άμμος",
        description:
          "Ζωντανή αμμουδιά για μπάνιο, φαγητό, ούζο και καλοκαιρινή χαλάρωση.",
      },
      {
        name: "Σαλάγωνα",
        image: images.salagona,
        href: "/el/paralies-xios/paralia-salagona/",
        tag: "Νότια Χίος",
        description:
          "Πιο ήσυχη επιλογή για ταξιδιώτες που αγαπούν τη φυσική ομορφιά.",
      },
      {
        name: "Βρουλίδια",
        image: images.vroulidia,
        href: "/el/paralies-xios/",
        tag: "Τιρκουάζ νερά",
        description:
          "Μικρή νότια παραλία με χρώματα, θέα και αίσθηση απόδρασης.",
      },
      {
        name: "Κάτω Φανά",
        image: images.katoFana,
        href: "/el/paralies-xios/",
        tag: "Ήσυχη γωνιά",
        description:
          "Μια ήρεμη ιδέα για όσους αγαπούν ανοιχτούς ορίζοντες και λιγότερο κόσμο.",
      },
    ],
    stay: {
      title: "Γιατί οι beach lovers μένουν στο Voulamandis House",
      text: "Το Voulamandis House βρίσκεται στον Κάμπο, αρκετά κοντά για ημερήσιες εκδρομές στις παραλίες και αρκετά ήσυχο για πραγματική ξεκούραση μετά τη θάλασσα.",
      image: images.voulamandis,
      cta: "Δες δωμάτια και τιμές",
    },
    finalCta: {
      title: "Έτοιμος για διακοπές στη Χίο με παραλίες;",
      text: "Διάλεξε το Voulamandis House ως βάση και ζήσε παραλίες, χωριά, μαστίχα και ήρεμες στιγμές στον κήπο.",
      button: "Κάνε απευθείας κράτηση",
    },
  },

  fr: {
    locale: "fr",
    seo: {
      title: "Chios pour les amoureux de la plage | Voulamandis House",
      description:
        "Séjournez à Voulamandis House et découvrez les plages de Chios: Mavra Volia, Vroulidia, Komi, Agia Fotia, Kato Fana et plus encore.",
      canonicalPath: "/fr/chios-pour-amoureux-de-plage/",
      ogImage: images.hero,
    },
    hero: {
      eyebrow: "Pour les amoureux de la plage",
      title: "Votre journée idéale à la plage commence à Voulamandis House",
      subtitle:
        "Séjournez dans le calme de Kampos et explorez les plages du sud de Chios.",
      primaryCta: "Voir les disponibilités",
      secondaryCta: "Explorer les plages",
      image: images.hero,
    },
    intro: {
      title: "Votre journée parfaite avec Voulamandis House",
      paragraphs: [
        "La journée commence par une promenade paisible dans la région magique de Kampos, entre vergers d’agrumes et demeures historiques.",
        "De retour à Voulamandis House, vous profitez d’un petit-déjeuner fait maison, sain et plein de saveurs locales.",
        "Le programme du jour est simple: sud de Chios – journée plage.",
        "Premier arrêt: le Musée du Mastic, pour découvrir l’histoire et la culture de l’île.",
        "Ensuite, direction Mavra Volia, une plage volcanique unique aux eaux profondes.",
        "Vous continuez vers Vroulidia, une petite plage du sud aux eaux turquoise et à l’atmosphère calme.",
        "La journée se prolonge à Komi, avec sa plage de sable doré, ses fruits de mer et ses moments lents au bord de la mer.",
        "De retour à Voulamandis House, vous vous détendez dans le jardin après une douche fraîche.",
        "Le coucher du soleil vous trouve à Karfas, avec un verre frais près des vagues.",
      ],
    },
    beachesTitle: "Les plages à ajouter à votre programme",
    beachesIntro:
      "Depuis Voulamandis House, créez facilement un séjour plage autour des plus beaux coins de Chios.",
    beaches: [
      {
        name: "Mavra Volia",
        image: images.mavraVolia,
        href: "/fr/plages-de-chios/plage-mavra-volia/",
        tag: "Plage volcanique",
        description:
          "Galets sombres, eaux profondes et un paysage inoubliable.",
      },
      {
        name: "Agia Fotia",
        image: images.agiaFotia,
        href: "/fr/plages-de-chios/plage-agia-fotia/",
        tag: "Eaux claires",
        description:
          "Une belle plage pour nager tranquillement dans une eau lumineuse.",
      },
      {
        name: "Komi",
        image: images.komi,
        href: "/fr/plages-de-chios/plage-komi/",
        tag: "Sable doré",
        description:
          "Une plage animée pour la baignade, les fruits de mer et les longues pauses d’été.",
      },
      {
        name: "Salagona",
        image: images.salagona,
        href: "/fr/plages-de-chios/plage-salagona/",
        tag: "Sud de Chios",
        description:
          "Un choix plus calme pour profiter d’une beauté naturelle.",
      },
      {
        name: "Vroulidia",
        image: images.vroulidia,
        href: "/fr/plages-de-chios/",
        tag: "Eaux turquoise",
        description:
          "Une petite plage du sud avec une vraie sensation d’évasion.",
      },
      {
        name: "Kato Fana",
        image: images.katoFana,
        href: "/fr/plages-de-chios/",
        tag: "Calme",
        description:
          "Une idée paisible pour ceux qui aiment les horizons ouverts.",
      },
    ],
    stay: {
      title: "Pourquoi séjourner à Voulamandis House",
      text: "Voulamandis House se trouve à Kampos, une base calme pour explorer les plages et se reposer dans le jardin après la mer.",
      image: images.voulamandis,
      cta: "Voir les chambres et les tarifs",
    },
    finalCta: {
      title: "Prêt pour vos vacances plage à Chios ?",
      text: "Choisissez Voulamandis House comme base et combinez plages, villages et moments de détente.",
      button: "Réserver en direct",
    },
  },

  de: {
    locale: "de",
    seo: {
      title: "Chios für Strandliebhaber | Voulamandis House",
      description:
        "Planen Sie Ihren Strandurlaub auf Chios mit Voulamandis House und entdecken Sie Mavra Volia, Komi, Agia Fotia, Vroulidia und mehr.",
      canonicalPath: "/de/chios-fuer-strandliebhaber/",
      ogImage: images.hero,
    },
    hero: {
      eyebrow: "Für Strandliebhaber",
      title: "Ihr perfekter Strandtag auf Chios beginnt im Voulamandis House",
      subtitle:
        "Wohnen Sie ruhig in Kampos und entdecken Sie die Strände im Süden von Chios.",
      primaryCta: "Verfügbarkeit prüfen",
      secondaryCta: "Strände entdecken",
      image: images.hero,
    },
    intro: {
      title: "Ihr perfekter Strandtag mit Voulamandis House",
      paragraphs: [
        "Der Tag beginnt mit einem ruhigen Spaziergang durch Kampos, zwischen Zitrusgärten und historischen Herrenhäusern.",
        "Zurück im Voulamandis House genießen Sie ein hausgemachtes, gesundes Frühstück mit frischen lokalen Aromen.",
        "Der Tag steht unter dem Motto: Süd-Chios – Strandtag.",
        "Erster Halt: das Mastix-Museum, ein Einblick in Geschichte und Kultur der Insel.",
        "Danach geht es nach Mavra Volia, einem einzigartigen Vulkanstrand mit tiefem Wasser.",
        "Weiter geht es nach Vroulidia, einer ruhigen südlichen Bucht mit türkisfarbenem Wasser.",
        "Als Strandliebhaber verbringen Sie den Nachmittag in Komi, mit goldenem Sand, Meeresfrüchten und entspannten Momenten.",
        "Zurück im Voulamandis House entspannen Sie nach einer frischen Dusche im Garten.",
        "Den Sonnenuntergang genießen Sie in Karfas mit einem kühlen Getränk am Meer.",
      ],
    },
    beachesTitle: "Strände für Ihren Chios-Plan",
    beachesIntro:
      "Vom Voulamandis House aus können Sie die schönsten Strände von Chios einfach entdecken.",
    beaches: [
      {
        name: "Mavra Volia",
        image: images.mavraVolia,
        href: "/de/straende-chios/mavra-volia-strand/",
        tag: "Vulkanstrand",
        description:
          "Dunkle Kiesel, tiefes Wasser und eine der eindrucksvollsten Landschaften der Insel.",
      },
      {
        name: "Agia Fotia",
        image: images.agiaFotia,
        href: "/de/straende-chios/agia-fotia-strand/",
        tag: "Klares Wasser",
        description:
          "Ein schöner Strand für entspanntes Schwimmen und einen klassischen Sommertag.",
      },
      {
        name: "Komi",
        image: images.komi,
        href: "/de/straende-chios/komi-strand/",
        tag: "Goldener Sand",
        description:
          "Ein lebhafter Sandstrand mit Essen, Meer und entspannter Sommerstimmung.",
      },
      {
        name: "Salagona",
        image: images.salagona,
        href: "/de/straende-chios/salagona-strand/",
        tag: "Süd-Chios",
        description:
          "Eine ruhigere Wahl für Reisende, die natürliche Schönheit suchen.",
      },
      {
        name: "Vroulidia",
        image: images.vroulidia,
        href: "/de/straende-chios/",
        tag: "Türkisfarbenes Wasser",
        description:
          "Ein kleiner Strand im Süden mit Blick aufs Meer und ruhiger Atmosphäre.",
      },
      {
        name: "Kato Fana",
        image: images.katoFana,
        href: "/de/straende-chios/",
        tag: "Ruhig",
        description:
          "Eine friedliche Idee für Gäste, die offene Horizonte lieben.",
      },
    ],
    stay: {
      title: "Warum Strandliebhaber im Voulamandis House wohnen",
      text: "Voulamandis House liegt in Kampos: ruhig zum Erholen und praktisch als Ausgangspunkt für Strandtage.",
      image: images.voulamandis,
      cta: "Zimmer und Preise ansehen",
    },
    finalCta: {
      title: "Bereit für Ihren Strandurlaub auf Chios?",
      text: "Wählen Sie Voulamandis House als Basis für Strände, Dörfer und ruhige Gartenmomente.",
      button: "Direkt buchen",
    },
  },

  it: {
    locale: "it",
    seo: {
      title: "Chios per amanti del mare | Voulamandis House",
      description:
        "Scopri le spiagge di Chios soggiornando a Voulamandis House: Mavra Volia, Komi, Agia Fotia, Vroulidia, Kato Fana e altro.",
      canonicalPath: "/it/chios-per-amanti-del-mare/",
      ogImage: images.hero,
    },
    hero: {
      eyebrow: "Per amanti del mare",
      title: "La tua giornata perfetta al mare inizia da Voulamandis House",
      subtitle:
        "Soggiorna nella tranquillità di Kampos ed esplora le spiagge del sud di Chios.",
      primaryCta: "Controlla disponibilità",
      secondaryCta: "Esplora le spiagge",
      image: images.hero,
    },
    intro: {
      title: "La giornata perfetta con Voulamandis House",
      paragraphs: [
        "La giornata comincia con una passeggiata tranquilla a Kampos, tra agrumeti e dimore storiche.",
        "Poi torni a Voulamandis House per una colazione fatta in casa, sana e ricca di sapori locali.",
        "Il programma di oggi è chiaro: Sud di Chios – giornata al mare.",
        "Prima tappa: il Museo del Mastice, per conoscere la storia dell’isola.",
        "Poi arrivi a Mavra Volia, una spiaggia vulcanica unica in Grecia.",
        "Continui verso Vroulidia, una piccola spiaggia meridionale con acque turchesi e grande calma.",
        "La giornata prosegue a Komi, con sabbia dorata, pesce fresco e momenti lenti vicino al mare.",
        "Di ritorno a Voulamandis House, ti rilassi in giardino dopo una doccia rinfrescante.",
        "Il tramonto ti trova a Karfas, con una bevanda fresca accanto alle onde.",
      ],
    },
    beachesTitle: "Spiagge da aggiungere al tuo itinerario",
    beachesIntro:
      "Usa Voulamandis House come base tranquilla per scoprire alcune delle spiagge più belle di Chios.",
    beaches: [
      {
        name: "Mavra Volia",
        image: images.mavraVolia,
        href: "/it/spiagge-chios/spiaggia-mavra-volia/",
        tag: "Spiaggia vulcanica",
        description:
          "Ciottoli scuri, acqua profonda e un paesaggio indimenticabile.",
      },
      {
        name: "Agia Fotia",
        image: images.agiaFotia,
        href: "/it/spiagge-chios/spiaggia-agia-fotia/",
        tag: "Acque limpide",
        description:
          "Una bella spiaggia per nuotare e rilassarsi in piena estate.",
      },
      {
        name: "Komi",
        image: images.komi,
        href: "/it/spiagge-chios/spiaggia-komi/",
        tag: "Sabbia dorata",
        description:
          "Una spiaggia vivace per mare, cibo e momenti estivi senza fretta.",
      },
      {
        name: "Salagona",
        image: images.salagona,
        href: "/it/spiagge-chios/spiaggia-salagona/",
        tag: "Sud di Chios",
        description:
          "Una scelta più tranquilla per chi ama la natura.",
      },
      {
        name: "Vroulidia",
        image: images.vroulidia,
        href: "/it/spiagge-chios/",
        tag: "Acque turchesi",
        description:
          "Una piccola spiaggia del sud con atmosfera calma e vista mare.",
      },
      {
        name: "Kato Fana",
        image: images.katoFana,
        href: "/it/spiagge-chios/",
        tag: "Tranquilla",
        description:
          "Un’idea rilassante per chi ama gli spazi aperti e il silenzio.",
      },
    ],
    stay: {
      title: "Perché scegliere Voulamandis House",
      text: "Voulamandis House si trova a Kampos, una base tranquilla per esplorare le spiagge e riposare in giardino dopo il mare.",
      image: images.voulamandis,
      cta: "Vedi camere e prezzi",
    },
    finalCta: {
      title: "Pronto per una vacanza mare a Chios?",
      text: "Scegli Voulamandis House come base per spiagge, villaggi e momenti di relax.",
      button: "Prenota direttamente",
    },
  },

  es: {
    locale: "es",
    seo: {
      title: "Quíos para amantes de la playa | Voulamandis House",
      description:
        "Planea tus vacaciones de playa en Quíos con Voulamandis House y descubre Mavra Volia, Komi, Agia Fotia, Vroulidia y más.",
      canonicalPath: "/es/quios-para-amantes-de-la-playa/",
      ogImage: images.hero,
    },
    hero: {
      eyebrow: "Para amantes de la playa",
      title: "Tu día perfecto de playa en Quíos empieza en Voulamandis House",
      subtitle:
        "Quédate en la tranquilidad de Kampos y explora las playas del sur de Quíos.",
      primaryCta: "Ver disponibilidad",
      secondaryCta: "Explorar playas",
      image: images.hero,
    },
    intro: {
      title: "Tu día perfecto con Voulamandis House",
      paragraphs: [
        "El día empieza con un paseo tranquilo por Kampos, entre huertos de cítricos y mansiones históricas.",
        "Después vuelves a Voulamandis House para disfrutar de un desayuno casero, saludable y lleno de sabores locales.",
        "El plan del día es claro: sur de Quíos – día de playa.",
        "Primera parada: el Museo de la Mastiha, una visita a la historia y cultura de la isla.",
        "Luego llegas a Mavra Volia, una playa volcánica única con aguas profundas.",
        "Continúas hacia Vroulidia, una pequeña playa del sur con aguas turquesas y mucha calma.",
        "La jornada sigue en Komi, con arena dorada, marisco fresco y momentos lentos junto al mar.",
        "De vuelta en Voulamandis House, te relajas en el jardín después de una ducha refrescante.",
        "El atardecer te encuentra en Karfas, con una bebida fresca junto a las olas.",
      ],
    },
    beachesTitle: "Playas para añadir a tu plan",
    beachesIntro:
      "Usa Voulamandis House como base tranquila para descubrir algunas de las mejores playas de Quíos.",
    beaches: [
      {
        name: "Mavra Volia",
        image: images.mavraVolia,
        href: "/es/playas-chios/playa-mavra-volia/",
        tag: "Playa volcánica",
        description:
          "Piedras oscuras, aguas profundas y un paisaje inolvidable.",
      },
      {
        name: "Agia Fotia",
        image: images.agiaFotia,
        href: "/es/playas-chios/playa-agia-fotia/",
        tag: "Aguas claras",
        description:
          "Una playa bonita para nadar con calma y disfrutar del verano.",
      },
      {
        name: "Komi",
        image: images.komi,
        href: "/es/playas-chios/playa-komi/",
        tag: "Arena dorada",
        description:
          "Una playa animada para nadar, comer y vivir momentos tranquilos junto al mar.",
      },
      {
        name: "Salagona",
        image: images.salagona,
        href: "/es/playas-chios/playa-salagona/",
        tag: "Sur de Quíos",
        description:
          "Una opción más tranquila para quienes buscan belleza natural.",
      },
      {
        name: "Vroulidia",
        image: images.vroulidia,
        href: "/es/playas-chios/",
        tag: "Aguas turquesas",
        description:
          "Una pequeña playa del sur con ambiente de escapada.",
      },
      {
        name: "Kato Fana",
        image: images.katoFana,
        href: "/es/playas-chios/",
        tag: "Tranquila",
        description:
          "Una idea relajada para quienes aman los horizontes abiertos.",
      },
    ],
    stay: {
      title: "Por qué alojarte en Voulamandis House",
      text: "Voulamandis House está en Kampos, una base tranquila para explorar playas y descansar en el jardín después del mar.",
      image: images.voulamandis,
      cta: "Ver habitaciones y precios",
    },
    finalCta: {
      title: "¿Listo para tus vacaciones de playa en Quíos?",
      text: "Elige Voulamandis House como base para playas, pueblos y momentos de relax.",
      button: "Reservar directo",
    },
  },

  tr: {
    locale: "tr",
    seo: {
      title: "Plaj Severler için Sakız Adası | Voulamandis House",
      description:
        "Voulamandis House’ta konaklayın ve Sakız Adası’nın Mavra Volia, Komi, Agia Fotia, Vroulidia ve diğer plajlarını keşfedin.",
      canonicalPath: "/tr/plaj-severler-icin-sakiz-adasi/",
      ogImage: images.hero,
    },
    hero: {
      eyebrow: "Plaj severler için",
      title: "Sakız Adası’nda mükemmel plaj gününüz Voulamandis House’ta başlar",
      subtitle:
        "Sakin Kampos bölgesinde konaklayın ve Sakız Adası’nın güney plajlarını keşfedin.",
      primaryCta: "Müsaitliği kontrol et",
      secondaryCta: "Plajları keşfet",
      image: images.hero,
    },
    intro: {
      title: "Voulamandis House ile mükemmel plaj günü",
      paragraphs: [
        "Güne Kampos bölgesinde, narenciye bahçeleri ve tarihi konaklar arasında sakin bir yürüyüşle başlarsınız.",
        "Sonra Voulamandis House’a dönüp ev yapımı, sağlıklı ve yerel lezzetlerle dolu bir kahvaltının tadını çıkarırsınız.",
        "Bugünün planı belli: Güney Sakız – plaj günü.",
        "İlk durak: Mastiha Müzesi. Ada kültürü ve tarihi için güzel bir başlangıç.",
        "Sonra Mavra Volia’ya ulaşırsınız. Volkanik taşları ve derin sularıyla benzersiz bir plaj.",
        "Devamında turkuaz suları ve sakin atmosferiyle Vroulidia gelir.",
        "Plaj sever olduğunuz için gün Komi’de devam eder: altın kum, deniz ürünleri ve deniz kenarında yavaş anlar.",
        "Voulamandis House’a dönünce serin bir duştan sonra bahçede dinlenirsiniz.",
        "Gün batımı sizi Karfas’ta, dalgaların yanında serin bir içecekle bulur.",
      ],
    },
    beachesTitle: "Planınıza ekleyebileceğiniz plajlar",
    beachesIntro:
      "Voulamandis House’u sakin üssünüz yapın ve Sakız Adası’nın güzel plajlarını keşfedin.",
    beaches: [
      {
        name: "Mavra Volia",
        image: images.mavraVolia,
        href: "/tr/sakiz-adasi-plajlari/mavra-volia-plaji/",
        tag: "Volkanik plaj",
        description:
          "Koyu renkli taşlar, derin sular ve unutulmaz bir manzara.",
      },
      {
        name: "Agia Fotia",
        image: images.agiaFotia,
        href: "/tr/sakiz-adasi-plajlari/agia-fotia-plaji/",
        tag: "Temiz sular",
        description:
          "Rahat yüzme ve klasik bir yaz günü için güzel bir plaj.",
      },
      {
        name: "Komi",
        image: images.komi,
        href: "/tr/sakiz-adasi-plajlari/komi-plaji/",
        tag: "Altın kum",
        description:
          "Yüzme, yemek ve deniz kenarında keyifli anlar için canlı bir plaj.",
      },
      {
        name: "Salagona",
        image: images.salagona,
        href: "/tr/sakiz-adasi-plajlari/salagona-plaji/",
        tag: "Güney Sakız",
        description:
          "Doğal güzelliği sevenler için daha sakin bir seçenek.",
      },
      {
        name: "Vroulidia",
        image: images.vroulidia,
        href: "/tr/sakiz-adasi-plajlari/",
        tag: "Turkuaz sular",
        description:
          "Güneyde, kaçış hissi veren küçük ve sakin bir plaj.",
      },
      {
        name: "Kato Fana",
        image: images.katoFana,
        href: "/tr/sakiz-adasi-plajlari/",
        tag: "Sakin",
        description:
          "Açık deniz manzaralarını ve sessizliği sevenler için güzel bir fikir.",
      },
    ],
    stay: {
      title: "Plaj severler neden Voulamandis House’u seçiyor?",
      text: "Voulamandis House, Kampos’ta sakin bir konumdadır. Plaj gezileri için pratik, deniz sonrası dinlenmek için huzurludur.",
      image: images.voulamandis,
      cta: "Odaları ve fiyatları gör",
    },
    finalCta: {
      title: "Sakız Adası plaj tatiline hazır mısınız?",
      text: "Voulamandis House’u üssünüz yapın; plajları, köyleri ve sakin bahçe anlarını aynı tatilde yaşayın.",
      button: "Direkt rezervasyon",
    },
  },
};

export function getBeachLoversPageByLocale(locale: LanguageCode) {
  return beachLoversPages[locale];
}

export function getBeachLoversPageByPath(path: string) {
  return Object.values(beachLoversPages).find(
    (page) => page.seo.canonicalPath === path,
  );
}