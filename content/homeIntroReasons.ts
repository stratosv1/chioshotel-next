import type { HomePageData } from "@/content/home";

type IntroRight = HomePageData["intro"]["right"];

type SupportedLocale = "en" | "el" | "fr" | "de" | "it" | "es" | "tr";

const introReasonsByLocale: Record<SupportedLocale, IntroRight> = {
  en: {
    kicker: "What makes Voulamandis House special",
    title: "6 reasons your stay feels more personal, peaceful and authentically Chios",
    cards: [
      {
        title: "🏡 Authentic Chios stay",
        text: "A warm, family-run experience with local character and personal care.",
      },
      {
        title: "🌿 Peaceful courtyard",
        text: "Quiet garden atmosphere for relaxed mornings and calm evenings.",
      },
      {
        title: "🥐 Homemade breakfast",
        text: "Breakfast with local products and homemade touches, available on request.",
      },
      {
        title: "📍 Smart location",
        text: "Near town, airport, port and beaches, without the noise of the center.",
      },
      {
        title: "🍊 Local Chios tips",
        text: "Personal suggestions for beaches, villages, food and authentic island routes.",
      },
      {
        title: "🛎️ Book direct benefits",
        text: "Clear communication, flexible support and better direct-booking value.",
      },
    ],
  },
  el: {
    kicker: "Τι κάνει το Voulamandis House ξεχωριστό",
    title: "6 λόγοι που η διαμονή σας γίνεται πιο προσωπική, ήρεμη και αυθεντικά χιώτικη",
    cards: [
      {
        title: "🏡 Αυθεντική διαμονή στη Χίο",
        text: "Ζεστή οικογενειακή φιλοξενία με τοπικό χαρακτήρα και προσωπική φροντίδα.",
      },
      {
        title: "🌿 Ήρεμη αυλή",
        text: "Ατμόσφαιρα κήπου για χαλαρά πρωινά και ήσυχα βράδια.",
      },
      {
        title: "🥐 Σπιτικό πρωινό",
        text: "Πρωινό με τοπικά προϊόντα και σπιτικές πινελιές, διαθέσιμο κατόπιν ζήτησης.",
      },
      {
        title: "📍 Έξυπνη τοποθεσία",
        text: "Κοντά σε πόλη, αεροδρόμιο, λιμάνι και παραλίες, χωρίς τη φασαρία του κέντρου.",
      },
      {
        title: "🍊 Τοπικές προτάσεις Χίου",
        text: "Προσωπικές ιδέες για παραλίες, χωριά, φαγητό και αυθεντικές διαδρομές.",
      },
      {
        title: "🛎️ Οφέλη απευθείας κράτησης",
        text: "Καθαρή επικοινωνία, ευελιξία και καλύτερη αξία όταν κλείνετε απευθείας.",
      },
    ],
  },
  fr: {
    kicker: "Ce qui rend Voulamandis House spécial",
    title: "6 raisons pour un séjour plus personnel, paisible et authentiquement chiote",
    cards: [
      {
        title: "🏡 Séjour authentique à Chios",
        text: "Une expérience familiale chaleureuse, avec caractère local et attention personnelle.",
      },
      {
        title: "🌿 Cour paisible",
        text: "Une atmosphère de jardin pour des matins détendus et des soirées calmes.",
      },
      {
        title: "🥐 Petit-déjeuner maison",
        text: "Des produits locaux et des touches maison, disponibles sur demande.",
      },
      {
        title: "📍 Emplacement pratique",
        text: "Près de la ville, de l’aéroport, du port et des plages, sans le bruit du centre.",
      },
      {
        title: "🍊 Conseils locaux sur Chios",
        text: "Suggestions personnelles pour plages, villages, cuisine et itinéraires authentiques.",
      },
      {
        title: "🛎️ Avantages en direct",
        text: "Communication claire, soutien flexible et meilleure valeur en réservant directement.",
      },
    ],
  },
  de: {
    kicker: "Was Voulamandis House besonders macht",
    title: "6 Gründe für einen persönlicheren, ruhigeren und authentischeren Chios-Aufenthalt",
    cards: [
      {
        title: "🏡 Authentischer Chios-Aufenthalt",
        text: "Eine warme, familiengeführte Unterkunft mit lokalem Charakter und persönlicher Betreuung.",
      },
      {
        title: "🌿 Ruhiger Innenhof",
        text: "Gartenatmosphäre für entspannte Morgen und ruhige Abende.",
      },
      {
        title: "🥐 Hausgemachtes Frühstück",
        text: "Frühstück mit lokalen Produkten und hausgemachten Details, auf Anfrage verfügbar.",
      },
      {
        title: "📍 Praktische Lage",
        text: "Nahe Stadt, Flughafen, Hafen und Stränden, ohne den Lärm des Zentrums.",
      },
      {
        title: "🍊 Lokale Chios-Tipps",
        text: "Persönliche Vorschläge für Strände, Dörfer, Essen und authentische Inselrouten.",
      },
      {
        title: "🛎️ Direktbuchungs-Vorteile",
        text: "Klare Kommunikation, flexible Unterstützung und besserer Wert bei direkter Buchung.",
      },
    ],
  },
  it: {
    kicker: "Cosa rende speciale Voulamandis House",
    title: "6 motivi per un soggiorno più personale, tranquillo e autenticamente di Chios",
    cards: [
      {
        title: "🏡 Soggiorno autentico a Chios",
        text: "Un’esperienza familiare e calorosa, con carattere locale e cura personale.",
      },
      {
        title: "🌿 Cortile tranquillo",
        text: "Atmosfera di giardino per mattine rilassate e serate serene.",
      },
      {
        title: "🥐 Colazione fatta in casa",
        text: "Prodotti locali e tocchi casalinghi, disponibili su richiesta.",
      },
      {
        title: "📍 Posizione comoda",
        text: "Vicino a città, aeroporto, porto e spiagge, senza il rumore del centro.",
      },
      {
        title: "🍊 Consigli locali su Chios",
        text: "Suggerimenti personali per spiagge, villaggi, cibo e percorsi autentici.",
      },
      {
        title: "🛎️ Vantaggi prenotazione diretta",
        text: "Comunicazione chiara, supporto flessibile e più valore prenotando direttamente.",
      },
    ],
  },
  es: {
    kicker: "Qué hace especial a Voulamandis House",
    title: "6 razones para una estancia más personal, tranquila y auténticamente de Quíos",
    cards: [
      {
        title: "🏡 Estancia auténtica en Quíos",
        text: "Una experiencia familiar y cálida, con carácter local y atención personal.",
      },
      {
        title: "🌿 Patio tranquilo",
        text: "Ambiente de jardín para mañanas relajadas y noches en calma.",
      },
      {
        title: "🥐 Desayuno casero",
        text: "Productos locales y detalles caseros, disponibles bajo petición.",
      },
      {
        title: "📍 Ubicación inteligente",
        text: "Cerca de la ciudad, aeropuerto, puerto y playas, sin el ruido del centro.",
      },
      {
        title: "🍊 Consejos locales de Quíos",
        text: "Sugerencias personales para playas, pueblos, comida y rutas auténticas.",
      },
      {
        title: "🛎️ Ventajas de reservar directo",
        text: "Comunicación clara, apoyo flexible y mejor valor al reservar directamente.",
      },
    ],
  },
  tr: {
    kicker: "Voulamandis House’u özel kılan şeyler",
    title: "Konaklamanızı daha kişisel, sakin ve gerçek bir Sakız deneyimi yapan 6 neden",
    cards: [
      {
        title: "🏡 Sakız’da otantik konaklama",
        text: "Yerel karaktere ve kişisel ilgiye sahip sıcak, aile işletmesi bir deneyim.",
      },
      {
        title: "🌿 Huzurlu avlu",
        text: "Rahat sabahlar ve sakin akşamlar için bahçe atmosferi.",
      },
      {
        title: "🥐 Ev yapımı kahvaltı",
        text: "Yerel ürünler ve ev yapımı dokunuşlarla, talep üzerine kahvaltı.",
      },
      {
        title: "📍 Akıllı konum",
        text: "Merkezin gürültüsü olmadan şehir, havalimanı, liman ve plajlara yakın.",
      },
      {
        title: "🍊 Yerel Sakız önerileri",
        text: "Plajlar, köyler, yemek ve otantik ada rotaları için kişisel öneriler.",
      },
      {
        title: "🛎️ Doğrudan rezervasyon avantajları",
        text: "Net iletişim, esnek destek ve doğrudan rezervasyonda daha iyi değer.",
      },
    ],
  },
};

function getLocaleFromCanonicalPath(canonicalPath: string): SupportedLocale {
  const segment = canonicalPath.split("/").filter(Boolean)[0];

  if (segment === "el" || segment === "fr" || segment === "de" || segment === "it" || segment === "es" || segment === "tr") {
    return segment;
  }

  return "en";
}

export function withUpdatedIntroReasons(data: HomePageData): HomePageData {
  const locale = getLocaleFromCanonicalPath(data.seo.canonicalPath);

  return {
    ...data,
    intro: {
      ...data.intro,
      right: introReasonsByLocale[locale],
    },
  };
}
