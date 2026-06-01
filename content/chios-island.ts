export type ChiosIslandPageData = {
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
    title: string;
    paragraphs: string[];
    highlights: {
      label: string;
      value: string;
    }[];
  };
  experiences: {
    kicker: string;
    title: string;
    description: string;
    items: {
      title: string;
      description: string;
      image: string;
      imageAlt: string;
      href: string;
      ctaLabel: string;
      tags: string[];
    }[];
  };
  quiz: {
    title: string;
    text: string;
    ctaLabel: string;
    href: string;
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
  sticky: {
    whatsappHref: string;
    bookingHref: string;
  };
};

const chiosIslandHeroImage =
  "https://chioshotel.gr/wp-content/uploads/2026/03/chios.hotels.voulamandis.house_.hero_.image_.webp";

const agiaDynamiImage =
  "https://chioshotel.gr/wp-content/uploads/2026/03/sakiz-agia-dynami.jpg";

const villagesImage =
  "https://chioshotel.gr/wp-content/uploads/2021/12/lagada_3.webp";

const masticMuseumImage =
  "https://chioshotel.gr/wp-content/uploads/2022/12/mousio.mastic.webp";

const whatsappHref = "https://wa.me/306944474226";

export const chiosIslandPageEn: ChiosIslandPageData = {
  seo: {
    canonicalPath: "/chios-island/",
    title: "Chios Island Guide | Beaches, Villages & Mastic Culture",
    description:
      "Explore Chios Island through its beaches, medieval villages, mastic culture and authentic local experiences. Plan your stay from Voulamandis House in Kampos.",
    ogImage: chiosIslandHeroImage,
  },
  hero: {
    kicker: "Discover Chios",
    title: "Explore Chios Island",
    description:
      "Discover medieval villages, crystal-clear beaches and the unique mastic culture that makes Chios unlike any other Greek island.",
    image: chiosIslandHeroImage,
    primaryCta: {
      label: "Explore Chios",
      href: "#discover",
    },
    secondaryCta: {
      label: "Check rates",
      href: "/chios-hotels-rates/",
    },
  },
  intro: {
    title: "A Greek island with real character",
    paragraphs: [
      "Chios Island is a distinctive destination in the northeastern Aegean Sea, known for its fortified villages, scenic coastline and the world-famous mastic resin that is cultivated only here.",
      "It offers an authentic Greek island experience, rich in history, local tradition, natural beauty and quieter travel away from the crowds.",
      "From the citrus estates of Kampos to the southern mastic villages and the dramatic coastlines of the island, Chios reveals a different side of Greece.",
    ],
    highlights: [
      {
        label: "Known for",
        value: "Mastic culture",
      },
      {
        label: "Best for",
        value: "Authentic travel",
      },
      {
        label: "Base area",
        value: "Kampos",
      },
      {
        label: "Experience",
        value: "Beaches & villages",
      },
    ],
  },
  experiences: {
    kicker: "Top experiences",
    title: "What to discover in Chios",
    description:
      "Start with the essentials and explore the island through its beaches, villages and unique mastic heritage.",
    items: [
      {
        title: "Pristine Beaches",
        description:
          "Explore the coast of Chios through organized beaches, hidden coves and memorable landscapes, from volcanic pebbles to crystal turquoise waters.",
        image: agiaDynamiImage,
        imageAlt: "Agia Dynami beach in Chios with turquoise water",
        href: "/chios/chios-beaches/",
        ctaLabel: "View beaches",
        tags: ["Crystal waters", "Hidden coves", "Summer days"],
      },
      {
        title: "Medieval Villages",
        description:
          "Explore Mesta, Pyrgi and other fortress villages of southern Chios, where stone alleys and traditional architecture preserve the island’s rich past.",
        image: villagesImage,
        imageAlt: "Traditional village and coastal scenery in Chios",
        href: "/chios/chios-villages/",
        ctaLabel: "Explore villages",
        tags: ["Mesta", "Pyrgi", "Stone alleys"],
      },
      {
        title: "Mastic Culture",
        description:
          "Learn the story of Chios mastic, a unique product cultivated only on this island and one of the strongest symbols of its cultural identity.",
        image: masticMuseumImage,
        imageAlt: "Chios Mastic Museum and mastic culture experience",
        href: "/chios/chios-museums/the-mastic-museum-chios/",
        ctaLabel: "View museum",
        tags: ["Mastic", "Culture", "Local heritage"],
      },
    ],
  },
  quiz: {
    title: "Want to discover Chios in a fun way?",
    text:
      "Take the quiz created by Voulamandis House especially for its guests. Discover which side of Chios matches your style and get to know the island in a more personal way.",
    ctaLabel: "Start quiz",
    href: "/chios-holidays-quiz/",
  },
  stay: {
    kicker: "Stay in Kampos",
    title: "Use Voulamandis House as your Chios base",
    text:
      "Experience authentic hospitality in the historic Kampos area and stay close to Chios Town, the airport and the routes that lead to beaches, villages and cultural landmarks.",
    primaryCta: {
      label: "Book your stay",
      href: "/chios-hotels-rates/",
    },
    secondaryCta: {
      label: "View rooms",
      href: "/chios-rooms/",
    },
  },
  sticky: {
    whatsappHref,
    bookingHref: "/chios-hotels-rates/",
  },
};

export const chiosIslandPageEl: ChiosIslandPageData = {
  seo: {
    canonicalPath: "/el/ti-na-do-sti-xio/",
    title: "Οδηγός Χίου | Παραλίες, Χωριά & Πολιτισμός της Μαστίχας",
    description:
      "Ανακαλύψτε τη Χίο μέσα από τις παραλίες, τα μεσαιωνικά χωριά, τη μαστίχα και αυθεντικές τοπικές εμπειρίες, με βάση το Voulamandis House στον Κάμπο.",
    ogImage: chiosIslandHeroImage,
  },
  hero: {
    kicker: "Ανακαλύψτε τη Χίο",
    title: "Εξερευνήστε τη Χίο",
    description:
      "Γνωρίστε τα μεσαιωνικά χωριά, τις καθαρές παραλίες και τη μοναδική κουλτούρα της μαστίχας που κάνουν τη Χίο ξεχωριστή.",
    image: chiosIslandHeroImage,
    primaryCta: {
      label: "Ανακαλύψτε τη Χίο",
      href: "#discover",
    },
    secondaryCta: {
      label: "Δείτε τιμές",
      href: "/el/amesi-kratisi-voulamandis-house/",
    },
  },
  intro: {
    title: "Ένα ελληνικό νησί με αυθεντικό χαρακτήρα",
    paragraphs: [
      "Η Χίος είναι ένας ξεχωριστός προορισμός στο βορειοανατολικό Αιγαίο, γνωστός για τα καστροχώρια, τις όμορφες ακτές και την παγκοσμίως γνωστή μαστίχα που καλλιεργείται μόνο εδώ.",
      "Προσφέρει μια αυθεντική εμπειρία ελληνικού νησιού, με ιστορία, τοπική παράδοση, φυσική ομορφιά και πιο ήρεμες διακοπές μακριά από την πολυκοσμία.",
      "Από τα περιβόλια του Κάμπου μέχρι τα μαστιχοχώρια του νότου και τις εντυπωσιακές ακτογραμμές, η Χίος αποκαλύπτει μια διαφορετική πλευρά της Ελλάδας.",
    ],
    highlights: [
      {
        label: "Γνωστή για",
        value: "Τη μαστίχα",
      },
      {
        label: "Ιδανική για",
        value: "Αυθεντικά ταξίδια",
      },
      {
        label: "Περιοχή βάσης",
        value: "Κάμπος",
      },
      {
        label: "Εμπειρία",
        value: "Παραλίες & χωριά",
      },
    ],
  },
  experiences: {
    kicker: "Κορυφαίες εμπειρίες",
    title: "Τι να ανακαλύψετε στη Χίο",
    description:
      "Ξεκινήστε από τα βασικά και γνωρίστε το νησί μέσα από τις παραλίες, τα χωριά και τη μοναδική μαστιχένια παράδοσή του.",
    items: [
      {
        title: "Καθαρές παραλίες",
        description:
          "Εξερευνήστε τις ακτές της Χίου με οργανωμένες παραλίες, κρυμμένους όρμους και αξέχαστα τοπία, από ηφαιστειακά βότσαλα μέχρι κρυστάλλινα νερά.",
        image: agiaDynamiImage,
        imageAlt: "Η παραλία Αγία Δύναμη στη Χίο με γαλαζοπράσινα νερά",
        href: "/el/paralies-xios/",
        ctaLabel: "Δείτε παραλίες",
        tags: ["Καθαρά νερά", "Κρυφοί όρμοι", "Καλοκαιρινές μέρες"],
      },
      {
        title: "Μεσαιωνικά χωριά",
        description:
          "Εξερευνήστε τα Μεστά, το Πυργί και άλλα καστροχώρια της νότιας Χίου, όπου τα πέτρινα σοκάκια και η παραδοσιακή αρχιτεκτονική κρατούν ζωντανό το παρελθόν.",
        image: villagesImage,
        imageAlt: "Παραδοσιακό χωριό και παραθαλάσσιο τοπίο στη Χίο",
        href: "/el/xoria-xios/",
        ctaLabel: "Δείτε χωριά",
        tags: ["Μεστά", "Πυργί", "Πέτρινα σοκάκια"],
      },
      {
        title: "Πολιτισμός της μαστίχας",
        description:
          "Γνωρίστε την ιστορία της χιώτικης μαστίχας, ενός μοναδικού προϊόντος που καλλιεργείται μόνο στο νησί και αποτελεί σύμβολο της τοπικής ταυτότητας.",
        image: masticMuseumImage,
        imageAlt: "Μουσείο Μαστίχας Χίου και εμπειρία μαστιχοκαλλιέργειας",
        href: "/el/mouseia-xios/mouseio-mastichas-xios/",
        ctaLabel: "Δείτε μουσείο",
        tags: ["Μαστίχα", "Πολιτισμός", "Τοπική κληρονομιά"],
      },
    ],
  },
  quiz: {
    title: "Θέλετε να γνωρίσετε τη Χίο με διασκεδαστικό τρόπο;",
    text:
      "Κάντε το quiz που δημιούργησε το Voulamandis House ειδικά για τους επισκέπτες του. Ανακαλύψτε ποια πλευρά της Χίου ταιριάζει στο στυλ σας και γνωρίστε το νησί πιο προσωπικά.",
    ctaLabel: "Ξεκινήστε το quiz",
    href: "/el/diakopes-sti-chio-quiz/",
  },
  stay: {
    kicker: "Διαμονή στον Κάμπο",
    title: "Κάντε το Voulamandis House τη βάση σας στη Χίο",
    text:
      "Ζήστε αυθεντική φιλοξενία στον ιστορικό Κάμπο και μείνετε κοντά στην πόλη της Χίου, το αεροδρόμιο και τις διαδρομές που οδηγούν σε παραλίες, χωριά και πολιτιστικά αξιοθέατα.",
    primaryCta: {
      label: "Κλείστε τη διαμονή σας",
      href: "/el/amesi-kratisi-voulamandis-house/",
    },
    secondaryCta: {
      label: "Δείτε δωμάτια",
      href: "/el/domatia-xios/",
    },
  },
  sticky: {
    whatsappHref,
    bookingHref: "/el/amesi-kratisi-voulamandis-house/",
  },
};

export const chiosIslandPageFr: ChiosIslandPageData = {
  seo: {
    canonicalPath: "/fr/chios-en-grece/",
    title: "Guide de Chios | Plages, villages et culture du mastic",
    description:
      "Explorez l’île de Chios à travers ses plages, ses villages médiévaux, la culture du mastic et des expériences locales authentiques depuis Voulamandis House à Kampos.",
    ogImage: chiosIslandHeroImage,
  },
  hero: {
    kicker: "Découvrir Chios",
    title: "Explorez l’île de Chios",
    description:
      "Découvrez des villages médiévaux, des plages aux eaux limpides et la culture unique du mastic qui rend Chios différente des autres îles grecques.",
    image: chiosIslandHeroImage,
    primaryCta: {
      label: "Découvrir Chios",
      href: "#discover",
    },
    secondaryCta: {
      label: "Voir les tarifs",
      href: "/fr/tarifs-des-hotels-a-chios/",
    },
  },
  intro: {
    title: "Une île grecque au vrai caractère",
    paragraphs: [
      "Chios est une destination singulière du nord-est de la mer Égée, connue pour ses villages fortifiés, son littoral varié et la résine de mastic mondialement célèbre, cultivée uniquement ici.",
      "L’île offre une expérience grecque authentique, riche en histoire, traditions locales, beauté naturelle et voyages plus calmes, loin des foules.",
      "Des domaines d’agrumes de Kampos aux villages du mastic du sud et aux côtes spectaculaires de l’île, Chios révèle une autre facette de la Grèce.",
    ],
    highlights: [
      {
        label: "Connue pour",
        value: "La culture du mastic",
      },
      {
        label: "Idéale pour",
        value: "Voyager autrement",
      },
      {
        label: "Base idéale",
        value: "Kampos",
      },
      {
        label: "Expérience",
        value: "Plages et villages",
      },
    ],
  },
  experiences: {
    kicker: "Expériences incontournables",
    title: "Que découvrir à Chios",
    description:
      "Commencez par l’essentiel et explorez l’île à travers ses plages, ses villages et son patrimoine unique lié au mastic.",
    items: [
      {
        title: "Plages préservées",
        description:
          "Explorez la côte de Chios entre plages organisées, criques cachées et paysages mémorables, des galets volcaniques aux eaux turquoise.",
        image: agiaDynamiImage,
        imageAlt: "La plage d’Agia Dynami à Chios avec des eaux turquoise",
        href: "/fr/plages-de-chios/",
        ctaLabel: "Voir les plages",
        tags: ["Eaux cristallines", "Criques cachées", "Journées d’été"],
      },
      {
        title: "Villages médiévaux",
        description:
          "Explorez Mesta, Pyrgi et d’autres villages fortifiés du sud de Chios, où les ruelles de pierre et l’architecture traditionnelle préservent le passé de l’île.",
        image: villagesImage,
        imageAlt: "Village traditionnel et paysage côtier à Chios",
        href: "/fr/villages-de-chios/",
        ctaLabel: "Explorer les villages",
        tags: ["Mesta", "Pyrgi", "Ruelles de pierre"],
      },
      {
        title: "Culture du mastic",
        description:
          "Découvrez l’histoire du mastic de Chios, un produit unique cultivé seulement sur cette île et l’un des symboles les plus forts de son identité culturelle.",
        image: masticMuseumImage,
        imageAlt: "Musée du Mastic de Chios et expérience autour de la culture du mastic",
        href: "/fr/musees-de-chios/musee-du-mastic-chios/",
        ctaLabel: "Voir le musée",
        tags: ["Mastic", "Culture", "Patrimoine local"],
      },
    ],
  },
  quiz: {
    title: "Envie de découvrir Chios de manière ludique ?",
    text:
      "Faites le quiz créé par Voulamandis House spécialement pour ses hôtes. Découvrez quelle facette de Chios correspond à votre style et apprenez à connaître l’île de façon plus personnelle.",
    ctaLabel: "Commencer le quiz",
    href: "/chios-holidays-quiz/",
  },
  stay: {
    kicker: "Séjourner à Kampos",
    title: "Faites de Voulamandis House votre base à Chios",
    text:
      "Profitez d’une hospitalité authentique dans le quartier historique de Kampos, près de la ville de Chios, de l’aéroport et des routes vers les plages, villages et sites culturels.",
    primaryCta: {
      label: "Réserver votre séjour",
      href: "/fr/tarifs-des-hotels-a-chios/",
    },
    secondaryCta: {
      label: "Voir les chambres",
      href: "/fr/chambres-a-chios/",
    },
  },
  sticky: {
    whatsappHref,
    bookingHref: "/fr/tarifs-des-hotels-a-chios/",
  },
};

export const chiosIslandPageDe: ChiosIslandPageData = {
  seo: {
    canonicalPath: "/de/chios-insel/",
    title: "Chios Reiseführer | Strände, Dörfer und Mastixkultur",
    description:
      "Entdecken Sie Chios mit Stränden, mittelalterlichen Dörfern, Mastixkultur und authentischen lokalen Erlebnissen. Planen Sie Ihren Aufenthalt im Voulamandis House in Kampos.",
    ogImage: chiosIslandHeroImage,
  },
  hero: {
    kicker: "Chios entdecken",
    title: "Die Insel Chios erkunden",
    description:
      "Entdecken Sie mittelalterliche Dörfer, kristallklare Strände und die einzigartige Mastixkultur, die Chios von anderen griechischen Inseln unterscheidet.",
    image: chiosIslandHeroImage,
    primaryCta: {
      label: "Chios entdecken",
      href: "#discover",
    },
    secondaryCta: {
      label: "Preise ansehen",
      href: "/de/hotelpreise-auf-der-insel-chios/",
    },
  },
  intro: {
    title: "Eine griechische Insel mit echtem Charakter",
    paragraphs: [
      "Chios ist ein besonderer Reiseziel im nordöstlichen Ägäischen Meer, bekannt für befestigte Dörfer, abwechslungsreiche Küsten und das weltberühmte Mastixharz, das nur hier kultiviert wird.",
      "Die Insel bietet ein authentisches griechisches Reiseerlebnis mit Geschichte, lokaler Tradition, natürlicher Schönheit und ruhigeren Urlaubsmomenten abseits der Massen.",
      "Von den Zitrusgärten in Kampos über die Mastixdörfer im Süden bis zu den eindrucksvollen Küsten zeigt Chios eine andere Seite Griechenlands.",
    ],
    highlights: [
      {
        label: "Bekannt für",
        value: "Mastixkultur",
      },
      {
        label: "Ideal für",
        value: "Authentisches Reisen",
      },
      {
        label: "Ausgangspunkt",
        value: "Kampos",
      },
      {
        label: "Erlebnis",
        value: "Strände und Dörfer",
      },
    ],
  },
  experiences: {
    kicker: "Top-Erlebnisse",
    title: "Was Sie auf Chios entdecken können",
    description:
      "Beginnen Sie mit den Highlights und erkunden Sie die Insel über ihre Strände, Dörfer und das einzigartige Mastix-Erbe.",
    items: [
      {
        title: "Unberührte Strände",
        description:
          "Erkunden Sie die Küste von Chios mit organisierten Stränden, versteckten Buchten und eindrucksvollen Landschaften, von vulkanischen Kieseln bis zu türkisblauem Wasser.",
        image: agiaDynamiImage,
        imageAlt: "Agia Dynami Strand auf Chios mit türkisfarbenem Wasser",
        href: "/de/straende-chios/",
        ctaLabel: "Strände ansehen",
        tags: ["Kristallklares Wasser", "Versteckte Buchten", "Sommertage"],
      },
      {
        title: "Mittelalterliche Dörfer",
        description:
          "Erkunden Sie Mesta, Pyrgi und weitere Festungsdörfer im Süden von Chios, wo Steingassen und traditionelle Architektur die Geschichte der Insel bewahren.",
        image: villagesImage,
        imageAlt: "Traditionelles Dorf und Küstenlandschaft auf Chios",
        href: "/de/doerfer-chios/",
        ctaLabel: "Dörfer entdecken",
        tags: ["Mesta", "Pyrgi", "Steingassen"],
      },
      {
        title: "Mastixkultur",
        description:
          "Erfahren Sie die Geschichte des Chios-Mastix, eines einzigartigen Produkts, das nur auf dieser Insel kultiviert wird und ein starkes Symbol ihrer kulturellen Identität ist.",
        image: masticMuseumImage,
        imageAlt: "Chios Mastixmuseum und Erlebnis rund um die Mastixkultur",
        href: "/de/museen-chios/mastix-museum-chios/",
        ctaLabel: "Museum ansehen",
        tags: ["Mastix", "Kultur", "Lokales Erbe"],
      },
    ],
  },
  quiz: {
    title: "Möchten Sie Chios auf spielerische Weise entdecken?",
    text:
      "Machen Sie das Quiz, das Voulamandis House speziell für seine Gäste erstellt hat. Finden Sie heraus, welche Seite von Chios zu Ihrem Reisestil passt, und lernen Sie die Insel persönlicher kennen.",
    ctaLabel: "Quiz starten",
    href: "/chios-holidays-quiz/",
  },
  stay: {
    kicker: "Aufenthalt in Kampos",
    title: "Nutzen Sie Voulamandis House als Ausgangspunkt auf Chios",
    text:
      "Erleben Sie authentische Gastfreundschaft im historischen Kampos und wohnen Sie nahe der Stadt Chios, dem Flughafen und den Routen zu Stränden, Dörfern und kulturellen Sehenswürdigkeiten.",
    primaryCta: {
      label: "Aufenthalt buchen",
      href: "/de/hotelpreise-auf-der-insel-chios/",
    },
    secondaryCta: {
      label: "Zimmer ansehen",
      href: "/de/chios-zimmer/",
    },
  },
  sticky: {
    whatsappHref,
    bookingHref: "/de/hotelpreise-auf-der-insel-chios/",
  },
};

export const chiosIslandPageIt: ChiosIslandPageData = {
  seo: {
    canonicalPath: "/it/chios-lisola-in-grecia/",
    title: "Guida di Chios | Spiagge, villaggi e cultura del mastice",
    description:
      "Scoprite l’isola di Chios attraverso spiagge, villaggi medievali, cultura del mastice ed esperienze locali autentiche, con Voulamandis House a Kampos come base.",
    ogImage: chiosIslandHeroImage,
  },
  hero: {
    kicker: "Scoprire Chios",
    title: "Esplorate l’isola di Chios",
    description:
      "Scoprite villaggi medievali, spiagge cristalline e la cultura unica del mastice che rende Chios diversa da ogni altra isola greca.",
    image: chiosIslandHeroImage,
    primaryCta: {
      label: "Scoprite Chios",
      href: "#discover",
    },
    secondaryCta: {
      label: "Vedi prezzi",
      href: "/it/prezzi-hotel-chios/",
    },
  },
  intro: {
    title: "Un’isola greca dal carattere autentico",
    paragraphs: [
      "Chios è una destinazione speciale nel nord-est del Mar Egeo, conosciuta per i villaggi fortificati, la costa suggestiva e la famosa resina di mastice, coltivata solo qui.",
      "Offre un’esperienza autentica di isola greca, ricca di storia, tradizione locale, bellezza naturale e viaggi più tranquilli lontano dalla folla.",
      "Dagli agrumeti di Kampos ai villaggi del mastice del sud e alle coste spettacolari dell’isola, Chios rivela un lato diverso della Grecia.",
    ],
    highlights: [
      {
        label: "Conosciuta per",
        value: "Cultura del mastice",
      },
      {
        label: "Ideale per",
        value: "Viaggi autentici",
      },
      {
        label: "Base ideale",
        value: "Kampos",
      },
      {
        label: "Esperienza",
        value: "Spiagge e villaggi",
      },
    ],
  },
  experiences: {
    kicker: "Esperienze principali",
    title: "Cosa scoprire a Chios",
    description:
      "Iniziate dall’essenziale ed esplorate l’isola attraverso le sue spiagge, i villaggi e l’unico patrimonio del mastice.",
    items: [
      {
        title: "Spiagge incontaminate",
        description:
          "Esplorate la costa di Chios tra spiagge organizzate, calette nascoste e paesaggi memorabili, dai ciottoli vulcanici alle acque turchesi.",
        image: agiaDynamiImage,
        imageAlt: "Spiaggia di Agia Dynami a Chios con acque turchesi",
        href: "/it/spiagge-chios/",
        ctaLabel: "Vedi spiagge",
        tags: ["Acque cristalline", "Calette nascoste", "Giornate estive"],
      },
      {
        title: "Villaggi medievali",
        description:
          "Esplorate Mesta, Pyrgi e altri villaggi fortificati del sud di Chios, dove vicoli in pietra e architettura tradizionale conservano il passato dell’isola.",
        image: villagesImage,
        imageAlt: "Villaggio tradizionale e paesaggio costiero a Chios",
        href: "/it/villaggi-chios/",
        ctaLabel: "Esplora villaggi",
        tags: ["Mesta", "Pyrgi", "Vicoli in pietra"],
      },
      {
        title: "Cultura del mastice",
        description:
          "Scoprite la storia del mastice di Chios, un prodotto unico coltivato solo su quest’isola e uno dei simboli più forti della sua identità culturale.",
        image: masticMuseumImage,
        imageAlt: "Museo del Mastice di Chios ed esperienza sulla cultura del mastice",
        href: "/it/musei-chios/museo-del-mastice-chios/",
        ctaLabel: "Vedi museo",
        tags: ["Mastice", "Cultura", "Patrimonio locale"],
      },
    ],
  },
  quiz: {
    title: "Volete scoprire Chios in modo divertente?",
    text:
      "Fate il quiz creato da Voulamandis House appositamente per i suoi ospiti. Scoprite quale lato di Chios si adatta al vostro stile e conoscete l’isola in modo più personale.",
    ctaLabel: "Inizia il quiz",
    href: "/chios-holidays-quiz/",
  },
  stay: {
    kicker: "Soggiorno a Kampos",
    title: "Usate Voulamandis House come base a Chios",
    text:
      "Vivete un’ospitalità autentica nella storica zona di Kampos, vicino alla città di Chios, all’aeroporto e alle strade che portano a spiagge, villaggi e luoghi culturali.",
    primaryCta: {
      label: "Prenota il soggiorno",
      href: "/it/prezzi-hotel-chios/",
    },
    secondaryCta: {
      label: "Vedi camere",
      href: "/it/camere-a-chios/",
    },
  },
  sticky: {
    whatsappHref,
    bookingHref: "/it/prezzi-hotel-chios/",
  },
};

export const chiosIslandPageEs: ChiosIslandPageData = {
  seo: {
    canonicalPath: "/es/chios-en-grecia/",
    title: "Guía de Quíos | Playas, pueblos y cultura de la masilla",
    description:
      "Explore la isla de Quíos a través de sus playas, pueblos medievales, cultura de la masilla y experiencias locales auténticas, con Voulamandis House en Kampos como base.",
    ogImage: chiosIslandHeroImage,
  },
  hero: {
    kicker: "Descubra Quíos",
    title: "Explore la isla de Quíos",
    description:
      "Descubra pueblos medievales, playas de aguas cristalinas y la cultura única de la masilla que hace que Quíos sea diferente de otras islas griegas.",
    image: chiosIslandHeroImage,
    primaryCta: {
      label: "Descubrir Quíos",
      href: "#discover",
    },
    secondaryCta: {
      label: "Ver precios",
      href: "/es/los-mejores-precios-de-hotel-en-la-isla-chios/",
    },
  },
  intro: {
    title: "Una isla griega con verdadero carácter",
    paragraphs: [
      "Quíos es un destino especial en el noreste del mar Egeo, conocido por sus pueblos fortificados, su costa pintoresca y la famosa resina de masilla, cultivada únicamente aquí.",
      "Ofrece una experiencia auténtica de isla griega, rica en historia, tradición local, belleza natural y viajes más tranquilos lejos de las multitudes.",
      "Desde las fincas de cítricos de Kampos hasta los pueblos de la masilla del sur y las costas espectaculares de la isla, Quíos revela una cara diferente de Grecia.",
    ],
    highlights: [
      {
        label: "Conocida por",
        value: "Cultura de la masilla",
      },
      {
        label: "Ideal para",
        value: "Viajes auténticos",
      },
      {
        label: "Zona base",
        value: "Kampos",
      },
      {
        label: "Experiencia",
        value: "Playas y pueblos",
      },
    ],
  },
  experiences: {
    kicker: "Experiencias principales",
    title: "Qué descubrir en Quíos",
    description:
      "Empiece por lo esencial y explore la isla a través de sus playas, pueblos y el patrimonio único de la masilla.",
    items: [
      {
        title: "Playas vírgenes",
        description:
          "Explore la costa de Quíos con playas organizadas, calas escondidas y paisajes memorables, desde guijarros volcánicos hasta aguas turquesas.",
        image: agiaDynamiImage,
        imageAlt: "Playa de Agia Dynami en Quíos con aguas turquesas",
        href: "/es/playas-chios/",
        ctaLabel: "Ver playas",
        tags: ["Aguas cristalinas", "Calas escondidas", "Días de verano"],
      },
      {
        title: "Pueblos medievales",
        description:
          "Explore Mesta, Pyrgi y otros pueblos fortificados del sur de Quíos, donde los callejones de piedra y la arquitectura tradicional conservan el pasado de la isla.",
        image: villagesImage,
        imageAlt: "Pueblo tradicional y paisaje costero en Quíos",
        href: "/es/pueblos-chios/",
        ctaLabel: "Explorar pueblos",
        tags: ["Mesta", "Pyrgi", "Callejones de piedra"],
      },
      {
        title: "Cultura de la masilla",
        description:
          "Conozca la historia de la masilla de Quíos, un producto único cultivado solo en esta isla y uno de los símbolos más fuertes de su identidad cultural.",
        image: masticMuseumImage,
        imageAlt: "Museo de la Masilla de Quíos y experiencia cultural del mastic",
        href: "/es/museos-chios/museo-mastiha-chios/",
        ctaLabel: "Ver museo",
        tags: ["Masilla", "Cultura", "Patrimonio local"],
      },
    ],
  },
  quiz: {
    title: "¿Quiere descubrir Quíos de una forma divertida?",
    text:
      "Haga el quiz creado por Voulamandis House especialmente para sus huéspedes. Descubra qué lado de Quíos se adapta a su estilo y conozca la isla de una manera más personal.",
    ctaLabel: "Empezar quiz",
    href: "/chios-holidays-quiz/",
  },
  stay: {
    kicker: "Alojarse en Kampos",
    title: "Use Voulamandis House como base en Quíos",
    text:
      "Disfrute de una hospitalidad auténtica en la histórica zona de Kampos y alójese cerca de la ciudad de Quíos, del aeropuerto y de las rutas que llevan a playas, pueblos y lugares culturales.",
    primaryCta: {
      label: "Reservar estancia",
      href: "/es/los-mejores-precios-de-hotel-en-la-isla-chios/",
    },
    secondaryCta: {
      label: "Ver habitaciones",
      href: "/es/habitaciones-en-chios/",
    },
  },
  sticky: {
    whatsappHref,
    bookingHref: "/es/los-mejores-precios-de-hotel-en-la-isla-chios/",
  },
};

export const chiosIslandPageTr: ChiosIslandPageData = {
  seo: {
    canonicalPath: "/tr/sakiz-adasi/",
    title: "Sakız Adası Rehberi | Plajlar, Köyler ve Mastik Kültürü",
    description:
      "Sakız Adası’nı plajları, ortaçağ köyleri, mastik kültürü ve yerel deneyimleriyle keşfedin. Kampos’taki Voulamandis House’u konaklama üssünüz yapın.",
    ogImage: chiosIslandHeroImage,
  },
  hero: {
    kicker: "Sakız’ı keşfedin",
    title: "Sakız Adası’nı keşfedin",
    description:
      "Ortaçağ köylerini, tertemiz plajları ve Sakız Adası’nı diğer Yunan adalarından ayıran eşsiz mastik kültürünü keşfedin.",
    image: chiosIslandHeroImage,
    primaryCta: {
      label: "Sakız’ı keşfet",
      href: "#discover",
    },
    secondaryCta: {
      label: "Fiyatları gör",
      href: "/tr/sakiz-adasi-rezervasyon/",
    },
  },
  intro: {
    title: "Gerçek karaktere sahip bir Yunan adası",
    paragraphs: [
      "Sakız Adası, kuzeydoğu Ege Denizi’nde yer alan; kale köyleri, etkileyici kıyıları ve yalnızca burada yetiştirilen dünyaca ünlü mastik reçinesiyle tanınan özel bir destinasyondur.",
      "Ada; tarih, yerel gelenek, doğal güzellik ve kalabalıklardan uzak daha sakin bir tatil arayanlar için otantik bir Yunan adası deneyimi sunar.",
      "Kampos’un narenciye bahçelerinden güneydeki mastik köylerine ve adanın dramatik kıyılarına kadar Sakız, Yunanistan’ın farklı bir yüzünü gösterir.",
    ],
    highlights: [
      {
        label: "Bilinen özelliği",
        value: "Mastik kültürü",
      },
      {
        label: "En uygun",
        value: "Otantik seyahat",
      },
      {
        label: "Konaklama bölgesi",
        value: "Kampos",
      },
      {
        label: "Deneyim",
        value: "Plajlar ve köyler",
      },
    ],
  },
  experiences: {
    kicker: "En iyi deneyimler",
    title: "Sakız Adası’nda neler keşfedilir",
    description:
      "Temel noktalardan başlayın ve adayı plajları, köyleri ve eşsiz mastik mirası üzerinden keşfedin.",
    items: [
      {
        title: "Bakir plajlar",
        description:
          "Sakız kıyılarını organize plajlar, saklı koylar ve unutulmaz manzaralarla keşfedin; volkanik çakıllardan turkuaz sulara kadar çok farklı sahiller sizi bekler.",
        image: agiaDynamiImage,
        imageAlt: "Sakız Adası’nda turkuaz sularıyla Agia Dynami Plajı",
        href: "/tr/sakiz-adasi-plajlari/",
        ctaLabel: "Plajları gör",
        tags: ["Kristal sular", "Saklı koylar", "Yaz günleri"],
      },
      {
        title: "Ortaçağ köyleri",
        description:
          "Sakız’ın güneyindeki Mesta, Pyrgi ve diğer kale köylerini keşfedin; taş sokaklar ve geleneksel mimari adanın zengin geçmişini yaşatır.",
        image: villagesImage,
        imageAlt: "Sakız Adası’nda geleneksel köy ve kıyı manzarası",
        href: "/tr/sakiz-adasi-koyleri/",
        ctaLabel: "Köyleri keşfet",
        tags: ["Mesta", "Pyrgi", "Taş sokaklar"],
      },
      {
        title: "Mastik kültürü",
        description:
          "Yalnızca bu adada yetiştirilen ve Sakız’ın kültürel kimliğinin en güçlü simgelerinden biri olan Sakız mastiğinin hikayesini öğrenin.",
        image: masticMuseumImage,
        imageAlt: "Sakız Mastik Müzesi ve mastik kültürü deneyimi",
        href: "/tr/sakiz-adasi-muzeleri/sakiz-mastik-muzesi/",
        ctaLabel: "Müzeyi gör",
        tags: ["Mastik", "Kültür", "Yerel miras"],
      },
    ],
  },
  quiz: {
    title: "Sakız Adası’nı eğlenceli bir şekilde keşfetmek ister misiniz?",
    text:
      "Voulamandis House’un misafirleri için özel olarak hazırladığı testi yapın. Sakız’ın hangi yönünün tarzınıza uyduğunu keşfedin ve adayı daha kişisel bir şekilde tanıyın.",
    ctaLabel: "Teste başla",
    href: "/chios-holidays-quiz/",
  },
  stay: {
    kicker: "Kampos’ta konaklayın",
    title: "Voulamandis House’u Sakız Adası üssünüz yapın",
    text:
      "Tarihi Kampos bölgesinde otantik misafirperverliği deneyimleyin; Sakız şehir merkezine, havaalanına ve plajlara, köylere, kültürel noktalara giden rotalara yakın konaklayın.",
    primaryCta: {
      label: "Konaklamanızı ayırtın",
      href: "/tr/sakiz-adasi-rezervasyon/",
    },
    secondaryCta: {
      label: "Odaları görüntüle",
      href: "/tr/sakiz-adasi-odalari/",
    },
  },
  sticky: {
    whatsappHref,
    bookingHref: "/tr/sakiz-adasi-rezervasyon/",
  },
};

export function getLocalizedChiosIslandPageByPath(
  path: string,
): ChiosIslandPageData | undefined {
  switch (path) {
    case chiosIslandPageEl.seo.canonicalPath:
      return chiosIslandPageEl;
    case chiosIslandPageFr.seo.canonicalPath:
      return chiosIslandPageFr;
    case chiosIslandPageDe.seo.canonicalPath:
      return chiosIslandPageDe;
    case chiosIslandPageIt.seo.canonicalPath:
      return chiosIslandPageIt;
    case chiosIslandPageEs.seo.canonicalPath:
      return chiosIslandPageEs;
    case chiosIslandPageTr.seo.canonicalPath:
      return chiosIslandPageTr;
    default:
      return undefined;
  }
}
