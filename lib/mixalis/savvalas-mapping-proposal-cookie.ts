export const SAVVALAS_MAPPING_PROPOSAL_COOKIE = "mixalis_savvalas_mapping_proposal";

export type StoredSavvalasMappingProposal = {
  documentId: string;
  proposalSubchapterId: string;
  proposalFrom: string;
  proposalTo: string;
  proposalConfidence: string;
  proposalComplete: string;
  tocFound: string;
  tocPrintedFrom: string;
  tocPrintedTo: string;
  tocPages: string;
  verifyFrom: string;
  verifyTo: string;
  evidence?: string;
};

export function encodeSavvalasMappingProposal(
  proposal: StoredSavvalasMappingProposal,
) {
  return Buffer.from(JSON.stringify(proposal), "utf8").toString("base64url");
}

export function decodeSavvalasMappingProposal(
  value: string | undefined,
): StoredSavvalasMappingProposal | null {
  if (!value) return null;

  try {
    const parsed = JSON.parse(
      Buffer.from(value, "base64url").toString("utf8"),
    ) as Partial<StoredSavvalasMappingProposal>;

    if (
      !parsed.documentId ||
      !parsed.proposalSubchapterId ||
      !parsed.proposalFrom ||
      !parsed.proposalTo ||
      !parsed.proposalConfidence ||
      !parsed.proposalComplete
    ) {
      return null;
    }

    return {
      documentId: String(parsed.documentId),
      proposalSubchapterId: String(parsed.proposalSubchapterId),
      proposalFrom: String(parsed.proposalFrom),
      proposalTo: String(parsed.proposalTo),
      proposalConfidence: String(parsed.proposalConfidence),
      proposalComplete: String(parsed.proposalComplete),
      tocFound: String(parsed.tocFound ?? "0"),
      tocPrintedFrom: String(parsed.tocPrintedFrom ?? "0"),
      tocPrintedTo: String(parsed.tocPrintedTo ?? "0"),
      tocPages: String(parsed.tocPages ?? "0"),
      verifyFrom: String(parsed.verifyFrom ?? "0"),
      verifyTo: String(parsed.verifyTo ?? "0"),
      evidence: parsed.evidence ? String(parsed.evidence).slice(0, 700) : undefined,
    };
  } catch {
    return null;
  }
}

export const savvalasMappingProposalCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/mixalis",
  maxAge: 60 * 60,
};
