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
  url: "https://chioshotel.gr/",
  image: "https://chioshotel.gr/images/activities/chios.hotels.voulamandis.house_.hero_.image_.webp",
  telephone: "+302271031733",
  email: "chioshotel@gmail.com",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Dimarchou Kalvokoressi 117",
    addressLocality: "Chios",
    addressRegion: "North Aegean",
    postalCode: "82100",
    addressCountry: "GR",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 38.3436,
    longitude: 26.1374,
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
