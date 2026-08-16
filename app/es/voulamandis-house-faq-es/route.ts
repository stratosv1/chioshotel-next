import type { NextRequest } from "next/server";
import { permanentRedirectResponse } from "@/lib/permanent-redirect-response";

export function GET(request: NextRequest) {
  return permanentRedirectResponse(request, "/es/contacta-con-voulamandis-house/");
}

export const HEAD = GET;
