import type { Metadata } from "next";
import "./calendar-modern.css";
import StableAvailabilityCalendar from "./StableAvailabilityCalendar";

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
      <StableAvailabilityCalendar />
    </div>
  );
}
