import { NextRequest, NextResponse } from "next/server";
import { interpretAssistantMessage } from "@/lib/ai-assistant/intent";
import type { ConversationContext } from "@/lib/ai-assistant/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CLARIFY_PREFIX: Record<string, string> = {
  el: "Βεβαίως 😊",
  en: "Of course 😊",
  de: "Sehr gern 😊",
  fr: "Bien sûr 😊",
  it: "Certamente 😊",
  es: "Por supuesto 😊",
  tr: "Elbette 😊",
};

const STEP_ICON: Record<string, string> = {
  checkin: "",
  checkout: "",
  rooms: "🛏️",
  guests: "👥",
  preferences: "✨",
  selecting: "💬",
  breakfast: "☕🥐",
  complete: "✅",
};

function addHospitalityTone(command: any, context: ConversationContext) {
  if (!command || !Array.isArray(command.actions)) return command;
  const language = String(command.language || context.language || "en");
  const prefix = CLARIFY_PREFIX[language] || CLARIFY_PREFIX.en;
  const icon = STEP_ICON[String(context.currentStep || "")] || "";
  return {
    ...command,
    actions: command.actions.map((action: any) => {
      if (action?.type !== "ask_clarification" || !action?.query) return action;
      return { ...action, query: `${prefix} ${action.query}${icon ? ` ${icon}` : ""}` };
    }),
  };
}

function needsVerification(command: any) {
  if (!command || !Array.isArray(command.actions)) return true;
  return command.replyMode === "clarify" || command.actions.some((action: any) => action?.type === "ask_clarification");
}

async function interpretWithClarificationGuard(message: string, context: ConversationContext) {
  const first = await interpretAssistantMessage(message, context);
  if (!needsVerification(first)) return first;

  const verificationMessage = [
    "SECOND-PASS SEMANTIC VERIFICATION.",
    "Re-interpret the original user's message below using the supplied conversation context and all existing interpretation rules.",
    "Do not ask for a value that is already explicitly present or can be uniquely inferred from the message, current flow step, current booking state, recent conversation, and today's date.",
    "Normal human date formats and natural counts must be treated as valid when they resolve uniquely.",
    "Return executable structured actions if the meaning is sufficient. Ask clarification only when a genuine ambiguity still remains.",
    "ORIGINAL USER MESSAGE:",
    message,
  ].join("\n");

  const verified = await interpretAssistantMessage(verificationMessage, context);
  return needsVerification(verified) ? first : verified;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const message = typeof body?.message === "string" ? body.message.trim() : "";
    const context: ConversationContext = body?.context && typeof body.context === "object" ? body.context : {};

    if (!message) {
      return NextResponse.json({ error: "Message is required." }, { status: 400 });
    }

    const command = addHospitalityTone(await interpretWithClarificationGuard(message, context), context);
    return NextResponse.json({ ok: true, command });
  } catch (error) {
    console.error("AI assistant intent endpoint error", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Intent interpretation failed." },
      { status: 502 },
    );
  }
}
