import Image from "next/image";
import type { ReactNode } from "react";
import type { KamposChiosPageData } from "@/content/kampos-chios";

type Props = { data: KamposChiosPageData };
type Language = KamposChiosPageData["language"];

type Copy = {
  heroTitle: string;
  heroDescription: string;
  eyebrow: string;
  roomsEyebrow: string;
  roomsTitle: string;
  whyEyebrow: string;
  whyTitle: string;
  locationEyebrow: string;
  locationTitle: string;
  historyLabel: string;
  faqEyebrow: string;
  faqTitle: string;
  details: string;
  allRooms: string;
  unsure: string;
  beach: string;
  airport: string;
  town: string;
  parking: string;
  roomTitles: string[];
  roomSubtitles: string[];
  roomBadges: string[];
  faq: { question: string; answer: string }[];
};

const copy: Record<Exclude<Language, "el">, Copy> = {
  en: {
    heroTitle: "Stay in Kambos, Chios",
    heroDescription: "Quiet rooms and family apartments among citrus gardens, close to beaches and Chios Town, away from noise and stress.",
    eyebrow: "Kambos Chios · Voulamandis House",
    roomsEyebrow: "Rooms and apartments in Kambos Chios",
    roomsTitle: "Choose the stay that suits you",
    whyEyebrow: "A different pace of holiday",
    whyTitle: "Peace, character and easy access",
    locationEyebrow: "Close to beaches, away from the crowds",
    locationTitle: "A quiet base for exploring Chios",
    historyLabel: "The history of Kambos",
    faqEyebrow: "Useful information",
    faqTitle: "Frequently asked questions about staying in Kambos",
    details: "View details",
    allRooms: "All rooms",
    unsure: "Not sure which room is right for you?",
    beach: "beach",
    airport: "airport",
    town: "town & port",
    parking: "parking",
    roomTitles: ["Economy double rooms", "Ground-floor rooms", "Upper-floor rooms", "Family apartments"],
    roomSubtitles: ["For 2 guests", "Double and triple", "Double and triple", "Space and kitchen"],
    roomBadges: ["Good value", "Near the garden", "Terrace & view", "For families"],
    faq: [
      { question: "Why stay in Kambos, Chios?", answer: "Kambos combines peace, historic character and nature while remaining close to Chios Town, the airport and the beaches." },
      { question: "Are there rooms inside Kambos?", answer: "Yes. Voulamandis House offers double rooms, ground-floor and upper-floor options, plus family apartments with kitchens." },
      { question: "Is Kambos suitable for couples and families?", answer: "Yes. The garden, quiet atmosphere, free parking and range of room types suit both couples and families." },
      { question: "How close are the beaches?", answer: "The nearest beach is about 1.5 km away, while Karfas, Megas Limnionas and the beaches of southern Chios are easy to reach by car." },
    ],
  },
  fr: {
    heroTitle: "Séjour à Kambos, Chios",
    heroDescription: "Chambres calmes et appartements familiaux au milieu des agrumes, proches des plages et de la ville de Chios, loin du bruit.",
    eyebrow: "Kambos Chios · Voulamandis House",
    roomsEyebrow: "Chambres et appartements à Kambos",
    roomsTitle: "Choisissez le séjour qui vous convient",
    whyEyebrow: "Des vacances à un autre rythme",
    whyTitle: "Calme, caractère et accès facile",
    locationEyebrow: "Près des plages, loin de la foule",
    locationTitle: "Une base paisible pour découvrir Chios",
    historyLabel: "L’histoire de Kambos",
    faqEyebrow: "Informations utiles",
    faqTitle: "Questions fréquentes sur un séjour à Kambos",
    details: "Voir les détails",
    allRooms: "Toutes les chambres",
    unsure: "Vous hésitez entre plusieurs chambres ?",
    beach: "plage",
    airport: "aéroport",
    town: "ville et port",
    parking: "parking",
    roomTitles: ["Chambres doubles économiques", "Chambres au rez-de-chaussée", "Chambres à l’étage", "Appartements familiaux"],
    roomSubtitles: ["Pour 2 personnes", "Doubles et triples", "Doubles et triples", "Espace et cuisine"],
    roomBadges: ["Bon prix", "Près du jardin", "Terrasse et vue", "Pour familles"],
    faq: [
      { question: "Pourquoi séjourner à Kambos ?", answer: "Kambos associe calme, patrimoine et nature tout en restant proche de la ville, de l’aéroport et des plages." },
      { question: "Y a-t-il des chambres au cœur de Kambos ?", answer: "Oui. Voulamandis House propose des chambres doubles, des options au rez-de-chaussée ou à l’étage et des appartements familiaux avec cuisine." },
      { question: "Kambos convient-il aux couples et aux familles ?", answer: "Oui. Le jardin, le calme, le parking gratuit et les différents hébergements conviennent aux couples comme aux familles." },
      { question: "Les plages sont-elles proches ?", answer: "La plage la plus proche se trouve à environ 1,5 km. Karfas, Megas Limnionas et les plages du sud sont facilement accessibles en voiture." },
    ],
  },
  de: {
    heroTitle: "Übernachten in Kambos auf Chios",
    heroDescription: "Ruhige Zimmer und Familienapartments zwischen Zitrusgärten, nahe Stränden und Chios-Stadt, fern von Lärm und Hektik.",
    eyebrow: "Kambos Chios · Voulamandis House",
    roomsEyebrow: "Zimmer und Apartments in Kambos",
    roomsTitle: "Wählen Sie die passende Unterkunft",
    whyEyebrow: "Urlaub in einem anderen Rhythmus",
    whyTitle: "Ruhe, Charakter und kurze Wege",
    locationEyebrow: "Nah an Stränden, fern vom Trubel",
    locationTitle: "Eine ruhige Basis, um Chios zu entdecken",
    historyLabel: "Die Geschichte von Kambos",
    faqEyebrow: "Nützliche Informationen",
    faqTitle: "Häufige Fragen zum Aufenthalt in Kambos",
    details: "Details ansehen",
    allRooms: "Alle Zimmer",
    unsure: "Sie sind unsicher, welches Zimmer passt?",
    beach: "Strand",
    airport: "Flughafen",
    town: "Stadt und Hafen",
    parking: "Parkplatz",
    roomTitles: ["Günstige Doppelzimmer", "Zimmer im Erdgeschoss", "Zimmer im Obergeschoss", "Familienapartments"],
    roomSubtitles: ["Für 2 Gäste", "Doppel und Dreibett", "Doppel und Dreibett", "Mehr Platz und Küche"],
    roomBadges: ["Guter Preis", "Am Garten", "Terrasse und Aussicht", "Für Familien"],
    faq: [
      { question: "Warum in Kambos übernachten?", answer: "Kambos verbindet Ruhe, Geschichte und Natur und liegt zugleich nahe der Stadt, dem Flughafen und den Stränden." },
      { question: "Gibt es Unterkünfte direkt in Kambos?", answer: "Ja. Voulamandis House bietet Doppelzimmer, Zimmer im Erd- und Obergeschoss sowie Familienapartments mit Küche." },
      { question: "Ist Kambos für Paare und Familien geeignet?", answer: "Ja. Garten, ruhige Atmosphäre, kostenloses Parken und verschiedene Unterkunftstypen passen zu Paaren und Familien." },
      { question: "Wie nah sind die Strände?", answer: "Der nächste Strand ist etwa 1,5 km entfernt. Karfas, Megas Limnionas und die Strände im Süden sind gut mit dem Auto erreichbar." },
    ],
  },
  it: {
    heroTitle: "Soggiorno a Kambos, Chios",
    heroDescription: "Camere tranquille e appartamenti familiari tra agrumeti, vicini alle spiagge e alla città di Chios, lontani dal rumore.",
    eyebrow: "Kambos Chios · Voulamandis House",
    roomsEyebrow: "Camere e appartamenti a Kambos",
    roomsTitle: "Scegli il soggiorno più adatto a te",
    whyEyebrow: "Vacanze con un ritmo diverso",
    whyTitle: "Tranquillità, carattere e comodità",
    locationEyebrow: "Vicino alle spiagge, lontano dalla folla",
    locationTitle: "Una base tranquilla per scoprire Chios",
    historyLabel: "La storia di Kambos",
    faqEyebrow: "Informazioni utili",
    faqTitle: "Domande frequenti sul soggiorno a Kambos",
    details: "Vedi dettagli",
    allRooms: "Tutte le camere",
    unsure: "Non sai quale camera scegliere?",
    beach: "spiaggia",
    airport: "aeroporto",
    town: "città e porto",
    parking: "parcheggio",
    roomTitles: ["Camere doppie economiche", "Camere al piano terra", "Camere al piano superiore", "Appartamenti familiari"],
    roomSubtitles: ["Per 2 ospiti", "Doppie e triple", "Doppie e triple", "Spazio e cucina"],
    roomBadges: ["Buon prezzo", "Vicino al giardino", "Terrazza e vista", "Per famiglie"],
    faq: [
      { question: "Perché soggiornare a Kambos?", answer: "Kambos unisce tranquillità, storia e natura, restando vicino alla città, all’aeroporto e alle spiagge." },
      { question: "Ci sono camere nel cuore di Kambos?", answer: "Sì. Voulamandis House offre camere doppie, soluzioni al piano terra e superiore e appartamenti familiari con cucina." },
      { question: "Kambos è adatto a coppie e famiglie?", answer: "Sì. Il giardino, l’atmosfera tranquilla, il parcheggio gratuito e le diverse sistemazioni sono adatti a coppie e famiglie." },
      { question: "Quanto sono vicine le spiagge?", answer: "La spiaggia più vicina dista circa 1,5 km. Karfas, Megas Limnionas e le spiagge del sud sono facilmente raggiungibili in auto." },
    ],
  },
  es: {
    heroTitle: "Alojamiento en Kambos, Quíos",
    heroDescription: "Habitaciones tranquilas y apartamentos familiares entre cítricos, cerca de las playas y de la ciudad de Quíos, lejos del ruido.",
    eyebrow: "Kambos Quíos · Voulamandis House",
    roomsEyebrow: "Habitaciones y apartamentos en Kambos",
    roomsTitle: "Elija el alojamiento que mejor le convenga",
    whyEyebrow: "Vacaciones a otro ritmo",
    whyTitle: "Tranquilidad, carácter y buena ubicación",
    locationEyebrow: "Cerca de las playas, lejos de las multitudes",
    locationTitle: "Una base tranquila para descubrir Quíos",
    historyLabel: "La historia de Kambos",
    faqEyebrow: "Información útil",
    faqTitle: "Preguntas frecuentes sobre alojarse en Kambos",
    details: "Ver detalles",
    allRooms: "Todas las habitaciones",
    unsure: "¿No sabe qué habitación elegir?",
    beach: "playa",
    airport: "aeropuerto",
    town: "ciudad y puerto",
    parking: "aparcamiento",
    roomTitles: ["Habitaciones dobles económicas", "Habitaciones en planta baja", "Habitaciones en planta alta", "Apartamentos familiares"],
    roomSubtitles: ["Para 2 personas", "Dobles y triples", "Dobles y triples", "Espacio y cocina"],
    roomBadges: ["Buen precio", "Junto al jardín", "Terraza y vistas", "Para familias"],
    faq: [
      { question: "¿Por qué alojarse en Kambos?", answer: "Kambos combina tranquilidad, historia y naturaleza y sigue estando cerca de la ciudad, el aeropuerto y las playas." },
      { question: "¿Hay habitaciones dentro de Kambos?", answer: "Sí. Voulamandis House ofrece habitaciones dobles, opciones en planta baja y alta y apartamentos familiares con cocina." },
      { question: "¿Es adecuado para parejas y familias?", answer: "Sí. El jardín, el ambiente tranquilo, el aparcamiento gratuito y los distintos alojamientos son adecuados para parejas y familias." },
      { question: "¿A qué distancia están las playas?", answer: "La playa más cercana está a unos 1,5 km. Karfas, Megas Limnionas y las playas del sur se alcanzan fácilmente en coche." },
    ],
  },
  tr: {
    heroTitle: "Sakız Kambos’ta Konaklama",
    heroDescription: "Narenciye bahçeleri içinde sakin odalar ve aile daireleri; plajlara ve Sakız merkezine yakın, gürültüden uzak.",
    eyebrow: "Kambos Sakız · Voulamandis House",
    roomsEyebrow: "Kambos’ta oda ve daireler",
    roomsTitle: "Size uygun konaklamayı seçin",
    whyEyebrow: "Daha sakin bir tatil ritmi",
    whyTitle: "Huzur, karakter ve kolay ulaşım",
    locationEyebrow: "Plajlara yakın, kalabalıktan uzak",
    locationTitle: "Sakız’ı keşfetmek için sakin bir üs",
    historyLabel: "Kambos’un tarihi",
    faqEyebrow: "Faydalı bilgiler",
    faqTitle: "Kambos’ta konaklama hakkında sık sorulan sorular",
    details: "Detayları görün",
    allRooms: "Tüm odalar",
    unsure: "Hangi odanın uygun olduğundan emin değil misiniz?",
    beach: "plaj",
    airport: "havaalanı",
    town: "merkez ve liman",
    parking: "otopark",
    roomTitles: ["Ekonomik çift kişilik odalar", "Zemin kat odaları", "Üst kat odaları", "Aile daireleri"],
    roomSubtitles: ["2 kişilik", "Çift ve üç kişilik", "Çift ve üç kişilik", "Geniş alan ve mutfak"],
    roomBadges: ["Uygun fiyat", "Bahçeye yakın", "Teras ve manzara", "Aileler için"],
    faq: [
      { question: "Neden Kambos’ta konaklamalı?", answer: "Kambos huzuru, tarihi dokuyu ve doğayı bir araya getirirken merkeze, havaalanına ve plajlara yakın kalır." },
      { question: "Kambos içinde oda var mı?", answer: "Evet. Voulamandis House çift kişilik odalar, zemin ve üst kat seçenekleri ile mutfaklı aile daireleri sunar." },
      { question: "Çiftler ve aileler için uygun mu?", answer: "Evet. Bahçe, sakin atmosfer, ücretsiz otopark ve farklı konaklama seçenekleri çiftler ve aileler için uygundur." },
      { question: "Plajlar ne kadar yakın?", answer: "En yakın plaj yaklaşık 1,5 km uzaklıktadır. Karfas, Megas Limnionas ve güney plajlarına araçla kolayca ulaşılır." },
    ],
  },
};

const roomImages = [
  "/images/rooms/received_1753964631359257.webp",
  "/images/rooms/double-triple-room.jpg",
  "/images/rooms/DSC07776-2-e1675109942622.webp",
  "/images/rooms/chios-apartments-voulamandis.webp",
] as const;

function Cta({ href, children, secondary = false }: { href: string; children: ReactNode; secondary?: boolean }) {
  return (
    <a
      href={href}
      className={`inline-flex min-h-11 items-center justify-center rounded-full px-4 py-2.5 text-center text-[0.78rem] font-extrabold transition hover:-translate-y-0.5 sm:min-h-12 sm:px-6 sm:text-sm ${
        secondary
          ? "border border-[#d8c8b8] bg-[#fffdf9] !text-[#57463b] hover:bg-[#f5ede4]"
          : "bg-[#6f5949] !text-white shadow-md shadow-[#6f5949]/15 hover:bg-[#5e493c]"
      }`}
    >
      <span className="!text-inherit">{children}</span>
    </a>
  );
}

export function LocalizedKamposLandingPage({ data }: Props) {
  if (data.language === "el") return null;
  const t = copy[data.language];
  const shell = "mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8";
  const eyebrow = "text-[0.68rem] font-extrabold uppercase tracking-[0.22em] text-[#9a7a62] sm:text-xs";
  const heading = "text-balance font-serif text-[2rem] font-semibold leading-[1.02] tracking-[-0.04em] text-[#493a31] sm:text-4xl lg:text-5xl";
  const body = "text-[0.96rem] leading-7 text-[#75665b] sm:text-lg sm:leading-8";
  const facts = [["1.5 km", t.beach], ["3 km", t.airport], ["6 km", t.town], ["Free", t.parking]];

  return (
    <main className="overflow-hidden bg-[#f8f4ee] text-[#493a31]">
      <section className="bg-gradient-to-br from-[#fffdf9] via-[#f4ede5] to-[#eadfd4] pt-20 sm:pt-28">
        <div className={`${shell} grid items-center gap-6 pb-8 sm:gap-10 sm:pb-14 lg:grid-cols-[1.02fr_0.98fr] lg:gap-14`}>
          <div>
            <p className={eyebrow}>{t.eyebrow}</p>
            <h1 className="mt-3 max-w-4xl text-balance font-serif text-[2.4rem] font-semibold leading-[0.96] tracking-[-0.05em] text-[#493a31] sm:text-6xl lg:text-7xl">{t.heroTitle}</h1>
            <p className={`${body} mt-4 max-w-2xl sm:mt-6`}>{t.heroDescription}</p>
            <div className="mt-5 grid grid-cols-2 gap-2.5 sm:mt-8 sm:flex">
              <Cta href={data.hero.primaryCta.href}>{data.hero.primaryCta.label}</Cta>
              <Cta href={data.hero.secondaryCta.href} secondary>{data.hero.secondaryCta.label}</Cta>
            </div>
            <ul className="mt-5 grid grid-cols-2 gap-2 sm:mt-7 sm:grid-cols-4">
              {facts.map(([value, label]) => (
                <li key={label} className="rounded-2xl border border-[#e4d7cb] bg-[#fffdf9]/90 px-3 py-3 shadow-sm">
                  <strong className="block font-serif text-lg text-[#59473b] sm:text-xl">{value}</strong>
                  <span className="block text-[0.7rem] font-semibold text-[#8a7869] sm:text-xs">{label}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="relative aspect-[16/10] overflow-hidden rounded-[1.6rem] shadow-xl shadow-[#6f5949]/12 sm:aspect-[5/4] sm:rounded-[2.5rem] lg:aspect-[4/5]">
            <Image src={data.hero.image} alt={data.hero.imageAlt} fill priority className="object-cover" sizes="(max-width: 1024px) 100vw, 46vw" />
          </div>
        </div>
      </section>

      <section className={`${shell} py-9 sm:py-16`}>
        <div className="grid items-center gap-5 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
          <div><p className={eyebrow}>{t.whyEyebrow}</p><h2 className={`${heading} mt-3`}>{t.whyTitle}</h2></div>
          <div className="space-y-4 rounded-3xl border border-[#eadfd4] bg-[#fffdf9] p-5 shadow-sm sm:p-7">
            {data.intro.paragraphs.slice(0, 2).map((paragraph) => <p key={paragraph} className={body}>{paragraph}</p>)}
          </div>
        </div>
      </section>

      <section className="bg-[#eee6dd] py-9 sm:py-16">
        <div className={shell}>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {data.highlights.map((item) => (
              <article key={`${item.label}-${item.value}`} className="rounded-2xl border border-[#e4d7cb] bg-[#fffdf9] p-4 shadow-sm">
                <span className="text-[0.68rem] font-extrabold uppercase tracking-[0.16em] text-[#9a7a62]">{item.label}</span>
                <strong className="mt-2 block font-serif text-lg text-[#4e3d32] sm:text-xl">{item.value}</strong>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={`${shell} py-9 sm:py-16`}>
        <div className="space-y-8 sm:space-y-12">
          {data.sections.slice(0, 2).map((section, index) => (
            <article key={section.title} className="grid items-center gap-6 lg:grid-cols-2 lg:gap-14">
              <div className={`relative aspect-[16/10] overflow-hidden rounded-[1.6rem] shadow-lg shadow-[#6f5949]/10 sm:aspect-[4/3] ${index % 2 ? "lg:order-2" : ""}`}>
                <Image src={section.image} alt={section.imageAlt} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 48vw" />
              </div>
              <div><span className={eyebrow}>0{index + 1}</span><h2 className={`${heading} mt-3`}>{section.title}</h2><p className={`${body} mt-4`}>{section.text}</p></div>
            </article>
          ))}
        </div>
      </section>

      <section id="rooms-kambos" className="bg-[#f5eee7] py-9 sm:py-16">
        <div className={shell}>
          <p className={eyebrow}>{t.roomsEyebrow}</p>
          <h2 className={`${heading} mt-3 max-w-3xl`}>{t.roomsTitle}</h2>
          <div className="-mx-4 mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-3 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-4 [&::-webkit-scrollbar]:hidden">
            {roomImages.map((image, index) => (
              <article key={t.roomTitles[index]} className="w-[80vw] max-w-[315px] shrink-0 snap-center overflow-hidden rounded-[1.5rem] border border-[#dfd1c4] bg-[#fffdf9] shadow-md shadow-[#6f5949]/8 sm:w-auto sm:max-w-none">
                <a href={data.hero.primaryCta.href} className="relative block aspect-[16/10] overflow-hidden">
                  <Image src={image} alt={t.roomTitles[index]} fill className="object-cover transition duration-500 hover:scale-105" sizes="(max-width: 640px) 80vw, (max-width: 1024px) 50vw, 25vw" />
                  <span className="absolute left-3 top-3 rounded-full border border-white/60 bg-[#fffdf9]/90 px-3 py-1.5 text-[0.68rem] font-extrabold text-[#57463b]">{t.roomBadges[index]}</span>
                </a>
                <div className="p-4"><p className="text-[0.65rem] font-bold uppercase tracking-[0.14em] text-[#9b7d66]">{t.roomSubtitles[index]}</p><h3 className="mt-1.5 font-serif text-[1.45rem] font-semibold leading-tight text-[#4d3c31]">{t.roomTitles[index]}</h3><a href={data.hero.primaryCta.href} className="mt-4 inline-flex text-sm font-extrabold !text-[#6f5949]">{t.details} →</a></div>
              </article>
            ))}
          </div>
          <div className="mt-5 flex items-center justify-between gap-4 rounded-2xl border border-[#dfd1c4] bg-[#fffdf9] p-4 shadow-sm"><p className="text-sm leading-6 text-[#75665b]">{t.unsure}</p><Cta href={data.hero.primaryCta.href} secondary>{t.allRooms}</Cta></div>
        </div>
      </section>

      <section className={`${shell} py-9 sm:py-16`}>
        <div className="grid items-center gap-6 lg:grid-cols-[1fr_0.8fr] lg:gap-14">
          <div><p className={eyebrow}>{t.locationEyebrow}</p><h2 className={`${heading} mt-3`}>{t.locationTitle}</h2><p className={`${body} mt-4`}>{data.stay.text}</p><div className="mt-5 grid grid-cols-2 gap-2.5">{facts.map(([value, label]) => <article key={label} className="rounded-2xl border border-[#e4d7cb] bg-[#fffdf9] p-4 shadow-sm"><strong className="block font-serif text-xl text-[#4f3e33]">{value}</strong><span className="text-xs text-[#897668]">{label}</span></article>)}</div></div>
          <div className="relative hidden aspect-[4/3] overflow-hidden rounded-[2.5rem] shadow-xl shadow-[#6f5949]/10 md:block"><Image src={data.gallery[2].image} alt={data.gallery[2].imageAlt} fill className="object-cover" sizes="44vw" /></div>
        </div>
      </section>

      <section className={`${shell} pb-9 sm:pb-16`}>
        <details className="group overflow-hidden rounded-[1.6rem] border border-[#ddcdbd] bg-[#fffdf9] shadow-sm"><summary className="flex cursor-pointer list-none items-center gap-4 p-4 sm:p-6 [&::-webkit-details-marker]:hidden"><div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-xl sm:h-28 sm:w-36"><Image src={data.gallery[3].image} alt={data.gallery[3].imageAlt} fill className="object-cover" sizes="144px" /></div><div className="min-w-0 flex-1"><p className={eyebrow}>{t.historyLabel}</p><h2 className="mt-1 font-serif text-xl font-semibold leading-tight text-[#513d31] sm:text-3xl">{data.sections[2]?.title || t.historyLabel}</h2></div><span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#6f5949] text-white transition group-open:rotate-45">+</span></summary><div className="border-t border-[#e3d4c5] px-5 py-5"><p className={body}>{data.sections[2]?.text}</p></div></details>
      </section>

      <section className="bg-[#eee6dd] py-9 sm:py-16">
        <div className={shell}><p className={eyebrow}>{t.faqEyebrow}</p><h2 className={`${heading} mt-3 max-w-3xl`}>{t.faqTitle}</h2><div className="mt-6 divide-y divide-[#dfcfbf] rounded-[1.5rem] border border-[#ddcdbd] bg-[#fffdf9] px-4 sm:px-7">{t.faq.map((item) => <details key={item.question} className="group py-4"><summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-serif text-[1.02rem] font-semibold leading-snug text-[#513d31] sm:text-xl [&::-webkit-details-marker]:hidden">{item.question}<span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#6f5949] text-white transition group-open:rotate-45">+</span></summary><p className="pb-1 pt-3 text-sm leading-6 text-[#6d5949] sm:text-base">{item.answer}</p></details>)}</div></div>
      </section>

      <section className="px-4 py-7 sm:px-6 sm:py-12 lg:px-8"><div className="relative mx-auto max-w-7xl overflow-hidden rounded-[1.6rem] bg-[#e8ddd2] px-5 py-8 shadow-xl shadow-[#6f5949]/10 sm:rounded-[2.5rem] sm:px-10 sm:py-14"><Image src={data.gallery[1].image} alt={data.gallery[1].imageAlt} fill className="object-cover opacity-20" sizes="100vw" /><div className="absolute inset-0 bg-gradient-to-r from-[#f4ede5]/95 via-[#efe5dc]/90 to-[#eadfd4]/75" /><div className="relative z-10 grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end"><div className="max-w-3xl"><p className={eyebrow}>{data.stay.kicker}</p><h2 className={`${heading} mt-3`}>{data.stay.title}</h2><p className={`${body} mt-3`}>{data.stay.text}</p></div><div className="grid grid-cols-2 gap-2.5 sm:flex"><Cta href={data.stay.primaryCta.href}>{data.stay.primaryCta.label}</Cta><Cta href={data.stay.secondaryCta.href} secondary>{data.stay.secondaryCta.label}</Cta></div></div></div></section>
    </main>
  );
}
