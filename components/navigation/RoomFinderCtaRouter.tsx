"use client";

import { useEffect } from "react";
import {
  isRoomFinderDiscoveryLabel,
  roomFinderHrefForLanguage,
} from "@/lib/room-finder-cta-routing";

function pageLanguage() {
  const htmlLanguage = document.documentElement.lang;
  if (htmlLanguage) return htmlLanguage;
  return window.location.pathname.split("/").filter(Boolean)[0] || "en";
}

function shouldIgnoreAnchor(anchor: HTMLAnchorElement) {
  if (anchor.dataset.bookingCta === "true" || anchor.dataset.roomFinderCta === "false") return true;

  const rawHref = anchor.getAttribute("href") || "";
  if (!rawHref || rawHref.startsWith("#") || rawHref.startsWith("mailto:") || rawHref.startsWith("tel:")) {
    return true;
  }

  try {
    const url = new URL(rawHref, window.location.href);
    if (url.origin !== window.location.origin) return true;
    if (url.pathname.startsWith("/staff")) return true;
    return false;
  } catch {
    return true;
  }
}

function routeAnchor(anchor: HTMLAnchorElement) {
  if (shouldIgnoreAnchor(anchor)) return;

  const label = anchor.textContent?.replace(/\s+/g, " ").trim() || "";
  if (!isRoomFinderDiscoveryLabel(label)) return;

  const href = roomFinderHrefForLanguage(pageLanguage());
  if (anchor.getAttribute("href") === href) return;

  anchor.setAttribute("href", href);
  anchor.dataset.roomFinderRouted = "true";
}

function routeAllAnchors(root: ParentNode = document) {
  root.querySelectorAll<HTMLAnchorElement>("a[href]").forEach(routeAnchor);
}

export function RoomFinderCtaRouter() {
  useEffect(() => {
    routeAllAnchors();

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === "characterData") {
          const parent = mutation.target.parentElement?.closest("a[href]");
          if (parent instanceof HTMLAnchorElement) routeAnchor(parent);
          continue;
        }

        for (const node of mutation.addedNodes) {
          if (!(node instanceof HTMLElement)) continue;
          if (node.matches("a[href]")) routeAnchor(node as HTMLAnchorElement);
          routeAllAnchors(node);
        }
      }
    });

    observer.observe(document.body, {
      subtree: true,
      childList: true,
      characterData: true,
    });

    const refreshOnPointerDown = (event: PointerEvent) => {
      const target = event.target instanceof Element ? event.target.closest("a[href]") : null;
      if (target instanceof HTMLAnchorElement) routeAnchor(target);
    };

    document.addEventListener("pointerdown", refreshOnPointerDown, true);

    return () => {
      observer.disconnect();
      document.removeEventListener("pointerdown", refreshOnPointerDown, true);
    };
  }, []);

  return null;
}
