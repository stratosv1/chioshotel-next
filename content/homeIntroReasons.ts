import type { HomePageData } from "@/content/home";

type IntroRight = HomePageData["intro"]["right"];

type SupportedLocale = "en" | "el" | "fr" | "de" | "it" | "es" | "tr";

const googleMapsLink = "https://www.google.com/maps/search/?api=1&query=Voulamandis%20House%20Kambos%20Chios";

const introReasonsByLocale: Record<SupportedLocale, IntroRight> = {
  en: {
    kicker: "What makes Voulamandis House special",
    title: "6 reasons your stay feels more personal, peaceful and authentically Chios",
    cards: [
      {
        title: "🏡 Authentic Chios hospitality",
        text: "A warm, family-run welcome with local character and personal care.",
      },
      {
        title: "🛏️ Comfortable, well-kept rooms",
        text: "Thoughtfully prepared rooms and apartments for couples, friends and families.",
      },
      {
        title: "✨ High cleaning standards",
        text: "Spotless rooms, fresh linen and careful attention to every detail.",
      },
      {
        title: "📍 Smart location on Chios",
        text: "Near town, airport, port and beaches, without the noise of the center.",
      },
      {
        title: "⭐ Excellent guest reviews",
        text: "Guests consistently praise our hospitality, cleanliness and peaceful setting.",
      },
      {
        title: "💶 Book direct benefits",
        text: "Better direct-booking value, clear communication and personal support.",
      },
    ],
  },
  el: {
    kicker: "Τι κάνει το Voulamandis House ξεχωριστό",
    title: "6 λόγοι που η διαμονή σας γίνεται πιο προσωπική, ήρεμη και αυθεντικά χιώτικη",
    cards: [
      {
        title: "🏡 Αυθεντική χιώτικη φιλοξενία",
        text: "Ζεστή οικογενειακή φιλοξενία με τοπικό χαρακτήρα και προσωπική φροντίδα.",
      },
      {
        title: "🛏️ Άνετα & προσεγμένα δωμάτια",
        text: "Φροντισμένα δωμάτια και διαμερίσματα για ζευγάρια, φίλους και οικογένειες.",
      },
      {
        title: "✨ Υψηλά πρότυπα καθαριότητας",
        text: "Πεντακάθαρα δωμάτια, φρέσκα λευκά είδη και προσοχή σε κάθε λεπτομέρεια.",
      },
      {
        title: "📍 Έξυπνη τοποθεσία στη Χίο",
        text: "Κοντά σε πόλη, αεροδρόμιο, λιμάνι και παραλίες, χωρίς τη φασαρία του κέντρου.",
      },
      {
        title: "⭐ Άριστες αξιολογήσεις επισκεπτών",
        text: "Οι επισκέπτες μας ξεχωρίζουν σταθερά τη φιλοξενία, την καθαριότητα και την ηρεμία.",
      },
      {
        title: "💶 Οφέλη απευθείας κράτησης",
        text: "Καλύτερη τιμή όταν κλείνετε απευθείας, καθαρή επικοινωνία και προσωπική εξυπηρέτηση.",
      },
    ],
  },
  fr: {
    kicker: "Ce qui rend Voulamandis House spécial",
    title: "6 raisons pour un séjour plus personnel, paisible et authentiquement chiote",
    cards: [
      {
        title: "🏡 Hospitalité authentique de Chios",
        text: "Un accueil familial chaleureux, avec caractère local et attention personnelle.",
      },
      {
        title: "🛏️ Chambres confortables et soignées",
        text: "Chambres et appartements préparés avec soin pour couples, amis et familles.",
      },
      {
        title: "✨ Propreté irréprochable",
        text: "Chambres impeccables, linge frais et attention à chaque détail.",
      },
      {
        title: "📍 Emplacement pratique à Chios",
        text: "Près de la ville, de l’aéroport, du port et des plages, sans le bruit du centre.",
      },
      {
        title: "⭐ Excellents avis clients",
        text: "Nos hôtes saluent régulièrement l’accueil, la propreté et le calme.",
      },
      {
        title: "💶 Avantages en direct",
        text: "Meilleur prix en réservant directement, communication claire et suivi personnel.",
      },
    ],
  },
  de: {
    kicker: "Was Voulamandis House besonders macht",
    title: "6 Gründe für einen persönlicheren, ruhigeren und authentischeren Chios-Aufenthalt",
    cards: [
      {
        title: "🏡 Authentische Gastfreundschaft auf Chios",
        text: "Ein herzlicher, familiengeführter Empfang mit lokalem Charakter und persönlicher Betreuung.",
      },
      {
        title: "🛏️ Komfortable, gepflegte Zimmer",
        text: "Liebevoll vorbereitete Zimmer und Apartments für Paare, Freunde und Familien.",
      },
      {
        title: "✨ Hohe Sauberkeitsstandards",
        text: "Makellose Zimmer, frische Wäsche und Liebe zum Detail.",
      },
      {
        title: "📍 Praktische Lage auf Chios",
        text: "Nahe Stadt, Flughafen, Hafen und Stränden, ohne den Lärm des Zentrums.",
      },
      {
        title: "⭐ Ausgezeichnete Gästebewertungen",
        text: "Gäste loben immer wieder Gastfreundschaft, Sauberkeit und Ruhe.",
      },
      {
        title: "💶 Direktbuchungs-Vorteile",
        text: "Besserer Preis bei direkter Buchung, klare Kommunikation und persönlicher Service.",
      },
    ],
  },
  it: {
    kicker: "Cosa rende speciale Voulamandis House",
    title: "6 motivi per un soggiorno più personale, tranquillo e autenticamente di Chios",
    cards: [
      {
        title: "🏡 Ospitalità autentica di Chios",
        text: "Un’accoglienza familiare e calorosa, con carattere locale e cura personale.",
      },
      {
        title: "🛏️ Camere comode e curate",
        text: "Camere e appartamenti preparati con cura per coppie, amici e famiglie.",
      },
      {
        title: "✨ Alti standard di pulizia",
        text: "Camere impeccabili, biancheria fresca e attenzione a ogni dettaglio.",
      },
      {
        title: "📍 Posizione comoda a Chios",
        text: "Vicino a città, aeroporto, porto e spiagge, senza il rumore del centro.",
      },
      {
        title: "⭐ Recensioni eccellenti",
        text: "Gli ospiti lodano costantemente l’accoglienza, la pulizia e la tranquillità.",
      },
      {
        title: "💶 Vantaggi prenotazione diretta",
        text: "Prezzo migliore prenotando direttamente, comunicazione chiara e assistenza personale.",
      },
    ],
  },
  es: {
    kicker: "Qué hace especial a Voulamandis House",
    title: "6 razones para una estancia más personal, tranquila y auténticamente de Quíos",
    cards: [
      {
        title: "🏡 Hospitalidad auténtica de Quíos",
        text: "Una bienvenida familiar y cálida, con carácter local y atención personal.",
      },
      {
        title: "🛏️ Habitaciones cómodas y cuidadas",
        text: "Habitaciones y apartamentos preparados con esmero para parejas, amigos y familias.",
      },
      {
        title: "✨ Altos estándares de limpieza",
        text: "Habitaciones impecables, ropa de cama fresca y atención a cada detalle.",
      },
      {
        title: "📍 Ubicación inteligente en Quíos",
        text: "Cerca de la ciudad, aeropuerto, puerto y playas, sin el ruido del centro.",
      },
      {
        title: "⭐ Excelentes opiniones",
        text: "Los huéspedes destacan siempre la hospitalidad, la limpieza y la tranquilidad.",
      },
      {
        title: "💶 Ventajas de reservar directo",
        text: "Mejor precio al reservar directamente, comunicación clara y atención personal.",
      },
    ],
  },
  tr: {
    kicker: "Voulamandis House’u özel kılan şeyler",
    title: "Konaklamanızı daha kişisel, sakin ve gerçek bir Sakız deneyimi yapan 6 neden",
    cards: [
      {
        title: "🏡 Otantik Sakız misafirperverliği",
        text: "Yerel karaktere ve kişisel ilgiye sahip sıcak, aile işletmesi bir karşılama.",
      },
      {
        title: "🛏️ Konforlu ve özenli odalar",
        text: "Çiftler, arkadaşlar ve aileler için özenle hazırlanmış odalar ve daireler.",
      },
      {
        title: "✨ Yüksek temizlik standartları",
        text: "Tertemiz odalar, taze nevresimler ve her ayrıntıya özen.",
      },
      {
        title: "📍 Sakız’da akıllı konum",
        text: "Merkezin gürültüsü olmadan şehir, havalimanı, liman ve plajlara yakın.",
      },
      {
        title: "⭐ Mükemmel misafir yorumları",
        text: "Misafirlerimiz misafirperverliği, temizliği ve huzuru sürekli övüyor.",
      },
      {
        title: "💶 Doğrudan rezervasyon avantajları",
        text: "Doğrudan rezervasyonda daha iyi fiyat, net iletişim ve kişisel destek.",
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
    location: {
      ...data.location,
      map: {
        ...data.location.map,
        iframeSrc: googleMapsLink,
      },
    },
  };
}
