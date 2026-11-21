import type { Metadata } from "next";
import OffersApp from "./OffersApp";
import PyrgosShell from "../pyrgos/PyrgosShell";

export const metadata: Metadata = {
  title: "Προσφορές & Newsletter | Staff",
  robots: { index: false, follow: false },
};

export default function OffersPage() {
  return (
    <PyrgosShell>
      <OffersApp />
    </PyrgosShell>
  );
}
