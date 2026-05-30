import "./globals.css";

export const metadata = {
  title: "Ξενοδοχείο στη Χίο – Δωμάτια & Διαμερίσματα | Voulamandis House",
  description:
    "Ήσυχα δωμάτια και διαμερίσματα στον Κάμπο της Χίου. Διαμονή στο Voulamandis House κοντά σε αεροδρόμιο, πόλη και παραλίες.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="el">
      <head>
        <link
          rel="preload"
          as="image"
          href="https://chioshotel.gr/wp-content/uploads/2026/03/chios.hotels.voulamandis.house_.hero_.image_.webp"
          fetchPriority="high"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
