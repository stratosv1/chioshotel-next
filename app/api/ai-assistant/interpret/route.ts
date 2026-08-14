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

const PARTIAL_FACT_FOLLOWUP: Record<string, Record<string, string>> = {
  el: {
    checkin: "Τέλεια 😊 Έχω σημειώσει τα στοιχεία που μου δώσατε. Πότε θα θέλατε να κάνετε check-in;",
    checkout: "Τέλεια 😊 Έχω σημειώσει τα στοιχεία που μου δώσατε. Πότε θα θέλατε να κάνετε check-out;",
    rooms: "Τέλεια 😊 Έχω σημειώσει τα υπόλοιπα στοιχεία. Πόσα δωμάτια θα χρειαστείτε;",
    guests: "Τέλεια 😊 Έχω σημειώσει τα υπόλοιπα στοιχεία. Πόσα άτομα θα μείνουν στο δωμάτιο;",
  },
  en: {
    checkin: "Perfect 😊 I’ve noted the details you gave me. When would you like to check in?",
    checkout: "Perfect 😊 I’ve noted the details you gave me. When would you like to check out?",
    rooms: "Perfect 😊 I’ve noted the other details. How many rooms will you need?",
    guests: "Perfect 😊 I’ve noted the other details. How many guests will stay in the room?",
  },
  de: {
    checkin: "Perfekt 😊 Ich habe Ihre Angaben notiert. Wann möchten Sie einchecken?",
    checkout: "Perfekt 😊 Ich habe Ihre Angaben notiert. Wann möchten Sie auschecken?",
    rooms: "Perfekt 😊 Die übrigen Angaben habe ich notiert. Wie viele Zimmer benötigen Sie?",
    guests: "Perfekt 😊 Die übrigen Angaben habe ich notiert. Wie viele Gäste übernachten im Zimmer?",
  },
  fr: {
    checkin: "Parfait 😊 J’ai bien noté vos informations. Quand souhaitez-vous faire le check-in ?",
    checkout: "Parfait 😊 J’ai bien noté vos informations. Quand souhaitez-vous faire le check-out ?",
    rooms: "Parfait 😊 J’ai bien noté les autres informations. De combien de chambres aurez-vous besoin ?",
    guests: "Parfait 😊 J’ai bien noté les autres informations. Combien de personnes séjourneront dans la chambre ?",
  },
  it: {
    checkin: "Perfetto 😊 Ho annotato le informazioni che mi avete dato. Quando desiderate fare il check-in?",
    checkout: "Perfetto 😊 Ho annotato le informazioni che mi avete dato. Quando desiderate fare il check-out?",
    rooms: "Perfetto 😊 Ho annotato le altre informazioni. Di quante camere avrete bisogno?",
    guests: "Perfetto 😊 Ho annotato le altre informazioni. Quante persone soggiorneranno nella camera?",
  },
  es: {
    checkin: "Perfecto 😊 He anotado los datos que me dieron. ¿Cuándo desean hacer el check-in?",
    checkout: "Perfecto 😊 He anotado los datos que me dieron. ¿Cuándo desean hacer el check-out?",
    rooms: "Perfecto 😊 He anotado los demás datos. ¿Cuántas habitaciones necesitan?",
    guests: "Perfecto 😊 He anotado los demás datos. ¿Cuántas personas se alojarán en la habitación?",
  },
  tr: {
    checkin: "Harika 😊 Verdiğiniz bilgileri not ettim. Ne zaman giriş yapmak istersiniz?",
    checkout: "Harika 😊 Verdiğiniz bilgileri not ettim. Ne zaman çıkış yapmak istersiniz?",
    rooms: "Harika 😊 Diğer bilgileri not ettim. Kaç odaya ihtiyacınız var?",
    guests: "Harika 😊 Diğer bilgileri not ettim. Odada kaç kişi kalacak?",
  },
};

function hasAcceptedBookingFact(command: any) {
  if (!command || !Array.isArray(command.actions)) return false;
  return command.actions.some((action: any) =>
    action?.type === "search_availability" ||
    action?.type === "set_room_count" ||
    action?.type === "set_guest_count"
  );
}

function addHospitalityTone(command: any, context: ConversationContext) {
  if (!command || !Array.isArray(command.actions)) return command;
  const language = String(command.language || context.language || "en");
  const prefix = CLARIFY_PREFIX[language] || CLARIFY_PREFIX.en;
  const icon = STEP_ICON[String(context.currentStep || "")] || "";
  const acceptedFact = hasAcceptedBookingFact(command);
  return {
    ...command,
    actions: command.actions.map((action: any) => {
      if (action?.type !== "ask_clarification" || !action?.query) return action;
      const missing = Array.isArray(action.missingFields) ? action.missingFields[0] : undefined;
      const partialFollowup = acceptedFact && missing ? PARTIAL_FACT_FOLLOWUP[language]?.[missing] : undefined;
      if (partialFollowup) return { ...action, query: partialFollowup };
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
    "If the user supplied valid booking facts but omitted the field currently needed by the flow, preserve those facts as executable actions and ask only for the genuinely missing field.",
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
