import { NextRequest, NextResponse } from "next/server";
import { sendDepositEmail } from "@/lib/pyrgos/deposit-email";
import { ActionError, addCharge, addNote, removeCharge, cancelBooking, createBooking, sendConfirmationEmail, splitBooking, swapBookings, updateBeds, updateBooking, updateMoney } from "@/lib/pyrgos/actions";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

// Access is protected by the staff Basic Auth in proxy.ts (/api/staff/*).

const headers = { "Cache-Control": "no-store" };

const ACTIONS: Record<string, (body: any) => Promise<unknown>> = {
  create: createBooking,
  update: updateBooking,
  cancel: cancelBooking,
  money: updateMoney,
  beds: updateBeds,
  note: addNote,
  swap: swapBookings,
  split: splitBooking,
  confirm: sendConfirmationEmail,
  deposit_email: sendDepositEmail,
  charge_add: addCharge,
  charge_remove: removeCharge,
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const action = ACTIONS[String(body?.action)];
    if (!action) return NextResponse.json({ ok: false, error: "Άγνωστη ενέργεια." }, { status: 400, headers });
    return NextResponse.json({ ok: true, result: await action(body) }, { headers });
  } catch (error) {
    if (error instanceof ActionError) {
      return NextResponse.json({ ok: false, error: error.message, code: error.code }, { status: error.status, headers });
    }
    console.error("[pyrgos] booking action failed", error);
    const message = error instanceof Error ? error.message : "Η ενέργεια απέτυχε.";
    return NextResponse.json({ ok: false, error: message }, { status: 502, headers });
  }
}
