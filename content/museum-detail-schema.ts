import type { MuseumDetailData } from "@/content/museum-details";

export function buildMuseumDetailSchema(museum: MuseumDetailData) {
  const canonicalUrl = `https://chioshotel.gr${museum.seo.canonicalPath}`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${canonicalUrl}#webpage`,
        url: canonicalUrl,
        name: museum.seo.title,
        description: museum.seo.description,
        image: museum.seo.ogImage,
        isPartOf: {
          "@id": "https://chioshotel.gr/#website",
        },
        about: {
          "@id": `${canonicalUrl}#museum`,
        },
      },
      {
        "@type": "Museum",
        "@id": `${canonicalUrl}#museum`,
        name: museum.hero.title,
        description: museum.seo.description,
        image: museum.seo.ogImage,
        url: canonicalUrl,
        touristType: [
          "Culture travelers",
          "History travelers",
          "Couples",
          "Families",
          "Museum visitors",
        ],
        address: {
          "@type": "PostalAddress",
          addressRegion: "Chios",
          addressCountry: "GR",
        },
        isAccessibleForFree: false,
        mainEntityOfPage: {
          "@id": `${canonicalUrl}#webpage`,
        },
      },
      {
        "@type": "ItemList",
        "@id": `${canonicalUrl}#highlights`,
        name: museum.highlights.title,
        numberOfItems: museum.highlights.items.length,
        itemListElement: museum.highlights.items.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item,
        })),
      },
      {
        "@type": "Hotel",
        "@id": "https://chioshotel.gr/#hotel",
        name: "Voulamandis House",
        url: "https://chioshotel.gr/",
        telephone: "+30 694 476 4654",
        image:
          "https://chioshotel.gr/wp-content/uploads/2026/03/chios.hotels.voulamandis.house_.hero_.image_.webp",
        priceRange: "€€",
        address: {
          "@type": "PostalAddress",
          streetAddress: "Kalvokoressi 117",
          addressLocality: "Kampos",
          addressRegion: "Chios",
          postalCode: "82100",
          addressCountry: "GR",
        },
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
            name: "Chios Island",
            item: "https://chioshotel.gr/chios-island/",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: "Chios Museums",
            item: "https://chioshotel.gr/chios/chios-museums/",
          },
          {
            "@type": "ListItem",
            position: 4,
            name: museum.hero.title,
            item: canonicalUrl,
          },
        ],
      },
    ],
  };
}