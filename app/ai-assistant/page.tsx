import { permanentRedirect } from "next/navigation";
import { AiAssistantExperience } from "@/components/ai/AiAssistantExperience";
import {
  aiAssistantViewport,
  buildAiAssistantMetadata,
  isAiAssistantLanguage,
} from "@/lib/ai-assistant/page-localization";
import { ROOM_FINDER_HREFS } from "@/lib/room-finder-cta-routing";

export const metadata = buildAiAssistantMetadata("en");
export const viewport = aiAssistantViewport;

type AiAssistantPageProps = {
  searchParams: Promise<{ lang?: string | string[] }>;
};

export default async function AiAssistantPage({ searchParams }: AiAssistantPageProps) {
  const params = await searchParams;
  const rawLanguage = Array.isArray(params.lang) ? params.lang[0] : params.lang;
  const normalized = rawLanguage?.toLowerCase().split("-")[0];

  if (normalized && isAiAssistantLanguage(normalized)) {
    permanentRedirect(ROOM_FINDER_HREFS[normalized]);
  }

  return <AiAssistantExperience language="en" />;
}
