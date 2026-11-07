import { button, emailShell, esc, htmlToText, paragraph as p, type EmailLanguage } from "@/lib/crm/email-design";

// Newsletter campaigns written by staff in /staff/crm. No Node or DB imports:
// the editor renders a live preview in the browser.

export type CampaignText = { subject: string; heading: string; body: string; buttonLabel: string; buttonUrl: string };
export type CampaignContent = Partial<Record<EmailLanguage, CampaignText>>;
export type Campaign = { id: number; title: string; image: string; content: CampaignContent; updatedAt: string };

export const emptyCampaignText = (): CampaignText => ({ subject: "", heading: "", body: "", buttonLabel: "", buttonUrl: "" });

/** A language can be sent only when it has a subject and a text. */
export const isCampaignReady = (text: CampaignText | undefined) => Boolean(text?.subject.trim() && text.body.trim());

const SALUTATION: Record<EmailLanguage, string> = { el: "Αγαπητέ/ή", en: "Dear", tr: "Sevgili" };
const UNSUBSCRIBE: Record<EmailLanguage, { text: string; link: string }> = {
  el: { text: "Δεν θέλετε να λαμβάνετε τέτοια μηνύματα;", link: "Διαγραφή" },
  en: { text: "Prefer not to receive messages like this?", link: "Unsubscribe" },
  tr: { text: "Bu tür mesajlar almak istemiyor musunuz?", link: "Abonelikten çık" },
};

const isWebUrl = (value: string) => /^https:\/\/[^\s"<>]+$/i.test(value.trim());

/** Blank lines start a new paragraph; single line breaks stay. */
function paragraphs(text: string) {
  return text.trim().split(/\n\s*\n/).map((block) => p(esc(block.trim()).replace(/\n/g, "<br>"))).join("");
}

export function buildCampaignEmail(
  text: CampaignText,
  language: EmailLanguage,
  ctx: { firstName: string; lastName: string; image: string; unsubscribeUrl: string },
) {
  const full = `${ctx.firstName} ${ctx.lastName}`.trim();
  const body = (full ? p(`${SALUTATION[language]} ${esc(full)},`) : "")
    + paragraphs(text.body)
    + (text.buttonLabel.trim() && isWebUrl(text.buttonUrl) ? button(text.buttonUrl.trim(), text.buttonLabel.trim()) : "");
  const unsubscribe = UNSUBSCRIBE[language];
  const footerNote = `${esc(unsubscribe.text)} <a href="${esc(ctx.unsubscribeUrl)}" style="color:#7c8682;text-decoration:underline">${esc(unsubscribe.link)}</a>`;
  const html = emailShell({
    language,
    preheader: text.body.trim().split(/\s+/).slice(0, 18).join(" "),
    eyebrow: "Voulamandis House",
    heading: text.heading.trim() || text.subject.trim(),
    body,
    heroImage: isWebUrl(ctx.image) ? ctx.image.trim() : undefined,
    footerNote,
  });
  return { subject: text.subject.trim(), html, text: htmlToText(html) };
}
