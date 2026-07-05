"use client";

import Image from "next/image";

import { useState } from "react";
import type { IndividualRoomData, RoomDetailData } from "@/content/room-details";

type RoomDetailPageProps = {
  data: RoomDetailData;
};

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
  en: {
    upToGuests: (count) => `Up to ${count} guests`,
    faqKicker: "Questions",
    faqTitle: "Room FAQ",
  },
  el: {
    upToGuests: (count) => `Έως ${count} άτομα`,
    faqKicker: "Ερωτήσεις",
    faqTitle: "Συχνές ερωτήσεις δωματίου",
  },
  fr: {
    upToGuests: (count) => `Jusqu’à ${count} personnes`,
    faqKicker: "Questions",
    faqTitle: "FAQ de la chambre",
  },
  de: {
    upToGuests: (count) => `Bis zu ${count} Gäste`,
    faqKicker: "Fragen",
    faqTitle: "Zimmer-FAQ",
  },
  it: {
    upToGuests: (count) => `Fino a ${count} ospiti`,
    faqKicker: "Domande",
    faqTitle: "FAQ della camera",
  },
  es: {
    upToGuests: (count) => `Hasta ${count} personas`,
    faqKicker: "Preguntas",
    faqTitle: "Preguntas frecuentes de la habitación",
  },
  tr: {
    upToGuests: (count) => `${count} kişiye kadar`,
    faqKicker: "Sorular",
    faqTitle: "Oda SSS",
  },
};

const roomTextTranslations: Record<RoomLanguage, Record<string, string>> = {
  en: {},
  el: {
    "Ground floor": "Ισόγειο",
    "First floor": "Πρώτος όροφος",
    "Stand alone": "Ανεξάρτητο",
    "Ground-floor double / triple": "Ισόγειο δίκλινο / τρίκλινο",
    "First-floor double / triple": "Δίκλινο / τρίκλινο πρώτου ορόφου",
    "Apartment": "Διαμέρισμα",
    "Garden access": "Πρόσβαση στον κήπο",
    "No stairs": "Χωρίς σκάλες",
    "Up to 2 guests": "Έως 2 άτομα",
    "Up to 3 guests": "Έως 3 άτομα",
    "Up to 4 guests": "Έως 4 άτομα",
    "Sofa bed": "Καναπές-κρεβάτι",
    "First floor": "Πρώτος όροφος",
    "Upper-floor view": "Θέα από όροφο",
    "Private balcony": "Ιδιωτικό μπαλκόνι",
    "Kitchenette": "Μικρή κουζίνα",
    "Full kitchen": "Πλήρης κουζίνα",
    "Family space": "Οικογενειακός χώρος",
    "Garden view": "Θέα στον κήπο",
    "Courtyard access": "Πρόσβαση στην αυλή",
    "Budget friendly": "Οικονομική επιλογή",
    "Renovated": "Ανακαινισμένο",
    "Free WiFi": "Δωρεάν WiFi",
    "Air conditioning": "Κλιματισμός",
    "1 double bed": "1 διπλό κρεβάτι",
    "1 single bed": "1 μονό κρεβάτι",
    "2 single beds": "2 μονά κρεβάτια",
    "1 sofa bed": "1 καναπές-κρεβάτι",
    "2 sofa beds": "2 καναπέδες-κρεβάτια",
    "Coffee and tea kettle": "Βραστήρας για καφέ και τσάι",
    "Ground-floor view": "Θέα ισογείου",
    "Open-plan space": "Ενιαίος χώρος",
    "Access by stairs": "Πρόσβαση με σκάλες",
    "Two spaces, no connecting door": "Δύο χώροι, χωρίς ενδιάμεση πόρτα",
    "Private bathroom": "Ιδιωτικό μπάνιο",
    "Refrigerator": "Ψυγείο",
    "Hairdryer": "Σεσουάρ",
  },
  fr: {
    "Ground floor": "Rez-de-chaussée",
    "First floor": "Premier étage",
    "Stand alone": "Indépendant",
    "Ground-floor double / triple": "Double / triple au rez-de-chaussée",
    "First-floor double / triple": "Double / triple au premier étage",
    "Apartment": "Appartement",
    "Garden access": "Accès jardin",
    "No stairs": "Sans escaliers",
    "Up to 2 guests": "Jusqu’à 2 personnes",
    "Up to 3 guests": "Jusqu’à 3 personnes",
    "Up to 4 guests": "Jusqu’à 4 personnes",
    "Sofa bed": "Canapé-lit",
    "Upper-floor view": "Vue depuis l’étage",
    "Private balcony": "Balcon privé",
    "Kitchenette": "Kitchenette",
    "Full kitchen": "Cuisine complète",
    "Family space": "Espace familial",
    "Garden view": "Vue jardin",
    "Courtyard access": "Accès à la cour",
    "Budget friendly": "Économique",
    "Renovated": "Rénové",
    "Free WiFi": "WiFi gratuit",
    "Air conditioning": "Climatisation",
    "1 double bed": "1 lit double",
    "1 single bed": "1 lit simple",
    "2 single beds": "2 lits simples",
    "1 sofa bed": "1 canapé-lit",
    "2 sofa beds": "2 canapés-lits",
    "Coffee and tea kettle": "Bouilloire pour café et thé",
    "Ground-floor view": "Vue du rez-de-chaussée",
    "Open-plan space": "Espace ouvert",
    "Access by stairs": "Accès par escalier",
    "Two spaces, no connecting door": "Deux espaces, sans porte communicante",
    "Private bathroom": "Salle de bain privée",
    "Refrigerator": "Réfrigérateur",
    "Hairdryer": "Sèche-cheveux",
  },
  de: {
    "Ground floor": "Erdgeschoss",
    "First floor": "Erster Stock",
    "Stand alone": "Separat",
    "Ground-floor double / triple": "Doppel- / Dreibettzimmer im Erdgeschoss",
    "First-floor double / triple": "Doppel- / Dreibettzimmer im ersten Stock",
    "Apartment": "Apartment",
    "Garden access": "Gartenzugang",
    "No stairs": "Keine Treppen",
    "Up to 2 guests": "Bis zu 2 Gäste",
    "Up to 3 guests": "Bis zu 3 Gäste",
    "Up to 4 guests": "Bis zu 4 Gäste",
    "Sofa bed": "Schlafsofa",
    "Upper-floor view": "Blick vom Obergeschoss",
    "Private balcony": "Privater Balkon",
    "Kitchenette": "Kitchenette",
    "Full kitchen": "Voll ausgestattete Küche",
    "Family space": "Familienbereich",
    "Garden view": "Gartenblick",
    "Courtyard access": "Zugang zum Innenhof",
    "Budget friendly": "Preiswert",
    "Renovated": "Renoviert",
    "Free WiFi": "Kostenloses WLAN",
    "Air conditioning": "Klimaanlage",
    "1 double bed": "1 Doppelbett",
    "1 single bed": "1 Einzelbett",
    "2 single beds": "2 Einzelbetten",
    "1 sofa bed": "1 Schlafsofa",
    "2 sofa beds": "2 Schlafsofas",
    "Coffee and tea kettle": "Wasserkocher für Kaffee und Tee",
    "Ground-floor view": "Blick im Erdgeschoss",
    "Open-plan space": "Offener Raum",
    "Access by stairs": "Zugang über Treppen",
    "Two spaces, no connecting door": "Zwei Bereiche, keine Verbindungstür",
    "Private bathroom": "Eigenes Bad",
    "Refrigerator": "Kühlschrank",
    "Hairdryer": "Haartrockner",
  },
  it: {
    "Ground floor": "Piano terra",
    "First floor": "Primo piano",
    "Stand alone": "Indipendente",
    "Ground-floor double / triple": "Doppia / tripla al piano terra",
    "First-floor double / triple": "Doppia / tripla al primo piano",
    "Apartment": "Appartamento",
    "Garden access": "Accesso al giardino",
    "No stairs": "Senza scale",
    "Up to 2 guests": "Fino a 2 ospiti",
    "Up to 3 guests": "Fino a 3 ospiti",
    "Up to 4 guests": "Fino a 4 ospiti",
    "Sofa bed": "Divano letto",
    "Upper-floor view": "Vista dal piano superiore",
    "Private balcony": "Balcone privato",
    "Kitchenette": "Angolo cottura",
    "Full kitchen": "Cucina completa",
    "Family space": "Spazio famiglia",
    "Garden view": "Vista giardino",
    "Courtyard access": "Accesso al cortile",
    "Budget friendly": "Economica",
    "Renovated": "Rinnovata",
    "Free WiFi": "WiFi gratuito",
    "Air conditioning": "Aria condizionata",
    "1 double bed": "1 letto matrimoniale",
    "1 single bed": "1 letto singolo",
    "2 single beds": "2 letti singoli",
    "1 sofa bed": "1 divano letto",
    "2 sofa beds": "2 divani letto",
    "Coffee and tea kettle": "Bollitore per caffè e tè",
    "Ground-floor view": "Vista dal piano terra",
    "Open-plan space": "Spazio open space",
    "Access by stairs": "Accesso tramite scale",
    "Two spaces, no connecting door": "Due ambienti, senza porta comunicante",
    "Private bathroom": "Bagno privato",
    "Refrigerator": "Frigorifero",
    "Hairdryer": "Asciugacapelli",
  },
  es: {
    "Ground floor": "Planta baja",
    "First floor": "Primera planta",
    "Stand alone": "Independiente",
    "Ground-floor double / triple": "Doble / triple en planta baja",
    "First-floor double / triple": "Doble / triple en primera planta",
    "Apartment": "Apartamento",
    "Garden access": "Acceso al jardín",
    "No stairs": "Sin escaleras",
    "Up to 2 guests": "Hasta 2 personas",
    "Up to 3 guests": "Hasta 3 personas",
    "Up to 4 guests": "Hasta 4 personas",
    "Sofa bed": "Sofá cama",
    "Upper-floor view": "Vista desde la planta superior",
    "Private balcony": "Balcón privado",
    "Kitchenette": "Kitchenette",
    "Full kitchen": "Cocina completa",
    "Family space": "Espacio familiar",
    "Garden view": "Vista al jardín",
    "Courtyard access": "Acceso al patio",
    "Budget friendly": "Económica",
    "Renovated": "Renovada",
    "Free WiFi": "WiFi gratis",
    "Air conditioning": "Aire acondicionado",
    "1 double bed": "1 cama doble",
    "1 single bed": "1 cama individual",
    "2 single beds": "2 camas individuales",
    "1 sofa bed": "1 sofá cama",
    "2 sofa beds": "2 sofás cama",
    "Coffee and tea kettle": "Hervidor para café y té",
    "Ground-floor view": "Vista de planta baja",
    "Open-plan space": "Espacio abierto",
    "Access by stairs": "Acceso por escaleras",
    "Two spaces, no connecting door": "Dos espacios, sin puerta comunicante",
    "Private bathroom": "Baño privado",
    "Refrigerator": "Nevera",
    "Hairdryer": "Secador de pelo",
  },
  tr: {
    "Ground floor": "Zemin kat",
    "First floor": "Birinci kat",
    "Stand alone": "Bağımsız",
    "Ground-floor double / triple": "Zemin kat çift / üç kişilik oda",
    "First-floor double / triple": "Birinci kat çift / üç kişilik oda",
    "Apartment": "Daire",
    "Garden access": "Bahçe erişimi",
    "No stairs": "Merdivensiz",
    "Up to 2 guests": "2 kişiye kadar",
    "Up to 3 guests": "3 kişiye kadar",
    "Up to 4 guests": "4 kişiye kadar",
    "Sofa bed": "Çekyat",
    "Upper-floor view": "Üst kat manzarası",
    "Private balcony": "Özel balkon",
    "Kitchenette": "Kitchenette",
    "Full kitchen": "Tam mutfak",
    "Family space": "Aile alanı",
    "Garden view": "Bahçe manzarası",
    "Courtyard access": "Avlu erişimi",
    "Budget friendly": "Ekonomik seçenek",
    "Renovated": "Yenilenmiş",
    "Free WiFi": "Ücretsiz WiFi",
    "Air conditioning": "Klima",
    "1 double bed": "1 çift kişilik yatak",
    "1 single bed": "1 tek kişilik yatak",
    "2 single beds": "2 tek kişilik yatak",
    "1 sofa bed": "1 çekyat",
    "2 sofa beds": "2 çekyat",
    "Coffee and tea kettle": "Kahve ve çay için su ısıtıcısı",
    "Ground-floor view": "Zemin kat manzarası",
    "Open-plan space": "Açık plan alan",
    "Access by stairs": "Merdivenle erişim",
    "Two spaces, no connecting door": "İki alan, ara kapı yok",
    "Private bathroom": "Özel banyo",
    "Refrigerator": "Buzdolabı",
    "Hairdryer": "Saç kurutma makinesi",
  },
};

function localizeRoomText(text: string, language: RoomLanguage) {
  return roomTextTranslations[language][text] || text;
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
            <Image
              src={activeImage.src}
              alt={activeImage.alt}
              width={1200}
              height={800}
              sizes="(max-width: 768px) 100vw, 900px"
            />
          </div>

          <div className="rd-gallery-thumbs" aria-label="Room gallery thumbnails">
            {data.gallery.images.map((image, index) => (
              <button
                type="button"
                className={`rd-gallery-thumb ${
                  activeImage.src === image.src ? "is-active" : ""
                }`}
                key={image.src}
                onClick={() => setActiveImage(image)}
                aria-label={`Show photo ${index + 1}`}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={220}
                  height={150}
                  sizes="110px"
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function IndividualRoomCard({
  room,
  language,
}: {
  room: IndividualRoomData;
  language: RoomLanguage;
}) {
  const [activeImage, setActiveImage] = useState(room.images[0]);
  const labels = roomLabels[language];

  return (
    <article className="rd-room-card">
      <div className="rd-room-card__media">
        <div className="rd-room-main-image">
          <Image
            src={activeImage.src}
            alt={activeImage.alt}
            width={900}
            height={600}
            sizes="(max-width: 768px) 100vw, 640px"
          />
          <span>{localizeRoomText(activeImage.caption, language)}</span>
        </div>

        <div className="rd-room-thumbs" aria-label={`${room.name} photos`}>
          {room.images.map((image, index) => (
            <button
              type="button"
              className={`rd-room-thumb ${activeImage.src === image.src ? "is-active" : ""}`}
              key={image.src}
              onClick={() => setActiveImage(image)}
              aria-label={`Show ${room.name} photo ${index + 1}`}
            >
              <Image
                src={image.src}
                alt={image.alt}
                width={220}
                height={150}
                sizes="110px"
              />
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
          {room.badges.map((badge) => (
            <span key={badge}>{localizeRoomText(badge, language)}</span>
          ))}
        </div>

        <div className="rd-room-beds" aria-label={`${room.name} beds`}>
          {room.beds.map((bed) => (
            <span key={bed}>🛏️ {localizeRoomText(bed, language)}</span>
          ))}
        </div>

        <div className="rd-room-amenities" aria-label={`${room.name} amenities`}>
          {room.amenities.map((amenity) => (
            <span key={`${amenity.icon}-${amenity.label}`}>
              {amenity.icon} {localizeRoomText(amenity.label, language)}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}

function IndividualRoomsSection({ data }: { data: RoomDetailData }) {
  const language = getRoomLanguage(data.seo.canonicalPath);

  if (!data.individualRooms.rooms.length) {
    return null;
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
          {data.individualRooms.rooms.map((room) => (
            <IndividualRoomCard room={room} language={language} key={room.id} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function RoomDetailPage({ data }: RoomDetailPageProps) {
  const language = getRoomLanguage(data.seo.canonicalPath);
  const labels = roomLabels[language];

  return (
    <main className="room-detail-page">
      <section className="rd-hero" aria-labelledby="rd-hero-title">
        <div className="rd-hero-media" aria-hidden="true">
          <Image
            src={data.hero.image}
            alt=""
            fill
            priority
            fetchPriority="high"
            sizes="100vw"
          />
        </div>

        <div className="rd-hero-overlay" />

        <div className="rd-hero-inner">
          <div className="rd-hero-card">
            <span className="rd-kicker rd-kicker--light">{data.hero.kicker}</span>

            <h1 id="rd-hero-title">{data.hero.title}</h1>

            <p className="rd-hero-subtitle">{data.hero.subtitle}</p>

            <p className="rd-hero-description">{data.hero.description}</p>

            <div className="rd-hero-badges" aria-label="Room highlights">
              {data.hero.badges.map((badge) => (
                <span key={badge}>{localizeRoomText(badge, language)}</span>
              ))}
            </div>

            <div className="rd-hero-actions">
              <a className="rd-btn rd-btn--primary" href={data.hero.primaryCta.href}>
                {data.hero.primaryCta.label}
              </a>

              <a className="rd-btn rd-btn--secondary" href={data.hero.secondaryCta.href}>
                {data.hero.secondaryCta.label}
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="rd-section rd-section--overview" aria-labelledby="rd-overview-title">
        <div className="rd-wrap rd-overview-grid">
          <article className="rd-overview-copy">
            <span className="rd-kicker">{data.overview.kicker}</span>

            <h2 id="rd-overview-title">{data.overview.title}</h2>

            {data.overview.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </article>

          <aside className="rd-highlight-panel" aria-label="Room key details">
            {data.overview.highlights.map((highlight) => (
              <div className="rd-highlight-item" key={highlight.label}>
                <span>{highlight.label}</span>
                <strong>{localizeRoomText(highlight.value, language)}</strong>
              </div>
            ))}
          </aside>
        </div>
      </section>

      <RoomGallery data={data} />

      <IndividualRoomsSection data={data} />

      <section className="rd-section" aria-labelledby="rd-amenities-title">
        <div className="rd-wrap">
          <header className="rd-section-head">
            <span className="rd-kicker">{data.amenities.kicker}</span>
            <h2 id="rd-amenities-title">{data.amenities.title}</h2>
          </header>

          <div className="rd-amenities-grid">
            {data.amenities.items.map((item) => (
              <article className="rd-amenity-card" key={item.label}>
                <div className="rd-amenity-icon" aria-hidden="true">
                  {item.icon}
                </div>

                <div>
                  <h3>{localizeRoomText(item.label, language)}</h3>
                  <p>{item.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="rd-section rd-section--best" aria-labelledby="rd-best-title">
        <div className="rd-wrap rd-best-grid">
          <article>
            <span className="rd-kicker">{data.bestFor.kicker}</span>
            <h2 id="rd-best-title">{data.bestFor.title}</h2>
          </article>

          <div className="rd-best-list">
            {data.bestFor.items.map((item) => (
              <div className="rd-best-item" key={item}>
                <span aria-hidden="true">✓</span>
                <p>{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rd-section rd-section--booking" aria-labelledby="rd-booking-title">
        <div className="rd-wrap">
          <div className="rd-booking-card">
            <div>
              <span className="rd-kicker rd-kicker--light">{data.booking.kicker}</span>
              <h2 id="rd-booking-title">{data.booking.title}</h2>
              <p>{data.booking.text}</p>
              <small>{data.booking.note}</small>
            </div>

            <div className="rd-booking-actions">
              <a className="rd-btn rd-btn--primary" href={data.booking.whatsappHref}>
                {data.booking.whatsappLabel}
              </a>

              <a className="rd-btn rd-btn--secondary" href={data.booking.phoneHref}>
                {data.booking.phoneLabel}
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="rd-section rd-section--faq" aria-labelledby="rd-faq-title">
        <div className="rd-wrap">
          <header className="rd-section-head">
            <span className="rd-kicker">{labels.faqKicker}</span>
            <h2 id="rd-faq-title">{labels.faqTitle}</h2>
          </header>

          <div className="rd-faq-list">
            {data.faq.map((item) => (
              <details className="rd-faq-item" key={item.question}>
                <summary>{item.question}</summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
