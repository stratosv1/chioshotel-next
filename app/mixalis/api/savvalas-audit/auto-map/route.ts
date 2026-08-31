import { NextResponse } from "next/server";
import { getMixalisSession } from "@/lib/mixalis/auth";
import { proposeSavvalasMapping } from "@/lib/mixalis/savvalas-auto-mapping";

export const runtime = "nodejs";
export const maxDuration = 300;

export async function POST(request: Request) {
  const session = await getMixalisSession();
  if (!session) return NextResponse.redirect(new URL("/mixalis/login", request.url), 303);

  const formData = await request.formData();
  const documentId = String(formData.get("documentId") || "");
  const subchapterId = String(formData.get("subchapterId") || "");

  if (!documentId || !subchapterId) {
    const url = new URL("/mixalis/savvalas-auto-map", request.url);
    url.searchParams.set("message", "Δεν βρέθηκε βιβλίο ή υποκεφάλαιο για το mapping.");
    return NextResponse.redirect(url, 303);
  }

  try {
    const proposal = await proposeSavvalasMapping(documentId, subchapterId);
    const url = new URL("/mixalis/savvalas-auto-map", request.url);
    url.searchParams.set("documentId", proposal.documentId);
    url.searchParams.set("proposalSubchapterId", proposal.subchapterId);
    url.searchParams.set("proposalFrom", String(proposal.filePageFrom));
    url.searchParams.set("proposalTo", String(proposal.filePageTo));
    url.searchParams.set("proposalConfidence", String(Math.round(proposal.confidence * 100)));
    url.searchParams.set("proposalComplete", proposal.complete ? "1" : "0");
    url.searchParams.set("tocFound", proposal.tocFound ? "1" : "0");
    url.searchParams.set("tocPrintedFrom", String(proposal.tocPrintedPageFrom ?? 0));
    url.searchParams.set("tocPrintedTo", String(proposal.tocPrintedPageTo ?? 0));
    url.searchParams.set("tocPages", String(proposal.tocPagesScanned));
    url.searchParams.set("verifyFrom", String(proposal.verificationPageFrom));
    url.searchParams.set("verifyTo", String(proposal.verificationPageTo));
    if (proposal.evidence) url.searchParams.set("evidence", proposal.evidence.slice(0, 700));
    return NextResponse.redirect(url, 303);
  } catch (error) {
    console.error("Mixalis Savvalas mapping proposal failed", error);
    const url = new URL("/mixalis/savvalas-auto-map", request.url);
    url.searchParams.set("documentId", documentId);
    url.searchParams.set("proposalSubchapterId", subchapterId);
    url.searchParams.set(
      "message",
      error instanceof Error ? error.message.slice(0, 260) : "Η πρόταση mapping απέτυχε.",
    );
    return NextResponse.redirect(url, 303);
  }
}
