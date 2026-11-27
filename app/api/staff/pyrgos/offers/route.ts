import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { DEALS_PAGE_PATHS } from "@/lib/offers/catalog";
import { addPlanOffer, deletePlanOffer, parseOfferInput, updatePlanOffer } from "@/lib/pyrgos/plan-offers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Access is protected by the staff Basic Auth in proxy.ts (/api/staff/*).

const headers = { "Cache-Control": "no-store" };
const bad = (error: string) => NextResponse.json({ ok: false, error }, { status: 400, headers });

/** The deals pages show plan offers: refresh them right away after a change. */
function refreshDealsPages() {
  for (const path of Object.values(DEALS_PAGE_PATHS)) revalidatePath(path);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (body.action === "add" || body.action === "update") {
      const input = parseOfferInput(body);
      if (typeof input === "string") return bad(input);
      if (body.action === "add") {
        const id = await addPlanOffer(input);
        refreshDealsPages();
        return NextResponse.json({ ok: true, id }, { headers });
      }
      const id = Number(body.id);
      if (!Number.isInteger(id) || id < 1) return bad("Μη έγκυρη προσφορά.");
      await updatePlanOffer(id, input);
      refreshDealsPages();
      return NextResponse.json({ ok: true }, { headers });
    }
    if (body.action === "delete") {
      const id = Number(body.id);
      if (!Number.isInteger(id) || id < 1) return bad("Μη έγκυρη προσφορά.");
      await deletePlanOffer(id);
      refreshDealsPages();
      return NextResponse.json({ ok: true }, { headers });
    }
    return bad("Άγνωστη ενέργεια.");
  } catch (error) {
    console.error("[pyrgos] plan offer failed", error);
    return NextResponse.json({ ok: false, error: "Η αποθήκευση της προσφοράς απέτυχε." }, { status: 500, headers });
  }
}
