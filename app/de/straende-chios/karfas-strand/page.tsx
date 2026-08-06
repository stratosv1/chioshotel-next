import { LocalizedBeachDetailPage } from "@/components/chios/LocalizedBeachDetailPage";
import { karfasBeachByLanguage } from "@/content/karfas-elinta-data";
import { karfasBeachPaths } from "@/content/karfas-elinta-paths";
import { buildLocalizedBeachMetadata } from "@/content/karfas-elinta-seo";

const beach = karfasBeachByLanguage.de;

export const metadata = buildLocalizedBeachMetadata(beach, karfasBeachPaths);

export default function Page() {
  return <LocalizedBeachDetailPage beach={beach} />;
}
