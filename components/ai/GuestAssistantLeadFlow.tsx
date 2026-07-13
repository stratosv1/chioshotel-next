"use client";

import { FormEvent, useEffect, useRef } from "react";
import { GuestAssistantMultilingual } from "@/components/ai/GuestAssistantMultilingual";
import { trackAiConciergeEvent } from "@/lib/analytics/ai-concierge";

function normalize(value: string) {
  return value
    .toLocaleLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function selectedRoomNumber(message: string) {
  const normalized = normalize(message);
  const expressesInterest = /(ενδιαφερ|θελω|επιλεγω|κρατησ|μου αρεσει|προχωρ|choose|interested|book|reserv|interess|interes|ilgilen|sec)/i.test(normalized);
  if (!expressesInterest) return null;

  const explicit = normalized.match(
    /(?:room|δωματιο|apartment|διαμερισμα|zimmer|chambre|camera|habitacion|oda|το)\s*(10|[1-9])/i,
  );
  if (explicit) return explicit[1];
  return normalized.match(/\b(10|[1-9])\b/)?.[1] || null;
}

function roomNumberFromText(value: string) {
  return normalize(value).match(
    /(?:room|δωματιο|apartment|διαμερισμα|zimmer|chambre|camera|habitacion|oda)\s*(10|[1-9])/i,
  )?.[1];
}

export function GuestAssistantLeadFlow() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    trackAiConciergeEvent("ai_concierge_open", { page: window.location.pathname });

    const originalFetch = window.fetch.bind(window);
    window.fetch = async (...args) => {
      const requestUrl =
        typeof args[0] === "string"
          ? args[0]
          : args[0] instanceof URL
            ? args[0].toString()
            : args[0].url;

      const response = await originalFetch(...args);

      if (requestUrl.includes("/api/ai-assistant/smart")) {
        void response
          .clone()
          .json()
          .then((payload) => {
            const offers = Array.isArray(payload?.offers) ? payload.offers : [];
            trackAiConciergeEvent("ai_response_received", {
              language: payload?.language,
              action: payload?.action,
              offers: offers.length,
              success: response.ok,
            });

            if (payload?.action === "search_rooms") {
              trackAiConciergeEvent("ai_availability_search", {
                language: payload?.language,
                offers: offers.length,
                checkin: payload?.search?.checkin,
                checkout: payload?.search?.checkout,
                guests: payload?.search?.guests,
              });
            }

            if (offers.length) {
              trackAiConciergeEvent("ai_room_results", {
                language: payload?.language,
                offers: offers.length,
                live_offers: offers.filter((offer: { preview?: boolean }) => offer?.preview !== true).length,
              });
            }
          })
          .catch(() => undefined);
      }

      if (requestUrl.includes("/api/ai-assistant/request")) {
        void response
          .clone()
          .json()
          .then((payload) => {
            if (response.ok && payload?.ok) {
              trackAiConciergeEvent("ai_booking_request_success", {
                request_id: payload?.requestId,
                live_verified: payload?.liveVerified === true,
                email_sent: payload?.emailSent === true,
              });
            } else {
              trackAiConciergeEvent("ai_booking_request_error", {
                status: response.status,
                refresh_required: payload?.refreshRequired === true,
                error: payload?.error,
              });
            }
          })
          .catch(() => undefined);
      }

      return response;
    };

    const handleChange = (event: Event) => {
      const select = event.target as HTMLSelectElement;
      if (select.tagName === "SELECT") {
        trackAiConciergeEvent("ai_language_change", { language: select.value });
      }
    };

    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const button = target.closest("button");
      const link = target.closest("a");

      if (link) {
        const card = link.closest("article");
        if (card) {
          trackAiConciergeEvent("ai_knowledge_card_click", {
            title: card.querySelector("h2")?.textContent,
            url: link.getAttribute("href"),
          });
        }
      }

      if (!button) return;
      const text = (button.textContent || "").trim();
      const normalized = normalize(text);
      const roomNumber = roomNumberFromText(text);

      if (roomNumber && button.querySelector("img")) {
        trackAiConciergeEvent("ai_room_card_open", { room_number: roomNumber });
        return;
      }

      if (/ενδιαφερομαι|i'm interested|je suis interesse|ich bin interessiert|sono interessato|me interesa|ilgileniyorum/i.test(normalized)) {
        trackAiConciergeEvent("ai_booking_request_open", {
          room_number: roomNumberFromText(root.innerText),
        });
        return;
      }

      const firstMessageButtons = root.querySelectorAll("button");
      if (Array.from(firstMessageButtons).indexOf(button) < 6 && text.length > 12) {
        trackAiConciergeEvent("ai_quick_prompt_click", { prompt: text });
      }
    };

    root.addEventListener("change", handleChange);
    root.addEventListener("click", handleClick);

    return () => {
      root.removeEventListener("change", handleChange);
      root.removeEventListener("click", handleClick);
      window.fetch = originalFetch;
    };
  }, []);

  function handleSubmitCapture(event: FormEvent<HTMLDivElement>) {
    const form = event.target as HTMLFormElement;
    if (!(form instanceof HTMLFormElement)) return;

    const input = form.querySelector("input");
    const message = input?.value || "";
    const isRequestForm = Boolean(form.querySelector("textarea"));

    if (isRequestForm) {
      trackAiConciergeEvent("ai_booking_request_submit", {
        has_message: Boolean(form.querySelector("textarea")?.value.trim()),
      });
      return;
    }

    if (message.trim()) {
      trackAiConciergeEvent("ai_message_send", {
        message_length: message.trim().length,
      });
    }

    const roomNumber = selectedRoomNumber(message);
    if (!roomNumber || !rootRef.current) return;

    const roomButton = Array.from(
      rootRef.current.querySelectorAll<HTMLButtonElement>("button"),
    ).find((button) => {
      const text = normalize(button.textContent || "");
      return [
        "room",
        "apartment",
        "δωματιο",
        "διαμερισμα",
        "zimmer",
        "chambre",
        "camera",
        "habitacion",
        "oda",
      ].some((word) => text.includes(`${word} ${roomNumber}`));
    });

    if (!roomButton) return;

    event.preventDefault();
    event.stopPropagation();
    roomButton.click();
  }

  return (
    <div ref={rootRef} onSubmitCapture={handleSubmitCapture}>
      <GuestAssistantMultilingual />
    </div>
  );
}
