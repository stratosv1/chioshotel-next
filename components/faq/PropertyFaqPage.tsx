import type { PropertyFaqPageData } from "@/content/property-faq";

export function PropertyFaqPage({ data }: { data: PropertyFaqPageData }) {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#fbf6ef] text-[#2f261f]">
      <section className="relative isolate overflow-hidden bg-[#2f261f] px-4 py-16 text-white sm:px-6 lg:px-8 lg:py-24" aria-labelledby="property-faq-title">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(245,158,11,0.24),transparent_34rem),linear-gradient(135deg,rgba(47,38,31,0.98),rgba(92,64,38,0.94))]" />
        <div className="mx-auto max-w-6xl">
          <div className="max-w-3xl">
            <span className="inline-flex rounded-full border border-amber-200/30 bg-white/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.24em] text-amber-100">
              {data.hero.kicker}
            </span>
            <h1 id="property-faq-title" className="mt-6 text-balance font-serif text-4xl font-bold leading-[0.98] tracking-[-0.04em] text-white sm:text-5xl lg:text-7xl">
              {data.hero.title}
            </h1>
            <p className="mt-6 max-w-2xl text-pretty text-base leading-8 text-stone-100/90 sm:text-lg">
              {data.hero.description}
            </p>
          </div>
        </div>
      </section>

      <section className="px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="mx-auto max-w-4xl rounded-[1.75rem] border border-amber-900/10 bg-white p-6 shadow-sm md:p-8">
          <p className="text-base leading-8 text-stone-600 md:text-lg">{data.intro}</p>
        </div>
      </section>

      <div className="px-4 pb-14 sm:px-6 lg:px-8 lg:pb-20">
        <div className="mx-auto max-w-6xl space-y-8">
          {data.categories.map((category) => (
            <section
              key={category.id}
              className="rounded-[1.75rem] border border-amber-900/10 bg-white p-5 shadow-sm md:p-8"
              aria-labelledby={`faq-category-${category.id}`}
            >
              <header className="max-w-3xl">
                <h2 id={`faq-category-${category.id}`} className="font-serif text-3xl font-bold tracking-[-0.03em] text-stone-900 md:text-4xl">
                  {category.title}
                </h2>
                <p className="mt-3 text-sm leading-7 text-stone-600 md:text-base md:leading-8">
                  {category.description}
                </p>
              </header>

              <div className="mt-6 grid gap-3">
                {category.items.map((item) => (
                  <details key={item.id} className="group rounded-2xl border border-amber-900/10 bg-[#fffaf5] open:bg-white open:shadow-sm">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-left font-black text-stone-900 marker:hidden md:px-6 md:py-5 [&::-webkit-details-marker]:hidden">
                      <span>{item.question}</span>
                      <span aria-hidden="true" className="text-xl font-normal text-amber-700 transition-transform group-open:rotate-45">+</span>
                    </summary>
                    <div className="border-t border-amber-900/10 px-5 py-4 text-sm leading-7 text-stone-600 md:px-6 md:text-base md:leading-8">
                      <p>{item.answer}</p>
                      {item.relatedLink ? (
                        <a href={item.relatedLink.href} className="mt-3 inline-flex font-black text-amber-800 underline decoration-amber-300 underline-offset-4">
                          {item.relatedLink.label}
                        </a>
                      ) : null}
                    </div>
                  </details>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>

      <section className="px-4 pb-16 sm:px-6 lg:px-8 lg:pb-24">
        <div className="mx-auto max-w-5xl rounded-[2rem] bg-[#2f261f] p-7 text-white shadow-xl md:flex md:items-center md:justify-between md:gap-8 md:p-10">
          <div className="max-w-2xl">
            <h2 className="font-serif text-3xl font-bold md:text-4xl">{data.cta.title}</h2>
            <p className="mt-3 text-sm leading-7 text-stone-200 md:text-base md:leading-8">{data.cta.text}</p>
          </div>
          <div className="mt-6 flex flex-wrap gap-3 md:mt-0 md:shrink-0">
            <a href={data.cta.primaryHref} className="inline-flex min-h-12 items-center justify-center rounded-full bg-amber-200 px-5 text-xs font-black uppercase tracking-[0.08em] text-stone-900 transition hover:bg-white">
              {data.cta.primaryLabel}
            </a>
            <a href={data.cta.secondaryHref} className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/25 bg-white/10 px-5 text-xs font-black uppercase tracking-[0.08em] text-white transition hover:bg-white/20">
              {data.cta.secondaryLabel}
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
