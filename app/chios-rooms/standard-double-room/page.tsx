import type { Metadata } from "next";
import { RoomDetailPage } from "@/components/rooms/RoomDetailPage";
import { JsonLd } from "@/components/seo/JsonLd";
import { standardDoubleRoom } from "@/content/room-details";
import { buildRoomDetailSchema } from "@/content/room-detail-schema";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  path: standardDoubleRoom.seo.canonicalPath,
  title: standardDoubleRoom.seo.title,
  description: standardDoubleRoom.seo.description,
  image: standardDoubleRoom.seo.ogImage,
});

export default function Page() {
  return (
    <>
      <JsonLd data={buildRoomDetailSchema(standardDoubleRoom)} />
      <RoomDetailPage data={standardDoubleRoom} />
    </>
  );
}