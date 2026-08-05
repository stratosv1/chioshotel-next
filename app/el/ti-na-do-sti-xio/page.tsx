import type { Metadata } from "next";
import { ChiosIslandPage } from "@/components/chios/ChiosIslandPage";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildChiosIslandSchema } from "@/content/chios-island-schema";
import { chiosIslandPageEl } from "@/content/chios-island";
import { buildPageMetadata } from "@/lib/seo";

const pageData = {
  ...chiosIslandPageEl,
  seo: {
    ...chiosIslandPageEl.seo,
    title: "Τι να δω στη Χίο | Τα καλύτερα μέρη & εμπειρίες",
    description:
      "Ανακαλύψτε τι αξίζει να δείτε στη Χίο: παραλίες, μεσαιωνικά χωριά, μαστίχα, μουσεία και αυθεντικές εμπειρίες, με ιδέες για τις διαδρομές σας.",
  },
  hero: {
    ...chiosIslandPageEl.hero,
    title: "Τι να δω στη Χίο: τα μέρη που πραγματικά αξίζουν",
    description:
      "Ανακαλύψτε μεσαιωνικά χωριά, ξεχωριστές παραλίες, μουσεία και τη μοναδική παράδοση της μαστίχας που κάνουν τη Χίο διαφορετική.",
  },
  intro: {
    ...chiosIslandPageEl.intro,
    title: "Τι αξίζει να δείτε και να ζήσετε στη Χίο",
    paragraphs: [
      "Η Χίος συνδυάζει μεσαιωνικά χωριά, ξεχωριστές παραλίες, μουσεία, μαστίχα και αυθεντικές τοπικές εμπειρίες. Ξεκινήστε από τα βασικά αξιοθέατα και οργανώστε τις διαδρομές σας ανά περιοχή.",
      ...chiosIslandPageEl.intro.paragraphs.slice(1),
    ],
  },
};

export const metadata: Metadata = buildPageMetadata({
  path: pageData.seo.canonicalPath,
  title: pageData.seo.title,
  description: pageData.seo.description,
  image: pageData.seo.ogImage,
});

export default function Page() {
  return (
    <>
      <JsonLd data={buildChiosIslandSchema(pageData)} />
      <ChiosIslandPage data={pageData} />
    </>
  );
}
