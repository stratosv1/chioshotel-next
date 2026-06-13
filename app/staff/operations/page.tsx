import type { Metadata } from "next";
import OperationsApp from "./OperationsApp";

export const metadata: Metadata = {
  title: "Operations Database | Staff Area",
  robots: {
    index: false,
    follow: false,
  },
};

export default function StaffOperationsPage() {
  return <OperationsApp />;
}
