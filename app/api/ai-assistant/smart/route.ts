import { NextRequest } from "next/server";
import { POST as handleAssistantPost } from "../route";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Compatibility endpoint used by the existing chat frontend.
 * Every message is handled by the central AI orchestrator in ../route.ts.
 */
export async function POST(request: NextRequest) {
  return handleAssistantPost(request);
}
