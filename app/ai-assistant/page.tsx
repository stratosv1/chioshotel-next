import type { Metadata } from "next";
import { AiBackToSite } from "@/components/ai/AiBackToSite";
import { AiConversationAutoScroll } from "@/components/ai/AiConversationAutoScroll";
import { AiNoAvailabilityBridge } from "@/components/ai/AiNoAvailabilityBridge";
import { AiRoomDetailsEnhancer } from "@/components/ai/AiRoomDetailsEnhancer";
import { AiRoomModalPolish } from "@/components/ai/AiRoomModalPolish";
import { AiSplitStayPresentation } from "@/components/ai/AiSplitStayPresentation";
import { AiSummaryActions } from "@/components/ai/AiSummaryActions";
import { AiSummaryEmailBridge } from "@/components/ai/AiSummaryEmailBridge";
import { ConversationalRoomSalesEnhanced } from "@/components/ai/ConversationalRoomSalesEnhanced";

export const metadata: Metadata = {
  title: {
    absolute: "AI Room Finder | Voulamandis House",
  },
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
      <AiNoAvailabilityBridge />
      <ConversationalRoomSalesEnhanced />
      <AiConversationAutoScroll />
      <AiRoomDetailsEnhancer />
      <AiRoomModalPolish />
      <AiSplitStayPresentation />
      <AiSummaryActions />
      <AiSummaryEmailBridge />
    </>
  );
}
