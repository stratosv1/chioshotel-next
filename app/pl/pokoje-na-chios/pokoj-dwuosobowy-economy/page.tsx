import type { Metadata } from "next";
import { EconomyRoomDetailPage } from "@/components/rooms/EconomyRoomDetailPage";
import { JsonLd } from "@/components/seo/JsonLd";
import { economyDoubleRoomsPl } from "@/content/room-details-pl";
import { buildPolishRoomDetailSchema } from "@/content/room-detail-schema-pl";
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
      <JsonLd data={buildPolishRoomDetailSchema(economyDoubleRoomsPl)} />
      <EconomyRoomDetailPage data={economyDoubleRoomsPl} />
    </>
  );
}
