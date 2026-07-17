"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";

type Status = "idle" | "sending" | "sent" | "error";
type Locale = "el" | "en" | "de" | "fr" | "it" | "es" | "tr";
type GuestDetails = { firstName:string; lastName:string; email:string; phone:string };

const WHATSAPP_NUMBER = "306944474226";
const EMPTY_DETAILS: GuestDetails = { firstName:"", lastName:"", email:"", phone:"" };

const COPY: Record<Locale, {
  summaryTitle:string; actionTitle:string; detailsTitle:string; detailsHelp:string;
  firstName:string; lastName:string; guestEmail:string; phone:string;
  required:string; invalidEmail:string; invalidPhone:string; email:string;
  sendingButton:string; sending:string; sent:string; error:string; close:string;
  subject:string; whatsappIntro:string; customerLabel:string;
}> = {
  el:{summaryTitle:"Αναλυτική σύνοψη",actionTitle:"Στείλτε το αίτημα στη reception",detailsTitle:"Στοιχεία επικοινωνίας",detailsHelp:"Συμπληρώστε όλα τα στοιχεία σας για να ενεργοποιηθούν το Email και το WhatsApp.",firstName:"Όνομα",lastName:"Επώνυμο",guestEmail:"Email",phone:"Τηλέφωνο",required:"Συμπληρώστε όλα τα πεδία.",invalidEmail:"Γράψτε ένα έγκυρο email.",invalidPhone:"Γράψτε ένα έγκυρο τηλέφωνο.",email:"Email",sendingButton:"Αποστολή…",sending:"Το μήνυμα αποστέλλεται…",sent:"Το μήνυμα εστάλη. Σύντομα η reception θα επικοινωνήσει μαζί σας.",error:"Δεν ήταν δυνατή η αποστολή. Δοκιμάστε ξανά σε λίγο.",close:"Κλείσιμο μηνύματος",subject:"Αίτημα διαμονής από AI Room Finder",whatsappIntro:"Γεια σας! Ενδιαφέρομαι για την παρακάτω διαμονή:",customerLabel:"Στοιχεία πελάτη"},
  en:{summaryTitle:"Detailed summary",actionTitle:"Send your request to reception",detailsTitle:"Contact details",detailsHelp:"Complete all your details to activate Email and WhatsApp.",firstName:"First name",lastName:"Last name",guestEmail:"Email",phone:"Phone",required:"Please complete all fields.",invalidEmail:"Enter a valid email address.",invalidPhone:"Enter a valid phone number.",email:"Email",sendingButton:"Sending…",sending:"Your message is being sent…",sent:"Your message was sent. Reception will contact you shortly.",error:"The message could not be sent. Please try again shortly.",close:"Close message",subject:"Stay request from AI Room Finder",whatsappIntro:"Hello! I am interested in the following stay:",customerLabel:"Guest details"},
  de:{summaryTitle:"Detaillierte Übersicht",actionTitle:"Anfrage an die Rezeption senden",detailsTitle:"Kontaktdaten",detailsHelp:"Füllen Sie alle Angaben aus, um E-Mail und WhatsApp zu aktivieren.",firstName:"Vorname",lastName:"Nachname",guestEmail:"E-Mail",phone:"Telefon",required:"Bitte füllen Sie alle Felder aus.",invalidEmail:"Geben Sie eine gültige E-Mail-Adresse ein.",invalidPhone:"Geben Sie eine gültige Telefonnummer ein.",email:"E-Mail",sendingButton:"Wird gesendet…",sending:"Ihre Nachricht wird gesendet…",sent:"Ihre Nachricht wurde gesendet. Die Rezeption wird Sie in Kürze kontaktieren.",error:"Die Nachricht konnte nicht gesendet werden. Bitte versuchen Sie es später erneut.",close:"Nachricht schließen",subject:"Aufenthaltsanfrage vom AI Room Finder",whatsappIntro:"Hallo! Ich interessiere mich für folgenden Aufenthalt:",customerLabel:"Gastdaten"},
  fr:{summaryTitle:"Récapitulatif détaillé",actionTitle:"Envoyer la demande à la réception",detailsTitle:"Coordonnées",detailsHelp:"Complétez toutes vos coordonnées pour activer l’e-mail et WhatsApp.",firstName:"Prénom",lastName:"Nom",guestEmail:"E-mail",phone:"Téléphone",required:"Veuillez remplir tous les champs.",invalidEmail:"Saisissez une adresse e-mail valide.",invalidPhone:"Saisissez un numéro de téléphone valide.",email:"E-mail",sendingButton:"Envoi…",sending:"Votre message est en cours d’envoi…",sent:"Votre message a été envoyé. La réception vous contactera bientôt.",error:"Le message n’a pas pu être envoyé. Veuillez réessayer dans un instant.",close:"Fermer le message",subject:"Demande de séjour depuis AI Room Finder",whatsappIntro:"Bonjour ! Je suis intéressé(e) par le séjour suivant :",customerLabel:"Coordonnées du client"},
  it:{summaryTitle:"Riepilogo dettagliato",actionTitle:"Invia la richiesta alla reception",detailsTitle:"Dati di contatto",detailsHelp:"Completa tutti i dati per attivare Email e WhatsApp.",firstName:"Nome",lastName:"Cognome",guestEmail:"Email",phone:"Telefono",required:"Compila tutti i campi.",invalidEmail:"Inserisci un indirizzo email valido.",invalidPhone:"Inserisci un numero di telefono valido.",email:"Email",sendingButton:"Invio…",sending:"Il messaggio è in fase di invio…",sent:"Il messaggio è stato inviato. La reception la contatterà a breve.",error:"Non è stato possibile inviare il messaggio. Riprovi tra poco.",close:"Chiudi messaggio",subject:"Richiesta di soggiorno da AI Room Finder",whatsappIntro:"Salve! Sono interessato/a al seguente soggiorno:",customerLabel:"Dati dell’ospite"},
  es:{summaryTitle:"Resumen detallado",actionTitle:"Enviar la solicitud a recepción",detailsTitle:"Datos de contacto",detailsHelp:"Complete todos sus datos para activar Email y WhatsApp.",firstName:"Nombre",lastName:"Apellidos",guestEmail:"Email",phone:"Teléfono",required:"Complete todos los campos.",invalidEmail:"Introduzca un correo electrónico válido.",invalidPhone:"Introduzca un número de teléfono válido.",email:"Email",sendingButton:"Enviando…",sending:"El mensaje se está enviando…",sent:"El mensaje se envió. Recepción se pondrá en contacto con usted pronto.",error:"No se pudo enviar el mensaje. Inténtelo de nuevo en unos instantes.",close:"Cerrar mensaje",subject:"Solicitud de estancia desde AI Room Finder",whatsappIntro:"Hola. Me interesa la siguiente estancia:",customerLabel:"Datos del huésped"},
  tr:{summaryTitle:"Ayrıntılı özet",actionTitle:"Talebi resepsiyona gönderin",detailsTitle:"İletişim bilgileri",detailsHelp:"E-posta ve WhatsApp seçeneklerini etkinleştirmek için tüm bilgileri doldurun.",firstName:"Ad",lastName:"Soyad",guestEmail:"E-posta",phone:"Telefon",required:"Lütfen tüm alanları doldurun.",invalidEmail:"Geçerli bir e-posta adresi girin.",invalidPhone:"Geçerli bir telefon numarası girin.",email:"E-posta",sendingButton:"Gönderiliyor…",sending:"Mesajınız gönderiliyor…",sent:"Mesajınız gönderildi. Resepsiyon kısa süre içinde sizinle iletişime geçecektir.",error:"Mesaj gönderilemedi. Lütfen kısa süre sonra tekrar deneyin.",close:"Mesajı kapat",subject:"AI Room Finder konaklama talebi",whatsappIntro:"Merhaba! Aşağıdaki konaklamayla ilgileniyorum:",customerLabel:"Misafir bilgileri"},
};

function findSummaryContainer(heading: HTMLElement) {
  let node: HTMLElement | null = heading;
  for (let depth=0; node && depth<8; depth+=1, node=node.parentElement) {
    const text=(node.innerText||"").trim();
    const rounded=Array.from(node.classList).some((name)=>name.startsWith("rounded-["));
    const summary=/Νέα αναζήτηση|New search|Neue Suche|Nouvelle recherche|Nuova ricerca|Nueva búsqueda|Yeni arama/.test(text);
    if (rounded && summary) return node;
  }
  return heading.parentElement?.parentElement || heading.parentElement;
}

function findSummaryCard() {
  for (const [locale,copy] of Object.entries(COPY) as [Locale,(typeof COPY)[Locale]][]) {
    const heading=Array.from(document.querySelectorAll<HTMLElement>("h1,h2,h3,[role='heading']")).find((node)=>(node.textContent||"").trim()===copy.summaryTitle);
    if (heading) return {locale,card:findSummaryContainer(heading)};
  }
  return {locale:"el" as Locale,card:null};
}

function cleanSummary(card: HTMLElement) {
  return (card.innerText||"")
    .replace(/Νέα αναζήτηση|New search|Neue Suche|Nouvelle recherche|Nuova ricerca|Nueva búsqueda|Yeni arama/g,"")
    .replace(/Στείλτε το αίτημα στη reception|Send your request to reception|Anfrage an die Rezeption senden|Envoyer la demande à la réception|Invia la richiesta alla reception|Enviar la solicitud a recepción|Talebi resepsiyona gönderin/g,"")
    .replace(/Στοιχεία επικοινωνίας|Contact details|Kontaktdaten|Coordonnées|Dati di contatto|Datos de contacto|İletişim bilgileri/g,"")
    .replace(/Συμπληρώστε όλα τα στοιχεία σας[^\n]*|Complete all your details[^\n]*|Füllen Sie alle Angaben[^\n]*|Complétez toutes vos coordonnées[^\n]*|Completa tutti i dati[^\n]*|Complete todos sus datos[^\n]*|E-posta ve WhatsApp seçeneklerini[^\n]*/g,"")
    .replace(/\n{3,}/g,"\n\n").trim();
}

function validEmail(value:string){return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())}
function validPhone(value:string){return value.replace(/\D/g,"").length>=8}

export function AiSummaryEmailBridge(){
  const [status,setStatus]=useState<Status>("idle");
  const [host,setHost]=useState<HTMLElement|null>(null);
  const [locale,setLocale]=useState<Locale>("el");
  const [details,setDetails]=useState<GuestDetails>(EMPTY_DETAILS);
  const [validation,setValidation]=useState("");
  const copy=COPY[locale];

  useEffect(()=>{const locate=()=>{const result=findSummaryCard();setLocale(result.locale);setHost((current)=>current===result.card?current:result.card)};locate();const observer=new MutationObserver(locate);observer.observe(document.body,{childList:true,subtree:true});const timer=window.setInterval(locate,500);return()=>{observer.disconnect();window.clearInterval(timer)}},[]);
  useEffect(()=>{if(status!=="sent"&&status!=="error")return;const timer=window.setTimeout(()=>setStatus("idle"),status==="sent"?4500:6000);return()=>window.clearTimeout(timer)},[status]);

  const summaryText=useMemo(()=>host?cleanSummary(host):"",[host]);
  const complete=details.firstName.trim()&&details.lastName.trim()&&validEmail(details.email)&&validPhone(details.phone);
  const customerText=`${copy.customerLabel}:\n${copy.firstName}: ${details.firstName.trim()}\n${copy.lastName}: ${details.lastName.trim()}\n${copy.guestEmail}: ${details.email.trim()}\n${copy.phone}: ${details.phone.trim()}`;
  const fullMessage=`${customerText}\n\n${summaryText}`;

  function validate(){if(!details.firstName.trim()||!details.lastName.trim()||!details.email.trim()||!details.phone.trim()){setValidation(copy.required);return false}if(!validEmail(details.email)){setValidation(copy.invalidEmail);return false}if(!validPhone(details.phone)){setValidation(copy.invalidPhone);return false}setValidation("");return true}
  function setField(field:keyof GuestDetails,value:string){setDetails((current)=>({...current,[field]:value}));if(validation)setValidation("")}

  async function sendEmail(){if(!host||status==="sending"||!validate())return;setStatus("sending");try{const response=await fetch("/api/ai-assistant/summary-email",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({subject:`${copy.subject} — ${details.firstName.trim()} ${details.lastName.trim()}`,message:fullMessage,guest:details})});const payload=await response.json().catch(()=>null);if(!response.ok||!payload?.ok)throw new Error(payload?.error||"Email send failed");setStatus("sent")}catch(error){console.error("AI summary email send error:",error);setStatus("error")}}
  function openWhatsApp(){if(!host||!validate())return;const message=`${copy.whatsappIntro}\n\n${fullMessage}`;window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,"_blank","noopener,noreferrer")}

  const actions=host?createPortal(<div className="mt-5 border-t border-stone-200 pt-4" data-ai-summary-actions="true"><p className="text-base font-black text-stone-900">{copy.detailsTitle}</p><p className="mt-1 text-xs leading-5 text-stone-500">{copy.detailsHelp}</p><div className="mt-3 grid gap-3 sm:grid-cols-2"><input value={details.firstName} onChange={(e)=>setField("firstName",e.target.value)} placeholder={copy.firstName} autoComplete="given-name" className="min-h-11 rounded-xl border border-stone-300 bg-white px-3 text-sm outline-none focus:border-[#6d7f34]"/><input value={details.lastName} onChange={(e)=>setField("lastName",e.target.value)} placeholder={copy.lastName} autoComplete="family-name" className="min-h-11 rounded-xl border border-stone-300 bg-white px-3 text-sm outline-none focus:border-[#6d7f34]"/><input value={details.email} onChange={(e)=>setField("email",e.target.value)} placeholder={copy.guestEmail} type="email" autoComplete="email" className="min-h-11 rounded-xl border border-stone-300 bg-white px-3 text-sm outline-none focus:border-[#6d7f34]"/><input value={details.phone} onChange={(e)=>setField("phone",e.target.value)} placeholder={copy.phone} type="tel" autoComplete="tel" className="min-h-11 rounded-xl border border-stone-300 bg-white px-3 text-sm outline-none focus:border-[#6d7f34]"/></div>{validation?<p className="mt-2 text-xs font-semibold text-red-700">{validation}</p>:null}<p className="mb-3 mt-4 text-sm font-semibold text-stone-700">{copy.actionTitle}</p><div className="grid grid-cols-2 gap-3"><button type="button" onClick={()=>void sendEmail()} disabled={!complete||status==="sending"} className="min-h-12 rounded-2xl border border-[#435f12] bg-white px-4 py-3.5 text-sm font-bold text-[#435f12] shadow-sm transition hover:bg-[#f6f8ef] disabled:cursor-not-allowed disabled:opacity-40">{status==="sending"?copy.sendingButton:copy.email}</button><button type="button" onClick={openWhatsApp} disabled={!complete} className="min-h-12 rounded-2xl bg-[#1f9d55] px-4 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#188347] disabled:cursor-not-allowed disabled:opacity-40">WhatsApp</button></div></div>,host):null;
  const feedback=status==="idle"?null:status==="sending"?copy.sending:status==="sent"?copy.sent:copy.error;
  return <>{actions}{feedback?<div role="status" aria-live="polite" className={`fixed inset-x-4 bottom-5 z-[1000] mx-auto max-w-md rounded-2xl border px-12 py-4 text-center text-sm font-semibold shadow-2xl ${status==="sent"?"border-emerald-200 bg-emerald-50 text-emerald-900":status==="error"?"border-red-200 bg-red-50 text-red-800":"border-stone-200 bg-white text-stone-800"}`}>{feedback}{status!=="sending"?<button type="button" onClick={()=>setStatus("idle")} aria-label={copy.close} className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-xl opacity-70 hover:bg-black/5">×</button>:null}</div>:null}</>;
}
