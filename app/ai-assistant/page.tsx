import type { Metadata } from "next";
import { ConversationalRoomSalesBody } from "@/components/ai/ConversationalRoomSalesBody";

export const metadata: Metadata = {
  title: "AI Room Finder | Voulamandis House",
  description: "Find live room availability and send an enquiry to reception.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function AiAssistantPage() {
  return <ConversationalRoomSalesBody />;
}
