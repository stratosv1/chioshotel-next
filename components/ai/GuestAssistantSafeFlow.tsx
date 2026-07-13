"use client";

import { FormEvent, useEffect, useRef } from "react";
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

function requestUrl(input: RequestInfo | URL) {
  if (typeof input === "string") return input;
  if (input instanceof URL) return input.toString();
  return input.url;
}

function requestBody(init?: RequestInit) {
  if (typeof init?.body !== "string") return null;
  try {
    return JSON.parse(init.body) as Record<string, unknown>;
  } catch {
    return null;
  }
}

export function GuestAssistantSafeFlow() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const previousFetch = window.fetch.bind(window);

    window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = requestUrl(input);
      const roomRequest = url.includes("/api/ai-assistant/request") && !url.includes("/request-email");
      const payload = roomRequest ? requestBody(init) : null;
      const response = await previousFetch(input, init);

      if (!roomRequest || !payload || !response.ok) return response;

      const result = await response.clone().json().catch(() => null);
      if (!result?.ok) return response;

      const emailResponse = await previousFetch("/api/ai-assistant/request-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, requestId: result.requestId || "" }),
        cache: "no-store",
      });

      if (!emailResponse.ok) {
        const emailError = await emailResponse.text().catch(() => "");
        console.error("AI room-interest email failed", emailResponse.status, emailError.slice(0, 500));
      }

      return response;
    };

    return () => {
      window.fetch = previousFetch;
    };
  }, []);

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
