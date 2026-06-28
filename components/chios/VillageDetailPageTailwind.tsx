import type { VillageDetailData } from "@/content/village-details";
import { localizedVillageDetails, villageDetails } from "@/content/village-details";

type VillageDetailPageProps = {
  village: VillageDetailData;
};

const villageUiCopy = {
  en: {
    tagsLabel: "Village tags",
    detailsLabel: "Village details",
    storyKicker: "Village guide",
    routesKicker: "Route ideas",
    localTipLabel: "Voulamandis House local tip",
    relatedKicker: "Chios village guide",
    exploreVillage: "Explore village →",
  },
  el: {
    tagsLabel: "Χαρακτηριστικά χωριού",
    detailsLabel: "Πληροφορίες χωριού",
    storyKicker: "Οδηγός χωριού",
    routesKicker: "Ιδέες διαδρομής",
    localTipLabel: "Τοπική συμβουλή από το Voulamandis House",
    relatedKicker: "Οδηγός χωριών Χίου",
    exploreVillage: "Δείτε το χωριό →",
  },
  fr: {
    tagsLabel: "Caractéristiques du village",
    detailsLabel: "Détails du village",
    storyKicker: "Guide du village",
    routesKicker: "Idées d’itinéraire",
    localTipLabel: "Conseil local de Voulamandis House",
    relatedKicker: "Guide des villages de Chios",
    exploreVillage: "Explorer le village →",
  },
  de: {
    tagsLabel: "Dorfmerkmale",
    detailsLabel: "Dorfdetails",
    storyKicker: "Dorfführer",
    routesKicker: "Routenideen",
    localTipLabel: "Lokaler Tipp von Voulamandis House",
    relatedKicker: "Dorfführer für Chios",
    exploreVillage: "Dorf ansehen →",
  },
  it: {
    tagsLabel: "Caratteristiche del villaggio",
    detailsLabel: "Dettagli del villaggio",
    storyKicker: "Guida del villaggio",
    routesKicker: "Idee di itinerario",
    localTipLabel: "Consiglio locale di Voulamandis House",
    relatedKicker: "Guida ai villaggi di Chios",
    exploreVillage: "Esplora il villaggio →",
  },
  es: {
    tagsLabel: "Características del pueblo",
    detailsLabel: "Detalles del pueblo",
    storyKicker: "Guía del pueblo",
    routesKicker: "Ideas de ruta",
    localTipLabel: "Consejo local de Voulamandis House",
    relatedKicker: "Guía de pueblos de Chios",
    exploreVillage: "Explorar pueblo →",
  },
  tr: {
    tagsLabel: "Köy özellikleri",
    detailsLabel: "Köy detayları",
    storyKicker: "Köy rehberi",
    routesKicker: "Rota fikirleri",
    localTipLabel: "Voulamandis House yerel tavsiyesi",
    relatedKicker: "Sakız Adası köy rehberi",
    exploreVillage: "Köyü keşfet →",
  },
} as const;

type VillageUiLanguage = keyof typeof villageUiCopy;

function getVillageLanguage(village: VillageDetailData): VillageUiLanguage {
  const path = village.seo.canonicalPath;

  if (path.startsWith("/el/")) {
    return "el";
  }

  if (path.startsWith("/fr/")) {
    return "fr";
  }

  if (path.startsWith("/de/")) {
    return "de";
  }

  if (path.startsWith("/it/")) {
    return "it";
  }

  if (path.startsWith("/es/")) {
    return "es";
  }

  if (path.startsWith("/tr/")) {
    return "tr";
  }

  return "en";
}

function getVillageCollectionForLanguage(language: VillageUiLanguage) {
  if (language === "en") {
    return villageDetails;
  }

  return localizedVillageDetails.filter((relatedVillage) =>
    relatedVillage.seo.canonicalPath.startsWith(`/${language}/`),
  );
}

function getRelatedCardSize(index: number) {
  if (index === 0) {
    return "large";
  }

  if (index === 1 || index === 5) {
    return "wide";
  }

  return "normal";
}

function getBadgeFromVillage(village: VillageDetailData) {
  const firstTag = village.hero.tags[0];

  if (!firstTag) {
    return village.hero.kicker;
  }

  return firstTag.replace(/^#/, "").replaceAll("_", " ");
}

export function VillageDetailPageTailwind({ village }: VillageDetailPageProps) {
  const language = getVillageLanguage(village);
  const copy = villageUiCopy[language];

  const relatedVillages = getVillageCollectionForLanguage(language).filter(
    (relatedVillage) =>
      relatedVillage.seo.canonicalPath !== village.seo.canonicalPath,
  );

  return (
    <main className="overflow-hidden bg-[#f6efe5] text-[#2f261f]">
      <section
        className="relative flex min-h-[68svh] items-end overflow-hidden text-white md:min-h-[640px]"
        aria-labelledby="village-hero-title"
      >
        <img
          src={village.hero.image}
          alt=""
          loading="eager"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/45 to-black/10" aria-hidden="true" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/10" aria-hidden="true" />

        <div className="relative z-10 mx-auto w-full max-w-[1180px] px-4 py-16 md:px-6 md:py-24">
          <div className="max-w-[760px] rounded-[36px] border border-white/25 bg-black/35 p-6 shadow-2xl backdrop-blur-md md:p-10">
            <span className="mb-4 inline-flex items-center gap-3 text-xs font-black uppercase tracking-[0.18em] text-white/90 before:h-px before:w-8 before:bg-current">
              {village.hero.kicker}
            </span>

            <h1
              id="village-hero-title"
              className="max-w-[12ch] text-[42px] font-black leading-[0.95] tracking-[-0.055em] text-white drop-shadow-xl md:text-[clamp(54px,7vw,88px)]"
            >
              {village.hero.title}
            </h1>

            <p className="mt-6 max-w-[650px] text-base font-semibold leading-8 text-white/90 md:text-lg">
              {village.hero.description}
            </p>

            <div className="mt-7 flex flex-wrap gap-2" aria-label={copy.tagsLabel}>
              {village.hero.tags.map((tag) => (
                <span
                  className="rounded-full border border-white/25 bg-white/15 px-3 py-2 text-[11px] font-black uppercase tracking-[0.08em] text-white backdrop-blur"
                  key={tag}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-12 md:px-6 md:py-18" aria-label={copy.detailsLabel}>
        <div className="mx-auto grid max-w-[1180px] gap-5 md:grid-cols-3">
          {village.details.map((detail) => (
            <article
              className="rounded-[28px] border border-[#8e6607]/15 bg-white p-6 shadow-xl shadow-black/5"
              key={detail.title}
            >
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#fff4df] text-3xl shadow-sm" aria-hidden="true">
                {detail.icon}
              </div>
              <h2 className="text-xl font-black leading-tight tracking-[-0.03em] text-[#2f261f]">
                {detail.title}
              </h2>
              <p className="mt-3 text-sm leading-7 text-[#574b3f]">
                {detail.text}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="px-4 py-14 md:px-6 md:py-20" aria-labelledby="village-story-title">
        <div className="mx-auto grid max-w-[1180px] gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <article className="rounded-[34px] border border-[#8e6607]/15 bg-white p-6 shadow-xl shadow-black/5 md:p-10">
            <span className="text-xs font-black uppercase tracking-[0.16em] text-[#8e6607]">
              {copy.storyKicker}
            </span>

            <h2
              id="village-story-title"
              className="mt-4 text-3xl font-black leading-none tracking-[-0.05em] text-[#2f261f] md:text-5xl"
            >
              {village.experience.title}
            </h2>

            <div className="mt-6 space-y-5">
              {village.experience.paragraphs.map((paragraph) => (
                <p className="text-base leading-8 text-[#574b3f] md:text-lg" key={paragraph}>
                  {paragraph}
                </p>
              ))}
            </div>
          </article>

          <aside className="rounded-[34px] bg-gradient-to-br from-[#3a2a1d] to-[#8e6607] p-6 text-white shadow-2xl md:p-9">
            <h2 className="text-2xl font-black leading-tight tracking-[-0.04em] text-white md:text-3xl">
              {village.highlights.title}
            </h2>

            <ul className="mt-6 space-y-4">
              {village.highlights.items.map((item) => (
                <li className="flex gap-3 text-sm font-semibold leading-7 text-white/90" key={item}>
                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#f5d08a]" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </section>

      <section className="px-4 py-14 md:px-6 md:py-20" aria-labelledby="village-routes-title">
        <div className="mx-auto max-w-[1180px]">
          <header className="mb-8 max-w-[820px]">
            <span className="text-xs font-black uppercase tracking-[0.16em] text-[#8e6607]">
              {copy.routesKicker}
            </span>
            <h2
              id="village-routes-title"
              className="mt-4 text-3xl font-black leading-none tracking-[-0.05em] text-[#2f261f] md:text-5xl"
            >
              {village.routeIdeas.title}
            </h2>
          </header>

          <div className="grid gap-5 md:grid-cols-3">
            {village.routeIdeas.items.map((item) => (
              <article
                className="rounded-[28px] border border-[#8e6607]/15 bg-[#fffdfa] p-6 shadow-xl shadow-black/5"
                key={item.title}
              >
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#fff4df] text-3xl shadow-sm" aria-hidden="true">
                  {item.icon}
                </div>
                <h3 className="text-xl font-black leading-tight tracking-[-0.03em] text-[#2f261f]">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-[#574b3f]">
                  {item.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-14 md:px-6 md:py-20" aria-label={copy.localTipLabel}>
        <div className="mx-auto max-w-[1180px]">
          <article className="grid overflow-hidden rounded-[36px] border border-[#8e6607]/15 bg-white shadow-2xl shadow-black/10 md:grid-cols-[0.9fr_1.1fr]">
            <div className="relative min-h-[260px] overflow-hidden bg-[#efe0cc] md:min-h-[360px]">
              <img
                src="/images/beaches/voulamandis-house-chios-courtyard-hero-desktop.webp"
                alt="Voulamandis House in Kampos, Chios"
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/5 to-transparent" aria-hidden="true" />
              <span className="absolute bottom-5 left-5 rounded-full border border-white/30 bg-white/20 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-white backdrop-blur-md">
                Voulamandis House
              </span>
            </div>

            <div className="flex flex-col justify-center p-6 md:p-10">
              <span className="mb-4 inline-flex w-fit items-center gap-3 rounded-full bg-[#fff4df] px-4 py-2 text-[11px] font-black uppercase tracking-[0.14em] text-[#8e6607] ring-1 ring-[#8e6607]/15">
                {village.baseTip.icon} Voulamandis House
              </span>

              <h2 className="text-3xl font-black leading-none tracking-[-0.05em] text-[#2f261f] md:text-5xl">
                {village.baseTip.title}
              </h2>

              <p className="mt-5 text-base leading-8 text-[#574b3f] md:text-lg">
                {village.baseTip.text}{" "}
                <a className="font-black text-[#8e6607] underline decoration-[#8e6607]/30 underline-offset-4" href={village.baseTip.href}>
                  {village.baseTip.linkLabel}
                </a>
              </p>
            </div>
          </article>
        </div>
      </section>

      <section className="px-4 py-14 md:px-6 md:py-20" aria-labelledby="village-related-title">
        <div className="mx-auto max-w-[1180px]">
          <header className="mb-8 max-w-[820px]">
            <span className="text-xs font-black uppercase tracking-[0.16em] text-[#8e6607]">
              {copy.relatedKicker}
            </span>
            <h2
              id="village-related-title"
              className="mt-4 text-3xl font-black leading-none tracking-[-0.05em] text-[#2f261f] md:text-5xl"
            >
              {village.relatedTitle}
            </h2>
            <p className="mt-5 max-w-[760px] text-base leading-8 text-[#574b3f] md:text-lg">
              {village.relatedText}
            </p>
          </header>

          <div className="grid items-stretch gap-7 md:grid-cols-2 xl:grid-cols-3">
            {relatedVillages.slice(0, 6).map((related, index) => (
              <a
                className="group flex min-h-[520px] flex-col overflow-hidden rounded-[30px] bg-white shadow-xl shadow-black/10 ring-1 ring-[#8e6607]/10 transition duration-300 hover:-translate-y-1 hover:shadow-2xl"
                href={related.seo.canonicalPath}
                key={related.seo.canonicalPath}
              >
                <div className="h-[240px] w-full shrink-0 overflow-hidden bg-white">
                  <img
                    src={related.hero.image}
                    alt=""
                    loading={index < 2 ? "eager" : "lazy"}
                    className="block h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                </div>

                <div className="flex flex-1 flex-col bg-white p-6 text-[#2f261f] md:p-7">
                  <span className="mb-4 w-fit rounded-full bg-[#fff4df] px-3 py-2 text-[10px] font-black uppercase tracking-[0.08em] text-[#6a4b00] ring-1 ring-[#8e6607]/20">
                    {getBadgeFromVillage(related)}
                  </span>

                  <h3 className="text-2xl font-black leading-[0.95] tracking-[-0.05em] text-[#2f261f] md:text-3xl">
                    {related.hero.title}
                  </h3>

                  <p className="mt-3 line-clamp-3 text-sm font-semibold leading-6 text-[#574b3f]">
                    {related.seo.description}
                  </p>

                  <strong className="mt-auto inline-flex pt-6 text-xs font-black uppercase tracking-[0.12em] text-[#8e6607]">
                    {copy.exploreVillage}
                  </strong>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

