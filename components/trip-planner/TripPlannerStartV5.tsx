"use client";

import { useEffect } from "react";
import TripPlannerStartV4 from "@/components/trip-planner/TripPlannerStartV4";

const FULL_IMAGE_CATEGORIES = new Set(["Χωριό", "Αξιοθέατα"]);

const RATING_LABELS: Record<string, string> = {
  "Εξαιρετική σήμερα": "Εξαιρετικές συνθήκες",
  "Καλή σήμερα": "Καλές συνθήκες",
  "Μέτρια σήμερα": "Μέτριες συνθήκες",
  "Δύσκολη σήμερα": "Καλύτερα πιο προστατευμένη παραλία",
  "Όχι ιδανική σήμερα": "Προτίμησε άλλη παραλία",
};

const ALL_RATING_LABELS = new Set([
  ...Object.keys(RATING_LABELS),
  ...Object.values(RATING_LABELS),
]);

type WaveBadge = {
  label: string;
  classes: string;
};

type MarinePayload = {
  ok?: boolean;
  ranked?: Array<{
    name?: string;
    hourly?: Array<{
      breakdown?: {
        waveImpact?: number | null;
      };
    }>;
  }>;
};

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

function waveBadgeForImpact(impact: number): WaveBadge {
  if (impact < 0.15) {
    return {
      label: "〰 Ήρεμη θάλασσα",
      classes: "border-[#cfe0dd] bg-[#edf4f3] text-[#4f6f6b]",
    };
  }
  if (impact < 0.3) {
    return {
      label: "🌊 Μικρό κύμα",
      classes: "border-[#cbdde5] bg-[#edf5f8] text-[#4f6d79]",
    };
  }
  if (impact < 0.5) {
    return {
      label: "🌊🌊 Μέτριο κύμα",
      classes: "border-[#ead5ae] bg-[#fff4df] text-[#866638]",
    };
  }
  return {
    label: "🌊🌊🌊 Έντονο κύμα",
    classes: "border-[#e4c7c0] bg-[#f7e8e4] text-[#8b5148]",
  };
}

function renameConditionLabels() {
  document.querySelectorAll<HTMLElement>('button[aria-pressed] span').forEach((span) => {
    const text = span.textContent?.trim() ?? "";
    const replacement = RATING_LABELS[text];
    if (replacement) span.textContent = replacement;
  });
}

function addWaveBadges(waveByBeach: Map<string, WaveBadge>) {
  if (!waveByBeach.size) return;

  document.querySelectorAll<HTMLButtonElement>('button[aria-pressed]').forEach((button) => {
    if (button.querySelector('[data-trip-planner-wave-badge="true"]')) return;

    const beachName = Array.from(button.querySelectorAll("div"))
      .map((node) => node.textContent?.trim() ?? "")
      .find((text) => waveByBeach.has(text));
    if (!beachName) return;

    const badgeInfo = waveByBeach.get(beachName);
    if (!badgeInfo) return;

    const weatherSummary = Array.from(button.querySelectorAll("summary")).find(
      (summary) => summary.textContent?.trim() === "Γιατί αυτή η πρόταση;",
    );
    const weatherDetails = weatherSummary?.parentElement;
    const weatherBox = weatherDetails?.parentElement;
    if (!(weatherBox instanceof HTMLElement)) return;

    const ratingRow = weatherBox.firstElementChild;
    if (!(ratingRow instanceof HTMLElement)) return;

    const ratingSpan = Array.from(ratingRow.querySelectorAll("span")).find((span) => {
      const text = span.textContent?.trim() ?? "";
      return ALL_RATING_LABELS.has(text);
    });
    if (!(ratingSpan instanceof HTMLElement)) return;

    const badge = document.createElement("span");
    badge.dataset.tripPlannerWaveBadge = "true";
    badge.className = `rounded-full border px-2.5 py-1 text-[10px] font-bold ${badgeInfo.classes}`;
    badge.textContent = badgeInfo.label;
    ratingRow.insertBefore(badge, ratingSpan.nextSibling);
  });
}

function waveMapFromPayload(payload: MarinePayload) {
  const result = new Map<string, WaveBadge>();
  if (!payload.ok || !Array.isArray(payload.ranked)) return result;

  payload.ranked.forEach((beach) => {
    const name = beach.name?.trim();
    if (!name || !Array.isArray(beach.hourly)) return;

    const impacts = beach.hourly
      .map((hour) => hour.breakdown?.waveImpact)
      .filter((value): value is number => typeof value === "number" && Number.isFinite(value));
    if (!impacts.length) return;

    // Use the strongest beach-adjusted wave impact in the visit window so a
    // temporarily rough hour is not hidden by a calmer average.
    result.set(name, waveBadgeForImpact(Math.max(...impacts)));
  });

  return result;
}

export default function TripPlannerStartV5() {
  useEffect(() => {
    let disposed = false;
    let waveByBeach = new Map<string, WaveBadge>();

    const run = () => {
      enhanceCategoryImages();
      renameConditionLabels();
      addWaveBadges(waveByBeach);
    };

    let frame = window.requestAnimationFrame(run);

    fetch("/api/trip-planner/marine")
      .then(async (response) => {
        if (!response.ok) return null;
        return response.json() as Promise<MarinePayload>;
      })
      .then((payload) => {
        if (disposed || !payload) return;
        waveByBeach = waveMapFromPayload(payload);
        run();
      })
      .catch(() => {
        // The existing Trip Planner forecast UI already handles API failures.
      });

    const observer = new MutationObserver(() => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(run);
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      disposed = true;
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

        [data-trip-planner-wave-badge="true"] {
          white-space: nowrap;
        }
      `}</style>
    </>
  );
}
