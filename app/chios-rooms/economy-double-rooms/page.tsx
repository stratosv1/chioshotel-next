import type { Metadata } from "next";
import { RoomDetailPage } from "@/components/rooms/RoomDetailPage";
import { JsonLd } from "@/components/seo/JsonLd";
import { economyDoubleRoomsEn } from "@/content/room-details";
import { buildRoomDetailSchema } from "@/content/room-detail-schema";
import { absoluteUrl, buildPageMetadata, getAlternates, getCanonicalUrl } from "@/lib/seo";

const path = economyDoubleRoomsEn.seo.canonicalPath;
const baseMetadata = buildPageMetadata({
  path,
  title: economyDoubleRoomsEn.seo.title,
  description: economyDoubleRoomsEn.seo.description,
  image: economyDoubleRoomsEn.seo.ogImage,
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
      <JsonLd data={buildRoomDetailSchema(economyDoubleRoomsEn)} />
      <RoomDetailPage data={economyDoubleRoomsEn} />
    </>
  );
}
