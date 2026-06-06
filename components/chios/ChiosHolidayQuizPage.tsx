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
  en: "/chios-hotels-rates/",
  el: "/el/amesi-kratisi-voulamandis-house/",
  fr: "/fr/tarifs-des-hotels-a-chios/",
  de: "/de/hotelpreise-auf-der-insel-chios/",
  it: "/it/prezzi-hotel-chios/",
  es: "/es/los-mejores-precios-de-hotel-en-la-isla-chios/",
  tr: "/tr/sakiz-adasi-rezervasyon/",
};

const uiByLocale = {
  "en": {
    "kicker": "Chios quiz",
    "title": "Are you a Chios Insider? 🍋",
    "description": "Discover the island's secrets and win a special discount for your stay in Kampos.",
    "question": "Question",
    "back": "← Back",
    "next": "Next question →",
    "insiderTip": "Insider Tip 💡",
    "resultTitle": "You're a Chios Insider! 🏆",
    "resultHigh": "You are a Chios expert! You deserve our maximum discount.",
    "resultLow": "Great effort! Chios is waiting for you to discover its secrets.",
    "whyChoose": "Why choose Voulamandis House 🍊",
    "houseBio": "Experience the authentic Kampos lifestyle. Our family estate is the perfect base for your Chian adventures.",
    "uspRooms": "Value for Money Renovated Rooms",
    "uspLocation": "Strategic Location for Exploring",
    "uspSerenity": "Serenity among the Orange Groves",
    "discountLabel": "Your personal discount code:",
    "bookWithDiscount": "Book with discount",
    "miniTitle": "Continue the Exploration",
    "beaches": "🏖️ Beaches",
    "villages": "🏰 Villages",
    "sights": "🏛️ Sights",
    "miniComplete": "Mini Quest Completed! 🌟",
    "miniCompleteText": "Great job! You are becoming a true Chios expert.",
    "returnToOffer": "Return to Offer"
  },
  "el": {
    "kicker": "Κουίζ για τη Χίο",
    "title": "Είσαι Chios Insider; 🍋",
    "description": "Ανακάλυψε τα μυστικά του νησιού και κέρδισε ειδικό εκπτωτικό κωδικό για τη διαμονή σου στον Κάμπο.",
    "question": "Ερώτηση",
    "back": "← Πίσω",
    "next": "Επόμενη ερώτηση →",
    "insiderTip": "Συμβουλή Insider 💡",
    "resultTitle": "Είσαι Chios Insider! 🏆",
    "resultHigh": "Ξέρεις πολύ καλά τη Χίο! Κέρδισες τον μεγαλύτερο εκπτωτικό κωδικό.",
    "resultLow": "Πολύ καλή προσπάθεια! Η Χίος σε περιμένει να ανακαλύψεις τα μυστικά της.",
    "whyChoose": "Γιατί να επιλέξεις το Voulamandis House 🍊",
    "houseBio": "Ζήσε την αυθεντική ατμόσφαιρα του Κάμπου. Το οικογενειακό μας κτήμα είναι ιδανική βάση για να γνωρίσεις τη Χίο.",
    "uspRooms": "Ανακαινισμένα δωμάτια με καλή σχέση ποιότητας-τιμής",
    "uspLocation": "Στρατηγική τοποθεσία για εξερεύνηση",
    "uspSerenity": "Ηρεμία ανάμεσα στα περιβόλια",
    "discountLabel": "Ο προσωπικός σου εκπτωτικός κωδικός:",
    "bookWithDiscount": "Κράτηση με έκπτωση",
    "miniTitle": "Συνέχισε την εξερεύνηση",
    "beaches": "🏖️ Παραλίες",
    "villages": "🏰 Χωριά",
    "sights": "🏛️ Αξιοθέατα",
    "miniComplete": "Το mini quest ολοκληρώθηκε! 🌟",
    "miniCompleteText": "Μπράβο! Γίνεσαι πραγματικός γνώστης της Χίου.",
    "returnToOffer": "Επιστροφή στην προσφορά"
  },
  "fr": {
    "kicker": "Quiz sur Chios",
    "title": "Êtes-vous un Chios Insider ? 🍋",
    "description": "Découvrez les secrets de l’île et gagnez un code de réduction spécial pour votre séjour à Kampos.",
    "question": "Question",
    "back": "← Retour",
    "next": "Question suivante →",
    "insiderTip": "Conseil d’initié 💡",
    "resultTitle": "Vous êtes un Chios Insider ! 🏆",
    "resultHigh": "Vous connaissez très bien Chios ! Vous méritez notre meilleure réduction.",
    "resultLow": "Très bel effort ! Chios vous attend pour révéler ses secrets.",
    "whyChoose": "Pourquoi choisir Voulamandis House 🍊",
    "houseBio": "Découvrez le style de vie authentique de Kampos. Notre domaine familial est une base idéale pour explorer Chios.",
    "uspRooms": "Chambres rénovées au bon rapport qualité-prix",
    "uspLocation": "Emplacement stratégique pour explorer",
    "uspSerenity": "Calme au milieu des orangeraies",
    "discountLabel": "Votre code de réduction personnel :",
    "bookWithDiscount": "Réserver avec réduction",
    "miniTitle": "Continuez l’exploration",
    "beaches": "🏖️ Plages",
    "villages": "🏰 Villages",
    "sights": "🏛️ Sites",
    "miniComplete": "Mini quest terminé ! 🌟",
    "miniCompleteText": "Bravo ! Vous devenez un vrai expert de Chios.",
    "returnToOffer": "Retour à l’offre"
  },
  "de": {
    "kicker": "Chios-Quiz",
    "title": "Sind Sie ein Chios Insider? 🍋",
    "description": "Entdecken Sie die Geheimnisse der Insel und gewinnen Sie einen besonderen Rabattcode für Ihren Aufenthalt in Kampos.",
    "question": "Frage",
    "back": "← Zurück",
    "next": "Nächste Frage →",
    "insiderTip": "Insider-Tipp 💡",
    "resultTitle": "Sie sind ein Chios Insider! 🏆",
    "resultHigh": "Sie kennen Chios sehr gut! Sie verdienen unseren besten Rabatt.",
    "resultLow": "Sehr gut gemacht! Chios wartet darauf, von Ihnen entdeckt zu werden.",
    "whyChoose": "Warum Voulamandis House wählen 🍊",
    "houseBio": "Erleben Sie den authentischen Lebensstil von Kampos. Unser Familienanwesen ist der ideale Ausgangspunkt für Chios.",
    "uspRooms": "Renovierte Zimmer mit gutem Preis-Leistungs-Verhältnis",
    "uspLocation": "Strategische Lage zum Erkunden",
    "uspSerenity": "Ruhe zwischen Orangenhainen",
    "discountLabel": "Ihr persönlicher Rabattcode:",
    "bookWithDiscount": "Mit Rabatt buchen",
    "miniTitle": "Entdeckung fortsetzen",
    "beaches": "🏖️ Strände",
    "villages": "🏰 Dörfer",
    "sights": "🏛️ Sehenswürdigkeiten",
    "miniComplete": "Mini Quest abgeschlossen! 🌟",
    "miniCompleteText": "Sehr gut! Sie werden ein echter Chios-Experte.",
    "returnToOffer": "Zurück zum Angebot"
  },
  "it": {
    "kicker": "Quiz su Chios",
    "title": "Sei un Chios Insider? 🍋",
    "description": "Scopri i segreti dell’isola e ricevi un codice sconto speciale per il tuo soggiorno a Kampos.",
    "question": "Domanda",
    "back": "← Indietro",
    "next": "Domanda successiva →",
    "insiderTip": "Consiglio da insider 💡",
    "resultTitle": "Sei un Chios Insider! 🏆",
    "resultHigh": "Conosci molto bene Chios! Ti meriti il nostro sconto migliore.",
    "resultLow": "Ottimo tentativo! Chios ti aspetta per svelarti i suoi segreti.",
    "whyChoose": "Perché scegliere Voulamandis House 🍊",
    "houseBio": "Vivi l’autentica atmosfera di Kampos. La nostra tenuta familiare è la base ideale per esplorare Chios.",
    "uspRooms": "Camere rinnovate con ottimo rapporto qualità-prezzo",
    "uspLocation": "Posizione strategica per esplorare",
    "uspSerenity": "Tranquillità tra gli aranceti",
    "discountLabel": "Il tuo codice sconto personale:",
    "bookWithDiscount": "Prenota con sconto",
    "miniTitle": "Continua l’esplorazione",
    "beaches": "🏖️ Spiagge",
    "villages": "🏰 Villaggi",
    "sights": "🏛️ Luoghi d’interesse",
    "miniComplete": "Mini quest completata! 🌟",
    "miniCompleteText": "Ottimo lavoro! Stai diventando un vero esperto di Chios.",
    "returnToOffer": "Torna all’offerta"
  },
  "es": {
    "kicker": "Quiz sobre Quíos",
    "title": "¿Eres un Chios Insider? 🍋",
    "description": "Descubre los secretos de la isla y consigue un código de descuento especial para tu estancia en Kampos.",
    "question": "Pregunta",
    "back": "← Atrás",
    "next": "Siguiente pregunta →",
    "insiderTip": "Consejo insider 💡",
    "resultTitle": "¡Eres un Chios Insider! 🏆",
    "resultHigh": "¡Conoces muy bien Quíos! Mereces nuestro mayor descuento.",
    "resultLow": "¡Muy buen intento! Quíos te espera para descubrir sus secretos.",
    "whyChoose": "Por qué elegir Voulamandis House 🍊",
    "houseBio": "Vive el auténtico ambiente de Kampos. Nuestra finca familiar es una base ideal para explorar Quíos.",
    "uspRooms": "Habitaciones renovadas con buena relación calidad-precio",
    "uspLocation": "Ubicación estratégica para explorar",
    "uspSerenity": "Tranquilidad entre naranjos",
    "discountLabel": "Tu código de descuento personal:",
    "bookWithDiscount": "Reservar con descuento",
    "miniTitle": "Continúa la exploración",
    "beaches": "🏖️ Playas",
    "villages": "🏰 Pueblos",
    "sights": "🏛️ Lugares de interés",
    "miniComplete": "¡Mini quest completada! 🌟",
    "miniCompleteText": "¡Buen trabajo! Te estás convirtiendo en un experto en Quíos.",
    "returnToOffer": "Volver a la oferta"
  },
  "tr": {
    "kicker": "Sakız Adası testi",
    "title": "Chios Insider mısınız? 🍋",
    "description": "Adanın sırlarını keşfedin ve Kampos’taki konaklamanız için özel indirim kodu kazanın.",
    "question": "Soru",
    "back": "← Geri",
    "next": "Sonraki soru →",
    "insiderTip": "Insider ipucu 💡",
    "resultTitle": "Chios Insider oldunuz! 🏆",
    "resultHigh": "Sakız Adası’nı çok iyi biliyorsunuz! En iyi indirimi hak ettiniz.",
    "resultLow": "Çok iyi deneme! Sakız Adası sırlarını keşfetmeniz için sizi bekliyor.",
    "whyChoose": "Neden Voulamandis House 🍊",
    "houseBio": "Kampos’un otantik atmosferini yaşayın. Aile işletmemiz, Sakız Adası’nı keşfetmek için ideal bir başlangıç noktasıdır.",
    "uspRooms": "Yenilenmiş ve uygun fiyatlı odalar",
    "uspLocation": "Keşif için stratejik konum",
    "uspSerenity": "Portakal bahçeleri arasında huzur",
    "discountLabel": "Kişisel indirim kodunuz:",
    "bookWithDiscount": "İndirimle rezervasyon yap",
    "miniTitle": "Keşfe devam edin",
    "beaches": "🏖️ Plajlar",
    "villages": "🏰 Köyler",
    "sights": "🏛️ Gezilecek yerler",
    "miniComplete": "Mini quest tamamlandı! 🌟",
    "miniCompleteText": "Harika! Gerçek bir Sakız Adası uzmanı oluyorsunuz.",
    "returnToOffer": "Teklife dön"
  }
} satisfies Record<QuizLocale, {
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
}>;

const quizDataByLocale = {
  "en": {
    "main": [
      {
        "q": "What will you find behind the high stone walls in Kampos?",
        "a": "b",
        "opts": {
          "a": "Shopping malls.",
          "b": "Citrus orchards and water wheels.",
          "c": "Large hotels."
        },
        "tip": "Kampos is famous for historic mansions, citrus orchards and the scent of orange blossoms."
      },
      {
        "q": "Which Chios monument is a UNESCO World Heritage site?",
        "a": "a",
        "opts": {
          "a": "Nea Moni Monastery.",
          "b": "The Castle of Chios.",
          "c": "Anavatos."
        },
        "tip": "The mosaics of Nea Moni are masterpieces of Byzantine art."
      },
      {
        "q": "What are the 'Xysta' patterns in Pyrgi?",
        "a": "c",
        "opts": {
          "a": "A local dessert.",
          "b": "A traditional dance.",
          "c": "Geometric wall decorations."
        },
        "tip": "Xysta are a unique decorative technique that makes Pyrgi instantly recognizable."
      },
      {
        "q": "How is authentic Chios mastic produced?",
        "a": "a",
        "opts": {
          "a": "By incisions on the trunk of the mastic tree.",
          "b": "From the fruits of the tree.",
          "c": "From the leaves."
        },
        "tip": "Chios is the only place in the world where the mastic tree produces the famous resin."
      },
      {
        "q": "Why are the pebbles at Mavra Volia beach black?",
        "a": "b",
        "opts": {
          "a": "Because of pollution.",
          "b": "Because of volcanic origin.",
          "c": "They are painted."
        },
        "tip": "Mavra Volia is one of the most impressive beaches of Chios, with black volcanic pebbles."
      },
      {
        "q": "Where does the famous Rocket War take place?",
        "a": "a",
        "opts": {
          "a": "In Vrontados.",
          "b": "In Mesta.",
          "c": "In Lagada."
        },
        "tip": "The Rocket War is one of the most famous Easter traditions of Chios."
      },
      {
        "q": "Which village is built like a medieval fortress?",
        "a": "c",
        "opts": {
          "a": "Kardamyla.",
          "b": "Thymiana.",
          "c": "Mesta."
        },
        "tip": "In Mesta, the houses are joined together to protect the village from attacks."
      },
      {
        "q": "What is a 'magganos' in the estates of Kampos?",
        "a": "b",
        "opts": {
          "a": "A mastic tool.",
          "b": "A traditional water-drawing mechanism.",
          "c": "A type of boat."
        },
        "tip": "The magganos was essential for irrigating the citrus orchards of Kampos for centuries."
      },
      {
        "q": "Which ancient poet is said to have taught on Chios?",
        "a": "a",
        "opts": {
          "a": "Homer.",
          "b": "Hesiod.",
          "c": "Pindar."
        },
        "tip": "Daskalopetra, also known as Homer’s Stone, is connected with this tradition."
      },
      {
        "q": "Why choose Voulamandis House for your stay? 🍊",
        "a": "d",
        "opts": {
          "a": "For the renovated rooms.",
          "b": "For the strategic location.",
          "c": "For the authentic hospitality.",
          "d": "All of the above!"
        },
        "tip": "We would be delighted to welcome you to our family estate in Kampos."
      }
    ],
    "beaches": [
      {
        "q": "Which beach has fine sand and shallow waters?",
        "a": "a",
        "opts": {
          "a": "Karfas.",
          "b": "Mavra Volia.",
          "c": "Agia Dinami."
        },
        "tip": "Karfas is ideal for families with children."
      },
      {
        "q": "Where is Agia Dinami located?",
        "a": "b",
        "opts": {
          "a": "In northern Chios.",
          "b": "In southern Chios, near Olympi.",
          "c": "In central Chios."
        },
        "tip": "Agia Dinami is one of the most exotic beaches on the island."
      },
      {
        "q": "Which beach is known for its peaceful sunset?",
        "a": "c",
        "opts": {
          "a": "Komi.",
          "b": "Vrontados.",
          "c": "Elinda."
        },
        "tip": "At Elinda, the waters are usually calm and crystal clear."
      },
      {
        "q": "Which is the largest beach in western Chios?",
        "a": "a",
        "opts": {
          "a": "Managros.",
          "b": "Lefkathia.",
          "c": "Trachili."
        },
        "tip": "Managros is a long sandy beach, ideal for relaxation."
      },
      {
        "q": "Which beach near Mesta is known for its beach bar?",
        "a": "b",
        "opts": {
          "a": "Giosonas.",
          "b": "Apothika.",
          "c": "Nagos."
        },
        "tip": "Apothika is popular for kayaking and deep blue waters."
      },
      {
        "q": "Where can you find the green beach of Nagos?",
        "a": "c",
        "opts": {
          "a": "In southern Chios.",
          "b": "In western Chios.",
          "c": "In northern Chios, near Kardamyla."
        },
        "tip": "Nagos combines green scenery, natural springs and the sea."
      },
      {
        "q": "Which beach has white pebbles and cool waters, with a name linked to a hero?",
        "a": "a",
        "opts": {
          "a": "Giosonas.",
          "b": "Karfas.",
          "c": "Bella Vista."
        },
        "tip": "Giosonas is linked by name to Jason of the Argonauts."
      }
    ],
    "villages": [
      {
        "q": "Which village is called the 'Mystras of the Aegean'?",
        "a": "b",
        "opts": {
          "a": "Pyrgi.",
          "b": "Anavatos.",
          "c": "Volissos."
        },
        "tip": "Anavatos is a historic abandoned settlement built on a steep rock."
      },
      {
        "q": "Where is the Chios Mastic Museum located?",
        "a": "a",
        "opts": {
          "a": "In Pyrgi.",
          "b": "In Mesta.",
          "c": "In Armolia."
        },
        "tip": "The museum offers beautiful views over the mastic groves of southern Chios."
      },
      {
        "q": "Which village is famous for ceramics?",
        "a": "c",
        "opts": {
          "a": "Kallimasia.",
          "b": "Thymiana.",
          "c": "Armolia."
        },
        "tip": "In Armolia you can find handmade clay objects and souvenirs."
      },
      {
        "q": "Where is the castle associated with Belisarius located?",
        "a": "a",
        "opts": {
          "a": "In Volissos.",
          "b": "In Olympi.",
          "c": "In Vessa."
        },
        "tip": "The castle rises above Volissos with views of the Aegean Sea."
      },
      {
        "q": "Which village is built with local red stone?",
        "a": "b",
        "opts": {
          "a": "Vrontados.",
          "b": "Thymiana.",
          "c": "Nenita."
        },
        "tip": "Thymiana stone was also used in many mansions of Kampos."
      },
      {
        "q": "In which village is the historic giant plane tree?",
        "a": "c",
        "opts": {
          "a": "Kardamyla.",
          "b": "Lagada.",
          "c": "Pityos."
        },
        "tip": "Pityos is an old mountain village with a special history."
      },
      {
        "q": "Which village is home to great sailors and shipowners?",
        "a": "a",
        "opts": {
          "a": "Kardamyla.",
          "b": "Olympi.",
          "c": "Vessa."
        },
        "tip": "Kardamyla has a very strong maritime tradition."
      }
    ],
    "sights": [
      {
        "q": "What is Daskalio near Oinousses?",
        "a": "b",
        "opts": {
          "a": "A school.",
          "b": "An islet with a church.",
          "c": "A cave."
        },
        "tip": "Daskalio is a picturesque spot often reached by boat."
      },
      {
        "q": "Where is Olympi Cave located?",
        "a": "a",
        "opts": {
          "a": "In southern Chios.",
          "b": "In northern Chios.",
          "c": "In central Chios."
        },
        "tip": "The cave has impressive stalactites and a stable temperature."
      },
      {
        "q": "Is the Castle of Chios town still inhabited?",
        "a": "c",
        "opts": {
          "a": "No, it is only ruins.",
          "b": "Only in the morning.",
          "c": "Yes, it is a living neighborhood."
        },
        "tip": "It is one of the few inhabited castles in Greece."
      },
      {
        "q": "Where is the historic Korais Library?",
        "a": "a",
        "opts": {
          "a": "In Chios Town.",
          "b": "In Pyrgi.",
          "c": "In Mesta."
        },
        "tip": "It is one of the oldest and most important libraries in Greece."
      },
      {
        "q": "What were the vigles used for?",
        "a": "b",
        "opts": {
          "a": "Harvesting mastic.",
          "b": "Coastal watchtowers.",
          "c": "Lighthouses."
        },
        "tip": "They warned residents about pirate raids."
      },
      {
        "q": "Saint Markella Monastery is located near...",
        "a": "c",
        "opts": {
          "a": "Kampos.",
          "b": "Psara.",
          "c": "Volissos."
        },
        "tip": "Saint Markella is considered the patron saint of Chios and is celebrated on July 22."
      },
      {
        "q": "What can you see in the Castle's Ottoman Baths?",
        "a": "a",
        "opts": {
          "a": "A restored hammam.",
          "b": "A prison cell.",
          "c": "A water well."
        },
        "tip": "The hammam is a beautifully preserved monument inside the Castle."
      }
    ]
  },
  "el": {
    "main": [
      {
        "q": "Τι θα βρεις πίσω από τους ψηλούς πέτρινους τοίχους στον Κάμπο;",
        "a": "b",
        "opts": {
          "a": "Εμπορικά κέντρα.",
          "b": "Περιβόλια εσπεριδοειδών και μάγγανους.",
          "c": "Μεγάλα ξενοδοχεία."
        },
        "tip": "Ο Κάμπος είναι γνωστός για τα αρχοντικά, τα περιβόλια και το άρωμα των εσπεριδοειδών."
      },
      {
        "q": "Ποιο μνημείο της Χίου είναι Μνημείο Παγκόσμιας Κληρονομιάς UNESCO;",
        "a": "a",
        "opts": {
          "a": "Η Νέα Μονή.",
          "b": "Το Κάστρο της Χίου.",
          "c": "Ο Ανάβατος."
        },
        "tip": "Τα ψηφιδωτά της Νέας Μονής θεωρούνται αριστουργήματα της βυζαντινής τέχνης."
      },
      {
        "q": "Τι είναι τα «ξυστά» στο Πυργί;",
        "a": "c",
        "opts": {
          "a": "Τοπικό γλυκό.",
          "b": "Παραδοσιακός χορός.",
          "c": "Γεωμετρικά σχέδια στους τοίχους."
        },
        "tip": "Τα ξυστά είναι μοναδική τεχνική διακόσμησης που κάνει το Πυργί αμέσως αναγνωρίσιμο."
      },
      {
        "q": "Πώς παράγεται η αυθεντική μαστίχα Χίου;",
        "a": "a",
        "opts": {
          "a": "Με χαράξεις στον κορμό του σχίνου.",
          "b": "Από τους καρπούς του δέντρου.",
          "c": "Από τα φύλλα."
        },
        "tip": "Η Χίος είναι το μοναδικό μέρος στον κόσμο όπου ο σχίνος δίνει τη φημισμένη μαστίχα."
      },
      {
        "q": "Γιατί είναι μαύρα τα βότσαλα στα Μαύρα Βόλια;",
        "a": "b",
        "opts": {
          "a": "Λόγω ρύπανσης.",
          "b": "Λόγω ηφαιστειακής προέλευσης.",
          "c": "Είναι βαμμένα."
        },
        "tip": "Τα Μαύρα Βόλια είναι μία από τις πιο εντυπωσιακές παραλίες της Χίου, με ηφαιστειακά μαύρα βότσαλα."
      },
      {
        "q": "Πού γίνεται ο περίφημος Ρουκετοπόλεμος;",
        "a": "a",
        "opts": {
          "a": "Στον Βροντάδο.",
          "b": "Στα Μεστά.",
          "c": "Στη Λαγκάδα."
        },
        "tip": "Ο Ρουκετοπόλεμος είναι ένα από τα πιο γνωστά πασχαλινά έθιμα της Χίου."
      },
      {
        "q": "Ποιο χωριό είναι χτισμένο σαν μεσαιωνικό φρούριο;",
        "a": "c",
        "opts": {
          "a": "Τα Καρδάμυλα.",
          "b": "Τα Θυμιανά.",
          "c": "Τα Μεστά."
        },
        "tip": "Στα Μεστά τα σπίτια είναι ενωμένα μεταξύ τους, προστατεύοντας τον οικισμό από επιδρομές."
      },
      {
        "q": "Τι είναι ο «μάγγανος» στα κτήματα του Κάμπου;",
        "a": "b",
        "opts": {
          "a": "Εργαλείο για τη μαστίχα.",
          "b": "Παραδοσιακός μηχανισμός άντλησης νερού.",
          "c": "Τύπος βάρκας."
        },
        "tip": "Ο μάγγανος ήταν βασικό κομμάτι της άρδευσης των περιβολιών του Κάμπου για αιώνες."
      },
      {
        "q": "Ποιος αρχαίος ποιητής λέγεται ότι δίδαξε στη Χίο;",
        "a": "a",
        "opts": {
          "a": "Ο Όμηρος.",
          "b": "Ο Ησίοδος.",
          "c": "Ο Πίνδαρος."
        },
        "tip": "Η Δασκαλόπετρα, γνωστή και ως Πέτρα του Ομήρου, συνδέεται με αυτή την παράδοση."
      },
      {
        "q": "Γιατί να επιλέξεις το Voulamandis House για τη διαμονή σου; 🍊",
        "a": "d",
        "opts": {
          "a": "Για τα ανακαινισμένα δωμάτια.",
          "b": "Για τη στρατηγική τοποθεσία.",
          "c": "Για την αυθεντική φιλοξενία.",
          "d": "Όλα τα παραπάνω!"
        },
        "tip": "Θα χαρούμε πολύ να σε φιλοξενήσουμε στο οικογενειακό μας κτήμα στον Κάμπο."
      }
    ],
    "beaches": [
      {
        "q": "Ποια παραλία έχει ψιλή άμμο και ρηχά νερά;",
        "a": "a",
        "opts": {
          "a": "Ο Καρφάς.",
          "b": "Τα Μαύρα Βόλια.",
          "c": "Η Αγία Δύναμη."
        },
        "tip": "Ο Καρφάς είναι ιδανικός για οικογένειες με παιδιά."
      },
      {
        "q": "Πού βρίσκεται η Αγία Δύναμη;",
        "a": "b",
        "opts": {
          "a": "Στη βόρεια Χίο.",
          "b": "Στη νότια Χίο, κοντά στους Ολύμπους.",
          "c": "Στην κεντρική Χίο."
        },
        "tip": "Η Αγία Δύναμη είναι μία από τις πιο εξωτικές παραλίες του νησιού."
      },
      {
        "q": "Ποια παραλία είναι γνωστή για το ήρεμο ηλιοβασίλεμά της;",
        "a": "c",
        "opts": {
          "a": "Η Κώμη.",
          "b": "Ο Βροντάδος.",
          "c": "Η Ελίντα."
        },
        "tip": "Στην Ελίντα τα νερά είναι συνήθως ήρεμα και κρυστάλλινα."
      },
      {
        "q": "Ποια είναι η μεγαλύτερη παραλία της δυτικής Χίου;",
        "a": "a",
        "opts": {
          "a": "Ο Μάναγρος.",
          "b": "Τα Λευκάθια.",
          "c": "Το Τραχήλι."
        },
        "tip": "Ο Μάναγρος είναι μεγάλη αμμώδης παραλία, ιδανική για χαλάρωση."
      },
      {
        "q": "Ποια παραλία κοντά στα Μεστά είναι γνωστή για το beach bar της;",
        "a": "b",
        "opts": {
          "a": "Ο Γιόσωνας.",
          "b": "Τα Αποθήκα.",
          "c": "Ο Ναγός."
        },
        "tip": "Τα Αποθήκα είναι δημοφιλές σημείο για καγιάκ και βαθιά μπλε νερά."
      },
      {
        "q": "Πού θα βρεις την καταπράσινη παραλία Ναγός;",
        "a": "c",
        "opts": {
          "a": "Στη νότια Χίο.",
          "b": "Στη δυτική Χίο.",
          "c": "Στη βόρεια Χίο, κοντά στα Καρδάμυλα."
        },
        "tip": "Ο Ναγός συνδυάζει καταπράσινο τοπίο, πηγές και θάλασσα."
      },
      {
        "q": "Ποια παραλία έχει λευκά βότσαλα και κρύα νερά, με όνομα που θυμίζει ήρωα;",
        "a": "a",
        "opts": {
          "a": "Ο Γιόσωνας.",
          "b": "Ο Καρφάς.",
          "c": "Η Bella Vista."
        },
        "tip": "Ο Γιόσωνας συνδέεται ονομαστικά με τον Ιάσονα των Αργοναυτών."
      }
    ],
    "villages": [
      {
        "q": "Ποιο χωριό αποκαλείται «Μυστράς του Αιγαίου»;",
        "a": "b",
        "opts": {
          "a": "Το Πυργί.",
          "b": "Ο Ανάβατος.",
          "c": "Η Βολισσός."
        },
        "tip": "Ο Ανάβατος είναι ιστορικός ερειπωμένος οικισμός χτισμένος σε απόκρημνο βράχο."
      },
      {
        "q": "Πού βρίσκεται το Μουσείο Μαστίχας Χίου;",
        "a": "a",
        "opts": {
          "a": "Στο Πυργί.",
          "b": "Στα Μεστά.",
          "c": "Στα Αρμόλια."
        },
        "tip": "Το Μουσείο Μαστίχας έχει όμορφη θέα στους μαστιχώνες της νότιας Χίου."
      },
      {
        "q": "Ποιο χωριό είναι γνωστό για τα κεραμικά του;",
        "a": "c",
        "opts": {
          "a": "Η Καλλιμασιά.",
          "b": "Τα Θυμιανά.",
          "c": "Τα Αρμόλια."
        },
        "tip": "Στα Αρμόλια μπορείς να βρεις χειροποίητα πήλινα αντικείμενα και αναμνηστικά."
      },
      {
        "q": "Πού βρίσκεται το κάστρο που συνδέεται με τον Βελισάριο;",
        "a": "a",
        "opts": {
          "a": "Στη Βολισσό.",
          "b": "Στους Ολύμπους.",
          "c": "Στη Βέσσα."
        },
        "tip": "Το κάστρο δεσπόζει πάνω από τη Βολισσό με θέα στο Αιγαίο."
      },
      {
        "q": "Ποιο χωριό είναι χτισμένο με την τοπική κόκκινη πέτρα;",
        "a": "b",
        "opts": {
          "a": "Ο Βροντάδος.",
          "b": "Τα Θυμιανά.",
          "c": "Τα Νένητα."
        },
        "tip": "Η θυμιανούσικη πέτρα χρησιμοποιήθηκε και σε πολλά αρχοντικά του Κάμπου."
      },
      {
        "q": "Σε ποιο χωριό βρίσκεται ο ιστορικός μεγάλος πλάτανος;",
        "a": "c",
        "opts": {
          "a": "Στα Καρδάμυλα.",
          "b": "Στη Λαγκάδα.",
          "c": "Στο Πιτυός."
        },
        "tip": "Το Πιτυός είναι παλιός ορεινός οικισμός με ιδιαίτερη ιστορία."
      },
      {
        "q": "Ποιο χωριό είναι πατρίδα σπουδαίων ναυτικών και εφοπλιστών;",
        "a": "a",
        "opts": {
          "a": "Τα Καρδάμυλα.",
          "b": "Οι Ολύμποι.",
          "c": "Η Βέσσα."
        },
        "tip": "Τα Καρδάμυλα έχουν μεγάλη ναυτική παράδοση."
      }
    ],
    "sights": [
      {
        "q": "Τι είναι το Δασκαλιό κοντά στις Οινούσσες;",
        "a": "b",
        "opts": {
          "a": "Σχολείο.",
          "b": "Νησάκι με εκκλησία.",
          "c": "Σπήλαιο."
        },
        "tip": "Το Δασκαλιό είναι γραφικό σημείο που συχνά προσεγγίζεται με βάρκα."
      },
      {
        "q": "Πού βρίσκεται το Σπήλαιο Ολύμπων;",
        "a": "a",
        "opts": {
          "a": "Στη νότια Χίο.",
          "b": "Στη βόρεια Χίο.",
          "c": "Στην κεντρική Χίο."
        },
        "tip": "Το σπήλαιο έχει εντυπωσιακούς σταλακτίτες και σταθερή θερμοκρασία."
      },
      {
        "q": "Το Κάστρο της πόλης της Χίου κατοικείται ακόμη;",
        "a": "c",
        "opts": {
          "a": "Όχι, είναι μόνο ερείπια.",
          "b": "Μόνο το πρωί.",
          "c": "Ναι, είναι ζωντανή γειτονιά."
        },
        "tip": "Είναι ένα από τα λίγα κατοικημένα κάστρα στην Ελλάδα."
      },
      {
        "q": "Πού βρίσκεται η ιστορική Βιβλιοθήκη Κοραή;",
        "a": "a",
        "opts": {
          "a": "Στην πόλη της Χίου.",
          "b": "Στο Πυργί.",
          "c": "Στα Μεστά."
        },
        "tip": "Είναι μία από τις παλαιότερες και σημαντικότερες βιβλιοθήκες της Ελλάδας."
      },
      {
        "q": "Σε τι χρησίμευαν οι βίγλες;",
        "a": "b",
        "opts": {
          "a": "Στη συγκομιδή μαστίχας.",
          "b": "Ως παράκτιοι πύργοι παρατήρησης.",
          "c": "Ως φάροι."
        },
        "tip": "Οι βίγλες προειδοποιούσαν τους κατοίκους για πειρατικές επιδρομές."
      },
      {
        "q": "Το μοναστήρι της Αγίας Μαρκέλλας βρίσκεται κοντά...",
        "a": "c",
        "opts": {
          "a": "Στον Κάμπο.",
          "b": "Στα Ψαρά.",
          "c": "Στη Βολισσό."
        },
        "tip": "Η Αγία Μαρκέλλα θεωρείται πολιούχος της Χίου και γιορτάζει στις 22 Ιουλίου."
      },
      {
        "q": "Τι μπορείς να δεις στα Οθωμανικά Λουτρά του Κάστρου;",
        "a": "a",
        "opts": {
          "a": "Ένα αναστηλωμένο χαμάμ.",
          "b": "Ένα κελί φυλακής.",
          "c": "Ένα πηγάδι."
        },
        "tip": "Το χαμάμ είναι όμορφα διατηρημένο μνημείο μέσα στο Κάστρο."
      }
    ]
  },
  "de": {
    "main": [
      {
        "q": "Was findet man hinter den hohen Steinmauern von Kampos?",
        "a": "b",
        "opts": {
          "a": "Einkaufszentren.",
          "b": "Zitrusgärten und Wasserräder.",
          "c": "Große Hotels."
        },
        "tip": "Kampos ist bekannt für historische Herrenhäuser, Zitrusgärten und den Duft der Orangenblüten."
      },
      {
        "q": "Welches Denkmal auf Chios gehört zum UNESCO-Weltkulturerbe?",
        "a": "a",
        "opts": {
          "a": "Das Kloster Nea Moni.",
          "b": "Die Burg von Chios.",
          "c": "Anavatos."
        },
        "tip": "Die Mosaiken von Nea Moni gelten als Meisterwerke byzantinischer Kunst."
      },
      {
        "q": "Was sind die „Xysta“ in Pyrgi?",
        "a": "c",
        "opts": {
          "a": "Eine lokale Süßspeise.",
          "b": "Ein traditioneller Tanz.",
          "c": "Geometrische Wanddekorationen."
        },
        "tip": "Xysta sind eine einzigartige Dekorationstechnik, die Pyrgi sofort erkennbar macht."
      },
      {
        "q": "Wie wird echter Chios-Mastix gewonnen?",
        "a": "a",
        "opts": {
          "a": "Durch Einschnitte in den Stamm des Mastixbaums.",
          "b": "Aus den Früchten des Baums.",
          "c": "Aus den Blättern."
        },
        "tip": "Chios ist der einzige Ort der Welt, an dem der Mastixbaum das berühmte Harz produziert."
      },
      {
        "q": "Warum sind die Kiesel am Strand Mavra Volia schwarz?",
        "a": "b",
        "opts": {
          "a": "Wegen Verschmutzung.",
          "b": "Wegen vulkanischen Ursprungs.",
          "c": "Sie sind bemalt."
        },
        "tip": "Mavra Volia ist einer der beeindruckendsten Strände von Chios, mit schwarzen vulkanischen Kieseln."
      },
      {
        "q": "Wo findet der berühmte Raketenkrieg statt?",
        "a": "a",
        "opts": {
          "a": "In Vrontados.",
          "b": "In Mesta.",
          "c": "In Lagada."
        },
        "tip": "Der Raketenkrieg ist eine der bekanntesten Ostertraditionen von Chios."
      },
      {
        "q": "Welches Dorf ist wie eine mittelalterliche Festung gebaut?",
        "a": "c",
        "opts": {
          "a": "Kardamyla.",
          "b": "Thymiana.",
          "c": "Mesta."
        },
        "tip": "In Mesta sind die Häuser miteinander verbunden, um das Dorf vor Angriffen zu schützen."
      },
      {
        "q": "Was ist ein „Magganos“ auf den Anwesen von Kampos?",
        "a": "b",
        "opts": {
          "a": "Ein Mastix-Werkzeug.",
          "b": "Ein traditioneller Mechanismus zum Wasserheben.",
          "c": "Eine Bootsart."
        },
        "tip": "Der Magganos war über Jahrhunderte wichtig für die Bewässerung der Zitrusgärten von Kampos."
      },
      {
        "q": "Welcher antike Dichter soll auf Chios gelehrt haben?",
        "a": "a",
        "opts": {
          "a": "Homer.",
          "b": "Hesiod.",
          "c": "Pindar."
        },
        "tip": "Daskalopetra, auch Homers Stein genannt, ist mit dieser Überlieferung verbunden."
      },
      {
        "q": "Warum Voulamandis House für Ihren Aufenthalt wählen? 🍊",
        "a": "d",
        "opts": {
          "a": "Wegen der renovierten Zimmer.",
          "b": "Wegen der strategischen Lage.",
          "c": "Wegen der authentischen Gastfreundschaft.",
          "d": "Alles zusammen!"
        },
        "tip": "Wir würden uns freuen, Sie auf unserem Familienanwesen in Kampos willkommen zu heißen."
      }
    ],
    "beaches": [
      {
        "q": "Welcher Strand hat feinen Sand und flaches Wasser?",
        "a": "a",
        "opts": {
          "a": "Karfas.",
          "b": "Mavra Volia.",
          "c": "Agia Dinami."
        },
        "tip": "Karfas ist ideal für Familien mit Kindern."
      },
      {
        "q": "Wo liegt Agia Dinami?",
        "a": "b",
        "opts": {
          "a": "Im Norden von Chios.",
          "b": "Im Süden von Chios, nahe Olympi.",
          "c": "Im Zentrum von Chios."
        },
        "tip": "Agia Dinami ist einer der exotischsten Strände der Insel."
      },
      {
        "q": "Welcher Strand ist für seinen ruhigen Sonnenuntergang bekannt?",
        "a": "c",
        "opts": {
          "a": "Komi.",
          "b": "Vrontados.",
          "c": "Elinda."
        },
        "tip": "In Elinda ist das Wasser meist ruhig und kristallklar."
      },
      {
        "q": "Welches ist der größte Strand im Westen von Chios?",
        "a": "a",
        "opts": {
          "a": "Managros.",
          "b": "Lefkathia.",
          "c": "Trachili."
        },
        "tip": "Managros ist ein langer Sandstrand, ideal zum Entspannen."
      },
      {
        "q": "Welcher Strand nahe Mesta ist für seine Beach Bar bekannt?",
        "a": "b",
        "opts": {
          "a": "Giosonas.",
          "b": "Apothika.",
          "c": "Nagos."
        },
        "tip": "Apothika ist beliebt für Kajakfahren und tiefblaues Wasser."
      },
      {
        "q": "Wo findet man den grünen Strand Nagos?",
        "a": "c",
        "opts": {
          "a": "Im Süden von Chios.",
          "b": "Im Westen von Chios.",
          "c": "Im Norden von Chios, nahe Kardamyla."
        },
        "tip": "Nagos verbindet grüne Landschaft, natürliche Quellen und Meer."
      },
      {
        "q": "Welcher Strand hat weiße Kiesel und kühles Wasser, mit einem Namen, der an einen Helden erinnert?",
        "a": "a",
        "opts": {
          "a": "Giosonas.",
          "b": "Karfas.",
          "c": "Bella Vista."
        },
        "tip": "Giosonas ist namentlich mit Jason von den Argonauten verbunden."
      }
    ],
    "villages": [
      {
        "q": "Welches Dorf wird „Mystras der Ägäis“ genannt?",
        "a": "b",
        "opts": {
          "a": "Pyrgi.",
          "b": "Anavatos.",
          "c": "Volissos."
        },
        "tip": "Anavatos ist eine historische verlassene Siedlung auf einem steilen Felsen."
      },
      {
        "q": "Wo befindet sich das Chios-Mastix-Museum?",
        "a": "a",
        "opts": {
          "a": "In Pyrgi.",
          "b": "In Mesta.",
          "c": "In Armolia."
        },
        "tip": "Das Museum bietet schöne Ausblicke auf die Mastixhaine im Süden von Chios."
      },
      {
        "q": "Welches Dorf ist für Keramik bekannt?",
        "a": "c",
        "opts": {
          "a": "Kallimasia.",
          "b": "Thymiana.",
          "c": "Armolia."
        },
        "tip": "In Armolia findet man handgefertigte Tonwaren und Souvenirs."
      },
      {
        "q": "Wo befindet sich die mit Belisar verbundene Burg?",
        "a": "a",
        "opts": {
          "a": "In Volissos.",
          "b": "In Olympi.",
          "c": "In Vessa."
        },
        "tip": "Die Burg erhebt sich über Volissos mit Blick auf die Ägäis."
      },
      {
        "q": "Welches Dorf ist mit lokalem rotem Stein gebaut?",
        "a": "b",
        "opts": {
          "a": "Vrontados.",
          "b": "Thymiana.",
          "c": "Nenita."
        },
        "tip": "Der Stein von Thymiana wurde auch in vielen Herrenhäusern von Kampos verwendet."
      },
      {
        "q": "In welchem Dorf steht die historische große Platane?",
        "a": "c",
        "opts": {
          "a": "Kardamyla.",
          "b": "Lagada.",
          "c": "Pityos."
        },
        "tip": "Pityos ist ein altes Bergdorf mit besonderer Geschichte."
      },
      {
        "q": "Welches Dorf ist die Heimat großer Seeleute und Reeder?",
        "a": "a",
        "opts": {
          "a": "Kardamyla.",
          "b": "Olympi.",
          "c": "Vessa."
        },
        "tip": "Kardamyla hat eine sehr starke maritime Tradition."
      }
    ],
    "sights": [
      {
        "q": "Was ist Daskalio bei Oinousses?",
        "a": "b",
        "opts": {
          "a": "Eine Schule.",
          "b": "Eine kleine Insel mit einer Kirche.",
          "c": "Eine Höhle."
        },
        "tip": "Daskalio ist ein malerischer Ort, der oft mit dem Boot erreicht wird."
      },
      {
        "q": "Wo liegt die Höhle von Olympi?",
        "a": "a",
        "opts": {
          "a": "Im Süden von Chios.",
          "b": "Im Norden von Chios.",
          "c": "Im Zentrum von Chios."
        },
        "tip": "Die Höhle besitzt beeindruckende Stalaktiten und eine stabile Temperatur."
      },
      {
        "q": "Ist die Burg der Stadt Chios noch bewohnt?",
        "a": "c",
        "opts": {
          "a": "Nein, sie ist nur eine Ruine.",
          "b": "Nur am Morgen.",
          "c": "Ja, sie ist ein lebendiges Viertel."
        },
        "tip": "Sie ist eine der wenigen bewohnten Burgen in Griechenland."
      },
      {
        "q": "Wo befindet sich die historische Korais-Bibliothek?",
        "a": "a",
        "opts": {
          "a": "In Chios-Stadt.",
          "b": "In Pyrgi.",
          "c": "In Mesta."
        },
        "tip": "Sie ist eine der ältesten und wichtigsten Bibliotheken Griechenlands."
      },
      {
        "q": "Wofür wurden die Vigles genutzt?",
        "a": "b",
        "opts": {
          "a": "Zur Mastixernte.",
          "b": "Als Küstenwachtürme.",
          "c": "Als Leuchttürme."
        },
        "tip": "Sie warnten die Bewohner vor Piratenangriffen."
      },
      {
        "q": "Das Kloster der Heiligen Markella liegt nahe...",
        "a": "c",
        "opts": {
          "a": "Kampos.",
          "b": "Psara.",
          "c": "Volissos."
        },
        "tip": "Die Heilige Markella gilt als Schutzpatronin von Chios und wird am 22. Juli gefeiert."
      },
      {
        "q": "Was kann man in den Osmanischen Bädern der Burg sehen?",
        "a": "a",
        "opts": {
          "a": "Ein restauriertes Hammam.",
          "b": "Eine Gefängniszelle.",
          "c": "Einen Brunnen."
        },
        "tip": "Das Hammam ist ein schön erhaltenes Denkmal innerhalb der Burg."
      }
    ]
  },
  "it": {
    "main": [
      {
        "q": "Che cosa si trova dietro gli alti muri in pietra di Kampos?",
        "a": "b",
        "opts": {
          "a": "Centri commerciali.",
          "b": "Agrumeti e ruote ad acqua.",
          "c": "Grandi hotel."
        },
        "tip": "Kampos è famoso per le dimore storiche, gli agrumeti e il profumo dei fiori d’arancio."
      },
      {
        "q": "Quale monumento di Chios è patrimonio mondiale UNESCO?",
        "a": "a",
        "opts": {
          "a": "Il monastero di Nea Moni.",
          "b": "Il Castello di Chios.",
          "c": "Anavatos."
        },
        "tip": "I mosaici di Nea Moni sono considerati capolavori dell’arte bizantina."
      },
      {
        "q": "Che cosa sono gli “Xysta” a Pyrgi?",
        "a": "c",
        "opts": {
          "a": "Un dolce locale.",
          "b": "Una danza tradizionale.",
          "c": "Decorazioni geometriche sui muri."
        },
        "tip": "Gli Xysta sono una tecnica decorativa unica che rende Pyrgi subito riconoscibile."
      },
      {
        "q": "Come si produce il vero mastice di Chios?",
        "a": "a",
        "opts": {
          "a": "Con incisioni sul tronco del lentisco.",
          "b": "Dai frutti dell’albero.",
          "c": "Dalle foglie."
        },
        "tip": "Chios è l’unico luogo al mondo dove il lentisco produce la famosa resina di mastice."
      },
      {
        "q": "Perché i ciottoli della spiaggia di Mavra Volia sono neri?",
        "a": "b",
        "opts": {
          "a": "A causa dell’inquinamento.",
          "b": "Per origine vulcanica.",
          "c": "Sono dipinti."
        },
        "tip": "Mavra Volia è una delle spiagge più impressionanti di Chios, con ciottoli vulcanici neri."
      },
      {
        "q": "Dove si svolge la famosa guerra dei razzi?",
        "a": "a",
        "opts": {
          "a": "A Vrontados.",
          "b": "A Mesta.",
          "c": "A Lagada."
        },
        "tip": "La guerra dei razzi è una delle tradizioni pasquali più famose di Chios."
      },
      {
        "q": "Quale villaggio è costruito come una fortezza medievale?",
        "a": "c",
        "opts": {
          "a": "Kardamyla.",
          "b": "Thymiana.",
          "c": "Mesta."
        },
        "tip": "A Mesta le case sono unite tra loro per proteggere il villaggio dagli attacchi."
      },
      {
        "q": "Che cos’è un “magganos” nelle tenute di Kampos?",
        "a": "b",
        "opts": {
          "a": "Uno strumento per il mastice.",
          "b": "Un meccanismo tradizionale per sollevare l’acqua.",
          "c": "Un tipo di barca."
        },
        "tip": "Il magganos era fondamentale per irrigare gli agrumeti di Kampos per secoli."
      },
      {
        "q": "Quale poeta antico si dice abbia insegnato a Chios?",
        "a": "a",
        "opts": {
          "a": "Omero.",
          "b": "Esiodo.",
          "c": "Pindaro."
        },
        "tip": "Daskalopetra, detta anche pietra di Omero, è legata a questa tradizione."
      },
      {
        "q": "Perché scegliere Voulamandis House per il soggiorno? 🍊",
        "a": "d",
        "opts": {
          "a": "Per le camere rinnovate.",
          "b": "Per la posizione strategica.",
          "c": "Per l’ospitalità autentica.",
          "d": "Tutte le risposte!"
        },
        "tip": "Saremo felici di accoglierti nella nostra tenuta familiare a Kampos."
      }
    ],
    "beaches": [
      {
        "q": "Quale spiaggia ha sabbia fine e acque basse?",
        "a": "a",
        "opts": {
          "a": "Karfas.",
          "b": "Mavra Volia.",
          "c": "Agia Dinami."
        },
        "tip": "Karfas è ideale per famiglie con bambini."
      },
      {
        "q": "Dove si trova Agia Dinami?",
        "a": "b",
        "opts": {
          "a": "Nel nord di Chios.",
          "b": "Nel sud di Chios, vicino a Olympi.",
          "c": "Nel centro di Chios."
        },
        "tip": "Agia Dinami è una delle spiagge più esotiche dell’isola."
      },
      {
        "q": "Quale spiaggia è nota per il suo tramonto tranquillo?",
        "a": "c",
        "opts": {
          "a": "Komi.",
          "b": "Vrontados.",
          "c": "Elinda."
        },
        "tip": "A Elinda le acque sono di solito calme e cristalline."
      },
      {
        "q": "Qual è la spiaggia più grande della Chios occidentale?",
        "a": "a",
        "opts": {
          "a": "Managros.",
          "b": "Lefkathia.",
          "c": "Trachili."
        },
        "tip": "Managros è una lunga spiaggia sabbiosa, ideale per rilassarsi."
      },
      {
        "q": "Quale spiaggia vicino a Mesta è nota per il suo beach bar?",
        "a": "b",
        "opts": {
          "a": "Giosonas.",
          "b": "Apothika.",
          "c": "Nagos."
        },
        "tip": "Apothika è popolare per il kayak e le acque blu profonde."
      },
      {
        "q": "Dove si trova la verde spiaggia di Nagos?",
        "a": "c",
        "opts": {
          "a": "Nel sud di Chios.",
          "b": "Nell’ovest di Chios.",
          "c": "Nel nord di Chios, vicino a Kardamyla."
        },
        "tip": "Nagos unisce paesaggio verde, sorgenti naturali e mare."
      },
      {
        "q": "Quale spiaggia ha ciottoli bianchi e acque fresche, con un nome legato a un eroe?",
        "a": "a",
        "opts": {
          "a": "Giosonas.",
          "b": "Karfas.",
          "c": "Bella Vista."
        },
        "tip": "Giosonas è collegata per nome a Giasone degli Argonauti."
      }
    ],
    "villages": [
      {
        "q": "Quale villaggio è chiamato “Mystras dell’Egeo”?",
        "a": "b",
        "opts": {
          "a": "Pyrgi.",
          "b": "Anavatos.",
          "c": "Volissos."
        },
        "tip": "Anavatos è un insediamento storico abbandonato costruito su una roccia ripida."
      },
      {
        "q": "Dove si trova il Museo del Mastice di Chios?",
        "a": "a",
        "opts": {
          "a": "A Pyrgi.",
          "b": "A Mesta.",
          "c": "Ad Armolia."
        },
        "tip": "Il museo offre belle viste sui masticheti del sud di Chios."
      },
      {
        "q": "Quale villaggio è famoso per la ceramica?",
        "a": "c",
        "opts": {
          "a": "Kallimasia.",
          "b": "Thymiana.",
          "c": "Armolia."
        },
        "tip": "Ad Armolia si trovano oggetti in argilla fatti a mano e souvenir."
      },
      {
        "q": "Dove si trova il castello associato a Belisario?",
        "a": "a",
        "opts": {
          "a": "A Volissos.",
          "b": "A Olympi.",
          "c": "A Vessa."
        },
        "tip": "Il castello domina Volissos con vista sul Mar Egeo."
      },
      {
        "q": "Quale villaggio è costruito con pietra rossa locale?",
        "a": "b",
        "opts": {
          "a": "Vrontados.",
          "b": "Thymiana.",
          "c": "Nenita."
        },
        "tip": "La pietra di Thymiana fu usata anche in molte dimore di Kampos."
      },
      {
        "q": "In quale villaggio si trova il grande platano storico?",
        "a": "c",
        "opts": {
          "a": "Kardamyla.",
          "b": "Lagada.",
          "c": "Pityos."
        },
        "tip": "Pityos è un antico villaggio di montagna con una storia particolare."
      },
      {
        "q": "Quale villaggio è patria di grandi marinai e armatori?",
        "a": "a",
        "opts": {
          "a": "Kardamyla.",
          "b": "Olympi.",
          "c": "Vessa."
        },
        "tip": "Kardamyla ha una tradizione marinara molto forte."
      }
    ],
    "sights": [
      {
        "q": "Che cos’è Daskalio vicino a Oinousses?",
        "a": "b",
        "opts": {
          "a": "Una scuola.",
          "b": "Un isolotto con una chiesa.",
          "c": "Una grotta."
        },
        "tip": "Daskalio è un luogo pittoresco spesso raggiunto in barca."
      },
      {
        "q": "Dove si trova la Grotta di Olympi?",
        "a": "a",
        "opts": {
          "a": "Nel sud di Chios.",
          "b": "Nel nord di Chios.",
          "c": "Nel centro di Chios."
        },
        "tip": "La grotta ha stalattiti impressionanti e temperatura stabile."
      },
      {
        "q": "Il Castello della città di Chios è ancora abitato?",
        "a": "c",
        "opts": {
          "a": "No, è solo un rudere.",
          "b": "Solo al mattino.",
          "c": "Sì, è un quartiere vivo."
        },
        "tip": "È uno dei pochi castelli abitati in Grecia."
      },
      {
        "q": "Dove si trova la storica Biblioteca Korais?",
        "a": "a",
        "opts": {
          "a": "Nella città di Chios.",
          "b": "A Pyrgi.",
          "c": "A Mesta."
        },
        "tip": "È una delle biblioteche più antiche e importanti della Grecia."
      },
      {
        "q": "A cosa servivano le vigle?",
        "a": "b",
        "opts": {
          "a": "Alla raccolta del mastice.",
          "b": "Come torri costiere di guardia.",
          "c": "Come fari."
        },
        "tip": "Avvisavano gli abitanti delle incursioni dei pirati."
      },
      {
        "q": "Il monastero di Santa Markella si trova vicino a...",
        "a": "c",
        "opts": {
          "a": "Kampos.",
          "b": "Psara.",
          "c": "Volissos."
        },
        "tip": "Santa Markella è considerata la patrona di Chios e si celebra il 22 luglio."
      },
      {
        "q": "Che cosa si può vedere nei Bagni Ottomani del Castello?",
        "a": "a",
        "opts": {
          "a": "Un hammam restaurato.",
          "b": "Una cella di prigione.",
          "c": "Un pozzo."
        },
        "tip": "L’hammam è un monumento ben conservato all’interno del Castello."
      }
    ]
  },
  "es": {
    "main": [
      {
        "q": "¿Qué encontrarás detrás de los altos muros de piedra de Kampos?",
        "a": "b",
        "opts": {
          "a": "Centros comerciales.",
          "b": "Huertos de cítricos y norias.",
          "c": "Grandes hoteles."
        },
        "tip": "Kampos es famoso por sus mansiones históricas, sus huertos de cítricos y el aroma del azahar."
      },
      {
        "q": "¿Qué monumento de Quíos es Patrimonio Mundial de la UNESCO?",
        "a": "a",
        "opts": {
          "a": "El monasterio de Nea Moni.",
          "b": "El Castillo de Quíos.",
          "c": "Anavatos."
        },
        "tip": "Los mosaicos de Nea Moni son considerados obras maestras del arte bizantino."
      },
      {
        "q": "¿Qué son los “Xysta” de Pyrgi?",
        "a": "c",
        "opts": {
          "a": "Un postre local.",
          "b": "Un baile tradicional.",
          "c": "Decoraciones geométricas en las paredes."
        },
        "tip": "Los Xysta son una técnica decorativa única que hace que Pyrgi sea reconocible al instante."
      },
      {
        "q": "¿Cómo se produce la auténtica mastiha de Quíos?",
        "a": "a",
        "opts": {
          "a": "Con incisiones en el tronco del lentisco.",
          "b": "A partir de los frutos del árbol.",
          "c": "A partir de las hojas."
        },
        "tip": "Quíos es el único lugar del mundo donde el lentisco produce la famosa resina de mastiha."
      },
      {
        "q": "¿Por qué los guijarros de Mavra Volia son negros?",
        "a": "b",
        "opts": {
          "a": "Por la contaminación.",
          "b": "Por su origen volcánico.",
          "c": "Están pintados."
        },
        "tip": "Mavra Volia es una de las playas más impresionantes de Quíos, con guijarros volcánicos negros."
      },
      {
        "q": "¿Dónde tiene lugar la famosa guerra de cohetes?",
        "a": "a",
        "opts": {
          "a": "En Vrontados.",
          "b": "En Mesta.",
          "c": "En Lagada."
        },
        "tip": "La guerra de cohetes es una de las tradiciones de Pascua más famosas de Quíos."
      },
      {
        "q": "¿Qué pueblo está construido como una fortaleza medieval?",
        "a": "c",
        "opts": {
          "a": "Kardamyla.",
          "b": "Thymiana.",
          "c": "Mesta."
        },
        "tip": "En Mesta, las casas están unidas para proteger el pueblo de los ataques."
      },
      {
        "q": "¿Qué es un “magganos” en las fincas de Kampos?",
        "a": "b",
        "opts": {
          "a": "Una herramienta para la mastiha.",
          "b": "Un mecanismo tradicional para extraer agua.",
          "c": "Un tipo de barco."
        },
        "tip": "El magganos fue esencial durante siglos para regar los huertos de Kampos."
      },
      {
        "q": "¿Qué poeta antiguo se dice que enseñó en Quíos?",
        "a": "a",
        "opts": {
          "a": "Homero.",
          "b": "Hesíodo.",
          "c": "Píndaro."
        },
        "tip": "Daskalopetra, también conocida como la piedra de Homero, está relacionada con esta tradición."
      },
      {
        "q": "¿Por qué elegir Voulamandis House para tu estancia? 🍊",
        "a": "d",
        "opts": {
          "a": "Por las habitaciones renovadas.",
          "b": "Por la ubicación estratégica.",
          "c": "Por la hospitalidad auténtica.",
          "d": "¡Todo lo anterior!"
        },
        "tip": "Nos encantará recibirte en nuestra finca familiar de Kampos."
      }
    ],
    "beaches": [
      {
        "q": "¿Qué playa tiene arena fina y aguas poco profundas?",
        "a": "a",
        "opts": {
          "a": "Karfas.",
          "b": "Mavra Volia.",
          "c": "Agia Dinami."
        },
        "tip": "Karfas es ideal para familias con niños."
      },
      {
        "q": "¿Dónde se encuentra Agia Dinami?",
        "a": "b",
        "opts": {
          "a": "En el norte de Quíos.",
          "b": "En el sur de Quíos, cerca de Olympi.",
          "c": "En el centro de Quíos."
        },
        "tip": "Agia Dinami es una de las playas más exóticas de la isla."
      },
      {
        "q": "¿Qué playa es conocida por su tranquilo atardecer?",
        "a": "c",
        "opts": {
          "a": "Komi.",
          "b": "Vrontados.",
          "c": "Elinda."
        },
        "tip": "En Elinda, las aguas suelen ser tranquilas y cristalinas."
      },
      {
        "q": "¿Cuál es la playa más grande del oeste de Quíos?",
        "a": "a",
        "opts": {
          "a": "Managros.",
          "b": "Lefkathia.",
          "c": "Trachili."
        },
        "tip": "Managros es una larga playa de arena, ideal para relajarse."
      },
      {
        "q": "¿Qué playa cerca de Mesta es conocida por su beach bar?",
        "a": "b",
        "opts": {
          "a": "Giosonas.",
          "b": "Apothika.",
          "c": "Nagos."
        },
        "tip": "Apothika es popular por el kayak y sus aguas de azul intenso."
      },
      {
        "q": "¿Dónde se encuentra la verde playa de Nagos?",
        "a": "c",
        "opts": {
          "a": "En el sur de Quíos.",
          "b": "En el oeste de Quíos.",
          "c": "En el norte de Quíos, cerca de Kardamyla."
        },
        "tip": "Nagos combina paisaje verde, manantiales naturales y mar."
      },
      {
        "q": "¿Qué playa tiene guijarros blancos y aguas frescas, con un nombre vinculado a un héroe?",
        "a": "a",
        "opts": {
          "a": "Giosonas.",
          "b": "Karfas.",
          "c": "Bella Vista."
        },
        "tip": "Giosonas está relacionado por su nombre con Jasón de los Argonautas."
      }
    ],
    "villages": [
      {
        "q": "¿Qué pueblo es llamado el “Mystras del Egeo”?",
        "a": "b",
        "opts": {
          "a": "Pyrgi.",
          "b": "Anavatos.",
          "c": "Volissos."
        },
        "tip": "Anavatos es un asentamiento histórico abandonado construido sobre una roca escarpada."
      },
      {
        "q": "¿Dónde se encuentra el Museo de la Mastiha de Quíos?",
        "a": "a",
        "opts": {
          "a": "En Pyrgi.",
          "b": "En Mesta.",
          "c": "En Armolia."
        },
        "tip": "El museo ofrece bonitas vistas de los mastichetes del sur de Quíos."
      },
      {
        "q": "¿Qué pueblo es famoso por su cerámica?",
        "a": "c",
        "opts": {
          "a": "Kallimasia.",
          "b": "Thymiana.",
          "c": "Armolia."
        },
        "tip": "En Armolia puedes encontrar objetos de barro hechos a mano y recuerdos."
      },
      {
        "q": "¿Dónde se encuentra el castillo asociado con Belisario?",
        "a": "a",
        "opts": {
          "a": "En Volissos.",
          "b": "En Olympi.",
          "c": "En Vessa."
        },
        "tip": "El castillo domina Volissos con vistas al mar Egeo."
      },
      {
        "q": "¿Qué pueblo está construido con piedra roja local?",
        "a": "b",
        "opts": {
          "a": "Vrontados.",
          "b": "Thymiana.",
          "c": "Nenita."
        },
        "tip": "La piedra de Thymiana también se utilizó en muchas mansiones de Kampos."
      },
      {
        "q": "¿En qué pueblo se encuentra el gran plátano histórico?",
        "a": "c",
        "opts": {
          "a": "Kardamyla.",
          "b": "Lagada.",
          "c": "Pityos."
        },
        "tip": "Pityos es un antiguo pueblo de montaña con una historia especial."
      },
      {
        "q": "¿Qué pueblo es hogar de grandes marineros y armadores?",
        "a": "a",
        "opts": {
          "a": "Kardamyla.",
          "b": "Olympi.",
          "c": "Vessa."
        },
        "tip": "Kardamyla tiene una tradición marítima muy fuerte."
      }
    ],
    "sights": [
      {
        "q": "¿Qué es Daskalio cerca de Oinousses?",
        "a": "b",
        "opts": {
          "a": "Una escuela.",
          "b": "Un islote con una iglesia.",
          "c": "Una cueva."
        },
        "tip": "Daskalio es un lugar pintoresco al que se suele llegar en barco."
      },
      {
        "q": "¿Dónde se encuentra la cueva de Olympi?",
        "a": "a",
        "opts": {
          "a": "En el sur de Quíos.",
          "b": "En el norte de Quíos.",
          "c": "En el centro de Quíos."
        },
        "tip": "La cueva tiene impresionantes estalactitas y una temperatura estable."
      },
      {
        "q": "¿El Castillo de la ciudad de Quíos sigue habitado?",
        "a": "c",
        "opts": {
          "a": "No, solo son ruinas.",
          "b": "Solo por la mañana.",
          "c": "Sí, es un barrio vivo."
        },
        "tip": "Es uno de los pocos castillos habitados de Grecia."
      },
      {
        "q": "¿Dónde se encuentra la histórica Biblioteca Korais?",
        "a": "a",
        "opts": {
          "a": "En la ciudad de Quíos.",
          "b": "En Pyrgi.",
          "c": "En Mesta."
        },
        "tip": "Es una de las bibliotecas más antiguas e importantes de Grecia."
      },
      {
        "q": "¿Para qué se utilizaban las vigles?",
        "a": "b",
        "opts": {
          "a": "Para recolectar mastiha.",
          "b": "Como torres costeras de vigilancia.",
          "c": "Como faros."
        },
        "tip": "Avisaban a los habitantes de los ataques piratas."
      },
      {
        "q": "El monasterio de Santa Markella se encuentra cerca de...",
        "a": "c",
        "opts": {
          "a": "Kampos.",
          "b": "Psara.",
          "c": "Volissos."
        },
        "tip": "Santa Markella es considerada la patrona de Quíos y se celebra el 22 de julio."
      },
      {
        "q": "¿Qué se puede ver en los Baños Otomanos del Castillo?",
        "a": "a",
        "opts": {
          "a": "Un hammam restaurado.",
          "b": "Una celda de prisión.",
          "c": "Un pozo."
        },
        "tip": "El hammam es un monumento muy bien conservado dentro del Castillo."
      }
    ]
  },
  "tr": {
    "main": [
      {
        "q": "Kampos’taki yüksek taş duvarların arkasında ne bulursunuz?",
        "a": "b",
        "opts": {
          "a": "Alışveriş merkezleri.",
          "b": "Narenciye bahçeleri ve su dolapları.",
          "c": "Büyük oteller."
        },
        "tip": "Kampos, tarihi konakları, narenciye bahçeleri ve portakal çiçeği kokusuyla ünlüdür."
      },
      {
        "q": "Sakız Adası’ndaki hangi anıt UNESCO Dünya Mirası listesindedir?",
        "a": "a",
        "opts": {
          "a": "Nea Moni Manastırı.",
          "b": "Sakız Kalesi.",
          "c": "Anavatos."
        },
        "tip": "Nea Moni’nin mozaikleri Bizans sanatının başyapıtları arasında kabul edilir."
      },
      {
        "q": "Pyrgi’deki “Xysta” nedir?",
        "a": "c",
        "opts": {
          "a": "Yerel bir tatlı.",
          "b": "Geleneksel bir dans.",
          "c": "Duvarlardaki geometrik süslemeler."
        },
        "tip": "Xysta, Pyrgi’yi hemen tanınır yapan benzersiz bir süsleme tekniğidir."
      },
      {
        "q": "Gerçek Sakız mastikası nasıl üretilir?",
        "a": "a",
        "opts": {
          "a": "Sakız ağacının gövdesine çizikler atılarak.",
          "b": "Ağacın meyvelerinden.",
          "c": "Yapraklarından."
        },
        "tip": "Sakız Adası, mastik ağacının ünlü reçineyi verdiği dünyadaki tek yerdir."
      },
      {
        "q": "Mavra Volia plajındaki çakıllar neden siyahtır?",
        "a": "b",
        "opts": {
          "a": "Kirlilik yüzünden.",
          "b": "Volkanik kökenli oldukları için.",
          "c": "Boyanmış oldukları için."
        },
        "tip": "Mavra Volia, siyah volkanik çakıllarıyla Sakız’ın en etkileyici plajlarından biridir."
      },
      {
        "q": "Ünlü Roket Savaşı nerede yapılır?",
        "a": "a",
        "opts": {
          "a": "Vrontados’ta.",
          "b": "Mesta’da.",
          "c": "Lagada’da."
        },
        "tip": "Roket Savaşı, Sakız Adası’nın en bilinen Paskalya geleneklerinden biridir."
      },
      {
        "q": "Hangi köy ortaçağ kalesi gibi inşa edilmiştir?",
        "a": "c",
        "opts": {
          "a": "Kardamyla.",
          "b": "Thymiana.",
          "c": "Mesta."
        },
        "tip": "Mesta’da evler saldırılara karşı köyü korumak için birbirine bitişik yapılmıştır."
      },
      {
        "q": "Kampos malikânelerinde “magganos” nedir?",
        "a": "b",
        "opts": {
          "a": "Mastika aleti.",
          "b": "Geleneksel su çıkarma mekanizması.",
          "c": "Bir tekne türü."
        },
        "tip": "Magganos, yüzyıllar boyunca Kampos bahçelerinin sulanması için temel bir sistemdi."
      },
      {
        "q": "Hangi antik şairin Sakız’da ders verdiği söylenir?",
        "a": "a",
        "opts": {
          "a": "Homeros.",
          "b": "Hesiodos.",
          "c": "Pindaros."
        },
        "tip": "Daskalopetra, yani Homeros’un Taşı, bu gelenekle bağlantılıdır."
      },
      {
        "q": "Konaklamanız için neden Voulamandis House’u seçmelisiniz? 🍊",
        "a": "d",
        "opts": {
          "a": "Yenilenmiş odalar için.",
          "b": "Stratejik konum için.",
          "c": "Otantik misafirperverlik için.",
          "d": "Hepsi!"
        },
        "tip": "Sizi Kampos’taki aile işletmemizde ağırlamaktan mutluluk duyarız."
      }
    ],
    "beaches": [
      {
        "q": "Hangi plaj ince kuma ve sığ sulara sahiptir?",
        "a": "a",
        "opts": {
          "a": "Karfas.",
          "b": "Mavra Volia.",
          "c": "Agia Dinami."
        },
        "tip": "Karfas çocuklu aileler için idealdir."
      },
      {
        "q": "Agia Dinami nerede bulunur?",
        "a": "b",
        "opts": {
          "a": "Sakız’ın kuzeyinde.",
          "b": "Sakız’ın güneyinde, Olympi yakınında.",
          "c": "Sakız’ın merkezinde."
        },
        "tip": "Agia Dinami adanın en egzotik plajlarından biridir."
      },
      {
        "q": "Hangi plaj sakin gün batımıyla bilinir?",
        "a": "c",
        "opts": {
          "a": "Komi.",
          "b": "Vrontados.",
          "c": "Elinda."
        },
        "tip": "Elinda’da sular genellikle sakin ve kristal berraklığındadır."
      },
      {
        "q": "Batı Sakız’ın en büyük plajı hangisidir?",
        "a": "a",
        "opts": {
          "a": "Managros.",
          "b": "Lefkathia.",
          "c": "Trachili."
        },
        "tip": "Managros dinlenmek için ideal, uzun kumlu bir plajdır."
      },
      {
        "q": "Mesta yakınındaki hangi plaj beach barıyla bilinir?",
        "a": "b",
        "opts": {
          "a": "Giosonas.",
          "b": "Apothika.",
          "c": "Nagos."
        },
        "tip": "Apothika kano ve koyu mavi sularıyla popülerdir."
      },
      {
        "q": "Yeşil Nagos plajı nerede bulunur?",
        "a": "c",
        "opts": {
          "a": "Sakız’ın güneyinde.",
          "b": "Sakız’ın batısında.",
          "c": "Sakız’ın kuzeyinde, Kardamyla yakınında."
        },
        "tip": "Nagos yeşil doğayı, doğal kaynakları ve denizi birleştirir."
      },
      {
        "q": "Hangi plaj beyaz çakıllara ve serin sulara sahiptir, adı da bir kahramanla bağlantılıdır?",
        "a": "a",
        "opts": {
          "a": "Giosonas.",
          "b": "Karfas.",
          "c": "Bella Vista."
        },
        "tip": "Giosonas adıyla Argonotlar’ın Jason’una bağlanır."
      }
    ],
    "villages": [
      {
        "q": "Hangi köy “Ege’nin Mystras’ı” olarak anılır?",
        "a": "b",
        "opts": {
          "a": "Pyrgi.",
          "b": "Anavatos.",
          "c": "Volissos."
        },
        "tip": "Anavatos, sarp bir kaya üzerine kurulmuş tarihi terk edilmiş bir yerleşimdir."
      },
      {
        "q": "Sakız Mastika Müzesi nerede bulunur?",
        "a": "a",
        "opts": {
          "a": "Pyrgi’de.",
          "b": "Mesta’da.",
          "c": "Armolia’da."
        },
        "tip": "Müze, güney Sakız’daki mastika bahçelerine güzel bir manzara sunar."
      },
      {
        "q": "Hangi köy seramikleriyle ünlüdür?",
        "a": "c",
        "opts": {
          "a": "Kallimasia.",
          "b": "Thymiana.",
          "c": "Armolia."
        },
        "tip": "Armolia’da el yapımı kil objeler ve hediyelikler bulabilirsiniz."
      },
      {
        "q": "Belisarius ile ilişkilendirilen kale nerede bulunur?",
        "a": "a",
        "opts": {
          "a": "Volissos’ta.",
          "b": "Olympi’de.",
          "c": "Vessa’da."
        },
        "tip": "Kale, Volissos’un üzerinde Ege Denizi manzarasıyla yükselir."
      },
      {
        "q": "Hangi köy yerel kırmızı taşla inşa edilmiştir?",
        "a": "b",
        "opts": {
          "a": "Vrontados.",
          "b": "Thymiana.",
          "c": "Nenita."
        },
        "tip": "Thymiana taşı Kampos’taki birçok konakta da kullanılmıştır."
      },
      {
        "q": "Tarihi büyük çınar hangi köydedir?",
        "a": "c",
        "opts": {
          "a": "Kardamyla.",
          "b": "Lagada.",
          "c": "Pityos."
        },
        "tip": "Pityos özel bir tarihe sahip eski bir dağ köyüdür."
      },
      {
        "q": "Hangi köy büyük denizcilerin ve armatörlerin memleketidir?",
        "a": "a",
        "opts": {
          "a": "Kardamyla.",
          "b": "Olympi.",
          "c": "Vessa."
        },
        "tip": "Kardamyla çok güçlü bir denizcilik geleneğine sahiptir."
      }
    ],
    "sights": [
      {
        "q": "Oinousses yakınındaki Daskalio nedir?",
        "a": "b",
        "opts": {
          "a": "Bir okul.",
          "b": "Üzerinde kilise bulunan küçük bir ada.",
          "c": "Bir mağara."
        },
        "tip": "Daskalio genellikle tekneyle ulaşılan pitoresk bir noktadır."
      },
      {
        "q": "Olympi Mağarası nerede bulunur?",
        "a": "a",
        "opts": {
          "a": "Sakız’ın güneyinde.",
          "b": "Sakız’ın kuzeyinde.",
          "c": "Sakız’ın merkezinde."
        },
        "tip": "Mağarada etkileyici sarkıtlar ve sabit bir sıcaklık bulunur."
      },
      {
        "q": "Sakız şehir kalesinde hâlâ yaşam var mı?",
        "a": "c",
        "opts": {
          "a": "Hayır, sadece kalıntıdır.",
          "b": "Sadece sabahları.",
          "c": "Evet, yaşayan bir mahalledir."
        },
        "tip": "Yunanistan’daki az sayıdaki yerleşimli kalelerden biridir."
      },
      {
        "q": "Tarihi Korais Kütüphanesi nerede bulunur?",
        "a": "a",
        "opts": {
          "a": "Sakız şehrinde.",
          "b": "Pyrgi’de.",
          "c": "Mesta’da."
        },
        "tip": "Yunanistan’ın en eski ve önemli kütüphanelerinden biridir."
      },
      {
        "q": "Vigles ne için kullanılırdı?",
        "a": "b",
        "opts": {
          "a": "Mastika hasadı için.",
          "b": "Kıyı gözetleme kuleleri olarak.",
          "c": "Deniz feneri olarak."
        },
        "tip": "Korsan saldırılarına karşı halkı uyarırlardı."
      },
      {
        "q": "Azize Markella Manastırı ... yakınındadır.",
        "a": "c",
        "opts": {
          "a": "Kampos.",
          "b": "Psara.",
          "c": "Volissos."
        },
        "tip": "Azize Markella Sakız’ın koruyucu azizesi kabul edilir ve 22 Temmuz’da kutlanır."
      },
      {
        "q": "Kale’deki Osmanlı Hamamları’nda ne görülebilir?",
        "a": "a",
        "opts": {
          "a": "Restore edilmiş bir hamam.",
          "b": "Bir hapishane hücresi.",
          "c": "Bir su kuyusu."
        },
        "tip": "Hamam, Kale içinde güzel korunmuş bir anıttır."
      }
    ]
  },
  "fr": {
    "main": [
      {
        "q": "Que trouve-t-on derrière les hauts murs de pierre de Kampos ?",
        "a": "b",
        "opts": {
          "a": "Des centres commerciaux.",
          "b": "Des vergers d’agrumes et des roues à eau.",
          "c": "De grands hôtels."
        },
        "tip": "Kampos est connu pour ses demeures historiques, ses vergers et le parfum des fleurs d’oranger."
      },
      {
        "q": "Quel monument de Chios est classé au patrimoine mondial de l’UNESCO ?",
        "a": "a",
        "opts": {
          "a": "Le monastère de Nea Moni.",
          "b": "Le château de Chios.",
          "c": "Anavatos."
        },
        "tip": "Les mosaïques de Nea Moni sont considérées comme des chefs-d’œuvre de l’art byzantin."
      },
      {
        "q": "Que sont les « Xysta » à Pyrgi ?",
        "a": "c",
        "opts": {
          "a": "Un dessert local.",
          "b": "Une danse traditionnelle.",
          "c": "Des décorations géométriques sur les murs."
        },
        "tip": "Les Xysta sont une technique décorative unique qui rend Pyrgi immédiatement reconnaissable."
      },
      {
        "q": "Comment produit-on le véritable mastic de Chios ?",
        "a": "a",
        "opts": {
          "a": "Par des incisions dans le tronc du lentisque.",
          "b": "À partir des fruits de l’arbre.",
          "c": "À partir des feuilles."
        },
        "tip": "Chios est le seul endroit au monde où le lentisque produit la célèbre résine de mastic."
      },
      {
        "q": "Pourquoi les galets de Mavra Volia sont-ils noirs ?",
        "a": "b",
        "opts": {
          "a": "À cause de la pollution.",
          "b": "À cause de leur origine volcanique.",
          "c": "Ils sont peints."
        },
        "tip": "Mavra Volia est l’une des plages les plus impressionnantes de Chios, avec ses galets volcaniques noirs."
      },
      {
        "q": "Où a lieu la célèbre guerre des fusées ?",
        "a": "a",
        "opts": {
          "a": "À Vrontados.",
          "b": "À Mesta.",
          "c": "À Lagada."
        },
        "tip": "La guerre des fusées est l’une des traditions pascales les plus connues de Chios."
      },
      {
        "q": "Quel village est construit comme une forteresse médiévale ?",
        "a": "c",
        "opts": {
          "a": "Kardamyla.",
          "b": "Thymiana.",
          "c": "Mesta."
        },
        "tip": "À Mesta, les maisons sont reliées entre elles pour protéger le village des attaques."
      },
      {
        "q": "Qu’est-ce qu’un « magganos » dans les domaines de Kampos ?",
        "a": "b",
        "opts": {
          "a": "Un outil pour le mastic.",
          "b": "Un mécanisme traditionnel pour puiser l’eau.",
          "c": "Un type de bateau."
        },
        "tip": "Le magganos était essentiel pour irriguer les vergers de Kampos pendant des siècles."
      },
      {
        "q": "Quel poète antique aurait enseigné à Chios ?",
        "a": "a",
        "opts": {
          "a": "Homère.",
          "b": "Hésiode.",
          "c": "Pindare."
        },
        "tip": "Daskalopetra, aussi appelée la pierre d’Homère, est liée à cette tradition."
      },
      {
        "q": "Pourquoi choisir Voulamandis House pour votre séjour ? 🍊",
        "a": "d",
        "opts": {
          "a": "Pour ses chambres rénovées.",
          "b": "Pour son emplacement stratégique.",
          "c": "Pour son hospitalité authentique.",
          "d": "Tout cela à la fois !"
        },
        "tip": "Nous serions ravis de vous accueillir dans notre domaine familial à Kampos."
      }
    ],
    "beaches": [
      {
        "q": "Quelle plage possède du sable fin et des eaux peu profondes ?",
        "a": "a",
        "opts": {
          "a": "Karfas.",
          "b": "Mavra Volia.",
          "c": "Agia Dinami."
        },
        "tip": "Karfas est idéale pour les familles avec enfants."
      },
      {
        "q": "Où se trouve Agia Dinami ?",
        "a": "b",
        "opts": {
          "a": "Au nord de Chios.",
          "b": "Au sud de Chios, près d’Olympi.",
          "c": "Au centre de Chios."
        },
        "tip": "Agia Dinami est l’une des plages les plus exotiques de l’île."
      },
      {
        "q": "Quelle plage est connue pour son coucher de soleil paisible ?",
        "a": "c",
        "opts": {
          "a": "Komi.",
          "b": "Vrontados.",
          "c": "Elinda."
        },
        "tip": "À Elinda, les eaux sont généralement calmes et cristallines."
      },
      {
        "q": "Quelle est la plus grande plage de l’ouest de Chios ?",
        "a": "a",
        "opts": {
          "a": "Managros.",
          "b": "Lefkathia.",
          "c": "Trachili."
        },
        "tip": "Managros est une longue plage de sable, idéale pour se détendre."
      },
      {
        "q": "Quelle plage près de Mesta est connue pour son beach bar ?",
        "a": "b",
        "opts": {
          "a": "Giosonas.",
          "b": "Apothika.",
          "c": "Nagos."
        },
        "tip": "Apothika est appréciée pour le kayak et ses eaux bleu profond."
      },
      {
        "q": "Où se trouve la plage verdoyante de Nagos ?",
        "a": "c",
        "opts": {
          "a": "Au sud de Chios.",
          "b": "À l’ouest de Chios.",
          "c": "Au nord de Chios, près de Kardamyla."
        },
        "tip": "Nagos combine paysage verdoyant, sources naturelles et mer."
      },
      {
        "q": "Quelle plage aux galets blancs et aux eaux fraîches porte un nom lié à un héros ?",
        "a": "a",
        "opts": {
          "a": "Giosonas.",
          "b": "Karfas.",
          "c": "Bella Vista."
        },
        "tip": "Giosonas est associé par son nom à Jason, le héros des Argonautes."
      }
    ],
    "villages": [
      {
        "q": "Quel village est surnommé le « Mystras de l’Égée » ?",
        "a": "b",
        "opts": {
          "a": "Pyrgi.",
          "b": "Anavatos.",
          "c": "Volissos."
        },
        "tip": "Anavatos est un village historique abandonné, construit sur un rocher escarpé."
      },
      {
        "q": "Où se trouve le Musée du Mastic de Chios ?",
        "a": "a",
        "opts": {
          "a": "À Pyrgi.",
          "b": "À Mesta.",
          "c": "À Armolia."
        },
        "tip": "Le musée offre une belle vue sur les plantations de mastic du sud de Chios."
      },
      {
        "q": "Quel village est célèbre pour sa céramique ?",
        "a": "c",
        "opts": {
          "a": "Kallimasia.",
          "b": "Thymiana.",
          "c": "Armolia."
        },
        "tip": "À Armolia, on trouve des objets artisanaux en argile et des souvenirs."
      },
      {
        "q": "Où se trouve le château associé à Bélisaire ?",
        "a": "a",
        "opts": {
          "a": "À Volissos.",
          "b": "À Olympi.",
          "c": "À Vessa."
        },
        "tip": "Le château domine Volissos avec une vue sur la mer Égée."
      },
      {
        "q": "Quel village est construit avec la pierre rouge locale ?",
        "a": "b",
        "opts": {
          "a": "Vrontados.",
          "b": "Thymiana.",
          "c": "Nenita."
        },
        "tip": "La pierre de Thymiana a aussi été utilisée dans de nombreuses demeures de Kampos."
      },
      {
        "q": "Dans quel village se trouve le grand platane historique ?",
        "a": "c",
        "opts": {
          "a": "Kardamyla.",
          "b": "Lagada.",
          "c": "Pityos."
        },
        "tip": "Pityos est un ancien village de montagne avec une histoire particulière."
      },
      {
        "q": "Quel village est la patrie de grands marins et armateurs ?",
        "a": "a",
        "opts": {
          "a": "Kardamyla.",
          "b": "Olympi.",
          "c": "Vessa."
        },
        "tip": "Kardamyla possède une très forte tradition maritime."
      }
    ],
    "sights": [
      {
        "q": "Qu’est-ce que Daskalio près d’Oinousses ?",
        "a": "b",
        "opts": {
          "a": "Une école.",
          "b": "Un îlot avec une église.",
          "c": "Une grotte."
        },
        "tip": "Daskalio est un lieu pittoresque souvent visité en bateau."
      },
      {
        "q": "Où se trouve la grotte d’Olympi ?",
        "a": "a",
        "opts": {
          "a": "Au sud de Chios.",
          "b": "Au nord de Chios.",
          "c": "Au centre de Chios."
        },
        "tip": "La grotte possède d’impressionnantes stalactites et une température stable."
      },
      {
        "q": "Le château de la ville de Chios est-il encore habité ?",
        "a": "c",
        "opts": {
          "a": "Non, ce ne sont que des ruines.",
          "b": "Seulement le matin.",
          "c": "Oui, c’est un quartier vivant."
        },
        "tip": "C’est l’un des rares châteaux habités en Grèce."
      },
      {
        "q": "Où se trouve la bibliothèque historique Korais ?",
        "a": "a",
        "opts": {
          "a": "Dans la ville de Chios.",
          "b": "À Pyrgi.",
          "c": "À Mesta."
        },
        "tip": "C’est l’une des bibliothèques les plus anciennes et importantes de Grèce."
      },
      {
        "q": "À quoi servaient les vigles ?",
        "a": "b",
        "opts": {
          "a": "À récolter le mastic.",
          "b": "Comme tours côtières de surveillance.",
          "c": "Comme phares."
        },
        "tip": "Elles avertissaient les habitants en cas d’attaques de pirates."
      },
      {
        "q": "Le monastère de Sainte-Markella se trouve près de...",
        "a": "c",
        "opts": {
          "a": "Kampos.",
          "b": "Psara.",
          "c": "Volissos."
        },
        "tip": "Sainte Markella est considérée comme la patronne de Chios et sa fête a lieu le 22 juillet."
      },
      {
        "q": "Que peut-on voir dans les bains ottomans du château ?",
        "a": "a",
        "opts": {
          "a": "Un hammam restauré.",
          "b": "Une cellule de prison.",
          "c": "Un puits."
        },
        "tip": "Le hammam est un monument très bien conservé à l’intérieur du château."
      }
    ]
  }
} satisfies Record<QuizLocale, Record<QuestType, QuizQuestion[]>>;

function normalizeLocale(locale?: string): QuizLocale {
  if (locale && supportedLocales.includes(locale as QuizLocale)) {
    return locale as QuizLocale;
  }

  return "en";
}

export function ChiosHolidayQuizPage({ locale = "en" }: ChiosHolidayQuizPageProps) {
  const currentLocale = normalizeLocale(locale);
  const ui = uiByLocale[currentLocale];
  const quizData = quizDataByLocale[currentLocale];

  const [questType, setQuestType] = useState<QuestType>("main");
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [mainQuizScore, setMainQuizScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<OptionKey | null>(null);
  const [showResult, setShowResult] = useState(false);

  const currentQuestions = quizData[questType];
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
      const finalScore = selectedAnswer === currentQuestion.a ? score + 1 : score;
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
    setCurrentIdx(quizData.main.length - 1);
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
                {mainQuizScore}/{quizData.main.length}
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
    </main>
  );
}

export default ChiosHolidayQuizPage;
