import type { Metadata } from "next";
import { RoomDetailPage } from "@/components/rooms/RoomDetailPage";
import { JsonLd } from "@/components/seo/JsonLd";
import { standardDoubleRoomPl } from "@/content/room-details-pl";
import { buildRoomDetailSchema } from "@/content/room-detail-schema";
import { buildPolishPageMetadata } from "@/lib/seo-pl";

export const metadata: Metadata = buildPolishPageMetadata({
  path: standardDoubleRoomPl.seo.canonicalPath,
  title: standardDoubleRoomPl.seo.title,
  description: standardDoubleRoomPl.seo.description,
  image: standardDoubleRoomPl.seo.ogImage,
});

export default function PolishStandardRoomsPage() {
  return (
    <>
      <JsonLd data={buildRoomDetailSchema(standardDoubleRoomPl)} />
      <RoomDetailPage data={standardDoubleRoomPl} />
    </>
  );
}
