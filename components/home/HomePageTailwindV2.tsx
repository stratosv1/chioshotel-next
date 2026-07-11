import Image from "next/image";
import type { ReactNode } from "react";
import type { HomePageData } from "@/content/home";
import { DiscountReveal } from "@/components/home/DiscountReveal";
import { HomeReviews } from "@/components/home/HomeReviews";
import { LazyLastMinuteDeals } from "@/components/home/LazyLastMinuteDeals";
import {
  homeGuideImages,
  homeRoomImages,
  homeTravelerImages,
} from "@/components/home/homeTailwindImages";

type HomePageTailwindV2Props = {
  data: HomePageData;
};

type LocaleCode = "en" | "el" | "fr" | "de" | "it" | "es" | "tr";

function HtmlText({ html }: { html: string }) {
  return <span dangerouslySetInnerHTML={{ __html: html }} />;
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

function PageShell({ children }: { children: ReactNode }) {
  return (
    <main className="overflow-x-hidden bg-[#f8f1e8] text-[#2f261f]">
      {children}
    </main>
  );
}

function Section({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <section className={`px-4 py-9 md:px-8 md:py-16 ${className}`}>
      <div className="mx-auto max-w-7xl">{children}</div>
    </section>
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
    <header className={centered ? "mx-auto mb-7 max-w-3xl text-center md:mb-10" : "mb-7 max-w-3xl"}>
      <p className="mb-3 text-[11px] font-black uppercase tracking-[0.22em] text-[#8b5e34]">
        {kicker}
      </p>
      <h2 className="text-balance font-serif text-[2rem] font-bold leading-[1.04] tracking-[-0.035em] text-[#241d18] md:text-5xl">
        {icon ? <span className="mr-2" aria-hidden="true">{icon}</span> : null}
        {title}
      </h2>
      {subtitle ? (
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#6f6257] md:text-lg md:leading-8">
          {subtitle}
        </p>
      ) : null}
    </header>
  );
}

function PrimaryButton({ href, children, dark = false }: { href: string; children: ReactNode; dark?: boolean }) {
  return (
    <a
      href={href}
      className={dark
        ? "inline-flex min-h-12 items-center justify-center rounded-full bg-[#2f261f] px-6 text-center text-xs font-black uppercase tracking-[0.08em] text-white shadow-lg shadow-stone-900/20 transition hover:-translate-y-0.5 hover:bg-[#4b3728] md:text-sm"
        : "inline-flex min-h-12 items-center justify-center rounded-full bg-[#8b5e34] px-6 text-center text-xs font-black uppercase tracking-[0.08em] text-white shadow-lg shadow-amber-900/20 transition hover:-translate-y-0.5 hover:bg-[#6f4828] md:text-sm"
      }
    >
      {children}
    </a>
  );
}

function SecondaryButton({ href, children, light = false }: { href: string; children: ReactNode; light?: boolean }) {
  return (
    <a
      href={href}
      className={light
        ? "inline-flex min-h-12 items-center justify-center rounded-full border border-white/25 bg-white/10 px-6 text-center text-xs font-black uppercase tracking-[0.08em] text-white backdrop-blur transition hover:bg-white/20 md:text-sm"
        : "inline-flex min-h-12 items-center justify-center rounded-full border border-[#8b5e34]/20 bg-white px-6 text-center text-xs font-black uppercase tracking-[0.08em] text-[#8b5e34] shadow-sm transition hover:bg-[#fff7ed] md:text-sm"
      }
    >
      {children}
    </a>
  );
}

function MobileSwipeHint() {
  return (
    <div className="mb-3 flex items-center justify-end md:hidden" aria-hidden="true">
      <span className="inline-flex h-10 items-center gap-2 rounded-full bg-white px-4 text-xs font-black uppercase tracking-[0.12em] text-[#8b5e34] shadow-sm ring-1 ring-amber-900/10">
        Swipe <span className="text-lg leading-none">→</span>
      </span>
    </div>
  );
}

function Hero({ data }: { data: HomePageData }) {
  return (
    <section className="relative min-h-[720px] overflow-hidden bg-[#1f1712] text-white md:min-h-[86vh]" aria-label={data.hero.title}>
      <Image
        src={data.hero.image}
        alt={data.hero.imageAlt}
        fill
        priority
        fetchPriority="high"
        sizes="100vw"
        quality={68}
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-black/20" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-black/5 md:bg-gradient-to-r md:from-black/80 md:via-black/42 md:to-transparent" />

      <div className="relative z-10 mx-auto flex min-h-[720px] max-w-7xl items-end px-4 pb-10 pt-28 md:min-h-[86vh] md:px-8 md:pb-16">
        <div className="w-full max-w-2xl">
          <div className="mb-5 inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/95 px-4 py-2 text-sm font-extrabold text-[#2f261f] shadow-xl shadow-black/20">
            <span>{data.hero.rating}</span>
            <span className="text-amber-500" aria-hidden="true">★★★★★</span>
            <span className="text-[#6f6257]">{data.hero.reviews}</span>
          </div>

          <div className="rounded-[2rem] border border-white/15 bg-black/38 p-5 shadow-2xl shadow-black/30 backdrop-blur-md md:p-8 lg:bg-black/28">
            <p className="mb-3 text-xs font-black uppercase tracking-[0.22em] text-white/85">
              {data.hero.kicker}
            </p>
            <h1 className="text-balance text-[2.75rem] font-black leading-[0.92] tracking-[-0.055em] text-white md:text-7xl">
              {data.hero.title}
            </h1>
            <p className="mt-5 max-w-xl text-base leading-8 text-white/90 md:text-lg md:leading-9">
              <HtmlText html={data.hero.descriptionHtml} />
            </p>
            <div className="mt-7 grid grid-cols-2 gap-3 sm:flex sm:flex-wrap">
              <PrimaryButton href={data.hero.primaryCta.href}>
                <span className="mr-2" aria-hidden="true">{data.hero.primaryCta.icon}</span>
                {data.hero.primaryCta.label}
              </PrimaryButton>
              <SecondaryButton href={data.hero.secondaryCta.href} light>
                <span className="mr-2" aria-hidden="true">{data.hero.secondaryCta.icon}</span>
                {data.hero.secondaryCta.label}
              </SecondaryButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function AnnounceBar({ data }: { data: HomePageData }) {
  return (
    <a
      href={data.announceBar.href}
      className="relative z-20 mx-auto -mt-6 flex w-[min(1120px,92vw)] items-center gap-4 rounded-[1.35rem] border border-amber-900/10 bg-white px-4 py-4 text-[#2f261f] shadow-2xl shadow-stone-900/10 transition hover:-translate-y-0.5 md:rounded-[2rem] md:px-7"
    >
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#fff3df] text-2xl" aria-hidden="true">
        {data.announceBar.icon}
      </span>
      <span className="flex-1 text-sm font-bold leading-6 md:text-base">
        {data.announceBar.text} <strong className="text-[#8b5e34]">{data.announceBar.strongText}</strong>
      </span>
      <span className="text-xl text-[#8b5e34]" aria-hidden="true">→</span>
    </a>
  );
}

function IntroSection({ data }: { data: HomePageData }) {
  const introRightTitle = data.intro.right.title.replace("Six reasons", "6 reasons");

  return (
    <Section className="pt-8 md:pt-14">
      <div className="grid gap-4 lg:grid-cols-[0.92fr_1.08fr]">
        <article className="rounded-[2rem] border border-amber-900/10 bg-white p-5 shadow-xl shadow-stone-900/5 md:p-8">
          <p className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-[#8b5e34]">{data.intro.left.kicker}</p>
          <h2 className="font-serif text-[2rem] font-bold leading-tight tracking-[-0.035em] text-[#241d18] md:text-5xl">
            <span className="mr-2" aria-hidden="true">{data.intro.left.icon}</span>
            {data.intro.left.title}
          </h2>
          <p className="mt-4 text-sm leading-7 text-[#6f6257] md:text-base md:leading-8">
            <HtmlText html={data.intro.left.bodyHtml} />
          </p>
          <div className="mt-5 flex snap-x snap-mandatory gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:flex-wrap sm:overflow-visible sm:pb-0">
            {data.intro.left.pills.map((pill) => (
              <span key={pill} className="inline-flex min-h-10 shrink-0 snap-start items-center justify-center rounded-full bg-[#fff3df] px-4 text-center text-xs font-black leading-tight text-[#8b5e34] ring-1 ring-amber-900/10 sm:text-sm">
                {pill}
              </span>
            ))}
          </div>
        </article>

        <article className="rounded-[2rem] border border-amber-900/10 bg-[#2f261f] p-5 text-white shadow-xl shadow-stone-900/10 md:p-8">
          <p className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-amber-200">{data.intro.right.kicker}</p>
          <h3 className="font-serif text-[2rem] font-bold leading-tight tracking-[-0.035em] text-white md:text-5xl">
            {introRightTitle}
          </h3>
          <div className="mt-5 grid grid-cols-2 gap-2 md:grid-cols-3 md:gap-3">
            {data.intro.right.cards.map((card, index) => (
              <div key={card.title} className={index === 0 ? "col-span-2 rounded-3xl bg-white p-4 text-[#2f261f] md:col-span-1" : "rounded-3xl border border-white/10 bg-white/10 p-3"}>
                <strong className="block text-sm font-black leading-5">{card.title}</strong>
                <span className={index === 0 ? "mt-2 block text-xs leading-5 text-[#6f6257]" : "mt-2 block text-xs leading-5 text-white/75"}>
                  {card.text}
                </span>
              </div>
            ))}
          </div>
        </article>
      </div>
    </Section>
  );
}

function RoomsSection({ data }: { data: HomePageData }) {
  return (
    <Section>
      <div className="grid gap-4 lg:grid-cols-[0.88fr_1.12fr] lg:items-end">
        <article className="rounded-[2rem] bg-[#2f261f] p-5 text-white shadow-xl shadow-stone-900/10 md:p-9">
          <p className="mb-3 text-xs font-black uppercase tracking-[0.20em] text-amber-200">{data.roomsPreview.kicker}</p>
          <h2 className="font-serif text-[2rem] font-bold leading-tight tracking-[-0.035em] md:text-5xl">
            <span className="mr-2" aria-hidden="true">{data.roomsPreview.icon}</span>
            {data.roomsPreview.title}
          </h2>
          <p className="mt-4 text-sm leading-7 text-white/78 md:text-lg md:leading-8">{data.roomsPreview.text}</p>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:flex sm:flex-wrap">
            <PrimaryButton href={data.roomsPreview.primaryCta.href}>
              <span className="mr-2" aria-hidden="true">{data.roomsPreview.primaryCta.icon}</span>
              {data.roomsPreview.primaryCta.label}
            </PrimaryButton>
            <SecondaryButton href={data.roomsPreview.secondaryCta.href} light>
              <span className="mr-2" aria-hidden="true">{data.roomsPreview.secondaryCta.icon}</span>
              {data.roomsPreview.secondaryCta.label}
            </SecondaryButton>
          </div>
        </article>

        <article className="hidden rounded-[2rem] border border-amber-900/10 bg-white p-7 shadow-xl shadow-stone-900/5 lg:block">
          <p className="text-xs font-black uppercase tracking-[0.20em] text-[#8b5e34]">{data.roomsPreview.sideCard.kicker}</p>
          <h3 className="mt-3 font-serif text-3xl font-bold tracking-[-0.03em] text-[#241d18]">{data.roomsPreview.sideCard.title}</h3>
          <p className="mt-4 leading-8 text-[#6f6257]">{data.roomsPreview.sideCard.text}</p>
        </article>
      </div>

      <div className="mt-5">
        <MobileSwipeHint />
        <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-5 pr-12 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:grid md:grid-cols-2 md:overflow-visible md:pr-0 xl:grid-cols-4">
          {data.roomsPreview.rooms.map((room) => {
            const imageSrc = homeRoomImages[room.imageClass] || data.hero.image;

            return (
              <a key={room.id} href={room.href} className="group w-[84vw] max-w-[390px] flex-none snap-start overflow-hidden rounded-[1.6rem] border border-amber-900/10 bg-white shadow-xl shadow-stone-900/5 transition hover:-translate-y-1 hover:shadow-2xl md:w-auto md:max-w-none md:rounded-[2rem]">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image src={imageSrc} alt={room.title} fill sizes="(max-width: 768px) 84vw, (max-width: 1280px) 50vw, 25vw" className="object-cover transition duration-500 group-hover:scale-105" loading="lazy" />
                  <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/65 to-transparent" />
                  <div className="absolute left-3 top-3 rounded-full bg-[#3f4f2f] px-3 py-1.5 text-xs font-black text-white">{room.liveBadge}</div>
                  <div className="absolute right-3 top-3 rounded-full bg-white/95 px-3 py-1.5 text-xs font-black text-[#3f4f2f]">{room.directBadge}</div>
                  <div className="absolute bottom-3 left-3 rounded-full bg-white/95 px-3 py-1.5 text-xs font-black text-[#2f261f]">{room.bedBadge}</div>
                </div>
                <div className="p-5">
                  <h3 className="font-serif text-2xl font-bold leading-tight tracking-[-0.03em] text-[#8b5e34]">{room.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-[#6f6257]">{room.description}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {[...room.meta, ...room.amenities].map((item) => (
                      <span key={item} className="rounded-full bg-[#fff3df] px-3 py-1.5 text-[11px] font-bold text-[#8b5e34]">{item}</span>
                    ))}
                  </div>
                  <span className="mt-5 inline-flex rounded-full border border-[#8b5e34]/20 px-4 py-2 text-xs font-black uppercase tracking-[0.08em] text-[#8b5e34]">
                    {room.cta}
                  </span>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </Section>
  );
}

function DirectBookingBox({ data }: { data: HomePageData }) {
  return (
    <Section>
      <article className="relative overflow-hidden rounded-[2rem] border border-amber-900/10 bg-[#fff7e8] shadow-2xl shadow-amber-900/10 md:rounded-[2.5rem]">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-200/35 via-transparent to-white/30" />
        <div className="relative grid gap-0 lg:grid-cols-[1fr_0.85fr]">
          <div className="p-5 md:p-9 lg:p-11">
            <span className="inline-flex rounded-full bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-[#8b5e34] shadow-sm ring-1 ring-amber-900/10">
              {data.location.discount.badge}
            </span>
            <h3 className="mt-5 max-w-2xl font-serif text-[2rem] font-bold leading-tight tracking-[-0.035em] text-[#241d18] md:text-5xl">
              {data.location.discount.title}
            </h3>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#6f6257] md:text-lg md:leading-8">{data.location.discount.text}</p>
            <ul className="mt-6 grid gap-2 sm:grid-cols-3">
              {data.location.discount.benefits.map((benefit, index) => (
                <li key={benefit} className="rounded-2xl bg-white/92 p-3 text-sm font-black leading-6 text-[#2f261f] shadow-sm ring-1 ring-amber-900/10">
                  <span className="mr-2 text-[#8b5e34]" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                  {benefit}
                </li>
              ))}
            </ul>
          </div>

          <div className="p-5 pt-0 lg:p-6 lg:pl-0">
            <div className="h-full rounded-[1.6rem] bg-[#2f261f] p-4 text-white shadow-2xl shadow-stone-900/20 md:rounded-[2rem] md:p-6">
              <div className="h-full rounded-[1.35rem] border border-white/15 bg-white/10 p-4 backdrop-blur md:p-5">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-amber-100">{data.location.discount.badge}</p>
                <p className="mt-3 font-serif text-2xl font-bold leading-tight md:text-3xl">{data.location.discount.title}</p>
                <p className="mt-3 text-sm leading-7 text-white/78">{data.location.discount.formIntro}</p>
                <div className="mt-5 rounded-[1.2rem] bg-white p-4 text-[#2f261f] shadow-xl shadow-black/20">
                  <DiscountReveal submitLabel={data.location.discount.submitLabel} successText={data.location.discount.successText} code={data.location.discount.defaultCode || "WELCOME10"} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>
    </Section>
  );
}

function KambosStory({ data }: { data: HomePageData }) {
  const locale = getLocale(data.seo.canonicalPath);
  const imageSrc = homeGuideImages["vh-link-image--kampos"] || data.hero.image;

  return (
    <Section>
      <article className="grid overflow-hidden rounded-[2rem] border border-amber-900/10 bg-white shadow-xl shadow-stone-900/5 md:grid-cols-[0.95fr_1.05fr] md:rounded-[2.5rem]">
        <div className="relative min-h-[250px] md:min-h-[460px]">
          <Image src={imageSrc} alt={data.location.copy.title} fill sizes="(max-width: 768px) 100vw, 46vw" className="object-cover" loading="lazy" />
        </div>
        <div className="p-5 md:p-9 lg:p-11">
          <p className="mb-3 text-xs font-black uppercase tracking-[0.20em] text-[#8b5e34]">{data.location.copy.kicker}</p>
          <h2 className="font-serif text-[2rem] font-bold leading-tight tracking-[-0.035em] text-[#241d18] md:text-5xl">{data.location.copy.title}</h2>
          <div className="mt-5 space-y-4 text-sm leading-7 text-[#6f6257] md:text-base md:leading-8">
            {data.location.copy.paragraphsHtml.map((paragraph) => (
              <p key={paragraph}><HtmlText html={paragraph} /></p>
            ))}
            <p>{kambosExtraCopy[locale]}</p>
          </div>
        </div>
      </article>
    </Section>
  );
}

function LocationAndDirect({ data }: { data: HomePageData }) {
  return (
    <Section>
      <SectionTitle kicker={data.location.kicker} icon={data.location.icon} title={data.location.title} subtitle={data.location.subtitle} />
      <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
        <article className="overflow-hidden rounded-[2rem] border border-amber-900/10 bg-white shadow-xl shadow-stone-900/5">
          <div className="relative min-h-[240px] md:min-h-[350px]">
            <Image src={data.location.map.previewImage} alt={data.location.title} fill sizes="(max-width: 1024px) 100vw, 52vw" className="object-cover" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <a href={data.location.map.iframeSrc} className="absolute bottom-4 left-4 rounded-full bg-white px-5 py-3 text-sm font-black uppercase tracking-[0.08em] text-[#8b5e34] shadow-lg">
              {data.location.map.buttonLabel}
            </a>
          </div>
          <div className="grid grid-cols-3 gap-2 p-3 sm:p-5">
            {data.location.distances.map((distance) => (
              <div key={distance.label} className="rounded-2xl bg-[#fff3df] p-3 text-center">
                <span className="block text-xs leading-4 text-[#6f6257] sm:text-sm">{distance.label}</span>
                <strong className="mt-1 block text-base text-[#8b5e34] sm:text-xl">{distance.value}</strong>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-[2rem] border border-amber-900/10 bg-white p-5 shadow-xl shadow-stone-900/5 md:p-8">
          <p className="text-xs font-black uppercase tracking-[0.20em] text-[#8b5e34]">{data.location.infoCard.kicker}</p>
          <h3 className="mt-3 font-serif text-3xl font-bold tracking-[-0.03em] text-[#8b5e34]">{data.location.infoCard.title}</h3>
          <address className="mt-4 not-italic text-sm leading-7 text-[#6f6257] md:text-base md:leading-8">
            {data.location.infoCard.addressLines[0]}<br />
            {data.location.infoCard.addressLines[1]}<br />
            {data.location.infoCard.phoneLabel}{" "}
            <a href={data.location.infoCard.phoneHref} className="font-bold text-[#8b5e34]">{data.location.infoCard.phone}</a><br />
            {data.location.infoCard.emailLabel}{" "}
            <a href={data.location.infoCard.emailHref} className="font-bold text-[#8b5e34]">{data.location.infoCard.email}</a>
          </address>
          <p className="mt-4 text-sm leading-7 text-[#6f6257] md:text-base md:leading-8">{data.location.infoCard.text}</p>
          <div className="mt-6">
            <PrimaryButton href={data.location.infoCard.cta.href}>
              <span className="mr-2" aria-hidden="true">{data.location.infoCard.cta.icon}</span>
              {data.location.infoCard.cta.label}
            </PrimaryButton>
          </div>
        </article>
      </div>
    </Section>
  );
}

function ReviewsSection({ data }: { data: HomePageData }) {
  return (
    <Section>
      <div className="mx-auto max-w-5xl rounded-[2rem] border border-amber-900/10 bg-white p-6 text-center shadow-xl shadow-stone-900/5 md:p-10">
        <SectionTitle kicker={data.reviews.kicker} icon={data.reviews.icon} title={data.reviews.title} />
        <HomeReviews loaderUrl={data.reviews.trustindexLoaderUrl} />
      </div>
    </Section>
  );
}

function AmenitiesSection({ data }: { data: HomePageData }) {
  return (
    <Section>
      <SectionTitle kicker={data.amenities.kicker} icon={data.amenities.icon} title={data.amenities.title} />
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-3 lg:grid-cols-4 lg:gap-3">
        {data.amenities.items.map((item) => (
          <div key={item.label} className="flex min-h-[108px] flex-col items-center justify-center gap-2 rounded-2xl border border-amber-900/10 bg-white p-3 text-center shadow-sm">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#fff3df] text-lg">{item.icon}</span>
            <span className="text-[12px] font-black leading-4 text-[#4b4037] sm:text-sm">{item.label}</span>
          </div>
        ))}
      </div>
    </Section>
  );
}

function TravelerSection({ data }: { data: HomePageData }) {
  return (
    <Section>
      <SectionTitle kicker={data.traveler.kicker} icon={data.traveler.icon} title={data.traveler.title} subtitle={data.traveler.subtitle} />
      <MobileSwipeHint />
      <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-5 pr-12 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:grid md:grid-cols-2 md:overflow-visible md:pr-0 xl:grid-cols-4">
        {data.traveler.cards.map((card) => {
          const imageSrc = homeTravelerImages[card.className] || data.hero.image;

          return (
            <a key={card.id} href={card.href} className="group relative min-h-[330px] w-[84vw] max-w-[390px] flex-none snap-start overflow-hidden rounded-[1.6rem] bg-[#1f1712] text-white shadow-2xl shadow-stone-900/10 transition hover:-translate-y-1 md:w-auto md:max-w-none md:rounded-[2rem]">
              <Image src={imageSrc} alt={card.title} fill sizes="(max-width: 768px) 84vw, 25vw" className="object-cover transition duration-500 group-hover:scale-105" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/52 to-black/5" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                <h3 className="font-serif text-3xl font-bold tracking-[-0.03em] text-white drop-shadow-[0_3px_12px_rgba(0,0,0,.7)]">{card.title}</h3>
                <p className="mt-3 text-sm leading-7 text-white/80">{card.text}</p>
                <span className="mt-5 inline-flex rounded-full bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.08em] text-[#8b5e34]">{card.cta}</span>
              </div>
            </a>
          );
        })}
      </div>
    </Section>
  );
}

function ChiosGuideSection({ data }: { data: HomePageData }) {
  return (
    <Section>
      <SectionTitle kicker={data.chiosGuide.kicker} icon={data.chiosGuide.icon} title={data.chiosGuide.title} subtitle={data.chiosGuide.subtitle} />
      <MobileSwipeHint />
      <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-5 pr-12 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:grid md:grid-cols-2 md:overflow-visible md:pr-0 xl:grid-cols-3">
        {data.chiosGuide.cards.map((card) => {
          const imageSrc = homeGuideImages[card.imageClass] || data.hero.image;

          return (
            <a key={card.id} href={card.href} className="group w-[84vw] max-w-[390px] flex-none snap-start overflow-hidden rounded-[1.6rem] border border-amber-900/10 bg-white shadow-xl shadow-stone-900/5 transition hover:-translate-y-1 hover:shadow-2xl md:w-auto md:max-w-none md:rounded-[2rem]">
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image src={imageSrc} alt={card.title} fill sizes="(max-width: 768px) 84vw, 33vw" className="object-cover transition duration-500 group-hover:scale-105" loading="lazy" />
              </div>
              <div className="p-5">
                <h3 className="font-serif text-2xl font-bold tracking-[-0.03em] text-[#241d18]">{card.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#6f6257] md:text-base">{card.text}</p>
                <span className="mt-5 inline-flex rounded-full border border-[#8b5e34]/20 px-4 py-2 text-xs font-black uppercase tracking-[0.08em] text-[#8b5e34]">
                  <span className="mr-2" aria-hidden="true">{card.ctaIcon}</span>
                  {card.ctaLabel}
                </span>
              </div>
            </a>
          );
        })}
      </div>
    </Section>
  );
}

function QuizBar({ data }: { data: HomePageData }) {
  return (
    <Section className="py-8 md:py-10">
      <div className="grid gap-5 rounded-[2rem] bg-[#2f261f] p-6 text-white shadow-2xl shadow-stone-900/10 md:grid-cols-[1fr_auto] md:items-center md:p-8">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.20em] text-amber-200">{data.quizBar.label}</p>
          <p className="mt-2 max-w-3xl text-base leading-7 text-white/85 md:text-lg md:leading-8">{data.quizBar.text}</p>
        </div>
        <a href={data.quizBar.href} className="inline-flex w-full items-center justify-center rounded-full bg-white px-6 py-3 text-center text-sm font-black uppercase tracking-[0.06em] text-[#8b5e34] shadow-lg transition hover:bg-[#fff7ed] sm:w-auto sm:min-w-[300px]" aria-label={data.quizBar.cta}>
          {data.quizBar.cta}
        </a>
      </div>
    </Section>
  );
}

function FaqSection({ data }: { data: HomePageData }) {
  return (
    <Section>
      <div className="mx-auto max-w-5xl">
        <SectionTitle kicker={data.faq.kicker} icon={data.faq.icon} title={data.faq.title} />
        <div className="grid gap-3">
          {data.faq.items.map((item) => (
            <details key={item.question} className="group rounded-3xl border border-amber-900/10 bg-white p-5 shadow-sm">
              <summary className="cursor-pointer list-none font-bold text-[#241d18]">{item.question}</summary>
              <div className="mt-4 leading-8 text-[#6f6257]"><HtmlText html={item.answerHtml} /></div>
            </details>
          ))}
        </div>
      </div>
    </Section>
  );
}

function FinalCta({ data }: { data: HomePageData }) {
  return (
    <section className="px-4 pb-16 pt-4 md:px-8 md:pb-20">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-[#1f1712] text-white shadow-2xl shadow-stone-900/20 md:rounded-[2.6rem]">
        <Image src="/images/site/Screenshot_2026-04-25-14-11-19-166_com.instagram.android-edit-1.webp" alt="" fill sizes="(max-width: 768px) 100vw, 1280px" className="object-cover object-center" loading="lazy" aria-hidden="true" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/68 via-black/38 to-black/5" />
        <div className="relative z-10 max-w-3xl p-7 md:p-14">
          <p className="mb-3 text-xs font-black uppercase tracking-[0.22em] text-amber-200">{data.finalCta.kicker}</p>
          <h2 className="font-serif text-4xl font-bold leading-tight tracking-[-0.04em] md:text-6xl">
            <span className="mr-2" aria-hidden="true">{data.finalCta.icon}</span>
            {data.finalCta.title}
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-8 text-white/85 md:text-lg md:leading-9">{data.finalCta.text}</p>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:flex sm:flex-wrap">
            <PrimaryButton href={data.finalCta.primaryCta.href}>
              <span className="mr-2" aria-hidden="true">{data.finalCta.primaryCta.icon}</span>
              {data.finalCta.primaryCta.label}
            </PrimaryButton>
            <SecondaryButton href={data.finalCta.secondaryCta.href} light>
              <span className="mr-2" aria-hidden="true">{data.finalCta.secondaryCta.icon}</span>
              {data.finalCta.secondaryCta.label}
            </SecondaryButton>
          </div>
        </div>
      </div>
    </section>
  );
}

function MobileSticky({ data }: { data: HomePageData }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-amber-900/10 bg-white/95 p-3 shadow-2xl backdrop-blur md:hidden">
      <div className="grid grid-cols-2 gap-3">
        <SecondaryButton href={data.mobileSticky.call.href}>{data.mobileSticky.call.label}</SecondaryButton>
        <a href={data.mobileSticky.viber.href} className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#25d366] px-6 text-sm font-black uppercase tracking-[0.08em] text-white shadow-lg shadow-green-900/20 transition hover:bg-green-700">
          {data.mobileSticky.viber.label}
        </a>
      </div>
    </div>
  );
}

export function HomePageTailwindV2({ data }: HomePageTailwindV2Props) {
  return (
    <>
      <PageShell>
        <Hero data={data} />
        <AnnounceBar data={data} />
        <IntroSection data={data} />
        <RoomsSection data={data} />
        <LazyLastMinuteDeals data={data.lastMinute} canonicalPath={data.seo.canonicalPath} />
        <DirectBookingBox data={data} />
        <KambosStory data={data} />
        <LocationAndDirect data={data} />
        <ReviewsSection data={data} />
        <AmenitiesSection data={data} />
        <TravelerSection data={data} />
        <ChiosGuideSection data={data} />
        <QuizBar data={data} />
        <FaqSection data={data} />
        <FinalCta data={data} />
      </PageShell>
      <MobileSticky data={data} />
    </>
  );
}
