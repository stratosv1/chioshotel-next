import type { RoomDetailData } from "@/content/room-details";

export type EconomyIntentLocale = "en" | "el" | "fr" | "de" | "it" | "es" | "tr";

type EconomyIntentCopy = {
  seoTitle: string;
  seoDescription: string;
  heroTitle: string;
  heroDescription: string;
  overviewParagraph: string;
};

const economyIntentCopy: Record<EconomyIntentLocale, EconomyIntentCopy> = {
  en: {
    seoTitle: "Budget Rooms in Chios | Economy Double Rooms | Voulamandis House",
    seoDescription:
      "Looking for affordable or budget rooms in Chios? See economy double rooms at Voulamandis House in Kambos for two guests, with private bathroom, WiFi, air conditioning and fridge.",
    heroTitle: "Affordable economy double rooms in Chios",
    heroDescription:
      "A practical budget accommodation choice in Chios for two guests who want a clean, comfortable room in peaceful Kambos without paying for space or facilities they do not need.",
    overviewParagraph:
      "If you are comparing affordable rooms, budget accommodation or lower-cost places to stay in Chios, this is the Voulamandis House category designed around value for two guests.",
  },
  el: {
    seoTitle: "Οικονομικά Δωμάτια στη Χίο | Οικονομικό Δίκλινο | Voulamandis House",
    seoDescription:
      "Ψάχνετε οικονομικά ή φθηνά δωμάτια στη Χίο; Δείτε τα οικονομικά δίκλινα του Voulamandis House στον Κάμπο για 2 άτομα, με μπάνιο, WiFi, κλιματισμό και ψυγείο.",
    heroTitle: "Οικονομικά δίκλινα δωμάτια στη Χίο",
    heroDescription:
      "Μια πρακτική επιλογή για οικονομική διαμονή στη Χίο για δύο άτομα, σε ήσυχο περιβάλλον στον Κάμπο, με όλα τα βασικά που χρειάζεστε χωρίς να πληρώνετε για χώρο ή παροχές που δεν θα χρησιμοποιήσετε.",
    overviewParagraph:
      "Αν συγκρίνετε οικονομικά δωμάτια, φθηνή διαμονή ή πιο προσιτά καταλύματα στη Χίο, αυτή είναι η κατηγορία του Voulamandis House που έχει σχεδιαστεί με έμφαση στην καλή σχέση τιμής και άνεσης για δύο άτομα.",
  },
  fr: {
    seoTitle: "Chambres économiques à Chios | Chambre double | Voulamandis House",
    seoDescription:
      "Vous cherchez des chambres abordables à Chios ? Découvrez les chambres doubles économiques de Voulamandis House à Kambos pour deux personnes, avec salle de bain, WiFi, climatisation et réfrigérateur.",
    heroTitle: "Chambres doubles économiques à Chios",
    heroDescription:
      "Une option d’hébergement abordable à Chios pour deux personnes qui recherchent une chambre confortable dans le calme de Kambos, avec les équipements essentiels et un bon rapport qualité-prix.",
    overviewParagraph:
      "Si vous comparez des chambres économiques, un hébergement abordable ou des solutions moins chères à Chios, cette catégorie de Voulamandis House est pensée pour offrir l’essentiel à deux personnes.",
  },
  de: {
    seoTitle: "Günstige Zimmer auf Chios | Economy Doppelzimmer | Voulamandis House",
    seoDescription:
      "Sie suchen günstige Zimmer auf Chios? Entdecken Sie Economy-Doppelzimmer im Voulamandis House in Kambos für zwei Gäste mit Bad, WLAN, Klimaanlage und Kühlschrank.",
    heroTitle: "Günstige Economy-Doppelzimmer auf Chios",
    heroDescription:
      "Eine praktische und preiswerte Unterkunft auf Chios für zwei Gäste, die ein komfortables Zimmer im ruhigen Kambos mit den wichtigsten Ausstattungen suchen.",
    overviewParagraph:
      "Wenn Sie günstige Zimmer, preiswerte Unterkünfte oder Budget-Unterkünfte auf Chios vergleichen, ist diese Kategorie im Voulamandis House auf ein gutes Preis-Leistungs-Verhältnis für zwei Gäste ausgerichtet.",
  },
  it: {
    seoTitle: "Camere economiche a Chios | Camera doppia | Voulamandis House",
    seoDescription:
      "Cerchi camere economiche a Chios? Scopri le camere doppie economy di Voulamandis House a Kambos per due ospiti, con bagno privato, WiFi, aria condizionata e frigorifero.",
    heroTitle: "Camere doppie economiche a Chios",
    heroDescription:
      "Una soluzione conveniente per soggiornare a Chios in due, con una camera confortevole nel tranquillo Kambos e tutti i servizi essenziali senza costi inutili.",
    overviewParagraph:
      "Se stai confrontando camere economiche, alloggi convenienti o sistemazioni a buon prezzo a Chios, questa categoria di Voulamandis House è pensata per offrire valore e comfort a due ospiti.",
  },
  es: {
    seoTitle: "Habitaciones económicas en Quíos | Habitación doble | Voulamandis House",
    seoDescription:
      "¿Buscas habitaciones económicas en Quíos? Descubre las dobles economy de Voulamandis House en Kambos para dos personas, con baño privado, WiFi, aire acondicionado y nevera.",
    heroTitle: "Habitaciones dobles económicas en Quíos",
    heroDescription:
      "Una opción de alojamiento económico en Quíos para dos personas que buscan una habitación cómoda en el tranquilo Kambos con los servicios esenciales y buena relación calidad-precio.",
    overviewParagraph:
      "Si comparas habitaciones económicas, alojamiento asequible o lugares de menor precio en Quíos, esta categoría de Voulamandis House está pensada para ofrecer valor y comodidad a dos huéspedes.",
  },
  tr: {
    seoTitle: "Sakız Adası Ekonomik Odalar | Ekonomi Çift Kişilik Oda | Voulamandis House",
    seoDescription:
      "Sakız Adası’nda uygun fiyatlı oda mı arıyorsunuz? Kambos’taki Voulamandis House ekonomi çift kişilik odalarını; özel banyo, WiFi, klima ve buzdolabıyla inceleyin.",
    heroTitle: "Sakız Adası uygun fiyatlı çift kişilik odalar",
    heroDescription:
      "Sakız Adası’nda iki kişi için ekonomik konaklama arayanlara, sakin Kambos’ta temel olanakları sunan konforlu ve uygun fiyatlı bir oda seçeneği.",
    overviewParagraph:
      "Sakız Adası’nda ekonomik odaları, uygun fiyatlı konaklamayı veya bütçe dostu seçenekleri karşılaştırıyorsanız, Voulamandis House’un bu kategorisi iki kişi için fiyat ve konfor dengesine odaklanır.",
  },
};

export function withEconomyRoomIntent(
  data: RoomDetailData,
  locale: EconomyIntentLocale,
): RoomDetailData {
  const intent = economyIntentCopy[locale];

  return {
    ...data,
    id: "economy-double-carousel",
    seo: {
      ...data.seo,
      title: intent.seoTitle,
      description: intent.seoDescription,
    },
    hero: {
      ...data.hero,
      title: intent.heroTitle,
      description: intent.heroDescription,
    },
    overview: {
      ...data.overview,
      paragraphs: [intent.overviewParagraph, ...data.overview.paragraphs],
    },
  };
}
