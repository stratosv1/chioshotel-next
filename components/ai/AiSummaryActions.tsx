"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";

const EMAIL = "chioshotel@gmail.com";
const WHATSAPP = "306944474226";

function findSummaryCard() {
  const heading = Array.from(document.querySelectorAll<HTMLElement>("h2")).find((node) =>
    /Αναλυτική σύνοψη|Detailed summary|Detaillierte Übersicht|Récapitulatif détaillé|Riepilogo dettagliato|Resumen detallado|Ayrıntılı özet/i.test(node.textContent || ""),
  );
  if (!heading) return null;
  return heading.closest<HTMLElement>("div.rounded-\[24px\]") || heading.parentElement?.parentElement || null;
}

function cleanSummaryText(card: HTMLElement) {
  return (card.innerText || "")
    .replace(/Νέα αναζήτηση|New search|Neue Suche|Nouvelle recherche|Nuova ricerca|Nueva búsqueda|Yeni arama/gi, "")
    .replace(/Email|WhatsApp/gi, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function AiSummaryActions() {
  const [card, setCard] = useState<HTMLElement | null>(null);
  const [summary, setSummary] = useState("");

  useEffect(() => {
    const locate = () => {
      const next = findSummaryCard();
      setCard((current) => (current === next ? current : next));
      if (next) setSummary(cleanSummaryText(next));
    };

    locate();
    const timer = window.setInterval(locate, 400);
    return () => window.clearInterval(timer);
  }, []);

  const links = useMemo(() => {
    const subject = "Αίτημα διαμονής από AI Room Finder";
    const body = `Νέο αίτημα διαμονής από το AI Room Finder\n\n${summary}`;
    return {
      email: `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
      whatsapp: `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(body)}`,
    };
  }, [summary]);

  if (!card || !summary) return null;

  return createPortal(
    <div data-ai-summary-actions className="mt-4 grid grid-cols-2 gap-3 border-t border-stone-200 pt-4">
      <a
        href={links.email}
        className="flex min-h-12 items-center justify-center rounded-2xl border border-[#43551b] bg-white px-4 py-3 text-center text-sm font-bold text-[#28350f] shadow-sm active:scale-[.99]"
      >
        Email
      </a>
      <a
        href={links.whatsapp}
        target="_blank"
        rel="noreferrer"
        className="flex min-h-12 items-center justify-center rounded-2xl bg-[#1f9d55] px-4 py-3 text-center text-sm font-bold text-white shadow-sm active:scale-[.99]"
      >
        WhatsApp
      </a>
    </div>,
    card,
  );
}
