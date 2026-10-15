import type { LanguageCode } from "@/lib/languages";

export type AgentRoomGuideExtras = {
  breadcrumbHome: string;
  breadcrumbAgents: string;
  stats: {
    units: string;
    roomsApartments: string;
    guests: string;
    stepFree: string;
    size: string;
  };
  overview: {
    title: string;
    intro: string;
    unit: string;
    type: string;
    size: string;
    guests: string;
    beds: string;
    floor: string;
    kitchen: string;
    outdoor: string;
    view: string;
    none: string;
  };
  photoAlt: string;
  contact: {
    title: string;
    text: string;
  };
  faqTitle: string;
  faq: { question: string; answer: string }[];
};

export const agentRoomGuideExtras: Record<LanguageCode, AgentRoomGuideExtras> = {
  en: {
    breadcrumbHome: "Home",
    breadcrumbAgents: "Rooms guide for travel agents",
    stats: {
      units: "units",
      roomsApartments: "{rooms} rooms · {apartments} apartments",
      guests: "guests in total",
      stepFree: "step-free ground-floor units",
      size: "m² per unit",
    },
    overview: {
      title: "All rooms at a glance",
      intro: "Compare every unit side by side, then open the room for photos and full details.",
      unit: "Unit",
      type: "Type",
      size: "Size",
      guests: "Guests",
      beds: "Beds",
      floor: "Floor / access",
      kitchen: "Kitchen",
      outdoor: "Outdoor / view",
      view: "Details",
      none: "—",
    },
    photoAlt: "{name} at Voulamandis House, Kambos Chios – {category}, photo {index}",
    contact: {
      title: "Planning a group or a series of stays?",
      text: "Send us the room allocation, your dates and the number of guests. We reply directly with availability and rates.",
    },
    faqTitle: "Questions from travel agents",
    faq: [
      {
        question: "How many rooms and guests can Voulamandis House host?",
        answer: "Voulamandis House in Kambos, Chios has {units} units: {rooms} rooms and {apartments} apartments, for up to {guests} guests in total when every unit is booked.",
      },
      {
        question: "Which rooms are step-free?",
        answer: "Units {stepFree} are on the ground floor and need no stairs. The other rooms are on the first floor and are reached by stairs.",
      },
      {
        question: "Which units have a kitchen?",
        answer: "Apartments {kitchens} have a full kitchen and rooms {kitchenettes} have a kitchenette. The standard amenities of every unit are listed on this page.",
      },
      {
        question: "How can a travel agent request availability and rates?",
        answer: "Prices are not shown on this page. Select the rooms, enter the guests for each room and send the allocation by email or WhatsApp; we reply with availability and rates for your dates.",
      },
    ],
  },
  el: {
    breadcrumbHome: "Αρχική",
    breadcrumbAgents: "Οδηγός δωματίων για πράκτορες",
    stats: {
      units: "καταλύματα",
      roomsApartments: "{rooms} δωμάτια · {apartments} διαμερίσματα",
      guests: "άτομα συνολικά",
      stepFree: "ισόγεια χωρίς σκαλιά",
      size: "m² ανά κατάλυμα",
    },
    overview: {
      title: "Όλα τα δωμάτια με μια ματιά",
      intro: "Συγκρίνετε όλα τα καταλύματα δίπλα-δίπλα και ανοίξτε το δωμάτιο για φωτογραφίες και πλήρη στοιχεία.",
      unit: "Κατάλυμα",
      type: "Τύπος",
      size: "Εμβαδόν",
      guests: "Άτομα",
      beds: "Κρεβάτια",
      floor: "Όροφος / πρόσβαση",
      kitchen: "Κουζίνα",
      outdoor: "Εξωτερικός χώρος / θέα",
      view: "Λεπτομέρειες",
      none: "—",
    },
    photoAlt: "{name} στο Voulamandis House, Κάμπος Χίου – {category}, φωτογραφία {index}",
    contact: {
      title: "Οργανώνετε γκρουπ ή σειρά διαμονών;",
      text: "Στείλτε μας την κατανομή δωματίων, τις ημερομηνίες και τον αριθμό των ατόμων. Απαντάμε απευθείας με διαθεσιμότητα και τιμές.",
    },
    faqTitle: "Ερωτήσεις τουριστικών πρακτόρων",
    faq: [
      {
        question: "Πόσα δωμάτια και πόσα άτομα φιλοξενεί το Voulamandis House;",
        answer: "Το Voulamandis House στον Κάμπο της Χίου έχει {units} καταλύματα: {rooms} δωμάτια και {apartments} διαμερίσματα, για έως {guests} άτομα συνολικά όταν κλειστούν όλα.",
      },
      {
        question: "Ποια δωμάτια δεν έχουν σκαλιά;",
        answer: "Τα καταλύματα {stepFree} είναι ισόγεια και δεν χρειάζονται σκαλιά. Τα υπόλοιπα δωμάτια είναι στον πρώτο όροφο, με πρόσβαση από σκάλα.",
      },
      {
        question: "Ποια καταλύματα έχουν κουζίνα;",
        answer: "Τα διαμερίσματα {kitchens} έχουν πλήρη κουζίνα και τα δωμάτια {kitchenettes} έχουν μικρή κουζίνα (kitchenette). Οι βασικές παροχές κάθε καταλύματος αναφέρονται σε αυτή τη σελίδα.",
      },
      {
        question: "Πώς ζητά ένας πράκτορας διαθεσιμότητα και τιμές;",
        answer: "Οι τιμές δεν εμφανίζονται σε αυτή τη σελίδα. Επιλέξτε τα δωμάτια, δηλώστε τα άτομα ανά δωμάτιο και στείλτε την κατανομή με email ή WhatsApp· απαντάμε με διαθεσιμότητα και τιμές για τις ημερομηνίες σας.",
      },
    ],
  },
  fr: {
    breadcrumbHome: "Accueil",
    breadcrumbAgents: "Guide des chambres pour agences",
    stats: {
      units: "logements",
      roomsApartments: "{rooms} chambres · {apartments} appartements",
      guests: "voyageurs au total",
      stepFree: "logements de plain-pied",
      size: "m² par logement",
    },
    overview: {
      title: "Toutes les chambres en un coup d’œil",
      intro: "Comparez tous les logements côte à côte, puis ouvrez une chambre pour voir les photos et tous les détails.",
      unit: "Logement",
      type: "Type",
      size: "Surface",
      guests: "Personnes",
      beds: "Lits",
      floor: "Étage / accès",
      kitchen: "Cuisine",
      outdoor: "Extérieur / vue",
      view: "Détails",
      none: "—",
    },
    photoAlt: "{name} à Voulamandis House, Kambos Chios – {category}, photo {index}",
    contact: {
      title: "Vous organisez un groupe ou plusieurs séjours ?",
      text: "Envoyez-nous la répartition des chambres, vos dates et le nombre de voyageurs. Nous répondons directement avec les disponibilités et les tarifs.",
    },
    faqTitle: "Questions des agences de voyage",
    faq: [
      {
        question: "Combien de chambres et de voyageurs Voulamandis House peut-il accueillir ?",
        answer: "Voulamandis House, à Kambos (Chios), compte {units} logements : {rooms} chambres et {apartments} appartements, pour {guests} voyageurs au maximum lorsque tous les logements sont réservés.",
      },
      {
        question: "Quelles chambres sont sans marches ?",
        answer: "Les logements {stepFree} sont au rez-de-chaussée, sans marches. Les autres chambres sont au premier étage et accessibles par un escalier.",
      },
      {
        question: "Quels logements ont une cuisine ?",
        answer: "Les appartements {kitchens} disposent d’une cuisine complète et les chambres {kitchenettes} d’une kitchenette. Les équipements standard de chaque logement figurent sur cette page.",
      },
      {
        question: "Comment une agence demande-t-elle disponibilités et tarifs ?",
        answer: "Les prix ne sont pas affichés sur cette page. Sélectionnez les chambres, indiquez les voyageurs par chambre et envoyez la répartition par e-mail ou WhatsApp ; nous répondons avec les disponibilités et les tarifs pour vos dates.",
      },
    ],
  },
  de: {
    breadcrumbHome: "Startseite",
    breadcrumbAgents: "Zimmerguide für Reisebüros",
    stats: {
      units: "Einheiten",
      roomsApartments: "{rooms} Zimmer · {apartments} Apartments",
      guests: "Gäste insgesamt",
      stepFree: "stufenlose Einheiten im Erdgeschoss",
      size: "m² pro Einheit",
    },
    overview: {
      title: "Alle Zimmer auf einen Blick",
      intro: "Vergleichen Sie alle Einheiten nebeneinander und öffnen Sie ein Zimmer für Fotos und alle Details.",
      unit: "Einheit",
      type: "Typ",
      size: "Größe",
      guests: "Gäste",
      beds: "Betten",
      floor: "Etage / Zugang",
      kitchen: "Küche",
      outdoor: "Außenbereich / Blick",
      view: "Details",
      none: "—",
    },
    photoAlt: "{name} im Voulamandis House, Kambos Chios – {category}, Foto {index}",
    contact: {
      title: "Sie planen eine Gruppe oder mehrere Aufenthalte?",
      text: "Senden Sie uns die Zimmeraufteilung, Ihre Daten und die Anzahl der Gäste. Wir antworten direkt mit Verfügbarkeit und Preisen.",
    },
    faqTitle: "Fragen von Reisebüros",
    faq: [
      {
        question: "Wie viele Zimmer und Gäste bietet Voulamandis House?",
        answer: "Voulamandis House in Kambos auf Chios hat {units} Einheiten: {rooms} Zimmer und {apartments} Apartments, für insgesamt bis zu {guests} Gäste, wenn alle Einheiten gebucht sind.",
      },
      {
        question: "Welche Zimmer sind stufenlos erreichbar?",
        answer: "Die Einheiten {stepFree} liegen im Erdgeschoss und sind ohne Treppen erreichbar. Die übrigen Zimmer liegen im ersten Stock und werden über eine Treppe erreicht.",
      },
      {
        question: "Welche Einheiten haben eine Küche?",
        answer: "Die Apartments {kitchens} haben eine voll ausgestattete Küche, die Zimmer {kitchenettes} eine Kochnische. Die Standardausstattung jeder Einheit ist auf dieser Seite aufgeführt.",
      },
      {
        question: "Wie fragt ein Reisebüro Verfügbarkeit und Preise an?",
        answer: "Auf dieser Seite werden keine Preise angezeigt. Wählen Sie die Zimmer, tragen Sie die Gäste pro Zimmer ein und senden Sie die Aufteilung per E-Mail oder WhatsApp; wir antworten mit Verfügbarkeit und Preisen für Ihre Daten.",
      },
    ],
  },
  it: {
    breadcrumbHome: "Home",
    breadcrumbAgents: "Guida camere per agenzie",
    stats: {
      units: "unità",
      roomsApartments: "{rooms} camere · {apartments} appartamenti",
      guests: "ospiti in totale",
      stepFree: "unità al piano terra senza gradini",
      size: "m² per unità",
    },
    overview: {
      title: "Tutte le camere a colpo d’occhio",
      intro: "Confronta tutte le unità fianco a fianco, poi apri la camera per foto e dettagli completi.",
      unit: "Unità",
      type: "Tipo",
      size: "Superficie",
      guests: "Ospiti",
      beds: "Letti",
      floor: "Piano / accesso",
      kitchen: "Cucina",
      outdoor: "Esterno / vista",
      view: "Dettagli",
      none: "—",
    },
    photoAlt: "{name} a Voulamandis House, Kambos Chios – {category}, foto {index}",
    contact: {
      title: "Organizzi un gruppo o più soggiorni?",
      text: "Inviaci l’assegnazione delle camere, le date e il numero di ospiti. Rispondiamo direttamente con disponibilità e tariffe.",
    },
    faqTitle: "Domande delle agenzie di viaggio",
    faq: [
      {
        question: "Quante camere e quanti ospiti può accogliere Voulamandis House?",
        answer: "Voulamandis House a Kambos, Chios, ha {units} unità: {rooms} camere e {apartments} appartamenti, per un massimo di {guests} ospiti in totale quando tutte le unità sono prenotate.",
      },
      {
        question: "Quali camere sono senza gradini?",
        answer: "Le unità {stepFree} sono al piano terra e non hanno gradini. Le altre camere sono al primo piano e si raggiungono con le scale.",
      },
      {
        question: "Quali unità hanno una cucina?",
        answer: "Gli appartamenti {kitchens} hanno una cucina completa e le camere {kitchenettes} un angolo cottura. I servizi standard di ogni unità sono elencati in questa pagina.",
      },
      {
        question: "Come può un’agenzia chiedere disponibilità e tariffe?",
        answer: "I prezzi non sono mostrati in questa pagina. Seleziona le camere, inserisci gli ospiti per camera e invia l’assegnazione via e-mail o WhatsApp; rispondiamo con disponibilità e tariffe per le tue date.",
      },
    ],
  },
  es: {
    breadcrumbHome: "Inicio",
    breadcrumbAgents: "Guía de habitaciones para agencias",
    stats: {
      units: "alojamientos",
      roomsApartments: "{rooms} habitaciones · {apartments} apartamentos",
      guests: "huéspedes en total",
      stepFree: "alojamientos en planta baja sin escalones",
      size: "m² por alojamiento",
    },
    overview: {
      title: "Todas las habitaciones de un vistazo",
      intro: "Compara todos los alojamientos uno al lado del otro y abre la habitación para ver fotos y todos los detalles.",
      unit: "Alojamiento",
      type: "Tipo",
      size: "Superficie",
      guests: "Huéspedes",
      beds: "Camas",
      floor: "Planta / acceso",
      kitchen: "Cocina",
      outdoor: "Exterior / vistas",
      view: "Detalles",
      none: "—",
    },
    photoAlt: "{name} en Voulamandis House, Kambos Quíos – {category}, foto {index}",
    contact: {
      title: "¿Organizas un grupo o varias estancias?",
      text: "Envíanos la asignación de habitaciones, tus fechas y el número de huéspedes. Respondemos directamente con disponibilidad y tarifas.",
    },
    faqTitle: "Preguntas de agencias de viaje",
    faq: [
      {
        question: "¿Cuántas habitaciones y huéspedes puede alojar Voulamandis House?",
        answer: "Voulamandis House, en Kambos (Quíos), tiene {units} alojamientos: {rooms} habitaciones y {apartments} apartamentos, para un máximo de {guests} huéspedes en total cuando se reservan todos.",
      },
      {
        question: "¿Qué habitaciones no tienen escalones?",
        answer: "Los alojamientos {stepFree} están en planta baja y no tienen escalones. Las demás habitaciones están en la primera planta y se accede por escalera.",
      },
      {
        question: "¿Qué alojamientos tienen cocina?",
        answer: "Los apartamentos {kitchens} tienen cocina completa y las habitaciones {kitchenettes} tienen cocina americana. Los servicios estándar de cada alojamiento figuran en esta página.",
      },
      {
        question: "¿Cómo solicita una agencia disponibilidad y tarifas?",
        answer: "Los precios no se muestran en esta página. Selecciona las habitaciones, indica los huéspedes por habitación y envía la asignación por correo electrónico o WhatsApp; respondemos con disponibilidad y tarifas para tus fechas.",
      },
    ],
  },
  tr: {
    breadcrumbHome: "Ana sayfa",
    breadcrumbAgents: "Acenteler için oda rehberi",
    stats: {
      units: "konaklama birimi",
      roomsApartments: "{rooms} oda · {apartments} daire",
      guests: "toplam misafir",
      stepFree: "basamaksız zemin kat birimi",
      size: "birim başına m²",
    },
    overview: {
      title: "Tüm odalar tek bakışta",
      intro: "Tüm birimleri yan yana karşılaştırın, fotoğraflar ve tüm ayrıntılar için odayı açın.",
      unit: "Birim",
      type: "Tip",
      size: "Büyüklük",
      guests: "Misafir",
      beds: "Yataklar",
      floor: "Kat / erişim",
      kitchen: "Mutfak",
      outdoor: "Dış alan / manzara",
      view: "Ayrıntılar",
      none: "—",
    },
    photoAlt: "Voulamandis House, Kambos Sakız Adası – {name}, {category}, fotoğraf {index}",
    contact: {
      title: "Bir grup ya da birden fazla konaklama mı planlıyorsunuz?",
      text: "Oda dağılımını, tarihlerinizi ve misafir sayısını bize gönderin. Müsaitlik ve fiyatlarla doğrudan yanıt veriyoruz.",
    },
    faqTitle: "Seyahat acentelerinin soruları",
    faq: [
      {
        question: "Voulamandis House kaç oda ve kaç misafir ağırlayabilir?",
        answer: "Sakız Adası Kambos’taki Voulamandis House’ta {units} birim vardır: {rooms} oda ve {apartments} daire; tüm birimler rezerve edildiğinde toplam {guests} misafire kadar.",
      },
      {
        question: "Hangi odalarda basamak yok?",
        answer: "{stepFree} numaralı birimler zemin kattadır ve basamak gerektirmez. Diğer odalar birinci kattadır ve merdivenle çıkılır.",
      },
      {
        question: "Hangi birimlerde mutfak var?",
        answer: "{kitchens} numaralı dairelerde tam donanımlı mutfak, {kitchenettes} numaralı odalarda mini mutfak bulunur. Her birimin standart olanakları bu sayfada listelenir.",
      },
      {
        question: "Bir acente müsaitlik ve fiyatları nasıl sorabilir?",
        answer: "Bu sayfada fiyat gösterilmez. Odaları seçin, her odadaki misafir sayısını girin ve dağılımı e-posta ya da WhatsApp ile gönderin; tarihleriniz için müsaitlik ve fiyatlarla yanıt veriyoruz.",
      },
    ],
  },
};

export type AgentGuideStats = {
  units: number;
  rooms: number;
  apartments: number;
  guests: number;
  stepFree: number[];
  kitchens: number[];
  kitchenettes: number[];
  minSize: number;
  maxSize: number;
};

type StatsRoom = {
  roomNumber: number;
  roomType: string;
  maxGuests: number;
  noStairs: boolean;
  hasFullKitchen: boolean;
  hasKitchenette: boolean;
  sizeM2: number;
};

export function computeAgentGuideStats(rooms: StatsRoom[]): AgentGuideStats {
  const sizes = rooms.map((room) => room.sizeM2).filter((value) => value > 0);
  return {
    units: rooms.length,
    rooms: rooms.filter((room) => room.roomType !== "apartment").length,
    apartments: rooms.filter((room) => room.roomType === "apartment").length,
    guests: rooms.reduce((sum, room) => sum + room.maxGuests, 0),
    stepFree: rooms.filter((room) => room.noStairs).map((room) => room.roomNumber),
    kitchens: rooms.filter((room) => room.hasFullKitchen).map((room) => room.roomNumber),
    kitchenettes: rooms.filter((room) => room.hasKitchenette).map((room) => room.roomNumber),
    minSize: sizes.length ? Math.min(...sizes) : 0,
    maxSize: sizes.length ? Math.max(...sizes) : 0,
  };
}

function listNumbers(values: number[]) {
  return values.join(", ");
}

export function fillAgentTemplate(template: string, values: Record<string, string | number>) {
  return Object.entries(values).reduce(
    (result, [key, value]) => result.replaceAll(`{${key}}`, String(value)),
    template,
  );
}

export function buildAgentGuideFaq(language: LanguageCode, stats: AgentGuideStats) {
  const values = {
    units: stats.units,
    rooms: stats.rooms,
    apartments: stats.apartments,
    guests: stats.guests,
    stepFree: listNumbers(stats.stepFree),
    kitchens: listNumbers(stats.kitchens),
    kitchenettes: listNumbers(stats.kitchenettes),
  };
  return agentRoomGuideExtras[language].faq.map((item) => ({
    question: fillAgentTemplate(item.question, values),
    answer: fillAgentTemplate(item.answer, values),
  }));
}
