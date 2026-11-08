import type { VillageDetailData } from "@/content/village-details";

// Avgonyma (central-west Chios) in all 7 languages.
// Sources checked 2026-11-08: chios.gr (Municipality of Chios, villages of
// central Chios: stone cube houses, paved square, views, 6 km from Anavatos,
// ~10 min to Elinta), trekking.chios.gr (narrow windows against pirates, view
// to Psara, 2011 memorial), greeka.com (~15 km west of Chios Town, restored
// houses). Local dishes as listed by the official Chios travel guide (see
// content/trip-planner/villages.ts). Drive time from Kambos:
// content/trip-planner/village-routing.ts. No restaurant names, prices or hours.

export const AVGONYMA_IMAGE = "/images/villages/avgonyma-chios-hd.webp";
const IMAGE = AVGONYMA_IMAGE;

const avgonymaEnBase: VillageDetailData = {
  slug: "avgonyma-chios",
  seo: {
    canonicalPath: "/chios/chios-villages/avgonyma-chios/",
    title: "Avgonyma Chios | Medieval Hill Village & Sunset Views",
    description:
      "Plan a visit to Avgonyma, the medieval stone village on a hill in central Chios: what to see, the sunset over the Aegean, local food and how to combine it with Anavatos and Nea Moni.",
    ogImage: IMAGE,
  },
  hero: {
    kicker: "Central Chios • Medieval hill village",
    title: "Avgonyma: stone lanes and Aegean sunsets",
    description:
      "A medieval village of stone cube houses on a pine-covered hill, with a paved square, narrow lanes and wide views over the Aegean towards Psara.",
    image: IMAGE,
    tags: ["#avgonyma", "#medieval_chios", "#sunset", "#local_food"],
  },
  heroImageAlt: "Stone houses of the medieval village of Avgonyma in central Chios",
  answerText:
    "Avgonyma is a small medieval village on a hill in central Chios, about 30 minutes by car from Kambos. Its stone houses, paved square and sunset views over the Aegean make it the natural last stop after Nea Moni and Anavatos, ideally with dinner in the village.",
  details: [
    {
      icon: "📍",
      title: "Location & access",
      text:
        "Avgonyma lies about 15 km west of Chios Town and roughly 30 minutes by car from Kambos, only 6 km from Anavatos. You leave the car at the edge of the village and walk in; the lanes are for pedestrians.",
    },
    {
      icon: "🏘️",
      title: "Village character",
      text:
        "Square stone houses stand close together around narrow, winding lanes. Their small windows are a reminder that the village was built with pirate raids in mind. Many houses have been carefully restored.",
    },
    {
      icon: "💡",
      title: "Local tip",
      text:
        "Arrive in the late afternoon, walk the lanes while the light is soft and stay for sunset and dinner. On summer weekends it is wise to book a table.",
    },
  ],
  highlights: {
    title: "What to see in Avgonyma",
    items: [
      "The stone-paved central square",
      "Narrow medieval lanes and restored stone houses",
      "Sunset views over the Aegean and the island of Psara",
      "Traditional village food in the evening",
    ],
  },
  experience: {
    title: "Why visit Avgonyma",
    paragraphs: [
      "Avgonyma shows how the villages of central Chios protected themselves: a tight cluster of stone houses on a hilltop, with small windows and lanes that wind between them. Unlike nearby Anavatos, it is still lived in, and many houses have been restored with care.",
      "From the western edge of the village the view opens over pine forest to the Aegean and Psara, which is why many visitors plan their day around being here at sunset. A memorial outside the village, erected in 2011, honours the residents who died in the struggle for the liberation of Chios.",
    ],
  },
  guide: {
    kicker: "Plan your visit",
    title: "An evening in Avgonyma",
    intro: "Avgonyma is small: you can walk it in half an hour, but it is best enjoyed slowly.",
    sections: [
      {
        title: "Food in the village",
        paragraphs: [
          "Avgonyma is known as one of the food stops of central Chios. The official Chios travel guide mentions dishes such as handmade pasta, goat and the local spirit souma. Tavernas can be busy on summer evenings, so a reservation helps.",
        ],
      },
      {
        title: "Respect the village",
        paragraphs: [
          "People live here, so keep voices low in the lanes, do not enter courtyards and park outside the village.",
        ],
      },
    ],
  },
  practical: {
    title: "Avgonyma at a glance",
    items: [
      { label: "From Kambos", value: "About 30 minutes by car" },
      { label: "Time needed", value: "1 hour, or 2+ hours with dinner" },
      { label: "Best time", value: "Late afternoon to sunset" },
      { label: "Walking", value: "Short and gentle, on cobbled lanes" },
    ],
  },
  faq: {
    title: "Questions about Avgonyma",
    items: [
      {
        question: "How far is Avgonyma from Anavatos?",
        answer:
          "About 6 km. Most visitors see Anavatos first and end the day in Avgonyma for sunset and dinner.",
      },
      {
        question: "Is Avgonyma suitable for families?",
        answer:
          "Yes. The walk through the village is short and gentle, and the square is a relaxed place to stop. Lanes are cobbled, so strollers are not ideal.",
      },
      {
        question: "Which beach is close to Avgonyma?",
        answer: "Elinta, a sheltered bay with white pebbles on the west coast, is about 10 minutes away by car.",
      },
    ],
  },
  routeIdeas: {
    title: "How to combine Avgonyma",
    items: [
      {
        icon: "⛪",
        title: "Nea Moni, Anavatos, Avgonyma",
        text:
          "The classic route through central Chios: the UNESCO-listed Nea Moni monastery, then Anavatos, and sunset dinner in Avgonyma.",
        href: "/chios/chios-villages/anavatos-chios/",
        linkLabel: "Anavatos",
      },
      {
        icon: "🏖️",
        title: "Swim, then sunset",
        text: "Spend the afternoon at Elinta beach, then drive up to Avgonyma for the evening.",
        href: "/chios/chios-beaches/elinta-beach/",
        linkLabel: "Elinta beach",
      },
      {
        icon: "🥾",
        title: "On foot",
        text:
          "Avgonyma lies on the long marked hiking route that links Lithi with Agiasmata via Nea Moni and Anavatos.",
      },
    ],
  },
  baseTip: {
    icon: "🗺️",
    title: "Your base in Kambos",
    text:
      "From Voulamandis House in Kambos, Avgonyma is about half an hour away, an easy drive back after dinner.",
    linkLabel: "Stay with those who know best.",
    href: "/chios-rooms/",
  },
  relatedTitle: "Explore More Chios Villages",
  relatedText: "Continue with the medieval villages, mastic villages and seaside villages of Chios.",
};

const avgonymaLocalizedBase: VillageDetailData[] = [
  {
    slug: "avgonyma-xios",
    seo: {
      canonicalPath: "/el/xoria-xios/avgonyma-xios/",
      title: "Αυγώνυμα Χίου | Μεσαιωνικό χωριό & ηλιοβασίλεμα στο Αιγαίο",
      description:
        "Οργανώστε την επίσκεψή σας στα Αυγώνυμα, το πέτρινο μεσαιωνικό χωριό στον λόφο της κεντρικής Χίου: τι να δείτε, ηλιοβασίλεμα, τοπικό φαγητό και συνδυασμός με Ανάβατο και Νέα Μονή.",
      ogImage: IMAGE,
    },
    hero: {
      kicker: "Κεντρική Χίος • Μεσαιωνικό χωριό στον λόφο",
      title: "Αυγώνυμα: πέτρινα σοκάκια και ηλιοβασιλέματα",
      description:
        "Ένα μεσαιωνικό χωριό με κυβόσχημα πέτρινα σπίτια σε πευκόφυτο λόφο, με λιθόστρωτη πλατεία, στενά σοκάκια και ανοιχτή θέα στο Αιγαίο ως τα Ψαρά.",
      image: IMAGE,
      tags: ["#αυγώνυμα", "#μεσαιωνική_χίος", "#ηλιοβασίλεμα", "#τοπικό_φαγητό"],
    },
    heroImageAlt: "Πέτρινα σπίτια στο μεσαιωνικό χωριό Αυγώνυμα της κεντρικής Χίου",
    answerText:
      "Τα Αυγώνυμα είναι ένα μικρό μεσαιωνικό χωριό σε λόφο της κεντρικής Χίου, περίπου 30 λεπτά με το αυτοκίνητο από τον Κάμπο. Τα πέτρινα σπίτια, η λιθόστρωτη πλατεία και το ηλιοβασίλεμα πάνω από το Αιγαίο το κάνουν τον φυσικό τελευταίο σταθμό μετά τη Νέα Μονή και τον Ανάβατο, ιδανικά με φαγητό στο χωριό.",
    details: [
      {
        icon: "📍",
        title: "Τοποθεσία & πρόσβαση",
        text:
          "Τα Αυγώνυμα βρίσκονται περίπου 15 χλμ. δυτικά της πόλης της Χίου και περίπου 30 λεπτά με το αυτοκίνητο από τον Κάμπο, μόλις 6 χλμ. από τον Ανάβατο. Αφήνετε το αυτοκίνητο στην άκρη του χωριού· τα σοκάκια είναι για πεζούς.",
      },
      {
        icon: "🏘️",
        title: "Χαρακτήρας χωριού",
        text:
          "Τετράγωνα πέτρινα σπίτια χτισμένα το ένα δίπλα στο άλλο γύρω από στενά, φιδωτά σοκάκια. Τα μικρά παράθυρα θυμίζουν ότι το χωριό χτίστηκε με τον φόβο των πειρατών. Πολλά σπίτια έχουν αναπαλαιωθεί με φροντίδα.",
      },
      {
        icon: "💡",
        title: "Τοπική συμβουλή",
        text:
          "Ελάτε αργά το απόγευμα, περπατήστε στα σοκάκια με το απαλό φως και μείνετε για ηλιοβασίλεμα και φαγητό. Τα Σαββατοκύριακα του καλοκαιριού καλό είναι να κλείσετε τραπέζι.",
      },
    ],
    highlights: {
      title: "Τι να δείτε στα Αυγώνυμα",
      items: [
        "Τη λιθόστρωτη κεντρική πλατεία",
        "Τα στενά μεσαιωνικά σοκάκια και τα αναπαλαιωμένα πέτρινα σπίτια",
        "Το ηλιοβασίλεμα πάνω από το Αιγαίο και τα Ψαρά",
        "Το παραδοσιακό φαγητό του χωριού το βράδυ",
      ],
    },
    experience: {
      title: "Γιατί να επισκεφθείτε τα Αυγώνυμα",
      paragraphs: [
        "Τα Αυγώνυμα δείχνουν πώς προστατεύονταν τα χωριά της κεντρικής Χίου: ένα πυκνό σύνολο πέτρινων σπιτιών στην κορυφή του λόφου, με μικρά παράθυρα και σοκάκια που ελίσσονται ανάμεσά τους. Σε αντίθεση με τον γειτονικό Ανάβατο, εδώ το χωριό ζει, και πολλά σπίτια έχουν αναπαλαιωθεί με σεβασμό.",
        "Από τη δυτική άκρη του χωριού η θέα ανοίγει πάνω από το πευκοδάσος ως το Αιγαίο και τα Ψαρά, γι’ αυτό πολλοί οργανώνουν τη μέρα τους ώστε να βρίσκονται εδώ στο ηλιοβασίλεμα. Λίγο έξω από το χωριό, ένα μνημείο του 2011 τιμά τους κατοίκους των Αυγωνύμων που έπεσαν στον αγώνα για την απελευθέρωση της Χίου.",
      ],
    },
    guide: {
      kicker: "Οργανώστε την επίσκεψη",
      title: "Ένα βράδυ στα Αυγώνυμα",
      intro: "Τα Αυγώνυμα είναι μικρά· τα γυρίζετε σε μισή ώρα, αλλά αξίζει να τα απολαύσετε χωρίς βιασύνη.",
      sections: [
        {
          title: "Φαγητό στο χωριό",
          paragraphs: [
            "Τα Αυγώνυμα είναι γνωστός γαστρονομικός σταθμός της κεντρικής Χίου. Ο επίσημος τουριστικός οδηγός της Χίου αναφέρει πιάτα όπως χειροποίητα μακαρόνια, κατσικάκι και την τοπική σούμα. Τα καλοκαιρινά βράδια οι ταβέρνες γεμίζουν, οπότε η κράτηση βοηθά.",
          ],
        },
        {
          title: "Με σεβασμό στο χωριό",
          paragraphs: [
            "Στα Αυγώνυμα ζουν άνθρωποι· μιλήστε χαμηλόφωνα στα σοκάκια, μην μπαίνετε σε αυλές και παρκάρετε έξω από το χωριό.",
          ],
        },
      ],
    },
    practical: {
      title: "Τα Αυγώνυμα με μια ματιά",
      items: [
        { label: "Από τον Κάμπο", value: "Περίπου 30 λεπτά με το αυτοκίνητο" },
        { label: "Χρόνος επίσκεψης", value: "1 ώρα ή 2+ ώρες με φαγητό" },
        { label: "Καλύτερη ώρα", value: "Αργά το απόγευμα ως το ηλιοβασίλεμα" },
        { label: "Περπάτημα", value: "Σύντομο και ήπιο, σε καλντερίμια" },
      ],
    },
    faq: {
      title: "Ερωτήσεις για τα Αυγώνυμα",
      items: [
        {
          question: "Πόσο απέχουν τα Αυγώνυμα από τον Ανάβατο;",
          answer:
            "Περίπου 6 χλμ. Οι περισσότεροι επισκέπτονται πρώτα τον Ανάβατο και κλείνουν τη μέρα στα Αυγώνυμα με ηλιοβασίλεμα και φαγητό.",
        },
        {
          question: "Είναι τα Αυγώνυμα κατάλληλα για οικογένειες;",
          answer:
            "Ναι. Η βόλτα στο χωριό είναι σύντομη και ήπια και η πλατεία είναι ωραίο σημείο για στάση. Τα σοκάκια είναι λιθόστρωτα, οπότε το καρότσι δεν βολεύει.",
        },
        {
          question: "Ποια παραλία είναι κοντά στα Αυγώνυμα;",
          answer: "Η Ελίντα, ένας απάνεμος κόλπος με λευκά βότσαλα στη δυτική ακτή, περίπου 10 λεπτά με το αυτοκίνητο.",
        },
      ],
    },
    routeIdeas: {
      title: "Πώς να συνδυάσετε τα Αυγώνυμα",
      items: [
        {
          icon: "⛪",
          title: "Νέα Μονή, Ανάβατος, Αυγώνυμα",
          text:
            "Η κλασική διαδρομή της κεντρικής Χίου: η Νέα Μονή, μνημείο της UNESCO, μετά ο Ανάβατος και φαγητό με ηλιοβασίλεμα στα Αυγώνυμα.",
          href: "/el/xoria-xios/anavatos-xios/",
          linkLabel: "Ανάβατος",
        },
        {
          icon: "🏖️",
          title: "Μπάνιο και μετά ηλιοβασίλεμα",
          text: "Περάστε το απόγευμα στην Ελίντα και ανεβείτε στα Αυγώνυμα για το βράδυ.",
          href: "/el/paralies-xios/paralia-elinta/",
          linkLabel: "Παραλία Ελίντα",
        },
        {
          icon: "🥾",
          title: "Με τα πόδια",
          text:
            "Τα Αυγώνυμα βρίσκονται πάνω στη μεγάλη σηματοδοτημένη διαδρομή που ενώνει το Λιθί με τα Αγιάσματα, μέσω Νέας Μονής και Ανάβατου.",
        },
      ],
    },
    baseTip: {
      icon: "🗺️",
      title: "Η βάση σας στον Κάμπο",
      text:
        "Από το Voulamandis House στον Κάμπο τα Αυγώνυμα απέχουν περίπου μισή ώρα, εύκολη επιστροφή μετά το φαγητό.",
      linkLabel: "Μείνετε με αυτούς που ξέρουν το νησί.",
      href: "/el/domatia-xios/",
    },
    relatedTitle: "Ανακαλύψτε περισσότερα χωριά της Χίου",
    relatedText: "Συνεχίστε με τα μεσαιωνικά χωριά, τα Μαστιχοχώρια και τα παραθαλάσσια χωριά της Χίου.",
  },
  {
    slug: "village-avgonyma",
    seo: {
      canonicalPath: "/fr/villages-de-chios/village-avgonyma/",
      title: "Avgonyma Chios | Village médiéval & coucher de soleil sur l’Égée",
      description:
        "Préparez votre visite d’Avgonyma, village médiéval en pierre sur une colline du centre de Chios : que voir, coucher de soleil, cuisine locale et comment le combiner avec Anavatos et Nea Moni.",
      ogImage: IMAGE,
    },
    hero: {
      kicker: "Centre de Chios • Village médiéval perché",
      title: "Avgonyma : ruelles de pierre et couchers de soleil",
      description:
        "Un village médiéval aux maisons cubiques en pierre sur une colline couverte de pins, avec sa place pavée, ses ruelles étroites et une vue dégagée sur l’Égée jusqu’à Psara.",
      image: IMAGE,
      tags: ["#avgonyma", "#chios_medievale", "#coucher_de_soleil", "#cuisine_locale"],
    },
    heroImageAlt: "Maisons en pierre du village médiéval d’Avgonyma, au centre de Chios",
    answerText:
      "Avgonyma est un petit village médiéval perché sur une colline du centre de Chios, à environ 30 minutes en voiture de Kambos. Ses maisons de pierre, sa place pavée et ses couchers de soleil sur l’Égée en font l’étape finale naturelle après Nea Moni et Anavatos, idéalement avec un dîner sur place.",
    details: [
      {
        icon: "📍",
        title: "Situation & accès",
        text:
          "Avgonyma se trouve à environ 15 km à l’ouest de la ville de Chios et à une trentaine de minutes en voiture de Kambos, à seulement 6 km d’Anavatos. On laisse la voiture à l’entrée du village : les ruelles sont piétonnes.",
      },
      {
        icon: "🏘️",
        title: "Caractère du village",
        text:
          "Des maisons de pierre carrées serrées les unes contre les autres le long de ruelles étroites et sinueuses. Leurs petites fenêtres rappellent que le village a été bâti face à la menace des pirates. Beaucoup de maisons ont été restaurées avec soin.",
      },
      {
        icon: "💡",
        title: "Conseil local",
        text:
          "Arrivez en fin d’après-midi, flânez dans les ruelles à la lumière douce et restez pour le coucher du soleil et le dîner. Les week-ends d’été, mieux vaut réserver une table.",
      },
    ],
    highlights: {
      title: "À voir à Avgonyma",
      items: [
        "La place centrale pavée",
        "Les ruelles médiévales et les maisons de pierre restaurées",
        "Le coucher de soleil sur l’Égée et l’île de Psara",
        "La cuisine traditionnelle du village le soir",
      ],
    },
    experience: {
      title: "Pourquoi visiter Avgonyma",
      paragraphs: [
        "Avgonyma montre comment se protégeaient les villages du centre de Chios : un groupe serré de maisons de pierre au sommet d’une colline, avec de petites fenêtres et des ruelles qui serpentent entre elles. Contrairement à Anavatos tout proche, le village est habité et de nombreuses maisons ont été restaurées avec respect.",
        "Depuis la lisière ouest du village, la vue s’ouvre au-dessus de la pinède jusqu’à l’Égée et Psara : beaucoup organisent leur journée pour être ici au coucher du soleil. Un mémorial érigé en 2011 près du village honore les habitants morts dans la lutte pour la libération de Chios.",
      ],
    },
    guide: {
      kicker: "Préparer la visite",
      title: "Une soirée à Avgonyma",
      intro: "Avgonyma est petit : on en fait le tour en une demi-heure, mais il se savoure lentement.",
      sections: [
        {
          title: "Manger au village",
          paragraphs: [
            "Avgonyma est connu comme l’une des étapes gourmandes du centre de Chios. Le guide touristique officiel de Chios cite des plats comme les pâtes faites main, le chevreau et l’eau-de-vie locale, la souma. Les tavernes sont très demandées les soirs d’été : réserver aide.",
          ],
        },
        {
          title: "Respecter le village",
          paragraphs: [
            "Des gens vivent ici : parlez doucement dans les ruelles, n’entrez pas dans les cours et garez-vous à l’extérieur du village.",
          ],
        },
      ],
    },
    practical: {
      title: "Avgonyma en bref",
      items: [
        { label: "Depuis Kambos", value: "Environ 30 minutes en voiture" },
        { label: "Durée de visite", value: "1 heure, ou 2 heures et plus avec le dîner" },
        { label: "Meilleur moment", value: "De la fin d’après-midi au coucher du soleil" },
        { label: "Marche", value: "Courte et facile, sur des calades" },
      ],
    },
    faq: {
      title: "Questions sur Avgonyma",
      items: [
        {
          question: "Quelle distance entre Avgonyma et Anavatos ?",
          answer:
            "Environ 6 km. La plupart des visiteurs voient d’abord Anavatos puis terminent la journée à Avgonyma pour le coucher du soleil et le dîner.",
        },
        {
          question: "Avgonyma convient-il aux familles ?",
          answer:
            "Oui. La promenade dans le village est courte et facile, et la place est un endroit agréable pour faire une pause. Les ruelles sont pavées, ce qui n’est pas idéal pour les poussettes.",
        },
        {
          question: "Quelle plage est proche d’Avgonyma ?",
          answer: "Elinta, une baie abritée aux galets blancs sur la côte ouest, à environ 10 minutes en voiture.",
        },
      ],
    },
    routeIdeas: {
      title: "Comment combiner Avgonyma",
      items: [
        {
          icon: "⛪",
          title: "Nea Moni, Anavatos, Avgonyma",
          text:
            "L’itinéraire classique du centre de Chios : le monastère de Nea Moni, classé à l’UNESCO, puis Anavatos, et un dîner au coucher du soleil à Avgonyma.",
          href: "/fr/villages-de-chios/village-anavatos/",
          linkLabel: "Anavatos",
        },
        {
          icon: "🏖️",
          title: "Baignade, puis coucher de soleil",
          text: "Passez l’après-midi à Elinta, puis montez à Avgonyma pour la soirée.",
          href: "/fr/plages-de-chios/plage-elinta/",
          linkLabel: "Plage d’Elinta",
        },
        {
          icon: "🥾",
          title: "À pied",
          text:
            "Avgonyma se trouve sur le long itinéraire balisé qui relie Lithi à Agiasmata en passant par Nea Moni et Anavatos.",
        },
      ],
    },
    baseTip: {
      icon: "🗺️",
      title: "Votre base à Kambos",
      text:
        "Depuis Voulamandis House à Kambos, Avgonyma est à environ une demi-heure : un retour facile après le dîner.",
      linkLabel: "Séjournez chez ceux qui connaissent l’île.",
      href: "/fr/chambres-a-chios/",
    },
    relatedTitle: "Découvrez plus de villages de Chios",
    relatedText: "Continuez avec les villages médiévaux, les villages du mastic et les villages en bord de mer de Chios.",
  },
  {
    slug: "avgonyma-dorf",
    seo: {
      canonicalPath: "/de/doerfer-chios/avgonyma-dorf/",
      title: "Avgonyma auf Chios | Mittelalterliches Bergdorf & Sonnenuntergang",
      description:
        "Planen Sie Ihren Besuch in Avgonyma, dem mittelalterlichen Steindorf auf einem Hügel im Zentrum von Chios: Sehenswertes, Sonnenuntergang, lokale Küche und Kombination mit Anavatos und Nea Moni.",
      ogImage: IMAGE,
    },
    hero: {
      kicker: "Zentral-Chios • Mittelalterliches Bergdorf",
      title: "Avgonyma: Steingassen und Sonnenuntergänge",
      description:
        "Ein mittelalterliches Dorf mit würfelförmigen Steinhäusern auf einem kiefernbewachsenen Hügel, mit gepflastertem Platz, engen Gassen und weitem Blick über die Ägäis bis nach Psara.",
      image: IMAGE,
      tags: ["#avgonyma", "#mittelalterliches_chios", "#sonnenuntergang", "#lokale_kueche"],
    },
    heroImageAlt: "Steinhäuser im mittelalterlichen Dorf Avgonyma im Zentrum von Chios",
    answerText:
      "Avgonyma ist ein kleines mittelalterliches Dorf auf einem Hügel im Zentrum von Chios, etwa 30 Autominuten von Kambos entfernt. Steinhäuser, ein gepflasterter Platz und Sonnenuntergänge über der Ägäis machen es zum natürlichen letzten Halt nach Nea Moni und Anavatos – am besten mit einem Abendessen im Dorf.",
    details: [
      {
        icon: "📍",
        title: "Lage und Anfahrt",
        text:
          "Avgonyma liegt etwa 15 km westlich von Chios-Stadt und rund 30 Autominuten von Kambos entfernt, nur 6 km von Anavatos. Das Auto bleibt am Ortsrand, die Gassen sind Fußgängern vorbehalten.",
      },
      {
        icon: "🏘️",
        title: "Dorfcharakter",
        text:
          "Quadratische Steinhäuser stehen dicht an dicht entlang enger, gewundener Gassen. Die kleinen Fenster erinnern daran, dass das Dorf mit Blick auf Piratenüberfälle gebaut wurde. Viele Häuser wurden sorgfältig restauriert.",
      },
      {
        icon: "💡",
        title: "Lokaler Tipp",
        text:
          "Kommen Sie am späten Nachmittag, schlendern Sie im weichen Licht durch die Gassen und bleiben Sie zum Sonnenuntergang und Abendessen. An Sommerwochenenden empfiehlt sich eine Tischreservierung.",
      },
    ],
    highlights: {
      title: "Sehenswertes in Avgonyma",
      items: [
        "Der gepflasterte Dorfplatz",
        "Enge mittelalterliche Gassen und restaurierte Steinhäuser",
        "Sonnenuntergang über der Ägäis und der Insel Psara",
        "Traditionelle Dorfküche am Abend",
      ],
    },
    experience: {
      title: "Warum Avgonyma besuchen",
      paragraphs: [
        "Avgonyma zeigt, wie sich die Dörfer im Zentrum von Chios schützten: eine dichte Gruppe von Steinhäusern auf einem Hügel, mit kleinen Fenstern und Gassen, die sich dazwischen hindurchwinden. Anders als das nahe Anavatos ist das Dorf bewohnt, und viele Häuser wurden behutsam restauriert.",
        "Vom Westrand des Dorfes öffnet sich der Blick über den Kiefernwald bis zur Ägäis und nach Psara – deshalb planen viele ihren Tag so, dass sie zum Sonnenuntergang hier sind. Ein 2011 errichtetes Denkmal nahe dem Dorf ehrt die Bewohner, die im Kampf für die Befreiung von Chios fielen.",
      ],
    },
    guide: {
      kicker: "Besuch planen",
      title: "Ein Abend in Avgonyma",
      intro: "Avgonyma ist klein: In einer halben Stunde haben Sie es durchstreift, doch es lohnt sich, Zeit mitzubringen.",
      sections: [
        {
          title: "Essen im Dorf",
          paragraphs: [
            "Avgonyma gilt als einer der kulinarischen Stopps im Zentrum von Chios. Der offizielle Reiseführer von Chios nennt Gerichte wie handgemachte Pasta, Zicklein und den lokalen Brand Souma. An Sommerabenden sind die Tavernen gefragt, eine Reservierung hilft.",
          ],
        },
        {
          title: "Rücksicht auf das Dorf",
          paragraphs: [
            "Hier wohnen Menschen: Sprechen Sie in den Gassen leise, betreten Sie keine Höfe und parken Sie außerhalb des Dorfes.",
          ],
        },
      ],
    },
    practical: {
      title: "Avgonyma auf einen Blick",
      items: [
        { label: "Ab Kambos", value: "Etwa 30 Minuten mit dem Auto" },
        { label: "Zeitbedarf", value: "1 Stunde, mit Abendessen 2+ Stunden" },
        { label: "Beste Zeit", value: "Später Nachmittag bis Sonnenuntergang" },
        { label: "Gehen", value: "Kurz und leicht, auf Pflastergassen" },
      ],
    },
    faq: {
      title: "Fragen zu Avgonyma",
      items: [
        {
          question: "Wie weit ist Avgonyma von Anavatos entfernt?",
          answer:
            "Etwa 6 km. Die meisten Besucher sehen zuerst Anavatos und beenden den Tag in Avgonyma mit Sonnenuntergang und Abendessen.",
        },
        {
          question: "Ist Avgonyma für Familien geeignet?",
          answer:
            "Ja. Der Rundgang durch das Dorf ist kurz und leicht, und der Platz lädt zu einer Pause ein. Die Gassen sind gepflastert, für Kinderwagen also nicht ideal.",
        },
        {
          question: "Welcher Strand liegt in der Nähe von Avgonyma?",
          answer: "Elinta, eine geschützte Bucht mit weißen Kieseln an der Westküste, etwa 10 Autominuten entfernt.",
        },
      ],
    },
    routeIdeas: {
      title: "Avgonyma mit anderen Zielen verbinden",
      items: [
        {
          icon: "⛪",
          title: "Nea Moni, Anavatos, Avgonyma",
          text:
            "Die klassische Route durch Zentral-Chios: das UNESCO-Kloster Nea Moni, dann Anavatos und zum Sonnenuntergang Abendessen in Avgonyma.",
          href: "/de/doerfer-chios/anavatos-dorf/",
          linkLabel: "Anavatos",
        },
        {
          icon: "🏖️",
          title: "Baden, dann Sonnenuntergang",
          text: "Verbringen Sie den Nachmittag am Strand von Elinta und fahren Sie abends hinauf nach Avgonyma.",
          href: "/de/straende-chios/elinta-strand/",
          linkLabel: "Elinta Strand",
        },
        {
          icon: "🥾",
          title: "Zu Fuß",
          text:
            "Avgonyma liegt an der langen markierten Route, die Lithi über Nea Moni und Anavatos mit Agiasmata verbindet.",
        },
      ],
    },
    baseTip: {
      icon: "🗺️",
      title: "Ihre Basis in Kambos",
      text:
        "Vom Voulamandis House in Kambos ist Avgonyma etwa eine halbe Stunde entfernt – eine bequeme Rückfahrt nach dem Abendessen.",
      linkLabel: "Wohnen Sie bei denen, die die Insel kennen.",
      href: "/de/chios-zimmer/",
    },
    relatedTitle: "Weitere Dörfer auf Chios entdecken",
    relatedText: "Entdecken Sie die mittelalterlichen Dörfer, die Mastixdörfer und die Küstendörfer von Chios.",
  },
  {
    slug: "villaggio-avgonyma",
    seo: {
      canonicalPath: "/it/villaggi-chios/villaggio-avgonyma/",
      title: "Avgonyma Chios | Borgo medievale e tramonto sull’Egeo",
      description:
        "Organizza la visita ad Avgonyma, il borgo medievale in pietra su una collina nel centro di Chios: cosa vedere, tramonto, cucina locale e come abbinarlo ad Anavatos e Nea Moni.",
      ogImage: IMAGE,
    },
    hero: {
      kicker: "Chios centrale • Borgo medievale in collina",
      title: "Avgonyma: vicoli di pietra e tramonti sull’Egeo",
      description:
        "Un borgo medievale di case cubiche in pietra su una collina coperta di pini, con una piazza lastricata, vicoli stretti e un’ampia vista sull’Egeo fino a Psara.",
      image: IMAGE,
      tags: ["#avgonyma", "#chios_medievale", "#tramonto", "#cucina_locale"],
    },
    heroImageAlt: "Case in pietra del borgo medievale di Avgonyma, nel centro di Chios",
    answerText:
      "Avgonyma è un piccolo borgo medievale su una collina nel centro di Chios, a circa 30 minuti in auto da Kambos. Case in pietra, una piazza lastricata e tramonti sull’Egeo ne fanno la tappa finale naturale dopo Nea Moni e Anavatos, idealmente con cena in paese.",
    details: [
      {
        icon: "📍",
        title: "Posizione e accesso",
        text:
          "Avgonyma si trova a circa 15 km a ovest della città di Chios e a una trentina di minuti in auto da Kambos, a soli 6 km da Anavatos. L’auto si lascia ai margini del paese: i vicoli sono pedonali.",
      },
      {
        icon: "🏘️",
        title: "Carattere del villaggio",
        text:
          "Case quadrate in pietra si stringono lungo vicoli stretti e tortuosi. Le piccole finestre ricordano che il paese fu costruito pensando alle incursioni dei pirati. Molte case sono state restaurate con cura.",
      },
      {
        icon: "💡",
        title: "Consiglio locale",
        text:
          "Arrivate nel tardo pomeriggio, passeggiate nei vicoli con la luce morbida e fermatevi per il tramonto e la cena. Nei fine settimana estivi conviene prenotare un tavolo.",
      },
    ],
    highlights: {
      title: "Cosa vedere ad Avgonyma",
      items: [
        "La piazza centrale lastricata",
        "Vicoli medievali e case in pietra restaurate",
        "Il tramonto sull’Egeo e sull’isola di Psara",
        "La cucina tradizionale del paese la sera",
      ],
    },
    experience: {
      title: "Perché visitare Avgonyma",
      paragraphs: [
        "Avgonyma mostra come si difendevano i villaggi di Chios centrale: un gruppo compatto di case in pietra in cima a una collina, con piccole finestre e vicoli che si snodano tra di esse. A differenza della vicina Anavatos, il paese è abitato e molte case sono state restaurate con rispetto.",
        "Dal margine occidentale del paese la vista si apre sopra la pineta fino all’Egeo e a Psara: per questo molti organizzano la giornata per essere qui al tramonto. Un monumento eretto nel 2011 vicino al paese onora gli abitanti caduti nella lotta per la liberazione di Chios.",
      ],
    },
    guide: {
      kicker: "Organizza la visita",
      title: "Una sera ad Avgonyma",
      intro: "Avgonyma è piccolo: lo si gira in mezz’ora, ma va gustato con calma.",
      sections: [
        {
          title: "Mangiare in paese",
          paragraphs: [
            "Avgonyma è nota come una delle tappe gastronomiche di Chios centrale. La guida turistica ufficiale di Chios cita piatti come la pasta fatta a mano, il capretto e il distillato locale souma. Le sere d’estate le taverne sono molto richieste: prenotare aiuta.",
          ],
        },
        {
          title: "Rispettare il paese",
          paragraphs: [
            "Qui vivono delle persone: parlate a bassa voce nei vicoli, non entrate nei cortili e parcheggiate fuori dal paese.",
          ],
        },
      ],
    },
    practical: {
      title: "Avgonyma in breve",
      items: [
        { label: "Da Kambos", value: "Circa 30 minuti in auto" },
        { label: "Tempo necessario", value: "1 ora, o 2+ ore con la cena" },
        { label: "Momento migliore", value: "Dal tardo pomeriggio al tramonto" },
        { label: "Camminata", value: "Breve e facile, su acciottolato" },
      ],
    },
    faq: {
      title: "Domande su Avgonyma",
      items: [
        {
          question: "Quanto dista Avgonyma da Anavatos?",
          answer:
            "Circa 6 km. La maggior parte dei visitatori vede prima Anavatos e chiude la giornata ad Avgonyma con tramonto e cena.",
        },
        {
          question: "Avgonyma è adatta alle famiglie?",
          answer:
            "Sì. La passeggiata nel paese è breve e facile e la piazza è un bel posto per una sosta. I vicoli sono acciottolati, quindi il passeggino non è l’ideale.",
        },
        {
          question: "Quale spiaggia è vicina ad Avgonyma?",
          answer: "Elinta, una baia riparata con ciottoli bianchi sulla costa occidentale, a circa 10 minuti in auto.",
        },
      ],
    },
    routeIdeas: {
      title: "Come abbinare Avgonyma",
      items: [
        {
          icon: "⛪",
          title: "Nea Moni, Anavatos, Avgonyma",
          text:
            "L’itinerario classico di Chios centrale: il monastero di Nea Moni, patrimonio UNESCO, poi Anavatos e cena al tramonto ad Avgonyma.",
          href: "/it/villaggi-chios/villaggio-anavatos/",
          linkLabel: "Anavatos",
        },
        {
          icon: "🏖️",
          title: "Bagno, poi tramonto",
          text: "Trascorrete il pomeriggio a Elinta e salite ad Avgonyma per la sera.",
          href: "/it/spiagge-chios/spiaggia-elinta/",
          linkLabel: "Spiaggia di Elinta",
        },
        {
          icon: "🥾",
          title: "A piedi",
          text:
            "Avgonyma si trova sul lungo percorso segnalato che collega Lithi ad Agiasmata passando per Nea Moni e Anavatos.",
        },
      ],
    },
    baseTip: {
      icon: "🗺️",
      title: "La tua base a Kambos",
      text:
        "Da Voulamandis House a Kambos, Avgonyma è a circa mezz’ora: un rientro comodo dopo cena.",
      linkLabel: "Soggiorna con chi conosce l’isola.",
      href: "/it/camere-a-chios/",
    },
    relatedTitle: "Scopri altri villaggi di Chios",
    relatedText: "Continua con i villaggi medievali, i villaggi del mastice e i villaggi sul mare di Chios.",
  },
  {
    slug: "pueblo-avgonyma",
    seo: {
      canonicalPath: "/es/pueblos-chios/pueblo-avgonyma/",
      title: "Avgonyma, Quíos | Pueblo medieval y atardecer sobre el Egeo",
      description:
        "Planifica tu visita a Avgonyma, el pueblo medieval de piedra en una colina del centro de Quíos: qué ver, atardecer, comida local y cómo combinarlo con Anavatos y Nea Moni.",
      ogImage: IMAGE,
    },
    hero: {
      kicker: "Centro de Quíos • Pueblo medieval en la colina",
      title: "Avgonyma: callejones de piedra y atardeceres",
      description:
        "Un pueblo medieval de casas cúbicas de piedra sobre una colina cubierta de pinos, con una plaza empedrada, callejones estrechos y amplias vistas al Egeo hasta Psara.",
      image: IMAGE,
      tags: ["#avgonyma", "#quios_medieval", "#atardecer", "#comida_local"],
    },
    heroImageAlt: "Casas de piedra del pueblo medieval de Avgonyma, en el centro de Quíos",
    answerText:
      "Avgonyma es un pequeño pueblo medieval en una colina del centro de Quíos, a unos 30 minutos en coche de Kambos. Sus casas de piedra, su plaza empedrada y los atardeceres sobre el Egeo lo convierten en la última parada natural después de Nea Moni y Anavatos, idealmente con cena en el pueblo.",
    details: [
      {
        icon: "📍",
        title: "Ubicación y acceso",
        text:
          "Avgonyma está a unos 15 km al oeste de la ciudad de Quíos y a una media hora en coche de Kambos, a solo 6 km de Anavatos. El coche se deja a la entrada del pueblo: los callejones son peatonales.",
      },
      {
        icon: "🏘️",
        title: "Carácter del pueblo",
        text:
          "Casas cuadradas de piedra se apiñan a lo largo de callejones estrechos y sinuosos. Sus pequeñas ventanas recuerdan que el pueblo se construyó pensando en los ataques piratas. Muchas casas se han restaurado con cuidado.",
      },
      {
        icon: "💡",
        title: "Consejo local",
        text:
          "Llega a última hora de la tarde, pasea por los callejones con la luz suave y quédate para el atardecer y la cena. Los fines de semana de verano conviene reservar mesa.",
      },
    ],
    highlights: {
      title: "Qué ver en Avgonyma",
      items: [
        "La plaza central empedrada",
        "Callejones medievales y casas de piedra restauradas",
        "El atardecer sobre el Egeo y la isla de Psara",
        "La cocina tradicional del pueblo por la noche",
      ],
    },
    experience: {
      title: "Por qué visitar Avgonyma",
      paragraphs: [
        "Avgonyma muestra cómo se protegían los pueblos del centro de Quíos: un grupo compacto de casas de piedra en lo alto de una colina, con ventanas pequeñas y callejones que serpentean entre ellas. A diferencia de la cercana Anavatos, el pueblo está habitado y muchas casas se han restaurado con respeto.",
        "Desde el borde oeste del pueblo la vista se abre sobre el pinar hasta el Egeo y Psara, por eso muchos organizan el día para estar aquí al atardecer. Un monumento erigido en 2011 cerca del pueblo honra a los vecinos caídos en la lucha por la liberación de Quíos.",
      ],
    },
    guide: {
      kicker: "Planifica la visita",
      title: "Una tarde en Avgonyma",
      intro: "Avgonyma es pequeño: se recorre en media hora, pero merece la pena disfrutarlo sin prisa.",
      sections: [
        {
          title: "Comer en el pueblo",
          paragraphs: [
            "Avgonyma es conocido como una de las paradas gastronómicas del centro de Quíos. La guía turística oficial de Quíos menciona platos como la pasta hecha a mano, el cabrito y el aguardiente local, la souma. Las noches de verano las tabernas se llenan, así que reservar ayuda.",
          ],
        },
        {
          title: "Respeta el pueblo",
          paragraphs: [
            "Aquí vive gente: habla en voz baja en los callejones, no entres en los patios y aparca fuera del pueblo.",
          ],
        },
      ],
    },
    practical: {
      title: "Avgonyma de un vistazo",
      items: [
        { label: "Desde Kambos", value: "Unos 30 minutos en coche" },
        { label: "Tiempo necesario", value: "1 hora, o 2+ horas con cena" },
        { label: "Mejor momento", value: "De última hora de la tarde al atardecer" },
        { label: "Caminar", value: "Corto y fácil, sobre empedrado" },
      ],
    },
    faq: {
      title: "Preguntas sobre Avgonyma",
      items: [
        {
          question: "¿Qué distancia hay entre Avgonyma y Anavatos?",
          answer:
            "Unos 6 km. La mayoría de los visitantes ve primero Anavatos y termina el día en Avgonyma con atardecer y cena.",
        },
        {
          question: "¿Es Avgonyma adecuado para familias?",
          answer:
            "Sí. El paseo por el pueblo es corto y fácil, y la plaza es un buen lugar para parar. Los callejones son empedrados, así que el carrito no es lo ideal.",
        },
        {
          question: "¿Qué playa está cerca de Avgonyma?",
          answer: "Elinta, una bahía resguardada de guijarros blancos en la costa oeste, a unos 10 minutos en coche.",
        },
      ],
    },
    routeIdeas: {
      title: "Cómo combinar Avgonyma",
      items: [
        {
          icon: "⛪",
          title: "Nea Moni, Anavatos, Avgonyma",
          text:
            "La ruta clásica del centro de Quíos: el monasterio de Nea Moni, Patrimonio de la UNESCO, luego Anavatos y cena al atardecer en Avgonyma.",
          href: "/es/pueblos-chios/pueblo-anavatos/",
          linkLabel: "Anavatos",
        },
        {
          icon: "🏖️",
          title: "Baño y después atardecer",
          text: "Pasa la tarde en la playa de Elinta y sube a Avgonyma para la noche.",
          href: "/es/playas-chios/playa-elinta/",
          linkLabel: "Playa de Elinta",
        },
        {
          icon: "🥾",
          title: "A pie",
          text:
            "Avgonyma está en la larga ruta señalizada que une Lithi con Agiasmata pasando por Nea Moni y Anavatos.",
        },
      ],
    },
    baseTip: {
      icon: "🗺️",
      title: "Tu base en Kambos",
      text:
        "Desde Voulamandis House en Kambos, Avgonyma está a una media hora: una vuelta cómoda después de cenar.",
      linkLabel: "Alójate con quienes conocen la isla.",
      href: "/es/habitaciones-en-chios/",
    },
    relatedTitle: "Descubre más pueblos de Chios",
    relatedText: "Continúa con los pueblos medievales, los pueblos del mastiha y los pueblos costeros de Quíos.",
  },
  {
    slug: "avgonyma-koyu",
    seo: {
      canonicalPath: "/tr/sakiz-adasi-koyleri/avgonyma-koyu/",
      title: "Avgonyma, Sakız Adası | Orta Çağ tepe köyü ve gün batımı",
      description:
        "Orta Sakız’da bir tepenin üzerindeki taş Orta Çağ köyü Avgonyma’yı ziyaretinizi planlayın: görülecek yerler, gün batımı, yerel yemekler ve Anavatos ile Nea Moni’yle birleştirme.",
      ogImage: IMAGE,
    },
    hero: {
      kicker: "Orta Sakız • Tepedeki Orta Çağ köyü",
      title: "Avgonyma: taş sokaklar ve Ege’de gün batımı",
      description:
        "Çam ormanlarıyla kaplı bir tepede küp biçimli taş evlerden oluşan Orta Çağ köyü: taş döşeli meydan, dar sokaklar ve Psara’ya kadar uzanan geniş Ege manzarası.",
      image: IMAGE,
      tags: ["#avgonyma", "#orta_cag_sakiz", "#gun_batimi", "#yerel_yemek"],
    },
    heroImageAlt: "Orta Sakız’daki Orta Çağ köyü Avgonyma’nın taş evleri",
    answerText:
      "Avgonyma, orta Sakız’da bir tepenin üzerinde, Kambos’a arabayla yaklaşık 30 dakika uzaklıkta küçük bir Orta Çağ köyüdür. Taş evleri, taş döşeli meydanı ve Ege üzerindeki gün batımıyla Nea Moni ve Anavatos’tan sonra doğal son duraktır; en güzeli köyde akşam yemeğiyle.",
    details: [
      {
        icon: "📍",
        title: "Konum ve ulaşım",
        text:
          "Avgonyma, Sakız merkezinin yaklaşık 15 km batısında, Kambos’a arabayla yaklaşık 30 dakika ve Anavatos’a yalnızca 6 km uzaklıktadır. Araba köyün girişinde bırakılır; sokaklar yayalara aittir.",
      },
      {
        icon: "🏘️",
        title: "Köyün karakteri",
        text:
          "Kare taş evler dar ve kıvrımlı sokaklar boyunca birbirine yaslanır. Küçük pencereler, köyün korsan baskınları düşünülerek inşa edildiğini hatırlatır. Pek çok ev özenle restore edilmiştir.",
      },
      {
        icon: "💡",
        title: "Yerel tavsiye",
        text:
          "Öğleden sonra geç saatte gelin, yumuşak ışıkta sokaklarda dolaşın ve gün batımı ile akşam yemeği için kalın. Yaz hafta sonlarında masa ayırtmak iyi olur.",
      },
    ],
    highlights: {
      title: "Avgonyma’da görülecekler",
      items: [
        "Taş döşeli köy meydanı",
        "Dar Orta Çağ sokakları ve restore edilmiş taş evler",
        "Ege ve Psara adası üzerinde gün batımı",
        "Akşamları köyün geleneksel mutfağı",
      ],
    },
    experience: {
      title: "Avgonyma neden görülmeli",
      paragraphs: [
        "Avgonyma, orta Sakız köylerinin kendilerini nasıl koruduğunu gösterir: tepenin üzerinde sık dizilmiş taş evler, küçük pencereler ve aralarından kıvrılan sokaklar. Yakındaki Anavatos’un aksine köyde hâlâ yaşam var ve birçok ev saygıyla restore edilmiş.",
        "Köyün batı ucundan manzara çam ormanının üzerinden Ege’ye ve Psara’ya açılır; bu yüzden pek çok ziyaretçi gününü gün batımında burada olacak şekilde planlar. Köyün yakınında 2011’de dikilen bir anıt, Sakız’ın kurtuluş mücadelesinde hayatını kaybeden köy halkını anar.",
      ],
    },
    guide: {
      kicker: "Ziyaretinizi planlayın",
      title: "Avgonyma’da bir akşam",
      intro: "Avgonyma küçüktür: yarım saatte dolaşılır, ama acele etmeden tadını çıkarmaya değer.",
      sections: [
        {
          title: "Köyde yemek",
          paragraphs: [
            "Avgonyma, orta Sakız’ın lezzet duraklarından biri olarak bilinir. Sakız’ın resmi turizm rehberi el yapımı makarna, oğlak eti ve yerel içki souma gibi lezzetlerden söz eder. Yaz akşamları tavernalar dolar, rezervasyon işinizi kolaylaştırır.",
          ],
        },
        {
          title: "Köye saygı",
          paragraphs: [
            "Burada insanlar yaşıyor: sokaklarda alçak sesle konuşun, avlulara girmeyin ve aracınızı köyün dışına park edin.",
          ],
        },
      ],
    },
    practical: {
      title: "Bir bakışta Avgonyma",
      items: [
        { label: "Kambos’tan", value: "Arabayla yaklaşık 30 dakika" },
        { label: "Gereken süre", value: "1 saat, yemekle 2+ saat" },
        { label: "En iyi zaman", value: "Geç öğleden sonradan gün batımına" },
        { label: "Yürüyüş", value: "Kısa ve kolay, taş döşeli sokaklarda" },
      ],
    },
    faq: {
      title: "Avgonyma hakkında sorular",
      items: [
        {
          question: "Avgonyma, Anavatos’a ne kadar uzak?",
          answer:
            "Yaklaşık 6 km. Ziyaretçilerin çoğu önce Anavatos’u görür ve günü Avgonyma’da gün batımı ve akşam yemeğiyle bitirir.",
        },
        {
          question: "Avgonyma aileler için uygun mu?",
          answer:
            "Evet. Köy içindeki yürüyüş kısa ve kolaydır, meydan mola için güzel bir yerdir. Sokaklar taş döşeli olduğundan bebek arabası için ideal değildir.",
        },
        {
          question: "Avgonyma’ya hangi plaj yakın?",
          answer: "Batı kıyısında beyaz çakıllı, korunaklı bir koy olan Elinta, arabayla yaklaşık 10 dakika uzaklıktadır.",
        },
      ],
    },
    routeIdeas: {
      title: "Avgonyma’yı nasıl birleştirebilirsiniz",
      items: [
        {
          icon: "⛪",
          title: "Nea Moni, Anavatos, Avgonyma",
          text:
            "Orta Sakız’ın klasik rotası: UNESCO listesindeki Nea Moni manastırı, ardından Anavatos ve Avgonyma’da gün batımında akşam yemeği.",
          href: "/tr/sakiz-adasi-koyleri/anavatos-koyu/",
          linkLabel: "Anavatos",
        },
        {
          icon: "🏖️",
          title: "Önce deniz, sonra gün batımı",
          text: "Öğleden sonrayı Elinta’da geçirin, akşam için Avgonyma’ya çıkın.",
          href: "/tr/sakiz-adasi-plajlari/elinta-plaji/",
          linkLabel: "Elinta Plajı",
        },
        {
          icon: "🥾",
          title: "Yürüyerek",
          text:
            "Avgonyma, Lithi’yi Nea Moni ve Anavatos üzerinden Agiasmata’ya bağlayan uzun işaretli yürüyüş rotası üzerindedir.",
        },
      ],
    },
    baseTip: {
      icon: "🗺️",
      title: "Kambos’taki üssünüz",
      text:
        "Kambos’taki Voulamandis House’tan Avgonyma yaklaşık yarım saat uzaklıktadır; akşam yemeğinden sonra dönüş kolaydır.",
      linkLabel: "Adayı en iyi bilenlerle konaklayın.",
      href: "/tr/sakiz-adasi-odalari/",
    },
    relatedTitle: "Sakız Adası’nın diğer köylerini keşfedin",
    relatedText: "Orta Çağ köyleri, mastik köyleri ve sahil köyleriyle devam edin.",
  },
];

// The template hides the "experience" block when a guide is present, so the
// village story is also shown as the first guide section.
function withStorySection(village: VillageDetailData): VillageDetailData {
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

export const avgonymaEn = withStorySection(avgonymaEnBase);
export const avgonymaLocalized = avgonymaLocalizedBase.map(withStorySection);

export const avgonymaRelatedCard = {
  slug: "avgonyma-chios",
  title: "Avgonyma",
  description: "A medieval stone village on a hill, with a paved square and Aegean sunsets.",
  href: "/chios/chios-villages/avgonyma-chios/",
  image: IMAGE,
  imageAlt: "Stone houses of Avgonyma in central Chios",
  badge: "Sunset",
  size: "normal",
} as const;
