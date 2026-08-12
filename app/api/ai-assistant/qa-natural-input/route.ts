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
    { role: "assistant", content: "Θα σας βοηθήσω να βρείτε διαθέσιμο δωμάτιο. Ποια ημερομηνία θέλετε για check-in;" },
    { role: "user", content: "10/10" },
  ];

  const first = await callSmart(request.nextUrl.origin, { language, messages, search: {} });
  const firstSearch = first.payload?.search || {};
  messages.push({ role: "assistant", content: String(first.payload?.answer || "") });
  messages.push({ role: "user", content: "Θέλω να ξαναγράψω το check in αλλά δεν μπορώ" });

  const correction = await callSmart(request.nextUrl.origin, { language, messages, search: firstSearch });
  const correctionSearch = correction.payload?.search || {};
  messages.push({ role: "assistant", content: String(correction.payload?.answer || "") });
  messages.push({ role: "user", content: "12/10" });

  const replacement = await callSmart(request.nextUrl.origin, { language, messages, search: correctionSearch });
  const replacementSearch = replacement.payload?.search || {};

  const expectedYear = new Date().getUTCFullYear();
  const expectedFirst = `${expectedYear}-10-10`;
  const expectedReplacement = `${expectedYear}-10-12`;
  const checks = {
    firstAcceptedAsCheckin: first.status === 200 && firstSearch.checkin === expectedFirst && first.payload?.action === "ask_user",
    correctionRecognizedAsCheckinEdit: correction.status === 200 && !correctionSearch.checkin && correction.payload?.action === "ask_user",
    noCheckoutParseErrorOnCorrection: correction.status === 200 && !correction.payload?.error,
    replacementAcceptedAsNewCheckin: replacement.status === 200 && replacementSearch.checkin === expectedReplacement && replacement.payload?.action === "ask_user",
  };

  return NextResponse.json({
    ok: Object.values(checks).every(Boolean),
    checks,
    states: {
      first: { status: first.status, action: first.payload?.action, answer: first.payload?.answer, search: firstSearch },
      correction: { status: correction.status, action: correction.payload?.action, answer: correction.payload?.answer, search: correctionSearch },
      replacement: { status: replacement.status, action: replacement.payload?.action, answer: replacement.payload?.answer, search: replacementSearch },
    },
  });
}
