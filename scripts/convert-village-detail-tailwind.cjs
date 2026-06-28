const fs = require("fs");

const p = "components/chios/VillageDetailPageTailwind.tsx";
const s = fs.readFileSync(p, "utf8");

const start = s.indexOf('  return (\n    <main className="village-detail-page">');
const end = s.lastIndexOf("\n  );\n}");

if (start < 0 || end < 0 || end <= start) {
  console.error("Could not find old return block in VillageDetailPageTailwind.tsx");
  process.exit(1);
}

const before = s.slice(0, start);

const body = `  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f7efe5] text-stone-900">
      <section className="relative flex min-h-[76svh] items-end overflow-hidden text-white md:min-h-[640px]" aria-labelledby="village-hero-title">
        <img src={village.hero.image} alt="" loading="eager" className="absolute inset-0 z-0 h-full w-full object-cover" />
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent md:bg-[linear-gradient(90deg,rgba(32,24,18,0.84),rgba(32,24,18,0.50),rgba(32,24,18,0.14))]" />

        <div className="relative z-20 mx-auto w-full max-w-[1180px] px-3 pb-6 pt-24 md:px-5 md:pb-20">
          <div className="max-w-[800px] rounded-none border-0 bg-transparent p-0 md:rounded-[34px] md:border md:border-white/25 md:bg-white/15 md:p-12 md:shadow-2xl md:backdrop-blur">
            <span className="mb-4 inline-flex items-center gap-3 text-xs font-black uppercase tracking-[0.16em] text-white">
              <span className="h-px w-8 bg-current opacity-80" />
              {village.hero.kicker}
            </span>

            <h1 id="village-hero-title" className="max-w-[12ch] text-[38px] font-black leading-[0.98] tracking-[-0.06em] text-white drop-shadow-xl md:text-[clamp(42px,6.5vw,78px)] md:leading-[0.94]">
              {village.hero.title}
            </h1>

            <p className="mt-4 max-w-[700px] text-sm leading-6 text-white/95 md:mt-5 md:text-lg md:leading-8">
              {village.hero.description}
            </p>

            <div className="mt-5 flex flex-wrap gap-2" aria-label={copy.tagsLabel}>
              {village.hero.tags.map((tag) => (
                <span className="inline-flex min-h-7 items-center rounded-full border border-white/25 bg-[#fff7ee]/95 px-3 text-[9px] font-black uppercase tracking-[0.08em] text-[#6a4b00] md:min-h-8 md:text-[10px]" key={tag}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[radial-gradient(circle_at_top_left,rgba(168,120,66,0.18),transparent_34rem),linear-gradient(180deg,#fbf6ef_0%,#f4eadf_52%,#fbf6ef_100%)] px-3 py-10 md:px-5 md:py-16" aria-label={copy.detailsLabel}>
        <div className="mx-auto grid max-w-[1180px] gap-5 md:grid-cols-3">
          {village.details.map((detail) => (
            <article className="rounded-[24px] border border-amber-900/10 bg-[#fffdfa] p-5 shadow-lg shadow-stone-900/5 transition hover:-translate-y-1 hover:shadow-xl md:rounded-[30px] md:p-8" key={detail.title}>
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-[20px] border border-amber-900/10 bg-[#fff4e5] text-3xl" aria-hidden="true">
                {detail.icon}
              </div>

              <h2 className="text-2xl font-black leading-none tracking-[-0.035em]">{detail.title}</h2>
              <p className="mt-3 text-sm leading-7 text-stone-600 md:text-[15px]">{detail.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-[#f7efe5] px-3 pb-10 pt-2 md:px-5 md:pb-16" aria-labelledby="village-story-title">
        <div className="mx-auto grid max-w-[1180px] gap-5 md:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
          <article className="rounded-[24px] border border-amber-900/10 bg-[#fffdfa] p-5 shadow-lg shadow-stone-900/5 md:rounded-[30px] md:p-8">
            <span className="mb-4 inline-flex items-center gap-3 text-xs font-black uppercase tracking-[0.16em] text-[#6a4b00]">
              <span className="h-px w-8 bg-current opacity-75" />
              {copy.storyKicker}
            </span>

            <h2 id="village-story-title" className="text-3xl font-black leading-none tracking-[-0.055em] md:text-[clamp(30px,4vw,52px)]">
              {village.experience.title}
            </h2>

            {village.experience.paragraphs.map((paragraph) => (
              <p className="mt-5 text-sm leading-7 text-stone-600 md:text-base md:leading-8" key={paragraph}>
                {paragraph}
              </p>
            ))}
          </article>

          <aside className="rounded-[24px] border border-amber-900/10 bg-[radial-gradient(circle_at_top_left,rgba(168,120,66,0.14),transparent_22rem),#fffdfa] p-5 shadow-lg shadow-stone-900/5 md:rounded-[30px] md:p-8">
            <h2 className="text-3xl font-black leading-none tracking-[-0.055em] md:text-[clamp(30px,4vw,52px)]">
              {village.highlights.title}
            </h2>

            <ul className="mt-5 grid gap-3">
              {village.highlights.items.map((item) => (
                <li className="relative rounded-[18px] border border-amber-900/10 bg-[#fff7ee] py-3.5 pl-11 pr-4 text-sm leading-6 text-stone-600 before:absolute before:left-4 before:top-3.5 before:font-black before:text-[#6a4b00] before:content-['✓'] md:text-[15px]" key={item}>
                  {item}
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </section>

      <section className="bg-[#f7efe5] px-3 py-10 md:px-5 md:py-14" aria-labelledby="village-routes-title">
        <div className="mx-auto max-w-[1180px]">
          <header className="mx-auto mb-8 max-w-3xl text-center">
            <span className="mb-4 inline-flex items-center justify-center gap-3 text-xs font-black uppercase tracking-[0.16em] text-[#6a4b00]">
              <span className="h-px w-8 bg-current opacity-75" />
              {copy.routesKicker}
              <span className="h-px w-8 bg-current opacity-75" />
            </span>

            <h2 id="village-routes-title" className="text-3xl font-black leading-none tracking-[-0.055em] md:text-[clamp(32px,4.6vw,58px)]">
              {village.routeIdeas.title}
            </h2>
          </header>

          <div className="grid gap-5 md:grid-cols-3">
            {village.routeIdeas.items.map((item) => (
              <article className="rounded-[24px] border border-amber-900/10 bg-[#fffdfa] p-5 shadow-lg shadow-stone-900/5 transition hover:-translate-y-1 hover:shadow-xl md:rounded-[30px] md:p-8" key={item.title}>
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-[20px] border border-amber-900/10 bg-[#fff4e5] text-3xl" aria-hidden="true">
                  {item.icon}
                </div>

                <h3 className="text-[22px] font-black leading-none tracking-[-0.035em]">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-stone-600 md:text-[15px]">{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f7efe5] px-3 pb-10 pt-0 md:px-5 md:pb-16" aria-label={copy.localTipLabel}>
        <div className="mx-auto max-w-[1180px]">
          <article className="flex flex-col items-center gap-5 rounded-[28px] border border-amber-900/10 bg-[#fffdfa] p-6 text-center shadow-lg shadow-stone-900/5 md:flex-row md:rounded-[34px] md:p-9 md:text-left">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-2 border-dashed border-[#c7925b] bg-[#fff4e5] text-4xl" aria-hidden="true">
              {village.baseTip.icon}
            </div>

            <div>
              <h2 className="text-3xl font-black leading-none tracking-[-0.04em]">
                {village.baseTip.title}
              </h2>
              <p className="mt-3 text-sm leading-7 text-stone-600 md:text-base md:leading-8">
                {village.baseTip.text}{" "}
                <a className="font-black text-[#6a4b00] underline underline-offset-4" href={village.baseTip.href}>
                  {village.baseTip.linkLabel}
                </a>
              </p>
            </div>
          </article>
        </div>
      </section>

      <section className="bg-[#f7efe5] px-3 pb-14 pt-4 md:px-5 md:pb-20" aria-labelledby="village-related-title">
        <div className="mx-auto max-w-[1180px]">
          <header className="mx-auto mb-8 max-w-3xl text-center">
            <span className="mb-4 inline-flex items-center justify-center gap-3 text-xs font-black uppercase tracking-[0.16em] text-[#6a4b00]">
              <span className="h-px w-8 bg-current opacity-75" />
              {copy.relatedKicker}
              <span className="h-px w-8 bg-current opacity-75" />
            </span>
            <h2 id="village-related-title" className="text-3xl font-black leading-none tracking-[-0.055em] md:text-[clamp(32px,4.6vw,58px)]">
              {village.relatedTitle}
            </h2>
            <p className="mt-4 text-sm leading-7 text-stone-600 md:text-base md:leading-8">{village.relatedText}</p>
          </header>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4 xl:auto-rows-[240px]">
            {relatedVillages.map((related, index) => {
              const cardSize = getRelatedCardSize(index);
              const sizeClass =
                cardSize === "large"
                  ? "xl:col-span-2 xl:row-span-2"
                  : cardSize === "wide"
                    ? "xl:col-span-2"
                    : "";

              const titleClass = cardSize === "large" ? "text-3xl xl:text-5xl" : "text-3xl";

              return (
                <a
                  className={["group relative isolate flex min-h-[310px] items-end overflow-hidden rounded-[24px] bg-stone-900 p-5 text-white shadow-lg shadow-stone-900/10 transition hover:-translate-y-1 hover:shadow-2xl md:min-h-[240px] md:rounded-[26px]", sizeClass].join(" ")}
                  href={related.seo.canonicalPath}
                  key={related.seo.canonicalPath}
                >
                  <img src={related.hero.image} alt="" loading={index < 2 ? "eager" : "lazy"} className="absolute inset-0 -z-20 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 -z-10 bg-gradient-to-t from-stone-950 via-stone-950/60 to-stone-950/10" />

                  <div className="w-full">
                    <span className="mb-3 inline-flex min-h-7 items-center rounded-full bg-[#fff7ee]/95 px-3 text-[9px] font-black uppercase tracking-[0.09em] text-[#6a4b00]">
                      {getBadgeFromVillage(related)}
                    </span>
                    <h3 className={["max-w-[11ch] font-black leading-none tracking-[-0.045em] text-white drop-shadow-xl", titleClass].join(" ")}>
                      {related.hero.title}
                    </h3>
                    <p className="mt-3 max-w-[520px] text-[13px] leading-6 text-white/90 md:text-sm">
                      {related.seo.description}
                    </p>
                    <strong className="mt-4 inline-flex text-[11px] font-black uppercase tracking-[0.1em] text-[#f2d9a8]">{copy.exploreVillage}</strong>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );`;

fs.writeFileSync(p, before + body + "\n}\n", "utf8");
console.log("OK: Tailwind return block written to " + p);
