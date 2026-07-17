import type { Metadata } from "next";
import { AiAssistantUiPatch } from "@/components/ai/AiAssistantUiPatch";
import { AiSummaryEmailBridge } from "@/components/ai/AiSummaryEmailBridge";
import { ConversationalRoomSalesEnhanced } from "@/components/ai/ConversationalRoomSalesEnhanced";

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
      <ConversationalRoomSalesEnhanced />
      <AiAssistantUiPatch />
      <AiSummaryEmailBridge />
    </>
  );
}
