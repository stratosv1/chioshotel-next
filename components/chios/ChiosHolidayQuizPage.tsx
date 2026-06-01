"use client";

import { useMemo, useState } from "react";

type QuizLocale = "en" | "el" | "fr" | "de" | "it" | "es" | "tr";
type QuestType = "main" | "beaches" | "villages" | "sights";
type OptionKey = "a" | "b" | "c" | "d";

type QuizQuestion = {
  q: string;
  a: OptionKey;
  opts: Partial<Record<OptionKey, string>>;
  tip: string;
};

type ChiosHolidayQuizPageProps = {
  locale?: string;
};

const supportedLocales: QuizLocale[] = ["en", "el", "fr", "de", "it", "es", "tr"];

const bookingHrefByLocale: Record<QuizLocale, string> = {
  en: "/direct-booking-voulamandis-house/",
  el: "/el/",
  fr: "/fr/",
  de: "/de/",
  it: "/it/",
  es: "/es/",
  tr: "/tr/",
};

const uiByLocale: Record<
  QuizLocale,
  {
    kicker: string;
    title: string;
    description: string;
    question: string;
    back: string;
    next: string;
    insiderTip: string;
    resultTitle: string;
    resultHigh: string;
    resultLow: string;
    whyChoose: string;
    houseBio: string;
    uspRooms: string;
    uspLocation: string;
    uspSerenity: string;
    discountLabel: string;
    bookWithDiscount: string;
    miniTitle: string;
    beaches: string;
    villages: string;
    sights: string;
    miniComplete: string;
    miniCompleteText: string;
    returnToOffer: string;
  }
> = {
  en: {
    kicker: "Chios quiz",
    title: "Are you a Chios Insider? 🍋",
    description:
      "Discover the island's secrets and win a special discount for your stay in Kampos.",
    question: "Question",
    back: "← Back",
    next: "Next question →",
    insiderTip: "Insider Tip 💡",
    resultTitle: "You're a Chios Insider! 🏆",
    resultHigh: "You are a Chios expert! You deserve our maximum discount.",
    resultLow: "Great effort! Chios is waiting for you to discover its secrets.",
    whyChoose: "Why choose Voulamandis House 🍊",
    houseBio:
      "Experience the authentic Kampos lifestyle. Our 12-acre family estate is the perfect base for your Chian adventures.",
    uspRooms: "Value for Money Renovated Rooms",
    uspLocation: "Strategic Location for Exploring",
    uspSerenity: "Serenity among the Orange Groves",
    discountLabel: "Your personal discount code:",
    bookWithDiscount: "Book with discount",
    miniTitle: "Continue the Exploration",
    beaches: "🏖️ Beaches",
    villages: "🏰 Villages",
    sights: "🏛️ Sights",
    miniComplete: "Mini Quest Completed! 🌟",
    miniCompleteText: "Great job! You are becoming a true Chios expert.",
    returnToOffer: "Return to Offer",
  },
  el: {
    kicker: "Κουίζ για τη Χίο",
    title: "Είσαι Chios Insider; 🍋",
    description:
      "Ανακάλυψε τα μυστικά του νησιού και κέρδισε ειδικό εκπτωτικό κωδικό για τη διαμονή σου στον Κάμπο.",
    question: "Ερώτηση",
    back: "← Πίσω",
    next: "Επόμενη ερώτηση →",
    insiderTip: "Συμβουλή Insider 💡",
    resultTitle: "Είσαι Chios Insider! 🏆",
    resultHigh: "Ξέρεις πολύ καλά τη Χίο! Κέρδισες τον μεγαλύτερο εκπτωτικό κωδικό.",
    resultLow: "Πολύ καλή προσπάθεια! Η Χίος σε περιμένει να ανακαλύψεις τα μυστικά της.",
    whyChoose: "Γιατί να επιλέξεις το Voulamandis House 🍊",
    houseBio:
      "Ζήσε την αυθεντική ατμόσφαιρα του Κάμπου. Το οικογενειακό μας κτήμα 12 στρεμμάτων είναι ιδανική βάση για να γνωρίσεις τη Χίο.",
    uspRooms: "Ανακαινισμένα δωμάτια με καλή σχέση ποιότητας-τιμής",
    uspLocation: "Στρατηγική τοποθεσία για εξερεύνηση",
    uspSerenity: "Ηρεμία ανάμεσα στα περιβόλια",
    discountLabel: "Ο προσωπικός σου εκπτωτικός κωδικός:",
    bookWithDiscount: "Κράτηση με έκπτωση",
    miniTitle: "Συνέχισε την εξερεύνηση",
    beaches: "🏖️ Παραλίες",
    villages: "🏰 Χωριά",
    sights: "🏛️ Αξιοθέατα",
    miniComplete: "Το mini quest ολοκληρώθηκε! 🌟",
    miniCompleteText: "Μπράβο! Γίνεσαι πραγματικός γνώστης της Χίου.",
    returnToOffer: "Επιστροφή στην προσφορά",
  },
  fr: {
    kicker: "Quiz sur Chios",
    title: "Êtes-vous un Chios Insider ? 🍋",
    description:
      "Découvrez les secrets de l’île et gagnez un code de réduction spécial pour votre séjour à Kampos.",
    question: "Question",
    back: "← Retour",
    next: "Question suivante →",
    insiderTip: "Conseil d’initié 💡",
    resultTitle: "Vous êtes un Chios Insider ! 🏆",
    resultHigh: "Vous connaissez très bien Chios ! Vous méritez notre meilleure réduction.",
    resultLow: "Très bel effort ! Chios vous attend pour révéler ses secrets.",
    whyChoose: "Pourquoi choisir Voulamandis House 🍊",
    houseBio:
      "Découvrez le style de vie authentique de Kampos. Notre domaine familial est une base idéale pour explorer Chios.",
    uspRooms: "Chambres rénovées au bon rapport qualité-prix",
    uspLocation: "Emplacement stratégique pour explorer",
    uspSerenity: "Calme au milieu des orangeraies",
    discountLabel: "Votre code de réduction personnel :",
    bookWithDiscount: "Réserver avec réduction",
    miniTitle: "Continuez l’exploration",
    beaches: "🏖️ Plages",
    villages: "🏰 Villages",
    sights: "🏛️ Sites",
    miniComplete: "Mini quest terminé ! 🌟",
    miniCompleteText: "Bravo ! Vous devenez un vrai expert de Chios.",
    returnToOffer: "Retour à l’offre",
  },
  de: {
    kicker: "Chios-Quiz",
    title: "Sind Sie ein Chios Insider? 🍋",
    description:
      "Entdecken Sie die Geheimnisse der Insel und gewinnen Sie einen besonderen Rabattcode für Ihren Aufenthalt in Kampos.",
    question: "Frage",
    back: "← Zurück",
    next: "Nächste Frage →",
    insiderTip: "Insider-Tipp 💡",
    resultTitle: "Sie sind ein Chios Insider! 🏆",
    resultHigh: "Sie kennen Chios sehr gut! Sie verdienen unseren besten Rabatt.",
    resultLow: "Sehr gut gemacht! Chios wartet darauf, von Ihnen entdeckt zu werden.",
    whyChoose: "Warum Voulamandis House wählen 🍊",
    houseBio:
      "Erleben Sie den authentischen Lebensstil von Kampos. Unser Familienanwesen ist der ideale Ausgangspunkt für Chios.",
    uspRooms: "Renovierte Zimmer mit gutem Preis-Leistungs-Verhältnis",
    uspLocation: "Strategische Lage zum Erkunden",
    uspSerenity: "Ruhe zwischen Orangenhainen",
    discountLabel: "Ihr persönlicher Rabattcode:",
    bookWithDiscount: "Mit Rabatt buchen",
    miniTitle: "Entdeckung fortsetzen",
    beaches: "🏖️ Strände",
    villages: "🏰 Dörfer",
    sights: "🏛️ Sehenswürdigkeiten",
    miniComplete: "Mini Quest abgeschlossen! 🌟",
    miniCompleteText: "Sehr gut! Sie werden ein echter Chios-Experte.",
    returnToOffer: "Zurück zum Angebot",
  },
  it: {
    kicker: "Quiz su Chios",
    title: "Sei un Chios Insider? 🍋",
    description:
      "Scopri i segreti dell’isola e ricevi un codice sconto speciale per il tuo soggiorno a Kampos.",
    question: "Domanda",
    back: "← Indietro",
    next: "Domanda successiva →",
    insiderTip: "Consiglio da insider 💡",
    resultTitle: "Sei un Chios Insider! 🏆",
    resultHigh: "Conosci molto bene Chios! Ti meriti il nostro sconto migliore.",
    resultLow: "Ottimo tentativo! Chios ti aspetta per svelarti i suoi segreti.",
    whyChoose: "Perché scegliere Voulamandis House 🍊",
    houseBio:
      "Vivi l’autentica atmosfera di Kampos. La nostra tenuta familiare è la base ideale per esplorare Chios.",
    uspRooms: "Camere rinnovate con ottimo rapporto qualità-prezzo",
    uspLocation: "Posizione strategica per esplorare",
    uspSerenity: "Tranquillità tra gli aranceti",
    discountLabel: "Il tuo codice sconto personale:",
    bookWithDiscount: "Prenota con sconto",
    miniTitle: "Continua l’esplorazione",
    beaches: "🏖️ Spiagge",
    villages: "🏰 Villaggi",
    sights: "🏛️ Luoghi d’interesse",
    miniComplete: "Mini quest completata! 🌟",
    miniCompleteText: "Ottimo lavoro! Stai diventando un vero esperto di Chios.",
    returnToOffer: "Torna all’offerta",
  },
  es: {
    kicker: "Quiz sobre Quíos",
    title: "¿Eres un Chios Insider? 🍋",
    description:
      "Descubre los secretos de la isla y consigue un código de descuento especial para tu estancia en Kampos.",
    question: "Pregunta",
    back: "← Atrás",
    next: "Siguiente pregunta →",
    insiderTip: "Consejo insider 💡",
    resultTitle: "¡Eres un Chios Insider! 🏆",
    resultHigh: "¡Conoces muy bien Quíos! Mereces nuestro mayor descuento.",
    resultLow: "¡Muy buen intento! Quíos te espera para descubrir sus secretos.",
    whyChoose: "Por qué elegir Voulamandis House 🍊",
    houseBio:
      "Vive el auténtico ambiente de Kampos. Nuestra finca familiar es una base ideal para explorar Quíos.",
    uspRooms: "Habitaciones renovadas con buena relación calidad-precio",
    uspLocation: "Ubicación estratégica para explorar",
    uspSerenity: "Tranquilidad entre naranjos",
    discountLabel: "Tu código de descuento personal:",
    bookWithDiscount: "Reservar con descuento",
    miniTitle: "Continúa la exploración",
    beaches: "🏖️ Playas",
    villages: "🏰 Pueblos",
    sights: "🏛️ Lugares de interés",
    miniComplete: "¡Mini quest completada! 🌟",
    miniCompleteText: "¡Buen trabajo! Te estás convirtiendo en un experto en Quíos.",
    returnToOffer: "Volver a la oferta",
  },
  tr: {
    kicker: "Sakız Adası testi",
    title: "Chios Insider mısınız? 🍋",
    description:
      "Adanın sırlarını keşfedin ve Kampos’taki konaklamanız için özel indirim kodu kazanın.",
    question: "Soru",
    back: "← Geri",
    next: "Sonraki soru →",
    insiderTip: "Insider ipucu 💡",
    resultTitle: "Chios Insider oldunuz! 🏆",
    resultHigh: "Sakız Adası’nı çok iyi biliyorsunuz! En iyi indirimi hak ettiniz.",
    resultLow: "Çok iyi deneme! Sakız Adası sırlarını keşfetmeniz için sizi bekliyor.",
    whyChoose: "Neden Voulamandis House 🍊",
    houseBio:
      "Kampos’un otantik atmosferini yaşayın. Aile işletmemiz, Sakız Adası’nı keşfetmek için ideal bir başlangıç noktasıdır.",
    uspRooms: "Yenilenmiş ve uygun fiyatlı odalar",
    uspLocation: "Keşif için stratejik konum",
    uspSerenity: "Portakal bahçeleri arasında huzur",
    discountLabel: "Kişisel indirim kodunuz:",
    bookWithDiscount: "İndirimle rezervasyon yap",
    miniTitle: "Keşfe devam edin",
    beaches: "🏖️ Plajlar",
    villages: "🏰 Köyler",
    sights: "🏛️ Gezilecek yerler",
    miniComplete: "Mini quest tamamlandı! 🌟",
    miniCompleteText: "Harika! Gerçek bir Sakız Adası uzmanı oluyorsunuz.",
    returnToOffer: "Teklife dön",
  },
};

const quizDataByLocale: Partial<Record<QuizLocale, Record<QuestType, QuizQuestion[]>>> = {
  en: {
    main: [
      {
        q: "What will you find behind the high stone walls in Kampos?",
        a: "b",
        opts: {
          a: "Shopping malls.",
          b: "Citrus orchards & water wheels.",
          c: "Large hotels.",
        },
        tip: "Kampos is world-famous for the scent of its citrus blossoms!",
      },
      {
        q: "Which Chios monument is a UNESCO World Heritage site?",
        a: "a",
        opts: {
          a: "Nea Moni Monastery.",
          b: "The Castle.",
          c: "Anavatos.",
        },
        tip: "The mosaics of Nea Moni are masterpieces of Byzantine art.",
      },
      {
        q: "What are the 'Xysta' patterns in Pyrgi?",
        a: "c",
        opts: {
          a: "A local dessert.",
          b: "A folk dance.",
          c: "Geometric wall etchings.",
        },
        tip: "It's a unique technique using black volcanic sand and lime.",
      },
      {
        q: "How is authentic Mastic (Mastiha) produced?",
        a: "a",
        opts: {
          a: "Incisions on the trunk.",
          b: "From the fruits.",
          c: "From the leaves.",
        },
        tip: "Chios is the only place in the world where the Lentisk tree 'tears'!",
      },
      {
        q: "Why are the pebbles at 'Mavra Volia' beach black?",
        a: "b",
        opts: {
          a: "Due to pollution.",
          b: "Psaronas Volcano eruption.",
          c: "They are dyed.",
        },
        tip: "These volcanic stones keep the water crystal clear.",
      },
      {
        q: "Where does the famous Rocket War take place?",
        a: "a",
        opts: {
          a: "Vrontados.",
          b: "Mesta.",
          c: "Lagada.",
        },
        tip: "It's a world-renowned Easter tradition.",
      },
      {
        q: "Which village is built like a medieval fortress?",
        a: "c",
        opts: {
          a: "Kardamyla.",
          b: "Thymiana.",
          c: "Mesta.",
        },
        tip: "The houses are joined together to protect from pirates.",
      },
      {
        q: "What is a 'magganos' in the estates of Kampos?",
        a: "b",
        opts: {
          a: "A mastic tool.",
          b: "A traditional water wheel.",
          c: "A type of boat.",
        },
        tip: "It was the heart of the irrigation system for centuries.",
      },
      {
        q: "Which ancient poet is said to have taught on Chios?",
        a: "a",
        opts: {
          a: "Homer.",
          b: "Hesiod.",
          c: "Pindar.",
        },
        tip: "Daskalopetra, also known as Homer’s Stone, is a landmark connected with him.",
      },
      {
        q: "Why choose Voulamandis House for your stay? 🍊",
        a: "d",
        opts: {
          a: "Renovated rooms.",
          b: "Strategic location.",
          c: "Authentic hospitality.",
          d: "All of the above!",
        },
        tip: "We would love to welcome you to our family estate!",
      },
    ],
    beaches: [
      {
        q: "Which beach has fine sand and shallow waters?",
        a: "a",
        opts: {
          a: "Karfas.",
          b: "Mavra Volia.",
          c: "Agia Dinami.",
        },
        tip: "Perfect for families with children!",
      },
      {
        q: "Where is 'Agia Dinami' located?",
        a: "b",
        opts: {
          a: "North Chios.",
          b: "South Chios, near Olympi.",
          c: "Central Chios.",
        },
        tip: "One of the most exotic beaches on the island.",
      },
      {
        q: "Which beach is famous for its serene sunset?",
        a: "c",
        opts: {
          a: "Komi.",
          b: "Vrontados.",
          c: "Elinda.",
        },
        tip: "The waters here are usually calm and crystal clear.",
      },
      {
        q: "Which is the largest beach in Western Chios?",
        a: "a",
        opts: {
          a: "Managros.",
          b: "Lefkathia.",
          c: "Trachili.",
        },
        tip: "An endless sandy beach for ultimate relaxation.",
      },
      {
        q: "Which beach is famous for its beach bar near Mesta?",
        a: "b",
        opts: {
          a: "Giosonas.",
          b: "Apothika.",
          c: "Nagos.",
        },
        tip: "A popular spot for kayaking and deep blue waters.",
      },
      {
        q: "Where can you find the emerald 'Nagos' beach?",
        a: "c",
        opts: {
          a: "South Chios.",
          b: "West Chios.",
          c: "North Chios, near Kardamyla.",
        },
        tip: "A lush green landscape with natural springs by the sea.",
      },
      {
        q: "White pebbles and cold waters named after a hero?",
        a: "a",
        opts: {
          a: "Giosonas.",
          b: "Karfas.",
          c: "Bella Vista.",
        },
        tip: "Named after Jason, Iasonas, of the Argonauts.",
      },
    ],
    villages: [
      {
        q: "Which village is called the 'Mystras of the Aegean'?",
        a: "b",
        opts: {
          a: "Pyrgi.",
          b: "Anavatos.",
          c: "Volissos.",
        },
        tip: "A historic ghost village built on a steep cliff.",
      },
      {
        q: "Where is the Chios Mastic Museum located?",
        a: "a",
        opts: {
          a: "Pyrgi.",
          b: "Mesta.",
          c: "Armolia.",
        },
        tip: "It offers a beautiful view of the mastic groves.",
      },
      {
        q: "Which village is famous for its ceramics?",
        a: "c",
        opts: {
          a: "Kallimasia.",
          b: "Thymiana.",
          c: "Armolia.",
        },
        tip: "A great place to find handmade clay souvenirs.",
      },
      {
        q: "Where is the castle built by Belisarius located?",
        a: "a",
        opts: {
          a: "Volissos.",
          b: "Olympi.",
          c: "Vessa.",
        },
        tip: "The castle overlooks the village and the Aegean Sea.",
      },
      {
        q: "Which village is built with local red stone?",
        a: "b",
        opts: {
          a: "Vrontados.",
          b: "Thymiana.",
          c: "Nenita.",
        },
        tip: "This stone was used to build many mansions of Kampos.",
      },
      {
        q: "In which village is the historic giant plane tree?",
        a: "c",
        opts: {
          a: "Kardamyla.",
          b: "Lagada.",
          c: "Pityos.",
        },
        tip: "Pityos is a very old and historic mountain settlement.",
      },
      {
        q: "Which village is the home of legendary seafarers?",
        a: "a",
        opts: {
          a: "Kardamyla.",
          b: "Olympi.",
          c: "Vessa.",
        },
        tip: "It is the birthplace of many famous shipowners.",
      },
    ],
    sights: [
      {
        q: "What is the 'Daskalio' near Oinousses?",
        a: "b",
        opts: {
          a: "A school.",
          b: "An islet with a church.",
          c: "A cave.",
        },
        tip: "It is a picturesque spot often visited by boat.",
      },
      {
        q: "Where is the famous Olympi Cave located?",
        a: "a",
        opts: {
          a: "South Chios.",
          b: "North Chios.",
          c: "Central Chios.",
        },
        tip: "The cave has impressive stalactites and a stable temperature.",
      },
      {
        q: "Is the Castle of Chios town inhabited?",
        a: "c",
        opts: {
          a: "No, it is only ruins.",
          b: "Only in the morning.",
          c: "Yes, it is a living neighborhood.",
        },
        tip: "It is one of the few inhabited castles in Greece.",
      },
      {
        q: "Where is the historic 'Korais' Library?",
        a: "a",
        opts: {
          a: "Chios Town.",
          b: "Pyrgi.",
          c: "Mesta.",
        },
        tip: "It is one of the oldest and largest libraries in Greece.",
      },
      {
        q: "What were the 'Viglas' used for?",
        a: "b",
        opts: {
          a: "Harvesting mastic.",
          b: "Coastal watchtowers.",
          c: "Lighthouses.",
        },
        tip: "They warned the islanders about pirate raids.",
      },
      {
        q: "Saint Markella Monastery is located near...",
        a: "c",
        opts: {
          a: "Kampos.",
          b: "Psara.",
          c: "Volissos.",
        },
        tip: "The patron saint's feast day is July 22nd.",
      },
      {
        q: "What can you see in the Castle's Ottoman Baths?",
        a: "a",
        opts: {
          a: "A restored hammam.",
          b: "A jail cell.",
          c: "A water well.",
        },
        tip: "The hammam is a beautifully preserved monument.",
      },
    ],
  },

  el: {
    main: [
      {
        q: "Τι θα βρεις πίσω από τους ψηλούς πέτρινους τοίχους στον Κάμπο;",
        a: "b",
        opts: {
          a: "Εμπορικά κέντρα.",
          b: "Περιβόλια εσπεριδοειδών και μάγγανους.",
          c: "Μεγάλα ξενοδοχεία.",
        },
        tip: "Ο Κάμπος είναι γνωστός για τα αρχοντικά, τα περιβόλια και το άρωμα των εσπεριδοειδών.",
      },
      {
        q: "Ποιο μνημείο της Χίου είναι Μνημείο Παγκόσμιας Κληρονομιάς UNESCO;",
        a: "a",
        opts: {
          a: "Η Νέα Μονή.",
          b: "Το Κάστρο της Χίου.",
          c: "Ο Ανάβατος.",
        },
        tip: "Τα ψηφιδωτά της Νέας Μονής θεωρούνται αριστουργήματα της βυζαντινής τέχνης.",
      },
      {
        q: "Τι είναι τα «ξυστά» στο Πυργί;",
        a: "c",
        opts: {
          a: "Τοπικό γλυκό.",
          b: "Παραδοσιακός χορός.",
          c: "Γεωμετρικά σχέδια στους τοίχους.",
        },
        tip: "Τα ξυστά είναι μοναδική τεχνική διακόσμησης που κάνει το Πυργί ένα από τα πιο ξεχωριστά χωριά της Χίου.",
      },
      {
        q: "Πώς παράγεται η αυθεντική μαστίχα Χίου;",
        a: "a",
        opts: {
          a: "Με χαράξεις στον κορμό του σχίνου.",
          b: "Από τους καρπούς του δέντρου.",
          c: "Από τα φύλλα.",
        },
        tip: "Η Χίος είναι το μοναδικό μέρος στον κόσμο όπου ο σχίνος δίνει τη φημισμένη μαστίχα.",
      },
      {
        q: "Γιατί είναι μαύρα τα βότσαλα στα Μαύρα Βόλια;",
        a: "b",
        opts: {
          a: "Λόγω ρύπανσης.",
          b: "Λόγω ηφαιστειακής προέλευσης.",
          c: "Είναι βαμμένα.",
        },
        tip: "Τα Μαύρα Βόλια είναι μία από τις πιο εντυπωσιακές παραλίες της Χίου, με ηφαιστειακά μαύρα βότσαλα.",
      },
      {
        q: "Πού γίνεται ο περίφημος Ρουκετοπόλεμος;",
        a: "a",
        opts: {
          a: "Στον Βροντάδο.",
          b: "Στα Μεστά.",
          c: "Στη Λαγκάδα.",
        },
        tip: "Ο Ρουκετοπόλεμος είναι ένα από τα πιο γνωστά πασχαλινά έθιμα της Χίου.",
      },
      {
        q: "Ποιο χωριό είναι χτισμένο σαν μεσαιωνικό φρούριο;",
        a: "c",
        opts: {
          a: "Τα Καρδάμυλα.",
          b: "Τα Θυμιανά.",
          c: "Τα Μεστά.",
        },
        tip: "Στα Μεστά τα σπίτια είναι ενωμένα μεταξύ τους, δημιουργώντας αμυντικό οικισμό για προστασία από επιδρομές.",
      },
      {
        q: "Τι είναι ο «μάγγανος» στα κτήματα του Κάμπου;",
        a: "b",
        opts: {
          a: "Εργαλείο για τη μαστίχα.",
          b: "Παραδοσιακός μηχανισμός άντλησης νερού.",
          c: "Τύπος βάρκας.",
        },
        tip: "Ο μάγγανος ήταν βασικό κομμάτι της άρδευσης των περιβολιών του Κάμπου για αιώνες.",
      },
      {
        q: "Ποιος αρχαίος ποιητής λέγεται ότι δίδαξε στη Χίο;",
        a: "a",
        opts: {
          a: "Ο Όμηρος.",
          b: "Ο Ησίοδος.",
          c: "Ο Πίνδαρος.",
        },
        tip: "Η Δασκαλόπετρα, γνωστή και ως Πέτρα του Ομήρου, συνδέεται με την παράδοση γύρω από τον μεγάλο ποιητή.",
      },
      {
        q: "Γιατί να επιλέξεις το Voulamandis House για τη διαμονή σου; 🍊",
        a: "d",
        opts: {
          a: "Για τα ανακαινισμένα δωμάτια.",
          b: "Για τη στρατηγική τοποθεσία.",
          c: "Για την αυθεντική φιλοξενία.",
          d: "Όλα τα παραπάνω!",
        },
        tip: "Θα χαρούμε πολύ να σε φιλοξενήσουμε στο οικογενειακό μας κτήμα στον Κάμπο.",
      },
    ],
    beaches: [
      {
        q: "Ποια παραλία έχει ψιλή άμμο και ρηχά νερά;",
        a: "a",
        opts: {
          a: "Ο Καρφάς.",
          b: "Τα Μαύρα Βόλια.",
          c: "Η Αγία Δύναμη.",
        },
        tip: "Ο Καρφάς είναι ιδανικός για οικογένειες με παιδιά.",
      },
      {
        q: "Πού βρίσκεται η Αγία Δύναμη;",
        a: "b",
        opts: {
          a: "Στη βόρεια Χίο.",
          b: "Στη νότια Χίο, κοντά στους Ολύμπους.",
          c: "Στην κεντρική Χίο.",
        },
        tip: "Η Αγία Δύναμη είναι μία από τις πιο εξωτικές παραλίες του νησιού.",
      },
      {
        q: "Ποια παραλία είναι γνωστή για το ήρεμο ηλιοβασίλεμά της;",
        a: "c",
        opts: {
          a: "Η Κώμη.",
          b: "Ο Βροντάδος.",
          c: "Η Ελίντα.",
        },
        tip: "Στην Ελίντα τα νερά είναι συνήθως ήρεμα και κρυστάλλινα.",
      },
      {
        q: "Ποια είναι η μεγαλύτερη παραλία της δυτικής Χίου;",
        a: "a",
        opts: {
          a: "Ο Μάναγρος.",
          b: "Τα Λευκάθια.",
          c: "Το Τραχήλι.",
        },
        tip: "Ο Μάναγρος είναι μεγάλη αμμώδης παραλία, ιδανική για χαλάρωση.",
      },
      {
        q: "Ποια παραλία κοντά στα Μεστά είναι γνωστή για το beach bar της;",
        a: "b",
        opts: {
          a: "Ο Γιόσωνας.",
          b: "Τα Αποθήκα.",
          c: "Τα Ναγός.",
        },
        tip: "Τα Αποθήκα είναι δημοφιλές σημείο για καγιάκ και βαθιά μπλε νερά.",
      },
      {
        q: "Πού θα βρεις την καταπράσινη παραλία Ναγός;",
        a: "c",
        opts: {
          a: "Στη νότια Χίο.",
          b: "Στη δυτική Χίο.",
          c: "Στη βόρεια Χίο, κοντά στα Καρδάμυλα.",
        },
        tip: "Ο Ναγός συνδυάζει καταπράσινο τοπίο, πηγές και θάλασσα.",
      },
      {
        q: "Ποια παραλία έχει λευκά βότσαλα και κρύα νερά, με όνομα που θυμίζει ήρωα;",
        a: "a",
        opts: {
          a: "Ο Γιόσωνας.",
          b: "Ο Καρφάς.",
          c: "Η Bella Vista.",
        },
        tip: "Ο Γιόσωνας συνδέεται ονομαστικά με τον Ιάσονα των Αργοναυτών.",
      },
    ],
    villages: [
      {
        q: "Ποιο χωριό αποκαλείται «Μυστράς του Αιγαίου»;",
        a: "b",
        opts: {
          a: "Το Πυργί.",
          b: "Ο Ανάβατος.",
          c: "Η Βολισσός.",
        },
        tip: "Ο Ανάβατος είναι ιστορικός ερειπωμένος οικισμός χτισμένος σε απόκρημνο βράχο.",
      },
      {
        q: "Πού βρίσκεται το Μουσείο Μαστίχας Χίου;",
        a: "a",
        opts: {
          a: "Στο Πυργί.",
          b: "Στα Μεστά.",
          c: "Στα Αρμόλια.",
        },
        tip: "Το Μουσείο Μαστίχας έχει όμορφη θέα στους μαστιχώνες της νότιας Χίου.",
      },
      {
        q: "Ποιο χωριό είναι γνωστό για τα κεραμικά του;",
        a: "c",
        opts: {
          a: "Η Καλλιμασιά.",
          b: "Τα Θυμιανά.",
          c: "Τα Αρμόλια.",
        },
        tip: "Στα Αρμόλια μπορείς να βρεις χειροποίητα πήλινα αντικείμενα και αναμνηστικά.",
      },
      {
        q: "Πού βρίσκεται το κάστρο που συνδέεται με τον Βελισάριο;",
        a: "a",
        opts: {
          a: "Στη Βολισσό.",
          b: "Στους Ολύμπους.",
          c: "Στη Βέσσα.",
        },
        tip: "Το κάστρο δεσπόζει πάνω από τη Βολισσό με θέα στο Αιγαίο.",
      },
      {
        q: "Ποιο χωριό είναι χτισμένο με την τοπική κόκκινη πέτρα;",
        a: "b",
        opts: {
          a: "Ο Βροντάδος.",
          b: "Τα Θυμιανά.",
          c: "Τα Νένητα.",
        },
        tip: "Η θυμιανούσικη πέτρα χρησιμοποιήθηκε και σε πολλά αρχοντικά του Κάμπου.",
      },
      {
        q: "Σε ποιο χωριό βρίσκεται ο ιστορικός μεγάλος πλάτανος;",
        a: "c",
        opts: {
          a: "Στα Καρδάμυλα.",
          b: "Στη Λαγκάδα.",
          c: "Στο Πιτυός.",
        },
        tip: "Το Πιτυός είναι παλιός ορεινός οικισμός με ιδιαίτερη ιστορία.",
      },
      {
        q: "Ποιο χωριό είναι πατρίδα σπουδαίων ναυτικών και εφοπλιστών;",
        a: "a",
        opts: {
          a: "Τα Καρδάμυλα.",
          b: "Οι Ολύμποι.",
          c: "Η Βέσσα.",
        },
        tip: "Τα Καρδάμυλα έχουν μεγάλη ναυτική παράδοση.",
      },
    ],
    sights: [
      {
        q: "Τι είναι το Δασκαλιό κοντά στις Οινούσσες;",
        a: "b",
        opts: {
          a: "Σχολείο.",
          b: "Νησάκι με εκκλησία.",
          c: "Σπήλαιο.",
        },
        tip: "Το Δασκαλιό είναι γραφικό σημείο που συχνά προσεγγίζεται με βάρκα.",
      },
      {
        q: "Πού βρίσκεται το Σπήλαιο Ολύμπων;",
        a: "a",
        opts: {
          a: "Στη νότια Χίο.",
          b: "Στη βόρεια Χίο.",
          c: "Στην κεντρική Χίο.",
        },
        tip: "Το σπήλαιο έχει εντυπωσιακούς σταλακτίτες και σταθερή θερμοκρασία.",
      },
      {
        q: "Το Κάστρο της πόλης της Χίου κατοικείται ακόμη;",
        a: "c",
        opts: {
          a: "Όχι, είναι μόνο ερείπια.",
          b: "Μόνο το πρωί.",
          c: "Ναι, είναι ζωντανή γειτονιά.",
        },
        tip: "Είναι ένα από τα λίγα κατοικημένα κάστρα στην Ελλάδα.",
      },
      {
        q: "Πού βρίσκεται η ιστορική Βιβλιοθήκη Κοραή;",
        a: "a",
        opts: {
          a: "Στην πόλη της Χίου.",
          b: "Στο Πυργί.",
          c: "Στα Μεστά.",
        },
        tip: "Είναι μία από τις παλαιότερες και σημαντικότερες βιβλιοθήκες της Ελλάδας.",
      },
      {
        q: "Σε τι χρησίμευαν οι βίγλες;",
        a: "b",
        opts: {
          a: "Στη συγκομιδή μαστίχας.",
          b: "Ως παράκτιοι πύργοι παρατήρησης.",
          c: "Ως φάροι.",
        },
        tip: "Οι βίγλες προειδοποιούσαν τους κατοίκους για πειρατικές επιδρομές.",
      },
      {
        q: "Το μοναστήρι της Αγίας Μαρκέλλας βρίσκεται κοντά...",
        a: "c",
        opts: {
          a: "Στον Κάμπο.",
          b: "Στα Ψαρά.",
          c: "Στη Βολισσό.",
        },
        tip: "Η Αγία Μαρκέλλα θεωρείται πολιούχος της Χίου και γιορτάζει στις 22 Ιουλίου.",
      },
      {
        q: "Τι μπορείς να δεις στα Οθωμανικά Λουτρά του Κάστρου;",
        a: "a",
        opts: {
          a: "Ένα αναστηλωμένο χαμάμ.",
          b: "Ένα κελί φυλακής.",
          c: "Ένα πηγάδι.",
        },
        tip: "Το χαμάμ είναι ένα όμορφα διατηρημένο μνημείο μέσα στο Κάστρο.",
      },
    ],
  },

  fr: {
    main: [
      {
        q: "Que trouve-t-on derrière les hauts murs de pierre de Kampos ?",
        a: "b",
        opts: {
          a: "Des centres commerciaux.",
          b: "Des vergers d’agrumes et des roues à eau.",
          c: "De grands hôtels.",
        },
        tip: "Kampos est connu pour ses demeures historiques, ses vergers et le parfum des agrumes.",
      },
      {
        q: "Quel monument de Chios est classé au patrimoine mondial de l’UNESCO ?",
        a: "a",
        opts: {
          a: "Le monastère de Nea Moni.",
          b: "Le château de Chios.",
          c: "Anavatos.",
        },
        tip: "Les mosaïques de Nea Moni sont considérées comme des chefs-d’œuvre de l’art byzantin.",
      },
      {
        q: "Que sont les « Xysta » à Pyrgi ?",
        a: "c",
        opts: {
          a: "Un dessert local.",
          b: "Une danse traditionnelle.",
          c: "Des motifs géométriques sur les murs.",
        },
        tip: "Les Xysta sont une technique décorative unique qui rend Pyrgi immédiatement reconnaissable.",
      },
      {
        q: "Comment produit-on le véritable mastic de Chios ?",
        a: "a",
        opts: {
          a: "Par des incisions dans le tronc du lentisque.",
          b: "À partir des fruits de l’arbre.",
          c: "À partir des feuilles.",
        },
        tip: "Chios est le seul endroit au monde où le lentisque produit le célèbre mastic.",
      },
      {
        q: "Pourquoi les galets de la plage de Mavra Volia sont-ils noirs ?",
        a: "b",
        opts: {
          a: "À cause de la pollution.",
          b: "À cause de leur origine volcanique.",
          c: "Ils sont peints.",
        },
        tip: "Mavra Volia est l’une des plages les plus impressionnantes de Chios, avec ses galets volcaniques noirs.",
      },
      {
        q: "Où a lieu la célèbre guerre des fusées de Pâques ?",
        a: "a",
        opts: {
          a: "À Vrontados.",
          b: "À Mesta.",
          c: "À Lagada.",
        },
        tip: "La guerre des fusées est l’une des traditions pascales les plus connues de Chios.",
      },
      {
        q: "Quel village est construit comme une forteresse médiévale ?",
        a: "c",
        opts: {
          a: "Kardamyla.",
          b: "Thymiana.",
          c: "Mesta.",
        },
        tip: "À Mesta, les maisons sont reliées entre elles afin de protéger le village des attaques.",
      },
      {
        q: "Qu’est-ce qu’un « magganos » dans les domaines de Kampos ?",
        a: "b",
        opts: {
          a: "Un outil pour le mastic.",
          b: "Un mécanisme traditionnel pour puiser l’eau.",
          c: "Un type de bateau.",
        },
        tip: "Le magganos était essentiel pour l’irrigation des vergers de Kampos pendant des siècles.",
      },
      {
        q: "Quel poète antique aurait enseigné à Chios ?",
        a: "a",
        opts: {
          a: "Homère.",
          b: "Hésiode.",
          c: "Pindare.",
        },
        tip: "Daskalopetra, aussi appelée la pierre d’Homère, est liée à cette tradition.",
      },
      {
        q: "Pourquoi choisir Voulamandis House pour votre séjour ? 🍊",
        a: "d",
        opts: {
          a: "Pour ses chambres rénovées.",
          b: "Pour son emplacement stratégique.",
          c: "Pour son hospitalité authentique.",
          d: "Tout cela à la fois !",
        },
        tip: "Nous serions ravis de vous accueillir dans notre domaine familial à Kampos.",
      },
    ],
    beaches: [
      {
        q: "Quelle plage possède du sable fin et des eaux peu profondes ?",
        a: "a",
        opts: {
          a: "Karfas.",
          b: "Mavra Volia.",
          c: "Agia Dinami.",
        },
        tip: "Karfas est idéale pour les familles avec enfants.",
      },
      {
        q: "Où se trouve Agia Dinami ?",
        a: "b",
        opts: {
          a: "Au nord de Chios.",
          b: "Au sud de Chios, près d’Olympi.",
          c: "Au centre de Chios.",
        },
        tip: "Agia Dinami est l’une des plages les plus exotiques de l’île.",
      },
      {
        q: "Quelle plage est connue pour son coucher de soleil paisible ?",
        a: "c",
        opts: {
          a: "Komi.",
          b: "Vrontados.",
          c: "Elinda.",
        },
        tip: "À Elinda, les eaux sont généralement calmes et cristallines.",
      },
      {
        q: "Quelle est la plus grande plage de l’ouest de Chios ?",
        a: "a",
        opts: {
          a: "Managros.",
          b: "Lefkathia.",
          c: "Trachili.",
        },
        tip: "Managros est une longue plage de sable idéale pour se détendre.",
      },
      {
        q: "Quelle plage près de Mesta est connue pour son beach bar ?",
        a: "b",
        opts: {
          a: "Giosonas.",
          b: "Apothika.",
          c: "Nagos.",
        },
        tip: "Apothika est un lieu apprécié pour le kayak et ses eaux bleu profond.",
      },
      {
        q: "Où se trouve la plage verdoyante de Nagos ?",
        a: "c",
        opts: {
          a: "Au sud de Chios.",
          b: "À l’ouest de Chios.",
          c: "Au nord de Chios, près de Kardamyla.",
        },
        tip: "Nagos combine paysage verdoyant, sources naturelles et mer.",
      },
      {
        q: "Quelle plage aux galets blancs et aux eaux fraîches porte un nom lié à un héros ?",
        a: "a",
        opts: {
          a: "Giosonas.",
          b: "Karfas.",
          c: "Bella Vista.",
        },
        tip: "Giosonas est associé par son nom à Jason, le héros des Argonautes.",
      },
    ],
    villages: [
      {
        q: "Quel village est surnommé le « Mystras de l’Égée » ?",
        a: "b",
        opts: {
          a: "Pyrgi.",
          b: "Anavatos.",
          c: "Volissos.",
        },
        tip: "Anavatos est un village historique abandonné, construit sur un rocher escarpé.",
      },
      {
        q: "Où se trouve le Musée du Mastic de Chios ?",
        a: "a",
        opts: {
          a: "À Pyrgi.",
          b: "À Mesta.",
          c: "À Armolia.",
        },
        tip: "Le musée offre une belle vue sur les plantations de mastic du sud de Chios.",
      },
      {
        q: "Quel village est célèbre pour sa céramique ?",
        a: "c",
        opts: {
          a: "Kallimasia.",
          b: "Thymiana.",
          c: "Armolia.",
        },
        tip: "À Armolia, on trouve de nombreux objets artisanaux en argile.",
      },
      {
        q: "Où se trouve le château associé à Bélisaire ?",
        a: "a",
        opts: {
          a: "À Volissos.",
          b: "À Olympi.",
          c: "À Vessa.",
        },
        tip: "Le château domine Volissos avec une vue sur la mer Égée.",
      },
      {
        q: "Quel village est construit avec la pierre rouge locale ?",
        a: "b",
        opts: {
          a: "Vrontados.",
          b: "Thymiana.",
          c: "Nenita.",
        },
        tip: "La pierre de Thymiana a aussi été utilisée dans de nombreuses demeures de Kampos.",
      },
      {
        q: "Dans quel village se trouve le grand platane historique ?",
        a: "c",
        opts: {
          a: "Kardamyla.",
          b: "Lagada.",
          c: "Pityos.",
        },
        tip: "Pityos est un ancien village de montagne avec une histoire particulière.",
      },
      {
        q: "Quel village est la patrie de grands marins et armateurs ?",
        a: "a",
        opts: {
          a: "Kardamyla.",
          b: "Olympi.",
          c: "Vessa.",
        },
        tip: "Kardamyla possède une très forte tradition maritime.",
      },
    ],
    sights: [
      {
        q: "Qu’est-ce que Daskalio près d’Oinousses ?",
        a: "b",
        opts: {
          a: "Une école.",
          b: "Un îlot avec une église.",
          c: "Une grotte.",
        },
        tip: "Daskalio est un lieu pittoresque souvent visité en bateau.",
      },
      {
        q: "Où se trouve la grotte d’Olympi ?",
        a: "a",
        opts: {
          a: "Au sud de Chios.",
          b: "Au nord de Chios.",
          c: "Au centre de Chios.",
        },
        tip: "La grotte possède d’impressionnantes stalactites et une température stable.",
      },
      {
        q: "Le château de la ville de Chios est-il encore habité ?",
        a: "c",
        opts: {
          a: "Non, ce ne sont que des ruines.",
          b: "Seulement le matin.",
          c: "Oui, c’est un quartier vivant.",
        },
        tip: "C’est l’un des rares châteaux habités en Grèce.",
      },
      {
        q: "Où se trouve la bibliothèque historique Korais ?",
        a: "a",
        opts: {
          a: "Dans la ville de Chios.",
          b: "À Pyrgi.",
          c: "À Mesta.",
        },
        tip: "C’est l’une des bibliothèques les plus anciennes et importantes de Grèce.",
      },
      {
        q: "À quoi servaient les vigles ?",
        a: "b",
        opts: {
          a: "À récolter le mastic.",
          b: "Comme tours côtières de surveillance.",
          c: "Comme phares.",
        },
        tip: "Elles avertissaient les habitants en cas d’attaques de pirates.",
      },
      {
        q: "Le monastère de Sainte-Markella se trouve près de...",
        a: "c",
        opts: {
          a: "Kampos.",
          b: "Psara.",
          c: "Volissos.",
        },
        tip: "Sainte Markella est considérée comme la patronne de Chios et sa fête a lieu le 22 juillet.",
      },
      {
        q: "Que peut-on voir dans les bains ottomans du château ?",
        a: "a",
        opts: {
          a: "Un hammam restauré.",
          b: "Une cellule de prison.",
          c: "Un puits.",
        },
        tip: "Le hammam est un monument très bien conservé à l’intérieur du château.",
      },
    ],
  },
};

function normalizeLocale(locale?: string): QuizLocale {
  if (locale && supportedLocales.includes(locale as QuizLocale)) {
    return locale as QuizLocale;
  }

  return "en";
}

export function ChiosHolidayQuizPage({ locale = "en" }: ChiosHolidayQuizPageProps) {
  const currentLocale = normalizeLocale(locale);
  const ui = uiByLocale[currentLocale];
  const currentQuizData = quizDataByLocale[currentLocale] ?? quizDataByLocale.en!;

  const [questType, setQuestType] = useState<QuestType>("main");
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [mainQuizScore, setMainQuizScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<OptionKey | null>(null);
  const [showResult, setShowResult] = useState(false);

  const currentQuestions = currentQuizData[questType];
  const currentQuestion = currentQuestions[currentIdx];
  const isMiniQuest = questType !== "main";

  const progressPercent = useMemo(() => {
    return Math.round(((currentIdx + 1) / currentQuestions.length) * 100);
  }, [currentIdx, currentQuestions.length]);

  const finalCode = mainQuizScore >= 7 ? "INSIDER15" : "CHIOS10";

  function startQuest(type: QuestType) {
    setQuestType(type);
    setCurrentIdx(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowResult(false);
  }

  function handleAnswer(answer: OptionKey) {
    if (selectedAnswer) {
      return;
    }

    setSelectedAnswer(answer);

    if (answer === currentQuestion.a) {
      setScore((currentScore) => currentScore + 1);
    }
  }

  function handleNext() {
    const nextIdx = currentIdx + 1;

    if (nextIdx < currentQuestions.length) {
      setCurrentIdx(nextIdx);
      setSelectedAnswer(null);
      return;
    }

    if (questType === "main") {
      const finalScore =
        selectedAnswer === currentQuestion.a ? score + 1 : score;

      setMainQuizScore(finalScore);
    }

    setShowResult(true);
  }

  function handleBack() {
    if (currentIdx === 0) {
      return;
    }

    setCurrentIdx((idx) => idx - 1);
    setSelectedAnswer(null);
  }

  function returnToMainResult() {
    setQuestType("main");
    setScore(mainQuizScore);
    setCurrentIdx(currentQuizData.main.length - 1);
    setSelectedAnswer(null);
    setShowResult(true);
  }

  return (
    <main className="chq-page">
      <article className="chq-container" itemScope itemType="https://schema.org/Quiz">
        {!showResult && (
          <header className="chq-header">
            <span className="chq-kicker">{ui.kicker}</span>
            <h1>{ui.title}</h1>
            <p>{ui.description}</p>

            <div className="chq-progress-container">
              <div className="chq-stats">
                <span>
                  {ui.question}: {currentIdx + 1}/{currentQuestions.length}
                </span>
                <span>{progressPercent}%</span>
              </div>
              <div className="chq-bar-bg">
                <div
                  className="chq-bar-fill"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </header>
        )}

        {!showResult && (
          <>
            <section className="chq-question-card">
              <h2>{currentQuestion.q}</h2>

              <div className="chq-options">
                {(Object.entries(currentQuestion.opts) as [OptionKey, string][]).map(
                  ([key, value]) => {
                    const isSelected = selectedAnswer === key;
                    const isCorrect = currentQuestion.a === key;
                    const isWrong = isSelected && !isCorrect;

                    return (
                      <button
                        key={key}
                        type="button"
                        className={[
                          "chq-option",
                          selectedAnswer && isCorrect ? "chq-option--correct" : "",
                          isWrong ? "chq-option--wrong" : "",
                        ]
                          .filter(Boolean)
                          .join(" ")}
                        onClick={() => handleAnswer(key)}
                        disabled={Boolean(selectedAnswer)}
                      >
                        <span>{value}</span>
                      </button>
                    );
                  },
                )}
              </div>

              {selectedAnswer && (
                <div className="chq-tip">
                  <strong>{ui.insiderTip}:</strong> {currentQuestion.tip}
                </div>
              )}
            </section>

            <div className="chq-nav-buttons">
              {currentIdx > 0 && (
                <button type="button" className="chq-btn-outline" onClick={handleBack}>
                  {ui.back}
                </button>
              )}

              {selectedAnswer && (
                <button type="button" className="chq-btn-bronze" onClick={handleNext}>
                  {ui.next}
                </button>
              )}
            </div>
          </>
        )}

        {showResult && isMiniQuest && (
          <section className="chq-result-card">
            <div className="chq-result-header">
              <h2>{ui.miniComplete}</h2>
              <div className="chq-score-badge">
                {score}/{currentQuestions.length}
              </div>
              <p>{ui.miniCompleteText}</p>
            </div>

            <button
              type="button"
              className="chq-btn-bronze-main chq-full-width"
              onClick={returnToMainResult}
            >
              {ui.returnToOffer}
            </button>
          </section>
        )}

        {showResult && !isMiniQuest && (
          <section className="chq-result-card">
            <div className="chq-result-header">
              <h2>{ui.resultTitle}</h2>
              <div className="chq-score-badge">
                {mainQuizScore}/{currentQuizData.main.length}
              </div>
              <p>{mainQuizScore >= 7 ? ui.resultHigh : ui.resultLow}</p>
            </div>

            <div className="chq-house-intro">
              <hr className="chq-divider" />
              <h3>{ui.whyChoose}</h3>
              <p className="chq-house-bio">{ui.houseBio}</p>

              <div className="chq-usp-grid">
                <div className="chq-usp-item">
                  <span className="chq-usp-icon">✨</span>
                  <span className="chq-usp-text">{ui.uspRooms}</span>
                </div>
                <div className="chq-usp-item">
                  <span className="chq-usp-icon">📍</span>
                  <span className="chq-usp-text">{ui.uspLocation}</span>
                </div>
                <div className="chq-usp-item">
                  <span className="chq-usp-icon">🌳</span>
                  <span className="chq-usp-text">{ui.uspSerenity}</span>
                </div>
              </div>
            </div>

            <div className="chq-promo-box">
              <span className="chq-promo-label">{ui.discountLabel}</span>
              <div className="chq-code">{finalCode}</div>
              <a
                href={bookingHrefByLocale[currentLocale]}
                className="chq-btn-bronze-main"
              >
                {ui.bookWithDiscount}
              </a>
            </div>

            <hr className="chq-divider" />

            <div className="chq-mini-quests-section">
              <h3>{ui.miniTitle}</h3>
              <div className="chq-mini-quest-grid">
                <button
                  type="button"
                  className="chq-quest-card"
                  onClick={() => startQuest("beaches")}
                >
                  {ui.beaches}
                </button>
                <button
                  type="button"
                  className="chq-quest-card"
                  onClick={() => startQuest("villages")}
                >
                  {ui.villages}
                </button>
                <button
                  type="button"
                  className="chq-quest-card"
                  onClick={() => startQuest("sights")}
                >
                  {ui.sights}
                </button>
              </div>
            </div>
          </section>
        )}
      </article>

      <style jsx>{`
        .chq-page {
          padding: 44px 16px 56px;
          background:
            radial-gradient(circle at top left, rgba(199, 146, 91, 0.16), transparent 34%),
            #fffaf4;
        }

        .chq-container {
          --chq-bronze: #8b5e34;
          --chq-gold: #c7925b;
          --chq-cream: #fdfaf7;
          --chq-dark: #2c241e;
          --chq-success: #2f6f4e;
          --chq-error: #a52a2a;
          max-width: 880px;
          margin: 0 auto;
          padding: 40px;
          background: var(--chq-cream);
          border-radius: 25px;
          border: 1px solid rgba(139, 94, 52, 0.15);
          box-shadow: 0 15px 45px rgba(0, 0, 0, 0.07);
          color: var(--chq-dark);
        }

        .chq-header {
          text-align: center;
        }

        .chq-kicker {
          display: inline-flex;
          margin-bottom: 10px;
          padding: 7px 12px;
          border-radius: 999px;
          background: rgba(139, 94, 52, 0.1);
          color: var(--chq-bronze);
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .chq-header h1 {
          margin: 0 0 10px;
          color: var(--chq-dark);
          font-size: clamp(28px, 4vw, 46px);
          line-height: 1.05;
        }

        .chq-header p {
          margin: 0 auto 24px;
          max-width: 650px;
          color: #5b5048;
          font-size: 17px;
          line-height: 1.7;
        }

        .chq-progress-container {
          margin-top: 24px;
        }

        .chq-stats {
          display: flex;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 7px;
          color: var(--chq-bronze);
          font-size: 13px;
          font-weight: 800;
        }

        .chq-bar-bg {
          height: 10px;
          overflow: hidden;
          border-radius: 999px;
          background: #eee5db;
        }

        .chq-bar-fill {
          height: 100%;
          border-radius: inherit;
          background: linear-gradient(90deg, var(--chq-bronze), var(--chq-gold));
          transition: width 0.35s ease;
        }

        .chq-question-card {
          margin-top: 28px;
          animation: chqFadeIn 0.25s ease;
        }

        .chq-question-card h2 {
          margin: 0 0 18px;
          color: var(--chq-dark);
          font-size: clamp(20px, 3vw, 28px);
          line-height: 1.25;
          text-align: center;
        }

        .chq-options {
          display: grid;
          gap: 12px;
        }

        .chq-option {
          display: flex;
          width: 100%;
          align-items: center;
          justify-content: flex-start;
          padding: 18px;
          background: #fff;
          border: 2px solid #eee;
          border-radius: 15px;
          color: var(--chq-dark);
          cursor: pointer;
          font: inherit;
          font-weight: 750;
          text-align: left;
          transition:
            border-color 0.2s ease,
            background 0.2s ease,
            transform 0.2s ease;
        }

        .chq-option:hover:not(:disabled) {
          border-color: var(--chq-gold);
          transform: translateY(-1px);
        }

        .chq-option:disabled {
          cursor: default;
        }

        .chq-option--correct {
          border-color: var(--chq-success) !important;
          background: #f0f7f3 !important;
        }

        .chq-option--wrong {
          border-color: var(--chq-error) !important;
          background: #fdf2f2 !important;
        }

        .chq-tip {
          margin-top: 20px;
          padding: 18px;
          background: #fff;
          border-left: 4px solid var(--chq-gold);
          border-radius: 10px;
          color: #4d4239;
          font-size: 15px;
          line-height: 1.65;
          animation: chqFadeIn 0.25s ease;
        }

        .chq-nav-buttons {
          display: flex;
          min-height: 58px;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin-top: 25px;
        }

        .chq-btn-outline,
        .chq-btn-bronze,
        .chq-btn-bronze-main {
          display: inline-flex;
          min-height: 54px;
          align-items: center;
          justify-content: center;
          border-radius: 999px;
          font-size: 14px;
          font-weight: 900;
          letter-spacing: 0.02em;
          text-decoration: none;
          text-transform: uppercase;
          cursor: pointer;
          transition:
            background 0.2s ease,
            transform 0.2s ease,
            border-color 0.2s ease;
        }

        .chq-btn-outline {
          flex: 1;
          padding: 0 22px;
          background: transparent;
          color: var(--chq-dark);
          border: 2px solid var(--chq-dark);
        }

        .chq-btn-bronze {
          flex: 2;
          padding: 0 22px;
          background: var(--chq-bronze);
          color: #fff;
          border: 0;
        }

        .chq-btn-bronze:hover,
        .chq-btn-bronze-main:hover {
          transform: translateY(-1px);
          background: var(--chq-gold);
        }

        .chq-btn-bronze-main {
          padding: 16px 28px;
          background: linear-gradient(135deg, var(--chq-bronze), var(--chq-gold));
          color: #fff;
          border: 0;
        }

        .chq-full-width {
          width: 100%;
        }

        .chq-result-card {
          animation: chqFadeIn 0.35s ease;
        }

        .chq-result-header {
          text-align: center;
        }

        .chq-result-header h2 {
          margin: 0;
          color: var(--chq-dark);
          font-size: clamp(26px, 4vw, 40px);
        }

        .chq-result-header p {
          max-width: 650px;
          margin: 0 auto 10px;
          color: #5b5048;
          font-size: 17px;
          line-height: 1.7;
        }

        .chq-score-badge {
          margin: 10px 0;
          color: var(--chq-bronze);
          font-size: clamp(44px, 7vw, 64px);
          font-weight: 950;
          line-height: 1;
          text-align: center;
        }

        .chq-divider {
          margin: 28px 0;
          border: 0;
          border-top: 1px solid rgba(139, 94, 52, 0.18);
        }

        .chq-house-intro {
          text-align: center;
        }

        .chq-house-intro h3,
        .chq-mini-quests-section h3 {
          margin: 0 0 10px;
          color: var(--chq-dark);
          font-size: 24px;
        }

        .chq-house-bio {
          max-width: 680px;
          margin: 0 auto;
          color: #5b5048;
          line-height: 1.7;
        }

        .chq-usp-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          margin: 22px 0 0;
        }

        .chq-usp-item {
          display: flex;
          min-height: 118px;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 16px 10px;
          background: #fff;
          border: 1px solid #eee;
          border-radius: 16px;
          text-align: center;
        }

        .chq-usp-icon {
          font-size: 25px;
        }

        .chq-usp-text {
          margin-top: 9px;
          color: var(--chq-bronze);
          font-size: 11px;
          font-weight: 900;
          line-height: 1.35;
          text-transform: uppercase;
        }

        .chq-promo-box {
          margin: 28px 0;
          padding: 30px;
          background: #fff;
          border: 2px dashed var(--chq-gold);
          border-radius: 20px;
          text-align: center;
        }

        .chq-promo-label {
          display: block;
          color: var(--chq-bronze);
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .chq-code {
          margin: 15px 0;
          color: var(--chq-dark);
          font-size: clamp(34px, 6vw, 46px);
          font-weight: 950;
          letter-spacing: 5px;
        }

        .chq-mini-quests-section {
          text-align: center;
        }

        .chq-mini-quest-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          margin-top: 15px;
        }

        .chq-quest-card {
          padding: 18px 14px;
          background: #fff;
          border: 1px solid var(--chq-gold);
          border-radius: 18px;
          color: var(--chq-dark);
          cursor: pointer;
          font: inherit;
          font-size: 15px;
          font-weight: 900;
          text-align: center;
          transition:
            background 0.2s ease,
            transform 0.2s ease,
            border-color 0.2s ease;
        }

        .chq-quest-card:hover {
          background: #fff8ee;
          transform: translateY(-3px);
        }

        @keyframes chqFadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 700px) {
          .chq-page {
            padding: 24px 12px 40px;
          }

          .chq-container {
            padding: 22px;
            border-radius: 20px;
          }

          .chq-nav-buttons {
            flex-direction: column;
          }

          .chq-btn-outline,
          .chq-btn-bronze {
            width: 100%;
            flex: unset;
          }

          .chq-usp-grid,
          .chq-mini-quest-grid {
            grid-template-columns: 1fr;
          }

          .chq-code {
            letter-spacing: 3px;
          }
        }
      `}</style>
    </main>
  );
}