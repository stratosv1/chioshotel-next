import type { Metadata } from "next";
import RoomFinderInboxLoader from "./RoomFinderInboxLoader";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "AI Room Finder Inbox | Staff",
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

export default function AiRoomFinderStaffPage() {
  return <RoomFinderInboxLoader />;
}
