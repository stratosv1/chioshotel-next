export type SeoInterpretationFinding = {
  title: string;
  meaning: string;
  likelyCause: string;
  action: string;
  confidence: "high" | "medium" | "low";
  evidence: string;
};

export type SeoAiInterpretation = {
  headline: string;
  executiveSummary: string;
  verdict: "healthy" | "watch" | "action";
  primaryAction: string;
  doNotDo: string;
  findings: SeoInterpretationFinding[];
};

function responseText(payload: any): string {
  if (typeof payload?.output_text === "string") return payload.output_text;
  for (const item of payload?.output || []) {
    for (const content of item?.content || []) {
      if (typeof content?.text === "string") return content.text;
    }
  }
  return "";
}

function compactAdvisorData(data: any) {
  const priorities = Array.isArray(data?.priorities) ? data.priorities : [];
  return {
    latestDate: data?.latestDate || null,
    status: data?.status || "",
    summary: data?.summary || "",
    current: data?.current || null,
    previous: data?.previous || null,
    changes: data?.changes || null,
    yearOverYear: data?.yearOverYear || null,
    seasonality: data?.seasonality || null,
    priorities: priorities.slice(0, 8).map((item: any) => ({
      severity: item?.severity || "",
      title: item?.title || "",
      explanation: item?.explanation || "",
      diagnosis: item?.diagnosis || "",
      action: item?.action || "",
      evidence: item?.evidence || "",
      page: item?.page || "",
      query: item?.query || "",
      intent: item?.intent || null,
      queryBreakdown: Array.isArray(item?.queryBreakdown)
        ? item.queryBreakdown.slice(0, 6)
        : [],
    })),
  };
}

function fallbackInterpretation(data: any): SeoAiInterpretation {
  const priorities = Array.isArray(data?.priorities) ? data.priorities : [];
  const high = priorities.filter((item: any) => item?.severity === "high");
  const first = high[0] || priorities[0];
  const verdict: SeoAiInterpretation["verdict"] = high.length
    ? "action"
    : priorities.length
      ? "watch"
      : "healthy";

  return {
    headline: high.length
      ? "Υπάρχει τουλάχιστον ένα εύρημα που αξίζει άμεσο έλεγχο"
      : priorities.length
        ? "Η εικόνα χρειάζεται παρακολούθηση, όχι βιαστικές αλλαγές"
        : "Δεν προκύπτει ισχυρό SEO alarm από τα διαθέσιμα δεδομένα",
    executiveSummary:
      data?.summary ||
      "Η αυτόματη αξιολόγηση ολοκληρώθηκε, αλλά δεν ήταν διαθέσιμη η AI ερμηνεία. Χρησιμοποιούνται τα επιβεβαιωμένα GSC ευρήματα ως ασφαλές fallback.",
    verdict,
    primaryAction: first?.action || "Συνεχίζουμε να μετράμε πριν κάνουμε αλλαγές.",
    doNotDo:
      "Δεν αλλάζουμε μαζικά titles, περιεχόμενο ή URLs μόνο επειδή ένας μεμονωμένος δείκτης κινήθηκε αρνητικά.",
    findings: priorities.slice(0, 4).map((item: any) => ({
      title: item?.title || "SEO εύρημα",
      meaning: item?.diagnosis || item?.explanation || "Χρειάζεται περαιτέρω έλεγχος.",
      likelyCause: "Η πιθανή αιτία δεν μπορεί να επιβεβαιωθεί χωρίς επιπλέον σήματα πέρα από τα αποθηκευμένα GSC δεδομένα.",
      action: item?.action || "Παρακολούθηση και επανέλεγχος.",
      confidence: item?.severity === "high" ? "medium" : "low",
      evidence: item?.evidence || "",
    })),
  };
}

export async function interpretSeoAdvisorData(data: any): Promise<SeoAiInterpretation> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return fallbackInterpretation(data);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30_000);

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: process.env.OPENAI_SEO_MODEL || process.env.OPENAI_ASSISTANT_MODEL || "gpt-4.1-mini",
        temperature: 0.2,
        input: [
          {
            role: "system",
            content: [
              {
                type: "input_text",
                text: [
                  "Είσαι senior SEO analyst για το Voulamandis House στη Χίο.",
                  "Η δουλειά σου δεν είναι να επαναλάβεις τα metrics αλλά να τα ερμηνεύσεις για ιδιοκτήτη καταλύματος.",
                  "Γράψε στα ελληνικά, καθαρά και πρακτικά.",
                  "Ξεχώρισε παρατήρηση από υπόθεση. Μην παρουσιάζεις πιθανή αιτία ως βεβαιότητα.",
                  "Λάβε σοβαρά υπόψη seasonality, YoY, ranking, CTR, impressions και intent ownership.",
                  "Μην προτείνεις νέα landing page όταν το intent έχει ήδη owner.",
                  "Μην προτείνεις μαζικές αλλαγές. Προτίμησε μία συγκεκριμένη ενέργεια όταν υπάρχει πραγματικό signal.",
                  "Αν η εικόνα είναι κυρίως εποχικότητα ή θόρυβος, πες ξεκάθαρα ότι δεν χρειάζεται επέμβαση.",
                  "Για κάθε εύρημα εξήγησε: τι σημαίνει, πιθανή αιτία, τι κάνουμε και πόσο βέβαιη είναι η ερμηνεία.",
                ].join("\n"),
              },
            ],
          },
          {
            role: "user",
            content: [
              {
                type: "input_text",
                text: JSON.stringify(compactAdvisorData(data)),
              },
            ],
          },
        ],
        text: {
          format: {
            type: "json_schema",
            name: "seo_interpretation",
            strict: true,
            schema: {
              type: "object",
              additionalProperties: false,
              properties: {
                headline: { type: "string" },
                executiveSummary: { type: "string" },
                verdict: { type: "string", enum: ["healthy", "watch", "action"] },
                primaryAction: { type: "string" },
                doNotDo: { type: "string" },
                findings: {
                  type: "array",
                  maxItems: 5,
                  items: {
                    type: "object",
                    additionalProperties: false,
                    properties: {
                      title: { type: "string" },
                      meaning: { type: "string" },
                      likelyCause: { type: "string" },
                      action: { type: "string" },
                      confidence: { type: "string", enum: ["high", "medium", "low"] },
                      evidence: { type: "string" },
                    },
                    required: ["title", "meaning", "likelyCause", "action", "confidence", "evidence"],
                  },
                },
              },
              required: ["headline", "executiveSummary", "verdict", "primaryAction", "doNotDo", "findings"],
            },
          },
        },
      }),
    });

    const payload = await response.json().catch(() => null);
    if (!response.ok) {
      console.error("[gsc-analysis] interpretation request failed", payload?.error || response.status);
      return fallbackInterpretation(data);
    }

    const text = responseText(payload);
    if (!text) return fallbackInterpretation(data);
    return JSON.parse(text) as SeoAiInterpretation;
  } catch (error) {
    console.error("[gsc-analysis] interpretation failed", error);
    return fallbackInterpretation(data);
  } finally {
    clearTimeout(timeout);
  }
}
