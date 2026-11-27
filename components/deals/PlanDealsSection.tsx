"use client";

import Image from "next/image";
import type { PlanDeal } from "@/content/deals";

type Locale = "en" | "el" | "fr" | "de" | "it" | "es" | "tr";

type Copy = {
  kicker: string;
  title: string;
  text: string;
  room: string;
  nights: (n: number) => string;
  perNight: string;
  off: (pct: number) => string;
  code: string;
  cta: string;
  viewRoom: string;
  note: string;
};

const copy: Record<Locale, Copy> = {
  el: {
    kicker: "Προσφορές δωματίων",
    title: "Συγκεκριμένες ημερομηνίες, μειωμένη τιμή",
    text: "Ελεύθερες νύχτες που κρατάμε με έκπτωση μόνο για όσους κλείνουν απευθείας μαζί μας. Πάτα «Θέλω αυτή την προσφορά» και γράψε μας στο WhatsApp.",
    room: "Δωμάτιο",
    nights: (n) => `${n} ${n === 1 ? "νύχτα" : "νύχτες"}`,
    perNight: "/ νύχτα",
    off: (p) => `-${p}%`,
    code: "Κωδικός",
    cta: "Θέλω αυτή την προσφορά",
    viewRoom: "Δες το δωμάτιο",
    note: "Ισχύει μέχρι να κλειστεί το δωμάτιο.",
  },
  en: {
    kicker: "Room deals",
    title: "Set dates, lower price",
    text: "Free nights we hold at a discount for guests who book directly with us. Tap “I want this offer” and message us on WhatsApp.",
    room: "Room",
    nights: (n) => `${n} ${n === 1 ? "night" : "nights"}`,
    perNight: "/ night",
    off: (p) => `${p}% off`,
    code: "Code",
    cta: "I want this offer",
    viewRoom: "View room",
    note: "Valid until the room is booked.",
  },
  fr: {
    kicker: "Offres de chambres",
    title: "Dates précises, prix réduit",
    text: "Des nuits libres à prix réduit, réservées aux clients qui réservent en direct. Touchez « Je veux cette offre » et écrivez-nous sur WhatsApp.",
    room: "Chambre",
    nights: (n) => `${n} ${n === 1 ? "nuit" : "nuits"}`,
    perNight: "/ nuit",
    off: (p) => `-${p} %`,
    code: "Code",
    cta: "Je veux cette offre",
    viewRoom: "Voir la chambre",
    note: "Valable jusqu’à ce que la chambre soit réservée.",
  },
  de: {
    kicker: "Zimmerangebote",
    title: "Feste Termine, reduzierter Preis",
    text: "Freie Nächte mit Rabatt nur für Gäste, die direkt bei uns buchen. Tippen Sie auf „Ich möchte dieses Angebot“ und schreiben Sie uns per WhatsApp.",
    room: "Zimmer",
    nights: (n) => `${n} ${n === 1 ? "Nacht" : "Nächte"}`,
    perNight: "/ Nacht",
    off: (p) => `-${p} %`,
    code: "Code",
    cta: "Ich möchte dieses Angebot",
    viewRoom: "Zimmer ansehen",
    note: "Gültig, bis das Zimmer gebucht ist.",
  },
  it: {
    kicker: "Offerte camere",
    title: "Date precise, prezzo ridotto",
    text: "Notti libere scontate solo per chi prenota direttamente con noi. Tocca «Voglio questa offerta» e scrivici su WhatsApp.",
    room: "Camera",
    nights: (n) => `${n} ${n === 1 ? "notte" : "notti"}`,
    perNight: "/ notte",
    off: (p) => `-${p}%`,
    code: "Codice",
    cta: "Voglio questa offerta",
    viewRoom: "Vedi la camera",
    note: "Valida finché la camera non viene prenotata.",
  },
  es: {
    kicker: "Ofertas de habitaciones",
    title: "Fechas concretas, precio rebajado",
    text: "Noches libres con descuento solo para quien reserva directamente con nosotros. Pulsa «Quiero esta oferta» y escríbenos por WhatsApp.",
    room: "Habitación",
    nights: (n) => `${n} ${n === 1 ? "noche" : "noches"}`,
    perNight: "/ noche",
    off: (p) => `-${p}%`,
    code: "Código",
    cta: "Quiero esta oferta",
    viewRoom: "Ver habitación",
    note: "Válida hasta que se reserve la habitación.",
  },
  tr: {
    kicker: "Oda fırsatları",
    title: "Belirli tarihler, indirimli fiyat",
    text: "Yalnızca doğrudan rezervasyon yapan misafirlerimiz için indirimli boş geceler. «Bu fırsatı istiyorum»a dokunun ve bize WhatsApp'tan yazın.",
    room: "Oda",
    nights: (n) => `${n} gece`,
    perNight: "/ gece",
    off: (p) => `%${p} indirim`,
    code: "Kod",
    cta: "Bu fırsatı istiyorum",
    viewRoom: "Odayı gör",
    note: "Oda dolana kadar geçerlidir.",
  },
};

const DATE_LOCALE: Record<Locale, string> = {
  el: "el-GR",
  en: "en-GB",
  fr: "fr-FR",
  de: "de-DE",
  it: "it-IT",
  es: "es-ES",
  tr: "tr-TR",
};

function dayLabel(iso: string, locale: Locale) {
  return new Intl.DateTimeFormat(DATE_LOCALE[locale], { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" }).format(
    new Date(`${iso}T12:00:00Z`),
  );
}

export function PlanDealsSection({
  deals,
  locale,
  onTrack,
}: {
  deals: PlanDeal[];
  locale: Locale;
  onTrack: (name: string, properties: Record<string, string | number | undefined>) => void;
}) {
  if (!deals.length) return null;
  const t = copy[locale];

  return (
    <section id="room-deals" className="scroll-mt-24 px-0 pt-16 md:pt-20" aria-labelledby="room-deals-title">
      <div className="mx-auto w-[min(1240px,calc(100%-40px))] max-md:w-[calc(100%-24px)]">
        <header className="mx-auto mb-8 max-w-[840px] text-center">
          <span className="inline-flex min-h-8 items-center gap-2 rounded-full bg-emerald-50 px-4 text-[11px] font-black uppercase tracking-[0.12em] text-emerald-800">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-600" aria-hidden="true" />
            {t.kicker}
          </span>
          <h2 id="room-deals-title" className="mt-4 text-[clamp(30px,4.5vw,54px)] font-black leading-none tracking-[-0.05em] text-amber-800">
            {t.title}
          </h2>
          <p className="mx-auto mt-4 max-w-[720px] text-base leading-7 text-stone-600">{t.text}</p>
        </header>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {deals.map((deal) => (
            <article
              id={`offer-${deal.id}`}
              key={deal.id}
              className="flex flex-col overflow-hidden rounded-[1.75rem] border border-amber-800/15 bg-white shadow-xl shadow-stone-900/5"
            >
              <div className="relative h-[190px] bg-stone-200">
                <Image src={deal.image} alt={deal.imageAlt} fill sizes="(max-width: 639px) 92vw, (max-width: 1023px) 46vw, 380px" className="object-cover" />
                <span className="absolute left-4 top-4 inline-flex min-h-9 items-center rounded-full bg-red-700 px-3.5 text-sm font-black text-white shadow-lg">
                  {t.off(deal.discount)}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <p className="text-[11px] font-black uppercase tracking-[0.12em] text-stone-500">
                  {t.room} {deal.room} · {deal.title}
                </p>
                <p className="mt-2 text-[22px] font-black leading-tight tracking-[-0.02em] text-amber-800">
                  {dayLabel(deal.from, locale)} → {dayLabel(deal.to, locale)}
                </p>
                <p className="mt-1 text-sm font-bold text-stone-600">{t.nights(deal.nights)}</p>

                {deal.nightPrice !== null && deal.dealNightPrice !== null ? (
                  <p className="mt-3 flex items-baseline gap-2">
                    <span className="text-base font-bold text-stone-400 line-through">€{deal.nightPrice}</span>
                    <strong className="text-2xl font-black text-emerald-800">€{deal.dealNightPrice}</strong>
                    <span className="text-sm text-stone-600">{t.perNight}</span>
                  </p>
                ) : null}

                <p className="mt-3 inline-flex w-fit items-center gap-2 rounded-xl border-2 border-dashed border-amber-800 bg-[#f8f7f2] px-3 py-1.5">
                  <span className="text-[10px] font-black uppercase tracking-[0.12em] text-stone-600">{t.code}</span>
                  <strong className="text-lg font-black tracking-[0.06em] text-amber-800">{deal.code}</strong>
                </p>

                <div className="mt-auto grid gap-2 pt-5">
                  <a
                    href={deal.whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => onTrack("room_deal_whatsapp_click", { offer_id: deal.id, room: deal.room, coupon_code: deal.code, language: locale })}
                    className="inline-flex min-h-[50px] items-center justify-center gap-2 rounded-full bg-[#1f8f4e] px-4 text-center text-[12px] font-black uppercase tracking-[0.08em] !text-white shadow-lg shadow-emerald-900/15"
                  >
                    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-current">
                      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.2a.4.4 0 0 0 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.2 2.2 2.2 0 0 0 .1-1.3c0-.1-.2-.2-.5-.3Z" />
                    </svg>
                    {t.cta}
                  </a>
                  <a
                    href={deal.roomPageHref}
                    className="inline-flex min-h-11 items-center justify-center rounded-full border border-amber-800/20 bg-[#fff7ee] px-4 text-center text-[11px] font-black uppercase tracking-[0.1em] text-amber-900"
                  >
                    {t.viewRoom}
                  </a>
                </div>
                <p className="mt-3 text-center text-[12px] text-stone-500">{t.note}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
