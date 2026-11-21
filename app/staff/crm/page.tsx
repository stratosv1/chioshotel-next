import type { Metadata } from "next";
import CrmApp from "./CrmApp";
import PyrgosShell from "../pyrgos/PyrgosShell";

export const metadata: Metadata = {
  title: "Πελάτες & CRM | Staff",
  robots: { index: false, follow: false },
};

export default function CrmPage() {
  return (
    <PyrgosShell>
      <CrmApp />
    </PyrgosShell>
  );
}
