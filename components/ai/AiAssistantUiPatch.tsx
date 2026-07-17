"use client";

import { useEffect } from "react";

function normalizeText(value: string) {
  return value.trim().toLocaleLowerCase("el-GR").replaceAll("·", " ").replace(/\s+/g, " ");
}

function translateGreek(value: string) {
  const map: Record<string, string> = {
    "Room 1": "Δωμάτιο 1",
    "Room 2": "Δωμάτιο 2",
    "Room 3": "Δωμάτιο 3",
    "Room 4": "Δωμάτιο 4",
    "Room 5": "Δωμάτιο 5",
    "Room 6": "Δωμάτιο 6",
    "Ground Floor Room": "Δωμάτιο ισογείου",
    "Ground floor": "Ισόγειο",
    "First floor": "Πρώτος όροφος",
    "No stairs": "Χωρίς σκάλες",
    "First floor · stairs": "Πρώτος όροφος · με σκάλες",
    "1 double bed + 1 single bed": "1 διπλό και 1 μονό κρεβάτι",
    "1 double bed": "1 διπλό κρεβάτι",
    "Kitchenette": "Kitchenette",
  };
  return map[value] || value;
}

function patchModal(modal: HTMLElement) {
  const panel = modal.firstElementChild as HTMLElement | null;
  if (!panel) return;

  panel.style.height = "min(100dvh, 820px)";
  panel.style.maxHeight = "100dvh";
  panel.style.overflow = "hidden";
  panel.style.display = "flex";
  panel.style.flexDirection = "column";

  const imageSection = panel.firstElementChild as HTMLElement | null;
  if (imageSection) {
    imageSection.style.height = "clamp(220px, 32dvh, 300px)";
    imageSection.style.minHeight = "220px";
    imageSection.style.flexShrink = "0";
  }

  const body = panel.children.item(1) as HTMLElement | null;
  if (body) {
    body.style.display = "flex";
    body.style.flexDirection = "column";
    body.style.flex = "1";
    body.style.minHeight = "0";
    body.style.padding = "16px";
    body.style.gap = "10px";
    body.style.overflow = "hidden";

    const children = Array.from(body.children) as HTMLElement[];
    const info = children[0];
    const footer = children[1];

    if (info) {
      info.style.flex = "0 0 auto";
      info.querySelectorAll<HTMLElement>("h2, p, span").forEach((node) => {
        node.textContent = translateGreek(node.textContent || "");
      });

      const badgeWrap = Array.from(info.querySelectorAll<HTMLElement>("div")).find((element) =>
        Array.from(element.children).some((child) => child.tagName === "SPAN"),
      );

      if (badgeWrap) {
        const seen = new Set<string>();
        Array.from(badgeWrap.querySelectorAll<HTMLElement>(":scope > span")).forEach((badge) => {
          badge.textContent = translateGreek(badge.textContent || "");
          const key = normalizeText(badge.textContent || "");
          if (!key || seen.has(key)) badge.remove();
          else seen.add(key);
        });
        badgeWrap.style.marginTop = "10px";
        badgeWrap.style.gap = "6px";
      }
    }

    if (footer) {
      footer.style.marginTop = "auto";
      footer.style.paddingTop = "8px";

      const priceBox = footer.firstElementChild as HTMLElement | null;
      if (priceBox) {
        priceBox.style.padding = "12px 14px";
        priceBox.style.borderRadius = "16px";
      }

      const selectButton = footer.querySelector<HTMLElement>("button");
      if (selectButton) {
        const chooser = Array.from(document.querySelectorAll<HTMLElement>("p")).find((node) =>
          /Τώρα επιλέγετε δωμάτιο για την ομάδα/.test(node.textContent || ""),
        );
        const group = chooser?.textContent?.match(/ομάδα\s+(\d+)/i)?.[1];
        selectButton.textContent = group ? `Επιλογή για την ομάδα ${group}` : "Επιλογή δωματίου";
        selectButton.style.minHeight = "48px";
        selectButton.style.padding = "12px 18px";
        selectButton.style.marginTop = "10px";
      }
    }
  }
}

function patchSummary() {
  const headings = Array.from(document.querySelectorAll<HTMLElement>("h2"));
  const summaryHeading = headings.find((heading) => /Αναλυτική σύνοψη/.test(heading.textContent || ""));
  const card = summaryHeading?.closest<HTMLElement>("div.rounded-\[24px\]");
  if (!card) return;

  card.querySelectorAll<HTMLElement>("p, span").forEach((node) => {
    if ((node.textContent || "").trim() === "Θέλετε να προσθέσετε πρωινό με 12€ ανά άτομο, ανά ημέρα;") {
      node.textContent = "Πρωινό";
    }
  });
}

export function AiAssistantUiPatch() {
  useEffect(() => {
    const apply = () => {
      const modal = Array.from(document.querySelectorAll<HTMLElement>("div.fixed.inset-0.z-50")).find((element) =>
        element.querySelector("button"),
      );
      if (modal) patchModal(modal);
      patchSummary();
    };

    apply();
    const observer = new MutationObserver(apply);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  return null;
}
