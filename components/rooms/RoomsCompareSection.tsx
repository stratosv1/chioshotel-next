import type { CategoryFromPrices, RoomCategoryId } from "@/lib/booking-core/category-from-prices";

/**
 * "Compare at a glance" section for the rooms category page.
 * Server-rendered, no client JavaScript. Prices come from Booking Core and are
 * hidden entirely when they cannot be loaded.
 */

export type CompareLocale = "en" | "el" | "fr" | "de" | "it" | "es" | "tr" | "pl";

type Row = {
  name: string;
  rooms: string;
  guests: string;
  size: string;
  access: string;
  kitchen: string;
  outdoor: string;
};

type Copy = {
  kicker: string;
  title: string;
  text: string;
  pickLabel: string;
  picks: Array<{ id: RoomCategoryId; label: string }>;
  columns: { category: string; guests: string; size: string; access: string; kitchen: string; outdoor: string; price: string };
  from: string;
  perNight: string;
  view: string;
  priceNote: string;
  rows: Record<RoomCategoryId, Row>;
};

const ORDER: RoomCategoryId[] = ["economy-double", "ground-floor", "first-floor", "family-apartments"];

const copy: Record<CompareLocale, Copy> = {
  en: {
    kicker: "Compare at a glance",
    title: "Which room category fits your trip?",
    text: "Guests, size, stairs, kitchen and the lowest direct price, side by side.",
    pickLabel: "I'm looking for",
    picks: [
      { id: "economy-double", label: "Best value for 2" },
      { id: "ground-floor", label: "No stairs" },
      { id: "first-floor", label: "Terrace view" },
      { id: "family-apartments", label: "Family & kitchen" },
    ],
    columns: { category: "Category", guests: "Guests", size: "Size", access: "Floor & access", kitchen: "Kitchen", outdoor: "Outdoor", price: "Direct price" },
    from: "from",
    perNight: "/ night",
    view: "View",
    priceNote: "Lowest available direct price per night for 2 guests, including the direct-booking discount. Live from our availability.",
    rows: {
      "economy-double": { name: "Economy Double", rooms: "Rooms 2 & 6", guests: "2", size: "16 m²", access: "Ground floor (6) or first floor (2)", kitchen: "No kitchenette", outdoor: "Courtyard or shared terrace" },
      "ground-floor": { name: "Ground Floor Rooms", rooms: "Rooms 5 & 7", guests: "2–3", size: "30–35 m²", access: "No stairs", kitchen: "Small fridge", outdoor: "Courtyard & garden" },
      "first-floor": { name: "First Floor Rooms", rooms: "Rooms 1, 3 & 4", guests: "2–4", size: "30–35 m²", access: "14 stairs with handrail", kitchen: "Kitchenette in 3 & 4", outdoor: "Shared terrace or balcony" },
      "family-apartments": { name: "Family Apartments", rooms: "Apartments 8–10", guests: "Up to 4", size: "40–45 m²", access: "No stairs", kitchen: "Full kitchen", outdoor: "Private balcony, orchard view" },
    },
  },
  el: {
    kicker: "Σύγκριση με μια ματιά",
    title: "Ποια κατηγορία ταιριάζει στο ταξίδι σας;",
    text: "Άτομα, εμβαδόν, σκάλες, κουζίνα και η χαμηλότερη τιμή απευθείας κράτησης, δίπλα-δίπλα.",
    pickLabel: "Ψάχνω για",
    picks: [
      { id: "economy-double", label: "Οικονομικό για 2" },
      { id: "ground-floor", label: "Χωρίς σκάλες" },
      { id: "first-floor", label: "Βεράντα με θέα" },
      { id: "family-apartments", label: "Οικογένεια & κουζίνα" },
    ],
    columns: { category: "Κατηγορία", guests: "Άτομα", size: "Εμβαδόν", access: "Όροφος & πρόσβαση", kitchen: "Κουζίνα", outdoor: "Εξωτερικός χώρος", price: "Τιμή απευθείας" },
    from: "από",
    perNight: "/ βράδυ",
    view: "Δείτε",
    priceNote: "Χαμηλότερη διαθέσιμη τιμή απευθείας κράτησης ανά βράδυ για 2 άτομα, με την έκπτωση απευθείας κράτησης. Ζωντανά από τη διαθεσιμότητά μας.",
    rows: {
      "economy-double": { name: "Οικονομικό δίκλινο", rooms: "Δωμάτια 2 & 6", guests: "2", size: "16 m²", access: "Ισόγειο (6) ή όροφος (2)", kitchen: "Χωρίς kitchenette", outdoor: "Αυλή ή κοινόχρηστη βεράντα" },
      "ground-floor": { name: "Δωμάτια ισογείου", rooms: "Δωμάτια 5 & 7", guests: "2–3", size: "30–35 m²", access: "Χωρίς σκάλες", kitchen: "Μικρό ψυγείο", outdoor: "Αυλή & κήπος" },
      "first-floor": { name: "Δωμάτια ορόφου", rooms: "Δωμάτια 1, 3 & 4", guests: "2–4", size: "30–35 m²", access: "14 σκαλιά με κουπαστή", kitchen: "Kitchenette στα 3 & 4", outdoor: "Κοινόχρηστη βεράντα ή μπαλκόνι" },
      "family-apartments": { name: "Οικογενειακά διαμερίσματα", rooms: "Διαμερίσματα 8–10", guests: "Έως 4", size: "40–45 m²", access: "Χωρίς σκάλες", kitchen: "Πλήρης κουζίνα", outdoor: "Ιδιωτικό μπαλκόνι με θέα στον κήπο" },
    },
  },
  fr: {
    kicker: "Comparer en un coup d’œil",
    title: "Quelle catégorie convient à votre séjour ?",
    text: "Voyageurs, surface, escaliers, cuisine et meilleur prix direct, côte à côte.",
    pickLabel: "Je cherche",
    picks: [
      { id: "economy-double", label: "Petit prix pour 2" },
      { id: "ground-floor", label: "Sans escalier" },
      { id: "first-floor", label: "Vue terrasse" },
      { id: "family-apartments", label: "Famille & cuisine" },
    ],
    columns: { category: "Catégorie", guests: "Personnes", size: "Surface", access: "Étage & accès", kitchen: "Cuisine", outdoor: "Extérieur", price: "Prix direct" },
    from: "dès",
    perNight: "/ nuit",
    view: "Voir",
    priceNote: "Prix direct le plus bas disponible par nuit pour 2 personnes, remise de réservation directe incluse. En direct de nos disponibilités.",
    rows: {
      "economy-double": { name: "Double économique", rooms: "Chambres 2 & 6", guests: "2", size: "16 m²", access: "Rez-de-chaussée (6) ou étage (2)", kitchen: "Sans kitchenette", outdoor: "Cour ou terrasse partagée" },
      "ground-floor": { name: "Chambres au rez-de-chaussée", rooms: "Chambres 5 & 7", guests: "2–3", size: "30–35 m²", access: "Sans escalier", kitchen: "Petit réfrigérateur", outdoor: "Cour & jardin" },
      "first-floor": { name: "Chambres à l’étage", rooms: "Chambres 1, 3 & 4", guests: "2–4", size: "30–35 m²", access: "14 marches avec rampe", kitchen: "Kitchenette (3 & 4)", outdoor: "Terrasse partagée ou balcon" },
      "family-apartments": { name: "Appartements familiaux", rooms: "Appartements 8–10", guests: "Jusqu’à 4", size: "40–45 m²", access: "Sans escalier", kitchen: "Cuisine complète", outdoor: "Balcon privé, vue sur le verger" },
    },
  },
  de: {
    kicker: "Auf einen Blick vergleichen",
    title: "Welche Kategorie passt zu Ihrer Reise?",
    text: "Gäste, Größe, Treppen, Küche und der günstigste Direktpreis im direkten Vergleich.",
    pickLabel: "Ich suche",
    picks: [
      { id: "economy-double", label: "Günstig für 2" },
      { id: "ground-floor", label: "Ohne Treppen" },
      { id: "first-floor", label: "Terrasse mit Blick" },
      { id: "family-apartments", label: "Familie & Küche" },
    ],
    columns: { category: "Kategorie", guests: "Gäste", size: "Größe", access: "Etage & Zugang", kitchen: "Küche", outdoor: "Außenbereich", price: "Direktpreis" },
    from: "ab",
    perNight: "/ Nacht",
    view: "Ansehen",
    priceNote: "Niedrigster verfügbarer Direktpreis pro Nacht für 2 Gäste, inklusive Direktbuchungsrabatt. Live aus unserer Verfügbarkeit.",
    rows: {
      "economy-double": { name: "Economy-Doppelzimmer", rooms: "Zimmer 2 & 6", guests: "2", size: "16 m²", access: "Erdgeschoss (6) oder Obergeschoss (2)", kitchen: "Ohne Kochnische", outdoor: "Innenhof oder Gemeinschaftsterrasse" },
      "ground-floor": { name: "Zimmer im Erdgeschoss", rooms: "Zimmer 5 & 7", guests: "2–3", size: "30–35 m²", access: "Ohne Treppen", kitchen: "Kleiner Kühlschrank", outdoor: "Innenhof & Garten" },
      "first-floor": { name: "Zimmer im Obergeschoss", rooms: "Zimmer 1, 3 & 4", guests: "2–4", size: "30–35 m²", access: "14 Stufen mit Handlauf", kitchen: "Kochnische in 3 & 4", outdoor: "Gemeinschaftsterrasse oder Balkon" },
      "family-apartments": { name: "Familienapartments", rooms: "Apartments 8–10", guests: "Bis 4", size: "40–45 m²", access: "Ohne Treppen", kitchen: "Voll ausgestattete Küche", outdoor: "Privater Balkon mit Blick auf den Garten" },
    },
  },
  it: {
    kicker: "Confronto a colpo d’occhio",
    title: "Quale categoria fa per il tuo viaggio?",
    text: "Ospiti, metratura, scale, cucina e il prezzo diretto più basso, fianco a fianco.",
    pickLabel: "Cerco",
    picks: [
      { id: "economy-double", label: "Economica per 2" },
      { id: "ground-floor", label: "Senza scale" },
      { id: "first-floor", label: "Terrazza con vista" },
      { id: "family-apartments", label: "Famiglia & cucina" },
    ],
    columns: { category: "Categoria", guests: "Ospiti", size: "Metratura", access: "Piano & accesso", kitchen: "Cucina", outdoor: "Esterno", price: "Prezzo diretto" },
    from: "da",
    perNight: "/ notte",
    view: "Vedi",
    priceNote: "Prezzo diretto più basso disponibile per notte per 2 ospiti, sconto prenotazione diretta incluso. In tempo reale dalla nostra disponibilità.",
    rows: {
      "economy-double": { name: "Doppia economica", rooms: "Camere 2 & 6", guests: "2", size: "16 m²", access: "Piano terra (6) o primo piano (2)", kitchen: "Senza angolo cottura", outdoor: "Cortile o terrazza condivisa" },
      "ground-floor": { name: "Camere al piano terra", rooms: "Camere 5 & 7", guests: "2–3", size: "30–35 m²", access: "Senza scale", kitchen: "Piccolo frigorifero", outdoor: "Cortile & giardino" },
      "first-floor": { name: "Camere al primo piano", rooms: "Camere 1, 3 & 4", guests: "2–4", size: "30–35 m²", access: "14 gradini con corrimano", kitchen: "Angolo cottura (3 & 4)", outdoor: "Terrazza condivisa o balcone" },
      "family-apartments": { name: "Appartamenti familiari", rooms: "Appartamenti 8–10", guests: "Fino a 4", size: "40–45 m²", access: "Senza scale", kitchen: "Cucina completa", outdoor: "Balcone privato, vista sul frutteto" },
    },
  },
  es: {
    kicker: "Compara de un vistazo",
    title: "¿Qué categoría encaja con tu viaje?",
    text: "Huéspedes, superficie, escaleras, cocina y el precio directo más bajo, lado a lado.",
    pickLabel: "Busco",
    picks: [
      { id: "economy-double", label: "Económica para 2" },
      { id: "ground-floor", label: "Sin escaleras" },
      { id: "first-floor", label: "Terraza con vistas" },
      { id: "family-apartments", label: "Familia & cocina" },
    ],
    columns: { category: "Categoría", guests: "Huéspedes", size: "Superficie", access: "Planta & acceso", kitchen: "Cocina", outdoor: "Exterior", price: "Precio directo" },
    from: "desde",
    perNight: "/ noche",
    view: "Ver",
    priceNote: "Precio directo más bajo disponible por noche para 2 huéspedes, con el descuento de reserva directa. En directo desde nuestra disponibilidad.",
    rows: {
      "economy-double": { name: "Doble económica", rooms: "Habitaciones 2 & 6", guests: "2", size: "16 m²", access: "Planta baja (6) o primera planta (2)", kitchen: "Sin kitchenette", outdoor: "Patio o terraza compartida" },
      "ground-floor": { name: "Habitaciones en planta baja", rooms: "Habitaciones 5 & 7", guests: "2–3", size: "30–35 m²", access: "Sin escaleras", kitchen: "Nevera pequeña", outdoor: "Patio & jardín" },
      "first-floor": { name: "Habitaciones en primera planta", rooms: "Habitaciones 1, 3 & 4", guests: "2–4", size: "30–35 m²", access: "14 escalones con pasamanos", kitchen: "Kitchenette en 3 & 4", outdoor: "Terraza compartida o balcón" },
      "family-apartments": { name: "Apartamentos familiares", rooms: "Apartamentos 8–10", guests: "Hasta 4", size: "40–45 m²", access: "Sin escaleras", kitchen: "Cocina completa", outdoor: "Balcón privado con vistas al huerto" },
    },
  },
  tr: {
    kicker: "Hızlı karşılaştırma",
    title: "Seyahatinize hangi kategori uygun?",
    text: "Misafir sayısı, büyüklük, merdiven, mutfak ve en düşük direkt fiyat yan yana.",
    pickLabel: "Aradığım",
    picks: [
      { id: "economy-double", label: "2 kişi için ekonomik" },
      { id: "ground-floor", label: "Merdivensiz" },
      { id: "first-floor", label: "Teras manzarası" },
      { id: "family-apartments", label: "Aile & mutfak" },
    ],
    columns: { category: "Kategori", guests: "Misafir", size: "Büyüklük", access: "Kat & erişim", kitchen: "Mutfak", outdoor: "Dış alan", price: "Direkt fiyat" },
    from: "",
    perNight: "’den / gece",
    view: "Görüntüle",
    priceNote: "2 misafir için gecelik en düşük müsait direkt fiyat, direkt rezervasyon indirimi dahil. Müsaitliğimizden canlı olarak.",
    rows: {
      "economy-double": { name: "Ekonomik çift kişilik", rooms: "Oda 2 & 6", guests: "2", size: "16 m²", access: "Zemin kat (6) veya üst kat (2)", kitchen: "Mini mutfak yok", outdoor: "Avlu veya ortak teras" },
      "ground-floor": { name: "Zemin kat odaları", rooms: "Oda 5 & 7", guests: "2–3", size: "30–35 m²", access: "Merdivensiz", kitchen: "Küçük buzdolabı", outdoor: "Avlu & bahçe" },
      "first-floor": { name: "Üst kat odaları", rooms: "Oda 1, 3 & 4", guests: "2–4", size: "30–35 m²", access: "Tırabzanlı 14 basamak", kitchen: "3 & 4’te mini mutfak", outdoor: "Ortak teras veya balkon" },
      "family-apartments": { name: "Aile apartları", rooms: "Apart 8–10", guests: "4’e kadar", size: "40–45 m²", access: "Merdivensiz", kitchen: "Tam donanımlı mutfak", outdoor: "Bahçe manzaralı özel balkon" },
    },
  },
  pl: {
    kicker: "Porównanie w skrócie",
    title: "Która kategoria pasuje do Twojej podróży?",
    text: "Liczba gości, metraż, schody, kuchnia i najniższa cena bezpośrednia obok siebie.",
    pickLabel: "Szukam",
    picks: [
      { id: "economy-double", label: "Tanio dla 2 osób" },
      { id: "ground-floor", label: "Bez schodów" },
      { id: "first-floor", label: "Taras z widokiem" },
      { id: "family-apartments", label: "Rodzina i kuchnia" },
    ],
    columns: { category: "Kategoria", guests: "Goście", size: "Metraż", access: "Piętro i dostęp", kitchen: "Kuchnia", outdoor: "Na zewnątrz", price: "Cena bezpośrednia" },
    from: "od",
    perNight: "/ noc",
    view: "Zobacz",
    priceNote: "Najniższa dostępna cena bezpośrednia za noc dla 2 osób, z rabatem za rezerwację bezpośrednią. Na żywo z naszej dostępności.",
    rows: {
      "economy-double": { name: "Ekonomiczny dwuosobowy", rooms: "Pokoje 2 i 6", guests: "2", size: "16 m²", access: "Parter (6) lub piętro (2)", kitchen: "Bez aneksu kuchennego", outdoor: "Dziedziniec lub wspólny taras" },
      "ground-floor": { name: "Pokoje na parterze", rooms: "Pokoje 5 i 7", guests: "2–3", size: "30–35 m²", access: "Bez schodów", kitchen: "Mała lodówka", outdoor: "Dziedziniec i ogród" },
      "first-floor": { name: "Pokoje na piętrze", rooms: "Pokoje 1, 3 i 4", guests: "2–4", size: "30–35 m²", access: "14 stopni z poręczą", kitchen: "Aneks kuchenny w 3 i 4", outdoor: "Wspólny taras lub balkon" },
      "family-apartments": { name: "Apartamenty rodzinne", rooms: "Apartamenty 8–10", guests: "Do 4", size: "40–45 m²", access: "Bez schodów", kitchen: "Pełna kuchnia", outdoor: "Prywatny balkon z widokiem na sad" },
    },
  },
};

export function formatFromPrice(price: number, locale: CompareLocale) {
  const c = copy[locale];
  const amount = `€${price}`;
  return c.from ? `${c.from} ${amount} ${c.perNight}` : `${amount}${c.perNight}`;
}

type Props = {
  locale: CompareLocale;
  prices: CategoryFromPrices | null;
  hrefs: Partial<Record<RoomCategoryId, string>>;
};

export function RoomsCompareSection({ locale, prices, hrefs }: Props) {
  const c = copy[locale];
  const hasPrices = Boolean(prices && Object.keys(prices).length);
  const priceText = (id: RoomCategoryId) => {
    const value = prices?.[id];
    return typeof value === "number" ? formatFromPrice(value, locale) : "—";
  };

  return (
    <section className="mt-12" aria-labelledby="rooms-compare-title" id="rooms-compare">
      <header className="mx-auto max-w-3xl text-center">
        <span className="inline-flex rounded-full border border-amber-900/10 bg-white px-4 py-2 text-[11px] font-black uppercase tracking-[0.24em] text-amber-800 shadow-sm">
          {c.kicker}
        </span>
        <h2 id="rooms-compare-title" className="mt-5 text-balance text-3xl font-black tracking-[-0.035em] text-[#2f261f] sm:text-4xl">
          {c.title}
        </h2>
        <p className="mt-3 text-pretty text-base leading-7 text-[#574b3f]">{c.text}</p>
      </header>

      <nav className="mt-6 flex flex-wrap items-center justify-center gap-2" aria-label={c.pickLabel}>
        <span className="mr-1 text-xs font-black uppercase tracking-[0.16em] text-[#6a5b4e]">{c.pickLabel}</span>
        {c.picks.map((pick) => (
          <a
            key={pick.id}
            href={`#room-${pick.id}`}
            className="inline-flex min-h-11 items-center rounded-full border border-amber-900/15 bg-white px-4 text-sm font-bold text-amber-900 shadow-sm transition hover:bg-amber-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-700/25"
          >
            {pick.label}
          </a>
        ))}
      </nav>

      {/* Mobile: one compact block per category */}
      <ul className="mt-7 grid gap-3 md:hidden">
        {ORDER.map((id) => {
          const row = c.rows[id];
          return (
            <li key={id} className="rounded-[22px] border border-amber-900/10 bg-white p-4 shadow-[0_10px_30px_rgba(47,38,31,0.07)]">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-lg font-black tracking-[-0.02em] text-[#2f261f]">{row.name}</p>
                  <p className="text-xs font-bold text-[#6a5b4e]">{row.rooms}</p>
                </div>
                {hasPrices ? (
                  <p className="shrink-0 rounded-full bg-amber-50 px-3 py-1 text-sm font-black text-amber-900 ring-1 ring-amber-900/10">{priceText(id)}</p>
                ) : null}
              </div>
              <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <div><dt className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#8a7866]">{c.columns.guests}</dt><dd className="font-bold text-[#2f261f]">{row.guests}</dd></div>
                <div><dt className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#8a7866]">{c.columns.size}</dt><dd className="font-bold text-[#2f261f]">{row.size}</dd></div>
                <div><dt className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#8a7866]">{c.columns.access}</dt><dd className="text-[#2f261f]">{row.access}</dd></div>
                <div><dt className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#8a7866]">{c.columns.kitchen}</dt><dd className="text-[#2f261f]">{row.kitchen}</dd></div>
                <div className="col-span-2"><dt className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#8a7866]">{c.columns.outdoor}</dt><dd className="text-[#2f261f]">{row.outdoor}</dd></div>
              </dl>
              {hrefs[id] ? (
                <a href={hrefs[id]} className="mt-3 inline-flex min-h-11 items-center text-sm font-black text-amber-800 underline decoration-amber-300 underline-offset-4">
                  {c.view} {row.name} <span aria-hidden="true">&nbsp;→</span>
                </a>
              ) : null}
            </li>
          );
        })}
      </ul>

      {/* Desktop: comparison table */}
      <div className="mt-8 hidden overflow-hidden rounded-[28px] border border-amber-900/10 bg-white shadow-[0_18px_45px_rgba(47,38,31,0.08)] md:block">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="bg-[#f3e7d7] text-[11px] font-black uppercase tracking-[0.14em] text-amber-900">
            <tr>
              <th scope="col" className="px-5 py-4">{c.columns.category}</th>
              <th scope="col" className="px-4 py-4">{c.columns.guests}</th>
              <th scope="col" className="px-4 py-4">{c.columns.size}</th>
              <th scope="col" className="px-4 py-4">{c.columns.access}</th>
              <th scope="col" className="px-4 py-4">{c.columns.kitchen}</th>
              <th scope="col" className="px-4 py-4">{c.columns.outdoor}</th>
              {hasPrices ? <th scope="col" className="px-5 py-4 text-right">{c.columns.price}</th> : null}
            </tr>
          </thead>
          <tbody className="divide-y divide-amber-900/10 text-[#2f261f]">
            {ORDER.map((id) => {
              const row = c.rows[id];
              return (
                <tr key={id} className="align-top transition hover:bg-[#fffaf3]">
                  <th scope="row" className="px-5 py-4 font-normal">
                    {hrefs[id] ? (
                      <a href={hrefs[id]} className="text-base font-black text-[#2f261f] underline decoration-amber-300 decoration-2 underline-offset-4 hover:text-amber-800">{row.name}</a>
                    ) : (
                      <span className="text-base font-black">{row.name}</span>
                    )}
                    <span className="mt-0.5 block text-xs font-bold text-[#6a5b4e]">{row.rooms}</span>
                  </th>
                  <td className="px-4 py-4 font-bold">{row.guests}</td>
                  <td className="whitespace-nowrap px-4 py-4 font-bold">{row.size}</td>
                  <td className="px-4 py-4">{row.access}</td>
                  <td className="px-4 py-4">{row.kitchen}</td>
                  <td className="px-4 py-4">{row.outdoor}</td>
                  {hasPrices ? <td className="whitespace-nowrap px-5 py-4 text-right text-base font-black text-amber-800">{priceText(id)}</td> : null}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {hasPrices ? <p className="mx-auto mt-4 max-w-3xl text-center text-xs leading-6 text-[#6a5b4e]">{c.priceNote}</p> : null}
    </section>
  );
}
