import type { Metadata } from "next";
import { GuestAssistantLeadFlow } from "@/components/ai/GuestAssistantLeadFlow";

export const metadata: Metadata = {
  title: "AI Guest Assistant Test",
  description: "Private AI guest assistant test page for Voulamandis House.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function AiAssistantPage() {
  return (
    <main className="min-h-[100dvh] bg-stone-50">
      <GuestAssistantLeadFlow />
    </main>
  );
}
