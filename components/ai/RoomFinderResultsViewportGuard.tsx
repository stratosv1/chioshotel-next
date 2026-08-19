"use client";

import { useEffect } from "react";

const RESULT_SETTLE_DELAYS = [0, 180, 420, 760];

function getComposerInput() {
  return document.getElementById("room-finder-message") as HTMLInputElement | null;
}

function getResultsStart() {
  return document.querySelector<HTMLElement>('[data-room-results-start="true"]');
}

function getFeed() {
  return document.querySelector<HTMLElement>('[role="log"]');
}

function forceCloseMobileKeyboard() {
  const input = getComposerInput();
  if (!input) return;

  input.blur();

  // Android Chrome can keep the IME open even after blur while the visual
  // viewport is resizing. Briefly disabling the composer forces the IME to
  // release focus without changing the user's search state.
  input.disabled = true;
  window.setTimeout(() => {
    if (input.isConnected) input.disabled = false;
  }, 120);
}

function alignResultsToFeedTop() {
  const feed = getFeed();
  const results = getResultsStart();
  if (!feed || !results) return;

  const feedRect = feed.getBoundingClientRect();
  const resultsRect = results.getBoundingClientRect();
  const nextTop = Math.max(0, feed.scrollTop + resultsRect.top - feedRect.top - 4);

  feed.scrollTo({ top: nextTop, behavior: "auto" });
}

export function RoomFinderResultsViewportGuard() {
  useEffect(() => {
    let activeResults: HTMLElement | null = null;
    let timers: number[] = [];

    const clearTimers = () => {
      timers.forEach(timer => window.clearTimeout(timer));
      timers = [];
    };

    const settleResults = () => {
      const results = getResultsStart();
      if (!results) {
        activeResults = null;
        clearTimers();
        return;
      }

      if (results === activeResults) return;
      activeResults = results;
      clearTimers();
      forceCloseMobileKeyboard();

      timers = RESULT_SETTLE_DELAYS.map(delay => window.setTimeout(() => {
        forceCloseMobileKeyboard();
        alignResultsToFeedTop();
      }, delay));
    };

    const observer = new MutationObserver(settleResults);
    observer.observe(document.body, { childList: true, subtree: true });
    settleResults();

    return () => {
      observer.disconnect();
      clearTimers();
    };
  }, []);

  return null;
}
