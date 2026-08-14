import { NextRequest, NextResponse } from "next/server";
import { interpretRoomFinderMessage } from "@/lib/ai-assistant/room-finder-intent";
import type { RoomFinderConversationContext } from "@/lib/ai-assistant/room-finder-types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function isAbortError(error: unknown) {
  return error instanceof Error && error.name === "AbortError";
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const message = typeof body?.message === "string" ? body.message.trim() : "";
    const context: RoomFinderConversationContext =
      body?.context && typeof body.context === "object" ? body.context : {};

    if (!message) {
      return NextResponse.json({ error: "Message is required." }, { status: 400 });
    }

    const command = await interpretRoomFinderMessage(message, context);
    return NextResponse.json({ ok: true, command });
  } catch (error) {
    console.error("AI Room Finder intent endpoint error", error);
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
