import { NextRequest, NextResponse } from "next/server";
import { roomCatalogForLanguage } from "@/lib/ai-assistant/room-card-catalog";
import type { AssistantLanguage } from "@/lib/ai-assistant/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const LANGUAGES: AssistantLanguage[] = ["el", "en", "de", "fr", "it", "es", "tr"];

export async function GET(request: NextRequest) {
  const requested = request.nextUrl.searchParams.get("language") as AssistantLanguage | null;
  const language: AssistantLanguage = requested && LANGUAGES.includes(requested) ? requested : "en";
  const rooms = roomCatalogForLanguage(language).map((room) => ({
    ...room,
    nights: null,
    originalTotal: null,
    directTotal: null,
    saving: null,
    preview: true,
  }));

  return NextResponse.json(
    {
      ok: true,
      language,
      total: rooms.length,
      livePricingRequired: true,
      availabilityEndpoint: "/api/ai-room-finder/availability",
      rooms,
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
