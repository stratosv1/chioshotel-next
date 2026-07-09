import type { FamilyBeachesPageData } from "@/content/family-beaches";

type FamilyBeachesPageProps = {
  data: FamilyBeachesPageData;
};

const whatsappLabels = {
  en: "WhatsApp",
  el: "WhatsApp",
  fr: "WhatsApp",
  de: "WhatsApp",
  it: "WhatsApp",
  es: "WhatsApp",
  tr: "WhatsApp",
};

function getWhatsAppHref(data: FamilyBeachesPageData) {
  const message = `Hello Voulamandis House, I need help choosing a Chios beach. Page: ${data.seo.title}`;
  return `https://wa.me/302271031733?text=${encodeURIComponent(message)}`;
}

export function FamilyBeachesPage({ data }: FamilyBeachesPageProps) {
  const whatsappHref = getWhatsAppHref(data);
  const whatsappLabel = whatsappLabels[data.locale] || "WhatsApp";

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#fff8ed] text-slate-950">
      <section className="relative flex min-h-[68svh] items-end overflow-hidden bg-slate-950 text-white md:min-h-[620px]">
        <img
          src={data.hero.image.src}
          alt=""
          loading="eager"
          className="absolute inset-0 h-full w-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/55 to-slate-950/10 md:bg-[linear-gradient(90deg,rgba(15,23,42,0.92),rgba(15,23,42,0.56),rgba(15,23,42,0.14))]" />
        <div className="relative mx-auto w-full max-w-[1180px] px-4 pb-10 pt-28 md:px-6 md:pb-24">
          <div className="max-w-[760px]">
            <p className="inline-flex rounded-full bg-white/15 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-amber-100 backdrop-blur">
              {data.hero.eyebrow}
            </p>
            <h1 className="mt-5 text-[42px] font-black leading-[0.94] tracking-[-0.06em] md:text-[clamp(54px,7vw,90px)]">
              {data.hero.title}
            </h1>
            <p className="mt-5 max-w-[680px] text-base leading-8 text-white/88 md:text-xl md:leading-9">
              {data.hero.subtitle}
            </p>
            <div className="mt-7 grid grid-cols-2 gap-3 md:flex md:flex-wrap">
              <a
                href={data.hero.primaryCta.href}
                className="inline-flex min-h-[52px] items-center justify-center rounded-2xl bg-amber-300 px-4 text-center text-xs font-black uppercase tracking-[0.08em] text-slate-950 shadow-lg transition hover:-translate-y-0.5 hover:bg-amber-200 md:rounded-full md:px-7"
              >
                {data.hero.primaryCta.label}
              </a>
              <a
                href={data.hero.secondaryCta.href}
                className="inline-flex min-h-[52px] items-center justify-center rounded-2xl border border-white/35 bg-white/12 px-4 text-center text-xs font-black uppercase tracking-[0.08em] text-white transition hover:-translate-y-0.5 hover:bg-white/20 md:rounded-full md:px-7"
              >
                {data.hero.secondaryCta.label}
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-14 md:px-6 md:py-22" aria-labelledby="family-intro-title">
        <div className="mx-auto grid max-w-[1180px] gap-5 md:grid-cols-[0.9fr_1.1fr] md:items-start">
          <div className="rounded-[32px] bg-white p-6 shadow-lg ring-1 ring-slate-900/5 md:p-10">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-amber-700">
              Family planning
            </p>
            <h2
              id="family-intro-title"
              className="mt-3 text-3xl font-black leading-none tracking-[-0.05em] md:text-5xl"
            >
              {data.intro.title}
            </h2>
          </div>
          <div className="grid gap-4">
            {data.intro.text.map((paragraph) => (
              <p
                key={paragraph}
                className="rounded-[28px] bg-white/75 p-5 text-base leading-8 text-slate-700 shadow-sm ring-1 ring-slate-900/5"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </section>

      <section id="family-beaches" className="scroll-mt-28 px-4 py-14 md:px-6 md:py-22" aria-labelledby="family-beaches-title">
        <div className="mx-auto max-w-[1180px]">
          <header className="mb-8 max-w-[820px] md:mb-12">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-amber-700">
              👨‍👩‍👧 Family beaches
            </p>
            <h2
              id="family-beaches-title"
              className="mt-3 text-3xl font-black leading-none tracking-[-0.05em] md:text-5xl"
            >
              {data.highlights.title}
            </h2>
            <p className="mt-4 text-base leading-8 text-slate-700">{data.highlights.subtitle}</p>
          </header>

          <div className="relative">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute right-2 top-[34%] z-20 flex h-10 w-10 items-center justify-center rounded-full bg-slate-950/95 text-xl font-black text-white shadow-xl md:hidden"
            >
              →
            </div>
            <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-5 pr-12 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:grid md:grid-cols-2 md:overflow-visible md:pr-0 xl:grid-cols-4">
              {data.highlights.cards.map((beach) => (
                <a
                  key={beach.name}
                  href={beach.href}
                  className="group w-[84vw] max-w-[380px] flex-none snap-start overflow-hidden rounded-[32px] bg-white shadow-lg ring-1 ring-slate-900/5 transition hover:-translate-y-1 hover:shadow-2xl md:w-auto md:max-w-none"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-white">
                    <img
                      src={beach.image}
                      alt={beach.name}
                      loading="lazy"
                      className="absolute inset-0 !h-full !w-full object-cover transition duration-500 group-hover:scale-105" style={{ height: "100%", width: "100%", objectFit: "cover" }}
                    />
                  </div>
                  <div className="p-5">
                    <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-[11px] font-black uppercase tracking-[0.08em] text-amber-900">
                      {beach.tag}
                    </span>
                    <h3 className="mt-3 text-2xl font-black tracking-[-0.04em]">{beach.name}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-700">{beach.description}</p>
                    <p className="mt-4 rounded-2xl bg-[#fff8ed] p-3 text-sm font-bold leading-6 text-slate-800">
                      {beach.why}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-14 md:px-6 md:py-22" aria-labelledby="family-tips-title">
        <div className="mx-auto max-w-[1180px] rounded-[36px] bg-slate-950 p-6 text-white shadow-2xl md:p-10">
          <h2 id="family-tips-title" className="text-3xl font-black leading-none tracking-[-0.05em] md:text-5xl">
            {data.tips.title}
          </h2>
          <div className="mt-7 grid gap-4 md:grid-cols-3">
            {data.tips.items.map((item) => (
              <article key={item.title} className="rounded-[28px] bg-white/10 p-5 ring-1 ring-white/10">
                <span className="text-3xl">{item.icon}</span>
                <h3 className="mt-4 text-xl font-black tracking-[-0.03em]">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-white/75">{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-14 md:px-6 md:py-22" aria-labelledby="family-stay-title">
        <div className="mx-auto grid max-w-[1180px] overflow-hidden rounded-[38px] bg-white shadow-xl ring-1 ring-slate-900/5 md:grid-cols-2">
          <img src={data.stay.image} alt="Voulamandis House" loading="lazy" className="h-full min-h-[320px] w-full object-cover" />
          <article className="p-7 md:p-12">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-amber-700">Voulamandis House</p>
            <h2 id="family-stay-title" className="mt-3 text-3xl font-black leading-none tracking-[-0.05em] md:text-5xl">
              {data.stay.title}
            </h2>
            <p className="mt-5 text-base leading-8 text-slate-700">{data.stay.text}</p>
            <div className="mt-7 grid grid-cols-2 gap-3 md:flex md:flex-wrap">
              <a href={data.stay.primaryCta.href} className="inline-flex min-h-[50px] items-center justify-center rounded-2xl bg-slate-950 px-4 text-center text-xs font-black uppercase tracking-[0.08em] text-white md:rounded-full md:px-7">
                {data.stay.primaryCta.label}
              </a>
              <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[50px] items-center justify-center rounded-2xl bg-green-600 px-4 text-center text-xs font-black uppercase tracking-[0.08em] text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-green-700 md:rounded-full md:px-7">
                {whatsappLabel}
              </a>
            </div>
          </article>
        </div>
      </section>

      <section className="px-4 pb-18 pt-8 md:px-6 md:pb-24" aria-labelledby="family-final-title">
        <div className="mx-auto max-w-[960px] rounded-[36px] bg-amber-100 p-7 text-center shadow-lg ring-1 ring-amber-900/10 md:p-12">
          <h2 id="family-final-title" className="text-3xl font-black leading-none tracking-[-0.05em] md:text-5xl">
            {data.finalCta.title}
          </h2>
          <p className="mx-auto mt-4 max-w-[720px] text-base leading-8 text-slate-700">{data.finalCta.text}</p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <a href={data.finalCta.secondaryCta.href} className="inline-flex min-h-[50px] items-center justify-center rounded-full border border-amber-900/20 bg-white px-7 text-xs font-black uppercase tracking-[0.08em] text-slate-950">
              {data.finalCta.secondaryCta.label}
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
