import type { Metadata } from "next";
import { LocalizedChiosHotelsGuideAnalytics } from "@/components/analytics/LocalizedChiosHotelsGuideAnalytics";
import { LocalizedChiosHotelsGuidePage } from "@/components/landing/LocalizedChiosHotelsGuidePage";
import { JsonLd } from "@/components/seo/JsonLd";
import { hotelesChiosGuideEs } from "@/content/hoteles-chios-guide-es";
import { buildLocalizedChiosHotelsGuideSchema } from "@/content/localized-chios-hotels-guide-schema";
import { chiosHotelsGuideLanguages } from "@/lib/chios-hotels-guide-i18n";
import { absoluteUrl, buildPageMetadata } from "@/lib/seo";

const baseMetadata = buildPageMetadata({
  path: hotelesChiosGuideEs.seo.canonicalPath,
  title: hotelesChiosGuideEs.seo.title,
  description: hotelesChiosGuideEs.seo.description,
  image: hotelesChiosGuideEs.seo.image,
  imageAlt: hotelesChiosGuideEs.seo.imageAlt,
});

export const metadata: Metadata = {
  ...baseMetadata,
  alternates: {
    canonical: absoluteUrl(hotelesChiosGuideEs.seo.canonicalPath),
    languages: chiosHotelsGuideLanguages(),
  },
};

export default function Page() {
  return (
    <>
      <JsonLd data={buildLocalizedChiosHotelsGuideSchema(hotelesChiosGuideEs, "es")} />
      <LocalizedChiosHotelsGuidePage data={hotelesChiosGuideEs} locale="es" />
      <LocalizedChiosHotelsGuideAnalytics locale="es" pathname={hotelesChiosGuideEs.seo.canonicalPath} />
    </>
  );
}
