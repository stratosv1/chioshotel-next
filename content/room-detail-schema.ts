import type {
  IndividualRoomData,
  RoomDetailData,
} from "@/content/room-details";
import {
  absoluteUrl,
  getCanonicalUrl,
  getLanguageForPath,
  siteName,
  siteUrl,
} from "@/lib/seo";
import {
  buildBreadcrumbSchema,
  buildFaqSchema,
  buildHotelSchema,
  buildImageSchema,
  buildOrganizationSchema,
  buildSchemaGraph,
  buildWebsiteSchema,
  hotelId,
  primaryImageId,
  schemaId,
  webPageId,
  websiteId,
  type SchemaObject,
} from "@/lib/structured-data";

function uniqueItems<T>(items: T[]): T[] {
  return Array.from(new Set(items.filter(Boolean)));
}

type RoomSchemaLanguage = "en" | "el" | "de" | "fr" | "it" | "es" | "tr";
type RoomSchemaDictionary = Partial<Record<RoomSchemaLanguage, string>>;

const roomSchemaLabelsByLanguage: Record<
  RoomSchemaLanguage,
  {
    roomType: string;
    location: string;
    beds: string;
    highlights: string;
    guests: string;
    roomsBreadcrumbName: string;
    roomsBreadcrumbPath: string;
    roomNoun: string;
    apartmentNoun: string;
  }
> = {
  en: {
    roomType: "Room type",
    location: "Location",
    beds: "Beds",
    highlights: "Highlights",
    guests: "guests",
    roomsBreadcrumbName: "Chios rooms and apartments",
    roomsBreadcrumbPath: "/chios-rooms/",
    roomNoun: "Room",
    apartmentNoun: "Apartment",
  },
  el: {
    roomType: "Τύπος δωματίου",
    location: "Τοποθεσία",
    beds: "Κρεβάτια",
    highlights: "Χαρακτηριστικά",
    guests: "επισκέπτες",
    roomsBreadcrumbName: "Δωμάτια και διαμερίσματα στη Χίο",
    roomsBreadcrumbPath: "/el/domatia-xios/",
    roomNoun: "Δωμάτιο",
    apartmentNoun: "Διαμέρισμα",
  },
  de: {
    roomType: "Zimmertyp",
    location: "Lage",
    beds: "Betten",
    highlights: "Highlights",
    guests: "Gäste",
    roomsBreadcrumbName: "Zimmer und Apartments auf Chios",
    roomsBreadcrumbPath: "/de/chios-zimmer/",
    roomNoun: "Zimmer",
    apartmentNoun: "Apartment",
  },
  fr: {
    roomType: "Type de chambre",
    location: "Emplacement",
    beds: "Lits",
    highlights: "Points forts",
    guests: "hôtes",
    roomsBreadcrumbName: "Chambres et appartements à Chios",
    roomsBreadcrumbPath: "/fr/chambres-a-chios/",
    roomNoun: "Chambre",
    apartmentNoun: "Appartement",
  },
  it: {
    roomType: "Tipo di camera",
    location: "Posizione",
    beds: "Letti",
    highlights: "Caratteristiche",
    guests: "ospiti",
    roomsBreadcrumbName: "Camere e appartamenti a Chios",
    roomsBreadcrumbPath: "/it/stanze-a-chios/",
    roomNoun: "Camera",
    apartmentNoun: "Appartamento",
  },
  es: {
    roomType: "Tipo de habitación",
    location: "Ubicación",
    beds: "Camas",
    highlights: "Características",
    guests: "huéspedes",
    roomsBreadcrumbName: "Habitaciones y apartamentos en Quíos",
    roomsBreadcrumbPath: "/es/habitaciones-en-chios/",
    roomNoun: "Habitación",
    apartmentNoun: "Apartamento",
  },
  tr: {
    roomType: "Oda tipi",
    location: "Konum",
    beds: "Yataklar",
    highlights: "Öne çıkan özellikler",
    guests: "misafir",
    roomsBreadcrumbName: "Sakız Adası odaları ve daireleri",
    roomsBreadcrumbPath: "/tr/sakiz-adasi-odalari/",
    roomNoun: "Oda",
    apartmentNoun: "Daire",
  },
};

const roomSchemaTerms: Record<string, RoomSchemaDictionary> = {
  Room: { el: "Δωμάτιο", fr: "Chambre", de: "Zimmer", it: "Camera", es: "Habitación", tr: "Oda" },
  Apartment: { el: "Διαμέρισμα", fr: "Appartement", de: "Apartment", it: "Appartamento", es: "Apartamento", tr: "Daire" },
  "Ground floor": { el: "Ισόγειο", fr: "Rez-de-chaussée", de: "Erdgeschoss", it: "Piano terra", es: "Planta baja", tr: "Zemin kat" },
  "First floor": { el: "Πρώτος όροφος", fr: "Premier étage", de: "Obergeschoss", it: "Primo piano", es: "Primera planta", tr: "Üst kat" },
  "Independent unit": { el: "Ανεξάρτητη μονάδα", fr: "Unité indépendante", de: "Eigenständige Einheit", it: "Unità indipendente", es: "Unidad independiente", tr: "Bağımsız birim" },
  "Ground-floor double / triple": { el: "Ισόγειο δίκλινο / τρίκλινο", fr: "Double / triple au rez-de-chaussée", de: "Doppel- / Dreibettzimmer im Erdgeschoss", it: "Doppia / tripla al piano terra", es: "Doble / triple en planta baja", tr: "Zemin kat çift / üç kişilik oda" },
  "First-floor double / triple": { el: "Δίκλινο / τρίκλινο πρώτου ορόφου", fr: "Double / triple au premier étage", de: "Doppel- / Dreibettzimmer im Obergeschoss", it: "Doppia / tripla al primo piano", es: "Doble / triple en primera planta", tr: "Üst kat çift / üç kişilik oda" },
  "Budget double room": { el: "Οικονομικό δίκλινο", fr: "Chambre double économique", de: "Economy Doppelzimmer", it: "Camera doppia economy", es: "Habitación doble económica", tr: "Ekonomik çift kişilik oda" },
  "Garden access": { el: "Πρόσβαση στον κήπο", fr: "Accès jardin", de: "Gartenzugang", it: "Accesso al giardino", es: "Acceso al jardín", tr: "Bahçe erişimi" },
  "No stairs": { el: "Χωρίς σκάλες", fr: "Sans escaliers", de: "Keine Treppen", it: "Senza scale", es: "Sin escaleras", tr: "Merdivensiz" },
  "Kambos view": { el: "Θέα στον Κάμπο", fr: "Vue sur Kambos", de: "Blick auf Kambos", it: "Vista su Kambos", es: "Vista a Kambos", tr: "Kambos manzarası" },
  "Upper-floor view": { el: "Θέα από τον όροφο", fr: "Vue depuis l’étage", de: "Blick vom Obergeschoss", it: "Vista dal piano superiore", es: "Vista desde la planta superior", tr: "Üst kat manzarası" },
  "Private balcony": { el: "Ιδιωτικό μπαλκόνι", fr: "Balcon privé", de: "Privater Balkon", it: "Balcone privato", es: "Balcón privado", tr: "Özel balkon" },
  Kitchenette: { el: "Μικρή κουζίνα", fr: "Kitchenette", de: "Kitchenette", it: "Angolo cottura", es: "Kitchenette", tr: "Mini mutfak" },
  Kitchen: { el: "Κουζίνα", fr: "Cuisine", de: "Küche", it: "Cucina", es: "Cocina", tr: "Mutfak" },
  "Sofa bed": { el: "Καναπές-κρεβάτι", fr: "Canapé-lit", de: "Schlafsofa", it: "Divano letto", es: "Sofá cama", tr: "Çekyat" },
  "Sofa beds": { el: "Καναπέδες-κρεβάτια", fr: "Canapés-lits", de: "Schlafsofas", it: "Divani letto", es: "Sofás cama", tr: "Çekyatlar" },
  "Full kitchen": { el: "Πλήρης κουζίνα", fr: "Cuisine complète", de: "Voll ausgestattete Küche", it: "Cucina completa", es: "Cocina completa", tr: "Tam mutfak" },
  "Garden view": { el: "Θέα στον κήπο", fr: "Vue jardin", de: "Gartenblick", it: "Vista giardino", es: "Vista al jardín", tr: "Bahçe manzarası" },
  "Open-plan space": { el: "Ενιαίος χώρος", fr: "Espace ouvert", de: "Offener Raum", it: "Spazio open space", es: "Espacio abierto", tr: "Açık plan alan" },
  "Access by stairs": { el: "Πρόσβαση με σκάλες", fr: "Accès par escalier", de: "Zugang über Treppen", it: "Accesso tramite scale", es: "Acceso por escaleras", tr: "Merdivenle erişim" },
  "Two spaces": { el: "Δύο χώροι", fr: "Deux espaces", de: "Zwei Bereiche", it: "Due ambienti", es: "Dos espacios", tr: "İki alan" },
  "Two spaces, no connecting door": { el: "Δύο χώροι, χωρίς ενδιάμεση πόρτα", fr: "Deux espaces, sans porte communicante", de: "Zwei Bereiche, keine Verbindungstür", it: "Due ambienti, senza porta comunicante", es: "Dos espacios, sin puerta comunicante", tr: "İki alan, ara kapı yok" },
  "Wi-Fi": { el: "Wi‑Fi", fr: "Wi‑Fi", de: "WLAN", it: "Wi‑Fi", es: "Wi‑Fi", tr: "Wi‑Fi" },
  "Coffee and tea kettle": { el: "Βραστήρας για καφέ και τσάι", fr: "Bouilloire pour café et thé", de: "Wasserkocher für Kaffee und Tee", it: "Bollitore per caffè e tè", es: "Hervidor para café y té", tr: "Kahve ve çay için su ısıtıcısı" },
  "Ground-floor view": { el: "Θέα ισογείου", fr: "Vue du rez-de-chaussée", de: "Blick im Erdgeschoss", it: "Vista dal piano terra", es: "Vista de planta baja", tr: "Zemin kat manzarası" },
  "1 double bed": { el: "1 διπλό κρεβάτι", fr: "1 lit double", de: "1 Doppelbett", it: "1 letto matrimoniale", es: "1 cama doble", tr: "1 çift kişilik yatak" },
  "1 single bed": { el: "1 μονό κρεβάτι", fr: "1 lit simple", de: "1 Einzelbett", it: "1 letto singolo", es: "1 cama individual", tr: "1 tek kişilik yatak" },
  "2 single beds": { el: "2 μονά κρεβάτια", fr: "2 lits simples", de: "2 Einzelbetten", it: "2 letti singoli", es: "2 camas individuales", tr: "2 tek kişilik yatak" },
  "1 sofa bed": { el: "1 καναπές-κρεβάτι", fr: "1 canapé-lit", de: "1 Schlafsofa", it: "1 divano letto", es: "1 sofá cama", tr: "1 çekyat" },
  "2 sofa beds": { el: "2 καναπέδες-κρεβάτια", fr: "2 canapés-lits", de: "2 Schlafsofas", it: "2 divani letto", es: "2 sofás cama", tr: "2 çekyat" },
  "Room 6 is ideal for guests who love nature. Located on the ground floor, it opens directly to the peaceful courtyard and garden.": { tr: "Oda 6 zemin kattadır ve huzurlu avlu ile bahçeye doğrudan açılır." },
  "Room 2 is located on the first floor and offers access to a shared terrace with views over the estate and the citrus trees of Kambos.": { tr: "Oda 2 üst katta yer alır ve narenciye bahçelerine bakan ortak terasa erişim sunar." },
  "Room 5 is a ground-floor double / triple room with direct courtyard and garden access. It is ideal for guests who prefer no stairs and an easy outdoor connection.": { tr: "Oda 5, avlu ve bahçeye doğrudan erişimi olan zemin kat çift / üç kişilik odadır." },
  "Room 7 is a ground-floor double / triple room with garden access and a flexible layout with a sofa bed.": { tr: "Oda 7, bahçe erişimi ve çekyatlı zemin kat çift / üç kişilik odadır." },
  "Room 1 is a first-floor room for up to 4 guests, with upper-floor view, private balcony feel and two sleeping spaces without a connecting door.": { tr: "Oda 1 üst katta yer alır ve iki uyku alanıyla 4 kişiye kadar konaklama sunar." },
  "Room 3 is a first-floor double / triple room with kitchenette, upper-floor view and access by stairs.": { tr: "Oda 3, mini mutfak ve merdiven erişimi olan üst kat çift / üç kişilik odadır." },
  "Room 4 is a first-floor double / triple room with kitchenette, sofa bed and upper-floor view.": { tr: "Oda 4, mini mutfak, çekyat ve üst kat manzarası sunan çift / üç kişilik odadır." },
  "Apartment 8 is a family apartment with living room and kitchen, separate bedroom and bathroom. It is suitable for up to 4 guests.": { tr: "Daire 8, mutfaklı oturma alanı, ayrı yatak odası ve banyoya sahiptir; 4 kişiye kadar uygundur." },
  "Apartment 9 offers the same family-friendly layout with kitchen, living area, bedroom and bathroom, suitable for up to 4 guests.": { tr: "Daire 9, mutfak, oturma alanı, yatak odası ve banyodan oluşan aile dostu bir düzene sahiptir; 4 kişiye kadar uygundur." },
  "Apartment 10 is a family apartment with living room and kitchen, bedroom and flexible sofa-bed layout.": { tr: "Daire 10, mutfaklı oturma alanı, yatak odası ve esnek çekyat düzenine sahip bir aile dairesidir." },
};

function getRoomSchemaLanguage(path: string): RoomSchemaLanguage {
  return getLanguageForPath(path) as RoomSchemaLanguage;
}

function getRoomSchemaLabels(path: string) {
  const language = getRoomSchemaLanguage(path);
  return roomSchemaLabelsByLanguage[language] ?? roomSchemaLabelsByLanguage.en;
}

function localizeRoomSchemaText(value: string, language: RoomSchemaLanguage): string {
  if (language === "en") {
    return value;
  }

  return roomSchemaTerms[value]?.[language] ?? value;
}

function localizeRoomSchemaName(value: string, language: RoomSchemaLanguage): string {
  if (language === "en") {
    return value;
  }

  const labels = roomSchemaLabelsByLanguage[language];
  const roomMatch = value.match(/^Room (\d+)$/);
  if (roomMatch) {
    return `${labels.roomNoun} ${roomMatch[1]}`;
  }

  const apartmentMatch = value.match(/^Apartment (\d+)$/);
  if (apartmentMatch) {
    return `${labels.apartmentNoun} ${apartmentMatch[1]}`;
  }

  return localizeRoomSchemaText(value, language);
}

function getRoomDetailImages(data: RoomDetailData): string[] {
  const heroImages = [
    data.seo.ogImage,
    data.hero.image,
    ...data.gallery.images.map((image) => image.src),
  ];

  const individualRoomImages = data.individualRooms.rooms.flatMap((room) =>
    room.images.map((image) => image.src),
  );

  return uniqueItems([...heroImages, ...individualRoomImages]).map(absoluteUrl);
}

function getRoomDetailAmenities(data: RoomDetailData) {
  const language = getRoomSchemaLanguage(data.seo.canonicalPath);
  return data.amenities.items.map((item) => ({
    "@type": "LocationFeatureSpecification",
    name: localizeRoomSchemaText(item.label, language),
    value: true,
    description: item.text,
  }));
}

function getMaxGuests(data: RoomDetailData): number | undefined {
  const guests = data.individualRooms.rooms
    .map((room) => room.maxGuests)
    .filter((value) => typeof value === "number" && value > 0);

  if (!guests.length) {
    return undefined;
  }

  return Math.max(...guests);
}

function buildBedDescription(
  room: IndividualRoomData,
  language: RoomSchemaLanguage,
): string | undefined {
  if (!room.beds.length) {
    return undefined;
  }

  return room.beds
    .map((bed) => localizeRoomSchemaText(bed, language))
    .join(", ");
}

function buildIndividualRoomSchema(
  room: IndividualRoomData,
  parentData: RoomDetailData,
): SchemaObject {
  const canonicalPath = parentData.seo.canonicalPath;
  const language = getRoomSchemaLanguage(canonicalPath);
  const labels = getRoomSchemaLabels(canonicalPath);
  const roomUrl = `${getCanonicalUrl(canonicalPath)}#${room.id}`;
  const localizedBeds = room.beds.map((bed) =>
    localizeRoomSchemaText(bed, language),
  );
  const localizedBadges = room.badges.map((badge) =>
    localizeRoomSchemaText(badge, language),
  );

  return {
    "@type": "Room",
    "@id": schemaId(canonicalPath, room.id),
    name: localizeRoomSchemaName(room.name, language),
    alternateName: localizeRoomSchemaText(room.type, language),
    url: roomUrl,
    description: localizeRoomSchemaText(room.description, language),
    image: room.images.map((image) => absoluteUrl(image.src)),
    containedInPlace: {
      "@id": schemaId(canonicalPath, "room"),
    },
    isPartOf: {
      "@id": schemaId(canonicalPath, "room"),
    },
    occupancy: {
      "@type": "QuantitativeValue",
      maxValue: room.maxGuests,
      unitText: labels.guests,
    },
    bed: buildBedDescription(room, language),
    amenityFeature: room.amenities.map((amenity) => ({
      "@type": "LocationFeatureSpecification",
      name: localizeRoomSchemaText(amenity.label, language),
      value: true,
    })),
    additionalProperty: [
      {
        "@type": "PropertyValue",
        name: labels.roomType,
        value: localizeRoomSchemaText(room.type, language),
      },
      {
        "@type": "PropertyValue",
        name: labels.location,
        value: localizeRoomSchemaText(room.location, language),
      },
      {
        "@type": "PropertyValue",
        name: labels.beds,
        value: localizedBeds.join(", "),
      },
      {
        "@type": "PropertyValue",
        name: labels.highlights,
        value: localizedBadges.join(", "),
      },
    ].filter((item) => item.value),
  };
}

function buildRoomSchema(data: RoomDetailData): SchemaObject {
  const canonicalPath = data.seo.canonicalPath;
  const labels = getRoomSchemaLabels(canonicalPath);
  const maxGuests = getMaxGuests(data);
  const allImages = getRoomDetailImages(data);

  return {
    "@type": "Accommodation",
    "@id": schemaId(canonicalPath, "room"),
    name: data.hero.title,
    alternateName: data.hero.subtitle,
    url: getCanonicalUrl(canonicalPath),
    description: data.seo.description,
    image: allImages,
    containedInPlace: {
      "@id": hotelId(),
    },
    isPartOf: {
      "@id": hotelId(),
    },
    mainEntityOfPage: {
      "@id": webPageId(canonicalPath),
    },
    occupancy: maxGuests
      ? {
          "@type": "QuantitativeValue",
          maxValue: maxGuests,
          unitText: labels.guests,
        }
      : undefined,
    amenityFeature: getRoomDetailAmenities(data),
    hasPart: data.individualRooms.rooms.map((room) => ({
      "@id": schemaId(canonicalPath, room.id),
    })),
  };
}

function buildRoomWebPageSchema(data: RoomDetailData): SchemaObject {
  const canonicalPath = data.seo.canonicalPath;
  const language = getLanguageForPath(canonicalPath);

  return {
    "@type": "WebPage",
    "@id": webPageId(canonicalPath),
    url: getCanonicalUrl(canonicalPath),
    name: data.seo.title,
    headline: data.hero.title,
    description: data.seo.description,
    inLanguage: language,
    isPartOf: {
      "@id": websiteId(),
    },
    about: {
      "@id": schemaId(canonicalPath, "room"),
    },
    mainEntity: {
      "@id": schemaId(canonicalPath, "room"),
    },
    primaryImageOfPage: {
      "@id": primaryImageId(canonicalPath),
    },
    breadcrumb: {
      "@id": schemaId(canonicalPath, "breadcrumb"),
    },
    publisher: {
      "@id": `${siteUrl}/#organization`,
    },
  };
}

export function buildRoomDetailSchema(data: RoomDetailData) {
  const canonicalPath = data.seo.canonicalPath;
  const labels = getRoomSchemaLabels(canonicalPath);
  return buildSchemaGraph([
    buildOrganizationSchema(),
    buildHotelSchema({ path: canonicalPath }),
    buildWebsiteSchema(),
    buildImageSchema(
      {
        url: data.seo.ogImage || data.hero.image,
        alt: data.hero.imageAlt || data.hero.title,
        caption: `${data.hero.title} - ${siteName}`,
      },
      canonicalPath,
    ),
    buildRoomWebPageSchema(data),
    buildRoomSchema(data),
    ...data.individualRooms.rooms.map((room) =>
      buildIndividualRoomSchema(room, data),
    ),
    buildBreadcrumbSchema(canonicalPath, [
      {
        name: labels.roomsBreadcrumbName,
        path: labels.roomsBreadcrumbPath,
      },
      {
        name: data.hero.title,
        path: canonicalPath,
      },
    ]),
    buildFaqSchema({
      path: canonicalPath,
      questions: data.faq,
    }),
  ]);
}
