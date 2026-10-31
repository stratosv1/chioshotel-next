import type { Metadata } from "next";
import "./tailwind.css";

export const metadata: Metadata = {
  title: {
    absolute: "Study Workspace",
  },
  description: "Ιδιωτικός χώρος μελέτης.",
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

export default function SiderisRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
