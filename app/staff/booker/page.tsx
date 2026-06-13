import type { Metadata } from "next";
import BookerApp from "./BookerApp";

export const metadata: Metadata = {
  title: "Κάνε Κράτηση | Staff Area",
  robots: {
    index: false,
    follow: false,
  },
};

export default function StaffBookerPage() {
  return <BookerApp />;
}
