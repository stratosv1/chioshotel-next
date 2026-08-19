import type { Metadata, Viewport } from "next";
import { RoomFinderProduction } from "@/components/ai/RoomFinderProduction";
import { RoomFinderResultsViewportGuard } from "@/components/ai/RoomFinderResultsViewportGuard";
import type { RoomFinderLanguage } from "@/components/ai/room-finder-copy";

export const metadata: Metadata = {
  title: { absolute: "AI Room Finder | Voulamandis House" },
  description: "Find live room availability and send an enquiry to reception.",
  robots: { index: false, follow: false, nocache: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  interactiveWidget: "resizes-content",
  themeColor: "#a4907c",
};

const SUPPORTED_LANGUAGES = new Set<RoomFinderLanguage>(["el", "en", "de", "fr", "it", "es", "tr"]);

type AiAssistantPageProps = {
  searchParams: Promise<{ lang?: string | string[] }>;
};

export default async function AiAssistantPage({ searchParams }: AiAssistantPageProps) {
  const params = await searchParams;
  const rawLanguage = Array.isArray(params.lang) ? params.lang[0] : params.lang;
  const normalized = rawLanguage?.toLowerCase().split("-")[0] as RoomFinderLanguage | undefined;
  const initialLanguage: RoomFinderLanguage = normalized && SUPPORTED_LANGUAGES.has(normalized) ? normalized : "en";

  return (
    <div lang={initialLanguage} className="contents">
      <RoomFinderResultsViewportGuard />
      <RoomFinderProduction initialLanguage={initialLanguage} />
    </div>
  );
}
