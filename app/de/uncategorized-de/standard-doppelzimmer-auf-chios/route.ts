import type { NextRequest } from "next/server";
import { permanentRedirectResponse } from "@/lib/permanent-redirect-response";

export function GET(request: NextRequest) {
  return permanentRedirectResponse(request, "/de/zimmer-chios/standard-doppelzimmer-auf-chios/");
}

export const HEAD = GET;
