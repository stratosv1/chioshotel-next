import type { ChiosMuseumsPageData } from "@/content/chios-museums";

type ChiosMuseumsPageProps = {
  data: ChiosMuseumsPageData;
};

const museumsPageUiCopy = {
  en: {
    museumsKicker: "Top Chios museums",
    museumsTitle: "A visual guide to Chios culture",
    museumsText:
      "From mastic culture and archaeology to Byzantine art, maritime history, rare books and village folklore, these museums reveal the deeper identity of Chios.",
    exploreMuseum: "Explore museum →",
    swipeHint: "Swipe to explore more museums",
  },
  el: {
    museumsKicker: "Κορυφαία μουσεία της Χίου",
    museumsTitle: "Οπτικός οδηγός στον πολιτισμό της Χίου",
    museumsText:
      "Από την κουλτούρα της μαστίχας και την αρχαιολογία μέχρι τη βυζαντινή τέχνη, τη ναυτική ιστορία, τα σπάνια βιβλία και τη λαογραφία, αυτά τα μουσεία αποκαλύπτουν τη βαθύτερη ταυτότητα της Χίου.",
    exploreMuseum: "Δείτε το μουσείο →",
    swipeHint: "Σύρετε για περισσότερα μουσεία",
  },
  fr: {
    museumsKicker: "Musées incontournables de Chios",
    museumsTitle: "Un guide visuel de la culture de Chios",
    museumsText:
      "De la culture du mastic et de l’archéologie à l’art byzantin, l’histoire maritime, les livres rares et le folklore villageois, ces musées révèlent l’identité profonde de Chios.",
    exploreMuseum: "Explorer le musée →",
    swipeHint: "Faites glisser pour voir plus de musées",
  },
  de: {
    museumsKicker: "Top-Museen auf Chios",
    museumsTitle: "Ein visueller Guide zur Kultur von Chios",
    museumsText:
      "Von Mastixkultur und Archäologie bis zu byzantinischer Kunst, maritimer Geschichte, seltenen Büchern und dörflicher Volkskunde zeigen diese Museen die tiefere Identität von Chios.",
    exploreMuseum: "Museum ansehen →",
    swipeHint: "Wischen Sie für weitere Museen",
  },
  it: {
    museumsKicker: "I migliori musei di Chios",
    museumsTitle: "Una guida visiva alla cultura di Chios",
    museumsText:
      "Dalla cultura del mastice e l’archeologia all’arte bizantina, la storia marittima, i libri rari e il folklore dei villaggi, questi musei rivelano l’identità più profonda di Chios.",
    exploreMuseum: "Esplora il museo →",
    swipeHint: "Scorri per altri musei",
  },
  es: {
    museumsKicker: "Museos imprescindibles de Chios",
    museumsTitle: "Una guía visual de la cultura de Chios",
    museumsText:
      "Desde la cultura de la mastiha y la arqueología hasta el arte bizantino, la historia marítima, los libros raros y el folclore de los pueblos, estos museos revelan la identidad más profunda de Chios.",
    exploreMuseum: "Explorar museo →",
    swipeHint: "Desliza para ver más museos",
  },
  tr: {
    museumsKicker: "Sakız Adası’nın öne çıkan müzeleri",
    museumsTitle: "Sakız kültürü için görsel bir rehber",
    museumsText:
      "Mastik kültürü ve arkeolojiden Bizans sanatına, denizcilik tarihine, nadir kitaplara ve köy folkloruna kadar bu müzeler Sakız Adası’nın daha derin kimliğini gösterir.",
    exploreMuseum: "Müzeyi keşfet →",
    swipeHint: "Daha fazla müze için kaydırın",
  },
} as const;

type MuseumsPageUiLanguage = keyof typeof museumsPageUiCopy;

function getMuseumsPageLanguage(data: ChiosMuseumsPageData): MuseumsPageUiLanguage {
  const path = data.seo.canonicalPath;

  if (path.startsWith("/el/")) return "el";
  if (path.startsWith("/fr/")) return "fr";
  if (path.startsWith("/de/")) return "de";
  if (path.startsWith("/it/")) return "it";
  if (path.startsWith("/es/")) return "es";
  if (path.startsWith("/tr/")) return "tr";

  return "en";
}

export function ChiosMuseumsPage({ data }: ChiosMuseumsPageProps) {
  const language = getMuseumsPageLanguage(data);
  const copy = museumsPageUiCopy[language];

  return (
    <main className="chios-museums-page">
      <section className="cm-hero" aria-labelledby="cm-hero-title">
        <div className="cm-hero-media" aria-hidden="true">
          <img src={data.hero.image} alt="" loading="eager" />
        </div>

        <div className="cm-hero-overlay" />

        <div className="cm-wrap cm-hero-inner">
          <div className="cm-hero-card">
            <span className="cm-kicker cm-kicker--light">{data.hero.kicker}</span>
            <h1 id="cm-hero-title">{data.hero.title}</h1>
            <p>{data.hero.description}</p>
            <div className="cm-hero-actions">
              <a className="cm-btn cm-btn--primary" href={data.hero.primaryCta.href}>
                {data.hero.primaryCta.label}
              </a>
              <a className="cm-btn cm-btn--secondary" href={data.hero.secondaryCta.href}>
                {data.hero.secondaryCta.label}
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="cm-section cm-section--intro" aria-labelledby="cm-intro-title">
        <div className="cm-wrap cm-intro-grid">
          <article className="cm-intro-copy">
            <span className="cm-kicker">{data.intro.kicker}</span>
            <h2 id="cm-intro-title">{data.intro.title}</h2>
            <p>{data.intro.description}</p>
          </article>

          <aside className="cm-tip-card">
            <div className="cm-tip-icon" aria-hidden="true">
              {data.intro.tip.icon}
            </div>
            <div>
              <h3>{data.intro.tip.title}</h3>
              <p>{data.intro.tip.text}</p>
              <a href={data.intro.tip.href}>{data.intro.tip.linkLabel}</a>
            </div>
          </aside>
        </div>
      </section>

      <section
        className="cm-section cm-section--museums"
        id="museums"
        aria-labelledby="cm-museums-title"
      >
        <div className="cm-wrap">
          <header className="cm-section-head">
            <span className="cm-kicker">{copy.museumsKicker}</span>
            <h2 id="cm-museums-title">{copy.museumsTitle}</h2>
            <p>{copy.museumsText}</p>
            <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.1em] text-[#8e6607] shadow-sm ring-1 ring-[#8e6607]/10 md:hidden">
              {copy.swipeHint} <span aria-hidden="true">→</span>
            </p>
          </header>

          <div className="relative">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute right-2 top-[38%] z-20 flex h-10 w-10 items-center justify-center rounded-full bg-[#2f261f]/95 text-xl font-black text-white shadow-xl md:hidden"
            >
              →
            </div>
            <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-5 pr-10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:grid md:grid-cols-2 md:overflow-visible md:pr-0 xl:grid-cols-3">
              {data.museums.map((museum, index) => (
                <a
                  className="group w-[84vw] max-w-[380px] flex-none snap-start overflow-hidden rounded-[1.5rem] bg-white shadow-lg shadow-stone-900/5 ring-1 ring-amber-900/10 transition hover:shadow-xl md:w-auto md:max-w-none md:rounded-[2rem]"
                  href={museum.href}
                  key={museum.href}
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={museum.image}
                      alt={museum.imageAlt}
                      loading={index < 2 ? "eager" : "lazy"}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                    <span className="absolute left-3 top-3 rounded-full bg-amber-700 px-3 py-1.5 text-xs font-black text-white">
                      {museum.region}
                    </span>
                    <span className="absolute right-3 top-3 rounded-full bg-white/95 px-3 py-1.5 text-xs font-black text-amber-800">
                      {museum.mood}
                    </span>
                  </div>

                  <div className="p-5">
                    <div className="mb-4 flex flex-wrap gap-2">
                      {museum.badges.slice(0, 2).map((badge) => (
                        <span
                          className="rounded-full bg-[#fff4df] px-3 py-1 text-[10px] font-black uppercase tracking-[0.08em] text-[#6a4b00] ring-1 ring-[#8e6607]/20"
                          key={badge}
                        >
                          {badge}
                        </span>
                      ))}
                    </div>
                    <h3 className="break-words font-serif text-2xl font-bold leading-tight text-amber-800">
                      {museum.title}
                    </h3>
                    <p className="mt-3 line-clamp-3 text-sm leading-7 text-stone-600">
                      {museum.description}
                    </p>
                    <span className="mt-5 inline-flex rounded-full border border-amber-800/20 px-4 py-2 text-xs font-black uppercase text-amber-800">
                      {copy.exploreMuseum}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="cm-section cm-section--planning" aria-labelledby="cm-planning-title">
        <div className="cm-wrap cm-planning-grid">
          <article>
            <span className="cm-kicker">{data.planning.kicker}</span>
            <h2 id="cm-planning-title">{data.planning.title}</h2>
            <p>{data.planning.description}</p>
          </article>

          <div className="cm-planning-list">
            {data.planning.items.map((item) => (
              <div className="cm-planning-item" key={item.title}>
                <span aria-hidden="true">{item.icon}</span>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cm-section cm-section--stay" aria-labelledby="cm-stay-title">
        <div className="cm-wrap">
          <article className="cm-stay-card">
            <span className="cm-kicker">{data.stay.kicker}</span>
            <h2 id="cm-stay-title">{data.stay.title}</h2>
            <p>{data.stay.text}</p>
            <div className="cm-stay-actions">
              <a className="cm-btn cm-btn--primary" href={data.stay.primaryCta.href}>
                {data.stay.primaryCta.label}
              </a>
              <a className="cm-btn cm-btn--outline" href={data.stay.secondaryCta.href}>
                {data.stay.secondaryCta.label}
              </a>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}
