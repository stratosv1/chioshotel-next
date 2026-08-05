import type { Metadata } from "next";
import { OrganizedBeachesPage } from "@/components/landing/OrganizedBeachesPage";
import { JsonLd } from "@/components/seo/JsonLd";
import { getNearbyBeachesPageByLocale, nearbyBeachAlternates } from "@/content/nearby-beaches";
import { buildLandingPageSchema } from "@/content/landing-schema";
import { absoluteUrl, buildPageMetadata } from "@/lib/seo";

const sourceData = getNearbyBeachesPageByLocale("el");
const data = {
  ...sourceData,
  highlights: {
    ...sourceData.highlights,
    cards: sourceData.highlights.cards.map((card) =>
      card.name === "Καρφάς"
        ? {
            ...card,
            href: "/el/paralies-xios/paralia-karfas/",
            image: "/images/beaches/karfas-beach-chios.webp",
            tag: "Κοντά στον Κάμπο",
            description: "Αμμώδης οργανωμένη παραλία κοντά στην πόλη, με εύκολη διαδρομή από τον Κάμπο.",
            why: "Καλή όταν θέλετε λιγότερη οδήγηση και ευέλικτο πρόγραμμα.",
          }
        : card,
    ),
  },
};

export const metadata: Metadata = {
  ...buildPageMetadata({ path: data.seo.canonicalPath, title: data.seo.title, description: data.seo.description, image: data.seo.ogImage }),
  alternates: { canonical: absoluteUrl(data.seo.canonicalPath), languages: nearbyBeachAlternates },
};

export default function Page() {
  return <><JsonLd data={buildLandingPageSchema(data)} /><OrganizedBeachesPage data={data} /></>;
}
