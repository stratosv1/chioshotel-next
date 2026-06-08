import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const wordpressGonePrefixes = [
  "/wp-admin",
  "/wp-login.php",
  "/wp-comments-post.php",
  "/xmlrpc.php",
  "/wp-json",
  "/wp-content/plugins",
  "/wp-content/themes",
  "/wp-includes",
  "/elementor-landing-page-4251",
  "/.cloud/rum",
];

function shouldReturnGone(pathname: string) {
  return wordpressGonePrefixes.some((prefix) => {
    return pathname === prefix || pathname.startsWith(`${prefix}/`);
  });
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (shouldReturnGone(pathname)) {
    return new NextResponse("Gone", {
      status: 410,
      headers: {
        "content-type": "text/plain; charset=utf-8",
        "x-robots-tag": "noindex, nofollow",
      },
    });
  }

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
    "/wp-admin/:path*",
    "/wp-login.php",
    "/wp-comments-post.php",
    "/xmlrpc.php",
    "/wp-json/:path*",
    "/wp-content/plugins/:path*",
    "/wp-content/themes/:path*",
    "/wp-includes/:path*",
    "/elementor-landing-page-4251/:path*",
    "/.cloud/rum/:path*",
    "/((?!api|_next/static|_next/image|favicon|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};
