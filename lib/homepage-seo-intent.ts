import type { HomePageData } from "@/content/home";
import { withUpdatedIntroReasons } from "@/content/homeIntroReasons";
import type { LanguageCode } from "@/lib/languages";

type HomepageIntentCopy = {
  seoTitle: string;
  seoDescription: string;
  heroTitle: string;
  heroDescriptionHtml: string;
  introTitle: string;
  introBodyHtml: string;
  roomsKicker: string;
  roomsTitle: string;
  roomsText: string;
  roomsSideKicker: string;
  roomsSideTitle: string;
  roomsSideText: string;
};

const linkClass =
  "font-semibold text-amber-800 underline decoration-amber-300 underline-offset-4 transition-colors hover:text-amber-900";
const heroLinkClass =
  "font-semibold text-white underline decoration-amber-300 underline-offset-4 transition-colors hover:text-amber-100";

const copy: Record<LanguageCode, HomepageIntentCopy> = {
  en: {
    seoTitle: "Voulamandis House | Authentic Stay in Chios",
    seoDescription:
      "Official website of Voulamandis House in Chios. Personal hospitality, a peaceful citrus-garden setting, rooms and family apartments near Chios Town, the airport and beaches.",
    heroTitle: "Voulamandis House – Authentic hospitality in Chios",
    heroDescriptionHtml: `A peaceful, personal stay in historic Kambos, close to Chios Town, the airport and beaches. Explore our <a href="/chios-rooms/" class="${heroLinkClass}">rooms and apartments in Chios</a> and choose the category that suits your trip.`,
    introTitle: "Authentic hospitality at Voulamandis House",
    introBodyHtml: `Voulamandis House combines a quiet citrus-garden setting with personal hospitality for couples and families. Discover why <a href="/chios/kampos-chios/" class="${linkClass}">staying in Kambos, Chios</a> is a distinctive choice. If you are comparing <a href="/chios-hotels/" class="${linkClass}">hotels in Chios</a> with other accommodation types, use our guide before choosing an area and property.`,
    roomsKicker: "Voulamandis House rooms & apartments",
    roomsTitle: "Choose the category that fits your trip",
    roomsText:
      "From economy doubles to comfortable rooms and family apartments, compare the available categories and choose the best fit for your stay.",
    roomsSideKicker: "All options in one place",
    roomsSideTitle: "Compare rooms and apartments",
    roomsSideText:
      "See categories, capacity and key features together before choosing the room or apartment that suits you.",
  },
  el: {
    seoTitle: "Voulamandis House Χίος | Διαμονή στον Κάμπο",
    seoDescription:
      "Μείνετε στον ιστορικό Κάμπο της Χίου, 3 χλμ. από το αεροδρόμιο. Δείτε δωμάτια, διαμερίσματα, τιμές και κάντε απευθείας κράτηση.",
    heroTitle: "Voulamandis House – Αυθεντική φιλοξενία στη Χίο",
    heroDescriptionHtml: `Ήσυχη και προσωπική φιλοξενία στον ιστορικό Κάμπο της Χίου, κοντά στην πόλη, το αεροδρόμιο και τις παραλίες. Δείτε όλες τις επιλογές για <a href="/el/domatia-xios/" class="${heroLinkClass}">δωμάτια και διαμερίσματα στη Χίο</a> και επιλέξτε την κατηγορία που ταιριάζει στο ταξίδι σας.`,
    introTitle: "Αυθεντική φιλοξενία στο Voulamandis House",
    introBodyHtml: `Το Voulamandis House συνδυάζει ήρεμο περιβάλλον, περιβόλια εσπεριδοειδών και προσωπική φιλοξενία. Ανακαλύψτε γιατί η <a href="/el/chios/kampos-chios/" class="${linkClass}">διαμονή στον Κάμπο της Χίου</a> είναι μια ξεχωριστή επιλογή. Αν συγκρίνετε <a href="/el/xenodoxeia-xios/" class="${linkClass}">ξενοδοχεία στη Χίο</a> και άλλους τύπους διαμονής, δείτε τον αναλυτικό οδηγό μας πριν αποφασίσετε περιοχή και κατάλυμα.`,
    roomsKicker: "Δωμάτια & διαμερίσματα Voulamandis House",
    roomsTitle: "Επιλέξτε την κατηγορία που ταιριάζει στο ταξίδι σας",
    roomsText:
      "Από οικονομικά δίκλινα έως άνετα δωμάτια και οικογενειακά διαμερίσματα, δείτε τις διαθέσιμες κατηγορίες και βρείτε την κατάλληλη επιλογή για τη διαμονή σας.",
    roomsSideKicker: "Όλες οι επιλογές σε μία σελίδα",
    roomsSideTitle: "Συγκρίνετε δωμάτια και διαμερίσματα",
    roomsSideText:
      "Δείτε συγκεντρωμένα τις κατηγορίες, τη χωρητικότητα και τα βασικά χαρακτηριστικά τους πριν επιλέξετε το δωμάτιο που σας ταιριάζει.",
  },
  fr: {
    seoTitle: "Voulamandis House | Séjour authentique à Chios",
    seoDescription:
      "Site officiel de Voulamandis House à Chios : accueil personnel, jardin d’agrumes paisible, chambres et appartements familiaux près de la ville, de l’aéroport et des plages.",
    heroTitle: "Voulamandis House – Un séjour authentique à Chios",
    heroDescriptionHtml: `Un séjour calme et personnel dans le Kambos historique, près de la ville, de l’aéroport et des plages. Découvrez nos <a href="/fr/chambres-a-chios/" class="${heroLinkClass}">chambres et appartements à Chios</a> et choisissez la catégorie adaptée à votre voyage.`,
    introTitle: "Une hospitalité authentique à Voulamandis House",
    introBodyHtml: `Voulamandis House associe calme, agrumes et accueil personnel. Découvrez pourquoi un <a href="/fr/chios/kampos-chios/" class="${linkClass}">séjour à Kambos, Chios</a> est un choix particulier. Si vous comparez les <a href="/fr/hotels-chios/" class="${linkClass}">hôtels à Chios</a> avec d’autres hébergements, consultez notre guide avant de choisir votre quartier et votre établissement.`,
    roomsKicker: "Chambres & appartements Voulamandis House",
    roomsTitle: "Choisissez la catégorie adaptée à votre séjour",
    roomsText:
      "Des chambres doubles économiques aux chambres confortables et appartements familiaux, comparez les catégories disponibles avant de réserver.",
    roomsSideKicker: "Toutes les options en une page",
    roomsSideTitle: "Comparez chambres et appartements",
    roomsSideText:
      "Consultez capacité, catégorie et caractéristiques essentielles avant de choisir votre hébergement.",
  },
  de: {
    seoTitle: "Voulamandis House | Authentisch übernachten auf Chios",
    seoDescription:
      "Offizielle Website des Voulamandis House auf Chios: persönliche Gastfreundschaft, ruhiger Zitrusgarten, Zimmer und Familienapartments nahe Stadt, Flughafen und Stränden.",
    heroTitle: "Voulamandis House – Authentische Gastfreundschaft auf Chios",
    heroDescriptionHtml: `Ruhig und persönlich im historischen Kambos wohnen, nahe Chios-Stadt, Flughafen und Stränden. Entdecken Sie unsere <a href="/de/chios-zimmer/" class="${heroLinkClass}">Zimmer und Apartments auf Chios</a> und wählen Sie die passende Kategorie.`,
    introTitle: "Authentische Gastfreundschaft im Voulamandis House",
    introBodyHtml: `Voulamandis House verbindet Ruhe, Zitrusgärten und persönliche Gastfreundschaft. Erfahren Sie, warum <a href="/de/chios/kampos-chios/" class="${linkClass}">Übernachten in Kambos auf Chios</a> besonders ist. Wenn Sie <a href="/de/hotels-auf-chios/" class="${linkClass}">Hotels auf Chios</a> mit anderen Unterkunftsarten vergleichen, hilft unser Guide bei der Wahl von Lage und Unterkunft.`,
    roomsKicker: "Zimmer & Apartments im Voulamandis House",
    roomsTitle: "Wählen Sie die passende Kategorie für Ihre Reise",
    roomsText:
      "Von günstigen Doppelzimmern bis zu komfortablen Zimmern und Familienapartments: Vergleichen Sie die Kategorien und finden Sie die passende Unterkunft.",
    roomsSideKicker: "Alle Optionen auf einen Blick",
    roomsSideTitle: "Zimmer und Apartments vergleichen",
    roomsSideText:
      "Vergleichen Sie Kapazität, Kategorie und wichtige Merkmale, bevor Sie sich entscheiden.",
  },
  it: {
    seoTitle: "Voulamandis House | Ospitalità autentica a Chios",
    seoDescription:
      "Sito ufficiale di Voulamandis House a Chios: ospitalità personale, tranquillo giardino di agrumi, camere e appartamenti familiari vicino a città, aeroporto e spiagge.",
    heroTitle: "Voulamandis House – Ospitalità autentica a Chios",
    heroDescriptionHtml: `Un soggiorno tranquillo e personale nello storico Kambos, vicino alla città, all’aeroporto e alle spiagge. Scopri le nostre <a href="/it/camere-a-chios/" class="${heroLinkClass}">camere e appartamenti a Chios</a> e scegli la categoria più adatta al viaggio.`,
    introTitle: "Ospitalità autentica al Voulamandis House",
    introBodyHtml: `Voulamandis House unisce tranquillità, agrumeti e ospitalità personale. Scopri perché un <a href="/it/chios/kampos-chios/" class="${linkClass}">soggiorno a Kambos, Chios</a> è una scelta speciale. Se stai confrontando <a href="/it/hotel-chios/" class="${linkClass}">hotel a Chios</a> con altri tipi di alloggio, consulta la nostra guida prima di scegliere zona e struttura.`,
    roomsKicker: "Camere & appartamenti Voulamandis House",
    roomsTitle: "Scegli la categoria adatta al tuo viaggio",
    roomsText:
      "Dalle camere doppie economy alle camere più spaziose e agli appartamenti familiari, confronta le categorie disponibili prima di scegliere.",
    roomsSideKicker: "Tutte le opzioni in una pagina",
    roomsSideTitle: "Confronta camere e appartamenti",
    roomsSideText:
      "Confronta capienza, categoria e caratteristiche principali prima di scegliere la sistemazione più adatta.",
  },
  es: {
    seoTitle: "Voulamandis House | Estancia auténtica en Quíos",
    seoDescription:
      "Web oficial de Voulamandis House en Quíos: hospitalidad personal, tranquilo jardín de cítricos, habitaciones y apartamentos familiares cerca de la ciudad, aeropuerto y playas.",
    heroTitle: "Voulamandis House – Hospitalidad auténtica en Quíos",
    heroDescriptionHtml: `Una estancia tranquila y personal en el histórico Kambos, cerca de la ciudad, el aeropuerto y las playas. Descubre nuestras <a href="/es/habitaciones-en-chios/" class="${heroLinkClass}">habitaciones y apartamentos en Quíos</a> y elige la categoría adecuada.`,
    introTitle: "Hospitalidad auténtica en Voulamandis House",
    introBodyHtml: `Voulamandis House combina tranquilidad, cítricos y hospitalidad personal. Descubre por qué el <a href="/es/chios/kampos-chios/" class="${linkClass}">alojamiento en Kambos, Quíos</a> es una opción especial. Si comparas <a href="/es/hoteles-chios/" class="${linkClass}">hoteles en Quíos</a> con otros tipos de alojamiento, consulta nuestra guía antes de elegir zona y establecimiento.`,
    roomsKicker: "Habitaciones & apartamentos Voulamandis House",
    roomsTitle: "Elige la categoría adecuada para tu viaje",
    roomsText:
      "Desde habitaciones dobles económicas hasta habitaciones cómodas y apartamentos familiares, compara las categorías disponibles antes de reservar.",
    roomsSideKicker: "Todas las opciones en una página",
    roomsSideTitle: "Compara habitaciones y apartamentos",
    roomsSideText:
      "Consulta capacidad, categoría y características principales antes de elegir tu alojamiento.",
  },
  tr: {
    seoTitle: "Voulamandis House | Sakız Adası’nda Otantik Konaklama",
    seoDescription:
      "Voulamandis House resmi sitesi: kişisel misafirperverlik, sakin narenciye bahçesi, Sakız merkezi, havaalanı ve plajlara yakın oda ve aile daireleri.",
    heroTitle: "Voulamandis House – Sakız Adası’nda otantik misafirperverlik",
    heroDescriptionHtml: `Tarihi Kambos’ta, Sakız merkezine, havaalanına ve plajlara yakın sakin ve kişisel bir konaklama. <a href="/tr/sakiz-adasi-odalari/" class="${heroLinkClass}">Sakız Adası oda ve daire seçeneklerini</a> inceleyin ve seyahatinize uygun kategoriyi seçin.`,
    introTitle: "Voulamandis House’ta otantik misafirperverlik",
    introBodyHtml: `Voulamandis House sakinlik, narenciye bahçeleri ve kişisel misafirperverliği bir araya getirir. <a href="/tr/chios/kampos-chios/" class="${linkClass}">Sakız Kambos’ta konaklamanın</a> neden özel olduğunu keşfedin. <a href="/tr/sakiz-adasi-otelleri/" class="${linkClass}">Sakız Adası otellerini</a> diğer konaklama türleriyle karşılaştırıyorsanız bölge ve tesis seçmeden önce rehberimize bakın.`,
    roomsKicker: "Voulamandis House oda & daireleri",
    roomsTitle: "Seyahatinize uygun kategoriyi seçin",
    roomsText:
      "Ekonomi çift kişilik odalardan konforlu odalara ve aile dairelerine kadar seçenekleri karşılaştırın ve konaklamanıza uygun kategoriyi bulun.",
    roomsSideKicker: "Tüm seçenekler tek sayfada",
    roomsSideTitle: "Oda ve daireleri karşılaştırın",
    roomsSideText:
      "Seçiminizi yapmadan önce kapasiteyi, kategorileri ve temel özellikleri birlikte görün.",
  },
};

export function withHomepageSeoIntent(
  data: HomePageData,
  locale: LanguageCode,
): HomePageData {
  const text = copy[locale];

  return withUpdatedIntroReasons({
    ...data,
    seo: {
      ...data.seo,
      title: text.seoTitle,
      description: text.seoDescription,
    },
    hero: {
      ...data.hero,
      title: text.heroTitle,
      descriptionHtml: text.heroDescriptionHtml,
    },
    intro: {
      ...data.intro,
      left: {
        ...data.intro.left,
        title: text.introTitle,
        bodyHtml: text.introBodyHtml,
      },
    },
    roomsPreview: {
      ...data.roomsPreview,
      kicker: text.roomsKicker,
      title: text.roomsTitle,
      text: text.roomsText,
      sideCard: {
        ...data.roomsPreview.sideCard,
        kicker: text.roomsSideKicker,
        title: text.roomsSideTitle,
        text: text.roomsSideText,
      },
    },
  });
}
