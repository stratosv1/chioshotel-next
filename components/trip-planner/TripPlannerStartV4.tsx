"use client";

import { useEffect } from "react";
import TripPlannerStartV3 from "@/components/trip-planner/TripPlannerStartV3";
import { beaches, villages } from "@/content/trip-planner";
import { plannerExtraPlaces } from "@/content/trip-planner/extra-places";

const placeNames = new Set([
  ...beaches.map((item) => item.name),
  ...villages.map((item) => item.name),
  ...plannerExtraPlaces.map((item) => item.name),
]);

function markPlaceCards() {
  document.querySelectorAll<HTMLButtonElement>('button[aria-pressed]').forEach((button) => {
    const title = Array.from(button.querySelectorAll("div")).find((node) => {
      const text = node.textContent?.trim();
      return text ? placeNames.has(text) : false;
    });

    if (!title) return;
    button.dataset.tripPlannerPlaceCard = "true";
  });
}

export default function TripPlannerStartV4() {
  useEffect(() => {
    let frame = window.requestAnimationFrame(markPlaceCards);
    const observer = new MutationObserver(() => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(markPlaceCards);
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <>
      <TripPlannerStartV3 />
      <style jsx global>{`
        [data-trip-planner-place-card="true"] {
          border-radius: 22px !important;
          background: #fff !important;
          box-shadow: 0 12px 30px rgba(65, 48, 36, 0.07) !important;
          transition: transform 300ms ease, box-shadow 300ms ease, border-color 300ms ease !important;
        }

        [data-trip-planner-place-card="true"]:hover {
          border-color: #cdbca8 !important;
          box-shadow: 0 20px 42px rgba(65, 48, 36, 0.12) !important;
        }

        [data-trip-planner-place-card="true"][aria-pressed="true"] {
          border: 2px solid #9ca484 !important;
          background: #fdfdf9 !important;
          box-shadow: 0 18px 40px rgba(84, 88, 65, 0.16) !important;
          outline: 4px solid rgba(156, 164, 132, 0.12) !important;
          outline-offset: 0 !important;
        }

        [data-trip-planner-place-card="true"] > div:first-child {
          height: 214px !important;
        }

        [data-trip-planner-place-card="true"] > div:first-child img {
          transition: transform 700ms ease-out !important;
        }

        [data-trip-planner-place-card="true"]:hover > div:first-child img {
          transform: scale(1.035);
        }

        [data-trip-planner-place-card="true"] > div:nth-child(2) {
          padding: 16px 16px 14px !important;
        }

        [data-trip-planner-place-card="true"] > div:nth-child(2) > div:first-child {
          color: #2e251f !important;
          font-size: 27px !important;
          font-weight: 700 !important;
          line-height: 1.08 !important;
          letter-spacing: -0.025em !important;
        }

        [data-trip-planner-place-card="true"] > div:nth-child(2) > div:nth-child(2) {
          margin-top: 6px !important;
          color: #675c53 !important;
          font-size: 15px !important;
          font-weight: 600 !important;
          line-height: 1.5 !important;
        }

        [data-trip-planner-beach-card="true"] > div:nth-child(2) > div:nth-child(3) {
          margin-top: 16px !important;
          border-color: #ece5db !important;
          border-radius: 16px !important;
          background: #fbfaf7 !important;
          padding: 14px !important;
        }

        [data-trip-planner-beach-card="true"] > div:nth-child(2) > div:nth-child(3) > div:first-child span {
          font-size: 13px !important;
          font-weight: 700 !important;
        }

        [data-trip-planner-beach-card="true"] > div:nth-child(2) > div:nth-child(3) > div:nth-child(2) {
          margin-top: 12px !important;
          column-gap: 18px !important;
          row-gap: 9px !important;
          color: #51473f !important;
          font-size: 14px !important;
          font-weight: 700 !important;
          line-height: 1.45 !important;
        }

        [data-trip-planner-beach-card="true"] > div:nth-child(2) > div:nth-child(3) > p {
          margin-top: 12px !important;
          border-radius: 12px !important;
          padding: 10px 12px !important;
          font-size: 14px !important;
          font-weight: 700 !important;
          line-height: 1.5 !important;
        }

        [data-trip-planner-beach-card="true"] [data-trip-planner-disclosure-summary="true"] {
          min-height: 48px !important;
          color: #51463d !important;
          font-size: 15px !important;
          font-weight: 800 !important;
          line-height: 1.4 !important;
        }

        [data-trip-planner-weather-details="true"] {
          color: #5b5148 !important;
          font-size: 14px !important;
          font-weight: 600 !important;
          line-height: 1.6 !important;
        }

        [data-trip-planner-weather-details="true"] > div {
          gap: 10px 16px !important;
          font-size: 14px !important;
          font-weight: 700 !important;
        }

        [data-trip-planner-weather-details="true"] > p {
          color: #75695f !important;
          font-size: 12px !important;
          font-weight: 600 !important;
          line-height: 1.5 !important;
        }

        .trip-planner-beach-details-body {
          gap: 10px !important;
          border-radius: 12px;
          background: #faf8f4;
          padding: 12px !important;
          color: #5d534b !important;
          font-size: 15px !important;
          font-weight: 600 !important;
          line-height: 1.55 !important;
        }

        .trip-planner-beach-detail-row strong {
          color: #433a33 !important;
          font-weight: 800 !important;
        }

        @media (max-width: 767px) {
          [data-trip-planner-place-card="true"] {
            width: 86vw !important;
            max-width: 360px !important;
          }
        }

        @media (min-width: 768px) {
          [data-trip-planner-place-card="true"] > div:first-child {
            height: 190px !important;
          }

          [data-trip-planner-place-card="true"] > div:nth-child(2) {
            padding: 20px 20px 18px !important;
          }

          [data-trip-planner-place-card="true"] > div:nth-child(2) > div:first-child {
            font-size: 24px !important;
          }
        }
      `}</style>
    </>
  );
}
