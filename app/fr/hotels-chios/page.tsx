import type { Metadata } from "next";
import { LocalizedChiosHotelsGuideAnalytics } from "@/components/analytics/LocalizedChiosHotelsGuideAnalytics";
import { LocalizedChiosHotelsGuidePage } from "@/components/landing/LocalizedChiosHotelsGuidePage";
import { JsonLd } from "@/components/seo/JsonLd";
import { hotelsChiosGuideFr } from "@/content/hotels-chios-guide-fr";
import { buildLocalizedChiosHotelsGuideSchema } from "@/content/localized-chios-hotels-guide-schema";
import { chiosHotelsGuideLanguages } from "@/lib/chios-hotels-guide-i18n";
import { absoluteUrl, buildPageMetadata } from "@/lib/seo";

const baseMetadata = buildPageMetadata({
  path: hotelsChiosGuideFr.seo.canonicalPath,
  title: hotelsChiosGuideFr.seo.title,
  description: hotelsChiosGuideFr.seo.description,
  image: hotelsChiosGuideFr.seo.image,
  imageAlt: hotelsChiosGuideFr.seo.imageAlt,
});

export const metadata: Metadata = {
  ...baseMetadata,
  alternates: {
    canonical: absoluteUrl(hotelsChiosGuideFr.seo.canonicalPath),
    languages: chiosHotelsGuideLanguages(),
  },
};

export default function Page() {
  return (
    <>
      <JsonLd data={buildLocalizedChiosHotelsGuideSchema(hotelsChiosGuideFr, "fr")} />
      <LocalizedChiosHotelsGuidePage data={hotelsChiosGuideFr} locale="fr" />
      <LocalizedChiosHotelsGuideAnalytics locale="fr" pathname={hotelsChiosGuideFr.seo.canonicalPath} />
    </>
  );
}
