"use client";

import { useEffect } from "react";

/** Gap between two titles that enter the viewport together (ms). */
const STAGGER_MS = 700;

/**
 * Draws every [data-marker] title once it is ~60% inside the viewport.
 * Titles that become visible together are drawn one after another, top
 * first, so the eye follows a single stroke at a time.
 */
export function MarkerObserver() {
  useEffect(() => {
    const targets = Array.from(document.querySelectorAll<HTMLElement>("[data-marker]"));

    if (!("IntersectionObserver" in window)) {
      targets.forEach((el) => el.setAttribute("data-drawn", "true"));
      return;
    }

    const queue: Element[] = [];
    let nextSlot = 0;
    let timer: number | undefined;

    const drain = () => {
      timer = undefined;
      const el = queue.shift();
      if (!el) return;
      el.setAttribute("data-drawn", "true");
      nextSlot = performance.now() + STAGGER_MS;
      if (queue.length) timer = window.setTimeout(drain, STAGGER_MS);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const entering = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        for (const entry of entering) {
          observer.unobserve(entry.target);
          queue.push(entry.target);
        }
        if (!queue.length || timer !== undefined) return;
        const wait = Math.max(0, nextSlot - performance.now());
        timer = window.setTimeout(drain, wait);
      },
      { threshold: 0.6, rootMargin: "0px 0px -12% 0px" },
    );

    const seen = new WeakSet<Element>(targets);
    targets.forEach((el) => observer.observe(el));

    // Titles rendered later (lazy sections, client widgets) are picked up too.
    let scan = 0;
    const mutations = new MutationObserver(() => {
      if (scan) return;
      scan = window.requestAnimationFrame(() => {
        scan = 0;
        document.querySelectorAll<HTMLElement>("[data-marker]:not([data-drawn])").forEach((el) => {
          if (seen.has(el)) return;
          seen.add(el);
          observer.observe(el);
        });
      });
    });
    mutations.observe(document.body, { childList: true, subtree: true });

    return () => {
      mutations.disconnect();
      if (scan) window.cancelAnimationFrame(scan);
      observer.disconnect();
      if (timer !== undefined) window.clearTimeout(timer);
    };
  }, []);

  return null;
}
