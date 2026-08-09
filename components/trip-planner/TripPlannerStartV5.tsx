"use client";

import { useEffect } from "react";
import TripPlannerStartV4 from "@/components/trip-planner/TripPlannerStartV4";

const FULL_IMAGE_CATEGORIES = new Set(["Χωριό", "Αξιοθέατα"]);

function enhanceCategoryImages() {
  document.querySelectorAll<HTMLButtonElement>('button[aria-pressed]').forEach((button) => {
    const label = Array.from(button.querySelectorAll("span")).find((node) => {
      const text = node.textContent?.trim();
      return text ? FULL_IMAGE_CATEGORIES.has(text) : false;
    });

    if (!label) return;

    const media = button.firstElementChild;
    if (!(media instanceof HTMLElement)) return;

    const foreground = media.querySelector<HTMLImageElement>('img:not([data-trip-planner-category-background="true"])');
    if (!foreground) return;

    button.dataset.tripPlannerCategoryFullMedia = "true";
    foreground.dataset.tripPlannerCategoryForeground = "true";

    if (!media.querySelector('[data-trip-planner-category-background="true"]')) {
      const background = foreground.cloneNode(true) as HTMLImageElement;
      background.removeAttribute("data-trip-planner-category-foreground");
      background.dataset.tripPlannerCategoryBackground = "true";
      background.alt = "";
      background.setAttribute("aria-hidden", "true");
      media.insertBefore(background, foreground);
    }
  });
}

export default function TripPlannerStartV5() {
  useEffect(() => {
    const run = () => enhanceCategoryImages();
    let frame = window.requestAnimationFrame(run);

    const observer = new MutationObserver(() => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(run);
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <>
      <TripPlannerStartV4 />
      <style jsx global>{`
        [data-trip-planner-category-full-media="true"] > div:first-child {
          position: relative !important;
          isolation: isolate;
          background: #d9d1c7 !important;
        }

        [data-trip-planner-category-background="true"] {
          position: absolute !important;
          inset: -14px !important;
          z-index: 0 !important;
          width: calc(100% + 28px) !important;
          height: calc(100% + 28px) !important;
          max-width: none !important;
          object-fit: cover !important;
          object-position: center center !important;
          opacity: 0.34 !important;
          filter: blur(15px) saturate(0.82) brightness(0.92) !important;
          transform: scale(1.06) !important;
          pointer-events: none !important;
        }

        [data-trip-planner-category-foreground="true"] {
          position: absolute !important;
          inset: 0 !important;
          z-index: 1 !important;
          width: 100% !important;
          height: 100% !important;
          object-fit: contain !important;
          object-position: center center !important;
          transform: none !important;
        }

        [data-trip-planner-category-full-media="true"]:hover [data-trip-planner-category-foreground="true"] {
          transform: none !important;
        }

        [data-trip-planner-category-full-media="true"] > div:first-child > span {
          z-index: 3 !important;
        }
      `}</style>
    </>
  );
}
