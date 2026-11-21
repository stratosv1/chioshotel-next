import type { Metadata } from "next";
import ExpensesApp from "./ExpensesApp";
import PyrgosShell from "../pyrgos/PyrgosShell";

export const metadata: Metadata = {
  title: "Έξοδα | Staff Area",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function StaffExpensesPage() {
  return (
    <PyrgosShell>
      <ExpensesApp />
    </PyrgosShell>
  );
}
