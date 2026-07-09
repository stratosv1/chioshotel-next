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
    const arrows = Array.from(document.querySelectorAll<HTMLElement>("div[aria-hidden='true']"))
      .filter((element) => element.textContent?.trim() === "→")
      .filter((element) => Boolean(getCarouselTrack(element)));

    const cleanups: Array<() => void> = [];

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

      cleanups.push(() => {
        arrow.removeEventListener("click", goNext);
        arrow.removeEventListener("keydown", handleKeyDown);
      });
    }

    return () => {
      cleanups.forEach((cleanup) => cleanup());
    };
  }, []);

  return null;
}
