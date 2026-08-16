"use client";

import { useRef } from "react";
import type { PreArrivalPageData } from "@/content/pre-arrival";
import {
  preArrivalContact,
  preArrivalDirectionsUrl,
  preArrivalAirportVideoUrl,
  preArrivalChiosHarborDirectionsUrl,
  preArrivalMestaDirectionsUrl,
} from "@/content/pre-arrival";

type PreArrivalPageProps = {
  data: PreArrivalPageData;
};

type RouteSection = {
  title: string;
  intro: string;
  routeLabel: string;
  routeUrl: string;
  videoLabel?: string;
  videoUrl?: string;
  steps: string[];
};

type RouteLocaleCopy = {
  airport: {
    title: string;
    intro: string;
    routeLabel: string;
    videoLabel: string;
    steps: string[];
  };
  harbor: {
    title: string;
    intro: string;
    routeLabel: string;
    steps: string[];
  };
  mesta: {
    title: string;
    intro: string;
    routeLabel: string;
    steps: string[];
  };
};

type PageCopy = {
  badge: string;
  title: string;
  intro: string;
  arrivalTitle: string;
  arrivalText: string;
  whatsapp: string;
  sms: string;
  email: string;
  emailContact: string;
  emailSubject: string;
  warningTitle: string;
  warningText: string;
  routes: RouteSection[];
  helpTitle: string;
  call: string;
  languageLabel: string;
  homeLabel: string;
  message: string;
};

const languageLinks = [
  { label: "English", href: "/pre-arrival/", locale: "en" },
  { label: "Ελληνικά", href: "/el/pre-arrival/", locale: "el" },
  { label: "Français", href: "/fr/pre-arrival/", locale: "fr" },
  { label: "Deutsch", href: "/de/pre-arrival/", locale: "de" },
  { label: "Italiano", href: "/it/pre-arrival/", locale: "it" },
  { label: "Español", href: "/es/pre-arrival/", locale: "es" },
  { label: "Türkçe", href: "/tr/pre-arrival/", locale: "tr" },
];

const homeLinks: Record<string, string> = {
  en: "/",
  el: "/el/",
  fr: "/fr/",
  de: "/de/",
  it: "/it/",
  es: "/es/",
  tr: "/tr/",
};

const routeCarouselCopy: Record<string, { hint: string; next: string }> = {
  en: { hint: "Swipe or tap the arrow to see all arrival options", next: "Next arrival option" },
  el: { hint: "Σύρε ή πάτησε το βελάκι για όλους τους τρόπους άφιξης", next: "Επόμενος τρόπος άφιξης" },
  fr: { hint: "Faites glisser ou touchez la flèche pour voir toutes les options", next: "Option d’arrivée suivante" },
  de: { hint: "Wischen oder Pfeil tippen, um alle Anreiseoptionen zu sehen", next: "Nächste Anreiseoption" },
  it: { hint: "Scorri o tocca la freccia per vedere tutte le opzioni", next: "Opzione di arrivo successiva" },
  es: { hint: "Desliza o toca la flecha para ver todas las opciones", next: "Siguiente opción de llegada" },
  tr: { hint: "Tüm varış seçenekleri için kaydırın veya oka dokunun", next: "Sonraki varış seçeneği" },
};

function buildRoutes(copy: RouteLocaleCopy): RouteSection[] {
  return [
    {
      ...copy.airport,
      routeUrl: preArrivalDirectionsUrl,
      videoUrl: preArrivalAirportVideoUrl,
    },
    {
      ...copy.harbor,
      routeUrl: preArrivalChiosHarborDirectionsUrl,
    },
    {
      ...copy.mesta,
      routeUrl: preArrivalMestaDirectionsUrl,
    },
  ];
}

const routesEn = buildRoutes({
  airport: {
    title: "2. If you arrive from Chios Airport",
    intro: "Voulamandis House is about 8 minutes from Chios Airport.",
    routeLabel: "Open airport route",
    videoLabel: "Watch airport video",
    steps: [
      "When you exit Chios Airport, turn right towards Voulamandis House.",
      "Follow the road parallel to the airport runway until the end.",
      "You will see an ELIN gas station on your right.",
      "A little farther on, you will see MY MARKET on your left and Lidl right next to it.",
      "After Lidl, at the end of the runway, turn left into Dimarchou Kalvokoresi Street.",
      "Stay on Dimarchou Kalvokoresi Street until you reach number 117.",
    ],
  },
  harbor: {
    title: "3. If you arrive from Chios Harbor",
    intro: "Follow the route towards Chios Airport and then use the same final road.",
    routeLabel: "Open Chios Harbor route",
    steps: [
      "Leave Chios Harbor and drive around the port towards Chios Airport.",
      "After about 10 minutes, you will see the airport entrance on your right. Continue straight.",
      "Follow the road parallel to the airport runway until the end.",
      "You will see an ELIN gas station on your right.",
      "On your left, you will see MY MARKET and Lidl right next to it.",
      "After Lidl, at the end of the runway, turn left into Dimarchou Kalvokoresi Street.",
      "Stay on Dimarchou Kalvokoresi Street until you reach number 117.",
      "The road has some bends, tall stone walls and Chios mandarin orchards.",
    ],
  },
  mesta: {
    title: "4. If you arrive from Mesta Port",
    intro: "Mesta Port is farther away. Use our recommended route and arrive through Thymiana.",
    routeLabel: "Open Mesta Port route",
    steps: [
      "Mesta Port is on the southwest side of Chios.",
      "The drive to Voulamandis House takes about 1 hour.",
      "Follow our recommended Google Maps route because other routes may be less convenient.",
      "Drive towards the centre of the island.",
      "The route passes through or near Pyrgi and Armolia.",
      "You will reach Voulamandis House through the village of Thymiana.",
      "For the final section, follow Dimarchou Kalvokoresi Street until number 117.",
    ],
  },
});

const routesEl = buildRoutes({
  airport: {
    title: "2. Αν έρχεστε από το αεροδρόμιο Χίου",
    intro: "Το Voulamandis House απέχει περίπου 8 λεπτά από το αεροδρόμιο Χίου.",
    routeLabel: "Άνοιγμα διαδρομής από αεροδρόμιο",
    videoLabel: "Δείτε video από το αεροδρόμιο",
    steps: [
      "Όταν βγείτε από το αεροδρόμιο Χίου, στρίψτε δεξιά προς Voulamandis House.",
      "Ακολουθήστε τον δρόμο που είναι παράλληλος με τον διάδρομο του αεροδρομίου μέχρι το τέλος.",
      "Θα δείτε ένα βενζινάδικο ELIN στα δεξιά σας.",
      "Λίγο πιο κάτω, στα αριστερά σας, θα δείτε το MY MARKET και ακριβώς δίπλα το Lidl.",
      "Μετά το Lidl, στο τέλος του διαδρόμου, στρίψτε αριστερά στην οδό Δημάρχου Καλβοκορέση (Dimarchou Kalvokoresi).",
      "Μείνετε στην οδό Δημάρχου Καλβοκορέση μέχρι να φτάσετε στον αριθμό 117.",
    ],
  },
  harbor: {
    title: "3. Αν έρχεστε από το λιμάνι της Χίου",
    intro: "Ακολουθήστε τη διαδρομή προς το αεροδρόμιο Χίου και μετά το ίδιο τελικό κομμάτι.",
    routeLabel: "Άνοιγμα διαδρομής από λιμάνι Χίου",
    steps: [
      "Φεύγοντας από το λιμάνι της Χίου, κινηθείτε γύρω από το λιμάνι προς το αεροδρόμιο Χίου.",
      "Σε περίπου 10 λεπτά θα δείτε την είσοδο του αεροδρομίου στα δεξιά σας. Συνεχίστε ευθεία.",
      "Ακολουθήστε τον δρόμο που είναι παράλληλος με τον διάδρομο του αεροδρομίου μέχρι το τέλος.",
      "Θα δείτε ένα βενζινάδικο ELIN στα δεξιά σας.",
      "Στα αριστερά σας θα δείτε το MY MARKET και ακριβώς δίπλα το Lidl.",
      "Μετά το Lidl, στο τέλος του διαδρόμου, στρίψτε αριστερά στην οδό Δημάρχου Καλβοκορέση (Dimarchou Kalvokoresi).",
      "Μείνετε στην οδό Δημάρχου Καλβοκορέση μέχρι να φτάσετε στον αριθμό 117.",
      "Η διαδρομή έχει κάποιες στροφές, ψηλούς πέτρινους τοίχους και περιβόλια με μανταρίνια Χίου.",
    ],
  },
  mesta: {
    title: "4. Αν έρχεστε από το λιμάνι των Μεστών",
    intro: "Το λιμάνι των Μεστών είναι πιο μακριά. Χρησιμοποιήστε τη δική μας προτεινόμενη διαδρομή μέσω Θυμιανών.",
    routeLabel: "Άνοιγμα διαδρομής από λιμάνι Μεστών",
    steps: [
      "Το λιμάνι των Μεστών βρίσκεται στη νοτιοδυτική πλευρά της Χίου.",
      "Η διαδρομή μέχρι το Voulamandis House διαρκεί περίπου 1 ώρα.",
      "Ακολουθήστε τη δική μας προτεινόμενη διαδρομή στο Google Maps, γιατί άλλες διαδρομές μπορεί να είναι λιγότερο βολικές.",
      "Κινηθείτε προς το κέντρο του νησιού.",
      "Η διαδρομή περνάει από ή κοντά σε Πυργί και Αρμόλια.",
      "Θα φτάσετε στο Voulamandis House μέσα από το χωριό Θυμιανά.",
      "Στο τελικό κομμάτι, ακολουθήστε την οδό Δημάρχου Καλβοκορέση μέχρι τον αριθμό 117.",
    ],
  },
});

const routesFr = buildRoutes({
  airport: {
    title: "2. Si vous arrivez de l’aéroport de Chios",
    intro: "Voulamandis House se trouve à environ 8 minutes de l’aéroport de Chios.",
    routeLabel: "Ouvrir l’itinéraire depuis l’aéroport",
    videoLabel: "Voir la vidéo depuis l’aéroport",
    steps: [
      "En sortant de l’aéroport de Chios, tournez à droite en direction de Voulamandis House.",
      "Suivez la route parallèle à la piste de l’aéroport jusqu’au bout.",
      "Vous verrez une station-service ELIN sur votre droite.",
      "Un peu plus loin, vous verrez MY MARKET sur votre gauche et Lidl juste à côté.",
      "Après Lidl, au bout de la piste, tournez à gauche dans la rue Dimarchou Kalvokoresi.",
      "Restez sur la rue Dimarchou Kalvokoresi jusqu’au numéro 117.",
    ],
  },
  harbor: {
    title: "3. Si vous arrivez du port de Chios",
    intro: "Prenez la direction de l’aéroport de Chios, puis suivez le même dernier tronçon.",
    routeLabel: "Ouvrir l’itinéraire depuis le port de Chios",
    steps: [
      "Quittez le port de Chios et longez le port en direction de l’aéroport de Chios.",
      "Après environ 10 minutes, vous verrez l’entrée de l’aéroport sur votre droite. Continuez tout droit.",
      "Suivez la route parallèle à la piste de l’aéroport jusqu’au bout.",
      "Vous verrez une station-service ELIN sur votre droite.",
      "Sur votre gauche, vous verrez MY MARKET et Lidl juste à côté.",
      "Après Lidl, au bout de la piste, tournez à gauche dans la rue Dimarchou Kalvokoresi.",
      "Restez sur la rue Dimarchou Kalvokoresi jusqu’au numéro 117.",
      "La route comporte quelques virages, de hauts murs en pierre et des vergers de mandariniers de Chios.",
    ],
  },
  mesta: {
    title: "4. Si vous arrivez du port de Mesta",
    intro: "Le port de Mesta est plus éloigné. Utilisez notre itinéraire recommandé via Thymiana.",
    routeLabel: "Ouvrir l’itinéraire depuis le port de Mesta",
    steps: [
      "Le port de Mesta se trouve au sud-ouest de Chios.",
      "Le trajet jusqu’à Voulamandis House dure environ 1 heure.",
      "Suivez notre itinéraire Google Maps recommandé, car d’autres routes peuvent être moins pratiques.",
      "Dirigez-vous vers le centre de l’île.",
      "L’itinéraire passe par ou près de Pyrgi et Armolia.",
      "Vous arriverez à Voulamandis House en passant par le village de Thymiana.",
      "Pour la dernière partie, suivez la rue Dimarchou Kalvokoresi jusqu’au numéro 117.",
    ],
  },
});

const routesDe = buildRoutes({
  airport: {
    title: "2. Wenn Sie vom Flughafen Chios anreisen",
    intro: "Das Voulamandis House liegt etwa 8 Minuten vom Flughafen Chios entfernt.",
    routeLabel: "Route vom Flughafen öffnen",
    videoLabel: "Video vom Flughafen ansehen",
    steps: [
      "Wenn Sie den Flughafen Chios verlassen, biegen Sie rechts in Richtung Voulamandis House ab.",
      "Folgen Sie der Straße parallel zur Start- und Landebahn bis zum Ende.",
      "Auf der rechten Seite sehen Sie eine ELIN-Tankstelle.",
      "Etwas weiter sehen Sie links MY MARKET und direkt daneben Lidl.",
      "Nach Lidl, am Ende der Landebahn, biegen Sie links in die Straße Dimarchou Kalvokoresi ein.",
      "Bleiben Sie auf der Straße Dimarchou Kalvokoresi, bis Sie Hausnummer 117 erreichen.",
    ],
  },
  harbor: {
    title: "3. Wenn Sie vom Hafen Chios anreisen",
    intro: "Fahren Sie in Richtung Flughafen Chios und nutzen Sie anschließend denselben letzten Streckenabschnitt.",
    routeLabel: "Route vom Hafen Chios öffnen",
    steps: [
      "Verlassen Sie den Hafen Chios und fahren Sie am Hafen entlang in Richtung Flughafen Chios.",
      "Nach etwa 10 Minuten sehen Sie die Flughafeneinfahrt auf der rechten Seite. Fahren Sie geradeaus weiter.",
      "Folgen Sie der Straße parallel zur Start- und Landebahn bis zum Ende.",
      "Auf der rechten Seite sehen Sie eine ELIN-Tankstelle.",
      "Links sehen Sie MY MARKET und direkt daneben Lidl.",
      "Nach Lidl, am Ende der Landebahn, biegen Sie links in die Straße Dimarchou Kalvokoresi ein.",
      "Bleiben Sie auf der Straße Dimarchou Kalvokoresi, bis Sie Hausnummer 117 erreichen.",
      "Die Straße hat einige Kurven, hohe Steinmauern und führt an Chios-Mandarinenhainen vorbei.",
    ],
  },
  mesta: {
    title: "4. Wenn Sie vom Hafen Mesta anreisen",
    intro: "Der Hafen Mesta liegt weiter entfernt. Nutzen Sie unsere empfohlene Route über Thymiana.",
    routeLabel: "Route vom Hafen Mesta öffnen",
    steps: [
      "Der Hafen Mesta liegt im Südwesten von Chios.",
      "Die Fahrt zum Voulamandis House dauert etwa 1 Stunde.",
      "Folgen Sie unserer empfohlenen Google-Maps-Route, da andere Strecken weniger praktisch sein können.",
      "Fahren Sie in Richtung Inselmitte.",
      "Die Route führt durch oder nahe Pyrgi und Armolia.",
      "Sie erreichen das Voulamandis House über das Dorf Thymiana.",
      "Folgen Sie im letzten Abschnitt der Straße Dimarchou Kalvokoresi bis Hausnummer 117.",
    ],
  },
});

const routesIt = buildRoutes({
  airport: {
    title: "2. Se arrivi dall’aeroporto di Chios",
    intro: "Voulamandis House si trova a circa 8 minuti dall’aeroporto di Chios.",
    routeLabel: "Apri il percorso dall’aeroporto",
    videoLabel: "Guarda il video dall’aeroporto",
    steps: [
      "Uscendo dall’aeroporto di Chios, gira a destra in direzione di Voulamandis House.",
      "Segui la strada parallela alla pista dell’aeroporto fino alla fine.",
      "Vedrai una stazione di servizio ELIN sulla destra.",
      "Poco più avanti vedrai MY MARKET sulla sinistra e Lidl subito accanto.",
      "Dopo Lidl, alla fine della pista, gira a sinistra in via Dimarchou Kalvokoresi.",
      "Rimani su via Dimarchou Kalvokoresi fino al numero 117.",
    ],
  },
  harbor: {
    title: "3. Se arrivi dal porto di Chios",
    intro: "Segui la direzione per l’aeroporto di Chios e poi percorri lo stesso tratto finale.",
    routeLabel: "Apri il percorso dal porto di Chios",
    steps: [
      "Lascia il porto di Chios e segui il lungomare in direzione dell’aeroporto di Chios.",
      "Dopo circa 10 minuti vedrai l’ingresso dell’aeroporto sulla destra. Continua dritto.",
      "Segui la strada parallela alla pista dell’aeroporto fino alla fine.",
      "Vedrai una stazione di servizio ELIN sulla destra.",
      "Sulla sinistra vedrai MY MARKET e Lidl subito accanto.",
      "Dopo Lidl, alla fine della pista, gira a sinistra in via Dimarchou Kalvokoresi.",
      "Rimani su via Dimarchou Kalvokoresi fino al numero 117.",
      "La strada presenta alcune curve, alti muri in pietra e agrumeti di mandarini di Chios.",
    ],
  },
  mesta: {
    title: "4. Se arrivi dal porto di Mesta",
    intro: "Il porto di Mesta è più lontano. Usa il nostro percorso consigliato passando da Thymiana.",
    routeLabel: "Apri il percorso dal porto di Mesta",
    steps: [
      "Il porto di Mesta si trova nella parte sud-occidentale di Chios.",
      "Il viaggio fino a Voulamandis House dura circa 1 ora.",
      "Segui il nostro percorso Google Maps consigliato, perché altri percorsi possono essere meno comodi.",
      "Dirigiti verso il centro dell’isola.",
      "Il percorso passa per o vicino a Pyrgi e Armolia.",
      "Raggiungerai Voulamandis House passando dal villaggio di Thymiana.",
      "Nell’ultimo tratto, segui via Dimarchou Kalvokoresi fino al numero 117.",
    ],
  },
});

const routesEs = buildRoutes({
  airport: {
    title: "2. Si llega desde el aeropuerto de Chios",
    intro: "Voulamandis House está a unos 8 minutos del aeropuerto de Chios.",
    routeLabel: "Abrir ruta desde el aeropuerto",
    videoLabel: "Ver vídeo desde el aeropuerto",
    steps: [
      "Al salir del aeropuerto de Chios, gire a la derecha en dirección a Voulamandis House.",
      "Siga la carretera paralela a la pista del aeropuerto hasta el final.",
      "Verá una gasolinera ELIN a su derecha.",
      "Un poco más adelante verá MY MARKET a su izquierda y Lidl justo al lado.",
      "Después de Lidl, al final de la pista, gire a la izquierda en la calle Dimarchou Kalvokoresi.",
      "Permanezca en la calle Dimarchou Kalvokoresi hasta llegar al número 117.",
    ],
  },
  harbor: {
    title: "3. Si llega desde el puerto de Chios",
    intro: "Siga en dirección al aeropuerto de Chios y después utilice el mismo tramo final.",
    routeLabel: "Abrir ruta desde el puerto de Chios",
    steps: [
      "Salga del puerto de Chios y bordee el puerto en dirección al aeropuerto de Chios.",
      "Después de unos 10 minutos verá la entrada del aeropuerto a su derecha. Continúe recto.",
      "Siga la carretera paralela a la pista del aeropuerto hasta el final.",
      "Verá una gasolinera ELIN a su derecha.",
      "A su izquierda verá MY MARKET y Lidl justo al lado.",
      "Después de Lidl, al final de la pista, gire a la izquierda en la calle Dimarchou Kalvokoresi.",
      "Permanezca en la calle Dimarchou Kalvokoresi hasta llegar al número 117.",
      "La carretera tiene algunas curvas, altos muros de piedra y huertos de mandarinos de Chios.",
    ],
  },
  mesta: {
    title: "4. Si llega desde el puerto de Mesta",
    intro: "El puerto de Mesta está más lejos. Use nuestra ruta recomendada pasando por Thymiana.",
    routeLabel: "Abrir ruta desde el puerto de Mesta",
    steps: [
      "El puerto de Mesta está en el suroeste de Chios.",
      "El trayecto hasta Voulamandis House dura aproximadamente 1 hora.",
      "Siga nuestra ruta recomendada de Google Maps, ya que otras rutas pueden ser menos cómodas.",
      "Diríjase hacia el centro de la isla.",
      "La ruta pasa por Pyrgi y Armolia o cerca de estos pueblos.",
      "Llegará a Voulamandis House pasando por el pueblo de Thymiana.",
      "En el tramo final, siga la calle Dimarchou Kalvokoresi hasta el número 117.",
    ],
  },
});

const routesTr = buildRoutes({
  airport: {
    title: "2. Chios Havalimanı’ndan geliyorsanız",
    intro: "Voulamandis House, Chios Havalimanı’na yaklaşık 8 dakika uzaklıktadır.",
    routeLabel: "Havalimanı rotasını aç",
    videoLabel: "Havalimanı videosunu izle",
    steps: [
      "Chios Havalimanı’ndan çıkınca Voulamandis House yönüne sağa dönün.",
      "Havalimanı pistine paralel uzanan yolu sonuna kadar takip edin.",
      "Sağınızda ELIN benzin istasyonunu göreceksiniz.",
      "Biraz ileride solunuzda MY MARKET, hemen yanında Lidl bulunur.",
      "Lidl’den sonra, pistin sonunda sola dönerek Dimarchou Kalvokoresi Caddesi’ne girin.",
      "Dimarchou Kalvokoresi Caddesi’nden ayrılmadan 117 numaraya kadar devam edin.",
    ],
  },
  harbor: {
    title: "3. Chios Limanı’ndan geliyorsanız",
    intro: "Chios Havalimanı yönünde ilerleyin ve son bölümde aynı yolu takip edin.",
    routeLabel: "Chios Limanı rotasını aç",
    steps: [
      "Chios Limanı’ndan çıkın ve limanı takip ederek Chios Havalimanı yönünde ilerleyin.",
      "Yaklaşık 10 dakika sonra sağınızda havalimanı girişini göreceksiniz. Düz devam edin.",
      "Havalimanı pistine paralel uzanan yolu sonuna kadar takip edin.",
      "Sağınızda ELIN benzin istasyonunu göreceksiniz.",
      "Solunuzda MY MARKET, hemen yanında Lidl bulunur.",
      "Lidl’den sonra, pistin sonunda sola dönerek Dimarchou Kalvokoresi Caddesi’ne girin.",
      "Dimarchou Kalvokoresi Caddesi’nden ayrılmadan 117 numaraya kadar devam edin.",
      "Yol boyunca bazı virajlar, yüksek taş duvarlar ve Sakız mandalina bahçeleri göreceksiniz.",
    ],
  },
  mesta: {
    title: "4. Mesta Limanı’ndan geliyorsanız",
    intro: "Mesta Limanı daha uzaktadır. Thymiana üzerinden önerdiğimiz rotayı kullanın.",
    routeLabel: "Mesta Limanı rotasını aç",
    steps: [
      "Mesta Limanı, Sakız Adası’nın güneybatısındadır.",
      "Voulamandis House’a yolculuk yaklaşık 1 saat sürer.",
      "Diğer yollar daha zahmetli olabileceği için önerdiğimiz Google Maps rotasını takip edin.",
      "Adanın merkezine doğru ilerleyin.",
      "Rota Pyrgi ve Armolia köylerinden veya yakınlarından geçer.",
      "Voulamandis House’a Thymiana köyü üzerinden ulaşacaksınız.",
      "Son bölümde Dimarchou Kalvokoresi Caddesi’ni 117 numaraya kadar takip edin.",
    ],
  },
});

const copy: Record<string, PageCopy> = {
  en: {
    badge: "Voulamandis House arrival guide",
    title: "How to get to Voulamandis House",
    intro: "Simple arrival instructions for Chios Airport, Chios Harbor and Mesta Port.",
    arrivalTitle: "1. Send us your arrival information",
    arrivalText: "Before you start, please tell us approximately what time you arrive and where you are arriving from.",
    whatsapp: "Send by WhatsApp",
    sms: "Send by SMS",
    email: "Send by email",
    emailContact: "Email",
    emailSubject: "Voulamandis House arrival information",
    warningTitle: "Important Google Maps warning",
    warningText: "On Google Maps, follow Dimarchou Kalvokoresi Street, not Chalkousi Zanni Street. Our address is Dimarchou Kalvokoresi 117.",
    helpTitle: "Need help?",
    call: "Call",
    languageLabel: "Languages",
    homeLabel: "Back to homepage",
    message: "Hello Voulamandis House. I expect to arrive at: ____ . I am arriving from: Chios Airport / Chios Harbor / Mesta Port.",
    routes: routesEn,
  },
  el: {
    badge: "Οδηγός άφιξης Voulamandis House",
    title: "Πώς να φτάσετε στο Voulamandis House",
    intro: "Απλές οδηγίες άφιξης από αεροδρόμιο Χίου, λιμάνι Χίου και λιμάνι Μεστών.",
    arrivalTitle: "1. Στείλτε μας πληροφορίες άφιξης",
    arrivalText: "Πριν ξεκινήσετε, στείλτε μας περίπου τι ώρα θα φτάσετε και από πού έρχεστε.",
    whatsapp: "Αποστολή με WhatsApp",
    sms: "Αποστολή με SMS",
    email: "Αποστολή με email",
    emailContact: "Email",
    emailSubject: "Πληροφορίες άφιξης στο Voulamandis House",
    warningTitle: "Προσοχή στο Google Maps",
    warningText: "Στο Google Maps ακολουθήστε την οδό Δημάρχου Καλβοκορέση (Dimarchou Kalvokoresi) και όχι την οδό Χαλκούση Ζάννη (Chalkousi Zanni). Η διεύθυνσή μας είναι Δημάρχου Καλβοκορέση 117.",
    helpTitle: "Χρειάζεστε βοήθεια;",
    call: "Κλήση",
    languageLabel: "Γλώσσες",
    homeLabel: "Επιστροφή στην αρχική",
    message: "Γεια σας Voulamandis House. Θα φτάσω περίπου στις: ____ . Έρχομαι από: αεροδρόμιο Χίου / λιμάνι Χίου / λιμάνι Μεστών.",
    routes: routesEl,
  },
  fr: {
    badge: "Guide d’arrivée Voulamandis House",
    title: "Comment arriver à Voulamandis House",
    intro: "Instructions simples depuis l’aéroport de Chios, le port de Chios et le port de Mesta.",
    arrivalTitle: "1. Envoyez-nous vos informations d’arrivée",
    arrivalText: "Avant de partir, indiquez-nous votre heure d’arrivée approximative et votre point d’arrivée.",
    whatsapp: "Envoyer par WhatsApp",
    sms: "Envoyer par SMS",
    email: "Envoyer par e-mail",
    emailContact: "E-mail",
    emailSubject: "Informations d’arrivée à Voulamandis House",
    warningTitle: "Attention avec Google Maps",
    warningText: "Sur Google Maps, suivez la rue Dimarchou Kalvokoresi et non la rue Chalkousi Zanni. Notre adresse est Dimarchou Kalvokoresi 117.",
    helpTitle: "Besoin d’aide ?",
    call: "Appeler",
    languageLabel: "Langues",
    homeLabel: "Retour à l’accueil",
    message: "Bonjour Voulamandis House. J’arrive vers : ____ . J’arrive depuis : aéroport de Chios / port de Chios / port de Mesta.",
    routes: routesFr,
  },
  de: {
    badge: "Anreise-Guide Voulamandis House",
    title: "So kommen Sie zum Voulamandis House",
    intro: "Einfache Anreisehinweise vom Flughafen Chios, Hafen Chios und Hafen Mesta.",
    arrivalTitle: "1. Senden Sie uns Ihre Ankunftsinformationen",
    arrivalText: "Bitte teilen Sie uns vor der Abfahrt Ihre ungefähre Ankunftszeit und Ihren Ankunftsort mit.",
    whatsapp: "Per WhatsApp senden",
    sms: "Per SMS senden",
    email: "Per E-Mail senden",
    emailContact: "E-Mail",
    emailSubject: "Anreiseinformationen für das Voulamandis House",
    warningTitle: "Wichtiger Google-Maps-Hinweis",
    warningText: "Folgen Sie in Google Maps der Straße Dimarchou Kalvokoresi und nicht der Straße Chalkousi Zanni. Unsere Adresse ist Dimarchou Kalvokoresi 117.",
    helpTitle: "Brauchen Sie Hilfe?",
    call: "Anrufen",
    languageLabel: "Sprachen",
    homeLabel: "Zur Startseite",
    message: "Hallo Voulamandis House. Ich komme ungefähr um: ____ . Ich komme von: Flughafen Chios / Hafen Chios / Hafen Mesta.",
    routes: routesDe,
  },
  it: {
    badge: "Guida di arrivo Voulamandis House",
    title: "Come arrivare a Voulamandis House",
    intro: "Indicazioni semplici dall’aeroporto di Chios, dal porto di Chios e dal porto di Mesta.",
    arrivalTitle: "1. Inviaci le informazioni di arrivo",
    arrivalText: "Prima di partire, comunicaci l’orario approssimativo di arrivo e da dove arrivi.",
    whatsapp: "Invia con WhatsApp",
    sms: "Invia con SMS",
    email: "Invia con e-mail",
    emailContact: "E-mail",
    emailSubject: "Informazioni di arrivo a Voulamandis House",
    warningTitle: "Attenzione a Google Maps",
    warningText: "Su Google Maps segui via Dimarchou Kalvokoresi, non via Chalkousi Zanni. Il nostro indirizzo è Dimarchou Kalvokoresi 117.",
    helpTitle: "Hai bisogno di aiuto?",
    call: "Chiama",
    languageLabel: "Lingue",
    homeLabel: "Torna alla homepage",
    message: "Ciao Voulamandis House. Arriverò circa alle: ____ . Arrivo da: aeroporto di Chios / porto di Chios / porto di Mesta.",
    routes: routesIt,
  },
  es: {
    badge: "Guía de llegada Voulamandis House",
    title: "Cómo llegar a Voulamandis House",
    intro: "Instrucciones sencillas desde el aeropuerto de Chios, el puerto de Chios y el puerto de Mesta.",
    arrivalTitle: "1. Envíenos su información de llegada",
    arrivalText: "Antes de salir, indíquenos la hora aproximada de llegada y desde dónde llega.",
    whatsapp: "Enviar por WhatsApp",
    sms: "Enviar por SMS",
    email: "Enviar por e-mail",
    emailContact: "E-mail",
    emailSubject: "Información de llegada a Voulamandis House",
    warningTitle: "Advertencia importante de Google Maps",
    warningText: "En Google Maps, siga la calle Dimarchou Kalvokoresi y no la calle Chalkousi Zanni. Nuestra dirección es Dimarchou Kalvokoresi 117.",
    helpTitle: "¿Necesita ayuda?",
    call: "Llamar",
    languageLabel: "Idiomas",
    homeLabel: "Volver a la página principal",
    message: "Hola Voulamandis House. Llegaré aproximadamente a las: ____ . Llego desde: aeropuerto de Chios / puerto de Chios / puerto de Mesta.",
    routes: routesEs,
  },
  tr: {
    badge: "Voulamandis House varış rehberi",
    title: "Voulamandis House’a nasıl ulaşılır",
    intro: "Chios (Sakız) Havalimanı, Chios Limanı ve Mesta Limanı’ndan kolay ulaşım talimatları.",
    arrivalTitle: "1. Varış bilgilerinizi gönderin",
    arrivalText: "Yola çıkmadan önce yaklaşık varış saatinizi ve nereden geleceğinizi bize bildirin.",
    whatsapp: "WhatsApp ile gönder",
    sms: "SMS ile gönder",
    email: "E-posta ile gönder",
    emailContact: "E-posta",
    emailSubject: "Voulamandis House varış bilgileri",
    warningTitle: "Google Maps uyarısı",
    warningText: "Google Maps’te Chalkousi Zanni Caddesi’ni değil, Dimarchou Kalvokoresi Caddesi’ni takip edin. Adresimiz: Dimarchou Kalvokoresi 117.",
    helpTitle: "Yardıma mı ihtiyacınız var?",
    call: "Ara",
    languageLabel: "Diller",
    homeLabel: "Ana sayfaya dön",
    message: "Merhaba Voulamandis House. Yaklaşık varış saatim: ____ . Geldiğim yer: Chios Havalimanı / Chios Limanı / Mesta Limanı.",
    routes: routesTr,
  },
};

function RouteCard({
  route,
  pageCopy,
}: {
  route: RouteSection;
  pageCopy: PageCopy;
}) {
  return (
    <section className="h-full w-[86vw] shrink-0 snap-start rounded-[24px] bg-white p-5 shadow-sm ring-1 ring-slate-900/10 md:w-auto md:p-6">
      <div className="grid gap-4 md:grid-cols-[1fr_280px] md:items-start">
        <div>
          <h2 className="text-2xl font-black leading-tight tracking-[-0.03em] text-slate-950 md:text-3xl">
            {route.title}
          </h2>
          <p className="mt-2 text-base leading-7 text-slate-700">{route.intro}</p>
        </div>

        <div className="grid gap-2">
          <a
            href={route.routeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-teal-800 px-5 text-center text-sm font-black uppercase tracking-[0.06em] !text-white hover:bg-teal-900"
          >
            {route.routeLabel}
          </a>

          {route.videoUrl && route.videoLabel ? (
            <a
              href={route.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-red-700 px-5 text-center text-sm font-black uppercase tracking-[0.06em] !text-white hover:bg-red-800"
            >
              ▶ {route.videoLabel}
            </a>
          ) : null}
        </div>
      </div>

      <div className="mt-4 rounded-[18px] border border-yellow-300 bg-yellow-50 p-4 text-amber-950">
        <h3 className="font-black">{pageCopy.warningTitle}</h3>
        <p className="mt-2 leading-7">{pageCopy.warningText}</p>
      </div>

      <ol className="mt-4 grid gap-2.5">
        {route.steps.map((step, index) => (
          <li
            key={step}
            className="flex gap-4 rounded-[16px] bg-slate-50 p-3.5 ring-1 ring-slate-900/5"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-sm font-black text-white">
              {index + 1}
            </span>
            <span className="leading-7 text-slate-700">{step}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}

function RoutesCarousel({ routes, pageCopy, locale }: { routes: RouteSection[]; pageCopy: PageCopy; locale: string }) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const carouselCopy = routeCarouselCopy[locale] ?? routeCarouselCopy.en;

  function scrollToNextRoute() {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const firstCard = carousel.querySelector<HTMLElement>("section");
    const scrollDistance = firstCard ? firstCard.offsetWidth + 16 : carousel.clientWidth * 0.86;
    const maxScrollLeft = carousel.scrollWidth - carousel.clientWidth;
    const shouldRestart = carousel.scrollLeft + scrollDistance >= maxScrollLeft - 8;

    carousel.scrollTo({
      left: shouldRestart ? 0 : carousel.scrollLeft + scrollDistance,
      behavior: "smooth",
    });
  }

  return (
    <div className="relative mt-4 -mx-4 overflow-hidden pl-4 md:mx-0 md:overflow-visible md:pl-0">
      <div className="mb-3 flex items-center justify-between gap-3 md:hidden">
        <p className="rounded-full bg-white/90 px-4 py-2 text-xs font-black uppercase tracking-[0.08em] text-teal-900 shadow-sm ring-1 ring-teal-900/10">
          ↔ {carouselCopy.hint}
        </p>
      </div>

      <div
        ref={carouselRef}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pr-12 [scrollbar-width:none] [-webkit-overflow-scrolling:touch] md:grid md:overflow-visible md:pr-0 [&::-webkit-scrollbar]:hidden"
      >
        {routes.map((route) => (
          <RouteCard route={route} pageCopy={pageCopy} key={route.title} />
        ))}
      </div>

      <button
        type="button"
        onClick={scrollToNextRoute}
        aria-label={carouselCopy.next}
        className="absolute right-3 top-1/2 z-10 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-slate-950 text-3xl font-black leading-none text-white shadow-xl ring-4 ring-white/80 md:hidden"
      >
        <span aria-hidden="true" className="-mt-1">›</span>
      </button>

      <div className="pointer-events-none absolute bottom-0 right-0 top-14 w-16 bg-gradient-to-l from-[#eef7f4] to-transparent md:hidden" />
    </div>
  );
}

export function PreArrivalPage({ data }: PreArrivalPageProps) {
  const pageCopy = copy[data.locale] ?? copy.en;
  const homeHref = homeLinks[data.locale] ?? homeLinks.en;

  const whatsappHref = `${preArrivalContact.whatsappBase}?text=${encodeURIComponent(pageCopy.message)}`;
  const smsHref = `${preArrivalContact.smsBase}?body=${encodeURIComponent(pageCopy.message)}`;
  const emailHref = `mailto:${preArrivalContact.email}?subject=${encodeURIComponent(
    pageCopy.emailSubject,
  )}&body=${encodeURIComponent(pageCopy.message)}`;

  return (
    <main className="min-h-screen bg-[#eef7f4] px-4 py-4 text-slate-950 md:px-6 md:py-6">
      <div className="mx-auto max-w-[980px]">
        <nav
          aria-label={pageCopy.languageLabel}
          className="mb-4 rounded-[24px] bg-white p-3 shadow-sm ring-1 ring-slate-900/10"
        >
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap justify-center gap-2 md:justify-start">
              {languageLinks.map((item) => (
                <a
                  href={item.href}
                  key={item.locale}
                  className={`rounded-full px-4 py-2 text-sm font-black transition ${
                    item.locale === data.locale
                      ? "bg-teal-800 !text-white"
                      : "bg-slate-100 !text-slate-950 hover:bg-slate-200"
                  }`}
                >
                  {item.label}
                </a>
              ))}
            </div>

            <a
              href={homeHref}
              className="inline-flex min-h-[42px] items-center justify-center rounded-full border border-slate-200 bg-white px-5 text-center text-xs font-black uppercase tracking-[0.06em] !text-slate-950 hover:bg-slate-50"
            >
              ← {pageCopy.homeLabel}
            </a>
          </div>
        </nav>

        <header className="rounded-[24px] bg-white p-5 shadow-sm ring-1 ring-slate-900/10 md:p-7">
          <span className="inline-flex rounded-full bg-teal-50 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-teal-800">
            {pageCopy.badge}
          </span>

          <h1 className="mt-4 text-3xl font-black leading-tight tracking-[-0.04em] md:text-5xl">
            {pageCopy.title}
          </h1>

          <p className="mt-3 max-w-[780px] text-lg leading-8 text-slate-700">
            {pageCopy.intro}
          </p>
        </header>

        <section className="mt-4 rounded-[24px] bg-slate-950 p-5 text-white shadow-sm md:p-7">
          <h2 className="text-2xl font-black leading-tight tracking-[-0.03em] md:text-3xl">
            {pageCopy.arrivalTitle}
          </h2>

          <p className="mt-3 max-w-[820px] text-base leading-7 text-white/75">
            {pageCopy.arrivalText}
          </p>

          <div className="mt-5 grid gap-3 md:grid-cols-3">
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[52px] items-center justify-center rounded-full bg-white px-5 text-center text-sm font-black uppercase tracking-[0.06em] !text-slate-950"
            >
              {pageCopy.whatsapp}
            </a>

            <a
              href={smsHref}
              className="inline-flex min-h-[52px] items-center justify-center rounded-full border border-white/20 px-5 text-center text-sm font-black uppercase tracking-[0.06em] !text-white"
            >
              {pageCopy.sms}
            </a>

            <a
              href={emailHref}
              className="inline-flex min-h-[52px] items-center justify-center rounded-full border border-white/20 px-5 text-center text-sm font-black uppercase tracking-[0.06em] !text-white"
            >
              {pageCopy.email}
            </a>
          </div>
        </section>

        <RoutesCarousel routes={pageCopy.routes} pageCopy={pageCopy} locale={data.locale} />

        <section className="mt-4 rounded-[24px] bg-white p-5 shadow-sm ring-1 ring-slate-900/10 md:p-6">
          <h2 className="text-2xl font-black tracking-[-0.03em]">{pageCopy.helpTitle}</h2>

          <div className="mt-4 grid gap-3 md:grid-cols-4">
            <a
              href={preArrivalContact.phoneHref}
              className="inline-flex min-h-[50px] items-center justify-center rounded-full bg-slate-950 px-4 text-center text-sm font-black uppercase tracking-[0.06em] !text-white"
            >
              {pageCopy.call}: {preArrivalContact.phoneDisplay}
            </a>

            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[50px] items-center justify-center rounded-full bg-teal-800 px-4 text-center text-sm font-black uppercase tracking-[0.06em] !text-white"
            >
              WhatsApp: {preArrivalContact.whatsappDisplay}
            </a>

            <a
              href={emailHref}
              className="inline-flex min-h-[50px] items-center justify-center rounded-full border border-slate-200 bg-white px-4 text-center text-sm font-black uppercase tracking-[0.06em] !text-slate-950"
            >
              {pageCopy.emailContact}
            </a>

            <a
              href={smsHref}
              className="inline-flex min-h-[50px] items-center justify-center rounded-full border border-slate-200 bg-white px-4 text-center text-sm font-black uppercase tracking-[0.06em] !text-slate-950"
            >
              SMS: {preArrivalContact.smsDisplay}
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}
