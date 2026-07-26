import type { Metadata } from "next";
import { EconomyRoomDetailPage } from "@/components/rooms/EconomyRoomDetailPage";
import { JsonLd } from "@/components/seo/JsonLd";
import { economyDoubleRoomsTr } from "@/content/room-details";
import { buildRoomDetailSchema } from "@/content/room-detail-schema";
import { absoluteUrl, buildPageMetadata, getAlternates, getCanonicalUrl } from "@/lib/seo";

const path = economyDoubleRoomsTr.seo.canonicalPath;
const baseMetadata = buildPageMetadata({ path, title: economyDoubleRoomsTr.seo.title, description: economyDoubleRoomsTr.seo.description, image: economyDoubleRoomsTr.seo.ogImage });

export const metadata: Metadata = {
  ...baseMetadata,
  alternates: { canonical: getCanonicalUrl(path), languages: { ...getAlternates(path), pl: absoluteUrl("/pl/pokoje-na-chios/pokoj-dwuosobowy-economy/") } },
};

export default function Page() {
  return <><JsonLd data={buildRoomDetailSchema(economyDoubleRoomsTr)} /><EconomyRoomDetailPage data={economyDoubleRoomsTr} /></>;
}
