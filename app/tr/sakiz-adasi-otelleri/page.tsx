import type { Metadata } from "next";
import { LocalizedChiosHotelsGuideAnalytics } from "@/components/analytics/LocalizedChiosHotelsGuideAnalytics";
import { LocalizedChiosHotelsGuidePage } from "@/components/landing/LocalizedChiosHotelsGuidePage";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildLocalizedChiosHotelsGuideSchema } from "@/content/localized-chios-hotels-guide-schema";
import { sakizAdasiOtelleriGuide } from "@/content/sakiz-adasi-otelleri-guide";
import { chiosHotelsGuideLanguages } from "@/lib/chios-hotels-guide-i18n";
import { absoluteUrl, buildPageMetadata } from "@/lib/seo";

const baseMetadata = buildPageMetadata({
  path: sakizAdasiOtelleriGuide.seo.canonicalPath,
  title: sakizAdasiOtelleriGuide.seo.title,
  description: sakizAdasiOtelleriGuide.seo.description,
  image: sakizAdasiOtelleriGuide.seo.image,
  imageAlt: sakizAdasiOtelleriGuide.seo.imageAlt,
});

export const metadata: Metadata = {
  ...baseMetadata,
  alternates: {
    canonical: absoluteUrl(sakizAdasiOtelleriGuide.seo.canonicalPath),
    languages: chiosHotelsGuideLanguages(),
  },
};

export default function Page() {
  return (
    <>
      <JsonLd data={buildLocalizedChiosHotelsGuideSchema(sakizAdasiOtelleriGuide, "tr")} />
      <LocalizedChiosHotelsGuidePage data={sakizAdasiOtelleriGuide} locale="tr" />
      <LocalizedChiosHotelsGuideAnalytics locale="tr" pathname={sakizAdasiOtelleriGuide.seo.canonicalPath} />
    </>
  );
}
