import type { Metadata } from "next";
import ExpensesApp from "./ExpensesApp";

export const metadata: Metadata = {
  title: "Έξοδα Ξενοδοχείου | Staff Area",
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
  return <ExpensesApp />;
}
