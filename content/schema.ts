import {
  absoluteUrl,
  siteName,
  siteUrl,
} from "@/lib/seo";
import {
  homePageEn,
  type HomePageData,
} from "@/content/home";
import {
  buildBreadcrumbSchema,
  buildHotelSchema,
  buildImageSchema,
  buildOrganizationSchema,
  buildSchemaGraph,
  buildWebsiteSchema,
  hotelId,
  itemListId,
  schemaId,
  webPageId,
  websiteId,
  type SchemaObject,
} from "@/lib/structured-data";

function getHomePageLanguage(canonicalPath: string): string {
  switch (canonicalPath) {
    case "/el/":
      return "el";
    case "/de/":
      return "de";
    case "/fr/":
      return "fr";
    case "/it/":
      return "it";
    case "/es/":
      return "es";
    case "/tr/":
      return "tr";
    case "/":
    default:
      return "en";
  }
}

function buildHomeWebPageSchema(data: HomePageData): SchemaObject {
  const canonicalPath = data.seo.canonicalPath;

  return {
    "@type": "WebPage",
    "@id": webPageId(canonicalPath),
    url: absoluteUrl(canonicalPath),
    name: data.seo.title,
    headline: data.seo.title,
    description: data.seo.description,
    inLanguage: getHomePageLanguage(canonicalPath),
    isPartOf: {
      "@id": websiteId(),
    },
    about: {
      "@id": hotelId(),
    },
    mainEntity: {
      "@id": hotelId(),
    },
    breadcrumb: {
      "@id": schemaId(canonicalPath, "breadcrumb"),
    },
    primaryImageOfPage: {
      "@id": schemaId(canonicalPath, "primaryimage"),
    },
  };
}

function buildHomeRoomsItemListSchema(canonicalPath: string): SchemaObject {
  return {
    "@type": "ItemList",
    "@id": itemListId(canonicalPath),
    name: "Rooms and apartments at Voulamandis House",
    description:
      "A selection of rooms and apartments at Voulamandis House in Kambos, Chios.",
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    numberOfItems: 3,
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        url: absoluteUrl("/chios-rooms/standard-double-room/"),
        name: "Double Rooms and Triple Rooms in Chios",
      },
      {
        "@type": "ListItem",
        position: 2,
        url: absoluteUrl("/chios-rooms/economy-double-rooms/"),
        name: "Economy Double Rooms in Chios",
      },
      {
        "@type": "ListItem",
        position: 3,
        url: absoluteUrl("/chios-rooms/family-chios-apartments/"),
        name: "Family Chios Apartments",
      },
    ],
  };
}

function buildHomeRoomReferencesSchema(): SchemaObject[] {
  return [
    {
      "@type": "HotelRoom",
      "@id": schemaId("/chios-rooms/standard-double-room/", "room"),
      name: "Double Rooms and Triple Rooms in Chios",
      url: absoluteUrl("/chios-rooms/standard-double-room/"),
      description:
        "Fully renovated double and triple rooms at Voulamandis House in Kambos, Chios, suitable for up to 4 guests.",
      containedInPlace: {
        "@id": hotelId(),
      },
    },
    {
      "@type": "HotelRoom",
      "@id": schemaId("/chios-rooms/economy-double-rooms/", "room"),
      name: "Economy Double Rooms in Chios",
      url: absoluteUrl("/chios-rooms/economy-double-rooms/"),
      description:
        "Economy double rooms at Voulamandis House in Kambos, Chios, ideal for couples or two guests looking for comfortable value-for-money accommodation.",
      containedInPlace: {
        "@id": hotelId(),
      },
    },
    {
      "@type": "HotelRoom",
      "@id": schemaId("/chios-rooms/family-chios-apartments/", "room"),
      name: "Family Chios Apartments",
      url: absoluteUrl("/chios-rooms/family-chios-apartments/"),
      description:
        "Spacious family apartments at Voulamandis House in Kambos, Chios, with a separate bedroom, kitchen and living area.",
      containedInPlace: {
        "@id": hotelId(),
      },
    },
  ];
}

export function buildHomePageSchema(data: HomePageData): SchemaObject {
  const canonicalPath = data.seo.canonicalPath;

  return buildSchemaGraph([
    buildOrganizationSchema(),
    buildHotelSchema(),
    buildWebsiteSchema(),
    buildImageSchema(
      {
        url: data.seo.ogImage,
        alt: data.seo.ogImageAlt,
        caption: data.seo.title || data.seo.ogImageAlt || siteName,
      },
      canonicalPath,
    ),
    buildHomeWebPageSchema(data),
    buildHomeRoomsItemListSchema(canonicalPath),
    ...buildHomeRoomReferencesSchema(),
    buildBreadcrumbSchema(canonicalPath, []),
  ]);
}

export const homePageSchema = buildHomePageSchema(homePageEn);