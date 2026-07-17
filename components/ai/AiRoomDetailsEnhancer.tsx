"use client";

import { useEffect } from "react";

const DETAILS_LABELS = new Set([
  "Προβολή λεπτομερειών",
  "View details",
  "Details ansehen",
  "Voir les détails",
  "Vedi dettagli",
  "Ver detalles",
  "Detayları gör",
]);

function waitFrame() {
  return new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
}

function getModal() {
  return Array.from(document.querySelectorAll<HTMLElement>("div.fixed.inset-0.z-50")).find((node) =>
    Boolean(node.querySelector("button")),
  );
}

function getGalleryParts(modal: HTMLElement) {
  const panel = modal.firstElementChild as HTMLElement | null;
  const imageArea = panel?.firstElementChild as HTMLElement | null;
  const image = imageArea?.querySelector<HTMLImageElement>("img");
  const buttons = imageArea ? Array.from(imageArea.querySelectorAll<HTMLButtonElement>("button")) : [];
  const previous = buttons.find((button) => (button.textContent || "").trim() === "‹");
  const next = buttons.find((button) => (button.textContent || "").trim() === "›");
  const counter = Array.from(imageArea?.querySelectorAll<HTMLElement>("div") || []).find((node) => /^\d+\/\d+$/.test((node.textContent || "").trim()));
  return { panel, imageArea, image, previous, next, counter };
}

function currentPosition(counter?: HTMLElement) {
  const match = (counter?.textContent || "1/1").trim().match(/^(\d+)\/(\d+)$/);
  return { current: Number(match?.[1] || 1), total: Number(match?.[2] || 1) };
}

export function AiRoomDetailsEnhancer() {
  useEffect(() => {
    let lockedScrollY = 0;
    let activeModal: HTMLElement | null = null;
    let cancelled = false;

    const lockBackground = (modal: HTMLElement) => {
      if (activeModal === modal) return;
      activeModal = modal;
      lockedScrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${lockedScrollY}px`;
      document.body.style.left = "0";
      document.body.style.right = "0";
      document.body.style.width = "100%";
      document.documentElement.style.overflow = "hidden";
      modal.style.overscrollBehavior = "contain";
      const panel = modal.firstElementChild as HTMLElement | null;
      if (panel) {
        panel.style.overscrollBehavior = "contain";
        panel.style.touchAction = "pan-y";
      }
    };

    const unlockBackground = () => {
      if (!activeModal) return;
      activeModal = null;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.width = "";
      document.documentElement.style.overflow = "";
      window.scrollTo(0, lockedScrollY);
    };

    const collectImages = async (modal: HTMLElement) => {
      const { imageArea, image, previous, next, counter } = getGalleryParts(modal);
      if (!imageArea || !image || !counter || !next || !previous) return;
      if (imageArea.querySelector("[data-ai-thumbnails]")) return;

      const { current, total } = currentPosition(counter);
      if (total <= 1) return;

      const originalOpacity = imageArea.style.opacity;
      imageArea.style.opacity = "0.98";
      const sources: string[] = [];

      for (let index = 0; index < total; index += 1) {
        if (cancelled || !document.body.contains(modal)) return;
        const src = image.currentSrc || image.src;
        if (src && !sources.includes(src)) sources.push(src);
        if (index < total - 1) {
          next.click();
          await waitFrame();
        }
      }

      for (let index = 1; index < current; index += 1) {
        previous.click();
        await waitFrame();
      }

      imageArea.style.opacity = originalOpacity;
      if (!sources.length || imageArea.querySelector("[data-ai-thumbnails]")) return;

      const strip = document.createElement("div");
      strip.dataset.aiThumbnails = "true";
      strip.className = "absolute inset-x-3 bottom-3 z-20 flex gap-2 overflow-x-auto rounded-2xl bg-black/35 p-2 backdrop-blur-sm [scrollbar-width:none]";
      strip.addEventListener("wheel", (event) => {
        event.preventDefault();
        strip.scrollLeft += event.deltaY;
      }, { passive: false });

      sources.forEach((src, index) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "relative h-12 w-16 shrink-0 overflow-hidden rounded-xl border-2 border-white/80 bg-white shadow-sm";
        button.setAttribute("aria-label", `Photo ${index + 1}`);
        const thumbnail = document.createElement("img");
        thumbnail.src = src;
        thumbnail.alt = `Room photo ${index + 1}`;
        thumbnail.loading = "lazy";
        thumbnail.className = "h-full w-full object-cover";
        button.appendChild(thumbnail);
        button.addEventListener("click", async () => {
          const parts = getGalleryParts(modal);
          const position = currentPosition(parts.counter);
          const target = index + 1;
          const forward = (target - position.current + position.total) % position.total;
          const backward = (position.current - target + position.total) % position.total;
          const control = forward <= backward ? parts.next : parts.previous;
          const steps = Math.min(forward, backward);
          for (let step = 0; step < steps; step += 1) {
            control?.click();
            await waitFrame();
          }
        });
        strip.appendChild(button);
      });

      counter.style.bottom = "72px";
      imageArea.appendChild(strip);
    };

    const enhanceOpenModal = async () => {
      for (let attempt = 0; attempt < 12; attempt += 1) {
        if (cancelled) return;
        const modal = getModal();
        if (modal) {
          lockBackground(modal);
          const panel = modal.firstElementChild as HTMLElement | null;
          if (panel) {
            panel.style.maxHeight = "94dvh";
            panel.style.overflowY = "auto";
            panel.style.overscrollBehavior = "contain";
            panel.addEventListener("touchmove", (event) => event.stopPropagation(), { passive: true });
            panel.addEventListener("wheel", (event) => event.stopPropagation(), { passive: true });
          }
          await collectImages(modal);
          return;
        }
        await new Promise((resolve) => setTimeout(resolve, 50));
      }
    };

    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const button = target?.closest<HTMLButtonElement>("button");
      const label = (button?.textContent || "").trim();
      if (button && DETAILS_LABELS.has(label)) {
        window.setTimeout(() => void enhanceOpenModal(), 0);
        return;
      }

      const modal = getModal();
      if (!modal) {
        window.setTimeout(unlockBackground, 0);
        return;
      }

      if (button && (label === "×" || label === "✕")) {
        window.setTimeout(unlockBackground, 0);
      }
    };

    document.addEventListener("click", handleClick, true);
    return () => {
      cancelled = true;
      document.removeEventListener("click", handleClick, true);
      unlockBackground();
    };
  }, []);

  return null;
}
