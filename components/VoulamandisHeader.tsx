"use client";

import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";

const languageOptions = [
  {
    code: "en",
    label: "EN",
    name: "English",
  },
  {
    code: "el",
    label: "EL",
    name: "Ελληνικά",
  },
  {
    code: "fr",
    label: "FR",
    name: "Français",
  },
  {
    code: "de",
    label: "DE",
    name: "Deutsch",
  },
  {
    code: "it",
    label: "IT",
    name: "Italiano",
  },
  {
    code: "es",
    label: "ES",
    name: "Español",
  },
  {
    code: "tr",
    label: "TR",
    name: "Türkçe",
  },
] as const;

type LanguageCode = (typeof languageOptions)[number]["code"];

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

const economyDoubleRoomPaths: Record<LanguageCode, string> = {
  en: "/chios-rooms/economy-double-rooms/",
  el: "/el/domatia-xios/oikonomiko-diklino-domatio/",
  fr: "/fr/chambres-a-chios/chambres-doubles-economiques/",
  de: "/de/zimmer-chios/economy-zimmer-auf-chios/",
  it: "/it/stanze-a-chios/camera-doppia-economica-chios/",
  es: "/es/habitaciones-en-chios/economicas-habitaciones-en-chios/",
  tr: "/tr/chios-odalari/sakiz-adasindaki-ekonomi-cift-kisilik-oda/",
};

const standardDoubleRoomPaths: Record<LanguageCode, string> = {
  en: "/chios-rooms/standard-double-room/",
  el: "/el/domatia-xios/diklina-triklina-domatia/",
  fr: "/fr/chambres-a-chios/chambres-doubles-standard/",
  de: "/de/zimmer-chios/standard-doppelzimmer-auf-chios/",
  it: "/it/stanze-a-chios/camere-doppie-standard-chios/",
  es: "/es/habitaciones-en-chios/habitaciones-dobles-estandar/",
  tr: "/tr/chios-odalari/standart-cift-kisilik-odalar/",
};

const familyChiosApartmentsPaths: Record<LanguageCode, string> = {
  en: "/chios-rooms/family-chios-apartments/",
  el: "/el/domatia-xios/oikogeneiako-diamerisma/",
  fr: "/fr/chambres-a-chios/appartements-familiaux-de-chios/",
  de: "/de/zimmer-chios/familienapartments-in-chios/",
  it: "/it/stanze-a-chios/appartamenti-familiari-a-chios/",
  es: "/es/habitaciones-en-chios/apartamentos-familiares-en-chios/",
  tr: "/tr/chios-odalari/sakiz-adasinda-buyuk-aile-daireleri/",
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

const beachPaths: Record<LanguageCode, string> = {
  en: "/chios/chios-beaches/",
  el: "/chios/chios-beaches/",
  fr: "/chios/chios-beaches/",
  de: "/chios/chios-beaches/",
  it: "/chios/chios-beaches/",
  es: "/chios/chios-beaches/",
  tr: "/chios/chios-beaches/",
};

const villagePaths: Record<LanguageCode, string> = {
  en: "/chios/chios-villages/",
  el: "/chios/chios-villages/",
  fr: "/chios/chios-villages/",
  de: "/chios/chios-villages/",
  it: "/chios/chios-villages/",
  es: "/chios/chios-villages/",
  tr: "/chios/chios-villages/",
};

const museumPaths: Record<LanguageCode, string> = {
  en: "/chios/chios-museums/",
  el: "/chios/chios-museums/",
  fr: "/chios/chios-museums/",
  de: "/chios/chios-museums/",
  it: "/chios/chios-museums/",
  es: "/chios/chios-museums/",
  tr: "/chios/chios-museums/",
};

const navigationCopy: Record<
  LanguageCode,
  {
    ariaMain: string;
    ariaLanguage: string;
    bookNow: string;
    bookStay: string;
    menu: string;
    exploreTitle: string;
    language: string;
    stay: string;
    exploreChios: string;
    closeMenu: string;
    openMenu: string;
    rooms: string;
    rates: string;
    ratesAvailability: string;
    chiosIsland: string;
    beaches: string;
    villages: string;
    museums: string;
    contact: string;
    chiosIslandGuide: string;
    exploreCards: {
      beaches: {
        title: string;
        text: string;
      };
      villages: {
        title: string;
        text: string;
      };
      museums: {
        title: string;
        text: string;
      };
    };
  }
> = {
  en: {
    ariaMain: "Main navigation",
    ariaLanguage: "Language selector",
    bookNow: "Book Now",
    bookStay: "Book your stay",
    menu: "Menu",
    exploreTitle: "Explore Voulamandis House",
    language: "Language",
    stay: "Stay",
    exploreChios: "Explore Chios",
    closeMenu: "Close menu",
    openMenu: "Open menu",
    rooms: "Rooms",
    rates: "Rates",
    ratesAvailability: "Rates & Availability",
    chiosIsland: "Chios Island",
    beaches: "Beaches",
    villages: "Villages",
    museums: "Museums",
    contact: "Contact",
    chiosIslandGuide: "Chios Island Guide",
    exploreCards: {
      beaches: {
        title: "Chios Beaches",
        text: "Crystal waters, volcanic coves and family-friendly shores.",
      },
      villages: {
        title: "Chios Villages",
        text: "Mastic villages, medieval alleys and local life.",
      },
      museums: {
        title: "Chios Museums",
        text: "Mastic culture, history, books and maritime heritage.",
      },
    },
  },
  el: {
    ariaMain: "Κύρια πλοήγηση",
    ariaLanguage: "Επιλογή γλώσσας",
    bookNow: "Κράτηση",
    bookStay: "Κάντε κράτηση",
    menu: "Μενού",
    exploreTitle: "Ανακαλύψτε το Voulamandis House",
    language: "Γλώσσα",
    stay: "Διαμονή",
    exploreChios: "Ανακαλύψτε τη Χίο",
    closeMenu: "Κλείσιμο μενού",
    openMenu: "Άνοιγμα μενού",
    rooms: "Δωμάτια",
    rates: "Τιμές",
    ratesAvailability: "Τιμές & Διαθεσιμότητα",
    chiosIsland: "Χίος",
    beaches: "Παραλίες",
    villages: "Χωριά",
    museums: "Μουσεία",
    contact: "Επικοινωνία",
    chiosIslandGuide: "Οδηγός Χίου",
    exploreCards: {
      beaches: {
        title: "Παραλίες της Χίου",
        text: "Καθαρά νερά, όμορφοι όρμοι και παραλίες για κάθε ταξιδιώτη.",
      },
      villages: {
        title: "Χωριά της Χίου",
        text: "Μαστιχοχώρια, μεσαιωνικά σοκάκια και αυθεντική τοπική ζωή.",
      },
      museums: {
        title: "Μουσεία της Χίου",
        text: "Μαστίχα, ιστορία, βιβλία και ναυτική παράδοση.",
      },
    },
  },
  fr: {
    ariaMain: "Navigation principale",
    ariaLanguage: "Sélecteur de langue",
    bookNow: "Réserver",
    bookStay: "Réserver votre séjour",
    menu: "Menu",
    exploreTitle: "Découvrez Voulamandis House",
    language: "Langue",
    stay: "Séjour",
    exploreChios: "Explorer Chios",
    closeMenu: "Fermer le menu",
    openMenu: "Ouvrir le menu",
    rooms: "Chambres",
    rates: "Tarifs",
    ratesAvailability: "Tarifs & Disponibilité",
    chiosIsland: "Île de Chios",
    beaches: "Plages",
    villages: "Villages",
    museums: "Musées",
    contact: "Contact",
    chiosIslandGuide: "Guide de Chios",
    exploreCards: {
      beaches: {
        title: "Plages de Chios",
        text: "Eaux cristallines, criques volcaniques et plages familiales.",
      },
      villages: {
        title: "Villages de Chios",
        text: "Villages du mastic, ruelles médiévales et vie locale.",
      },
      museums: {
        title: "Musées de Chios",
        text: "Culture du mastic, histoire, livres et patrimoine maritime.",
      },
    },
  },
  de: {
    ariaMain: "Hauptnavigation",
    ariaLanguage: "Sprachauswahl",
    bookNow: "Jetzt buchen",
    bookStay: "Aufenthalt buchen",
    menu: "Menü",
    exploreTitle: "Voulamandis House entdecken",
    language: "Sprache",
    stay: "Aufenthalt",
    exploreChios: "Chios entdecken",
    closeMenu: "Menü schließen",
    openMenu: "Menü öffnen",
    rooms: "Zimmer",
    rates: "Preise",
    ratesAvailability: "Preise & Verfügbarkeit",
    chiosIsland: "Insel Chios",
    beaches: "Strände",
    villages: "Dörfer",
    museums: "Museen",
    contact: "Kontakt",
    chiosIslandGuide: "Chios Reiseführer",
    exploreCards: {
      beaches: {
        title: "Strände auf Chios",
        text: "Klares Wasser, vulkanische Buchten und familienfreundliche Strände.",
      },
      villages: {
        title: "Dörfer auf Chios",
        text: "Mastixdörfer, mittelalterliche Gassen und lokales Leben.",
      },
      museums: {
        title: "Museen auf Chios",
        text: "Mastixkultur, Geschichte, Bücher und maritimes Erbe.",
      },
    },
  },
  it: {
    ariaMain: "Navigazione principale",
    ariaLanguage: "Selettore lingua",
    bookNow: "Prenota",
    bookStay: "Prenota il soggiorno",
    menu: "Menu",
    exploreTitle: "Scopri Voulamandis House",
    language: "Lingua",
    stay: "Soggiorno",
    exploreChios: "Esplora Chios",
    closeMenu: "Chiudi menu",
    openMenu: "Apri menu",
    rooms: "Camere",
    rates: "Prezzi",
    ratesAvailability: "Prezzi & Disponibilità",
    chiosIsland: "Isola di Chios",
    beaches: "Spiagge",
    villages: "Villaggi",
    museums: "Musei",
    contact: "Contatti",
    chiosIslandGuide: "Guida di Chios",
    exploreCards: {
      beaches: {
        title: "Spiagge di Chios",
        text: "Acque cristalline, calette vulcaniche e spiagge adatte alle famiglie.",
      },
      villages: {
        title: "Villaggi di Chios",
        text: "Villaggi del mastice, vicoli medievali e vita locale.",
      },
      museums: {
        title: "Musei di Chios",
        text: "Cultura del mastice, storia, libri e patrimonio marittimo.",
      },
    },
  },
  es: {
    ariaMain: "Navegación principal",
    ariaLanguage: "Selector de idioma",
    bookNow: "Reservar",
    bookStay: "Reserva tu estancia",
    menu: "Menú",
    exploreTitle: "Explora Voulamandis House",
    language: "Idioma",
    stay: "Estancia",
    exploreChios: "Explorar Chios",
    closeMenu: "Cerrar menú",
    openMenu: "Abrir menú",
    rooms: "Habitaciones",
    rates: "Precios",
    ratesAvailability: "Precios & Disponibilidad",
    chiosIsland: "Isla de Chios",
    beaches: "Playas",
    villages: "Pueblos",
    museums: "Museos",
    contact: "Contacto",
    chiosIslandGuide: "Guía de Chios",
    exploreCards: {
      beaches: {
        title: "Playas de Chios",
        text: "Aguas cristalinas, calas volcánicas y playas familiares.",
      },
      villages: {
        title: "Pueblos de Chios",
        text: "Pueblos del mastiha, callejones medievales y vida local.",
      },
      museums: {
        title: "Museos de Chios",
        text: "Cultura del mastiha, historia, libros y patrimonio marítimo.",
      },
    },
  },
  tr: {
    ariaMain: "Ana gezinme",
    ariaLanguage: "Dil seçici",
    bookNow: "Rezervasyon",
    bookStay: "Konaklamanızı ayırtın",
    menu: "Menü",
    exploreTitle: "Voulamandis House'u keşfedin",
    language: "Dil",
    stay: "Konaklama",
    exploreChios: "Sakız Adası'nı keşfedin",
    closeMenu: "Menüyü kapat",
    openMenu: "Menüyü aç",
    rooms: "Odalar",
    rates: "Fiyatlar",
    ratesAvailability: "Fiyatlar & Müsaitlik",
    chiosIsland: "Sakız Adası",
    beaches: "Plajlar",
    villages: "Köyler",
    museums: "Müzeler",
    contact: "İletişim",
    chiosIslandGuide: "Sakız Adası Rehberi",
    exploreCards: {
      beaches: {
        title: "Sakız Adası Plajları",
        text: "Berrak sular, volkanik koylar ve aile dostu plajlar.",
      },
      villages: {
        title: "Sakız Adası Köyleri",
        text: "Mastik köyleri, Orta Çağ sokakları ve yerel yaşam.",
      },
      museums: {
        title: "Sakız Adası Müzeleri",
        text: "Mastik kültürü, tarih, kitaplar ve denizcilik mirası.",
      },
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

function getLanguageHref(path: string, language: LanguageCode) {
  const normalizedPath = normalizePath(path);

  const isHomePage = Object.values(homePaths).includes(normalizedPath);

  const isRoomsCategoryPage =
    Object.values(roomsCategoryPaths).includes(normalizedPath);

  const isEconomyDoubleRoomPage =
    Object.values(economyDoubleRoomPaths).includes(normalizedPath);

  const isStandardDoubleRoomPage =
    Object.values(standardDoubleRoomPaths).includes(normalizedPath);

  const isFamilyChiosApartmentsPage =
    Object.values(familyChiosApartmentsPaths).includes(normalizedPath);

  const isRatesPage = Object.values(ratesPaths).includes(normalizedPath);

  const isContactPage = Object.values(contactPaths).includes(normalizedPath);

  const isChiosIslandPage =
    Object.values(chiosIslandPaths).includes(normalizedPath);

  if (isHomePage) {
    return homePaths[language];
  }

  if (isRoomsCategoryPage) {
    return roomsCategoryPaths[language];
  }

  if (isEconomyDoubleRoomPage) {
    return economyDoubleRoomPaths[language];
  }

  if (isStandardDoubleRoomPage) {
    return standardDoubleRoomPaths[language];
  }

  if (isFamilyChiosApartmentsPage) {
    return familyChiosApartmentsPaths[language];
  }

  if (isRatesPage) {
    return ratesPaths[language];
  }

  if (isContactPage) {
    return contactPaths[language];
  }

  if (isChiosIslandPage) {
    return chiosIslandPaths[language];
  }

  if (
    normalizedPath === "/chios-rooms/" ||
    normalizedPath.startsWith("/chios-rooms/")
  ) {
    return roomsCategoryPaths[language];
  }

  return homePaths[language];
}

function getMainLinks(language: LanguageCode) {
  const copy = navigationCopy[language];

  return [
    {
      label: copy.rooms,
      href: roomsCategoryPaths[language],
    },
    {
      label: copy.rates,
      href: ratesPaths[language],
    },
    {
      label: copy.chiosIsland,
      href: chiosIslandPaths[language],
    },
    {
      label: copy.beaches,
      href: beachPaths[language],
    },
    {
      label: copy.villages,
      href: villagePaths[language],
    },
    {
      label: copy.museums,
      href: museumPaths[language],
    },
    {
      label: copy.contact,
      href: contactPaths[language],
    },
  ];
}

function getExploreLinks(language: LanguageCode) {
  const copy = navigationCopy[language];

  return [
    {
      title: copy.exploreCards.beaches.title,
      text: copy.exploreCards.beaches.text,
      href: beachPaths[language],
    },
    {
      title: copy.exploreCards.villages.title,
      text: copy.exploreCards.villages.text,
      href: villagePaths[language],
    },
    {
      title: copy.exploreCards.museums.title,
      text: copy.exploreCards.museums.text,
      href: museumPaths[language],
    },
  ];
}

function LanguageSwitcher({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname() || "/";
  const currentLanguage = getCurrentLanguage(pathname);
  const copy = navigationCopy[currentLanguage];

  const links = useMemo(
    () =>
      languageOptions.map((language) => ({
        ...language,
        href: getLanguageHref(pathname, language.code),
        isActive: language.code === currentLanguage,
      })),
    [currentLanguage, pathname],
  );

  return (
    <nav className="vh-language-switcher" aria-label={copy.ariaLanguage}>
      {links.map((language) => (
        <a
          href={language.href}
          key={language.code}
          lang={language.code}
          hrefLang={language.code}
          aria-current={language.isActive ? "page" : undefined}
          title={language.name}
          onClick={onNavigate}
          className={language.isActive ? "is-active" : ""}
        >
          {language.label}
        </a>
      ))}
    </nav>
  );
}

export function VoulamandisHeader() {
  const pathname = usePathname() || "/";
  const currentLanguage = getCurrentLanguage(pathname);
  const copy = navigationCopy[currentLanguage];
  const mainLinks = getMainLinks(currentLanguage);
  const exploreLinks = getExploreLinks(currentLanguage);
  const [isOpen, setIsOpen] = useState(false);

  function closeMenu() {
    setIsOpen(false);
  }

  return (
    <header className="vh-header">
      <div className="vh-header__inner">
        <a
          className="vh-header__brand"
          href={homePaths[currentLanguage]}
          onClick={closeMenu}
        >
          <span className="vh-header__logo-mark">VH</span>

          <span className="vh-header__brand-text">
            <strong>Voulamandis House</strong>
            <small>Kampos, Chios</small>
          </span>
        </a>

        <nav className="vh-header__nav" aria-label={copy.ariaMain}>
          {mainLinks.map((link) => (
            <a href={link.href} key={link.href}>
              {link.label}
            </a>
          ))}
        </nav>

        <div className="vh-header__actions">
          <LanguageSwitcher />

          <a className="vh-header__book" href={ratesPaths[currentLanguage]}>
            {copy.bookNow}
          </a>

          <button
            className={`vh-header__burger ${isOpen ? "is-open" : ""}`}
            type="button"
            aria-label={isOpen ? copy.closeMenu : copy.openMenu}
            aria-expanded={isOpen}
            onClick={() => setIsOpen((value) => !value)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      <div className={`vh-mobile-menu ${isOpen ? "is-open" : ""}`}>
        <button
          className="vh-mobile-menu__backdrop"
          type="button"
          aria-label={copy.closeMenu}
          onClick={closeMenu}
        />

        <div className="vh-mobile-menu__panel">
          <div className="vh-mobile-menu__head">
            <div>
              <span>{copy.menu}</span>
              <h2>{copy.exploreTitle}</h2>
            </div>

            <button type="button" onClick={closeMenu} aria-label={copy.closeMenu}>
              ×
            </button>
          </div>

          <div className="vh-mobile-menu__section">
            <span className="vh-mobile-menu__label">{copy.language}</span>
            <LanguageSwitcher onNavigate={closeMenu} />
          </div>

          <a
            className="vh-mobile-menu__primary"
            href={ratesPaths[currentLanguage]}
            onClick={closeMenu}
          >
            {copy.bookStay}
          </a>

          <div className="vh-mobile-menu__section">
            <span className="vh-mobile-menu__label">{copy.stay}</span>

            <div className="vh-mobile-menu__links">
              <a href={roomsCategoryPaths[currentLanguage]} onClick={closeMenu}>
                {copy.rooms}
              </a>

              <a href={ratesPaths[currentLanguage]} onClick={closeMenu}>
                {copy.ratesAvailability}
              </a>

              <a href={contactPaths[currentLanguage]} onClick={closeMenu}>
                {copy.contact}
              </a>
            </div>
          </div>

          <div className="vh-mobile-menu__section">
            <span className="vh-mobile-menu__label">{copy.exploreChios}</span>

            <div className="vh-mobile-menu__cards">
              {exploreLinks.map((link) => (
                <a href={link.href} key={link.href} onClick={closeMenu}>
                  <strong>{link.title}</strong>
                  <small>{link.text}</small>
                </a>
              ))}
            </div>
          </div>

          <div className="vh-mobile-menu__footer">
            <a
              href="https://wa.me/306944474226"
              target="_blank"
              rel="noopener"
            >
              WhatsApp
            </a>

            <a href={chiosIslandPaths[currentLanguage]} onClick={closeMenu}>
              {copy.chiosIslandGuide}
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}