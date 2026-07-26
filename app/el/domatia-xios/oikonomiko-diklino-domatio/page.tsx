import type { Metadata } from "next";
import { EconomyRoomDetailPage } from "@/components/rooms/EconomyRoomDetailPage";
import { JsonLd } from "@/components/seo/JsonLd";
import { economyDoubleRoomsEl } from "@/content/room-details";
import { buildRoomDetailSchema } from "@/content/room-detail-schema";
import { absoluteUrl, buildPageMetadata, getAlternates, getCanonicalUrl } from "@/lib/seo";

const path = economyDoubleRoomsEl.seo.canonicalPath;
const baseMetadata = buildPageMetadata({
  path,
  title: economyDoubleRoomsEl.seo.title,
  description: economyDoubleRoomsEl.seo.description,
  image: economyDoubleRoomsEl.seo.ogImage,
});

export const metadata: Metadata = {
  ...baseMetadata,
  alternates: {
    canonical: getCanonicalUrl(path),
    languages: {
      ...getAlternates(path),
      pl: absoluteUrl("/pl/pokoje-na-chios/pokoj-dwuosobowy-economy/"),
    },
  },
};

export default function Page() {
  return (
    <>
      <JsonLd data={buildRoomDetailSchema(economyDoubleRoomsEl)} />
      <EconomyRoomDetailPage data={economyDoubleRoomsEl} />
    </>
  );
}
