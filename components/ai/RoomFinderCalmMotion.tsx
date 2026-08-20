"use client";

import { useEffect } from "react";

const CALM_SCROLL_MS = 280;
const MIN_SCROLL_DISTANCE = 18;

function easeOutCubic(value: number) {
  return 1 - Math.pow(1 - value, 3);
}

export function RoomFinderCalmMotion() {
  useEffect(() => {
    const shell = document.querySelector<HTMLElement>('[data-room-finder-shell="true"]');
    if (!shell) return;

    const feed = shell.querySelector<HTMLElement>('[role="log"]');
    if (!feed) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const nativeScrollTo = HTMLElement.prototype.scrollTo.bind(feed);
    const feedScrollDescriptor = Object.getOwnPropertyDescriptor(feed, "scrollTo");
    const patchedResults = new Map<HTMLElement, PropertyDescriptor | undefined>();
    let animationFrame: number | null = null;

    const stopAnimation = () => {
      if (animationFrame !== null) {
        window.cancelAnimationFrame(animationFrame);
        animationFrame = null;
      }
    };

    const scrollToCalmly = (targetTop: number, duration = CALM_SCROLL_MS) => {
      const maxTop = Math.max(0, feed.scrollHeight - feed.clientHeight);
      const clampedTarget = Math.max(0, Math.min(targetTop, maxTop));
      const startTop = feed.scrollTop;
      const distance = clampedTarget - startTop;

      stopAnimation();

      if (reduceMotion.matches || Math.abs(distance) < MIN_SCROLL_DISTANCE || duration <= 0) {
        nativeScrollTo({ top: clampedTarget, behavior: "auto" });
        return;
      }

      const startedAt = performance.now();
      const tick = (now: number) => {
        const progress = Math.min(1, (now - startedAt) / duration);
        const eased = easeOutCubic(progress);
        nativeScrollTo({ top: startTop + distance * eased, behavior: "auto" });

        if (progress < 1) {
          animationFrame = window.requestAnimationFrame(tick);
        } else {
          animationFrame = null;
        }
      };

      animationFrame = window.requestAnimationFrame(tick);
    };

    const calmScrollTo = ((first?: number | ScrollToOptions, second?: number) => {
      if (typeof first === "number") {
        scrollToCalmly(typeof second === "number" ? second : feed.scrollTop);
        return;
      }

      const options = first || {};
      const targetTop = typeof options.top === "number" ? options.top : feed.scrollTop;
      if (options.behavior === "smooth") {
        scrollToCalmly(targetTop);
        return;
      }

      stopAnimation();
      nativeScrollTo({ ...options, top: targetTop, behavior: "auto" });
    }) as HTMLElement["scrollTo"];

    Object.defineProperty(feed, "scrollTo", {
      configurable: true,
      value: calmScrollTo,
    });

    const patchResultsScroll = (results: HTMLElement) => {
      if (patchedResults.has(results)) return;

      patchedResults.set(results, Object.getOwnPropertyDescriptor(results, "scrollIntoView"));
      const calmScrollIntoView = ((options?: boolean | ScrollIntoViewOptions) => {
        const feedRect = feed.getBoundingClientRect();
        const resultRect = results.getBoundingClientRect();
        const targetTop = feed.scrollTop + resultRect.top - feedRect.top - 8;
        const requestedBehavior = typeof options === "object" ? options.behavior : "auto";
        const delta = Math.abs(targetTop - feed.scrollTop);

        if (requestedBehavior === "smooth") {
          scrollToCalmly(targetTop, 320);
          return;
        }

        if (delta > 24) {
          scrollToCalmly(targetTop, 180);
        }
      }) as HTMLElement["scrollIntoView"];

      Object.defineProperty(results, "scrollIntoView", {
        configurable: true,
        value: calmScrollIntoView,
      });
    };

    const patchExistingResults = () => {
      shell.querySelectorAll<HTMLElement>('[data-room-results-start="true"]')
        .forEach(patchResultsScroll);
    };

    patchExistingResults();

    const observer = new MutationObserver(() => {
      patchExistingResults();
    });
    observer.observe(feed, { childList: true, subtree: true });

    const cancelOnUserInput = () => stopAnimation();
    feed.addEventListener("pointerdown", cancelOnUserInput, { passive: true });
    feed.addEventListener("touchstart", cancelOnUserInput, { passive: true });
    feed.addEventListener("wheel", cancelOnUserInput, { passive: true });

    return () => {
      observer.disconnect();
      stopAnimation();
      feed.removeEventListener("pointerdown", cancelOnUserInput);
      feed.removeEventListener("touchstart", cancelOnUserInput);
      feed.removeEventListener("wheel", cancelOnUserInput);

      if (feedScrollDescriptor) {
        Object.defineProperty(feed, "scrollTo", feedScrollDescriptor);
      } else {
        delete (feed as HTMLElement & { scrollTo?: HTMLElement["scrollTo"] }).scrollTo;
      }

      patchedResults.forEach((descriptor, results) => {
        if (descriptor) {
          Object.defineProperty(results, "scrollIntoView", descriptor);
        } else {
          delete (results as HTMLElement & { scrollIntoView?: HTMLElement["scrollIntoView"] }).scrollIntoView;
        }
      });
    };
  }, []);

  return (
    <style jsx global>{`
      @keyframes rfCalmEnter {
        from { opacity: 0; transform: translate3d(0, 4px, 0) scale(.998); }
        to { opacity: 1; transform: translate3d(0, 0, 0) scale(1); }
      }

      @keyframes rfCalmReaction {
        from { opacity: 0; transform: translate3d(0, 1px, 0) scale(.92); }
        to { opacity: 1; transform: translate3d(0, 0, 0) scale(1); }
      }

      @keyframes rfCalmChoice {
        from { opacity: 0; transform: translate3d(0, 3px, 0); }
        to { opacity: 1; transform: translate3d(0, 0, 0); }
      }

      @keyframes rfCalmCard {
        from { opacity: 0; }
        to { opacity: 1; }
      }

      @keyframes rfCalmTypingDot {
        0%, 60%, 100% { opacity: .42; transform: translateY(0); }
        30% { opacity: .95; transform: translateY(-2px); }
      }

      [data-room-finder-shell="true"] .msg {
        animation: rfCalmEnter 340ms cubic-bezier(.16, 1, .3, 1) both !important;
        transform-origin: center bottom;
      }

      [data-room-finder-shell="true"] .reaction {
        animation: rfCalmReaction 260ms cubic-bezier(.16, 1, .3, 1) both !important;
      }

      [data-room-finder-shell="true"] .typing-dot,
      [data-room-finder-shell="true"] [aria-label="Typing"] > span {
        animation: rfCalmTypingDot 1.28s ease-in-out infinite !important;
      }

      [data-room-finder-shell="true"] .typing-dot:nth-child(2),
      [data-room-finder-shell="true"] [aria-label="Typing"] > span:nth-child(2) {
        animation-delay: .16s !important;
      }

      [data-room-finder-shell="true"] .typing-dot:nth-child(3),
      [data-room-finder-shell="true"] [aria-label="Typing"] > span:nth-child(3) {
        animation-delay: .32s !important;
      }

      [data-room-finder-shell="true"] .hide-scroll.msg > button {
        animation: rfCalmChoice 300ms cubic-bezier(.16, 1, .3, 1) both;
      }

      [data-room-finder-shell="true"] .hide-scroll.msg > button:nth-child(2) { animation-delay: 45ms; }
      [data-room-finder-shell="true"] .hide-scroll.msg > button:nth-child(3) { animation-delay: 90ms; }
      [data-room-finder-shell="true"] .hide-scroll.msg > button:nth-child(4) { animation-delay: 135ms; }
      [data-room-finder-shell="true"] .hide-scroll.msg > button:nth-child(5) { animation-delay: 180ms; }

      [data-room-finder-shell="true"] [data-room-card] {
        animation: rfCalmCard 420ms ease-out both;
      }

      [data-room-finder-shell="true"] [data-room-card]:nth-child(2) { animation-delay: 55ms; }
      [data-room-finder-shell="true"] [data-room-card]:nth-child(3) { animation-delay: 110ms; }
      [data-room-finder-shell="true"] [data-room-card]:nth-child(4) { animation-delay: 165ms; }

      [data-room-finder-shell="true"] button,
      [data-room-finder-shell="true"] input,
      [data-room-finder-shell="true"] select {
        transition-duration: 180ms;
        transition-timing-function: ease-out;
      }

      @media (prefers-reduced-motion: reduce) {
        [data-room-finder-shell="true"] .msg,
        [data-room-finder-shell="true"] .reaction,
        [data-room-finder-shell="true"] .typing-dot,
        [data-room-finder-shell="true"] [aria-label="Typing"] > span,
        [data-room-finder-shell="true"] .hide-scroll.msg > button,
        [data-room-finder-shell="true"] [data-room-card] {
          animation: none !important;
          transform: none !important;
          opacity: 1 !important;
        }

        [data-room-finder-shell="true"] *,
        [data-room-finder-shell="true"] *::before,
        [data-room-finder-shell="true"] *::after {
          scroll-behavior: auto !important;
          transition-duration: .01ms !important;
        }
      }
    `}</style>
  );
}
