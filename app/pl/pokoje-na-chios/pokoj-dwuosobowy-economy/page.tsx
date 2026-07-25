import type { Metadata } from "next";
import { RoomDetailPage } from "@/components/rooms/RoomDetailPage";
import { JsonLd } from "@/components/seo/JsonLd";
import { economyDoubleRoomsPl } from "@/content/room-details-pl";
import { buildRoomDetailSchema } from "@/content/room-detail-schema";
import { buildPolishPageMetadata } from "@/lib/seo-pl";

export const metadata: Metadata = buildPolishPageMetadata({
  path: economyDoubleRoomsPl.seo.canonicalPath,
  title: economyDoubleRoomsPl.seo.title,
  description: economyDoubleRoomsPl.seo.description,
  image: economyDoubleRoomsPl.seo.ogImage,
});

export default function PolishEconomyRoomPage() {
  return (
    <>
      <JsonLd data={buildRoomDetailSchema(economyDoubleRoomsPl)} />
      <RoomDetailPage data={economyDoubleRoomsPl} />
    </>
  );
}
