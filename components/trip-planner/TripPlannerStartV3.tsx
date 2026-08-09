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

function addBeachDetails(button: HTMLButtonElement, beach: BeachMaster) {
  if (button.dataset.beachDetailsReady === "true") return;

  const content = Array.from(button.children).find((node) =>
    node instanceof HTMLDivElement && node.className.includes("p-3.5"),
  );
  if (!(content instanceof HTMLDivElement)) return;

  const rows = buildBeachDetails(beach);
  if (!rows.length) return;

  const details = document.createElement("details");
  details.className = "mt-3 border-t border-[#e7dfd5] pt-2 text-[10px] text-[#817367]";
  details.dataset.tripPlannerBeachDetails = "true";

  const summary = document.createElement("summary");
  summary.className = "cursor-pointer select-none font-semibold text-[#776859]";
  summary.textContent = "Λεπτομέρειες παραλίας";
  details.appendChild(summary);

  const body = document.createElement("div");
  body.className = "mt-2 space-y-1.5 leading-4";

  rows.forEach(({ label, value }) => {
    const row = document.createElement("p");
    const strong = document.createElement("strong");
    strong.className = "font-semibold text-[#65584c]";
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

  const images = imageArea.querySelectorAll("img");
  images.forEach((image) => {
    image.src = sharpImage;
    image.removeAttribute("srcset");
  });

  button.dataset.sharpBeachImage = sharpImage;
}

function enhanceBeachCards() {
  document.querySelectorAll<HTMLButtonElement>('button[aria-pressed]').forEach((button) => {
    const match = findBeachCard(button);
    if (!match) return;

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

  return <TripPlannerStartV2 />;
}
