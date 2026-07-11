"use client";

import { useEffect } from "react";

const BOOKING_PAGE = "/chios-hotels-rates/";

const BOOK_NOW_LABELS = new Set([
  "book now",
  "book your stay",
  "book direct",
  "book directly",
  "κράτηση τώρα",
  "κάντε κράτηση",
  "κάντε την κράτησή σας",
  "réserver",
  "réservez maintenant",
  "réserver maintenant",
  "jetzt buchen",
  "direkt buchen",
  "prenota ora",
  "prenota adesso",
  "reserva ahora",
  "reservar ahora",
  "şimdi rezervasyon yap",
  "hemen rezervasyon yap",
  "şimdi rezervasyon",
]);

function normalizeLabel(value: string) {
  return value.replace(/\s+/g, " ").trim().toLocaleLowerCase();
}

function updateBookNowLinks(root: ParentNode = document) {
  root.querySelectorAll<HTMLAnchorElement>("a[href]").forEach((link) => {
    const label = normalizeLabel(link.textContent || "");

    if (!BOOK_NOW_LABELS.has(label)) {
      return;
    }

    link.href = BOOKING_PAGE;
    link.removeAttribute("target");
    link.removeAttribute("rel");
  });
}

export function BookNowCtaHydrator() {
  useEffect(() => {
    updateBookNowLinks();

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement) {
            updateBookNowLinks(node);
          }
        });
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => observer.disconnect();
  }, []);

  return null;
}
