import type { RoomDetailData } from "@/content/room-details";

export function buildRoomDetailSchema(data: RoomDetailData) {
  const canonicalUrl = `https://chioshotel.gr${data.seo.canonicalPath}`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "HotelRoom",
        "@id": `${canonicalUrl}#hotelroom`,
        name: data.hero.title,
        description: data.seo.description,
        url: canonicalUrl,
        image: data.gallery.images.map((image) => image.src),
        containedInPlace: {
          "@id": "https://chioshotel.gr/#hotel",
        },
        amenityFeature: data.amenities.items.map((item) => ({
          "@type": "LocationFeatureSpecification",
          name: item.label,
          value: true,
          description: item.text,
        })),
      },
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