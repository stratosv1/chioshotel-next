import { NextRequest, NextResponse } from "next/server";
import { roomCatalogForLanguage } from "@/lib/ai-assistant/room-card-catalog";
import type { AssistantLanguage } from "@/lib/ai-assistant/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const LANGUAGES: AssistantLanguage[] = ["el", "en", "de", "fr", "it", "es", "tr"];

export async function GET(request: NextRequest) {
  const requested = request.nextUrl.searchParams.get("language") as AssistantLanguage | null;
  const language: AssistantLanguage = requested && LANGUAGES.includes(requested) ? requested : "en";
  const rooms = roomCatalogForLanguage(language).map((room, index) => {
    const originalTotal = 100 + index * 10;
    const directTotal = Math.round(originalTotal * 0.9 * 100) / 100;
    return {
      ...room,
      nights: 2,
      originalTotal,
      directTotal,
      saving: Math.round((originalTotal - directTotal) * 100) / 100,
      preview: false,
    };
  });

  return NextResponse.json(
    { ok: true, language, total: rooms.length, rooms },
    { headers: { "Cache-Control": "no-store" } },
  );
}
