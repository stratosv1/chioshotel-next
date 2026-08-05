import Image from "next/image";
import Link from "next/link";
import type { KarfasBeachElData } from "@/content/karfas-beach-el";

type KarfasBeachPageProps = {
  data: KarfasBeachElData;
};

export function KarfasBeachPage({ data }: KarfasBeachPageProps) {
  return (
    <main className="min-h-screen bg-[#f7f2e8] pt-28 text-[#3f362d] md:pt-32">
      <div className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-[#756759]">
          <Link className="transition hover:text-[#8a6a43]" href="/el/">
            Αρχική
          </Link>
          <span aria-hidden="true" className="mx-2">/</span>
          <Link className="transition hover:text-[#8a6a43]" href="/el/paralies-xios/">
            Παραλίες Χίου
          </Link>
          <span aria-hidden="true" className="mx-2">/</span>
          <span aria-current="page">Καρφάς</span>
        </nav>

        <section className="grid items-center gap-9 overflow-hidden rounded-[2rem] bg-[#efe5d3] p-6 shadow-sm md:grid-cols-[0.9fr_1.1fr] md:p-10 lg:gap-14">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#8a6a43]">
              {data.hero.kicker}
            </p>
            <h1 className="text-balance font-serif text-4xl leading-tight text-[#342b24] md:text-5xl lg:text-6xl">
              {data.hero.title}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#62564a]">
              {data.hero.description}
            </p>
            <div className="mt-7 flex flex-wrap gap-2" aria-label="Χαρακτηριστικά παραλίας">
              {data.hero.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-[#cdbb9f] bg-white/70 px-4 py-2 text-sm font-medium text-[#66533e]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="relative aspect-[4/3] overflow-hidden rounded-[1.6rem] bg-[#ddd0ba]">
            <Image
              alt={data.hero.imageAlt}
              className="object-cover"
              fill
              priority
              sizes="(min-width: 768px) 55vw, 100vw"
              src={data.hero.image}
            />
          </div>
        </section>

        <section aria-labelledby="karfas-details" className="py-16">
          <div className="mb-8 max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8a6a43]">Γρήγορη απάντηση</p>
            <h2 id="karfas-details" className="mt-2 font-serif text-3xl text-[#342b24] md:text-4xl">
              Γιατί να επισκεφθείτε τον Καρφά
            </h2>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {data.details.map((detail) => (
              <article key={detail.title} className="rounded-3xl border border-[#dfd2bf] bg-white p-6 shadow-sm">
                <span aria-hidden="true" className="text-3xl">{detail.icon}</span>
                <h3 className="mt-4 text-xl font-semibold text-[#3f362d]">{detail.title}</h3>
                <p className="mt-3 leading-7 text-[#6d6155]">{detail.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-8 rounded-[2rem] bg-[#3f4f48] p-6 text-white md:grid-cols-[0.8fr_1.2fr] md:p-10">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#d9c8a9]">Με μια ματιά</p>
            <h2 className="mt-3 font-serif text-3xl md:text-4xl">Πληροφορίες παραλίας</h2>
            <p className="mt-4 leading-7 text-white/75">
              Τα βασικά χαρακτηριστικά για να οργανώσετε εύκολα τη μέρα σας στον Καρφά.
            </p>
          </div>
          <dl className="grid gap-3 sm:grid-cols-2">
            {data.quickFacts.map((fact) => (
              <div key={fact.label} className="rounded-2xl bg-white/10 p-4">
                <dt className="text-sm text-white/65">{fact.label}</dt>
                <dd className="mt-1 font-semibold text-white">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="grid gap-10 py-16 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8a6a43]">Τοπικός οδηγός</p>
            <h2 className="mt-2 font-serif text-3xl text-[#342b24] md:text-4xl">{data.guide.title}</h2>
            <div className="mt-6 space-y-5 text-lg leading-8 text-[#65594d]">
              {data.guide.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-[1.35fr_0.65fr]">
            {data.gallery.map((image, index) => (
              <figure
                key={image.src}
                className="min-h-[380px] overflow-hidden rounded-3xl bg-[#ddd0ba] sm:min-h-[470px]"
              >
                <Image
                  alt={image.alt}
                  className="h-full w-full object-cover"
                  height={image.height}
                  sizes={index === 0 ? "(min-width: 1024px) 44vw, 65vw" : "(min-width: 1024px) 20vw, 35vw"}
                  src={image.src}
                  unoptimized={index === 1}
                  width={image.width}
                />
              </figure>
            ))}
          </div>
        </section>

        <section className="grid overflow-hidden rounded-[2rem] border border-[#dfd2bf] bg-white lg:grid-cols-[0.7fr_1.3fr]">
          <div className="p-7 md:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8a6a43]">Χάρτης</p>
            <h2 className="mt-2 font-serif text-3xl text-[#342b24]">{data.map.title}</h2>
            <p className="mt-4 leading-7 text-[#6d6155]">
              Ανοίξτε τη διαδρομή στο κινητό σας πριν ξεκινήσετε από τον Κάμπο.
            </p>
            <a
              className="mt-6 inline-flex rounded-full bg-[#8a6a43] px-6 py-3 font-semibold text-white transition hover:bg-[#725537]"
              href={data.map.gpsHref}
              rel="noreferrer"
              target="_blank"
            >
              Άνοιγμα στο GPS
            </a>
          </div>
          <iframe
            allowFullScreen
            className="min-h-[360px] w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            src={data.map.embedUrl}
            title={data.map.title}
          />
        </section>

        <section className="mt-16 rounded-[2rem] bg-[#eadfc9] p-7 text-center md:p-12">
          <h2 className="font-serif text-3xl text-[#342b24] md:text-4xl">{data.cta.title}</h2>
          <p className="mx-auto mt-4 max-w-3xl text-lg leading-8 text-[#65594d]">{data.cta.text}</p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Link className="rounded-full bg-[#3f4f48] px-7 py-3 font-semibold text-white transition hover:bg-[#314039]" href={data.cta.roomsHref}>
              {data.cta.roomsLabel}
            </Link>
            <Link className="rounded-full border border-[#8a6a43] px-7 py-3 font-semibold text-[#725537] transition hover:bg-white/60" href={data.cta.beachesHref}>
              {data.cta.beachesLabel}
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
