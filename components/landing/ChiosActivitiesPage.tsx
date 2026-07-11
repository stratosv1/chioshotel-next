import Link from "next/link";
import type { ChiosActivitiesPageData } from "@/content/chios-activities";

type ChiosActivitiesPageProps = {
  data: ChiosActivitiesPageData;
};

const activitiesUiCopy = {
  en: {
    cardsKicker: "Activities in Chios",
    cardsText:
      "Explore local traditions, nature, wellness, culture, and seasonal experiences recommended by Voulamandis House.",
    cardBadge: "Chios activity",
    swipeHint: "Swipe to explore more activities",
    galleryKicker: "Gallery",
    galleryTitle: "Moments from this experience",
    finalKicker: "Voulamandis House",
  },
  el: {
    cardsKicker: "Δραστηριότητες στη Χίο",
    cardsText:
      "Ανακαλύψτε τοπικές παραδόσεις, φύση, ευεξία, πολιτισμό και εποχικές εμπειρίες που προτείνει το Voulamandis House.",
    cardBadge: "Δραστηριότητα Χίου",
    swipeHint: "Σύρετε για περισσότερες δραστηριότητες",
    galleryKicker: "Gallery",
    galleryTitle: "Στιγμές από αυτή την εμπειρία",
    finalKicker: "Voulamandis House",
  },
  fr: {
    cardsKicker: "Activités à Chios",
    cardsText:
      "Explorez les traditions locales, la nature, le bien-être, la culture et les expériences saisonnières recommandées par Voulamandis House.",
    cardBadge: "Activité à Chios",
    swipeHint: "Faites glisser pour voir plus d’activités",
    galleryKicker: "Galerie",
    galleryTitle: "Moments de cette expérience",
    finalKicker: "Voulamandis House",
  },
  de: {
    cardsKicker: "Aktivitäten auf Chios",
    cardsText:
      "Entdecken Sie lokale Traditionen, Natur, Wellness, Kultur und saisonale Erlebnisse, empfohlen von Voulamandis House.",
    cardBadge: "Chios-Aktivität",
    swipeHint: "Wischen Sie für weitere Aktivitäten",
    galleryKicker: "Galerie",
    galleryTitle: "Momente aus diesem Erlebnis",
    finalKicker: "Voulamandis House",
  },
  it: {
    cardsKicker: "Attività a Chios",
    cardsText:
      "Scopri tradizioni locali, natura, benessere, cultura ed esperienze stagionali consigliate da Voulamandis House.",
    cardBadge: "Attività a Chios",
    swipeHint: "Scorri per altre attività",
    galleryKicker: "Galleria",
    galleryTitle: "Momenti di questa esperienza",
    finalKicker: "Voulamandis House",
  },
  es: {
    cardsKicker: "Actividades en Chios",
    cardsText:
      "Explora tradiciones locales, naturaleza, bienestar, cultura y experiencias de temporada recomendadas por Voulamandis House.",
    cardBadge: "Actividad en Chios",
    swipeHint: "Desliza para ver más actividades",
    galleryKicker: "Galería",
    galleryTitle: "Momentos de esta experiencia",
    finalKicker: "Voulamandis House",
  },
  tr: {
    cardsKicker: "Sakız Adası aktiviteleri",
    cardsText:
      "Voulamandis House’un önerdiği yerel gelenekleri, doğayı, sağlığı, kültürü ve sezonluk deneyimleri keşfedin.",
    cardBadge: "Sakız aktivitesi",
    swipeHint: "Daha fazla aktivite için kaydırın",
    galleryKicker: "Galeri",
    galleryTitle: "Bu deneyimden anlar",
    finalKicker: "Voulamandis House",
  },
} as const;

export default function ChiosActivitiesPage({ data }: ChiosActivitiesPageProps) {
  const isHub = data.key === "hub";
  const copy = activitiesUiCopy[data.locale] ?? activitiesUiCopy.en;

  return (
    <main className="overflow-hidden bg-[#fffaf3] text-stone-800">
      <section className="grid items-center gap-9 bg-[radial-gradient(circle_at_top_left,rgba(168,120,66,.18),transparent_28rem),linear-gradient(135deg,#fffaf3,#f4eadb)] px-3 py-14 md:px-[max(24px,calc((100vw-1120px)/2))] md:py-24 lg:grid-cols-[minmax(0,1fr)_minmax(360px,.82fr)]">
        <div className="max-w-[720px]">
          <p className="mb-4 text-[0.78rem] font-black uppercase tracking-[0.14em] text-[#9b6a2f]">{data.hero.eyebrow}</p>
          <h1 className="m-0 text-[clamp(2.6rem,6vw,5.2rem)] font-black leading-[0.96] tracking-[-0.06em] text-[#213426]">
            {data.hero.title}
          </h1>
          <p className="mt-6 max-w-[660px] text-[clamp(1.02rem,1.8vw,1.22rem)] leading-8 text-[#4e5b51]">
            {data.hero.subtitle}
          </p>

          <div className="mt-8 flex flex-wrap gap-3.5">
            <Link className="inline-flex min-h-[50px] items-center justify-center rounded-full bg-[#d99b45] px-6 font-black text-[#1f261e] shadow-lg shadow-amber-900/10" href={data.cta.primaryHref}>
              {data.cta.primaryLabel}
            </Link>

            {data.cta.secondaryHref && data.cta.secondaryLabel ? (
              <Link
                className="inline-flex min-h-[50px] items-center justify-center rounded-full border border-stone-800/15 bg-white/80 px-6 font-black text-[#243528]"
                href={data.cta.secondaryHref}
              >
                {data.cta.secondaryLabel}
              </Link>
            ) : null}
          </div>
        </div>

        {data.hero.image ? (
          <div className="overflow-hidden rounded-[2rem] bg-[#e8dfcf] shadow-2xl shadow-stone-900/10">
            <img
              className="block min-h-[300px] w-full object-cover md:min-h-[420px]"
              src={data.hero.image}
              alt={data.hero.imageAlt || data.hero.title}
            />
          </div>
        ) : null}
      </section>

      {data.intro ? (
        <section className="py-16 md:py-20">
          <div className="mx-auto w-[min(860px,calc(100%-32px))]">
            <h2 className="m-0 text-[clamp(2rem,4vw,3.4rem)] font-black leading-none tracking-[-0.045em] text-[#213426]">
              {data.intro.title}
            </h2>
            {data.intro.text.map((paragraph) => (
              <p className="mt-5 text-base leading-8 text-[#5b665c]" key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </section>
      ) : null}

      {isHub && data.cards ? (
        <section className="py-16 md:py-20">
          <div className="mx-auto w-[min(1120px,calc(100%-32px))]">
            <div className="mx-auto mb-9 max-w-[780px] text-center">
              <p className="mb-4 text-[0.78rem] font-black uppercase tracking-[0.14em] text-[#9b6a2f]">{copy.cardsKicker}</p>
              <h2 className="m-0 text-[clamp(2rem,4vw,3.4rem)] font-black leading-none tracking-[-0.045em] text-[#213426]">
                {data.hero.title}
              </h2>
              <p className="mt-5 text-base leading-8 text-[#5b665c]">{copy.cardsText}</p>
              <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.1em] text-[#8e6607] shadow-sm ring-1 ring-[#8e6607]/10 md:hidden">
                {copy.swipeHint} <span aria-hidden="true">→</span>
              </p>
            </div>

            <div className="relative">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute right-2 top-[38%] z-20 flex h-10 w-10 items-center justify-center rounded-full bg-[#2f261f]/95 text-xl font-black text-white shadow-xl md:hidden"
              >
                →
              </div>
              <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-5 pr-10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:grid md:grid-cols-2 md:overflow-visible md:pr-0 xl:grid-cols-3">
                {data.cards.map((card, index) => (
                  <Link
                    className="group w-[84vw] max-w-[380px] flex-none snap-start overflow-hidden rounded-[1.5rem] bg-white shadow-lg shadow-stone-900/5 ring-1 ring-amber-900/10 transition hover:shadow-xl md:w-auto md:max-w-none md:rounded-[2rem]"
                    href={card.href}
                    key={card.key}
                  >
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        src={card.image}
                        alt={card.imageAlt}
                        loading={index < 2 ? "eager" : "lazy"}
                      />
                      <span className="absolute left-3 top-3 rounded-full bg-amber-700 px-3 py-1.5 text-xs font-black text-white">
                        {copy.cardBadge}
                      </span>
                    </div>

                    <div className="p-5">
                      <h3 className="break-words font-serif text-2xl font-bold leading-tight text-amber-800">
                        {card.title}
                      </h3>
                      <p className="mt-3 line-clamp-3 text-sm leading-7 text-stone-600">
                        {card.description}
                      </p>
                      <span className="mt-5 inline-flex rounded-full border border-amber-800/20 px-4 py-2 text-xs font-black uppercase text-amber-800">
                        {card.buttonLabel}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {data.sections?.length ? (
        <section className="py-16 md:py-20">
          <div className="mx-auto w-[min(860px,calc(100%-32px))]">
            <div className="grid gap-7">
              {data.sections.map((section) => (
                <section className="rounded-[1.75rem] border border-stone-800/10 bg-white p-7 shadow-lg shadow-stone-900/5" key={section.title}>
                  <h2 className="m-0 text-[clamp(2rem,4vw,3rem)] font-black leading-none tracking-[-0.045em] text-[#213426]">
                    {section.title}
                  </h2>
                  {section.text.map((paragraph) => (
                    <p className="mt-5 text-base leading-8 text-[#5b665c]" key={paragraph}>{paragraph}</p>
                  ))}
                </section>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {data.gallery?.length ? (
        <section className="py-16 md:py-20">
          <div className="mx-auto w-[min(1120px,calc(100%-32px))]">
            <div className="mb-9 text-center">
              <p className="mb-4 text-[0.78rem] font-black uppercase tracking-[0.14em] text-[#9b6a2f]">{copy.galleryKicker}</p>
              <h2 className="m-0 text-[clamp(2rem,4vw,3.4rem)] font-black leading-none tracking-[-0.045em] text-[#213426]">
                {copy.galleryTitle}
              </h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {data.gallery.map((image) => (
                <figure className="m-0 overflow-hidden rounded-[1.75rem] bg-[#e8dfcf] shadow-lg shadow-stone-900/5" key={image.src}>
                  <img className="block h-[280px] w-full object-cover" src={image.src} alt={image.alt} />
                </figure>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="px-0 pb-16 pt-8 md:pb-20">
        <div className="mx-auto grid w-[min(1120px,calc(100%-32px))] items-center gap-10 rounded-[2.25rem] bg-gradient-to-br from-[#243528] to-[#38563b] p-[clamp(30px,6vw,62px)] text-white shadow-2xl shadow-stone-900/10 lg:grid-cols-[minmax(0,.95fr)_minmax(0,1.05fr)]">
          <div>
            <p className="mb-4 text-[0.78rem] font-black uppercase tracking-[0.14em] text-white/90">{copy.finalKicker}</p>
            <h2 className="m-0 text-[clamp(2rem,4vw,3.4rem)] font-black leading-none tracking-[-0.045em] text-white">
              {data.cta.title}
            </h2>
            <p className="mt-5 text-base leading-8 text-white/85">{data.cta.text}</p>

            <div className="mt-8 flex flex-wrap gap-3.5">
              <Link className="inline-flex min-h-[50px] items-center justify-center rounded-full bg-[#d99b45] px-6 font-black text-[#1f261e]" href={data.cta.primaryHref}>
                {data.cta.primaryLabel}
              </Link>

              {data.cta.secondaryHref && data.cta.secondaryLabel ? (
                <Link
                  className="inline-flex min-h-[50px] items-center justify-center rounded-full border border-white/25 bg-white/10 px-6 font-black text-white"
                  href={data.cta.secondaryHref}
                >
                  {data.cta.secondaryLabel}
                </Link>
              ) : null}
            </div>
          </div>

          <div className="overflow-hidden rounded-[2rem] bg-[#e8dfcf] shadow-2xl shadow-stone-950/20">
            <img
              src="/images/activities/chios.hotels.voulamandis.house_.hero_.image_.webp"
              alt="Voulamandis House in Kampos Chios"
              className="block min-h-[300px] w-full object-cover md:min-h-[420px]"
            />
          </div>
        </div>
      </section>
    </main>
  );
}
