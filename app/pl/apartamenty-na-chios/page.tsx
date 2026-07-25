import type { Metadata } from "next";
import { RoomDetailPage } from "@/components/rooms/RoomDetailPage";
import { JsonLd } from "@/components/seo/JsonLd";
import { familyChiosApartmentsPl } from "@/content/room-details-pl";
import { buildPolishRoomDetailSchema } from "@/content/room-detail-schema-pl";
import { buildPolishPageMetadata } from "@/lib/seo-pl";

const apartmentData = {
  ...familyChiosApartmentsPl,
  seo: {
    ...familyChiosApartmentsPl.seo,
    canonicalPath: "/pl/apartamenty-na-chios/",
  },
};

export const metadata: Metadata = buildPolishPageMetadata({
  path: apartmentData.seo.canonicalPath,
  title: apartmentData.seo.title,
  description: apartmentData.seo.description,
  image: apartmentData.seo.ogImage,
});

export default function PolishApartmentsPage() {
  return (
    <>
      <JsonLd data={buildPolishRoomDetailSchema(apartmentData)} />
      <RoomDetailPage data={apartmentData} />
    </>
  );
}
