"use client";

import { useMemo, useState, type FormEvent } from "react";
import type { RoomWizardRoom } from "@/content/rooms";

type WizardLanguage = "en" | "el" | "fr" | "de" | "it" | "es" | "tr";

type RoomWizardProps = {
  rooms: RoomWizardRoom[];
  whatsappPhone: string;
  language?: WizardLanguage;
};

type LeadData = {
  firstName: string;
  lastName: string;
  checkin: string;
  checkout: string;
  email: string;
  phone: string;
};

type WizardPrefs = {
  guests?: number;
  budget?: boolean;
  noStairs?: boolean;
  upperView?: boolean;
  gardenView?: boolean;
  kitchen?: boolean;
};

type QuestionId = "guests" | "budget" | "stairs" | "view" | "kitchen";

type QuestionOption = {
  title: string;
  hint: string;
  icon: string;
  tag?: string;
  tagClass?: "tag-up" | "tag-down";
  apply: (prefs: WizardPrefs) => WizardPrefs;
};

type Question = {
  id: QuestionId;
  question: string;
  options: QuestionOption[];
};

const wizardLabels = {
  en: {
    roomFinder: "Room Finder",
    step: "Step",
    introTitle: "Let’s begin!",
    introText:
      "Answer 5 quick questions and we’ll suggest the best room or apartment for your stay in Chios.",
    firstName: "First name",
    lastName: "Last name",
    checkin: "Check-in",
    checkout: "Check-out",
    email: "Email",
    phone: "Phone",
    gdpr:
      "I consent to the processing of my personal data for the purpose of receiving accommodation suggestions.",
    start: "Start",
    back: "Back",
    bestMatch: "Best Match",
    sendByEmail: "Send by Email",
    alternativeOptions: "Alternative Options",
    startOver: "Start over",
    checkoutAlert: "Check-out must be after check-in.",
    whyItFits: "WHY IT FITS:",
    perfectMatch: "Matches 100% of your criteria!",
    offersMissing: "WHAT IT OFFERS / WHAT’S MISSING:",
    samePrice: "Same price category",
    moreExpensive: "More expensive than the best match",
    cheaper: "Cheaper than the best match",
    bedTypes: "Bed types",
    double: "Double",
    single: "Single",
    sofaBed: "Sofa bed",
    galleryThumbnails: "Gallery thumbnails",
    photo: "photo",
    whatsappGreeting: "Hello! My name is",
    whatsappBook: "and I would like to book.",
    room: "Room",
    guests: "Guests",
    emailSubject: "Inquiry",
    questions: {
      guests: "How many guests?",
      budget: "Which price level do you prefer?",
      stairs: "Access & stairs?",
      view: "Preferred view?",
      kitchen: "Do you need a kitchen?",
    },
    options: {
      couple: ["Couple (2 Guests)", "Ideal for 2 adults"],
      three: ["3 Guests", "Family or friends"],
      four: ["4 Guests", "Maximum comfort"],
      economy: ["Economy", "More budget-friendly", "↓ Budget option"],
      premium: ["Standard / Premium", "Regular pricing", "↑ Regular cost"],
      noStairs: ["No stairs", "Ground floor or stand-alone apartment", "↓ Often cheaper"],
      stairsOk: ["Stairs are OK", "Includes first-floor options", "↑ More options"],
      upperView: ["Upper view", "More premium feel", "↑ Premium vibe"],
      gardenView: ["Garden view", "Peaceful atmosphere", "↓ Often cheaper"],
      anyView: ["Any view", "Not a priority"],
      fullKitchen: ["Yes, full kitchen", "For maximum independence", "↑ Higher cost"],
      noKitchen: ["No, not needed", "More budget-friendly", "↓ Cheaper"],
    },
    matches: {
      comfortablyFits: "Comfortably fits",
      doesNotFit: "Does not fit",
      guests: "guests",
      budgetFriendly: "Budget-friendly economy option",
      notEconomy: "Not an economy room",
      premiumCategory: "Standard / premium room category",
      economyWhilePremium: "Economy room, while you selected standard / premium",
      easyNoStairs: "Easy access without stairs",
      hasStairs: "Has stairs",
      firstFloorOk: "First floor is OK",
      groundFloorAccess: "Easy ground-floor access",
      upperView: "Upper view",
      noUpperView: "No upper view",
      gardenView: "Garden view",
      noGardenView: "No garden view",
      fullKitchen: "Full kitchen",
      kitchenette: "Kitchenette",
      noKitchen: "No kitchen facilities",
      fits: "Fits",
      economy: "Economy",
      standardPremium: "Standard/Premium",
      noStairs: "No stairs",
      kitchenFacilities: "Kitchen facilities",
    },
  },

  el: {
    roomFinder: "Βρες δωμάτιο",
    step: "Βήμα",
    introTitle: "Ας ξεκινήσουμε!",
    introText:
      "Απάντησε σε 5 γρήγορες ερωτήσεις και θα σου προτείνουμε το καλύτερο δωμάτιο ή διαμέρισμα για τη διαμονή σου στη Χίο.",
    firstName: "Όνομα",
    lastName: "Επώνυμο",
    checkin: "Άφιξη",
    checkout: "Αναχώρηση",
    email: "Email",
    phone: "Τηλέφωνο",
    gdpr:
      "Συναινώ στην επεξεργασία των προσωπικών μου δεδομένων για να λάβω προτάσεις διαμονής.",
    start: "Έναρξη",
    back: "Πίσω",
    bestMatch: "Καλύτερη επιλογή",
    sendByEmail: "Αποστολή με email",
    alternativeOptions: "Εναλλακτικές επιλογές",
    startOver: "Ξεκίνα ξανά",
    checkoutAlert: "Η αναχώρηση πρέπει να είναι μετά την άφιξη.",
    whyItFits: "ΓΙΑΤΙ ΤΑΙΡΙΑΖΕΙ:",
    perfectMatch: "Ταιριάζει 100% στα κριτήριά σου!",
    offersMissing: "ΤΙ ΠΡΟΣΦΕΡΕΙ / ΤΙ ΛΕΙΠΕΙ:",
    samePrice: "Ίδια κατηγορία τιμής",
    moreExpensive: "Πιο ακριβό από την καλύτερη επιλογή",
    cheaper: "Πιο οικονομικό από την καλύτερη επιλογή",
    bedTypes: "Τύποι κρεβατιών",
    double: "Διπλό",
    single: "Μονό",
    sofaBed: "Καναπές-κρεβάτι",
    galleryThumbnails: "Μικρογραφίες gallery",
    photo: "φωτογραφία",
    whatsappGreeting: "Γεια σας! Ονομάζομαι",
    whatsappBook: "και θα ήθελα να κάνω κράτηση.",
    room: "Δωμάτιο",
    guests: "Άτομα",
    emailSubject: "Ερώτηση",
    questions: {
      guests: "Πόσα άτομα είστε;",
      budget: "Ποια κατηγορία τιμής προτιμάς;",
      stairs: "Πρόσβαση και σκάλες;",
      view: "Τι θέα προτιμάς;",
      kitchen: "Χρειάζεσαι κουζίνα;",
    },
    options: {
      couple: ["Ζευγάρι (2 άτομα)", "Ιδανικό για 2 ενήλικες"],
      three: ["3 άτομα", "Οικογένεια ή φίλοι"],
      four: ["4 άτομα", "Μέγιστη άνεση"],
      economy: ["Οικονομικό", "Πιο οικονομική επιλογή", "↓ Budget επιλογή"],
      premium: ["Standard / Premium", "Κανονική τιμή", "↑ Περισσότερη άνεση"],
      noStairs: ["Χωρίς σκάλες", "Ισόγειο ή αυτόνομο διαμέρισμα", "↓ Πιο εύκολη πρόσβαση"],
      stairsOk: ["Οι σκάλες είναι ΟΚ", "Περιλαμβάνει επιλογές ορόφου", "↑ Περισσότερες επιλογές"],
      upperView: ["Θέα από ψηλά", "Πιο premium αίσθηση", "↑ Premium αίσθηση"],
      gardenView: ["Θέα στον κήπο", "Ήρεμη ατμόσφαιρα", "↓ Πιο χαλαρή επιλογή"],
      anyView: ["Δεν με νοιάζει", "Δεν είναι προτεραιότητα"],
      fullKitchen: ["Ναι, πλήρης κουζίνα", "Για περισσότερη ανεξαρτησία", "↑ Ανώτερη κατηγορία"],
      noKitchen: ["Όχι, δεν χρειάζεται", "Πιο απλή επιλογή", "↓ Πιο οικονομικό"],
    },
    matches: {
      comfortablyFits: "Χωράει άνετα",
      doesNotFit: "Δεν χωράει",
      guests: "άτομα",
      budgetFriendly: "Οικονομική επιλογή",
      notEconomy: "Δεν είναι οικονομικό δωμάτιο",
      premiumCategory: "Standard / premium κατηγορία",
      economyWhilePremium: "Οικονομικό δωμάτιο, ενώ επέλεξες standard / premium",
      easyNoStairs: "Εύκολη πρόσβαση χωρίς σκάλες",
      hasStairs: "Έχει σκάλες",
      firstFloorOk: "Ο όροφος είναι ΟΚ",
      groundFloorAccess: "Εύκολη πρόσβαση ισογείου",
      upperView: "Θέα από ψηλά",
      noUpperView: "Δεν έχει θέα από ψηλά",
      gardenView: "Θέα στον κήπο",
      noGardenView: "Δεν έχει θέα στον κήπο",
      fullKitchen: "Πλήρης κουζίνα",
      kitchenette: "Kitchenette",
      noKitchen: "Δεν έχει παροχές κουζίνας",
      fits: "Χωράει",
      economy: "Οικονομικό",
      standardPremium: "Standard/Premium",
      noStairs: "Χωρίς σκάλες",
      kitchenFacilities: "Παροχές κουζίνας",
    },
  },

  fr: {
    roomFinder: "Trouver ma chambre",
    step: "Étape",
    introTitle: "Commençons !",
    introText:
      "Répondez à 5 questions rapides et nous vous proposerons la meilleure chambre ou le meilleur appartement pour votre séjour à Chios.",
    firstName: "Prénom",
    lastName: "Nom",
    checkin: "Arrivée",
    checkout: "Départ",
    email: "Email",
    phone: "Téléphone",
    gdpr:
      "J’accepte le traitement de mes données personnelles afin de recevoir des suggestions d’hébergement.",
    start: "Démarrer",
    back: "Retour",
    bestMatch: "Meilleur choix",
    sendByEmail: "Envoyer par email",
    alternativeOptions: "Options alternatives",
    startOver: "Recommencer",
    checkoutAlert: "La date de départ doit être après la date d’arrivée.",
    whyItFits: "POURQUOI CELA VOUS CORRESPOND :",
    perfectMatch: "Correspond à 100% de vos critères !",
    offersMissing: "CE QU’ELLE OFFRE / CE QUI MANQUE :",
    samePrice: "Même catégorie de prix",
    moreExpensive: "Plus cher que le meilleur choix",
    cheaper: "Moins cher que le meilleur choix",
    bedTypes: "Types de lits",
    double: "Double",
    single: "Simple",
    sofaBed: "Canapé-lit",
    galleryThumbnails: "Miniatures de la galerie",
    photo: "photo",
    whatsappGreeting: "Bonjour ! Je m’appelle",
    whatsappBook: "et je souhaite réserver.",
    room: "Chambre",
    guests: "Personnes",
    emailSubject: "Demande",
    questions: {
      guests: "Combien de personnes ?",
      budget: "Quelle gamme de prix préférez-vous ?",
      stairs: "Accès et escaliers ?",
      view: "Quelle vue préférez-vous ?",
      kitchen: "Avez-vous besoin d’une cuisine ?",
    },
    options: {
      couple: ["Couple (2 personnes)", "Idéal pour 2 adultes"],
      three: ["3 personnes", "Famille ou amis"],
      four: ["4 personnes", "Confort maximum"],
      economy: ["Économique", "Option plus abordable", "↓ Option économique"],
      premium: ["Standard / Premium", "Tarif régulier", "↑ Plus de confort"],
      noStairs: ["Sans escaliers", "Rez-de-chaussée ou appartement indépendant", "↓ Souvent plus pratique"],
      stairsOk: ["Les escaliers ne posent pas problème", "Inclut les options à l’étage", "↑ Plus de choix"],
      upperView: ["Vue depuis l’étage", "Ambiance plus premium", "↑ Plus premium"],
      gardenView: ["Vue jardin", "Atmosphère paisible", "↓ Souvent plus abordable"],
      anyView: ["Peu importe", "Ce n’est pas une priorité"],
      fullKitchen: ["Oui, cuisine complète", "Pour plus d’indépendance", "↑ Catégorie supérieure"],
      noKitchen: ["Non, pas nécessaire", "Option plus simple", "↓ Plus économique"],
    },
    matches: {
      comfortablyFits: "Convient confortablement à",
      doesNotFit: "Ne convient pas à",
      guests: "personnes",
      budgetFriendly: "Option économique et abordable",
      notEconomy: "Ce n’est pas une chambre économique",
      premiumCategory: "Catégorie standard / premium",
      economyWhilePremium: "Chambre économique, alors que vous avez choisi standard / premium",
      easyNoStairs: "Accès facile sans escaliers",
      hasStairs: "Avec escaliers",
      firstFloorOk: "L’étage est acceptable",
      groundFloorAccess: "Accès facile au rez-de-chaussée",
      upperView: "Vue depuis l’étage",
      noUpperView: "Pas de vue depuis l’étage",
      gardenView: "Vue jardin",
      noGardenView: "Pas de vue jardin",
      fullKitchen: "Cuisine complète",
      kitchenette: "Kitchenette",
      noKitchen: "Pas d’équipement cuisine",
      fits: "Convient à",
      economy: "Économique",
      standardPremium: "Standard/Premium",
      noStairs: "Sans escaliers",
      kitchenFacilities: "Équipement cuisine",
    },
  },

  de: {
    roomFinder: "Zimmer finden",
    step: "Schritt",
    introTitle: "Los geht’s!",
    introText:
      "Beantworten Sie 5 kurze Fragen und wir schlagen Ihnen das passende Zimmer oder Apartment für Ihren Aufenthalt auf Chios vor.",
    firstName: "Vorname",
    lastName: "Nachname",
    checkin: "Anreise",
    checkout: "Abreise",
    email: "Email",
    phone: "Telefon",
    gdpr:
      "Ich stimme der Verarbeitung meiner personenbezogenen Daten zu, um Unterkunftsvorschläge zu erhalten.",
    start: "Starten",
    back: "Zurück",
    bestMatch: "Beste Wahl",
    sendByEmail: "Per Email senden",
    alternativeOptions: "Alternative Optionen",
    startOver: "Neu starten",
    checkoutAlert: "Das Abreisedatum muss nach dem Anreisedatum liegen.",
    whyItFits: "WARUM ES PASST:",
    perfectMatch: "Passt zu 100% zu Ihren Kriterien!",
    offersMissing: "WAS ES BIETET / WAS FEHLT:",
    samePrice: "Gleiche Preiskategorie",
    moreExpensive: "Teurer als die beste Wahl",
    cheaper: "Günstiger als die beste Wahl",
    bedTypes: "Bettenarten",
    double: "Doppelbett",
    single: "Einzelbett",
    sofaBed: "Schlafsofa",
    galleryThumbnails: "Galerie-Miniaturen",
    photo: "Foto",
    whatsappGreeting: "Hallo! Mein Name ist",
    whatsappBook: "und ich möchte buchen.",
    room: "Zimmer",
    guests: "Gäste",
    emailSubject: "Anfrage",
    questions: {
      guests: "Wie viele Gäste?",
      budget: "Welche Preiskategorie bevorzugen Sie?",
      stairs: "Zugang und Treppen?",
      view: "Welche Aussicht bevorzugen Sie?",
      kitchen: "Benötigen Sie eine Küche?",
    },
    options: {
      couple: ["Paar (2 Gäste)", "Ideal für 2 Erwachsene"],
      three: ["3 Gäste", "Familie oder Freunde"],
      four: ["4 Gäste", "Maximaler Komfort"],
      economy: ["Economy", "Budgetfreundlicher", "↓ Budget-Option"],
      premium: ["Standard / Premium", "Regulärer Preis", "↑ Mehr Komfort"],
      noStairs: ["Keine Treppen", "Erdgeschoss oder separates Apartment", "↓ Oft praktischer"],
      stairsOk: ["Treppen sind OK", "Beinhaltet Optionen im Obergeschoss", "↑ Mehr Auswahl"],
      upperView: ["Aussicht vom Obergeschoss", "Mehr Premium-Gefühl", "↑ Premium"],
      gardenView: ["Gartenblick", "Ruhige Atmosphäre", "↓ Oft günstiger"],
      anyView: ["Egal", "Keine Priorität"],
      fullKitchen: ["Ja, komplette Küche", "Für maximale Unabhängigkeit", "↑ Höhere Kategorie"],
      noKitchen: ["Nein, nicht nötig", "Einfacher und günstiger", "↓ Günstiger"],
    },
    matches: {
      comfortablyFits: "Geeignet für",
      doesNotFit: "Nicht geeignet für",
      guests: "Gäste",
      budgetFriendly: "Budgetfreundliche Economy-Option",
      notEconomy: "Kein Economy-Zimmer",
      premiumCategory: "Standard- / Premium-Kategorie",
      economyWhilePremium: "Economy-Zimmer, obwohl Standard / Premium gewählt wurde",
      easyNoStairs: "Einfacher Zugang ohne Treppen",
      hasStairs: "Hat Treppen",
      firstFloorOk: "Obergeschoss ist OK",
      groundFloorAccess: "Einfacher Zugang im Erdgeschoss",
      upperView: "Aussicht vom Obergeschoss",
      noUpperView: "Keine Aussicht vom Obergeschoss",
      gardenView: "Gartenblick",
      noGardenView: "Kein Gartenblick",
      fullKitchen: "Komplette Küche",
      kitchenette: "Kitchenette",
      noKitchen: "Keine Küchenausstattung",
      fits: "Geeignet für",
      economy: "Economy",
      standardPremium: "Standard/Premium",
      noStairs: "Keine Treppen",
      kitchenFacilities: "Küchenausstattung",
    },
  },

  it: {
    roomFinder: "Trova la camera",
    step: "Passo",
    introTitle: "Iniziamo!",
    introText:
      "Rispondi a 5 brevi domande e ti suggeriremo la camera o l’appartamento più adatto per il tuo soggiorno a Chios.",
    firstName: "Nome",
    lastName: "Cognome",
    checkin: "Check-in",
    checkout: "Check-out",
    email: "Email",
    phone: "Telefono",
    gdpr:
      "Acconsento al trattamento dei miei dati personali per ricevere suggerimenti relativi all’alloggio.",
    start: "Inizia",
    back: "Indietro",
    bestMatch: "Migliore scelta",
    sendByEmail: "Invia via email",
    alternativeOptions: "Alternative disponibili",
    startOver: "Ricomincia",
    checkoutAlert: "Il check-out deve essere successivo al check-in.",
    whyItFits: "PERCHÉ È ADATTA A TE:",
    perfectMatch: "Soddisfa il 100% dei tuoi criteri!",
    offersMissing: "COSA OFFRE / COSA MANCA:",
    samePrice: "Stessa fascia di prezzo",
    moreExpensive: "Più costosa rispetto alla soluzione migliore",
    cheaper: "Più conveniente rispetto alla soluzione migliore",
    bedTypes: "Tipologia letti",
    double: "Matrimoniale",
    single: "Singolo",
    sofaBed: "Divano letto",
    galleryThumbnails: "Miniature della galleria",
    photo: "foto",
    whatsappGreeting: "Buongiorno! Mi chiamo",
    whatsappBook: "e vorrei prenotare.",
    room: "Alloggio",
    guests: "Ospiti",
    emailSubject: "Richiesta",
    questions: {
      guests: "Quanti ospiti siete?",
      budget: "Quale fascia di prezzo preferisci?",
      stairs: "Accesso e scale?",
      view: "Che tipo di vista preferisci?",
      kitchen: "Hai bisogno di una cucina?",
    },
    options: {
      couple: ["Coppia (2 ospiti)", "Ideale per 2 adulti"],
      three: ["3 ospiti", "Famiglia o amici"],
      four: ["4 ospiti", "Massimo comfort"],
      economy: ["Economy", "Più conveniente", "↓ Opzione economica"],
      premium: ["Standard / Premium", "Tariffa regolare", "↑ Fascia superiore"],
      noStairs: ["Niente scale", "Piano terra o unità indipendente", "↓ Accesso più facile"],
      stairsOk: ["Le scale vanno bene", "Include anche il primo piano", "↑ Più opzioni"],
      upperView: ["Vista dall’alto", "Atmosfera più raffinata", "↑ Sensazione premium"],
      gardenView: ["Vista giardino", "Atmosfera tranquilla", "↓ Spesso più conveniente"],
      anyView: ["Qualsiasi vista", "Non è una priorità"],
      fullKitchen: ["Sì, cucina completa", "Per la massima indipendenza", "↑ Categoria superiore"],
      noKitchen: ["No, non è necessaria", "Più semplice e conveniente", "↓ Più economico"],
    },
    matches: {
      comfortablyFits: "Accoglie comodamente",
      doesNotFit: "Non adatta per",
      guests: "ospiti",
      budgetFriendly: "Tariffa economica",
      notEconomy: "Non è una soluzione Economy",
      premiumCategory: "Categoria Standard / Premium",
      economyWhilePremium: "Camera Economy, mentre hai selezionato Standard / Premium",
      easyNoStairs: "Accesso facile senza scale",
      hasStairs: "Presenza di scale",
      firstFloorOk: "Primo piano accettabile",
      groundFloorAccess: "Comodo accesso al piano terra",
      upperView: "Vista dall’alto",
      noUpperView: "Nessuna vista dall’alto",
      gardenView: "Vista giardino",
      noGardenView: "Nessuna vista giardino",
      fullKitchen: "Cucina completa",
      kitchenette: "Angolo cottura",
      noKitchen: "Nessuna cucina",
      fits: "Adatta per",
      economy: "Economy",
      standardPremium: "Standard/Premium",
      noStairs: "Senza scale",
      kitchenFacilities: "Servizi cucina",
    },
  },

  es: {
    roomFinder: "Encontrar habitación",
    step: "Paso",
    introTitle: "¡Empecemos!",
    introText:
      "Responde 5 preguntas rápidas y te sugeriremos la mejor habitación o apartamento para tu estancia en Chios.",
    firstName: "Nombre",
    lastName: "Apellido",
    checkin: "Llegada",
    checkout: "Salida",
    email: "Email",
    phone: "Teléfono",
    gdpr:
      "Acepto el tratamiento de mis datos personales para recibir sugerencias de alojamiento.",
    start: "Empezar",
    back: "Atrás",
    bestMatch: "Mejor opción",
    sendByEmail: "Enviar por email",
    alternativeOptions: "Opciones alternativas",
    startOver: "Empezar de nuevo",
    checkoutAlert: "La fecha de salida debe ser posterior a la fecha de llegada.",
    whyItFits: "POR QUÉ ENCAJA:",
    perfectMatch: "¡Coincide al 100% con tus criterios!",
    offersMissing: "QUÉ OFRECE / QUÉ FALTA:",
    samePrice: "Misma categoría de precio",
    moreExpensive: "Más caro que la mejor opción",
    cheaper: "Más económico que la mejor opción",
    bedTypes: "Tipos de cama",
    double: "Doble",
    single: "Individual",
    sofaBed: "Sofá cama",
    galleryThumbnails: "Miniaturas de la galería",
    photo: "foto",
    whatsappGreeting: "¡Hola! Me llamo",
    whatsappBook: "y me gustaría reservar.",
    room: "Habitación",
    guests: "Huéspedes",
    emailSubject: "Consulta",
    questions: {
      guests: "¿Cuántos huéspedes?",
      budget: "¿Qué nivel de precio prefieres?",
      stairs: "¿Acceso y escaleras?",
      view: "¿Qué vista prefieres?",
      kitchen: "¿Necesitas cocina?",
    },
    options: {
      couple: ["Pareja (2 huéspedes)", "Ideal para 2 adultos"],
      three: ["3 huéspedes", "Familia o amigos"],
      four: ["4 huéspedes", "Máximo confort"],
      economy: ["Económica", "Más asequible", "↓ Opción económica"],
      premium: ["Standard / Premium", "Precio regular", "↑ Más confort"],
      noStairs: ["Sin escaleras", "Planta baja o apartamento independiente", "↓ Acceso más fácil"],
      stairsOk: ["Las escaleras están bien", "Incluye opciones en primera planta", "↑ Más opciones"],
      upperView: ["Vista desde arriba", "Sensación más premium", "↑ Ambiente premium"],
      gardenView: ["Vista al jardín", "Ambiente tranquilo", "↓ A menudo más económico"],
      anyView: ["Cualquier vista", "No es prioridad"],
      fullKitchen: ["Sí, cocina completa", "Para máxima independencia", "↑ Categoría superior"],
      noKitchen: ["No, no hace falta", "Más simple y económico", "↓ Más barato"],
    },
    matches: {
      comfortablyFits: "Acomoda cómodamente a",
      doesNotFit: "No acomoda a",
      guests: "huéspedes",
      budgetFriendly: "Opción económica",
      notEconomy: "No es una habitación económica",
      premiumCategory: "Categoría Standard / Premium",
      economyWhilePremium: "Habitación económica, aunque seleccionaste Standard / Premium",
      easyNoStairs: "Acceso fácil sin escaleras",
      hasStairs: "Tiene escaleras",
      firstFloorOk: "La primera planta está bien",
      groundFloorAccess: "Acceso fácil en planta baja",
      upperView: "Vista desde arriba",
      noUpperView: "Sin vista desde arriba",
      gardenView: "Vista al jardín",
      noGardenView: "Sin vista al jardín",
      fullKitchen: "Cocina completa",
      kitchenette: "Kitchenette",
      noKitchen: "Sin instalaciones de cocina",
      fits: "Acomoda",
      economy: "Económica",
      standardPremium: "Standard/Premium",
      noStairs: "Sin escaleras",
      kitchenFacilities: "Instalaciones de cocina",
    },
  },

  tr: {
    roomFinder: "Odamı bul",
    step: "Adım",
    introTitle: "Başlayalım!",
    introText:
      "5 kısa soruyu yanıtlayın, Sakız Adası konaklamanız için en uygun oda veya daireyi önerelim.",
    firstName: "Ad",
    lastName: "Soyad",
    checkin: "Giriş",
    checkout: "Çıkış",
    email: "Email",
    phone: "Telefon",
    gdpr:
      "Konaklama önerileri almak amacıyla kişisel verilerimin işlenmesini kabul ediyorum.",
    start: "Başla",
    back: "Geri",
    bestMatch: "En iyi seçim",
    sendByEmail: "Email ile gönder",
    alternativeOptions: "Alternatif seçenekler",
    startOver: "Baştan başla",
    checkoutAlert: "Çıkış tarihi giriş tarihinden sonra olmalıdır.",
    whyItFits: "NEDEN UYGUN:",
    perfectMatch: "Kriterlerinizle %100 uyumlu!",
    offersMissing: "NE SUNUYOR / NE EKSİK:",
    samePrice: "Aynı fiyat kategorisi",
    moreExpensive: "En iyi seçimden daha pahalı",
    cheaper: "En iyi seçimden daha ekonomik",
    bedTypes: "Yatak türleri",
    double: "Çift kişilik",
    single: "Tek kişilik",
    sofaBed: "Çekyat",
    galleryThumbnails: "Galeri küçük görselleri",
    photo: "fotoğraf",
    whatsappGreeting: "Merhaba! Benim adım",
    whatsappBook: "ve rezervasyon yapmak istiyorum.",
    room: "Oda",
    guests: "Misafir",
    emailSubject: "Talep",
    questions: {
      guests: "Kaç misafirsiniz?",
      budget: "Hangi fiyat seviyesini tercih edersiniz?",
      stairs: "Erişim ve merdivenler?",
      view: "Hangi manzarayı tercih edersiniz?",
      kitchen: "Mutfağa ihtiyacınız var mı?",
    },
    options: {
      couple: ["Çift (2 misafir)", "2 yetişkin için ideal"],
      three: ["3 misafir", "Aile veya arkadaşlar"],
      four: ["4 misafir", "Maksimum konfor"],
      economy: ["Ekonomik", "Daha uygun fiyatlı", "↓ Ekonomik seçenek"],
      premium: ["Standard / Premium", "Normal fiyat", "↑ Daha fazla konfor"],
      noStairs: ["Merdivensiz", "Zemin kat veya bağımsız daire", "↓ Daha kolay erişim"],
      stairsOk: ["Merdiven sorun değil", "Üst kat seçeneklerini de içerir", "↑ Daha fazla seçenek"],
      upperView: ["Üst kat manzarası", "Daha premium his", "↑ Premium atmosfer"],
      gardenView: ["Bahçe manzarası", "Huzurlu atmosfer", "↓ Genellikle daha uygun"],
      anyView: ["Fark etmez", "Öncelik değil"],
      fullKitchen: ["Evet, tam mutfak", "Maksimum bağımsızlık için", "↑ Üst kategori"],
      noKitchen: ["Hayır, gerek yok", "Daha sade ve ekonomik", "↓ Daha ekonomik"],
    },
    matches: {
      comfortablyFits: "Rahatça konaklar",
      doesNotFit: "Uygun değil",
      guests: "misafir",
      budgetFriendly: "Ekonomik seçenek",
      notEconomy: "Ekonomik oda değil",
      premiumCategory: "Standard / premium kategori",
      economyWhilePremium: "Standard / premium seçmiş olmanıza rağmen ekonomik oda",
      easyNoStairs: "Merdivensiz kolay erişim",
      hasStairs: "Merdiven var",
      firstFloorOk: "Üst kat uygun",
      groundFloorAccess: "Zemin katta kolay erişim",
      upperView: "Üst kat manzarası",
      noUpperView: "Üst kat manzarası yok",
      gardenView: "Bahçe manzarası",
      noGardenView: "Bahçe manzarası yok",
      fullKitchen: "Tam mutfak",
      kitchenette: "Kitchenette",
      noKitchen: "Mutfak imkânı yok",
      fits: "Uygun",
      economy: "Ekonomik",
      standardPremium: "Standard/Premium",
      noStairs: "Merdivensiz",
      kitchenFacilities: "Mutfak imkânı",
    },
  },
};

type WizardLabels = typeof wizardLabels.en;

function getLabels(language: WizardLanguage): WizardLabels {
  return wizardLabels[language] || wizardLabels.en;
}

function getTomorrowDate() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split("T")[0];
}

function slugify(value: string) {
  return value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

function scoreRoom(room: RoomWizardRoom, prefs: WizardPrefs) {
  if (!prefs.guests || room.maxGuests < prefs.guests) {
    return -999;
  }

  let score = 0;

  score += Math.max(0, 3 - Math.abs(room.maxGuests - prefs.guests));

  if (prefs.budget) {
    score += room.budget ? 6 : -6;
    score += 5 - room.priceLevel;
  } else {
    score += !room.budget ? 6 : -6;
    score += room.priceLevel;
  }

  if (prefs.noStairs) {
    score += !room.stairs ? 4 : -4;
  } else {
    score += room.stairs ? 2 : 1;
  }

  if (prefs.upperView) {
    score += room.upperView ? 4 : -2;
  }

  if (prefs.gardenView) {
    score += room.gardenView ? 4 : -2;
  }

  if (!prefs.upperView && !prefs.gardenView) {
    score += 1;
  }

  if (prefs.kitchen) {
    if (room.fullKitchen) {
      score += 5;
    } else if (room.kitchenette) {
      score += 3;
    } else {
      score -= 5;
    }
  } else {
    if (room.fullKitchen) {
      score -= 2;
    } else if (room.kitchenette) {
      score -= 1;
    }
  }

  return score;
}

function getMatchRows(room: RoomWizardRoom, prefs: WizardPrefs, labels: WizardLabels) {
  const matches: string[] = [];
  const misses: string[] = [];

  if (prefs.guests) {
    if (room.maxGuests >= prefs.guests) {
      matches.push(`${labels.matches.comfortablyFits} ${prefs.guests} ${labels.matches.guests}`);
    } else {
      misses.push(`${labels.matches.doesNotFit} ${prefs.guests} ${labels.matches.guests}`);
    }
  }

  if (prefs.budget) {
    if (room.budget) {
      matches.push(labels.matches.budgetFriendly);
    } else {
      misses.push(labels.matches.notEconomy);
    }
  } else {
    if (!room.budget) {
      matches.push(labels.matches.premiumCategory);
    } else {
      misses.push(labels.matches.economyWhilePremium);
    }
  }

  if (prefs.noStairs) {
    if (!room.stairs) {
      matches.push(labels.matches.easyNoStairs);
    } else {
      misses.push(labels.matches.hasStairs);
    }
  } else {
    matches.push(room.stairs ? labels.matches.firstFloorOk : labels.matches.groundFloorAccess);
  }

  if (prefs.upperView) {
    if (room.upperView) {
      matches.push(labels.matches.upperView);
    } else {
      misses.push(labels.matches.noUpperView);
    }
  }

  if (prefs.gardenView) {
    if (room.gardenView) {
      matches.push(labels.matches.gardenView);
    } else {
      misses.push(labels.matches.noGardenView);
    }
  }

  if (prefs.kitchen) {
    if (room.fullKitchen) {
      matches.push(labels.matches.fullKitchen);
    } else if (room.kitchenette) {
      matches.push(labels.matches.kitchenette);
    } else {
      misses.push(labels.matches.noKitchen);
    }
  }

  return { matches, misses };
}

function getRequirementTags(room: RoomWizardRoom, prefs: WizardPrefs, labels: WizardLabels) {
  const good: string[] = [];
  const bad: string[] = [];

  if (prefs.guests) {
    if (room.maxGuests >= prefs.guests) {
      good.push(`${labels.matches.fits} ${prefs.guests} ${labels.matches.guests}`);
    } else {
      bad.push(`${labels.matches.fits} ${prefs.guests} ${labels.matches.guests}`);
    }
  }

  if (prefs.budget) {
    if (room.budget) {
      good.push(labels.matches.economy);
    } else {
      bad.push(labels.matches.economy);
    }
  } else {
    if (!room.budget) {
      good.push(labels.matches.standardPremium);
    } else {
      bad.push(labels.matches.standardPremium);
    }
  }

  if (prefs.noStairs) {
    if (!room.stairs) {
      good.push(labels.matches.noStairs);
    } else {
      bad.push(labels.matches.noStairs);
    }
  }

  if (prefs.upperView) {
    if (room.upperView) {
      good.push(labels.matches.upperView);
    } else {
      bad.push(labels.matches.upperView);
    }
  }

  if (prefs.gardenView) {
    if (room.gardenView) {
      good.push(labels.matches.gardenView);
    } else {
      bad.push(labels.matches.gardenView);
    }
  }

  if (prefs.kitchen) {
    if (room.fullKitchen) {
      good.push(labels.matches.fullKitchen);
    } else if (room.kitchenette) {
      good.push(labels.matches.kitchenette);
    } else {
      bad.push(labels.matches.kitchenFacilities);
    }
  }

  return { good, bad };
}

function getWhatsAppUrl(
  room: RoomWizardRoom,
  lead: LeadData,
  prefs: WizardPrefs,
  phone: string,
  labels: WizardLabels,
) {
  const text = `${labels.whatsappGreeting} ${lead.firstName} ${lead.lastName} ${labels.whatsappBook}

🏨 ${labels.room}: ${room.name}
📅 ${labels.checkin}: ${lead.checkin}
📅 ${labels.checkout}: ${lead.checkout}
👥 ${labels.guests}: ${prefs.guests}
📧 ${labels.email}: ${lead.email}
📞 ${labels.phone}: ${lead.phone}`;

  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}

function BedPills({ room, labels }: { room: RoomWizardRoom; labels: WizardLabels }) {
  return (
    <div className="rw-bed-row" aria-label={labels.bedTypes}>
      {room.beds.double > 0 && (
        <span className="rw-bed-pill">
          🛏️ {labels.double} <span className="rw-bed-count">x{room.beds.double}</span>
        </span>
      )}

      {room.beds.single > 0 && (
        <span className="rw-bed-pill">
          🛌 {labels.single} <span className="rw-bed-count">x{room.beds.single}</span>
        </span>
      )}

      {room.beds.sofa > 0 && (
        <span className="rw-bed-pill">
          🛋️ {labels.sofaBed} <span className="rw-bed-count">x{room.beds.sofa}</span>
        </span>
      )}
    </div>
  );
}

function RoomGallery({ room, labels }: { room: RoomWizardRoom; labels: WizardLabels }) {
  const [activeImage, setActiveImage] = useState(room.images[0] || "");

  if (!room.images.length) {
    return null;
  }

  return (
    <div className="rw-gallery" id={`gal-${slugify(room.name)}`}>
      <img className="rw-gallery-main" src={activeImage} alt={room.name} loading="lazy" />

      <div className="rw-gallery-thumbs" aria-label={labels.galleryThumbnails}>
        {room.images.map((image, index) => (
          <button
            type="button"
            className={`rw-thumb-button ${activeImage === image ? "active" : ""}`}
            key={image}
            onClick={() => setActiveImage(image)}
            aria-label={`${room.name} ${labels.photo} ${index + 1}`}
          >
            <img
              className="rw-thumb"
              src={image}
              alt={`${room.name} ${labels.photo} ${index + 1}`}
              loading="lazy"
            />
          </button>
        ))}
      </div>
    </div>
  );
}

function MatchAnalysis({
  room,
  prefs,
  labels,
}: {
  room: RoomWizardRoom;
  prefs: WizardPrefs;
  labels: WizardLabels;
}) {
  const { matches, misses } = getMatchRows(room, prefs, labels);

  return (
    <div className="rw-analysis">
      <h3 className="rw-analysis-title">{labels.whyItFits}</h3>

      {matches.map((match) => (
        <div className="rw-match-row good" key={match}>
          ✓ {match}
        </div>
      ))}

      {misses.map((miss) => (
        <div className="rw-match-row bad" key={miss}>
          ✕ {miss}
        </div>
      ))}

      {misses.length === 0 && (
        <div className="rw-match-row good" style={{ marginTop: 10, fontWeight: 900 }}>
          ✓ {labels.perfectMatch}
        </div>
      )}
    </div>
  );
}

function RequirementTags({
  room,
  prefs,
  labels,
}: {
  room: RoomWizardRoom;
  prefs: WizardPrefs;
  labels: WizardLabels;
}) {
  const tags = getRequirementTags(room, prefs, labels);

  return (
    <div className="rw-req-tags">
      {tags.good.map((tag) => (
        <span className="rw-req-tag good" key={`good-${tag}`}>
          {tag}
        </span>
      ))}

      {tags.bad.map((tag) => (
        <span className="rw-req-tag bad" key={`bad-${tag}`}>
          {tag}
        </span>
      ))}
    </div>
  );
}

function AlternativeRoom({
  room,
  bestRoom,
  lead,
  prefs,
  whatsappPhone,
  labels,
}: {
  room: RoomWizardRoom;
  bestRoom: RoomWizardRoom;
  lead: LeadData;
  prefs: WizardPrefs;
  whatsappPhone: string;
  labels: WizardLabels;
}) {
  const [isOpen, setIsOpen] = useState(false);

  let priceClass = "compare-same";
  let priceText = labels.samePrice;

  if (room.priceLevel > bestRoom.priceLevel) {
    priceClass = "compare-up";
    priceText = labels.moreExpensive;
  }

  if (room.priceLevel < bestRoom.priceLevel) {
    priceClass = "compare-down";
    priceText = labels.cheaper;
  }

  return (
    <div className={`rw-accordion ${isOpen ? "open" : ""}`}>
      <button
        type="button"
        className="rw-accordion-header"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((value) => !value)}
      >
        <span>{room.name}</span>
        <span className="rw-acc-icon">⌄</span>
      </button>

      <div className="rw-accordion-body">
        <div className="acc-meta">
          {room.type} • {room.location}
        </div>

        <div className={`rw-price-compare-tag ${priceClass}`}>{priceText}</div>

        <RequirementTags room={room} prefs={prefs} labels={labels} />
        <BedPills room={room} labels={labels} />
        <RoomGallery room={room} labels={labels} />

        <div className="rw-analysis-title">{labels.offersMissing}</div>
        <MatchAnalysis room={room} prefs={prefs} labels={labels} />

        <div className="rw-btn-group">
          <a
            href={getWhatsAppUrl(room, lead, prefs, whatsappPhone, labels)}
            target="_blank"
            rel="noopener noreferrer"
            className="rw-action-btn btn-wa"
          >
            WhatsApp
          </a>

          <a
            className="rw-action-btn btn-email"
            href={`mailto:info@chioshotel.gr?subject=${encodeURIComponent(
              `${labels.emailSubject} - ${lead.firstName} ${lead.lastName} - ${room.name}`,
            )}`}
          >
            Email
          </a>
        </div>
      </div>
    </div>
  );
}

export function RoomWizard({ rooms, whatsappPhone, language = "en" }: RoomWizardProps) {
  const labels = getLabels(language);
  const minDate = getTomorrowDate();

  const [lead, setLead] = useState<LeadData>({
    firstName: "",
    lastName: "",
    checkin: "",
    checkout: "",
    email: "",
    phone: "",
  });

  const [prefs, setPrefs] = useState<WizardPrefs>({});
  const [hasStarted, setHasStarted] = useState(false);
  const [step, setStep] = useState(0);

  const questions: Question[] = useMemo(
    () => [
      {
        id: "guests",
        question: labels.questions.guests,
        options: [
          {
            title: labels.options.couple[0],
            hint: labels.options.couple[1],
            icon: "👥",
            apply: (current) => ({ ...current, guests: 2 }),
          },
          {
            title: labels.options.three[0],
            hint: labels.options.three[1],
            icon: "👨‍👩‍👦",
            apply: (current) => ({ ...current, guests: 3 }),
          },
          {
            title: labels.options.four[0],
            hint: labels.options.four[1],
            icon: "👨‍👩‍👧‍👦",
            apply: (current) => ({ ...current, guests: 4 }),
          },
        ],
      },
      {
        id: "budget",
        question: labels.questions.budget,
        options: [
          {
            title: labels.options.economy[0],
            hint: labels.options.economy[1],
            icon: "💶",
            tag: labels.options.economy[2],
            tagClass: "tag-down",
            apply: (current) => ({ ...current, budget: true }),
          },
          {
            title: labels.options.premium[0],
            hint: labels.options.premium[1],
            icon: "💶",
            tag: labels.options.premium[2],
            tagClass: "tag-up",
            apply: (current) => ({ ...current, budget: false }),
          },
        ],
      },
      {
        id: "stairs",
        question: labels.questions.stairs,
        options: [
          {
            title: labels.options.noStairs[0],
            hint: labels.options.noStairs[1],
            icon: "🧳",
            tag: labels.options.noStairs[2],
            tagClass: "tag-down",
            apply: (current) => ({ ...current, noStairs: true }),
          },
          {
            title: labels.options.stairsOk[0],
            hint: labels.options.stairsOk[1],
            icon: "🪜",
            tag: labels.options.stairsOk[2],
            tagClass: "tag-up",
            apply: (current) => ({ ...current, noStairs: false }),
          },
        ],
      },
      {
        id: "view",
        question: labels.questions.view,
        options: [
          {
            title: labels.options.upperView[0],
            hint: labels.options.upperView[1],
            icon: "👁️",
            tag: labels.options.upperView[2],
            tagClass: "tag-up",
            apply: (current) => ({ ...current, upperView: true, gardenView: false }),
          },
          {
            title: labels.options.gardenView[0],
            hint: labels.options.gardenView[1],
            icon: "🌿",
            tag: labels.options.gardenView[2],
            tagClass: "tag-down",
            apply: (current) => ({ ...current, upperView: false, gardenView: true }),
          },
          {
            title: labels.options.anyView[0],
            hint: labels.options.anyView[1],
            icon: "✨",
            apply: (current) => ({ ...current, upperView: false, gardenView: false }),
          },
        ],
      },
      {
        id: "kitchen",
        question: labels.questions.kitchen,
        options: [
          {
            title: labels.options.fullKitchen[0],
            hint: labels.options.fullKitchen[1],
            icon: "🍳",
            tag: labels.options.fullKitchen[2],
            tagClass: "tag-up",
            apply: (current) => ({ ...current, kitchen: true }),
          },
          {
            title: labels.options.noKitchen[0],
            hint: labels.options.noKitchen[1],
            icon: "🍽️",
            tag: labels.options.noKitchen[2],
            tagClass: "tag-down",
            apply: (current) => ({ ...current, kitchen: false }),
          },
        ],
      },
    ],
    [labels],
  );

  const visibleQuestions = useMemo(() => {
    const skipView = prefs.guests === 2 && prefs.budget === true;
    return questions.filter((question) => !(skipView && question.id === "view"));
  }, [prefs.budget, prefs.guests, questions]);

  const currentQuestion = visibleQuestions[step];
  const isFinished = hasStarted && step >= visibleQuestions.length;

  const results = useMemo(() => {
    return rooms
      .map((room) => ({
        room,
        score: scoreRoom(room, prefs),
      }))
      .filter((item) => item.score > -999)
      .sort((a, b) => b.score - a.score);
  }, [prefs, rooms]);

  const bestRoom = results[0]?.room;
  const alternativeRooms = results.slice(1, 3).map((item) => item.room);

  function handleLeadSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!lead.checkin || !lead.checkout || lead.checkout <= lead.checkin) {
      alert(labels.checkoutAlert);
      return;
    }

    setHasStarted(true);
    setStep(0);
  }

  function handleOption(option: QuestionOption) {
    setPrefs((current) => option.apply(current));
    setStep((current) => current + 1);
  }

  function goBack() {
    if (step > 0) {
      setStep((current) => current - 1);
      return;
    }

    setHasStarted(false);
    setPrefs({});
  }

  function resetWizard() {
    setHasStarted(false);
    setStep(0);
    setPrefs({});
  }

  return (
    <section className="rw-wrapper" id="room-wizard-app" aria-labelledby="rw-main-title">
      <div className="rw-main-card">
        {hasStarted && (
          <header className="rw-header active" id="rw-header">
            <div className="rw-header-flex">
              <div className="rw-logo">🏠 {labels.roomFinder}</div>

              <div className="rw-step-tag" aria-live="polite">
                {labels.step} <span>{Math.min(step + 1, visibleQuestions.length)}</span>/
                <span>{visibleQuestions.length}</span>
              </div>
            </div>

            <div className="rw-progress-track">
              <div
                className="rw-progress-bar"
                role="progressbar"
                aria-valuenow={Math.round(
                  (Math.min(step + 1, visibleQuestions.length) / visibleQuestions.length) * 100,
                )}
                aria-valuemin={0}
                aria-valuemax={100}
                style={{
                  width: `${
                    (Math.min(step + 1, visibleQuestions.length) / visibleQuestions.length) * 100
                  }%`,
                }}
              />
            </div>
          </header>
        )}

        {!hasStarted && (
          <>
            <header className="rw-intro-header">
              <h3 className="rw-intro-title" id="rw-main-title">
                {labels.introTitle}
              </h3>

              <p className="rw-intro-sub">{labels.introText}</p>
            </header>

            <form onSubmit={handleLeadSubmit}>
              <fieldset style={{ border: "none", padding: 0, margin: 0 }}>
                <div className="rw-form-grid">
                  <div className="rw-form-group">
                    <input
                      id="rw-first-name"
                      type="text"
                      className="rw-input"
                      placeholder=" "
                      required
                      autoComplete="given-name"
                      value={lead.firstName}
                      onChange={(event) =>
                        setLead((current) => ({ ...current, firstName: event.target.value }))
                      }
                    />
                    <label className="rw-label" htmlFor="rw-first-name">
                      {labels.firstName}
                    </label>
                  </div>

                  <div className="rw-form-group">
                    <input
                      id="rw-last-name"
                      type="text"
                      className="rw-input"
                      placeholder=" "
                      required
                      autoComplete="family-name"
                      value={lead.lastName}
                      onChange={(event) =>
                        setLead((current) => ({ ...current, lastName: event.target.value }))
                      }
                    />
                    <label className="rw-label" htmlFor="rw-last-name">
                      {labels.lastName}
                    </label>
                  </div>

                  <div className="rw-form-group">
                    <input
                      id="rw-checkin"
                      type="date"
                      className="rw-input"
                      min={minDate}
                      placeholder=" "
                      required
                      value={lead.checkin}
                      onChange={(event) =>
                        setLead((current) => ({
                          ...current,
                          checkin: event.target.value,
                          checkout:
                            current.checkout && current.checkout <= event.target.value
                              ? ""
                              : current.checkout,
                        }))
                      }
                    />
                    <label className="rw-label" htmlFor="rw-checkin">
                      {labels.checkin}
                    </label>
                  </div>

                  <div className="rw-form-group">
                    <input
                      id="rw-checkout"
                      type="date"
                      className="rw-input"
                      min={lead.checkin || minDate}
                      placeholder=" "
                      required
                      value={lead.checkout}
                      onChange={(event) =>
                        setLead((current) => ({ ...current, checkout: event.target.value }))
                      }
                    />
                    <label className="rw-label" htmlFor="rw-checkout">
                      {labels.checkout}
                    </label>
                  </div>

                  <div className="rw-form-group full">
                    <input
                      id="rw-email"
                      type="email"
                      className="rw-input"
                      placeholder=" "
                      required
                      autoComplete="email"
                      value={lead.email}
                      onChange={(event) =>
                        setLead((current) => ({ ...current, email: event.target.value }))
                      }
                    />
                    <label className="rw-label" htmlFor="rw-email">
                      {labels.email}
                    </label>
                  </div>

                  <div className="rw-form-group full">
                    <input
                      id="rw-phone"
                      type="tel"
                      className="rw-input"
                      placeholder=" "
                      required
                      autoComplete="tel"
                      inputMode="tel"
                      value={lead.phone}
                      onChange={(event) =>
                        setLead((current) => ({ ...current, phone: event.target.value }))
                      }
                    />
                    <label className="rw-label" htmlFor="rw-phone">
                      {labels.phone}
                    </label>
                  </div>

                  <div className="rw-form-group full rw-checkbox-group">
                    <input id="rw-gdpr" type="checkbox" required />
                    <label htmlFor="rw-gdpr">{labels.gdpr}</label>
                  </div>
                </div>
              </fieldset>

              <button type="submit" className="rw-start-btn">
                {labels.start}
              </button>
            </form>
          </>
        )}

        {hasStarted && currentQuestion && !isFinished && (
          <>
            <h2 className="rw-question-text">{currentQuestion.question}</h2>

            <div className="rw-options-list">
              {currentQuestion.options.map((option) => (
                <button
                  type="button"
                  className="rw-opt-card"
                  key={option.title}
                  onClick={() => handleOption(option)}
                >
                  <div className="rw-opt-icon">{option.icon}</div>

                  <div className="rw-opt-content">
                    <h4>{option.title}</h4>
                    <div className="rw-opt-hint">{option.hint}</div>

                    {option.tag && (
                      <div className={`rw-price-tag ${option.tagClass || ""}`}>{option.tag}</div>
                    )}
                  </div>
                </button>
              ))}
            </div>

            <div className="rw-nav-footer">
              <button type="button" className="rw-back-btn" onClick={goBack}>
                ← {labels.back}
              </button>
            </div>
          </>
        )}

        {isFinished && bestRoom && (
          <>
            <article className="rw-hero-card">
              <div className="rw-hero-badge">★ {labels.bestMatch}</div>

              <h2 className="rw-hero-name">{bestRoom.name}</h2>

              <div className="rw-hero-meta">
                {bestRoom.type} • {bestRoom.location}
              </div>

              <RequirementTags room={bestRoom} prefs={prefs} labels={labels} />
              <BedPills room={bestRoom} labels={labels} />
              <RoomGallery room={bestRoom} labels={labels} />
              <MatchAnalysis room={bestRoom} prefs={prefs} labels={labels} />

              <div className="rw-btn-group">
                <a
                  href={getWhatsAppUrl(bestRoom, lead, prefs, whatsappPhone, labels)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rw-action-btn btn-wa"
                >
                  WhatsApp
                </a>

                <a
                  className="rw-action-btn btn-email"
                  href={`mailto:info@chioshotel.gr?subject=${encodeURIComponent(
                    `${labels.emailSubject} - ${lead.firstName} ${lead.lastName} - ${bestRoom.name}`,
                  )}`}
                >
                  {labels.sendByEmail}
                </a>
              </div>
            </article>

            {alternativeRooms.length > 0 && (
              <>
                <h3 className="rw-acc-title">{labels.alternativeOptions}</h3>

                {alternativeRooms.map((room) => (
                  <AlternativeRoom
                    key={room.id}
                    room={room}
                    bestRoom={bestRoom}
                    lead={lead}
                    prefs={prefs}
                    whatsappPhone={whatsappPhone}
                    labels={labels}
                  />
                ))}
              </>
            )}

            <div style={{ marginTop: 18 }}>
              <div className="rw-nav-footer">
                <button type="button" className="rw-back-btn" onClick={goBack}>
                  ← {labels.back}
                </button>
              </div>

              <div style={{ textAlign: "center", marginTop: 12 }}>
                <button
                  type="button"
                  className="rw-back-btn"
                  onClick={resetWizard}
                  style={{ justifyContent: "center" }}
                >
                  {labels.startOver}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}