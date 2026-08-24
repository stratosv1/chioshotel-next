import type { Metadata } from "next";
import { EconomyRoomDetailPage } from "@/components/rooms/EconomyRoomDetailPage";
import { JsonLd } from "@/components/seo/JsonLd";
import { withEconomyRoomIntent } from "@/content/economy-room-intent";
import { buildRoomDetailSchema } from "@/content/room-detail-schema";
import { economyDoubleRoomsEn } from "@/content/room-details";
import { absoluteUrl, buildPageMetadata, getAlternates, getCanonicalUrl } from "@/lib/seo";

const data = withEconomyRoomIntent(economyDoubleRoomsEn, "en");
const path = data.seo.canonicalPath;
const baseMetadata = buildPageMetadata({
  path,
  title: data.seo.title,
  description: data.seo.description,
  image: data.seo.ogImage,
});

export const metadata: Metadata = {
  ...baseMetadata,
  alternates: {
    canonical: getCanonicalUrl(path),
    languages: {
      ...getAlternates(path),
      pl: absoluteUrl("/pl/pokoje-na-chios/pokoj-dwuosobowy-economy/"),
    },
  },
};

export default function Page() {
  return (
    <>
      <JsonLd data={buildRoomDetailSchema(data)} />
      <EconomyRoomDetailPage data={data} />
    </>
  );
}
