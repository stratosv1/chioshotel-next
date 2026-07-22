"use client";

import { useEffect } from "react";

const COMPOSER_GAP_PX = 14;

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

function visibleComposer(): HTMLElement | null {
  const composer = document.querySelector<HTMLElement>(
    '[data-ai-chat-composer="persistent"]',
  );
  return composer?.offsetParent !== null ? composer : null;
}

function latestVisibleConversationItem(): HTMLElement | null {
  const feed = document.querySelector<HTMLElement>(
    '[data-ai-conversation-feed="true"]',
  );
  if (!feed) return null;

  const items = Array.from(feed.children).reverse();
  return (
    items.find(
      (item): item is HTMLElement =>
        item instanceof HTMLElement && item.offsetParent !== null,
    ) || null
  );
}

function alignLatestConversationItem() {
  if (hasVisibleDialog()) return;

  const latestItem = latestVisibleConversationItem();
  if (!latestItem) return;

  const focusedComposer = focusedChatComposerInput();
  const composer = visibleComposer();
  const visualViewport = window.visualViewport;
  const viewportTop = visualViewport?.offsetTop ?? 0;
  const viewportBottom =
    viewportTop + (visualViewport?.height ?? window.innerHeight);
  const composerTop = composer?.getBoundingClientRect().top ?? viewportBottom;
  const desiredBottom = composerTop - COMPOSER_GAP_PX;
  const availableHeight = Math.max(
    0,
    desiredBottom - viewportTop - COMPOSER_GAP_PX,
  );
  const itemRect = latestItem.getBoundingClientRect();

  const delta =
    itemRect.height > availableHeight
      ? itemRect.top - (viewportTop + COMPOSER_GAP_PX)
      : itemRect.bottom - desiredBottom;

  if (Math.abs(delta) > 2) {
    window.scrollBy({ top: delta, left: 0, behavior: "auto" });
  }

  focusedComposer?.focus({ preventScroll: true });
}

export function AiConversationAutoScroll() {
  useEffect(() => {
    const conversation = document.querySelector<HTMLElement>("main");
    const feed = document.querySelector<HTMLElement>(
      '[data-ai-conversation-feed="true"]',
    );
    if (!conversation) return;

    let animationFrame = 0;
    let settleTimer = 0;

    const scheduleAlignment = () => {
      window.cancelAnimationFrame(animationFrame);
      window.clearTimeout(settleTimer);

      animationFrame = window.requestAnimationFrame(() => {
        alignLatestConversationItem();
        settleTimer = window.setTimeout(alignLatestConversationItem, 160);
      });
    };

    const mutationObserver = new MutationObserver((mutations) => {
      const conversationChanged = mutations.some(
        (mutation) =>
          mutation.type === "childList" &&
          (mutation.addedNodes.length > 0 || mutation.removedNodes.length > 0),
      );

      if (conversationChanged) scheduleAlignment();
    });

    const resizeObserver = feed
      ? new ResizeObserver(scheduleAlignment)
      : null;

    const handleComposerFocus = (event: FocusEvent) => {
      const target = event.target;
      if (
        target instanceof HTMLInputElement &&
        target.closest('[data-ai-chat-composer="persistent"]')
      ) {
        scheduleAlignment();
      }
    };

    const handleViewportChange = () => {
      if (focusedChatComposerInput()) scheduleAlignment();
    };

    mutationObserver.observe(conversation, {
      childList: true,
      subtree: true,
    });
    if (feed && resizeObserver) resizeObserver.observe(feed);
    document.addEventListener("focusin", handleComposerFocus);
    window.visualViewport?.addEventListener("resize", handleViewportChange);
    window.visualViewport?.addEventListener("scroll", handleViewportChange);

    scheduleAlignment();

    return () => {
      mutationObserver.disconnect();
      resizeObserver?.disconnect();
      document.removeEventListener("focusin", handleComposerFocus);
      window.visualViewport?.removeEventListener("resize", handleViewportChange);
      window.visualViewport?.removeEventListener("scroll", handleViewportChange);
      window.cancelAnimationFrame(animationFrame);
      window.clearTimeout(settleTimer);
    };
  }, []);

  return null;
}
