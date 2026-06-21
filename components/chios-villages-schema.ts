import type { ChiosVillagesPageData } from "@/content/chios-villages";
import { buildHotelSchema, hotelId } from "@/lib/structured-data";

export function buildChiosVillagesSchema(data: ChiosVillagesPageData) {
  const canonicalUrl = `https://chioshotel.gr${data.seo.canonicalPath}`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${canonicalUrl}#article`,
        headline: data.seo.title,
        description: data.seo.description,
        image: data.seo.ogImage,
        url: canonicalUrl,
        author: {
          "@id": hotelId(),
        },
        publisher: {
          "@type": "Organization",
          "@id": "https://chioshotel.gr/#organization",
          name: "Voulamandis House",
          logo: {
            "@type": "ImageObject",
            url: "/images/site/voula-logo.png",
          },
        },
        mainEntityOfPage: {
          "@id": `${canonicalUrl}#webpage`,
        },
        mainEntity: {
          "@id": `${canonicalUrl}#village-list`,
        },
      },
      {
        "@type": "WebPage",
        "@id": `${canonicalUrl}#webpage`,
        url: canonicalUrl,
        name: data.seo.title,
        description: data.seo.description,
        image: data.seo.ogImage,
        isPartOf: {
          "@id": "https://chioshotel.gr/#website",
        },
        about: [
          {
            "@type": "Place",
            name: "Chios Island",
            address: {
              "@type": "PostalAddress",
              addressRegion: "Chios",
              addressCountry: "GR",
            },
          },
          {
            "@id": hotelId(),
          },
        ],
      },
      {
        "@type": "ItemList",
        "@id": `${canonicalUrl}#village-list`,
        name: "Top Chios Villages",
        numberOfItems: data.villages.length,
        itemListOrder: "https://schema.org/ItemListOrderDescending",
        itemListElement: data.villages.map((village, index) => ({
          "@type": "ListItem",
          position: index + 1,
          item: {
            "@type": "Place",
            name: village.name,
            description: village.description,
            image: village.image,
            url: `https://chioshotel.gr${village.href}`,
            address: {
              "@type": "PostalAddress",
              addressRegion: "Chios",
              addressCountry: "GR",
            },
            additionalProperty: [
              {
                "@type": "PropertyValue",
                name: "Region",
                value: village.region,
              },
              {
                "@type": "PropertyValue",
                name: "Mood",
                value: village.mood,
              },
              {
                "@type": "PropertyValue",
                name: "Tags",
                value: village.badges.join(", "),
              },
            ],
          },
        })),
      },
      buildHotelSchema(),
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
            item: canonicalUrl,
          },
        ],
      },
    ],
  };
}
