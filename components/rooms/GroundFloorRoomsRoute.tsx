import type { Metadata } from "next";
import { RoomDetailPage } from "@/components/rooms/RoomDetailPage";
import { getRoomDetailFromPriceLabel } from "@/components/rooms/room-price";
import { JsonLd } from "@/components/seo/JsonLd";
import { groundFloorRoomsByLanguage } from "@/content/ground-floor-rooms";
import { buildRoomDetailSchema } from "@/content/room-detail-schema";
import { buildPageMetadata } from "@/lib/seo";

type GroundFloorLanguage = keyof typeof groundFloorRoomsByLanguage;

/** Metadata for the dedicated ground floor rooms page (Rooms 5 & 7). */
export function groundFloorRoomsMetadata(language: GroundFloorLanguage): Metadata {
  const data = groundFloorRoomsByLanguage[language];
  return buildPageMetadata({
    path: data.seo.canonicalPath,
    title: data.seo.title,
    description: data.seo.description,
    image: data.seo.ogImage,
    imageAlt: data.hero.imageAlt,
    imageWidth: 1200,
    imageHeight: 800,
  });
}

/** Server wrapper: adds the live "from €X / night" price from Booking Core. */
export async function GroundFloorRoomsRoute({ language }: { language: GroundFloorLanguage }) {
  const data = groundFloorRoomsByLanguage[language];
  const fromPriceLabel = await getRoomDetailFromPriceLabel(data);

  return (
    <>
      <JsonLd data={buildRoomDetailSchema(data)} />
      <RoomDetailPage data={data} fromPriceLabel={fromPriceLabel} />
    </>
  );
}
