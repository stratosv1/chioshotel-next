import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { DEALS_PAGE_PATHS, offerShareLink, roomImageChoices, ROOM_LABELS } from "@/lib/offers/catalog";
import { deleteOffer, listAllOffers, saveOffer, validateOfferInput } from "@/lib/offers/store";
import { isOfferLive, OFFER_LANGUAGES } from "@/lib/offers/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Access is protected by the staff Basic Auth in proxy.ts (/api/staff/*).

function noStore(data: unknown, status = 200) {
  return NextResponse.json(data, { status, headers: { "Cache-Control": "no-store" } });
}

function refreshDealsPages() {
  for (const path of Object.values(DEALS_PAGE_PATHS)) revalidatePath(path);
}

async function payload() {
  const offers = await listAllOffers();
  return {
    ok: true,
    offers: offers.map((offer) => ({
      ...offer,
      live: isOfferLive(offer),
      shareLinks: Object.fromEntries(OFFER_LANGUAGES.map((language) => [language, offerShareLink(offer.slug, language)])),
    })),
    rooms: Object.entries(ROOM_LABELS).map(([key, label]) => ({ key, label })),
    images: roomImageChoices(),
    dealsPages: DEALS_PAGE_PATHS,
  };
}

export async function GET() {
  try {
    return noStore(await payload());
  } catch (error) {
    console.error("staff offers GET failed", error);
    return noStore({ ok: false, error: "Δεν φορτώθηκαν οι προσφορές." }, 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    const validation = validateOfferInput(body);
    if ("error" in validation) return noStore({ ok: false, error: validation.error }, 400);
    await saveOffer(validation.offer);
    refreshDealsPages();
    return noStore(await payload());
  } catch (error) {
    const message = error instanceof Error && /unique/i.test(error.message)
      ? "Υπάρχει ήδη προσφορά με αυτό το όνομα link."
      : "Η αποθήκευση απέτυχε.";
    console.error("staff offers POST failed", error);
    return noStore({ ok: false, error: message }, 500);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get("id") ?? "";
    if (!/^\d+$/.test(id)) return noStore({ ok: false, error: "Μη έγκυρο id." }, 400);
    await deleteOffer(id);
    refreshDealsPages();
    return noStore(await payload());
  } catch (error) {
    console.error("staff offers DELETE failed", error);
    return noStore({ ok: false, error: "Η διαγραφή απέτυχε." }, 500);
  }
}
