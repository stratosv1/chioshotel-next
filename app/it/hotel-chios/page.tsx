import type { Metadata } from "next";
import { LocalizedChiosHotelsGuideAnalytics } from "@/components/analytics/LocalizedChiosHotelsGuideAnalytics";
import { LocalizedChiosHotelsGuidePage } from "@/components/landing/LocalizedChiosHotelsGuidePage";
import { JsonLd } from "@/components/seo/JsonLd";
import { hotelChiosGuideIt } from "@/content/hotel-chios-guide-it";
import { buildLocalizedChiosHotelsGuideSchema } from "@/content/localized-chios-hotels-guide-schema";
import { chiosHotelsGuideLanguages } from "@/lib/chios-hotels-guide-i18n";
import { absoluteUrl, buildPageMetadata } from "@/lib/seo";

const baseMetadata = buildPageMetadata({
  path: hotelChiosGuideIt.seo.canonicalPath,
  title: hotelChiosGuideIt.seo.title,
  description: hotelChiosGuideIt.seo.description,
  image: hotelChiosGuideIt.seo.image,
  imageAlt: hotelChiosGuideIt.seo.imageAlt,
});

export const metadata: Metadata = {
  ...baseMetadata,
  alternates: {
    canonical: absoluteUrl(hotelChiosGuideIt.seo.canonicalPath),
    languages: chiosHotelsGuideLanguages(),
  },
};

export default function Page() {
  return (
    <>
      <JsonLd data={buildLocalizedChiosHotelsGuideSchema(hotelChiosGuideIt, "it")} />
      <LocalizedChiosHotelsGuidePage data={hotelChiosGuideIt} locale="it" />
      <LocalizedChiosHotelsGuideAnalytics locale="it" pathname={hotelChiosGuideIt.seo.canonicalPath} />
    </>
  );
}
