import type { ReactNode } from "react";
import { welcomeContact, welcomeImages } from "@/content/welcome";
import type { WelcomeButton, WelcomeItem, WelcomePageCopy } from "@/content/welcome";

const languageLinks = [
  { label: "English", href: "/welcome/", locale: "en" },
  { label: "Ελληνικά", href: "/el/welcome/", locale: "el" },
  { label: "Français", href: "/fr/welcome/", locale: "fr" },
  { label: "Deutsch", href: "/de/welcome/", locale: "de" },
  { label: "Italiano", href: "/it/welcome/", locale: "it" },
  { label: "Español", href: "/es/welcome/", locale: "es" },
  { label: "Türkçe", href: "/tr/welcome/", locale: "tr" },
];

const homeLinks: Record<string, string> = {
  en: "/",
  el: "/el/",
  fr: "/fr/",
  de: "/de/",
  it: "/it/",
  es: "/es/",
  tr: "/tr/",
};

const quickIconByHref: Record<string, string> = {
  whatsapp: "WA",
  call: "TEL",
  wifi: "WiFi",
  breakfast: "12€",
  delivery: "Fagi",
  rules: "OK",
};

const sectionAccent: Record<string, string> = {
  welcome: "bg-emerald-50 text-emerald-900 ring-emerald-200",
  wifi: "bg-sky-50 text-sky-900 ring-sky-200",
  breakfast: "bg-amber-50 text-amber-900 ring-amber-200",
  delivery: "bg-orange-50 text-orange-900 ring-orange-200",
  "nearby-thymiana": "bg-lime-50 text-lime-900 ring-lime-200",
  podcast: "bg-indigo-50 text-indigo-900 ring-indigo-200",
  marmalade: "bg-yellow-50 text-yellow-900 ring-yellow-200",
  "house-rules": "bg-slate-100 text-slate-900 ring-slate-200",
  contact: "bg-teal-50 text-teal-900 ring-teal-200",
};

function getButtonClass(variant: WelcomeButton["variant"] = "gold") {
  if (variant === "green") {
    return "bg-[#25D366] !text-white shadow-[0_10px_20px_rgba(37,211,102,0.20)] hover:bg-[#1fbd59]";
  }

  if (variant === "blue") {
    return "bg-blue-600 !text-white shadow-[0_10px_20px_rgba(37,99,235,0.18)] hover:bg-blue-700";
  }

  if (variant === "dark") {
    return "bg-slate-900 !text-white shadow-[0_10px_20px_rgba(15,23,42,0.18)] hover:bg-slate-800";
  }

  return "bg-yellow-400 !text-slate-950 shadow-[0_10px_20px_rgba(250,204,21,0.22)] hover:bg-yellow-500";
}

function GuideButton({
  href,
  children,
  variant = "gold",
  external = false,
}: {
  href: string;
  children: ReactNode;
  variant?: WelcomeButton["variant"];
  external?: boolean;
}) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={"inline-flex min-h-[44px] items-center justify-center rounded-xl px-4 text-center text-sm font-black transition duration-200 hover:-translate-y-0.5 " + getButtonClass(variant)}
    >
      {children}
    </a>
  );
}

function Section({
  id,
  title,
  eyebrow,
  children,
}: {
  id?: string;
  title: string;
  eyebrow?: string;
  children: ReactNode;
}) {
  const accent = id ? sectionAccent[id] : "bg-yellow-50 text-yellow-900 ring-yellow-200";

  return (
    <section id={id} className="mt-4 scroll-mt-4 rounded-[24px] bg-white p-4 shadow-[0_10px_26px_rgba(15,23,42,0.07)] ring-1 ring-slate-900/5 md:mt-6 md:rounded-[28px] md:p-8">
      <div className="flex items-start justify-between gap-3">
        <div>
          {eyebrow ? <p className="mb-1.5 text-[11px] font-black uppercase tracking-[0.18em] text-amber-700 md:text-xs">{eyebrow}</p> : null}
          <h2 className="text-[1.55rem] font-black leading-tight tracking-[-0.04em] text-slate-950 md:text-3xl">{title}</h2>
        </div>
        {id ? <span className={"shrink-0 rounded-full px-3 py-1 text-[11px] font-black ring-1 md:text-xs " + accent}>Guide</span> : null}
      </div>
      <div className="mt-4 md:mt-5">{children}</div>
    </section>
  );
}

function Highlight({ children }: { children: ReactNode }) {
  return (
    <div className="mt-4 rounded-[18px] border-l-4 border-yellow-400 bg-yellow-50/90 p-4 text-[15px] leading-7 text-slate-800 shadow-inner shadow-yellow-100/60 md:rounded-[22px] md:p-5 md:text-base">
      {children}
    </div>
  );
}

function TextBlock({ paragraphs }: { paragraphs: string[] }) {
  return (
    <div className="space-y-3 text-[15px] leading-7 text-slate-700 md:text-lg md:leading-8">
      {paragraphs.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
    </div>
  );
}

function InfoGrid({ items }: { items: WelcomeItem[] }) {
  return (
    <div className="relative mt-4 md:mt-5">
      {items.length > 1 ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-2 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-slate-950/95 text-lg font-black text-white shadow-xl md:hidden"
        >
          →
        </div>
      ) : null}
      <div data-carousel-track="true" className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 pr-10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:grid md:grid-cols-2 md:overflow-visible md:pr-0">
        {items.map((item, index) => (
          <article key={item.title} className="group w-[78vw] max-w-[310px] flex-none snap-start rounded-[18px] border border-slate-100 bg-slate-50 p-4 shadow-sm transition hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_14px_30px_rgba(15,23,42,0.08)] md:w-auto md:max-w-none md:rounded-[22px] md:p-5">
            <div className="flex gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-yellow-100 text-xs font-black text-yellow-900 ring-1 ring-yellow-200 md:h-11 md:w-11 md:text-sm">{String(index + 1).padStart(2, "0")}</span>
              <div>
                <h3 className="text-base font-black leading-tight text-slate-900 md:text-lg">{item.title}</h3>
                <div className="mt-2 space-y-1.5 text-sm leading-6 text-slate-700 md:text-base md:leading-7">
                  {item.text.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
                {item.button ? (
                  <div className="mt-3">
                    <GuideButton href={item.button.href} variant={item.button.variant} external={item.button.external}>
                      {item.button.label}
                    </GuideButton>
                  </div>
                ) : null}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function QuickCard({ href, label, tone, icon, external = false }: { href: string; label: string; tone: WelcomeButton["variant"]; icon: string; external?: boolean }) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="group flex min-h-[82px] flex-col justify-between rounded-[18px] border border-slate-100 bg-white p-3 shadow-sm transition hover:-translate-y-1 hover:shadow-[0_16px_32px_rgba(15,23,42,0.10)] md:min-h-[112px] md:rounded-[22px] md:p-4"
    >
      <span className={"flex h-9 w-9 items-center justify-center rounded-2xl text-[11px] font-black md:h-12 md:w-12 md:text-xs " + (tone === "green" ? "bg-emerald-100 text-emerald-900" : tone === "blue" ? "bg-blue-100 text-blue-900" : tone === "dark" ? "bg-slate-900 text-white" : "bg-yellow-100 text-yellow-900")}>{icon}</span>
      <span className="block text-[13px] font-black leading-tight text-slate-950 md:text-base">{label}</span>
    </a>
  );
}

export function WelcomePage({ data }: { data: WelcomePageCopy }) {
  const homeHref = homeLinks[data.locale] ?? homeLinks.en;
  const breakfastHref = welcomeContact.whatsappBase + "?text=" + encodeURIComponent("Hello, I would like to book breakfast at Voulamandis House.");
  const marmaladeHref = welcomeContact.whatsappBase + "?text=" + encodeURIComponent("Hello, I would like to ask about your homemade marmalades.");

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,#fff3bf_0,#fff7df_28%,#fffaf0_58%,#ffffff_100%)] px-3 py-3 text-slate-900 md:px-6 md:py-6">
      <div className="mx-auto max-w-[1080px]">
        <nav aria-label={data.nav.languageLabel} className="sticky top-2 z-30 mb-3 rounded-[22px] bg-white/92 p-2.5 shadow-sm ring-1 ring-slate-900/10 backdrop-blur md:static md:mb-4 md:p-3">
          <div className="flex flex-col gap-2.5 md:flex-row md:items-center md:justify-between">
            <div className="grid grid-cols-4 gap-1.5 md:flex md:flex-wrap md:justify-start md:gap-2">
              {languageLinks.map((item) => (
                <a
                  href={item.href}
                  key={item.locale}
                  className={"rounded-full px-2.5 py-2 text-center text-[12px] font-black transition md:px-4 md:text-sm " + (item.locale === data.locale ? "bg-teal-800 !text-white" : "bg-slate-100 !text-slate-950 hover:bg-slate-200")}
                >
                  {item.label}
                </a>
              ))}
            </div>

            <a href={homeHref} className="inline-flex min-h-[38px] items-center justify-center rounded-full border border-slate-200 bg-white px-4 text-center text-[11px] font-black uppercase tracking-[0.06em] !text-slate-950 hover:bg-slate-50 md:min-h-[42px] md:px-5 md:text-xs">
              ← {data.nav.homeLabel}
            </a>
          </div>
        </nav>

        <header className="relative min-h-[390px] overflow-hidden rounded-[28px] bg-slate-950 shadow-[0_18px_45px_rgba(15,23,42,0.24)] md:min-h-[540px] md:rounded-[34px]">
          <img src={welcomeImages.hero} alt="" className="absolute inset-0 h-full w-full object-cover" loading="eager" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/12 via-black/8 to-black/78" />
          <div className="absolute inset-x-4 top-4 flex flex-wrap gap-2 md:inset-x-8 md:top-8">
            <span className="rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.12em] text-slate-800 md:px-4 md:py-2 md:text-xs">Stay Guide</span>
            <span className="rounded-full bg-yellow-300/95 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.12em] text-slate-900 md:px-4 md:py-2 md:text-xs">Kampos, Chios</span>
          </div>
          <div className="relative flex min-h-[390px] items-end p-5 md:min-h-[540px] md:p-11">
            <div className="max-w-[800px] text-white">
              <span className="inline-flex rounded-full bg-white/95 px-3 py-1.5 text-xs font-black text-slate-800 md:px-4 md:py-2 md:text-sm">{data.hero.badge}</span>
              <h1 className="mt-4 text-[2.35rem] font-black leading-[1.02] tracking-[-0.055em] md:text-6xl">{data.hero.title}</h1>
              <p className="mt-3 max-w-[720px] text-base leading-7 text-white/92 md:text-xl md:leading-8">{data.hero.text}</p>
            </div>
          </div>
        </header>

        <Section title={data.quick.title} eyebrow="Everything you need">
          <p className="text-[15px] leading-7 text-slate-700 md:text-lg md:leading-8">{data.quick.text}</p>
          <div className="mt-4 grid grid-cols-3 gap-2 md:mt-5 md:gap-3">
            <QuickCard href={welcomeContact.whatsappBase} label={data.quick.whatsapp} tone="green" icon={quickIconByHref.whatsapp} external />
            <QuickCard href={welcomeContact.phoneHref} label={data.quick.call} tone="blue" icon={quickIconByHref.call} />
            <QuickCard href="#wifi" label={data.quick.wifi} tone="dark" icon={quickIconByHref.wifi} />
            <QuickCard href="#breakfast" label={data.quick.breakfast} tone="gold" icon={quickIconByHref.breakfast} />
            <QuickCard href="#delivery" label={data.quick.delivery} tone="gold" icon={quickIconByHref.delivery} />
            <QuickCard href="#house-rules" label={data.quick.rules} tone="gold" icon={quickIconByHref.rules} />
          </div>
        </Section>

        <Section id="welcome" title={data.sections.welcome.title} eyebrow="Welcome">
          <TextBlock paragraphs={data.sections.welcome.paragraphs} />
          <Highlight>
            <p>{data.sections.welcome.highlight}</p>
            <p className="mt-2 break-words text-base font-black text-slate-800 md:text-lg">{data.sections.welcome.hashtags}</p>
          </Highlight>
          <p className="mt-4 text-[15px] leading-7 text-slate-700 md:text-base md:leading-8">{data.sections.welcome.instagram}</p>
          <p className="mt-2 text-[15px] leading-7 text-slate-700 md:text-base md:leading-8">{data.sections.welcome.offers}</p>
        </Section>

        <Section id="wifi" title={data.sections.wifi.title} eyebrow="Connection">
          <p className="text-[15px] leading-7 text-slate-700 md:text-lg md:leading-8">{data.sections.wifi.intro}</p>
          <div className="mt-4 grid gap-2 md:grid-cols-3 md:gap-4">
            {data.sections.wifi.cards.map((card, index) => (
              <article key={card.title} className="rounded-[18px] border border-yellow-200 bg-yellow-50 p-4 shadow-sm md:rounded-[22px] md:p-5">
                <span className="mb-2 flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-[11px] font-black text-yellow-900 ring-1 ring-yellow-200 md:h-11 md:w-11 md:text-xs">{index === 0 ? "NET" : index === 1 ? "KEY" : "HELP"}</span>
                <h3 className="text-base font-black text-slate-900 md:text-lg">{card.title}</h3>
                <p className="mt-1.5 text-base font-bold text-slate-700 md:mt-2 md:text-lg">{index === 1 ? "a12345678" : card.text[0]}</p>
              </article>
            ))}
          </div>
        </Section>

        <Section id="breakfast" title={data.sections.breakfast.title} eyebrow="Homemade morning">
          <img src={welcomeImages.breakfast} alt="Breakfast at Voulamandis House" className="mb-4 h-auto w-full rounded-[22px] object-cover shadow-[0_12px_30px_rgba(15,23,42,0.12)] md:mb-6 md:rounded-[26px]" loading="lazy" />
          <p className="text-base font-bold leading-7 text-slate-800 md:text-lg md:leading-8">{data.sections.breakfast.intro}</p>
          <div className="mt-3 md:mt-4"><TextBlock paragraphs={data.sections.breakfast.paragraphs} /></div>
          <Highlight><p>{data.sections.breakfast.highlight}</p></Highlight>
          <div className="mt-4 md:mt-5"><GuideButton href={breakfastHref} variant="green" external>{data.sections.breakfast.button}</GuideButton></div>
        </Section>

        <Section id="delivery" title={data.sections.delivery.title} eyebrow="Food and coffee">
          <p className="text-[15px] leading-7 text-slate-700 md:text-lg md:leading-8">{data.sections.delivery.intro}</p>
          <Highlight>{data.sections.delivery.important.map((line) => <p key={line}>{line}</p>)}</Highlight>
          <p className="mt-4 text-[15px] leading-7 text-slate-700 md:text-base md:leading-8">{data.sections.delivery.accountIntro}</p>

          <div className="mt-4 grid gap-3 md:grid-cols-2 md:gap-4">
            <article className="rounded-[18px] border border-yellow-300 bg-slate-50 p-4 shadow-sm md:rounded-[22px] md:p-5">
              <h3 className="text-base font-black text-slate-900 md:text-lg">Fagi Login Details</h3>
              <div className="mt-2 space-y-1 text-sm leading-6 text-slate-700 md:text-base md:leading-7">
                <p><strong>Username:</strong> vhouse.reservations@gmail.com</p>
                <p><strong>Password:</strong> chioshotel.gr</p>
              </div>
            </article>

            <article className="rounded-[18px] border border-yellow-300 bg-slate-50 p-4 shadow-sm md:rounded-[22px] md:p-5">
              <h3 className="text-base font-black text-slate-900 md:text-lg">Download the App</h3>
              <p className="mt-2 text-sm leading-6 text-slate-700 md:text-base md:leading-7">
                Download the Fagi app and use the login details above to place your order.
              </p>
              <div className="mt-3 md:mt-4">
                <GuideButton href="https://play.google.com/store/apps/details?id=com.fagi.fagi.gr&hl=el" external>
                  Download Fagi App
                </GuideButton>
              </div>
            </article>
          </div>

          <InfoGrid items={data.sections.delivery.items.slice(2)} />
        </Section>

        <Section id="nearby-thymiana" title={data.sections.nearby.title} eyebrow="Around the house">
          <p className="text-[15px] leading-7 text-slate-700 md:text-lg md:leading-8">{data.sections.nearby.intro}</p>
          <p className="mt-2 text-[15px] leading-7 text-slate-700 md:mt-3 md:text-base md:leading-8">{data.sections.nearby.paragraphs[0]}</p>
          <InfoGrid items={data.sections.nearby.items} />
          <Highlight><p>{data.sections.nearby.tip}</p></Highlight>
          <p className="mt-4 text-[15px] leading-7 text-slate-700 md:mt-5 md:text-base md:leading-8">{data.sections.nearby.paragraphs[1]}</p>
        </Section>

        <Section id="podcast" title={data.sections.podcast.title} eyebrow="Local story">
          <TextBlock paragraphs={data.sections.podcast.paragraphs} />
          <Highlight><p>{data.sections.podcast.highlight}</p></Highlight>
        </Section>

        <Section id="marmalade" title={data.sections.marmalade.title} eyebrow="Taste of Chios">
          <TextBlock paragraphs={data.sections.marmalade.paragraphs} />
          <Highlight><p>{data.sections.marmalade.highlight}</p></Highlight>
          <InfoGrid items={data.sections.marmalade.items} />
          <p className="mt-4 text-[15px] leading-7 text-slate-700 md:mt-5 md:text-base md:leading-8">{data.sections.marmalade.thanks}</p>
          <div className="mt-4 md:mt-5"><GuideButton href={marmaladeHref} variant="green" external>{data.sections.marmalade.button}</GuideButton></div>
          <Highlight>
            <p>{data.sections.marmalade.localProducts}</p>
            <div className="mt-3 flex flex-col gap-2">
              <a href="https://myrovoloschios.gr/" target="_blank" rel="noopener noreferrer" className="font-black !text-slate-800 underline">Myrovolos Chios</a>
              <a href="https://www.myrovolosorganics.gr/" target="_blank" rel="noopener noreferrer" className="font-black !text-slate-800 underline">Myrovolos Organics</a>
            </div>
          </Highlight>
        </Section>

        <Section id="house-rules" title={data.sections.rules.title} eyebrow="Care and comfort">
          <p className="text-[15px] leading-7 text-slate-700 md:text-lg md:leading-8">{data.sections.rules.intro}</p>
          <InfoGrid items={data.sections.rules.items} />
          <Highlight><p>{data.sections.rules.thanks}</p></Highlight>
        </Section>

        <Section id="contact" title={data.sections.contact.title} eyebrow="We are here">
          <p className="text-[15px] leading-7 text-slate-700 md:text-lg md:leading-8">{data.sections.contact.intro}</p>
          <div className="mt-4 grid grid-cols-3 gap-2 md:mt-5 md:gap-3">
            <GuideButton href={welcomeContact.whatsappBase} variant="green" external>{data.sections.contact.whatsapp}</GuideButton>
            <GuideButton href={welcomeContact.phoneHref} variant="blue">{data.sections.contact.call}</GuideButton>
            <GuideButton href={welcomeContact.emailHref} variant="dark">{data.sections.contact.email}</GuideButton>
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-500 md:mt-4 md:leading-7">{data.sections.contact.note}</p>
        </Section>

        <div className="py-8 text-center text-sm text-slate-600 md:py-10 md:text-base">
          <p><strong className="text-slate-800">Voulamandis House</strong><br />{data.footer}</p>
        </div>
      </div>
    </main>
  );
}
