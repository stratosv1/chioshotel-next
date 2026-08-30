import type { Metadata } from "next";
import RoomAgreementsApp from "./RoomAgreementsApp";

export const metadata: Metadata = {
  title: "Αναζήτηση & Συμφωνία | Staff",
  robots: { index: false, follow: false },
};

export default function RoomAgreementsPage() {
  return <RoomAgreementsApp />;
}
