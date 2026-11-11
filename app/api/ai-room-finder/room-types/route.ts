import { NextRequest, NextResponse } from "next/server";
import { getDirectDiscounts, getRoomTypeCards } from "@/lib/ai-assistant/room-type-cards";
import type { RoomFinderAssistantLanguage } from "@/lib/ai-assistant/room-finder-types";

export const runtime = "nodejs";

const LANGUAGES = new Set<RoomFinderAssistantLanguage>(["el", "en", "fr", "de", "it", "es", "tr"]);

// The four room types with the homepage room-card data and the indicative
// "from" prices. Static content plus cached prices, so it is safe to cache
// briefly at the edge.
export async function GET(request: NextRequest) {
  const raw = (request.nextUrl.searchParams.get("lang") || "en").toLowerCase();
  const language = LANGUAGES.has(raw as RoomFinderAssistantLanguage)
    ? (raw as RoomFinderAssistantLanguage)
    : "en";

  try {
    const [roomTypes, discounts] = await Promise.all([getRoomTypeCards(language), getDirectDiscounts()]);
    return NextResponse.json(
      { ok: true, language, roomTypes, discounts },
      { headers: { "Cache-Control": "public, s-maxage=600, stale-while-revalidate=3600" } },
    );
  } catch (error) {
    console.error("Room Finder room types failed", error);
    return NextResponse.json(
      { ok: false, error: "Room types are temporarily unavailable." },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}
