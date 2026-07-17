import type { Metadata } from "next";
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

export default function AiAssistantPage() {
  return <AIRoomFinder />;
}
