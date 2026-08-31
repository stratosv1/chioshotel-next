import { NextResponse } from "next/server";
import { getMixalisSession } from "@/lib/mixalis/auth";
import { proposeOfficialMapping } from "@/lib/mixalis/official-auto-mapping";

export const runtime = "nodejs";
export const maxDuration = 300;

export async function POST(request: Request) {
  const session = await getMixalisSession();
  if (!session) return NextResponse.redirect(new URL("/mixalis/login", request.url), 303);

  const formData = await request.formData();
  const subchapterId = String(formData.get("subchapterId") || "");
  if (!subchapterId) {
    return NextResponse.redirect(
      new URL("/mixalis?message=Δεν βρέθηκε υποκεφάλαιο για official mapping.", request.url),
      303,
    );
  }

  try {
    const proposal = await proposeOfficialMapping(subchapterId);
    const url = new URL("/mixalis/official-auto-map", request.url);
    url.searchParams.set("subchapterId", proposal.subchapterId);
    url.searchParams.set("documentId", proposal.documentId);
    url.searchParams.set("chapterId", proposal.chapterId);
    url.searchParams.set("proposalFrom", String(proposal.filePageFrom));
    url.searchParams.set("proposalTo", String(proposal.filePageTo));
    url.searchParams.set("confidence", String(Math.round(proposal.confidence * 100)));
    url.searchParams.set("complete", proposal.complete ? "1" : "0");
    url.searchParams.set("verifyFrom", String(proposal.verificationPageFrom));
    url.searchParams.set("verifyTo", String(proposal.verificationPageTo));
    if (proposal.evidence) url.searchParams.set("evidence", proposal.evidence.slice(0, 900));
    return NextResponse.redirect(url, 303);
  } catch (error) {
    console.error("Official school-book mapping proposal failed", error);
    const url = new URL("/mixalis/official-auto-map", request.url);
    url.searchParams.set("subchapterId", subchapterId);
    url.searchParams.set(
      "message",
      error instanceof Error ? error.message.slice(0, 300) : "Η πρόταση official mapping απέτυχε.",
    );
    return NextResponse.redirect(url, 303);
  }
}
