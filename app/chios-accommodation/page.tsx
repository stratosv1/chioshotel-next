import type { Metadata } from "next";
import { AccommodationLandingAnalytics } from "@/components/analytics/AccommodationLandingAnalytics";
import { ChiosAccommodationPage } from "@/components/landing/ChiosAccommodationPage";
import { JsonLd } from "@/components/seo/JsonLd";
import { chiosAccommodationPageEn } from "@/content/chios-accommodation";
import { buildChiosAccommodationSchema } from "@/content/chios-accommodation-schema";
import { accommodationLandingLanguages } from "@/lib/accommodation-landing-i18n";
import { absoluteUrl, buildPageMetadata } from "@/lib/seo";

const baseMetadata = buildPageMetadata({
  path: chiosAccommodationPageEn.seo.canonicalPath,
  title: chiosAccommodationPageEn.seo.title,
  description: chiosAccommodationPageEn.seo.description,
  image: chiosAccommodationPageEn.seo.ogImage,
  imageAlt: chiosAccommodationPageEn.seo.ogImageAlt,
});

export const metadata: Metadata = {
  ...baseMetadata,
  alternates: {
    canonical: absoluteUrl(chiosAccommodationPageEn.seo.canonicalPath),
    languages: accommodationLandingLanguages(),
  },
};

export default function Page() {
  return (
    <>
      <JsonLd data={buildChiosAccommodationSchema(chiosAccommodationPageEn)} />
      <ChiosAccommodationPage data={chiosAccommodationPageEn} />
      <AccommodationLandingAnalytics
        language="en"
        pathname={chiosAccommodationPageEn.seo.canonicalPath}
      />
    </>
  );
}
