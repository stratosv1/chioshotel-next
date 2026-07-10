import { NextResponse, type NextRequest } from "next/server";

const beachPagePaths = new Set([
  "/chios/chios-beaches/",
  "/el/paralies-xios/",
  "/fr/plages-de-chios/",
  "/de/straende-chios/",
  "/it/spiagge-chios/",
  "/es/playas-chios/",
  "/tr/sakiz-adasi-plajlari/",
]);

const villagePagePaths = new Set([
  "/chios/chios-villages/",
  "/el/xoria-xios/",
  "/fr/villages-de-chios/",
  "/de/doerfer-chios/",
  "/it/villaggi-chios/",
  "/es/pueblos-chios/",
  "/tr/sakiz-adasi-koyleri/",
]);

function normalizePath(pathname: string) {
  if (pathname === "/") {
    return pathname;
  }

  return pathname.endsWith("/") ? pathname : `${pathname}/`;
}

function buildImagePreloadHeader(imagePath: string) {
  return `<${imagePath}>; rel=preload; as=image; type=image/webp; fetchpriority=high`;
}

export function middleware(request: NextRequest) {
  const pathname = normalizePath(request.nextUrl.pathname);
  const response = NextResponse.next();

  if (beachPagePaths.has(pathname)) {
    response.headers.set(
      "Link",
      buildImagePreloadHeader("/images/beaches/691-e1645969589226.webp"),
    );
  }

  if (villagePagePaths.has(pathname)) {
    response.headers.set(
      "Link",
      buildImagePreloadHeader("/images/villages/lagada_3.webp"),
    );
  }

  return response;
}

export const config = {
  matcher: [
    "/chios/chios-beaches/:path*",
    "/el/paralies-xios/:path*",
    "/fr/plages-de-chios/:path*",
    "/de/straende-chios/:path*",
    "/it/spiagge-chios/:path*",
    "/es/playas-chios/:path*",
    "/tr/sakiz-adasi-plajlari/:path*",
    "/chios/chios-villages/:path*",
    "/el/xoria-xios/:path*",
    "/fr/villages-de-chios/:path*",
    "/de/doerfer-chios/:path*",
    "/it/villaggi-chios/:path*",
    "/es/pueblos-chios/:path*",
    "/tr/sakiz-adasi-koyleri/:path*",
  ],
};
