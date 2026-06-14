import { type LanguageCode, normalizePath } from "@/lib/languages";

export type FamilyTravelImage = {
  src: string;
  alt: string;
};

export type FamilyTravelCta = {
  label: string;
  href: string;
};

export type FamilyTravelCard = {
  title: string;
  text: string;
  image: FamilyTravelImage;
  href?: string;
};

export type FamilyTravelStoryStep = {
  title: string;
  text: string;
};

export type FamilyTravelPageContent = {
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
    image: FamilyTravelImage;
    primaryCta: FamilyTravelCta;
    secondaryCta: FamilyTravelCta;
  };
  intro: {
    title: string;
    text: string;
  };
  cardsTitle: string;
  cardsIntro: string;
  cards: FamilyTravelCard[];
  familyDay: {
    eyebrow: string;
    title: string;
    intro: string;
    steps: FamilyTravelStoryStep[];
  };
  stay: {
    eyebrow: string;
    title: string;
    text: string;
    image: FamilyTravelImage;
    primaryCta: FamilyTravelCta;
    secondaryCta: FamilyTravelCta;
  };
  finalCta: {
    title: string;
    text: string;
    primaryCta: FamilyTravelCta;
    secondaryCta: FamilyTravelCta;
  };
};

const familyTravelImages = {
  hero: {
    src: "/images/family/ChatGPT-Image-Feb-13-2026-08_32_22-PM.webp",
    alt: "Family holidays in Chios with children enjoying a sunny island day",
  },
  garden: {
    src: "/images/activities/chios.hotels.voulamandis.house_.hero_.image_.webp",
    alt: "The peaceful garden of Voulamandis House in Kampos Chios",
  },
  sandyBeach: {
    src: "/images/beaches/42ba5ae2ff96d99dfb12b1e06fa90b45-e1703437426681.webp",
    alt: "Komi sandy beach in Chios, ideal for relaxed family beach days",
  },
  museum: {
    src: "/images/family/moysio-mastixas-1-Copy.webp",
    alt: "The Chios Mastic Museum, a family friendly cultural stop in Chios",
  },
  koraisLibrary: {
    src: "/images/museums/vivlitothiki-korai-1.webp",
    alt: "Korais Library in Chios, a cultural visit for families",
  },
  playground: {
    src: "/images/family/paidiki_xara_daskalopetras_210222_2-v2.webp",
    alt: "Daskalopetra playground in Chios for children and families",
  },
  childrenActivity: {
    src: "/images/family/farkaina01.jpg",
    alt: "Simple outdoor activities for children in Chios",
  },
  paintball: {
    src: "/images/family/paintball-chios.jpg",
    alt: "Outdoor paintball activity in Chios for older children and families",
  },
  pizza: {
    src: "/images/family/The-Pastards-Handmade-pasta-with-cheese-restaurant-chios-3.jpg",
    alt: "Family friendly food stop in Chios with pasta and simple meals",
  },
};

const localizedLinks: Record<
  LanguageCode,
  {
    booking: string;
    rooms: string;
    beaches: string;
    komi: string;
    museums: string;
    masticMuseum: string;
    koraisLibrary: string;
    villages: string;
  }
> = {
  en: {
    booking: "/chios-hotels-rates/",
    rooms: "/chios-rooms/",
    beaches: "/chios/chios-beaches/",
    komi: "/chios/chios-beaches/komi-beach/",
    museums: "/chios/chios-museums/",
    masticMuseum: "/chios/chios-museums/the-mastic-museum-chios/",
    koraisLibrary: "/chios/chios-museums/koraes-library-chios/",
    villages: "/chios/chios-villages/",
  },
  el: {
    booking: "/el/amesi-kratisi-voulamandis-house/",
    rooms: "/el/domatia-xios/",
    beaches: "/el/paralies-xios/",
    komi: "/el/paralies-xios/paralia-komi/",
    museums: "/el/mouseia-xios/",
    masticMuseum: "/el/mouseia-xios/mouseio-mastichas-xios/",
    koraisLibrary: "/el/mouseia-xios/vivliothiki-korai-xios/",
    villages: "/el/xoria-xios/",
  },
  fr: {
    booking: "/fr/tarifs-des-hotels-a-chios/",
    rooms: "/fr/chambres-a-chios/",
    beaches: "/fr/plages-de-chios/",
    komi: "/fr/plages-de-chios/plage-komi/",
    museums: "/fr/musees-de-chios/",
    masticMuseum: "/fr/musees-de-chios/musee-du-mastic-chios/",
    koraisLibrary: "/fr/musees-de-chios/bibliotheque-korais-chios/",
    villages: "/fr/villages-de-chios/",
  },
  de: {
    booking: "/de/hotelpreise-auf-der-insel-chios/",
    rooms: "/de/chios-zimmer/",
    beaches: "/de/straende-chios/",
    komi: "/de/straende-chios/komi-strand/",
    museums: "/de/museen-chios/",
    masticMuseum: "/de/museen-chios/mastix-museum-chios/",
    koraisLibrary: "/de/museen-chios/korais-bibliothek-chios/",
    villages: "/de/doerfer-chios/",
  },
  it: {
    booking: "/it/prezzi-hotel-chios/",
    rooms: "/it/camere-a-chios/",
    beaches: "/it/spiagge-chios/",
    komi: "/it/spiagge-chios/spiaggia-komi/",
    museums: "/it/musei-chios/",
    masticMuseum: "/it/musei-chios/museo-del-mastice-chios/",
    koraisLibrary: "/it/musei-chios/biblioteca-korais-chios/",
    villages: "/it/villaggi-chios/",
  },
  es: {
    booking: "/es/los-mejores-precios-de-hotel-en-la-isla-chios/",
    rooms: "/es/habitaciones-en-chios/",
    beaches: "/es/playas-chios/",
    komi: "/es/playas-chios/playa-komi/",
    museums: "/es/museos-chios/",
    masticMuseum: "/es/museos-chios/museo-mastiha-chios/",
    koraisLibrary: "/es/museos-chios/biblioteca-korais-chios/",
    villages: "/es/pueblos-chios/",
  },
  tr: {
    booking: "/tr/sakiz-adasi-rezervasyon/",
    rooms: "/tr/sakiz-adasi-odalari/",
    beaches: "/tr/sakiz-adasi-plajlari/",
    komi: "/tr/sakiz-adasi-plajlari/komi-plaji/",
    museums: "/tr/sakiz-adasi-muzeleri/",
    masticMuseum: "/tr/sakiz-adasi-muzeleri/sakiz-mastik-muzesi/",
    koraisLibrary: "/tr/sakiz-adasi-muzeleri/korais-kutuphanesi-sakiz/",
    villages: "/tr/sakiz-adasi-koyleri/",
  },
};

export const familyTravelPages = {
  en: {
    locale: "en",
    path: "/family-travel-in-chios/",
    seo: {
      title: "Family Travel in Chios | Stay at Voulamandis House",
      description:
        "Plan a relaxed family holiday in Chios with beaches, museums, villages, playgrounds and a peaceful stay at Voulamandis House in Kampos.",
    },
    hero: {
      eyebrow: "Family holidays in Chios",
      title: "A relaxed island stay for families who want more than just a room",
      subtitle:
        "Stay in peaceful Kampos, enjoy easy days by the sea, discover museums and villages, and return to the garden of Voulamandis House at the end of every family adventure.",
      image: familyTravelImages.hero,
      primaryCta: {
        label: "Book your family stay",
        href: localizedLinks.en.booking,
      },
      secondaryCta: {
        label: "Explore our rooms",
        href: localizedLinks.en.rooms,
      },
    },
    intro: {
      title: "Why Chios works so well for families",
      text:
        "Chios is calm, authentic and easy to explore at your own pace. Families can combine safe beach time, short cultural visits, traditional villages, simple food stops and quiet evenings without feeling rushed. Voulamandis House gives you a peaceful base close to Chios Town, Kampos and many of the island’s best family experiences.",
    },
    cardsTitle: "Easy family experiences around Chios",
    cardsIntro:
      "From sandy beaches and playgrounds to museums and village walks, every day can feel different while still staying simple for children and parents.",
    cards: [
      {
        title: "Sandy beaches for easy family days",
        text:
          "Spend relaxed time by the sea at beaches such as Komi, where children can play and parents can enjoy a slow island day.",
        image: familyTravelImages.sandyBeach,
        href: localizedLinks.en.komi,
      },
      {
        title: "Mastic Museum",
        text:
          "Introduce children to the story of Chios mastic through displays, local tradition and an experience that is interesting for the whole family.",
        image: familyTravelImages.museum,
        href: localizedLinks.en.masticMuseum,
      },
      {
        title: "Korais Library",
        text:
          "Visit one of the island’s most important cultural places and add a calm, educational stop to your family itinerary.",
        image: familyTravelImages.koraisLibrary,
        href: localizedLinks.en.koraisLibrary,
      },
      {
        title: "Playgrounds and simple family stops",
        text:
          "Add easy breaks to your day with playgrounds, seaside walks and places where children can move, play and reset.",
        image: familyTravelImages.playground,
      },
      {
        title: "Outdoor activities for older children",
        text:
          "For families with older children, Chios also offers more active experiences that can make the holiday feel adventurous.",
        image: familyTravelImages.paintball,
      },
      {
        title: "Easy family food stops",
        text:
          "Keep lunch simple with relaxed food stops, local flavours and familiar dishes that children can enjoy without stress.",
        image: familyTravelImages.pizza,
      },
    ],
    familyDay: {
      eyebrow: "Suggested family itinerary",
      title: "Your perfect family day in Chios with Voulamandis House",
      intro:
        "A family holiday in Chios does not need to be complicated. Start slowly, choose one or two experiences, leave space for the beach, and come back to a peaceful garden at the end of the day.",
      steps: [
        {
          title: "Morning in Kampos",
          text:
            "Begin your morning with a gentle walk through the beautiful Kampos area, where Voulamandis House is located. Stroll among citrus orchards, stone walls and elegant mansions while children explore nature and parents enjoy the calm atmosphere of Chios.",
        },
        {
          title: "Breakfast and a cultural stop",
          text:
            "After a homemade, healthy breakfast at Voulamandis House, start with a visit to one of Chios’ cultural highlights, such as Korais Library or the Chios Mastic Museum.",
        },
        {
          title: "Beach time",
          text:
            "Later, enjoy a family-friendly beach with clear water, sand or smooth pebbles and relaxed swimming conditions. It is the perfect moment for children to play while parents unwind by the sea.",
        },
        {
          title: "Lunch and village exploring",
          text:
            "For lunch, stop at a traditional village taverna or an easy family food spot. In the afternoon, explore a village such as Mesta or Pyrgi, with stone alleys, small squares and hidden corners.",
        },
        {
          title: "Back to the garden",
          text:
            "As the day winds down, return to Voulamandis House. Relax in the garden under the vine while children play and adults enjoy a peaceful evening after a day full of shared memories.",
        },
      ],
    },
    stay: {
      eyebrow: "Stay in Kampos",
      title: "A peaceful family base at Voulamandis House",
      text:
        "Voulamandis House gives families space to slow down. The garden, the calm Kampos setting and the easy access to Chios Town, beaches, villages and museums make it a practical and welcoming base for parents and children.",
      image: familyTravelImages.garden,
      primaryCta: {
        label: "Book your stay",
        href: localizedLinks.en.booking,
      },
      secondaryCta: {
        label: "See rooms",
        href: localizedLinks.en.rooms,
      },
    },
    finalCta: {
      title: "Start planning your family holiday in Chios",
      text:
        "From Voulamandis House, families can easily explore beaches, villages, museums, playgrounds and authentic experiences across Chios.",
      primaryCta: {
        label: "Book direct",
        href: localizedLinks.en.booking,
      },
      secondaryCta: {
        label: "Explore Chios beaches",
        href: localizedLinks.en.beaches,
      },
    },
  },

  el: {
    locale: "el",
    path: "/el/oikogeneiakes-diakopes-sti-xio/",
    seo: {
      title: "Οικογενειακές Διακοπές στη Χίο | Voulamandis House",
      description:
        "Οργανώστε ήρεμες οικογενειακές διακοπές στη Χίο με παραλίες, μουσεία, χωριά, παιδικές στάσεις και διαμονή στο Voulamandis House στον Κάμπο.",
    },
    hero: {
      eyebrow: "Οικογενειακές διακοπές στη Χίο",
      title: "Μια ήρεμη διαμονή για οικογένειες που θέλουν κάτι περισσότερο από ένα δωμάτιο",
      subtitle:
        "Μείνετε στον ήσυχο Κάμπο, απολαύστε εύκολες μέρες κοντά στη θάλασσα, ανακαλύψτε μουσεία και χωριά και επιστρέψτε κάθε απόγευμα στον κήπο του Voulamandis House.",
      image: familyTravelImages.hero,
      primaryCta: {
        label: "Κλείστε οικογενειακή διαμονή",
        href: localizedLinks.el.booking,
      },
      secondaryCta: {
        label: "Δείτε τα δωμάτια",
        href: localizedLinks.el.rooms,
      },
    },
    intro: {
      title: "Γιατί η Χίος ταιριάζει τόσο καλά στις οικογένειες",
      text:
        "Η Χίος είναι ήρεμη, αυθεντική και εύκολη στην εξερεύνηση. Οι οικογένειες μπορούν να συνδυάσουν παραλίες, σύντομες πολιτιστικές επισκέψεις, παραδοσιακά χωριά, απλό φαγητό και χαλαρά βράδια χωρίς πίεση.",
    },
    cardsTitle: "Εύκολες οικογενειακές εμπειρίες στη Χίο",
    cardsIntro:
      "Από αμμώδεις παραλίες και παιδικές χαρές μέχρι μουσεία και βόλτες σε χωριά, κάθε μέρα μπορεί να είναι διαφορετική και ταυτόχρονα εύκολη.",
    cards: [
      {
        title: "Αμμώδεις παραλίες για οικογενειακές μέρες",
        text:
          "Περάστε χαλαρές ώρες δίπλα στη θάλασσα σε παραλίες όπως η Κώμη, όπου τα παιδιά μπορούν να παίξουν και οι γονείς να ξεκουραστούν.",
        image: familyTravelImages.sandyBeach,
        href: localizedLinks.el.komi,
      },
      {
        title: "Μουσείο Μαστίχας",
        text:
          "Γνωρίστε στα παιδιά την ιστορία της χιώτικης μαστίχας μέσα από μια ενδιαφέρουσα και εύκολη επίσκεψη για όλη την οικογένεια.",
        image: familyTravelImages.museum,
        href: localizedLinks.el.masticMuseum,
      },
      {
        title: "Βιβλιοθήκη Κοραή",
        text:
          "Επισκεφθείτε έναν από τους σημαντικούς πολιτιστικούς χώρους της Χίου και προσθέστε μια ήρεμη εκπαιδευτική στάση στο πρόγραμμα.",
        image: familyTravelImages.koraisLibrary,
        href: localizedLinks.el.koraisLibrary,
      },
      {
        title: "Παιδικές χαρές και εύκολες στάσεις",
        text:
          "Βάλτε στο πρόγραμμα μικρά διαλείμματα με παιδικές χαρές, βόλτες κοντά στη θάλασσα και σημεία όπου τα παιδιά μπορούν να παίξουν.",
        image: familyTravelImages.playground,
      },
      {
        title: "Δραστηριότητες για μεγαλύτερα παιδιά",
        text:
          "Για οικογένειες με μεγαλύτερα παιδιά, η Χίος προσφέρει και πιο ενεργές εμπειρίες που κάνουν τις διακοπές πιο περιπετειώδεις.",
        image: familyTravelImages.paintball,
      },
      {
        title: "Εύκολες στάσεις για φαγητό",
        text:
          "Κρατήστε το φαγητό απλό με χαλαρές επιλογές, τοπικές γεύσεις και πιάτα που αρέσουν εύκολα στα παιδιά.",
        image: familyTravelImages.pizza,
      },
    ],
    familyDay: {
      eyebrow: "Προτεινόμενη οικογενειακή μέρα",
      title: "Η ιδανική οικογενειακή μέρα στη Χίο με βάση το Voulamandis House",
      intro:
        "Οι οικογενειακές διακοπές στη Χίο δεν χρειάζεται να είναι περίπλοκες. Ξεκινήστε αργά, διαλέξτε μία ή δύο εμπειρίες, αφήστε χρόνο για παραλία και επιστρέψτε σε έναν ήρεμο κήπο.",
      steps: [
        {
          title: "Πρωινό στον Κάμπο",
          text:
            "Ξεκινήστε τη μέρα με έναν ήπιο περίπατο στον Κάμπο, ανάμεσα σε περιβόλια, πέτρινους τοίχους και αρχοντικά, ενώ τα παιδιά ανακαλύπτουν τη φύση.",
        },
        {
          title: "Πρωινό και πολιτιστική επίσκεψη",
          text:
            "Μετά από ένα σπιτικό πρωινό στο Voulamandis House, επισκεφθείτε τη Βιβλιοθήκη Κοραή ή το Μουσείο Μαστίχας.",
        },
        {
          title: "Ώρα για παραλία",
          text:
            "Συνεχίστε με μια οικογενειακή παραλία με καθαρά νερά και χαλαρή ατμόσφαιρα, ιδανική για παιχνίδι και ξεκούραση.",
        },
        {
          title: "Φαγητό και χωριά",
          text:
            "Για μεσημεριανό, κάντε στάση σε ταβέρνα ή σε εύκολο οικογενειακό σημείο για φαγητό. Το απόγευμα εξερευνήστε χωριά όπως τα Μεστά ή το Πυργί.",
        },
        {
          title: "Επιστροφή στον κήπο",
          text:
            "Καθώς η μέρα τελειώνει, επιστρέψτε στο Voulamandis House για χαλάρωση στον κήπο, παιχνίδι για τα παιδιά και ήρεμο βράδυ για τους γονείς.",
        },
      ],
    },
    stay: {
      eyebrow: "Διαμονή στον Κάμπο",
      title: "Μια ήρεμη οικογενειακή βάση στο Voulamandis House",
      text:
        "Το Voulamandis House δίνει στις οικογένειες χώρο να χαλαρώσουν. Ο κήπος, η ηρεμία του Κάμπου και η εύκολη πρόσβαση σε πόλη, παραλίες, χωριά και μουσεία το κάνουν ιδανική βάση.",
      image: familyTravelImages.garden,
      primaryCta: {
        label: "Κλείστε διαμονή",
        href: localizedLinks.el.booking,
      },
      secondaryCta: {
        label: "Δείτε δωμάτια",
        href: localizedLinks.el.rooms,
      },
    },
    finalCta: {
      title: "Ξεκινήστε να οργανώνετε τις οικογενειακές διακοπές σας στη Χίο",
      text:
        "Από το Voulamandis House, οι οικογένειες μπορούν εύκολα να ανακαλύψουν παραλίες, χωριά, μουσεία, παιδικές στάσεις και αυθεντικές εμπειρίες στη Χίο.",
      primaryCta: {
        label: "Κράτηση απευθείας",
        href: localizedLinks.el.booking,
      },
      secondaryCta: {
        label: "Δείτε παραλίες Χίου",
        href: localizedLinks.el.beaches,
      },
    },
  },

  fr: {
    locale: "fr",
    path: "/fr/vacances-en-famille-a-chios/",
    seo: {
      title: "Vacances en Famille à Chios | Voulamandis House",
      description:
        "Organisez des vacances en famille à Chios avec plages, musées, villages, activités simples et un séjour paisible à Voulamandis House.",
    },
    hero: {
      eyebrow: "Vacances en famille à Chios",
      title: "Un séjour paisible pour les familles qui veulent plus qu’une simple chambre",
      subtitle:
        "Séjournez dans le calme de Kampos, profitez des plages, découvrez musées et villages, puis retrouvez le jardin de Voulamandis House chaque soir.",
      image: familyTravelImages.hero,
      primaryCta: {
        label: "Réserver votre séjour",
        href: localizedLinks.fr.booking,
      },
      secondaryCta: {
        label: "Voir les chambres",
        href: localizedLinks.fr.rooms,
      },
    },
    intro: {
      title: "Pourquoi Chios est idéale pour les familles",
      text:
        "Chios est calme, authentique et facile à explorer. Les familles peuvent combiner plage, visites culturelles courtes, villages traditionnels, repas simples et soirées tranquilles.",
    },
    cardsTitle: "Expériences faciles en famille à Chios",
    cardsIntro:
      "Des plages de sable aux musées, des aires de jeux aux villages, chaque journée peut être différente tout en restant simple.",
    cards: [
      {
        title: "Plages de sable pour les familles",
        text:
          "Passez une journée détendue au bord de la mer, par exemple à Komi, avec du temps pour jouer, nager et se reposer.",
        image: familyTravelImages.sandyBeach,
        href: localizedLinks.fr.komi,
      },
      {
        title: "Musée du Mastic",
        text:
          "Faites découvrir aux enfants l’histoire du mastic de Chios à travers une visite intéressante et accessible.",
        image: familyTravelImages.museum,
        href: localizedLinks.fr.masticMuseum,
      },
      {
        title: "Bibliothèque Korais",
        text:
          "Ajoutez une visite culturelle calme et éducative à votre itinéraire familial.",
        image: familyTravelImages.koraisLibrary,
        href: localizedLinks.fr.koraisLibrary,
      },
      {
        title: "Aires de jeux et pauses simples",
        text:
          "Prévoyez des pauses faciles avec des aires de jeux, des promenades et des endroits où les enfants peuvent bouger.",
        image: familyTravelImages.playground,
      },
      {
        title: "Activités pour les plus grands",
        text:
          "Pour les familles avec des enfants plus âgés, Chios propose aussi des activités plus actives.",
        image: familyTravelImages.paintball,
      },
      {
        title: "Repas simples en famille",
        text:
          "Gardez les repas faciles avec des adresses détendues, des saveurs locales et des plats que les enfants apprécient.",
        image: familyTravelImages.pizza,
      },
    ],
    familyDay: {
      eyebrow: "Idée d’itinéraire familial",
      title: "Votre journée parfaite en famille à Chios avec Voulamandis House",
      intro:
        "Des vacances en famille à Chios peuvent rester simples: commencez doucement, choisissez une ou deux activités, gardez du temps pour la plage et rentrez au calme.",
      steps: [
        {
          title: "Matin à Kampos",
          text:
            "Commencez par une promenade douce dans Kampos, entre vergers d’agrumes, murs de pierre et anciennes demeures.",
        },
        {
          title: "Petit-déjeuner et visite culturelle",
          text:
            "Après un petit-déjeuner maison, visitez la Bibliothèque Korais ou le Musée du Mastic.",
        },
        {
          title: "Temps de plage",
          text:
            "Profitez ensuite d’une plage adaptée aux familles, avec une atmosphère détendue pour les enfants et les parents.",
        },
        {
          title: "Déjeuner et villages",
          text:
            "Pour le déjeuner, choisissez une taverne ou une adresse simple. L’après-midi, explorez un village comme Mesta ou Pyrgi.",
        },
        {
          title: "Retour au jardin",
          text:
            "En fin de journée, revenez à Voulamandis House pour profiter du jardin et d’une soirée paisible.",
        },
      ],
    },
    stay: {
      eyebrow: "Séjourner à Kampos",
      title: "Une base paisible pour les familles",
      text:
        "Voulamandis House offre aux familles un cadre calme, un jardin agréable et un accès facile à la ville de Chios, aux plages, aux villages et aux musées.",
      image: familyTravelImages.garden,
      primaryCta: {
        label: "Réserver",
        href: localizedLinks.fr.booking,
      },
      secondaryCta: {
        label: "Voir les chambres",
        href: localizedLinks.fr.rooms,
      },
    },
    finalCta: {
      title: "Commencez à organiser vos vacances en famille à Chios",
      text:
        "Depuis Voulamandis House, explorez facilement plages, villages, musées et expériences authentiques.",
      primaryCta: {
        label: "Réserver en direct",
        href: localizedLinks.fr.booking,
      },
      secondaryCta: {
        label: "Explorer les plages",
        href: localizedLinks.fr.beaches,
      },
    },
  },

  de: {
    locale: "de",
    path: "/de/familienurlaub-auf-chios/",
    seo: {
      title: "Familienurlaub auf Chios | Voulamandis House",
      description:
        "Planen Sie einen entspannten Familienurlaub auf Chios mit Stränden, Museen, Dörfern, einfachen Aktivitäten und einem ruhigen Aufenthalt im Voulamandis House.",
    },
    hero: {
      eyebrow: "Familienurlaub auf Chios",
      title: "Ein ruhiger Inselaufenthalt für Familien, die mehr als nur ein Zimmer suchen",
      subtitle:
        "Wohnen Sie im ruhigen Kampos, genießen Sie einfache Strandtage, entdecken Sie Museen und Dörfer und kehren Sie abends in den Garten des Voulamandis House zurück.",
      image: familyTravelImages.hero,
      primaryCta: {
        label: "Familienaufenthalt buchen",
        href: localizedLinks.de.booking,
      },
      secondaryCta: {
        label: "Zimmer ansehen",
        href: localizedLinks.de.rooms,
      },
    },
    intro: {
      title: "Warum Chios gut für Familien passt",
      text:
        "Chios ist ruhig, authentisch und leicht zu erkunden. Familien können Strand, Kultur, traditionelle Dörfer, einfache Mahlzeiten und entspannte Abende gut kombinieren.",
    },
    cardsTitle: "Einfache Familienerlebnisse auf Chios",
    cardsIntro:
      "Von Sandstränden und Spielplätzen bis zu Museen und Dorfspaziergängen kann jeder Tag anders und trotzdem entspannt sein.",
    cards: [
      {
        title: "Sandstrände für entspannte Familientage",
        text:
          "Verbringen Sie ruhige Zeit am Meer, zum Beispiel am Komi Beach, wo Kinder spielen und Eltern entspannen können.",
        image: familyTravelImages.sandyBeach,
        href: localizedLinks.de.komi,
      },
      {
        title: "Mastix-Museum",
        text:
          "Entdecken Sie mit Kindern die Geschichte des Chios-Mastix bei einem interessanten und familienfreundlichen Besuch.",
        image: familyTravelImages.museum,
        href: localizedLinks.de.masticMuseum,
      },
      {
        title: "Korais-Bibliothek",
        text:
          "Ergänzen Sie Ihre Reise um einen ruhigen kulturellen und lehrreichen Besuch.",
        image: familyTravelImages.koraisLibrary,
        href: localizedLinks.de.koraisLibrary,
      },
      {
        title: "Spielplätze und einfache Pausen",
        text:
          "Planen Sie kleine Pausen mit Spielplätzen, Spaziergängen am Meer und Orten, an denen Kinder sich bewegen können.",
        image: familyTravelImages.playground,
      },
      {
        title: "Aktivitäten für ältere Kinder",
        text:
          "Für Familien mit älteren Kindern bietet Chios auch aktivere Erlebnisse.",
        image: familyTravelImages.paintball,
      },
      {
        title: "Einfache Essensstopps",
        text:
          "Halten Sie das Mittagessen entspannt mit einfachen Gerichten, lokalen Aromen und kinderfreundlichen Optionen.",
        image: familyTravelImages.pizza,
      },
    ],
    familyDay: {
      eyebrow: "Vorschlag für einen Familientag",
      title: "Ihr perfekter Familientag auf Chios mit Voulamandis House",
      intro:
        "Ein Familienurlaub auf Chios muss nicht kompliziert sein. Starten Sie langsam, wählen Sie ein oder zwei Erlebnisse und lassen Sie Zeit für Strand und Erholung.",
      steps: [
        {
          title: "Morgen in Kampos",
          text:
            "Beginnen Sie mit einem Spaziergang durch Kampos, vorbei an Zitrusgärten, Steinmauern und alten Herrenhäusern.",
        },
        {
          title: "Frühstück und Kultur",
          text:
            "Nach einem hausgemachten Frühstück besuchen Sie die Korais-Bibliothek oder das Mastix-Museum.",
        },
        {
          title: "Zeit am Strand",
          text:
            "Genießen Sie danach einen familienfreundlichen Strand mit entspannter Atmosphäre.",
        },
        {
          title: "Mittagessen und Dörfer",
          text:
            "Zum Mittagessen eignet sich eine Taverne oder ein einfacher Familienort. Am Nachmittag entdecken Sie Dörfer wie Mesta oder Pyrgi.",
        },
        {
          title: "Zurück in den Garten",
          text:
            "Am Abend kehren Sie zum Voulamandis House zurück und entspannen im Garten.",
        },
      ],
    },
    stay: {
      eyebrow: "Aufenthalt in Kampos",
      title: "Eine ruhige Basis für Familien",
      text:
        "Voulamandis House bietet Familien Ruhe, Gartenatmosphäre und einfachen Zugang zu Chios-Stadt, Stränden, Dörfern und Museen.",
      image: familyTravelImages.garden,
      primaryCta: {
        label: "Aufenthalt buchen",
        href: localizedLinks.de.booking,
      },
      secondaryCta: {
        label: "Zimmer ansehen",
        href: localizedLinks.de.rooms,
      },
    },
    finalCta: {
      title: "Planen Sie Ihren Familienurlaub auf Chios",
      text:
        "Vom Voulamandis House aus erreichen Familien Strände, Dörfer, Museen und authentische Erlebnisse auf Chios.",
      primaryCta: {
        label: "Direkt buchen",
        href: localizedLinks.de.booking,
      },
      secondaryCta: {
        label: "Strände entdecken",
        href: localizedLinks.de.beaches,
      },
    },
  },

  it: {
    locale: "it",
    path: "/it/vacanze-in-famiglia-a-chios/",
    seo: {
      title: "Vacanze in Famiglia a Chios | Voulamandis House",
      description:
        "Organizza una vacanza in famiglia a Chios con spiagge, musei, villaggi, attività semplici e un soggiorno tranquillo a Voulamandis House.",
    },
    hero: {
      eyebrow: "Vacanze in famiglia a Chios",
      title: "Un soggiorno tranquillo per famiglie che cercano più di una camera",
      subtitle:
        "Soggiorna nel tranquillo Kampos, goditi giornate semplici al mare, scopri musei e villaggi e torna ogni sera nel giardino di Voulamandis House.",
      image: familyTravelImages.hero,
      primaryCta: {
        label: "Prenota il soggiorno",
        href: localizedLinks.it.booking,
      },
      secondaryCta: {
        label: "Scopri le camere",
        href: localizedLinks.it.rooms,
      },
    },
    intro: {
      title: "Perché Chios è adatta alle famiglie",
      text:
        "Chios è tranquilla, autentica e facile da esplorare. Le famiglie possono combinare mare, cultura, villaggi tradizionali, pasti semplici e serate rilassate.",
    },
    cardsTitle: "Esperienze facili per famiglie a Chios",
    cardsIntro:
      "Spiagge, musei, parchi giochi e passeggiate nei villaggi rendono ogni giornata diversa ma semplice.",
    cards: [
      {
        title: "Spiagge sabbiose per famiglie",
        text:
          "Trascorri una giornata rilassata al mare, ad esempio a Komi, con tempo per giocare e riposare.",
        image: familyTravelImages.sandyBeach,
        href: localizedLinks.it.komi,
      },
      {
        title: "Museo del Mastice",
        text:
          "Fai scoprire ai bambini la storia del mastice di Chios con una visita interessante e accessibile.",
        image: familyTravelImages.museum,
        href: localizedLinks.it.masticMuseum,
      },
      {
        title: "Biblioteca Korais",
        text:
          "Aggiungi una tappa culturale tranquilla ed educativa al tuo itinerario.",
        image: familyTravelImages.koraisLibrary,
        href: localizedLinks.it.koraisLibrary,
      },
      {
        title: "Parchi giochi e pause semplici",
        text:
          "Organizza piccole pause con parchi giochi, passeggiate e luoghi dove i bambini possono muoversi.",
        image: familyTravelImages.playground,
      },
      {
        title: "Attività per bambini più grandi",
        text:
          "Per le famiglie con bambini più grandi, Chios offre anche esperienze più attive.",
        image: familyTravelImages.paintball,
      },
      {
        title: "Soste facili per mangiare",
        text:
          "Mantieni i pasti semplici con indirizzi rilassati, sapori locali e piatti adatti ai bambini.",
        image: familyTravelImages.pizza,
      },
    ],
    familyDay: {
      eyebrow: "Itinerario familiare suggerito",
      title: "La tua giornata perfetta in famiglia a Chios con Voulamandis House",
      intro:
        "Una vacanza in famiglia a Chios può essere semplice: inizia con calma, scegli una o due esperienze e lascia spazio al mare.",
      steps: [
        {
          title: "Mattina a Kampos",
          text:
            "Inizia con una passeggiata a Kampos, tra agrumeti, muri in pietra e antiche dimore.",
        },
        {
          title: "Colazione e cultura",
          text:
            "Dopo una colazione fatta in casa, visita la Biblioteca Korais o il Museo del Mastice.",
        },
        {
          title: "Tempo al mare",
          text:
            "Goditi poi una spiaggia adatta alle famiglie, con atmosfera rilassata.",
        },
        {
          title: "Pranzo e villaggi",
          text:
            "Per pranzo scegli una taverna o una sosta semplice. Nel pomeriggio visita Mesta o Pyrgi.",
        },
        {
          title: "Ritorno in giardino",
          text:
            "A fine giornata torna a Voulamandis House per rilassarti nel giardino.",
        },
      ],
    },
    stay: {
      eyebrow: "Soggiorna a Kampos",
      title: "Una base tranquilla per famiglie",
      text:
        "Voulamandis House offre tranquillità, un giardino piacevole e facile accesso alla città, alle spiagge, ai villaggi e ai musei.",
      image: familyTravelImages.garden,
      primaryCta: {
        label: "Prenota",
        href: localizedLinks.it.booking,
      },
      secondaryCta: {
        label: "Vedi camere",
        href: localizedLinks.it.rooms,
      },
    },
    finalCta: {
      title: "Inizia a pianificare la tua vacanza in famiglia a Chios",
      text:
        "Da Voulamandis House puoi esplorare facilmente spiagge, villaggi, musei ed esperienze autentiche.",
      primaryCta: {
        label: "Prenota direttamente",
        href: localizedLinks.it.booking,
      },
      secondaryCta: {
        label: "Scopri le spiagge",
        href: localizedLinks.it.beaches,
      },
    },
  },

  es: {
    locale: "es",
    path: "/es/vacaciones-en-familia-en-quios/",
    seo: {
      title: "Vacaciones en Familia en Quíos | Voulamandis House",
      description:
        "Planifica unas vacaciones familiares en Quíos con playas, museos, pueblos, actividades sencillas y una estancia tranquila en Voulamandis House.",
    },
    hero: {
      eyebrow: "Vacaciones en familia en Quíos",
      title: "Una estancia tranquila para familias que buscan algo más que una habitación",
      subtitle:
        "Alójate en el tranquilo Kampos, disfruta de días fáciles junto al mar, descubre museos y pueblos y vuelve cada tarde al jardín de Voulamandis House.",
      image: familyTravelImages.hero,
      primaryCta: {
        label: "Reservar estancia familiar",
        href: localizedLinks.es.booking,
      },
      secondaryCta: {
        label: "Ver habitaciones",
        href: localizedLinks.es.rooms,
      },
    },
    intro: {
      title: "Por qué Quíos funciona tan bien para familias",
      text:
        "Quíos es tranquila, auténtica y fácil de explorar. Las familias pueden combinar playa, cultura, pueblos tradicionales, comidas sencillas y tardes relajadas.",
    },
    cardsTitle: "Experiencias fáciles para familias en Quíos",
    cardsIntro:
      "Playas, museos, parques infantiles y paseos por pueblos hacen que cada día sea diferente sin complicarlo.",
    cards: [
      {
        title: "Playas de arena para familias",
        text:
          "Disfruta de un día tranquilo junto al mar, por ejemplo en Komi, con tiempo para jugar y descansar.",
        image: familyTravelImages.sandyBeach,
        href: localizedLinks.es.komi,
      },
      {
        title: "Museo de la Mastiha",
        text:
          "Descubre con los niños la historia de la mastiha de Quíos en una visita interesante y fácil.",
        image: familyTravelImages.museum,
        href: localizedLinks.es.masticMuseum,
      },
      {
        title: "Biblioteca Korais",
        text:
          "Añade una parada cultural tranquila y educativa a tu itinerario familiar.",
        image: familyTravelImages.koraisLibrary,
        href: localizedLinks.es.koraisLibrary,
      },
      {
        title: "Parques infantiles y paradas sencillas",
        text:
          "Haz pequeñas pausas con parques infantiles, paseos y lugares donde los niños puedan moverse.",
        image: familyTravelImages.playground,
      },
      {
        title: "Actividades para niños mayores",
        text:
          "Para familias con niños mayores, Quíos también ofrece experiencias más activas.",
        image: familyTravelImages.paintball,
      },
      {
        title: "Comidas fáciles en familia",
        text:
          "Mantén las comidas simples con lugares relajados, sabores locales y platos que los niños disfrutan.",
        image: familyTravelImages.pizza,
      },
    ],
    familyDay: {
      eyebrow: "Itinerario familiar sugerido",
      title: "Tu día perfecto en familia en Quíos con Voulamandis House",
      intro:
        "Unas vacaciones familiares en Quíos pueden ser sencillas: empieza despacio, elige una o dos experiencias y deja tiempo para la playa.",
      steps: [
        {
          title: "Mañana en Kampos",
          text:
            "Comienza con un paseo suave por Kampos, entre cítricos, muros de piedra y antiguas mansiones.",
        },
        {
          title: "Desayuno y cultura",
          text:
            "Después de un desayuno casero, visita la Biblioteca Korais o el Museo de la Mastiha.",
        },
        {
          title: "Tiempo de playa",
          text:
            "Disfruta después de una playa familiar con ambiente relajado.",
        },
        {
          title: "Almuerzo y pueblos",
          text:
            "Para almorzar, elige una taberna o una parada sencilla. Por la tarde, explora Mesta o Pyrgi.",
        },
        {
          title: "Vuelta al jardín",
          text:
            "Al final del día, vuelve a Voulamandis House para relajarte en el jardín.",
        },
      ],
    },
    stay: {
      eyebrow: "Alojamiento en Kampos",
      title: "Una base tranquila para familias",
      text:
        "Voulamandis House ofrece calma, jardín y fácil acceso a la ciudad de Quíos, playas, pueblos y museos.",
      image: familyTravelImages.garden,
      primaryCta: {
        label: "Reservar",
        href: localizedLinks.es.booking,
      },
      secondaryCta: {
        label: "Ver habitaciones",
        href: localizedLinks.es.rooms,
      },
    },
    finalCta: {
      title: "Empieza a planificar tus vacaciones familiares en Quíos",
      text:
        "Desde Voulamandis House, las familias pueden explorar playas, pueblos, museos y experiencias auténticas.",
      primaryCta: {
        label: "Reservar directo",
        href: localizedLinks.es.booking,
      },
      secondaryCta: {
        label: "Explorar playas",
        href: localizedLinks.es.beaches,
      },
    },
  },

  tr: {
    locale: "tr",
    path: "/tr/sakiz-adasi-aile-tatili/",
    seo: {
      title: "Sakız Adası Aile Tatili | Voulamandis House",
      description:
        "Sakız Adası’nda plajlar, müzeler, köyler, çocuklara uygun aktiviteler ve Kampos’ta huzurlu bir konaklama ile aile tatilinizi planlayın.",
    },
    hero: {
      eyebrow: "Sakız Adası’nda aile tatili",
      title: "Sadece bir odadan fazlasını isteyen aileler için sakin bir ada konaklaması",
      subtitle:
        "Sakin Kampos bölgesinde kalın, deniz kenarında rahat günler geçirin, müzeleri ve köyleri keşfedin, akşamları Voulamandis House bahçesine dönün.",
      image: familyTravelImages.hero,
      primaryCta: {
        label: "Aile konaklaması rezerve et",
        href: localizedLinks.tr.booking,
      },
      secondaryCta: {
        label: "Odaları keşfet",
        href: localizedLinks.tr.rooms,
      },
    },
    intro: {
      title: "Sakız Adası aileler için neden uygundur",
      text:
        "Sakız Adası sakin, otantik ve kolay keşfedilen bir adadır. Aileler plajları, kısa kültür ziyaretlerini, geleneksel köyleri, basit yemek molalarını ve huzurlu akşamları rahatça birleştirebilir.",
    },
    cardsTitle: "Sakız Adası’nda kolay aile deneyimleri",
    cardsIntro:
      "Kumlu plajlardan oyun alanlarına, müzelerden köy yürüyüşlerine kadar her gün farklı ama rahat olabilir.",
    cards: [
      {
        title: "Aileler için kumlu plajlar",
        text:
          "Komi gibi plajlarda çocuklar oynarken ebeveynler sakin bir ada gününün tadını çıkarabilir.",
        image: familyTravelImages.sandyBeach,
        href: localizedLinks.tr.komi,
      },
      {
        title: "Sakız Mastik Müzesi",
        text:
          "Çocuklarla Sakız mastik geleneğini ilgi çekici ve aile dostu bir ziyaretle keşfedin.",
        image: familyTravelImages.museum,
        href: localizedLinks.tr.masticMuseum,
      },
      {
        title: "Korais Kütüphanesi",
        text:
          "Aile programınıza sakin ve eğitici bir kültür durağı ekleyin.",
        image: familyTravelImages.koraisLibrary,
        href: localizedLinks.tr.koraisLibrary,
      },
      {
        title: "Oyun alanları ve kolay molalar",
        text:
          "Çocukların hareket edebileceği oyun alanları, yürüyüşler ve kısa molalarla günü kolaylaştırın.",
        image: familyTravelImages.playground,
      },
      {
        title: "Daha büyük çocuklar için aktiviteler",
        text:
          "Daha büyük çocukları olan aileler için Sakız Adası daha hareketli deneyimler de sunar.",
        image: familyTravelImages.paintball,
      },
      {
        title: "Kolay aile yemek molaları",
        text:
          "Rahat mekanlar, yerel tatlar ve çocukların sevebileceği basit yemeklerle öğünleri kolay tutun.",
        image: familyTravelImages.pizza,
      },
    ],
    familyDay: {
      eyebrow: "Önerilen aile rotası",
      title: "Voulamandis House ile Sakız Adası’nda mükemmel aile günü",
      intro:
        "Sakız Adası’nda aile tatili karmaşık olmak zorunda değildir. Güne yavaş başlayın, bir veya iki deneyim seçin ve plaj için zaman bırakın.",
      steps: [
        {
          title: "Kampos’ta sabah",
          text:
            "Güne Kampos’ta narenciye bahçeleri, taş duvarlar ve eski konaklar arasında sakin bir yürüyüşle başlayın.",
        },
        {
          title: "Kahvaltı ve kültür",
          text:
            "Ev yapımı kahvaltıdan sonra Korais Kütüphanesi’ni veya Sakız Mastik Müzesi’ni ziyaret edin.",
        },
        {
          title: "Plaj zamanı",
          text:
            "Daha sonra ailelere uygun, rahat atmosferli bir plajda denizin tadını çıkarın.",
        },
        {
          title: "Öğle yemeği ve köyler",
          text:
            "Öğle yemeği için bir taverna veya kolay bir aile durağı seçin. Öğleden sonra Mesta veya Pyrgi gibi köyleri keşfedin.",
        },
        {
          title: "Bahçeye dönüş",
          text:
            "Günün sonunda Voulamandis House’a dönün ve bahçede huzurlu bir akşam geçirin.",
        },
      ],
    },
    stay: {
      eyebrow: "Kampos’ta konaklama",
      title: "Aileler için huzurlu bir başlangıç noktası",
      text:
        "Voulamandis House ailelere sakinlik, bahçe atmosferi ve Sakız şehir merkezine, plajlara, köylere ve müzelere kolay erişim sunar.",
      image: familyTravelImages.garden,
      primaryCta: {
        label: "Rezervasyon yap",
        href: localizedLinks.tr.booking,
      },
      secondaryCta: {
        label: "Odaları gör",
        href: localizedLinks.tr.rooms,
      },
    },
    finalCta: {
      title: "Sakız Adası aile tatilinizi planlamaya başlayın",
      text:
        "Voulamandis House’tan aileler plajları, köyleri, müzeleri ve otantik ada deneyimlerini kolayca keşfedebilir.",
      primaryCta: {
        label: "Direkt rezervasyon",
        href: localizedLinks.tr.booking,
      },
      secondaryCta: {
        label: "Plajları keşfet",
        href: localizedLinks.tr.beaches,
      },
    },
  },
} satisfies Record<LanguageCode, FamilyTravelPageContent>;

export function getFamilyTravelPageByLocale(locale: LanguageCode): FamilyTravelPageContent {
  return familyTravelPages[locale] ?? familyTravelPages.en;
}

export function getFamilyTravelPageByPath(path: string): FamilyTravelPageContent | undefined {
  const normalizedPath = normalizePath(path);

  return Object.values(familyTravelPages).find(
    (page) => normalizePath(page.path) === normalizedPath,
  );
}
