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

function visibleChatScroller(): HTMLElement | null {
  const scroller = document.querySelector<HTMLElement>(
    '[data-ai-chat-scroll="true"]',
  );
  return scroller?.offsetParent !== null ? scroller : null;
}

function syncVisualViewportHeight() {
  const viewportHeight =
    window.visualViewport?.height ?? window.innerHeight;

  document.documentElement.style.setProperty(
    "--ai-visual-height",
    `${Math.round(viewportHeight)}px`,
  );
}

function scrollConversationToEnd() {
  if (hasVisibleDialog()) return;

  const scroller = visibleChatScroller();
  if (!scroller) return;

  scroller.scrollTop = scroller.scrollHeight;
  focusedChatComposerInput()?.focus({ preventScroll: true });
}

export function AiConversationAutoScroll() {
  useEffect(() => {
    const conversation = document.querySelector<HTMLElement>("main");
    const feed = document.querySelector<HTMLElement>(
      '[data-ai-conversation-feed="true"]',
    );
    const scroller = visibleChatScroller();
    if (!conversation || !feed || !scroller) return;

    let animationFrame = 0;
    let settleTimer = 0;
    const previousBodyOverflow = document.body.style.overflow;
    const previousBodyOverscroll = document.body.style.overscrollBehavior;

    document.body.style.overflow = "hidden";
    document.body.style.overscrollBehavior = "none";

    const scheduleScroll = () => {
      window.cancelAnimationFrame(animationFrame);
      window.clearTimeout(settleTimer);

      animationFrame = window.requestAnimationFrame(() => {
        scrollConversationToEnd();
        settleTimer = window.setTimeout(scrollConversationToEnd, 120);
      });
    };

    const syncViewportAndScroll = () => {
      syncVisualViewportHeight();
      scheduleScroll();
    };

    const mutationObserver = new MutationObserver((mutations) => {
      const conversationChanged = mutations.some(
        (mutation) =>
          mutation.type === "childList" &&
          (mutation.addedNodes.length > 0 || mutation.removedNodes.length > 0),
      );

      if (conversationChanged) scheduleScroll();
    });

    const resizeObserver = new ResizeObserver(scheduleScroll);

    const handleComposerFocus = (event: FocusEvent) => {
      const target = event.target;
      if (
        target instanceof HTMLInputElement &&
        target.closest('[data-ai-chat-composer="persistent"]')
      ) {
        syncViewportAndScroll();
      }
    };

    mutationObserver.observe(feed, {
      childList: true,
      subtree: true,
    });
    resizeObserver.observe(feed);
    resizeObserver.observe(scroller);
    document.addEventListener("focusin", handleComposerFocus);
    window.addEventListener("resize", syncViewportAndScroll);
    window.addEventListener("orientationchange", syncViewportAndScroll);
    window.visualViewport?.addEventListener("resize", syncViewportAndScroll);
    window.visualViewport?.addEventListener("scroll", syncViewportAndScroll);

    syncViewportAndScroll();

    return () => {
      mutationObserver.disconnect();
      resizeObserver.disconnect();
      document.removeEventListener("focusin", handleComposerFocus);
      window.removeEventListener("resize", syncViewportAndScroll);
      window.removeEventListener("orientationchange", syncViewportAndScroll);
      window.visualViewport?.removeEventListener("resize", syncViewportAndScroll);
      window.visualViewport?.removeEventListener("scroll", syncViewportAndScroll);
      window.cancelAnimationFrame(animationFrame);
      window.clearTimeout(settleTimer);
      document.body.style.overflow = previousBodyOverflow;
      document.body.style.overscrollBehavior = previousBodyOverscroll;
      document.documentElement.style.removeProperty("--ai-visual-height");
    };
  }, []);

  return null;
}
