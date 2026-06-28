import type { ChiosBeachesPageData } from "@/content/chios-beaches";

type ChiosBeachesPageProps = {
  data: ChiosBeachesPageData;
};

const beachesPageUiCopy = {
  en: {
    beachesKicker: "Top Chios beaches",
    beachesTitle: "A visual guide to the island’s coast",
    beachesText:
      "From volcanic black pebbles to golden sand and hidden emerald coves, these are the Chios beaches worth planning your days around.",
    exploreBeach: "Explore beach →",
  },
  el: {
    beachesKicker: "Κορυφαίες παραλίες της Χίου",
    beachesTitle: "Οπτικός οδηγός στις ακτές του νησιού",
    beachesText:
      "Από ηφαιστειακά μαύρα βότσαλα μέχρι χρυσαφένια άμμο και κρυφούς σμαραγδένιους όρμους, αυτές είναι οι παραλίες της Χίου που αξίζει να βάλετε στο πρόγραμμά σας.",
    exploreBeach: "Δείτε την παραλία →",
  },
  fr: {
    beachesKicker: "Plus belles plages de Chios",
    beachesTitle: "Un guide visuel du littoral de l’île",
    beachesText:
      "Des galets noirs volcaniques au sable doré et aux criques émeraude cachées, voici les plages de Chios autour desquelles organiser vos journées.",
    exploreBeach: "Explorer la plage →",
  },
  de: {
    beachesKicker: "Top-Strände auf Chios",
    beachesTitle: "Ein visueller Guide zur Küste der Insel",
    beachesText:
      "Von vulkanischen schwarzen Kieseln bis zu goldenem Sand und versteckten smaragdgrünen Buchten: Diese Strände auf Chios lohnen sich für Ihre Tagesplanung.",
    exploreBeach: "Strand ansehen →",
  },
  it: {
    beachesKicker: "Le migliori spiagge di Chios",
    beachesTitle: "Una guida visiva alla costa dell’isola",
    beachesText:
      "Dai ciottoli neri vulcanici alla sabbia dorata e alle calette color smeraldo nascoste, queste sono le spiagge di Chios da inserire nel vostro itinerario.",
    exploreBeach: "Esplora la spiaggia →",
  },
  es: {
    beachesKicker: "Mejores playas de Chios",
    beachesTitle: "Una guía visual de la costa de la isla",
    beachesText:
      "Desde guijarros negros volcánicos hasta arena dorada y calas escondidas de color esmeralda, estas son las playas de Chios que merece la pena planificar.",
    exploreBeach: "Explorar playa →",
  },
  tr: {
    beachesKicker: "Sakız Adası’nın öne çıkan plajları",
    beachesTitle: "Adanın kıyıları için görsel bir rehber",
    beachesText:
      "Volkanik siyah çakıllardan altın kumlara ve gizli zümrüt koylara kadar, günlerinizi planlamaya değer Sakız Adası plajları burada.",
    exploreBeach: "Plajı keşfet →",
  },
} as const;

type BeachesPageUiLanguage = keyof typeof beachesPageUiCopy;

function getBeachesPageLanguage(
  data: ChiosBeachesPageData,
): BeachesPageUiLanguage {
  const path = data.seo.canonicalPath;

  if (path.startsWith("/el/")) return "el";
  if (path.startsWith("/fr/")) return "fr";
  if (path.startsWith("/de/")) return "de";
  if (path.startsWith("/it/")) return "it";
  if (path.startsWith("/es/")) return "es";
  if (path.startsWith("/tr/")) return "tr";

  return "en";
}

function getBeachCardClass(size: string) {
  const base =
    "group relative min-h-[360px] overflow-hidden rounded-[30px] border border-white/55 bg-stone-900 shadow-xl transition duration-300 hover:-translate-y-1 hover:shadow-2xl";

  if (size === "large") {
    return `${base} md:col-span-2 md:row-span-2 md:min-h-[560px]`;
  }

  if (size === "wide") {
    return `${base} md:col-span-2`;
  }

  return base;
}

export function ChiosBeachesPageTailwind({ data }: ChiosBeachesPageProps) {
  const language = getBeachesPageLanguage(data);
  const copy = beachesPageUiCopy[language];

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#eef7f4] text-slate-950">
      <section
        className="relative flex min-h-[64svh] items-end overflow-hidden text-white md:min-h-[520px]"
        aria-labelledby="cb-hero-title"
      >
        <img
          src={data.hero.image}
          alt=""
          loading="eager"
          className="absolute inset-0 z-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-slate-950 via-slate-950/45 to-transparent md:bg-[linear-gradient(90deg,rgba(2,34,44,0.86),rgba(2,34,44,0.46),rgba(2,34,44,0.08))]" />

        <div className="relative z-20 mx-auto w-full max-w-[1180px] px-3 pb-6 pt-24 md:px-5 md:pb-20">
          <div className="max-w-[760px] rounded-none border-0 bg-transparent p-0 md:rounded-[34px] md:border md:border-white/25 md:bg-white/15 md:p-12 md:shadow-2xl md:backdrop-blur">
            <span className="mb-4 inline-flex items-center gap-3 text-xs font-black uppercase tracking-[0.16em] text-white">
              <span className="h-px w-8 bg-current opacity-80" />
              {data.hero.kicker}
            </span>

            <h1
              id="cb-hero-title"
              className="max-w-[11ch] text-[40px] font-black leading-[0.96] tracking-[-0.06em] text-white drop-shadow-xl md:text-[clamp(46px,7vw,86px)]"
            >
              {data.hero.title}
            </h1>

            <p className="mt-4 max-w-[680px] text-sm leading-6 text-white/95 md:mt-5 md:text-lg md:leading-8">
              {data.hero.description}
            </p>

            <div className="mt-5 grid grid-cols-2 gap-2.5 md:mt-8 md:flex md:flex-wrap md:gap-3">
              <a
                className="inline-flex min-h-[50px] items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-700 to-teal-700 px-3 text-center text-[10.5px] font-black uppercase leading-tight tracking-[0.08em] text-white shadow-lg transition hover:-translate-y-0.5 md:min-h-[54px] md:rounded-full md:px-7 md:text-xs"
                href={data.hero.primaryCta.href}
              >
                {data.hero.primaryCta.label}
              </a>

              <a
                className="inline-flex min-h-[50px] items-center justify-center rounded-2xl border border-white/40 bg-white/15 px-3 text-center text-[10.5px] font-black uppercase leading-tight tracking-[0.08em] text-white transition hover:-translate-y-0.5 hover:bg-white/25 md:min-h-[54px] md:rounded-full md:px-7 md:text-xs"
                href={data.hero.secondaryCta.href}
              >
                {data.hero.secondaryCta.label}
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="px-3 py-14 md:px-5 md:py-24" aria-labelledby="cb-intro-title">
        <div className="mx-auto grid max-w-[1180px] gap-5 md:grid-cols-[1.35fr_0.65fr]">
          <article className="rounded-[32px] bg-white/80 p-6 shadow-lg ring-1 ring-slate-900/5 md:p-10">
            <span className="text-xs font-black uppercase tracking-[0.16em] text-cyan-800">
              {data.intro.kicker}
            </span>
            <h2
              id="cb-intro-title"
              className="mt-3 max-w-[12ch] text-3xl font-black leading-none tracking-[-0.05em] text-slate-950 md:text-5xl"
            >
              {data.intro.title}
            </h2>
            <p className="mt-4 max-w-[720px] text-base leading-8 text-slate-700">
              {data.intro.description}
            </p>
          </article>

          <aside className="flex gap-4 rounded-[32px] bg-slate-950 p-6 text-white shadow-lg md:p-8">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-cyan-400/15 text-2xl">
              {data.intro.tip.icon}
            </div>
            <div>
              <h3 className="text-xl font-black tracking-[-0.03em]">{data.intro.tip.title}</h3>
              <p className="mt-2 text-sm leading-6 text-white/75">{data.intro.tip.text}</p>
              <a className="mt-4 inline-flex text-sm font-black text-cyan-200" href={data.intro.tip.href}>
                {data.intro.tip.linkLabel}
              </a>
            </div>
          </aside>
        </div>
      </section>

      <section id="beaches" className="px-3 py-14 md:px-5 md:py-24" aria-labelledby="cb-beaches-title">
        <div className="mx-auto max-w-[1180px]">
          <header className="mb-8 max-w-[760px] md:mb-12">
            <span className="text-xs font-black uppercase tracking-[0.16em] text-cyan-800">
              {copy.beachesKicker}
            </span>
            <h2
              id="cb-beaches-title"
              className="mt-3 text-3xl font-black leading-none tracking-[-0.05em] text-slate-950 md:text-5xl"
            >
              {copy.beachesTitle}
            </h2>
            <p className="mt-4 text-base leading-8 text-slate-700">{copy.beachesText}</p>
          </header>

          <div className="grid auto-rows-[minmax(340px,auto)] gap-4 md:grid-cols-4 md:gap-5">
            {data.beaches.map((beach, index) => (
              <a className={getBeachCardClass(beach.size)} href={beach.href} key={beach.href}>
                <img
                  src={beach.image}
                  alt=""
                  loading={index < 2 ? "eager" : "lazy"}
                  className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/20 to-transparent" />

                <div className="absolute inset-x-0 bottom-0 z-10 p-5 text-white md:p-7">
                  <div className="mb-3 flex flex-wrap gap-2 text-[11px] font-black uppercase tracking-[0.12em] text-white/80">
                    <span>{beach.region}</span>
                    <span>•</span>
                    <span>{beach.mood}</span>
                  </div>

                  <div className="mb-4 flex flex-wrap gap-2">
                    {beach.badges.map((badge) => (
                      <span
                        className="rounded-full border border-white/25 bg-white/15 px-3 py-1 text-[11px] font-bold text-white backdrop-blur"
                        key={badge}
                      >
                        {badge}
                      </span>
                    ))}
                  </div>

                  <h3 className="text-2xl font-black tracking-[-0.04em] md:text-3xl">{beach.title}</h3>
                  <p className="mt-2 line-clamp-3 text-sm leading-6 text-white/82">{beach.description}</p>
                  <strong className="mt-4 inline-flex text-sm font-black text-cyan-100">
                    {copy.exploreBeach}
                  </strong>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="px-3 py-14 md:px-5 md:py-24" aria-labelledby="cb-planning-title">
        <div className="mx-auto grid max-w-[1180px] gap-5 rounded-[36px] bg-white p-5 shadow-xl ring-1 ring-slate-900/5 md:grid-cols-[0.9fr_1.1fr] md:p-10">
          <article>
            <span className="text-xs font-black uppercase tracking-[0.16em] text-cyan-800">
              {data.planning.kicker}
            </span>
            <h2
              id="cb-planning-title"
              className="mt-3 text-3xl font-black leading-none tracking-[-0.05em] md:text-5xl"
            >
              {data.planning.title}
            </h2>
            <p className="mt-4 text-base leading-8 text-slate-700">{data.planning.description}</p>
          </article>

          <div className="grid gap-3">
            {data.planning.items.map((item) => (
              <div className="flex gap-4 rounded-[26px] bg-[#eef7f4] p-5" key={item.title}>
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-xl shadow-sm">
                  {item.icon}
                </span>
                <div>
                  <h3 className="font-black tracking-[-0.03em]">{item.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-700">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-3 py-14 md:px-5 md:py-24" aria-labelledby="cb-stay-title">
        <div className="mx-auto max-w-[1180px]">
          <article className="overflow-hidden rounded-[38px] bg-gradient-to-br from-slate-950 to-cyan-950 p-7 text-white shadow-2xl md:p-12">
            <span className="text-xs font-black uppercase tracking-[0.16em] text-cyan-200">
              {data.stay.kicker}
            </span>
            <h2
              id="cb-stay-title"
              className="mt-3 max-w-[760px] text-3xl font-black leading-none tracking-[-0.05em] md:text-5xl"
            >
              {data.stay.title}
            </h2>
            <p className="mt-4 max-w-[780px] text-base leading-8 text-white/78">{data.stay.text}</p>

            <div className="mt-7 grid grid-cols-2 gap-2.5 md:flex md:flex-wrap md:gap-3">
              <a
                className="inline-flex min-h-[50px] items-center justify-center rounded-2xl bg-white px-3 text-center text-[10.5px] font-black uppercase tracking-[0.08em] !text-slate-950 transition hover:-translate-y-0.5 md:rounded-full md:px-7 md:text-xs"
                href={data.stay.primaryCta.href}
              >
                {data.stay.primaryCta.label || "View rooms"}
              </a>

              <a
                className="inline-flex min-h-[50px] items-center justify-center rounded-2xl border border-white/35 px-3 text-center text-[10.5px] font-black uppercase tracking-[0.08em] text-white transition hover:-translate-y-0.5 hover:bg-white/10 md:rounded-full md:px-7 md:text-xs"
                href={data.stay.secondaryCta.href}
              >
                {data.stay.secondaryCta.label}
              </a>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}




