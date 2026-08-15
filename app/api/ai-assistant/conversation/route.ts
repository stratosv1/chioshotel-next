import { NextResponse } from "next/server";
import {
  recordRoomFinderConversation,
  type RoomFinderTrackingSnapshot,
} from "@/lib/ai-assistant/conversation-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RoomFinderTrackingSnapshot;
    const result = await recordRoomFinderConversation(body);
    const response = NextResponse.json({ ok: true, sessionId: result.sessionId });
    response.cookies.set("ai_rf_session", result.sessionId, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24,
    });
    response.headers.set("Cache-Control", "no-store");
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
    return response;
  } catch (error) {
    console.error("AI Room Finder conversation tracking error", error);
    return NextResponse.json(
      { ok: false, error: "Could not record conversation." },
      {
        status: 400,
        headers: {
          "Cache-Control": "no-store",
          "X-Robots-Tag": "noindex, nofollow",
        },
      },
    );
  }
}
