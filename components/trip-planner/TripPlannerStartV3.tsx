"use client";

import { useEffect } from "react";
import TripPlannerStartV2 from "@/components/trip-planner/TripPlannerStartV2";
import { beaches } from "@/content/trip-planner";
import type { BeachMaster } from "@/content/trip-planner/beaches-source";

const SHARP_BEACH_IMAGES: Record<string, string> = {
  "Μερσινίδι": "https://www.chios.gr/images/beaches-pages/mersinidi/mersinidi-1.jpg",
  "Γιόσωνας": "https://www.chios.gr/images/beaches-pages/giosonas/giosonas-1.jpg",
  "Όρμος Λω": "https://www.chios.gr/images/beaches-pages/ormos-lo/ormos-lo.jpg",
  "Απόθικα": "https://www.chios.gr/images/beaches-pages/apothika/apothika-1.jpg",
};

const beachByName = new Map(beaches.map((beach) => [beach.name, beach]));

function familyLabel(beach: BeachMaster) {
  if (beach.familyNote) return beach.familyNote;
  if (beach.familyFit === "excellent") return "Πολύ καλή επιλογή για οικογένειες.";
  if (beach.familyFit === "yes") return "Καλή επιλογή για οικογένειες.";
  if (beach.familyFit === "yes-with-caution") return "Κατάλληλη για οικογένειες, με λίγη περισσότερη προσοχή.";
  if (beach.familyFit === "older-children") return "Ταιριάζει περισσότερο σε οικογένειες με μεγαλύτερα παιδιά.";
  if (beach.familyFit === "not-recommended") return "Δεν είναι από τις πιο εύκολες επιλογές για μικρά παιδιά.";
  return null;
}

function buildBeachDetails(beach: BeachMaster) {
  const rows: Array<{ label: string; value: string }> = [];

  if (beach.surface?.length) rows.push({ label: "Ακτή", value: beach.surface.join(", ") });
  if (beach.depth) rows.push({ label: "Νερά", value: beach.depth });
  if (beach.organization) rows.push({ label: "Οργάνωση", value: beach.organization });
  if (beach.amenities?.length) rows.push({ label: "Παροχές", value: beach.amenities.join(", ") });
  if (beach.access?.length) rows.push({ label: "Πρόσβαση", value: beach.access.join(" · ") });
  if (beach.shade) rows.push({ label: "Σκιά", value: beach.shade });
  if (beach.bestTime) rows.push({ label: "Καλύτερη ώρα", value: beach.bestTime });
  if (beach.recommendedDuration) rows.push({ label: "Χρόνος", value: beach.recommendedDuration });

  const family = familyLabel(beach);
  if (family) rows.push({ label: "Οικογένειες", value: family });
  if (beach.tip) rows.push({ label: "Tip", value: beach.tip });

  return rows;
}

function findBeachCard(button: HTMLButtonElement) {
  const heading = Array.from(button.querySelectorAll("div")).find((node) => {
    const text = node.textContent?.trim();
    return text ? beachByName.has(text) : false;
  });

  if (!heading) return null;
  const name = heading.textContent?.trim();
  if (!name) return null;

  const beach = beachByName.get(name);
  if (!beach) return null;

  return { beach, heading };
}

function improveWeatherDisclosure(button: HTMLButtonElement) {
  const summaries = Array.from(button.querySelectorAll("summary"));
  const weatherSummary = summaries.find((summary) => summary.textContent?.trim() === "Γιατί αυτή η πρόταση;");
  if (!(weatherSummary instanceof HTMLElement)) return;

  const details = weatherSummary.parentElement;
  if (!(details instanceof HTMLDetailsElement)) return;

  details.dataset.tripPlannerWeatherDetails = "true";
  weatherSummary.dataset.tripPlannerDisclosureSummary = "true";
}

function addBeachDetails(button: HTMLButtonElement, beach: BeachMaster) {
  if (button.dataset.beachDetailsReady === "true") return;

  const content = Array.from(button.children).find((node) =>
    node instanceof HTMLDivElement && node.className.includes("p-3.5"),
  );
  if (!(content instanceof HTMLDivElement)) return;

  const rows = buildBeachDetails(beach);
  if (!rows.length) return;

  const details = document.createElement("details");
  details.className = "trip-planner-beach-details";
  details.dataset.tripPlannerBeachDetails = "true";

  const summary = document.createElement("summary");
  summary.dataset.tripPlannerDisclosureSummary = "true";
  summary.textContent = "Λεπτομέρειες παραλίας";
  details.appendChild(summary);

  const body = document.createElement("div");
  body.className = "trip-planner-beach-details-body";

  rows.forEach(({ label, value }) => {
    const row = document.createElement("p");
    row.className = "trip-planner-beach-detail-row";
    const strong = document.createElement("strong");
    strong.textContent = `${label}: `;
    row.appendChild(strong);
    row.appendChild(document.createTextNode(value));
    body.appendChild(row);
  });

  details.appendChild(body);
  details.addEventListener("click", (event) => event.stopPropagation());
  details.addEventListener("keydown", (event) => event.stopPropagation());
  content.appendChild(details);
  button.dataset.beachDetailsReady = "true";
}

function replaceBlurryImage(button: HTMLButtonElement, beachName: string) {
  const sharpImage = SHARP_BEACH_IMAGES[beachName];
  if (!sharpImage || button.dataset.sharpBeachImage === sharpImage) return;

  const imageArea = button.firstElementChild;
  if (!(imageArea instanceof HTMLDivElement)) return;

  imageArea.querySelectorAll("img").forEach((image) => {
    image.src = sharpImage;
    image.removeAttribute("srcset");
  });

  button.dataset.sharpBeachImage = sharpImage;
}

function enhanceBeachCards() {
  document.querySelectorAll<HTMLButtonElement>('button[aria-pressed]').forEach((button) => {
    const match = findBeachCard(button);
    if (!match) return;

    button.dataset.tripPlannerBeachCard = "true";
    improveWeatherDisclosure(button);
    addBeachDetails(button, match.beach);
    replaceBlurryImage(button, match.beach.name);
  });
}

export default function TripPlannerStartV3() {
  useEffect(() => {
    let frame = window.requestAnimationFrame(enhanceBeachCards);
    const observer = new MutationObserver(() => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(enhanceBeachCards);
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <>
      <TripPlannerStartV2 />
      <style jsx global>{`
        [data-trip-planner-beach-card="true"] [data-trip-planner-disclosure-summary="true"] {
          list-style: none;
          position: relative;
          display: flex;
          min-height: 44px;
          align-items: center;
          padding: 10px 34px 10px 0;
          color: #4f443a;
          font-size: 14px;
          font-weight: 700;
          line-height: 1.35;
          cursor: pointer;
        }

        [data-trip-planner-beach-card="true"] [data-trip-planner-disclosure-summary="true"]::-webkit-details-marker {
          display: none;
        }

        [data-trip-planner-beach-card="true"] [data-trip-planner-disclosure-summary="true"]::after {
          content: "+";
          position: absolute;
          right: 2px;
          top: 50%;
          width: 26px;
          height: 26px;
          transform: translateY(-50%);
          border: 1px solid #ddd4c8;
          border-radius: 999px;
          background: #fffdf9;
          color: #8d765f;
          font-size: 18px;
          font-weight: 500;
          line-height: 23px;
          text-align: center;
        }

        [data-trip-planner-beach-card="true"] details[open] > [data-trip-planner-disclosure-summary="true"]::after {
          content: "−";
        }

        [data-trip-planner-weather-details="true"] {
          margin-top: 8px !important;
          padding-top: 6px !important;
          border-top-color: #e3dbd0 !important;
          color: #64594f !important;
          font-size: 13px !important;
          line-height: 1.55 !important;
        }

        [data-trip-planner-weather-details="true"] > div {
          margin-top: 8px !important;
          gap: 6px 14px !important;
          line-height: 1.45 !important;
        }

        [data-trip-planner-weather-details="true"] > p {
          margin-top: 9px !important;
          color: #7f7469 !important;
          font-size: 11px !important;
          line-height: 1.45 !important;
        }

        .trip-planner-beach-details {
          margin-top: 10px;
          padding-top: 7px;
          border-top: 1px solid #e3dbd0;
          color: #655b52;
        }

        .trip-planner-beach-details-body {
          display: grid;
          gap: 8px;
          padding: 4px 0 5px;
          font-size: 13px;
          line-height: 1.5;
        }

        .trip-planner-beach-detail-row {
          margin: 0;
        }

        .trip-planner-beach-detail-row strong {
          color: #4f453c;
          font-weight: 700;
        }

        @media (max-width: 767px) {
          [data-trip-planner-beach-card="true"] {
            width: 82vw !important;
            max-width: 340px !important;
          }

          [data-trip-planner-beach-card="true"] > div:first-child {
            height: 196px !important;
          }

          [data-trip-planner-beach-card="true"] > div:nth-child(2) {
            padding: 14px 14px 13px !important;
          }

          [data-trip-planner-beach-card="true"] > div:nth-child(2) > div:first-child {
            font-size: 22px !important;
            line-height: 1.2 !important;
          }

          [data-trip-planner-beach-card="true"] > div:nth-child(2) > div:nth-child(2) {
            margin-top: 4px !important;
            color: #756b63 !important;
            font-size: 13px !important;
            line-height: 1.4 !important;
          }

          [data-trip-planner-beach-card="true"] > div:nth-child(2) > div:nth-child(3) {
            margin-top: 12px !important;
            padding: 13px 13px 11px !important;
            border-radius: 14px !important;
          }

          [data-trip-planner-beach-card="true"] > div:nth-child(2) > div:nth-child(3) > div:first-child span {
            font-size: 12px !important;
          }

          [data-trip-planner-beach-card="true"] > div:nth-child(2) > div:nth-child(3) > div:nth-child(2) {
            margin-top: 10px !important;
            column-gap: 16px !important;
            row-gap: 8px !important;
            color: #5f564e !important;
            font-size: 13px !important;
          }

          [data-trip-planner-beach-card="true"] > div:nth-child(2) > div:nth-child(3) > p {
            margin-top: 9px !important;
            color: #57704f !important;
            font-size: 12px !important;
            line-height: 1.45 !important;
          }
        }
      `}</style>
    </>
  );
}
