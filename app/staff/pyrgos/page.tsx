import type { Metadata } from "next";
import TodayBoard from "./TodayBoard";

export const metadata: Metadata = {
  title: "Πύργος ελέγχου · Σήμερα | Staff Area",
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

export const dynamic = "force-dynamic";

export default function PyrgosTodayPage() {
  return <TodayBoard />;
}
