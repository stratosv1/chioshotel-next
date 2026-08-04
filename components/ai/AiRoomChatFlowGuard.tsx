"use client";

import { useEffect } from "react";

type Language = "el" | "en" | "de" | "fr" | "it" | "es" | "tr";

const CHECKOUT_PROMPT: Record<Language, string> = {
  el: "Τέλεια. Ποια ημέρα θα γίνει το check-out;",
  en: "Great. What date would you like to check out?",
  de: "Perfekt. Wann möchten Sie abreisen?",
  fr: "Parfait. Quelle est votre date de départ ?",
  it: "Perfetto. Qual è la data di check-out?",
  es: "Perfecto. ¿Cuál es la fecha de salida?",
  tr: "Harika. Çıkış tarihiniz nedir?",
};

function supportedLanguage(value: unknown): Language {
  const language = String(value || "en").toLowerCase().split("-")[0] as Language;
  return language in CHECKOUT_PROMPT ? language : "en";
}

function parseNumericDate(value: unknown, referenceDate: unknown): string | null {
  const match = String(value || "").trim().match(/^(\d{1,2})[\/.\-](\d{1,2})(?:[\/.\-](\d{2,4}))?$/);
  if (!match) return null;

  const day = Number(match[1]);
  const month = Number(match[2]);
  const reference = String(referenceDate || "").match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!reference || day < 1 || day > 31 || month < 1 || month > 12) return null;

  let year = match[3] ? Number(match[3]) : Number(reference[1]);
  if (year < 100) year += 2000;

  // For a genuine year crossing such as 31/12 → 01/01, infer the next year.
  if (!match[3]) {
    const referenceMonth = Number(reference[2]);
    if (referenceMonth - month >= 6) year += 1;
  }

  const candidate = new Date(Date.UTC(year, month - 1, day));
  if (
    candidate.getUTCFullYear() !== year ||
    candidate.getUTCMonth() !== month - 1 ||
    candidate.getUTCDate() !== day
  ) return null;

  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export function AiRoomChatFlowGuard() {
  useEffect(() => {
    const originalFetch = window.fetch.bind(window);

    const guardedFetch: typeof window.fetch = async (...args) => {
      const response = await originalFetch(...args);

      try {
        const requestUrl =
          typeof args[0] === "string"
            ? args[0]
            : args[0] instanceof Request
              ? args[0].url
              : "";
        const requestBody = typeof args[1]?.body === "string" ? JSON.parse(args[1].body) : null;
        const isDateInterpretation =
          requestUrl.includes("/api/ai-assistant/smart") &&
          requestBody?.search &&
          !requestBody.search.guests;

        if (!isDateInterpretation || !response.ok) return response;

        const payload = await response.clone().json().catch(() => null);
        if (!payload) return response;

        const firstDateWasRequested = !requestBody.search.checkin && !requestBody.search.checkout;
        const onlyCheckinWasResolved = Boolean(payload?.search?.checkin && !payload?.search?.checkout);

        if (firstDateWasRequested && onlyCheckinWasResolved) {
          payload.answer = CHECKOUT_PROMPT[supportedLanguage(requestBody.language)];
        }

        const checkoutWasRequested = Boolean(requestBody.search.checkin && !requestBody.search.checkout);
        const latestMessage = Array.isArray(requestBody.messages)
          ? requestBody.messages[requestBody.messages.length - 1]?.content
          : "";
        const parsedCheckout = checkoutWasRequested
          ? parseNumericDate(latestMessage, requestBody.search.checkin)
          : null;

        if (parsedCheckout) {
          payload.search = {
            ...(payload.search || {}),
            checkin: requestBody.search.checkin,
            checkout: parsedCheckout,
          };
        }

        if (!(firstDateWasRequested && onlyCheckinWasResolved) && !parsedCheckout) return response;

        const headers = new Headers(response.headers);
        headers.set("content-type", "application/json; charset=utf-8");

        return new Response(JSON.stringify(payload), {
          status: response.status,
          statusText: response.statusText,
          headers,
        });
      } catch {
        return response;
      }
    };

    window.fetch = guardedFetch;
    return () => {
      if (window.fetch === guardedFetch) window.fetch = originalFetch;
    };
  }, []);

  return null;
}
