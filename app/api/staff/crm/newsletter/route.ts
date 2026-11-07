import { NextRequest, NextResponse } from "next/server";
import { addContacts, listContacts, parseContactLines, resubscribeContact, setContactLanguage, unsubscribeGuest, BULK_LANGUAGES } from "@/lib/crm/bulk-email";
import { cleanContent, deleteUnsentCampaign, getCampaign, getCampaignStatus, listCampaigns, saveCampaign, sendCampaignBatch, sendCampaignTest } from "@/lib/crm/campaigns";
import { getEmailSettings } from "@/lib/crm/guest-emails";
import { getOutreachStatus } from "@/lib/crm/ota-outreach";
import { isValidEmail, listPendingBookings, normalizeEmail } from "@/lib/crm/store";
import type { EmailLanguage } from "@/lib/crm/email-design";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

// Access is protected by the staff Basic Auth in proxy.ts (/api/staff/*).

const headers = { "Cache-Control": "no-store" };
const ok = (data: Record<string, unknown> = {}) => NextResponse.json({ ok: true, ...data }, { headers });
const fail = (error: string, status = 400) => NextResponse.json({ ok: false, error }, { status, headers });
const isLanguage = (value: unknown): value is EmailLanguage => BULK_LANGUAGES.includes(value as EmailLanguage);
const toId = (value: unknown) => {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
};

export async function GET(request: NextRequest) {
  try {
    const params = request.nextUrl.searchParams;
    const view = params.get("view");
    if (view === "contacts") {
      const [contacts, pending, outreach] = await Promise.all([listContacts(), listPendingBookings("upcoming"), getOutreachStatus()]);
      return ok({ contacts, pendingOta: pending.length, outreachEnabled: outreach.enabled });
    }
    if (view === "campaigns") return ok({ campaigns: await listCampaigns() });
    if (view === "campaign") {
      const id = toId(params.get("id"));
      if (!id) return fail("Άγνωστη καμπάνια.");
      const [campaign, status, settings] = await Promise.all([getCampaign(id), getCampaignStatus(id), getEmailSettings()]);
      if (!campaign) return fail("Η καμπάνια δεν βρέθηκε.", 404);
      return ok({ campaign, status, testEmail: settings.testEmail });
    }
    return fail("Άγνωστη προβολή.");
  } catch (error) {
    console.error("staff crm newsletter GET failed", error);
    return fail("Δεν φορτώθηκαν τα δεδομένα.", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const email = normalizeEmail(body.email);
    switch (body.action) {
      case "add_contacts": {
        if (!isLanguage(body.language)) return fail("Διάλεξε γλώσσα.");
        const entries = parseContactLines(String(body.text ?? "")).slice(0, 5000);
        if (!entries.length) return fail("Γράψε τουλάχιστον ένα email.");
        const result = await addContacts(entries, body.language, entries.length > 1 ? "crm-import" : "crm-manual");
        return ok({ result });
      }
      case "set_language": {
        if (!isValidEmail(email) || !isLanguage(body.language)) return fail("Μη έγκυρα στοιχεία.");
        await setContactLanguage(email, body.language);
        return ok();
      }
      case "unsubscribe": {
        if (!isValidEmail(email)) return fail("Μη έγκυρο email.");
        await unsubscribeGuest(email, isLanguage(body.language) ? body.language : "en");
        return ok();
      }
      case "resubscribe": {
        if (!isValidEmail(email)) return fail("Μη έγκυρο email.");
        await resubscribeContact(email);
        return ok();
      }
      case "save_campaign": {
        const title = String(body.title ?? "").trim().slice(0, 120);
        if (!title) return fail("Δώσε έναν τίτλο στην καμπάνια.");
        const id = await saveCampaign({ id: toId(body.id), title, image: String(body.image ?? "").trim().slice(0, 500), content: cleanContent(body.content) });
        return ok({ id });
      }
      case "delete_campaign": {
        const id = toId(body.id);
        if (!id) return fail("Άγνωστη καμπάνια.");
        await deleteUnsentCampaign(id);
        return ok();
      }
      case "send_test":
      case "send_batch": {
        const id = toId(body.id);
        const campaign = id ? await getCampaign(id) : null;
        if (!campaign) return fail("Η καμπάνια δεν βρέθηκε.", 404);
        if (body.action === "send_test") {
          if (!isLanguage(body.language)) return fail("Άγνωστη γλώσσα.");
          const { testEmail } = await getEmailSettings();
          if (!testEmail) return fail("Λείπει το δοκιμαστικό email (Αυτόματα email).");
          await sendCampaignTest(campaign, body.language, testEmail);
          return ok({ to: testEmail });
        }
        const languages = Array.isArray(body.languages) ? body.languages.filter(isLanguage) : [];
        if (!languages.length) return fail("Διάλεξε τουλάχιστον μία γλώσσα.");
        return ok({ result: await sendCampaignBatch(campaign, languages, body.retryFailed === true) });
      }
      default:
        return fail("Άγνωστη ενέργεια.");
    }
  } catch (error) {
    console.error("staff crm newsletter POST failed", error);
    return fail(error instanceof Error ? error.message : "Κάτι πήγε στραβά.", 500);
  }
}
