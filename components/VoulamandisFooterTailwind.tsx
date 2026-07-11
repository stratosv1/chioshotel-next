import type { LanguageCode } from "@/lib/languages";
import { getRoutesByItemId } from "@/lib/url-map";

type FooterProps = {
  language?: LanguageCode;
};

type FooterCopy = {
  description: string;
  book: string;
  whatsapp: string;
  stay: string;
  explore: string;
  guides: string;
  rights: string;
  links: {
    rooms: string;
    findRoom: string;
    deals: string;
    contact: string;
    chios: string;
    beaches: string;
    villages: string;
    museums: string;
    activities: string;
    quiz: string;
  };
};

const copyByLanguage: Record<LanguageCode, FooterCopy> = {
  en: {
    description: "Quiet rooms and apartments in the historic Kampos area of Chios, close to Chios Town, beaches, villages and local culture.",
    book: "Book your stay",
    whatsapp: "WhatsApp",
    stay: "Stay",
    explore: "Explore Chios",
    guides: "Useful links",
    rights: "All rights reserved.",
    links: { rooms: "Rooms", findRoom: "Find your room", deals: "Deals", contact: "Contact", chios: "Chios Island", beaches: "Beaches", villages: "Villages", museums: "Museums", activities: "Activities", quiz: "Holiday quiz" },
  },
  el: {
    description: "Ήσυχα δωμάτια και διαμερίσματα στον ιστορικό Κάμπο της Χίου, κοντά στην πόλη, τις παραλίες, τα χωριά και τον τοπικό πολιτισμό.",
    book: "Κάντε κράτηση",
    whatsapp: "WhatsApp",
    stay: "Διαμονή",
    explore: "Ανακαλύψτε τη Χίο",
    guides: "Χρήσιμοι σύνδεσμοι",
    rights: "Με επιφύλαξη παντός δικαιώματος.",
    links: { rooms: "Δωμάτια", findRoom: "Βρες δωμάτιο", deals: "Προσφορές", contact: "Επικοινωνία", chios: "Χίος", beaches: "Παραλίες", villages: "Χωριά", museums: "Μουσεία", activities: "Δραστηριότητες", quiz: "Quiz διακοπών" },
  },
  fr: {
    description: "Chambres et appartements calmes dans le Kampos historique de Chios, près de la ville, des plages, des villages et de la culture locale.",
    book: "Réserver",
    whatsapp: "WhatsApp",
    stay: "Séjour",
    explore: "Explorer Chios",
    guides: "Liens utiles",
    rights: "Tous droits réservés.",
    links: { rooms: "Chambres", findRoom: "Trouver une chambre", deals: "Offres", contact: "Contact", chios: "Île de Chios", beaches: "Plages", villages: "Villages", museums: "Musées", activities: "Activités", quiz: "Quiz vacances" },
  },
  de: {
    description: "Ruhige Zimmer und Apartments im historischen Kampos von Chios, nahe Stadt, Stränden, Dörfern und lokaler Kultur.",
    book: "Buchen",
    whatsapp: "WhatsApp",
    stay: "Aufenthalt",
    explore: "Chios entdecken",
    guides: "Nützliche Links",
    rights: "Alle Rechte vorbehalten.",
    links: { rooms: "Zimmer", findRoom: "Zimmer finden", deals: "Angebote", contact: "Kontakt", chios: "Insel Chios", beaches: "Strände", villages: "Dörfer", museums: "Museen", activities: "Aktivitäten", quiz: "Urlaubsquiz" },
  },
  it: {
    description: "Camere e appartamenti tranquilli nello storico Kampos di Chios, vicino a città, spiagge, villaggi e cultura locale.",
    book: "Prenota",
    whatsapp: "WhatsApp",
    stay: "Soggiorno",
    explore: "Esplora Chios",
    guides: "Link utili",
    rights: "Tutti i diritti riservati.",
    links: { rooms: "Camere", findRoom: "Trova camera", deals: "Offerte", contact: "Contatti", chios: "Isola di Chios", beaches: "Spiagge", villages: "Villaggi", museums: "Musei", activities: "Attività", quiz: "Quiz vacanze" },
  },
  es: {
    description: "Habitaciones y apartamentos tranquilos en el histórico Kampos de Chios, cerca de la ciudad, playas, pueblos y cultura local.",
    book: "Reservar",
    whatsapp: "WhatsApp",
    stay: "Estancia",
    explore: "Explorar Chios",
    guides: "Enlaces útiles",
    rights: "Todos los derechos reservados.",
    links: { rooms: "Habitaciones", findRoom: "Encuentra habitación", deals: "Ofertas", contact: "Contacto", chios: "Isla de Chios", beaches: "Playas", villages: "Pueblos", museums: "Museos", activities: "Actividades", quiz: "Quiz vacaciones" },
  },
  tr: {
    description: "Sakız Adası’nın tarihi Kampos bölgesinde, şehir, plajlar, köyler ve yerel kültüre yakın sakin odalar ve daireler.",
    book: "Rezervasyon",
    whatsapp: "WhatsApp",
    stay: "Konaklama",
    explore: "Sakız’ı keşfet",
    guides: "Faydalı bağlantılar",
    rights: "Tüm hakları saklıdır.",
    links: { rooms: "Odalar", findRoom: "Odanı bul", deals: "Fırsatlar", contact: "İletişim", chios: "Sakız Adası", beaches: "Plajlar", villages: "Köyler", museums: "Müzeler", activities: "Aktiviteler", quiz: "Tatil testi" },
  },
};

const routeIds = {
  home: "home",
  rooms: "rooms-category",
  findRoom: "find-your-room",
  deals: "deals",
  contact: "contact",
  chios: "chios-index",
  beaches: "beaches-index",
  villages: "villages-index",
  museums: "museums-index",
  activities: "chios-activities-hub",
  quiz: "quiz",
} as const;

function pathFor(itemId: string, language: LanguageCode) {
  return (
    getRoutesByItemId(itemId).find(
      (route) => route.language === language && route.action === "KEEP",
    )?.path || "/"
  );
}

export function VoulamandisFooterTailwind({ language = "en" }: FooterProps) {
  const copy = copyByLanguage[language] || copyByLanguage.en;
  const year = new Date().getFullYear();

  const groups = [
    {
      title: copy.stay,
      links: [
        { label: copy.links.rooms, href: pathFor(routeIds.rooms, language) },
        { label: copy.links.findRoom, href: pathFor(routeIds.findRoom, language) },
        { label: copy.links.deals, href: pathFor(routeIds.deals, language) },
        { label: copy.links.contact, href: pathFor(routeIds.contact, language) },
      ],
    },
    {
      title: copy.explore,
      links: [
        { label: copy.links.chios, href: pathFor(routeIds.chios, language) },
        { label: copy.links.beaches, href: pathFor(routeIds.beaches, language) },
        { label: copy.links.villages, href: pathFor(routeIds.villages, language) },
        { label: copy.links.museums, href: pathFor(routeIds.museums, language) },
        { label: copy.links.activities, href: pathFor(routeIds.activities, language) },
      ],
    },
    {
      title: copy.guides,
      links: [
        { label: copy.links.quiz, href: pathFor(routeIds.quiz, language) },
        { label: "Sitemap", href: "/sitemap.xml" },
        { label: "Robots", href: "/robots.txt" },
      ],
    },
  ];

  return (
    <footer className="relative overflow-hidden bg-stone-950 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(168,120,66,.22),transparent_32rem),radial-gradient(circle_at_85%_30%,rgba(255,255,255,.08),transparent_26rem)]" />
      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.05fr_1.5fr] lg:px-8 lg:py-20">
        <section className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 shadow-2xl shadow-black/20 backdrop-blur md:p-8">
          <a href={pathFor(routeIds.home, language)} className="flex items-center gap-4">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-lg font-black text-stone-900 shadow-lg shadow-black/20">VH</span>
            <span>
              <strong className="block text-2xl font-black leading-none tracking-[-0.055em] text-white">Voulamandis House</strong>
              <small className="mt-2 block text-xs font-black uppercase tracking-[0.18em] text-white/50">Kampos, Chios</small>
            </span>
          </a>

          <p className="mt-6 max-w-xl text-sm leading-7 text-white/70 md:text-base md:leading-8">{copy.description}</p>

          <div className="mt-7 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
            <a href={pathFor(routeIds.findRoom, language)} className="inline-flex min-h-11 items-center justify-center rounded-full bg-white px-4 text-[11px] font-black uppercase tracking-[0.1em] text-stone-900 shadow-lg shadow-black/10 sm:px-5">
              {copy.book}
            </a>
            <a href="https://wa.me/306944474226" target="_blank" rel="noopener" className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/15 bg-white/10 px-4 text-[11px] font-black uppercase tracking-[0.1em] text-white sm:px-5">
              {copy.whatsapp}
            </a>
            <a href="https://www.instagram.com/chioshotels/" target="_blank" rel="noopener" className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/15 bg-white/10 px-4 text-[11px] font-black uppercase tracking-[0.1em] text-white sm:px-5">
              Instagram
            </a>
            <a href="https://www.facebook.com/people/Voulamandis-House/100063584320703/" target="_blank" rel="noopener" className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/15 bg-white/10 px-4 text-[11px] font-black uppercase tracking-[0.1em] text-white sm:px-5">
              Facebook
            </a>
          </div>
        </section>

        <nav aria-label="Footer navigation" className="grid gap-4 sm:grid-cols-3">
          {groups.map((group) => (
            <section key={group.title} className="rounded-[1.75rem] border border-white/10 bg-white/[0.045] p-5 backdrop-blur">
              <h2 className="text-sm font-black uppercase tracking-[0.16em] text-amber-200">{group.title}</h2>
              <ul className="mt-5 grid gap-3">
                {group.links.map((link) => (
                  <li key={`${group.title}-${link.href}`}>
                    <a href={link.href} className="group flex items-center justify-between rounded-2xl px-3 py-2 text-sm font-bold text-white/72 transition hover:bg-white/10 hover:text-white">
                      <span>{link.label}</span>
                      <span className="opacity-0 transition group-hover:translate-x-1 group-hover:opacity-100">→</span>
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </nav>
      </div>

      <div className="relative border-t border-white/10 px-4 py-5">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 text-xs font-bold uppercase tracking-[0.12em] text-white/42 sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} Voulamandis House. {copy.rights}</p>
          <p>Chios rooms & apartments · Direct stay</p>
        </div>
      </div>
    </footer>
  );
}
