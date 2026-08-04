"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type Language = "el" | "en" | "de" | "fr" | "it" | "es" | "tr";
type Problem = "network" | "empty-selection";

type Copy = {
  header: string;
  original: string;
  liveError: string;
  networkTitle: string;
  networkBody: string;
  emptyTitle: string;
  emptyBody: string;
  newSearch: string;
  whatsapp: string;
  whatsappMessage: string;
};

const WHATSAPP_NUMBER = "306944474226";

const COPY: Record<Language, Copy> = {
  el: {
    header: "AI Room Finder · Ζωντανή διαθεσιμότητα",
    original: "Αρχική τιμή",
    liveError: "Δεν ήταν δυνατός ο έλεγχος της live διαθεσιμότητας.",
    networkTitle: "Δεν ολοκληρώθηκε ο έλεγχος διαθεσιμότητας",
    networkBody: "Παρουσιάστηκε προσωρινό πρόβλημα κατά τον έλεγχο. Ξεκινήστε νέα αναζήτηση ή ζητήστε άμεσο έλεγχο από τη reception.",
    emptyTitle: "Δεν υπάρχει δεύτερο διαφορετικό διαθέσιμο δωμάτιο",
    emptyBody: "Το διαθέσιμο δωμάτιο έχει ήδη επιλεγεί για την προηγούμενη ομάδα. Για περισσότερα δωμάτια χρειάζεται νέα αναζήτηση ή χειροκίνητος έλεγχος από τη reception.",
    newSearch: "Νέα αναζήτηση",
    whatsapp: "Έλεγχος μέσω WhatsApp",
    whatsappMessage: "Γεια σας! Χρειάζομαι βοήθεια από το AI Room Finder για έλεγχο διαθεσιμότητας πολλών δωματίων.",
  },
  en: {
    header: "AI Room Finder · Live availability",
    original: "Original price",
    liveError: "Live availability could not be checked.",
    networkTitle: "Availability check could not be completed",
    networkBody: "A temporary problem occurred during the check. Start a new search or ask reception to check directly.",
    emptyTitle: "No second distinct room is available",
    emptyBody: "The available room has already been selected for the previous group. Start a new search or ask reception to check multiple rooms manually.",
    newSearch: "New search",
    whatsapp: "Check via WhatsApp",
    whatsappMessage: "Hello! I need help with an AI Room Finder availability check for multiple rooms.",
  },
  de: {
    header: "AI Room Finder · Live-Verfügbarkeit",
    original: "Ursprünglicher Preis",
    liveError: "Die Live-Verfügbarkeit konnte nicht geprüft werden.",
    networkTitle: "Die Verfügbarkeitsprüfung konnte nicht abgeschlossen werden",
    networkBody: "Bei der Prüfung ist vorübergehend ein Problem aufgetreten. Starten Sie eine neue Suche oder bitten Sie die Rezeption um eine direkte Prüfung.",
    emptyTitle: "Kein zweites separates Zimmer verfügbar",
    emptyBody: "Das verfügbare Zimmer wurde bereits für die vorherige Gruppe ausgewählt. Starten Sie eine neue Suche oder bitten Sie die Rezeption um eine manuelle Prüfung.",
    newSearch: "Neue Suche",
    whatsapp: "Per WhatsApp prüfen",
    whatsappMessage: "Hallo! Ich benötige Hilfe bei einer Verfügbarkeitsprüfung für mehrere Zimmer im AI Room Finder.",
  },
  fr: {
    header: "AI Room Finder · Disponibilités en direct",
    original: "Prix initial",
    liveError: "La disponibilité en direct n’a pas pu être vérifiée.",
    networkTitle: "La vérification des disponibilités n’a pas abouti",
    networkBody: "Un problème temporaire est survenu. Lancez une nouvelle recherche ou demandez une vérification directe à la réception.",
    emptyTitle: "Aucune deuxième chambre distincte disponible",
    emptyBody: "La chambre disponible a déjà été choisie pour le groupe précédent. Lancez une nouvelle recherche ou demandez une vérification manuelle à la réception.",
    newSearch: "Nouvelle recherche",
    whatsapp: "Vérifier par WhatsApp",
    whatsappMessage: "Bonjour ! J’ai besoin d’aide pour vérifier la disponibilité de plusieurs chambres avec AI Room Finder.",
  },
  it: {
    header: "AI Room Finder · Disponibilità live",
    original: "Prezzo iniziale",
    liveError: "Non è stato possibile verificare la disponibilità live.",
    networkTitle: "Controllo disponibilità non completato",
    networkBody: "Si è verificato un problema temporaneo. Avvia una nuova ricerca oppure chiedi alla reception un controllo diretto.",
    emptyTitle: "Nessuna seconda camera distinta disponibile",
    emptyBody: "La camera disponibile è già stata scelta per il gruppo precedente. Avvia una nuova ricerca oppure chiedi un controllo manuale alla reception.",
    newSearch: "Nuova ricerca",
    whatsapp: "Controlla con WhatsApp",
    whatsappMessage: "Salve! Ho bisogno di aiuto per verificare la disponibilità di più camere con AI Room Finder.",
  },
  es: {
    header: "AI Room Finder · Disponibilidad en vivo",
    original: "Precio inicial",
    liveError: "No se pudo comprobar la disponibilidad en vivo.",
    networkTitle: "No se pudo completar la comprobación",
    networkBody: "Se produjo un problema temporal. Inicia una nueva búsqueda o pide a recepción una comprobación directa.",
    emptyTitle: "No hay una segunda habitación distinta disponible",
    emptyBody: "La habitación disponible ya se eligió para el grupo anterior. Inicia una nueva búsqueda o pide a recepción una comprobación manual.",
    newSearch: "Nueva búsqueda",
    whatsapp: "Comprobar por WhatsApp",
    whatsappMessage: "Hola. Necesito ayuda para comprobar la disponibilidad de varias habitaciones con AI Room Finder.",
  },
  tr: {
    header: "AI Room Finder · Canlı müsaitlik",
    original: "İlk fiyat",
    liveError: "Canlı müsaitlik kontrol edilemedi.",
    networkTitle: "Müsaitlik kontrolü tamamlanamadı",
    networkBody: "Kontrol sırasında geçici bir sorun oluştu. Yeni arama başlatın veya resepsiyondan doğrudan kontrol isteyin.",
    emptyTitle: "İkinci farklı bir oda müsait değil",
    emptyBody: "Müsait oda önceki grup için zaten seçildi. Yeni arama başlatın veya resepsiyondan manuel kontrol isteyin.",
    newSearch: "Yeni arama",
    whatsapp: "WhatsApp ile kontrol",
    whatsappMessage: "Merhaba! AI Room Finder üzerinden birden fazla oda için müsaitlik kontrolü konusunda yardıma ihtiyacım var.",
  },
};

const CHOOSE_ROOM_PATTERNS = [
  /Επιλέξτε δωμάτιο για την ομάδα/i,
  /Choose a room for group/i,
  /Wählen Sie ein Zimmer für Gruppe/i,
  /Choisissez une chambre pour le groupe/i,
  /Scegli una camera per il gruppo/i,
  /Elige una habitación para el grupo/i,
  /grup için oda seçin/i,
];

const NO_AVAILABILITY_PATTERNS = [
  /Δεν βρέθηκε διαθέσιμο δωμάτιο/i,
  /No room available/i,
  /Kein Zimmer verfügbar/i,
  /Aucune chambre disponible/i,
  /Nessuna camera disponibile/i,
  /No hay habitaciones disponibles/i,
  /Uygun oda bulunamadı/i,
];

function currentLanguage(): Language {
  const supported: Language[] = ["el", "en", "de", "fr", "it", "es", "tr"];
  const query = new URLSearchParams(window.location.search)
    .get("lang")
    ?.toLowerCase()
    .split("-")[0];
  const documentLanguage = document.documentElement.lang
    ?.toLowerCase()
    .split("-")[0];

  if (supported.includes(query as Language)) return query as Language;
  if (supported.includes(documentLanguage as Language)) return documentLanguage as Language;
  return "en";
}

function replaceDirectText(node: HTMLElement, from: string, to: string) {
  for (const child of Array.from(node.childNodes)) {
    if (child.nodeType !== Node.TEXT_NODE || !child.textContent?.includes(from)) continue;
    child.textContent = child.textContent.replace(from, to);
  }
}

function translateStaticCopy(language: Language) {
  const copy = COPY[language];

  for (const node of Array.from(document.querySelectorAll<HTMLElement>("header div"))) {
    replaceDirectText(node, "AI Room Finder · Live availability", copy.header);
  }

  for (const node of Array.from(document.querySelectorAll<HTMLElement>("main span, main p"))) {
    const text = node.textContent?.trim() || "";
    if (text === "Original") node.textContent = copy.original;
    if (text === "Live availability error") node.textContent = copy.liveError;
  }
}

function hasVisibleNoAvailabilityPanel() {
  return Array.from(document.querySelectorAll<HTMLElement>("body *")).some((node) => {
    if (node.offsetParent === null || node.children.length > 0) return false;
    const text = node.textContent?.trim() || "";
    return NO_AVAILABILITY_PATTERNS.some((pattern) => pattern.test(text));
  });
}

function hasVisibleRoomCard(main: HTMLElement) {
  return Array.from(main.querySelectorAll<HTMLElement>("article")).some(
    (article) => article.offsetParent !== null && article.style.display !== "none",
  );
}

function hasChooseRoomPrompt(main: HTMLElement) {
  return Array.from(main.querySelectorAll<HTMLElement>("p, div")).some((node) => {
    if (node.offsetParent === null || node.children.length > 0) return false;
    const text = node.textContent?.trim() || "";
    return CHOOSE_ROOM_PATTERNS.some((pattern) => pattern.test(text));
  });
}

export function AiRoomFinderReliability() {
  const [language, setLanguage] = useState<Language>("en");
  const [problem, setProblem] = useState<Problem | null>(null);
  const [mounted, setMounted] = useState(false);
  const problemRef = useRef<Problem | null>(null);
  const deadEndTimer = useRef<number | null>(null);

  const updateProblem = (next: Problem | null) => {
    problemRef.current = next;
    setProblem(next);
  };

  useEffect(() => {
    const detectedLanguage = currentLanguage();
    setLanguage(detectedLanguage);
    setMounted(true);

    const originalFetch = window.fetch.bind(window);
    window.fetch = async (...args: Parameters<typeof fetch>) => {
      const response = await originalFetch(...args);

      try {
        const url =
          typeof args[0] === "string"
            ? args[0]
            : args[0] instanceof Request
              ? args[0].url
              : "";
        const body = typeof args[1]?.body === "string" ? JSON.parse(args[1].body) : null;
        const search = body?.search;
        const completedSearch = Boolean(
          search?.checkin && search?.checkout && Number(search?.guests) > 0,
        );

        if (url.includes("/api/ai-assistant/smart") && completedSearch) {
          if (!response.ok) {
            updateProblem("network");
          } else {
            updateProblem(null);
          }
        }
      } catch {
        // Keep the original fetch response untouched.
      }

      return response;
    };

    const scan = () => {
      translateStaticCopy(detectedLanguage);

      const main = document.querySelector<HTMLElement>("main");
      if (!main) return;

      if (hasVisibleNoAvailabilityPanel()) {
        if (problemRef.current === "empty-selection") updateProblem(null);
        if (deadEndTimer.current) window.clearTimeout(deadEndTimer.current);
        deadEndTimer.current = null;
        return;
      }

      const choosePrompt = hasChooseRoomPrompt(main);
      const roomCard = hasVisibleRoomCard(main);
      const dialogOpen = Array.from(
        document.querySelectorAll<HTMLElement>('[role="dialog"][aria-modal="true"]'),
      ).some((dialog) => dialog.offsetParent !== null);

      if (choosePrompt && !roomCard && !dialogOpen && problemRef.current !== "network") {
        if (!deadEndTimer.current) {
          deadEndTimer.current = window.setTimeout(() => {
            const latestMain = document.querySelector<HTMLElement>("main");
            if (
              latestMain &&
              hasChooseRoomPrompt(latestMain) &&
              !hasVisibleRoomCard(latestMain) &&
              !hasVisibleNoAvailabilityPanel()
            ) {
              updateProblem("empty-selection");
            }
            deadEndTimer.current = null;
          }, 900);
        }
      } else {
        if (deadEndTimer.current) window.clearTimeout(deadEndTimer.current);
        deadEndTimer.current = null;
        if (problemRef.current === "empty-selection" && roomCard) updateProblem(null);
      }
    };

    scan();
    const observer = new MutationObserver(scan);
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
    window.addEventListener("resize", scan);

    return () => {
      window.fetch = originalFetch;
      observer.disconnect();
      window.removeEventListener("resize", scan);
      if (deadEndTimer.current) window.clearTimeout(deadEndTimer.current);
    };
  }, []);

  if (!mounted || !problem) return null;

  const copy = COPY[language];
  const title = problem === "network" ? copy.networkTitle : copy.emptyTitle;
  const body = problem === "network" ? copy.networkBody : copy.emptyBody;
  const startNewSearch = () => window.location.assign(`/ai-assistant/?lang=${language}`);
  const openWhatsApp = () => {
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(copy.whatsappMessage)}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  return createPortal(
    <section
      data-ai-reliability-alert
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="ai-reliability-title"
      className="fixed inset-x-0 bottom-0 z-[70] p-3 sm:p-5"
    >
      <div className="mx-auto max-w-lg rounded-[24px] border border-stone-200 bg-white p-5 shadow-[0_18px_60px_rgba(0,0,0,.22)]">
        <h2 id="ai-reliability-title" className="text-lg font-black text-stone-900">
          {title}
        </h2>
        <p className="mt-2 text-sm leading-6 text-stone-600">{body}</p>
        <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
          <button
            type="button"
            onClick={startNewSearch}
            className="min-h-12 rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm font-bold text-stone-800"
          >
            {copy.newSearch}
          </button>
          <button
            type="button"
            onClick={openWhatsApp}
            className="min-h-12 rounded-2xl bg-[#1f9d55] px-4 py-3 text-sm font-bold text-white"
          >
            {copy.whatsapp}
          </button>
        </div>
      </div>
    </section>,
    document.body,
  );
}
