import type { LanguageCode } from "@/lib/languages";
import { propertyFaqPaths } from "@/content/property-faq";
import { getFooterPopularGuides } from "@/content/footer-popular-guides";

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
    faq: string;
    chiosIslandGuide: string;
    beaches: string;
    villages: string;
    museums: string;
    holidayQuiz: string;
  };
};

const footerCopy: Record<LanguageCode, FooterCopy> = {
  en: { description: "Quiet rooms and apartments in the historic Kampos area of Chios, with easy access to Chios Town, the airport, beaches, villages and cultural landmarks.", bookStay: "Book", whatsapp: "WhatsApp", allRightsReserved: "All rights reserved.", groups: { stay: "Stay", exploreChios: "Explore Chios", popularGuides: "Popular Guides" }, links: { rooms: "Rooms", ratesAvailability: "Rates & Availability", contact: "Contact", faq: "Frequently Asked Questions", chiosIslandGuide: "Chios Island Guide", beaches: "Chios Beaches", villages: "Chios Villages", museums: "Chios Museums", holidayQuiz: "Chios Holiday Quiz" } },
  el: { description: "Ήσυχα δωμάτια και διαμερίσματα στον ιστορικό Κάμπο της Χίου, με εύκολη πρόσβαση στην πόλη, το αεροδρόμιο, τις παραλίες, τα χωριά και τα αξιοθέατα.", bookStay: "Κράτηση", whatsapp: "WhatsApp", allRightsReserved: "Με επιφύλαξη παντός δικαιώματος.", groups: { stay: "Διαμονή", exploreChios: "Ανακαλύψτε τη Χίο", popularGuides: "Δημοφιλείς οδηγοί" }, links: { rooms: "Δωμάτια", ratesAvailability: "Τιμές & Διαθεσιμότητα", contact: "Επικοινωνία", faq: "Συχνές Ερωτήσεις", chiosIslandGuide: "Οδηγός Χίου", beaches: "Παραλίες της Χίου", villages: "Χωριά της Χίου", museums: "Μουσεία της Χίου", holidayQuiz: "Quiz διακοπών στη Χίο" } },
  fr: { description: "Chambres et appartements calmes dans le quartier historique de Kampos à Chios, avec un accès facile à la ville, à l’aéroport, aux plages, aux villages et aux sites culturels.", bookStay: "Réserver", whatsapp: "WhatsApp", allRightsReserved: "Tous droits réservés.", groups: { stay: "Séjour", exploreChios: "Explorer Chios", popularGuides: "Guides populaires" }, links: { rooms: "Chambres", ratesAvailability: "Tarifs & Disponibilité", contact: "Contact", faq: "Questions fréquentes", chiosIslandGuide: "Guide de Chios", beaches: "Plages de Chios", villages: "Villages de Chios", museums: "Musées de Chios", holidayQuiz: "Quiz vacances à Chios" } },
  de: { description: "Ruhige Zimmer und Apartments im historischen Kampos-Gebiet von Chios, mit einfachem Zugang zur Stadt, zum Flughafen, zu Stränden, Dörfern und Sehenswürdigkeiten.", bookStay: "Buchen", whatsapp: "WhatsApp", allRightsReserved: "Alle Rechte vorbehalten.", groups: { stay: "Aufenthalt", exploreChios: "Chios entdecken", popularGuides: "Beliebte Reiseführer" }, links: { rooms: "Zimmer", ratesAvailability: "Preise & Verfügbarkeit", contact: "Kontakt", faq: "Häufige Fragen", chiosIslandGuide: "Chios Reiseführer", beaches: "Strände auf Chios", villages: "Dörfer auf Chios", museums: "Museen auf Chios", holidayQuiz: "Chios Urlaubsquiz" } },
  it: { description: "Camere e appartamenti tranquilli nella storica zona di Kampos a Chios, con facile accesso alla città, all’aeroporto, alle spiagge, ai villaggi e ai luoghi culturali.", bookStay: "Prenota", whatsapp: "WhatsApp", allRightsReserved: "Tutti i diritti riservati.", groups: { stay: "Soggiorno", exploreChios: "Esplora Chios", popularGuides: "Guide popolari" }, links: { rooms: "Camere", ratesAvailability: "Prezzi & Disponibilità", contact: "Contatti", faq: "Domande frequenti", chiosIslandGuide: "Guida di Chios", beaches: "Spiagge di Chios", villages: "Villaggi di Chios", museums: "Musei di Chios", holidayQuiz: "Quiz vacanze a Chios" } },
  es: { description: "Habitaciones y apartamentos tranquilos en la histórica zona de Kampos en Chios, con fácil acceso a la ciudad, al aeropuerto, a playas, pueblos y lugares culturales.", bookStay: "Reserva", whatsapp: "WhatsApp", allRightsReserved: "Todos los derechos reservados.", groups: { stay: "Estancia", exploreChios: "Explorar Chios", popularGuides: "Guías populares" }, links: { rooms: "Habitaciones", ratesAvailability: "Precios & Disponibilidad", contact: "Contacto", faq: "Preguntas frecuentes", chiosIslandGuide: "Guía de Chios", beaches: "Playas de Chios", villages: "Pueblos de Chios", museums: "Museos de Chios", holidayQuiz: "Quiz de vacaciones en Chios" } },
  tr: { description: "Sakız Adası’nın tarihi Kampos bölgesinde, şehir merkezine, havaalanına, plajlara, köylere ve kültürel noktalara kolay erişimli sakin odalar ve daireler.", bookStay: "Rezervasyon", whatsapp: "WhatsApp", allRightsReserved: "Tüm hakları saklıdır.", groups: { stay: "Konaklama", exploreChios: "Sakız Adası’nı keşfedin", popularGuides: "Popüler rehberler" }, links: { rooms: "Odalar", ratesAvailability: "Fiyatlar & Müsaitlik", contact: "İletişim", faq: "Sık Sorulan Sorular", chiosIslandGuide: "Sakız Adası Rehberi", beaches: "Sakız Adası Plajları", villages: "Sakız Adası Köyleri", museums: "Sakız Adası Müzeleri", holidayQuiz: "Sakız Adası Tatil Testi" } },
};

const roomsPaths: Record<LanguageCode, string> = { en: "/chios-rooms/", el: "/el/domatia-xios/", fr: "/fr/chambres-a-chios/", de: "/de/chios-zimmer/", it: "/it/camere-a-chios/", es: "/es/habitaciones-en-chios/", tr: "/tr/sakiz-adasi-odalari/" };
const ratesPaths: Record<LanguageCode, string> = { en: "/chios-hotels-rates/", el: "/el/amesi-kratisi-voulamandis-house/", fr: "/fr/tarifs-des-hotels-a-chios/", de: "/de/hotelpreise-auf-der-insel-chios/", it: "/it/prezzi-hotel-chios/", es: "/es/los-mejores-precios-de-hotel-en-la-isla-chios/", tr: "/tr/sakiz-adasi-rezervasyon/" };
const contactPaths: Record<LanguageCode, string> = { en: "/voulamandis-house-contact-us-form-fill-in-the-form/", el: "/el/epikoinonia-voulamandis-house/", fr: "/fr/contactez-nous/", de: "/de/kontaktieren-voulamandis-house/", it: "/it/contattaci-voulamandis-house/", es: "/es/contacta-con-voulamandis-house/", tr: "/tr/sakiz-adasi-otelleri-ile-iletisim/" };
const chiosPaths: Record<LanguageCode, string> = { en: "/chios-island/", el: "/el/ti-na-do-sti-xio/", fr: "/fr/chios-en-grece/", de: "/de/chios-insel/", it: "/it/chios-lisola-in-grecia/", es: "/es/chios-en-grecia/", tr: "/tr/sakiz-adasi/" };
const beachPaths: Record<LanguageCode, string> = { en: "/chios/chios-beaches/", el: "/el/paralies-xios/", fr: "/fr/plages-de-chios/", de: "/de/straende-chios/", it: "/it/spiagge-chios/", es: "/es/playas-chios/", tr: "/tr/sakiz-adasi-plajlari/" };
const villagePaths: Record<LanguageCode, string> = { en: "/chios/chios-villages/", el: "/el/xoria-xios/", fr: "/fr/villages-de-chios/", de: "/de/doerfer-chios/", it: "/it/villaggi-chios/", es: "/es/pueblos-chios/", tr: "/tr/sakiz-adasi-koyleri/" };
const museumPaths: Record<LanguageCode, string> = { en: "/chios/chios-museums/", el: "/el/mouseia-xios/", fr: "/fr/musees-de-chios/", de: "/de/museen-chios/", it: "/it/musei-chios/", es: "/es/museos-chios/", tr: "/tr/sakiz-adasi-muzeleri/" };
const quizPaths: Record<LanguageCode, string> = { en: "/chios-holidays-quiz/", el: "/el/diakopes-sti-chio-quiz/", fr: "/fr/quiz-vacances-a-chios/", de: "/de/chios-urlaubsquiz/", it: "/it/quiz-vacanze-a-chios/", es: "/es/quiz-vacaciones-en-quios/", tr: "/tr/sakiz-adasi-tatil-testi/" };

export function VoulamandisFooterTailwind({ language = "en" }: FooterProps) {
  const copy = footerCopy[language] || footerCopy.en;
  const year = new Date().getFullYear();
  const locationLabel = language === "tr" ? "Kambos, Sakız Adası" : language === "el" ? "Κάμπος, Χίος" : language === "fr" ? "Kambos, Chios" : language === "de" ? "Kambos, Chios" : language === "it" ? "Kambos, Chios" : language === "es" ? "Kambos, Quíos" : "Kampos, Chios";
  const footerTagline = language === "tr" ? "Sakız Adası odaları & daireleri · Doğrudan konaklama" : language === "el" ? "Δωμάτια & διαμερίσματα στη Χίο · Απευθείας διαμονή" : language === "fr" ? "Chambres & appartements à Chios · Réservation directe" : language === "de" ? "Zimmer & Apartments auf Chios · Direkt buchen" : language === "it" ? "Camere & appartamenti a Chios · Prenotazione diretta" : language === "es" ? "Habitaciones & apartamentos en Quíos · Reserva directa" : "Chios rooms & apartments · Direct stay";
  const footerNavLabel = language === "tr" ? "Alt bilgi menüsü" : language === "el" ? "Πλοήγηση υποσέλιδου" : language === "fr" ? "Navigation du pied de page" : language === "de" ? "Fußzeilennavigation" : language === "it" ? "Navigazione a piè di pagina" : language === "es" ? "Navegación del pie de página" : "Footer navigation";
  const groups = [
    { title: copy.groups.stay, links: [{ label: copy.links.rooms, href: roomsPaths[language] }, { label: copy.links.ratesAvailability, href: ratesPaths[language] }, { label: copy.links.faq, href: propertyFaqPaths[language] }, { label: copy.links.contact, href: contactPaths[language] }] },
    { title: copy.groups.exploreChios, links: [{ label: copy.links.chiosIslandGuide, href: chiosPaths[language] }, { label: copy.links.beaches, href: beachPaths[language] }, { label: copy.links.villages, href: villagePaths[language] }, { label: copy.links.museums, href: museumPaths[language] }, { label: copy.links.holidayQuiz, href: quizPaths[language] }] },
    { title: copy.groups.popularGuides, links: getFooterPopularGuides(language) },
  ];

  return (
    <footer className="relative overflow-hidden bg-stone-950 pb-24 text-white md:pb-0">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(168,120,66,.2),transparent_28rem),radial-gradient(circle_at_85%_30%,rgba(255,255,255,.08),transparent_24rem)]" />
      <div className="relative mx-auto max-w-7xl px-3 py-3 sm:px-6 sm:py-6 lg:px-8 lg:py-10">
        <div className="overflow-hidden rounded-[1.4rem] border border-white/10 bg-white/[0.045] shadow-xl shadow-black/15 backdrop-blur md:rounded-[1.75rem]">
          <section className="flex items-center justify-between gap-3 border-b border-white/10 px-3 py-2.5 sm:px-5 sm:py-4 md:px-6 md:py-5">
            <a href={language === "en" ? "/" : `/${language}/`} className="flex min-w-0 items-center gap-2.5 sm:gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-xs font-black text-stone-900 shadow-md shadow-black/15 sm:h-11 sm:w-11 sm:rounded-2xl sm:text-sm">VH</span>
              <span className="min-w-0">
                <strong className="block truncate text-[18px] font-black leading-none tracking-[-0.04em] text-white sm:text-lg md:text-xl">Voulamandis House</strong>
                <small className="mt-1 block truncate text-[11px] font-black uppercase tracking-[0.08em] text-white/60 sm:text-[11px]">{locationLabel}</small>
              </span>
            </a>
            <p className="hidden max-w-xl text-right text-sm leading-6 text-white/60 md:block">{copy.description}</p>
          </section>

          <nav aria-label={footerNavLabel} className="grid grid-cols-3 divide-x divide-white/10">
            {groups.map((group) => (
              <section key={group.title} className="min-w-0 px-1 py-2.5 sm:px-4 sm:py-5 md:px-6 md:py-6">
                <h2 className="min-h-[2rem] break-words text-[12px] font-black uppercase leading-[1.2] tracking-[0.035em] text-amber-200 sm:min-h-0 sm:text-[12px] sm:tracking-[0.1em] md:text-sm">{group.title}</h2>
                <ul className="mt-1 grid gap-0 sm:mt-4 sm:gap-1.5 md:gap-2">
                  {group.links.map((link) => (
                    <li key={`${group.title}-${link.href}`} className="min-w-0">
                      <a href={link.href} className="group flex min-h-8 min-w-0 items-center justify-between gap-1 rounded-lg px-1 py-1 text-[14px] font-bold leading-[1.25] text-white/82 transition hover:bg-white/[0.07] hover:text-white sm:rounded-xl sm:px-2 sm:text-sm md:min-h-10 md:text-sm">
                        <span className="min-w-0 break-words [overflow-wrap:anywhere]">{link.label}</span>
                        <span aria-hidden="true" className="hidden shrink-0 text-white/35 transition group-hover:translate-x-0.5 group-hover:text-amber-200 sm:inline">→</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </nav>

          <div className="flex items-end justify-between gap-3 border-t border-white/10 px-3 py-2.5 sm:items-center sm:px-5 sm:py-4 md:px-6">
            <div className="min-w-0 text-[11px] font-bold uppercase leading-[1.45] tracking-[0.04em] text-white/50 sm:text-[11px] sm:tracking-[0.09em] md:text-xs">
              <p>© {year} Voulamandis House. {copy.allRightsReserved}</p>
              <p className="mt-0.5 text-white/36">{footerTagline}</p>
            </div>
            <div className="flex shrink-0 items-center gap-1.5">
              <a href="https://www.instagram.com/chioshotels/" target="_blank" rel="noopener" aria-label="Instagram" className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/12 bg-white/[0.06] text-xs font-black text-white/70 transition hover:bg-white/12 hover:text-white">◎</a>
              <a href="https://www.facebook.com/people/Voulamandis-House/100063584320703/" target="_blank" rel="noopener" aria-label="Facebook" className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/12 bg-white/[0.06] text-xs font-black text-white/70 transition hover:bg-white/12 hover:text-white">f</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
