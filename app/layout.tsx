import { headers } from "next/headers";
import { VoulamandisFooter } from "@/components/VoulamandisFooter";
import { VoulamandisHeader } from "@/components/VoulamandisHeader";
import "./globals.css";

export const metadata = {
  title: "Chios Hotel Rooms & Apartments | Voulamandis House",
  description:
    "Quiet rooms and apartments in Kampos, Chios. Stay at Voulamandis House near Chios Town, the airport, beaches, villages and local attractions.",
};

const supportedLanguages = ["el", "fr", "de", "it", "es", "tr"];

function getHtmlLanguage(pathname: string | null) {
  const firstSegment = pathname?.split("/").filter(Boolean)[0];

  if (firstSegment && supportedLanguages.includes(firstSegment)) {
    return firstSegment;
  }

  return "en";
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname");
  const htmlLang = getHtmlLanguage(pathname);

  return (
    <html lang={htmlLang}>
      <head>
        <link
          rel="preload"
          as="image"
          href="https://chioshotel.gr/wp-content/uploads/2026/03/chios.hotels.voulamandis.house_.hero_.image_.webp"
          fetchPriority="high"
        />
      </head>

      <body>
        <VoulamandisHeader />
        {children}
        <VoulamandisFooter />
      </body>
    </html>
  );
}