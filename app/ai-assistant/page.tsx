import type { Metadata } from "next";
import { AiRoomChatFlowGuard } from "@/components/ai/AiRoomChatFlowGuard";
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
  return (
    <>
      <style>{`
        @media (max-width: 560px) {
          main > header > div {
            gap: 0.45rem;
            padding-left: 0.45rem;
            padding-right: 0.45rem;
          }

          main > header a + div {
            width: 2.5rem !important;
            height: 2.5rem !important;
          }

          main > header h1 {
            font-size: 0.9rem !important;
            letter-spacing: -0.01em;
          }

          main > header h1 + div {
            display: block !important;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          main > header select {
            width: 5.2rem;
            min-width: 5.2rem;
            padding-left: 0.6rem !important;
            padding-right: 0.2rem !important;
          }
        }
      `}</style>
      <AiRoomChatFlowGuard />
      <AiRoomChatPreview />
    </>
  );
}
