import type { LanguageCode } from "@/lib/languages";

type FooterProps = {
  language?: LanguageCode;
};

type FooterCopy = {
  description: string;
  bookStay: string;
  whatsapp: string;
  allRightsReserved: string;
  groups: {
    stay: string;
    exploreChios: string;
    popularGuides: string;
  };
  links: {
    rooms: string;
    ratesAvailability: string;
    contact: string;
    chiosIslandGuide: string;
    beaches: string;
    villages: string;
    museums: string;
    holidayQuiz: string;
    agiaDynami: string;
    mavraVolia: string;
    pyrgi: string;
    mesta: string;
    masticMuseum: string;
  };
};

const footerCopy: Record<LanguageCode, FooterCopy> = {
  en: { description: "Quiet rooms and apartments in the historic Kampos area of Chios, with easy access to Chios Town, the airport, beaches, villages and cultural landmarks.", bookStay: "Book", whatsapp: "WhatsApp", allRightsReserved: "All rights reserved.", groups: { stay: "Stay", exploreChios: "Explore Chios", popularGuides: "Popular Guides" }, links: { rooms: "Rooms", ratesAvailability: "Rates & Availability", contact: "Contact", chiosIslandGuide: "Chios Island Guide", beaches: "Chios Beaches", villages: "Chios Villages", museums: "Chios Museums", holidayQuiz: "Chios Holiday Quiz", agiaDynami: "Agia Dynami Beach", mavraVolia: "Mavra Volia Beach", pyrgi: "Pyrgi Village", mesta: "Mesta Village", masticMuseum: "Chios Mastic Museum" } },
  el: { description: "Ήσυχα δωμάτια και διαμερίσματα στον ιστορικό Κάμπο της Χίου, με εύκολη πρόσβαση στην πόλη, το αεροδρόμιο, τις παραλίες, τα χωριά και τα αξιοθέατα.", bookStay: "Κράτηση", whatsapp: "WhatsApp", allRightsReserved: "Με επιφύλαξη παντός δικαιώματος.", groups: { stay: "Διαμονή", exploreChios: "Ανακαλύψτε τη Χίο", popularGuides: "Δημοφιλείς οδηγοί" }, links: { rooms: "Δωμάτια", ratesAvailability: "Τιμές & Διαθεσιμότητα", contact: "Επικοινωνία", chiosIslandGuide: "Οδηγός Χίου", beaches: "Παραλίες της Χίου", villages: "Χωριά της Χίου", museums: "Μουσεία της Χίου", holidayQuiz: "Quiz διακοπών στη Χίο", agiaDynami: "Παραλία Αγία Δύναμη", mavraVolia: "Παραλία Μαύρα Βόλια", pyrgi: "Χωριό Πυργί", mesta: "Χωριό Μεστά", masticMuseum: "Μουσείο Μαστίχας Χίου" } },
  fr: { description: "Chambres et appartements calmes dans le quartier historique de Kampos à Chios, avec un accès facile à la ville, à l’aéroport, aux plages, aux villages et aux sites culturels.", bookStay: "Réserver", whatsapp: "WhatsApp", allRightsReserved: "Tous droits réservés.", groups: { stay: "Séjour", exploreChios: "Explorer Chios", popularGuides: "Guides populaires" }, links: { rooms: "Chambres", ratesAvailability: "Tarifs & Disponibilité", contact: "Contact", chiosIslandGuide: "Guide de Chios", beaches: "Plages de Chios", villages: "Villages de Chios", museums: "Musées de Chios", holidayQuiz: "Quiz vacances à Chios", agiaDynami: "Plage d’Agia Dynami", mavraVolia: "Plage de Mavra Volia", pyrgi: "Village de Pyrgi", mesta: "Village de Mesta", masticMuseum: "Musée du Mastic de Chios" } },
  de: { description: "Ruhige Zimmer und Apartments im historischen Kampos-Gebiet von Chios, mit einfachem Zugang zur Stadt, zum Flughafen, zu Stränden, Dörfern und Sehenswürdigkeiten.", bookStay: "Buchen", whatsapp: "WhatsApp", allRightsReserved: "Alle Rechte vorbehalten.", groups: { stay: "Aufenthalt", exploreChios: "Chios entdecken", popularGuides: "Beliebte Reiseführer" }, links: { rooms: "Zimmer", ratesAvailability: "Preise & Verfügbarkeit", contact: "Kontakt", chiosIslandGuide: "Chios Reiseführer", beaches: "Strände auf Chios", villages: "Dörfer auf Chios", museums: "Museen auf Chios", holidayQuiz: "Chios Urlaubsquiz", agiaDynami: "Agia Dynami Strand", mavraVolia: "Mavra Volia Strand", pyrgi: "Pyrgi Dorf", mesta: "Mesta Dorf", masticMuseum: "Chios Mastix Museum" } },
  it: { description: "Camere e appartamenti tranquilli nella storica zona di Kampos a Chios, con facile accesso alla città, all’aeroporto, alle spiagge, ai villaggi e ai luoghi culturali.", bookStay: "Prenota", whatsapp: "WhatsApp", allRightsReserved: "Tutti i diritti riservati.", groups: { stay: "Soggiorno", exploreChios: "Esplora Chios", popularGuides: "Guide popolari" }, links: { rooms: "Camere", ratesAvailability: "Prezzi & Disponibilità", contact: "Contatti", chiosIslandGuide: "Guida di Chios", beaches: "Spiagge di Chios", villages: "Villaggi di Chios", museums: "Musei di Chios", holidayQuiz: "Quiz vacanze a Chios", agiaDynami: "Spiaggia di Agia Dynami", mavraVolia: "Spiaggia di Mavra Volia", pyrgi: "Villaggio di Pyrgi", mesta: "Villaggio di Mesta", masticMuseum: "Museo del Mastice di Chios" } },
  es: { description: "Habitaciones y apartamentos tranquilos en la histórica zona de Kampos en Chios, con fácil acceso a la ciudad, al aeropuerto, a playas, pueblos y lugares culturales.", bookStay: "Reserva", whatsapp: "WhatsApp", allRightsReserved: "Todos los derechos reservados.", groups: { stay: "Estancia", exploreChios: "Explorar Chios", popularGuides: "Guías populares" }, links: { rooms: "Habitaciones", ratesAvailability: "Precios & Disponibilidad", contact: "Contacto", chiosIslandGuide: "Guía de Chios", beaches: "Playas de Chios", villages: "Pueblos de Chios", museums: "Museos de Chios", holidayQuiz: "Quiz de vacaciones en Chios", agiaDynami: "Playa Agia Dynami", mavraVolia: "Playa Mavra Volia", pyrgi: "Pueblo de Pyrgi", mesta: "Pueblo de Mesta", masticMuseum: "Museo del Mastiha de Chios" } },
  tr: { description: "Sakız Adası’nın tarihi Kampos bölgesinde, şehir merkezine, havaalanına, plajlara, köylere ve kültürel noktalara kolay erişimli sakin odalar ve daireler.", bookStay: "Rezervasyon", whatsapp: "WhatsApp", allRightsReserved: "Tüm hakları saklıdır.", groups: { stay: "Konaklama", exploreChios: "Sakız Adası’nı keşfedin", popularGuides: "Popüler rehberler" }, links: { rooms: "Odalar", ratesAvailability: "Fiyatlar & Müsaitlik", contact: "İletişim", chiosIslandGuide: "Sakız Adası Rehberi", beaches: "Sakız Adası Plajları", villages: "Sakız Adası Köyleri", museums: "Sakız Adası Müzeleri", holidayQuiz: "Sakız Adası Tatil Testi", agiaDynami: "Agia Dynami Plajı", mavraVolia: "Mavra Volia Plajı", pyrgi: "Pyrgi Köyü", mesta: "Mesta Köyü", masticMuseum: "Sakız Adası Mastik Müzesi" } },
};

const roomsPaths: Record<LanguageCode, string> = { en: "/chios-rooms/", el: "/el/domatia-xios/", fr: "/fr/chambres-a-chios/", de: "/de/chios-zimmer/", it: "/it/camere-a-chios/", es: "/es/habitaciones-en-chios/", tr: "/tr/sakiz-adasi-odalari/" };
const ratesPaths: Record<LanguageCode, string> = { en: "/chios-hotels-rates/", el: "/el/amesi-kratisi-voulamandis-house/", fr: "/fr/tarifs-des-hotels-a-chios/", de: "/de/hotelpreise-auf-der-insel-chios/", it: "/it/prezzi-hotel-chios/", es: "/es/los-mejores-precios-de-hotel-en-la-isla-chios/", tr: "/tr/sakiz-adasi-rezervasyon/" };
const contactPaths: Record<LanguageCode, string> = { en: "/voulamandis-house-contact-us-form-fill-in-the-form/", el: "/el/epikoinonia-voulamandis-house/", fr: "/fr/contactez-nous/", de: "/de/kontaktieren-voulamandis-house/", it: "/it/contattaci-voulamandis-house/", es: "/es/contacta-con-voulamandis-house/", tr: "/tr/sakiz-adasi-otelleri-ile-iletisim/" };
const chiosPaths: Record<LanguageCode, string> = { en: "/chios-island/", el: "/el/ti-na-do-sti-xio/", fr: "/fr/chios-en-grece/", de: "/de/chios-insel/", it: "/it/chios-lisola-in-grecia/", es: "/es/chios-en-grecia/", tr: "/tr/sakiz-adasi/" };
const beachPaths: Record<LanguageCode, string> = { en: "/chios/chios-beaches/", el: "/el/paralies-xios/", fr: "/fr/plages-de-chios/", de: "/de/straende-chios/", it: "/it/spiagge-chios/", es: "/es/playas-chios/", tr: "/tr/sakiz-adasi-plajlari/" };
const villagePaths: Record<LanguageCode, string> = { en: "/chios/chios-villages/", el: "/el/xoria-xios/", fr: "/fr/villages-de-chios/", de: "/de/doerfer-chios/", it: "/it/villaggi-chios/", es: "/es/pueblos-chios/", tr: "/tr/sakiz-adasi-koyleri/" };
const museumPaths: Record<LanguageCode, string> = { en: "/chios/chios-museums/", el: "/el/mouseia-xios/", fr: "/fr/musees-de-chios/", de: "/de/museen-chios/", it: "/it/musei-chios/", es: "/es/museos-chios/", tr: "/tr/sakiz-adasi-muzeleri/" };
const quizPaths: Record<LanguageCode, string> = { en: "/chios-holidays-quiz/", el: "/el/diakopes-sti-chio-quiz/", fr: "/fr/quiz-vacances-a-chios/", de: "/de/chios-urlaubsquiz/", it: "/it/quiz-vacanze-a-chios/", es: "/es/quiz-vacaciones-en-quios/", tr: "/tr/sakiz-adasi-tatil-testi/" };
const agiaDynamiPaths: Record<LanguageCode, string> = { en: "/chios/chios-beaches/agia-dynami-beach-chios/", el: "/el/paralies-xios/paralia-agia-dynami/", fr: "/fr/plages-de-chios/plage-agia-dynami/", de: "/de/straende-chios/agia-dynami-strand/", it: "/it/spiagge-chios/spiaggia-agia-dynami/", es: "/es/playas-chios/playa-agia-dynami/", tr: "/tr/sakiz-adasi-plajlari/agia-dynami-plaji/" };
const mavraVoliaPaths: Record<LanguageCode, string> = { en: "/chios/chios-beaches/emporios-beach/", el: "/el/paralies-xios/paralia-mavra-volia/", fr: "/fr/plages-de-chios/plage-mavra-volia/", de: "/de/straende-chios/mavra-volia-strand/", it: "/it/spiagge-chios/spiaggia-mavra-volia/", es: "/es/playas-chios/playa-mavra-volia/", tr: "/tr/sakiz-adasi-plajlari/mavra-volia-plaji/" };
const pyrgiPaths: Record<LanguageCode, string> = { en: "/chios/chios-villages/chios-pyrgi/", el: "/el/xoria-xios/pyrgi-xios/", fr: "/fr/villages-de-chios/village-pyrgi/", de: "/de/doerfer-chios/pyrgi-dorf/", it: "/it/villaggi-chios/villaggio-pyrgi/", es: "/es/pueblos-chios/pueblo-pyrgi/", tr: "/tr/sakiz-adasi-koyleri/pyrgi-koyu/" };
const mestaPaths: Record<LanguageCode, string> = { en: "/chios/chios-villages/mesta-chios/", el: "/el/xoria-xios/mesta-xios/", fr: "/fr/villages-de-chios/village-mesta/", de: "/de/doerfer-chios/mesta-dorf/", it: "/it/villaggi-chios/villaggio-mesta/", es: "/es/pueblos-chios/pueblo-mesta/", tr: "/tr/sakiz-adasi-koyleri/mesta-koyu/" };
const masticMuseumPaths: Record<LanguageCode, string> = { en: "/chios/chios-museums/the-mastic-museum-chios/", el: "/el/mouseia-xios/mouseio-mastichas-xios/", fr: "/fr/musees-de-chios/musee-du-mastic-chios/", de: "/de/museen-chios/mastix-museum-chios/", it: "/it/musei-chios/museo-del-mastice-chios/", es: "/es/museos-chios/museo-mastiha-chios/", tr: "/tr/sakiz-adasi-muzeleri/sakiz-mastik-muzesi/" };

export function VoulamandisFooterTailwind({ language = "en" }: FooterProps) {
  const copy = footerCopy[language] || footerCopy.en;
  const year = new Date().getFullYear();
  const groups = [
    { title: copy.groups.stay, links: [{ label: copy.links.rooms, href: roomsPaths[language] }, { label: copy.links.ratesAvailability, href: ratesPaths[language] }, { label: copy.links.contact, href: contactPaths[language] }] },
    { title: copy.groups.exploreChios, links: [{ label: copy.links.chiosIslandGuide, href: chiosPaths[language] }, { label: copy.links.beaches, href: beachPaths[language] }, { label: copy.links.villages, href: villagePaths[language] }, { label: copy.links.museums, href: museumPaths[language] }, { label: copy.links.holidayQuiz, href: quizPaths[language] }] },
    { title: copy.groups.popularGuides, links: [{ label: copy.links.agiaDynami, href: agiaDynamiPaths[language] }, { label: copy.links.mavraVolia, href: mavraVoliaPaths[language] }, { label: copy.links.pyrgi, href: pyrgiPaths[language] }, { label: copy.links.mesta, href: mestaPaths[language] }, { label: copy.links.masticMuseum, href: masticMuseumPaths[language] }] },
  ];

  return (
    <footer className="relative overflow-hidden bg-stone-950 pb-24 text-white md:pb-0">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(168,120,66,.2),transparent_28rem),radial-gradient(circle_at_85%_30%,rgba(255,255,255,.08),transparent_24rem)]" />
      <div className="relative mx-auto grid max-w-7xl gap-4 px-4 py-7 sm:px-6 md:gap-10 md:py-14 lg:grid-cols-[0.92fr_1.65fr] lg:px-8 lg:py-20">
        <section className="rounded-[1.5rem] border border-white/10 bg-white/[0.06] p-4 shadow-xl shadow-black/15 backdrop-blur md:rounded-[2rem] md:p-8 md:shadow-2xl">
          <a href={language === "en" ? "/" : `/${language}/`} className="flex items-center gap-3 md:gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-sm font-black text-stone-900 shadow-lg shadow-black/20 md:h-14 md:w-14 md:text-lg">VH</span>
            <span className="min-w-0"><strong className="block truncate text-xl font-black leading-none tracking-[-0.055em] text-white md:text-2xl">Voulamandis House</strong><small className="mt-1 block text-[10px] font-black uppercase tracking-[0.16em] text-white/50 md:mt-2 md:text-xs">Kampos, Chios</small></span>
          </a>
          <p className="mt-4 text-sm leading-6 text-white/70 md:mt-6 md:max-w-xl md:text-base md:leading-8">{copy.description}</p>
          <div className="mt-4 grid grid-cols-2 gap-2 md:mt-7 md:grid-cols-2 lg:flex lg:flex-wrap">
            <a href={ratesPaths[language]} aria-label={copy.bookStay} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-white px-3 text-[11px] font-black uppercase tracking-[0.08em] !text-stone-900 shadow-lg shadow-black/10 lg:px-5"><span aria-hidden="true">📅</span><span>{copy.bookStay}</span></a>
            <a href="https://wa.me/306944474226" target="_blank" rel="noopener" aria-label={copy.whatsapp} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#25D366] px-3 text-[11px] font-black uppercase tracking-[0.08em] text-white shadow-lg shadow-[#25D366]/25 transition hover:bg-[#1ebe5d] lg:px-5"><span aria-hidden="true">💬</span><span>{copy.whatsapp}</span></a>
            <a href="https://www.instagram.com/chioshotels/" target="_blank" rel="noopener" aria-label="Instagram" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 text-[11px] font-black uppercase tracking-[0.08em] text-white lg:px-5"><span aria-hidden="true">◎</span><span>Instagram</span></a>
            <a href="https://www.facebook.com/people/Voulamandis-House/100063584320703/" target="_blank" rel="noopener" aria-label="Facebook" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 text-[11px] font-black uppercase tracking-[0.08em] text-white lg:px-5"><span aria-hidden="true">f</span><span>Facebook</span></a>
          </div>
        </section>
        <nav aria-label="Footer navigation" className="grid gap-3 md:gap-4 sm:grid-cols-3">
          {groups.map((group) => (
            <section key={group.title} className="rounded-[1.35rem] border border-white/10 bg-white/[0.045] p-3 backdrop-blur md:rounded-[1.75rem] md:p-5">
              <h2 className="text-[11px] font-black uppercase tracking-[0.16em] text-amber-200 md:text-sm">{group.title}</h2>
              <ul className="mt-3 grid grid-cols-1 gap-1.5 md:mt-5 md:gap-3">
                {group.links.map((link) => <li key={`${group.title}-${link.href}`}><a href={link.href} className="group flex min-h-9 items-center justify-between rounded-2xl bg-white/[0.04] px-3 py-2 text-[12px] font-bold text-white/75 ring-1 ring-white/5 transition hover:bg-white/10 hover:text-white md:bg-transparent md:text-sm md:ring-0"><span className="truncate">{link.label}</span><span className="hidden opacity-0 transition group-hover:translate-x-1 group-hover:opacity-100 md:inline">→</span></a></li>)}
              </ul>
            </section>
          ))}
        </nav>
      </div>
      <div className="relative border-t border-white/10 px-4 py-4 md:py-5"><div className="mx-auto flex max-w-7xl flex-col gap-2 text-[10px] font-bold uppercase tracking-[0.1em] text-white/42 sm:flex-row sm:items-center sm:justify-between md:text-xs md:tracking-[0.12em]"><p>© {year} Voulamandis House. {copy.allRightsReserved}</p><p>Chios rooms & apartments · Direct stay</p></div></div>
    </footer>
  );
}
