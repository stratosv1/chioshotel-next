import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function permanentRedirectResponse(request: NextRequest, destination: string) {
  return NextResponse.redirect(new URL(destination, request.url), 301);
}
