"use client";

import { useEffect } from "react";

function hasVisibleDialog() {
  return Array.from(
    document.querySelectorAll<HTMLElement>('[role="dialog"][aria-modal="true"]'),
  ).some((dialog) => dialog.offsetParent !== null);
}

function focusedChatComposerInput(): HTMLInputElement | null {
  const activeElement = document.activeElement;
  if (
    activeElement instanceof HTMLInputElement &&
    activeElement.closest('[data-ai-chat-composer="persistent"]')
  ) {
    return activeElement;
  }

  return null;
}

function scrollConversationToEnd() {
  if (hasVisibleDialog()) return;

  const pageHeight = Math.max(
    document.body.scrollHeight,
    document.documentElement.scrollHeight,
  );
  const focusedComposer = focusedChatComposerInput();

  if (focusedComposer) {
    const scrollingElement = document.scrollingElement;
    if (scrollingElement) {
      scrollingElement.scrollTop = pageHeight;
    } else {
      window.scrollTo(0, pageHeight);
    }

    focusedComposer.focus({ preventScroll: true });
    return;
  }

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  window.scrollTo({
    top: pageHeight,
    behavior: reducedMotion ? "auto" : "smooth",
  });
}

export function AiConversationAutoScroll() {
  useEffect(() => {
    const conversation = document.querySelector<HTMLElement>("main");
    if (!conversation) return;

    let animationFrame = 0;
    let settleTimer = 0;

    const scheduleScroll = () => {
      window.cancelAnimationFrame(animationFrame);
      window.clearTimeout(settleTimer);

      animationFrame = window.requestAnimationFrame(() => {
        scrollConversationToEnd();
        settleTimer = window.setTimeout(scrollConversationToEnd, 180);
      });
    };

    const observer = new MutationObserver((mutations) => {
      const conversationChanged = mutations.some(
        (mutation) =>
          mutation.type === "childList" &&
          (mutation.addedNodes.length > 0 || mutation.removedNodes.length > 0),
      );

      if (conversationChanged) scheduleScroll();
    });

    const handleComposerFocus = (event: FocusEvent) => {
      const target = event.target;
      if (
        target instanceof HTMLInputElement &&
        target.closest('[data-ai-chat-composer="persistent"]')
      ) {
        scheduleScroll();
      }
    };

    const handleViewportResize = () => {
      if (focusedChatComposerInput()) scheduleScroll();
    };

    observer.observe(conversation, {
      childList: true,
      subtree: true,
    });
    document.addEventListener("focusin", handleComposerFocus);
    window.visualViewport?.addEventListener("resize", handleViewportResize);

    return () => {
      observer.disconnect();
      document.removeEventListener("focusin", handleComposerFocus);
      window.visualViewport?.removeEventListener("resize", handleViewportResize);
      window.cancelAnimationFrame(animationFrame);
      window.clearTimeout(settleTimer);
    };
  }, []);

  return null;
}
