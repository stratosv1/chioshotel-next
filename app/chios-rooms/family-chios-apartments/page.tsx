import type { Metadata } from "next";
import { RoomDetailPage } from "@/components/rooms/RoomDetailPage";
import { JsonLd } from "@/components/seo/JsonLd";
import { familyChiosApartments } from "@/content/room-details";
import { buildRoomDetailSchema } from "@/content/room-detail-schema";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  path: familyChiosApartments.seo.canonicalPath,
  title: familyChiosApartments.seo.title,
  description: familyChiosApartments.seo.description,
  image: familyChiosApartments.seo.ogImage,
});

export default function Page() {
  return (
    <>
      <JsonLd data={buildRoomDetailSchema(familyChiosApartments)} />
      <RoomDetailPage data={familyChiosApartments} />
    </>
  );
}