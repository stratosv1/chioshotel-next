import type { Metadata } from "next";
import { OrganizedBeachesPage } from "@/components/landing/OrganizedBeachesPage";
import { JsonLd } from "@/components/seo/JsonLd";
import { getOrganizedBeachesPageByLocale, organizedBeachAlternates } from "@/content/organized-beaches";
import { buildLandingPageSchema } from "@/content/landing-schema";
import { absoluteUrl, buildPageMetadata } from "@/lib/seo";

const sourceData = getOrganizedBeachesPageByLocale("el");
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
            tag: "Πλήρως οργανωμένη",
            description: "Αμμώδης παραλία με ξαπλώστρες, ομπρέλες, beach bars, φαγητό και θαλάσσιες δραστηριότητες.",
            why: "Καλή όταν θέλετε όλες τις βασικές υπηρεσίες δίπλα στη θάλασσα.",
          }
        : card,
    ),
  },
};

export const metadata: Metadata = {
  ...buildPageMetadata({ path: data.seo.canonicalPath, title: data.seo.title, description: data.seo.description, image: data.seo.ogImage }),
  alternates: { canonical: absoluteUrl(data.seo.canonicalPath), languages: organizedBeachAlternates },
};

export default function Page() {
  return <><JsonLd data={buildLandingPageSchema(data)} /><OrganizedBeachesPage data={data} /></>;
}
