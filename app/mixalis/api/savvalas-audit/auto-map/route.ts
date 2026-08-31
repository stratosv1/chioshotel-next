import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getMixalisSession } from "@/lib/mixalis/auth";
import { proposeSavvalasMapping } from "@/lib/mixalis/savvalas-auto-mapping";
import { hasSavvalasSourceRange } from "@/lib/mixalis/savvalas-book-audit";
import {
  SAVVALAS_MAPPING_PROPOSAL_COOKIE,
  decodeSavvalasMappingProposal,
  encodeSavvalasMappingProposal,
  savvalasMappingProposalCookieOptions,
} from "@/lib/mixalis/savvalas-mapping-proposal-cookie";

export const runtime = "nodejs";
export const maxDuration = 300;
// Keep proposal locking on the confirmed-range state, not on stale browser state.

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

  const cookieStore = await cookies();
  const pendingProposal = decodeSavvalasMappingProposal(
    cookieStore.get(SAVVALAS_MAPPING_PROPOSAL_COOKIE)?.value,
  );

  if (
    pendingProposal &&
    (pendingProposal.documentId !== documentId ||
      pendingProposal.proposalSubchapterId !== subchapterId)
  ) {
    const pendingAlreadyConfirmed = await hasSavvalasSourceRange(
      pendingProposal.documentId,
      pendingProposal.proposalSubchapterId,
    );

    if (!pendingAlreadyConfirmed) {
      const url = new URL("/mixalis/savvalas-auto-map", request.url);
      url.searchParams.set(
        "message",
        "Υπάρχει ήδη πρόταση mapping που αναμένει επιβεβαίωση. Επιβεβαίωσέ την ή απέρριψέ την πριν ζητήσεις νέα πρόταση.",
      );
      return NextResponse.redirect(url, 303);
    }
  }

  try {
    const proposal = await proposeSavvalasMapping(documentId, subchapterId);
    const storedProposal = {
      documentId: proposal.documentId,
      proposalSubchapterId: proposal.subchapterId,
      proposalFrom: String(proposal.filePageFrom),
      proposalTo: String(proposal.filePageTo),
      proposalConfidence: String(Math.round(proposal.confidence * 100)),
      proposalComplete: proposal.complete ? "1" : "0",
      tocFound: proposal.tocFound ? "1" : "0",
      tocPrintedFrom: String(proposal.tocPrintedPageFrom ?? 0),
      tocPrintedTo: String(proposal.tocPrintedPageTo ?? 0),
      tocPages: String(proposal.tocPagesScanned),
      verifyFrom: String(proposal.verificationPageFrom),
      verifyTo: String(proposal.verificationPageTo),
      evidence: proposal.evidence ? proposal.evidence.slice(0, 700) : undefined,
    };

    const url = new URL("/mixalis/savvalas-auto-map", request.url);
    for (const [key, value] of Object.entries(storedProposal)) {
      if (value != null) url.searchParams.set(key, value);
    }

    const response = NextResponse.redirect(url, 303);
    response.cookies.set(
      SAVVALAS_MAPPING_PROPOSAL_COOKIE,
      encodeSavvalasMappingProposal(storedProposal),
      savvalasMappingProposalCookieOptions,
    );
    return response;
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
