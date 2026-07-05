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
  en: { upToGuests: (count) => `Up to ${count} guests`, faqKicker: "Questions", faqTitle: "Room FAQ" },
  el: { upToGuests: (count) => `Έως ${count} άτομα`, faqKicker: "Ερωτήσεις", faqTitle: "Συχνές ερωτήσεις δωματίου" },
  fr: { upToGuests: (count) => `Jusqu’à ${count} personnes`, faqKicker: "Questions", faqTitle: "FAQ de la chambre" },
  de: { upToGuests: (count) => `Bis zu ${count} Gäste`, faqKicker: "Fragen", faqTitle: "Zimmer-FAQ" },
  it: { upToGuests: (count) => `Fino a ${count} ospiti`, faqKicker: "Domande", faqTitle: "FAQ della camera" },
  es: { upToGuests: (count) => `Hasta ${count} personas`, faqKicker: "Preguntas", faqTitle: "Preguntas frecuentes de la habitación" },
  tr: { upToGuests: (count) => `${count} kişiye kadar`, faqKicker: "Sorular", faqTitle: "Oda SSS" },
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
  fr: {},
  de: {},
  it: {},
  es: {},
  tr: {},
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
          <Image src={activeImage.src} alt={activeImage.alt} width={900} height={600} sizes="(max-width: 768px) 100vw, 640px" />
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

function IndividualRoomsSection({ data }: { data: RoomDetailData }) {
  const language = getRoomLanguage(data.seo.canonicalPath);

  if (!data.individualRooms.rooms.length) return null;

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

  return (
    <main className="room-detail-page">
      <section className="rd-hero" aria-labelledby="rd-hero-title">
        <div className="rd-hero-media" aria-hidden="true">
          <Image src={data.hero.image} alt="" fill priority fetchPriority="high" sizes="100vw" />
        </div>

        <div className="rd-hero-overlay" />

        <div className="rd-hero-inner">
          <div className="rd-hero-card">
            <span className="rd-kicker rd-kicker--light">{data.hero.kicker}</span>
            <h1 id="rd-hero-title">{data.hero.title}</h1>
            <p className="rd-hero-subtitle">{data.hero.subtitle}</p>
            <p className="rd-hero-description">{data.hero.description}</p>

            <div className="rd-hero-badges" aria-label="Room highlights">
              {data.hero.badges.map((badge) => <span key={badge}>{localizeRoomText(badge, language)}</span>)}
            </div>

            <div className="rd-hero-actions">
              <a className="rd-btn rd-btn--primary" href={data.hero.primaryCta.href}>{data.hero.primaryCta.label}</a>
              <a className="rd-btn rd-btn--secondary" href={data.hero.secondaryCta.href}>{data.hero.secondaryCta.label}</a>
            </div>
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

          <aside className="rd-highlight-panel" aria-label="Room key details">
            {data.overview.highlights.map((highlight) => <div className="rd-highlight-item" key={highlight.label}><span>{highlight.label}</span><strong>{localizeRoomText(highlight.value, language)}</strong></div>)}
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
            {data.amenities.items.map((item) => <article className="rd-amenity-card" key={item.label}><div className="rd-amenity-icon" aria-hidden="true">{item.icon}</div><div><h3>{localizeRoomText(item.label, language)}</h3><p>{item.text}</p></div></article>)}
          </div>
        </div>
      </section>

      <section className="rd-section rd-section--best" aria-labelledby="rd-best-title">
        <div className="rd-wrap rd-best-grid">
          <article><span className="rd-kicker">{data.bestFor.kicker}</span><h2 id="rd-best-title">{data.bestFor.title}</h2></article>
          <div className="rd-best-list">
            {data.bestFor.items.map((item) => <div className="rd-best-item" key={item}><span aria-hidden="true">✓</span><p>{item}</p></div>)}
          </div>
        </div>
      </section>

      <section className="rd-section rd-section--booking" aria-labelledby="rd-booking-title">
        <div className="rd-wrap">
          <div className="rd-booking-card">
            <div><span className="rd-kicker rd-kicker--light">{data.booking.kicker}</span><h2 id="rd-booking-title">{data.booking.title}</h2><p>{data.booking.text}</p><small>{data.booking.note}</small></div>
            <div className="rd-booking-actions"><a className="rd-btn rd-btn--primary" href={data.booking.whatsappHref}>{data.booking.whatsappLabel}</a><a className="rd-btn rd-btn--secondary" href={data.booking.phoneHref}>{data.booking.phoneLabel}</a></div>
          </div>
        </div>
      </section>

      <section className="rd-section rd-section--faq" aria-labelledby="rd-faq-title">
        <div className="rd-wrap">
          <header className="rd-section-head"><span className="rd-kicker">{labels.faqKicker}</span><h2 id="rd-faq-title">{labels.faqTitle}</h2></header>
          <div className="rd-faq-list">
            {data.faq.map((item) => <details className="rd-faq-item" key={item.question}><summary>{item.question}</summary><p>{item.answer}</p></details>)}
          </div>
        </div>
      </section>
    </main>
  );
}
