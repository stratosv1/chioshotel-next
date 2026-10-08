import { LocalizedBeachDetailPage } from "@/components/chios/LocalizedBeachDetailPage";
import { elintaBeachByLanguage } from "@/content/karfas-elinta-data";
import { elintaBeachPaths } from "@/content/karfas-elinta-paths";
import { buildLocalizedBeachMetadata } from "@/content/karfas-elinta-seo";

// Sea-condition blocks refresh with the marine forecast cache.
export const revalidate = 900;

const beach = elintaBeachByLanguage.el;

export const metadata = buildLocalizedBeachMetadata(beach, elintaBeachPaths);

export default function Page() {
  return <LocalizedBeachDetailPage beach={beach} />;
}
