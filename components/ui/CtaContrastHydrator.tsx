"use client";

import { useEffect } from "react";

const darkBackgroundMarkers = [
  "bg-[#17351f]",
  "bg-[#2f261f]",
  "bg-[#8b5e34]",
  "bg-[#6f4828]",
  "bg-stone-950",
  "bg-stone-900",
  "bg-black",
  "bg-emerald-700",
  "bg-teal-950",
  "bg-amber-700",
];

const lightBackgroundMarkers = [
  "bg-white",
  "bg-[#fffdfa]",
  "bg-[#fffaf3]",
  "bg-[#fff4df]",
  "bg-amber-50",
  "bg-teal-50",
  "bg-stone-50",
];

const headerActivitiesLabels = {
  en: { from: "Do in Chios", to: "What to see in Chios" },
  el: { from: "Τι να κάνεις", to: "Τι να δω στη Χίο" },
  fr: { from: "À faire", to: "Que voir à Chios" },
  de: { from: "Aktivitäten", to: "Sehenswertes auf Chios" },
  it: { from: "Cosa fare", to: "Cosa vedere a Chios" },
  es: { from: "Qué hacer", to: "Qué ver en Quíos" },
  tr: { from: "Ne yapılır", to: "Sakız Adası'nda görülecekler" },
} as const;

type HeaderLanguage = keyof typeof headerActivitiesLabels;

function hasExactClass(element: HTMLElement, markers: string[]) {
  return markers.some((marker) => element.classList.contains(marker));
}

function isCta(element: HTMLElement) {
  if (element.tagName !== "A" && element.tagName !== "BUTTON") return false;
  if (element.closest("header, footer")) return false;

  const className = element.className.toString();
  return className.includes("rounded-full") || className.includes("rounded-2xl") || className.includes("min-h-") || className.includes("uppercase");
}

function hydrateCta(element: HTMLElement) {
  if (!isCta(element)) return;

  const className = element.className.toString();
  const isDark = hasExactClass(element, darkBackgroundMarkers) || className.includes("from-[#") || className.includes("to-[#8e6607]");
  const isLight = hasExactClass(element, lightBackgroundMarkers);

  if (isDark && !className.includes("text-white") && !className.includes("!text-white")) {
    element.classList.add("!text-white");
  }

  if (isLight && (className.includes("text-white") || className.includes("!text-white"))) {
    element.classList.remove("text-white", "!text-white");
    element.classList.add("!text-stone-900");
  }
}

function hydrateCtasInRoot(root: ParentNode) {
  if (root instanceof HTMLElement) hydrateCta(root);
  for (const element of Array.from(root.querySelectorAll<HTMLElement>("a, button"))) {
    hydrateCta(element);
  }
}

function hydrateHeaderActivitiesLabel() {
  const header = document.querySelector<HTMLElement>("header");
  if (!header) return;

  const rawLanguage = document.documentElement.lang.split("-")[0] as HeaderLanguage;
  const language: HeaderLanguage = rawLanguage in headerActivitiesLabels ? rawLanguage : "en";
  const label = headerActivitiesLabels[language];

  for (const anchor of Array.from(header.querySelectorAll<HTMLAnchorElement>("a"))) {
    const strong = anchor.querySelector<HTMLElement>("strong");

    if (strong?.textContent?.trim() === label.from || strong?.textContent?.trim() === label.to) {
      strong.textContent = label.to;
      strong.classList.remove("truncate");
      strong.classList.add("whitespace-normal", "break-words");
      anchor.style.minHeight = "64px";
      anchor.style.alignItems = "center";
      continue;
    }

    if (anchor.children.length === 0 && (anchor.textContent?.trim() === label.from || anchor.textContent?.trim() === label.to)) {
      anchor.textContent = label.to;
      anchor.style.whiteSpace = "nowrap";
      anchor.style.fontSize = "12.5px";
      anchor.style.paddingInline = "10px";
    }
  }

  const desktopNav = header.querySelector<HTMLElement>('nav[aria-label]:not([class*="overflow-x-auto"])');
  if (desktopNav) {
    desktopNav.style.maxWidth = "780px";
    desktopNav.style.minWidth = "0";
    desktopNav.style.paddingInline = "6px";
  }

  const mobilePanel = header.querySelector<HTMLElement>('div[class*="w-[min(92vw,420px)]"]');
  if (mobilePanel) {
    mobilePanel.style.width = "min(96vw, 460px)";
  }
}

export function CtaContrastHydrator() {
  useEffect(() => {
    hydrateCtasInRoot(document);
    hydrateHeaderActivitiesLabel();

    let frameId: number | null = null;
    const pendingRoots = new Set<HTMLElement>();

    const flush = () => {
      frameId = null;
      for (const root of pendingRoots) hydrateCtasInRoot(root);
      pendingRoots.clear();
      hydrateHeaderActivitiesLabel();
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
    window.addEventListener("resize", hydrateHeaderActivitiesLabel, { passive: true });

    return () => {
      observer.disconnect();
      if (frameId !== null) window.cancelAnimationFrame(frameId);
      window.removeEventListener("resize", hydrateHeaderActivitiesLabel);
    };
  }, []);

  return null;
}
