import type { BeachDetailData } from "@/content/beach-details";

export function buildBeachDetailSchema(beach: BeachDetailData) {
  const canonicalUrl = `https://chioshotel.gr${beach.seo.canonicalPath}`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${canonicalUrl}#webpage`,
        url: canonicalUrl,
        name: beach.seo.title,
        description: beach.seo.description,
        image: beach.seo.ogImage,
        isPartOf: {
          "@id": "https://chioshotel.gr/#website",
        },
        about: {
          "@id": `${canonicalUrl}#beach`,
        },
      },
      {
        "@type": "TouristAttraction",
        "@id": `${canonicalUrl}#beach`,
        name: beach.hero.title,
        description: beach.seo.description,
        image: beach.seo.ogImage,
        url: canonicalUrl,
        touristType: ["Beach travelers", "Couples", "Families", "Nature travelers"],
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
        "@type": "Hotel",
        "@id": "https://chioshotel.gr/#hotel",
        name: "Voulamandis House",
        url: "https://chioshotel.gr/",
        telephone: "+30 694 476 4654",
        image: "https://chioshotel.gr/wp-content/uploads/2026/03/chios.hotels.voulamandis.house_.hero_.image_.webp",
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
            name: "Chios Beaches",
            item: "https://chioshotel.gr/chios/chios-beaches/",
          },
          {
            "@type": "ListItem",
            position: 4,
            name: beach.hero.title,
            item: canonicalUrl,
          },
        ],
      },
    ],
  };
}