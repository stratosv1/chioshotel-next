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

function hasExactClass(element: HTMLElement, markers: string[]) {
  return markers.some((marker) => element.classList.contains(marker));
}

function isCta(element: HTMLElement) {
  if (element.tagName !== "A" && element.tagName !== "BUTTON") return false;
  if (element.closest("header, footer")) return false;

  const className = element.className.toString();
  return className.includes("rounded-full") || className.includes("rounded-2xl") || className.includes("min-h-") || className.includes("uppercase");
}

function hydrateCtaContrast() {
  const ctas = Array.from(document.querySelectorAll<HTMLElement>("a, button")).filter(isCta);

  for (const cta of ctas) {
    const className = cta.className.toString();
    const isDark = hasExactClass(cta, darkBackgroundMarkers) || className.includes("from-[#") || className.includes("to-[#8e6607]");
    const isLight = hasExactClass(cta, lightBackgroundMarkers);

    if (isDark && !className.includes("text-white") && !className.includes("!text-white")) {
      cta.classList.add("!text-white");
    }

    if (isLight && (className.includes("text-white") || className.includes("!text-white"))) {
      cta.classList.remove("text-white", "!text-white");
      cta.classList.add("!text-stone-900");
    }
  }
}

export function CtaContrastHydrator() {
  useEffect(() => {
    hydrateCtaContrast();
    const observer = new MutationObserver(() => hydrateCtaContrast());
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  return null;
}
