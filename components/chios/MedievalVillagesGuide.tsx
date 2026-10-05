import Image from "next/image";
import type { MedievalGuide } from "@/content/medieval-villages-guide-i18n";
import { getSiteNavigationPath } from "@/lib/site-navigation";

type Language = "en" | "el" | "fr" | "de" | "it" | "es" | "tr";

export function MedievalVillagesAnswer({ guide }: { guide: MedievalGuide }) {
  return (
    <section className="px-4 py-8 md:px-6 md:py-10" aria-labelledby="medieval-answer-title">
      <div className="mx-auto max-w-[1180px] rounded-[28px] border border-[#8e6607]/20 bg-white p-5 shadow-xl shadow-black/5 md:rounded-[32px] md:p-8">
        <span className="text-[10px] font-black uppercase tracking-[0.16em] text-[#8e6607] md:text-xs">
          {guide.answer.kicker}
        </span>
        <h2
          id="medieval-answer-title"
          className="mt-3 font-serif text-[2rem] font-bold leading-tight text-stone-900 md:text-5xl"
        >
          {guide.answer.title}
        </h2>
        <p className="mt-4 text-sm font-semibold leading-7 text-[#4d4238] md:text-lg md:leading-8">
          {guide.answer.text}
        </p>
        <ul className="mt-5 grid gap-2 md:grid-cols-2 md:gap-3">
          {guide.answer.bullets.map((item) => (
            <li
              className="rounded-2xl bg-[#fff7e8] px-4 py-3 text-sm font-bold leading-6 text-[#493b2f] ring-1 ring-[#8e6607]/10"
              key={item}
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function MedievalVillagesGuideSections({
  guide,
  language,
}: {
  guide: MedievalGuide;
  language: Language;
}) {
  return (
    <>
      {/* History */}
      <section className="px-4 py-12 md:px-6 md:py-16" aria-labelledby="medieval-history-title">
        <div className="mx-auto max-w-[920px]">
          <span className="text-xs font-black uppercase tracking-[0.16em] text-[#8e6607]">
            {guide.history.kicker}
          </span>
          <h2
            id="medieval-history-title"
            className="mt-4 font-serif text-[2rem] font-bold leading-tight text-stone-900 md:text-5xl"
          >
            {guide.history.title}
          </h2>
          <p className="mt-5 text-base leading-8 text-[#574b3f] md:text-lg">{guide.history.intro}</p>
          <div className="mt-8 space-y-6">
            {guide.history.sections.map((section) => (
              <article
                className="rounded-[28px] border border-[#8e6607]/15 bg-white p-6 shadow-xl shadow-black/5 md:p-8"
                key={section.title}
              >
                <h3 className="text-2xl font-black leading-tight tracking-[-0.03em] text-[#2f261f]">
                  {section.title}
                </h3>
                <div className="mt-4 space-y-4">
                  {section.paragraphs.map((paragraph) => (
                    <p className="text-base leading-8 text-[#574b3f]" key={paragraph}>
                      {paragraph}
                    </p>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="scroll-mt-24 px-4 py-12 md:px-6 md:py-16" id="villages" aria-labelledby="medieval-compare-title">
        <div className="mx-auto max-w-[1180px]">
          <header className="mb-6 max-w-[820px]">
            <span className="text-xs font-black uppercase tracking-[0.16em] text-[#8e6607]">
              {guide.comparison.kicker}
            </span>
            <h2
              id="medieval-compare-title"
              className="mt-4 text-3xl font-black leading-none tracking-[-0.05em] text-[#2f261f] md:text-5xl"
            >
              {guide.comparison.title}
            </h2>
            <p className="mt-4 text-base leading-8 text-[#574b3f]">{guide.comparison.intro}</p>
          </header>

          {/* Mobile: stacked cards */}
          <div className="grid gap-3 md:hidden">
            {guide.comparison.rows.map((row) => (
              <a
                className="block rounded-[22px] border border-[#8e6607]/15 bg-white p-5 shadow-sm"
                href={row.href}
                key={row.name}
              >
                <div className="flex items-baseline justify-between gap-3">
                  <span className="text-xl font-black text-[#2f261f]">{row.name}</span>
                  <span className="shrink-0 rounded-full bg-[#fff4df] px-3 py-1 text-xs font-black text-[#8e6607]">
                    {row.time}
                  </span>
                </div>
                <p className="mt-2 text-sm font-bold text-[#493b2f]">{row.character}</p>
                <p className="mt-1 text-sm leading-6 text-[#574b3f]">{row.mustSee}</p>
                <span className="mt-3 inline-flex text-sm font-black text-[#8e6607]">{row.name} →</span>
              </a>
            ))}
          </div>

          {/* Desktop: table */}
          <div className="hidden overflow-hidden rounded-[28px] border border-[#8e6607]/15 bg-white shadow-xl shadow-black/5 md:block">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#fff7e8] text-xs font-black uppercase tracking-[0.1em] text-[#8e6607]">
                <tr>
                  <th className="px-6 py-4" scope="col">{guide.comparison.headers.village}</th>
                  <th className="px-6 py-4" scope="col">{guide.comparison.headers.character}</th>
                  <th className="px-6 py-4" scope="col">{guide.comparison.headers.mustSee}</th>
                  <th className="px-6 py-4" scope="col">{guide.comparison.headers.time}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#8e6607]/10">
                {guide.comparison.rows.map((row) => (
                  <tr key={row.name}>
                    <th className="px-6 py-4 font-black text-[#2f261f]" scope="row">
                      <a className="text-[#8e6607] underline decoration-[#8e6607]/30 underline-offset-4" href={row.href}>
                        {row.name}
                      </a>
                    </th>
                    <td className="px-6 py-4 font-bold text-[#493b2f]">{row.character}</td>
                    <td className="px-6 py-4 leading-6 text-[#574b3f]">{row.mustSee}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-[#574b3f]">{row.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Route */}
      <section className="px-4 py-12 md:px-6 md:py-16" aria-labelledby="medieval-route-title">
        <div className="mx-auto max-w-[920px]">
          <span className="text-xs font-black uppercase tracking-[0.16em] text-[#8e6607]">
            {guide.route.kicker}
          </span>
          <h2
            id="medieval-route-title"
            className="mt-4 text-3xl font-black leading-none tracking-[-0.05em] text-[#2f261f] md:text-5xl"
          >
            {guide.route.title}
          </h2>
          <p className="mt-4 text-base leading-8 text-[#574b3f]">{guide.route.intro}</p>
          <ol className="mt-8 space-y-4">
            {guide.route.steps.map((step, index) => (
              <li
                className="flex gap-4 rounded-[24px] border border-[#8e6607]/15 bg-white p-5 shadow-sm md:p-6"
                key={step.title}
                data-cta-placement={index === 0 ? "route_start" : undefined}
              >
                <span
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#2f261f] text-sm font-black text-white"
                  aria-hidden="true"
                >
                  {index + 1}
                </span>
                <div>
                  <h3 className="text-lg font-black leading-tight text-[#2f261f]">{step.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-[#574b3f]">{step.text}</p>
                  {step.href ? (
                    <a
                      className="mt-2 inline-flex font-black text-[#8e6607] underline decoration-[#8e6607]/30 underline-offset-4"
                      href={step.href}
                    >
                      {step.linkLabel ?? step.title}
                    </a>
                  ) : null}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Stay */}
      <section className="px-4 py-10 md:px-6 md:py-14" aria-labelledby="medieval-stay-title" data-cta-placement="mid_page_stay">
        <div className="mx-auto max-w-[1180px]">
          <article className="grid overflow-hidden rounded-[36px] border border-[#8e6607]/15 bg-white shadow-2xl shadow-black/10 md:grid-cols-[0.9fr_1.1fr]">
            <div className="relative min-h-[220px] overflow-hidden bg-[#efe0cc] md:min-h-[360px]">
              <Image
                src="/images/beaches/voulamandis-house-courtyard-chios.webp"
                alt={guide.stay.imageAlt}
                fill
                sizes="(min-width: 768px) 45vw, 100vw"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/5 to-transparent" aria-hidden="true" />
              <span className="absolute bottom-5 left-5 rounded-full border border-white/30 bg-white/20 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-white backdrop-blur-md">
                {guide.stay.imageLabel}
              </span>
            </div>
            <div className="flex flex-col justify-center p-6 md:p-10">
              <h2
                id="medieval-stay-title"
                className="text-3xl font-black leading-[1.05] tracking-[-0.04em] text-[#2f261f] md:text-4xl"
              >
                {guide.stay.title}
              </h2>
              <p className="mt-4 text-base leading-8 text-[#574b3f] md:text-lg">
                {guide.stay.text}{" "}
                <a className="font-black text-[#8e6607] underline decoration-[#8e6607]/30 underline-offset-4" href={guide.stay.href}>
                  {guide.stay.linkLabel}
                </a>
              </p>
              <ul className="mt-5 space-y-2">
                {guide.stay.benefits.map((benefit) => (
                  <li className="flex items-start gap-3 text-sm font-bold leading-6 text-[#3b2f25]" key={benefit}>
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#e9f2e3] text-[11px] font-black text-[#3f6b2f]" aria-hidden="true">✓</span>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-7 flex flex-wrap gap-3">
                <a
                  className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#2f261f] px-6 py-3 text-sm font-black !text-white shadow-lg transition hover:-translate-y-0.5"
                  href={getSiteNavigationPath("rates", language)}
                >
                  {guide.stay.primaryLabel}
                </a>
                <a
                  className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#8e6607]/25 bg-[#fff7e8] px-6 py-3 text-sm font-black !text-[#6f5215] transition hover:-translate-y-0.5 hover:bg-[#f9edcf]"
                  href={getSiteNavigationPath("rooms", language)}
                >
                  {guide.stay.secondaryLabel}
                </a>
              </div>
            </div>
          </article>
        </div>
      </section>

      {/* Distances */}
      <section className="px-4 py-10 md:px-6 md:py-14" aria-labelledby="medieval-distances-title">
        <div className="mx-auto max-w-[920px] rounded-[28px] border border-[#8e6607]/15 bg-white p-6 shadow-xl shadow-black/5 md:p-8">
          <h2 id="medieval-distances-title" className="text-2xl font-black leading-tight tracking-[-0.03em] text-[#2f261f] md:text-3xl">
            {guide.distances.title}
          </h2>
          <p className="mt-2 text-sm text-[#7a6a5a]">{guide.distances.note}</p>
          <dl className="mt-5 divide-y divide-[#8e6607]/10">
            {guide.distances.items.map((item) => (
              <div className="grid gap-1 py-3 md:grid-cols-[0.9fr_1.1fr] md:gap-6" key={item.label}>
                <dt className="text-sm font-black text-[#2f261f]">{item.label}</dt>
                <dd className="text-sm leading-7 text-[#574b3f]">
                  {item.href ? (
                    <a
                      className="font-bold text-[#8e6607] underline decoration-[#8e6607]/30 underline-offset-4"
                      data-cta-placement="practical_table"
                      href={item.href}
                    >
                      {item.value}
                    </a>
                  ) : (
                    item.value
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-4 py-10 md:px-6 md:py-14" aria-labelledby="medieval-faq-title">
        <div className="mx-auto max-w-[920px]">
          <span className="text-xs font-black uppercase tracking-[0.16em] text-[#8e6607]">{guide.faq.kicker}</span>
          <h2 id="medieval-faq-title" className="mt-4 font-serif text-[2rem] font-bold leading-tight text-stone-900 md:text-4xl">
            {guide.faq.title}
          </h2>
          <div className="mt-6 space-y-3">
            {guide.faq.items.map((item) => (
              <details className="group rounded-2xl border border-[#8e6607]/15 bg-white p-5 shadow-sm" key={item.question}>
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-black text-[#2f261f] [&::-webkit-details-marker]:hidden">
                  <span>{item.question}</span>
                  <span
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#fff4df] text-lg font-black text-[#8e6607] transition group-open:rotate-45"
                    aria-hidden="true"
                  >
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-7 text-[#574b3f]">{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
