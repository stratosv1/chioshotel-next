import { VoulamandisFooter } from "@/components/VoulamandisFooter";
import { VoulamandisHeader } from "@/components/VoulamandisHeader";
import "./globals.css";

export const metadata = {
  title: "Chios Hotel Rooms & Apartments | Voulamandis House",
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