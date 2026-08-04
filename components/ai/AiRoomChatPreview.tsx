"use client";

import Image from "next/image";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";

type Language = "el" | "en" | "de" | "fr" | "it" | "es" | "tr";
type Step = "checkin" | "checkout" | "rooms" | "guests" | "preferences" | "searching" | "selecting" | "breakfast" | "complete" | "unavailable";
type Filter = "economy" | "noStairs" | "ground" | "first" | "kitchen" | "garden" | "balcony" | "family";
type Message = { id: string; role: "assistant" | "user"; content: string };
type Offer = {
  roomId: string;
  unitId: string;
  roomNumber?: number;
  name: string;
  category: string;
  floor: string;
  maxGuests: number;
  features: string[];
  image: string;
  gallery?: string[];
  nights: number;
  originalTotal: number;
  directTotal: number;
  saving: number;
  splitStay?: boolean;
  recommendationRole?: "recommended" | "budget" | "comfort" | "alternative";
  recommendationTitle?: string;
  recommendationReason?: string;
};
type Choice = { group: number; guests: number; offer: Offer };
type Copy = {
  welcome: string;
  checkout: string;
  rooms: string;
  guests: (room: number) => string;
  preferences: string;
  searching: string;
  choose: (group: number, guests: number) => string;
  breakfast: string;
  breakfastAlt: string;
  breakfastLabel: string;
  summary: string;
  unavailable: string;
  availabilityError: string;
  placeholder: string;
  chooseAbove: string;
  invalidDate: string;
  invalidPastDate: string;
  invalidCheckout: string;
  invalidRooms: string;
  invalidGuests: string;
  online: string;
  live: string;
  details: string;
  select: string;
  selected: string;
  saving: string;
  total: string;
  perNight: string;
  noPreference: string;
  showRooms: string;
  yesBreakfast: string;
  noBreakfast: string;
  newSearch: string;
  back: string;
  contactTitle: string;
  contactHelp: string;
  name: string;
  phone: string;
  email: string;
  send: string;
  sent: string;
  sendError: string;
  whatsapp: string;
  languageLabel: string;
  sendLabel: string;
  roomAria: (index: number) => string;
  roomLabel: (count: number) => string;
  guestLabel: (count: number) => string;
  nightLabel: (count: number) => string;
  filters: Record<Filter, string>;
};

const LANGUAGES: Array<[Language, string]> = [
  ["el", "Ελληνικά"],
  ["en", "English"],
  ["de", "Deutsch"],
  ["fr", "Français"],
  ["it", "Italiano"],
  ["es", "Español"],
  ["tr", "Türkçe"],
];

const COPY = {
  en: {
    welcome: "Welcome to Voulamandis House 👋\nTell me when you would like to arrive in Chios and I’ll check live availability for you.",
    checkout: "Great. What date would you like to check out?",
    rooms: "How many rooms do you need?",
    guests: room => `How many guests will stay in room ${room}?`,
    preferences: "Anything important for your stay? Choose as many preferences as you like.",
    searching: "Checking live availability and the best direct prices…",
    choose: (group, guests) => `I found these options for group ${group} · ${guests} ${guests === 1 ? "guest" : "guests"}.`,
    breakfast: "Would you like to add homemade breakfast for €12 per guest, per day?",
    breakfastAlt: "Homemade breakfast at Voulamandis House",
    breakfastLabel: "Breakfast",
    summary: "Everything is ready. Here is your stay request.",
    unavailable: "I couldn’t find a different available room for this part of your request. Start a new search or ask reception to check manually.",
    availabilityError: "I couldn’t check live availability right now. Please try again or contact us on WhatsApp.",
    placeholder: "Type a date or answer…",
    chooseAbove: "Choose one of the options above",
    invalidDate: "I couldn’t understand that date. Try “20 July” or “20/07”.",
    invalidPastDate: "Check-in cannot be in the past.",
    invalidCheckout: "Check-out must be after check-in.",
    invalidRooms: "Choose 1, 2 or 3 rooms.",
    invalidGuests: "Choose between 1 and 5 guests.",
    online: "Online now",
    live: "Live availability",
    details: "View details",
    select: "Choose room",
    selected: "Selected",
    saving: "You save",
    total: "Total",
    perNight: "per night",
    noPreference: "No preference",
    showRooms: "Show rooms",
    yesBreakfast: "Yes, add breakfast",
    noBreakfast: "No, thank you",
    newSearch: "New search",
    back: "Back to site",
    contactTitle: "Send this request to our team",
    contactHelp: "Enter your name and either a phone number or email address.",
    name: "Name",
    phone: "Phone",
    email: "Email",
    send: "Send request",
    sent: "Your request was sent. We’ll contact you as soon as possible.",
    sendError: "The request could not be sent. Please try WhatsApp.",
    whatsapp: "WhatsApp",
    languageLabel: "Language",
    sendLabel: "Send",
    roomAria: index => `Room ${index}`,
    roomLabel: count => `${count} ${count === 1 ? "room" : "rooms"}`,
    guestLabel: count => `${count} ${count === 1 ? "guest" : "guests"}`,
    nightLabel: count => `${count} ${count === 1 ? "night" : "nights"}`,
    filters: { economy: "Economy", noStairs: "No stairs", ground: "Ground floor", first: "First floor", kitchen: "Kitchen", garden: "Garden", balcony: "Balcony", family: "Family" },
  },
  el: {
    welcome: "Καλώς ήρθατε στο Voulamandis House 👋\nΠείτε μου πότε θέλετε να έρθετε στη Χίο και θα ελέγξω αμέσως τη διαθεσιμότητα.",
    checkout: "Τέλεια. Ποια ημέρα θα γίνει το check-out;",
    rooms: "Πόσα δωμάτια χρειάζεστε;",
    guests: room => `Πόσα άτομα θα μείνουν στο δωμάτιο ${room};`,
    preferences: "Υπάρχει κάτι σημαντικό για τη διαμονή σας; Επιλέξτε όσες προτιμήσεις θέλετε.",
    searching: "Ελέγχω τη διαθεσιμότητα και τις καλύτερες απευθείας τιμές…",
    choose: (group, guests) => `Βρήκα αυτές τις επιλογές για την ομάδα ${group} · ${guests} ${guests === 1 ? "άτομο" : "άτομα"}.`,
    breakfast: "Θέλετε να προσθέσετε σπιτικό πρωινό με 12€ ανά άτομο, ανά ημέρα;",
    breakfastAlt: "Σπιτικό πρωινό στο Voulamandis House",
    breakfastLabel: "Πρωινό",
    summary: "Όλα είναι έτοιμα. Αυτή είναι η αίτηση διαμονής σας.",
    unavailable: "Δεν βρήκα διαφορετικό διαθέσιμο δωμάτιο για αυτό το μέρος της αναζήτησης. Ξεκινήστε νέα αναζήτηση ή ζητήστε χειροκίνητο έλεγχο από την υποδοχή.",
    availabilityError: "Δεν μπόρεσα να ελέγξω τώρα τη διαθεσιμότητα. Δοκιμάστε ξανά ή επικοινωνήστε μαζί μας μέσω WhatsApp.",
    placeholder: "Γράψτε ημερομηνία ή απάντηση…",
    chooseAbove: "Επιλέξτε μία επιλογή",
    invalidDate: "Δεν κατάλαβα την ημερομηνία. Δοκιμάστε «20 Ιουλίου» ή «20/07».",
    invalidPastDate: "Το check-in δεν μπορεί να είναι σε παρελθοντική ημερομηνία.",
    invalidCheckout: "Το check-out πρέπει να είναι μετά το check-in.",
    invalidRooms: "Επιλέξτε 1, 2 ή 3 δωμάτια.",
    invalidGuests: "Επιλέξτε από 1 έως 5 άτομα.",
    online: "Διαθέσιμοι τώρα",
    live: "Άμεση διαθεσιμότητα",
    details: "Λεπτομέρειες",
    select: "Επιλογή δωματίου",
    selected: "Επιλέχθηκε",
    saving: "Εξοικονομείτε",
    total: "Σύνολο",
    perNight: "ανά βραδιά",
    noPreference: "Χωρίς προτίμηση",
    showRooms: "Προβολή δωματίων",
    yesBreakfast: "Ναι, προσθήκη",
    noBreakfast: "Όχι, ευχαριστώ",
    newSearch: "Νέα αναζήτηση",
    back: "Επιστροφή στο site",
    contactTitle: "Στείλτε την αίτηση στην ομάδα μας",
    contactHelp: "Γράψτε το όνομά σας και ένα τηλέφωνο ή email.",
    name: "Όνομα",
    phone: "Τηλέφωνο",
    email: "Email",
    send: "Αποστολή αιτήματος",
    sent: "Το αίτημά σας στάλθηκε. Θα επικοινωνήσουμε μαζί σας το συντομότερο δυνατό.",
    sendError: "Δεν ήταν δυνατή η αποστολή. Χρησιμοποιήστε το WhatsApp.",
    whatsapp: "WhatsApp",
    languageLabel: "Γλώσσα",
    sendLabel: "Αποστολή",
    roomAria: index => `Δωμάτιο ${index}`,
    roomLabel: count => `${count} ${count === 1 ? "δωμάτιο" : "δωμάτια"}`,
    guestLabel: count => `${count} ${count === 1 ? "άτομο" : "άτομα"}`,
    nightLabel: count => `${count} ${count === 1 ? "βραδιά" : "βραδιές"}`,
    filters: { economy: "Οικονομικό", noStairs: "Χωρίς σκάλες", ground: "Ισόγειο", first: "Πρώτος όροφος", kitchen: "Κουζίνα", garden: "Κήπος", balcony: "Μπαλκόνι", family: "Οικογενειακό" },
  },
  de: {
    welcome: "Willkommen im Voulamandis House 👋\nWann möchten Sie nach Chios anreisen? Ich prüfe sofort die Live-Verfügbarkeit.",
    checkout: "Perfekt. Wann möchten Sie abreisen?",
    rooms: "Wie viele Zimmer benötigen Sie?",
    guests: room => `Wie viele Gäste übernachten in Zimmer ${room}?`,
    preferences: "Was ist für Ihren Aufenthalt wichtig? Wählen Sie beliebig viele Wünsche aus.",
    searching: "Live-Verfügbarkeit und Direktpreise werden geprüft…",
    choose: (group, guests) => `Diese Optionen passen zu Gruppe ${group} · ${guests} ${guests === 1 ? "Gast" : "Gäste"}.`,
    breakfast: "Möchten Sie hausgemachtes Frühstück für 12 € pro Person und Tag hinzufügen?",
    breakfastAlt: "Hausgemachtes Frühstück im Voulamandis House",
    breakfastLabel: "Frühstück",
    summary: "Alles ist bereit. Hier ist Ihre Aufenthaltsanfrage.",
    unavailable: "Ich konnte für diesen Teil Ihrer Anfrage kein anderes verfügbares Zimmer finden. Starten Sie eine neue Suche oder bitten Sie die Rezeption um eine manuelle Prüfung.",
    availabilityError: "Die Live-Verfügbarkeit konnte gerade nicht geprüft werden. Versuchen Sie es erneut oder kontaktieren Sie uns über WhatsApp.",
    placeholder: "Datum oder Antwort eingeben…",
    chooseAbove: "Wählen Sie eine Option oben",
    invalidDate: "Ich konnte dieses Datum nicht verstehen. Versuchen Sie „20. Juli“ oder „20/07“.",
    invalidPastDate: "Das Anreisedatum darf nicht in der Vergangenheit liegen.",
    invalidCheckout: "Das Abreisedatum muss nach dem Anreisedatum liegen.",
    invalidRooms: "Wählen Sie 1, 2 oder 3 Zimmer.",
    invalidGuests: "Wählen Sie zwischen 1 und 5 Gästen.",
    online: "Jetzt online",
    live: "Live-Verfügbarkeit",
    details: "Details",
    select: "Zimmer wählen",
    selected: "Ausgewählt",
    saving: "Sie sparen",
    total: "Gesamt",
    perNight: "pro Nacht",
    noPreference: "Keine Präferenz",
    showRooms: "Zimmer anzeigen",
    yesBreakfast: "Ja, hinzufügen",
    noBreakfast: "Nein, danke",
    newSearch: "Neue Suche",
    back: "Zurück zur Website",
    contactTitle: "Anfrage an unser Team senden",
    contactHelp: "Geben Sie Ihren Namen sowie eine Telefonnummer oder E-Mail-Adresse ein.",
    name: "Name",
    phone: "Telefon",
    email: "E-Mail",
    send: "Anfrage senden",
    sent: "Ihre Anfrage wurde gesendet. Wir melden uns so schnell wie möglich.",
    sendError: "Die Anfrage konnte nicht gesendet werden. Bitte versuchen Sie es über WhatsApp.",
    whatsapp: "WhatsApp",
    languageLabel: "Sprache",
    sendLabel: "Senden",
    roomAria: index => `Zimmer ${index}`,
    roomLabel: count => `${count} Zimmer`,
    guestLabel: count => `${count} ${count === 1 ? "Gast" : "Gäste"}`,
    nightLabel: count => `${count} ${count === 1 ? "Nacht" : "Nächte"}`,
    filters: { economy: "Preisgünstig", noStairs: "Keine Treppen", ground: "Erdgeschoss", first: "Erster Stock", kitchen: "Küche", garden: "Garten", balcony: "Balkon", family: "Familie" },
  },
  fr: {
    welcome: "Bienvenue au Voulamandis House 👋\nQuand souhaitez-vous arriver à Chios ? Je vérifie les disponibilités en direct.",
    checkout: "Parfait. Quelle est votre date de départ ?",
    rooms: "Combien de chambres souhaitez-vous ?",
    guests: room => `Combien de personnes séjourneront dans la chambre ${room} ?`,
    preferences: "Qu’est-ce qui est important pour votre séjour ? Choisissez autant de préférences que vous le souhaitez.",
    searching: "Vérification des disponibilités et des tarifs directs…",
    choose: (group, guests) => `Voici les options pour le groupe ${group} · ${guests} ${guests === 1 ? "personne" : "personnes"}.`,
    breakfast: "Souhaitez-vous ajouter le petit-déjeuner maison à 12 € par personne et par jour ?",
    breakfastAlt: "Petit-déjeuner maison au Voulamandis House",
    breakfastLabel: "Petit-déjeuner",
    summary: "Tout est prêt. Voici votre demande de séjour.",
    unavailable: "Je n’ai pas trouvé d’autre chambre disponible pour cette partie de votre demande. Lancez une nouvelle recherche ou demandez une vérification manuelle à la réception.",
    availabilityError: "Je ne peux pas vérifier les disponibilités en direct pour le moment. Réessayez ou contactez-nous sur WhatsApp.",
    placeholder: "Écrivez une date ou une réponse…",
    chooseAbove: "Choisissez une option ci-dessus",
    invalidDate: "Je n’ai pas compris cette date. Essayez « 20 juillet » ou « 20/07 ».",
    invalidPastDate: "La date d’arrivée ne peut pas être dans le passé.",
    invalidCheckout: "La date de départ doit être postérieure à la date d’arrivée.",
    invalidRooms: "Choisissez 1, 2 ou 3 chambres.",
    invalidGuests: "Choisissez entre 1 et 5 personnes.",
    online: "En ligne",
    live: "Disponibilités en direct",
    details: "Détails",
    select: "Choisir la chambre",
    selected: "Sélectionnée",
    saving: "Économie",
    total: "Total",
    perNight: "par nuit",
    noPreference: "Sans préférence",
    showRooms: "Voir les chambres",
    yesBreakfast: "Oui, ajouter",
    noBreakfast: "Non merci",
    newSearch: "Nouvelle recherche",
    back: "Retour au site",
    contactTitle: "Envoyer la demande à notre équipe",
    contactHelp: "Indiquez votre nom ainsi qu’un numéro de téléphone ou une adresse e-mail.",
    name: "Nom",
    phone: "Téléphone",
    email: "E-mail",
    send: "Envoyer",
    sent: "Votre demande a été envoyée. Nous vous contacterons dès que possible.",
    sendError: "La demande n’a pas pu être envoyée. Essayez via WhatsApp.",
    whatsapp: "WhatsApp",
    languageLabel: "Langue",
    sendLabel: "Envoyer",
    roomAria: index => `Chambre ${index}`,
    roomLabel: count => `${count} ${count === 1 ? "chambre" : "chambres"}`,
    guestLabel: count => `${count} ${count === 1 ? "personne" : "personnes"}`,
    nightLabel: count => `${count} ${count === 1 ? "nuit" : "nuits"}`,
    filters: { economy: "Économique", noStairs: "Sans escaliers", ground: "Rez-de-chaussée", first: "Premier étage", kitchen: "Cuisine", garden: "Jardin", balcony: "Balcon", family: "Familiale" },
  },
  it: {
    welcome: "Benvenuti a Voulamandis House 👋\nQuando desideri arrivare a Chios? Controllo subito la disponibilità live.",
    checkout: "Perfetto. Qual è la data di check-out?",
    rooms: "Quante camere ti servono?",
    guests: room => `Quante persone soggiorneranno nella camera ${room}?`,
    preferences: "Cosa è importante per il soggiorno? Scegli tutte le preferenze che desideri.",
    searching: "Controllo disponibilità live e prezzi diretti…",
    choose: (group, guests) => `Ecco le opzioni per il gruppo ${group} · ${guests} ${guests === 1 ? "persona" : "persone"}.`,
    breakfast: "Vuoi aggiungere la colazione fatta in casa a 12 € a persona al giorno?",
    breakfastAlt: "Colazione fatta in casa al Voulamandis House",
    breakfastLabel: "Colazione",
    summary: "Tutto pronto. Ecco la richiesta di soggiorno.",
    unavailable: "Non ho trovato un’altra camera disponibile per questa parte della richiesta. Avvia una nuova ricerca o chiedi alla reception una verifica manuale.",
    availabilityError: "Non riesco a controllare la disponibilità live in questo momento. Riprova o contattaci su WhatsApp.",
    placeholder: "Scrivi una data o una risposta…",
    chooseAbove: "Scegli un’opzione qui sopra",
    invalidDate: "Non ho capito la data. Prova «20 luglio» o «20/07».",
    invalidPastDate: "La data di check-in non può essere nel passato.",
    invalidCheckout: "La data di check-out deve essere successiva al check-in.",
    invalidRooms: "Scegli 1, 2 o 3 camere.",
    invalidGuests: "Scegli da 1 a 5 persone.",
    online: "Online",
    live: "Disponibilità live",
    details: "Dettagli",
    select: "Scegli la camera",
    selected: "Selezionata",
    saving: "Risparmio",
    total: "Totale",
    perNight: "a notte",
    noPreference: "Nessuna preferenza",
    showRooms: "Mostra camere",
    yesBreakfast: "Sì, aggiungi",
    noBreakfast: "No, grazie",
    newSearch: "Nuova ricerca",
    back: "Torna al sito",
    contactTitle: "Invia la richiesta al team",
    contactHelp: "Inserisci il nome e un numero di telefono o un indirizzo email.",
    name: "Nome",
    phone: "Telefono",
    email: "Email",
    send: "Invia richiesta",
    sent: "La richiesta è stata inviata. Ti contatteremo il prima possibile.",
    sendError: "Non è stato possibile inviare la richiesta. Prova con WhatsApp.",
    whatsapp: "WhatsApp",
    languageLabel: "Lingua",
    sendLabel: "Invia",
    roomAria: index => `Camera ${index}`,
    roomLabel: count => `${count} ${count === 1 ? "camera" : "camere"}`,
    guestLabel: count => `${count} ${count === 1 ? "persona" : "persone"}`,
    nightLabel: count => `${count} ${count === 1 ? "notte" : "notti"}`,
    filters: { economy: "Economica", noStairs: "Senza scale", ground: "Piano terra", first: "Primo piano", kitchen: "Cucina", garden: "Giardino", balcony: "Balcone", family: "Familiare" },
  },
  es: {
    welcome: "Bienvenido a Voulamandis House 👋\n¿Cuándo quieres llegar a Chios? Comprobaré la disponibilidad en vivo.",
    checkout: "Perfecto. ¿Cuál es la fecha de salida?",
    rooms: "¿Cuántas habitaciones necesitas?",
    guests: room => `¿Cuántas personas se alojarán en la habitación ${room}?`,
    preferences: "¿Qué es importante para tu estancia? Elige todas las preferencias que quieras.",
    searching: "Comprobando disponibilidad y precios directos…",
    choose: (group, guests) => `Estas son las opciones para el grupo ${group} · ${guests} ${guests === 1 ? "persona" : "personas"}.`,
    breakfast: "¿Quieres añadir desayuno casero por 12 € por persona y día?",
    breakfastAlt: "Desayuno casero en Voulamandis House",
    breakfastLabel: "Desayuno",
    summary: "Todo listo. Esta es tu solicitud de estancia.",
    unavailable: "No encontré otra habitación disponible para esta parte de la solicitud. Inicia una nueva búsqueda o pide a recepción una comprobación manual.",
    availabilityError: "No puedo comprobar la disponibilidad en vivo ahora mismo. Inténtalo de nuevo o contáctanos por WhatsApp.",
    placeholder: "Escribe una fecha o una respuesta…",
    chooseAbove: "Elige una opción arriba",
    invalidDate: "No entendí la fecha. Prueba «20 de julio» o «20/07».",
    invalidPastDate: "La fecha de llegada no puede estar en el pasado.",
    invalidCheckout: "La fecha de salida debe ser posterior a la fecha de llegada.",
    invalidRooms: "Elige 1, 2 o 3 habitaciones.",
    invalidGuests: "Elige entre 1 y 5 personas.",
    online: "En línea",
    live: "Disponibilidad en vivo",
    details: "Detalles",
    select: "Elegir habitación",
    selected: "Seleccionada",
    saving: "Ahorras",
    total: "Total",
    perNight: "por noche",
    noPreference: "Sin preferencia",
    showRooms: "Ver habitaciones",
    yesBreakfast: "Sí, añadir",
    noBreakfast: "No, gracias",
    newSearch: "Nueva búsqueda",
    back: "Volver al sitio",
    contactTitle: "Envía la solicitud al equipo",
    contactHelp: "Escribe tu nombre y un número de teléfono o una dirección de email.",
    name: "Nombre",
    phone: "Teléfono",
    email: "Email",
    send: "Enviar solicitud",
    sent: "La solicitud fue enviada. Te contactaremos lo antes posible.",
    sendError: "No se pudo enviar la solicitud. Inténtalo por WhatsApp.",
    whatsapp: "WhatsApp",
    languageLabel: "Idioma",
    sendLabel: "Enviar",
    roomAria: index => `Habitación ${index}`,
    roomLabel: count => `${count} ${count === 1 ? "habitación" : "habitaciones"}`,
    guestLabel: count => `${count} ${count === 1 ? "persona" : "personas"}`,
    nightLabel: count => `${count} ${count === 1 ? "noche" : "noches"}`,
    filters: { economy: "Económica", noStairs: "Sin escaleras", ground: "Planta baja", first: "Primera planta", kitchen: "Cocina", garden: "Jardín", balcony: "Balcón", family: "Familiar" },
  },
  tr: {
    welcome: "Voulamandis House’a hoş geldiniz 👋\nSakız Adası’na ne zaman gelmek istersiniz? Canlı müsaitliği kontrol edeyim.",
    checkout: "Harika. Çıkış tarihiniz nedir?",
    rooms: "Kaç odaya ihtiyacınız var?",
    guests: room => `${room}. odada kaç kişi kalacak?`,
    preferences: "Konaklamanız için önemli bir tercih var mı? İstediğiniz seçenekleri işaretleyin.",
    searching: "Canlı müsaitlik ve direkt fiyatlar kontrol ediliyor…",
    choose: (group, guests) => `${group}. grup · ${guests} kişi için seçenekler.`,
    breakfast: "Kişi başı günlük 12 € karşılığında ev yapımı kahvaltı eklemek ister misiniz?",
    breakfastAlt: "Voulamandis House ev yapımı kahvaltısı",
    breakfastLabel: "Kahvaltı",
    summary: "Her şey hazır. Konaklama talebiniz burada.",
    unavailable: "Talebinizin bu bölümü için farklı bir müsait oda bulamadım. Yeni bir arama başlatabilir veya resepsiyondan manuel kontrol isteyebilirsiniz.",
    availabilityError: "Şu anda canlı müsaitliği kontrol edemiyorum. Tekrar deneyin veya WhatsApp üzerinden bize ulaşın.",
    placeholder: "Tarih veya cevap yazın…",
    chooseAbove: "Yukarıdaki seçeneklerden birini seçin",
    invalidDate: "Tarihi anlayamadım. «20 Temmuz» veya «20/07» şeklinde tekrar deneyin.",
    invalidPastDate: "Giriş tarihi geçmişte olamaz.",
    invalidCheckout: "Çıkış tarihi giriş tarihinden sonra olmalıdır.",
    invalidRooms: "1, 2 veya 3 oda seçin.",
    invalidGuests: "1 ile 5 arasında kişi seçin.",
    online: "Çevrimiçi",
    live: "Canlı müsaitlik",
    details: "Detaylar",
    select: "Odayı seç",
    selected: "Seçildi",
    saving: "Tasarruf",
    total: "Toplam",
    perNight: "gecelik",
    noPreference: "Tercihim yok",
    showRooms: "Odaları göster",
    yesBreakfast: "Evet, ekle",
    noBreakfast: "Hayır, teşekkürler",
    newSearch: "Yeni arama",
    back: "Siteye dön",
    contactTitle: "Talebi ekibimize gönderin",
    contactHelp: "Adınızı ve telefon numaranızı veya e-posta adresinizi girin.",
    name: "Ad",
    phone: "Telefon",
    email: "E-posta",
    send: "Talebi gönder",
    sent: "Talebiniz gönderildi. En kısa sürede sizinle iletişime geçeceğiz.",
    sendError: "Talep gönderilemedi. Lütfen WhatsApp üzerinden deneyin.",
    whatsapp: "WhatsApp",
    languageLabel: "Dil",
    sendLabel: "Gönder",
    roomAria: index => `${index}. oda`,
    roomLabel: count => `${count} oda`,
    guestLabel: count => `${count} kişi`,
    nightLabel: count => `${count} gece`,
    filters: { economy: "Ekonomik", noStairs: "Merdivensiz", ground: "Zemin kat", first: "Birinci kat", kitchen: "Mutfak", garden: "Bahçe", balcony: "Balkon", family: "Aile" },
  },
} satisfies Record<Language, Copy>;

const WHATSAPP_NUMBER = "306944474226";
const BREAKFAST_IMAGE = "/images/welcome/voulamandis-breakfast.jpg";
const FILTER_KEYS: Filter[] = ["economy", "noStairs", "ground", "first", "kitchen", "garden", "balcony", "family"];
type BadgeKey = "bestForTwo" | "lowestPrice" | "directDiscount" | "noStairs" | "fullKitchen" | "moreSpace" | "family" | "balcony" | "matchesPreferences";

const SHORT_SELECT: Record<Language, string> = { el: "Επιλογή", en: "Select", de: "Wählen", fr: "Choisir", it: "Scegli", es: "Elegir", tr: "Seç" };
const SPLIT_STAY_TITLE: Record<Language, string> = { el: "Συνδυαστική διαμονή", en: "Split stay", de: "Geteilter Aufenthalt", fr: "Séjour partagé", it: "Soggiorno diviso", es: "Estancia dividida", tr: "Bölünmüş konaklama" };
const SPLIT_STAY_BADGE: Record<Language, string> = { el: "1 αλλαγή δωματίου", en: "1 room change", de: "1 Zimmerwechsel", fr: "1 changement de chambre", it: "1 cambio camera", es: "1 cambio de habitación", tr: "1 oda değişikliği" };
const BADGE_COPY: Record<Language, Record<BadgeKey, string>> = {
  el: { bestForTwo: "Καλύτερη επιλογή για 2 άτομα", lowestPrice: "Χαμηλότερη τιμή", directDiscount: "10% έκπτωση απευθείας", noStairs: "Χωρίς σκάλες", fullKitchen: "Πλήρης κουζίνα", moreSpace: "Περισσότερος χώρος", family: "Ιδανικό για οικογένειες", balcony: "Ιδιωτικό μπαλκόνι", matchesPreferences: "Ταιριάζει στις προτιμήσεις σας" },
  en: { bestForTwo: "Best choice for 2 guests", lowestPrice: "Lowest price", directDiscount: "10% direct discount", noStairs: "No stairs", fullKitchen: "Full kitchen", moreSpace: "More space", family: "Ideal for families", balcony: "Private balcony", matchesPreferences: "Matches your preferences" },
  de: { bestForTwo: "Beste Wahl für 2 Gäste", lowestPrice: "Niedrigster Preis", directDiscount: "10 % Direktrabatt", noStairs: "Keine Treppen", fullKitchen: "Voll ausgestattete Küche", moreSpace: "Mehr Platz", family: "Ideal für Familien", balcony: "Privater Balkon", matchesPreferences: "Passt zu Ihren Wünschen" },
  fr: { bestForTwo: "Meilleur choix pour 2 personnes", lowestPrice: "Prix le plus bas", directDiscount: "10 % de remise directe", noStairs: "Sans escaliers", fullKitchen: "Cuisine complète", moreSpace: "Plus d’espace", family: "Idéal pour les familles", balcony: "Balcon privé", matchesPreferences: "Correspond à vos préférences" },
  it: { bestForTwo: "Scelta migliore per 2 ospiti", lowestPrice: "Prezzo più basso", directDiscount: "10% di sconto diretto", noStairs: "Senza scale", fullKitchen: "Cucina completa", moreSpace: "Più spazio", family: "Ideale per famiglie", balcony: "Balcone privato", matchesPreferences: "Corrisponde alle preferenze" },
  es: { bestForTwo: "Mejor opción para 2 personas", lowestPrice: "Precio más bajo", directDiscount: "10% de descuento directo", noStairs: "Sin escaleras", fullKitchen: "Cocina completa", moreSpace: "Más espacio", family: "Ideal para familias", balcony: "Balcón privado", matchesPreferences: "Coincide con tus preferencias" },
  tr: { bestForTwo: "2 kişi için en iyi seçenek", lowestPrice: "En düşük fiyat", directDiscount: "%10 doğrudan indirim", noStairs: "Merdivensiz", fullKitchen: "Tam donanımlı mutfak", moreSpace: "Daha geniş alan", family: "Aileler için ideal", balcony: "Özel balkon", matchesPreferences: "Tercihlerinize uygun" },
};

function detectLanguage(): Language {
  if (typeof window === "undefined") return "en";
  const supported = LANGUAGES.map(([value]) => value);
  const query = new URLSearchParams(window.location.search).get("lang")?.toLowerCase().split("-")[0];
  const pathLanguage = window.location.pathname.split("/").filter(Boolean)[0]?.toLowerCase();
  const documentLanguage = document.documentElement.lang?.toLowerCase().split("-")[0];
  const detected = [query, pathLanguage, documentLanguage].find(value => supported.includes(value as Language));
  return (detected as Language) || "en";
}

function id() {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function isoDate(year: number, month: number, day: number): string | null {
  const date = new Date(Date.UTC(year, month - 1, day));
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) return null;
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function parseNumericDates(value: string, checkin?: string): { checkin?: string; checkout?: string } | null {
  const matches = [...value.matchAll(/(?:^|\D)(\d{1,2})[\/.-](\d{1,2})(?:[\/.-](\d{2,4}))?(?=\D|$)/g)];
  if (!matches.length) return null;

  const today = new Date();
  const todayIso = isoDate(today.getFullYear(), today.getMonth() + 1, today.getDate()) || "";
  const resolved: string[] = [];

  for (let index = 0; index < Math.min(2, matches.length); index += 1) {
    const match = matches[index];
    const day = Number(match[1]);
    const month = Number(match[2]);
    let year = match[3] ? Number(match[3]) : 0;
    if (year > 0 && year < 100) year += 2000;

    const reference = index === 0 ? checkin : resolved[0];
    if (!year) {
      if (reference) {
        year = Number(reference.slice(0, 4));
        const referenceMonth = Number(reference.slice(5, 7));
        if (month < referenceMonth && referenceMonth - month >= 6) year += 1;
      } else {
        year = today.getFullYear();
        const candidate = isoDate(year, month, day);
        if (candidate && candidate < todayIso) year += 1;
      }
    }

    const candidate = isoDate(year, month, day);
    if (!candidate) return null;
    resolved.push(candidate);
  }

  if (checkin) return { checkout: resolved[resolved.length - 1] };
  return { checkin: resolved[0], checkout: resolved[1] };
}

function nightsBetween(a: string, b: string) {
  return Math.round((new Date(`${b}T12:00:00Z`).getTime() - new Date(`${a}T12:00:00Z`).getTime()) / 86400000);
}

function money(value: number, language: Language) {
  const locale = { el: "el-GR", en: "en-GB", de: "de-DE", fr: "fr-FR", it: "it-IT", es: "es-ES", tr: "tr-TR" }[language];
  return new Intl.NumberFormat(locale, { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(value);
}

function preferenceScore(offer: Offer, filters: Filter[]) {
  const text = `${offer.name} ${offer.category} ${offer.floor} ${(offer.features || []).join(" ")}`.toLowerCase();
  const tests: Record<Filter, RegExp> = {
    economy: /econom|οικονομ|économ|preisgünst|ekonom/,
    noStairs: /χωρίς σκάλ|no stairs|keine treppen|sans escaliers|senza scale|sin escaleras|merdivensiz/,
    ground: /ισόγει|ground floor|erdgeschoss|rez-de-chaussée|piano terra|planta baja|zemin kat/,
    first: /πρώτ|first floor|erster stock|premier étage|primo piano|primera planta|birinci kat/,
    kitchen: /kitchen|κουζ|küche|cuisine|cucina|mutfak/,
    garden: /garden|κήπ|αυλ|garten|jardin|giardino|patio|bahçe|avlu/,
    balcony: /balcon|μπαλκόν|balkon/,
    family: /family|οικογεν|familien|familial|familiare|familiar|aile/,
  };
  return filters.reduce((total, filter) => total + (tests[filter].test(text) ? 10 : 0), 0);
}

function offerRoomNumber(offer: Offer) {
  const direct = Number(offer.roomNumber);
  if (Number.isInteger(direct) && direct > 0) return direct;
  const match = offer.name.match(/(\d{1,2})/);
  return match ? Number(match[1]) : 99;
}

function roomTier(offer: Offer) {
  if (offer.splitStay) return 4;
  const room = offerRoomNumber(offer);
  if (room === 2 || room === 6) return 0;
  if (room === 5 || room === 7) return 1;
  if (room === 1 || room === 3 || room === 4) return 2;
  if (room >= 8 && room <= 10) return 3;
  return 4;
}

function roomSequence(offer: Offer) {
  const order = [2, 6, 5, 7, 1, 3, 4, 8, 9, 10];
  const index = order.indexOf(offerRoomNumber(offer));
  return index >= 0 ? index : 99;
}

function businessPreferenceScore(offer: Offer, filters: Filter[]) {
  const room = offerRoomNumber(offer);
  let score = preferenceScore(offer, filters);
  for (const filter of filters) {
    if (filter === "economy" && (room === 2 || room === 6)) score += 40;
    if ((filter === "noStairs" || filter === "ground") && [5, 6, 7].includes(room)) score += 40;
    if (filter === "first" && [1, 2, 3, 4].includes(room)) score += 40;
    if (filter === "kitchen" && room >= 8 && room <= 10) score += 45;
    if (filter === "kitchen" && (room === 3 || room === 4)) score += 18;
    if (filter === "family" && room >= 8 && room <= 10) score += 45;
    if (filter === "balcony" && (room === 1 || room === 4)) score += 40;
    if (filter === "garden" && (room === 5 || room === 7)) score += 40;
  }
  return score;
}

function categoryWithFloor(offer: Offer) {
  if (offer.splitStay) return offer.category;
  const room = offerRoomNumber(offer);
  if (room >= 5) return offer.category;
  const floor = offer.floor.split(" · ")[0]?.trim();
  return floor ? offer.category + " · " + floor : offer.category;
}

function accessLabel(offer: Offer) {
  if (offer.splitStay) return offer.floor;
  const parts = offer.floor.split(" · ").map(part => part.trim()).filter(Boolean);
  return parts.length > 1 ? parts.slice(1).join(" · ") : offer.floor;
}

function offerDisplayName(offer: Offer, language: Language) {
  if (!offer.splitStay) return offer.name;
  return offer.name.replace(/^Split Stay/i, SPLIT_STAY_TITLE[language]);
}

function sellingBadges(offer: Offer, allOffers: Offer[], filters: Filter[], guests: number, language: Language) {
  if (offer.splitStay) return [SPLIT_STAY_BADGE[language]];
  const copy = BADGE_COPY[language];
  const room = offerRoomNumber(offer);
  const eligible = allOffers.filter(item => !item.maxGuests || item.maxGuests >= guests);
  const lowestPrice = eligible.length ? Math.min(...eligible.map(item => item.directTotal)) : offer.directTotal;
  const economyForTwo = eligible
    .filter(item => [2, 6].includes(offerRoomNumber(item)))
    .sort((a, b) => a.directTotal - b.directTotal || roomSequence(a) - roomSequence(b));
  const badges: string[] = [];

  if (guests === 2 && economyForTwo[0] && offerRoomNumber(economyForTwo[0]) === room) badges.push(copy.bestForTwo);
  if (Math.abs(offer.directTotal - lowestPrice) < 0.01) badges.push(copy.lowestPrice);
  if (filters.length > 0 && businessPreferenceScore(offer, filters) > 0) badges.push(copy.matchesPreferences);
  if ([5, 6, 7].includes(room)) badges.push(copy.noStairs);
  if (room >= 8 && room <= 10) badges.push(copy.fullKitchen, guests >= 3 ? copy.family : copy.moreSpace);
  if (room === 1 || room === 4) badges.push(copy.balcony);
  badges.push(copy.directDiscount);

  return [...new Set(badges)].slice(0, 2);
}

export function AiRoomChatPreview() {
  const [language, setLanguage] = useState<Language>("en");
  const copy = COPY[language];
  const [step, setStep] = useState<Step>("checkin");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [checkin, setCheckin] = useState("");
  const [checkout, setCheckout] = useState("");
  const [roomCount, setRoomCount] = useState(1);
  const [groups, setGroups] = useState<number[]>([]);
  const [guestIndex, setGuestIndex] = useState(0);
  const [filters, setFilters] = useState<Filter[]>([]);
  const [offers, setOffers] = useState<Offer[][]>([]);
  const [activeGroup, setActiveGroup] = useState(0);
  const [cardIndex, setCardIndex] = useState(0);
  const [choices, setChoices] = useState<Choice[]>([]);
  const [breakfast, setBreakfast] = useState(false);
  const [typing, setTyping] = useState(false);
  const [error, setError] = useState("");
  const [detail, setDetail] = useState<Offer | null>(null);
  const [photo, setPhoto] = useState(0);
  const [contact, setContact] = useState({ name: "", phone: "", email: "" });
  const [sendStatus, setSendStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const feedRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  const nights = checkin && checkout ? Math.max(0, nightsBetween(checkin, checkout)) : 0;
  const chosenKeys = useMemo(() => new Set(choices.map(choice => `${choice.offer.roomId}:${choice.offer.unitId}`)), [choices]);
  const activeGuests = groups[activeGroup] || 0;
  const visibleOffers = useMemo(() => [...(offers[activeGroup] || [])]
    .filter(offer => !chosenKeys.has(`${offer.roomId}:${offer.unitId}`))
    .filter(offer => !offer.maxGuests || offer.maxGuests >= activeGuests)
    .sort((a, b) => {
      const preferenceDifference = businessPreferenceScore(b, filters) - businessPreferenceScore(a, filters);
      if (preferenceDifference) return preferenceDifference;
      const tierDifference = roomTier(a) - roomTier(b);
      if (tierDifference) return tierDifference;
      const priceDifference = a.directTotal - b.directTotal;
      if (priceDifference) return priceDifference;
      return roomSequence(a) - roomSequence(b);
    }),
  [offers, activeGroup, activeGuests, chosenKeys, filters]);
  const roomTotal = choices.reduce((total, choice) => total + choice.offer.directTotal, 0);
  const guestTotal = groups.reduce((total, guests) => total + guests, 0);
  const breakfastTotal = breakfast ? guestTotal * nights * 12 : 0;

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    const detected = detectLanguage();
    setLanguage(detected);
    setMessages([{ id: id(), role: "assistant", content: COPY[detected].welcome }]);
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    document.body.dataset.aiRoomStep = step;
    return () => { delete document.body.dataset.aiRoomStep; };
  }, [step]);

  useEffect(() => {
    setCardIndex(0);
    carouselRef.current?.scrollTo({ left: 0, behavior: "auto" });
  }, [activeGroup, filters, offers]);

  useEffect(() => {
    const viewport = window.visualViewport;
    const sync = () => document.documentElement.style.setProperty("--ai-chat-height", `${Math.round(viewport?.height || window.innerHeight)}px`);
    sync();
    viewport?.addEventListener("resize", sync);
    window.addEventListener("resize", sync);
    return () => {
      viewport?.removeEventListener("resize", sync);
      window.removeEventListener("resize", sync);
      document.documentElement.style.removeProperty("--ai-chat-height");
    };
  }, []);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => feedRef.current?.scrollTo({ top: feedRef.current.scrollHeight, behavior: "smooth" }));
    return () => window.cancelAnimationFrame(frame);
  }, [messages, step, typing, activeGroup, sendStatus]);

  const addMessage = (role: Message["role"], content: string) => {
    setMessages(current => [...current, { id: id(), role, content }]);
  };

  function restart(nextLanguage = language) {
    setLanguage(nextLanguage);
    setStep("checkin");
    setMessages([{ id: id(), role: "assistant", content: COPY[nextLanguage].welcome }]);
    setInput("");
    setCheckin("");
    setCheckout("");
    setRoomCount(1);
    setGroups([]);
    setGuestIndex(0);
    setFilters([]);
    setOffers([]);
    setActiveGroup(0);
    setCardIndex(0);
    setChoices([]);
    setBreakfast(false);
    setError("");
    setDetail(null);
    setContact({ name: "", phone: "", email: "" });
    setSendStatus("idle");
  }

  function changeLanguage(nextLanguage: Language) {
    const url = new URL(window.location.href);
    url.searchParams.set("lang", nextLanguage);
    window.history.replaceState(window.history.state, "", url);
    restart(nextLanguage);
  }

  async function interpretDate(value: string, currentStep: "checkin" | "checkout") {
    const numeric = parseNumericDates(value, currentStep === "checkout" ? checkin : undefined);
    if (numeric) return numeric;

    const response = await fetch("/api/ai-assistant/smart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [...messages, { role: "user", content: value }],
        search: { checkin: checkin || undefined, checkout: checkout || undefined },
        language,
      }),
    });
    const payload = await response.json().catch(() => null);
    if (!response.ok || !payload) throw new Error("date interpretation failed");
    return payload.search as { checkin?: string; checkout?: string } | undefined;
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    const value = input.trim();
    if (!value || !["checkin", "checkout", "rooms", "guests"].includes(step)) return;
    setInput("");
    setError("");
    addMessage("user", value);

    if (step === "checkin" || step === "checkout") {
      const previous = step;
      setTyping(true);
      try {
        const search = await interpretDate(value, previous);
        const nextCheckin = search?.checkin || checkin;
        const nextCheckout = search?.checkout || checkout;

        if (previous === "checkin" && !nextCheckin) throw new Error("missing checkin");
        if (previous === "checkout" && !nextCheckout) throw new Error("missing checkout");

        const today = new Date();
        const minimumCheckin = isoDate(today.getFullYear(), today.getMonth() + 1, today.getDate()) || "";
        if (nextCheckin && minimumCheckin && nextCheckin < minimumCheckin) {
          setCheckin("");
          setCheckout("");
          setStep("checkin");
          setError(copy.invalidPastDate);
          return;
        }

        if (nextCheckin) setCheckin(nextCheckin);
        if (nextCheckout) setCheckout(nextCheckout);

        if (nextCheckin && nextCheckout) {
          if (nightsBetween(nextCheckin, nextCheckout) < 1) {
            setCheckout("");
            setStep("checkout");
            setError(copy.invalidCheckout);
            return;
          }
          setStep("rooms");
          addMessage("assistant", copy.rooms);
        } else {
          setStep("checkout");
          addMessage("assistant", copy.checkout);
        }
      } catch {
        setStep(previous);
        setError(copy.invalidDate);
      } finally {
        setTyping(false);
      }
      return;
    }

    const number = Number(value.match(/\d+/)?.[0]);
    if (step === "rooms") {
      if (!Number.isInteger(number) || number < 1 || number > 3) {
        setError(copy.invalidRooms);
        return;
      }
      chooseRoomCount(number, false);
      return;
    }

    if (!Number.isInteger(number) || number < 1 || number > 5) {
      setError(copy.invalidGuests);
      return;
    }
    chooseGuestCount(number, false);
  }

  function chooseRoomCount(value: number, addUser = true) {
    if (addUser) addMessage("user", copy.roomLabel(value));
    setRoomCount(value);
    setGroups([]);
    setGuestIndex(0);
    setStep("guests");
    addMessage("assistant", copy.guests(1));
  }

  function chooseGuestCount(value: number, addUser = true) {
    if (addUser) addMessage("user", copy.guestLabel(value));
    const next = [...groups, value];
    setGroups(next);
    if (guestIndex + 1 < roomCount) {
      setGuestIndex(index => index + 1);
      addMessage("assistant", copy.guests(guestIndex + 2));
    } else {
      setStep("preferences");
      addMessage("assistant", copy.preferences);
    }
  }

  async function searchRooms() {
    setStep("searching");
    setTyping(true);
    setError("");
    try {
      const results = await Promise.all(groups.map(async guests => {
        const response = await fetch("/api/ai-assistant/smart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [{ role: "user", content: `Check live availability from ${checkin} to ${checkout} for ${guests} guests.` }],
            search: { checkin, checkout, guests },
            language,
          }),
        });
        const payload = await response.json().catch(() => null);
        if (!response.ok || !payload) throw new Error("availability failed");
        return Array.isArray(payload.offers) ? payload.offers as Offer[] : [];
      }));

      setOffers(results);
      setActiveGroup(0);
      setCardIndex(0);
      if (!(results[0] || []).length) {
        setStep("unavailable");
        addMessage("assistant", copy.unavailable);
      } else {
        setStep("selecting");
        addMessage("assistant", copy.choose(1, groups[0]));
      }
    } catch {
      setStep("preferences");
      setError(copy.availabilityError);
    } finally {
      setTyping(false);
    }
  }

  function selectOffer(offer: Offer) {
    const nextChoices = [...choices, { group: activeGroup + 1, guests: groups[activeGroup], offer }];
    setChoices(nextChoices);
    setDetail(null);
    addMessage("user", `${copy.selected}: ${offerDisplayName(offer, language)}`);

    if (activeGroup + 1 < roomCount) {
      const nextGroup = activeGroup + 1;
      const nextKeys = new Set(nextChoices.map(choice => `${choice.offer.roomId}:${choice.offer.unitId}`));
      const available = (offers[nextGroup] || [])
        .filter(item => !nextKeys.has(`${item.roomId}:${item.unitId}`))
        .filter(item => !item.maxGuests || item.maxGuests >= groups[nextGroup]);
      if (!available.length) {
        setStep("unavailable");
        addMessage("assistant", copy.unavailable);
        return;
      }
      setActiveGroup(nextGroup);
      setCardIndex(0);
      addMessage("assistant", copy.choose(nextGroup + 1, groups[nextGroup]));
    } else {
      setStep("breakfast");
      addMessage("assistant", copy.breakfast);
    }
  }

  function chooseBreakfast(value: boolean) {
    setBreakfast(value);
    addMessage("user", value ? copy.yesBreakfast : copy.noBreakfast);
    setStep("complete");
    addMessage("assistant", copy.summary);
  }

  const contactSummary = [
    `${checkin} → ${checkout}`,
    copy.guestLabel(guestTotal),
    ...choices.map(choice => `${offerDisplayName(choice.offer, language)}: ${money(choice.offer.directTotal, language)}`),
    ...(breakfast ? [`${copy.breakfastLabel}: ${money(breakfastTotal, language)}`] : []),
    `${copy.total}: ${money(roomTotal + breakfastTotal, language)}`,
  ].join("\n");
  const contactMessage = `${copy.contactTitle}\n\n${contactSummary}\n\n${copy.name}: ${contact.name}\n${copy.phone}: ${contact.phone || "—"}\n${copy.email}: ${contact.email || "—"}`;
  const canSend = Boolean(contact.name.trim() && (contact.phone.trim() || contact.email.trim()));

  async function sendRequest() {
    if (!canSend || sendStatus === "sending") return;
    setSendStatus("sending");
    try {
      const response = await fetch("/api/ai-assistant/summary-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject: `AI Room Finder — ${contact.name}`, message: contactMessage, guest: contact }),
      });
      if (!response.ok) throw new Error("send failed");
      setSendStatus("sent");
    } catch {
      setSendStatus("error");
    }
  }

  function scrollToCard(index: number) {
    const normalized = Math.max(0, Math.min(index, visibleOffers.length - 1));
    setCardIndex(normalized);
    const card = carouselRef.current?.children.item(normalized) as HTMLElement | null;
    if (card && carouselRef.current) carouselRef.current.scrollTo({ left: card.offsetLeft, behavior: "smooth" });
  }

  const inputEnabled = ["checkin", "checkout", "rooms", "guests"].includes(step) && !typing;
  const disabledPlaceholder = step === "selecting" ? copy.select : copy.chooseAbove;
  const homeHref = language === "en" ? "/" : "/" + language + "/";

  return (
    <main data-ai-room-chat="true" data-ai-step={step} className="flex h-[var(--ai-chat-height,100dvh)] flex-col overflow-hidden bg-[#f6f2eb] text-[#29251f]">
      <style jsx global>{`
        @keyframes ai-message-in { from { opacity: 0; transform: translateY(10px) scale(.985); } to { opacity: 1; transform: none; } }
        @keyframes ai-sheet-in { from { transform: translateY(100%); } to { transform: translateY(0); } }
        @keyframes ai-dot { 0%, 60%, 100% { transform: translateY(0); opacity: .35; } 30% { transform: translateY(-4px); opacity: 1; } }
        .ai-message-in { animation: ai-message-in .24s cubic-bezier(.22,.8,.3,1) both; }
        .ai-sheet-in { animation: ai-sheet-in .3s cubic-bezier(.22,.8,.3,1) both; }
        .ai-scroll { scrollbar-width: thin; scrollbar-color: #d4c9ba transparent; }
        .ai-hide-scrollbar { scrollbar-width: none; -ms-overflow-style: none; }
        .ai-hide-scrollbar::-webkit-scrollbar { display: none; }
        #INDmenu-btn { top: auto !important; right: 8px !important; bottom: 88px !important; transform: scale(.82) !important; transform-origin: bottom right !important; }
        body[data-ai-room-step="selecting"] #INDmenu-btn { display: none !important; }
        @media (max-width: 560px) {
          .ai-chat-header { gap: .45rem; padding-left: .45rem; padding-right: .45rem; }
          .ai-chat-avatar { width: 2.5rem !important; height: 2.5rem !important; }
          .ai-chat-title { font-size: .9rem !important; letter-spacing: -.01em; }
          .ai-chat-status { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
          .ai-status-live { display: none; }
          .ai-language-select { width: 5.2rem; min-width: 5.2rem; padding-left: .6rem !important; padding-right: .2rem !important; }
        }
      `}</style>

      <header className="relative z-30 shrink-0 border-b border-[#ddd4c8] bg-[#fbf8f3]/95 backdrop-blur-xl">
        <div className="ai-chat-header mx-auto flex h-[68px] max-w-3xl items-center gap-3 px-3 sm:px-5">
          <a href={homeHref} aria-label={copy.back} title={copy.back} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xl transition hover:bg-[#eee7dc] active:scale-95">←</a>
          <div className="ai-chat-avatar relative h-11 w-11 shrink-0 overflow-hidden rounded-full ring-2 ring-white shadow-sm">
            <Image src="/images/welcome/voulamandis-welcome-hero.webp" alt="Voulamandis House" fill sizes="44px" className="object-cover" />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="ai-chat-title truncate text-[16px] font-bold">Voulamandis House</h1>
            <div className="ai-chat-status mt-0.5 flex items-center gap-1.5 text-xs text-[#746b60]"><span className="inline-block h-2 w-2 shrink-0 rounded-full bg-[#718b52]" /><span>{copy.online}</span><span className="ai-status-live"> · {copy.live}</span></div>
          </div>
          <select value={language} onChange={event => changeLanguage(event.target.value as Language)} aria-label={copy.languageLabel} className="ai-language-select h-9 rounded-full border border-[#d8cec1] bg-white px-2 text-xs font-bold outline-none transition focus:border-[#697451]">
            {LANGUAGES.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
          <button type="button" onClick={() => restart()} aria-label={copy.newSearch} title={copy.newSearch} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg transition hover:bg-[#eee7dc] active:scale-95">↻</button>
        </div>
      </header>

      {(checkin || groups.length > 0) && (
        <div className="relative z-20 shrink-0 border-b border-[#e5ddd2] bg-[#f9f5ef] px-3 py-2">
          <div className="ai-hide-scrollbar mx-auto flex max-w-3xl gap-2 overflow-x-auto text-xs font-semibold text-[#625b52]">
            {checkin && <span className="whitespace-nowrap rounded-full border border-[#ddd3c6] bg-white px-3 py-1.5">📅 {checkin}{checkout ? ` → ${checkout}` : ""}</span>}
            {groups.length > 0 && <span className="whitespace-nowrap rounded-full border border-[#ddd3c6] bg-white px-3 py-1.5">👥 {copy.guestLabel(guestTotal)}</span>}
            {groups.length > 0 && <span className="whitespace-nowrap rounded-full border border-[#ddd3c6] bg-white px-3 py-1.5">🛏️ {copy.roomLabel(roomCount)}</span>}
          </div>
        </div>
      )}

      <div ref={feedRef} data-ai-chat-scroll="true" aria-busy={typing} className="ai-scroll min-h-0 flex-1 overflow-y-auto overscroll-contain scroll-smooth">
        <div data-ai-conversation-feed="true" aria-live="polite" aria-relevant="additions text" className="mx-auto flex min-h-full max-w-3xl flex-col px-3 pb-7 pt-5 sm:px-5">
          <div className="space-y-3.5">
            {messages.map(message => (
              <div key={message.id} className={`ai-message-in flex items-end gap-2 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                {message.role === "assistant" && (
                  <div className="relative mb-1 h-8 w-8 shrink-0 overflow-hidden rounded-full ring-1 ring-[#d7cdc0]">
                    <Image src="/images/welcome/voulamandis-welcome-hero.webp" alt="" fill sizes="32px" className="object-cover" />
                  </div>
                )}
                <div className={`max-w-[84%] whitespace-pre-line px-4 py-3 text-[15px] leading-6 shadow-sm sm:max-w-[72%] ${message.role === "user" ? "rounded-[20px] rounded-br-[6px] bg-[#6b604f] text-white" : "rounded-[20px] rounded-bl-[6px] border border-[#dfd6ca] bg-white text-[#302b25]"}`}>
                  {message.content}
                </div>
              </div>
            ))}

            {typing && (
              <div className="ai-message-in flex items-end gap-2">
                <div className="relative mb-1 h-8 w-8 shrink-0 overflow-hidden rounded-full ring-1 ring-[#d7cdc0]"><Image src="/images/welcome/voulamandis-welcome-hero.webp" alt="" fill sizes="32px" className="object-cover" /></div>
                <div className="rounded-[20px] rounded-bl-[6px] border border-[#dfd6ca] bg-white px-4 py-3 shadow-sm">
                  <span className="sr-only">{copy.searching}</span>
                  <div className="flex h-5 items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-[#746b60] [animation:ai-dot_1.1s_infinite]" /><span className="h-1.5 w-1.5 rounded-full bg-[#746b60] [animation:ai-dot_1.1s_.15s_infinite]" /><span className="h-1.5 w-1.5 rounded-full bg-[#746b60] [animation:ai-dot_1.1s_.3s_infinite]" /></div>
                </div>
              </div>
            )}

            {step === "rooms" && <QuickReplies values={[1, 2, 3]} onSelect={chooseRoomCount} label={copy.roomLabel} />}
            {step === "guests" && <QuickReplies values={[1, 2, 3, 4, 5]} onSelect={chooseGuestCount} label={copy.guestLabel} />}

            {step === "preferences" && (
              <section className="ai-message-in ml-10 rounded-[22px] border border-[#dfd6ca] bg-white p-4 shadow-sm">
                <div className="flex flex-wrap gap-2">
                  {FILTER_KEYS.map(filter => (
                    <button type="button" key={filter} onClick={() => setFilters(current => current.includes(filter) ? current.filter(item => item !== filter) : [...current, filter])} className={`rounded-full border px-3 py-2 text-xs font-bold transition duration-200 active:scale-95 ${filters.includes(filter) ? "border-[#66714f] bg-[#66714f] text-white shadow-sm" : "border-[#d9cfc2] bg-[#fbf9f6] text-[#61594f] hover:border-[#9b907f]"}`}>
                      {copy.filters[filter]}
                    </button>
                  ))}
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <button type="button" onClick={() => { setFilters([]); void searchRooms(); }} className="min-h-12 rounded-2xl border border-[#d9cfc2] bg-white px-3 text-sm font-bold transition active:scale-[.98]">{copy.noPreference}</button>
                  <button type="button" onClick={() => void searchRooms()} className="min-h-12 rounded-2xl bg-[#66714f] px-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#596244] active:scale-[.98]">{copy.showRooms}</button>
                </div>
              </section>
            )}

            {step === "selecting" && visibleOffers.length > 0 && (
              <section className="ai-message-in -mx-3 sm:mx-0 sm:ml-10">
                <div className="mb-2 px-4 text-xs font-bold text-[#6f665b] sm:px-1">{copy.choose(activeGroup + 1, groups[activeGroup])}</div>
                <div
                  ref={carouselRef}
                  data-ai-room-carousel="true"
                  onScroll={event => {
                    const container = event.currentTarget;
                    const cards = Array.from(container.children) as HTMLElement[];
                    let nearest = 0;
                    let distance = Number.POSITIVE_INFINITY;
                    cards.forEach((card, index) => {
                      const nextDistance = Math.abs(card.offsetLeft - container.scrollLeft);
                      if (nextDistance < distance) { distance = nextDistance; nearest = index; }
                    });
                    if (nearest !== cardIndex) setCardIndex(nearest);
                  }}
                  className="ai-hide-scrollbar flex items-start snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain scroll-smooth px-3 pb-2 sm:px-0"
                >
                  {visibleOffers.map((offer, index) => (
                    <article key={offer.roomId + ":" + offer.unitId} className="min-w-[88%] self-start snap-center overflow-hidden rounded-[24px] border border-[#dcd2c5] bg-white shadow-[0_14px_38px_rgba(70,55,35,.10)] sm:min-w-[68%]">
                      <div className="relative h-44 sm:h-56">
                        <Image src={offer.image} alt={offerDisplayName(offer, language)} fill sizes="(max-width:640px) 88vw, 520px" className="object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                        <span className="absolute right-3 top-3 rounded-full bg-white/92 px-2.5 py-1 text-xs font-bold shadow-sm backdrop-blur">{index + 1}/{visibleOffers.length}</span>
                      </div>
                      <div className="p-3.5 sm:p-5">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0"><h2 className="truncate text-[1.35rem] font-bold">{offerDisplayName(offer, language)}</h2><p className="mt-0.5 text-sm text-[#746b60]">{categoryWithFloor(offer)}</p></div>
                          <div className="shrink-0 text-right"><p className="text-xs text-[#b05252] line-through">{money(offer.originalTotal, language)}</p><p className="text-xl font-black text-[#5f7448]">{money(offer.directTotal, language)}</p></div>
                        </div>
                        {sellingBadges(offer, visibleOffers, filters, activeGuests, language).length > 0 && <div className="mt-2 flex flex-wrap gap-1.5">{sellingBadges(offer, visibleOffers, filters, activeGuests, language).map((badge, badgeIndex) => <span key={badge} className={badgeIndex === 0 ? "rounded-md bg-[#53643f] px-2.5 py-1 text-[11px] font-bold text-white" : "rounded-md bg-[#edf2e6] px-2.5 py-1 text-[11px] font-bold text-[#53643f]"}>{badgeIndex === 0 ? "✓ " : ""}{badge}</span>)}</div>}
                        <div className="mt-2 flex flex-wrap gap-1.5">{[accessLabel(offer), ...(offer.features || []).slice(0, 3)].filter(Boolean).map(item => <span key={item} className="rounded-full bg-[#f1ede7] px-2.5 py-1 text-[11px] font-semibold text-[#665e55]">{item}</span>)}</div>
                        {offer.saving > 0 && <p className="mt-2 text-sm font-bold text-[#5f7448]">{copy.saving}: {money(offer.saving, language)}</p>}
                        <div className="mt-3 grid grid-cols-2 gap-2">
                          <button type="button" onClick={() => { setDetail(offer); setPhoto(0); }} className="min-h-11 rounded-2xl border border-[#d8cec1] bg-white px-3 text-sm font-bold transition active:scale-[.98]">{copy.details}</button>
                          <button type="button" onClick={() => selectOffer(offer)} className="min-h-11 rounded-2xl bg-[#66714f] px-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#596244] active:scale-[.98]"><span className="sm:hidden">{SHORT_SELECT[language]}</span><span className="hidden sm:inline">{copy.select}</span></button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
                {visibleOffers.length > 1 && <div className="mt-1 flex justify-center gap-1.5">{visibleOffers.map((_, index) => <button type="button" aria-label={copy.roomAria(index + 1)} key={index} onClick={() => scrollToCard(index)} className={"h-1.5 rounded-full transition-all " + (index === cardIndex ? "w-6 bg-[#66714f]" : "w-1.5 bg-[#cfc5b8]")} />)}</div>}
              </section>
            )}

            {step === "breakfast" && (
              <section className="ai-message-in ml-10 overflow-hidden rounded-[22px] border border-[#dcd2c5] bg-white shadow-[0_12px_32px_rgba(70,55,35,.10)]">
                <div className="relative h-36 w-full sm:h-44"><Image src={BREAKFAST_IMAGE} alt={copy.breakfastAlt} fill sizes="(max-width:640px) calc(100vw - 72px), 620px" className="object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" /></div>
                <div className="flex flex-wrap gap-2 p-3">
                  <button type="button" onClick={() => chooseBreakfast(true)} className="rounded-full bg-[#66714f] px-4 py-2.5 text-sm font-bold text-white shadow-sm transition active:scale-95">{copy.yesBreakfast}</button>
                  <button type="button" onClick={() => chooseBreakfast(false)} className="rounded-full border border-[#d8cec1] bg-white px-4 py-2.5 text-sm font-bold transition active:scale-95">{copy.noBreakfast}</button>
                </div>
              </section>
            )}

            {step === "unavailable" && (
              <section className="ai-message-in ml-10 rounded-[22px] border border-[#dfd6ca] bg-white p-4 shadow-sm">
                <div className="grid grid-cols-2 gap-2">
                  <button type="button" onClick={() => restart()} className="min-h-12 rounded-2xl border border-[#d8cec1] font-bold">{copy.newSearch}</button>
                  <button type="button" onClick={() => window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(copy.unavailable)}`, "_blank", "noopener,noreferrer")} className="min-h-12 rounded-2xl bg-[#287d4f] font-bold text-white">{copy.whatsapp}</button>
                </div>
              </section>
            )}

            {step === "complete" && (
              <section className="ai-message-in ml-0 overflow-hidden rounded-[26px] border border-[#dcd2c5] bg-white shadow-[0_16px_45px_rgba(70,55,35,.10)] sm:ml-10">
                <div className="border-b border-[#eee7de] bg-[#faf7f2] p-4">
                  <div className="flex items-center justify-between gap-3"><h2 className="text-lg font-black">{copy.summary}</h2><button type="button" onClick={() => restart()} className="shrink-0 text-xs font-bold underline underline-offset-4">{copy.newSearch}</button></div>
                  <p className="mt-2 text-sm text-[#746b60]">📅 {checkin} → {checkout} · {copy.nightLabel(nights)}</p>
                </div>
                <div className="p-4">
                  {choices.map(choice => (
                    <div key={choice.group} className="flex items-center gap-3 border-b border-[#eee7de] py-3 first:pt-0">
                      <div className="relative h-14 w-[72px] shrink-0 overflow-hidden rounded-xl"><Image src={choice.offer.image} alt={offerDisplayName(choice.offer, language)} fill sizes="72px" className="object-cover" /></div>
                      <div className="min-w-0 flex-1"><p className="truncate font-bold">{offerDisplayName(choice.offer, language)}</p><p className="text-xs text-[#746b60]">{copy.guestLabel(choice.guests)}</p></div>
                      <strong className="text-[#5f7448]">{money(choice.offer.directTotal, language)}</strong>
                    </div>
                  ))}
                  {breakfast && <div className="flex justify-between border-b border-[#eee7de] py-3 text-sm"><span>🥐 {copy.breakfastLabel}</span><strong>{money(breakfastTotal, language)}</strong></div>}
                  <div className="mt-4 flex items-center justify-between rounded-2xl bg-[#f1ede7] p-4 text-lg"><span className="font-bold">{copy.total}</span><strong className="text-xl text-[#5f7448]">{money(roomTotal + breakfastTotal, language)}</strong></div>
                  <div className="mt-5">
                    <h3 className="font-black">{copy.contactTitle}</h3>
                    <p className="mt-1 text-sm leading-6 text-[#746b60]">{copy.contactHelp}</p>
                    <div className="mt-3 grid gap-2 sm:grid-cols-3">
                      <input value={contact.name} onChange={event => setContact(current => ({ ...current, name: event.target.value }))} placeholder={copy.name} className="min-h-12 rounded-xl border border-[#d8cec1] bg-white px-3 outline-none focus:border-[#66714f]" />
                      <input value={contact.phone} onChange={event => setContact(current => ({ ...current, phone: event.target.value }))} placeholder={copy.phone} type="tel" className="min-h-12 rounded-xl border border-[#d8cec1] bg-white px-3 outline-none focus:border-[#66714f]" />
                      <input value={contact.email} onChange={event => setContact(current => ({ ...current, email: event.target.value }))} placeholder={copy.email} type="email" className="min-h-12 rounded-xl border border-[#d8cec1] bg-white px-3 outline-none focus:border-[#66714f]" />
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <button type="button" disabled={!canSend || sendStatus === "sending"} onClick={() => void sendRequest()} className="min-h-12 rounded-2xl bg-[#66714f] px-3 text-sm font-bold text-white disabled:opacity-40">{sendStatus === "sending" ? "…" : copy.send}</button>
                      <button type="button" disabled={!canSend} onClick={() => window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(contactMessage)}`, "_blank", "noopener,noreferrer")} className="min-h-12 rounded-2xl bg-[#287d4f] px-3 text-sm font-bold text-white disabled:opacity-40">{copy.whatsapp}</button>
                    </div>
                    {sendStatus === "sent" && <p className="mt-3 rounded-xl bg-[#eef5e8] p-3 text-sm font-bold text-[#53653e]">✓ {copy.sent}</p>}
                    {sendStatus === "error" && <p className="mt-3 rounded-xl bg-red-50 p-3 text-sm font-bold text-red-700">{copy.sendError}</p>}
                  </div>
                </div>
              </section>
            )}

            {error && <p className="ai-message-in ml-10 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</p>}
          </div>
        </div>
      </div>

      <form onSubmit={submit} data-ai-chat-composer="persistent" className="relative z-30 shrink-0 border-t border-[#ddd4c8] bg-[#fbf8f3]/96 px-3 pb-[max(12px,env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl">
        <div className="mx-auto flex max-w-3xl items-end gap-2 rounded-[24px] border border-[#d8cec1] bg-white p-1.5 shadow-[0_8px_30px_rgba(70,55,35,.08)] transition focus-within:border-[#7a8562] focus-within:shadow-[0_8px_32px_rgba(70,55,35,.13)]">
          <input value={input} onChange={event => setInput(event.target.value)} disabled={!inputEnabled} placeholder={inputEnabled ? copy.placeholder : disabledPlaceholder} aria-label={inputEnabled ? copy.placeholder : disabledPlaceholder} className="min-h-11 min-w-0 flex-1 rounded-[18px] bg-transparent px-3 text-[15px] outline-none placeholder:text-[#9a9187] disabled:cursor-default" />
          <button type="submit" disabled={!inputEnabled || !input.trim()} aria-label={copy.sendLabel} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#66714f] text-lg font-black text-white shadow-sm transition hover:bg-[#596244] active:scale-90 disabled:bg-[#d8d1c7]">↑</button>
        </div>
      </form>

      {detail && (
        <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-end justify-center bg-black/45 backdrop-blur-[2px] sm:items-center sm:p-5" onClick={() => setDetail(null)}>
          <section className="ai-sheet-in flex max-h-[92dvh] w-full max-w-2xl flex-col overflow-hidden rounded-t-[30px] bg-white shadow-2xl sm:rounded-[30px]" onClick={event => event.stopPropagation()}>
            <div className="flex justify-center py-2 sm:hidden"><span className="h-1.5 w-12 rounded-full bg-[#d4cabe]" /></div>
            <div className="relative h-64 shrink-0 sm:h-72">
              <Image src={(detail.gallery?.length ? detail.gallery : [detail.image])[photo] || detail.image} alt={offerDisplayName(detail, language)} fill sizes="(max-width:640px) 100vw, 720px" className="object-cover" />
              <button type="button" onClick={() => setDetail(null)} className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-xl shadow-lg">×</button>
              {(detail.gallery?.length || 0) > 1 && (
                <>
                  <button type="button" onClick={() => setPhoto(index => (index - 1 + (detail.gallery?.length || 1)) % (detail.gallery?.length || 1))} className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-2xl shadow-lg">‹</button>
                  <button type="button" onClick={() => setPhoto(index => (index + 1) % (detail.gallery?.length || 1))} className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-2xl shadow-lg">›</button>
                </>
              )}
            </div>
            <div className="min-h-0 overflow-y-auto p-5">
              <h2 className="text-2xl font-black">{offerDisplayName(detail, language)}</h2>
              <p className="mt-1 text-sm text-[#746b60]">{detail.category}</p>
              <div className="mt-3 flex flex-wrap gap-2">{[detail.floor, ...(detail.features || [])].filter(Boolean).map(item => <span key={item} className="rounded-full bg-[#f1ede7] px-3 py-1.5 text-xs font-semibold">{item}</span>)}</div>
              <div className="mt-5 rounded-2xl bg-[#f6f2eb] p-4">
                <div className="flex justify-between gap-3"><span>{nights} × {money(detail.directTotal / Math.max(1, nights), language)} {copy.perNight}</span><strong className="text-[#5f7448]">{money(detail.directTotal, language)}</strong></div>
                {detail.saving > 0 && <div className="mt-2 flex justify-between text-sm text-[#5f7448]"><span>{copy.saving}</span><strong>{money(detail.saving, language)}</strong></div>}
              </div>
              <button type="button" onClick={() => selectOffer(detail)} className="mt-4 min-h-13 w-full rounded-2xl bg-[#66714f] px-4 py-3.5 font-black text-white shadow-sm">{copy.select}</button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}

function QuickReplies({ values, onSelect, label }: { values: number[]; onSelect: (value: number) => void; label: (value: number) => string }) {
  return (
    <div className="ai-message-in ml-10 flex flex-wrap gap-2">
      {values.map(value => (
        <button type="button" key={value} onClick={() => onSelect(value)} className="rounded-full border border-[#d8cec1] bg-white px-4 py-2.5 text-sm font-bold text-[#514a42] shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-[#8b806f] active:scale-95">
          {label(value)}
        </button>
      ))}
    </div>
  );
}
