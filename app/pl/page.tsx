import { PolishHomePageTailwind } from "@/components/home/PolishHomePageTailwind";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildPolishHomeSchema } from "@/content/home-schema-pl";
import { buildPolishPageMetadata } from "@/lib/seo-pl";

export const metadata = buildPolishPageMetadata({
  path: "/pl/",
  title: "Noclegi Chios | Pokoje i apartamenty w Kambos",
  description:
    "Noclegi na Chios w spokojnym Kambos. Pokoje i rodzinne apartamenty Voulamandis House, aktualna dostępność, bezpośrednia rezerwacja i praktyczna lokalizacja.",
  imageAlt: "Voulamandis House w Kambos na wyspie Chios",
});

export default function PolishHomePage() {
  return (
    <>
      <JsonLd data={buildPolishHomeSchema()} />
      <PolishHomePageTailwind />
    </>
  );
}
