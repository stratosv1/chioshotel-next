import { NextRequest, NextResponse } from "next/server";
import { isValidEmail, normalizeEmail } from "@/lib/crm/store";
import {
  getEmailSettings,
  listDueEmails,
  listEmailLog,
  renderPreview,
  runDueEmails,
  saveEmailSettings,
  sendTestEmail,
} from "@/lib/crm/guest-emails";
import {
  EMAIL_LANGUAGES,
  EMAIL_TYPES,
  type EmailLanguage,
  type EmailType,
} from "@/lib/crm/guest-email-templates";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

// Access is protected by the staff Basic Auth in proxy.ts (/api/staff/*).

const headers = { "Cache-Control": "no-store" };
const fail = (error: string, status = 400) => NextResponse.json({ ok: false, error }, { status, headers });
const isType = (value: unknown): value is EmailType => EMAIL_TYPES.includes(value as EmailType);
const isLanguage = (value: unknown): value is EmailLanguage => EMAIL_LANGUAGES.includes(value as EmailLanguage);

export async function GET(request: NextRequest) {
  try {
    const type = request.nextUrl.searchParams.get("preview");
    if (type) {
      const language = request.nextUrl.searchParams.get("lang");
      if (!isType(type) || !isLanguage(language)) return fail("Μη έγκυρη προεπισκόπηση.");
      const email = await renderPreview(type, language);
      if (!email) return fail("Δεν υπάρχει πρόγνωση καιρού αυτή τη στιγμή.", 503);
      return NextResponse.json({ ok: true, subject: email.subject, html: email.html }, { headers });
    }
    const [settings, due, log] = await Promise.all([getEmailSettings(), listDueEmails(), listEmailLog()]);
    return NextResponse.json({
      ok: true,
      settings,
      due: due.map(({ type: dueType, language, guestEmail, name, checkin }) => ({ type: dueType, language, guestEmail, name, checkin })),
      log,
    }, { headers });
  } catch (error) {
    console.error("staff crm emails GET failed", error);
    return fail("Δεν φορτώθηκαν τα δεδομένα.", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const settings = await getEmailSettings();
    switch (body.action) {
      case "toggle_type": {
        if (!isType(body.type)) return fail("Άγνωστος τύπος.");
        const enabledTypes = body.enabled
          ? [...new Set([...settings.enabledTypes, body.type])]
          : settings.enabledTypes.filter((type) => type !== body.type);
        await saveEmailSettings({ ...settings, enabledTypes });
        return NextResponse.json({ ok: true }, { headers });
      }
      case "set_test_mode": {
        await saveEmailSettings({ ...settings, testMode: body.testMode !== false });
        return NextResponse.json({ ok: true }, { headers });
      }
      case "set_test_email": {
        const testEmail = normalizeEmail(body.email);
        if (!isValidEmail(testEmail)) return fail("Μη έγκυρο email.");
        await saveEmailSettings({ ...settings, testEmail });
        return NextResponse.json({ ok: true }, { headers });
      }
      case "send_test": {
        if (!isType(body.type) || !isLanguage(body.language)) return fail("Μη έγκυρη δοκιμή.");
        if (!settings.testEmail) return fail("Λείπει το δοκιμαστικό email.");
        await sendTestEmail(body.type, body.language, settings.testEmail);
        return NextResponse.json({ ok: true }, { headers });
      }
      case "run_now":
        return NextResponse.json({ ok: true, result: await runDueEmails() }, { headers });
      default:
        return fail("Άγνωστη ενέργεια.");
    }
  } catch (error) {
    console.error("staff crm emails POST failed", error);
    return fail(error instanceof Error ? error.message : "Κάτι πήγε στραβά.", 500);
  }
}
