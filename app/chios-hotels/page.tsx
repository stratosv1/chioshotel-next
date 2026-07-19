import type { Metadata } from "next";
import { ChiosHotelsGuideAnalytics } from "@/components/analytics/ChiosHotelsGuideAnalytics";
import { ChiosHotelsGuidePage } from "@/components/landing/ChiosHotelsGuidePage";
import { JsonLd } from "@/components/seo/JsonLd";
import { chiosHotelsGuide } from "@/content/chios-hotels-guide";
import { buildChiosHotelsGuideSchema } from "@/content/chios-hotels-guide-schema";
import { absoluteUrl, buildPageMetadata } from "@/lib/seo";

const baseMetadata = buildPageMetadata({
  path: chiosHotelsGuide.seo.canonicalPath,
  title: chiosHotelsGuide.seo.title,
  description: chiosHotelsGuide.seo.description,
  image: chiosHotelsGuide.seo.image,
  imageAlt: chiosHotelsGuide.seo.imageAlt,
});

export const metadata: Metadata = {
  ...baseMetadata,
  alternates: {
    canonical: absoluteUrl(chiosHotelsGuide.seo.canonicalPath),
    languages: {
      en: absoluteUrl(chiosHotelsGuide.seo.canonicalPath),
      "x-default": absoluteUrl(chiosHotelsGuide.seo.canonicalPath),
    },
  },
};

export default function Page() {
  return (
    <>
      <JsonLd data={buildChiosHotelsGuideSchema(chiosHotelsGuide)} />
      <ChiosHotelsGuidePage data={chiosHotelsGuide} />
      <ChiosHotelsGuideAnalytics />
    </>
  );
}
