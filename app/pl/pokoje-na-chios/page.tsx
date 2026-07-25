import type { Metadata } from "next";
import { RoomsCategoryPage } from "@/components/rooms/RoomsCategoryPage";
import { JsonLd } from "@/components/seo/JsonLd";
import { roomsCategoryPl } from "@/content/rooms-pl";
import { buildRoomsCategorySchema } from "@/content/rooms-schema";
import { buildPolishPageMetadata } from "@/lib/seo-pl";

export const metadata: Metadata = buildPolishPageMetadata({
  path: roomsCategoryPl.seo.canonicalPath,
  title: roomsCategoryPl.seo.title,
  description: roomsCategoryPl.seo.description,
  image: roomsCategoryPl.seo.ogImage,
});

export default function PolishRoomsPage() {
  return (
    <>
      <JsonLd data={buildRoomsCategorySchema(roomsCategoryPl)} />
      <RoomsCategoryPage data={roomsCategoryPl} />
    </>
  );
}
