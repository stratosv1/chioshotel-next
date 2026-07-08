import type { NextRequest } from "next/server";
import { permanentRedirectResponse } from "@/lib/permanent-redirect-response";

export function GET(request: NextRequest) {
  return permanentRedirectResponse(request, "/tr/sakiz-adasi-koyleri/vessa-koyu/");
}

export const HEAD = GET;
