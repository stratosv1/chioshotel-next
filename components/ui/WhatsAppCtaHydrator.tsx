"use client";

import { useEffect } from "react";

function isWhatsAppElement(element: HTMLElement) {
  const anchor = element.closest<HTMLAnchorElement>("a");
  const href = anchor?.href.toLowerCase() || "";
  const text = (element.textContent || "").toLowerCase();
  const label = (element.getAttribute("aria-label") || "").toLowerCase();

  return href.includes("wa.me") || href.includes("whatsapp") || text.includes("whatsapp") || label.includes("whatsapp");
}

function applyWhatsAppStyle(element: HTMLElement) {
  const target = element.closest<HTMLElement>("a, button") || element;

  target.classList.remove(
    "bg-[#17351f]",
    "bg-[#224d2d]",
    "bg-stone-950",
    "bg-stone-900",
    "bg-white",
    "text-stone-900",
    "text-stone-800",
    "text-emerald-800",
  );

  target.classList.add(
    "!bg-[#25D366]",
    "!text-white",
    "shadow-lg",
    "shadow-[#25D366]/25",
    "hover:!bg-[#1ebe5d]",
  );
}

export function WhatsAppCtaHydrator() {
  useEffect(() => {
    function hydrateWhatsAppCtas() {
      const candidates = Array.from(document.querySelectorAll<HTMLElement>("a, button"));

      for (const element of candidates) {
        if (!isWhatsAppElement(element)) continue;
        applyWhatsAppStyle(element);
        element.dataset.whatsappCtaReady = "true";
      }
    }

    hydrateWhatsAppCtas();
    const observer = new MutationObserver(() => hydrateWhatsAppCtas());
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  return null;
}
