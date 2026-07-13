"use client";

import { FormEvent, useRef } from "react";
import { GuestAssistantLeadFlow } from "@/components/ai/GuestAssistantLeadFlow";

function normalize(value: string) {
  return value
    .toLocaleLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function requestedRoomNumber(value: string) {
  const text = normalize(value);
  const explicit = text.match(
    /(?:room|δωματιο|διαμερισμα|apartment|zimmer|chambre|camera|habitacion|oda|το)\s*(10|[1-9])\b/i,
  );
  if (explicit) return explicit[1];
  return text.match(/^\s*(10|[1-9])\s*$/)?.[1] || null;
}

export function GuestAssistantSafeFlow() {
  const rootRef = useRef<HTMLDivElement>(null);

  function handleSubmitCapture(event: FormEvent<HTMLDivElement>) {
    const form = event.target as HTMLFormElement;
    if (!(form instanceof HTMLFormElement)) return;
    if (form.querySelector("textarea")) return;

    const input = form.querySelector<HTMLInputElement>("input");
    const roomNumber = requestedRoomNumber(input?.value || "");
    if (!roomNumber || !rootRef.current) return;

    const roomButton = Array.from(rootRef.current.querySelectorAll<HTMLButtonElement>("button")).find((button) => {
      const text = normalize(button.textContent || "");
      return [
        `room ${roomNumber}`,
        `δωματιο ${roomNumber}`,
        `διαμερισμα ${roomNumber}`,
        `apartment ${roomNumber}`,
        `zimmer ${roomNumber}`,
        `chambre ${roomNumber}`,
        `camera ${roomNumber}`,
        `habitacion ${roomNumber}`,
        `oda ${roomNumber}`,
      ].some((label) => text.includes(label));
    });

    if (!roomButton) return;

    event.preventDefault();
    event.stopPropagation();
    if (input) input.value = "";
    roomButton.click();
  }

  return (
    <div ref={rootRef} onSubmitCapture={handleSubmitCapture}>
      <GuestAssistantLeadFlow />
    </div>
  );
}
