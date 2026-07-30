import type { SeoDecisionContext } from "@/lib/gsc/advisor-context";

export type SeoInterpretationFinding = {
  title: string;
  classification: "problem" | "opportunity" | "seasonality" | "noise" | "cannibalization";
  impact: "high" | "medium" | "low";
  lifecycle: "new" | "persistent" | "watch";
  meaning: string;
  likelyCause: string;
  action: string;
  doNotDo: string;
  confidence: "high" | "medium" | "low";
  evidence: string;
  scopeLabel: string;
  trackingMetric: string;
  reviewInDays: number;
};

export type SeoAiInterpretation = {
  headline: string;
  executiveSummary: string;
  verdict: "healthy" | "watch" | "action";
  healthScore: number;
  whatChanged: string;
  primaryAction: string;
  doNotDo: string;
  nextReviewFocus: string;
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
      queryBreakdown: Array.isArray(item?.queryBreakdown) ? item.queryBreakdown.slice(0, 8) : [],
    })),
  };
}

function compactDecisionContext(context: SeoDecisionContext | null | undefined) {
  if (!context) return null;
  return {
    latestCompleteDate: context.latestCompleteDate,
    windows: context.windows,
    site: context.site,
    pageTrends: context.pageTrends.slice(0, 15),
    pageDeclines: context.pageDeclines,
    lowCtrPages: context.lowCtrPages,
    queryTrends: context.queryTrends.slice(0, 25),
    queryLosses: context.queryLosses,
    queryGains: context.queryGains,
    opportunities: context.opportunities,
    countries: context.countries,
    devices: context.devices,
    searchAppearances: context.searchAppearances,
    searchTypes: context.searchTypes,
    cannibalization: context.cannibalization,
    decisionMemory: context.decisionMemory,
    coverage: context.coverage,
  };
}

function fallbackInterpretation(data: any, context?: SeoDecisionContext | null): SeoAiInterpretation {
  const priorities = Array.isArray(data?.priorities) ? data.priorities : [];
  const high = priorities.filter((item: any) => item?.severity === "high");
  const first = high[0] || priorities[0];
  const verdict: SeoAiInterpretation["verdict"] = high.length ? "action" : priorities.length ? "watch" : "healthy";
  const healthScore = verdict === "healthy" ? 85 : verdict === "watch" ? 68 : 45;

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
    healthScore,
    whatChanged: context?.decisionMemory?.[0]
      ? `Η τελευταία διαθέσιμη απόφαση ήταν: ${context.decisionMemory[0].headline}. Δεν έγινε AI σύγκριση επειδή χρησιμοποιήθηκε fallback.`
      : "Δεν υπάρχει προηγούμενη αποθηκευμένη απόφαση για σύγκριση.",
    primaryAction: first?.action || "Συνεχίζουμε να μετράμε πριν κάνουμε αλλαγές.",
    doNotDo: "Δεν αλλάζουμε μαζικά titles, περιεχόμενο ή URLs μόνο επειδή ένας μεμονωμένος δείκτης κινήθηκε αρνητικά.",
    nextReviewFocus: "Επανέλεγχος των ίδιων βασικών signals στην επόμενη προγραμματισμένη ανάλυση.",
    findings: priorities.slice(0, 4).map((item: any) => ({
      title: item?.title || "SEO εύρημα",
      classification: item?.severity === "high" ? "problem" : "opportunity",
      impact: item?.severity === "high" ? "high" : item?.severity === "medium" ? "medium" : "low",
      lifecycle: "watch",
      meaning: item?.diagnosis || item?.explanation || "Χρειάζεται περαιτέρω έλεγχος.",
      likelyCause: "Η πιθανή αιτία δεν μπορεί να επιβεβαιωθεί χωρίς επιπλέον σήματα πέρα από τα αποθηκευμένα GSC δεδομένα.",
      action: item?.action || "Παρακολούθηση και επανέλεγχος.",
      doNotDo: "Δεν κάνουμε δεύτερη αλλαγή πριν μετρηθεί η πρώτη υπόθεση.",
      confidence: item?.severity === "high" ? "medium" : "low",
      evidence: item?.evidence || "",
      scopeLabel: item?.query || item?.page || "Site-wide",
      trackingMetric: "Clicks, impressions, CTR και μέση θέση",
      reviewInDays: 14,
    })),
  };
}

export async function interpretSeoAdvisorData(
  data: any,
  context?: SeoDecisionContext | null,
): Promise<SeoAiInterpretation> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return fallbackInterpretation(data, context);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 45_000);

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
        temperature: 0.15,
        input: [
          {
            role: "system",
            content: [
              {
                type: "input_text",
                text: [
                  "Είσαι senior SEO decision analyst για το Voulamandis House στη Χίο.",
                  "Δεν είσαι dashboard commentator. Αποστολή σου είναι να αποφασίσεις τι πραγματικά σημαίνουν τα δεδομένα και τι πρέπει να γίνει.",
                  "Γράψε στα ελληνικά, καθαρά, πρακτικά και χωρίς jargon όπου δεν χρειάζεται.",
                  "Χρησιμοποίησε ΟΛΕΣ τις διαθέσιμες διαστάσεις: site, pages, queries, query-page opportunities, countries, devices, search appearance, search types, cannibalization signals, YoY, seasonality και intent ownership.",
                  "Τα δεδομένα του decisionContext βασίζονται στην τελευταία πλήρη GSC ημέρα. Μην στηρίζεις απόφαση σε partial data.",
                  "Ξεχώρισε πάντα παρατήρηση από υπόθεση. Ποτέ μην παρουσιάζεις πιθανή αιτία ως βεβαιότητα.",
                  "Πρώτα κάνε root-cause analysis. Ranking loss, demand/seasonality, CTR/snippet, market/device shift, intent drift/cannibalization ή noise είναι διαφορετικές αιτίες.",
                  "Μην βαφτίζεις πτώση site-wide όταν το signal περιορίζεται σε μία χώρα, συσκευή, query ή page.",
                  "Για κάθε εύρημα αξιολόγησε business impact και confidence. Μόνο 3 έως 5 findings με πραγματική σημασία.",
                  "Μην προτείνεις νέα landing page όταν το intent έχει ήδη owner. Μην προτείνεις αλλαγή URL/canonical χωρίς σαφή τεχνική ένδειξη.",
                  "Μην προτείνεις μαζικές αλλαγές. Προτίμησε μία συγκεκριμένη ενέργεια που μπορεί να μετρηθεί.",
                  "Διάβασε decisionMemory. Αν η ίδια πρόταση έγινε πριν λίγες ημέρες, μην προτείνεις δεύτερη αλλαγή πριν υπάρξει αρκετός χρόνος μέτρησης.",
                  "Μην ισχυρίζεσαι ότι μια προηγούμενη πρόταση υλοποιήθηκε. Η μνήμη καταγράφει προτάσεις/αποφάσεις, όχι επιβεβαιωμένη υλοποίηση.",
                  "Αν η εικόνα είναι εποχικότητα, market mix ή θόρυβος, πες καθαρά ότι δεν χρειάζεται επέμβαση.",
                  "Το healthScore είναι 0-100 και πρέπει να αντανακλά συνολικά data quality, visibility, direction και σοβαρότητα των findings.",
                  "Το whatChanged συγκρίνει τη σημερινή εικόνα με τις προηγούμενες αποθηκευμένες αποφάσεις χωρίς να εφευρίσκει αλλαγές.",
                  "Για κάθε finding δώσε scopeLabel, τι σημαίνει, πιθανότερη αιτία, evidence, τι κάνουμε, τι δεν κάνουμε, tracking metric και σε πόσες ημέρες αξίζει επανέλεγχος.",
                ].join("\n"),
              },
            ],
          },
          {
            role: "user",
            content: [
              {
                type: "input_text",
                text: JSON.stringify({
                  ruleBasedAdvisor: compactAdvisorData(data),
                  decisionContext: compactDecisionContext(context),
                }),
              },
            ],
          },
        ],
        text: {
          format: {
            type: "json_schema",
            name: "seo_decision",
            strict: true,
            schema: {
              type: "object",
              additionalProperties: false,
              properties: {
                headline: { type: "string" },
                executiveSummary: { type: "string" },
                verdict: { type: "string", enum: ["healthy", "watch", "action"] },
                healthScore: { type: "integer", minimum: 0, maximum: 100 },
                whatChanged: { type: "string" },
                primaryAction: { type: "string" },
                doNotDo: { type: "string" },
                nextReviewFocus: { type: "string" },
                findings: {
                  type: "array",
                  minItems: 0,
                  maxItems: 5,
                  items: {
                    type: "object",
                    additionalProperties: false,
                    properties: {
                      title: { type: "string" },
                      classification: { type: "string", enum: ["problem", "opportunity", "seasonality", "noise", "cannibalization"] },
                      impact: { type: "string", enum: ["high", "medium", "low"] },
                      lifecycle: { type: "string", enum: ["new", "persistent", "watch"] },
                      meaning: { type: "string" },
                      likelyCause: { type: "string" },
                      action: { type: "string" },
                      doNotDo: { type: "string" },
                      confidence: { type: "string", enum: ["high", "medium", "low"] },
                      evidence: { type: "string" },
                      scopeLabel: { type: "string" },
                      trackingMetric: { type: "string" },
                      reviewInDays: { type: "integer", minimum: 3, maximum: 30 },
                    },
                    required: ["title", "classification", "impact", "lifecycle", "meaning", "likelyCause", "action", "doNotDo", "confidence", "evidence", "scopeLabel", "trackingMetric", "reviewInDays"],
                  },
                },
              },
              required: ["headline", "executiveSummary", "verdict", "healthScore", "whatChanged", "primaryAction", "doNotDo", "nextReviewFocus", "findings"],
            },
          },
        },
      }),
    });

    const payload = await response.json().catch(() => null);
    if (!response.ok) {
      console.error("[gsc-analysis] interpretation request failed", payload?.error || response.status);
      return fallbackInterpretation(data, context);
    }

    const text = responseText(payload);
    if (!text) return fallbackInterpretation(data, context);
    return JSON.parse(text) as SeoAiInterpretation;
  } catch (error) {
    console.error("[gsc-analysis] interpretation failed", error);
    return fallbackInterpretation(data, context);
  } finally {
    clearTimeout(timeout);
  }
}
