import type { LanguageCode } from "@/lib/languages";

type RomanticLocale = Exclude<LanguageCode, "pl">;

type Cta = { label: string; href: string };
type Image = { src: string; alt: string };

type RomanticCard = {
  title: string;
  text: string;
  image: Image;
};

export type RomanticStayPageData = {
  locale: RomanticLocale;
  path: string;
  seo: {
    title: string;
    description: string;
    ogImage: string;
  };
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    image: Image;
    primaryCta: Cta;
    secondaryCta: Cta;
  };
  intro: {
    eyebrow: string;
    title: string;
    text: string;
  };
  reasons: {
    title: string;
    intro: string;
    cards: RomanticCard[];
  };
  stay: {
    eyebrow: string;
    title: string;
    text: string;
    image: Image;
    primaryCta: Cta;
    secondaryCta: Cta;
  };
  finalCta: {
    title: string;
    text: string;
    primaryCta: Cta;
    secondaryCta: Cta;
  };
};

const images = {
  hero: "/images/beaches/voulamandis-house-courtyard-chios.webp",
  garden: "/images/activities/chios.hotels.voulamandis.house_.hero_.image_.webp",
  room: "/images/rooms/double-triple-room.jpg",
  terrace: "/images/rooms/DSC07776-2-e1675109942622.webp",
  kambos: "/images/kampos/kambos-chios.jpg",
};

export const romanticStayPaths: Record<RomanticLocale, string> = {
  en: "/romantic-stay-in-chios/",
  el: "/el/romantiki-diamoni-sti-xio/",
  fr: "/fr/sejour-romantique-chios/",
  de: "/de/romantischer-aufenthalt-auf-chios/",
  it: "/it/soggiorno-romantico-chios/",
  es: "/es/estancia-romantica-quios/",
  tr: "/tr/sakiz-adasi-romantik-konaklama/",
};

export const romanticStayData: Record<RomanticLocale, RomanticStayPageData> = {
  en: {
    locale: "en",
    path: romanticStayPaths.en,
    seo: {
      title: "Romantic Stay in Chios for Couples | Voulamandis House",
      description: "Plan a romantic stay in Chios for two at Voulamandis House in historic Kambos: quiet citrus gardens, intimate rooms, terraces and direct booking.",
      ogImage: images.hero,
    },
    hero: {
      eyebrow: "Couples stay in Kambos, Chios",
      title: "A romantic stay in Chios for two",
      subtitle: "Quiet gardens, historic Kambos and a more personal place to return to after exploring the island together.",
      image: { src: images.hero, alt: "Romantic stay for couples at Voulamandis House in Kambos Chios" },
      primaryCta: { label: "Check direct rates", href: "/chios-hotels-rates/" },
      secondaryCta: { label: "See rooms for two", href: "/chios-rooms/" },
    },
    intro: {
      eyebrow: "A quieter side of Chios",
      title: "For couples who prefer atmosphere over a busy resort",
      text: "Voulamandis House is a family-run guest accommodation, not a hotel. Its setting among the citrus estates of Kambos suits couples looking for calm evenings, garden spaces and easy access to Chios Town, beaches and the south of the island.",
    },
    reasons: {
      title: "Why couples choose Kambos and Voulamandis House",
      intro: "The appeal is simple: less noise, more character and a practical base for sharing the island at your own pace.",
      cards: [
        { title: "Citrus-garden atmosphere", text: "Historic estates, stone walls and greenery create a calm setting that feels very different from a busy town-centre stay.", image: { src: images.garden, alt: "Quiet citrus garden at Voulamandis House in Kambos" } },
        { title: "Comfortable rooms for two", text: "Choose from economy, ground-floor and upper-floor room categories depending on budget, access and the atmosphere you prefer.", image: { src: images.room, alt: "Double room for couples at Voulamandis House Chios" } },
        { title: "Terraces and slow evenings", text: "Upper-floor options and shared outdoor spaces make it easy to slow down after a beach day or an evening in Chios Town.", image: { src: images.terrace, alt: "Terrace and room view at Voulamandis House in Chios" } },
        { title: "Close to town, airport and beaches", text: "Kambos keeps you near the places you need while offering a quieter base away from the busiest streets.", image: { src: images.kambos, alt: "Historic Kambos Chios near Voulamandis House" } },
      ],
    },
    stay: {
      eyebrow: "Choose your room category",
      title: "A couple’s stay that fits your travel style",
      text: "For a simple value-focused trip, start with the Economy Double category. For easy garden access choose a ground-floor room, while upper-floor rooms offer a brighter feel and terrace access. Booking is by room category, not by a specific room number.",
      image: { src: images.room, alt: "Room category for a couples stay in Chios" },
      primaryCta: { label: "Compare rooms", href: "/chios-rooms/" },
      secondaryCta: { label: "Discover Kambos", href: "/chios/kampos-chios/" },
    },
    finalCta: {
      title: "Plan your stay in Chios together",
      text: "Check current availability and direct rates, then choose the room category that matches the way you want to experience Chios as a couple.",
      primaryCta: { label: "Check availability & rates", href: "/chios-hotels-rates/" },
      secondaryCta: { label: "View Chios accommodation", href: "/chios-accommodation/" },
    },
  },
  el: {
    locale: "el",
    path: romanticStayPaths.el,
    seo: {
      title: "Ρομαντική Διαμονή στη Χίο για Ζευγάρια | Voulamandis House",
      description: "Ρομαντική διαμονή στη Χίο για δύο στο Voulamandis House στον ιστορικό Κάμπο: ήσυχα περιβόλια, όμορφοι εξωτερικοί χώροι, δίκλινα δωμάτια και άμεση κράτηση.",
      ogImage: images.hero,
    },
    hero: {
      eyebrow: "Διαμονή για ζευγάρια στον Κάμπο Χίου",
      title: "Ρομαντική διαμονή στη Χίο για δύο",
      subtitle: "Ήσυχα περιβόλια, ιστορικός Κάμπος και ένα πιο προσωπικό μέρος για να επιστρέφετε μετά τις βόλτες σας στο νησί.",
      image: { src: images.hero, alt: "Ρομαντική διαμονή για ζευγάρια στο Voulamandis House στον Κάμπο Χίου" },
      primaryCta: { label: "Δείτε απευθείας τιμές", href: "/el/amesi-kratisi-voulamandis-house/" },
      secondaryCta: { label: "Δείτε δωμάτια για δύο", href: "/el/domatia-xios/" },
    },
    intro: {
      eyebrow: "Η πιο ήρεμη πλευρά της Χίου",
      title: "Για ζευγάρια που προτιμούν ατμόσφαιρα αντί για ένα πολυσύχναστο resort",
      text: "Το Voulamandis House είναι οικογενειακό κατάλυμα και όχι ξενοδοχείο. Η θέση του μέσα στα περιβόλια του Κάμπου ταιριάζει σε ζευγάρια που θέλουν ήσυχα βράδια, κήπο και εύκολη πρόσβαση στην πόλη, τις παραλίες και τη νότια Χίο.",
    },
    reasons: {
      title: "Γιατί ο Κάμπος και το Voulamandis House ταιριάζουν σε ζευγάρια",
      intro: "Λιγότερος θόρυβος, περισσότερος χαρακτήρας και μια πρακτική βάση για να γνωρίσετε τη Χίο με τον δικό σας ρυθμό.",
      cards: [
        { title: "Ατμόσφαιρα μέσα στα περιβόλια", text: "Ιστορικά κτήματα, πέτρινοι τοίχοι και πράσινο δημιουργούν ένα ήρεμο περιβάλλον διαφορετικό από τη διαμονή στο κέντρο της πόλης.", image: { src: images.garden, alt: "Ήσυχος κήπος και περιβόλια στο Voulamandis House" } },
        { title: "Άνετα δωμάτια για δύο", text: "Επιλέξτε οικονομικό δίκλινο, ισόγεια ή δωμάτια ορόφου ανάλογα με το budget, την πρόσβαση και την ατμόσφαιρα που προτιμάτε.", image: { src: images.room, alt: "Δίκλινο δωμάτιο για ζευγάρια στη Χίο" } },
        { title: "Βεράντες και ήρεμα βράδια", text: "Οι επιλογές ορόφου και οι εξωτερικοί χώροι βοηθούν να χαλαρώσετε μετά από μια ημέρα στην παραλία ή μια βόλτα στην πόλη της Χίου.", image: { src: images.terrace, alt: "Βεράντα στο Voulamandis House στον Κάμπο" } },
        { title: "Κοντά σε πόλη, αεροδρόμιο και παραλίες", text: "Ο Κάμπος σας κρατά κοντά στις βασικές μετακινήσεις, χωρίς να μένετε στους πιο πολυσύχναστους δρόμους της πόλης.", image: { src: images.kambos, alt: "Ιστορικός Κάμπος Χίου κοντά στο Voulamandis House" } },
      ],
    },
    stay: {
      eyebrow: "Επιλέξτε κατηγορία δωματίου",
      title: "Διαμονή για ζευγάρια ανάλογα με το ταξίδι σας",
      text: "Για πιο οικονομική επιλογή ξεκινήστε από τα Economy Double. Για άμεση πρόσβαση στον κήπο προτιμήστε ισόγεια κατηγορία, ενώ τα δωμάτια ορόφου προσφέρουν πιο φωτεινή αίσθηση και πρόσβαση σε βεράντα. Η κράτηση γίνεται σε κατηγορία δωματίου και όχι σε συγκεκριμένο αριθμό.",
      image: { src: images.room, alt: "Κατηγορία δωματίου για ζευγάρια στη Χίο" },
      primaryCta: { label: "Συγκρίνετε δωμάτια", href: "/el/domatia-xios/" },
      secondaryCta: { label: "Ανακαλύψτε τον Κάμπο", href: "/el/chios/kampos-chios/" },
    },
    finalCta: {
      title: "Οργανώστε μαζί τη διαμονή σας στη Χίο",
      text: "Δείτε τρέχουσα διαθεσιμότητα και απευθείας τιμές και επιλέξτε την κατηγορία που ταιριάζει στο ταξίδι σας ως ζευγάρι.",
      primaryCta: { label: "Διαθεσιμότητα & τιμές", href: "/el/amesi-kratisi-voulamandis-house/" },
      secondaryCta: { label: "Διαμονή στη Χίο", href: "/el/diamoni-sti-xio/" },
    },
  },
  fr: {
    locale: "fr",
    path: romanticStayPaths.fr,
    seo: { title: "Séjour romantique à Chios en couple | Voulamandis House", description: "Séjour romantique à Chios en couple au Voulamandis House à Kambos : jardin d’agrumes paisible, chambres doubles, terrasses et réservation directe.", ogImage: images.hero },
    hero: { eyebrow: "Séjour en couple à Kambos, Chios", title: "Un séjour romantique à Chios à deux", subtitle: "Un jardin paisible, le Kambos historique et une adresse plus personnelle pour profiter de l’île à votre rythme.", image: { src: images.hero, alt: "Séjour romantique en couple au Voulamandis House à Chios" }, primaryCta: { label: "Voir les tarifs directs", href: "/fr/tarifs-des-hotels-a-chios/" }, secondaryCta: { label: "Voir les chambres pour deux", href: "/fr/chambres-a-chios/" } },
    intro: { eyebrow: "Une autre facette de Chios", title: "Pour les couples qui recherchent le calme et le caractère", text: "Voulamandis House est un hébergement familial, pas un hôtel. Son cadre au milieu des agrumes de Kambos convient aux couples qui apprécient les soirées calmes, les espaces extérieurs et un accès facile à la ville, aux plages et au sud de Chios." },
    reasons: { title: "Pourquoi choisir Kambos pour un séjour en couple", intro: "Moins de bruit, plus de caractère et une base pratique pour découvrir l’île ensemble.", cards: [
      { title: "Atmosphère de jardin d’agrumes", text: "Domaines historiques, murs de pierre et végétation créent un environnement paisible loin de l’agitation du centre.", image: { src: images.garden, alt: "Jardin paisible du Voulamandis House à Kambos" } },
      { title: "Chambres confortables pour deux", text: "Choisissez une chambre économique, au rez-de-chaussée ou à l’étage selon votre budget et vos préférences.", image: { src: images.room, alt: "Chambre double pour couple au Voulamandis House" } },
      { title: "Terrasses et soirées tranquilles", text: "Les espaces extérieurs et les chambres à l’étage invitent à ralentir après une journée sur l’île.", image: { src: images.terrace, alt: "Terrasse au Voulamandis House à Chios" } },
      { title: "Proche de la ville et des plages", text: "Kambos permet de rester proche des principaux trajets tout en évitant les rues les plus animées.", image: { src: images.kambos, alt: "Kambos historique à Chios" } },
    ] },
    stay: { eyebrow: "Choisissez votre catégorie", title: "Un séjour à deux adapté à votre style de voyage", text: "Les chambres Economy Double conviennent à un séjour simple et avantageux. Le rez-de-chaussée facilite l’accès au jardin, tandis que l’étage offre une ambiance plus lumineuse et un accès à la terrasse. La réservation porte sur une catégorie, pas sur un numéro précis.", image: { src: images.room, alt: "Chambre pour séjour en couple à Chios" }, primaryCta: { label: "Comparer les chambres", href: "/fr/chambres-a-chios/" }, secondaryCta: { label: "Découvrir Kambos", href: "/fr/chios/kampos-chios/" } },
    finalCta: { title: "Préparez votre séjour à Chios à deux", text: "Consultez les disponibilités et les tarifs directs puis choisissez la catégorie qui correspond à votre voyage en couple.", primaryCta: { label: "Disponibilités & tarifs", href: "/fr/tarifs-des-hotels-a-chios/" }, secondaryCta: { label: "Hébergement à Chios", href: "/fr/hebergement-chios/" } },
  },
  de: {
    locale: "de",
    path: romanticStayPaths.de,
    seo: { title: "Romantischer Aufenthalt auf Chios für Paare | Voulamandis House", description: "Romantischer Aufenthalt auf Chios für Paare im Voulamandis House in Kambos: ruhiger Zitrusgarten, Doppelzimmer, Terrassen und Direktbuchung.", ogImage: images.hero },
    hero: { eyebrow: "Paarurlaub in Kambos auf Chios", title: "Romantischer Aufenthalt auf Chios zu zweit", subtitle: "Ruhige Gärten, historisches Kambos und eine persönliche Unterkunft als entspannte Basis für gemeinsame Tage auf der Insel.", image: { src: images.hero, alt: "Romantischer Aufenthalt für Paare im Voulamandis House auf Chios" }, primaryCta: { label: "Direktpreise prüfen", href: "/de/hotelpreise-auf-der-insel-chios/" }, secondaryCta: { label: "Zimmer für zwei ansehen", href: "/de/chios-zimmer/" } },
    intro: { eyebrow: "Die ruhigere Seite von Chios", title: "Für Paare, die Atmosphäre und Ruhe suchen", text: "Voulamandis House ist eine familiengeführte Unterkunft und kein Hotel. Die Lage zwischen den Zitrusgärten von Kambos passt zu Paaren, die ruhige Abende, Außenbereiche und kurze Wege nach Chios-Stadt, zu Stränden und in den Süden schätzen." },
    reasons: { title: "Warum Kambos gut zu einer Reise zu zweit passt", intro: "Weniger Trubel, mehr Charakter und eine praktische Basis, um Chios gemeinsam zu entdecken.", cards: [
      { title: "Zitrusgärten und historisches Ambiente", text: "Alte Anwesen, Steinmauern und viel Grün schaffen eine ruhige Umgebung außerhalb des Stadtzentrums.", image: { src: images.garden, alt: "Ruhiger Zitrusgarten im Voulamandis House" } },
      { title: "Komfortable Zimmer für zwei", text: "Wählen Sie Economy-, Erdgeschoss- oder Obergeschosszimmer passend zu Budget, Zugang und gewünschter Atmosphäre.", image: { src: images.room, alt: "Doppelzimmer für Paare im Voulamandis House" } },
      { title: "Terrassen und ruhige Abende", text: "Außenbereiche und Obergeschosszimmer helfen, nach einem Tag am Strand oder in Chios-Stadt zur Ruhe zu kommen.", image: { src: images.terrace, alt: "Terrasse im Voulamandis House auf Chios" } },
      { title: "Nah an Stadt, Flughafen und Stränden", text: "Kambos liegt praktisch für viele Wege und bleibt dennoch abseits der belebtesten Straßen.", image: { src: images.kambos, alt: "Historisches Kambos auf Chios" } },
    ] },
    stay: { eyebrow: "Zimmerkategorie wählen", title: "Ein Aufenthalt zu zweit passend zu Ihrer Reise", text: "Economy Double ist die preisbewusste Wahl. Erdgeschosszimmer bieten leichten Gartenzugang, Obergeschosszimmer eine hellere Atmosphäre und Terrassenzugang. Gebucht wird eine Zimmerkategorie, keine bestimmte Zimmernummer.", image: { src: images.room, alt: "Zimmerkategorie für Paare auf Chios" }, primaryCta: { label: "Zimmer vergleichen", href: "/de/chios-zimmer/" }, secondaryCta: { label: "Kambos entdecken", href: "/de/chios/kampos-chios/" } },
    finalCta: { title: "Planen Sie Ihre gemeinsame Zeit auf Chios", text: "Prüfen Sie aktuelle Verfügbarkeit und Direktpreise und wählen Sie die Zimmerkategorie, die zu Ihrer Reise zu zweit passt.", primaryCta: { label: "Verfügbarkeit & Preise", href: "/de/hotelpreise-auf-der-insel-chios/" }, secondaryCta: { label: "Unterkunft auf Chios", href: "/de/chios-unterkunft/" } },
  },
  it: {
    locale: "it",
    path: romanticStayPaths.it,
    seo: { title: "Soggiorno romantico a Chios per coppie | Voulamandis House", description: "Soggiorno romantico a Chios per coppie al Voulamandis House di Kambos: agrumeti tranquilli, camere matrimoniali, terrazze e prenotazione diretta.", ogImage: images.hero },
    hero: { eyebrow: "Soggiorno di coppia a Kambos, Chios", title: "Un soggiorno romantico a Chios per due", subtitle: "Giardini tranquilli, il Kambos storico e un’accoglienza più personale per vivere l’isola insieme con calma.", image: { src: images.hero, alt: "Soggiorno romantico per coppie al Voulamandis House a Chios" }, primaryCta: { label: "Vedi le tariffe dirette", href: "/it/prezzi-hotel-chios/" }, secondaryCta: { label: "Vedi camere per due", href: "/it/camere-a-chios/" } },
    intro: { eyebrow: "Il lato più tranquillo di Chios", title: "Per coppie che cercano atmosfera e tranquillità", text: "Voulamandis House è un alloggio a gestione familiare, non un hotel. La posizione tra gli agrumeti di Kambos è adatta a coppie che apprezzano serate tranquille, spazi esterni e collegamenti comodi con città, spiagge e sud dell’isola." },
    reasons: { title: "Perché Kambos è una buona base per una coppia", intro: "Meno rumore, più carattere e una posizione pratica per scoprire Chios insieme.", cards: [
      { title: "Atmosfera tra gli agrumeti", text: "Tenute storiche, muri in pietra e verde creano un ambiente rilassato lontano dal centro più trafficato.", image: { src: images.garden, alt: "Giardino tranquillo al Voulamandis House" } },
      { title: "Camere confortevoli per due", text: "Scegli tra Economy, piano terra e piano superiore in base a budget, accesso e atmosfera preferita.", image: { src: images.room, alt: "Camera doppia per coppie a Chios" } },
      { title: "Terrazze e serate lente", text: "Gli spazi esterni e le camere al piano superiore sono ideali per rilassarsi dopo una giornata sull’isola.", image: { src: images.terrace, alt: "Terrazza al Voulamandis House" } },
      { title: "Vicino a città, aeroporto e spiagge", text: "Kambos consente spostamenti facili mantenendo una base più tranquilla rispetto alle zone più trafficate.", image: { src: images.kambos, alt: "Kambos storico a Chios" } },
    ] },
    stay: { eyebrow: "Scegli la categoria", title: "Un soggiorno di coppia adatto al tuo viaggio", text: "Le Economy Double sono la scelta più conveniente. Il piano terra facilita l’accesso al giardino, mentre il piano superiore offre un’atmosfera più luminosa e l’uso della terrazza. La prenotazione riguarda una categoria, non un numero di camera specifico.", image: { src: images.room, alt: "Categoria di camera per coppie a Chios" }, primaryCta: { label: "Confronta le camere", href: "/it/camere-a-chios/" }, secondaryCta: { label: "Scopri Kambos", href: "/it/chios/kampos-chios/" } },
    finalCta: { title: "Organizza il tuo soggiorno a Chios in coppia", text: "Controlla disponibilità e tariffe dirette e scegli la categoria più adatta al vostro modo di vivere Chios.", primaryCta: { label: "Disponibilità & tariffe", href: "/it/prezzi-hotel-chios/" }, secondaryCta: { label: "Alloggio a Chios", href: "/it/alloggio-chios/" } },
  },
  es: {
    locale: "es",
    path: romanticStayPaths.es,
    seo: { title: "Estancia romántica en Quíos para parejas | Voulamandis House", description: "Estancia romántica en Quíos para parejas en Voulamandis House, Kambos: jardín de cítricos tranquilo, habitaciones dobles, terrazas y reserva directa.", ogImage: images.hero },
    hero: { eyebrow: "Estancia en pareja en Kambos, Quíos", title: "Una estancia romántica en Quíos para dos", subtitle: "Jardines tranquilos, el Kambos histórico y un alojamiento más personal para disfrutar juntos de la isla.", image: { src: images.hero, alt: "Estancia romántica para parejas en Voulamandis House en Quíos" }, primaryCta: { label: "Ver tarifas directas", href: "/es/los-mejores-precios-de-hotel-en-la-isla-chios/" }, secondaryCta: { label: "Ver habitaciones para dos", href: "/es/habitaciones-en-chios/" } },
    intro: { eyebrow: "El lado más tranquilo de Quíos", title: "Para parejas que prefieren ambiente y tranquilidad", text: "Voulamandis House es un alojamiento familiar, no un hotel. Su entorno entre los cítricos de Kambos encaja con parejas que buscan noches tranquilas, espacios exteriores y acceso cómodo a la ciudad, las playas y el sur de la isla." },
    reasons: { title: "Por qué Kambos funciona bien para una escapada en pareja", intro: "Menos ruido, más carácter y una base práctica para descubrir Quíos juntos.", cards: [
      { title: "Ambiente entre cítricos", text: "Fincas históricas, muros de piedra y vegetación crean un entorno tranquilo lejos del centro más concurrido.", image: { src: images.garden, alt: "Jardín tranquilo de Voulamandis House" } },
      { title: "Habitaciones cómodas para dos", text: "Elige Economy, planta baja o planta alta según presupuesto, acceso y el ambiente que prefieras.", image: { src: images.room, alt: "Habitación doble para parejas en Quíos" } },
      { title: "Terrazas y tardes tranquilas", text: "Los espacios exteriores y las habitaciones de planta alta ayudan a bajar el ritmo al volver de explorar la isla.", image: { src: images.terrace, alt: "Terraza de Voulamandis House en Quíos" } },
      { title: "Cerca de ciudad, aeropuerto y playas", text: "Kambos permite moverse con facilidad sin alojarse en las calles más concurridas de la ciudad.", image: { src: images.kambos, alt: "Kambos histórico en Quíos" } },
    ] },
    stay: { eyebrow: "Elige la categoría", title: "Una estancia en pareja adaptada a vuestro viaje", text: "Economy Double es la opción más económica. La planta baja facilita el acceso al jardín y la planta alta ofrece un ambiente más luminoso y acceso a terraza. La reserva se realiza por categoría de habitación, no por un número concreto.", image: { src: images.room, alt: "Categoría de habitación para parejas en Quíos" }, primaryCta: { label: "Comparar habitaciones", href: "/es/habitaciones-en-chios/" }, secondaryCta: { label: "Descubrir Kambos", href: "/es/chios/kampos-chios/" } },
    finalCta: { title: "Organizad vuestra estancia en Quíos", text: "Consulta disponibilidad y tarifas directas y elige la categoría que encaje con vuestro viaje en pareja.", primaryCta: { label: "Disponibilidad & tarifas", href: "/es/los-mejores-precios-de-hotel-en-la-isla-chios/" }, secondaryCta: { label: "Alojamiento en Quíos", href: "/es/alojamiento-chios/" } },
  },
  tr: {
    locale: "tr",
    path: romanticStayPaths.tr,
    seo: { title: "Sakız Adası Romantik Konaklama | Çiftler için Voulamandis House", description: "Sakız Adası’nda çiftler için romantik konaklama: Kambos’taki Voulamandis House’ta sakin narenciye bahçeleri, çift kişilik odalar, teraslar ve direkt rezervasyon.", ogImage: images.hero },
    hero: { eyebrow: "Kambos’ta çiftler için konaklama", title: "Sakız Adası’nda iki kişilik romantik konaklama", subtitle: "Sakin bahçeler, tarihi Kambos ve adayı birlikte keşfettikten sonra dönebileceğiniz daha kişisel bir konaklama deneyimi.", image: { src: images.hero, alt: "Sakız Adası Voulamandis House çiftler için romantik konaklama" }, primaryCta: { label: "Direkt fiyatları görün", href: "/tr/sakiz-adasi-rezervasyon/" }, secondaryCta: { label: "İki kişilik odaları görün", href: "/tr/sakiz-adasi-odalari/" } },
    intro: { eyebrow: "Sakız’ın daha sakin yüzü", title: "Sakinlik ve atmosfer arayan çiftler için", text: "Voulamandis House aile işletmesi bir konaklama tesisidir; otel değildir. Kambos’un narenciye bahçeleri içindeki konumu, sakin akşamlar, açık alanlar ve Sakız merkezine, plajlara ve güney rotalarına kolay ulaşım isteyen çiftlere uygundur." },
    reasons: { title: "Çiftler neden Kambos ve Voulamandis House’u tercih eder", intro: "Daha az gürültü, daha fazla karakter ve Sakız’ı birlikte keşfetmek için pratik bir başlangıç noktası.", cards: [
      { title: "Narenciye bahçeleri atmosferi", text: "Tarihi konaklar, taş duvarlar ve yeşil çevre şehir merkezinden farklı, sakin bir ortam oluşturur.", image: { src: images.garden, alt: "Voulamandis House sakin narenciye bahçesi" } },
      { title: "İki kişi için rahat odalar", text: "Bütçenize, erişim tercihinize ve istediğiniz atmosfere göre Economy, zemin kat veya üst kat kategorilerini seçin.", image: { src: images.room, alt: "Sakız Adası çift kişilik oda" } },
      { title: "Teraslar ve sakin akşamlar", text: "Açık alanlar ve üst kat seçenekleri, ada gezisinden sonra yavaşlamak ve dinlenmek için uygundur.", image: { src: images.terrace, alt: "Voulamandis House terası" } },
      { title: "Merkez, havaalanı ve plajlara yakın", text: "Kambos ana noktalara kolay ulaşım sağlarken şehrin en yoğun sokaklarından uzakta kalır.", image: { src: images.kambos, alt: "Sakız Adası tarihi Kambos" } },
    ] },
    stay: { eyebrow: "Oda kategorinizi seçin", title: "Seyahat tarzınıza uygun çift konaklaması", text: "Ekonomik bir seçim için Economy Double kategorisiyle başlayın. Zemin kat odalar bahçeye kolay erişim, üst kat odalar ise daha aydınlık bir his ve teras erişimi sunar. Rezervasyon belirli oda numarasına değil, oda kategorisine yapılır.", image: { src: images.room, alt: "Sakız Adası çiftler için oda kategorisi" }, primaryCta: { label: "Odaları karşılaştırın", href: "/tr/sakiz-adasi-odalari/" }, secondaryCta: { label: "Kambos’u keşfedin", href: "/tr/chios/kampos-chios/" } },
    finalCta: { title: "Sakız Adası seyahatinizi birlikte planlayın", text: "Güncel müsaitlik ve direkt fiyatları kontrol edin, ardından çift olarak seyahatinize en uygun oda kategorisini seçin.", primaryCta: { label: "Müsaitlik & fiyatlar", href: "/tr/sakiz-adasi-rezervasyon/" }, secondaryCta: { label: "Sakız Adası konaklama", href: "/tr/sakiz-adasi-konaklama/" } },
  },
};

export function getRomanticStayData(locale: RomanticLocale) {
  return romanticStayData[locale];
}
