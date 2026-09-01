import Image from "next/image";
import { PropertyFaqSection } from "@/components/faq/PropertyFaqSection";
import { GreekRoomWizardTailwind } from "@/components/rooms/GreekRoomWizardTailwind";
import { RoomWizardTailwind } from "@/components/rooms/RoomWizardTailwind";
import { TopicBadges } from "@/components/seo/TopicBadges";
import type { RoomsCategoryPageData } from "@/content/rooms";
import type { LanguageCode } from "@/lib/languages";
import { withRoomsOwnerHeroIntent } from "@/lib/rooms-owner-seo-intent";

type RoomsCategoryPageProps = {
  data: RoomsCategoryPageData;
};

function HtmlText({ html }: { html: string }) {
  return <span dangerouslySetInnerHTML={{ __html: html }} />;
}

function getWizardLanguage(path: string): LanguageCode {
  if (path.startsWith("/el/")) return "el";
  if (path.startsWith("/fr/")) return "fr";
  if (path.startsWith("/de/")) return "de";
  if (path.startsWith("/it/")) return "it";
  if (path.startsWith("/es/")) return "es";
  if (path.startsWith("/tr/")) return "tr";

  return "en";
}

const cardCtaLabels: Record<LanguageCode, Record<string, string>> = {
  en: {
    "first-floor": "View first floor rooms",
    "ground-floor": "View ground floor rooms",
    "economy-double": "View economy double rooms",
    "family-apartments": "View family apartments",
  },
  el: {
    "first-floor": "Δείτε δωμάτια ορόφου",
    "ground-floor": "Δείτε δωμάτια ισογείου",
    "economy-double": "Δείτε οικονομικά δίκλινα δωμάτια",
    "family-apartments": "Δείτε οικογενειακά διαμερίσματα",
  },
  fr: {
    "first-floor": "Voir les chambres à l’étage",
    "ground-floor": "Voir les chambres au rez-de-chaussée",
    "economy-double": "Voir les chambres doubles économiques",
    "family-apartments": "Voir les appartements familiaux",
  },
  de: {
    "first-floor": "Zimmer im Obergeschoss ansehen",
    "ground-floor": "Zimmer im Erdgeschoss ansehen",
    "economy-double": "Economy-Doppelzimmer ansehen",
    "family-apartments": "Familienapartments ansehen",
  },
  it: {
    "first-floor": "Vedi camere al primo piano",
    "ground-floor": "Vedi camere al piano terra",
    "economy-double": "Vedi le camere doppie economiche",
    "family-apartments": "Vedi appartamenti familiari",
  },
  es: {
    "first-floor": "Ver habitaciones en primera planta",
    "ground-floor": "Ver habitaciones en planta baja",
    "economy-double": "Ver habitaciones dobles económicas",
    "family-apartments": "Ver apartamentos familiares",
  },
  tr: {
    "first-floor": "Üst kat odalarını görüntüle",
    "ground-floor": "Zemin kat odalarını görüntüle",
    "economy-double": "Ekonomik çift kişilik odaları görüntüle",
    "family-apartments": "Aile apartlarını görüntüle",
  },
};

function getCardCtaLabel(cardId: string, language: LanguageCode, fallback: string) {
  return cardCtaLabels[language]?.[cardId] ?? cardCtaLabels.en[cardId] ?? fallback;
}

function getDisplayedCards(data: RoomsCategoryPageData, language: LanguageCode) {
  if (language !== "el") return data.cards;

  return data.cards.map((card) => {
    if (card.id === "economy-double") {
      return {
        ...card,
        subtitle: "Οικονομική επιλογή για 2 άτομα",
        description:
          "Η πιο οικονομική επιλογή για 2 άτομα. Ανακαινισμένα δωμάτια 16m² με σύγχρονες παροχές και αυθεντική αίσθηση Κάμπου.",
        badge: "Οικονομική επιλογή",
        meta: ["2 άτομα", "16m²", "Οικονομικό"],
      };
    }

    if (card.id === "first-floor") {
      return {
        ...card,
        description:
          "Απολαύστε την πανοραμική θέα στο κτήμα και τα εσπεριδοειδή από τη βεράντα σας. Φωτεινά δωμάτια με πιο αναβαθμισμένη αίσθηση.",
      };
    }

    return card;
  });
}

export function RoomsCategoryPage({ data }: RoomsCategoryPageProps) {
  const ownerData = withRoomsOwnerHeroIntent(data);
  const language = getWizardLanguage(ownerData.seo.canonicalPath);
  const hero =
    language === "el"
      ? {
          ...ownerData.hero,
          kicker: "Δωμάτια & διαμερίσματα • Voulamandis House",
          description:
            "Δείτε τα ενοικιαζόμενα δωμάτια στη Χίο και τα οικογενειακά διαμερίσματα του Voulamandis House στον Κάμπο. Συγκρίνετε κατηγορίες, χωρητικότητα και χαρακτηριστικά και επιλέξτε αυτή που ταιριάζει καλύτερα στο ταξίδι σας.",
        }
      : ownerData.hero;
  const intro =
    language === "el"
      ? {
          title: "Ενοικιαζόμενα δωμάτια & διαμερίσματα στη Χίο",
          description:
            "Εξερευνήστε τις κατηγορίες δωματίων και διαμερισμάτων μας στον Κάμπο της Χίου: οικονομικά δίκλινα, ισόγεια δωμάτια, δωμάτια ορόφου και οικογενειακά διαμερίσματα. Όλες οι επιλογές συγκεντρωμένες σε μία σελίδα για εύκολη σύγκριση πριν την κράτηση.",
        }
      : ownerData.intro;
  const cards = getDisplayedCards(ownerData, language);
  const heroImage = cards[1] ?? cards[0];
  const tip =
    language === "el"
      ? {
          ...ownerData.tip,
          title: "Συμβουλή για απευθείας κράτηση",
          textHtml:
            "Θυμηθείτε: χρησιμοποιήστε τον <strong>κωδικό έκπτωσης</strong> στην απευθείας κράτησή σας για να εξασφαλίσετε την <strong>καλύτερη διαθέσιμη τιμή</strong>.",
        }
      : ownerData.tip;

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#fbf6ef] text-[#2f261f]">
      <section
        className="relative isolate overflow-hidden bg-[#f3e7d7] px-4 py-10 text-[#2f261f] sm:px-6 sm:py-12 lg:px-8 lg:py-14"
        aria-labelledby="rooms-hero-title"
      >
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.9),transparent_34rem),radial-gradient(circle_at_bottom_right,rgba(180,118,52,0.13),transparent_28rem)]" />
        <div className="absolute inset-x-6 bottom-0 -z-10 h-px bg-gradient-to-r from-transparent via-amber-900/15 to-transparent" />

        <div className="mx-auto grid max-w-7xl items-center gap-9 lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,.95fr)] lg:gap-12">
          <div className="max-w-3xl">
            <span className="inline-flex rounded-full border border-amber-900/10 bg-white/80 px-4 py-2 text-[11px] font-black uppercase tracking-[0.24em] text-amber-800 shadow-sm">
              {hero.kicker}
            </span>

            <h1
              id="rooms-hero-title"
              className="mt-5 text-balance text-4xl font-black leading-[1.02] tracking-[-0.04em] text-stone-900 sm:text-5xl lg:text-[3.75rem]"
            >
              {hero.title}{" "}
              <span className="text-amber-700">{hero.highlightedTitle}</span>
            </h1>

            <p className="mt-5 max-w-2xl text-pretty text-base leading-7 text-stone-600 sm:text-lg sm:leading-8">
              {hero.description}
            </p>

            <div className="mt-7 grid gap-3 sm:flex sm:flex-wrap">
              <a
                className="inline-flex min-h-[52px] items-center justify-center rounded-full bg-amber-700 px-5 text-center text-[11px] font-black uppercase tracking-[0.1em] !text-white shadow-lg shadow-amber-900/15 transition hover:-translate-y-0.5 hover:bg-amber-800 sm:px-6 sm:text-xs"
                href={hero.primaryCta.href}
                style={{ color: "#ffffff" }}
              >
                {hero.primaryCta.label}
              </a>

              <a
                className="inline-flex min-h-[52px] items-center justify-center rounded-full border border-amber-900/15 bg-white/80 px-5 text-center text-[11px] font-black uppercase tracking-[0.1em] text-amber-900 shadow-sm transition hover:-translate-y-0.5 hover:bg-amber-50 sm:px-6 sm:text-xs"
                href={hero.secondaryCta.href}
              >
                {hero.secondaryCta.label}
              </a>
            </div>
          </div>

          {heroImage ? (
            <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] bg-stone-200 shadow-xl shadow-amber-950/10 ring-1 ring-amber-900/10 lg:aspect-[5/4]">
              <Image
                src={heroImage.image}
                alt={heroImage.imageAlt}
                fill
                priority
                sizes="(min-width: 1024px) 44vw, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-amber-950/20 via-transparent to-white/5" />
            </div>
          ) : null}
        </div>
      </section>

      <TopicBadges locale={language} context="rooms-category" className="border-b border-amber-900/10" />

      <section
        className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16"
        aria-labelledby="rooms-category-title"
      >
        <header className="mx-auto max-w-3xl text-center">
          <span className="inline-flex rounded-full border border-amber-900/10 bg-white px-4 py-2 text-[11px] font-black uppercase tracking-[0.28em] text-amber-800 shadow-sm">
            {hero.kicker}
          </span>

          <h2
            id="rooms-category-title"
            className="mt-5 text-balance text-3xl font-black tracking-[-0.035em] text-[#2f261f] sm:text-4xl lg:text-[2.625rem]"
          >
            {intro.title}
          </h2>

          <p className="mt-4 text-pretty text-base leading-8 text-[#574b3f] sm:text-lg">
            {intro.description}
          </p>

          {language === "el" ? (
            <p className="mt-4 text-sm leading-7 text-[#6a5b4e] sm:text-base">
              Θέλετε πρώτα να συγκρίνετε περιοχές και διαφορετικούς τύπους καταλύματος; Δείτε τον οδηγό για{" "}
              <a
                href="/el/xenodoxeia-xios/"
                className="font-black text-amber-800 underline decoration-amber-300 underline-offset-4 transition hover:text-amber-900"
              >
                ξενοδοχεία στη Χίο
              </a>
              .
            </p>
          ) : null}
        </header>

        <div
          className="mt-9 grid gap-5 sm:grid-cols-2 xl:grid-cols-4"
          id="rooms-list"
        >
          {cards.map((card, index) => (
            <a
              href={card.href}
              className="group overflow-hidden rounded-[30px] border border-amber-900/10 bg-white shadow-[0_18px_45px_rgba(47,38,31,0.10)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_30px_80px_rgba(47,38,31,0.16)] focus:outline-none focus:ring-4 focus:ring-amber-700/20"
              key={card.id}
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-stone-200">
                <Image
                  src={card.image}
                  alt={card.imageAlt}
                  fill
                  priority={index < 2}
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/55 to-transparent" />
                <span className="absolute left-4 top-4 rounded-full bg-white/92 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.16em] text-[#2f261f] shadow-lg backdrop-blur">
                  {card.badge}
                </span>
              </div>

              <div className="p-5 sm:p-6">
                <div className="flex flex-wrap gap-2">
                  {card.meta.map((item) => (
                    <span
                      key={item}
                      className="rounded-full bg-amber-50 px-3 py-1 text-[11px] font-bold text-amber-900 ring-1 ring-amber-900/10"
                    >
                      {item}
                    </span>
                  ))}
                </div>

                <h3 className="mt-4 text-2xl font-black tracking-[-0.03em] text-[#2f261f]">
                  {card.title}
                </h3>

                <p className="mt-1 text-sm font-extrabold uppercase tracking-[0.14em] text-amber-800">
                  {card.subtitle}
                </p>

                <p className="mt-4 text-sm leading-7 text-[#574b3f]">
                  {card.description}
                </p>

                <div className="mt-5 flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-amber-700 px-4 py-2 text-center text-[11px] font-black uppercase tracking-[0.1em] text-white transition group-hover:bg-amber-800">
                  {getCardCtaLabel(card.id, language, card.ctaLabel)} <span aria-hidden="true">→</span>
                </div>
              </div>
            </a>
          ))}
        </div>

        <div className="mt-7 flex flex-col gap-4 rounded-[28px] border border-amber-900/10 bg-[#fffdfa] p-5 shadow-[0_18px_45px_rgba(47,38,31,0.08)] sm:flex-row sm:items-center sm:p-6">
          <div className="flex min-w-0 flex-1 items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-xl text-stone-700 shadow-inner [filter:grayscale(1)]" aria-hidden="true">
              {tip.icon}
            </div>
            <div>
              <h4 className="text-lg font-black tracking-[-0.02em] text-[#2f261f]">
                {tip.title}
              </h4>
              <p className="mt-1 text-sm leading-7 text-[#574b3f]">
                <HtmlText html={tip.textHtml} />
              </p>
            </div>
          </div>
          <span className="inline-flex min-h-12 shrink-0 items-center justify-center rounded-2xl bg-amber-100 px-5 font-mono text-base font-black tracking-[0.12em] text-amber-950 ring-1 ring-amber-900/15">
            WELCOME10
          </span>
        </div>

        <div className="mx-auto mt-11 max-w-3xl text-center">
          <h2 className="text-balance text-3xl font-black tracking-[-0.035em] text-[#2f261f] sm:text-4xl">
            {ownerData.wizardIntro.title}
          </h2>
        </div>

        <div className="mt-8">
          {language === "el" ? (
            <GreekRoomWizardTailwind
              rooms={ownerData.wizard.rooms}
              whatsappPhone={ownerData.wizard.whatsappPhone}
            />
          ) : (
            <RoomWizardTailwind
              rooms={ownerData.wizard.rooms}
              whatsappPhone={ownerData.wizard.whatsappPhone}
              language={language}
            />
          )}
        </div>
      </section>

      <PropertyFaqSection language={language} context="rooms" />
    </main>
  );
}
