import Image from "next/image";
import type { MuseumDetailData } from "@/content/museum-details";
import { localizedMuseumDetails, museumDetails } from "@/content/museum-details";
import { getSiteNavigationPath } from "@/lib/site-navigation";

type MuseumDetailPageProps = {
  museum: MuseumDetailData;
};

const museumUiCopy = {
  en: {
    tagsLabel: "Museum tags",
    detailsLabel: "Museum details",
    storyKicker: "Museum guide",
    routesKicker: "Route ideas",
    localTipLabel: "Voulamandis House local tip",
    relatedKicker: "Chios museum guide",
    exploreMuseum: "Explore museum →",
    swipeHint: "Swipe to explore more museums",
    viewRooms: "View rooms & apartments",
    checkRates: "Check direct rates",
  },
  el: {
    tagsLabel: "Χαρακτηριστικά μουσείου",
    detailsLabel: "Πληροφορίες μουσείου",
    storyKicker: "Οδηγός μουσείου",
    routesKicker: "Ιδέες διαδρομής",
    localTipLabel: "Τοπική συμβουλή από το Voulamandis House",
    relatedKicker: "Οδηγός μουσείων Χίου",
    exploreMuseum: "Δείτε το μουσείο →",
    swipeHint: "Σύρετε για περισσότερα μουσεία",
    viewRooms: "Δωμάτια & διαμερίσματα",
    checkRates: "Δείτε απευθείας τιμές",
  },
  fr: {
    tagsLabel: "Caractéristiques du musée",
    detailsLabel: "Détails du musée",
    storyKicker: "Guide du musée",
    routesKicker: "Idées d’itinéraire",
    localTipLabel: "Conseil local de Voulamandis House",
    relatedKicker: "Guide des musées de Chios",
    exploreMuseum: "Explorer le musée →",
    swipeHint: "Faites glisser pour voir plus de musées",
    viewRooms: "Voir chambres & appartements",
    checkRates: "Voir les tarifs directs",
  },
  de: {
    tagsLabel: "Museumsmerkmale",
    detailsLabel: "Museumsdetails",
    storyKicker: "Museumsführer",
    routesKicker: "Routenideen",
    localTipLabel: "Lokaler Tipp von Voulamandis House",
    relatedKicker: "Museumsführer für Chios",
    exploreMuseum: "Museum ansehen →",
    swipeHint: "Wischen Sie für weitere Museen",
    viewRooms: "Zimmer & Apartments ansehen",
    checkRates: "Direktpreise prüfen",
  },
  it: {
    tagsLabel: "Caratteristiche del museo",
    detailsLabel: "Dettagli del museo",
    storyKicker: "Guida del museo",
    routesKicker: "Idee di itinerario",
    localTipLabel: "Consiglio locale di Voulamandis House",
    relatedKicker: "Guida ai musei di Chios",
    exploreMuseum: "Esplora il museo →",
    swipeHint: "Scorri per vedere altri musei",
    viewRooms: "Vedi camere & appartamenti",
    checkRates: "Controlla le tariffe dirette",
  },
  es: {
    tagsLabel: "Características del museo",
    detailsLabel: "Detalles del museo",
    storyKicker: "Guía del museo",
    routesKicker: "Ideas de ruta",
    localTipLabel: "Consejo local de Voulamandis House",
    relatedKicker: "Guía de museos de Chios",
    exploreMuseum: "Explorar museo →",
    swipeHint: "Desliza para ver más museos",
    viewRooms: "Ver habitaciones & apartamentos",
    checkRates: "Consultar tarifas directas",
  },
  tr: {
    tagsLabel: "Müze özellikleri",
    detailsLabel: "Müze detayları",
    storyKicker: "Müze rehberi",
    routesKicker: "Rota fikirleri",
    localTipLabel: "Voulamandis House yerel tavsiyesi",
    relatedKicker: "Sakız Adası müze rehberi",
    exploreMuseum: "Müzeyi keşfet →",
    swipeHint: "Daha fazla müze için kaydırın",
    viewRooms: "Oda & daireleri görün",
    checkRates: "Doğrudan fiyatları görün",
  },
} as const;

type MuseumUiLanguage = keyof typeof museumUiCopy;

function getMuseumLanguage(museum: MuseumDetailData): MuseumUiLanguage {
  const path = museum.seo.canonicalPath;

  if (path.startsWith("/el/")) return "el";
  if (path.startsWith("/fr/")) return "fr";
  if (path.startsWith("/de/")) return "de";
  if (path.startsWith("/it/")) return "it";
  if (path.startsWith("/es/")) return "es";
  if (path.startsWith("/tr/")) return "tr";

  return "en";
}

function getMuseumCollectionForLanguage(language: MuseumUiLanguage) {
  if (language === "en") {
    return museumDetails;
  }

  return localizedMuseumDetails.filter((relatedMuseum) =>
    relatedMuseum.seo.canonicalPath.startsWith(`/${language}/`),
  );
}

function getRelatedCardClass(index: number) {
  if (index === 0) {
    return "md:col-span-2 md:row-span-2";
  }

  if (index === 1 || index === 5) {
    return "md:col-span-2";
  }

  return "";
}

function getBadgeFromMuseum(museum: MuseumDetailData) {
  const firstTag = museum.hero.tags[0];

  if (!firstTag) {
    return museum.hero.kicker;
  }

  return firstTag.replace(/^#/, "").replaceAll("_", " ");
}

export function MuseumDetailPage({ museum }: MuseumDetailPageProps) {
  const language = getMuseumLanguage(museum);
  const copy = museumUiCopy[language];

  const relatedMuseums = getMuseumCollectionForLanguage(language).filter(
    (relatedMuseum) => relatedMuseum.seo.canonicalPath !== museum.seo.canonicalPath,
  );

  return (
    <main className="min-h-screen overflow-x-hidden bg-[radial-gradient(circle_at_top_left,rgba(168,120,66,.14),transparent_34rem),linear-gradient(180deg,#fbf6ef_0%,#f4eadf_52%,#fbf6ef_100%)] pb-16 text-stone-800">
      <section className="relative flex min-h-[640px] items-end overflow-hidden text-white max-md:min-h-[76svh]" aria-labelledby="md-hero-title">
        <div className="absolute inset-0 z-0" aria-hidden="true">
          <Image className="object-cover" src={museum.hero.image} alt="" fill priority sizes="100vw" />
        </div>
        <div className="absolute inset-0 z-[1] bg-[linear-gradient(90deg,rgba(32,24,18,.84)_0%,rgba(32,24,18,.54)_42%,rgba(32,24,18,.18)_100%),linear-gradient(0deg,rgba(32,24,18,.72)_0%,transparent_58%)]" />

        <div className="relative z-[2] mx-auto w-[min(1180px,calc(100%-40px))] py-20 pt-28 max-md:w-[calc(100%-24px)] max-md:py-14 max-md:pt-6">
          <div className="w-[min(780px,100%)] rounded-[2.125rem] border border-white/25 bg-white/10 p-[clamp(30px,5vw,56px)] shadow-[0_34px_90px_rgba(0,0,0,.28)] backdrop-blur-xl max-md:border-0 max-md:bg-transparent max-md:p-0 max-md:shadow-none max-md:backdrop-blur-0">
            <span className="mb-4 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-white drop-shadow-lg before:h-px before:w-8 before:bg-current before:opacity-75">
              {museum.hero.kicker}
            </span>
            <h1 id="md-hero-title" className="m-0 max-w-[12ch] text-[clamp(42px,7vw,86px)] font-black leading-[0.94] tracking-[-0.06em] text-white drop-shadow-lg">
              {museum.hero.title}
            </h1>
            <p className="mt-5 max-w-[680px] text-base leading-7 text-white/95 md:text-lg md:leading-8">{museum.hero.description}</p>
            <div className="mt-6 flex flex-wrap gap-2" aria-label={copy.tagsLabel}>
              {museum.hero.tags.map((tag) => (
                <span className="rounded-full border border-white/25 bg-white/15 px-3 py-1.5 text-xs font-black text-white" key={tag}>{tag}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16" aria-label={copy.detailsLabel}>
        <div className="mx-auto grid w-[min(1180px,calc(100%-40px))] gap-4 max-md:w-[calc(100%-24px)] md:grid-cols-2 xl:grid-cols-4">
          {museum.details.map((detail) => (
            <article className="rounded-[1.75rem] border border-amber-800/15 bg-white/90 p-6 shadow-xl shadow-stone-900/5" key={detail.title}>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#fff4df] text-2xl ring-1 ring-amber-900/10" aria-hidden="true">{detail.icon}</div>
              <h2 className="text-xl font-black leading-tight text-stone-800">{detail.title}</h2>
              <p className="mt-3 text-sm leading-7 text-stone-600">{detail.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="py-16 md:py-20" aria-labelledby="md-story-title">
        <div className="mx-auto grid w-[min(1180px,calc(100%-40px))] items-start gap-8 max-md:w-[calc(100%-24px)] lg:grid-cols-[minmax(0,1.25fr)_minmax(320px,.75fr)]">
          <article className="rounded-[2rem] border border-amber-800/15 bg-white/90 p-[clamp(28px,4vw,44px)] shadow-xl shadow-stone-900/5">
            <span className="mb-4 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-amber-900 before:h-px before:w-8 before:bg-current before:opacity-75">{copy.storyKicker}</span>
            <h2 id="md-story-title" className="m-0 text-[clamp(32px,4.6vw,58px)] font-black leading-none tracking-[-0.055em] text-stone-800">{museum.experience.title}</h2>
            {museum.experience.paragraphs.map((paragraph) => (
              <p className="mt-5 text-base leading-8 text-stone-600" key={paragraph}>{paragraph}</p>
            ))}
          </article>

          <aside className="rounded-[2rem] border border-amber-800/15 bg-stone-900 p-7 text-white shadow-2xl shadow-stone-900/15">
            <h2 className="text-2xl font-black tracking-[-0.04em] text-white">{museum.highlights.title}</h2>
            <ul className="mt-5 grid gap-3">
              {museum.highlights.items.map((item) => (
                <li className="rounded-2xl border border-white/10 bg-white/10 p-4 text-sm font-bold leading-6 text-white/90" key={item}>{item}</li>
              ))}
            </ul>
          </aside>
        </div>
      </section>

      <section className="py-16 md:py-20" aria-labelledby="md-routes-title">
        <div className="mx-auto w-[min(1180px,calc(100%-40px))] max-md:w-[calc(100%-24px)]">
          <header className="mx-auto mb-9 max-w-[820px] text-center">
            <span className="mb-4 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-amber-900 before:h-px before:w-8 before:bg-current before:opacity-75">{copy.routesKicker}</span>
            <h2 id="md-routes-title" className="m-0 text-[clamp(32px,4.6vw,58px)] font-black leading-none tracking-[-0.055em] text-stone-800">{museum.routeIdeas.title}</h2>
          </header>

          <div className="grid gap-4 md:grid-cols-3">
            {museum.routeIdeas.items.map((item) => (
              <article className="rounded-[1.75rem] border border-amber-800/15 bg-white/90 p-6 shadow-xl shadow-stone-900/5" key={item.title}>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#fff4df] text-2xl ring-1 ring-amber-900/10" aria-hidden="true">{item.icon}</div>
                <h3 className="text-xl font-black leading-tight text-stone-800">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-stone-600">{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16" aria-label={copy.localTipLabel}>
        <div className="mx-auto w-[min(1180px,calc(100%-40px))] max-md:w-[calc(100%-24px)]">
          <article className="flex gap-5 rounded-[2rem] bg-gradient-to-br from-stone-900 to-stone-700 p-[clamp(28px,4vw,44px)] text-white shadow-2xl shadow-stone-900/15 max-md:flex-col">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-white/15 text-3xl ring-1 ring-white/15" aria-hidden="true">{museum.baseTip.icon}</div>
            <div>
              <h2 className="text-[clamp(28px,4vw,44px)] font-black leading-none tracking-[-0.045em] text-white">{museum.baseTip.title}</h2>
              <p className="mt-4 max-w-[860px] text-base leading-8 text-white/85">
                {museum.baseTip.text} <a className="font-black text-white underline decoration-white/30 underline-offset-4" href={museum.baseTip.href}>{museum.baseTip.linkLabel}</a>
              </p>
              <div className="mt-6 flex flex-wrap gap-3" data-gcu-contextual-stay-links>
                <a
                  className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-black !text-stone-900 shadow-lg transition hover:-translate-y-0.5"
                  href={getSiteNavigationPath("rooms", language)}
                >
                  {copy.viewRooms}
                </a>
                <a
                  className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/25 bg-white/10 px-6 py-3 text-sm font-black !text-white transition hover:-translate-y-0.5 hover:bg-white/20"
                  href={getSiteNavigationPath("rates", language)}
                >
                  {copy.checkRates}
                </a>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section className="py-16 md:py-20" aria-labelledby="md-related-title">
        <div className="mx-auto w-[min(1180px,calc(100%-40px))] max-md:w-[calc(100%-24px)]">
          <header className="mx-auto mb-9 max-w-[820px] text-center">
            <span className="mb-4 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-amber-900 before:h-px before:w-8 before:bg-current before:opacity-75">{copy.relatedKicker}</span>
            <h2 id="md-related-title" className="m-0 text-[clamp(32px,4.6vw,58px)] font-black leading-none tracking-[-0.055em] text-stone-800">{museum.relatedTitle}</h2>
            <p className="mx-auto mt-5 max-w-[760px] text-base leading-8 text-stone-600">{museum.relatedText}</p>
            <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.1em] text-amber-900 shadow-sm ring-1 ring-amber-900/10 md:hidden">
              {copy.swipeHint} <span aria-hidden="true">→</span>
            </p>
          </header>

          <div className="relative">
            <div aria-hidden="true" className="pointer-events-none absolute right-2 top-[38%] z-20 flex h-10 w-10 items-center justify-center rounded-full bg-stone-900/95 text-xl font-black text-white shadow-xl md:hidden">→</div>
            <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-5 pr-10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:grid md:auto-rows-[260px] md:grid-cols-3 md:overflow-visible md:pr-0">
              {relatedMuseums.map((related, index) => (
                <a className={`group relative min-h-[300px] w-[84vw] max-w-[380px] flex-none snap-start overflow-hidden rounded-[1.75rem] bg-stone-900 shadow-xl shadow-stone-900/10 ring-1 ring-amber-900/10 md:min-h-0 md:w-auto md:max-w-none ${getRelatedCardClass(index)}`} href={related.seo.canonicalPath} key={related.seo.canonicalPath}>
                  <Image src={related.hero.image} alt="" fill sizes="(min-width: 768px) 66vw, 100vw" className="object-cover transition duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/82 via-black/34 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 z-10 p-5 text-white">
                    <span className="rounded-full bg-white/15 px-3 py-1.5 text-xs font-black uppercase text-white backdrop-blur">{getBadgeFromMuseum(related)}</span>
                    <h3 className="mt-4 tracking-[-0.02em] text-2xl font-extrabold leading-tight text-white">{related.hero.title}</h3>
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-white/80">{related.seo.description}</p>
                    <strong className="mt-4 inline-flex rounded-full border border-white/25 px-4 py-2 text-xs font-black uppercase text-white">{copy.exploreMuseum}</strong>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
