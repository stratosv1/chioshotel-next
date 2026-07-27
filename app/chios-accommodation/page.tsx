import type { Metadata } from "next";
import { AccommodationLandingAnalytics } from "@/components/analytics/AccommodationLandingAnalytics";
import { ChiosAccommodationPage } from "@/components/landing/ChiosAccommodationPage";
import { JsonLd } from "@/components/seo/JsonLd";
import { withTraditionalAccommodationIntent } from "@/content/accommodation-traditional-intent";
import { chiosAccommodationPageEn } from "@/content/chios-accommodation";
import { buildChiosAccommodationSchema } from "@/content/chios-accommodation-schema";
import { accommodationLandingLanguages } from "@/lib/accommodation-landing-i18n";
import { absoluteUrl, buildPageMetadata } from "@/lib/seo";

const pageData = withTraditionalAccommodationIntent(chiosAccommodationPageEn, "en");

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
      <JsonLd data={buildChiosAccommodationSchema(pageData)} />
      <ChiosAccommodationPage data={pageData} />
      <AccommodationLandingAnalytics
        language="en"
        pathname={pageData.seo.canonicalPath}
      />
    </>
  );
}
