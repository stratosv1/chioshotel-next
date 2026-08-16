import type { LanguageCode } from "@/lib/languages";
import {
  getPropertyFaqContext,
  type PropertyFaqContext,
} from "@/content/property-faq-context";

export function PropertyFaqSection({
  language,
  context,
}: {
  language: LanguageCode;
  context: PropertyFaqContext;
}) {
  const { copy, items, allHref } = getPropertyFaqContext(language, context);

  if (!items.length) return null;

  return (
    <section className="px-4 py-10 md:px-8 md:py-16" aria-labelledby={`property-faq-${context}-title`}>
      <div className="mx-auto max-w-5xl">
        <header className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-700">
            {copy.kicker}
          </p>
          <h2
            id={`property-faq-${context}-title`}
            className="mt-3 text-balance font-serif text-3xl font-bold leading-tight text-stone-900 md:text-5xl"
          >
            {copy.title}
          </h2>
          <p className="mt-4 text-sm leading-7 text-stone-600 md:text-base md:leading-8">
            {copy.description}
          </p>
        </header>

        <div className="mt-8 grid gap-3">
          {items.map((item) => (
            <details
              key={item.id}
              className="group rounded-2xl border border-amber-900/10 bg-white shadow-sm open:shadow-md"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-left font-black text-stone-900 marker:hidden md:px-6 md:py-5 [&::-webkit-details-marker]:hidden">
                <span>{item.question}</span>
                <span
                  aria-hidden="true"
                  className="text-xl font-normal text-amber-700 transition-transform group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <div className="border-t border-amber-900/10 px-5 py-4 text-sm leading-7 text-stone-600 md:px-6 md:text-base md:leading-8">
                <p>{item.answer}</p>
                {item.relatedLink ? (
                  <a
                    href={item.relatedLink.href}
                    className="mt-3 inline-flex font-black text-amber-800 underline decoration-amber-300 underline-offset-4"
                  >
                    {item.relatedLink.label}
                  </a>
                ) : null}
              </div>
            </details>
          ))}
        </div>

        <div className="mt-7 text-center">
          <a
            href={allHref}
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-amber-800/20 bg-white px-5 text-xs font-black uppercase tracking-[0.08em] text-amber-800 shadow-sm transition hover:bg-amber-50"
          >
            {copy.allLabel}
          </a>
        </div>
      </div>
    </section>
  );
}
