import type { Metadata } from "next";
import { AccommodationLandingAnalytics } from "@/components/analytics/AccommodationLandingAnalytics";
import { SpanishAccommodationPage } from "@/components/landing/SpanishAccommodationPage";
import { JsonLd } from "@/components/seo/JsonLd";
import { alojamientoChiosPageEs } from "@/content/alojamiento-chios";
import { buildAlojamientoChiosSchema } from "@/content/alojamiento-chios-schema";
import { absoluteUrl, buildPageMetadata } from "@/lib/seo";

const baseMetadata = buildPageMetadata({
  path: alojamientoChiosPageEs.seo.canonicalPath,
  title: alojamientoChiosPageEs.seo.title,
  description: alojamientoChiosPageEs.seo.description,
  image: alojamientoChiosPageEs.seo.ogImage,
  imageAlt: alojamientoChiosPageEs.seo.ogImageAlt,
});

export const metadata: Metadata = {
  ...baseMetadata,
  alternates: {
    canonical: absoluteUrl(alojamientoChiosPageEs.seo.canonicalPath),
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
      <JsonLd data={buildAlojamientoChiosSchema(alojamientoChiosPageEs)} />
      <SpanishAccommodationPage data={alojamientoChiosPageEs} />
      <AccommodationLandingAnalytics
        language="es"
        pathname={alojamientoChiosPageEs.seo.canonicalPath}
      />
    </>
  );
}