import type { Metadata } from "next";
import "./calendar-modern.css";
import CalendarApp from "./CalendarApp";

export const metadata: Metadata = {
  title: "Staff Calendar | Voulamandis House",
  robots: {
    index: false,
    follow: false,
  },
};

export default function StaffCalendarPage() {
  return (
    <div className="staff-calendar-modern">
      <CalendarApp />
    </div>
  );
}
