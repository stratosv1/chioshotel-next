import type { ReactNode } from "react";
import { headers } from "next/headers";
import { PolishHeaderTailwind } from "@/components/pl/PolishHeaderTailwind";
import { PolishFooterTailwind } from "@/components/pl/PolishFooterTailwind";
import { JsonLd } from "@/components/seo/JsonLd";

const polishLodgingSchema = {
  "@context": "https://schema.org",
  "@type": "LodgingBusiness",
  "@id": "https://chioshotel.gr/#lodging-business",
  name: "Voulamandis House",
  url: "https://chioshotel.gr/pl/",
  image: "https://chioshotel.gr/images/activities/chios.hotels.voulamandis.house_.hero_.image_.webp",
  telephone: "+30 22710 31733",
  email: "info@chioshotel.gr",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Mayor Kalvokoresi 117",
    addressLocality: "Kambos",
    addressRegion: "Chios",
    postalCode: "82100",
    addressCountry: "GR",
  },
  availableLanguage: ["pl", "en", "el", "fr", "de", "it", "es", "tr"],
};

export default async function PolishLayout({ children }: { children: ReactNode }) {
  const requestHeaders = await headers();
  const pathname = requestHeaders.get("x-current-pathname") || "/pl/";

  return (
    <div lang="pl" className="min-h-screen bg-[#fbf8f2] text-stone-800">
      <JsonLd data={polishLodgingSchema} />
      <PolishHeaderTailwind pathname={pathname} />
      {children}
      <PolishFooterTailwind />
    </div>
  );
}
