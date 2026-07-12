"use client";

import { FormEvent, useEffect, useRef } from "react";
import { GuestAssistantSales } from "@/components/ai/GuestAssistantSales";

const HOTEL_WHATSAPP = "306944474226";

function normalize(value: string) {
  return value
    .toLocaleLowerCase("el-GR")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function selectedRoomNumber(message: string) {
  const normalized = normalize(message);
  const expressesInterest = /(ενδιαφερ|θελω|επιλεγω|κρατησ|μου αρεσει|προχωρ|choose|interested|book)/i.test(normalized);
  if (!expressesInterest) return null;

  const explicit = normalized.match(/(?:room|δωματιο|apartment|διαμερισμα|το)\s*(\d{1,2})/i);
  if (explicit) return explicit[1];

  const standalone = normalized.match(/\b(\d{1,2})\b/);
  return standalone?.[1] || null;
}

function buildWhatsAppMessage(root: HTMLDivElement) {
  const dialog = Array.from(root.querySelectorAll<HTMLElement>("[role='dialog']")).at(-1);
  const dialogText = (dialog?.innerText || "").replace(/\n{3,}/g, "\n\n").trim();
  const pageText = (root.innerText || "").replace(/\n{3,}/g, "\n\n").trim();
  const source = dialogText || pageText;

  return [
    "Νέο αίτημα από το Guest Assistant του Voulamandis House",
    "",
    source.slice(0, 3200),
    "",
    "Παρακαλώ επικοινωνήστε μαζί μου για επιβεβαίωση.",
  ].join("\n");
}

export function GuestAssistantLeadFlow() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const addWhatsAppButton = () => {
      const successHeading = Array.from(root.querySelectorAll<HTMLElement>("p")).find((item) =>
        normalize(item.textContent || "").includes("το αιτημα καταχωρηθηκε"),
      );
      if (!successHeading) return;

      const successCard = successHeading.closest("div");
      if (!successCard || successCard.querySelector("[data-whatsapp-lead-button]")) return;

      const button = document.createElement("button");
      button.type = "button";
      button.dataset.whatsappLeadButton = "true";
      button.className = "mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#25D366] px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:brightness-95 focus:outline-none focus:ring-4 focus:ring-emerald-100";
      button.innerHTML = '<span aria-hidden="true">💬</span><span>Στείλε τα στοιχεία και στο WhatsApp</span>';
      button.addEventListener("click", () => {
        const message = buildWhatsAppMessage(root);
        window.open(`https://wa.me/${HOTEL_WHATSAPP}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
      });
      successCard.appendChild(button);
    };

    const observer = new MutationObserver(addWhatsAppButton);
    observer.observe(root, { childList: true, subtree: true });
    addWhatsAppButton();

    return () => observer.disconnect();
  }, []);

  function handleSubmitCapture(event: FormEvent<HTMLDivElement>) {
    const form = event.target as HTMLFormElement;
    if (!(form instanceof HTMLFormElement)) return;

    const input = form.querySelector("input");
    const message = input?.value || "";
    const roomNumber = selectedRoomNumber(message);
    if (!roomNumber || !rootRef.current) return;

    const roomButton = Array.from(rootRef.current.querySelectorAll<HTMLButtonElement>("button")).find((button) => {
      const text = normalize(button.textContent || "");
      return text.includes(`room ${roomNumber}`) || text.includes(`apartment ${roomNumber}`) || text.includes(`δωματιο ${roomNumber}`) || text.includes(`διαμερισμα ${roomNumber}`);
    });

    if (!roomButton) return;

    event.preventDefault();
    event.stopPropagation();
    roomButton.click();

    window.setTimeout(() => {
      const interestButton = Array.from(document.querySelectorAll<HTMLButtonElement>("button")).find((button) => {
        const text = normalize(button.textContent || "");
        return text === "ενδιαφερομαι" || text.includes("αιτημα κρατησης");
      });
      interestButton?.click();
    }, 180);
  }

  return (
    <div ref={rootRef} onSubmitCapture={handleSubmitCapture}>
      <GuestAssistantSales />
    </div>
  );
}
