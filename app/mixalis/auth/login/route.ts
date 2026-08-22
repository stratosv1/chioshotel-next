import { NextRequest, NextResponse } from "next/server";
import {
  MIXALIS_SESSION_COOKIE,
  createMixalisSessionToken,
  isMixalisAuthConfigured,
  mixalisSessionCookieOptions,
  verifyMixalisCredentials,
} from "@/lib/mixalis/auth";

export async function POST(request: NextRequest) {
  if (!isMixalisAuthConfigured()) {
    return NextResponse.redirect(new URL("/mixalis/login?error=configuration", request.url), 303);
  }

  const formData = await request.formData();
  const username = String(formData.get("username") || "").trim();
  const password = String(formData.get("password") || "");

  if (!verifyMixalisCredentials(username, password)) {
    return NextResponse.redirect(new URL("/mixalis/login?error=credentials", request.url), 303);
  }

  const token = createMixalisSessionToken(username);
  if (!token) {
    return NextResponse.redirect(new URL("/mixalis/login?error=configuration", request.url), 303);
  }

  const response = NextResponse.redirect(new URL("/mixalis", request.url), 303);
  response.cookies.set(MIXALIS_SESSION_COOKIE, token, mixalisSessionCookieOptions);
  response.headers.set("cache-control", "no-store");
  response.headers.set("x-robots-tag", "noindex, nofollow, noarchive, noimageindex");
  return response;
}
