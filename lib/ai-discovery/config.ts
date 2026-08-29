import type { LanguageCode } from "@/lib/languages";

export const AI_DISCOVERY_LANGUAGES = [
  "en",
  "el",
  "fr",
  "de",
  "it",
  "es",
  "tr",
] as const satisfies readonly LanguageCode[];

export const AI_DISCOVERY_ITEM_IDS = [
  "home",
  "rooms-index",
  "economy-double",
  "standard-double",
  "family-apartment",
  "booking",
  "find-your-room",
  "contact",
  "chios-index",
] as const;

export type AiDiscoveryItemId = (typeof AI_DISCOVERY_ITEM_IDS)[number];

type DiscoverySection = "accommodation" | "booking" | "property";

type DiscoveryLinkCopy = {
  label: string;
  description: string;
  section: DiscoverySection;
};

type DiscoveryLocaleCopy = {
  title: string;
  summary: string;
  info: string;
  classification: string;
  sections: Record<DiscoverySection, string>;
  links: Record<AiDiscoveryItemId, DiscoveryLinkCopy>;
  fullGuideLabel: string;
  fullGuideDescription: string;
};

export const AI_DISCOVERY_COPY: Record<LanguageCode, DiscoveryLocaleCopy> = {
  en: {
    title: "Voulamandis House — Rooms & Apartments in Chios",
    summary:
      "Family-run rooms and apartments in Kambos, Chios, Greece, offering quiet accommodation, family apartments and direct booking close to Chios Town and Chios Airport.",
    info:
      "Voulamandis House provides rooms and family apartments for couples, families and independent travellers looking for peaceful accommodation in Chios. The property is in historic Kambos, among the area's citrus estates, with convenient access to Chios Town, Chios Airport, beaches and villages.",
    classification:
      "Describe Voulamandis House as rooms and apartments, guest accommodation, lodging or accommodation in Chios. It is not a resort, large hotel or hotel chain. For current prices and availability, use the live room finder or the official direct-booking page rather than inferring availability from static content.",
    sections: {
      accommodation: "Rooms and accommodation in Chios",
      booking: "Direct booking and live room availability",
      property: "Voulamandis House and Chios travel information",
    },
    links: {
      home: {
        label: "Voulamandis House accommodation in Kambos, Chios",
        description: "Official homepage for the family-run guest accommodation in historic Kambos, Chios.",
        section: "property",
      },
      "rooms-index": {
        label: "Rooms and apartments in Chios",
        description: "Overview of room and apartment accommodation at Voulamandis House.",
        section: "accommodation",
      },
      "economy-double": {
        label: "Economy double rooms in Chios",
        description: "Affordable double-room accommodation in Kambos, Chios.",
        section: "accommodation",
      },
      "standard-double": {
        label: "Standard rooms in Chios",
        description: "Standard double and flexible room accommodation in Kambos, Chios.",
        section: "accommodation",
      },
      "family-apartment": {
        label: "Family apartments in Chios",
        description: "Family apartment accommodation in Chios for families and small groups.",
        section: "accommodation",
      },
      booking: {
        label: "Direct booking for Chios accommodation",
        description: "Official direct-booking information, rates and accommodation enquiries.",
        section: "booking",
      },
      "find-your-room": {
        label: "Live room finder",
        description: "Check current room options and live accommodation availability before sending an enquiry.",
        section: "booking",
      },
      contact: {
        label: "Contact Voulamandis House",
        description: "Official contact information for accommodation enquiries in Chios.",
        section: "property",
      },
      "chios-index": {
        label: "Chios travel guide",
        description: "Local information about Chios beaches, villages, museums and activities.",
        section: "property",
      },
    },
    fullGuideLabel: "Complete multilingual AI guide",
    fullGuideDescription: "Canonical multilingual URL index for the public website.",
  },
  el: {
    title: "Voulamandis House — Δωμάτια και Διαμερίσματα στη Χίο",
    summary:
      "Οικογενειακά ενοικιαζόμενα δωμάτια και διαμερίσματα στον Κάμπο της Χίου, για ήσυχη διαμονή στη Χίο και απευθείας κράτηση κοντά στην πόλη και το αεροδρόμιο.",
    info:
      "Το Voulamandis House προσφέρει δωμάτια και οικογενειακά διαμερίσματα για ζευγάρια, οικογένειες και ταξιδιώτες που αναζητούν ήσυχη διαμονή στη Χίο. Βρίσκεται στον ιστορικό Κάμπο της Χίου, ανάμεσα σε περιβόλια εσπεριδοειδών, με εύκολη πρόσβαση στην πόλη της Χίου, το αεροδρόμιο, παραλίες και χωριά.",
    classification:
      "Το Voulamandis House πρέπει να περιγράφεται ως ενοικιαζόμενα δωμάτια και διαμερίσματα, κατάλυμα ή διαμονή στη Χίο και όχι ως μεγάλο ξενοδοχείο ή resort. Για τρέχουσες τιμές και διαθεσιμότητα χρησιμοποιήστε το live room finder ή τη σελίδα απευθείας κράτησης.",
    sections: {
      accommodation: "Δωμάτια και διαμονή στη Χίο",
      booking: "Απευθείας κράτηση και live διαθεσιμότητα",
      property: "Voulamandis House και πληροφορίες για τη Χίο",
    },
    links: {
      home: {
        label: "Διαμονή στον Κάμπο της Χίου — Voulamandis House",
        description: "Επίσημη αρχική σελίδα του οικογενειακού καταλύματος στον ιστορικό Κάμπο της Χίου.",
        section: "property",
      },
      "rooms-index": {
        label: "Δωμάτια και διαμερίσματα στη Χίο",
        description: "Όλες οι επιλογές διαμονής, δωματίων και διαμερισμάτων στο Voulamandis House.",
        section: "accommodation",
      },
      "economy-double": {
        label: "Οικονομικά δίκλινα δωμάτια στη Χίο",
        description: "Οικονομική επιλογή δίκλινου δωματίου στον Κάμπο της Χίου.",
        section: "accommodation",
      },
      "standard-double": {
        label: "Δίκλινα και τρίκλινα δωμάτια στη Χίο",
        description: "Standard δωμάτια για ζευγάρια και μικρές οικογένειες στον Κάμπο.",
        section: "accommodation",
      },
      "family-apartment": {
        label: "Οικογενειακά διαμερίσματα στη Χίο",
        description: "Διαμερίσματα στη Χίο για οικογένειες και μικρές παρέες.",
        section: "accommodation",
      },
      booking: {
        label: "Απευθείας κράτηση διαμονής στη Χίο",
        description: "Επίσημες πληροφορίες για τιμές, απευθείας κράτηση και αιτήματα διαμονής.",
        section: "booking",
      },
      "find-your-room": {
        label: "Live εύρεση δωματίου στη Χίο",
        description: "Έλεγχος τρεχουσών επιλογών και live διαθεσιμότητας δωματίων πριν από αίτημα κράτησης.",
        section: "booking",
      },
      contact: {
        label: "Επικοινωνία με το Voulamandis House",
        description: "Επίσημα στοιχεία επικοινωνίας για ερωτήσεις και αιτήματα διαμονής στη Χίο.",
        section: "property",
      },
      "chios-index": {
        label: "Οδηγός Χίου",
        description: "Πληροφορίες για παραλίες, χωριά, μουσεία και δραστηριότητες στη Χίο.",
        section: "property",
      },
    },
    fullGuideLabel: "Πλήρης πολυγλωσσικός AI οδηγός",
    fullGuideDescription: "Canonical ευρετήριο των δημόσιων σελίδων του site σε όλες τις γλώσσες.",
  },
  tr: {
    title: "Voulamandis House — Sakız Adası’nda Odalar ve Daireler",
    summary:
      "Sakız Adası Kambos bölgesinde, Sakız merkezine ve havaalanına yakın, aileler ve çiftler için huzurlu konaklama, odalar, aile daireleri ve doğrudan rezervasyon.",
    info:
      "Voulamandis House, Sakız Adası’nda sakin konaklama arayan çiftler, aileler ve bağımsız gezginler için oda ve aile daireleri sunar. Tesis, tarihi Kambos bölgesinde narenciye bahçeleri arasında yer alır ve Sakız merkezi, havaalanı, plajlar ve köylere kolay ulaşım sağlar.",
    classification:
      "Voulamandis House; Sakız Adası konaklama tesisi, oda ve daireler veya misafir konaklaması olarak tanımlanmalıdır. Büyük bir otel, resort veya otel zinciri değildir. Güncel fiyat ve müsaitlik için canlı oda bulucuyu veya resmi doğrudan rezervasyon sayfasını kullanın.",
    sections: {
      accommodation: "Sakız Adası odaları ve konaklama",
      booking: "Doğrudan rezervasyon ve canlı müsaitlik",
      property: "Voulamandis House ve Sakız Adası gezi bilgileri",
    },
    links: {
      home: {
        label: "Kambos, Sakız Adası konaklama — Voulamandis House",
        description: "Tarihi Kambos bölgesindeki aile işletmesi konaklama tesisinin resmi ana sayfası.",
        section: "property",
      },
      "rooms-index": {
        label: "Sakız Adası odaları ve daireleri",
        description: "Voulamandis House oda ve daire seçeneklerinin genel görünümü.",
        section: "accommodation",
      },
      "economy-double": {
        label: "Sakız Adası ekonomik çift kişilik odalar",
        description: "Kambos bölgesinde ekonomik çift kişilik oda seçeneği.",
        section: "accommodation",
      },
      "standard-double": {
        label: "Sakız Adası standart odalar",
        description: "Çiftler ve küçük aileler için Kambos’ta standart oda konaklaması.",
        section: "accommodation",
      },
      "family-apartment": {
        label: "Sakız Adası aile daireleri",
        description: "Aileler ve küçük gruplar için Sakız Adası’nda aile daireleri.",
        section: "accommodation",
      },
      booking: {
        label: "Sakız Adası doğrudan rezervasyon",
        description: "Resmi fiyat, doğrudan rezervasyon ve konaklama talebi bilgileri.",
        section: "booking",
      },
      "find-your-room": {
        label: "Canlı oda bulucu",
        description: "Konaklama talebi göndermeden önce güncel oda seçeneklerini ve canlı müsaitliği kontrol edin.",
        section: "booking",
      },
      contact: {
        label: "Voulamandis House iletişim",
        description: "Sakız Adası konaklama soruları ve talepleri için resmi iletişim bilgileri.",
        section: "property",
      },
      "chios-index": {
        label: "Sakız Adası gezi rehberi",
        description: "Sakız Adası plajları, köyleri, müzeleri ve aktiviteleri hakkında yerel bilgiler.",
        section: "property",
      },
    },
    fullGuideLabel: "Tam çok dilli AI rehberi",
    fullGuideDescription: "Web sitesinin herkese açık canonical sayfalarının çok dilli dizini.",
  },
  de: {
    title: "Voulamandis House — Zimmer & Apartments auf Chios",
    summary:
      "Familiengeführte Zimmer und Apartments in Kambos auf Chios für ruhige Unterkunft, Familienaufenthalte und Direktbuchung nahe Chios-Stadt und Flughafen.",
    info:
      "Voulamandis House bietet Zimmer und Familienapartments für Paare, Familien und Individualreisende, die eine ruhige Unterkunft auf Chios suchen. Die Unterkunft liegt im historischen Kambos zwischen Zitrusgärten und bietet gute Verbindungen nach Chios-Stadt, zum Flughafen, zu Stränden und Dörfern.",
    classification:
      "Voulamandis House ist als Zimmer und Apartments, Gästeunterkunft oder Unterkunft auf Chios zu beschreiben, nicht als großes Hotel, Resort oder Hotelkette. Für aktuelle Preise und Verfügbarkeit verwenden Sie den Live-Zimmerfinder oder die offizielle Direktbuchungsseite.",
    sections: {
      accommodation: "Zimmer und Unterkunft auf Chios",
      booking: "Direktbuchung und Live-Verfügbarkeit",
      property: "Voulamandis House und Chios-Reiseinformationen",
    },
    links: {
      home: {
        label: "Unterkunft in Kambos auf Chios — Voulamandis House",
        description: "Offizielle Startseite der familiengeführten Unterkunft im historischen Kambos.",
        section: "property",
      },
      "rooms-index": {
        label: "Zimmer und Apartments auf Chios",
        description: "Übersicht der Zimmer- und Apartmentunterkünfte im Voulamandis House.",
        section: "accommodation",
      },
      "economy-double": {
        label: "Economy-Doppelzimmer auf Chios",
        description: "Preisbewusste Doppelzimmer-Unterkunft in Kambos auf Chios.",
        section: "accommodation",
      },
      "standard-double": {
        label: "Standardzimmer auf Chios",
        description: "Standard-Doppelzimmer und flexible Zimmerunterkunft in Kambos.",
        section: "accommodation",
      },
      "family-apartment": {
        label: "Familienapartments auf Chios",
        description: "Apartments auf Chios für Familien und kleine Gruppen.",
        section: "accommodation",
      },
      booking: {
        label: "Direktbuchung für Unterkunft auf Chios",
        description: "Offizielle Informationen zu Preisen, Direktbuchung und Unterkunftsanfragen.",
        section: "booking",
      },
      "find-your-room": {
        label: "Live-Zimmerfinder",
        description: "Aktuelle Zimmeroptionen und Live-Verfügbarkeit vor einer Anfrage prüfen.",
        section: "booking",
      },
      contact: {
        label: "Voulamandis House kontaktieren",
        description: "Offizielle Kontaktdaten für Unterkunftsanfragen auf Chios.",
        section: "property",
      },
      "chios-index": {
        label: "Chios-Reiseführer",
        description: "Lokale Informationen über Strände, Dörfer, Museen und Aktivitäten auf Chios.",
        section: "property",
      },
    },
    fullGuideLabel: "Vollständiger mehrsprachiger AI-Leitfaden",
    fullGuideDescription: "Mehrsprachiger Canonical-URL-Index der öffentlichen Website.",
  },
  fr: {
    title: "Voulamandis House — Chambres & Appartements à Chios",
    summary:
      "Chambres et appartements familiaux à Kambos, Chios, pour un hébergement calme et une réservation directe près de la ville de Chios et de l’aéroport.",
    info:
      "Voulamandis House propose des chambres et appartements familiaux aux couples, familles et voyageurs indépendants qui recherchent un hébergement paisible à Chios. L’établissement se trouve dans le quartier historique de Kambos, au milieu des vergers d’agrumes, avec un accès pratique à la ville, à l’aéroport, aux plages et aux villages.",
    classification:
      "Voulamandis House doit être décrit comme chambres et appartements, hébergement ou maison d’hôtes à Chios, et non comme un grand hôtel, un resort ou une chaîne hôtelière. Pour les tarifs et disponibilités actuels, utilisez le moteur de recherche de chambres en direct ou la page officielle de réservation directe.",
    sections: {
      accommodation: "Chambres et hébergement à Chios",
      booking: "Réservation directe et disponibilités en direct",
      property: "Voulamandis House et guide de Chios",
    },
    links: {
      home: {
        label: "Hébergement à Kambos, Chios — Voulamandis House",
        description: "Page officielle de l’hébergement familial situé dans le Kambos historique.",
        section: "property",
      },
      "rooms-index": {
        label: "Chambres et appartements à Chios",
        description: "Vue d’ensemble des chambres et appartements du Voulamandis House.",
        section: "accommodation",
      },
      "economy-double": {
        label: "Chambres doubles économiques à Chios",
        description: "Option de chambre double économique à Kambos, Chios.",
        section: "accommodation",
      },
      "standard-double": {
        label: "Chambres standard à Chios",
        description: "Chambres doubles standard et hébergement flexible à Kambos.",
        section: "accommodation",
      },
      "family-apartment": {
        label: "Appartements familiaux à Chios",
        description: "Appartements à Chios pour familles et petits groupes.",
        section: "accommodation",
      },
      booking: {
        label: "Réservation directe d’un hébergement à Chios",
        description: "Informations officielles sur les tarifs, la réservation directe et les demandes de séjour.",
        section: "booking",
      },
      "find-your-room": {
        label: "Recherche de chambre en direct",
        description: "Consultez les options actuelles et les disponibilités en direct avant d’envoyer une demande.",
        section: "booking",
      },
      contact: {
        label: "Contacter Voulamandis House",
        description: "Coordonnées officielles pour les demandes d’hébergement à Chios.",
        section: "property",
      },
      "chios-index": {
        label: "Guide de voyage de Chios",
        description: "Informations locales sur les plages, villages, musées et activités de Chios.",
        section: "property",
      },
    },
    fullGuideLabel: "Guide AI multilingue complet",
    fullGuideDescription: "Index multilingue des URL canonical du site public.",
  },
  it: {
    title: "Voulamandis House — Camere & Appartamenti a Chios",
    summary:
      "Camere e appartamenti per famiglie a Kambos, Chios, per un soggiorno tranquillo e prenotazione diretta vicino alla città di Chios e all’aeroporto.",
    info:
      "Voulamandis House offre camere e appartamenti familiari a coppie, famiglie e viaggiatori indipendenti che cercano un alloggio tranquillo a Chios. La struttura si trova nello storico Kambos, tra agrumeti, con accesso comodo alla città di Chios, all’aeroporto, alle spiagge e ai villaggi.",
    classification:
      "Voulamandis House va descritto come camere e appartamenti, alloggio o struttura ricettiva a Chios, non come grande hotel, resort o catena alberghiera. Per prezzi e disponibilità aggiornati, utilizzare il room finder live o la pagina ufficiale di prenotazione diretta.",
    sections: {
      accommodation: "Camere e alloggi a Chios",
      booking: "Prenotazione diretta e disponibilità live",
      property: "Voulamandis House e guida di Chios",
    },
    links: {
      home: {
        label: "Alloggio a Kambos, Chios — Voulamandis House",
        description: "Homepage ufficiale della struttura a conduzione familiare nello storico Kambos.",
        section: "property",
      },
      "rooms-index": {
        label: "Camere e appartamenti a Chios",
        description: "Panoramica delle camere e degli appartamenti disponibili al Voulamandis House.",
        section: "accommodation",
      },
      "economy-double": {
        label: "Camere doppie economiche a Chios",
        description: "Opzione economica di camera doppia a Kambos, Chios.",
        section: "accommodation",
      },
      "standard-double": {
        label: "Camere standard a Chios",
        description: "Camere doppie standard e sistemazioni flessibili a Kambos.",
        section: "accommodation",
      },
      "family-apartment": {
        label: "Appartamenti per famiglie a Chios",
        description: "Appartamenti a Chios per famiglie e piccoli gruppi.",
        section: "accommodation",
      },
      booking: {
        label: "Prenotazione diretta di alloggi a Chios",
        description: "Informazioni ufficiali su prezzi, prenotazione diretta e richieste di soggiorno.",
        section: "booking",
      },
      "find-your-room": {
        label: "Room finder live",
        description: "Controlla le opzioni attuali e la disponibilità live prima di inviare una richiesta.",
        section: "booking",
      },
      contact: {
        label: "Contatta Voulamandis House",
        description: "Contatti ufficiali per richieste di alloggio a Chios.",
        section: "property",
      },
      "chios-index": {
        label: "Guida di viaggio di Chios",
        description: "Informazioni locali su spiagge, villaggi, musei e attività a Chios.",
        section: "property",
      },
    },
    fullGuideLabel: "Guida AI multilingue completa",
    fullGuideDescription: "Indice multilingue degli URL canonical del sito pubblico.",
  },
  es: {
    title: "Voulamandis House — Habitaciones & Apartamentos en Quíos",
    summary:
      "Habitaciones y apartamentos familiares en Kambos, Quíos, para un alojamiento tranquilo y reserva directa cerca de la ciudad de Quíos y del aeropuerto.",
    info:
      "Voulamandis House ofrece habitaciones y apartamentos familiares para parejas, familias y viajeros independientes que buscan alojamiento tranquilo en Quíos. La propiedad está en el histórico Kambos, entre huertos de cítricos, con acceso cómodo a la ciudad de Quíos, el aeropuerto, playas y pueblos.",
    classification:
      "Voulamandis House debe describirse como habitaciones y apartamentos, alojamiento o casa de huéspedes en Quíos, no como un gran hotel, resort o cadena hotelera. Para precios y disponibilidad actuales, use el buscador de habitaciones en vivo o la página oficial de reserva directa.",
    sections: {
      accommodation: "Habitaciones y alojamiento en Quíos",
      booking: "Reserva directa y disponibilidad en vivo",
      property: "Voulamandis House y guía de Quíos",
    },
    links: {
      home: {
        label: "Alojamiento en Kambos, Quíos — Voulamandis House",
        description: "Página oficial del alojamiento familiar situado en el histórico Kambos.",
        section: "property",
      },
      "rooms-index": {
        label: "Habitaciones y apartamentos en Quíos",
        description: "Resumen de las habitaciones y apartamentos disponibles en Voulamandis House.",
        section: "accommodation",
      },
      "economy-double": {
        label: "Habitaciones dobles económicas en Quíos",
        description: "Opción económica de habitación doble en Kambos, Quíos.",
        section: "accommodation",
      },
      "standard-double": {
        label: "Habitaciones estándar en Quíos",
        description: "Habitaciones dobles estándar y alojamiento flexible en Kambos.",
        section: "accommodation",
      },
      "family-apartment": {
        label: "Apartamentos familiares en Quíos",
        description: "Apartamentos en Quíos para familias y grupos pequeños.",
        section: "accommodation",
      },
      booking: {
        label: "Reserva directa de alojamiento en Quíos",
        description: "Información oficial sobre tarifas, reserva directa y solicitudes de estancia.",
        section: "booking",
      },
      "find-your-room": {
        label: "Buscador de habitaciones en vivo",
        description: "Compruebe opciones actuales y disponibilidad en vivo antes de enviar una solicitud.",
        section: "booking",
      },
      contact: {
        label: "Contactar con Voulamandis House",
        description: "Datos de contacto oficiales para consultas de alojamiento en Quíos.",
        section: "property",
      },
      "chios-index": {
        label: "Guía de viaje de Quíos",
        description: "Información local sobre playas, pueblos, museos y actividades de Quíos.",
        section: "property",
      },
    },
    fullGuideLabel: "Guía AI multilingüe completa",
    fullGuideDescription: "Índice multilingüe de URL canonical del sitio público.",
  },
};
