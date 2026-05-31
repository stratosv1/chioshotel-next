import type { ChiosIslandPageData } from "@/content/chios-island";

export function buildChiosIslandSchema(data: ChiosIslandPageData) {
  const canonicalUrl = `https://chioshotel.gr${data.seo.canonicalPath}`;

  return {
    "@context": "https://schema.org",
    "@graph": [
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
            "@id": `${canonicalUrl}#chios-island`,
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
        "@type": "TouristDestination",
        "@id": `${canonicalUrl}#destination`,
        name: "Chios Island",
        description: data.seo.description,
        image: data.seo.ogImage,
        touristType: ["Couples", "Families", "Cultural travelers", "Beach travelers"],
        includesAttraction: data.experiences.items.map((item) => ({
          "@type": "TouristAttraction",
          name: item.title,
          description: item.description,
          image: item.image,
          url: `https://chioshotel.gr${item.href}`,
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
            item: canonicalUrl,
          },
        ],
      },
    ],
  };
}