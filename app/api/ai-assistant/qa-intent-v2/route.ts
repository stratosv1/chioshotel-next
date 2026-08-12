import { NextRequest, NextResponse } from "next/server";
import { POST as smartPost } from "../smart/route";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function callSmart(origin: string, body: Record<string, unknown>) {
  const request = new NextRequest(`${origin}/api/ai-assistant/smart`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const response = await smartPost(request);
  const payload = await response.json();
  return { status: response.status, payload };
}

export async function GET(request: NextRequest) {
  const language = "en";
  const messages: Array<{ role: "user" | "assistant"; content: string }> = [
    { role: "assistant", content: "Tell me when you would like to arrive in Chios and I’ll check live availability for you." },
  ];

  messages.push({ role: "user", content: "10/10" });
  const first = await callSmart(request.nextUrl.origin, {
    mode: "room_finder",
    language,
    roomFinderContext: { currentStep: "checkin", lastAcceptedField: null },
    messages,
    search: {},
  });

  messages.push({ role: "assistant", content: String(first.payload?.answer || "") });
  messages.push({ role: "user", content: "ωχ λάθος έκανα" });
  const correction = await callSmart(request.nextUrl.origin, {
    mode: "room_finder",
    language,
    roomFinderContext: { currentStep: "checkout", lastAcceptedField: "checkin" },
    messages,
    search: first.payload?.search || {},
  });

  messages.push({ role: "assistant", content: String(correction.payload?.answer || "") });
  messages.push({ role: "user", content: "19/08" });
  const replacement = await callSmart(request.nextUrl.origin, {
    mode: "room_finder",
    language,
    roomFinderContext: { currentStep: "checkin", lastAcceptedField: null },
    messages,
    search: correction.payload?.search || {},
  });

  messages.push({ role: "assistant", content: String(replacement.payload?.answer || "") });
  messages.push({ role: "user", content: "θέλω 2 βράδια να μείνω" });
  const duration = await callSmart(request.nextUrl.origin, {
    mode: "room_finder",
    language,
    roomFinderContext: { currentStep: "checkout", lastAcceptedField: "checkin" },
    messages,
    search: replacement.payload?.search || {},
  });

  const checks = {
    firstCheckin: first.status === 200 && first.payload?.search?.checkin === "2026-10-10",
    correctionUnderstood: correction.status === 200 && correction.payload?.intent === "edit_search" && correction.payload?.search?.checkin == null,
    interfaceLanguageStableAfterGreekCorrection: correction.payload?.language === "en" && /^Sure\.|^What |^How /i.test(String(correction.payload?.answer || "")),
    replacementAccepted: replacement.status === 200 && replacement.payload?.search?.checkin === "2026-08-19",
    replacementMovesToCheckout: replacement.payload?.action === "ask_user" && /check-out/i.test(String(replacement.payload?.answer || "")),
    durationUnderstoodSemantically: duration.status === 200 && duration.payload?.search?.nights === 2,
    durationDerivedCheckout: duration.payload?.search?.checkout === "2026-08-21",
    interfaceLanguageStableAfterGreekDuration: duration.payload?.language === "en" && !/[Α-Ωα-ω]/.test(String(duration.payload?.answer || "")),
  };

  return NextResponse.json({
    ok: Object.values(checks).every(Boolean),
    checks,
    states: {
      first: { status: first.status, action: first.payload?.action, intent: first.payload?.intent, answer: first.payload?.answer, language: first.payload?.language, search: first.payload?.search },
      correction: { status: correction.status, action: correction.payload?.action, intent: correction.payload?.intent, answer: correction.payload?.answer, language: correction.payload?.language, search: correction.payload?.search },
      replacement: { status: replacement.status, action: replacement.payload?.action, intent: replacement.payload?.intent, answer: replacement.payload?.answer, language: replacement.payload?.language, search: replacement.payload?.search },
      duration: { status: duration.status, action: duration.payload?.action, intent: duration.payload?.intent, answer: duration.payload?.answer, language: duration.payload?.language, search: duration.payload?.search },
    },
  });
}
