import type { ContactPageData } from "@/content/contact";

export function buildContactSchema(data: ContactPageData) {
  const canonicalUrl = `https://chioshotel.gr${data.seo.canonicalPath}`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ContactPage",
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
        email: data.form.email,
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
        contactPoint: [
          {
            "@type": "ContactPoint",
            telephone: "+30 22710 31733",
            contactType: "customer service",
            availableLanguage: ["English", "Greek"],
          },
          {
            "@type": "ContactPoint",
            telephone: "+30 694 447 4226",
            contactType: "customer service",
            availableLanguage: ["English", "Greek"],
          },
        ],
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
            name: "Contact",
            item: canonicalUrl,
          },
        ],
      },
    ],
  };
}