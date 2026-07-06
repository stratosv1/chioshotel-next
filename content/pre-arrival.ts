import type { LanguageCode } from "@/lib/languages";

export type PreArrivalPageData = {
  locale: LanguageCode;
  seo: {
    canonicalPath: string;
    title: string;
    description: string;
    ogImage: string;
  };
  hero: {
    kicker: string;
    title: string;
    description: string;
    routeButton: string;
    whatsappButton: string;
  };
  booking: {
    title: string;
    description: string;
    guest: string;
    surname: string;
    room: string;
    stay: string;
    price: string;
    missingGuest: string;
    missingSurname: string;
    missingRoom: string;
    missingDates: string;
    missingPrice: string;
  };
  arrival: {
    title: string;
    text: string;
    whatsappText: string;
    whatsappButton: string;
  };
  directions: {
    kicker: string;
    title: string;
    text: string;
    importantTitle: string;
    importantText: string;
    openRoute: string;
    callUs: string;
    steps: {
      title: string;
      text: string;
    }[];
  };
  help: {
    title: string;
    text: string;
    call: string;
    whatsapp: string;
    email: string;
    sms: string;
  };
  checklist: {
    title: string;
    items: string[];
  };
};

export const preArrivalContact = {
  phoneDisplay: "+306944764654",
  phoneHref: "tel:+306944764654",
  whatsappDisplay: "+306944474226",
  whatsappBase: "https://wa.me/306944474226",
  smsDisplay: "+6944474226",
  smsBase: "sms:+6944474226",
  email: "chioshotel@gmail.com",
};

export const preArrivalDirectionsUrl =
  "https://maps.app.goo.gl/XavLJ5Lq7eumLQim7";

export const preArrivalAirportVideoUrl =
  "https://www.youtube.com/watch?v=-NJeQz8tLqI";

export const preArrivalChiosHarborDirectionsUrl =
  "https://maps.app.goo.gl/FpbnKb8z9hvF6uWc9";

export const preArrivalMestaDirectionsUrl =
  "https://maps.app.goo.gl/Td32TUBVDnNRC3NXA";

export const preArrivalMapEmbedUrl =
  "https://www.google.com/maps?q=Voulamandis%20House%20Kampos%20Chios&output=embed";

const ogImage = "/images/voulamandis-house-og.jpg";

type TextSet = {
  locale: LanguageCode;
  path: string;
  seoTitle: string;
  seoDescription: string;
  heroTitle: string;
  heroDescription: string;
  routeButton: string;
  whatsappButton: string;
  bookingTitle: string;
  bookingDescription: string;
  guest: string;
  surname: string;
  room: string;
  stay: string;
  price: string;
  missingGuest: string;
  missingSurname: string;
  missingRoom: string;
  missingDates: string;
  missingPrice: string;
  arrivalTitle: string;
  arrivalText: string;
  whatsappText: string;
  directionsKicker: string;
  directionsTitle: string;
  directionsText: string;
  importantTitle: string;
  importantText: string;
  openRoute: string;
  callUs: string;
  steps: { title: string; text: string }[];
  helpTitle: string;
  helpText: string;
  call: string;
  whatsapp: string;
  email: string;
  sms: string;
  checklistTitle: string;
  checklistItems: string[];
};

function makePage(copy: TextSet): PreArrivalPageData {
  return {
    locale: copy.locale,
    seo: {
      canonicalPath: copy.path,
      title: copy.seoTitle,
      description: copy.seoDescription,
      ogImage,
    },
    hero: {
      kicker: "Voulamandis House",
      title: copy.heroTitle,
      description: copy.heroDescription,
      routeButton: copy.routeButton,
      whatsappButton: copy.whatsappButton,
    },
    booking: {
      title: copy.bookingTitle,
      description: copy.bookingDescription,
      guest: copy.guest,
      surname: copy.surname,
      room: copy.room,
      stay: copy.stay,
      price: copy.price,
      missingGuest: copy.missingGuest,
      missingSurname: copy.missingSurname,
      missingRoom: copy.missingRoom,
      missingDates: copy.missingDates,
      missingPrice: copy.missingPrice,
    },
    arrival: {
      title: copy.arrivalTitle,
      text: copy.arrivalText,
      whatsappText: copy.whatsappText,
      whatsappButton: copy.whatsappButton,
    },
    directions: {
      kicker: copy.directionsKicker,
      title: copy.directionsTitle,
      text: copy.directionsText,
      importantTitle: copy.importantTitle,
      importantText: copy.importantText,
      openRoute: copy.openRoute,
      callUs: copy.callUs,
      steps: copy.steps,
    },
    help: {
      title: copy.helpTitle,
      text: copy.helpText,
      call: copy.call,
      whatsapp: copy.whatsapp,
      email: copy.email,
      sms: copy.sms,
    },
    checklist: {
      title: copy.checklistTitle,
      items: copy.checklistItems,
    },
  };
}

const en: TextSet = {
  locale: "en",
  path: "/pre-arrival/",
  seoTitle: "Pre-arrival guide for Voulamandis House Chios",
  seoDescription: "Private pre-arrival guide for guests of Voulamandis House in Chios, with booking details, directions and contact options.",
  heroTitle: "Your stay at Voulamandis House is almost here",
  heroDescription: "Check your booking details, choose the correct arrival route and contact us quickly before you arrive.",
  routeButton: "Open directions",
  whatsappButton: "Send arrival time",
  bookingTitle: "Your booking at a glance",
  bookingDescription: "These details are filled from the Beds24 email link when available.",
  guest: "Guest",
  surname: "Surname",
  room: "Room",
  stay: "Stay",
  price: "Total cost",
  missingGuest: "Guest details not available",
  missingSurname: "Surname not available",
  missingRoom: "Room details not available",
  missingDates: "Dates not available",
  missingPrice: "Price not available",
  arrivalTitle: "Tell us approximately what time you will arrive",
  arrivalText: "A short message with your arrival time helps us organise your welcome and guide you if needed.",
  whatsappText: "You can call, send WhatsApp, email or SMS. SMS can include your surname and check-in date automatically.",
  directionsKicker: "Arrival directions",
  directionsTitle: "Choose the correct route to Voulamandis House",
  directionsText: "Use the route that matches where you arrive: Chios Airport, Chios Harbor or Mesta Port. Our custom routes avoid confusing Google Maps alternatives.",
  importantTitle: "Important Google Maps warning",
  importantText: "For airport and Chios Harbor arrivals, Google Maps may suggest CHALKOUSI ZANNI KE MARIAS Street. Ignore it. After Lidl and at the end of the runway, turn left into DIMARCHOU KALVOKORESSI Street and continue until number 117.",
  openRoute: "Open route",
  callUs: "Call Voulamandis House",
  steps: [
    { title: "Exit Chios Airport", text: "When you exit the airport gate, turn right towards Voulamandis House." },
    { title: "Follow the runway road", text: "Follow the road parallel to the airport runway until the end." },
    { title: "Landmarks on the way", text: "You will see an ELIN gas station on your right, then MY MARKET supermarket and Lidl on your left." },
    { title: "After Lidl", text: "At the end of the runway, turn left into DIMARCHOU KALVOKORESSI Street." },
    { title: "Continue to number 117", text: "Stay only on DIMARCHOU KALVOKORESSI Street until you reach number 117." },
    { title: "From Chios Harbor", text: "Leave the port towards Chios Airport, follow the road parallel to the runway and continue to number 117." },
    { title: "From Mesta Port", text: "The drive takes about 1 hour. Follow our recommended route through the centre of the island and Thymiana." },
  ],
  helpTitle: "Need help with your arrival?",
  helpText: "Contact us before or during your route. We can guide you by phone, WhatsApp, email or SMS.",
  call: "Call",
  whatsapp: "WhatsApp",
  email: "Email",
  sms: "SMS",
  checklistTitle: "Before you arrive",
  checklistItems: ["Send us your estimated arrival time.", "Tell us if you arrive from Chios Airport, Chios Harbor or Mesta Port.", "Keep our phone and WhatsApp numbers available.", "Inform us about any important room request."],
};

const el: TextSet = {
  ...en,
  locale: "el",
  path: "/el/pre-arrival/",
  seoTitle: "Οδηγός άφιξης για Voulamandis House Χίος",
  seoDescription: "Ιδιωτικός οδηγός άφιξης για επισκέπτες του Voulamandis House στη Χίο, με στοιχεία κράτησης, οδηγίες διαδρομής και τρόπους επικοινωνίας.",
  heroTitle: "Σας περιμένουμε σύντομα στο Voulamandis House",
  heroDescription: "Ελέγξτε τα στοιχεία της κράτησης, επιλέξτε τη σωστή διαδρομή άφιξης και επικοινωνήστε μαζί μας εύκολα πριν φτάσετε.",
  routeButton: "Άνοιγμα διαδρομής",
  whatsappButton: "Στείλτε ώρα άφιξης",
  bookingTitle: "Η κράτησή σας με μια ματιά",
  bookingDescription: "Τα στοιχεία συμπληρώνονται από το link του Beds24 email, όταν είναι διαθέσιμα.",
  guest: "Επισκέπτης",
  surname: "Επώνυμο",
  room: "Δωμάτιο",
  stay: "Διαμονή",
  price: "Συνολικό κόστος",
  missingGuest: "Δεν υπάρχουν στοιχεία επισκέπτη",
  missingSurname: "Δεν υπάρχει επώνυμο",
  missingRoom: "Δεν υπάρχουν στοιχεία δωματίου",
  missingDates: "Δεν υπάρχουν ημερομηνίες",
  missingPrice: "Δεν υπάρχει τιμή",
  arrivalTitle: "Πείτε μας περίπου τι ώρα θα φτάσετε",
  arrivalText: "Ένα σύντομο μήνυμα με την ώρα άφιξης μας βοηθά να οργανώσουμε καλύτερα την υποδοχή σας και να σας καθοδηγήσουμε αν χρειαστεί.",
  whatsappText: "Μπορείτε να καλέσετε, να στείλετε WhatsApp, email ή SMS.",
  directionsKicker: "Οδηγίες άφιξης",
  directionsTitle: "Επιλέξτε τη σωστή διαδρομή προς το Voulamandis House",
  directionsText: "Χρησιμοποιήστε τη διαδρομή ανάλογα με το σημείο άφιξης: αεροδρόμιο Χίου, λιμάνι Χίου ή λιμάνι Μεστών.",
  importantTitle: "Σημαντική προειδοποίηση για Google Maps",
  importantText: "Για άφιξη από αεροδρόμιο ή λιμάνι Χίου, το Google Maps μπορεί να προτείνει την οδό Χαλκούση Ζάννη και Μαρίας. Αγνοήστε την. Μετά το Lidl και στο τέλος του διαδρόμου, στρίψτε αριστερά στην οδό Δημάρχου Καλβοκορέση και συνεχίστε μέχρι τον αριθμό 117.",
  openRoute: "Άνοιγμα διαδρομής",
  callUs: "Καλέστε το Voulamandis House",
  steps: [
    { title: "Βγαίνοντας από το αεροδρόμιο", text: "Όταν βγείτε από την πύλη του αεροδρομίου, στρίψτε δεξιά προς Voulamandis House." },
    { title: "Ακολουθήστε τον δρόμο του διαδρόμου", text: "Ακολουθήστε τον δρόμο που κινείται παράλληλα με τον διάδρομο του αεροδρομίου μέχρι το τέλος." },
    { title: "Σημεία αναφοράς", text: "Θα δείτε βενζινάδικο ELIN στα δεξιά σας και μετά στα αριστερά το MY MARKET και δίπλα το Lidl." },
    { title: "Μετά το Lidl", text: "Στο τέλος του διαδρόμου, στρίψτε αριστερά στην οδό Δημάρχου Καλβοκορέση." },
    { title: "Συνεχίστε μέχρι το 117", text: "Κινηθείτε μόνο πάνω στην οδό Δημάρχου Καλβοκορέση μέχρι τον αριθμό 117." },
    { title: "Από λιμάνι Χίου", text: "Κινηθείτε προς το αεροδρόμιο Χίου, ακολουθήστε τον δρόμο παράλληλα με τον διάδρομο και συνεχίστε μέχρι το 117." },
    { title: "Από λιμάνι Μεστών", text: "Η διαδρομή διαρκεί περίπου 1 ώρα. Ακολουθήστε την προτεινόμενη διαδρομή μέσω του κέντρου του νησιού και των Θυμιανών." },
  ],
  helpTitle: "Χρειάζεστε βοήθεια με την άφιξη;",
  helpText: "Επικοινωνήστε μαζί μας πριν ή κατά τη διάρκεια της διαδρομής.",
  call: "Κλήση",
  checklistTitle: "Πριν φτάσετε",
  checklistItems: ["Στείλτε μας την εκτιμώμενη ώρα άφιξης.", "Πείτε μας αν φτάνετε από αεροδρόμιο Χίου, λιμάνι Χίου ή λιμάνι Μεστών.", "Κρατήστε διαθέσιμο το τηλέφωνο και το WhatsApp μας.", "Ενημερώστε μας για οποιοδήποτε σημαντικό αίτημα σχετικά με το δωμάτιο."],
};

const fr: TextSet = {
  ...en,
  locale: "fr",
  path: "/fr/pre-arrival/",
  seoTitle: "Guide avant l’arrivée | Voulamandis House Chios",
  seoDescription: "Guide privé avant l’arrivée pour les hôtes de Voulamandis House à Chios, avec détails de réservation, itinéraires et contacts.",
  heroTitle: "Votre séjour au Voulamandis House approche",
  heroDescription: "Vérifiez votre réservation, choisissez le bon itinéraire et contactez-nous avant votre arrivée.",
  routeButton: "Ouvrir l’itinéraire",
  whatsappButton: "Envoyer l’heure d’arrivée",
  bookingTitle: "Votre réservation en un coup d’œil",
  bookingDescription: "Ces informations sont remplies depuis le lien email Beds24 lorsqu’elles sont disponibles.",
  guest: "Hôte",
  surname: "Nom",
  room: "Chambre",
  stay: "Séjour",
  price: "Coût total",
  missingGuest: "Informations hôte non disponibles",
  missingSurname: "Nom non disponible",
  missingRoom: "Informations chambre non disponibles",
  missingDates: "Dates non disponibles",
  missingPrice: "Prix non disponible",
  arrivalTitle: "Indiquez-nous votre heure d’arrivée approximative",
  arrivalText: "Un court message avec votre heure d’arrivée nous aide à organiser votre accueil.",
  whatsappText: "Vous pouvez appeler, envoyer WhatsApp, email ou SMS.",
  directionsKicker: "Itinéraire d’arrivée",
  directionsTitle: "Choisissez le bon itinéraire vers Voulamandis House",
  directionsText: "Utilisez l’itinéraire correspondant à votre arrivée : aéroport de Chios, port de Chios ou port de Mesta.",
  importantTitle: "Attention avec Google Maps",
  importantText: "Google Maps peut proposer la rue Chalkousi Zanni ke Marias. Ignorez cette suggestion. Après Lidl, au bout de la piste, tournez à gauche dans la rue Dimarchou Kalvokoressi et continuez jusqu’au numéro 117.",
  openRoute: "Ouvrir l’itinéraire",
  callUs: "Appeler Voulamandis House",
  steps: [
    { title: "Sortie de l’aéroport", text: "En sortant de l’aéroport de Chios, tournez à droite vers Voulamandis House." },
    { title: "Suivez la route de la piste", text: "Suivez la route parallèle à la piste de l’aéroport jusqu’au bout." },
    { title: "Repères sur la route", text: "Vous verrez une station ELIN à droite, puis MY MARKET et Lidl à gauche." },
    { title: "Après Lidl", text: "Au bout de la piste, tournez à gauche dans la rue Dimarchou Kalvokoressi." },
    { title: "Continuez jusqu’au 117", text: "Restez uniquement sur la rue Dimarchou Kalvokoressi jusqu’au numéro 117." },
    { title: "Depuis le port de Chios", text: "Roulez vers l’aéroport de Chios, suivez la route parallèle à la piste puis continuez jusqu’au 117." },
    { title: "Depuis le port de Mesta", text: "Le trajet dure environ 1 heure. Suivez notre itinéraire recommandé par le centre de l’île et Thymiana." },
  ],
  helpTitle: "Besoin d’aide pour votre arrivée ?",
  helpText: "Contactez-nous avant ou pendant votre trajet.",
  call: "Appeler",
  checklistTitle: "Avant votre arrivée",
  checklistItems: ["Envoyez-nous votre heure d’arrivée estimée.", "Dites-nous si vous arrivez de l’aéroport, du port de Chios ou du port de Mesta.", "Gardez nos numéros de téléphone et WhatsApp à portée de main.", "Informez-nous de toute demande importante concernant la chambre."],
};

const de: TextSet = {
  ...en,
  locale: "de",
  path: "/de/pre-arrival/",
  seoTitle: "Anreise-Guide | Voulamandis House Chios",
  seoDescription: "Privater Anreise-Guide für Gäste von Voulamandis House auf Chios mit Buchungsdetails, Routen und Kontaktmöglichkeiten.",
  heroTitle: "Ihr Aufenthalt im Voulamandis House steht kurz bevor",
  heroDescription: "Prüfen Sie Ihre Buchungsdetails, wählen Sie die richtige Route und kontaktieren Sie uns vor Ihrer Ankunft.",
  routeButton: "Route öffnen",
  whatsappButton: "Ankunftszeit senden",
  bookingTitle: "Ihre Buchung auf einen Blick",
  bookingDescription: "Diese Angaben werden, wenn verfügbar, über den Beds24-E-Mail-Link ausgefüllt.",
  guest: "Gast",
  surname: "Nachname",
  room: "Zimmer",
  stay: "Aufenthalt",
  price: "Gesamtkosten",
  missingGuest: "Gastdaten nicht verfügbar",
  missingSurname: "Nachname nicht verfügbar",
  missingRoom: "Zimmerdaten nicht verfügbar",
  missingDates: "Daten nicht verfügbar",
  missingPrice: "Preis nicht verfügbar",
  arrivalTitle: "Teilen Sie uns Ihre ungefähre Ankunftszeit mit",
  arrivalText: "Eine kurze Nachricht mit Ihrer Ankunftszeit hilft uns, Ihren Empfang zu organisieren.",
  whatsappText: "Sie können uns per Telefon, WhatsApp, E-Mail oder SMS kontaktieren.",
  directionsKicker: "Anreisehinweise",
  directionsTitle: "Wählen Sie die richtige Route zum Voulamandis House",
  directionsText: "Nutzen Sie die Route passend zu Ihrem Ankunftsort: Flughafen Chios, Hafen Chios oder Hafen Mesta.",
  importantTitle: "Wichtiger Google-Maps-Hinweis",
  importantText: "Google Maps kann die Straße Chalkousi Zanni ke Marias vorschlagen. Ignorieren Sie diese Route. Nach Lidl, am Ende der Landebahn, biegen Sie links in die Straße Dimarchou Kalvokoressi ein und fahren bis Nummer 117.",
  openRoute: "Route öffnen",
  callUs: "Voulamandis House anrufen",
  steps: [
    { title: "Flughafen verlassen", text: "Wenn Sie den Flughafen Chios verlassen, biegen Sie rechts Richtung Voulamandis House ab." },
    { title: "Straße an der Landebahn", text: "Folgen Sie der Straße parallel zur Start- und Landebahn bis zum Ende." },
    { title: "Orientierungspunkte", text: "Sie sehen rechts eine ELIN-Tankstelle, danach links MY MARKET und Lidl." },
    { title: "Nach Lidl", text: "Am Ende der Landebahn biegen Sie links in die Straße Dimarchou Kalvokoressi ein." },
    { title: "Bis Nummer 117", text: "Folgen Sie nur der Straße Dimarchou Kalvokoressi bis Hausnummer 117." },
    { title: "Vom Hafen Chios", text: "Fahren Sie Richtung Flughafen Chios, folgen Sie der Straße an der Landebahn und weiter bis Nummer 117." },
    { title: "Vom Hafen Mesta", text: "Die Fahrt dauert etwa 1 Stunde. Folgen Sie unserer empfohlenen Route über das Inselzentrum und Thymiana." },
  ],
  helpTitle: "Brauchen Sie Hilfe bei der Ankunft?",
  helpText: "Kontaktieren Sie uns vor oder während Ihrer Fahrt.",
  call: "Anrufen",
  email: "E-Mail",
  checklistTitle: "Vor Ihrer Ankunft",
  checklistItems: ["Senden Sie uns Ihre geschätzte Ankunftszeit.", "Teilen Sie uns mit, ob Sie vom Flughafen Chios, Hafen Chios oder Hafen Mesta kommen.", "Halten Sie unsere Telefon- und WhatsApp-Nummern bereit.", "Informieren Sie uns über wichtige Zimmerwünsche."],
};

const it: TextSet = {
  ...en,
  locale: "it",
  path: "/it/pre-arrival/",
  seoTitle: "Guida prima dell’arrivo | Voulamandis House Chios",
  seoDescription: "Guida privata prima dell’arrivo per gli ospiti di Voulamandis House a Chios, con dettagli della prenotazione, percorsi e contatti.",
  heroTitle: "Il tuo soggiorno al Voulamandis House è vicino",
  heroDescription: "Controlla la prenotazione, scegli il percorso corretto e contattaci prima dell’arrivo.",
  routeButton: "Apri percorso",
  whatsappButton: "Invia ora di arrivo",
  bookingTitle: "La tua prenotazione in sintesi",
  bookingDescription: "Questi dati vengono compilati dal link email Beds24 quando disponibili.",
  guest: "Ospite",
  surname: "Cognome",
  room: "Camera",
  stay: "Soggiorno",
  price: "Costo totale",
  missingGuest: "Dati ospite non disponibili",
  missingSurname: "Cognome non disponibile",
  missingRoom: "Dati camera non disponibili",
  missingDates: "Date non disponibili",
  missingPrice: "Prezzo non disponibile",
  arrivalTitle: "Dicci a che ora arriverai circa",
  arrivalText: "Un breve messaggio con l’orario di arrivo ci aiuta a organizzare la tua accoglienza.",
  whatsappText: "Puoi chiamare, inviare WhatsApp, email o SMS.",
  directionsKicker: "Indicazioni di arrivo",
  directionsTitle: "Scegli il percorso corretto per Voulamandis House",
  directionsText: "Usa il percorso in base al punto di arrivo: aeroporto di Chios, porto di Chios o porto di Mesta.",
  importantTitle: "Attenzione a Google Maps",
  importantText: "Google Maps potrebbe suggerire via Chalkousi Zanni ke Marias. Ignorala. Dopo Lidl, alla fine della pista, gira a sinistra in via Dimarchou Kalvokoressi e continua fino al numero 117.",
  openRoute: "Apri percorso",
  callUs: "Chiama Voulamandis House",
  steps: [
    { title: "Uscita dall’aeroporto", text: "Quando esci dall’aeroporto di Chios, gira a destra verso Voulamandis House." },
    { title: "Segui la strada della pista", text: "Segui la strada parallela alla pista dell’aeroporto fino alla fine." },
    { title: "Punti di riferimento", text: "Vedrai una stazione ELIN a destra, poi MY MARKET e Lidl a sinistra." },
    { title: "Dopo Lidl", text: "Alla fine della pista, gira a sinistra in via Dimarchou Kalvokoressi." },
    { title: "Continua fino al 117", text: "Rimani solo su via Dimarchou Kalvokoressi fino al numero 117." },
    { title: "Dal porto di Chios", text: "Vai verso l’aeroporto di Chios, segui la strada parallela alla pista e continua fino al 117." },
    { title: "Dal porto di Mesta", text: "Il tragitto dura circa 1 ora. Segui il percorso consigliato attraverso il centro dell’isola e Thymiana." },
  ],
  helpTitle: "Hai bisogno di aiuto per l’arrivo?",
  helpText: "Contattaci prima o durante il percorso.",
  call: "Chiama",
  checklistTitle: "Prima di arrivare",
  checklistItems: ["Inviaci l’orario di arrivo stimato.", "Dicci se arrivi dall’aeroporto di Chios, dal porto di Chios o dal porto di Mesta.", "Tieni disponibili i nostri numeri di telefono e WhatsApp.", "Informaci di eventuali richieste importanti per la camera."],
};

const es: TextSet = {
  ...en,
  locale: "es",
  path: "/es/pre-arrival/",
  seoTitle: "Guía antes de la llegada | Voulamandis House Chios",
  seoDescription: "Guía privada antes de la llegada para huéspedes de Voulamandis House en Chios, con datos de reserva, rutas y contactos.",
  heroTitle: "Tu estancia en Voulamandis House está cerca",
  heroDescription: "Revisa tu reserva, elige la ruta correcta y contáctanos antes de llegar.",
  routeButton: "Abrir ruta",
  whatsappButton: "Enviar hora de llegada",
  bookingTitle: "Tu reserva de un vistazo",
  bookingDescription: "Estos datos se completan desde el enlace del email de Beds24 cuando están disponibles.",
  guest: "Huésped",
  surname: "Apellido",
  room: "Habitación",
  stay: "Estancia",
  price: "Coste total",
  missingGuest: "Datos del huésped no disponibles",
  missingSurname: "Apellido no disponible",
  missingRoom: "Datos de habitación no disponibles",
  missingDates: "Fechas no disponibles",
  missingPrice: "Precio no disponible",
  arrivalTitle: "Indíquenos aproximadamente a qué hora llegará",
  arrivalText: "Un breve mensaje con su hora de llegada nos ayuda a organizar su bienvenida.",
  whatsappText: "Puede llamar, enviar WhatsApp, email o SMS.",
  directionsKicker: "Indicaciones de llegada",
  directionsTitle: "Elija la ruta correcta hacia Voulamandis House",
  directionsText: "Use la ruta según su punto de llegada: aeropuerto de Chios, puerto de Chios o puerto de Mesta.",
  importantTitle: "Advertencia importante de Google Maps",
  importantText: "Google Maps puede sugerir la calle Chalkousi Zanni ke Marias. Ignore esa sugerencia. Después de Lidl, al final de la pista, gire a la izquierda en la calle Dimarchou Kalvokoressi y continúe hasta el número 117.",
  openRoute: "Abrir ruta",
  callUs: "Llamar a Voulamandis House",
  steps: [
    { title: "Salida del aeropuerto", text: "Al salir del aeropuerto de Chios, gire a la derecha hacia Voulamandis House." },
    { title: "Siga la carretera de la pista", text: "Siga la carretera paralela a la pista del aeropuerto hasta el final." },
    { title: "Puntos de referencia", text: "Verá una gasolinera ELIN a la derecha, luego MY MARKET y Lidl a la izquierda." },
    { title: "Después de Lidl", text: "Al final de la pista, gire a la izquierda en la calle Dimarchou Kalvokoressi." },
    { title: "Continúe hasta el 117", text: "Siga solo por la calle Dimarchou Kalvokoressi hasta el número 117." },
    { title: "Desde el puerto de Chios", text: "Conduzca hacia el aeropuerto de Chios, siga la carretera paralela a la pista y continúe hasta el 117." },
    { title: "Desde el puerto de Mesta", text: "El trayecto dura aproximadamente 1 hora. Siga nuestra ruta recomendada por el centro de la isla y Thymiana." },
  ],
  helpTitle: "¿Necesita ayuda para llegar?",
  helpText: "Contáctenos antes o durante el trayecto.",
  call: "Llamar",
  checklistTitle: "Antes de llegar",
  checklistItems: ["Envíenos su hora estimada de llegada.", "Díganos si llega desde el aeropuerto de Chios, el puerto de Chios o el puerto de Mesta.", "Tenga disponibles nuestros números de teléfono y WhatsApp.", "Infórmenos de cualquier solicitud importante sobre la habitación."],
};

const tr: TextSet = {
  ...en,
  locale: "tr",
  path: "/tr/pre-arrival/",
  seoTitle: "Varış öncesi rehber | Voulamandis House Chios",
  seoDescription: "Chios’taki Voulamandis House misafirleri için rezervasyon bilgileri, rota ve iletişim seçenekleri içeren özel varış rehberi.",
  heroTitle: "Voulamandis House konaklamanız yaklaşıyor",
  heroDescription: "Rezervasyon bilgilerinizi kontrol edin, doğru rotayı seçin ve varıştan önce bizimle iletişime geçin.",
  routeButton: "Rotayı aç",
  whatsappButton: "Varış saatini gönder",
  bookingTitle: "Rezervasyonunuz bir bakışta",
  bookingDescription: "Bu bilgiler, mevcut olduğunda Beds24 e-posta bağlantısından doldurulur.",
  guest: "Misafir",
  surname: "Soyadı",
  room: "Oda",
  stay: "Konaklama",
  price: "Toplam tutar",
  missingGuest: "Misafir bilgileri mevcut değil",
  missingSurname: "Soyadı mevcut değil",
  missingRoom: "Oda bilgileri mevcut değil",
  missingDates: "Tarihler mevcut değil",
  missingPrice: "Fiyat mevcut değil",
  arrivalTitle: "Yaklaşık varış saatinizi bize bildirin",
  arrivalText: "Varış saatinizi içeren kısa bir mesaj, karşılamanızı organize etmemize yardımcı olur.",
  whatsappText: "Telefon, WhatsApp, e-posta veya SMS ile iletişime geçebilirsiniz.",
  directionsKicker: "Varış talimatları",
  directionsTitle: "Voulamandis House için doğru rotayı seçin",
  directionsText: "Varış noktanıza göre rotayı kullanın: Chios Havalimanı, Chios Limanı veya Mesta Limanı.",
  importantTitle: "Google Maps uyarısı",
  importantText: "Google Maps Chalkousi Zanni ke Marias Street yolunu önerebilir. Bu öneriyi dikkate almayın. Lidl’den sonra, pistin sonunda Dimarchou Kalvokoressi Street’e sola dönün ve 117 numaraya kadar devam edin.",
  openRoute: "Rotayı aç",
  callUs: "Voulamandis House’u ara",
  steps: [
    { title: "Havalimanından çıkış", text: "Chios Havalimanı’ndan çıkınca Voulamandis House yönüne sağa dönün." },
    { title: "Pist yolunu takip edin", text: "Havalimanı pistine paralel yolu sonuna kadar takip edin." },
    { title: "Yoldaki işaretler", text: "Sağda ELIN benzin istasyonunu, sonra solda MY MARKET ve Lidl’i göreceksiniz." },
    { title: "Lidl’den sonra", text: "Pistin sonunda Dimarchou Kalvokoressi Street’e sola dönün." },
    { title: "117 numaraya devam edin", text: "Sadece Dimarchou Kalvokoressi Street üzerinde 117 numaraya kadar devam edin." },
    { title: "Chios Limanı’ndan", text: "Chios Havalimanı yönüne gidin, piste paralel yolu takip edin ve 117 numaraya kadar devam edin." },
    { title: "Mesta Limanı’ndan", text: "Yolculuk yaklaşık 1 saat sürer. Adanın merkezi ve Thymiana üzerinden önerilen rotamızı takip edin." },
  ],
  helpTitle: "Varış için yardıma mı ihtiyacınız var?",
  helpText: "Yolculuk öncesinde veya sırasında bizimle iletişime geçin.",
  call: "Ara",
  email: "E-posta",
  checklistTitle: "Gelmeden önce",
  checklistItems: ["Tahmini varış saatinizi bize gönderin.", "Chios Havalimanı, Chios Limanı veya Mesta Limanı’ndan gelip gelmediğinizi bize bildirin.", "Telefon ve WhatsApp numaralarımızı hazır bulundurun.", "Oda ile ilgili önemli bir isteğiniz varsa bize bildirin."],
};

const pages: Record<LanguageCode, PreArrivalPageData> = {
  en: makePage(en),
  el: makePage(el),
  fr: makePage(fr),
  de: makePage(de),
  it: makePage(it),
  es: makePage(es),
  tr: makePage(tr),
};

export function getPreArrivalPageByLocale(locale: LanguageCode): PreArrivalPageData {
  return pages[locale] ?? pages.en;
}
