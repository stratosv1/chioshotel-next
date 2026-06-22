import type { FindYourRoomPageData } from "@/content/find-your-room";
import {
  absoluteUrl,
  getCanonicalUrl,
  getLanguageForPath,
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
  primaryImageId,
  schemaId,
  webPageId,
  websiteId,
  type SchemaObject,
} from "@/lib/structured-data";

function buildFindYourRoomWebPageSchema(data: FindYourRoomPageData): SchemaObject {
  const canonicalPath = data.seo.canonicalPath;
  const language = getLanguageForPath(canonicalPath);

  return {
    "@type": "SearchResultsPage",
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
      "@id": hotelId(),
    },
    mainEntity: {
      "@id": schemaId(canonicalPath, "room-finder-action"),
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

function buildRoomFinderActionSchema(data: FindYourRoomPageData): SchemaObject {
  const canonicalPath = data.seo.canonicalPath;

  return {
    "@type": "SearchAction",
    "@id": schemaId(canonicalPath, "room-finder-action"),
    name: data.engine.basics.title,
    description: data.hero.description,
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${getCanonicalUrl(canonicalPath)}?checkin={checkin}&checkout={checkout}&guests={guests}&rooms={rooms}`,
      actionPlatform: [
        "https://schema.org/DesktopWebPlatform",
        "https://schema.org/MobileWebPlatform",
      ],
    },
    queryInput: [
      "required name=checkin",
      "required name=checkout",
      "required name=guests",
      "optional name=rooms",
    ],
    object: {
      "@id": hotelId(),
    },
    result: {
      "@id": schemaId(canonicalPath, "room-options"),
    },
  };
}

function buildRoomOptionsItemListSchema(data: FindYourRoomPageData): SchemaObject {
  const canonicalPath = data.seo.canonicalPath;
  const labels = data.engine.roomLabels;

  const roomOptions = [
    {
      name: labels.budgetDoubleRoom,
      description:
        "Budget-friendly double room option at Voulamandis House for guests looking for direct booking value in Chios.",
      url: "/chios-rooms/economy-double-rooms/",
      roomId: "economy-double-rooms",
      tags: [labels.room, labels.budget, labels.wifi, labels.airConditioning],
    },
    {
      name: labels.firstFloorDoubleTriple,
      description:
        "First-floor double or triple room option at Voulamandis House for guests who prefer upper-floor accommodation in Chios.",
      url: "/chios-rooms/standard-double-room/",
      roomId: "standard-double-room-first-floor",
      tags: [
        labels.room,
        labels.firstFloor,
        labels.upperFloorView,
        labels.wifi,
        labels.airConditioning,
      ],
    },
    {
      name: labels.groundFloorDoubleTriple,
      description:
        "Ground-floor double or triple room option at Voulamandis House for guests who prefer easier access and no stairs.",
      url: "/chios-rooms/standard-double-room/",
      roomId: "standard-double-room-ground-floor",
      tags: [
        labels.room,
        labels.groundFloor,
        labels.noStairs,
        labels.wifi,
        labels.airConditioning,
      ],
    },
    {
      name: labels.apartmentType,
      description:
        "Apartment option at Voulamandis House for families or guests who want more space, kitchen facilities and a comfortable stay in Chios.",
      url: "/chios-rooms/family-chios-apartments/",
      roomId: "family-chios-apartments",
      tags: [
        labels.apartment,
        labels.kitchen,
        labels.twoSpaces,
        labels.gardenView,
        labels.airConditioning,
      ],
    },
  ];

  return {
    "@type": "ItemList",
    "@id": schemaId(canonicalPath, "room-options"),
    name: data.engine.results.title,
    description: data.engine.results.noPerfectMatchText,
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    numberOfItems: roomOptions.length,
    itemListElement: roomOptions.map((room, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: room.name,
      description: room.description,
      url: absoluteUrl(room.url),
      item: {
        "@type": "Accommodation",
        "@id": schemaId(room.url, "room"),
        name: room.name,
        url: absoluteUrl(room.url),
        description: room.description,
        containedInPlace: {
          "@id": hotelId(),
        },
        amenityFeature: room.tags.map((tag) => ({
          "@type": "LocationFeatureSpecification",
          name: tag,
          value: true,
        })),
        additionalProperty: {
          "@type": "PropertyValue",
          name: "Room finder option",
          value: room.roomId,
        },
      },
    })),
  };
}

function buildReserveActionSchema(data: FindYourRoomPageData): SchemaObject {
  const canonicalPath = data.seo.canonicalPath;

  return {
    "@type": "ReserveAction",
    "@id": schemaId(canonicalPath, "reserve-action"),
    name: data.engine.contact.whatsapp,
    description: data.engine.contact.subtitle,
    target: {
      "@type": "EntryPoint",
      urlTemplate: getCanonicalUrl(canonicalPath),
      actionPlatform: [
        "https://schema.org/DesktopWebPlatform",
        "https://schema.org/MobileWebPlatform",
      ],
    },
    object: {
      "@id": hotelId(),
    },
    result: {
      "@type": "LodgingReservation",
      name: `${siteName} direct booking request`,
    },
  };
}

function buildDirectBookingBenefitsSchema(data: FindYourRoomPageData): SchemaObject {
  const canonicalPath = data.seo.canonicalPath;

  const benefits = [
    {
      name: data.engine.topBenefits.live,
      description: data.engine.filters.checking,
    },
    {
      name: data.engine.topBenefits.directContact,
      description: data.engine.contact.subtitle,
    },
    {
      name: data.engine.topBenefits.discount,
      description: data.engine.results.bestPriceGuarantee,
    },
    {
      name: data.engine.topBenefits.commissions,
      description: "Direct booking request without third-party commission steps.",
    },
  ];

  return {
    "@type": "ItemList",
    "@id": schemaId(canonicalPath, "direct-booking-benefits"),
    name: "Direct booking benefits",
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    numberOfItems: benefits.length,
    itemListElement: benefits.map((benefit, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: benefit.name,
      description: benefit.description,
    })),
  };
}

export function buildFindYourRoomSchema(data: FindYourRoomPageData) {
  const canonicalPath = data.seo.canonicalPath;

  return buildSchemaGraph([
    buildOrganizationSchema(),
    buildHotelSchema({ path: canonicalPath }),
    buildWebsiteSchema(),
    buildImageSchema(
      {
        url: data.seo.ogImage,
        alt: data.hero.title,
        caption: `${data.hero.title} - ${siteName}`,
      },
      canonicalPath,
    ),
    buildFindYourRoomWebPageSchema(data),
    buildRoomFinderActionSchema(data),
    buildRoomOptionsItemListSchema(data),
    buildDirectBookingBenefitsSchema(data),
    buildReserveActionSchema(data),
    buildBreadcrumbSchema(canonicalPath, [
      {
        name: data.hero.title,
        path: canonicalPath,
      },
    ]),
  ]);
}

