import { NextRequest, NextResponse } from "next/server";
import { interpretAssistantMessage } from "@/lib/ai-assistant/intent";
import type { ConversationContext } from "@/lib/ai-assistant/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function isAbortError(error: unknown) {
  return error instanceof Error && error.name === "AbortError";
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const message = typeof body?.message === "string" ? body.message.trim() : "";
    const context: ConversationContext = body?.context && typeof body.context === "object" ? body.context : {};

    if (!message) {
      return NextResponse.json({ error: "Message is required." }, { status: 400 });
    }

    // Every customer message is interpreted by OpenAI. The model converts
    // natural language into the structured facts consumed by the booking state
    // machine; deterministic code only validates those facts afterwards.
    const command = await interpretAssistantMessage(message, context);
    return NextResponse.json({ ok: true, command });
  } catch (error) {
    console.error("AI assistant intent endpoint error", error);
    const timeout = isAbortError(error);
    return NextResponse.json(
      {
        error: timeout ? "AI interpreter timed out." : "AI interpreter is temporarily unavailable.",
        code: timeout ? "AI_TIMEOUT" : "AI_UNAVAILABLE",
      },
      { status: timeout ? 504 : 502 },
    );
  }
}
