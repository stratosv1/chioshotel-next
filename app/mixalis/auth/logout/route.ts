import { NextRequest, NextResponse } from "next/server";
import { MIXALIS_SESSION_COOKIE } from "@/lib/mixalis/auth";

export async function POST(request: NextRequest) {
  const response = NextResponse.redirect(new URL("/mixalis/login", request.url), 303);
  response.cookies.set(MIXALIS_SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/mixalis",
    maxAge: 0,
  });
  response.headers.set("cache-control", "no-store");
  response.headers.set("x-robots-tag", "noindex, nofollow, noarchive, noimageindex");
  return response;
}
