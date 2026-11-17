import { NextResponse } from "next/server";
import { getMixalisSession } from "@/lib/mixalis/auth";
import { ORMI_MAP_HTML, ORMI_MAP_PDF_BASE64 } from "@/lib/mixalis/ormi-map-assets";

export const dynamic = "force-dynamic";

const privateHeaders = {
  "Cache-Control": "private, no-store",
  "X-Robots-Tag": "noindex, nofollow",
};

export async function GET(
  request: Request,
  { params }: { params: Promise<{ format: string }> },
) {
  if (!(await getMixalisSession())) {
    const response = NextResponse.redirect(new URL("/mixalis/login/", request.url), 303);
    for (const [name, value] of Object.entries(privateHeaders)) {
      response.headers.set(name, value);
    }
    return response;
  }

  const { format } = await params;
  if (format === "motion") {
    return new NextResponse(ORMI_MAP_HTML, {
      headers: {
        ...privateHeaders,
        "Content-Type": "text/html; charset=utf-8",
        "Content-Security-Policy":
          "default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; base-uri 'none'; form-action 'none'; frame-ancestors 'self'",
      },
    });
  }
  if (format === "pdf") {
    return new NextResponse(new Uint8Array(Buffer.from(ORMI_MAP_PDF_BASE64, "base64")), {
      headers: {
        ...privateHeaders,
        "Content-Type": "application/pdf",
        "Content-Disposition": 'inline; filename="Xartis_Ormis_Mixalis.pdf"',
      },
    });
  }

  return new NextResponse(null, { status: 404, headers: privateHeaders });
}
