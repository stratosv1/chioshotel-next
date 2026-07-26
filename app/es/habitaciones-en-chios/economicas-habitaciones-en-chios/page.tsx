import type { Metadata } from "next";
import { EconomyRoomDetailPage } from "@/components/rooms/EconomyRoomDetailPage";
import { JsonLd } from "@/components/seo/JsonLd";
import { economyDoubleRoomsEs } from "@/content/room-details";
import { buildRoomDetailSchema } from "@/content/room-detail-schema";
import { absoluteUrl, buildPageMetadata, getAlternates, getCanonicalUrl } from "@/lib/seo";

const path = economyDoubleRoomsEs.seo.canonicalPath;
const baseMetadata = buildPageMetadata({ path, title: economyDoubleRoomsEs.seo.title, description: economyDoubleRoomsEs.seo.description, image: economyDoubleRoomsEs.seo.ogImage });

export const metadata: Metadata = {
  ...baseMetadata,
  alternates: { canonical: getCanonicalUrl(path), languages: { ...getAlternates(path), pl: absoluteUrl("/pl/pokoje-na-chios/pokoj-dwuosobowy-economy/") } },
};

export default function Page() {
  return <><JsonLd data={buildRoomDetailSchema(economyDoubleRoomsEs)} /><EconomyRoomDetailPage data={economyDoubleRoomsEs} /></>;
}
