import { NextResponse } from "next/server";
import { getMixalisSession } from "@/lib/mixalis/auth";
import { ORGANIKI1_HTML } from "@/lib/mixalis/organiki1-html";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const session = await getMixalisSession();

  if (!session) {
    return NextResponse.redirect(new URL("/mixalis/login", request.url), 303);
  }

  return new NextResponse(ORGANIKI1_HTML, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "private, no-store",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}
