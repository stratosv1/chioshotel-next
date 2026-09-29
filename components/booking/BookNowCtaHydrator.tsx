"use client";

import { useEffect } from "react";

const BOOKING_PAGES = {
  en: "/chios-hotels-rates/",
  el: "/el/amesi-kratisi-voulamandis-house/",
  fr: "/fr/tarifs-des-hotels-a-chios/",
  de: "/de/hotelpreise-auf-der-insel-chios/",
  it: "/it/prezzi-hotel-chios/",
  es: "/es/los-mejores-precios-de-hotel-en-la-isla-chios/",
  tr: "/tr/sakiz-adasi-rezervasyon/",
} as const;

type BookingLanguage = keyof typeof BOOKING_PAGES;

const BOOK_NOW_LABELS = [
  "book now",
  "book your stay",
  "book direct",
  "book directly",
  "κράτηση τώρα",
  "κάντε κράτηση",
  "κάντε την κράτησή σας",
  "réserver",
  "réservez maintenant",
  "réserver maintenant",
  "jetzt buchen",
  "direkt buchen",
  "prenota ora",
  "prenota adesso",
  "reserva ahora",
  "reservar ahora",
  "şimdi rezervasyon yap",
  "hemen rezervasyon yap",
  "şimdi rezervasyon",
];

function normalizeLabel(value: string) {
  return value.replace(/\s+/g, " ").trim().toLocaleLowerCase();
}

function isBookNowLink(link: HTMLAnchorElement) {
  const label = normalizeLabel(link.textContent || "");
  return BOOK_NOW_LABELS.some((bookNowLabel) => label.includes(bookNowLabel));
}

function getBookingPage(pathname: string) {
  const locale = pathname.split("/").filter(Boolean)[0];

  if (locale && locale in BOOKING_PAGES) {
    return BOOKING_PAGES[locale as BookingLanguage];
  }

  return BOOKING_PAGES.en;
}

function updateLink(link: HTMLAnchorElement, bookingPage: string) {
  if (!isBookNowLink(link)) {
    return;
  }

  link.setAttribute("href", bookingPage);
  link.removeAttribute("target");
  link.removeAttribute("rel");
}

function updateBookNowLinks(bookingPage: string, root: ParentNode = document) {
  if (root instanceof HTMLAnchorElement) {
    updateLink(root, bookingPage);
  }

  root
    .querySelectorAll<HTMLAnchorElement>("a[href]")
    .forEach((link) => updateLink(link, bookingPage));
}

export function BookNowCtaHydrator() {
  useEffect(() => {
    const bookingPage = getBookingPage(window.location.pathname);

    updateBookNowLinks(bookingPage);

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement) {
            updateBookNowLinks(bookingPage, node);
          }
        });
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => observer.disconnect();
  }, []);

  return null;
}
