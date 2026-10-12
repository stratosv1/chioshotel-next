"use client";

import { useEffect } from "react";

/** Draws every [data-marker] title once it is ~60% inside the viewport. */
export function MarkerObserver() {
  useEffect(() => {
    const targets = Array.from(document.querySelectorAll<HTMLElement>("[data-marker]"));
    if (!targets.length) return;

    if (!("IntersectionObserver" in window)) {
      targets.forEach((el) => el.setAttribute("data-drawn", "true"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute("data-drawn", "true");
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.6, rootMargin: "0px 0px -12% 0px" },
    );

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return null;
}
