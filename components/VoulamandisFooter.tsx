import { chiosActivityDetailPaths } from "@/content/chios-activities";

type LanguageCode = "en" | "el" | "fr" | "de" | "it" | "es" | "tr";

const homePaths: Record<LanguageCode, string> = {
  en: "/",
  el: "/el/",
  fr: "/fr/",
  de: "/de/",
  it: "/it/",
  es: "/es/",
  tr: "/tr/",
};

const roomsCategoryPaths: Record<LanguageCode, string> = {
  en: "/chios-rooms/",
  el: "/el/domatia-xios/",
  fr: "/fr/chambres-a-chios/",
  de: "/de/chios-zimmer/",
  it: "/it/camere-a-chios/",
  es: "/es/habitaciones-en-chios/",
  tr: "/tr/sakiz-adasi-odalari/",
};

const ratesPaths: Record<LanguageCode, string> = {
  en: "/chios-hotels-rates/",
  el: "/el/amesi-kratisi-voulamandis-house/",
  fr: "/fr/tarifs-des-hotels-a-chios/",
  de: "/de/hotelpreise-auf-der-insel-chios/",
  it: "/it/prezzi-hotel-chios/",
  es: "/es/los-mejores-precios-de-hotel-en-la-isla-chios/",
  tr: "/tr/sakiz-adasi-rezervasyon/",
};

const contactPaths: Record<LanguageCode, string> = {
  en: "/voulamandis-house-contact-us-form-fill-in-the-form/",
  el: "/el/epikoinonia-voulamandis-house/",
  fr: "/fr/contactez-nous/",
  de: "/de/kontaktieren-voulamandis-house/",
  it: "/it/contattaci-voulamandis-house/",
  es: "/es/contacta-con-voulamandis-house/",
  tr: "/tr/sakiz-adasi-otelleri-ile-iletisim/",
};

const chiosIslandPaths: Record<LanguageCode, string> = {
  en: "/chios-island/",
  el: "/el/ti-na-do-sti-xio/",
  fr: "/fr/chios-en-grece/",
  de: "/de/chios-insel/",
  it: "/it/chios-lisola-in-grecia/",
  es: "/es/chios-en-grecia/",
  tr: "/tr/sakiz-adasi/",
};

const holidayQuizPaths: Record<LanguageCode, string> = {
  en: "/chios-holidays-quiz/",
  el: "/el/diakopes-sti-chio-quiz/",
  fr: "/fr/quiz-vacances-a-chios/",
  de: "/de/chios-urlaubsquiz/",
  it: "/it/quiz-vacanze-a-chios/",
  es: "/es/quiz-vacaciones-en-quios/",
  tr: "/tr/sakiz-adasi-tatil-testi/",
};

const beachPaths: Record<LanguageCode, string> = {
  en: "/chios/chios-beaches/",
  el: "/el/paralies-xios/",
  fr: "/fr/plages-de-chios/",
  de: "/de/straende-chios/",
  it: "/it/spiagge-chios/",
  es: "/es/playas-chios/",
  tr: "/tr/sakiz-adasi-plajlari/",
};

const agiaDynamiBeachPaths: Record<LanguageCode, string> = {
  en: "/chios/chios-beaches/agia-dynami-beach-chios/",
  el: "/el/paralies-xios/paralia-agia-dynami/",
  fr: "/fr/plages-de-chios/plage-agia-dynami/",
  de: "/de/straende-chios/agia-dynami-strand/",
  it: "/it/spiagge-chios/spiaggia-agia-dynami/",
  es: "/es/playas-chios/playa-agia-dynami/",
  tr: "/tr/sakiz-adasi-plajlari/agia-dynami-plaji/",
};

const mavraVoliaBeachPaths: Record<LanguageCode, string> = {
  en: "/chios/chios-beaches/emporios-beach/",
  el: "/el/paralies-xios/paralia-mavra-volia/",
  fr: "/fr/plages-de-chios/plage-mavra-volia/",
  de: "/de/straende-chios/mavra-volia-strand/",
  it: "/it/spiagge-chios/spiaggia-mavra-volia/",
  es: "/es/playas-chios/playa-mavra-volia/",
  tr: "/tr/sakiz-adasi-plajlari/mavra-volia-plaji/",
};

const villagePaths: Record<LanguageCode, string> = {
  en: "/chios/chios-villages/",
  el: "/el/xoria-xios/",
  fr: "/fr/villages-de-chios/",
  de: "/de/doerfer-chios/",
  it: "/it/villaggi-chios/",
  es: "/es/pueblos-chios/",
  tr: "/tr/sakiz-adasi-koyleri/",
};

const pyrgiVillagePaths: Record<LanguageCode, string> = {
  en: "/chios/chios-villages/chios-pyrgi/",
  el: "/el/xoria-xios/pyrgi-xios/",
  fr: "/fr/villages-de-chios/village-pyrgi/",
  de: "/de/doerfer-chios/pyrgi-dorf/",
  it: "/it/villaggi-chios/villaggio-pyrgi/",
  es: "/es/pueblos-chios/pueblo-pyrgi/",
  tr: "/tr/sakiz-adasi-koyleri/pyrgi-koyu/",
};

const mestaVillagePaths: Record<LanguageCode, string> = {
  en: "/chios/chios-villages/mesta-chios/",
  el: "/el/xoria-xios/mesta-xios/",
  fr: "/fr/villages-de-chios/village-mesta/",
  de: "/de/doerfer-chios/mesta-dorf/",
  it: "/it/villaggi-chios/villaggio-mesta/",
  es: "/es/pueblos-chios/pueblo-mesta/",
  tr: "/tr/sakiz-adasi-koyleri/mesta-koyu/",
};

const museumPaths: Record<LanguageCode, string> = {
  en: "/chios/chios-museums/",
  el: "/el/mouseia-xios/",
  fr: "/fr/musees-de-chios/",
  de: "/de/museen-chios/",
  it: "/it/musei-chios/",
  es: "/es/museos-chios/",
  tr: "/tr/sakiz-adasi-muzeleri/",
};

const masticMuseumPaths: Record<LanguageCode, string> = {
  en: "/chios/chios-museums/the-mastic-museum-chios/",
  el: "/el/mouseia-xios/mouseio-mastichas-xios/",
  fr: "/fr/musees-de-chios/musee-du-mastic-chios/",
  de: "/de/museen-chios/mastix-museum-chios/",
  it: "/it/musei-chios/museo-del-mastice-chios/",
  es: "/es/museos-chios/museo-mastiha-chios/",
  tr: "/tr/sakiz-adasi-muzeleri/sakiz-mastik-muzesi/",
};

const chiosSecretsTitles: Record<LanguageCode, string> = {
  en: "Chios Secrets",
  el: "Μυστικά της Χίου",
  fr: "Secrets de Chios",
  de: "Geheimtipps auf Chios",
  it: "Segreti di Chios",
  es: "Secretos de Chios",
  tr: "Sakız Adası Sırları",
};

const chiosSecretsLabels: Record<
  LanguageCode,
  {
    orchids: string;
    hiking: string;
    thermalBaths: string;
    mostra: string;
    rocketWar: string;
  }
> = {
  en: {
    orchids: "Orchids of Chios",
    hiking: "Hiking in Chios",
    thermalBaths: "Thermal Baths",
    mostra: "Mostra Festival",
    rocketWar: "Rocket War",
  },
  el: {
    orchids: "Ορχιδέες της Χίου",
    hiking: "Πεζοπορία στη Χίο",
    thermalBaths: "Ιαματικά λουτρά",
    mostra: "Μόστρα Θυμιανών",
    rocketWar: "Ρουκετοπόλεμος",
  },
  fr: {
    orchids: "Orchidées de Chios",
    hiking: "Randonnée à Chios",
    thermalBaths: "Sources thermales",
    mostra: "Festival Mostra",
    rocketWar: "Guerre des fusées",
  },
  de: {
    orchids: "Orchideen auf Chios",
    hiking: "Wandern auf Chios",
    thermalBaths: "Thermalquellen",
    mostra: "Mostra Festival",
    rocketWar: "Raketenkrieg",
  },
  it: {
    orchids: "Orchidee di Chios",
    hiking: "Trekking a Chios",
    thermalBaths: "Terme di Chios",
    mostra: "Festival Mostra",
    rocketWar: "Guerra dei razzi",
  },
  es: {
    orchids: "Orquídeas de Chios",
    hiking: "Senderismo en Chios",
    thermalBaths: "Baños termales",
    mostra: "Festival Mostra",
    rocketWar: "Guerra de cohetes",
  },
  tr: {
    orchids: "Sakız Adası orkideleri",
    hiking: "Sakız Adası yürüyüş rotaları",
    thermalBaths: "Termal kaplıcalar",
    mostra: "Mostra Festivali",
    rocketWar: "Roket Savaşı",
  },
};
const footerCopy: Record<
  LanguageCode,
  {
    description: string;
    bookStay: string;
    footerNavigation: string;
    allRightsReserved: string;
    sitemap: string;
    robots: string;
    groups: {
      stay: string;
      exploreChios: string;
      popularGuides: string;
    };
    links: {
      rooms: string;
      ratesAvailability: string;
      contact: string;
      chiosIslandGuide: string;
      beaches: string;
      villages: string;
      museums: string;
      holidayQuiz: string;
      agiaDynami: string;
      mavraVolia: string;
      pyrgi: string;
      mesta: string;
      masticMuseum: string;
    };
  }
> = {
  en: {
    description:
      "Quiet rooms and apartments in the historic Kampos area of Chios, with easy access to Chios Town, the airport, beaches, villages and cultural landmarks.",
    bookStay: "Book your stay",
    footerNavigation: "Footer navigation",
    allRightsReserved: "All rights reserved.",
    sitemap: "Sitemap",
    robots: "Robots",
    groups: {
      stay: "Stay",
      exploreChios: "Explore Chios",
      popularGuides: "Popular Guides",
    },
    links: {
      rooms: "Rooms",
      ratesAvailability: "Rates & Availability",
      contact: "Contact",
      chiosIslandGuide: "Chios Island Guide",
      beaches: "Chios Beaches",
      villages: "Chios Villages",
      museums: "Chios Museums",
      holidayQuiz: "Chios Holiday Quiz",
      agiaDynami: "Agia Dynami Beach",
      mavraVolia: "Mavra Volia Beach",
      pyrgi: "Pyrgi Village",
      mesta: "Mesta Village",
      masticMuseum: "Chios Mastic Museum",
    },
  },
  el: {
    description:
      "Ήσυχα δωμάτια και διαμερίσματα στον ιστορικό Κάμπο της Χίου, με εύκολη πρόσβαση στην πόλη, το αεροδρόμιο, τις παραλίες, τα χωριά και τα αξιοθέατα.",
    bookStay: "Κάντε κράτηση",
    footerNavigation: "Πλοήγηση υποσέλιδου",
    allRightsReserved: "Με επιφύλαξη παντός δικαιώματος.",
    sitemap: "Χάρτης ιστότοπου",
    robots: "Robots",
    groups: {
      stay: "Διαμονή",
      exploreChios: "Ανακαλύψτε τη Χίο",
      popularGuides: "Δημοφιλείς οδηγοί",
    },
    links: {
      rooms: "Δωμάτια",
      ratesAvailability: "Τιμές & Διαθεσιμότητα",
      contact: "Επικοινωνία",
      chiosIslandGuide: "Οδηγός Χίου",
      beaches: "Παραλίες της Χίου",
      villages: "Χωριά της Χίου",
      museums: "Μουσεία της Χίου",
      holidayQuiz: "Quiz διακοπών στη Χίο",
      agiaDynami: "Παραλία Αγία Δύναμη",
      mavraVolia: "Παραλία Μαύρα Βόλια",
      pyrgi: "Χωριό Πυργί",
      mesta: "Χωριό Μεστά",
      masticMuseum: "Μουσείο Μαστίχας Χίου",
    },
  },
  fr: {
    description:
      "Chambres et appartements calmes dans le quartier historique de Kampos à Chios, avec un accès facile à la ville, à l’aéroport, aux plages, aux villages et aux sites culturels.",
    bookStay: "Réserver votre séjour",
    footerNavigation: "Navigation du pied de page",
    allRightsReserved: "Tous droits réservés.",
    sitemap: "Plan du site",
    robots: "Robots",
    groups: {
      stay: "Séjour",
      exploreChios: "Explorer Chios",
      popularGuides: "Guides populaires",
    },
    links: {
      rooms: "Chambres",
      ratesAvailability: "Tarifs & Disponibilité",
      contact: "Contact",
      chiosIslandGuide: "Guide de Chios",
      beaches: "Plages de Chios",
      villages: "Villages de Chios",
      museums: "Musées de Chios",
      holidayQuiz: "Quiz vacances à Chios",
      agiaDynami: "Plage d’Agia Dynami",
      mavraVolia: "Plage de Mavra Volia",
      pyrgi: "Village de Pyrgi",
      mesta: "Village de Mesta",
      masticMuseum: "Musée du Mastic de Chios",
    },
  },
  de: {
    description:
      "Ruhige Zimmer und Apartments im historischen Kampos-Gebiet von Chios, mit einfachem Zugang zur Stadt, zum Flughafen, zu Stränden, Dörfern und Sehenswürdigkeiten.",
    bookStay: "Aufenthalt buchen",
    footerNavigation: "Fußzeilen-Navigation",
    allRightsReserved: "Alle Rechte vorbehalten.",
    sitemap: "Sitemap",
    robots: "Robots",
    groups: {
      stay: "Aufenthalt",
      exploreChios: "Chios entdecken",
      popularGuides: "Beliebte Reiseführer",
    },
    links: {
      rooms: "Zimmer",
      ratesAvailability: "Preise & Verfügbarkeit",
      contact: "Kontakt",
      chiosIslandGuide: "Chios Reiseführer",
      beaches: "Strände auf Chios",
      villages: "Dörfer auf Chios",
      museums: "Museen auf Chios",
      holidayQuiz: "Chios Urlaubsquiz",
      agiaDynami: "Agia Dynami Strand",
      mavraVolia: "Mavra Volia Strand",
      pyrgi: "Pyrgi Dorf",
      mesta: "Mesta Dorf",
      masticMuseum: "Chios Mastix Museum",
    },
  },
  it: {
    description:
      "Camere e appartamenti tranquilli nella storica zona di Kampos a Chios, con facile accesso alla città, all’aeroporto, alle spiagge, ai villaggi e ai luoghi culturali.",
    bookStay: "Prenota il soggiorno",
    footerNavigation: "Navigazione footer",
    allRightsReserved: "Tutti i diritti riservati.",
    sitemap: "Sitemap",
    robots: "Robots",
    groups: {
      stay: "Soggiorno",
      exploreChios: "Esplora Chios",
      popularGuides: "Guide popolari",
    },
    links: {
      rooms: "Camere",
      ratesAvailability: "Prezzi & Disponibilità",
      contact: "Contatti",
      chiosIslandGuide: "Guida di Chios",
      beaches: "Spiagge di Chios",
      villages: "Villaggi di Chios",
      museums: "Musei di Chios",
      holidayQuiz: "Quiz vacanze a Chios",
      agiaDynami: "Spiaggia di Agia Dynami",
      mavraVolia: "Spiaggia di Mavra Volia",
      pyrgi: "Villaggio di Pyrgi",
      mesta: "Villaggio di Mesta",
      masticMuseum: "Museo del Mastice di Chios",
    },
  },
  es: {
    description:
      "Habitaciones y apartamentos tranquilos en la histórica zona de Kampos en Chios, con fácil acceso a la ciudad, al aeropuerto, a playas, pueblos y lugares culturales.",
    bookStay: "Reserva tu estancia",
    footerNavigation: "Navegación del pie de página",
    allRightsReserved: "Todos los derechos reservados.",
    sitemap: "Mapa del sitio",
    robots: "Robots",
    groups: {
      stay: "Estancia",
      exploreChios: "Explorar Chios",
      popularGuides: "Guías populares",
    },
    links: {
      rooms: "Habitaciones",
      ratesAvailability: "Precios & Disponibilidad",
      contact: "Contacto",
      chiosIslandGuide: "Guía de Chios",
      beaches: "Playas de Chios",
      villages: "Pueblos de Chios",
      museums: "Museos de Chios",
      holidayQuiz: "Quiz de vacaciones en Chios",
      agiaDynami: "Playa Agia Dynami",
      mavraVolia: "Playa Mavra Volia",
      pyrgi: "Pueblo de Pyrgi",
      mesta: "Pueblo de Mesta",
      masticMuseum: "Museo del Mastiha de Chios",
    },
  },
  tr: {
    description:
      "Sakız Adası’nın tarihi Kampos bölgesinde, şehir merkezine, havaalanına, plajlara, köylere ve kültürel noktalara kolay erişimli sakin odalar ve daireler.",
    bookStay: "Konaklamanızı ayırtın",
    footerNavigation: "Alt bilgi navigasyonu",
    allRightsReserved: "Tüm hakları saklıdır.",
    sitemap: "Site haritası",
    robots: "Robots",
    groups: {
      stay: "Konaklama",
      exploreChios: "Sakız Adası’nı keşfedin",
      popularGuides: "Popüler rehberler",
    },
    links: {
      rooms: "Odalar",
      ratesAvailability: "Fiyatlar & Müsaitlik",
      contact: "İletişim",
      chiosIslandGuide: "Sakız Adası Rehberi",
      beaches: "Sakız Adası Plajları",
      villages: "Sakız Adası Köyleri",
      museums: "Sakız Adası Müzeleri",
      holidayQuiz: "Sakız Adası Tatil Testi",
      agiaDynami: "Agia Dynami Plajı",
      mavraVolia: "Mavra Volia Plajı",
      pyrgi: "Pyrgi Köyü",
      mesta: "Mesta Köyü",
      masticMuseum: "Sakız Adası Mastik Müzesi",
    },
  },
};

function normalizePath(path: string) {
  if (!path) {
    return "/";
  }

  const withLeadingSlash = path.startsWith("/") ? path : `/${path}`;

  if (withLeadingSlash === "/") {
    return "/";
  }

  return withLeadingSlash.endsWith("/")
    ? withLeadingSlash
    : `${withLeadingSlash}/`;
}

function getCurrentLanguage(path: string): LanguageCode {
  const normalizedPath = normalizePath(path);

  if (normalizedPath === "/el/" || normalizedPath.startsWith("/el/")) {
    return "el";
  }

  if (normalizedPath === "/fr/" || normalizedPath.startsWith("/fr/")) {
    return "fr";
  }

  if (normalizedPath === "/de/" || normalizedPath.startsWith("/de/")) {
    return "de";
  }

  if (normalizedPath === "/it/" || normalizedPath.startsWith("/it/")) {
    return "it";
  }

  if (normalizedPath === "/es/" || normalizedPath.startsWith("/es/")) {
    return "es";
  }

  if (normalizedPath === "/tr/" || normalizedPath.startsWith("/tr/")) {
    return "tr";
  }

  return "en";
}

function getFooterGroups(language: LanguageCode) {
  const copy = footerCopy[language];

  return [
    {
      title: copy.groups.stay,
      links: [
        {
          label: copy.links.rooms,
          href: roomsCategoryPaths[language],
        },
        {
          label: copy.links.ratesAvailability,
          href: ratesPaths[language],
        },
        {
          label: copy.links.contact,
          href: contactPaths[language],
        },
      ],
    },
    {
      title: copy.groups.exploreChios,
      links: [
        {
          label: copy.links.chiosIslandGuide,
          href: chiosIslandPaths[language],
        },
        {
          label: copy.links.beaches,
          href: beachPaths[language],
        },
        {
          label: copy.links.villages,
          href: villagePaths[language],
        },
        {
          label: copy.links.museums,
          href: museumPaths[language],
        },
        {
          label: copy.links.holidayQuiz,
          href: holidayQuizPaths[language],
        },
      ],
    },
    {
      title: chiosSecretsTitles[language],
      links: [
        {
          label: chiosSecretsLabels[language].orchids,
          href: chiosActivityDetailPaths.orchids[language],
        },
        {
          label: chiosSecretsLabels[language].hiking,
          href: chiosActivityDetailPaths.hiking[language],
        },
        {
          label: chiosSecretsLabels[language].thermalBaths,
          href: chiosActivityDetailPaths.thermalBaths[language],
        },
        {
          label: chiosSecretsLabels[language].mostra,
          href: chiosActivityDetailPaths.mostra[language],
        },
        {
          label: chiosSecretsLabels[language].rocketWar,
          href: chiosActivityDetailPaths.rocketWar[language],
        },
      ],
    },
    {
      title: copy.groups.popularGuides,
      links: [
        {
          label: copy.links.agiaDynami,
          href: agiaDynamiBeachPaths[language],
        },
        {
          label: copy.links.mavraVolia,
          href: mavraVoliaBeachPaths[language],
        },
        {
          label: copy.links.pyrgi,
          href: pyrgiVillagePaths[language],
        },
        {
          label: copy.links.mesta,
          href: mestaVillagePaths[language],
        },
        {
          label: copy.links.masticMuseum,
          href: masticMuseumPaths[language],
        },
      ],
    },
  ];
}

export function VoulamandisFooter({ language = "en" }: { language?: LanguageCode }) {
  const currentLanguage = language;
  const copy = footerCopy[currentLanguage];
  const footerGroups = getFooterGroups(currentLanguage);
  const year = new Date().getFullYear();

  return (
    <footer className="vh-footer">
      <div className="vh-footer__inner">
        <section className="vh-footer__brand">
          <a className="vh-footer__logo" href={homePaths[currentLanguage]}>
            <span>VH</span>

            <div>
              <strong>Voulamandis House</strong>
              <small>Kampos, Chios</small>
            </div>
          </a>

          <p>{copy.description}</p>

          <div className="vh-footer__cta-row">
            <a className="vh-footer__primary" href={ratesPaths[currentLanguage]}>
              {copy.bookStay}
            </a>

            <a
              className="vh-footer__secondary"
              href="https://wa.me/306944474226"
              target="_blank"
              rel="noopener"
            >
              WhatsApp
            </a>
            <a
              className="vh-footer__secondary"
              href="https://www.instagram.com/chioshotels/"
              target="_blank"
              rel="noopener"
            >
              Instagram
            </a>

            <a
              className="vh-footer__secondary"
              href="https://www.facebook.com/people/Voulamandis-House/100063584320703/"
              target="_blank"
              rel="noopener"
            >
              Facebook
            </a>
          </div>
        </section>

        <nav className="vh-footer__nav" aria-label={copy.footerNavigation}>
          {footerGroups.map((group) => (
            <div className="vh-footer__group" key={group.title}>
              <h2>{group.title}</h2>

              <ul>
                {group.links.map((link) => (
                  <li key={`${group.title}-${link.href}`}>
                    <a href={link.href}>{link.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      <div className="vh-footer__bottom">
        <p>
          © {year} Voulamandis House. {copy.allRightsReserved}
        </p>

        <div>
          <a href="/sitemap.xml">{copy.sitemap}</a>
          <a href="/robots.txt">{copy.robots}</a>
        </div>
      </div>
    </footer>
  );
}

