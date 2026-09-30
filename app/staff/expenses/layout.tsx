import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  applicationName: "Έξοδα",
  description: "Καταχώρηση και παρακολούθηση εξόδων Voulamandis House.",
  manifest: "/staff/expenses/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Έξοδα",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    apple: [
      {
        url: "/favicon/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#805536",
};

export default function StaffExpensesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
