import type { Metadata } from "next";
import { RoomDetailPage } from "@/components/rooms/RoomDetailPage";
import { JsonLd } from "@/components/seo/JsonLd";
import { getApartmentIntentData } from "@/content/apartment-intent";
import { buildRoomDetailSchema } from "@/content/room-detail-schema";
import { buildPageMetadata } from "@/lib/seo";

const data = getApartmentIntentData("de");

export const metadata: Metadata = buildPageMetadata({
  path: data.seo.canonicalPath,
  title: data.seo.title,
  description: data.seo.description,
  image: data.seo.ogImage,
});

export default function Page() {
  return (
    <>
      <JsonLd data={buildRoomDetailSchema(data)} />
      <RoomDetailPage data={data} />
    </>
  );
}
