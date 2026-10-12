"use client";

import { useEffect } from "react";

const STAGGER_MS = 90;

/**
 * Fades [data-reveal] blocks up into place when they enter the viewport.
 * The hidden state is a <style id="vh-reveal"> injected by an inline script
 * before the content paints, so without JS everything is visible. Cards in a
 * horizontal carousel are revealed together with their visible row-mates.
 */
export function RevealObserver() {
  useEffect(() => {
    const targets = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    const showAll = () => targets.forEach((el) => el.setAttribute("data-shown", "true"));

    if (!targets.length) return;
    if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      showAll();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entering = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top || a.boundingClientRect.left - b.boundingClientRect.left);
        const batch: HTMLElement[] = [];
        const viewportBottom = window.innerHeight;
        for (const entry of entering) {
          const el = entry.target as HTMLElement;
          if (!batch.includes(el)) batch.push(el);
          // Row-mates off to the side (carousel) appear with this card, so the
          // peeking next card stays visible as a swipe hint.
          const siblings = Array.from(el.parentElement?.children ?? []) as HTMLElement[];
          for (const sib of siblings) {
            if (sib === el || !sib.hasAttribute("data-reveal") || sib.hasAttribute("data-shown")) continue;
            const top = sib.getBoundingClientRect().top;
            if (top < viewportBottom && !batch.includes(sib)) batch.push(sib);
          }
        }
        batch.forEach((el, index) => {
          observer.unobserve(el);
          el.style.transitionDelay = `${Math.min(index, 5) * STAGGER_MS}ms`;
          el.setAttribute("data-shown", "true");
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -6% 0px" },
    );

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return null;
}
