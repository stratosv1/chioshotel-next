"use client";

import Image from "next/image";
import { useState } from "react";
import type { IndividualRoomData, RoomDetailData } from "@/content/room-details";

type RoomDetailPageProps = { data: RoomDetailData };
type RoomLanguage = "en" | "el" | "fr" | "de" | "it" | "es" | "tr";

function getRoomLanguage(path: string): RoomLanguage {
  if (path.startsWith("/el/")) return "el";
  if (path.startsWith("/fr/")) return "fr";
  if (path.startsWith("/de/")) return "de";
  if (path.startsWith("/it/")) return "it";
  if (path.startsWith("/es/")) return "es";
  if (path.startsWith("/tr/")) return "tr";
  return "en";
}

const roomLabels: Record<RoomLanguage, { upToGuests: (count: number) => string; faqKicker: string; faqTitle: string }> = {
  en: { upToGuests: (count) => `Up to ${count} guests`, faqKicker: "Questions", faqTitle: "Room FAQ" },
  el: { upToGuests: (count) => `Έως ${count} άτομα`, faqKicker: "Ερωτήσεις", faqTitle: "Συχνές ερωτήσεις δωματίου" },
  fr: { upToGuests: (count) => `Jusqu’à ${count} personnes`, faqKicker: "Questions", faqTitle: "FAQ de la chambre" },
  de: { upToGuests: (count) => `Bis zu ${count} Gäste`, faqKicker: "Fragen", faqTitle: "Zimmer-FAQ" },
  it: { upToGuests: (count) => `Fino a ${count} ospiti`, faqKicker: "Domande", faqTitle: "FAQ della camera" },
  es: { upToGuests: (count) => `Hasta ${count} personas`, faqKicker: "Preguntas", faqTitle: "Preguntas frecuentes de la habitación" },
  tr: { upToGuests: (count) => `${count} kişiye kadar`, faqKicker: "Sorular", faqTitle: "Oda SSS" },
};

const roomSectionLabels: Record<RoomLanguage, { groundTitle: string; groundText: string; firstTitle: string; firstText: string }> = {
  en: {
    groundTitle: "Ground floor rooms",
    groundText: "Rooms with easy courtyard and garden access, ideal if you prefer fewer steps and a simple outdoor connection.",
    firstTitle: "First floor rooms",
    firstText: "Brighter upper-floor rooms with terrace feel or Kambos views, accessed by stairs.",
  },
  el: {
    groundTitle: "Δωμάτια ισογείου",
    groundText: "Δωμάτια με εύκολη πρόσβαση στην αυλή και στον κήπο, ιδανικά αν προτιμάτε λιγότερα σκαλιά και άμεση επαφή με τον εξωτερικό χώρο.",
    firstTitle: "Δωμάτια ορόφου",
    firstText: "Πιο φωτεινά δωμάτια στον όροφο με αίσθηση βεράντας ή θέα προς τον Κάμπο, με πρόσβαση από σκάλες.",
  },
  fr: {
    groundTitle: "Chambres au rez-de-chaussée",
    groundText: "Chambres avec accès facile à la cour et au jardin, idéales si vous préférez peu de marches et un lien direct avec l’extérieur.",
    firstTitle: "Chambres au premier étage",
    firstText: "Chambres plus lumineuses à l’étage, avec atmosphère de terrasse ou vue sur Kambos, accessibles par escalier.",
  },
  de: {
    groundTitle: "Zimmer im Erdgeschoss",
    groundText: "Zimmer mit einfachem Zugang zum Hof und Garten, ideal, wenn Sie wenige Treppen und eine direkte Verbindung nach draußen bevorzugen.",
    firstTitle: "Zimmer in der ersten Etage",
    firstText: "Hellere Zimmer im Obergeschoss mit Terrassengefühl oder Blick auf Kambos, erreichbar über Treppen.",
  },
  it: {
    groundTitle: "Camere al piano terra",
    groundText: "Camere con facile accesso al cortile e al giardino, ideali se preferisci pochi gradini e un contatto diretto con l’esterno.",
    firstTitle: "Camere al primo piano",
    firstText: "Camere più luminose al piano superiore, con atmosfera da terrazza o vista su Kambos, accessibili tramite scale.",
  },
  es: {
    groundTitle: "Habitaciones en planta baja",
    groundText: "Habitaciones con fácil acceso al patio y al jardín, ideales si prefieres menos escaleras y conexión directa con el exterior.",
    firstTitle: "Habitaciones en primera planta",
    firstText: "Habitaciones más luminosas en planta superior, con ambiente de terraza o vistas a Kambos, accesibles por escaleras.",
  },
  tr: {
    groundTitle: "Zemin kat odaları",
    groundText: "Avlu ve bahçeye kolay erişimli odalar; az merdiven ve dış alanla doğrudan bağlantı isteyenler için idealdir.",
    firstTitle: "Birinci kat odaları",
    firstText: "Merdivenle ulaşılan, teras hissi veya Kambos manzarası sunan daha aydınlık üst kat odaları.",
  },
};

const roomTextTranslations: Record<string, Partial<Record<RoomLanguage, string>>> = {
  "Ground floor": { el: "Ισόγειο", fr: "Rez-de-chaussée", de: "Erdgeschoss", it: "Piano terra", es: "Planta baja", tr: "Zemin kat" },
  "First floor": { el: "Πρώτος όροφος", fr: "Premier étage", de: "Erster Stock", it: "Primo piano", es: "Primera planta", tr: "Birinci kat" },
  "Stand alone": { el: "Ανεξάρτητο", fr: "Indépendant", de: "Separat", it: "Indipendente", es: "Independiente", tr: "Bağımsız" },
  "Ground-floor double / triple": { el: "Ισόγειο δίκλινο / τρίκλινο", fr: "Double / triple au rez-de-chaussée", de: "Doppel- / Dreibettzimmer im Erdgeschoss", it: "Doppia / tripla al piano terra", es: "Doble / triple en planta baja", tr: "Zemin kat çift / üç kişilik oda" },
  "First-floor double / triple": { el: "Δίκλινο / τρίκλινο πρώτου ορόφου", fr: "Double / triple au premier étage", de: "Doppel- / Dreibettzimmer im ersten Stock", it: "Doppia / tripla al primo piano", es: "Doble / triple en primera planta", tr: "Birinci kat çift / üç kişilik oda" },
  "Budget double room": { el: "Οικονομικό δίκλινο", fr: "Chambre double économique", de: "Economy Doppelzimmer", it: "Camera doppia economy", es: "Habitación doble económica", tr: "Ekonomik çift kişilik oda" },
  Apartment: { el: "Διαμέρισμα", fr: "Appartement", de: "Apartment", it: "Appartamento", es: "Apartamento", tr: "Daire" },
  "Garden access": { el: "Πρόσβαση στον κήπο", fr: "Accès jardin", de: "Gartenzugang", it: "Accesso al giardino", es: "Acceso al jardín", tr: "Bahçe erişimi" },
  "No stairs": { el: "Χωρίς σκάλες", fr: "Sans escaliers", de: "Keine Treppen", it: "Senza scale", es: "Sin escaleras", tr: "Merdivensiz" },
  Economy: { el: "Οικονομικό", fr: "Économique", de: "Economy", it: "Economy", es: "Económico", tr: "Ekonomik" },
  "Kambos view": { el: "Θέα στον Κάμπο", fr: "Vue sur Kambos", de: "Blick auf Kambos", it: "Vista su Kambos", es: "Vista a Kambos", tr: "Kambos manzarası" },
  "Sofa bed": { el: "Καναπές-κρεβάτι", fr: "Canapé-lit", de: "Schlafsofa", it: "Divano letto", es: "Sofá cama", tr: "Çekyat" },
  Kitchenette: { el: "Μικρή κουζίνα", fr: "Kitchenette", de: "Kitchenette", it: "Angolo cottura", es: "Kitchenette", tr: "Kitchenette" },
  "Full kitchen": { el: "Πλήρης κουζίνα", fr: "Cuisine complète", de: "Voll ausgestattete Küche", it: "Cucina completa", es: "Cocina completa", tr: "Tam mutfak" },
  "Family space": { el: "Οικογενειακός χώρος", fr: "Espace familial", de: "Familienbereich", it: "Spazio famiglia", es: "Espacio familiar", tr: "Aile alanı" },
  "Upper-floor view": { el: "Θέα από όροφο", fr: "Vue depuis l’étage", de: "Blick vom Obergeschoss", it: "Vista dal piano superiore", es: "Vista desde la planta superior", tr: "Üst kat manzarası" },
  "Private balcony": { el: "Ιδιωτικό μπαλκόνι", fr: "Balcon privé", de: "Privater Balkon", it: "Balcone privato", es: "Balcón privado", tr: "Özel balkon" },
  "Garden view": { el: "Θέα στον κήπο", fr: "Vue jardin", de: "Gartenblick", it: "Vista giardino", es: "Vista al jardín", tr: "Bahçe manzarası" },
  "Courtyard access": { el: "Πρόσβαση στην αυλή", fr: "Accès à la cour", de: "Zugang zum Innenhof", it: "Accesso al cortile", es: "Acceso al patio", tr: "Avlu erişimi" },
  "Budget friendly": { el: "Οικονομική επιλογή", fr: "Économique", de: "Preiswert", it: "Economica", es: "Económica", tr: "Ekonomik seçenek" },
  Renovated: { el: "Ανακαινισμένο", fr: "Rénové", de: "Renoviert", it: "Rinnovata", es: "Renovada", tr: "Yenilenmiş" },
  "Free WiFi": { el: "Δωρεάν WiFi", fr: "WiFi gratuit", de: "Kostenloses WLAN", it: "WiFi gratuito", es: "WiFi gratis", tr: "Ücretsiz WiFi" },
  "Air conditioning": { el: "Κλιματισμός", fr: "Climatisation", de: "Klimaanlage", it: "Aria condizionata", es: "Aire acondicionado", tr: "Klima" },
  "Private bathroom": { el: "Ιδιωτικό μπάνιο", fr: "Salle de bain privée", de: "Eigenes Bad", it: "Bagno privato", es: "Baño privado", tr: "Özel banyo" },
  Refrigerator: { el: "Ψυγείο", fr: "Réfrigérateur", de: "Kühlschrank", it: "Frigorifero", es: "Nevera", tr: "Buzdolabı" },
  Hairdryer: { el: "Σεσουάρ", fr: "Sèche-cheveux", de: "Haartrockner", it: "Asciugacapelli", es: "Secador de pelo", tr: "Saç kurutma makinesi" },
  "Wi-Fi": { el: "Wi‑Fi", fr: "Wi‑Fi", de: "WLAN", it: "Wi‑Fi", es: "Wi‑Fi", tr: "Wi‑Fi" },
  "1 double bed": { el: "1 διπλό κρεβάτι", fr: "1 lit double", de: "1 Doppelbett", it: "1 letto matrimoniale", es: "1 cama doble", tr: "1 çift kişilik yatak" },
  "1 single bed": { el: "1 μονό κρεβάτι", fr: "1 lit simple", de: "1 Einzelbett", it: "1 letto singolo", es: "1 cama individual", tr: "1 tek kişilik yatak" },
  "2 single beds": { el: "2 μονά κρεβάτια", fr: "2 lits simples", de: "2 Einzelbetten", it: "2 letti singoli", es: "2 camas individuales", tr: "2 tek kişilik yatak" },
  "1 sofa bed": { el: "1 καναπές-κρεβάτι", fr: "1 canapé-lit", de: "1 Schlafsofa", it: "1 divano letto", es: "1 sofá cama", tr: "1 çekyat" },
  "2 sofa beds": { el: "2 καναπέδες-κρεβάτια", fr: "2 canapés-lits", de: "2 Schlafsofas", it: "2 divani letto", es: "2 sofás cama", tr: "2 çekyat" },
  "Coffee and tea kettle": { el: "Βραστήρας για καφέ και τσάι", fr: "Bouilloire pour café et thé", de: "Wasserkocher für Kaffee und Tee", it: "Bollitore per caffè e tè", es: "Hervidor para café y té", tr: "Kahve ve çay için su ısıtıcısı" },
  "Ground-floor view": { el: "Θέα ισογείου", fr: "Vue du rez-de-chaussée", de: "Blick im Erdgeschoss", it: "Vista dal piano terra", es: "Vista de planta baja", tr: "Zemin kat manzarası" },
  "Open-plan space": { el: "Ενιαίος χώρος", fr: "Espace ouvert", de: "Offener Raum", it: "Spazio open space", es: "Espacio abierto", tr: "Açık plan alan" },
  "Access by stairs": { el: "Πρόσβαση με σκάλες", fr: "Accès par escalier", de: "Zugang über Treppen", it: "Accesso tramite scale", es: "Acceso por escaleras", tr: "Merdivenle erişim" },
  "Two spaces, no connecting door": { el: "Δύο χώροι, χωρίς ενδιάμεση πόρτα", fr: "Deux espaces, sans porte communicante", de: "Zwei Bereiche, keine Verbindungstür", it: "Due ambienti, senza porta comunicante", es: "Dos espacios, sin puerta comunicante", tr: "İki alan, ara kapı yok" },
};

function localizeRoomText(text: string, language: RoomLanguage) {
  if (language === "en") return text;
  const exactMatch = roomTextTranslations[text]?.[language];
  if (exactMatch) return exactMatch;
  const guestMatch = text.match(/^Up to (\d+) guests$/);
  return guestMatch ? roomLabels[language].upToGuests(Number(guestMatch[1])) : text;
}

function shouldGroupRoomsByFloor(data: RoomDetailData) {
  return data.id === "standard-double-room" || data.id === "economy-double-rooms";
}

function RoomGallery({ data }: { data: RoomDetailData }) {
  const [activeImage, setActiveImage] = useState(data.gallery.images[0]);

  return (
    <section className="rd-section rd-section--gallery" aria-labelledby="rd-gallery-title">
      <div className="rd-wrap">
        <header className="rd-section-head">
          <span className="rd-kicker">{data.gallery.kicker}</span>
          <h2 id="rd-gallery-title">{data.gallery.title}</h2>
        </header>
        <div className="rd-gallery">
          <div className="rd-gallery-main">
            <Image src={activeImage.src} alt={activeImage.alt} width={1200} height={800} sizes="(max-width: 768px) 100vw, 900px" />
          </div>
          <div className="rd-gallery-thumbs" aria-label="Room gallery thumbnails">
            {data.gallery.images.map((image, index) => (
              <button type="button" className={`rd-gallery-thumb ${activeImage.src === image.src ? "is-active" : ""}`} key={image.src} onClick={() => setActiveImage(image)} aria-label={`Show photo ${index + 1}`}>
                <Image src={image.src} alt={image.alt} width={220} height={150} sizes="110px" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function IndividualRoomCard({ room, language }: { room: IndividualRoomData; language: RoomLanguage }) {
  const [activeImage, setActiveImage] = useState(room.images[0]);
  const labels = roomLabels[language];

  return (
    <article className="rd-room-card">
      <div className="rd-room-card__media">
        <div className="rd-room-main-image">
          <Image src={activeImage.src} alt={activeImage.alt} width={900} height={600} sizes="(max-width: 768px) 84vw, 640px" />
          <span>{localizeRoomText(activeImage.caption, language)}</span>
        </div>
        <div className="rd-room-thumbs" aria-label={`${room.name} photos`}>
          {room.images.map((image, index) => (
            <button type="button" className={`rd-room-thumb ${activeImage.src === image.src ? "is-active" : ""}`} key={image.src} onClick={() => setActiveImage(image)} aria-label={`Show ${room.name} photo ${index + 1}`}>
              <Image src={image.src} alt={image.alt} width={220} height={150} sizes="110px" />
            </button>
          ))}
        </div>
      </div>
      <div className="rd-room-card__body">
        <div className="rd-room-topline">
          <span>{localizeRoomText(room.location, language)}</span>
          <strong>{labels.upToGuests(room.maxGuests)}</strong>
        </div>
        <h3>{room.name}</h3>
        <p className="rd-room-type">{localizeRoomText(room.type, language)}</p>
        <p className="rd-room-description">{room.description}</p>
        <div className="rd-room-badges" aria-label={`${room.name} highlights`}>
          {room.badges.map((badge) => <span key={badge}>{localizeRoomText(badge, language)}</span>)}
        </div>
        <div className="rd-room-beds" aria-label={`${room.name} beds`}>
          {room.beds.map((bed) => <span key={bed}>🛏️ {localizeRoomText(bed, language)}</span>)}
        </div>
        <div className="rd-room-amenities" aria-label={`${room.name} amenities`}>
          {room.amenities.map((amenity) => <span key={`${amenity.icon}-${amenity.label}`}>{amenity.icon} {localizeRoomText(amenity.label, language)}</span>)}
        </div>
      </div>
    </article>
  );
}

function FloorRoomGroup({ title, text, rooms, language }: { title: string; text: string; rooms: IndividualRoomData[]; language: RoomLanguage }) {
  if (!rooms.length) return null;

  return (
    <section className="rd-floor-group" aria-label={title}>
      <header className="rd-floor-head">
        <h3>{title}</h3>
        <p>{text}</p>
      </header>
      <div className="rd-individual-list rd-individual-list--carousel">
        {rooms.map((room) => <IndividualRoomCard room={room} language={language} key={room.id} />)}
      </div>
    </section>
  );
}

function IndividualRoomsSection({ data }: { data: RoomDetailData }) {
  const language = getRoomLanguage(data.seo.canonicalPath);
  const sectionLabels = roomSectionLabels[language];

  if (!data.individualRooms.rooms.length) return null;

  if (shouldGroupRoomsByFloor(data)) {
    const groundFloorRooms = data.individualRooms.rooms.filter((room) => room.location === "Ground floor");
    const firstFloorRooms = data.individualRooms.rooms.filter((room) => room.location === "First floor");

    return (
      <section className="rd-section rd-section--individual rd-section--grouped" aria-labelledby="rd-individual-title">
        <div className="rd-wrap">
          <header className="rd-section-head">
            <span className="rd-kicker">{data.individualRooms.kicker}</span>
            <h2 id="rd-individual-title">{data.individualRooms.title}</h2>
            <p>{data.individualRooms.description}</p>
          </header>
          <div className="rd-floor-groups">
            <FloorRoomGroup title={sectionLabels.groundTitle} text={sectionLabels.groundText} rooms={groundFloorRooms} language={language} />
            <FloorRoomGroup title={sectionLabels.firstTitle} text={sectionLabels.firstText} rooms={firstFloorRooms} language={language} />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="rd-section rd-section--individual" aria-labelledby="rd-individual-title">
      <div className="rd-wrap">
        <header className="rd-section-head">
          <span className="rd-kicker">{data.individualRooms.kicker}</span>
          <h2 id="rd-individual-title">{data.individualRooms.title}</h2>
          <p>{data.individualRooms.description}</p>
        </header>
        <div className="rd-individual-list">
          {data.individualRooms.rooms.map((room) => <IndividualRoomCard room={room} language={language} key={room.id} />)}
        </div>
      </div>
    </section>
  );
}

export function RoomDetailPage({ data }: RoomDetailPageProps) {
  const language = getRoomLanguage(data.seo.canonicalPath);
  const labels = roomLabels[language];
  const showMixedGallery = !shouldGroupRoomsByFloor(data);

  return (
    <main className="room-detail-page">
      <section className="rd-hero" aria-labelledby="rd-hero-title">
        <div className="rd-hero-media" aria-hidden="true"><Image src={data.hero.image} alt="" fill priority fetchPriority="high" sizes="100vw" /></div>
        <div className="rd-hero-overlay" />
        <div className="rd-hero-inner">
          <div className="rd-hero-card">
            <span className="rd-kicker rd-kicker--light">{data.hero.kicker}</span>
            <h1 id="rd-hero-title">{data.hero.title}</h1>
            <p className="rd-hero-subtitle">{data.hero.subtitle}</p>
            <p className="rd-hero-description">{data.hero.description}</p>
            <div className="rd-hero-badges" aria-label="Room highlights">{data.hero.badges.map((badge) => <span key={badge}>{localizeRoomText(badge, language)}</span>)}</div>
            <div className="rd-hero-actions"><a className="rd-btn rd-btn--primary" href={data.hero.primaryCta.href}>{data.hero.primaryCta.label}</a><a className="rd-btn rd-btn--secondary" href={data.hero.secondaryCta.href}>{data.hero.secondaryCta.label}</a></div>
          </div>
        </div>
      </section>

      <section className="rd-section rd-section--overview" aria-labelledby="rd-overview-title">
        <div className="rd-wrap rd-overview-grid">
          <article className="rd-overview-copy">
            <span className="rd-kicker">{data.overview.kicker}</span>
            <h2 id="rd-overview-title">{data.overview.title}</h2>
            {data.overview.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </article>
          <aside className="rd-highlight-panel" aria-label="Room key details">{data.overview.highlights.map((highlight) => <div className="rd-highlight-item" key={highlight.label}><span>{highlight.label}</span><strong>{localizeRoomText(highlight.value, language)}</strong></div>)}</aside>
        </div>
      </section>

      {showMixedGallery ? <RoomGallery data={data} /> : null}
      <IndividualRoomsSection data={data} />

      <section className="rd-section" aria-labelledby="rd-amenities-title"><div className="rd-wrap"><header className="rd-section-head"><span className="rd-kicker">{data.amenities.kicker}</span><h2 id="rd-amenities-title">{data.amenities.title}</h2></header><div className="rd-amenities-grid">{data.amenities.items.map((item) => <article className="rd-amenity-card" key={item.label}><div className="rd-amenity-icon" aria-hidden="true">{item.icon}</div><div><h3>{localizeRoomText(item.label, language)}</h3><p>{item.text}</p></div></article>)}</div></div></section>
      <section className="rd-section rd-section--best" aria-labelledby="rd-best-title"><div className="rd-wrap rd-best-grid"><article><span className="rd-kicker">{data.bestFor.kicker}</span><h2 id="rd-best-title">{data.bestFor.title}</h2></article><div className="rd-best-list">{data.bestFor.items.map((item) => <div className="rd-best-item" key={item}><span aria-hidden="true">✓</span><p>{item}</p></div>)}</div></div></section>
      <section className="rd-section rd-section--booking" aria-labelledby="rd-booking-title"><div className="rd-wrap"><div className="rd-booking-card"><div><span className="rd-kicker rd-kicker--light">{data.booking.kicker}</span><h2 id="rd-booking-title">{data.booking.title}</h2><p>{data.booking.text}</p><small>{data.booking.note}</small></div><div className="rd-booking-actions"><a className="rd-btn rd-btn--primary" href={data.booking.whatsappHref}>{data.booking.whatsappLabel}</a><a className="rd-btn rd-btn--secondary" href={data.booking.phoneHref}>{data.booking.phoneLabel}</a></div></div></div></section>
      <section className="rd-section rd-section--faq" aria-labelledby="rd-faq-title"><div className="rd-wrap"><header className="rd-section-head"><span className="rd-kicker">{labels.faqKicker}</span><h2 id="rd-faq-title">{labels.faqTitle}</h2></header><div className="rd-faq-list">{data.faq.map((item) => <details className="rd-faq-item" key={item.question}><summary>{item.question}</summary><p>{item.answer}</p></details>)}</div></div></section>
    </main>
  );
}
