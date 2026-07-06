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

function getButtonClass(variant: WelcomeButton["variant"] = "gold") {
  if (variant === "green") {
    return "bg-[#25D366] !text-white shadow-[0_10px_20px_rgba(37,211,102,0.18)] hover:bg-[#1fbd59]";
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
  children: React.ReactNode;
  variant?: WelcomeButton["variant"];
  external?: boolean;
}) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={"inline-flex min-h-[48px] items-center justify-center rounded-2xl px-5 text-center text-sm font-black transition hover:-translate-y-0.5 " + getButtonClass(variant)}
    >
      {children}
    </a>
  );
}

function Section({
  id,
  title,
  children,
}: {
  id?: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="mt-6 rounded-[26px] bg-white p-5 shadow-[0_14px_34px_rgba(15,23,42,0.08)] ring-1 ring-slate-900/5 md:p-8">
      <h2 className="text-2xl font-black tracking-[-0.03em] text-slate-800 md:text-3xl">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Highlight({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-5 rounded-[20px] border-l-4 border-yellow-400 bg-yellow-50 p-5 text-slate-800">
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
      {items.map((item) => (
        <article key={item.title} className="rounded-[20px] border border-slate-100 bg-slate-50 p-5">
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
        </article>
      ))}
    </div>
  );
}

export function WelcomePage({ data }: { data: WelcomePageCopy }) {
  const homeHref = homeLinks[data.locale] ?? homeLinks.en;
  const breakfastHref = welcomeContact.whatsappBase + "?text=" + encodeURIComponent("Hello, I would like to book breakfast at Voulamandis House.");
  const marmaladeHref = welcomeContact.whatsappBase + "?text=" + encodeURIComponent("Hello, I would like to ask about your homemade marmalades.");

  return (
    <main className="min-h-screen bg-[#fff7df] px-4 py-4 text-slate-900 md:px-6 md:py-6">
      <div className="mx-auto max-w-[1080px]">
        <nav aria-label={data.nav.languageLabel} className="mb-4 rounded-[24px] bg-white p-3 shadow-sm ring-1 ring-slate-900/10">
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

        <header className="relative min-h-[460px] overflow-hidden rounded-[32px] bg-slate-950 shadow-[0_22px_55px_rgba(15,23,42,0.25)] md:min-h-[520px]">
          <img src={welcomeImages.hero} alt="" className="absolute inset-0 h-full w-full object-cover" loading="eager" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/70" />
          <div className="relative flex min-h-[460px] items-end p-6 md:min-h-[520px] md:p-11">
            <div className="max-w-[780px] text-white">
              <span className="inline-flex rounded-full bg-white/95 px-4 py-2 text-sm font-black text-slate-800">{data.hero.badge}</span>
              <h1 className="mt-5 text-4xl font-black leading-[1.05] tracking-[-0.05em] md:text-6xl">{data.hero.title}</h1>
              <p className="mt-4 max-w-[720px] text-lg leading-8 text-white/90 md:text-xl">{data.hero.text}</p>
            </div>
          </div>
        </header>

        <Section title={data.quick.title}>
          <p className="text-lg leading-8 text-slate-700">{data.quick.text}</p>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            <GuideButton href={welcomeContact.whatsappBase} variant="green" external>{data.quick.whatsapp}</GuideButton>
            <GuideButton href={welcomeContact.phoneHref} variant="blue">{data.quick.call}</GuideButton>
            <GuideButton href="#wifi" variant="dark">{data.quick.wifi}</GuideButton>
            <GuideButton href="#breakfast">{data.quick.breakfast}</GuideButton>
            <GuideButton href="#delivery">{data.quick.delivery}</GuideButton>
            <GuideButton href="#house-rules">{data.quick.rules}</GuideButton>
          </div>
        </Section>

        <Section id="welcome" title={data.sections.welcome.title}>
          <TextBlock paragraphs={data.sections.welcome.paragraphs} />
          <Highlight>
            <p className="leading-8">{data.sections.welcome.highlight}</p>
            <p className="mt-3 text-lg font-black text-slate-800">{data.sections.welcome.hashtags}</p>
          </Highlight>
          <p className="mt-5 leading-8 text-slate-700">{data.sections.welcome.instagram}</p>
          <p className="mt-3 leading-8 text-slate-700">{data.sections.welcome.offers}</p>
        </Section>

        <Section id="wifi" title={data.sections.wifi.title}>
          <p className="text-lg leading-8 text-slate-700">{data.sections.wifi.intro}</p>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {data.sections.wifi.cards.map((card) => (
              <article key={card.title} className="rounded-[20px] border border-yellow-200 bg-yellow-50 p-5">
                <h3 className="text-lg font-black text-slate-800">{card.title}</h3>
                <p className="mt-2 text-lg font-bold text-slate-700">{card.text[0]}</p>
              </article>
            ))}
          </div>
        </Section>

        <Section id="breakfast" title={data.sections.breakfast.title}>
          <img src={welcomeImages.breakfast} alt="Breakfast at Voulamandis House" className="mb-6 h-auto w-full rounded-[24px] object-cover shadow-[0_14px_34px_rgba(15,23,42,0.12)]" loading="lazy" />
          <p className="text-lg font-bold leading-8 text-slate-800">{data.sections.breakfast.intro}</p>
          <div className="mt-4"><TextBlock paragraphs={data.sections.breakfast.paragraphs} /></div>
          <Highlight><p className="leading-8">{data.sections.breakfast.highlight}</p></Highlight>
          <div className="mt-5"><GuideButton href={breakfastHref} variant="green" external>{data.sections.breakfast.button}</GuideButton></div>
        </Section>

        <Section id="delivery" title={data.sections.delivery.title}>
          <p className="text-lg leading-8 text-slate-700">{data.sections.delivery.intro}</p>
          <Highlight>{data.sections.delivery.important.map((line) => <p key={line} className="leading-8">{line}</p>)}</Highlight>
          <p className="mt-5 leading-8 text-slate-700">{data.sections.delivery.accountIntro}</p>
          <InfoGrid items={data.sections.delivery.items} />
        </Section>

        <Section id="nearby-thymiana" title={data.sections.nearby.title}>
          <p className="text-lg leading-8 text-slate-700">{data.sections.nearby.intro}</p>
          <p className="mt-3 leading-8 text-slate-700">{data.sections.nearby.paragraphs[0]}</p>
          <InfoGrid items={data.sections.nearby.items} />
          <Highlight><p className="leading-8">{data.sections.nearby.tip}</p></Highlight>
          <p className="mt-5 leading-8 text-slate-700">{data.sections.nearby.paragraphs[1]}</p>
        </Section>

        <Section id="podcast" title={data.sections.podcast.title}>
          <TextBlock paragraphs={data.sections.podcast.paragraphs} />
          <Highlight><p className="leading-8">{data.sections.podcast.highlight}</p></Highlight>
        </Section>

        <Section id="marmalade" title={data.sections.marmalade.title}>
          <TextBlock paragraphs={data.sections.marmalade.paragraphs} />
          <Highlight><p className="leading-8">{data.sections.marmalade.highlight}</p></Highlight>
          <InfoGrid items={data.sections.marmalade.items} />
          <p className="mt-5 leading-8 text-slate-700">{data.sections.marmalade.thanks}</p>
          <div className="mt-5"><GuideButton href={marmaladeHref} variant="green" external>{data.sections.marmalade.button}</GuideButton></div>
          <Highlight>
            <p className="leading-8">{data.sections.marmalade.localProducts}</p>
            <div className="mt-3 flex flex-col gap-2">
              <a href="https://myrovoloschios.gr/" target="_blank" rel="noopener noreferrer" className="font-black !text-slate-800 underline">🌿 Myrovolos Chios</a>
              <a href="https://www.myrovolosorganics.gr/" target="_blank" rel="noopener noreferrer" className="font-black !text-slate-800 underline">🌱 Myrovolos Organics</a>
            </div>
          </Highlight>
        </Section>

        <Section id="house-rules" title={data.sections.rules.title}>
          <p className="text-lg leading-8 text-slate-700">{data.sections.rules.intro}</p>
          <InfoGrid items={data.sections.rules.items} />
          <Highlight><p className="leading-8">{data.sections.rules.thanks}</p></Highlight>
        </Section>

        <Section id="contact" title={data.sections.contact.title}>
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
