import type { Metadata } from "next";
import { AiRoomChatPreview } from "@/components/ai/AiRoomChatPreview";

export const metadata: Metadata = {
  title: {
    absolute: "AI Room Finder Chat Preview | Voulamandis House",
  },
  description: "Preview of the conversational AI Room Finder experience.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function AiAssistantPage() {
  return <AiRoomChatPreview />;
}
