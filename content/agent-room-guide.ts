import type { Metadata } from "next";
import type { LanguageCode } from "@/lib/languages";
import { siteUrl } from "@/lib/seo";

export const agentRoomGuidePaths: Record<LanguageCode, string> = {
  en: "/agents/rooms/",
  el: "/el/agents/rooms/",
  fr: "/fr/agents/rooms/",
  de: "/de/agents/rooms/",
  it: "/it/agents/rooms/",
  es: "/es/agents/rooms/",
  tr: "/tr/agents/rooms/",
};

export const agentLanguageNames: Record<LanguageCode, string> = {
  en: "English",
  el: "Ελληνικά",
  fr: "Français",
  de: "Deutsch",
  it: "Italiano",
  es: "Español",
  tr: "Türkçe",
};

const languageTags: Record<LanguageCode, string> = {
  en: "en",
  el: "el-GR",
  fr: "fr-FR",
  de: "de-DE",
  it: "it-IT",
  es: "es-ES",
  tr: "tr-TR",
};

const ogLocales: Record<LanguageCode, string> = {
  en: "en_US",
  el: "el_GR",
  fr: "fr_FR",
  de: "de_DE",
  it: "it_IT",
  es: "es_ES",
  tr: "tr_TR",
};

export type AgentRoomGuideCopy = {
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
  hero: {
    kicker: string;
    title: string;
    description: string;
    noPrices: string;
  };
  how: {
    title: string;
    steps: [string, string, string];
  };
  labels: {
    language: string;
    includedEveryRoom: string;
    includedEveryRoomText: string;
    roomsTitle: string;
    swipe: string;
    previousRoom: string;
    nextRoom: string;
    room: string;
    apartment: string;
    economy: string;
    upToGuests: string;
    standardMax: string;
    noStairs: string;
    stairsRequired: string;
    firstFloor: string;
    groundFloor: string;
    groundIndependent: string;
    beds: string;
    specificFeatures: string;
    standardAmenities: string;
    standardOnly: string;
    fullKitchen: string;
    kitchenette: string;
    privateBalcony: string;
    upperFloorView: string;
    gardenView: string;
    extraBedAvailable: string;
    allocation: string;
    selectRoom: string;
    roomSelected: string;
    guestsStaying: string;
    max: string;
    extraBedRequired: string;
    selectedRooms: string;
    totalGuests: string;
    copyAllocation: string;
    copied: string;
    sendEmail: string;
    sendWhatsApp: string;
    roomOneNote: string;
    roomTenNote: string;
    photo: string;
  };
  categories: {
    largeFamilyApartment: string;
    familyApartment: string;
    economyDouble: string;
    quadruple: string;
    groundTriple: string;
    firstTriple: string;
    guestRoom: string;
  };
  spaces: {
    one: string;
    twoOpen: string;
    twoSeparate: string;
  };
  beds: Record<string, [string, string]>;
  amenities: Record<string, string>;
  message: {
    title: string;
    emailSubject: string;
    totalGuests: string;
    footer: string;
  };
};

export const agentRoomGuideCopy: Record<LanguageCode, AgentRoomGuideCopy> = {
  en: {
    seo: {
      title: "Travel Agent Room Allocation Guide | Voulamandis House Chios",
      description: "B2B room guide for travel agents and tour operators working with Voulamandis House in Chios. Compare room layouts, beds, capacity, amenities and photos, allocate guests and send the room plan by email or WhatsApp.",
      keywords: ["Chios travel agent accommodation", "Chios B2B rooms", "Voulamandis House travel agents", "Chios group room allocation", "Chios tour operator accommodation"],
    },
    hero: {
      kicker: "Voulamandis House · B2B travel partners",
      title: "Room allocation guide for travel agents",
      description: "See the exact layout, bed configuration, capacity, floor, access, amenities and photos for every room. Select the rooms for your guests, enter the number of people in each room and send the allocation directly to us.",
      noPrices: "B2B room planning · no prices shown",
    },
    how: {
      title: "How to use this B2B guide",
      steps: ["Compare each room and its bed setup.", "Select the rooms and enter the guests in each one.", "Send the final room allocation by Email or WhatsApp."],
    },
    labels: {
      language: "Language",
      includedEveryRoom: "Included in every room",
      includedEveryRoomText: "These standard amenities apply to rooms 1–10.",
      roomsTitle: "Rooms 1–10",
      swipe: "Swipe to compare rooms",
      previousRoom: "Previous room",
      nextRoom: "Next room",
      room: "Room",
      apartment: "Apartment",
      economy: "Economy",
      upToGuests: "Up to {count} guests",
      standardMax: "{standard} standard · max {max}",
      noStairs: "No stairs",
      stairsRequired: "Stairs required",
      firstFloor: "First floor",
      groundFloor: "Ground floor",
      groundIndependent: "Ground-floor independent apartment",
      beds: "Beds",
      specificFeatures: "Room-specific features",
      standardAmenities: "Standard amenities in this room",
      standardOnly: "Standard room amenities only",
      fullKitchen: "Full kitchen",
      kitchenette: "Kitchenette",
      privateBalcony: "Private balcony",
      upperFloorView: "Upper-floor view",
      gardenView: "Garden view",
      extraBedAvailable: "Extra bed available for 5th guest",
      allocation: "Allocation",
      selectRoom: "Select room",
      roomSelected: "Room selected",
      guestsStaying: "Guests staying in this room",
      max: "Max",
      extraBedRequired: "Extra bed required for the 5th guest.",
      selectedRooms: "rooms selected",
      totalGuests: "guests",
      copyAllocation: "Copy",
      copied: "Copied",
      sendEmail: "Email",
      sendWhatsApp: "WhatsApp",
      roomOneNote: "Two single sofa beds are used for the 3rd and 4th guests.",
      roomTenNote: "Standard setup is for 4 guests. For 5 guests, an extra bed is added and the space is tighter.",
      photo: "photo",
    },
    categories: {
      largeFamilyApartment: "Large family apartment",
      familyApartment: "Family apartment",
      economyDouble: "Economy double room",
      quadruple: "Quadruple room",
      groundTriple: "Ground-floor triple room",
      firstTriple: "First-floor triple room",
      guestRoom: "Guest room",
    },
    spaces: {
      one: "1 room / sleeping area",
      twoOpen: "2 sleeping areas · open connection",
      twoSeparate: "2 separate living/sleeping areas",
    },
    beds: {
      double_bed: ["double bed", "double beds"],
      single_bed: ["single bed", "single beds"],
      sofa_bed: ["sofa bed", "sofa beds"],
      single_sofa_bed: ["single sofa bed", "single sofa beds"],
    },
    amenities: {
      mini_fridge: "Mini fridge",
      kettle: "Kettle",
      coffee: "Coffee",
      tea: "Tea",
      air_condition: "Air conditioning",
      free_wifi: "Free Wi-Fi",
      flat_screen_tv: "Flat-screen TV",
      private_bathroom: "Private bathroom",
      non_smoking: "Non-smoking",
    },
    message: {
      title: "Voulamandis House — B2B room allocation",
      emailSubject: "B2B room allocation — Voulamandis House",
      totalGuests: "Total guests",
      footer: "Please confirm this room allocation with Voulamandis House.",
    },
  },
  el: {
    seo: {
      title: "B2B Οδηγός Δωματίων για Τουριστικούς Πράκτορες | Voulamandis House",
      description: "B2B οδηγός δωματίων του Voulamandis House στη Χίο για τουριστικούς πράκτορες και γραφεία. Δείτε κρεβάτια, χωρητικότητα, διαρρύθμιση, παροχές και φωτογραφίες, μοιράστε τους επισκέπτες και στείλτε την κατανομή με email ή WhatsApp.",
      keywords: ["τουριστικοί πράκτορες Χίος διαμονή", "B2B δωμάτια Χίος", "κατανομή δωματίων γκρουπ Χίος", "Voulamandis House πράκτορες"],
    },
    hero: {
      kicker: "Voulamandis House · B2B συνεργάτες",
      title: "Οδηγός κατανομής δωματίων για τουριστικούς πράκτορες",
      description: "Δείτε την ακριβή διαρρύθμιση, τα κρεβάτια, τη χωρητικότητα, τον όροφο, την πρόσβαση, τις παροχές και τις φωτογραφίες κάθε δωματίου. Επιλέξτε τα δωμάτια, δηλώστε πόσα άτομα θα μείνουν σε καθένα και στείλτε μας απευθείας την κατανομή.",
      noPrices: "B2B κατανομή δωματίων · χωρίς τιμές",
    },
    how: {
      title: "Πώς χρησιμοποιείται ο B2B οδηγός",
      steps: ["Συγκρίνετε κάθε δωμάτιο και τη διάταξη των κρεβατιών.", "Επιλέξτε δωμάτια και δηλώστε τα άτομα σε καθένα.", "Στείλτε την τελική κατανομή με Email ή WhatsApp."],
    },
    labels: {
      language: "Γλώσσα",
      includedEveryRoom: "Περιλαμβάνονται σε όλα τα δωμάτια",
      includedEveryRoomText: "Οι παρακάτω βασικές παροχές ισχύουν για τα δωμάτια 1–10.",
      roomsTitle: "Δωμάτια 1–10",
      swipe: "Σύρετε για να δείτε τα δωμάτια",
      previousRoom: "Προηγούμενο δωμάτιο",
      nextRoom: "Επόμενο δωμάτιο",
      room: "Δωμάτιο",
      apartment: "Διαμέρισμα",
      economy: "Economy",
      upToGuests: "Έως {count} άτομα",
      standardMax: "{standard} κανονικά · έως {max}",
      noStairs: "Χωρίς σκάλες",
      stairsRequired: "Πρόσβαση με σκάλες",
      firstFloor: "1ος όροφος",
      groundFloor: "Ισόγειο",
      groundIndependent: "Ανεξάρτητο διαμέρισμα ισογείου",
      beds: "Κρεβάτια",
      specificFeatures: "Χαρακτηριστικά δωματίου",
      standardAmenities: "Βασικές παροχές του δωματίου",
      standardOnly: "Μόνο οι βασικές παροχές",
      fullKitchen: "Πλήρης κουζίνα",
      kitchenette: "Kitchenette",
      privateBalcony: "Ιδιωτικό μπαλκόνι",
      upperFloorView: "Θέα από επάνω όροφο",
      gardenView: "Θέα στον κήπο",
      extraBedAvailable: "Δυνατότητα extra bed για 5ο άτομο",
      allocation: "Κατανομή",
      selectRoom: "Επιλογή δωματίου",
      roomSelected: "Επιλεγμένο δωμάτιο",
      guestsStaying: "Άτομα που θα μείνουν στο δωμάτιο",
      max: "Max",
      extraBedRequired: "Απαιτείται extra bed για το 5ο άτομο.",
      selectedRooms: "δωμάτια επιλεγμένα",
      totalGuests: "άτομα",
      copyAllocation: "Αντιγραφή",
      copied: "Αντιγράφηκε",
      sendEmail: "Email",
      sendWhatsApp: "WhatsApp",
      roomOneNote: "Τα δύο μονά sofa beds χρησιμοποιούνται για το 3ο και 4ο άτομο.",
      roomTenNote: "Η κανονική διάταξη είναι για 4 άτομα. Για 5 άτομα προστίθεται extra bed και ο χώρος είναι πιο περιορισμένος.",
      photo: "φωτογραφία",
    },
    categories: {
      largeFamilyApartment: "Μεγάλο οικογενειακό διαμέρισμα",
      familyApartment: "Οικογενειακό διαμέρισμα",
      economyDouble: "Economy δίκλινο",
      quadruple: "Τετράκλινο δωμάτιο",
      groundTriple: "Τρίκλινο ισογείου",
      firstTriple: "Τρίκλινο 1ου ορόφου",
      guestRoom: "Δωμάτιο",
    },
    spaces: {
      one: "1 χώρος ύπνου",
      twoOpen: "2 χώροι ύπνου · ανοικτή σύνδεση",
      twoSeparate: "2 ξεχωριστοί χώροι διαμονής/ύπνου",
    },
    beds: {
      double_bed: ["διπλό κρεβάτι", "διπλά κρεβάτια"],
      single_bed: ["μονό κρεβάτι", "μονά κρεβάτια"],
      sofa_bed: ["sofa bed", "sofa beds"],
      single_sofa_bed: ["μονό sofa bed", "μονά sofa beds"],
    },
    amenities: {
      mini_fridge: "Μικρό ψυγείο",
      kettle: "Βραστήρας",
      coffee: "Καφές",
      tea: "Τσάι",
      air_condition: "Air condition",
      free_wifi: "Δωρεάν Wi-Fi",
      flat_screen_tv: "Flat-screen TV",
      private_bathroom: "Ιδιωτικό μπάνιο",
      non_smoking: "Μη καπνιζόντων",
    },
    message: {
      title: "Voulamandis House — B2B κατανομή δωματίων",
      emailSubject: "B2B κατανομή δωματίων — Voulamandis House",
      totalGuests: "Σύνολο ατόμων",
      footer: "Παρακαλώ επιβεβαιώστε την παραπάνω κατανομή δωματίων με το Voulamandis House.",
    },
  },
  fr: {
    seo: {
      title: "Guide B2B des chambres pour agences de voyage | Voulamandis House",
      description: "Guide B2B de Voulamandis House à Chios pour agences de voyage et tour-opérateurs. Comparez lits, capacité, disposition, équipements et photos, répartissez les voyageurs puis envoyez le plan par e-mail ou WhatsApp.",
      keywords: ["agence de voyage Chios hébergement", "B2B chambres Chios", "répartition chambres groupe Chios", "Voulamandis House agences"],
    },
    hero: {
      kicker: "Voulamandis House · partenaires B2B",
      title: "Guide d’attribution des chambres pour agences de voyage",
      description: "Consultez la disposition exacte, les lits, la capacité, l’étage, l’accès, les équipements et les photos de chaque chambre. Sélectionnez les chambres, indiquez le nombre de voyageurs dans chacune et envoyez-nous directement la répartition.",
      noPrices: "Planification B2B · aucun tarif affiché",
    },
    how: {
      title: "Comment utiliser ce guide B2B",
      steps: ["Comparez chaque chambre et sa configuration de lits.", "Sélectionnez les chambres et indiquez les voyageurs dans chacune.", "Envoyez la répartition finale par e-mail ou WhatsApp."],
    },
    labels: {
      language: "Langue",
      includedEveryRoom: "Inclus dans toutes les chambres",
      includedEveryRoomText: "Ces équipements standards s’appliquent aux chambres 1 à 10.",
      roomsTitle: "Chambres 1–10",
      swipe: "Faites glisser pour comparer",
      previousRoom: "Chambre précédente",
      nextRoom: "Chambre suivante",
      room: "Chambre",
      apartment: "Appartement",
      economy: "Économique",
      upToGuests: "Jusqu’à {count} personnes",
      standardMax: "{standard} standard · max {max}",
      noStairs: "Sans escaliers",
      stairsRequired: "Escaliers nécessaires",
      firstFloor: "Premier étage",
      groundFloor: "Rez-de-chaussée",
      groundIndependent: "Appartement indépendant au rez-de-chaussée",
      beds: "Lits",
      specificFeatures: "Caractéristiques de la chambre",
      standardAmenities: "Équipements standards de cette chambre",
      standardOnly: "Équipements standards uniquement",
      fullKitchen: "Cuisine complète",
      kitchenette: "Kitchenette",
      privateBalcony: "Balcon privé",
      upperFloorView: "Vue depuis l’étage",
      gardenView: "Vue sur le jardin",
      extraBedAvailable: "Lit supplémentaire possible pour la 5e personne",
      allocation: "Répartition",
      selectRoom: "Sélectionner",
      roomSelected: "Chambre sélectionnée",
      guestsStaying: "Voyageurs dans cette chambre",
      max: "Max",
      extraBedRequired: "Un lit supplémentaire est nécessaire pour la 5e personne.",
      selectedRooms: "chambres sélectionnées",
      totalGuests: "voyageurs",
      copyAllocation: "Copier",
      copied: "Copié",
      sendEmail: "E-mail",
      sendWhatsApp: "WhatsApp",
      roomOneNote: "Les deux canapés-lits simples sont utilisés pour les 3e et 4e personnes.",
      roomTenNote: "La configuration standard est prévue pour 4 personnes. Pour 5 personnes, un lit supplémentaire est ajouté et l’espace est plus réduit.",
      photo: "photo",
    },
    categories: {
      largeFamilyApartment: "Grand appartement familial",
      familyApartment: "Appartement familial",
      economyDouble: "Chambre double économique",
      quadruple: "Chambre quadruple",
      groundTriple: "Chambre triple au rez-de-chaussée",
      firstTriple: "Chambre triple au premier étage",
      guestRoom: "Chambre",
    },
    spaces: {
      one: "1 chambre / espace nuit",
      twoOpen: "2 espaces nuit · liaison ouverte",
      twoSeparate: "2 espaces de séjour/nuit séparés",
    },
    beds: {
      double_bed: ["lit double", "lits doubles"],
      single_bed: ["lit simple", "lits simples"],
      sofa_bed: ["canapé-lit", "canapés-lits"],
      single_sofa_bed: ["canapé-lit simple", "canapés-lits simples"],
    },
    amenities: {
      mini_fridge: "Mini-réfrigérateur",
      kettle: "Bouilloire",
      coffee: "Café",
      tea: "Thé",
      air_condition: "Climatisation",
      free_wifi: "Wi-Fi gratuit",
      flat_screen_tv: "Télévision écran plat",
      private_bathroom: "Salle de bains privée",
      non_smoking: "Non-fumeur",
    },
    message: {
      title: "Voulamandis House — répartition B2B des chambres",
      emailSubject: "Répartition B2B des chambres — Voulamandis House",
      totalGuests: "Total voyageurs",
      footer: "Merci de confirmer cette répartition des chambres avec Voulamandis House.",
    },
  },
  de: {
    seo: {
      title: "B2B Zimmerguide für Reisebüros | Voulamandis House Chios",
      description: "B2B Zimmerguide von Voulamandis House auf Chios für Reisebüros und Veranstalter. Betten, Belegung, Aufteilung, Ausstattung und Fotos vergleichen, Gäste Zimmern zuordnen und den Plan per E-Mail oder WhatsApp senden.",
      keywords: ["Reisebüro Chios Unterkunft", "B2B Zimmer Chios", "Zimmeraufteilung Gruppen Chios", "Voulamandis House Reisebüros"],
    },
    hero: {
      kicker: "Voulamandis House · B2B Reisepartner",
      title: "Zimmeraufteilung für Reisebüros und Veranstalter",
      description: "Sehen Sie für jedes Zimmer die genaue Aufteilung, Betten, Belegung, Etage, Zugang, Ausstattung und Fotos. Wählen Sie die Zimmer, tragen Sie die Gäste pro Zimmer ein und senden Sie uns die fertige Aufteilung direkt.",
      noPrices: "B2B Zimmerplanung · keine Preise",
    },
    how: {
      title: "So verwenden Sie den B2B Guide",
      steps: ["Vergleichen Sie jedes Zimmer und seine Bettenkonfiguration.", "Wählen Sie Zimmer und tragen Sie die Gäste pro Zimmer ein.", "Senden Sie die fertige Aufteilung per E-Mail oder WhatsApp."],
    },
    labels: {
      language: "Sprache",
      includedEveryRoom: "In jedem Zimmer enthalten",
      includedEveryRoomText: "Diese Standardausstattung gilt für die Zimmer 1–10.",
      roomsTitle: "Zimmer 1–10",
      swipe: "Wischen, um Zimmer zu vergleichen",
      previousRoom: "Vorheriges Zimmer",
      nextRoom: "Nächstes Zimmer",
      room: "Zimmer",
      apartment: "Apartment",
      economy: "Economy",
      upToGuests: "Bis zu {count} Gäste",
      standardMax: "{standard} standard · max. {max}",
      noStairs: "Keine Treppen",
      stairsRequired: "Treppen erforderlich",
      firstFloor: "1. Stock",
      groundFloor: "Erdgeschoss",
      groundIndependent: "Eigenständiges Apartment im Erdgeschoss",
      beds: "Betten",
      specificFeatures: "Zimmerspezifische Merkmale",
      standardAmenities: "Standardausstattung dieses Zimmers",
      standardOnly: "Nur Standardausstattung",
      fullKitchen: "Voll ausgestattete Küche",
      kitchenette: "Kitchenette",
      privateBalcony: "Privater Balkon",
      upperFloorView: "Aussicht vom Obergeschoss",
      gardenView: "Gartenblick",
      extraBedAvailable: "Zusatzbett für 5. Gast möglich",
      allocation: "Aufteilung",
      selectRoom: "Zimmer wählen",
      roomSelected: "Zimmer ausgewählt",
      guestsStaying: "Gäste in diesem Zimmer",
      max: "Max",
      extraBedRequired: "Für den 5. Gast ist ein Zusatzbett erforderlich.",
      selectedRooms: "Zimmer ausgewählt",
      totalGuests: "Gäste",
      copyAllocation: "Kopieren",
      copied: "Kopiert",
      sendEmail: "E-Mail",
      sendWhatsApp: "WhatsApp",
      roomOneNote: "Die zwei Einzel-Schlafsofas werden für den 3. und 4. Gast genutzt.",
      roomTenNote: "Die Standardbelegung ist für 4 Gäste. Für 5 Gäste wird ein Zusatzbett aufgestellt; dadurch wird der Raum enger.",
      photo: "Foto",
    },
    categories: {
      largeFamilyApartment: "Großes Familienapartment",
      familyApartment: "Familienapartment",
      economyDouble: "Economy Doppelzimmer",
      quadruple: "Vierbettzimmer",
      groundTriple: "Dreibettzimmer im Erdgeschoss",
      firstTriple: "Dreibettzimmer im 1. Stock",
      guestRoom: "Gästezimmer",
    },
    spaces: {
      one: "1 Zimmer / Schlafbereich",
      twoOpen: "2 Schlafbereiche · offene Verbindung",
      twoSeparate: "2 getrennte Wohn-/Schlafbereiche",
    },
    beds: {
      double_bed: ["Doppelbett", "Doppelbetten"],
      single_bed: ["Einzelbett", "Einzelbetten"],
      sofa_bed: ["Schlafsofa", "Schlafsofas"],
      single_sofa_bed: ["Einzel-Schlafsofa", "Einzel-Schlafsofas"],
    },
    amenities: {
      mini_fridge: "Mini-Kühlschrank",
      kettle: "Wasserkocher",
      coffee: "Kaffee",
      tea: "Tee",
      air_condition: "Klimaanlage",
      free_wifi: "Kostenloses WLAN",
      flat_screen_tv: "Flachbild-TV",
      private_bathroom: "Privates Bad",
      non_smoking: "Nichtraucher",
    },
    message: {
      title: "Voulamandis House — B2B Zimmeraufteilung",
      emailSubject: "B2B Zimmeraufteilung — Voulamandis House",
      totalGuests: "Gäste gesamt",
      footer: "Bitte bestätigen Sie diese Zimmeraufteilung mit Voulamandis House.",
    },
  },
  it: {
    seo: {
      title: "Guida B2B camere per agenzie di viaggio | Voulamandis House",
      description: "Guida B2B di Voulamandis House a Chios per agenzie di viaggio e tour operator. Confronta letti, capienza, disposizione, servizi e foto, assegna gli ospiti alle camere e invia il piano via e-mail o WhatsApp.",
      keywords: ["agenzie viaggio Chios alloggio", "B2B camere Chios", "assegnazione camere gruppi Chios", "Voulamandis House agenzie"],
    },
    hero: {
      kicker: "Voulamandis House · partner B2B",
      title: "Guida all’assegnazione camere per agenzie di viaggio",
      description: "Consulta disposizione, letti, capienza, piano, accesso, servizi e foto di ogni camera. Seleziona le camere, inserisci il numero di ospiti in ciascuna e inviaci direttamente l’assegnazione finale.",
      noPrices: "Pianificazione B2B · nessun prezzo mostrato",
    },
    how: {
      title: "Come usare questa guida B2B",
      steps: ["Confronta ogni camera e la configurazione dei letti.", "Seleziona le camere e inserisci gli ospiti in ciascuna.", "Invia l’assegnazione finale via e-mail o WhatsApp."],
    },
    labels: {
      language: "Lingua",
      includedEveryRoom: "Incluso in ogni camera",
      includedEveryRoomText: "Questi servizi standard sono presenti nelle camere 1–10.",
      roomsTitle: "Camere 1–10",
      swipe: "Scorri per confrontare le camere",
      previousRoom: "Camera precedente",
      nextRoom: "Camera successiva",
      room: "Camera",
      apartment: "Appartamento",
      economy: "Economy",
      upToGuests: "Fino a {count} ospiti",
      standardMax: "{standard} standard · max {max}",
      noStairs: "Senza scale",
      stairsRequired: "Scale necessarie",
      firstFloor: "Primo piano",
      groundFloor: "Piano terra",
      groundIndependent: "Appartamento indipendente al piano terra",
      beds: "Letti",
      specificFeatures: "Caratteristiche della camera",
      standardAmenities: "Servizi standard in questa camera",
      standardOnly: "Solo servizi standard",
      fullKitchen: "Cucina completa",
      kitchenette: "Angolo cottura",
      privateBalcony: "Balcone privato",
      upperFloorView: "Vista dal piano superiore",
      gardenView: "Vista giardino",
      extraBedAvailable: "Letto extra disponibile per il 5° ospite",
      allocation: "Assegnazione",
      selectRoom: "Seleziona camera",
      roomSelected: "Camera selezionata",
      guestsStaying: "Ospiti in questa camera",
      max: "Max",
      extraBedRequired: "È necessario un letto extra per il 5° ospite.",
      selectedRooms: "camere selezionate",
      totalGuests: "ospiti",
      copyAllocation: "Copia",
      copied: "Copiato",
      sendEmail: "E-mail",
      sendWhatsApp: "WhatsApp",
      roomOneNote: "I due divani letto singoli sono utilizzati per il 3° e 4° ospite.",
      roomTenNote: "La configurazione standard è per 4 ospiti. Per 5 ospiti viene aggiunto un letto extra e lo spazio risulta più ridotto.",
      photo: "foto",
    },
    categories: {
      largeFamilyApartment: "Grande appartamento familiare",
      familyApartment: "Appartamento familiare",
      economyDouble: "Camera doppia Economy",
      quadruple: "Camera quadrupla",
      groundTriple: "Camera tripla al piano terra",
      firstTriple: "Camera tripla al primo piano",
      guestRoom: "Camera",
    },
    spaces: {
      one: "1 camera / zona notte",
      twoOpen: "2 zone notte · collegamento aperto",
      twoSeparate: "2 zone soggiorno/notte separate",
    },
    beds: {
      double_bed: ["letto matrimoniale", "letti matrimoniali"],
      single_bed: ["letto singolo", "letti singoli"],
      sofa_bed: ["divano letto", "divani letto"],
      single_sofa_bed: ["divano letto singolo", "divani letto singoli"],
    },
    amenities: {
      mini_fridge: "Mini frigorifero",
      kettle: "Bollitore",
      coffee: "Caffè",
      tea: "Tè",
      air_condition: "Aria condizionata",
      free_wifi: "Wi-Fi gratuito",
      flat_screen_tv: "TV a schermo piatto",
      private_bathroom: "Bagno privato",
      non_smoking: "Non fumatori",
    },
    message: {
      title: "Voulamandis House — assegnazione camere B2B",
      emailSubject: "Assegnazione camere B2B — Voulamandis House",
      totalGuests: "Ospiti totali",
      footer: "Si prega di confermare questa assegnazione camere con Voulamandis House.",
    },
  },
  es: {
    seo: {
      title: "Guía B2B de habitaciones para agencias de viaje | Voulamandis House",
      description: "Guía B2B de Voulamandis House en Quíos para agencias de viaje y turoperadores. Compara camas, capacidad, distribución, servicios y fotos, asigna huéspedes y envía el plan por correo electrónico o WhatsApp.",
      keywords: ["agencias de viaje Quíos alojamiento", "B2B habitaciones Quíos", "distribución habitaciones grupos Quíos", "Voulamandis House agencias"],
    },
    hero: {
      kicker: "Voulamandis House · socios B2B",
      title: "Guía de asignación de habitaciones para agencias de viaje",
      description: "Consulta la distribución exacta, las camas, la capacidad, la planta, el acceso, los servicios y las fotos de cada habitación. Selecciona las habitaciones, indica cuántos huéspedes ocuparán cada una y envíanos directamente la asignación.",
      noPrices: "Planificación B2B · sin precios",
    },
    how: {
      title: "Cómo usar esta guía B2B",
      steps: ["Compara cada habitación y su configuración de camas.", "Selecciona habitaciones e indica los huéspedes en cada una.", "Envía la asignación final por correo electrónico o WhatsApp."],
    },
    labels: {
      language: "Idioma",
      includedEveryRoom: "Incluido en todas las habitaciones",
      includedEveryRoomText: "Estos servicios estándar se aplican a las habitaciones 1–10.",
      roomsTitle: "Habitaciones 1–10",
      swipe: "Desliza para comparar habitaciones",
      previousRoom: "Habitación anterior",
      nextRoom: "Habitación siguiente",
      room: "Habitación",
      apartment: "Apartamento",
      economy: "Economy",
      upToGuests: "Hasta {count} huéspedes",
      standardMax: "{standard} estándar · máx. {max}",
      noStairs: "Sin escaleras",
      stairsRequired: "Acceso por escaleras",
      firstFloor: "Primera planta",
      groundFloor: "Planta baja",
      groundIndependent: "Apartamento independiente en planta baja",
      beds: "Camas",
      specificFeatures: "Características de la habitación",
      standardAmenities: "Servicios estándar de esta habitación",
      standardOnly: "Solo servicios estándar",
      fullKitchen: "Cocina completa",
      kitchenette: "Cocina pequeña",
      privateBalcony: "Balcón privado",
      upperFloorView: "Vista desde planta superior",
      gardenView: "Vista al jardín",
      extraBedAvailable: "Cama extra disponible para el 5.º huésped",
      allocation: "Asignación",
      selectRoom: "Seleccionar habitación",
      roomSelected: "Habitación seleccionada",
      guestsStaying: "Huéspedes en esta habitación",
      max: "Máx.",
      extraBedRequired: "Se necesita una cama extra para el 5.º huésped.",
      selectedRooms: "habitaciones seleccionadas",
      totalGuests: "huéspedes",
      copyAllocation: "Copiar",
      copied: "Copiado",
      sendEmail: "Correo",
      sendWhatsApp: "WhatsApp",
      roomOneNote: "Los dos sofás cama individuales se utilizan para el 3.º y 4.º huésped.",
      roomTenNote: "La configuración estándar es para 4 huéspedes. Para 5 se añade una cama extra y el espacio queda más ajustado.",
      photo: "foto",
    },
    categories: {
      largeFamilyApartment: "Apartamento familiar grande",
      familyApartment: "Apartamento familiar",
      economyDouble: "Habitación doble Economy",
      quadruple: "Habitación cuádruple",
      groundTriple: "Habitación triple en planta baja",
      firstTriple: "Habitación triple en primera planta",
      guestRoom: "Habitación",
    },
    spaces: {
      one: "1 habitación / zona de descanso",
      twoOpen: "2 zonas de descanso · conexión abierta",
      twoSeparate: "2 zonas separadas de estar/dormir",
    },
    beds: {
      double_bed: ["cama doble", "camas dobles"],
      single_bed: ["cama individual", "camas individuales"],
      sofa_bed: ["sofá cama", "sofás cama"],
      single_sofa_bed: ["sofá cama individual", "sofás cama individuales"],
    },
    amenities: {
      mini_fridge: "Mini nevera",
      kettle: "Hervidor",
      coffee: "Café",
      tea: "Té",
      air_condition: "Aire acondicionado",
      free_wifi: "Wi-Fi gratis",
      flat_screen_tv: "TV de pantalla plana",
      private_bathroom: "Baño privado",
      non_smoking: "No fumadores",
    },
    message: {
      title: "Voulamandis House — asignación B2B de habitaciones",
      emailSubject: "Asignación B2B de habitaciones — Voulamandis House",
      totalGuests: "Total de huéspedes",
      footer: "Por favor, confirma esta asignación de habitaciones con Voulamandis House.",
    },
  },
  tr: {
    seo: {
      title: "Seyahat Acenteleri için B2B Oda Rehberi | Voulamandis House Sakız",
      description: "Sakız Adası Voulamandis House için seyahat acenteleri ve tur operatörlerine özel B2B oda rehberi. Yatak, kapasite, oda planı, olanak ve fotoğrafları karşılaştırın; misafirleri odalara dağıtıp planı e-posta veya WhatsApp ile gönderin.",
      keywords: ["Sakız Adası seyahat acentesi konaklama", "Sakız B2B oda", "grup oda dağılımı Sakız", "Voulamandis House acente"],
    },
    hero: {
      kicker: "Voulamandis House · B2B seyahat ortakları",
      title: "Seyahat acenteleri için oda dağılım rehberi",
      description: "Her odanın gerçek yerleşimini, yatak tiplerini, kapasitesini, katını, erişimini, olanaklarını ve fotoğraflarını inceleyin. Odaları seçin, her odada kalacak kişi sayısını girin ve son dağılımı doğrudan bize gönderin.",
      noPrices: "B2B oda planlama · fiyat gösterilmez",
    },
    how: {
      title: "B2B rehberi nasıl kullanılır",
      steps: ["Her odayı ve yatak düzenini karşılaştırın.", "Odaları seçin ve her odadaki misafir sayısını girin.", "Son oda dağılımını e-posta veya WhatsApp ile gönderin."],
    },
    labels: {
      language: "Dil",
      includedEveryRoom: "Tüm odalarda mevcut",
      includedEveryRoomText: "Bu standart olanaklar 1–10 numaralı odaların tamamında bulunur.",
      roomsTitle: "Odalar 1–10",
      swipe: "Odaları karşılaştırmak için kaydırın",
      previousRoom: "Önceki oda",
      nextRoom: "Sonraki oda",
      room: "Oda",
      apartment: "Daire",
      economy: "Ekonomik",
      upToGuests: "En fazla {count} kişi",
      standardMax: "{standard} standart · en fazla {max}",
      noStairs: "Merdiven yok",
      stairsRequired: "Merdiven kullanımı gerekli",
      firstFloor: "1. kat",
      groundFloor: "Zemin kat",
      groundIndependent: "Bağımsız zemin kat dairesi",
      beds: "Yataklar",
      specificFeatures: "Odaya özel özellikler",
      standardAmenities: "Bu odadaki standart olanaklar",
      standardOnly: "Yalnızca standart oda olanakları",
      fullKitchen: "Tam mutfak",
      kitchenette: "Mini mutfak",
      privateBalcony: "Özel balkon",
      upperFloorView: "Üst kat manzarası",
      gardenView: "Bahçe manzarası",
      extraBedAvailable: "5. kişi için ek yatak mümkün",
      allocation: "Oda dağılımı",
      selectRoom: "Odayı seç",
      roomSelected: "Oda seçildi",
      guestsStaying: "Bu odada kalacak kişi sayısı",
      max: "Maks.",
      extraBedRequired: "5. kişi için ek yatak gereklidir.",
      selectedRooms: "oda seçildi",
      totalGuests: "kişi",
      copyAllocation: "Kopyala",
      copied: "Kopyalandı",
      sendEmail: "E-posta",
      sendWhatsApp: "WhatsApp",
      roomOneNote: "İki tek kişilik çekyat 3. ve 4. misafir için kullanılır.",
      roomTenNote: "Standart yerleşim 4 kişiliktir. 5 kişi için ek yatak eklenir ve alan daha sıkışık olur.",
      photo: "fotoğraf",
    },
    categories: {
      largeFamilyApartment: "Büyük aile dairesi",
      familyApartment: "Aile dairesi",
      economyDouble: "Ekonomik çift kişilik oda",
      quadruple: "Dört kişilik oda",
      groundTriple: "Zemin kat üç kişilik oda",
      firstTriple: "1. kat üç kişilik oda",
      guestRoom: "Oda",
    },
    spaces: {
      one: "1 oda / uyku alanı",
      twoOpen: "2 uyku alanı · açık bağlantı",
      twoSeparate: "2 ayrı yaşam/uyku alanı",
    },
    beds: {
      double_bed: ["çift kişilik yatak", "çift kişilik yatak"],
      single_bed: ["tek kişilik yatak", "tek kişilik yatak"],
      sofa_bed: ["çekyat", "çekyat"],
      single_sofa_bed: ["tek kişilik çekyat", "tek kişilik çekyat"],
    },
    amenities: {
      mini_fridge: "Mini buzdolabı",
      kettle: "Su ısıtıcısı",
      coffee: "Kahve",
      tea: "Çay",
      air_condition: "Klima",
      free_wifi: "Ücretsiz Wi-Fi",
      flat_screen_tv: "Düz ekran TV",
      private_bathroom: "Özel banyo",
      non_smoking: "Sigara içilmez",
    },
    message: {
      title: "Voulamandis House — B2B oda dağılımı",
      emailSubject: "B2B oda dağılımı — Voulamandis House",
      totalGuests: "Toplam kişi",
      footer: "Lütfen bu oda dağılımını Voulamandis House ile teyit edin.",
    },
  },
};

function absolute(path: string) {
  return new URL(path, siteUrl).toString();
}

export function buildAgentRoomGuideMetadata(language: LanguageCode): Metadata {
  const copy = agentRoomGuideCopy[language];
  const canonicalPath = agentRoomGuidePaths[language];
  const alternateLocales = (Object.keys(agentRoomGuidePaths) as LanguageCode[])
    .filter((code) => code !== language)
    .map((code) => ogLocales[code]);

  return {
    title: { absolute: copy.seo.title },
    description: copy.seo.description,
    keywords: copy.seo.keywords,
    alternates: {
      canonical: absolute(canonicalPath),
      languages: {
        "x-default": absolute(agentRoomGuidePaths.en),
        en: absolute(agentRoomGuidePaths.en),
        "el-GR": absolute(agentRoomGuidePaths.el),
        "fr-FR": absolute(agentRoomGuidePaths.fr),
        "de-DE": absolute(agentRoomGuidePaths.de),
        "it-IT": absolute(agentRoomGuidePaths.it),
        "es-ES": absolute(agentRoomGuidePaths.es),
        "tr-TR": absolute(agentRoomGuidePaths.tr),
      },
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      type: "website",
      url: absolute(canonicalPath),
      title: copy.seo.title,
      description: copy.seo.description,
      siteName: "Voulamandis House",
      locale: ogLocales[language],
      alternateLocale: alternateLocales,
      images: [
        {
          url: absolute("/images/rooms/DSC07776-2-e1675109942622.webp"),
          width: 1200,
          height: 900,
          alt: copy.hero.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: copy.seo.title,
      description: copy.seo.description,
      images: [absolute("/images/rooms/DSC07776-2-e1675109942622.webp")],
    },
  };
}

export function getAgentLanguageTag(language: LanguageCode) {
  return languageTags[language];
}
