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
  const language = "el";
  const messages: Array<{ role: "user" | "assistant"; content: string }> = [
    { role: "assistant", content: "Πείτε μου πότε θέλετε να έρθετε στη Χίο και θα ελέγξω αμέσως τη διαθεσιμότητα." },
    { role: "user", content: "10/10" },
  ];

  const first = await callSmart(request.nextUrl.origin, {
    mode: "room_finder",
    roomFinderContext: { currentStep: "checkin", lastAcceptedField: null },
    language,
    messages,
    search: {},
  });

  messages.push({ role: "assistant", content: String(first.payload?.answer || "") });
  messages.push({ role: "user", content: "λάθος έκανα" });

  const correction = await callSmart(request.nextUrl.origin, {
    mode: "room_finder",
    roomFinderContext: { currentStep: "checkout", lastAcceptedField: "checkin" },
    language,
    messages,
    search: first.payload?.search || {},
  });

  const checks = {
    firstAcceptedAsCheckin: first.status === 200 && Boolean(first.payload?.search?.checkin),
    genericCorrectionNotDateError: correction.status === 200 && !correction.payload?.error,
    genericCorrectionClearsCheckin: correction.payload?.search?.checkin == null,
    genericCorrectionReturnsToCheckin: correction.payload?.action === "ask_user" && /check.?in|άφιξ/i.test(String(correction.payload?.answer || "")),
  };

  return NextResponse.json({
    ok: Object.values(checks).every(Boolean),
    checks,
    first: {
      status: first.status,
      action: first.payload?.action,
      intent: first.payload?.intent,
      answer: first.payload?.answer,
      search: first.payload?.search,
    },
    correction: {
      status: correction.status,
      action: correction.payload?.action,
      intent: correction.payload?.intent,
      answer: correction.payload?.answer,
      search: correction.payload?.search,
    },
  });
}
