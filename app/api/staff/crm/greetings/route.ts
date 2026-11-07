import { NextRequest, NextResponse } from "next/server";
import { getEmailSettings } from "@/lib/crm/guest-emails";
import { getGreetingStatus, renderGreetingPreview, sendGreetingBatch, sendGreetingTest } from "@/lib/crm/greetings";
import { GREETING_TYPES, type GreetingType } from "@/lib/crm/greeting-templates";
import { EMAIL_LANGUAGES, type EmailLanguage } from "@/lib/crm/guest-email-templates";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

// Access is protected by the staff Basic Auth in proxy.ts (/api/staff/*).

const headers = { "Cache-Control": "no-store" };
const fail = (error: string, status = 400) => NextResponse.json({ ok: false, error }, { status, headers });
const isType = (value: unknown): value is GreetingType => GREETING_TYPES.includes(value as GreetingType);
const isLanguage = (value: unknown): value is EmailLanguage => EMAIL_LANGUAGES.includes(value as EmailLanguage);

export async function GET(request: NextRequest) {
  try {
    const type = request.nextUrl.searchParams.get("type");
    if (!isType(type)) return fail("Άγνωστος τύπος ευχών.");
    const language = request.nextUrl.searchParams.get("lang");
    if (language) {
      if (!isLanguage(language)) return fail("Άγνωστη γλώσσα.");
      const email = renderGreetingPreview(type, language);
      return NextResponse.json({ ok: true, subject: email.subject, html: email.html }, { headers });
    }
    const [status, settings] = await Promise.all([getGreetingStatus(type), getEmailSettings()]);
    return NextResponse.json({ ok: true, status, testEmail: settings.testEmail }, { headers });
  } catch (error) {
    console.error("staff crm greetings GET failed", error);
    return fail("Δεν φορτώθηκαν τα δεδομένα.", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    if (!isType(body.type)) return fail("Άγνωστος τύπος ευχών.");
    switch (body.action) {
      case "send_test": {
        if (!isLanguage(body.language)) return fail("Άγνωστη γλώσσα.");
        const { testEmail } = await getEmailSettings();
        if (!testEmail) return fail("Λείπει το δοκιμαστικό email (Αυτόματα email).");
        await sendGreetingTest(body.type, body.language, testEmail);
        return NextResponse.json({ ok: true, to: testEmail }, { headers });
      }
      case "send_batch": {
        const languages = Array.isArray(body.languages) ? body.languages.filter(isLanguage) : [];
        if (!languages.length) return fail("Διάλεξε τουλάχιστον μία γλώσσα.");
        const result = await sendGreetingBatch(body.type, languages, body.retryFailed === true);
        return NextResponse.json({ ok: true, result }, { headers });
      }
      default:
        return fail("Άγνωστη ενέργεια.");
    }
  } catch (error) {
    console.error("staff crm greetings POST failed", error);
    return fail(error instanceof Error ? error.message : "Κάτι πήγε στραβά.", 500);
  }
}
