import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    absolute: "Physics Workspace",
  },
  description: "Ιδιωτικός χώρος μελέτης Φυσικής.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

export default function MixalisRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
