import { cleanWords, type VocabLanguage, type VocabWordInput } from "./vocab";

const SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    title: { type: "string" },
    words: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          term: { type: "string" },
          meaning: { type: "string" },
          note: { type: "string" },
          example: { type: "string" },
        },
        required: ["term", "meaning", "note", "example"],
      },
    },
  },
  required: ["title", "words"],
};

function prompt(language: VocabLanguage) {
  const lang = language === "en" ? "English" : "German";
  const noteRule =
    language === "en"
      ? `note: the part of speech in Greek, short (e.g. "ουσ.", "ρήμα", "επίθ.", "επίρρ.", "φράση"). For irregular verbs add the past forms, e.g. "ρήμα · went, gone".`
      : `note: for nouns write the article and plural, e.g. "der Hund, die Hunde" goes in term as "der Hund" and note "πληθ. die Hunde". For verbs write "ρήμα" (and irregular forms if useful). For other words a short Greek part of speech.`;
  return `You read a photo of a vocabulary list from a Greek student's ${lang} school book or notebook (1st year of Gymnasium, about 12 years old).

Extract EVERY ${lang} word or phrase on the page, in the order they appear. For each one:
- term: the ${lang} word/phrase exactly as written (fix only obvious OCR-type mistakes). ${language === "de" ? "For nouns always include the article (der/die/das)." : ""}
- meaning: the Greek meaning. If the page gives a Greek meaning, use it as written. If not, give the correct, simple Greek meaning a 12-year-old would learn (one or two meanings, separated by ", ").
- ${noteRule}
- example: one short, simple ${lang} example sentence using the word (max 10 words), suitable for a beginner.

title: the chapter/unit title if visible on the page (e.g. "Unit 3 – My family" / "Lektion 2"), otherwise "".

Rules:
- Ignore page numbers, instructions, exercises and anything that is not part of the vocabulary list.
- Do not invent words that are not on the page.
- If the photo is unreadable or contains no vocabulary, return an empty words array.`;
}

function getOutputText(payload: any): string {
  if (typeof payload?.output_text === "string") return payload.output_text;
  for (const item of Array.isArray(payload?.output) ? payload.output : []) {
    for (const content of Array.isArray(item?.content) ? item.content : []) {
      if (typeof content?.text === "string") return content.text;
    }
  }
  return "";
}

export async function extractVocabFromImage(
  language: VocabLanguage,
  imageDataUrl: string,
): Promise<{ title: string; words: VocabWordInput[] }> {
  const apiKey = process.env.TEACHER;
  if (!apiKey) throw new Error("Λείπει το κλειδί AI (TEACHER) από το περιβάλλον.");

  const model =
    process.env.SIDERIS_VOCAB_MODEL?.trim() || process.env.PHYSICS_ANALYSIS_MODEL?.trim() || "gpt-5.6";

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 120_000);
  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        model,
        input: [
          {
            role: "user",
            content: [
              { type: "input_text", text: prompt(language) },
              { type: "input_image", image_url: imageDataUrl, detail: "high" },
            ],
          },
        ],
        text: {
          format: { type: "json_schema", name: "vocabulary_list", strict: true, schema: SCHEMA },
        },
      }),
    });
    const payload = await response.json().catch(() => null);
    if (!response.ok) {
      throw new Error(payload?.error?.message || `Το AI απάντησε με σφάλμα ${response.status}.`);
    }
    const output = getOutputText(payload);
    if (!output) throw new Error("Το AI δεν επέστρεψε λέξεις.");
    const parsed = JSON.parse(output);
    return {
      title: String(parsed?.title ?? "").trim().slice(0, 160),
      words: cleanWords(parsed?.words),
    };
  } finally {
    clearTimeout(timeout);
  }
}
