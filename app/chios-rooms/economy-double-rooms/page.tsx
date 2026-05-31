import type { Metadata } from "next";
import { RoomDetailPage } from "@/components/rooms/RoomDetailPage";
import { JsonLd } from "@/components/seo/JsonLd";
import { economyDoubleRooms } from "@/content/room-details";
import { buildRoomDetailSchema } from "@/content/room-detail-schema";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  path: economyDoubleRooms.seo.canonicalPath,
  title: economyDoubleRooms.seo.title,
  description: economyDoubleRooms.seo.description,
  image: economyDoubleRooms.seo.ogImage,
});

export default function Page() {
  return (
    <>
      <JsonLd data={buildRoomDetailSchema(economyDoubleRooms)} />
      <RoomDetailPage data={economyDoubleRooms} />
    </>
  );
}