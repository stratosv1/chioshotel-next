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
  "/wp-sitemap.xml",
  "/elementor-landing-page-4251",
  "/.cloud/rum",
  "/web-stories",
];

const wordpressArchiveGonePrefixes = [
  "/topics",
  "/tag",
  "/comments",

  "/el/topics",
  "/el/tag",
  "/el/comments",

  "/fr/topics",
  "/fr/tag",
  "/fr/comments",

  "/de/topics",
  "/de/tag",
  "/de/comments",

  "/it/topics",
  "/it/tag",
  "/it/comments",

  "/es/topics",
  "/es/tag",
  "/es/comments",

  "/tr/topics",
  "/tr/tag",
  "/tr/comments",
];

const legacyRedirects: Record<string, string> = {
  "/en": "/",
  "/fr": "/fr/",
  "/el": "/el/",
  "/book the room you like": "/find-your-room/",

  // Rooms / booking / contact / deals
  "/fr/chios-rooms": "/fr/chambres-a-chios/",
  "/our-rooms": "/chios-rooms/",
  "/chios-rooms/ground-floor-rooms": "/chios-rooms/standard-double-room/",
  "/chios-rooms/economy-double-room": "/chios-rooms/economy-double-rooms/",
  "/chios-rooms/double-triple-rooms": "/chios-rooms/standard-double-room/",
  "/domatia-xios/oikogeneiako-diamerisma":
    "/el/domatia-xios/oikogeneiako-diamerisma/",
  "/el/domatia-xios/chios-family-apartments":
    "/el/domatia-xios/oikogeneiako-diamerisma/",
  "/en/contact-voulamandis-house":
    "/voulamandis-house-contact-us-form-fill-in-the-form/",
  "/el/epikoinonia": "/el/epikoinonia-voulamandis-house/",
  "/best-room-selection-wizard": "/find-your-room/",
  "/language/el/κρατηση": "/el/amesi-kratisi-voulamandis-house/",
  "/el/amesi-kratisi-voulamandis-house":
    "/el/amesi-kratisi-voulamandis-house/",
  "/el/direct-booking-to-voulamandis-house":
    "/el/amesi-kratisi-voulamandis-house/",
  "/best-travel-deals-for-chios-hotels":
    "/best-chios-travel-deals-for-chios-hotels/",
  "/tr/sakiz-adasindaki-otel-firsatlari":
    "/tr/sakiz-adasi-otel-firsatlari/",

  // Beaches
  "/chios/chios-beaches/agia-dynami":
    "/chios/chios-beaches/agia-dynami-beach-chios/",
  "/chios/chios-beaches/agia-dynami-beach":
    "/chios/chios-beaches/agia-dynami-beach-chios/",
  "/chios/chios-beaches/agia-dynami-beach-voulamandis-house-chios-hotels":
    "/chios/chios-beaches/agia-dynami-beach-chios/",
  "/language/el/παραλίες-χίου/παραλία-αγία-δύναμη":
    "/el/paralies-xios/paralia-agia-dynami/",

  "/chios/chios-beaches/avlonia-beach":
    "/chios/chios-beaches/avlonia-beach2/",
  "/de/chios-insel/παραλίες-χίος/avlonia-strand":
    "/de/straende-chios/avlonia-strand/",

  "/chios/chios-beaches/the-authentic-beach-agia-fotini":
    "/chios/chios-beaches/agia-fotia-beach/",
  "/chios-el/chios-beaches-el/chios-beach-agia-fotia":
    "/el/paralies-xios/paralia-agia-fotia/",

  "/chios/chios-beaches/komi-beach-voulamandis-house-chios-hotels":
    "/chios/chios-beaches/komi-beach/",

  "/chios/chios-beaches/lefkathia-beach-voulamandis-house-chios-hotels":
    "/chios/chios-beaches/lefkathia-beach/",
  "/chios/chios-beaches/the-promising-lefkathia-beach":
    "/chios/chios-beaches/lefkathia-beach/",
  "/language/el/παραλίες-χίου/λευκάθια":
    "/el/paralies-xios/paralia-lefkathia/",

  "/chios/chios-beaches/mavra-volia":
    "/chios/chios-beaches/emporios-beach/",
  "/chios/chios-beaches/mavra-volia-voulamandis-house-chios-hotels":
    "/chios/chios-beaches/emporios-beach/",

  // Villages hubs
  "/language/el/χωρια-χιος": "/el/xoria-xios/",
  "/chios/the-eye-caching-chios-villages": "/chios/chios-villages/",
  "/fr/chios/villages-de-chios": "/fr/villages-de-chios/",
  "/de/uncategorized-de/dorfer-von-chios": "/de/doerfer-chios/",
  "/tr/uncategorized-tr/sakiz-adasi-koylerini":
    "/tr/sakiz-adasi-koyleri/",

  // Pyrgi
  "/chios/chios-villages/the-village-of-pyrgi":
    "/chios/chios-villages/chios-pyrgi/",
  "/chios/chios-villages/pyrgi-voulamandis-house-chios-hotels":
    "/chios/chios-villages/chios-pyrgi/",
  "/language/el/χίος/χωριά-χίος/πυργί": "/el/xoria-xios/pyrgi-xios/",
  "/el/chios-el/chios-pyrgi-village": "/el/xoria-xios/pyrgi-xios/",
  "/de/chios-insel/pyrgi-chios": "/de/doerfer-chios/pyrgi-dorf/",
  "/tr/chios-odalari/pyrgi-sakiz-adasi-koyu":
    "/tr/sakiz-adasi-koyleri/pyrgi-koyu/",

  // Mesta
  "/el/chios-el/chios-mesta-village": "/el/xoria-xios/mesta-xios/",
  "/de/chios-insel/mesta-chios-2": "/de/doerfer-chios/mesta-dorf/",
  "/tr/chios-odalari/mesta-koyu-chios":
    "/tr/sakiz-adasi-koyleri/mesta-koyu/",

  // Vessa
  "/chios/chios-villages/vessa-voulamandis-house-chios-hotels":
    "/chios/chios-villages/vessa-chios/",
  "/chios/chios-villages/vessa-vilage":
    "/chios/chios-villages/vessa-chios/",
  "/el/chios-el/chios-vessa-village": "/el/xoria-xios/vessa-xios/",
  "/de/chios-insel/vessa-chios-2": "/de/doerfer-chios/vessa-dorf/",
  "/tr/chios-odalari/vessa-koyu-chios":
    "/tr/sakiz-adasi-koyleri/vessa-koyu/",

  // Olympoi
  "/el/chios-el/chios-olympoi-village": "/el/xoria-xios/olympoi-xios/",
  "/de/chios-insel/olympi-chios-2": "/de/doerfer-chios/olympoi-dorf/",
  "/tr/chios-odalari/olympoi-koyu-chios":
    "/tr/sakiz-adasi-koyleri/olympoi-koyu/",

  // Volissos
  "/chios/chios-villages/the-village-of-volissos":
    "/chios/chios-villages/volissos-chios/",
  "/tr/chios-odalari/volissos-koyu-chios":
    "/tr/sakiz-adasi-koyleri/volissos-koyu/",

  // Armolia
  "/chios/chios-villages/the-village-of-armolia":
    "/chios/chios-villages/armolia-chios/",
  "/language/el/χίος/χωριά-χίος/αρμόλια":
    "/el/xoria-xios/armolia-xios/",
  "/el/chios-el/chios-armolia-village": "/el/xoria-xios/armolia-xios/",
  "/el/chios-el/chios-villages-el/armolia-xios/αρμόλια χίος":
    "/el/xoria-xios/armolia-xios/",
  "/chios-el/chios-villages-el/chios-armolia-village":
    "/el/xoria-xios/armolia-xios/",
  "/tr/chios-el/chios-villages-el/chios-armolia-village":
    "/tr/sakiz-adasi-koyleri/armolia-koyu/",
  "/it/chios-it/chios-villages-it/chios-armolia-village":
    "/it/villaggi-chios/villaggio-armolia/",

  // Lagada
  "/chios-el/chios-villages-el/lagada-chios":
    "/el/xoria-xios/lagada-xios/",
  "/el/chios-el/lagada-chios": "/el/xoria-xios/lagada-xios/",
  "/de/chios-insel/lagada-chios-3": "/de/doerfer-chios/lagada-dorf/",
  "/fr/ile-de-chios/lagada-chios-2":
    "/fr/villages-de-chios/village-lagada/",

  // Museums hubs
  "/fr/chios/musees-de-chios": "/fr/musees-de-chios/",
  "/chios-el/chios-museums-2": "/el/mouseia-xios/",
  "/tr/chios-el/chios-museums-2": "/tr/sakiz-adasi-muzeleri/",
  "/tr/uncategorized-tr/heyecan-verici-sakiz-adasi-muzeleri":
    "/tr/sakiz-adasi-muzeleri/",

  // Museums detail
  "/chios/mastic-gum": "/chios/chios-museums/the-mastic-museum-chios/",
  "/language/el/χίος/μουσεία-χίος/μουσείο-μαστίχας":
    "/el/mouseia-xios/mouseio-mastichas-xios/",
  "/language/el/chios-el/chios-museums-el/chios-archaeological-museum":
    "/el/mouseia-xios/arxaiologiko-mouseio-xios/",
  "/language/el/chios-el/chios-museums-el/chios-byzantine-museum-2":
    "/el/mouseia-xios/vyzantino-mouseio-xios/",
  "/chios/chios-museums/archaeological-museum-chios-voulamandis-house-chios-hotels":
    "/chios/chios-museums/archaeological-museum-chios/",
  "/chios/chios-museums/the-kallimasia-folklore-museum":
    "/chios/chios-museums/kallimasia-folklore-museum/",
  "/tr/chios-el/chios-museums-el/chios-folklore-museum":
    "/tr/sakiz-adasi-muzeleri/kallimasia-folklor-muzesi/",

  // Activities
  "/chios/chios-activities/the-chios-thermal-baths/chios":
    "/chios-thermal-baths/",
  "/chios/chios-activities/chios-thermal-baths": "/chios-thermal-baths/",
  "/fr/chios/activites/les-thermes-de-chios":
    "/fr/sources-thermales-de-chios/",
  "/chios/chios-activities/rocket-war-of-chios": "/rocket-war-chios/",
  "/chios/chios-orchids-voulamandis-house-chios-hotels": "/chios-orchids/",
  "/fr/chios/orchidees-de-chios": "/fr/orchidees-de-chios/",

  // Italian old special route
  "/it/esplorare-chio": "/it/esplora-chios/",
};

function normalizeLegacyPathname(pathname: string) {
  const withoutDuplicateSlashes = pathname.replace(/\/{2,}/g, "/");

  try {
    return decodeURIComponent(withoutDuplicateSlashes).replace(/\/+$/, "") || "/";
  } catch {
    return withoutDuplicateSlashes.replace(/\/+$/, "") || "/";
  }
}

function getLegacyRedirectTarget(pathname: string) {
  const normalizedPathname = normalizeLegacyPathname(pathname);

  return legacyRedirects[normalizedPathname] || null;
}

function shouldReturnGone(pathname: string) {
  const normalizedPathname = normalizeLegacyPathname(pathname);

  return wordpressGonePrefixes.some((prefix) => {
    return (
      normalizedPathname === prefix ||
      normalizedPathname.startsWith(`${prefix}/`)
    );
  });
}

function isWordPressArchivePath(pathname: string) {
  const normalizedPathname = normalizeLegacyPathname(pathname);

  return wordpressArchiveGonePrefixes.some((prefix) => {
    return (
      normalizedPathname === prefix ||
      normalizedPathname.startsWith(`${prefix}/`)
    );
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
    url.search = "";
    return NextResponse.redirect(url, 301);
  }

  if (
    shouldReturnGone(pathname) ||
    isWordPressFeedPath(pathname) ||
    isWordPressArchivePath(pathname)
  ) {
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
    "/wp-sitemap.xml",
    "/elementor-landing-page-4251/:path*",
    "/.cloud/rum/:path*",
    "/web-stories/:path*",
    "/staff/:path*",
    "/api/staff/:path*",
    "/((?!api|_next/static|_next/image|favicon|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};