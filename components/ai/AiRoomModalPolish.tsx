"use client";

import { useEffect } from "react";

type Language = "el" | "en" | "de" | "fr" | "it" | "es" | "tr";

const ROOM_WORD: Record<Language, string> = {
  el: "Δωμάτιο",
  en: "Room",
  de: "Zimmer",
  fr: "Chambre",
  it: "Camera",
  es: "Habitación",
  tr: "Oda",
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

const ROOM_TEN_CAPACITY: Record<Language, Array<[RegExp, string]>> = {
  el: [[/Έως\s*4\s*άτομα/i, "Έως 5 άτομα"]],
  en: [[/Up to\s*4\s*guests/i, "Up to 5 guests"]],
  de: [[/Bis zu\s*4\s*Gäste/i, "Bis zu 5 Gäste"]],
  fr: [[/Jusqu[’']à\s*4\s*personnes/i, "Jusqu’à 5 personnes"]],
  it: [[/Fino a\s*4\s*ospiti/i, "Fino a 5 ospiti"]],
  es: [[/Hasta\s*4\s*huéspedes/i, "Hasta 5 huéspedes"]],
  tr: [[/En fazla\s*4\s*misafir/i, "En fazla 5 misafir"]],
};

function currentLanguage(): Language {
  const requested = new URLSearchParams(window.location.search)
    .get("lang")
    ?.toLowerCase()
    .split("-")[0];

  return (["el", "en", "de", "fr", "it", "es", "tr"] as Language[]).includes(
    requested as Language,
  )
    ? (requested as Language)
    : "en";
}

function activeRoomModals(): HTMLElement[] {
  const nodes = document.querySelectorAll<HTMLElement>(
    '[role="dialog"][aria-modal="true"], main > div.fixed.inset-0.z-50',
  );

  return Array.from(nodes).filter((node) => node.offsetParent !== null);
}

function compactDesktopModal(modal: HTMLElement) {
  const heading = modal.querySelector<HTMLElement>("h2");
  if (!heading) return;

  const panel = (modal.querySelector("section") || modal.firstElementChild) as HTMLElement | null;
  if (!panel) return;

  if (window.matchMedia("(min-width: 640px)").matches) {
    panel.style.setProperty("height", "auto", "important");
    panel.style.setProperty("max-height", "720px", "important");
    panel.style.setProperty("max-width", "36rem", "important");
  } else {
    panel.style.removeProperty("height");
    panel.style.removeProperty("max-height");
    panel.style.removeProperty("max-width");
  }
}

function forceCoveredHeroPhoto(modal: HTMLElement) {
  const heading = modal.querySelector<HTMLElement>("h2");
  const heroImage = modal.querySelector<HTMLImageElement>("img");
  if (!heading || !heroImage) return;

  const heroFrame = heroImage.parentElement as HTMLElement | null;
  if (heroFrame) {
    heroFrame.style.setProperty("position", "relative", "important");
    heroFrame.style.setProperty("width", "100%", "important");
    heroFrame.style.setProperty("overflow", "hidden", "important");
    heroFrame.style.setProperty("background", "#1c1917", "important");

    if (window.matchMedia("(min-width: 640px)").matches) {
      heroFrame.style.setProperty("height", "300px", "important");
    } else {
      heroFrame.style.removeProperty("height");
    }
  }

  heroImage.classList.remove("object-contain");
  heroImage.classList.add("object-cover", "absolute", "inset-0", "h-full", "w-full");
  heroImage.style.setProperty("position", "absolute", "important");
  heroImage.style.setProperty("inset", "0", "important");
  heroImage.style.setProperty("object-fit", "cover", "important");
  heroImage.style.setProperty("object-position", "center center", "important");
  heroImage.style.setProperty("width", "100%", "important");
  heroImage.style.setProperty("height", "100%", "important");
  heroImage.style.setProperty("max-width", "none", "important");
  heroImage.style.setProperty("max-height", "none", "important");
}

function forceResponsiveAmenities(modal: HTMLElement) {
  const headings = Array.from(modal.querySelectorAll<HTMLElement>("p, h3"));
  const amenitiesHeading = headings.find((node) =>
    /room amenities|παροχές δωματίου|zimmerausstattung|équipements de la chambre|servizi della camera|servicios de la habitación|oda olanakları/i.test(
      node.textContent?.trim() || "",
    ),
  );
  const grid = amenitiesHeading?.nextElementSibling as HTMLElement | null;
  if (!grid) return;

  const desktop = window.matchMedia("(min-width: 640px)").matches;
  grid.style.setProperty("display", "grid", "important");
  grid.style.setProperty(
    "grid-template-columns",
    desktop ? "repeat(4, minmax(0, 1fr))" : "repeat(2, minmax(0, 1fr))",
    "important",
  );
  grid.style.setProperty("gap", desktop ? "8px" : "6px", "important");
  grid.style.setProperty("max-height", "none", "important");

  for (const badge of Array.from(grid.children) as HTMLElement[]) {
    badge.style.setProperty("min-width", "0", "important");
    badge.style.setProperty("white-space", "normal", "important");
    badge.style.setProperty("text-align", "center", "important");
    badge.style.setProperty("line-height", "1.2", "important");
  }
}

function fixRoomTenCapacity(modal: HTMLElement, language: Language, roomNumber: number) {
  if (roomNumber !== 10) return;

  for (const node of Array.from(modal.querySelectorAll<HTMLElement>("span, p, div"))) {
    if (node.children.length > 0) continue;
    const value = node.textContent?.trim() || "";
    for (const [pattern, replacement] of ROOM_TEN_CAPACITY[language]) {
      if (!pattern.test(value)) continue;
      node.textContent = value.replace(pattern, replacement);
      break;
    }
  }
}

function polishRoomModal(modal: HTMLElement) {
  const language = currentLanguage();
  const heading = modal.querySelector<HTMLElement>("h2");
  const category = heading?.nextElementSibling as HTMLElement | null;
  const roomMatch = heading?.textContent?.match(
    /(?:Room|Zimmer|Chambre|Camera|Habitación|Oda|Δωμάτιο)\s*(\d+)/i,
  );
  const roomNumber = Number(roomMatch?.[1] || 0);

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

  compactDesktopModal(modal);
  forceCoveredHeroPhoto(modal);
  forceResponsiveAmenities(modal);
  fixRoomTenCapacity(modal, language, roomNumber);
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
