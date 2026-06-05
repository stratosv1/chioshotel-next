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
  return data.amenities.items.map((item) => ({
    "@type": "LocationFeatureSpecification",
    name: item.label,
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

function buildBedDescription(room: IndividualRoomData): string | undefined {
  if (!room.beds.length) {
    return undefined;
  }

  return room.beds.join(", ");
}

function buildIndividualRoomSchema(
  room: IndividualRoomData,
  parentData: RoomDetailData,
): SchemaObject {
  const canonicalPath = parentData.seo.canonicalPath;
  const roomUrl = `${getCanonicalUrl(canonicalPath)}#${room.id}`;

  return {
    "@type": "HotelRoom",
    "@id": schemaId(canonicalPath, room.id),
    name: room.name,
    alternateName: room.type,
    url: roomUrl,
    description: room.description,
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
      unitText: "guests",
    },
    bed: buildBedDescription(room),
    amenityFeature: room.amenities.map((amenity) => ({
      "@type": "LocationFeatureSpecification",
      name: amenity.label,
      value: true,
    })),
    additionalProperty: [
      {
        "@type": "PropertyValue",
        name: "Room type",
        value: room.type,
      },
      {
        "@type": "PropertyValue",
        name: "Location",
        value: room.location,
      },
      {
        "@type": "PropertyValue",
        name: "Beds",
        value: room.beds.join(", "),
      },
      {
        "@type": "PropertyValue",
        name: "Highlights",
        value: room.badges.join(", "),
      },
    ].filter((item) => item.value),
  };
}

function buildRoomSchema(data: RoomDetailData): SchemaObject {
  const canonicalPath = data.seo.canonicalPath;
  const maxGuests = getMaxGuests(data);
  const allImages = getRoomDetailImages(data);

  return {
    "@type": "HotelRoom",
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
          unitText: "guests",
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

  return buildSchemaGraph([
    buildOrganizationSchema(),
    buildHotelSchema(),
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
        name: "Chios Rooms",
        path: "/chios-rooms/",
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