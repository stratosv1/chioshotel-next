"use client";

import { useEffect } from "react";

type Language = "el" | "en" | "de" | "fr" | "it" | "es" | "tr";

const ROOM_WORD: Record<Language, string> = {
  el: "Δωμάτιο", en: "Room", de: "Zimmer", fr: "Chambre", it: "Camera", es: "Habitación", tr: "Oda",
};

const CATEGORY: Record<Language, Record<string, string>> = {
  el: {
    "Economy Double Room": "Οικονομικό δίκλινο δωμάτιο",
    "First Floor Double Room": "Δίκλινο δωμάτιο πρώτου ορόφου",
    "Ground Floor Double Room": "Δίκλινο δωμάτιο ισογείου",
    "Family Apartment": "Οικογενειακό διαμέρισμα",
  },
  en: {},
  de: {
    "Economy Double Room": "Economy-Doppelzimmer",
    "First Floor Double Room": "Doppelzimmer im ersten Stock",
    "Ground Floor Double Room": "Doppelzimmer im Erdgeschoss",
    "Family Apartment": "Familienapartment",
  },
  fr: {
    "Economy Double Room": "Chambre double économique",
    "First Floor Double Room": "Chambre double au premier étage",
    "Ground Floor Double Room": "Chambre double au rez-de-chaussée",
    "Family Apartment": "Appartement familial",
  },
  it: {
    "Economy Double Room": "Camera doppia economy",
    "First Floor Double Room": "Camera doppia al primo piano",
    "Ground Floor Double Room": "Camera doppia al piano terra",
    "Family Apartment": "Appartamento familiare",
  },
  es: {
    "Economy Double Room": "Habitación doble económica",
    "First Floor Double Room": "Habitación doble en primera planta",
    "Ground Floor Double Room": "Habitación doble en planta baja",
    "Family Apartment": "Apartamento familiar",
  },
  tr: {
    "Economy Double Room": "Ekonomik çift kişilik oda",
    "First Floor Double Room": "Birinci kat çift kişilik oda",
    "Ground Floor Double Room": "Zemin kat çift kişilik oda",
    "Family Apartment": "Aile dairesi",
  },
};

function currentLanguage(): Language {
  const requested = new URLSearchParams(window.location.search).get("lang")?.toLowerCase().split("-")[0];
  return (["el", "en", "de", "fr", "it", "es", "tr"] as Language[]).includes(requested as Language)
    ? (requested as Language)
    : "en";
}

function activeRoomModals(): HTMLElement[] {
  const nodes = document.querySelectorAll<HTMLElement>(
    '[role="dialog"][aria-modal="true"], main > div.fixed.inset-0.z-50',
  );
  return Array.from(nodes).filter((node) => node.offsetParent !== null);
}

function forceFullHeroPhoto(modal: HTMLElement) {
  const heroImage = modal.querySelector<HTMLImageElement>("img");
  if (!heroImage) return;

  const heroFrame = heroImage.parentElement as HTMLElement | null;
  if (heroFrame) {
    heroFrame.style.setProperty("background", "#e7e5e4", "important");
    heroFrame.style.setProperty("overflow", "hidden", "important");
    heroFrame.style.setProperty("display", "flex", "important");
    heroFrame.style.setProperty("align-items", "center", "important");
    heroFrame.style.setProperty("justify-content", "center", "important");
  }

  heroImage.classList.remove("object-cover");
  heroImage.classList.add("object-contain");
  heroImage.style.setProperty("object-fit", "contain", "important");
  heroImage.style.setProperty("object-position", "center center", "important");
  heroImage.style.setProperty("width", "100%", "important");
  heroImage.style.setProperty("height", "100%", "important");
}

function polishRoomModal(modal: HTMLElement) {
  const language = currentLanguage();
  const heading = modal.querySelector<HTMLElement>("h2");
  const category = heading?.nextElementSibling as HTMLElement | null;
  const roomMatch = heading?.textContent?.match(/(?:Room|Zimmer|Chambre|Camera|Habitación|Oda|Δωμάτιο)\s*(\d+)/i);

  if (heading && roomMatch) {
    const translatedHeading = `${ROOM_WORD[language]} ${roomMatch[1]}`;
    if (heading.textContent !== translatedHeading) heading.textContent = translatedHeading;
  }
  if (category) {
    const source = category.dataset.aiOriginalCategory || category.textContent?.trim() || "";
    category.dataset.aiOriginalCategory = source;
    const translatedCategory = CATEGORY[language][source] || source;
    if (category.textContent !== translatedCategory) category.textContent = translatedCategory;
  }

  forceFullHeroPhoto(modal);
}

function polishAllRoomModals() {
  for (const modal of activeRoomModals()) polishRoomModal(modal);
}

export function AiRoomModalPolish() {
  useEffect(() => {
    let frame = 0;
    const schedule = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(polishAllRoomModals);
    };

    schedule();
    const observer = new MutationObserver(schedule);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["class", "src", "style"],
    });
    window.addEventListener("resize", schedule);
    window.addEventListener("popstate", schedule);

    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", schedule);
      window.removeEventListener("popstate", schedule);
    };
  }, []);

  return null;
}
