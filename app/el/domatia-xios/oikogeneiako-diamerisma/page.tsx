import type { Metadata } from "next";
import { RoomDetailPage } from "@/components/rooms/RoomDetailPage";
import { JsonLd } from "@/components/seo/JsonLd";
import { getApartmentIntentData } from "@/content/apartment-intent";
import { buildRoomDetailSchema } from "@/content/room-detail-schema";
import { buildPageMetadata } from "@/lib/seo";

const data = getApartmentIntentData("el");
const baseMetadata = buildPageMetadata({
  path: data.seo.canonicalPath,
  title: data.seo.title,
  description: data.seo.description,
  image: data.seo.ogImage,
});

// This page intentionally owns the generic Greek apartment intent. Override the
// older CTR snippet entry while retaining canonical, hreflang and robots data.
export const metadata: Metadata = {
  ...baseMetadata,
  title: { absolute: data.seo.title },
  description: data.seo.description,
  openGraph: baseMetadata.openGraph
    ? {
        ...baseMetadata.openGraph,
        title: data.seo.title,
        description: data.seo.description,
      }
    : undefined,
  twitter: baseMetadata.twitter
    ? {
        ...baseMetadata.twitter,
        title: data.seo.title,
        description: data.seo.description,
      }
    : undefined,
};

export default function Page() {
  return (
    <>
      <JsonLd data={buildRoomDetailSchema(data)} />
      <RoomDetailPage data={data} />
    </>
  );
}
