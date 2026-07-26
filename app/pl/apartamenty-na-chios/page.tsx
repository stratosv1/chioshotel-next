import type { Metadata } from "next";
import { RoomDetailPage } from "@/components/rooms/RoomDetailPage";
import { JsonLd } from "@/components/seo/JsonLd";
import type { RoomDetailData } from "@/content/room-details";
import { familyChiosApartmentsPl } from "@/content/room-details-pl";
import { buildPolishRoomDetailSchema } from "@/content/room-detail-schema-pl";
import { buildPolishPageMetadata } from "@/lib/seo-pl";

const apartmentData: RoomDetailData = {
  ...familyChiosApartmentsPl,
  seo: {
    ...familyChiosApartmentsPl.seo,
    canonicalPath: "/pl/apartamenty-na-chios/",
    title: "Apartamenty na Chios | Apartamenty rodzinne w Kambos",
    description:
      "Apartamenty na Chios w Voulamandis House w Kambos. Trzy przestronne apartamenty 40–45 m² z kuchnią, częścią dzienną i miejscem dla maksymalnie 4 osób.",
  },
  hero: {
    ...familyChiosApartmentsPl.hero,
    kicker: "Apartamenty na Chios • Voulamandis House",
    title: "Apartamenty na Chios",
    subtitle: "Rodzinne apartamenty z kuchnią i większą przestrzenią w Kambos",
    description:
      "Trzy przestronne apartamenty z oddzielną sypialnią, kuchnią i częścią dzienną. Dobry wybór dla rodzin, dłuższych pobytów i gości, którzy chcą więcej przestrzeni oraz niezależności na Chios.",
    imageAlt: "Apartamenty na Chios w Voulamandis House w Kambos",
  },
  overview: {
    ...familyChiosApartmentsPl.overview,
    kicker: "Apartamenty w Kambos na Chios",
    title: "Apartamenty na Chios dla rodzin i na dłuższy pobyt",
    paragraphs: [
      "Apartamenty Voulamandis House w Kambos oferują więcej przestrzeni i niezależności niż standardowy pokój, z oddzielną sypialnią, częścią dzienną i kuchnią.",
      "Kategoria obejmuje trzy apartamenty rodzinne o powierzchni 40–45 m² dla maksymalnie 4 osób, odpowiednie dla rodzin, dłuższych pobytów i osób, które chcą przygotowywać proste posiłki.",
      "Spokojne położenie w Kambos zapewnia wygodny dojazd do miasta Chios, lotniska i plaż, a jednocześnie pozwala odpocząć w otoczeniu cytrusowych ogrodów.",
    ],
  },
  individualRooms: {
    ...familyChiosApartmentsPl.individualRooms,
    kicker: "Dostępne apartamenty",
    title: "Wybierz apartament na Chios, który najlepiej pasuje do pobytu",
    description:
      "Porównaj Apartamenty 8, 9 i 10. Wszystkie oferują kuchnię, część dzienną i miejsce dla maksymalnie 4 osób, a różnią się szczegółami układu.",
  },
  booking: {
    ...familyChiosApartmentsPl.booking,
    kicker: "Bezpośrednia rezerwacja apartamentu",
    title: "Sprawdź, który apartament jest dostępny w Twoim terminie",
    text:
      "Podaj daty i liczbę gości, a zaproponujemy najlepiej dopasowany dostępny apartament w Voulamandis House.",
  },
};

export const metadata: Metadata = buildPolishPageMetadata({
  path: apartmentData.seo.canonicalPath,
  title: apartmentData.seo.title,
  description: apartmentData.seo.description,
  image: apartmentData.seo.ogImage,
});

export default function PolishApartmentsPage() {
  return (
    <>
      <JsonLd data={buildPolishRoomDetailSchema(apartmentData)} />
      <RoomDetailPage data={apartmentData} />
    </>
  );
}
