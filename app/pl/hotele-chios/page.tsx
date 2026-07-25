import { PolishChiosHotelsGuidePage } from "@/components/landing/PolishChiosHotelsGuidePage";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildPolishChiosHotelsGuideSchema } from "@/content/chios-hotels-guide-schema-pl";
import { buildPolishPageMetadata } from "@/lib/seo-pl";

export const metadata = buildPolishPageMetadata({
  path: "/pl/hotele-chios/",
  title: "Hotele Chios | Gdzie nocować, pokoje i apartamenty",
  description:
    "Szukasz hoteli na Chios? Porównaj rejony, pokoje i apartamenty, sprawdź realną dostępność Voulamandis House w Kambos i wybierz właściwy styl pobytu.",
});

export default function PolishHotelsPage() {
  return (
    <>
      <JsonLd data={buildPolishChiosHotelsGuideSchema()} />
      <PolishChiosHotelsGuidePage />
    </>
  );
}
