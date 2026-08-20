"use client";

import { useEffect } from "react";

const CALM_SCROLL_MS = 320;
const MIN_SCROLL_DISTANCE = 28;
const SCROLL_COALESCE_MS = 70;
const STICKY_THRESHOLD = 120;

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
    let queuedScrollTimer: number | null = null;
    let queuedTargetTop: number | null = null;
    let queuedDuration = CALM_SCROLL_MS;
    let programmaticScroll = false;
    let stickToBottom = true;

    const distanceFromBottom = () => Math.max(0, feed.scrollHeight - feed.clientHeight - feed.scrollTop);

    const stopAnimation = () => {
      if (animationFrame !== null) {
        window.cancelAnimationFrame(animationFrame);
        animationFrame = null;
      }
      programmaticScroll = false;
    };

    const clearQueuedScroll = () => {
      if (queuedScrollTimer !== null) {
        window.clearTimeout(queuedScrollTimer);
        queuedScrollTimer = null;
      }
      queuedTargetTop = null;
    };

    const performScroll = (targetTop: number, duration = CALM_SCROLL_MS) => {
      const maxTop = Math.max(0, feed.scrollHeight - feed.clientHeight);
      const clampedTarget = Math.max(0, Math.min(targetTop, maxTop));
      const startTop = feed.scrollTop;
      const distance = clampedTarget - startTop;
      const isBottomRequest = Math.abs(clampedTarget - maxTop) <= 24;

      stopAnimation();

      if (isBottomRequest && !stickToBottom) return;

      if (reduceMotion.matches || Math.abs(distance) < MIN_SCROLL_DISTANCE || duration <= 0) {
        programmaticScroll = true;
        nativeScrollTo({ top: clampedTarget, behavior: "auto" });
        programmaticScroll = false;
        stickToBottom = distanceFromBottom() <= STICKY_THRESHOLD;
        return;
      }

      const startedAt = performance.now();
      programmaticScroll = true;
      const tick = (now: number) => {
        const progress = Math.min(1, (now - startedAt) / duration);
        const eased = easeOutCubic(progress);
        nativeScrollTo({ top: startTop + distance * eased, behavior: "auto" });

        if (progress < 1) {
          animationFrame = window.requestAnimationFrame(tick);
        } else {
          animationFrame = null;
          programmaticScroll = false;
          stickToBottom = distanceFromBottom() <= STICKY_THRESHOLD;
        }
      };

      animationFrame = window.requestAnimationFrame(tick);
    };

    const queueScroll = (targetTop: number, duration = CALM_SCROLL_MS) => {
      queuedTargetTop = targetTop;
      queuedDuration = duration;
      if (queuedScrollTimer !== null) window.clearTimeout(queuedScrollTimer);

      queuedScrollTimer = window.setTimeout(() => {
        queuedScrollTimer = null;
        const target = queuedTargetTop;
        queuedTargetTop = null;
        if (target !== null) performScroll(target, queuedDuration);
      }, SCROLL_COALESCE_MS);
    };

    const calmScrollTo = ((first?: number | ScrollToOptions, second?: number) => {
      if (typeof first === "number") {
        queueScroll(typeof second === "number" ? second : feed.scrollTop);
        return;
      }

      const options = first || {};
      const targetTop = typeof options.top === "number" ? options.top : feed.scrollTop;
      if (options.behavior === "smooth") {
        queueScroll(targetTop);
        return;
      }

      clearQueuedScroll();
      stopAnimation();
      programmaticScroll = true;
      nativeScrollTo({ ...options, top: targetTop, behavior: "auto" });
      programmaticScroll = false;
      stickToBottom = distanceFromBottom() <= STICKY_THRESHOLD;
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
          queueScroll(targetTop, 360);
          return;
        }

        if (delta > 30) queueScroll(targetTop, 220);
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

    const handleFeedScroll = () => {
      if (programmaticScroll || animationFrame !== null) return;
      stickToBottom = distanceFromBottom() <= STICKY_THRESHOLD;
    };

    const cancelOnUserInput = () => {
      clearQueuedScroll();
      stopAnimation();
      stickToBottom = distanceFromBottom() <= STICKY_THRESHOLD;
    };

    feed.addEventListener("scroll", handleFeedScroll, { passive: true });
    feed.addEventListener("pointerdown", cancelOnUserInput, { passive: true });
    feed.addEventListener("touchstart", cancelOnUserInput, { passive: true });
    feed.addEventListener("wheel", cancelOnUserInput, { passive: true });

    return () => {
      observer.disconnect();
      clearQueuedScroll();
      stopAnimation();
      feed.removeEventListener("scroll", handleFeedScroll);
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
        from { opacity: 0; transform: translate3d(0, 2px, 0); }
        to { opacity: 1; transform: translate3d(0, 0, 0); }
      }

      @keyframes rfCalmReaction {
        from { opacity: 0; transform: translate3d(0, 1px, 0) scale(.94); }
        to { opacity: 1; transform: translate3d(0, 0, 0) scale(1); }
      }

      @keyframes rfCalmChoice {
        from { opacity: 0; transform: translate3d(0, 2px, 0); }
        to { opacity: 1; transform: translate3d(0, 0, 0); }
      }

      @keyframes rfCalmCard {
        from { opacity: 0; transform: translate3d(0, 2px, 0); }
        to { opacity: 1; transform: translate3d(0, 0, 0); }
      }

      @keyframes rfCalmTypingDot {
        0%, 60%, 100% { opacity: .42; transform: translateY(0); }
        30% { opacity: .95; transform: translateY(-2px); }
      }

      [data-room-finder-shell="true"] .msg,
      [data-room-finder-shell="true"] [role="log"] section:not(.msg),
      [data-room-finder-shell="true"] [role="dialog"],
      [data-room-finder-shell="true"] [role="log"] [role="status"]:not(.msg) {
        animation: rfCalmEnter 320ms cubic-bezier(.16, 1, .3, 1) both !important;
      }

      [data-room-finder-shell="true"] > header + div:not([role="log"]) {
        animation: rfCalmEnter 300ms cubic-bezier(.16, 1, .3, 1) both;
      }

      [data-room-finder-shell="true"] .reaction {
        animation: rfCalmReaction 240ms cubic-bezier(.16, 1, .3, 1) both !important;
      }

      [data-room-finder-shell="true"] .typing-dot,
      [data-room-finder-shell="true"] [aria-label="Typing"] > span {
        animation: rfCalmTypingDot 1.34s ease-in-out infinite !important;
      }

      [data-room-finder-shell="true"] .typing-dot:nth-child(2),
      [data-room-finder-shell="true"] [aria-label="Typing"] > span:nth-child(2) {
        animation-delay: .17s !important;
      }

      [data-room-finder-shell="true"] .typing-dot:nth-child(3),
      [data-room-finder-shell="true"] [aria-label="Typing"] > span:nth-child(3) {
        animation-delay: .34s !important;
      }

      [data-room-finder-shell="true"] .rf-followup-bubble {
        animation: rfCalmEnter 320ms cubic-bezier(.16, 1, .3, 1) both;
      }

      [data-room-finder-shell="true"] .rf-followup-meta {
        animation: rfCalmEnter 260ms ease-out 90ms both;
      }

      [data-room-finder-shell="true"] .hide-scroll.msg {
        animation-delay: 90ms !important;
      }

      [data-room-finder-shell="true"] .hide-scroll.msg > button {
        animation: rfCalmChoice 280ms cubic-bezier(.16, 1, .3, 1) both;
      }

      [data-room-finder-shell="true"] .hide-scroll.msg > button:nth-child(1) { animation-delay: 120ms; }
      [data-room-finder-shell="true"] .hide-scroll.msg > button:nth-child(2) { animation-delay: 165ms; }
      [data-room-finder-shell="true"] .hide-scroll.msg > button:nth-child(3) { animation-delay: 210ms; }
      [data-room-finder-shell="true"] .hide-scroll.msg > button:nth-child(4) { animation-delay: 255ms; }
      [data-room-finder-shell="true"] .hide-scroll.msg > button:nth-child(5) { animation-delay: 300ms; }

      [data-room-finder-shell="true"] [data-room-results-start="true"] {
        animation-delay: 130ms;
      }

      [data-room-finder-shell="true"] [data-room-card] {
        animation: rfCalmCard 360ms cubic-bezier(.16, 1, .3, 1) both;
        animation-delay: 170ms;
      }

      [data-room-finder-shell="true"] [data-room-card]:nth-child(2) { animation-delay: 225ms; }
      [data-room-finder-shell="true"] [data-room-card]:nth-child(3) { animation-delay: 280ms; }
      [data-room-finder-shell="true"] [data-room-card]:nth-child(4) { animation-delay: 335ms; }

      [data-room-finder-shell="true"] [role="log"] > div > div > .msg + .msg {
        animation-delay: 80ms !important;
      }

      [data-room-finder-shell="true"] [role="log"] > div > div > .msg + .msg + .msg {
        animation-delay: 140ms !important;
      }

      [data-room-finder-shell="true"] button,
      [data-room-finder-shell="true"] input,
      [data-room-finder-shell="true"] select {
        transition-duration: 180ms;
        transition-timing-function: ease-out;
      }

      @media (prefers-reduced-motion: reduce) {
        [data-room-finder-shell="true"] .msg,
        [data-room-finder-shell="true"] [role="log"] section:not(.msg),
        [data-room-finder-shell="true"] [role="dialog"],
        [data-room-finder-shell="true"] [role="log"] [role="status"]:not(.msg),
        [data-room-finder-shell="true"] > header + div:not([role="log"]),
        [data-room-finder-shell="true"] .reaction,
        [data-room-finder-shell="true"] .typing-dot,
        [data-room-finder-shell="true"] [aria-label="Typing"] > span,
        [data-room-finder-shell="true"] .hide-scroll.msg > button,
        [data-room-finder-shell="true"] [data-room-card],
        [data-room-finder-shell="true"] .rf-followup-bubble,
        [data-room-finder-shell="true"] .rf-followup-meta {
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
