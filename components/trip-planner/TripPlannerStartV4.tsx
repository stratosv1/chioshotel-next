"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
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

function detectSuccessfulEmail() {
  const successText = Array.from(document.querySelectorAll("p")).find((node) =>
    node.textContent?.includes("Το πρόγραμμα στάλθηκε στο"),
  );

  if (!(successText instanceof HTMLElement)) return false;

  const successBox = successText.parentElement;
  const sentContainer = successBox?.parentElement;
  if (!(sentContainer instanceof HTMLElement)) return true;

  const accommodationBlock = sentContainer.children.item(1);
  if (accommodationBlock instanceof HTMLElement) {
    accommodationBlock.dataset.tripPlannerInlineAccommodation = "true";
  }

  return true;
}

function AccommodationModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-[#261d17]/60 p-3 backdrop-blur-[3px] sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="trip-planner-stay-title"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="relative max-h-[92svh] w-full max-w-[720px] overflow-y-auto rounded-[26px] border border-white/20 bg-[#fffdf9] shadow-[0_30px_90px_rgba(31,22,16,.35)]">
        <div className="relative h-[230px] overflow-hidden bg-[#554334] sm:h-[275px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/rooms/DSC07867-1-v2.webp"
            alt="Voulamandis House στον Κάμπο της Χίου"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#38291f]/90 via-[#38291f]/10 to-transparent" />

          <button
            type="button"
            onClick={onClose}
            aria-label="Κλείσιμο"
            className="absolute right-4 top-4 flex h-12 w-12 items-center justify-center rounded-full border border-white/60 bg-[#fffdf9]/95 text-[28px] font-light leading-none text-[#59483b] shadow-lg backdrop-blur transition hover:bg-white"
          >
            ×
          </button>

          <div className="absolute bottom-5 left-5 right-5 text-white sm:bottom-6 sm:left-7 sm:right-7">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-white/80 sm:text-[12px]">
              Voulamandis House · Κάμπος Χίου
            </p>
            <h2 id="trip-planner-stay-title" className="mt-1.5 max-w-[590px] font-serif text-[32px] font-bold leading-[1.04] sm:text-[42px]">
              Η ήρεμη βάση για το ταξίδι σου στη Χίο
            </h2>
          </div>
        </div>

        <div className="bg-[#544233] px-5 py-4 text-white sm:px-7">
          <div className="flex flex-wrap gap-2 text-[13px] font-extrabold sm:text-[14px]">
            <span className="rounded-full bg-white/10 px-3 py-1.5">🌿 Ήρεμος Κάμπος</span>
            <span className="rounded-full bg-white/10 px-3 py-1.5">🍊 Πρωινό στον κήπο</span>
            <span className="rounded-full bg-white/10 px-3 py-1.5">🎁 -10% direct</span>
          </div>
        </div>

        <div className="px-5 py-6 sm:px-7 sm:py-7">
          <div className="rounded-[20px] border border-[#cbd5b8] bg-[#eef3e7] p-4 text-center">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[#74805a] text-[21px] font-black text-white">✓</div>
            <p className="mt-2 text-[16px] font-extrabold text-[#4f5d40]">Το προσωπικό σου Trip Plan στάλθηκε</p>
          </div>

          <h3 className="mt-5 font-serif text-[29px] font-bold leading-[1.08] text-[#302720] sm:text-[34px]">
            Συνέχισε με τη διαμονή σου
          </h3>
          <p className="mt-2 text-[15px] font-bold leading-6 text-[#6c6057] sm:text-[16px] sm:leading-7">
            Δες άμεσα ποιο δωμάτιο είναι διαθέσιμο και ταιριάζει στο ταξίδι σου ή μίλησε απευθείας μαζί μας.
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <a
              href="/ai-assistant/?lang=el"
              className="flex min-h-[60px] items-center justify-center rounded-2xl bg-[#687451] px-5 text-center text-[16px] font-extrabold text-white shadow-[0_10px_24px_rgba(88,101,65,.22)] transition hover:bg-[#596544]"
            >
              Δες διαθεσιμότητα · AI Room Finder
            </a>
            <a
              href="https://wa.me/306944474226"
              target="_blank"
              rel="noreferrer"
              className="flex min-h-[60px] items-center justify-center rounded-2xl border-2 border-[#76977c] bg-[#f5faf3] px-5 text-center text-[16px] font-extrabold text-[#45604b] transition hover:bg-[#eaf4e7]"
            >
              WhatsApp με τη reception
            </a>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="mt-4 w-full rounded-xl py-2.5 text-[14px] font-extrabold text-[#7c6d61] transition hover:bg-[#f4efe8]"
          >
            Όχι τώρα — συνέχισε στο Trip Plan
          </button>
        </div>
      </div>
    </div>
  );
}

export default function TripPlannerStartV4() {
  const [showAccommodationModal, setShowAccommodationModal] = useState(false);
  const modalShownRef = useRef(false);

  useEffect(() => {
    const scan = () => {
      markPlaceCards();

      if (!modalShownRef.current && detectSuccessfulEmail()) {
        modalShownRef.current = true;
        setShowAccommodationModal(true);
      }
    };

    let frame = window.requestAnimationFrame(scan);
    const observer = new MutationObserver(() => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(scan);
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    if (!showAccommodationModal) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setShowAccommodationModal(false);
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [showAccommodationModal]);

  return (
    <>
      <TripPlannerStartV3 />
      {showAccommodationModal && typeof document !== "undefined"
        ? createPortal(<AccommodationModal onClose={() => setShowAccommodationModal(false)} />, document.body)
        : null}
      <style jsx global>{`
        [data-trip-planner-inline-accommodation="true"] {
          display: none !important;
        }

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
