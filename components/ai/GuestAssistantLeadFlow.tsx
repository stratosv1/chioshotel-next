"use client";

import { FormEvent, useEffect, useRef } from "react";
import { GuestAssistantMultilingual } from "@/components/ai/GuestAssistantMultilingual";

const HOTEL_WHATSAPP = "306944474226";

function normalize(value: string) {
  return value.toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, " ").trim();
}

function selectedRoomNumber(message: string) {
  const normalized = normalize(message);
  const expressesInterest = /(ενδιαφερ|θελω|επιλεγω|κρατησ|μου αρεσει|προχωρ|choose|interested|book|reserv|interess|interes|ilgilen|sec)/i.test(normalized);
  if (!expressesInterest) return null;
  const explicit = normalized.match(/(?:room|δωματιο|apartment|διαμερισμα|zimmer|chambre|camera|habitacion|oda|το)\s*(10|[1-9])/i);
  if (explicit) return explicit[1];
  return normalized.match(/\b(10|[1-9])\b/)?.[1] || null;
}

function buildWhatsAppMessage(root: HTMLDivElement) {
  const dialog = Array.from(root.querySelectorAll<HTMLElement>("[role='dialog']")).at(-1);
  const source = ((dialog?.innerText || root.innerText) || "").replace(/\n{3,}/g, "\n\n").trim();
  return ["New request from the Voulamandis House AI Concierge", "", source.slice(0, 3200), "", "Please contact me to confirm."].join("\n");
}

export function GuestAssistantLeadFlow() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const successTerms = ["το αιτημα καταχωρηθηκε", "request submitted", "demande enregistree", "anfrage gespeichert", "richiesta registrata", "solicitud registrada", "talep kaydedildi"];
    const addWhatsAppButton = () => {
      const heading = Array.from(root.querySelectorAll<HTMLElement>("p")).find((item) => successTerms.some((term) => normalize(item.textContent || "").includes(term)));
      if (!heading) return;
      const card = heading.closest("div");
      if (!card || card.querySelector("[data-whatsapp-lead-button]")) return;
      const button = document.createElement("button");
      button.type = "button";
      button.dataset.whatsappLeadButton = "true";
      button.className = "mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#25D366] px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:brightness-95 focus:outline-none focus:ring-4 focus:ring-emerald-100";
      button.innerHTML = '<span aria-hidden="true">💬</span><span>WhatsApp</span>';
      button.addEventListener("click", () => window.open(`https://wa.me/${HOTEL_WHATSAPP}?text=${encodeURIComponent(buildWhatsAppMessage(root))}`, "_blank", "noopener,noreferrer"));
      card.appendChild(button);
    };
    const observer = new MutationObserver(addWhatsAppButton);
    observer.observe(root, { childList: true, subtree: true });
    addWhatsAppButton();
    return () => observer.disconnect();
  }, []);

  function handleSubmitCapture(event: FormEvent<HTMLDivElement>) {
    const form = event.target as HTMLFormElement;
    if (!(form instanceof HTMLFormElement)) return;
    const roomNumber = selectedRoomNumber(form.querySelector("input")?.value || "");
    if (!roomNumber || !rootRef.current) return;
    const roomButton = Array.from(rootRef.current.querySelectorAll<HTMLButtonElement>("button")).find((button) => {
      const text = normalize(button.textContent || "");
      return ["room", "apartment", "δωματιο", "διαμερισμα", "zimmer", "chambre", "camera", "habitacion", "oda"].some((word) => text.includes(`${word} ${roomNumber}`));
    });
    if (!roomButton) return;
    event.preventDefault();
    event.stopPropagation();
    roomButton.click();
  }

  return <div ref={rootRef} onSubmitCapture={handleSubmitCapture}><GuestAssistantMultilingual /></div>;
}
