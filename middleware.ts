import { NextRequest, NextResponse } from "next/server";

const gonePrefixes = [
  "/elementor-landing-page-4251/",
  "/language/",
  "/wp-admin/",
  "/wp-content/",
  "/wp-includes/",
  "/wp-json/",
];

const goneExactPaths = new Set([
  "/xmlrpc.php",
  "/wp-login.php",
]);

function shouldReturnGone(pathname: string) {
  const normalizedPath = pathname.toLowerCase();

  if (goneExactPaths.has(normalizedPath)) {
    return true;
  }

  if (gonePrefixes.some((prefix) => normalizedPath.startsWith(prefix))) {
    return true;
  }

  if (normalizedPath.endsWith("/feed/") || normalizedPath.endsWith("/feed")) {
    return true;
  }

  if (normalizedPath.includes("/comments/feed/")) {
    return true;
  }

  if (normalizedPath.includes("/tag/") || normalizedPath.includes("/topics/")) {
    return true;
  }

  return false;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!shouldReturnGone(pathname)) {
    return NextResponse.next();
  }

  return new NextResponse("Gone", {
    status: 410,
    headers: {
      "Cache-Control": "public, max-age=86400",
      "X-Robots-Tag": "noindex, nofollow",
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon|images|robots.txt|sitemap.xml).*)",
  ],
};
