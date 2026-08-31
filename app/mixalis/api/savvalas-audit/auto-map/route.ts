import { NextResponse } from "next/server";
import { getMixalisSession } from "@/lib/mixalis/auth";
import { runSavvalasAutoMapping } from "@/lib/mixalis/savvalas-auto-mapping";

export const runtime = "nodejs";
export const maxDuration = 300;

export async function POST(request: Request) {
  const session = await getMixalisSession();
  if (!session) return NextResponse.redirect(new URL("/mixalis/login", request.url), 303);

  const formData = await request.formData();
  const documentId = String(formData.get("documentId") || "");
  if (!documentId) {
    const url = new URL("/mixalis/savvalas-auto-map", request.url);
    url.searchParams.set("message", "Δεν βρέθηκε documentId για το βιβλίο Σαββάλα.");
    return NextResponse.redirect(url, 303);
  }

  try {
    const result = await runSavvalasAutoMapping(documentId);
    const url = new URL("/mixalis/savvalas-auto-map", request.url);
    url.searchParams.set("autoMapped", String(result.mapped.length));
    url.searchParams.set("autoUnresolved", String(result.unresolved.length));
    url.searchParams.set("autoSkipped", String(result.skippedExisting));
    url.searchParams.set("autoPages", String(result.scannedPages));
    return NextResponse.redirect(url, 303);
  } catch (error) {
    console.error("Mixalis Savvalas auto mapping failed", error);
    const url = new URL("/mixalis/savvalas-auto-map", request.url);
    url.searchParams.set(
      "message",
      error instanceof Error ? error.message.slice(0, 240) : "Το αυτόματο mapping απέτυχε.",
    );
    return NextResponse.redirect(url, 303);
  }
}
