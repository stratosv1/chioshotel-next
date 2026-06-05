import type { LanguageCode } from "@/lib/languages";
import { normalizePath } from "@/lib/languages";

export type FindYourRoomPageData = {
  language: LanguageCode;
  path: string;
  seo: {
    canonicalPath: string;
    title: string;
    description: string;
    ogImage: string;
  };
  hero: {
    title: string;
    eyebrow: string;
    description: string;
  };
  engine: FindYourRoomTranslations;
};

export type FindYourRoomTranslations = {
  locale: string;
  currencyLocale: string;

  topBenefits: {
    live: string;
    directContact: string;
    discount: string;
    commissions: string;
    total: string;
  };

  basics: {
    title: string;
    firstName: string;
    firstNamePlaceholder: string;
    checkin: string;
    checkout: string;
    roomsCount: string;
    guests: string;
    room: string;
    continue: string;
  };

  filters: {
    title: string;
    titleWithName: string;
    all: string;
    budget: string;
    stairs: string;
    upperFloor: string;
    ground: string;
    gardenView: string;
    upperFloorView: string;
    kitchen: string;
    noKitchen: string;
    clear: string;
    search: string;
    checking: string;
  };

  results: {
    title: string;
    titleWithName: string;
    selected: string;
    guest: string;
    guests: string;
    night: string;
    nights: string;
    room: string;
    rooms: string;
    select: string;
    changeSelection: string;
    selectedForRoom: string;
    removed: string;
    liveNow: string;
    bestChoice: string;
    discount: string;
    gallery: string;
    more: string;
    onKnownPlatforms: string;
    bestPriceGuarantee: string;
    scratchAndSee: string;
    noAvailabilityTitle: string;
    noAvailabilityText: string;
    noPerfectMatchTitle: string;
    noPerfectMatchText: string;
  };

  breakfast: {
    title: string;
    titleWithName: string;
    withBreakfast: string;
    withoutBreakfast: string;
    directPrice: string;
    breakfast: string;
    total: string;
    notAdded: string;
    person: string;
    people: string;
    day: string;
    priceBadge: string;
    reviewsTitle: string;
    continue: string;
  };

  contact: {
    title: string;
    subtitle: string;
    lastName: string;
    email: string;
    mobile: string;
    phone: string;
    whatsapp: string;
    messageGreeting: string;
    messageName: string;
    messageIntro: string;
    messageCheckin: string;
    messageCheckout: string;
    messageNights: string;
    messageRooms: string;
    messageTotalGuests: string;
    messageRoomSelections: string;
    messageBreakfast: string;
    messageDirectTotal: string;
    yes: string;
    no: string;
  };

  validation: {
    firstName: string;
    dates: string;
    checkoutAfterCheckin: string;
    minimumStay: string;
    guests: string;
    searchError: string;
    genericSearchError: string;
  };

  toasts: {
    roomAdded: string;
    alreadySelected: string;
    changeSelection: string;
    breakfastYes: string;
    breakfastNo: string;
    back: string;
    reset: string;
    done: string;
  };

  roomLabels: Record<string, string>;
};

export const findYourRoomPaths: Record<LanguageCode, string> = {
  en: "/find-your-room/",
  el: "/el/vres-to-domatio-sou/",
  fr: "/fr/trouvez-votre-chambre/",
  de: "/de/finde-dein-zimmer/",
  it: "/it/trova-la-tua-camera/",
  es: "/es/encuentra-tu-habitacion/",
  tr: "/tr/odani-bul/",
};

const ogImage =
  "https://chioshotel.gr/wp-content/uploads/2022/12/chios-hotels-family-apartments.webp";

const baseRoomLabels = {
  room: "Room",
  apartment: "Apartment",
  firstFloor: "First floor",
  groundFloor: "Ground floor",
  independentUnit: "Independent unit",
  budgetDoubleRoom: "Budget double room",
  firstFloorDoubleTriple: "First-floor double / triple",
  groundFloorDoubleTriple: "Ground-floor double / triple",
  apartmentType: "Apartment",
  wifi: "Wi-Fi",
  kettle: "Coffee and tea kettle",
  privateBalcony: "Private balcony",
  upperFloorView: "Upper-floor view",
  accessByStairs: "Access by stairs",
  noStairs: "No stairs",
  kitchenette: "Kitchenette",
  kitchen: "Kitchen",
  gardenView: "Garden view",
  airConditioning: "Air conditioning",
  fridge: "Fridge",
  doubleBed: "1 double bed",
  singleBed: "1 single bed",
  singleBeds2: "2 single beds",
  sofaBed: "1 sofa bed",
  sofaBeds2: "2 sofa beds",
  openPlanSpace: "Open-plan space",
  twoSpaces: "Two spaces",
  twoSpacesNoDoor: "Two spaces, no connecting door",
  groundFloorView: "Ground-floor view",
};

const translations: Record<LanguageCode, FindYourRoomTranslations> = {
  en: {
    locale: "en",
    currencyLocale: "en-GB",
    topBenefits: {
      live: "Live",
      directContact: "Direct contact",
      discount: "Discount",
      commissions: "Commissions",
      total: "Total",
    },
    basics: {
      title: "Find your room",
      firstName: "First name",
      firstNamePlaceholder: "e.g. Nick",
      checkin: "Check-in",
      checkout: "Check-out",
      roomsCount: "Number of rooms",
      guests: "Guests",
      room: "Room",
      continue: "Continue",
    },
    filters: {
      title: "Looking for something specific?",
      titleWithName: "{name}, are you looking for something specific?",
      all: "All",
      budget: "Budget",
      stairs: "With stairs",
      upperFloor: "First floor",
      ground: "Ground floor",
      gardenView: "Garden view",
      upperFloorView: "Upper-floor view",
      kitchen: "Kitchen / kitchenette",
      noKitchen: "No kitchen",
      clear: "Clear",
      search: "Search",
      checking: "Checking live availability...",
    },
    results: {
      title: "Your options",
      titleWithName: "{name}, here are your options",
      selected: "selected",
      guest: "guest",
      guests: "guests",
      night: "night",
      nights: "nights",
      room: "room",
      rooms: "rooms",
      select: "Select",
      changeSelection: "Change selection",
      selectedForRoom: "Selected for Room {roomNumber} with {guests} guests",
      removed: "Removed {roomName}",
      liveNow: "Live now",
      bestChoice: "Best choice",
      discount: "Discount",
      gallery: "Gallery",
      more: "more",
      onKnownPlatforms: "On known platforms",
      bestPriceGuarantee: "Best price guarantee",
      scratchAndSee: "Scratch & see",
      noAvailabilityTitle: "No availability found",
      noAvailabilityText: "Contact us for alternative options.",
      noPerfectMatchTitle: "No perfect match was found with these filters",
      noPerfectMatchText:
        "There are available options if you loosen the filters a little.",
    },
    breakfast: {
      title: "Breakfast",
      titleWithName: "{name}, would you like to add breakfast?",
      withBreakfast: "With breakfast",
      withoutBreakfast: "Without breakfast",
      directPrice: "Direct price",
      breakfast: "Breakfast",
      total: "Total",
      notAdded: "Not added",
      person: "person",
      people: "people",
      day: "day",
      priceBadge: "€12 / person / day",
      reviewsTitle: "Booking.com reviews",
      continue: "Continue",
    },
    contact: {
      title: "Contact details",
      subtitle: "Fill in your details and send a ready-made message.",
      lastName: "Last name",
      email: "Email",
      mobile: "Mobile",
      phone: "Phone",
      whatsapp: "WhatsApp",
      messageGreeting: "Hello,",
      messageName: "My name is",
      messageIntro:
        "I would like to contact you directly about the following selection:",
      messageCheckin: "Check-in",
      messageCheckout: "Check-out",
      messageNights: "Nights",
      messageRooms: "Rooms",
      messageTotalGuests: "Total guests",
      messageRoomSelections: "Room selections",
      messageBreakfast: "Breakfast",
      messageDirectTotal: "Direct total",
      yes: "Yes",
      no: "No",
    },
    validation: {
      firstName: "Please enter your first name.",
      dates: "Please fill in check-in and check-out dates.",
      checkoutAfterCheckin: "Check-out must be after check-in.",
      minimumStay: "The stay must be at least 1 night.",
      guests: "Please choose guests for each room.",
      searchError: "Search error",
      genericSearchError: "Something went wrong during the search.",
    },
    toasts: {
      roomAdded: "Thank you - {roomName} was added",
      alreadySelected: "{roomName} is already selected",
      changeSelection: "You can now change your selection",
      breakfastYes: "Great choice - breakfast was added",
      breakfastNo: "Option without breakfast",
      back: "Let's review it again",
      reset: "Cleared",
      done: "Done",
    },
    roomLabels: baseRoomLabels,
  },

  el: {
    locale: "el",
    currencyLocale: "el-GR",
    topBenefits: {
      live: "Live",
      directContact: "Άμεση επικοινωνία",
      discount: "Έκπτωση",
      commissions: "Προμήθειες",
      total: "Σύνολο",
    },
    basics: {
      title: "Βρες το δωμάτιό σου",
      firstName: "Όνομα",
      firstNamePlaceholder: "π.χ. Νίκος",
      checkin: "Άφιξη",
      checkout: "Αναχώρηση",
      roomsCount: "Αριθμός δωματίων",
      guests: "Επισκέπτες",
      room: "Δωμάτιο",
      continue: "Συνέχεια",
    },
    filters: {
      title: "Ψάχνεις κάτι συγκεκριμένο;",
      titleWithName: "{name}, ψάχνεις κάτι συγκεκριμένο;",
      all: "Όλα",
      budget: "Οικονομικό",
      stairs: "Με σκάλες",
      upperFloor: "Πρώτος όροφος",
      ground: "Ισόγειο",
      gardenView: "Θέα στον κήπο",
      upperFloorView: "Θέα από επάνω όροφο",
      kitchen: "Κουζίνα / kitchenette",
      noKitchen: "Χωρίς κουζίνα",
      clear: "Καθαρισμός",
      search: "Αναζήτηση",
      checking: "Έλεγχος live διαθεσιμότητας...",
    },
    results: {
      title: "Οι επιλογές σου",
      titleWithName: "{name}, αυτές είναι οι επιλογές σου",
      selected: "επιλεγμένα",
      guest: "επισκέπτης",
      guests: "επισκέπτες",
      night: "νύχτα",
      nights: "νύχτες",
      room: "δωμάτιο",
      rooms: "δωμάτια",
      select: "Επιλογή",
      changeSelection: "Αλλαγή επιλογής",
      selectedForRoom: "Επιλέχθηκε για το Δωμάτιο {roomNumber} με {guests} επισκέπτες",
      removed: "Αφαιρέθηκε το {roomName}",
      liveNow: "Διαθέσιμο τώρα",
      bestChoice: "Καλύτερη επιλογή",
      discount: "Έκπτωση",
      gallery: "Gallery",
      more: "περισσότερα",
      onKnownPlatforms: "Σε γνωστές πλατφόρμες",
      bestPriceGuarantee: "Εγγύηση καλύτερης τιμής",
      scratchAndSee: "Ξύσε & δες",
      noAvailabilityTitle: "Δεν βρέθηκε διαθεσιμότητα",
      noAvailabilityText: "Επικοινώνησε μαζί μας για εναλλακτικές επιλογές.",
      noPerfectMatchTitle: "Δεν βρέθηκε ακριβής αντιστοιχία με αυτά τα φίλτρα",
      noPerfectMatchText: "Υπάρχουν διαθέσιμες επιλογές αν χαλαρώσεις λίγο τα φίλτρα.",
    },
    breakfast: {
      title: "Πρωινό",
      titleWithName: "{name}, θέλεις να προσθέσεις πρωινό;",
      withBreakfast: "Με πρωινό",
      withoutBreakfast: "Χωρίς πρωινό",
      directPrice: "Άμεση τιμή",
      breakfast: "Πρωινό",
      total: "Σύνολο",
      notAdded: "Δεν προστέθηκε",
      person: "άτομο",
      people: "άτομα",
      day: "ημέρα",
      priceBadge: "12€ / άτομο / ημέρα",
      reviewsTitle: "Κριτικές Booking.com",
      continue: "Συνέχεια",
    },
    contact: {
      title: "Στοιχεία επικοινωνίας",
      subtitle: "Συμπλήρωσε τα στοιχεία σου και στείλε έτοιμο μήνυμα.",
      lastName: "Επώνυμο",
      email: "Email",
      mobile: "Κινητό",
      phone: "Τηλέφωνο",
      whatsapp: "WhatsApp",
      messageGreeting: "Γεια σας,",
      messageName: "Το όνομά μου είναι",
      messageIntro: "Θα ήθελα να επικοινωνήσω απευθείας για την παρακάτω επιλογή:",
      messageCheckin: "Άφιξη",
      messageCheckout: "Αναχώρηση",
      messageNights: "Νύχτες",
      messageRooms: "Δωμάτια",
      messageTotalGuests: "Σύνολο επισκεπτών",
      messageRoomSelections: "Επιλογές δωματίων",
      messageBreakfast: "Πρωινό",
      messageDirectTotal: "Άμεσο σύνολο",
      yes: "Ναι",
      no: "Όχι",
    },
    validation: {
      firstName: "Γράψε το όνομά σου.",
      dates: "Συμπλήρωσε ημερομηνίες άφιξης και αναχώρησης.",
      checkoutAfterCheckin: "Η αναχώρηση πρέπει να είναι μετά την άφιξη.",
      minimumStay: "Η διαμονή πρέπει να είναι τουλάχιστον 1 νύχτα.",
      guests: "Διάλεξε αριθμό επισκεπτών για κάθε δωμάτιο.",
      searchError: "Σφάλμα αναζήτησης",
      genericSearchError: "Κάτι πήγε στραβά κατά την αναζήτηση.",
    },
    toasts: {
      roomAdded: "Ευχαριστούμε - προστέθηκε το {roomName}",
      alreadySelected: "Το {roomName} είναι ήδη επιλεγμένο",
      changeSelection: "Μπορείς τώρα να αλλάξεις την επιλογή σου",
      breakfastYes: "Πολύ καλή επιλογή - προστέθηκε πρωινό",
      breakfastNo: "Επιλογή χωρίς πρωινό",
      back: "Ας το δούμε ξανά",
      reset: "Καθαρίστηκε",
      done: "Έτοιμο",
    },
    roomLabels: {
      ...baseRoomLabels,
      room: "Δωμάτιο",
      apartment: "Διαμέρισμα",
      budgetDoubleRoom: "Οικονομικό δίκλινο δωμάτιο",
      firstFloorDoubleTriple: "Δίκλινο / τρίκλινο πρώτου ορόφου",
      groundFloorDoubleTriple: "Δίκλινο / τρίκλινο ισογείου",
      apartmentType: "Διαμέρισμα",
      gardenView: "Θέα στον κήπο",
      kitchen: "Κουζίνα",
      noStairs: "Χωρίς σκάλες",
      airConditioning: "Κλιματισμός",
      fridge: "Ψυγείο",
    },
  },

  fr: {
    locale: "fr",
    currencyLocale: "fr-FR",
    topBenefits: {
      live: "Live",
      directContact: "Contact direct",
      discount: "Réduction",
      commissions: "Commissions",
      total: "Total",
    },
    basics: {
      title: "Trouvez votre chambre",
      firstName: "Prénom",
      firstNamePlaceholder: "p. ex. Nicolas",
      checkin: "Arrivée",
      checkout: "Départ",
      roomsCount: "Nombre de chambres",
      guests: "Voyageurs",
      room: "Chambre",
      continue: "Continuer",
    },
    filters: {
      title: "Vous cherchez quelque chose de précis ?",
      titleWithName: "{name}, vous cherchez quelque chose de précis ?",
      all: "Tout",
      budget: "Économique",
      stairs: "Avec escaliers",
      upperFloor: "Premier étage",
      ground: "Rez-de-chaussée",
      gardenView: "Vue jardin",
      upperFloorView: "Vue depuis l’étage",
      kitchen: "Cuisine / kitchenette",
      noKitchen: "Sans cuisine",
      clear: "Effacer",
      search: "Rechercher",
      checking: "Vérification des disponibilités en direct...",
    },
    results: {
      title: "Vos options",
      titleWithName: "{name}, voici vos options",
      selected: "sélectionnée(s)",
      guest: "voyageur",
      guests: "voyageurs",
      night: "nuit",
      nights: "nuits",
      room: "chambre",
      rooms: "chambres",
      select: "Sélectionner",
      changeSelection: "Modifier la sélection",
      selectedForRoom: "Sélectionnée pour la chambre {roomNumber} avec {guests} voyageurs",
      removed: "{roomName} supprimée",
      liveNow: "Disponible maintenant",
      bestChoice: "Meilleur choix",
      discount: "Réduction",
      gallery: "Galerie",
      more: "plus",
      onKnownPlatforms: "Sur des plateformes connues",
      bestPriceGuarantee: "Garantie du meilleur prix",
      scratchAndSee: "Gratter et voir",
      noAvailabilityTitle: "Aucune disponibilité trouvée",
      noAvailabilityText: "Contactez-nous pour voir des options alternatives.",
      noPerfectMatchTitle: "Aucune correspondance exacte avec ces filtres",
      noPerfectMatchText: "Des options sont disponibles si vous assouplissez un peu les filtres.",
    },
    breakfast: {
      title: "Petit-déjeuner",
      titleWithName: "{name}, souhaitez-vous ajouter le petit-déjeuner ?",
      withBreakfast: "Avec petit-déjeuner",
      withoutBreakfast: "Sans petit-déjeuner",
      directPrice: "Prix direct",
      breakfast: "Petit-déjeuner",
      total: "Total",
      notAdded: "Non ajouté",
      person: "personne",
      people: "personnes",
      day: "jour",
      priceBadge: "12€ / personne / jour",
      reviewsTitle: "Avis Booking.com",
      continue: "Continuer",
    },
    contact: {
      title: "Coordonnées",
      subtitle: "Remplissez vos coordonnées et envoyez un message prêt.",
      lastName: "Nom",
      email: "Email",
      mobile: "Téléphone mobile",
      phone: "Téléphone",
      whatsapp: "WhatsApp",
      messageGreeting: "Bonjour,",
      messageName: "Je m’appelle",
      messageIntro: "Je souhaite vous contacter directement au sujet de la sélection suivante :",
      messageCheckin: "Arrivée",
      messageCheckout: "Départ",
      messageNights: "Nuits",
      messageRooms: "Chambres",
      messageTotalGuests: "Total voyageurs",
      messageRoomSelections: "Sélection de chambres",
      messageBreakfast: "Petit-déjeuner",
      messageDirectTotal: "Total direct",
      yes: "Oui",
      no: "Non",
    },
    validation: {
      firstName: "Veuillez saisir votre prénom.",
      dates: "Veuillez renseigner les dates d’arrivée et de départ.",
      checkoutAfterCheckin: "La date de départ doit être après la date d’arrivée.",
      minimumStay: "Le séjour doit être d’au moins 1 nuit.",
      guests: "Veuillez choisir les voyageurs pour chaque chambre.",
      searchError: "Erreur de recherche",
      genericSearchError: "Un problème est survenu pendant la recherche.",
    },
    toasts: {
      roomAdded: "Merci - {roomName} a été ajoutée",
      alreadySelected: "{roomName} est déjà sélectionnée",
      changeSelection: "Vous pouvez maintenant modifier votre sélection",
      breakfastYes: "Excellent choix - petit-déjeuner ajouté",
      breakfastNo: "Option sans petit-déjeuner",
      back: "Revoyons cela",
      reset: "Effacé",
      done: "Terminé",
    },
    roomLabels: {
      ...baseRoomLabels,
      room: "Chambre",
      apartment: "Appartement",
      gardenView: "Vue jardin",
    },
  },

  de: {} as FindYourRoomTranslations,
  it: {} as FindYourRoomTranslations,
  es: {} as FindYourRoomTranslations,
  tr: {} as FindYourRoomTranslations,
};

translations.de = {
  ...translations.en,
  locale: "de",
  currencyLocale: "de-DE",
  basics: {
    ...translations.en.basics,
    title: "Finde dein Zimmer",
    firstName: "Vorname",
    firstNamePlaceholder: "z. B. Nikos",
    roomsCount: "Anzahl der Zimmer",
    guests: "Gäste",
    continue: "Weiter",
  },
  filters: {
    ...translations.en.filters,
    title: "Suchst du etwas Bestimmtes?",
    titleWithName: "{name}, suchst du etwas Bestimmtes?",
    all: "Alle",
    budget: "Günstig",
    stairs: "Mit Treppen",
    upperFloor: "Erster Stock",
    ground: "Erdgeschoss",
    gardenView: "Gartenblick",
    upperFloorView: "Blick vom Obergeschoss",
    kitchen: "Küche / Kochnische",
    noKitchen: "Ohne Küche",
    clear: "Löschen",
    search: "Suchen",
    checking: "Live-Verfügbarkeit wird geprüft...",
  },
  results: {
    ...translations.en.results,
    title: "Deine Optionen",
    titleWithName: "{name}, hier sind deine Optionen",
    select: "Auswählen",
    changeSelection: "Auswahl ändern",
    liveNow: "Jetzt live",
    bestChoice: "Beste Wahl",
    discount: "Rabatt",
  },
  breakfast: {
    ...translations.en.breakfast,
    title: "Frühstück",
    titleWithName: "{name}, möchtest du Frühstück hinzufügen?",
    withBreakfast: "Mit Frühstück",
    withoutBreakfast: "Ohne Frühstück",
    directPrice: "Direktpreis",
    breakfast: "Frühstück",
    total: "Gesamt",
    priceBadge: "12€ / Person / Tag",
    continue: "Weiter",
  },
  contact: {
    ...translations.en.contact,
    title: "Kontaktdaten",
    subtitle: "Fülle deine Daten aus und sende eine fertige Nachricht.",
    lastName: "Nachname",
    mobile: "Mobiltelefon",
    phone: "Telefon",
    messageGreeting: "Hallo,",
    yes: "Ja",
    no: "Nein",
  },
  topBenefits: {
    live: "Live",
    directContact: "Direkter Kontakt",
    discount: "Rabatt",
    commissions: "Provisionen",
    total: "Gesamt",
  },
};

translations.it = {
  ...translations.en,
  locale: "it",
  currencyLocale: "it-IT",
  basics: {
    ...translations.en.basics,
    title: "Trova la tua camera",
    firstName: "Nome",
    firstNamePlaceholder: "es. Nico",
    roomsCount: "Numero di camere",
    guests: "Ospiti",
    continue: "Continua",
  },
  filters: {
    ...translations.en.filters,
    title: "Cerchi qualcosa in particolare?",
    titleWithName: "{name}, cerchi qualcosa in particolare?",
    all: "Tutto",
    budget: "Economica",
    stairs: "Con scale",
    upperFloor: "Primo piano",
    ground: "Piano terra",
    gardenView: "Vista giardino",
    upperFloorView: "Vista dal piano superiore",
    kitchen: "Cucina / angolo cottura",
    noKitchen: "Senza cucina",
    clear: "Cancella",
    search: "Cerca",
    checking: "Controllo disponibilità live...",
  },
  results: {
    ...translations.en.results,
    title: "Le tue opzioni",
    titleWithName: "{name}, ecco le tue opzioni",
    select: "Seleziona",
    changeSelection: "Cambia selezione",
    liveNow: "Live ora",
    bestChoice: "Scelta migliore",
    discount: "Sconto",
  },
  breakfast: {
    ...translations.en.breakfast,
    title: "Colazione",
    titleWithName: "{name}, vuoi aggiungere la colazione?",
    withBreakfast: "Con colazione",
    withoutBreakfast: "Senza colazione",
    directPrice: "Prezzo diretto",
    breakfast: "Colazione",
    total: "Totale",
    priceBadge: "12€ / persona / giorno",
    continue: "Continua",
  },
  contact: {
    ...translations.en.contact,
    title: "Dati di contatto",
    subtitle: "Inserisci i tuoi dati e invia un messaggio già pronto.",
    lastName: "Cognome",
    mobile: "Cellulare",
    phone: "Telefono",
    messageGreeting: "Ciao,",
    yes: "Sì",
    no: "No",
  },
  topBenefits: {
    live: "Live",
    directContact: "Contatto diretto",
    discount: "Sconto",
    commissions: "Commissioni",
    total: "Totale",
  },
};

translations.es = {
  ...translations.en,
  locale: "es",
  currencyLocale: "es-ES",
  basics: {
    ...translations.en.basics,
    title: "Encuentra tu habitación",
    firstName: "Nombre",
    firstNamePlaceholder: "p. ej. Carlos",
    checkin: "Llegada",
    checkout: "Salida",
    roomsCount: "Número de habitaciones",
    guests: "Huéspedes",
    room: "Habitación",
    continue: "Continuar",
  },
  filters: {
    ...translations.en.filters,
    title: "¿Buscas algo en concreto?",
    titleWithName: "{name}, ¿buscas algo en concreto?",
    all: "Todos",
    budget: "Económico",
    stairs: "Con escaleras",
    upperFloor: "Primera planta",
    ground: "Planta baja",
    gardenView: "Vista al jardín",
    upperFloorView: "Vista desde planta alta",
    kitchen: "Cocina / kitchenette",
    noKitchen: "Sin cocina",
    clear: "Borrar",
    search: "Buscar",
    checking: "Comprobando disponibilidad en vivo...",
  },
  results: {
    ...translations.en.results,
    title: "Tus opciones",
    titleWithName: "{name}, estas son tus opciones",
    select: "Seleccionar",
    changeSelection: "Cambiar selección",
    liveNow: "Disponible ahora",
    bestChoice: "Mejor opción",
    discount: "Descuento",
  },
  breakfast: {
    ...translations.en.breakfast,
    title: "Desayuno",
    titleWithName: "{name}, ¿quieres añadir desayuno?",
    withBreakfast: "Con desayuno",
    withoutBreakfast: "Sin desayuno",
    directPrice: "Precio directo",
    breakfast: "Desayuno",
    total: "Total",
    priceBadge: "12€ / persona / día",
    continue: "Continuar",
  },
  contact: {
    ...translations.en.contact,
    title: "Datos de contacto",
    subtitle: "Rellena tus datos y envía el mensaje preparado.",
    lastName: "Apellido",
    mobile: "Móvil",
    phone: "Teléfono",
    messageGreeting: "Hola,",
    yes: "Sí",
    no: "No",
  },
  topBenefits: {
    live: "Live",
    directContact: "Contacto directo",
    discount: "Descuento",
    commissions: "Comisiones",
    total: "Total",
  },
};

translations.tr = {
  ...translations.en,
  locale: "tr",
  currencyLocale: "tr-TR",
  basics: {
    ...translations.en.basics,
    title: "Odanı bul",
    firstName: "Ad",
    firstNamePlaceholder: "örn. Nikos",
    checkin: "Giriş",
    checkout: "Çıkış",
    roomsCount: "Oda sayısı",
    guests: "Misafirler",
    room: "Oda",
    continue: "Devam et",
  },
  filters: {
    ...translations.en.filters,
    title: "Daha özel bir şey mi arıyorsun?",
    titleWithName: "{name}, daha özel bir şey mi arıyorsun?",
    all: "Tümü",
    budget: "Ekonomik",
    stairs: "Merdivenli",
    upperFloor: "Birinci kat",
    ground: "Zemin kat",
    gardenView: "Bahçe manzarası",
    upperFloorView: "Üst kat manzarası",
    kitchen: "Mutfak / mini mutfak",
    noKitchen: "Mutfaksız",
    clear: "Temizle",
    search: "Ara",
    checking: "Canlı müsaitlik kontrol ediliyor...",
  },
  results: {
    ...translations.en.results,
    title: "Seçeneklerin",
    titleWithName: "{name}, işte seçeneklerin",
    select: "Seç",
    changeSelection: "Seçimi değiştir",
    liveNow: "Şu anda canlı",
    bestChoice: "En iyi seçenek",
    discount: "İndirim",
  },
  breakfast: {
    ...translations.en.breakfast,
    title: "Kahvaltı",
    titleWithName: "{name}, kahvaltı eklemek ister misin?",
    withBreakfast: "Kahvaltılı",
    withoutBreakfast: "Kahvaltısız",
    directPrice: "Doğrudan fiyat",
    breakfast: "Kahvaltı",
    total: "Toplam",
    priceBadge: "12€ / kişi / gün",
    continue: "Devam et",
  },
  contact: {
    ...translations.en.contact,
    title: "İletişim bilgileri",
    subtitle: "Bilgilerini doldur ve hazır mesajı gönder.",
    lastName: "Soyad",
    mobile: "Cep telefonu",
    phone: "Telefon",
    messageGreeting: "Merhaba,",
    yes: "Evet",
    no: "Hayır",
  },
  topBenefits: {
    live: "Canlı",
    directContact: "Hızlı iletişim",
    discount: "İndirim",
    commissions: "Komisyonlar",
    total: "Toplam",
  },
};

export const findYourRoomPages: Record<LanguageCode, FindYourRoomPageData> = {
  en: {
    language: "en",
    path: findYourRoomPaths.en,
    seo: {
      canonicalPath: findYourRoomPaths.en,
      title: "Book Direct in Chios | Voulamandis House",
      description:
        "Check live availability and book direct at Voulamandis House in Chios, with direct contact, discount and no commissions.",
      ogImage,
    },
    hero: {
      title: "Find your room",
      eyebrow: "Direct booking at Voulamandis House",
      description:
        "Check live availability, compare your direct price and send us your ready-made request by WhatsApp or phone.",
    },
    engine: translations.en,
  },
  el: {
    language: "el",
    path: findYourRoomPaths.el,
    seo: {
      canonicalPath: findYourRoomPaths.el,
      title: "Άμεση Κράτηση στη Χίο | Voulamandis House",
      description:
        "Δείτε live διαθεσιμότητα και κάντε απευθείας κράτηση στο Voulamandis House στη Χίο, χωρίς προμήθειες.",
      ogImage,
    },
    hero: {
      title: "Βρες το δωμάτιό σου",
      eyebrow: "Άμεση κράτηση στο Voulamandis House",
      description:
        "Δες live διαθεσιμότητα, σύγκρινε την άμεση τιμή σου και στείλε μας έτοιμο αίτημα μέσω WhatsApp ή τηλεφώνου.",
    },
    engine: translations.el,
  },
  fr: {
    language: "fr",
    path: findYourRoomPaths.fr,
    seo: {
      canonicalPath: findYourRoomPaths.fr,
      title: "Réservation directe à Chios | Voulamandis House",
      description:
        "Consultez les disponibilités en direct et réservez directement à Voulamandis House à Chios, sans commissions.",
      ogImage,
    },
    hero: {
      title: "Trouvez votre chambre",
      eyebrow: "Réservation directe à Voulamandis House",
      description:
        "Consultez les disponibilités en direct, comparez votre prix direct et envoyez votre demande prête par WhatsApp ou téléphone.",
    },
    engine: translations.fr,
  },
  de: {
    language: "de",
    path: findYourRoomPaths.de,
    seo: {
      canonicalPath: findYourRoomPaths.de,
      title: "Direkt buchen auf Chios | Voulamandis House",
      description:
        "Prüfen Sie Live-Verfügbarkeit und buchen Sie direkt im Voulamandis House auf Chios, ohne Provisionen.",
      ogImage,
    },
    hero: {
      title: "Finde dein Zimmer",
      eyebrow: "Direktbuchung im Voulamandis House",
      description:
        "Prüfe Live-Verfügbarkeit, vergleiche deinen Direktpreis und sende uns deine fertige Anfrage per WhatsApp oder Telefon.",
    },
    engine: translations.de,
  },
  it: {
    language: "it",
    path: findYourRoomPaths.it,
    seo: {
      canonicalPath: findYourRoomPaths.it,
      title: "Prenota diretto a Chios | Voulamandis House",
      description:
        "Controlla la disponibilità live e prenota direttamente al Voulamandis House a Chios, senza commissioni.",
      ogImage,
    },
    hero: {
      title: "Trova la tua camera",
      eyebrow: "Prenotazione diretta al Voulamandis House",
      description:
        "Controlla la disponibilità live, confronta il prezzo diretto e inviaci la tua richiesta pronta via WhatsApp o telefono.",
    },
    engine: translations.it,
  },
  es: {
    language: "es",
    path: findYourRoomPaths.es,
    seo: {
      canonicalPath: findYourRoomPaths.es,
      title: "Reserva directa en Quíos | Voulamandis House",
      description:
        "Consulta disponibilidad en vivo y reserva directamente en Voulamandis House en Quíos, sin comisiones.",
      ogImage,
    },
    hero: {
      title: "Encuentra tu habitación",
      eyebrow: "Reserva directa en Voulamandis House",
      description:
        "Consulta disponibilidad en vivo, compara tu precio directo y envíanos tu solicitud preparada por WhatsApp o teléfono.",
    },
    engine: translations.es,
  },
  tr: {
    language: "tr",
    path: findYourRoomPaths.tr,
    seo: {
      canonicalPath: findYourRoomPaths.tr,
      title: "Sakız Adası Direkt Rezervasyon | Voulamandis House",
      description:
        "Canlı müsaitliği kontrol edin ve Sakız Adası Voulamandis House’ta doğrudan, komisyonsuz rezervasyon yapın.",
      ogImage,
    },
    hero: {
      title: "Odanı bul",
      eyebrow: "Voulamandis House’ta doğrudan rezervasyon",
      description:
        "Canlı müsaitliği kontrol et, doğrudan fiyatını karşılaştır ve hazır talebini WhatsApp veya telefonla bize gönder.",
    },
    engine: translations.tr,
  },
};

export function getFindYourRoomPageByPath(
  path: string,
): FindYourRoomPageData | undefined {
  const normalizedPath = normalizePath(path);

  return Object.values(findYourRoomPages).find(
    (page) => normalizePath(page.path) === normalizedPath,
  );
}

export function getFindYourRoomPageByLanguage(
  language: LanguageCode,
): FindYourRoomPageData {
  return findYourRoomPages[language];
}

