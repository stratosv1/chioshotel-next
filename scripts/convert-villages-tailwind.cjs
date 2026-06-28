const fs = require("fs");

const p = "components/chios/ChiosVillagesPageTailwind.tsx";
const s = fs.readFileSync(p, "utf8");

const start = s.indexOf('  return (\n    <main className="chios-villages-page">');
const end = s.lastIndexOf("\n  );\n}");

if (start < 0 || end < 0 || end <= start) {
  console.error("Could not find old return block in ChiosVillagesPageTailwind.tsx");
  process.exit(1);
}

const before = s.slice(0, start);

const body = `  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f7efe5] text-stone-900">
      <section className="relative flex min-h-[76svh] items-end overflow-hidden text-white md:min-h-[640px]" aria-labelledby="cv-hero-title">
        <img src={data.hero.image} alt="" loading="eager" className="absolute inset-0 z-0 h-full w-full object-cover" />
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-stone-950 via-stone-950/35 to-transparent md:bg-[linear-gradient(90deg,rgba(32,24,18,0.84),rgba(32,24,18,0.48),rgba(32,24,18,0.12))]" />

        <div className="relative z-20 mx-auto w-full max-w-[1180px] px-3 pb-6 pt-24 md:px-5 md:pb-20">
          <div className="max-w-[760px] rounded-none border-0 bg-transparent p-0 md:rounded-[34px] md:border md:border-white/25 md:bg-white/15 md:p-12 md:shadow-2xl md:backdrop-blur">
            <span className="mb-4 inline-flex items-center gap-3 text-xs font-black uppercase tracking-[0.16em] text-white">
              <span className="h-px w-8 bg-current opacity-80" />
              {data.hero.kicker}
            </span>

            <h1 id="cv-hero-title" className="max-w-[10ch] text-[40px] font-black leading-[0.96] tracking-[-0.06em] text-white drop-shadow-xl md:text-[clamp(46px,7vw,86px)]">
              {data.hero.title}
            </h1>

            <p className="mt-4 max-w-[680px] text-sm leading-6 text-white/95 md:mt-5 md:text-lg md:leading-8">
              {data.hero.description}
            </p>

            <div className="mt-5 grid grid-cols-2 gap-2.5 md:mt-8 md:flex md:flex-wrap md:gap-3">
              <a className="inline-flex min-h-[50px] items-center justify-center rounded-2xl bg-gradient-to-br from-[#a87842] to-[#8e6607] px-3 text-center text-[10.5px] font-black uppercase leading-tight tracking-[0.08em] text-white shadow-lg transition hover:-translate-y-0.5 md:min-h-[54px] md:rounded-full md:px-7 md:text-xs" href={data.hero.primaryCta.href}>
                {data.hero.primaryCta.label}
              </a>

              <a className="inline-flex min-h-[50px] items-center justify-center rounded-2xl border border-white/40 bg-white/15 px-3 text-center text-[10.5px] font-black uppercase leading-tight tracking-[0.08em] text-white transition hover:-translate-y-0.5 hover:bg-white/25 md:min-h-[54px] md:rounded-full md:px-7 md:text-xs" href={data.hero.secondaryCta.href}>
                {data.hero.secondaryCta.label}
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[radial-gradient(circle_at_top_left,rgba(168,120,66,0.18),transparent_34rem),linear-gradient(180deg,#fbf6ef_0%,#f4eadf_52%,#fbf6ef_100%)] px-3 py-11 md:px-5 md:py-20" aria-labelledby="cv-intro-title">
        <div className="mx-auto grid max-w-[1180px] gap-5 md:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.75fr)] md:gap-8">
          <article className="rounded-[24px] border border-amber-900/10 bg-[#fffdfa] p-5 shadow-lg shadow-stone-900/5 md:rounded-[30px] md:p-8">
            <span className="mb-4 inline-flex items-center gap-3 text-xs font-black uppercase tracking-[0.16em] text-[#6a4b00]">
              <span className="h-px w-8 bg-current opacity-75" />
              {data.intro.kicker}
            </span>
            <h2 id="cv-intro-title" className="text-3xl font-black leading-none tracking-[-0.055em] md:text-[clamp(32px,4.6vw,58px)]">
              {data.intro.title}
            </h2>
            <p className="mt-5 text-sm leading-7 text-stone-600 md:text-base md:leading-8">
              {data.intro.description}
            </p>
          </article>

          <aside className="flex flex-col gap-4 rounded-[24px] border border-amber-900/10 bg-[#fffdfa] p-5 shadow-lg shadow-stone-900/5 md:flex-row md:rounded-[30px] md:p-8">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[22px] border border-amber-900/10 bg-[#fff4e5] text-3xl" aria-hidden="true">
              {data.intro.tip.icon}
            </div>

            <div>
              <h3 className="text-2xl font-black leading-none tracking-[-0.035em]">{data.intro.tip.title}</h3>
              <p className="mt-3 text-sm leading-7 text-stone-600 md:text-[15px]">{data.intro.tip.text}</p>
              <a className="mt-4 inline-flex text-xs font-black uppercase tracking-[0.09em] text-[#6a4b00] underline underline-offset-4" href={data.intro.tip.href}>
                {data.intro.tip.linkLabel}
              </a>
            </div>
          </aside>
        </div>
      </section>

      <section className="bg-[#f7efe5] px-3 pb-11 pt-2 md:px-5 md:pb-20" id="villages" aria-labelledby="cv-villages-title">
        <div className="mx-auto max-w-[1180px]">
          <header className="mx-auto mb-8 max-w-3xl text-center">
            <span className="mb-4 inline-flex items-center justify-center gap-3 text-xs font-black uppercase tracking-[0.16em] text-[#6a4b00]">
              <span className="h-px w-8 bg-current opacity-75" />
              {copy.villagesKicker}
              <span className="h-px w-8 bg-current opacity-75" />
            </span>
            <h2 id="cv-villages-title" className="text-3xl font-black leading-none tracking-[-0.055em] md:text-[clamp(32px,4.6vw,58px)]">
              {copy.villagesTitle}
            </h2>
            <p className="mt-4 text-sm leading-7 text-stone-600 md:text-base md:leading-8">{copy.villagesText}</p>
          </header>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4 xl:auto-rows-[280px]">
            {data.villages.map((village, index) => {
              const sizeClass =
                village.size === "large"
                  ? "xl:col-span-2 xl:row-span-2"
                  : village.size === "wide"
                    ? "xl:col-span-2"
                    : village.size === "tall"
                      ? "xl:row-span-2"
                      : "";

              const titleClass =
                village.size === "large"
                  ? "text-3xl xl:text-5xl"
                  : "text-3xl";

              return (
                <a
                  className={["group relative isolate flex min-h-[320px] items-end overflow-hidden rounded-[24px] bg-stone-900 p-5 text-white shadow-lg shadow-stone-900/10 transition hover:-translate-y-1 hover:shadow-2xl md:min-h-[300px] md:rounded-[28px] md:p-6", sizeClass].join(" ")}
                  href={village.href}
                  key={village.href}
                >
                  <img src={village.image} alt="" loading={index < 2 ? "eager" : "lazy"} className="absolute inset-0 -z-20 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 -z-10 bg-gradient-to-t from-stone-950 via-stone-950/60 to-stone-950/10" />

                  <div className="w-full">
                    <div className="mb-2 flex flex-wrap gap-2">
                      <span className="inline-flex min-h-7 items-center rounded-full border border-white/25 bg-white/15 px-2.5 text-[9px] font-black uppercase tracking-[0.08em]">{village.region}</span>
                      <span className="inline-flex min-h-7 items-center rounded-full border border-white/25 bg-white/15 px-2.5 text-[9px] font-black uppercase tracking-[0.08em]">{village.mood}</span>
                    </div>

                    <div className="mb-3 flex flex-wrap gap-2">
                      {village.badges.map((badge) => (
                        <span className="inline-flex min-h-7 items-center rounded-full bg-[#fff7ee]/95 px-2.5 text-[9px] font-black uppercase tracking-[0.08em] text-[#6a4b00]" key={badge}>
                          {badge}
                        </span>
                      ))}
                    </div>

                    <h3 className={["max-w-[11ch] font-black leading-none tracking-[-0.045em] text-white drop-shadow-xl", titleClass].join(" ")}>
                      {village.title}
                    </h3>
                    <p className="mt-3 max-w-[620px] text-[13px] leading-6 text-white/90 md:text-sm">
                      {village.description}
                    </p>

                    <strong className="mt-4 inline-flex text-[11px] font-black uppercase tracking-[0.1em] text-[#f2d9a8]">{copy.exploreVillage}</strong>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-[#f7efe5] px-3 py-11 md:px-5 md:py-16" aria-labelledby="cv-planning-title">
        <div className="mx-auto grid max-w-[1180px] gap-5 rounded-[24px] border border-amber-900/10 bg-[#fffdfa] p-5 shadow-lg shadow-stone-900/5 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:gap-7 md:rounded-[30px] md:p-8">
          <article>
            <span className="mb-4 inline-flex items-center gap-3 text-xs font-black uppercase tracking-[0.16em] text-[#6a4b00]">
              <span className="h-px w-8 bg-current opacity-75" />
              {data.planning.kicker}
            </span>
            <h2 id="cv-planning-title" className="text-3xl font-black leading-none tracking-[-0.055em] md:text-[clamp(32px,4.6vw,58px)]">
              {data.planning.title}
            </h2>
            <p className="mt-5 text-sm leading-7 text-stone-600 md:text-base md:leading-8">{data.planning.description}</p>
          </article>

          <div className="grid gap-3">
            {data.planning.items.map((item) => (
              <div className="flex gap-3 rounded-[20px] border border-amber-900/10 bg-[#fff7ee] p-4" key={item.title}>
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-amber-900/10 bg-white text-2xl" aria-hidden="true">{item.icon}</span>
                <div>
                  <h3 className="text-[17px] font-black leading-tight">{item.title}</h3>
                  <p className="mt-1.5 text-sm leading-6 text-stone-600">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f7efe5] px-3 pb-14 pt-0 md:px-5 md:pb-20" aria-labelledby="cv-stay-title">
        <div className="mx-auto max-w-[1180px]">
          <article className="rounded-[28px] border border-amber-900/10 bg-[#fffdfa] p-6 text-center shadow-lg shadow-stone-900/5 md:rounded-[34px] md:p-12">
            <span className="mb-4 inline-flex items-center justify-center gap-3 text-xs font-black uppercase tracking-[0.16em] text-[#6a4b00]">
              <span className="h-px w-8 bg-current opacity-75" />
              {data.stay.kicker}
            </span>
            <h2 id="cv-stay-title" className="text-3xl font-black leading-none tracking-[-0.055em] md:text-[clamp(32px,4.6vw,58px)]">
              {data.stay.title}
            </h2>
            <p className="mx-auto mt-5 max-w-3xl text-sm leading-7 text-stone-600 md:text-base md:leading-8">{data.stay.text}</p>

            <div className="mt-7 grid gap-3 md:flex md:justify-center">
              <a className="inline-flex min-h-[52px] items-center justify-center rounded-full bg-gradient-to-br from-[#a87842] to-[#8e6607] px-7 text-xs font-black uppercase tracking-[0.1em] text-white shadow-lg transition hover:-translate-y-0.5" href={data.stay.primaryCta.href}>
                {data.stay.primaryCta.label}
              </a>

              <a className="inline-flex min-h-[52px] items-center justify-center rounded-full border border-amber-900/15 bg-[#fff7ee] px-7 text-xs font-black uppercase tracking-[0.1em] text-[#6a4b00] transition hover:-translate-y-0.5" href={data.stay.secondaryCta.href}>
                {data.stay.secondaryCta.label}
              </a>
            </div>
          </article>
        </div>
      </section>
    </main>
  );`;

fs.writeFileSync(p, before + body + "\n}\n", "utf8");
console.log("OK: Tailwind return block written to " + p);
