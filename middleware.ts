import { NextRequest, NextResponse } from "next/server";

const legacyPermanentRedirects: Record<string, string> = {
  "/our-rooms": "/chios-rooms/",
  "/reservations": "/chios-hotels-rates/",
  "/voulamandis-house-contact-form": "/voulamandis-house-contact-us-form-fill-in-the-form/",
  "/en/contact-voulamandis-house": "/voulamandis-house-contact-us-form-fill-in-the-form/",
  "/en/voulamandis-house-contact-us-form-fill-in-the-form": "/voulamandis-house-contact-us-form-fill-in-the-form/",
  "/en/photos": "/",
  "/en/chios-rooms": "/chios-rooms/",
  "/fr/chios-rooms": "/fr/chambres-a-chios/",
  "/tr/sakiz-adasindaki-otel-firsatlari": "/tr/sakiz-adasi-otel-firsatlari/",

  "/best-room-selection-wizard": "/find-your-room/",
  "/el/best room selection wizard": "/el/vres-to-domatio-sou/",
  "/best-rates-chios-hotels-voulamandis-house": "/chios-hotels-rates/",
  "/best-travel-deals-for-chios-hotels": "/chios-hotels-rates/",
  "/en/best-chios-travel-deals-for-chios-hotels": "/chios-hotels-rates/",
  "/direct-booking-to-voulamandis-house": "/chios-hotels-rates/",
  "/el/direct-booking-to-voulamandis-house": "/el/amesi-kratisi-voulamandis-house/",
  "/el/amesi-kratisivoulamandis-house": "/el/amesi-kratisi-voulamandis-house/",

  "/domatia-xios": "/el/domatia-xios/",
  "/domatia-xios/oikogeneiako-diamerisma": "/el/domatia-xios/oikogeneiako-diamerisma/",
  "/domatia-xios/diklina-triklina-domatia": "/el/domatia-xios/diklina-triklina-domatia/",
  "/domatia-xios/oikonomiko-diklino-domatio": "/el/domatia-xios/oikonomiko-diklino-domatio/",
  "/chios-rooms/double-triple-rooms": "/chios-rooms/standard-double-room/",
  "/chios-rooms/ground-floor-rooms": "/chios-rooms/standard-double-room/",
  "/chios-rooms/economy-double-room": "/chios-rooms/economy-double-rooms/",
  "/chios-rooms/family-chios-apartments-voulamandis-house-chios-hotels": "/chios-rooms/family-chios-apartments/",
  "/chios-rooms/double-triple-rooms-voulamandis-house-chios-hotels": "/chios-rooms/standard-double-room/",
  "/chios-rooms/economy-double-chios-rooms-voulamandis-house-chios-hotels": "/chios-rooms/economy-double-rooms/",

  "/chios/chios-activities/the-chios-thermal-baths/chios": "/chios-thermal-baths/",
  "/chios/chios-activities/chios-thermal-baths": "/chios-thermal-baths/",
  "/chios/chios-activities/rocket-war-of-chios": "/rocket-war-chios/",
  "/chios/chios-activities/chios-greek-language-courses": "/chios-activities/",
  "/chios/mastic-gum": "/taste-lover-chios/",
  "/chios": "/chios-island/",
};

const gonePathPrefixes = [
  "/elementor-landing-page-4251",
  "/language",
  "/wp-admin",
  "/wp-content",
  "/wp-includes",
  "/wp-json",
  "/wp-sitemap.xml",
  "/platform-voulamandis",
  "/info-box",
];

const goneExactPaths = new Set([
  "/albums",
  "/en/albums",
  "/el/albums",
  "/test-2",
  "/privacy-policy",
]);

function normalizePath(pathname: string) {
  let decodedPath = pathname;

  try {
    decodedPath = decodeURIComponent(pathname);
  } catch {
    decodedPath = pathname;
  }

  const lowerPath = decodedPath.toLowerCase();

  if (lowerPath !== "/" && lowerPath.endsWith("/")) {
    return lowerPath.slice(0, -1);
  }

  return lowerPath;
}

function isWordPressFeedPath(pathname: string) {
  return (
    pathname === "/feed" ||
    pathname.endsWith("/feed") ||
    pathname.includes("/comments/feed")
  );
}

function isLegacyTaxonomyPath(pathname: string) {
  return /^\/(?:[a-z]{2}\/)?(?:tag|topics|topic|category|uncategorized|uncategorized-[a-z]{2})\b/.test(
    pathname,
  );
}

function isGonePath(pathname: string, request: NextRequest) {
  if (request.nextUrl.searchParams.has("p") || request.nextUrl.searchParams.has("page_id")) {
    return true;
  }

  if (goneExactPaths.has(pathname)) {
    return true;
  }

  if (gonePathPrefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))) {
    return true;
  }

  return isWordPressFeedPath(pathname) || isLegacyTaxonomyPath(pathname);
}

export function middleware(request: NextRequest) {
  const pathname = normalizePath(request.nextUrl.pathname);
  const redirectDestination = legacyPermanentRedirects[pathname];

  if (redirectDestination) {
    const url = request.nextUrl.clone();
    url.pathname = redirectDestination;
    url.search = "";

    return NextResponse.redirect(url, 308);
  }

  if (isGonePath(pathname, request)) {
    return new NextResponse("Gone", {
      status: 410,
      headers: {
        "Cache-Control": "public, max-age=86400",
        "X-Robots-Tag": "noindex, nofollow",
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|images|api).*)"],
};
