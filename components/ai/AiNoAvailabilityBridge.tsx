"use client";

import { useEffect, useMemo, useState } from "react";

const WHATSAPP_NUMBER = "306944474226";

type Locale = "el" | "en" | "de" | "fr" | "it" | "es" | "tr";
type SearchDetails = { checkin:string; checkout:string; guests:number };
type Status = "idle" | "sending" | "sent" | "error";

type Copy = {
  title:string; body:string; dates:string; guests:string; changeDates:string; reception:string; whatsapp:string; newSearch:string;
  formTitle:string; formHelp:string; name:string; phone:string; email:string; send:string; sending:string; required:string; invalidEmail:string;
  sent:string; error:string; subject:string; intro:string;
};

const COPY: Record<Locale, Copy> = {
  el:{title:"😕 Δεν βρήκα διαθέσιμο δωμάτιο",body:"Δεν υπάρχει διαθέσιμη επιλογή για αυτές ακριβώς τις ημερομηνίες. Μπορείτε να αλλάξετε ημερομηνίες ή να στείλετε αμέσως αίτημα στη reception για χειροκίνητο έλεγχο.",dates:"Ημερομηνίες",guests:"Επισκέπτες",changeDates:"Αλλαγή ημερομηνιών",reception:"Αίτημα στη reception",whatsapp:"WhatsApp",newSearch:"Νέα αναζήτηση",formTitle:"Στείλτε το αίτημά σας",formHelp:"Συμπληρώστε το όνομά σας και τουλάχιστον τηλέφωνο ή email.",name:"Όνομα",phone:"Τηλέφωνο",email:"Email",send:"Αποστολή αιτήματος",sending:"Αποστολή…",required:"Συμπληρώστε όνομα και τουλάχιστον τηλέφωνο ή email.",invalidEmail:"Γράψτε ένα έγκυρο email.",sent:"✅ Το αίτημά σας στάλθηκε στη reception. Θα επικοινωνήσουμε μαζί σας το συντομότερο δυνατό.",error:"Δεν ήταν δυνατή η αποστολή. Δοκιμάστε ξανά ή χρησιμοποιήστε το WhatsApp.",subject:"Αίτημα μη διαθεσιμότητας από το AI Room Finder",intro:"Γεια σας! Δεν βρέθηκε online διαθεσιμότητα και ζητώ χειροκίνητο έλεγχο:"},
  en:{title:"😕 No room was available",body:"There is no available option for these exact dates. You can change the dates or send a request to reception for a manual check.",dates:"Dates",guests:"Guests",changeDates:"Change dates",reception:"Request reception check",whatsapp:"WhatsApp",newSearch:"New search",formTitle:"Send your request",formHelp:"Enter your name and at least a phone number or email.",name:"Name",phone:"Phone",email:"Email",send:"Send request",sending:"Sending…",required:"Enter your name and at least a phone number or email.",invalidEmail:"Enter a valid email address.",sent:"✅ Your request was sent to reception. We will contact you as soon as possible.",error:"The request could not be sent. Try again or use WhatsApp.",subject:"No-availability request from AI Room Finder",intro:"Hello! No online availability was found, and I would like a manual check:"},
  de:{title:"😕 Kein Zimmer verfügbar",body:"Für diese genauen Daten ist keine Option verfügbar. Sie können die Daten ändern oder eine manuelle Prüfung durch die Rezeption anfordern.",dates:"Daten",guests:"Gäste",changeDates:"Daten ändern",reception:"Rezeption anfragen",whatsapp:"WhatsApp",newSearch:"Neue Suche",formTitle:"Anfrage senden",formHelp:"Geben Sie Ihren Namen und mindestens Telefon oder E-Mail an.",name:"Name",phone:"Telefon",email:"E-Mail",send:"Anfrage senden",sending:"Wird gesendet…",required:"Geben Sie Ihren Namen und mindestens Telefon oder E-Mail an.",invalidEmail:"Geben Sie eine gültige E-Mail-Adresse ein.",sent:"✅ Ihre Anfrage wurde an die Rezeption gesendet. Wir melden uns so schnell wie möglich.",error:"Die Anfrage konnte nicht gesendet werden. Versuchen Sie es erneut oder nutzen Sie WhatsApp.",subject:"Anfrage bei fehlender Verfügbarkeit vom AI Room Finder",intro:"Hallo! Online wurde keine Verfügbarkeit gefunden. Ich bitte um eine manuelle Prüfung:"},
  fr:{title:"😕 Aucune chambre disponible",body:"Aucune option n’est disponible pour ces dates exactes. Vous pouvez modifier les dates ou demander une vérification manuelle à la réception.",dates:"Dates",guests:"Personnes",changeDates:"Modifier les dates",reception:"Demander à la réception",whatsapp:"WhatsApp",newSearch:"Nouvelle recherche",formTitle:"Envoyer votre demande",formHelp:"Indiquez votre nom et au moins un téléphone ou un e-mail.",name:"Nom",phone:"Téléphone",email:"E-mail",send:"Envoyer la demande",sending:"Envoi…",required:"Indiquez votre nom et au moins un téléphone ou un e-mail.",invalidEmail:"Saisissez une adresse e-mail valide.",sent:"✅ Votre demande a été envoyée à la réception. Nous vous contacterons dès que possible.",error:"La demande n’a pas pu être envoyée. Réessayez ou utilisez WhatsApp.",subject:"Demande sans disponibilité depuis AI Room Finder",intro:"Bonjour ! Aucune disponibilité en ligne n’a été trouvée. Je demande une vérification manuelle :"},
  it:{title:"😕 Nessuna camera disponibile",body:"Non è disponibile alcuna opzione per queste date esatte. Puoi modificare le date o chiedere alla reception un controllo manuale.",dates:"Date",guests:"Ospiti",changeDates:"Modifica date",reception:"Richiedi controllo reception",whatsapp:"WhatsApp",newSearch:"Nuova ricerca",formTitle:"Invia la richiesta",formHelp:"Inserisci il nome e almeno un telefono o un’email.",name:"Nome",phone:"Telefono",email:"Email",send:"Invia richiesta",sending:"Invio…",required:"Inserisci il nome e almeno un telefono o un’email.",invalidEmail:"Inserisci un indirizzo email valido.",sent:"✅ La richiesta è stata inviata alla reception. Ti contatteremo il prima possibile.",error:"Non è stato possibile inviare la richiesta. Riprova o usa WhatsApp.",subject:"Richiesta senza disponibilità da AI Room Finder",intro:"Salve! Non è stata trovata disponibilità online. Chiedo un controllo manuale:"},
  es:{title:"😕 No hay habitaciones disponibles",body:"No hay ninguna opción disponible para estas fechas exactas. Puedes cambiar las fechas o pedir a recepción una comprobación manual.",dates:"Fechas",guests:"Personas",changeDates:"Cambiar fechas",reception:"Solicitar revisión",whatsapp:"WhatsApp",newSearch:"Nueva búsqueda",formTitle:"Envía tu solicitud",formHelp:"Escribe tu nombre y al menos un teléfono o email.",name:"Nombre",phone:"Teléfono",email:"Email",send:"Enviar solicitud",sending:"Enviando…",required:"Escribe tu nombre y al menos un teléfono o email.",invalidEmail:"Introduce un email válido.",sent:"✅ Tu solicitud se envió a recepción. Nos pondremos en contacto contigo lo antes posible.",error:"No se pudo enviar la solicitud. Inténtalo de nuevo o usa WhatsApp.",subject:"Solicitud sin disponibilidad desde AI Room Finder",intro:"Hola. No se encontró disponibilidad online y solicito una comprobación manual:"},
  tr:{title:"😕 Uygun oda bulunamadı",body:"Bu kesin tarihler için uygun seçenek bulunmuyor. Tarihleri değiştirebilir veya resepsiyondan manuel kontrol isteyebilirsiniz.",dates:"Tarihler",guests:"Kişi",changeDates:"Tarihleri değiştir",reception:"Resepsiyona talep gönder",whatsapp:"WhatsApp",newSearch:"Yeni arama",formTitle:"Talebinizi gönderin",formHelp:"Adınızı ve en az bir telefon veya e-posta girin.",name:"Ad",phone:"Telefon",email:"E-posta",send:"Talebi gönder",sending:"Gönderiliyor…",required:"Adınızı ve en az bir telefon veya e-posta girin.",invalidEmail:"Geçerli bir e-posta adresi girin.",sent:"✅ Talebiniz resepsiyona gönderildi. En kısa sürede sizinle iletişime geçeceğiz.",error:"Talep gönderilemedi. Tekrar deneyin veya WhatsApp kullanın.",subject:"AI Room Finder müsaitlik bulunamadı talebi",intro:"Merhaba! Online müsaitlik bulunamadı. Manuel kontrol rica ediyorum:"}
};

function localeFromPage(): Locale {
  const supported:Locale[]=["el","en","de","fr","it","es","tr"];
  const query=new URLSearchParams(window.location.search).get("lang")?.toLowerCase().split("-")[0];
  const documentLocale=document.documentElement.lang?.toLowerCase().split("-")[0];
  return supported.includes(query as Locale)?query as Locale:supported.includes(documentLocale as Locale)?documentLocale as Locale:"en";
}

function validEmail(value:string){return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())}

export function AiNoAvailabilityBridge(){
  const [details,setDetails]=useState<SearchDetails|null>(null);
  const [locale,setLocale]=useState<Locale>("en");
  const [showForm,setShowForm]=useState(false);
  const [guest,setGuest]=useState({name:"",phone:"",email:""});
  const [status,setStatus]=useState<Status>("idle");
  const [validation,setValidation]=useState("");
  const copy=COPY[locale];

  useEffect(()=>{
    setLocale(localeFromPage());
    const originalFetch=window.fetch.bind(window);
    window.fetch=async (...args:Parameters<typeof fetch>)=>{
      const response=await originalFetch(...args);
      try{
        const url=typeof args[0]==="string"?args[0]:args[0] instanceof Request?args[0].url:"";
        const init=args[1];
        if(url.includes("/api/ai-assistant/smart")&&typeof init?.body==="string"){
          const request=JSON.parse(init.body) as {search?:Partial<SearchDetails>;language?:Locale};
          const {checkin,checkout,guests}=request.search||{};
          if(checkin&&checkout&&Number(guests)>0){
            const payload=await response.clone().json().catch(()=>null);
            if(response.ok&&Array.isArray(payload?.offers)&&payload.offers.length===0){
              setLocale(request.language&&COPY[request.language]?request.language:localeFromPage());
              setDetails({checkin,checkout,guests:Number(guests)});
              setShowForm(false);setStatus("idle");setValidation("");
            }
          }
        }
      }catch{}
      return response;
    };
    return ()=>{window.fetch=originalFetch};
  },[]);

  useEffect(()=>{
    if(!details)return;
    const hideWrongPrompt=()=>{
      const patterns=[/Επιλέξτε δωμάτιο για την ομάδα/i,/Choose a room for group/i,/Wählen Sie ein Zimmer für Gruppe/i,/Choisissez une chambre pour le groupe/i,/Scegli una camera per il gruppo/i,/Elige una habitación para el grupo/i,/grup için oda seçin/i];
      document.querySelectorAll<HTMLElement>("main div").forEach(node=>{
        const text=(node.textContent||"").trim();
        if(patterns.some(pattern=>pattern.test(text))&&node.children.length===0)node.style.display="none";
      });
    };
    hideWrongPrompt();
    const observer=new MutationObserver(hideWrongPrompt);
    observer.observe(document.body,{childList:true,subtree:true});
    return ()=>observer.disconnect();
  },[details]);

  const summary=useMemo(()=>details?`${copy.dates}: ${details.checkin} → ${details.checkout}\n${copy.guests}: ${details.guests}`:"",[details,copy]);
  if(!details)return null;

  const reset=()=>window.location.assign(`/ai-assistant/?lang=${locale}`);
  const validate=()=>{
    if(!guest.name.trim()||(!guest.phone.trim()&&!guest.email.trim())){setValidation(copy.required);return false}
    if(guest.email.trim()&&!validEmail(guest.email)){setValidation(copy.invalidEmail);return false}
    setValidation("");return true;
  };
  const message=`${copy.intro}\n\n${summary}\n\n${copy.name}: ${guest.name.trim()||"—"}\n${copy.phone}: ${guest.phone.trim()||"—"}\n${copy.email}: ${guest.email.trim()||"—"}`;
  const openWhatsApp=()=>window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,"_blank","noopener,noreferrer");
  const send=async()=>{
    if(!validate()||status==="sending")return;
    setStatus("sending");
    try{
      const response=await fetch("/api/ai-assistant/summary-email",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({subject:`${copy.subject} — ${guest.name.trim()}`,message,guest})});
      if(!response.ok)throw new Error("send failed");
      setStatus("sent");
    }catch{setStatus("error")}
  };

  return <div className="fixed inset-0 z-40 overflow-y-auto bg-[#f7f7f7]/98 px-3 pb-8 pt-24 sm:px-5">
    <section className="mx-auto max-w-xl rounded-[26px] border border-stone-200 bg-white p-5 shadow-[0_14px_45px_rgba(0,0,0,.12)] sm:p-6">
      <h2 className="text-xl font-black text-stone-900">{copy.title}</h2>
      <p className="mt-2 text-[15px] leading-6 text-stone-600">{copy.body}</p>
      <div className="mt-4 grid grid-cols-2 gap-2 rounded-2xl bg-stone-100 p-4 text-sm"><div><span className="block text-xs text-stone-500">{copy.dates}</span><strong>{details.checkin} → {details.checkout}</strong></div><div><span className="block text-xs text-stone-500">{copy.guests}</span><strong>{details.guests}</strong></div></div>
      {!showForm&&status!=="sent"?<div className="mt-5 grid gap-2 sm:grid-cols-2">
        <button onClick={reset} className="rounded-xl border border-stone-300 px-4 py-3 text-sm font-bold">{copy.changeDates}</button>
        <button onClick={()=>setShowForm(true)} className="rounded-xl bg-[#ff385c] px-4 py-3 text-sm font-bold text-white">{copy.reception}</button>
        <button onClick={openWhatsApp} className="rounded-xl border border-emerald-600 px-4 py-3 text-sm font-bold text-emerald-700">{copy.whatsapp}</button>
        <button onClick={reset} className="rounded-xl border border-stone-300 px-4 py-3 text-sm font-bold">{copy.newSearch}</button>
      </div>:null}
      {showForm&&status!=="sent"?<div className="mt-5 border-t border-stone-200 pt-5"><h3 className="text-lg font-black">{copy.formTitle}</h3><p className="mt-1 text-sm text-stone-600">{copy.formHelp}</p><div className="mt-4 grid gap-3"><input value={guest.name} onChange={e=>setGuest(v=>({...v,name:e.target.value}))} placeholder={copy.name} className="min-h-12 rounded-xl border border-stone-300 px-4"/><input value={guest.phone} onChange={e=>setGuest(v=>({...v,phone:e.target.value}))} placeholder={copy.phone} type="tel" className="min-h-12 rounded-xl border border-stone-300 px-4"/><input value={guest.email} onChange={e=>setGuest(v=>({...v,email:e.target.value}))} placeholder={copy.email} type="email" className="min-h-12 rounded-xl border border-stone-300 px-4"/></div>{validation?<p className="mt-2 text-sm font-semibold text-red-700">{validation}</p>:null}<div className="mt-4 grid grid-cols-2 gap-2"><button onClick={()=>void send()} disabled={status==="sending"} className="rounded-xl bg-[#ff385c] px-4 py-3 text-sm font-bold text-white disabled:opacity-60">{status==="sending"?copy.sending:copy.send}</button><button onClick={openWhatsApp} className="rounded-xl border border-emerald-600 px-4 py-3 text-sm font-bold text-emerald-700">{copy.whatsapp}</button></div>{status==="error"?<p className="mt-3 text-sm font-semibold text-red-700">{copy.error}</p>:null}</div>:null}
      {status==="sent"?<div className="mt-5 rounded-2xl bg-emerald-50 p-4 text-sm font-bold leading-6 text-emerald-800">{copy.sent}<button onClick={reset} className="mt-4 block w-full rounded-xl border border-emerald-700 px-4 py-3">{copy.newSearch}</button></div>:null}
    </section>
  </div>;
}
