export type DealsPageData = {
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
    image: string;
    phoneLabel: string;
    phoneHref: string;
  };
  countdown: {
    label: string;
    targetIso: string;
    expiredText: string;
  };
  intro: {
    kicker: string;
    title: string;
    description: string;
  };
  offers: {
    id: string;
    title: string;
    description: string;
    image: string;
    imageAlt: string;
    tags: string[];
    tip: string;
    couponCode: string;
    discountLabel: string;
    bookingHref: string;
    roomPageHref: string;
  }[];
};

const dealsHeroImage =
  "https://chioshotel.gr/wp-content/uploads/2022/12/double-triple-room.jpg";

const economyRoomImage =
  "https://chioshotel.gr/wp-content/uploads/2022/12/DSC07803-1.webp";

const firstFloorRoomImage =
  "https://chioshotel.gr/wp-content/uploads/2022/12/DSC07776-2-e1675109942622.webp";

const familyApartmentImage =
  "https://chioshotel.gr/wp-content/uploads/2022/12/chios-apartments-voulamandis.webp";

const phoneHref = "tel:+302271031733";
const offerTargetIso = "2026-09-30T23:59:59+03:00";

export const dealsPageEn: DealsPageData = {
  seo: {
    canonicalPath: "/best-chios-travel-deals-for-chios-hotels/",
    title: "Best Chios Travel Deals for Chios Hotels 2026 | Voulamandis House",
    description:
      "Looking for the best Chios travel deals for Chios hotels? Discover exclusive Chios travel packages and Chios hotel offers at Voulamandis House for 2026.",
    ogImage: dealsHeroImage,
  },
  hero: {
    kicker: "Voulamandis House • Kampos, Chios",
    title: "Best Chios Travel Deals for Chios Hotels",
    description:
      "Discover exclusive Chios travel packages, room offers and direct booking coupon codes for your stay at Voulamandis House.",
    image: dealsHeroImage,
    phoneLabel: "Bookings: +30 22710 31733",
    phoneHref,
  },
  countdown: {
    label: "Offer ends in",
    targetIso: offerTargetIso,
    expiredText: "Offer expired",
  },
  intro: {
    kicker: "Chios hotel offers 2026",
    title: "Discover Chios travel packages & hotel offers",
    description:
      "Choose your preferred room category, copy the coupon code and continue to the secure booking page to unlock your direct booking offer.",
  },
  offers: [
    {
      id: "economy-double",
      title: "Economy Double",
      description:
        "A value-focused Chios hotel offer for guests who want a simple, comfortable and budget-friendly stay in Kampos.",
      image: economyRoomImage,
      imageAlt:
        "Best Chios travel deal for economy double room at Voulamandis House",
      tags: [
        "Chios travel deals",
        "Chios travel packages",
        "Chios hotels offers",
        "Best price",
      ],
      tip: "Copy the coupon code for the next step.",
      couponCode: "ECOMAY10",
      discountLabel: "Economy offer",
      bookingHref:
        "https://beds24.com/booking.php?propid=117813&roomid=268803&lang=en",
      roomPageHref: "/chios-rooms/economy-double-rooms/",
    },
    {
      id: "ground-floor-double",
      title: "Ground Floor Double",
      description:
        "A comfortable ground-floor room offer with easy access to the courtyard and garden atmosphere of Voulamandis House.",
      image: dealsHeroImage,
      imageAlt:
        "Chios hotel offer for ground floor double room at Voulamandis House",
      tags: [
        "Chios travel deals",
        "Chios travel packages",
        "Chios hotels offers",
        "Garden view",
      ],
      tip: "Copy the code to save on your booking.",
      couponCode: "MAY10",
      discountLabel: "Garden access offer",
      bookingHref:
        "https://beds24.com/booking.php?propid=117813&roomid=626129&lang=en",
      roomPageHref: "/chios-rooms/standard-double-room/",
    },
    {
      id: "first-floor-double",
      title: "First Floor Double",
      description:
        "A first-floor room offer for guests who prefer a brighter stay, upper-floor feel and traditional Kampos atmosphere.",
      image: firstFloorRoomImage,
      imageAlt:
        "Chios travel package for first floor double room at Voulamandis House",
      tags: [
        "Chios travel deals",
        "Chios travel packages",
        "Chios hotels offers",
        "Kampos view",
      ],
      tip: "Use this code at the checkout stage.",
      couponCode: "MAY10",
      discountLabel: "First floor offer",
      bookingHref:
        "https://beds24.com/booking.php?propid=117813&roomid=267788&lang=en",
      roomPageHref: "/chios-rooms/standard-double-room/",
    },
    {
      id: "family-apartment",
      title: "Family Apartment",
      description:
        "A family-friendly Chios hotel offer for guests who need more space, kitchen facilities and apartment-style comfort.",
      image: familyApartmentImage,
      imageAlt: "Chios hotels offer for family apartment at Voulamandis House",
      tags: [
        "Chios travel deals",
        "Chios travel packages",
        "Chios hotels offers",
        "Full kitchen",
      ],
      tip: "Copy the code to unlock your family apartment discount.",
      couponCode: "FMAY10",
      discountLabel: "Family apartment offer",
      bookingHref:
        "https://beds24.com/booking.php?propid=117813&referer=BookingLink&roomid=265595",
      roomPageHref: "/chios-rooms/family-chios-apartments/",
    },
  ],
};

export const dealsPageEl: DealsPageData = {
  seo: {
    canonicalPath: "/el/crazy-travel-deals-for-chios-hotels/",
    title: "Προσφορές Διαμονής στη Χίο 2026 | Voulamandis House",
    description:
      "Ανακαλύψτε προσφορές διαμονής στη Χίο, πακέτα και εκπτωτικούς κωδικούς για απευθείας κράτηση στο Voulamandis House στον Κάμπο.",
    ogImage: dealsHeroImage,
  },
  hero: {
    kicker: "Voulamandis House • Κάμπος, Χίος",
    title: "Προσφορές διαμονής στη Χίο",
    description:
      "Δείτε ειδικές προσφορές, πακέτα διαμονής και εκπτωτικούς κωδικούς για απευθείας κράτηση στο Voulamandis House.",
    image: dealsHeroImage,
    phoneLabel: "Κρατήσεις: +30 22710 31733",
    phoneHref,
  },
  countdown: {
    label: "Η προσφορά λήγει σε",
    targetIso: offerTargetIso,
    expiredText: "Η προσφορά έληξε",
  },
  intro: {
    kicker: "Προσφορές ξενοδοχείου στη Χίο 2026",
    title: "Ανακαλύψτε πακέτα και προσφορές διαμονής",
    description:
      "Επιλέξτε την κατηγορία δωματίου που προτιμάτε, αντιγράψτε τον εκπτωτικό κωδικό και συνεχίστε στην ασφαλή σελίδα κρατήσεων.",
  },
  offers: [
    {
      id: "economy-double",
      title: "Οικονομικό δίκλινο",
      description:
        "Μια οικονομική προσφορά διαμονής στη Χίο για επισκέπτες που θέλουν άνετη, απλή και προσιτή διαμονή στον Κάμπο.",
      image: economyRoomImage,
      imageAlt:
        "Προσφορά για οικονομικό δίκλινο δωμάτιο στο Voulamandis House",
      tags: ["Προσφορές Χίος", "Πακέτα διαμονής", "Δωμάτια Χίος", "Καλή τιμή"],
      tip: "Αντιγράψτε τον εκπτωτικό κωδικό για το επόμενο βήμα.",
      couponCode: "ECOMAY10",
      discountLabel: "Οικονομική προσφορά",
      bookingHref:
        "https://beds24.com/booking.php?propid=117813&roomid=268803&lang=el",
      roomPageHref: "/el/domatia-xios/oikonomiko-diklino-domatio/",
    },
    {
      id: "ground-floor-double",
      title: "Δίκλινο ισογείου",
      description:
        "Άνετη προσφορά για δωμάτιο ισογείου με εύκολη πρόσβαση στην αυλή και την ατμόσφαιρα του κήπου του Voulamandis House.",
      image: dealsHeroImage,
      imageAlt: "Προσφορά για δίκλινο δωμάτιο ισογείου στο Voulamandis House",
      tags: ["Προσφορές Χίος", "Πακέτα διαμονής", "Δωμάτια Χίος", "Κήπος"],
      tip: "Αντιγράψτε τον κωδικό για να κερδίσετε στην κράτησή σας.",
      couponCode: "MAY10",
      discountLabel: "Προσφορά με πρόσβαση στον κήπο",
      bookingHref:
        "https://beds24.com/booking.php?propid=117813&roomid=626129&lang=el",
      roomPageHref: "/el/domatia-xios/diklina-triklina-domatia/",
    },
    {
      id: "first-floor-double",
      title: "Δίκλινο πρώτου ορόφου",
      description:
        "Προσφορά για δωμάτιο πρώτου ορόφου, ιδανικό για επισκέπτες που προτιμούν φωτεινή διαμονή και παραδοσιακή ατμόσφαιρα Κάμπου.",
      image: firstFloorRoomImage,
      imageAlt:
        "Πακέτο διαμονής για δίκλινο πρώτου ορόφου στο Voulamandis House",
      tags: ["Προσφορές Χίος", "Πακέτα διαμονής", "Δωμάτια Χίος", "Θέα Κάμπου"],
      tip: "Χρησιμοποιήστε τον κωδικό στο στάδιο της κράτησης.",
      couponCode: "MAY10",
      discountLabel: "Προσφορά πρώτου ορόφου",
      bookingHref:
        "https://beds24.com/booking.php?propid=117813&roomid=267788&lang=el",
      roomPageHref: "/el/domatia-xios/diklina-triklina-domatia/",
    },
    {
      id: "family-apartment",
      title: "Οικογενειακό διαμέρισμα",
      description:
        "Οικογενειακή προσφορά διαμονής στη Χίο για επισκέπτες που χρειάζονται περισσότερο χώρο, κουζίνα και άνεση διαμερίσματος.",
      image: familyApartmentImage,
      imageAlt:
        "Προσφορά για οικογενειακό διαμέρισμα στο Voulamandis House",
      tags: ["Προσφορές Χίος", "Πακέτα διαμονής", "Διαμέρισμα", "Κουζίνα"],
      tip: "Αντιγράψτε τον κωδικό για την έκπτωση στο οικογενειακό διαμέρισμα.",
      couponCode: "FMAY10",
      discountLabel: "Προσφορά οικογενειακού διαμερίσματος",
      bookingHref:
        "https://beds24.com/booking.php?propid=117813&referer=BookingLink&roomid=265595",
      roomPageHref: "/el/domatia-xios/oikogeneiako-diamerisma/",
    },
  ],
};

export const dealsPageFr: DealsPageData = {
  seo: {
    canonicalPath: "/fr/offres-de-voyage-pour-les-hotels-a-chios/",
    title: "Offres de séjour à Chios 2026 | Voulamandis House",
    description:
      "Découvrez les offres de séjour à Chios, les forfaits voyage et les codes de réduction pour réserver directement à Voulamandis House.",
    ogImage: dealsHeroImage,
  },
  hero: {
    kicker: "Voulamandis House • Kampos, Chios",
    title: "Offres de séjour à Chios",
    description:
      "Découvrez des offres exclusives, des forfaits de séjour et des codes de réduction pour réserver directement à Voulamandis House.",
    image: dealsHeroImage,
    phoneLabel: "Réservations : +30 22710 31733",
    phoneHref,
  },
  countdown: {
    label: "L’offre se termine dans",
    targetIso: offerTargetIso,
    expiredText: "Offre expirée",
  },
  intro: {
    kicker: "Offres hôtel à Chios 2026",
    title: "Découvrez les forfaits et offres de séjour",
    description:
      "Choisissez la catégorie de chambre souhaitée, copiez le code de réduction et poursuivez vers la page de réservation sécurisée.",
  },
  offers: [
    {
      id: "economy-double",
      title: "Chambre double économique",
      description:
        "Une offre avantageuse à Chios pour les voyageurs qui souhaitent un séjour simple, confortable et économique à Kampos.",
      image: economyRoomImage,
      imageAlt:
        "Offre de séjour à Chios pour chambre double économique à Voulamandis House",
      tags: ["Offres Chios", "Forfaits séjour", "Hôtels Chios", "Meilleur prix"],
      tip: "Copiez le code de réduction pour l’étape suivante.",
      couponCode: "ECOMAY10",
      discountLabel: "Offre économique",
      bookingHref:
        "https://beds24.com/booking.php?propid=117813&roomid=268803&lang=fr",
      roomPageHref: "/fr/chambres-a-chios/chambres-doubles-economiques/",
    },
    {
      id: "ground-floor-double",
      title: "Chambre double au rez-de-chaussée",
      description:
        "Une offre confortable avec accès facile à la cour et à l’atmosphère du jardin de Voulamandis House.",
      image: dealsHeroImage,
      imageAlt:
        "Offre hôtel à Chios pour chambre double au rez-de-chaussée à Voulamandis House",
      tags: ["Offres Chios", "Forfaits séjour", "Hôtels Chios", "Jardin"],
      tip: "Copiez le code pour économiser sur votre réservation.",
      couponCode: "MAY10",
      discountLabel: "Offre accès jardin",
      bookingHref:
        "https://beds24.com/booking.php?propid=117813&roomid=626129&lang=fr",
      roomPageHref: "/fr/chambres-a-chios/chambres-doubles-standard/",
    },
    {
      id: "first-floor-double",
      title: "Chambre double au premier étage",
      description:
        "Une offre pour les voyageurs qui préfèrent une chambre lumineuse, à l’étage, avec l’atmosphère traditionnelle de Kampos.",
      image: firstFloorRoomImage,
      imageAlt:
        "Forfait séjour à Chios pour chambre double au premier étage à Voulamandis House",
      tags: ["Offres Chios", "Forfaits séjour", "Hôtels Chios", "Vue Kampos"],
      tip: "Utilisez ce code au moment de finaliser la réservation.",
      couponCode: "MAY10",
      discountLabel: "Offre premier étage",
      bookingHref:
        "https://beds24.com/booking.php?propid=117813&roomid=267788&lang=fr",
      roomPageHref: "/fr/chambres-a-chios/chambres-doubles-standard/",
    },
    {
      id: "family-apartment",
      title: "Appartement familial",
      description:
        "Une offre familiale à Chios pour les voyageurs qui recherchent plus d’espace, une cuisine et le confort d’un appartement.",
      image: familyApartmentImage,
      imageAlt:
        "Offre hôtel à Chios pour appartement familial à Voulamandis House",
      tags: ["Offres Chios", "Forfaits séjour", "Appartement", "Cuisine"],
      tip: "Copiez le code pour débloquer votre réduction appartement familial.",
      couponCode: "FMAY10",
      discountLabel: "Offre appartement familial",
      bookingHref:
        "https://beds24.com/booking.php?propid=117813&referer=BookingLink&roomid=265595",
      roomPageHref: "/fr/chambres-a-chios/appartements-familiaux-de-chios/",
    },
  ],
};

export const dealsPageDe: DealsPageData = {
  seo: {
    canonicalPath: "/de/beste-reiseangebote-fur-chios-hotels-auf-chios/",
    title: "Hotelangebote auf Chios 2026 | Voulamandis House",
    description:
      "Entdecken Sie Reiseangebote, Hotelangebote und Rabattcodes für Ihre Direktbuchung im Voulamandis House auf Chios.",
    ogImage: dealsHeroImage,
  },
  hero: {
    kicker: "Voulamandis House • Kampos, Chios",
    title: "Hotelangebote und Reiseangebote auf Chios",
    description:
      "Entdecken Sie exklusive Angebote, Zimmeraktionen und Rabattcodes für Ihre Direktbuchung im Voulamandis House.",
    image: dealsHeroImage,
    phoneLabel: "Buchungen: +30 22710 31733",
    phoneHref,
  },
  countdown: {
    label: "Angebot endet in",
    targetIso: offerTargetIso,
    expiredText: "Angebot abgelaufen",
  },
  intro: {
    kicker: "Chios Hotelangebote 2026",
    title: "Entdecken Sie Reiseangebote und Hotelaktionen",
    description:
      "Wählen Sie Ihre bevorzugte Zimmerkategorie, kopieren Sie den Rabattcode und fahren Sie mit der sicheren Buchungsseite fort.",
  },
  offers: [
    {
      id: "economy-double",
      title: "Economy Doppelzimmer",
      description:
        "Ein preisbewusstes Hotelangebot auf Chios für Gäste, die einen einfachen, komfortablen und günstigen Aufenthalt in Kampos suchen.",
      image: economyRoomImage,
      imageAlt:
        "Chios Reiseangebot für Economy Doppelzimmer im Voulamandis House",
      tags: ["Chios Angebote", "Reisepakete", "Hotels Chios", "Bester Preis"],
      tip: "Kopieren Sie den Rabattcode für den nächsten Schritt.",
      couponCode: "ECOMAY10",
      discountLabel: "Economy Angebot",
      bookingHref:
        "https://beds24.com/booking.php?propid=117813&roomid=268803&lang=de",
      roomPageHref: "/de/zimmer-chios/economy-zimmer-auf-chios/",
    },
    {
      id: "ground-floor-double",
      title: "Doppelzimmer im Erdgeschoss",
      description:
        "Ein komfortables Zimmerangebot im Erdgeschoss mit einfachem Zugang zum Hof und zur Gartenatmosphäre des Voulamandis House.",
      image: dealsHeroImage,
      imageAlt:
        "Hotelangebot auf Chios für Doppelzimmer im Erdgeschoss im Voulamandis House",
      tags: ["Chios Angebote", "Reisepakete", "Hotels Chios", "Garten"],
      tip: "Kopieren Sie den Code und sparen Sie bei Ihrer Buchung.",
      couponCode: "MAY10",
      discountLabel: "Angebot mit Gartenzugang",
      bookingHref:
        "https://beds24.com/booking.php?propid=117813&roomid=626129&lang=de",
      roomPageHref: "/de/zimmer-chios/standard-doppelzimmer-auf-chios/",
    },
    {
      id: "first-floor-double",
      title: "Doppelzimmer im ersten Stock",
      description:
        "Ein Angebot für Gäste, die ein helleres Zimmer, das Gefühl einer oberen Etage und die traditionelle Atmosphäre von Kampos bevorzugen.",
      image: firstFloorRoomImage,
      imageAlt:
        "Chios Reisepaket für Doppelzimmer im ersten Stock im Voulamandis House",
      tags: ["Chios Angebote", "Reisepakete", "Hotels Chios", "Kampos Blick"],
      tip: "Verwenden Sie diesen Code beim Abschluss der Buchung.",
      couponCode: "MAY10",
      discountLabel: "Angebot erster Stock",
      bookingHref:
        "https://beds24.com/booking.php?propid=117813&roomid=267788&lang=de",
      roomPageHref: "/de/zimmer-chios/standard-doppelzimmer-auf-chios/",
    },
    {
      id: "family-apartment",
      title: "Familienapartment",
      description:
        "Ein familienfreundliches Hotelangebot auf Chios für Gäste, die mehr Platz, Küchenausstattung und Apartment-Komfort benötigen.",
      image: familyApartmentImage,
      imageAlt: "Hotelangebot auf Chios für Familienapartment im Voulamandis House",
      tags: ["Chios Angebote", "Reisepakete", "Apartment", "Küche"],
      tip: "Kopieren Sie den Code, um Ihren Familienapartment-Rabatt zu aktivieren.",
      couponCode: "FMAY10",
      discountLabel: "Familienapartment Angebot",
      bookingHref:
        "https://beds24.com/booking.php?propid=117813&referer=BookingLink&roomid=265595",
      roomPageHref: "/de/zimmer-chios/familienapartments-in-chios/",
    },
  ],
};

export const dealsPageIt: DealsPageData = {
  seo: {
    canonicalPath: "/it/offerte-di-viaggio-hotels-chios/",
    title: "Offerte hotel a Chios 2026 | Voulamandis House",
    description:
      "Scopri offerte di viaggio, pacchetti soggiorno e codici sconto per prenotare direttamente al Voulamandis House a Chios.",
    ogImage: dealsHeroImage,
  },
  hero: {
    kicker: "Voulamandis House • Kampos, Chios",
    title: "Offerte di viaggio e hotel a Chios",
    description:
      "Scopri pacchetti esclusivi, offerte sulle camere e codici sconto per prenotare direttamente al Voulamandis House.",
    image: dealsHeroImage,
    phoneLabel: "Prenotazioni: +30 22710 31733",
    phoneHref,
  },
  countdown: {
    label: "L’offerta termina tra",
    targetIso: offerTargetIso,
    expiredText: "Offerta scaduta",
  },
  intro: {
    kicker: "Offerte hotel Chios 2026",
    title: "Scopri pacchetti e offerte di soggiorno",
    description:
      "Scegli la categoria di camera preferita, copia il codice sconto e continua alla pagina di prenotazione sicura.",
  },
  offers: [
    {
      id: "economy-double",
      title: "Camera doppia economy",
      description:
        "Un’offerta conveniente a Chios per chi desidera un soggiorno semplice, comodo ed economico a Kampos.",
      image: economyRoomImage,
      imageAlt:
        "Offerta viaggio a Chios per camera doppia economy al Voulamandis House",
      tags: ["Offerte Chios", "Pacchetti soggiorno", "Hotel Chios", "Miglior prezzo"],
      tip: "Copia il codice sconto per il passaggio successivo.",
      couponCode: "ECOMAY10",
      discountLabel: "Offerta economy",
      bookingHref:
        "https://beds24.com/booking.php?propid=117813&roomid=268803&lang=it",
      roomPageHref: "/it/stanze-a-chios/camera-doppia-economica-chios/",
    },
    {
      id: "ground-floor-double",
      title: "Camera doppia al piano terra",
      description:
        "Un’offerta per una camera comoda al piano terra, con facile accesso al cortile e all’atmosfera del giardino del Voulamandis House.",
      image: dealsHeroImage,
      imageAlt:
        "Offerta hotel a Chios per camera doppia al piano terra al Voulamandis House",
      tags: ["Offerte Chios", "Pacchetti soggiorno", "Hotel Chios", "Giardino"],
      tip: "Copia il codice per risparmiare sulla prenotazione.",
      couponCode: "MAY10",
      discountLabel: "Offerta accesso giardino",
      bookingHref:
        "https://beds24.com/booking.php?propid=117813&roomid=626129&lang=it",
      roomPageHref: "/it/stanze-a-chios/camere-doppie-standard-chios/",
    },
    {
      id: "first-floor-double",
      title: "Camera doppia al primo piano",
      description:
        "Un’offerta per chi preferisce una camera più luminosa, al piano superiore, con atmosfera tradizionale di Kampos.",
      image: firstFloorRoomImage,
      imageAlt:
        "Pacchetto viaggio a Chios per camera doppia al primo piano al Voulamandis House",
      tags: ["Offerte Chios", "Pacchetti soggiorno", "Hotel Chios", "Vista Kampos"],
      tip: "Usa questo codice nella fase finale della prenotazione.",
      couponCode: "MAY10",
      discountLabel: "Offerta primo piano",
      bookingHref:
        "https://beds24.com/booking.php?propid=117813&roomid=267788&lang=it",
      roomPageHref: "/it/stanze-a-chios/camere-doppie-standard-chios/",
    },
    {
      id: "family-apartment",
      title: "Appartamento familiare",
      description:
        "Un’offerta per famiglie a Chios, ideale per chi cerca più spazio, cucina attrezzata e il comfort di un appartamento.",
      image: familyApartmentImage,
      imageAlt:
        "Offerta hotel a Chios per appartamento familiare al Voulamandis House",
      tags: ["Offerte Chios", "Pacchetti soggiorno", "Appartamento", "Cucina"],
      tip: "Copia il codice per sbloccare lo sconto sull’appartamento familiare.",
      couponCode: "FMAY10",
      discountLabel: "Offerta appartamento familiare",
      bookingHref:
        "https://beds24.com/booking.php?propid=117813&referer=BookingLink&roomid=265595",
      roomPageHref: "/it/stanze-a-chios/appartamenti-familiari-a-chios/",
    },
  ],
};

export const dealsPageEs: DealsPageData = {
  seo: {
    canonicalPath: "/es/mejores-ofertas-de-viaje-a-quios-para-hoteles-en-quios/",
    title: "Ofertas de hotel en Chios 2026 | Voulamandis House",
    description:
      "Descubre ofertas de viaje, paquetes de alojamiento y códigos de descuento para reservar directamente en Voulamandis House en Chios.",
    ogImage: dealsHeroImage,
  },
  hero: {
    kicker: "Voulamandis House • Kampos, Chios",
    title: "Ofertas de viaje y hotel en Chios",
    description:
      "Descubre paquetes exclusivos, ofertas de habitaciones y códigos de descuento para reservar directamente en Voulamandis House.",
    image: dealsHeroImage,
    phoneLabel: "Reservas: +30 22710 31733",
    phoneHref,
  },
  countdown: {
    label: "La oferta termina en",
    targetIso: offerTargetIso,
    expiredText: "Oferta finalizada",
  },
  intro: {
    kicker: "Ofertas hotel Chios 2026",
    title: "Descubre paquetes y ofertas de alojamiento",
    description:
      "Elige la categoría de habitación que prefieras, copia el código de descuento y continúa a la página de reserva segura.",
  },
  offers: [
    {
      id: "economy-double",
      title: "Habitación doble económica",
      description:
        "Una oferta económica en Chios para huéspedes que buscan una estancia sencilla, cómoda y asequible en Kampos.",
      image: economyRoomImage,
      imageAlt:
        "Oferta de viaje a Chios para habitación doble económica en Voulamandis House",
      tags: ["Ofertas Chios", "Paquetes de viaje", "Hoteles Chios", "Mejor precio"],
      tip: "Copia el código de descuento para el siguiente paso.",
      couponCode: "ECOMAY10",
      discountLabel: "Oferta económica",
      bookingHref:
        "https://beds24.com/booking.php?propid=117813&roomid=268803&lang=es",
      roomPageHref: "/es/habitaciones-en-chios/economicas-habitaciones-en-chios/",
    },
    {
      id: "ground-floor-double",
      title: "Habitación doble en planta baja",
      description:
        "Una cómoda oferta de habitación en planta baja con fácil acceso al patio y al ambiente del jardín de Voulamandis House.",
      image: dealsHeroImage,
      imageAlt:
        "Oferta de hotel en Chios para habitación doble en planta baja en Voulamandis House",
      tags: ["Ofertas Chios", "Paquetes de viaje", "Hoteles Chios", "Jardín"],
      tip: "Copia el código para ahorrar en tu reserva.",
      couponCode: "MAY10",
      discountLabel: "Oferta acceso al jardín",
      bookingHref:
        "https://beds24.com/booking.php?propid=117813&roomid=626129&lang=es",
      roomPageHref: "/es/habitaciones-en-chios/habitaciones-dobles-estandar/",
    },
    {
      id: "first-floor-double",
      title: "Habitación doble en primera planta",
      description:
        "Una oferta para huéspedes que prefieren una estancia más luminosa, en planta superior, con el ambiente tradicional de Kampos.",
      image: firstFloorRoomImage,
      imageAlt:
        "Paquete de viaje a Chios para habitación doble en primera planta en Voulamandis House",
      tags: ["Ofertas Chios", "Paquetes de viaje", "Hoteles Chios", "Vista Kampos"],
      tip: "Usa este código al finalizar la reserva.",
      couponCode: "MAY10",
      discountLabel: "Oferta primera planta",
      bookingHref:
        "https://beds24.com/booking.php?propid=117813&roomid=267788&lang=es",
      roomPageHref: "/es/habitaciones-en-chios/habitaciones-dobles-estandar/",
    },
    {
      id: "family-apartment",
      title: "Apartamento familiar",
      description:
        "Una oferta familiar en Chios para huéspedes que necesitan más espacio, cocina y comodidad de apartamento.",
      image: familyApartmentImage,
      imageAlt:
        "Oferta de hotel en Chios para apartamento familiar en Voulamandis House",
      tags: ["Ofertas Chios", "Paquetes de viaje", "Apartamento", "Cocina"],
      tip: "Copia el código para desbloquear tu descuento de apartamento familiar.",
      couponCode: "FMAY10",
      discountLabel: "Oferta apartamento familiar",
      bookingHref:
        "https://beds24.com/booking.php?propid=117813&referer=BookingLink&roomid=265595",
      roomPageHref: "/es/habitaciones-en-chios/apartamentos-familiares-en-chios/",
    },
  ],
};

export const dealsPageTr: DealsPageData = {
  seo: {
    canonicalPath: "/tr/sakiz-adasi-otel-firsatlari/",
    title: "Sakız Adası Otel Fırsatları 2026 | Voulamandis House",
    description:
      "Sakız Adası’nda otel fırsatlarını, konaklama paketlerini ve Voulamandis House direkt rezervasyon indirim kodlarını keşfedin.",
    ogImage: dealsHeroImage,
  },
  hero: {
    kicker: "Voulamandis House • Kampos, Sakız Adası",
    title: "Sakız Adası otel ve seyahat fırsatları",
    description:
      "Voulamandis House konaklamanız için özel paketleri, oda fırsatlarını ve direkt rezervasyon indirim kodlarını keşfedin.",
    image: dealsHeroImage,
    phoneLabel: "Rezervasyon: +30 22710 31733",
    phoneHref,
  },
  countdown: {
    label: "Fırsatın bitmesine kalan süre",
    targetIso: offerTargetIso,
    expiredText: "Fırsat sona erdi",
  },
  intro: {
    kicker: "Sakız Adası otel fırsatları 2026",
    title: "Konaklama paketlerini ve otel fırsatlarını keşfedin",
    description:
      "Tercih ettiğiniz oda kategorisini seçin, indirim kodunu kopyalayın ve güvenli rezervasyon sayfasına geçin.",
  },
  offers: [
    {
      id: "economy-double",
      title: "Ekonomi çift kişilik oda",
      description:
        "Kampos’ta sade, konforlu ve bütçe dostu bir konaklama isteyen misafirler için uygun fiyatlı Sakız Adası otel fırsatı.",
      image: economyRoomImage,
      imageAlt:
        "Voulamandis House ekonomi çift kişilik oda için Sakız Adası fırsatı",
      tags: ["Sakız fırsatları", "Konaklama paketleri", "Sakız otelleri", "En iyi fiyat"],
      tip: "Bir sonraki adım için indirim kodunu kopyalayın.",
      couponCode: "ECOMAY10",
      discountLabel: "Ekonomi fırsatı",
      bookingHref:
        "https://beds24.com/booking.php?propid=117813&roomid=268803&lang=tr",
      roomPageHref:
        "/tr/chios-odalari/sakiz-adasindaki-ekonomi-cift-kisilik-oda/",
    },
    {
      id: "ground-floor-double",
      title: "Zemin kat çift kişilik oda",
      description:
        "Voulamandis House’un avlusuna ve bahçe atmosferine kolay erişim sunan rahat bir zemin kat oda fırsatı.",
      image: dealsHeroImage,
      imageAlt:
        "Voulamandis House zemin kat çift kişilik oda için Sakız Adası otel fırsatı",
      tags: ["Sakız fırsatları", "Konaklama paketleri", "Sakız otelleri", "Bahçe"],
      tip: "Rezervasyonunuzda tasarruf etmek için kodu kopyalayın.",
      couponCode: "MAY10",
      discountLabel: "Bahçe erişimi fırsatı",
      bookingHref:
        "https://beds24.com/booking.php?propid=117813&roomid=626129&lang=tr",
      roomPageHref: "/tr/chios-odalari/standart-cift-kisilik-odalar/",
    },
    {
      id: "first-floor-double",
      title: "Birinci kat çift kişilik oda",
      description:
        "Daha aydınlık, üst katta ve geleneksel Kampos atmosferine sahip bir konaklama isteyen misafirler için oda fırsatı.",
      image: firstFloorRoomImage,
      imageAlt:
        "Voulamandis House birinci kat çift kişilik oda için Sakız Adası seyahat paketi",
      tags: ["Sakız fırsatları", "Konaklama paketleri", "Sakız otelleri", "Kampos manzarası"],
      tip: "Bu kodu ödeme aşamasında kullanın.",
      couponCode: "MAY10",
      discountLabel: "Birinci kat fırsatı",
      bookingHref:
        "https://beds24.com/booking.php?propid=117813&roomid=267788&lang=tr",
      roomPageHref: "/tr/chios-odalari/standart-cift-kisilik-odalar/",
    },
    {
      id: "family-apartment",
      title: "Aile dairesi",
      description:
        "Daha fazla alan, mutfak olanakları ve daire konforu isteyen misafirler için aile dostu Sakız Adası otel fırsatı.",
      image: familyApartmentImage,
      imageAlt:
        "Voulamandis House aile dairesi için Sakız Adası otel fırsatı",
      tags: ["Sakız fırsatları", "Konaklama paketleri", "Daire", "Mutfak"],
      tip: "Aile dairesi indiriminizi açmak için kodu kopyalayın.",
      couponCode: "FMAY10",
      discountLabel: "Aile dairesi fırsatı",
      bookingHref:
        "https://beds24.com/booking.php?propid=117813&referer=BookingLink&roomid=265595",
      roomPageHref: "/tr/chios-odalari/sakiz-adasinda-buyuk-aile-daireleri/",
    },
  ],
};

export const localizedDealsPages = [
  dealsPageEn,
  dealsPageEl,
  dealsPageFr,
  dealsPageDe,
  dealsPageIt,
  dealsPageEs,
  dealsPageTr,
];

export function getLocalizedDealsPageByPath(
  path: string,
): DealsPageData | undefined {
  return localizedDealsPages.find((page) => page.seo.canonicalPath === path);
}