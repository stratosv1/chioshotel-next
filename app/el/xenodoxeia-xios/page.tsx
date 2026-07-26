import type { Metadata } from "next";
import { LocalizedChiosHotelsGuideAnalytics } from "@/components/analytics/LocalizedChiosHotelsGuideAnalytics";
import { LocalizedChiosHotelsGuidePage } from "@/components/landing/LocalizedChiosHotelsGuidePage";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildLocalizedChiosHotelsGuideSchema } from "@/content/localized-chios-hotels-guide-schema";
import { xenodoxeiaXiosGuide } from "@/content/xenodoxeia-xios-guide";
import { chiosHotelsGuideLanguages } from "@/lib/chios-hotels-guide-i18n";
import { absoluteUrl, buildPageMetadata } from "@/lib/seo";

const greekHotelGuideData = {
  ...xenodoxeiaXiosGuide,
  seo: {
    ...xenodoxeiaXiosGuide.seo,
    title: "Ξενοδοχεία στη Χίο | Περιοχές, Τιμές & Πού να Μείνετε",
    description:
      "Ψάχνετε ξενοδοχεία στη Χίο; Συγκρίνετε περιοχές, τύπους διαμονής, δωμάτια και διαμερίσματα και δείτε ποια επιλογή ταιριάζει καλύτερα στο ταξίδι σας.",
  },
  hero: {
    ...xenodoxeiaXiosGuide.hero,
    title: "Ξενοδοχεία στη Χίο: πού να μείνετε, περιοχές και επιλογές διαμονής",
  },
};

const baseMetadata = buildPageMetadata({
  path: greekHotelGuideData.seo.canonicalPath,
  title: greekHotelGuideData.seo.title,
  description: greekHotelGuideData.seo.description,
  image: greekHotelGuideData.seo.image,
  imageAlt: greekHotelGuideData.seo.imageAlt,
});

export const metadata: Metadata = {
  ...baseMetadata,
  alternates: {
    canonical: absoluteUrl(greekHotelGuideData.seo.canonicalPath),
    languages: chiosHotelsGuideLanguages(),
  },
};

export default function Page() {
  return (
    <>
      <JsonLd data={buildLocalizedChiosHotelsGuideSchema(greekHotelGuideData, "el")} />
      <LocalizedChiosHotelsGuidePage data={greekHotelGuideData} locale="el" />
      <LocalizedChiosHotelsGuideAnalytics locale="el" pathname={greekHotelGuideData.seo.canonicalPath} />
    </>
  );
}
