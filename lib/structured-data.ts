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
  return `${siteUrl}/#hotel`;
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

export function buildHotelSchema(): SchemaObject {
  return {
    "@type": "Hotel",
    "@id": hotelId(),
    name: businessData.name,
    url: businessData.url,
    image: businessData.images,
    description:
      "Voulamandis House is a family-run hotel and guesthouse in Kampos, Chios, offering rooms and apartments close to Chios Town, the airport and the beaches of southern Chios.",
    telephone: businessData.telephone,
    email: businessData.email,
    priceRange: businessData.priceRange,
    address: {
      "@type": "PostalAddress",
      ...businessData.address,
    },
    geo: {
      "@type": "GeoCoordinates",
      ...businessData.geo,
    },
    parentOrganization: {
      "@id": organizationId(),
    },
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
    buildHotelSchema(),
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