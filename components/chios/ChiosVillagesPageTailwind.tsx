import Image from "next/image";
import type { ChiosVillagesPageData } from "@/content/chios-villages";
import { ChiosCollectionImageGallery } from "@/components/chios/ChiosCollectionImageGallery";
import { PlaceCard } from "@/components/cards/PlaceCard";
import { AnswerFirstSeoBlock } from "@/components/seo/AnswerFirstSeoBlock";
import { MedievalVillagesAnswer, MedievalVillagesGuideSections } from "@/components/chios/MedievalVillagesGuide";

type ChiosVillagesPageProps = {
  data: ChiosVillagesPageData;
};

const villagesPageUiCopy = {
  en: {
    villagesKicker: "Top Chios villages",
    villagesTitle: "A visual guide to local character",
    villagesText:
      "From medieval fortress villages and mastic traditions to seaside food stops, these villages show the deeper identity of Chios.",
    swipeHint: "Swipe to explore more villages",
  },
  el: {
    villagesKicker: "Κορυφαία χωριά της Χίου",
    villagesTitle: "Ένας οπτικός οδηγός στον τοπικό χαρακτήρα",
    villagesText:
      "Από μεσαιωνικά καστροχώρια και παραδόσεις μαστίχας μέχρι παραθαλάσσιες στάσεις για φαγητό, αυτά τα χωριά δείχνουν τη βαθύτερη ταυτότητα της Χίου.",
    swipeHint: "Σύρετε για να δείτε περισσότερα χωριά",
  },
  fr: {
    villagesKicker: "Villages incontournables de Chios",
    villagesTitle: "Un guide visuel du caractère local",
    villagesText:
      "Des villages fortifiés médiévaux et des traditions du mastic aux haltes gourmandes en bord de mer, ces villages révèlent l’identité profonde de Chios.",
    swipeHint: "Faites glisser pour voir plus de villages",
  },
  de: {
    villagesKicker: "Top-Dörfer auf Chios",
    villagesTitle: "Ein visueller Guide zum lokalen Charakter",
    villagesText:
      "Von mittelalterlichen Wehrdörfern und Mastixtraditionen bis zu Essensstopps am Meer zeigen diese Dörfer die tiefere Identität von Chios.",
    swipeHint: "Wischen Sie, um weitere Dörfer zu sehen",
  },
  it: {
    villagesKicker: "I migliori villaggi di Chios",
    villagesTitle: "Una guida visiva al carattere locale",
    villagesText:
      "Dai villaggi fortificati medievali e le tradizioni del mastice alle soste gastronomiche sul mare, questi villaggi mostrano l’identità più profonda di Chios.",
    swipeHint: "Scorri per vedere altri villaggi",
  },
  es: {
    villagesKicker: "Pueblos imprescindibles de Chios",
    villagesTitle: "Una guía visual del carácter local",
    villagesText:
      "Desde pueblos fortaleza medievales y tradiciones del mastiha hasta paradas gastronómicas junto al mar, estos pueblos muestran la identidad más profunda de Chios.",
    swipeHint: "Desliza para ver más pueblos",
  },
  tr: {
    villagesKicker: "Sakız Adası’nın öne çıkan köyleri",
    villagesTitle: "Yerel karakter için görsel bir rehber",
    villagesText:
      "Orta Çağ kale köylerinden mastika geleneklerine ve deniz kenarındaki lezzet duraklarına kadar bu köyler, Sakız Adası’nın daha derin kimliğini gösterir.",
    swipeHint: "Daha fazla köy görmek için kaydırın",
  },
} as const;

const villageCategoryGuideCopy = {
  en: {
    kicker: "Village routes",
    title: "Find Chios villages by experience",
    text: "Choose a route before you start driving: mastic culture, medieval stone villages or relaxed seaside stops.",
    items: [
      {
        label: "Mastic villages",
        text: "Pyrgi, Mesta, Olympoi, Armolia and Vessa in southern Chios.",
        href: "/chios-mastic-villages/",
      },
      {
        label: "Medieval villages",
        text: "Fortress layouts, stone alleys, castles and historic squares.",
        href: "/chios-medieval-villages/",
      },
      {
        label: "Seaside villages",
        text: "Harbor views, fish taverns and slower coastal routes.",
        href: "/chios-seaside-villages/",
      },
    ],
  },
  el: {
    kicker: "Διαδρομές χωριών",
    title: "Βρείτε χωριά της Χίου ανά εμπειρία",
    text: "Διαλέξτε πρώτα τύπο διαδρομής: μαστιχική παράδοση, μεσαιωνικά χωριά ή χαλαρές παραθαλάσσιες στάσεις.",
    items: [
      {
        label: "Μαστιχοχώρια",
        text: "Πυργί, Μεστά, Ολύμποι, Αρμόλια και Βέσσα στη νότια Χίο.",
        href: "/el/mastichochoria-xios/",
      },
      {
        label: "Μεσαιωνικά χωριά",
        text: "Καστροχωρίτικη δομή, πέτρινα σοκάκια, κάστρα και ιστορικές πλατείες.",
        href: "/el/mesaionika-xoria-xios/",
      },
      {
        label: "Παραθαλάσσια χωριά",
        text: "Λιμανάκια, ψαροταβέρνες και πιο χαλαρές διαδρομές κοντά στη θάλασσα.",
        href: "/el/parathalassia-xoria-xios/",
      },
    ],
  },
  fr: {
    kicker: "Routes de villages",
    title: "Trouvez les villages de Chios par expérience",
    text: "Choisissez votre route : culture du mastic, villages médiévaux en pierre ou haltes calmes en bord de mer.",
    items: [
      {
        label: "Villages du mastic",
        text: "Pyrgi, Mesta, Olympoi, Armolia et Vessa dans le sud de Chios.",
        href: "/fr/villages-du-mastic-chios/",
      },
      {
        label: "Villages médiévaux",
        text: "Villages fortifiés, ruelles de pierre, châteaux et places historiques.",
        href: "/fr/villages-medievaux-chios/",
      },
      {
        label: "Villages en bord de mer",
        text: "Ports, tavernes de poisson et routes côtières plus lentes.",
        href: "/fr/villages-en-bord-de-mer-chios/",
      },
    ],
  },
  de: {
    kicker: "Dörfer-Routen",
    title: "Dörfer auf Chios nach Erlebnis finden",
    text: "Wählen Sie Ihre Route: Mastixkultur, mittelalterliche Steindörfer oder entspannte Stopps am Meer.",
    items: [
      {
        label: "Mastixdörfer",
        text: "Pyrgi, Mesta, Olympoi, Armolia und Vessa im Süden von Chios.",
        href: "/de/mastixdoerfer-chios/",
      },
      {
        label: "Mittelalterliche Dörfer",
        text: "Wehrstrukturen, Steingassen, Burgen und historische Plätze.",
        href: "/de/mittelalterliche-doerfer-chios/",
      },
      {
        label: "Küstendörfer",
        text: "Hafenblicke, Fischtavernen und ruhige Küstenrouten.",
        href: "/de/kuestendoerfer-chios/",
      },
    ],
  },
  it: {
    kicker: "Itinerari nei villaggi",
    title: "Trova i villaggi di Chios per esperienza",
    text: "Scegli la rotta: cultura del mastice, villaggi medievali in pietra o soste rilassate sul mare.",
    items: [
      {
        label: "Villaggi del mastice",
        text: "Pyrgi, Mesta, Olympoi, Armolia e Vessa nel sud di Chios.",
        href: "/it/villaggi-del-mastice-chios/",
      },
      {
        label: "Villaggi medievali",
        text: "Strutture fortificate, vicoli in pietra, castelli e piazze storiche.",
        href: "/it/villaggi-medievali-chios/",
      },
      {
        label: "Villaggi sul mare",
        text: "Porti, taverne di pesce e itinerari costieri più lenti.",
        href: "/it/villaggi-sul-mare-chios/",
      },
    ],
  },
  es: {
    kicker: "Rutas por pueblos",
    title: "Encuentra pueblos de Chios por experiencia",
    text: "Elige una ruta: cultura del mastiha, pueblos medievales de piedra o paradas costeras tranquilas.",
    items: [
      {
        label: "Pueblos del mastiha",
        text: "Pyrgi, Mesta, Olympoi, Armolia y Vessa en el sur de Chios.",
        href: "/es/pueblos-del-mastiha-quios/",
      },
      {
        label: "Pueblos medievales",
        text: "Trazados fortificados, callejones de piedra, castillos y plazas históricas.",
        href: "/es/pueblos-medievales-quios/",
      },
      {
        label: "Pueblos costeros",
        text: "Puertos, tabernas de pescado y rutas costeras más tranquilas.",
        href: "/es/pueblos-costeros-quios/",
      },
    ],
  },
  tr: {
    kicker: "Köy rotaları",
    title: "Sakız Adası köylerini deneyime göre bulun",
    text: "Rotanızı seçin: mastik kültürü, Orta Çağ taş köyleri veya sakin sahil durakları.",
    items: [
      {
        label: "Mastik köyleri",
        text: "Güney Sakız’da Pyrgi, Mesta, Olympoi, Armolia ve Vessa.",
        href: "/tr/sakiz-adasi-mastik-koyleri/",
      },
      {
        label: "Orta Çağ köyleri",
        text: "Kale dokusu, taş sokaklar, kaleler ve tarihi meydanlar.",
        href: "/tr/sakiz-adasi-orta-cag-koyleri/",
      },
      {
        label: "Sahil köyleri",
        text: "Liman manzaraları, balık tavernaları ve sakin kıyı rotaları.",
        href: "/tr/sakiz-adasi-sahil-koyleri/",
      },
    ],
  },
} as const;

type VillagesPageUiLanguage = keyof typeof villagesPageUiCopy;

function getVillagesPageLanguage(
  data: ChiosVillagesPageData,
): VillagesPageUiLanguage {
  const path = data.seo.canonicalPath;

  if (path.startsWith("/el/")) return "el";
  if (path.startsWith("/fr/")) return "fr";
  if (path.startsWith("/de/")) return "de";
  if (path.startsWith("/it/")) return "it";
  if (path.startsWith("/es/")) return "es";
  if (path.startsWith("/tr/")) return "tr";

  return "en";
}

function getExploreVillageLabel(language: VillagesPageUiLanguage, title: string) {
  const villageName = title.split(":")[0].trim();

  if (language === "el") return `Δείτε το ${villageName}`;
  if (language === "fr") return `Voir ${villageName}`;
  if (language === "de") return `${villageName} ansehen`;
  if (language === "it") return `Scopri ${villageName}`;
  if (language === "es") return `Ver ${villageName}`;
  if (language === "tr") return `${villageName} köyünü keşfet`;

  return `Explore ${villageName}`;
}

export function ChiosVillagesPageTailwind({ data }: ChiosVillagesPageProps) {
  const language = getVillagesPageLanguage(data);
  const copy = villagesPageUiCopy[language];
  const categoryGuide = villageCategoryGuideCopy[language];
  const shouldShowCategoryGuide = data.villages.length > 5;
  // Descriptive alt for the hero (search engines skip empty-alt images when
  // choosing result thumbnails), same as the beaches page.
  const heroImageAlt =
    data.villages.find((village) => village.image === data.hero.image)?.imageAlt ??
    data.hero.title;

  return (
    <main className="overflow-hidden bg-[#f7efe5] text-[#2f261f]">
      <section
        className="relative flex min-h-[68svh] items-end overflow-hidden text-white md:min-h-[620px]"
        aria-labelledby="villages-hero-title"
      >
        <Image
          src={data.hero.image}
          alt={heroImageAlt}
          fill
          priority
          sizes="100vw"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" aria-hidden="true" />

        <div className="relative z-10 mx-auto w-full max-w-[1180px] px-4 py-16 md:px-6 md:py-24">
          <div className="max-w-[720px] rounded-[34px] border border-white/25 bg-black/35 p-6 shadow-2xl backdrop-blur-md md:p-10">
            <span className="mb-4 inline-flex items-center gap-3 text-xs font-black uppercase tracking-[0.18em] text-white/90 before:h-px before:w-8 before:bg-current">
              {data.hero.kicker}
            </span>
            <h1
              id="villages-hero-title"
              className="max-w-[12ch] text-[42px] font-black leading-[0.95] tracking-[-0.055em] text-white drop-shadow-xl md:text-[clamp(54px,7vw,88px)]"
            >
              {data.hero.title}
            </h1>
            <p className="mt-6 max-w-[650px] text-base font-semibold leading-8 text-white/90 md:text-lg">
              {data.hero.description}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a
                className="inline-flex min-h-[54px] items-center justify-center rounded-full bg-gradient-to-r from-[#a87842] to-[#8e6607] px-7 text-xs font-black uppercase tracking-[0.12em] text-white shadow-xl transition hover:-translate-y-1"
                href={data.hero.primaryCta.href}
              >
                {data.hero.primaryCta.label}
              </a>
              <a
                className="inline-flex min-h-[54px] items-center justify-center rounded-full border border-white/40 bg-white/15 px-7 text-xs font-black uppercase tracking-[0.12em] text-white transition hover:-translate-y-1 hover:bg-white/25"
                href={data.hero.secondaryCta.href}
              >
                {data.hero.secondaryCta.label}
              </a>
            </div>
          </div>
        </div>
      </section>

      {data.medievalGuide ? (
        <MedievalVillagesAnswer guide={data.medievalGuide} />
      ) : (
        <AnswerFirstSeoBlock kind="villages" language={language} />
      )}

      <ChiosCollectionImageGallery
        items={data.villages}
        kind="villages"
        language={language}
      />

      {shouldShowCategoryGuide ? (
        <section className="px-4 py-10 md:px-6 md:py-14" aria-labelledby="village-category-guide-title">
          <div className="mx-auto max-w-[1180px] rounded-[32px] border border-[#8e6607]/15 bg-white/80 p-5 shadow-xl shadow-black/5 backdrop-blur md:p-8">
            <div className="mb-5 max-w-[760px] md:mb-7">
              <span className="text-xs font-black uppercase tracking-[0.16em] text-[#8e6607]">
                {categoryGuide.kicker}
              </span>
              <h2
                id="village-category-guide-title"
                className="mt-3 text-2xl font-black leading-tight tracking-[-0.04em] text-[#2f261f] md:text-4xl"
              >
                {categoryGuide.title}
              </h2>
              <p className="mt-4 text-sm leading-7 text-[#574b3f] md:text-base">
                {categoryGuide.text}
              </p>
            </div>
            <div className="relative">
              <div data-carousel-track="true" className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 pr-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:grid md:grid-cols-3 md:overflow-visible md:pr-0">
              {categoryGuide.items.map((item) => (
                <a
                  className="group flex w-[78vw] max-w-[320px] flex-none snap-start flex-col rounded-3xl border border-[#eadfce] bg-white p-5 shadow-[0_1px_2px_rgba(47,38,31,0.06)] transition duration-200 hover:shadow-[0_10px_30px_rgba(47,38,31,0.12)] focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-700/25 md:w-auto md:max-w-none"
                  href={item.href}
                  key={item.href}
                >
                  <h3 className="text-[19px] font-semibold leading-snug tracking-[-0.01em] text-[#2f261f]">
                    {item.label}
                  </h3>
                  <p className="mt-1.5 text-sm leading-[1.5] text-[#5f4e41]">
                    {item.text}
                  </p>
                  <span className="mt-auto pt-4">
                    <span className="inline-flex min-h-11 items-center gap-1 rounded-full bg-[#fbeee0] px-4 text-sm font-semibold text-[#7c2d12] transition group-hover:bg-[#f7e0c8]">
                      {item.label} <span aria-hidden="true">→</span>
                    </span>
                  </span>
                </a>
              ))}
            </div>
          </div>
          </div>
        </section>
      ) : null}

      {data.medievalGuide ? (
        <MedievalVillagesGuideSections guide={data.medievalGuide} language={language} />
      ) : (
        <>
      <section className="px-4 py-12 md:px-6 md:py-18" aria-labelledby="villages-intro-title">
        <div className="mx-auto grid max-w-[1180px] gap-5 md:grid-cols-[1.05fr_0.95fr]">
          <article className="rounded-[32px] border border-[#8e6607]/15 bg-white p-6 shadow-xl shadow-black/5 md:p-9">
            <span className="text-xs font-black uppercase tracking-[0.16em] text-[#8e6607]">
              {data.intro.kicker}
            </span>
            <h2
              id="villages-intro-title"
              className="mt-4 text-3xl font-black leading-none tracking-[-0.05em] text-[#2f261f] md:text-5xl"
            >
              {data.intro.title}
            </h2>
            <p className="mt-5 text-base leading-8 text-[#574b3f] md:text-lg">
              {data.intro.description}
            </p>
          </article>

          <aside className="flex gap-5 rounded-[32px] border border-[#8e6607]/15 bg-white p-6 shadow-xl shadow-black/5 md:p-9">
            <div
              className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#fff4df] text-3xl shadow"
              aria-hidden="true"
            >
              {data.intro.tip.icon}
            </div>
            <div>
              <h3 className="text-2xl font-black leading-tight tracking-[-0.04em] text-[#2f261f]">
                {data.intro.tip.title}
              </h3>
              <p className="mt-3 text-base leading-7 text-[#574b3f]">
                {data.intro.tip.text}
              </p>
              <a
                className="mt-4 inline-flex text-sm font-black uppercase tracking-[0.1em] text-[#8e6607]"
                href={data.intro.tip.href}
              >
                {data.intro.tip.linkLabel}
              </a>
            </div>
          </aside>
        </div>
      </section>

      <section className="px-4 py-12 md:px-6 md:py-18" id="villages" aria-labelledby="villages-list-title">
        <div className="mx-auto max-w-7xl">
          <header className="mb-6 max-w-[820px] md:mb-8">
            <span className="text-xs font-black uppercase tracking-[0.16em] text-[#8e6607]">
              {copy.villagesKicker}
            </span>
            <h2
              id="villages-list-title"
              className="mt-4 tracking-[-0.02em] text-[2rem] font-extrabold leading-tight text-stone-900 md:text-5xl"
            >
              {copy.villagesTitle}
            </h2>
            <p className="mt-5 max-w-[760px] text-base leading-8 text-[#574b3f] md:text-lg">
              {copy.villagesText}
            </p>
            <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.1em] text-[#8e6607] shadow-sm ring-1 ring-[#8e6607]/10 md:hidden">
              {copy.swipeHint} <span aria-hidden="true">→</span>
            </p>
          </header>

          <div className="relative">
            <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-5 pr-10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:grid md:grid-cols-2 md:overflow-visible md:pr-0 xl:grid-cols-4" id="villages-list">
              {data.villages.map((village, index) => (
                <PlaceCard
                  key={village.href}
                  href={village.href}
                  title={village.title}
                  description={village.description}
                  image={village.image}
                  imageAlt={village.imageAlt}
                  topBadge={village.mood}
                  bottomBadge={village.region}
                  tags={village.badges}
                  ctaLabel={getExploreVillageLabel(language, village.title)}
                  priority={index < 2}
                  sizes="(min-width: 1280px) 25vw, (min-width: 768px) 50vw, 84vw"
                  className="w-[84vw] max-w-[360px] flex-none snap-start md:w-auto md:max-w-none"
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-12 md:px-6 md:py-18" aria-labelledby="villages-planning-title">
        <div className="mx-auto grid max-w-[1180px] gap-6 rounded-[34px] border border-[#8e6607]/15 bg-white p-6 shadow-xl shadow-black/5 md:grid-cols-[0.9fr_1.1fr] md:p-10">
          <article>
            <span className="text-xs font-black uppercase tracking-[0.16em] text-[#8e6607]">
              {data.planning.kicker}
            </span>
            <h2
              id="villages-planning-title"
              className="mt-4 text-3xl font-black leading-none tracking-[-0.05em] text-[#2f261f] md:text-5xl"
            >
              {data.planning.title}
            </h2>
            <p className="mt-5 text-base leading-8 text-[#574b3f] md:text-lg">
              {data.planning.description}
            </p>
          </article>
          <div className="grid gap-4">
            {data.planning.items.map((item) => (
              <div
                className="flex gap-4 rounded-2xl border border-[#8e6607]/10 bg-[#fffdfa] p-5"
                key={item.title}
              >
                <span
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#fff4df] text-2xl"
                  aria-hidden="true"
                >
                  {item.icon}
                </span>
                <div>
                  <h3 className="text-lg font-black text-[#2f261f]">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#574b3f]">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {data.faq && !data.medievalGuide ? (
        <section className="px-4 pb-12 md:px-6 md:pb-18" aria-labelledby="villages-faq-title">
          <div className="mx-auto max-w-[1180px] rounded-[34px] border border-[#8e6607]/15 bg-white p-6 shadow-xl shadow-black/5 md:p-10">
            <span className="text-xs font-black uppercase tracking-[0.16em] text-[#8e6607]">
              {data.faq.kicker}
            </span>
            <h2
              id="villages-faq-title"
              className="mt-4 text-3xl font-black leading-none tracking-[-0.05em] text-[#2f261f] md:text-5xl"
            >
              {data.faq.title}
            </h2>
            <div className="mt-6 grid gap-3">
              {data.faq.items.map((item, index) => (
                <details
                  className="group rounded-[22px] bg-[#fbf4e8] px-5 py-4 ring-1 ring-[#8e6607]/10"
                  key={item.question}
                  open={index === 0}
                >
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-base font-black leading-7 text-[#2f261f] md:text-lg [&::-webkit-details-marker]:hidden">
                    <h3 className="text-base font-black leading-7 md:text-lg">{item.question}</h3>
                    <span
                      className="mt-1 shrink-0 text-xl leading-none text-[#8e6607] transition group-open:rotate-45"
                      aria-hidden="true"
                    >
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-sm leading-7 text-[#5f5348] md:text-base md:leading-8">
                    {item.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="px-4 py-12 md:px-6 md:py-18" aria-labelledby="villages-stay-title">
        <div className="mx-auto max-w-[1180px]">
          <article className="relative overflow-hidden rounded-[36px] bg-[#2f261f] p-6 text-white shadow-2xl md:p-12">
            <Image
              src="/images/beaches/voulamandis-house-courtyard-chios.webp"
              alt=""
              fill
              sizes="(max-width: 767px) 100vw, 1180px"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-black/55" aria-hidden="true" />
            <div className="relative z-10 max-w-[760px]">
              <span className="text-xs font-black uppercase tracking-[0.16em] text-white/80">
                {data.stay.kicker}
              </span>
              <h2
                id="villages-stay-title"
                className="mt-4 text-3xl font-black leading-none tracking-[-0.05em] text-white md:text-5xl"
              >
                {data.stay.title}
              </h2>
              <p className="mt-5 text-base leading-8 text-white/90 md:text-lg">
                {data.stay.text}
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <a
                  className="inline-flex min-h-[54px] items-center justify-center rounded-full bg-white px-7 text-xs font-black uppercase tracking-[0.12em] text-[#2f261f] transition hover:-translate-y-1"
                  href={data.stay.primaryCta.href}
                >
                  {data.stay.primaryCta.label}
                </a>
                <a
                  className="inline-flex min-h-[54px] items-center justify-center rounded-full border border-white/35 px-7 text-xs font-black uppercase tracking-[0.12em] text-white transition hover:-translate-y-1 hover:bg-white/10"
                  href={data.stay.secondaryCta.href}
                >
                  {data.stay.secondaryCta.label}
                </a>
              </div>
            </div>
          </article>
        </div>
      </section>
        </>
      )}
    </main>
  );
}
