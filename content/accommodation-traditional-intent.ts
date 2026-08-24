import type { ChiosAccommodationPageData } from "@/content/chios-accommodation";
import type { LanguageCode } from "@/lib/languages";

type TraditionalIntentCopy = {
  seoDescription: string;
  introTitle: string;
  paragraph: string;
  airportParagraph: string;
  fact: string;
  airportFact: string;
};

const copy: Record<LanguageCode, TraditionalIntentCopy> = {
  en: {
    seoDescription:
      "Stay at Voulamandis House in Kambos, Chios: peaceful family-run guest accommodation near Chios Airport, with traditional character, rooms, apartments and direct availability.",
    introTitle: "A family-run guest accommodation with traditional Chios character",
    paragraph:
      "Travellers searching for a guest house or traditional accommodation in Chios often want something smaller, quieter and more personal than a large hotel. Voulamandis House fits that travel style through its family-run scale, historic Kambos setting, citrus gardens and direct contact with the hosts, while remaining clearly a rooms-and-apartments accommodation rather than a full-service hotel.",
    airportParagraph:
      "For travellers comparing accommodation near Chios Airport, Kambos is also a practical base: Voulamandis House is about 3 km from the airport and about 8 km from Chios Town and the port, combining convenient arrival and departure access with a quieter setting outside the city centre.",
    fact: "A family-run guest accommodation with traditional Kambos character",
    airportFact: "About 3 km from Chios Airport and 8 km from Chios Town and port",
  },
  el: {
    seoDescription:
      "Διαμονή στη Χίο στο Voulamandis House στον Κάμπο: οικογενειακό κατάλυμα κοντά στο αεροδρόμιο Χίου, με παραδοσιακό χαρακτήρα, δωμάτια, διαμερίσματα και άμεση διαθεσιμότητα.",
    introTitle: "Οικογενειακό κατάλυμα με τον χαρακτήρα παραδοσιακής διαμονής στη Χίο",
    paragraph:
      "Όσοι αναζητούν ξενώνα ή παραδοσιακό κατάλυμα στη Χίο συνήθως θέλουν μικρότερη κλίμακα, ησυχία και πιο προσωπική φιλοξενία από ένα μεγάλο ξενοδοχείο. Το Voulamandis House ταιριάζει σε αυτό το στυλ διαμονής χάρη στον οικογενειακό χαρακτήρα του, τη θέση του στον ιστορικό Κάμπο, τα περιβόλια και την άμεση επικοινωνία με τους οικοδεσπότες, ενώ παραμένει ξεκάθαρα κατάλυμα με δωμάτια και διαμερίσματα και όχι ξενοδοχείο πλήρων υπηρεσιών.",
    airportParagraph:
      "Για όσους αναζητούν διαμονή ή δωμάτια κοντά στο αεροδρόμιο Χίου, ο Κάμπος είναι επίσης πρακτική βάση: το Voulamandis House απέχει περίπου 3 χλμ. από το αεροδρόμιο και περίπου 8 χλμ. από την πόλη και το λιμάνι της Χίου, συνδυάζοντας εύκολη πρόσβαση με πιο ήσυχο περιβάλλον έξω από το κέντρο.",
    fact: "Οικογενειακό κατάλυμα με αυθεντικό χαρακτήρα Κάμπου και προσωπική φιλοξενία",
    airportFact: "Περίπου 3 χλμ. από το αεροδρόμιο και 8 χλμ. από πόλη και λιμάνι Χίου",
  },
  fr: {
    seoDescription:
      "Hébergement à Chios au Voulamandis House à Kambos, près de l’aéroport de Chios : maison d’hôtes familiale au caractère traditionnel, avec chambres, appartements et disponibilité directe.",
    introTitle: "Une adresse familiale au caractère traditionnel de Chios",
    paragraph:
      "Les voyageurs qui recherchent une maison d’hôtes ou un hébergement traditionnel à Chios souhaitent souvent une adresse plus petite, plus calme et plus personnelle qu’un grand hôtel. Voulamandis House correspond à cet esprit grâce à sa taille familiale, son cadre historique à Kambos, ses agrumes et le contact direct avec les hôtes, tout en restant clairement un hébergement de chambres et d’appartements plutôt qu’un hôtel avec services complets.",
    airportParagraph:
      "Pour les voyageurs qui cherchent un hébergement près de l’aéroport de Chios, Kambos est également une base pratique : Voulamandis House se trouve à environ 3 km de l’aéroport et 8 km de la ville et du port de Chios, avec un accès facile tout en restant à l’écart du centre animé.",
    fact: "Hébergement familial dans le cadre historique et verdoyant de Kambos",
    airportFact: "Environ 3 km de l’aéroport et 8 km de la ville et du port de Chios",
  },
  de: {
    seoDescription:
      "Unterkunft auf Chios im Voulamandis House in Kambos, nahe dem Flughafen Chios: familiengeführte Gästeunterkunft mit traditionellem Charakter, Zimmern, Apartments und Direktverfügbarkeit.",
    introTitle: "Familiengeführte Gästeunterkunft mit traditionellem Chios-Charakter",
    paragraph:
      "Wer nach einem Gästehaus oder einer traditionellen Unterkunft auf Chios sucht, wünscht sich oft eine kleinere, ruhigere und persönlichere Alternative zu einem großen Hotel. Voulamandis House passt zu diesem Reisestil durch seine familiäre Größe, die historische Lage in Kambos, die Zitrusgärten und den direkten Kontakt zu den Gastgebern, bleibt dabei aber klar eine Unterkunft mit Zimmern und Apartments und kein Full-Service-Hotel.",
    airportParagraph:
      "Für Reisende, die eine Unterkunft nahe dem Flughafen Chios suchen, ist Kambos ebenfalls praktisch: Voulamandis House liegt etwa 3 km vom Flughafen und 8 km von Chios-Stadt und dem Hafen entfernt und verbindet kurze Wege bei An- und Abreise mit einer ruhigeren Lage außerhalb des Stadtzentrums.",
    fact: "Familiengeführte Gästeunterkunft mit historischem Kambos-Charakter",
    airportFact: "Etwa 3 km vom Flughafen und 8 km von Chios-Stadt und Hafen entfernt",
  },
  it: {
    seoDescription:
      "Alloggio a Chios al Voulamandis House di Kambos, vicino all’aeroporto di Chios: struttura familiare dal carattere tradizionale, con camere, appartamenti e disponibilità diretta.",
    introTitle: "Una struttura familiare dal carattere tradizionale di Chios",
    paragraph:
      "Chi cerca una guest house o un alloggio tradizionale a Chios spesso desidera una struttura più piccola, tranquilla e personale rispetto a un grande hotel. Voulamandis House risponde a questo stile di soggiorno grazie alla gestione familiare, alla posizione nello storico Kambos, agli agrumeti e al contatto diretto con gli ospiti, restando chiaramente una struttura con camere e appartamenti e non un hotel full-service.",
    airportParagraph:
      "Per chi cerca un alloggio vicino all’aeroporto di Chios, Kambos è anche una base pratica: Voulamandis House dista circa 3 km dall’aeroporto e 8 km dalla città e dal porto di Chios, offrendo collegamenti semplici senza rinunciare a un contesto più tranquillo fuori dal centro.",
    fact: "Struttura a gestione familiare nel contesto storico e autentico di Kambos",
    airportFact: "Circa 3 km dall’aeroporto e 8 km dalla città e dal porto di Chios",
  },
  es: {
    seoDescription:
      "Alojamiento en Quíos en Voulamandis House, Kambos, cerca del aeropuerto de Quíos: alojamiento familiar de carácter tradicional, con habitaciones, apartamentos y disponibilidad directa.",
    introTitle: "Un alojamiento familiar con el carácter tradicional de Quíos",
    paragraph:
      "Quienes buscan una casa de huéspedes o un alojamiento tradicional en Quíos suelen preferir una opción más pequeña, tranquila y personal que un gran hotel. Voulamandis House encaja con ese estilo gracias a su escala familiar, su ubicación en el histórico Kambos, los jardines de cítricos y el contacto directo con los anfitriones, manteniéndose claramente como alojamiento de habitaciones y apartamentos y no como hotel de servicio completo.",
    airportParagraph:
      "Para quienes buscan alojamiento cerca del aeropuerto de Quíos, Kambos también es una base práctica: Voulamandis House está a unos 3 km del aeropuerto y 8 km de la ciudad y el puerto de Quíos, con acceso cómodo y un entorno más tranquilo fuera del centro.",
    fact: "Alojamiento familiar en el entorno histórico y auténtico de Kambos",
    airportFact: "A unos 3 km del aeropuerto y 8 km de la ciudad y el puerto de Quíos",
  },
  tr: {
    seoDescription:
      "Sakız Adası’nda Kambos’taki Voulamandis House’ta, Sakız Havalimanı’na yakın konaklama: geleneksel karakterli aile işletmesi, oda ve daire seçenekleri ve direkt müsaitlik.",
    introTitle: "Sakız Adası’nın geleneksel karakterini taşıyan aile işletmesi konaklama",
    paragraph:
      "Sakız Adası’nda pansiyon veya geleneksel konaklama arayan gezginler genellikle büyük bir otelden daha küçük, sakin ve kişisel bir yer ister. Voulamandis House aile işletmesi yapısı, tarihi Kambos konumu, narenciye bahçeleri ve ev sahipleriyle doğrudan iletişim sayesinde bu beklentiye uygundur; ancak kendisini tam hizmet veren bir otel olarak değil, oda ve daire sunan bir konaklama tesisi olarak açıkça konumlandırır.",
    airportParagraph:
      "Sakız Havalimanı’na yakın konaklama arayanlar için Kambos aynı zamanda pratik bir konumdur: Voulamandis House havalimanına yaklaşık 3 km, Sakız şehir merkezi ve limanına yaklaşık 8 km uzaklıktadır; böylece ulaşım kolaylığı daha sakin bir çevreyle birleşir.",
    fact: "Tarihi Kambos atmosferinde aile işletmesi, kişisel konaklama deneyimi",
    airportFact: "Havalimanına yaklaşık 3 km, Sakız şehir merkezi ve limanına yaklaşık 8 km",
  },
};

function normalizeDistance(value: string): string {
  return value === "6 km" ? "8 km" : value;
}

function normalizeChiosPortDistanceText(value: string): string {
  return value.replace(/\b6 km\b/g, "8 km");
}

export function withTraditionalAccommodationIntent(
  data: ChiosAccommodationPageData,
  locale: LanguageCode,
): ChiosAccommodationPageData {
  const text = copy[locale];

  return {
    ...data,
    seo: {
      ...data.seo,
      description: text.seoDescription,
    },
    highlights: data.highlights.map((item) => ({
      ...item,
      value: normalizeDistance(item.value),
    })),
    intro: {
      ...data.intro,
      title: text.introTitle,
      paragraphs: [...data.intro.paragraphs, text.paragraph, text.airportParagraph],
      facts: [...data.intro.facts, text.fact, text.airportFact],
    },
    location: {
      ...data.location,
      paragraphs: data.location.paragraphs.map(normalizeChiosPortDistanceText),
      distances: data.location.distances.map((item) => ({
        ...item,
        value: normalizeDistance(item.value),
      })),
    },
    travelerTypes: {
      ...data.travelerTypes,
      items: data.travelerTypes.items.map((item) => ({
        ...item,
        text: normalizeChiosPortDistanceText(item.text),
      })),
    },
    faq: {
      ...data.faq,
      items: data.faq.items.map((item) => ({
        ...item,
        answer: normalizeChiosPortDistanceText(item.answer),
      })),
    },
  };
}
