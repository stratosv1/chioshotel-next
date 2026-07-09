"use client";

import { useEffect } from "react";

function getCarouselTrack(arrow: HTMLElement) {
  const wrapper = arrow.parentElement;

  if (!wrapper) {
    return null;
  }

  return wrapper.querySelector<HTMLElement>(
    "[data-carousel-track='true'], .overflow-x-auto, [class*='overflow-x-auto']",
  );
}

export function CarouselArrowHydrator() {
  useEffect(() => {
    const cleanups = new WeakMap<HTMLElement, () => void>();

    function hydrateArrows() {
      const arrows = Array.from(document.querySelectorAll<HTMLElement>("div"))
        .filter((element) => element.textContent?.trim() === "→")
        .filter((element) => Boolean(getCarouselTrack(element)));

      for (const arrow of arrows) {
        if (arrow.dataset.carouselNextReady === "true") {
          continue;
        }

        arrow.dataset.carouselNextReady = "true";
        arrow.style.pointerEvents = "auto";
        arrow.style.cursor = "pointer";
        arrow.setAttribute("role", "button");
        arrow.setAttribute("tabindex", "0");
        arrow.setAttribute("aria-label", "Next carousel items");
        arrow.removeAttribute("aria-hidden");

        const goNext = () => {
          const track = getCarouselTrack(arrow);

          if (!track) {
            return;
          }

          const scrollAmount = Math.max(track.clientWidth * 0.82, 260);
          track.scrollBy({ left: scrollAmount, behavior: "smooth" });
        };

        const handleKeyDown = (event: KeyboardEvent) => {
          if (event.key !== "Enter" && event.key !== " ") {
            return;
          }

          event.preventDefault();
          goNext();
        };

        arrow.addEventListener("click", goNext);
        arrow.addEventListener("keydown", handleKeyDown);

        cleanups.set(arrow, () => {
          arrow.removeEventListener("click", goNext);
          arrow.removeEventListener("keydown", handleKeyDown);
        });
      }
    }

    hydrateArrows();

    const observer = new MutationObserver(() => {
      hydrateArrows();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      const readyArrows = Array.from(
        document.querySelectorAll<HTMLElement>("[data-carousel-next-ready='true']"),
      );

      for (const arrow of readyArrows) {
        cleanups.get(arrow)?.();
      }
    };
  }, []);

  return null;
}
