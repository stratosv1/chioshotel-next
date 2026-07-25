import { ratesPageEn, type RatesPageData } from "@/content/rates";

export const ratesPagePl: RatesPageData = {
  ...ratesPageEn,
  seo: {
    canonicalPath: "/pl/rezerwacja/",
    title: "Rezerwacja Chios | Bezpośrednie ceny Voulamandis House",
    description:
      "Zarezerwuj pobyt bezpośrednio w Voulamandis House na Chios. Sprawdź dostępność, wybierz pokój lub apartament i skorzystaj z korzyści rezerwacji bezpośredniej.",
    ogImage: ratesPageEn.seo.ogImage,
  },
  hero: {
    ...ratesPageEn.hero,
    kicker: "Kambos, Chios • Voulamandis House",
    title: "Rezerwuj bezpośrednio w najlepszej dostępnej cenie",
    description:
      "Sprawdź aktualną dostępność i zarezerwuj pokój lub apartament bezpośrednio w Voulamandis House w Kambos na Chios, korzystając z bezpiecznego systemu rezerwacji online.",
  },
  benefits: {
    kicker: "Korzyści rezerwacji bezpośredniej",
    title: "Rezerwuj bez pośredników",
    text:
      "Bezpośrednia rezerwacja ułatwia wybór właściwego pokoju, daje możliwość szybkiego kontaktu z obiektem i pozwala korzystać z ofert dostępnych dla rezerwacji przez własną stronę.",
    items: [
      { icon: "🛡️", title: "Najlepsza dostępna oferta", text: "Sprawdź ceny bezpośrednie dla wybranego terminu." },
      { icon: "⚡", title: "Oferty specjalne", text: "Dostęp do ofert przygotowanych dla rezerwacji bezpośrednich." },
      { icon: "🥐", title: "Śniadanie", text: "Możliwość dodania śniadania do pobytu na życzenie." },
      { icon: "💬", title: "Bezpośredni kontakt", text: "Osobista pomoc przy wyborze pokoju i szczegółach pobytu." },
    ],
  },
  discount: {
    kicker: "Oferta bezpośrednia",
    title: "Skorzystaj z kodu rabatowego",
    text:
      "Użyj kodu rezerwacji bezpośredniej, aby uzyskać dodatkową korzyść przy rezerwacji online, zgodnie z dostępnością i warunkami wybranego terminu.",
    code: "WELCOME10",
    value: "10% RABATU",
    note:
      "Kod obowiązuje przy kwalifikujących się rezerwacjach bezpośrednich, zależnie od dostępności i warunków rezerwacji.",
  },
  booking: {
    ...ratesPageEn.booking,
    kicker: "Bezpieczna rezerwacja",
    title: "Dokończ rezerwację",
    text:
      "Sprawdź dostępność w czasie rzeczywistym, wybierz odpowiedni pokój lub apartament i przejdź do bezpiecznej rezerwacji Voulamandis House.",
    iframeTitle: "Bezpośrednia rezerwacja Voulamandis House w Kambos na Chios",
  },
  seoCopy: {
    paragraphs: [
      "Jeśli szukasz rezerwacji noclegu na Chios, pokoju w Kambos lub rodzinnego apartamentu, na tej stronie możesz przejść bezpośrednio do aktualnej dostępności Voulamandis House.",
      "Przed rezerwacją możesz również zobaczyć pokoje na Chios, porównać noclegi w Kambos lub skontaktować się z nami przez WhatsApp, jeśli potrzebujesz pomocy w wyborze konkretnego pokoju.",
    ],
    links: [
      { label: "pokoje na Chios", href: "/pl/pokoje-na-chios/" },
      { label: "noclegi w Kambos", href: "/pl/noclegi-chios/" },
      { label: "WhatsApp", href: "https://wa.me/306944474226" },
    ],
  },
};
