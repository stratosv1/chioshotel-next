import { kamposChiosPaths } from "@/content/kampos-chios-paths";

// Desktop-only quick menu shown on the right side of the homepage hero.
// Links point to the strongest Chios guide pages (beaches broken down by
// category, villages and Kambos) and are fully localized per language.

type LocaleCode = "en" | "el" | "fr" | "de" | "it" | "es" | "tr";

type MenuLink = { label: string; href: string };

type HeroChiosMenuCopy = {
  kicker: string;
  title: string;
  beachesTitle: string;
  beachesAllLabel: string;
  beachesAllHref: string;
  beaches: MenuLink[];
  villagesTitle: string;
  villages: MenuLink[];
  planner: MenuLink;
};

const copy: Record<LocaleCode, HeroChiosMenuCopy> = {
  en: {
    kicker: "Chios guide",
    title: "Explore Chios",
    beachesTitle: "Chios beaches",
    beachesAllLabel: "All beaches",
    beachesAllHref: "/chios/chios-beaches/",
    beaches: [
      { label: "Sandy", href: "/chios-sandy-beaches/" },
      { label: "Organized", href: "/chios-organized-beaches/" },
      { label: "Quiet", href: "/chios-quiet-beaches/" },
      { label: "For kids", href: "/chios-family-beaches/" },
      { label: "Sheltered", href: "/chios-sheltered-beaches/" },
      { label: "Near us", href: "/beaches-near-voulamandis-house/" },
    ],
    villagesTitle: "Villages & Kambos",
    villages: [
      { label: "Mastic villages", href: "/chios-mastic-villages/" },
      { label: "Medieval villages", href: "/chios-medieval-villages/" },
      { label: "Kambos, Chios", href: kamposChiosPaths.en },
    ],
    planner: { label: "Plan your day in Chios", href: "/trip-planner/" },
  },
  el: {
    kicker: "Οδηγός Χίου",
    title: "Εξερευνήστε τη Χίο",
    beachesTitle: "Παραλίες της Χίου",
    beachesAllLabel: "Όλες",
    beachesAllHref: "/el/paralies-xios/",
    beaches: [
      { label: "Με άμμο", href: "/el/paralies-me-ammo-xios/" },
      { label: "Οργανωμένες", href: "/el/organomenes-paralies-xios/" },
      { label: "Ήσυχες", href: "/el/isixes-paralies-xios/" },
      { label: "Για παιδιά", href: "/el/paralies-xios-gia-paidia/" },
      { label: "Απάνεμες", href: "/el/apanemes-paralies-xios/" },
      { label: "Κοντά μας", href: "/el/kontines-paralies-voulamandis-house/" },
    ],
    villagesTitle: "Χωριά & Κάμπος",
    villages: [
      { label: "Μαστιχοχώρια", href: "/el/mastichochoria-xios/" },
      { label: "Μεσαιωνικά χωριά", href: "/el/mesaionika-xoria-xios/" },
      { label: "Κάμπος Χίου", href: kamposChiosPaths.el },
    ],
    planner: { label: "Οργανώστε τη μέρα σας", href: "/trip-planner/" },
  },
  fr: {
    kicker: "Guide de Chios",
    title: "Découvrir Chios",
    beachesTitle: "Plages de Chios",
    beachesAllLabel: "Toutes",
    beachesAllHref: "/fr/plages-de-chios/",
    beaches: [
      { label: "Sable", href: "/fr/plages-de-sable-chios/" },
      { label: "Organisées", href: "/fr/plages-organisees-chios/" },
      { label: "Calmes", href: "/fr/plages-calmes-chios/" },
      { label: "Enfants", href: "/fr/plages-de-chios-pour-enfants/" },
      { label: "Abritées", href: "/fr/plages-abritees-chios/" },
      { label: "Près de nous", href: "/fr/plages-proches-voulamandis-house/" },
    ],
    villagesTitle: "Villages & Kambos",
    villages: [
      { label: "Villages du mastic", href: "/fr/villages-du-mastic-chios/" },
      { label: "Villages médiévaux", href: "/fr/villages-medievaux-chios/" },
      { label: "Kambos, Chios", href: kamposChiosPaths.fr },
    ],
    planner: { label: "Planifiez votre journée", href: "/trip-planner/" },
  },
  de: {
    kicker: "Chios-Guide",
    title: "Chios entdecken",
    beachesTitle: "Strände auf Chios",
    beachesAllLabel: "Alle",
    beachesAllHref: "/de/straende-chios/",
    beaches: [
      { label: "Sand", href: "/de/sandstraende-chios/" },
      { label: "Organisiert", href: "/de/organisierte-straende-chios/" },
      { label: "Ruhig", href: "/de/ruhige-straende-chios/" },
      { label: "Für Kinder", href: "/de/chios-straende-fuer-kinder/" },
      { label: "Geschützt", href: "/de/geschuetzte-straende-chios/" },
      { label: "In der Nähe", href: "/de/straende-nahe-voulamandis-house/" },
    ],
    villagesTitle: "Dörfer & Kambos",
    villages: [
      { label: "Mastixdörfer", href: "/de/mastixdoerfer-chios/" },
      { label: "Mittelalterliche Dörfer", href: "/de/mittelalterliche-doerfer-chios/" },
      { label: "Kambos, Chios", href: kamposChiosPaths.de },
    ],
    planner: { label: "Ihren Tag planen", href: "/trip-planner/" },
  },
  it: {
    kicker: "Guida di Chios",
    title: "Scopri Chios",
    beachesTitle: "Spiagge di Chios",
    beachesAllLabel: "Tutte",
    beachesAllHref: "/it/spiagge-chios/",
    beaches: [
      { label: "Sabbia", href: "/it/spiagge-di-sabbia-chios/" },
      { label: "Attrezzate", href: "/it/spiagge-attrezzate-chios/" },
      { label: "Tranquille", href: "/it/spiagge-tranquille-chios/" },
      { label: "Per bambini", href: "/it/spiagge-chios-per-bambini/" },
      { label: "Riparate", href: "/it/spiagge-riparate-chios/" },
      { label: "Vicino a noi", href: "/it/spiagge-vicine-voulamandis-house/" },
    ],
    villagesTitle: "Villaggi & Kambos",
    villages: [
      { label: "Villaggi del mastice", href: "/it/villaggi-del-mastice-chios/" },
      { label: "Villaggi medievali", href: "/it/villaggi-medievali-chios/" },
      { label: "Kambos, Chios", href: kamposChiosPaths.it },
    ],
    planner: { label: "Pianifica la tua giornata", href: "/trip-planner/" },
  },
  es: {
    kicker: "Guía de Quíos",
    title: "Descubre Quíos",
    beachesTitle: "Playas de Quíos",
    beachesAllLabel: "Todas",
    beachesAllHref: "/es/playas-chios/",
    beaches: [
      { label: "De arena", href: "/es/playas-de-arena-quios/" },
      { label: "Organizadas", href: "/es/playas-organizadas-quios/" },
      { label: "Tranquilas", href: "/es/playas-tranquilas-quios/" },
      { label: "Para niños", href: "/es/playas-de-quios-para-ninos/" },
      { label: "Resguardadas", href: "/es/playas-resguardadas-quios/" },
      { label: "Cerca de nosotros", href: "/es/playas-cerca-voulamandis-house/" },
    ],
    villagesTitle: "Pueblos y Kambos",
    villages: [
      { label: "Pueblos de la mastiha", href: "/es/pueblos-del-mastiha-quios/" },
      { label: "Pueblos medievales", href: "/es/pueblos-medievales-quios/" },
      { label: "Kambos, Quíos", href: kamposChiosPaths.es },
    ],
    planner: { label: "Planifica tu día", href: "/trip-planner/" },
  },
  tr: {
    kicker: "Sakız Adası rehberi",
    title: "Sakız Adası'nı keşfedin",
    beachesTitle: "Sakız Adası plajları",
    beachesAllLabel: "Tümü",
    beachesAllHref: "/tr/sakiz-adasi-plajlari/",
    beaches: [
      { label: "Kumlu", href: "/tr/sakiz-adasi-kumlu-plajlar/" },
      { label: "Düzenli", href: "/tr/sakiz-adasi-duzenli-plajlar/" },
      { label: "Sakin", href: "/tr/sakiz-adasi-sakin-plajlar/" },
      { label: "Çocuklar için", href: "/tr/cocuklar-icin-sakiz-adasi-plajlari/" },
      { label: "Korunaklı", href: "/tr/sakiz-adasi-korunakli-plajlar/" },
      { label: "Yakınımızda", href: "/tr/voulamandis-house-yakin-plajlar/" },
    ],
    villagesTitle: "Köyler ve Kambos",
    villages: [
      { label: "Mastik köyleri", href: "/tr/sakiz-adasi-mastik-koyleri/" },
      { label: "Orta Çağ köyleri", href: "/tr/sakiz-adasi-orta-cag-koyleri/" },
      { label: "Kambos, Sakız Adası", href: kamposChiosPaths.tr },
    ],
    planner: { label: "Gününüzü planlayın", href: "/trip-planner/" },
  },
};

function Arrow({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" className={`h-3.5 w-3.5 shrink-0 ${className}`} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 8h10M9 4l4 4-4 4" />
    </svg>
  );
}

const linkFocus = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-800";

export function HeroChiosMenu({ locale }: { locale: LocaleCode }) {
  const c = copy[locale] ?? copy.en;
  const row = `group flex items-center justify-between gap-2 py-1.5 text-[13px] font-semibold text-stone-800 transition hover:text-amber-800 ${linkFocus}`;

  return (
    <nav
      aria-label={c.title}
      className="absolute bottom-14 right-5 z-10 hidden w-[270px] rounded-2xl bg-[#fffaf3]/55 px-4 pb-3.5 pt-4 text-stone-900 shadow-[0_16px_40px_rgba(12,10,9,.22)] ring-1 ring-white/40 backdrop-blur-xl lg:block xl:right-8 xl:w-[290px]"
    >
      <p className="text-[1.2rem] font-black leading-tight tracking-[-0.03em] text-white [text-shadow:0_1px_8px_rgba(12,10,9,.55)]">{c.title}</p>

      <div className="mt-3 flex items-baseline justify-between gap-3">
        <p className="text-[10px] font-black uppercase tracking-[0.16em] text-stone-500">{c.beachesTitle}</p>
        <a href={c.beachesAllHref} className={`group inline-flex shrink-0 items-center gap-1 text-[11.5px] font-bold text-amber-800 transition hover:text-amber-950 ${linkFocus}`}>
          {c.beachesAllLabel}
          <Arrow className="transition group-hover:translate-x-0.5" />
        </a>
      </div>
      <ul className="mt-0.5 grid grid-cols-2 gap-x-4">
        {c.beaches.map((link) => (
          <li key={link.href} className="border-b border-stone-900/10">
            <a href={link.href} className={row}>
              <span className="min-w-0 break-words">{link.label}</span>
              <Arrow className="text-stone-300 transition group-hover:translate-x-0.5 group-hover:text-amber-800" />
            </a>
          </li>
        ))}
      </ul>

      <p className="mt-3 text-[10px] font-black uppercase tracking-[0.16em] text-stone-500">{c.villagesTitle}</p>
      <ul className="mt-0.5">
        {c.villages.map((link) => (
          <li key={link.href} className="border-b border-stone-900/10">
            <a href={link.href} className={row}>
              <span className="min-w-0 break-words">{link.label}</span>
              <Arrow className="text-stone-300 transition group-hover:translate-x-0.5 group-hover:text-amber-800" />
            </a>
          </li>
        ))}
      </ul>

      <a href={c.planner.href} className={`group mt-2.5 inline-flex items-center gap-1.5 text-[12.5px] font-bold text-amber-800 transition hover:text-amber-950 ${linkFocus}`}>
        {c.planner.label}
        <Arrow className="transition group-hover:translate-x-0.5" />
      </a>
    </nav>
  );
}
