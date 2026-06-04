import type { Metadata } from "next";
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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <VoulamandisHeader />
        {children}
        <VoulamandisFooter />
      </body>
    </html>
  );
}
