import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/it/esplorare-chio" || pathname === "/it/esplorare-chio/") {
    const url = request.nextUrl.clone();
    url.pathname = "/it/esplora-chios/";
    return NextResponse.redirect(url, 308);
  }

  const requestHeaders = new Headers(request.headers);

  requestHeaders.set("x-current-pathname", pathname);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon|favicon.ico|robots.txt|sitemap.xml|.*\\..*).*)",
  ],
};
