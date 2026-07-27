import type { Metadata } from "next";
import { AccommodationLandingAnalytics } from "@/components/analytics/AccommodationLandingAnalytics";
import { GermanAccommodationPage } from "@/components/landing/GermanAccommodationPage";
import { JsonLd } from "@/components/seo/JsonLd";
import { withTraditionalAccommodationIntent } from "@/content/accommodation-traditional-intent";
import { chiosUnterkunftPageDe } from "@/content/chios-unterkunft";
import { buildChiosUnterkunftSchema } from "@/content/chios-unterkunft-schema";
import { accommodationLandingLanguages } from "@/lib/accommodation-landing-i18n";
import { absoluteUrl, buildPageMetadata } from "@/lib/seo";

const pageData = withTraditionalAccommodationIntent(chiosUnterkunftPageDe, "de");

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
      <JsonLd data={buildChiosUnterkunftSchema(pageData)} />
      <GermanAccommodationPage data={pageData} />
      <AccommodationLandingAnalytics
        language="de"
        pathname={pageData.seo.canonicalPath}
      />
    </>
  );
}
