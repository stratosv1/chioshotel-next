import { after, NextRequest, NextResponse } from "next/server";
import { BULK_LANGUAGES } from "@/lib/crm/bulk-email";
import { kickCampaignQueue } from "@/lib/crm/campaign-runner";
import { cleanContent, getCampaign, getCampaignStatus, sendCampaignTest } from "@/lib/crm/campaigns";
import type { EmailLanguage } from "@/lib/crm/email-design";
import { getEmailSettings } from "@/lib/crm/guest-emails";
import { getOfferCampaign, parseOfferKey, saveOfferCampaign, setOfferCampaignState, startOfferCampaign } from "@/lib/crm/offer-campaigns";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

// Email an offer to chosen groups (owner, 2026-11-28).
// Access is protected by the staff Basic Auth in proxy.ts (/api/staff/*).

const headers = { "Cache-Control": "no-store" };
const ok = (data: Record<string, unknown> = {}) => NextResponse.json({ ok: true, ...data }, { headers });
const fail = (error: string, status = 400) => NextResponse.json({ ok: false, error }, { status, headers });
const isLanguage = (value: unknown): value is EmailLanguage => BULK_LANGUAGES.includes(value as EmailLanguage);

async function view(kind: "plan" | "catalog", id: string) {
  const [data, settings] = await Promise.all([getOfferCampaign(kind, id), getEmailSettings()]);
  return data ? { ...data, testEmail: settings.testEmail } : null;
}

export async function GET(request: NextRequest) {
  try {
    const offer = parseOfferKey(request.nextUrl.searchParams.get("key"));
    if (!offer) return fail("Άγνωστη προσφορά.");
    const data = await view(offer.kind, offer.id);
    if (!data) return fail("Η προσφορά δεν υπάρχει πια στο site.", 404);
    return ok(data);
  } catch (error) {
    console.error("staff offer campaign GET failed", error);
    return fail("Δεν φορτώθηκε η καμπάνια.", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const offer = parseOfferKey(body.key);
    if (!offer) return fail("Άγνωστη προσφορά.");
    const action = String(body.action ?? "");

    if (action === "save" || action === "send_test" || action === "start") {
      const campaign = await saveOfferCampaign(offer.kind, offer.id, cleanContent(body.content));
      if (action === "send_test") {
        if (!isLanguage(body.language)) return fail("Άγνωστη ομάδα.");
        const { testEmail } = await getEmailSettings();
        if (!testEmail) return fail("Λείπει το δοκιμαστικό email (CRM → Αυτόματα email).");
        await sendCampaignTest(campaign, body.language, testEmail);
        return ok({ to: testEmail, ...(await view(offer.kind, offer.id)) });
      }
      if (action === "start") {
        const languages = Array.isArray(body.languages) ? body.languages.filter(isLanguage) : [];
        await startOfferCampaign(campaign.id, languages);
        after(() => kickCampaignQueue(request.nextUrl.origin));
      }
      return ok({ ...(await view(offer.kind, offer.id)) });
    }

    if (action === "pause" || action === "resume") {
      const id = Number(body.id);
      const campaign = Number.isInteger(id) && id > 0 ? await getCampaign(id) : null;
      if (!campaign || campaign.offerKey !== `${offer.kind}:${offer.id}`) return fail("Η καμπάνια δεν βρέθηκε.", 404);
      await setOfferCampaignState(campaign.id, action === "pause" ? "paused" : "sending");
      if (action === "resume") after(() => kickCampaignQueue(request.nextUrl.origin));
      return ok({ ...(await view(offer.kind, offer.id)), status: await getCampaignStatus(campaign.id) });
    }

    return fail("Άγνωστη ενέργεια.");
  } catch (error) {
    console.error("staff offer campaign POST failed", error);
    return fail(error instanceof Error ? error.message : "Κάτι πήγε στραβά.", 500);
  }
}
