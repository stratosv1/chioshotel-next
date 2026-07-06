import { LegalPolicyPage } from "@/components/legal/LegalPolicyPage";

type LanguageCode = "en" | "el" | "fr" | "de" | "it" | "es" | "tr";

function getLanguage(locale: string): LanguageCode {
  if (["el", "fr", "de", "it", "es", "tr"].includes(locale)) {
    return locale as LanguageCode;
  }
  return "en";
}

export default async function LocalizedPrivacyPolicyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <LegalPolicyPage language={getLanguage(locale)} kind="privacy" />;
}
