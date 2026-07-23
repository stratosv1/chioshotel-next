import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (
    pathname === "/pre%20arrival" ||
    pathname === "/pre%20arrival/" ||
    pathname === "/pre arrival" ||
    pathname === "/pre arrival/"
  ) {
    return NextResponse.redirect(new URL("/pre-arrival/", request.url), 308);
  }

  return NextResponse.next();
}
