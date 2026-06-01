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

const dealsPaths: Record<LanguageCode, string> = {
  en: "/best-chios-travel-deals-for-chios-hotels/",
  el: "/el/crazy-travel-deals-for-chios-hotels/",
  fr: "/fr/offres-de-voyage-pour-les-hotels-a-chios/",
  de: "/de/beste-reiseangebote-fur-chios-hotels-auf-chios/",
  it: "/it/offerte-di-viaggio-hotels-chios/",
  es: "/es/mejores-ofertas-de-viaje-a-quios-para-hoteles-en-quios/",
  tr: "/tr/sakiz-adasi-otel-firsatlari/",
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

const quizPaths: Record<LanguageCode, string> = {
  en: "/chios-holidays-quiz/",
  el: "/el/diakopes-sti-chio-quiz/",
  fr: "/fr/quiz-vacances-a-chios/",
  de: "/de/chios-urlaubsquiz/",
  it: "/it/quiz-vacanze-a-chios/",
  es: "/es/quiz-vacaciones-en-quios/",
  tr: "/tr/sakiz-adasi-tatil-testi/",
};

const beachLoversPaths: Record<LanguageCode, string> = {
  en: "/chios-beach-lovers/",
  el: "/el/xios-gia-latreis-paralias/",
  fr: "/fr/chios-pour-amoureux-de-plage/",
  de: "/de/chios-fuer-strandliebhaber/",
  it: "/it/chios-per-amanti-del-mare/",
  es: "/es/quios-para-amantes-de-la-playa/",
  tr: "/tr/plaj-severler-icin-sakiz-adasi/",
};

const familyTravelPaths: Record<LanguageCode, string> = {
  en: "/family-travel-in-chios/",
  el: "/el/oikogeneiakes-diakopes-sti-xio/",
  fr: "/fr/vacances-en-famille-a-chios/",
  de: "/de/familienurlaub-auf-chios/",
  it: "/it/vacanze-in-famiglia-a-chios/",
  es: "/es/vacaciones-en-familia-en-quios/",
  tr: "/tr/sakiz-adasi-aile-tatili/",
};

const tasteLoverPaths: Record<LanguageCode, string> = {
  en: "/taste-lover-chios/",
  el: "/el/geuseis-tis-xiou/",
  fr: "/fr/saveurs-de-chios/",
  de: "/de/chios-fuer-geniesser/",
  it: "/it/sapori-di-chios/",
  es: "/es/sabores-de-quios/",
  tr: "/tr/sakiz-adasi-lezzetleri/",
};

const chiosExplorerPaths: Record<LanguageCode, string> = {
  en: "/chios-explorer/",
  el: "/el/exerevnisi-xiou/",
  fr: "/fr/explorer-chios/",
  de: "/de/chios-entdecken/",
  it: "/it/esplora-chios/",
  es: "/es/explorar-quios/",
  tr: "/tr/sakiz-adasi-kesif/",
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

const beachDetailPathGroups: Record<LanguageCode, string>[] = [
  {
    en: "/chios/chios-beaches/agia-dynami-beach-chios/",
    el: "/el/paralies-xios/paralia-agia-dynami/",
    fr: "/fr/plages-de-chios/plage-agia-dynami/",
    de: "/de/straende-chios/agia-dynami-strand/",
    it: "/it/spiagge-chios/spiaggia-agia-dynami/",
    es: "/es/playas-chios/playa-agia-dynami/",
    tr: "/tr/sakiz-adasi-plajlari/agia-dynami-plaji/",
  },
  {
    en: "/chios/chios-beaches/lithi-beach/",
    el: "/el/paralies-xios/paralia-lithi/",
    fr: "/fr/plages-de-chios/plage-lithi/",
    de: "/de/straende-chios/lithi-strand/",
    it: "/it/spiagge-chios/spiaggia-lithi/",
    es: "/es/playas-chios/playa-lithi/",
    tr: "/tr/sakiz-adasi-plajlari/lithi-plaji/",
  },
  {
    en: "/chios/chios-beaches/lefkathia-beach/",
    el: "/el/paralies-xios/paralia-lefkathia/",
    fr: "/fr/plages-de-chios/plage-lefkathia/",
    de: "/de/straende-chios/lefkathia-strand/",
    it: "/it/spiagge-chios/spiaggia-lefkathia/",
    es: "/es/playas-chios/playa-lefkathia/",
    tr: "/tr/sakiz-adasi-plajlari/lefkathia-plaji/",
  },
  {
    en: "/chios/chios-beaches/nagos-beach/",
    el: "/el/paralies-xios/paralia-nagos/",
    fr: "/fr/plages-de-chios/plage-nagos/",
    de: "/de/straende-chios/nagos-strand/",
    it: "/it/spiagge-chios/spiaggia-nagos/",
    es: "/es/playas-chios/playa-nagos/",
    tr: "/tr/sakiz-adasi-plajlari/nagos-plaji/",
  },
  {
    en: "/chios/chios-beaches/avlonia-beach2/",
    el: "/el/paralies-xios/paralia-avlonia/",
    fr: "/fr/plages-de-chios/plage-avlonia/",
    de: "/de/straende-chios/avlonia-strand/",
    it: "/it/spiagge-chios/spiaggia-avlonia/",
    es: "/es/playas-chios/playa-avlonia/",
    tr: "/tr/sakiz-adasi-plajlari/avlonia-plaji/",
  },
  {
    en: "/chios/chios-beaches/salagona-beach/",
    el: "/el/paralies-xios/paralia-salagona/",
    fr: "/fr/plages-de-chios/plage-salagona/",
    de: "/de/straende-chios/salagona-strand/",
    it: "/it/spiagge-chios/spiaggia-salagona/",
    es: "/es/playas-chios/playa-salagona/",
    tr: "/tr/sakiz-adasi-plajlari/salagona-plaji/",
  },
  {
    en: "/chios/chios-beaches/agia-fotia-beach/",
    el: "/el/paralies-xios/paralia-agia-fotia/",
    fr: "/fr/plages-de-chios/plage-agia-fotia/",
    de: "/de/straende-chios/agia-fotia-strand/",
    it: "/it/spiagge-chios/spiaggia-agia-fotia/",
    es: "/es/playas-chios/playa-agia-fotia/",
    tr: "/tr/sakiz-adasi-plajlari/agia-fotia-plaji/",
  },
  {
    en: "/chios/chios-beaches/komi-beach/",
    el: "/el/paralies-xios/paralia-komi/",
    fr: "/fr/plages-de-chios/plage-komi/",
    de: "/de/straende-chios/komi-strand/",
    it: "/it/spiagge-chios/spiaggia-komi/",
    es: "/es/playas-chios/playa-komi/",
    tr: "/tr/sakiz-adasi-plajlari/komi-plaji/",
  },
  {
    en: "/chios/chios-beaches/emporios-beach/",
    el: "/el/paralies-xios/paralia-mavra-volia/",
    fr: "/fr/plages-de-chios/plage-mavra-volia/",
    de: "/de/straende-chios/mavra-volia-strand/",
    it: "/it/spiagge-chios/spiaggia-mavra-volia/",
    es: "/es/playas-chios/playa-mavra-volia/",
    tr: "/tr/sakiz-adasi-plajlari/mavra-volia-plaji/",
  },
];

const villagePaths: Record<LanguageCode, string> = {
  en: "/chios/chios-villages/",
  el: "/el/xoria-xios/",
  fr: "/fr/villages-de-chios/",
  de: "/de/doerfer-chios/",
  it: "/it/villaggi-chios/",
  es: "/es/pueblos-chios/",
  tr: "/tr/sakiz-adasi-koyleri/",
};

const villageDetailPathGroups: Record<LanguageCode, string>[] = [
  {
    en: "/chios/chios-villages/chios-pyrgi/",
    el: "/el/xoria-xios/pyrgi-xios/",
    fr: "/fr/villages-de-chios/village-pyrgi/",
    de: "/de/doerfer-chios/pyrgi-dorf/",
    it: "/it/villaggi-chios/villaggio-pyrgi/",
    es: "/es/pueblos-chios/pueblo-pyrgi/",
    tr: "/tr/sakiz-adasi-koyleri/pyrgi-koyu/",
  },
  {
    en: "/chios/chios-villages/mesta-chios/",
    el: "/el/xoria-xios/mesta-xios/",
    fr: "/fr/villages-de-chios/village-mesta/",
    de: "/de/doerfer-chios/mesta-dorf/",
    it: "/it/villaggi-chios/villaggio-mesta/",
    es: "/es/pueblos-chios/pueblo-mesta/",
    tr: "/tr/sakiz-adasi-koyleri/mesta-koyu/",
  },
  {
    en: "/chios/chios-villages/vessa-chios/",
    el: "/el/xoria-xios/vessa-xios/",
    fr: "/fr/villages-de-chios/village-vessa/",
    de: "/de/doerfer-chios/vessa-dorf/",
    it: "/it/villaggi-chios/villaggio-vessa/",
    es: "/es/pueblos-chios/pueblo-vessa/",
    tr: "/tr/sakiz-adasi-koyleri/vessa-koyu/",
  },
  {
    en: "/chios/chios-villages/olympoi-chios/",
    el: "/el/xoria-xios/olympoi-xios/",
    fr: "/fr/villages-de-chios/village-olympoi/",
    de: "/de/doerfer-chios/olympoi-dorf/",
    it: "/it/villaggi-chios/villaggio-olympoi/",
    es: "/es/pueblos-chios/pueblo-olympoi/",
    tr: "/tr/sakiz-adasi-koyleri/olympoi-koyu/",
  },
  {
    en: "/chios/chios-villages/volissos-chios/",
    el: "/el/xoria-xios/volissos-xios/",
    fr: "/fr/villages-de-chios/village-volissos/",
    de: "/de/doerfer-chios/volissos-dorf/",
    it: "/it/villaggi-chios/villaggio-volissos/",
    es: "/es/pueblos-chios/pueblo-volissos/",
    tr: "/tr/sakiz-adasi-koyleri/volissos-koyu/",
  },
  {
    en: "/chios/chios-villages/armolia-chios/",
    el: "/el/xoria-xios/armolia-xios/",
    fr: "/fr/villages-de-chios/village-armolia/",
    de: "/de/doerfer-chios/armolia-dorf/",
    it: "/it/villaggi-chios/villaggio-armolia/",
    es: "/es/pueblos-chios/pueblo-armolia/",
    tr: "/tr/sakiz-adasi-koyleri/armolia-koyu/",
  },
  {
    en: "/chios/chios-villages/lagada-chios/",
    el: "/el/xoria-xios/lagada-xios/",
    fr: "/fr/villages-de-chios/village-lagada/",
    de: "/de/doerfer-chios/lagada-dorf/",
    it: "/it/villaggi-chios/villaggio-lagada/",
    es: "/es/pueblos-chios/pueblo-lagada/",
    tr: "/tr/sakiz-adasi-koyleri/lagada-koyu/",
  },
];

const museumPaths: Record<LanguageCode, string> = {
  en: "/chios/chios-museums/",
  el: "/el/mouseia-xios/",
  fr: "/fr/musees-de-chios/",
  de: "/de/museen-chios/",
  it: "/it/musei-chios/",
  es: "/es/museos-chios/",
  tr: "/tr/sakiz-adasi-muzeleri/",
};

const museumDetailPathGroups: Record<LanguageCode, string>[] = [
  {
    en: "/chios/chios-museums/the-mastic-museum-chios/",
    el: "/el/mouseia-xios/mouseio-mastichas-xios/",
    fr: "/fr/musees-de-chios/musee-du-mastic-chios/",
    de: "/de/museen-chios/mastix-museum-chios/",
    it: "/it/musei-chios/museo-del-mastice-chios/",
    es: "/es/museos-chios/museo-mastiha-chios/",
    tr: "/tr/sakiz-adasi-muzeleri/sakiz-mastik-muzesi/",
  },
  {
    en: "/chios/chios-museums/archaeological-museum-chios/",
    el: "/el/mouseia-xios/arxaiologiko-mouseio-xios/",
    fr: "/fr/musees-de-chios/musee-archeologique-chios/",
    de: "/de/museen-chios/archaeologisches-museum-chios/",
    it: "/it/musei-chios/museo-archeologico-chios/",
    es: "/es/museos-chios/museo-arqueologico-chios/",
    tr: "/tr/sakiz-adasi-muzeleri/arkeoloji-muzesi-sakiz/",
  },
  {
    en: "/chios/chios-museums/chios-byzantine-museum/",
    el: "/el/mouseia-xios/vyzantino-mouseio-xios/",
    fr: "/fr/musees-de-chios/musee-byzantin-chios/",
    de: "/de/museen-chios/byzantinisches-museum-chios/",
    it: "/it/musei-chios/museo-bizantino-chios/",
    es: "/es/museos-chios/museo-bizantino-chios/",
    tr: "/tr/sakiz-adasi-muzeleri/bizans-muzesi-sakiz/",
  },
  {
    en: "/chios/chios-museums/koraes-library-chios/",
    el: "/el/mouseia-xios/vivliothiki-korai-xios/",
    fr: "/fr/musees-de-chios/bibliotheque-korais-chios/",
    de: "/de/museen-chios/korais-bibliothek-chios/",
    it: "/it/musei-chios/biblioteca-korais-chios/",
    es: "/es/museos-chios/biblioteca-korais-chios/",
    tr: "/tr/sakiz-adasi-muzeleri/korais-kutuphanesi-sakiz/",
  },
  {
    en: "/chios/chios-museums/chios-maritime-museum/",
    el: "/el/mouseia-xios/naftiko-mouseio-xios/",
    fr: "/fr/musees-de-chios/musee-maritime-chios/",
    de: "/de/museen-chios/schifffahrtsmuseum-chios/",
    it: "/it/musei-chios/museo-marittimo-chios/",
    es: "/es/museos-chios/museo-maritimo-chios/",
    tr: "/tr/sakiz-adasi-muzeleri/denizcilik-muzesi-sakiz/",
  },
  {
    en: "/chios/chios-museums/kallimasia-folklore-museum/",
    el: "/el/mouseia-xios/laografiko-mouseio-kallimasias/",
    fr: "/fr/musees-de-chios/musee-folklorique-kallimasia/",
    de: "/de/museen-chios/volkskundemuseum-kallimasia/",
    it: "/it/musei-chios/museo-folkloristico-kallimasia/",
    es: "/es/museos-chios/museo-folclorico-kallimasia/",
    tr: "/tr/sakiz-adasi-muzeleri/kallimasia-folklor-muzesi/",
  },
];

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
    deals: string;
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
    deals: "Deals",
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
    deals: "Προσφορές",
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
    deals: "Offres",
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
    deals: "Angebote",
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
    deals: "Offerte",
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
    deals: "Ofertas",
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
    deals: "Fırsatlar",
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

  const matchingBeachDetailGroup = beachDetailPathGroups.find((group) =>
    Object.values(group).includes(normalizedPath),
  );

  if (matchingBeachDetailGroup) {
    return matchingBeachDetailGroup[language];
  }

  const matchingVillageDetailGroup = villageDetailPathGroups.find((group) =>
    Object.values(group).includes(normalizedPath),
  );

  if (matchingVillageDetailGroup) {
    return matchingVillageDetailGroup[language];
  }

  const matchingMuseumDetailGroup = museumDetailPathGroups.find((group) =>
    Object.values(group).includes(normalizedPath),
  );

  if (matchingMuseumDetailGroup) {
    return matchingMuseumDetailGroup[language];
  }

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

  const isDealsPage = Object.values(dealsPaths).includes(normalizedPath);

  const isContactPage = Object.values(contactPaths).includes(normalizedPath);

  const isQuizPage = Object.values(quizPaths).includes(normalizedPath);

  const isBeachLoversPage =
    Object.values(beachLoversPaths).includes(normalizedPath);

  const isFamilyTravelPage =
    Object.values(familyTravelPaths).includes(normalizedPath);

  const isTasteLoverPage =
    Object.values(tasteLoverPaths).includes(normalizedPath);

  const isChiosExplorerPage =
    Object.values(chiosExplorerPaths).includes(normalizedPath);

  const isChiosIslandPage =
    Object.values(chiosIslandPaths).includes(normalizedPath);

  const isBeachCategoryPage =
    Object.values(beachPaths).includes(normalizedPath);

  const isVillageCategoryPage =
    Object.values(villagePaths).includes(normalizedPath);

  const isMuseumCategoryPage =
    Object.values(museumPaths).includes(normalizedPath);

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

  if (isDealsPage) {
    return dealsPaths[language];
  }

  if (isContactPage) {
    return contactPaths[language];
  }

  if (isQuizPage) {
    return quizPaths[language];
  }

  if (isBeachLoversPage) {
    return beachLoversPaths[language];
  }

  if (isFamilyTravelPage) {
    return familyTravelPaths[language];
  }

  if (isTasteLoverPage) {
    return tasteLoverPaths[language];
  }

  if (isChiosExplorerPage) {
    return chiosExplorerPaths[language];
  }

  if (isChiosIslandPage) {
    return chiosIslandPaths[language];
  }

  if (isBeachCategoryPage) {
    return beachPaths[language];
  }

  if (isVillageCategoryPage) {
    return villagePaths[language];
  }

  if (isMuseumCategoryPage) {
    return museumPaths[language];
  }

  if (
    normalizedPath === "/chios-rooms/" ||
    normalizedPath.startsWith("/chios-rooms/")
  ) {
    return roomsCategoryPaths[language];
  }

  if (
    normalizedPath === "/best-chios-travel-deals-for-chios-hotels/" ||
    normalizedPath === "/el/crazy-travel-deals-for-chios-hotels/" ||
    normalizedPath === "/fr/offres-de-voyage-pour-les-hotels-a-chios/" ||
    normalizedPath === "/de/beste-reiseangebote-fur-chios-hotels-auf-chios/" ||
    normalizedPath === "/it/offerte-di-viaggio-hotels-chios/" ||
    normalizedPath === "/es/mejores-ofertas-de-viaje-a-quios-para-hoteles-en-quios/" ||
    normalizedPath === "/tr/sakiz-adasi-otel-firsatlari/"
  ) {
    return dealsPaths[language];
  }

  if (
    normalizedPath === "/chios/chios-beaches/" ||
    normalizedPath.startsWith("/chios/chios-beaches/") ||
    normalizedPath === "/el/paralies-xios/" ||
    normalizedPath.startsWith("/el/paralies-xios/") ||
    normalizedPath === "/fr/plages-de-chios/" ||
    normalizedPath.startsWith("/fr/plages-de-chios/") ||
    normalizedPath === "/de/straende-chios/" ||
    normalizedPath.startsWith("/de/straende-chios/") ||
    normalizedPath === "/it/spiagge-chios/" ||
    normalizedPath.startsWith("/it/spiagge-chios/") ||
    normalizedPath === "/es/playas-chios/" ||
    normalizedPath.startsWith("/es/playas-chios/") ||
    normalizedPath === "/tr/sakiz-adasi-plajlari/" ||
    normalizedPath.startsWith("/tr/sakiz-adasi-plajlari/")
  ) {
    return beachPaths[language];
  }

  if (
    normalizedPath === "/chios/chios-villages/" ||
    normalizedPath.startsWith("/chios/chios-villages/") ||
    normalizedPath === "/el/xoria-xios/" ||
    normalizedPath.startsWith("/el/xoria-xios/") ||
    normalizedPath === "/fr/villages-de-chios/" ||
    normalizedPath.startsWith("/fr/villages-de-chios/") ||
    normalizedPath === "/de/doerfer-chios/" ||
    normalizedPath.startsWith("/de/doerfer-chios/") ||
    normalizedPath === "/it/villaggi-chios/" ||
    normalizedPath.startsWith("/it/villaggi-chios/") ||
    normalizedPath === "/es/pueblos-chios/" ||
    normalizedPath.startsWith("/es/pueblos-chios/") ||
    normalizedPath === "/tr/sakiz-adasi-koyleri/" ||
    normalizedPath.startsWith("/tr/sakiz-adasi-koyleri/")
  ) {
    return villagePaths[language];
  }

  if (
    normalizedPath === "/chios/chios-museums/" ||
    normalizedPath.startsWith("/chios/chios-museums/") ||
    normalizedPath === "/el/mouseia-xios/" ||
    normalizedPath.startsWith("/el/mouseia-xios/") ||
    normalizedPath === "/fr/musees-de-chios/" ||
    normalizedPath.startsWith("/fr/musees-de-chios/") ||
    normalizedPath === "/de/museen-chios/" ||
    normalizedPath.startsWith("/de/museen-chios/") ||
    normalizedPath === "/it/musei-chios/" ||
    normalizedPath.startsWith("/it/musei-chios/") ||
    normalizedPath === "/es/museos-chios/" ||
    normalizedPath.startsWith("/es/museos-chios/") ||
    normalizedPath === "/tr/sakiz-adasi-muzeleri/" ||
    normalizedPath.startsWith("/tr/sakiz-adasi-muzeleri/")
  ) {
    return museumPaths[language];
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
      label: copy.deals,
      href: dealsPaths[language],
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

              <a href={dealsPaths[currentLanguage]} onClick={closeMenu}>
                {copy.deals}
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