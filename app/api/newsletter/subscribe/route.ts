import { NextRequest, NextResponse } from "next/server";
import { addNewsletterSubscriber } from "@/lib/offers/store";
import { isOfferLanguage } from "@/lib/offers/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EMAIL_PATTERN = /^[^\s@]{1,64}@[^\s@]{1,190}\.[^\s@]{2,24}$/;

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });

  // Honeypot field: real visitors never fill it in.
  if (String(body.website ?? "").trim()) return NextResponse.json({ ok: true });

  const email = String(body.email ?? "").trim().toLowerCase();
  const language = String(body.language ?? "en");
  const consent = body.consent === true;
  const consentText = String(body.consentText ?? "").slice(0, 500);

  if (!EMAIL_PATTERN.test(email)) return NextResponse.json({ ok: false, error: "email" }, { status: 400 });
  if (!consent) return NextResponse.json({ ok: false, error: "consent" }, { status: 400 });

  try {
    await addNewsletterSubscriber({
      email,
      language: isOfferLanguage(language) ? language : "en",
      source: String(body.source ?? "deals-page").slice(0, 80) || null,
      offerSlug: body.offer ? String(body.offer).slice(0, 80) : null,
      consentText,
    });
    return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("newsletter subscribe failed", error);
    return NextResponse.json({ ok: false, error: "server" }, { status: 500 });
  }
}
