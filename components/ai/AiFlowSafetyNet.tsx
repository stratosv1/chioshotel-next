"use client";

import { useEffect, useState } from "react";

type Locale = "el" | "en" | "de" | "fr" | "it" | "es" | "tr";

const WHATSAPP_NUMBER = "306944474226";
const COPY:Record<Locale,{title:string;body:string;restart:string;whatsapp:string;message:string}>={
  el:{title:"Χρειάζεστε βοήθεια;",body:"Η αναζήτηση καθυστερεί ή δεν ολοκληρώθηκε. Ξεκινήστε ξανά ή επικοινωνήστε άμεσα μαζί μας.",restart:"Νέα αναζήτηση",whatsapp:"WhatsApp",message:"Γεια σας! Χρειάζομαι βοήθεια με την αναζήτηση διαθεσιμότητας στο AI Room Finder."},
  en:{title:"Need help?",body:"The search is taking longer than expected or could not be completed. Start again or contact us directly.",restart:"New search",whatsapp:"WhatsApp",message:"Hello! I need help with an availability search in the AI Room Finder."},
  de:{title:"Benötigen Sie Hilfe?",body:"Die Suche dauert länger als erwartet oder konnte nicht abgeschlossen werden. Starten Sie neu oder kontaktieren Sie uns direkt.",restart:"Neue Suche",whatsapp:"WhatsApp",message:"Hallo! Ich benötige Hilfe bei einer Verfügbarkeitssuche im AI Room Finder."},
  fr:{title:"Besoin d’aide ?",body:"La recherche prend plus de temps que prévu ou n’a pas pu aboutir. Recommencez ou contactez-nous directement.",restart:"Nouvelle recherche",whatsapp:"WhatsApp",message:"Bonjour ! J’ai besoin d’aide pour une recherche de disponibilités dans l’AI Room Finder."},
  it:{title:"Hai bisogno di aiuto?",body:"La ricerca sta richiedendo più tempo del previsto o non è stata completata. Ricomincia o contattaci direttamente.",restart:"Nuova ricerca",whatsapp:"WhatsApp",message:"Salve! Ho bisogno di aiuto con una ricerca di disponibilità nell’AI Room Finder."},
  es:{title:"¿Necesitas ayuda?",body:"La búsqueda está tardando más de lo previsto o no pudo completarse. Empieza de nuevo o contáctanos directamente.",restart:"Nueva búsqueda",whatsapp:"WhatsApp",message:"Hola. Necesito ayuda con una búsqueda de disponibilidad en el AI Room Finder."},
  tr:{title:"Yardıma mı ihtiyacınız var?",body:"Arama beklenenden uzun sürüyor veya tamamlanamadı. Yeniden başlayabilir ya da bizimle doğrudan iletişime geçebilirsiniz.",restart:"Yeni arama",whatsapp:"WhatsApp",message:"Merhaba! AI Room Finder müsaitlik aramasıyla ilgili yardıma ihtiyacım var."}
};

function getLocale():Locale{
  const supported:Locale[]=["el","en","de","fr","it","es","tr"];
  const query=new URLSearchParams(window.location.search).get("lang")?.toLowerCase().split("-")[0];
  const documentLocale=document.documentElement.lang?.toLowerCase().split("-")[0];
  return supported.includes(query as Locale)?query as Locale:supported.includes(documentLocale as Locale)?documentLocale as Locale:"en";
}

export function AiFlowSafetyNet(){
  const [visible,setVisible]=useState(false);
  const [locale,setLocale]=useState<Locale>("en");

  useEffect(()=>{
    setLocale(getLocale());
    let timer:number|undefined;

    const clearTimer=()=>{
      if(timer!==undefined){
        window.clearTimeout(timer);
        timer=undefined;
      }
    };

    const inspect=()=>{
      const text=document.body.innerText||"";
      const searching=/Ελέγχω τώρα τη live διαθεσιμότητα|Checking live availability|Live-Verfügbarkeit und Direktpreise|Je vérifie les disponibilités|Controllo disponibilità live|Compruebo disponibilidad en vivo|Canlı müsaitlik ve en iyi direkt fiyatlar/i.test(text);
      const failed=/Live availability error/i.test(text);
      const hasRoomResults=Boolean(document.querySelector("article"));
      const hasOpenRoomDialog=Boolean(document.querySelector('[role="dialog"]'));

      // The searching sentence remains in the conversation history after results
      // have loaded. Room cards or an open detail dialog mean the search finished,
      // so the timeout must never interrupt the guest while reading a room.
      if(hasRoomResults||hasOpenRoomDialog){
        clearTimer();
        setVisible(false);
        return;
      }

      if(failed){
        clearTimer();
        setVisible(true);
        return;
      }

      if(searching&&timer===undefined){
        timer=window.setTimeout(()=>{
          timer=undefined;
          const resultsNow=Boolean(document.querySelector("article"));
          const dialogNow=Boolean(document.querySelector('[role="dialog"]'));
          if(!resultsNow&&!dialogNow)setVisible(true);
        },18000);
      }

      if(!searching){
        clearTimer();
        setVisible(false);
      }
    };

    inspect();
    const observer=new MutationObserver(inspect);
    observer.observe(document.body,{childList:true,subtree:true,characterData:true});
    return()=>{observer.disconnect();clearTimer()};
  },[]);

  if(!visible)return null;
  const copy=COPY[locale];
  const restart=()=>window.location.assign(`/ai-assistant/?lang=${locale}`);
  const whatsapp=()=>window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(copy.message)}`,"_blank","noopener,noreferrer");

  return <aside className="fixed inset-x-3 bottom-4 z-[1200] mx-auto max-w-lg rounded-[22px] border border-amber-200 bg-white p-4 shadow-2xl" role="alert">
    <button type="button" onClick={()=>setVisible(false)} aria-label="Close" className="absolute right-3 top-2 text-xl text-stone-500">×</button>
    <h2 className="pr-7 text-base font-black text-stone-900">{copy.title}</h2>
    <p className="mt-1 text-sm leading-5 text-stone-600">{copy.body}</p>
    <div className="mt-3 grid grid-cols-2 gap-2">
      <button type="button" onClick={restart} className="rounded-xl border border-stone-300 px-3 py-3 text-sm font-bold">{copy.restart}</button>
      <button type="button" onClick={whatsapp} className="rounded-xl bg-[#1f9d55] px-3 py-3 text-sm font-bold text-white">{copy.whatsapp}</button>
    </div>
  </aside>;
}
