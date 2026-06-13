import type { Metadata } from "next";
import CalendarApp from "./CalendarApp";

export const metadata: Metadata = {
  title: "Staff Hotel Calendar | Voulamandis House",
  robots: {
    index: false,
    follow: false,
  },
};

export default function StaffCalendarPage() {
  return <CalendarApp />;
}
