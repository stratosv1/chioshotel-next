import Image, { getImageProps } from "next/image";
import type { HomePageData } from "@/content/home";
import { HomeReviews } from "@/components/home/HomeReviews";
import { HomeGallery } from "@/components/home/HomeGallery";
import { LazyLastMinuteDeals } from "@/components/home/LazyLastMinuteDeals";
import { MobileStickyContact } from "@/components/home/MobileStickyContact";
import {
  homeGuideImages,
  homeRoomImages,
  homeTravelerImages,
} from "@/components/home/homeTailwindImages";

type HomePageTailwindProps = {
  data: HomePageData;
};

type LocaleCode = "en" | "el" | "fr" | "de" | "it" | "es" | "tr";

function HtmlText({ html }: { html: string }) {
  return <span dangerouslySetInnerHTML={{ __html: html }} />;
}

function HeroPicture({
  desktopSrc,
  mobileSrc,
  alt,
}: {
  desktopSrc: string;
  mobileSrc: string;
  alt: string;
}) {
  const common = {
    alt,
    sizes: "100vw",
    quality: 76,
  };
  const {
    props: { srcSet: mobileSrcSet },
  } = getImageProps({
    ...common,
    src: mobileSrc,
    width: 1024,
    height: 1536,
  });
  const {
    props: { srcSet: desktopSrcSet, ...desktopImageProps },
  } = getImageProps({
    ...common,
    src: desktopSrc,
    width: 1536,
    height: 1152,
  });

  return (
    <picture className="absolute inset-0 block">
      <source media="(max-width: 767px)" srcSet={mobileSrcSet} />
      <source media="(min-width: 768px)" srcSet={desktopSrcSet} />
      <img
        {...desktopImageProps}
        alt={alt}
        className="block h-full w-full object-cover object-center"
        decoding="async"
        fetchPriority="high"
        loading="eager"
      />
    </picture>
  );
}

function getLocale(canonicalPath: string): LocaleCode {
  const segment = canonicalPath.split("/").filter(Boolean)[0];

  if (segment === "el" || segment === "fr" || segment === "de" || segment === "it" || segment === "es" || segment === "tr") {
    return segment;
  }

  return "en";
}

const kambosExtraCopy: Record<LocaleCode, string> = {
  en: "Kambos is one of the most atmospheric areas of Chios: stone walls, citrus gardens, old mansions and quiet lanes create a setting that feels peaceful, local and close to the island’s real character. Staying here means you are only a short drive from Chios town, the airport and the beaches, but you return to a calmer place at the end of the day.",
  el: "Ο Κάμπος είναι μία από τις πιο ατμοσφαιρικές περιοχές της Χίου: πέτρινοι μαντρότοιχοι, περιβόλια με εσπεριδοειδή, παλιά αρχοντικά και ήσυχοι δρόμοι δημιουργούν ένα περιβάλλον γαλήνιο, τοπικό και αυθεντικό. Μένοντας εδώ βρίσκεστε κοντά στην πόλη, στο αεροδρόμιο και στις παραλίες, αλλά επιστρέφετε σε ένα πιο ήρεμο σημείο στο τέλος της ημέρας.",
  fr: "Kambos est l’un des quartiers les plus atmosphériques de Chios : murs de pierre, jardins d’agrumes, anciennes demeures et ruelles calmes créent un cadre paisible, local et authentique. Vous restez proche de la ville, de l’aéroport et des plages, tout en retrouvant un lieu plus calme en fin de journée.",
  de: "Kambos ist eine der stimmungsvollsten Gegenden von Chios: Steinmauern, Zitrusgärten, alte Herrenhäuser und ruhige Wege schaffen eine friedliche, lokale und authentische Umgebung. Sie wohnen nahe an Stadt, Flughafen und Stränden, kehren am Ende des Tages aber an einen ruhigeren Ort zurück.",
  it: "Kambos è una delle zone più suggestive di Chios: muri in pietra, agrumeti, antiche dimore e strade tranquille creano un ambiente sereno, locale e autentico. Siete vicini alla città, all’aeroporto e alle spiagge, ma alla fine della giornata tornate in un luogo più calmo.",
  es: "Kambos es una de las zonas con más encanto de Quíos: muros de piedra, jardines de cítricos, antiguas mansiones y caminos tranquilos crean un ambiente sereno, local y auténtico. Estás cerca de la ciudad, del aeropuerto y de las playas, pero al final del día vuelves a un lugar más tranquilo.",
  tr: "Kambos, Sakız’ın en atmosferik bölgelerinden biridir: taş duvarlar, narenciye bahçeleri, eski konaklar ve sakin yollar huzurlu, yerel ve otantik bir ortam yaratır. Şehre, havalimanına ve plajlara yakın kalırken gün sonunda daha sakin bir yere dönersiniz.",
};

function PremiumIcon({ children, compact = false }: { children: React.ReactNode; compact?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={
        compact
          ? "mr-2 inline-flex h-5 w-5 shrink-0 items-center justify-center text-sm text-stone-700 [filter:grayscale(1)]"
          : "mr-3 inline-flex h-9 w-9 translate-y-[-0.08em] items-center justify-center rounded-xl bg-amber-50 align-middle text-lg text-stone-700 ring-1 ring-amber-900/10 [filter:grayscale(1)]"
      }
    >
      {children}
    </span>
  );
}

function SectionTitle({
  kicker,
  icon,
  title,
  subtitle,
  centered = true,
}: {
  kicker: string;
  icon?: string;
  title: string;
  subtitle?: string;
  centered?: boolean;
}) {
  return (
    <header className={centered ? "mx-auto mb-6 max-w-3xl text-center md:mb-8" : "mb-5 max-w-3xl md:mb-7"}>
      <p className="mb-3 break-words text-xs font-black uppercase tracking-[0.20em] text-amber-700">
        {kicker}
      </p>
      <h2 className="text-balance break-words font-serif text-[1.875rem] font-bold leading-tight text-stone-900 md:text-[2.625rem]">
        {icon ? <PremiumIcon>{icon}</PremiumIcon> : null}
        {title}
      </h2>
      {subtitle ? (
        <p className="mt-3 text-sm leading-7 text-stone-600 md:mt-4 md:text-lg md:leading-8">{subtitle}</p>
      ) : null}
    </header>
  );
}

function PrimaryButton({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className="inline-flex min-h-12 items-center justify-center rounded-full bg-amber-700 px-6 text-sm font-black uppercase tracking-[0.08em] text-white shadow-lg shadow-amber-900/20 transition hover:bg-amber-800"
    >
      {children}
    </a>
  );
}

function SecondaryButton({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className="inline-flex min-h-12 items-center justify-center rounded-full border border-amber-800/20 bg-white px-6 text-sm font-black uppercase tracking-[0.08em] text-amber-800 shadow-sm transition hover:bg-amber-50"
    >
      {children}
    </a>
  );
}

function RoomsSection({ data }: { data: HomePageData }) {
  return (
    <section className="px-4 py-8 md:px-8 md:py-11">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
          <article className="rounded-[1.5rem] bg-[#2f241d] p-5 text-white shadow-lg shadow-stone-900/10 md:rounded-[2rem] md:p-9">
            <p className="mb-3 break-words text-xs font-black uppercase tracking-[0.20em] text-amber-200">{data.roomsPreview.kicker}</p>
            <h2 className="break-words font-serif text-[2rem] font-bold leading-tight md:text-[2.625rem]"><PremiumIcon>{data.roomsPreview.icon}</PremiumIcon>{data.roomsPreview.title}</h2>
            <p className="mt-4 text-sm leading-7 text-white/80 md:text-lg md:leading-8">{data.roomsPreview.text}</p>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <a href={data.roomsPreview.primaryCta.href} className="inline-flex min-h-12 min-w-0 items-center justify-center rounded-[1.1rem] bg-amber-700 px-3 text-center text-[11px] font-black uppercase leading-[1.15] tracking-[0.06em] text-white shadow-lg shadow-amber-900/20 transition hover:bg-amber-800 sm:rounded-full sm:px-6 sm:text-sm sm:tracking-[0.08em]"><PremiumIcon compact>{data.roomsPreview.primaryCta.icon}</PremiumIcon>{data.roomsPreview.primaryCta.label}</a>
              <a href={data.roomsPreview.secondaryCta.href} className="inline-flex min-h-12 min-w-0 items-center justify-center rounded-[1.1rem] border border-white/25 bg-white/10 px-3 text-center text-[11px] font-black uppercase leading-[1.15] tracking-[0.06em] text-white transition hover:bg-white/20 sm:rounded-full sm:px-6 sm:text-sm sm:tracking-[0.08em]"><PremiumIcon compact>{data.roomsPreview.secondaryCta.icon}</PremiumIcon>{data.roomsPreview.secondaryCta.label}</a>
            </div>
          </article>
          <article className="hidden rounded-[2rem] bg-white p-7 shadow-lg shadow-stone-900/5 ring-1 ring-amber-900/10 lg:block">
            <p className="break-words text-xs font-black uppercase tracking-[0.20em] text-amber-700">{data.roomsPreview.sideCard.kicker}</p>
            <h3 className="mt-3 break-words font-serif text-3xl font-bold text-stone-900">{data.roomsPreview.sideCard.title}</h3>
            <p className="mt-4 leading-8 text-stone-600">{data.roomsPreview.sideCard.text}</p>
          </article>
        </div>
        <div className="mt-5 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-5 pr-10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:grid md:grid-cols-2 md:overflow-visible md:pr-0 xl:grid-cols-4">
          {data.roomsPreview.rooms.map((room) => {
            const imageSrc = homeRoomImages[room.imageClass] || data.hero.image;
            return (
              <a key={room.id} href={room.href} className="group w-[84vw] max-w-[380px] flex-none snap-start overflow-hidden rounded-[1.5rem] bg-white shadow-lg shadow-stone-900/5 ring-1 ring-amber-900/10 transition hover:shadow-xl md:w-auto md:max-w-none md:rounded-[2rem]">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image src={imageSrc} alt={room.title} fill sizes="(max-width: 768px) 84vw, (max-width: 1280px) 50vw, 25vw" className="object-cover transition duration-500 group-hover:scale-105" loading="lazy" />
                  <div className="absolute left-3 top-3 rounded-full bg-emerald-700 px-3 py-1.5 text-xs font-black text-white">{room.liveBadge}</div>
                  <div className="absolute right-3 top-3 rounded-full bg-white/95 px-3 py-1.5 text-xs font-black text-emerald-700">{room.directBadge}</div>
                  <div className="absolute bottom-3 left-3 rounded-full bg-white/95 px-3 py-1.5 text-xs font-black text-stone-700">{room.bedBadge}</div>
                </div>
                <div className="p-5">
                  <h3 className="break-words font-serif text-2xl font-bold leading-tight text-amber-800">{room.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-stone-600">{room.description}</p>
                  <div className="mt-4 flex flex-wrap gap-2">{[...room.meta, ...room.amenities].map((item) => (<span key={item} className="rounded-full bg-amber-50 px-3 py-1.5 text-[11px] font-bold text-amber-800">{item}</span>))}</div>
                  <span className="mt-5 inline-flex rounded-full border border-amber-800/20 px-4 py-2 text-xs font-black uppercase text-amber-800">{room.cta}</span>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function KambosStory({ data }: { data: HomePageData }) {
  const locale = getLocale(data.seo.canonicalPath);
  const imageSrc = homeGuideImages["vh-link-image--kampos"] || data.hero.image;

  return (
    <section className="px-4 py-7 md:px-8 md:py-11">
      <article className="mx-auto grid max-w-7xl overflow-hidden rounded-[1.5rem] bg-white shadow-lg shadow-stone-900/5 ring-1 ring-amber-900/10 md:grid-cols-[0.95fr_1.05fr] md:rounded-[2rem]">
        <div className="relative min-h-[220px] md:min-h-[430px]">
          <Image src={imageSrc} alt={data.location.copy.title} fill sizes="(max-width: 768px) 100vw, 46vw" className="object-cover" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent md:hidden" />
        </div>
        <div className="p-5 md:p-9 lg:p-11">
          <p className="mb-3 break-words text-xs font-black uppercase tracking-[0.20em] text-amber-700">{data.location.copy.kicker}</p>
          <h2 className="break-words font-serif text-[2rem] font-bold leading-tight text-stone-900 md:text-[2.625rem]">{data.location.copy.title}</h2>
          <div className="mt-5 space-y-4 text-sm leading-7 text-stone-600 md:text-base md:leading-8">
            {data.location.copy.paragraphsHtml.map((paragraph) => (<p key={paragraph}><HtmlText html={paragraph} /></p>))}
            <p>{kambosExtraCopy[locale]}</p>
          </div>
        </div>
      </article>
    </section>
  );
}

function LocationAndDirect({ data }: { data: HomePageData }) {
  return (
    <section className="px-4 py-7 md:px-8 md:py-11">
      <div className="mx-auto max-w-7xl">
        <SectionTitle kicker={data.location.kicker} icon={data.location.icon} title={data.location.title} subtitle={data.location.subtitle} />
        <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
          <article className="overflow-hidden rounded-[1.5rem] bg-white shadow-lg shadow-stone-900/5 ring-1 ring-amber-900/10 md:rounded-[2rem]">
            <div className="relative min-h-[220px] md:min-h-[330px]">
              <Image src={data.location.map.previewImage} alt={data.location.title} fill sizes="(max-width: 1024px) 100vw, 52vw" className="object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />
              <a href={data.location.map.iframeSrc} className="absolute bottom-4 left-4 rounded-full bg-white px-5 py-3 text-sm font-black uppercase text-amber-800 shadow-lg">{data.location.map.buttonLabel}</a>
            </div>
            <div className="grid grid-cols-3 gap-2 p-3 sm:p-5">
              {data.location.distances.map((distance) => (
                <div key={distance.label} className="rounded-2xl bg-amber-50 p-3 text-center"><span className="block text-xs leading-4 text-stone-600 sm:text-sm">{distance.label}</span><strong className="mt-1 block text-base text-amber-800 sm:text-xl">{distance.value}</strong></div>
              ))}
            </div>
          </article>
          <article className="rounded-[1.5rem] bg-white p-5 shadow-lg shadow-stone-900/5 ring-1 ring-amber-900/10 md:rounded-[2rem] md:p-8">
            <p className="break-words text-xs font-black uppercase tracking-[0.20em] text-amber-700">{data.location.infoCard.kicker}</p>
            <h3 className="mt-3 break-words font-serif text-3xl font-bold text-amber-800">{data.location.infoCard.title}</h3>
            <address className="mt-4 not-italic text-sm leading-7 text-stone-600 md:text-base md:leading-8">
              {data.location.infoCard.addressLines[0]}<br />{data.location.infoCard.addressLines[1]}<br />{data.location.infoCard.phoneLabel}{" "}
              <a href={data.location.infoCard.phoneHref} className="font-bold text-amber-800">{data.location.infoCard.phone}</a><br />{data.location.infoCard.emailLabel}{" "}
              <a href={data.location.infoCard.emailHref} className="font-bold text-amber-800">{data.location.infoCard.email}</a>
            </address>
            <p className="mt-4 text-sm leading-7 text-stone-600 md:text-base md:leading-8">{data.location.infoCard.text}</p>
            <div className="mt-5"><PrimaryButton href={data.location.infoCard.cta.href}><PremiumIcon compact>{data.location.infoCard.cta.icon}</PremiumIcon>{data.location.infoCard.cta.label}</PrimaryButton></div>
          </article>
        </div>
      </div>
    </section>
  );
}

function DirectBookingBox({ data }: { data: HomePageData }) {
  const discountCode = data.location.discount.defaultCode || "WELCOME10";

  return (
    <section className="px-4 py-5 md:px-8 md:py-11">
      <article className="relative mx-auto mt-2 max-w-7xl overflow-hidden rounded-[1.75rem] border border-amber-900/10 bg-[#fff8ea] shadow-[0_14px_32px_rgba(68,64,60,.08)] md:mt-8 md:rounded-[2rem]">
        <div className="relative grid gap-0 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-center">
          <div className="px-4 pb-2 pt-4 md:p-8 lg:px-10">
            <span className="inline-flex rounded-full bg-white/85 px-3 py-2 text-[10px] font-black uppercase tracking-[0.14em] text-orange-800 shadow-sm ring-1 ring-amber-900/10 md:px-4 md:text-xs md:tracking-[0.16em]">{data.location.discount.badge}</span>
            <h3 className="mt-3 max-w-[18rem] break-words font-serif text-[1.85rem] font-bold leading-[1.05] text-stone-950 md:mt-4 md:text-[clamp(2rem,9vw,3rem)] lg:max-w-xl lg:text-5xl">{data.location.discount.title}</h3>
            <p className="mt-4 hidden max-w-2xl text-sm leading-7 text-stone-700 md:block md:text-lg md:leading-8">{data.location.discount.text}</p>
            <ul className="mt-4 grid min-w-0 grid-cols-1 gap-2 min-[360px]:grid-cols-2 lg:grid-cols-3">
              {data.location.discount.benefits.map((benefit, index) => (
                <li key={benefit} className={`flex min-w-0 items-center gap-2 rounded-2xl bg-white/90 px-3 py-2.5 text-[11px] font-black leading-[1.25] text-stone-800 shadow-sm ring-1 ring-amber-900/10 lg:rounded-full lg:text-[12px] ${index === 2 ? "min-[360px]:col-span-2 lg:col-span-1" : ""}`}><span className="shrink-0 text-amber-700" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span><span className="min-w-0 break-words">{benefit}</span></li>
              ))}
            </ul>
          </div>
          <div className="px-4 pb-4 pt-2 md:px-8 md:pb-8 lg:py-6 lg:pl-0 lg:pr-6">
            <div className="rounded-[1.25rem] bg-white p-4 text-center shadow-sm ring-1 ring-amber-900/10 lg:hidden">
              <p className="text-[11px] font-black uppercase tracking-[0.14em] text-stone-600">{data.location.discount.successText}</p>
              <code className="mt-2 block font-serif text-3xl font-black tracking-[0.08em] text-amber-800">{discountCode}</code>
            </div>
            <div className="hidden w-full rounded-[1.45rem] bg-gradient-to-br from-[#6f3f1d] to-[#a35b1e] p-3 text-white shadow-[0_10px_22px_rgba(68,64,60,.12)] lg:block lg:p-4">
              <div className="rounded-[1.25rem] border border-white/15 bg-white/10 p-3.5 backdrop-blur lg:p-4">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-amber-100">{data.location.discount.badge}</p>
                <p className="mt-3 break-words font-serif text-2xl font-bold leading-tight md:text-3xl">{data.location.discount.title}</p>
                <p className="mt-3 hidden text-sm leading-7 text-white/80 lg:block">{data.location.discount.formIntro}</p>
                <div className="mt-3 rounded-[1.2rem] bg-white p-4 text-center text-stone-900 shadow-[0_8px_18px_rgba(68,64,60,.12)]">
                  <p className="text-[11px] font-black uppercase tracking-[0.14em] text-stone-600">{data.location.discount.successText}</p>
                  <code className="mt-2 block font-serif text-3xl font-black tracking-[0.08em] text-amber-800">{discountCode}</code>
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>
    </section>
  );
}

export function HomePageTailwind({ data }: HomePageTailwindProps) {
  const introRightTitle = data.intro.right.title.replace("Six reasons", "6 reasons");
  const locale = getLocale(data.seo.canonicalPath);

  return (
    <>
      <main className="overflow-x-hidden bg-[#fffaf3] text-stone-900">
        <section
          id="home-hero"
          className="relative flex h-[calc(100svh-4.5rem)] min-h-[640px] max-h-[760px] items-end overflow-hidden bg-stone-950 text-white md:h-[clamp(680px,82svh,900px)] md:min-h-0 md:max-h-none"
          aria-label={data.hero.title}
        >
          <HeroPicture
            desktopSrc={data.hero.image}
            mobileSrc={data.hero.mobileImage}
            alt={data.hero.imageAlt}
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[linear-gradient(to_top,rgba(12,10,9,0.92)_0%,rgba(12,10,9,0.62)_18%,rgba(12,10,9,0.16)_38%,transparent_54%)] md:bg-[linear-gradient(to_top,rgba(12,10,9,0.72)_0%,rgba(12,10,9,0.32)_25%,rgba(12,10,9,0.06)_46%,transparent_64%)]"
          />
          <div className="relative z-10 mx-auto flex w-full max-w-7xl px-5 pb-6 pt-[44vh] sm:px-6 sm:pb-8 md:px-8 md:pb-14 md:pt-48">
            <div className="w-full max-w-3xl">
              <div className="mb-3 inline-flex items-center gap-2.5 rounded-full bg-white px-3 py-2 text-[13px] font-bold text-stone-800 shadow-lg sm:mb-4 sm:gap-3 sm:px-4 sm:text-sm" aria-label={`${data.hero.rating} - ${data.hero.reviews}`}>
                <span>{data.hero.rating}</span><span className="text-amber-400" aria-hidden="true">★★★★★</span><span className="text-stone-500">{data.hero.reviews}</span>
              </div>
              <p className="mb-2 break-words text-[11px] font-black uppercase tracking-[0.17em] text-white/85 sm:text-xs md:mb-3 md:tracking-[0.20em]">{data.hero.kicker}</p>
              <h1 className="max-w-[18ch] text-balance text-[2.15rem] font-black leading-[1.02] tracking-[-0.04em] sm:text-4xl md:max-w-none md:text-[clamp(2.75rem,4vw,4rem)]">{data.hero.title}</h1>
              <p className="mt-2.5 max-w-2xl text-[1.05rem] font-medium leading-6 text-white/90 sm:text-lg md:mt-3 md:text-2xl md:leading-8">{data.hero.tagline}</p>
              <div className="mt-4 grid max-w-xl grid-cols-2 gap-3 md:mt-6">
                <a href={data.hero.primaryCta.href} className="inline-flex min-h-14 items-center justify-center rounded-2xl bg-orange-700 px-3 py-3 text-center text-sm font-black uppercase leading-5 tracking-[0.06em] text-white shadow-lg shadow-orange-950/25 transition hover:bg-orange-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white md:rounded-full md:px-5"><span className="mr-2 text-lg text-white" aria-hidden="true">{data.hero.primaryCta.icon}</span>{data.hero.primaryCta.label}</a>
                <a href={data.hero.secondaryCta.href} className="inline-flex min-h-14 items-center justify-center rounded-2xl border border-white/45 bg-stone-950/20 px-3 py-3 text-center text-sm font-black uppercase leading-5 tracking-[0.06em] text-white transition hover:bg-stone-950/35 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white md:rounded-full md:px-5"><span className="mr-2 text-lg text-white" aria-hidden="true">{data.hero.secondaryCta.icon}</span>{data.hero.secondaryCta.label}</a>
              </div>
            </div>
          </div>
        </section>

        <a href={data.announceBar.href} className="relative z-20 mx-auto -mt-5 flex w-[min(1120px,92vw)] items-center justify-between gap-4 rounded-3xl bg-white px-5 py-4 text-stone-800 shadow-xl shadow-stone-900/10 ring-1 ring-amber-900/10 md:px-7">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-base text-stone-700 ring-1 ring-amber-900/10 [filter:grayscale(1)]" aria-hidden="true">{data.announceBar.icon}</span>
          <span className="flex-1 text-sm font-semibold md:text-base">{data.announceBar.text} <strong className="text-amber-800">{data.announceBar.strongText}</strong></span>
          <span className="text-amber-700" aria-hidden="true">→</span>
        </a>

        <section className="px-4 py-5 md:px-8 md:py-11">
          <div className="mx-auto grid max-w-7xl gap-4 lg:grid-cols-[1fr_1.05fr]">
            <article className="order-1 rounded-[1.5rem] bg-white p-4 shadow-lg shadow-stone-900/5 ring-1 ring-amber-900/10 md:rounded-[2rem] md:p-8">
              <p className="mb-2 break-words text-[11px] font-black uppercase leading-5 tracking-[0.17em] text-amber-700 md:mb-3 md:text-xs md:tracking-[0.20em]">{data.intro.left.kicker}</p>
              <h2 className="break-words font-serif text-[1.7rem] font-bold leading-[1.08] text-stone-900 md:text-[2.625rem] md:leading-tight"><PremiumIcon>{data.intro.left.icon}</PremiumIcon>{data.intro.left.title}</h2>
              <p className="mt-3 text-[13px] leading-6 text-stone-600 md:mt-4 md:text-base md:leading-8"><HtmlText html={data.intro.left.bodyHtml} /></p>
              <div className="mt-4 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap md:mt-5">
                {data.intro.left.pills.map((pill) => (<span key={pill} className="inline-flex min-h-9 items-center justify-center rounded-full bg-amber-50 px-2.5 py-2 text-center text-[11px] font-bold leading-tight text-amber-800 ring-1 ring-amber-900/10 sm:min-h-0 sm:px-4 sm:text-sm">{pill}</span>))}
              </div>
            </article>
            <HomeGallery locale={locale} />
            <article className="order-3 rounded-[1.5rem] bg-white p-5 shadow-lg shadow-stone-900/5 ring-1 ring-amber-900/10 md:rounded-[2rem] md:p-8 lg:order-2">
              <p className="mb-3 break-words text-xs font-black uppercase tracking-[0.20em] text-amber-700">{data.intro.right.kicker}</p>
              <h3 className="break-words font-serif text-[2rem] font-bold leading-tight text-stone-900 md:text-[2.625rem]">{introRightTitle}</h3>
              <div className="mt-5 grid grid-cols-2 gap-2 md:grid-cols-3 md:gap-3">
                {data.intro.right.cards.map((card, index) => (
                  <div key={card.title} className={index === 0 ? "col-span-2 rounded-2xl bg-[#2f241d] p-4 text-white md:col-span-1" : "rounded-2xl bg-amber-50 p-3 ring-1 ring-amber-900/10"}>
                    <strong className="block text-sm leading-5">{card.title}</strong>
                    <span className={index === 0 ? "mt-2 block text-xs leading-5 text-white/78" : "mt-2 block text-xs leading-5 text-stone-600"}>{card.text}</span>
                  </div>
                ))}
              </div>
            </article>
          </div>
        </section>

        <RoomsSection data={data} />
        <LazyLastMinuteDeals data={data.lastMinute} canonicalPath={data.seo.canonicalPath} />
        <DirectBookingBox data={data} />
        <KambosStory data={data} />
        <LocationAndDirect data={data} />

        <section className="px-4 py-7 md:px-8 md:py-11"><div className="mx-auto max-w-5xl rounded-[1.5rem] bg-white p-6 text-center shadow-lg shadow-stone-900/5 ring-1 ring-amber-900/10 md:rounded-[2rem] md:p-10"><SectionTitle kicker={data.reviews.kicker} icon={data.reviews.icon} title={data.reviews.title} /><HomeReviews loaderUrl={data.reviews.trustindexLoaderUrl} /></div></section>

        <section className="px-4 py-7 md:px-8 md:py-11"><div className="mx-auto max-w-7xl"><SectionTitle kicker={data.amenities.kicker} icon={data.amenities.icon} title={data.amenities.title} /><div className="grid grid-cols-3 gap-2 sm:grid-cols-3 lg:grid-cols-4">{data.amenities.items.map((item) => (<div key={item.label} className="flex min-h-[108px] flex-col items-center justify-center gap-2 rounded-2xl bg-white p-3 text-center shadow-sm ring-1 ring-amber-900/10"><span aria-hidden="true" className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-base text-stone-700 ring-1 ring-amber-900/10 [filter:grayscale(1)]">{item.icon}</span><span className="text-[12px] font-black leading-4 text-stone-700 sm:text-sm">{item.label}</span></div>))}</div></div></section>

        <section className="px-4 py-7 md:px-8 md:py-11"><div className="mx-auto max-w-7xl"><SectionTitle kicker={data.traveler.kicker} icon={data.traveler.icon} title={data.traveler.title} subtitle={data.traveler.subtitle} /><div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-5 pr-10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:grid md:grid-cols-2 md:overflow-visible md:pr-0 xl:grid-cols-4">{data.traveler.cards.map((card) => { const imageSrc = homeTravelerImages[card.className] || data.hero.image; return (<a key={card.id} href={card.href} className="group relative min-h-[320px] w-[84vw] max-w-[380px] flex-none snap-start overflow-hidden rounded-[1.5rem] bg-stone-950 text-white shadow-xl shadow-stone-900/10 md:w-auto md:max-w-none md:rounded-[2rem]"><Image src={imageSrc} alt={card.title} fill sizes="(max-width: 768px) 84vw, 25vw" className="object-cover transition duration-500 group-hover:scale-105" loading="lazy" /><div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/55 to-black/10" /><div className="absolute inset-x-0 bottom-0 p-6 text-white"><h3 className="break-words font-serif text-3xl font-bold text-white drop-shadow-[0_3px_12px_rgba(0,0,0,.7)]">{card.title}</h3><p className="mt-3 text-sm leading-7 text-white/80">{card.text}</p><span className="mt-5 inline-flex rounded-full bg-white px-4 py-2 text-xs font-black uppercase text-amber-800">{card.cta}</span></div></a>); })}</div></div></section>

        <section className="px-4 py-7 md:px-8 md:py-11"><div className="mx-auto max-w-7xl"><SectionTitle kicker={data.chiosGuide.kicker} icon={data.chiosGuide.icon} title={data.chiosGuide.title} subtitle={data.chiosGuide.subtitle} /><div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-5 pr-10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:grid md:grid-cols-2 md:overflow-visible md:pr-0 xl:grid-cols-3">{data.chiosGuide.cards.map((card) => { const imageSrc = homeGuideImages[card.imageClass] || data.hero.image; return (<a key={card.id} href={card.href} className="group w-[84vw] max-w-[380px] flex-none snap-start overflow-hidden rounded-[1.5rem] bg-white shadow-lg shadow-stone-900/5 ring-1 ring-amber-900/10 transition hover:shadow-xl md:w-auto md:max-w-none md:rounded-[2rem]"><div className="relative aspect-[16/10] overflow-hidden"><Image src={imageSrc} alt={card.title} fill sizes="(max-width: 768px) 84vw, 33vw" className="object-cover transition duration-500 group-hover:scale-105" loading="lazy" /></div><div className="p-5"><h3 className="break-words font-serif text-2xl font-bold text-stone-900">{card.title}</h3><p className="mt-3 text-sm leading-7 text-stone-600 md:text-base">{card.text}</p><span className="mt-5 inline-flex rounded-full border border-amber-800/20 px-4 py-2 text-xs font-black uppercase text-amber-800"><PremiumIcon compact>{card.ctaIcon}</PremiumIcon>{card.ctaLabel}</span></div></a>); })}</div></div></section>

        <section className="px-4 py-6 md:px-8 md:py-9"><div className="mx-auto grid max-w-7xl gap-5 rounded-[1.5rem] bg-[#2f241d] p-6 text-white md:grid-cols-[1fr_auto] md:items-center md:rounded-[2rem] md:p-8"><div><p className="break-words text-xs font-black uppercase tracking-[0.20em] text-amber-200">{data.quizBar.label}</p><p className="mt-2 max-w-3xl text-base leading-7 text-white/85 md:text-lg md:leading-8">{data.quizBar.text}</p></div><a href={data.quizBar.href} className="inline-flex w-full max-w-full items-center justify-center rounded-full bg-white px-6 py-3 text-center text-sm font-black uppercase tracking-[0.06em] text-amber-800 shadow-lg transition hover:bg-amber-50 sm:w-auto sm:min-w-[300px]" aria-label={data.quizBar.cta}>{data.quizBar.cta}</a></div></section>

        <section className="px-4 py-7 md:px-8 md:py-11"><div className="mx-auto max-w-5xl"><SectionTitle kicker={data.faq.kicker} icon={data.faq.icon} title={data.faq.title} /><div className="grid gap-3">{data.faq.items.map((item) => (<details key={item.question} className="group rounded-3xl bg-white p-5 shadow-sm ring-1 ring-amber-900/10"><summary className="cursor-pointer list-none font-bold text-stone-900">{item.question}</summary><div className="mt-4 leading-8 text-stone-600"><HtmlText html={item.answerHtml} /></div></details>))}</div></div></section>

        <section className="px-4 pb-16 pt-4 md:px-8 md:pb-20"><div className="relative mx-auto min-h-[430px] max-w-7xl overflow-hidden rounded-[1.8rem] bg-stone-950 text-white shadow-2xl shadow-stone-900/20 md:min-h-0 md:rounded-[2.5rem]"><Image src="/images/site/Screenshot_2026-04-25-14-11-19-166_com.instagram.android-edit-1.webp" alt="" fill sizes="(max-width: 768px) 100vw, 1280px" className="scale-[1.06] object-cover object-[52%_30%] opacity-100 md:scale-100 md:object-center" loading="lazy" aria-hidden="true" /><div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,.58),rgba(0,0,0,.74))] md:bg-gradient-to-r md:from-black/55 md:via-black/30 md:to-black/5" /><div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.12),transparent_36%)] opacity-[.55]" /><div className="relative z-10 max-w-[92%] p-6 md:max-w-3xl md:p-14"><p className="mb-3 break-words text-xs font-black uppercase tracking-[0.22em] text-amber-200">{data.finalCta.kicker}</p><h2 className="break-words font-serif text-4xl font-bold leading-tight md:text-6xl"><PremiumIcon>{data.finalCta.icon}</PremiumIcon>{data.finalCta.title}</h2><p className="mt-5 max-w-2xl text-lg leading-8 text-white/85">{data.finalCta.text}</p><div className="mt-8 grid grid-cols-2 gap-3"><a href={data.finalCta.primaryCta.href} className="inline-flex min-h-[50px] min-w-0 items-center justify-center rounded-[1.1rem] bg-amber-700 px-3 text-center text-[11px] font-black uppercase leading-[1.15] tracking-[0.05em] text-white shadow-lg shadow-amber-900/20 transition hover:bg-amber-800 sm:rounded-full sm:px-6 sm:text-sm sm:tracking-[0.08em]"><PremiumIcon compact>{data.finalCta.primaryCta.icon}</PremiumIcon>{data.finalCta.primaryCta.label}</a><a href={data.finalCta.secondaryCta.href} className="inline-flex min-h-[50px] min-w-0 items-center justify-center rounded-[1.1rem] border border-white/25 bg-white/10 px-3 text-center text-[11px] font-black uppercase leading-[1.15] tracking-[0.05em] text-white backdrop-blur transition hover:bg-white/20 sm:rounded-full sm:px-6 sm:text-sm sm:tracking-[0.08em]"><PremiumIcon compact>{data.finalCta.secondaryCta.icon}</PremiumIcon>{data.finalCta.secondaryCta.label}</a></div></div></div></section>
      </main>

      <MobileStickyContact call={data.mobileSticky.call} chat={data.mobileSticky.viber} />
    </>
  );
}
