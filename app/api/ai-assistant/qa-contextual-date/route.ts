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
  const baseMessages: Array<{ role: "user" | "assistant"; content: string }> = [
    { role: "assistant", content: "Tell me when you would like to arrive in Chios and I’ll check live availability for you." },
    { role: "user", content: "29/09" },
  ];

  const first = await callSmart(request.nextUrl.origin, {
    mode: "room_finder",
    language,
    roomFinderContext: { currentStep: "checkin", lastAcceptedField: null },
    messages: baseMessages,
    search: {},
  });

  const invalidCheckoutMessages = [
    ...baseMessages,
    { role: "assistant" as const, content: String(first.payload?.answer || "") },
    { role: "user" as const, content: "αυγουστοσ 31" },
  ];
  const invalidCheckout = await callSmart(request.nextUrl.origin, {
    mode: "room_finder",
    language,
    roomFinderContext: { currentStep: "checkout", lastAcceptedField: "checkin" },
    messages: invalidCheckoutMessages,
    search: first.payload?.search || {},
  });

  const explicitEditMessages = [
    ...baseMessages,
    { role: "assistant" as const, content: String(first.payload?.answer || "") },
    { role: "user" as const, content: "actually change my check-in to 31 August" },
  ];
  const explicitEdit = await callSmart(request.nextUrl.origin, {
    mode: "room_finder",
    language,
    roomFinderContext: { currentStep: "checkout", lastAcceptedField: "checkin" },
    messages: explicitEditMessages,
    search: first.payload?.search || {},
  });

  const genericCorrectionMessages = [
    ...baseMessages,
    { role: "assistant" as const, content: String(first.payload?.answer || "") },
    { role: "user" as const, content: "ωχ έκανα λάθος" },
  ];
  const genericCorrection = await callSmart(request.nextUrl.origin, {
    mode: "room_finder",
    language,
    roomFinderContext: { currentStep: "checkout", lastAcceptedField: "checkin" },
    messages: genericCorrectionMessages,
    search: first.payload?.search || {},
  });

  const checks = {
    firstCheckinAccepted: first.status === 200 && first.payload?.search?.checkin === "2026-09-29",
    invalidCheckoutKeepsCheckin: invalidCheckout.status === 200 && invalidCheckout.payload?.search?.checkin === "2026-09-29",
    invalidCheckoutNotPromotedToCheckinEdit: invalidCheckout.payload?.search?.checkout == null,
    invalidCheckoutClearsDerivedNights: invalidCheckout.payload?.search?.nights == null,
    invalidCheckoutStaysOnCheckout: invalidCheckout.payload?.action === "ask_user" && /check-out/i.test(String(invalidCheckout.payload?.answer || "")),
    invalidCheckoutLanguageStable: invalidCheckout.payload?.language === "en",
    explicitCheckinEditStillWorks: explicitEdit.status === 200 && explicitEdit.payload?.search?.checkin === "2026-08-31",
    explicitCheckinEditAsksCheckout: explicitEdit.payload?.action === "ask_user" && /check-out/i.test(String(explicitEdit.payload?.answer || "")),
    genericCorrectionStillClearsLastField: genericCorrection.status === 200 && genericCorrection.payload?.search?.checkin == null,
    genericCorrectionReturnsToCheckin: genericCorrection.payload?.action === "ask_user" && /check-in/i.test(String(genericCorrection.payload?.answer || "")),
  };

  return NextResponse.json({
    ok: Object.values(checks).every(Boolean),
    checks,
    states: {
      first: { status: first.status, action: first.payload?.action, intent: first.payload?.intent, answer: first.payload?.answer, search: first.payload?.search, language: first.payload?.language },
      invalidCheckout: { status: invalidCheckout.status, action: invalidCheckout.payload?.action, intent: invalidCheckout.payload?.intent, answer: invalidCheckout.payload?.answer, search: invalidCheckout.payload?.search, language: invalidCheckout.payload?.language },
      explicitEdit: { status: explicitEdit.status, action: explicitEdit.payload?.action, intent: explicitEdit.payload?.intent, answer: explicitEdit.payload?.answer, search: explicitEdit.payload?.search, language: explicitEdit.payload?.language },
      genericCorrection: { status: genericCorrection.status, action: genericCorrection.payload?.action, intent: genericCorrection.payload?.intent, answer: genericCorrection.payload?.answer, search: genericCorrection.payload?.search, language: genericCorrection.payload?.language },
    },
  });
}
