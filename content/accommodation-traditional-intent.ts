import type { ChiosAccommodationPageData } from "@/content/chios-accommodation";
import type { LanguageCode } from "@/lib/languages";

type TraditionalIntentCopy = {
  seoDescription: string;
  introTitle: string;
  paragraph: string;
  fact: string;
};

const copy: Record<LanguageCode, TraditionalIntentCopy> = {
  en: {
    seoDescription:
      "Stay at Voulamandis House in Kambos, Chios: peaceful family-run guest accommodation with the character of a traditional Chios stay, rooms, apartments and direct availability.",
    introTitle: "A family-run guest accommodation with traditional Chios character",
    paragraph:
      "Travellers searching for a guest house or traditional accommodation in Chios often want something smaller, quieter and more personal than a large hotel. Voulamandis House fits that travel style through its family-run scale, historic Kambos setting, citrus gardens and direct contact with the hosts, while remaining clearly a rooms-and-apartments accommodation rather than a full-service hotel.",
    fact: "A family-run guest accommodation with traditional Kambos character",
  },
  el: {
    seoDescription:
      "Διαμονή στη Χίο στο Voulamandis House στον Κάμπο: μικρό οικογενειακό κατάλυμα με χαρακτήρα παραδοσιακής διαμονής, δωμάτια, διαμερίσματα και άμεση διαθεσιμότητα.",
    introTitle: "Οικογενειακό κατάλυμα με τον χαρακτήρα παραδοσιακής διαμονής στη Χίο",
    paragraph:
      "Όσοι αναζητούν ξενώνα ή παραδοσιακό κατάλυμα στη Χίο συνήθως θέλουν μικρότερη κλίμακα, ησυχία και πιο προσωπική φιλοξενία από ένα μεγάλο ξενοδοχείο. Το Voulamandis House ταιριάζει σε αυτό το στυλ διαμονής χάρη στον οικογενειακό χαρακτήρα του, τη θέση του στον ιστορικό Κάμπο, τα περιβόλια και την άμεση επικοινωνία με τους οικοδεσπότες, ενώ παραμένει ξεκάθαρα κατάλυμα με δωμάτια και διαμερίσματα και όχι ξενοδοχείο πλήρων υπηρεσιών.",
    fact: "Οικογενειακό κατάλυμα με αυθεντικό χαρακτήρα Κάμπου και προσωπική φιλοξενία",
  },
  fr: {
    seoDescription:
      "Hébergement à Chios au Voulamandis House à Kambos : petite maison d’hôtes familiale au caractère traditionnel, avec chambres, appartements et disponibilités en direct.",
    introTitle: "Une maison d’hôtes familiale au caractère traditionnel de Chios",
    paragraph:
      "Les voyageurs qui recherchent une maison d’hôtes ou un hébergement traditionnel à Chios souhaitent souvent une adresse plus petite, plus calme et plus personnelle qu’un grand hôtel. Voulamandis House correspond à cet esprit grâce à sa taille familiale, son cadre historique à Kambos, ses agrumes et le contact direct avec les hôtes, tout en restant clairement un hébergement de chambres et d’appartements plutôt qu’un hôtel avec services complets.",
    fact: "Maison d’hôtes familiale dans le cadre historique et verdoyant de Kambos",
  },
  de: {
    seoDescription:
      "Unterkunft auf Chios im Voulamandis House in Kambos: kleine familiengeführte Gästeunterkunft mit traditionellem Charakter, Zimmern, Apartments und Direktverfügbarkeit.",
    introTitle: "Familiengeführte Gästeunterkunft mit traditionellem Chios-Charakter",
    paragraph:
      "Wer nach einem Gästehaus oder einer traditionellen Unterkunft auf Chios sucht, wünscht sich oft eine kleinere, ruhigere und persönlichere Alternative zu einem großen Hotel. Voulamandis House passt zu diesem Reisestil durch seine familiäre Größe, die historische Lage in Kambos, die Zitrusgärten und den direkten Kontakt zu den Gastgebern, bleibt dabei aber klar eine Unterkunft mit Zimmern und Apartments und kein Full-Service-Hotel.",
    fact: "Familiengeführte Gästeunterkunft mit historischem Kambos-Charakter",
  },
  it: {
    seoDescription:
      "Alloggio a Chios al Voulamandis House di Kambos: piccola struttura a gestione familiare dal carattere tradizionale, con camere, appartamenti e disponibilità diretta.",
    introTitle: "Una struttura familiare dal carattere tradizionale di Chios",
    paragraph:
      "Chi cerca una guest house o un alloggio tradizionale a Chios spesso desidera una struttura più piccola, tranquilla e personale rispetto a un grande hotel. Voulamandis House risponde a questo stile di soggiorno grazie alla gestione familiare, alla posizione nello storico Kambos, agli agrumeti e al contatto diretto con gli ospiti, restando chiaramente una struttura con camere e appartamenti e non un hotel full-service.",
    fact: "Struttura a gestione familiare nel contesto storico e autentico di Kambos",
  },
  es: {
    seoDescription:
      "Alojamiento en Quíos en Voulamandis House, Kambos: pequeño alojamiento familiar de carácter tradicional, con habitaciones, apartamentos y disponibilidad directa.",
    introTitle: "Un alojamiento familiar con el carácter tradicional de Quíos",
    paragraph:
      "Quienes buscan una casa de huéspedes o un alojamiento tradicional en Quíos suelen preferir una opción más pequeña, tranquila y personal que un gran hotel. Voulamandis House encaja con ese estilo gracias a su escala familiar, su ubicación en el histórico Kambos, los jardines de cítricos y el contacto directo con los anfitriones, manteniéndose claramente como alojamiento de habitaciones y apartamentos y no como hotel de servicio completo.",
    fact: "Alojamiento familiar en el entorno histórico y auténtico de Kambos",
  },
  tr: {
    seoDescription:
      "Sakız Adası’nda Kambos’taki Voulamandis House’ta konaklama: geleneksel karakterli, aile işletmesi küçük konaklama tesisi, oda ve daire seçenekleri ve direkt müsaitlik.",
    introTitle: "Sakız Adası’nın geleneksel karakterini taşıyan aile işletmesi konaklama",
    paragraph:
      "Sakız Adası’nda pansiyon veya geleneksel konaklama arayan gezginler genellikle büyük bir otelden daha küçük, sakin ve kişisel bir yer ister. Voulamandis House aile işletmesi yapısı, tarihi Kambos konumu, narenciye bahçeleri ve ev sahipleriyle doğrudan iletişim sayesinde bu beklentiye uygundur; ancak kendisini tam hizmet veren bir otel olarak değil, oda ve daire sunan bir konaklama tesisi olarak açıkça konumlandırır.",
    fact: "Tarihi Kambos atmosferinde aile işletmesi, kişisel konaklama deneyimi",
  },
};

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
    intro: {
      ...data.intro,
      title: text.introTitle,
      paragraphs: [...data.intro.paragraphs, text.paragraph],
      facts: [...data.intro.facts, text.fact],
    },
  };
}
