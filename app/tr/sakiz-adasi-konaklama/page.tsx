import type { Metadata } from "next";
import { AccommodationLandingAnalytics } from "@/components/analytics/AccommodationLandingAnalytics";
import { SakizAccommodationPage } from "@/components/landing/SakizAccommodationPage";
import { JsonLd } from "@/components/seo/JsonLd";
import { withTraditionalAccommodationIntent } from "@/content/accommodation-traditional-intent";
import { sakizAdasiKonaklamaPageTr } from "@/content/sakiz-adasi-konaklama";
import { buildSakizAdasiKonaklamaSchema } from "@/content/sakiz-adasi-konaklama-schema";
import { accommodationLandingLanguages } from "@/lib/accommodation-landing-i18n";
import { absoluteUrl, buildPageMetadata } from "@/lib/seo";

const pageData = withTraditionalAccommodationIntent(sakizAdasiKonaklamaPageTr, "tr");

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
      <JsonLd data={buildSakizAdasiKonaklamaSchema(pageData)} />
      <SakizAccommodationPage data={pageData} />
      <AccommodationLandingAnalytics
        language="tr"
        pathname={pageData.seo.canonicalPath}
      />
    </>
  );
}
