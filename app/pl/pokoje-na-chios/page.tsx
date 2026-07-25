import type { Metadata } from "next";
import { RoomsCategoryPage } from "@/components/rooms/RoomsCategoryPage";
import { JsonLd } from "@/components/seo/JsonLd";
import { localizePolishCommercialSchema } from "@/content/commercial-schema-pl";
import { roomsCategoryPl } from "@/content/rooms-pl";
import { buildRoomsCategorySchema } from "@/content/rooms-schema";
import { buildPolishPageMetadata } from "@/lib/seo-pl";

export const metadata: Metadata = buildPolishPageMetadata({
  path: roomsCategoryPl.seo.canonicalPath,
  title: roomsCategoryPl.seo.title,
  description: roomsCategoryPl.seo.description,
  image: roomsCategoryPl.seo.ogImage,
});

const schema = localizePolishCommercialSchema(buildRoomsCategorySchema(roomsCategoryPl), {
  breadcrumbs: [
    { name: "Strona główna", path: "/pl/" },
    { name: "Pokoje i apartamenty na Chios", path: "/pl/pokoje-na-chios/" },
  ],
});

export default function PolishRoomsPage() {
  return (
    <>
      <JsonLd data={schema} />
      <RoomsCategoryPage data={roomsCategoryPl} />
    </>
  );
}
