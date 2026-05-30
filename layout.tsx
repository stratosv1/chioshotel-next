import "./globals.css";

export const metadata = {
  title: "Chios Hotels in Kampos – Rooms & Apartments in Chios | Voulamandis House",
  description:
    "Peaceful rooms and apartments in Kampos, Chios. Stay at Voulamandis House near Chios airport, town and beaches, with authentic hospitality and direct booking benefits.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
