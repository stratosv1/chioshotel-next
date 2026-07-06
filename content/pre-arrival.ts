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

const airportStepsEn = [
  {
    title: "Exit Chios Airport",
    text:
      "When you exit the airport gate, turn right towards Voulamandis House.",
  },
  {
    title: "Follow the runway road",
    text:
      "Follow the road parallel to the airport runway until the end.",
  },
  {
    title: "Landmarks on the way",
    text:
      "Along the way, you will see an ELIN gas station on your right. After a while, on your left hand, you will find MY MARKET supermarket and right next to it, Lidl.",
  },
  {
    title: "After Lidl",
    text:
      "Pay attention after Lidl and at the end of the runway. Turn left into DIMARCHOU KALVOKORESSI Street.",
  },
  {
    title: "Continue to number 117",
    text:
      "Stay only on DIMARCHOU KALVOKORESSI Street until you reach number 117.",
  },
  {
    title: "Google Maps warning",
    text:
      "If Google Maps suggests CHALKOUSI ZANNI KE MARIAS Street, ignore that turn and continue on the correct route.",
  },
  {
    title: "From Chios Harbor",
    text:
      "Leaving the port of Chios, move around the harbor towards Chios Airport. In about 10 minutes, you will see the airport gate on your right; continue straight ahead. Follow the road parallel to the runway until the end. You will see an ELIN gas station on your right, then MY MARKET and Lidl on your left. After Lidl, at the end of the runway, turn left into DIMARCHOU KALVOKORESSI Street and continue only on this road until number 117. If Google Maps suggests CHALKOUSI ZANNI KE MARIAS Street, ignore it. The road has some turns, tall stone walls and Chios mandarin orchards.",
  },
  {
    title: "From Mesta Port",
    text:
      "The drive from Mesta Port takes about 1 hour. The port is on the southwest side of Chios, so you will head towards the centre of the island. Follow our exact route through Pyrgi, Armolia and local shops. You will arrive at Voulamandis House through the village of Thymiana.",
  },
];

const airportStepsEl = [
  {
    title: "Βγαίνοντας από το αεροδρόμιο",
    text:
      "Όταν βγείτε από την πύλη του αεροδρομίου, στρίψτε δεξιά προς Voulamandis House.",
  },
  {
    title: "Ακολουθήστε τον δρόμο του διαδρόμου",
    text:
      "Ακολουθήστε τον δρόμο που κινείται παράλληλα με τον διάδρομο του αεροδρομίου μέχρι το τέλος.",
  },
  {
    title: "Σημεία αναφοράς στη διαδρομή",
    text:
      "Στη διαδρομή θα δείτε ένα βενζινάδικο ELIN στα δεξιά σας. Μετά από λίγο, στα αριστερά σας, θα δείτε το MY MARKET και ακριβώς δίπλα το Lidl.",
  },
  {
    title: "Μετά το Lidl",
    text:
      "Προσέξτε μετά το Lidl και στο τέλος του διαδρόμου. Στρίψτε αριστερά στην οδό Δημάρχου Καλβοκορέση.",
  },
  {
    title: "Συνεχίστε μέχρι το 117",
    text:
      "Κινηθείτε μόνο πάνω στην οδό Δημάρχου Καλβοκορέση μέχρι να φτάσετε στον αριθμό 117.",
  },
  {
    title: "Προειδοποίηση για Google Maps",
    text:
      "Αν το Google Maps σας προτείνει την οδό Χαλκούση Ζάννη και Μαρίας, αγνοήστε αυτή τη στροφή και συνεχίστε στη σωστή διαδρομή.",
  },
  {
    title: "Από λιμάνι Χίου",
    text:
      "Φεύγοντας από το λιμάνι της Χίου, κινηθείτε γύρω από το λιμάνι προς το αεροδρόμιο Χίου. Σε περίπου 10 λεπτά θα δείτε την πύλη του αεροδρομίου στα δεξιά σας και συνεχίζετε ευθεία. Ακολουθήστε τον δρόμο παράλληλα με τον διάδρομο μέχρι το τέλος. Στη διαδρομή θα δείτε βενζινάδικο ELIN στα δεξιά, και μετά στα αριστερά σας το MY MARKET και δίπλα το Lidl. Μετά το Lidl, στο τέλος του διαδρόμου, στρίψτε αριστερά στην οδό Δημάρχου Καλβοκορέση και συνεχίστε μόνο σε αυτόν τον δρόμο μέχρι τον αριθμό 117. Αν το Google Maps προτείνει την οδό Χαλκούση Ζάννη και Μαρίας, αγνοήστε την. Η διαδρομή έχει κάποιες στροφές, ψηλούς πέτρινους τοίχους και περιβόλια με μανταρίνια Χίου.",
  },
  {
    title: "Από λιμάνι Μεστών",
    text:
      "Η διαδρομή από το λιμάνι Μεστών διαρκεί περίπου 1 ώρα. Το λιμάνι βρίσκεται στη νοτιοδυτική πλευρά της Χίου, οπότε κατευθυνθείτε προς το κέντρο του νησιού. Ακολουθήστε την ακριβή διαδρομή μας μέσω Πυργίου, Αρμολίων και τοπικών καταστημάτων. Θα φτάσετε στο Voulamandis House μέσα από το χωριό Θυμιανά.",
  },
];

function englishPage(locale: LanguageCode, canonicalPath: string, title: string): PreArrivalPageData {
  return {
    locale,
    seo: {
      canonicalPath,
      title,
      description:
        "Private pre-arrival guide for guests of Voulamandis House in Chios, with booking details, directions and contact options.",
      ogImage,
    },
    hero: {
      kicker: "Voulamandis House",
      title: "Your stay at Voulamandis House is almost here",
      description:
        "Check your booking details, choose the correct arrival route and contact us quickly before you arrive.",
      routeButton: "Open directions",
      whatsappButton: "Send arrival time",
    },
    booking: {
      title: "Your booking at a glance",
      description:
        "These details are filled from the Beds24 email link when available.",
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
    },
    arrival: {
      title: "Tell us approximately what time you will arrive",
      text:
        "A short message with your arrival time helps us organise your welcome and guide you if needed.",
      whatsappText:
        "You can call, send WhatsApp, email or SMS. SMS can include your surname and check-in date automatically.",
      whatsappButton: "Send message on WhatsApp",
    },
    directions: {
      kicker: "Arrival directions",
      title: "Choose the correct route to Voulamandis House",
      text:
        "Use the route that matches where you arrive: Chios Airport, Chios Harbor or Mesta Port. Our custom routes avoid confusing Google Maps alternatives.",
      importantTitle: "Important Google Maps warning",
      importantText:
        "For airport and Chios Harbor arrivals, Google Maps may suggest CHALKOUSI ZANNI KE MARIAS Street. Ignore it. After Lidl and at the end of the runway, turn left into DIMARCHOU KALVOKORESSI Street and continue until number 117.",
      openRoute: "Open route",
      callUs: "Call Voulamandis House",
      steps: airportStepsEn,
    },
    help: {
      title: "Need help with your arrival?",
      text:
        "Contact us before or during your route. We can guide you by phone, WhatsApp, email or SMS.",
      call: "Call",
      whatsapp: "WhatsApp",
      email: "Email",
      sms: "SMS",
    },
    checklist: {
      title: "Before you arrive",
      items: [
        "Send us your estimated arrival time.",
        "Tell us if you arrive from Chios Airport, Chios Harbor or Mesta Port.",
        "Keep our phone and WhatsApp numbers available.",
        "Inform us about any important room request.",
      ],
    },
  };
}

const pages: Record<LanguageCode, PreArrivalPageData> = {
  en: englishPage("en", "/pre-arrival/", "Pre-arrival guide for Voulamandis House Chios"),
  el: {
    locale: "el",
    seo: {
      canonicalPath: "/el/pre-arrival/",
      title: "Οδηγός άφιξης για Voulamandis House Χίος",
      description:
        "Ιδιωτικός οδηγός άφιξης για επισκέπτες του Voulamandis House στη Χίο, με στοιχεία κράτησης, οδηγίες διαδρομής και τρόπους επικοινωνίας.",
      ogImage,
    },
    hero: {
      kicker: "Voulamandis House",
      title: "Σας περιμένουμε σύντομα στο Voulamandis House",
      description:
        "Ελέγξτε τα στοιχεία της κράτησης, επιλέξτε τη σωστή διαδρομή άφιξης και επικοινωνήστε μαζί μας εύκολα πριν φτάσετε.",
      routeButton: "Άνοιγμα διαδρομής",
      whatsappButton: "Στείλτε ώρα άφιξης",
    },
    booking: {
      title: "Η κράτησή σας με μια ματιά",
      description:
        "Τα στοιχεία συμπληρώνονται από το link του Beds24 email, όταν είναι διαθέσιμα.",
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
    },
    arrival: {
      title: "Πείτε μας περίπου τι ώρα θα φτάσετε",
      text:
        "Ένα σύντομο μήνυμα με την ώρα άφιξης μας βοηθά να οργανώσουμε καλύτερα την υποδοχή σας και να σας καθοδηγήσουμε αν χρειαστεί.",
      whatsappText:
        "Μπορείτε να καλέσετε, να στείλετε WhatsApp, email ή SMS. Το SMS μπορεί να περιλαμβάνει αυτόματα το επώνυμο και το check-in σας.",
      whatsappButton: "Στείλτε μήνυμα στο WhatsApp",
    },
    directions: {
      kicker: "Οδηγίες άφιξης",
      title: "Επιλέξτε τη σωστή διαδρομή προς το Voulamandis House",
      text:
        "Χρησιμοποιήστε τη διαδρομή ανάλογα με το σημείο άφιξης: αεροδρόμιο Χίου, λιμάνι Χίου ή λιμάνι Μεστών. Οι δικές μας διαδρομές αποφεύγουν τις μπερδεμένες εναλλακτικές του Google Maps.",
      importantTitle: "Σημαντική προειδοποίηση για Google Maps",
      importantText:
        "Για άφιξη από αεροδρόμιο ή λιμάνι Χίου, το Google Maps μπορεί να προτείνει την οδό Χαλκούση Ζάννη και Μαρίας. Αγνοήστε την. Μετά το Lidl και στο τέλος του διαδρόμου, στρίψτε αριστερά στην οδό Δημάρχου Καλβοκορέση και συνεχίστε μέχρι τον αριθμό 117.",
      openRoute: "Άνοιγμα διαδρομής",
      callUs: "Καλέστε το Voulamandis House",
      steps: airportStepsEl,
    },
    help: {
      title: "Χρειάζεστε βοήθεια με την άφιξη;",
      text:
        "Επικοινωνήστε μαζί μας πριν ή κατά τη διάρκεια της διαδρομής. Μπορούμε να σας καθοδηγήσουμε τηλεφωνικά, με WhatsApp, email ή SMS.",
      call: "Κλήση",
      whatsapp: "WhatsApp",
      email: "Email",
      sms: "SMS",
    },
    checklist: {
      title: "Πριν φτάσετε",
      items: [
        "Στείλτε μας την εκτιμώμενη ώρα άφιξης.",
        "Πείτε μας αν φτάνετε από αεροδρόμιο Χίου, λιμάνι Χίου ή λιμάνι Μεστών.",
        "Κρατήστε διαθέσιμο το τηλέφωνο και το WhatsApp μας.",
        "Ενημερώστε μας για οποιοδήποτε σημαντικό αίτημα σχετικά με το δωμάτιο.",
      ],
    },
  },
  fr: englishPage("fr", "/fr/pre-arrival/", "Guide avant l’arrivée | Voulamandis House Chios"),
  de: englishPage("de", "/de/pre-arrival/", "Anreise-Guide | Voulamandis House Chios"),
  it: englishPage("it", "/it/pre-arrival/", "Guida prima dell’arrivo | Voulamandis House Chios"),
  es: englishPage("es", "/es/pre-arrival/", "Guía antes de la llegada | Voulamandis House Chios"),
  tr: englishPage("tr", "/tr/pre-arrival/", "Varış öncesi rehber | Voulamandis House Chios"),
};

pages.fr = {
  ...pages.fr,
  hero: {
    kicker: "Voulamandis House",
    title: "Votre séjour au Voulamandis House approche",
    description: "Vérifiez votre réservation, choisissez le bon itinéraire et contactez-nous avant votre arrivée.",
    routeButton: "Ouvrir l’itinéraire",
    whatsappButton: "Envoyer l’heure d’arrivée",
  },
  help: {
    title: "Besoin d’aide pour votre arrivée ?",
    text: "Contactez-nous par téléphone, WhatsApp, email ou SMS.",
    call: "Appeler",
    whatsapp: "WhatsApp",
    email: "Email",
    sms: "SMS",
  },
};

pages.de = {
  ...pages.de,
  hero: {
    kicker: "Voulamandis House",
    title: "Ihr Aufenthalt im Voulamandis House steht kurz bevor",
    description: "Prüfen Sie Ihre Buchungsdetails, wählen Sie die richtige Route und kontaktieren Sie uns vor Ihrer Ankunft.",
    routeButton: "Route öffnen",
    whatsappButton: "Ankunftszeit senden",
  },
  help: {
    title: "Brauchen Sie Hilfe bei der Ankunft?",
    text: "Kontaktieren Sie uns per Telefon, WhatsApp, E-Mail oder SMS.",
    call: "Anrufen",
    whatsapp: "WhatsApp",
    email: "E-Mail",
    sms: "SMS",
  },
};

pages.it = {
  ...pages.it,
  hero: {
    kicker: "Voulamandis House",
    title: "Il tuo soggiorno al Voulamandis House è vicino",
    description: "Controlla la prenotazione, scegli il percorso corretto e contattaci prima dell’arrivo.",
    routeButton: "Apri percorso",
    whatsappButton: "Invia ora di arrivo",
  },
  help: {
    title: "Hai bisogno di aiuto per l’arrivo?",
    text: "Contattaci tramite telefono, WhatsApp, email o SMS.",
    call: "Chiama",
    whatsapp: "WhatsApp",
    email: "Email",
    sms: "SMS",
  },
};

pages.es = {
  ...pages.es,
  hero: {
    kicker: "Voulamandis House",
    title: "Tu estancia en Voulamandis House está cerca",
    description: "Revisa tu reserva, elige la ruta correcta y contáctanos antes de llegar.",
    routeButton: "Abrir ruta",
    whatsappButton: "Enviar hora de llegada",
  },
  help: {
    title: "¿Necesitas ayuda para llegar?",
    text: "Contáctanos por teléfono, WhatsApp, email o SMS.",
    call: "Llamar",
    whatsapp: "WhatsApp",
    email: "Email",
    sms: "SMS",
  },
};

pages.tr = {
  ...pages.tr,
  hero: {
    kicker: "Voulamandis House",
    title: "Voulamandis House konaklamanız yaklaşıyor",
    description: "Rezervasyon bilgilerinizi kontrol edin, doğru rotayı seçin ve varıştan önce bizimle iletişime geçin.",
    routeButton: "Rotayı aç",
    whatsappButton: "Varış saatini gönder",
  },
  help: {
    title: "Varış için yardıma mı ihtiyacınız var?",
    text: "Bize telefon, WhatsApp, e-posta veya SMS ile ulaşabilirsiniz.",
    call: "Ara",
    whatsapp: "WhatsApp",
    email: "E-posta",
    sms: "SMS",
  },
};

export function getPreArrivalPageByLocale(locale: LanguageCode): PreArrivalPageData {
  return pages[locale] ?? pages.en;
}
