import type { KamposChiosPageData } from "@/content/kampos-chios";
import {
  buildBreadcrumbSchema,
  buildFaqSchema,
  buildHotelSchema,
  buildImageSchema,
  buildItemListSchema,
  buildOrganizationSchema,
  buildSchemaGraph,
  buildTouristPlaceSchema,
  buildWebPageSchema,
  buildWebsiteSchema,
  type SchemaObject,
} from "@/lib/structured-data";

type Language = Exclude<KamposChiosPageData["language"], "el">;

type SeoCopy = {
  title: string;
  description: string;
  placeName: string;
  placeDescription: string;
  breadcrumbHome: string;
  breadcrumbPage: string;
  roomsName: string;
  roomsDescription: string;
  roomNames: string[];
  faq: { question: string; answer: string }[];
};

const localized: Record<Language, SeoCopy> = {
  en: {
    title: "Stay in Kambos Chios | Rooms & Family Apartments",
    description: "Quiet rooms and family apartments in historic Kambos, Chios, among citrus gardens near beaches, the airport and Chios Town.",
    placeName: "Kambos, Chios",
    placeDescription: "Historic area of Chios known for stone mansions, citrus estates, high walls and quiet lanes.",
    breadcrumbHome: "Chios",
    breadcrumbPage: "Stay in Kambos Chios",
    roomsName: "Rooms and apartments in Kambos Chios",
    roomsDescription: "Accommodation options at Voulamandis House for couples and families.",
    roomNames: ["Economy double rooms", "Ground-floor rooms", "Upper-floor rooms", "Family apartments"],
    faq: [
      { question: "Why stay in Kambos, Chios?", answer: "Kambos combines peace, historic character and nature while remaining close to Chios Town, the airport and the beaches." },
      { question: "Are there rooms inside Kambos?", answer: "Yes. Voulamandis House offers double rooms, ground-floor and upper-floor options, plus family apartments with kitchens." },
      { question: "Is Kambos suitable for couples and families?", answer: "Yes. The garden, quiet atmosphere, free parking and range of room types suit both couples and families." },
      { question: "How close are the beaches?", answer: "The nearest beach is about 1.5 km away, while Karfas, Megas Limnionas and the beaches of southern Chios are easy to reach by car." },
    ],
  },
  fr: {
    title: "Séjour à Kambos Chios | Chambres & Appartements",
    description: "Chambres calmes et appartements familiaux dans le Kambos historique de Chios, près des plages, de l’aéroport et de la ville.",
    placeName: "Kambos de Chios",
    placeDescription: "Quartier historique de Chios connu pour ses demeures en pierre, ses agrumes, ses hauts murs et ses ruelles paisibles.",
    breadcrumbHome: "Chios",
    breadcrumbPage: "Séjour à Kambos",
    roomsName: "Chambres et appartements à Kambos",
    roomsDescription: "Hébergements du Voulamandis House pour couples et familles.",
    roomNames: ["Chambres doubles économiques", "Chambres au rez-de-chaussée", "Chambres à l’étage", "Appartements familiaux"],
    faq: [
      { question: "Pourquoi séjourner à Kambos ?", answer: "Kambos associe calme, patrimoine et nature tout en restant proche de la ville, de l’aéroport et des plages." },
      { question: "Y a-t-il des chambres au cœur de Kambos ?", answer: "Oui. Voulamandis House propose des chambres doubles, des options au rez-de-chaussée ou à l’étage et des appartements familiaux avec cuisine." },
      { question: "Kambos convient-il aux couples et aux familles ?", answer: "Oui. Le jardin, le calme, le parking gratuit et les différents hébergements conviennent aux couples comme aux familles." },
      { question: "Les plages sont-elles proches ?", answer: "La plage la plus proche se trouve à environ 1,5 km. Karfas, Megas Limnionas et les plages du sud sont facilement accessibles en voiture." },
    ],
  },
  de: {
    title: "Übernachten in Kambos Chios | Zimmer & Apartments",
    description: "Ruhige Zimmer und Familienapartments im historischen Kambos auf Chios, nahe Stränden, Flughafen und Chios-Stadt.",
    placeName: "Kambos auf Chios",
    placeDescription: "Historische Gegend auf Chios mit Steinvillen, Zitrusgärten, hohen Mauern und ruhigen Gassen.",
    breadcrumbHome: "Chios",
    breadcrumbPage: "Übernachten in Kambos",
    roomsName: "Zimmer und Apartments in Kambos",
    roomsDescription: "Unterkünfte im Voulamandis House für Paare und Familien.",
    roomNames: ["Günstige Doppelzimmer", "Zimmer im Erdgeschoss", "Zimmer im Obergeschoss", "Familienapartments"],
    faq: [
      { question: "Warum in Kambos übernachten?", answer: "Kambos verbindet Ruhe, Geschichte und Natur und liegt zugleich nahe der Stadt, dem Flughafen und den Stränden." },
      { question: "Gibt es Unterkünfte direkt in Kambos?", answer: "Ja. Voulamandis House bietet Doppelzimmer, Zimmer im Erd- und Obergeschoss sowie Familienapartments mit Küche." },
      { question: "Ist Kambos für Paare und Familien geeignet?", answer: "Ja. Garten, ruhige Atmosphäre, kostenloses Parken und verschiedene Unterkunftstypen passen zu Paaren und Familien." },
      { question: "Wie nah sind die Strände?", answer: "Der nächste Strand ist etwa 1,5 km entfernt. Karfas, Megas Limnionas und die Strände im Süden sind gut mit dem Auto erreichbar." },
    ],
  },
  it: {
    title: "Soggiorno a Kambos Chios | Camere & Appartamenti",
    description: "Camere tranquille e appartamenti familiari nello storico Kambos di Chios, vicino a spiagge, aeroporto e città.",
    placeName: "Kambos di Chios",
    placeDescription: "Zona storica di Chios nota per dimore in pietra, agrumeti, alti muri e stradine tranquille.",
    breadcrumbHome: "Chios",
    breadcrumbPage: "Soggiorno a Kambos",
    roomsName: "Camere e appartamenti a Kambos",
    roomsDescription: "Sistemazioni del Voulamandis House per coppie e famiglie.",
    roomNames: ["Camere doppie economiche", "Camere al piano terra", "Camere al piano superiore", "Appartamenti familiari"],
    faq: [
      { question: "Perché soggiornare a Kambos?", answer: "Kambos unisce tranquillità, storia e natura, restando vicino alla città, all’aeroporto e alle spiagge." },
      { question: "Ci sono camere nel cuore di Kambos?", answer: "Sì. Voulamandis House offre camere doppie, soluzioni al piano terra e superiore e appartamenti familiari con cucina." },
      { question: "Kambos è adatto a coppie e famiglie?", answer: "Sì. Il giardino, l’atmosfera tranquilla, il parcheggio gratuito e le diverse sistemazioni sono adatti a coppie e famiglie." },
      { question: "Quanto sono vicine le spiagge?", answer: "La spiaggia più vicina dista circa 1,5 km. Karfas, Megas Limnionas e le spiagge del sud sono facilmente raggiungibili in auto." },
    ],
  },
  es: {
    title: "Alojamiento en Kambos Quíos | Habitaciones y Apartamentos",
    description: "Habitaciones tranquilas y apartamentos familiares en el Kambos histórico de Quíos, cerca de playas, aeropuerto y ciudad.",
    placeName: "Kambos de Quíos",
    placeDescription: "Zona histórica de Quíos conocida por mansiones de piedra, huertos de cítricos, altos muros y calles tranquilas.",
    breadcrumbHome: "Quíos",
    breadcrumbPage: "Alojamiento en Kambos",
    roomsName: "Habitaciones y apartamentos en Kambos",
    roomsDescription: "Opciones de alojamiento en Voulamandis House para parejas y familias.",
    roomNames: ["Habitaciones dobles económicas", "Habitaciones en planta baja", "Habitaciones en planta alta", "Apartamentos familiares"],
    faq: [
      { question: "¿Por qué alojarse en Kambos?", answer: "Kambos combina tranquilidad, historia y naturaleza y sigue estando cerca de la ciudad, el aeropuerto y las playas." },
      { question: "¿Hay habitaciones dentro de Kambos?", answer: "Sí. Voulamandis House ofrece habitaciones dobles, opciones en planta baja y alta y apartamentos familiares con cocina." },
      { question: "¿Es adecuado para parejas y familias?", answer: "Sí. El jardín, el ambiente tranquilo, el aparcamiento gratuito y los distintos alojamientos son adecuados para parejas y familias." },
      { question: "¿A qué distancia están las playas?", answer: "La playa más cercana está a unos 1,5 km. Karfas, Megas Limnionas y las playas del sur se alcanzan fácilmente en coche." },
    ],
  },
  tr: {
    title: "Sakız Kambos Konaklama | Oda ve Aile Daireleri",
    description: "Tarihi Kambos’ta sakin odalar ve aile daireleri; plajlara, havaalanına ve Sakız merkeze yakın narenciye bahçeleri içinde konaklama.",
    placeName: "Sakız Kambos",
    placeDescription: "Taş konakları, narenciye bahçeleri, yüksek duvarları ve sakin yollarıyla bilinen tarihi Sakız bölgesi.",
    breadcrumbHome: "Sakız",
    breadcrumbPage: "Kambos’ta konaklama",
    roomsName: "Kambos’ta oda ve daireler",
    roomsDescription: "Voulamandis House’ta çiftler ve aileler için konaklama seçenekleri.",
    roomNames: ["Ekonomik çift kişilik odalar", "Zemin kat odaları", "Üst kat odaları", "Aile daireleri"],
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
];

export function buildLocalizedKamposChiosSchema(data: KamposChiosPageData): SchemaObject {
  if (data.language === "el") return buildSchemaGraph([]);
  const t = localized[data.language];
  const path = data.seo.canonicalPath;
  const faq = buildFaqSchema({ path, questions: t.faq });

  return buildSchemaGraph([
    buildOrganizationSchema(),
    buildHotelSchema({ path }),
    buildWebsiteSchema(),
    buildImageSchema({ url: data.seo.ogImage, alt: data.hero.imageAlt, caption: t.title }, path),
    buildWebPageSchema({
      path,
      title: t.title,
      description: t.description,
      image: data.seo.ogImage,
      breadcrumbs: [
        { name: t.breadcrumbHome, path: data.language === "en" ? "/chios/" : `/${data.language}/chios/` },
        { name: t.breadcrumbPage, path },
      ],
    }),
    buildTouristPlaceSchema({
      path,
      name: t.placeName,
      description: t.placeDescription,
      image: data.gallery[0]?.image || data.seo.ogImage,
      addressLocality: t.breadcrumbHome,
      addressRegion: "North Aegean",
      addressCountry: "GR",
      latitude: 38.3436,
      longitude: 26.1374,
    }),
    buildItemListSchema({
      path,
      name: t.roomsName,
      description: t.roomsDescription,
      items: t.roomNames.map((name, index) => ({
        name,
        url: data.hero.primaryCta.href,
        image: roomImages[index],
      })),
    }),
    buildBreadcrumbSchema(path, [
      { name: t.breadcrumbHome, path: data.language === "en" ? "/chios/" : `/${data.language}/chios/` },
      { name: t.breadcrumbPage, path },
    ]),
    faq,
  ]);
}
