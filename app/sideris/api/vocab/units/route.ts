import { NextRequest, NextResponse } from "next/server";
import { getSiderisSession } from "@/lib/sideris/auth";
import { cleanWords, deleteVocabUnit, saveVocabUnit, type VocabLanguage } from "@/lib/sideris/vocab";

export const dynamic = "force-dynamic";

function parseLanguage(value: unknown): VocabLanguage | null {
  return value === "en" || value === "de" ? value : null;
}

function parseNumber(value: unknown): number | null {
  const number = Number(value);
  return Number.isInteger(number) && number > 0 && number <= 200 ? number : null;
}

export async function POST(request: NextRequest) {
  if (!(await getSiderisSession())) {
    return NextResponse.json({ error: "Δεν είσαι συνδεδεμένος." }, { status: 401 });
  }
  const body = await request.json().catch(() => null);
  const language = parseLanguage(body?.language);
  const number = parseNumber(body?.number);
  const words = cleanWords(body?.words);

  if (!language || !number) {
    return NextResponse.json({ error: "Λείπει η γλώσσα ή ο αριθμός κεφαλαίου." }, { status: 400 });
  }
  if (words.length === 0) {
    return NextResponse.json({ error: "Δεν υπάρχουν λέξεις για αποθήκευση." }, { status: 400 });
  }

  try {
    await saveVocabUnit({ language, number, title: String(body?.title ?? ""), words });
    return NextResponse.json({ ok: true, number, wordCount: words.length });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Η αποθήκευση απέτυχε.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  if (!(await getSiderisSession())) {
    return NextResponse.json({ error: "Δεν είσαι συνδεδεμένος." }, { status: 401 });
  }
  const language = parseLanguage(request.nextUrl.searchParams.get("language"));
  const number = parseNumber(request.nextUrl.searchParams.get("number"));
  if (!language || !number) {
    return NextResponse.json({ error: "Λείπει η γλώσσα ή ο αριθμός κεφαλαίου." }, { status: 400 });
  }
  await deleteVocabUnit(language, number);
  return NextResponse.json({ ok: true });
}
