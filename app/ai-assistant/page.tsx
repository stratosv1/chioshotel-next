import type { Metadata } from "next";
import { RoomFinderProduction } from "@/components/ai/RoomFinderProduction";

export const metadata: Metadata = {
  title: { absolute: "AI Room Finder | Voulamandis House" },
  description: "Find live room availability and send an enquiry to reception.",
  robots: { index: false, follow: false, nocache: true },
};

export default function AiAssistantPage() {
  return <RoomFinderProduction />;
}
