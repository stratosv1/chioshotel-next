"use client";

import { useEffect } from "react";

type NavigatorWithVirtualKeyboard = Navigator & {
  virtualKeyboard?: {
    show?: () => void;
  };
};

export function RoomFinderAutoFocus() {
  useEffect(() => {
    let previousDisabled: boolean | null = null;
    let focusFrame: number | null = null;

    const getInput = () => document.getElementById("room-finder-message") as HTMLInputElement | null;

    const focusInput = () => {
      const input = getInput();
      if (!input || input.disabled || document.visibilityState !== "visible") return;

      if (focusFrame !== null) cancelAnimationFrame(focusFrame);
      focusFrame = requestAnimationFrame(() => {
        focusFrame = null;
        if (input.disabled || document.visibilityState !== "visible") return;

        const virtualKeyboard = (navigator as NavigatorWithVirtualKeyboard).virtualKeyboard;
        const canRequestVirtualKeyboard = typeof virtualKeyboard?.show === "function";
        const previousKeyboardPolicy = input.getAttribute("virtualkeyboardpolicy");

        if (canRequestVirtualKeyboard) {
          input.setAttribute("virtualkeyboardpolicy", "manual");
        }

        input.focus({ preventScroll: true });
        const caret = input.value.length;
        try {
          input.setSelectionRange(caret, caret);
        } catch {
          // Some input modes do not support selection ranges.
        }

        if (canRequestVirtualKeyboard) {
          try {
            virtualKeyboard?.show?.();
          } catch {
            // The browser remains free to reject an automatic software-keyboard request.
          } finally {
            requestAnimationFrame(() => {
              if (previousKeyboardPolicy === null) {
                input.removeAttribute("virtualkeyboardpolicy");
              } else {
                input.setAttribute("virtualkeyboardpolicy", previousKeyboardPolicy);
              }
            });
          }
        }
      });
    };

    const syncInputState = () => {
      const input = getInput();
      if (!input) return;

      const disabled = input.disabled;
      if (previousDisabled === true && disabled === false) {
        focusInput();
      }
      previousDisabled = disabled;
    };

    const observer = new MutationObserver(syncInputState);
    observer.observe(document.body, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ["disabled"],
    });

    syncInputState();

    return () => {
      observer.disconnect();
      if (focusFrame !== null) cancelAnimationFrame(focusFrame);
    };
  }, []);

  return null;
}
