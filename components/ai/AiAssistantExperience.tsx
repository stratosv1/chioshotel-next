import { RoomFinderProduction } from "@/components/ai/RoomFinderProduction";
import type { RoomFinderLanguage } from "@/components/ai/room-finder-copy";

export function AiAssistantExperience({
  language,
}: {
  language: RoomFinderLanguage;
}) {
  return (
    <div lang={language} className="contents">
      <RoomFinderProduction initialLanguage={language} />
    </div>
  );
}
