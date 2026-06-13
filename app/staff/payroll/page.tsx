import type { Metadata } from "next";
import PayrollApp from "./PayrollApp";

export const metadata: Metadata = {
  title: "Μισθοδοσία | Staff Area",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function StaffPayrollPage() {
  return <PayrollApp />;
}
