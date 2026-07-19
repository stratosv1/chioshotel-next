import type { Metadata } from "next";
import { LocalizedChiosHotelsGuideAnalytics } from "@/components/analytics/LocalizedChiosHotelsGuideAnalytics";
import { LocalizedChiosHotelsGuidePage } from "@/components/landing/LocalizedChiosHotelsGuidePage";
import { JsonLd } from "@/components/seo/JsonLd";
import { hotelsAufChiosGuide } from "@/content/hotels-auf-chios-guide";
import { buildLocalizedChiosHotelsGuideSchema } from "@/content/localized-chios-hotels-guide-schema";
import { chiosHotelsGuideLanguages } from "@/lib/chios-hotels-guide-i18n";
import { absoluteUrl, buildPageMetadata } from "@/lib/seo";

const baseMetadata = buildPageMetadata({
  path: hotelsAufChiosGuide.seo.canonicalPath,
  title: hotelsAufChiosGuide.seo.title,
  description: hotelsAufChiosGuide.seo.description,
  image: hotelsAufChiosGuide.seo.image,
  imageAlt: hotelsAufChiosGuide.seo.imageAlt,
});

export const metadata: Metadata = {
  ...baseMetadata,
  alternates: {
    canonical: absoluteUrl(hotelsAufChiosGuide.seo.canonicalPath),
    languages: chiosHotelsGuideLanguages(),
  },
};

export default function Page() {
  return (
    <>
      <JsonLd data={buildLocalizedChiosHotelsGuideSchema(hotelsAufChiosGuide, "de")} />
      <LocalizedChiosHotelsGuidePage data={hotelsAufChiosGuide} locale="de" />
      <LocalizedChiosHotelsGuideAnalytics locale="de" pathname={hotelsAufChiosGuide.seo.canonicalPath} />
    </>
  );
}
