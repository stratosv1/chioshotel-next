import "server-only";
import { getDealsIntentData } from "@/content/deals-intent";
import type { DealsPageData } from "@/content/deals";
import { homePageDe, homePageEl, homePageEn, homePageEs, homePageFr, homePageIt, homePageTr } from "@/content/home";
import type { HomePageData } from "@/content/home";
import { toDealsOffers } from "@/lib/offers/catalog";
import { hasOffersDatabase, listLiveOffers } from "@/lib/offers/store";
import { getPlanDeals } from "@/lib/offers/plan-deals";
import type { OfferLanguage } from "@/lib/offers/types";

const homeByLanguage: Record<OfferLanguage, HomePageData> = {
  en: homePageEn,
  el: homePageEl,
  fr: homePageFr,
  de: homePageDe,
  it: homePageIt,
  es: homePageEs,
  tr: homePageTr,
};

export type LiveDealsPageProps = {
  data: DealsPageData;
  lastMinute: HomePageData["lastMinute"];
};

/**
 * Deals page data with offers managed from /staff/offers.
 * Falls back to the original hard-coded offers if the database is unreachable,
 * so the page never breaks.
 */
export async function getLiveDealsPage(language: OfferLanguage): Promise<LiveDealsPageProps> {
  const base = getDealsIntentData(language);
  let offers: DealsPageData["offers"] = base.offers.map((offer) => ({ ...offer, validUntil: null }));

  let planDeals: DealsPageData["planDeals"] = [];
  if (hasOffersDatabase()) {
    const [stored, fromPlan] = await Promise.all([
      listLiveOffers().catch((error) => {
        console.error("Offers: falling back to static deals", error);
        return null;
      }),
      getPlanDeals(language),
    ]);
    if (stored) offers = toDealsOffers(stored, language);
    planDeals = fromPlan;
  }

  const nextExpiry =
    offers
      .map((offer) => offer.validUntil)
      .filter((value): value is string => Boolean(value))
      .sort()[0] ?? "";

  return {
    data: { ...base, offers, planDeals, countdown: { ...base.countdown, targetIso: nextExpiry } },
    lastMinute: homeByLanguage[language].lastMinute,
  };
}
