const fs = require("node:fs");
const path = require("node:path");

const file = path.join(process.cwd(), "components/ai/AIRoomFinder.tsx");
let source = fs.readFileSync(file, "utf8");

if (!source.includes("recommendationRole?:")) {
  source = source.replace(
    "  saving: number;\n};",
    "  saving: number;\n  recommendationRole?: \"recommended\" | \"budget\" | \"comfort\" | \"alternative\";\n  recommendationTitle?: string;\n  recommendationReason?: string;\n};",
  );
}

source = source.replace(
  "{offerIndex === 0 ? t.best : t.live}",
  "{offer.recommendationTitle || (offerIndex === 0 ? t.best : t.live)}",
);

const cardBodyMarker = '<div className="mt-3 flex flex-wrap gap-1.5"><span className="rounded-md border border-[#ead6b5] bg-[#fff5df] px-2 py-1 text-[10px] font-bold text-[#8a5a19]">{t.live}</span>';
if (source.includes(cardBodyMarker) && !source.includes("offer.recommendationReason ?")) {
  source = source.replace(
    cardBodyMarker,
    '{offer.recommendationReason ? <div className="mt-3 rounded-xl border border-[#e4dccf] bg-[#faf8f3] px-3 py-2.5"><p className="text-[11px] font-extrabold uppercase tracking-[0.08em] text-[#61752b]">{offer.recommendationTitle || t.best}</p><p className="mt-1 line-clamp-3 text-[12px] font-medium leading-5 text-stone-700">{offer.recommendationReason}</p></div> : null}<div className="mt-3 flex flex-wrap gap-1.5"><span className="rounded-md border border-[#ead6b5] bg-[#fff5df] px-2 py-1 text-[10px] font-bold text-[#8a5a19]">{t.live}</span>',
  );
}

source = source.replace(
  'className="mt-5 -mx-1 flex snap-x snap-mandatory gap-4 overflow-x-auto px-1 pb-3 [scrollbar-width:thin]"',
  'className="mt-5 -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-4 pr-14 scroll-px-4 overscroll-x-contain [scrollbar-width:thin] sm:-mx-1 sm:px-1 sm:pr-1"',
);
source = source.replace(
  'w-[300px] shrink-0 snap-start overflow-hidden rounded-[20px]',
  'w-[calc(100vw-3.25rem)] max-w-[340px] shrink-0 snap-start overflow-hidden rounded-[20px]',
);
source = source.replace(
  'className="relative h-[166px] overflow-hidden bg-stone-100"',
  'className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100"',
);
source = source.replace(
  'className="object-cover transition duration-300 group-hover:scale-[1.02]"',
  'className="object-cover object-center transition duration-300 group-hover:scale-[1.02]"',
);
source = source.replace(
  'className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-8"',
  'className="mx-auto flex max-w-5xl items-center justify-between py-4 pl-16 pr-4 sm:pl-40 sm:pr-8"',
);

const activeAmenitiesMarker = '  const activeAmenities = activeOffer ? [activeOffer.floor, ...activeOffer.features].filter(Boolean).slice(0, 2) : [];\n';
if (source.includes(activeAmenitiesMarker) && !source.includes('data-ai-accessibility-hidden')) {
  source = source.replace(
    activeAmenitiesMarker,
    `${activeAmenitiesMarker}\n  useEffect(() => {\n    const hidden = new Map<HTMLElement, string>();\n    const hideWidgets = () => {\n      document.querySelectorAll<HTMLElement>(ACCESSIBILITY_WIDGET_SELECTORS).forEach((element) => {\n        if (hidden.has(element)) return;\n        hidden.set(element, element.style.display);\n        element.dataset.aiAccessibilityHidden = \"true\";\n        element.style.setProperty(\"display\", \"none\", \"important\");\n      });\n    };\n    hideWidgets();\n    const observer = new MutationObserver(hideWidgets);\n    observer.observe(document.body, { childList: true, subtree: true });\n    return () => {\n      observer.disconnect();\n      hidden.forEach((display, element) => {\n        element.style.display = display;\n        delete element.dataset.aiAccessibilityHidden;\n      });\n    };\n  }, []);\n`,
  );
}

if (!source.includes("offer.recommendationTitle ||")) throw new Error("Recommendation title UI patch was not applied");
if (!source.includes("aspect-[4/3]")) throw new Error("Room image crop patch was not applied");
if (!source.includes("aiAccessibilityHidden")) throw new Error("Accessibility widget patch was not applied");
if (!source.includes("sm:pl-40")) throw new Error("Back-button header spacing patch was not applied");

fs.writeFileSync(file, source);
console.log("AI recommendation cards, image crop, carousel, accessibility and header layout updated");
