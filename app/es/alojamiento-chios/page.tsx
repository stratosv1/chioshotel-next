import type { Metadata } from "next";
import { AccommodationLandingAnalytics } from "@/components/analytics/AccommodationLandingAnalytics";
import { SpanishAccommodationPage } from "@/components/landing/SpanishAccommodationPage";
import { JsonLd } from "@/components/seo/JsonLd";
import { withTraditionalAccommodationIntent } from "@/content/accommodation-traditional-intent";
import { alojamientoChiosPageEs } from "@/content/alojamiento-chios";
import { buildAlojamientoChiosSchema } from "@/content/alojamiento-chios-schema";
import { accommodationLandingLanguages } from "@/lib/accommodation-landing-i18n";
import { absoluteUrl, buildPageMetadata } from "@/lib/seo";

const pageData = withTraditionalAccommodationIntent(alojamientoChiosPageEs, "es");

const baseMetadata = buildPageMetadata({
  path: pageData.seo.canonicalPath,
  title: pageData.seo.title,
  description: pageData.seo.description,
  image: pageData.seo.ogImage,
  imageAlt: pageData.seo.ogImageAlt,
});

export const metadata: Metadata = {
  ...baseMetadata,
  alternates: {
    canonical: absoluteUrl(pageData.seo.canonicalPath),
    languages: accommodationLandingLanguages(),
  },
};

export default function Page() {
  return (
    <>
      <JsonLd data={buildAlojamientoChiosSchema(pageData)} />
      <SpanishAccommodationPage data={pageData} />
      <AccommodationLandingAnalytics
        language="es"
        pathname={pageData.seo.canonicalPath}
      />
    </>
  );
}
