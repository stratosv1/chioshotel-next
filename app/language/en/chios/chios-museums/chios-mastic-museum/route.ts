import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const destinationPath = "/chios-hotels/";

function redirectToChiosHotels(request: NextRequest) {
  return NextResponse.redirect(new URL(destinationPath, request.url), 308);
}

export function GET(request: NextRequest) {
  return redirectToChiosHotels(request);
}

export function HEAD(request: NextRequest) {
  return redirectToChiosHotels(request);
}
