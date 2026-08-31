import { NextResponse } from "next/server";
import { getMixalisSession } from "@/lib/mixalis/auth";
import { upsertSavvalasSourceRange } from "@/lib/mixalis/savvalas-book-audit";
import { assertSavvalasRangeIntegrity } from "@/lib/mixalis/savvalas-range-integrity";

export const runtime = "nodejs";

function asPositiveInteger(value: FormDataEntryValue | null) {
  const number = Number(value);
  return Number.isInteger(number) && number > 0 ? number : null;
}

export async function POST(request: Request) {
  const session = await getMixalisSession();
  if (!session) return NextResponse.redirect(new URL("/mixalis/login", request.url), 303);

  const formData = await request.formData();
  const documentId = String(formData.get("documentId") || "");
  const subchapterId = String(formData.get("subchapterId") || "");
  const filePageFrom = asPositiveInteger(formData.get("filePageFrom"));
  const filePageTo = asPositiveInteger(formData.get("filePageTo"));

  if (!documentId || !subchapterId || filePageFrom == null || filePageTo == null) {
    return NextResponse.redirect(new URL("/mixalis/savvalas-audit?error=invalid-range", request.url), 303);
  }

  try {
    await assertSavvalasRangeIntegrity({ documentId, subchapterId, filePageFrom, filePageTo });
    const result = await upsertSavvalasSourceRange({ documentId, subchapterId, filePageFrom, filePageTo });
    const url = new URL("/mixalis/savvalas-audit", request.url);
    url.searchParams.set("saved", result.changed ? "range" : "same-range");
    url.searchParams.set("subchapterId", subchapterId);
    return NextResponse.redirect(url, 303);
  } catch (error) {
    console.error("Mixalis Savvalas range mapping failed", error);
    const url = new URL("/mixalis/savvalas-audit", request.url);
    url.searchParams.set("message", error instanceof Error ? error.message.slice(0, 240) : "Αποτυχία αποθήκευσης range.");
    return NextResponse.redirect(url, 303);
  }
}
