import { NextRequest, NextResponse } from "next/server";
import {
  SIDERIS_SESSION_COOKIE,
  createSiderisSessionToken,
  isSiderisAuthConfigured,
  siderisSessionCookieOptions,
  verifySiderisCredentials,
} from "@/lib/sideris/auth";

export async function POST(request: NextRequest) {
  if (!isSiderisAuthConfigured()) {
    return NextResponse.redirect(new URL("/sideris/login?error=configuration", request.url), 303);
  }

  const formData = await request.formData();
  const username = String(formData.get("username") || "").trim();
  const password = String(formData.get("password") || "");

  if (!verifySiderisCredentials(username, password)) {
    return NextResponse.redirect(new URL("/sideris/login?error=credentials", request.url), 303);
  }

  const token = createSiderisSessionToken(username);
  if (!token) {
    return NextResponse.redirect(new URL("/sideris/login?error=configuration", request.url), 303);
  }

  const response = NextResponse.redirect(new URL("/sideris", request.url), 303);
  response.cookies.set(SIDERIS_SESSION_COOKIE, token, siderisSessionCookieOptions);
  response.headers.set("cache-control", "no-store");
  response.headers.set("x-robots-tag", "noindex, nofollow, noarchive, noimageindex");
  return response;
}
