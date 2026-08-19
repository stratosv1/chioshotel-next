"use client";

import { useEffect } from "react";

const RESULT_SETTLE_DELAYS = [0, 80, 160, 280, 450, 700, 1000, 1400];
const INITIAL_COMPOSER_HIDE_MS = 900;
const INITIAL_RESULTS_LOCK_MS = 1700;

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
    // Optional browser API. Focus transfer below is the primary mechanism.
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

function moveFocusToResults() {
  const results = getResultsStart();
  if (!results) return;

  if (!results.hasAttribute("tabindex")) {
    results.setAttribute("tabindex", "-1");
    results.dataset.resultsFocusTarget = "true";
  }

  try {
    results.focus({ preventScroll: true });
  } catch {
    results.focus();
  }
}

export function RoomFinderResultsViewportGuard() {
  useEffect(() => {
    let activeResults: HTMLElement | null = null;
    let composerActivatedByUser = false;
    let lockedUntil = 0;
    let timers: number[] = [];
    let revealTimer: number | null = null;
    let lockedFeed: HTMLElement | null = null;
    let feedScrollFrame: number | null = null;

    let guardedForm: HTMLFormElement | null = null;
    let guardedInput: HTMLInputElement | null = null;
    let previousDisplay = "";
    let previousDisabled = false;
    let previousReadOnly = false;
    let previousTabIndex = 0;

    const clearTimers = () => {
      timers.forEach(timer => window.clearTimeout(timer));
      timers = [];

      if (revealTimer !== null) {
        window.clearTimeout(revealTimer);
        revealTimer = null;
      }

      if (feedScrollFrame !== null) {
        cancelAnimationFrame(feedScrollFrame);
        feedScrollFrame = null;
      }
    };

    const removeComposerActivationListener = () => {
      guardedForm?.removeEventListener("pointerdown", activateComposerFromUserGesture, true);
      guardedForm?.removeEventListener("touchstart", activateComposerFromUserGesture, true);
    };

    const restoreComposerFully = () => {
      removeComposerActivationListener();

      if (guardedForm?.isConnected) {
        guardedForm.style.display = previousDisplay;
        delete guardedForm.dataset.resultsImeMode;
      }

      if (guardedInput?.isConnected) {
        guardedInput.disabled = previousDisabled;
        guardedInput.readOnly = previousReadOnly;
        guardedInput.tabIndex = previousTabIndex;
      }

      guardedForm = null;
      guardedInput = null;
      revealTimer = null;
      composerActivatedByUser = false;
    };

    const showComposerAsSafeLauncher = () => {
      if (!guardedForm?.isConnected || !guardedInput?.isConnected) return;

      guardedForm.style.display = previousDisplay;
      guardedInput.disabled = previousDisabled;
      guardedInput.readOnly = true;
      guardedInput.tabIndex = -1;
      guardedForm.dataset.resultsImeMode = "safe-launcher";
      revealTimer = null;

      moveFocusToResults();
      hideVirtualKeyboard();
      alignResultsToFeedTop();
    };

    function activateComposerFromUserGesture(event: Event) {
      if (!activeResults || !guardedInput?.isConnected || !guardedForm?.isConnected) return;

      composerActivatedByUser = true;
      lockedUntil = 0;
      timers.forEach(timer => window.clearTimeout(timer));
      timers = [];

      guardedInput.disabled = previousDisabled;
      guardedInput.readOnly = previousReadOnly;
      guardedInput.tabIndex = previousTabIndex;
      guardedForm.dataset.resultsImeMode = "editing";

      // Let the original React handlers receive the user gesture, then focus the
      // real input explicitly. The keyboard is only allowed to reopen after a tap.
      requestAnimationFrame(() => {
        try {
          guardedInput?.focus({ preventScroll: false });
        } catch {
          guardedInput?.focus();
        }
      });

      // Do not preventDefault: the form/input keeps its normal click behavior.
      void event;
    }

    const guardComposerForResults = () => {
      const input = getComposerInput();
      const form = getComposerForm();

      if (!input || !form) {
        hideVirtualKeyboard();
        moveFocusToResults();
        return;
      }

      if (guardedForm !== form || guardedInput !== input) {
        restoreComposerFully();

        guardedForm = form;
        guardedInput = input;
        previousDisplay = form.style.display;
        previousDisabled = input.disabled;
        previousReadOnly = input.readOnly;
        previousTabIndex = input.tabIndex;

        form.addEventListener("pointerdown", activateComposerFromUserGesture, true);
        form.addEventListener("touchstart", activateComposerFromUserGesture, true);
      }

      composerActivatedByUser = false;

      input.blur();
      input.readOnly = true;
      input.disabled = true;
      input.tabIndex = -1;
      form.dataset.resultsImeMode = "closing-keyboard";
      form.style.display = "none";

      moveFocusToResults();
      hideVirtualKeyboard();

      if (revealTimer !== null) window.clearTimeout(revealTimer);
      revealTimer = window.setTimeout(showComposerAsSafeLauncher, INITIAL_COMPOSER_HIDE_MS);
    };

    const onFeedScroll = () => {
      if (!activeResults || composerActivatedByUser || performance.now() >= lockedUntil) return;
      if (feedScrollFrame !== null) return;

      feedScrollFrame = requestAnimationFrame(() => {
        feedScrollFrame = null;
        if (!activeResults || composerActivatedByUser || performance.now() >= lockedUntil) return;
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
        restoreComposerFully();
        return;
      }

      if (results === activeResults) return;

      activeResults = results;
      composerActivatedByUser = false;
      lockedUntil = performance.now() + INITIAL_RESULTS_LOCK_MS;
      clearTimers();
      attachFeedLock();
      guardComposerForResults();

      timers = RESULT_SETTLE_DELAYS.map(delay => window.setTimeout(() => {
        if (!activeResults || composerActivatedByUser) return;
        moveFocusToResults();
        hideVirtualKeyboard();
        alignResultsToFeedTop();
      }, delay));
    };

    const onViewportChange = () => {
      if (!activeResults || composerActivatedByUser || performance.now() >= lockedUntil) return;
      requestAnimationFrame(() => {
        moveFocusToResults();
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
      restoreComposerFully();
    };
  }, []);

  return null;
}
