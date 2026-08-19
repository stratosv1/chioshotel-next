"use client";

import { useEffect } from "react";

const RESULT_SETTLE_DELAYS = [0, 80, 160, 280, 450, 650, 900, 1200];
const COMPOSER_HIDE_MS = 560;
const RESULTS_LOCK_MS = 1250;

type NavigatorWithVirtualKeyboard = Navigator & {
  virtualKeyboard?: {
    hide?: () => void;
  };
};

function getComposerInput() {
  return document.getElementById("room-finder-message") as HTMLInputElement | null;
}

function getComposerForm() {
  return getComposerInput()?.closest("form") as HTMLFormElement | null;
}

function getResultsStart() {
  return document.querySelector<HTMLElement>('[data-room-results-start="true"]');
}

function getFeed() {
  return document.querySelector<HTMLElement>('[role="log"]');
}

function hideVirtualKeyboard() {
  const navigatorWithKeyboard = navigator as NavigatorWithVirtualKeyboard;
  try {
    navigatorWithKeyboard.virtualKeyboard?.hide?.();
  } catch {
    // The API is optional. DOM focus handling below remains the fallback.
  }
}

function alignResultsToFeedTop() {
  const feed = getFeed();
  const results = getResultsStart();
  if (!feed || !results) return;

  const feedRect = feed.getBoundingClientRect();
  const resultsRect = results.getBoundingClientRect();
  const delta = resultsRect.top - feedRect.top - 4;

  if (Math.abs(delta) < 2) return;

  feed.scrollTo({
    top: Math.max(0, feed.scrollTop + delta),
    behavior: "auto",
  });
}

export function RoomFinderResultsViewportGuard() {
  useEffect(() => {
    let activeResults: HTMLElement | null = null;
    let lockedUntil = 0;
    let timers: number[] = [];
    let restoreTimer: number | null = null;
    let lockedFeed: HTMLElement | null = null;
    let feedScrollFrame: number | null = null;

    let hiddenForm: HTMLFormElement | null = null;
    let hiddenInput: HTMLInputElement | null = null;
    let previousDisplay = "";
    let previousDisabled = false;
    let previousReadOnly = false;
    let previousTabIndex = 0;

    const clearTimers = () => {
      timers.forEach(timer => window.clearTimeout(timer));
      timers = [];
      if (restoreTimer !== null) {
        window.clearTimeout(restoreTimer);
        restoreTimer = null;
      }
      if (feedScrollFrame !== null) {
        cancelAnimationFrame(feedScrollFrame);
        feedScrollFrame = null;
      }
    };

    const restoreComposer = () => {
      if (hiddenForm?.isConnected) {
        hiddenForm.style.display = previousDisplay;
        delete hiddenForm.dataset.resultsImeHidden;
      }

      if (hiddenInput?.isConnected) {
        hiddenInput.disabled = previousDisabled;
        hiddenInput.readOnly = previousReadOnly;
        hiddenInput.tabIndex = previousTabIndex;
      }

      hiddenForm = null;
      hiddenInput = null;
      restoreTimer = null;

      requestAnimationFrame(() => {
        hideVirtualKeyboard();
        alignResultsToFeedTop();
      });
    };

    const hideComposerForKeyboardDismissal = () => {
      const input = getComposerInput();
      const form = getComposerForm();

      if (!input || !form) {
        hideVirtualKeyboard();
        return;
      }

      input.blur();
      hideVirtualKeyboard();

      if (!hiddenForm) {
        hiddenForm = form;
        hiddenInput = input;
        previousDisplay = form.style.display;
        previousDisabled = input.disabled;
        previousReadOnly = input.readOnly;
        previousTabIndex = input.tabIndex;

        // Android Chrome can keep the IME attached to a blurred input while
        // VisualViewport is resizing. Temporarily taking the composer out of
        // the render tree reliably releases the IME without changing finder state.
        form.dataset.resultsImeHidden = "true";
        form.style.display = "none";
        input.readOnly = true;
        input.disabled = true;
        input.tabIndex = -1;
      }

      if (restoreTimer !== null) window.clearTimeout(restoreTimer);
      restoreTimer = window.setTimeout(restoreComposer, COMPOSER_HIDE_MS);
    };

    const onFeedScroll = () => {
      if (!activeResults || performance.now() >= lockedUntil) return;
      if (feedScrollFrame !== null) return;

      feedScrollFrame = requestAnimationFrame(() => {
        feedScrollFrame = null;
        if (!activeResults || performance.now() >= lockedUntil) return;
        alignResultsToFeedTop();
      });
    };

    const attachFeedLock = () => {
      const feed = getFeed();
      if (feed === lockedFeed) return;

      lockedFeed?.removeEventListener("scroll", onFeedScroll);
      lockedFeed = feed;
      lockedFeed?.addEventListener("scroll", onFeedScroll, { passive: true });
    };

    const settleResults = () => {
      const results = getResultsStart();

      if (!results) {
        activeResults = null;
        lockedUntil = 0;
        clearTimers();
        restoreComposer();
        return;
      }

      if (results === activeResults) return;

      activeResults = results;
      lockedUntil = performance.now() + RESULTS_LOCK_MS;
      clearTimers();
      attachFeedLock();
      hideComposerForKeyboardDismissal();

      timers = RESULT_SETTLE_DELAYS.map(delay => window.setTimeout(() => {
        if (!activeResults) return;
        hideVirtualKeyboard();
        alignResultsToFeedTop();
      }, delay));
    };

    const onViewportChange = () => {
      if (!activeResults || performance.now() >= lockedUntil) return;
      requestAnimationFrame(() => {
        hideVirtualKeyboard();
        alignResultsToFeedTop();
      });
    };

    const observer = new MutationObserver(settleResults);
    observer.observe(document.body, { childList: true, subtree: true });

    window.visualViewport?.addEventListener("resize", onViewportChange);
    window.visualViewport?.addEventListener("scroll", onViewportChange);
    window.addEventListener("resize", onViewportChange);

    settleResults();

    return () => {
      observer.disconnect();
      window.visualViewport?.removeEventListener("resize", onViewportChange);
      window.visualViewport?.removeEventListener("scroll", onViewportChange);
      window.removeEventListener("resize", onViewportChange);
      lockedFeed?.removeEventListener("scroll", onFeedScroll);
      clearTimers();
      restoreComposer();
    };
  }, []);

  return null;
}
