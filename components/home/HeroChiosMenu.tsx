import { kamposChiosPaths } from "@/content/kampos-chios-paths";

// Desktop-only quick menu shown on the right side of the homepage hero.
// Links point to the strongest Chios guide pages (beaches broken down by
// category, villages and Kambos) and are fully localized per language.

type LocaleCode = "en" | "el" | "fr" | "de" | "it" | "es" | "tr";

type MenuLink = { label: string; href: string; icon: string };

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
      { label: "Sandy", href: "/chios-sandy-beaches/", icon: "🏖️" },
      { label: "Organized", href: "/chios-organized-beaches/", icon: "⛱️" },
      { label: "Quiet", href: "/chios-quiet-beaches/", icon: "🌿" },
      { label: "For kids", href: "/chios-family-beaches/", icon: "👨‍👩‍👧" },
      { label: "Sheltered", href: "/chios-sheltered-beaches/", icon: "🍃" },
      { label: "Near us", href: "/beaches-near-voulamandis-house/", icon: "📍" },
    ],
    villagesTitle: "Villages & Kambos",
    villages: [
      { label: "Mastic villages", href: "/chios-mastic-villages/", icon: "🌳" },
      { label: "Medieval villages", href: "/chios-medieval-villages/", icon: "🏰" },
      { label: "Kambos, Chios", href: kamposChiosPaths.en, icon: "🍊" },
    ],
    planner: { label: "Plan your day in Chios", href: "/trip-planner/", icon: "🗺️" },
  },
  el: {
    kicker: "Οδηγός Χίου",
    title: "Εξερευνήστε τη Χίο",
    beachesTitle: "Παραλίες της Χίου",
    beachesAllLabel: "Όλες",
    beachesAllHref: "/el/paralies-xios/",
    beaches: [
      { label: "Με άμμο", href: "/el/paralies-me-ammo-xios/", icon: "🏖️" },
      { label: "Οργανωμένες", href: "/el/organomenes-paralies-xios/", icon: "⛱️" },
      { label: "Ήσυχες", href: "/el/isixes-paralies-xios/", icon: "🌿" },
      { label: "Για παιδιά", href: "/el/paralies-xios-gia-paidia/", icon: "👨‍👩‍👧" },
      { label: "Απάνεμες", href: "/el/apanemes-paralies-xios/", icon: "🍃" },
      { label: "Κοντά μας", href: "/el/kontines-paralies-voulamandis-house/", icon: "📍" },
    ],
    villagesTitle: "Χωριά & Κάμπος",
    villages: [
      { label: "Μαστιχοχώρια", href: "/el/mastichochoria-xios/", icon: "🌳" },
      { label: "Μεσαιωνικά χωριά", href: "/el/mesaionika-xoria-xios/", icon: "🏰" },
      { label: "Κάμπος Χίου", href: kamposChiosPaths.el, icon: "🍊" },
    ],
    planner: { label: "Οργανώστε τη μέρα σας", href: "/trip-planner/", icon: "🗺️" },
  },
  fr: {
    kicker: "Guide de Chios",
    title: "Découvrir Chios",
    beachesTitle: "Plages de Chios",
    beachesAllLabel: "Toutes",
    beachesAllHref: "/fr/plages-de-chios/",
    beaches: [
      { label: "Sable", href: "/fr/plages-de-sable-chios/", icon: "🏖️" },
      { label: "Organisées", href: "/fr/plages-organisees-chios/", icon: "⛱️" },
      { label: "Calmes", href: "/fr/plages-calmes-chios/", icon: "🌿" },
      { label: "Enfants", href: "/fr/plages-de-chios-pour-enfants/", icon: "👨‍👩‍👧" },
      { label: "Abritées", href: "/fr/plages-abritees-chios/", icon: "🍃" },
      { label: "Près de nous", href: "/fr/plages-proches-voulamandis-house/", icon: "📍" },
    ],
    villagesTitle: "Villages & Kambos",
    villages: [
      { label: "Villages du mastic", href: "/fr/villages-du-mastic-chios/", icon: "🌳" },
      { label: "Villages médiévaux", href: "/fr/villages-medievaux-chios/", icon: "🏰" },
      { label: "Kambos, Chios", href: kamposChiosPaths.fr, icon: "🍊" },
    ],
    planner: { label: "Planifiez votre journée", href: "/trip-planner/", icon: "🗺️" },
  },
  de: {
    kicker: "Chios-Guide",
    title: "Chios entdecken",
    beachesTitle: "Strände auf Chios",
    beachesAllLabel: "Alle",
    beachesAllHref: "/de/straende-chios/",
    beaches: [
      { label: "Sand", href: "/de/sandstraende-chios/", icon: "🏖️" },
      { label: "Organisiert", href: "/de/organisierte-straende-chios/", icon: "⛱️" },
      { label: "Ruhig", href: "/de/ruhige-straende-chios/", icon: "🌿" },
      { label: "Für Kinder", href: "/de/chios-straende-fuer-kinder/", icon: "👨‍👩‍👧" },
      { label: "Geschützt", href: "/de/geschuetzte-straende-chios/", icon: "🍃" },
      { label: "In der Nähe", href: "/de/straende-nahe-voulamandis-house/", icon: "📍" },
    ],
    villagesTitle: "Dörfer & Kambos",
    villages: [
      { label: "Mastixdörfer", href: "/de/mastixdoerfer-chios/", icon: "🌳" },
      { label: "Mittelalterliche Dörfer", href: "/de/mittelalterliche-doerfer-chios/", icon: "🏰" },
      { label: "Kambos, Chios", href: kamposChiosPaths.de, icon: "🍊" },
    ],
    planner: { label: "Ihren Tag planen", href: "/trip-planner/", icon: "🗺️" },
  },
  it: {
    kicker: "Guida di Chios",
    title: "Scopri Chios",
    beachesTitle: "Spiagge di Chios",
    beachesAllLabel: "Tutte",
    beachesAllHref: "/it/spiagge-chios/",
    beaches: [
      { label: "Sabbia", href: "/it/spiagge-di-sabbia-chios/", icon: "🏖️" },
      { label: "Attrezzate", href: "/it/spiagge-attrezzate-chios/", icon: "⛱️" },
      { label: "Tranquille", href: "/it/spiagge-tranquille-chios/", icon: "🌿" },
      { label: "Per bambini", href: "/it/spiagge-chios-per-bambini/", icon: "👨‍👩‍👧" },
      { label: "Riparate", href: "/it/spiagge-riparate-chios/", icon: "🍃" },
      { label: "Vicino a noi", href: "/it/spiagge-vicine-voulamandis-house/", icon: "📍" },
    ],
    villagesTitle: "Villaggi & Kambos",
    villages: [
      { label: "Villaggi del mastice", href: "/it/villaggi-del-mastice-chios/", icon: "🌳" },
      { label: "Villaggi medievali", href: "/it/villaggi-medievali-chios/", icon: "🏰" },
      { label: "Kambos, Chios", href: kamposChiosPaths.it, icon: "🍊" },
    ],
    planner: { label: "Pianifica la tua giornata", href: "/trip-planner/", icon: "🗺️" },
  },
  es: {
    kicker: "Guía de Quíos",
    title: "Descubre Quíos",
    beachesTitle: "Playas de Quíos",
    beachesAllLabel: "Todas",
    beachesAllHref: "/es/playas-chios/",
    beaches: [
      { label: "De arena", href: "/es/playas-de-arena-quios/", icon: "🏖️" },
      { label: "Organizadas", href: "/es/playas-organizadas-quios/", icon: "⛱️" },
      { label: "Tranquilas", href: "/es/playas-tranquilas-quios/", icon: "🌿" },
      { label: "Para niños", href: "/es/playas-de-quios-para-ninos/", icon: "👨‍👩‍👧" },
      { label: "Resguardadas", href: "/es/playas-resguardadas-quios/", icon: "🍃" },
      { label: "Cerca de nosotros", href: "/es/playas-cerca-voulamandis-house/", icon: "📍" },
    ],
    villagesTitle: "Pueblos y Kambos",
    villages: [
      { label: "Pueblos de la mastiha", href: "/es/pueblos-del-mastiha-quios/", icon: "🌳" },
      { label: "Pueblos medievales", href: "/es/pueblos-medievales-quios/", icon: "🏰" },
      { label: "Kambos, Quíos", href: kamposChiosPaths.es, icon: "🍊" },
    ],
    planner: { label: "Planifica tu día", href: "/trip-planner/", icon: "🗺️" },
  },
  tr: {
    kicker: "Sakız Adası rehberi",
    title: "Sakız Adası'nı keşfedin",
    beachesTitle: "Sakız Adası plajları",
    beachesAllLabel: "Tümü",
    beachesAllHref: "/tr/sakiz-adasi-plajlari/",
    beaches: [
      { label: "Kumlu", href: "/tr/sakiz-adasi-kumlu-plajlar/", icon: "🏖️" },
      { label: "Düzenli", href: "/tr/sakiz-adasi-duzenli-plajlar/", icon: "⛱️" },
      { label: "Sakin", href: "/tr/sakiz-adasi-sakin-plajlar/", icon: "🌿" },
      { label: "Çocuklar için", href: "/tr/cocuklar-icin-sakiz-adasi-plajlari/", icon: "👨‍👩‍👧" },
      { label: "Korunaklı", href: "/tr/sakiz-adasi-korunakli-plajlar/", icon: "🍃" },
      { label: "Yakınımızda", href: "/tr/voulamandis-house-yakin-plajlar/", icon: "📍" },
    ],
    villagesTitle: "Köyler ve Kambos",
    villages: [
      { label: "Mastik köyleri", href: "/tr/sakiz-adasi-mastik-koyleri/", icon: "🌳" },
      { label: "Orta Çağ köyleri", href: "/tr/sakiz-adasi-orta-cag-koyleri/", icon: "🏰" },
      { label: "Kambos, Sakız Adası", href: kamposChiosPaths.tr, icon: "🍊" },
    ],
    planner: { label: "Gününüzü planlayın", href: "/trip-planner/", icon: "🗺️" },
  },
};

export function HeroChiosMenu({ locale }: { locale: LocaleCode }) {
  const c = copy[locale] ?? copy.en;

  return (
    <nav
      aria-label={c.title}
      className="hidden w-[300px] shrink-0 self-end rounded-[1.75rem] border border-white/20 bg-stone-950/40 p-5 text-white shadow-2xl shadow-black/30 backdrop-blur-md lg:block xl:w-[340px]"
    >
      <p className="text-[11px] font-black uppercase tracking-[0.2em] text-amber-200/90">{c.kicker}</p>
      <p className="mt-1 font-serif text-2xl font-bold leading-tight text-white">{c.title}</p>

      <div className="mt-4 flex items-baseline justify-between gap-3 border-t border-white/15 pt-4">
        <p className="text-xs font-black uppercase tracking-[0.14em] text-white/80">🌊 {c.beachesTitle}</p>
        <a
          href={c.beachesAllHref}
          className="shrink-0 rounded-full text-xs font-bold text-amber-200 underline decoration-amber-200/40 underline-offset-4 transition hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          {c.beachesAllLabel} →
        </a>
      </div>
      <ul className="mt-3 grid grid-cols-2 gap-2">
        {c.beaches.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              className="flex min-h-10 items-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-[13px] font-bold leading-tight text-white ring-1 ring-white/10 transition hover:bg-white/20 hover:ring-white/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <span aria-hidden="true">{link.icon}</span>
              <span className="min-w-0 break-words">{link.label}</span>
            </a>
          </li>
        ))}
      </ul>

      <p className="mt-4 border-t border-white/15 pt-4 text-xs font-black uppercase tracking-[0.14em] text-white/80">{c.villagesTitle}</p>
      <ul className="mt-2 space-y-1">
        {c.villages.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              className="group flex items-center gap-2.5 rounded-xl px-2 py-1.5 text-sm font-bold text-white transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <span aria-hidden="true">{link.icon}</span>
              <span className="min-w-0 flex-1 break-words">{link.label}</span>
              <span aria-hidden="true" className="text-white/50 transition group-hover:translate-x-0.5 group-hover:text-white">→</span>
            </a>
          </li>
        ))}
      </ul>

      <a
        href={c.planner.href}
        className="mt-4 flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#c9822f] px-4 py-2.5 text-center text-sm font-black text-white shadow-lg shadow-black/20 transition hover:bg-[#b37226] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        <span aria-hidden="true">{c.planner.icon}</span>
        {c.planner.label}
      </a>
    </nav>
  );
}
