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
  "/crazy-travel-deals-for-chios-hotels": "/chios-hotels-rates/",
  "/tr/crazy-travel-deals-for-chios-hotels": "/tr/sakiz-adasi-otel-firsatlari/",
  "/es/chios-hotels-rates": "/es/tarifas-hoteles-quios/",
  "/en/chios-hotels-rates": "/chios-hotels-rates/",

  "/domatia-xios": "/el/domatia-xios/",
  "/domatia-xios/oikogeneiako-diamerisma": "/el/domatia-xios/oikogeneiako-diamerisma/",
  "/domatia-xios/diklina-triklina-domatia": "/el/domatia-xios/diklina-triklina-domatia/",
  "/domatia-xios/oikonomiko-diklino-domatio": "/el/domatia-xios/oikonomiko-diklino-domatio/",
  "/domatia-xios/chios-mastic-2": "/el/masticha-xiou/",
  "/el/domatia-xios/chios-family-apartments": "/el/domatia-xios/oikogeneiako-diamerisma/",
  "/el/domatia-xios/chios-2": "/el/domatia-xios/",
  "/el/domatia-xios/chios-mastic-2": "/el/masticha-xiou/",
  "/el/domatia-xios/chios-rooms-double-trible-rooms": "/el/domatia-xios/diklina-triklina-domatia/",
  "/el/domatia-xios/chios-rooms-economy-double": "/el/domatia-xios/oikonomiko-diklino-domatio/",
  "/tr/domatia-xios/chios-mastic-2": "/tr/sakiz-damla-sakizi/",

  "/chios-rooms/double-triple-rooms": "/chios-rooms/standard-double-room/",
  "/chios-rooms/ground-floor-rooms": "/chios-rooms/standard-double-room/",
  "/chios-rooms/economy-double-room": "/chios-rooms/economy-double-rooms/",
  "/chios-rooms/family-chios-apartments-voulamandis-house-chios-hotels": "/chios-rooms/family-chios-apartments/",
  "/chios-rooms/double-triple-rooms-voulamandis-house-chios-hotels": "/chios-rooms/standard-double-room/",
  "/chios-rooms/double-trible-rooms-voulamandis-house-chios-hotels": "/chios-rooms/standard-double-room/",
  "/chios-rooms/economy-double-chios-rooms-voulamandis-house-chios-hotels": "/chios-rooms/economy-double-rooms/",
  "/en/chios-rooms/standard-double-room": "/chios-rooms/standard-double-room/",

  "/chios/chios-activities/the-chios-thermal-baths/chios": "/chios-thermal-baths/",
  "/chios/chios-activities/chios-thermal-baths": "/chios-thermal-baths/",
  "/chios/chios-activities/the-chios-thermal-baths": "/chios-thermal-baths/",
  "/chios/chios-activities/rocket-war-of-chios": "/rocket-war-chios/",
  "/chios/chios-activities/chios-greek-language-courses": "/chios-activities/",
  "/chios/mastic-gum": "/taste-lover-chios/",
  "/chios": "/chios-island/",
  "/chios/chios-kambos-voulamandis-house-chios-hotels": "/chios/kampos-chios/",
  "/chios/chios-orchids-voulamandis-house-chios-hotels": "/chios-orchids/",
  "/chios/the-eye-caching-chios-villages": "/chios/chios-villages/",
  "/de/chios-ist-die-beste-insel-griechenlands": "/de/chios-insel/",

  "/faq": "/",
  "/el/faq-2": "/el/",
  "/el/faq-apories-voulamandis-house": "/el/",
  "/en/erotisis-voulamandis-house-2": "/",
  "/el/epikoinonia": "/el/epikoinonia-voulamandis-house/",
  "/el/επικοινωνία": "/el/epikoinonia-voulamandis-house/",
  "/voulamandis-house-photos": "/",
  "/tr/voulamandis-house-photos": "/tr/",
  "/chios-videos-2": "/chios-island/",
  "/tr/chios-videos-2": "/tr/sakiz-adasi/",
  "/fr/chios-videos": "/fr/chios-en-grece/",
  "/en/chios-ai-chatbox": "/chios-island/",
  "/en/chios-island": "/chios-island/",
  "/en/chios-hotels-voulamandis-house": "/",
  "/el/chios-rooms-2": "/el/domatia-xios/",
  "/el/amesi-kratisi-voulamandis-house/": "/el/amesi-kratisi-voulamandis-house/",
  "/el/el-voulamandis-house": "/el/",
  "/tr/el": "/tr/",
  "/de/chios.html": "/de/chios-insel/",
  "/es/chios-holidays-quiz": "/es/quiz-vacaciones-en-quios/",
  "/fr/chios-holidays-quiz": "/fr/quiz-vacances-a-chios/",
};

const legacyPrefixRedirects: Array<{ source: string; destination: string }> = [
  { source: "/en/chios-rooms", destination: "/chios-rooms/" },
  { source: "/en/chios-hotels-rates", destination: "/chios-hotels-rates/" },
  { source: "/en/chios-island", destination: "/chios-island/" },
  { source: "/en/chios-hotels-voulamandis-house", destination: "/" },
  { source: "/en/chios", destination: "/chios-island/" },
  { source: "/en/post", destination: "/" },
  { source: "/en/article", destination: "/" },

  { source: "/chios/chios-beaches", destination: "/chios/chios-beaches/" },
  { source: "/chios/chios-villages", destination: "/chios/chios-villages/" },
  { source: "/chios/chios-museums", destination: "/chios/chios-museums/" },
  { source: "/chios/chios-activities", destination: "/chios-activities/" },
  { source: "/chios/chios-kambos", destination: "/chios/kampos-chios/" },
  { source: "/chios/chios-orchids", destination: "/chios-orchids/" },

  { source: "/el/chios-el/chios-beaches-el", destination: "/el/paralies-xios/" },
  { source: "/chios-el/chios-beaches-el", destination: "/el/paralies-xios/" },
  { source: "/tr/chios-el/chios-beaches-el", destination: "/tr/sakiz-adasi-plajlari/" },
  { source: "/el/chios-el/chios-villages-el", destination: "/el/xoria-xios/" },
  { source: "/el/chios-el/chios-villages", destination: "/el/xoria-xios/" },
  { source: "/chios-el/chios-villages-el", destination: "/el/xoria-xios/" },
  { source: "/tr/chios-el/chios-villages-el", destination: "/tr/sakiz-adasi-koyleri/" },
  { source: "/el/chios-el/chios-museums-el", destination: "/el/mouseia-xios/" },
  { source: "/chios-el/chios-museums-el", destination: "/el/mouseia-xios/" },
  { source: "/tr/chios-el/chios-museums-el", destination: "/tr/sakiz-adasi-muzeleri/" },
  { source: "/el/chios-el/chios-activities-el", destination: "/el/ti-na-do-sti-xio/" },
  { source: "/chios-el/chios-activities-el", destination: "/el/ti-na-do-sti-xio/" },
  { source: "/tr/chios-el/chios-activities-el", destination: "/tr/sakiz-adasi-aktiviteleri/" },
  { source: "/el/chios-el", destination: "/el/ti-na-do-sti-xio/" },
  { source: "/chios-el", destination: "/el/ti-na-do-sti-xio/" },
  { source: "/tr/chios-el", destination: "/tr/sakiz-adasi/" },

  { source: "/fr/chios/activites", destination: "/fr/chios-en-grece/" },
  { source: "/fr/chios", destination: "/fr/chios-en-grece/" },
  { source: "/fr/ile-de-chios", destination: "/fr/chios-en-grece/" },
  { source: "/de/chios-insel", destination: "/de/chios-insel/" },
  { source: "/it/chios-it", destination: "/it/chios-in-grecia/" },
  { source: "/es/chios", destination: "/es/quios-grecia/" },

  { source: "/tr/chios-odalari", destination: "/tr/chios-odalari/" },
  { source: "/es/habitaciones-en-chios", destination: "/es/habitaciones-en-chios/" },
  { source: "/el/domatia-xios/chios-rooms", destination: "/el/domatia-xios/" },
  { source: "/chios-rooms", destination: "/chios-rooms/" },
];

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
  "/flio-box",
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

function findPrefixRedirect(pathname: string) {
  return legacyPrefixRedirects.find(({ source, destination }) => {
    const normalizedDestination = destination.endsWith("/")
      ? destination.slice(0, -1)
      : destination;

    return (
      pathname !== normalizedDestination &&
      (pathname === source || pathname.startsWith(`${source}/`))
    );
  });
}

function redirectTo(request: NextRequest, destination: string) {
  const url = request.nextUrl.clone();
  url.pathname = destination;
  url.search = "";

  return NextResponse.redirect(url, 308);
}

export function middleware(request: NextRequest) {
  const pathname = normalizePath(request.nextUrl.pathname);
  const redirectDestination = legacyPermanentRedirects[pathname];

  if (redirectDestination) {
    return redirectTo(request, redirectDestination);
  }

  const prefixRedirect = findPrefixRedirect(pathname);

  if (prefixRedirect) {
    return redirectTo(request, prefixRedirect.destination);
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
