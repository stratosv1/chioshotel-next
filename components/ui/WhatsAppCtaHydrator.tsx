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

function hydrateBeds24Iframes() {
  const frames = Array.from(
    document.querySelectorAll<HTMLIFrameElement>('iframe[src*="beds24.com/booking2.php"]'),
  );

  for (const frame of frames) {
    const mobile = window.matchMedia("(max-width: 767px)").matches;

    frame.setAttribute("scrolling", "no");
    frame.style.overflow = "hidden";
    frame.style.height = mobile ? "1350px" : "1200px";
    frame.style.minHeight = mobile ? "1350px" : "1200px";
    frame.style.border = "0";
    frame.dataset.beds24NoScrollbar = "true";
  }
}

export function WhatsAppCtaHydrator() {
  useEffect(() => {
    function hydratePageCtas() {
      const candidates = Array.from(document.querySelectorAll<HTMLElement>("a, button"));

      for (const element of candidates) {
        if (!isWhatsAppElement(element)) continue;
        applyWhatsAppStyle(element);
        element.dataset.whatsappCtaReady = "true";
      }

      hydrateBeds24Iframes();
    }

    hydratePageCtas();
    const observer = new MutationObserver(() => hydratePageCtas());
    observer.observe(document.body, { childList: true, subtree: true });
    window.addEventListener("resize", hydrateBeds24Iframes);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", hydrateBeds24Iframes);
    };
  }, []);

  return null;
}
