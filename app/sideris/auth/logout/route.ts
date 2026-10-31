import { NextRequest, NextResponse } from "next/server";
import { SIDERIS_SESSION_COOKIE } from "@/lib/sideris/auth";

export async function POST(request: NextRequest) {
  const response = NextResponse.redirect(new URL("/sideris/login", request.url), 303);
  response.cookies.set(SIDERIS_SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/sideris",
    maxAge: 0,
  });
  response.headers.set("cache-control", "no-store");
  response.headers.set("x-robots-tag", "noindex, nofollow, noarchive, noimageindex");
  return response;
}
