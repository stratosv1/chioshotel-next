import type { Metadata } from "next";
import RoomDayPanel from "./RoomDayPanel";
import PyrgosShell from "../pyrgos/PyrgosShell";

export const metadata: Metadata = {
  title: "Δωμάτια ημέρας | Staff Area",
  robots: { index: false, follow: false },
};

export default function StaffRoomsPage() {
  return (
    <PyrgosShell>
    <main className="min-h-screen p-4 text-[#1f2a3c] sm:p-6 lg:p-8">
      <div className="max-w-3xl">
        <h1 className="mb-4 text-2xl font-black tracking-tight sm:text-3xl">Αφίξεις & δωμάτια</h1>
        <RoomDayPanel />
      </div>
    </main>
    </PyrgosShell>
  );
}
