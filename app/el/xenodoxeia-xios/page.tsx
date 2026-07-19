import type { Metadata } from "next";
import { LocalizedChiosHotelsGuideAnalytics } from "@/components/analytics/LocalizedChiosHotelsGuideAnalytics";
import { LocalizedChiosHotelsGuidePage } from "@/components/landing/LocalizedChiosHotelsGuidePage";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildLocalizedChiosHotelsGuideSchema } from "@/content/localized-chios-hotels-guide-schema";
import { xenodoxeiaXiosGuide } from "@/content/xenodoxeia-xios-guide";
import { chiosHotelsGuideLanguages } from "@/lib/chios-hotels-guide-i18n";
import { absoluteUrl, buildPageMetadata } from "@/lib/seo";

const baseMetadata = buildPageMetadata({
  path: xenodoxeiaXiosGuide.seo.canonicalPath,
  title: xenodoxeiaXiosGuide.seo.title,
  description: xenodoxeiaXiosGuide.seo.description,
  image: xenodoxeiaXiosGuide.seo.image,
  imageAlt: xenodoxeiaXiosGuide.seo.imageAlt,
});

export const metadata: Metadata = {
  ...baseMetadata,
  alternates: {
    canonical: absoluteUrl(xenodoxeiaXiosGuide.seo.canonicalPath),
    languages: chiosHotelsGuideLanguages(),
  },
};

export default function Page() {
  return (
    <>
      <JsonLd data={buildLocalizedChiosHotelsGuideSchema(xenodoxeiaXiosGuide, "el")} />
      <LocalizedChiosHotelsGuidePage data={xenodoxeiaXiosGuide} locale="el" />
      <LocalizedChiosHotelsGuideAnalytics locale="el" pathname={xenodoxeiaXiosGuide.seo.canonicalPath} />
    </>
  );
}
