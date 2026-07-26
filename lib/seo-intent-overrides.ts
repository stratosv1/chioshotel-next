import type { RoomDetailData } from "@/content/room-details";
import type { FamilyTravelPageContent } from "@/content/family-travel";

const apartmentIntentCopy: Record<
  string,
  {
    title: string;
    description: string;
    kicker: string;
    heroTitle: string;
    subtitle: string;
    heroDescription: string;
    overviewTitle: string;
    bookingTitle: string;
  }
> = {
  "/chios-rooms/family-chios-apartments/": {
    title: "Apartments in Chios | Family Apartments | Voulamandis House",
    description:
      "Apartments in Chios at Voulamandis House in Kambos. Three spacious family apartments with kitchen, separate bedroom and living area for up to 4 guests.",
    kicker: "Apartments in Chios • Voulamandis House",
    heroTitle: "Apartments in Chios",
    subtitle: "Family apartments with more space, a kitchen and home-like comfort",
    heroDescription:
      "Spacious apartments in Chios with a separate bedroom, full kitchen and living area. Ideal for families, small groups and guests who want more independence or a longer stay in peaceful Kambos.",
    overviewTitle: "Apartments in Chios for families and longer stays",
    bookingTitle: "Find the available apartment for your dates",
  },
  "/el/domatia-xios/oikogeneiako-diamerisma/": {
    title: "Διαμερίσματα στη Χίο | Οικογενειακά Διαμερίσματα",
    description:
      "Διαμερίσματα στη Χίο στο Voulamandis House στον Κάμπο. Τρία ευρύχωρα οικογενειακά διαμερίσματα με κουζίνα, υπνοδωμάτιο και καθιστικό για έως 4 άτομα.",
    kicker: "Διαμερίσματα στη Χίο • Voulamandis House",
    heroTitle: "Διαμερίσματα στη Χίο",
    subtitle: "Οικογενειακά διαμερίσματα με χώρο, κουζίνα και άνεση σαν στο σπίτι",
    heroDescription:
      "Ευρύχωρα διαμερίσματα στη Χίο με ξεχωριστό υπνοδωμάτιο, πλήρη κουζίνα και καθιστικό. Ιδανικά για οικογένειες, παρέες έως 4 ατόμων και επισκέπτες που θέλουν περισσότερη ανεξαρτησία ή μεγαλύτερη διαμονή στον Κάμπο.",
    overviewTitle: "Διαμερίσματα στη Χίο για οικογένειες και μεγαλύτερες διαμονές",
    bookingTitle: "Βρείτε το διαθέσιμο διαμέρισμα για τις ημερομηνίες σας",
  },
  "/fr/chambres-a-chios/appartements-familiaux-de-chios/": {
    title: "Appartements à Chios | Appartements familiaux | Voulamandis House",
    description:
      "Appartements à Chios au Voulamandis House à Kambos. Trois appartements familiaux spacieux avec cuisine, chambre séparée et salon pour jusqu’à 4 personnes.",
    kicker: "Appartements à Chios • Voulamandis House",
    heroTitle: "Appartements à Chios",
    subtitle: "Des appartements familiaux avec plus d’espace, une cuisine et un confort comme à la maison",
    heroDescription:
      "Des appartements spacieux à Chios avec chambre séparée, cuisine complète et salon. Idéals pour les familles, les petits groupes et les séjours plus longs dans le calme de Kambos.",
    overviewTitle: "Appartements à Chios pour familles et séjours plus longs",
    bookingTitle: "Trouvez l’appartement disponible pour vos dates",
  },
  "/de/zimmer-chios/familienapartments-in-chios/": {
    title: "Apartments auf Chios | Familienapartments | Voulamandis House",
    description:
      "Apartments auf Chios im Voulamandis House in Kambos. Drei geräumige Familienapartments mit Küche, separatem Schlafzimmer und Wohnbereich für bis zu 4 Gäste.",
    kicker: "Apartments auf Chios • Voulamandis House",
    heroTitle: "Apartments auf Chios",
    subtitle: "Familienapartments mit mehr Platz, Küche und wohnlichem Komfort",
    heroDescription:
      "Geräumige Apartments auf Chios mit separatem Schlafzimmer, voll ausgestatteter Küche und Wohnbereich. Ideal für Familien, kleine Gruppen und längere Aufenthalte im ruhigen Kambos.",
    overviewTitle: "Apartments auf Chios für Familien und längere Aufenthalte",
    bookingTitle: "Finden Sie das verfügbare Apartment für Ihre Reisedaten",
  },
  "/it/stanze-a-chios/appartamenti-familiari-a-chios/": {
    title: "Appartamenti a Chios | Appartamenti familiari | Voulamandis House",
    description:
      "Appartamenti a Chios al Voulamandis House di Kambos. Tre spaziosi appartamenti familiari con cucina, camera separata e zona giorno per un massimo di 4 ospiti.",
    kicker: "Appartamenti a Chios • Voulamandis House",
    heroTitle: "Appartamenti a Chios",
    subtitle: "Appartamenti familiari con più spazio, cucina e comfort come a casa",
    heroDescription:
      "Spaziosi appartamenti a Chios con camera separata, cucina completa e zona giorno. Ideali per famiglie, piccoli gruppi e soggiorni più lunghi nella tranquilla zona di Kambos.",
    overviewTitle: "Appartamenti a Chios per famiglie e soggiorni più lunghi",
    bookingTitle: "Trova l’appartamento disponibile per le tue date",
  },
  "/es/habitaciones-en-chios/apartamentos-familiares-en-chios/": {
    title: "Apartamentos en Quíos | Apartamentos familiares | Voulamandis House",
    description:
      "Apartamentos en Quíos en Voulamandis House, Kambos. Tres apartamentos familiares amplios con cocina, dormitorio separado y zona de estar para hasta 4 personas.",
    kicker: "Apartamentos en Quíos • Voulamandis House",
    heroTitle: "Apartamentos en Quíos",
    subtitle: "Apartamentos familiares con más espacio, cocina y comodidad como en casa",
    heroDescription:
      "Apartamentos amplios en Quíos con dormitorio separado, cocina completa y zona de estar. Ideales para familias, grupos pequeños y estancias más largas en la tranquila zona de Kambos.",
    overviewTitle: "Apartamentos en Quíos para familias y estancias más largas",
    bookingTitle: "Encuentra el apartamento disponible para tus fechas",
  },
  "/tr/chios-odalari/sakiz-adasinda-buyuk-aile-daireleri/": {
    title: "Sakız Adası Daireleri | Aile Daireleri | Voulamandis House",
    description:
      "Sakız Adası daireleri, Kambos’taki Voulamandis House’ta. Mutfak, ayrı yatak odası ve yaşam alanına sahip, 4 kişiye kadar üç geniş aile dairesi.",
    kicker: "Sakız Adası daireleri • Voulamandis House",
    heroTitle: "Sakız Adası’nda daireler",
    subtitle: "Aileler için daha fazla alan, mutfak ve ev konforu",
    heroDescription:
      "Sakız Adası’nda ayrı yatak odası, tam mutfak ve yaşam alanı bulunan geniş daireler. Aileler, küçük gruplar ve Kambos’ta daha uzun veya daha bağımsız konaklama isteyen misafirler için uygundur.",
    overviewTitle: "Aileler ve uzun konaklamalar için Sakız Adası daireleri",
    bookingTitle: "Tarihleriniz için uygun daireyi bulun",
  },
};

export function withApartmentIntentOwner(data: RoomDetailData): RoomDetailData {
  const copy = apartmentIntentCopy[data.seo.canonicalPath];
  if (!copy) return data;

  return {
    ...data,
    seo: {
      ...data.seo,
      title: copy.title,
      description: copy.description,
    },
    hero: {
      ...data.hero,
      kicker: copy.kicker,
      title: copy.heroTitle,
      subtitle: copy.subtitle,
      description: copy.heroDescription,
    },
    overview: {
      ...data.overview,
      title: copy.overviewTitle,
    },
    booking: {
      ...data.booking,
      title: copy.bookingTitle,
    },
  };
}

const familyTravelIntentCopy: Record<
  string,
  {
    seoTitle: string;
    seoDescription: string;
    heroTitle: string;
    apartmentHref: string;
    apartmentLabel: string;
  }
> = {
  "/family-travel-in-chios/": {
    seoTitle: "Family Holidays in Chios with Kids | Voulamandis House",
    seoDescription:
      "Plan family holidays in Chios with kids: beaches, museums, villages, easy activities and a peaceful base at Voulamandis House in Kambos.",
    heroTitle: "Family holidays in Chios with kids",
    apartmentHref: "/chios-rooms/family-chios-apartments/",
    apartmentLabel: "See family apartments",
  },
  "/el/oikogeneiakes-diakopes-sti-xio/": {
    seoTitle: "Οικογενειακές Διακοπές στη Χίο με Παιδιά | Voulamandis House",
    seoDescription:
      "Οργανώστε οικογενειακές διακοπές στη Χίο με παιδιά: παραλίες, μουσεία, χωριά, εύκολες δραστηριότητες και ήρεμη βάση στο Voulamandis House στον Κάμπο.",
    heroTitle: "Οικογενειακές διακοπές στη Χίο με παιδιά",
    apartmentHref: "/el/domatia-xios/oikogeneiako-diamerisma/",
    apartmentLabel: "Δείτε οικογενειακά διαμερίσματα",
  },
  "/fr/vacances-en-famille-a-chios/": {
    seoTitle: "Vacances en famille à Chios avec des enfants | Voulamandis House",
    seoDescription:
      "Préparez des vacances en famille à Chios avec des enfants : plages, musées, villages, activités faciles et séjour paisible à Kambos.",
    heroTitle: "Vacances en famille à Chios avec des enfants",
    apartmentHref: "/fr/chambres-a-chios/appartements-familiaux-de-chios/",
    apartmentLabel: "Voir les appartements familiaux",
  },
  "/de/familienurlaub-auf-chios/": {
    seoTitle: "Familienurlaub auf Chios mit Kindern | Voulamandis House",
    seoDescription:
      "Planen Sie Familienurlaub auf Chios mit Kindern: Strände, Museen, Dörfer, einfache Aktivitäten und eine ruhige Basis im Voulamandis House in Kambos.",
    heroTitle: "Familienurlaub auf Chios mit Kindern",
    apartmentHref: "/de/zimmer-chios/familienapartments-in-chios/",
    apartmentLabel: "Familienapartments ansehen",
  },
  "/it/vacanze-in-famiglia-a-chios/": {
    seoTitle: "Vacanze in famiglia a Chios con bambini | Voulamandis House",
    seoDescription:
      "Organizza vacanze in famiglia a Chios con bambini: spiagge, musei, villaggi, attività semplici e una base tranquilla a Kambos.",
    heroTitle: "Vacanze in famiglia a Chios con bambini",
    apartmentHref: "/it/stanze-a-chios/appartamenti-familiari-a-chios/",
    apartmentLabel: "Vedi gli appartamenti familiari",
  },
  "/es/vacaciones-en-familia-en-quios/": {
    seoTitle: "Vacaciones en familia en Quíos con niños | Voulamandis House",
    seoDescription:
      "Organiza vacaciones en familia en Quíos con niños: playas, museos, pueblos, actividades sencillas y una base tranquila en Kambos.",
    heroTitle: "Vacaciones en familia en Quíos con niños",
    apartmentHref: "/es/habitaciones-en-chios/apartamentos-familiares-en-chios/",
    apartmentLabel: "Ver apartamentos familiares",
  },
  "/tr/sakiz-adasi-aile-tatili/": {
    seoTitle: "Çocuklarla Sakız Adası Aile Tatili | Voulamandis House",
    seoDescription:
      "Çocuklarla Sakız Adası aile tatilinizi planlayın: plajlar, müzeler, köyler, kolay aktiviteler ve Kambos’ta sakin bir konaklama üssü.",
    heroTitle: "Çocuklarla Sakız Adası aile tatili",
    apartmentHref: "/tr/chios-odalari/sakiz-adasinda-buyuk-aile-daireleri/",
    apartmentLabel: "Aile dairelerini görün",
  },
};

export function withFamilyTravelIntentOwner(
  data: FamilyTravelPageContent,
): FamilyTravelPageContent {
  const copy = familyTravelIntentCopy[data.path];
  if (!copy) return data;

  return {
    ...data,
    seo: {
      ...data.seo,
      title: copy.seoTitle,
      description: copy.seoDescription,
    },
    hero: {
      ...data.hero,
      title: copy.heroTitle,
      secondaryCta: {
        label: copy.apartmentLabel,
        href: copy.apartmentHref,
      },
    },
    stay: {
      ...data.stay,
      secondaryCta: {
        label: copy.apartmentLabel,
        href: copy.apartmentHref,
      },
    },
  };
}

export const apartmentAlternatePaths = {
  en: "/chios-rooms/family-chios-apartments/",
  el: "/el/domatia-xios/oikogeneiako-diamerisma/",
  fr: "/fr/chambres-a-chios/appartements-familiaux-de-chios/",
  de: "/de/zimmer-chios/familienapartments-in-chios/",
  it: "/it/stanze-a-chios/appartamenti-familiari-a-chios/",
  es: "/es/habitaciones-en-chios/apartamentos-familiares-en-chios/",
  tr: "/tr/chios-odalari/sakiz-adasinda-buyuk-aile-daireleri/",
} as const;

export const familyTravelAlternatePaths = {
  en: "/family-travel-in-chios/",
  el: "/el/oikogeneiakes-diakopes-sti-xio/",
  fr: "/fr/vacances-en-famille-a-chios/",
  de: "/de/familienurlaub-auf-chios/",
  it: "/it/vacanze-in-famiglia-a-chios/",
  es: "/es/vacaciones-en-familia-en-quios/",
  tr: "/tr/sakiz-adasi-aile-tatili/",
} as const;
