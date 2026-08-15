import type { Metadata } from "next";
import { getRoomFinderInbox } from "@/lib/ai-assistant/conversation-store";
import RoomFinderInboxClient from "./RoomFinderInboxClient";

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

export default async function AiRoomFinderStaffPage({
  searchParams,
}: {
  searchParams: Promise<{ session?: string }>;
}) {
  const params = await searchParams;
  const initialData = await getRoomFinderInbox(params.session || null);
  return <RoomFinderInboxClient initialData={initialData} />;
}
