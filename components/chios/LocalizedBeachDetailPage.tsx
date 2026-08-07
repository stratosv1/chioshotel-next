import { BeachDetailPageTailwind } from "@/components/chios/BeachDetailPageTailwind";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildBeachDetailSchema } from "@/content/beach-detail-schema";
import type { BeachDetailData } from "@/content/beach-details";

type LocalizedBeachDetailPageProps = {
  beach: BeachDetailData;
};

export function LocalizedBeachDetailPage({
  beach,
}: LocalizedBeachDetailPageProps) {
  return (
    <>
      <JsonLd data={buildBeachDetailSchema(beach)} />
      <BeachDetailPageTailwind beach={beach} />
    </>
  );
}
