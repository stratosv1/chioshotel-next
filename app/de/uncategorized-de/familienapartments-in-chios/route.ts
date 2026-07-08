import type { NextRequest } from "next/server";
import { permanentRedirectResponse } from "@/lib/permanent-redirect-response";

export function GET(request: NextRequest) {
  return permanentRedirectResponse(request, "/de/zimmer-chios/familienapartments-in-chios/");
}

export const HEAD = GET;
