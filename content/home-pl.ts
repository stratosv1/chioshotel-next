import type { HomePageData } from "@/content/home";
import { siteImageAssets } from "@/lib/site-assets";

// Polish homepage content, shaped exactly like the other languages so /pl/
// renders through the same HomePageTailwindV3 layout as /, /el/, /de/ …
// It is written "final": the homepage SEO-intent and intro-reason helpers only
// know the seven shared languages, so they are not applied to Polish.
//
// Links point to the Polish pages that exist (/pl/…); guides that have no
// Polish version yet point to the English pages.

const linkClass =
  "font-semibold text-amber-800 underline decoration-amber-300 underline-offset-4 transition-colors hover:text-amber-900";
const heroLinkClass =
  "font-semibold text-white underline decoration-amber-300 underline-offset-4 transition-colors hover:text-amber-100";

export const homePagePl: HomePageData = {
  seo: {
    title: "Noclegi Chios | Pokoje i apartamenty w Kambos",
    description:
      "Oficjalna strona Voulamandis House na Chios: osobista gościnność, spokojny ogród cytrusowy, pokoje i apartamenty rodzinne blisko miasta, lotniska i plaż.",
    canonicalPath: "/pl/",
    ogImage: siteImageAssets.homepageHero.src,
    ogImageAlt: "Voulamandis House w Kambos na Chios – autentyczne noclegi w cytrusowej posiadłości",
  },

  hero: {
    rating: "4.8 / 5",
    reviews: "182 opinie",
    kicker: "KAMBOS CHIOS • VOULAMANDIS HOUSE",
    title: "Noclegi na Chios: pokoje i apartamenty",
    tagline: "Zamieszkaj w historycznym Kambos na Chios",
    descriptionHtml: `Spokojny, osobisty pobyt w historycznym Kambos, blisko miasta Chios, lotniska i plaż. Poznaj nasze <a href="/pl/pokoje-na-chios/" class="${heroLinkClass}">pokoje i apartamenty na Chios</a> i wybierz kategorię, która pasuje do Twojej podróży.`,
    image: siteImageAssets.homepageHero.src,
    imageWidth: siteImageAssets.homepageHero.width,
    imageHeight: siteImageAssets.homepageHero.height,
    mobileImage: siteImageAssets.homepageHeroMobile.src,
    mobileImageWidth: siteImageAssets.homepageHeroMobile.width,
    mobileImageHeight: siteImageAssets.homepageHeroMobile.height,
    imageAlt: "Kamienny pokój gościnny w Voulamandis House w Kambos na Chios",
    primaryCta: {
      label: "Asystent AI",
      href: "/ai-assistant/",
      icon: "✨",
    },
    secondaryCta: {
      label: "Zarezerwuj",
      href: "/pl/rezerwacja/",
      icon: "🔥",
    },
    quizCard: {
      href: "/chios-holidays-quiz/",
      icon: "🧭",
      liveLabel: "Kod rabatowy NA ŻYWO",
      title: "Odkryj Chios",
      text: "Poznaj sekrety wyspy i zdobądź kod na swój pobyt.",
      cta: "Zacznij →",
    },
  },

  announceBar: {
    href: "#vh-lastminute-title",
    icon: "🔥",
    text: "Przyjeżdżasz na Chios w tym tygodniu?",
    strongText: "Zobacz aktualne oferty noclegów.",
  },

  intro: {
    left: {
      kicker: "Autentyczna gościnność w Kambos na Chios",
      icon: "🏡",
      title: "Autentyczna gościnność w Voulamandis House",
      bodyHtml: `Voulamandis House łączy spokój ogrodów cytrusowych z osobistą gościnnością dla par i rodzin. Dowiedz się, dlaczego <a href="/pl/kambos-chios/" class="${linkClass}">pobyt w Kambos na Chios</a> to wyjątkowy wybór. Jeśli porównujesz <a href="/pl/hotele-chios/" class="${linkClass}">hotele na Chios</a> z innymi rodzajami noclegów, zajrzyj do naszego przewodnika, zanim wybierzesz okolicę i obiekt.`,
      pills: [
        "🌴 Wakacje na Chios",
        "🍊 Kambos Chios",
        "🛏️ Wygodne pokoje",
        "💎 Dobra cena",
      ],
    },
    right: {
      kicker: "Co wyróżnia Voulamandis House",
      title: "6 powodów, dla których pobyt jest bardziej osobisty, spokojny i prawdziwie chiotański",
      cards: [
        {
          title: "🏡 Autentyczny pobyt na Chios",
          text: "Ciepła, rodzinna gościnność z lokalnym charakterem i osobistą troską.",
        },
        {
          title: "🌿 Spokojny dziedziniec",
          text: "Ogrodowa atmosfera na leniwe poranki i ciche wieczory.",
        },
        {
          title: "🥐 Domowe śniadanie",
          text: "Śniadanie z lokalnymi produktami i domowymi akcentami, dostępne na życzenie.",
        },
        {
          title: "📍 Dobra lokalizacja",
          text: "Blisko miasta, lotniska, portu i plaż, bez hałasu centrum.",
        },
        {
          title: "🍊 Lokalne wskazówki",
          text: "Osobiste podpowiedzi: plaże, wioski, jedzenie i autentyczne trasy po wyspie.",
        },
        {
          title: "🛎️ Zalety rezerwacji bezpośredniej",
          text: "Jasna komunikacja, elastyczna pomoc i lepsza cena przy rezerwacji bezpośredniej.",
        },
      ],
    },
  },

  location: {
    kicker: "Lokalizacja i rezerwacja bezpośrednia",
    icon: "🗺️",
    title: "Wszystko, czego potrzebujesz przed zaplanowaniem pobytu",
    subtitle: "Mapa, odległości, dane kontaktowe i zalety rezerwacji bezpośredniej.",
    map: {
      previewImage: "/images/site/kambos-map-preview.webp",
      iframeSrc: "https://www.google.com/maps/search/?api=1&query=Voulamandis%20House%20Kambos%20Chios",
      buttonLabel: "Pokaż mapę",
    },
    distances: [
      { label: "✈️ Lotnisko", value: "3 km" },
      { label: "⛴️ Port", value: "6 km" },
      { label: "🏖️ Plaża", value: "1,5 km" },
    ],
    infoCard: {
      kicker: "Informacje praktyczne",
      title: "Voulamandis House",
      addressLines: ["Dimarchou Kalvokoressi 117", "Kambos, Chios 82100"],
      phoneLabel: "Tel.:",
      phone: "+30 22710 31733",
      phoneHref: "tel:+302271031733",
      emailLabel: "E-mail:",
      email: "chioshotel@gmail.com",
      emailHref: "mailto:chioshotel@gmail.com",
      text: "Obiekt leży w miejscu, które łączy spokój, łatwy dojazd i krótkie odległości do najważniejszych punktów Chios.",
      cta: {
        label: "Dostępność",
        href: "/pl/rezerwacja/",
        icon: "📅",
      },
    },
    discount: {
      badge: "Oferta NA ŻYWO • Odbierz kod",
      title: "Zarezerwuj bezpośrednio u nas",
      text: "Odbierz kod rabatowy i zarezerwuj bezpośrednio, bez prowizji pośredników.",
      benefits: [
        "✔️ Najlepsza dostępna cena",
        "✔️ Bezpośredni kontakt z obiektem",
        "✔️ Dostęp do wolnych pokoi",
      ],
      formIntro: "🎁 Otrzymaj 10% zniżki przy rezerwacji bezpośredniej:",
      emailPlaceholder: "Twój e-mail",
      submitLabel: "ODBIERZ KOD",
      consent: "Zgadzam się na otrzymywanie ofert od Voulamandis House.",
      successText: "Twój kod rabatowy:",
      revealCodeLabel: "Pokaż mój kod rabatowy",
      defaultCode: "WELCOME10",
    },
    copy: {
      kicker: "Lokalizacja – Kambos Chios",
      title: "Wyjątkowa okolica na autentyczny pobyt na Chios",
      paragraphsHtml: [
        "<strong>Kambos na Chios</strong> to jedna z najbardziej charakterystycznych i historycznych okolic wyspy, znana z rezydencji, kamiennych bram, sadów i zapachu cytrusów.",
        "To idealne miejsce dla osób, które chcą połączyć wypoczynek z łatwym dojazdem do miasta Chios, lotniska i popularnych plaż.",
      ],
    },
  },

  roomsPreview: {
    kicker: "Pokoje i apartamenty Voulamandis House",
    icon: "🛏️",
    title: "Wybierz kategorię pokoju, która pasuje do Twojego pobytu na Chios",
    text: "Od ekonomicznych pokoi dwuosobowych po wygodne pokoje i apartamenty rodzinne – porównaj dostępne kategorie i wybierz najlepszą opcję dla siebie.",
    primaryCta: {
      label: "Asystent pokoi",
      href: "/ai-assistant/",
      icon: "✨",
    },
    secondaryCta: {
      label: "Wszystkie pokoje",
      href: "/pl/pokoje-na-chios/",
      icon: "🗂️",
    },
    sideCard: {
      kicker: "Wszystkie opcje w jednym miejscu",
      title: "Porównaj pokoje i apartamenty",
      text: "Zobacz razem kategorie, liczbę miejsc i najważniejsze cechy, zanim wybierzesz pokój lub apartament.",
    },
    rooms: [
      {
        id: "economy-double",
        title: "Ekonomiczny pokój dwuosobowy",
        href: "/pl/pokoje-na-chios/pokoj-dwuosobowy-economy/",
        imageClass: "vh-room-image--economy",
        liveBadge: "TERAZ",
        directBadge: "🎁 -10% zniżki",
        bedBadge: "🛏️ 1 łóżko podwójne",
        description: "Idealny dla dwóch osób, które chcą zadbanego pobytu w Kambos na Chios.",
        meta: ["👥 2 osoby", "Economy", "🍊 Kambos"],
        amenities: ["❄️ Klima", "📶 Wi-Fi", "☕ Kawa", "🧊 Lodówka"],
        cta: "Zobacz pokój",
      },
      {
        id: "ground-floor-double-triple",
        title: "Pokoje 2- i 3-osobowe na parterze",
        href: "/pl/pokoje-na-chios/pokoje-standardowe/",
        imageClass: "vh-room-image--ground",
        liveBadge: "TERAZ",
        directBadge: "🎁 -10% zniżki",
        bedBadge: "🛏️ 1 podwójne + 1 sofa rozkładana",
        description: "Wygodny wybór dla par lub małych rodzin, z łatwym dostępem.",
        meta: ["👤 ×2-3", "🌿 Parter", "Łatwy dostęp"],
        amenities: ["❄️ Klima", "📶 Wi-Fi", "☕ Kawa", "🧊 Lodówka"],
        cta: "Zobacz pokój",
      },
      {
        id: "upper-floor-double-triple",
        title: "Pokoje 2- i 3-osobowe na piętrze",
        href: "/pl/pokoje-na-chios/pokoje-standardowe/",
        imageClass: "vh-room-image--upper",
        liveBadge: "TERAZ",
        directBadge: "🎁 -10% zniżki",
        bedBadge: "🛏️ 1 podwójne + sofa lub 2 pojedyncze",
        description: "Dla gości, którzy szukają spokojniejszej atmosfery i klasycznej gościnności.",
        meta: ["👤 ×2-3", "🏛️ Piętro", "Cisza"],
        amenities: ["❄️ Klima", "📶 Wi-Fi", "☕ Kawa", "🧊 Lodówka"],
        cta: "Zobacz pokój",
      },
      {
        id: "family-apartment",
        title: "Apartament rodzinny",
        href: "/pl/apartamenty-na-chios/",
        imageClass: "vh-room-image--family",
        liveBadge: "TERAZ",
        directBadge: "🎁 -10% zniżki",
        bedBadge: "🛏️ 1 podwójne + 2 pojedyncze",
        description: "Idealny dla rodzin lub małych grup, które potrzebują więcej przestrzeni.",
        meta: ["👤 ×4", "Przestrzeń", "🏡 Apartament"],
        amenities: ["❄️ Klima", "📶 Wi-Fi", "☕ Kawa", "🧊 Lodówka"],
        cta: "Zobacz apartament",
      },
    ],
  },

  lastMinute: {
    kicker: "Oferty last minute",
    icon: "⚡",
    title: "Przyjeżdżasz na Chios w tym tygodniu?",
    subtitle:
      "Szybki podgląd pokoi wolnych tylko w ciągu najbliższych 7 dni. Wybierz liczbę gości, aby zobaczyć aktualne oferty bezpośrednie.",
    widget: {
      title: "Oferty noclegów na Chios na najbliższe 7 dni",
      subtitle:
        "Znajdź wolne pokoje lub apartamenty do rezerwacji bezpośredniej, bez prowizji. Wybierz liczbę gości i wyślij zapytanie przez WhatsApp lub Viber.",
      trustLine: "🎁 Rezerwacja bezpośrednia bez prowizji – najlepsza dostępna cena",
      timerLabel: "Ceny last minute odświeżą się za:",
      guestTitle: "1. Wybierz liczbę gości",
      guestText: "Po wybraniu liczby osób pojawią się dostępne oferty.",
      guestButtons: [
        { label: "👤 ×2", value: 2 },
        { label: "👤 ×3", value: 3 },
        { label: "👤 ×4", value: 4 },
      ],
      helper: "Najpierw wybierz liczbę gości, aby zobaczyć wolne pokoje na Chios.",
      loadingText: "🔥 Szukamy najlepszych dostępnych ofert…",
      resultsTitle: "2. Dostępne oferty",
      resultsText: "Użyj filtrów, aby szybko zawęzić wybór.",
      emptyText: "Najpierw wybierz 2, 3 lub 4 gości, aby wczytać dostępne oferty.",
    },
  },

  reviews: {
    kicker: "Opinie gości",
    icon: "💬",
    title: "Co mówią nasi goście",
    trustindexLoaderUrl: "https://cdn.trustindex.io/loader.js?eee5e55655b69937bc662de8425",
  },

  amenities: {
    kicker: "Udogodnienia",
    icon: "🛋️",
    title: "Wszystko, czego potrzebujesz do wygodnego pobytu",
    items: [
      { icon: "📶", label: "Wi-Fi / Internet" },
      { icon: "❄️", label: "Klimatyzacja" },
      { icon: "🔥", label: "Ogrzewanie" },
      { icon: "📺", label: "TV" },
      { icon: "🧊", label: "Lodówka" },
      { icon: "☕", label: "Kawa / herbata" },
      { icon: "🧼", label: "Codzienne sprzątanie" },
      { icon: "🌿", label: "Ogród i miejsca do siedzenia" },
      { icon: "🍖", label: "Miejsce na grilla" },
      { icon: "🚗", label: "Parking" },
      { icon: "🚕", label: "Transfery" },
      { icon: "🏡", label: "Autentyczna gościnność" },
    ],
  },

  traveler: {
    kicker: "Odkryj Chios",
    icon: "🧳",
    title: "Jakim typem podróżnika jesteś?",
    subtitle: "Wybierz doświadczenie, które Ci odpowiada, i odkryj Chios na swój sposób.",
    cards: [
      {
        id: "sea",
        title: "Morze",
        text: "Krystalicznie czysta woda, wyjątkowe plaże i relaks na wyspie.",
        href: "/chios-beach-lovers/",
        className: "vh-traveler-card--sea",
        cta: "🏖️ Odkryj",
      },
      {
        id: "exploration",
        title: "Zwiedzanie",
        text: "Wioski, przyroda i kultura w każdym zakątku Chios.",
        href: "/chios-explorer/",
        className: "vh-traveler-card--explorer",
        cta: "🧭 Odkryj",
      },
      {
        id: "family",
        title: "Rodzina",
        text: "Pomysły i atrakcje na niezapomniane rodzinne wakacje.",
        href: "/family-travel-in-chios/",
        className: "vh-traveler-card--family",
        cta: "👨‍👩‍👧‍👦 Odkryj",
      },
      {
        id: "food",
        title: "Kuchnia",
        text: "Autentyczne smaki, mastyks i lokalne doświadczenia.",
        href: "/taste-lover-chios/",
        className: "vh-traveler-card--food",
        cta: "🍽️ Odkryj",
      },
    ],
  },

  chiosGuide: {
    kicker: "Więcej o Chios",
    icon: "🧭",
    title: "Co zobaczyć na Chios?",
    subtitle:
      "Zebraliśmy przydatne informacje o Chios, aby łatwiej zaplanować pobyt i jednodniowe wycieczki.",
    cards: [
      {
        id: "beaches",
        title: "Plaże Chios",
        text: "Zobacz propozycje i łatwiej zaplanuj letnie wypady.",
        href: "/chios/chios-beaches/",
        imageClass: "vh-link-image--beaches",
        ctaIcon: "🏖️",
        ctaLabel: "Zobacz więcej",
      },
      {
        id: "villages",
        title: "Wioski Chios",
        text: "Odkryj tradycyjne miejscowości i miejsca warte odwiedzenia.",
        href: "/chios/chios-villages/",
        imageClass: "vh-link-image--villages",
        ctaIcon: "🏘️",
        ctaLabel: "Zobacz więcej",
      },
      {
        id: "kampos",
        title: "Kambos na Chios",
        text: "Dowiedz się więcej o okolicy, która sprawia, że pobyt w Kambos jest wyjątkowy.",
        href: "/pl/kambos-chios/",
        imageClass: "vh-link-image--kampos",
        ctaIcon: "🍊",
        ctaLabel: "Zobacz więcej",
      },
      {
        id: "museums",
        title: "Muzea Chios",
        text: "Kulturalne przystanki dla miłośników historii i lokalnej tożsamości.",
        href: "/chios/chios-museums/",
        imageClass: "vh-link-image--museums",
        ctaIcon: "🏺",
        ctaLabel: "Zobacz więcej",
      },
      {
        id: "orchids",
        title: "Storczyki Chios",
        text: "Wyjątkowa atrakcja dla miłośników przyrody, którzy chcą zobaczyć inną stronę wyspy.",
        href: "/chios-orchids/",
        imageClass: "vh-link-image--orchids",
        ctaIcon: "🌸",
        ctaLabel: "Zobacz więcej",
      },
      {
        id: "thermal-springs",
        title: "Źródła termalne",
        text: "Relaks i odnowa, które idealnie uzupełnią Twoje wakacje.",
        href: "/chios-thermal-baths/",
        imageClass: "vh-link-image--springs",
        ctaIcon: "♨️",
        ctaLabel: "Zobacz więcej",
      },
    ],
  },

  quizBar: {
    label: "ODKRYJ CHIOS",
    text: "Poświęć 5 minut na quiz, aby poznać Chios i jego ukryte sekrety.",
    href: "/chios-holidays-quiz/",
    cta: "🧭 ZACZNIJ →",
  },

  faq: {
    kicker: "Najczęstsze pytania",
    icon: "❓",
    title: "Co warto wiedzieć przed rezerwacją pobytu",
    items: [
      {
        question: "Czy Voulamandis House jest hotelem?",
        answerHtml:
          "Nie. Voulamandis House to obiekt z pokojami i apartamentami w Kambos na Chios. Jeśli szukasz hotelu na Chios, ale wolisz spokojniejszą i bardziej osobistą gościnność, to autentyczna alternatywa.",
      },
      {
        question: "Gdzie dokładnie znajduje się Voulamandis House?",
        answerHtml:
          "Obiekt leży w historycznym <strong>Kambos na Chios</strong>, około 7 minut samochodem od lotniska i około 14 minut od portu i centrum miasta.",
      },
      {
        question: "Czy podczas pobytu dostępne jest śniadanie?",
        answerHtml:
          "Tak, domowe śniadanie podajemy pod pergolą w ogrodzie, z produktami z naszego gospodarstwa. Jest opcjonalne i dostępne na życzenie.",
      },
      {
        question: "Które pokoje są odpowiednie dla rodzin?",
        answerHtml:
          "Rodzinom do 4 osób polecamy <strong>apartamenty rodzinne</strong>. Większym grupom może odpowiadać połączenie dwóch pokoi, w zależności od dostępności.",
      },
      {
        question: "Czy jest parking?",
        answerHtml:
          "Tak, parking jest dostępny na terenie obiektu, a łatwo zaparkować także na spokojnej ulicy tuż obok.",
      },
      {
        question: "Jak zarezerwować bezpośrednio?",
        answerHtml:
          'Możesz zarezerwować bezpośrednio na <a href="/pl/rezerwacja/" class="font-semibold text-amber-800 underline decoration-amber-300 underline-offset-4">naszej stronie rezerwacji</a> lub skontaktować się z nami, aby wybrać pokój najlepiej dopasowany do pobytu.',
      },
    ],
  },

  finalCta: {
    kicker: "Zarezerwuj pobyt",
    icon: "✈️",
    title: "Twoja podróż na Chios zaczyna się tutaj",
    text: "Ciepła gościnność, autentyczna atmosfera i idealna lokalizacja w Kambos.",
    primaryCta: {
      label: "Rezerwuj bezpośrednio",
      href: "/pl/rezerwacja/",
      icon: "🛎️",
    },
    secondaryCta: {
      label: "Kontakt",
      href: "/voulamandis-house-contact-us-form-fill-in-the-form/",
      icon: "✉️",
    },
  },

  mobileSticky: {
    call: {
      label: "📞 ZADZWOŃ",
      href: "tel:+306944764654",
    },
    viber: {
      label: "💬 WhatsApp",
      href: "https://wa.me/306944474226",
    },
  },
};
