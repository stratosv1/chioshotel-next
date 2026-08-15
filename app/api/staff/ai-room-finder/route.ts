import { NextResponse } from "next/server";
import {
  getRoomFinderInbox,
  markRoomFinderConversationRead,
} from "@/lib/ai-assistant/conversation-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const selectedSessionId = url.searchParams.get("session");
    const data = await getRoomFinderInbox(selectedSessionId);
    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "no-store",
        "X-Robots-Tag": "noindex, nofollow",
      },
    });
  } catch (error) {
    console.error("Staff AI Room Finder inbox error", error);
    return NextResponse.json(
      { error: "Could not load AI Room Finder conversations." },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-store",
          "X-Robots-Tag": "noindex, nofollow",
        },
      },
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = (await request.json()) as { sessionId?: string };
    if (!body.sessionId) {
      return NextResponse.json({ ok: false, error: "Missing session id." }, { status: 400 });
    }
    await markRoomFinderConversationRead(body.sessionId);
    return NextResponse.json({ ok: true }, {
      headers: {
        "Cache-Control": "no-store",
        "X-Robots-Tag": "noindex, nofollow",
      },
    });
  } catch (error) {
    console.error("Staff AI Room Finder mark-read error", error);
    return NextResponse.json({ ok: false, error: "Could not mark conversation as read." }, { status: 400 });
  }
}
