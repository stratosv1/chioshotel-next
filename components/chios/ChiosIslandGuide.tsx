import type {
  ChiosIslandGuide,
  ChiosIslandGuideItem,
  ChiosIslandGuideSection,
} from "@/content/chios-island-guide";

type Cta = { label: string; href: string };

type Props = {
  guide: ChiosIslandGuide;
  primaryCta: Cta;
  secondaryCta: Cta;
};

// Reading order: short text sections sit next to each other in pairs.
const ORDER = [
  "getting-there",
  "where-to-stay",
  "beaches",
  "top-five",
  "sunset",
  "plan",
  "tastes",
  "who",
  "book-direct",
];
const HALF_WIDTH = new Set(["where-to-stay", "beaches", "tastes", "who"]);

function sortSections(sections: ChiosIslandGuideSection[]) {
  return [...sections].sort((a, b) => {
    const ia = ORDER.indexOf(a.id);
    const ib = ORDER.indexOf(b.id);
    return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
  });
}

function LinkPill({ item }: { item: ChiosIslandGuideItem }) {
  if (!item.href) return null;
  return (
    <a
      className="mt-5 inline-flex min-h-11 items-center justify-center rounded-full border border-amber-800/20 bg-[#fff7ee] px-5 text-[11px] font-black uppercase tracking-[0.1em] text-amber-900 transition hover:bg-amber-100"
      href={item.href}
    >
      {item.linkLabel ?? item.title} →
    </a>
  );
}

function ItemLink({ item }: { item: ChiosIslandGuideItem }) {
  if (!item.href) return null;
  return (
    <a
      className="mt-2 inline-flex text-[12px] font-black uppercase tracking-[0.1em] text-amber-900 underline-offset-4 hover:underline"
      href={item.href}
    >
      {item.linkLabel ?? item.title} →
    </a>
  );
}

function ItemGrid({ items }: { items: ChiosIslandGuideItem[] }) {
  const normal = items.filter((item) => !item.highlight);
  const highlighted = items.filter((item) => item.highlight);
  const threeAcross = normal.length === 3;

  return (
    <div className="mt-5 grid gap-3">
      {normal.length ? (
        <ul className={`m-0 grid list-none gap-3 p-0 ${threeAcross ? "md:grid-cols-3" : "md:grid-cols-2"}`}>
          {normal.map((item, index) => {
            const lastOdd = !threeAcross && normal.length % 2 === 1 && index === normal.length - 1;
            return (
              <li
                className={`rounded-[20px] bg-[#fff7ee] px-5 py-4 ring-1 ring-amber-800/10 ${lastOdd ? "md:col-span-2" : ""}`}
                key={item.title}
              >
                <strong className="block text-base font-black leading-7 text-stone-800">{item.title}</strong>
                <span className="mt-1 block text-[15px] leading-7 text-stone-600">{item.text}</span>
                <ItemLink item={item} />
              </li>
            );
          })}
        </ul>
      ) : null}

      {highlighted.map((item) => (
        <div
          className="rounded-[20px] border-l-4 border-[#a87842] bg-gradient-to-br from-[#fff3df] to-[#fbe6c6] px-5 py-4 shadow-sm ring-1 ring-amber-800/15"
          key={item.title}
        >
          <strong className="block text-base font-black leading-7 text-amber-950 md:text-lg">💡 {item.title}</strong>
          <span className="mt-1 block text-[15px] leading-7 text-stone-700">{item.text}</span>
          <ItemLink item={item} />
        </div>
      ))}
    </div>
  );
}

function Timeline({ items }: { items: ChiosIslandGuideItem[] }) {
  return (
    <ol className="relative m-0 mt-6 list-none p-0 before:absolute before:bottom-5 before:left-[17px] before:top-5 before:w-px before:bg-amber-800/25">
      {items.map((item, index) => (
        <li className="relative flex gap-4 pb-5 last:pb-0" key={item.title}>
          <span
            aria-hidden="true"
            className="relative z-[1] flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#a87842] to-[#8e6607] text-sm font-black text-white shadow-md"
          >
            {index + 1}
          </span>
          <div className="pt-1">
            <strong className="block text-base font-black leading-6 text-stone-800">{item.title}</strong>
            <span className="mt-1 block text-[15px] leading-7 text-stone-600">{item.text}</span>
            <ItemLink item={item} />
          </div>
        </li>
      ))}
    </ol>
  );
}

export function ChiosIslandGuideSection({ guide, primaryCta, secondaryCta }: Props) {
  const sections = sortSections(guide.sections);
  let number = 0;

  return (
    <section className="py-10 md:py-14" id="guide" aria-labelledby="ci-guide-title">
      <div className="mx-auto w-[min(1180px,calc(100%-40px))] max-md:w-[calc(100%-24px)]">
        <header className="mx-auto mb-7 max-w-[820px] text-center">
          <span className="mb-4 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-amber-900 before:h-px before:w-8 before:bg-current before:opacity-75">
            {guide.kicker}
          </span>
          <h2 id="ci-guide-title" className="m-0 text-[clamp(32px,4.6vw,58px)] font-black leading-none tracking-[-0.055em] text-stone-800">
            {guide.title}
          </h2>
          <p className="mx-auto mt-5 max-w-[760px] text-base leading-8 text-stone-600">{guide.intro}</p>
        </header>

        <div className="grid gap-4 md:grid-cols-2">
          {sections.map((section) => {
            if (section.id === "book-direct") {
              return (
                <article
                  className="rounded-[1.75rem] bg-gradient-to-br from-[#a87842] to-[#7a5606] p-[clamp(22px,4vw,40px)] text-white shadow-2xl shadow-amber-900/20 md:col-span-2"
                  id={`guide-${section.id}`}
                  key={section.id}
                >
                  <h3 className="m-0 text-[clamp(24px,3vw,36px)] font-black leading-tight tracking-[-0.04em] text-white">
                    {section.title}
                  </h3>
                  {section.paragraphs?.map((paragraph) => (
                    <p className="mt-3 max-w-[760px] text-[15px] leading-7 text-white/90 md:text-base md:leading-8" key={paragraph}>
                      {paragraph}
                    </p>
                  ))}
                  <div className="mt-6 flex flex-wrap gap-3">
                    <a className="inline-flex min-h-[52px] items-center justify-center rounded-full bg-white px-7 text-[12px] font-black uppercase tracking-[0.1em] text-amber-900 shadow-lg" href={primaryCta.href}>
                      {primaryCta.label}
                    </a>
                    <a className="inline-flex min-h-[52px] items-center justify-center rounded-full border border-white/50 bg-white/10 px-7 text-[12px] font-black uppercase tracking-[0.1em] text-white" href={secondaryCta.href}>
                      {secondaryCta.label}
                    </a>
                  </div>
                </article>
              );
            }

            number += 1;
            const half = HALF_WIDTH.has(section.id);
            const items = section.items ?? [];
            const single = items.length === 1;

            return (
              <article
                className={`rounded-[1.75rem] border border-amber-800/15 bg-white/90 p-[clamp(20px,3.5vw,36px)] shadow-lg shadow-stone-900/5 ${half ? "" : "md:col-span-2"}`}
                id={`guide-${section.id}`}
                key={section.id}
              >
                <div className="flex items-start gap-3">
                  <span aria-hidden="true" className="mt-1 text-xs font-black tracking-[0.12em] text-amber-800/70">
                    {String(number).padStart(2, "0")}
                  </span>
                  <h3 className="m-0 text-[clamp(22px,2.6vw,32px)] font-black leading-tight tracking-[-0.04em] text-stone-800">
                    {section.title}
                  </h3>
                </div>
                {section.paragraphs?.map((paragraph) => (
                  <p className="mt-3 text-[15px] leading-7 text-stone-600 md:text-base md:leading-8" key={paragraph}>
                    {paragraph}
                  </p>
                ))}
                {single ? <LinkPill item={items[0]} /> : null}
                {items.length > 1 && section.id === "plan" ? <Timeline items={items} /> : null}
                {items.length > 1 && section.id !== "plan" ? <ItemGrid items={items} /> : null}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
