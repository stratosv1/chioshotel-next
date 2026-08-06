import { LocalizedBeachDetailPage } from "@/components/chios/LocalizedBeachDetailPage";
import { elintaBeachByLanguage } from "@/content/karfas-elinta-data";
import { elintaBeachPaths } from "@/content/karfas-elinta-paths";
import { buildLocalizedBeachMetadata } from "@/content/karfas-elinta-seo";

const beach = elintaBeachByLanguage.fr;

export const metadata = buildLocalizedBeachMetadata(beach, elintaBeachPaths);

export default function Page() {
  return <LocalizedBeachDetailPage beach={beach} />;
}
