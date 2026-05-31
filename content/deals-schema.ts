import type { DealsPageData } from "@/content/deals";

export function buildDealsSchema(data: DealsPageData) {
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
        telephone: "+30 22710 31733",
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
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Chios Hotels Offers 2026",
          itemListElement: data.offers.map((offer) => ({
            "@type": "Offer",
            name: offer.title,
            description: offer.description,
            url: offer.bookingHref,
            validThrough: data.countdown.targetIso,
            category: "Accommodation",
            seller: {
              "@id": "https://chioshotel.gr/#hotel",
            },
            itemOffered: {
              "@type": "HotelRoom",
              name: offer.title,
              image: offer.image,
              url: `https://chioshotel.gr${offer.roomPageHref}`,
            },
            additionalProperty: [
              {
                "@type": "PropertyValue",
                name: "Coupon code",
                value: offer.couponCode,
              },
              {
                "@type": "PropertyValue",
                name: "Offer label",
                value: offer.discountLabel,
              },
            ],
          })),
        },
      },
      {
        "@type": "OfferCatalog",
        "@id": `${canonicalUrl}#offer-catalog`,
        name: "Best Chios Travel Deals for Chios Hotels",
        url: canonicalUrl,
        itemListElement: data.offers.map((offer, index) => ({
          "@type": "Offer",
          position: index + 1,
          name: offer.title,
          description: offer.description,
          url: offer.bookingHref,
          validThrough: data.countdown.targetIso,
          category: "Accommodation",
          seller: {
            "@id": "https://chioshotel.gr/#hotel",
          },
          itemOffered: {
            "@type": "HotelRoom",
            name: offer.title,
            image: offer.image,
            url: `https://chioshotel.gr${offer.roomPageHref}`,
          },
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
            name: "Travel Deals",
            item: canonicalUrl,
          },
        ],
      },
    ],
  };
}