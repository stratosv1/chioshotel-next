import { NextRequest, NextResponse } from "next/server";
import { ActionError } from "@/lib/pyrgos/actions";
import { getGuestProfile, requestMissingDetails, saveArrival, sendGuestMessage } from "@/lib/pyrgos/guest";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

// Access is protected by the staff Basic Auth in proxy.ts (/api/staff/*).

const headers = { "Cache-Control": "no-store" };

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id") ?? "";
  if (!/^[\w-]{1,30}$/.test(id)) return NextResponse.json({ ok: false, error: "Μη έγκυρη κράτηση." }, { status: 400, headers });
  try {
    const profile = await getGuestProfile(id);
    return profile
      ? NextResponse.json({ ok: true, profile }, { headers })
      : NextResponse.json({ ok: false, error: "Η κράτηση δεν βρέθηκε." }, { status: 404, headers });
  } catch (error) {
    console.error("[pyrgos] guest profile failed", error);
    return NextResponse.json({ ok: false, error: "Δεν φόρτωσαν τα στοιχεία πελάτη." }, { status: 500, headers });
  }
}

const ACTIONS: Record<string, (body: any) => Promise<unknown>> = {
  send: sendGuestMessage,
  request: requestMissingDetails,
  arrival: saveArrival,
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const action = ACTIONS[String(body?.action)];
    if (!action) return NextResponse.json({ ok: false, error: "Άγνωστη ενέργεια." }, { status: 400, headers });
    return NextResponse.json({ ok: true, result: await action(body) }, { headers });
  } catch (error) {
    if (error instanceof ActionError) return NextResponse.json({ ok: false, error: error.message }, { status: error.status, headers });
    console.error("[pyrgos] guest action failed", error);
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : "Η αποστολή απέτυχε." }, { status: 502, headers });
  }
}
