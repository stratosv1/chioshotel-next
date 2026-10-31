import { NextRequest, NextResponse } from "next/server";
import { getSiderisSession } from "@/lib/sideris/auth";
import { extractVocabFromImage } from "@/lib/sideris/vocab-extract";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

const MAX_DATA_URL_LENGTH = 4_000_000;

export async function POST(request: NextRequest) {
  if (!(await getSiderisSession())) {
    return NextResponse.json({ error: "Δεν είσαι συνδεδεμένος." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const language = body?.language;
  const image = String(body?.image ?? "");

  if (language !== "en" && language !== "de") {
    return NextResponse.json({ error: "Άγνωστη γλώσσα." }, { status: 400 });
  }
  if (!/^data:image\/(jpeg|png|webp);base64,/.test(image) || image.length > MAX_DATA_URL_LENGTH) {
    return NextResponse.json({ error: "Η φωτογραφία δεν είναι έγκυρη ή είναι πολύ μεγάλη." }, { status: 400 });
  }

  try {
    const result = await extractVocabFromImage(language, image);
    return NextResponse.json(result, { headers: { "cache-control": "no-store" } });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Κάτι πήγε στραβά.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
