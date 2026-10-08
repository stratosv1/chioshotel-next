import { LocalizedBeachDetailPage } from "@/components/chios/LocalizedBeachDetailPage";
import { karfasBeachByLanguage } from "@/content/karfas-elinta-data";
import { karfasBeachPaths } from "@/content/karfas-elinta-paths";
import { buildLocalizedBeachMetadata } from "@/content/karfas-elinta-seo";

// Sea-condition blocks refresh with the marine forecast cache.
export const revalidate = 900;

const beach = karfasBeachByLanguage.el;

export const metadata = buildLocalizedBeachMetadata(beach, karfasBeachPaths);

export default function Page() {
  return <LocalizedBeachDetailPage beach={beach} />;
}
