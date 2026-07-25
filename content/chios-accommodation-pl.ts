import {
  chiosAccommodationPageEn,
  type ChiosAccommodationPageData,
} from "@/content/chios-accommodation";

export const chiosAccommodationPagePl: ChiosAccommodationPageData = {
  ...chiosAccommodationPageEn,
  seo: {
    canonicalPath: "/pl/noclegi-chios/",
    title: "Noclegi Chios | Pokoje i apartamenty w Kambos",
    description:
      "Noclegi na Chios w Voulamandis House w Kambos: spokojne pokoje i apartamenty rodzinne blisko miasta Chios, lotniska i plaż. Sprawdź dostępność bezpośrednio.",
    ogImage: chiosAccommodationPageEn.seo.ogImage,
    ogImageAlt:
      "Pokoje i apartamenty Voulamandis House w ogrodach cytrusowych Kambos na Chios",
  },
  hero: {
    ...chiosAccommodationPageEn.hero,
    kicker: "RODZINNY OBIEKT • KAMBOS CHIOS",
    title: "Noclegi na Chios w spokojnym i historycznym Kambos",
    description:
      "Voulamandis House oferuje spokojne pokoje oraz apartamenty rodzinne w historycznej dzielnicy Kambos. To wygodna baza blisko miasta Chios, lotniska i portu, z ogrodem, osobistą gościnnością i wyborem zakwaterowania dla par oraz rodzin.",
    imageAlt:
      "Voulamandis House – noclegi, pokoje i apartamenty w Kambos na Chios",
    primaryCta: { label: "Zobacz pokoje i apartamenty", href: "/pl/pokoje-na-chios/" },
    secondaryCta: { label: "Sprawdź dostępność", href: "/pl/rezerwacja/" },
    aiCta: { label: "Znajdź odpowiedni pokój", href: "/pl/pokoje-na-chios/#room-wizard-app" },
  },
  highlights: [
    { label: "Lokalizacja", value: "Historyczny Kambos" },
    { label: "Lotnisko", value: "3 km" },
    { label: "Port Chios", value: "6 km" },
    { label: "Opcje", value: "Pokoje i apartamenty" },
    { label: "Dla", value: "Par i rodzin" },
    { label: "Atmosfera", value: "Ogród i cytrusy" },
  ],
  intro: {
    kicker: "KAMERALNE MIEJSCE NA POBYT",
    title: "Spokojniejsza i bardziej osobista alternatywa dla noclegu na Chios",
    paragraphs: [
      "Wybór noclegu na Chios wpływa na cały rytm wakacji. Voulamandis House znajduje się w Kambos, historycznej dzielnicy znanej z ogrodów cytrusowych, kamiennych murów i dawnych rezydencji. Można tu odpocząć z dala od najbardziej ruchliwych ulic, pozostając jednocześnie blisko miasta, lotniska i głównych dróg wyspy.",
      "Voulamandis House jest rodzinnym obiektem z pokojami i apartamentami, a nie dużym hotelem czy resortem. Dostępne są ekonomiczne pokoje dwuosobowe, pokoje na parterze, pokoje na piętrze oraz apartamenty rodzinne. Dzięki temu wybór można dopasować do budżetu, liczby gości, preferowanego piętra i potrzeby korzystania z kuchni.",
      "Goście mają bezpośredni kontakt z osobami, które znają układ każdego pokoju i samą wyspę. Przed rezerwacją można zapytać o piętro, łóżka, pojemność, śniadanie oraz najlepszą opcję dla konkretnych dat.",
    ],
    factsTitle: "Voulamandis House w skrócie",
    facts: [
      "Rodzinne pokoje i apartamenty w Kambos na Chios",
      "Pokoje Economy, na parterze i na piętrze",
      "Apartamenty rodzinne z pełną kuchnią i częścią dzienną",
      "Wi‑Fi, klimatyzacja, prywatna łazienka, TV i lodówka",
      "Ogród, tarasy i parking dla gości",
      "Śniadanie w ogrodzie dostępne na życzenie",
      "Bezpośredni kontakt przez WhatsApp, telefon lub email",
    ],
  },
  rooms: {
    kicker: "POKOJE I APARTAMENTY",
    title: "Wybierz nocleg na Chios dopasowany do Twojej podróży",
    description:
      "Porównaj powierzchnię, piętro, dostęp bez schodów i wyposażenie. Szczegółowe strony pokazują konkretne pokoje, galerie zdjęć i układy łóżek.",
    cards: [
      {
        ...chiosAccommodationPageEn.rooms.cards[0],
        eyebrow: "KORZYSTNA OPCJA DLA DWÓCH OSÓB",
        title: "Ekonomiczne pokoje dwuosobowe",
        description:
          "Praktyczny wybór dla dwóch gości, którzy chcą zadbanego pokoju w Kambos w najniższej kategorii cenowej. Około 16 m², klimatyzacja, Wi‑Fi, prywatna łazienka, TV i lodówka.",
        href: "/pl/pokoje-na-chios/pokoj-dwuosobowy-economy/",
        imageAlt: "Ekonomiczny pokój dwuosobowy na Chios w Voulamandis House",
        facts: ["2 osoby", "około 16 m²", "prywatna łazienka", "Economy"],
      },
      {
        ...chiosAccommodationPageEn.rooms.cards[1],
        eyebrow: "ŁATWY DOSTĘP I OGRÓD",
        title: "Pokoje dwu- i trzyosobowe na parterze",
        description:
          "Dla par, przyjaciół i małych rodzin, które chcą uniknąć schodów i mieć łatwy dostęp do dziedzińca oraz ogrodu.",
        href: "/pl/pokoje-na-chios/pokoje-standardowe/",
        imageAlt: "Pokój na parterze z dostępem do ogrodu w Kambos na Chios",
        facts: ["2–3 osoby", "bez schodów", "dostęp do ogrodu", "lodówka i A/C"],
      },
      {
        ...chiosAccommodationPageEn.rooms.cards[2],
        eyebrow: "ŚWIATŁO, TARAS I WIDOK",
        title: "Pokoje dwu- i trzyosobowe na piętrze",
        description:
          "Jasne pokoje na piętrze z dostępem do wspólnego tarasu i widokiem na otoczenie Kambos. Wybrane pokoje mają aneks kuchenny.",
        href: "/pl/pokoje-na-chios/pokoje-standardowe/",
        imageAlt: "Pokój na piętrze z widokiem na Kambos na Chios",
        facts: ["2–4 osoby", "piętro", "wspólny taras", "wybrane aneksy kuchenne"],
      },
      {
        ...chiosAccommodationPageEn.rooms.cards[3],
        eyebrow: "WIĘCEJ MIEJSCA DLA RODZINY",
        title: "Apartamenty rodzinne na Chios",
        description:
          "Apartamenty 40–45 m² z oddzielną sypialnią, częścią dzienną i pełną kuchnią dla rodzin i małych grup potrzebujących większej niezależności.",
        href: "/pl/pokoje-na-chios/apartamenty-rodzinne/",
        imageAlt: "Apartament rodzinny z kuchnią w Voulamandis House na Chios",
        facts: ["do 4 osób", "40–45 m²", "pełna kuchnia", "część dzienna"],
      },
    ],
  },
  location: {
    ...chiosAccommodationPageEn.location,
    kicker: "DLACZEGO KAMBOS",
    title: "Spokojny nocleg blisko miasta Chios i lotniska",
    paragraphs: [
      "Kambos to jedna z najbardziej charakterystycznych części Chios. Za wysokimi kamiennymi murami znajdują się ogrody cytrusowe, dziedzińce i historyczne rezydencje. Nocleg tutaj daje zupełnie inny rytm niż pobyt przy ruchliwej ulicy w centrum.",
      "Voulamandis House znajduje się około 3 km od lotniska i 6 km od portu. Miasto Chios jest łatwo dostępne, a drogi z Kambos prowadzą naturalnie w stronę południowych plaż i średniowiecznych wiosek mastiksowych.",
      "To dobra baza dla osób, które chcą codziennie odkrywać inną część wyspy, a wieczorem wracać do spokojniejszego i bardziej zielonego otoczenia.",
    ],
    imageAlt: "Historyczny ogród i rezydencja w Kambos na Chios",
    distances: [
      { label: "Lotnisko Chios", value: "3 km", note: "Wygodne przy wczesnych lotach i krótkich pobytach." },
      { label: "Port Chios", value: "6 km", note: "Łatwy dojazd do promów i centrum miasta." },
      { label: "Najbliższa plaża", value: "1,5 km", note: "Szybka opcja przed dalszym odkrywaniem wybrzeża." },
    ],
    mapCta: { ...chiosAccommodationPageEn.location.mapCta, label: "Otwórz Voulamandis House w Google Maps" },
    guideCta: { label: "Poznaj Kambos na Chios", href: "/pl/kambos-chios/" },
  },
  reasons: {
    kicker: "CO OTRZYMUJESZ PODCZAS POBYTU",
    title: "Praktyczny komfort bez utraty charakteru miejsca",
    description:
      "Historyczne otoczenie Kambos łączy się tutaj z codziennymi udogodnieniami i bezpośrednią, lokalną gościnnością.",
    items: [
      { icon: "🌿", title: "Ogród i atmosfera Kambos", text: "Zieleń, dziedziniec i historyczne otoczenie dają przestrzeń do odpoczynku po całym dniu na wyspie." },
      { icon: "🛏️", title: "Różne układy pokoi", text: "Możesz wybrać Economy, parter, piętro lub apartament rodzinny zamiast jednego standardowego typu pokoju." },
      { icon: "❄️", title: "Najważniejsze udogodnienia", text: "Wi‑Fi, klimatyzacja, prywatna łazienka, TV i lodówka; w wybranych opcjach także aneks lub pełna kuchnia." },
      { icon: "🥐", title: "Śniadanie na życzenie", text: "Śniadanie można zamówić i zjeść w ogrodzie, rozpoczynając dzień spokojnie i bez sztywnego pakietu." },
      { icon: "🚗", title: "Parking i dobra baza", text: "Parking jest dostępny, a lokalizacja ułatwia planowanie tras do miasta, plaż i południowych wiosek." },
      { icon: "💬", title: "Bezpośrednia pomoc", text: "Przed decyzją można zapytać o piętro, łóżka, pojemność, kuchnię lub najbardziej ekonomiczną dostępną opcję." },
    ],
  },
  travelerTypes: {
    kicker: "DLA KOGO",
    title: "Elastyczna baza dla różnych rodzajów wakacji na Chios",
    items: [
      { title: "Pary szukające spokoju", text: "Pokoje Economy i Standard są dobrym wyborem dla par, które zwiedzają wyspę i chcą wracać do spokojniejszego miejsca niż centrum." },
      { title: "Rodziny potrzebujące przestrzeni", text: "Apartamenty rodzinne zapewniają sypialnię, część dzienną i pełną kuchnię, a wybrane pokoje standardowe mogą pasować do mniejszej rodziny." },
      { title: "Osoby aktywnie zwiedzające wyspę", text: "Kambos dobrze sprawdza się jako baza do codziennych wyjazdów na inną plażę, do wioski lub muzeum." },
      { title: "Goście przylatujący lub przypływający promem", text: "Około 3 km do lotniska i 6 km do portu ogranicza zbędne przejazdy na początku i końcu urlopu." },
    ],
  },
  directBooking: {
    kicker: "DOSTĘPNOŚĆ BEZPOŚREDNIA",
    title: "Sprawdź właściwy pokój przed rezerwacją",
    paragraphs: [
      "Rezerwacja bezpośrednia powinna ułatwiać wybór. Na stronach Voulamandis House możesz porównać kategorie i sprawdzić aktualną dostępność.",
      "Ponieważ pokoje różnią się piętrem, pojemnością i wyposażeniem kuchennym, bezpośredni kontakt pomaga potwierdzić właściwą opcję przed zakończeniem planowania podróży.",
    ],
    benefits: [
      "Aktualna dostępność pokoi i stawki bezpośrednie",
      "Pomoc w dopasowaniu pokoju do liczby gości i preferencji",
      "Bezpośredni kontakt z Voulamandis House",
      "Dostęp do oferty bezpośredniej dostępnej dla wybranych dat",
    ],
    primaryCta: { label: "Sprawdź stawki bezpośrednie", href: "/pl/rezerwacja/" },
    secondaryCta: { label: "Skorzystaj z Room Wizard", href: "/pl/pokoje-na-chios/#room-wizard-app" },
    whatsappCta: { label: "Zapytaj przez WhatsApp", href: "https://wa.me/306944474226" },
  },
  explore: {
    kicker: "ZAPLANUJ CAŁY POBYT",
    title: "Traktuj Kambos jako punkt startowy do odkrywania Chios",
    description:
      "Chios najlepiej poznaje się, odwiedzając różne części wyspy. Zacznij od Kambos, a kolejne polskie przewodniki dodamy w tej samej strukturze serwisu.",
    links: [
      { title: "Kambos na Chios", text: "Poznaj historyczne ogrody cytrusowe, rezydencje i kamienne mury otaczające Voulamandis House.", href: "/pl/kambos-chios/" },
      { title: "Pokoje na Chios", text: "Porównaj Economy, parter, piętro i apartamenty rodzinne.", href: "/pl/pokoje-na-chios/" },
      { title: "Hotele na Chios – przewodnik", text: "Porównaj regiony i typy zakwaterowania, jeśli rozpoczynasz wyszukiwanie od hasła hotele Chios.", href: "/pl/hotele-chios/" },
      { title: "Rezerwacja bezpośrednia", text: "Sprawdź dostępność i skontaktuj się z obiektem bezpośrednio.", href: "/pl/rezerwacja/" },
    ],
  },
  faq: {
    kicker: "NAJCZĘSTSZE PYTANIA",
    title: "Co warto wiedzieć przed wyborem noclegu na Chios",
    items: [
      { question: "Czy Voulamandis House jest hotelem?", answer: "Nie. Voulamandis House jest rodzinnym obiektem oferującym pokoje i apartamenty w Kambos na Chios. To mniejsza i bardziej osobista alternatywa dla dużego hotelu lub resortu." },
      { question: "Gdzie znajduje się Voulamandis House?", answer: "Obiekt znajduje się przy Dimarchou Kalvokoressi 117 w Kambos na Chios, w historycznej dzielnicy ogrodów cytrusowych blisko miasta i lotniska." },
      { question: "Jak daleko jest do lotniska i portu?", answer: "Voulamandis House znajduje się około 3 km od lotniska Chios i 6 km od portu." },
      { question: "Który nocleg jest najlepszy dla rodziny?", answer: "Najwięcej przestrzeni oferują apartamenty rodzinne dla maksymalnie czterech gości, z oddzielną sypialnią, częścią dzienną i pełną kuchnią." },
      { question: "Czy są pokoje na parterze bez schodów?", answer: "Tak. Dostępne są opcje na parterze. Na stronach pokoi można sprawdzić konkretne jednostki i ich położenie." },
      { question: "Czy pokoje mają kuchnię?", answer: "Apartamenty rodzinne mają pełną kuchnię, a wybrane pokoje na piętrze aneks kuchenny. Wszystkie opcje mają lodówkę." },
      { question: "Czy dostępne jest śniadanie?", answer: "Tak, śniadanie jest dostępne na życzenie i może być serwowane w ogrodzie." },
      { question: "Jak sprawdzić dostępność bezpośrednią?", answer: "Skorzystaj ze strony rezerwacji, Room Wizard albo napisz do Voulamandis House przez WhatsApp, telefon lub email, podając daty i liczbę gości." },
    ],
  },
  finalCta: {
    kicker: "TWÓJ POBYT NA CHIOS ZACZYNA SIĘ TUTAJ",
    title: "Znajdź spokojny pokój lub apartament w Kambos",
    text: "Porównaj kategorie, sprawdź zdjęcia i wybierz opcję dopasowaną do liczby gości, piętra i potrzebnej przestrzeni.",
    primaryCta: { label: "Sprawdź dostępność", href: "/pl/rezerwacja/" },
    secondaryCta: { label: "Zobacz wszystkie pokoje", href: "/pl/pokoje-na-chios/" },
  },
};
