import type { RatesPageData } from "@/content/rates";

export function buildRatesSchema(data: RatesPageData) {
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
        about: {
          "@id": "https://chioshotel.gr/#hotel",
        },
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
        amenityFeature: [
          {
            "@type": "LocationFeatureSpecification",
            name: "Direct booking",
            value: true,
          },
          {
            "@type": "LocationFeatureSpecification",
            name: "Free WiFi",
            value: true,
          },
          {
            "@type": "LocationFeatureSpecification",
            name: "Breakfast",
            value: true,
          },
        ],
      },
      {
        "@type": "Offer",
        "@id": `${canonicalUrl}#direct-booking-offer`,
        name: "Direct booking discount at Voulamandis House",
        description: data.discount.text,
        url: canonicalUrl,
        category: "Accommodation",
        seller: {
          "@id": "https://chioshotel.gr/#hotel",
        },
        itemOffered: {
          "@type": "Hotel",
          "@id": "https://chioshotel.gr/#hotel",
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
            name: "Direct Booking",
            item: canonicalUrl,
          },
        ],
      },
    ],
  };
}