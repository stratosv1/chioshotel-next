import { NextResponse } from "next/server";
import { getMixalisSession } from "@/lib/mixalis/auth";
import {
  getOfficialMappingPageData,
  upsertOfficialSourceRange,
} from "@/lib/mixalis/official-auto-mapping";
import { assertOfficialRangeIntegrity } from "@/lib/mixalis/official-range-integrity";

export const runtime = "nodejs";

function positiveInt(value: FormDataEntryValue | null) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

export async function POST(request: Request) {
  const session = await getMixalisSession();
  if (!session) return NextResponse.redirect(new URL("/mixalis/login", request.url), 303);

  const formData = await request.formData();
  const subchapterId = String(formData.get("subchapterId") || "");
  const documentId = String(formData.get("documentId") || "");
  const chapterId = String(formData.get("chapterId") || "");
  const filePageFrom = positiveInt(formData.get("filePageFrom"));
  const filePageTo = positiveInt(formData.get("filePageTo"));
  const confidence = Number(formData.get("confidence") || 0);
  const complete = String(formData.get("complete") || "") === "1";

  if (
    !subchapterId ||
    !documentId ||
    !chapterId ||
    filePageFrom == null ||
    filePageTo == null ||
    filePageTo < filePageFrom
  ) {
    const url = new URL("/mixalis/official-auto-map", request.url);
    if (subchapterId) url.searchParams.set("subchapterId", subchapterId);
    url.searchParams.set("message", "Η πρόταση official mapping δεν έχει έγκυρα όρια.");
    return NextResponse.redirect(url, 303);
  }

  if (!complete || confidence < 70) {
    const url = new URL("/mixalis/official-auto-map", request.url);
    url.searchParams.set("subchapterId", subchapterId);
    url.searchParams.set(
      "message",
      "Δεν επιτρέπεται αποθήκευση χωρίς πλήρη όρια και confidence τουλάχιστον 70%.",
    );
    return NextResponse.redirect(url, 303);
  }

  try {
    const context = await getOfficialMappingPageData(subchapterId);
    if (context.documentId !== documentId || context.chapterId !== chapterId) {
      throw new Error("Η πρόταση δεν αντιστοιχεί στο ενεργό σχολικό PDF ή υποκεφάλαιο.");
    }

    await assertOfficialRangeIntegrity({
      documentId,
      subchapterId,
      filePageFrom,
      filePageTo,
    });

    const result = await upsertOfficialSourceRange({
      documentId,
      subchapterId,
      filePageFrom,
      filePageTo,
    });

    const url = new URL(`/mixalis/chapters/${result.chapterId}`, request.url);
    url.searchParams.set("officialMapped", subchapterId);
    return NextResponse.redirect(url, 303);
  } catch (error) {
    console.error("Official school-book mapping confirmation failed", error);
    const url = new URL("/mixalis/official-auto-map", request.url);
    url.searchParams.set("subchapterId", subchapterId);
    url.searchParams.set(
      "message",
      error instanceof Error ? error.message.slice(0, 300) : "Η αποθήκευση official mapping απέτυχε.",
    );
    return NextResponse.redirect(url, 303);
  }
}
