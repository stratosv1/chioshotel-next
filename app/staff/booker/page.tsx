import type { Metadata } from "next";
import BookerApp from "./BookerApp";

export const metadata: Metadata = {
  title: "Staff Booking Assistant | Voulamandis House",
  robots: {
    index: false,
    follow: false,
  },
};

export default function StaffBookerPage() {
  return <BookerApp />;
}
