import { PolishKamposLandingPage } from "@/components/chios/PolishKamposLandingPage";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildPolishKambosSchema } from "@/content/kambos-schema-pl";
import { buildPolishPageMetadata } from "@/lib/seo-pl";

export const metadata = buildPolishPageMetadata({
  path: "/pl/kambos-chios/",
  title: "Kambos Chios | Noclegi w historycznej części wyspy",
  description:
    "Kambos na Chios: historyczna okolica z kamiennymi murami, dawnymi rezydencjami i ogrodami cytrusowymi. Spokojny pobyt w Voulamandis House.",
});

export default function PolishKambosPage() {
  return (
    <>
      <JsonLd data={buildPolishKambosSchema()} />
      <PolishKamposLandingPage />
    </>
  );
}
