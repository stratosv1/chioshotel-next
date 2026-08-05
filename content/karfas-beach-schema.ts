import { absoluteUrl, siteName } from "@/lib/seo";
import { karfasBeachEl } from "@/content/karfas-beach-el";

export function buildKarfasBeachSchema() {
  const path = karfasBeachEl.seo.canonicalPath;
  const pageUrl = absoluteUrl(path);
  const imageUrl = absoluteUrl(karfasBeachEl.seo.ogImage);
  const pageId = `${pageUrl}#webpage`;
  const beachId = `${pageUrl}#beach`;
  const imageId = `${pageUrl}#primaryimage`;
  const breadcrumbId = `${pageUrl}#breadcrumb`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": pageId,
        url: pageUrl,
        name: karfasBeachEl.seo.title,
        description: karfasBeachEl.seo.description,
        inLanguage: "el",
        primaryImageOfPage: { "@id": imageId },
        mainEntity: { "@id": beachId },
        breadcrumb: { "@id": breadcrumbId },
      },
      {
        "@type": "ImageObject",
        "@id": imageId,
        url: imageUrl,
        contentUrl: imageUrl,
        caption: karfasBeachEl.hero.title,
        inLanguage: "el",
      },
      {
        "@type": "TouristAttraction",
        "@id": beachId,
        name: "Παραλία Καρφάς Χίου",
        url: pageUrl,
        description: karfasBeachEl.hero.description,
        image: [imageUrl, absoluteUrl(karfasBeachEl.gallery[1].src)],
        isAccessibleForFree: true,
        publicAccess: true,
        touristType: ["Οικογένειες", "Ταξιδιώτες αναψυχής"],
        address: {
          "@type": "PostalAddress",
          addressLocality: "Καρφάς",
          addressRegion: "Χίος",
          addressCountry: "GR",
        },
        hasMap: karfasBeachEl.map.gpsHref,
        provider: {
          "@type": "LodgingBusiness",
          name: siteName,
          url: absoluteUrl("/el/"),
        },
        additionalProperty: karfasBeachEl.quickFacts.map((fact) => ({
          "@type": "PropertyValue",
          name: fact.label,
          value: fact.value,
        })),
      },
      {
        "@type": "BreadcrumbList",
        "@id": breadcrumbId,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Αρχική",
            item: absoluteUrl("/el/"),
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Παραλίες Χίου",
            item: absoluteUrl("/el/paralies-xios/"),
          },
          {
            "@type": "ListItem",
            position: 3,
            name: "Παραλία Καρφάς",
            item: pageUrl,
          },
        ],
      },
    ],
  };
}
