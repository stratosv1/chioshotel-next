import type { NextRequest } from "next/server";
import { permanentRedirectResponse } from "@/lib/permanent-redirect-response";

export function GET(request: NextRequest) {
  return permanentRedirectResponse(request, "/voulamandis-house-contact-us-form-fill-in-the-form/");
}

export const HEAD = GET;
