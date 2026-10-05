import type { VillageDetailData } from "@/content/village-details";

/**
 * Full visitor-guide content for Mesta in every non-Greek language.
 * Mirrors the Greek page (/el/xoria-xios/mesta-xios/): quick answer,
 * access/parking/time cards, guide sections, route ideas, mid-page stay
 * block, distances table and FAQ.
 *
 * Applied at lookup time (see village-details.ts) so it takes precedence
 * over older per-language correction modules that mutate village data.
 */
type MestaOverlay = Pick<
  VillageDetailData,
  | "answerTitle"
  | "answerText"
  | "specialTitle"
  | "heroImageAlt"
  | "details"
  | "highlights"
  | "guide"
  | "practical"
  | "routeIdeas"
  | "faq"
  | "baseTip"
> & { heroDescription: string };

const en: MestaOverlay = {
  heroDescription:
    "The best-preserved medieval mastic village of southern Chios, about 35 km from Chios Town: stone alleys, arches and the Taxiarchis square.",
  heroImageAlt: "Stone alley with arches in the medieval village of Mesta, Chios",
  answerTitle: "Why visit Mesta in Chios?",
  answerText:
    "Because it is the most intact fortified village on Chios: the outer houses form a wall, the alleys are a maze and no cars enter. Plan 1.5–2 hours and combine it easily with Olympoi and Pyrgi.",
  details: [
    {
      icon: "📍",
      title: "Location & access",
      text: "Mesta lies in south-west Chios, about 35 km from Chios Town. From Kambos it is roughly a 40–45 minute drive.",
      href: "/chios-accommodation/",
      linkLabel: "Stay in Kambos →",
    },
    {
      icon: "🅿️",
      title: "Parking",
      text: "Cars cannot enter the old village. Leave the car in the parking areas around Mesta and walk in.",
    },
    {
      icon: "⏱️",
      title: "How much time you need",
      text: "One and a half to two hours for a walk and a coffee on the square. Add lunch and Olympoi and it becomes a half day.",
    },
  ],
  highlights: {
    title: "What to see in Mesta",
    items: [
      "Megas Taxiarchis, one of the largest churches on Chios",
      "Old (Small) Taxiarchis with its carved wooden iconostasis",
      "Alleys with arches and vaulted passages",
      "The outer houses that form the village wall",
      "The square for coffee, souma or a meal",
    ],
  },
  guide: {
    kicker: "Visitor guide",
    title: "Mesta, Chios: what to see and how to plan your visit",
    intro:
      "Mesta is the most intact of the medieval mastic villages of southern Chios. It has no xysta like Pyrgi, but it has something rarer: the whole fortified settlement almost exactly as it was.",
    sections: [
      {
        title: "The fortress village",
        paragraphs: [
          "The village was built during the Genoese period, when the people of the mastic villages had to protect the mastic and themselves from raids. The perimeter houses have no windows facing out and work as a wall.",
          "At the centre stood the tower, the last refuge during an attack. Only parts of it survive, but the plan of the village around it is easy to read as you walk.",
        ],
      },
      {
        title: "The two Taxiarchis churches",
        paragraphs: [
          "The main square is dominated by Megas Taxiarchis, a 19th-century church and one of the largest on the island. Step inside for the interior and its icons.",
          "Deeper in the village is the Old or Small Taxiarchis, much older, with an impressive carved wooden iconostasis. If you find it open, do not walk past.",
        ],
      },
      {
        title: "Square, food and local products",
        paragraphs: [
          "The square below Megas Taxiarchis is the meeting point of the village, with cafés and tavernas. Try souma, the local spirit, and mastic products from the small shops in the alleys.",
          "In summer the square comes alive in the late afternoon. For a quiet walk through the alleys, go in the morning.",
        ],
      },
      {
        title: "Limenas Meston and nearby beaches",
        paragraphs: [
          "A few kilometres from the village is Limenas Meston, a small fishing harbour with tavernas by the sea. It is a good stop for lunch after your walk.",
          "If you want a swim on the same route, Mavra Volia with its black pebbles is at the southern tip of the island, close to Pyrgi.",
        ],
        links: [
          { label: "Mavra Volia beach", href: "/chios/chios-beaches/emporios-beach/" },
          { label: "All Chios beaches", href: "/chios/chios-beaches/" },
        ],
      },
    ],
  },
  routeIdeas: {
    title: "How to combine Mesta",
    items: [
      {
        icon: "🌿",
        title: "Mesta & Olympoi",
        text: "Olympoi is a few minutes away and is the quietest of the three big mastic villages. The Olympoi cave is close by.",
        href: "/chios/chios-villages/olympoi-chios/",
        linkLabel: "Olympoi, Chios →",
      },
      {
        icon: "🎨",
        title: "Pyrgi & the Mastic Museum",
        text: "Continue to Pyrgi for the xysta and stop at the Chios Mastic Museum to see how mastic is cultivated.",
        href: "/chios/chios-villages/chios-pyrgi/",
        linkLabel: "Pyrgi, Chios →",
      },
      {
        icon: "🗺️",
        title: "All mastic villages in one day",
        text: "Mesta, Olympoi, Pyrgi and the museum in the morning, Mavra Volia or Komi for a swim in the afternoon, back to Kambos for dinner.",
        href: "/chios-mastic-villages/",
        linkLabel: "Chios mastic villages →",
      },
    ],
  },
  baseTip: {
    icon: "🗺️",
    title: "Mesta, 40 minutes from your garden in Kambos",
    text: "Leave early for the mastic villages and come back in the evening to a quiet, historic citrus garden close to town and the airport.",
    linkLabel: "Chios accommodation at Voulamandis House",
    href: "/chios-accommodation/",
    benefits: [
      "Free parking for your day trips",
      "Rooms and family apartments",
      "Direct booking with no commission",
    ],
  },
  practical: {
    title: "Distances from Mesta",
    items: [
      { label: "Chios Town", value: "about 35 km (45 minutes)" },
      { label: "Kambos / Voulamandis House", value: "about 40–45 minutes by car", href: "/chios-accommodation/" },
      { label: "Olympoi", value: "about 4 km" },
      { label: "Pyrgi", value: "about 10 km" },
      { label: "Best time in summer", value: "morning or late afternoon" },
    ],
  },
  faq: {
    kicker: "FAQ",
    title: "Questions about Mesta, Chios",
    items: [
      {
        question: "How far is Mesta from Chios Town?",
        answer: "About 35 kilometres, roughly 45 minutes by car. From Kambos the drive is a little shorter.",
      },
      {
        question: "Can I drive into Mesta?",
        answer: "Not into the old village. The alleys are pedestrian only, so you park in the areas around the village.",
      },
      {
        question: "How much time do I need for Mesta?",
        answer: "One and a half to two hours is enough for a walk and a coffee. If you want lunch and Olympoi too, keep half a day.",
      },
      {
        question: "What can I combine with Mesta?",
        answer: "Olympoi, about 4 km away, Pyrgi, the Mastic Museum and a southern beach such as Mavra Volia or Komi.",
      },
      {
        question: "What is the difference between Mesta and Pyrgi?",
        answer: "Pyrgi is known for the black-and-white xysta on its facades. Mesta stands out for its fortified layout, which survives almost intact.",
      },
      {
        question: "Is Mesta good with children?",
        answer: "Yes. There are no cars inside and children usually enjoy the maze of alleys. Just take care on the steps.",
      },
    ],
  },
};

const fr: MestaOverlay = {
  heroDescription:
    "Le village médiéval du mastic le mieux conservé du sud de Chios, à environ 35 km de la ville : ruelles de pierre, arches et la place du Taxiarque.",
  heroImageAlt: "Ruelle de pierre avec arches dans le village médiéval de Mesta, Chios",
  answerTitle: "Pourquoi visiter Mesta à Chios ?",
  answerText:
    "Parce que c’est le village fortifié le plus intact de Chios : les maisons extérieures forment un rempart, les ruelles sont un labyrinthe et les voitures n’entrent pas. Comptez 1 h 30 à 2 h et combinez-le facilement avec Olympoi et Pyrgi.",
  details: [
    {
      icon: "📍",
      title: "Situation & accès",
      text: "Mesta se trouve au sud-ouest de Chios, à environ 35 km de la ville. Depuis Kambos, comptez environ 40 à 45 minutes en voiture.",
      href: "/fr/hebergement-chios/",
      linkLabel: "Séjourner à Kambos →",
    },
    {
      icon: "🅿️",
      title: "Stationnement",
      text: "Les voitures n’entrent pas dans le vieux village. Garez-vous sur les parkings autour de Mesta et entrez à pied.",
    },
    {
      icon: "⏱️",
      title: "Temps nécessaire",
      text: "Une heure et demie à deux heures pour flâner et prendre un café sur la place. Avec un déjeuner et Olympoi, prévoyez une demi-journée.",
    },
  ],
  highlights: {
    title: "Que voir à Mesta",
    items: [
      "Le Grand Taxiarque, l’une des plus grandes églises de Chios",
      "L’Ancien (Petit) Taxiarque et son iconostase en bois sculpté",
      "Les ruelles avec arches et passages voûtés",
      "Les maisons extérieures qui forment le rempart du village",
      "La place pour un café, une souma ou un repas",
    ],
  },
  guide: {
    kicker: "Guide de visite",
    title: "Mesta, Chios : que voir et comment organiser la visite",
    intro:
      "Mesta est le plus intact des villages médiévaux du mastic du sud de Chios. Il n’a pas les xysta de Pyrgi, mais il a quelque chose de plus rare : tout le village fortifié presque tel qu’il était.",
    sections: [
      {
        title: "Le village-forteresse",
        paragraphs: [
          "Le village a été construit à l’époque génoise, lorsque les habitants des villages du mastic devaient protéger le mastic et se protéger eux-mêmes des raids. Les maisons du pourtour n’ont pas de fenêtres vers l’extérieur et forment un rempart.",
          "Au centre se dressait la tour, dernier refuge en cas d’attaque. Il n’en reste que des parties, mais le plan du village autour d’elle se lit facilement en marchant.",
        ],
      },
      {
        title: "Les deux Taxiarques",
        paragraphs: [
          "La place centrale est dominée par le Grand Taxiarque, église du XIXe siècle et l’une des plus grandes de l’île. Entrez pour l’intérieur et ses icônes.",
          "Un peu plus loin dans le village se trouve l’Ancien ou Petit Taxiarque, bien plus ancien, avec une impressionnante iconostase en bois sculpté. S’il est ouvert, ne le manquez pas.",
        ],
      },
      {
        title: "Place, cuisine et produits locaux",
        paragraphs: [
          "La place au pied du Grand Taxiarque est le lieu de rencontre du village, avec cafés et tavernes. Goûtez la souma, l’eau-de-vie locale, et les produits au mastic des petites boutiques.",
          "En été, la place s’anime en fin d’après-midi. Pour une promenade tranquille dans les ruelles, préférez le matin.",
        ],
      },
      {
        title: "Limenas Meston et plages proches",
        paragraphs: [
          "À quelques kilomètres du village se trouve Limenas Meston, un petit port de pêche avec des tavernes au bord de l’eau. C’est une bonne halte pour déjeuner après la visite.",
          "Pour une baignade sur le même itinéraire, Mavra Volia et ses galets noirs se trouvent à la pointe sud de l’île, près de Pyrgi.",
        ],
        links: [
          { label: "Plage de Mavra Volia", href: "/fr/plages-de-chios/plage-mavra-volia/" },
          { label: "Toutes les plages de Chios", href: "/fr/plages-de-chios/" },
        ],
      },
    ],
  },
  routeIdeas: {
    title: "Comment combiner Mesta",
    items: [
      {
        icon: "🌿",
        title: "Mesta & Olympoi",
        text: "Olympoi est à quelques minutes et c’est le plus calme des trois grands villages du mastic. La grotte d’Olympoi est tout près.",
        href: "/fr/villages-de-chios/village-olympoi/",
        linkLabel: "Olympoi, Chios →",
      },
      {
        icon: "🎨",
        title: "Pyrgi & Musée du Mastic",
        text: "Continuez vers Pyrgi pour les xysta et arrêtez-vous au Musée du Mastic pour comprendre sa culture.",
        href: "/fr/villages-de-chios/village-pyrgi/",
        linkLabel: "Pyrgi, Chios →",
      },
      {
        icon: "🗺️",
        title: "Tous les villages du mastic en une journée",
        text: "Mesta, Olympoi, Pyrgi et le musée le matin, Mavra Volia ou Komi pour la baignade l’après-midi, retour à Kambos pour le dîner.",
        href: "/fr/villages-du-mastic-chios/",
        linkLabel: "Villages du mastic →",
      },
    ],
  },
  baseTip: {
    icon: "🗺️",
    title: "Mesta à 40 minutes de votre jardin à Kambos",
    text: "Partez tôt vers les villages du mastic et revenez le soir dans un jardin d’agrumes calme et historique, proche de la ville et de l’aéroport.",
    linkLabel: "Hébergement à Chios au Voulamandis House",
    href: "/fr/hebergement-chios/",
    benefits: [
      "Parking gratuit pour vos excursions",
      "Chambres et appartements familiaux",
      "Réservation directe sans commission",
    ],
  },
  practical: {
    title: "Distances depuis Mesta",
    items: [
      { label: "Ville de Chios", value: "environ 35 km (45 minutes)" },
      { label: "Kambos / Voulamandis House", value: "environ 40 à 45 minutes en voiture", href: "/fr/hebergement-chios/" },
      { label: "Olympoi", value: "environ 4 km" },
      { label: "Pyrgi", value: "environ 10 km" },
      { label: "Meilleur moment en été", value: "le matin ou en fin d’après-midi" },
    ],
  },
  faq: {
    kicker: "Questions fréquentes",
    title: "Questions sur Mesta, Chios",
    items: [
      {
        question: "Quelle distance entre Mesta et la ville de Chios ?",
        answer: "Environ 35 kilomètres, soit à peu près 45 minutes en voiture. Depuis Kambos, le trajet est un peu plus court.",
      },
      {
        question: "Peut-on entrer en voiture dans Mesta ?",
        answer: "Pas dans le vieux village. Les ruelles sont piétonnes : on se gare sur les parkings autour du village.",
      },
      {
        question: "Combien de temps faut-il pour visiter Mesta ?",
        answer: "Une heure et demie à deux heures suffisent pour flâner et prendre un café. Avec un déjeuner et Olympoi, prévoyez une demi-journée.",
      },
      {
        question: "Que combiner avec Mesta ?",
        answer: "Olympoi, à environ 4 km, Pyrgi, le Musée du Mastic et une plage du sud comme Mavra Volia ou Komi.",
      },
      {
        question: "Quelle différence entre Mesta et Pyrgi ?",
        answer: "Pyrgi est connu pour les xysta noir et blanc de ses façades. Mesta se distingue par son plan fortifié, conservé presque intact.",
      },
      {
        question: "Mesta est-il adapté aux enfants ?",
        answer: "Oui. Il n’y a pas de voitures à l’intérieur et les enfants adorent le labyrinthe de ruelles. Attention seulement aux marches.",
      },
    ],
  },
};

const de: MestaOverlay = {
  heroDescription:
    "Das am besten erhaltene mittelalterliche Mastixdorf im Süden von Chios, rund 35 km von der Stadt: Steingassen, Bögen und der Platz am Taxiarchis.",
  heroImageAlt: "Steingasse mit Bögen im mittelalterlichen Dorf Mesta auf Chios",
  answerTitle: "Warum Mesta auf Chios besuchen?",
  answerText:
    "Weil es das am vollständigsten erhaltene Festungsdorf von Chios ist: Die äußeren Häuser bilden eine Mauer, die Gassen sind ein Labyrinth und Autos fahren nicht hinein. Planen Sie 1,5–2 Stunden ein – ideal kombiniert mit Olympoi und Pyrgi.",
  details: [
    {
      icon: "📍",
      title: "Lage und Anfahrt",
      text: "Mesta liegt im Südwesten von Chios, etwa 35 km von der Stadt entfernt. Von Kambos fahren Sie rund 40–45 Minuten mit dem Auto.",
      href: "/de/chios-unterkunft/",
      linkLabel: "Unterkunft in Kambos →",
    },
    {
      icon: "🅿️",
      title: "Parken",
      text: "In das alte Dorf fahren keine Autos. Parken Sie auf den Parkplätzen rund um Mesta und gehen Sie zu Fuß hinein.",
    },
    {
      icon: "⏱️",
      title: "Wie viel Zeit Sie brauchen",
      text: "Eineinhalb bis zwei Stunden für einen Rundgang und einen Kaffee auf dem Platz. Mit Mittagessen und Olympoi wird daraus ein halber Tag.",
    },
  ],
  highlights: {
    title: "Was Sie in Mesta sehen sollten",
    items: [
      "Megas Taxiarchis, eine der größten Kirchen von Chios",
      "Der Alte (Kleine) Taxiarchis mit geschnitzter Holzikonostase",
      "Gassen mit Bögen und überwölbten Durchgängen",
      "Die äußeren Häuser, die die Dorfmauer bilden",
      "Der Dorfplatz für Kaffee, Souma oder ein Essen",
    ],
  },
  guide: {
    kicker: "Besucherführer",
    title: "Mesta auf Chios: Sehenswertes und Tipps für Ihren Besuch",
    intro:
      "Mesta ist das am besten erhaltene der mittelalterlichen Mastixdörfer im Süden von Chios. Es hat keine Xysta wie Pyrgi, dafür etwas Selteneres: das ganze befestigte Dorf fast so, wie es war.",
    sections: [
      {
        title: "Das Festungsdorf",
        paragraphs: [
          "Das Dorf entstand in der genuesischen Zeit, als die Bewohner der Mastixdörfer den Mastix und sich selbst vor Überfällen schützen mussten. Die Häuser am Rand haben keine Fenster nach außen und bilden eine Mauer.",
          "In der Mitte stand der Turm, die letzte Zuflucht bei einem Angriff. Erhalten sind nur Teile, doch der Grundriss des Dorfes rund um ihn ist beim Gehen gut zu erkennen.",
        ],
      },
      {
        title: "Die beiden Taxiarchis-Kirchen",
        paragraphs: [
          "Den Hauptplatz beherrscht der Megas Taxiarchis, eine Kirche aus dem 19. Jahrhundert und eine der größten der Insel. Ein Blick ins Innere mit seinen Ikonen lohnt sich.",
          "Weiter im Dorf liegt der Alte oder Kleine Taxiarchis, deutlich älter, mit einer beeindruckenden geschnitzten Holzikonostase. Wenn er geöffnet ist, gehen Sie nicht vorbei.",
        ],
      },
      {
        title: "Dorfplatz, Essen und lokale Produkte",
        paragraphs: [
          "Der Platz unter dem Megas Taxiarchis ist der Treffpunkt des Dorfes, mit Cafés und Tavernen. Probieren Sie Souma, den lokalen Brand, und Mastixprodukte aus den kleinen Läden.",
          "Im Sommer belebt sich der Platz am späten Nachmittag. Für einen ruhigen Spaziergang durch die Gassen ist der Vormittag ideal.",
        ],
      },
      {
        title: "Limenas Meston und Strände in der Nähe",
        paragraphs: [
          "Wenige Kilometer vom Dorf entfernt liegt Limenas Meston, ein kleiner Fischerhafen mit Tavernen am Wasser – ein guter Stopp zum Mittagessen.",
          "Wer auf derselben Route baden möchte, findet Mavra Volia mit seinen schwarzen Kieseln an der Südspitze der Insel, nahe Pyrgi.",
        ],
        links: [
          { label: "Strand Mavra Volia", href: "/de/straende-chios/mavra-volia-strand/" },
          { label: "Alle Strände auf Chios", href: "/de/straende-chios/" },
        ],
      },
    ],
  },
  routeIdeas: {
    title: "Mesta mit anderen Stopps verbinden",
    items: [
      {
        icon: "🌿",
        title: "Mesta & Olympoi",
        text: "Olympoi liegt nur wenige Minuten entfernt und ist das ruhigste der drei großen Mastixdörfer. Die Höhle von Olympoi ist ganz in der Nähe.",
        href: "/de/doerfer-chios/olympoi-dorf/",
        linkLabel: "Olympoi auf Chios →",
      },
      {
        icon: "🎨",
        title: "Pyrgi & Mastixmuseum",
        text: "Fahren Sie weiter nach Pyrgi zu den Xysta und halten Sie am Mastixmuseum, um den Anbau des Mastix kennenzulernen.",
        href: "/de/doerfer-chios/pyrgi-dorf/",
        linkLabel: "Pyrgi auf Chios →",
      },
      {
        icon: "🗺️",
        title: "Alle Mastixdörfer an einem Tag",
        text: "Vormittags Mesta, Olympoi, Pyrgi und das Museum, nachmittags Baden in Mavra Volia oder Komi, abends zurück nach Kambos.",
        href: "/de/mastixdoerfer-chios/",
        linkLabel: "Mastixdörfer auf Chios →",
      },
    ],
  },
  baseTip: {
    icon: "🗺️",
    title: "Mesta, 40 Minuten von Ihrem Garten in Kambos",
    text: "Starten Sie früh zu den Mastixdörfern und kehren Sie abends in einen ruhigen, historischen Zitrusgarten nahe Stadt und Flughafen zurück.",
    linkLabel: "Unterkunft auf Chios im Voulamandis House",
    href: "/de/chios-unterkunft/",
    benefits: [
      "Kostenlose Parkplätze für Ihre Ausflüge",
      "Zimmer und Familienapartments",
      "Direktbuchung ohne Provision",
    ],
  },
  practical: {
    title: "Entfernungen von Mesta",
    items: [
      { label: "Chios-Stadt", value: "etwa 35 km (45 Minuten)" },
      { label: "Kambos / Voulamandis House", value: "etwa 40–45 Minuten mit dem Auto", href: "/de/chios-unterkunft/" },
      { label: "Olympoi", value: "etwa 4 km" },
      { label: "Pyrgi", value: "etwa 10 km" },
      { label: "Beste Zeit im Sommer", value: "morgens oder am späten Nachmittag" },
    ],
  },
  faq: {
    kicker: "Häufige Fragen",
    title: "Fragen zu Mesta auf Chios",
    items: [
      {
        question: "Wie weit ist Mesta von Chios-Stadt entfernt?",
        answer: "Etwa 35 Kilometer, also rund 45 Minuten mit dem Auto. Von Kambos ist die Fahrt etwas kürzer.",
      },
      {
        question: "Kann ich mit dem Auto nach Mesta hineinfahren?",
        answer: "Nicht ins alte Dorf. Die Gassen sind Fußgängerzone, daher parken Sie auf den Plätzen rund um das Dorf.",
      },
      {
        question: "Wie viel Zeit brauche ich für Mesta?",
        answer: "Eineinhalb bis zwei Stunden reichen für Rundgang und Kaffee. Mit Mittagessen und Olympoi planen Sie einen halben Tag.",
      },
      {
        question: "Was lässt sich mit Mesta kombinieren?",
        answer: "Olympoi in etwa 4 km Entfernung, Pyrgi, das Mastixmuseum und ein Strand im Süden wie Mavra Volia oder Komi.",
      },
      {
        question: "Was ist der Unterschied zwischen Mesta und Pyrgi?",
        answer: "Pyrgi ist für die schwarz-weißen Xysta an den Fassaden bekannt. Mesta besticht durch seine fast vollständig erhaltene Festungsstruktur.",
      },
      {
        question: "Ist Mesta für Kinder geeignet?",
        answer: "Ja. Im Dorf fahren keine Autos und Kinder lieben das Labyrinth aus Gassen. Achten Sie nur auf die Stufen.",
      },
    ],
  },
};

const it: MestaOverlay = {
  heroDescription:
    "Il villaggio medievale del mastice meglio conservato del sud di Chios, a circa 35 km dalla città: vicoli di pietra, archi e la piazza del Taxiarchis.",
  heroImageAlt: "Vicolo in pietra con archi nel villaggio medievale di Mesta, Chios",
  answerTitle: "Perché visitare Mesta a Chios?",
  answerText:
    "Perché è il villaggio fortificato più integro di Chios: le case esterne formano un muro, i vicoli sono un labirinto e le auto non entrano. Servono 1,5–2 ore e si abbina facilmente a Olympoi e Pyrgi.",
  details: [
    {
      icon: "📍",
      title: "Posizione e accesso",
      text: "Mesta si trova nel sud-ovest di Chios, a circa 35 km dalla città. Da Kambos ci vogliono circa 40–45 minuti in auto.",
      href: "/it/alloggio-chios/",
      linkLabel: "Alloggio a Kambos →",
    },
    {
      icon: "🅿️",
      title: "Parcheggio",
      text: "Le auto non entrano nel vecchio villaggio. Lasciate l’auto nei parcheggi intorno a Mesta ed entrate a piedi.",
    },
    {
      icon: "⏱️",
      title: "Quanto tempo serve",
      text: "Un’ora e mezza o due per una passeggiata e un caffè in piazza. Con pranzo e Olympoi diventa mezza giornata.",
    },
  ],
  highlights: {
    title: "Cosa vedere a Mesta",
    items: [
      "Il Megas Taxiarchis, una delle chiese più grandi di Chios",
      "Il Vecchio (Piccolo) Taxiarchis con l’iconostasi in legno intagliato",
      "I vicoli con archi e passaggi a volta",
      "Le case esterne che formano il muro del villaggio",
      "La piazza per un caffè, una souma o un pasto",
    ],
  },
  guide: {
    kicker: "Guida alla visita",
    title: "Mesta, Chios: cosa vedere e come organizzare la visita",
    intro:
      "Mesta è il più integro dei villaggi medievali del mastice del sud di Chios. Non ha gli xysta di Pyrgi, ma ha qualcosa di più raro: l’intero borgo fortificato quasi com’era.",
    sections: [
      {
        title: "Il borgo fortificato",
        paragraphs: [
          "Il villaggio fu costruito in epoca genovese, quando gli abitanti dei villaggi del mastice dovevano proteggere il mastice e se stessi dalle incursioni. Le case del perimetro non hanno finestre verso l’esterno e fanno da muro.",
          "Al centro sorgeva la torre, l’ultimo rifugio in caso di attacco. Ne restano solo parti, ma la pianta del villaggio intorno a essa si legge bene camminando.",
        ],
      },
      {
        title: "I due Taxiarchis",
        paragraphs: [
          "La piazza centrale è dominata dal Megas Taxiarchis, chiesa del XIX secolo e tra le più grandi dell’isola. Vale la pena entrare per l’interno e le icone.",
          "Più all’interno del borgo si trova il Vecchio o Piccolo Taxiarchis, molto più antico, con un’iconostasi in legno intagliato davvero notevole. Se lo trovate aperto, non perdetelo.",
        ],
      },
      {
        title: "Piazza, cibo e prodotti locali",
        paragraphs: [
          "La piazza sotto il Megas Taxiarchis è il punto d’incontro del villaggio, con caffè e taverne. Assaggiate la souma, il distillato locale, e i prodotti al mastice delle piccole botteghe.",
          "D’estate la piazza si anima nel tardo pomeriggio. Per una passeggiata tranquilla tra i vicoli, scegliete la mattina.",
        ],
      },
      {
        title: "Limenas Meston e spiagge vicine",
        paragraphs: [
          "A pochi chilometri dal villaggio c’è Limenas Meston, un piccolo porto di pescatori con taverne sul mare. Ottima sosta per il pranzo dopo la visita.",
          "Se volete fare il bagno lungo lo stesso itinerario, Mavra Volia con i suoi ciottoli neri si trova all’estremità sud dell’isola, vicino a Pyrgi.",
        ],
        links: [
          { label: "Spiaggia di Mavra Volia", href: "/it/spiagge-chios/spiaggia-mavra-volia/" },
          { label: "Tutte le spiagge di Chios", href: "/it/spiagge-chios/" },
        ],
      },
    ],
  },
  routeIdeas: {
    title: "Come abbinare Mesta",
    items: [
      {
        icon: "🌿",
        title: "Mesta & Olympoi",
        text: "Olympoi è a pochi minuti ed è il più tranquillo dei tre grandi villaggi del mastice. La grotta di Olympoi è vicina.",
        href: "/it/villaggi-chios/villaggio-olympoi/",
        linkLabel: "Olympoi, Chios →",
      },
      {
        icon: "🎨",
        title: "Pyrgi & Museo del Mastice",
        text: "Proseguite verso Pyrgi per gli xysta e fermatevi al Museo del Mastice per scoprire come si coltiva il mastice.",
        href: "/it/villaggi-chios/villaggio-pyrgi/",
        linkLabel: "Pyrgi, Chios →",
      },
      {
        icon: "🗺️",
        title: "Tutti i villaggi del mastice in un giorno",
        text: "Mesta, Olympoi, Pyrgi e il museo al mattino, Mavra Volia o Komi per il bagno nel pomeriggio, rientro a Kambos per cena.",
        href: "/it/villaggi-del-mastice-chios/",
        linkLabel: "Villaggi del mastice →",
      },
    ],
  },
  baseTip: {
    icon: "🗺️",
    title: "Mesta a 40 minuti dal vostro giardino a Kambos",
    text: "Partite presto per i villaggi del mastice e rientrate la sera in un giardino di agrumi tranquillo e storico, vicino alla città e all’aeroporto.",
    linkLabel: "Alloggio a Chios al Voulamandis House",
    href: "/it/alloggio-chios/",
    benefits: [
      "Parcheggio gratuito per le vostre escursioni",
      "Camere e appartamenti per famiglie",
      "Prenotazione diretta senza commissioni",
    ],
  },
  practical: {
    title: "Distanze da Mesta",
    items: [
      { label: "Città di Chios", value: "circa 35 km (45 minuti)" },
      { label: "Kambos / Voulamandis House", value: "circa 40–45 minuti in auto", href: "/it/alloggio-chios/" },
      { label: "Olympoi", value: "circa 4 km" },
      { label: "Pyrgi", value: "circa 10 km" },
      { label: "Momento migliore in estate", value: "mattina o tardo pomeriggio" },
    ],
  },
  faq: {
    kicker: "Domande frequenti",
    title: "Domande su Mesta, Chios",
    items: [
      {
        question: "Quanto dista Mesta dalla città di Chios?",
        answer: "Circa 35 chilometri, cioè circa 45 minuti in auto. Da Kambos il tragitto è un po’ più breve.",
      },
      {
        question: "Si può entrare a Mesta in auto?",
        answer: "Non nel vecchio villaggio. I vicoli sono pedonali, quindi si parcheggia nelle aree intorno al borgo.",
      },
      {
        question: "Quanto tempo serve per visitare Mesta?",
        answer: "Un’ora e mezza o due bastano per passeggiare e prendere un caffè. Con pranzo e Olympoi, tenete mezza giornata.",
      },
      {
        question: "Cosa abbinare a Mesta?",
        answer: "Olympoi, a circa 4 km, Pyrgi, il Museo del Mastice e una spiaggia del sud come Mavra Volia o Komi.",
      },
      {
        question: "Che differenza c’è tra Mesta e Pyrgi?",
        answer: "Pyrgi è famoso per gli xysta bianchi e neri delle facciate. Mesta si distingue per la struttura fortificata, conservata quasi intatta.",
      },
      {
        question: "Mesta è adatta ai bambini?",
        answer: "Sì. All’interno non ci sono auto e i bambini si divertono nel labirinto di vicoli. Basta fare attenzione ai gradini.",
      },
    ],
  },
};

const es: MestaOverlay = {
  heroDescription:
    "El pueblo medieval de la almáciga mejor conservado del sur de Quíos, a unos 35 km de la ciudad: callejuelas de piedra, arcos y la plaza del Taxiarca.",
  heroImageAlt: "Callejuela de piedra con arcos en el pueblo medieval de Mesta, Quíos",
  answerTitle: "¿Por qué visitar Mesta en Quíos?",
  answerText:
    "Porque es el pueblo fortificado más intacto de Quíos: las casas exteriores forman una muralla, las callejuelas son un laberinto y no entran coches. Calcule 1,5–2 horas y combínelo fácilmente con Olympoi y Pyrgi.",
  details: [
    {
      icon: "📍",
      title: "Ubicación y acceso",
      text: "Mesta está en el suroeste de Quíos, a unos 35 km de la ciudad. Desde Kambos se tarda unos 40–45 minutos en coche.",
      href: "/es/alojamiento-chios/",
      linkLabel: "Alojarse en Kambos →",
    },
    {
      icon: "🅿️",
      title: "Aparcamiento",
      text: "Los coches no entran en el pueblo antiguo. Deje el coche en los aparcamientos alrededor de Mesta y entre a pie.",
    },
    {
      icon: "⏱️",
      title: "Cuánto tiempo necesita",
      text: "Hora y media o dos horas para pasear y tomar un café en la plaza. Con comida y Olympoi, será media jornada.",
    },
  ],
  highlights: {
    title: "Qué ver en Mesta",
    items: [
      "El Gran Taxiarca, una de las iglesias más grandes de Quíos",
      "El Viejo (Pequeño) Taxiarca con su iconostasio de madera tallada",
      "Las callejuelas con arcos y pasajes abovedados",
      "Las casas exteriores que forman la muralla del pueblo",
      "La plaza para un café, una souma o una comida",
    ],
  },
  guide: {
    kicker: "Guía de visita",
    title: "Mesta, Quíos: qué ver y cómo organizar la visita",
    intro:
      "Mesta es el más intacto de los pueblos medievales de la almáciga del sur de Quíos. No tiene los xysta de Pyrgi, pero tiene algo más raro: todo el pueblo fortificado casi tal como era.",
    sections: [
      {
        title: "El pueblo fortaleza",
        paragraphs: [
          "El pueblo se construyó en la época genovesa, cuando los habitantes de los pueblos de la almáciga debían proteger la almáciga y protegerse de las incursiones. Las casas del perímetro no tienen ventanas hacia fuera y funcionan como muralla.",
          "En el centro se alzaba la torre, el último refugio en caso de ataque. Solo se conservan partes, pero el trazado del pueblo a su alrededor se aprecia bien al caminar.",
        ],
      },
      {
        title: "Los dos Taxiarcas",
        paragraphs: [
          "La plaza central está presidida por el Gran Taxiarca, iglesia del siglo XIX y una de las mayores de la isla. Merece la pena entrar por su interior y sus iconos.",
          "Más adentro del pueblo está el Viejo o Pequeño Taxiarca, mucho más antiguo, con un impresionante iconostasio de madera tallada. Si está abierto, no lo deje pasar.",
        ],
      },
      {
        title: "Plaza, comida y productos locales",
        paragraphs: [
          "La plaza bajo el Gran Taxiarca es el punto de encuentro del pueblo, con cafés y tabernas. Pruebe la souma, el aguardiente local, y los productos de almáciga de las pequeñas tiendas.",
          "En verano la plaza se anima al final de la tarde. Para un paseo tranquilo por las callejuelas, mejor por la mañana.",
        ],
      },
      {
        title: "Limenas Meston y playas cercanas",
        paragraphs: [
          "A pocos kilómetros del pueblo está Limenas Meston, un pequeño puerto pesquero con tabernas junto al mar. Es una buena parada para comer tras la visita.",
          "Si quiere bañarse en la misma ruta, Mavra Volia, con sus guijarros negros, está en el extremo sur de la isla, cerca de Pyrgi.",
        ],
        links: [
          { label: "Playa de Mavra Volia", href: "/es/playas-chios/playa-mavra-volia/" },
          { label: "Todas las playas de Quíos", href: "/es/playas-chios/" },
        ],
      },
    ],
  },
  routeIdeas: {
    title: "Cómo combinar Mesta",
    items: [
      {
        icon: "🌿",
        title: "Mesta y Olympoi",
        text: "Olympoi está a pocos minutos y es el más tranquilo de los tres grandes pueblos de la almáciga. La cueva de Olympoi está muy cerca.",
        href: "/es/pueblos-chios/pueblo-olympoi/",
        linkLabel: "Olympoi, Quíos →",
      },
      {
        icon: "🎨",
        title: "Pyrgi y el Museo de la Almáciga",
        text: "Siga hacia Pyrgi para ver los xysta y pare en el Museo de la Almáciga para conocer cómo se cultiva.",
        href: "/es/pueblos-chios/pueblo-pyrgi/",
        linkLabel: "Pyrgi, Quíos →",
      },
      {
        icon: "🗺️",
        title: "Todos los pueblos de la almáciga en un día",
        text: "Mesta, Olympoi, Pyrgi y el museo por la mañana, Mavra Volia o Komi para bañarse por la tarde, y vuelta a Kambos para cenar.",
        href: "/es/pueblos-del-mastiha-quios/",
        linkLabel: "Pueblos de la almáciga →",
      },
    ],
  },
  baseTip: {
    icon: "🗺️",
    title: "Mesta a 40 minutos de su jardín en Kambos",
    text: "Salga temprano hacia los pueblos de la almáciga y vuelva por la noche a un jardín de cítricos tranquilo e histórico, cerca de la ciudad y del aeropuerto.",
    linkLabel: "Alojamiento en Quíos en Voulamandis House",
    href: "/es/alojamiento-chios/",
    benefits: [
      "Aparcamiento gratuito para sus excursiones",
      "Habitaciones y apartamentos familiares",
      "Reserva directa sin comisiones",
    ],
  },
  practical: {
    title: "Distancias desde Mesta",
    items: [
      { label: "Ciudad de Quíos", value: "unos 35 km (45 minutos)" },
      { label: "Kambos / Voulamandis House", value: "unos 40–45 minutos en coche", href: "/es/alojamiento-chios/" },
      { label: "Olympoi", value: "unos 4 km" },
      { label: "Pyrgi", value: "unos 10 km" },
      { label: "Mejor momento en verano", value: "por la mañana o al final de la tarde" },
    ],
  },
  faq: {
    kicker: "Preguntas frecuentes",
    title: "Preguntas sobre Mesta, Quíos",
    items: [
      {
        question: "¿A qué distancia está Mesta de la ciudad de Quíos?",
        answer: "A unos 35 kilómetros, alrededor de 45 minutos en coche. Desde Kambos el trayecto es algo más corto.",
      },
      {
        question: "¿Se puede entrar en coche en Mesta?",
        answer: "No en el pueblo antiguo. Las callejuelas son peatonales, así que se aparca en las zonas alrededor del pueblo.",
      },
      {
        question: "¿Cuánto tiempo necesito para ver Mesta?",
        answer: "Hora y media o dos horas bastan para pasear y tomar un café. Si quiere comer y ver Olympoi, reserve media jornada.",
      },
      {
        question: "¿Qué combinar con Mesta?",
        answer: "Olympoi, a unos 4 km, Pyrgi, el Museo de la Almáciga y una playa del sur como Mavra Volia o Komi.",
      },
      {
        question: "¿Qué diferencia hay entre Mesta y Pyrgi?",
        answer: "Pyrgi es famoso por los xysta en blanco y negro de sus fachadas. Mesta destaca por su trazado fortificado, conservado casi intacto.",
      },
      {
        question: "¿Merece la pena Mesta con niños?",
        answer: "Sí. Dentro no hay coches y a los niños les encanta el laberinto de callejuelas. Solo hay que tener cuidado con los escalones.",
      },
    ],
  },
};

const tr: MestaOverlay = {
  heroDescription:
    "Sakız Adası’nın güneyindeki en iyi korunmuş Orta Çağ mastik köyü, şehre yaklaşık 35 km: taş sokaklar, kemerler ve Taksiyarhis meydanı.",
  heroImageAlt: "Sakız Adası Mesta köyünde kemerli taş sokak",
  answerTitle: "Sakız Adası’nda Mesta neden görülmeli?",
  answerText:
    "Çünkü Sakız’ın en bütün kalmış kale köyüdür: dış evler sur oluşturur, sokaklar labirent gibidir ve içeri araç girmez. 1,5–2 saat ayırın; Olympoi ve Pyrgi ile kolayca birleştirebilirsiniz.",
  details: [
    {
      icon: "📍",
      title: "Konum ve ulaşım",
      text: "Mesta, Sakız Adası’nın güneybatısında, şehre yaklaşık 35 km uzaklıktadır. Kambos’tan arabayla yaklaşık 40–45 dakika sürer.",
      href: "/tr/sakiz-adasi-konaklama/",
      linkLabel: "Kambos’ta konaklama →",
    },
    {
      icon: "🅿️",
      title: "Otopark",
      text: "Eski köyün içine araç girmez. Arabanızı köyün çevresindeki otoparklara bırakıp yürüyerek girin.",
    },
    {
      icon: "⏱️",
      title: "Ne kadar zaman gerekir?",
      text: "Gezinti ve meydanda bir kahve için bir buçuk iki saat yeterli. Öğle yemeği ve Olympoi eklerseniz yarım gün ayırın.",
    },
  ],
  highlights: {
    title: "Mesta’da görülecek yerler",
    items: [
      "Sakız’ın en büyük kiliselerinden Megas Taksiyarhis",
      "Oyma ahşap ikonostasıyla Eski (Küçük) Taksiyarhis",
      "Kemerli sokaklar ve tonozlu geçitler",
      "Köyün surunu oluşturan dış evler",
      "Kahve, souma veya yemek için köy meydanı",
    ],
  },
  guide: {
    kicker: "Gezi rehberi",
    title: "Mesta, Sakız Adası: görülecek yerler ve gezi planı",
    intro:
      "Mesta, Sakız’ın güneyindeki Orta Çağ mastik köylerinin en bütün kalanıdır. Pyrgi’deki xysta desenleri yoktur ama daha nadir bir şeyi vardır: neredeyse eskisi gibi duran surlu bir köy.",
    sections: [
      {
        title: "Kale köy",
        paragraphs: [
          "Köy, mastik köylerinin halkının mastiği ve kendilerini baskınlardan korumak zorunda olduğu Ceneviz döneminde kuruldu. Çevredeki evlerin dışa bakan penceresi yoktur ve sur görevi görür.",
          "Ortada saldırı anında son sığınak olan kule yükselirdi. Bugün yalnızca bazı bölümleri ayakta, ama köyün onun etrafındaki planı yürürken kolayca fark edilir.",
        ],
      },
      {
        title: "İki Taksiyarhis kilisesi",
        paragraphs: [
          "Ana meydana 19. yüzyıldan kalma, adanın en büyük kiliselerinden Megas Taksiyarhis hâkimdir. İç mekânı ve ikonaları için içeri girmeye değer.",
          "Köyün daha içinde çok daha eski olan Eski ya da Küçük Taksiyarhis bulunur; etkileyici oyma ahşap ikonostasıyla. Açıksa mutlaka uğrayın.",
        ],
      },
      {
        title: "Meydan, yemek ve yerel ürünler",
        paragraphs: [
          "Megas Taksiyarhis’in altındaki meydan, kafeleri ve tavernalarıyla köyün buluşma noktasıdır. Yerel içki soumayı ve küçük dükkânlardaki mastik ürünlerini deneyin.",
          "Yazın meydan akşamüstü canlanır. Sokaklarda sakin bir yürüyüş için sabah saatlerini tercih edin.",
        ],
      },
      {
        title: "Limenas Meston ve yakın plajlar",
        paragraphs: [
          "Köyün birkaç kilometre ötesinde, deniz kenarında tavernaları olan küçük balıkçı limanı Limenas Meston vardır. Geziden sonra öğle yemeği için iyi bir duraktır.",
          "Aynı rotada denize girmek isterseniz, siyah çakıllarıyla Mavra Volia adanın güney ucunda, Pyrgi’ye yakındır.",
        ],
        links: [
          { label: "Mavra Volia plajı", href: "/tr/sakiz-adasi-plajlari/mavra-volia-plaji/" },
          { label: "Sakız Adası plajları", href: "/tr/sakiz-adasi-plajlari/" },
        ],
      },
    ],
  },
  routeIdeas: {
    title: "Mesta’yı nasıl birleştirebilirsiniz?",
    items: [
      {
        icon: "🌿",
        title: "Mesta ve Olympoi",
        text: "Olympoi birkaç dakika uzaklıkta ve üç büyük mastik köyünün en sakinidir. Olympoi mağarası da hemen yakındadır.",
        href: "/tr/sakiz-adasi-koyleri/olympoi-koyu/",
        linkLabel: "Olympoi köyü →",
      },
      {
        icon: "🎨",
        title: "Pyrgi ve Mastik Müzesi",
        text: "Xysta desenleri için Pyrgi’ye devam edin ve mastiğin nasıl yetiştirildiğini görmek için Mastik Müzesi’nde durun.",
        href: "/tr/sakiz-adasi-koyleri/pyrgi-koyu/",
        linkLabel: "Pyrgi köyü →",
      },
      {
        icon: "🗺️",
        title: "Tüm mastik köyleri bir günde",
        text: "Sabah Mesta, Olympoi, Pyrgi ve müze; öğleden sonra Mavra Volia veya Komi’de deniz; akşam yemeği için Kambos’a dönüş.",
        href: "/tr/sakiz-adasi-mastik-koyleri/",
        linkLabel: "Sakız mastik köyleri →",
      },
    ],
  },
  baseTip: {
    icon: "🗺️",
    title: "Kambos’taki bahçenizden Mesta’ya 40 dakika",
    text: "Mastik köylerine erken çıkın, akşam şehre ve havalimanına yakın, sakin ve tarihi bir narenciye bahçesine dönün.",
    linkLabel: "Voulamandis House’ta Sakız Adası konaklama",
    href: "/tr/sakiz-adasi-konaklama/",
    benefits: [
      "Geziler için ücretsiz otopark",
      "Odalar ve aile daireleri",
      "Komisyonsuz doğrudan rezervasyon",
    ],
  },
  practical: {
    title: "Mesta’dan mesafeler",
    items: [
      { label: "Sakız şehri", value: "yaklaşık 35 km (45 dakika)" },
      { label: "Kambos / Voulamandis House", value: "arabayla yaklaşık 40–45 dakika", href: "/tr/sakiz-adasi-konaklama/" },
      { label: "Olympoi", value: "yaklaşık 4 km" },
      { label: "Pyrgi", value: "yaklaşık 10 km" },
      { label: "Yazın en iyi saat", value: "sabah veya akşamüstü" },
    ],
  },
  faq: {
    kicker: "Sık sorulan sorular",
    title: "Mesta, Sakız Adası hakkında sorular",
    items: [
      {
        question: "Mesta, Sakız şehrine ne kadar uzaklıkta?",
        answer: "Yaklaşık 35 kilometre, arabayla 45 dakika kadar. Kambos’tan yol biraz daha kısadır.",
      },
      {
        question: "Mesta’ya arabayla girilebilir mi?",
        answer: "Eski köyün içine girilemez. Sokaklar yayadır; köyün çevresindeki otoparklara park edilir.",
      },
      {
        question: "Mesta’yı gezmek için ne kadar zaman gerekir?",
        answer: "Yürüyüş ve kahve için bir buçuk iki saat yeterlidir. Öğle yemeği ve Olympoi için yarım gün ayırın.",
      },
      {
        question: "Mesta ile neler birleştirilebilir?",
        answer: "Yaklaşık 4 km uzaktaki Olympoi, Pyrgi, Mastik Müzesi ve Mavra Volia ya da Komi gibi güneydeki bir plaj.",
      },
      {
        question: "Mesta ile Pyrgi arasındaki fark nedir?",
        answer: "Pyrgi, cephelerindeki siyah-beyaz xysta desenleriyle bilinir. Mesta ise neredeyse bütün kalmış kale düzeniyle öne çıkar.",
      },
      {
        question: "Mesta çocuklarla gezilir mi?",
        answer: "Evet. İçeride araç yoktur ve çocuklar sokak labirentini çok sever. Sadece basamaklara dikkat edin.",
      },
    ],
  },
};

const mestaOverlays: Record<string, MestaOverlay> = {
  "/chios/chios-villages/mesta-chios/": en,
  "/fr/villages-de-chios/village-mesta/": fr,
  "/de/doerfer-chios/mesta-dorf/": de,
  "/it/villaggi-chios/villaggio-mesta/": it,
  "/es/pueblos-chios/pueblo-mesta/": es,
  "/tr/sakiz-adasi-koyleri/mesta-koyu/": tr,
};

export function applyVillageGuideOverlay<T extends VillageDetailData | undefined>(village: T): T {
  if (!village) return village;
  const overlay = mestaOverlays[village.seo.canonicalPath];
  if (!overlay) return village;

  const { heroDescription, ...rest } = overlay;
  return {
    ...village,
    ...rest,
    hero: { ...village.hero, description: heroDescription },
  } as T;
}
