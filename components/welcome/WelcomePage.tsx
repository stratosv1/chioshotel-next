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
    return "bg-[#25D366] !text-white shadow-[0_14px_26px_rgba(37,211,102,0.22)] hover:bg-[#1fbd59]";
  }

  if (variant === "blue") {
    return "bg-blue-600 !text-white shadow-[0_14px_26px_rgba(37,99,235,0.20)] hover:bg-blue-700";
  }

  if (variant === "dark") {
    return "bg-slate-900 !text-white shadow-[0_14px_26px_rgba(15,23,42,0.20)] hover:bg-slate-800";
  }

  return "bg-yellow-400 !text-slate-950 shadow-[0_14px_26px_rgba(250,204,21,0.26)] hover:bg-yellow-500";
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
      className={"inline-flex min-h-[52px] items-center justify-center rounded-2xl px-5 text-center text-sm font-black transition duration-200 hover:-translate-y-0.5 " + getButtonClass(variant)}
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
    <section id={id} className="mt-6 scroll-mt-6 rounded-[28px] bg-white p-5 shadow-[0_16px_38px_rgba(15,23,42,0.08)] ring-1 ring-slate-900/5 md:p-8">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          {eyebrow ? <p className="mb-2 text-xs font-black uppercase tracking-[0.18em] text-amber-700">{eyebrow}</p> : null}
          <h2 className="text-2xl font-black tracking-[-0.035em] text-slate-850 md:text-3xl">{title}</h2>
        </div>
        {id ? <span className={"inline-flex w-fit rounded-full px-3 py-1 text-xs font-black ring-1 " + accent}>Guide</span> : null}
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function Highlight({ children }: { children: ReactNode }) {
  return (
    <div className="mt-5 rounded-[22px] border-l-4 border-yellow-400 bg-yellow-50/90 p-5 text-slate-800 shadow-inner shadow-yellow-100/60">
      {children}
    </div>
  );
}

function TextBlock({ paragraphs }: { paragraphs: string[] }) {
  return (
    <div className="space-y-3 text-base leading-8 text-slate-700 md:text-lg">
      {paragraphs.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
    </div>
  );
}

function InfoGrid({ items }: { items: WelcomeItem[] }) {
  return (
    <div className="mt-5 grid gap-4 md:grid-cols-2">
      {items.map((item, index) => (
        <article key={item.title} className="group rounded-[22px] border border-slate-100 bg-slate-50 p-5 shadow-sm transition hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_14px_30px_rgba(15,23,42,0.08)]">
          <div className="flex gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-yellow-100 text-sm font-black text-yellow-900 ring-1 ring-yellow-200">{String(index + 1).padStart(2, "0")}</span>
            <div>
              <h3 className="text-lg font-black text-slate-800">{item.title}</h3>
              <div className="mt-3 space-y-2 text-base leading-7 text-slate-700">
                {item.text.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
              {item.button ? (
                <div className="mt-4">
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
  );
}

function QuickCard({ href, label, tone, icon, external = false }: { href: string; label: string; tone: WelcomeButton["variant"]; icon: string; external?: boolean }) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="group rounded-[22px] border border-slate-100 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-[0_16px_32px_rgba(15,23,42,0.10)]"
    >
      <span className={"mb-3 flex h-12 w-12 items-center justify-center rounded-2xl text-xs font-black " + (tone === "green" ? "bg-emerald-100 text-emerald-900" : tone === "blue" ? "bg-blue-100 text-blue-900" : tone === "dark" ? "bg-slate-900 text-white" : "bg-yellow-100 text-yellow-900")}>{icon}</span>
      <span className="block text-base font-black text-slate-900">{label}</span>
    </a>
  );
}

export function WelcomePage({ data }: { data: WelcomePageCopy }) {
  const homeHref = homeLinks[data.locale] ?? homeLinks.en;
  const breakfastHref = welcomeContact.whatsappBase + "?text=" + encodeURIComponent("Hello, I would like to book breakfast at Voulamandis House.");
  const marmaladeHref = welcomeContact.whatsappBase + "?text=" + encodeURIComponent("Hello, I would like to ask about your homemade marmalades.");

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,#fff3bf_0,#fff7df_28%,#fffaf0_58%,#ffffff_100%)] px-4 py-4 text-slate-900 md:px-6 md:py-6">
      <div className="mx-auto max-w-[1080px]">
        <nav aria-label={data.nav.languageLabel} className="sticky top-3 z-30 mb-4 rounded-[24px] bg-white/92 p-3 shadow-sm ring-1 ring-slate-900/10 backdrop-blur md:static">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap justify-center gap-2 md:justify-start">
              {languageLinks.map((item) => (
                <a
                  href={item.href}
                  key={item.locale}
                  className={"rounded-full px-4 py-2 text-sm font-black transition " + (item.locale === data.locale ? "bg-teal-800 !text-white" : "bg-slate-100 !text-slate-950 hover:bg-slate-200")}
                >
                  {item.label}
                </a>
              ))}
            </div>

            <a href={homeHref} className="inline-flex min-h-[42px] items-center justify-center rounded-full border border-slate-200 bg-white px-5 text-center text-xs font-black uppercase tracking-[0.06em] !text-slate-950 hover:bg-slate-50">
              ← {data.nav.homeLabel}
            </a>
          </div>
        </nav>

        <header className="relative min-h-[470px] overflow-hidden rounded-[34px] bg-slate-950 shadow-[0_24px_60px_rgba(15,23,42,0.28)] md:min-h-[540px]">
          <img src={welcomeImages.hero} alt="" className="absolute inset-0 h-full w-full object-cover" loading="eager" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/18 via-black/10 to-black/72" />
          <div className="absolute inset-x-5 top-5 flex flex-wrap gap-2 md:inset-x-8 md:top-8">
            <span className="rounded-full bg-white/95 px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-slate-800">Stay Guide</span>
            <span className="rounded-full bg-yellow-300/95 px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-slate-900">Kampos, Chios</span>
          </div>
          <div className="relative flex min-h-[470px] items-end p-6 md:min-h-[540px] md:p-11">
            <div className="max-w-[800px] text-white">
              <span className="inline-flex rounded-full bg-white/95 px-4 py-2 text-sm font-black text-slate-800">{data.hero.badge}</span>
              <h1 className="mt-5 text-4xl font-black leading-[1.04] tracking-[-0.055em] md:text-6xl">{data.hero.title}</h1>
              <p className="mt-4 max-w-[720px] text-lg leading-8 text-white/92 md:text-xl">{data.hero.text}</p>
            </div>
          </div>
        </header>

        <Section title={data.quick.title} eyebrow="Everything you need">
          <p className="text-lg leading-8 text-slate-700">{data.quick.text}</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
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
            <p className="leading-8">{data.sections.welcome.highlight}</p>
            <p className="mt-3 break-words text-lg font-black text-slate-800">{data.sections.welcome.hashtags}</p>
          </Highlight>
          <p className="mt-5 leading-8 text-slate-700">{data.sections.welcome.instagram}</p>
          <p className="mt-3 leading-8 text-slate-700">{data.sections.welcome.offers}</p>
        </Section>

        <Section id="wifi" title={data.sections.wifi.title} eyebrow="Connection">
          <p className="text-lg leading-8 text-slate-700">{data.sections.wifi.intro}</p>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {data.sections.wifi.cards.map((card, index) => (
              <article key={card.title} className="rounded-[22px] border border-yellow-200 bg-yellow-50 p-5 shadow-sm">
                <span className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-xs font-black text-yellow-900 ring-1 ring-yellow-200">{index === 0 ? "NET" : index === 1 ? "KEY" : "HELP"}</span>
                <h3 className="text-lg font-black text-slate-800">{card.title}</h3>
                <p className="mt-2 text-lg font-bold text-slate-700">{index === 1 ? "a12345678" : card.text[0]}</p>
              </article>
            ))}
          </div>
        </Section>

        <Section id="breakfast" title={data.sections.breakfast.title} eyebrow="Homemade morning">
          <img src={welcomeImages.breakfast} alt="Breakfast at Voulamandis House" className="mb-6 h-auto w-full rounded-[26px] object-cover shadow-[0_16px_38px_rgba(15,23,42,0.14)]" loading="lazy" />
          <p className="text-lg font-bold leading-8 text-slate-800">{data.sections.breakfast.intro}</p>
          <div className="mt-4"><TextBlock paragraphs={data.sections.breakfast.paragraphs} /></div>
          <Highlight><p className="leading-8">{data.sections.breakfast.highlight}</p></Highlight>
          <div className="mt-5"><GuideButton href={breakfastHref} variant="green" external>{data.sections.breakfast.button}</GuideButton></div>
        </Section>

        <Section id="delivery" title={data.sections.delivery.title} eyebrow="Food and coffee">
          <p className="text-lg leading-8 text-slate-700">{data.sections.delivery.intro}</p>
          <Highlight>{data.sections.delivery.important.map((line) => <p key={line} className="leading-8">{line}</p>)}</Highlight>
          <p className="mt-5 leading-8 text-slate-700">{data.sections.delivery.accountIntro}</p>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <article className="rounded-[22px] border border-yellow-300 bg-slate-50 p-5 shadow-sm">
              <h3 className="text-lg font-black text-slate-800">Fagi Login Details</h3>
              <div className="mt-3 space-y-2 text-base leading-7 text-slate-700">
                <p><strong>Username:</strong> vhouse.reservations@gmail.com</p>
                <p><strong>Password:</strong> chioshotel.gr</p>
              </div>
            </article>

            <article className="rounded-[22px] border border-yellow-300 bg-slate-50 p-5 shadow-sm">
              <h3 className="text-lg font-black text-slate-800">Download the App</h3>
              <p className="mt-3 text-base leading-7 text-slate-700">
                Download the Fagi app and use the login details above to place your order.
              </p>
              <div className="mt-4">
                <GuideButton href="https://play.google.com/store/apps/details?id=com.fagi.fagi.gr&hl=el" external>
                  Download Fagi App
                </GuideButton>
              </div>
            </article>
          </div>

          <InfoGrid items={data.sections.delivery.items.slice(2)} />
        </Section>

        <Section id="nearby-thymiana" title={data.sections.nearby.title} eyebrow="Around the house">
          <p className="text-lg leading-8 text-slate-700">{data.sections.nearby.intro}</p>
          <p className="mt-3 leading-8 text-slate-700">{data.sections.nearby.paragraphs[0]}</p>
          <InfoGrid items={data.sections.nearby.items} />
          <Highlight><p className="leading-8">{data.sections.nearby.tip}</p></Highlight>
          <p className="mt-5 leading-8 text-slate-700">{data.sections.nearby.paragraphs[1]}</p>
        </Section>

        <Section id="podcast" title={data.sections.podcast.title} eyebrow="Local story">
          <TextBlock paragraphs={data.sections.podcast.paragraphs} />
          <Highlight><p className="leading-8">{data.sections.podcast.highlight}</p></Highlight>
        </Section>

        <Section id="marmalade" title={data.sections.marmalade.title} eyebrow="Taste of Chios">
          <TextBlock paragraphs={data.sections.marmalade.paragraphs} />
          <Highlight><p className="leading-8">{data.sections.marmalade.highlight}</p></Highlight>
          <InfoGrid items={data.sections.marmalade.items} />
          <p className="mt-5 leading-8 text-slate-700">{data.sections.marmalade.thanks}</p>
          <div className="mt-5"><GuideButton href={marmaladeHref} variant="green" external>{data.sections.marmalade.button}</GuideButton></div>
          <Highlight>
            <p className="leading-8">{data.sections.marmalade.localProducts}</p>
            <div className="mt-3 flex flex-col gap-2">
              <a href="https://myrovoloschios.gr/" target="_blank" rel="noopener noreferrer" className="font-black !text-slate-800 underline">Myrovolos Chios</a>
              <a href="https://www.myrovolosorganics.gr/" target="_blank" rel="noopener noreferrer" className="font-black !text-slate-800 underline">Myrovolos Organics</a>
            </div>
          </Highlight>
        </Section>

        <Section id="house-rules" title={data.sections.rules.title} eyebrow="Care and comfort">
          <p className="text-lg leading-8 text-slate-700">{data.sections.rules.intro}</p>
          <InfoGrid items={data.sections.rules.items} />
          <Highlight><p className="leading-8">{data.sections.rules.thanks}</p></Highlight>
        </Section>

        <Section id="contact" title={data.sections.contact.title} eyebrow="We are here">
          <p className="text-lg leading-8 text-slate-700">{data.sections.contact.intro}</p>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            <GuideButton href={welcomeContact.whatsappBase} variant="green" external>{data.sections.contact.whatsapp}</GuideButton>
            <GuideButton href={welcomeContact.phoneHref} variant="blue">{data.sections.contact.call}</GuideButton>
            <GuideButton href={welcomeContact.emailHref} variant="dark">{data.sections.contact.email}</GuideButton>
          </div>
          <p className="mt-4 text-sm leading-7 text-slate-500">{data.sections.contact.note}</p>
        </Section>

        <div className="py-10 text-center text-slate-600">
          <p><strong className="text-slate-800">Voulamandis House</strong><br />{data.footer}</p>
        </div>
      </div>
    </main>
  );
}

