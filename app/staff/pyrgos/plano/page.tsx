import type { Metadata } from "next";
import PlanBoard from "./PlanBoard";

export const metadata: Metadata = {
  title: "Πύργος ελέγχου · Πλάνο κρατήσεων | Staff Area",
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

export const dynamic = "force-dynamic";

export default function PyrgosPlanPage() {
  return <PlanBoard />;
}
