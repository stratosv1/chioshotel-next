import {
  familyChiosApartments,
  familyChiosApartmentsDe,
  familyChiosApartmentsEl,
  familyChiosApartmentsEs,
  familyChiosApartmentsFr,
  familyChiosApartmentsIt,
  familyChiosApartmentsTr,
  type RoomDetailData,
} from "@/content/room-details";
import type { LanguageCode } from "@/lib/languages";

type ApartmentLocale = Exclude<LanguageCode, "pl">;

type ApartmentCopy = {
  title: string;
  description: string;
  kicker: string;
  heroTitle: string;
  subtitle: string;
  heroDescription: string;
  imageAlt: string;
  overviewKicker: string;
  overviewTitle: string;
  overviewParagraphs: string[];
  individualKicker: string;
  individualTitle: string;
  individualDescription: string;
  bookingKicker: string;
  bookingTitle: string;
  bookingText: string;
};

const baseData: Record<ApartmentLocale, RoomDetailData> = {
  en: familyChiosApartments,
  el: familyChiosApartmentsEl,
  fr: familyChiosApartmentsFr,
  de: familyChiosApartmentsDe,
  it: familyChiosApartmentsIt,
  es: familyChiosApartmentsEs,
  tr: familyChiosApartmentsTr,
};

const copy: Record<ApartmentLocale, ApartmentCopy> = {
  en: {
    title: "Apartments in Chios | Family Apartments in Kambos",
    description:
      "Apartments in Chios at Voulamandis House in Kambos. Three spacious 40–45m² apartments with full kitchen, living area and space for up to 4 guests.",
    kicker: "Apartments in Chios • Voulamandis House",
    heroTitle: "Apartments in Chios",
    subtitle: "Family apartments with kitchen and extra space in Kambos",
    heroDescription:
      "Three spacious apartments with a separate bedroom, full kitchen and living area. Ideal for families, longer stays and guests who want more space and independence while staying in Chios.",
    imageAlt: "Apartments in Chios at Voulamandis House in Kambos",
    overviewKicker: "Apartments in Kambos Chios",
    overviewTitle: "Apartments in Chios for families and longer stays",
    overviewParagraphs: [
      "The apartments at Voulamandis House in Kambos offer more space and independence than a standard room, with a separate bedroom, living area and full kitchen.",
      "The category includes three 40–45m² family apartments for up to 4 guests, suitable for families, longer stays and travellers who prefer the flexibility of preparing simple meals.",
      "The peaceful Kambos location provides easy access to Chios Town, the airport and beaches while keeping the relaxed atmosphere of a small lodging surrounded by citrus gardens.",
    ],
    individualKicker: "Available apartments",
    individualTitle: "Choose the apartment in Chios that suits you",
    individualDescription:
      "Compare Apartments 8, 9 and 10. All three are independent units with kitchen, living area and space for up to 4 guests, with different layout details.",
    bookingKicker: "Direct apartment booking",
    bookingTitle: "Ask which apartment is available for your dates",
    bookingText:
      "Send us your dates and number of guests and we will suggest the most suitable available apartment at Voulamandis House.",
  },
  el: {
    title: "Διαμερίσματα στη Χίο | Οικογενειακά Διαμερίσματα",
    description:
      "Διαμερίσματα στη Χίο στο Voulamandis House στον Κάμπο. Τρία ευρύχωρα οικογενειακά διαμερίσματα 40–45m² με πλήρη κουζίνα, καθιστικό και χώρο για έως 4 άτομα.",
    kicker: "Διαμερίσματα στη Χίο • Voulamandis House",
    heroTitle: "Διαμερίσματα στη Χίο",
    subtitle: "Οικογενειακά διαμερίσματα με κουζίνα και περισσότερο χώρο στον Κάμπο",
    heroDescription:
      "Τρία ευρύχωρα διαμερίσματα 40–45m² με ξεχωριστό υπνοδωμάτιο, πλήρη κουζίνα και καθιστικό. Ιδανικά για οικογένειες, μεγαλύτερες διαμονές ή επισκέπτες που θέλουν περισσότερο χώρο και ανεξαρτησία στη Χίο.",
    imageAlt: "Διαμερίσματα στη Χίο στο Voulamandis House στον Κάμπο",
    overviewKicker: "Διαμερίσματα στον Κάμπο Χίου",
    overviewTitle: "Διαμερίσματα στη Χίο για οικογένειες και μεγαλύτερες διαμονές",
    overviewParagraphs: [
      "Τα διαμερίσματα του Voulamandis House στον Κάμπο της Χίου προσφέρουν περισσότερο χώρο και ανεξαρτησία από ένα τυπικό δωμάτιο, με ξεχωριστό υπνοδωμάτιο, καθιστικό και πλήρη κουζίνα.",
      "Η κατηγορία περιλαμβάνει τρία οικογενειακά διαμερίσματα 40–45m² για έως 4 άτομα, κατάλληλα τόσο για οικογένειες όσο και για επισκέπτες που μένουν περισσότερες νύχτες ή θέλουν τη δυνατότητα να ετοιμάζουν απλά γεύματα.",
      "Η ήσυχη τοποθεσία στον ιστορικό Κάμπο προσφέρει εύκολη πρόσβαση στην πόλη της Χίου, το αεροδρόμιο και τις παραλίες, διατηρώντας παράλληλα την αίσθηση ενός ήρεμου καταλύματος μέσα στα περιβόλια.",
    ],
    individualKicker: "Διαθέσιμα διαμερίσματα",
    individualTitle: "Επιλέξτε το διαμέρισμα στη Χίο που σας ταιριάζει",
    individualDescription:
      "Συγκρίνετε τα Διαμερίσματα 8, 9 και 10. Και τα τρία είναι ανεξάρτητες μονάδες με κουζίνα, καθιστικό και χώρο για έως 4 άτομα, με διαφορετικές λεπτομέρειες στη διαρρύθμιση.",
    bookingKicker: "Απευθείας κράτηση διαμερίσματος",
    bookingTitle: "Ρωτήστε ποιο διαμέρισμα είναι διαθέσιμο για τις ημερομηνίες σας",
    bookingText:
      "Στείλτε μας τις ημερομηνίες και τον αριθμό επισκεπτών και θα σας προτείνουμε το καταλληλότερο διαθέσιμο διαμέρισμα στο Voulamandis House.",
  },
  fr: {
    title: "Appartements à Chios | Appartements familiaux à Kambos",
    description:
      "Appartements à Chios au Voulamandis House à Kambos. Trois appartements spacieux de 40–45m² avec cuisine, séjour et capacité jusqu’à 4 personnes.",
    kicker: "Appartements à Chios • Voulamandis House",
    heroTitle: "Appartements à Chios",
    subtitle: "Appartements familiaux avec cuisine et plus d’espace à Kambos",
    heroDescription:
      "Trois appartements spacieux avec chambre séparée, cuisine complète et séjour. Idéals pour les familles, les séjours plus longs et les voyageurs qui souhaitent davantage d’espace et d’autonomie à Chios.",
    imageAlt: "Appartements à Chios au Voulamandis House à Kambos",
    overviewKicker: "Appartements à Kambos, Chios",
    overviewTitle: "Des appartements à Chios pour familles et longs séjours",
    overviewParagraphs: [
      "Les appartements du Voulamandis House à Kambos offrent plus d’espace et d’autonomie qu’une chambre classique, avec chambre séparée, séjour et cuisine complète.",
      "La catégorie comprend trois appartements familiaux de 40–45m² pour jusqu’à 4 personnes, adaptés aux familles, aux séjours prolongés et aux voyageurs qui souhaitent préparer des repas simples.",
      "Le cadre paisible de Kambos permet de rejoindre facilement la ville de Chios, l’aéroport et les plages tout en profitant d’un environnement calme au milieu des agrumes.",
    ],
    individualKicker: "Appartements disponibles",
    individualTitle: "Choisissez votre appartement à Chios",
    individualDescription:
      "Comparez les appartements 8, 9 et 10. Tous disposent d’une cuisine, d’un séjour et d’un espace pour jusqu’à 4 personnes, avec des agencements légèrement différents.",
    bookingKicker: "Réservation directe d’appartement",
    bookingTitle: "Demandez quel appartement est disponible à vos dates",
    bookingText:
      "Indiquez-nous vos dates et le nombre de personnes et nous vous proposerons l’appartement disponible le plus adapté au Voulamandis House.",
  },
  de: {
    title: "Apartments auf Chios | Familienapartments in Kambos",
    description:
      "Apartments auf Chios im Voulamandis House in Kambos. Drei geräumige Apartments mit 40–45m², Küche, Wohnbereich und Platz für bis zu 4 Gäste.",
    kicker: "Apartments auf Chios • Voulamandis House",
    heroTitle: "Apartments auf Chios",
    subtitle: "Familienapartments mit Küche und mehr Platz in Kambos",
    heroDescription:
      "Drei geräumige Apartments mit separatem Schlafzimmer, voll ausgestatteter Küche und Wohnbereich. Ideal für Familien, längere Aufenthalte und Gäste, die auf Chios mehr Platz und Unabhängigkeit wünschen.",
    imageAlt: "Apartments auf Chios im Voulamandis House in Kambos",
    overviewKicker: "Apartments in Kambos auf Chios",
    overviewTitle: "Apartments auf Chios für Familien und längere Aufenthalte",
    overviewParagraphs: [
      "Die Apartments im Voulamandis House in Kambos bieten mehr Platz und Unabhängigkeit als ein klassisches Zimmer, mit separatem Schlafzimmer, Wohnbereich und voll ausgestatteter Küche.",
      "Zur Kategorie gehören drei Familienapartments mit 40–45m² für bis zu 4 Gäste. Sie eignen sich für Familien, längere Aufenthalte und Reisende, die einfache Mahlzeiten selbst zubereiten möchten.",
      "Die ruhige Lage in Kambos bietet eine gute Anbindung an Chios-Stadt, den Flughafen und die Strände und bewahrt gleichzeitig die entspannte Atmosphäre zwischen Zitrusgärten.",
    ],
    individualKicker: "Verfügbare Apartments",
    individualTitle: "Wählen Sie Ihr Apartment auf Chios",
    individualDescription:
      "Vergleichen Sie die Apartments 8, 9 und 10. Alle drei bieten Küche, Wohnbereich und Platz für bis zu 4 Gäste, mit unterschiedlichen Details bei der Aufteilung.",
    bookingKicker: "Apartment direkt buchen",
    bookingTitle: "Fragen Sie, welches Apartment zu Ihren Daten verfügbar ist",
    bookingText:
      "Nennen Sie uns Ihre Reisedaten und Gästezahl, und wir empfehlen Ihnen das passendste verfügbare Apartment im Voulamandis House.",
  },
  it: {
    title: "Appartamenti a Chios | Appartamenti familiari a Kambos",
    description:
      "Appartamenti a Chios al Voulamandis House di Kambos. Tre appartamenti spaziosi di 40–45m² con cucina, zona giorno e spazio fino a 4 ospiti.",
    kicker: "Appartamenti a Chios • Voulamandis House",
    heroTitle: "Appartamenti a Chios",
    subtitle: "Appartamenti familiari con cucina e più spazio a Kambos",
    heroDescription:
      "Tre appartamenti spaziosi con camera separata, cucina completa e zona giorno. Ideali per famiglie, soggiorni più lunghi e ospiti che desiderano più spazio e indipendenza durante il soggiorno a Chios.",
    imageAlt: "Appartamenti a Chios al Voulamandis House di Kambos",
    overviewKicker: "Appartamenti a Kambos, Chios",
    overviewTitle: "Appartamenti a Chios per famiglie e soggiorni più lunghi",
    overviewParagraphs: [
      "Gli appartamenti del Voulamandis House a Kambos offrono più spazio e indipendenza rispetto a una camera tradizionale, con camera separata, zona giorno e cucina completa.",
      "La categoria comprende tre appartamenti familiari di 40–45m² per un massimo di 4 ospiti, adatti a famiglie, soggiorni prolungati e viaggiatori che preferiscono preparare pasti semplici.",
      "La posizione tranquilla a Kambos permette di raggiungere facilmente la città di Chios, l’aeroporto e le spiagge, mantenendo l’atmosfera rilassata tra gli agrumeti.",
    ],
    individualKicker: "Appartamenti disponibili",
    individualTitle: "Scegli l’appartamento a Chios più adatto a te",
    individualDescription:
      "Confronta gli appartamenti 8, 9 e 10. Tutti dispongono di cucina, zona giorno e spazio per un massimo di 4 ospiti, con alcune differenze nella disposizione.",
    bookingKicker: "Prenotazione diretta appartamento",
    bookingTitle: "Chiedi quale appartamento è disponibile nelle tue date",
    bookingText:
      "Indicaci le date e il numero di ospiti e ti suggeriremo l’appartamento disponibile più adatto al Voulamandis House.",
  },
  es: {
    title: "Apartamentos en Quíos | Apartamentos familiares en Kambos",
    description:
      "Apartamentos en Quíos en Voulamandis House, Kambos. Tres apartamentos amplios de 40–45m² con cocina, zona de estar y capacidad para hasta 4 personas.",
    kicker: "Apartamentos en Quíos • Voulamandis House",
    heroTitle: "Apartamentos en Quíos",
    subtitle: "Apartamentos familiares con cocina y más espacio en Kambos",
    heroDescription:
      "Tres apartamentos amplios con dormitorio separado, cocina completa y zona de estar. Ideales para familias, estancias más largas y huéspedes que buscan más espacio e independencia durante su estancia en Quíos.",
    imageAlt: "Apartamentos en Quíos en Voulamandis House, Kambos",
    overviewKicker: "Apartamentos en Kambos, Quíos",
    overviewTitle: "Apartamentos en Quíos para familias y estancias más largas",
    overviewParagraphs: [
      "Los apartamentos de Voulamandis House en Kambos ofrecen más espacio e independencia que una habitación convencional, con dormitorio separado, zona de estar y cocina completa.",
      "La categoría incluye tres apartamentos familiares de 40–45m² para hasta 4 personas, adecuados para familias, estancias prolongadas y viajeros que prefieren preparar comidas sencillas.",
      "La tranquila ubicación en Kambos permite llegar fácilmente a la ciudad de Quíos, al aeropuerto y a las playas, manteniendo un ambiente relajado entre cítricos.",
    ],
    individualKicker: "Apartamentos disponibles",
    individualTitle: "Elige el apartamento en Quíos que mejor te encaje",
    individualDescription:
      "Compara los apartamentos 8, 9 y 10. Los tres tienen cocina, zona de estar y espacio para hasta 4 personas, con pequeñas diferencias de distribución.",
    bookingKicker: "Reserva directa de apartamento",
    bookingTitle: "Consulta qué apartamento está disponible en tus fechas",
    bookingText:
      "Indícanos tus fechas y número de huéspedes y te recomendaremos el apartamento disponible más adecuado en Voulamandis House.",
  },
  tr: {
    title: "Sakız Adası Daireleri | Kambos Aile Daireleri",
    description:
      "Sakız Adası'nda Kambos bölgesindeki Voulamandis House'ta daireler. 40–45m² üç geniş daire; mutfak, yaşam alanı ve 4 kişiye kadar konaklama.",
    kicker: "Sakız Adası daireleri • Voulamandis House",
    heroTitle: "Sakız Adası Daireleri",
    subtitle: "Kambos'ta mutfaklı ve geniş aile daireleri",
    heroDescription:
      "Ayrı yatak odası, tam mutfak ve yaşam alanı bulunan üç geniş daire. Aileler, uzun konaklamalar ve Sakız Adası'nda daha fazla alan ve bağımsızlık isteyen misafirler için uygundur.",
    imageAlt: "Kambos Voulamandis House'ta Sakız Adası daireleri",
    overviewKicker: "Kambos Sakız Adası daireleri",
    overviewTitle: "Aileler ve uzun konaklamalar için Sakız Adası daireleri",
    overviewParagraphs: [
      "Kambos'taki Voulamandis House daireleri, ayrı yatak odası, yaşam alanı ve tam mutfak ile standart bir odaya göre daha fazla alan ve bağımsızlık sunar.",
      "Kategori, 4 kişiye kadar konaklama sağlayan 40–45m² üç aile dairesinden oluşur; aileler, uzun konaklayanlar ve basit yemeklerini hazırlamak isteyen misafirler için uygundur.",
      "Kambos'un sakin konumu Sakız merkezine, havaalanına ve plajlara kolay ulaşım sağlarken narenciye bahçeleri arasındaki huzurlu atmosferi korur.",
    ],
    individualKicker: "Mevcut daireler",
    individualTitle: "Size uygun Sakız Adası dairesini seçin",
    individualDescription:
      "Daire 8, 9 ve 10'u karşılaştırın. Üçü de mutfak, yaşam alanı ve 4 kişiye kadar konaklama sunar; yerleşim detayları farklıdır.",
    bookingKicker: "Doğrudan daire rezervasyonu",
    bookingTitle: "Tarihleriniz için hangi dairenin müsait olduğunu sorun",
    bookingText:
      "Tarihlerinizi ve kişi sayısını gönderin; Voulamandis House'taki en uygun müsait daireyi önerelim.",
  },
};

export function getApartmentIntentData(locale: ApartmentLocale): RoomDetailData {
  const base = baseData[locale];
  const text = copy[locale];

  return {
    ...base,
    seo: {
      ...base.seo,
      title: text.title,
      description: text.description,
    },
    hero: {
      ...base.hero,
      kicker: text.kicker,
      title: text.heroTitle,
      subtitle: text.subtitle,
      description: text.heroDescription,
      imageAlt: text.imageAlt,
    },
    overview: {
      ...base.overview,
      kicker: text.overviewKicker,
      title: text.overviewTitle,
      paragraphs: text.overviewParagraphs,
    },
    individualRooms: {
      ...base.individualRooms,
      kicker: text.individualKicker,
      title: text.individualTitle,
      description: text.individualDescription,
    },
    booking: {
      ...base.booking,
      kicker: text.bookingKicker,
      title: text.bookingTitle,
      text: text.bookingText,
    },
  };
}
