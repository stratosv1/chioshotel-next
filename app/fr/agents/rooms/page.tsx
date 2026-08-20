import { AgentRoomsPage } from "@/components/agents/AgentRoomsPage";
import { buildAgentRoomGuideMetadata } from "@/content/agent-room-guide";

export const metadata = buildAgentRoomGuideMetadata("fr");

export default function Page() {
  return <AgentRoomsPage language="fr" />;
}
