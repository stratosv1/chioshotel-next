import type { Metadata } from "next";
import { AiSummaryEmailBridge } from "@/components/ai/AiSummaryEmailBridge";
import { ConversationalRoomSalesV3 } from "@/components/ai/ConversationalRoomSalesV3";

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
      <ConversationalRoomSalesV3 />
      <AiSummaryEmailBridge />
    </>
  );
}
