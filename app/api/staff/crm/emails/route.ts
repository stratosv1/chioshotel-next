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
import { getOutreachStatus, sendOutreachToBooking, setOutreachEnabled } from "@/lib/crm/ota-outreach";
import { buildOtaMessage } from "@/lib/crm/ota-message-text";
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
    const [settings, due, log, outreach] = await Promise.all([getEmailSettings(), listDueEmails(), listEmailLog(), getOutreachStatus()]);
    return NextResponse.json({
      ok: true,
      settings,
      due: due.map(({ type: dueType, language, guestEmail, name, checkin }) => ({ type: dueType, language, guestEmail, name, checkin })),
      log,
      outreach: { ...outreach, samples: Object.fromEntries(EMAIL_LANGUAGES.map((language) => [language, buildOtaMessage(language, "Maria")])) },
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
      case "set_outreach": {
        await setOutreachEnabled(body.enabled === true);
        return NextResponse.json({ ok: true }, { headers });
      }
      case "outreach_one": {
        const bookingId = String(body.bookingId ?? "").trim();
        if (!/^\d{4,12}$/.test(bookingId)) return fail("Μη έγκυρος αριθμός κράτησης.");
        const outcome = await sendOutreachToBooking(bookingId);
        if (outcome === "failed") return fail("Η αποστολή απέτυχε. Δες το ιστορικό.", 502);
        if (outcome === "already_sent") return fail("Το μήνυμα έχει ήδη σταλεί σε αυτή την κράτηση.");
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
