import type { Metadata } from "next";
import { AiBackToSite } from "@/components/ai/AiBackToSite";
import { AiRoomDetailsEnhancer } from "@/components/ai/AiRoomDetailsEnhancer";
import { AiSplitStayPresentation } from "@/components/ai/AiSplitStayPresentation";
import { AiSummaryActions } from "@/components/ai/AiSummaryActions";
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
      <AiBackToSite />
      <ConversationalRoomSalesEnhanced />
      <AiRoomDetailsEnhancer />
      <AiSplitStayPresentation />
      <AiSummaryActions />
      <AiSummaryEmailBridge />
    </>
  );
}
