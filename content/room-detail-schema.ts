import type { RoomDetailData } from "@/content/room-details";

function uniqueValues(values: string[]) {
  return Array.from(new Set(values.filter(Boolean)));
}

function getRoomDetailImages(data: RoomDetailData) {
  const heroImage = data.hero.image;
  const ogImage = data.seo.ogImage;

  const galleryImages = data.gallery.images.map((image) => image.src);

  const individualRoomImages = data.individualRooms.rooms.flatMap((room) =>
    room.images.map((image) => image.src),
  );

  return uniqueValues([heroImage, ogImage, ...galleryImages, ...individualRoomImages]);
}

function getIndividualRoomSchemas(data: RoomDetailData, canonicalUrl: string) {
  return data.individualRooms.rooms.map((room) => ({
    "@type": "HotelRoom",
    "@id": `${canonicalUrl}#${room.id}`,
    name: room.name,
    description: room.description,
    url: canonicalUrl,
    image: room.images.map((image) => image.src),
    occupancy: {
      "@type": "QuantitativeValue",
      maxValue: room.maxGuests,
    },
    containedInPlace: {
      "@id": "https://chioshotel.gr/#hotel",
    },
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
    ],
  }));
}

export function buildRoomDetailSchema(data: RoomDetailData) {
  const canonicalUrl = `https://chioshotel.gr${data.seo.canonicalPath}`;
  const allImages = getRoomDetailImages(data);

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "HotelRoom",
        "@id": `${canonicalUrl}#hotelroom`,
        name: data.hero.title,
        description: data.seo.description,
        url: canonicalUrl,
        image: allImages,
        containedInPlace: {
          "@id": "https://chioshotel.gr/#hotel",
        },
        amenityFeature: data.amenities.items.map((item) => ({
          "@type": "LocationFeatureSpecification",
          name: item.label,
          value: true,
          description: item.text,
        })),
        hasPart: data.individualRooms.rooms.map((room) => ({
          "@id": `${canonicalUrl}#${room.id}`,
        })),
      },
      ...getIndividualRoomSchemas(data, canonicalUrl),
      {
        "@type": "BreadcrumbList",
        "@id": `${canonicalUrl}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://chioshotel.gr/",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Chios Rooms",
            item: "https://chioshotel.gr/chios-rooms/",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: data.hero.title,
            item: canonicalUrl,
          },
        ],
      },
      {
        "@type": "FAQPage",
        "@id": `${canonicalUrl}#faq`,
        mainEntity: data.faq.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      },
    ],
  };
}