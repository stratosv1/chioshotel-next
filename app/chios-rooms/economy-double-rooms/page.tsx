import type { Metadata } from "next";
import { RoomDetailPage } from "@/components/rooms/RoomDetailPage";
import { JsonLd } from "@/components/seo/JsonLd";
import { economyDoubleRoomsEn } from "@/content/room-details";
import { buildRoomDetailSchema } from "@/content/room-detail-schema";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  path: economyDoubleRoomsEn.seo.canonicalPath,
  title: economyDoubleRoomsEn.seo.title,
  description: economyDoubleRoomsEn.seo.description,
  image: economyDoubleRoomsEn.seo.ogImage,
});

export default function Page() {
  return (
    <>
      <JsonLd data={buildRoomDetailSchema(economyDoubleRoomsEn)} />
      <RoomDetailPage data={economyDoubleRoomsEn} />
    </>
  );
}
