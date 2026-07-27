import type { Metadata } from "next";
import { AccommodationLandingAnalytics } from "@/components/analytics/AccommodationLandingAnalytics";
import { GreekAccommodationPage } from "@/components/landing/GreekAccommodationPage";
import { JsonLd } from "@/components/seo/JsonLd";
import { withTraditionalAccommodationIntent } from "@/content/accommodation-traditional-intent";
import { diamoniStiXioPageEl } from "@/content/diamoni-sti-xio";
import { buildDiamoniStiXioSchema } from "@/content/diamoni-sti-xio-schema";
import { accommodationLandingLanguages } from "@/lib/accommodation-landing-i18n";
import { absoluteUrl, buildPageMetadata } from "@/lib/seo";

const pageData = withTraditionalAccommodationIntent(
  {
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
  },
  "el",
);

const baseMetadata = buildPageMetadata({
  path: pageData.seo.canonicalPath,
  title: "Διαμονή στη Χίο | Voulamandis House",
  description: pageData.seo.description,
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
