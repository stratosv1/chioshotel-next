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
        const firstDateWasRequested = !requestBody.search.checkin && !requestBody.search.checkout;
        const onlyCheckinWasResolved = Boolean(payload?.search?.checkin && !payload?.search?.checkout);

        if (!firstDateWasRequested || !onlyCheckinWasResolved) return response;

        payload.answer = CHECKOUT_PROMPT[supportedLanguage(requestBody.language)];
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
