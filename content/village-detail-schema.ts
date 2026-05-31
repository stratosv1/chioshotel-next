import type { VillageDetailData } from "@/content/village-details";

export function buildVillageDetailSchema(village: VillageDetailData) {
  const canonicalUrl = `https://chioshotel.gr${village.seo.canonicalPath}`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${canonicalUrl}#webpage`,
        url: canonicalUrl,
        name: village.seo.title,
        description: village.seo.description,
        image: village.seo.ogImage,
        isPartOf: {
          "@id": "https://chioshotel.gr/#website",
        },
        about: {
          "@id": `${canonicalUrl}#village`,
        },
      },
      {
        "@type": "TouristAttraction",
        "@id": `${canonicalUrl}#village`,
        name: village.hero.title,
        description: village.seo.description,
        image: village.seo.ogImage,
        url: canonicalUrl,
        touristType: [
          "Culture travelers",
          "History travelers",
          "Couples",
          "Families",
          "Nature travelers",
        ],
        address: {
          "@type": "PostalAddress",
          addressRegion: "Chios",
          addressCountry: "GR",
        },
        isAccessibleForFree: true,
        mainEntityOfPage: {
          "@id": `${canonicalUrl}#webpage`,
        },
      },
      {
        "@type": "ItemList",
        "@id": `${canonicalUrl}#highlights`,
        name: village.highlights.title,
        numberOfItems: village.highlights.items.length,
        itemListElement: village.highlights.items.map((item, index) => ({
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
            name: "Chios Villages",
            item: "https://chioshotel.gr/chios/chios-villages/",
          },
          {
            "@type": "ListItem",
            position: 4,
            name: village.hero.title,
            item: canonicalUrl,
          },
        ],
      },
    ],
  };
}