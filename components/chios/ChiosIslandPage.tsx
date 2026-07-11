import type { ChiosIslandPageData } from "@/content/chios-island";

type ChiosIslandPageProps = {
  data: ChiosIslandPageData;
};

type ChiosIslandUiText = {
  introKicker: string;
  highlightsAriaLabel: string;
  quizKicker: string;
  quickActionsAriaLabel: string;
  whatsapp: string;
  bookNow: string;
};

const chiosIslandUiByLocale: Record<string, ChiosIslandUiText> = {
  en: {
    introKicker: "Why visit Chios",
    highlightsAriaLabel: "Chios island highlights",
    quizKicker: "Chios quiz",
    quickActionsAriaLabel: "Quick actions",
    whatsapp: "WhatsApp",
    bookNow: "Book now",
  },
  el: {
    introKicker: "Γιατί να επισκεφθείτε τη Χίο",
    highlightsAriaLabel: "Σημαντικά στοιχεία για τη Χίο",
    quizKicker: "Κουίζ για τη Χίο",
    quickActionsAriaLabel: "Γρήγορες ενέργειες",
    whatsapp: "WhatsApp",
    bookNow: "Κάντε κράτηση",
  },
  fr: {
    introKicker: "Pourquoi visiter Chios",
    highlightsAriaLabel: "Points forts de l’île de Chios",
    quizKicker: "Quiz sur Chios",
    quickActionsAriaLabel: "Actions rapides",
    whatsapp: "WhatsApp",
    bookNow: "Réserver",
  },
  de: {
    introKicker: "Warum Chios besuchen",
    highlightsAriaLabel: "Highlights der Insel Chios",
    quizKicker: "Chios-Quiz",
    quickActionsAriaLabel: "Schnellaktionen",
    whatsapp: "WhatsApp",
    bookNow: "Jetzt buchen",
  },
  it: {
    introKicker: "Perché visitare Chios",
    highlightsAriaLabel: "Punti salienti dell’isola di Chios",
    quizKicker: "Quiz su Chios",
    quickActionsAriaLabel: "Azioni rapide",
    whatsapp: "WhatsApp",
    bookNow: "Prenota ora",
  },
  es: {
    introKicker: "Por qué visitar Quíos",
    highlightsAriaLabel: "Aspectos destacados de la isla de Quíos",
    quizKicker: "Quiz sobre Quíos",
    quickActionsAriaLabel: "Acciones rápidas",
    whatsapp: "WhatsApp",
    bookNow: "Reservar ahora",
  },
  tr: {
    introKicker: "Sakız Adası neden ziyaret edilmeli",
    highlightsAriaLabel: "Sakız Adası öne çıkanlar",
    quizKicker: "Sakız Adası testi",
    quickActionsAriaLabel: "Hızlı işlemler",
    whatsapp: "WhatsApp",
    bookNow: "Şimdi rezervasyon yap",
  },
};

function getChiosIslandLocale(path: string) {
  const locale = path.split("/").filter(Boolean)[0];
  return locale && chiosIslandUiByLocale[locale] ? locale : "en";
}

export function ChiosIslandPage({ data }: ChiosIslandPageProps) {
  const ui = chiosIslandUiByLocale[getChiosIslandLocale(data.seo.canonicalPath)];

  return (
    <main className="min-h-screen overflow-x-hidden bg-[radial-gradient(circle_at_top_left,rgba(168,120,66,.18),transparent_34rem),linear-gradient(180deg,#fbf6ef_0%,#f4eadf_52%,#fbf6ef_100%)] pb-20 text-stone-800 md:pb-0">
      <section className="relative flex min-h-[640px] items-end overflow-hidden text-white max-md:min-h-[76svh]" aria-labelledby="ci-hero-title">
        <div className="absolute inset-0 z-0" aria-hidden="true">
          <img className="h-full w-full object-cover" src={data.hero.image} alt="" loading="eager" />
        </div>

        <div className="absolute inset-0 z-[1] bg-[linear-gradient(90deg,rgba(32,24,18,.84)_0%,rgba(32,24,18,.54)_42%,rgba(32,24,18,.18)_100%),linear-gradient(0deg,rgba(32,24,18,.72)_0%,transparent_58%)]" />

        <div className="relative z-[2] mx-auto w-[min(1180px,calc(100%-40px))] py-20 pt-28 max-md:w-[calc(100%-24px)] max-md:py-14 max-md:pt-6">
          <div className="w-[min(720px,100%)] rounded-[2.125rem] border border-white/25 bg-white/10 p-[clamp(30px,5vw,56px)] shadow-[0_34px_90px_rgba(0,0,0,.28)] backdrop-blur-xl max-md:border-0 max-md:bg-transparent max-md:p-0 max-md:shadow-none max-md:backdrop-blur-0">
            <span className="mb-4 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-white drop-shadow-lg before:h-px before:w-8 before:bg-current before:opacity-75">
              {data.hero.kicker}
            </span>

            <h1 id="ci-hero-title" className="m-0 max-w-[11ch] text-[clamp(42px,7vw,86px)] font-black leading-[0.94] tracking-[-0.06em] text-white drop-shadow-lg">
              {data.hero.title}
            </h1>

            <p className="mt-5 max-w-[640px] text-base leading-7 text-white/95 md:text-lg md:leading-8">{data.hero.description}</p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a className="inline-flex min-h-[54px] items-center justify-center rounded-full bg-gradient-to-br from-[#a87842] to-[#8e6607] px-7 text-[12px] font-black uppercase tracking-[0.1em] text-white shadow-lg shadow-amber-900/25" href={data.hero.primaryCta.href}>
                {data.hero.primaryCta.label}
              </a>

              <a className="inline-flex min-h-[54px] items-center justify-center rounded-full border border-white/40 bg-white/15 px-7 text-[12px] font-black uppercase tracking-[0.1em] text-white" href={data.hero.secondaryCta.href}>
                {data.hero.secondaryCta.label}
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20" aria-labelledby="ci-intro-title">
        <div className="mx-auto grid w-[min(1180px,calc(100%-40px))] items-start gap-8 max-md:w-[calc(100%-24px)] lg:grid-cols-[minmax(0,1.35fr)_minmax(320px,.65fr)]">
          <article className="rounded-[1.875rem] border border-amber-800/15 bg-white/90 p-[clamp(28px,4vw,40px)] shadow-xl shadow-stone-900/5">
            <span className="mb-4 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-amber-900 before:h-px before:w-8 before:bg-current before:opacity-75">
              {ui.introKicker}
            </span>
            <h2 id="ci-intro-title" className="m-0 text-[clamp(32px,4.6vw,58px)] font-black leading-none tracking-[-0.055em] text-stone-800">
              {data.intro.title}
            </h2>

            {data.intro.paragraphs.map((paragraph) => (
              <p className="mt-5 text-base leading-8 text-stone-600" key={paragraph}>{paragraph}</p>
            ))}
          </article>

          <aside className="grid gap-3 rounded-[1.875rem] border border-amber-800/15 bg-white/90 p-5 shadow-xl shadow-stone-900/5" aria-label={ui.highlightsAriaLabel}>
            {data.intro.highlights.map((highlight) => (
              <div className="rounded-2xl border border-amber-800/15 bg-white p-5" key={highlight.label}>
                <span className="block text-[11px] font-black uppercase tracking-[0.12em] text-amber-800">{highlight.label}</span>
                <strong className="mt-1 block text-2xl font-black tracking-[-0.04em] text-stone-800">{highlight.value}</strong>
              </div>
            ))}
          </aside>
        </div>
      </section>

      <section className="py-16 md:py-20" id="discover" aria-labelledby="ci-experiences-title">
        <div className="mx-auto w-[min(1180px,calc(100%-40px))] max-md:w-[calc(100%-24px)]">
          <header className="mx-auto mb-9 max-w-[820px] text-center">
            <span className="mb-4 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-amber-900 before:h-px before:w-8 before:bg-current before:opacity-75">
              {data.experiences.kicker}
            </span>
            <h2 id="ci-experiences-title" className="m-0 text-[clamp(32px,4.6vw,58px)] font-black leading-none tracking-[-0.055em] text-stone-800">
              {data.experiences.title}
            </h2>
            <p className="mx-auto mt-5 max-w-[760px] text-base leading-8 text-stone-600">{data.experiences.description}</p>
          </header>

          <div className="grid gap-5 lg:grid-cols-3">
            {data.experiences.items.map((item) => (
              <article className="group overflow-hidden rounded-[1.875rem] border border-amber-800/15 bg-white/90 shadow-xl shadow-stone-900/5 transition hover:-translate-y-1 hover:shadow-2xl hover:shadow-stone-900/10" key={item.title}>
                <div className="h-[260px] overflow-hidden bg-stone-200">
                  <img className="h-full w-full object-cover transition duration-700 group-hover:scale-105" src={item.image} alt={item.imageAlt} loading="lazy" />
                </div>

                <div className="p-6">
                  <div className="mb-4 flex flex-wrap gap-2">
                    {item.tags.map((tag) => (
                      <span className="inline-flex min-h-7 items-center rounded-full border border-amber-800/15 bg-[#fff7ee] px-3 text-[9px] font-black uppercase tracking-[0.09em] text-amber-900" key={tag}>{tag}</span>
                    ))}
                  </div>

                  <h3 className="m-0 text-[28px] font-black leading-none tracking-[-0.04em] text-stone-800">{item.title}</h3>
                  <p className="mt-4 text-[15px] leading-7 text-stone-600">{item.description}</p>

                  <a className="mt-5 inline-flex min-h-12 items-center justify-center rounded-full bg-gradient-to-br from-[#a87842] to-[#8e6607] px-5 text-[11px] font-black uppercase tracking-[0.1em] text-white" href={item.href}>
                    {item.ctaLabel}
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16" aria-labelledby="ci-quiz-title">
        <div className="mx-auto w-[min(1180px,calc(100%-40px))] max-md:w-[calc(100%-24px)]">
          <article className="rounded-[2rem] bg-gradient-to-br from-stone-900 to-stone-700 p-[clamp(30px,5vw,56px)] text-white shadow-2xl shadow-stone-900/15">
            <span className="mb-4 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-white before:h-px before:w-8 before:bg-current before:opacity-75">
              {ui.quizKicker}
            </span>
            <h2 id="ci-quiz-title" className="m-0 text-[clamp(32px,4.6vw,58px)] font-black leading-none tracking-[-0.055em] text-white">
              {data.quiz.title}
            </h2>
            <p className="mt-5 max-w-[720px] text-base leading-8 text-white/85">{data.quiz.text}</p>

            <a className="mt-8 inline-flex min-h-[54px] items-center justify-center rounded-full border border-white/30 bg-white/15 px-7 text-[12px] font-black uppercase tracking-[0.1em] text-white" href={data.quiz.href}>
              {data.quiz.ctaLabel}
            </a>
          </article>
        </div>
      </section>

      <section className="py-12 md:py-16" aria-labelledby="ci-stay-title">
        <div className="mx-auto w-[min(1180px,calc(100%-40px))] max-md:w-[calc(100%-24px)]">
          <article className="rounded-[2rem] border border-amber-800/15 bg-white/90 p-[clamp(30px,5vw,48px)] shadow-xl shadow-stone-900/5">
            <span className="mb-4 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-amber-900 before:h-px before:w-8 before:bg-current before:opacity-75">
              {data.stay.kicker}
            </span>
            <h2 id="ci-stay-title" className="m-0 text-[clamp(32px,4.6vw,58px)] font-black leading-none tracking-[-0.055em] text-stone-800">
              {data.stay.title}
            </h2>
            <p className="mt-5 max-w-[760px] text-base leading-8 text-stone-600">{data.stay.text}</p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a className="inline-flex min-h-[54px] items-center justify-center rounded-full bg-gradient-to-br from-[#a87842] to-[#8e6607] px-7 text-[12px] font-black uppercase tracking-[0.1em] text-white" href={data.stay.primaryCta.href}>
                {data.stay.primaryCta.label}
              </a>

              <a className="inline-flex min-h-[54px] items-center justify-center rounded-full border border-amber-800/20 bg-[#fff7ee] px-7 text-[12px] font-black uppercase tracking-[0.1em] text-amber-900" href={data.stay.secondaryCta.href}>
                {data.stay.secondaryCta.label}
              </a>
            </div>
          </article>
        </div>
      </section>

      <div className="fixed inset-x-3 bottom-3 z-40 grid grid-cols-2 gap-2 rounded-2xl border border-white/20 bg-stone-950/88 p-2 shadow-2xl shadow-stone-950/25 backdrop-blur md:hidden" aria-label={ui.quickActionsAriaLabel}>
        <a className="inline-flex min-h-12 items-center justify-center rounded-xl bg-[#25d366] px-3 text-xs font-black uppercase tracking-[0.08em] text-white" href={data.sticky.whatsappHref}>
          💬 {ui.whatsapp}
        </a>

        <a className="inline-flex min-h-12 items-center justify-center rounded-xl bg-[#a87842] px-3 text-xs font-black uppercase tracking-[0.08em] text-white" href={data.sticky.bookingHref}>
          🏨 {ui.bookNow}
        </a>
      </div>
    </main>
  );
}
