import Image from "next/image";
import type { LanguageCode } from "@/lib/languages";
import { businessData } from "@/lib/structured-data";
import { propertyFaqPaths } from "@/content/property-faq";
import { getFooterPopularGuides } from "@/content/footer-popular-guides";
import { agentRoomGuidePaths } from "@/content/agent-room-guide";
import { getSiteNavigationPath } from "@/lib/site-navigation";

type FooterProps = {
  language?: LanguageCode;
};

type FooterCopy = {
  description: string;
  allRightsReserved: string;
  groups: {
    stay: string;
    exploreChios: string;
    popularGuides: string;
  };
  links: {
    rooms: string;
    travelAgents: string;
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
  en: { description: "Quiet rooms and apartments in the historic Kampos area of Chios, with easy access to Chios Town, the airport, beaches, villages and cultural landmarks.", allRightsReserved: "All rights reserved.", groups: { stay: "Stay", exploreChios: "Explore Chios", popularGuides: "Popular Guides" }, links: { rooms: "Rooms", travelAgents: "Travel Agents · B2B", ratesAvailability: "Rates & Availability", contact: "Contact", faq: "Frequently Asked Questions", chiosIslandGuide: "Chios Island Guide", beaches: "Chios Beaches", villages: "Chios Villages", museums: "Chios Museums", holidayQuiz: "Chios Holiday Quiz" } },
  el: { description: "Ήσυχα δωμάτια και διαμερίσματα στον ιστορικό Κάμπο της Χίου, με εύκολη πρόσβαση στην πόλη, το αεροδρόμιο, τις παραλίες, τα χωριά και τα αξιοθέατα.", allRightsReserved: "Με επιφύλαξη παντός δικαιώματος.", groups: { stay: "Διαμονή", exploreChios: "Ανακαλύψτε τη Χίο", popularGuides: "Δημοφιλείς οδηγοί" }, links: { rooms: "Δωμάτια", travelAgents: "Τουριστικοί Πράκτορες · B2B", ratesAvailability: "Τιμές & Διαθεσιμότητα", contact: "Επικοινωνία", faq: "Συχνές Ερωτήσεις", chiosIslandGuide: "Οδηγός Χίου", beaches: "Παραλίες της Χίου", villages: "Χωριά της Χίου", museums: "Μουσεία της Χίου", holidayQuiz: "Quiz διακοπών στη Χίο" } },
  fr: { description: "Chambres et appartements calmes dans le quartier historique de Kampos à Chios, avec un accès facile à la ville, à l’aéroport, aux plages, aux villages et aux sites culturels.", allRightsReserved: "Tous droits réservés.", groups: { stay: "Séjour", exploreChios: "Explorer Chios", popularGuides: "Guides populaires" }, links: { rooms: "Chambres", travelAgents: "Agences de voyage · B2B", ratesAvailability: "Tarifs & Disponibilité", contact: "Contact", faq: "Questions fréquentes", chiosIslandGuide: "Guide de Chios", beaches: "Plages de Chios", villages: "Villages de Chios", museums: "Musées de Chios", holidayQuiz: "Quiz vacances à Chios" } },
  de: { description: "Ruhige Zimmer und Apartments im historischen Kampos-Gebiet von Chios, mit einfachem Zugang zur Stadt, zum Flughafen, zu Stränden, Dörfern und Sehenswürdigkeiten.", allRightsReserved: "Alle Rechte vorbehalten.", groups: { stay: "Aufenthalt", exploreChios: "Chios entdecken", popularGuides: "Beliebte Reiseführer" }, links: { rooms: "Zimmer", travelAgents: "Reisebüros · B2B", ratesAvailability: "Preise & Verfügbarkeit", contact: "Kontakt", faq: "Häufige Fragen", chiosIslandGuide: "Chios Reiseführer", beaches: "Strände auf Chios", villages: "Dörfer auf Chios", museums: "Museen auf Chios", holidayQuiz: "Chios Urlaubsquiz" } },
  it: { description: "Camere e appartamenti tranquilli nella storica zona di Kampos a Chios, con facile accesso alla città, all’aeroporto, alle spiagge, ai villaggi e ai luoghi culturali.", allRightsReserved: "Tutti i diritti riservati.", groups: { stay: "Soggiorno", exploreChios: "Esplora Chios", popularGuides: "Guide popolari" }, links: { rooms: "Camere", travelAgents: "Agenzie di viaggio · B2B", ratesAvailability: "Prezzi & Disponibilità", contact: "Contatti", faq: "Domande frequenti", chiosIslandGuide: "Guida di Chios", beaches: "Spiagge di Chios", villages: "Villaggi di Chios", museums: "Musei di Chios", holidayQuiz: "Quiz vacanze a Chios" } },
  es: { description: "Habitaciones y apartamentos tranquilos en la histórica zona de Kampos en Chios, con fácil acceso a la ciudad, al aeropuerto, a playas, pueblos y lugares culturales.", allRightsReserved: "Todos los derechos reservados.", groups: { stay: "Estancia", exploreChios: "Explorar Chios", popularGuides: "Guías populares" }, links: { rooms: "Habitaciones", travelAgents: "Agencias de viajes · B2B", ratesAvailability: "Precios & Disponibilidad", contact: "Contacto", faq: "Preguntas frecuentes", chiosIslandGuide: "Guía de Chios", beaches: "Playas de Chios", villages: "Pueblos de Chios", museums: "Museos de Chios", holidayQuiz: "Quiz de vacaciones en Chios" } },
  tr: { description: "Sakız Adası’nın tarihi Kampos bölgesinde, şehir merkezine, havaalanına, plajlara, köylere ve kültürel noktalara kolay erişimli sakin odalar ve daireler.", allRightsReserved: "Tüm hakları saklıdır.", groups: { stay: "Konaklama", exploreChios: "Sakız Adası’nı keşfedin", popularGuides: "Popüler rehberler" }, links: { rooms: "Odalar", travelAgents: "Seyahat Acenteleri · B2B", ratesAvailability: "Fiyatlar & Müsaitlik", contact: "İletişim", faq: "Sık Sorulan Sorular", chiosIslandGuide: "Sakız Adası Rehberi", beaches: "Sakız Adası Plajları", villages: "Sakız Adası Köyleri", museums: "Sakız Adası Müzeleri", holidayQuiz: "Sakız Adası Tatil Testi" } },
};

export function VoulamandisFooterTailwind({ language = "en" }: FooterProps) {
  const copy = footerCopy[language] || footerCopy.en;
  const year = new Date().getFullYear();
  const locationLabel = language === "tr" ? "Kambos, Sakız Adası" : language === "el" ? "Κάμπος, Χίος" : language === "fr" ? "Kambos, Chios" : language === "de" ? "Kambos, Chios" : language === "it" ? "Kambos, Chios" : language === "es" ? "Kambos, Quíos" : "Kampos, Chios";
  const footerTagline = language === "tr" ? "Sakız Adası odaları & daireleri · Doğrudan konaklama" : language === "el" ? "Δωμάτια & διαμερίσματα στη Χίο · Απευθείας διαμονή" : language === "fr" ? "Chambres & appartements à Chios · Réservation directe" : language === "de" ? "Zimmer & Apartments auf Chios · Direkt buchen" : language === "it" ? "Camere & appartamenti a Chios · Prenotazione diretta" : language === "es" ? "Habitaciones & apartamentos en Quíos · Reserva directa" : "Chios rooms & apartments · Direct stay";
  const phoneLabel = businessData.telephone.replace(/^\+30(\d{5})(\d+)$/, "+30 $1 $2");
  const footerNavLabel = language === "tr" ? "Alt bilgi menüsü" : language === "el" ? "Πλοήγηση υποσέλιδου" : language === "fr" ? "Navigation du pied de page" : language === "de" ? "Fußzeilennavigation" : language === "it" ? "Navigazione a piè di pagina" : language === "es" ? "Navegación del pie de página" : "Footer navigation";
  const groups = [
    { title: copy.groups.stay, links: [{ label: copy.links.rooms, href: getSiteNavigationPath("rooms", language) }, { label: copy.links.travelAgents, href: agentRoomGuidePaths[language] }, { label: copy.links.ratesAvailability, href: getSiteNavigationPath("rates", language) }, { label: copy.links.faq, href: propertyFaqPaths[language] }, { label: copy.links.contact, href: getSiteNavigationPath("contact", language) }] },
    { title: copy.groups.exploreChios, links: [{ label: copy.links.chiosIslandGuide, href: getSiteNavigationPath("chios", language) }, { label: copy.links.beaches, href: getSiteNavigationPath("beaches", language) }, { label: copy.links.villages, href: getSiteNavigationPath("villages", language) }, { label: copy.links.museums, href: getSiteNavigationPath("museums", language) }, { label: copy.links.holidayQuiz, href: getSiteNavigationPath("quiz", language) }] },
    { title: copy.groups.popularGuides, links: getFooterPopularGuides(language) },
  ];

  return (
    <footer className="vh-site-footer relative overflow-hidden bg-[#efe4d5] text-stone-800">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(180,118,52,.12),transparent_28rem),radial-gradient(circle_at_85%_30%,rgba(255,255,255,.7),transparent_24rem)]" />
      <div className="relative mx-auto max-w-7xl px-3 py-3 sm:px-6 sm:py-6 lg:px-8 lg:py-10">
        <div className="overflow-hidden rounded-[1.4rem] border border-amber-900/10 bg-[#fffaf3]/95 shadow-xl shadow-amber-950/10 backdrop-blur md:rounded-[1.75rem]">
          <section className="flex items-center justify-between gap-3 border-b border-amber-900/10 px-3 py-2.5 sm:px-5 sm:py-4 md:px-6 md:py-5">
            <a href={language === "en" ? "/" : `/${language}/`} className="flex min-h-11 min-w-0 items-center gap-2.5 sm:gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-amber-900/10 bg-white shadow-md shadow-amber-900/10 sm:h-11 sm:w-11 sm:rounded-2xl"><Image src="/favicon/vh-heart-128.webp" alt="" width={40} height={40} sizes="40px" loading="lazy" className="h-9 w-9 object-contain sm:h-10 sm:w-10" /></span>
              <span className="min-w-0">
                <strong className="block truncate text-[18px] font-black leading-none tracking-[-0.04em] text-stone-900 sm:text-lg md:text-xl">Voulamandis House</strong>
                <small className="mt-1 block truncate text-[11px] font-black uppercase tracking-[0.08em] text-stone-500 sm:text-[11px]">{locationLabel}</small>
              </span>
            </a>
            <p className="hidden max-w-xl text-right text-sm leading-6 text-stone-600 md:block">{copy.description}</p>
          </section>

          <address className="flex flex-col gap-1 border-b border-amber-900/10 px-3 py-2.5 text-[13px] font-semibold not-italic leading-6 text-stone-600 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-5 sm:px-5 md:px-6">
            <span>{businessData.address.streetAddress}, {locationLabel} {businessData.address.postalCode}</span>
            <a href={`tel:${businessData.telephone}`} className="inline-flex min-h-11 items-center text-amber-800 underline decoration-amber-800/25 underline-offset-4 hover:text-amber-950 sm:min-h-0">{phoneLabel}</a>
            <a href={`mailto:${businessData.email}`} className="inline-flex min-h-11 items-center text-amber-800 underline decoration-amber-800/25 underline-offset-4 hover:text-amber-950 sm:min-h-0">{businessData.email}</a>
          </address>

          <nav aria-label={footerNavLabel} className="grid grid-cols-1 divide-y divide-amber-900/10 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {groups.map((group) => (
              <section key={group.title} className="min-w-0 px-3 py-3 sm:px-4 sm:py-5 md:px-6 md:py-6">
                <h2 className="break-words text-[12px] font-black uppercase leading-[1.2] tracking-[0.08em] text-amber-800 sm:text-[12px] sm:tracking-[0.1em] md:text-sm">{group.title}</h2>
                <ul className="mt-2 grid gap-1 sm:mt-4 sm:gap-1.5 md:gap-2">
                  {group.links.map((link, linkIndex) => (
                    <li key={`${group.title}-${linkIndex}`} className="min-w-0">
                      <a href={link.href} className="group flex min-h-11 min-w-0 items-center justify-between gap-1 rounded-lg px-2 py-2 text-[14px] font-bold leading-[1.25] text-stone-700 transition hover:bg-amber-100/70 hover:text-stone-950 sm:rounded-xl sm:text-sm md:text-sm">
                        <span className="min-w-0 break-words [overflow-wrap:anywhere]">{link.label}</span>
                        <span aria-hidden="true" className="hidden shrink-0 text-stone-400 transition group-hover:translate-x-0.5 group-hover:text-amber-800 sm:inline">→</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </nav>

          <div className="flex flex-col items-start justify-between gap-3 border-t border-amber-900/10 px-3 py-3 sm:flex-row sm:items-center sm:px-5 sm:py-4 md:px-6">
            <div className="min-w-0 text-[11px] font-bold uppercase leading-[1.45] tracking-[0.04em] text-stone-500 sm:text-[11px] sm:tracking-[0.09em] md:text-xs">
              <p>© {year} Voulamandis House. {copy.allRightsReserved}</p>
              <p className="mt-0.5 text-stone-400">{footerTagline}</p>
            </div>
            <div className="flex shrink-0 items-center gap-2.5">
              <a href="https://www.instagram.com/chioshotels/" target="_blank" rel="noopener" aria-label="Instagram" className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-amber-900/15 bg-white/80 text-stone-700 shadow-sm shadow-amber-950/10 transition hover:bg-amber-100 hover:text-stone-950 sm:h-12 sm:w-12">
                <svg viewBox="0 0 24 24" aria-hidden="true" className="h-[22px] w-[22px] sm:h-6 sm:w-6" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
                  <circle cx="12" cy="12" r="4.1" />
                  <circle cx="17.4" cy="6.7" r="1" fill="currentColor" stroke="none" />
                </svg>
              </a>
              <a href="https://www.facebook.com/people/Voulamandis-House/100063584320703/" target="_blank" rel="noopener" aria-label="Facebook" className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-amber-900/15 bg-white/80 text-stone-700 shadow-sm shadow-amber-950/10 transition hover:bg-amber-100 hover:text-stone-950 sm:h-12 sm:w-12">
                <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6 sm:h-[26px] sm:w-[26px]" fill="currentColor">
                  <path d="M13.7 21v-8h2.8l.4-3.1h-3.2V8c0-.9.3-1.5 1.6-1.5H17V3.8c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.4-4 4.1v2.1H8V13h2.6v8h3.1Z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
