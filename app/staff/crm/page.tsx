import type { Metadata } from "next";
import CrmApp from "./CrmApp";

export const metadata: Metadata = {
  title: "Πελάτες & CRM | Staff",
  robots: { index: false, follow: false },
};

export default function CrmPage() {
  return <CrmApp />;
}
