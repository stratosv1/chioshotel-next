import Image from "next/image";
import { RoomWizard } from "@/components/rooms/RoomWizard";
import { TopicBadges } from "@/components/seo/TopicBadges";
import type { RoomsCategoryPageData } from "@/content/rooms";
import type { LanguageCode } from "@/lib/languages";

type RoomsCategoryPageProps = {
  data: RoomsCategoryPageData;
};

function HtmlText({ html }: { html: string }) {
  return <span dangerouslySetInnerHTML={{ __html: html }} />;
}

function getWizardLanguage(path: string): LanguageCode {
  if (path.startsWith("/el/")) return "el";
  if (path.startsWith("/fr/")) return "fr";
  if (path.startsWith("/de/")) return "de";
  if (path.startsWith("/it/")) return "it";
  if (path.startsWith("/es/")) return "es";
  if (path.startsWith("/tr/")) return "tr";

  return "en";
}

export function RoomsCategoryPage({ data }: RoomsCategoryPageProps) {
  const language = getWizardLanguage(data.seo.canonicalPath);

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#fbf6ef] text-[#2f261f]">
      <section
        className="relative isolate overflow-hidden bg-[#2f261f] px-4 py-14 text-white sm:px-6 lg:px-8 lg:py-24"
        aria-labelledby="rooms-hero-title"
      >
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(245,158,11,0.28),transparent_34rem),linear-gradient(135deg,rgba(47,38,31,0.97),rgba(92,64,38,0.94))]" />
        <div className="absolute inset-x-6 bottom-0 -z-10 h-px bg-gradient-to-r from-transparent via-amber-200/35 to-transparent" />

        <div className="mx-auto max-w-6xl">
          <div className="max-w-3xl">
            <span className="inline-flex rounded-full border border-amber-200/30 bg-white/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.28em] text-amber-100">
              {data.hero.kicker}
            </span>

            <h1
              id="rooms-hero-title"
              className="mt-6 text-balance text-4xl font-black leading-[0.98] tracking-[-0.04em] text-white sm:text-5xl lg:text-7xl"
            >
              {data.hero.title}{" "}
              <span className="text-amber-200">{data.hero.highlightedTitle}</span>
            </h1>

            <p className="mt-6 max-w-2xl text-pretty text-base leading-8 text-stone-100/88 sm:text-lg">
              {data.hero.description}
            </p>

            <div className="mt-8 grid grid-cols-2 gap-3 sm:flex sm:flex-wrap">
              <a
                className="inline-flex min-h-[52px] items-center justify-center rounded-full bg-amber-200 px-4 text-center text-[11px] font-black uppercase tracking-[0.12em] !text-[#2f261f] shadow-[0_18px_40px_rgba(0,0,0,0.22)] transition hover:-translate-y-0.5 hover:bg-white sm:px-6 sm:text-xs"
                href={data.hero.primaryCta.href}
                style={{ color: "#2f261f" }}
              >
                {data.hero.primaryCta.label}
              </a>

              <a
                className="inline-flex min-h-[52px] items-center justify-center rounded-full border border-white/30 bg-white/10 px-4 text-center text-[11px] font-black uppercase tracking-[0.12em] text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white hover:text-[#2f261f] sm:px-6 sm:text-xs"
                href={data.hero.secondaryCta.href}
              >
                {data.hero.secondaryCta.label}
              </a>
            </div>
          </div>
        </div>
      </section>

      <TopicBadges locale={language} context="rooms-category" className="border-b border-amber-900/10" />

      <section
        className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16"
        aria-labelledby="rooms-category-title"
      >
        <header className="mx-auto max-w-3xl text-center">
          <span className="inline-flex rounded-full border border-amber-900/10 bg-white px-4 py-2 text-[11px] font-black uppercase tracking-[0.28em] text-amber-800 shadow-sm">
            {data.hero.kicker}
          </span>

          <h2
            id="rooms-category-title"
            className="mt-5 text-balance text-3xl font-black tracking-[-0.035em] text-[#2f261f] sm:text-4xl lg:text-5xl"
          >
            {data.intro.title}
          </h2>

          <p className="mt-4 text-pretty text-base leading-8 text-[#574b3f] sm:text-lg">
            {data.intro.description}
          </p>
        </header>

        <div
          className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
          id="rooms-list"
        >
          {data.cards.map((card, index) => (
            <a
              href={card.href}
              className="group overflow-hidden rounded-[30px] border border-amber-900/10 bg-white shadow-[0_18px_45px_rgba(47,38,31,0.10)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_30px_80px_rgba(47,38,31,0.16)] focus:outline-none focus:ring-4 focus:ring-amber-700/20"
              key={card.id}
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-stone-200">
                <Image
                  src={card.image}
                  alt={card.imageAlt}
                  fill
                  priority={index < 2}
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/55 to-transparent" />
                <span className="absolute left-4 top-4 rounded-full bg-white/92 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.16em] text-[#2f261f] shadow-lg backdrop-blur">
                  {card.badge}
                </span>
              </div>

              <div className="p-5 sm:p-6">
                <div className="flex flex-wrap gap-2">
                  {card.meta.map((item) => (
                    <span
                      key={item}
                      className="rounded-full bg-amber-50 px-3 py-1 text-[11px] font-bold text-amber-900 ring-1 ring-amber-900/10"
                    >
                      {item}
                    </span>
                  ))}
                </div>

                <h3 className="mt-4 text-2xl font-black tracking-[-0.03em] text-[#2f261f]">
                  {card.title}
                </h3>

                <p className="mt-1 text-sm font-extrabold uppercase tracking-[0.14em] text-amber-800">
                  {card.subtitle}
                </p>

                <p className="mt-4 text-sm leading-7 text-[#574b3f]">
                  {card.description}
                </p>

                <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#2f261f] px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-white transition group-hover:bg-amber-800">
                  {card.ctaLabel} <span aria-hidden="true">→</span>
                </div>
              </div>
            </a>
          ))}
        </div>

        <div className="mt-8 flex gap-4 rounded-[28px] border border-amber-900/10 bg-[#fffdfa] p-5 shadow-[0_18px_45px_rgba(47,38,31,0.08)] sm:items-start sm:p-6">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-2xl shadow-inner">
            {data.tip.icon}
          </div>

          <div>
            <h4 className="text-lg font-black tracking-[-0.02em] text-[#2f261f]">
              {data.tip.title}
            </h4>
            <p className="mt-2 text-sm leading-7 text-[#574b3f]">
              <HtmlText html={data.tip.textHtml} />
            </p>
          </div>
        </div>

        <div className="mx-auto mt-14 max-w-3xl text-center">
          <span className="inline-flex rounded-full border border-amber-900/10 bg-white px-4 py-2 text-[11px] font-black uppercase tracking-[0.28em] text-amber-800 shadow-sm">
            {data.hero.kicker}
          </span>
          <h2 className="mt-5 text-balance text-3xl font-black tracking-[-0.035em] text-[#2f261f] sm:text-4xl">
            {data.wizardIntro.title}
          </h2>
          <p className="mt-4 text-pretty text-base leading-8 text-[#574b3f]">
            {data.wizardIntro.description}
          </p>
        </div>

        <div className="mt-8">
          <RoomWizard
            rooms={data.wizard.rooms}
            whatsappPhone={data.wizard.whatsappPhone}
            language={language}
          />
        </div>
      </section>
    </main>
  );
}
