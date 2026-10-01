import { goneResponse } from "@/lib/gone-response";

// Retired legacy AI Room Finder endpoint. The live Room Finder uses
// /api/ai-assistant/interpret (rate-limited) and /api/ai-room-finder/*.
// Kept as a 410 stub so the old unprotected handler cannot be called.
export function POST() {
  return goneResponse();
}

export const GET = POST;
export const HEAD = POST;
