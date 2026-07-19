import type { ChiosAccommodationPageData } from "@/content/chios-accommodation";

const heroImage =
  "/images/activities/chios.hotels.voulamandis.house_.hero_.image_.webp";

export const hebergementChiosPageFr: ChiosAccommodationPageData = {
  seo: {
    canonicalPath: "/fr/hebergement-chios/",
    title: "Hébergement à Chios | Chambres & Appartements à Kambos",
    description:
      "Séjournez au Voulamandis House à Kambos : chambres calmes et appartements familiaux près de Chios-ville, de l’aéroport et des plages. Voir les disponibilités.",
    ogImage: heroImage,
    ogImageAlt:
      "Hébergement au Voulamandis House dans les jardins d’agrumes de Kambos à Chios",
  },
  hero: {
    kicker: "HÉBERGEMENT FAMILIAL • KAMBOS CHIOS",
    title: "Un hébergement à Chios au calme, dans le cadre historique de Kambos",
    description:
      "Voulamandis House propose des chambres paisibles et des appartements familiaux dans le quartier historique de Kambos. Vous séjournez près de Chios-ville, de l’aéroport et du port, tout en profitant d’un jardin, d’une atmosphère plus tranquille et d’un accueil personnel adapté aux couples et aux familles.",
    image: heroImage,
    imageAlt:
      "Chambres et appartements du Voulamandis House à Kambos sur l’île de Chios",
    primaryCta: {
      label: "Voir chambres & appartements",
      href: "/fr/chambres-a-chios/",
    },
    secondaryCta: {
      label: "Consulter les disponibilités",
      href: "/fr/tarifs-des-hotels-a-chios/",
    },
    aiCta: {
      label: "Trouver une chambre avec l’IA",
      href: "/ai-assistant/?lang=fr",
    },
  },
  highlights: [
    { label: "Quartier", value: "Kambos historique" },
    { label: "Aéroport", value: "3 km" },
    { label: "Port de Chios", value: "6 km" },
    { label: "Choix", value: "Chambres & appartements" },
    { label: "Idéal pour", value: "Couples & familles" },
    { label: "Ambiance", value: "Jardin & agrumes" },
  ],
  intro: {
    kicker: "UN SÉJOUR PLUS PERSONNEL",
    title: "Une adresse paisible et authentique pour votre séjour à Chios",
    paragraphs: [
      "Choisir son hébergement à Chios ne consiste pas seulement à trouver une chambre pour la nuit. Le quartier où vous séjournez influence le rythme des vacances, les trajets quotidiens et la manière dont vous découvrez l’île. Voulamandis House se trouve à Kambos, une zone résidentielle historique faite de hauts murs de pierre, d’anciennes demeures et de jardins d’agrumes, à quelques minutes de Chios-ville.",
      "Voulamandis House est une petite maison d’hôtes familiale, et non un grand complexe hôtelier. Elle propose des chambres doubles économiques, des chambres au rez-de-chaussée, des chambres à l’étage et des appartements familiaux. Vous pouvez ainsi choisir selon votre budget, le nombre de voyageurs, l’étage souhaité, la facilité d’accès et le besoin d’une cuisine ou d’un espace de vie supplémentaire.",
      "L’accueil est volontairement simple et direct. Vous échangez avec des personnes qui connaissent réellement les chambres, leur disposition et l’île. Avant de réserver, vous pouvez demander quelle catégorie correspond le mieux à votre séjour, vérifier les disponibilités, organiser le petit-déjeuner sur demande et obtenir des suggestions locales pour les plages, villages, musées et itinéraires de Chios.",
    ],
    factsTitle: "Voulamandis House en un coup d’œil",
    facts: [
      "Chambres et appartements familiaux à Kambos, Chios",
      "Choix économique, rez-de-chaussée ou premier étage",
      "Appartements familiaux avec cuisine complète et espace salon",
      "Wi-Fi gratuit, climatisation, salle de bains privée, télévision et réfrigérateur",
      "Jardin, terrasses et stationnement disponibles pour les hôtes",
      "Petit-déjeuner dans le jardin sur demande",
      "Contact direct par téléphone, WhatsApp ou e-mail",
    ],
  },
  rooms: {
    kicker: "CHAMBRES ET APPARTEMENTS",
    title: "Choisissez l’hébergement à Chios qui correspond à votre voyage",
    description:
      "Les catégories sont présentées selon l’espace, l’étage, l’accès et les équipements afin de faciliter la comparaison avant de consulter les disponibilités. Les pages des chambres présentent davantage de photos et de détails.",
    cards: [
      {
        id: "economy-double",
        eyebrow: "OPTION ÉCONOMIQUE POUR DEUX",
        title: "Chambres doubles économiques",
        description:
          "Une solution pratique pour deux personnes qui souhaitent un point de départ confortable à Kambos dans la catégorie la plus accessible. Les chambres rénovées mesurent environ 16 m² et comprennent la climatisation, le Wi-Fi, une salle de bains privée, une télévision et un réfrigérateur.",
        href: "/fr/chambres-a-chios/chambres-doubles-economiques/",
        image: "/images/rooms/received_1753964631359257.webp",
        imageAlt:
          "Chambre double économique au Voulamandis House à Chios",
        facts: ["2 personnes", "Environ 16 m²", "Lit double", "Option économique"],
      },
      {
        id: "ground-floor",
        eyebrow: "ACCÈS FACILE ET JARDIN",
        title: "Chambres doubles et triples au rez-de-chaussée",
        description:
          "Elles conviennent aux couples, aux amis ou aux petites familles qui préfèrent éviter les escaliers et profiter d’un accès direct vers la cour et le jardin. Selon la chambre, elles peuvent accueillir deux ou trois personnes.",
        href: "/fr/chambres-a-chios/chambres-doubles-standard/",
        image: "/images/rooms/double-triple-room.jpg",
        imageAlt:
          "Chambre au rez-de-chaussée avec accès au jardin au Voulamandis House",
        facts: ["2–3 personnes", "Sans escaliers", "Accès jardin", "Réfrigérateur & climatisation"],
      },
      {
        id: "first-floor",
        eyebrow: "LUMIÈRE, TERRASSE ET VUE",
        title: "Chambres doubles et triples à l’étage",
        description:
          "Une bonne option pour les voyageurs qui apprécient une chambre lumineuse à l’étage et l’accès à la terrasse commune donnant sur le domaine d’agrumes. Certaines chambres disposent également d’une petite kitchenette.",
        href: "/fr/chambres-a-chios/chambres-doubles-standard/",
        image: "/images/rooms/DSC07776-2-e1675109942622.webp",
        imageAlt:
          "Chambre à l’étage avec vue sur les jardins d’agrumes de Kambos",
        facts: ["2–4 personnes", "À l’étage", "Terrasse commune", "Certaines avec kitchenette"],
      },
      {
        id: "family-apartments",
        eyebrow: "DAVANTAGE D’ESPACE EN FAMILLE",
        title: "Appartements familiaux à Chios",
        description:
          "Les appartements de 40 à 45 m² sont les hébergements les plus spacieux du Voulamandis House. Une chambre séparée, un espace salon et une cuisine complète offrent aux familles ou petits groupes davantage de confort et d’autonomie pendant plusieurs nuits.",
        href: "/fr/chambres-a-chios/appartements-familiaux-de-chios/",
        image: "/images/rooms/chios-apartments-voulamandis.webp",
        imageAlt:
          "Appartement familial avec cuisine au Voulamandis House à Chios",
        facts: ["Jusqu’à 4 personnes", "40–45 m²", "Cuisine complète", "Espace salon"],
      },
    ],
  },
  location: {
    kicker: "POURQUOI SÉJOURNER À KAMBOS",
    title: "Un hébergement calme près de Chios-ville et de l’aéroport",
    paragraphs: [
      "Kambos — également écrit Kampos — est l’un des quartiers les plus caractéristiques de Chios. Derrière de hauts murs de pierre se cachent des jardins d’agrumes, des cours, des puits et d’anciennes demeures. Séjourner ici offre une atmosphère différente de celle d’une rue animée du centre-ville ou d’une station balnéaire isolée.",
      "Voulamandis House associe ce cadre particulier à une situation pratique. L’aéroport de Chios se trouve à environ 3 km et le port à environ 6 km. Chios-ville, ses restaurants, ses commerces, son front de mer et ses liaisons maritimes sont rapidement accessibles, tandis que les routes de Kambos conduisent facilement vers les plages du sud et les villages médiévaux du mastic.",
      "Cette localisation convient particulièrement aux voyageurs qui souhaitent explorer plusieurs régions de l’île. Vous pouvez commencer la matinée dans le jardin, passer la journée sur une plage ou dans un village, puis retrouver un environnement plus paisible en soirée.",
    ],
    image: "/images/beaches/voulamandis-house-courtyard-chios.webp",
    imageAlt:
      "Cour et jardin du Voulamandis House à Kambos sur l’île de Chios",
    distances: [
      {
        label: "Aéroport de Chios",
        value: "3 km",
        note: "Pratique pour les arrivées en avion et les courts séjours.",
      },
      {
        label: "Port de Chios",
        value: "6 km",
        note: "Accès facile aux ferries et au centre de Chios-ville.",
      },
      {
        label: "Plage proche",
        value: "1,5 km",
        note: "Une option rapide avant de partir explorer d’autres côtes.",
      },
    ],
    mapCta: {
      label: "Voir Voulamandis House sur Google Maps",
      href: "https://www.google.com/maps/search/?api=1&query=Voulamandis+House+Chios",
    },
    guideCta: {
      label: "Découvrir Kambos à Chios",
      href: "/fr/chios/kampos-chios/",
    },
  },
  reasons: {
    kicker: "CE QUE LE SÉJOUR OFFRE",
    title: "Un confort pratique sans perdre le caractère de Kambos",
    description:
      "Voulamandis House réunit le cadre historique de Kambos, les équipements utiles au quotidien et un accueil local direct. L’adresse convient aux voyageurs qui recherchent le calme, la simplicité et une base authentique pour découvrir Chios.",
    items: [
      {
        icon: "🌿",
        title: "Jardin et atmosphère d’agrumes",
        text: "La verdure, la cour et l’environnement historique de Kambos offrent un espace agréable avant ou après une journée de découverte sur l’île.",
      },
      {
        icon: "🛏️",
        title: "Plusieurs configurations de chambres",
        text: "Choisissez une catégorie économique, un accès au rez-de-chaussée, une chambre à l’étage avec terrasse ou un appartement familial plus spacieux.",
      },
      {
        icon: "❄️",
        title: "Les équipements essentiels",
        text: "Wi-Fi, climatisation, salle de bains privée, télévision et réfrigérateur sont disponibles, avec une cuisine dans certaines chambres et les appartements.",
      },
      {
        icon: "🥐",
        title: "Petit-déjeuner sur demande",
        text: "Les hôtes peuvent demander le petit-déjeuner et le prendre dans le jardin pour commencer la journée de façon simple et agréable.",
      },
      {
        icon: "🚗",
        title: "Stationnement et situation pratique",
        text: "Un espace de stationnement est disponible et la localisation facilite les trajets vers Chios-ville, les plages et les villages du sud.",
      },
      {
        icon: "💬",
        title: "Aide directe pour choisir la chambre",
        text: "Les questions sur l’étage, les lits, la capacité, la cuisine ou la meilleure option pour vos dates peuvent recevoir une réponse avant la réservation.",
      },
    ],
  },
  travelerTypes: {
    kicker: "À QUI CET HÉBERGEMENT CONVIENT",
    title: "Une base flexible pour différents séjours à Chios",
    items: [
      {
        title: "Couples en quête de tranquillité",
        text: "Les chambres doubles économiques et standard offrent un point de départ calme aux couples qui souhaitent explorer l’île et retrouver un cadre paisible le soir.",
      },
      {
        title: "Familles ayant besoin d’espace",
        text: "Les appartements familiaux disposent d’une chambre, d’un salon et d’une cuisine complète. Certaines chambres triples peuvent aussi convenir à une petite famille pour un séjour plus court.",
      },
      {
        title: "Voyageurs qui explorent l’île",
        text: "La proximité de Chios-ville et des routes du sud convient aux personnes qui prévoient une plage, un village ou un musée différent chaque jour.",
      },
      {
        title: "Arrivées en avion ou en ferry",
        text: "La situation à environ 3 km de l’aéroport et 6 km du port réduit les trajets inutiles au début et à la fin du séjour.",
      },
    ],
  },
  directBooking: {
    kicker: "DISPONIBILITÉS EN DIRECT",
    title: "Vérifiez la bonne chambre avant de réserver",
    paragraphs: [
      "Une réservation directe doit rendre le choix plus clair. Les pages de réservation du Voulamandis House présentent les catégories et les disponibilités actuelles, tandis que l’assistant IA peut filtrer les options selon vos dates et le nombre de voyageurs.",
      "Comme les chambres diffèrent par étage, capacité et équipements de cuisine, un échange direct peut être utile. Vous pouvez confirmer le besoin d’un rez-de-chaussée, d’un appartement familial, d’une configuration de lits précise ou de l’option la plus économique disponible.",
    ],
    benefits: [
      "Disponibilités actuelles et tarifs directs",
      "Aide pour adapter la chambre aux voyageurs",
      "Communication directe avec Voulamandis House",
      "Accès à toute offre directe disponible pour vos dates",
    ],
    primaryCta: {
      label: "Voir les tarifs directs",
      href: "/fr/tarifs-des-hotels-a-chios/",
    },
    secondaryCta: {
      label: "Utiliser l’assistant IA",
      href: "/ai-assistant/?lang=fr",
    },
    whatsappCta: {
      label: "Demander sur WhatsApp",
      href: "https://wa.me/306944474226",
    },
  },
  explore: {
    kicker: "PRÉPARER LE RESTE DU SÉJOUR",
    title: "Utilisez Kambos comme point de départ pour découvrir Chios",
    description:
      "Chios se découvre en parcourant plusieurs régions. Ces guides vous aident à organiser des journées entre plages, villages, histoire locale et paysages proches de votre hébergement.",
    links: [
      {
        title: "Découvrir l’île de Chios",
        text: "Commencez par le guide principal et sélectionnez les expériences qui correspondent à votre voyage.",
        href: "/fr/chios-en-grece/",
      },
      {
        title: "Explorer les plages de Chios",
        text: "Comparez plages aménagées, criques tranquilles, choix familiaux et côtes volcaniques du sud.",
        href: "/fr/plages-de-chios/",
      },
      {
        title: "Visiter les villages de Chios",
        text: "Préparez des itinéraires entre villages médiévaux du mastic, localités côtières et communautés de montagne.",
        href: "/fr/villages-de-chios/",
      },
      {
        title: "Mieux connaître Kambos",
        text: "Découvrez les jardins d’agrumes, les demeures et le paysage de murs en pierre autour du Voulamandis House.",
        href: "/fr/chios/kampos-chios/",
      },
    ],
  },
  faq: {
    kicker: "QUESTIONS FRÉQUENTES",
    title: "Ce qu’il faut savoir avant de choisir votre hébergement à Chios",
    items: [
      {
        question: "Voulamandis House est-il un hôtel ?",
        answer:
          "Voulamandis House est une maison d’hôtes familiale proposant des chambres et des appartements à Kambos, Chios. Il s’agit d’une alternative plus petite et personnelle à un grand hôtel ou complexe touristique.",
      },
      {
        question: "Où se trouve Voulamandis House ?",
        answer:
          "L’établissement se trouve au 117 Dimarchou Kalvokoressi, à Kambos, Chios. Kambos est le quartier historique des domaines d’agrumes, près de Chios-ville et de l’aéroport.",
      },
      {
        question: "À quelle distance se trouvent l’aéroport et le port ?",
        answer:
          "Voulamandis House est situé à environ 3 km de l’aéroport de Chios et à 6 km du port, ce qui facilite les arrivées en avion comme en ferry.",
      },
      {
        question: "Quel hébergement choisir pour une famille ?",
        answer:
          "Les appartements familiaux sont les plus spacieux, avec une capacité maximale de quatre personnes, une chambre séparée, un salon et une cuisine complète. Certaines chambres standard peuvent également accueillir trois ou quatre personnes selon la chambre.",
      },
      {
        question: "Existe-t-il des chambres au rez-de-chaussée sans escaliers ?",
        answer:
          "Oui. Voulamandis House dispose de chambres économiques et standard au rez-de-chaussée. Les pages des chambres et l’assistant indiquent les options sans escaliers avec accès vers la cour ou le jardin.",
      },
      {
        question: "Les chambres disposent-elles d’une cuisine ?",
        answer:
          "Les appartements familiaux possèdent une cuisine complète et certaines chambres à l’étage une kitchenette. Tous les hébergements comprennent un réfrigérateur.",
      },
      {
        question: "Le petit-déjeuner est-il disponible ?",
        answer:
          "Le petit-déjeuner est disponible sur demande et peut être pris dans le jardin. Contactez l’établissement ou consultez les informations actuelles du séjour pour les détails.",
      },
      {
        question: "Comment vérifier les disponibilités en direct ?",
        answer:
          "Utilisez la page des tarifs directs, l’assistant IA ou contactez Voulamandis House par WhatsApp, téléphone ou e-mail en indiquant vos dates et le nombre de personnes.",
      },
    ],
  },
  finalCta: {
    kicker: "VOTRE SÉJOUR À CHIOS COMMENCE ICI",
    title: "Trouvez une chambre ou un appartement paisible à Kambos",
    text: "Comparez les catégories, indiquez vos dates de voyage et choisissez l’hébergement adapté au nombre de personnes, à l’étage souhaité et au besoin d’une cuisine.",
    primaryCta: {
      label: "Voir les disponibilités",
      href: "/fr/tarifs-des-hotels-a-chios/",
    },
    secondaryCta: {
      label: "Explorer toutes les chambres",
      href: "/fr/chambres-a-chios/",
    },
  },
};
