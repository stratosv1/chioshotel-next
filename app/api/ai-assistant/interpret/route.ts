import { NextRequest, NextResponse } from "next/server";
import {
  extractDeterministicBookingFacts,
  mergeDeterministicBookingFacts,
} from "@/lib/ai-assistant/deterministic-booking-facts";
import { applyExactDateFact, buildStandaloneDateCommand } from "@/lib/ai-assistant/exact-date";
import { interpretAssistantMessage } from "@/lib/ai-assistant/intent";
import type { ConversationContext } from "@/lib/ai-assistant/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const message = typeof body?.message === "string" ? body.message.trim() : "";
    const context: ConversationContext = body?.context && typeof body.context === "object" ? body.context : {};

    if (!message) {
      return NextResponse.json({ error: "Message is required." }, { status: 400 });
    }

    const deterministicFacts = extractDeterministicBookingFacts(message, context);

    // Standalone numeric dates are deterministic booking facts. Resolve them
    // immediately so a clear date can never be lost to model/network latency.
    const standaloneDate = buildStandaloneDateCommand(message, context);
    if (standaloneDate) {
      const command = mergeDeterministicBookingFacts(standaloneDate, deterministicFacts);
      return NextResponse.json({ ok: true, command });
    }

    // The model enriches natural-language understanding, while high-confidence
    // booking facts are merged afterwards and therefore survive model fallback,
    // latency or a wrong action wrapper.
    const interpreted = await interpretAssistantMessage(message, context);
    const withExactDate = applyExactDateFact(interpreted, message, context);
    const command = mergeDeterministicBookingFacts(withExactDate, deterministicFacts);

    return NextResponse.json({ ok: true, command });
  } catch (error) {
    console.error("AI assistant intent endpoint error", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Intent interpretation failed." },
      { status: 502 },
    );
  }
}
