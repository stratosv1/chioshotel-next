"use client";

import { useEffect } from "react";

function isScrollableTrack(element: HTMLElement) {
  return element.scrollWidth > element.clientWidth + 8;
}

function getCarouselTrack(arrow: HTMLElement) {
  const wrapper = arrow.parentElement;
  if (!wrapper) return null;

  const directTrack = wrapper.querySelector<HTMLElement>(
    "[data-carousel-track='true'], .overflow-x-auto, [class*='overflow-x-auto']",
  );

  if (directTrack && isScrollableTrack(directTrack)) {
    return directTrack;
  }

  const parentTrack = arrow.closest<HTMLElement>("section, article, div")?.querySelector<HTMLElement>(
    "[data-carousel-track='true'], .overflow-x-auto, [class*='overflow-x-auto']",
  );

  if (parentTrack && isScrollableTrack(parentTrack)) {
    return parentTrack;
  }

  return directTrack || parentTrack || null;
}

function getScrollAmount(track: HTMLElement) {
  const firstCard = track.querySelector<HTMLElement>("article, li, [data-carousel-card='true'], [class*='snap-']");
  if (!firstCard) return Math.max(track.clientWidth * 0.82, 260);

  const styles = window.getComputedStyle(track);
  const gap = Number.parseFloat(styles.columnGap || styles.gap || "0") || 0;
  return Math.max(firstCard.offsetWidth + gap, track.clientWidth * 0.72, 240);
}

function isNextArrow(element: HTMLElement) {
  const label = element.getAttribute("aria-label")?.toLowerCase() || "";
  const text = element.textContent?.trim() || "";
  return text === "→" || text === "›" || label.includes("next") || label.includes("επόμενο") || label.includes("suivant") || label.includes("nächst") || label.includes("siguiente");
}

export function CarouselArrowHydrator() {
  useEffect(() => {
    const cleanups = new WeakMap<HTMLElement, () => void>();

    function hydrateArrows() {
      const arrows = Array.from(document.querySelectorAll<HTMLElement>("button, div, a"))
        .filter(isNextArrow)
        .filter((element) => Boolean(getCarouselTrack(element)));

      for (const arrow of arrows) {
        if (arrow.dataset.carouselNextReady === "true") continue;

        arrow.dataset.carouselNextReady = "true";
        arrow.style.pointerEvents = "auto";
        arrow.style.cursor = "pointer";

        if (arrow.tagName !== "BUTTON" && arrow.tagName !== "A") {
          arrow.setAttribute("role", "button");
          arrow.setAttribute("tabindex", "0");
        }

        if (!arrow.getAttribute("aria-label")) {
          arrow.setAttribute("aria-label", "Next carousel items");
        }

        arrow.removeAttribute("aria-hidden");

        const goNext = (event?: Event) => {
          const track = getCarouselTrack(arrow);
          if (!track) return;

          event?.preventDefault();
          track.scrollBy({ left: getScrollAmount(track), behavior: "smooth" });
        };

        const handleClick = (event: MouseEvent) => goNext(event);
        const handleKeyDown = (event: KeyboardEvent) => {
          if (event.key !== "Enter" && event.key !== " ") return;
          goNext(event);
        };

        arrow.addEventListener("click", handleClick);
        arrow.addEventListener("keydown", handleKeyDown);
        cleanups.set(arrow, () => {
          arrow.removeEventListener("click", handleClick);
          arrow.removeEventListener("keydown", handleKeyDown);
        });
      }
    }

    hydrateArrows();
    const observer = new MutationObserver(() => hydrateArrows());
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      const readyArrows = Array.from(document.querySelectorAll<HTMLElement>("[data-carousel-next-ready='true']"));
      for (const arrow of readyArrows) cleanups.get(arrow)?.();
    };
  }, []);

  return null;
}
