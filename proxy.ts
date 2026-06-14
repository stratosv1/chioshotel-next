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

function isOldBookRoomUrl(pathname: string) {
  const normalizedPathname = pathname.replace(/\/+$/, "");

  if (
    normalizedPathname === "/book%20the%20room%20you%20like" ||
    normalizedPathname === "/book the room you like"
  ) {
    return true;
  }

  try {
    return decodeURIComponent(normalizedPathname) === "/book the room you like";
  } catch {
    return false;
  }
}

function isStaffPath(pathname: string) {
  return (
    pathname === "/staff" ||
    pathname.startsWith("/staff/") ||
    pathname === "/api/staff" ||
    pathname.startsWith("/api/staff/")
  );
}

function unauthorizedStaffResponse() {
  return new NextResponse("Authentication required", {
    status: 401,
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "www-authenticate": 'Basic realm="Staff Area", charset="UTF-8"',
      "x-robots-tag": "noindex, nofollow",
      "cache-control": "no-store",
    },
  });
}

function isAuthorizedStaffRequest(request: NextRequest) {
  const username = process.env.STAFF_USERNAME;
  const password = process.env.STAFF_PASSWORD;

  if (!username || !password) {
    return false;
  }

  const authorization = request.headers.get("authorization");

  if (!authorization || !authorization.startsWith("Basic ")) {
    return false;
  }

  try {
    const encodedCredentials = authorization.slice("Basic ".length);
    const decodedCredentials = atob(encodedCredentials);
    const separatorIndex = decodedCredentials.indexOf(":");

    if (separatorIndex === -1) {
      return false;
    }

    const providedUsername = decodedCredentials.slice(0, separatorIndex);
    const providedPassword = decodedCredentials.slice(separatorIndex + 1);

    return providedUsername === username && providedPassword === password;
  } catch {
    return false;
  }
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isOldBookRoomUrl(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = "/find-your-room/";
    return NextResponse.redirect(url, 301);
  }

  if (shouldReturnGone(pathname)) {
    return new NextResponse("Gone", {
      status: 410,
      headers: {
        "content-type": "text/plain; charset=utf-8",
        "x-robots-tag": "noindex, nofollow",
      },
    });
  }

  if (isStaffPath(pathname) && !isAuthorizedStaffRequest(request)) {
    return unauthorizedStaffResponse();
  }

  if (pathname === "/it/esplorare-chio" || pathname === "/it/esplorare-chio/") {
    const url = request.nextUrl.clone();
    url.pathname = "/it/esplora-chios/";
    return NextResponse.redirect(url, 308);
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-current-pathname", pathname);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  if (isStaffPath(pathname)) {
    response.headers.set("x-robots-tag", "noindex, nofollow");
    response.headers.set("cache-control", "no-store");
  }

  return response;
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
    "/staff/:path*",
    "/api/staff/:path*",
    "/((?!api|_next/static|_next/image|favicon|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};