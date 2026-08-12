const D360_BASE_URL = "https://waba-v2.360dialog.io";

export type D360TemplateComponent = {
  type: string;
  sub_type?: string;
  index?: string;
  parameters?: Array<Record<string, unknown>>;
};

type SendTemplateMessageInput = {
  to: string;
  templateName: string;
  languageCode: string;
  components?: D360TemplateComponent[];
};

export class D360ApiError extends Error {
  status: number;
  details: unknown;

  constructor(message: string, status: number, details: unknown) {
    super(message);
    this.name = "D360ApiError";
    this.status = status;
    this.details = details;
  }
}

function getApiKey() {
  const apiKey = process.env.D360_API_KEY?.trim();

  if (!apiKey) {
    throw new Error("D360_API_KEY is not configured.");
  }

  return apiKey;
}

async function d360Request(path: string, method: "GET" | "POST", body?: unknown) {
  const response = await fetch(`${D360_BASE_URL}${path}`, {
    method,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "D360-API-KEY": getApiKey(),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
    cache: "no-store",
  });

  const text = await response.text();
  let data: unknown = null;

  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!response.ok) {
    throw new D360ApiError(`360dialog request failed with status ${response.status}.`, response.status, data);
  }

  return data;
}

export function normalizeWhatsAppRecipient(value: string) {
  const digits = value.replace(/\D/g, "");

  if (digits.length < 8 || digits.length > 15) {
    throw new Error("Recipient must be a valid international phone number.");
  }

  return digits;
}

export async function listWhatsAppTemplates() {
  return d360Request("/v1/configs/templates", "GET");
}

export async function sendWhatsAppTemplateMessage({
  to,
  templateName,
  languageCode,
  components,
}: SendTemplateMessageInput) {
  const payload: Record<string, unknown> = {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to: normalizeWhatsAppRecipient(to),
    type: "template",
    template: {
      name: templateName,
      language: {
        code: languageCode,
        policy: "deterministic",
      },
      ...(components?.length ? { components } : {}),
    },
  };

  return d360Request("/messages", "POST", payload);
}
