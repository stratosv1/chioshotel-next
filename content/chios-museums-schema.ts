import type { ChiosMuseumsPageData } from "@/content/chios-museums";

export function buildChiosMuseumsSchema(data: ChiosMuseumsPageData) {
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
          "@id": "https://chioshotel.gr/#hotel",
        },
        publisher: {
          "@type": "Organization",
          "@id": "https://chioshotel.gr/#organization",
          name: "Voulamandis House",
          logo: {
            "@type": "ImageObject",
            url: "https://chioshotel.gr/wp-content/uploads/voula-logo.png",
          },
        },
        mainEntityOfPage: {
          "@id": `${canonicalUrl}#webpage`,
        },
        mainEntity: {
          "@id": `${canonicalUrl}#museum-list`,
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
            "@id": "https://chioshotel.gr/#hotel",
          },
        ],
      },
      {
        "@type": "ItemList",
        "@id": `${canonicalUrl}#museum-list`,
        name: "Top Chios Museums",
        numberOfItems: data.museums.length,
        itemListOrder: "https://schema.org/ItemListOrderDescending",
        itemListElement: data.museums.map((museum, index) => ({
          "@type": "ListItem",
          position: index + 1,
          item: {
            "@type": "Museum",
            name: museum.name,
            description: museum.description,
            image: museum.image,
            url: `https://chioshotel.gr${museum.href}`,
            address: {
              "@type": "PostalAddress",
              addressRegion: "Chios",
              addressCountry: "GR",
            },
            additionalProperty: [
              {
                "@type": "PropertyValue",
                name: "Region",
                value: museum.region,
              },
              {
                "@type": "PropertyValue",
                name: "Theme",
                value: museum.mood,
              },
              {
                "@type": "PropertyValue",
                name: "Tags",
                value: museum.badges.join(", "),
              },
            ],
          },
        })),
      },
      {
        "@type": "Hotel",
        "@id": "https://chioshotel.gr/#hotel",
        name: "Voulamandis House",
        url: "https://chioshotel.gr/",
        telephone: "+30 694 476 4654",
        image: data.seo.ogImage,
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
            item: canonicalUrl,
          },
        ],
      },
    ],
  };
}