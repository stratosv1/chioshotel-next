import { timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { applySmsDeliveryReport, smsCallbackKey } from "@/lib/crm/sms";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Delivery report from SMSAPI. It keeps retrying unless the answer is "OK".
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const key = Buffer.from(params.get("key") ?? "");
  const expected = Buffer.from(smsCallbackKey());
  if (key.length !== expected.length || !timingSafeEqual(key, expected)) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  try {
    await applySmsDeliveryReport(params.get("MsgId") ?? "", params.get("status_name") ?? "");
    return new NextResponse("OK", { headers: { "Content-Type": "text/plain" } });
  } catch (error) {
    console.error("[sms-status] failed", error);
    return new NextResponse("Error", { status: 500 });
  }
}
