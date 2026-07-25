import {
  economyDoubleRoomsEn,
  familyChiosApartments,
  standardDoubleRoom,
  type IndividualRoomData,
  type RoomDetailData,
} from "@/content/room-details";

function roomNumber(name: string) {
  const match = name.match(/(\d+)/);
  return match?.[1] || name;
}

function localizeLocation(value: string) {
  if (value.toLowerCase().includes("ground")) return "Parter";
  if (value.toLowerCase().includes("first")) return "Piętro";
  if (value.toLowerCase().includes("stand") || value.toLowerCase().includes("independent")) return "Niezależny apartament";
  return value;
}

function localizeBeds(values: string[]) {
  return values.map((value) =>
    value
      .replace("1 double bed", "1 łóżko podwójne")
      .replace("2 double beds", "2 łóżka podwójne")
      .replace("1 single bed", "1 łóżko pojedyncze")
      .replace("2 single beds", "2 łóżka pojedyncze")
      .replace("1 sofa bed", "1 sofa rozkładana")
      .replace("2 sofa beds", "2 sofy rozkładane"),
  );
}

function localizeBadge(value: string) {
  const map: Record<string, string> = {
    "Ground floor": "Parter",
    "First floor": "Piętro",
    "Garden access": "Dostęp do ogrodu",
    "No stairs": "Bez schodów",
    "Economy": "Economy",
    "Kambos view": "Widok na Kambos",
    "Upper-floor view": "Widok z piętra",
    "Private balcony": "Prywatny balkon",
    "Kitchenette": "Aneks kuchenny",
    "Kitchen": "Kuchnia",
    "Full kitchen": "Pełna kuchnia",
    "Garden view": "Widok na ogród",
    "Family space": "Przestrzeń rodzinna",
    "Sofa bed": "Sofa rozkładana",
    "Sofa beds": "Sofy rozkładane",
    "Access by stairs": "Dostęp po schodach",
    "Two spaces": "Dwie przestrzenie",
    "Two spaces, no connecting door": "Dwie przestrzenie bez drzwi łączących",
  };
  if (/Up to (\d+) guests/.test(value)) {
    return value.replace(/Up to (\d+) guests/, "Do $1 osób");
  }
  return map[value] || value;
}

function localizeAmenity(label: string) {
  const map: Record<string, string> = {
    "Free WiFi": "Bezpłatne Wi‑Fi",
    "Wi-Fi": "Wi‑Fi",
    "Air conditioning": "Klimatyzacja",
    "LCD TV": "Telewizor LCD",
    "Refrigerator": "Lodówka",
    "Kettle": "Czajnik",
    "Private bathroom": "Prywatna łazienka",
    "Garden atmosphere": "Atmosfera ogrodu",
    "Kitchenette": "Aneks kuchenny",
    "Full kitchen": "Pełna kuchnia",
    "Coffee and tea kettle": "Czajnik do kawy i herbaty",
    "Ground-floor view": "Widok z parteru",
    "Open-plan space": "Otwarta przestrzeń",
  };
  return map[label] || label;
}

function localizeIndividualRooms(
  rooms: IndividualRoomData[],
  category: "economy" | "standard" | "family",
): IndividualRoomData[] {
  return rooms.map((room) => ({
    ...room,
    name: category === "family" ? `Apartament ${roomNumber(room.name)}` : `Pokój ${roomNumber(room.name)}`,
    type:
      category === "economy"
        ? "Ekonomiczny pokój dwuosobowy"
        : category === "family"
          ? "Apartament rodzinny"
          : room.location.toLowerCase().includes("ground")
            ? "Pokój dwu-/trzyosobowy na parterze"
            : "Pokój dwu-/trzyosobowy na piętrze",
    location: localizeLocation(room.location),
    description:
      category === "economy"
        ? `Pokój ${roomNumber(room.name)} to ekonomiczna opcja dla dwóch osób w spokojnym Kambos, z podstawowym wyposażeniem potrzebnym podczas pobytu na Chios.`
        : category === "family"
          ? `Apartament ${roomNumber(room.name)} zapewnia rodzinie więcej przestrzeni oraz możliwość wygodniejszego, niezależnego pobytu w Kambos na Chios.`
          : room.location.toLowerCase().includes("ground")
            ? `Pokój ${roomNumber(room.name)} znajduje się na parterze i zapewnia łatwy dostęp do dziedzińca oraz ogrodu bez konieczności korzystania ze schodów.`
            : `Pokój ${roomNumber(room.name)} znajduje się na piętrze i oferuje jaśniejszą przestrzeń oraz atmosferę tarasu lub widok na otoczenie Kambos.`,
    badges: room.badges.map(localizeBadge),
    beds: localizeBeds(room.beds),
    amenities: room.amenities.map((item) => ({ ...item, label: localizeAmenity(item.label) })),
    images: room.images.map((image) => ({
      ...image,
      alt: `${category === "family" ? "Apartament" : "Pokój"} ${roomNumber(room.name)} w Voulamandis House na Chios`,
      caption: "Zdjęcie pokoju",
    })),
  }));
}

export const standardDoubleRoomPl: RoomDetailData = {
  ...standardDoubleRoom,
  id: "standard-double-room-pl",
  seo: {
    canonicalPath: "/pl/pokoje-na-chios/pokoje-standardowe/",
    title: "Pokoje standardowe na Chios | Parter i piętro",
    description:
      "Standardowe pokoje dwu- i trzyosobowe na Chios w Voulamandis House. Wybierz parter z dostępem do ogrodu lub pokoje na piętrze w spokojnym Kambos.",
    ogImage: standardDoubleRoom.seo.ogImage,
  },
  hero: {
    ...standardDoubleRoom.hero,
    kicker: "Pokoje standardowe na Chios",
    title: "Pokoje dwu- i trzyosobowe na Chios",
    subtitle: "Parter lub piętro w spokojnym Kambos",
    description:
      "Wygodne pokoje dla par, przyjaciół i małych rodzin. Wybierz łatwy dostęp do ogrodu na parterze albo jaśniejszy pokój na piętrze.",
    imageAlt: "Standardowy pokój dwu- lub trzyosobowy na Chios w Voulamandis House",
    badges: ["2–4 osoby", "Parter lub piętro", "Bezpłatne Wi‑Fi", "Klimatyzacja"],
    primaryCta: { label: "Rezerwuj bezpośrednio", href: "/pl/rezerwacja/" },
    secondaryCta: { label: "Zapytaj o dostępność", href: "https://wa.me/306944474226" },
  },
  overview: {
    kicker: "Pokoje standardowe",
    title: "Wybierz parter lub piętro",
    paragraphs: [
      "Standardowe pokoje Voulamandis House są przeznaczone dla gości, którzy chcą połączyć wygodę z kameralną atmosferą Kambos.",
      "Pokoje na parterze zapewniają łatwy dostęp do dziedzińca i ogrodu. Pokoje na piętrze są jaśniejsze i oferują bardziej otwartą atmosferę.",
      "To praktyczna baza dla par, przyjaciół i małych rodzin, blisko miasta Chios, lotniska oraz południowych plaż wyspy.",
    ],
    highlights: [
      { label: "Goście", value: "2–4" },
      { label: "Typ", value: "Dwu-/trzyosobowy" },
      { label: "Położenie", value: "Parter i piętro" },
      { label: "Okolica", value: "Kambos" },
    ],
  },
  gallery: { ...standardDoubleRoom.gallery, kicker: "Zdjęcia pokoi", title: "Zobacz pokoje standardowe" },
  amenities: {
    ...standardDoubleRoom.amenities,
    kicker: "Udogodnienia",
    title: "Wygodny pobyt na Chios",
    items: standardDoubleRoom.amenities.items.map((item) => ({ ...item, label: localizeAmenity(item.label) })),
  },
  individualRooms: {
    kicker: "Dostępne pokoje",
    title: "Wybierz konkretny pokój standardowy",
    description: "Kategoria obejmuje pokoje na parterze z łatwym dostępem do ogrodu oraz pokoje na piętrze. Niektóre pokoje na piętrze mają także aneks kuchenny.",
    rooms: localizeIndividualRooms(standardDoubleRoom.individualRooms.rooms, "standard"),
  },
  bestFor: { ...standardDoubleRoom.bestFor, kicker: "Dla kogo", title: "Dobry wybór dla", items: ["Par i dwóch osób", "Małych rodzin", "Gości wybierających parter bez schodów", "Gości preferujących pokój na piętrze"] },
  booking: { ...standardDoubleRoom.booking, kicker: "Rezerwacja bezpośrednia", title: "Sprawdź dostępność pokoi standardowych", text: "Podaj daty i liczbę osób, a pomożemy wybrać odpowiedni pokój na parterze lub piętrze.", whatsappHref: "https://wa.me/306944474226", whatsappLabel: "WhatsApp", note: "Dostępność zależy od terminu i liczby gości." },
  faq: [
    { question: "Czy są pokoje na parterze bez schodów?", answer: "Tak. Wybrane pokoje standardowe znajdują się na parterze i mają łatwy dostęp do dziedzińca oraz ogrodu." },
    { question: "Czy są pokoje na piętrze?", answer: "Tak. Dostępne są również pokoje na piętrze, do których prowadzą schody." },
    { question: "Dla ilu osób są pokoje standardowe?", answer: "W zależności od konkretnego pokoju mogą pomieścić od dwóch do czterech osób." },
  ],
};

export const economyDoubleRoomsPl: RoomDetailData = {
  ...economyDoubleRoomsEn,
  id: "economy-double-rooms-pl",
  seo: {
    canonicalPath: "/pl/pokoje-na-chios/pokoj-dwuosobowy-economy/",
    title: "Ekonomiczny pokój dwuosobowy na Chios | Kambos",
    description: "Ekonomiczne pokoje dwuosobowe na Chios w Voulamandis House w Kambos. Opcja dla 2 osób z Wi‑Fi, klimatyzacją i lodówką.",
    ogImage: economyDoubleRoomsEn.seo.ogImage,
  },
  hero: {
    ...economyDoubleRoomsEn.hero,
    kicker: "Economy na Chios",
    title: "Ekonomiczny pokój dwuosobowy na Chios",
    subtitle: "Prosta i korzystna opcja dla dwóch osób",
    description: "Odnowione pokoje dla dwóch gości, idealne dla par i osób, które chcą spokojnej bazy w Kambos w rozsądnej kategorii cenowej.",
    imageAlt: "Ekonomiczny pokój dwuosobowy na Chios w Voulamandis House",
    badges: ["2 osoby", "Economy", "Wi‑Fi", "Klimatyzacja"],
    primaryCta: { label: "Rezerwuj bezpośrednio", href: "/pl/rezerwacja/" },
    secondaryCta: { label: "Zapytaj o dostępność", href: "https://wa.me/306944474226" },
  },
  overview: {
    kicker: "Pokój Economy",
    title: "Praktyczna opcja dla dwóch osób",
    paragraphs: [
      "Pokoje Economy są przeznaczone dla dwóch osób, które szukają zadbanego noclegu w Kambos i nie potrzebują większego apartamentu.",
      "To dobry wybór na pobyt nastawiony na plaże, zwiedzanie i odkrywanie Chios, z możliwością powrotu do spokojnego otoczenia.",
    ],
    highlights: [
      { label: "Goście", value: "2" },
      { label: "Kategoria", value: "Economy" },
      { label: "Okolica", value: "Kambos" },
      { label: "Typ", value: "Pokój dwuosobowy" },
    ],
  },
  gallery: { ...economyDoubleRoomsEn.gallery, kicker: "Zdjęcia", title: "Zobacz pokoje Economy" },
  amenities: { ...economyDoubleRoomsEn.amenities, kicker: "Udogodnienia", title: "Najważniejsze wyposażenie", items: economyDoubleRoomsEn.amenities.items.map((item) => ({ ...item, label: localizeAmenity(item.label) })) },
  individualRooms: { kicker: "Pokoje Economy", title: "Wybierz pokój dla dwóch osób", description: "Ta kategoria obejmuje pokoje dwuosobowe przeznaczone maksymalnie dla dwóch gości.", rooms: localizeIndividualRooms(economyDoubleRoomsEn.individualRooms.rooms, "economy") },
  bestFor: { ...economyDoubleRoomsEn.bestFor, kicker: "Dla kogo", title: "Dobry wybór dla", items: ["Par", "Dwóch osób", "Krótkich pobytów", "Gości szukających korzystnej opcji"] },
  booking: { ...economyDoubleRoomsEn.booking, kicker: "Rezerwacja bezpośrednia", title: "Sprawdź dostępność Economy", text: "Podaj daty pobytu i sprawdź aktualną dostępność pokoju dla dwóch osób.", whatsappHref: "https://wa.me/306944474226", whatsappLabel: "WhatsApp", note: "Cena i dostępność zależą od terminu." },
  faq: [
    { question: "Dla ilu osób jest pokój Economy?", answer: "Pokój Economy jest przeznaczony maksymalnie dla dwóch osób." },
    { question: "Czy pokój ma klimatyzację i Wi‑Fi?", answer: "Tak. Kategoria obejmuje podstawowe udogodnienia potrzebne podczas pobytu, w tym klimatyzację i Wi‑Fi." },
  ],
};

export const familyChiosApartmentsPl: RoomDetailData = {
  ...familyChiosApartments,
  id: "family-apartments-pl",
  seo: {
    canonicalPath: "/pl/pokoje-na-chios/apartamenty-rodzinne/",
    title: "Apartamenty rodzinne na Chios | Voulamandis House",
    description: "Rodzinne apartamenty na Chios w Voulamandis House w Kambos. Więcej przestrzeni, kuchnia i wygodny pobyt dla rodzin do 4 osób.",
    ogImage: familyChiosApartments.seo.ogImage,
  },
  hero: {
    ...familyChiosApartments.hero,
    kicker: "Apartamenty rodzinne na Chios",
    title: "Rodzinne apartamenty w Kambos",
    subtitle: "Więcej przestrzeni, kuchnia i spokojne otoczenie",
    description: "Apartamenty dla rodzin i małych grup, które chcą mieć więcej miejsca, własną kuchnię i wygodną bazę do odkrywania Chios.",
    imageAlt: "Apartament rodzinny na Chios w Voulamandis House",
    badges: ["Do 4 osób", "40–45 m²", "Kuchnia", "Kambos"],
    primaryCta: { label: "Rezerwuj bezpośrednio", href: "/pl/rezerwacja/" },
    secondaryCta: { label: "Zapytaj o dostępność", href: "https://wa.me/306944474226" },
  },
  overview: {
    kicker: "Apartament rodzinny",
    title: "Więcej miejsca dla rodziny na Chios",
    paragraphs: [
      "Rodzinne apartamenty Voulamandis House oferują więcej przestrzeni niż standardowy pokój i pozwalają wygodniej zorganizować rodzinny pobyt.",
      "Kuchnia daje większą niezależność podczas wakacji, a spokojne położenie w Kambos pozwala odpocząć po całym dniu zwiedzania wyspy.",
    ],
    highlights: [
      { label: "Goście", value: "Do 4" },
      { label: "Powierzchnia", value: "40–45 m²" },
      { label: "Kuchnia", value: "Tak" },
      { label: "Okolica", value: "Kambos" },
    ],
  },
  gallery: { ...familyChiosApartments.gallery, kicker: "Zdjęcia apartamentów", title: "Zobacz rodzinne apartamenty" },
  amenities: { ...familyChiosApartments.amenities, kicker: "Udogodnienia", title: "Wygoda dla rodziny", items: familyChiosApartments.amenities.items.map((item) => ({ ...item, label: localizeAmenity(item.label) })) },
  individualRooms: { kicker: "Apartamenty", title: "Wybierz konkretny apartament", description: "Rodzinne apartamenty różnią się układem i zdjęciami, ale wszystkie zapewniają więcej przestrzeni na rodzinny pobyt.", rooms: localizeIndividualRooms(familyChiosApartments.individualRooms.rooms, "family") },
  bestFor: { ...familyChiosApartments.bestFor, kicker: "Dla kogo", title: "Dobry wybór dla", items: ["Rodzin", "Pobytów dla 3–4 osób", "Gości potrzebujących kuchni", "Dłuższych pobytów"] },
  booking: { ...familyChiosApartments.booking, kicker: "Rezerwacja bezpośrednia", title: "Sprawdź dostępność apartamentu", text: "Podaj daty oraz liczbę gości, aby sprawdzić, który apartament najlepiej pasuje do Twojej rodziny.", whatsappHref: "https://wa.me/306944474226", whatsappLabel: "WhatsApp", note: "Dla większej liczby osób skontaktuj się z nami przed rezerwacją." },
  faq: [
    { question: "Dla ilu osób są apartamenty rodzinne?", answer: "Standardowo apartamenty są przeznaczone dla maksymalnie czterech osób. W sprawie innych konfiguracji skontaktuj się bezpośrednio z obiektem." },
    { question: "Czy apartamenty mają kuchnię?", answer: "Tak. Apartamenty rodzinne posiadają kuchnię, dzięki czemu są wygodne podczas rodzinnego lub dłuższego pobytu." },
  ],
};
