type Language = "en" | "el" | "fr" | "de" | "it" | "es" | "tr";

type ChatMessage = { role: "user" | "assistant"; content: string };
type SearchState = { checkin: string; checkout: string; guests: number };

type Offer = {
  roomId: string;
  unitId: string;
  name: string;
  category: string;
  floor: string;
  maxGuests: number;
  features: string[];
  nights: number;
  originalTotal: number;
  directTotal: number;
  saving: number;
  [key: string]: unknown;
};

type Recommendation = {
  offerKey: string;
  role: "recommended" | "budget" | "comfort" | "alternative";
  title: string;
  reason: string;
};

type SalesPlan = {
  answer: string;
  recommendations: Recommendation[];
};

const SALES_TIMEOUT_MS = 10_000;

function responseText(payload: any): string {
  if (typeof payload?.output_text === "string") return payload.output_text;
  for (const item of payload?.output || []) {
    for (const content of item?.content || []) {
      if (typeof content?.text === "string") return content.text;
    }
  }
  return "";
}

function fallbackAnswer(language: Language, offers: Offer[]) {
  const first = offers[0];
  if (!first) return "";
  if (language === "el") {
    return `Με βάση όσα μου είπατε, θα ξεκινούσα από το ${first.name}. Είναι η πιο ισορροπημένη διαθέσιμη επιλογή για τη διαμονή σας. Σας δείχνω επίσης την οικονομικότερη και την πιο άνετη εναλλακτική, ώστε να αποφασίσετε με πλήρη εικόνα.`;
  }
  return `Based on what you told me, I would start with ${first.name}. It is the most balanced available option for your stay. I am also showing the best-value and most comfortable alternatives so you can decide with a clear picture.`;
}

function fallbackPlan(language: Language, offers: Offer[]): SalesPlan {
  const byPrice = [...offers].sort((a, b) => a.directTotal - b.directTotal);
  const cheapest = byPrice[0];
  const comfort = [...offers].sort((a, b) => {
    const aScore = a.features.join(" ").toLowerCase().includes("kitchen") ? 1 : 0;
    const bScore = b.features.join(" ").toLowerCase().includes("kitchen") ? 1 : 0;
    return bScore - aScore || b.maxGuests - a.maxGuests || b.directTotal - a.directTotal;
  })[0];
  const recommended = offers.find((offer) => offer.maxGuests >= 3) || cheapest;
  const seen = new Set<string>();
  const recommendations: Recommendation[] = [];
  const add = (offer: Offer | undefined, role: Recommendation["role"], title: string, reason: string) => {
    if (!offer) return;
    const offerKey = `${offer.roomId}:${offer.unitId}`;
    if (seen.has(offerKey)) return;
    seen.add(offerKey);
    recommendations.push({ offerKey, role, title, reason });
  };
  add(recommended, "recommended", language === "el" ? "Η πρότασή μου" : "My recommendation", language === "el" ? "Η πιο ισορροπημένη επιλογή για τα στοιχεία της διαμονής σας." : "The most balanced match for your stay details.");
  add(cheapest, "budget", language === "el" ? "Χαμηλότερη τιμή" : "Best price", language === "el" ? "Η οικονομικότερη κατάλληλη διαθέσιμη επιλογή." : "The lowest-priced suitable available option.");
  add(comfort, "comfort", language === "el" ? "Περισσότερη άνεση" : "More comfort", language === "el" ? "Περισσότερος χώρος ή επιπλέον πρακτικές παροχές." : "More space or additional practical amenities.");
  return { answer: fallbackAnswer(language, recommendations.map((item) => offers.find((offer) => `${offer.roomId}:${offer.unitId}` === item.offerKey)!).filter(Boolean)), recommendations };
}

export async function personalizeOffers(params: {
  messages: ChatMessage[];
  search: SearchState;
  offers: Offer[];
  language: Language;
}) {
  const { messages, search, offers, language } = params;
  if (!offers.length) return { answer: "", offers };
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    const fallback = fallbackPlan(language, offers);
    return applyPlan(offers, fallback);
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), SALES_TIMEOUT_MS);
  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        model: process.env.OPENAI_ASSISTANT_MODEL || "gpt-4.1-mini",
        temperature: 0.2,
        input: [
          {
            role: "system",
            content: [{
              type: "input_text",
              text: [
                "You are the senior reservations and sales concierge of Voulamandis House in Chios.",
                "Create a tailor-made, honest and warm recommendation from real availability only.",
                "Infer needs semantically from the whole conversation. Never depend on literal keywords or rigid phrase matching.",
                "Recommend what genuinely fits, not automatically the most expensive room.",
                "Use only the supplied room facts and prices. Never invent amenities, policies, urgency, scarcity, guest ages or preferences.",
                "When the user's preference is unclear, make a balanced recommendation and clearly distinguish the lowest-price and higher-comfort options.",
                "Explain trade-offs honestly. A smaller or cheaper room must not be described as equally comfortable when it is not.",
                "Use total price differences and, when useful, the difference per night. Do not use manipulative pressure or fake scarcity.",
                "The answer must feel personal, concise and memorable, in the requested language. Use 2 to 4 short paragraphs, no markdown table.",
                "Return up to four unique recommendations ordered: recommended, budget, comfort, alternative.",
              ].join("\n"),
            }],
          },
          {
            role: "user",
            content: [{
              type: "input_text",
              text: JSON.stringify({ language, search, conversation: messages.slice(-12), offers: offers.map((offer) => ({
                offerKey: `${offer.roomId}:${offer.unitId}`,
                name: offer.name,
                category: offer.category,
                floor: offer.floor,
                maxGuests: offer.maxGuests,
                features: offer.features,
                nights: offer.nights,
                originalTotal: offer.originalTotal,
                directTotal: offer.directTotal,
                saving: offer.saving,
              })) }),
            }],
          },
        ],
        text: {
          format: {
            type: "json_schema",
            name: "sales_concierge_plan",
            strict: true,
            schema: {
              type: "object",
              additionalProperties: false,
              properties: {
                answer: { type: "string" },
                recommendations: {
                  type: "array",
                  maxItems: 4,
                  items: {
                    type: "object",
                    additionalProperties: false,
                    properties: {
                      offerKey: { type: "string" },
                      role: { type: "string", enum: ["recommended", "budget", "comfort", "alternative"] },
                      title: { type: "string" },
                      reason: { type: "string" },
                    },
                    required: ["offerKey", "role", "title", "reason"],
                  },
                },
              },
              required: ["answer", "recommendations"],
            },
          },
        },
      }),
    });
    const payload = await response.json().catch(() => null);
    if (!response.ok) throw new Error(payload?.error?.message || `OpenAI sales planning failed (${response.status})`);
    const text = responseText(payload);
    if (!text) throw new Error("OpenAI returned no sales plan");
    const plan = JSON.parse(text) as SalesPlan;
    return applyPlan(offers, plan);
  } catch (error) {
    console.error("Sales concierge planning failed", error);
    return applyPlan(offers, fallbackPlan(language, offers));
  } finally {
    clearTimeout(timeout);
  }
}

function applyPlan(offers: Offer[], plan: SalesPlan) {
  const validKeys = new Set(offers.map((offer) => `${offer.roomId}:${offer.unitId}`));
  const unique = new Map<string, Recommendation>();
  for (const item of plan.recommendations || []) {
    if (validKeys.has(item.offerKey) && !unique.has(item.offerKey)) unique.set(item.offerKey, item);
  }
  const rank: Record<Recommendation["role"], number> = { recommended: 0, budget: 1, comfort: 2, alternative: 3 };
  const enriched = offers.map((offer) => {
    const recommendation = unique.get(`${offer.roomId}:${offer.unitId}`);
    return {
      ...offer,
      recommendationRole: recommendation?.role || "alternative",
      recommendationTitle: recommendation?.title || "",
      recommendationReason: recommendation?.reason || "",
    };
  }).sort((a, b) => {
    const aRank = rank[a.recommendationRole as Recommendation["role"]] ?? 4;
    const bRank = rank[b.recommendationRole as Recommendation["role"]] ?? 4;
    return aRank - bRank || a.directTotal - b.directTotal;
  });
  return { answer: plan.answer, offers: enriched };
}
