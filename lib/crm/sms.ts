import "server-only";
import { createHash } from "node:crypto";
import { neon } from "@neondatabase/serverless";

const SITE_URL = "https://chioshotel.gr";

function getSql() {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) throw new Error("DATABASE_URL is not configured.");
  return neon(url);
}

/** Key for the delivery callback, derived so no extra secret is needed. */
export const smsCallbackKey = () => createHash("sha256").update(`sms-dlr:${process.env.CRON_SECRET ?? ""}`).digest("hex").slice(0, 32);

export function normalizePhone(value: string) {
  const digits = value.replace(/[^\d+]/g, "").replace(/^\+/, "").replace(/^00/, "");
  if (/^69\d{8}$/.test(digits)) return `30${digits}`;
  return /^\d{10,15}$/.test(digits) ? digits : "";
}

export async function sendBookingSms(params: { bookingId: string; guestName: string; phone: string; message: string }) {
  const token = (process.env.SMSAPI_TOKEN || process.env.VHC_SMSAPI_TOKEN || "").trim();
  const sender = (process.env.SMSAPI_FROM || process.env.VHC_SMSAPI_FROM || "Voulamandis").trim();
  if (!token) throw new Error("Λείπει το SMSAPI_TOKEN.");
  const to = normalizePhone(params.phone);
  if (!to) throw new Error("Μη έγκυρο κινητό.");

  const body = new URLSearchParams({
    to,
    from: sender,
    message: params.message,
    format: "json",
    encoding: "utf-8",
    notify_url: `${SITE_URL}/api/sms/status/?key=${smsCallbackKey()}`,
  });
  const response = await fetch("https://api.smsapi.com/sms.do", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
    cache: "no-store",
    signal: AbortSignal.timeout(15_000),
  });
  const raw = await response.text();
  let result: any = null;
  try { result = JSON.parse(raw); } catch { /* kept as raw text below */ }
  const failed = !response.ok || !result || result.error;
  const providerId = result?.list?.[0]?.id ? String(result.list[0].id) : null;
  const status = failed ? "FAILED" : String(result?.list?.[0]?.status ?? "QUEUE");

  const sql = getSql();
  await sql`insert into public.staff_guest_communications
      (booking_id, guest_name, channel, direction, message_type, recipient_phone, sender, message, status, provider, provider_message_id, provider_response, source)
    values (${params.bookingId}, ${params.guestName}, 'sms', 'outbound', 'manual', ${to}, ${sender}, ${params.message}, ${status}, 'smsapi', ${providerId}, ${JSON.stringify(result ?? { raw: raw.slice(0, 500) })}::jsonb, 'crm')`;
  if (failed) throw new Error(result?.message ? `SMSAPI: ${result.message}` : "Το SMS απέτυχε.");
}

/** SMSAPI may batch up to five reports in one call, comma separated. */
export async function applySmsDeliveryReport(messageIds: string, statuses: string) {
  const ids = messageIds.split(",").map((value) => value.trim()).filter(Boolean);
  const names = statuses.split(",").map((value) => value.trim());
  if (!ids.length) return;
  const sql = getSql();
  for (const [index, id] of ids.entries()) {
    const status = (names[index] || "UNKNOWN").slice(0, 30);
    await sql`update public.staff_guest_communications set status = ${status}, updated_at = now()
      where provider = 'smsapi' and provider_message_id = ${id} and status is distinct from ${status}`;
  }
}
