import type { Metadata } from "next";
import { AccommodationLandingAnalytics } from "@/components/analytics/AccommodationLandingAnalytics";
import { GreekAccommodationPage } from "@/components/landing/GreekAccommodationPage";
import { JsonLd } from "@/components/seo/JsonLd";
import { diamoniStiXioPageEl } from "@/content/diamoni-sti-xio";
import { buildDiamoniStiXioSchema } from "@/content/diamoni-sti-xio-schema";
import { accommodationLandingLanguages } from "@/lib/accommodation-landing-i18n";
import { absoluteUrl, buildPageMetadata } from "@/lib/seo";

const pageData = {
  ...diamoniStiXioPageEl,
  explore: {
    ...diamoniStiXioPageEl.explore,
    links: [
      ...diamoniStiXioPageEl.explore.links,
      {
        title: "Συγκρίνετε ξενοδοχεία και περιοχές στη Χίο",
        text: "Δείτε τις βασικές περιοχές και τις διαφορές ανάμεσα σε ξενοδοχεία, δωμάτια, οικογενειακά καταλύματα και διαμερίσματα πριν επιλέξετε.",
        href: "/el/xenodoxeia-xios/",
      },
    ],
  },
};

const baseMetadata = buildPageMetadata({
  path: pageData.seo.canonicalPath,
  title: "Διαμονή στη Χίο | Voulamandis House",
  description:
    "Οργανώστε τη διαμονή σας στη Χίο στο Voulamandis House. Δείτε επιλογές δωματίων και διαμερισμάτων, παροχές, τοποθεσία και άμεση διαθεσιμότητα.",
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
      <JsonLd data={buildDiamoniStiXioSchema(pageData)} />
      <GreekAccommodationPage data={pageData} />
      <AccommodationLandingAnalytics
        language="el"
        pathname={pageData.seo.canonicalPath}
      />
    </>
  );
}
