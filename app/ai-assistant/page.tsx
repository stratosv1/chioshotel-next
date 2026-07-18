import type { Metadata } from "next";
import { AiBackToSite } from "@/components/ai/AiBackToSite";
import { AIRoomFinder } from "@/components/ai/AIRoomFinder";

export const metadata: Metadata = {
  title: "AI Room Finder | Voulamandis House",
  description: "Find live room availability and send an enquiry to reception.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

const accessibilityWidgetCss = `
  #INDmenu-btn,
  .INDmenu-btn,
  #INDmenu,
  #userwayAccessibilityIcon,
  .uwy,
  .acsb-trigger,
  .pojo-a11y-toolbar-toggle,
  #pojo-a11y-toolbar,
  [id*="accessibility" i],
  [class*="accessibility" i],
  [aria-label*="accessibility" i],
  [title*="accessibility" i],
  iframe[src*="accessibility" i] {
    display: none !important;
    visibility: hidden !important;
    pointer-events: none !important;
  }
`;

export default function AiAssistantPage() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: accessibilityWidgetCss }} />
      <AiBackToSite />
      <AIRoomFinder />
    </>
  );
}
