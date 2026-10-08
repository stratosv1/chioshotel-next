import { NextRequest, NextResponse } from "next/server";
import { listNewsletterSubscribers } from "@/lib/offers/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Access is protected by the staff Basic Auth in proxy.ts (/api/staff/*).

function csvCell(value: string | null) {
  const text = value ?? "";
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

export async function GET(request: NextRequest) {
  try {
    const subscribers = await listNewsletterSubscribers();
    if (request.nextUrl.searchParams.get("format") === "csv") {
      const header = "email,language,source,offer,consent_at,unsubscribed_at";
      const lines = subscribers.map((row) =>
        [row.email, row.language, row.source, row.offerSlug, row.consentAt, row.unsubscribedAt].map(csvCell).join(","),
      );
      return new NextResponse(`${header}\n${lines.join("\n")}\n`, {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="newsletter-subscribers-${new Date().toISOString().slice(0, 10)}.csv"`,
          "Cache-Control": "no-store",
        },
      });
    }
    return NextResponse.json({ ok: true, subscribers }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("staff newsletter GET failed", error);
    return NextResponse.json({ ok: false, error: "Δεν φορτώθηκαν οι εγγραφές." }, { status: 500 });
  }
}
