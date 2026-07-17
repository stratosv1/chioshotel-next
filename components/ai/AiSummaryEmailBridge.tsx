"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";

type Status = "idle" | "sending" | "sent" | "error";

const WHATSAPP_NUMBER = "306944474226";
const SUMMARY_TITLES = [
  "Αναλυτική σύνοψη",
  "Detailed summary",
  "Detaillierte Übersicht",
  "Récapitulatif détaillé",
  "Riepilogo dettagliato",
  "Resumen detallado",
  "Ayrıntılı özet",
];

function findSummaryCard() {
  const heading = Array.from(document.querySelectorAll<HTMLElement>("h2")).find((node) =>
    SUMMARY_TITLES.includes((node.textContent || "").trim()),
  );
  if (!heading) return null;
  return heading.closest<HTMLElement>("div.rounded-\\[24px\\]") || heading.parentElement?.parentElement || null;
}

function cleanSummary(card: HTMLElement) {
  return (card.innerText || "")
    .replace(/Νέα αναζήτηση|New search|Neue Suche|Nouvelle recherche|Nuova ricerca|Nueva búsqueda|Yeni arama/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function AiSummaryEmailBridge() {
  const [status, setStatus] = useState<Status>("idle");
  const [host, setHost] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const locate = () => {
      const card = findSummaryCard();
      setHost((current) => (current === card ? current : card));
    };

    locate();
    const timer = window.setInterval(locate, 300);
    return () => window.clearInterval(timer);
  }, []);

  const summaryText = useMemo(() => (host ? cleanSummary(host) : ""), [host, status]);

  async function sendEmail() {
    if (!host || status === "sending") return;
    setStatus("sending");

    try {
      const response = await fetch("/api/ai-assistant/summary-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: "Αίτημα διαμονής από AI Room Finder",
          message: cleanSummary(host),
        }),
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
    const message = `Γεια σας! Ενδιαφέρομαι για την παρακάτω διαμονή:\n\n${cleanSummary(host)}`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  }

  const actions = host
    ? createPortal(
        <div className="mt-5 border-t border-stone-200 pt-4" data-ai-summary-actions="true">
          <p className="mb-3 text-sm font-semibold text-stone-700">Στείλτε το αίτημα στη reception</p>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => void sendEmail()}
              disabled={status === "sending"}
              className="rounded-2xl border border-[#435f12] bg-white px-4 py-3.5 text-sm font-bold text-stone-900 disabled:opacity-60"
            >
              {status === "sending" ? "Αποστολή…" : "Email"}
            </button>
            <button
              type="button"
              onClick={openWhatsApp}
              className="rounded-2xl bg-[#1f9d55] px-4 py-3.5 text-sm font-bold text-white shadow-sm"
            >
              WhatsApp
            </button>
          </div>
        </div>,
        host,
      )
    : null;

  const feedback =
    status === "idle"
      ? null
      : status === "sending"
        ? "Το μήνυμα αποστέλλεται…"
        : status === "sent"
          ? "Το μήνυμα εστάλη. Σύντομα η reception θα επικοινωνήσει μαζί σας."
          : "Δεν ήταν δυνατή η αποστολή. Δοκιμάστε ξανά σε λίγο.";

  return (
    <>
      {actions}
      {feedback ? (
        <div
          role="status"
          aria-live="polite"
          className={`fixed inset-x-4 bottom-5 z-[1000] mx-auto max-w-md rounded-2xl border px-4 py-4 text-center text-sm font-semibold shadow-2xl ${
            status === "sent"
              ? "border-emerald-200 bg-emerald-50 text-emerald-900"
              : status === "error"
                ? "border-red-200 bg-red-50 text-red-800"
                : "border-stone-200 bg-white text-stone-800"
          }`}
        >
          {feedback}
        </div>
      ) : null}
    </>
  );
}
