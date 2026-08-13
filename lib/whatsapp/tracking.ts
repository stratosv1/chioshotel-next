import { neon } from "@neondatabase/serverless";

import { normalizeWhatsAppRecipient } from "@/lib/whatsapp/360dialog";

type ProviderMessage = {
  id?: unknown;
  message_status?: unknown;
};

type SendLogInput = {
  to: string;
  templateName: string;
  languageCode: string;
  result: unknown;
};

type StatusEvent = {
  id?: unknown;
  status?: unknown;
  timestamp?: unknown;
  errors?: unknown;
  pricing?: unknown;
  [key: string]: unknown;
};

type InboundOptOutInput = {
  from: string;
  messageId: string;
  text: string;
  rawMessage: unknown;
};

function getSql() {
  const databaseUrl = process.env.DATABASE_URL?.trim();
  if (!databaseUrl) throw new Error("DATABASE_URL is not configured.");
  return neon(databaseUrl);
}

function canonicalPhone(value: string) {
  return `+${normalizeWhatsAppRecipient(value)}`;
}

export function getProviderMessage(result: unknown) {
  if (!result || typeof result !== "object") return { id: "", status: "accepted" };
  const messages = (result as { messages?: unknown }).messages;
  if (!Array.isArray(messages) || !messages.length) return { id: "", status: "accepted" };
  const message = messages[0] as ProviderMessage;
  return {
    id: typeof message.id === "string" ? message.id : "",
    status: typeof message.message_status === "string" ? message.message_status : "accepted",
  };
}

export async function isMarketingOptedOut(phone: string) {
  const sql = getSql();
  const recipientPhone = canonicalPhone(phone);
  const rows = await sql`
    select 1
    from staff_guest_communications
    where channel = 'whatsapp'
      and message_type = 'marketing_optout'
      and recipient_phone = ${recipientPhone}
    limit 1
  `;
  return rows.length > 0;
}

export async function logWhatsAppTemplateSend({
  to,
  templateName,
  languageCode,
  result,
}: SendLogInput) {
  const sql = getSql();
  const recipientPhone = canonicalPhone(to);
  const providerMessage = getProviderMessage(result);

  const rows = await sql`
    insert into staff_guest_communications (
      channel,
      direction,
      message_type,
      recipient_phone,
      sender,
      subject,
      message,
      status,
      provider,
      provider_message_id,
      provider_response,
      source,
      raw_payload,
      created_by
    ) values (
      'whatsapp',
      'outbound',
      'marketing_template',
      ${recipientPhone},
      'Voulamandis House',
      ${templateName},
      ${templateName},
      ${providerMessage.status},
      '360dialog',
      ${providerMessage.id || null},
      ${JSON.stringify(result)}::jsonb,
      'whatsapp_campaign',
      ${JSON.stringify({ to: recipientPhone, templateName, languageCode })}::jsonb,
      'staff_whatsapp'
    )
    returning id, recipient_phone, status, provider_message_id, created_at, updated_at
  `;

  return rows[0] ?? null;
}

function statusRank(status: string) {
  if (status === "read") return 4;
  if (status === "delivered") return 3;
  if (status === "sent") return 2;
  if (status === "accepted") return 1;
  return 0;
}

export async function applyWhatsAppStatusEvent(event: StatusEvent) {
  const providerMessageId = typeof event.id === "string" ? event.id : "";
  const incomingStatus = typeof event.status === "string" ? event.status.toLowerCase() : "";
  if (!providerMessageId || !incomingStatus) return;

  const sql = getSql();
  const existing = await sql`
    select id, status
    from staff_guest_communications
    where provider_message_id = ${providerMessageId}
    order by created_at desc
    limit 1
  `;
  if (!existing.length) return;

  const currentStatus = String(existing[0]?.status ?? "").toLowerCase();
  let nextStatus = incomingStatus;

  if (currentStatus === "failed") nextStatus = "failed";
  else if (incomingStatus !== "failed" && statusRank(currentStatus) > statusRank(incomingStatus)) nextStatus = currentStatus;

  await sql`
    update staff_guest_communications
    set status = ${nextStatus},
        provider_response = coalesce(provider_response, '{}'::jsonb) || jsonb_build_object('last_status_webhook', ${JSON.stringify(event)}::jsonb),
        updated_at = now()
    where id = ${existing[0].id}
  `;
}

export async function logMarketingOptOut({ from, messageId, text, rawMessage }: InboundOptOutInput) {
  const sql = getSql();
  const recipientPhone = canonicalPhone(from);

  const duplicate = await sql`
    select 1
    from staff_guest_communications
    where provider_message_id = ${messageId}
    limit 1
  `;
  if (duplicate.length) return;

  await sql`
    insert into staff_guest_communications (
      channel,
      direction,
      message_type,
      recipient_phone,
      sender,
      message,
      status,
      provider,
      provider_message_id,
      source,
      raw_payload,
      created_by
    ) values (
      'whatsapp',
      'inbound',
      'marketing_optout',
      ${recipientPhone},
      ${recipientPhone},
      ${text || "Stop offers"},
      'received',
      '360dialog',
      ${messageId},
      'whatsapp_webhook',
      ${JSON.stringify(rawMessage)}::jsonb,
      '360dialog_webhook'
    )
  `;
}

export async function getWhatsAppTracking(phones: string[] = []) {
  const sql = getSql();
  const canonical = new Set(
    phones
      .map((phone) => {
        try {
          return canonicalPhone(phone);
        } catch {
          return "";
        }
      })
      .filter(Boolean),
  );

  const outbound = await sql`
    select id, recipient_phone, status, provider_message_id, subject, created_at, updated_at
    from staff_guest_communications
    where channel = 'whatsapp'
      and direction = 'outbound'
      and source = 'whatsapp_campaign'
    order by created_at desc
    limit 500
  `;

  const optOuts = await sql`
    select recipient_phone, max(created_at) as opted_out_at
    from staff_guest_communications
    where channel = 'whatsapp'
      and message_type = 'marketing_optout'
    group by recipient_phone
    order by max(created_at) desc
    limit 1000
  `;

  const filteredOutbound = canonical.size
    ? outbound.filter((row) => canonical.has(String(row.recipient_phone ?? "")))
    : outbound;
  const filteredOptOuts = canonical.size
    ? optOuts.filter((row) => canonical.has(String(row.recipient_phone ?? "")))
    : optOuts;

  const latestByPhone = new Map<string, (typeof filteredOutbound)[number]>();
  for (const row of filteredOutbound) {
    const phone = String(row.recipient_phone ?? "");
    if (phone && !latestByPhone.has(phone)) latestByPhone.set(phone, row);
  }

  return {
    messages: Array.from(latestByPhone.values()),
    optOuts: filteredOptOuts,
  };
}
