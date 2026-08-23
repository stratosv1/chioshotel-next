import type { StartPromptInput } from "@/lib/mixalis/start-prompt";

export type PlatformStartPromptConfig = {
  id: string;
  version: string;
};

export function getConfiguredPlatformStartPrompt(): PlatformStartPromptConfig | null {
  const id = process.env.PHYSICS_START_PROMPT_ID?.trim() || "";
  const version = process.env.PHYSICS_START_PROMPT_VERSION?.trim() || "";

  if (!id && !version) return null;
  if (!id || !version) {
    throw new Error(
      "PHYSICS_START_PROMPT_ID and PHYSICS_START_PROMPT_VERSION must be configured together.",
    );
  }

  return { id, version };
}

export function getPlatformStartPromptFromProvenance(
  provenance: Record<string, unknown>,
): PlatformStartPromptConfig | null {
  if (provenance?.promptTransport !== "openai_platform") return null;
  const id = String(provenance?.platformPromptId ?? "").trim();
  const version = String(provenance?.platformPromptVersion ?? "").trim();
  if (!id || !version) {
    throw new Error("Lesson revision is missing its pinned OpenAI Platform Prompt identity.");
  }
  return { id, version };
}

export function buildPlatformStartRuntimeInput(input: StartPromptInput) {
  return `COURSE: ${input.courseTitle}\nCHAPTER: ${input.chapterLabel} ${input.chapterTitle}\nSUBCHAPTER: ${input.subchapterLabel} ${input.subchapterTitle}\n\nSTRUCTURED CURRENT SUBCHAPTER INTELLIGENCE\n${JSON.stringify(input.intelligence)}\n\nCreate one coherent Lesson Revision from this Intelligence. Apply the complete START teaching contract stored in the pinned OpenAI Platform Prompt. Return only the required structured lesson output.`;
}
