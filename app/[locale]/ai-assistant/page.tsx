import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AiAssistantExperience } from "@/components/ai/AiAssistantExperience";
import {
  aiAssistantViewport,
  buildAiAssistantMetadata,
  isLocalizedAiAssistantLanguage,
  LOCALIZED_AI_ASSISTANT_LANGUAGES,
} from "@/lib/ai-assistant/page-localization";

type LocalizedAiAssistantPageProps = {
  params: Promise<{ locale: string }>;
};

export const viewport = aiAssistantViewport;

export function generateStaticParams() {
  return LOCALIZED_AI_ASSISTANT_LANGUAGES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: LocalizedAiAssistantPageProps): Promise<Metadata> {
  const { locale } = await params;

  if (!isLocalizedAiAssistantLanguage(locale)) {
    return {};
  }

  return buildAiAssistantMetadata(locale);
}

export default async function LocalizedAiAssistantPage({
  params,
}: LocalizedAiAssistantPageProps) {
  const { locale } = await params;

  if (!isLocalizedAiAssistantLanguage(locale)) {
    notFound();
  }

  return <AiAssistantExperience language={locale} />;
}
