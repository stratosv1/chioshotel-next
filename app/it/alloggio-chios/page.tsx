import type { Metadata } from "next";
import { AccommodationLandingAnalytics } from "@/components/analytics/AccommodationLandingAnalytics";
import { ItalianAccommodationPage } from "@/components/landing/ItalianAccommodationPage";
import { JsonLd } from "@/components/seo/JsonLd";
import { withTraditionalAccommodationIntent } from "@/content/accommodation-traditional-intent";
import { alloggioChiosPageIt } from "@/content/alloggio-chios";
import { buildAlloggioChiosSchema } from "@/content/alloggio-chios-schema";
import { accommodationLandingLanguages } from "@/lib/accommodation-landing-i18n";
import { absoluteUrl, buildPageMetadata } from "@/lib/seo";

const pageData = withTraditionalAccommodationIntent(alloggioChiosPageIt, "it");

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
      <JsonLd data={buildAlloggioChiosSchema(pageData)} />
      <ItalianAccommodationPage data={pageData} />
      <AccommodationLandingAnalytics
        language="it"
        pathname={pageData.seo.canonicalPath}
      />
    </>
  );
}
