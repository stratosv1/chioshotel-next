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
  "/web-stories",
];

const legacyRedirects: Record<string, string> = {
  "/en": "/",
  "/book%20the%20room%20you%20like": "/find-your-room/",
  "/book the room you like": "/find-your-room/",

  "/chios/chios-beaches/agia-dynami-beach":
    "/chios/chios-beaches/agia-dynami-beach-chios/",
  "/chios/chios-museums/the-kallimasia-folklore-museum":
    "/chios/chios-museums/kallimasia-folklore-museum/",
  "/chios/chios-villages/pyrgi-voulamandis-house-chios-hotels":
    "/chios/chios-villages/chios-pyrgi/",

  "/de/chios-insel/lagada-chios-3": "/de/doerfer-chios/lagada-dorf/",
  "/fr/chios/musees-de-chios": "/fr/musees-de-chios/",

  "/tr/chios-odalari/sakiz-adasinin-plajlari": "/tr/sakiz-adasi-plajlari/",
  "/tr/chios-odalari/vessa-koyu-chios": "/tr/sakiz-adasi-koyleri/vessa-koyu/",
  "/tr/chios-odalari/mesta-koyu-chios": "/tr/sakiz-adasi-koyleri/mesta-koyu/",
  "/tr/chios-odalari/volissos-koyu-chios":
    "/tr/sakiz-adasi-koyleri/volissos-koyu/",

  "/el/chios-el/chios-armolia-village": "/el/xoria-xios/armolia-xios/",
  "/el/chios-el/chios-villages-el/armolia-xios/αρμόλια χίος":
    "/el/xoria-xios/armolia-xios/",
};

function normalizeLegacyPathname(pathname: string) {
  return pathname.replace(/\/+$/, "");
}

function getLegacyRedirectTarget(pathname: string) {
  const normalizedPathname = normalizeLegacyPathname(pathname);

  if (legacyRedirects[normalizedPathname]) {
    return legacyRedirects[normalizedPathname];
  }

  try {
    const decodedPathname = normalizeLegacyPathname(
      decodeURIComponent(pathname),
    );

    return legacyRedirects[decodedPathname] || null;
  } catch {
    return null;
  }
}

function shouldReturnGone(pathname: string) {
  return wordpressGonePrefixes.some((prefix) => {
    return pathname === prefix || pathname.startsWith(`${prefix}/`);
  });
}

function isWordPressFeedPath(pathname: string) {
  const normalizedPathname = normalizeLegacyPathname(pathname);

  return normalizedPathname === "/feed" || normalizedPathname.endsWith("/feed");
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

  const legacyRedirectTarget = getLegacyRedirectTarget(pathname);

  if (legacyRedirectTarget) {
    const url = request.nextUrl.clone();
    url.pathname = legacyRedirectTarget;
    return NextResponse.redirect(url, 301);
  }

  if (shouldReturnGone(pathname) || isWordPressFeedPath(pathname)) {
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
    "/web-stories/:path*",
    "/staff/:path*",
    "/api/staff/:path*",
    "/((?!api|_next/static|_next/image|favicon|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};