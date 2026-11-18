import type { Metadata, Viewport } from "next";
import AndreasCalendar from "./AndreasCalendar";

export const metadata: Metadata = {
  title: { absolute: "Alexandria Institute — Ημερολόγιο κρατήσεων" },
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false, noimageindex: true },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#805536",
};

export const dynamic = "force-dynamic";

export default function AndreasPage() {
  return <AndreasCalendar />;
}
