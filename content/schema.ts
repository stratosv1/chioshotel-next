import {
  absoluteUrl,
  siteName,
  siteUrl,
} from "@/lib/seo";
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

const homepagePath = "/";

function buildHomeWebPageSchema(): SchemaObject {
  return {
    "@type": "WebPage",
    "@id": webPageId(homepagePath),
    url: siteUrl,
    name: "Voulamandis House - Chios Hotel in Kampos",
    headline: "Voulamandis House - Chios Hotel in Kampos",
    description:
      "Stay at Voulamandis House, a family-run Chios hotel in Kampos with rooms and apartments close to Chios Town, the airport and the beaches of southern Chios.",
    inLanguage: "en",
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
      "@id": schemaId(homepagePath, "breadcrumb"),
    },
    primaryImageOfPage: {
      "@id": schemaId(homepagePath, "primaryimage"),
    },
  };
}

function buildHomeRoomsItemListSchema(): SchemaObject {
  return {
    "@type": "ItemList",
    "@id": itemListId(homepagePath),
    name: "Rooms and apartments at Voulamandis House",
    description:
      "A selection of rooms and apartments at Voulamandis House in Kampos, Chios.",
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    numberOfItems: 3,
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        url: absoluteUrl("/chios-rooms/standard-double-room/"),
        name: "Double Rooms and Triple Rooms in Chios",
        item: {
          "@id": schemaId("/chios-rooms/standard-double-room/", "room"),
        },
      },
      {
        "@type": "ListItem",
        position: 2,
        url: absoluteUrl("/chios-rooms/economy-double-rooms/"),
        name: "Economy Double Rooms in Chios",
        item: {
          "@id": schemaId("/chios-rooms/economy-double-rooms/", "room"),
        },
      },
      {
        "@type": "ListItem",
        position: 3,
        url: absoluteUrl("/chios-rooms/family-chios-apartments/"),
        name: "Family Chios Apartments",
        item: {
          "@id": schemaId("/chios-rooms/family-chios-apartments/", "room"),
        },
      },
    ],
  };
}

function buildHomeRoomReferencesSchema(): SchemaObject[] {
  return [
    {
      "@type": ["Accommodation", "HotelRoom"],
      "@id": schemaId("/chios-rooms/standard-double-room/", "room"),
      name: "Double Rooms and Triple Rooms in Chios",
      url: absoluteUrl("/chios-rooms/standard-double-room/"),
      description:
        "Fully renovated double and triple rooms at Voulamandis House in Kampos, Chios, suitable for up to 4 guests.",
      containedInPlace: {
        "@id": hotelId(),
      },
    },
    {
      "@type": ["Accommodation", "HotelRoom"],
      "@id": schemaId("/chios-rooms/economy-double-rooms/", "room"),
      name: "Economy Double Rooms in Chios",
      url: absoluteUrl("/chios-rooms/economy-double-rooms/"),
      description:
        "Economy double rooms at Voulamandis House in Kampos, Chios, ideal for couples or two guests looking for comfortable value-for-money accommodation.",
      containedInPlace: {
        "@id": hotelId(),
      },
    },
    {
      "@type": ["Accommodation", "HotelRoom"],
      "@id": schemaId("/chios-rooms/family-chios-apartments/", "room"),
      name: "Family Chios Apartments",
      url: absoluteUrl("/chios-rooms/family-chios-apartments/"),
      description:
        "Spacious family apartments at Voulamandis House in Kampos, Chios, with a separate bedroom, kitchen and living area.",
      containedInPlace: {
        "@id": hotelId(),
      },
    },
  ];
}

export const homePageSchema = buildSchemaGraph([
  buildOrganizationSchema(),
  buildHotelSchema(),
  buildWebsiteSchema(),
  buildImageSchema(
    {
      url: "https://chioshotel.gr/wp-content/uploads/2026/03/chios.hotels.voulamandis.house_.hero_.image_.webp",
      alt: "Voulamandis House hotel in Kampos, Chios",
      caption: `${siteName} hotel in Kampos, Chios`,
    },
    homepagePath,
  ),
  buildHomeWebPageSchema(),
  buildHomeRoomsItemListSchema(),
  ...buildHomeRoomReferencesSchema(),
  buildBreadcrumbSchema(homepagePath, []),
]);