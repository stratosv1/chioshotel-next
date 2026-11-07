import "server-only";
import { athensDate, getBulkStatus, sendBulkBatch, unsubscribeUrl, type BulkStatus } from "@/lib/crm/bulk-email";
import { deliverEmail } from "@/lib/crm/guest-emails";
import { buildGreetingEmail, type GreetingType } from "@/lib/crm/greeting-templates";
import { SITE_URL, type EmailLanguage } from "@/lib/crm/email-design";
import { normalizeEmail } from "@/lib/crm/store";

/** A January send still belongs to the Christmas just gone. */
export function greetingYear(type: GreetingType) {
  const [year, month] = athensDate().split("-").map(Number);
  return type === "christmas" && month === 1 ? year - 1 : year;
}

const keyPrefix = (type: GreetingType, year: number) => `greeting:${type}:${year}:`;

export type GreetingStatus = BulkStatus & { type: GreetingType; year: number };

export async function getGreetingStatus(type: GreetingType): Promise<GreetingStatus> {
  const year = greetingYear(type);
  return { ...(await getBulkStatus(keyPrefix(type, year))), type, year };
}

export async function sendGreetingBatch(type: GreetingType, languages: EmailLanguage[], retryFailed: boolean) {
  const year = greetingYear(type);
  return sendBulkBatch({
    prefix: keyPrefix(type, year),
    emailType: `greeting_${type}`,
    languages,
    retryFailed,
    build: (recipient, unsubscribe) => buildGreetingEmail(type, recipient.language, { ...recipient, year, unsubscribeUrl: unsubscribe }),
  });
}

const SAMPLE = { firstName: "Maria", lastName: "Papadopoulou" };

export function renderGreetingPreview(type: GreetingType, language: EmailLanguage) {
  return buildGreetingEmail(type, language, { ...SAMPLE, year: greetingYear(type), unsubscribeUrl: `${SITE_URL}/` });
}

export async function sendGreetingTest(type: GreetingType, language: EmailLanguage, to: string) {
  const email = buildGreetingEmail(type, language, { ...SAMPLE, year: greetingYear(type), unsubscribeUrl: unsubscribeUrl(normalizeEmail(to), language) });
  await deliverEmail(to, `[ΔΟΚΙΜΗ] ${email.subject}`, email.html, email.text);
}
