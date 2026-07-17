import type { Metadata } from "next";
import { AiSummaryEmailBridge } from "@/components/ai/AiSummaryEmailBridge";
import { ConversationalRoomSalesCarousel } from "@/components/ai/ConversationalRoomSalesCarousel";

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
  return (
    <>
      <ConversationalRoomSalesCarousel />
      <AiSummaryEmailBridge />
    </>
  );
}
