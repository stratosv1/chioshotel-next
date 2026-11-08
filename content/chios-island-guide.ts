// Local guide content for the "Chios island" pages (all 7 languages).
// Local knowledge from the owner (Stratos, 2026-11-08): guests arrive with
// Aegean, Sky Express and Blue Star Ferries (Turkish guests mostly via Çeşme);
// stays are usually 3–5 nights; families in July–August, couples otherwise;
// top five, sunset spots, dinner advice, local tastes, Çeşme day trips with
// Sunrise Tours, 91 beaches, and that the house issues the accommodation
// certificate needed for the ferry discount.
// Checked facts: Athens–Chios flights ~50 min with Aegean and Sky Express
// (flightconnections.com); Attica Group (Blue Star Ferries) summer 30%
// discount for stays of 4+ nights with an accommodation certificate (2020 and
// 2025 editions; 2025: 13 June–30 September — politischios.gr, argophilia.com);
// Nea Moni UNESCO World Heritage, 11th-century mosaics; mastic cultivation
// know-how on UNESCO's intangible heritage list since 2014 (ich.unesco.org).
// Drive times: content/trip-planner/village-routing.ts.

export type ChiosIslandGuideItem = {
  title: string;
  text: string;
  href?: string;
  linkLabel?: string;
};

export type ChiosIslandGuideSection = {
  id: string;
  title: string;
  paragraphs?: string[];
  items?: ChiosIslandGuideItem[];
};

export type ChiosIslandGuide = {
  kicker: string;
  title: string;
  intro: string;
  sections: ChiosIslandGuideSection[];
  /** Replaces the answer of the existing "What should I see" FAQ, if present. */
  seeAnswer: string;
  faq: {
    kicker: string;
    title: string;
    items: { question: string; answer: string }[];
  };
};

export const chiosIslandGuideEn: ChiosIslandGuide = {
  kicker: "Local guide",
  title: "Chios island guide from people who live here",
  intro:
    "Everything we tell our own guests before they arrive: how to get here, where to base yourself, what is really worth seeing and how to plan three to five days on the island.",
  sections: [
    {
      id: "getting-there",
      title: "How to get to Chios",
      items: [
        {
          title: "By air",
          text: "Aegean and Sky Express fly from Athens to Chios in about 50 minutes. Chios airport is only a few minutes from Kambos.",
        },
        {
          title: "By ferry from Piraeus",
          text: "Blue Star Ferries sails from Piraeus to the port of Chios Town, about ten minutes by car from Kambos. Bring your car if you want to explore at your own pace.",
        },
        {
          title: "From Turkey",
          text: "Ferries cross from Çeşme to Chios Town in a short sea trip. Check which travel document you need before you travel.",
        },
        {
          title: "Don't miss the ferry discount",
          text:
            "The most common mistake our guests make: they do not ask for the summer ferry discount. In recent summers (for example 13 June–30 September 2025) Blue Star Ferries has offered 30% off for stays of four nights or more on Chios, with a certificate from your accommodation. We issue that certificate for our guests. Confirm the current year's terms with the ferry company or a travel agency.",
        },
      ],
    },
    {
      id: "where-to-stay",
      title: "Where to stay: the middle of the island",
      paragraphs: [
        "Stay in Kambos or Karfas. Both sit in the middle of the east coast, so the far north and the far south of Chios are roughly the same drive away, within about an hour. Chios Town, the airport and the port are minutes away.",
      ],
    },
    {
      id: "top-five",
      title: "Our five must-sees for a first visit",
      items: [
        { title: "Mavra Volia", text: "The black volcanic pebble beach near Emporios.", href: "/chios/chios-beaches/mavra-volia-beach/", linkLabel: "Mavra Volia" },
        { title: "Pyrgi", text: "The village painted with black-and-white xysta patterns.", href: "/chios/chios-villages/chios-pyrgi/", linkLabel: "Pyrgi" },
        { title: "Mesta", text: "The best-preserved medieval fortress village.", href: "/chios/chios-villages/mesta-chios/", linkLabel: "Mesta" },
        { title: "Kambos", text: "Stone mansions and citrus gardens behind high walls — where we live.", href: "/chios/kampos-chios/", linkLabel: "Kambos" },
        { title: "Nea Moni", text: "An 11th-century monastery with famous mosaics, a UNESCO World Heritage Site." },
      ],
      paragraphs: [
        "With more time, add the abandoned medieval village of Anavatos and the stone village of Avgonyma in central Chios.",
      ],
    },
    {
      id: "beaches",
      title: "91 beaches: choose by the wind",
      paragraphs: [
        "Chios has 91 different beaches, facing every direction. Before you choose, check our three-day sea forecast for each beach: it takes into account which way each beach faces, so you can find calm water even on a windy day.",
      ],
      items: [
        { title: "Sea forecast", text: "Three-day sea conditions for every beach.", href: "/chios/chios-beaches/#sea-today", linkLabel: "See today's sea" },
      ],
    },
    {
      id: "sunset",
      title: "Sunset, then dinner",
      paragraphs: [
        "Our favourite sunsets are at Sidirounta and Avgonyma on the west side. Plan dinner there too, in Lithi or Avgonyma: if you are based in the middle of the island, the drive back takes about an hour, and it is much nicer after a good meal than on an empty stomach.",
      ],
      items: [
        { title: "Avgonyma", text: "Stone village, sunset and dinner.", href: "/chios/chios-villages/avgonyma-chios/", linkLabel: "Avgonyma" },
        { title: "Lithi", text: "Sandy bay with fish tavernas by the sea.", href: "/chios/chios-beaches/lithi-beach/", linkLabel: "Lithi" },
      ],
    },
    {
      id: "plan",
      title: "How many days? A 3-day and a 5-day plan",
      paragraphs: ["Most of our guests stay three to five days. From a base in Kambos:"],
      items: [
        { title: "Day 1", text: "A walk through Kambos, then Chios Town, its castle and the harbour." },
        { title: "Day 2", text: "The south: Pyrgi, Mesta and a swim at Mavra Volia." },
        { title: "Day 3", text: "Central Chios: Nea Moni, Anavatos and sunset dinner in Avgonyma." },
        { title: "Day 4", text: "A beach day — pick the calmest beach from the sea forecast." },
        { title: "Day 5", text: "A day trip to Çeşme in Turkey with Sunrise Tours, or the north: Volissos and its beaches." },
      ],
    },
    {
      id: "tastes",
      title: "Tastes of Chios",
      paragraphs: [
        "Mastic is the island's signature: its cultivation is on UNESCO's list of intangible cultural heritage. At the table, try handmade 'chérisia' pasta, Kasteli cheese, small stuffed vine leaves and little cheese pies with honey — and finish the meal the local way, with a glass of mastic liqueur.",
      ],
    },
    {
      id: "who",
      title: "Families in summer, couples all year",
      paragraphs: [
        "In July and August most of our guests are families: sandy, shallow beaches and short drives make Chios easy with children. The rest of the year belongs to couples — quiet villages, long lunches and sunsets without the crowds.",
      ],
    },
    {
      id: "book-direct",
      title: "Our tip: book direct",
      paragraphs: [
        "Booking directly with Voulamandis House gets you a better price, because no commission goes to the booking platforms — and we will gladly prepare your ferry discount certificate.",
      ],
      items: [{ title: "Rooms & apartments", text: "See rooms and check availability.", href: "/chios-rooms/", linkLabel: "View rooms" }],
    },
  ],
  seeAnswer:
    "Our five must-sees are Mavra Volia beach, the painted village of Pyrgi, medieval Mesta, the citrus gardens of Kambos and the UNESCO-listed monastery of Nea Moni. With more time, add Anavatos and Avgonyma in central Chios.",
  faq: {
    kicker: "Chios FAQ",
    title: "Visiting Chios: common questions",
    items: [
      {
        question: "How do I get to Chios?",
        answer:
          "Fly from Athens with Aegean or Sky Express (about 50 minutes), take Blue Star Ferries from Piraeus, or cross by ferry from Çeşme in Turkey. Kambos is a few minutes from both the airport and the port.",
      },
      {
        question: "How many days do I need in Chios?",
        answer:
          "Three days cover the essentials: Chios Town and Kambos, the southern mastic villages with Mavra Volia, and central Chios with Nea Moni, Anavatos and Avgonyma. Five days add a beach day and a trip to the north or to Çeşme.",
      },
      {
        question: "Is there a ferry discount for visitors to Chios?",
        answer:
          "In recent summers Blue Star Ferries has offered 30% off for stays of four nights or more on Chios, with a certificate from your accommodation. Voulamandis House issues this certificate for its guests; confirm the current terms with the ferry company or a travel agency.",
      },
      {
        question: "Can I visit Turkey from Chios?",
        answer:
          "Yes. Çeşme is a short ferry ride away and a day trip is easy, for example with Sunrise Tours. Check which travel document your nationality requires.",
      },
    ],
  },
};

export const chiosIslandGuideEl: ChiosIslandGuide = {
  kicker: "Οδηγός ντόπιων",
  title: "Η Χίος όπως τη δείχνουμε στους επισκέπτες μας",
  intro:
    "Όσα λέμε στους επισκέπτες μας πριν έρθουν: πώς θα φτάσετε, πού να μείνετε, τι αξίζει πραγματικά να δείτε και πώς να οργανώσετε τρεις έως πέντε μέρες στο νησί.",
  sections: [
    {
      id: "getting-there",
      title: "Πώς θα έρθετε στη Χίο",
      items: [
        {
          title: "Με αεροπλάνο",
          text: "Aegean και Sky Express πετούν από την Αθήνα στη Χίο σε περίπου 50 λεπτά. Το αεροδρόμιο της Χίου απέχει λίγα λεπτά από τον Κάμπο.",
        },
        {
          title: "Με πλοίο από Πειραιά",
          text: "Η Blue Star Ferries συνδέει τον Πειραιά με το λιμάνι της Χίου, περίπου δέκα λεπτά με το αυτοκίνητο από τον Κάμπο. Φέρτε το αυτοκίνητό σας αν θέλετε να γυρίσετε το νησί με την άνεσή σας.",
        },
        {
          title: "Από την Τουρκία",
          text: "Από τον Τσεσμέ υπάρχουν πλοία για την πόλη της Χίου, σε σύντομο ταξίδι. Ελέγξτε ποιο ταξιδιωτικό έγγραφο χρειάζεστε.",
        },
        {
          title: "Μη χάσετε την έκπτωση στο πλοίο",
          text:
            "Το πιο συχνό λάθος των επισκεπτών: δεν ζητούν την καλοκαιρινή έκπτωση. Τα τελευταία καλοκαίρια (π.χ. 13 Ιουνίου–30 Σεπτεμβρίου 2025) η Blue Star Ferries δίνει έκπτωση 30% για διαμονή τουλάχιστον τεσσάρων διανυκτερεύσεων στη Χίο, με βεβαίωση από το κατάλυμα. Εμείς εκδίδουμε τη βεβαίωση για τους επισκέπτες μας. Επιβεβαιώστε τους όρους της χρονιάς στην ακτοπλοϊκή εταιρεία ή σε ταξιδιωτικό γραφείο.",
        },
      ],
    },
    {
      id: "where-to-stay",
      title: "Πού να μείνετε: στη μέση του νησιού",
      paragraphs: [
        "Μείνετε στον Κάμπο ή στον Καρφά. Βρίσκονται στη μέση της ανατολικής ακτής, οπότε το βορειότερο και το νοτιότερο σημείο της Χίου απέχουν περίπου τον ίδιο χρόνο, έως μία ώρα με το αυτοκίνητο. Η πόλη, το αεροδρόμιο και το λιμάνι είναι λίγα λεπτά μακριά.",
      ],
    },
    {
      id: "top-five",
      title: "Τα πέντε «πρέπει» για την πρώτη σας επίσκεψη",
      items: [
        { title: "Μαύρα Βόλια", text: "Η παραλία με τα μαύρα ηφαιστειακά βότσαλα κοντά στον Εμπορειό.", href: "/el/paralies-xios/paralia-mavra-volia/", linkLabel: "Μαύρα Βόλια" },
        { title: "Πυργί", text: "Το χωριό με τα ασπρόμαυρα ξυστά.", href: "/el/xoria-xios/pyrgi-xios/", linkLabel: "Πυργί" },
        { title: "Μεστά", text: "Το καλύτερα διατηρημένο μεσαιωνικό καστροχώρι.", href: "/el/xoria-xios/mesta-xios/", linkLabel: "Μεστά" },
        { title: "Κάμπος", text: "Αρχοντικά και περιβόλια με εσπεριδοειδή πίσω από ψηλές μάντρες — εκεί που ζούμε.", href: "/el/chios/kampos-chios/", linkLabel: "Κάμπος" },
        { title: "Νέα Μονή", text: "Μοναστήρι του 11ου αιώνα με περίφημα ψηφιδωτά, μνημείο Παγκόσμιας Κληρονομιάς της UNESCO." },
      ],
      paragraphs: [
        "Αν έχετε περισσότερο χρόνο, προσθέστε τον εγκαταλελειμμένο μεσαιωνικό Ανάβατο και τα πέτρινα Αυγώνυμα στην κεντρική Χίο.",
      ],
    },
    {
      id: "beaches",
      title: "91 παραλίες: διαλέξτε ανάλογα με τον αέρα",
      paragraphs: [
        "Η Χίος έχει 91 διαφορετικές παραλίες, στραμμένες προς κάθε κατεύθυνση. Πριν διαλέξετε, δείτε την πρόβλεψη θάλασσας τριών ημερών για κάθε παραλία στο site μας: λαμβάνει υπόψη προς τα πού είναι στραμμένη η κάθε παραλία, ώστε να βρίσκετε ήρεμα νερά ακόμη και τις μέρες με αέρα.",
      ],
      items: [
        { title: "Πρόβλεψη θάλασσας", text: "Συνθήκες θάλασσας τριών ημερών για κάθε παραλία.", href: "/el/paralies-xios/#sea-today", linkLabel: "Δείτε τη θάλασσα σήμερα" },
      ],
    },
    {
      id: "sunset",
      title: "Ηλιοβασίλεμα και μετά φαγητό",
      paragraphs: [
        "Τα αγαπημένα μας ηλιοβασιλέματα είναι στη Σιδηρούντα και στα Αυγώνυμα, στη δυτική πλευρά. Κανονίστε και το βραδινό σας εκεί, στο Λιθί ή στα Αυγώνυμα: αν μένετε στη μέση του νησιού, η επιστροφή θέλει περίπου μία ώρα και είναι πολύ πιο ευχάριστη μετά από ένα καλό γεύμα.",
      ],
      items: [
        { title: "Αυγώνυμα", text: "Πέτρινο χωριό, ηλιοβασίλεμα και φαγητό.", href: "/el/xoria-xios/avgonyma-xios/", linkLabel: "Αυγώνυμα" },
        { title: "Λιθί", text: "Αμμουδερός κόλπος με ψαροταβέρνες δίπλα στη θάλασσα.", href: "/el/paralies-xios/paralia-lithi/", linkLabel: "Λιθί" },
      ],
    },
    {
      id: "plan",
      title: "Πόσες μέρες; Πρόγραμμα 3 και 5 ημερών",
      paragraphs: ["Οι περισσότεροι επισκέπτες μας μένουν τρεις έως πέντε μέρες. Με βάση τον Κάμπο:"],
      items: [
        { title: "1η μέρα", text: "Βόλτα στον Κάμπο, μετά η πόλη της Χίου, το Κάστρο και το λιμάνι." },
        { title: "2η μέρα", text: "Ο νότος: Πυργί, Μεστά και μπάνιο στα Μαύρα Βόλια." },
        { title: "3η μέρα", text: "Κεντρική Χίος: Νέα Μονή, Ανάβατος και φαγητό με ηλιοβασίλεμα στα Αυγώνυμα." },
        { title: "4η μέρα", text: "Μέρα παραλίας — διαλέξτε την πιο ήρεμη από την πρόβλεψη θάλασσας." },
        { title: "5η μέρα", text: "Ημερήσια εκδρομή στον Τσεσμέ της Τουρκίας με τη Sunrise Tours ή ο βορράς: η Βολισσός και οι παραλίες της." },
      ],
    },
    {
      id: "tastes",
      title: "Γεύσεις της Χίου",
      paragraphs: [
        "Η μαστίχα είναι η υπογραφή του νησιού: η καλλιέργειά της είναι γραμμένη στον κατάλογο Άυλης Πολιτιστικής Κληρονομιάς της UNESCO. Στο τραπέζι δοκιμάστε χέρισια μακαρόνια, τυρί καστέλι, ντολμαδάκια και τυροπιτάκια με μέλι, όλα χειροποίητα — και κλείστε το φαγητό όπως κάνουμε εμείς, με ένα λικέρ μαστίχα.",
      ],
    },
    {
      id: "who",
      title: "Οικογένειες το καλοκαίρι, ζευγάρια όλο τον χρόνο",
      paragraphs: [
        "Τον Ιούλιο και τον Αύγουστο οι περισσότεροι επισκέπτες μας είναι οικογένειες: αμμουδιές με ρηχά νερά και μικρές αποστάσεις κάνουν τη Χίο εύκολη με παιδιά. Τον υπόλοιπο χρόνο το νησί ανήκει στα ζευγάρια — ήσυχα χωριά, χαλαρά γεύματα και ηλιοβασιλέματα χωρίς κόσμο.",
      ],
    },
    {
      id: "book-direct",
      title: "Η συμβουλή μας: κλείστε απευθείας",
      paragraphs: [
        "Με απευθείας κράτηση στο Voulamandis House έχετε καλύτερη τιμή, γιατί δεν πληρώνεται προμήθεια στις πλατφόρμες κρατήσεων — και σας ετοιμάζουμε με χαρά τη βεβαίωση για την έκπτωση στο πλοίο.",
      ],
      items: [{ title: "Δωμάτια & διαμερίσματα", text: "Δείτε τα δωμάτια και τη διαθεσιμότητα.", href: "/el/domatia-xios/", linkLabel: "Δείτε τα δωμάτια" }],
    },
  ],
  seeAnswer:
    "Τα πέντε «πρέπει» μας είναι η παραλία Μαύρα Βόλια, το ζωγραφιστό Πυργί, τα μεσαιωνικά Μεστά, τα περιβόλια του Κάμπου και η Νέα Μονή, μνημείο της UNESCO. Με περισσότερο χρόνο, προσθέστε τον Ανάβατο και τα Αυγώνυμα στην κεντρική Χίο.",
  faq: {
    kicker: "Συχνές ερωτήσεις",
    title: "Επίσκεψη στη Χίο: συχνές ερωτήσεις",
    items: [
      {
        question: "Πώς θα έρθω στη Χίο;",
        answer:
          "Με αεροπλάνο από την Αθήνα με Aegean ή Sky Express (περίπου 50 λεπτά), με τη Blue Star Ferries από τον Πειραιά ή με πλοίο από τον Τσεσμέ της Τουρκίας. Ο Κάμπος απέχει λίγα λεπτά από το αεροδρόμιο και το λιμάνι.",
      },
      {
        question: "Πόσες μέρες χρειάζομαι στη Χίο;",
        answer:
          "Σε τρεις μέρες βλέπετε τα βασικά: πόλη και Κάμπο, τα νότια Μαστιχοχώρια με τα Μαύρα Βόλια και την κεντρική Χίο με Νέα Μονή, Ανάβατο και Αυγώνυμα. Με πέντε μέρες προσθέτετε μια μέρα παραλίας και μια εκδρομή στον βορρά ή στον Τσεσμέ.",
      },
      {
        question: "Υπάρχει έκπτωση στα ακτοπλοϊκά για τη Χίο;",
        answer:
          "Τα τελευταία καλοκαίρια η Blue Star Ferries δίνει έκπτωση 30% για διαμονή τουλάχιστον τεσσάρων διανυκτερεύσεων στη Χίο, με βεβαίωση από το κατάλυμα. Το Voulamandis House εκδίδει τη βεβαίωση για τους επισκέπτες του· επιβεβαιώστε τους όρους της χρονιάς στην εταιρεία ή σε ταξιδιωτικό γραφείο.",
      },
      {
        question: "Μπορώ να πάω στην Τουρκία από τη Χίο;",
        answer:
          "Ναι. Ο Τσεσμές είναι ένα σύντομο ταξίδι με πλοίο και η ημερήσια εκδρομή είναι εύκολη, για παράδειγμα με τη Sunrise Tours. Ελέγξτε ποιο ταξιδιωτικό έγγραφο χρειάζεστε.",
      },
    ],
  },
};

export const chiosIslandGuideFr: ChiosIslandGuide = {
  kicker: "Guide local",
  title: "Chios racontée par ceux qui y vivent",
  intro:
    "Tout ce que nous disons à nos hôtes avant leur arrivée : comment venir, où se loger, ce qui vaut vraiment le détour et comment organiser trois à cinq jours sur l’île.",
  sections: [
    {
      id: "getting-there",
      title: "Comment venir à Chios",
      items: [
        { title: "En avion", text: "Aegean et Sky Express relient Athènes à Chios en 50 minutes environ. L’aéroport de Chios est à quelques minutes de Kambos." },
        { title: "En ferry depuis le Pirée", text: "Blue Star Ferries relie le Pirée au port de Chios, à une dizaine de minutes en voiture de Kambos. Venez avec votre voiture pour explorer l’île à votre rythme." },
        { title: "Depuis la Turquie", text: "Des ferries relient Çeşme à la ville de Chios en une courte traversée. Vérifiez le document de voyage dont vous avez besoin." },
        {
          title: "Ne manquez pas la réduction ferry",
          text:
            "L’erreur la plus fréquente de nos hôtes : ne pas demander la réduction d’été. Ces derniers étés (par exemple du 13 juin au 30 septembre 2025), Blue Star Ferries a proposé 30 % de réduction pour un séjour d’au moins quatre nuits à Chios, avec une attestation de votre hébergement. Nous délivrons cette attestation à nos hôtes. Vérifiez les conditions de l’année auprès de la compagnie ou d’une agence de voyages.",
        },
      ],
    },
    {
      id: "where-to-stay",
      title: "Où loger : au milieu de l’île",
      paragraphs: [
        "Logez à Kambos ou à Karfas. Tous deux se trouvent au milieu de la côte est : l’extrême nord et l’extrême sud de Chios sont à peu près à la même distance, à environ une heure de route au plus. La ville, l’aéroport et le port sont à quelques minutes.",
      ],
    },
    {
      id: "top-five",
      title: "Nos cinq incontournables pour une première visite",
      items: [
        { title: "Mavra Volia", text: "La plage de galets volcaniques noirs près d’Emporios.", href: "/fr/plages-de-chios/plage-mavra-volia/", linkLabel: "Mavra Volia" },
        { title: "Pyrgi", text: "Le village peint de motifs xysta noirs et blancs.", href: "/fr/villages-de-chios/village-pyrgi/", linkLabel: "Pyrgi" },
        { title: "Mesta", text: "Le village fortifié médiéval le mieux préservé.", href: "/fr/villages-de-chios/village-mesta/", linkLabel: "Mesta" },
        { title: "Kambos", text: "Demeures en pierre et jardins d’agrumes derrière de hauts murs — là où nous vivons.", href: "/fr/chios/kampos-chios/", linkLabel: "Kambos" },
        { title: "Nea Moni", text: "Un monastère du XIe siècle aux célèbres mosaïques, inscrit au patrimoine mondial de l’UNESCO." },
      ],
      paragraphs: ["Avec plus de temps, ajoutez le village médiéval abandonné d’Anavatos et le village de pierre d’Avgonyma, au centre de Chios."],
    },
    {
      id: "beaches",
      title: "91 plages : choisissez selon le vent",
      paragraphs: [
        "Chios compte 91 plages différentes, orientées dans toutes les directions. Avant de choisir, consultez notre prévision de mer sur trois jours pour chaque plage : elle tient compte de l’orientation de chaque plage, pour trouver une mer calme même par jour de vent.",
      ],
      items: [{ title: "Prévision de mer", text: "L’état de la mer sur trois jours pour chaque plage.", href: "/fr/plages-de-chios/#sea-today", linkLabel: "Voir la mer aujourd’hui" }],
    },
    {
      id: "sunset",
      title: "Coucher de soleil, puis dîner",
      paragraphs: [
        "Nos couchers de soleil préférés sont à Sidirounta et à Avgonyma, côté ouest. Prévoyez aussi le dîner sur place, à Lithi ou à Avgonyma : si vous logez au milieu de l’île, le retour prend environ une heure, et il est bien plus agréable après un bon repas.",
      ],
      items: [
        { title: "Avgonyma", text: "Village de pierre, coucher de soleil et dîner.", href: "/fr/villages-de-chios/village-avgonyma/", linkLabel: "Avgonyma" },
        { title: "Lithi", text: "Baie de sable avec tavernes de poisson au bord de l’eau.", href: "/fr/plages-de-chios/plage-lithi/", linkLabel: "Lithi" },
      ],
    },
    {
      id: "plan",
      title: "Combien de jours ? Programmes de 3 et 5 jours",
      paragraphs: ["La plupart de nos hôtes restent trois à cinq jours. Depuis Kambos :"],
      items: [
        { title: "Jour 1", text: "Promenade à Kambos, puis la ville de Chios, son château et le port." },
        { title: "Jour 2", text: "Le sud : Pyrgi, Mesta et baignade à Mavra Volia." },
        { title: "Jour 3", text: "Le centre : Nea Moni, Anavatos et dîner au coucher du soleil à Avgonyma." },
        { title: "Jour 4", text: "Journée plage — choisissez la plus calme grâce à la prévision de mer." },
        { title: "Jour 5", text: "Excursion d’une journée à Çeşme, en Turquie, avec Sunrise Tours, ou le nord : Volissos et ses plages." },
      ],
    },
    {
      id: "tastes",
      title: "Saveurs de Chios",
      paragraphs: [
        "Le mastic est la signature de l’île : sa culture est inscrite au patrimoine culturel immatériel de l’UNESCO. À table, goûtez les pâtes faites main « chérisia », le fromage kasteli, les petites feuilles de vigne farcies et les petits feuilletés au fromage et au miel — et terminez le repas comme ici, avec une liqueur de mastic.",
      ],
    },
    {
      id: "who",
      title: "Familles en été, couples toute l’année",
      paragraphs: [
        "En juillet et août, la plupart de nos hôtes sont des familles : plages de sable peu profondes et trajets courts rendent Chios facile avec des enfants. Le reste de l’année appartient aux couples — villages paisibles, longs déjeuners et couchers de soleil sans foule.",
      ],
    },
    {
      id: "book-direct",
      title: "Notre conseil : réservez en direct",
      paragraphs: [
        "En réservant directement auprès de Voulamandis House, vous obtenez un meilleur prix, car aucune commission ne part aux plateformes de réservation — et nous préparons volontiers votre attestation pour la réduction ferry.",
      ],
      items: [{ title: "Chambres & appartements", text: "Voir les chambres et les disponibilités.", href: "/fr/chambres-a-chios/", linkLabel: "Voir les chambres" }],
    },
  ],
  seeAnswer:
    "Nos cinq incontournables : la plage de Mavra Volia, le village peint de Pyrgi, Mesta la médiévale, les jardins d’agrumes de Kambos et le monastère de Nea Moni, inscrit à l’UNESCO. Avec plus de temps, ajoutez Anavatos et Avgonyma au centre de Chios.",
  faq: {
    kicker: "FAQ Chios",
    title: "Visiter Chios : questions fréquentes",
    items: [
      { question: "Que voir à Chios ?", answer: "Nos cinq incontournables : la plage de Mavra Volia, le village peint de Pyrgi, Mesta la médiévale, les jardins d’agrumes de Kambos et le monastère de Nea Moni, inscrit à l’UNESCO. Avec plus de temps, ajoutez Anavatos et Avgonyma au centre de Chios." },
      { question: "Comment venir à Chios ?", answer: "En avion depuis Athènes avec Aegean ou Sky Express (environ 50 minutes), en ferry Blue Star depuis le Pirée, ou en ferry depuis Çeşme en Turquie. Kambos est à quelques minutes de l’aéroport et du port." },
      { question: "Combien de jours prévoir à Chios ?", answer: "Trois jours suffisent pour l’essentiel : la ville et Kambos, les villages du mastic du sud avec Mavra Volia, et le centre avec Nea Moni, Anavatos et Avgonyma. Cinq jours ajoutent une journée plage et une excursion au nord ou à Çeşme." },
      { question: "Existe-t-il une réduction ferry pour Chios ?", answer: "Ces derniers étés, Blue Star Ferries a proposé 30 % de réduction pour un séjour d’au moins quatre nuits à Chios, avec une attestation de l’hébergement. Voulamandis House la délivre à ses hôtes ; vérifiez les conditions de l’année auprès de la compagnie ou d’une agence." },
      { question: "Peut-on aller en Turquie depuis Chios ?", answer: "Oui. Çeşme est à une courte traversée et l’excursion d’une journée est facile, par exemple avec Sunrise Tours. Vérifiez le document de voyage exigé pour votre nationalité." },
    ],
  },
};

export const chiosIslandGuideDe: ChiosIslandGuide = {
  kicker: "Lokaler Guide",
  title: "Chios, erzählt von denen, die hier leben",
  intro:
    "Alles, was wir unseren Gästen vor der Anreise sagen: wie Sie hinkommen, wo Sie wohnen sollten, was sich wirklich lohnt und wie Sie drei bis fünf Tage auf der Insel planen.",
  sections: [
    {
      id: "getting-there",
      title: "Anreise nach Chios",
      items: [
        { title: "Mit dem Flugzeug", text: "Aegean und Sky Express fliegen in etwa 50 Minuten von Athen nach Chios. Der Flughafen liegt nur wenige Minuten von Kambos entfernt." },
        { title: "Mit der Fähre ab Piräus", text: "Blue Star Ferries verbindet Piräus mit dem Hafen von Chios-Stadt, rund zehn Autominuten von Kambos. Nehmen Sie Ihr Auto mit, wenn Sie die Insel in Ihrem Tempo entdecken möchten." },
        { title: "Aus der Türkei", text: "Von Çeşme fahren Fähren in kurzer Überfahrt nach Chios-Stadt. Prüfen Sie vorher, welches Reisedokument Sie benötigen." },
        {
          title: "Fährrabatt nicht verpassen",
          text:
            "Der häufigste Fehler unserer Gäste: Sie fragen nicht nach dem Sommerrabatt. In den letzten Sommern (zum Beispiel 13. Juni bis 30. September 2025) bot Blue Star Ferries 30 % Rabatt bei einem Aufenthalt von mindestens vier Nächten auf Chios, mit einer Bestätigung Ihrer Unterkunft. Diese Bestätigung stellen wir unseren Gästen aus. Prüfen Sie die Bedingungen des laufenden Jahres bei der Reederei oder einem Reisebüro.",
        },
      ],
    },
    {
      id: "where-to-stay",
      title: "Wo wohnen: in der Mitte der Insel",
      paragraphs: [
        "Wohnen Sie in Kambos oder Karfas. Beide liegen in der Mitte der Ostküste, sodass der äußerste Norden und der äußerste Süden von Chios etwa gleich weit entfernt sind, höchstens rund eine Stunde Fahrt. Stadt, Flughafen und Hafen sind nur Minuten entfernt.",
      ],
    },
    {
      id: "top-five",
      title: "Unsere fünf Highlights für den ersten Besuch",
      items: [
        { title: "Mavra Volia", text: "Der Strand mit schwarzen Vulkankieseln bei Emporios.", href: "/de/straende-chios/mavra-volia-strand/", linkLabel: "Mavra Volia" },
        { title: "Pyrgi", text: "Das Dorf mit den schwarz-weißen Xysta-Mustern.", href: "/de/doerfer-chios/pyrgi-dorf/", linkLabel: "Pyrgi" },
        { title: "Mesta", text: "Das am besten erhaltene mittelalterliche Festungsdorf.", href: "/de/doerfer-chios/mesta-dorf/", linkLabel: "Mesta" },
        { title: "Kambos", text: "Steinerne Herrenhäuser und Zitrusgärten hinter hohen Mauern — hier leben wir.", href: "/de/chios/kampos-chios/", linkLabel: "Kambos" },
        { title: "Nea Moni", text: "Ein Kloster aus dem 11. Jahrhundert mit berühmten Mosaiken, UNESCO-Weltkulturerbe." },
      ],
      paragraphs: ["Mit mehr Zeit kommen das verlassene mittelalterliche Dorf Anavatos und das Steindorf Avgonyma im Zentrum von Chios dazu."],
    },
    {
      id: "beaches",
      title: "91 Strände: nach dem Wind wählen",
      paragraphs: [
        "Chios hat 91 verschiedene Strände in alle Himmelsrichtungen. Werfen Sie vor der Wahl einen Blick auf unsere Drei-Tage-Seevorhersage für jeden Strand: Sie berücksichtigt die Ausrichtung jedes Strandes, damit Sie auch an windigen Tagen ruhiges Wasser finden.",
      ],
      items: [{ title: "Seevorhersage", text: "Seebedingungen für drei Tage an jedem Strand.", href: "/de/straende-chios/#sea-today", linkLabel: "Das Meer heute" }],
    },
    {
      id: "sunset",
      title: "Sonnenuntergang, dann Abendessen",
      paragraphs: [
        "Unsere liebsten Sonnenuntergänge erleben Sie in Sidirounta und Avgonyma an der Westseite. Planen Sie dort auch das Abendessen, in Lithi oder Avgonyma: Wenn Sie in der Inselmitte wohnen, dauert die Rückfahrt etwa eine Stunde — nach einem guten Essen ist sie viel angenehmer.",
      ],
      items: [
        { title: "Avgonyma", text: "Steindorf, Sonnenuntergang und Abendessen.", href: "/de/doerfer-chios/avgonyma-dorf/", linkLabel: "Avgonyma" },
        { title: "Lithi", text: "Sandbucht mit Fischtavernen direkt am Meer.", href: "/de/straende-chios/lithi-strand/", linkLabel: "Lithi" },
      ],
    },
    {
      id: "plan",
      title: "Wie viele Tage? Ein 3- und ein 5-Tage-Plan",
      paragraphs: ["Die meisten unserer Gäste bleiben drei bis fünf Tage. Von Kambos aus:"],
      items: [
        { title: "Tag 1", text: "Spaziergang durch Kambos, dann Chios-Stadt mit Burg und Hafen." },
        { title: "Tag 2", text: "Der Süden: Pyrgi, Mesta und Baden in Mavra Volia." },
        { title: "Tag 3", text: "Zentral-Chios: Nea Moni, Anavatos und Abendessen zum Sonnenuntergang in Avgonyma." },
        { title: "Tag 4", text: "Strandtag — wählen Sie mit der Seevorhersage den ruhigsten Strand." },
        { title: "Tag 5", text: "Tagesausflug nach Çeşme in der Türkei mit Sunrise Tours oder der Norden: Volissos und seine Strände." },
      ],
    },
    {
      id: "tastes",
      title: "Geschmack von Chios",
      paragraphs: [
        "Mastix ist das Markenzeichen der Insel: Sein Anbau steht auf der UNESCO-Liste des immateriellen Kulturerbes. Probieren Sie handgemachte „Chérisia“-Nudeln, Kasteli-Käse, kleine gefüllte Weinblätter und Käsetaschen mit Honig — und beenden Sie das Essen wie die Einheimischen mit einem Mastixlikör.",
      ],
    },
    {
      id: "who",
      title: "Familien im Sommer, Paare das ganze Jahr",
      paragraphs: [
        "Im Juli und August sind die meisten unserer Gäste Familien: flache Sandstrände und kurze Wege machen Chios mit Kindern einfach. Den Rest des Jahres gehört die Insel den Paaren — ruhige Dörfer, lange Mittagessen und Sonnenuntergänge ohne Gedränge.",
      ],
    },
    {
      id: "book-direct",
      title: "Unser Tipp: direkt buchen",
      paragraphs: [
        "Bei direkter Buchung im Voulamandis House erhalten Sie einen besseren Preis, weil keine Provision an Buchungsplattformen geht — und Ihre Bestätigung für den Fährrabatt bereiten wir gern vor.",
      ],
      items: [{ title: "Zimmer & Apartments", text: "Zimmer ansehen und Verfügbarkeit prüfen.", href: "/de/chios-zimmer/", linkLabel: "Zimmer ansehen" }],
    },
  ],
  seeAnswer:
    "Unsere fünf Highlights: der Strand Mavra Volia, das bemalte Dorf Pyrgi, das mittelalterliche Mesta, die Zitrusgärten von Kambos und das UNESCO-Kloster Nea Moni. Mit mehr Zeit kommen Anavatos und Avgonyma im Zentrum dazu.",
  faq: {
    kicker: "Chios FAQ",
    title: "Chios besuchen: häufige Fragen",
    items: [
      { question: "Was sollte man auf Chios sehen?", answer: "Unsere fünf Highlights: der Strand Mavra Volia, das bemalte Dorf Pyrgi, das mittelalterliche Mesta, die Zitrusgärten von Kambos und das UNESCO-Kloster Nea Moni. Mit mehr Zeit kommen Anavatos und Avgonyma im Zentrum dazu." },
      { question: "Wie komme ich nach Chios?", answer: "Mit dem Flugzeug ab Athen mit Aegean oder Sky Express (etwa 50 Minuten), mit Blue Star Ferries ab Piräus oder mit der Fähre ab Çeşme in der Türkei. Kambos liegt wenige Minuten von Flughafen und Hafen entfernt." },
      { question: "Wie viele Tage brauche ich auf Chios?", answer: "Drei Tage reichen für das Wichtigste: Stadt und Kambos, die Mastixdörfer im Süden mit Mavra Volia und Zentral-Chios mit Nea Moni, Anavatos und Avgonyma. Mit fünf Tagen kommen ein Strandtag und ein Ausflug in den Norden oder nach Çeşme dazu." },
      { question: "Gibt es einen Fährrabatt für Chios?", answer: "In den letzten Sommern bot Blue Star Ferries 30 % Rabatt bei mindestens vier Nächten auf Chios, mit Bestätigung der Unterkunft. Voulamandis House stellt sie seinen Gästen aus; prüfen Sie die aktuellen Bedingungen bei der Reederei oder einem Reisebüro." },
      { question: "Kann man von Chios in die Türkei fahren?", answer: "Ja. Çeşme ist eine kurze Fährfahrt entfernt, ein Tagesausflug ist einfach, zum Beispiel mit Sunrise Tours. Prüfen Sie, welches Reisedokument Sie benötigen." },
    ],
  },
};

export const chiosIslandGuideIt: ChiosIslandGuide = {
  kicker: "Guida locale",
  title: "Chios raccontata da chi ci vive",
  intro:
    "Tutto quello che diciamo ai nostri ospiti prima dell’arrivo: come arrivare, dove alloggiare, cosa vale davvero la pena vedere e come organizzare da tre a cinque giorni sull’isola.",
  sections: [
    {
      id: "getting-there",
      title: "Come arrivare a Chios",
      items: [
        { title: "In aereo", text: "Aegean e Sky Express volano da Atene a Chios in circa 50 minuti. L’aeroporto di Chios è a pochi minuti da Kambos." },
        { title: "In traghetto dal Pireo", text: "Blue Star Ferries collega il Pireo al porto di Chios, a una decina di minuti in auto da Kambos. Portate l’auto se volete esplorare l’isola con calma." },
        { title: "Dalla Turchia", text: "Da Çeşme partono traghetti per la città di Chios, con una breve traversata. Verificate quale documento di viaggio vi serve." },
        {
          title: "Non perdete lo sconto sul traghetto",
          text:
            "L’errore più comune dei nostri ospiti: non chiedono lo sconto estivo. Nelle ultime estati (per esempio dal 13 giugno al 30 settembre 2025) Blue Star Ferries ha offerto il 30% di sconto per soggiorni di almeno quattro notti a Chios, con un certificato della struttura. Noi lo rilasciamo ai nostri ospiti. Verificate le condizioni dell’anno con la compagnia o un’agenzia di viaggi.",
        },
      ],
    },
    {
      id: "where-to-stay",
      title: "Dove alloggiare: al centro dell’isola",
      paragraphs: [
        "Alloggiate a Kambos o a Karfas. Entrambi si trovano a metà della costa orientale, quindi l’estremo nord e l’estremo sud di Chios sono più o meno alla stessa distanza, al massimo a circa un’ora d’auto. Città, aeroporto e porto sono a pochi minuti.",
      ],
    },
    {
      id: "top-five",
      title: "I nostri cinque imperdibili per la prima visita",
      items: [
        { title: "Mavra Volia", text: "La spiaggia di ciottoli vulcanici neri vicino a Emporios.", href: "/it/spiagge-chios/spiaggia-mavra-volia/", linkLabel: "Mavra Volia" },
        { title: "Pyrgi", text: "Il villaggio dipinto con i motivi xysta bianchi e neri.", href: "/it/villaggi-chios/villaggio-pyrgi/", linkLabel: "Pyrgi" },
        { title: "Mesta", text: "Il villaggio fortificato medievale meglio conservato.", href: "/it/villaggi-chios/villaggio-mesta/", linkLabel: "Mesta" },
        { title: "Kambos", text: "Dimore in pietra e agrumeti dietro alti muri — dove viviamo noi.", href: "/it/chios/kampos-chios/", linkLabel: "Kambos" },
        { title: "Nea Moni", text: "Un monastero dell’XI secolo con famosi mosaici, patrimonio mondiale UNESCO." },
      ],
      paragraphs: ["Con più tempo, aggiungete il villaggio medievale abbandonato di Anavatos e il borgo in pietra di Avgonyma, nel centro di Chios."],
    },
    {
      id: "beaches",
      title: "91 spiagge: scegliete in base al vento",
      paragraphs: [
        "Chios ha 91 spiagge diverse, rivolte in ogni direzione. Prima di scegliere, consultate la nostra previsione del mare a tre giorni per ogni spiaggia: tiene conto dell’orientamento di ciascuna, così trovate acqua calma anche nei giorni di vento.",
      ],
      items: [{ title: "Previsione del mare", text: "Condizioni del mare a tre giorni per ogni spiaggia.", href: "/it/spiagge-chios/#sea-today", linkLabel: "Il mare oggi" }],
    },
    {
      id: "sunset",
      title: "Tramonto, poi cena",
      paragraphs: [
        "I nostri tramonti preferiti sono a Sidirounta e ad Avgonyma, sul lato ovest. Organizzate lì anche la cena, a Lithi o ad Avgonyma: se alloggiate al centro dell’isola il rientro richiede circa un’ora, ed è molto più piacevole dopo un buon pasto.",
      ],
      items: [
        { title: "Avgonyma", text: "Borgo in pietra, tramonto e cena.", href: "/it/villaggi-chios/villaggio-avgonyma/", linkLabel: "Avgonyma" },
        { title: "Lithi", text: "Baia sabbiosa con taverne di pesce sul mare.", href: "/it/spiagge-chios/spiaggia-lithi/", linkLabel: "Lithi" },
      ],
    },
    {
      id: "plan",
      title: "Quanti giorni? Programmi di 3 e 5 giorni",
      paragraphs: ["La maggior parte dei nostri ospiti resta da tre a cinque giorni. Partendo da Kambos:"],
      items: [
        { title: "Giorno 1", text: "Passeggiata a Kambos, poi la città di Chios con il castello e il porto." },
        { title: "Giorno 2", text: "Il sud: Pyrgi, Mesta e un bagno a Mavra Volia." },
        { title: "Giorno 3", text: "Chios centrale: Nea Moni, Anavatos e cena al tramonto ad Avgonyma." },
        { title: "Giorno 4", text: "Giornata al mare — scegliete la spiaggia più calma con la previsione del mare." },
        { title: "Giorno 5", text: "Gita di un giorno a Çeşme, in Turchia, con Sunrise Tours, oppure il nord: Volissos e le sue spiagge." },
      ],
    },
    {
      id: "tastes",
      title: "Sapori di Chios",
      paragraphs: [
        "Il mastice è la firma dell’isola: la sua coltivazione è nella lista UNESCO del patrimonio culturale immateriale. A tavola provate la pasta fatta a mano «chérisia», il formaggio kasteli, gli involtini di foglie di vite e le piccole tortine al formaggio con miele — e chiudete il pasto come facciamo noi, con un liquore al mastice.",
      ],
    },
    {
      id: "who",
      title: "Famiglie d’estate, coppie tutto l’anno",
      paragraphs: [
        "A luglio e agosto la maggior parte dei nostri ospiti sono famiglie: spiagge di sabbia con acqua bassa e brevi tragitti rendono Chios facile con i bambini. Il resto dell’anno appartiene alle coppie — villaggi tranquilli, pranzi lunghi e tramonti senza folla.",
      ],
    },
    {
      id: "book-direct",
      title: "Il nostro consiglio: prenotate direttamente",
      paragraphs: [
        "Prenotando direttamente con Voulamandis House avete un prezzo migliore, perché non si pagano commissioni alle piattaforme di prenotazione — e prepariamo volentieri il vostro certificato per lo sconto sul traghetto.",
      ],
      items: [{ title: "Camere e appartamenti", text: "Vedi le camere e la disponibilità.", href: "/it/camere-a-chios/", linkLabel: "Vedi le camere" }],
    },
  ],
  seeAnswer:
    "I nostri cinque imperdibili: la spiaggia di Mavra Volia, il villaggio dipinto di Pyrgi, la medievale Mesta, gli agrumeti di Kambos e il monastero UNESCO di Nea Moni. Con più tempo, aggiungete Anavatos e Avgonyma.",
  faq: {
    kicker: "FAQ Chios",
    title: "Visitare Chios: domande frequenti",
    items: [
      { question: "Cosa vedere a Chios?", answer: "I nostri cinque imperdibili: la spiaggia di Mavra Volia, il villaggio dipinto di Pyrgi, la medievale Mesta, gli agrumeti di Kambos e il monastero UNESCO di Nea Moni. Con più tempo, aggiungete Anavatos e Avgonyma nel centro dell’isola." },
      { question: "Come si arriva a Chios?", answer: "In aereo da Atene con Aegean o Sky Express (circa 50 minuti), con Blue Star Ferries dal Pireo o in traghetto da Çeşme, in Turchia. Kambos è a pochi minuti da aeroporto e porto." },
      { question: "Quanti giorni servono a Chios?", answer: "Tre giorni bastano per l’essenziale: città e Kambos, i villaggi del mastice del sud con Mavra Volia e Chios centrale con Nea Moni, Anavatos e Avgonyma. Con cinque giorni aggiungete una giornata al mare e una gita al nord o a Çeşme." },
      { question: "C’è uno sconto sui traghetti per Chios?", answer: "Nelle ultime estati Blue Star Ferries ha offerto il 30% di sconto per soggiorni di almeno quattro notti a Chios, con certificato della struttura. Voulamandis House lo rilascia ai suoi ospiti; verificate le condizioni dell’anno con la compagnia o un’agenzia." },
      { question: "Si può andare in Turchia da Chios?", answer: "Sì. Çeşme è a una breve traversata e la gita di un giorno è facile, per esempio con Sunrise Tours. Verificate quale documento di viaggio serve per la vostra nazionalità." },
    ],
  },
};

export const chiosIslandGuideEs: ChiosIslandGuide = {
  kicker: "Guía local",
  title: "Quíos contada por quienes vivimos aquí",
  intro:
    "Todo lo que contamos a nuestros huéspedes antes de llegar: cómo venir, dónde alojarse, qué merece de verdad la pena y cómo organizar de tres a cinco días en la isla.",
  sections: [
    {
      id: "getting-there",
      title: "Cómo llegar a Quíos",
      items: [
        { title: "En avión", text: "Aegean y Sky Express vuelan de Atenas a Quíos en unos 50 minutos. El aeropuerto de Quíos está a pocos minutos de Kambos." },
        { title: "En ferry desde el Pireo", text: "Blue Star Ferries une el Pireo con el puerto de Quíos, a unos diez minutos en coche de Kambos. Trae tu coche si quieres recorrer la isla a tu ritmo." },
        { title: "Desde Turquía", text: "Desde Çeşme salen ferris hacia la ciudad de Quíos en una travesía corta. Comprueba qué documento de viaje necesitas." },
        {
          title: "No te pierdas el descuento en el ferry",
          text:
            "El error más habitual de nuestros huéspedes: no pedir el descuento de verano. En los últimos veranos (por ejemplo, del 13 de junio al 30 de septiembre de 2025) Blue Star Ferries ha ofrecido un 30% de descuento para estancias de al menos cuatro noches en Quíos, con un certificado del alojamiento. Nosotros lo emitimos para nuestros huéspedes. Confirma las condiciones del año con la naviera o una agencia de viajes.",
        },
      ],
    },
    {
      id: "where-to-stay",
      title: "Dónde alojarse: en el centro de la isla",
      paragraphs: [
        "Alójate en Kambos o en Karfas. Ambos están en el centro de la costa este, así que el extremo norte y el extremo sur de Quíos quedan más o menos a la misma distancia, como mucho a una hora en coche. La ciudad, el aeropuerto y el puerto están a pocos minutos.",
      ],
    },
    {
      id: "top-five",
      title: "Nuestros cinco imprescindibles para la primera visita",
      items: [
        { title: "Mavra Volia", text: "La playa de guijarros volcánicos negros cerca de Emporios.", href: "/es/playas-chios/playa-mavra-volia/", linkLabel: "Mavra Volia" },
        { title: "Pyrgi", text: "El pueblo pintado con motivos xysta en blanco y negro.", href: "/es/pueblos-chios/pueblo-pyrgi/", linkLabel: "Pyrgi" },
        { title: "Mesta", text: "El pueblo fortificado medieval mejor conservado.", href: "/es/pueblos-chios/pueblo-mesta/", linkLabel: "Mesta" },
        { title: "Kambos", text: "Mansiones de piedra y huertos de cítricos tras altos muros — donde vivimos.", href: "/es/chios/kampos-chios/", linkLabel: "Kambos" },
        { title: "Nea Moni", text: "Un monasterio del siglo XI con famosos mosaicos, Patrimonio Mundial de la UNESCO." },
      ],
      paragraphs: ["Con más tiempo, añade el pueblo medieval abandonado de Anavatos y el pueblo de piedra de Avgonyma, en el centro de Quíos."],
    },
    {
      id: "beaches",
      title: "91 playas: elige según el viento",
      paragraphs: [
        "Quíos tiene 91 playas distintas, orientadas en todas las direcciones. Antes de elegir, consulta nuestra previsión del mar a tres días para cada playa: tiene en cuenta hacia dónde mira cada una, para encontrar agua tranquila incluso los días de viento.",
      ],
      items: [{ title: "Previsión del mar", text: "Estado del mar a tres días en cada playa.", href: "/es/playas-chios/#sea-today", linkLabel: "Ver el mar hoy" }],
    },
    {
      id: "sunset",
      title: "Atardecer y después cena",
      paragraphs: [
        "Nuestros atardeceres favoritos están en Sidirounta y Avgonyma, en el lado oeste. Planifica también la cena allí, en Lithi o en Avgonyma: si te alojas en el centro de la isla, la vuelta lleva una hora aproximadamente y es mucho más agradable después de una buena comida.",
      ],
      items: [
        { title: "Avgonyma", text: "Pueblo de piedra, atardecer y cena.", href: "/es/pueblos-chios/pueblo-avgonyma/", linkLabel: "Avgonyma" },
        { title: "Lithi", text: "Bahía de arena con tabernas de pescado junto al mar.", href: "/es/playas-chios/playa-lithi/", linkLabel: "Lithi" },
      ],
    },
    {
      id: "plan",
      title: "¿Cuántos días? Plan de 3 y de 5 días",
      paragraphs: ["La mayoría de nuestros huéspedes se queda de tres a cinco días. Desde Kambos:"],
      items: [
        { title: "Día 1", text: "Paseo por Kambos y después la ciudad de Quíos, su castillo y el puerto." },
        { title: "Día 2", text: "El sur: Pyrgi, Mesta y un baño en Mavra Volia." },
        { title: "Día 3", text: "El centro: Nea Moni, Anavatos y cena al atardecer en Avgonyma." },
        { title: "Día 4", text: "Día de playa — elige la más tranquila con la previsión del mar." },
        { title: "Día 5", text: "Excursión de un día a Çeşme, en Turquía, con Sunrise Tours, o el norte: Volissos y sus playas." },
      ],
    },
    {
      id: "tastes",
      title: "Sabores de Quíos",
      paragraphs: [
        "La mastiha es la firma de la isla: su cultivo está en la lista de Patrimonio Cultural Inmaterial de la UNESCO. En la mesa prueba la pasta hecha a mano «chérisia», el queso kasteli, los pequeños dolmades y las empanadillas de queso con miel — y termina la comida como aquí, con un licor de mastiha.",
      ],
    },
    {
      id: "who",
      title: "Familias en verano, parejas todo el año",
      paragraphs: [
        "En julio y agosto la mayoría de nuestros huéspedes son familias: playas de arena poco profundas y trayectos cortos hacen de Quíos un destino fácil con niños. El resto del año la isla es de las parejas — pueblos tranquilos, comidas largas y atardeceres sin multitudes.",
      ],
    },
    {
      id: "book-direct",
      title: "Nuestro consejo: reserva directamente",
      paragraphs: [
        "Reservando directamente con Voulamandis House consigues mejor precio, porque no se paga comisión a las plataformas de reserva — y te preparamos con gusto el certificado para el descuento del ferry.",
      ],
      items: [{ title: "Habitaciones y apartamentos", text: "Ver habitaciones y disponibilidad.", href: "/es/habitaciones-en-chios/", linkLabel: "Ver habitaciones" }],
    },
  ],
  seeAnswer:
    "Nuestros cinco imprescindibles: la playa de Mavra Volia, el pueblo pintado de Pyrgi, la medieval Mesta, los huertos de Kambos y el monasterio de Nea Moni, Patrimonio de la UNESCO. Con más tiempo, añade Anavatos y Avgonyma.",
  faq: {
    kicker: "Preguntas sobre Quíos",
    title: "Visitar Quíos: preguntas frecuentes",
    items: [
      { question: "¿Qué ver en Quíos?", answer: "Nuestros cinco imprescindibles: la playa de Mavra Volia, el pueblo pintado de Pyrgi, la medieval Mesta, los huertos de cítricos de Kambos y el monasterio de Nea Moni, Patrimonio de la UNESCO. Con más tiempo, añade Anavatos y Avgonyma en el centro de la isla." },
      { question: "¿Cómo llego a Quíos?", answer: "En avión desde Atenas con Aegean o Sky Express (unos 50 minutos), con Blue Star Ferries desde el Pireo o en ferry desde Çeşme, en Turquía. Kambos está a pocos minutos del aeropuerto y del puerto." },
      { question: "¿Cuántos días necesito en Quíos?", answer: "Tres días bastan para lo esencial: la ciudad y Kambos, los pueblos del mastiha del sur con Mavra Volia y el centro con Nea Moni, Anavatos y Avgonyma. Con cinco días añades un día de playa y una excursión al norte o a Çeşme." },
      { question: "¿Hay descuento en el ferry para Quíos?", answer: "En los últimos veranos Blue Star Ferries ha ofrecido un 30% de descuento para estancias de al menos cuatro noches en Quíos, con certificado del alojamiento. Voulamandis House lo emite para sus huéspedes; confirma las condiciones del año con la naviera o una agencia." },
      { question: "¿Se puede ir a Turquía desde Quíos?", answer: "Sí. Çeşme está a una travesía corta y la excursión de un día es fácil, por ejemplo con Sunrise Tours. Comprueba qué documento de viaje exige tu nacionalidad." },
    ],
  },
};

export const chiosIslandGuideTr: ChiosIslandGuide = {
  kicker: "Yerel rehber",
  title: "Sakız Adası’nı burada yaşayanlardan dinleyin",
  intro:
    "Misafirlerimize gelmeden önce anlattığımız her şey: nasıl gelinir, nerede kalınır, gerçekten görülmeye değer yerler ve adada üç ila beş günü nasıl planlarsınız.",
  sections: [
    {
      id: "getting-there",
      title: "Sakız Adası’na nasıl gelinir",
      items: [
        { title: "Çeşme’den feribotla", text: "Misafirlerimizin çoğu Çeşme’den kısa bir feribot yolculuğuyla Sakız limanına gelir. Liman, Kambos’a arabayla yaklaşık on dakika uzaklıktadır. Hangi seyahat belgesine ihtiyacınız olduğunu önceden kontrol edin." },
        { title: "Uçakla", text: "Aegean ve Sky Express, Atina’dan Sakız’a yaklaşık 50 dakikada uçar. Sakız havalimanı Kambos’a sadece birkaç dakika uzaklıktadır." },
        { title: "Pire’den feribotla", text: "Blue Star Ferries, Pire’yi Sakız limanına bağlar. Adayı kendi temponuzda gezmek isterseniz aracınızla gelin." },
        {
          title: "Pire feribot indirimini kaçırmayın",
          text:
            "Pire’den gelenlerin en sık yaptığı hata: yaz indirimini istememek. Son yazlarda (örneğin 13 Haziran–30 Eylül 2025) Blue Star Ferries, Sakız’da en az dört gecelik konaklamalar için konaklama belgesiyle %30 indirim sundu. Bu belgeyi misafirlerimiz için biz düzenliyoruz. Yılın güncel koşullarını feribot şirketinden veya bir seyahat acentesinden teyit edin.",
        },
      ],
    },
    {
      id: "where-to-stay",
      title: "Nerede kalınır: adanın ortasında",
      paragraphs: [
        "Kambos’ta veya Karfas’ta kalın. İkisi de doğu kıyısının ortasındadır; bu sayede Sakız’ın en kuzey ve en güney noktaları aşağı yukarı aynı uzaklıkta, arabayla en fazla yaklaşık bir saattir. Şehir merkezi, havalimanı ve liman birkaç dakika uzaklıktadır.",
      ],
    },
    {
      id: "top-five",
      title: "İlk ziyaret için beş vazgeçilmezimiz",
      items: [
        { title: "Mavra Volia", text: "Emporios yakınındaki siyah volkanik çakıllı plaj.", href: "/tr/sakiz-adasi-plajlari/mavra-volia-plaji/", linkLabel: "Mavra Volia" },
        { title: "Pyrgi", text: "Siyah-beyaz xysta desenleriyle süslü köy.", href: "/tr/sakiz-adasi-koyleri/pyrgi-koyu/", linkLabel: "Pyrgi" },
        { title: "Mesta", text: "En iyi korunmuş Orta Çağ kale köyü.", href: "/tr/sakiz-adasi-koyleri/mesta-koyu/", linkLabel: "Mesta" },
        { title: "Kambos", text: "Yüksek duvarların ardında taş konaklar ve narenciye bahçeleri — bizim yaşadığımız yer.", href: "/tr/chios/kampos-chios/", linkLabel: "Kambos" },
        { title: "Nea Moni", text: "Ünlü mozaikleriyle 11. yüzyıldan kalma, UNESCO Dünya Mirası listesindeki manastır." },
      ],
      paragraphs: ["Daha fazla vaktiniz varsa, adanın ortasındaki terk edilmiş Orta Çağ köyü Anavatos’u ve taş köy Avgonyma’yı ekleyin."],
    },
    {
      id: "beaches",
      title: "91 plaj: rüzgâra göre seçin",
      paragraphs: [
        "Sakız Adası’nda her yöne bakan 91 farklı plaj var. Seçmeden önce sitemizdeki her plaj için üç günlük deniz tahminine bakın: tahmin, her plajın hangi yöne baktığını hesaba katar; böylece rüzgârlı günlerde bile sakin deniz bulabilirsiniz.",
      ],
      items: [{ title: "Deniz tahmini", text: "Her plaj için üç günlük deniz durumu.", href: "/tr/sakiz-adasi-plajlari/#sea-today", linkLabel: "Bugün deniz nasıl" }],
    },
    {
      id: "sunset",
      title: "Önce gün batımı, sonra akşam yemeği",
      paragraphs: [
        "En sevdiğimiz gün batımları batı yakasında, Sidirounta ve Avgonyma’dadır. Akşam yemeğini de orada, Lithi’de ya da Avgonyma’da planlayın: adanın ortasında kalıyorsanız dönüş yaklaşık bir saat sürer ve güzel bir yemekten sonra çok daha keyifli olur.",
      ],
      items: [
        { title: "Avgonyma", text: "Taş köy, gün batımı ve akşam yemeği.", href: "/tr/sakiz-adasi-koyleri/avgonyma-koyu/", linkLabel: "Avgonyma" },
        { title: "Lithi", text: "Deniz kenarında balık tavernalarıyla kumlu koy.", href: "/tr/sakiz-adasi-plajlari/lithi-plaji/", linkLabel: "Lithi" },
      ],
    },
    {
      id: "plan",
      title: "Kaç gün? 3 ve 5 günlük plan",
      paragraphs: ["Misafirlerimizin çoğu üç ila beş gün kalıyor. Kambos’tan başlayarak:"],
      items: [
        { title: "1. gün", text: "Kambos’ta yürüyüş, ardından Sakız şehri, kalesi ve limanı." },
        { title: "2. gün", text: "Güney: Pyrgi, Mesta ve Mavra Volia’da yüzme." },
        { title: "3. gün", text: "Orta Sakız: Nea Moni, Anavatos ve Avgonyma’da gün batımında akşam yemeği." },
        { title: "4. gün", text: "Plaj günü — deniz tahminine bakarak en sakin plajı seçin." },
        { title: "5. gün", text: "Kuzey: Volissos ve plajları." },
      ],
    },
    {
      id: "tastes",
      title: "Sakız’ın lezzetleri",
      paragraphs: [
        "Mastik adanın imzasıdır: yetiştiriciliği UNESCO Somut Olmayan Kültürel Miras listesindedir. Sofrada el yapımı «chérisia» makarna, kasteli peyniri, küçük sarmalar ve ballı peynirli börekçikleri deneyin — yemeği de bizim gibi bir kadeh mastik likörüyle bitirin.",
      ],
    },
    {
      id: "who",
      title: "Yazın aileler, yıl boyunca çiftler",
      paragraphs: [
        "Temmuz ve ağustosta misafirlerimizin çoğu ailelerdir: sığ kumlu plajlar ve kısa mesafeler Sakız’ı çocuklarla kolay kılar. Yılın geri kalanı çiftlerindir — sakin köyler, uzun öğle yemekleri ve kalabalıksız gün batımları.",
      ],
    },
    {
      id: "book-direct",
      title: "Tavsiyemiz: doğrudan rezervasyon",
      paragraphs: [
        "Voulamandis House’a doğrudan rezervasyon yaptığınızda daha iyi fiyat alırsınız, çünkü rezervasyon platformlarına komisyon ödenmez — feribot indirimi belgenizi de memnuniyetle hazırlarız.",
      ],
      items: [{ title: "Odalar ve daireler", text: "Odaları ve müsaitliği görün.", href: "/tr/sakiz-adasi-odalari/", linkLabel: "Odaları gör" }],
    },
  ],
  seeAnswer:
    "Beş vazgeçilmezimiz: Mavra Volia plajı, boyalı köy Pyrgi, Orta Çağ köyü Mesta, Kambos’un narenciye bahçeleri ve UNESCO listesindeki Nea Moni manastırı. Daha fazla vaktiniz varsa Anavatos ve Avgonyma’yı ekleyin.",
  faq: {
    kicker: "Sakız SSS",
    title: "Sakız Adası’nı ziyaret: sık sorulan sorular",
    items: [
      { question: "Sakız Adası’nda ne görülür?", answer: "Beş vazgeçilmezimiz: Mavra Volia plajı, boyalı köy Pyrgi, Orta Çağ köyü Mesta, Kambos’un narenciye bahçeleri ve UNESCO listesindeki Nea Moni manastırı. Daha fazla vaktiniz varsa adanın ortasındaki Anavatos ve Avgonyma’yı ekleyin." },
      { question: "Çeşme’den Sakız’a nasıl gelinir?", answer: "Çeşme’den Sakız limanına kısa bir feribot yolculuğuyla gelinir; liman Kambos’a arabayla yaklaşık on dakikadır. Hangi seyahat belgesine ihtiyacınız olduğunu önceden kontrol edin." },
      { question: "Sakız Adası’nda kaç gün kalmalıyım?", answer: "Üç gün temel noktalar için yeterlidir: şehir ve Kambos, Mavra Volia ile güneydeki mastik köyleri ve Nea Moni, Anavatos, Avgonyma ile orta Sakız. Beş günle bir plaj günü ve kuzeye bir gezi eklenir." },
      { question: "Sakız Adası’nda arabaya ihtiyacım var mı?", answer: "Çok işinize yarar. Plajlar ve köyler adaya yayılmıştır; kendi aracınızla ya da kiralık araçla hepsini kendi temponuzda birleştirebilirsiniz." },
    ],
  },
};

export const chiosIslandGuideByLanguage = {
  en: chiosIslandGuideEn,
  el: chiosIslandGuideEl,
  fr: chiosIslandGuideFr,
  de: chiosIslandGuideDe,
  it: chiosIslandGuideIt,
  es: chiosIslandGuideEs,
  tr: chiosIslandGuideTr,
} as const;
