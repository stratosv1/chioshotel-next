import type { Metadata } from "next";
import { AccommodationLandingAnalytics } from "@/components/analytics/AccommodationLandingAnalytics";
import { SakizAccommodationPage } from "@/components/landing/SakizAccommodationPage";
import { JsonLd } from "@/components/seo/JsonLd";
import { sakizAdasiKonaklamaPageTr } from "@/content/sakiz-adasi-konaklama";
import { buildSakizAdasiKonaklamaSchema } from "@/content/sakiz-adasi-konaklama-schema";
import { accommodationLandingLanguages } from "@/lib/accommodation-landing-i18n";
import { absoluteUrl, buildPageMetadata } from "@/lib/seo";

const baseMetadata = buildPageMetadata({
  path: sakizAdasiKonaklamaPageTr.seo.canonicalPath,
  title: sakizAdasiKonaklamaPageTr.seo.title,
  description: sakizAdasiKonaklamaPageTr.seo.description,
  image: sakizAdasiKonaklamaPageTr.seo.ogImage,
  imageAlt: sakizAdasiKonaklamaPageTr.seo.ogImageAlt,
});

export const metadata: Metadata = {
  ...baseMetadata,
  alternates: {
    canonical: absoluteUrl(sakizAdasiKonaklamaPageTr.seo.canonicalPath),
    languages: accommodationLandingLanguages(),
  },
};

export default function Page() {
  return (
    <>
      <JsonLd data={buildSakizAdasiKonaklamaSchema(sakizAdasiKonaklamaPageTr)} />
      <SakizAccommodationPage data={sakizAdasiKonaklamaPageTr} />
      <AccommodationLandingAnalytics
        language="tr"
        pathname={sakizAdasiKonaklamaPageTr.seo.canonicalPath}
      />
    </>
  );
}
