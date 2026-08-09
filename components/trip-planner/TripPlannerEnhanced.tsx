"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import TripPlannerStartV2 from "./TripPlannerStartV2";
import { beaches, type BeachMaster } from "@/content/trip-planner/beaches";

type DetailTarget = {
  element: HTMLDetailsElement;
  beach: BeachMaster;
};

const familyLabel: Record<NonNullable<BeachMaster["familyFit"]>, string> = {
  excellent: "Εξαιρετική για οικογένειες",
  yes: "Καλή για οικογένειες",
  "yes-with-caution": "Καλή για οικογένειες με λίγη προσοχή",
  "older-children": "Καλύτερη για μεγαλύτερα παιδιά",
  "not-recommended": "Δεν προτείνεται για μικρά παιδιά",
};

function BeachDetails({ beach }: { beach: BeachMaster }) {
  const facts: Array<{ icon: string; label: string; value: string }> = [];

  if (beach.surface?.length) facts.push({ icon: "🏖", label: "Ακτή", value: beach.surface.join(", ") });
  if (beach.depth) facts.push({ icon: "🌊", label: "Νερά", value: beach.depth });
  if (beach.organization) facts.push({ icon: "⛱", label: "Οργάνωση", value: beach.organization });
  if (beach.shade) facts.push({ icon: "🌳", label: "Σκιά", value: beach.shade });
  if (beach.access?.length) facts.push({ icon: "🚗", label: "Πρόσβαση", value: beach.access.join(" · ") });
  if (beach.amenities?.length) facts.push({ icon: "☕", label: "Παροχές", value: beach.amenities.join(" · ") });

  const family = beach.familyNote || (beach.familyFit ? familyLabel[beach.familyFit] : null);

  return (
    <div
      data-trip-planner-beach-info
      className="mt-2 space-y-2.5 text-[#6f6257]"
      onClick={(event) => event.stopPropagation()}
    >
      <div className="rounded-lg bg-[#f3f0e9] px-3 py-2 text-[10px] leading-4 text-[#776859]">
        <strong className="text-[#5f5145]">Γιατί προτείνεται σήμερα:</strong>{" "}
        η κατάταξη συνδυάζει την πρόγνωση ανέμου και κύματος με την έκθεση της συγκεκριμένης ακτής.
      </div>

      <div className="border-t border-[#e7dfd5] pt-2.5">
        <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#9a7655]">Πληροφορίες παραλίας</p>

        {facts.length ? (
          <div className="mt-2 grid gap-1.5 text-[10px] leading-4 sm:grid-cols-2">
            {facts.map((fact) => (
              <div key={`${fact.label}-${fact.value}`} className="rounded-lg bg-white/70 px-2.5 py-2">
                <span className="mr-1">{fact.icon}</span>
                <strong className="text-[#625448]">{fact.label}:</strong>{" "}
                <span>{fact.value}</span>
              </div>
            ))}
          </div>
        ) : null}

        {family ? (
          <p className="mt-2 rounded-lg bg-[#eef1e6] px-2.5 py-2 text-[10px] leading-4 text-[#657056]">
            👨‍👩‍👧 <strong>Οικογένεια:</strong> {family}
          </p>
        ) : null}

        {beach.windNote ? (
          <p className="mt-2 text-[10px] leading-4 text-[#806753]">💨 <strong>Άνεμος:</strong> {beach.windNote}</p>
        ) : null}

        {beach.highlights?.length ? (
          <p className="mt-2 text-[10px] leading-4 text-[#746457]">✦ <strong>Τι ξεχωρίζει:</strong> {beach.highlights.join(" · ")}</p>
        ) : null}

        {beach.tip ? (
          <p className="mt-2 rounded-lg border border-[#ead8bf] bg-[#fff7ea] px-2.5 py-2 text-[10px] leading-4 text-[#7b623f]">
            💡 <strong>Tip:</strong> {beach.tip}
          </p>
        ) : null}
      </div>
    </div>
  );
}

export default function TripPlannerEnhanced() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [targets, setTargets] = useState<DetailTarget[]>([]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const beachByName = new Map(beaches.map((beach) => [beach.name, beach]));

    const scan = () => {
      const next: DetailTarget[] = [];

      root.querySelectorAll<HTMLDetailsElement>("details").forEach((details) => {
        const summary = details.querySelector<HTMLElement>(":scope > summary");
        if (summary?.textContent?.trim() !== "Γιατί αυτή η πρόταση;") return;

        const card = details.closest("button");
        if (!card) return;

        let beach: BeachMaster | undefined;
        for (const node of Array.from(card.querySelectorAll<HTMLElement>("div"))) {
          const text = node.childElementCount === 0 ? node.textContent?.trim() : null;
          if (text && beachByName.has(text)) {
            beach = beachByName.get(text);
            break;
          }
        }
        if (!beach) return;

        details.onclick = (event) => event.stopPropagation();
        details.onpointerdown = (event) => event.stopPropagation();

        Array.from(details.children).forEach((child) => {
          if (child === summary || child.hasAttribute("data-trip-planner-beach-info")) return;
          (child as HTMLElement).style.display = "none";
        });

        next.push({ element: details, beach });
      });

      setTargets((current) => {
        const unchanged =
          current.length === next.length &&
          current.every((item, index) => item.element === next[index]?.element && item.beach.id === next[index]?.beach.id);
        return unchanged ? current : next;
      });
    };

    scan();
    const observer = new MutationObserver(scan);
    observer.observe(root, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      root.querySelectorAll<HTMLDetailsElement>("details").forEach((details) => {
        details.onclick = null;
        details.onpointerdown = null;
      });
    };
  }, []);

  return (
    <div ref={rootRef}>
      <TripPlannerStartV2 />
      {targets.map((target) =>
        createPortal(<BeachDetails beach={target.beach} />, target.element, `beach-info-${target.beach.id}`),
      )}
    </div>
  );
}
