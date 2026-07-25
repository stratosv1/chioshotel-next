import type { Metadata } from "next";
import { RoomDetailPage } from "@/components/rooms/RoomDetailPage";
import { JsonLd } from "@/components/seo/JsonLd";
import { standardDoubleRoom } from "@/content/room-details";
import { buildRoomDetailSchema } from "@/content/room-detail-schema";
import { absoluteUrl, buildPageMetadata, getAlternates, getCanonicalUrl } from "@/lib/seo";

const path = standardDoubleRoom.seo.canonicalPath;
const baseMetadata = buildPageMetadata({
  path,
  title: standardDoubleRoom.seo.title,
  description: standardDoubleRoom.seo.description,
  image: standardDoubleRoom.seo.ogImage,
});

export const metadata: Metadata = {
  ...baseMetadata,
  alternates: {
    canonical: getCanonicalUrl(path),
    languages: {
      ...getAlternates(path),
      pl: absoluteUrl("/pl/pokoje-na-chios/pokoje-standardowe/"),
    },
  },
};

export default function Page() {
  return (
    <>
      <JsonLd data={buildRoomDetailSchema(standardDoubleRoom)} />
      <RoomDetailPage data={standardDoubleRoom} />
    </>
  );
}
