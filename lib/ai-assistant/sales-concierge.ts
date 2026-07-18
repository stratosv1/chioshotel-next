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

type RecommendationRole = "recommended" | "budget" | "comfort" | "alternative";

type Recommendation = {
  offerKey: string;
  role: RecommendationRole;
  title: string;
  reason: string;
};

type SalesPlan = {
  answer: string;
  recommendations: Recommendation[];
};

const SALES_TIMEOUT_MS = 4_500;
const ROLE_ORDER: RecommendationRole[] = ["recommended", "budget", "comfort", "alternative"];

const COPY: Record<Language, {
  answer: (name: string) => string;
  recommendedTitle: string;
  recommendedReason: string;
  budgetTitle: string;
  budgetReason: string;
  comfortTitle: string;
  comfortReason: string;
  alternativeTitle: string;
  alternativeReason: string;
}> = {
  en: {
    answer: (name) => `Based on what you told me, I would start with ${name}. It is the most balanced available option for your stay. I am also showing the lowest-price and higher-comfort alternatives so you can compare clearly.`,
    recommendedTitle: "My recommendation",
    recommendedReason: "The most balanced match for your stay details.",
    budgetTitle: "Best price",
    budgetReason: "The lowest-priced suitable available option.",
    comfortTitle: "More comfort",
    comfortReason: "More space or additional practical amenities.",
    alternativeTitle: "Another good option",
    alternativeReason: "A suitable alternative worth comparing.",
  },
  el: {
    answer: (name) => `Με βάση όσα μου είπατε, θα ξεκινούσα από το ${name}. Είναι η πιο ισορροπημένη διαθέσιμη επιλογή για τη διαμονή σας. Σας δείχνω επίσης την οικονομικότερη και την πιο άνετη εναλλακτική για καθαρή σύγκριση.`,
    recommendedTitle: "Η πρότασή μου",
    recommendedReason: "Η πιο ισορροπημένη επιλογή για τα στοιχεία της διαμονής σας.",
    budgetTitle: "Χαμηλότερη τιμή",
    budgetReason: "Η οικονομικότερη κατάλληλη διαθέσιμη επιλογή.",
    comfortTitle: "Περισσότερη άνεση",
    comfortReason: "Περισσότερος χώρος ή επιπλέον πρακτικές παροχές.",
    alternativeTitle: "Μια ακόμη καλή επιλογή",
    alternativeReason: "Μια κατάλληλη εναλλακτική που αξίζει να συγκρίνετε.",
  },
  fr: {
    answer: (name) => `D’après ce que vous m’avez indiqué, je commencerais par ${name}. C’est l’option disponible la plus équilibrée pour votre séjour. Je vous montre aussi l’option la moins chère et celle offrant davantage de confort.`,
    recommendedTitle: "Ma recommandation",
    recommendedReason: "Le meilleur équilibre pour les détails de votre séjour.",
    budgetTitle: "Meilleur prix",
    budgetReason: "L’option adaptée disponible au prix le plus bas.",
    comfortTitle: "Plus de confort",
    comfortReason: "Plus d’espace ou des équipements pratiques supplémentaires.",
    alternativeTitle: "Autre bonne option",
    alternativeReason: "Une alternative adaptée à comparer.",
  },
  de: {
    answer: (name) => `Nach Ihren Angaben würde ich mit ${name} beginnen. Es ist die ausgewogenste verfügbare Option für Ihren Aufenthalt. Zusätzlich zeige ich Ihnen die günstigste und die komfortablere Alternative.`,
    recommendedTitle: "Meine Empfehlung",
    recommendedReason: "Die ausgewogenste Wahl für Ihre Reisedaten.",
    budgetTitle: "Bester Preis",
    budgetReason: "Die günstigste passende verfügbare Option.",
    comfortTitle: "Mehr Komfort",
    comfortReason: "Mehr Platz oder zusätzliche praktische Ausstattung.",
    alternativeTitle: "Weitere gute Option",
    alternativeReason: "Eine passende Alternative zum Vergleichen.",
  },
  it: {
    answer: (name) => `In base a ciò che mi avete indicato, inizierei da ${name}. È l’opzione disponibile più equilibrata per il vostro soggiorno. Vi mostro anche l’alternativa più economica e quella più confortevole.`,
    recommendedTitle: "La mia proposta",
    recommendedReason: "La soluzione più equilibrata per i dettagli del soggiorno.",
    budgetTitle: "Prezzo migliore",
    budgetReason: "L’opzione adatta disponibile al prezzo più basso.",
    comfortTitle: "Più comfort",
    comfortReason: "Più spazio o servizi pratici aggiuntivi.",
    alternativeTitle: "Un’altra buona opzione",
    alternativeReason: "Un’alternativa adatta da confrontare.",
  },
  es: {
    answer: (name) => `Según lo que me ha indicado, empezaría por ${name}. Es la opción disponible más equilibrada para su estancia. También le muestro la alternativa de menor precio y la de mayor comodidad.`,
    recommendedTitle: "Mi recomendación",
    recommendedReason: "La opción más equilibrada para los datos de su estancia.",
    budgetTitle: "Mejor precio",
    budgetReason: "La opción adecuada disponible con el precio más bajo.",
    comfortTitle: "Más comodidad",
    comfortReason: "Más espacio o servicios prácticos adicionales.",
    alternativeTitle: "Otra buena opción",
    alternativeReason: "Una alternativa adecuada que merece comparar.",
  },
  tr: {
    answer: (name) => `Paylaştığınız bilgilere göre önce ${name} seçeneğine bakmanızı öneririm. Konaklamanız için en dengeli müsait seçenektir. Ayrıca en uygun fiyatlı ve daha konforlu alternatifleri de gösteriyorum.`,
    recommendedTitle: "Önerim",
    recommendedReason: "Konaklama bilgileriniz için en dengeli seçenek.",
    budgetTitle: "En iyi fiyat",
    budgetReason: "Uygun ve müsait seçenekler arasındaki en düşük fiyat.",
    comfortTitle: "Daha fazla konfor",
    comfortReason: "Daha fazla alan veya ek pratik olanaklar.",
    alternativeTitle: "Başka iyi bir seçenek",
    alternativeReason: "Karşılaştırmaya değer uygun bir alternatif.",
  },
};

function offerKey(offer: Offer) {
  return `${offer.roomId}:${offer.unitId}`;
}

function responseText(payload: any): string {
  if (typeof payload?.output_text === "string") return payload.output_text;
  for (const item of payload?.output || []) {
    for (const content of item?.content || []) {
      if (typeof content?.text === "string") return content.text;
    }
  }
  return "";
}

function comfortScore(offer: Offer, guests: number) {
  const facts = `${offer.category} ${offer.floor} ${offer.features.join(" ")}`.toLowerCase();
  const kitchen = /(kitchen|kitchenette|κουζ|cuisine|küche|cucina|cocina|mutfak)/i.test(facts) ? 3 : 0;
  const apartment = /(apartment|διαμέρισμα|appartement|wohnung|appartamento|apartamento|daire)/i.test(facts) ? 2 : 0;
  const spareCapacity = Math.max(0, offer.maxGuests - guests);
  return kitchen + apartment + spareCapacity;
}

function balancedScore(offer: Offer, guests: number, cheapestTotal: number) {
  const capacityFit = offer.maxGuests === guests ? 5 : Math.max(0, 4 - (offer.maxGuests - guests));
  const pricePenalty = cheapestTotal > 0 ? (offer.directTotal - cheapestTotal) / cheapestTotal : 0;
  return capacityFit + comfortScore(offer, guests) - pricePenalty * 3;
}

function fallbackPlan(language: Language, offers: Offer[], guests: number): SalesPlan {
  const suitable = offers.filter((offer) => offer.maxGuests >= guests);
  const candidates = suitable.length ? suitable : offers;
  const byPrice = [...candidates].sort((a, b) => a.directTotal - b.directTotal);
  const cheapest = byPrice[0];
  const recommended = [...candidates].sort((a, b) =>
    balancedScore(b, guests, cheapest?.directTotal || 0) - balancedScore(a, guests, cheapest?.directTotal || 0)
      || a.directTotal - b.directTotal,
  )[0];
  const comfort = [...candidates].sort((a, b) =>
    comfortScore(b, guests) - comfortScore(a, guests)
      || b.maxGuests - a.maxGuests
      || b.directTotal - a.directTotal,
  )[0];
  const alternative = candidates.find((offer) => ![recommended, cheapest, comfort].includes(offer));
  const copy = COPY[language];
  const seen = new Set<string>();
  const recommendations: Recommendation[] = [];

  const add = (offer: Offer | undefined, role: RecommendationRole, title: string, reason: string) => {
    if (!offer || seen.has(offerKey(offer))) return;
    seen.add(offerKey(offer));
    recommendations.push({ offerKey: offerKey(offer), role, title, reason });
  };

  add(recommended, "recommended", copy.recommendedTitle, copy.recommendedReason);
  add(cheapest, "budget", copy.budgetTitle, copy.budgetReason);
  add(comfort, "comfort", copy.comfortTitle, copy.comfortReason);
  add(alternative, "alternative", copy.alternativeTitle, copy.alternativeReason);

  const firstRecommended = recommendations[0]
    ? offers.find((offer) => offerKey(offer) === recommendations[0].offerKey)
    : candidates[0];

  return {
    answer: firstRecommended ? copy.answer(firstRecommended.name) : "",
    recommendations,
  };
}

export async function personalizeOffers(params: {
  messages: ChatMessage[];
  search: SearchState;
  offers: Offer[];
  language: Language;
}) {
  const { messages, search, offers, language } = params;
  if (!offers.length) return { answer: "", offers };

  const fallback = fallbackPlan(language, offers, search.guests);
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return applyPlan(offers, fallback, language);

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
                "Every recommended room must accommodate the requested guest count.",
                "When the user's preference is unclear, make a balanced recommendation and clearly distinguish the lowest-price and higher-comfort options.",
                "Explain trade-offs honestly. A smaller or cheaper room must not be described as equally comfortable when it is not.",
                "Use total price differences and, when useful, the difference per night. Do not use manipulative pressure or fake scarcity.",
                "The answer must feel personal, concise and memorable, in the requested language. Use 2 to 4 short paragraphs, no markdown table.",
                "Return up to four unique rooms and use each role at most once, ordered: recommended, budget, comfort, alternative.",
              ].join("\n"),
            }],
          },
          {
            role: "user",
            content: [{
              type: "input_text",
              text: JSON.stringify({
                language,
                search,
                conversation: messages.slice(-12),
                offers: offers.map((offer) => ({
                  offerKey: offerKey(offer),
                  name: offer.name,
                  category: offer.category,
                  floor: offer.floor,
                  maxGuests: offer.maxGuests,
                  features: offer.features,
                  nights: offer.nights,
                  originalTotal: offer.originalTotal,
                  directTotal: offer.directTotal,
                  saving: offer.saving,
                })),
              }),
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
                      role: { type: "string", enum: ROLE_ORDER },
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
    return applyPlan(offers, plan, language, fallback);
  } catch (error) {
    console.error("Sales concierge planning failed", error);
    return applyPlan(offers, fallback, language);
  } finally {
    clearTimeout(timeout);
  }
}

function applyPlan(offers: Offer[], plan: SalesPlan, language: Language, fallback?: SalesPlan) {
  const validKeys = new Set(offers.map(offerKey));
  const usedKeys = new Set<string>();
  const usedRoles = new Set<RecommendationRole>();
  const accepted: Recommendation[] = [];

  for (const item of plan.recommendations || []) {
    if (!validKeys.has(item.offerKey) || usedKeys.has(item.offerKey) || usedRoles.has(item.role)) continue;
    if (!ROLE_ORDER.includes(item.role)) continue;
    usedKeys.add(item.offerKey);
    usedRoles.add(item.role);
    accepted.push({
      offerKey: item.offerKey,
      role: item.role,
      title: String(item.title || "").trim(),
      reason: String(item.reason || "").trim(),
    });
  }

  for (const item of fallback?.recommendations || []) {
    if (accepted.length >= 4 || usedKeys.has(item.offerKey) || usedRoles.has(item.role)) continue;
    usedKeys.add(item.offerKey);
    usedRoles.add(item.role);
    accepted.push(item);
  }

  const byKey = new Map(accepted.map((item) => [item.offerKey, item]));
  const rank = Object.fromEntries(ROLE_ORDER.map((role, index) => [role, index])) as Record<RecommendationRole, number>;
  const enriched = offers.map((offer) => {
    const recommendation = byKey.get(offerKey(offer));
    return {
      ...offer,
      recommendationRole: recommendation?.role || "alternative",
      recommendationTitle: recommendation?.title || "",
      recommendationReason: recommendation?.reason || "",
    };
  }).sort((a, b) => {
    const aRank = rank[a.recommendationRole as RecommendationRole] ?? 4;
    const bRank = rank[b.recommendationRole as RecommendationRole] ?? 4;
    return aRank - bRank || a.directTotal - b.directTotal;
  });

  const cleanAnswer = typeof plan.answer === "string" ? plan.answer.trim() : "";
  const answer = cleanAnswer || fallback?.answer || COPY[language].answer(enriched[0]?.name || offers[0].name);
  return { answer, offers: enriched };
}
