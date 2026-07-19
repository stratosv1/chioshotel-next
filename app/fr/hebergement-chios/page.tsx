import type { Metadata } from "next";
import { AccommodationLandingAnalytics } from "@/components/analytics/AccommodationLandingAnalytics";
import { FrenchAccommodationPage } from "@/components/landing/FrenchAccommodationPage";
import { JsonLd } from "@/components/seo/JsonLd";
import { hebergementChiosPageFr } from "@/content/hebergement-chios";
import { buildHebergementChiosSchema } from "@/content/hebergement-chios-schema";
import { absoluteUrl, buildPageMetadata } from "@/lib/seo";

const baseMetadata = buildPageMetadata({
  path: hebergementChiosPageFr.seo.canonicalPath,
  title: hebergementChiosPageFr.seo.title,
  description: hebergementChiosPageFr.seo.description,
  image: hebergementChiosPageFr.seo.ogImage,
  imageAlt: hebergementChiosPageFr.seo.ogImageAlt,
});

export const metadata: Metadata = {
  ...baseMetadata,
  alternates: {
    canonical: absoluteUrl(hebergementChiosPageFr.seo.canonicalPath),
    languages: {
      en: absoluteUrl("/chios-accommodation/"),
      el: absoluteUrl("/el/diamoni-sti-xio/"),
      fr: absoluteUrl("/fr/hebergement-chios/"),
      de: absoluteUrl("/de/chios-unterkunft/"),
      it: absoluteUrl("/it/alloggio-chios/"),
      es: absoluteUrl("/es/alojamiento-chios/"),
      tr: absoluteUrl("/tr/sakiz-adasi-konaklama/"),
      "x-default": absoluteUrl("/chios-accommodation/"),
    },
  },
};

export default function Page() {
  return (
    <>
      <JsonLd data={buildHebergementChiosSchema(hebergementChiosPageFr)} />
      <FrenchAccommodationPage data={hebergementChiosPageFr} />
      <AccommodationLandingAnalytics
        language="fr"
        pathname={hebergementChiosPageFr.seo.canonicalPath}
      />
    </>
  );
}