import type { ChiosMuseumsPageData } from "@/content/chios-museums";

type ChiosMuseumsPageProps = {
  data: ChiosMuseumsPageData;
};

const museumsPageUiCopy = {
  en: { museumsKicker: "Top Chios museums", museumsTitle: "A visual guide to Chios culture", museumsText: "From mastic culture and archaeology to Byzantine art, maritime history, rare books and village folklore, these museums reveal the deeper identity of Chios.", exploreMuseum: "Explore museum →", swipeHint: "Swipe to explore more museums" },
  el: { museumsKicker: "Κορυφαία μουσεία της Χίου", museumsTitle: "Οπτικός οδηγός στον πολιτισμό της Χίου", museumsText: "Από την κουλτούρα της μαστίχας και την αρχαιολογία μέχρι τη βυζαντινή τέχνη, τη ναυτική ιστορία, τα σπάνια βιβλία και τη λαογραφία, αυτά τα μουσεία αποκαλύπτουν τη βαθύτερη ταυτότητα της Χίου.", exploreMuseum: "Δείτε το μουσείο →", swipeHint: "Σύρετε για περισσότερα μουσεία" },
  fr: { museumsKicker: "Musées incontournables de Chios", museumsTitle: "Un guide visuel de la culture de Chios", museumsText: "De la culture du mastic et de l’archéologie à l’art byzantin, l’histoire maritime, les livres rares et le folklore villageois, ces musées révèlent l’identité profonde de Chios.", exploreMuseum: "Explorer le musée →", swipeHint: "Faites glisser pour voir plus de musées" },
  de: { museumsKicker: "Top-Museen auf Chios", museumsTitle: "Ein visueller Guide zur Kultur von Chios", museumsText: "Von Mastixkultur und Archäologie bis zu byzantinischer Kunst, maritimer Geschichte, seltenen Büchern und dörflicher Volkskunde zeigen diese Museen die tiefere Identität von Chios.", exploreMuseum: "Museum ansehen →", swipeHint: "Wischen Sie für weitere Museen" },
  it: { museumsKicker: "I migliori musei di Chios", museumsTitle: "Una guida visiva alla cultura di Chios", museumsText: "Dalla cultura del mastice e l’archeologia all’arte bizantina, la storia marittima, i libri rari e il folklore dei villaggi, questi musei rivelano l’identità più profonda di Chios.", exploreMuseum: "Esplora il museo →", swipeHint: "Scorri per altri musei" },
  es: { museumsKicker: "Museos imprescindibles de Chios", museumsTitle: "Una guía visual de la cultura de Chios", museumsText: "Desde la cultura de la mastiha y la arqueología hasta el arte bizantino, la historia marítima, los libros raros y el folclore de los pueblos, estos museos revelan la identidad más profunda de Chios.", exploreMuseum: "Explorar museo →", swipeHint: "Desliza para ver más museos" },
  tr: { museumsKicker: "Sakız Adası’nın öne çıkan müzeleri", museumsTitle: "Sakız kültürü için görsel bir rehber", museumsText: "Mastik kültürü ve arkeolojiden Bizans sanatına, denizcilik tarihine, nadir kitaplara ve köy folkloruna kadar bu müzeler Sakız Adası’nın daha derin kimliğini gösterir.", exploreMuseum: "Müzeyi keşfet →", swipeHint: "Daha fazla müze için kaydırın" },
} as const;

type MuseumsPageUiLanguage = keyof typeof museumsPageUiCopy;

function getMuseumsPageLanguage(data: ChiosMuseumsPageData): MuseumsPageUiLanguage {
  const path = data.seo.canonicalPath;
  if (path.startsWith("/el/")) return "el";
  if (path.startsWith("/fr/")) return "fr";
  if (path.startsWith("/de/")) return "de";
  if (path.startsWith("/it/")) return "it";
  if (path.startsWith("/es/")) return "es";
  if (path.startsWith("/tr/")) return "tr";
  return "en";
}

export function ChiosMuseumsPage({ data }: ChiosMuseumsPageProps) {
  const language = getMuseumsPageLanguage(data);
  const copy = museumsPageUiCopy[language];

  return (
    <main className="min-h-screen overflow-x-hidden bg-[radial-gradient(circle_at_top_left,rgba(168,120,66,.14),transparent_34rem),linear-gradient(180deg,#fbf6ef_0%,#f4eadf_52%,#fbf6ef_100%)] pb-16 text-stone-800">
      <section className="relative flex min-h-[620px] items-end overflow-hidden text-white max-md:min-h-[76svh]" aria-labelledby="cm-hero-title">
        <div className="absolute inset-0 z-0" aria-hidden="true"><img className="h-full w-full object-cover" src={data.hero.image} alt="" loading="eager" /></div>
        <div className="absolute inset-0 z-[1] bg-[linear-gradient(90deg,rgba(32,24,18,.84)_0%,rgba(32,24,18,.54)_42%,rgba(32,24,18,.18)_100%),linear-gradient(0deg,rgba(32,24,18,.72)_0%,transparent_58%)]" />
        <div className="relative z-[2] mx-auto w-[min(1180px,calc(100%-40px))] py-20 pt-28 max-md:w-[calc(100%-24px)] max-md:py-14 max-md:pt-6">
          <div className="w-[min(780px,100%)] rounded-[2.125rem] border border-white/25 bg-white/10 p-[clamp(30px,5vw,56px)] shadow-[0_34px_90px_rgba(0,0,0,.28)] backdrop-blur-xl max-md:border-0 max-md:bg-transparent max-md:p-0 max-md:shadow-none max-md:backdrop-blur-0">
            <span className="mb-4 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-white drop-shadow-lg before:h-px before:w-8 before:bg-current before:opacity-75">{data.hero.kicker}</span>
            <h1 id="cm-hero-title" className="m-0 max-w-[12ch] text-[clamp(42px,7vw,86px)] font-black leading-[0.94] tracking-[-0.06em] text-white drop-shadow-lg">{data.hero.title}</h1>
            <p className="mt-5 max-w-[680px] text-base leading-7 text-white/95 md:text-lg md:leading-8">{data.hero.description}</p>
            <div className="mt-8 flex flex-wrap gap-3"><a className="inline-flex min-h-[54px] items-center justify-center rounded-full bg-gradient-to-br from-[#a87842] to-[#8e6607] px-7 text-[12px] font-black uppercase tracking-[0.1em] !text-white shadow-lg shadow-amber-900/25" href={data.hero.primaryCta.href}>{data.hero.primaryCta.label}</a><a className="inline-flex min-h-[54px] items-center justify-center rounded-full border border-white/40 bg-white/15 px-7 text-[12px] font-black uppercase tracking-[0.1em] text-white" href={data.hero.secondaryCta.href}>{data.hero.secondaryCta.label}</a></div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20" aria-labelledby="cm-intro-title">
        <div className="mx-auto grid w-[min(1180px,calc(100%-40px))] items-start gap-8 max-md:w-[calc(100%-24px)] lg:grid-cols-[minmax(0,1.35fr)_minmax(320px,.65fr)]">
          <article className="rounded-[1.875rem] border border-amber-800/15 bg-white/90 p-[clamp(28px,4vw,40px)] shadow-xl shadow-stone-900/5"><span className="mb-4 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-amber-900 before:h-px before:w-8 before:bg-current before:opacity-75">{data.intro.kicker}</span><h2 id="cm-intro-title" className="m-0 text-[clamp(32px,4.6vw,58px)] font-black leading-none tracking-[-0.055em] text-stone-800">{data.intro.title}</h2><p className="mt-5 text-base leading-8 text-stone-600">{data.intro.description}</p></article>
          <aside className="flex gap-4 rounded-[1.875rem] border border-amber-800/15 bg-white/90 p-6 shadow-xl shadow-stone-900/5"><div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#fff4df] text-3xl ring-1 ring-amber-900/10" aria-hidden="true">{data.intro.tip.icon}</div><div><h3 className="text-2xl font-black tracking-[-0.04em] text-stone-800">{data.intro.tip.title}</h3><p className="mt-3 text-sm leading-7 text-stone-600">{data.intro.tip.text}</p><a className="mt-4 inline-flex rounded-full border border-amber-800/20 px-4 py-2 text-xs font-black uppercase text-amber-800" href={data.intro.tip.href}>{data.intro.tip.linkLabel}</a></div></aside>
        </div>
      </section>

      <section className="py-16 md:py-20" id="museums" aria-labelledby="cm-museums-title">
        <div className="mx-auto w-[min(1180px,calc(100%-40px))] max-md:w-[calc(100%-24px)]">
          <header className="mx-auto mb-9 max-w-[820px] text-center"><span className="mb-4 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-amber-900 before:h-px before:w-8 before:bg-current before:opacity-75">{copy.museumsKicker}</span><h2 id="cm-museums-title" className="m-0 text-[clamp(32px,4.6vw,58px)] font-black leading-none tracking-[-0.055em] text-stone-800">{copy.museumsTitle}</h2><p className="mx-auto mt-5 max-w-[760px] text-base leading-8 text-stone-600">{copy.museumsText}</p><p className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.1em] text-[#8e6607] shadow-sm ring-1 ring-[#8e6607]/10 md:hidden">{copy.swipeHint} <span aria-hidden="true">→</span></p></header>
          <div className="relative"><div aria-hidden="true" className="pointer-events-none absolute right-2 top-[38%] z-20 flex h-10 w-10 items-center justify-center rounded-full bg-[#2f261f]/95 text-xl font-black text-white shadow-xl md:hidden">→</div><div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-5 pr-10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:grid md:grid-cols-2 md:overflow-visible md:pr-0 xl:grid-cols-3">{data.museums.map((museum, index) => <a className="group w-[84vw] max-w-[380px] flex-none snap-start overflow-hidden rounded-[1.5rem] bg-white shadow-lg shadow-stone-900/5 ring-1 ring-amber-900/10 transition hover:-translate-y-1 hover:shadow-xl md:w-auto md:max-w-none md:rounded-[2rem]" href={museum.href} key={museum.href}><div className="relative aspect-[4/3] overflow-hidden"><img src={museum.image} alt={museum.imageAlt} loading={index < 2 ? "eager" : "lazy"} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" /><span className="absolute left-3 top-3 rounded-full bg-amber-700 px-3 py-1.5 text-xs font-black text-white">{museum.region}</span><span className="absolute right-3 top-3 rounded-full bg-white/95 px-3 py-1.5 text-xs font-black text-amber-800">{museum.mood}</span></div><div className="p-5"><div className="mb-4 flex flex-wrap gap-2">{museum.badges.slice(0, 2).map((badge) => <span className="rounded-full bg-[#fff4df] px-3 py-1 text-[10px] font-black uppercase tracking-[0.08em] text-[#6a4b00] ring-1 ring-[#8e6607]/20" key={badge}>{badge}</span>)}</div><h3 className="break-words font-serif text-2xl font-bold leading-tight text-amber-800">{museum.title}</h3><p className="mt-3 line-clamp-3 text-sm leading-7 text-stone-600">{museum.description}</p><span className="mt-5 inline-flex rounded-full border border-amber-800/20 px-4 py-2 text-xs font-black uppercase text-amber-800">{copy.exploreMuseum}</span></div></a>)}</div></div>
        </div>
      </section>

      <section className="py-16 md:py-20" aria-labelledby="cm-planning-title"><div className="mx-auto grid w-[min(1180px,calc(100%-40px))] items-start gap-8 max-md:w-[calc(100%-24px)] lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]"><article className="rounded-[1.875rem] border border-amber-800/15 bg-white/90 p-[clamp(28px,4vw,40px)] shadow-xl shadow-stone-900/5"><span className="mb-4 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-amber-900 before:h-px before:w-8 before:bg-current before:opacity-75">{data.planning.kicker}</span><h2 id="cm-planning-title" className="m-0 text-[clamp(32px,4.6vw,58px)] font-black leading-none tracking-[-0.055em] text-stone-800">{data.planning.title}</h2><p className="mt-5 text-base leading-8 text-stone-600">{data.planning.description}</p></article><div className="grid gap-3">{data.planning.items.map((item) => <div className="flex items-start gap-4 rounded-2xl border border-amber-800/15 bg-white/90 p-5 shadow-sm shadow-stone-900/5" key={item.title}><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#fff4df] text-xl" aria-hidden="true">{item.icon}</span><div><h3 className="text-lg font-black text-stone-800">{item.title}</h3><p className="mt-2 text-sm leading-7 text-stone-600">{item.text}</p></div></div>)}</div></div></section>
      <section className="py-12 md:py-16" aria-labelledby="cm-stay-title"><div className="mx-auto w-[min(1180px,calc(100%-40px))] max-md:w-[calc(100%-24px)]"><article className="rounded-[2rem] bg-gradient-to-br from-stone-900 to-stone-700 p-[clamp(30px,5vw,56px)] text-white shadow-2xl shadow-stone-900/15"><span className="mb-4 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-white before:h-px before:w-8 before:bg-current before:opacity-75">{data.stay.kicker}</span><h2 id="cm-stay-title" className="m-0 text-[clamp(32px,4.6vw,58px)] font-black leading-none tracking-[-0.055em] text-white">{data.stay.title}</h2><p className="mt-5 max-w-[760px] text-base leading-8 text-white/85">{data.stay.text}</p><div className="mt-8 flex flex-wrap gap-3"><a className="inline-flex min-h-[54px] items-center justify-center rounded-full bg-white px-7 text-[12px] font-black uppercase tracking-[0.1em] text-stone-900" href={data.stay.primaryCta.href}>{data.stay.primaryCta.label}</a><a className="inline-flex min-h-[54px] items-center justify-center rounded-full border border-white/30 bg-white/15 px-7 text-[12px] font-black uppercase tracking-[0.1em] text-white" href={data.stay.secondaryCta.href}>{data.stay.secondaryCta.label}</a></div></article></div></section>
    </main>
  );
}
