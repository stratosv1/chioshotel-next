import { RoomFinderProduction } from "@/components/ai/RoomFinderProduction";
import { RoomFinderResultsViewportGuard } from "@/components/ai/RoomFinderResultsViewportGuard";
import type { RoomFinderLanguage } from "@/components/ai/room-finder-copy";

export function AiAssistantExperience({
  language,
}: {
  language: RoomFinderLanguage;
}) {
  return (
    <div lang={language} className="contents">
      <RoomFinderResultsViewportGuard />
      <RoomFinderProduction initialLanguage={language} />
    </div>
  );
}
