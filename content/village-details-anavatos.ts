import type { VillageDetailData } from "@/content/village-details";

// Anavatos (central Chios) in all 7 languages.
// Sources checked 2026-11-08: chios.gr (Municipality of Chios, /el/anavatos and
// /en/anavatos), trekking.chios.gr (Taxiarchis church page), archaiologia.gr /
// ANA-MPA 14-11-2022 (Ephorate of Antiquities of Chios restoration, 1962
// monument status, 1866 resettlement, 1881 earthquake), travel.gr, Discover
// Greece (GNTO). Drive time from Kambos: content/trip-planner/village-routing.ts.
// No opening hours or ticket details are given because none could be verified.

const IMAGE = "/images/villages/anavatos-chios-hd.webp";

const anavatosEnBase: VillageDetailData = {
  slug: "anavatos-chios",
  seo: {
    canonicalPath: "/chios/chios-villages/anavatos-chios/",
    title: "Anavatos Chios | The Abandoned 'Mystras of the Aegean'",
    description:
      "Walk through Anavatos, the abandoned medieval village on a 450 m rock in central Chios: its history, what to see, how to visit and how to combine it with Avgonyma and Nea Moni.",
    ogImage: IMAGE,
  },
  hero: {
    kicker: "Central Chios • Medieval stronghold",
    title: "Anavatos: the Mystras of the Aegean",
    description:
      "An abandoned medieval village built on a steep rock between two gorges in central Chios, with stone houses, vaulted lanes and one of the most dramatic views on the island.",
    image: IMAGE,
    tags: ["#anavatos", "#medieval_chios", "#history", "#photography"],
  },
  heroImageAlt: "The abandoned medieval village of Anavatos on its rock in central Chios",
  answerText:
    "Anavatos is the most dramatic historic site in the interior of Chios: a fortified medieval village clinging to a rock about 450 m high, abandoned after the 1822 massacre and the 1881 earthquake and now protected as a historic monument. It is about 30 minutes by car from Kambos and pairs naturally with Avgonyma and Nea Moni.",
  details: [
    {
      icon: "📍",
      title: "Location & access",
      text:
        "Anavatos lies in central Chios, about 16–20 km from Chios Town and roughly 30 minutes by car from Kambos. You park below the old village and climb on foot to the single gate in its wall.",
    },
    {
      icon: "🏰",
      title: "A village built to be hidden",
      text:
        "The fortified part was built under Genoese rule and walled against pirates. Houses rise in tiers on the rock, linked by steep cobbled lanes, arches and covered passages.",
    },
    {
      icon: "💡",
      title: "Local tip",
      text:
        "Go in the morning or late afternoon: the climb is steep, there is little shade and the light on the stone is far better. Wear proper shoes and bring water.",
    },
  ],
  highlights: {
    title: "What to see in Anavatos",
    items: [
      "The 'Triorofo', a three-level building with an olive press, a school and the restored church of the Virgin",
      "The church of the Taxiarchis at the top of the rock",
      "Vaulted lanes and houses built into the bedrock",
      "Views over the two gorges and the mountains of central Chios",
    ],
  },
  experience: {
    title: "Why Anavatos matters",
    paragraphs: [
      "Anavatos is often called the 'Mystras of the Aegean'. Its residents took part in the 1821 uprising and the village was taken during the massacre of 1822; the Municipality of Chios calls it 'the Zalongo of Chios', its last stronghold of freedom. Survivors fled as far as Syros, where they founded the Anavatousika neighbourhood of Ermoupoli.",
      "The village was resettled in 1866 by 72 families, but the great earthquake of 1881 emptied the walled settlement for good and life moved to the new village at the foot of the hill. The castle was declared a historic monument in 1962, and in 2022 the Ephorate of Antiquities of Chios completed the restoration of the church of the Virgin, whose bell rang again for the first time in decades.",
    ],
  },
  guide: {
    kicker: "Plan your visit",
    title: "Walking through Anavatos",
    intro:
      "Anavatos is an open-air monument, not a museum, so treat it like a short mountain walk.",
    sections: [
      {
        title: "The route through the village",
        paragraphs: [
          "From the parking area you climb towards the single gate in the wall. Near it stands the 'Triorofo', the three-level building that housed the olive press, the school and a cistern, with the church of the Virgin on top.",
          "From there the lanes zigzag up to the church of the Taxiarchis, the one building you can see from far away. The Ephorate has improved the paths and placed benches, but the steps are uneven and steep.",
        ],
      },
      {
        title: "Respect the monument",
        paragraphs: [
          "The whole settlement is a protected archaeological site and many houses are fragile ruins. Stay on the marked lanes, do not climb on walls and take your rubbish with you.",
        ],
      },
    ],
  },
  practical: {
    title: "Anavatos at a glance",
    items: [
      { label: "From Kambos", value: "About 30 minutes by car" },
      { label: "Time needed", value: "1–2 hours" },
      { label: "Best time", value: "Morning or late afternoon" },
      { label: "Terrain", value: "Steep cobbled lanes, not suitable for strollers or limited mobility" },
    ],
  },
  faq: {
    title: "Questions about Anavatos",
    items: [
      {
        question: "Is Anavatos difficult to walk?",
        answer:
          "The climb is short but steep, on cobbled steps with little shade. Most visitors manage it with good shoes and water; it is not suitable for strollers or people with serious mobility limitations.",
      },
      {
        question: "Does anyone live in Anavatos?",
        answer:
          "The walled medieval village has been abandoned since the 1881 earthquake. Life continues in the newer village at the foot of the hill.",
      },
      {
        question: "What can I combine with Anavatos?",
        answer:
          "Anavatos, Avgonyma and the Nea Moni monastery form a classic half-day route in central Chios. Many visitors end the day in Avgonyma for dinner and the sunset, or continue to the beaches of the west coast.",
      },
    ],
  },
  routeIdeas: {
    title: "How to combine Anavatos",
    items: [
      {
        icon: "⛪",
        title: "Nea Moni, Anavatos, Avgonyma",
        text:
          "The classic central Chios route: the UNESCO-listed Nea Moni monastery, then Anavatos, then dinner and sunset in Avgonyma.",
      },
      {
        icon: "🏖️",
        title: "Anavatos and the west coast",
        text: "Visit Anavatos in the morning, then drive down to Elinta or Lithi for a swim.",
        href: "/chios/chios-beaches/elinta-beach/",
        linkLabel: "Elinta beach",
      },
      {
        icon: "🥾",
        title: "On foot",
        text:
          "Hikers can reach Anavatos on the long marked route that links Lithi with Agiasmata via Nea Moni and Avgonyma.",
      },
    ],
  },
  baseTip: {
    icon: "🗺️",
    title: "Your base in Kambos",
    text:
      "From Voulamandis House in Kambos, central Chios is about half an hour away, so you can see Anavatos in the morning and be back in the garden by the afternoon.",
    linkLabel: "Stay with those who know best.",
    href: "/chios-rooms/",
  },
  relatedTitle: "Explore More Chios Villages",
  relatedText: "Continue with the medieval villages, mastic villages and seaside villages of Chios.",
};

const anavatosLocalizedBase: VillageDetailData[] = [
  {
    slug: "anavatos-xios",
    seo: {
      canonicalPath: "/el/xoria-xios/anavatos-xios/",
      title: "Ανάβατος Χίου | Ο «Μυστράς του Αιγαίου» & οδηγός επίσκεψης",
      description:
        "Περπατήστε στον Ανάβατο, το εγκαταλελειμμένο μεσαιωνικό χωριό στον βράχο της κεντρικής Χίου: ιστορία, τι να δείτε, πώς θα πάτε και πώς να τον συνδυάσετε με Αυγώνυμα και Νέα Μονή.",
      ogImage: IMAGE,
    },
    hero: {
      kicker: "Κεντρική Χίος • Μεσαιωνικό κάστρο",
      title: "Ανάβατος: ο Μυστράς του Αιγαίου",
      description:
        "Ένα εγκαταλελειμμένο μεσαιωνικό χωριό χτισμένο σε απόκρημνο βράχο ανάμεσα σε δύο φαράγγια, με πέτρινα σπίτια, θολωτά σοκάκια και μία από τις πιο εντυπωσιακές εικόνες της Χίου.",
      image: IMAGE,
      tags: ["#ανάβατος", "#μεσαιωνική_χίος", "#ιστορία", "#φωτογραφία"],
    },
    heroImageAlt: "Ο εγκαταλελειμμένος μεσαιωνικός Ανάβατος πάνω στον βράχο, στην κεντρική Χίο",
    answerText:
      "Ο Ανάβατος είναι το πιο συγκλονιστικό ιστορικό τοπίο της ενδοχώρας της Χίου: ένας οχυρωμένος μεσαιωνικός οικισμός σε βράχο περίπου 450 μέτρων, που ερήμωσε μετά τη σφαγή του 1822 και τον σεισμό του 1881 και σήμερα προστατεύεται ως ιστορικό μνημείο. Απέχει περίπου 30 λεπτά με το αυτοκίνητο από τον Κάμπο και συνδυάζεται ιδανικά με τα Αυγώνυμα και τη Νέα Μονή.",
    details: [
      {
        icon: "📍",
        title: "Τοποθεσία & πρόσβαση",
        text:
          "Ο Ανάβατος βρίσκεται στην κεντρική Χίο, 16–20 χλμ. από την πόλη και περίπου 30 λεπτά με το αυτοκίνητο από τον Κάμπο. Αφήνετε το αυτοκίνητο κάτω από τον παλιό οικισμό και ανεβαίνετε με τα πόδια ως τη μοναδική πύλη του τείχους.",
      },
      {
        icon: "🏰",
        title: "Ένα χωριό φτιαγμένο για να κρύβεται",
        text:
          "Το οχυρωμένο τμήμα χτίστηκε την περίοδο της Γενουατοκρατίας και περιτειχίστηκε για προστασία από τους πειρατές. Τα σπίτια ανεβαίνουν κλιμακωτά στον βράχο, ενωμένα με απότομα καλντερίμια, καμάρες και στεγασμένα περάσματα.",
      },
      {
        icon: "💡",
        title: "Τοπική συμβουλή",
        text:
          "Πηγαίνετε πρωί ή αργά το απόγευμα: η ανάβαση είναι απότομη, σκιά υπάρχει ελάχιστη και το φως πάνω στην πέτρα είναι πολύ ομορφότερο. Φορέστε κατάλληλα παπούτσια και πάρτε νερό.",
      },
    ],
    highlights: {
      title: "Τι να δείτε στον Ανάβατο",
      items: [
        "Το «Τριώροφο», με το λιοτρίβι, το διδακτήριο και την αναστηλωμένη εκκλησία της Παναγίας",
        "Τον ναό του Ταξιάρχη στην κορυφή του βράχου",
        "Τα θολωτά σοκάκια και τα σπίτια χτισμένα μέσα στον βράχο",
        "Τη θέα προς τα δύο φαράγγια και τα βουνά της κεντρικής Χίου",
      ],
    },
    experience: {
      title: "Γιατί ο Ανάβατος είναι ξεχωριστός",
      paragraphs: [
        "Ο Ανάβατος αποκαλείται συχνά «ο Μυστράς του Αιγαίου». Οι κάτοικοί του πήραν μέρος στην επανάσταση του 1821 και το χωριό έπεσε στη σφαγή του 1822· ο Δήμος Χίου τον χαρακτηρίζει «το Ζάλογγο της Χίου», το τελευταίο προπύργιο της ελευθερίας της. Όσοι γλίτωσαν έφτασαν ως τη Σύρο, όπου ίδρυσαν τη συνοικία Αναβατούσικα στην Ερμούπολη.",
        "Το χωριό ξανακατοικήθηκε το 1866 από 72 οικογένειες, όμως ο μεγάλος σεισμός του 1881 ερήμωσε οριστικά τον περιτειχισμένο οικισμό και η ζωή μεταφέρθηκε στο νέο χωριό, στους πρόποδες του λόφου. Το κάστρο κηρύχθηκε ιστορικό μνημείο το 1962 και το 2022 η Εφορεία Αρχαιοτήτων Χίου ολοκλήρωσε την αποκατάσταση της εκκλησίας της Παναγίας, η καμπάνα της οποίας χτύπησε ξανά ύστερα από δεκαετίες.",
      ],
    },
    guide: {
      kicker: "Οργανώστε την επίσκεψη",
      title: "Περπατώντας στον Ανάβατο",
      intro:
        "Ο Ανάβατος είναι υπαίθριο μνημείο, όχι μουσείο· αντιμετωπίστε τον σαν μια σύντομη ορεινή διαδρομή.",
      sections: [
        {
          title: "Η διαδρομή μέσα στο χωριό",
          paragraphs: [
            "Από τον χώρο στάθμευσης ανεβαίνετε προς τη μοναδική πύλη του τείχους. Κοντά της βρίσκεται το «Τριώροφο», το κτίριο που στέγαζε το λιοτρίβι, το διδακτήριο και μια δεξαμενή, με την εκκλησία της Παναγίας στον τελευταίο όροφο.",
            "Από εκεί τα σοκάκια ανηφορίζουν ζιγκ-ζαγκ μέχρι τον Ταξιάρχη, το κτίσμα που φαίνεται από μακριά. Η Εφορεία έχει βελτιώσει τα μονοπάτια και έχει τοποθετήσει παγκάκια, όμως τα σκαλοπάτια είναι ανώμαλα και απότομα.",
          ],
        },
        {
          title: "Με σεβασμό στο μνημείο",
          paragraphs: [
            "Ολόκληρος ο οικισμός είναι προστατευόμενος αρχαιολογικός χώρος και πολλά σπίτια είναι εύθραυστα ερείπια. Μείνετε στα διαμορφωμένα σοκάκια, μην ανεβαίνετε σε τοίχους και πάρτε μαζί τα σκουπίδια σας.",
          ],
        },
      ],
    },
    practical: {
      title: "Ο Ανάβατος με μια ματιά",
      items: [
        { label: "Από τον Κάμπο", value: "Περίπου 30 λεπτά με το αυτοκίνητο" },
        { label: "Χρόνος επίσκεψης", value: "1–2 ώρες" },
        { label: "Καλύτερη ώρα", value: "Πρωί ή αργά το απόγευμα" },
        { label: "Έδαφος", value: "Απότομα καλντερίμια, όχι για καρότσι ή άτομα με κινητικές δυσκολίες" },
      ],
    },
    faq: {
      title: "Ερωτήσεις για τον Ανάβατο",
      items: [
        {
          question: "Είναι δύσκολη η ανάβαση στον Ανάβατο;",
          answer:
            "Η ανάβαση είναι σύντομη αλλά απότομη, σε πέτρινα σκαλοπάτια με ελάχιστη σκιά. Με κατάλληλα παπούτσια και νερό γίνεται από τους περισσότερους· δεν είναι κατάλληλη για καρότσι ή για άτομα με σοβαρές κινητικές δυσκολίες.",
        },
        {
          question: "Κατοικείται ο Ανάβατος;",
          answer:
            "Ο περιτειχισμένος μεσαιωνικός οικισμός είναι έρημος από τον σεισμό του 1881. Η ζωή συνεχίζεται στο νεότερο χωριό, στους πρόποδες του λόφου.",
        },
        {
          question: "Με τι μπορώ να συνδυάσω τον Ανάβατο;",
          answer:
            "Ανάβατος, Αυγώνυμα και Νέα Μονή είναι η κλασική διαδρομή της κεντρικής Χίου. Πολλοί κλείνουν τη μέρα στα Αυγώνυμα με φαγητό και ηλιοβασίλεμα ή συνεχίζουν για τις παραλίες της δυτικής ακτής.",
        },
      ],
    },
    routeIdeas: {
      title: "Πώς να συνδυάσετε τον Ανάβατο",
      items: [
        {
          icon: "⛪",
          title: "Νέα Μονή, Ανάβατος, Αυγώνυμα",
          text:
            "Η κλασική διαδρομή της κεντρικής Χίου: η Νέα Μονή, μνημείο της UNESCO, μετά ο Ανάβατος και στο τέλος φαγητό και ηλιοβασίλεμα στα Αυγώνυμα.",
        },
        {
          icon: "🏖️",
          title: "Ανάβατος και δυτική ακτή",
          text: "Ανάβατος το πρωί και μετά κατηφόρα για μπάνιο στην Ελίντα ή στο Λιθί.",
          href: "/el/paralies-xios/paralia-elinta/",
          linkLabel: "Παραλία Ελίντα",
        },
        {
          icon: "🥾",
          title: "Με τα πόδια",
          text:
            "Οι πεζοπόροι μπορούν να φτάσουν στον Ανάβατο από τη μεγάλη σηματοδοτημένη διαδρομή που ενώνει το Λιθί με τα Αγιάσματα, μέσω Νέας Μονής και Αυγωνύμων.",
        },
      ],
    },
    baseTip: {
      icon: "🗺️",
      title: "Η βάση σας στον Κάμπο",
      text:
        "Από το Voulamandis House στον Κάμπο η κεντρική Χίος απέχει περίπου μισή ώρα, οπότε μπορείτε να δείτε τον Ανάβατο το πρωί και να είστε πίσω στο περιβόλι το απόγευμα.",
      linkLabel: "Μείνετε με αυτούς που ξέρουν το νησί.",
      href: "/el/domatia-xios/",
    },
    relatedTitle: "Ανακαλύψτε περισσότερα χωριά της Χίου",
    relatedText: "Συνεχίστε με τα μεσαιωνικά χωριά, τα Μαστιχοχώρια και τα παραθαλάσσια χωριά της Χίου.",
  },
  {
    slug: "village-anavatos",
    seo: {
      canonicalPath: "/fr/villages-de-chios/village-anavatos/",
      title: "Anavatos Chios | Le « Mystras de l’Égée » abandonné",
      description:
        "Découvrez Anavatos, village médiéval abandonné sur un rocher de 450 m au centre de Chios : histoire, que voir, comment y aller et comment le combiner avec Avgonyma et Nea Moni.",
      ogImage: IMAGE,
    },
    hero: {
      kicker: "Centre de Chios • Forteresse médiévale",
      title: "Anavatos : le Mystras de l’Égée",
      description:
        "Un village médiéval abandonné, bâti sur un rocher escarpé entre deux gorges au centre de Chios, avec ses maisons de pierre, ses ruelles voûtées et l’une des vues les plus saisissantes de l’île.",
      image: IMAGE,
      tags: ["#anavatos", "#chios_medievale", "#histoire", "#photographie"],
    },
    heroImageAlt: "Le village médiéval abandonné d’Anavatos sur son rocher, au centre de Chios",
    answerText:
      "Anavatos est le site historique le plus impressionnant de l’intérieur de Chios : un village médiéval fortifié accroché à un rocher d’environ 450 m, déserté après le massacre de 1822 et le séisme de 1881, aujourd’hui protégé comme monument historique. Il se trouve à environ 30 minutes en voiture de Kambos et se combine naturellement avec Avgonyma et Nea Moni.",
    details: [
      {
        icon: "📍",
        title: "Situation & accès",
        text:
          "Anavatos se trouve au centre de Chios, à 16–20 km de la ville et à environ 30 minutes en voiture de Kambos. On se gare sous le vieux village et l’on monte à pied jusqu’à l’unique porte de l’enceinte.",
      },
      {
        icon: "🏰",
        title: "Un village fait pour se cacher",
        text:
          "La partie fortifiée a été construite sous la domination génoise et ceinte de murs contre les pirates. Les maisons s’étagent sur le rocher, reliées par des calades raides, des arches et des passages couverts.",
      },
      {
        icon: "💡",
        title: "Conseil local",
        text:
          "Venez le matin ou en fin d’après-midi : la montée est raide, l’ombre rare et la lumière sur la pierre bien plus belle. Portez de bonnes chaussures et emportez de l’eau.",
      },
    ],
    highlights: {
      title: "À voir à Anavatos",
      items: [
        "Le « Triorofo », bâtiment à trois niveaux avec pressoir à huile, école et église de la Vierge restaurée",
        "L’église du Taxiarque au sommet du rocher",
        "Les ruelles voûtées et les maisons creusées dans la roche",
        "La vue sur les deux gorges et les montagnes du centre de Chios",
      ],
    },
    experience: {
      title: "Pourquoi Anavatos compte",
      paragraphs: [
        "Anavatos est souvent surnommé le « Mystras de l’Égée ». Ses habitants ont pris part au soulèvement de 1821 et le village est tombé lors du massacre de 1822 ; la municipalité de Chios l’appelle « le Zalongo de Chios », son dernier bastion de liberté. Les survivants ont fui jusqu’à Syros, où ils ont fondé le quartier d’Anavatousika à Ermoupoli.",
        "Le village a été repeuplé en 1866 par 72 familles, mais le grand séisme de 1881 a définitivement vidé l’enceinte et la vie s’est déplacée vers le nouveau village, au pied de la colline. Le château a été classé monument historique en 1962 et, en 2022, l’Éphorie des antiquités de Chios a achevé la restauration de l’église de la Vierge, dont la cloche a de nouveau sonné après des décennies.",
      ],
    },
    guide: {
      kicker: "Préparer la visite",
      title: "Se promener dans Anavatos",
      intro:
        "Anavatos est un monument à ciel ouvert, pas un musée : abordez-le comme une courte balade en montagne.",
      sections: [
        {
          title: "L’itinéraire dans le village",
          paragraphs: [
            "Depuis le parking, on monte vers l’unique porte de l’enceinte. Tout près se dresse le « Triorofo », le bâtiment à trois niveaux qui abritait le pressoir à huile, l’école et une citerne, avec l’église de la Vierge au dernier étage.",
            "De là, les ruelles grimpent en lacets jusqu’à l’église du Taxiarque, le seul édifice visible de loin. L’Éphorie a aménagé les chemins et installé des bancs, mais les marches restent irrégulières et raides.",
          ],
        },
        {
          title: "Respecter le monument",
          paragraphs: [
            "Tout le village est un site archéologique protégé et beaucoup de maisons sont des ruines fragiles. Restez sur les ruelles aménagées, ne montez pas sur les murs et remportez vos déchets.",
          ],
        },
      ],
    },
    practical: {
      title: "Anavatos en bref",
      items: [
        { label: "Depuis Kambos", value: "Environ 30 minutes en voiture" },
        { label: "Durée de visite", value: "1 à 2 heures" },
        { label: "Meilleur moment", value: "Le matin ou en fin d’après-midi" },
        { label: "Terrain", value: "Calades raides, pas adapté aux poussettes ni aux personnes à mobilité réduite" },
      ],
    },
    faq: {
      title: "Questions sur Anavatos",
      items: [
        {
          question: "La montée à Anavatos est-elle difficile ?",
          answer:
            "La montée est courte mais raide, sur des marches de pierre presque sans ombre. Avec de bonnes chaussures et de l’eau, la plupart des visiteurs y arrivent ; elle ne convient pas aux poussettes ni aux personnes à mobilité très réduite.",
        },
        {
          question: "Anavatos est-il habité ?",
          answer:
            "Le village médiéval fortifié est désert depuis le séisme de 1881. La vie continue dans le village plus récent, au pied de la colline.",
        },
        {
          question: "Avec quoi combiner Anavatos ?",
          answer:
            "Anavatos, Avgonyma et le monastère de Nea Moni forment l’itinéraire classique du centre de Chios. Beaucoup terminent la journée à Avgonyma pour dîner au coucher du soleil, ou poursuivent vers les plages de la côte ouest.",
        },
      ],
    },
    routeIdeas: {
      title: "Comment combiner Anavatos",
      items: [
        {
          icon: "⛪",
          title: "Nea Moni, Anavatos, Avgonyma",
          text:
            "L’itinéraire classique du centre de Chios : le monastère de Nea Moni, classé à l’UNESCO, puis Anavatos, et enfin dîner et coucher de soleil à Avgonyma.",
        },
        {
          icon: "🏖️",
          title: "Anavatos et la côte ouest",
          text: "Anavatos le matin, puis descente vers Elinta ou Lithi pour une baignade.",
          href: "/fr/plages-de-chios/plage-elinta/",
          linkLabel: "Plage d’Elinta",
        },
        {
          icon: "🥾",
          title: "À pied",
          text:
            "Les randonneurs peuvent rejoindre Anavatos par le long itinéraire balisé qui relie Lithi à Agiasmata en passant par Nea Moni et Avgonyma.",
        },
      ],
    },
    baseTip: {
      icon: "🗺️",
      title: "Votre base à Kambos",
      text:
        "Depuis Voulamandis House à Kambos, le centre de Chios est à environ une demi-heure : visitez Anavatos le matin et soyez de retour au jardin l’après-midi.",
      linkLabel: "Séjournez chez ceux qui connaissent l’île.",
      href: "/fr/chambres-a-chios/",
    },
    relatedTitle: "Découvrez plus de villages de Chios",
    relatedText: "Continuez avec les villages médiévaux, les villages du mastic et les villages en bord de mer de Chios.",
  },
  {
    slug: "anavatos-dorf",
    seo: {
      canonicalPath: "/de/doerfer-chios/anavatos-dorf/",
      title: "Anavatos auf Chios | Das verlassene „Mystras der Ägäis“",
      description:
        "Entdecken Sie Anavatos, das verlassene mittelalterliche Dorf auf einem 450 m hohen Felsen im Zentrum von Chios: Geschichte, Sehenswertes, Anfahrt und Kombination mit Avgonyma und Nea Moni.",
      ogImage: IMAGE,
    },
    hero: {
      kicker: "Zentral-Chios • Mittelalterliche Festung",
      title: "Anavatos: das Mystras der Ägäis",
      description:
        "Ein verlassenes mittelalterliches Dorf auf einem steilen Felsen zwischen zwei Schluchten im Zentrum von Chios – mit Steinhäusern, überwölbten Gassen und einem der eindrucksvollsten Ausblicke der Insel.",
      image: IMAGE,
      tags: ["#anavatos", "#mittelalterliches_chios", "#geschichte", "#fotografie"],
    },
    heroImageAlt: "Das verlassene mittelalterliche Dorf Anavatos auf seinem Felsen im Zentrum von Chios",
    answerText:
      "Anavatos ist der eindrucksvollste historische Ort im Inneren von Chios: ein befestigtes mittelalterliches Dorf auf einem rund 450 m hohen Felsen, verlassen nach dem Massaker von 1822 und dem Erdbeben von 1881 und heute als historisches Denkmal geschützt. Es liegt etwa 30 Autominuten von Kambos entfernt und lässt sich ideal mit Avgonyma und Nea Moni verbinden.",
    details: [
      {
        icon: "📍",
        title: "Lage und Anfahrt",
        text:
          "Anavatos liegt im Zentrum von Chios, 16–20 km von Chios-Stadt und etwa 30 Autominuten von Kambos entfernt. Sie parken unterhalb des alten Dorfes und steigen zu Fuß zum einzigen Tor in der Mauer hinauf.",
      },
      {
        icon: "🏰",
        title: "Ein Dorf zum Verstecken",
        text:
          "Der befestigte Teil entstand unter genuesischer Herrschaft und wurde zum Schutz vor Piraten ummauert. Die Häuser steigen terrassenförmig den Felsen hinauf, verbunden durch steile Pflastergassen, Bögen und überdachte Durchgänge.",
      },
      {
        icon: "💡",
        title: "Lokaler Tipp",
        text:
          "Kommen Sie morgens oder am späten Nachmittag: Der Aufstieg ist steil, es gibt kaum Schatten und das Licht auf dem Stein ist viel schöner. Tragen Sie festes Schuhwerk und nehmen Sie Wasser mit.",
      },
    ],
    highlights: {
      title: "Sehenswertes in Anavatos",
      items: [
        "Das „Triorofo“, ein dreistöckiges Gebäude mit Ölmühle, Schule und restaurierter Marienkirche",
        "Die Taxiarchis-Kirche auf dem Gipfel des Felsens",
        "Überwölbte Gassen und in den Fels gebaute Häuser",
        "Der Blick über die beiden Schluchten und die Berge von Zentral-Chios",
      ],
    },
    experience: {
      title: "Warum Anavatos so bedeutend ist",
      paragraphs: [
        "Anavatos wird oft das „Mystras der Ägäis“ genannt. Seine Bewohner beteiligten sich am Aufstand von 1821, und das Dorf fiel beim Massaker von 1822; die Gemeinde Chios nennt es „das Zalongo von Chios“, die letzte Bastion seiner Freiheit. Überlebende flohen bis nach Syros und gründeten dort das Viertel Anavatousika in Ermoupoli.",
        "1866 wurde das Dorf von 72 Familien wiederbesiedelt, doch das große Erdbeben von 1881 leerte die ummauerte Siedlung endgültig, und das Leben zog in das neue Dorf am Fuß des Hügels. Die Burg wurde 1962 zum historischen Denkmal erklärt, und 2022 schloss das Ephorat für Altertümer von Chios die Restaurierung der Marienkirche ab, deren Glocke nach Jahrzehnten wieder läutete.",
      ],
    },
    guide: {
      kicker: "Besuch planen",
      title: "Ein Rundgang durch Anavatos",
      intro:
        "Anavatos ist ein Freilichtdenkmal, kein Museum – planen Sie den Besuch wie eine kurze Bergwanderung.",
      sections: [
        {
          title: "Der Weg durch das Dorf",
          paragraphs: [
            "Vom Parkplatz steigen Sie zum einzigen Tor in der Mauer hinauf. Gleich daneben steht das „Triorofo“, das dreistöckige Gebäude mit Ölmühle, Schule und Zisterne, ganz oben die Marienkirche.",
            "Von dort führen die Gassen im Zickzack hinauf zur Taxiarchis-Kirche, dem einzigen Bau, den man schon von Weitem sieht. Das Ephorat hat die Wege verbessert und Bänke aufgestellt, die Stufen bleiben aber uneben und steil.",
          ],
        },
        {
          title: "Rücksicht auf das Denkmal",
          paragraphs: [
            "Die gesamte Siedlung ist eine geschützte archäologische Stätte, viele Häuser sind empfindliche Ruinen. Bleiben Sie auf den angelegten Gassen, klettern Sie nicht auf Mauern und nehmen Sie Ihren Abfall wieder mit.",
          ],
        },
      ],
    },
    practical: {
      title: "Anavatos auf einen Blick",
      items: [
        { label: "Ab Kambos", value: "Etwa 30 Minuten mit dem Auto" },
        { label: "Zeitbedarf", value: "1–2 Stunden" },
        { label: "Beste Zeit", value: "Morgens oder am späten Nachmittag" },
        { label: "Gelände", value: "Steile Pflastergassen, nicht für Kinderwagen oder eingeschränkte Mobilität geeignet" },
      ],
    },
    faq: {
      title: "Fragen zu Anavatos",
      items: [
        {
          question: "Ist der Aufstieg nach Anavatos schwierig?",
          answer:
            "Der Aufstieg ist kurz, aber steil, über Steinstufen mit kaum Schatten. Mit festen Schuhen und Wasser schaffen ihn die meisten Besucher; für Kinderwagen oder Menschen mit stark eingeschränkter Mobilität ist er nicht geeignet.",
        },
        {
          question: "Wohnt noch jemand in Anavatos?",
          answer:
            "Das ummauerte mittelalterliche Dorf ist seit dem Erdbeben von 1881 verlassen. Das Leben geht im jüngeren Dorf am Fuß des Hügels weiter.",
        },
        {
          question: "Womit lässt sich Anavatos verbinden?",
          answer:
            "Anavatos, Avgonyma und das Kloster Nea Moni bilden die klassische Route durch Zentral-Chios. Viele beenden den Tag in Avgonyma mit Abendessen und Sonnenuntergang oder fahren weiter zu den Stränden der Westküste.",
        },
      ],
    },
    routeIdeas: {
      title: "Anavatos mit anderen Zielen verbinden",
      items: [
        {
          icon: "⛪",
          title: "Nea Moni, Anavatos, Avgonyma",
          text:
            "Die klassische Route durch Zentral-Chios: das UNESCO-Kloster Nea Moni, dann Anavatos und zum Schluss Abendessen und Sonnenuntergang in Avgonyma.",
        },
        {
          icon: "🏖️",
          title: "Anavatos und die Westküste",
          text: "Morgens Anavatos, danach hinunter nach Elinta oder Lithi zum Baden.",
          href: "/de/straende-chios/elinta-strand/",
          linkLabel: "Elinta Strand",
        },
        {
          icon: "🥾",
          title: "Zu Fuß",
          text:
            "Wanderer erreichen Anavatos über die lange markierte Route, die Lithi über Nea Moni und Avgonyma mit Agiasmata verbindet.",
        },
      ],
    },
    baseTip: {
      icon: "🗺️",
      title: "Ihre Basis in Kambos",
      text:
        "Vom Voulamandis House in Kambos ist Zentral-Chios etwa eine halbe Stunde entfernt – morgens Anavatos, nachmittags zurück im Garten.",
      linkLabel: "Wohnen Sie bei denen, die die Insel kennen.",
      href: "/de/chios-zimmer/",
    },
    relatedTitle: "Weitere Dörfer auf Chios entdecken",
    relatedText: "Entdecken Sie die mittelalterlichen Dörfer, die Mastixdörfer und die Küstendörfer von Chios.",
  },
  {
    slug: "villaggio-anavatos",
    seo: {
      canonicalPath: "/it/villaggi-chios/villaggio-anavatos/",
      title: "Anavatos Chios | Il «Mistrà dell’Egeo» abbandonato",
      description:
        "Scopri Anavatos, il villaggio medievale abbandonato su una rupe di 450 m nel centro di Chios: storia, cosa vedere, come arrivare e come abbinarlo ad Avgonyma e Nea Moni.",
      ogImage: IMAGE,
    },
    hero: {
      kicker: "Chios centrale • Roccaforte medievale",
      title: "Anavatos: il Mistrà dell’Egeo",
      description:
        "Un villaggio medievale abbandonato, costruito su una rupe a strapiombo tra due gole nel centro di Chios, con case in pietra, vicoli a volta e uno dei panorami più spettacolari dell’isola.",
      image: IMAGE,
      tags: ["#anavatos", "#chios_medievale", "#storia", "#fotografia"],
    },
    heroImageAlt: "Il villaggio medievale abbandonato di Anavatos sulla sua rupe, nel centro di Chios",
    answerText:
      "Anavatos è il luogo storico più impressionante dell’entroterra di Chios: un villaggio medievale fortificato aggrappato a una rupe di circa 450 m, abbandonato dopo il massacro del 1822 e il terremoto del 1881 e oggi tutelato come monumento storico. Dista circa 30 minuti in auto da Kambos e si abbina naturalmente ad Avgonyma e Nea Moni.",
    details: [
      {
        icon: "📍",
        title: "Posizione e accesso",
        text:
          "Anavatos si trova nel centro di Chios, a 16–20 km dalla città e a circa 30 minuti in auto da Kambos. Si parcheggia sotto il vecchio villaggio e si sale a piedi fino all’unica porta nelle mura.",
      },
      {
        icon: "🏰",
        title: "Un villaggio fatto per nascondersi",
        text:
          "La parte fortificata fu costruita durante il dominio genovese e cinta di mura contro i pirati. Le case salgono a gradoni sulla rupe, collegate da ripidi acciottolati, archi e passaggi coperti.",
      },
      {
        icon: "💡",
        title: "Consiglio locale",
        text:
          "Andateci al mattino o nel tardo pomeriggio: la salita è ripida, c’è poca ombra e la luce sulla pietra è molto più bella. Indossate scarpe adatte e portate acqua.",
      },
    ],
    highlights: {
      title: "Cosa vedere ad Anavatos",
      items: [
        "Il «Triorofo», edificio su tre livelli con frantoio, scuola e la chiesa della Vergine restaurata",
        "La chiesa del Taxiarca in cima alla rupe",
        "Vicoli a volta e case costruite nella roccia",
        "La vista sulle due gole e sulle montagne di Chios centrale",
      ],
    },
    experience: {
      title: "Perché Anavatos è importante",
      paragraphs: [
        "Anavatos è spesso chiamato il «Mistrà dell’Egeo». I suoi abitanti presero parte all’insurrezione del 1821 e il villaggio cadde durante il massacro del 1822; il Comune di Chios lo definisce «lo Zalongo di Chios», il suo ultimo baluardo di libertà. I sopravvissuti fuggirono fino a Syros, dove fondarono il quartiere di Anavatousika a Ermoupoli.",
        "Il villaggio fu ripopolato nel 1866 da 72 famiglie, ma il grande terremoto del 1881 svuotò per sempre l’abitato fortificato e la vita si spostò nel nuovo villaggio ai piedi della collina. Il castello fu dichiarato monumento storico nel 1962 e nel 2022 l’Eforato alle Antichità di Chios ha completato il restauro della chiesa della Vergine, la cui campana è tornata a suonare dopo decenni.",
      ],
    },
    guide: {
      kicker: "Organizza la visita",
      title: "A piedi per Anavatos",
      intro:
        "Anavatos è un monumento all’aperto, non un museo: affrontatelo come una breve passeggiata in montagna.",
      sections: [
        {
          title: "Il percorso nel villaggio",
          paragraphs: [
            "Dal parcheggio si sale verso l’unica porta nelle mura. Accanto si trova il «Triorofo», l’edificio su tre livelli che ospitava il frantoio, la scuola e una cisterna, con la chiesa della Vergine all’ultimo piano.",
            "Da lì i vicoli salgono a zigzag fino alla chiesa del Taxiarca, l’unico edificio visibile da lontano. L’Eforato ha sistemato i sentieri e posizionato delle panchine, ma i gradini restano irregolari e ripidi.",
          ],
        },
        {
          title: "Rispettare il monumento",
          paragraphs: [
            "L’intero abitato è un sito archeologico tutelato e molte case sono ruderi fragili. Restate sui vicoli sistemati, non salite sui muri e portate via i vostri rifiuti.",
          ],
        },
      ],
    },
    practical: {
      title: "Anavatos in breve",
      items: [
        { label: "Da Kambos", value: "Circa 30 minuti in auto" },
        { label: "Tempo necessario", value: "1–2 ore" },
        { label: "Momento migliore", value: "Mattino o tardo pomeriggio" },
        { label: "Terreno", value: "Acciottolati ripidi, non adatto a passeggini o mobilità ridotta" },
      ],
    },
    faq: {
      title: "Domande su Anavatos",
      items: [
        {
          question: "La salita ad Anavatos è difficile?",
          answer:
            "La salita è breve ma ripida, su gradini di pietra con pochissima ombra. Con scarpe adatte e acqua la maggior parte dei visitatori ce la fa; non è adatta a passeggini o a persone con gravi difficoltà motorie.",
        },
        {
          question: "Anavatos è abitato?",
          answer:
            "Il villaggio medievale fortificato è deserto dal terremoto del 1881. La vita continua nel villaggio più recente, ai piedi della collina.",
        },
        {
          question: "Con cosa abbinare Anavatos?",
          answer:
            "Anavatos, Avgonyma e il monastero di Nea Moni formano l’itinerario classico di Chios centrale. Molti chiudono la giornata ad Avgonyma con cena e tramonto, oppure proseguono verso le spiagge della costa occidentale.",
        },
      ],
    },
    routeIdeas: {
      title: "Come abbinare Anavatos",
      items: [
        {
          icon: "⛪",
          title: "Nea Moni, Anavatos, Avgonyma",
          text:
            "L’itinerario classico di Chios centrale: il monastero di Nea Moni, patrimonio UNESCO, poi Anavatos e infine cena e tramonto ad Avgonyma.",
        },
        {
          icon: "🏖️",
          title: "Anavatos e la costa ovest",
          text: "Anavatos al mattino, poi giù verso Elinta o Lithi per un bagno.",
          href: "/it/spiagge-chios/spiaggia-elinta/",
          linkLabel: "Spiaggia di Elinta",
        },
        {
          icon: "🥾",
          title: "A piedi",
          text:
            "Gli escursionisti possono raggiungere Anavatos lungo il lungo percorso segnalato che collega Lithi ad Agiasmata passando per Nea Moni e Avgonyma.",
        },
      ],
    },
    baseTip: {
      icon: "🗺️",
      title: "La tua base a Kambos",
      text:
        "Da Voulamandis House a Kambos, Chios centrale è a circa mezz’ora: Anavatos al mattino e di ritorno in giardino nel pomeriggio.",
      linkLabel: "Soggiorna con chi conosce l’isola.",
      href: "/it/camere-a-chios/",
    },
    relatedTitle: "Scopri altri villaggi di Chios",
    relatedText: "Continua con i villaggi medievali, i villaggi del mastice e i villaggi sul mare di Chios.",
  },
  {
    slug: "pueblo-anavatos",
    seo: {
      canonicalPath: "/es/pueblos-chios/pueblo-anavatos/",
      title: "Anavatos, Quíos | El «Mistrá del Egeo» abandonado",
      description:
        "Descubre Anavatos, el pueblo medieval abandonado sobre una roca de 450 m en el centro de Quíos: historia, qué ver, cómo llegar y cómo combinarlo con Avgonyma y Nea Moni.",
      ogImage: IMAGE,
    },
    hero: {
      kicker: "Centro de Quíos • Fortaleza medieval",
      title: "Anavatos: el Mistrá del Egeo",
      description:
        "Un pueblo medieval abandonado, construido sobre una roca escarpada entre dos gargantas en el centro de Quíos, con casas de piedra, callejones abovedados y una de las vistas más impactantes de la isla.",
      image: IMAGE,
      tags: ["#anavatos", "#quios_medieval", "#historia", "#fotografia"],
    },
    heroImageAlt: "El pueblo medieval abandonado de Anavatos sobre su roca, en el centro de Quíos",
    answerText:
      "Anavatos es el lugar histórico más impresionante del interior de Quíos: un pueblo medieval fortificado aferrado a una roca de unos 450 m, abandonado tras la masacre de 1822 y el terremoto de 1881 y hoy protegido como monumento histórico. Está a unos 30 minutos en coche de Kambos y se combina de forma natural con Avgonyma y Nea Moni.",
    details: [
      {
        icon: "📍",
        title: "Ubicación y acceso",
        text:
          "Anavatos está en el centro de Quíos, a 16–20 km de la ciudad y a unos 30 minutos en coche de Kambos. Se aparca bajo el pueblo viejo y se sube a pie hasta la única puerta de la muralla.",
      },
      {
        icon: "🏰",
        title: "Un pueblo hecho para esconderse",
        text:
          "La parte fortificada se construyó bajo el dominio genovés y se amuralló contra los piratas. Las casas suben escalonadas por la roca, unidas por empinados empedrados, arcos y pasajes cubiertos.",
      },
      {
        icon: "💡",
        title: "Consejo local",
        text:
          "Ve por la mañana o a última hora de la tarde: la subida es empinada, apenas hay sombra y la luz sobre la piedra es mucho más bonita. Lleva calzado adecuado y agua.",
      },
    ],
    highlights: {
      title: "Qué ver en Anavatos",
      items: [
        "El «Triorofo», edificio de tres niveles con almazara, escuela y la iglesia de la Virgen restaurada",
        "La iglesia del Taxiarca en lo alto de la roca",
        "Callejones abovedados y casas construidas en la roca",
        "Las vistas sobre las dos gargantas y las montañas del centro de Quíos",
      ],
    },
    experience: {
      title: "Por qué Anavatos es importante",
      paragraphs: [
        "A Anavatos se le llama a menudo el «Mistrá del Egeo». Sus habitantes participaron en el levantamiento de 1821 y el pueblo cayó durante la masacre de 1822; el Ayuntamiento de Quíos lo llama «el Zálongo de Quíos», su último bastión de libertad. Los supervivientes huyeron hasta Siros, donde fundaron el barrio de Anavatousika en Ermúpoli.",
        "El pueblo fue repoblado en 1866 por 72 familias, pero el gran terremoto de 1881 vació para siempre el recinto amurallado y la vida se trasladó al pueblo nuevo, al pie de la colina. El castillo fue declarado monumento histórico en 1962 y en 2022 el Eforato de Antigüedades de Quíos completó la restauración de la iglesia de la Virgen, cuya campana volvió a sonar tras décadas.",
      ],
    },
    guide: {
      kicker: "Planifica la visita",
      title: "Paseando por Anavatos",
      intro:
        "Anavatos es un monumento al aire libre, no un museo: tómatelo como una breve caminata de montaña.",
      sections: [
        {
          title: "El recorrido por el pueblo",
          paragraphs: [
            "Desde el aparcamiento se sube hacia la única puerta de la muralla. Junto a ella está el «Triorofo», el edificio de tres niveles que albergaba la almazara, la escuela y un aljibe, con la iglesia de la Virgen en la planta superior.",
            "Desde allí los callejones suben en zigzag hasta la iglesia del Taxiarca, el único edificio que se ve desde lejos. El Eforato ha mejorado los senderos y ha colocado bancos, pero los escalones siguen siendo irregulares y empinados.",
          ],
        },
        {
          title: "Respeta el monumento",
          paragraphs: [
            "Todo el pueblo es un yacimiento arqueológico protegido y muchas casas son ruinas frágiles. Quédate en los callejones acondicionados, no te subas a los muros y llévate tu basura.",
          ],
        },
      ],
    },
    practical: {
      title: "Anavatos de un vistazo",
      items: [
        { label: "Desde Kambos", value: "Unos 30 minutos en coche" },
        { label: "Tiempo necesario", value: "1–2 horas" },
        { label: "Mejor momento", value: "Por la mañana o a última hora de la tarde" },
        { label: "Terreno", value: "Empedrados empinados, no apto para carritos ni movilidad reducida" },
      ],
    },
    faq: {
      title: "Preguntas sobre Anavatos",
      items: [
        {
          question: "¿Es difícil la subida a Anavatos?",
          answer:
            "La subida es corta pero empinada, por escalones de piedra casi sin sombra. Con calzado adecuado y agua la mayoría de los visitantes la hace sin problema; no es apta para carritos ni para personas con movilidad muy reducida.",
        },
        {
          question: "¿Vive alguien en Anavatos?",
          answer:
            "El pueblo medieval amurallado está deshabitado desde el terremoto de 1881. La vida continúa en el pueblo más reciente, al pie de la colina.",
        },
        {
          question: "¿Con qué puedo combinar Anavatos?",
          answer:
            "Anavatos, Avgonyma y el monasterio de Nea Moni forman la ruta clásica del centro de Quíos. Muchos terminan el día en Avgonyma con cena y puesta de sol, o siguen hacia las playas de la costa oeste.",
        },
      ],
    },
    routeIdeas: {
      title: "Cómo combinar Anavatos",
      items: [
        {
          icon: "⛪",
          title: "Nea Moni, Anavatos, Avgonyma",
          text:
            "La ruta clásica del centro de Quíos: el monasterio de Nea Moni, Patrimonio de la UNESCO, luego Anavatos y, para terminar, cena y puesta de sol en Avgonyma.",
        },
        {
          icon: "🏖️",
          title: "Anavatos y la costa oeste",
          text: "Anavatos por la mañana y después bajada a Elinta o Lithi para darse un baño.",
          href: "/es/playas-chios/playa-elinta/",
          linkLabel: "Playa de Elinta",
        },
        {
          icon: "🥾",
          title: "A pie",
          text:
            "Los senderistas pueden llegar a Anavatos por la larga ruta señalizada que une Lithi con Agiasmata pasando por Nea Moni y Avgonyma.",
        },
      ],
    },
    baseTip: {
      icon: "🗺️",
      title: "Tu base en Kambos",
      text:
        "Desde Voulamandis House en Kambos, el centro de Quíos está a una media hora: Anavatos por la mañana y de vuelta en el jardín por la tarde.",
      linkLabel: "Alójate con quienes conocen la isla.",
      href: "/es/habitaciones-en-chios/",
    },
    relatedTitle: "Descubre más pueblos de Chios",
    relatedText: "Continúa con los pueblos medievales, los pueblos del mastiha y los pueblos costeros de Quíos.",
  },
  {
    slug: "anavatos-koyu",
    seo: {
      canonicalPath: "/tr/sakiz-adasi-koyleri/anavatos-koyu/",
      title: "Anavatos, Sakız Adası | Terk edilmiş «Ege’nin Mistrası»",
      description:
        "Sakız Adası’nın ortasında 450 m’lik bir kayanın üzerindeki terk edilmiş Orta Çağ köyü Anavatos: tarihi, görülecek yerler, ulaşım ve Avgonyma ile Nea Moni’yle birleştirme.",
      ogImage: IMAGE,
    },
    hero: {
      kicker: "Orta Sakız • Orta Çağ kalesi",
      title: "Anavatos: Ege’nin Mistrası",
      description:
        "Sakız Adası’nın ortasında, iki vadi arasındaki sarp bir kayanın üzerine kurulmuş terk edilmiş bir Orta Çağ köyü: taş evler, kemerli sokaklar ve adanın en etkileyici manzaralarından biri.",
      image: IMAGE,
      tags: ["#anavatos", "#orta_cag_sakiz", "#tarih", "#fotograf"],
    },
    heroImageAlt: "Orta Sakız’da kayasının üzerindeki terk edilmiş Orta Çağ köyü Anavatos",
    answerText:
      "Anavatos, Sakız Adası’nın iç kesimlerindeki en etkileyici tarihi yerdir: yaklaşık 450 m yüksekliğindeki bir kayaya tutunmuş, 1822 katliamı ve 1881 depreminden sonra terk edilmiş, bugün tarihi anıt olarak koruma altındaki surlu bir Orta Çağ köyü. Kambos’tan arabayla yaklaşık 30 dakika uzaklıktadır ve Avgonyma ile Nea Moni’yle doğal olarak birleşir.",
    details: [
      {
        icon: "📍",
        title: "Konum ve ulaşım",
        text:
          "Anavatos adanın ortasında, Sakız merkezine 16–20 km ve Kambos’a arabayla yaklaşık 30 dakika uzaklıktadır. Arabanızı eski köyün altına bırakıp surların tek kapısına kadar yürüyerek çıkarsınız.",
      },
      {
        icon: "🏰",
        title: "Saklanmak için kurulmuş bir köy",
        text:
          "Surlu bölüm Ceneviz yönetimi döneminde inşa edildi ve korsanlara karşı surlarla çevrildi. Evler kaya üzerinde basamak basamak yükselir; dik taş sokaklar, kemerler ve üstü kapalı geçitlerle birbirine bağlanır.",
      },
      {
        icon: "💡",
        title: "Yerel tavsiye",
        text:
          "Sabah ya da öğleden sonra geç saatte gidin: tırmanış diktir, gölge çok azdır ve taşın üzerindeki ışık çok daha güzeldir. Uygun ayakkabı giyin ve yanınıza su alın.",
      },
    ],
    highlights: {
      title: "Anavatos’ta görülecekler",
      items: [
        "Zeytinyağı değirmeni, okul ve restore edilmiş Meryem Ana kilisesini barındıran üç katlı «Triorofo»",
        "Kayanın tepesindeki Taksiarhis kilisesi",
        "Kemerli sokaklar ve kayaya oyulmuş evler",
        "İki vadi ve orta Sakız’ın dağları üzerindeki manzara",
      ],
    },
    experience: {
      title: "Anavatos neden önemli",
      paragraphs: [
        "Anavatos sık sık «Ege’nin Mistrası» olarak anılır. Köy halkı 1821 ayaklanmasına katıldı ve köy 1822 katliamında düştü; Sakız Belediyesi burayı «Sakız’ın Zalongo’su», özgürlüğünün son kalesi olarak tanımlar. Hayatta kalanlar Siros’a kadar kaçtı ve Ermoupoli’de Anavatousika mahallesini kurdu.",
        "Köy 1866’da 72 aile tarafından yeniden iskân edildi, ancak 1881’deki büyük deprem surlu yerleşimi tamamen boşalttı ve yaşam tepenin eteğindeki yeni köye taşındı. Kale 1962’de tarihi anıt ilan edildi; 2022’de Sakız Eski Eserler Eforluğu Meryem Ana kilisesinin restorasyonunu tamamladı ve kilisenin çanı on yıllar sonra yeniden çaldı.",
      ],
    },
    guide: {
      kicker: "Ziyaretinizi planlayın",
      title: "Anavatos’ta yürüyüş",
      intro:
        "Anavatos bir müze değil, açık hava anıtıdır; ziyaretinizi kısa bir dağ yürüyüşü gibi planlayın.",
      sections: [
        {
          title: "Köy içindeki rota",
          paragraphs: [
            "Otoparktan surların tek kapısına doğru çıkarsınız. Hemen yanında, zeytinyağı değirmeni, okul ve sarnıcı barındıran ve en üst katında Meryem Ana kilisesi bulunan üç katlı «Triorofo» yer alır.",
            "Oradan sokaklar zikzak çizerek, uzaktan görülebilen tek yapı olan Taksiarhis kilisesine kadar tırmanır. Eforluk patikaları iyileştirdi ve banklar yerleştirdi, ancak basamaklar hâlâ düzensiz ve diktir.",
          ],
        },
        {
          title: "Anıta saygı",
          paragraphs: [
            "Yerleşimin tamamı koruma altındaki bir arkeolojik alandır ve birçok ev kırılgan birer harabedir. Düzenlenmiş sokaklardan ayrılmayın, duvarlara tırmanmayın ve çöpünüzü yanınızda götürün.",
          ],
        },
      ],
    },
    practical: {
      title: "Bir bakışta Anavatos",
      items: [
        { label: "Kambos’tan", value: "Arabayla yaklaşık 30 dakika" },
        { label: "Gereken süre", value: "1–2 saat" },
        { label: "En iyi zaman", value: "Sabah ya da geç öğleden sonra" },
        { label: "Zemin", value: "Dik taş sokaklar; bebek arabası ve hareket kısıtlılığı için uygun değil" },
      ],
    },
    faq: {
      title: "Anavatos hakkında sorular",
      items: [
        {
          question: "Anavatos’a tırmanış zor mu?",
          answer:
            "Tırmanış kısa ama diktir; neredeyse hiç gölge olmayan taş basamaklardan çıkılır. Uygun ayakkabı ve suyla çoğu ziyaretçi rahatça çıkar; bebek arabası veya ciddi hareket kısıtlılığı olanlar için uygun değildir.",
        },
        {
          question: "Anavatos’ta yaşayan var mı?",
          answer:
            "Surlu Orta Çağ köyü 1881 depreminden beri boştur. Hayat, tepenin eteğindeki daha yeni köyde devam eder.",
        },
        {
          question: "Anavatos’u neyle birleştirebilirim?",
          answer:
            "Anavatos, Avgonyma ve Nea Moni manastırı orta Sakız’ın klasik rotasını oluşturur. Pek çok ziyaretçi günü Avgonyma’da akşam yemeği ve gün batımıyla bitirir ya da batı kıyısındaki plajlara devam eder.",
        },
      ],
    },
    routeIdeas: {
      title: "Anavatos’u nasıl birleştirebilirsiniz",
      items: [
        {
          icon: "⛪",
          title: "Nea Moni, Anavatos, Avgonyma",
          text:
            "Orta Sakız’ın klasik rotası: UNESCO listesindeki Nea Moni manastırı, ardından Anavatos ve son olarak Avgonyma’da akşam yemeği ve gün batımı.",
        },
        {
          icon: "🏖️",
          title: "Anavatos ve batı kıyısı",
          text: "Sabah Anavatos, ardından yüzmek için Elinta’ya ya da Lithi’ye inin.",
          href: "/tr/sakiz-adasi-plajlari/elinta-plaji/",
          linkLabel: "Elinta Plajı",
        },
        {
          icon: "🥾",
          title: "Yürüyerek",
          text:
            "Yürüyüşçüler Anavatos’a, Lithi’yi Nea Moni ve Avgonyma üzerinden Agiasmata’ya bağlayan uzun işaretli rotayla ulaşabilir.",
        },
      ],
    },
    baseTip: {
      icon: "🗺️",
      title: "Kambos’taki üssünüz",
      text:
        "Kambos’taki Voulamandis House’tan orta Sakız yaklaşık yarım saat uzaklıktadır: sabah Anavatos, öğleden sonra yeniden bahçede.",
      linkLabel: "Adayı en iyi bilenlerle konaklayın.",
      href: "/tr/sakiz-adasi-odalari/",
    },
    relatedTitle: "Sakız Adası’nın diğer köylerini keşfedin",
    relatedText: "Orta Çağ köyleri, mastik köyleri ve sahil köyleriyle devam edin.",
  },
];

// The template hides the "experience" block when a guide is present, so the
// history is also shown as the first guide section.
function withHistorySection(village: VillageDetailData): VillageDetailData {
  if (!village.guide) return village;
  return {
    ...village,
    guide: {
      ...village.guide,
      sections: [
        { title: village.experience.title, paragraphs: village.experience.paragraphs },
        ...village.guide.sections,
      ],
    },
  };
}

export const anavatosEn = withHistorySection(anavatosEnBase);
export const anavatosLocalized = anavatosLocalizedBase.map(withHistorySection);

export const anavatosRelatedCard = {
  slug: "anavatos-chios",
  title: "Anavatos",
  description: "An abandoned medieval village on a 450 m rock, the 'Mystras of the Aegean'.",
  href: "/chios/chios-villages/anavatos-chios/",
  image: IMAGE,
  imageAlt: "The abandoned medieval village of Anavatos in central Chios",
  badge: "Historic",
  size: "wide",
} as const;
