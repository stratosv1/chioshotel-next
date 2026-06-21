import {
  absoluteUrl,
  getCanonicalUrl,
  getLanguageForPath,
  siteUrl,
} from "./seo";

type SchemaPrimitive = string | number | boolean | null;
type SchemaValue = SchemaPrimitive | SchemaObject | SchemaValue[];

export type SchemaObject = {
  [key: string]: SchemaValue | undefined;
};

export type AmenityInput = {
  name: string;
  description?: string;
};

export const businessData = {
  name: "Voulamandis House",
  url: siteUrl,
  telephone: "+302271031733",
  email: "info@chioshotel.gr",
  priceRange: "€70-€90",
  address: {
    streetAddress: "Dimarchou Kalvokoressi 117",
    addressLocality: "Chios",
    addressRegion: "North Aegean",
    postalCode: "82100",
    addressCountry: "GR",
  },
  geo: {
    latitude: 38.3436,
    longitude: 26.1374,
  },
  images: [
    absoluteUrl(
      "/images/activities/chios.hotels.voulamandis.house_.hero_.image_.webp",
    ),
  ],
  socialProfiles: [
    "https://www.facebook.com/people/Voulamandis-House/100063584320703/",
    "https://www.instagram.com/chioshotels/",
  ],
  amenities: [
    {
      name: "Free WiFi",
      description: "Wireless internet access for guests",
    },
    {
      name: "Air conditioning",
      description: "Air conditioning in the accommodation",
    },
    {
      name: "Private bathroom",
      description: "Private bathroom facilities",
    },
    {
      name: "Flat-screen TV",
      description: "Television in the accommodation",
    },
    {
      name: "Garden and terrace",
      description: "Outdoor garden and terrace areas",
    },
    {
      name: "Parking available",
      description: "Parking available for guests",
    },
    {
      name: "Cleaning service",
      description: "Cleaning service during the stay",
    },
  ] as AmenityInput[],
};

export type BreadcrumbItemInput = {
  name: string;
  path: string;
};

export type WebPageSchemaInput = {
  path: string;
  title: string;
  description: string;
  image?: string;
  breadcrumbs?: BreadcrumbItemInput[];
  pageType?:
    | "WebPage"
    | "AboutPage"
    | "ContactPage"
    | "CollectionPage"
    | "SearchResultsPage";
};

export type ImageSchemaInput = {
  url: string;
  caption?: string;
  alt?: string;
  width?: number;
  height?: number;
};

export type ItemListInput = {
  path: string;
  name: string;
  description?: string;
  items: {
    name: string;
    url: string;
    image?: string;
    description?: string;
  }[];
};

export type FaqInput = {
  path: string;
  questions: {
    question: string;
    answer: string;
  }[];
};

export type OfferInput = {
  name: string;
  url: string;
  price?: number;
  priceCurrency?: string;
  availability?: "InStock" | "LimitedAvailability" | "SoldOut" | "PreOrder";
  validFrom?: string;
  validThrough?: string;
};

export type AccommodationInput = {
  path: string;
  name: string;
  description: string;
  image?: string;
  occupancy?: number;
  bedDescription?: string;
  amenities?: string[];
  offers?: OfferInput[];
};

export type TouristPlaceInput = {
  path: string;
  name: string;
  description: string;
  image?: string;
  addressLocality?: string;
  addressRegion?: string;
  addressCountry?: string;
  latitude?: number;
  longitude?: number;
};

export function schemaId(path: string, id: string): string {
  const cleanId = id.startsWith("#") ? id.slice(1) : id;
  return `${absoluteUrl(path)}#${cleanId}`;
}

export function hotelId(): string {
  return `${siteUrl}/#lodging-business`;
}

export function organizationId(): string {
  return `${siteUrl}/#organization`;
}

export function websiteId(): string {
  return `${siteUrl}/#website`;
}

export function webPageId(path: string): string {
  return schemaId(path, "webpage");
}

export function primaryImageId(path: string): string {
  return schemaId(path, "primaryimage");
}

export function breadcrumbId(path: string): string {
  return schemaId(path, "breadcrumb");
}

export function itemListId(path: string): string {
  return schemaId(path, "itemlist");
}

export function faqId(path: string): string {
  return schemaId(path, "faq");
}

export function buildOrganizationSchema(): SchemaObject {
  return {
    "@type": "Organization",
    "@id": organizationId(),
    name: businessData.name,
    url: businessData.url,
    logo: {
      "@type": "ImageObject",
      url: absoluteUrl("/images/voulamandis-house-og.jpg"),
    },
    sameAs: businessData.socialProfiles,
  };
}


type GlobalSchemaLanguage = "en" | "el" | "de" | "fr" | "it" | "es" | "tr";

const lodgingBusinessLabelsByLanguage: Record<
  GlobalSchemaLanguage,
  {
    description: string;
    addressLocality: string;
    addressRegion: string;
  }
> = {
  en: {
    description:
      "Voulamandis House is a family-run accommodation in Kambos, Chios, offering rooms and apartments close to Chios Town, the airport and the beaches of southern Chios.",
    addressLocality: "Chios",
    addressRegion: "North Aegean",
  },
  el: {
    description:
      "\u03a4\u03bf Voulamandis House \u03b5\u03af\u03bd\u03b1\u03b9 \u03bf\u03b9\u03ba\u03bf\u03b3\u03b5\u03bd\u03b5\u03b9\u03b1\u03ba\u03cc \u03ba\u03b1\u03c4\u03ac\u03bb\u03c5\u03bc\u03b1 \u03c3\u03c4\u03bf\u03bd \u039a\u03ac\u03bc\u03c0\u03bf \u03c4\u03b7\u03c2 \u03a7\u03af\u03bf\u03c5, \u03bc\u03b5 \u03b4\u03c9\u03bc\u03ac\u03c4\u03b9\u03b1 \u03ba\u03b1\u03b9 \u03b4\u03b9\u03b1\u03bc\u03b5\u03c1\u03af\u03c3\u03bc\u03b1\u03c4\u03b1 \u03ba\u03bf\u03bd\u03c4\u03ac \u03c3\u03c4\u03b7\u03bd \u03c0\u03cc\u03bb\u03b7 \u03c4\u03b7\u03c2 \u03a7\u03af\u03bf\u03c5, \u03c4\u03bf \u03b1\u03b5\u03c1\u03bf\u03b4\u03c1\u03cc\u03bc\u03b9\u03bf \u03ba\u03b1\u03b9 \u03c4\u03b9\u03c2 \u03c0\u03b1\u03c1\u03b1\u03bb\u03af\u03b5\u03c2 \u03c4\u03b7\u03c2 \u03bd\u03cc\u03c4\u03b9\u03b1\u03c2 \u03a7\u03af\u03bf\u03c5.",
    addressLocality: "\u03a7\u03af\u03bf\u03c2",
    addressRegion: "\u0392\u03cc\u03c1\u03b5\u03b9\u03bf \u0391\u03b9\u03b3\u03b1\u03af\u03bf",
  },
  de: {
    description:
      "Voulamandis House ist eine familiengef\u00fchrte Unterkunft in Kambos auf Chios mit Zimmern und Apartments nahe der Stadt Chios, dem Flughafen und den Str\u00e4nden im S\u00fcden der Insel.",
    addressLocality: "Chios",
    addressRegion: "N\u00f6rdliche \u00c4g\u00e4is",
  },
  fr: {
    description:
      "Voulamandis House est un h\u00e9bergement familial situ\u00e9 \u00e0 Kambos, \u00e0 Chios, avec des chambres et des appartements proches de la ville de Chios, de l\u2019a\u00e9roport et des plages du sud de l\u2019\u00eele.",
    addressLocality: "Chios",
    addressRegion: "\u00c9g\u00e9e du Nord",
  },
  it: {
    description:
      "Voulamandis House \u00e8 una struttura ricettiva a conduzione familiare a Kambos, Chios, con camere e appartamenti vicino alla citt\u00e0 di Chios, all\u2019aeroporto e alle spiagge del sud dell\u2019isola.",
    addressLocality: "Chios",
    addressRegion: "Egeo Settentrionale",
  },
  es: {
    description:
      "Voulamandis House es un alojamiento familiar en Kambos, Qu\u00edos, con habitaciones y apartamentos cerca de la ciudad de Qu\u00edos, del aeropuerto y de las playas del sur de la isla.",
    addressLocality: "Qu\u00edos",
    addressRegion: "Egeo Septentrional",
  },
  tr: {
    description:
      "Voulamandis House, Sak\u0131z Adas\u0131 Kambos b\u00f6lgesinde yer alan, Sak\u0131z \u015fehrine, havaalan\u0131na ve adan\u0131n g\u00fcney plajlar\u0131na yak\u0131n oda ve daireler sunan aile i\u015fletmesi bir konaklama tesisidir.",
    addressLocality: "Sak\u0131z",
    addressRegion: "Kuzey Ege",
  },
};

function getGlobalSchemaLanguage(path?: string): GlobalSchemaLanguage {
  const language = path ? getLanguageForPath(path) : "en";
  return ["en", "el", "de", "fr", "it", "es", "tr"].includes(language)
    ? (language as GlobalSchemaLanguage)
    : "en";
}

const lodgingBusinessAmenitiesByLanguage: Record<GlobalSchemaLanguage, AmenityInput[]> = {
  en: [
    { name: "Free WiFi", description: "Wireless internet access for guests" },
    { name: "Air conditioning", description: "Air conditioning in the accommodation" },
    { name: "Private bathroom", description: "Private bathroom facilities" },
    { name: "Flat-screen TV", description: "Television in the accommodation" },
    { name: "Garden and terrace", description: "Outdoor garden and terrace areas" },
    { name: "Parking available", description: "Parking available for guests" },
    { name: "Cleaning service", description: "Cleaning service during the stay" },
  ],
  el: [
    { name: "ωρεάν WiFi", description: "σύρματη πρόσβαση στο διαδίκτυο για τους επισκέπτες" },
    { name: "λιματισμός", description: "λιματισμός στα καταλύματα" },
    { name: "διωτικό μπάνιο", description: "διωτικές εγκαταστάσεις μπάνιου" },
    { name: "ηλεόραση επίπεδης οθόνης", description: "ηλεόραση στο κατάλυμα" },
    { name: "ήπος και βεράντα", description: "ξωτερικοί χώροι κήπου και βεράντας" },
    { name: "ιαθέσιμος χώρος στάθμευσης", description: "ώρος στάθμευσης διαθέσιμος για τους επισκέπτες" },
    { name: "πηρεσία καθαριότητας", description: "πηρεσία καθαριότητας κατά τη διάρκεια της διαμονής" },
  ],
  de: [
    { name: "Kostenloses WLAN", description: "Drahtloser Internetzugang für Gäste" },
    { name: "Klimaanlage", description: "Klimaanlage in der Unterkunft" },
    { name: "Eigenes Bad", description: "Private Badezimmereinrichtungen" },
    { name: "Flachbildfernseher", description: "Fernseher in der Unterkunft" },
    { name: "Garten und Terrasse", description: "Außenbereiche mit Garten und Terrasse" },
    { name: "Parkmöglichkeiten", description: "Parkmöglichkeiten für Gäste" },
    { name: "Reinigungsservice", description: "Reinigungsservice während des Aufenthalts" },
  ],
  fr: [
    { name: "Wi-Fi gratuit", description: "Accès Internet sans fil pour les hôtes" },
    { name: "Climatisation", description: "Climatisation dans l’hébergement" },
    { name: "Salle de bain privée", description: "Équipements de salle de bain privée" },
    { name: "Télévision à écran plat", description: "Télévision dans l’hébergement" },
    { name: "Jardin et terrasse", description: "Espaces extérieurs avec jardin et terrasse" },
    { name: "Parking disponible", description: "Parking disponible pour les hôtes" },
    { name: "Service de nettoyage", description: "Service de nettoyage pendant le séjour" },
  ],
  it: [
    { name: "Wi-Fi gratuito", description: "Accesso Internet wireless per gli ospiti" },
    { name: "Aria condizionata", description: "Aria condizionata nell’alloggio" },
    { name: "Bagno privato", description: "Servizi bagno privati" },
    { name: "TV a schermo piatto", description: "Televisione nell’alloggio" },
    { name: "Giardino e terrazza", description: "Spazi esterni con giardino e terrazza" },
    { name: "Parcheggio disponibile", description: "Parcheggio disponibile per gli ospiti" },
    { name: "Servizio di pulizia", description: "Servizio di pulizia durante il soggiorno" },
  ],
  es: [
    { name: "WiFi gratuito", description: "Acceso inalámbrico a Internet para los huéspedes" },
    { name: "Aire acondicionado", description: "Aire acondicionado en el alojamiento" },
    { name: "Baño privado", description: "Instalaciones de baño privado" },
    { name: "Televisión de pantalla plana", description: "Televisión en el alojamiento" },
    { name: "Jardín y terraza", description: "Zonas exteriores con jardín y terraza" },
    { name: "Aparcamiento disponible", description: "Aparcamiento disponible para los huéspedes" },
    { name: "Servicio de limpieza", description: "Servicio de limpieza durante la estancia" },
  ],
  tr: [
    { name: "Ücretsiz WiFi", description: "Misafirler için kablosuz internet erişimi" },
    { name: "Klima", description: "Konaklama birimlerinde klima" },
    { name: "Özel banyo", description: "Özel banyo olanakları" },
    { name: "Düz ekran TV", description: "Konaklama biriminde televizyon" },
    { name: "Bahçe ve teras", description: "Bahçe ve teras alanları" },
    { name: "Otopark mevcut", description: "Misafirler için otopark imkanı" },
    { name: "Temizlik hizmeti", description: "Konaklama sırasında temizlik hizmeti" },
  ],
};

function getLodgingBusinessAmenities(path?: string) {
  return lodgingBusinessAmenitiesByLanguage[getGlobalSchemaLanguage(path)];
}

function getLodgingBusinessLabels(path?: string) {
  return lodgingBusinessLabelsByLanguage[getGlobalSchemaLanguage(path)];
}

export function getLocalizedSchemaAddress(path?: string) {
  const labels = getLodgingBusinessLabels(path);

  return {
    addressLocality: labels.addressLocality,
    addressRegion: labels.addressRegion,
  };
}

export function buildHotelSchema(
  options: { description?: string; path?: string } = {},
): SchemaObject {
  const labels = getLodgingBusinessLabels(options.path);

  return {
    "@type": "LodgingBusiness",
    "@id": hotelId(),
    name: businessData.name,
    url: businessData.url,
    image: businessData.images,
    description: options.description ?? labels.description,
    telephone: businessData.telephone,
    email: businessData.email,
    priceRange: businessData.priceRange,
    address: {
      "@type": "PostalAddress",
      ...businessData.address,
      addressLocality: labels.addressLocality,
      addressRegion: labels.addressRegion,
    },
    geo: {
      "@type": "GeoCoordinates",
      ...businessData.geo,
    },
    parentOrganization: {
      "@id": organizationId(),
    },
    amenityFeature: getLodgingBusinessAmenities(options.path).map((amenity) => ({
      "@type": "LocationFeatureSpecification",
      name: amenity.name,
      description: amenity.description,
      value: true,
    })),
  };
}

export function buildWebsiteSchema(): SchemaObject {
  return {
    "@type": "WebSite",
    "@id": websiteId(),
    url: businessData.url,
    name: businessData.name,
    publisher: {
      "@id": organizationId(),
    },
    inLanguage: ["en", "el", "fr", "de", "it", "es", "tr"],
  };
}

export function buildImageSchema(
  input: ImageSchemaInput,
  pagePath: string,
): SchemaObject {
  return {
    "@type": "ImageObject",
    "@id": primaryImageId(pagePath),
    url: absoluteUrl(input.url),
    contentUrl: absoluteUrl(input.url),
    width: input.width || 1200,
    height: input.height || 675,
    caption: input.caption || input.alt,
  };
}

export function buildBreadcrumbSchema(
  path: string,
  items: BreadcrumbItemInput[],
): SchemaObject {
  const normalizedItems: BreadcrumbItemInput[] = [
    {
      name: "Home",
      path: "/",
    },
    ...items,
  ];

  return {
    "@type": "BreadcrumbList",
    "@id": breadcrumbId(path),
    itemListElement: normalizedItems.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function buildWebPageSchema(input: WebPageSchemaInput): SchemaObject {
  const canonicalUrl = getCanonicalUrl(input.path);
  const language = getLanguageForPath(input.path);

  return {
    "@type": input.pageType || "WebPage",
    "@id": webPageId(input.path),
    url: canonicalUrl,
    name: input.title,
    headline: input.title,
    description: input.description,
    inLanguage: language,
    isPartOf: {
      "@id": websiteId(),
    },
    about: {
      "@id": hotelId(),
    },
    primaryImageOfPage: input.image
      ? {
          "@id": primaryImageId(input.path),
        }
      : undefined,
    breadcrumb: input.breadcrumbs
      ? {
          "@id": breadcrumbId(input.path),
        }
      : undefined,
  };
}

export function buildItemListSchema(input: ItemListInput): SchemaObject {
  return {
    "@type": "ItemList",
    "@id": itemListId(input.path),
    name: input.name,
    description: input.description,
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    numberOfItems: input.items.length,
    itemListElement: input.items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: absoluteUrl(item.url),
      name: item.name,
      image: item.image ? absoluteUrl(item.image) : undefined,
      description: item.description,
    })),
  };
}

export function buildFaqSchema(input: FaqInput): SchemaObject | null {
  const validQuestions = input.questions.filter(
    (item) => item.question.trim() && item.answer.trim(),
  );

  if (!validQuestions.length) {
    return null;
  }

  return {
    "@type": "FAQPage",
    "@id": faqId(input.path),
    mainEntity: validQuestions.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function buildOfferSchema(input: OfferInput): SchemaObject {
  return {
    "@type": "Offer",
    name: input.name,
    url: absoluteUrl(input.url),
    price: input.price,
    priceCurrency: input.priceCurrency || "EUR",
    availability: input.availability
      ? `https://schema.org/${input.availability}`
      : "https://schema.org/InStock",
    validFrom: input.validFrom,
    validThrough: input.validThrough,
    seller: {
      "@id": hotelId(),
    },
  };
}

export function buildAccommodationSchema(
  input: AccommodationInput,
): SchemaObject {
  return {
    "@type": "HotelRoom",
    "@id": schemaId(input.path, "room"),
    name: input.name,
    url: getCanonicalUrl(input.path),
    description: input.description,
    image: input.image ? absoluteUrl(input.image) : undefined,
    containedInPlace: {
      "@id": hotelId(),
    },
    occupancy: input.occupancy
      ? {
          "@type": "QuantitativeValue",
          maxValue: input.occupancy,
        }
      : undefined,
    bed: input.bedDescription,
    amenityFeature: input.amenities?.map((amenity) => ({
      "@type": "LocationFeatureSpecification",
      name: amenity,
      value: true,
    })),
    offers: input.offers?.map(buildOfferSchema),
  };
}

export function buildTouristPlaceSchema(
  input: TouristPlaceInput,
): SchemaObject {
  return {
    "@type": "TouristAttraction",
    "@id": schemaId(input.path, "place"),
    name: input.name,
    url: getCanonicalUrl(input.path),
    description: input.description,
    image: input.image ? absoluteUrl(input.image) : undefined,
    address: {
      "@type": "PostalAddress",
      addressLocality: input.addressLocality || "Chios",
      addressRegion: input.addressRegion || "North Aegean",
      addressCountry: input.addressCountry || "GR",
    },
    geo:
      typeof input.latitude === "number" && typeof input.longitude === "number"
        ? {
            "@type": "GeoCoordinates",
            latitude: input.latitude,
            longitude: input.longitude,
          }
        : undefined,
    touristType: [
      "Leisure travelers",
      "Couples",
      "Families",
      "Cultural travelers",
    ],
  };
}

export function buildSchemaGraph(
  items: Array<SchemaObject | null | undefined>,
): SchemaObject {
  return {
    "@context": "https://schema.org",
    "@graph": items.filter(Boolean) as SchemaObject[],
  };
}

export function buildBasePageSchema(input: WebPageSchemaInput): SchemaObject {
  return buildSchemaGraph([
    buildOrganizationSchema(),
    buildHotelSchema({ path: input.path }),
    buildWebsiteSchema(),
    input.image
      ? buildImageSchema(
          {
            url: input.image,
            alt: input.title,
          },
          input.path,
        )
      : null,
    input.breadcrumbs ? buildBreadcrumbSchema(input.path, input.breadcrumbs) : null,
    buildWebPageSchema(input),
  ]);
}

