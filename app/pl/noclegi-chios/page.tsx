import type { Metadata } from "next";
import { ChiosAccommodationPage } from "@/components/landing/ChiosAccommodationPage";
import { JsonLd } from "@/components/seo/JsonLd";
import { localizePolishCommercialSchema } from "@/content/commercial-schema-pl";
import { chiosAccommodationPagePl } from "@/content/chios-accommodation-pl";
import { buildChiosAccommodationSchema } from "@/content/chios-accommodation-schema";
import { buildPolishPageMetadata } from "@/lib/seo-pl";

const accommodationData = {
  ...chiosAccommodationPagePl,
  rooms: {
    ...chiosAccommodationPagePl.rooms,
    cards: chiosAccommodationPagePl.rooms.cards.map((card) =>
      card.id === "family-apartments"
        ? { ...card, href: "/pl/apartamenty-na-chios/" }
        : card,
    ),
  },
};

export const metadata: Metadata = buildPolishPageMetadata({
  path: accommodationData.seo.canonicalPath,
  title: accommodationData.seo.title,
  description: accommodationData.seo.description,
  image: accommodationData.seo.ogImage,
  imageAlt: accommodationData.seo.ogImageAlt,
});

const schema = localizePolishCommercialSchema(buildChiosAccommodationSchema(accommodationData), {
  breadcrumbs: [
    { name: "Strona główna", path: "/pl/" },
    { name: "Noclegi na Chios", path: "/pl/noclegi-chios/" },
  ],
});

export default function PolishAccommodationPage() {
  return (
    <>
      <JsonLd data={schema} />
      <ChiosAccommodationPage data={accommodationData} />
    </>
  );
}
