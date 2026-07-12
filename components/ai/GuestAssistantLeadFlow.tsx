"use client";

import { FormEvent, useRef } from "react";
import { GuestAssistantSales } from "@/components/ai/GuestAssistantSales";

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

export function GuestAssistantLeadFlow() {
  const rootRef = useRef<HTMLDivElement>(null);

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
