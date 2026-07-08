import type { NextRequest } from "next/server";
import { permanentRedirectResponse } from "@/lib/permanent-redirect-response";

export function GET(request: NextRequest) {
  return permanentRedirectResponse(request, "/el/mouseia-xios/mouseio-mastichas-xios/");
}

export const HEAD = GET;
