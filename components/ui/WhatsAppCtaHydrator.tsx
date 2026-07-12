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

  if (target.dataset.whatsappCtaReady === "true") return;

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
  target.dataset.whatsappCtaReady = "true";
}

function hydrateWhatsAppInRoot(root: ParentNode) {
  if (root instanceof HTMLElement && isWhatsAppElement(root)) {
    applyWhatsAppStyle(root);
  }

  for (const element of Array.from(root.querySelectorAll<HTMLElement>("a, button"))) {
    if (isWhatsAppElement(element)) applyWhatsAppStyle(element);
  }
}

function hydrateBeds24Iframes() {
  const frames = Array.from(
    document.querySelectorAll<HTMLIFrameElement>('iframe[src*="beds24.com/booking2.php"]'),
  );

  for (const frame of frames) {
    const mobile = window.matchMedia("(max-width: 767px)").matches;
    const iframeHeight = mobile ? "5600px" : "3600px";

    frame.setAttribute("scrolling", "no");
    frame.style.overflow = "hidden";
    frame.style.height = iframeHeight;
    frame.style.minHeight = iframeHeight;
    frame.style.maxHeight = "none";
    frame.style.border = "0";
    frame.dataset.beds24NoScrollbar = "true";
  }
}

export function WhatsAppCtaHydrator() {
  useEffect(() => {
    hydrateWhatsAppInRoot(document);
    hydrateBeds24Iframes();

    let frameId: number | null = null;
    const pendingRoots = new Set<HTMLElement>();

    const flush = () => {
      frameId = null;
      for (const root of pendingRoots) hydrateWhatsAppInRoot(root);
      pendingRoots.clear();
    };

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of Array.from(mutation.addedNodes)) {
          if (node instanceof HTMLElement) pendingRoots.add(node);
        }
      }

      if (pendingRoots.size && frameId === null) {
        frameId = window.requestAnimationFrame(flush);
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
    window.addEventListener("resize", hydrateBeds24Iframes, { passive: true });

    return () => {
      observer.disconnect();
      if (frameId !== null) window.cancelAnimationFrame(frameId);
      window.removeEventListener("resize", hydrateBeds24Iframes);
    };
  }, []);

  return null;
}
