"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

type Language = "el" | "en" | "de" | "fr" | "it" | "es" | "tr";

const YES_BUTTON_PATTERN = /Ναι, προσθήκη|Yes, add breakfast|Ja, hinzufügen|Oui, ajouter|Sì, aggiungi|Sí, añadir|Evet, ekle/i;

const ALT: Record<Language, string> = {
  el: "Σπιτικό πρωινό στο Voulamandis House",
  en: "Homemade breakfast at Voulamandis House",
  de: "Hausgemachtes Frühstück im Voulamandis House",
  fr: "Petit-déjeuner maison au Voulamandis House",
  it: "Colazione fatta in casa al Voulamandis House",
  es: "Desayuno casero en Voulamandis House",
  tr: "Voulamandis House ev yapımı kahvaltısı",
};

function currentLanguage(): Language {
  const supported: Language[] = ["el", "en", "de", "fr", "it", "es", "tr"];
  const selected = document.querySelector<HTMLSelectElement>('header select[aria-label="Language"]')?.value;
  const query = new URLSearchParams(window.location.search).get("lang")?.toLowerCase().split("-")[0];
  const value = selected || query || document.documentElement.lang?.toLowerCase().split("-")[0];
  return supported.includes(value as Language) ? value as Language : "en";
}

function findBreakfastActions(): HTMLElement | null {
  const button = Array.from(document.querySelectorAll<HTMLButtonElement>("button"))
    .find(node => YES_BUTTON_PATTERN.test((node.textContent || "").trim()));
  return button?.closest("section") as HTMLElement | null;
}

export function AiBreakfastPhoto() {
  const [host, setHost] = useState<HTMLElement | null>(null);
  const [language, setLanguage] = useState<Language>("en");

  useEffect(() => {
    const locate = () => {
      const nextHost = findBreakfastActions();
      setHost(current => current === nextHost ? current : nextHost);
      setLanguage(currentLanguage());
    };

    locate();
    const observer = new MutationObserver(locate);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  if (!host) return null;

  return createPortal(
    <div data-ai-breakfast-photo className="order-first w-full overflow-hidden rounded-[22px] border border-[#dcd2c5] bg-white shadow-[0_12px_32px_rgba(70,55,35,.10)]">
      <div className="relative h-36 w-full sm:h-44">
        <Image
          src="/images/welcome/voulamandis-breakfast.jpg"
          alt={ALT[language]}
          fill
          sizes="(max-width: 640px) calc(100vw - 72px), 620px"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
      </div>
    </div>,
    host,
  );
}
