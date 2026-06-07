import type { Metadata } from "next";
import { headers } from "next/headers";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { VoulamandisFooter } from "@/components/VoulamandisFooter";
import { VoulamandisHeader } from "@/components/VoulamandisHeader";
import { siteName, siteUrl } from "@/lib/seo";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Chios Hotel Rooms & Apartments | Voulamandis House",
    template: `%s | ${siteName}`,
  },
  description:
    "Quiet rooms and apartments in Kampos, Chios. Stay at Voulamandis House near Chios Town, the airport, beaches, villages and local attractions.",
  icons: {
    icon: [
      { url: "/favicon/favicon.ico" },
      { url: "/favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      {
        url: "/favicon/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
  manifest: "/favicon/site.webmanifest",
};

function getHtmlLanguage(pathname: string): string {
  const firstSegment = pathname.split("/").filter(Boolean)[0];

  if (["el", "fr", "de", "it", "es", "tr"].includes(firstSegment)) {
    return firstSegment;
  }

  return "en";
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const requestHeaders = await headers();
  const pathname = requestHeaders.get("x-current-pathname") || "/";
  const htmlLanguage = getHtmlLanguage(pathname);

  return (
    <html lang={htmlLanguage}>
      <body>
        <VoulamandisHeader />
        {children}
        <VoulamandisFooter />
        <SpeedInsights />
      </body>
    </html>
  );
}
