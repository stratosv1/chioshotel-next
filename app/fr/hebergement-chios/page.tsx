import type { Metadata } from "next";
import { AccommodationLandingAnalytics } from "@/components/analytics/AccommodationLandingAnalytics";
import { FrenchAccommodationPage } from "@/components/landing/FrenchAccommodationPage";
import { JsonLd } from "@/components/seo/JsonLd";
import { withTraditionalAccommodationIntent } from "@/content/accommodation-traditional-intent";
import { hebergementChiosPageFr } from "@/content/hebergement-chios";
import { buildHebergementChiosSchema } from "@/content/hebergement-chios-schema";
import { accommodationLandingLanguages } from "@/lib/accommodation-landing-i18n";
import { absoluteUrl, buildPageMetadata } from "@/lib/seo";

const pageData = withTraditionalAccommodationIntent(hebergementChiosPageFr, "fr");

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
      <JsonLd data={buildHebergementChiosSchema(pageData)} />
      <FrenchAccommodationPage data={pageData} />
      <AccommodationLandingAnalytics
        language="fr"
        pathname={pageData.seo.canonicalPath}
      />
    </>
  );
}
