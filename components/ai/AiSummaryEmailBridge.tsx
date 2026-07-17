"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";

type Status = "idle" | "sending" | "sent" | "error";
type Locale = "el" | "en" | "de" | "fr" | "it" | "es" | "tr";

const WHATSAPP_NUMBER = "306944474226";

const COPY: Record<Locale, {
  summaryTitle: string;
  actionTitle: string;
  email: string;
  sendingButton: string;
  sending: string;
  sent: string;
  error: string;
  close: string;
  subject: string;
  whatsappIntro: string;
}> = {
  el: { summaryTitle:"Αναλυτική σύνοψη", actionTitle:"Στείλτε το αίτημα στη reception", email:"Email", sendingButton:"Αποστολή…", sending:"Το μήνυμα αποστέλλεται…", sent:"Το μήνυμα εστάλη. Σύντομα η reception θα επικοινωνήσει μαζί σας.", error:"Δεν ήταν δυνατή η αποστολή. Δοκιμάστε ξανά σε λίγο.", close:"Κλείσιμο μηνύματος", subject:"Αίτημα διαμονής από AI Room Finder", whatsappIntro:"Γεια σας! Ενδιαφέρομαι για την παρακάτω διαμονή:" },
  en: { summaryTitle:"Detailed summary", actionTitle:"Send your request to reception", email:"Email", sendingButton:"Sending…", sending:"Your message is being sent…", sent:"Your message was sent. Reception will contact you shortly.", error:"The message could not be sent. Please try again shortly.", close:"Close message", subject:"Stay request from AI Room Finder", whatsappIntro:"Hello! I am interested in the following stay:" },
  de: { summaryTitle:"Detaillierte Übersicht", actionTitle:"Anfrage an die Rezeption senden", email:"E-Mail", sendingButton:"Wird gesendet…", sending:"Ihre Nachricht wird gesendet…", sent:"Ihre Nachricht wurde gesendet. Die Rezeption wird Sie in Kürze kontaktieren.", error:"Die Nachricht konnte nicht gesendet werden. Bitte versuchen Sie es später erneut.", close:"Nachricht schließen", subject:"Aufenthaltsanfrage vom AI Room Finder", whatsappIntro:"Hallo! Ich interessiere mich für folgenden Aufenthalt:" },
  fr: { summaryTitle:"Récapitulatif détaillé", actionTitle:"Envoyer la demande à la réception", email:"E-mail", sendingButton:"Envoi…", sending:"Votre message est en cours d’envoi…", sent:"Votre message a été envoyé. La réception vous contactera bientôt.", error:"Le message n’a pas pu être envoyé. Veuillez réessayer dans un instant.", close:"Fermer le message", subject:"Demande de séjour depuis AI Room Finder", whatsappIntro:"Bonjour ! Je suis intéressé(e) par le séjour suivant :" },
  it: { summaryTitle:"Riepilogo dettagliato", actionTitle:"Invia la richiesta alla reception", email:"Email", sendingButton:"Invio…", sending:"Il messaggio è in fase di invio…", sent:"Il messaggio è stato inviato. La reception la contatterà a breve.", error:"Non è stato possibile inviare il messaggio. Riprovi tra poco.", close:"Chiudi messaggio", subject:"Richiesta di soggiorno da AI Room Finder", whatsappIntro:"Salve! Sono interessato/a al seguente soggiorno:" },
  es: { summaryTitle:"Resumen detallado", actionTitle:"Enviar la solicitud a recepción", email:"Email", sendingButton:"Enviando…", sending:"El mensaje se está enviando…", sent:"El mensaje se envió. Recepción se pondrá en contacto con usted pronto.", error:"No se pudo enviar el mensaje. Inténtelo de nuevo en unos instantes.", close:"Cerrar mensaje", subject:"Solicitud de estancia desde AI Room Finder", whatsappIntro:"Hola. Me interesa la siguiente estancia:" },
  tr: { summaryTitle:"Ayrıntılı özet", actionTitle:"Talebi resepsiyona gönderin", email:"E-posta", sendingButton:"Gönderiliyor…", sending:"Mesajınız gönderiliyor…", sent:"Mesajınız gönderildi. Resepsiyon kısa süre içinde sizinle iletişime geçecektir.", error:"Mesaj gönderilemedi. Lütfen kısa süre sonra tekrar deneyin.", close:"Mesajı kapat", subject:"AI Room Finder konaklama talebi", whatsappIntro:"Merhaba! Aşağıdaki konaklamayla ilgileniyorum:" },
};

function findSummaryContainer(heading: HTMLElement) {
  let node: HTMLElement | null = heading;
  for (let depth = 0; node && depth < 8; depth += 1, node = node.parentElement) {
    const text = (node.innerText || "").trim();
    const hasRoundedCard = Array.from(node.classList).some((name) => name.startsWith("rounded-["));
    const hasSummaryContent = /Νέα αναζήτηση|New search|Neue Suche|Nouvelle recherche|Nuova ricerca|Nueva búsqueda|Yeni arama/.test(text);
    if (hasRoundedCard && hasSummaryContent) return node;
  }
  return heading.parentElement?.parentElement || heading.parentElement;
}

function findSummaryCard() {
  const entries = Object.entries(COPY) as [Locale, (typeof COPY)[Locale]][];
  for (const [locale, copy] of entries) {
    const heading = Array.from(document.querySelectorAll<HTMLElement>("h1,h2,h3,[role='heading']")).find(
      (node) => (node.textContent || "").trim() === copy.summaryTitle,
    );
    if (heading) return { locale, card: findSummaryContainer(heading) };
  }
  return { locale: "el" as Locale, card: null };
}

function cleanSummary(card: HTMLElement) {
  return (card.innerText || "")
    .replace(/Νέα αναζήτηση|New search|Neue Suche|Nouvelle recherche|Nuova ricerca|Nueva búsqueda|Yeni arama/g, "")
    .replace(/Στείλτε το αίτημα στη reception|Send your request to reception|Anfrage an die Rezeption senden|Envoyer la demande à la réception|Invia la richiesta alla reception|Enviar la solicitud a recepción|Talebi resepsiyona gönderin/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function AiSummaryEmailBridge() {
  const [status, setStatus] = useState<Status>("idle");
  const [host, setHost] = useState<HTMLElement | null>(null);
  const [locale, setLocale] = useState<Locale>("el");
  const copy = COPY[locale];

  useEffect(() => {
    const locate = () => {
      const result = findSummaryCard();
      setLocale(result.locale);
      setHost((current) => (current === result.card ? current : result.card));
    };
    locate();
    const observer = new MutationObserver(locate);
    observer.observe(document.body, { childList: true, subtree: true });
    const timer = window.setInterval(locate, 500);
    return () => { observer.disconnect(); window.clearInterval(timer); };
  }, []);

  useEffect(() => {
    if (status !== "sent" && status !== "error") return;
    const timer = window.setTimeout(() => setStatus("idle"), status === "sent" ? 4500 : 6000);
    return () => window.clearTimeout(timer);
  }, [status]);

  const summaryText = useMemo(() => (host ? cleanSummary(host) : ""), [host, status]);

  async function sendEmail() {
    if (!host || status === "sending") return;
    setStatus("sending");
    try {
      const response = await fetch("/api/ai-assistant/summary-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject: copy.subject, message: cleanSummary(host) }),
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok || !payload?.ok) throw new Error(payload?.error || "Email send failed");
      setStatus("sent");
    } catch (error) {
      console.error("AI summary email send error:", error);
      setStatus("error");
    }
  }

  function openWhatsApp() {
    if (!host) return;
    const message = `${copy.whatsappIntro}\n\n${cleanSummary(host)}`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  }

  const actions = host ? createPortal(
    <div className="mt-5 border-t border-stone-200 pt-4" data-ai-summary-actions="true">
      <p className="mb-3 text-sm font-semibold text-stone-700">{copy.actionTitle}</p>
      <div className="grid grid-cols-2 gap-3">
        <button type="button" onClick={() => void sendEmail()} disabled={status === "sending"} className="min-h-12 rounded-2xl border border-[#435f12] bg-white px-4 py-3.5 text-sm font-bold text-[#435f12] shadow-sm transition hover:bg-[#f6f8ef] disabled:opacity-60">
          {status === "sending" ? copy.sendingButton : copy.email}
        </button>
        <button type="button" onClick={openWhatsApp} className="min-h-12 rounded-2xl bg-[#1f9d55] px-4 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#188347]">
          WhatsApp
        </button>
      </div>
    </div>,
    host,
  ) : null;

  const feedback = status === "idle" ? null : status === "sending" ? copy.sending : status === "sent" ? copy.sent : copy.error;

  return <>{actions}{feedback ? <div role="status" aria-live="polite" className={`fixed inset-x-4 bottom-5 z-[1000] mx-auto max-w-md rounded-2xl border px-12 py-4 text-center text-sm font-semibold shadow-2xl ${status === "sent" ? "border-emerald-200 bg-emerald-50 text-emerald-900" : status === "error" ? "border-red-200 bg-red-50 text-red-800" : "border-stone-200 bg-white text-stone-800"}`}>{feedback}{status !== "sending" ? <button type="button" onClick={() => setStatus("idle")} aria-label={copy.close} className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-xl opacity-70 hover:bg-black/5">×</button> : null}</div> : null}</>;
}
