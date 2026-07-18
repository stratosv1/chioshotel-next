"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";

type Locale = "el" | "en" | "de" | "fr" | "it" | "es" | "tr";
type Status = "idle" | "sending" | "sent" | "error";

type GuestDetails = {
  name: string;
  email: string;
  phone: string;
};

const WHATSAPP_NUMBER = "306944474226";

const COPY: Record<Locale, {
  contactTitle:string; help:string; name:string; email:string; phone:string; required:string; invalidEmail:string;
  emailCta:string; whatsappCta:string; sending:string; sent:string; error:string; disclaimer:string; subject:string; intro:string;
}> = {
  el:{contactTitle:"Στείλτε το αίτημά σας στην ομάδα μας",help:"Γράψτε το όνομά σας και τουλάχιστον ένα στοιχείο επικοινωνίας: τηλέφωνο ή email.",name:"Όνομα",email:"Email",phone:"Τηλέφωνο",required:"Συμπληρώστε το όνομά σας και τουλάχιστον τηλέφωνο ή email.",invalidEmail:"Γράψτε ένα έγκυρο email.",emailCta:"Αποστολή αιτήματος",whatsappCta:"WhatsApp",sending:"Το αίτημά σας αποστέλλεται…",sent:"✅ Το αίτημά σας στάλθηκε με επιτυχία! Σας ευχαριστούμε πολύ 😊 Κάποιος από την ομάδα μας θα επικοινωνήσει μαζί σας το συντομότερο δυνατό.",error:"Δεν ήταν δυνατή η αποστολή. Μπορείτε να χρησιμοποιήσετε το WhatsApp ή να δοκιμάσετε ξανά.",disclaimer:"ℹ️ Το αίτημα δεν αποτελεί οριστική κράτηση μέχρι να επιβεβαιωθεί από την ομάδα μας.",subject:"Αίτημα διαμονής από το AI Room Finder",intro:"Γεια σας! Ενδιαφέρομαι για την παρακάτω διαμονή:"},
  en:{contactTitle:"Send your request to our team",help:"Enter your name and at least one contact method: phone or email.",name:"Name",email:"Email",phone:"Phone",required:"Please enter your name and at least a phone number or email.",invalidEmail:"Please enter a valid email address.",emailCta:"Send request",whatsappCta:"WhatsApp",sending:"Sending your request…",sent:"✅ Your request was sent successfully! Thank you very much 😊 A member of our team will contact you as soon as possible.",error:"The request could not be sent. Please use WhatsApp or try again.",disclaimer:"ℹ️ This request is not a confirmed booking until our team confirms it.",subject:"Stay request from AI Room Finder",intro:"Hello! I am interested in the following stay:"},
  de:{contactTitle:"Anfrage an unser Team senden",help:"Geben Sie Ihren Namen und mindestens eine Kontaktmöglichkeit an: Telefon oder E-Mail.",name:"Name",email:"E-Mail",phone:"Telefon",required:"Bitte geben Sie Ihren Namen und mindestens Telefon oder E-Mail an.",invalidEmail:"Bitte geben Sie eine gültige E-Mail-Adresse ein.",emailCta:"Anfrage senden",whatsappCta:"WhatsApp",sending:"Ihre Anfrage wird gesendet…",sent:"✅ Ihre Anfrage wurde erfolgreich gesendet! Vielen Dank 😊 Unser Team wird sich so schnell wie möglich bei Ihnen melden.",error:"Die Anfrage konnte nicht gesendet werden. Nutzen Sie WhatsApp oder versuchen Sie es erneut.",disclaimer:"ℹ️ Die Anfrage ist keine bestätigte Buchung, bis unser Team sie bestätigt.",subject:"Aufenthaltsanfrage vom AI Room Finder",intro:"Hallo! Ich interessiere mich für folgenden Aufenthalt:"},
  fr:{contactTitle:"Envoyer votre demande à notre équipe",help:"Indiquez votre nom et au moins un moyen de contact : téléphone ou e-mail.",name:"Nom",email:"E-mail",phone:"Téléphone",required:"Indiquez votre nom et au moins un téléphone ou un e-mail.",invalidEmail:"Saisissez une adresse e-mail valide.",emailCta:"Envoyer la demande",whatsappCta:"WhatsApp",sending:"Envoi de votre demande…",sent:"✅ Votre demande a bien été envoyée ! Merci beaucoup 😊 Un membre de notre équipe vous contactera dès que possible.",error:"La demande n’a pas pu être envoyée. Utilisez WhatsApp ou réessayez.",disclaimer:"ℹ️ Cette demande ne constitue pas une réservation confirmée avant validation par notre équipe.",subject:"Demande de séjour depuis AI Room Finder",intro:"Bonjour ! Je suis intéressé(e) par le séjour suivant :"},
  it:{contactTitle:"Invia la richiesta al nostro team",help:"Inserisci il tuo nome e almeno un contatto: telefono o email.",name:"Nome",email:"Email",phone:"Telefono",required:"Inserisci il nome e almeno telefono o email.",invalidEmail:"Inserisci un indirizzo email valido.",emailCta:"Invia richiesta",whatsappCta:"WhatsApp",sending:"Invio della richiesta…",sent:"✅ La tua richiesta è stata inviata con successo! Grazie mille 😊 Un membro del nostro team ti contatterà il prima possibile.",error:"Non è stato possibile inviare la richiesta. Usa WhatsApp o riprova.",disclaimer:"ℹ️ La richiesta non è una prenotazione confermata finché il nostro team non la conferma.",subject:"Richiesta di soggiorno da AI Room Finder",intro:"Salve! Sono interessato/a al seguente soggiorno:"},
  es:{contactTitle:"Envía tu solicitud a nuestro equipo",help:"Escribe tu nombre y al menos un método de contacto: teléfono o email.",name:"Nombre",email:"Email",phone:"Teléfono",required:"Escribe tu nombre y al menos teléfono o email.",invalidEmail:"Introduce un email válido.",emailCta:"Enviar solicitud",whatsappCta:"WhatsApp",sending:"Enviando tu solicitud…",sent:"✅ ¡Tu solicitud se envió correctamente! Muchas gracias 😊 Un miembro de nuestro equipo se pondrá en contacto contigo lo antes posible.",error:"No se pudo enviar la solicitud. Usa WhatsApp o inténtalo de nuevo.",disclaimer:"ℹ️ La solicitud no es una reserva confirmada hasta que nuestro equipo la confirme.",subject:"Solicitud de estancia desde AI Room Finder",intro:"Hola. Me interesa la siguiente estancia:"},
  tr:{contactTitle:"Talebinizi ekibimize gönderin",help:"Adınızı ve en az bir iletişim yöntemi girin: telefon veya e-posta.",name:"Ad",email:"E-posta",phone:"Telefon",required:"Adınızı ve en az telefon veya e-posta girin.",invalidEmail:"Geçerli bir e-posta adresi girin.",emailCta:"Talebi gönder",whatsappCta:"WhatsApp",sending:"Talebiniz gönderiliyor…",sent:"✅ Talebiniz başarıyla gönderildi! Çok teşekkür ederiz 😊 Ekibimizden biri en kısa sürede sizinle iletişime geçecektir.",error:"Talep gönderilemedi. WhatsApp kullanın veya tekrar deneyin.",disclaimer:"ℹ️ Talep, ekibimiz tarafından onaylanana kadar kesin rezervasyon değildir.",subject:"AI Room Finder konaklama talebi",intro:"Merhaba! Aşağıdaki konaklamayla ilgileniyorum:"}
};

function localeFromUrl(): Locale {
  if (typeof window === "undefined") return "en";
  const value = new URLSearchParams(window.location.search).get("lang")?.toLowerCase();
  return (["el","en","de","fr","it","es","tr"] as Locale[]).includes(value as Locale) ? value as Locale : "en";
}

function findSummaryCard(): HTMLElement | null {
  const newSearchPattern = /Νέα αναζήτηση|New search|Neue Suche|Nouvelle recherche|Nuova ricerca|Nueva búsqueda|Yeni arama/i;
  const button = Array.from(document.querySelectorAll<HTMLElement>("button,a")).find(node => newSearchPattern.test((node.textContent || "").trim()));
  if (!button) return null;
  let node: HTMLElement | null = button;
  for (let depth = 0; node && depth < 8; depth += 1, node = node.parentElement) {
    if (node.querySelector("img") && /σύνολο|total|gesamt|totale|toplam/i.test(node.innerText || "")) return node;
  }
  return button.parentElement?.parentElement || null;
}

function cleanSummary(card: HTMLElement): string {
  return (card.innerText || "")
    .replace(/Νέα αναζήτηση|New search|Neue Suche|Nouvelle recherche|Nuova ricerca|Nueva búsqueda|Yeni arama/gi, "")
    .replace(/Στείλτε το αίτημά σας στην ομάδα μας|Send your request to our team|Anfrage an unser Team senden|Envoyer votre demande à notre équipe|Invia la richiesta al nostro team|Envía tu solicitud a nuestro equipo|Talebinizi ekibimize gönderin/gi, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function validEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function AiSummaryEmailBridge() {
  const [host, setHost] = useState<HTMLElement | null>(null);
  const [locale, setLocale] = useState<Locale>("en");
  const [details, setDetails] = useState<GuestDetails>({ name:"", email:"", phone:"" });
  const [status, setStatus] = useState<Status>("idle");
  const [validation, setValidation] = useState("");
  const copy = COPY[locale];

  useEffect(() => {
    setLocale(localeFromUrl());
    const locate = () => setHost(current => {
      const next = findSummaryCard();
      return current === next ? current : next;
    });
    locate();
    const observer = new MutationObserver(locate);
    observer.observe(document.body, { childList:true, subtree:true });
    const timer = window.setInterval(locate, 400);
    return () => { observer.disconnect(); window.clearInterval(timer); };
  }, []);

  const summary = useMemo(() => host ? cleanSummary(host) : "", [host]);
  const canSend = Boolean(details.name.trim() && (details.phone.trim() || details.email.trim()) && (!details.email.trim() || validEmail(details.email)));
  const fullMessage = `${copy.intro}\n\n${summary}\n\n${copy.name}: ${details.name.trim()}\n${copy.email}: ${details.email.trim() || "—"}\n${copy.phone}: ${details.phone.trim() || "—"}`;

  function validate(): boolean {
    if (!details.name.trim() || (!details.phone.trim() && !details.email.trim())) { setValidation(copy.required); return false; }
    if (details.email.trim() && !validEmail(details.email)) { setValidation(copy.invalidEmail); return false; }
    setValidation("");
    return true;
  }

  async function sendEmail() {
    if (!host || status === "sending" || !validate()) return;
    setStatus("sending");
    try {
      const response = await fetch("/api/ai-assistant/summary-email", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({ subject:`${copy.subject} — ${details.name.trim()}`, message:fullMessage, guest:details })
      });
      if (!response.ok) throw new Error("send failed");
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  function openWhatsApp() {
    if (!validate()) return;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(fullMessage)}`, "_blank", "noopener,noreferrer");
  }

  if (!host || !summary) return null;

  const actions = createPortal(
    <section data-ai-summary-contact className="mt-5 border-t border-stone-200 pt-5">
      <h3 className="text-lg font-black text-stone-900">{copy.contactTitle}</h3>
      <p className="mt-1 text-sm leading-6 text-stone-600">{copy.help}</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <input value={details.name} onChange={e=>setDetails(v=>({...v,name:e.target.value}))} placeholder={copy.name} autoComplete="name" className="min-h-12 rounded-xl border border-stone-300 bg-white px-4 text-sm outline-none focus:border-[#ff385c]" />
        <input value={details.phone} onChange={e=>setDetails(v=>({...v,phone:e.target.value}))} placeholder={copy.phone} type="tel" autoComplete="tel" className="min-h-12 rounded-xl border border-stone-300 bg-white px-4 text-sm outline-none focus:border-[#ff385c]" />
        <input value={details.email} onChange={e=>setDetails(v=>({...v,email:e.target.value}))} placeholder={copy.email} type="email" autoComplete="email" className="min-h-12 rounded-xl border border-stone-300 bg-white px-4 text-sm outline-none focus:border-[#ff385c]" />
      </div>
      {validation ? <p className="mt-2 text-sm font-semibold text-red-700">{validation}</p> : null}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <button type="button" onClick={()=>void sendEmail()} disabled={!canSend || status === "sending"} className="min-h-13 rounded-2xl bg-[#ff385c] px-4 py-3.5 text-sm font-bold text-white shadow-sm disabled:opacity-40">{status === "sending" ? copy.sending : copy.emailCta}</button>
        <button type="button" onClick={openWhatsApp} disabled={!canSend} className="min-h-13 rounded-2xl bg-[#1f9d55] px-4 py-3.5 text-sm font-bold text-white shadow-sm disabled:opacity-40">{copy.whatsappCta}</button>
      </div>
      <p className="mt-4 rounded-xl bg-stone-100 px-4 py-3 text-xs leading-5 text-stone-600">{copy.disclaimer}</p>
    </section>,
    host
  );

  return <>{actions}{status === "sent" || status === "error" ? <div role="status" aria-live="polite" className={`fixed inset-x-4 bottom-5 z-[1000] mx-auto max-w-lg rounded-2xl border px-5 py-4 text-center text-sm font-semibold shadow-2xl ${status === "sent" ? "border-emerald-200 bg-emerald-50 text-emerald-900" : "border-red-200 bg-red-50 text-red-800"}`}>{status === "sent" ? copy.sent : copy.error}<button type="button" onClick={()=>setStatus("idle")} className="absolute right-3 top-2 text-xl" aria-label="Close">×</button></div> : null}</>;
}
