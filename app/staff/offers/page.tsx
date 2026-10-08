import type { Metadata } from "next";
import OffersApp from "./OffersApp";

export const metadata: Metadata = {
  title: "Προσφορές & Newsletter | Staff",
  robots: { index: false, follow: false },
};

export default function OffersPage() {
  return <OffersApp />;
}
