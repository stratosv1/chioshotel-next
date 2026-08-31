import { NextResponse } from "next/server";
import { getMixalisSession } from "@/lib/mixalis/auth";
import {
  SAVVALAS_MAPPING_PROPOSAL_COOKIE,
  savvalasMappingProposalCookieOptions,
} from "@/lib/mixalis/savvalas-mapping-proposal-cookie";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const session = await getMixalisSession();
  if (!session) return NextResponse.redirect(new URL("/mixalis/login", request.url), 303);

  const response = NextResponse.redirect(
    new URL("/mixalis/savvalas-auto-map", request.url),
    303,
  );
  response.cookies.set(SAVVALAS_MAPPING_PROPOSAL_COOKIE, "", {
    ...savvalasMappingProposalCookieOptions,
    maxAge: 0,
  });
  return response;
}
