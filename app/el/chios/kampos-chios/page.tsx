import type { Metadata } from "next";
import { GreekKamposLandingPageElegant } from "@/components/chios/GreekKamposLandingPageElegant";
import { JsonLd } from "@/components/seo/JsonLd";
import { kamposChiosPageEl } from "@/content/kampos-chios";
import { buildKamposChiosSchema } from "@/content/kampos-chios-schema";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  path: kamposChiosPageEl.seo.canonicalPath,
  title: "Διαμονή στον Κάμπο Χίου | Δωμάτια & Διαμερίσματα",
  description:
    "Διαμονή στον Κάμπο Χίου στο Voulamandis House. Ήσυχα ενοικιαζόμενα δωμάτια και οικογενειακά διαμερίσματα ανάμεσα σε περιβόλια, κοντά σε πόλη, αεροδρόμιο και παραλίες.",
  image: kamposChiosPageEl.seo.ogImage,
  imageAlt: "Voulamandis House και διαμονή στον Κάμπο της Χίου",
});

export default function Page() {
  return (
    <>
      <JsonLd data={buildKamposChiosSchema(kamposChiosPageEl)} />
      <GreekKamposLandingPageElegant data={kamposChiosPageEl} />
    </>
  );
}
