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
    <main className="min-h-screen bg-[#f6efe5] px-4 py-6 text-stone-900">
      <div className="mx-auto max-w-xl">
                <h1 className="mb-4 mt-1 text-2xl font-black tracking-tight">Δωμάτια ημέρας</h1>
        <RoomDayPanel />
      </div>
    </main>
    </PyrgosShell>
  );
}
