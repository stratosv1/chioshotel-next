import type { Metadata } from "next";
import { RoomsCategoryPage } from "@/components/rooms/RoomsCategoryPage";
import { JsonLd } from "@/components/seo/JsonLd";
import { roomsCategoryEn } from "@/content/rooms";
import { buildRoomsCategorySchema } from "@/content/rooms-schema";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  path: roomsCategoryEn.seo.canonicalPath,
  title: roomsCategoryEn.seo.title,
  description: roomsCategoryEn.seo.description,
  image: roomsCategoryEn.seo.ogImage,
});

export default function Page() {
  return (
    <>
      <JsonLd data={buildRoomsCategorySchema(roomsCategoryEn)} />
      <RoomsCategoryPage data={roomsCategoryEn} />
    </>
  );
}