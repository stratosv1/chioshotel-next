import { goneResponse } from "@/lib/gone-response";

export function GET() {
  return goneResponse();
}

export const HEAD = GET;
