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

function polishModal() {
  const dialog = document.querySelector<HTMLElement>('[role="dialog"][aria-modal="true"]');
  if (!dialog || dialog.dataset.aiModalPolished === "true") return;

  dialog.dataset.aiModalPolished = "true";
  const language = currentLanguage();
  const heading = dialog.querySelector<HTMLElement>("h2");
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

  const hero = dialog.querySelector<HTMLElement>("section > div:first-child");
  const heroFrame = hero?.querySelector<HTMLElement>("div.relative.w-full");
  const heroImage = heroFrame?.querySelector<HTMLImageElement>("img");
  if (heroFrame) {
    heroFrame.style.height = "clamp(250px, 40dvh, 390px)";
    heroFrame.style.background = "#e7e5e4";
  }
  if (heroImage) {
    heroImage.classList.remove("object-cover");
    heroImage.classList.add("object-contain");
    heroImage.style.objectFit = "contain";
    heroImage.style.objectPosition = "center";
  }

  const section = dialog.querySelector<HTMLElement>("section");
  if (section) {
    section.style.height = "min(94dvh, 840px)";
    section.style.maxHeight = "calc(100dvh - 12px)";
    section.style.marginBottom = "env(safe-area-inset-bottom)";
  }
}

export function AiRoomModalPolish() {
  useEffect(() => {
    polishModal();
    const observer = new MutationObserver((mutations) => {
      if (mutations.some((mutation) => mutation.addedNodes.length > 0)) polishModal();
    });
    observer.observe(document.body, { childList: true, subtree: true });
    window.addEventListener("popstate", polishModal);
    return () => {
      observer.disconnect();
      window.removeEventListener("popstate", polishModal);
    };
  }, []);

  return null;
}
