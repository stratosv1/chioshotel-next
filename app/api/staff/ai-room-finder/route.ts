import { neon } from "@neondatabase/serverless";
import { NextRequest, NextResponse } from "next/server";
import {
  getRoomFinderInbox,
  markRoomFinderConversationRead,
} from "@/lib/ai-assistant/conversation-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const privateHeaders = {
  "Cache-Control": "private, no-store",
  "X-Robots-Tag": "noindex, nofollow",
};

function isAuthorized(request: NextRequest) {
  const expectedUser = process.env.STAFF_USERNAME;
  const expectedPass = process.env.STAFF_PASSWORD;
  if (!expectedUser || !expectedPass) return false;

  const auth = request.headers.get("authorization");
  if (!auth?.startsWith("Basic ")) return false;

  try {
    const decoded = Buffer.from(auth.slice(6), "base64").toString("utf8");
    const separator = decoded.indexOf(":");
    return (
      separator > -1 &&
      decoded.slice(0, separator) === expectedUser &&
      decoded.slice(separator + 1) === expectedPass
    );
  } catch {
    return false;
  }
}

function unauthorized() {
  return new NextResponse("Unauthorized", {
    status: 401,
    headers: {
      ...privateHeaders,
      "WWW-Authenticate": 'Basic realm="Staff AI Room Finder"',
    },
  });
}

function validSessionId(value: unknown) {
  const cleaned = String(value ?? "").trim().slice(0, 128);
  return /^[A-Za-z0-9._:-]{8,128}$/.test(cleaned) ? cleaned : "";
}

function getSql() {
  const databaseUrl = process.env.DATABASE_URL?.trim();
  if (!databaseUrl) throw new Error("DATABASE_URL is not configured.");
  return neon(databaseUrl);
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) return unauthorized();

  try {
    const selectedSessionId = request.nextUrl.searchParams.get("session");
    const data = await getRoomFinderInbox(selectedSessionId);
    return NextResponse.json(data, { headers: privateHeaders });
  } catch (error) {
    console.error("Staff AI Room Finder inbox error", error);
    return NextResponse.json(
      { error: "Could not load AI Room Finder conversations." },
      { status: 500, headers: privateHeaders },
    );
  }
}

export async function PATCH(request: NextRequest) {
  if (!isAuthorized(request)) return unauthorized();

  try {
    const body = (await request.json()) as { sessionId?: string };
    if (!body.sessionId) {
      return NextResponse.json(
        { ok: false, error: "Missing session id." },
        { status: 400, headers: privateHeaders },
      );
    }

    await markRoomFinderConversationRead(body.sessionId);
    return NextResponse.json({ ok: true }, { headers: privateHeaders });
  } catch (error) {
    console.error("Staff AI Room Finder mark-read error", error);
    return NextResponse.json(
      { ok: false, error: "Could not mark conversation as read." },
      { status: 400, headers: privateHeaders },
    );
  }
}

export async function DELETE(request: NextRequest) {
  if (!isAuthorized(request)) return unauthorized();

  try {
    const body = (await request.json()) as { sessionId?: string; all?: boolean };
    const sql = getSql();

    if (body.all === true) {
      await sql`delete from ai_room_finder_conversations`;
      const data = await getRoomFinderInbox(null);
      return NextResponse.json(data, { headers: privateHeaders });
    }

    const sessionId = validSessionId(body.sessionId);
    if (!sessionId) {
      return NextResponse.json(
        { error: "Missing or invalid session id." },
        { status: 400, headers: privateHeaders },
      );
    }

    await sql`
      delete from ai_room_finder_conversations
      where session_id = ${sessionId}
    `;

    const data = await getRoomFinderInbox(null);
    return NextResponse.json(data, { headers: privateHeaders });
  } catch (error) {
    console.error("Staff AI Room Finder delete error", error);
    return NextResponse.json(
      { error: "Could not delete AI Room Finder conversation." },
      { status: 500, headers: privateHeaders },
    );
  }
}
