import Image from "next/image";
import Link from "next/link";

type PolishSeoLandingPageProps = {
  eyebrow: string;
  title: string;
  intro: string;
  highlights: string[];
  bodyTitle: string;
  paragraphs: string[];
  primaryHref: string;
  primaryLabel: string;
  secondaryHref?: string;
  secondaryLabel?: string;
};

export function PolishSeoLandingPage({
  eyebrow,
  title,
  intro,
  highlights,
  bodyTitle,
  paragraphs,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
}: PolishSeoLandingPageProps) {
  return (
    <main className="bg-[#fbf8f2] text-stone-800">
      <section className="mx-auto grid min-h-[70vh] max-w-7xl items-center gap-10 px-5 py-12 md:grid-cols-2 md:px-8 md:py-16">
        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-stone-600">
            {eyebrow}
          </p>
          <h1 className="max-w-3xl text-4xl font-semibold leading-tight text-stone-900 md:text-6xl">
            {title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-stone-700">{intro}</p>

          <div className="mt-7 flex flex-wrap gap-2">
            {highlights.map((item) => (
              <span
                key={item}
                className="rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700"
              >
                {item}
              </span>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={primaryHref}
              className="rounded-full bg-stone-800 px-6 py-3 text-sm font-semibold text-white transition hover:bg-stone-700"
            >
              {primaryLabel}
            </Link>
            {secondaryHref && secondaryLabel ? (
              <Link
                href={secondaryHref}
                className="rounded-full border border-stone-400 bg-white px-6 py-3 text-sm font-semibold text-stone-800 transition hover:bg-stone-50"
              >
                {secondaryLabel}
              </Link>
            ) : null}
          </div>
        </div>

        <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] border border-stone-200 bg-stone-100 shadow-sm">
          <Image
            src="/images/activities/chios.hotels.voulamandis.house_.hero_.image_.webp"
            alt="Voulamandis House w Kambos na wyspie Chios"
            fill
            priority
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      </section>

      <section className="border-y border-stone-200 bg-white">
        <div className="mx-auto max-w-5xl px-5 py-14 md:px-8 md:py-18">
          <h2 className="text-3xl font-semibold text-stone-900 md:text-4xl">{bodyTitle}</h2>
          <div className="mt-6 space-y-5 text-base leading-8 text-stone-700 md:text-lg">
            {paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-12 md:px-8">
        <div className="rounded-[2rem] border border-stone-200 bg-[#f3ede3] p-7 md:p-10">
          <h2 className="text-2xl font-semibold text-stone-900">Voulamandis House — pobyt na Chios w spokojnym Kambos</h2>
          <p className="mt-3 max-w-3xl leading-7 text-stone-700">
            Pokoje i apartamenty dla par oraz rodzin, bezpośredni kontakt z obiektem, spokojne otoczenie i dogodny dojazd do miasta Chios, portu, lotniska i plaż.
          </p>
          <div className="mt-6 flex flex-wrap gap-4 text-sm font-semibold">
            <Link href="/pl/noclegi-chios/" className="underline underline-offset-4">Noclegi na Chios</Link>
            <Link href="/pl/hotele-chios/" className="underline underline-offset-4">Hotele na Chios</Link>
            <Link href="/pl/pokoje-na-chios/" className="underline underline-offset-4">Pokoje na Chios</Link>
            <Link href="/pl/apartamenty-na-chios/" className="underline underline-offset-4">Apartamenty na Chios</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
